import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { asyncHandler } from "../../shared/async-handler.js";
import { createAiJobsService } from "./jobs.js";

export function createAiRouter({ pool, environment, provider }) {
  const router = Router();
  const service = createAiJobsService({ pool, environment, provider });

  router.get("/ai/capabilities", requireAuth, asyncHandler(async (request, response) => {
    response.json(service.capabilities());
  }));

  router.get("/ai-jobs/:jobId", requireAuth, asyncHandler(async (request, response) => {
    response.json(await service.get(request.auth.user, request.params.jobId));
  }));

  router.post("/ai-jobs/:jobId/retry", requireAuth, asyncHandler(async (request, response) => {
    response.status(202).json(await service.retry(
      request.auth.user,
      request.params.jobId,
      request.get("Idempotency-Key"),
    ));
  }));

  return router;
}
