import { describe, expect, it, vi } from "vitest";
import { createMentorsService } from "../src/modules/mentors/service.js";

function serviceWithQuery(query) {
  return createMentorsService({
    pool: { query },
    storage: {},
    environment: { sessionSecret: "test-secret" },
  });
}

const validInput = {
  startsAt: "2099-08-20T02:00:00.000Z",
  endsAt: "2099-08-20T03:00:00.000Z",
  timezone: "Asia/Ho_Chi_Minh",
};

describe("mentor availability (AC-09-01 / TC-SLOT)", () => {
  it("returns pending booking metadata for listed slots", async () => {
    const query = vi.fn().mockResolvedValue({
      rowCount: 2,
      rows: [
        { id: "slot-open", starts_at: validInput.startsAt, ends_at: validInput.endsAt,
          source_timezone: validInput.timezone, status: "AVAILABLE", version: 1,
          pending_booking_count: 0, deletable: true },
        { id: "slot-pending", starts_at: validInput.startsAt, ends_at: validInput.endsAt,
          source_timezone: validInput.timezone, status: "AVAILABLE", version: 2,
          pending_booking_count: 2, deletable: false },
      ],
    });
    const service = serviceWithQuery(query);

    await expect(service.listSlots("mentor-user-1")).resolves.toEqual([
      expect.objectContaining({ id: "slot-open", pendingBookingCount: 0, deletable: true }),
      expect.objectContaining({ id: "slot-pending", pendingBookingCount: 2, deletable: false }),
    ]);

    const [sql, params] = query.mock.calls[0];
    expect(sql).toContain("b.state = 'PENDING'");
    expect(sql).toContain("'PENDING', 'CONFIRMED', 'RESCHEDULE_PROPOSED'");
    expect(params).toEqual(["mentor-user-1"]);
  });

  it("creates a future non-overlapping slot and preserves source timezone", async () => {
    const query = vi.fn().mockResolvedValue({
      rowCount: 1,
      rows: [{
        id: "slot-1",
        starts_at: validInput.startsAt,
        ends_at: validInput.endsAt,
        source_timezone: validInput.timezone,
        status: "AVAILABLE",
        version: 1,
      }],
    });
    const service = serviceWithQuery(query);

    await expect(service.createSlot("mentor-user-1", validInput)).resolves.toMatchObject({
      id: "slot-1",
      timezone: "Asia/Ho_Chi_Minh",
      status: "AVAILABLE",
      version: 1,
    });

    expect(query).toHaveBeenCalledWith(
      expect.stringContaining("verification_status = 'APPROVED'"),
      ["mentor-user-1", validInput.startsAt, validInput.endsAt, validInput.timezone],
    );
  });

  it("rejects a slot in the past before writing to the database", async () => {
    const query = vi.fn();
    const service = serviceWithQuery(query);

    await expect(service.createSlot("mentor-user-1", {
      ...validInput,
      startsAt: "2020-01-01T02:00:00.000Z",
      endsAt: "2020-01-01T03:00:00.000Z",
    })).rejects.toMatchObject({ code: "SLOT_IN_PAST", status: 422 });
    expect(query).not.toHaveBeenCalled();
  });

  it("rejects an end time that is not after the start time", async () => {
    const query = vi.fn();
    const service = serviceWithQuery(query);

    await expect(service.createSlot("mentor-user-1", {
      ...validInput,
      endsAt: validInput.startsAt,
    })).rejects.toMatchObject({ code: "INVALID_SLOT_RANGE", status: 422 });
    expect(query).not.toHaveBeenCalled();
  });

  it("rejects an unapproved mentor", async () => {
    const query = vi.fn().mockResolvedValue({ rowCount: 0, rows: [] });
    const service = serviceWithQuery(query);

    await expect(service.createSlot("mentor-user-1", validInput)).rejects.toMatchObject({
      code: "MENTOR_NOT_APPROVED",
      status: 403,
    });
  });

  it("maps the PostgreSQL overlap constraint to a stable 409 conflict", async () => {
    const overlap = Object.assign(new Error("conflicting key value violates exclusion constraint"), { code: "23P01" });
    const query = vi.fn().mockRejectedValue(overlap);
    const service = serviceWithQuery(query);

    await expect(service.createSlot("mentor-user-1", validInput)).rejects.toMatchObject({
      code: "SLOT_OVERLAP",
      status: 409,
    });
  });

  it("uses optimistic versioning and protects slots referenced by active booking requests", async () => {
    const query = vi.fn().mockResolvedValue({ rowCount: 0, rows: [] });
    const service = serviceWithQuery(query);

    await expect(service.cancelSlot("mentor-user-1", "slot-1", 3)).rejects.toMatchObject({
      code: "SLOT_NOT_EDITABLE",
      status: 409,
    });

    const [sql, params] = query.mock.calls[0];
    expect(sql).toContain("s.version = $3");
    expect(sql).toContain("'PENDING', 'CONFIRMED', 'RESCHEDULE_PROPOSED'");
    expect(params).toEqual(["slot-1", "mentor-user-1", 3]);
  });
});