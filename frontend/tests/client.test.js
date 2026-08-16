import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError, apiFetch } from "../src/shared/api/client.js";

describe("apiFetch", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("uses the relative API base URL", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ status: "ok" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(apiFetch("/health")).resolves.toEqual({ status: "ok" });
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/v1/health",
      expect.objectContaining({ headers: { Accept: "application/json" } }),
    );
  });

  it("throws a typed error for non-success responses", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 503 }));

    const error = await apiFetch("/ready").catch((caughtError) => caughtError);
    expect(error).toBeInstanceOf(ApiError);
    expect(error.status).toBe(503);
  });

  it("serializes JSON requests and preserves custom headers", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({ id: "booking-1" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    await apiFetch("/bookings", {
      method: "POST",
      json: { mentorId: "mentor-1" },
      headers: { "Idempotency-Key": "request-1" },
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/v1/bookings",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ mentorId: "mentor-1" }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Idempotency-Key": "request-1",
        },
      }),
    );
  });

  it("exposes the structured API error envelope", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 422,
        json: async () => ({
          message: "Please correct the highlighted fields",
          code: "VALIDATION_ERROR",
          correlationId: "correlation-1",
          fieldErrors: { startsAt: "This slot is no longer available" },
        }),
      }),
    );

    const error = await apiFetch("/bookings", { method: "POST", json: {} }).catch(
      (caughtError) => caughtError,
    );

    expect(error).toMatchObject({
      status: 422,
      code: "VALIDATION_ERROR",
      correlationId: "correlation-1",
      fieldErrors: { startsAt: "This slot is no longer available" },
    });
  });
});

