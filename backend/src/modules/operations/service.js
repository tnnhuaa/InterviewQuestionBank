import { AppError, notFoundError } from "../../shared/errors.js";
import { withTransaction } from "../../platform/db/transaction.js";
import { writeAudit } from "../../platform/audit.js";
import { findIdempotentResult, saveIdempotentResult } from "../../platform/idempotency.js";
import { enqueueNotification } from "../../platform/outbox.js";
import { featureByJobKind } from "../ai/jobs.js";

const actionsByType = {
  MENTOR_VERIFICATION: ["RESOLVE", "DISMISS", "ASSIGN"],
  QUESTION_MODERATION: ["RESOLVE", "DISMISS", "ASSIGN"],
  EXTRACTION_FAILED: ["RETRY", "RESOLVE", "DISMISS", "ASSIGN"],
  NOTIFICATION_DEAD: ["RETRY", "RESOLVE", "DISMISS", "ASSIGN"],
  MEETING_LINK_FAILED: ["RESOLVE", "DISMISS", "ASSIGN"],
  LATE_CHANGE: ["APPROVE_LATE_CHANGE", "DISMISS", "ASSIGN"],
  NO_SHOW: ["CONFIRM_NO_SHOW", "DISMISS", "ASSIGN"],
  COMPLETION_DISPUTE: ["UPHOLD_DISPUTE", "DISMISS_DISPUTE", "ASSIGN"],
  REVIEW_MODERATION: ["PUBLISH_REVIEW", "HIDE_REVIEW", "DISMISS", "ASSIGN"],
  AI_JOB_FAILED: ["RETRY_AI_JOB", "DISABLE_FEATURE", "DISMISS", "ASSIGN"],
};

async function cancelReminders(client, bookingId) {
  await client.query(
    `UPDATE notification_outbox SET status = 'CANCELLED', cancelled_at = now(), locked_at = NULL, locked_until = NULL
     WHERE aggregate_type = 'BOOKING' AND aggregate_id = $1 AND milestone IN ('24H','1H')
       AND status IN ('PENDING','RETRY','PROCESSING')`,
    [bookingId],
  );
}

async function scheduleReminders(client, booking, recipients) {
  for (const milestone of [{ code: "24H", hours: 24 }, { code: "1H", hours: 1 }]) {
    const scheduledFor = new Date(new Date(booking.starts_at).getTime() - milestone.hours * 3_600_000);
    if (scheduledFor <= new Date()) continue;
    for (const recipientUserId of recipients) {
      for (const channel of ["EMAIL", "IN_APP"]) {
        await enqueueNotification(client, {
          eventType: `BOOKING_REMINDER_${milestone.code}`,
          aggregateType: "BOOKING",
          aggregateId: booking.id,
          recipientUserId,
          channel,
          payload: { bookingId: booking.id, startsAt: booking.starts_at, timezone: booking.source_timezone, title: `Nhắc lịch phỏng vấn sau ${milestone.hours} giờ`, body: "Mở PrepVI để kiểm tra lịch và link phòng họp." },
          deduplicationKey: `BOOKING_REMINDER:${booking.id}:${booking.schedule_version}:${recipientUserId}:${channel}:${milestone.code}`,
          availableAt: scheduledFor,
          scheduledFor,
          scheduleVersion: booking.schedule_version,
          milestone: milestone.code,
        });
      }
    }
  }
}

function caseDto(row) {
  return {
    id: row.id,
    type: row.case_type,
    targetType: row.target_type,
    targetId: row.target_id,
    status: row.status,
    summary: row.public_summary,
    assignedTo: row.assigned_to,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    version: row.version,
    allowedActions: actionsByType[row.case_type] ?? [],
    aiJob: row.ai_kind ? {
      id: row.target_id,
      kind: row.ai_kind,
      status: row.ai_status,
      errorCode: row.ai_error_code,
      attemptCount: row.ai_attempt_count,
      maxAttempts: row.ai_max_attempts,
      model: row.ai_model,
    } : undefined,
  };
}

