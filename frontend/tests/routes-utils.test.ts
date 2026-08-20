import { describe, expect, it } from "vitest";
import { routes } from "../src/app/routePaths";
import { cn } from "../src/shared/utils/cn";

describe("route builders and class-name utility", () => {
  it("builds resource routes with identifiers and route placeholders", () => {
    const cases: Array<[string, string]> = [
      [routes.question("question-1"), "/questions/question-1"],
      [routes.mentor("mentor-1"), "/mentors/mentor-1"],
      [routes.booking("booking-1"), "/bookings/booking-1"],
      [routes.session("session-1"), "/sessions/session-1"],
      [routes.feedback("booking-1"), "/bookings/booking-1/feedback"],
      [routes.review("booking-1"), "/bookings/booking-1/review"],
      [routes.jobDescriptionReview("jd-1"), "/job-descriptions/jd-1/review"],
      [routes.jobDescriptionMapping("jd-1"), "/job-descriptions/jd-1/mapping"],
      [routes.jobDescriptionRecommendations("jd-1"), "/job-descriptions/jd-1/recommendations"],
      [routes.preparationPlan("plan-1"), "/preparation-plans/plan-1"],
      [routes.mentorBooking("booking-1"), "/mentor/bookings/booking-1"],
      [routes.mentorSession("session-1"), "/mentor/sessions/session-1"],
      [routes.mentorFeedback("booking-1"), "/mentor/feedback/booking-1"],
      [routes.adminMentorReview("mentor-1"), "/admin/mentors/mentor-1/review"],
      [routes.adminCase("case-1"), "/admin/cases/case-1"],
      [routes.adminAudit("audit-1"), "/admin/audit/audit-1"],
    ];

    expect(cases.every(([actual, expected]) => actual === expected)).toBe(true);
    expect(routes.mentorBooking()).toBe("/mentor/bookings/:bookingId");
  });

  it("joins only truthy class names in input order", () => {
    expect(cn("button", false, null, undefined, "button-primary")).toBe("button button-primary");
    expect(cn(false, null, undefined)).toBe("");
  });
});
