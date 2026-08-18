INSERT INTO mentor_profiles (id, user_id, headline, bio, timezone, verification_status, public_rating) VALUES
  ('00000000-0000-0000-0000-000000000401', '00000000-0000-0000-0000-000000000201', 'Senior Frontend Engineer', 'Mentor chuyên React, TypeScript và phỏng vấn frontend.', 'Asia/Ho_Chi_Minh', 'APPROVED', 4.90),
  ('00000000-0000-0000-0000-000000000402', '00000000-0000-0000-0000-000000000202', 'Frontend Team Lead', 'Mentor đang chờ xác minh.', 'Asia/Singapore', 'PENDING', null)
  ,('00000000-0000-0000-0000-000000000403', '00000000-0000-0000-0000-000000000203', 'Frontend Consultant', 'Hồ sơ demo đã bị từ chối với lý do rõ ràng.', 'Asia/Ho_Chi_Minh', 'REJECTED', null)
ON CONFLICT (user_id) DO UPDATE SET
  headline = EXCLUDED.headline,
  bio = EXCLUDED.bio,
  timezone = EXCLUDED.timezone,
  verification_status = EXCLUDED.verification_status,
  public_rating = EXCLUDED.public_rating;

INSERT INTO mentor_expertise (id, mentor_id, topic_id, status) VALUES
  ('00000000-0000-0000-0000-000000000411', '00000000-0000-0000-0000-000000000401', '00000000-0000-0000-0000-000000000701', 'APPROVED'),
  ('00000000-0000-0000-0000-000000000412', '00000000-0000-0000-0000-000000000401', '00000000-0000-0000-0000-000000000703', 'APPROVED')
ON CONFLICT (mentor_id, topic_id, position_id) DO UPDATE SET status = EXCLUDED.status;

INSERT INTO mentor_verifications (id, mentor_id, evidence_ref, evidence_mime_type, evidence_size_bytes, consented_at, status) VALUES
  ('00000000-0000-0000-0000-000000000498', '00000000-0000-0000-0000-000000000402', '00000000-0000-0000-0000-000000000499', 'image/png', 68, now(), 'PENDING')
ON CONFLICT (id) DO NOTHING;

INSERT INTO availability_slots (id, mentor_id, starts_at, ends_at, source_timezone, status) VALUES
  ('00000000-0000-0000-0000-000000000421', '00000000-0000-0000-0000-000000000401', date_trunc('day', now()) + interval '2 days 09 hours', date_trunc('day', now()) + interval '2 days 10 hours', 'Asia/Ho_Chi_Minh', 'AVAILABLE'),
  ('00000000-0000-0000-0000-000000000422', '00000000-0000-0000-0000-000000000401', date_trunc('day', now()) + interval '3 days 14 hours', date_trunc('day', now()) + interval '3 days 15 hours', 'Asia/Ho_Chi_Minh', 'AVAILABLE'),
  ('00000000-0000-0000-0000-000000000423', '00000000-0000-0000-0000-000000000401', date_trunc('day', now()) + interval '4 days 09 hours', date_trunc('day', now()) + interval '4 days 10 hours', 'Asia/Ho_Chi_Minh', 'BOOKED'),
  ('00000000-0000-0000-0000-000000000424', '00000000-0000-0000-0000-000000000401', date_trunc('day', now()) + interval '5 days 09 hours', date_trunc('day', now()) + interval '5 days 10 hours', 'Asia/Ho_Chi_Minh', 'AVAILABLE'),
  ('00000000-0000-0000-0000-000000000425', '00000000-0000-0000-0000-000000000401', date_trunc('day', now()) - interval '3 days' + interval '09 hours', date_trunc('day', now()) - interval '3 days' + interval '10 hours', 'Asia/Ho_Chi_Minh', 'BOOKED'),
  ('00000000-0000-0000-0000-000000000426', '00000000-0000-0000-0000-000000000401', date_trunc('day', now()) - interval '5 days' + interval '09 hours', date_trunc('day', now()) - interval '5 days' + interval '10 hours', 'Asia/Ho_Chi_Minh', 'BOOKED'),
  ('00000000-0000-0000-0000-000000000427', '00000000-0000-0000-0000-000000000401', date_trunc('day', now()) - interval '7 days' + interval '09 hours', date_trunc('day', now()) - interval '7 days' + interval '10 hours', 'Asia/Ho_Chi_Minh', 'AVAILABLE')
ON CONFLICT (id) DO NOTHING;

