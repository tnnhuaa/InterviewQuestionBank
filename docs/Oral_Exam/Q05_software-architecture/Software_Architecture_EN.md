# Interview Practice Platform — Software Architecture and Design

| Attribute | Value |
|---|---|
| Version | 0.7 |
| Last updated | 23/08/2026 |
| Architecture owner | Luân |
| Status | Proposed architecture baseline for the MVP/pilot; progressively validated with PoC evidence |

## 1. Executive summary

The MVP architecture uses an independently deployed **React SPA and Express REST API**. The backend is a **modular monolith**, PostgreSQL is the source of truth, and notifications run through a transactional outbox/worker. The stack uses JavaScript end-to-end and matches confirmed team skills: React, Tailwind CSS, Node.js, Express, and PostgreSQL.

The primary flow begins with a specific JD: enter JD → extract text/OCR → Student reviews and corrects text → analyze requirements → normalize taxonomy → map the Question Bank → create a preparation plan → self-practice or book a mentor → use feedback to update the plan. The Mentor Marketplace remains available as support after the preparation plan; it is no longer the product entry point.

This structure keeps booking transactions in one database, lowers operational cost, and lets frontend/backend work independently. Five architectural decisions are managed through ADRs. Gemini is an assistance layer behind an adapter and feature flag, while rules, policies, and PostgreSQL remain the sources of truth. This is the target MVP/pilot architecture. The PoC provides evidence to accept, revise, or replace decisions through the validation scenarios in Section 15.

## 2. Goals, scope, and architecture drivers

### 2.1 MVP goals

- Convert a specific JD into reviewable/editable text and a structured preparation plan.
- Detect requirements, normalize aliases to the taxonomy, and map the Question Bank with explainable rules.
- For each recommended question, retain the source requirement, normalized topic, match score/reason, and matching version.
- Let a Student self-practice or turn the preparation plan into a mentor booking containing JD/topic/question context.
- Safely manage mentor verification, availability, and booking.
- Prevent double booking under concurrent requests.
- Protect meeting links, verification evidence, and feedback.
- Retry notifications without affecting business transactions.
- Collect sufficient events/KPIs for the pilot without excessive data collection.

### 2.2 In scope

- Responsive web client.
- API/application services and a relational database.
- Identity/RBAC and Student, Mentor, and Administrator workflows.
- Text JDs, text PDFs, and images/scanned PDFs within PoC limits; extraction, OCR fallback, and manual correction.
- Requirement analysis, taxonomy/alias normalization, deterministic question matching, and preparation plans.
- Questions, taxonomy, progress, mentors, slots, bookings, feedback, reviews, and reports.
- Email/in-app notifications and external meeting links.
- Audit logs, telemetry, CI/CD, backup, and environment configuration.

### 2.3 Out of scope

- Microservices, an event-streaming platform, and multi-region deployment.
- AI interviewer/scoring, interview chatbot, Gemini reranking, and autonomous semantic/vector recommendations.
- OCR for every format/language and analysis of documents other than JDs.
- Built-in WebRTC/video, recording, and transcription.
- Payment, escrow, and payout.
- Native mobile application.

### 2.4 Quality priorities

1. Security/privacy for files, JDs, meeting context, and object-level authorization.
2. Explainability, stability, and testability of question matching.
3. Data consistency for slots, bookings, and state transitions.
4. Reliability and recoverability of extraction jobs, notifications, and operations.
5. Usability/accessibility of text review and preparation-plan flows.
6. Maintainability/testability, pilot-appropriate performance, and avoidance of premature optimization.

## 3. Architecture decisions

| ADR | Decision | Rationale | Status |
|---|---|---|---|
| [ADR-001](ADR-001-Technology-Stack_EN.md) | React/Vite/Tailwind + Node.js/Express + PostgreSQL | Matches team skills, separate test/deploy boundaries, and low pilot cost | Accepted for PoC |
| [ADR-002](ADR-002-Booking-Consistency_EN.md) | PostgreSQL transaction + row lock + partial unique index | Prevent double booking at the source of truth | Accepted, pending PoC |
| [ADR-003](ADR-003-Notification-Reliability_EN.md) | Transactional outbox + worker | Provider failure does not lose a booking | Accepted, pending PoC |
| [ADR-004](ADR-004-JD-Processing-and-Question-Matching_EN.md) | Direct extraction first, internal OCR fallback, and versioned rule-based matching | Low infrastructure, explainable, and deterministic for the PoC | Accepted for PoC; Proposed for MVP |
| [ADR-005](ADR-005-Hybrid-Gemini-Assistance_EN.md) | Gemini assists extraction/explanation/drafting behind an adapter; hard filters, scoring, and mutations remain deterministic | Improves JD understanding while preserving privacy, audit, and fallback | Accepted behind feature flags |
| Scope decision | External meeting link | Reduces video scope and security cost | Accepted by MVP scope |
| Security decision | Server-side RBAC + object ownership policy | Never trust client-supplied roles/ownership | Accepted for PoC |

### 3.1 Technology stack baseline

