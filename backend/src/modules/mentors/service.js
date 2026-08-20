import { fileTypeFromBuffer } from "file-type";
import { createHmac, timingSafeEqual } from "node:crypto";
import { AppError, notFoundError } from "../../shared/errors.js";
import { withTransaction } from "../../platform/db/transaction.js";
import { writeAudit } from "../../platform/audit.js";
import { createOperationCase } from "../../platform/operations.js";

const verificationTypes = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
]);

function mapLatestVerification(raw) {
  if (!raw) return null;
  return {
    id: raw.id,
    status: raw.status,
    submittedAt: raw.submittedAt,
    decidedAt: raw.decidedAt ?? null,
    decisionReason: raw.decisionReason ?? null,
    version: raw.version,
  };
}

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
    nextSlots: row.next_slots ?? [],
    reviews: row.reviews ?? [],
    version: row.version,
  };
}

function ownProfileDto(row) {
  return {
    ...profileDto(row),
    topicIds: row.topic_ids ?? [],
    positionIds: row.position_ids ?? [],
    latestVerification: mapLatestVerification(row.latest_verification),
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
    if (
      expires < Math.floor(Date.now() / 1000) ||
      signatureBuffer.length !== expectedBuffer.length ||
      !timingSafeEqual(signatureBuffer, expectedBuffer)
    ) {
      throw notFoundError();
    }
  }

  async function validateTaxonomy(client, topicIds, positionIds) {
    if (topicIds.length) {
      const result = await client.query(
        "SELECT id, status FROM topics WHERE id = ANY($1)",
        [topicIds],
      );
      const found = new Map(result.rows.map((r) => [String(r.id), r.status]));
      const missing = topicIds.filter((id) => !found.has(id));
      const inactive = topicIds.filter((id) => found.get(id) !== "ACTIVE");
      if (missing.length || inactive.length) {
        const fieldErrors = {};
        if (missing.length)
          fieldErrors.topicIds = "Một hoặc nhiều chủ đề không tồn tại.";
        if (inactive.length)
          fieldErrors.topicIds =
            (fieldErrors.topicIds ? fieldErrors.topicIds + " " : "") +
            "Một hoặc nhiều chủ đề không còn hoạt động.";
        throw new AppError({
          status: 422,
          code: "VALIDATION_ERROR",
          message: "Dữ liệu chủ đề không hợp lệ.",
          fieldErrors,
          recovery: {
            kind: "EDIT_INPUT",
            retryable: false,
            retryAfterSeconds: null,
          },
        });
      }
    }
    if (positionIds.length) {
      const result = await client.query(
        "SELECT id, status FROM positions WHERE id = ANY($1)",
        [positionIds],
      );
      const found = new Map(result.rows.map((r) => [String(r.id), r.status]));
      const missing = positionIds.filter((id) => !found.has(id));
      const inactive = positionIds.filter((id) => found.get(id) !== "ACTIVE");
      if (missing.length || inactive.length) {
        const fieldErrors = {};
        if (missing.length)
          fieldErrors.positionIds = "Một hoặc nhiều vị trí không tồn tại.";
        if (inactive.length)
          fieldErrors.positionIds =
            (fieldErrors.positionIds ? fieldErrors.positionIds + " " : "") +
            "Một hoặc nhiều vị trí không còn hoạt động.";
        throw new AppError({
          status: 422,
          code: "VALIDATION_ERROR",
          message: "Dữ liệu vị trí không hợp lệ.",
          fieldErrors,
          recovery: {
            kind: "EDIT_INPUT",
            retryable: false,
            retryAfterSeconds: null,
          },
        });
      }
    }
  }

  function setsEqual(a, b) {
    if (a.length !== b.length) return false;
    const setB = new Set(b);
    return a.every((id) => setB.has(id));
  }

  async function saveProfile(userId, input) {
    return withTransaction(pool, async (client) => {
      const existing = await client.query(
        "SELECT * FROM mentor_profiles WHERE user_id = $1 FOR UPDATE",
        [userId],
      );
      const profile = existing.rowCount
        ? (
            await client.query(
              `UPDATE mentor_profiles SET headline = $2, bio = $3, timezone = $4, updated_at = now(), version = version + 1
             WHERE user_id = $1 RETURNING *`,
              [userId, input.headline, input.bio, input.timezone],
            )
          ).rows[0]
        : (
            await client.query(
              `INSERT INTO mentor_profiles (user_id, headline, bio, timezone)
             VALUES ($1, $2, $3, $4) RETURNING *`,
              [userId, input.headline, input.bio, input.timezone],
            )
          ).rows[0];

      const status = profile.verification_status;

      if (status === "PENDING") {
        throw new AppError({
          status: 409,
          code: "VERIFICATION_PENDING",
          message:
            "Hồ sơ đang được xét duyệt. Hãy chờ quyết định trước khi chỉnh sửa và gửi lại.",
          recovery: { kind: "WAIT", retryable: false, retryAfterSeconds: null },
        });
      }

      await validateTaxonomy(client, input.topicIds, input.positionIds);

      if (status === "APPROVED") {
        const currentExpertise = await client.query(
          "SELECT topic_id, position_id FROM mentor_expertise WHERE mentor_id = $1 AND status = 'APPROVED'",
          [profile.id],
        );
        const currentTopicIds = currentExpertise.rows
          .filter((r) => r.topic_id)
          .map((r) => String(r.topic_id))
          .sort();
        const currentPositionIds = currentExpertise.rows
          .filter((r) => r.position_id)
          .map((r) => String(r.position_id))
          .sort();
        const newTopicIds = [...input.topicIds].sort();
        const newPositionIds = [...input.positionIds].sort();
        if (
          !setsEqual(currentTopicIds, newTopicIds) ||
          !setsEqual(currentPositionIds, newPositionIds)
        ) {
          throw new AppError({
            status: 409,
            code: "MENTOR_EXPERTISE_LOCKED",
            message:
              "Hồ sơ đã được duyệt. Không thể thay đổi chuyên môn đã được phê duyệt.",
            recovery: {
              kind: "NONE",
              retryable: false,
              retryAfterSeconds: null,
            },
          });
        }
      } else {
        await client.query(
          "DELETE FROM mentor_expertise WHERE mentor_id = $1",
          [profile.id],
        );
        for (const topicId of input.topicIds) {
          await client.query(
            "INSERT INTO mentor_expertise (mentor_id, topic_id, evidence_note, status) VALUES ($1, $2, $3, 'PENDING')",
            [profile.id, topicId, input.expertiseEvidence ?? null],
          );
        }
        for (const positionId of input.positionIds) {
          await client.query(
            "INSERT INTO mentor_expertise (mentor_id, position_id, evidence_note, status) VALUES ($1, $2, $3, 'PENDING')",
            [profile.id, positionId, input.expertiseEvidence ?? null],
          );
        }
      }

      return getOwnProfile(userId);
    });
  }

  async function submitVerification(userId, input, file, correlationId) {
    if (!file?.buffer?.length) {
      throw new AppError({
        status: 422,
        code: "INVALID_VERIFICATION_EVIDENCE",
        message: "Bằng chứng xác minh phải là một tệp hợp lệ không quá 10 MB.",
        recovery: {
          kind: "REUPLOAD",
          retryable: false,
          retryAfterSeconds: null,
        },
      });
    }
    const detected = await fileTypeFromBuffer(file.buffer);
    if (!verificationTypes.has(detected?.mime)) {
      throw new AppError({
        status: 415,
        code: "UNSUPPORTED_DOCUMENT",
        message: "Bằng chứng xác minh chỉ hỗ trợ PDF, PNG hoặc JPEG.",
        recovery: {
          kind: "REUPLOAD",
          retryable: false,
          retryAfterSeconds: null,
        },
      });
    }
    const key = await storage.put(file.buffer, {
      contentType: detected.mime,
      classification: "mentor-verification",
    });
    try {
      return await withTransaction(pool, async (client) => {
        const existing = await client.query(
          "SELECT * FROM mentor_profiles WHERE user_id = $1 FOR UPDATE",
          [userId],
        );
        if (!existing.rowCount) throw notFoundError();
        const profile = existing.rows[0];

        if (profile.version !== input.profileVersion) {
          throw new AppError({
            status: 409,
            code: "VERSION_CONFLICT",
            message: "Hồ sơ đã thay đổi. Hãy tải lại trước khi gửi xác minh.",
            recovery: {
              kind: "RETRY_SAFE",
              retryable: true,
              retryAfterSeconds: null,
            },
          });
        }

        if (profile.verification_status === "PENDING") {
          throw new AppError({
            status: 409,
            code: "VERIFICATION_ALREADY_PENDING",
            message: "Hồ sơ xác minh đang được xét duyệt.",
            recovery: {
              kind: "WAIT",
              retryable: false,
              retryAfterSeconds: null,
            },
          });
        }

        if (profile.verification_status === "APPROVED") {
          throw new AppError({
            status: 409,
            code: "MENTOR_ALREADY_APPROVED",
            message: "Hồ sơ Mentor đã được xác minh.",
            recovery: {
              kind: "NONE",
              retryable: false,
              retryAfterSeconds: null,
            },
          });
        }

        if (!profile.headline || !profile.bio || !profile.timezone) {
          throw new AppError({
            status: 422,
            code: "MENTOR_PROFILE_INCOMPLETE",
            message:
              "Hồ sơ chưa đầy đủ. Hãy hoàn thiện trước khi gửi xác minh.",
            fieldErrors: {
              ...(profile.headline
                ? {}
                : { headline: "Headline là bắt buộc." }),
              ...(profile.bio ? {} : { bio: "Giới thiệu là bắt buộc." }),
              ...(profile.timezone ? {} : { timezone: "Múi giờ là bắt buộc." }),
            },
            recovery: {
              kind: "EDIT_INPUT",
              retryable: false,
              retryAfterSeconds: null,
            },
          });
        }

        const expertise = await client.query(
          "SELECT topic_id, position_id FROM mentor_expertise WHERE mentor_id = $1",
          [profile.id],
        );
        const hasTopic = expertise.rows.some((r) => r.topic_id);
        const hasPosition = expertise.rows.some((r) => r.position_id);
        if (!hasTopic || !hasPosition) {
          throw new AppError({
            status: 422,
            code: "MENTOR_PROFILE_INCOMPLETE",
            message:
              "Hồ sơ chưa đầy đủ. Hãy thêm ít nhất một chuyên môn kỹ thuật và một vị trí.",
            fieldErrors: {
              ...(hasTopic ? {} : { topicIds: "Cần ít nhất một chủ đề." }),
              ...(hasPosition
                ? {}
                : { positionIds: "Cần ít nhất một vị trí." }),
            },
            recovery: {
              kind: "EDIT_INPUT",
              retryable: false,
              retryAfterSeconds: null,
            },
          });
        }

        try {
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

          const row = result.rows[0];
          return {
            verificationId: row.id,
            mentorId: profile.id,
            status: row.status,
            submittedAt: row.created_at,
            version: row.version,
          };
        } catch (error) {
          if (error.code === "23505") {
            throw new AppError({
              status: 409,
              code: "VERIFICATION_ALREADY_PENDING",
              message: "Hồ sơ xác minh đang được xét duyệt.",
              recovery: {
                kind: "WAIT",
                retryable: false,
                retryAfterSeconds: null,
              },
            });
          }
          throw error;
        }
      });
    } catch (error) {
      if (
        error.status !== 422 &&
        error.status !== 409 &&
        error.status !== 415
      ) {
        await storage.delete(key);
      }
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
        '[]'::jsonb AS next_slots,
        (SELECT jsonb_build_object(
          'id', mv.id, 'status', mv.status,
          'submittedAt', mv.created_at, 'decidedAt', mv.decided_at,
          'decisionReason', mv.decision_reason, 'version', mv.version
        )
        FROM mentor_verifications mv
        WHERE mv.mentor_id = mp.id
        ORDER BY mv.created_at DESC, mv.id DESC
        LIMIT 1) AS latest_verification
       FROM mentor_profiles mp JOIN users u ON u.id = mp.user_id
       LEFT JOIN mentor_expertise me ON me.mentor_id = mp.id
       LEFT JOIN topics t ON t.id = me.topic_id
       LEFT JOIN positions p ON p.id = me.position_id
       WHERE mp.user_id = $1 GROUP BY mp.id, u.display_name`,
      [userId],
    );
    if (!result.rowCount) throw notFoundError();
    return ownProfileDto(result.rows[0]);
  }

  async function listPublic({ topic, availableFrom, availableTo, page, pageSize }) {
    const requestNow = new Date();
    const effectiveFrom = availableFrom
      ? new Date(Math.max(requestNow.getTime(), new Date(availableFrom).getTime()))
      : requestNow;
    const effectiveTo = availableTo ? new Date(availableTo) : null;

    if (effectiveTo && effectiveTo <= effectiveFrom) {
      throw new AppError({
        status: 422,
        code: "VALIDATION_ERROR",
        message: "Khoảng thời gian không hợp lệ",
        fieldErrors: { availableTo: "Thời gian kết thúc phải sau thời gian bắt đầu" },
        recovery: { kind: "EDIT_INPUT", retryable: false, retryAfterSeconds: null },
      });
    }

    const hasAvailabilityFilter = Boolean(availableFrom || availableTo);
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

    const topicClauses = [...clauses];
    const topicValues = [...values];

    if (hasAvailabilityFilter) {
      values.push(effectiveFrom.toISOString());
      if (effectiveTo) {
        values.push(effectiveTo.toISOString());
        clauses.push(`EXISTS (
          SELECT 1 FROM availability_slots axs WHERE axs.mentor_id = mp.id
            AND axs.status = 'AVAILABLE'
            AND axs.starts_at >= $${values.length - 1}::timestamptz
            AND axs.starts_at < $${values.length}::timestamptz
        )`);
      } else {
        clauses.push(`EXISTS (
          SELECT 1 FROM availability_slots axs WHERE axs.mentor_id = mp.id
            AND axs.status = 'AVAILABLE'
            AND axs.starts_at >= $${values.length}::timestamptz
        )`);
      }
    }

    const countResult = await pool.query(
      `SELECT count(*)::int AS total FROM mentor_profiles mp WHERE ${clauses.join(" AND ")}`,
      values,
    );
    const total = countResult.rows[0].total;

    const matchingCountResult = await pool.query(
      `SELECT count(*)::int AS total FROM mentor_profiles mp WHERE ${topicClauses.join(" AND ")}`,
      topicValues,
    );
    const matchingMentorCount = matchingCountResult.rows[0].total;

    let nextSlotClause;
    if (hasAvailabilityFilter) {
      nextSlotClause = `AND s.starts_at >= $${values.length - (effectiveTo ? 2 : 1)}::timestamptz
         AND (s.starts_at < $${values.length - (effectiveTo ? 1 : 0)}::timestamptz)`;
    } else {
      nextSlotClause = "AND s.starts_at > now()";
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
            ${nextSlotClause}
          ORDER BY s.starts_at LIMIT 3
        ) slots), '[]'::jsonb) AS next_slots,
        (SELECT min(s.starts_at) FROM availability_slots s WHERE s.mentor_id = mp.id
          AND s.status = 'AVAILABLE' ${nextSlotClause}) AS first_slot
       FROM mentor_profiles mp JOIN users u ON u.id = mp.user_id
       LEFT JOIN mentor_expertise me ON me.mentor_id = mp.id AND me.status = 'APPROVED'
       LEFT JOIN topics t ON t.id = me.topic_id
       LEFT JOIN positions p ON p.id = me.position_id
       WHERE ${clauses.join(" AND ")}
       GROUP BY mp.id, u.display_name
       ORDER BY first_slot ASC NULLS LAST, mp.public_rating DESC NULLS LAST, mp.id
       LIMIT $${values.length - 1} OFFSET $${values.length}`,
      values,
    );

    const availabilityFiltered = hasAvailabilityFilter && total === 0 && matchingMentorCount > 0;
    let emptyReason = null;
    if (total === 0) {
      emptyReason = matchingMentorCount === 0 ? "NO_MATCHING_MENTOR" : "NO_AVAILABLE_SLOT";
    }

    return {
      items: result.rows.map(profileDto),
      pageInfo: { page, pageSize, total },
      searchContext: {
        matchingMentorCount,
        availabilityFiltered,
        emptyReason,
      },
    };
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
      `SELECT s.id, s.starts_at, s.ends_at, s.source_timezone, s.status, s.version
       FROM availability_slots s JOIN mentor_profiles mp ON mp.id = s.mentor_id
       WHERE mp.user_id = $1 ORDER BY s.starts_at`,
      [userId],
    );
    return result.rows.map((row) => ({
      id: row.id,
      startsAt: row.starts_at,
      endsAt: row.ends_at,
      timezone: row.source_timezone,
      status: row.status,
      version: row.version,
    }));
  }

  async function createSlot(userId, input) {
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
      return {
        id: row.id,
        startsAt: row.starts_at,
        endsAt: row.ends_at,
        timezone: row.source_timezone,
        status: row.status,
        version: row.version,
      };
    } catch (error) {
      if (error.code === "23P01") {
        throw new AppError({
          status: 409,
          code: "SLOT_OVERLAP",
          message: "Khung giờ này chồng lấn với lịch hiện có.",
          recovery: {
            kind: "EDIT_INPUT",
            retryable: false,
            retryAfterSeconds: null,
          },
        });
      }
      throw error;
    }
  }

  async function cancelSlot(userId, slotId, version) {
    const result = await pool.query(
      `UPDATE availability_slots s SET status = 'CANCELLED', version = version + 1, updated_at = now()
       FROM mentor_profiles mp
       WHERE s.id = $1 AND s.mentor_id = mp.id AND mp.user_id = $2
         AND s.status = 'AVAILABLE' AND s.version = $3
       RETURNING s.id`,
      [slotId, userId, version],
    );
    if (!result.rowCount) {
      throw new AppError({
        status: 409,
        code: "SLOT_NOT_EDITABLE",
        message: "Khung giờ không còn có thể xóa. Hãy tải lại lịch.",
        recovery: {
          kind: "RETRY_SAFE",
          retryable: true,
          retryAfterSeconds: null,
        },
      });
    }
  }

  async function listPendingVerification() {
    const result = await pool.query(
      `SELECT mv.id AS verification_id, mv.status, mv.created_at, mv.version,
              mp.id AS mentor_id, mp.headline, u.display_name
       FROM mentor_verifications mv
       JOIN mentor_profiles mp ON mp.id = mv.mentor_id
       JOIN users u ON u.id = mp.user_id
       WHERE mv.status = 'PENDING' ORDER BY mv.created_at ASC, mv.id ASC`,
    );
    const items = result.rows.map((row) => ({
      verificationId: row.verification_id,
      mentorId: row.mentor_id,
      displayName: row.display_name,
      headline: row.headline,
      submittedAt: row.created_at,
      status: row.status,
      version: row.version,
    }));
    return {
      items,
      pageInfo: { page: 1, pageSize: result.rowCount, total: result.rowCount },
    };
  }

  async function getVerificationForReview(verificationId) {
    const verificationResult = await pool.query(
      `SELECT mv.id, mv.status, mv.created_at, mv.version,
              mv.evidence_mime_type, mv.evidence_size_bytes, mv.mentor_id
       FROM mentor_verifications mv WHERE mv.id = $1`,
      [verificationId],
    );
    if (!verificationResult.rowCount) throw notFoundError();
    const verification = verificationResult.rows[0];

    const profileResult = await pool.query(
      `SELECT mp.id, u.display_name, mp.headline, mp.bio, mp.timezone
       FROM mentor_profiles mp JOIN users u ON u.id = mp.user_id
       WHERE mp.id = $1`,
      [verification.mentor_id],
    );
    if (!profileResult.rowCount) throw notFoundError();
    const profile = profileResult.rows[0];

    const expertiseResult = await pool.query(
      `SELECT me.topic_id, me.position_id, t.name AS topic_name, p.name AS position_name
       FROM mentor_expertise me
       LEFT JOIN topics t ON t.id = me.topic_id
       LEFT JOIN positions p ON p.id = me.position_id
       WHERE me.mentor_id = $1`,
      [verification.mentor_id],
    );

    const topics = [];
    const positions = [];
    for (const row of expertiseResult.rows) {
      if (row.topic_id && row.topic_name)
        topics.push({ id: String(row.topic_id), name: row.topic_name });
      if (row.position_id && row.position_name)
        positions.push({
          id: String(row.position_id),
          name: row.position_name,
        });
    }

    const historyResult = await pool.query(
      `SELECT mv.id, mv.status, mv.created_at, mv.decided_at, mv.decision_reason,
              mv.decided_by, u.display_name AS decided_by_name
       FROM mentor_verifications mv
       LEFT JOIN users u ON u.id = mv.decided_by
       WHERE mv.mentor_id = $1 AND mv.id <> $2
       ORDER BY mv.created_at DESC, mv.id DESC`,
      [verification.mentor_id, verificationId],
    );

    const priorDecisions = historyResult.rows.map((row) => ({
      verificationId: row.id,
      status: row.status,
      submittedAt: row.created_at,
      decidedAt: row.decided_at ?? null,
      decisionReason: row.decision_reason ?? null,
      decidedBy: row.decided_by
        ? { id: row.decided_by, displayName: row.decided_by_name }
        : null,
    }));

    return {
      verificationId: verification.id,
      mentorId: verification.mentor_id,
      status: verification.status,
      version: verification.version,
      submittedAt: verification.created_at,
      mentor: {
        displayName: profile.display_name,
        headline: profile.headline,
        bio: profile.bio,
        timezone: profile.timezone,
        topics,
        positions,
      },
      evidence: {
        mimeType: verification.evidence_mime_type,
        sizeBytes: Number(verification.evidence_size_bytes),
      },
      priorDecisions,
    };
  }

  async function getEvidence(verificationId) {
    const result = await pool.query(
      "SELECT evidence_ref, evidence_mime_type FROM mentor_verifications WHERE id = $1",
      [verificationId],
    );
    if (!result.rowCount) throw notFoundError();
    return {
      buffer: await storage.get(result.rows[0].evidence_ref),
      contentType: result.rows[0].evidence_mime_type,
    };
  }

  async function verifyEvidenceExists(verificationId) {
    const result = await pool.query(
      "SELECT id FROM mentor_verifications WHERE id = $1",
      [verificationId],
    );
    if (!result.rowCount) throw notFoundError();
  }

  async function decideVerification(
    actorId,
    verificationId,
    input,
    correlationId,
  ) {
    return withTransaction(pool, async (client) => {
      const result = await client.query(
        `UPDATE mentor_verifications SET status = $2, decision_reason = $3,
           decided_by = $4, decided_at = now(), version = version + 1
         WHERE id = $1 AND status = 'PENDING' AND version = $5
         RETURNING mentor_id, status, decision_reason, decided_by, decided_at, version`,
        [verificationId, input.decision, input.reason, actorId, input.version],
      );
      if (!result.rowCount) {
        throw new AppError({
          status: 409,
          code: "VERSION_CONFLICT",
          message:
            "Hồ sơ đã được xử lý hoặc thay đổi. Hãy tải lại dữ liệu trước khi quyết định.",
          recovery: {
            kind: "RETRY_SAFE",
            retryable: true,
            retryAfterSeconds: null,
          },
        });
      }
      const updated = result.rows[0];

      await client.query(
        "UPDATE mentor_profiles SET verification_status = $2, updated_at = now(), version = version + 1 WHERE id = $1",
        [updated.mentor_id, input.decision],
      );

      if (input.decision === "APPROVED") {
        await client.query(
          "UPDATE mentor_expertise SET status = 'APPROVED' WHERE mentor_id = $1",
          [updated.mentor_id],
        );
      }

      await client.query(
        `UPDATE operation_cases SET status = 'RESOLVED', updated_at = now(), version = version + 1
         WHERE case_type = 'MENTOR_VERIFICATION' AND target_type = 'MENTOR'
           AND target_id = $1 AND status IN ('OPEN', 'IN_PROGRESS')`,
        [updated.mentor_id],
      );

      await writeAudit(client, {
        actorId,
        action: `MENTOR_${input.decision}`,
        targetType: "MENTOR",
        targetId: updated.mentor_id,
        reason: input.reason,
        correlationId,
      });

      return {
        verificationId,
        mentorId: updated.mentor_id,
        status: updated.status,
        reason: updated.decision_reason,
        decidedAt: updated.decided_at,
        decidedBy: actorId,
        version: updated.version,
      };
    });
  }

  return {
    createEvidenceAccess,
    verifyEvidenceAccess,
    verifyEvidenceExists,
    saveProfile,
    submitVerification,
    getOwnProfile,
    listPublic,
    getPublic,
    listSlots,
    createSlot,
    cancelSlot,
    listPendingVerification,
    getVerificationForReview,
    getEvidence,
    decideVerification,
  };
}
