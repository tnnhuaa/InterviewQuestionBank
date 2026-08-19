import { AppError, notFoundError } from "../../shared/errors.js";
import { withTransaction } from "../../platform/db/transaction.js";
import { writeAudit } from "../../platform/audit.js";
import { createOperationCase } from "../../platform/operations.js";
import { createInAppNotification, enqueueNotification } from "../../platform/outbox.js";
import { findIdempotentResult, saveIdempotentResult } from "../../platform/idempotency.js";
import { decryptPrivateValue, encryptPrivateValue, fingerprintPrivateValue } from "../../platform/security/encryption.js";
import { createAiJob } from "../ai/jobs.js";

const terminalStates = new Set(["REJECTED", "CANCELLED", "COMPLETED", "NO_SHOW"]);

const bookingNotificationContent = {
  BOOKING_REQUESTED: { title: "Có yêu cầu đặt lịch mới", body: "Mở yêu cầu để xác nhận, từ chối hoặc đề xuất giờ khác." },
  BOOKING_CONFIRMED: { title: "Lịch luyện phỏng vấn đã được xác nhận", body: "Mở lịch để kiểm tra thời gian và thông tin buổi luyện." },
  BOOKING_REJECTED: { title: "Yêu cầu đặt lịch chưa được chấp nhận", body: "Mở lịch để xem trạng thái và chọn khung giờ khác." },
  BOOKING_CANCELLED: { title: "Lịch luyện phỏng vấn đã được hủy", body: "Mở lịch để xem trạng thái hoặc chọn lịch khác." },
  BOOKING_RESCHEDULE_PROPOSED: { title: "Có đề xuất đổi giờ", body: "Mở lịch để chấp nhận hoặc từ chối giờ mới." },
  BOOKING_RESCHEDULE_ACCEPTED: { title: "Giờ phỏng vấn mới đã được xác nhận", body: "Mở lịch để kiểm tra thời gian mới." },
  BOOKING_RESCHEDULE_REJECTED: { title: "Đề xuất đổi giờ không được chấp nhận", body: "Mở lịch để xem thời gian hiện tại và lựa chọn tiếp theo." },
  BOOKING_COMPLETED: { title: "Buổi phỏng vấn đã hoàn tất", body: "Mở lịch để xem phản hồi và bước tiếp theo." },
  MEETING_LINK_READY: { title: "Link phòng phỏng vấn đã sẵn sàng", body: "Mở chi tiết lịch để tham gia đúng giờ." },
  FEEDBACK_READY: { title: "Mentor đã gửi feedback", body: "Mở lịch hẹn để xem nhận xét và bước tiếp theo." },
};

function conflict(code, message, recoveryKind = "RETRY_SAFE") {
  return new AppError({
    status: 409,
    code,
    message,
    recovery: { kind: recoveryKind, retryable: recoveryKind === "RETRY_SAFE", retryAfterSeconds: null },
  });
}

function bookingDto(row) {
  return {
    id: row.id,
    studentId: row.student_id,
    studentName: row.student_name,
    mentorId: row.mentor_id,
    mentorName: row.mentor_name,
    slotId: row.slot_id,
    jobDescriptionId: row.job_description_id,
    preparationPlanId: row.preparation_plan_id,
    goal: row.goal,
    interviewType: row.interview_type,
    status: row.state,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    timezone: row.source_timezone,
    rescheduleCount: row.reschedule_count,
    correctedText: row.corrected_text,
    topicNames: row.topic_names ?? [],
    selectedTopicIds: row.topic_ids ?? [],
    questionGroups: row.question_groups ?? [],
    roleSummary: row.role_summary,
    senioritySummary: row.seniority_summary,
    preparationPlanVersion: row.preparation_plan_version,
    scheduleVersion: row.schedule_version,
    meetingRecoveryDeadline: row.recovery_deadline,
    version: row.version,
    createdAt: row.created_at,
  };
}

const bookingProjection = `
  SELECT b.*, su.display_name AS student_name, mu.display_name AS mentor_name,
    mp.user_id AS mentor_user_id,
    bcs.topic_ids, bcs.question_ids, bcs.preparation_plan_version,
    bcs.role_summary, bcs.seniority_summary,
    jtv.corrected_text,
    ml.recovery_deadline,
    coalesce((SELECT array_agg(DISTINCT t.name ORDER BY t.name)
      FROM topics t WHERE t.id = ANY(coalesce(bcs.topic_ids, '{}'))),
      (SELECT array_agg(DISTINCT t.name ORDER BY t.name)
       FROM preparation_plan_items ppi JOIN topics t ON t.id = ppi.topic_id
       WHERE ppi.plan_id = b.preparation_plan_id), '{}') AS topic_names,
    coalesce((SELECT jsonb_agg(jsonb_build_object('id', q.id, 'title', q.title) ORDER BY q.id)
      FROM questions q WHERE q.id = ANY(coalesce(bcs.question_ids, '{}'))), '[]'::jsonb) AS question_groups
  FROM bookings b
  JOIN users su ON su.id = b.student_id
  JOIN mentor_profiles mp ON mp.id = b.mentor_id
  JOIN users mu ON mu.id = mp.user_id
  LEFT JOIN job_descriptions jd ON jd.id = coalesce(b.job_description_id,
    (SELECT pp.job_description_id FROM preparation_plans pp WHERE pp.id = b.preparation_plan_id))
  LEFT JOIN booking_context_snapshots bcs ON bcs.booking_id = b.id
  LEFT JOIN jd_text_versions jtv ON jtv.job_description_id = jd.id
    AND jtv.version = coalesce(bcs.corrected_text_version, jd.corrected_version)
  LEFT JOIN meeting_links ml ON ml.booking_id = b.id
`;

function bookingNotificationKey({ eventType, bookingId, bookingVersion, recipientUserId, channel = "EMAIL" }) {
  return ["BOOKING", eventType, bookingId, bookingVersion, recipientUserId, channel].join(":");
}

export async function enqueueBookingNotification(client, { booking, recipientUserId, eventType }) {
  const content = bookingNotificationContent[eventType];
  if (!content) throw new Error(`Unknown booking notification event type: ${eventType}`);
  const outbox = await enqueueNotification(client, {
    eventType,
    aggregateType: "BOOKING",
    aggregateId: booking.id,
    recipientUserId,
    channel: "EMAIL",
    payload: { bookingId: booking.id },
    deduplicationKey: bookingNotificationKey({ eventType, bookingId: booking.id, bookingVersion: booking.version, recipientUserId }),
  });
  await createInAppNotification(client, {
    userId: recipientUserId,
    eventType,
    title: content.title,
    body: content.body,
    resourceType: "BOOKING",
    resourceId: booking.id,
    sourceOutboxId: outbox.id,
  });
}