| Layer | Baseline | Rule |
|---|---|---|
| Web | React SPA, Vite, JavaScript, Tailwind CSS | Static build; no database access; pin dependencies with the lockfile |
| Routing/data | React Router, fetch wrapper, feature hooks | API URL from environment; explicit loading/error/permission states |
| API | Node.js 24 LTS, Express 5, REST/JSON /api/v1 | Modular monolith; schema validation at the boundary |
| Data access | pg + versioned SQL migrations | Parameterized SQL; application service manages transactions |
| Data | PostgreSQL | ACID, constraints, row locks, indexes, audit, and backup |
| Job/queue | PostgreSQL outbox + worker module | At-least-once, idempotent, retry/dead-letter states |
| JD processing | Direct text extraction + internal OCR adapter + PostgreSQL processing job | OCR only for images/scanned PDFs; no semantic/AI matching in the PoC |
| AI assistance | AiProvider adapter + PostgreSQL AI job; Gemini 3.5 Flash Lite through backend | Structured JSON, domain validation, quota/circuit breaker, and manual fallback |
| Matching | Taxonomy/alias dictionary + versioned rule-based scorer | Published Questions only; store source requirement, score, and reason |
| Authentication | Server-side session through same-origin /api proxy | __Host- cookie with Secure, HttpOnly, SameSite=Lax; CSRF control |
| Testing | Vitest, React Testing Library, Supertest, Playwright | Integration/concurrency tests use real PostgreSQL |
| CI/CD | Lint, audit, test, migration check, build | Independent frontend and backend pipelines |
| Deployment | Static frontend + containerized API/worker + managed PostgreSQL | Provider-neutral configuration; TLS and secrets outside the repository |
| Cache/broker | Not in the baseline | Add only when measurement/ADR proves the need |

## 4. System context

~~~mermaid
flowchart LR
    Student["Student<br/>[Person]"] -->|"Uploads/reviews JD; practices; books"| PrepVI["PrepVI<br/>[Software System]<br/>Interview preparation platform"]
    Mentor["Mentor<br/>[Person]"] -->|"Manages sessions and feedback"| PrepVI
    Admin["Administrator<br/>[Person]"] -->|"Verifies and moderates"| PrepVI
    Operations["PO / Operations<br/>[Person]"] -->|"Reviews outcomes"| PrepVI
    PrepVI -->|"Assisted extraction and drafts<br/>HTTPS/JSON"| Gemini["Gemini API<br/>[External Software System]"]
    PrepVI -->|"Notifications<br/>HTTPS/API"| Email["Email Provider<br/>[External Software System]"]
    PrepVI -->|"Approved session links<br/>HTTPS"| Meeting["Meeting Provider<br/>[External Software System]"]
~~~

The diagram deliberately treats PrepVI as one software system. Applications and data stores inside PrepVI appear only in the Container diagram.

### Trust boundaries

- The browser/client is untrusted; the Express API validates every input, session, role, and ownership relationship.
- Frontend and API are separate deployables, but the browser uses the same /api origin; the static-host reverse proxy forwards requests to the API to avoid third-party cookie dependency.
- The API origin accepts only configured proxy/origin values. If direct cross-origin access is enabled, credentialed CORS must not use a wildcard.
- Email and meeting providers are outside the trust boundary and are never the source of truth for bookings.
- Verification documents and meeting links are sensitive data and are separated from public profiles.
- JD files, extracted/corrected text, requirements, and preparation plans are private to the Student; a Mentor/Administrator sees only the minimum data allowed by a valid business relationship.
- OCR extracts text from images/scanned PDFs; it is not a general name for JD analysis or question matching.
- Gemini is outside the trust boundary, receives only minimum data, and returns untrusted output that cannot perform business mutations.
- Privileged Administrator actions must be audited.

## 5. Container view

~~~mermaid
flowchart LR
    Student["Student<br/>[Person]"] -->|Uses| Web
    Mentor["Mentor<br/>[Person]"] -->|Uses| Web
    Admin["Administrator<br/>[Person]"] -->|Uses| Web

    subgraph PrepVI["PrepVI Software System"]
        direction LR
        Web["React Web App<br/>[Container: React/Vite]<br/>Browser UI"]

        API["Express API<br/>[Container: Node.js/Express]<br/>Modular monolith; synchronous processing"]

        subgraph Data["Data-store containers"]
            direction TB
            DB[("PostgreSQL<br/>Business data<br/>and audit")]
            FileStore["Private File Storage<br/>Temporary JD files"]
        end

        Web -->|"HTTPS REST/JSON<br/>/api/v1"| API
        API -->|"Reads/writes<br/>SQL"| DB
        API -->|"Stores, reads and<br/>deletes JD files"| FileStore
    end

    API -->|"Assisted extraction and drafts<br/>HTTPS/JSON"| Gemini["Gemini API<br/>[External Software System]"]
    API -->|"Notifications<br/>HTTPS/API"| Email["Email Provider<br/>[External Software System]"]
~~~

The diagram shows logical runtime and data boundaries, not physical deployment nodes. Frontend and backend have independent build/deployment. JD extraction/OCR, AI assistance, and notification delivery are modules executed by the Express API; the C4 baseline has no separate worker flow. The PoC may use temporary private storage behind an adapter; the MVP/pilot replaces it with private object storage. Minimum environments are local, test/CI, staging/UAT, and production/pilot. Secrets do not belong in the repository. Migrations run from a controlled pipeline/job with one runner at a time and a backup/forward-fix plan.

### 5.1 Deployment profile and pilot cost

