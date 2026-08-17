import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AppProvider, useApp } from "@/app/AppContext";
import { canAccessPath, requiredRoleForPath } from "@/app/access";
import DemoBar from "@/shared/components/DemoBar";

function RouteAccess() {
  const { pathname } = useLocation();
  const { role, user, sessionLoading } = useApp();
  const required = requiredRoleForPath(pathname);
  if (sessionLoading) return <div className="grid min-h-screen place-items-center bg-canvas text-sm text-ink-secondary">Đang kiểm tra phiên đăng nhập…</div>;
  const authorized = !required || (import.meta.env.VITE_ENABLE_DEMO_TOOLS === "true"
    ? role === required
    : Boolean(user && canAccessPath(user, pathname)));
  if (!authorized) return <Navigate to="/login" replace state={{ returnTo: pathname }} />;
  return <Outlet />;
}

export default function Root() {
  return <AppProvider>{import.meta.env.VITE_ENABLE_DEMO_TOOLS === "true" && <DemoBar />}<RouteAccess /></AppProvider>;
}
