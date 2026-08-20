import { describe, expect, it } from "vitest";
import { prepareBookingRequest } from "../src/features/student/booking-request";

describe("prepareBookingRequest", () => {
  it("reuses the idempotency key for an unchanged booking retry", () => {
    const input = { mentorId: "mentor-1", slotId: "slot-1", goal: "Luyện React hooks" };
    const first = prepareBookingRequest(null, input, () => "booking-key-1");

    const retry = prepareBookingRequest(first, input, () => "booking-key-2");

    expect(retry).toBe(first);
    expect(retry.idempotencyKey).toBe("booking-key-1");
  });

  it("creates a new key when the submitted booking data changes", () => {
    const first = prepareBookingRequest(null, { goal: "Luyện React hooks" }, () => "booking-key-1");

    const changed = prepareBookingRequest(first, { goal: "Luyện TypeScript" }, () => "booking-key-2");

    expect(changed.idempotencyKey).toBe("booking-key-2");
  });

  it("creates the first attempt without mutating submitted data", () => {
    const input = { mentorId: "mentor-1", selectedTopicIds: ["topic-1"] };

    const attempt = prepareBookingRequest(null, input, () => "booking-key-1");

    expect(JSON.parse(attempt.payload)).toEqual(input);
    expect(input).toEqual({ mentorId: "mentor-1", selectedTopicIds: ["topic-1"] });
  });
});
