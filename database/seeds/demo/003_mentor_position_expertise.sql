-- Forward-only demo seed: position expertise supports deterministic plan-based Mentor ranking.
INSERT INTO mentor_expertise (id, mentor_id, position_id, status) VALUES
  ('00000000-0000-0000-0000-000000000413', '00000000-0000-0000-0000-000000000401', '00000000-0000-0000-0000-000000000601', 'APPROVED'),
  ('00000000-0000-0000-0000-000000000414', '00000000-0000-0000-0000-000000000401', '00000000-0000-0000-0000-000000000602', 'APPROVED')
ON CONFLICT (mentor_id, topic_id, position_id) DO UPDATE SET status = EXCLUDED.status;
