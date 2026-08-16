import { AppError, notFoundError } from "../../shared/errors.js";
import { withTransaction } from "../../platform/db/transaction.js";
import { writeAudit } from "../../platform/audit.js";
import { createOperationCase } from "../../platform/operations.js";
import { createInAppNotification, enqueueNotification } from "../../platform/outbox.js";
import { findIdempotentResult, saveIdempotentResult } from "../../platform/idempotency.js";
import { decryptPrivateValue, encryptPrivateValue, fingerprintPrivateValue } from "../../platform/security/encryption.js";

const terminalStates = new Set(["REJECTED", "CANCELLED", "COMPLETED", "NO_SHOW"]);

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
    version: row.version,
    createdAt: row.created_at,
  };
}

const bookingProjection = `
  SELECT b.*, su.display_name AS student_name, mu.display_name AS mentor_name,
    mp.user_id AS mentor_user_id,
    jtv.corrected_text,
    coalesce((SELECT array_agg(DISTINCT t.name ORDER BY t.name)
      FROM preparation_plan_items ppi JOIN topics t ON t.id = ppi.topic_id
      WHERE ppi.plan_id = b.preparation_plan_id), '{}') AS topic_names
  FROM bookings b
  JOIN users su ON su.id = b.student_id
  JOIN mentor_profiles mp ON mp.id = b.mentor_id
  JOIN users mu ON mu.id = mp.user_id
  LEFT JOIN job_descriptions jd ON jd.id = coalesce(b.job_description_id,
    (SELECT pp.job_description_id FROM preparation_plans pp WHERE pp.id = b.preparation_plan_id))
  LEFT JOIN jd_text_versions jtv ON jtv.job_description_id = jd.id AND jtv.version = jd.corrected_version
`;

