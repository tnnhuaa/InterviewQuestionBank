import { pathToFileURL } from "node:url";
import nodemailer from "nodemailer";
import { getEnvironment } from "../config/environment.js";
import { pool } from "../platform/db/pool.js";
import { withTransaction } from "../platform/db/transaction.js";
import { createOperationCase } from "../platform/operations.js";
import { createInAppNotification } from "../platform/outbox.js";
import { createPrivateStorage } from "../platform/storage/private-storage.js";
import { createOneTimeToken } from "../platform/security/tokens.js";
import { extractDocument } from "../modules/jd/extractor.js";
import { claimAiJob, createAiJobHandlers, createAiProvider, processAiJob } from "../modules/ai/index.js";

const pollIntervalMs = 2000;
const retentionIntervalMs = 60_000;

function extractionErrorCode(error) {
  const knownCodes = new Set(["EMPTY_EXTRACTION", "OCR_TIMEOUT", "PDF_PAGE_LIMIT"]);
  return knownCodes.has(error?.message) ? error.message : "EXTRACTION_PROVIDER_FAILURE";
}

function classifyNotificationError(error) {
  const name = error?.name ?? "UnknownError";
  const code = error?.code ?? "";
  const responseCode = error?.responseCode ?? 0;

  if (name === "AuthError" || name === "AuthenticationError") return { retryable: false, errorClass: name };
  if (code === "EAUTH" || (code === "ECONNREFUSED" && responseCode === 530)) return { retryable: false, errorClass: "SMTP_AUTH_FAILURE" };
  if (responseCode >= 500 && responseCode < 600) return { retryable: true, errorClass: `SMTP_${responseCode}` };
  if (responseCode >= 400 && responseCode < 500 && responseCode !== 421 && responseCode !== 451) {
    return { retryable: false, errorClass: `SMTP_${responseCode}` };
  }
  if (code === "ETIMEDOUT" || code === "ECONNRESET" || code === "ENOTFOUND" || code === "EAI_AGAIN") {
    return { retryable: true, errorClass: `NETWORK_${code}` };
  }
  if (name === "CanceledError" || name === "TimeoutError") return { retryable: true, errorClass: `${name}` };

  return { retryable: true, errorClass: name };
}

async function claimExtractionJob(poolInstance) {
  return withTransaction(poolInstance, async (client) => {
    const result = await client.query(
      `SELECT ej.*, jd.original_file_ref, jd.original_mime_type
       FROM extraction_jobs ej
       JOIN job_descriptions jd ON jd.id = ej.job_description_id
       WHERE ((ej.status = 'PENDING' AND ej.available_at <= now())
          OR (ej.status = 'PROCESSING' AND ej.locked_until <= now()))
       ORDER BY ej.available_at, ej.created_at
       FOR UPDATE OF ej SKIP LOCKED LIMIT 1`,
    );
    if (!result.rowCount) return null;
    const job = result.rows[0];
    await client.query(
      `UPDATE extraction_jobs SET status = 'PROCESSING', started_at = now(),
         locked_at = now(), locked_until = now() + interval '5 minutes',
         attempt_count = attempt_count + 1 WHERE id = $1`,
      [job.id],
    );
    return { ...job, attempt_count: job.attempt_count + 1 };
  });
}

