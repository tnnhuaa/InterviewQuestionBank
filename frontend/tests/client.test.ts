import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  ApiError,
  apiFetch,
  createIdempotencyKey,
  setCsrfToken,
} from "../src/shared/api/client";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function inputUrl(input: RequestInfo | URL) {
  return typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
}

describe("apiFetch", () => {
  beforeEach(() => setCsrfToken(null));
  afterEach(() => {
    setCsrfToken(null);
    vi.unstubAllGlobals();
  });

  it("uses the API base URL and parses successful JSON", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ status: "ok" }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(apiFetch("/health")).resolves.toEqual({ status: "ok" });

    const request = fetchMock.mock.calls[0][0] as Request;
    expect(new URL(inputUrl(request)).pathname).toBe("/api/v1/health");
    expect(request.method).toBe("GET");
    expect(request.headers.get("Accept")).toBe("application/json");
  });

  it("throws a typed error with safe defaults for a non-JSON failure", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 503 })));

    const error = await apiFetch("/ready").catch((caughtError) => caughtError);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({
      status: 503,
      code: "REQUEST_FAILED",
      correlationId: null,
      fieldErrors: {},
      recovery: { kind: "NONE", retryable: false, retryAfterSeconds: null },
    });
  });

  it("serializes JSON requests and preserves CSRF and custom headers", async () => {
    setCsrfToken("csrf-1");
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ id: "booking-1" }, 201));
    vi.stubGlobal("fetch", fetchMock);

    await apiFetch("/bookings", {
      method: "POST",
      json: { mentorId: "mentor-1" },
      headers: { "Idempotency-Key": "request-1" },
    });

    const request = fetchMock.mock.calls[0][0] as Request;
    expect(request.method).toBe("POST");
    expect(request.headers.get("Content-Type")).toBe("application/json");
    expect(request.headers.get("Idempotency-Key")).toBe("request-1");
    expect(request.headers.get("X-CSRF-Token")).toBe("csrf-1");
    await expect(request.clone().json()).resolves.toEqual({ mentorId: "mentor-1" });
  });

  it("exposes the structured API error envelope", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({
      message: "Hãy kiểm tra các trường được đánh dấu",
      code: "VALIDATION_ERROR",
      correlationId: "correlation-1",
      fieldErrors: { startsAt: "Slot không còn khả dụng" },
      recovery: { kind: "SELECT_ANOTHER_SLOT", retryable: false, retryAfterSeconds: null },
    }, 422)));

    const error = await apiFetch("/bookings").catch((caughtError) => caughtError);

    expect(error).toMatchObject({
      status: 422,
      code: "VALIDATION_ERROR",
      correlationId: "correlation-1",
      fieldErrors: { startsAt: "Slot không còn khả dụng" },
      recovery: { kind: "SELECT_ANOTHER_SLOT" },
    });
  });

  it("returns null for a successful 204 response", async () => {
    setCsrfToken("csrf-1");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 204 })));

    await expect(apiFetch("/auth/logout", { method: "POST" })).resolves.toBeNull();
  });

  it("refreshes an invalid CSRF token once and retries the mutation", async () => {
    setCsrfToken("stale-token");
    let bookingAttempts = 0;
    const fetchMock = vi.fn().mockImplementation(async (input: RequestInfo | URL) => {
      const pathname = new URL(inputUrl(input)).pathname;
      if (pathname === "/api/v1/auth/csrf") return jsonResponse({ csrfToken: "fresh-token" });
      bookingAttempts += 1;
      return bookingAttempts === 1
        ? jsonResponse({ code: "CSRF_INVALID", message: "CSRF invalid" }, 403)
        : jsonResponse({ id: "booking-1" }, 201);
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(apiFetch("/bookings", { method: "POST", json: { goal: "Practice" } }))
      .resolves.toEqual({ id: "booking-1" });

    expect(bookingAttempts).toBe(2);
    const bookingRequests = fetchMock.mock.calls
      .map(([input]) => input)
      .filter((input) => new URL(inputUrl(input)).pathname === "/api/v1/bookings") as Request[];
    expect(bookingRequests[0].headers.get("X-CSRF-Token")).toBe("stale-token");
    expect(bookingRequests[1].headers.get("X-CSRF-Token")).toBe("fresh-token");
  });

  it("stops a mutation when CSRF refresh reports an anonymous session", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 401 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(apiFetch("/bookings", { method: "POST", json: {} })).rejects.toMatchObject({
      status: 401,
    });
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("exposes a structured failure when the CSRF endpoint is unavailable", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(jsonResponse({
      code: "DATABASE_UNAVAILABLE",
      message: "Database unavailable",
      correlationId: "correlation-2",
      recovery: { kind: "WAIT", retryable: true, retryAfterSeconds: 10 },
    }, 503)));

    await expect(apiFetch("/bookings", { method: "POST", json: {} })).rejects.toMatchObject({
      status: 503,
      code: "DATABASE_UNAVAILABLE",
      correlationId: "correlation-2",
      recovery: { kind: "WAIT", retryable: true, retryAfterSeconds: 10 },
    });
  });

  it("creates a UUID idempotency key", () => {
    expect(createIdempotencyKey()).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  });
});
