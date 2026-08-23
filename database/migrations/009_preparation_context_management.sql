BEGIN;

ALTER TABLE job_descriptions
  ADD COLUMN title text NOT NULL DEFAULT 'JD chưa đặt tên',
  ADD CONSTRAINT ck_job_descriptions_title
    CHECK (char_length(btrim(title)) BETWEEN 1 AND 120);

ALTER TABLE preparation_plans
  ADD COLUMN title text NOT NULL DEFAULT 'Kế hoạch chưa đặt tên',
  ADD CONSTRAINT ck_preparation_plans_title
    CHECK (char_length(btrim(title)) BETWEEN 1 AND 120);

UPDATE job_descriptions
SET title = CASE source_type
  WHEN 'PDF' THEN 'JD từ tệp PDF'
  WHEN 'IMAGE' THEN 'JD từ hình ảnh'
  ELSE 'JD dạng văn bản'
END || ' · ' || to_char(created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD');

UPDATE preparation_plans p
SET title = 'Kế hoạch luyện tập · ' || to_char(p.created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD');

COMMIT;
