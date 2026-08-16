# PrepVI R1 manual validation and operations

Automated-test implementation is intentionally outside this R1 release scope. Every release candidate must instead complete the following walkthroughs and attach screenshots, safe correlation IDs, database/audit/outbox observations, and the reviewer decision to the increment evidence.

## Environment bootstrap

1. Copy `.env.example` and set strong `SESSION_SECRET`, `CSRF_SECRET`, `DEMO_SEED_PASSWORD`, and `ALLOW_NON_PRODUCTION_SEED=true` locally.
2. Start PostgreSQL and Mailpit, then run migration → reference seed → demo seed → seed verify.
3. Start API, worker, and frontend as separate processes. Confirm `/api/v1/health`, `/api/v1/readiness`, and Mailpit.
4. Use the three demo personas. Retrieve the password from the operator who set `DEMO_SEED_PASSWORD`; never copy it into evidence.

If Docker Desktop is stopped, start it manually and rerun `npm run db:start`. If port 5432/1025/8025 is occupied, identify the owning local process and either stop it or change the local-only port mapping plus connection variables. Do not point `db:reset` at Neon.

## Persona walkthroughs

### Student

1. Register, verify through Mailpit, login, logout, forgot/reset, and confirm old sessions are revoked.
2. Update Student goal/profile and deliberately submit a stale `version`; verify `VERSION_CONFLICT` instructs reload.
3. Browse/filter questions. Toggle bookmark/practice, simulate offline, and verify optimistic state rolls back.
4. Submit pasted JD; separately upload valid PDF, scanned PDF/image, invalid MIME, >10 MB, encrypted/corrupt/empty files, and a PDF over five pages.
5. Observe polling and duplicate-submit protection. Retry failed extraction or paste text manually; verify the original private object is removed after success or by retention.
6. Edit and confirm corrected text. Analyze, map an unmapped requirement, inspect evidence and `analysisVersion`, match, select up to ten questions, and create a real-ID plan.
7. Select an approved Mentor slot. Confirm the booking references the Student-owned JD/plan, then exercise pending, confirmed, reschedule, cancel, link failure, completed, feedback apply, and review.

### Mentor

1. Complete onboarding, profile/expertise, consent, and verification upload. Confirm profile/slot are not public before approval.
2. After Admin approval, create slots in several timezones. Try past and overlapping slots and follow the field recovery instructions.
3. Review booking context: only corrected text, topics/question groups, and goal may be visible.
4. Confirm one of two competing requests for one slot; only one transaction may win. Exercise reject/reschedule and verify the old slot remains held until the proposal resolves.
5. Create/update an HTTPS meeting link before the two-hour cutoff. Resolve a broken-link report within 15 minutes or leave it for operations/reschedule.
6. Complete only after the end time and submit exactly one structured feedback.

### Admin

1. Review Mentor evidence through the Admin-only five-minute signed link; approve/reject with reason and stale-version check.
2. Moderate `DRAFT → IN_REVIEW → PUBLISHED → ARCHIVED`; verify invalid provenance/taxonomy cannot publish.
3. Process failed extraction/notification, link failure, late change, no-show, dispute, and review moderation cases.
4. Before every action, inspect impact preview. Verify only allowlisted actions appear, reason/idempotency/version are required, and no arbitrary state setter exists.
5. Inspect audit records. Confirm password/token/JD text/meeting link/evidence never appears in errors, support details, logs, or audit metadata.

## Failure and recovery matrix

| Situation | User recovery | Operator evidence |
| --- | --- | --- |
| Invalid field/file | Correct the named field, re-upload, or paste text | Error code + correlation ID, never request body |
| `409` version/slot conflict | Reload latest resource or select another slot | Competing resource versions; exactly one booking winner |
| `429` | Wait the displayed seconds | Rate-limit event without credentials |
| Extraction failure | Safe retry twice, then paste/re-upload | Job attempts, operation case, private-file retention |
| SMTP failure after commit | In-app state remains valid; wait/retry | Outbox attempts at 1/5 minutes, then `DEAD` case |
| Meeting link failure | Mentor replaces within 15 minutes, otherwise reschedule/case | Case reference; never record the link |
| Late cancel/reschedule/no-show | Wait for audited Admin decision | Impact preview, required reason, transition and audit |
| Offline | Reconnect and explicitly retry idempotent requests | No duplicate mutation/resource |

## Seed and release gates

- Run reference seed twice and confirm checksum/counts do not change.
- Confirm demo/load fail with `APP_ENV=pilot` and without `ALLOW_NON_PRODUCTION_SEED=true`.
- Confirm `db:seed:verify` reports zero invalid published questions, duplicate aliases, and orphan classifications.
- On staging, load seed must report exactly 1,000 load questions, 100 load mentors, 1,000 load slots, and 500 load bookings.
- Capture JD corpus recall ≥80%, precision@10 ≥80%, deterministic result hash, non-OCR p95 ≤3s, and OCR p95 ≤45s.
- Before pilot migration: backup, dry-run on a copy, document forward-fix, and perform restore drill. Pilot runs reference seed only.
- Product Owner accepts all 27 story AC; no Critical/High defect; concurrency, RPO ≤24h, and RTO ≤4h evidence is attached.

Operational dashboards should monitor latency/error rate, extraction queue depth, empty mapping rate, booking conflicts, outbox `DEAD`, unauthorized access, and retention cleanup. Direct database edits are not an operational action.
