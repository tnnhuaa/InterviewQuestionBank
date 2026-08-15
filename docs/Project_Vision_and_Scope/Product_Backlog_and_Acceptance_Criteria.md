# Interview Practice Platform — Product Backlog and Acceptance Criteria

## 1. Purpose

This document converts the approved product scope and target workflow into an ordered, testable Product Backlog. It defines user stories, priorities, dependencies, Story Points, acceptance criteria, quality requirements, traceability and release controls. A comprehensive backlog and value-first Product Owner ordering are required by [Scrum, Slides 014–015](https://github.com/tnnhuaa/InterviewQuestionBank/blob/05ff4b99ae133de9b0f7c2f0de3585390b933718/docs/refs/04-02-scrum-development-process.md#slide-014--the-product-backlog).

### 1.1 Release boundary

| Scope | Decision |
|---|---|
| R1 Must | Authentication/RBAC, Question Bank, mentor profile/verification/availability, booking and exception handling, external meeting-link handoff, feedback/review, minimal administration and reliable booking notifications |
| R1 Stretch | Basic progress dashboard and scheduled session reminders |
| Future | Bulk Question import, AI interviewer/scoring, built-in video/recording/transcription, automated payment/payout, native mobile, ATS and ML recommendations |

### 1.2 Business rules

Business rules use stable IDs and remain traceable to user stories and acceptance criteria as required by [User Requirements, Slide 007](https://github.com/tnnhuaa/InterviewQuestionBank/blob/05ff4b99ae133de9b0f7c2f0de3585390b933718/docs/refs/03-2-user-requirements.md#slide-007--business-rules).

| ID | Rule |
|---|---|
| BR-01 | Only an `Approved` Mentor may publish a profile/slot and receive a booking. |
| BR-02 | A slot may be owned by at most one booking in an occupying state. Occupying states are `Confirmed`, `Completed` and, when policy permits, `NoShow`; a confirmed booking retains its old slot while reschedule is unresolved. |
| BR-03 | A booking requires an available slot, target position/interview type and a meaningful goal. |
| BR-04 | Only the Student/Mentor belonging to a booking and an authorized Admin may access its private booking data, meeting link or feedback. |
| BR-05 | Feedback can be created only after the booking is `Completed`, by the authorized Mentor. |
| BR-06 | The booking Student may create at most one review after a valid `Completed` booking. |
| BR-07 | A Question is public only when `Published` and has valid taxonomy and provenance. |
| BR-08 | Every booking transition uses one canonical state-machine service and records from/to state, actor, reason when required and timestamp. |
| BR-09 | Notification failure never rolls back or controls booking state. The internal booking state is authoritative; notification uses retry, deduplication and an operable failure state. |
| BR-10 | Create-booking and critical transitions are retry-safe. Reusing an idempotency key with the same request returns the original result; a different request returns a stable conflict without duplicate transitions/events. |
| BR-11 | Meeting links, verification evidence, feedback and private profile data are not public or logged in full; retention and deletion follow the approved privacy policy. |

### 1.3 Booking-state vocabulary

| Business state | API/storage token | Slot occupancy | Meaning |
|---|---|---|---|
| Pending | `PENDING` | No | Student request awaits Mentor decision |
| Confirmed | `CONFIRMED` | Yes | Mentor accepted and the slot is reserved |
| Reschedule proposed | `RESCHEDULE_PROPOSED` | New slot: no; old confirmed slot: retained until resolution | The other party must accept/reject the proposal |
| Rejected | `REJECTED` | No | Mentor rejected the current request |
| Cancelled | `CANCELLED` | No | Authorized cancellation completed under policy |
| Completed | `COMPLETED` | Yes, as historical ownership of that slot | Session occurred and completion was recorded |
| No-show | `NO_SHOW` | Yes, conditional | Attendance exception; enabled only after authority and evidence policy are approved |

UI labels may be localized, but contracts, tests and documents must map to these semantic states.

## 2. Product Backlog

The backlog is ordered by value and dependency. R1 contains 20 Must stories; US-21–US-22 are Stretch and US-23 is Future. Story Points are relative size estimates, not hours, and must be confirmed by the Development Team during refinement.

| Order | ID | Epic | User story | Value / objective | Release | Dependencies | Trace | SP | Readiness/status |
|---:|---|---|---|---|---|---|---|---:|---|
| 1 | US-01 | Identity | As a user, I want to register and sign in so my personal data is protected. | Foundation/privacy | R1 Must | — | RQ-01; BR-04/11; FS-01 | 8 | High-risk session and verification slice |
| 2 | US-02 | Identity | As an Admin, I want Student/Mentor/Admin roles enforced so functions and data are appropriately restricted. | Security invariant | R1 Must | US-01 | RQ-01; BR-04 | 3 | Role matrix on the authentication foundation |
| 3 | US-18 | Content admin | As an Admin, I want to manage/moderate Questions and taxonomy so only governed content is published. | Question supply prerequisite | R1 Must | US-02 | RQ-03/10; BR-07/08; A03 | 5 | Multi-state content administration |
| 4 | US-03 | Student | As a Student, I want to save my target position and interview goal so practice and booking use the same context. | OBJ-02/03; activation | R1 Must | US-01 | RQ-02; BR-03; FS-01/S01 | 2 | Small profile persistence slice |
| 5 | US-04 | Questions | As a Student, I want to browse/search/filter governed Questions so I can find relevant practice content quickly. | OBJ-02; acquisition | R1 Must | US-02, US-18 | RQ-03; BR-07; FS-02/S02 | 5 | Filter, pagination and visibility rules |
| 6 | US-05 | Questions | As a Student, I want Question detail and answer criteria so I know what a good response should cover. | OBJ-02; self-practice | R1 Must | US-04 | RQ-03; BR-07; FS-02/S03 | 2 | Read-only detail on the Question model |
| 7 | US-06 | Practice | As a Student, I want to bookmark and track practice state so I can resume and act on feedback. | OBJ-02/06; retention | R1 Must | US-04 | RQ-03; BR-04; FS-03/11 | 3 | Per-user practice state and authorization |
| 8 | US-07 | Mentor | As a Mentor, I want to create a profile and submit verification so I can offer a trusted service. | OBJ-03; supply | R1 Must | US-01 | RQ-04; BR-01/11; FS-04/M01-M03 | 5 | Profile and verification lifecycle |
| 9 | US-08 | Mentor admin | As an Admin, I want to approve/reject Mentor verification with a reason so public supply is governed. | Trust/supply gate | R1 Must | US-02, US-07 | RQ-04; BR-01/08; A02 | 3 | Approval transition and audit |
| 10 | US-09 | Availability | As an Approved Mentor, I want to manage future slots so Students see valid availability. | OBJ-03/04; booking enablement | R1 Must | US-08 | RQ-05; BR-01/02; M04 | 5 | Time validation and occupied-slot constraints |
| 11 | US-10 | Marketplace | As a Student, I want to find Approved Mentors by expertise and availability so I can choose a suitable session. | OBJ-03; discovery | R1 Must | US-08, US-09 | RQ-05; BR-01; S04-S05 | 3 | Approved-profile and availability query |
| 12 | US-11 | Booking | As a Student, I want to send a booking with my goal so the Mentor has enough context to decide. | OBJ-03; conversion | R1 Must | US-03, US-10 | RQ-06; BR-02/03/10; FS-05/S06 | 5 | Booking creation with concurrency and idempotency |
| 13 | US-12 | Booking | As the owning Mentor, I want to accept, reject or propose a new time so a booking reaches a valid next state. | OBJ-04; lifecycle | R1 Must | US-11 | RQ-06; BR-02/08/10; FS-06 | 8 | Transition policy must be approved before Ready |
| 14 | US-13 | Booking | As a booking party, I want to cancel or resolve a reschedule under a clear policy so exceptions do not require hidden coordination. | OBJ-04; operations | R1 Must | US-12 | RQ-06; BR-02/08/10; FS-06 | 8 | Cancellation/reschedule policy and split review required |
| 15 | US-14 | Session | As a booking party, I want authorized access to the external meeting link when Confirmed so I can attend safely. | OBJ-04; session handoff | R1 Must | US-12 | RQ-07; BR-04/11; FS-07/08 | 3 | Link authority and outage fallback required |
| 16 | US-19 | Notification | As a user, I want reliable booking-event notifications so I know the next action even when the provider temporarily fails. | OBJ-04; coordination | R1 Must | US-11 plus each event-producing story | RQ-09; BR-09/10; FS-07 | 8 | Outbox, retry and deduplication risk |
| 17 | US-15 | Feedback | As the owning Mentor, I want to submit structured feedback after completion so the Student receives actionable guidance. | OBJ-05/06; core value | R1 Must | US-14, completion transition | RQ-08; BR-04/05/08; FS-09/M08 | 5 | Completion authority must be approved |
| 18 | US-16 | Feedback | As the booking Student, I want to view feedback and next actions so I can return to relevant practice. | OBJ-05/06; learning loop | R1 Must | US-15 | RQ-08; BR-04/11; FS-11/S09 | 3 | Authorized feedback view and next action |
| 19 | US-17 | Review | As the booking Student, I want to review the Mentor after completion so future Students receive trust signals. | Marketplace trust | R1 Must | US-15 | RQ-08; BR-06; FS-10/S10 | 3 | One review per completed booking |
| 20 | US-20 | Operations | As an authorized Admin, I want to resolve reports and booking exceptions so the pilot can operate safely. | Trust/operability | R1 Must | US-02, US-13, US-17 | RQ-10; BR-01/07/08/11; A01-A05 | 5 | Minimal governed operations slice |
| 21 | US-21 | Progress | As a Student, I want a basic progress dashboard so I can see what to practice next. | OBJ-06; retention | R1 Stretch | US-06, US-16 | RQ-03; S01 | 5 | Aggregation/dashboard slice; outside proposed Must commitment |
| 22 | US-22 | Reminder | As a booking party, I want a scheduled reminder so I am less likely to miss a session. | OBJ-04; completion rate | R1 Stretch | US-19 | RQ-09; BR-09; FS-07 | 3 | Reminder cadence/timezone policy required |
| 23 | US-23 | Import | As an Admin, I want governed bulk Question import so content operations can scale without bypassing moderation. | Content efficiency | Future/Could | US-18 | RQ-03/10; BR-07/08 | 8 | Validation, partial-failure and audit complexity; Future split candidate |

R1 selection becomes a delivery commitment only after Product Owner approval, Development Team Planning Poker and velocity review.

### 2.1 Story-point method and totals

- Story Points express relative overall size; they are deliberately not converted to hours ([Agile Estimation, Slide 005](https://github.com/tnnhuaa/InterviewQuestionBank/blob/05ff4b99ae133de9b0f7c2f0de3585390b933718/docs/refs/05-3-agile-estimation.md#slide-005--estimating-size-with-story-points-1)).
- Estimates use the ref-supported Fibonacci scale `1, 2, 3, 5, 8`, whose widening gaps represent greater uncertainty ([Agile Estimation, Slide 008](https://github.com/tnnhuaa/InterviewQuestionBank/blob/05ff4b99ae133de9b0f7c2f0de3585390b933718/docs/refs/05-3-agile-estimation.md#slide-008--the-estimation-scale)). They were derived by analogy and disaggregation and must be confirmed through Planning Poker ([Slides 009–012](https://github.com/tnnhuaa/InterviewQuestionBank/blob/05ff4b99ae133de9b0f7c2f0de3585390b933718/docs/refs/05-3-agile-estimation.md#slide-009--deriving-an-estimate-analogy-1-2)).
- Each SP covers a complete vertical story through code, test, documentation and acceptance evidence. EN-01–EN-08 are traced quality/delivery gates and are not added again; if the team schedules an enabler as an independent PBI, it must estimate that PBI and recheck affected story points to avoid double counting.
- `US-03 = 2 SP` is the small persistence anchor; typical bounded end-to-end work is `3–5 SP`; `8 SP` identifies high uncertainty or a split candidate. Before sprint commitment, the team should disaggregate US-01, US-12, US-13, US-19 and US-23 if any cannot satisfy Done within one sprint.

| Backlog bucket | Stories | Initial SP | Planning interpretation |
|---|---:|---:|---|
| R1 Must | 20 | 92 | Requires average `92 / 6 = 15.3 SP/sprint` across six sprints; feasibility awaits team velocity |
| R1 Stretch | 2 | 8 | US-21 = 5, US-22 = 3; consume only after Must work and reserves are safe |
| Future/Could | 1 | 8 | US-23; excluded from R1 |
| Entire Product Backlog | 23 | 108 | Relative-size estimate pending Planning Poker confirmation |

## 3. Cross-cutting and delivery PBIs

These PBIs make delivery, validation and release work visible without changing the count or Story Points of the 23 user stories. If an enabler is scheduled as an independent PBI, the team estimates it separately and rechecks related story estimates to prevent double counting.

| ID | PBI / exit outcome | Supports | Release order |
|---|---|---|---:|
| EN-01 | Discovery, clickable prototype, handoff and usability evidence establish the problem/MRF baseline. | US-03–US-20 | Before build baseline |
| EN-02 | Architecture/runtime/session/CI foundation passes independent frontend build, backend test/migration and same-origin session/CSRF gates. | US-01–US-20 | 1 |
| EN-03 | PostgreSQL concurrency test proves one occupied booking for ≥20 competing requests, stable conflicts, idempotency and one transition/outbox event. | US-11–US-13 | 2 |
| EN-04 | Server-side role/ownership matrix protects booking, meeting link, feedback and verification for unrelated Student/Mentor/Admin actors. | US-02, US-08, US-12, US-14–US-16, US-20 | 3 |
| EN-05 | Canonical state machine and immutable audit cover happy/invalid/reschedule/cancel/complete/no-show paths. | US-12, US-13, US-15, US-20 | 4 |
| EN-06 | Question filtering proves zero/one/many, multi-tag, deterministic pagination/sort and no Draft leakage. | US-04, US-18 | 5 |
| EN-07 | Transactional outbox proves booking commit under provider failure, deduplication, safe competing workers, retry/backoff and `DEAD`/manual action. | US-19, US-22 | 6 |
| EN-08 | Integrated build, security/negative tests, performance profile, backup/restore, UAT, deployment, guides and release evidence satisfy DoD. | Entire R1 | Final |

## 4. Acceptance criteria

Acceptance criteria are verification contracts, not claims that a feature is implemented. Risky flows include happy, negative, boundary, authorization, concurrency or provider-failure paths as required by [Software Quality Management, Slide 007](https://github.com/tnnhuaa/InterviewQuestionBank/blob/05ff4b99ae133de9b0f7c2f0de3585390b933718/docs/refs/11-software-quality-management.md#slide-007--how-to-meet-user-requirements).

| AC ID | Story | Type | Given / When / Then acceptance criterion |
|---|---|---|---|
| AC-01-01 | US-01 | Happy/security | Given a valid unregistered email, when registration and verification succeed, then one account is created and no plaintext credential/secret appears in storage or logs. |
| AC-01-02 | US-01 | Session | Given an authenticated user, when the session is created/expired/revoked, then access follows the server-side session policy; the client cannot assert identity or role through a trusted header. |
| AC-02-01 | US-02 | Authorization | Given an actor without the required role/relationship, when a protected route is called, then it returns a safe 403/404, changes no data and reveals no sensitive object content. |
| AC-03-01 | US-03 | Happy/validation | Given a signed-in Student, when valid target position, interview type and goal are saved, then they persist and reappear; invalid/missing fields produce field errors without unintended partial data. |
| AC-04-01 | US-04 | Boundary | Given zero/one/many Published Questions and multi-tag Questions, when combined filters/pagination/sort are applied, then results are correct, deterministic, non-duplicated and never expose Draft/Archived content. |
| AC-05-01 | US-05 | Visibility | Given a Published Question, when its detail opens, then content, taxonomy, answer criteria and provenance appear; a non-public Question is unavailable to an unauthorized user. |
| AC-06-01 | US-06 | Ownership | Given a signed-in Student, when bookmark/practice state changes, then private state persists and another Student cannot read or modify it. |
| AC-07-01 | US-07 | State/privacy | Given complete Mentor data and consent, when verification is submitted, then status becomes Pending and evidence remains restricted; incomplete data is rejected. |
| AC-08-01 | US-08 | Authorization/audit | Given Pending verification, when an authorized Admin approves/rejects with a reason, then status, actor, reason and timestamp are audited; a non-Admin cannot decide. |
| AC-09-01 | US-09 | Boundary/state | Given an Approved Mentor, when a future non-overlapping slot with timezone is created, then it persists; past/invalid/overlapping slots or an unapproved Mentor are rejected. |
| AC-10-01 | US-10 | Visibility | Given public Mentor/slot data, when a Student filters, then only Approved Mentors with matching service/availability appear and empty states distinguish no Mentor from no matching slot. |
| AC-11-01 | US-11 | Happy/validation | Given a valid available slot, when the Student submits required position/type/goal, then exactly one Pending booking is created; invalid/foreign/past slot or missing context is rejected. |
| AC-11-02 | US-11 | Idempotency | Given a create request and idempotency key, when the same request is retried, then the original result is returned with no duplicate booking/event; a different payload with that key returns a stable conflict. |
| AC-12-01 | US-12 | Concurrency | Given ≥20 distinct Pending bookings competing for one slot, when their owning Mentor confirmations run concurrently on real PostgreSQL, then exactly one booking occupies the slot; losers receive stable conflict/idempotent results and only one logical transition/outbox event exists. |
| AC-12-02 | US-12 | Transition | Given Pending booking and owning Mentor, when Reject or ProposeReschedule uses valid reason/slot, then the canonical transition and complete audit are committed atomically; other actors are rejected. |
| AC-12-03 | US-12 | Lock/invariant | Given a confirmed-source reschedule proposal, when it remains unresolved, then the old slot stays protected and the proposed new slot is not occupied until atomic acceptance. |
| AC-13-01 | US-13 | Policy/transition | Given an allowed state and authorized party, when cancel/propose/accept/reject reschedule occurs, then the approved cancellation/reschedule guards apply and old/new slot, prior state, actor, reason and time are auditable; invalid transitions have no partial side effect. |
| AC-13-02 | US-13 | Race | Given two bookings competing for the same proposed new slot, when reschedules are accepted concurrently, then only one booking obtains it and the loser retains a policy-defined safe state. |
| AC-14-01 | US-14 | Object authorization | Given a Confirmed booking, when its Student or Mentor opens detail, then the meeting link is available; an unrelated user receives safe denial and the link is absent from public content/logs. |
| AC-14-02 | US-14 | State/provider | Given a non-Confirmed booking or provider outage, when link access occurs, then no unauthorized link is exposed, booking state remains authoritative and the user receives the configured fallback action. |
| AC-15-01 | US-15 | State/ownership | Given a Completed booking, when its owning Mentor submits complete rubric, strengths, weaknesses and next action, then one feedback record and audit entry are created; wrong state/actor/incomplete rubric is rejected. |
| AC-15-02 | US-15 | Privacy | Given feedback exists, when logs, analytics or public/profile routes are inspected, then full feedback content is absent unless explicitly authorized by policy. |
| AC-16-01 | US-16 | Object authorization | Given feedback exists, when the booking Student opens it, then rubric and next actions appear; unrelated users are denied and content is not automatically public. |
| AC-17-01 | US-17 | Uniqueness | Given a Completed booking with no review, when its Student submits a valid rating/comment, then one review is created; duplicate/wrong actor/wrong state is rejected. |
| AC-18-01 | US-18 | Moderation | Given an authorized Admin, when a Question with valid taxonomy/provenance is published, then it becomes public and the decision is audited; incomplete data/non-Admin action is rejected. |
| AC-19-01 | US-19 | Transaction/provider failure | Given a committed booking event, when the notification provider times out/fails, then booking remains committed and exactly one deduplicated outbox event enters retryable state. |
| AC-19-02 | US-19 | Worker/recovery | Given duplicate workers, transient and permanent failures, when jobs are processed, then one worker claims a job at a time, retry/backoff is observable, success becomes Sent, and exhausted failure becomes Dead with manual action. |
| AC-20-01 | US-20 | Authorization/audit | Given an open report/exception, when an authorized Admin resolves it, then decision, reason, actor, time and affected record are audited; internal notes remain restricted and state-machine rules are not bypassed. |
| AC-21-01 | US-21 | Value/ownership | Given Student practice/feedback data, when the dashboard opens, then it shows only that Student’s real progress and actionable next items; no fabricated score or another Student’s data appears. |
| AC-22-01 | US-22 | Scheduling/deduplication | Given a Confirmed future booking and approved cadence, when reminder time arrives, then one timezone-correct deduplicated reminder event is created; cancellation/reschedule suppresses obsolete reminders. |
| AC-23-01 | US-23 | Import/moderation | Given a governed import file, when an Admin validates/imports it, then valid rows enter Draft/In-review with provenance, row errors are reported, duplicates are handled deterministically and nothing auto-publishes. |

## 5. Quality requirements

Quality requirements are part of the specification because quality cannot be evaluated without a baseline ([Software Quality Management, Slides 024–025](https://github.com/tnnhuaa/InterviewQuestionBank/blob/05ff4b99ae133de9b0f7c2f0de3585390b933718/docs/refs/11-software-quality-management.md#slide-024--6-define-quality-requirements)).

| ID | Requirement | Story/PBI trace | Verification |
|---|---|---|---|
| NFR-01 | Default-deny server-side role and object authorization protects all private/restricted objects. | US-01/02/07/08/11–20; EN-04 | Actor/role/relationship negative matrix on real API |
| NFR-02 | Booking/Question/detail mutations target p95 ≤3s under the Architecture pilot profile; 5xx <1% for search/list. | US-04/10–15; EN-08 | Staging load test with deterministic dataset/profile |
| NFR-03 | Exactly one occupied booking per slot under ≥20 concurrent confirmation attempts. | US-12/13; EN-03 | PostgreSQL concurrency test and invariant query |
| NFR-04 | Outbox enqueue is atomic; worker pickup p95 ≤10s while provider operates; failure is observable/recoverable. | US-19/22; EN-07 | Fake-provider integration, job metrics and recovery test |
| NFR-05 | Transport uses TLS 1.2+; session/CSRF controls follow accepted architecture topology; secrets are absent from repository/logs. | US-01/02/14; EN-02/08 | Configuration, negative CSRF/session and secret-history checks |
| NFR-06 | RPO ≤24h and RTO ≤4h for pilot data. | Entire R1; EN-08 | Backup and restore drill before pilot |
| NFR-07 | Core Student tasks achieve ≥80% completion; Question search median ≤2 minutes; loading/empty/error/permission/conflict states are usable. | US-03–US-17; EN-01 | Observed prototype/UAT report, not designer self-review |
| NFR-08 | Zero open Critical/High defects and 100% critical workflow tests pass before UAT exit. | Entire R1; EN-08 | Defect register and signed UAT result |

### 5.1 Test-suite index

| Suite | Verification focus |
|---|---|
| TC-AUTH | Registration/sign-in, trusted session, role escalation, CSRF and expiry/revocation |
| TC-STUDENT | Goal/profile validation, persistence and ownership |
| TC-Q | Zero/one/many results, multi-tag, lifecycle visibility, pagination/sort and provenance |
| TC-M | Verification states, unauthorized decision and public/private profile separation |
| TC-SLOT | Timezone, past/overlap validation, occupying-state invariant and concurrent update |
| TC-B | Booking create/transition/reschedule/cancel, idempotency, audit and concurrency |
| TC-SESSION | Confirmed-only meeting-link access, object authorization and provider fallback |
| TC-F | Completed-only feedback, Mentor ownership, rubric validation, privacy and review uniqueness |
| TC-N | Atomic outbox, deduplication, competing worker, retry/backoff, Dead and recovery |
| TC-ADM | Question moderation, report/exception resolution, restricted notes and audit trail |

## 6. KPI plan

| KPI | Event/source | Formula | Target |
|---|---|---|---:|
| Problem confirmation | Discovery sample | participants confirming a core pain / sample | ≥70% |
| Question task completion | Observed usability session | completed / attempted | ≥80% |
| Question search time | Observed usability session | median task duration | ≤2 minutes |
| Booking task completion | Observed usability session | valid requests / attempts | ≥80% |
| Booking reliability | Booking events | completed / confirmed | ≥80% |
| Feedback completeness | Feedback records | complete rubric / completed bookings | ≥90% |
| Perceived value | Post-session survey | average score | ≥4/5 |
| Confidence lift | Pre/post survey | average post − pre | ≥1/5 |

KPI evidence validates outcomes; test evidence validates behavior. Neither may be inferred from UI presence or an unasserted script.

## 7. Readiness and Done controls

### 7.1 Definition of Ready

A story is Ready only when actor/value, acceptance criteria, dependencies, design/contract inputs, decision owners and a Development Team estimate are present. A story dependent on an unresolved PD-02/03/04/05 decision is not Ready.

### 7.2 Definition of Done

- Acceptance criteria and applicable NFRs pass with retained evidence; Product Owner accepts the behavior.
- Code follows standards, is peer-reviewed, builds without errors and has appropriate unit/integration/E2E/negative tests.
- PostgreSQL-backed concurrency, authorization and outbox behavior are tested where applicable; mocks do not prove those invariants.
- Migration, API contract, audit/telemetry and documentation are updated; no real secret or unnecessary PII is tracked/logged.
- Integrated build is deployed to the target environment, smoke-tested by another member and has no open Critical/High defect.
- Release Backlog, plan/schedule, user/deployment guidance and evidence links are updated.

This operationalizes [Scrum, Slides 035–036](https://github.com/tnnhuaa/InterviewQuestionBank/blob/05ff4b99ae133de9b0f7c2f0de3585390b933718/docs/refs/04-02-scrum-development-process.md#slide-035--example-dod-1) and “production-ready” from [Agile Quality, Slide 016](https://github.com/tnnhuaa/InterviewQuestionBank/blob/05ff4b99ae133de9b0f7c2f0de3585390b933718/docs/refs/11-1-agile-quality-management.md#slide-016--9-create-definition-of-done).

## 8. Requirements Traceability Matrix

| Requirement | Origin/objective | Stories | Rules / acceptance | Workflow / prototype | Verification |
|---|---|---|---|---|---|
| RQ-01 Identity/RBAC | Privacy/security enabler | US-01, US-02 | BR-04/11; AC-01-01/02, AC-02-01 | FS-01; S01; permission states | EN-02/04; TC-AUTH; NFR-01/05 |
| RQ-02 Student goal | OBJ-02/03 | US-03 | BR-03; AC-03-01 | FS-01; S01 | TC-STUDENT; usability/KPI |
| RQ-03 Question Bank | OBJ-02/06 | US-04, US-05, US-06, US-18, US-21, US-23 | BR-07/08; AC-04-01, AC-05-01, AC-06-01, AC-18-01, AC-21-01, AC-23-01 | FS-02/03/11; S01-S03, A03 | EN-06; TC-Q; NFR-02/07 |
| RQ-04 Mentor onboarding | OBJ-03 | US-07, US-08 | BR-01/08/11; AC-07-01, AC-08-01 | FS-04; M01-M03, A02 | TC-M; NFR-01 |
| RQ-05 Availability/discovery | OBJ-03/04 | US-09, US-10 | BR-01/02; AC-09-01, AC-10-01 | FS-04; S04-S05, M04 | TC-SLOT; usability/KPI |
| RQ-06 Booking lifecycle | OBJ-03/04 | US-11, US-12, US-13 | BR-02/03/08/10; AC-11-01, AC-11-02, AC-12-01, AC-12-02, AC-12-03, AC-13-01, AC-13-02 | FS-05/06; S06-S07, M05-M06 | EN-03/05; TC-B; NFR-03 |
| RQ-07 Session access | OBJ-04 | US-14 | BR-04/11; AC-14-01/02 | FS-07/08; S08, M07 | EN-04; TC-SESSION; NFR-01/05 |
| RQ-08 Feedback/review | OBJ-05/06 | US-15, US-16, US-17 | BR-04/05/06/11; AC-15-01, AC-15-02, AC-16-01, AC-17-01 | FS-09/10/11; S09-S10, M08 | EN-04/05; TC-F; KPI |
| RQ-09 Notification | OBJ-04 | US-19, US-22 | BR-09/10; AC-19-01/02, AC-22-01 | FS-07 + exceptions | EN-07; TC-N; NFR-04 |
| RQ-10 Moderation/operations | Trust/pilot operations | US-18, US-20, US-23 | BR-01/07/08/11; AC-18-01, AC-20-01, AC-23-01 | Admin A01-A05 | TC-ADM; NFR-01/08 |

## 9. Release plan

Release R1 is planned as six two-week sprints from 17/08/2026 through 08/11/2026. Release planning must use estimated, prioritized PBIs and a team velocity range as described in [Agile Planning, Slides 021–025](https://github.com/tnnhuaa/InterviewQuestionBank/blob/05ff4b99ae133de9b0f7c2f0de3585390b933718/docs/refs/06-1-agile-planning.md#slide-021--7-create-a-fixed-date-release-plan-i).

| Backlog bucket | Stories | Initial SP | Planning constraint |
|---|---:|---:|---|
| R1 Must | US-01–US-20 | 92 | Requires average `15.3 SP/sprint`; team velocity must confirm feasibility |
| R1 Stretch | US-21–US-22 | 8 | Selected only after Must work and reserves are safe |
| Future | US-23 | 8 | Excluded from R1 |

Will-have/might-have lines remain unset until the Development Team confirms estimates and provides a velocity range. The milestone sequence is Discovery/Charter → Requirements/Prototype → Foundation → Question Bank → Marketplace/Feedback → UAT/Release.

## 10. Open product decisions

| ID | Decision required | Owner | Affected backlog |
|---|---|---|---|
| PD-01 | Pilot segment, sample size and absolute Mentor/booking targets | PO/Research | OBJ-01, KPI plan |
| PD-02 | Cancellation, reschedule, no-show and completion authority, cutoff and evidence | PO/Operations | US-12, US-13, US-15, US-20 |
| PD-03 | Retention, deletion, privacy notice and consent policy | PO/Privacy | BR-11, NFR-06 |
| PD-04 | Meeting-link creation/update authority and provider-outage fallback | PO/Technical | US-14 |
| PD-05 | Reminder cadence, timezone, suppression and fallback | PO/Operations | US-22 |

## 11. Backlog refinement and change control

The Product Owner facilitates refinement at least once per sprint with Development and QA representatives. Every approved change updates the affected story, acceptance criteria, priority/order, dependency, estimate, traceability and release impact.

A story is Ready for sprint selection only when:

1. actor, value, priority, dependency and acceptance criteria are clear;
2. workflow/prototype and technical inputs are available;
3. privacy, security and policy dependencies are resolved or explicitly planned;
4. the Development Team confirms the estimate using the agreed Fibonacci scale;
5. an 8-point story is split or accepted as a one-sprint exception;
6. Product Owner, developer and QA agree it can be implemented and tested within the sprint.
