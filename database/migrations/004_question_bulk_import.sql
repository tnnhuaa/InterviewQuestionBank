BEGIN;

ALTER TABLE questions
  ADD COLUMN normalized_content_hash char(64);

UPDATE questions
SET normalized_content_hash = encode(
  digest(lower(trim(regexp_replace(content, '\\s+', ' ', 'g'))), 'sha256'),
  'hex'
)
WHERE normalized_content_hash IS NULL
  AND slug NOT LIKE 'load-question-%';

CREATE UNIQUE INDEX ux_questions_normalized_content_hash
  ON questions(normalized_content_hash)
  WHERE normalized_content_hash IS NOT NULL;

CREATE TABLE question_import_batches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid NOT NULL REFERENCES users(id),
  file_name text NOT NULL,
  file_hash char(64) NOT NULL,
  status text NOT NULL DEFAULT 'VALIDATED'
    CHECK (status IN ('VALIDATED', 'PARTIALLY_IMPORTED', 'IMPORTED', 'FAILED')),
  total_rows integer NOT NULL DEFAULT 0,
  valid_rows integer NOT NULL DEFAULT 0,
  invalid_rows integer NOT NULL DEFAULT 0,
  imported_rows integer NOT NULL DEFAULT 0,
  raw_deleted_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  committed_at timestamptz,
  version integer NOT NULL DEFAULT 1 CHECK (version > 0),
  UNIQUE (actor_id, file_hash)
);

CREATE TABLE question_import_rows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id uuid NOT NULL REFERENCES question_import_batches(id) ON DELETE CASCADE,
  row_number integer NOT NULL CHECK (row_number > 1),
  normalized_payload jsonb NOT NULL,
  content_hash char(64),
  status text NOT NULL CHECK (status IN ('VALID', 'INVALID', 'IMPORTED', 'SKIPPED')),
  errors jsonb NOT NULL DEFAULT '[]'::jsonb,
  question_id uuid REFERENCES questions(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  imported_at timestamptz,
  UNIQUE (batch_id, row_number)
);

CREATE INDEX ix_question_import_rows_status
  ON question_import_rows(batch_id, status, row_number);

COMMIT;
