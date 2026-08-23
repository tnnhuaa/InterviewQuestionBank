import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useApp } from "@/app/AppContext";
import { isRescheduleProposalRecipient } from "@/features/booking/reschedule-policy";
import { actionRequiresReason } from "@/features/booking/reason-action-policy";
import AgendaDraftPanel from "@/features/mentor/components/AgendaDraftPanel";
import { bookingsApi, mentorsApi } from "@/shared/api/resources";
import AuthNavbar from "@/shared/components/AuthNavbar";
import ErrorPanel from "@/shared/components/ErrorPanel";

export default function MentorBookingDetail() {
  const { bookingId = "" } = useParams();
  const { user } = useApp();
  const queryClient = useQueryClient();
  const booking = useQuery({ queryKey: ["booking", bookingId], queryFn: () => bookingsApi.get(bookingId) });
  const slots = useQuery({ queryKey: ["mentor-slots"], queryFn: mentorsApi.slots });
  const [reason, setReason] = useState("");
  const [reasonAction, setReasonAction] = useState<string | null>(null);
  const [proposedSlotId, setProposedSlotId] = useState("");
  const transition = useMutation({
    mutationFn: (input: { action: string; reason?: string; proposedSlotId?: string }) => bookingsApi.transition(bookingId, { ...input, version: booking.data!.version }),
    onSuccess: async () => {
      setReason("");
      setReasonAction(null);
      await queryClient.invalidateQueries({ queryKey: ["booking", bookingId] });
    },
  });
  const resolveCase = useMutation({
    mutationFn: ({ caseId, action, version }: { caseId: string; action: "APPROVE" | "DISMISS"; version: number }) => bookingsApi.resolveCase(bookingId, caseId, { action, reason, version }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["booking", bookingId] }),
  });
  const canReportNoShow = booking.data ? Date.now() >= new Date(booking.data.startsAt).getTime() + 15 * 60_000 : false;
  const canRespondToProposal = isRescheduleProposalRecipient(booking.data?.pendingProposal?.proposed_by, user?.id);
  const canRequestChange = booking.data && ["PENDING", "CONFIRMED"].includes(booking.data.status);
  const submitReasonAction = () => {
    if (!reasonAction) return;
    transition.mutate({ action: reasonAction, reason, ...(reasonAction === "PROPOSE_RESCHEDULE" ? { proposedSlotId } : {}) });
  };

  if (booking.error) return <div className="min-h-screen bg-canvas"><AuthNavbar /><main className="mx-auto max-w-[820px] px-6 py-8"><ErrorPanel error={booking.error} onRetry={() => booking.refetch()} /></main></div>;
  if (booking.isLoading || !booking.data) return <div className="min-h-screen bg-canvas"><AuthNavbar /><main className="mx-auto max-w-[820px] px-6 py-8"><p className="text-sm text-ink-muted">Đang tải booking…</p></main></div>;

  const data = booking.data;
  return <div className="min-h-screen bg-canvas"><AuthNavbar /><main className="mx-auto max-w-[820px] px-6 py-8">
    <section className="rounded-xl border border-edge bg-panel p-6">
      <div className="flex justify-between gap-3"><h1 className="text-lg font-semibold text-ink">Yêu cầu từ {data.studentName}</h1><span className="text-xs font-semibold text-primary">{data.status}</span></div>
      <p className="mt-4 text-sm text-ink-secondary">{data.goal}</p>
      <p className="mt-2 text-xs text-ink-muted">{new Date(data.startsAt).toLocaleString("vi-VN")} · {data.interviewType}</p>
      <div className="mt-4 flex flex-wrap gap-2">{data.topicNames.map((topic) => <span key={topic} className="rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-medium text-primary">{topic}</span>)}</div>
      {data.correctedText ? <details className="mt-5 rounded-lg bg-canvas-subtle p-4"><summary className="cursor-pointer text-xs font-semibold text-ink">Corrected JD text · snapshot plan v{data.preparationPlanVersion ?? "direct"}</summary><p className="mt-3 whitespace-pre-wrap text-xs leading-5 text-ink-secondary">{data.correctedText}</p></details> : null}
      {data.questionGroups?.length ? <div className="mt-4 rounded-lg border border-edge p-4"><p className="text-xs font-semibold text-ink">Question groups</p><ul className="mt-2 space-y-1">{data.questionGroups.map((question) => <li key={question.id} className="text-xs text-ink-secondary">• {question.title}</li>)}</ul></div> : null}
    </section>
    {data.status === "CONFIRMED" && <AgendaDraftPanel booking={data} />}
    {(transition.error || resolveCase.error) && <div className="mt-5"><ErrorPanel error={transition.error || resolveCase.error} /></div>}
    <section className="mt-5 rounded-xl border border-edge bg-panel p-5">
      {actionRequiresReason(reasonAction) ? <div className="mb-4 rounded-lg bg-canvas-subtle p-4"><label className="block text-xs font-semibold text-ink-secondary">Lý do cho thao tác {reasonAction}<textarea value={reason} onChange={(event) => setReason(event.target.value)} className="mt-1.5 w-full rounded-md border border-edge bg-canvas p-3 text-sm" /></label><div className="mt-3 flex gap-2"><button disabled={reason.trim().length < 3 || transition.isPending} onClick={submitReasonAction} className="rounded-md bg-primary px-4 py-2 text-xs text-on-primary">Xác nhận</button><button onClick={() => setReasonAction(null)} className="rounded-md border border-edge px-4 py-2 text-xs">Bỏ qua</button></div></div> : null}
      {data.status === "PENDING" ? <div className="mt-4 flex flex-wrap gap-2"><button onClick={() => transition.mutate({ action: "CONFIRM" })} className="rounded-md bg-primary px-4 py-2 text-xs font-medium text-on-primary">Xác nhận</button><button onClick={() => setReasonAction("REJECT")} className="rounded-md border border-danger/30 px-4 py-2 text-xs font-medium text-danger">Từ chối</button></div> : null}
      {data.status === "CONFIRMED" ? <div className="mt-4 flex flex-wrap gap-2"><Link to={`/mentor/sessions/${data.id}`} className="rounded-md bg-primary px-4 py-2 text-xs font-medium text-on-primary">Quản lý buổi phỏng vấn</Link><button onClick={() => transition.mutate({ action: "COMPLETE" })} className="rounded-md border border-edge px-4 py-2 text-xs font-medium text-ink-secondary">Đánh dấu hoàn tất</button>{canReportNoShow ? <button onClick={() => setReasonAction("REPORT_NO_SHOW")} className="rounded-md border border-notice/30 px-4 py-2 text-xs text-notice-ink">Báo no-show</button> : null}</div> : null}
      {data.status === "COMPLETED" ? <Link to={`/mentor/feedback/${data.id}`} className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-xs text-on-primary">Gửi feedback</Link> : null}
      {canRequestChange ? <div className="mt-4 space-y-3"><select value={proposedSlotId} onChange={(event) => setProposedSlotId(event.target.value)} className="w-full rounded-md border border-edge bg-canvas px-3 py-2 text-sm"><option value="">Chọn slot mới nếu muốn đổi lịch</option>{slots.data?.items.filter((slot) => slot.id !== data.slotId).map((slot) => <option key={slot.id} value={slot.id}>{new Date(slot.startsAt).toLocaleString("vi-VN")}</option>)}</select><div className="flex flex-wrap gap-2"><button onClick={() => setReasonAction("CANCEL")} className="rounded-md border border-danger/30 px-4 py-2 text-xs font-medium text-danger">Yêu cầu hủy</button><button disabled={!proposedSlotId} onClick={() => setReasonAction("PROPOSE_RESCHEDULE")} className="rounded-md border border-edge px-4 py-2 text-xs">Đề xuất đổi lịch</button></div></div> : null}
      {data.status === "RESCHEDULE_PROPOSED" ? <div className="mt-4"><p className="mb-3 text-xs text-ink-muted">{data.pendingProposal ? `Đề xuất giờ mới: ${new Date(data.pendingProposal.starts_at).toLocaleString("vi-VN")}.` : "Đề xuất đổi lịch đang được xử lý."}</p>{canRespondToProposal ? <div className="flex flex-wrap gap-2"><button onClick={() => transition.mutate({ action: "ACCEPT_RESCHEDULE" })} className="rounded-md bg-primary px-4 py-2 text-xs text-on-primary">Chấp nhận giờ mới</button><button onClick={() => transition.mutate({ action: "REJECT_RESCHEDULE" })} className="rounded-md border border-edge px-4 py-2 text-xs">Từ chối</button></div> : <p className="text-xs text-ink-muted">Đang chờ bên còn lại phản hồi đề xuất của bạn.</p>}</div> : null}
    </section>
    {data.transitionHistory?.length ? <section className="mt-5 rounded-xl border border-edge bg-panel p-5"><h2 className="text-sm font-semibold text-ink">Lịch sử quyết định</h2><div className="mt-3 space-y-3">{data.transitionHistory.map((item) => <div key={item.id} className="border-l-2 border-edge pl-3 text-xs"><p className="font-medium text-ink">{item.actorName} · {item.action} → {item.toState}</p><p className="text-ink-muted">{new Date(item.occurredAt).toLocaleString("vi-VN")}</p>{item.reason ? <p className="mt-1 text-ink-secondary">Lý do: {item.reason}</p> : null}</div>)}</div></section> : null}
    {data.participantCases?.filter((item) => item.requestedBy !== user?.id).map((item) => <section key={item.id} className="mt-5 rounded-xl border border-notice/30 bg-notice-soft p-5"><p className="text-sm text-ink">{item.summary}</p><div className="mt-3 flex gap-2"><button disabled={reason.trim().length < 5} onClick={() => resolveCase.mutate({ caseId: item.id, action: "APPROVE", version: item.version })} className="rounded-md bg-primary px-4 py-2 text-xs text-on-primary">Đồng ý</button><button disabled={reason.trim().length < 5} onClick={() => resolveCase.mutate({ caseId: item.id, action: "DISMISS", version: item.version })} className="rounded-md border border-edge px-4 py-2 text-xs">Từ chối</button></div></section>)}
  </main></div>;
}
