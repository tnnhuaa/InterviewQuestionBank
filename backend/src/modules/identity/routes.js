import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { asyncHandler } from "../../shared/async-handler.js";
import { parse } from "../../shared/validation.js";
import { requireAuth, requireRole, sessionCookieName, sessionCookieOptions } from "../../middleware/auth.js";
import { createIdentityService } from "./service.js";

const password = z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự").max(128);
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: true, legacyHeaders: false });

export function createIdentityRouter({ pool, environment }) {
  const router = Router();
  const service = createIdentityService({ pool, environment });

  router.post("/auth/register", authLimiter, asyncHandler(async (request, response) => {
    const input = parse(z.object({
      email: z.email("Email không hợp lệ"),
      password,
      displayName: z.string().trim().min(2).max(100),
    }), request.body);
    const result = await service.register({ ...input, correlationId: request.correlationId });
    response.status(201).json(result);
  }));

  router.post("/auth/verify-email", authLimiter, asyncHandler(async (request, response) => {
    const input = parse(z.object({ token: z.string().min(20) }), request.body);
    response.json(await service.verifyEmail({ ...input, correlationId: request.correlationId }));
  }));

  router.post("/auth/login", authLimiter, asyncHandler(async (request, response) => {
    const input = parse(z.object({ email: z.email(), password: z.string().min(1).max(128) }), request.body);
    const result = await service.login(input);
    response.cookie(sessionCookieName(environment), result.sessionToken, sessionCookieOptions(environment));
    response.json({ user: result.user, session: result.session, csrfToken: result.csrfToken });
  }));

  router.post("/auth/logout", requireAuth, asyncHandler(async (request, response) => {
    await service.logout(request.auth.session.id);
    response.clearCookie(sessionCookieName(environment), sessionCookieOptions(environment));
    response.status(204).end();
  }));

  router.get("/auth/csrf", requireAuth, asyncHandler(async (request, response) => {
    response.json({ csrfToken: await service.rotateCsrf(request.auth.session.id) });
  }));

  router.post("/auth/forgot-password", authLimiter, asyncHandler(async (request, response) => {
    const { email } = parse(z.object({ email: z.email() }), request.body);
    await service.forgotPassword(email);
    response.status(202).json({ accepted: true });
  }));

  router.post("/auth/reset-password", authLimiter, asyncHandler(async (request, response) => {
    const input = parse(z.object({ token: z.string().min(20), password }), request.body);
    await service.resetPassword({ ...input, correlationId: request.correlationId });
    response.status(204).end();
  }));

  router.post("/auth/accept-admin-invite", authLimiter, asyncHandler(async (request, response) => {
    const input = parse(z.object({
      token: z.string().min(20),
      password,
      displayName: z.string().trim().min(2).max(100),
    }), request.body);
    response.json(await service.acceptAdminInvite({ ...input, correlationId: request.correlationId }));
  }));

  router.get("/me", requireAuth, (request, response) => response.json(request.auth.user));

  router.get("/student-profile", requireRole("STUDENT"), asyncHandler(async (request, response) => {
    response.json(await service.getProfile(request.auth.user.id));
  }));

  router.patch("/student-profile", requireRole("STUDENT"), asyncHandler(async (request, response) => {
    const input = parse(z.object({
      targetPosition: z.string().trim().max(120).nullable().optional(),
      interviewType: z.string().trim().max(80).nullable().optional(),
      interviewGoal: z.string().trim().max(1000).nullable().optional(),
      interviewDate: z.iso.date().nullable().optional(),
      timezone: z.string().trim().min(1).max(80),
      version: z.number().int().positive(),
    }), request.body);
    response.json(await service.updateProfile(request.auth.user.id, input));
  }));

  return router;
}
