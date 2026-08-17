import type { Role, SessionUser } from "./AppContext";
import { routes } from "./routePaths";

export function requiredRoleForPath(pathname: string): Exclude<Role, "public"> | null {
  if (pathname.startsWith("/admin")) return "admin";
  if (pathname.startsWith("/mentor/")) return "mentor";
  if (
    pathname.startsWith("/student")
    || pathname.startsWith("/job-descriptions")
    || pathname.startsWith("/preparation-plans")
    || pathname.startsWith("/bookings")
    || pathname.startsWith("/sessions")
  ) return "student";
  return null;
}

export function canAccessPath(user: SessionUser, pathname: string) {
  if (!pathname.startsWith("/") || pathname.startsWith("//")) return false;
  const requiredRole = requiredRoleForPath(pathname);
  if (!requiredRole) return true;
  return user.roles.includes(requiredRole.toUpperCase() as "STUDENT" | "MENTOR" | "ADMIN");
}

export function homePathForUser(user: SessionUser) {
  if (user.roles.includes("ADMIN")) return routes.adminQueue;
  if (user.roles.includes("MENTOR")) return routes.mentorBookings;
  return routes.studentDashboard;
}

export function postLoginPath(user: SessionUser, returnTo?: string) {
  return returnTo && returnTo !== routes.login && canAccessPath(user, returnTo)
    ? returnTo
    : homePathForUser(user);
}
