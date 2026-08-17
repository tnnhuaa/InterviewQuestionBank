BEGIN;

CREATE TABLE ai_job_private_inputs (
  job_id uuid PRIMARY KEY REFERENCES ai_jobs(id) ON DELETE CASCADE,
  encrypted_payload text NOT NULL,
  expires_at timestamptz NOT NULL DEFAULT now() + interval '24 hours',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ix_ai_job_private_inputs_expiry ON ai_job_private_inputs(expires_at);

COMMIT;
