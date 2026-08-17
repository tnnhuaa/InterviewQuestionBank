import { AppError, notFoundError } from "../../shared/errors.js";
import { withTransaction } from "../../platform/db/transaction.js";
import { findIdempotentResult, saveIdempotentResult } from "../../platform/idempotency.js";
import { createOperationCase } from "../../platform/operations.js";
import { hashAiValue } from "./provider.js";

const featureByJobKind = {
  JD_ANALYSIS: "jdAnalysis",
  RECOMMENDATION_EXPLANATION: "recommendationExplanation",
  INTERVIEW_AGENDA: "agendaDraft",
  FEEDBACK_DRAFT: "feedbackDraft",
};

export function aiJobDto(row) {
  return {
    id: row.id,
    kind: row.kind,
    resourceType: row.resource_type,
    resourceId: row.resource_id,
    status: row.status,
    provider: row.provider,
    model: row.model,
    promptVersion: row.prompt_version,
    schemaVersion: row.schema_version,
    attemptCount: row.attempt_count,
    maxAttempts: row.max_attempts,
    fallbackUsed: row.fallback_used,
    result: row.result ?? null,
    errorCode: row.error_code,
    correlationId: row.correlation_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function aiUnavailable(code = "AI_DISABLED") {
  return new AppError({
    status: 503,
    code,
    message: "Trợ lý AI hiện không khả dụng. Luồng thủ công vẫn có thể tiếp tục.",
    recovery: { kind: "RETRY_SAFE", retryable: true, retryAfterSeconds: 60 },
  });
}

async function enforceBudget(client, actorId, environment) {
  const [globalUsage, actorUsage] = await Promise.all([
    client.query("SELECT count(*)::int AS count FROM ai_jobs WHERE created_at >= date_trunc('day', now() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC'"),
    client.query("SELECT count(*)::int AS count FROM ai_jobs WHERE actor_id = $1 AND created_at >= date_trunc('day', now() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC'", [actorId]),
  ]);
  if (globalUsage.rows[0].count >= environment.ai.dailyRequestBudget
      || actorUsage.rows[0].count >= environment.ai.userDailyRequestBudget) {
    throw new AppError({
      status: 429,
      code: "AI_DAILY_BUDGET_REACHED",
      message: "Đã đạt giới hạn AI trong ngày. Bạn vẫn có thể tiếp tục bằng thao tác thủ công.",
      recovery: { kind: "WAIT", retryable: true, retryAfterSeconds: 3600 },
    });
  }
}

export async function createAiJob(client, {
  actorId,
  kind,
  resourceType,
  resourceId,
  input,
  promptVersion,
  schemaVersion,
  correlationId,
  environment,
}) {
  const feature = featureByJobKind[kind];
  if (!environment.ai.enabled || !feature || !environment.ai.features[feature]) throw aiUnavailable();
  await enforceBudget(client, actorId, environment);
  const inputHash = hashAiValue(input);
  const result = await client.query(
    `INSERT INTO ai_jobs (
       kind, resource_type, resource_id, actor_id, input_hash, provider, model,
       prompt_version, schema_version, max_attempts, correlation_id
     ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
     ON CONFLICT (kind, resource_type, resource_id, input_hash, provider, model, prompt_version, schema_version)
     DO UPDATE SET updated_at = ai_jobs.updated_at
     RETURNING *`,
    [kind, resourceType, resourceId, actorId, inputHash, environment.ai.provider,
      environment.ai.model, promptVersion, schemaVersion, environment.ai.maxAttempts, correlationId],
  );
  return aiJobDto(result.rows[0]);
}

export function createAiJobsService({ pool, environment, provider }) {
  async function get(actor, id) {
    const result = await pool.query(
      `SELECT * FROM ai_jobs WHERE id = $1 AND (actor_id = $2 OR $3::boolean)`,
      [id, actor.id, actor.roles.includes("ADMIN")],
    );
    if (!result.rowCount) throw notFoundError();
    return aiJobDto(result.rows[0]);
  }

  async function retry(actor, id, key) {
    return withTransaction(pool, async (client) => {
      const selected = await client.query(
        `SELECT * FROM ai_jobs WHERE id = $1 AND (actor_id = $2 OR $3::boolean) FOR UPDATE`,
        [id, actor.id, actor.roles.includes("ADMIN")],
      );
      if (!selected.rowCount) throw notFoundError();
      const job = selected.rows[0];
      const idempotency = await findIdempotentResult(client, {
        actorId: actor.id,
        operation: "AI_JOB_RETRY",
        key,
        input: { id, attemptCount: job.attempt_count },
      });
      if (idempotency.cached?.response_body) return idempotency.cached.response_body;
      if (!environment.ai.enabled || !provider.available()) throw aiUnavailable("AI_PROVIDER_UNAVAILABLE");
      if (job.status !== "FAILED" || job.attempt_count >= job.max_attempts) {
        throw new AppError({
          status: 409,
          code: "AI_JOB_NOT_RETRYABLE",
          message: "Tác vụ AI này không thể thử lại tự động. Hãy dùng luồng thủ công hoặc liên hệ hỗ trợ.",
          recovery: { kind: "CONTACT_SUPPORT", retryable: false, retryAfterSeconds: null },
        });
      }
      const updated = await client.query(
        `UPDATE ai_jobs SET status = 'PENDING', error_code = NULL, available_at = now(),
           locked_at = NULL, locked_until = NULL, updated_at = now()
         WHERE id = $1 RETURNING *`,
        [id],
      );
      const body = aiJobDto(updated.rows[0]);
      await saveIdempotentResult(client, {
        actorId: actor.id,
        operation: "AI_JOB_RETRY",
        key,
        digest: idempotency.digest,
        status: 202,
        body,
        resourceId: id,
      });
      return body;
    });
  }

  return { capabilities: () => provider.capabilities(), get, retry };
}

export async function claimAiJob(pool) {
  return withTransaction(pool, async (client) => {
    const result = await client.query(
      `SELECT * FROM ai_jobs
       WHERE ((status = 'PENDING' AND available_at <= now())
          OR (status = 'PROCESSING' AND locked_until <= now()))
       ORDER BY available_at, created_at
       FOR UPDATE SKIP LOCKED LIMIT 1`,
    );
    if (!result.rowCount) return null;
    const job = result.rows[0];
    await client.query(
      `UPDATE ai_jobs SET status = 'PROCESSING', attempt_count = attempt_count + 1,
         started_at = coalesce(started_at, now()), locked_at = now(),
         locked_until = now() + interval '2 minutes', updated_at = now()
       WHERE id = $1`,
      [job.id],
    );
    return { ...job, attempt_count: job.attempt_count + 1 };
  });
}

export async function processAiJob({ pool, provider, handlers, job }) {
  const startedAt = performance.now();
  const run = await pool.query(
    `INSERT INTO ai_runs (
       job_id, attempt, provider, model, prompt_version, schema_version,
       input_hash, status, correlation_id
     ) VALUES ($1,$2,$3,$4,$5,$6,$7,'PROCESSING',$8) RETURNING id`,
    [job.id, job.attempt_count, job.provider, job.model, job.prompt_version,
      job.schema_version, job.input_hash, job.correlation_id],
  );
  try {
    const handler = handlers[job.kind];
    if (!handler) throw Object.assign(new Error("AI_JOB_HANDLER_MISSING"), { code: "AI_JOB_HANDLER_MISSING" });
    const outcome = await handler({ job, provider });
    const metadata = outcome.metadata ?? {};
    const status = outcome.fallbackUsed ? "SUCCEEDED_WITH_FALLBACK" : "SUCCEEDED";
    await withTransaction(pool, async (client) => {
      await client.query(
        `UPDATE ai_runs SET status = 'SUCCEEDED', output_hash = $2, latency_ms = $3,
           input_tokens = $4, output_tokens = $5, total_tokens = $6, finished_at = now()
         WHERE id = $1`,
        [run.rows[0].id, metadata.outputHash ?? hashAiValue(outcome.result),
          metadata.latencyMs ?? Math.round(performance.now() - startedAt), metadata.inputTokens,
          metadata.outputTokens, metadata.totalTokens],
      );
      await client.query(
        `UPDATE ai_jobs SET status = $2, result = $3, fallback_used = $4,
           duration_ms = $5, finished_at = now(), error_code = $6,
           locked_at = NULL, locked_until = NULL, updated_at = now()
         WHERE id = $1`,
        [job.id, status, outcome.result, Boolean(outcome.fallbackUsed),
          Math.round(performance.now() - startedAt), outcome.errorCode ?? null],
      );
    });
  } catch (error) {
    const errorCode = error?.code ?? "AI_PROVIDER_FAILURE";
    const retryable = error?.retryable !== false && job.attempt_count < job.max_attempts;
    await withTransaction(pool, async (client) => {
      await client.query(
        `UPDATE ai_runs SET status = 'FAILED', error_code = $2, latency_ms = $3, finished_at = now()
         WHERE id = $1`,
        [run.rows[0].id, errorCode, Math.round(performance.now() - startedAt)],
      );
      await client.query(
        `UPDATE ai_jobs SET status = $2, error_code = $3,
           available_at = CASE WHEN $2 = 'PENDING' THEN now() + interval '1 minute' ELSE available_at END,
           finished_at = CASE WHEN $2 = 'FAILED' THEN now() ELSE NULL END,
           duration_ms = $4, locked_at = NULL, locked_until = NULL, updated_at = now()
         WHERE id = $1`,
        [job.id, retryable ? "PENDING" : "FAILED", errorCode, Math.round(performance.now() - startedAt)],
      );
      if (!retryable) {
        await createOperationCase(client, {
          caseType: "AI_JOB_FAILED",
          targetType: "AI_JOB",
          targetId: job.id,
          publicSummary: "Tác vụ AI đã hết lượt thử; người dùng vẫn có thể tiếp tục bằng luồng thủ công.",
          restrictedMetadata: { kind: job.kind, errorCode, resourceType: job.resource_type, resourceId: job.resource_id },
        });
      }
    });
    console.error(JSON.stringify({ event: "ai.job_failed", jobId: job.id, kind: job.kind, errorCode, finalAttempt: !retryable }));
  }
}
