import { fileTypeFromBuffer } from "file-type";
import { createHmac, timingSafeEqual } from "node:crypto";
import { AppError, notFoundError } from "../../shared/errors.js";
import { withTransaction } from "../../platform/db/transaction.js";
import { writeAudit } from "../../platform/audit.js";
import { createOperationCase } from "../../platform/operations.js";

const verificationTypes = new Set(["application/pdf", "image/png", "image/jpeg"]);

function profileDto(row) {
  return {
    id: row.id,
    userId: row.user_id,
    displayName: row.display_name,
    headline: row.headline,
    bio: row.bio,
    timezone: row.timezone,
    verificationStatus: row.verification_status,
    publicRating: row.public_rating,
    expertise: row.expertise ?? [],
    positionExpertise: row.position_expertise ?? [],
    topicIds: row.topic_ids ?? [],
    positionIds: row.position_ids ?? [],
    nextSlots: row.next_slots ?? [],
    reviews: row.reviews ?? [],
    version: row.version,
  };
}

export function createMentorsService({ pool, storage, environment }) {
  function evidenceSignature(verificationId, expires) {
    return createHmac("sha256", environment.sessionSecret)
      .update(`${verificationId}:${expires}`)
      .digest("hex");
  }

  function createEvidenceAccess(verificationId) {
    const expires = Math.floor(Date.now() / 1000) + 5 * 60;
    const signature = evidenceSignature(verificationId, expires);
    return {
      url: `/api/v1/admin/mentor-verifications/${verificationId}/evidence?expires=${expires}&signature=${signature}`,
      expiresAt: new Date(expires * 1000).toISOString(),
    };
  }

  function verifyEvidenceAccess(verificationId, { expires, signature }) {
    const expected = evidenceSignature(verificationId, expires);
    const signatureBuffer = Buffer.from(signature, "hex");
    const expectedBuffer = Buffer.from(expected, "hex");
    if (expires < Math.floor(Date.now() / 1000)
      || signatureBuffer.length !== expectedBuffer.length
      || !timingSafeEqual(signatureBuffer, expectedBuffer)) {
      throw notFoundError();
    }
  }

  async function ensureProfile(userId, input, client = pool) {
    const result = await client.query(
      `INSERT INTO mentor_profiles (user_id, headline, bio, timezone)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id) DO UPDATE SET
         headline = EXCLUDED.headline, bio = EXCLUDED.bio, timezone = EXCLUDED.timezone,
         updated_at = now(), version = mentor_profiles.version + 1
       RETURNING *`,
      [userId, input.headline, input.bio, input.timezone],
    );
    await client.query(
      "INSERT INTO user_roles (user_id, role_code) VALUES ($1, 'MENTOR') ON CONFLICT DO NOTHING",
      [userId],
    );
    return result.rows[0];
  }

  async function saveProfile(userId, input) {
    return withTransaction(pool, async (client) => {
      const profile = await ensureProfile(userId, input, client);
      if (input.topicIds || input.positionIds) {
        await client.query("DELETE FROM mentor_expertise WHERE mentor_id = $1", [profile.id]);
        for (const topicId of input.topicIds ?? []) {
          await client.query(
            `INSERT INTO mentor_expertise (mentor_id, topic_id, evidence_note, status)
             VALUES ($1, $2, $3, 'PENDING')`,
            [profile.id, topicId, input.expertiseEvidence ?? null],
          );
        }
        for (const positionId of input.positionIds ?? []) {
          await client.query(
            `INSERT INTO mentor_expertise (mentor_id, position_id, evidence_note, status)
             VALUES ($1, $2, $3, 'PENDING')`,
            [profile.id, positionId, input.expertiseEvidence ?? null],
          );
        }
      }
      return profileDto({
        ...profile,
        display_name: null,
        expertise: [],
        position_expertise: [],
        topic_ids: input.topicIds ?? [],
        position_ids: input.positionIds ?? [],
        next_slots: [],
      });
    });
  }

  async function submitVerification(userId, input, file, correlationId) {
    if (!file?.buffer?.length || file.size > 10 * 1024 * 1024) {
      throw new AppError({
        status: 422,
        code: "INVALID_VERIFICATION_EVIDENCE",
        message: "Bằng chứng xác minh phải là một tệp hợp lệ không quá 10 MB.",
        recovery: { kind: "REUPLOAD", retryable: false, retryAfterSeconds: null },
      });
    }
    const detected = await fileTypeFromBuffer(file.buffer);
    if (!verificationTypes.has(detected?.mime)) {
      throw new AppError({
        status: 415,
        code: "UNSUPPORTED_DOCUMENT",
        message: "Bằng chứng xác minh chỉ hỗ trợ PDF, PNG hoặc JPEG.",
        recovery: { kind: "REUPLOAD", retryable: false, retryAfterSeconds: null },
      });
    }
    const key = await storage.put(file.buffer, { contentType: detected.mime });
    try {
      return await withTransaction(pool, async (client) => {
        const profile = await ensureProfile(userId, input, client);
        const result = await client.query(
          `INSERT INTO mentor_verifications (
             mentor_id, evidence_ref, evidence_mime_type, evidence_size_bytes, consented_at
           ) VALUES ($1, $2, $3, $4, now())
           RETURNING id, status, created_at, version`,
          [profile.id, key, detected.mime, file.size],
        );
        await client.query(
          "UPDATE mentor_profiles SET verification_status = 'PENDING', updated_at = now(), version = version + 1 WHERE id = $1",
          [profile.id],
        );
        await createOperationCase(client, {
          caseType: "MENTOR_VERIFICATION",
          targetType: "MENTOR",
          targetId: profile.id,
          publicSummary: "Hồ sơ mentor đang chờ xét duyệt.",
        });
        await writeAudit(client, {
          actorId: userId,
          action: "MENTOR_VERIFICATION_SUBMITTED",
          targetType: "MENTOR",
          targetId: profile.id,
          correlationId,
        });
        return { mentorId: profile.id, ...result.rows[0] };
      });
    } catch (error) {
      await storage.delete(key);
      throw error;
    }
  }

  async function getOwnProfile(userId) {
    const result = await pool.query(
      `SELECT mp.*, u.display_name,
        coalesce(array_agg(DISTINCT t.name) FILTER (WHERE t.id IS NOT NULL), '{}') AS expertise,
        coalesce(array_agg(DISTINCT p.name) FILTER (WHERE p.id IS NOT NULL), '{}') AS position_expertise,
        coalesce(array_agg(DISTINCT t.id) FILTER (WHERE t.id IS NOT NULL), '{}') AS topic_ids,
        coalesce(array_agg(DISTINCT p.id) FILTER (WHERE p.id IS NOT NULL), '{}') AS position_ids,
        '[]'::jsonb AS next_slots
       FROM mentor_profiles mp JOIN users u ON u.id = mp.user_id
       LEFT JOIN mentor_expertise me ON me.mentor_id = mp.id
       LEFT JOIN topics t ON t.id = me.topic_id
       LEFT JOIN positions p ON p.id = me.position_id
       WHERE mp.user_id = $1 GROUP BY mp.id, u.display_name`,
      [userId],
    );
    if (!result.rowCount) throw notFoundError();
    return profileDto(result.rows[0]);
  }

  async function listPublic({ topic, availableFrom, page, pageSize }) {
    const values = [];
    const clauses = ["mp.verification_status = 'APPROVED'"];
    if (topic) {
      values.push(topic);
      clauses.push(`EXISTS (
        SELECT 1 FROM mentor_expertise mex JOIN topics tx ON tx.id = mex.topic_id
        WHERE mex.mentor_id = mp.id AND mex.status = 'APPROVED'
          AND (tx.slug = $${values.length} OR lower(tx.name) = lower($${values.length}))
      )`);
    }
    if (availableFrom) {
      values.push(availableFrom);
      clauses.push(`EXISTS (
        SELECT 1 FROM availability_slots axs WHERE axs.mentor_id = mp.id
          AND axs.status = 'AVAILABLE' AND axs.starts_at >= $${values.length}
      )`);
    }
    values.push(pageSize, (page - 1) * pageSize);
    const result = await pool.query(
      `SELECT mp.*, u.display_name,
        coalesce(array_agg(DISTINCT t.name) FILTER (WHERE t.id IS NOT NULL), '{}') AS expertise,
        coalesce(array_agg(DISTINCT p.name) FILTER (WHERE p.id IS NOT NULL), '{}') AS position_expertise,
        coalesce((SELECT jsonb_agg(slot ORDER BY slot->>'startsAt') FROM (
          SELECT jsonb_build_object('id', s.id, 'startsAt', s.starts_at, 'endsAt', s.ends_at,
            'timezone', s.source_timezone) AS slot
          FROM availability_slots s WHERE s.mentor_id = mp.id AND s.status = 'AVAILABLE'
            AND s.starts_at > now() ORDER BY s.starts_at LIMIT 3
        ) slots), '[]'::jsonb) AS next_slots
       FROM mentor_profiles mp JOIN users u ON u.id = mp.user_id
       LEFT JOIN mentor_expertise me ON me.mentor_id = mp.id AND me.status = 'APPROVED'
       LEFT JOIN topics t ON t.id = me.topic_id
       LEFT JOIN positions p ON p.id = me.position_id
       WHERE ${clauses.join(" AND ")}
       GROUP BY mp.id, u.display_name
       ORDER BY mp.public_rating DESC NULLS LAST, mp.id
       LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values,
    );
    const count = await pool.query(
      `SELECT count(*)::int AS total FROM mentor_profiles mp WHERE ${clauses.join(" AND ")}`,
      values.slice(0, values.length - 2),
    );
    return { items: result.rows.map(profileDto), pageInfo: { page, pageSize, total: count.rows[0].total } };
  }

  async function getPublic(id) {
    const result = await pool.query(
      `SELECT mp.*, u.display_name,
        coalesce(array_agg(DISTINCT t.name) FILTER (WHERE t.id IS NOT NULL), '{}') AS expertise,
        coalesce(array_agg(DISTINCT p.name) FILTER (WHERE p.id IS NOT NULL), '{}') AS position_expertise,
        coalesce((SELECT jsonb_agg(jsonb_build_object('id', s.id, 'startsAt', s.starts_at,
          'endsAt', s.ends_at, 'timezone', s.source_timezone) ORDER BY s.starts_at)
          FROM availability_slots s WHERE s.mentor_id = mp.id AND s.status = 'AVAILABLE' AND s.starts_at > now()), '[]'::jsonb) AS next_slots,
        coalesce((SELECT jsonb_agg(published_review ORDER BY published_review->>'createdAt' DESC)
          FROM (
            SELECT jsonb_build_object(
              'id', r.id,
              'rating', r.rating,
              'comment', r.comment,
              'studentName', su.display_name,
              'createdAt', r.created_at
            ) AS published_review
            FROM reviews r
            JOIN bookings b ON b.id = r.booking_id
            JOIN users su ON su.id = r.student_id
            WHERE b.mentor_id = mp.id AND r.moderation_status = 'PUBLISHED'
            ORDER BY r.created_at DESC
            LIMIT 20
          ) published_reviews), '[]'::jsonb) AS reviews
       FROM mentor_profiles mp JOIN users u ON u.id = mp.user_id
       LEFT JOIN mentor_expertise me ON me.mentor_id = mp.id AND me.status = 'APPROVED'
       LEFT JOIN topics t ON t.id = me.topic_id
       LEFT JOIN positions p ON p.id = me.position_id
       WHERE mp.id = $1 AND mp.verification_status = 'APPROVED'
       GROUP BY mp.id, u.display_name`,
      [id],
    );
    if (!result.rowCount) throw notFoundError();
    return profileDto(result.rows[0]);
  }

  async function listSlots(userId) {
    const result = await pool.query(
      `SELECT s.id, s.starts_at, s.ends_at, s.source_timezone, s.status, s.version,
              (SELECT count(*)::int FROM bookings b
               WHERE b.slot_id = s.id AND b.state = 'PENDING') AS pending_booking_count,
              (s.status = 'AVAILABLE' AND NOT EXISTS (
                SELECT 1 FROM bookings b
                WHERE b.slot_id = s.id
                  AND b.state IN ('PENDING', 'CONFIRMED', 'RESCHEDULE_PROPOSED')
              )) AS deletable
       FROM availability_slots s JOIN mentor_profiles mp ON mp.id = s.mentor_id
       WHERE mp.user_id = $1
         AND s.starts_at > now()
         AND s.status <> 'CANCELLED'
       ORDER BY s.starts_at`,
      [userId],
    );
    return result.rows.map((row) => ({ id: row.id, startsAt: row.starts_at, endsAt: row.ends_at,
      timezone: row.source_timezone, status: row.status, version: row.version,
      pendingBookingCount: row.pending_booking_count, deletable: row.deletable }));
  }

  async function createSlot(userId, input) {
    const startsAt = new Date(input.startsAt);
    const endsAt = new Date(input.endsAt);
    if (Number.isNaN(startsAt.getTime()) || Number.isNaN(endsAt.getTime())) {
      throw new AppError({
        status: 422,
        code: "INVALID_SLOT_TIME",
        message: "Thời gian bắt đầu hoặc kết thúc không hợp lệ.",
        recovery: { kind: "EDIT_INPUT", retryable: false, retryAfterSeconds: null },
      });
    }
    if (endsAt <= startsAt) {
      throw new AppError({
        status: 422,
        code: "INVALID_SLOT_RANGE",
        message: "Giờ kết thúc phải sau giờ bắt đầu.",
        recovery: { kind: "EDIT_INPUT", retryable: false, retryAfterSeconds: null },
      });
    }
    if (startsAt <= new Date()) {
      throw new AppError({
        status: 422,
        code: "SLOT_IN_PAST",
        message: "Chỉ có thể tạo khung giờ trong tương lai.",
        recovery: { kind: "EDIT_INPUT", retryable: false, retryAfterSeconds: null },
      });
    }
    try {
      const result = await pool.query(
        `INSERT INTO availability_slots (mentor_id, starts_at, ends_at, source_timezone)
         SELECT id, $2, $3, $4 FROM mentor_profiles
         WHERE user_id = $1 AND verification_status = 'APPROVED'
         RETURNING id, starts_at, ends_at, source_timezone, status, version`,
        [userId, input.startsAt, input.endsAt, input.timezone],
      );
      if (!result.rowCount) {
        throw new AppError({
          status: 403,
          code: "MENTOR_NOT_APPROVED",
          message: "Hồ sơ cần được duyệt trước khi mở lịch.",
          recovery: { kind: "WAIT", retryable: false, retryAfterSeconds: null },
        });
      }
      const row = result.rows[0];
      return { id: row.id, startsAt: row.starts_at, endsAt: row.ends_at,
        timezone: row.source_timezone, status: row.status, version: row.version };
    } catch (error) {
      if (error.code === "23P01") {
        throw new AppError({
          status: 409,
          code: "SLOT_OVERLAP",
          message: "Khung giờ này chồng lấn với lịch hiện có.",
          recovery: { kind: "EDIT_INPUT", retryable: false, retryAfterSeconds: null },
        });
      }
      throw error;
    }
  }

  async function cancelSlot(userId, slotId, version) {
    const result = await pool.query(
      `UPDATE availability_slots s SET status = 'CANCELLED', version = s.version + 1, updated_at = now()
       FROM mentor_profiles mp
       WHERE s.id = $1 AND s.mentor_id = mp.id AND mp.user_id = $2
         AND s.status = 'AVAILABLE' AND s.version = $3
         AND NOT EXISTS (
           SELECT 1 FROM bookings b
           WHERE b.slot_id = s.id AND b.state IN ('PENDING', 'CONFIRMED', 'RESCHEDULE_PROPOSED')
         )
       RETURNING s.id`,
      [slotId, userId, version],
    );
    if (!result.rowCount) {
      throw new AppError({
        status: 409,
        code: "SLOT_NOT_EDITABLE",
        message: "Khung giờ không thể xóa vì đã thay đổi hoặc đang được dùng bởi một yêu cầu đặt lịch.",
        recovery: { kind: "RETRY_SAFE", retryable: true, retryAfterSeconds: null },
      });
    }
  }

  async function listPendingVerification() {
    const result = await pool.query(
      `SELECT mv.id AS verification_id, mv.status, mv.created_at, mv.version,
              mp.id AS mentor_id, mp.headline, mp.bio, u.display_name, u.email
       FROM mentor_verifications mv
       JOIN mentor_profiles mp ON mp.id = mv.mentor_id
       JOIN users u ON u.id = mp.user_id
       WHERE mv.status = 'PENDING' ORDER BY mv.created_at`,
    );
    return { items: result.rows, pageInfo: { page: 1, pageSize: result.rowCount, total: result.rowCount } };
  }

  async function getEvidence(verificationId) {
    const result = await pool.query(
      "SELECT evidence_ref, evidence_mime_type FROM mentor_verifications WHERE id = $1",
      [verificationId],
    );
    if (!result.rowCount) throw notFoundError();
    return { buffer: await storage.get(result.rows[0].evidence_ref), contentType: result.rows[0].evidence_mime_type };
  }

  async function decideVerification(actorId, verificationId, input, correlationId) {
    return withTransaction(pool, async (client) => {
      const result = await client.query(
        `UPDATE mentor_verifications SET status = $2, decision_reason = $3,
           decided_by = $4, decided_at = now(), version = version + 1
         WHERE id = $1 AND status = 'PENDING' AND version = $5
         RETURNING mentor_id, status`,
        [verificationId, input.decision, input.reason, actorId, input.version],
      );
      if (!result.rowCount) {
        throw new AppError({
          status: 409,
          code: "VERSION_CONFLICT",
          message: "Hồ sơ đã được xử lý. Hãy tải lại hàng đợi.",
          recovery: { kind: "RETRY_SAFE", retryable: true, retryAfterSeconds: null },
        });
      }
      await client.query(
        "UPDATE mentor_profiles SET verification_status = $2, updated_at = now(), version = version + 1 WHERE id = $1",
        [result.rows[0].mentor_id, input.decision],
      );
      if (input.decision === "APPROVED") {
        await client.query("UPDATE mentor_expertise SET status = 'APPROVED' WHERE mentor_id = $1", [result.rows[0].mentor_id]);
      }
      await client.query(
        `UPDATE operation_cases SET status = 'RESOLVED', updated_at = now(), version = version + 1
         WHERE case_type = 'MENTOR_VERIFICATION' AND target_id = $1 AND status <> 'RESOLVED'`,
        [result.rows[0].mentor_id],
      );
      await writeAudit(client, {
        actorId,
        action: `MENTOR_${input.decision}`,
        targetType: "MENTOR",
        targetId: result.rows[0].mentor_id,
        reason: input.reason,
        correlationId,
      });
      return { verificationId, mentorId: result.rows[0].mentor_id, status: input.decision };
    });
  }

  return {
    createEvidenceAccess,
    verifyEvidenceAccess,
    saveProfile,
    submitVerification,
    getOwnProfile,
    listPublic,
    getPublic,
    listSlots,
    createSlot,
    cancelSlot,
    listPendingVerification,
    getEvidence,
    decideVerification,
  };
}
