BEGIN;

CREATE TABLE ai_feature_controls (
  feature text PRIMARY KEY CHECK (feature IN (
    'jdAnalysis', 'recommendationExplanation', 'agendaDraft', 'feedbackDraft'
  )),
  enabled boolean NOT NULL DEFAULT true,
  updated_by uuid REFERENCES users(id),
  reason text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  version integer NOT NULL DEFAULT 1 CHECK (version > 0)
);

INSERT INTO ai_feature_controls(feature) VALUES
  ('jdAnalysis'),
  ('recommendationExplanation'),
  ('agendaDraft'),
  ('feedbackDraft')
ON CONFLICT (feature) DO NOTHING;

COMMIT;
