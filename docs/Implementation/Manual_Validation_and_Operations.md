# PrepVI R1 manual validation and operations

Automated-test implementation is intentionally outside this R1 release scope. Every release candidate must instead complete the following walkthroughs and attach screenshots, safe correlation IDs, database/audit/outbox observations, and the reviewer decision to the increment evidence.

## Environment bootstrap

1. Copy `.env.example` and set strong `SESSION_SECRET`, `CSRF_SECRET`, `DEMO_SEED_PASSWORD`, and `ALLOW_NON_PRODUCTION_SEED=true` locally.
2. Start PostgreSQL and Mailpit, then run migration → reference seed → demo seed → seed verify.
3. Start API, worker, and frontend as separate processes. Confirm `/api/v1/health`, `/api/v1/readiness`, and Mailpit.
4. Use the three demo personas. Retrieve the password from the operator who set `DEMO_SEED_PASSWORD`; never copy it into evidence.

The expected migration chain for a new database is `001_r1_foundation → 002_complete_r1_flows → 003_dashboard_and_reminders → 004_question_bulk_import → 005_gemini_ai_assistance → 006_ai_private_draft_inputs → 007_ai_operations`. Keep `OPENAPI_VALIDATION=true` so the walkthrough covers both request and response contract enforcement.

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
8. Inspect the real Student dashboard aggregates, then confirm 24-hour/1-hour reminders are deduplicated, cancelled on schedule change, and skipped when their milestone has already passed.

### Mentor

1. Complete onboarding, profile/expertise, consent, and verification upload. Confirm profile/slot are not public before approval.
2. After Admin approval, create slots in several timezones. Try past and overlapping slots and follow the field recovery instructions.
3. Review booking context: only corrected text, topics/question groups, and goal may be visible.
4. Confirm one of two competing requests for one slot; only one transaction may win. Exercise reject/reschedule and verify the old slot remains held until the proposal resolves.
5. Create/update an HTTPS meeting link before the two-hour cutoff. Resolve a broken-link report within 15 minutes or leave it for operations/reschedule.
6. Complete only after the end time and submit exactly one structured feedback.
7. With Gemini flags enabled, create an agenda draft from a confirmed booking, edit it, and explicitly mark it used. After completion, enter non-sensitive session notes, generate a feedback draft, apply it only to untouched fields, edit/save it, then submit the official feedback once.

### Admin

1. Review Mentor evidence through the Admin-only five-minute signed link; approve/reject with reason and stale-version check.
2. Moderate `DRAFT → IN_REVIEW → PUBLISHED → ARCHIVED`; verify invalid provenance/taxonomy cannot publish.
3. Process failed extraction/notification, link failure, late change, no-show, dispute, and review moderation cases.
4. Before every action, inspect impact preview. Verify only allowlisted actions appear, reason/idempotency/version are required, and no arbitrary state setter exists.
5. Inspect audit records. Confirm password/token/JD text/meeting link/evidence never appears in errors, support details, logs, or audit metadata.
6. Preview a mixed valid/invalid RFC 4180 CSV, filter row errors, download the error CSV, then commit only valid rows into `DRAFT`.
7. Process an `AI_JOB_FAILED` case. Verify impact preview and safe job metadata, retry without changing business state, then create another case and disable only its feature. Confirm pending jobs of the same kind are cancelled, new jobs are blocked, and deterministic/manual flows remain available.

## Gemini hybrid walkthrough

Run the following once with every AI flag `false`, then again with the intended feature enabled and `GEMINI_MODEL=gemini-3.5-flash-lite`. Never paste an API key into screenshots, logs or evidence.

1. Submit Vietnamese, English and mixed-language JDs. Confirm every Gemini requirement includes an exact evidence span and only an active taxonomy topic.
2. Embed prompt-injection text in the JD and Mentor session notes. Confirm it is treated as untrusted data and does not add unknown topic, Question or Mentor IDs.
3. Confirm requirements below confidence `0.75` block matching until Student selects accept, edit or unmapped. Matching remains `40/30/15/15`, threshold `60`, with deterministic tie-break.
4. Generate Question/Mentor explanations. Confirm all candidate IDs already belong to the hard-filtered set, score/order are unchanged, and UI labels deterministic reason separately from Gemini explanation.
5. Simulate timeout, `429`, provider `503`, invalid JSON/schema and invalid evidence/candidate references. Confirm retry is bounded, final failure uses fallback or creates an operation case, and support details contain no raw input.
6. Confirm feedback session notes exist only as encrypted `ai_job_private_inputs`, are deleted after success/final fallback, and are removed by the 24-hour retention cleanup if abandoned.
7. Confirm another Student/Mentor cannot read an AI job or draft outside their owned JD/plan/booking.
8. Record prompt/schema/model version, latency, token counts, fallback status, correlation ID and safe operation reference. Do not record raw prompt/response.

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
| Gemini unavailable/invalid output | Continue through rule-based analysis, deterministic reasons or manual form | AI job attempts, safe error code, fallback flag and operation case reference |
| AI draft input expires | Re-enter non-sensitive session notes or continue manually | Encrypted input deletion; no notes in log/support details |
| AI feature disabled by Admin | Continue deterministic/manual flow | Impact preview, required reason, feature control version and immutable audit |

## Seed and release gates

- Run reference seed twice and confirm checksum/counts do not change.
- Confirm demo/load fail with `NODE_ENV=production` and without `ALLOW_NON_PRODUCTION_SEED=true`.
- Confirm `db:seed:verify` reports zero invalid published questions, duplicate aliases, and orphan classifications.
- Confirm `db:seed:verify` also reports four AI feature controls, zero expired private AI inputs, invalid AI explanations and invalid AI draft/job relations.
- On staging, load seed must report exactly 1,000 load questions, 100 load mentors, 1,000 load slots, and 500 load bookings.
- Capture JD corpus recall ≥80%, precision@10 ≥80%, deterministic result hash, non-OCR p95 ≤3s, and OCR p95 ≤45s.
- Before pilot migration: backup, dry-run on a copy, document forward-fix, and perform restore drill. Pilot runs reference seed only.
- Product Owner accepts all 30 story AC; no Critical/High defect; concurrency, RPO ≤24h, and RTO ≤4h evidence is attached.

Operational dashboards should monitor latency/error rate, extraction queue depth, empty mapping rate, booking conflicts, outbox `DEAD`, unauthorized access, and retention cleanup. Direct database edits are not an operational action.
