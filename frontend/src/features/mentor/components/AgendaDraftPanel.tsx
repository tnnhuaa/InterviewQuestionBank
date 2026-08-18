import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ApiError } from "@/shared/api/client";
import { aiApi, bookingsApi, type AgendaDraft, type AgendaSection, type Booking } from "@/shared/api/resources";
import ErrorPanel from "@/shared/components/ErrorPanel";

function AgendaEditor({ booking, draft, onSaved }: { booking: Booking; draft: AgendaDraft; onSaved: () => void }) {
  const [sections, setSections] = useState<AgendaSection[]>(draft.agenda);
  const save = useMutation({
    mutationFn: (status: AgendaDraft["status"]) => bookingsApi.updateAgendaDraft(booking.id, draft.id, {
      agenda: sections,
      status,
      version: draft.version,
    }),
    onSuccess: onSaved,
  });
  const updateSection = (index: number, patch: Partial<AgendaSection>) => setSections((current) => current.map((section, currentIndex) => currentIndex === index ? { ...section, ...patch } : section));
  return <div className="mt-4 space-y-3">{sections.map((section, index) => <article key={`${index}:${section.title}`} className="rounded-lg border border-edge bg-panel p-4"><div className="grid gap-3 sm:grid-cols-[1fr_130px]"><label className="text-xs font-medium text-ink-secondary">Tên phần<input value={section.title} onChange={(event) => updateSection(index, { title: event.target.value })} className="mt-1 w-full rounded-md border border-edge px-3 py-2 text-sm" /></label><label className="text-xs font-medium text-ink-secondary">Phút<input type="number" min={1} max={120} value={section.durationMinutes} onChange={(event) => updateSection(index, { durationMinutes: Number(event.target.value) })} className="mt-1 w-full rounded-md border border-edge px-3 py-2 text-sm" /></label></div><label className="mt-3 block text-xs font-medium text-ink-secondary">Mục tiêu<textarea value={section.objective} onChange={(event) => updateSection(index, { objective: event.target.value })} className="mt-1 w-full rounded-md border border-edge p-3 text-sm" /></label><label className="mt-3 block text-xs font-medium text-ink-secondary">Ghi chú của Mentor<textarea value={section.notes} onChange={(event) => updateSection(index, { notes: event.target.value })} className="mt-1 w-full rounded-md border border-edge p-3 text-sm" /></label>{section.questionIds.length > 0 && <ul className="mt-3 space-y-1">{section.questionIds.map((questionId) => <li key={questionId} className="text-xs text-ink-muted">• {booking.questionGroups?.find((question) => question.id === questionId)?.title ?? questionId}</li>)}</ul>}</article>)}{save.error && <ErrorPanel error={save.error} />}<div className="flex flex-wrap gap-2"><button disabled={save.isPending} onClick={() => save.mutate("DRAFT")} className="rounded-md border border-edge bg-panel px-4 py-2 text-xs font-medium text-ink-secondary">Lưu chỉnh sửa</button><button disabled={save.isPending} onClick={() => save.mutate("USED")} className="rounded-md bg-primary px-4 py-2 text-xs font-medium text-on-primary">Dùng agenda này</button></div></div>;
}

export default function AgendaDraftPanel({ booking }: { booking: Booking }) {
  const [jobId, setJobId] = useState("");
  const capabilities = useQuery({ queryKey: ["ai-capabilities"], queryFn: aiApi.capabilities });
  const draft = useQuery({
    queryKey: ["agenda-draft", booking.id],
    queryFn: () => bookingsApi.agendaDraft(booking.id),
    enabled: booking.status === "CONFIRMED",
    retry: false,
  });
  const start = useMutation({ mutationFn: () => bookingsApi.startAgendaDraft(booking.id), onSuccess: (job) => setJobId(job.id) });
  const job = useQuery({ queryKey: ["ai-job", jobId], queryFn: () => aiApi.getJob(jobId), enabled: Boolean(jobId), refetchInterval: (query) => ["PENDING", "PROCESSING"].includes(query.state.data?.status ?? "") ? 1500 : false });
  useEffect(() => {
    if (job.data?.status === "SUCCEEDED") void draft.refetch();
  }, [job.data?.status]); // eslint-disable-line react-hooks/exhaustive-deps
  const notFound = draft.error instanceof ApiError && draft.error.status === 404;
  const enabled = capabilities.data?.enabled && capabilities.data.features.agendaDraft;
  const running = ["PENDING", "PROCESSING"].includes(job.data?.status ?? "");
  return <section className="mt-5 rounded-xl border border-edge bg-canvas-subtle p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-sm font-semibold text-ink">Agenda phỏng vấn</h2><p className="mt-1 text-xs text-ink-muted">Gemini chỉ soạn draft từ booking snapshot; Mentor phải đọc, sửa và chọn sử dụng.</p></div><button disabled={!enabled || start.isPending || running} onClick={() => start.mutate()} className="rounded-md bg-primary px-4 py-2 text-xs font-medium text-on-primary disabled:opacity-50">{running ? "Đang soạn agenda…" : draft.data ? "Tạo lại draft" : "Soạn bằng Gemini"}</button></div>{capabilities.data && !enabled && <p className="mt-3 text-xs text-ink-muted">Tính năng AI đang tắt. Bạn vẫn có thể dùng goal và question groups trong booking để chuẩn bị thủ công.</p>}{job.data?.status === "SUCCEEDED_WITH_FALLBACK" && <p className="mt-3 text-xs text-notice-ink">Gemini không khả dụng; booking và danh sách câu hỏi vẫn được giữ để Mentor soạn thủ công.</p>}{job.data?.status === "FAILED" && <p className="mt-3 text-xs text-danger">Không thể tạo agenda. Hãy soạn thủ công và gửi mã hỗ trợ {job.data.operationCaseId ?? job.data.id} cho Admin nếu cần.</p>}{start.error && <div className="mt-4"><ErrorPanel error={start.error} /></div>}{job.error && <div className="mt-4"><ErrorPanel error={job.error} onRetry={() => job.refetch()} /></div>}{draft.error && !notFound && <div className="mt-4"><ErrorPanel error={draft.error} onRetry={() => draft.refetch()} /></div>}{draft.data && <AgendaEditor key={`${draft.data.id}:${draft.data.version}`} booking={booking} draft={draft.data} onSaved={() => { void draft.refetch(); }} />}</section>;
}
