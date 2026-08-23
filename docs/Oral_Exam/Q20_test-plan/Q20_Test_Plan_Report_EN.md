# Q20 Print Report - Test Plan and Execution Evidence

## 1. Document control

| Field | Value |
|---|---|
| Project | Interview Practice Platform (PrepVI) |
| Examination topic | Q20 - Test Plan |
| Examination owner | Hưng |
| Source-code snapshot | `fd8a30b` |
| Local evidence date | 23 August 2026 |
| Execution context | Local repository, Node.js workspaces and local PostgreSQL |
| Documentation basis | Working-tree report prepared from repository snapshot `fd8a30b`; Git history records the later documentation commit |

## 2. Purpose

This Test Plan defines scope, test levels, environments, entry/exit criteria, responsibilities, evidence, defect handling and current gaps. It includes actual local execution evidence but does not claim complete UAT or hosted end-to-end coverage.

A Test Plan states what will be tested and controlled. A test run is evidence for a specific commit and environment. UAT is the Product Owner/user acceptance activity against business criteria; automated test success is not a substitute for UAT.

## 3. Test objectives and scope

The plan covers:

- identity, session and role/object authorization;
- Question Bank, practice progress and moderation;
- JD intake, extraction/OCR, correction, analysis, matching and plans;
- Mentor verification, expertise and availability;
- booking concurrency, state transitions and context privacy;
- controlled meeting-link access and recovery;
- feedback, review, notification, operations and audit;
- Gemini feature controls, validation and deterministic fallback;
- OpenAPI contract, migrations, seeds, build and secret handling.

## 4. Test levels and techniques

| Level | Purpose | Current evidence |
|---|---|---|
| Unit | Isolate domain policies and utilities | Matcher, booking validation, idempotency, retry, environment and frontend policy tests |
| Integration | Verify API/module/database interaction | Mentor integration, real-PostgreSQL question regression, status and error behavior |
| Contract and quality gates | Detect drift and delivery defects | OpenAPI drift, migration replay, seed verification, lint, typecheck and build |
| Manual end-to-end | Verify persona journeys, failures and recovery | Student/Mentor/Admin walkthrough specification |
| User Acceptance Testing | Product Owner and representative users validate AC/value | Planned; complete retained story-by-story evidence is not present |

Positive, negative, boundary, authorization, concurrency, provider-failure and recovery scenarios are required for risk-critical flows.

## 5. Environment and test data

| Environment | Use | Data/control |
|---|---|---|
| Local | Unit, integration and manual development checks | PostgreSQL and Mailpit; reference/demo seeds |
| GitHub Actions CI | Reproducible quality gates | PostgreSQL 17 service and reference seed |
| Hosted demo | Frontend/API smoke checks | Render/Supabase; background worker is currently absent |

Demo/load seeds are prohibited in production. Evidence must not contain passwords, tokens, raw private JD text, meeting links, Mentor evidence or private session notes.

## 6. Risk-based test matrix

| Area | Main flow | Required negative/boundary coverage |
|---|---|---|
| Identity | register, verify, login/logout/reset | stale sessions, rate limits, role/object denial and non-disclosure |
| JD | upload/paste, extract, confirm, analyze, match, plan | corrupt/encrypted/oversized/empty files, timeout, retry and fallback |
| Mentor | onboarding, approval, slots | unapproved access, past/overlapping slots and expertise mismatch |
| Booking | context, Mentor, slot, transition | wrong owner/version/topics, double submit and one concurrency winner |
| Session | meeting link and recovery | outsider access, invalid window, missing/broken link and expired recovery |
| Feedback/review | completion, feedback, action, review | duplicates, dispute and publication timing |
| Operations | case, impact, action, audit | invalid action, missing reason, stale version and duplicate request |
| Gemini | analysis, explanation and drafts | disabled, timeout, quota, invalid output/reference and rule fallback |

## 7. Entry and exit criteria

### Entry criteria

- The target commit and acceptance criteria are known.
- Dependencies, PostgreSQL, migrations and required seeds are ready.
- Expected results and test data are defined.
- Evidence collection is configured without secrets/private data.

### Exit criteria

- Applicable unit/integration checks pass.
- Lint, typecheck, OpenAPI, migration, seed and build gates pass with warnings recorded.
- Required persona walkthroughs pass.
- No Critical/High defect remains.
- Applicable AC has retained evidence and Product Owner acceptance.
- Provider/environment failures have a documented safe recovery path.

These are proposed release gates. They are not reported as achieved without retained evidence.

