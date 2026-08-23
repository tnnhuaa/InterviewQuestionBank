import { describe, expect, it, vi } from "vitest";
import {
  connectWithTransientRetry,
  queryWithTransientRetry,
} from "../src/platform/db/retry.js";

function aggregateConnectionError(code = "ECONNRESET") {
  return new AggregateError(
    [
      Object.assign(new Error("connection failed"), {
        code,
        syscall: "connect",
      }),
    ],
    "all connection attempts failed",
  );
}

describe("transient database retry", () => {
  it("retries a safe query once after a nested connection failure", async () => {
    const expected = { rows: [{ id: "user-id" }] };
    const pool = {
      query: vi
        .fn()
        .mockRejectedValueOnce(aggregateConnectionError())
        .mockResolvedValueOnce(expected),
    };

    await expect(
      queryWithTransientRetry(pool, "SELECT 1", [], { retryDelayMs: 0 }),
    ).resolves.toBe(expected);
    expect(pool.query).toHaveBeenCalledTimes(2);
  });

  it("retries connection acquisition before a transaction starts", async () => {
    const client = { release: vi.fn() };
    const pool = {
      connect: vi
        .fn()
        .mockRejectedValueOnce(aggregateConnectionError("EACCES"))
        .mockResolvedValueOnce(client),
    };

    await expect(
      connectWithTransientRetry(pool, { retryDelayMs: 0 }),
    ).resolves.toBe(client);
    expect(pool.connect).toHaveBeenCalledTimes(2);
  });

  it("does not retry a non-transient database error", async () => {
    const constraintError = Object.assign(new Error("duplicate"), {
      code: "23505",
    });
    const pool = { query: vi.fn().mockRejectedValue(constraintError) };

    await expect(
      queryWithTransientRetry(pool, "SELECT 1", [], { retryDelayMs: 0 }),
    ).rejects.toBe(constraintError);
    expect(pool.query).toHaveBeenCalledTimes(1);
  });
});
