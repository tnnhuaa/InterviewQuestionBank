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

  router.get("/ready", async (request, response) => {
    void request;

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
      status: "not_ready",
      database: "disconnected",
    });
  });

  return router;
}
