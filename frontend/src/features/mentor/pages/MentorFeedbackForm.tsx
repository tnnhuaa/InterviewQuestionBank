import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ApiError } from "@/shared/api/client";
import { aiApi, bookingsApi, type FeedbackDraft } from "@/shared/api/resources";
import AuthNavbar from "@/shared/components/AuthNavbar";
import ErrorPanel from "@/shared/components/ErrorPanel";

type Scores = FeedbackDraft["rubricScores"];
type ScoreKey = keyof Scores;
type DraftAction = FeedbackDraft["nextActions"][number];
type FormAction = DraftAction & { clientId: string };

let nextActionSequence = 0;

function createFormAction(action: DraftAction = { description: "" }): FormAction {
  nextActionSequence += 1;
  return { clientId: `feedback-action-${nextActionSequence}`, ...action };
}

const RUBRIC_LABELS: Record<ScoreKey, string> = {
  technical: "Kiến thức kỹ thuật",
  communication: "Giao tiếp",
  structure: "Cấu trúc câu trả lời",
};

function formatBookingTime(startsAt: string, endsAt: string, timezone: string) {
  const options: Intl.DateTimeFormatOptions = {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: timezone,
  };
  try {
    const start = new Intl.DateTimeFormat("vi-VN", options).format(new Date(startsAt));
    const end = new Intl.DateTimeFormat("vi-VN", { timeStyle: "short", timeZone: timezone }).format(new Date(endsAt));
    return `${start}–${end} · ${timezone}`;
  } catch {
    return `${new Date(startsAt).toLocaleString("vi-VN")}–${new Date(endsAt).toLocaleTimeString("vi-VN")}`;
  }
}

