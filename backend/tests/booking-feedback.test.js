import { describe, expect, it } from "vitest";
import { assertCanCreateFeedback } from "../src/modules/bookings/service.js";

describe("structured feedback guard (AC-15-01)", () => {
  const mentor = { id: "mentor-user-1" };

  it("allows the owning mentor to create feedback for a completed booking", () => {
    expect(() => assertCanCreateFeedback({ mentor_user_id: mentor.id, state: "COMPLETED" }, mentor)).not.toThrow();
  });

  it.each(["PENDING", "CONFIRMED", "RESCHEDULE_PROPOSED", "REJECTED", "CANCELLED", "NO_SHOW"])(
    "rejects feedback while booking state is %s",
    (state) => {
      expect(() => assertCanCreateFeedback({ mentor_user_id: mentor.id, state }, mentor)).toThrowError(
        expect.objectContaining({ status: 404, code: "RESOURCE_NOT_FOUND" }),
      );
    },
  );

  it("rejects a mentor who does not own the completed booking", () => {
    expect(() => assertCanCreateFeedback({ mentor_user_id: "another-mentor", state: "COMPLETED" }, mentor)).toThrowError(
      expect.objectContaining({ status: 404, code: "RESOURCE_NOT_FOUND" }),
    );
  });
});