| Component | PoC/pilot default | Reference cost on 14/08/2026 | Limitation |
|---|---|---:|---|
| React static frontend + /api rewrite | Vercel Hobby | 0 USD for personal/non-commercial use | Fair-use/usage caps; review the plan for a commercial pilot |
| Express API | Render Free web service | 0 USD | Cold start and 750 free instance-hours/workspace; no production SLA |
| PostgreSQL | Neon Free | 0 USD | 0.5 GB/project, 100 CU-hours/project, scale-to-zero |
| Notification | Fake provider in PoC; provider adapter in pilot | TBD | Confirm price/quota before a real pilot |
| JD storage/OCR | PoC: temporary private storage; MVP/pilot: private object storage; internal extraction/OCR adapter | Within PoC quota | Delete PoC files after extraction or within 24 hours; external OCR requires a new ADR if internal OCR fails the pilot corpus |
| Browser/API domain | Default frontend URL + same-origin rewrite | 0 USD | Custom domain and DNS are separate public-pilot costs |

Render Free PostgreSQL is not the baseline because its free database expires after 30 days. The worker may share the API process in a one-instance PoC; staging/production must separate it or prove singleton/idempotent behavior on the deployment platform. Recheck all prices/quotas when approving the Cost–Time–Resource baseline.

### 5.2 Browser/API session topology

The baseline does not let the browser call *.onrender.com directly from *.vercel.app. The browser always calls /api/v1 on the React-serving origin, and the static-host rewrite/reverse proxy forwards requests to Express.

- Local: the Vite development proxy forwards /api to the local API.
- PoC/pilot: static-host rewrites forward /api/:path* to the backend deployment.
- Session cookie uses the __Host- prefix, Secure, HttpOnly, SameSite=Lax, Path=/, and no Domain.
- Mutations use a CSRF token/header; the API checks Origin/Sec-Fetch-Site where appropriate.
- The frontend API base URL is relative /api/v1; the production bundle does not embed the backend origin.

If the browser later calls api.example.com directly from app.example.com, update the ADR and security tests for CORS, cookie scope, and CSRF before changing the topology.

## 6. Backend module design

| Module | Responsibility | Must not |
|---|---|---|
| Identity | Accounts, authentication, roles, sessions | Decide booking ownership |
| Student | Profile and goals | Manage mentor verification |
| Questions | Taxonomy, questions, provenance, moderation | Send bookings |
| JD Ingestion | Accept pasted text/files, metadata, status, and Student-confirmed text | Analyze skills itself or expose files publicly |
| Text Extraction/OCR Adapter | Classify sources, directly extract text, OCR only images/scanned PDFs, normalize adapter errors | Match questions or overwrite corrected text |
| JD Analysis | Detect role, seniority, skills/technologies/requirements and normalize aliases to taxonomy | Generate AI content or silently change taxonomy |
| AI Assistance | Requirement/taxonomy candidates, recommendation explanations, agenda/feedback drafts | Bypass ownership/hard filters, create IDs, or submit mutations |
| Question Matching | Deterministic requirement/topic scoring, Published Question filtering, reason and version generation | Return Draft Questions or use semantic/AI matching in the PoC |
| Preparation Plan | Group selected requirements/topics/questions, track the plan, and provide Practice/Booking context | Change booking state or mentor feedback |
| Practice | Bookmarks and progress | Expose Student data publicly |
| Mentors | Profile, verification, and service scope | Confirm slots outside Booking |
| Availability | Slots and overlap rules | Create payments |
| Booking | State machine, slot locking, and meeting-link access | Depend on email success |
| Feedback | Rubric, next actions, and review eligibility | Accept feedback before Completed |
| Moderation | Reports and content/mentor decisions | Modify audit logs |
| Notification | Events, templates, retry, and delivery status | Control business state |
| Analytics | Privacy-aware events/KPIs | Store unnecessary sensitive content |
| Audit | Security/business decision trail | Allow routine edit/delete |

### Dependency rules

- The UI calls application use cases and never accesses the database directly.
- Modules reference entities through IDs and public contracts; they do not modify another module's tables arbitrarily.
- Booking checks Mentor/Slot through a domain service in the same transaction when necessary.
- JD Analysis reads only Student-confirmed corrected_text and never analyzes the file directly or overwrites the corrected text.
- AI Assistance receives only a minimum snapshot; all output passes schema/domain validation and always has a rule-based/manual fallback.
- Question Matching uses public Taxonomy/Questions read contracts; every result has matching_version and never changes the Question Bank.
- Preparation Plan references a match snapshot/version. Booking accepts only Student-owned preparation_plan_id/job_description_id and stores the minimum Mentor context.
- Feedback records strengths, weaknesses, and next actions. Preparation Plan applies a next action through a separate use case; Feedback never edits plan tables directly.
- Notification consumes post-commit outbox events.
- Analytics is not on the critical path.

### 6.1 JD-flow component responsibilities

The module table and dependency rules above define the JD-flow component boundaries. Calls use explicit application contracts and never imply permission to modify another module's tables directly. Feedback → Preparation Plan is an “apply next action” use case initiated by the Student, not an implicit transaction when a Mentor submits feedback.

### Notification event model

Events are booking.requested, booking.confirmed, booking.reschedule_proposed, booking.cancelled, session.reminder_due, and feedback.submitted. Every event contains an immutable ID, aggregate ID, type, occurred-at value, deduplication key, and minimum payload. The worker provides at-least-once, idempotent processing, exponential backoff with jitter, and dead-letter/manual-retry state. See [ADR-003](ADR-003-Notification-Reliability_EN.md).

