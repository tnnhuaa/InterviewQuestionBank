import { Router } from "express";
import { z } from "zod";
import { requireAuth, requireRole } from "../../middleware/auth.js";
import { asyncHandler } from "../../shared/async-handler.js";
import { parse } from "../../shared/validation.js";
import { createBookingsService } from "./service.js";

const transitionSchema = z.object({
  action: z.enum(["CONFIRM", "REJECT", "CANCEL", "PROPOSE_RESCHEDULE", "ACCEPT_RESCHEDULE", "REJECT_RESCHEDULE", "COMPLETE", "REPORT_NO_SHOW"]),
  version: z.number().int().positive(),
  reason: z.string().trim().min(3).max(1000).optional(),
  proposedSlotId: z.guid().optional(),
}).superRefine((input, context) => {
  if (["REJECT", "CANCEL", "PROPOSE_RESCHEDULE", "REPORT_NO_SHOW"].includes(input.action) && !input.reason) {
    context.addIssue({ code: "custom", path: ["reason"], message: "Vui lòng nhập lý do" });
  }
  if (input.action === "PROPOSE_RESCHEDULE" && !input.proposedSlotId) {
    context.addIssue({ code: "custom", path: ["proposedSlotId"], message: "Vui lòng chọn khung giờ mới" });
  }
});

const agendaSchema = z.array(z.object({
  title: z.string().trim().min(3).max(200),
  durationMinutes: z.number().int().min(1).max(120),
  objective: z.string().trim().min(3).max(1000),
  questionIds: z.array(z.guid()).max(10),
  notes: z.string().trim().max(1000).default(""),
})).min(1).max(10);

const feedbackDraftSchema = z.object({
  rubricScores: z.object({
    technical: z.number().min(0).max(5),
    communication: z.number().min(0).max(5),
    structure: z.number().min(0).max(5),
  }).strict(),
  strengths: z.string().trim().min(10).max(5000),
  weaknesses: z.string().trim().min(10).max(5000),
  nextActions: z.array(z.object({
    description: z.string().trim().min(3).max(500),
    topicId: z.guid().optional(),
    questionId: z.guid().optional(),
  })).min(1).max(20),
});

