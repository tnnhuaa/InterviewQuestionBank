import { Router } from "express";
import multer from "multer";
import { z } from "zod";
import { requireRole } from "../../middleware/auth.js";
import { asyncHandler } from "../../shared/async-handler.js";
import { parse } from "../../shared/validation.js";
import { createQuestionImportsService } from "./service.js";

const upload = multer({ storage: multer.memoryStorage(), limits: { files: 1, fileSize: 5 * 1024 * 1024 } });

export function createQuestionImportsRouter({ pool }) {
  const router = Router();
  const service = createQuestionImportsService({ pool });

  router.post("/admin/question-imports/preview", requireRole("ADMIN"), upload.single("file"), asyncHandler(async (request, response) => {
    response.status(201).json(await service.preview(request.auth.user.id, request.file, request.correlationId));
  }));
  router.get("/admin/question-imports/:importId", requireRole("ADMIN"), asyncHandler(async (request, response) => {
    const query = parse(z.object({
      status: z.enum(["VALID", "INVALID", "IMPORTED", "SKIPPED"]).optional(),
      page: z.coerce.number().int().positive().default(1),
      pageSize: z.coerce.number().int().min(1).max(100).default(100),
    }), request.query);
    response.json(await service.get(request.auth.user.id, request.params.importId, query));
  }));
  router.post("/admin/question-imports/:importId/commit", requireRole("ADMIN"), asyncHandler(async (request, response) => {
    const input = parse(z.object({ version: z.number().int().positive(), reason: z.string().trim().min(3).max(1000) }), request.body);
    response.json(await service.commit(request.auth.user.id, request.params.importId, input, request.get("Idempotency-Key"), request.correlationId));
  }));
  router.get("/admin/question-imports/:importId/errors.csv", requireRole("ADMIN"), asyncHandler(async (request, response) => {
    const csv = await service.errorCsv(request.auth.user.id, request.params.importId);
    response.set("Content-Type", "text/csv; charset=utf-8");
    response.set("Content-Disposition", `attachment; filename="question-import-${request.params.importId}-errors.csv"`);
    response.send(`\uFEFF${csv}`);
  }));
  return router;
}
