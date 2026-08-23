# PrepVI R1 — Manual Validation and Operations

## 1. Current status

This guide explains local setup and manual release checks. It is not proof of a working Continuous Delivery pipeline or a real staging/pilot deployment.

The repository has:

- GitHub Actions CI for install, lint, type check, OpenAPI drift, migration replay, reference-seed checks, build, and secret scan;
- npm scripts, database migrations and seeds;
- local PostgreSQL and Mailpit in Docker Compose;
- environment examples and health/readiness endpoints; and
- manual validation steps.

The repository does not have:

- a deployment workflow or deployment script;
- a versioned deployment artifact;
- provider-specific deployment files;
- a protected staging or production environment;
- a deployed URL or deployment log; or
- a deployment result email.

Vercel, Render, and Neon are proposed in the architecture. The repository does not prove that the team selected or configured them.

## 2. Local release-candidate setup

1. Record the full Git commit SHA.
2. Run `npm ci`.
3. Copy `.env.example` to the local environment file.
4. Set strong `SESSION_SECRET`, `CSRF_SECRET`, and `DEMO_SEED_PASSWORD` values. Do not store or print real secrets.
5. Run `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build`.
6. Start PostgreSQL and Mailpit with `npm run db:start`.
7. Run:

   ```text
   npm run db:migrate
   npm run db:seed:reference
   npm run db:seed:verify
   ```

8. Start the API, worker, and frontend.
9. Check `/api/v1/health`, `/api/v1/readiness`, and Mailpit.
10. Complete the required user walkthroughs and record the result.

The migration order is:

```text
001_r1_foundation
→ 002_complete_r1_flows
→ 003_dashboard_and_reminders
→ 004_question_bulk_import
→ 005_gemini_ai_assistance
→ 006_ai_private_draft_inputs
→ 007_ai_operations
→ 008 migrations in repository order
```

Demo/load seeds require `ALLOW_NON_PRODUCTION_SEED=true`. Never run them in production. Never point `db:reset` at a shared or production database.

## 3. Required evidence

For each release candidate, record:

- commit SHA and test date;
- tester/reviewer name;
- passed and failed steps;
- screenshots without secrets or private data;
- safe correlation IDs;
- relevant database, audit, job, and outbox status;
- open defects and their severity; and
- final reviewer decision.

Do not store passwords, tokens, raw JD text, meeting links, Mentor evidence, or private session notes in the evidence package.

## 4. Main walkthroughs

### Student

- Register, verify email, log in, log out, and reset the password.
- Update the profile and check stale-version handling.
- Browse questions, bookmark them, and update practice status.
- Submit pasted text and supported JD files. Check invalid type, size, page count, encrypted, corrupt, and empty files.
- Correct extracted text, analyse requirements, review mappings, and create a real preparation plan.
- Book an approved Mentor slot and test confirm, reject, reschedule, cancel, meeting link, complete, feedback, and review.
- Check dashboard values and reminder behaviour when enabled.

### Mentor

- Complete profile, expertise, consent, and verification.
- Confirm that the profile and slots are hidden before approval.
- Create slots and reject past or overlapping times.
- Review only the allowed JD/plan context.
- Check that only one request can win the same slot.
- Add or replace an HTTPS meeting link.
- Complete a session and submit one structured feedback record.

### Administrator

- Review Mentor evidence using the protected signed link.
- Approve or reject with a reason and version check.
- Moderate questions through the allowed states.
- Handle failed extraction/notification, meeting-link failure, no-show, dispute, and review cases.
- Check impact preview, allowed actions, idempotency, version, reason, and audit records.
- Preview a mixed CSV, download row errors, and import only valid rows.
- Check AI job retry and feature-disable controls when Gemini is enabled.

## 5. Gemini checks

Run once with all AI flags disabled and once with the required flag enabled.

- Every generated requirement must use an exact evidence span and active taxonomy topic.
- Prompt-injection text must be treated as data.
- Low-confidence requirements must wait for user review.
- Gemini must not add unknown Question, Mentor, or topic IDs.
- Gemini explanations must not change deterministic score or order.
- Timeout, rate limit, provider error, invalid JSON, and invalid reference must use bounded retry and safe fallback.
- Private draft input must be encrypted and deleted after success, final fallback, or expiry.
- Logs and support data must not contain raw prompts or private input.

## 6. Failure and recovery

| Situation                | User action                               | Operator evidence                             |
| ------------------------ | ----------------------------------------- | --------------------------------------------- |
| Invalid field/file       | Correct and submit again                  | Safe error code and correlation ID            |
| Version or slot conflict | Reload or choose another slot             | Resource versions and one booking winner      |
| Rate limit               | Wait for the shown time                   | Rate-limit event without credentials          |
| Extraction failure       | Retry twice, then paste/re-upload         | Attempts, case, and file retention status     |
| SMTP failure             | Keep saved business state and retry email | Outbox attempts and final status              |
| Meeting-link failure     | Replace link or reschedule                | Case reference without the link value         |
| Offline                  | Reconnect and retry safely                | No duplicate resource                         |
| Gemini failure           | Use rule-based or manual flow             | Safe error, fallback flag, and case reference |

## 7. Release gates

- Reference seed can run twice without changing checksums or counts.
- Demo/load seed is blocked in production.
- Seed verification finds no invalid published question, duplicate alias, or orphan classification.
- Required Student, Mentor, and Administrator walkthroughs pass.
- JD recall is at least 80% and precision@10 is at least 80% on the agreed set.
- Product Owner accepts the required story criteria.
- No Critical/High defect remains.
- Backup, migration dry run, forward-fix plan, and restore drill are recorded before pilot data migration.
- Required recovery targets are RPO ≤24 hours and RTO ≤4 hours.

Monitor latency, error rate, extraction queue, empty mappings, booking conflicts, dead outbox messages, unauthorised access, and retention cleanup. Do not use direct database edits as a normal operation.

## 8. Information needed for a real deployment guide

Before the team can claim Continuous Delivery, it must agree on:

1. frontend, API, worker, database, storage, and email providers;
2. account, environment, domain, and secret owners;
3. deployment trigger and approval rules;
4. artifact naming and versioning;
5. same-origin `/api` routing;
6. migration lock, backup, and forward-fix steps;
7. smoke/UAT gates and rollback conditions; and
8. monitoring and deployment notification channel.

The first real deployment must record the environment, commit SHA, run ID, time, gate results, approver, deployed URL, and a redacted deployment notification.