INSERT INTO job_descriptions (
  id, student_id, source_type, status, extracted_text, corrected_text,
  corrected_version, confirmed_at, extraction_method, extraction_version
) VALUES (
  '00000000-0000-0000-0000-000000000901',
  '00000000-0000-0000-0000-000000000101',
  'PASTED_TEXT', 'CONFIRMED',
  'Frontend Intern with JavaScript, ReactJS, TypeScript and basic HTTP knowledge.',
  'Frontend Intern with JavaScript, ReactJS, TypeScript and basic HTTP knowledge.',
  1, now(), 'PASTED_TEXT', 'extract-v1'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO jd_text_versions (job_description_id, version, corrected_text, confirmed_at, created_by) VALUES
  ('00000000-0000-0000-0000-000000000901', 1, 'Frontend Intern with JavaScript, ReactJS, TypeScript and basic HTTP knowledge.', now(), '00000000-0000-0000-0000-000000000101')
ON CONFLICT DO NOTHING;

INSERT INTO questions (id, slug, title, content, answer_criteria, difficulty, lifecycle_status, source_name, provenance_note) VALUES
  ('00000000-0000-0000-0000-000000000821', 'demo-question-draft', 'Demo draft question', 'Nội dung demo cho lifecycle draft.', '["Demo"]', 'EASY', 'DRAFT', 'PrepVI Demo', 'Non-production lifecycle fixture'),
  ('00000000-0000-0000-0000-000000000822', 'demo-question-review', 'Demo review question', 'Nội dung demo đang chờ moderation.', '["Demo"]', 'MEDIUM', 'IN_REVIEW', 'PrepVI Demo', 'Non-production lifecycle fixture'),
  ('00000000-0000-0000-0000-000000000823', 'demo-question-archived', 'Demo archived question', 'Nội dung demo đã archive.', '["Demo"]', 'HARD', 'ARCHIVED', 'PrepVI Demo', 'Non-production lifecycle fixture')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO job_descriptions (id, student_id, source_type, status, corrected_version, extraction_method, extraction_version) VALUES
  ('00000000-0000-0000-0000-000000000902', '00000000-0000-0000-0000-000000000101', 'PDF', 'FAILED', 0, null, null),
  ('00000000-0000-0000-0000-000000000903', '00000000-0000-0000-0000-000000000101', 'IMAGE', 'READY_FOR_REVIEW', 1, 'OCR', 'extract-v1')
ON CONFLICT (id) DO NOTHING;

UPDATE job_descriptions SET extracted_text = 'React developer with unmapped internal skill.', corrected_text = 'React developer with unmapped internal skill.' WHERE id = '00000000-0000-0000-0000-000000000903';
INSERT INTO jd_text_versions (job_description_id, version, corrected_text, created_by) VALUES
  ('00000000-0000-0000-0000-000000000903', 1, 'React developer with unmapped internal skill.', '00000000-0000-0000-0000-000000000101')
ON CONFLICT DO NOTHING;

INSERT INTO jd_requirements (id, job_description_id, analysis_version, raw_text, requirement_type, normalized_topic_id, confidence, rule_evidence) VALUES
  ('00000000-0000-0000-0000-000000000911', '00000000-0000-0000-0000-000000000901', 1, 'ReactJS', 'SKILL', '00000000-0000-0000-0000-000000000703', .95, '{"rule":"taxonomy_alias"}'),
  ('00000000-0000-0000-0000-000000000912', '00000000-0000-0000-0000-000000000901', 1, 'Internal design workflow', 'REQUIREMENT', null, .40, '{"rule":"unmapped_demo"}')
ON CONFLICT (id) DO NOTHING;

INSERT INTO preparation_plans (id, student_id, job_description_id, matching_version) VALUES
  ('00000000-0000-0000-0000-000000000931', '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000901', 'rules-frontend-v1')
ON CONFLICT (id) DO NOTHING;
INSERT INTO preparation_plan_items (id, plan_id, requirement_id, topic_id, question_id, priority) VALUES
  ('00000000-0000-0000-0000-000000000932', '00000000-0000-0000-0000-000000000931', '00000000-0000-0000-0000-000000000911', '00000000-0000-0000-0000-000000000703', '00000000-0000-0000-0000-000000000804', 'MUST')
ON CONFLICT (id) DO NOTHING;

INSERT INTO bookings (id, student_id, mentor_id, slot_id, job_description_id, preparation_plan_id, goal, interview_type, state, starts_at, ends_at, source_timezone, previous_state) VALUES
  ('00000000-0000-0000-0000-000000000961', '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000401', '00000000-0000-0000-0000-000000000421', '00000000-0000-0000-0000-000000000901', null, 'Demo pending booking', 'Technical Interview', 'PENDING', date_trunc('day', now()) + interval '2 days 09 hours', date_trunc('day', now()) + interval '2 days 10 hours', 'Asia/Ho_Chi_Minh', null),
  ('00000000-0000-0000-0000-000000000962', '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000401', '00000000-0000-0000-0000-000000000423', null, '00000000-0000-0000-0000-000000000931', 'Demo confirmed booking', 'Technical Interview', 'CONFIRMED', date_trunc('day', now()) + interval '4 days 09 hours', date_trunc('day', now()) + interval '4 days 10 hours', 'Asia/Ho_Chi_Minh', null),
  ('00000000-0000-0000-0000-000000000963', '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000401', '00000000-0000-0000-0000-000000000424', '00000000-0000-0000-0000-000000000901', null, 'Demo reschedule booking', 'Behavioral', 'RESCHEDULE_PROPOSED', date_trunc('day', now()) + interval '5 days 09 hours', date_trunc('day', now()) + interval '5 days 10 hours', 'Asia/Ho_Chi_Minh', 'PENDING'),
  ('00000000-0000-0000-0000-000000000964', '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000401', '00000000-0000-0000-0000-000000000422', '00000000-0000-0000-0000-000000000901', null, 'Demo rejected booking', 'Technical Interview', 'REJECTED', date_trunc('day', now()) + interval '3 days 14 hours', date_trunc('day', now()) + interval '3 days 15 hours', 'Asia/Ho_Chi_Minh', null),
  ('00000000-0000-0000-0000-000000000965', '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000401', '00000000-0000-0000-0000-000000000427', '00000000-0000-0000-0000-000000000901', null, 'Demo cancelled booking', 'Technical Interview', 'CANCELLED', date_trunc('day', now()) - interval '7 days' + interval '09 hours', date_trunc('day', now()) - interval '7 days' + interval '10 hours', 'Asia/Ho_Chi_Minh', null),
  ('00000000-0000-0000-0000-000000000966', '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000401', '00000000-0000-0000-0000-000000000425', null, '00000000-0000-0000-0000-000000000931', 'Demo completed booking', 'Technical Interview', 'COMPLETED', date_trunc('day', now()) - interval '3 days' + interval '09 hours', date_trunc('day', now()) - interval '3 days' + interval '10 hours', 'Asia/Ho_Chi_Minh', null),
  ('00000000-0000-0000-0000-000000000967', '00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000401', '00000000-0000-0000-0000-000000000426', '00000000-0000-0000-0000-000000000901', null, 'Demo no-show booking', 'Technical Interview', 'NO_SHOW', date_trunc('day', now()) - interval '5 days' + interval '09 hours', date_trunc('day', now()) - interval '5 days' + interval '10 hours', 'Asia/Ho_Chi_Minh', null)
ON CONFLICT (id) DO NOTHING;

INSERT INTO booking_reschedule_proposals (id, booking_id, proposed_slot_id, proposed_by, reason) VALUES
  ('00000000-0000-0000-0000-000000000968', '00000000-0000-0000-0000-000000000963', '00000000-0000-0000-0000-000000000422', '00000000-0000-0000-0000-000000000201', 'Demo timezone conflict')
ON CONFLICT (id) DO NOTHING;
INSERT INTO feedback (id, booking_id, mentor_id, rubric_scores, strengths, weaknesses, next_actions) VALUES
  ('00000000-0000-0000-0000-000000000981', '00000000-0000-0000-0000-000000000966', '00000000-0000-0000-0000-000000000401', '{"technical":4,"structure":3,"communication":4}', 'Giải thích kiến thức rõ.', 'Cần cấu trúc câu trả lời tốt hơn.', '["Luyện câu Event Loop", "Viết lại câu trả lời theo STAR"]')
ON CONFLICT (booking_id) DO NOTHING;
INSERT INTO reviews (id, booking_id, student_id, rating, comment, moderation_status, publish_after) VALUES
  ('00000000-0000-0000-0000-000000000982', '00000000-0000-0000-0000-000000000966', '00000000-0000-0000-0000-000000000101', 5, 'Buổi demo hữu ích.', 'DISPUTED', now() + interval '24 hours')
ON CONFLICT (booking_id) DO NOTHING;
INSERT INTO notification_outbox (id, event_type, aggregate_type, aggregate_id, recipient_user_id, deduplication_key, status, attempt_count, last_error_class) VALUES
  ('00000000-0000-0000-0000-000000000983', 'BOOKING_CONFIRMED', 'BOOKING', '00000000-0000-0000-0000-000000000962', '00000000-0000-0000-0000-000000000101', 'demo-dead-notification-v1', 'DEAD', 3, 'DemoProviderFailure')
ON CONFLICT (id) DO NOTHING;

INSERT INTO operation_cases (id, case_type, target_type, target_id, public_summary, status) VALUES
  ('00000000-0000-0000-0000-000000000951', 'NOTIFICATION_DEAD', 'NOTIFICATION_OUTBOX', '00000000-0000-0000-0000-000000000983', 'Thông báo đặt lịch cần được gửi lại.', 'OPEN'),
  ('00000000-0000-0000-0000-000000000952', 'MENTOR_VERIFICATION', 'MENTOR', '00000000-0000-0000-0000-000000000402', 'Hồ sơ mentor đang chờ xét duyệt.', 'OPEN')
ON CONFLICT (id) DO NOTHING;

UPDATE operation_cases SET restricted_metadata = '{"aggregateType":"BOOKING","aggregateId":"00000000-0000-0000-0000-000000000962","dataset":"demo-v1"}' WHERE id = '00000000-0000-0000-0000-000000000951';

INSERT INTO audit_logs (id, actor_id, action, target_type, target_id, reason, metadata) VALUES
  ('00000000-0000-0000-0000-000000000971', '00000000-0000-0000-0000-000000000301', 'DEMO_SEED_CREATED', 'DATASET', null, 'Local/staging walkthrough data', '{"dataset":"demo-v1"}')
ON CONFLICT (id) DO NOTHING;
