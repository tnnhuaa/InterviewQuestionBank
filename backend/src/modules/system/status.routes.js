import { Router } from "express";

export function createStatusRouter({ checkDatabase }) {
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
      if (await checkDatabase()) {
        return response
          .status(200)
          .json({ status: "ready", database: "connected" });
      }
    } catch {
      // Failed dependency checks are represented by the readiness response below.
    }

    return response.status(503).json({
      code: "DEPENDENCY_UNAVAILABLE",
      message: "Database provider is temporarily unavailable; no business mutation was attempted.",
      correlationId: request.correlationId,
      fieldErrors: {},
      recovery: { kind: "WAIT", retryable: true, retryAfterSeconds: 10 },
    });
  });

  return router;
}
