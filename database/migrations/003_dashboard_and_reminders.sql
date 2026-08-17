BEGIN;

ALTER TABLE bookings
  ADD COLUMN schedule_version integer NOT NULL DEFAULT 1 CHECK (schedule_version > 0);

ALTER TABLE extraction_jobs
  ADD COLUMN locked_at timestamptz,
  ADD COLUMN locked_until timestamptz;

ALTER TABLE notification_outbox
  DROP CONSTRAINT notification_outbox_status_check;
ALTER TABLE notification_outbox
  ADD CONSTRAINT notification_outbox_status_check
  CHECK (status IN ('PENDING', 'PROCESSING', 'RETRY', 'SENT', 'DEAD', 'CANCELLED'));
ALTER TABLE notification_outbox
  ADD COLUMN schedule_version integer,
  ADD COLUMN milestone text,
  ADD COLUMN scheduled_for timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN locked_at timestamptz,
  ADD COLUMN locked_until timestamptz,
  ADD COLUMN cancelled_at timestamptz;

ALTER TABLE in_app_notifications
  ADD COLUMN source_outbox_id uuid UNIQUE REFERENCES notification_outbox(id) ON DELETE SET NULL;

DROP INDEX ix_notification_claim;
CREATE INDEX ix_notification_claim
  ON notification_outbox(status, available_at, locked_until)
  WHERE status IN ('PENDING', 'RETRY', 'PROCESSING');
CREATE INDEX ix_notification_booking_schedule
  ON notification_outbox(aggregate_id, schedule_version, milestone, status)
  WHERE aggregate_type = 'BOOKING';
CREATE INDEX ix_extraction_claim
  ON extraction_jobs(status, available_at, locked_until)
  WHERE status IN ('PENDING', 'PROCESSING');

COMMIT;