## 7. Core runtime flows

### 7.1 JD to preparation plan

The Student pastes text or uploads a PDF/image. JD Ingestion stores the input and, when necessary, creates an asynchronous extraction job. The worker extracts text directly or uses OCR, then stores its status and result. The Student reviews and confirms the corrected text before JD Analysis detects requirements and Question Matching selects Published Questions. The Student then creates a Preparation Plan from the accepted matches.

Extraction uses PENDING, PROCESSING, SUCCEEDED, and FAILED states and a safe error code. The same file/text hash and extraction version may return an idempotent result. Analysis is blocked until text is confirmed and extraction reaches an appropriate final state. See [ADR-004](ADR-004-JD-Processing-and-Question-Matching_EN.md).

### 7.2 Self-practice from a preparation plan

The Student opens a preparation plan and retrieves matched or additional Published Questions through an indexed, paginated query. Bookmark and practice-status changes are saved only for the authenticated Student, and the updated state is returned to the Web application.

### 7.3 Preparation plan to booking

The Student selects “Practice with a mentor” from the preparation plan. Booking verifies that the Student owns the plan/JD, the Mentor matches the topic, and the slot is available; it then stores preparation_plan_id and job_description_id in the booking. A Mentor receives only corrected JD text, topics, question groups, and practice goals after a valid booking relationship exists. The original file is not shared by default.

### 7.4 Booking confirmation and double-booking prevention

When a Mentor accepts a pending booking, the Booking service starts a transaction, locks the slot and booking, validates ownership/state/availability, confirms the booking, records the transition and idempotency key, and inserts a deduplicated notification event before commit. A partial unique index prevents more than one occupying booking for the same slot.

Transaction details, conflict codes, retry, and concurrent-acceptance testing are in [ADR-002](ADR-002-Booking-Consistency_EN.md). Every Mentor, Student, and Administrator path calls the same state-machine service; no route updates the state directly.

### 7.5 Completion, feedback, and return to plan

An authorized Mentor/Administrator moves a booking to Completed under policy. Feedback verifies Mentor ownership and Completed state, validates the rubric, and stores strengths, weaknesses, next actions, and an audit event. The Student reads feedback through ownership policy and may accept a next action to add/update a preparation-plan item before continuing practice. Analytics records only completion states and outcome codes, not JD or feedback content.

## 8. Data design

### 8.1 Core entity relationships

A slot may have multiple PENDING bookings, but a partial unique index permits only one booking in an occupying state. A booking created from the JD flow must reference a preparation plan or job description owned by the same Student; constraints/service validation prevent cross-owner context. Feedback and Review are each unique by booking_id, and only the booking Student may review. NotificationJob has a logical relationship through aggregate ID/event key and never controls booking state.

### 8.2 Entity responsibilities

| Entity | Main fields/functions |
|---|---|
| User | id, email, status, roles, authentication metadata |
| StudentProfile | user_id, target roles, goals, privacy settings |
| JobDescription | id, student_id, source_type, original_file_ref, extracted_text, corrected_text, extraction_method/status/version, confirmed_at, created_at |
| JDRequirement | id, job_description_id, analysis_version, raw_text/source span, requirement_type, normalized_topic_id, confidence/rule evidence |
| JDQuestionMatch | job_description_id, requirement_id, question_id, match_score, match_reason, matching_version; unique by version |
| PreparationPlan | id, student_id, job_description_id, status, matching_version, created_at, updated_at |
| PreparationPlanItem | plan_id, requirement/topic/question, source match, priority, practice state, mentor next action |
| MentorProfile | user_id, expertise, bio, status, public fields |
| MentorVerification | mentor_id, evidence reference, status, decision audit |
| MentorExpertise | mentor_id, topic_id or position_id, evidence reference, status; constraint requires exactly one taxonomy target |
| Position/Topic | Taxonomy and status |
| Question | Content, type, difficulty, status, provenance, version |
| QuestionPosition/QuestionTopic | Many-to-many Question ↔ Position/Topic; composite unique key |
| PracticeProgress | student_id, question_id, bookmark, status |
| AvailabilitySlot | mentor_id, start/end UTC, timezone, status |
| Booking | student, mentor, slot, job_description_id/preparation_plan_id, goal, type, state, meeting reference |
| BookingTransition | booking, from/to, actor, reason, timestamp |
| Feedback | unique booking_id, rubric, strengths, weaknesses, actions |
| Review | unique booking_id, rating, comment, moderation status |
| NotificationJob | event, channel, attempt, status, next_attempt |
| IdempotencyRecord | actor, key, operation, request hash, response reference |
| Report/AuditLog | target, actor, action, reason, timestamp |

### 8.3 Data consistency

- Store instants in UTC and retain source timezone for display/audit.
- Use database constraints for one Review/Feedback per booking.
- Use transactions, ordered row locks, and a partial unique index to prevent duplicate slot bookings.
- Booking state transitions go through one domain service.
- corrected_text has an optimistic version; analysis receives the expected version to prevent results from being stored against old text.
- Requirements/matches are immutable snapshots by analysis_version/matching_version. A rerun creates a new version instead of changing history used by plans/bookings.
- MentorExpertise references exactly one topic_id or position_id; only valid/approved expertise is used for mentor recommendations.
- A unique key prevents duplicate (job_description_id, requirement_id, question_id, matching_version) entries.
- Matching joins only active taxonomy and PUBLISHED Questions and uses deterministic sorting for stable results.
- Soft deletion is used only for an operational reason; privacy deletion has a separate policy.
- Migrations are versioned and have appropriate rollback/forward tests.

