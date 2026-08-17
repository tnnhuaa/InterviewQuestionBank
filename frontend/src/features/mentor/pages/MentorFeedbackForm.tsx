import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { ApiError } from "@/shared/api/client";
import { aiApi, bookingsApi, type FeedbackDraft } from "@/shared/api/resources";
import AuthNavbar from "@/shared/components/AuthNavbar";
import ErrorPanel from "@/shared/components/ErrorPanel";

type Scores = FeedbackDraft["rubricScores"];

export default function MentorFeedbackForm() {
  const { bookingId = "" } = useParams();
  const navigate = useNavigate();
  const [strengths, setStrengths] = useState("");
  const [weaknesses, setWeaknesses] = useState("");
  const [actions, setActions] = useState("");
  const [scores, setScores] = useState<Scores>({ communication: 3, technical: 3, structure: 3 });
  const [sessionNotes, setSessionNotes] = useState("");
  const [jobId, setJobId] = useState("");
  const [formTouched, setFormTouched] = useState(false);
  const [appliedDraftId, setAppliedDraftId] = useState("");
  const capabilities = useQuery({ queryKey: ["ai-capabilities"], queryFn: aiApi.capabilities });
  const draft = useQuery({ queryKey: ["feedback-draft", bookingId], queryFn: () => bookingsApi.feedbackDraft(bookingId), enabled: Boolean(bookingId), retry: false });
  const startDraft = useMutation({ mutationFn: () => bookingsApi.startFeedbackDraft(bookingId, sessionNotes), onSuccess: (job) => setJobId(job.id) });
  const job = useQuery({ queryKey: ["ai-job", jobId], queryFn: () => aiApi.getJob(jobId), enabled: Boolean(jobId), refetchInterval: (query) => ["PENDING", "PROCESSING"].includes(query.state.data?.status ?? "") ? 1500 : false });
  useEffect(() => {
    if (job.data?.status === "SUCCEEDED") void draft.refetch();
  }, [job.data?.status]); // eslint-disable-line react-hooks/exhaustive-deps

  const actionPayload = (sourceDraft?: FeedbackDraft) => actions.split("\n").map((item) => item.trim()).filter(Boolean).map((description) => {
    const reference = sourceDraft?.nextActions.find((item) => item.description === description);
    return { description, ...(reference?.topicId ? { topicId: reference.topicId } : {}), ...(reference?.questionId ? { questionId: reference.questionId } : {}) };
  });
  const submit = useMutation({
    mutationFn: () => bookingsApi.createFeedback(bookingId, {
      rubricScores: scores,
      strengths,
      weaknesses,
      nextActions: actionPayload(draft.data),
      ...(appliedDraftId ? { draftId: appliedDraftId } : {}),
    }),
    onSuccess: () => navigate(`/mentor/bookings/${bookingId}`),
  });
  const saveDraft = useMutation({
    mutationFn: () => bookingsApi.updateFeedbackDraft(bookingId, draft.data!.id, {
      rubricScores: scores,
      strengths,
      weaknesses,
      nextActions: actionPayload(draft.data),
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
    setActions(draft.data.nextActions.map((item) => item.description).join("\n"));
    setAppliedDraftId(draft.data.id);
    setFormTouched(true);
  };
  const touch = () => setFormTouched(true);
  const enabled = capabilities.data?.enabled && capabilities.data.features.feedbackDraft;
  const running = ["PENDING", "PROCESSING"].includes(job.data?.status ?? "");
  const draftNotFound = draft.error instanceof ApiError && draft.error.status === 404;

  return <div className="min-h-screen bg-canvas"><AuthNavbar /><main className="mx-auto max-w-[760px] px-6 py-8"><h1 className="text-[22px] font-semibold text-ink">Feedback có cấu trúc</h1><p className="mt-1 text-sm text-ink-secondary">Gemini chỉ tạo bản nháp từ ghi chú của bạn. Feedback chỉ được gửi sau khi Mentor kiểm tra và bấm gửi.</p>
    <section className="mt-6 rounded-xl border border-edge bg-canvas-subtle p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-sm font-semibold text-ink">Tạo draft bằng Gemini</h2><p className="mt-1 text-xs text-ink-muted">Không nhập mật khẩu, meeting link hoặc dữ liệu riêng không cần thiết. Ghi chú được mã hóa tạm thời và xóa sau xử lý.</p></div><button disabled={!enabled || sessionNotes.trim().length < 20 || startDraft.isPending || running} onClick={() => startDraft.mutate()} className="rounded-md bg-primary px-4 py-2 text-xs font-medium text-on-primary disabled:opacity-50">{running ? "Đang tạo draft…" : "Tạo draft AI"}</button></div><label className="mt-4 block text-xs font-semibold text-ink-secondary">Ghi chú buổi phỏng vấn<textarea rows={5} value={sessionNotes} onChange={(event) => setSessionNotes(event.target.value)} placeholder="Ghi lại evidence về cách ứng viên trả lời, điểm làm tốt và điểm cần cải thiện…" className="mt-1.5 w-full rounded-md border border-edge bg-panel p-3 text-sm" /></label>{capabilities.data && !enabled && <p className="mt-3 text-xs text-ink-muted">Tính năng AI đang tắt; form feedback thủ công bên dưới vẫn hoạt động đầy đủ.</p>}{job.data?.status === "SUCCEEDED_WITH_FALLBACK" && <p className="mt-3 text-xs text-notice-ink">Gemini không khả dụng. Ghi chú của bạn đã được xóa khỏi hàng đợi; hãy tiếp tục điền form thủ công.</p>}{startDraft.error && <div className="mt-4"><ErrorPanel error={startDraft.error} /></div>}{job.error && <div className="mt-4"><ErrorPanel error={job.error} onRetry={() => job.refetch()} /></div>}{draft.error && !draftNotFound && <div className="mt-4"><ErrorPanel error={draft.error} onRetry={() => draft.refetch()} /></div>}{draft.data && <div className="mt-4 rounded-lg border border-primary/20 bg-primary-soft p-4"><p className="text-xs font-semibold text-primary">Draft Gemini đã sẵn sàng · v{draft.data.version}</p><p className="mt-1 text-xs text-ink-secondary">Hệ thống không tự ghi đè form. Chỉ áp dụng khi bạn chưa chỉnh form thủ công.</p><button disabled={formTouched} onClick={applyDraft} className="mt-3 rounded-md border border-primary/30 bg-panel px-3 py-1.5 text-xs font-medium text-primary disabled:opacity-50">{appliedDraftId ? "Đã áp dụng vào form" : "Áp dụng draft vào form"}</button></div>}</section>
    {(submit.error || saveDraft.error) && <div className="mt-5"><ErrorPanel error={submit.error || saveDraft.error} /></div>}<form onSubmit={(event) => { event.preventDefault(); submit.mutate(); }} className="mt-6 space-y-5 rounded-xl border border-edge bg-panel p-6"><fieldset><legend className="text-xs font-semibold text-ink-secondary">Rubric cố định 0–5</legend><div className="mt-2 grid gap-3 sm:grid-cols-3">{Object.entries(scores).map(([key, value]) => <label key={key} className="text-xs text-ink-secondary">{key}<input type="number" min={0} max={5} value={value} onChange={(event) => { touch(); setScores((current) => ({ ...current, [key]: Number(event.target.value) })); }} className="mt-1 block w-full rounded-md border border-edge px-3 py-2 text-sm" /></label>)}</div></fieldset><label className="block text-xs font-semibold text-ink-secondary">Điểm mạnh<textarea required minLength={10} rows={4} value={strengths} onChange={(event) => { touch(); setStrengths(event.target.value); }} className="mt-1.5 w-full rounded-md border border-edge p-3 text-sm" /></label><label className="block text-xs font-semibold text-ink-secondary">Điểm cần cải thiện<textarea required minLength={10} rows={4} value={weaknesses} onChange={(event) => { touch(); setWeaknesses(event.target.value); }} className="mt-1.5 w-full rounded-md border border-edge p-3 text-sm" /></label><label className="block text-xs font-semibold text-ink-secondary">Next actions — mỗi dòng một hành động<textarea required rows={5} value={actions} onChange={(event) => { touch(); setActions(event.target.value); }} className="mt-1.5 w-full rounded-md border border-edge p-3 text-sm" /></label>{draft.data && appliedDraftId && <button type="button" disabled={saveDraft.isPending} onClick={() => saveDraft.mutate()} className="w-full rounded-lg border border-edge bg-panel px-5 py-3 text-sm font-medium text-ink-secondary">Lưu chỉnh sửa vào draft</button>}<button disabled={submit.isPending} className="w-full rounded-lg bg-primary px-5 py-3 text-sm font-medium text-on-primary">Gửi feedback chính thức một lần</button></form>
  </main></div>;
}
