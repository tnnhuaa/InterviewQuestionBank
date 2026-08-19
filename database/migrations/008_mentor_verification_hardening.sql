-- Ensure a Mentor can have at most one active verification request.
CREATE UNIQUE INDEX IF NOT EXISTS ux_mentor_verifications_one_pending_per_mentor
  ON mentor_verifications (mentor_id)
  WHERE status = 'PENDING';

-- Supports owner status/history lookup.
CREATE INDEX IF NOT EXISTS ix_mentor_verifications_mentor_created_at
  ON mentor_verifications (mentor_id, created_at DESC);