export function createOperationsService({ pool, environment }) {
  async function listCases({ status, type, page, pageSize }) {
    const values = [];
    const clauses = [];
    if (status) { values.push(status); clauses.push(`status = $${values.length}`); }
    if (type) { values.push(type); clauses.push(`case_type = $${values.length}`); }
    const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
    const countValues = [...values];
    values.push(pageSize, (page - 1) * pageSize);
    const [items, count] = await Promise.all([
      pool.query(`SELECT * FROM operation_cases ${where} ORDER BY created_at, id LIMIT $${values.length - 1} OFFSET $${values.length}`, values),
      pool.query(`SELECT count(*)::int AS total FROM operation_cases ${where}`, countValues),
    ]);
    return { items: items.rows.map(caseDto), pageInfo: { page, pageSize, total: count.rows[0].total } };
  }

  async function getCase(id) {
    const result = await pool.query(
      `SELECT oc.*, aj.kind AS ai_kind, aj.status AS ai_status, aj.error_code AS ai_error_code,
              aj.attempt_count AS ai_attempt_count, aj.max_attempts AS ai_max_attempts, aj.model AS ai_model
       FROM operation_cases oc LEFT JOIN ai_jobs aj
         ON oc.case_type = 'AI_JOB_FAILED' AND oc.target_type = 'AI_JOB' AND aj.id = oc.target_id
       WHERE oc.id = $1`,
      [id],
    );
    if (!result.rowCount) throw notFoundError();
    return caseDto(result.rows[0]);
  }

  async function act(actorId, caseId, input, idempotencyKey, correlationId) {
    return withTransaction(pool, async (client) => {
      const operation = `OPERATION_CASE_${input.action}`;
      const idempotency = await findIdempotentResult(client, {
        actorId, operation, key: idempotencyKey, input: { caseId, ...input },
      });
      if (idempotency.cached) return idempotency.cached.response_body;
      const selected = await client.query("SELECT * FROM operation_cases WHERE id = $1 FOR UPDATE", [caseId]);
      if (!selected.rowCount) throw notFoundError();
      const row = selected.rows[0];
      if (row.version !== input.version) {
        throw new AppError({ status: 409, code: "VERSION_CONFLICT", message: "Case đã thay đổi. Hãy tải lại impact preview.", recovery: { kind: "RETRY_SAFE", retryable: true, retryAfterSeconds: null } });
      }
      if (!["OPEN", "IN_PROGRESS"].includes(row.status)) {
        throw new AppError({ status: 409, code: "CASE_ALREADY_CLOSED", message: "Case này đã được xử lý.", recovery: { kind: "RETRY_SAFE", retryable: true, retryAfterSeconds: null } });
      }
      if (!(actionsByType[row.case_type] ?? []).includes(input.action)) {
        throw new AppError({ status: 422, code: "OPERATION_NOT_ALLOWED", message: "Hành động này không được phép với loại case hiện tại.", recovery: { kind: "NONE", retryable: false, retryAfterSeconds: null } });
      }

      let nextStatus = "RESOLVED";
      if (input.action === "ASSIGN") {
        await client.query("UPDATE operation_cases SET assigned_to = $2, status = 'IN_PROGRESS', version = version + 1, updated_at = now() WHERE id = $1", [caseId, input.assigneeId ?? actorId]);
        nextStatus = "IN_PROGRESS";
      } else if (input.action === "DISMISS") {
        nextStatus = "DISMISSED";
      } else if (input.action === "RETRY" && row.case_type === "EXTRACTION_FAILED") {
        await client.query(
          `UPDATE extraction_jobs SET status = 'PENDING', attempt_count = 0, available_at = now(),
             error_code = NULL, started_at = NULL, finished_at = NULL
           WHERE job_description_id = $1 AND status = 'FAILED'`,
          [row.target_id],
        );
        await client.query(
          `UPDATE job_descriptions SET status = 'EXTRACTING', updated_at = now(), version = version + 1
           WHERE id = $1`,
          [row.target_id],
        );
      } else if (input.action === "RETRY" && row.case_type === "NOTIFICATION_DEAD") {
        await client.query(
          `UPDATE notification_outbox SET status = 'RETRY', attempt_count = 0,
             available_at = now(), last_error_class = NULL WHERE id = $1 AND status = 'DEAD'`,
          [row.target_id],
        );
      } else if (input.action === "RETRY_AI_JOB") {
        const job = await client.query("SELECT * FROM ai_jobs WHERE id = $1 AND status = 'FAILED' FOR UPDATE", [row.target_id]);
        if (!job.rowCount) throw notFoundError();
        const feature = featureByJobKind[job.rows[0].kind];
        const control = await client.query("SELECT enabled FROM ai_feature_controls WHERE feature = $1", [feature]);
        if (!environment.ai.enabled || !environment.ai.features[feature] || (control.rowCount && !control.rows[0].enabled)) {
          throw new AppError({
            status: 409,
            code: "AI_FEATURE_DISABLED",
            message: "Tính năng AI đang tắt. Hãy bật cấu hình triển khai trước khi đưa job lại vào hàng đợi.",
            recovery: { kind: "CONTACT_SUPPORT", retryable: false, retryAfterSeconds: null },
          });
        }
        await client.query(
          `UPDATE ai_jobs SET status = 'PENDING', attempt_count = 0, error_code = NULL,
             available_at = now(), started_at = NULL, finished_at = NULL, duration_ms = NULL,
             locked_at = NULL, locked_until = NULL, updated_at = now()
           WHERE id = $1`,
          [row.target_id],
        );
      } else if (input.action === "DISABLE_FEATURE") {
        const job = await client.query("SELECT kind FROM ai_jobs WHERE id = $1 FOR UPDATE", [row.target_id]);
        if (!job.rowCount) throw notFoundError();
        const feature = featureByJobKind[job.rows[0].kind];
        if (!feature) throw notFoundError();
        await client.query(
          `INSERT INTO ai_feature_controls(feature, enabled, updated_by, reason)
           VALUES ($1, false, $2, $3)
           ON CONFLICT (feature) DO UPDATE SET enabled = false, updated_by = EXCLUDED.updated_by,
             reason = EXCLUDED.reason, updated_at = now(), version = ai_feature_controls.version + 1`,
          [feature, actorId, input.reason],
        );
        await client.query(
          `UPDATE ai_jobs SET status = 'CANCELLED', error_code = 'AI_DISABLED_BY_OPERATIONS',
             finished_at = now(), updated_at = now()
           WHERE kind = $1 AND status = 'PENDING'`,
          [job.rows[0].kind],
        );
      } else if (input.action === "APPROVE_LATE_CHANGE") {
        const booking = await client.query(
          `SELECT b.*, mp.user_id AS mentor_user_id FROM bookings b
           JOIN mentor_profiles mp ON mp.id = b.mentor_id WHERE b.id = $1 FOR UPDATE OF b`,
          [row.target_id],
        );
        if (!booking.rowCount) throw notFoundError();
        const requested = row.restricted_metadata?.requestedAction;
        if (requested === "CANCEL") {
          if (booking.rows[0].state === "CONFIRMED" || booking.rows[0].previous_state === "CONFIRMED") await client.query("UPDATE availability_slots SET status = 'AVAILABLE', version = version + 1 WHERE id = $1", [booking.rows[0].slot_id]);
          await client.query("UPDATE bookings SET state = 'CANCELLED', version = version + 1, updated_at = now() WHERE id = $1", [row.target_id]);
          await client.query("INSERT INTO booking_transitions (booking_id, from_state, to_state, actor_id, action, reason) VALUES ($1,$2,'CANCELLED',$3,'ADMIN_APPROVE_LATE_CANCEL',$4)", [row.target_id, booking.rows[0].state, actorId, input.reason]);
          await cancelReminders(client, row.target_id);
        } else {
          const proposedSlotId = row.restricted_metadata?.proposedSlotId;
          const proposed = await client.query(
            "SELECT * FROM availability_slots WHERE id = $1 AND mentor_id = $2 AND status = 'AVAILABLE' FOR UPDATE",
            [proposedSlotId, booking.rows[0].mentor_id],
          );
          if (!proposed.rowCount) throw new AppError({ status: 409, code: "BOOKING_SLOT_CONFLICT", message: "Slot đề xuất không còn khả dụng.", recovery: { kind: "SELECT_ANOTHER_SLOT", retryable: false, retryAfterSeconds: null } });
          if (booking.rows[0].state === "CONFIRMED" || booking.rows[0].previous_state === "CONFIRMED") await client.query("UPDATE availability_slots SET status = 'AVAILABLE', version = version + 1 WHERE id = $1", [booking.rows[0].slot_id]);
          await client.query("UPDATE availability_slots SET status = 'BOOKED', version = version + 1 WHERE id = $1", [proposedSlotId]);
          await cancelReminders(client, row.target_id);
          const changed = await client.query(
            `UPDATE bookings SET slot_id = $2, starts_at = $3, ends_at = $4, source_timezone = $5,
               state = 'CONFIRMED', reschedule_count = reschedule_count + 1,
               schedule_version = schedule_version + 1, version = version + 1, updated_at = now()
             WHERE id = $1 RETURNING *`,
            [row.target_id, proposedSlotId, proposed.rows[0].starts_at, proposed.rows[0].ends_at, proposed.rows[0].source_timezone],
          );
          await scheduleReminders(client, changed.rows[0], [booking.rows[0].student_id, booking.rows[0].mentor_user_id]);
          await client.query("INSERT INTO booking_transitions (booking_id, from_state, to_state, actor_id, action, reason) VALUES ($1,$2,'CONFIRMED',$3,'ADMIN_APPROVE_LATE_RESCHEDULE',$4)", [row.target_id, booking.rows[0].state, actorId, input.reason]);
        }
      } else if (input.action === "CONFIRM_NO_SHOW") {
        const booking = await client.query(
          "SELECT state FROM bookings WHERE id = $1 AND state IN ('CONFIRMED','COMPLETED') FOR UPDATE",
          [row.target_id],
        );
        if (!booking.rowCount) throw notFoundError();
        await client.query(
          "UPDATE bookings SET state = 'NO_SHOW', version = version + 1, updated_at = now() WHERE id = $1",
          [row.target_id],
        );
        await cancelReminders(client, row.target_id);
        await client.query(
          `INSERT INTO booking_transitions (booking_id, from_state, to_state, actor_id, action, reason)
           VALUES ($1, $2, 'NO_SHOW', $3, 'ADMIN_CONFIRM_NO_SHOW', $4)`,
          [row.target_id, booking.rows[0].state, actorId, input.reason],
        );
      } else if (["PUBLISH_REVIEW", "HIDE_REVIEW"].includes(input.action)) {
        const review = await client.query(
          `UPDATE reviews r SET moderation_status = $2, version = r.version + 1
           FROM bookings b WHERE r.id = $1 AND b.id = r.booking_id
           RETURNING b.mentor_id`,
          [row.target_id, input.action === "PUBLISH_REVIEW" ? "PUBLISHED" : "HIDDEN"],
        );
        if (!review.rowCount) throw notFoundError();
        await client.query(
          `UPDATE mentor_profiles mp SET
             public_rating = (
               SELECT round(avg(r.rating)::numeric, 2)
               FROM reviews r JOIN bookings b ON b.id = r.booking_id
               WHERE b.mentor_id = mp.id AND r.moderation_status = 'PUBLISHED'
             ),
             updated_at = now(), version = mp.version + 1
           WHERE mp.id = $1`,
          [review.rows[0].mentor_id],
        );
      } else if (["UPHOLD_DISPUTE", "DISMISS_DISPUTE"].includes(input.action)) {
        const status = input.action === "UPHOLD_DISPUTE" ? "UPHELD" : "DISMISSED";
        const dispute = await client.query(
          `UPDATE completion_disputes SET status = $2, resolved_by = $3, resolved_reason = $4,
             resolved_at = now(), version = version + 1
           WHERE booking_id = $1 AND status = 'OPEN' RETURNING id`,
          [row.target_id, status, actorId, input.reason],
        );
        if (!dispute.rowCount) throw notFoundError();
        await client.query(
          `UPDATE reports SET status = $2, resolved_by = $3, resolution_reason = $4,
             resolved_at = now(), version = version + 1
           WHERE target_type = 'BOOKING' AND target_id = $1 AND reason_code = 'COMPLETION_DISPUTE'`,
          [row.target_id, input.action === "UPHOLD_DISPUTE" ? "RESOLVED" : "DISMISSED", actorId, input.reason],
        );
        const review = await client.query(
          `UPDATE reviews r SET moderation_status = $2,
             publish_after = CASE WHEN $2 = 'PUBLISHED' THEN now() ELSE publish_after END,
             version = r.version + 1
           FROM bookings b WHERE r.booking_id = $1 AND b.id = r.booking_id
           RETURNING b.mentor_id`,
          [row.target_id, input.action === "UPHOLD_DISPUTE" ? "HIDDEN" : "PUBLISHED"],
        );
        if (review.rowCount) {
          await client.query(
            `UPDATE mentor_profiles mp SET public_rating = coalesce((
               SELECT round(avg(r.rating)::numeric, 2)
               FROM reviews r JOIN bookings b ON b.id = r.booking_id
               WHERE b.mentor_id = mp.id AND r.moderation_status = 'PUBLISHED'
             ), 0), updated_at = now(), version = mp.version + 1
             WHERE mp.id = $1`,
            [review.rows[0].mentor_id],
          );
        }
      }

      if (input.action !== "ASSIGN") {
        await client.query("UPDATE operation_cases SET status = $2, assigned_to = coalesce(assigned_to, $3), version = version + 1, updated_at = now() WHERE id = $1", [caseId, nextStatus, actorId]);
      }
      await writeAudit(client, { actorId, action: `OPERATION_${input.action}`, targetType: "OPERATION_CASE", targetId: caseId, reason: input.reason, correlationId, metadata: { caseType: row.case_type, targetType: row.target_type, targetId: row.target_id } });
      const refreshed = await client.query("SELECT * FROM operation_cases WHERE id = $1", [caseId]);
      const body = caseDto(refreshed.rows[0]);
      await saveIdempotentResult(client, { actorId, operation, key: idempotencyKey, digest: idempotency.digest, status: 200, body, resourceId: caseId });
      return body;
    });
  }

  async function impactPreview(caseId) {
    const selected = await pool.query("SELECT * FROM operation_cases WHERE id = $1", [caseId]);
    if (!selected.rowCount) throw notFoundError();
    const row = selected.rows[0];
    const effects = {
      LATE_CHANGE: ["Lịch hiện tại chỉ thay đổi sau khi Admin xác nhận.", "Slot được trả lại nếu hủy được duyệt."],
      NO_SHOW: ["Booking chuyển sang NO_SHOW.", "Hai bên nhận được audit reference."],
      EXTRACTION_FAILED: ["Job được đưa lại vào queue với bộ đếm retry mới."],
      NOTIFICATION_DEAD: ["Email được thử gửi lại; trạng thái booking không thay đổi."],
      REVIEW_MODERATION: ["Quyết định ảnh hưởng khả năng hiển thị công khai của review."],
      AI_JOB_FAILED: ["Retry đưa job về queue với bộ đếm mới; không thay đổi business state.", "Disable feature chặn job mới và hủy các job cùng loại còn đang chờ.", "Luồng deterministic/manual vẫn tiếp tục hoạt động."],
    };
    return { caseId, version: row.version, caseType: row.case_type, effects: effects[row.case_type] ?? ["Case được đóng với reason và audit bất biến."] };
  }

  async function listAudit({ targetType, targetId, page, pageSize }) {
    const values = [];
    const clauses = [];
    if (targetType) { values.push(targetType); clauses.push(`target_type = $${values.length}`); }
    if (targetId) { values.push(targetId); clauses.push(`target_id = $${values.length}`); }
    const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
    values.push(pageSize, (page - 1) * pageSize);
    const result = await pool.query(
      `SELECT id, actor_id AS "actorId", action, target_type AS "targetType", target_id AS "targetId",
              reason, metadata, correlation_id AS "correlationId", occurred_at AS "occurredAt"
       FROM audit_logs ${where} ORDER BY occurred_at DESC LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values,
    );
    return { items: result.rows, pageInfo: { page, pageSize, total: result.rowCount } };
  }

  async function listReports({ status, page, pageSize }) {
    const values = [];
    let where = "";
    if (status) {
      values.push(status);
      where = `WHERE status = $${values.length}`;
    }
    const countValues = [...values];
    values.push(pageSize, (page - 1) * pageSize);
    const [items, count] = await Promise.all([
      pool.query(
        `SELECT id, reporter_id AS "reporterId", target_type AS "targetType", target_id AS "targetId",
                reason_code AS "reasonCode", description, status, created_at AS "createdAt",
                resolved_at AS "resolvedAt", version
         FROM reports ${where} ORDER BY created_at DESC LIMIT $${values.length - 1} OFFSET $${values.length}`,
        values,
      ),
      pool.query(`SELECT count(*)::int AS total FROM reports ${where}`, countValues),
    ]);
    return { items: items.rows, pageInfo: { page, pageSize, total: count.rows[0].total } };
  }

  async function notifications(userId) {
    const result = await pool.query(
      `SELECT id, event_type AS "eventType", title, body, resource_type AS "resourceType",
              resource_id AS "resourceId", read_at AS "readAt", created_at AS "createdAt"
       FROM in_app_notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50`,
      [userId],
    );
    return { items: result.rows, unread: result.rows.filter((row) => !row.readAt).length };
  }

  async function markNotificationRead(userId, notificationId) {
    const result = await pool.query(
      "UPDATE in_app_notifications SET read_at = coalesce(read_at, now()) WHERE id = $1 AND user_id = $2 RETURNING id, read_at AS \"readAt\"",
      [notificationId, userId],
    );
    if (!result.rowCount) throw notFoundError();
    return result.rows[0];
  }

  return { listCases, getCase, act, impactPreview, listAudit, listReports, notifications, markNotificationRead };
}