async function processExtractionJob({ poolInstance, storage, environment, job }) {
  const startedAt = performance.now();
  try {
    const buffer = await storage.get(job.original_file_ref);
    const result = await extractDocument({ buffer, mimeType: job.original_mime_type, ocr: environment.ocr });
    if (!result.text.trim()) throw new Error("EMPTY_EXTRACTION");
    await withTransaction(poolInstance, async (client) => {
      const updated = await client.query(
        `UPDATE job_descriptions SET extracted_text = $2,
           corrected_text = CASE WHEN corrected_version = 0 THEN $2 ELSE corrected_text END,
           corrected_version = CASE WHEN corrected_version = 0 THEN 1 ELSE corrected_version END,
           extraction_method = $3, extraction_version = 'extract-v1',
           status = 'READY_FOR_REVIEW', original_file_ref = NULL,
           updated_at = now(), version = version + 1
         WHERE id = $1 RETURNING student_id, corrected_version`,
        [job.job_description_id, result.text.trim(), result.method],
      );
      if (updated.rows[0].corrected_version === 1) {
        await client.query(
          `INSERT INTO jd_text_versions (job_description_id, version, corrected_text, created_by)
           VALUES ($1, 1, $2, $3) ON CONFLICT DO NOTHING`,
          [job.job_description_id, result.text.trim(), updated.rows[0].student_id],
        );
      }
      await client.query(
        `UPDATE extraction_jobs SET status = 'SUCCEEDED', finished_at = now(),
           duration_ms = $2, confidence = $3, error_code = NULL,
           locked_at = NULL, locked_until = NULL WHERE id = $1`,
        [job.id, Math.round(performance.now() - startedAt), result.confidence],
      );
    });
    await storage.delete(job.original_file_ref);
    console.log(JSON.stringify({ event: "extraction.succeeded", jobId: job.id, method: result.method }));
  } catch (error) {
    const finalAttempt = job.attempt_count >= environment.ocr.maxAttempts;
    const errorCode = extractionErrorCode(error);
    await withTransaction(poolInstance, async (client) => {
      await client.query(
        `UPDATE extraction_jobs SET status = $2,
           available_at = CASE WHEN $2 = 'PENDING' THEN now() + interval '1 minute' ELSE available_at END,
           finished_at = CASE WHEN $2 = 'FAILED' THEN now() ELSE NULL END,
           duration_ms = $3, error_code = $4, locked_at = NULL, locked_until = NULL
         WHERE id = $1`,
        [job.id, finalAttempt ? "FAILED" : "PENDING", Math.round(performance.now() - startedAt), errorCode],
      );
      if (finalAttempt) {
        await client.query(
          "UPDATE job_descriptions SET status = 'FAILED', updated_at = now(), version = version + 1 WHERE id = $1",
          [job.job_description_id],
        );
        await createOperationCase(client, {
          caseType: "EXTRACTION_FAILED",
          targetType: "JOB_DESCRIPTION",
          targetId: job.job_description_id,
          publicSummary: "Không thể trích xuất JD tự động; người dùng có thể dán nội dung thủ công.",
          restrictedMetadata: { errorClass: error.name, errorCode },
        });
      }
    });
    console.error(JSON.stringify({ event: "extraction.failed", jobId: job.id, errorClass: error.name, finalAttempt }));
  }
}

async function claimNotification(poolInstance) {
  return withTransaction(poolInstance, async (client) => {
    const result = await client.query(
      `SELECT no.*, u.email, u.display_name
       FROM notification_outbox no JOIN users u ON u.id = no.recipient_user_id
       WHERE ((no.status IN ('PENDING', 'RETRY') AND no.available_at <= now())
          OR (no.status = 'PROCESSING' AND no.locked_until <= now()))
       ORDER BY no.available_at, no.occurred_at
       FOR UPDATE OF no SKIP LOCKED LIMIT 1`,
    );
    if (!result.rowCount) return null;
    const job = result.rows[0];
    await client.query(
      `UPDATE notification_outbox SET status = 'PROCESSING', attempt_count = attempt_count + 1,
         locked_at = now(), locked_until = now() + interval '5 minutes' WHERE id = $1`,
      [job.id],
    );
    const claimed = { ...job, attempt_count: job.attempt_count + 1 };
    if (job.status === "PROCESSING") {
      console.log(JSON.stringify({ event: "notification.claim_recovered", outboxId: job.id, eventType: job.event_type, aggregateType: job.aggregate_type, aggregateId: job.aggregate_id, channel: job.channel, attemptCount: claimed.attempt_count }));
    } else {
      console.log(JSON.stringify({ event: "notification.claimed", outboxId: job.id, eventType: job.event_type, aggregateType: job.aggregate_type, aggregateId: job.aggregate_id, channel: job.channel, attemptCount: claimed.attempt_count }));
    }
    return claimed;
  });
}

async function tokenUrl(poolInstance, environment, payload) {
  if (!payload.tokenId || !payload.purpose) return null;
  const result = await poolInstance.query(
    "SELECT id, purpose, expires_at FROM one_time_tokens WHERE id = $1 AND consumed_at IS NULL",
    [payload.tokenId],
  );
  if (!result.rowCount) return null;
  const generated = createOneTimeToken({
    id: result.rows[0].id,
    purpose: result.rows[0].purpose,
    expiresAt: result.rows[0].expires_at,
    secret: environment.sessionSecret,
  });
  const pathByPurpose = {
    RESET_PASSWORD: "/reset-password",
    VERIFY_EMAIL: "/verify-email",
    ADMIN_INVITE: "/accept-admin-invite",
  };
  const path = pathByPurpose[result.rows[0].purpose];
  return `${environment.frontendOrigin}${path}?token=${encodeURIComponent(generated.token)}`;
}

