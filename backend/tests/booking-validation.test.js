import { describe, expect, it } from "vitest";
import { createBookingSchema } from "../src/modules/bookings/validation.js";

const ids = {
  mentorId: "00000000-0000-0000-0000-000000000001",
  slotId: "00000000-0000-0000-0000-000000000002",
  jobDescriptionId: "00000000-0000-0000-0000-000000000003",
  preparationPlanId: "00000000-0000-0000-0000-000000000004",
  topicId: "00000000-0000-0000-0000-000000000005",
};

const validDirectBooking = {
  mentorId: ids.mentorId,
  slotId: ids.slotId,
  jobDescriptionId: ids.jobDescriptionId,
  selectedTopicIds: [ids.topicId],
  goal: "Luyện trả lời câu hỏi React hooks",
  interviewType: "Technical Interview",
};

describe("create booking validation", () => {
  it("accepts a booking with a JD-owned context payload", () => {
    expect(createBookingSchema.safeParse(validDirectBooking).success).toBe(true);
  });

  it("rejects a request without JD or preparation-plan context", () => {
    const withoutContext = { ...validDirectBooking, jobDescriptionId: undefined };

    expect(createBookingSchema.safeParse(withoutContext).success).toBe(false);
  });

  it("requires the version when booking from a preparation plan", () => {
    const planBooking = { ...validDirectBooking, jobDescriptionId: undefined };

    expect(createBookingSchema.safeParse({ ...planBooking, preparationPlanId: ids.preparationPlanId }).success).toBe(false);
    expect(createBookingSchema.safeParse({ ...planBooking, preparationPlanId: ids.preparationPlanId, preparationPlanVersion: 1 }).success).toBe(true);
  });
});
