import "./load-dotenv.js";

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

function toNumber(value, fallback) {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : fallback;
}

export function getEnvironment(source = process.env) {
  return {
    nodeEnv: source.NODE_ENV ?? "development",
    port: toPositiveInteger(source.PORT, 3000),
    frontendOrigin: source.FRONTEND_ORIGIN ?? "http://localhost:5173",
    databaseUrl: source.DATABASE_URL,
    databaseSsl: toBoolean(source.DATABASE_SSL),
    dbPoolMax: toPositiveInteger(source.DB_POOL_MAX, 5),
    sessionCookieSecure: toBoolean(source.SESSION_COOKIE_SECURE, source.NODE_ENV === "production"),
    sessionTtlHours: toPositiveInteger(source.SESSION_TTL_HOURS, 168),
    sessionSecret: source.SESSION_SECRET,
    csrfSecret: source.CSRF_SECRET,
    openApiValidation: toBoolean(source.OPENAPI_VALIDATION, true),
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
    ai: {
      provider: source.AI_PROVIDER ?? "gemini",
      enabled: toBoolean(source.AI_ENABLED),
      features: {
        jdAnalysis: toBoolean(source.AI_JD_ANALYSIS_ENABLED),
        recommendationExplanation: toBoolean(source.AI_RECOMMENDATION_EXPLANATION_ENABLED),
        agendaDraft: toBoolean(source.AI_AGENDA_DRAFT_ENABLED),
        feedbackDraft: toBoolean(source.AI_FEEDBACK_DRAFT_ENABLED),
      },
      apiKey: source.GEMINI_API_KEY,
      model: source.GEMINI_MODEL ?? "gemini-3.5-flash-lite",
      apiVersion: source.GEMINI_API_VERSION ?? "v1",
      timeoutMs: toPositiveInteger(source.GEMINI_TIMEOUT_MS, 15000),
      maxAttempts: toPositiveInteger(source.GEMINI_MAX_ATTEMPTS, 2),
      concurrency: toPositiveInteger(source.GEMINI_CONCURRENCY, 2),
      temperature: toNumber(source.GEMINI_TEMPERATURE, 0.1),
      maxInputTokens: toPositiveInteger(source.GEMINI_MAX_INPUT_TOKENS, 20000),
      maxOutputTokens: toPositiveInteger(source.GEMINI_MAX_OUTPUT_TOKENS, 4096),
      rpmBudget: toPositiveInteger(source.GEMINI_RPM_BUDGET, 12),
      tpmBudget: toPositiveInteger(source.GEMINI_TPM_BUDGET, 200000),
      dailyRequestBudget: toPositiveInteger(source.GEMINI_DAILY_REQUEST_BUDGET, 450),
      dailyInputTokenBudget: toPositiveInteger(source.GEMINI_DAILY_INPUT_TOKEN_BUDGET, 5000000),
      userDailyRequestBudget: toPositiveInteger(source.AI_USER_DAILY_REQUEST_BUDGET, 20),
      circuitBreakerFailureThreshold: toPositiveInteger(source.GEMINI_CIRCUIT_BREAKER_FAILURE_THRESHOLD, 5),
      circuitBreakerResetSeconds: toPositiveInteger(source.GEMINI_CIRCUIT_BREAKER_RESET_SECONDS, 60),
      resultRetentionDays: toPositiveInteger(source.AI_RESULT_RETENTION_DAYS, 30),
    },
  };
}

export function validateEnvironment(environment) {
  const missing = [];
  if (!["development", "test", "production"].includes(environment.nodeEnv)) {
    throw new Error("NODE_ENV must be development, test, or production");
  }
  if (!environment.databaseUrl) missing.push("DATABASE_URL");
  if (!environment.sessionSecret || environment.sessionSecret.length < 32) missing.push("SESSION_SECRET (at least 32 characters)");
  if (!environment.frontendOrigin) missing.push("FRONTEND_ORIGIN");
  if (environment.ai.enabled && environment.ai.provider !== "gemini") missing.push("AI_PROVIDER=gemini");
  if (environment.ai.enabled && !environment.ai.apiKey) missing.push("GEMINI_API_KEY");
  if (environment.ai.temperature < 0 || environment.ai.temperature > 1) {
    throw new Error("GEMINI_TEMPERATURE must be between 0 and 1");
  }
  if (missing.length) throw new Error(`Missing required environment configuration: ${missing.join(", ")}`);
}
