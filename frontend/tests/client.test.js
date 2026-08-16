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
});