## 9. Sensitive data and lifecycle

- Public: display name, expertise, approved service scope, and public rating.
- Private: email/contact data, JD text/files, requirements, preparation plans, meeting links, booking goals, feedback, and progress.
- Restricted: verification evidence, moderation notes, and security audit data.
- Never log credentials, tokens, raw JD text, original filenames, meeting secrets, or full feedback text.
- The PoC accepts at most 50,000 pasted characters or one PDF/PNG/JPEG up to 10 MB. PDF limit is five pages; PNG/JPEG is one image. Internal OCR supports Vietnamese/English, at most two concurrent tasks per process, 60-second timeout, and two automatic attempts. Validate magic bytes/MIME, do not trust extensions, and never execute macros/scripts/embedded attachments.
- In the PoC, the original JD file stays in temporary private storage behind an adapter and is deleted after extraction or within 24 hours. In the MVP/pilot, the adapter uses private object storage with opaque IDs; only ingestion/worker can read it. A Student receives no durable file URL, and a Mentor cannot view the original file by default.
- Extracted/corrected text, requirements, matches, and plans belong to the Student. Inactive drafts older than 90 days enter cleanup; deleting a JD/account cascades or anonymizes related artifacts under a tested policy. These are PoC baselines and require privacy/legal review before a real pilot.
- A Mentor sees only corrected text, topics/questions, and minimum goals for their booking; no original file or unnecessary metadata. Unrelated users are denied by default.
- In the MVP/pilot, verification/JD object storage uses private buckets, encryption at rest, and short-lived signed URLs only when download is necessary.

## 10. Integration contracts and fallback

| Integration | Contract | Failure handling |
|---|---|---|
| Email | Template + recipient + idempotency key | Retry, in-app status, manual resend |
| Meeting | URL supplied by Mentor/Administrator or adapter | Allow replacement before cutoff; preserve booking |
| Text extraction | Internal parser adapter for pasted text/text PDFs | Use OCR for empty/insufficient text; always allow manual correction |
| OCR | Internal OCR adapter for PNG/JPEG/scanned PDF | Clear timeout/unsupported/low-confidence state; never analyze the JD itself |
| Calendar — future/optional | Export/link, not a source of truth | Manual scheduling remains available |
| Analytics | Versioned event schema with no sensitive payload | Drop/retry outside the critical path |

## 11. API design

Proposed route groups:

- /api/v1/auth, /api/v1/me, /api/v1/student-profile.
- POST /api/v1/job-descriptions — accept pasted text or file metadata/upload and create a private resource.
- POST /api/v1/job-descriptions/{id}/extract — enqueue/idempotently retry extraction; return job/status and do not equate OCR with analysis.
- PATCH /api/v1/job-descriptions/{id}/text — store corrected text and version after Student review.
- POST /api/v1/job-descriptions/{id}/analyze — analyze confirmed corrected text and create a new requirement/match version.
- GET /api/v1/job-descriptions/{id}/matches — return source requirement, topic, Published Question, score/reason, and matching version.
- POST /api/v1/preparation-plans — create a plan from a JD and valid matches.
- /api/v1/questions, /api/v1/topics, /api/v1/positions, /api/v1/practice-progress.
- /api/v1/mentors, /api/v1/mentor-verifications, /api/v1/availability-slots.
- /api/v1/bookings, /api/v1/bookings/{id}/transitions, /api/v1/bookings/{id}/feedback, /api/v1/reviews.
- /api/v1/admin/questions, /api/v1/admin/mentors, /api/v1/admin/reports, /api/v1/admin/audit.

These JD routes are a discussion baseline for PoC and frontend/backend, not an approved API contract. OpenAPI and design review must finalize payloads, upload flow, polling/status, error codes, and version fields before formal implementation.

### Contract conventions

- Clear JSON schemas/DTOs, server-side validation, and stable error codes.
- Cursor/page pagination and deterministic sorting.
- Idempotency-Key is required for booking creation and critical transitions.
- Idempotency-Key is also required for extraction/analysis retry; analysis includes the corrected-text version.
- Upload uses streaming/bounded buffers, content-type allowlists, size/page/time limits, and dedicated errors: UNSUPPORTED_DOCUMENT, FILE_TOO_LARGE, EXTRACTION_FAILED, TEXT_NOT_CONFIRMED.
- Use optimistic versions or ETags for conflict-prone updates.
- Never accept client userId/role as an authorization source.
- Version contracts in OpenAPI; generate/check the frontend client contract in CI where practical.
- The minimum error envelope contains code, message, correlationId, and field errors; never expose stack traces or SQL.

### High-risk routes before release

JD upload/read/delete, extraction retry, corrected-text update, analysis/matches, booking-context access, booking accept/reschedule/cancel/complete, meeting-link access, feedback create/read, mentor-verification decisions, and administrator moderation require integration tests for the happy path, malformed input, unauthorized access, invalid state, and applicable concurrency.

## 12. Security architecture

### Authentication and session