function agendaDraftDto(row) {
  return {
    id: row.id,
    bookingId: row.booking_id,
    jobId: row.job_id,
    agenda: row.agenda,
    status: row.status,
    version: row.version,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function feedbackDraftDto(row) {
  return {
    id: row.id,
    bookingId: row.booking_id,
    jobId: row.job_id,
    rubricScores: row.rubric_scores,
    strengths: row.strengths,
    weaknesses: row.weaknesses,
    nextActions: row.next_actions,
    status: row.status,
    version: row.version,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function cancelPendingReminders(client, bookingId, scheduleVersion = null) {
  await client.query(
    `UPDATE notification_outbox SET status = 'CANCELLED', cancelled_at = now(), locked_at = NULL, locked_until = NULL
     WHERE aggregate_type = 'BOOKING' AND aggregate_id = $1
       AND milestone IN ('24H','1H') AND status IN ('PENDING','RETRY','PROCESSING')
       AND ($2::int IS NULL OR schedule_version = $2)`,
    [bookingId, scheduleVersion],
  );
}

async function scheduleReminders(client, booking, recipientUserIds, remindersEnabled) {
  if (!remindersEnabled) return;
  const milestones = [
    { code: "24H", offsetMs: 24 * 3_600_000 },
    { code: "1H", offsetMs: 3_600_000 },
  ];
  for (const milestone of milestones) {
    const scheduledFor = new Date(new Date(booking.starts_at).getTime() - milestone.offsetMs);
    if (scheduledFor <= new Date()) continue;
    for (const recipientUserId of recipientUserIds) {
      for (const channel of ["EMAIL", "IN_APP"]) {
        await enqueueNotification(client, {
          eventType: `BOOKING_REMINDER_${milestone.code}`,
          aggregateType: "BOOKING",
          aggregateId: booking.id,
          recipientUserId,
          channel,
          payload: {
            bookingId: booking.id,
            startsAt: booking.starts_at,
            timezone: booking.source_timezone,
            title: `Nhắc lịch phỏng vấn sau ${milestone.code === "24H" ? "24 giờ" : "1 giờ"}`,
            body: "Mở PrepVI để kiểm tra thời gian, ngữ cảnh chuẩn bị và link phòng họp.",
          },
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

export function createBookingsService({ pool, environment }) {
  async function getParticipantRow(client, actor, bookingId, lock = false) {
    const result = await client.query(
      `${bookingProjection}
       WHERE b.id = $1 AND (
         b.student_id = $2 OR mp.user_id = $2 OR $3::boolean
       ) ${lock ? "FOR UPDATE OF b" : ""}`,
      [bookingId, actor.id, actor.roles.includes("ADMIN")],
    );
    if (!result.rowCount) throw notFoundError();
    return result.rows[0];
  }

  async function get(actor, bookingId) {
    const row = await getParticipantRow(pool, actor, bookingId);
    const result = bookingDto(row);
    const isParticipant = row.student_id === actor.id || row.mentor_user_id === actor.id;
    if (isParticipant) {
      const link = await pool.query(
         `SELECT encrypted_url, version FROM meeting_links
         WHERE booking_id = $1 AND now() >= available_from AND now() <= expires_at
           AND $2 = ANY(ARRAY['CONFIRMED','COMPLETED'])`,
        [bookingId, row.state],
      );
      if (link.rowCount) {
        result.meetingLink = decryptPrivateValue(link.rows[0].encrypted_url, environment.sessionSecret);
        result.meetingLinkVersion = link.rows[0].version;
      }
    }
    const proposal = await pool.query(
      `SELECT brp.id, brp.proposed_slot_id, brp.proposed_by, brp.reason, brp.status,
              s.starts_at, s.ends_at, s.source_timezone
       FROM booking_reschedule_proposals brp JOIN availability_slots s ON s.id = brp.proposed_slot_id
       WHERE brp.booking_id = $1 AND brp.status = 'PENDING' ORDER BY brp.created_at DESC LIMIT 1`,
      [bookingId],
    );
    if (proposal.rowCount) result.pendingProposal = proposal.rows[0];
    const recovery = await pool.query(
      `SELECT id, public_summary AS summary, version,
              restricted_metadata->>'replacementDeadline' AS "deadline"
       FROM operation_cases WHERE case_type = 'MEETING_LINK_FAILED' AND target_id = $1
         AND status IN ('OPEN','IN_PROGRESS') ORDER BY created_at DESC LIMIT 1`,
      [bookingId],
    );
    if (recovery.rowCount) result.meetingRecovery = recovery.rows[0];
    const participantCases = await pool.query(
      `SELECT id, case_type AS type, public_summary AS summary, version,
              coalesce(restricted_metadata->>'requestedBy', restricted_metadata->>'reportedBy') AS "requestedBy"
       FROM operation_cases WHERE target_id = $1 AND case_type IN ('LATE_CHANGE','NO_SHOW')
         AND status IN ('OPEN','IN_PROGRESS') ORDER BY created_at`,
      [bookingId],
    );
    result.participantCases = participantCases.rows;
    return result;
  }

  async function list(actor, { state, page, pageSize }) {
    const values = [actor.id, actor.roles.includes("ADMIN")];
    let stateClause = "";
    if (state) {
      values.push(state);
      stateClause = `AND b.state = $${values.length}`;
    }
    values.push(pageSize, (page - 1) * pageSize);
    const result = await pool.query(
      `${bookingProjection}
       WHERE (b.student_id = $1 OR mp.user_id = $1 OR $2::boolean) ${stateClause}
       ORDER BY b.starts_at DESC, b.id LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values,
    );
    const countValues = values.slice(0, -2);
    const count = await pool.query(
      `SELECT count(*)::int AS total FROM bookings b
       JOIN mentor_profiles mp ON mp.id = b.mentor_id
       WHERE (b.student_id = $1 OR mp.user_id = $1 OR $2::boolean) ${stateClause}`,
      countValues,
    );
    return { items: result.rows.map(bookingDto), pageInfo: { page, pageSize, total: count.rows[0].total } };
  }

  async function create(studentId, input, idempotencyKey, correlationId) {
    return withTransaction(pool, async (client) => {
      const operation = "BOOKING_CREATE";
      const idempotency = await findIdempotentResult(client, {
        actorId: studentId, operation, key: idempotencyKey, input,
      });
      if (idempotency.cached) return idempotency.cached.response_body;

      let jobDescriptionId = input.jobDescriptionId ?? null;
      let correctedTextVersion;
      let planVersion = null;
      let questionIds = [];
      if (input.preparationPlanId) {
        const plan = await client.query(
          `SELECT p.job_description_id, p.version, jd.corrected_version
           FROM preparation_plans p
           JOIN job_descriptions jd ON jd.id = p.job_description_id
           WHERE p.id = $1 AND p.student_id = $2 AND p.status = 'ACTIVE'`,
          [input.preparationPlanId, studentId],
        );
        if (!plan.rowCount) throw notFoundError();
        if (plan.rows[0].version !== input.preparationPlanVersion) {
          throw conflict("VERSION_CONFLICT", "Kế hoạch đã thay đổi. Hãy tải lại trước khi đặt lịch.");
        }
        jobDescriptionId = plan.rows[0].job_description_id;
        correctedTextVersion = plan.rows[0].corrected_version;
        planVersion = plan.rows[0].version;
        const planContext = await client.query(
          `SELECT array_agg(DISTINCT topic_id) FILTER (WHERE topic_id IS NOT NULL) AS topic_ids,
                  array_agg(DISTINCT question_id) FILTER (WHERE question_id IS NOT NULL) AS question_ids
           FROM preparation_plan_items WHERE plan_id = $1`,
          [input.preparationPlanId],
        );
        const planTopicIds = new Set((planContext.rows[0].topic_ids ?? []).map(String));
        if (input.selectedTopicIds.some((topicId) => !planTopicIds.has(topicId))) {
          throw new AppError({ status: 422, code: "BOOKING_TOPIC_NOT_IN_PLAN", message: "Chủ đề đã chọn không còn thuộc kế hoạch. Hãy tải lại.", recovery: { kind: "RETRY_SAFE", retryable: true, retryAfterSeconds: null } });
        }
        questionIds = planContext.rows[0].question_ids ?? [];
      } else {
        const jd = await client.query(
          `SELECT id, corrected_version FROM job_descriptions
           WHERE id = $1 AND student_id = $2 AND status IN ('CONFIRMED','ANALYZED')`,
          [jobDescriptionId, studentId],
        );
        if (!jd.rowCount) throw notFoundError();
        correctedTextVersion = jd.rows[0].corrected_version;
        const topics = await client.query(
          "SELECT id FROM topics WHERE id = ANY($1::uuid[]) AND status = 'ACTIVE'",
          [input.selectedTopicIds],
        );
        if (topics.rowCount !== new Set(input.selectedTopicIds).size) {
          throw new AppError({ status: 422, code: "BOOKING_TOPIC_INVALID", message: "Một số chủ đề không còn hoạt động.", recovery: { kind: "EDIT_INPUT", retryable: false, retryAfterSeconds: null } });
        }
      }

      const expertise = await client.query(
        `SELECT count(DISTINCT topic_id)::int AS overlap
         FROM mentor_expertise WHERE mentor_id = $1 AND status = 'APPROVED'
           AND topic_id = ANY($2::uuid[])`,
        [input.mentorId, input.selectedTopicIds],
      );
      if (!expertise.rows[0].overlap) {
        throw new AppError({
          status: 422,
          code: "MENTOR_EXPERTISE_MISMATCH",
          message: "Mentor này không còn expertise được duyệt phù hợp với chủ đề đã chọn.",
          recovery: { kind: "SELECT_ANOTHER_SLOT", retryable: false, retryAfterSeconds: null },
        });
      }

      const summaries = await client.query(
        `SELECT
           (SELECT raw_text FROM jd_requirements WHERE job_description_id = $1 AND requirement_type = 'ROLE' ORDER BY analysis_version DESC, id LIMIT 1) AS role_summary,
           (SELECT raw_text FROM jd_requirements WHERE job_description_id = $1 AND requirement_type = 'SENIORITY' ORDER BY analysis_version DESC, id LIMIT 1) AS seniority_summary`,
        [jobDescriptionId],
      );

      const slot = await client.query(
        `SELECT s.*, mp.user_id AS mentor_user_id FROM availability_slots s
         JOIN mentor_profiles mp ON mp.id = s.mentor_id
         WHERE s.id = $1 AND s.mentor_id = $2 AND s.status = 'AVAILABLE'
           AND s.starts_at > now() AND mp.verification_status = 'APPROVED'
         FOR UPDATE OF s`,
        [input.slotId, input.mentorId],
      );
      if (!slot.rowCount) throw conflict("BOOKING_SLOT_CONFLICT", "Khung giờ không còn khả dụng.", "SELECT_ANOTHER_SLOT");
      const s = slot.rows[0];
      const inserted = await client.query(
        `INSERT INTO bookings (
           student_id, mentor_id, slot_id, job_description_id, preparation_plan_id,
           goal, interview_type, starts_at, ends_at, source_timezone
         ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
        [studentId, input.mentorId, input.slotId, jobDescriptionId, input.preparationPlanId ?? null,
          input.goal, input.interviewType, s.starts_at, s.ends_at, input.timezone ?? s.source_timezone],
      );
      const booking = inserted.rows[0];
      await client.query(
        `INSERT INTO booking_context_snapshots(
           booking_id, job_description_id, corrected_text_version,
           preparation_plan_id, preparation_plan_version, role_summary, seniority_summary,
           topic_ids, question_ids, goal, interview_type
         ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
        [booking.id, jobDescriptionId, correctedTextVersion, input.preparationPlanId ?? null,
          planVersion, summaries.rows[0].role_summary, summaries.rows[0].seniority_summary,
          input.selectedTopicIds, questionIds, input.goal, input.interviewType],
      );
      await client.query(
        `INSERT INTO booking_transitions (booking_id, from_state, to_state, actor_id, action)
         VALUES ($1, NULL, 'PENDING', $2, 'CREATE')`,
        [booking.id, studentId],
      );
      await enqueueBookingNotification(client, { booking, recipientUserId: s.mentor_user_id, eventType: "BOOKING_REQUESTED" });
      await writeAudit(client, { actorId: studentId, action: "BOOKING_CREATED", targetType: "BOOKING", targetId: booking.id, correlationId });
      const refreshed = await client.query(`${bookingProjection} WHERE b.id = $1`, [booking.id]);
      const body = bookingDto(refreshed.rows[0]);
      await saveIdempotentResult(client, {
        actorId: studentId, operation, key: idempotencyKey, digest: idempotency.digest,
        status: 201, body, resourceId: booking.id,
      });
      return body;
    });
  }

  async function transition(actor, bookingId, input, idempotencyKey, correlationId) {
    return withTransaction(pool, async (client) => {
      const operation = `BOOKING_${input.action}`;
      const idempotency = await findIdempotentResult(client, {
        actorId: actor.id, operation, key: idempotencyKey, input: { bookingId, ...input },
      });
      if (idempotency.cached) return idempotency.cached.response_body;
      const row = await getParticipantRow(client, actor, bookingId, true);
      if (row.version !== input.version) throw conflict("VERSION_CONFLICT", "Lịch đã thay đổi. Hãy tải lại trước khi tiếp tục.");
      if (terminalStates.has(row.state) && input.action !== "REPORT_NO_SHOW") {
        throw conflict("BOOKING_NOT_EDITABLE", "Lịch hẹn đã kết thúc và không thể thay đổi.", "NONE");
      }
      const isStudent = row.student_id === actor.id;
      const isMentor = row.mentor_user_id === actor.id;
      let nextState = row.state;
      let operationCase = null;

      if (input.action === "CONFIRM") {
        if (!isMentor || row.state !== "PENDING") throw notFoundError();
        const locked = await client.query(
          "SELECT status FROM availability_slots WHERE id = $1 FOR UPDATE",
          [row.slot_id],
        );
        if (!locked.rowCount || locked.rows[0].status !== "AVAILABLE") {
          throw conflict("BOOKING_SLOT_CONFLICT", "Khung giờ vừa được người khác xác nhận.", "SELECT_ANOTHER_SLOT");
        }
        await client.query("UPDATE availability_slots SET status = 'BOOKED', version = version + 1 WHERE id = $1", [row.slot_id]);
        nextState = "CONFIRMED";
      } else if (input.action === "REJECT") {
        if (!isMentor || row.state !== "PENDING") throw notFoundError();
        nextState = "REJECTED";
      } else if (input.action === "CANCEL") {
        if (!isStudent && !isMentor) throw notFoundError();
        const hours = (new Date(row.starts_at).getTime() - Date.now()) / 3_600_000;
        if (hours < 12) {
          operationCase = await createOperationCase(client, {
            caseType: "LATE_CHANGE", targetType: "BOOKING", targetId: row.id,
            publicSummary: "Yêu cầu thay đổi sát giờ đang chờ Admin xem xét.",
            restrictedMetadata: { requestedAction: "CANCEL", requestedBy: actor.id, reason: input.reason },
          });
        } else {
          nextState = "CANCELLED";
          if (row.state === "CONFIRMED" || (row.state === "RESCHEDULE_PROPOSED" && row.previous_state === "CONFIRMED")) {
            await client.query("UPDATE availability_slots SET status = 'AVAILABLE', version = version + 1 WHERE id = $1", [row.slot_id]);
          }
          await client.query(
            "UPDATE booking_reschedule_proposals SET status = 'CANCELLED', resolved_at = now(), resolved_by = $2 WHERE booking_id = $1 AND status = 'PENDING'",
            [row.id, actor.id],
          );
        }
      } else if (input.action === "PROPOSE_RESCHEDULE") {
        if ((!isStudent && !isMentor) || !["PENDING", "CONFIRMED"].includes(row.state)) throw notFoundError();
        if (row.reschedule_count >= 2) throw conflict("RESCHEDULE_LIMIT_REACHED", "Lịch này đã dùng hết hai lần đề xuất đổi giờ.", "CONTACT_SUPPORT");
        const hours = (new Date(row.starts_at).getTime() - Date.now()) / 3_600_000;
        if (hours < 12) {
          operationCase = await createOperationCase(client, {
            caseType: "LATE_CHANGE", targetType: "BOOKING", targetId: row.id,
            publicSummary: "Đề xuất đổi lịch sát giờ đang chờ Admin xem xét.",
            restrictedMetadata: { requestedAction: "RESCHEDULE", proposedSlotId: input.proposedSlotId, requestedBy: actor.id, reason: input.reason },
          });
        } else {
          const proposed = await client.query(
            `SELECT id FROM availability_slots WHERE id = $1 AND mentor_id = $2
             AND status = 'AVAILABLE' AND starts_at > now() FOR UPDATE`,
            [input.proposedSlotId, row.mentor_id],
          );
          if (!proposed.rowCount) throw conflict("BOOKING_SLOT_CONFLICT", "Khung giờ đề xuất không còn khả dụng.", "SELECT_ANOTHER_SLOT");
          await client.query("UPDATE booking_reschedule_proposals SET status = 'CANCELLED', resolved_at = now(), resolved_by = $2 WHERE booking_id = $1 AND status = 'PENDING'", [row.id, actor.id]);
          await client.query(
            `INSERT INTO booking_reschedule_proposals (booking_id, proposed_slot_id, proposed_by, reason)
             VALUES ($1, $2, $3, $4)`,
            [row.id, input.proposedSlotId, actor.id, input.reason],
          );
          nextState = "RESCHEDULE_PROPOSED";
        }
      } else if (["ACCEPT_RESCHEDULE", "REJECT_RESCHEDULE"].includes(input.action)) {
        if (row.state !== "RESCHEDULE_PROPOSED") throw notFoundError();
        const proposal = await client.query(
          `SELECT * FROM booking_reschedule_proposals
           WHERE booking_id = $1 AND status = 'PENDING' FOR UPDATE`,
          [row.id],
        );
        if (!proposal.rowCount || proposal.rows[0].proposed_by === actor.id) throw notFoundError();
        if (input.action === "ACCEPT_RESCHEDULE") {
          const proposedSlot = await client.query(
            "SELECT * FROM availability_slots WHERE id = $1 AND status = 'AVAILABLE' FOR UPDATE",
            [proposal.rows[0].proposed_slot_id],
          );
          if (!proposedSlot.rowCount) throw conflict("BOOKING_SLOT_CONFLICT", "Khung giờ đề xuất vừa được người khác chọn.", "SELECT_ANOTHER_SLOT");
          if (row.previous_state === "CONFIRMED") {
            await client.query("UPDATE availability_slots SET status = 'AVAILABLE', version = version + 1 WHERE id = $1", [row.slot_id]);
          }
          await cancelPendingReminders(client, row.id);
          await client.query("UPDATE availability_slots SET status = 'BOOKED', version = version + 1 WHERE id = $1", [proposal.rows[0].proposed_slot_id]);
          await client.query(
            `UPDATE bookings SET slot_id = $2, starts_at = $3, ends_at = $4,
               source_timezone = $5, reschedule_count = reschedule_count + 1,
               schedule_version = schedule_version + 1 WHERE id = $1`,
            [row.id, proposedSlot.rows[0].id, proposedSlot.rows[0].starts_at,
              proposedSlot.rows[0].ends_at, proposedSlot.rows[0].source_timezone],
          );
          nextState = "CONFIRMED";
          await client.query("UPDATE booking_reschedule_proposals SET status = 'ACCEPTED', resolved_at = now(), resolved_by = $2 WHERE id = $1", [proposal.rows[0].id, actor.id]);
        } else {
          nextState = row.previous_state || "PENDING";
          await client.query("UPDATE booking_reschedule_proposals SET status = 'REJECTED', resolved_at = now(), resolved_by = $2 WHERE id = $1", [proposal.rows[0].id, actor.id]);
        }
      } else if (input.action === "COMPLETE") {
        if (!isMentor || row.state !== "CONFIRMED") throw notFoundError();
        if (new Date(row.ends_at) > new Date()) throw conflict("SESSION_NOT_ENDED", "Chỉ có thể hoàn tất sau giờ kết thúc buổi phỏng vấn.", "WAIT");
        nextState = "COMPLETED";
      } else if (input.action === "REPORT_NO_SHOW") {
        if ((!isStudent && !isMentor) || !["CONFIRMED", "COMPLETED"].includes(row.state)) throw notFoundError();
        if (Date.now() < new Date(row.starts_at).getTime() + 15 * 60_000) throw conflict("NO_SHOW_TOO_EARLY", "Vui lòng chờ ít nhất 15 phút sau giờ bắt đầu.", "WAIT");
        operationCase = await createOperationCase(client, {
          caseType: "NO_SHOW", targetType: "BOOKING", targetId: row.id,
          publicSummary: "Báo cáo vắng mặt đang chờ bên còn lại hoặc Admin xác nhận.",
          restrictedMetadata: { reportedBy: actor.id, reason: input.reason },
        });
      } else {
        throw new AppError({ status: 422, code: "INVALID_TRANSITION", message: "Thao tác không hợp lệ cho lịch hẹn này.", recovery: { kind: "NONE", retryable: false, retryAfterSeconds: null } });
      }

      if (nextState !== row.state) {
        await client.query(
          `UPDATE bookings SET previous_state = CASE WHEN $2 = 'RESCHEDULE_PROPOSED' THEN state ELSE previous_state END,
             state = $2, version = version + 1, updated_at = now() WHERE id = $1`,
          [row.id, nextState],
        );
        await client.query(
          `INSERT INTO booking_transitions (booking_id, from_state, to_state, actor_id, action, reason)
           VALUES ($1,$2,$3,$4,$5,$6)`,
          [row.id, row.state, nextState, actor.id, input.action, input.reason ?? null],
        );
      }
      const recipient = isStudent ? row.mentor_user_id : row.student_id;
      if (nextState !== row.state) {
        const actionEventMap = {
          CONFIRM: "BOOKING_CONFIRMED",
          REJECT: "BOOKING_REJECTED",
          CANCEL: "BOOKING_CANCELLED",
          PROPOSE_RESCHEDULE: "BOOKING_RESCHEDULE_PROPOSED",
          ACCEPT_RESCHEDULE: "BOOKING_RESCHEDULE_ACCEPTED",
          REJECT_RESCHEDULE: "BOOKING_RESCHEDULE_REJECTED",
          COMPLETE: "BOOKING_COMPLETED",
        };
        const eventType = actionEventMap[input.action];
        if (eventType) {
          await enqueueBookingNotification(client, { booking: { ...row, version: row.version + 1 }, recipientUserId: recipient, eventType });
        }
      }
      await writeAudit(client, { actorId: actor.id, action: `BOOKING_${input.action}`, targetType: "BOOKING", targetId: row.id, reason: input.reason, correlationId, metadata: operationCase ? { operationCaseId: operationCase.id } : {} });
      const refreshed = await client.query(`${bookingProjection} WHERE b.id = $1`, [row.id]);
      if (nextState === "CONFIRMED" && ["CONFIRM", "ACCEPT_RESCHEDULE"].includes(input.action)) {
        await cancelPendingReminders(client, row.id);
        await scheduleReminders(client, refreshed.rows[0], [row.student_id, row.mentor_user_id], environment.notifications.remindersEnabled);
      } else if (nextState === "CANCELLED") {
        await cancelPendingReminders(client, row.id);
      }
      const body = { ...bookingDto(refreshed.rows[0]), ...(operationCase ? { operationCase } : {}) };
      await saveIdempotentResult(client, { actorId: actor.id, operation, key: idempotencyKey, digest: idempotency.digest, status: operationCase ? 202 : 200, body, resourceId: row.id });
      return body;
    });
  }

  async function saveMeetingLink(actor, bookingId, input, correlationId) {
    return withTransaction(pool, async (client) => {
      const row = await getParticipantRow(client, actor, bookingId, true);
      if (row.mentor_user_id !== actor.id || row.state !== "CONFIRMED") throw notFoundError();
      const replacementWindow = await client.query(
        `SELECT id FROM operation_cases
         WHERE case_type = 'MEETING_LINK_FAILED' AND target_id = $1
           AND status IN ('OPEN', 'IN_PROGRESS')
           AND (restricted_metadata->>'replacementDeadline')::timestamptz > now()
         LIMIT 1`,
        [bookingId],
      );
      if (Date.now() > new Date(row.starts_at).getTime() - 2 * 3_600_000 && !replacementWindow.rowCount) {
        throw conflict("MEETING_LINK_WINDOW_CLOSED", "Link chỉ được tạo hoặc sửa trước buổi hẹn ít nhất 2 giờ.", "CONTACT_SUPPORT");
      }
      const result = await client.query(
        `INSERT INTO meeting_links (booking_id, encrypted_url, url_fingerprint, created_by, updated_by, available_from, expires_at)
         VALUES ($1,$2,$3,$4,$4,now(),$5)
         ON CONFLICT (booking_id) DO UPDATE SET encrypted_url = EXCLUDED.encrypted_url,
           url_fingerprint = EXCLUDED.url_fingerprint, updated_by = EXCLUDED.updated_by,
           failure_reported_at = NULL, recovery_deadline = NULL,
           updated_at = now(), version = meeting_links.version + 1
         WHERE meeting_links.version = $6 RETURNING version`,
        [bookingId, encryptPrivateValue(input.url, environment.sessionSecret), fingerprintPrivateValue(input.url), actor.id,
          new Date(new Date(row.ends_at).getTime() + 24 * 3_600_000), input.version ?? 1],
      );
      if (!result.rowCount) throw conflict("VERSION_CONFLICT", "Link đã được cập nhật. Hãy tải lại trước khi lưu.");
      if (replacementWindow.rowCount) {
        await client.query(
          `UPDATE operation_cases SET status = 'RESOLVED', updated_at = now(), version = version + 1
           WHERE id = $1`,
          [replacementWindow.rows[0].id],
        );
      }
      await writeAudit(client, { actorId: actor.id, action: "MEETING_LINK_SAVED", targetType: "BOOKING", targetId: bookingId, correlationId });
      await enqueueBookingNotification(client, { booking: row, recipientUserId: row.student_id, eventType: "MEETING_LINK_READY" });
      return { bookingId, url: input.url, version: result.rows[0].version };
    });
  }

  async function reportMeetingLinkFailure(actor, bookingId, input, correlationId) {
    return withTransaction(pool, async (client) => {
      const row = await getParticipantRow(client, actor, bookingId, true);
      if (row.state !== "CONFIRMED") throw notFoundError();
      const operationCase = await createOperationCase(client, {
        caseType: "MEETING_LINK_FAILED", targetType: "BOOKING", targetId: row.id,
        publicSummary: "Link phòng họp đang được kiểm tra. Mentor có 15 phút để thay link.",
        restrictedMetadata: { reportedBy: actor.id, reason: input.reason, replacementDeadline: new Date(Date.now() + 15 * 60_000) },
      });
      await client.query(
        `UPDATE meeting_links SET failure_reported_at = now(), recovery_deadline = now() + interval '15 minutes',
           updated_at = now(), version = version + 1 WHERE booking_id = $1`,
        [bookingId],
      );
      await writeAudit(client, { actorId: actor.id, action: "MEETING_LINK_FAILURE_REPORTED", targetType: "BOOKING", targetId: row.id, reason: input.reason, correlationId });
      return { operationCase, recovery: { kind: "WAIT", retryable: false, retryAfterSeconds: 900 } };
    });
  }

  async function startAgendaDraft(actor, bookingId, idempotencyKey, correlationId) {
    return withTransaction(pool, async (client) => {
      const row = await getParticipantRow(client, actor, bookingId, true);
      if (row.mentor_user_id !== actor.id || row.state !== "CONFIRMED") throw notFoundError();
      const input = {
        bookingVersion: row.version,
        roleSummary: row.role_summary,
        senioritySummary: row.seniority_summary,
        topicIds: row.topic_ids ?? [],
        questionIds: row.question_ids ?? [],
        goal: row.goal,
        interviewType: row.interview_type,
      };
      const idempotency = await findIdempotentResult(client, {
        actorId: actor.id,
        operation: "START_AI_AGENDA_DRAFT",
        key: idempotencyKey,
        input: { bookingId, ...input },
      });
      if (idempotency.cached?.response_body) return idempotency.cached.response_body;
      const job = await createAiJob(client, {
        actorId: actor.id,
        kind: "INTERVIEW_AGENDA",
        resourceType: "BOOKING",
        resourceId: bookingId,
        input,
        promptVersion: "interview-agenda-v1",
        schemaVersion: "interview-agenda-schema-v1",
        correlationId,
        environment,
      });
      await saveIdempotentResult(client, {
        actorId: actor.id,
        operation: "START_AI_AGENDA_DRAFT",
        key: idempotencyKey,
        digest: idempotency.digest,
        status: 202,
        body: job,
        resourceId: job.id,
      });
      return job;
    });
  }

  async function getAgendaDraft(actor, bookingId) {
    const booking = await getParticipantRow(pool, actor, bookingId);
    if (booking.mentor_user_id !== actor.id) throw notFoundError();
    const result = await pool.query(
      `SELECT * FROM interview_agenda_drafts
       WHERE booking_id = $1 AND mentor_id = $2 ORDER BY created_at DESC LIMIT 1`,
      [bookingId, booking.mentor_id],
    );
    if (!result.rowCount) throw notFoundError();
    return agendaDraftDto(result.rows[0]);
  }

  async function updateAgendaDraft(actor, bookingId, draftId, input, correlationId) {
    return withTransaction(pool, async (client) => {
      const booking = await getParticipantRow(client, actor, bookingId);
      if (booking.mentor_user_id !== actor.id) throw notFoundError();
      const result = await client.query(
        `UPDATE interview_agenda_drafts SET agenda = $4, status = $5,
           updated_at = now(), version = version + 1
         WHERE id = $1 AND booking_id = $2 AND mentor_id = $3 AND version = $6
         RETURNING *`,
        [draftId, bookingId, booking.mentor_id, input.agenda, input.status, input.version],
      );
      if (!result.rowCount) throw conflict("VERSION_CONFLICT", "Agenda draft đã thay đổi. Hãy tải lại trước khi lưu.");
      await writeAudit(client, {
        actorId: actor.id,
        action: "AI_AGENDA_DRAFT_UPDATED",
        targetType: "BOOKING",
        targetId: bookingId,
        correlationId,
        metadata: { draftId, status: input.status },
      });
      return agendaDraftDto(result.rows[0]);
    });
  }

  async function startFeedbackDraft(actor, bookingId, input, idempotencyKey, correlationId) {
    return withTransaction(pool, async (client) => {
      const row = await getParticipantRow(client, actor, bookingId, true);
      if (row.mentor_user_id !== actor.id || row.state !== "COMPLETED") throw notFoundError();
      const existingFeedback = await client.query("SELECT 1 FROM feedback WHERE booking_id = $1", [bookingId]);
      if (existingFeedback.rowCount) throw conflict("FEEDBACK_ALREADY_EXISTS", "Lịch hẹn này đã có feedback.", "NONE");
      const jobInput = { bookingVersion: row.version, sessionNotes: input.sessionNotes };
      const idempotency = await findIdempotentResult(client, {
        actorId: actor.id,
        operation: "START_AI_FEEDBACK_DRAFT",
        key: idempotencyKey,
        input: { bookingId, ...jobInput },
      });
      if (idempotency.cached?.response_body) return idempotency.cached.response_body;
      const job = await createAiJob(client, {
        actorId: actor.id,
        kind: "FEEDBACK_DRAFT",
        resourceType: "BOOKING",
        resourceId: bookingId,
        input: jobInput,
        promptVersion: "feedback-draft-v1",
        schemaVersion: "feedback-draft-schema-v1",
        correlationId,
        environment,
      });
      await client.query(
        `INSERT INTO ai_job_private_inputs(job_id, encrypted_payload)
         VALUES ($1,$2) ON CONFLICT (job_id) DO UPDATE SET
           encrypted_payload = EXCLUDED.encrypted_payload, expires_at = now() + interval '24 hours'`,
        [job.id, encryptPrivateValue(JSON.stringify({ sessionNotes: input.sessionNotes }), environment.sessionSecret)],
      );
      await saveIdempotentResult(client, {
        actorId: actor.id,
        operation: "START_AI_FEEDBACK_DRAFT",
        key: idempotencyKey,
        digest: idempotency.digest,
        status: 202,
        body: job,
        resourceId: job.id,
      });
      return job;
    });
  }

  async function getFeedbackDraft(actor, bookingId) {
    const booking = await getParticipantRow(pool, actor, bookingId);
    if (booking.mentor_user_id !== actor.id) throw notFoundError();
    const result = await pool.query(
      `SELECT * FROM feedback_drafts
       WHERE booking_id = $1 AND mentor_id = $2 ORDER BY created_at DESC LIMIT 1`,
      [bookingId, booking.mentor_id],
    );
    if (!result.rowCount) throw notFoundError();
    return feedbackDraftDto(result.rows[0]);
  }

  async function updateFeedbackDraft(actor, bookingId, draftId, input, correlationId) {
    return withTransaction(pool, async (client) => {
      const booking = await getParticipantRow(client, actor, bookingId);
      if (booking.mentor_user_id !== actor.id) throw notFoundError();
      const result = await client.query(
        `UPDATE feedback_drafts SET rubric_scores = $4, strengths = $5, weaknesses = $6,
           next_actions = $7, status = $8, updated_at = now(), version = version + 1
         WHERE id = $1 AND booking_id = $2 AND mentor_id = $3 AND version = $9
         RETURNING *`,
        [draftId, bookingId, booking.mentor_id, input.rubricScores, input.strengths,
          input.weaknesses, input.nextActions, input.status, input.version],
      );
      if (!result.rowCount) throw conflict("VERSION_CONFLICT", "Feedback draft đã thay đổi. Hãy tải lại trước khi lưu.");
      await writeAudit(client, {
        actorId: actor.id,
        action: "AI_FEEDBACK_DRAFT_UPDATED",
        targetType: "BOOKING",
        targetId: bookingId,
        correlationId,
        metadata: { draftId, status: input.status },
      });
      return feedbackDraftDto(result.rows[0]);
    });
  }

  async function createFeedback(actor, bookingId, input, correlationId) {
    return withTransaction(pool, async (client) => {
      const row = await getParticipantRow(client, actor, bookingId, true);
      if (row.mentor_user_id !== actor.id || row.state !== "COMPLETED") throw notFoundError();
      if (input.draftId) {
        const draft = await client.query(
          `SELECT id FROM feedback_drafts WHERE id = $1 AND booking_id = $2 AND mentor_id = $3
           AND status IN ('DRAFT','USED') FOR UPDATE`,
          [input.draftId, bookingId, row.mentor_id],
        );
        if (!draft.rowCount) throw notFoundError();
      }
      const context = await client.query(
        "SELECT topic_ids, question_ids FROM booking_context_snapshots WHERE booking_id = $1",
        [bookingId],
      );
      const allowedTopics = new Set((context.rows[0]?.topic_ids ?? []).map(String));
      const allowedQuestions = new Set((context.rows[0]?.question_ids ?? []).map(String));
      if (input.nextActions.some((action) => (action.topicId && !allowedTopics.has(action.topicId))
        || (action.questionId && !allowedQuestions.has(action.questionId)))) {
        throw new AppError({ status: 422, code: "FEEDBACK_REFERENCE_INVALID", message: "Next action chỉ được tham chiếu topic/question trong booking context.", recovery: { kind: "EDIT_INPUT", retryable: false, retryAfterSeconds: null } });
      }
      const result = await client.query(
        `INSERT INTO feedback (booking_id, mentor_id, rubric_scores, strengths, weaknesses, next_actions)
         VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT (booking_id) DO NOTHING RETURNING *`,
        [bookingId, row.mentor_id, input.rubricScores, input.strengths, input.weaknesses,
          JSON.stringify(input.nextActions.map((action) => action.description))],
      );
      if (!result.rowCount) throw conflict("FEEDBACK_ALREADY_EXISTS", "Lịch hẹn này đã có feedback.", "NONE");
      const actions = [];
      for (const action of input.nextActions) {
        const inserted = await client.query(
          `INSERT INTO feedback_actions(feedback_id, description, topic_id, question_id)
           VALUES ($1,$2,$3,$4)
           RETURNING id, description, topic_id AS "topicId", question_id AS "questionId", created_at AS "createdAt"`,
          [result.rows[0].id, action.description, action.topicId ?? null, action.questionId ?? null],
        );
        actions.push({ ...inserted.rows[0], applied: false });
      }
      if (input.draftId) {
        await client.query(
          "UPDATE feedback_drafts SET status = 'USED', updated_at = now(), version = version + 1 WHERE id = $1",
          [input.draftId],
        );
      }
      await enqueueBookingNotification(client, { booking: row, recipientUserId: row.student_id, eventType: "FEEDBACK_READY" });
      await writeAudit(client, { actorId: actor.id, action: "FEEDBACK_CREATED", targetType: "BOOKING", targetId: bookingId, correlationId });
      return {
        id: result.rows[0].id,
        bookingId,
        rubricScores: result.rows[0].rubric_scores,
        strengths: result.rows[0].strengths,
        weaknesses: result.rows[0].weaknesses,
        actions,
        createdAt: result.rows[0].created_at,
        version: result.rows[0].version,
      };
    });
  }

  async function getFeedback(actor, bookingId) {
    await getParticipantRow(pool, actor, bookingId);
    const result = await pool.query(
      `SELECT id, booking_id AS "bookingId", rubric_scores AS "rubricScores", strengths,
              weaknesses, next_actions AS "nextActions", created_at AS "createdAt", version
       FROM feedback WHERE booking_id = $1`,
      [bookingId],
    );
    if (!result.rowCount) throw notFoundError();
    const actions = await pool.query(
      `SELECT fa.id, fa.description, fa.topic_id AS "topicId", fa.question_id AS "questionId",
              fa.created_at AS "createdAt", EXISTS (
                SELECT 1 FROM feedback_action_applications faa
                WHERE faa.feedback_action_id = fa.id AND faa.student_id = $2
              ) AS applied
       FROM feedback_actions fa WHERE fa.feedback_id = $1 ORDER BY fa.created_at, fa.id`,
      [result.rows[0].id, actor.id],
    );
    return { ...result.rows[0], actions: actions.rows };
  }

  async function applyFeedback(actor, bookingId, input, correlationId) {
    return withTransaction(pool, async (client) => {
      const row = await getParticipantRow(client, actor, bookingId, true);
      if (row.student_id !== actor.id || !row.preparation_plan_id) throw notFoundError();
      const actions = await client.query(
        `SELECT fa.* FROM feedback_actions fa JOIN feedback f ON f.id = fa.feedback_id
         WHERE f.booking_id = $1 AND fa.id = ANY($2::uuid[]) FOR UPDATE OF fa`,
        [bookingId, input.actionIds],
      );
      if (actions.rowCount !== new Set(input.actionIds).size) throw conflict("FEEDBACK_ACTION_CHANGED", "Feedback đã thay đổi. Hãy tải lại.");
      const appliedActionIds = [];
      const skippedActionIds = [];
      for (const action of actions.rows) {
        const existing = await client.query(
          `SELECT 1 FROM feedback_action_applications
           WHERE feedback_action_id = $1 AND student_id = $2 AND preparation_plan_id = $3`,
          [action.id, actor.id, row.preparation_plan_id],
        );
        if (existing.rowCount) {
          skippedActionIds.push(action.id);
          continue;
        }
        const item = await client.query(
          `INSERT INTO preparation_plan_items(plan_id, topic_id, question_id, priority, mentor_next_action)
           VALUES ($1,$2,$3,'SHOULD',$4) RETURNING id`,
          [row.preparation_plan_id, action.topic_id, action.question_id, action.description],
        );
        await client.query(
          `INSERT INTO feedback_action_applications(
             feedback_action_id, student_id, preparation_plan_id, preparation_plan_item_id
           ) VALUES ($1,$2,$3,$4)`,
          [action.id, actor.id, row.preparation_plan_id, item.rows[0].id],
        );
        appliedActionIds.push(action.id);
      }
      if (appliedActionIds.length) {
        await client.query("UPDATE preparation_plans SET updated_at = now(), version = version + 1 WHERE id = $1", [row.preparation_plan_id]);
      }
      await writeAudit(client, { actorId: actor.id, action: "FEEDBACK_APPLIED_TO_PLAN", targetType: "PREPARATION_PLAN", targetId: row.preparation_plan_id, correlationId, metadata: { appliedActionIds, skippedActionIds } });
      return { planId: row.preparation_plan_id, appliedActionIds, skippedActionIds };
    });
  }

  async function createCompletionDispute(actor, bookingId, input, correlationId) {
    return withTransaction(pool, async (client) => {
      const row = await getParticipantRow(client, actor, bookingId, true);
      if (row.student_id !== actor.id || row.state !== "COMPLETED") throw notFoundError();
      const completion = await client.query(
        `SELECT occurred_at FROM booking_transitions
         WHERE booking_id = $1 AND to_state = 'COMPLETED' ORDER BY occurred_at DESC LIMIT 1`,
        [bookingId],
      );
      if (!completion.rowCount || Date.now() > new Date(completion.rows[0].occurred_at).getTime() + 24 * 3_600_000) {
        throw conflict("DISPUTE_WINDOW_CLOSED", "Thời hạn gửi dispute 24 giờ đã kết thúc.", "CONTACT_SUPPORT");
      }
      const dispute = await client.query(
        `INSERT INTO completion_disputes(booking_id, student_id, reason, evidence_metadata)
         VALUES ($1,$2,$3,$4) ON CONFLICT (booking_id) DO NOTHING
         RETURNING id, status, created_at AS "createdAt", version`,
        [bookingId, actor.id, input.reason, input.evidenceMetadata],
      );
      if (!dispute.rowCount) throw conflict("DISPUTE_ALREADY_EXISTS", "Booking này đã có dispute.", "NONE");
      const report = await client.query(
        `INSERT INTO reports(reporter_id, target_type, target_id, reason_code, description)
         VALUES ($1,'BOOKING',$2,'COMPLETION_DISPUTE',$3) RETURNING id`,
        [actor.id, bookingId, input.reason],
      );
      const operationCase = await createOperationCase(client, {
        caseType: "COMPLETION_DISPUTE",
        targetType: "BOOKING",
        targetId: bookingId,
        publicSummary: "Kết quả hoàn thành đang được Admin xem xét.",
        restrictedMetadata: { disputeId: dispute.rows[0].id, reportId: report.rows[0].id },
      });
      await client.query(
        "UPDATE reviews SET moderation_status = 'DISPUTED', version = version + 1 WHERE booking_id = $1",
        [bookingId],
      );
      await writeAudit(client, { actorId: actor.id, action: "COMPLETION_DISPUTED", targetType: "BOOKING", targetId: bookingId, reason: input.reason, correlationId, metadata: { disputeId: dispute.rows[0].id, operationCaseId: operationCase.id } });
      return { ...dispute.rows[0], reportId: report.rows[0].id, operationCase };
    });
  }

  async function resolveParticipantCase(actor, bookingId, caseId, input, idempotencyKey, correlationId) {
    return withTransaction(pool, async (client) => {
      const operation = `PARTICIPANT_CASE_${input.action}`;
      const idempotency = await findIdempotentResult(client, { actorId: actor.id, operation, key: idempotencyKey, input: { bookingId, caseId, ...input } });
      if (idempotency.cached) return idempotency.cached.response_body;
      const booking = await getParticipantRow(client, actor, bookingId, true);
      const selected = await client.query(
        `SELECT * FROM operation_cases WHERE id = $1 AND target_id = $2
           AND case_type IN ('LATE_CHANGE','NO_SHOW') AND status IN ('OPEN','IN_PROGRESS')
         FOR UPDATE`,
        [caseId, bookingId],
      );
      if (!selected.rowCount) throw notFoundError();
      const operationCase = selected.rows[0];
      if (operationCase.version !== input.version) throw conflict("VERSION_CONFLICT", "Case đã thay đổi. Hãy tải lại.");
      const requestedBy = operationCase.restricted_metadata?.requestedBy
        ?? operationCase.restricted_metadata?.reportedBy;
      if (!requestedBy || requestedBy === actor.id) throw notFoundError();
      if (input.action === "APPROVE" && operationCase.case_type === "NO_SHOW") {
        await client.query("UPDATE bookings SET state = 'NO_SHOW', version = version + 1, updated_at = now() WHERE id = $1", [bookingId]);
        await client.query(
          `INSERT INTO booking_transitions(booking_id, from_state, to_state, actor_id, action, reason)
           VALUES ($1,$2,'NO_SHOW',$3,'PARTICIPANT_CONFIRM_NO_SHOW',$4)`,
          [bookingId, booking.state, actor.id, input.reason],
        );
        await cancelPendingReminders(client, bookingId);
      } else if (input.action === "APPROVE" && operationCase.restricted_metadata?.requestedAction === "CANCEL") {
        if (booking.state === "CONFIRMED" || booking.previous_state === "CONFIRMED") {
          await client.query("UPDATE availability_slots SET status = 'AVAILABLE', version = version + 1 WHERE id = $1", [booking.slot_id]);
        }
        await client.query("UPDATE bookings SET state = 'CANCELLED', version = version + 1, updated_at = now() WHERE id = $1", [bookingId]);
        await client.query(
          `INSERT INTO booking_transitions(booking_id, from_state, to_state, actor_id, action, reason)
           VALUES ($1,$2,'CANCELLED',$3,'PARTICIPANT_APPROVE_LATE_CANCEL',$4)`,
          [bookingId, booking.state, actor.id, input.reason],
        );
        await cancelPendingReminders(client, bookingId);
        await enqueueBookingNotification(client, {
          booking: { id: bookingId, version: booking.version + 1 },
          recipientUserId: requestedBy,
          eventType: "BOOKING_CANCELLED",
        });
      } else if (input.action === "APPROVE" && operationCase.restricted_metadata?.requestedAction === "RESCHEDULE") {
        const proposedSlotId = operationCase.restricted_metadata.proposedSlotId;
        const proposed = await client.query(
          "SELECT * FROM availability_slots WHERE id = $1 AND mentor_id = $2 AND status = 'AVAILABLE' FOR UPDATE",
          [proposedSlotId, booking.mentor_id],
        );
        if (!proposed.rowCount) throw conflict("BOOKING_SLOT_CONFLICT", "Slot đề xuất không còn khả dụng.", "SELECT_ANOTHER_SLOT");
        if (booking.state === "CONFIRMED" || booking.previous_state === "CONFIRMED") await client.query("UPDATE availability_slots SET status = 'AVAILABLE', version = version + 1 WHERE id = $1", [booking.slot_id]);
        await client.query("UPDATE availability_slots SET status = 'BOOKED', version = version + 1 WHERE id = $1", [proposedSlotId]);
        await cancelPendingReminders(client, bookingId);
        const changed = await client.query(
          `UPDATE bookings SET slot_id = $2, starts_at = $3, ends_at = $4, source_timezone = $5,
             state = 'CONFIRMED', reschedule_count = reschedule_count + 1,
             schedule_version = schedule_version + 1, version = version + 1, updated_at = now()
           WHERE id = $1 RETURNING *`,
          [bookingId, proposedSlotId, proposed.rows[0].starts_at, proposed.rows[0].ends_at, proposed.rows[0].source_timezone],
        );
        await scheduleReminders(client, changed.rows[0], [booking.student_id, booking.mentor_user_id], environment.notifications.remindersEnabled);
        await client.query(
          `INSERT INTO booking_transitions(booking_id, from_state, to_state, actor_id, action, reason)
           VALUES ($1,$2,'CONFIRMED',$3,'PARTICIPANT_APPROVE_LATE_RESCHEDULE',$4)`,
          [bookingId, booking.state, actor.id, input.reason],
        );
        await enqueueBookingNotification(client, {
          booking: changed.rows[0],
          recipientUserId: requestedBy,
          eventType: "BOOKING_RESCHEDULE_ACCEPTED",
        });
      }
      const status = input.action === "APPROVE" ? "RESOLVED" : "DISMISSED";
      const resolved = await client.query(
        `UPDATE operation_cases SET status = $2, version = version + 1, updated_at = now()
         WHERE id = $1 RETURNING id, status, version, public_summary AS summary`,
        [caseId, status],
      );
      await writeAudit(client, { actorId: actor.id, action: `PARTICIPANT_CASE_${input.action}`, targetType: "OPERATION_CASE", targetId: caseId, reason: input.reason, correlationId });
      const body = resolved.rows[0];
      await saveIdempotentResult(client, { actorId: actor.id, operation, key: idempotencyKey, digest: idempotency.digest, status: 200, body, resourceId: caseId });
      return body;
    });
  }

  async function createReview(actor, bookingId, input, correlationId) {
    return withTransaction(pool, async (client) => {
      const row = await getParticipantRow(client, actor, bookingId, true);
      if (row.student_id !== actor.id || row.state !== "COMPLETED") throw notFoundError();
      const dispute = await client.query("SELECT 1 FROM completion_disputes WHERE booking_id = $1", [bookingId]);
      if (dispute.rowCount) throw conflict("REVIEW_BLOCKED_BY_DISPUTE", "Review sẽ mở lại sau khi dispute được xử lý.", "WAIT");
      const result = await client.query(
        `INSERT INTO reviews (booking_id, student_id, rating, comment, publish_after)
         VALUES ($1,$2,$3,$4,now() + interval '24 hours')
         ON CONFLICT (booking_id) DO NOTHING RETURNING id, rating, comment, moderation_status, publish_after, version`,
        [bookingId, actor.id, input.rating, input.comment ?? null],
      );
      if (!result.rowCount) throw conflict("REVIEW_ALREADY_EXISTS", "Lịch hẹn này đã có review.", "NONE");
      await writeAudit(client, { actorId: actor.id, action: "REVIEW_CREATED", targetType: "REVIEW", targetId: result.rows[0].id, correlationId });
      return result.rows[0];
    });
  }

  return {
    list, get, create, transition, saveMeetingLink, reportMeetingLinkFailure,
    startAgendaDraft, getAgendaDraft, updateAgendaDraft,
    startFeedbackDraft, getFeedbackDraft, updateFeedbackDraft,
    createFeedback, getFeedback, applyFeedback, createCompletionDispute,
    resolveParticipantCase, createReview,
  };
}
