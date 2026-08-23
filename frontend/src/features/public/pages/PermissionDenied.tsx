import { Link, useLocation } from "react-router-dom";
import { homePathForUser } from "@/app/access";
import { useApp } from "@/app/AppContext";
import AuthNavbar from "@/shared/components/AuthNavbar";

export default function PermissionDenied() {
  const { user } = useApp();
  const location = useLocation();
  const deniedPath = (location.state as { deniedPath?: string } | null)?.deniedPath;
  const home = user ? homePathForUser(user) : "/homepage";

  return <div className="min-h-screen bg-canvas">
    <AuthNavbar />
    <main className="mx-auto max-w-xl px-6 py-16 text-center">
      <p className="text-xs font-semibold uppercase tracking-wide text-danger">Không có quyền truy cập</p>
      <h1 className="mt-3 text-2xl font-semibold text-ink">Trang này dành cho một vai trò khác</h1>
      <p className="mt-3 text-sm leading-6 text-ink-secondary">
        Phiên đăng nhập của bạn vẫn an toàn. Hãy quay lại khu vực phù hợp với tài khoản hiện tại.
      </p>
      {deniedPath ? <p className="mt-3 font-mono text-xs text-ink-muted">Route: {deniedPath}</p> : null}
      <Link to={home} replace className="mt-6 inline-block rounded-lg bg-primary px-5 py-3 text-sm font-medium text-on-primary">
        Về trang của tôi
      </Link>
    </main>
  </div>;
}