- Server-side sessions store a hash/token reference and expiry; the session ID exists only in the cookie.
- Hash passwords with Argon2id or an algorithm approved by security review; rate-limit login/reset.
- The __Host- cookie uses Secure, HttpOnly, SameSite=Lax, Path=/, and no Domain; the frontend calls only relative /api/v1.
- The static host proxies requests to the API; cookie-authenticated mutations use a CSRF token and origin checks.
- If direct cross-origin API access is enabled later, CORS uses an exact allowlist and cookie scope requires security review.
- Support session revocation, email verification, and short-lived reset tokens.

### Authorization

- RBAC grants capabilities; ownership/relationship checks protect objects.
- Default deny, with policy tests for Student, Mentor, Administrator, and unrelated user access to JDs, matches, plans, booking context, meeting links, and feedback.
- A Student owns their JD/plan. A Mentor receives only a minimum read projection for an active booking. Administrator access to JD content is limited to defined support/security purposes and must be audited.
- Separate Administrator routes and audit privileged decisions.
- Never rely on hiding UI buttons.

### Application and infrastructure

- Validate length/type/enums, encode output, and use parameterized queries/safe ORM.
- Upload validates magic bytes/MIME, size/page limits, sanitized filenames, decompression/parse limits, and timeouts. Parser/OCR runs with least privilege and no network by default and never returns stack/parser details to clients.
- Treat corrected text as untrusted when rendering; JD HTML/scripts cannot execute in React.
- Use TLS, secret-manager/environment secrets, dependency scanning, and patching.
- Rate-limit authentication, upload/extraction/analysis, search abuse, booking, review/report; per-Student quota prevents OCR from exhausting CPU/storage.
- Verify backup restores and use least-privilege database/service accounts.
- Maintain a security-incident runbook for link/token/data exposure.

## 13. Reliability, performance, and observability

### Initial service targets

The pilot validation profile uses one API instance, a configured connection pool, and PostgreSQL containing at least 1,000 Published Questions, 100 Mentors, 1,000 future Slots, and 500 Bookings. The JD corpus contains at least ten labeled samples: pasted text, text PDF, image/scanned PDF, and at least one unsupported file. Normal API load tests run 20 concurrent virtual users for ten minutes after warm-up; OCR benchmarks run separately to avoid hiding request-path latency. This is a comparison baseline and must be updated when actual pilot scale is approved.

The recall, precision@10, and task-completion thresholds below are **initial proposed exit gates**, not approved product KPIs. Trí must report actual measurements and the corpus/rubric. The Product Owner may change thresholds through a recorded review but must not rewrite PoC results after execution.

| Target | Pilot target | Verification |
|---|---:|---|
| Search/list API | p95 ≤ 3 seconds; HTTP 5xx < 1% | Load test under the profile above with deterministic data |
| JD intake completion | 100% of valid corpus files produce editable text or a recoverable error state | Corpus test + task analytics |
| Extraction quality | Report success by source type and character/field accuracy against ground truth | Compare before manual correction; keep direct extraction separate from OCR |
| Requirement detection | Recall ≥ 80% on labeled pilot-role requirements | Golden-dataset test with false positives/negatives |
| Mapping relevance | Precision@10 ≥ 80% under a domain-review rubric | Blind review on the same corpus/version |
| Matching stability | 100% identical ordered results for the same corrected text + taxonomy + matching version | Repeatability test and result hash |
| JD-to-plan task completion | At least 80% of test users complete without help | Five-screen usability test |
| Booking detail/mutation | p95 ≤ 3 seconds, excluding provider notification | Integration/load test on staging |
| Booking consistency | Exactly one winner among 20 concurrent confirmations for the same slot | PostgreSQL concurrency test under ADR-002 |
| Critical workflow test pass | 100% | Evidence report for eight architecture validation scenarios and ten acceptance criteria |
| Critical/High open defects before UAT | 0 | Defect register and UAT exit review |
| Notification enqueue | Outbox in the same transaction; worker pickup p95 ≤ 10 seconds while provider works | Fake-provider integration test and job metrics |
| Backup/restore | RPO ≤ 24 hours; RTO ≤ 4 hours | Nightly logical backup and a restore drill before pilot |
| Transport security | TLS 1.2 or later | Deployment/security configuration check |

Free-tier deployment has no uptime SLA. Establish an availability target only after the team selects a paid pilot plan or a provider with an appropriate SLA.

### Observability

- Structured logs with correlation ID, pseudonymous actor ID, and event type.
- Metrics: request latency/errors; extraction queue age, duration/failure by source/method/error class; OCR fallback rate; manual-correction delta; requirement recall; mapping precision@10; result stability; notification backlog/failure; booking-transition failure.
- Logs/metrics record extraction_version, analysis_version, matching_version, counts, and timing, but never raw JD/requirement text.
- Business events: JD submitted, extraction completed/failed, text corrected/confirmed, plan created, question practiced, Mentor selected, booking requested/confirmed/completed, feedback submitted, and next action applied.
- Alerts for authentication anomalies, repeated unauthorized JD access, extraction backlog/timeouts, abnormal increases in empty mapping results, booking conflicts, notification backlog, and provider failure.

### 13.1 Test strategy

