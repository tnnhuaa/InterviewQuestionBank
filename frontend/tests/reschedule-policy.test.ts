import { describe, expect, it } from "vitest";
import { isRescheduleProposalRecipient } from "../src/features/booking/reschedule-policy";

describe("isRescheduleProposalRecipient", () => {
  it("does not let the proposer respond to their own reschedule proposal", () => {
    expect(isRescheduleProposalRecipient("student-1", "student-1")).toBe(false);
  });

  it("lets the other booking participant respond", () => {
    expect(isRescheduleProposalRecipient("student-1", "mentor-1")).toBe(true);
  });

  it("hides the response actions until participant data is available", () => {
    expect(isRescheduleProposalRecipient("student-1", undefined)).toBe(false);
    expect(isRescheduleProposalRecipient(undefined, "mentor-1")).toBe(false);
  });
});
