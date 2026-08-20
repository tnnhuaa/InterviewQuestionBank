BEGIN;

-- Existing requirement/match records cannot be safely attributed to a text or
-- taxonomy snapshot retroactively. They remain historical, but the matching
-- service requires these fields for every new run.
ALTER TABLE jd_requirements
  ADD COLUMN corrected_text_version integer,
  ADD COLUMN taxonomy_version_id uuid REFERENCES taxonomy_versions(id);

ALTER TABLE jd_question_matches
  ADD COLUMN corrected_text_version integer,
  ADD COLUMN taxonomy_version_id uuid REFERENCES taxonomy_versions(id);

CREATE INDEX ix_jd_requirements_current_input
  ON jd_requirements(job_description_id, analysis_version, corrected_text_version, taxonomy_version_id);

CREATE INDEX ix_jd_question_matches_current_input
  ON jd_question_matches(job_description_id, analysis_version, corrected_text_version, taxonomy_version_id, rank);

COMMIT;