| Test level | Required scope |
|---|---|
| Unit | Source classifier, alias normalization, requirement rules, scoring/tie-break, reason templates, state transitions, and authorization policies |
| Adapter contract | Direct PDF extraction, OCR adapter, timeout/error normalization, and fake fixtures; never depend on UI screenshots |
| Golden dataset | Compare extracted text/requirements/matches against the labeled corpus; measure recall, precision@10, and versioned regression |
| Integration | Upload limits, private storage, processing-job retry/idempotency, corrected-text optimistic version, Published-only queries, plan/booking foreign keys, and retention cleanup on real PostgreSQL |
| Security/privacy | MIME spoofing, malformed/oversized files, parser timeout, corrected-text XSS, owner/Mentor/Administrator/unrelated-user matrix, and log-redaction assertions |
| Concurrency/reliability | Repeat analysis, duplicate workers, 20 concurrent booking confirmations, and outbox retry/dead-letter |
| E2E/usability | Five primary states: JD entry, text review, explained plan, Mentor/booking, and session/feedback returned to the plan |

JD test fixtures must be synthetic or de-identified. Every benchmark records corpus version, taxonomy/alias/rule version, runtime, and environment for reproducibility.

## 14. UX routes and traceability

| Route/screen | Story | Module |
|---|---|---|
| /job-descriptions/new | US-24–25 (proposed) | JD Ingestion/Text Extraction |
| /job-descriptions/{id}/review | US-26 (proposed) | JD Ingestion |
| /preparation-plans/{id} | US-27–29 (proposed) | JD Analysis/Question Matching/Preparation Plan |
| /questions and detail | US-04–06 | Questions/Practice |
| /mentors and profile | US-10 | Mentors/Availability |
| /bookings/new?plan={id} | US-11, US-30 (proposed) | Preparation Plan/Booking |
| /bookings/{id} | US-12–16,19 | Booking/Feedback/Notification |
| /mentor/profile, /mentor/availability | US-07,09 | Mentors/Availability |
| /mentor/bookings | US-12,13,15 | Booking/Feedback |
| /admin/mentors, /admin/questions, /admin/reports | US-08,18,20 | Moderation/Audit |

US-24–30 are proposed IDs from the change brief dated 15/08/2026. Architecture does not treat them as baselined until the Product Owner updates Product_Backlog_and_Acceptance_Criteria.md without changing existing IDs.

## 15. PoC validation of the proposed MVP architecture

The items below are **architecture validation scenarios**, not eight independent PoCs, and do not automatically become implementation change requests. The Architecture Owner updates status when evidence arrives. A scenario without evidence remains Pending and is assigned to the PoC owner only through a separate change request.

| Scope | Current status | Handling |
|---|---|---|
| Question filtering | Existing PoC; pending evidence review | Compare source/test/results before changing ADR status |
| Mentor booking, transitions, meeting links, and feedback | Existing PoC; pending evidence review | Keep current implementation; request additions only after review |
| JD intake, extraction/OCR, analysis, matching, and preparation plan | Pending PoC | Architecture describes the target; no immediate implementation request |
| JD preparation-plan integration with Mentor booking/feedback | Optional follow-up | Execute only after scope, time, and change request approval |

### VS-1: JD intake, extraction, and correction

Use a corpus containing pasted text, text PDFs, PNG/JPEG or scanned PDFs, and unsupported files. Pass when direct extraction is preferred, OCR runs only for images/scans, every valid JD produces editable text or a recoverable error, the Student can edit/confirm text, and invalid formats/sizes are safely blocked.

### VS-2: Requirement analysis and question matching

Run known corrected text through a fixed alias/taxonomy/rule set. Pass when expected skills are detected, aliases such as ReactJS → React normalize correctly, Draft/inactive-topic questions are excluded, every result contains source requirement/topic/question/score/reason/version, and repeated execution with identical input/version returns the same ordered results. Measure recall and precision@10 under Section 13; evidence follows ADR-004.

### VS-3: Preparation plan → Mentor → feedback loop

The Student creates a plan from matches, self-practices or selects a Mentor, and creates a booking with JD/plan context. The Mentor sees the correct corrected text, topics/question groups, and goals, opens an external meeting link, completes the session, and submits strengths, weaknesses, and next actions. Pass when next actions return to the plan and unrelated users cannot view the context.

### VS-4: Booking consistency

Run at least 20 concurrent accept requests for the same slot on real PostgreSQL. Pass when exactly one booking occupies the slot, other responses are conflicts/idempotent, and only one logical transition/outbox event exists. Evidence follows ADR-002.

### VS-5: Authorization and privacy

Create Student A/B, Mentor A/B, and Administrator. Test read/write access to JDs, matches, plans, booking context, original files, meeting links, feedback, and verification. Pass when all unauthorized access is blocked server-side, original files are not shared with Mentors, and logs contain no raw JDs/secrets.

### VS-6: Booking transitions and audit

Test happy and invalid paths for PENDING → CONFIRMED → COMPLETED, cancellation/rescheduling, actor ownership, and retries. Pass when only valid transitions commit, each transition records actor/reason/timestamp, and no route bypasses the state machine.

### VS-7: Question filtering

Seed zero/one/many Questions with multiple tags and Draft/Published states. Pass when filtering/pagination is deterministic, creates no duplicates, and Draft Questions never appear in search or JD matching.

### VS-8: Notification resilience

Simulate provider timeouts, 5xx responses, and duplicate workers. Pass when the booking commits once, the worker retries idempotently, permanent failures become DEAD, and an operational state supports resolution. Evidence follows ADR-003.