export default function MentorFeedbackForm() {
  const { bookingId = "" } = useParams();
  const navigate = useNavigate();
  const [strengths, setStrengths] = useState("");
  const [weaknesses, setWeaknesses] = useState("");
  const [actions, setActions] = useState<FormAction[]>(() => [createFormAction()]);
  const [scores, setScores] = useState<Scores>({ communication: 3, technical: 3, structure: 3 });
  const [sessionNotes, setSessionNotes] = useState("");
  const [jobId, setJobId] = useState("");
  const [formTouched, setFormTouched] = useState(false);
  const [appliedDraftId, setAppliedDraftId] = useState("");

  const booking = useQuery({ queryKey: ["booking", bookingId], queryFn: () => bookingsApi.get(bookingId), enabled: Boolean(bookingId) });
  const existingFeedback = useQuery({
    queryKey: ["feedback", bookingId],
    queryFn: () => bookingsApi.feedback(bookingId),
    enabled: Boolean(bookingId) && booking.data?.status === "COMPLETED",
    retry: false,
  });
  const existingFeedbackNotFound = existingFeedback.error instanceof ApiError && existingFeedback.error.status === 404;
  const canCreateFeedback = booking.data?.status === "COMPLETED" && (existingFeedbackNotFound || (!existingFeedback.data && !existingFeedback.isLoading));

  const capabilities = useQuery({ queryKey: ["ai-capabilities"], queryFn: aiApi.capabilities, enabled: Boolean(canCreateFeedback) });
  const draft = useQuery({
    queryKey: ["feedback-draft", bookingId],
    queryFn: () => bookingsApi.feedbackDraft(bookingId),
    enabled: Boolean(bookingId) && Boolean(canCreateFeedback),
    retry: false,
  });
  const startDraft = useMutation({ mutationFn: () => bookingsApi.startFeedbackDraft(bookingId, sessionNotes), onSuccess: (job) => setJobId(job.id) });
  const job = useQuery({ queryKey: ["ai-job", jobId], queryFn: () => aiApi.getJob(jobId), enabled: Boolean(jobId), refetchInterval: (query) => ["PENDING", "PROCESSING"].includes(query.state.data?.status ?? "") ? 1500 : false });

  useEffect(() => {
    if (job.data?.status === "SUCCEEDED") void draft.refetch();
  }, [job.data?.status]); // eslint-disable-line react-hooks/exhaustive-deps

  const actionPayload = () => actions.map((action) => ({
    description: action.description.trim(),
    ...(action.topicId ? { topicId: action.topicId } : {}),
    ...(action.questionId ? { questionId: action.questionId } : {}),
  })).filter((action) => action.description.length > 0);
  const submit = useMutation({
    mutationFn: () => bookingsApi.createFeedback(bookingId, {
      rubricScores: scores,
      strengths,
      weaknesses,
      nextActions: actionPayload(),
      ...(appliedDraftId ? { draftId: appliedDraftId } : {}),
    }),
    onSuccess: () => navigate(`/mentor/bookings/${bookingId}`),
  });
  const saveDraft = useMutation({
    mutationFn: () => bookingsApi.updateFeedbackDraft(bookingId, draft.data!.id, {
      rubricScores: scores,
      strengths,
      weaknesses,
      nextActions: actionPayload(),
      status: "DRAFT",
      version: draft.data!.version,
    }),
    onSuccess: () => draft.refetch(),
  });
  const applyDraft = () => {
    if (!draft.data || formTouched) return;
    setScores(draft.data.rubricScores);
    setStrengths(draft.data.strengths);
    setWeaknesses(draft.data.weaknesses);
    setActions(draft.data.nextActions.map((action) => createFormAction(action)));
    setAppliedDraftId(draft.data.id);
    setFormTouched(true);
  };
  const touch = () => setFormTouched(true);
  const enabled = capabilities.data?.enabled && capabilities.data.features.feedbackDraft;
  const running = ["PENDING", "PROCESSING"].includes(job.data?.status ?? "");
  const draftNotFound = draft.error instanceof ApiError && draft.error.status === 404;

  if (booking.error) {
    return <div className="min-h-screen bg-canvas"><AuthNavbar /><main className="mx-auto max-w-[760px] px-6 py-8"><ErrorPanel error={booking.error} onRetry={() => booking.refetch()} /></main></div>;
  }
  if (booking.isLoading || !booking.data) {
    return <div className="min-h-screen bg-canvas"><AuthNavbar /><main className="mx-auto max-w-[760px] px-6 py-8"><p className="text-sm text-ink-muted">Đang tải thông tin buổi phỏng vấn…</p></main></div>;
  }

  return <div className="min-h-screen bg-canvas"><AuthNavbar /><main className="mx-auto max-w-[760px] px-6 py-8">
    <h1 className="text-[22px] font-semibold text-ink">Phản hồi có cấu trúc</h1>
    <p className="mt-1 text-sm text-ink-secondary">Phản hồi chỉ được gửi sau khi Mentor kiểm tra nội dung và xác nhận gửi chính thức.</p>

    <section className="mt-6 rounded-xl border border-edge bg-panel p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Buổi phỏng vấn</p>
          <h2 className="mt-1 text-base font-semibold text-ink">{booking.data.studentName ?? "Học viên"}</h2>
          <p className="mt-1 text-xs text-ink-muted">{formatBookingTime(booking.data.startsAt, booking.data.endsAt, booking.data.timezone)}</p>
        </div>
        <span className="rounded-full bg-canvas-subtle px-3 py-1 text-xs font-medium text-ink-secondary">{booking.data.interviewType}</span>
      </div>
      <p className="mt-4 text-sm text-ink-secondary"><span className="font-medium text-ink">Mục tiêu:</span> {booking.data.goal}</p>
      {booking.data.topicNames.length ? <div className="mt-3 flex flex-wrap gap-2">{booking.data.topicNames.map((topic) => <span key={topic} className="rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-medium text-primary">{topic}</span>)}</div> : null}
    </section>

    {booking.data.status !== "COMPLETED" ? <section className="mt-6 rounded-xl border border-notice/30 bg-notice-soft p-5"><h2 className="text-sm font-semibold text-notice-ink">Chưa thể gửi phản hồi</h2><p className="mt-2 text-sm text-ink-secondary">Chỉ có thể gửi phản hồi sau khi buổi phỏng vấn đã được đánh dấu hoàn tất.</p><Link to={`/mentor/bookings/${bookingId}`} className="mt-4 inline-block text-sm font-medium text-primary">Quay lại chi tiết booking</Link></section> : existingFeedback.isLoading ? <p className="mt-6 text-sm text-ink-muted">Đang kiểm tra phản hồi hiện có…</p> : existingFeedback.data ? <section className="mt-6 rounded-xl border border-ok/30 bg-ok-soft p-5"><h2 className="text-sm font-semibold text-ok">Phản hồi đã được gửi</h2><p className="mt-2 text-sm text-ink-secondary">Booking này đã có phản hồi chính thức. Hệ thống không cho tạo phản hồi lần hai.</p><Link to={`/mentor/bookings/${bookingId}`} className="mt-4 inline-block text-sm font-medium text-primary">Quay lại chi tiết booking</Link></section> : existingFeedback.error && !existingFeedbackNotFound ? <div className="mt-6"><ErrorPanel error={existingFeedback.error} onRetry={() => existingFeedback.refetch()} /></div> : <>
      <section className="mt-6 rounded-xl border border-edge bg-canvas-subtle p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-sm font-semibold text-ink">Tạo draft bằng Gemini</h2><p className="mt-1 text-xs text-ink-muted">Không nhập mật khẩu, meeting link hoặc dữ liệu riêng không cần thiết. Ghi chú được mã hóa tạm thời và xóa sau xử lý.</p></div><button disabled={!enabled || sessionNotes.trim().length < 20 || startDraft.isPending || running} onClick={() => startDraft.mutate()} className="rounded-md bg-primary px-4 py-2 text-xs font-medium text-on-primary disabled:opacity-50">{running ? "Đang tạo draft…" : "Tạo draft AI"}</button></div><label className="mt-4 block text-xs font-semibold text-ink-secondary">Ghi chú buổi phỏng vấn<textarea rows={5} value={sessionNotes} onChange={(event) => setSessionNotes(event.target.value)} placeholder="Ghi lại evidence về cách ứng viên trả lời, điểm làm tốt và điểm cần cải thiện…" className="mt-1.5 w-full rounded-md border border-edge bg-panel p-3 text-sm" /></label>{capabilities.data && !enabled && <p className="mt-3 text-xs text-ink-muted">Tính năng AI đang tắt; form phản hồi thủ công bên dưới vẫn hoạt động đầy đủ.</p>}{job.data?.status === "SUCCEEDED_WITH_FALLBACK" && <p className="mt-3 text-xs text-notice-ink">Gemini không khả dụng. Ghi chú của bạn đã được xóa khỏi hàng đợi; hãy tiếp tục điền form thủ công.</p>}{job.data?.status === "FAILED" && <p className="mt-3 text-xs text-danger">Không thể tạo draft. Hãy điền form thủ công và gửi mã hỗ trợ {job.data.operationCaseId ?? job.data.id} cho Admin nếu cần.</p>}{startDraft.error && <div className="mt-4"><ErrorPanel error={startDraft.error} /></div>}{job.error && <div className="mt-4"><ErrorPanel error={job.error} onRetry={() => job.refetch()} /></div>}{draft.error && !draftNotFound && <div className="mt-4"><ErrorPanel error={draft.error} onRetry={() => draft.refetch()} /></div>}{draft.data && <div className="mt-4 rounded-lg border border-primary/20 bg-primary-soft p-4"><p className="text-xs font-semibold text-primary">Draft Gemini đã sẵn sàng · v{draft.data.version}</p><p className="mt-1 text-xs text-ink-secondary">Hệ thống không tự ghi đè form. Chỉ áp dụng khi bạn chưa chỉnh form thủ công.</p><button disabled={formTouched} onClick={applyDraft} className="mt-3 rounded-md border border-primary/30 bg-panel px-3 py-1.5 text-xs font-medium text-primary disabled:opacity-50">{appliedDraftId ? "Đã áp dụng vào form" : "Áp dụng draft vào form"}</button></div>}</section>
      {(submit.error || saveDraft.error) && <div className="mt-5"><ErrorPanel error={submit.error || saveDraft.error} /></div>}
      <form onSubmit={(event) => { event.preventDefault(); if (window.confirm("Bạn sắp gửi phản hồi chính thức. Sau khi gửi, phản hồi không thể chỉnh sửa. Bạn có muốn tiếp tục?")) submit.mutate(); }} className="mt-6 space-y-5 rounded-xl border border-edge bg-panel p-6">
        <fieldset><legend className="text-xs font-semibold text-ink-secondary">Thang đánh giá cố định 0–5</legend><div className="mt-2 grid gap-3 sm:grid-cols-3">{(Object.entries(scores) as Array<[ScoreKey, number]>).map(([key, value]) => <label key={key} className="text-xs text-ink-secondary">{RUBRIC_LABELS[key]}<input type="number" min={0} max={5} value={value} onChange={(event) => { touch(); setScores((current) => ({ ...current, [key]: Number(event.target.value) })); }} className="mt-1 block w-full rounded-md border border-edge px-3 py-2 text-sm" /></label>)}</div></fieldset>
        <label className="block text-xs font-semibold text-ink-secondary">Điểm mạnh<textarea required minLength={10} rows={4} value={strengths} onChange={(event) => { touch(); setStrengths(event.target.value); }} className="mt-1.5 w-full rounded-md border border-edge p-3 text-sm" /></label>
        <label className="block text-xs font-semibold text-ink-secondary">Điểm cần cải thiện<textarea required minLength={10} rows={4} value={weaknesses} onChange={(event) => { touch(); setWeaknesses(event.target.value); }} className="mt-1.5 w-full rounded-md border border-edge p-3 text-sm" /></label>
        <fieldset>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <legend className="text-xs font-semibold text-ink-secondary">Hành động tiếp theo</legend>
              <p className="mt-1 text-xs text-ink-muted">Mỗi hành động được giữ riêng. Việc sửa nội dung không làm mất liên kết chủ đề hoặc câu hỏi từ draft.</p>
            </div>
            <button type="button" disabled={actions.length >= 20} onClick={() => { touch(); setActions((current) => [...current, createFormAction()]); }} className="rounded-md border border-edge bg-panel px-3 py-2 text-xs font-medium text-ink-secondary disabled:opacity-50">Thêm hành động</button>
          </div>
          <div className="mt-3 space-y-3">
            {actions.map((action, index) => {
              const linkedQuestion = action.questionId ? booking.data.questionGroups?.find((question) => question.id === action.questionId) : undefined;
              return <div key={action.clientId} className="rounded-lg border border-edge bg-canvas-subtle p-4">
                <div className="flex items-start gap-3">
                  <label className="min-w-0 flex-1 text-xs font-medium text-ink-secondary">Hành động {index + 1}
                    <textarea required minLength={3} maxLength={500} rows={2} value={action.description} onChange={(event) => { touch(); setActions((current) => current.map((item) => item.clientId === action.clientId ? { ...item, description: event.target.value } : item)); }} className="mt-1.5 w-full rounded-md border border-edge bg-panel p-3 text-sm" />
                  </label>
                  <button type="button" disabled={actions.length === 1} onClick={() => { touch(); setActions((current) => current.filter((item) => item.clientId !== action.clientId)); }} className="mt-5 rounded-md border border-edge bg-panel px-3 py-2 text-xs font-medium text-danger disabled:opacity-40" aria-label={`Xóa hành động ${index + 1}`}>Xóa</button>
                </div>
                {(action.topicId || action.questionId) ? <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                  {action.topicId ? <span className="rounded-full bg-primary-soft px-2.5 py-1 font-medium text-primary">Đã liên kết chủ đề</span> : null}
                  {action.questionId ? <span className="rounded-full bg-primary-soft px-2.5 py-1 font-medium text-primary">Câu hỏi: {linkedQuestion?.title ?? "đã liên kết"}</span> : null}
                </div> : <p className="mt-2 text-[11px] text-ink-muted">Hành động thủ công — chưa liên kết chủ đề/câu hỏi.</p>}
              </div>;
            })}
          </div>
        </fieldset>
        {draft.data && appliedDraftId && <button type="button" disabled={saveDraft.isPending} onClick={() => saveDraft.mutate()} className="w-full rounded-lg border border-edge bg-panel px-5 py-3 text-sm font-medium text-ink-secondary">Lưu chỉnh sửa vào draft</button>}
        <button disabled={submit.isPending} className="w-full rounded-lg bg-primary px-5 py-3 text-sm font-medium text-on-primary disabled:opacity-50">{submit.isPending ? "Đang gửi…" : "Gửi phản hồi chính thức"}</button>
      </form>
    </>}
  </main></div>;
}
