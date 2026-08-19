import { describe, expect, it, vi } from "vitest";
import { assertRescheduleProposalLimit } from "../src/modules/bookings/service.js";

describe("booking reschedule proposal limit (AC-12-02)", () => {
  it("allows a new proposal when fewer than two proposals exist", async () => {
    const query = vi.fn().mockResolvedValue({ rows: [{ count: 1 }] });

    await expect(assertRescheduleProposalLimit({ query }, "booking-1")).resolves.toBeUndefined();
    expect(query).toHaveBeenCalledWith(
      "SELECT count(*)::int AS count FROM booking_reschedule_proposals WHERE booking_id = $1",
      ["booking-1"],
    );
  });

  it("rejects the third proposal even when earlier proposals were rejected", async () => {
    const query = vi.fn().mockResolvedValue({ rows: [{ count: 2 }] });

    await expect(assertRescheduleProposalLimit({ query }, "booking-1")).rejects.toMatchObject({
      status: 409,
      code: "RESCHEDULE_LIMIT_REACHED",
    });
  });
});
