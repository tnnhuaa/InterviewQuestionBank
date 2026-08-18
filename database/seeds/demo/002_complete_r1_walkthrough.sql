UPDATE questions
SET normalized_content_hash = encode(
  digest(lower(trim(regexp_replace(content, '\\s+', ' ', 'g'))), 'sha256'),
  'hex'
)
WHERE slug LIKE 'demo-question-%' AND normalized_content_hash IS NULL;

INSERT INTO booking_context_snapshots(
  booking_id, job_description_id, corrected_text_version,
  preparation_plan_id, preparation_plan_version, role_summary, seniority_summary,
  topic_ids, question_ids, goal, interview_type
)
SELECT b.id, '00000000-0000-0000-0000-000000000901', 1,
       b.preparation_plan_id, CASE WHEN b.preparation_plan_id IS NULL THEN NULL ELSE 1 END,
       'Frontend', 'Intern',
       ARRAY['00000000-0000-0000-0000-000000000703'::uuid],
       CASE WHEN b.preparation_plan_id IS NULL THEN '{}'::uuid[] ELSE ARRAY['00000000-0000-0000-0000-000000000804'::uuid] END,
       b.goal, b.interview_type
FROM bookings b
WHERE b.id = ANY(ARRAY[
  '00000000-0000-0000-0000-000000000961'::uuid,
  '00000000-0000-0000-0000-000000000962'::uuid,
  '00000000-0000-0000-0000-000000000963'::uuid,
  '00000000-0000-0000-0000-000000000964'::uuid,
  '00000000-0000-0000-0000-000000000965'::uuid,
  '00000000-0000-0000-0000-000000000966'::uuid,
  '00000000-0000-0000-0000-000000000967'::uuid
])
ON CONFLICT (booking_id) DO NOTHING;

INSERT INTO feedback_actions(id, feedback_id, description, topic_id, question_id) VALUES
  ('00000000-0000-0000-0000-000000000984', '00000000-0000-0000-0000-000000000981', 'Luyện câu Event Loop', '00000000-0000-0000-0000-000000000701', null),
  ('00000000-0000-0000-0000-000000000985', '00000000-0000-0000-0000-000000000981', 'Viết lại câu trả lời theo STAR', null, null)
ON CONFLICT (id) DO NOTHING;

INSERT INTO completion_disputes(
  id, booking_id, student_id, reason, evidence_metadata
) VALUES (
  '00000000-0000-0000-0000-000000000986',
  '00000000-0000-0000-0000-000000000966',
  '00000000-0000-0000-0000-000000000101',
  'Demo completion dispute for operations walkthrough.',
  '{"dataset":"demo-v2"}'
)
ON CONFLICT (booking_id) DO NOTHING;

INSERT INTO reports(id, reporter_id, target_type, target_id, reason_code, description) VALUES (
  '00000000-0000-0000-0000-000000000987',
  '00000000-0000-0000-0000-000000000101',
  'BOOKING', '00000000-0000-0000-0000-000000000966',
  'COMPLETION_DISPUTE', 'Demo dispute report'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO operation_cases(
  id, case_type, target_type, target_id, public_summary, status, restricted_metadata
) VALUES (
  '00000000-0000-0000-0000-000000000953',
  'COMPLETION_DISPUTE', 'BOOKING', '00000000-0000-0000-0000-000000000966',
  'Kết quả hoàn thành demo đang được xem xét.', 'OPEN',
  '{"disputeId":"00000000-0000-0000-0000-000000000986","reportId":"00000000-0000-0000-0000-000000000987"}'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO notification_outbox(
  event_type, aggregate_type, aggregate_id, recipient_user_id, channel,
  payload, deduplication_key, schedule_version, milestone, scheduled_for, available_at
)
SELECT 'BOOKING_REMINDER_' || milestone, 'BOOKING',
       '00000000-0000-0000-0000-000000000962', recipient_id, channel,
       jsonb_build_object(
         'bookingId', '00000000-0000-0000-0000-000000000962',
         'startsAt', b.starts_at,
         'timezone', b.source_timezone,
         'title', CASE milestone WHEN '24H' THEN 'Nhắc lịch phỏng vấn sau 24 giờ' ELSE 'Nhắc lịch phỏng vấn sau 1 giờ' END,
         'body', 'Mở PrepVI để kiểm tra lịch và link phòng họp.'
       ),
       'demo-reminder:' || recipient_id::text || ':' || channel || ':' || milestone,
       b.schedule_version, milestone,
       b.starts_at - CASE milestone WHEN '24H' THEN interval '24 hours' ELSE interval '1 hour' END,
       b.starts_at - CASE milestone WHEN '24H' THEN interval '24 hours' ELSE interval '1 hour' END
FROM bookings b
CROSS JOIN (VALUES
  ('00000000-0000-0000-0000-000000000101'::uuid),
  ('00000000-0000-0000-0000-000000000201'::uuid)
) recipients(recipient_id)
CROSS JOIN (VALUES ('EMAIL'), ('IN_APP')) channels(channel)
CROSS JOIN (VALUES ('24H'), ('1H')) milestones(milestone)
WHERE b.id = '00000000-0000-0000-0000-000000000962'
ON CONFLICT (deduplication_key) DO NOTHING;

INSERT INTO question_import_batches(
  id, actor_id, file_name, file_hash, status, total_rows, valid_rows, invalid_rows
) VALUES (
  '00000000-0000-0000-0000-000000000991',
  '00000000-0000-0000-0000-000000000301',
  'demo-question-import.csv', repeat('a', 64), 'VALIDATED', 2, 1, 1
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO question_import_rows(
  id, batch_id, row_number, normalized_payload, content_hash, status, errors
) VALUES
  ('00000000-0000-0000-0000-000000000992', '00000000-0000-0000-0000-000000000991', 2,
   '{"slug":"demo-import-valid","title":"Demo import valid","content":"A valid preview row that is not committed yet.","answerCriteria":["Demo"],"difficulty":"EASY","topicSlugs":["javascript"],"topicIds":["00000000-0000-0000-0000-000000000701"],"positionSlugs":["frontend-intern"],"positionIds":["00000000-0000-0000-0000-000000000601"],"sourceName":"PrepVI Demo","sourceUrl":null,"provenanceNote":"Demo preview"}', repeat('b', 64), 'VALID', '[]'),
  ('00000000-0000-0000-0000-000000000993', '00000000-0000-0000-0000-000000000991', 3,
   '{"slug":"demo-import-invalid","title":"Demo import invalid","content":"Invalid taxonomy preview row.","answerCriteria":["Demo"],"difficulty":"EASY","topicSlugs":["unknown-topic"],"topicIds":[],"positionSlugs":["frontend-intern"],"positionIds":["00000000-0000-0000-0000-000000000601"],"sourceName":"PrepVI Demo","sourceUrl":null,"provenanceNote":"Demo preview"}', repeat('c', 64), 'INVALID', '[{"field":"topicSlugs","code":"UNKNOWN_TAXONOMY","message":"Topic unknown-topic không tồn tại."}]')
ON CONFLICT (id) DO NOTHING;

INSERT INTO audit_logs(actor_id, action, target_type, target_id, reason, metadata) VALUES (
  '00000000-0000-0000-0000-000000000301',
  'DEMO_R1_COMPLETION_SEEDED', 'DATASET', null,
  'Local walkthrough fixtures for remaining user stories', '{"dataset":"demo-v2"}'
);