## 8. Executed automated test evidence

The first local execution was attempted without PostgreSQL. Frontend tests passed, but the database-dependent question regression suite encountered `ECONNREFUSED` on port 5432. This was classified as an unmet environment precondition, not a product pass.

PostgreSQL was then started, local migrations were confirmed and `npm test` was rerun.

![Local Vitest result](img/Q20-01-test-results.png)

**Figure Q20-01.** Successful local rerun: 4/4 frontend test files with 10/10 tests, and 10/10 backend test files with 35/35 tests. Total: 45/45 tests, exit code 0.

The backend set includes matcher, idempotency, retry, environment, database adapter, booking validation, error/status, Mentor integration and real-PostgreSQL question regression tests. The frontend set includes API client, booking request, reschedule and operation-reason policies.

## 9. Executed quality-gate evidence

![Local release checks](img/Q20-02-quality-gates.png)

**Figure Q20-02.** Local release checks at the reviewed snapshot.

| Check | Result | Qualification |
|---|---|---|
| ESLint | Pass | 0 errors and 37 `no-console` warnings |
| TypeScript typecheck | Pass | `tsc --noEmit` |
| OpenAPI generated-type drift | Pass | No generated client diff |
| Reference seed verification | Pass | Relevant invalid/orphan/duplicate counters were zero |
| Frontend/backend build | Pass | Vite emitted a chunk-size warning; backend validation passed |

Warnings remain quality information and must not be hidden by a generic pass label.

## 10. CI evidence and automation gap

![Current GitHub Actions coverage](img/Q20-03-ci-coverage-gap.png)

**Figure Q20-03.** The repository contains Vitest suites, but `.github/workflows/ci.yml` does not run `npm test`, coverage or browser E2E tests.

![Successful CI and secret scan](../Q17_monitoring-and-control/img/Q17-06-ci-success-no-leaks.png)

**Figure Q20-04.** GitHub Actions run `32390206781` shows successful `quality` and `secret-scan` jobs. It proves the displayed workflow result only; it is not CI test-suite execution evidence.

## 11. Manual validation and UAT

Manual walkthroughs must cover Student, Mentor and Administrator journeys, including loading/empty states, invalid input, permission denial, version/slot conflicts, provider failure, offline recovery and duplicate prevention. Each release candidate should retain:

- commit, time, environment and tester/reviewer;
- passed/failed steps and screenshots;
- safe correlation IDs;
- relevant database/audit/job/outbox state;
- open defects and severity; and
- the final Product Owner/reviewer decision.

The repository provides the walkthrough specification but not a complete retained UAT package for every Must story. Therefore no full R1 acceptance claim is made.

## 12. Defect handling

| Severity | Meaning | Release action |
|---|---|---|
| Critical | Security/data loss or core system unavailable with no safe workaround | Block release immediately |
| High | Required flow fails or authorization/consistency is unsafe | Block release |
| Medium | Important behavior fails with a safe workaround | Record, prioritize and obtain release decision |
| Low | Minor usability/documentation issue | Record and schedule |

Every defect must include steps, expected/actual result, environment, safe evidence, owner and final verification. Credentials and private payloads must be redacted.

## 13. Current gaps and recommendations

- Add `npm test` to CI only after the team agrees the PostgreSQL setup and runtime budget.
- Add coverage reporting only with meaningful module-level targets; no coverage percentage is currently claimed.
- Add browser E2E automation for critical flows when authorized; manual walkthroughs remain required for UAT.
- Deploy or explicitly replace the background worker before claiming hosted OCR/outbox/reminder coverage.
- Retain a story/AC-indexed UAT evidence package.
- Resolve or accept the 37 lint warnings and Vite chunk warning through a recorded decision.

## 14. Source artifacts

- [Manual Validation and Operations](../../Implementation/Manual_Validation_and_Operations.md)
- [GitHub Actions workflow](../../../.github/workflows/ci.yml)
- [Backend tests](../../../backend/tests/)
- [Frontend tests](../../../frontend/tests/)
- [Product Backlog and Acceptance Criteria](../../Project_Vision_and_Scope/Product_Backlog_and_Acceptance_Criteria.md)

## 15. Final print checks

- [ ] Record the human reviewer name separately if required by the examiner.
- [ ] Keep local test evidence separate from CI evidence.
- [ ] Keep UAT status and worker limitation visible.
- [ ] Print all four figures with their captions.
- [ ] Do not include credentials, private JD content, meeting links or personal data.