These eight scenarios collect evidence for ten acceptance criteria in the change brief: editable text, expected skills, alias normalization, no Draft/invalid taxonomy, explainable matches, deterministic versions, booking from a plan, object authorization, preserved booking/meeting/feedback flow, and feedback-generated next actions. A scenario outside the current PoC remains Pending; it is not considered failed.

### 15.1 Coordination contract with Trí

The Mentor-booking PoC exists, but the Architecture Owner has not fully reviewed source, tests, and results. The JD/OCR/mapping PoC had not been implemented as of 15/08/2026. When the team issues a change request or hands over evidence, the PoC owner returns the applicable artifacts under the agreed PoC directory:

| Artifact | Content Luân needs to update architecture |
|---|---|
| README.md | Runtime, setup, environment variables, migration/seed/test commands |
| POC_Result.md | Pass/Fail/Pending table for assigned validation scenarios, mapped to acceptance criteria, evidence, and limitations |
| fixtures/jd/ | De-identified JD corpus, ground-truth text/requirements, and relevance rubric |
| database/ | Migrations for JD/requirements/matches/plans, booking context, partial unique index, audit, processing jobs, and outbox |
| tests/ | Extraction/OCR, golden matching, repeatability, authorization matrix, concurrent booking, transitions, filtering, and retry tests |
| API contract | Actual routes/payloads/status/error codes, especially upload/extraction/analysis versions, 409, and Idempotency-Key |

After receiving results, Luân must: (1) compare ADR assumptions with evidence; (2) update ADR status; (3) revise diagrams/data/API when the PoC differs from baseline; and (4) record deviations and trade-offs without silently rewriting ADR history.

Design review is mandatory before accepting architecture for the MVP:

| Item | Current status | Exit evidence |
|---|---|---|
| Review backlog/module mapping | Prepared | Luân and Trí confirm that modules/APIs support approved validation scenarios and acceptance criteria |
| Review JD processing/matching | Pending PoC | Review corpus, extraction metrics, matching relevance/repeatability, and ADR-004 |
| Review database/concurrency design | Pending PoC | Review migrations and concurrent-test results |
| Review authorization/session topology | Pending PoC | Ownership matrix and deployed same-origin session test pass |
| Review notification/deployment | Pending PoC | Confirm failure/retry evidence and worker topology |
| Final decision | Pending | Meeting note or PR review records Accept/Revise and new ADR status |

### Recommended delivery order

1. Repository, CI/CD, authentication/RBAC, private storage, schema, and audit foundation.
2. Taxonomy/aliases and Question Bank seed for the pilot role.
3. JD intake, direct extraction/OCR adapter, and correction screen.
4. Requirement analysis, versioned matching, explained results, and preparation plan.
5. Self-practice plus Mentor discovery/profile/availability.
6. Booking context, state machine, and concurrency PoC.
7. External meeting handoff, notifications, and feedback-to-plan loop.
8. Analytics, E2E, privacy/security tests, UAT, and release.

## 16. Risks, constraints, and mitigation

| Risk | Mitigation |
|---|---|
| OCR quality depends on file/image quality | Direct extraction first, supported-format limits, corpus benchmark, confidence/error state, and mandatory manual correction |
| Extraction errors cause matching errors | Analyze only confirmed corrected text; version/hash; show source requirements and allow rerun |
| Missing pilot-role taxonomy/aliases | Limit pilot role, use a golden dataset, review alias/version before demo, and never silently fall back to AI |
| Irrelevant mapping results | Explainable rule-based score, Published/active taxonomy only, precision@10 review, and threshold/version gate |
| JDs contain PII/company information | Private storage, least privilege, log redaction, automatic file deletion, Student deletion, and retention review |
| Double booking | Database constraint, transaction, lock, and concurrency test |
| Broken object authorization | Central policy, default deny, and matrix integration tests |
| Provider outage | Outbox/retry, fallback, and internal source of truth |
| Scope creep | ADR, release boundary, and change control |
| PII leakage | Data classification, log redaction, private storage, and retention |
| Content/review abuse | Provenance, moderation, report/appeal, and audit |
| Stack mismatch with team | Spike and ADR after skill matrix; avoid unnecessary new technologies |
| Too few Mentors in the marketplace | Preparation plans and self-practice provide value before booking; limit pilot Mentors by topic |

## 17. Traceability to course slides

| Course material | Architecture response |
|---|---|
| [03 — Slide 011: Which Architecture?](../../refs/03-software-project-initiation.md) | ADR-001 explains architectural style, technology stack, framework, and deployment platform |
| [06.1 — Slides 032–033: System Architecture](../../refs/06-1-agile-planning.md) | Backlog traceability, system context, components, interfaces, NFRs, and design-review gate |
| [05.1 — Slide 024: Solution Engineering Decomposition](../../refs/05-1-work-breakdown-structure.md) | ER model, module design, technology, external integrations, and ADR patterns |
| [07 — Slides 041–050: SCM, CI/CD, and DevOps](../../refs/07-software-configuration-management.md) | Branches/lockfile, independent pipelines, Docker, environment configuration, and monitoring |
| [10.1 — Slides 010–014: Technology risk](../../refs/10-1-agile-risk-management.md) | Familiar stack, PoC gates, transition indicators, and ADR contingency |
| [11 — Slides 024–025: Quality requirements](../../refs/11-software-quality-management.md) | NFR metrics, test profile, evaluation method, and exit criteria |
