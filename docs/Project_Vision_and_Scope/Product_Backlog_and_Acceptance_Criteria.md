# Interview Practice Platform — Product Backlog and Acceptance Criteria

> **AI-assisted reconciliation baseline — Pending human audit.** Codex inspected the fetched remote branch snapshots, reconciled their requirements into this backlog, and marked unsupported PoC claims as gaps. Hưng/Product Owner must still review business value, order, policy, acceptance and release commitment before this document can become an Approved baseline.

## 0. Document control

| Attribute | Value |
|---|---|
| Owner/Producer | Hưng — Member 3 / Product Owner |
| Supporting tool | Codex |
| Version | 0.8-ai-story-point-proposal |
| Branch | `feat/member-3-scope-backlog` |
| Updated | 15/08/2026 |
| Status | Separate Product Backlog artifact with proposed story points; pending PO/team Planning Poker, inspection and Sponsor acceptance |
| Reviewer/Approver | Tuấn Anh/Team Lead — integration/document consistency; Hưng/PO, Development Team và Sponsor — acceptance record pending |

The quality criteria in the immutable [`docs/refs/` snapshot at `05ff4b9`](https://github.com/tnnhuaa/InterviewQuestionBank/tree/05ff4b99ae133de9b0f7c2f0de3585390b933718/docs/refs) are the single source of truth for evaluating this artifact. The snapshot is pinned because the final submission tree excludes reference-source files. When project documents disagree, this backlog records the discrepancy and required owner action; it does not silently treat a PoC or an unapproved branch as a new business requirement.

## 1. Purpose, boundary and evidence

This document converts the product vision and business rules into an ordered, verifiable Product Backlog and identifies the Product Backlog Items (PBIs) needed to deliver and validate the release. Each story must be understandable to the customer and team, add explicit business value, and be customer-verifiable ([Software Project Planning, Slide 079](https://github.com/tnnhuaa/InterviewQuestionBank/blob/05ff4b99ae133de9b0f7c2f0de3585390b933718/docs/refs/06-software-project-planning.md#slide-079--sales-tip-5-real-business-requirements)).

**Artifact boundary:** this file owns backlog order, priority, dependencies, Story Points, acceptance criteria and release readiness. It does not replace or contain the product vision/scope narrative, which remains in the separate `Project_Vision_and_Scope.md` required by `Task_W10.pdf`; `Future_State_Workflow.md` also remains a separate workflow artifact.

### 1.1 Release boundary

Release R1 is a responsive web MVP for Student, Mentor and Administrator. It includes authentication/RBAC, Question Bank, mentor profile/verification/availability, booking and exception handling, external meeting-link handoff, feedback/review, minimal administration and reliable notification. AI interviewer/scoring, built-in video/recording/transcription, automated payment/payout, native mobile, ATS and ML recommendations remain outside R1.

### 1.2 Immutable evidence register

| Evidence | Remote snapshot inspected | Contribution | Authority in this reconciliation |
|---|---|---|---|
| EV-01 — Member 1 governance/estimation | [`a060693`](https://github.com/tnnhuaa/InterviewQuestionBank/tree/a0606934f63da9497b574f092835197d55d08f10) | Hưng as PO; 12 weeks; original five-member 816 committed hours; 688-hour working estimate; 756-hour guardrail; 20 Must stories | Proposed project/release baseline; Tuấn Anh capacity and Sponsor acceptance still required |
| EV-02 — Member 5 architecture/ADR | [`8d6a10f`](https://github.com/tnnhuaa/InterviewQuestionBank/tree/8d6a10fd2d262fe5f1c9e696569841858326b4b7) | Modular monolith, PostgreSQL consistency, object authorization, outbox, NFRs and PoC gates | Technical constraint/design source; pending valid PoC evidence |
| EV-03 — PoC implementation | [`e1d6911`](https://github.com/tnnhuaa/InterviewQuestionBank/tree/e1d691135497d6d10b786d539bb5888c4b0f8291/poc) | Partial question, booking, link, feedback and worker implementation | Implementation evidence only; not accepted as passing the five PoC gates |
| EV-04 — Prototype specification on remote `main` | [`6548e12`](https://github.com/tnnhuaa/InterviewQuestionBank/blob/6548e129d702facf741641dbfb2e38ddf392d310/docs/Project_Prototype/Prototype_Workflow.md) | Screen IDs, user flows, states and prototype test tasks | Requirement/prototype specification; no dedicated Member 2 branch, clickable frames, handoff or usability result found |
| EV-05 — Member 3 prior scope baseline | [`dca6a09`](https://github.com/tnnhuaa/InterviewQuestionBank/tree/dca6a09998f2082880525e41bb4899fa069278f6/docs/Project_Vision_and_Scope) | Vision, backlog, future-state workflow and AI validation | Input superseded by this 0.3 reconciliation for backlog semantics |
| EV-06 — Tuấn Anh repository/document bootstrap | [`ff41b3c`](https://github.com/tnnhuaa/InterviewQuestionBank/commit/ff41b3ce37b6187df6590d1d77b057e59792f25d), [`0743a68`](https://github.com/tnnhuaa/InterviewQuestionBank/commit/0743a685195a3396511a59c83515860c9f11bfdd) | Root repository initialization, `docs/` skeleton and starter content for 16 initial paths | Historical configuration/document contribution; specialist owners remain responsible for correctness, evidence and acceptance |

Cross-branch discrepancies and their required owner actions are retained in section 14 of this document so the submission tree contains only the three Member 3 deliverables required by `Task_W10.pdf`.

### 1.3 Ref-derived evaluation gates

| Gate | Criterion from refs | Evidence required here |
|---|---|---|
| PB-G01 | Product Backlog is comprehensive ([Scrum, Slide 014](https://github.com/tnnhuaa/InterviewQuestionBank/blob/05ff4b99ae133de9b0f7c2f0de3585390b933718/docs/refs/04-02-scrum-development-process.md#slide-014--the-product-backlog)) | Product stories, delivery enablers, decisions, dependencies and verification are visible |
| PB-G02 | PO represents stakeholder interests and orders highest value first ([Scrum, Slide 015](https://github.com/tnnhuaa/InterviewQuestionBank/blob/05ff4b99ae133de9b0f7c2f0de3585390b933718/docs/refs/04-02-scrum-development-process.md#slide-015--the-product-owner-2)) | One explicit order, value basis, PO audit record |
| PB-G03 | Every feature is understandable, valuable and verifiable ([Planning, Slide 079](https://github.com/tnnhuaa/InterviewQuestionBank/blob/05ff4b99ae133de9b0f7c2f0de3585390b933718/docs/refs/06-software-project-planning.md#slide-079--sales-tip-5-real-business-requirements)) | Actor/value statement plus acceptance criteria and trace |
| PB-G04 | Release Backlog contains selected next-release stories and object mapping ([Scrum, Slide 019](https://github.com/tnnhuaa/InterviewQuestionBank/blob/05ff4b99ae133de9b0f7c2f0de3585390b933718/docs/refs/04-02-scrum-development-process.md#slide-019--release-backlog)) | R1/Stretch/Future boundary and domain/workflow mapping |
| PB-G05 | Release PBIs are created, estimated and prioritized; velocity yields will-have/might-have lines ([Agile Planning, Slides 021–025](https://github.com/tnnhuaa/InterviewQuestionBank/blob/05ff4b99ae133de9b0f7c2f0de3585390b933718/docs/refs/06-1-agile-planning.md#slide-021--7-create-a-fixed-date-release-plan-i)) | Team story estimates and velocity range; otherwise commitment remains conditional |
| PB-G06 | Done means reviewed, tested, integrated, deployed, documented and PO-accepted ([Scrum, Slides 035–036](https://github.com/tnnhuaa/InterviewQuestionBank/blob/05ff4b99ae133de9b0f7c2f0de3585390b933718/docs/refs/04-02-scrum-development-process.md#slide-035--example-dod-1)) | Definition of Done and real evidence, not self-declared pass |
| PB-G07 | RTM links origin to deliverable/value; stakeholders inspect acceptance ([Monitoring, Slides 039–042](https://github.com/tnnhuaa/InterviewQuestionBank/blob/05ff4b99ae133de9b0f7c2f0de3585390b933718/docs/refs/09-software-project-monitoring-and-control.md#slide-039--9-validate-scope)) | RTM, inspection checklist and acceptance/change record |
| PB-G08 | Decomposition covers 100% of in-scope work and no out-of-scope work ([WBS, Slides 007, 019, 033](https://github.com/tnnhuaa/InterviewQuestionBank/blob/05ff4b99ae133de9b0f7c2f0de3585390b933718/docs/refs/05-1-work-breakdown-structure.md#slide-007--how-to-create-wbs-round-1)) | Stories plus cross-cutting/release PBIs reconcile with the estimate work packages |

## 2. Canonical business rules and semantics

Business rules carry ID, changeability and source as required by [User Requirements, Slide 007](https://github.com/tnnhuaa/InterviewQuestionBank/blob/05ff4b99ae133de9b0f7c2f0de3585390b933718/docs/refs/03-2-user-requirements.md#slide-007--business-rules).

| ID | Rule | Source | Changeability | Owner/status |
|---|---|---|---|---|
| BR-01 | Only an `Approved` Mentor may publish a profile/slot and receive a booking. | Vision, Charter, Prototype | Medium | PO/Admin — Proposed |
| BR-02 | A slot may be owned by at most one booking in an occupying state. Occupying states are `Confirmed`, `Completed` and conditional `NoShow`; a confirmed booking keeps its old slot while reschedule is unresolved. | Feasibility, ADR-002 | Low | PO/Architecture — Proposed; reschedule mechanism blocked by DEC-03 |
| BR-03 | A booking requires an available slot, target position/interview type and a meaningful goal. | Vision, Prototype | Medium | PO — Proposed |
| BR-04 | Only the Student/Mentor belonging to a booking and an authorized Admin may access its private booking data, meeting link or feedback. | Charter, Feasibility, Architecture | Low | PO/Security — Proposed |
| BR-05 | Feedback can be created only after the booking is `Completed`, by the authorized Mentor. | Vision, Prototype | Medium | PO — Conditional on DEC-03 |
| BR-06 | The booking Student may create at most one review after a valid `Completed` booking. | Vision, Prototype | Medium | PO/Admin — Proposed |
| BR-07 | A Question is public only when `Published` and has valid taxonomy and provenance. | Vision, Prototype, Charter | Medium | PO/Admin — Proposed |
| BR-08 | Every booking transition uses one canonical state-machine service and records from/to state, actor, reason when required and timestamp. | Workflow, Architecture | Medium | PO/Operations — Conditional on DEC-03 |
| BR-09 | Notification failure never rolls back or controls booking state. The internal booking state is authoritative; notification uses retry, deduplication and an operable failure state. | Feasibility, ADR-003 | Low | Architecture/Operations — Proposed |
| BR-10 | Create-booking and critical transitions are retry-safe. Reusing an idempotency key with the same request returns the original result; a different request returns a stable conflict without duplicate transitions/events. | ADR-002 | Low | Architecture — Proposed |
| BR-11 | Meeting links, verification evidence, feedback and private profile data are not public or logged in full; retention/deletion remains governed by DEC-05. | Feasibility, Architecture | Low/Medium | PO/Privacy — Conditional on DEC-05 |

### 2.1 Booking-state vocabulary

| Business state | API/storage token | Slot occupancy | Meaning |
|---|---|---|---|
| Pending | `PENDING` | No | Student request awaits Mentor decision |
| Confirmed | `CONFIRMED` | Yes | Mentor accepted and the slot is reserved |
| Reschedule proposed | `RESCHEDULE_PROPOSED` | New slot: no; old confirmed slot: retained until resolution | The other party must accept/reject the proposal |
| Rejected | `REJECTED` | No | Mentor rejected the current request |
| Cancelled | `CANCELLED` | No | Authorized cancellation completed under policy |
| Completed | `COMPLETED` | Yes, as historical ownership of that slot | Session occurred and completion was recorded |
| No-show | `NO_SHOW` | Yes, conditional | Attendance exception; not enabled until DEC-03 is approved |

UI labels may be localized, but contracts, tests and documents must map to these semantic states. The current PoC title-case strings are implementation deviations, not a second vocabulary.

## 3. Ordered Product Backlog

The order below is a single value/dependency order, not a promise that ID order equals delivery order. R1 contains exactly 20 proposed Must user stories, consistent with EV-01. US-21–US-23 remain outside that 20-story count. Story Points are a Codex-assisted relative-size proposal, not hours or a team commitment; the Development Team must confirm them through Planning Poker.

| Order | ID | Epic | User story | Value / objective | Release | Dependencies | Trace | SP | Readiness/status |
|---:|---|---|---|---|---|---|---|---:|---|
| 1 | US-01 | Identity | As a user, I want to register and sign in so my personal data is protected. | Foundation/privacy | R1 Must* | — | RQ-01; BR-04/11; FS-01 | 8 | High-risk session/verification slice; team confirmation pending |
| 2 | US-02 | Identity | As an Admin, I want Student/Mentor/Admin roles enforced so functions and data are appropriately restricted. | Security invariant | R1 Must* | US-01 | RQ-01; BR-04 | 3 | Role matrix on established auth foundation; team confirmation pending |
| 3 | US-18 | Content admin | As an Admin, I want to manage/moderate Questions and taxonomy so only governed content is published. | Question supply prerequisite | R1 Must* | US-02 | RQ-03/10; BR-07/08; A03 | 5 | Multi-state admin CRUD/moderation; team confirmation pending |
| 4 | US-03 | Student | As a Student, I want to save my target position and interview goal so practice and booking use the same context. | OBJ-02/03; activation | R1 Must* | US-01 | RQ-02; BR-03; FS-01/S01 | 2 | Small profile persistence slice; team confirmation pending |
| 5 | US-04 | Questions | As a Student, I want to browse/search/filter governed Questions so I can find relevant practice content quickly. | OBJ-02; acquisition | R1 Must* | US-02, US-18 | RQ-03; BR-07; FS-02/S02 | 5 | Combined filter/pagination/visibility rules; team confirmation pending |
| 6 | US-05 | Questions | As a Student, I want Question detail and answer criteria so I know what a good response should cover. | OBJ-02; self-practice | R1 Must* | US-04 | RQ-03; BR-07; FS-02/S03 | 2 | Read-only detail on existing Question model; team confirmation pending |
| 7 | US-06 | Practice | As a Student, I want to bookmark and track practice state so I can resume and act on feedback. | OBJ-02/06; retention | R1 Must* | US-04 | RQ-03; BR-04; FS-03/11 | 3 | Per-user state and authorization; team confirmation pending |
| 8 | US-07 | Mentor | As a Mentor, I want to create a profile and submit verification so I can offer a trusted service. | OBJ-03; supply | R1 Must* | US-01 | RQ-04; BR-01/11; FS-04/M01-M03 | 5 | Profile plus verification lifecycle; team confirmation pending |
| 9 | US-08 | Mentor admin | As an Admin, I want to approve/reject Mentor verification with a reason so public supply is governed. | Trust/supply gate | R1 Must* | US-02, US-07 | RQ-04; BR-01/08; A02 | 3 | Bounded approval transition/audit; team confirmation pending |
| 10 | US-09 | Availability | As an Approved Mentor, I want to manage future slots so Students see valid availability. | OBJ-03/04; booking enablement | R1 Must* | US-08 | RQ-05; BR-01/02; M04 | 5 | Time validation and occupied-slot constraints; team confirmation pending |
| 11 | US-10 | Marketplace | As a Student, I want to find Approved Mentors by expertise and availability so I can choose a suitable session. | OBJ-03; discovery | R1 Must* | US-08, US-09 | RQ-05; BR-01; S04-S05 | 3 | Discovery query on approved profiles/slots; team confirmation pending |
| 12 | US-11 | Booking | As a Student, I want to send a booking with my goal so the Mentor has enough context to decide. | OBJ-03; conversion | R1 Must* | US-03, US-10 | RQ-06; BR-02/03/10; FS-05/S06 | 5 | Booking creation with concurrency/idempotency contract; team confirmation pending |
| 13 | US-12 | Booking | As the owning Mentor, I want to accept, reject or propose a new time so a booking reaches a valid next state. | OBJ-04; lifecycle | R1 Must* | US-11 | RQ-06; BR-02/08/10; FS-06 | 8 | Complex transition/concurrency slice; DEC-03 and team confirmation pending |
| 14 | US-13 | Booking | As a booking party, I want to cancel or resolve a reschedule under a clear policy so exceptions do not require hidden coordination. | OBJ-04; operations | R1 Must* | US-12 | RQ-06; BR-02/08/10; FS-06 | 8 | Exception/state-policy slice; blocked by DEC-03 and requires split review |
| 15 | US-14 | Session | As a booking party, I want authorized access to the external meeting link when Confirmed so I can attend safely. | OBJ-04; session handoff | R1 Must* | US-12 | RQ-07; BR-04/11; FS-07/08 | 3 | Bounded secure handoff; DEC-07 and team confirmation pending |
| 16 | US-19 | Notification | As a user, I want reliable booking-event notifications so I know the next action even when the provider temporarily fails. | OBJ-04; coordination | R1 Must* | US-11 plus each event-producing story | RQ-09; BR-09/10; FS-07 | 8 | Outbox/retry/deduplication cross-cutting risk; team confirmation pending |
| 17 | US-15 | Feedback | As the owning Mentor, I want to submit structured feedback after completion so the Student receives actionable guidance. | OBJ-05/06; core value | R1 Must* | US-14, completion transition | RQ-08; BR-04/05/08; FS-09/M08 | 5 | Rubric, completion gate and ownership; DEC-03 pending |
| 18 | US-16 | Feedback | As the booking Student, I want to view feedback and next actions so I can return to relevant practice. | OBJ-05/06; learning loop | R1 Must* | US-15 | RQ-08; BR-04/11; FS-11/S09 | 3 | Authorized feedback view/next action; team confirmation pending |
| 19 | US-17 | Review | As the booking Student, I want to review the Mentor after completion so future Students receive trust signals. | Marketplace trust | R1 Must* | US-15 | RQ-08; BR-06; FS-10/S10 | 3 | One-review constraint; inclusion still proposed by DEC-08 |
| 20 | US-20 | Operations | As an authorized Admin, I want to resolve reports and booking exceptions so the pilot can operate safely. | Trust/operability | R1 Must* | US-02, US-13, US-17 | RQ-10; BR-01/07/08/11; A01-A05 | 5 | Minimal governed operations slice; DEC-08 and team confirmation pending |
| 21 | US-21 | Progress | As a Student, I want a basic progress dashboard so I can see what to practice next. | OBJ-06; retention | R1 Stretch | US-06, US-16 | RQ-03; S01 | 5 | Aggregation/dashboard slice; outside proposed Must commitment |
| 22 | US-22 | Reminder | As a booking party, I want a scheduled reminder so I am less likely to miss a session. | OBJ-04; completion rate | R1 Stretch | US-19 | RQ-09; BR-09; FS-07 | 3 | Reuses notification foundation; blocked by DEC-09 |
| 23 | US-23 | Import | As an Admin, I want governed bulk Question import so content operations can scale without bypassing moderation. | Content efficiency | Future/Could | US-18 | RQ-03/10; BR-07/08 | 8 | Validation, partial-failure and audit complexity; Future split candidate |

`Must*` is the AI-reconciled proposal supported by the Proposal, Charter and 20-story estimate. It becomes a commitment only after PO inspection, Development Team Planning Poker and velocity review.

### 3.1 Story-point method and totals

- Story Points express relative overall size; they are deliberately not converted to hours ([Agile Estimation, Slide 005](https://github.com/tnnhuaa/InterviewQuestionBank/blob/05ff4b99ae133de9b0f7c2f0de3585390b933718/docs/refs/05-3-agile-estimation.md#slide-005--estimating-size-with-story-points-1)).
- The proposal uses the ref-supported Fibonacci scale `1, 2, 3, 5, 8`, whose widening gaps represent greater uncertainty ([Agile Estimation, Slide 008](https://github.com/tnnhuaa/InterviewQuestionBank/blob/05ff4b99ae133de9b0f7c2f0de3585390b933718/docs/refs/05-3-agile-estimation.md#slide-008--the-estimation-scale)). Estimates were derived by analogy and disaggregation; the team must replace/confirm them through Planning Poker ([Slides 009–012](https://github.com/tnnhuaa/InterviewQuestionBank/blob/05ff4b99ae133de9b0f7c2f0de3585390b933718/docs/refs/05-3-agile-estimation.md#slide-009--deriving-an-estimate-analogy-1-2)).
- Each SP covers a complete vertical story through code, test, documentation and acceptance evidence. EN-01–EN-08 are traced quality/delivery gates and are not added again; if the team schedules an enabler as an independent PBI, it must estimate that PBI and recheck affected story points to avoid double counting.
- `US-03 = 2 SP` is the small persistence anchor; typical bounded end-to-end work is `3–5 SP`; `8 SP` identifies high uncertainty or a split candidate. Before sprint commitment, the team should disaggregate US-01, US-12, US-13, US-19 and US-23 if any cannot satisfy Done within one sprint.

| Backlog bucket | Stories | Proposed SP | Planning interpretation |
|---|---:|---:|---|
| R1 Must* | 20 | 92 | Requires average `92 / 6 = 15.3 SP/sprint` across six sprints; feasibility awaits team velocity |
| R1 Stretch | 2 | 8 | US-21 = 5, US-22 = 3; consume only after Must work and reserves are safe |
| Future/Could | 1 | 8 | US-23; excluded from R1 |
| Entire Product Backlog | 23 | 108 | Relative-size proposal pending Planning Poker |

## 4. Cross-cutting and delivery PBIs

These PBIs make the backlog comprehensive without changing the count of 20 R1 user stories. EV-01’s bottom-up estimate already includes discovery, architecture/DevOps, QA/UAT, deployment and documentation work packages; the team must confirm that the following items fit those packages rather than adding them silently.

| ID | PBI / exit outcome | Supports | Release order | Evidence status at EV-03 |
|---|---|---|---:|---|
| EN-01 | Discovery, clickable prototype, handoff and usability evidence establish the problem/MRF baseline. | US-03–US-20 | Before build baseline | **Gap:** specification exists on `main`; no Member 2 branch, frame links, handoff or observed test report found |
| EN-02 | Architecture/runtime/session/CI foundation passes independent frontend build, backend test/migration and same-origin session/CSRF gates. | US-01–US-20 | 1 | **Fail/not evidenced:** PoC uses permissive CORS and `X-User-Id`; no CI/session/CSRF evidence |
| EN-03 | PostgreSQL concurrency test proves one occupied booking for ≥20 competing requests, stable conflicts, idempotency and one transition/outbox event. | US-11–US-13 | 2 | **Fail:** available tests do not exercise this contract |
| EN-04 | Server-side role/ownership matrix protects booking, meeting link, feedback and verification for unrelated Student/Mentor/Admin actors. | US-02, US-08, US-12, US-14–US-16, US-20 | 3 | **Fail:** fake identity is accepted; key mutation ownership/role checks are absent |
| EN-05 | Canonical state machine and immutable audit cover happy/invalid/reschedule/cancel/complete/no-show paths. | US-12, US-13, US-15, US-20 | 4 | **Partial:** Pending→Confirmed→Completed exists; actor/reason, exception paths and bypass protection are absent |
| EN-06 | Question filtering proves zero/one/many, multi-tag, deterministic pagination/sort and no Draft leakage. | US-04, US-18 | 5 | **Partial:** intersection/no-duplicate sample exists; lifecycle, taxonomy breadth and pagination are absent |
| EN-07 | Transactional outbox proves booking commit under provider failure, deduplication, safe competing workers, retry/backoff and `DEAD`/manual action. | US-19, US-22 | 6 | **Fail:** notification test self-passes; no dedup key/claim lock/backoff/dead state |
| EN-08 | Integrated build, security/negative tests, performance profile, backup/restore, UAT, deployment, guides and release evidence satisfy DoD. | Entire R1 | Final | **Pending** |

## 5. Acceptance criteria

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
| AC-13-01 | US-13 | Policy/transition | Given an allowed state and authorized party, when cancel/propose/accept/reject reschedule occurs, then DEC-03 guards apply and old/new slot, prior state, actor, reason and time are auditable; invalid transitions have no partial side effect. |
| AC-13-02 | US-13 | Race | Given two bookings competing for the same proposed new slot, when reschedules are accepted concurrently, then only one booking obtains it and the loser retains a policy-defined safe state. |
| AC-14-01 | US-14 | Object authorization | Given a Confirmed booking, when its Student or Mentor opens detail, then the meeting link is available; an unrelated user receives safe denial and the link is absent from public content/logs. |
| AC-14-02 | US-14 | State/provider | Given a non-Confirmed booking or provider outage, when link access occurs, then no unauthorized link is exposed, booking state remains authoritative and the user receives the DEC-07 fallback action. |
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

## 6. Quality requirements

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
| NFR-08 | Zero open Critical/High defects and 100% critical workflow tests pass before UAT exit. | Entire R1; EN-08 | Defect register and signed UAT/inspection result |

### 6.1 Test-suite index

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

## 7. KPI plan

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

## 8. Readiness and Done controls

### 8.1 Definition of Ready

A story is Ready only when actor/value, acceptance criteria, dependencies, design/contract inputs, decision owners and a Development Team estimate are present. A story blocked by DEC-03/05/07/09 is not Ready. “Sizing pending” is not an estimate.

### 8.2 Definition of Done

- Acceptance criteria and applicable NFRs pass with retained evidence; Product Owner accepts the behavior.
- Code follows standards, is peer-reviewed, builds without errors and has appropriate unit/integration/E2E/negative tests.
- PostgreSQL-backed concurrency, authorization and outbox behavior are tested where applicable; mocks do not prove those invariants.
- Migration, API contract, audit/telemetry and documentation are updated; no real secret or unnecessary PII is tracked/logged.
- Integrated build is deployed to the target environment, smoke-tested by another member and has no open Critical/High defect.
- Release Backlog, plan/schedule, user/deployment guidance and evidence links are updated.

This operationalizes [Scrum, Slides 035–036](https://github.com/tnnhuaa/InterviewQuestionBank/blob/05ff4b99ae133de9b0f7c2f0de3585390b933718/docs/refs/04-02-scrum-development-process.md#slide-035--example-dod-1) and “production-ready” from [Agile Quality, Slide 016](https://github.com/tnnhuaa/InterviewQuestionBank/blob/05ff4b99ae133de9b0f7c2f0de3585390b933718/docs/refs/11-1-agile-quality-management.md#slide-016--9-create-definition-of-done).

## 9. Requirements Traceability Matrix

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

## 10. Release and estimate reconciliation

Release R1 is a fixed-date proposal of six two-week sprints from 17/08/2026 through 08/11/2026. A release should focus on a small set of minimum releasable features with stakeholder consensus and be replanned every sprint ([Agile Planning, Slides 011 and 014–016](https://github.com/tnnhuaa/InterviewQuestionBank/blob/05ff4b99ae133de9b0f7c2f0de3585390b933718/docs/refs/06-1-agile-planning.md#slide-011--2-create-a-product-roadmap)).

| Item | Reconciled value | Limitation |
|---|---|---|
| Proposed MRF / Release Backlog | US-01–US-20 = **92 proposed SP** plus EN-01–EN-08 as traced gates | PO/Sponsor approval and Development Team Planning Poker confirmation pending |
| Stretch/Future | US-21–US-22 = **8 SP** / US-23 = **8 SP** | Must work and reserves cannot be consumed silently |
| Committed capacity proposal | `816 + 12 × h_TA × 0.85` hours after 15% reserve | 816 hours is the original five-member proposal; Tuấn Anh must confirm weekly hours before team/PM/Sponsor rebaseline |
| Working estimate | 688 hours bottom-up + three-point | Work-package estimate, not a sum of story estimates |
| Independent guardrail | 756 hours top-down count/compute | Based on 20 Must stories and judgment; recalibrate after PoC/sprint actuals |
| Planning buffer | 128 hours versus 688-hour forecast | Reserve is for uncertainty/quality, not added scope |
| Required average velocity for all Must* | `92 / 6 = 15.3 SP/sprint` | A requirement of the proposal, not evidence that the team can achieve it |
| Will-have/might-have line | **Not computable yet** | Proposed SP now exist, but no Planning-Poker-confirmed estimates or measured velocity range; PB-G05 remains Conditional |

Milestone alignment is Discovery/Charter → Requirements/Prototype → Foundation → Question Bank → Marketplace/Feedback → UAT/Release. It is not a per-story sprint commitment until the Development Team confirms the proposed estimates and supplies a velocity range.

## 11. Canonical decision register

| ID | Decision | Owner | Reconciled status / impact |
|---|---|---|---|
| DEC-01 | Sponsor, PO, PM, Team Lead and acceptance authority | Sponsor/group | **Proposed resolved:** Hưng PO, Gia Thành PM/Scrum Master, Tuấn Anh repository/document bootstrap contributor and Team Lead/Integration & Document Control, instructor Sponsor; formal acceptance record pending |
| DEC-02 | First pilot segment, sample size, Mentor/booking absolute targets | PO/Research | Open; blocks executable market/pilot plan |
| DEC-03 | Cancel/reschedule/no-show/completion authority, cutoff and evidence policy | PO/Operations | Open; blocks readiness of US-12/13/15/20 and reschedule occupancy design |
| DEC-04 | Free/manual payment or credit treatment during pilot | PO/Sponsor | Open; payment automation remains out of scope, but terms/operations need a decision |
| DEC-05 | Retention, deletion, privacy notice and consent policy | PO/Privacy owner | Open; blocks final privacy acceptance/NFR evidence |
| DEC-06 | Date, capacity, budget and estimate baseline | Team/PM/Sponsor | **Partially resolved:** 12 weeks, original five-member 816 hours, 688-hour working estimate, 756-hour guardrail, 1,125,000 VND cash ceiling and 92 proposed R1 Must SP; Planning Poker, velocity, Tuấn Anh's `h_TA` and formal acceptance remain pending |
| DEC-07 | Meeting-link creation/update authority and provider-outage fallback | PO/Technical | Open; affects US-14/AC-14-02 |
| DEC-08 | US-17 review and minimal US-20 operations in the MRF | PO | **AI proposal: include as Must** to match Proposal/Charter/20-story estimate; PO inspection pending |
| DEC-09 | Reminder cadence, timezone, suppression and fallback | PO/Operations | Open; US-22 remains Stretch/not Ready |

These IDs are canonical across Vision, Workflow and Backlog; DEC-04 and DEC-05 are no longer reused for unrelated MRF/reminder decisions.

## 12. Change control and human inspection

After approval, a change to order, release class, BR, AC, dependency, NFR or decision must record origin/evidence, impacted stories/deliverables, value, estimate/cost/schedule/risk and verification. Scope acceptance is performed by stakeholder inspection, not by an AI status label ([Monitoring, Slides 039–040](https://github.com/tnnhuaa/InterviewQuestionBank/blob/05ff4b99ae133de9b0f7c2f0de3585390b933718/docs/refs/09-software-project-monitoring-and-control.md#slide-039--9-validate-scope)).

- [ ] PO confirms Order 1–23, R1 Must*/Stretch/Future boundary and DEC-08.
- [ ] Development Team confirms/revises the 108-SP proposal through Planning Poker, estimates any independently scheduled enabler, and supplies a velocity range; PM then draws will-have/might-have lines.
- [ ] PO/Operations closes DEC-03/07/09; PO/Privacy closes DEC-05.
- [ ] Member 2 supplies clickable prototype, handoff and observed usability evidence.
- [ ] Member 4 replaces self-declared PoC results with assertions/evidence for EN-03–EN-07 and removes repository hygiene/security gaps.
- [ ] Member 5 reviews reschedule occupancy and updates ADR status only after valid PoC evidence.
- [ ] Tuấn Anh runs integration/document-control inspection, verifies the W10 tree, cross-document semantics, PR evidence and integrated smoke path before merge/release.
- [ ] Every R1 story is walked through by customer/PO and team for understandability, value and verifiability.
- [ ] Sponsor/PO records Accept/Revise and any change requests before status becomes Approved.

## 13. Ref compliance index and readiness

| Criterion | Ref | Location/result |
|---|---|---|
| Comprehensive backlog | [Scrum, Slide 014](https://github.com/tnnhuaa/InterviewQuestionBank/blob/05ff4b99ae133de9b0f7c2f0de3585390b933718/docs/refs/04-02-scrum-development-process.md#slide-014--the-product-backlog) | Sections 2–12; **Pass structurally** |
| Highest-value-first PO ordering | [Scrum, Slide 015](https://github.com/tnnhuaa/InterviewQuestionBank/blob/05ff4b99ae133de9b0f7c2f0de3585390b933718/docs/refs/04-02-scrum-development-process.md#slide-015--the-product-owner-2) | Section 3; **Conditional on PO audit** |
| Release stories/object mapping | [Scrum, Slide 019](https://github.com/tnnhuaa/InterviewQuestionBank/blob/05ff4b99ae133de9b0f7c2f0de3585390b933718/docs/refs/04-02-scrum-development-process.md#slide-019--release-backlog) | Sections 3, 9–10; **Pass structurally** |
| MRF/story map/replanning | [Agile Planning, Slides 011, 014–016](https://github.com/tnnhuaa/InterviewQuestionBank/blob/05ff4b99ae133de9b0f7c2f0de3585390b933718/docs/refs/06-1-agile-planning.md#slide-011--2-create-a-product-roadmap) | Sections 3 and 10; **Conditional** |
| Created/estimated/prioritized PBIs and velocity range | [Agile Planning, Slides 021–025](https://github.com/tnnhuaa/InterviewQuestionBank/blob/05ff4b99ae133de9b0f7c2f0de3585390b933718/docs/refs/06-1-agile-planning.md#slide-021--7-create-a-fixed-date-release-plan-i) | Sections 3.1 and 10; **Conditional: 108 proposed SP exist, but team confirmation and velocity range are absent** |
| Understandable/value/verifiable | [Planning, Slide 079](https://github.com/tnnhuaa/InterviewQuestionBank/blob/05ff4b99ae133de9b0f7c2f0de3585390b933718/docs/refs/06-software-project-planning.md#slide-079--sales-tip-5-real-business-requirements) | Sections 3, 5 and 9; **Conditional on human walkthrough** |
| DoD and production-ready evidence | [Scrum, Slides 035–036](https://github.com/tnnhuaa/InterviewQuestionBank/blob/05ff4b99ae133de9b0f7c2f0de3585390b933718/docs/refs/04-02-scrum-development-process.md#slide-035--example-dod-1) | Sections 4 and 8; **Definition passes; implementation evidence fails/pending** |
| RTM and inspection | [Monitoring, Slides 039–042](https://github.com/tnnhuaa/InterviewQuestionBank/blob/05ff4b99ae133de9b0f7c2f0de3585390b933718/docs/refs/09-software-project-monitoring-and-control.md#slide-039--9-validate-scope) | Sections 9 and 12; **RTM passes; acceptance pending** |
| 100% in-scope work | [WBS, Slide 033](https://github.com/tnnhuaa/InterviewQuestionBank/blob/05ff4b99ae133de9b0f7c2f0de3585390b933718/docs/refs/05-1-work-breakdown-structure.md#slide-033--the-100-rule) | Sections 3–4 and 10; **Pass structurally; estimate reconciliation pending team** |

**Readiness:** `Conditionally ready for Hưng’s human audit; not an Approved Product/Release Backlog.` The document is complete enough to review, but PB-G02, PB-G03, PB-G05, PB-G06 and PB-G07 cannot pass until the named humans produce decisions, estimates, test evidence and acceptance records.

## 14. Cross-branch consistency appendix

This appendix preserves cross-branch inspection evidence inside the required Product Backlog artifact. It is not a separate audit deliverable or an additional file. A specification, proposed planning baseline, implementation artifact and verified result are different evidence classes; no implementation is marked Pass without an asserted result.

| ID | Severity | Cross-document discrepancy | Canonical response / exit evidence |
|---|---|---|---|
| CONS-01 | High | No Member 2 remote branch, clickable frames, handoff or observed usability result was found. | EN-01 remains Gap until Hùng publishes immutable prototype and observed task evidence mapped to stories/ACs. |
| CONS-02 | Medium | Feasibility on remote `main` says schedule/resources are unresolved while EV-01 proposes concrete values. | DEC-06 records a proposed baseline only; PM updates Feasibility after Sponsor acceptance. |
| CONS-03 | High | Earlier documents reused DEC-04/05 for different topics. | Canonical DEC-01..09 meanings in section 11 and synchronized Vision/Workflow supersede the collision. |
| CONS-04 | High | A confirmed-source reschedule may release the old slot if implementation replaces `CONFIRMED` with an index-excluded state. | BR-02 and AC-12-03 require old-slot protection; PO/Architecture must select and test the mechanism under DEC-03. |
| CONS-05 | Medium | Feasibility names five product-risk PoCs while ADR-001 adds build and deployed-session checks. | EN-03..07 are the five product-risk gates; EN-02 owns the two delivery/stack gates. |
| CONS-06 | High | Architecture expects `poc/mentor-booking-feedback/README.md`, `POC_Result.md`, migrations/tests/contracts; the inspected PoC uses another root and lacks those results. | Trí publishes the required structure, commands, asserted Pass/Fail evidence and limitations. |
| CONS-07 | Critical | The 100-request script targets a nonexistent route; the runner tests two calls against one booking instead of at least 20 competing bookings for one slot. | EN-03 fails until AC-12-01 is proven on real PostgreSQL with invariant, transition and event assertions. |
| CONS-08 | Critical | The PoC trusts caller-controlled `X-User-Id` and lacks owning-Mentor/role checks on critical mutations. | EN-02/04 fail until the accepted session topology and negative role/relationship matrix pass. |
| CONS-09 | High | The PoC index covers only `Confirmed`; audit lacks actor/reason; idempotency is absent; lock order differs from ADR-002. | Align migration/service with BR-02/08/10 and ADR, or revise ADR through recorded design review and tests. |
| CONS-10 | High | Question evidence proves one tag-intersection example but not lifecycle/provenance, zero/one/many, pagination or deterministic sort. | EN-06 remains Partial until TC-Q passes completely. |
| CONS-11 | Critical | Notification test increments its pass count without an assertion; worker lacks deduplication, safe claim, backoff and Dead/manual state. | EN-07 fails until deterministic fake-provider and competing-worker database assertions pass. |
| CONS-12 | Critical | The remote PoC tree tracks `poc/.env` and generated dependencies. No secret value was read in this audit. | Remove tracked generated/secret files, rotate any real credential, add ignore/secret checks and retain evidence. |
| CONS-13 | High | The PoC UI is a narrow demo, not the complete S/M/A prototype specification or usability result. | Treat it as partial implementation; EN-01 remains open. |
| CONS-14 | High | EV-01’s 688/756-hour values are whole-release forecasts for the original five-member plan, not measured velocity or a six-member rebaseline; this document adds a separate 92-SP R1 proposal. | Team validates SP through Planning Poker; Tuấn Anh confirms `h_TA`; PM records revised capacity, velocity range and will-have/might-have lines before commitment. |
| CONS-15 | Medium | EV-01 counts 20 Must stories while US-17/20 minimality previously remained open. | DEC-08 proposes both as Must to match Proposal/Charter/estimate; PO confirms or rebaselines explicitly. |

### 14.1 Static validation retained with this artifact

| Check | Result |
|---|---|
| Product model | 6 OBJ, 23 US, exactly 20 proposed R1 Must = 92 SP, 108 SP across all stories, 11 BR, 31 AC, 10 RQ, 8 EN, 8 NFR, 9 DEC, 10 TC, 8 PB gates, 12 FS and 15 CONS |
| Acceptance coverage | Every US-01..US-23 has at least one AC |
| ID/dependency integrity | Zero undefined ID, invalid dependency, duplicate order or cycle node |
| Markdown quality | PASS after final tree cleanup: 5 local links, 0 missing target, 0 odd fence, 0 trailing-whitespace line and 0 table-column error across the retained Markdown set |
| Evidence limitation | Static documentation checks do not execute the PoC, application build, UAT or observed KPI |
