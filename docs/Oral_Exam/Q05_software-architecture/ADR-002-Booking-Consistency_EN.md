# ADR-002 — Booking Consistency and Double-Booking Prevention

| Attribute | Value |
|---|---|
| Status | Accepted, pending PoC evidence |
| Decision date | 14/08/2026 |
| Related items | BR-02, BR-08; US-11, US-12, US-13; architecture validation scenario: Booking consistency |

## 1. Context

Two or more requests may concurrently try to confirm bookings for the same availability slot. Checking “slot available” in the application and updating it later creates a race condition. Notifications or client retries may also cause a transition to be executed more than once.

Required invariants:

- A slot may have at most one booking in a slot-occupying state.
- Booking transitions must go through a single state machine and have an audit trail.
- Retrying the same request must not create duplicate transitions or outbox events.
- A notification failure must not roll back a committed booking.

## 2. Options

### A. Application check only

Read the slot and update the booking if it is available. Rejected because two transactions may read the same old state and both confirm.

### B. Distributed/Redis lock

Rejected for the MVP because it adds infrastructure, failure modes, and cost; the database would still need a constraint to protect the data.

### C. SERIALIZABLE isolation only

This can protect the invariant but requires general retry handling and creates unnecessary overhead for every transaction. It was not selected as the sole mechanism.

### D. PostgreSQL transaction + row lock + database constraint

Selected because PostgreSQL is already the source of truth, locks are limited to the relevant slot/booking, and a unique partial index provides the final protection layer.

## 3. Decision

### 3.1 Slot-occupying states

The slot-occupying states are CONFIRMED, COMPLETED, and NO_SHOW. PENDING, REJECTED, and CANCELLED do not occupy a slot. RESCHEDULE_PROPOSED does not occupy the new slot until the proposal is accepted within a transaction.

The database migration must create an equivalent constraint:

~~~sql
CREATE UNIQUE INDEX ux_booking_occupied_slot
ON bookings (slot_id)
WHERE state IN ('CONFIRMED', 'COMPLETED', 'NO_SHOW');
~~~

If NO_SHOW is not available in the PoC, the index must still cover at least CONFIRMED and COMPLETED.

### 3.2 Confirmation transaction

The API POST /api/v1/bookings/:id/transitions accepts the CONFIRM action and an Idempotency-Key.

Within one database transaction:

1. Lock the booking and availability slot with SELECT ... FOR UPDATE in a fixed order: slot first, booking second.
2. Verify that the actor is the mentor who owns the booking, the booking is in an allowed state, and the slot is not occupied.
3. Update the booking with an old-state condition; return a conflict if the affected row count is zero.
4. Update the slot to BOOKED.
5. Insert booking_transitions with from/to states, actor, reason, and timestamp.
6. Insert the notification event into the outbox with a unique event key.
7. Commit; return CONFIRMED only after the commit.

The unique index is the final guard if the application check or lock is incorrect. An invariant violation returns HTTP 409 with code BOOKING_SLOT_CONFLICT; it must not expose the raw database error.

### 3.3 Idempotency and retry

- Use a unique constraint on (actor_id, idempotency_key, operation), or an equivalent request record.
- The same key and payload return the stored result.
- The same key with a different payload returns 409 IDEMPOTENCY_KEY_REUSED.
- Retry the entire transaction at most twice for classified serialization/deadlock errors; do not retry validation, authorization, or unique conflicts.

### 3.4 Rescheduling

Accepting a new time must lock both the old and new slots in a stable ID order, validate the new slot, move the booking, and release/consume the slots within one transaction. Do not update the two slots in separate requests.

## 4. Consequences

- Correctness does not depend on one API instance or an in-memory mutex.
- Lock contention is concentrated only on the same slot.
- Integration tests must use real PostgreSQL; a mock database cannot prove concurrency behavior.
- Raw SQL migration is a configuration item and must be reviewed with the code.
- Every code path that changes booking state must call the Booking state-machine service; administrators must not update the table directly.

## 5. PoC acceptance

| Test | Pass condition |
|---|---|
| Concurrent confirmation | At least 20 requests target the same slot; exactly one booking becomes CONFIRMED and the others receive 409 or an idempotent result |
| Side effects | Exactly one logical confirmation transition and one logical outbox event are created |
| Retry | Reusing the same idempotency key creates no new record |
| Authorization | Another mentor or a student cannot confirm the booking |
| Invalid transition | CANCELLED → CONFIRMED is blocked with a stable error code |
| Reschedule race | If two bookings compete for a new slot, only one booking occupies it |

The PoC report must record request count, HTTP results, the invariant-verification query, and correlation-ID logs; a UI screenshot alone is insufficient.

## 6. Sources

- PostgreSQL transaction isolation: https://www.postgresql.org/docs/current/transaction-iso.html
- PostgreSQL explicit/row locking: https://www.postgresql.org/docs/current/explicit-locking.html
- PostgreSQL partial indexes: https://www.postgresql.org/docs/current/indexes-partial.html
