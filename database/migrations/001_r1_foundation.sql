BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE TABLE IF NOT EXISTS schema_migrations (
  version text PRIMARY KEY,
  checksum text NOT NULL,
  applied_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS seed_runs (
  dataset text NOT NULL,
  version text NOT NULL,
  checksum text NOT NULL,
  applied_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (dataset, version)
);

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  password_hash text NOT NULL,
  display_name text NOT NULL,
  status text NOT NULL DEFAULT 'PENDING_VERIFICATION'
    CHECK (status IN ('PENDING_VERIFICATION', 'ACTIVE', 'SUSPENDED', 'DELETED')),
  email_verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  version integer NOT NULL DEFAULT 1 CHECK (version > 0)
);
CREATE UNIQUE INDEX ux_users_email ON users (lower(email));

CREATE TABLE roles (
  code text PRIMARY KEY CHECK (code IN ('STUDENT', 'MENTOR', 'ADMIN')),
  description text NOT NULL
);

CREATE TABLE user_roles (
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_code text NOT NULL REFERENCES roles(code),
  granted_by uuid REFERENCES users(id),
  granted_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, role_code)
);

CREATE TABLE sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash char(64) NOT NULL UNIQUE,
  csrf_secret_hash char(64) NOT NULL,
  expires_at timestamptz NOT NULL,
  revoked_at timestamptz,
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ix_sessions_user_active ON sessions (user_id, expires_at) WHERE revoked_at IS NULL;

CREATE TABLE one_time_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  purpose text NOT NULL CHECK (purpose IN ('VERIFY_EMAIL', 'RESET_PASSWORD', 'ADMIN_INVITE')),
  token_hash char(64) NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  consumed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE student_profiles (
  user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  target_position text,
  interview_type text,
  interview_goal text,
  interview_date date,
  timezone text NOT NULL DEFAULT 'Asia/Ho_Chi_Minh',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  version integer NOT NULL DEFAULT 1 CHECK (version > 0)
);

CREATE TABLE taxonomy_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  version text NOT NULL UNIQUE,
  status text NOT NULL CHECK (status IN ('DRAFT', 'ACTIVE', 'ARCHIVED')),
  description text,
  created_by uuid REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE positions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  status text NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'ARCHIVED')),
  priority integer NOT NULL DEFAULT 100,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  status text NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'ARCHIVED')),
  priority integer NOT NULL DEFAULT 100,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE topic_aliases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  taxonomy_version_id uuid NOT NULL REFERENCES taxonomy_versions(id),
  topic_id uuid NOT NULL REFERENCES topics(id),
  alias text NOT NULL,
  normalized_alias text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (taxonomy_version_id, normalized_alias)
);

CREATE TABLE questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  content text NOT NULL,
  answer_criteria jsonb NOT NULL DEFAULT '[]'::jsonb,
  difficulty text NOT NULL CHECK (difficulty IN ('EASY', 'MEDIUM', 'HARD')),
  lifecycle_status text NOT NULL DEFAULT 'DRAFT'
    CHECK (lifecycle_status IN ('DRAFT', 'IN_REVIEW', 'PUBLISHED', 'ARCHIVED')),
  source_name text NOT NULL,
  source_url text,
  provenance_note text NOT NULL,
  created_by uuid REFERENCES users(id),
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  version integer NOT NULL DEFAULT 1 CHECK (version > 0)
);

CREATE TABLE question_topics (
  question_id uuid NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  topic_id uuid NOT NULL REFERENCES topics(id),
  PRIMARY KEY (question_id, topic_id)
);

CREATE TABLE question_positions (
  question_id uuid NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  position_id uuid NOT NULL REFERENCES positions(id),
  PRIMARY KEY (question_id, position_id)
);

CREATE TABLE practice_progress (
  student_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  bookmarked boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'NOT_STARTED'
    CHECK (status IN ('NOT_STARTED', 'PRACTICING', 'COMPLETED', 'REVISIT')),
  updated_at timestamptz NOT NULL DEFAULT now(),
  version integer NOT NULL DEFAULT 1,
  PRIMARY KEY (student_id, question_id)
);

CREATE TABLE mentor_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  headline text,
  bio text,
  timezone text NOT NULL DEFAULT 'Asia/Ho_Chi_Minh',
  verification_status text NOT NULL DEFAULT 'DRAFT'
    CHECK (verification_status IN ('DRAFT', 'PENDING', 'APPROVED', 'REJECTED')),
  public_rating numeric(3,2),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  version integer NOT NULL DEFAULT 1
);