async function notificationContent(poolInstance, environment, job) {
  if (job.payload?.title && job.payload?.body) {
    return { subject: job.payload.title, text: job.payload.body };
  }
  const link = await tokenUrl(poolInstance, environment, job.payload);
  const templates = {
    "identity.email.verification.requested": {
      subject: "Xác minh tài khoản PrepVI",
      text: `Xin chào ${job.display_name},\n\nXác minh tài khoản tại: ${link}`,
    },
    "identity.password.reset.requested": {
      subject: "Đặt lại mật khẩu PrepVI",
      text: `Xin chào ${job.display_name},\n\nĐặt lại mật khẩu tại: ${link}`,
    },
    "identity.admin.invite.requested": {
      subject: "Lời mời quản trị PrepVI",
      text: `Xin chào ${job.display_name},\n\nThiết lập tài khoản quản trị tại: ${link}`,
    },
    "BOOKING_REQUESTED": {
      subject: "Bạn có yêu cầu đặt lịch mới",
      text: "Mở PrepVI để xem yêu cầu đặt lịch và quyết định bước tiếp theo.",
    },
    "BOOKING_CONFIRMED": {
      subject: "Lịch luyện phỏng vấn đã được xác nhận",
      text: "Mở PrepVI để xem thời gian và thông tin buổi luyện.",
    },
    "BOOKING_REJECTED": {
      subject: "Yêu cầu đặt lịch chưa được chấp nhận",
      text: "Mở PrepVI để xem trạng thái và chọn khung giờ khác.",
    },
    "BOOKING_CANCELLED": {
      subject: "Lịch luyện phỏng vấn đã được hủy",
      text: "Mở PrepVI để xem trạng thái và lựa chọn lịch khác nếu cần.",
    },
    "BOOKING_RESCHEDULE_PROPOSED": {
      subject: "Có đề xuất đổi giờ",
      text: "Mở PrepVI để chấp nhận hoặc từ chối giờ mới.",
    },
    "BOOKING_RESCHEDULE_ACCEPTED": {
      subject: "Giờ phỏng vấn mới đã được xác nhận",
      text: "Mở PrepVI để kiểm tra thời gian mới.",
    },
    "BOOKING_RESCHEDULE_REJECTED": {
      subject: "Đề xuất đổi giờ không được chấp nhận",
      text: "Mở PrepVI để xem thời gian hiện tại và lựa chọn tiếp theo.",
    },
    "BOOKING_COMPLETED": {
      subject: "Buổi phỏng vấn đã hoàn tất",
      text: "Mở PrepVI để xem phản hồi và bước tiếp theo.",
    },
    "MEETING_LINK_READY": {
      subject: "Link phòng phỏng vấn đã sẵn sàng",
      text: "Mở PrepVI để tham gia đúng giờ.",
    },
    "FEEDBACK_READY": {
      subject: "Bạn đã nhận được phản hồi",
      text: "Mở PrepVI để xem phản hồi riêng tư và hành động tiếp theo.",
    },
    "BOOKING_REMINDER_24H": {
      subject: "Nhắc lịch phỏng vấn sau 24 giờ",
      text: "Mở PrepVI để kiểm tra lịch và link phòng họp.",
    },
    "BOOKING_REMINDER_1H": {
      subject: "Nhắc lịch phỏng vấn sau 1 giờ",
      text: "Mở PrepVI để kiểm tra lịch và link phòng họp.",
    },
  };
  return templates[job.event_type] ?? templates[job.event_type.toLowerCase().replaceAll("_", ".")] ?? {
    subject: "Cập nhật từ PrepVI",
    text: "Mở PrepVI để xem cập nhật mới nhất.",
  };
}

