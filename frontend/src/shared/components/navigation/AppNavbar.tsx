import { useCallback, useEffect, useState } from "react";
import { Bell, CaretDown, List, X } from "@phosphor-icons/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApp, type Role } from "@/app/AppContext";
import { notificationsApi } from "@/shared/api/resources";
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
    { to: routes.studentProfile, label: "Hồ sơ" },
    { to: routes.questions, label: "Câu hỏi" },
    { to: routes.mentors, label: "Mentor" },
    { to: `${routes.studentDashboard}#bookings`, label: "Lịch phỏng vấn" },
    { to: routes.jobDescriptionNew, label: "JD của tôi" },
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
    { to: routes.adminQuestionImport, label: "Import" },
    { to: routes.adminTaxonomy, label: "Taxonomy" },
  ],
};

const publicNavigation: NavLink[] = [
  { to: routes.questions, label: "Câu hỏi" },
  { to: routes.mentors, label: "Mentor" },
  { to: `${routes.home}#how`, label: "Cách hoạt động" },
];

function homeForRole(role: Role) {
  if (role === "student") return routes.studentDashboard;
  if (role === "mentor") return routes.mentorBookings;
  if (role === "admin") return routes.adminQueue;
  return routes.home;
}

function bookingRouteForRole(role: Role, bookingId: string) {
  if (role === "mentor") return routes.mentorBooking(bookingId);
  return routes.booking(bookingId);
}

export function AppNavbar({ publicMode = false }: { publicMode?: boolean }) {
  const { role, user, logout } = useApp();
  const queryClient = useQueryClient();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const authenticatedRole = role === "public" ? "student" : role;
  const links = publicMode ? publicNavigation : roleNavigation[authenticatedRole];
  const identity = { name: user?.displayName ?? authenticatedRole, initials: (user?.displayName ?? authenticatedRole).split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase() };

  const notifications = useQuery({
    queryKey: ["notifications"],
    queryFn: notificationsApi.list,
    enabled: !publicMode,
    refetchInterval: 30_000,
  });
  const markRead = useMutation({
    mutationFn: notificationsApi.read,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
    setNotificationsOpen(false);
  }, [pathname]);

  const handleNotificationClick = useCallback((notificationId: string, resourceType: string | null, resourceId: string | null) => {
    markRead.mutate(notificationId);
    setNotificationsOpen(false);
    if (resourceType === "BOOKING" && resourceId) {
      navigate(bookingRouteForRole(authenticatedRole, resourceId));
    }
  }, [markRead, navigate, authenticatedRole]);

  function startPractice() {
    navigate(routes.login);
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
                {(notifications.data?.unread ?? 0) > 0 && <span className="absolute right-1.5 top-1.5 size-2 rounded-full border-2 border-panel bg-accent" />}
              </button>
              {notificationsOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 rounded-xl border border-edge bg-panel p-4 shadow-lg">
                  <p className="text-sm font-semibold text-ink">Thông báo</p>
                  <div className="mt-2 max-h-72 space-y-2 overflow-auto">
                    {notifications.isLoading && <p className="text-xs text-ink-muted">Đang tải…</p>}
                    {notifications.data?.items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleNotificationClick(item.id, item.resourceType, item.resourceId)}
                        className={cn(
                          "w-full rounded-md p-2 text-left transition-colors",
                          item.readAt ? "bg-transparent" : "bg-canvas",
                        )}
                      >
                        <span className="block text-xs font-medium text-ink">{item.title}</span>
                        <span className="mt-0.5 block text-[11px] text-ink-muted">{item.body}</span>
                      </button>
                    ))}
                    {notifications.data?.items.length === 0 && <p className="text-xs text-ink-muted">Không có thông báo.</p>}
                  </div>
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
                  {authenticatedRole === "student" && <Link to={routes.studentProfile} className="block w-full px-4 py-2.5 text-left text-sm text-ink-secondary transition-colors hover:bg-canvas hover:text-ink">Hồ sơ của tôi</Link>}
                  <button type="button" onClick={async () => { setProfileOpen(false); await logout(); }} className="w-full px-4 py-2.5 text-left text-sm text-danger transition-colors hover:bg-danger-soft">Đăng xuất</button>
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
