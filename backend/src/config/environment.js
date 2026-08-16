import "dotenv/config";

function toPositiveInteger(value, fallback) {
  const parsedValue = Number.parseInt(value, 10);
  return Number.isInteger(parsedValue) && parsedValue > 0
    ? parsedValue
    : fallback;
}

function toBoolean(value, fallback = false) {
  if (value === undefined) return fallback;
  return value === "true";
}

export function getEnvironment(source = process.env) {
  return {
    nodeEnv: source.NODE_ENV ?? "development",
    appEnv: source.APP_ENV ?? "local",
    port: toPositiveInteger(source.PORT, 3000),
    frontendOrigin: source.FRONTEND_ORIGIN ?? "http://localhost:5173",
    databaseUrl: source.DATABASE_URL,
    databaseSsl: toBoolean(source.DATABASE_SSL),
    dbPoolMax: toPositiveInteger(source.DB_POOL_MAX, 5),
    sessionCookieSecure: toBoolean(source.SESSION_COOKIE_SECURE, source.NODE_ENV === "production"),
    sessionTtlHours: toPositiveInteger(source.SESSION_TTL_HOURS, 168),
    sessionSecret: source.SESSION_SECRET,
    csrfSecret: source.CSRF_SECRET,
    openApiResponseValidation: toBoolean(source.OPENAPI_RESPONSE_VALIDATION, source.NODE_ENV !== "production"),
    passwordResetTtlMinutes: toPositiveInteger(source.PASSWORD_RESET_TTL_MINUTES, 30),
    emailVerificationTtlHours: toPositiveInteger(source.EMAIL_VERIFICATION_TTL_HOURS, 24),
    smtp: {
      host: source.SMTP_HOST ?? "localhost",
      port: toPositiveInteger(source.SMTP_PORT, 1025),
      secure: toBoolean(source.SMTP_SECURE),
      user: source.SMTP_USER,
      password: source.SMTP_PASSWORD,
      from: source.EMAIL_FROM ?? "PrepVI <no-reply@prepvi.local>",
    },
    storage: {
      driver: source.STORAGE_DRIVER ?? "local",
      localPath: source.LOCAL_STORAGE_PATH ?? ".local/private-files",
      s3Endpoint: source.S3_ENDPOINT,
      s3Region: source.S3_REGION ?? "auto",
      s3Bucket: source.S3_BUCKET,
      s3AccessKeyId: source.S3_ACCESS_KEY_ID,
      s3SecretAccessKey: source.S3_SECRET_ACCESS_KEY,
    },
    ocr: {
      languages: source.OCR_LANGUAGES ?? "vie+eng",
      concurrency: toPositiveInteger(source.OCR_CONCURRENCY, 2),
      timeoutSeconds: toPositiveInteger(source.OCR_TIMEOUT_SECONDS, 60),
      maxAttempts: toPositiveInteger(source.OCR_MAX_ATTEMPTS, 2),
    },
  };
}

export function validateEnvironment(environment) {
  const missing = [];
  if (!environment.databaseUrl) missing.push("DATABASE_URL");
  if (!environment.sessionSecret || environment.sessionSecret.length < 32) missing.push("SESSION_SECRET (at least 32 characters)");
  if (!environment.frontendOrigin) missing.push("FRONTEND_ORIGIN");
  if (missing.length) throw new Error(`Missing required environment configuration: ${missing.join(", ")}`);
}
