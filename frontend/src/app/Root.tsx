import { useEffect, type ReactNode } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AppProvider, useApp, type Role } from "@/app/AppContext";
import DemoBar from "@/shared/components/DemoBar";

function inferRole(pathname: string): Role | null {
  if (pathname.startsWith("/admin")) return "admin";
  if (pathname.startsWith("/mentor/")) return "mentor";
  if (
    pathname.startsWith("/student") ||
    pathname.startsWith("/job-descriptions") ||
    pathname.startsWith("/preparation-plans") ||
    pathname.startsWith("/bookings") ||
    pathname.startsWith("/sessions")
  ) {
    return "student";
  }
  if (pathname === "/homepage" || pathname === "/login") return "public";
  return null;
}

function RouteRoleSync({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const { role, setRole } = useApp();

  useEffect(() => {
    const routeRole = inferRole(pathname);
    if (routeRole && routeRole !== role) setRole(routeRole);
  }, [pathname, role, setRole]);

  return children;
}

export default function Root() {
  return (
    <AppProvider>
      <RouteRoleSync>
        {(import.meta.env.DEV || import.meta.env.VITE_ENABLE_DEMO_TOOLS === "true") && <DemoBar />}
        <Outlet />
      </RouteRoleSync>
    </AppProvider>
  );
}
