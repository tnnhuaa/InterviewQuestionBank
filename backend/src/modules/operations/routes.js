import { Router } from "express";
import { z } from "zod";
import { requireAuth, requireRole } from "../../middleware/auth.js";
import { asyncHandler } from "../../shared/async-handler.js";
import { parse } from "../../shared/validation.js";
import { createOperationsService } from "./service.js";

export function createOperationsRouter({ pool }) {
  const router = Router();
  const service = createOperationsService({ pool });

  router.get("/notifications", requireAuth, asyncHandler(async (request, response) => {
    response.json(await service.notifications(request.auth.user.id));
  }));
  router.post("/notifications/:notificationId/read", requireAuth, asyncHandler(async (request, response) => {
    response.json(await service.markNotificationRead(request.auth.user.id, request.params.notificationId));
  }));

  router.get("/admin/operation-cases", requireRole("ADMIN"), asyncHandler(async (request, response) => {
    const query = parse(z.object({
      status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "DISMISSED"]).optional(),
      type: z.string().max(50).optional(), page: z.coerce.number().int().positive().default(1),
      pageSize: z.coerce.number().int().min(1).max(100).default(20),
    }), request.query);
    response.json(await service.listCases(query));
  }));
  router.get("/admin/operation-cases/:caseId", requireRole("ADMIN"), asyncHandler(async (request, response) => {
    response.json(await service.getCase(request.params.caseId));
  }));
  router.get("/admin/operation-cases/:caseId/impact", requireRole("ADMIN"), asyncHandler(async (request, response) => {
    response.json(await service.impactPreview(request.params.caseId));
  }));
  router.post("/admin/operation-cases/:caseId/actions", requireRole("ADMIN"), asyncHandler(async (request, response) => {
    const input = parse(z.object({
      action: z.enum(["RESOLVE", "DISMISS", "ASSIGN", "RETRY", "APPROVE_LATE_CHANGE", "CONFIRM_NO_SHOW", "PUBLISH_REVIEW", "HIDE_REVIEW", "UPHOLD_DISPUTE", "DISMISS_DISPUTE"]),
      reason: z.string().trim().min(5).max(2000), version: z.number().int().positive(), assigneeId: z.guid().optional(),
    }), request.body);
    response.json(await service.act(request.auth.user.id, request.params.caseId, input, request.get("Idempotency-Key"), request.correlationId));
  }));
  router.get("/admin/audit", requireRole("ADMIN"), asyncHandler(async (request, response) => {
    const query = parse(z.object({ targetType: z.string().max(80).optional(), targetId: z.guid().optional(), page: z.coerce.number().int().positive().default(1), pageSize: z.coerce.number().int().min(1).max(100).default(50) }), request.query);
    response.json(await service.listAudit(query));
  }));
  router.get("/admin/reports", requireRole("ADMIN"), asyncHandler(async (request, response) => {
    const query = parse(z.object({
      status: z.enum(["OPEN", "IN_REVIEW", "RESOLVED", "DISMISSED"]).optional(),
      page: z.coerce.number().int().positive().default(1),
      pageSize: z.coerce.number().int().min(1).max(100).default(50),
    }), request.query);
    response.json(await service.listReports(query));
  }));
  return router;
}
