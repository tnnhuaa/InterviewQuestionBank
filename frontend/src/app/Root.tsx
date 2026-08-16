import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AppProvider, useApp, type Role } from "@/app/AppContext";
import DemoBar from "@/shared/components/DemoBar";

function requiredRole(pathname: string): Exclude<Role, "public"> | null {
  if (pathname.startsWith("/admin")) return "admin";
  if (pathname.startsWith("/mentor/")) return "mentor";
  if (pathname.startsWith("/student") || pathname.startsWith("/job-descriptions") || pathname.startsWith("/preparation-plans") || pathname.startsWith("/bookings") || pathname.startsWith("/sessions")) return "student";
  return null;
}

function RouteAccess() {
  const { pathname } = useLocation();
  const { role, sessionLoading } = useApp();
  const required = requiredRole(pathname);
  if (sessionLoading) return <div className="grid min-h-screen place-items-center bg-canvas text-sm text-ink-secondary">Đang kiểm tra phiên đăng nhập…</div>;
  if (required && role !== required && import.meta.env.VITE_ENABLE_DEMO_TOOLS !== "true") return <Navigate to="/login" replace state={{ returnTo: pathname }} />;
  return <Outlet />;
}

export default function Root() {
  return <AppProvider>{import.meta.env.VITE_ENABLE_DEMO_TOOLS === "true" && <DemoBar />}<RouteAccess /></AppProvider>;
}
