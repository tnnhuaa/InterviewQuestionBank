import { createHash } from "node:crypto";
import { AppError } from "../shared/errors.js";

export function requestHash(value) {
  return createHash("sha256").update(JSON.stringify(value ?? {})).digest("hex");
}

export async function findIdempotentResult(client, { actorId, operation, key, input }) {
  if (!key) {
    throw new AppError({
      status: 400,
      code: "IDEMPOTENCY_KEY_REQUIRED",
      message: "Thiếu mã chống gửi trùng. Hãy tải lại trang và thử lại.",
      recovery: { kind: "RETRY_SAFE", retryable: true, retryAfterSeconds: null },
    });
  }
  const digest = requestHash(input);
  await client.query(
    "SELECT pg_advisory_xact_lock(hashtextextended($1, 0))",
    [`${actorId}:${operation}:${key}`],
  );
  const result = await client.query(
    `SELECT request_hash, response_status, response_body, resource_id
     FROM idempotency_records
     WHERE actor_id = $1 AND operation = $2 AND idempotency_key = $3`,
    [actorId, operation, key],
  );
  if (!result.rowCount) return { digest, cached: null };
  if (result.rows[0].request_hash !== digest) {
    throw new AppError({
      status: 409,
      code: "IDEMPOTENCY_KEY_REUSED",
      message: "Yêu cầu này đã được dùng cho dữ liệu khác. Hãy tải lại trang trước khi tiếp tục.",
      recovery: { kind: "RETRY_SAFE", retryable: true, retryAfterSeconds: null },
    });
  }
  return { digest, cached: result.rows[0] };
}

export async function saveIdempotentResult(client, {
  actorId,
  operation,
  key,
  digest,
  status,
  body,
  resourceId,
}) {
  await client.query(
    `INSERT INTO idempotency_records (
       actor_id, operation, idempotency_key, request_hash,
       response_status, response_body, resource_id
     ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [actorId, operation, key, digest, status, body, resourceId],
  );
}
