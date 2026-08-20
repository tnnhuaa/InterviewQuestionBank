import { describe, expect, it } from "vitest";
import {
  canAccessPath,
  homePathForUser,
  postLoginPath,
  requiredRoleForPath,
} from "../src/app/access";
import { routes } from "../src/app/routePaths";
import type { SessionUser } from "../src/app/AppContext";

const student: SessionUser = { id: "student-1", email: "student@example.test", displayName: "Student", roles: ["STUDENT"] };
const mentor: SessionUser = { id: "mentor-1", email: "mentor@example.test", displayName: "Mentor", roles: ["STUDENT", "MENTOR"] };
const admin: SessionUser = { id: "admin-1", email: "admin@example.test", displayName: "Admin", roles: ["ADMIN"] };

describe("route access policy", () => {
  it.each([
    ["/admin", "admin"],
    ["/admin/cases/1", "admin"],
    ["/mentor/bookings", "mentor"],
    ["/student/dashboard", "student"],
    ["/job-descriptions/new", "student"],
    ["/preparation-plans/1", "student"],
    ["/bookings/1", "student"],
    ["/sessions/1", "student"],
    ["/homepage", null],
  ])("maps %s to the required role", (pathname, role) => {
    expect(requiredRoleForPath(pathname)).toBe(role);
  });

  it("allows public and owned role paths while rejecting other roles", () => {
    expect(canAccessPath(student, routes.home)).toBe(true);
    expect(canAccessPath(student, routes.studentDashboard)).toBe(true);
    expect(canAccessPath(student, routes.mentorBookings)).toBe(false);
    expect(canAccessPath(mentor, routes.mentorBookings)).toBe(true);
    expect(canAccessPath(admin, routes.adminQueue)).toBe(true);
    expect(canAccessPath(admin, routes.studentDashboard)).toBe(false);
  });

  it("rejects malformed or protocol-relative return paths", () => {
    expect(canAccessPath(student, "https://evil.example.test")).toBe(false);
    expect(canAccessPath(student, "//evil.example.test")).toBe(false);
  });

  it("selects the highest-priority home for each persona", () => {
    expect(homePathForUser(student)).toBe(routes.studentDashboard);
    expect(homePathForUser(mentor)).toBe(routes.mentorBookings);
    expect(homePathForUser(admin)).toBe(routes.adminQueue);
  });

  it("uses only an authorized non-login return path after login", () => {
    expect(postLoginPath(student, routes.questions)).toBe(routes.questions);
    expect(postLoginPath(student, routes.login)).toBe(routes.studentDashboard);
    expect(postLoginPath(student, routes.adminQueue)).toBe(routes.studentDashboard);
    expect(postLoginPath(admin)).toBe(routes.adminQueue);
  });
});
