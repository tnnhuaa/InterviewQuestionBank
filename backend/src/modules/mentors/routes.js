import { Router } from "express";
import multer from "multer";
import { z } from "zod";
import { requireAuth, requireRole } from "../../middleware/auth.js";
import { asyncHandler } from "../../shared/async-handler.js";
import { parse } from "../../shared/validation.js";
import { createMentorsService } from "./service.js";

const upload = multer({ storage: multer.memoryStorage(), limits: { files: 1, fileSize: 10 * 1024 * 1024 } });
const expertiseIdsSchema = (minimum = 0) => z.preprocess((value) => {
  if (typeof value !== "string") return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [value];
  } catch {
    return [value];
  }
}, z.array(z.guid()).min(minimum).max(20).optional());

const profileSchema = z.object({
  headline: z.string().trim().min(5).max(180),
  bio: z.string().trim().min(20).max(4000),
  timezone: z.string().trim().min(1).max(80),
  topicIds: expertiseIdsSchema(1),
  positionIds: expertiseIdsSchema(),
  expertiseEvidence: z.string().trim().max(1000).optional(),
});

export function createMentorsRouter({ pool, storage, environment }) {
  const router = Router();
  const service = createMentorsService({ pool, storage, environment });

  router.get("/mentors", asyncHandler(async (request, response) => {
    const query = parse(z.object({
      topic: z.string().max(100).optional(),
      availableFrom: z.iso.datetime().optional(),
      page: z.coerce.number().int().positive().default(1),
      pageSize: z.coerce.number().int().min(1).max(100).default(20),
    }), request.query);
    response.json(await service.listPublic(query));
  }));

  router.get("/mentors/:mentorId", asyncHandler(async (request, response) => {
    response.json(await service.getPublic(request.params.mentorId));
  }));

  router.get("/mentor-profile", requireAuth, asyncHandler(async (request, response) => {
    response.json(await service.getOwnProfile(request.auth.user.id));
  }));

  router.put("/mentor-profile", requireAuth, asyncHandler(async (request, response) => {
    response.json(await service.saveProfile(request.auth.user.id, parse(profileSchema, request.body)));
  }));

  router.post("/mentor-verifications", requireAuth, upload.single("evidence"), asyncHandler(async (request, response) => {
    const input = parse(profileSchema.extend({
      consent: z.literal("true", { message: "Cần xác nhận đồng ý xử lý bằng chứng xác minh" }),
    }), request.body);
    response.status(201).json(await service.submitVerification(
      request.auth.user.id, input, request.file, request.correlationId,
    ));
  }));

  router.get("/availability-slots", requireRole("MENTOR"), asyncHandler(async (request, response) => {
    response.json({ items: await service.listSlots(request.auth.user.id) });
  }));

  router.post("/availability-slots", requireRole("MENTOR"), asyncHandler(async (request, response) => {
    const input = parse(z.object({
      startsAt: z.iso.datetime(), endsAt: z.iso.datetime(), timezone: z.string().min(1).max(80),
    }).refine((value) => new Date(value.endsAt) > new Date(value.startsAt), {
      message: "Giờ kết thúc phải sau giờ bắt đầu", path: ["endsAt"],
    }).refine((value) => new Date(value.startsAt) > new Date(), {
      message: "Khung giờ phải ở tương lai", path: ["startsAt"],
    }), request.body);
    response.status(201).json(await service.createSlot(request.auth.user.id, input));
  }));

  router.delete("/availability-slots/:slotId", requireRole("MENTOR"), asyncHandler(async (request, response) => {
    const { version } = parse(z.object({ version: z.coerce.number().int().positive() }), request.query);
    await service.cancelSlot(request.auth.user.id, request.params.slotId, version);
    response.status(204).end();
  }));

  router.get("/admin/mentor-verifications", requireRole("ADMIN"), asyncHandler(async (request, response) => {
    void request;
    response.json(await service.listPendingVerification());
  }));

  router.get("/admin/mentor-verifications/:verificationId/evidence-link", requireRole("ADMIN"), asyncHandler(async (request, response) => {
    const access = service.createEvidenceAccess(request.params.verificationId);
    response.redirect(302, access.url);
  }));

  router.get("/admin/mentor-verifications/:verificationId/evidence", requireRole("ADMIN"), asyncHandler(async (request, response) => {
    const input = parse(z.object({
      expires: z.coerce.number().int().positive(),
      signature: z.string().regex(/^[0-9a-f]{64}$/i),
    }), request.query);
    service.verifyEvidenceAccess(request.params.verificationId, input);
    const evidence = await service.getEvidence(request.params.verificationId);
    response.set("Cache-Control", "private, no-store");
    response.type(evidence.contentType).send(evidence.buffer);
  }));

  router.post("/admin/mentor-verifications/:verificationId/decision", requireRole("ADMIN"), asyncHandler(async (request, response) => {
    const input = parse(z.object({
      decision: z.enum(["APPROVED", "REJECTED"]),
      reason: z.string().trim().min(3).max(1000),
      version: z.number().int().positive(),
    }), request.body);
    response.json(await service.decideVerification(
      request.auth.user.id, request.params.verificationId, input, request.correlationId,
    ));
  }));

  return router;
}