CREATE TABLE mentor_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id uuid NOT NULL REFERENCES mentor_profiles(id) ON DELETE CASCADE,
  evidence_ref text NOT NULL,
  evidence_mime_type text NOT NULL,
  evidence_size_bytes bigint NOT NULL,
  consented_at timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'PENDING'
    CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
  decision_reason text,
  decided_by uuid REFERENCES users(id),
  decided_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  version integer NOT NULL DEFAULT 1
);

CREATE TABLE mentor_expertise (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id uuid NOT NULL REFERENCES mentor_profiles(id) ON DELETE CASCADE,
  topic_id uuid REFERENCES topics(id),
  position_id uuid REFERENCES positions(id),
  evidence_note text,
  status text NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
  CHECK ((topic_id IS NOT NULL)::integer + (position_id IS NOT NULL)::integer = 1),
  UNIQUE NULLS NOT DISTINCT (mentor_id, topic_id, position_id)
);

CREATE TABLE availability_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id uuid NOT NULL REFERENCES mentor_profiles(id) ON DELETE CASCADE,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  source_timezone text NOT NULL,
  status text NOT NULL DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'BOOKED', 'BLOCKED', 'CANCELLED')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  version integer NOT NULL DEFAULT 1,
  CHECK (ends_at > starts_at)
);
ALTER TABLE availability_slots ADD CONSTRAINT ex_mentor_slot_overlap
  EXCLUDE USING gist (
    mentor_id WITH =,
    tstzrange(starts_at, ends_at, '[)') WITH &&
  ) WHERE (status IN ('AVAILABLE', 'BOOKED', 'BLOCKED'));

CREATE TABLE job_descriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  source_type text NOT NULL CHECK (source_type IN ('PASTED_TEXT', 'PDF', 'IMAGE')),
  original_file_ref text,
  original_mime_type text,
  original_size_bytes bigint,
  original_content_hash char(64),
  original_delete_after timestamptz,
  status text NOT NULL DEFAULT 'DRAFT'
    CHECK (status IN ('DRAFT', 'EXTRACTING', 'READY_FOR_REVIEW', 'CONFIRMED', 'ANALYZED', 'FAILED', 'ARCHIVED')),
  extracted_text text,
  corrected_text text,
  corrected_version integer NOT NULL DEFAULT 0,
  confirmed_at timestamptz,
  extraction_method text CHECK (extraction_method IS NULL OR extraction_method IN ('PASTED_TEXT', 'DIRECT_PDF', 'OCR')),
  extraction_version text,
  last_active_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  version integer NOT NULL DEFAULT 1
);
CREATE INDEX ix_job_descriptions_owner ON job_descriptions (student_id, updated_at DESC);

CREATE TABLE extraction_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_description_id uuid NOT NULL REFERENCES job_descriptions(id) ON DELETE CASCADE,
  input_hash char(64) NOT NULL,
  extraction_version text NOT NULL,
  status text NOT NULL DEFAULT 'PENDING'
    CHECK (status IN ('PENDING', 'PROCESSING', 'SUCCEEDED', 'FAILED')),
  attempt_count integer NOT NULL DEFAULT 0,
  available_at timestamptz NOT NULL DEFAULT now(),
  started_at timestamptz,
  finished_at timestamptz,
  duration_ms integer,
  error_code text,
  confidence numeric(5,4),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (job_description_id, input_hash, extraction_version)
);

CREATE TABLE jd_text_versions (
  job_description_id uuid NOT NULL REFERENCES job_descriptions(id) ON DELETE CASCADE,
  version integer NOT NULL,
  corrected_text text NOT NULL,
  confirmed_at timestamptz,
  created_by uuid NOT NULL REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (job_description_id, version)
);

CREATE TABLE jd_requirements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_description_id uuid NOT NULL REFERENCES job_descriptions(id) ON DELETE CASCADE,
  analysis_version integer NOT NULL,
  raw_text text NOT NULL,
  source_start integer,
  source_end integer,
  requirement_type text NOT NULL CHECK (requirement_type IN ('ROLE', 'SENIORITY', 'SKILL', 'TECHNOLOGY', 'REQUIREMENT')),
  normalized_topic_id uuid REFERENCES topics(id),
  confidence numeric(5,4),
  rule_evidence jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (job_description_id, analysis_version, id)
);

