import { describe, expect, it, vi } from "vitest";
import { findIdempotentResult, requestHash, saveIdempotentResult } from "../src/platform/idempotency.js";

const actorId = "00000000-0000-0000-0000-000000000001";

function fakeClient(record = null) {
  return {
    query: async (sql) => {
      if (sql.includes("pg_advisory_xact_lock")) return { rowCount: 1, rows: [{ locked: true }] };
      if (sql.includes("FROM idempotency_records")) return record
        ? { rowCount: 1, rows: [record] }
        : { rowCount: 0, rows: [] };
      throw new Error(`Unexpected query: ${sql}`);
    },
  };
}

describe("booking idempotency", () => {
  const input = { mentorId: "mentor-1", slotId: "slot-1", goal: "Luyện React hooks" };

  it("returns the original booking result for the same key and payload", async () => {
    const first = await findIdempotentResult(fakeClient(), {
      actorId, operation: "BOOKING_CREATE", key: "booking-key", input,
    });
    const retry = await findIdempotentResult(fakeClient({
      request_hash: first.digest, response_status: 201, response_body: { id: "booking-1" }, resource_id: "booking-1",
    }), { actorId, operation: "BOOKING_CREATE", key: "booking-key", input });

    expect(retry.cached.response_body).toEqual({ id: "booking-1" });
  });

  it("rejects a changed booking payload reused with the same key", async () => {
    const original = await findIdempotentResult(fakeClient(), {
      actorId, operation: "BOOKING_CREATE", key: "booking-key", input,
    });

    await expect(findIdempotentResult(fakeClient({ request_hash: original.digest }), {
      actorId, operation: "BOOKING_CREATE", key: "booking-key", input: { ...input, goal: "Luyện TypeScript" },
    })).rejects.toMatchObject({ status: 409, code: "IDEMPOTENCY_KEY_REUSED" });
  });

  it("rejects a mutation without an idempotency key before querying the database", async () => {
    const client = { query: async () => { throw new Error("must not query"); } };

    await expect(findIdempotentResult(client, {
      actorId, operation: "BOOKING_CREATE", key: "", input,
    })).rejects.toMatchObject({ status: 400, code: "IDEMPOTENCY_KEY_REQUIRED" });
  });

  it("hashes empty and equivalent inputs deterministically", () => {
    expect(requestHash()).toBe(requestHash({}));
    expect(requestHash(input)).toBe(requestHash({ ...input }));
    expect(requestHash(input)).not.toBe(requestHash({ ...input, goal: "Luyện TypeScript" }));
  });

  it("persists the original response and resource reference", async () => {
    const query = vi.fn().mockResolvedValue({ rowCount: 1 });
    const body = { id: "booking-1" };

    await saveIdempotentResult({ query }, {
      actorId,
      operation: "BOOKING_CREATE",
      key: "booking-key",
      digest: "digest-1",
      status: 201,
      body,
      resourceId: "booking-1",
    });

    expect(query).toHaveBeenCalledOnce();
    expect(query.mock.calls[0][1]).toEqual([
      actorId, "BOOKING_CREATE", "booking-key", "digest-1", 201, body, "booking-1",
    ]);
  });
});
