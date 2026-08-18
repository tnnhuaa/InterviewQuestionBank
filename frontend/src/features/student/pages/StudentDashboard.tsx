import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { dashboardApi } from "@/shared/api/resources";
import AuthNavbar from "@/shared/components/AuthNavbar";
import ErrorPanel from "@/shared/components/ErrorPanel";

export default function StudentDashboard() {
  const dashboard = useQuery({ queryKey: ["student-dashboard"], queryFn: dashboardApi.get });
  const summary = dashboard.data?.summary;
  const cards = [
    { label: "Đang luyện", value: summary?.practice.practicing ?? 0 },
    { label: "Cần ôn lại", value: summary?.practice.revisit ?? 0 },
    { label: "Đã hoàn thành", value: summary?.practice.completed ?? 0 },
    { label: "Đã lưu", value: summary?.bookmarked ?? 0 },
    { label: "Kế hoạch active", value: summary?.activePlans ?? 0 },
  ];

  return <div className="min-h-screen bg-canvas"><AuthNavbar /><main className="mx-auto max-w-[1120px] px-6 py-8">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-[22px] font-semibold text-ink">Tổng quan chuẩn bị</h1><p className="mt-1 text-sm text-ink-secondary">Chỉ hiển thị dữ liệu luyện tập, kế hoạch và feedback thuộc tài khoản của bạn.</p></div><Link to="/job-descriptions/new" className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-on-primary">Phân tích JD mới</Link></div>
    {dashboard.error && <div className="mt-5"><ErrorPanel error={dashboard.error} onRetry={() => dashboard.refetch()} /></div>}
    {dashboard.isLoading ? <p className="mt-6 text-sm text-ink-muted">Đang tổng hợp dữ liệu…</p> : <>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{cards.map((card) => <article key={card.label} className="rounded-xl border border-edge bg-panel p-5"><p className="text-2xl font-semibold text-ink">{card.value}</p><p className="mt-1 text-xs text-ink-muted">{card.label}</p></article>)}</div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <section><div className="mb-3 flex items-center justify-between"><h2 className="text-sm font-semibold text-ink">Việc nên làm tiếp theo</h2><Link to="/questions" className="text-xs text-primary">Question Bank</Link></div><div className="space-y-2">{dashboard.data?.nextActions.map((action) => <article key={action.id} className="rounded-xl border border-edge bg-panel p-4"><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-primary-soft px-2 py-1 text-[10px] font-semibold text-primary">{action.priority}</span><span className="text-[11px] text-ink-muted">{action.practiceStatus}</span></div><h3 className="mt-2 text-sm font-medium text-ink">{action.questionTitle ?? action.mentorNextAction}</h3><p className="mt-1 text-xs text-ink-muted">{action.topic ?? "Hành động từ feedback"}</p><div className="mt-3 flex gap-3"><Link to={`/preparation-plans/${action.planId}`} className="text-xs font-medium text-primary">Mở kế hoạch →</Link>{action.questionId ? <Link to={`/questions/${action.questionId}`} className="text-xs text-ink-secondary">Mở câu hỏi</Link> : null}</div></article>)}{dashboard.data?.nextActions.length === 0 && <p className="rounded-xl border border-dashed border-edge p-8 text-center text-sm text-ink-muted">Chưa có next action. Hãy tạo kế hoạch từ một JD.</p>}</div></section>
        <aside className="space-y-6"><section id="bookings"><h2 className="mb-3 text-sm font-semibold text-ink">Lịch sắp tới</h2>{dashboard.data?.upcomingBooking ? <Link to={`/bookings/${dashboard.data.upcomingBooking.id}`} className="block rounded-xl border border-primary/20 bg-panel p-5"><span className="text-xs font-semibold text-primary">{dashboard.data.upcomingBooking.status}</span><span className="mt-2 block text-sm font-medium text-ink">{dashboard.data.upcomingBooking.mentorName}</span><span className="mt-1 block text-xs text-ink-muted">{new Date(dashboard.data.upcomingBooking.startsAt).toLocaleString("vi-VN")}</span></Link> : <p className="rounded-xl border border-dashed border-edge p-6 text-center text-xs text-ink-muted">Chưa có lịch được xác nhận.</p>}</section><section><h2 className="mb-3 text-sm font-semibold text-ink">Feedback gần đây</h2><div className="space-y-2">{dashboard.data?.recentFeedback.map((feedback) => <Link key={feedback.id} to={`/bookings/${feedback.bookingId}/feedback`} className="block rounded-xl border border-edge bg-panel p-4"><span className="text-xs font-medium text-ink">{feedback.mentorName}</span><span className="mt-1 line-clamp-2 block text-xs text-ink-muted">{feedback.strengths}</span></Link>)}{dashboard.data?.recentFeedback.length === 0 && <p className="text-xs text-ink-muted">Chưa có feedback.</p>}</div></section></aside>
      </div>
    </>}
  </main></div>;
}
