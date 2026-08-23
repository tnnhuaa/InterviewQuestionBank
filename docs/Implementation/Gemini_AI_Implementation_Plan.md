# Gemini AI Implementation Plan for PrepVI

| Attribute | Value |
| --- | --- |
| Status | Approved for implementation behind feature flags |
| Discussion source | `docs/Project_Architecture/Gemini_AI_Integration_Discussion.md` |
| Scope | JD analysis, recommendation explanation, interview agenda, and feedback drafts |
| Principle | Gemini only assists; PostgreSQL, policy, and the deterministic scorer remain the source of truth |

## 1. Conditions before implementation

- ADR-005 is the hybrid Gemini implementation decision; ADR-004 keeps rule-based matching as the baseline/fallback.
- Gemini must not create taxonomy, Questions, Mentors, slots, bookings, official feedback, or change business state itself.
- Gemini failure must not block the Preparation Plan, Booking, or Feedback; the rule-based/manual flow must always work.
- Never send the original JD file, passwords/tokens, verification evidence, meeting links, recordings, or transcripts.
- No Gemini reranking in the first version. Question scores and Mentor order remain deterministic.

## 2. Initial configuration decisions

### Model

- Chosen model: `gemini-3.5-flash-lite`.
- Use a specific stable model; never use the `latest` alias, preview models, or experimental models in production.
- Use the same model for JD extraction, explanation, agenda, and feedback draft in the first version to reduce variables when evaluating.
- Split models per task only after latency, token, cost, and quality data exist on the team's own corpus.
- On the current Gemini API Free tier, this model shows limits of `15 RPM`, `250K TPM`, and `500 RPD`; the application sets a budget below the provider quota to leave a safety margin.

```dotenv
AI_PROVIDER=gemini
AI_ENABLED=false
AI_JD_ANALYSIS_ENABLED=false
AI_RECOMMENDATION_EXPLANATION_ENABLED=false
AI_AGENDA_DRAFT_ENABLED=false
AI_FEEDBACK_DRAFT_ENABLED=false

GEMINI_API_KEY=
GEMINI_MODEL=gemini-3.5-flash-lite
GEMINI_API_VERSION=v1
GEMINI_TIMEOUT_MS=15000
GEMINI_MAX_ATTEMPTS=2
GEMINI_CONCURRENCY=2
GEMINI_TEMPERATURE=0.1
GEMINI_MAX_INPUT_TOKENS=20000
GEMINI_MAX_OUTPUT_TOKENS=4096
GEMINI_DAILY_REQUEST_BUDGET=450
GEMINI_DAILY_INPUT_TOKEN_BUDGET=5000000
GEMINI_CIRCUIT_BREAKER_FAILURE_THRESHOLD=5
GEMINI_CIRCUIT_BREAKER_RESET_SECONDS=60
AI_RESULT_RETENTION_DAYS=30
```

`GEMINI_API_KEY` exists only in backend/secret manager. Do not create `VITE_GEMINI_*` variables and do not call Gemini directly from the frontend.

### Decisions already implemented

- Requirements with confidence below `0.75` force the Student to accept/edit/mark unmapped before matching.
- JD analysis sends confirmed corrected text only; the original file is never sent to Gemini.
- The application budget is below the Free tier by default and has a per-Student limit; it can be adjusted via environment variables.
- Feedback draft notes are encrypted and deleted after processing or within 24 hours; AI metadata/results use the configured retention.
- All four features are implemented but disabled independently by default.
- Feedback keeps the fixed `technical/communication/structure` rubric at 0–5 in this increment.
- Admins can only emergently disable features via the Operations Queue; enabling at deployment remains controlled by environment variables/secret manager.

## 3. Current UI state and gaps

