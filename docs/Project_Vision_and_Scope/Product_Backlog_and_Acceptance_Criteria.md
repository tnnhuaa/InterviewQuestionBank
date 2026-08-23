# Interview Practice Platform — Product Backlog and Acceptance Criteria

## 1. Purpose

This document converts the JD-first product scope and the approved target process into an ordered, testable Product Backlog. Per the Project Charter on `main`, **Hưng is Product Owner / Business Analyst**, owning Vision & Scope, Product Backlog, acceptance criteria, and the Future-State Workflow; the Product Owner orders the backlog and accepts stories. The document defines user stories, priority, dependencies, Story Points, acceptance criteria, quality requirements, traceability, and release control. The backlog must be complete and the Product Owner must prioritize by value.

### 1.1 Roles applied to the backlog

This table applies Charter assignments; it creates no new roles and transfers no decision authority between members.

| Member | Charter primary role | Backlog responsibility |
|---|---|---|
| Tuấn Anh | Project Manager / Team Leader / Timekeeper | Runs the team, deadlines, and Kanban; handles blocker/escalation; reviews/merges and confirms Done |
| Gia Thành | Project Planning & Estimation Analyst / Full-stack Developer | Prepares refinement/Planning Poker data, updates estimates and baseline impact; contributes Full-stack implementation |
| Hưng | Product Owner / Business Analyst | Owns and orders the backlog, clarifies requirements, decides trade-offs, and accepts/rejects stories |
| Luân | Architecture / Technical Lead | Reviews architecture impact, ADRs, NFRs, and technical/security constraints |
| Hùng | UI/UX Designer / Front-end Developer | Verifies workflow/usability, maintains prototype traceability, and develops the interface |
| Trí | PoC / Integration & E2E Developer | Verifies feasibility, integration, data/end-to-end tests, and evidence for technical enablers |

### 1.2 Release boundary

| Scope | Decision |
|---|---|
| R1 Must | Authentication and authorization; JD text/file input; direct extraction and OCR fallback; correction; requirement/taxonomy analysis; explainable question mapping; preparation plan; Question Bank; Mentor verification and availability; plan-context booking; external meeting-link handoff; feedback/review; minimal administration and reliable booking notifications |
| R1 Extended | Basic progress dashboard and scheduled session reminders |
| Future | Bulk question import, semantic/ML suggestions, auto interview/scoring, broad OCR, built-in video/recording/transcription, automatic payment, dedicated mobile apps, and ATS integration |

### 1.3 Business rules

Business rules use stable codes with source/owner and changeability noted.

| Code | Rule | Source/owner | Changeability |
|---|---|---|---|
| BR-01 | Only Mentors in `APPROVED` state may publish profiles/slots and receive booking requests. | Product scope / PO | Medium |
| BR-02 | Each slot belongs to at most one booking in a slot-holding state. A confirmed booking keeps the old slot while a reschedule proposal is unresolved. | Booking integrity / Architecture | Low |
| BR-03 | A booking request must have an available slot, role/interview context, and a meaningful goal. | Product process / PO | Medium |
| BR-04 | Only the Student/Mentor of a booking and authorized Administrators may access that booking's private data, meeting link, or feedback. | Security/privacy policy | Low |
| BR-05 | Only the authorized Mentor may create feedback after the booking is `COMPLETED`. | Product process / PO | Medium |
| BR-06 | The Student of the booking may create at most one review after a valid `COMPLETED` booking. | Product process / PO | Medium |
| BR-07 | Questions may be published or used for mapping only in `PUBLISHED` state, with valid taxonomy and provenance. | Content policy / PO | Medium |
| BR-08 | Every booking transition must record before/after state, actor, timestamp, and reason when needed. Either side may cancel/propose reschedule until 12 hours before start; max two reschedule proposals. Later actions require the Administrator or the other side. The Mentor can mark `COMPLETED` after the end time; the Student may dispute within 24 hours. When disputed, the review stays unpublished until an audited Administrator decision; state must not change itself. After a 15-minute wait, either side may report no-show, but the Administrator or the other side must confirm before transitioning to `NO_SHOW`. | Booking policy / PO and Operations, PD-02 | Medium |
| BR-09 | Confirmation notifications are sent immediately. If US-22 is selected in R1 Extended, `CONFIRMED` bookings receive reminders 24 hours and 1 hour before, skipping marks already passed when confirmation is late. Times are stored in UTC and displayed in the recipient's timezone. Cancel/reschedule invalidates old jobs. The system sends once and retries at minute 1, 5; errors do not undo the booking and fall back to in-app/manual handling. | Reliability/reminder decision / Architecture and Operations, PD-05 | Medium |
| BR-10 | Booking creation and key transitions must be safe to retry; a dedupe key must not create duplicate states or events. | Reliability decision / Architecture | Low |
| BR-11 | The owning Mentor creates the external meeting link after confirmation and may edit until 2 hours before start; Administrator intervention must be logged/traced. Only both sides see the link from `CONFIRMED` until 24 hours after the session. On provider failure, the Mentor has up to 15 minutes to provide a replacement link; if no usable link exists, a clear reschedule flow must appear and no implicit state change is allowed. Meeting links, verification evidence, feedback, and private profiles must not be public or fully logged. | Meeting/privacy policy / PO and Engineering, PD-03/04 | Medium |
| BR-12 | The Student may paste up to 50,000 Unicode characters or upload one PDF/PNG/JPEG per JD. File max 10 MB; PDF max 5 pages; PNG/JPEG is a single image. Unsupported, corrupt, encrypted, empty, multi-file, embedded-attachment, over-limit, or unsafe data must be rejected before analysis. | ADR-004 / PO and Architecture, PD-06 | Low in trial |
| BR-13 | Direct extraction is used for pasted text/text-layer PDFs; internal Vietnamese/English OCR only for PNG/JPEG or scanned PDFs. Max two concurrent tasks per process; each task times out after 60 seconds and allows max two automatic runs. Manual paste/edit is always allowed on failure. | ADR-004 / Architecture, PD-07 | Medium |
| BR-14 | The Student must view, edit, and confirm one corrected-text version before analysis. When the confirmed version changes, derived requirements, mapping, and plans must be invalidated for regeneration. | Product process / PO | Low |
| BR-15 | Every detected requirement must keep source evidence and normalization status; unknown terms stay unmapped rather than being auto-assigned a taxonomy topic. | JD analysis scope / PO and Content | Medium |
| BR-16 | Question mapping uses confirmed text and a versioned taxonomy/synonym set. Score 0–100: exact topic/synonym 40, requirement keyword coverage 30, role fit 15, seniority/difficulty fit 15. Only `PUBLISHED` questions with score ≥60 are selected; max 10 per JD and 3 per requirement with stable tie-breaking. Each result stores source requirement, topic, score/reason, question code, and mapping version. | Mapping scope / PO and Content, PD-08 | Medium |
| BR-17 | A preparation plan belongs to one Student, references the JD and the selected versioned mapping result, and keeps history when feedback changes next actions. | Product process / PO | Medium |
| BR-18 | Every R1 booking must reference the JD or preparation plan owned by the booking Student. The Mentor sees only the minimal context needed for the session. | Product scope/privacy / PO | Low |
| BR-19 | Original JD files, extracted/corrected text, requirements, mapping results, and plans are private. Original files are deleted within 24 hours after extraction finishes; JD-derived data expires after 90 days of inactivity. Booking/feedback/review/transition data expires after 180 days. User deletion requests must remove active private data within 7 days and backups within 30 days; logs must not contain the original JD. | Privacy/file-upload policy / PO and Privacy, PD-03/06 | Medium |