async function processNotification({ poolInstance, transporter, environment, job }) {
  const logBase = { outboxId: job.id, eventType: job.event_type, aggregateType: job.aggregate_type, aggregateId: job.aggregate_id, channel: job.channel, attemptCount: job.attempt_count };
  try {
    const content = await notificationContent(poolInstance, environment, job);
    const active = await poolInstance.query("SELECT status FROM notification_outbox WHERE id = $1", [job.id]);
    if (!active.rowCount || active.rows[0].status !== "PROCESSING") return;
    if (job.channel === "IN_APP") {
      await withTransaction(poolInstance, async (client) => {
        await createInAppNotification(client, {
          userId: job.recipient_user_id,
          eventType: job.event_type,
          title: content.subject,
          body: content.text,
          resourceType: job.aggregate_type,
          resourceId: job.aggregate_id,
          sourceOutboxId: job.id,
        });
        await client.query(
          `UPDATE notification_outbox SET status = 'SENT', sent_at = now(),
             last_error_class = NULL, locked_at = NULL, locked_until = NULL
           WHERE id = $1 AND status = 'PROCESSING'`,
          [job.id],
        );
      });
      console.log(JSON.stringify({ event: "notification.sent", ...logBase, status: "SENT" }));
      return;
    }
    const result = await transporter.sendMail({
      from: environment.smtp.from,
      to: job.email,
      subject: content.subject,
      text: content.text,
      headers: { "X-PrepVI-Idempotency-Key": job.deduplication_key },
    });
    await poolInstance.query(
      `UPDATE notification_outbox SET status = 'SENT', sent_at = now(),
         provider_message_id = $2, last_error_class = NULL,
         locked_at = NULL, locked_until = NULL
       WHERE id = $1 AND status = 'PROCESSING'`,
      [job.id, result.messageId],
    );
    console.log(JSON.stringify({ event: "notification.sent", ...logBase, status: "SENT" }));
  } catch (error) {
    const { retryable, errorClass } = classifyNotificationError(error);
    const retryMinutes = retryable && job.attempt_count === 1 ? 1 : retryable && job.attempt_count === 2 ? 5 : null;
    await withTransaction(poolInstance, async (client) => {
      await client.query(
        `UPDATE notification_outbox SET status = $2,
           available_at = CASE WHEN $2 = 'RETRY' THEN scheduled_for + ($3 || ' minutes')::interval ELSE available_at END,
           last_error_class = $4, locked_at = NULL, locked_until = NULL
         WHERE id = $1 AND status = 'PROCESSING'`,
        [job.id, retryMinutes ? "RETRY" : "DEAD", retryMinutes ?? 0, errorClass],
      );
      if (retryMinutes) {
        console.log(JSON.stringify({ event: "notification.retry_scheduled", ...logBase, status: "RETRY", retryMinutes, errorClass }));
      } else {
        console.log(JSON.stringify({ event: "notification.dead", ...logBase, status: "DEAD", errorClass }));
        await createOperationCase(client, {
          caseType: "NOTIFICATION_DEAD",
          targetType: "NOTIFICATION_OUTBOX",
          targetId: job.id,
          publicSummary: "Thông báo cần được vận hành gửi lại.",
          restrictedMetadata: {
            aggregateType: job.aggregate_type,
            aggregateId: job.aggregate_id,
            eventType: job.event_type,
            channel: job.channel,
            errorClass,
            attemptCount: job.attempt_count,
          },
        });
      }
    });
  }
}

async function cleanupExpiredOriginalFiles(poolInstance, storage) {
  const expired = await poolInstance.query(
    `SELECT id, original_file_ref
     FROM job_descriptions
     WHERE original_file_ref IS NOT NULL AND original_delete_after <= now()
     ORDER BY original_delete_after
     LIMIT 20`,
  );
  let deleted = 0;
  for (const item of expired.rows) {
    await storage.delete(item.original_file_ref);
    const cleared = await poolInstance.query(
      `UPDATE job_descriptions SET original_file_ref = NULL, updated_at = now(), version = version + 1
       WHERE id = $1 AND original_file_ref = $2`,
      [item.id, item.original_file_ref],
    );
    deleted += cleared.rowCount;
  }
  return deleted;
}

async function publishDueReviews(poolInstance) {
  return withTransaction(poolInstance, async (client) => {
    const published = await client.query(
      `UPDATE reviews r
       SET moderation_status = 'PUBLISHED', version = r.version + 1
       FROM bookings b
       WHERE b.id = r.booking_id
         AND r.moderation_status = 'PENDING_PUBLICATION'
         AND r.publish_after <= now()
       RETURNING b.mentor_id`,
    );
    const mentorIds = [...new Set(published.rows.map((row) => row.mentor_id))];
    if (mentorIds.length) {
      await client.query(
        `UPDATE mentor_profiles mp
         SET public_rating = ratings.average_rating,
             updated_at = now(), version = mp.version + 1
         FROM (
           SELECT b.mentor_id, round(avg(r.rating)::numeric, 2) AS average_rating
           FROM reviews r JOIN bookings b ON b.id = r.booking_id
           WHERE r.moderation_status = 'PUBLISHED' AND b.mentor_id = ANY($1::uuid[])
           GROUP BY b.mentor_id
         ) ratings
         WHERE mp.id = ratings.mentor_id`,
        [mentorIds],
      );
    }
    return published.rowCount;
  });
}

