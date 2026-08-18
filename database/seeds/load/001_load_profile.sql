INSERT INTO questions (
  id, slug, title, content, answer_criteria, difficulty, lifecycle_status,
  source_name, provenance_note, published_at
)
SELECT
  gen_random_uuid(),
  'load-question-' || n,
  'Synthetic load question ' || n,
  'Synthetic non-production content for query and pagination preparation.',
  '["Synthetic criterion"]'::jsonb,
  CASE n % 3 WHEN 0 THEN 'EASY' WHEN 1 THEN 'MEDIUM' ELSE 'HARD' END,
  'PUBLISHED', 'PrepVI Load Seed', 'Synthetic staging-only dataset', now()
FROM generate_series(1, 1000) AS n
ON CONFLICT (slug) DO NOTHING;

INSERT INTO question_topics (question_id, topic_id)
SELECT q.id, '00000000-0000-0000-0000-000000000701'::uuid
FROM questions q
WHERE q.slug LIKE 'load-question-%'
ON CONFLICT DO NOTHING;

INSERT INTO question_positions (question_id, position_id)
SELECT q.id, '00000000-0000-0000-0000-000000000601'::uuid
FROM questions q WHERE q.slug LIKE 'load-question-%'
ON CONFLICT DO NOTHING;

-- Dataset namespace: load-* emails/slugs and UUID prefixes 1/2/3/4/5 make targeted cleanup possible.
INSERT INTO users (id, email, password_hash, display_name, status, email_verified_at)
SELECT ('10000000-0000-0000-0000-' || lpad(n::text, 12, '0'))::uuid,
       'load-student-' || n || '@prepvi.invalid', '!load-seed-no-login!', 'Load Student ' || n, 'ACTIVE', now()
FROM generate_series(1, 100) n
ON CONFLICT (id) DO NOTHING;
INSERT INTO user_roles (user_id, role_code)
SELECT ('10000000-0000-0000-0000-' || lpad(n::text, 12, '0'))::uuid, 'STUDENT'
FROM generate_series(1, 100) n ON CONFLICT DO NOTHING;
INSERT INTO student_profiles (user_id, target_position, interview_type, interview_goal)
SELECT ('10000000-0000-0000-0000-' || lpad(n::text, 12, '0'))::uuid,
       'Frontend Intern', 'Technical Interview', 'Synthetic load dataset'
FROM generate_series(1, 100) n ON CONFLICT (user_id) DO NOTHING;

INSERT INTO users (id, email, password_hash, display_name, status, email_verified_at)
SELECT ('20000000-0000-0000-0000-' || lpad(n::text, 12, '0'))::uuid,
       'load-mentor-' || n || '@prepvi.invalid', '!load-seed-no-login!', 'Load Mentor ' || n, 'ACTIVE', now()
FROM generate_series(1, 100) n
ON CONFLICT (id) DO NOTHING;
INSERT INTO user_roles (user_id, role_code)
SELECT ('20000000-0000-0000-0000-' || lpad(n::text, 12, '0'))::uuid, 'MENTOR'
FROM generate_series(1, 100) n ON CONFLICT DO NOTHING;

INSERT INTO mentor_profiles (id, user_id, headline, bio, timezone, verification_status, public_rating)
SELECT ('30000000-0000-0000-0000-' || lpad(n::text, 12, '0'))::uuid,
       ('20000000-0000-0000-0000-' || lpad(n::text, 12, '0'))::uuid,
       'Synthetic Frontend Mentor ' || n,
       'Staging-only mentor profile generated for pagination and booking performance preparation.',
       CASE n % 3 WHEN 0 THEN 'Asia/Singapore' WHEN 1 THEN 'Asia/Ho_Chi_Minh' ELSE 'UTC' END,
       'APPROVED', 4.50
FROM generate_series(1, 100) n
ON CONFLICT (id) DO NOTHING;

INSERT INTO mentor_expertise (mentor_id, topic_id, status)
SELECT ('30000000-0000-0000-0000-' || lpad(n::text, 12, '0'))::uuid,
       '00000000-0000-0000-0000-000000000701'::uuid, 'APPROVED'
FROM generate_series(1, 100) n ON CONFLICT DO NOTHING;

INSERT INTO job_descriptions (id, student_id, source_type, status, extracted_text, corrected_text, corrected_version, confirmed_at, extraction_method, extraction_version)
SELECT ('40000000-0000-0000-0000-' || lpad(n::text, 12, '0'))::uuid,
       ('10000000-0000-0000-0000-' || lpad(n::text, 12, '0'))::uuid,
       'PASTED_TEXT', 'CONFIRMED', 'Synthetic Frontend Intern JavaScript React JD',
       'Synthetic Frontend Intern JavaScript React JD', 1, now(), 'PASTED_TEXT', 'extract-v1'
FROM generate_series(1, 100) n ON CONFLICT (id) DO NOTHING;

INSERT INTO availability_slots (id, mentor_id, starts_at, ends_at, source_timezone, status)
SELECT ('50000000-0000-0000-' || lpad(mentor_n::text, 4, '0') || '-' || lpad(slot_n::text, 12, '0'))::uuid,
       ('30000000-0000-0000-0000-' || lpad(mentor_n::text, 12, '0'))::uuid,
       date_trunc('day', now()) + (slot_n || ' days')::interval + interval '09 hours',
       date_trunc('day', now()) + (slot_n || ' days')::interval + interval '10 hours',
       'Asia/Ho_Chi_Minh', CASE WHEN slot_n <= 5 THEN 'BOOKED' ELSE 'AVAILABLE' END
FROM generate_series(1, 100) mentor_n CROSS JOIN generate_series(1, 10) slot_n
ON CONFLICT (id) DO NOTHING;

INSERT INTO bookings (id, student_id, mentor_id, slot_id, job_description_id, goal, interview_type, state, starts_at, ends_at, source_timezone)
SELECT ('60000000-0000-0000-' || lpad(mentor_n::text, 4, '0') || '-' || lpad(slot_n::text, 12, '0'))::uuid,
       ('10000000-0000-0000-0000-' || lpad((((mentor_n - 1) % 100) + 1)::text, 12, '0'))::uuid,
       ('30000000-0000-0000-0000-' || lpad(mentor_n::text, 12, '0'))::uuid,
       ('50000000-0000-0000-' || lpad(mentor_n::text, 4, '0') || '-' || lpad(slot_n::text, 12, '0'))::uuid,
       ('40000000-0000-0000-0000-' || lpad((((mentor_n - 1) % 100) + 1)::text, 12, '0'))::uuid,
       'Synthetic load booking', 'Technical Interview', 'CONFIRMED',
       date_trunc('day', now()) + (slot_n || ' days')::interval + interval '09 hours',
       date_trunc('day', now()) + (slot_n || ' days')::interval + interval '10 hours', 'Asia/Ho_Chi_Minh'
FROM generate_series(1, 100) mentor_n CROSS JOIN generate_series(1, 5) slot_n
ON CONFLICT (id) DO NOTHING;
