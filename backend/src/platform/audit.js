export async function writeAudit(client, {
  actorId = null,
  action,
  targetType,
  targetId = null,
  reason = null,
  metadata = {},
  correlationId = null,
}) {
  await client.query(
    `INSERT INTO audit_logs (actor_id, action, target_type, target_id, reason, metadata, correlation_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [actorId, action, targetType, targetId, reason, metadata, correlationId],
  );
}
