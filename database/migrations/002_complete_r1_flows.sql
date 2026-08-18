BEGIN;

ALTER TABLE taxonomy_versions
  ADD COLUMN row_version integer NOT NULL DEFAULT 1 CHECK (row_version > 0);

ALTER TABLE positions
  ADD COLUMN version integer NOT NULL DEFAULT 1 CHECK (version > 0);

ALTER TABLE topics
  ADD COLUMN version integer NOT NULL DEFAULT 1 CHECK (version > 0);

ALTER TABLE preparation_plan_items
  ADD COLUMN version integer NOT NULL DEFAULT 1 CHECK (version > 0);

CREATE TABLE booking_context_snapshots (
  booking_id uuid PRIMARY KEY REFERENCES bookings(id) ON DELETE CASCADE,
  job_description_id uuid NOT NULL REFERENCES job_descriptions(id),
  corrected_text_version integer NOT NULL,
  preparation_plan_id uuid REFERENCES preparation_plans(id),
  preparation_plan_version integer,
  role_summary text,
  seniority_summary text,
  topic_ids uuid[] NOT NULL DEFAULT '{}',
  question_ids uuid[] NOT NULL DEFAULT '{}',
  goal text NOT NULL,
  interview_type text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK ((preparation_plan_id IS NULL) = (preparation_plan_version IS NULL)),
  FOREIGN KEY (job_description_id, corrected_text_version)
    REFERENCES jd_text_versions(job_description_id, version)
);

CREATE TABLE feedback_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  feedback_id uuid NOT NULL REFERENCES feedback(id) ON DELETE CASCADE,
  description text NOT NULL,
  topic_id uuid REFERENCES topics(id),
  question_id uuid REFERENCES questions(id),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ix_feedback_actions_feedback ON feedback_actions(feedback_id, created_at, id);

CREATE TABLE feedback_action_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  feedback_action_id uuid NOT NULL REFERENCES feedback_actions(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  preparation_plan_id uuid NOT NULL REFERENCES preparation_plans(id) ON DELETE CASCADE,
  preparation_plan_item_id uuid NOT NULL REFERENCES preparation_plan_items(id) ON DELETE CASCADE,
  applied_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (feedback_action_id, student_id, preparation_plan_id)
);

CREATE TABLE completion_disputes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES users(id),
  reason text NOT NULL,
  evidence_metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'OPEN'
    CHECK (status IN ('OPEN', 'UPHELD', 'DISMISSED')),
  resolved_by uuid REFERENCES users(id),
  resolved_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz,
  version integer NOT NULL DEFAULT 1 CHECK (version > 0)
);

ALTER TABLE reports
  ADD COLUMN resolved_by uuid REFERENCES users(id),
  ADD COLUMN resolution_reason text,
  ADD COLUMN version integer NOT NULL DEFAULT 1 CHECK (version > 0);

ALTER TABLE meeting_links
  ADD COLUMN failure_reported_at timestamptz,
  ADD COLUMN recovery_deadline timestamptz;

CREATE INDEX ix_plan_items_plan_priority
  ON preparation_plan_items(plan_id, priority, practice_status, created_at, id);
CREATE INDEX ix_booking_context_topics
  ON booking_context_snapshots USING gin(topic_ids);

COMMIT;