async function cleanupExpiredAiPrivateInputs(poolInstance) {
  const result = await poolInstance.query(
    "DELETE FROM ai_job_private_inputs WHERE expires_at <= now() RETURNING job_id",
  );
  return result.rowCount;
}

async function escalateExpiredMeetingLinkFailures(poolInstance) {
  const result = await poolInstance.query(
    `UPDATE operation_cases SET
       public_summary = 'Mentor chưa thay link trong 15 phút. Hai bên có thể chọn reschedule hoặc chờ Admin hỗ trợ.',
       updated_at = now(), version = version + 1
     WHERE case_type = 'MEETING_LINK_FAILED' AND status IN ('OPEN','IN_PROGRESS')
       AND (restricted_metadata->>'replacementDeadline')::timestamptz <= now()
       AND public_summary NOT LIKE 'Mentor chưa thay link%'
     RETURNING id`,
  );
  return result.rowCount;
}

export function startWorker({ poolInstance = pool, environment = getEnvironment() } = {}) {
  const storage = createPrivateStorage(environment.storage);
  const transporter = nodemailer.createTransport({
    host: environment.smtp.host,
    port: environment.smtp.port,
    secure: environment.smtp.secure,
    auth: environment.smtp.user ? { user: environment.smtp.user, pass: environment.smtp.password } : undefined,
  });
  const aiProvider = createAiProvider(environment);
  const aiHandlers = createAiJobHandlers({ pool: poolInstance, environment });
  let stopped = false;
  let nextRetentionAt = 0;
  async function tick() {
    if (Date.now() >= nextRetentionAt) {
      const deletedFiles = await cleanupExpiredOriginalFiles(poolInstance, storage);
      if (deletedFiles) console.log(JSON.stringify({ event: "retention.jd_originals_deleted", count: deletedFiles }));
      const deletedAiInputs = await cleanupExpiredAiPrivateInputs(poolInstance);
      if (deletedAiInputs) console.log(JSON.stringify({ event: "retention.ai_private_inputs_deleted", count: deletedAiInputs }));
      nextRetentionAt = Date.now() + retentionIntervalMs;
    }
    const publishedReviews = await publishDueReviews(poolInstance);
    if (publishedReviews) {
      console.log(JSON.stringify({ event: "reviews.published", count: publishedReviews }));
    }
    const escalatedLinks = await escalateExpiredMeetingLinkFailures(poolInstance);
    if (escalatedLinks) console.log(JSON.stringify({ event: "meeting_links.recovery_expired", count: escalatedLinks }));
    const extractionJobs = await Promise.all(
      Array.from({ length: environment.ocr.concurrency }, () => claimExtractionJob(poolInstance)),
    );
    await Promise.all(extractionJobs.filter(Boolean).map((job) => processExtractionJob({ poolInstance, storage, environment, job })));
    if (environment.ai.enabled) {
      const aiJobs = await Promise.all(
        Array.from({ length: environment.ai.concurrency }, () => claimAiJob(poolInstance)),
      );
      await Promise.all(aiJobs.filter(Boolean).map((job) => processAiJob({
        pool: poolInstance,
        provider: aiProvider,
        handlers: aiHandlers,
        job,
      })));
    }
    const notifications = await Promise.all(
      Array.from({ length: 4 }, () => claimNotification(poolInstance)),
    );
    await Promise.all(notifications.filter(Boolean).map((job) => processNotification({ poolInstance, transporter, environment, job })));
  }
  const loop = (async () => {
    while (!stopped) {
      try {
        await tick();
      } catch (error) {
        console.error(JSON.stringify({
          event: "worker.tick_failed",
          errorClass: error.name,
          errorCode: error.code ?? "WORKER_TICK_FAILED",
          errorMessage: error.message,
          errorTable: error.table,
          errorSchema: error.schema,
        }));
      }
      await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
    }
  })();
  return {
    status: "running",
    async stop() {
      stopped = true;
      await loop;
    },
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const worker = startWorker();
  const shutdown = async () => {
    await worker.stop();
    await pool.end();
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}