| Flow | Current state | Required AI change |
| --- | --- | --- |
| Upload/paste JD | Done | Inform what data is processed; frontend does not hold API keys |
| Review corrected text | Partial | Create analysis job, polling, retry, and rule-based fallback |
| Requirement mapping | Partial | Evidence highlight, confidence, AI label, accept/edit/unmapped |
| Question recommendation | Deterministic flow done | Keep current scores; AI only explains valid candidates |
| Preparation Plan | Groups Question, next action, and Mentor | Choose topics for Mentor support; explanation state |
| Mentor candidates | Hard-filtered and deterministic rank | AI explanation; no creation/reranking in the first version |
| Mentor detail → Booking | Partial | Keep `planId` and selected topic through Mentor detail |
| Booking | Backend revalidates plan/expertise/slot | Do not give AI mutations or state transitions |
| Mentor booking detail | No AI yet | CTA to create agenda draft and an editor for Mentor confirmation |
| Feedback | Manual form exists | AI draft per field, without overwriting Mentor-entered content |
| Operations | No AI case yet | Retry/dismiss/disable feature and reference ID |

## 4. Implementation architecture

```text
AI route/controller
  → AI application service
    → prompt/schema registry
      → AiProvider interface
        → GeminiProvider
```

- Use the server-side SDK `@google/genai`, Gemini API `v1`, and structured JSON output.
- Every output must pass JSON Schema/Zod and domain validation.
- Evidence spans must be inside the corrected text.
- Taxonomy IDs/slugs must exist and be active.
- Question/Mentor IDs must belong to the candidate set provided by the backend.
- Prompts treat JD content as untrusted data and must not let instructions in the JD change system policy.
- The circuit breaker switches to the rule-based/manual flow on consecutive provider failures.

## 5. Migration and data

Add the AI migration series:

- `005_gemini_ai_assistance.sql`: `ai_jobs`, `ai_runs`, requirement decisions, explanation, and draft tables.
- `006_ai_private_draft_inputs.sql`: encrypted Mentor draft inputs with a max 24-hour lifespan.
- `007_ai_operations.sql`: versioned feature control for audited emergency-disable actions.
- `ai_jobs`: kind, resource, status, attempt, processing lease, available time, and safe error code.
- `ai_runs`: provider, model, prompt/schema version, input/output hash, latency, token/cost metadata, and correlation ID.
- `ai_requirement_decisions`: Student accept/edit/unmapped for requirements.
- `ai_recommendation_explanations`: explanations tied to valid candidate IDs.
- `interview_agenda_drafts`.
- `feedback_drafts`.

Job states:

```text
PENDING → PROCESSING → SUCCEEDED
                     → SUCCEEDED_WITH_FALLBACK
                     → FAILED
                     → CANCELLED
```

Never log raw prompts/responses in the application log. The database prefers storing validated normalized results, hashes, and investigation metadata.

## 6. Vertical slices

### Slice A — AI foundation

- Feature flags, Gemini adapter, prompt/schema registry, and redaction.
- Job runner with lease, max two retries, timeout, quota, and circuit breaker.
- OpenAPI contract for job status, result metadata, and recovery.
- Error codes: `AI_TIMEOUT`, `AI_QUOTA_EXCEEDED`, `AI_INVALID_OUTPUT`, `AI_REQUEST_INVALID`, `AI_DISABLED`, `AI_PROVIDER_FAILURE`.

### Slice B — JD analysis

```http
POST  /job-descriptions/{id}/analysis-jobs
GET   /ai-jobs/{jobId}
POST  /ai-jobs/{jobId}/retry
GET   /job-descriptions/{id}/analysis
PATCH /job-descriptions/{id}/requirements/{requirementId}
```

1. The Student confirms corrected text.
2. The backend creates an idempotent job from the resource version, input hash, and prompt/schema/model version.
3. Gemini extracts requirements, evidence, and taxonomy candidates.
4. The backend validates and stores normalized results.
5. The Student confirms low-confidence/unmapped requirements.
6. The question finder continues to use the `40/30/15/15` weights, the `60`-point threshold, and fixed tie-breaking order.
7. If Gemini fails, the worker runs the current rule-based analyzer and returns `SUCCEEDED_WITH_FALLBACK`.

