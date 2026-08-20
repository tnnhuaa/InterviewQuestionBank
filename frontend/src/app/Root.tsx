import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AppProvider, useApp } from "@/app/AppContext";
import { canAccessPath, postLoginPath, requiredRoleForPath } from "@/app/access";
import { routes } from "@/app/routePaths";
import DemoBar from "@/shared/components/DemoBar";

function RouteAccess() {
  const location = useLocation();
  const { pathname } = location;
  const { user, sessionLoading } = useApp();
  const required = requiredRoleForPath(pathname);
  if (sessionLoading) return <div className="grid min-h-screen place-items-center bg-canvas text-sm text-ink-secondary">Đang kiểm tra phiên đăng nhập…</div>;
  if (pathname === routes.login && user) {
    const returnTo = (location.state as { returnTo?: string } | null)?.returnTo;
    return <Navigate to={postLoginPath(user, returnTo)} replace />;
  }
  if (required && !user) return <Navigate to={routes.login} replace state={{ returnTo: pathname }} />;
  if (required && user && !canAccessPath(user, pathname)) {
    return <Navigate to={routes.permissionDenied} replace state={{ deniedPath: pathname }} />;
  }
  return <Outlet key={user?.id ?? "public"} />;
}

export default function Root() {
  return <AppProvider>{import.meta.env.VITE_ENABLE_DEMO_TOOLS === "true" && <DemoBar />}<RouteAccess /></AppProvider>;
}