export function createBookingsRouter({ pool, environment }) {
  const router = Router();
  const service = createBookingsService({ pool, environment });

  router.get("/bookings", requireAuth, asyncHandler(async (request, response) => {
    const query = parse(z.object({
      state: z.enum(["PENDING", "CONFIRMED", "RESCHEDULE_PROPOSED", "REJECTED", "CANCELLED", "COMPLETED", "NO_SHOW"]).optional(),
      page: z.coerce.number().int().positive().default(1),
      pageSize: z.coerce.number().int().min(1).max(100).default(20),
    }), request.query);
    response.json(await service.list(request.auth.user, query));
  }));

  router.post("/bookings", requireRole("STUDENT"), asyncHandler(async (request, response) => {
    const input = parse(z.object({
      mentorId: z.guid(), slotId: z.guid(), jobDescriptionId: z.guid().optional(), preparationPlanId: z.guid().optional(),
      preparationPlanVersion: z.number().int().positive().optional(),
      selectedTopicIds: z.array(z.guid()).min(1).max(30),
      goal: z.string().trim().min(10).max(1000), interviewType: z.string().trim().min(2).max(100), timezone: z.string().max(80).optional(),
    }).refine((value) => Boolean(value.jobDescriptionId) !== Boolean(value.preparationPlanId), {
      message: "Cần chọn chính xác một trong JD hoặc kế hoạch chuẩn bị", path: ["preparationPlanId"],
    }).refine((value) => !value.preparationPlanId || value.preparationPlanVersion !== undefined, {
      message: "Thiếu phiên bản kế hoạch", path: ["preparationPlanVersion"],
    }), request.body);
    response.status(201).json(await service.create(request.auth.user.id, input, request.get("Idempotency-Key"), request.correlationId));
  }));

  router.get("/bookings/:bookingId", requireAuth, asyncHandler(async (request, response) => {
    response.json(await service.get(request.auth.user, request.params.bookingId));
  }));

  router.post("/bookings/:bookingId/transitions", requireAuth, asyncHandler(async (request, response) => {
    const result = await service.transition(request.auth.user, request.params.bookingId, parse(transitionSchema, request.body), request.get("Idempotency-Key"), request.correlationId);
    response.status(result.operationCase ? 202 : 200).json(result);
  }));

  router.put("/bookings/:bookingId/meeting-link", requireRole("MENTOR"), asyncHandler(async (request, response) => {
    const input = parse(z.object({ url: z.url().refine((url) => url.startsWith("https://"), "Link phải dùng HTTPS"), version: z.number().int().positive().optional() }), request.body);
    response.json(await service.saveMeetingLink(request.auth.user, request.params.bookingId, input, request.correlationId));
  }));

  router.post("/bookings/:bookingId/meeting-link-failures", requireAuth, asyncHandler(async (request, response) => {
    const input = parse(z.object({
      kind: z.enum(["BROKEN", "MISSING"]),
      reason: z.string().trim().min(3).max(1000),
    }), request.body);
    response.status(202).json(await service.reportMeetingLinkFailure(
      request.auth.user,
      request.params.bookingId,
      input,
      request.get("Idempotency-Key"),
      request.correlationId,
    ));
  }));

  router.post("/bookings/:bookingId/agenda-drafts", requireRole("MENTOR"), asyncHandler(async (request, response) => {
    response.status(202).json(await service.startAgendaDraft(
      request.auth.user,
      request.params.bookingId,
      request.get("Idempotency-Key"),
      request.correlationId,
    ));
  }));

  router.get("/bookings/:bookingId/agenda-drafts", requireRole("MENTOR"), asyncHandler(async (request, response) => {
    response.json(await service.getAgendaDraft(request.auth.user, request.params.bookingId));
  }));

  router.patch("/bookings/:bookingId/agenda-drafts/:draftId", requireRole("MENTOR"), asyncHandler(async (request, response) => {
    const input = parse(z.object({
      agenda: agendaSchema,
      status: z.enum(["DRAFT", "USED", "DISCARDED"]).default("DRAFT"),
      version: z.number().int().positive(),
    }), request.body);
    response.json(await service.updateAgendaDraft(
      request.auth.user,
      request.params.bookingId,
      request.params.draftId,
      input,
      request.correlationId,
    ));
  }));

  router.post("/bookings/:bookingId/feedback-drafts", requireRole("MENTOR"), asyncHandler(async (request, response) => {
    const input = parse(z.object({ sessionNotes: z.string().trim().min(20).max(10000) }), request.body);
    response.status(202).json(await service.startFeedbackDraft(
      request.auth.user,
      request.params.bookingId,
      input,
      request.get("Idempotency-Key"),
      request.correlationId,
    ));
  }));

  router.get("/bookings/:bookingId/feedback-drafts", requireRole("MENTOR"), asyncHandler(async (request, response) => {
    response.json(await service.getFeedbackDraft(request.auth.user, request.params.bookingId));
  }));

  router.patch("/bookings/:bookingId/feedback-drafts/:draftId", requireRole("MENTOR"), asyncHandler(async (request, response) => {
    const input = parse(feedbackDraftSchema.extend({
      status: z.enum(["DRAFT", "USED", "DISCARDED"]).default("DRAFT"),
      version: z.number().int().positive(),
    }), request.body);
    response.json(await service.updateFeedbackDraft(
      request.auth.user,
      request.params.bookingId,
      request.params.draftId,
      input,
      request.correlationId,
    ));
  }));

  router.get("/bookings/:bookingId/feedback", requireAuth, asyncHandler(async (request, response) => {
    response.json(await service.getFeedback(request.auth.user, request.params.bookingId));
  }));

  router.post("/bookings/:bookingId/feedback", requireRole("MENTOR"), asyncHandler(async (request, response) => {
    const input = parse(feedbackDraftSchema.extend({ draftId: z.guid().optional() }), request.body);
    response.status(201).json(await service.createFeedback(request.auth.user, request.params.bookingId, input, request.correlationId));
  }));

  router.post("/bookings/:bookingId/feedback/apply", requireRole("STUDENT"), asyncHandler(async (request, response) => {
    const input = parse(z.object({ actionIds: z.array(z.guid()).min(1).max(20) }), request.body);
    response.json(await service.applyFeedback(request.auth.user, request.params.bookingId, input, request.correlationId));
  }));

  router.post("/bookings/:bookingId/completion-disputes", requireRole("STUDENT"), asyncHandler(async (request, response) => {
    const input = parse(z.object({
      reason: z.string().trim().min(10).max(2000),
      evidenceMetadata: z.record(z.string(), z.string().max(500)).default({}),
    }), request.body);
    response.status(202).json(await service.createCompletionDispute(
      request.auth.user,
      request.params.bookingId,
      input,
      request.correlationId,
    ));
  }));

  router.post("/bookings/:bookingId/operation-cases/:caseId/actions", requireAuth, asyncHandler(async (request, response) => {
    const input = parse(z.object({
      action: z.enum(["APPROVE", "DISMISS"]),
      reason: z.string().trim().min(5).max(2000),
      version: z.number().int().positive(),
    }), request.body);
    response.json(await service.resolveParticipantCase(
      request.auth.user,
      request.params.bookingId,
      request.params.caseId,
      input,
      request.get("Idempotency-Key"),
      request.correlationId,
    ));
  }));

  router.post("/bookings/:bookingId/review", requireRole("STUDENT"), asyncHandler(async (request, response) => {
    const input = parse(z.object({ rating: z.number().int().min(1).max(5), comment: z.string().trim().max(2000).optional() }), request.body);
    response.status(201).json(await service.createReview(request.auth.user, request.params.bookingId, input, request.correlationId));
  }));

  return router;
}
