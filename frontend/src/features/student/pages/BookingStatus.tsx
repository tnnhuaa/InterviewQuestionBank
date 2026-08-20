import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useApp } from "@/app/AppContext";
import { routes } from "@/app/routePaths";
import { bookingsApi, mentorsApi } from "@/shared/api/resources";
import AuthNavbar from "@/shared/components/AuthNavbar";
import ErrorPanel from "@/shared/components/ErrorPanel";

export default function BookingStatus() {
  const { bookingId = "" } = useParams();
  const { user } = useApp();
  const queryClient = useQueryClient();
  const [reason, setReason] = useState("");
  const [proposedSlotId, setProposedSlotId] = useState("");
  const booking = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: () => bookingsApi.get(bookingId),
    enabled: Boolean(bookingId),
    refetchInterval: (query) => ["PENDING", "RESCHEDULE_PROPOSED"].includes(query.state.data?.status ?? "") ? 10_000 : false,
  });
  const mentor = useQuery({
    queryKey: ["mentor", booking.data?.mentorId],
    queryFn: () => mentorsApi.get(booking.data!.mentorId),
    enabled: Boolean(booking.data?.mentorId),
  });
  const transition = useMutation({
    mutationFn: (input: { action: string; reason?: string; proposedSlotId?: string }) =>
      bookingsApi.transition(bookingId, { ...input, version: booking.data!.version }),
    onSuccess: (data) => {
      setReason("");
      queryClient.setQueryData(["booking", bookingId], data);
    },
  });
  const dispute = useMutation({
    mutationFn: () => bookingsApi.disputeCompletion(bookingId, { reason }),
    onSuccess: () => setReason(""),
  });
  const resolveCase = useMutation({
    mutationFn: ({ caseId, action, version }: { caseId: string; action: "APPROVE" | "DISMISS"; version: number }) =>
      bookingsApi.resolveCase(bookingId, caseId, { action, reason, version }),
    onSuccess: () => {
      setReason("");
      queryClient.invalidateQueries({ queryKey: ["booking", bookingId] });
    },
  });
  const canReportNoShow = booking.data
    ? Date.now() >= new Date(booking.data.startsAt).getTime() + 15 * 60_000
    : false;

  return (
    <div className="min-h-screen bg-canvas">
      <AuthNavbar />
      <main className="mx-auto max-w-[800px] px-6 py-8">
        {booking.error ? (
          <ErrorPanel error={booking.error} onRetry={() => booking.refetch()} />
        ) : booking.isLoading ? (
          <p className="text-sm text-ink-muted">Đang tải lịch hẹn…</p>
        ) : booking.data ? (
          <>
            <section className="rounded-xl border border-edge bg-panel p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-ink-muted">Mã đặt lịch</p>
                  <h1 className="mt-1 font-mono text-sm font-semibold text-ink">{booking.data.id}</h1>
                </div>
                <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">{booking.data.status}</span>
              </div>
              <dl className="mt-6 grid gap-3 sm:grid-cols-2">
                <div><dt className="text-xs text-ink-muted">Mentor</dt><dd className="mt-1 text-sm font-medium text-ink">{booking.data.mentorName}</dd></div>
                <div><dt className="text-xs text-ink-muted">Thời gian</dt><dd className="mt-1 text-sm font-medium text-ink">{new Date(booking.data.startsAt).toLocaleString("vi-VN")}</dd></div>
                <div><dt className="text-xs text-ink-muted">Chủ đề</dt><dd className="mt-1 text-sm text-ink">{booking.data.topicNames.join(", ")}</dd></div>
                <div><dt className="text-xs text-ink-muted">Schedule version</dt><dd className="mt-1 text-sm text-ink">v{booking.data.scheduleVersion ?? 1}</dd></div>
              </dl>
              {["CONFIRMED", "COMPLETED"].includes(booking.data.status) ? (
                <Link to={routes.session(booking.data.id)} className="mt-5 inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-on-primary">
                  Mở phiên phỏng vấn
                </Link>
              ) : null}
            </section>

            {transition.error || dispute.error || resolveCase.error ? (
              <div className="mt-5"><ErrorPanel error={transition.error || dispute.error || resolveCase.error} /></div>
            ) : null}
            <section className="mt-5 rounded-xl border border-edge bg-panel p-5">
              <h2 className="text-sm font-semibold text-ink">Thao tác có kiểm soát</h2>
              <label className="mt-4 block text-xs font-semibold text-ink-secondary">
                Lý do
                <textarea value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Không nhập credential hoặc dữ liệu nhạy cảm" className="mt-1.5 w-full rounded-md border border-edge p-3 text-sm" />
              </label>
              {["PENDING", "CONFIRMED"].includes(booking.data.status) ? (
                <div className="mt-4 space-y-3">
                  <select value={proposedSlotId} onChange={(event) => setProposedSlotId(event.target.value)} className="w-full rounded-md border border-edge bg-canvas px-3 py-2 text-sm">
                    <option value="">Chọn slot mới nếu muốn đổi lịch</option>
                    {mentor.data?.nextSlots.filter((slot) => slot.id !== booking.data?.slotId).map((slot) => (
                      <option key={slot.id} value={slot.id}>{new Date(slot.startsAt).toLocaleString("vi-VN")}</option>
                    ))}
                  </select>
                  <div className="flex flex-wrap gap-2">
                    <button disabled={reason.trim().length < 3 || transition.isPending} onClick={() => transition.mutate({ action: "CANCEL", reason })} className="rounded-md border border-danger/30 px-4 py-2 text-xs font-medium text-danger">Yêu cầu hủy</button>
                    <button disabled={reason.trim().length < 3 || !proposedSlotId || transition.isPending} onClick={() => transition.mutate({ action: "PROPOSE_RESCHEDULE", reason, proposedSlotId })} className="rounded-md border border-edge px-4 py-2 text-xs font-medium text-ink-secondary">Đề xuất đổi lịch</button>
                    {canReportNoShow ? <button disabled={reason.trim().length < 3 || transition.isPending} onClick={() => transition.mutate({ action: "REPORT_NO_SHOW", reason })} className="rounded-md border border-notice/30 px-4 py-2 text-xs font-medium text-notice-ink">Báo no-show</button> : null}
                  </div>
                </div>
              ) : null}
              {booking.data.status === "RESCHEDULE_PROPOSED" ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  <button disabled={transition.isPending} onClick={() => transition.mutate({ action: "ACCEPT_RESCHEDULE" })} className="rounded-md bg-primary px-4 py-2 text-xs font-medium text-on-primary">Chấp nhận giờ mới</button>
                  <button disabled={transition.isPending} onClick={() => transition.mutate({ action: "REJECT_RESCHEDULE" })} className="rounded-md border border-edge px-4 py-2 text-xs font-medium text-ink-secondary">Từ chối</button>
                </div>
              ) : null}
              {booking.data.status === "COMPLETED" ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link to={routes.feedback(booking.data.id)} className="rounded-md border border-edge px-4 py-2 text-xs font-medium text-ink-secondary">Xem feedback</Link>
                  <Link to={routes.review(booking.data.id)} className="rounded-md bg-primary px-4 py-2 text-xs font-medium text-on-primary">Viết review</Link>
                  <button disabled={reason.trim().length < 10 || dispute.isPending} onClick={() => dispute.mutate()} className="rounded-md border border-danger/30 px-4 py-2 text-xs font-medium text-danger">Dispute completion</button>
                </div>
              ) : null}
            </section>

            {booking.data.participantCases?.filter((item) => item.requestedBy !== user?.id).map((item) => (
              <section key={item.id} className="mt-5 rounded-xl border border-notice/30 bg-notice-soft p-5">
                <p className="text-xs font-semibold text-notice-ink">{item.type}</p>
                <p className="mt-2 text-sm text-ink">{item.summary}</p>
                <div className="mt-3 flex gap-2">
                  <button disabled={reason.trim().length < 5 || resolveCase.isPending} onClick={() => resolveCase.mutate({ caseId: item.id, action: "APPROVE", version: item.version })} className="rounded-md bg-primary px-4 py-2 text-xs text-on-primary">Đồng ý</button>
                  <button disabled={reason.trim().length < 5 || resolveCase.isPending} onClick={() => resolveCase.mutate({ caseId: item.id, action: "DISMISS", version: item.version })} className="rounded-md border border-edge px-4 py-2 text-xs">Từ chối</button>
                </div>
              </section>
            ))}
          </>
        ) : null}
      </main>
    </div>
  );
}
