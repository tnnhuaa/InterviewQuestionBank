export async function enqueueNotification(client, {
  eventType,
  aggregateType,
  aggregateId,
  recipientUserId,
  channel = "EMAIL",
  payload = {},
  deduplicationKey,
}) {
  const result = await client.query(
    `INSERT INTO notification_outbox (
       event_type, aggregate_type, aggregate_id, recipient_user_id,
       channel, payload, deduplication_key
     ) VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (deduplication_key) DO UPDATE SET deduplication_key = EXCLUDED.deduplication_key
     RETURNING id, status`,
    [eventType, aggregateType, aggregateId, recipientUserId, channel, payload, deduplicationKey],
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
}) {
  await client.query(
    `INSERT INTO in_app_notifications (user_id, event_type, title, body, resource_type, resource_id)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [userId, eventType, title, body, resourceType, resourceId],
  );
}
