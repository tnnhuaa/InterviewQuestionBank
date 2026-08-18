BEGIN;

ALTER TABLE operation_cases
  DROP CONSTRAINT operation_cases_case_type_check;

ALTER TABLE operation_cases
  ADD CONSTRAINT operation_cases_case_type_check CHECK (case_type IN (
    'MENTOR_VERIFICATION', 'QUESTION_MODERATION', 'EXTRACTION_FAILED',
    'NOTIFICATION_DEAD', 'MEETING_LINK_FAILED', 'LATE_CHANGE',
    'NO_SHOW', 'COMPLETION_DISPUTE', 'REVIEW_MODERATION', 'AI_JOB_FAILED'
  ));

CREATE TABLE ai_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL CHECK (kind IN (
    'JD_ANALYSIS', 'RECOMMENDATION_EXPLANATION', 'INTERVIEW_AGENDA', 'FEEDBACK_DRAFT'
  )),
  resource_type text NOT NULL CHECK (resource_type IN ('JOB_DESCRIPTION', 'PREPARATION_PLAN', 'BOOKING')),
  resource_id uuid NOT NULL,
  actor_id uuid NOT NULL REFERENCES users(id),
  status text NOT NULL DEFAULT 'PENDING' CHECK (status IN (
    'PENDING', 'PROCESSING', 'SUCCEEDED', 'SUCCEEDED_WITH_FALLBACK', 'FAILED', 'CANCELLED'
  )),
  input_hash char(64) NOT NULL,
  provider text NOT NULL,
  model text NOT NULL,
  prompt_version text NOT NULL,
  schema_version text NOT NULL,
  attempt_count integer NOT NULL DEFAULT 0 CHECK (attempt_count >= 0),
  max_attempts integer NOT NULL DEFAULT 2 CHECK (max_attempts BETWEEN 1 AND 5),
  available_at timestamptz NOT NULL DEFAULT now(),
  locked_at timestamptz,
  locked_until timestamptz,
  started_at timestamptz,
  finished_at timestamptz,
  duration_ms integer,
  error_code text,
  fallback_used boolean NOT NULL DEFAULT false,
  result jsonb,
  correlation_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (kind, resource_type, resource_id, input_hash, provider, model, prompt_version, schema_version)
);
CREATE INDEX ix_ai_jobs_claim ON ai_jobs(status, available_at, created_at);
CREATE INDEX ix_ai_jobs_actor ON ai_jobs(actor_id, created_at DESC);

CREATE TABLE ai_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES ai_jobs(id) ON DELETE CASCADE,
  attempt integer NOT NULL CHECK (attempt > 0),
  provider text NOT NULL,
  model text NOT NULL,
  prompt_version text NOT NULL,
  schema_version text NOT NULL,
  input_hash char(64) NOT NULL,
  output_hash char(64),
  status text NOT NULL CHECK (status IN ('PROCESSING', 'SUCCEEDED', 'FAILED')),
  latency_ms integer,
  input_tokens integer,
  output_tokens integer,
  total_tokens integer,
  error_code text,
  correlation_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz,
  UNIQUE (job_id, attempt)
);

CREATE TABLE ai_requirement_decisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requirement_id uuid NOT NULL REFERENCES jd_requirements(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  decision text NOT NULL CHECK (decision IN ('ACCEPTED', 'EDITED', 'UNMAPPED')),
  selected_topic_id uuid REFERENCES topics(id),
  reason text,
  analysis_version integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (requirement_id, student_id)
);

CREATE TABLE ai_recommendation_explanations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES ai_jobs(id) ON DELETE CASCADE,
  preparation_plan_id uuid NOT NULL REFERENCES preparation_plans(id) ON DELETE CASCADE,
  candidate_type text NOT NULL CHECK (candidate_type IN ('QUESTION', 'MENTOR')),
  candidate_id uuid NOT NULL,
  explanation text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (job_id, candidate_type, candidate_id)
);
CREATE INDEX ix_ai_explanations_plan ON ai_recommendation_explanations(preparation_plan_id, candidate_type);

CREATE TABLE interview_agenda_drafts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL UNIQUE REFERENCES ai_jobs(id) ON DELETE CASCADE,
  booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  mentor_id uuid NOT NULL REFERENCES mentor_profiles(id),
  agenda jsonb NOT NULL,
  status text NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'USED', 'DISCARDED')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  version integer NOT NULL DEFAULT 1 CHECK (version > 0)
);

CREATE TABLE feedback_drafts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL UNIQUE REFERENCES ai_jobs(id) ON DELETE CASCADE,
  booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  mentor_id uuid NOT NULL REFERENCES mentor_profiles(id),
  rubric_scores jsonb NOT NULL DEFAULT '{}'::jsonb,
  strengths text NOT NULL DEFAULT '',
  weaknesses text NOT NULL DEFAULT '',
  next_actions jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'USED', 'DISCARDED')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  version integer NOT NULL DEFAULT 1 CHECK (version > 0)
);

COMMIT;
