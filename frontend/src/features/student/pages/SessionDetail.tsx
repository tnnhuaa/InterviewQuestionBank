import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { routes } from "@/app/routePaths";
import { createIdempotencyKey } from "@/shared/api/client";
import { bookingsApi } from "@/shared/api/resources";
import AuthNavbar from "@/shared/components/AuthNavbar";
import ErrorPanel from "@/shared/components/ErrorPanel";
import MeetingRecoveryPanel from "@/shared/components/MeetingRecoveryPanel";

type ReportAttempt = {
  input: { kind: "BROKEN" | "MISSING"; reason: string };
  idempotencyKey: string;
};

const policyMessages = {
  MISSING: "Mentor chưa cung cấp link. Khi đến cửa sổ hai giờ trước buổi hẹn, bạn có thể báo thiếu link.",
  OUTSIDE_WINDOW: "Link đã tồn tại nhưng chưa nằm trong cửa sổ được phép hiển thị.",
  EXPIRED: "Link đã hết thời hạn truy cập.",
  INVALID_BOOKING_STATE: "Trạng thái booking hiện tại không cho phép truy cập link phòng họp.",
};

export default function SessionDetail() {
  const { sessionId = "" } = useParams();
  const [reason, setReason] = useState("");
  const [lastAttempt, setLastAttempt] = useState<ReportAttempt | null>(null);
  const booking = useQuery({
    queryKey: ["booking", sessionId],
    queryFn: () => bookingsApi.get(sessionId),
    enabled: Boolean(sessionId),
  });
  const report = useMutation({
    mutationFn: (attempt: ReportAttempt) => bookingsApi.reportLink(sessionId, attempt.input, attempt.idempotencyKey),
    onSuccess: async () => {
      setReason("");
      await booking.refetch();
    },
  });
  const policy = booking.data?.meetingLinkPolicy;
  const reportKind = policy?.canReportBroken ? "BROKEN" : policy?.canReportMissing ? "MISSING" : null;

  const submitReport = () => {
    if (!reportKind || report.isPending) return;
    const attempt: ReportAttempt = {
      input: { kind: reportKind, reason: reason.trim() },
      idempotencyKey: createIdempotencyKey(),
    };
    setLastAttempt(attempt);
    report.mutate(attempt);
  };

  return (
    <div className="min-h-screen bg-canvas">
      <AuthNavbar />
      <main className="mx-auto max-w-[760px] px-6 py-8">
        {booking.error ? (
          <ErrorPanel error={booking.error} onRetry={() => booking.refetch()} />
        ) : booking.isLoading ? (
          <p className="text-sm text-ink-muted">Đang tải buổi phỏng vấn…</p>
        ) : booking.data ? (
          <>
            <section className="rounded-xl border border-edge bg-panel p-6">
              <div className="flex justify-between gap-3">
                <div>
                  <p className="text-xs text-ink-muted">Buổi phỏng vấn với</p>
                  <h1 className="mt-1 text-xl font-semibold text-ink">{booking.data.mentorName}</h1>
                </div>
                <span className="text-xs font-semibold text-primary">{booking.data.status}</span>
              </div>
              <p className="mt-5 text-sm text-ink-secondary">{new Date(booking.data.startsAt).toLocaleString("vi-VN")} · {booking.data.interviewType}</p>
              <p className="mt-2 text-sm text-ink-secondary">Mục tiêu: {booking.data.goal}</p>
              {policy?.canView && booking.data.meetingLink ? (
                <a href={booking.data.meetingLink} target="_blank" rel="noreferrer" className="mt-5 inline-block rounded-lg bg-primary px-5 py-3 text-sm font-medium text-on-primary">
                  Tham gia phòng phỏng vấn
                </a>
              ) : (
                <p className="mt-5 rounded-lg bg-notice-soft p-4 text-xs text-notice-ink">
                  {policy ? policyMessages[policy.state as keyof typeof policyMessages] ?? "Link chưa khả dụng." : "Đang kiểm tra quyền truy cập link."}
                </p>
              )}
            </section>

            {booking.data.meetingRecovery ? (
              <MeetingRecoveryPanel
                recovery={booking.data.meetingRecovery}
                expiredAction={
                  <Link to={routes.booking(booking.data.id)} className="mt-3 inline-block rounded-md bg-primary px-4 py-2 text-xs font-medium text-on-primary">
                    Mở lựa chọn reschedule
                  </Link>
                }
              />
            ) : null}

            {reportKind ? (
              <section className="mt-5 rounded-xl border border-edge bg-panel p-5">
                <h2 className="text-sm font-semibold text-ink">{reportKind === "BROKEN" ? "Link không hoạt động?" : "Chưa có link phòng họp?"}</h2>
                <p className="mt-1 text-xs text-ink-muted">Khi gửi báo cáo, Mentor có 15 phút để cung cấp link thay thế. Không nhập credential hoặc dữ liệu nhạy cảm.</p>
                <textarea value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Mô tả ngắn vấn đề" className="mt-3 w-full rounded-md border border-edge p-3 text-sm" />
                {report.error ? (
                  <div className="mt-3">
                    <ErrorPanel error={report.error} onRetry={lastAttempt ? () => report.mutate(lastAttempt) : undefined} />
                  </div>
                ) : null}
                <button disabled={reason.trim().length < 3 || report.isPending} onClick={submitReport} className="mt-3 rounded-md border border-danger/30 px-4 py-2 text-xs font-medium text-danger disabled:opacity-50">
                  {report.isPending ? "Đang gửi…" : reportKind === "BROKEN" ? "Báo link lỗi" : "Báo thiếu link"}
                </button>
              </section>
            ) : null}
          </>
        ) : null}
      </main>
    </div>
  );
}
