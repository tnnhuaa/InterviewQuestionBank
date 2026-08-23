# ADR-005 — Hybrid Gemini Assistance

| Attribute | Value |
|---|---|
| Status | Accepted for implementation behind feature flags |
| Decision date | 17/08/2026 |
| Related items | US-27–US-30, US-10, US-15–US-16 |

## 1. Context

The rule-based analysis and deterministic recommendations from ADR-004 created an end-to-end flow, but support for mixed Vietnamese/English JDs, recommendation explanations, and Mentor agenda/feedback drafting remains limited. The system needs Gemini assistance without transferring the source of truth or business mutations to the model.

## 2. Decision

Use a hybrid architecture:

- Gemini handles requirement extraction, taxonomy candidates, explanations, interview-agenda drafts, and feedback drafts.
- PostgreSQL, authorization policies, active taxonomy, Published Questions, Approved Mentors, deterministic scoring/ranking, and booking transactions remain the sources of truth.
- Every Gemini output is untrusted input and requires structured JSON, schema validation, and domain validation.
- A Question/Mentor ID is accepted only when it belongs to the candidate set supplied by the backend.
- The Student confirms low-confidence/unmapped requirements; the Mentor reviews/edits agenda and feedback before submission.
- Provider failure always falls back to rule-based/manual flow and never rolls back committed business state.
- Gemini reranking, AI interviewer/scoring, recording, and transcripts are not implemented in this increment.

## 3. Provider and model

- Provider adapter: AiProvider; first implementation: GeminiProvider using the server-side @google/genai SDK.
- API version: v1.
- Selected model: gemini-3.5-flash-lite.
- The API key exists only in the backend/secret manager; the frontend has no VITE_GEMINI_* variable.
- Model/prompt/schema version, input/output hash, latency, token metadata, status, and correlation ID are stored for operations; raw JDs, prompts, and responses are not written to application logs.

## 4. Jobs and failure policy

AI calls run as PostgreSQL jobs with a lease and states PENDING, PROCESSING, SUCCEEDED, SUCCEEDED_WITH_FALLBACK, FAILED, and CANCELLED.

- At most two attempts, with configurable timeout and concurrency.
- Application quota is lower than provider quota; one Student cannot consume the entire quota.
- Invalid JSON/schema/evidence/candidate IDs are rejected before a domain result is written.
- A job that exhausts retries creates an operation case with a reference ID.
- A circuit breaker can disable the provider while preserving manual/rule-based flow.

## 5. Privacy

- Send only confirmed corrected text or the minimum booking snapshot.
- Do not send passwords/tokens, original JD files, verification evidence, email addresses, meeting links, recordings, transcripts, or unrelated-user data.
- Do not use Google Search/Maps grounding for these use cases.
- Enable the pilot only after data-processing/retention review and with billing configuration suitable for real data.

## 6. Consequences

### Positive

- Better natural-language understanding while deterministic eligibility and mutations remain protected.
- The UI provides clear explanations/evidence and a manual recovery path when the provider fails.
- Quality and cost can be measured per prompt/model/schema version.

### Negative

- Adds an external dependency, latency, quota, cost, and failure modes.
- Gemini output is not fully deterministic; version/hash and human confirmation are required.
- AI jobs, redaction, circuit breaker, and operation cases must be operated.

## 7. Release gate

- Requirement recall and Question precision@10 must not be below baseline; initial target is at least 80% on a labeled corpus.
- Candidate eligibility must be 100%: never return an unpublished Question or unapproved Mentor.
- Manual/rule-based flow must remain usable during provider failure.
- Raw JDs or secrets must not appear in logs, errors, or support details.
- Feature flags default to off until the corresponding manual walkthrough passes.

## 8. Related material

- [ADR-004 — JD Processing and Question Matching Strategy](ADR-004-JD-Processing-and-Question-Matching_EN.md)
- [Software Architecture](Software_Architecture_EN.md)
- [Gemini AI Implementation Plan](../../Implementation/Gemini_AI_Implementation_Plan.md)
