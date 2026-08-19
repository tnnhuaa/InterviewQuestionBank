import { Router } from "express";
import multer from "multer";
import { z } from "zod";
import { requireRole } from "../../middleware/auth.js";
import { asyncHandler } from "../../shared/async-handler.js";
import { parse } from "../../shared/validation.js";
import { createJdService } from "./service.js";

const upload = multer({ storage: multer.memoryStorage(), limits: { files: 1, fileSize: 10 * 1024 * 1024 } });

export function createJdRouter({ pool, storage, environment, aiProvider }) {
  const router = Router();
  const service = createJdService({ pool, storage, environment });

  // Endpoint mới: upload file → Gemini OCR ngay lập tức, không cần worker
  router.post("/job-descriptions/extract-from-file", requireRole("STUDENT"), upload.single("file"), asyncHandler(async (request, response) => {
    if (!request.file) {
      return response.status(422).json({ code: "EMPTY_DOCUMENT", message: "Không có tệp nào được gửi lên.", fieldErrors: {}, recovery: { kind: "REUPLOAD", retryable: false, retryAfterSeconds: null } });
    }
    const result = await service.extractFromFileWithAi(request.auth.user.id, request.file, aiProvider);
    response.status(201).json(result);
  }));

  router.post("/job-descriptions", requireRole("STUDENT"), upload.single("file"), asyncHandler(async (request, response) => {
    const result = request.file
      ? await service.createFromFile(request.auth.user.id, request.file)
      : await service.createFromText(
        request.auth.user.id,
        parse(z.object({ text: z.string().min(1).max(50000) }), request.body).text,
      );
    response.status(201).json(result);
  }));

  router.get("/job-descriptions", requireRole("STUDENT"), asyncHandler(async (request, response) => {
    response.json(await service.list(request.auth.user.id));
  }));

  router.get("/job-descriptions/:jobDescriptionId", requireRole("STUDENT"), asyncHandler(async (request, response) => {
    response.json(await service.get(request.auth.user.id, request.params.jobDescriptionId));
  }));

  router.post("/job-descriptions/:jobDescriptionId/extract", requireRole("STUDENT"), asyncHandler(async (request, response) => {
    const result = await service.startExtraction(
      request.auth.user.id,
      request.params.jobDescriptionId,
      request.get("Idempotency-Key"),
    );
    response.status(202).json(result);
  }));

  router.post("/job-descriptions/:jobDescriptionId/extraction-retries", requireRole("STUDENT"), asyncHandler(async (request, response) => {
    response.status(202).json(await service.retryExtraction(
      request.auth.user.id,
      request.params.jobDescriptionId,
      request.get("Idempotency-Key"),
    ));
  }));

  router.patch("/job-descriptions/:jobDescriptionId/text", requireRole("STUDENT"), asyncHandler(async (request, response) => {
    const input = parse(z.object({ correctedText: z.string().min(1).max(50000), version: z.number().int().min(0) }), request.body);
    response.json(await service.saveCorrectedText(request.auth.user.id, request.params.jobDescriptionId, input));
  }));

  router.post("/job-descriptions/:jobDescriptionId/confirm", requireRole("STUDENT"), asyncHandler(async (request, response) => {
    const { version } = parse(z.object({ version: z.number().int().positive() }), request.body);
    response.json(await service.confirmText(request.auth.user.id, request.params.jobDescriptionId, version));
  }));

  router.post("/job-descriptions/:jobDescriptionId/analyze", requireRole("STUDENT"), asyncHandler(async (request, response) => {
    const { correctedTextVersion } = parse(z.object({ correctedTextVersion: z.number().int().positive() }), request.body);
    response.json(await service.analyze(
      request.auth.user.id,
      request.params.jobDescriptionId,
      correctedTextVersion,
      request.correlationId,
      request.get("Idempotency-Key"),
    ));
  }));

  router.post("/job-descriptions/:jobDescriptionId/analysis-jobs", requireRole("STUDENT"), asyncHandler(async (request, response) => {
    const { correctedTextVersion } = parse(z.object({ correctedTextVersion: z.number().int().positive() }), request.body);
    response.status(202).json(await service.startAiAnalysis(
      request.auth.user.id,
      request.params.jobDescriptionId,
      correctedTextVersion,
      request.correlationId,
      request.get("Idempotency-Key"),
    ));
  }));

  router.get("/job-descriptions/:jobDescriptionId/analysis", requireRole("STUDENT"), asyncHandler(async (request, response) => {
    const query = parse(z.object({ analysisVersion: z.coerce.number().int().positive().optional() }), request.query);
    response.json(await service.getAnalysis(request.auth.user.id, request.params.jobDescriptionId, query.analysisVersion));
  }));

  router.put("/job-descriptions/:jobDescriptionId/requirement-normalizations", requireRole("STUDENT"), asyncHandler(async (request, response) => {
    const input = parse(z.object({
      analysisVersion: z.number().int().positive(),
      mappingInputVersion: z.number().int().positive(),
      items: z.array(z.object({
        requirementId: z.guid(),
        topicId: z.guid().nullable(),
        reason: z.string().trim().min(2).max(500),
      })).max(100),
    }), request.body);
    response.json(await service.saveNormalizations(request.auth.user.id, request.params.jobDescriptionId, input));
  }));

  router.patch("/job-descriptions/:jobDescriptionId/requirements/:requirementId", requireRole("STUDENT"), asyncHandler(async (request, response) => {
    const input = parse(z.object({
      analysisVersion: z.number().int().positive(),
      decision: z.enum(["ACCEPTED", "EDITED", "UNMAPPED"]),
      topicId: z.guid().nullable().optional(),
      reason: z.string().trim().min(2).max(500).optional(),
    }).superRefine((value, context) => {
      if (value.decision === "EDITED" && !value.topicId) {
        context.addIssue({ code: "custom", path: ["topicId"], message: "Cần chọn chủ đề thay thế" });
      }
    }), request.body);
    response.json(await service.decideRequirement(
      request.auth.user.id,
      request.params.jobDescriptionId,
      request.params.requirementId,
      input,
      request.correlationId,
    ));
  }));

  router.post("/job-descriptions/:jobDescriptionId/matches", requireRole("STUDENT"), asyncHandler(async (request, response) => {
    const { analysisVersion } = parse(z.object({ analysisVersion: z.number().int().positive() }), request.body);
    response.json(await service.match(
      request.auth.user.id,
      request.params.jobDescriptionId,
      analysisVersion,
      request.correlationId,
      request.get("Idempotency-Key"),
    ));
  }));

  router.get("/job-descriptions/:jobDescriptionId/matches", requireRole("STUDENT"), asyncHandler(async (request, response) => {
    const query = parse(z.object({ analysisVersion: z.coerce.number().int().positive().optional() }), request.query);
    response.json(await service.getMatches(request.auth.user.id, request.params.jobDescriptionId, query.analysisVersion));
  }));

  router.post("/preparation-plans", requireRole("STUDENT"), asyncHandler(async (request, response) => {
    const input = parse(z.object({
      jobDescriptionId: z.guid(),
      matchingVersion: z.string().min(1).max(100),
      matchIds: z.array(z.guid()).min(1).max(10),
    }), request.body);
    response.status(201).json(await service.createPlan(request.auth.user.id, input, request.correlationId));
  }));

  router.get("/preparation-plans/:planId", requireRole("STUDENT"), asyncHandler(async (request, response) => {
    response.json(await service.getPlan(request.auth.user.id, request.params.planId));
  }));

  router.patch("/preparation-plans/:planId/items/:itemId", requireRole("STUDENT"), asyncHandler(async (request, response) => {
    const input = parse(z.object({
      priority: z.enum(["MUST", "SHOULD", "OPTIONAL"]).optional(),
      practiceStatus: z.enum(["NOT_STARTED", "PRACTICING", "COMPLETED", "REVISIT"]).optional(),
      version: z.number().int().positive(),
    }).refine((value) => value.priority !== undefined || value.practiceStatus !== undefined, {
      message: "Cần chọn ít nhất một thay đổi",
    }), request.body);
    response.json(await service.updatePlanItem(
      request.auth.user.id,
      request.params.planId,
      request.params.itemId,
      input,
      request.correlationId,
    ));
  }));

  router.get("/preparation-plans/:planId/mentor-candidates", requireRole("STUDENT"), asyncHandler(async (request, response) => {
    const query = parse(z.object({
      availableFrom: z.iso.datetime().optional(),
      availableTo: z.iso.datetime().optional(),
      page: z.coerce.number().int().positive().default(1),
      pageSize: z.coerce.number().int().min(1).max(100).default(20),
    }).refine((value) => !value.availableFrom || !value.availableTo
      || new Date(value.availableTo) > new Date(value.availableFrom), {
      message: "Khoảng thời gian không hợp lệ",
      path: ["availableTo"],
    }), request.query);
    response.json(await service.listMentorCandidates(request.auth.user.id, request.params.planId, query));
  }));

  router.post("/preparation-plans/:planId/recommendation-explanation-jobs", requireRole("STUDENT"), asyncHandler(async (request, response) => {
    response.status(202).json(await service.startRecommendationExplanations(
      request.auth.user.id,
      request.params.planId,
      request.correlationId,
      request.get("Idempotency-Key"),
    ));
  }));

  router.get("/preparation-plans", requireRole("STUDENT"), asyncHandler(async (request, response) => {
    response.json(await service.listPlans(request.auth.user.id));
  }));

  return router;
}
