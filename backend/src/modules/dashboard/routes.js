import { Router } from "express";
import { requireRole } from "../../middleware/auth.js";
import { asyncHandler } from "../../shared/async-handler.js";
import { createDashboardService } from "./service.js";

export function createDashboardRouter({ pool }) {
  const router = Router();
  const service = createDashboardService({ pool });

  router.get("/student-dashboard", requireRole("STUDENT"), asyncHandler(async (request, response) => {
    response.json(await service.getStudentDashboard(request.auth.user.id));
  }));

  return router;
}