The extraction/mapping direction of BR-12/13 is recorded by the Architecture owner in [ADR-004 at commit `54e1113`](https://github.com/tnnhuaa/InterviewQuestionBank/blob/54e1113113f6ada9c0ecec565eb8f883966d18f9/docs/Project_Architecture/ADR/ADR-004-JD-Processing-and-Question-Matching.md). PD-06/07 provide finite trial values for ADR-004 parameters still configurable; any change needs new measurement evidence and change control.

### 1.4 Booking state vocabulary

| Business state | API/storage code | Holds the slot | Meaning |
|---|---|---|---|
| Pending | `PENDING` | No | The Student's request awaits the Mentor's decision |
| Confirmed | `CONFIRMED` | Yes | The Mentor accepted and the slot is held |
| Reschedule proposed | `RESCHEDULE_PROPOSED` | New slot: no; old slot: still held | The other side must accept or reject the proposal |
| Rejected | `REJECTED` | No | The Mentor rejected the current request |
| Cancelled | `CANCELLED` | No | A valid cancellation completed per policy |
| Completed | `COMPLETED` | Kept as ownership history | The session occurred and was recorded as completed |
| No-show | `NO_SHOW` | History/exception | Reported after a 15-minute wait and confirmed by the Administrator or the other side with timestamped evidence |

Interface labels may be localized, but API contracts, tests, and documentation must map consistently to these state codes.

## 2. Product Backlog

The backlog is ordered by value and dependencies. R1 has 27 Must stories; US-21–US-22 are Extended and US-23 is Future. Codes US-01–US-23 stay unchanged; the JD-first scope adds US-24–US-30. Story Points are relative size estimates, not hours, and need Development Team confirmation during refinement.

| Order | Code | Feature group | User story | Value / goal | Release | Dependencies | Traceability | SP | Readiness/state |
|---:|---|---|---|---|---|---|---|---:|---|
| 1 | US-01 | Identity | As a user, I want to register and log in so my personal data is protected. | Platform/privacy | R1 Must | — | RQ-01; BR-04/11/19 | 8 | Session and verification slice with high risk |
| 2 | US-02 | Identity | As an Administrator, I want the system to enforce Student/Mentor/Administrator roles so functions and data are properly restricted. | Security invariant | R1 Must | US-01 | RQ-01; BR-04/19 | 3 | Needs role/object matrix |
| 3 | US-24 | JD intake | As a Student, I want to paste or upload a job description so I prepare for the exact role I am applying to. | OBJ-02; main entry point | R1 Must | US-01 | RQ-11; BR-12/19; FS-01 | 5 | Limit 50,000 chars or one PDF/PNG/JPEG, 10 MB/5 pages |
| 4 | US-25 | JD extraction | As a Student, I want text extracted directly or by OCR when needed so I can review the JD content. | OBJ-02; input usability | R1 Must | US-24 | RQ-11; BR-13/19; FS-02 | 8 | Bilingual OCR 60s; consider splitting |
| 5 | US-26 | JD correction | As a Student, I want to view, edit, and confirm the extracted text so analysis uses the right version. | OBJ-02; quality gate | R1 Must | US-25 | RQ-11; BR-14/19; FS-03 | 3 | Must state version-invalidation mechanism |
| 6 | US-27 | JD analysis | As a Student, I want the system to detect and normalize role, seniority, skills, technologies, and requirements so I understand the JD. | OBJ-03; insight | R1 Must | US-26 | RQ-12; BR-14/15/19; FS-04 | 8 | 20 labeled JDs: 12 calibration/8 blind |
| 7 | US-03 | Student | As a Student, I want to save the target role and interview goal so practice and booking use the same context. | OBJ-03/06; context | R1 Must | US-01 | RQ-02; BR-03; FS-04 | 2 | Small slice storing profile/context |
| 8 | US-18 | Content moderation | As an Administrator, I want to manage/moderate questions and taxonomy so only governed content is published. | Prerequisite for mapping/content | R1 Must | US-02 | RQ-03/10/12; BR-07/08; FS-05 | 5 | Includes taxonomy/synonym administration |
| 9 | US-28 | Question mapping | As a Student, I want JD requirements mapped to governed questions so I know what to prepare. | OBJ-04; core value | R1 Must | US-18, US-27 | RQ-12; BR-07/15/16; FS-05 | 8 | Scoring/threshold approved; consider splitting |
| 10 | US-29 | Preparation plan | As a Student, I want each suggested question explained and ordered into a preparation plan so I can choose next actions. | OBJ-04/05; activation | R1 Must | US-28 | RQ-12; BR-16/17/19; FS-06 | 5 | Needs reasons/content and plan ownership |
| 11 | US-04 | Questions | As a Student, I want to browse/search/filter governed questions so I can explore or extend a plan. | OBJ-05; self-practice | R1 Must | US-02, US-18 | RQ-03; BR-07; FS-07 | 5 | Filters, pagination, display rules |
| 12 | US-05 | Questions | As a Student, I want to view question detail and answer criteria so I know what a good answer needs. | OBJ-05; self-practice | R1 Must | US-04 | RQ-03; BR-07; FS-07 | 2 | Read-only detail on the Question model |
| 13 | US-06 | Practice | As a Student, I want to bookmark and track practice status so I can continue and follow the plan/feedback. | OBJ-05/08; retention | R1 Must | US-04 | RQ-03; BR-04; FS-07/14 | 3 | State and per-user authorization |
| 14 | US-07 | Mentors | As a Mentor, I want to create a profile and submit verification info so I can offer a trusted service. | Supply | R1 Must | US-01 | RQ-04; BR-01/11; FS-08 | 5 | Profile and verification lifecycle |
| 15 | US-08 | Mentor governance | As an Administrator, I want to approve/reject Mentor verification with a reason so public supply is governed. | Trust/supply gate | R1 Must | US-02, US-07 | RQ-04; BR-01/08; FS-08 | 3 | Approval transitions and audit trail |
| 16 | US-09 | Availability | As an approved Mentor, I want to manage future slots so Students see valid availability. | Enables booking | R1 Must | US-08 | RQ-05; BR-01/02; FS-08 | 5 | Time checks and held-slot constraints |
| 17 | US-10 | Mentor catalog | As a Student, I want to find approved Mentors by plan topic and availability so I pick a suitable session. | OBJ-05/06; discovery | R1 Must | US-08, US-09, US-29 | RQ-05; BR-01; FS-08 | 3 | Query by plan topics and availability |
| 18 | US-30 | Plan to booking | As a Student, I want to attach the JD or preparation plan to a Mentor booking so they receive the right practice context. | OBJ-06; context handoff | R1 Must | US-10, US-29 | RQ-13; BR-17/18/19; FS-09 | 5 | Minimal context projection and retention policy approved |
| 19 | US-11 | Booking | As a Student, I want to submit a booking request with goal and JD/plan context so the Mentor can decide. | OBJ-06; conversion | R1 Must | US-03, US-30 | RQ-06/13; BR-02/03/10/18; FS-09 | 5 | Concurrent-safe/anti-dup creation |
| 20 | US-12 | Booking | As the owning Mentor, I want to accept, reject, or propose a new time so the booking moves to a valid state. | OBJ-06; lifecycle | R1 Must | US-11 | RQ-06; BR-02/08/10; FS-10 | 8 | 12-hour mark and reschedule conditions approved |
| 21 | US-13 | Booking | As a side of a booking, I want to cancel or settle a reschedule proposal per clear policy so exceptions need no implicit coordination. | OBJ-06; operations | R1 Must | US-12 | RQ-06; BR-02/08/10; FS-10 | 8 | Policy approved; consider splitting |
| 22 | US-14 | Session | As a side of a booking, I want controlled access to the external meeting link once confirmed so I can join safely. | OBJ-06; session handoff | R1 Must | US-12 | RQ-07; BR-04/11; FS-11/12 | 3 | Mentor-managed link and 15-minute fallback approved |
| 23 | US-19 | Notifications | As a user, I want reliable booking-event notifications so I know the next action even when the provider temporarily fails. | OBJ-06; coordination | R1 Must | US-11 and event stories | RQ-09; BR-09/10; FS-11 | 8 | Outbox, retry, dedupe risks |
| 24 | US-15 | Feedback | As the owning Mentor, I want to submit structured feedback after completion so the Student gets actionable guidance. | OBJ-07/08; core value | R1 Must | US-14 | RQ-08; BR-04/05/08; FS-13 | 5 | Mentor-completed and 24-hour dispute approved |
| 25 | US-16 | Feedback | As the Student of the booking, I want to view feedback and next actions so I can update the preparation plan. | OBJ-07/08; learning loop | R1 Must | US-15 | RQ-08; BR-04/11/17; FS-14 | 3 | Feedback/plan actions with authorization |
| 26 | US-17 | Review | As the Student of the booking, I want to review the Mentor after completion so other Students get a trust signal. | Mentor catalog trust | R1 Must | US-15 | RQ-08; BR-06; FS-14 | 3 | One review per completed booking |
| 27 | US-20 | Operations | As an authorized Administrator, I want to resolve reports and booking exceptions so the trial operates safely. | Trust/operability | R1 Must | US-02, US-13, US-17 | RQ-10; BR-01/07/08/11/19 | 5 | Minimal governed operations slice |
| 28 | US-21 | Progress | As a Student, I want a basic progress dashboard so I know what to practice next. | OBJ-08; retention | R1 Extended | US-06, US-16 | RQ-03; FS-14 | 5 | Proposed beyond the Must commitment |
| 29 | US-22 | Reminders | As a side of a booking, I want scheduled reminders so I am less likely to miss a session. | OBJ-06; completion rate | R1 Extended | US-19 | RQ-09; BR-09; FS-11 | 3 | 24h/1h marks and retry policy approved |
| 30 | US-23 | Data intake | As an Administrator, I want governed bulk question import so content expands without skipping moderation. | Content efficiency | Future/Maybe | US-18 | RQ-03/10; BR-07/08 | 8 | Needs per-item validation/error split |

The R1 choice becomes a delivery commitment only after the Product Owner approves it, the Development Team runs Planning Poker, and the velocity range is reviewed.

### 2.1 Method and story-point totals

- Story Points express overall relative size, not hours.
- Estimation uses the Fibonacci sequence `1, 2, 3, 5, 8`; larger gaps mean higher uncertainty. These are initial analogy/decomposition estimates and need Planning Poker confirmation.
- Each SP covers one complete vertical story, including implementation, tests, documentation, and acceptance evidence. EN-01–EN-09 are quality/delivery gates already inside the related stories; if a support task is scheduled separately it must be estimated separately and rechecked to avoid double counting.
- `US-03 = 2 SP` marks a small data-storage slice; bounded end-to-end work is usually `3–5 SP`; `8 SP` signals uncertainty or a split need. US-01, US-12, US-13, US-19, US-23, US-25, US-27, and US-28 must be considered for splitting before being pulled into Ready.

| Backlog group | Stories | Initial SP | Plan interpretation |
|---|---:|---:|---|
| R1 Must | 27 | 134 | Needs an average `134 / 4 = 33.5 SP/week` across four reconstructed execution weeks; feasibility concluded only after a throughput range and rebaseline |
| R1 Extended | 2 | 8 | US-21 = 5, US-22 = 3; chosen only when Must and reserve are safe |
| Future/Maybe | 1 | 8 | US-23; not in R1 |
| Entire Product Backlog | 30 | 150 | Relative size estimate awaiting the Development Team's confirmation |

## 3. Cross-cutting items and delivery

| Code | Item / done result | Supports | Release gate |
|---|---|---|---|
| EN-01 | Discovery, prototype, and usability evidence establishes a baseline for the JD-preparation problem. | US-24–US-30; core flow | Before baselining |
| EN-02 | Architecture/runtime foundation, login session, CI pass the independent frontend build, backend DB migration/seed, and session/CSRF gates. | Entire R1 | Foundation |
| EN-03 | PostgreSQL tests prove only one booking holds a slot with ≥20 concurrent confirms, stable conflicts, dedupe, and only one state/outbox event. | US-11–US-13 | Booking gate |
| EN-04 | Server-side role/ownership matrix protects JD, plan, booking, meeting link, feedback, and verification. | US-01/02/07/08/11–20/24–30 | Security gate |
| EN-05 | Standard state machine and audit trail cover success, invalid, reschedule, cancel, complete, and no-show flows. | US-12/13/15/20 | Lifecycle gate |
| EN-06 | Question filter and mapping prove no draft exposure, stable ordering, valid taxonomy, and provenance. | US-04/18/27–29 | Content/mapping gate |
| EN-07 | Transactional outbox proves the booking survives provider failure, with dedupe, competing processes, retry/backoff, and manual dead-letter handling. | US-19/22 | Reliability gate |
| EN-08 | Integration build, security/negative tests, performance profile, backup/restore, UAT, deployment, and guides meet Definition of Done. | Entire R1 | Release gate |
| EN-09 | JD PoC proves direct/OCR routing, correction gate, synonym normalization, stable explainable mapping, and plan-to-booking handoff on a labeled dataset. | US-24–US-30 | JD gate |

## 4. Acceptance criteria

Acceptance criteria are verification contracts, not feature-done claims. Risk flows must include success, negative, boundary, malicious, authorization, concurrency, and provider-failure cases.

| AC code | Story | Type | Acceptance criterion (Given / When / Then) |
|---|---|---|---|
| AC-01-01 | US-01 | Success/security | Given a valid unregistered email; when registration and verification succeed; then exactly one account is created and no credentials/secrets appear in plain text in storage or logs. |
| AC-01-02 | US-01 | Session | Given an authenticated user; when a session is created/expired/revoked; then access follows server-side policy and the client cannot claim identity/role via trusted headers. |
| AC-02-01 | US-02 | Authorization | Given an actor without the required role/relation; when calling a protected route; then the system refuses safely, changes no data, and reveals no sensitive content. |
| AC-03-01 | US-03 | Data checks | Given a logged-in Student; when saving a valid target role, interview type, and goal; then data persists, and invalid fields error without creating unintended partial data. |
| AC-04-01 | US-04 | Boundary | Given zero/one/many `PUBLISHED` questions and a multi-tag question; when applying filter/pagination/sort; then results are stable, not duplicated, and no `DRAFT`/`ARCHIVED` content appears. |
| AC-05-01 | US-05 | Display | Given a `PUBLISHED` question; when opening detail; then content, taxonomy, answer criteria, and provenance display, while unpublished content stays inaccessible. |
| AC-06-01 | US-06 | Ownership | Given a logged-in Student; when changing bookmark/practice status; then private state is saved and other Students cannot read or modify it. |
| AC-07-01 | US-07 | State/privacy | Given complete Mentor data and processing consent; when submitting verification; then state becomes `PENDING`, evidence stays restricted, and missing data is rejected. |
| AC-08-01 | US-08 | Authorization/audit | Given a `PENDING` verification; when an authorized Administrator approves/rejects with a reason; then state, actor, reason, and time are recorded; non-Administrators cannot decide. |
| AC-09-01 | US-09 | Boundary/state | Given an `APPROVED` Mentor; when creating a non-overlapping future slot with a timezone; then the slot is saved; past/invalid/overlapping slots or unapproved Mentors are rejected. |
| AC-10-01 | US-10 | Display | Given plan topics and public Mentor/slot data; when the Student filters; then only `APPROVED` Mentors matching expertise/availability appear, with a clear no-result state. |
| AC-11-01 | US-11 | Success/data checks | Given an available slot and a Student-owned JD/plan; when submitting full context; then exactly one `PENDING` booking is created; missing/foreign context or wrong slots are rejected. |
| AC-11-02 | US-11 | Dedupe | Given a dedupe key; when retrying the same request; then the original result returns without duplicate bookings/events; other data with the same key gets a stable conflict. |
| AC-12-01 | US-12 | Concurrency | Given ≥20 `PENDING` bookings competing for one slot; when confirming concurrently on PostgreSQL; then exactly one holds the slot, others receive a stable conflict, and only one logical state/outbox event occurs. |
| AC-12-02 | US-12 | Transitions | Given a `PENDING`/`CONFIRMED` booking and the owning side; when rejecting or proposing reschedule before the 12-hour mark with fewer than two proposals; then state/audit are recorded atomically; wrong actor, unapproved late action, or a third proposal is rejected. |
| AC-12-03 | US-12 | Invariant | Given an unresolved `CONFIRMED` reschedule proposal; while the proposal waits; then the old slot stays protected and the proposed slot is not held until an atomic accept. |
| AC-13-01 | US-13 | Policy | Given an allowed state; when an authorized side acts ≥12 hours before start; then cancel/reschedule follow self-service conditions. Within 12 hours, actions need the Administrator or the other side. State, slot, and audit stay atomic; invalid transitions create no partial effects. |
| AC-13-02 | US-13 | Concurrent dispute | Given two reschedule proposals competing for a new slot; when accepted concurrently; then only one receives the slot and the other side keeps the policy-safe state. |
| AC-14-01 | US-14 | Authorization | Given a `CONFIRMED` booking; when the owning Mentor creates the external link and routine updates happen no later than 2 hours before start; then only the booking Student/Mentor see it until 24 hours after the session; unrelated users and logs do not receive the link. |
| AC-14-02 | US-14 | Provider/state | Given a provider/link failure; when the Mentor provides a replacement link within 15 minutes; then the booking stays `CONFIRMED`. Otherwise the system presents a clear reschedule action; no implicit transition or unauthorized link exposure. |
| AC-15-01 | US-15 | State/ownership | Given the end time passed and the owning Mentor marked the booking `COMPLETED`; when submitting full rubric, strengths, weaknesses, and next actions; then one private feedback plus audit is created. The Student may dispute within 24 hours; the review stays unpublished until resolved; wrong state/actor/data is rejected. |
| AC-15-02 | US-15 | Privacy | Given existing feedback; when checking logs, analytics, or public/profile routes; then no full feedback content appears unless policy clearly allows. |
| AC-16-01 | US-16 | Authorization | Given existing feedback; when the booking Student opens it; then rubric and next actions display; unrelated users are rejected and content is not auto-public. |
| AC-17-01 | US-17 | Unique/dispute | Given a `COMPLETED` booking with no review; when the booking Student submits a valid review; then at most one review is created. It is published only after the 24-hour dispute window ends without dispute, or after an audited Administrator decision; duplicate/wrong actor/state cases are rejected. |
| AC-18-01 | US-18 | Moderation | Given an authorized Administrator; when publishing a question with valid taxonomy/provenance; then the question becomes public/mappable and the decision is recorded; missing data or non-Administrators are rejected. |
| AC-19-01 | US-19 | Provider failure | Given a booking/reminder event recorded; when sending a notification fails; then the booking is kept and a dedupe job retries at most at minutes 1 and 5; exhausted failures surface for in-app/manual handling. |
| AC-19-02 | US-19 | Process/recovery | Given competing processes and transient/permanent errors; when processing jobs; then each job is claimed by one process, retries are observable, success reaches `SENT`, exhausted jobs reach `DEAD`/manual handling. |
| AC-20-01 | US-20 | Authorization/audit | Given an open report/exception; when an authorized Administrator resolves it; then decision, reason, actor, time, and affected records are saved; restricted notes stay private and the state-machine rule is respected. |
| AC-21-01 | US-21 | Value/ownership | Given the Student's plan/practice/feedback data; when opening the progress dashboard; then only that Student's real progress/actions appear, with no invented scores or other Students' data. |
| AC-22-01 | US-22 | Scheduling | Given a future `CONFIRMED` booking; when the 24-hour or 1-hour mark arrives; then one deduped reminder displays in each recipient's timezone from the UTC schedule. Late confirmations skip passed marks; cancel/reschedule removes old jobs. |
| AC-23-01 | US-23 | Import/moderation | Given a governed import file; when the Administrator checks/imports; then valid rows enter `DRAFT`/review with provenance, per-row errors are reported, duplicate handling is stable, and no row publishes itself. |
| AC-24-01 | US-24 | Input/boundary | Given ≤50,000 pasted characters or one PDF/PNG/JPEG ≤10 MB (PDF ≤5 pages; image = one image); when the Student submits; then one private `JobDescription` is created. Empty, multi-file, unsupported, corrupt, encrypted, embedded-attachment, or over-limit data is rejected without analysis. |
| AC-24-02 | US-24 | Security/privacy | Given an uploaded file; when file signature/MIME checks, analyzer safety, or ownership checks fail; then the file is rejected/quarantined, content cannot execute or egress, no public URL is issued, and logs contain no JD. |
| AC-25-01 | US-25 | Routing/state | Given pasted text/text PDFs or Vietnamese/English PNG/JPEG/scanned PDFs; when extraction starts; then direct extraction is preferred and internal OCR handles only scanned/image sources; method/version/status/duration are recorded with usable text or a safe error. |
| AC-25-02 | US-25 | Error/dedupe | Given a 60-second timeout/error or retries with the same data; when processing continues; then at most two automatic runs occur, duplicate jobs create no conflicting version, and paste/edit/manual retry stays available. |
| AC-26-01 | US-26 | Correction/version | Given extracted/pasted text; when the Student edits and confirms; then analysis uses exactly that corrected version; a later edit invalidates derived requirement/mapping/plan results until regenerated. |
| AC-27-01 | US-27 | Analysis/evidence | Given confirmed text and an approved taxonomy/synonym set; when analyzing; then role/seniority/skills/technologies/requirements keep source evidence; known synonyms normalize correctly and unknown terms remain reviewable and unmapped. |
| AC-28-01 | US-28 | Stability/explanation | Given the same corrected text and taxonomy/synonym/rule version; when re-running mapping; then 40/30/15/15 scores and stable tie-breaking produce the same ordered hash; each result traces to requirement evidence/topic/reason. |
| AC-28-02 | US-28 | Display/negative | Given `DRAFT`/`ARCHIVED` questions, wrong taxonomy, or score <60; when mapping; then those items do not appear; max 10 questions and 3 per requirement, and shortage shows an honest coverage gap without silently changing thresholds. |
| AC-29-01 | US-29 | Plan/ownership | Given valid enough-scored mapping results; when the Student reviews selections and creates a plan; then each item keeps requirement/topic/question/reason/version traceability; only the owner edits, and no result is presented as a guaranteed interview question. |
| AC-30-01 | US-30 | Handoff/authorization | Given a Student-owned JD/plan and selected Mentor/slot; when creating the booking; then the booking references that context; the owning Mentor sees only approved fields, while unrelated actors and other Students' context are rejected. |

## 5. Quality requirements

Quality requirements are measurable specification baselines because quality cannot be assessed without requirements and comparison standards.

| Code | Requirement | Story/PBI traceability | Verification method |
|---|---|---|---|
| NFR-01 | Default-deny policy and server-side role/object authorization protect every private/restricted object, including JD, plan, booking, and feedback. | Entire R1; EN-04 | Negative actor/role/relation matrix against real APIs |
| NFR-02 | On the approved trial configuration, non-OCR read/write routes have p95 ≤3 seconds and 5xx errors <1%; extraction/OCR has p95 ≤45 seconds, 60-second timeout, and visible progress/status. | US-04/10–15/24–30; EN-08/09 | Load/latency tests on a trial environment with stable data |
| NFR-03 | Each slot has exactly one holding booking under ≥20 concurrent confirm requests. | US-12/13; EN-03 | PostgreSQL concurrency tests and invariant queries |
| NFR-04 | Outbox writes must be atomic; job claiming p95 ≤10 seconds when the provider works; failures must be observable and recoverable. | US-19/22; EN-07 | Fake-provider integration, metrics, and recovery tests |
| NFR-05 | TLS 1.2+, accepted session/CSRF controls, and a vault/log rule that keeps no secrets protect transport and runtime. | US-01/02/14/24–30; EN-02/08 | Configuration review plus session/CSRF/secret negative tests |
| NFR-06 | Trial data has RPO ≤24 hours and RTO ≤4 hours. | Entire R1; EN-08 | Backup/restore drill before the trial |
| NFR-07 | Core JD-to-plan and plan-to-booking tasks on the prototype reach ≥80% completion; loading/empty/error/permission/conflict states must be usable. | US-24–30 and core Student flow; EN-01 | Prototype/UAT observation report |
| NFR-08 | No Critical/Higher defects open and 100% of key process tests pass before the end of UAT. | Entire R1; EN-08 | Defect log and confirmed UAT results |
| NFR-09 | Upload accepts one PDF/PNG/JPEG ≤10 MB (PDF ≤5 pages), checks file/MIME/content signatures, isolates the analyzer/internal OCR from egress, and fails safely. OCR supports Vietnamese/English, ≤2 concurrent tasks/processes, 60-second timeout, ≤2 runs. | US-24/25; EN-04/09 | Malformed/multi-format/oversize/encrypted file tests plus queue/concurrency/timeout measurements |
| NFR-10 | The 8 blind JDs reach requirement coverage ≥80% and precision@10 ≥80%; the same corrected text + taxonomy/synonym/rule version reproduces the same ordered hash in 100% of runs; every result has source/topic/reason/version and leaks no non-`PUBLISHED` questions. | US-27–29; EN-06/09 | Versioned 20-JD standard set, double review, repeat tests, and lifecycle checks |
| NFR-11 | Least privilege and data minimization. Original JD expires ≤24 hours after extraction; derived data after 90 days of inactivity; booking/feedback after 180 days; deletion requests remove active data ≤7 days and backups ≤30 days; logs/analytics contain no original JD. | US-24–30; EN-04/08 | Authorization, retention/deletion schedulers, backup expiry, and log inspection |

### 5.1 Test suite catalog

| Suite | Verification focus |
|---|---|
| TC-AUTH | Registration/login, session, privilege escalation, CSRF, expiry/revocation |
| TC-JD | Paste/upload, file type/signature/limits, direct/OCR routing, corrupt/encrypted/empty data, retry/status and corrected version |
| TC-MAP | Requirement evidence, synonym normalization, unmapped terms, stable score/reason/version for `PUBLISHED` content only, and the relevance evaluation set |
| TC-PLAN | Mapping selection, plan ownership/version/history, actions from feedback, and plan-to-booking handoff |
| TC-STUDENT | Goal/profile checks, durable storage, and ownership |
| TC-Q | Zero/one/many results, multi-tags, lifecycle display, pagination/sorting, and provenance |
| TC-M | Verification states, unauthorized decisions, and public/private profile separation |
| TC-SLOT | Timezone, past/overlap checks, held-slot invariant, and concurrent updates |
| TC-B | Booking context/creation/transitions/reschedule/cancel, dedupe, audit, and concurrency |
| TC-SESSION | Only `CONFIRMED` bookings access the meeting link, object authorization, and provider fallback |
| TC-F | Feedback only after `COMPLETED`, ownership, rubric checks, privacy, plan actions, and review uniqueness |
| TC-N | Atomic outbox, dedupe, competing processes, retry/backoff, `DEAD` state, and recovery |
| TC-ADM | Taxonomy/question moderation, report/exception resolution, restricted notes, and audit trails |

## 6. KPI plan

| KPI | Event/source | Formula | Proposed target |
|---|---|---|---:|
| Problem confirmation | Discovery sample | confirm JD-preparation difficulty / valid sample | ≥70% |
| JD-entry task completion | Usability observation | completed paste/upload-review-confirm / attempts | ≥80% |
| Extraction success | Supported input events | inputs reaching editable text / valid supported inputs | ≥90% |
| Requirement coverage | Labeled JD test set | expected requirements detected / total expected | ≥80% |
| Mapping relevance | Expert review | relevant suggested questions / total reviewed suggestions | ≥80% |
| Mapping explainability | Mapping records | results with source requirement + topic + reason / total results | 100% |
| Plan activation | Product/usability events | users starting a question or Mentor flow / users with a valid plan | ≥80% |
| Booking task completion | Usability observation | valid-context bookings / attempts | ≥80% |
| Booking reliability | Booking events | completions / confirmations | ≥80% |
| Feedback completeness | Feedback records | feedback with full rubric / completed bookings | ≥90% |
| Perceived value | Post-session survey | average score | ≥4/5 |
| Confidence increase | Before/after survey | average after − before | ≥1/5 |

KPI evidence confirms outcomes; test evidence confirms behavior. Do not infer either type from mere UI existence, untested scenarios, or outputs never compared with expected results.

## 7. Ready and Done control

### 7.1 Definition of Ready

A story is Ready only when it has actor/value, acceptance criteria, dependencies, process/design/contract inputs, any approved PD baseline applying to it, and a Development Team estimate. Any deviation from PD-01–PD-08 must pass change control before the story counts as Ready.

### 7.2 Definition of Done

- Applicable acceptance criteria and NFRs are met with stored evidence; the Product Owner accepts the behavior.
- Code follows standards, is reviewed by another member, builds cleanly, and has appropriate unit/integration/e2e/negative tests.
- JD-processing tests use known inputs and expected text/requirements/mapping; correction, version invalidation, file security, and private-object authorization pass where applicable.
- PostgreSQL tests cover booking concurrency, state machine, authorization, and outbox where applicable; mocks do not prove these invariants.
- Migrations, API contracts, audit/metrics, and documentation are updated; repository/logs contain no real secrets or unnecessary JD/PII data.
- The integration build is deployed to the target environment, quickly checked by another member, and no Critical/Higher defects remain open.
- Release backlog, plan/schedule, user/deployment guides, and evidence links are updated.

These conditions ensure an item counts as done only when it is ready for the target environment with sufficient verification evidence.

## 8. Requirement traceability matrix

| Requirement | Source/goal | Stories | Rules/acceptance | Process/prototype concept | Verification |
|---|---|---|---|---|---|
| RQ-01 Identity/RBAC | Privacy/security | US-01, US-02 | BR-04/11/19; AC-01/02 | Authentication + permission states | EN-02/04; TC-AUTH; NFR-01/05 |
| RQ-11 JD intake/extraction | OBJ-02 | US-24, US-25, US-26 | BR-12/13/14/19; AC-24/25/26 | FS-01–03; JD intake/review | EN-09; TC-JD; NFR-09/11; KPI |
| RQ-12 JD analysis/mapping/plan | OBJ-03/04/05 | US-27, US-28, US-29 | BR-07/14–17/19; AC-27/28/29 | FS-04–06; preparation plan | EN-06/09; TC-MAP/PLAN; NFR-10/11; KPI |
| RQ-02 Student goals | OBJ-03/06 | US-03 | BR-03; AC-03-01 | Profile/context confirmation | TC-STUDENT |
| RQ-03 Question bank/practice | OBJ-05/08 | US-04/05/06/18/21/23 | BR-07/08; related AC | FS-05–07/14; question/plan screens | EN-06; TC-Q; NFR-02/07 |
| RQ-04 Mentor intake | Supply/trust | US-07, US-08 | BR-01/08/11; AC-07/08 | Mentor intake/Admin approval | TC-M; NFR-01 |
| RQ-05 Availability/discovery | OBJ-05/06 | US-09, US-10 | BR-01/02; AC-09/10 | FS-08; Mentor/booking screens | TC-SLOT; usability tests |
| RQ-13 Plan-to-booking context | OBJ-06 | US-30, US-11 | BR-03/17/18/19; AC-30/11 | FS-09; contextual booking | EN-04/09; TC-PLAN/B; NFR-11 |
| RQ-06 Booking lifecycle | OBJ-06 | US-11/12/13 | BR-02/03/08/10/18; related AC | FS-09/10 | EN-03/05; TC-B; NFR-03 |
| RQ-07 Session access | OBJ-06 | US-14 | BR-04/11; AC-14 | FS-11/12 | EN-04; TC-SESSION; NFR-01/05 |
| RQ-08 Feedback/review | OBJ-07/08 | US-15/16/17 | BR-04/05/06/11/17; related AC | FS-13/14 | EN-04/05; TC-F; KPI |
| RQ-09 Notifications | OBJ-06 | US-19, US-22 | BR-09/10; AC-19/22 | FS-11 + exceptions | EN-07; TC-N; NFR-04 |
| RQ-10 Moderation/operations | Trust/trial | US-18/20/23 | BR-01/07/08/11/19; related AC | Administrator operations | TC-ADM; NFR-01/08 |

## 9. Release plan

R1 uses Kanban in the eight-week window from 29/06/2026 to 23/08/2026. The execution part is reconstructed across four weeks from 27/07 to 23/08; fixed-date plans must use estimated/prioritized PBIs and the team's throughput range.

| Backlog group | Stories | Initial SP | Plan constraint |
|---|---:|---:|---|
| R1 Must | US-01–US-20 and US-24–US-30 | 134 | Needs `33.5 SP/week` across four reconstructed execution weeks; not committed until the throughput range and capacity baseline confirm feasibility |
| R1 Extended | US-21–US-22 | 8 | Chosen only after Must and reserve are safe |
| Future | US-23 | 8 | Not in R1 |

The will-have/might-have line is not placed until the Development Team confirms estimates and provides a low/high throughput range. The JD-first change adds 42 initial SP to the Must scope; the old 92-SP feasibility conclusion must not be inherited unless re-estimated.

### 9.1 Story map

| Activity | Stories | Outcome |
|---|---|---|
| Foundation | US-01, US-02, US-18 | Safe identity and governed taxonomy/questions |
| JD intake | US-24, US-25, US-26 | Confirmed text ready for analysis |
| Analysis and planning | US-27, US-28, US-29, US-03 | Explainable requirements/mapping and preparation plan |
| Self-practice | US-04, US-05, US-06 | Students practice governed questions |
| Mentor booking | US-07–US-14, US-19, US-30 | Contextual, reliable bookings and external session handoff |
| Feedback and operations | US-15–US-17, US-20 | Actionable feedback, reviews, and governed exceptions |

## 10. Approved product decisions

The chosen values are planning estimates for the 8-week trial. Calculations, confidence, and replacement methods with empirical data are recorded in [Product Decision Estimation Notes](Product_Decision_Estimation_Notes.md).

| Code | Approved planning decision | Reason/tradeoff | Owner | Affected backlog |
|---|---|---|---|---|
| PD-01 | Trial of new-graduate Front-end Intern/Developers (JavaScript/TypeScript/React); 20 de-identified JDs = 12 calibration + 8 blind; 12 Students, 4 `APPROVED` Mentors with ≥3 slots each; 12 valid booking requests, targets ≥10 `CONFIRMED` and ≥8 `COMPLETED` | Narrow segment keeps taxonomy and evaluation consistent but does not represent every role | Hưng / Research | OBJ-01/03/04; KPI plan |
| PD-02 | Self-cancel/reschedule until 12 hours before; max 2 proposals; later actions need Administrator/other side; Mentor marks `COMPLETED` after the end time, Student disputes within 24 hours; dispute keeps review unpublished until an audited decision; no-show reported after 15 minutes and confirmed by Administrator/other side | Balances flexibility and Mentor coordination; avoids self-no-show or publishing reviews while disputed | Hưng / Operations | US-12/13/15/20; BR-08 |
| PD-03 | Consent at first upload; original JD ≤24 hours; derived data 90 days of inactivity; bookings/feedback 180 days; active deletion ≤7 days and backups ≤30 days; logs/analytics without original JD | Supports one interview-preparation cycle while reducing sensitive data exposure | Hưng / Privacy | BR-11/19; NFR-06/11 |
| PD-04 | Owning Mentor creates/edits the external link until 2 hours before; only both sides see it until 24 hours after the session; Administrator intervention is audited; on provider failure the Mentor has 15 minutes for a replacement, otherwise an explicit reschedule | Avoids video integration and limits link authority, at the cost of depending on Mentor actions | Hưng / Engineering | US-14 |
| PD-05 | Instant confirmation is Must; scheduled reminders remain US-22 R1 Extended. When selected: remind 24 hours and 1 hour before, store UTC/display local, invalidate old jobs, send once + retry at minutes 1 and 5, in-app/manual fallback | Keeps the 134-SP Must baseline while a testable reminder policy exists; trial evidence may change cadence | Hưng / Operations | US-19/22 |
| PD-06 | Paste ≤50,000 characters or one PDF/PNG/JPEG ≤10 MB; PDF ≤5 pages; PNG/JPEG is one image; reject encrypted/multi-file/embedded/unsafe data; original JD ≤24 hours | Covers common JDs and bounds analyzer, CPU, storage, and security risk | Hưng / Architecture / Security | US-24/25; BR-12/19; NFR-09 |
| PD-07 | Internal Vietnamese/English OCR; ≤2 concurrent tasks/processes; 60-second timeout; ≤2 automatic runs; p95 ≤45 seconds; supported inputs succeed ≥90%; direct accuracy ≥95%; OCR ≥85%; confidence <0.80 must be marked; paste/edit fallback mandatory | Concrete, testable trial targets; poor-quality images still go through user correction | Luân / Hưng | US-25/26; BR-13 |
| PD-08 | Hưng owns taxonomy/content; Luân reviews schema/rule versions; Trí verifies dataset/tests; Tuấn Anh controls config/release. Weights 40/30/15/15, threshold 60, max 10 questions/JD and 3/requirement; requirement coverage and precision@10 ≥80%; repeatability/explainability 100% | Stable and explainable but weaker on semantic mapping for novel synonyms | Hưng / Content / Architecture | US-27–29; BR-15/16; NFR-10 |

## 11. Backlog refinement and change control

Hưng, as Product Owner / Business Analyst, organizes refinement at least weekly or whenever work needs adding to Kanban, with Development, Architecture, UX, and QA representatives. Every approved change must update related stories, acceptance criteria, ordering, dependencies, estimates, traceability, architecture/prototype contracts, and release impact.

A story may be pulled into the Ready column only when:

1. actor, value, priority, dependency, and Given/When/Then acceptance criteria are clear;
2. process/prototype and technical inputs exist;
3. the implementation follows PD-01–PD-08, or a recorded change and replacement evidence exist;
4. the Development Team confirms the estimate using the agreed Fibonacci sequence;
5. any 8-point story is split or accepted as an exception before Ready;
6. test data and expected outputs exist for extraction/analysis/mapping stories;
7. the Product Owner, developer, and QA agree the story is implementable and testable within the set WIP limit.
