import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useApp } from "@/app/AppContext";
import { bookingsApi, mentorsApi, type BookingStatus } from "@/shared/api/resources";
import AuthNavbar from "@/shared/components/AuthNavbar";
import ErrorPanel from "@/shared/components/ErrorPanel";
import AgendaDraftPanel from "@/features/mentor/components/AgendaDraftPanel";

const bookingStatusLabels: Record<BookingStatus, string> = {
  PENDING: "Chờ xử lý",
  CONFIRMED: "Đã xác nhận",
  RESCHEDULE_PROPOSED: "Đang chờ phản hồi đổi lịch",
  REJECTED: "Đã từ chối",
  CANCELLED: "Đã hủy",
  COMPLETED: "Đã hoàn tất",
  NO_SHOW: "Vắng mặt",
};

export default function MentorBookingDetail() {
  const { bookingId = "" } = useParams();
  const { user } = useApp();
  const queryClient = useQueryClient();
  const booking = useQuery({ queryKey: ["booking", bookingId], queryFn: () => bookingsApi.get(bookingId) });
  const slots = useQuery({ queryKey: ["mentor-slots"], queryFn: mentorsApi.slots });
  const [reason, setReason] = useState("");
  const [proposedSlotId, setProposedSlotId] = useState("");
  const transition = useMutation({
    mutationFn: (input: { action: string; reason?: string; proposedSlotId?: string }) => bookingsApi.transition(bookingId, { ...input, version: booking.data!.version }),
    onSuccess: (data) => {
      setReason("");
      setProposedSlotId("");
      queryClient.setQueryData(["booking", bookingId], data);
      queryClient.invalidateQueries({ queryKey: ["mentor-slots"] });
    },
  });
  const resolveCase = useMutation({ mutationFn: ({ caseId, action, version }: { caseId: string; action: "APPROVE" | "DISMISS"; version: number }) => bookingsApi.resolveCase(bookingId, caseId, { action, reason, version }), onSuccess: () => queryClient.invalidateQueries({ queryKey: ["booking", bookingId] }) });
  const canReportNoShow = booking.data ? Date.now() >= new Date(booking.data.startsAt).getTime() + 15 * 60_000 : false;
  const remainingProposals = Math.max(0, 2 - (booking.data?.proposalCount ?? 0));
  const availableProposalSlots = slots.data?.items.filter((slot) => slot.id !== booking.data?.slotId && slot.status === "AVAILABLE") ?? [];

  return <div className="min-h-screen bg-canvas"><AuthNavbar /><main className="mx-auto max-w-[820px] px-6 py-8">{booking.error ? <ErrorPanel error={booking.error} onRetry={() => booking.refetch()} /> : booking.isLoading ? <p className="text-sm text-ink-muted">Đang tải booking…</p> : booking.data ? <><section className="rounded-xl border border-edge bg-panel p-6"><div className="flex justify-between gap-3"><h1 className="text-lg font-semibold text-ink">Yêu cầu từ {booking.data.studentName}</h1><span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">{bookingStatusLabels[booking.data.status]}</span></div><p className="mt-4 text-sm text-ink-secondary">{booking.data.goal}</p><p className="mt-2 text-xs text-ink-muted">{new Date(booking.data.startsAt).toLocaleString("vi-VN")} · {booking.data.interviewType}</p><div className="mt-4 flex flex-wrap gap-2">{booking.data.topicNames.map((topic) => <span key={topic} className="rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-medium text-primary">{topic}</span>)}</div>{booking.data.correctedText ? <details className="mt-5 rounded-lg bg-canvas-subtle p-4"><summary className="cursor-pointer text-xs font-semibold text-ink">Corrected JD text · snapshot plan v{booking.data.preparationPlanVersion ?? "direct"}</summary><p className="mt-3 whitespace-pre-wrap text-xs leading-5 text-ink-secondary">{booking.data.correctedText}</p></details> : null}{booking.data.questionGroups?.length ? <div className="mt-4 rounded-lg border border-edge p-4"><p className="text-xs font-semibold text-ink">Question groups</p><ul className="mt-2 space-y-1">{booking.data.questionGroups.map((question) => <li key={question.id} className="text-xs text-ink-secondary">• {question.title}</li>)}</ul></div> : null}</section>{booking.data.status === "CONFIRMED" && <AgendaDraftPanel booking={booking.data} />}{(transition.error || resolveCase.error) && <div className="mt-5"><ErrorPanel error={transition.error || resolveCase.error} /></div>}<section className="mt-5 rounded-xl border border-edge bg-panel p-5"><label className="block text-xs font-semibold text-ink-secondary">Lý do quyết định<textarea value={reason} onChange={(event) => setReason(event.target.value)} className="mt-1.5 w-full rounded-md border border-edge p-3 text-sm" /></label><div className="mt-4 flex flex-wrap gap-2">{booking.data.status === "PENDING" ? <><button onClick={() => transition.mutate({ action: "CONFIRM" })} className="rounded-md bg-primary px-4 py-2 text-xs font-medium text-on-primary">Xác nhận</button><button disabled={reason.trim().length < 3} onClick={() => transition.mutate({ action: "REJECT", reason })} className="rounded-md border border-danger/30 px-4 py-2 text-xs font-medium text-danger">Từ chối</button></> : null}{booking.data.status === "CONFIRMED" ? <><Link to={`/mentor/sessions/${booking.data.id}`} className="rounded-md bg-primary px-4 py-2 text-xs font-medium text-on-primary">Quản lý buổi phỏng vấn</Link><button onClick={() => transition.mutate({ action: "COMPLETE" })} className="rounded-md border border-edge px-4 py-2 text-xs font-medium text-ink-secondary">Đánh dấu hoàn tất</button>{canReportNoShow ? <button disabled={reason.trim().length < 3} onClick={() => transition.mutate({ action: "REPORT_NO_SHOW", reason })} className="rounded-md border border-notice/30 px-4 py-2 text-xs text-notice-ink">Báo no-show</button> : null}</> : null}{booking.data.status === "COMPLETED" ? <Link to={`/mentor/feedback/${booking.data.id}`} className="rounded-md bg-primary px-4 py-2 text-xs font-medium text-on-primary">Gửi feedback</Link> : null}</div>{["PENDING", "CONFIRMED"].includes(booking.data.status) ? <div className="mt-4 rounded-lg border border-edge bg-canvas-subtle p-4"><div className="mb-3 flex flex-wrap items-center justify-between gap-2"><div><p className="text-xs font-semibold text-ink">Đề xuất giờ mới</p><p className="mt-1 text-xs text-ink-muted">Bạn còn {remainingProposals}/2 lần đề xuất đổi lịch.</p></div>{remainingProposals === 0 ? <span className="rounded-full bg-danger/10 px-2.5 py-1 text-[11px] font-medium text-danger">Đã dùng hết lượt</span> : null}</div>{remainingProposals > 0 ? <div className="flex flex-col gap-2 sm:flex-row"><select aria-label="Chọn khung giờ mới" value={proposedSlotId} onChange={(event) => setProposedSlotId(event.target.value)} className="min-h-11 min-w-0 flex-1 rounded-md border border-edge bg-canvas px-3 py-2 text-sm"><option value="">Chọn khung giờ còn trống</option>{availableProposalSlots.map((slot) => <option key={slot.id} value={slot.id}>{new Date(slot.startsAt).toLocaleString("vi-VN")} · {slot.timezone}</option>)}</select><button disabled={!proposedSlotId || reason.trim().length < 3 || transition.isPending} onClick={() => transition.mutate({ action: "PROPOSE_RESCHEDULE", reason, proposedSlotId })} className="min-h-11 rounded-md border border-edge px-4 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-50">{transition.isPending ? "Đang gửi..." : "Đề xuất giờ mới"}</button></div> : <p className="text-xs text-ink-muted">Bạn đã dùng hết hai lần đề xuất đổi lịch cho booking này.</p>}{remainingProposals > 0 && availableProposalSlots.length === 0 ? <p className="mt-2 text-xs text-ink-muted">Hiện không có khung giờ còn trống khác để đề xuất.</p> : null}</div> : null}</section>{booking.data.participantCases?.filter((item) => item.requestedBy !== user?.id).map((item) => <section key={item.id} className="mt-5 rounded-xl border border-notice/30 bg-notice-soft p-5"><p className="text-sm text-ink">{item.summary}</p><div className="mt-3 flex gap-2"><button disabled={reason.trim().length < 5} onClick={() => resolveCase.mutate({ caseId: item.id, action: "APPROVE", version: item.version })} className="rounded-md bg-primary px-4 py-2 text-xs text-on-primary">Đồng ý</button><button disabled={reason.trim().length < 5} onClick={() => resolveCase.mutate({ caseId: item.id, action: "DISMISS", version: item.version })} className="rounded-md border border-edge px-4 py-2 text-xs">Từ chối</button></div></section>)}</> : null}</main></div>;
}
