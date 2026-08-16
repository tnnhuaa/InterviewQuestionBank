import { AppError, notFoundError } from "../shared/errors.js";
import { hashToken } from "../platform/security/tokens.js";

export function sessionCookieName(environment) {
  return environment.sessionCookieSecure ? "__Host-prepvi_session" : "prepvi_session";
}

export function sessionCookieOptions(environment) {
  return {
    httpOnly: true,
    secure: environment.sessionCookieSecure,
    sameSite: "lax",
    path: "/",
    maxAge: environment.sessionTtlHours * 60 * 60 * 1000,
  };
}

export function createSessionMiddleware({ pool, environment }) {
  return async function sessionMiddleware(request, response, next) {
    try {
      const token = request.cookies?.[sessionCookieName(environment)];
      request.auth = { user: null, session: null };
      if (!token) return next();
      const result = await pool.query(
        `SELECT s.id AS session_id, s.csrf_secret_hash, s.expires_at,
                u.id, u.email, u.display_name, u.status,
                coalesce(array_agg(ur.role_code) FILTER (WHERE ur.role_code IS NOT NULL), '{}') AS roles
         FROM sessions s
         JOIN users u ON u.id = s.user_id
         LEFT JOIN user_roles ur ON ur.user_id = u.id
         WHERE s.token_hash = $1 AND s.revoked_at IS NULL AND s.expires_at > now()
         GROUP BY s.id, u.id`,
        [hashToken(token)],
      );
      if (!result.rowCount || result.rows[0].status !== "ACTIVE") {
        response.clearCookie(sessionCookieName(environment), sessionCookieOptions(environment));
        return next();
      }
      const row = result.rows[0];
      request.auth = {
        session: {
          id: row.session_id,
          csrfSecretHash: row.csrf_secret_hash,
          expiresAt: row.expires_at,
        },
        user: {
          id: row.id,
          email: row.email,
          displayName: row.display_name,
          roles: row.roles,
        },
      };
      await pool.query("UPDATE sessions SET last_seen_at = now() WHERE id = $1", [row.session_id]);
      return next();
    } catch (error) {
      return next(error);
    }
  };
}

export function requireAuth(request, response, next) {
  void response;
  if (request.auth?.user) return next();
  return next(new AppError({
    status: 401,
    code: "UNAUTHENTICATED",
    message: "Vui lòng đăng nhập để tiếp tục.",
    recovery: { kind: "NONE", retryable: false, retryAfterSeconds: null },
  }));
}

export function requireRole(...roles) {
  return function roleMiddleware(request, response, next) {
    void response;
    if (!request.auth?.user) return requireAuth(request, response, next);
    if (roles.some((role) => request.auth.user.roles.includes(role))) return next();
    return next(notFoundError());
  };
}

export function createCsrfMiddleware() {
  return function csrfMiddleware(request, response, next) {
    void response;
    if (["GET", "HEAD", "OPTIONS"].includes(request.method)) return next();
    if (!request.auth?.session) return next();
    const token = request.get("X-CSRF-Token");
    if (token && hashToken(token) === request.auth.session.csrfSecretHash) return next();
    return next(new AppError({
      status: 403,
      code: "CSRF_INVALID",
      message: "Phiên thao tác không còn hợp lệ. Hãy tải lại trang và thử lại.",
      recovery: { kind: "RETRY_SAFE", retryable: true, retryAfterSeconds: null },
    }));
  };
}

export function createOriginMiddleware(environment) {
  return function originMiddleware(request, response, next) {
    void response;
    if (["GET", "HEAD", "OPTIONS"].includes(request.method)) return next();
    const origin = request.get("Origin");
    if (origin === environment.frontendOrigin) return next();
    return next(notFoundError());
  };
}