### Slice C — Smart Plan and Mentor explanation

- Keep the current Question scorer and Mentor ranking.
- Send only the hard-filtered candidate set with public expertise, topic overlap, and minimal goal.
- Gemini returns explanations by IDs within the candidate set.
- The UI clearly distinguishes "Fit score from system rules" and "AI-assisted explanation".
- When AI fails, the current deterministic reason is still shown.

UI flow:

```text
Preparation Plan
→ Choose topic needing Mentor support
→ View valid candidates
→ View Mentor detail keeping planId/topicIds
→ Choose slot
→ Backend revalidates and creates Booking
```

### Slice D — Agenda and feedback drafts

```http
POST  /bookings/{id}/agenda-drafts
PATCH /bookings/{id}/agenda-drafts/{draftId}
POST  /bookings/{id}/feedback-drafts
PATCH /bookings/{id}/feedback-drafts/{draftId}
```

- The Mentor explicitly requests the draft.
- Agenda uses only role/seniority, topics, goal, and Published Questions from the booking snapshot.
- Feedback drafts only help fill rubric/strengths/weaknesses/next actions.
- Do not overwrite content the Mentor entered.
- The Mentor must review and submit via the existing feedback mutation.
- The Student still actively chooses `actionIds` to update the plan.

### Slice E — Operations and rollout

- A failed AI job after retries creates an operation case with a reference ID.
- Admin action allowlist: `RETRY_AI_JOB`, `DISMISS`, `DISABLE_FEATURE`.
- Rollout sequence: local → staging → small pilot.
- Consider Gemini reranking only after a labeled dataset and comparison criteria against the deterministic baseline exist.

## 7. Manual validation and release gate

No automated-test implementation is added in the locked scope. The manual walkthrough must cover:

- Vietnamese JDs, English JDs, and mixed-language content.
- Low-confidence, unmapped, and invalid evidence spans.
- Prompt injection embedded in a JD.
- Gemini timeout, `429`, `503`, invalid JSON, and safety block.
- Unpublished Questions and unapproved Mentors never appear.
- Booking revalidation still guarantees only one transaction takes the slot.
- AI failure does not lose corrected text, Mentor notes, or feedback form state.
- Other users cannot read the AI results of another JD/plan/booking.
- With all feature flags off, the rule-based/manual flow still completes end to end.

Release gate:

- Requirement extraction and Question precision@10 are not below baseline; initial target `≥80%` on the labeled corpus.
- Candidate eligibility reaches `100%`.
- Evidence exists for latency, token/cost, invalid output, low confidence, and fallback rate.
- No Critical/High defects remain in the AI flow or fallback flow.

## 8. Commit/PR order

1. `docs: approve hybrid Gemini architecture`
2. `feat(ai): add provider adapter and job persistence`
3. `feat(jd): add AI-assisted requirement analysis`
4. `feat(plan): add recommendation explanations`
5. `feat(interview): add agenda and feedback drafts`
6. `feat(operations): add AI recovery and feature controls`
7. `docs: add manual AI validation evidence`

Each feature defaults to `false` until the corresponding migration, OpenAPI, UI fallback, and walkthrough are complete.

## 9. Gemini reference documentation

- [Models](https://ai.google.dev/gemini-api/docs/models)
- [API versions](https://ai.google.dev/gemini-api/docs/api-versions)
- [Structured outputs](https://ai.google.dev/gemini-api/docs/structured-output)
- [API key security](https://ai.google.dev/gemini-api/docs/generate-content/api-key)
- [Gemini API Terms](https://ai.google.dev/gemini-api/terms)
- [Zero Data Retention](https://ai.google.dev/gemini-api/docs/zdr)
