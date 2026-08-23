import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError, apiFetch, setCsrfToken } from "../src/shared/api/client.js";

describe("apiFetch", () => {
  afterEach(() => {
    setCsrfToken(null);
    vi.unstubAllGlobals();
  });

  function jsonResponse(body, status = 200) {
    return new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }

  it("uses the relative API base URL", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ status: "ok" }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(apiFetch("/health")).resolves.toEqual({ status: "ok" });
    const request = fetchMock.mock.calls[0][0];
    expect(request.url).toMatch(/\/api\/v1\/health$/);
    expect(request.cache).toBe("no-store");
    expect(request.headers.get("Accept")).toBe("application/json");
  });

  it("throws a typed error for non-success responses", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({}, 503)));

    const error = await apiFetch("/ready").catch((caughtError) => caughtError);
    expect(error).toBeInstanceOf(ApiError);
    expect(error.status).toBe(503);
  });

  it("serializes JSON requests and preserves custom headers", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ id: "booking-1" }, 201));
    vi.stubGlobal("fetch", fetchMock);
    setCsrfToken("csrf-test-token");

    await apiFetch("/bookings", {
      method: "POST",
      json: { mentorId: "mentor-1" },
      headers: { "Idempotency-Key": "request-1" },
    });

    const request = fetchMock.mock.calls[0][0];
    expect(request.url).toMatch(/\/api\/v1\/bookings$/);
    expect(request.method).toBe("POST");
    expect(await request.clone().json()).toEqual({ mentorId: "mentor-1" });
    expect(request.headers.get("Accept")).toBe("application/json");
    expect(request.headers.get("Content-Type")).toBe("application/json");
    expect(request.headers.get("Idempotency-Key")).toBe("request-1");
    expect(request.headers.get("X-CSRF-Token")).toBe("csrf-test-token");
  });

  it("exposes the structured API error envelope", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        jsonResponse({
          message: "Please correct the highlighted fields",
          code: "VALIDATION_ERROR",
          correlationId: "correlation-1",
          fieldErrors: { startsAt: "This slot is no longer available" },
        }, 422),
      ),
    );
    setCsrfToken("csrf-test-token");

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