CREATE TABLE requirement_normalization_overrides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requirement_id uuid NOT NULL REFERENCES jd_requirements(id) ON DELETE CASCADE,
  topic_id uuid REFERENCES topics(id),
  actor_id uuid NOT NULL REFERENCES users(id),
  reason text NOT NULL,
  mapping_input_version integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (requirement_id, mapping_input_version)
);

CREATE TABLE matching_rule_versions (
  version text PRIMARY KEY,
  exact_topic_weight integer NOT NULL,
  keyword_weight integer NOT NULL,
  role_weight integer NOT NULL,
  seniority_weight integer NOT NULL,
  threshold integer NOT NULL,
  max_per_jd integer NOT NULL,
  max_per_requirement integer NOT NULL,
  reason_template text NOT NULL,
  status text NOT NULL CHECK (status IN ('ACTIVE', 'ARCHIVED')),
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (exact_topic_weight + keyword_weight + role_weight + seniority_weight = 100)
);

CREATE TABLE jd_question_matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_description_id uuid NOT NULL REFERENCES job_descriptions(id) ON DELETE CASCADE,
  requirement_id uuid NOT NULL REFERENCES jd_requirements(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES questions(id),
  analysis_version integer NOT NULL,
  matching_version text NOT NULL REFERENCES matching_rule_versions(version),
  score integer NOT NULL CHECK (score BETWEEN 0 AND 100),
  reason text NOT NULL,
  rule_evidence jsonb NOT NULL DEFAULT '{}'::jsonb,
  result_hash char(64) NOT NULL,
  rank integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (job_description_id, requirement_id, question_id, matching_version)
);

CREATE TABLE preparation_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  job_description_id uuid NOT NULL REFERENCES job_descriptions(id) ON DELETE CASCADE,
  matching_version text NOT NULL,
  status text NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'COMPLETED', 'INVALIDATED', 'ARCHIVED')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  version integer NOT NULL DEFAULT 1
);

CREATE TABLE preparation_plan_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id uuid NOT NULL REFERENCES preparation_plans(id) ON DELETE CASCADE,
  match_id uuid REFERENCES jd_question_matches(id),
  requirement_id uuid REFERENCES jd_requirements(id),
  topic_id uuid REFERENCES topics(id),
  question_id uuid REFERENCES questions(id),
  priority text NOT NULL CHECK (priority IN ('MUST', 'SHOULD', 'OPTIONAL')),
  practice_status text NOT NULL DEFAULT 'NOT_STARTED'
    CHECK (practice_status IN ('NOT_STARTED', 'PRACTICING', 'COMPLETED', 'REVISIT')),
  mentor_next_action text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES users(id),
  mentor_id uuid NOT NULL REFERENCES mentor_profiles(id),
  slot_id uuid NOT NULL REFERENCES availability_slots(id),
  job_description_id uuid REFERENCES job_descriptions(id),
  preparation_plan_id uuid REFERENCES preparation_plans(id),
  goal text NOT NULL,
  interview_type text NOT NULL,
  state text NOT NULL DEFAULT 'PENDING'
    CHECK (state IN ('PENDING', 'CONFIRMED', 'RESCHEDULE_PROPOSED', 'REJECTED', 'CANCELLED', 'COMPLETED', 'NO_SHOW')),
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  source_timezone text NOT NULL,
  reschedule_count integer NOT NULL DEFAULT 0 CHECK (reschedule_count BETWEEN 0 AND 2),
  previous_state text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  version integer NOT NULL DEFAULT 1,
  CHECK (job_description_id IS NOT NULL OR preparation_plan_id IS NOT NULL),
  CHECK (ends_at > starts_at)
);
CREATE UNIQUE INDEX ux_booking_occupied_slot ON bookings (slot_id)
  WHERE state IN ('CONFIRMED', 'COMPLETED', 'NO_SHOW');

CREATE TABLE booking_reschedule_proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  proposed_slot_id uuid NOT NULL REFERENCES availability_slots(id),
  proposed_by uuid NOT NULL REFERENCES users(id),
  reason text NOT NULL,
  status text NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED')),
  created_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz,
  resolved_by uuid REFERENCES users(id)
);

