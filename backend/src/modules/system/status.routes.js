import { Router } from "express";

function notReady(response, request, code, message, retryAfterSeconds = 10) {
  return response.status(503).json({
    code,
    message,
    correlationId: request.correlationId,
    fieldErrors: {},
    recovery: { kind: "WAIT", retryable: true, retryAfterSeconds },
  });
}

export function createStatusRouter({ checkDatabase, storage }) {
  const router = Router();

  router.get("/health", (request, response) => {
    void request;
    response.status(200).json({
      status: "ok",
      service: "interview-question-bank-api",
    });
  });

  router.get(["/ready", "/readiness"], async (request, response) => {

    try {
      const checkResult = await checkDatabase();
      const database = checkResult === true
        ? { ready: true, database: "connected", schema: "unknown" }
        : checkResult;
      if (database === false) {
        return notReady(
          response,
          request,
          "DATABASE_UNAVAILABLE",
          "Database provider đang tạm thời không khả dụng; chưa có mutation nghiệp vụ nào được thực hiện.",
        );
      }
      if (!database || database.ready === false) {
        const schemaMissing = database?.code === "SCHEMA_NOT_READY";
        return notReady(
          response,
          request,
          schemaMissing ? "SCHEMA_NOT_READY" : "DATABASE_UNAVAILABLE",
          schemaMissing
            ? "Database chưa có schema hiện tại. Hãy chạy npm run db:migrate rồi khởi động lại dịch vụ."
            : "Database provider đang tạm thời không khả dụng; chưa có mutation nghiệp vụ nào được thực hiện.",
          schemaMissing ? null : 10,
        );
      }
      try {
        await storage?.healthCheck?.();
      } catch {
        return notReady(
          response,
          request,
          "STORAGE_UNAVAILABLE",
          "Private storage chưa sẵn sàng. Hãy kiểm tra STORAGE_DRIVER và cấu hình đường dẫn/bucket rồi thử lại.",
        );
      }
      return response.status(200).json({
        status: "ready",
        database: database.database ?? "connected",
        schema: database.schema ?? "current",
        migrationVersion: database.migrationVersion,
        storage: "available",
      });
    } catch {
      return notReady(
        response,
        request,
        "DATABASE_UNAVAILABLE",
        "Database provider đang tạm thời không khả dụng; chưa có mutation nghiệp vụ nào được thực hiện.",
      );
    }
  });

  return router;
}
