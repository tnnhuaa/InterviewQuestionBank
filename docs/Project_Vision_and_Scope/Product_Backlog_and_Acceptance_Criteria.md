# Interview Practice Platform — Product Backlog and Acceptance Criteria

## 1. Purpose

This document converts the approved JD-first product scope and target workflow into an ordered, testable Product Backlog. It defines user stories, priority, dependency, Story Points, acceptance criteria, quality requirements, traceability and release controls. A comprehensive backlog and value-first Product Owner ordering are required by [Scrum, Slides 014–015](https://github.com/tnnhuaa/InterviewQuestionBank/blob/05ff4b99ae133de9b0f7c2f0de3585390b933718/docs/refs/04-02-scrum-development-process.md#slide-014--the-product-backlog).

### 1.1 Release boundary

| Scope | Decision |
|---|---|
| R1 Must | Authentication/RBAC; JD text/file intake; direct extraction/OCR fallback; correction; requirement/taxonomy analysis; explainable Question mapping; preparation plan; Question Bank; mentor verification/availability; plan-linked booking; external meeting handoff; feedback/review; minimal administration and reliable booking notification |
| R1 Stretch | Basic progress dashboard and scheduled session reminders |
| Future | Bulk Question import, semantic/ML recommendation, automated interviewer/scoring, broad OCR coverage, built-in video/recording/transcription, automated payment/payout, native mobile and ATS integration |

### 1.2 Business rules

Business rules use stable IDs and record their source/owner and changeability as described by [User Requirements, Slide 007](https://github.com/tnnhuaa/InterviewQuestionBank/blob/05ff4b99ae133de9b0f7c2f0de3585390b933718/docs/refs/03-2-user-requirements.md#slide-007--business-rules).

| ID | Rule | Source/owner | Changeability |
|---|---|---|---|
| BR-01 | Only an `Approved` Mentor may publish a profile/slot and receive a booking. | Product scope / PO | Medium |
| BR-02 | A slot may be owned by at most one booking in an occupying state. A confirmed booking retains its old slot while reschedule is unresolved. | Booking integrity / Architecture | Low |
| BR-03 | A booking requires an available slot, target/interview context and a meaningful goal. | Product workflow / PO | Medium |
| BR-04 | Only the Student/Mentor belonging to a booking and an authorized Admin may access its private booking data, meeting link or feedback. | Security/privacy policy | Low |
| BR-05 | Feedback can be created only after the booking is `Completed`, by the authorized Mentor. | Product workflow / PO | Medium |
| BR-06 | The booking Student may create at most one review after a valid `Completed` booking. | Product workflow / PO | Medium |
| BR-07 | A Question is public or matchable only when `Published` and has valid taxonomy and provenance. | Content policy / PO | Medium |
| BR-08 | Every booking transition uses one canonical state machine and records from/to state, actor, reason when required and timestamp. Cancellation/reschedule/no-show/completion details follow the approved policy. | Booking policy / PO, PD-02 | High until approved |
| BR-09 | Notification failure never rolls back or controls booking state. Delivery uses retry, deduplication and an operable failure state. | Reliability decision / Architecture | Low |
| BR-10 | Create-booking and critical transitions are retry-safe; an idempotency key cannot create duplicate state/event effects. | Reliability decision / Architecture | Low |
| BR-11 | Meeting links, verification evidence, feedback and private profile data are not public or logged in full; retention/deletion follow approved privacy policy. | Privacy policy / PO, PD-03 | Medium |
| BR-12 | PoC accepts pasted JD text or one PDF/PNG/JPEG file up to 10 MB. Page/language/time limits remain configured decisions; unsupported, corrupt, encrypted, empty, over-limit or unsafe input is rejected before analysis. Applying the PoC limits to MVP requires PD-06 ratification. | ADR-004 / PO & Architecture, PD-06 | Medium until MVP ratification |
| BR-13 | Direct text extraction is used for pasted text/text-bearing PDF; internal OCR fallback is used only for PNG/JPEG or a PDF scan that needs it. Extraction/OCR has explicit status, version and safe failure. | ADR-004 / Architecture, PD-07 | Low for PoC; Medium for MVP operation |
| BR-14 | The Student must view, edit and confirm a corrected-text version before analysis. Changing the confirmed version invalidates derived requirement, match and plan data for regeneration. | Product workflow / PO | Low |
| BR-15 | Each detected requirement retains raw evidence and normalization status; unknown terms remain unmapped instead of being asserted as a taxonomy topic. | JD analysis scope / PO & Content | Medium |
| BR-16 | Question mapping uses the confirmed text, approved taxonomy/alias set and a matching version. Each result stores requirement source, topic, score/reason and Question ID; the same input/version is deterministic. | Mapping scope / PO & Content, PD-08 | Medium |
| BR-17 | A preparation plan belongs to one Student, references its JD and selected versioned matches, and preserves history when feedback changes next actions. | Product workflow / PO | Medium |
| BR-18 | Every R1 booking references a JD or preparation plan owned by the booking Student. The owning Mentor sees only the minimum context needed for the session. | Product/privacy scope / PO | Low |
| BR-19 | Original JD files, extracted/corrected text, requirements, matches and plans are private. Access, retention, deletion and logging follow the approved JD-data policy. | Privacy/upload policy / PO, PD-03/06 | High until approved |

The PoC technical baseline used by BR-12/13 is recorded by the Architecture owner in [ADR-004 at commit `54e1113`](https://github.com/tnnhuaa/InterviewQuestionBank/blob/54e1113113f6ada9c0ecec565eb8f883966d18f9/docs/Project_Architecture/ADR/ADR-004-JD-Processing-and-Question-Matching.md). Product decisions PD-06/07 retain the items that ADR-004 explicitly leaves configurable or pending MVP ratification.

### 1.3 Booking-state vocabulary

| Business state | API/storage token | Slot occupancy | Meaning |
|---|---|---|---|
| Pending | `PENDING` | No | Student request awaits Mentor decision |
| Confirmed | `CONFIRMED` | Yes | Mentor accepted and the slot is reserved |
| Reschedule proposed | `RESCHEDULE_PROPOSED` | New slot: no; old slot: retained | The other party must accept/reject the proposal |
| Rejected | `REJECTED` | No | Mentor rejected the current request |
| Cancelled | `CANCELLED` | No | Authorized cancellation completed under policy |
| Completed | `COMPLETED` | Historical ownership | Session occurred and completion was recorded |
| No-show | `NO_SHOW` | Conditional | Attendance exception; enabled only after authority/evidence policy approval |

UI labels may be localized, but contracts, tests and documents must map to these semantic states.

## 2. Product Backlog

The backlog is ordered by value and dependency. R1 contains 27 Must stories; US-21–US-22 are Stretch and US-23 is Future. Existing IDs US-01–US-23 remain unchanged; the JD-first scope is added as US-24–US-30. Story Points are relative size estimates, not hours, and require Development Team confirmation during refinement.

| Order | ID | Epic | User story | Value / objective | Release | Dependencies | Trace | SP | Readiness/status |
|---:|---|---|---|---|---|---|---|---:|---|
| 1 | US-01 | Identity | As a user, I want to register and sign in so my personal data is protected. | Foundation/privacy | R1 Must | — | RQ-01; BR-04/11/19 | 8 | High-risk session and verification slice |
| 2 | US-02 | Identity | As an Admin, I want Student/Mentor/Admin roles enforced so functions and data are appropriately restricted. | Security invariant | R1 Must | US-01 | RQ-01; BR-04/19 | 3 | Role/object matrix required |
| 3 | US-24 | JD intake | As a Student, I want to paste or upload a Job Description so preparation starts from the role I am applying for. | OBJ-02; core entry | R1 Must | US-01 | RQ-11; BR-12/19; FS-01 | 5 | Upload limits/security decision required |
| 4 | US-25 | JD extraction | As a Student, I want text extracted directly or by OCR when needed so I can review the JD content. | OBJ-02; input usability | R1 Must | US-24 | RQ-11; BR-13/19; FS-02 | 8 | OCR/failure strategy is a split candidate |
| 5 | US-26 | JD correction | As a Student, I want to review, correct and confirm extracted text so analysis uses an accurate version. | OBJ-02; quality gate | R1 Must | US-25 | RQ-11; BR-14/19; FS-03 | 3 | Version invalidation must be explicit |
| 6 | US-27 | JD analysis | As a Student, I want position, seniority, skills, technologies and requirements detected and normalized so I understand the JD. | OBJ-03; insight | R1 Must | US-26 | RQ-12; BR-14/15/19; FS-04 | 8 | Labeled test set and taxonomy ownership required |
| 7 | US-03 | Student | As a Student, I want to save my target position and interview goal so practice and booking use the same context. | OBJ-03/06; context | R1 Must | US-01 | RQ-02; BR-03; FS-04 | 2 | Small profile/context persistence slice |
| 8 | US-18 | Content admin | As an Admin, I want to manage/moderate Questions and taxonomy so only governed content is published. | Mapping/content prerequisite | R1 Must | US-02 | RQ-03/10/12; BR-07/08; FS-05 | 5 | Taxonomy/alias governance included |
| 9 | US-28 | Question mapping | As a Student, I want JD requirements mapped to governed Questions so I know what to practice. | OBJ-04; core value | R1 Must | US-18, US-27 | RQ-12; BR-07/15/16; FS-05 | 8 | Determinism/relevance work is a split candidate |
| 10 | US-29 | Preparation plan | As a Student, I want each suggested Question explained and organized in a preparation plan so I can choose the next action. | OBJ-04/05; activation | R1 Must | US-28 | RQ-12; BR-16/17/19; FS-06 | 5 | Requires reason/content and plan ownership |
| 11 | US-04 | Questions | As a Student, I want to browse/search/filter governed Questions so I can explore or extend my plan. | OBJ-05; self-practice | R1 Must | US-02, US-18 | RQ-03; BR-07; FS-07 | 5 | Filter, pagination and visibility rules |
| 12 | US-05 | Questions | As a Student, I want Question detail and answer criteria so I know what a good response should cover. | OBJ-05; self-practice | R1 Must | US-04 | RQ-03; BR-07; FS-07 | 2 | Read-only detail on Question model |
| 13 | US-06 | Practice | As a Student, I want to bookmark and track practice state so I can resume and act on the plan/feedback. | OBJ-05/08; retention | R1 Must | US-04 | RQ-03; BR-04; FS-07/14 | 3 | Per-user state and authorization |
| 14 | US-07 | Mentor | As a Mentor, I want to create a profile and submit verification so I can offer a trusted service. | Supply | R1 Must | US-01 | RQ-04; BR-01/11; FS-08 | 5 | Profile and verification lifecycle |
| 15 | US-08 | Mentor admin | As an Admin, I want to approve/reject Mentor verification with a reason so public supply is governed. | Trust/supply gate | R1 Must | US-02, US-07 | RQ-04; BR-01/08; FS-08 | 3 | Approval transition and audit |
| 16 | US-09 | Availability | As an Approved Mentor, I want to manage future slots so Students see valid availability. | Booking enablement | R1 Must | US-08 | RQ-05; BR-01/02; FS-08 | 5 | Time validation and occupied-slot constraints |
| 17 | US-10 | Marketplace | As a Student, I want to find Approved Mentors by plan topic and availability so I can choose a suitable session. | OBJ-05/06; discovery | R1 Must | US-08, US-09, US-29 | RQ-05; BR-01; FS-08 | 3 | Plan-topic and availability query |
| 18 | US-30 | Plan-to-booking | As a Student, I want to attach my JD or preparation plan to a Mentor booking so the Mentor receives the right practice context. | OBJ-06; context handoff | R1 Must | US-10, US-29 | RQ-13; BR-17/18/19; FS-09 | 5 | Minimum-context/privacy contract required |
| 19 | US-11 | Booking | As a Student, I want to send a booking with my goal and JD/plan context so the Mentor can decide. | OBJ-06; conversion | R1 Must | US-03, US-30 | RQ-06/13; BR-02/03/10/18; FS-09 | 5 | Booking creation with concurrency/idempotency |
| 20 | US-12 | Booking | As the owning Mentor, I want to accept, reject or propose a new time so a booking reaches a valid next state. | OBJ-06; lifecycle | R1 Must | US-11 | RQ-06; BR-02/08/10; FS-10 | 8 | Policy must be approved before Ready |
| 21 | US-13 | Booking | As a booking party, I want to cancel or resolve a reschedule under a clear policy so exceptions do not require hidden coordination. | OBJ-06; operations | R1 Must | US-12 | RQ-06; BR-02/08/10; FS-10 | 8 | Policy and story split review required |
| 22 | US-14 | Session | As a booking party, I want authorized access to the external meeting link when Confirmed so I can attend safely. | OBJ-06; session handoff | R1 Must | US-12 | RQ-07; BR-04/11; FS-11/12 | 3 | Link authority/fallback required |
| 23 | US-19 | Notification | As a user, I want reliable booking-event notifications so I know the next action even when the provider temporarily fails. | OBJ-06; coordination | R1 Must | US-11 plus event-producing stories | RQ-09; BR-09/10; FS-11 | 8 | Outbox, retry and deduplication risk |
| 24 | US-15 | Feedback | As the owning Mentor, I want to submit structured feedback after completion so the Student receives actionable guidance. | OBJ-07/08; core value | R1 Must | US-14 | RQ-08; BR-04/05/08; FS-13 | 5 | Completion authority required |
| 25 | US-16 | Feedback | As the booking Student, I want to view feedback and next actions so I can update my preparation plan. | OBJ-07/08; learning loop | R1 Must | US-15 | RQ-08; BR-04/11/17; FS-14 | 3 | Authorized feedback/plan action |
| 26 | US-17 | Review | As the booking Student, I want to review the Mentor after completion so future Students receive trust signals. | Marketplace trust | R1 Must | US-15 | RQ-08; BR-06; FS-14 | 3 | One review per completed booking |
| 27 | US-20 | Operations | As an authorized Admin, I want to resolve reports and booking exceptions so the pilot can operate safely. | Trust/operability | R1 Must | US-02, US-13, US-17 | RQ-10; BR-01/07/08/11/19 | 5 | Minimal governed operations slice |
| 28 | US-21 | Progress | As a Student, I want a basic progress dashboard so I can see what to practice next. | OBJ-08; retention | R1 Stretch | US-06, US-16 | RQ-03; FS-14 | 5 | Outside proposed Must commitment |
| 29 | US-22 | Reminder | As a booking party, I want a scheduled reminder so I am less likely to miss a session. | OBJ-06; completion rate | R1 Stretch | US-19 | RQ-09; BR-09; FS-11 | 3 | Reminder policy required |
| 30 | US-23 | Import | As an Admin, I want governed bulk Question import so content operations can scale without bypassing moderation. | Content efficiency | Future/Could | US-18 | RQ-03/10; BR-07/08 | 8 | Validation/partial-failure split candidate |

R1 selection becomes a delivery commitment only after Product Owner approval, Development Team Planning Poker and velocity-range review.

### 2.1 Story-point method and totals

- Story Points express relative overall size, not hours ([Agile Estimation, Slide 005](https://github.com/tnnhuaa/InterviewQuestionBank/blob/05ff4b99ae133de9b0f7c2f0de3585390b933718/docs/refs/05-3-agile-estimation.md#slide-005--estimating-size-with-story-points-1)).
- Estimates use the Fibonacci scale `1, 2, 3, 5, 8`; wider gaps represent greater uncertainty ([Slide 008](https://github.com/tnnhuaa/InterviewQuestionBank/blob/05ff4b99ae133de9b0f7c2f0de3585390b933718/docs/refs/05-3-agile-estimation.md#slide-008--the-estimation-scale)). They are initial analogy/disaggregation estimates and require Planning Poker confirmation ([Slides 009–013](https://github.com/tnnhuaa/InterviewQuestionBank/blob/05ff4b99ae133de9b0f7c2f0de3585390b933718/docs/refs/05-3-agile-estimation.md#slide-009--deriving-an-estimate-analogy-1-2)).
- Each SP covers a complete vertical story through implementation, test, documentation and acceptance evidence. EN-01–EN-09 are quality/delivery gates already covered by related stories; an independently scheduled enabler must be estimated separately and related stories rechecked to avoid double counting.
- `US-03 = 2 SP` remains the small persistence anchor; bounded end-to-end work is generally `3–5 SP`; `8 SP` marks uncertainty or a split candidate. US-01, US-12, US-13, US-19, US-23, US-25, US-27 and US-28 require split review before sprint commitment.

| Backlog bucket | Stories | Initial SP | Planning interpretation |
|---|---:|---:|---|
| R1 Must | 27 | 134 | Requires average `134 / 6 = 22.3 SP/sprint`; feasibility awaits velocity range and rebaseline |
| R1 Stretch | 2 | 8 | US-21 = 5, US-22 = 3; only after Must work and reserves are safe |
| Future/Could | 1 | 8 | US-23; excluded from R1 |
| Entire Product Backlog | 30 | 150 | Relative-size estimate pending Development Team confirmation |

## 3. Cross-cutting and delivery PBIs

| ID | PBI / exit outcome | Supports | Release gate |
|---|---|---|---|
| EN-01 | Discovery, prototype and usability evidence establish the JD-preparation problem/MRF baseline. | US-24–US-30; core flow | Before baseline |
| EN-02 | Architecture/runtime/session/CI foundation passes independent frontend build, backend test/migration and session/CSRF gates. | Entire R1 | Foundation |
| EN-03 | PostgreSQL test proves one occupied booking for ≥20 competing confirmations, stable conflicts, idempotency and one transition/outbox event. | US-11–US-13 | Booking gate |
| EN-04 | Server-side role/ownership matrix protects JD, plan, booking, meeting link, feedback and verification. | US-01/02/07/08/11–20/24–30 | Security gate |
| EN-05 | Canonical state machine/audit cover happy, invalid, reschedule, cancel, complete and no-show paths. | US-12/13/15/20 | Lifecycle gate |
| EN-06 | Question filtering and matching prove no Draft leakage, deterministic order, taxonomy validity and provenance. | US-04/18/27–29 | Content/mapping gate |
| EN-07 | Transactional outbox proves booking commit under provider failure, deduplication, competing workers, retry/backoff and manual failure action. | US-19/22 | Reliability gate |
| EN-08 | Integrated build, security/negative tests, performance profile, backup/restore, UAT, deployment and guides satisfy DoD. | Entire R1 | Release gate |
| EN-09 | JD PoC proves direct extraction/OCR routing, correction gate, alias normalization, stable explainable mapping and plan-to-booking handoff on a labeled test set. | US-24–US-30 | JD gate |

## 4. Acceptance criteria

Acceptance criteria are verification contracts, not claims that a feature is implemented. Risky flows include happy, negative, boundary, malicious, authorization, concurrency and provider-failure cases as required by [Software Quality Management, Slide 007](https://github.com/tnnhuaa/InterviewQuestionBank/blob/05ff4b99ae133de9b0f7c2f0de3585390b933718/docs/refs/11-software-quality-management.md#slide-007--how-to-meet-user-requirements).

| AC ID | Story | Type | Given / When / Then acceptance criterion |
|---|---|---|---|
| AC-01-01 | US-01 | Happy/security | Given a valid unregistered email, when registration and verification succeed, then one account is created and no plaintext credential/secret appears in storage or logs. |
| AC-01-02 | US-01 | Session | Given an authenticated user, when the session is created/expired/revoked, then access follows server-side policy; the client cannot assert identity/role through a trusted header. |
| AC-02-01 | US-02 | Authorization | Given an actor without the required role/relationship, when a protected route is called, then it returns a safe denial, changes no data and reveals no sensitive object content. |
| AC-03-01 | US-03 | Validation | Given a signed-in Student, when valid target position, interview type and goal are saved, then they persist; invalid fields produce errors without unintended partial data. |
| AC-04-01 | US-04 | Boundary | Given zero/one/many Published Questions and multi-tag Questions, when filters/pagination/sort apply, then results are deterministic, non-duplicated and never expose Draft/Archived content. |
| AC-05-01 | US-05 | Visibility | Given a Published Question, when detail opens, then content, taxonomy, answer criteria and provenance appear; non-public content remains unavailable. |
| AC-06-01 | US-06 | Ownership | Given a signed-in Student, when bookmark/practice state changes, then private state persists and another Student cannot read/modify it. |
| AC-07-01 | US-07 | State/privacy | Given complete Mentor data and consent, when verification is submitted, then status becomes Pending and evidence remains restricted; incomplete data is rejected. |
| AC-08-01 | US-08 | Authorization/audit | Given Pending verification, when an authorized Admin approves/rejects with a reason, then status, actor, reason and timestamp are recorded; a non-Admin cannot decide. |
| AC-09-01 | US-09 | Boundary/state | Given an Approved Mentor, when a future non-overlapping slot with timezone is created, then it persists; past/invalid/overlapping slots or unapproved Mentor are rejected. |
| AC-10-01 | US-10 | Visibility | Given plan topics and public Mentor/slot data, when a Student filters, then only Approved Mentors matching expertise/availability appear and empty states are distinguishable. |
| AC-11-01 | US-11 | Happy/validation | Given an available slot and a JD/plan owned by the Student, when required context is submitted, then exactly one Pending booking is created; foreign/missing context or invalid slot is rejected. |
| AC-11-02 | US-11 | Idempotency | Given a request/idempotency key, when the same request is retried, then the original result returns with no duplicate booking/event; a different payload with that key returns stable conflict. |
| AC-12-01 | US-12 | Concurrency | Given ≥20 Pending bookings competing for one slot, when confirmations run concurrently on PostgreSQL, then exactly one occupies it; losers receive stable conflict and only one logical transition/outbox event exists. |
| AC-12-02 | US-12 | Transition | Given Pending booking and owning Mentor, when Reject or ProposeReschedule uses valid input, then the canonical transition/audit commits atomically; other actors are rejected. |
| AC-12-03 | US-12 | Invariant | Given an unresolved reschedule from Confirmed, when it is pending, then the old slot stays protected and the proposed slot is not occupied until atomic acceptance. |
| AC-13-01 | US-13 | Policy | Given an allowed state and authorized party, when cancel/propose/accept/reject reschedule occurs, then approved guards apply and state/slot/audit are consistent; invalid transitions have no partial effect. |
| AC-13-02 | US-13 | Race | Given two reschedules competing for one new slot, when accepted concurrently, then only one obtains it and the loser retains a policy-defined safe state. |
| AC-14-01 | US-14 | Authorization | Given a Confirmed booking, when its Student/Mentor opens detail, then the meeting link is available; unrelated users receive safe denial and no public/log exposure. |
| AC-14-02 | US-14 | Provider/state | Given a non-Confirmed booking or provider outage, when link access occurs, then no unauthorized link is exposed, booking state remains authoritative and configured fallback appears. |
| AC-15-01 | US-15 | State/ownership | Given a Completed booking, when its owning Mentor submits complete rubric, strengths, weaknesses and next action, then one feedback/audit record is created and next action is available to the plan; wrong state/actor/input is rejected. |
| AC-15-02 | US-15 | Privacy | Given feedback exists, when logs, analytics or public/profile routes are inspected, then full feedback content is absent unless policy explicitly authorizes it. |
| AC-16-01 | US-16 | Authorization | Given feedback exists, when the booking Student opens it, then rubric and next actions appear; unrelated users are denied and content is not automatically public. |
| AC-17-01 | US-17 | Uniqueness | Given a Completed booking with no review, when its Student submits a valid review, then one is created; duplicate/wrong actor/state is rejected. |
| AC-18-01 | US-18 | Moderation | Given an authorized Admin, when a Question with valid taxonomy/provenance is published, then it becomes public/matchable and the decision is recorded; incomplete/non-Admin action is rejected. |
| AC-19-01 | US-19 | Provider failure | Given a committed booking event, when notification times out/fails, then booking remains committed and one deduplicated outbox event enters retryable state. |
| AC-19-02 | US-19 | Worker/recovery | Given competing workers and transient/permanent failures, when jobs process, then one worker claims each job, retry is observable, success becomes Sent and exhausted failure becomes Dead/manual action. |
| AC-20-01 | US-20 | Authorization/audit | Given an open report/exception, when an authorized Admin resolves it, then decision, reason, actor, time and affected record are recorded; restricted notes remain private and state-machine rules are not bypassed. |
| AC-21-01 | US-21 | Value/ownership | Given Student plan/practice/feedback data, when dashboard opens, then it shows only that Student’s real progress/action; no fabricated score or another Student’s data appears. |
| AC-22-01 | US-22 | Scheduling | Given a Confirmed future booking and approved cadence, when reminder time arrives, then one timezone-correct deduplicated reminder is created; cancellation/reschedule suppresses obsolete reminders. |
| AC-23-01 | US-23 | Import/moderation | Given a governed import file, when Admin validates/imports it, then valid rows enter Draft/In-review with provenance, row errors are reported, duplicates are deterministic and nothing auto-publishes. |
| AC-24-01 | US-24 | Input/boundary | Given pasted text or a PDF/PNG/JPEG file no larger than 10 MB and within configured page/time limits, when Student submits it, then one private JobDescription is created with source metadata; empty/unsupported/corrupt/encrypted/over-limit input is rejected without analysis. |
| AC-24-02 | US-24 | Security/privacy | Given a file upload, when type/signature/safety and ownership checks fail, then it is quarantined/rejected, no active content executes, no public URL is issued and logs contain no JD content. |
| AC-25-01 | US-25 | Routing/status | Given a text-bearing file or image/scanned PDF, when extraction starts, then direct extraction is preferred and OCR only handles sources needing it; method/version/status and usable text or safe failure are recorded. |
| AC-25-02 | US-25 | Failure/idempotency | Given extraction timeout/failure or a retried identical job, when processing continues, then status/retry/manual action is explicit and duplicate jobs do not create conflicting text versions or derived data. |
| AC-26-01 | US-26 | Correction/version | Given extracted/pasted text, when Student edits and confirms it, then analysis uses exactly that corrected version; a later edit invalidates derived requirement/match/plan results until regenerated. |
| AC-27-01 | US-27 | Analysis/evidence | Given confirmed text and approved taxonomy/aliases, when analysis runs, then position/seniority/skill/technology/requirement results retain raw evidence; known aliases normalize correctly and unknown terms remain reviewable/unmapped. |
| AC-28-01 | US-28 | Determinism/explanation | Given the same corrected text, taxonomy and matching version, when mapping repeats, then ordered Question IDs, scores and reasons are stable and each result traces to requirement evidence/topic. |
| AC-28-02 | US-28 | Visibility/negative | Given Draft/Archived/invalid-taxonomy Questions or no relevant match, when mapping runs, then those Questions never appear and an honest coverage-gap/empty state is returned without silent threshold change. |
| AC-29-01 | US-29 | Plan/ownership | Given valid matches, when Student reviews selections and creates a plan, then each item keeps requirement/topic/Question/reason/version trace; only the owner can read/change it and no result is presented as guaranteed interview coverage. |
| AC-30-01 | US-30 | Handoff/authorization | Given a Student-owned JD/plan and selected Mentor/slot, when booking is created, then it references that context; the owning Mentor sees only approved fields while unrelated actors and a different Student’s context are denied. |

## 5. Quality requirements

Quality requirements are measurable specification baselines because quality cannot be evaluated without requirements and comparison criteria ([Software Quality Management, Slides 024–027](https://github.com/tnnhuaa/InterviewQuestionBank/blob/05ff4b99ae133de9b0f7c2f0de3585390b933718/docs/refs/11-software-quality-management.md#slide-024--6-define-quality-requirements)).

| ID | Requirement | Story/PBI trace | Verification |
|---|---|---|---|
| NFR-01 | Default-deny server-side role/object authorization protects every private/restricted object, including JD, plan, booking and feedback. | Entire R1; EN-04 | Actor/role/relationship negative matrix on real API |
| NFR-02 | Under the approved pilot profile, non-OCR read/mutation routes target p95 ≤3s and 5xx <1%; OCR/extraction exposes progress and configured timeout rather than blocking without status. | US-04/10–15/24–30; EN-08/09 | Staging load/timing test with deterministic dataset |
| NFR-03 | Exactly one occupied booking per slot under ≥20 concurrent confirmation attempts. | US-12/13; EN-03 | PostgreSQL concurrency test and invariant query |
| NFR-04 | Outbox enqueue is atomic; worker pickup p95 ≤10s while provider operates; failure is observable/recoverable. | US-19/22; EN-07 | Fake-provider integration, metrics and recovery test |
| NFR-05 | TLS 1.2+, accepted session/CSRF controls and secret-free repository/logs protect transport/runtime. | US-01/02/14/24–30; EN-02/08 | Configuration and negative session/CSRF/secret checks |
| NFR-06 | Pilot data has RPO ≤24h and RTO ≤4h. | Entire R1; EN-08 | Backup/restore drill before pilot |
| NFR-07 | Core JD-to-plan and plan-to-booking prototype tasks each achieve ≥80% completion; loading/empty/error/permission/conflict states are usable. | US-24–30 and core Student flow; EN-01 | Observed prototype/UAT report |
| NFR-08 | Zero open Critical/High defects and 100% critical workflow tests pass before UAT exit. | Entire R1; EN-08 | Defect register and signed UAT result |
| NFR-09 | PoC upload accepts PDF/PNG/JPEG up to 10 MB and configured page/time limits, validates signature/content, isolates internal parser/OCR processing and fails safely without active content execution, outbound parser network or public file access. | US-24/25; EN-04/09 | Malformed/polyglot/oversize/encrypted/file-access test suite |
| NFR-10 | Same corrected text, taxonomy/alias set and matching version produces identical ordered matches/reasons; no non-Published Question leaks. | US-27–29; EN-06/09 | Golden dataset repeatability and lifecycle query tests |
| NFR-11 | Original file, text, requirement, match and plan follow least privilege, data minimization, approved retention/deletion and content-free logging/analytics. | US-24–30; EN-04/08 | Authorization matrix, retention/deletion and log inspection |

### 5.1 Test-suite index

| Suite | Verification focus |
|---|---|
| TC-AUTH | Registration/sign-in, session, role escalation, CSRF, expiry/revocation |
| TC-JD | Paste/upload, type/signature/limit, direct extract/OCR routing, corrupt/encrypted/empty input, retry/status and correction version |
| TC-MAP | Requirement evidence, alias normalization, unmapped terms, Published-only deterministic scoring/reason/version and relevance dataset |
| TC-PLAN | Match selection, plan ownership/version/history, feedback next action and plan-to-booking handoff |
| TC-STUDENT | Goal/profile validation, persistence and ownership |
| TC-Q | Zero/one/many results, multi-tag, lifecycle visibility, pagination/sort and provenance |
| TC-M | Verification states, unauthorized decision and public/private profile separation |
| TC-SLOT | Timezone, past/overlap validation, occupying-state invariant and concurrent update |
| TC-B | Booking context/create/transition/reschedule/cancel, idempotency, audit and concurrency |
| TC-SESSION | Confirmed-only meeting-link access, object authorization and provider fallback |
| TC-F | Completed-only feedback, ownership, rubric validation, privacy, plan action and review uniqueness |
| TC-N | Atomic outbox, deduplication, competing workers, retry/backoff, Dead and recovery |
| TC-ADM | Taxonomy/Question moderation, report/exception resolution, restricted notes and audit trail |

## 6. KPI plan

| KPI | Event/source | Formula | Target proposed |
|---|---|---|---:|
| Problem confirmation | Discovery sample | participants confirming JD-preparation pain / valid sample | ≥70% |
| JD intake task completion | Observed usability | completed paste/upload-review-confirm / attempted | ≥80% |
| Extraction success | Supported-input events | inputs reaching editable text / valid supported inputs | ≥90% |
| Requirement recall | Labeled JD test set | expected requirements detected / expected requirements | ≥80% |
| Mapping relevance | Expert review | relevant suggested Questions / reviewed suggestions | ≥80% |
| Mapping explainability | Match records | results with source requirement + topic + reason / results | 100% |
| Plan activation | Product/usability events | users starting Question or Mentor flow / users with valid plan | ≥80% |
| Booking task completion | Observed usability | valid contextual bookings / attempts | ≥80% |
| Booking reliability | Booking events | completed / confirmed | ≥80% |
| Feedback completeness | Feedback records | complete rubric / completed bookings | ≥90% |
| Perceived value | Post-session survey | average score | ≥4/5 |
| Confidence lift | Pre/post survey | average post − pre | ≥1/5 |

KPI evidence validates outcomes; test evidence validates behavior. Neither may be inferred from UI presence, an unasserted script or a generated result without expected-output comparison.

## 7. Readiness and Done controls

### 7.1 Definition of Ready

A story is Ready only when actor/value, acceptance criteria, dependencies, workflow/design/contract inputs, decision owners and a Development Team estimate are present. A story depending on unresolved PD-02–PD-08 is not Ready unless the decision is explicitly included in the sprint with an agreed exit criterion.

### 7.2 Definition of Done

- Acceptance criteria and applicable NFRs pass with retained evidence; Product Owner accepts the behavior.
- Code follows standards, is peer-reviewed, builds without errors and has appropriate unit/integration/E2E/negative tests.
- JD processing tests use known input/expected text/requirement/match outputs; correction, version invalidation, file security and private-object authorization pass where applicable.
- PostgreSQL-backed booking concurrency, state machine, authorization and outbox behavior are tested where applicable; mocks do not prove those invariants.
- Migration, API contract, audit/telemetry and documentation are updated; no real secret or unnecessary JD/PII content is tracked/logged.
- Integrated build is deployed to the target environment, smoke-tested by another member and has no open Critical/High defect.
- Release Backlog, plan/schedule, user/deployment guidance and evidence links are updated.

This operationalizes [Scrum, Slides 035–036](https://github.com/tnnhuaa/InterviewQuestionBank/blob/05ff4b99ae133de9b0f7c2f0de3585390b933718/docs/refs/04-02-scrum-development-process.md#slide-035--example-dod-1) and “production-ready” from [Agile Quality, Slide 016](https://github.com/tnnhuaa/InterviewQuestionBank/blob/05ff4b99ae133de9b0f7c2f0de3585390b933718/docs/refs/11-1-agile-quality-management.md#slide-016--9-create-definition-of-done).

## 8. Requirements Traceability Matrix

| Requirement | Origin/objective | Stories | Rules / acceptance | Workflow / prototype concept | Verification |
|---|---|---|---|---|---|
| RQ-01 Identity/RBAC | Privacy/security | US-01, US-02 | BR-04/11/19; AC-01/02 | Authentication + permission states | EN-02/04; TC-AUTH; NFR-01/05 |
| RQ-11 JD intake/extraction | OBJ-02 | US-24, US-25, US-26 | BR-12/13/14/19; AC-24/25/26 | FS-01–03; JD intake/review | EN-09; TC-JD; NFR-09/11; KPI |
| RQ-12 JD analysis/mapping/plan | OBJ-03/04/05 | US-27, US-28, US-29 | BR-07/14–17/19; AC-27/28/29 | FS-04–06; preparation plan | EN-06/09; TC-MAP/PLAN; NFR-10/11; KPI |
| RQ-02 Student goal | OBJ-03/06 | US-03 | BR-03; AC-03-01 | Profile/context confirmation | TC-STUDENT |
| RQ-03 Question Bank/practice | OBJ-05/08 | US-04/05/06/18/21/23 | BR-07/08; related AC | FS-05–07/14; Question/plan views | EN-06; TC-Q; NFR-02/07 |
| RQ-04 Mentor onboarding | Supply/trust | US-07, US-08 | BR-01/08/11; AC-07/08 | Mentor onboarding/admin review | TC-M; NFR-01 |
| RQ-05 Availability/discovery | OBJ-05/06 | US-09, US-10 | BR-01/02; AC-09/10 | FS-08; mentor/booking view | TC-SLOT; usability |
| RQ-13 Plan-to-booking context | OBJ-06 | US-30, US-11 | BR-03/17/18/19; AC-30/11 | FS-09; contextual booking | EN-04/09; TC-PLAN/B; NFR-11 |
| RQ-06 Booking lifecycle | OBJ-06 | US-11/12/13 | BR-02/03/08/10/18; related AC | FS-09/10 | EN-03/05; TC-B; NFR-03 |
| RQ-07 Session access | OBJ-06 | US-14 | BR-04/11; AC-14 | FS-11/12 | EN-04; TC-SESSION; NFR-01/05 |
| RQ-08 Feedback/review | OBJ-07/08 | US-15/16/17 | BR-04/05/06/11/17; related AC | FS-13/14 | EN-04/05; TC-F; KPI |
| RQ-09 Notification | OBJ-06 | US-19, US-22 | BR-09/10; AC-19/22 | FS-11 + exceptions | EN-07; TC-N; NFR-04 |
| RQ-10 Moderation/operations | Trust/pilot | US-18/20/23 | BR-01/07/08/11/19; related AC | Admin operations | TC-ADM; NFR-01/08 |

## 9. Release plan

Release R1 is planned as six two-week sprints from 17/08/2026 through 08/11/2026. A fixed-date plan must use estimated/prioritized PBIs and a team velocity range as described in [Agile Planning, Slides 021–023](https://github.com/tnnhuaa/InterviewQuestionBank/blob/05ff4b99ae133de9b0f7c2f0de3585390b933718/docs/refs/06-1-agile-planning.md#slide-021--7-create-a-fixed-date-release-plan-i).

| Backlog bucket | Stories | Initial SP | Planning constraint |
|---|---:|---:|---|
| R1 Must | US-01–US-20 and US-24–US-30 | 134 | Requires `22.3 SP/sprint`; no commitment until velocity range/capacity rebaseline confirms feasibility |
| R1 Stretch | US-21–US-22 | 8 | Selected only after Must work and reserves are safe |
| Future | US-23 | 8 | Excluded from R1 |

Will-have/might-have lines remain unset until the Development Team confirms estimates and supplies slower/faster velocity. The JD-first change increases Must scope by 42 initial SP; it cannot inherit the previous 92-SP feasibility conclusion without re-estimation.

### 9.1 Story map

| Activity | Stories | Outcome |
|---|---|---|
| Foundation | US-01, US-02, US-18 | Secure identities and governed taxonomy/Questions |
| JD intake | US-24, US-25, US-26 | Confirmed text ready for analysis |
| Analyze and plan | US-27, US-28, US-29, US-03 | Explainable requirements/matches and preparation plan |
| Self-practice | US-04, US-05, US-06 | Student practices governed Questions |
| Mentor booking | US-07–US-14, US-19, US-30 | Contextual, reliable booking and external session handoff |
| Feedback and operations | US-15–US-17, US-20 | Actionable feedback, review and governed exceptions |

## 10. Open product decisions

| ID | Decision required | Owner | Affected backlog |
|---|---|---|---|
| PD-01 | Pilot occupation segment, labeled JD sample size and absolute Student/Mentor/booking targets | PO/Research | OBJ-01/03/04; KPI plan |
| PD-02 | Cancellation, reschedule, no-show and completion authority, cutoff and evidence | PO/Operations | US-12/13/15/20; BR-08 |
| PD-03 | Retention, deletion, consent and privacy notice for profile/booking/feedback/JD-derived data | PO/Privacy | BR-11/19; NFR-06/11 |
| PD-04 | Meeting-link creation/update authority and provider-outage fallback | PO/Technical | US-14 |
| PD-05 | Reminder cadence, timezone, suppression and fallback | PO/Operations | US-22 |
| PD-06 | Ratify or revise the PoC baseline (PDF/PNG/JPEG, 10 MB/file), and approve page count, safety checks, original-file retention and final MVP limits | PO/Architecture/Security | US-24/25; BR-12/19; NFR-09 |
| PD-07 | Approve page/language/time limits, worker concurrency/retry/manual fallback and quality baseline for the accepted PoC internal-OCR strategy | Architecture/PO | US-25/26; BR-13 |
| PD-08 | Pilot taxonomy/alias owner, matching weights/threshold, versioning and labeled relevance test set | PO/Content/Architecture | US-27–29; BR-15/16; NFR-10 |

## 11. Backlog refinement and change control

The Product Owner facilitates refinement at least once per sprint with Development, Architecture, UX and QA representatives. Every approved change updates affected story, acceptance criteria, ordering, dependency, estimate, traceability, architecture/prototype contract and release impact.

A story is Ready for sprint selection only when:

1. actor, value, priority, dependency and Given/When/Then acceptance criteria are clear;
2. workflow/prototype and technical inputs are available;
3. required file/privacy/OCR/mapping or booking policies are resolved or included as explicit decision work;
4. the Development Team confirms the estimate using the agreed Fibonacci scale;
5. an 8-point story is split or accepted as a one-sprint exception;
6. test data and expected output exist for extraction/analysis/mapping stories;
7. Product Owner, developer and QA agree it can be implemented and tested within the sprint.
