# ADR-003 — Notification Reliability

| Attribute | Value |
|---|---|
| Status | Accepted, pending PoC evidence |
| Decision date | 14/08/2026 |
| Related items | BR-09; US-19; PoC notification resilience |

## 1. Context

A booking must be stored even when the email provider times out or is unavailable. Sending email directly in the HTTP request creates two dangerous failure modes: a provider failure rolls back the business operation, or the booking commits but the response times out, causing the client to retry and send duplicate notifications.

A notification is a side effect, not the source of truth for a booking. The MVP needs retry, idempotency, and manual recovery without adding a separate message broker.

## 2. Options

### A. Synchronous sending in the request

Rejected because it increases latency and provider coupling, and PostgreSQL cannot commit atomically with an email provider.

### B. Separate message broker

This scales well but was rejected for the MVP because it adds a service, cost, and operational skills that have not been confirmed.

### C. PostgreSQL transactional outbox + worker

Selected because the event and business change commit in the same transaction, it reuses existing infrastructure, and the worker can be separated when scaling.

## 3. Decision

### 3.1 Event creation

The Booking service inserts an outbox record in the same transaction as the business change. A minimum event contains:

- Immutable id.
- event_type, aggregate_type, and aggregate_id.
- recipient_user_id; avoid storing email when it can be resolved at delivery time.
- A versioned payload containing only minimum required data.
- occurred_at, available_at, attempt_count, and status.
- A unique deduplication_key for each business event and channel.

MVP events are booking.requested, booking.confirmed, booking.reschedule_proposed, booking.cancelled, session.reminder_due, and feedback.submitted.

### 3.2 Delivery semantics

- Guarantee **at-least-once processing**; do not claim exactly-once delivery with an external provider.
- A worker claims a batch using a transaction/row lock so multiple workers do not process the same job concurrently.
- The provider adapter receives deduplication_key as an idempotency key when the provider supports it.
- Success records SENT and the provider message ID.
- Temporary failures such as network timeout, connection reset, temporary DNS failure, or temporary SMTP 4xx are retried under the policy below.
- Permanent failures such as authentication failure, invalid recipient, or permanent SMTP 5xx rejection move directly to DEAD without endless retry.
- classifyNotificationError() classifies errors; prefer retry when uncertain because the retry count has a hard limit.
- After at most three attempts (initial attempt + two retries), the job becomes DEAD and appears in the operational queue for administrator/manual resend.

Current R1 retry schedule under BR-09 / AC-19-01:

~~~text
attempt 1 = initial send
→ failure: RETRY at scheduled_for + 1 minute
→ attempt 2 failure: RETRY at scheduled_for + 5 minutes
→ attempt 3 failure: DEAD
~~~

Note: the original ADR used a 1/5/15/60/360-minute pilot policy; the R1 1/5-minute policy supersedes it.

US-22 scheduled reminders, when the extension is enabled, use the same delivery policy.

### 3.3 PII, logging, and templates

- The outbox does not contain meeting secrets, full feedback text, or verification evidence.
- Logs contain event ID, aggregate ID, attempt, and error class; they do not log email bodies or tokens.
- Templates are versioned; user-facing time always includes a timezone.
- Email links use HTTPS and do not contain long-lived credentials in query strings.

### 3.4 Deployment

- A one-instance PoC may run the worker loop in the API process to reduce cost, but the modules and lifecycle must remain separate.
- Staging/production run the API and worker as separate processes/services.
- Only one scheduler creates reminder events; a unique deduplication key prevents duplicate reminders.
- Shutdown stops claiming new jobs and completes or rolls back a currently held job.

## 4. Consequences

- Booking responses do not depend on the email provider.
- Eventual consistency introduces a delay between booking and notification.
- PostgreSQL receives additional outbox traffic, which is acceptable for the pilot.
- Sent-event cleanup/retention and backlog dashboards/metrics are required.
- A recipient may receive a duplicate if the provider processes a request but its response is lost; template design and provider idempotency reduce this risk.

## 5. Metrics and alerts

- Counts of PENDING, RETRY, and DEAD jobs and the age of the oldest job.
- Delivery success rate and attempts per event type.
- Alert when a DEAD job appears, backlog exceeds a threshold, or provider errors increase continuously.
- Business KPIs use booking state; email status must not be used to infer booking success.

## 6. PoC acceptance

| Test | Pass condition |
|---|---|
| Provider timeout | The booking still commits and exactly one outbox event exists |
| Retry | The job follows the retry policy and creates no new booking/transition |
| Duplicate worker | Two workers compete for a job, but only one claims it at a time |
| Duplicate event | deduplication_key prevents two equivalent logical events |
| Permanent failure | After the retry threshold, the job becomes DEAD with an error class and manual action |
| Recovery | When the provider recovers, a retry moves the job to SENT |

The PoC may use a controllable fake provider for timeout/5xx behavior; it does not need to send real email to prove reliability.
