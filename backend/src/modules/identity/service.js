import argon2 from "argon2";
import { AppError, notFoundError } from "../../shared/errors.js";
import { createOneTimeToken, createOpaqueToken, hashToken, verifyOneTimeToken } from "../../platform/security/tokens.js";
import { withTransaction } from "../../platform/db/transaction.js";
import { createInAppNotification, enqueueNotification } from "../../platform/outbox.js";
import { writeAudit } from "../../platform/audit.js";

const dummyPasswordHash = argon2.hash("PrepVI timing equalization value", { type: argon2.argon2id });

function publicUser(row) {
  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    status: row.status,
    roles: row.roles ?? [],
  };
}

async function createPurposeToken(client, { userId, purpose, expiresAt, environment, eventType }) {
  const generated = createOneTimeToken({
    purpose,
    expiresAt,
    secret: environment.sessionSecret,
  });
  await client.query(
    `INSERT INTO one_time_tokens (id, user_id, purpose, token_hash, expires_at)
     VALUES ($1, $2, $3, $4, $5)`,
    [generated.id, userId, purpose, hashToken(generated.token), expiresAt],
  );
  await enqueueNotification(client, {
    eventType,
    aggregateType: "USER",
    aggregateId: userId,
    recipientUserId: userId,
    payload: { tokenId: generated.id, purpose },
    deduplicationKey: `${eventType}:${generated.id}:email`,
  });
  return generated.id;
}