CREATE TABLE booking_transitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  from_state text,
  to_state text NOT NULL,
  actor_id uuid NOT NULL REFERENCES users(id),
  action text NOT NULL,
  reason text,
  occurred_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE idempotency_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid NOT NULL REFERENCES users(id),
  operation text NOT NULL,
  idempotency_key text NOT NULL,
  request_hash char(64) NOT NULL,
  response_status integer,
  response_body jsonb,
  resource_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '24 hours'),
  UNIQUE (actor_id, operation, idempotency_key)
);

CREATE TABLE meeting_links (
  booking_id uuid PRIMARY KEY REFERENCES bookings(id) ON DELETE CASCADE,
  encrypted_url text NOT NULL,
  url_fingerprint char(64) NOT NULL,
  created_by uuid NOT NULL REFERENCES users(id),
  updated_by uuid NOT NULL REFERENCES users(id),
  available_from timestamptz NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  version integer NOT NULL DEFAULT 1
);

CREATE TABLE feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
  mentor_id uuid NOT NULL REFERENCES mentor_profiles(id),
  rubric_scores jsonb NOT NULL,
  strengths text NOT NULL,
  weaknesses text NOT NULL,
  next_actions jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  version integer NOT NULL DEFAULT 1
);

CREATE TABLE reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES users(id),
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment text,
  moderation_status text NOT NULL DEFAULT 'PENDING_PUBLICATION'
    CHECK (moderation_status IN ('PENDING_PUBLICATION', 'PUBLISHED', 'HIDDEN', 'DISPUTED')),
  publish_after timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  version integer NOT NULL DEFAULT 1
);

CREATE TABLE reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid NOT NULL REFERENCES users(id),
  target_type text NOT NULL,
  target_id uuid NOT NULL,
  reason_code text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'IN_REVIEW', 'RESOLVED', 'DISMISSED')),
  created_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz
);

CREATE TABLE operation_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_type text NOT NULL CHECK (case_type IN (
    'MENTOR_VERIFICATION', 'QUESTION_MODERATION', 'EXTRACTION_FAILED',
    'NOTIFICATION_DEAD', 'MEETING_LINK_FAILED', 'LATE_CHANGE',
    'NO_SHOW', 'COMPLETION_DISPUTE', 'REVIEW_MODERATION'
  )),
  target_type text NOT NULL,
  target_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'DISMISSED')),
  public_summary text NOT NULL,
  restricted_metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  assigned_to uuid REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  version integer NOT NULL DEFAULT 1
);

CREATE UNIQUE INDEX operation_cases_one_active_target
  ON operation_cases (case_type, target_type, target_id)
  WHERE status IN ('OPEN', 'IN_PROGRESS');

CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid REFERENCES users(id),
  action text NOT NULL,
  target_type text NOT NULL,
  target_id uuid,
  reason text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  correlation_id uuid,
  occurred_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE notification_outbox (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  aggregate_type text NOT NULL,
  aggregate_id uuid NOT NULL,
  recipient_user_id uuid NOT NULL REFERENCES users(id),
  channel text NOT NULL DEFAULT 'EMAIL' CHECK (channel IN ('EMAIL', 'IN_APP')),
  payload_version integer NOT NULL DEFAULT 1,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  deduplication_key text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSING', 'RETRY', 'SENT', 'DEAD')),
  attempt_count integer NOT NULL DEFAULT 0,
  available_at timestamptz NOT NULL DEFAULT now(),
  last_error_class text,
  provider_message_id text,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  sent_at timestamptz
);
CREATE INDEX ix_notification_claim ON notification_outbox (status, available_at);

CREATE TABLE in_app_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  resource_type text,
  resource_id uuid,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE retention_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  target_type text NOT NULL,
  target_id uuid NOT NULL,
  action text NOT NULL CHECK (action IN ('DELETE_FILE', 'DELETE_PRIVATE_DATA', 'ANONYMIZE', 'DELETE_BACKUP_REFERENCE')),
  execute_after timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSING', 'SUCCEEDED', 'FAILED')),
  attempt_count integer NOT NULL DEFAULT 0,
  last_error_class text,
  created_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);

INSERT INTO roles (code, description) VALUES
  ('STUDENT', 'Candidate preparing for interviews'),
  ('MENTOR', 'Mentor or interviewer'),
  ('ADMIN', 'Authorized operations administrator')
ON CONFLICT (code) DO UPDATE SET description = EXCLUDED.description;

COMMIT;
