import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { middleware as openApiMiddleware } from "express-openapi-validator";
import { fileURLToPath } from "node:url";
import { getEnvironment } from "./config/environment.js";
import { pool as databasePool } from "./platform/db/pool.js";
import { createPrivateStorage } from "./platform/storage/private-storage.js";
import { errorHandler } from "./middleware/error-handler.js";
import { notFoundHandler } from "./middleware/not-found.js";
import { correlationMiddleware } from "./middleware/correlation.js";
import { requestLogMiddleware } from "./middleware/request-log.js";
import { createCsrfMiddleware, createOriginMiddleware, createSessionMiddleware } from "./middleware/auth.js";
import { createIdentityRouter } from "./modules/identity/index.js";
import { createQuestionsRouter } from "./modules/questions/index.js";
import { createJdRouter } from "./modules/jd/index.js";
import { createMentorsRouter } from "./modules/mentors/index.js";
import { createBookingsRouter } from "./modules/bookings/index.js";
import { createOperationsRouter } from "./modules/operations/index.js";
import { createDashboardRouter } from "./modules/dashboard/index.js";
import { createQuestionImportsRouter } from "./modules/question-imports/index.js";
import { AppError } from "./shared/errors.js";
import { createStatusRouter } from "./modules/system/status.routes.js";
import { createAiProvider, createAiRouter } from "./modules/ai/index.js";

const disconnectedCheck = async () => false;

function isSafeErrorResponse(body) {
  return Boolean(
    body
    && typeof body.code === "string"
    && typeof body.message === "string"
    && typeof body.correlationId === "string"
    && body.fieldErrors
    && body.recovery
    && typeof body.recovery.kind === "string",
  );
}

export function createApp({
  checkDatabase = disconnectedCheck,
  environment = getEnvironment(),
  pool = databasePool,
  storage = createPrivateStorage(environment.storage),
  aiProvider = createAiProvider(environment),
} = {}) {
  const app = express();

  app.disable("x-powered-by");
  app.use(correlationMiddleware);
  app.use(requestLogMiddleware);
  app.use(helmet());
  app.use(cors({ origin: environment.frontendOrigin, credentials: true }));
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  if (environment.openApiValidation) {
    app.use(openApiMiddleware({
      apiSpec: fileURLToPath(new URL("../openapi/openapi.yaml", import.meta.url)),
      validateRequests: true,
      validateSecurity: false,
      validateResponses: {
        onError: (error, body, request) => {
          if (request.res?.statusCode >= 400 && isSafeErrorResponse(body)) return;
          throw error;
        },
      },
      ignoreUndocumented: true,
    }));
  }
  app.use("/api/v1", createStatusRouter({ checkDatabase }));
  app.use("/api/v1", rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    skip: (request) => ["GET", "HEAD", "OPTIONS"].includes(request.method),
    standardHeaders: true,
    legacyHeaders: false,
    handler: (request, response, next) => {
      void request;
      void response;
      next(new AppError({
        status: 429,
        code: "RATE_LIMITED",
        message: "Bạn đã gửi quá nhiều yêu cầu. Hãy chờ trước khi thử lại.",
        recovery: { kind: "WAIT", retryable: true, retryAfterSeconds: 900 },
      }));
    },
  }));
  app.use(createSessionMiddleware({ pool, environment }));
  app.use(createOriginMiddleware(environment));
  app.use(createCsrfMiddleware());
  app.use("/api/v1", createIdentityRouter({ pool, environment }));
  app.use("/api/v1", createQuestionsRouter({ pool }));
  app.use("/api/v1", createJdRouter({ pool, storage }));
  app.use("/api/v1", createMentorsRouter({ pool, storage, environment }));
  app.use("/api/v1", createBookingsRouter({ pool, environment }));
  app.use("/api/v1", createOperationsRouter({ pool }));
  app.use("/api/v1", createDashboardRouter({ pool }));
  app.use("/api/v1", createQuestionImportsRouter({ pool }));
  app.use("/api/v1", createAiRouter({ pool, environment, provider: aiProvider }));
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