async function notify(client, booking, recipientUserId, eventType, title, body) {
  await createInAppNotification(client, {
    userId: recipientUserId,
    eventType,
    title,
    body,
    resourceType: "BOOKING",
    resourceId: booking.id,
  });
  await enqueueNotification(client, {
    eventType,
    aggregateType: "BOOKING",
    aggregateId: booking.id,
    recipientUserId,
    payload: { bookingId: booking.id },
    deduplicationKey: `${eventType}:${booking.id}:${booking.version}:${recipientUserId}`,
  });
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
           AND $2 = 'CONFIRMED'`,
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
      if (input.preparationPlanId) {
        const plan = await client.query(
          `SELECT job_description_id FROM preparation_plans
           WHERE id = $1 AND student_id = $2 AND status = 'ACTIVE'`,
          [input.preparationPlanId, studentId],
        );
        if (!plan.rowCount) throw notFoundError();
        jobDescriptionId = plan.rows[0].job_description_id;
      } else {
        const jd = await client.query(
          "SELECT id FROM job_descriptions WHERE id = $1 AND student_id = $2 AND status = 'CONFIRMED'",
          [jobDescriptionId, studentId],
        );
        if (!jd.rowCount) throw notFoundError();
      }

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
        `INSERT INTO booking_transitions (booking_id, from_state, to_state, actor_id, action)
         VALUES ($1, NULL, 'PENDING', $2, 'CREATE')`,
        [booking.id, studentId],
      );
      await notify(client, booking, s.mentor_user_id, "BOOKING_REQUESTED", "Có yêu cầu đặt lịch mới", "Một học viên đang chờ bạn xác nhận lịch.");
      await writeAudit(client, { actorId: studentId, action: "BOOKING_CREATED", targetType: "BOOKING", targetId: booking.id, correlationId });
      const body = bookingDto(booking);
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
          if (row.state === "CONFIRMED") {
            await client.query("UPDATE availability_slots SET status = 'AVAILABLE', version = version + 1 WHERE id = $1", [row.slot_id]);
          }
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
          await client.query("UPDATE availability_slots SET status = 'BOOKED', version = version + 1 WHERE id = $1", [proposal.rows[0].proposed_slot_id]);
          await client.query(
            `UPDATE bookings SET slot_id = $2, starts_at = $3, ends_at = $4,
               source_timezone = $5, reschedule_count = reschedule_count + 1 WHERE id = $1`,
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
      if (nextState !== row.state) await notify(client, { ...row, version: row.version + 1 }, recipient, `BOOKING_${nextState}`, "Lịch phỏng vấn đã cập nhật", `Trạng thái mới: ${nextState}.`);
      await writeAudit(client, { actorId: actor.id, action: `BOOKING_${input.action}`, targetType: "BOOKING", targetId: row.id, reason: input.reason, correlationId, metadata: operationCase ? { operationCaseId: operationCase.id } : {} });
      const refreshed = await client.query(`${bookingProjection} WHERE b.id = $1`, [row.id]);
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
      await notify(client, row, row.student_id, "MEETING_LINK_READY", "Link phòng phỏng vấn đã sẵn sàng", "Mở chi tiết lịch để tham gia đúng giờ.");
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
      await writeAudit(client, { actorId: actor.id, action: "MEETING_LINK_FAILURE_REPORTED", targetType: "BOOKING", targetId: row.id, reason: input.reason, correlationId });
      return { operationCase, recovery: { kind: "WAIT", retryable: false, retryAfterSeconds: 900 } };
    });
  }

  async function createFeedback(actor, bookingId, input, correlationId) {
    return withTransaction(pool, async (client) => {
      const row = await getParticipantRow(client, actor, bookingId, true);
      if (row.mentor_user_id !== actor.id || row.state !== "COMPLETED") throw notFoundError();
      const result = await client.query(
        `INSERT INTO feedback (booking_id, mentor_id, rubric_scores, strengths, weaknesses, next_actions)
         VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT (booking_id) DO NOTHING RETURNING *`,
        [bookingId, row.mentor_id, input.rubricScores, input.strengths, input.weaknesses, input.nextActions],
      );
      if (!result.rowCount) throw conflict("FEEDBACK_ALREADY_EXISTS", "Lịch hẹn này đã có feedback.", "NONE");
      await notify(client, row, row.student_id, "FEEDBACK_READY", "Mentor đã gửi feedback", "Mở lịch hẹn để xem nhận xét và bước tiếp theo.");
      await writeAudit(client, { actorId: actor.id, action: "FEEDBACK_CREATED", targetType: "BOOKING", targetId: bookingId, correlationId });
      return result.rows[0];
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
    return result.rows[0];
  }

  async function applyFeedback(actor, bookingId, input, correlationId) {
    return withTransaction(pool, async (client) => {
      const row = await getParticipantRow(client, actor, bookingId, true);
      if (row.student_id !== actor.id || !row.preparation_plan_id) throw notFoundError();
      const feedback = await client.query("SELECT next_actions FROM feedback WHERE booking_id = $1", [bookingId]);
      if (!feedback.rowCount) throw notFoundError();
      const allowed = new Set(feedback.rows[0].next_actions);
      if (input.actions.some((action) => !allowed.has(action))) throw conflict("FEEDBACK_ACTION_CHANGED", "Feedback đã thay đổi. Hãy tải lại.");
      for (const action of input.actions) {
        await client.query(
          `INSERT INTO preparation_plan_items (plan_id, priority, mentor_next_action)
           VALUES ($1, 'SHOULD', $2)`,
          [row.preparation_plan_id, action],
        );
      }
      await writeAudit(client, { actorId: actor.id, action: "FEEDBACK_APPLIED_TO_PLAN", targetType: "PREPARATION_PLAN", targetId: row.preparation_plan_id, correlationId, metadata: { count: input.actions.length } });
      return { planId: row.preparation_plan_id, appliedActions: input.actions };
    });
  }

  async function createReview(actor, bookingId, input, correlationId) {
    return withTransaction(pool, async (client) => {
      const row = await getParticipantRow(client, actor, bookingId, true);
      if (row.student_id !== actor.id || row.state !== "COMPLETED") throw notFoundError();
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

  return { list, get, create, transition, saveMeetingLink, reportMeetingLinkFailure, createFeedback, getFeedback, applyFeedback, createReview };
}
