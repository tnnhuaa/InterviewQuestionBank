export async function createOperationCase(client, {
  caseType,
  targetType,
  targetId,
  publicSummary,
  restrictedMetadata = {},
}) {
  const result = await client.query(
     `INSERT INTO operation_cases (
       case_type, target_type, target_id, public_summary, restricted_metadata
     ) VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (case_type, target_type, target_id)
       WHERE status IN ('OPEN', 'IN_PROGRESS')
     DO UPDATE SET
       public_summary = EXCLUDED.public_summary,
       restricted_metadata = operation_cases.restricted_metadata || EXCLUDED.restricted_metadata,
       updated_at = now(),
       version = operation_cases.version + 1
     RETURNING id, status, version`,
    [caseType, targetType, targetId, publicSummary, restrictedMetadata],
  );
  return result.rows[0];
}
