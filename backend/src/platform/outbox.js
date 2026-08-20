export async function enqueueNotification(client, {
  eventType,
  aggregateType,
  aggregateId,
  recipientUserId,
  channel = "EMAIL",
  payload = {},
  payloadVersion = 1,
  deduplicationKey,
  availableAt = new Date(),
  scheduledFor = availableAt,
  scheduleVersion = null,
  milestone = null,
}) {
  if (!deduplicationKey) {
    throw new Error("enqueueNotification requires a deduplicationKey");
  }
  const result = await client.query(
    `INSERT INTO notification_outbox (
       event_type, aggregate_type, aggregate_id, recipient_user_id,
       channel, payload, payload_version, deduplication_key, available_at, scheduled_for,
       schedule_version, milestone
     ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
     ON CONFLICT (deduplication_key) DO UPDATE SET deduplication_key = EXCLUDED.deduplication_key
     RETURNING id, status, deduplication_key`,
    [eventType, aggregateType, aggregateId, recipientUserId, channel, payload, payloadVersion,
      deduplicationKey, availableAt, scheduledFor, scheduleVersion, milestone],
  );
  return result.rows[0];
}

export async function createInAppNotification(client, {
  userId,
  eventType,
  title,
  body,
  resourceType = null,
  resourceId = null,
  sourceOutboxId = null,
}) {
  await client.query(
    `INSERT INTO in_app_notifications (
       user_id, event_type, title, body, resource_type, resource_id, source_outbox_id
     ) VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (source_outbox_id) DO NOTHING`,
    [userId, eventType, title, body, resourceType, resourceId, sourceOutboxId],
  );
}
