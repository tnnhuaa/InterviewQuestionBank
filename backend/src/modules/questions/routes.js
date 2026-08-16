import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../../shared/async-handler.js";
import { parse } from "../../shared/validation.js";
import { requireRole } from "../../middleware/auth.js";
import { createQuestionsService } from "./service.js";

const lifecycle = z.enum(["DRAFT", "IN_REVIEW", "PUBLISHED", "ARCHIVED"]);

export function createQuestionsRouter({ pool }) {
  const router = Router();
  const service = createQuestionsService({ pool });

  router.get("/taxonomy", asyncHandler(async (request, response) => {
    void request;
    response.json(await service.listTaxonomy());
  }));

  router.get("/questions", asyncHandler(async (request, response) => {
    const query = parse(z.object({
      search: z.string().max(200).optional(),
      topic: z.string().max(100).optional(),
      difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).optional(),
      page: z.coerce.number().int().min(1).default(1),
      pageSize: z.coerce.number().int().min(1).max(100).default(20),
    }), request.query);
    response.json(await service.list({ ...query, actorId: request.auth?.user?.id ?? null }));
  }));

  router.get("/questions/:questionId", asyncHandler(async (request, response) => {
    response.json(await service.get({ id: request.params.questionId, actorId: request.auth?.user?.id ?? null }));
  }));

  router.put("/practice-progress/:questionId", requireRole("STUDENT"), asyncHandler(async (request, response) => {
    const input = parse(z.object({
      bookmarked: z.boolean(),
      status: z.enum(["NOT_STARTED", "PRACTICING", "COMPLETED", "REVISIT"]),
    }), request.body);
    response.json(await service.updateProgress(request.auth.user.id, request.params.questionId, input));
  }));

  router.get("/admin/questions", requireRole("ADMIN"), asyncHandler(async (request, response) => {
    const query = parse(z.object({
      search: z.string().max(200).optional(),
      page: z.coerce.number().int().min(1).default(1),
      pageSize: z.coerce.number().int().min(1).max(100).default(20),
    }), request.query);
    response.json(await service.list({ ...query, actorId: request.auth.user.id, includeAll: true }));
  }));

  router.post("/admin/questions", requireRole("ADMIN"), asyncHandler(async (request, response) => {
    const input = parse(z.object({
      slug: z.string().regex(/^[a-z0-9-]+$/).max(120),
      title: z.string().trim().min(5).max(250),
      content: z.string().trim().min(10).max(10000),
      answerCriteria: z.array(z.string().trim().min(1).max(500)).min(1),
      difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
      lifecycleStatus: lifecycle.default("DRAFT"),
      sourceName: z.string().trim().min(2).max(200),
      sourceUrl: z.url().nullable().optional(),
      provenanceNote: z.string().trim().min(2).max(1000),
      topicIds: z.array(z.uuid()).min(1),
      positionIds: z.array(z.uuid()).min(1),
      moderationReason: z.string().trim().min(3).max(1000),
    }), request.body);
    response.status(201).json(await service.createQuestion(request.auth.user.id, input, request.correlationId));
  }));

  router.patch("/admin/questions/:questionId/lifecycle", requireRole("ADMIN"), asyncHandler(async (request, response) => {
    const input = parse(z.object({
      lifecycleStatus: lifecycle,
      reason: z.string().trim().min(3).max(1000),
      version: z.number().int().positive(),
    }), request.body);
    response.json(await service.changeLifecycle(
      request.auth.user.id,
      request.params.questionId,
      input,
      request.correlationId,
    ));
  }));

  return router;
}