export function createIdentityService({ pool, environment }) {
  async function register({ email, password, displayName, correlationId }) {
    const normalizedEmail = email.trim().toLowerCase();
    const passwordHash = await argon2.hash(password, { type: argon2.argon2id });
    try {
      return await withTransaction(pool, async (client) => {
        const result = await client.query(
          `INSERT INTO users (email, password_hash, display_name)
           VALUES ($1, $2, $3)
           RETURNING id, email, display_name, status`,
          [normalizedEmail, passwordHash, displayName.trim()],
        );
        const user = result.rows[0];
        await client.query(
          "INSERT INTO user_roles (user_id, role_code) VALUES ($1, 'STUDENT')",
          [user.id],
        );
        await client.query(
          "INSERT INTO student_profiles (user_id) VALUES ($1)",
          [user.id],
        );
        const expiresAt = new Date(Date.now() + environment.emailVerificationTtlHours * 60 * 60 * 1000);
        await createPurposeToken(client, {
          userId: user.id,
          purpose: "VERIFY_EMAIL",
          expiresAt,
          environment,
          eventType: "identity.email_verification_requested",
        });
        await writeAudit(client, {
          actorId: user.id,
          action: "USER_REGISTERED",
          targetType: "USER",
          targetId: user.id,
          correlationId,
        });
        return { ...publicUser({ ...user, roles: ["STUDENT"] }), verificationRequired: true };
      });
    } catch (error) {
      if (error.code === "23505") {
        throw new AppError({
          status: 409,
          code: "REGISTRATION_UNAVAILABLE",
          message: "Không thể hoàn tất đăng ký với thông tin này.",
          recovery: { kind: "NONE", retryable: false, retryAfterSeconds: null },
        });
      }
      throw error;
    }
  }

  async function consumeToken(token, purpose) {
    const parsed = verifyOneTimeToken({ token, purpose, secret: environment.sessionSecret });
    if (!parsed) return null;
    const result = await pool.query(
      `SELECT id, user_id FROM one_time_tokens
       WHERE id = $1 AND purpose = $2 AND token_hash = $3
         AND consumed_at IS NULL AND expires_at > now()`,
      [parsed.id, purpose, hashToken(token)],
    );
    return result.rows[0] ?? null;
  }

  async function verifyEmail({ token, correlationId }) {
    const record = await consumeToken(token, "VERIFY_EMAIL");
    if (!record) {
      throw new AppError({
        status: 400,
        code: "TOKEN_INVALID",
        message: "Liên kết xác minh không hợp lệ hoặc đã hết hạn.",
        recovery: { kind: "NONE", retryable: false, retryAfterSeconds: null },
      });
    }
    return withTransaction(pool, async (client) => {
      await client.query(
        "UPDATE one_time_tokens SET consumed_at = now() WHERE id = $1 AND consumed_at IS NULL",
        [record.id],
      );
      const result = await client.query(
        `UPDATE users SET status = 'ACTIVE', email_verified_at = now(), updated_at = now(), version = version + 1
         WHERE id = $1 RETURNING id, email, display_name, status`,
        [record.user_id],
      );
      await writeAudit(client, {
        actorId: record.user_id,
        action: "EMAIL_VERIFIED",
        targetType: "USER",
        targetId: record.user_id,
        correlationId,
      });
      return publicUser({ ...result.rows[0], roles: ["STUDENT"] });
    });
  }

  async function login({ email, password }) {
    const result = await pool.query(
      `SELECT u.id, u.email, u.display_name, u.status, u.password_hash,
              coalesce(array_agg(ur.role_code) FILTER (WHERE ur.role_code IS NOT NULL), '{}') AS roles
       FROM users u LEFT JOIN user_roles ur ON ur.user_id = u.id
       WHERE lower(u.email) = lower($1)
       GROUP BY u.id`,
      [email.trim()],
    );
    const row = result.rows[0];
    const validPassword = await argon2.verify(row?.password_hash ?? await dummyPasswordHash, password);
    if (!row || !validPassword || row.status !== "ACTIVE") {
      throw new AppError({
        status: 401,
        code: "INVALID_CREDENTIALS",
        message: "Không thể đăng nhập với thông tin đã cung cấp.",
        recovery: { kind: "NONE", retryable: false, retryAfterSeconds: null },
      });
    }
    const sessionToken = createOpaqueToken();
    const csrfToken = createOpaqueToken();
    const expiresAt = new Date(Date.now() + environment.sessionTtlHours * 60 * 60 * 1000);
    const session = await pool.query(
      `INSERT INTO sessions (user_id, token_hash, csrf_secret_hash, expires_at)
       VALUES ($1, $2, $3, $4) RETURNING id, expires_at`,
      [row.id, hashToken(sessionToken), hashToken(csrfToken), expiresAt],
    );
    return {
      user: publicUser(row),
      session: { id: session.rows[0].id, expiresAt: session.rows[0].expires_at },
      sessionToken,
      csrfToken,
    };
  }

  async function logout(sessionId) {
    if (sessionId) await pool.query("UPDATE sessions SET revoked_at = now() WHERE id = $1", [sessionId]);
  }

  async function rotateCsrf(sessionId) {
    const csrfToken = createOpaqueToken();
    const result = await pool.query(
      `UPDATE sessions SET csrf_secret_hash = $2, last_seen_at = now()
       WHERE id = $1 AND revoked_at IS NULL AND expires_at > now()
       RETURNING id`,
      [sessionId, hashToken(csrfToken)],
    );
    if (!result.rowCount) throw notFoundError();
    return csrfToken;
  }

  async function forgotPassword(email) {
    const result = await pool.query(
      "SELECT id FROM users WHERE lower(email) = lower($1) AND status = 'ACTIVE'",
      [email.trim()],
    );
    if (!result.rowCount) return;
    await withTransaction(pool, async (client) => {
      const expiresAt = new Date(Date.now() + environment.passwordResetTtlMinutes * 60 * 1000);
      await createPurposeToken(client, {
        userId: result.rows[0].id,
        purpose: "RESET_PASSWORD",
        expiresAt,
        environment,
        eventType: "identity.password_reset_requested",
      });
    });
  }

  async function resetPassword({ token, password, correlationId }) {
    const record = await consumeToken(token, "RESET_PASSWORD");
    if (!record) {
      throw new AppError({
        status: 400,
        code: "TOKEN_INVALID",
        message: "Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.",
        recovery: { kind: "NONE", retryable: false, retryAfterSeconds: null },
      });
    }
    const passwordHash = await argon2.hash(password, { type: argon2.argon2id });
    await withTransaction(pool, async (client) => {
      await client.query("UPDATE one_time_tokens SET consumed_at = now() WHERE id = $1", [record.id]);
      await client.query(
        "UPDATE users SET password_hash = $2, updated_at = now(), version = version + 1 WHERE id = $1",
        [record.user_id, passwordHash],
      );
      await client.query("UPDATE sessions SET revoked_at = now() WHERE user_id = $1 AND revoked_at IS NULL", [record.user_id]);
      await writeAudit(client, {
        actorId: record.user_id,
        action: "PASSWORD_RESET",
        targetType: "USER",
        targetId: record.user_id,
        correlationId,
      });
      await createInAppNotification(client, {
        userId: record.user_id,
        eventType: "identity.password_reset",
        title: "Mật khẩu đã được thay đổi",
        body: "Các phiên đăng nhập cũ đã được thu hồi.",
        resourceType: "USER",
        resourceId: record.user_id,
      });
    });
  }

  async function acceptAdminInvite({ token, password, displayName, correlationId }) {
    const record = await consumeToken(token, "ADMIN_INVITE");
    if (!record) {
      throw new AppError({
        status: 400,
        code: "TOKEN_INVALID",
        message: "Lời mời không hợp lệ hoặc đã hết hạn.",
        recovery: { kind: "NONE", retryable: false, retryAfterSeconds: null },
      });
    }
    const passwordHash = await argon2.hash(password, { type: argon2.argon2id });
    return withTransaction(pool, async (client) => {
      await client.query("UPDATE one_time_tokens SET consumed_at = now() WHERE id = $1 AND consumed_at IS NULL", [record.id]);
      const result = await client.query(
        `UPDATE users SET password_hash = $2, display_name = $3, status = 'ACTIVE',
           email_verified_at = now(), updated_at = now(), version = version + 1
         WHERE id = $1 RETURNING id, email, display_name, status`,
        [record.user_id, passwordHash, displayName.trim()],
      );
      await writeAudit(client, {
        actorId: record.user_id,
        action: "ADMIN_INVITE_ACCEPTED",
        targetType: "USER",
        targetId: record.user_id,
        correlationId,
      });
      return publicUser({ ...result.rows[0], roles: ["ADMIN"] });
    });
  }

  async function getProfile(userId) {
    const result = await pool.query(
      `SELECT target_position, interview_type, interview_goal, interview_date, timezone, version
       FROM student_profiles WHERE user_id = $1`,
      [userId],
    );
    if (!result.rowCount) throw notFoundError();
    const row = result.rows[0];
    return {
      targetPosition: row.target_position,
      interviewType: row.interview_type,
      interviewGoal: row.interview_goal,
      interviewDate: row.interview_date,
      timezone: row.timezone,
      version: row.version,
    };
  }

  async function updateProfile(userId, input) {
    const result = await pool.query(
      `UPDATE student_profiles SET
         target_position = $2, interview_type = $3, interview_goal = $4,
         interview_date = $5, timezone = $6, updated_at = now(), version = version + 1
       WHERE user_id = $1 AND version = $7
       RETURNING target_position, interview_type, interview_goal, interview_date, timezone, version`,
      [userId, input.targetPosition, input.interviewType, input.interviewGoal, input.interviewDate, input.timezone, input.version],
    );
    if (!result.rowCount) {
      throw new AppError({
        status: 409,
        code: "VERSION_CONFLICT",
        message: "Hồ sơ đã thay đổi ở nơi khác. Hãy tải lại trước khi lưu.",
        recovery: { kind: "RETRY_SAFE", retryable: true, retryAfterSeconds: null },
      });
    }
    return getProfile(userId);
  }

  return {
    register,
    verifyEmail,
    login,
    logout,
    rotateCsrf,
    forgotPassword,
    resetPassword,
    acceptAdminInvite,
    getProfile,
    updateProfile,
  };
}
