import { useEffect, useState } from "react";
import { Bell, CaretDown, List, X } from "@phosphor-icons/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useApp, type Role } from "@/app/AppContext";
import { routes } from "@/app/routePaths";
import { cn } from "@/shared/utils/cn";
import { Button } from "@/shared/components/ui/Button";
import { Brand } from "./Brand";

interface NavLink {
  to: string;
  label: string;
}

const roleNavigation: Record<Exclude<Role, "public">, NavLink[]> = {
  student: [
    { to: routes.studentDashboard, label: "Trang chủ" },
    { to: routes.questions, label: "Câu hỏi" },
    { to: routes.mentors, label: "Mentor" },
    { to: routes.booking("BK-2024-001"), label: "Lịch phỏng vấn" },
    { to: routes.preparationPlan("demo-plan"), label: "JD của tôi" },
  ],
  mentor: [
    { to: routes.mentorBookings, label: "Lịch đặt" },
    { to: routes.mentorAvailability, label: "Lịch khả dụng" },
    { to: routes.mentorProfile, label: "Hồ sơ" },
    { to: routes.mentorVerification, label: "Xác minh" },
  ],
  admin: [
    { to: routes.adminQueue, label: "Queue" },
    { to: routes.adminQuestions, label: "Câu hỏi" },
  ],
};

const publicNavigation: NavLink[] = [
  { to: routes.questions, label: "Câu hỏi" },
  { to: routes.mentors, label: "Mentor" },
  { to: `${routes.home}#how`, label: "Cách hoạt động" },
];

const identities: Record<Exclude<Role, "public">, { name: string; initials: string }> = {
  student: { name: "An", initials: "A" },
  mentor: { name: "Minh Tuấn", initials: "MT" },
  admin: { name: "Admin", initials: "AD" },
};

function homeForRole(role: Role) {
  if (role === "student") return routes.studentDashboard;
  if (role === "mentor") return routes.mentorBookings;
  if (role === "admin") return routes.adminQueue;
  return routes.home;
}

export function AppNavbar({ publicMode = false }: { publicMode?: boolean }) {
  const { role, setRole } = useApp();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const authenticatedRole = role === "public" ? "student" : role;
  const links = publicMode ? publicNavigation : roleNavigation[authenticatedRole];
  const identity = identities[authenticatedRole];

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
    setNotificationsOpen(false);
  }, [pathname]);

  function startPractice() {
    setRole("student");
    navigate(routes.studentDashboard);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-edge bg-panel/95 backdrop-blur-sm">
      <div className="app-container flex h-14 items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-8">
          <Brand to={publicMode ? routes.home : homeForRole(authenticatedRole)} />
          <nav className="hidden items-center gap-1 md:flex" aria-label="Điều hướng chính">
            {links.map((link) => {
              const active = pathname === link.to || (link.to !== "/" && pathname.startsWith(`${link.to}/`));
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-sm transition-colors",
                    active
                      ? "font-medium text-primary"
                      : "text-ink-secondary hover:bg-canvas hover:text-ink",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {publicMode ? (
          <div className="hidden items-center gap-2 md:flex">
            <Button variant="ghost" size="sm" onClick={() => navigate(routes.login)}>
              Đăng nhập
            </Button>
            <Button size="sm" onClick={startPractice}>
              Bắt đầu luyện tập
            </Button>
          </div>
        ) : (
          <div className="hidden items-center gap-2 md:flex">
            <div className="relative">
              <button
                type="button"
                aria-label="Thông báo"
                aria-expanded={notificationsOpen}
                onClick={() => setNotificationsOpen((open) => !open)}
                className="relative rounded-lg p-2 text-ink-muted transition-colors hover:bg-canvas hover:text-ink"
              >
                <Bell aria-hidden size={20} />
                <span className="absolute right-1.5 top-1.5 size-2 rounded-full border-2 border-panel bg-accent" />
              </button>
              {notificationsOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 rounded-xl border border-edge bg-panel p-4 shadow-lg">
                  <p className="text-sm font-semibold text-ink">Thông báo</p>
                  <p className="mt-1 text-xs leading-5 text-ink-muted">Bạn không có thông báo mới cần xử lý.</p>
                </div>
              )}
            </div>
            <div className="relative">
              <button
                type="button"
                aria-expanded={profileOpen}
                onClick={() => setProfileOpen((open) => !open)}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-canvas"
              >
                <span className="flex size-8 items-center justify-center rounded-full border border-edge bg-primary-soft text-xs font-semibold text-primary">
                  {identity.initials}
                </span>
                <span className="text-sm text-ink">{identity.name}</span>
                <CaretDown aria-hidden size={14} className="text-ink-muted" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-xl border border-edge bg-panel py-1 shadow-lg">
                  {["Hồ sơ của tôi", "Cài đặt", "Đăng xuất"].map((label) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => setProfileOpen(false)}
                      className="w-full px-4 py-2.5 text-left text-sm text-ink-secondary transition-colors hover:bg-canvas hover:text-ink"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <button
          type="button"
          aria-label={mobileOpen ? "Đóng menu" : "Mở menu"}
          aria-expanded={mobileOpen}
          className="rounded-lg p-2 text-ink-secondary hover:bg-canvas hover:text-ink md:hidden"
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <X aria-hidden size={22} /> : <List aria-hidden size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <nav className="border-t border-edge bg-panel px-4 py-4 md:hidden" aria-label="Điều hướng di động">
          <div className="mx-auto flex max-w-lg flex-col gap-1">
            {links.map((link) => (
              <Link key={link.to} to={link.to} className="rounded-lg px-3 py-2.5 text-sm text-ink-secondary hover:bg-canvas hover:text-ink">
                {link.label}
              </Link>
            ))}
            {publicMode && (
              <div className="mt-2 grid gap-2 border-t border-edge pt-3">
                <Button variant="secondary" onClick={() => navigate(routes.login)}>Đăng nhập</Button>
                <Button onClick={startPractice}>Bắt đầu luyện tập</Button>
              </div>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
