import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Link, useBlocker, useNavigate, useParams } from "react-router-dom";
import { ApiError } from "@/shared/api/client";
import { jobDescriptionsApi, type JobDescription } from "@/shared/api/resources";
import AuthNavbar from "@/shared/components/AuthNavbar";
import ErrorPanel from "@/shared/components/ErrorPanel";
import JDFlowStepper from "@/shared/components/JDFlowStepper";

const MAX_JD_TEXT_LENGTH = 50000;

function ReviewEditor({ jd }: { jd: JobDescription }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const initialText = jd.correctedText ?? jd.extractedText ?? "";
  const [value, setValue] = useState(initialText);
  const [savedText, setSavedText] = useState(initialText);
  const allowNavigationRef = useRef(false);
  const isDirty = value !== savedText;
  const isTooLong = value.length > MAX_JD_TEXT_LENGTH;
  const isEmpty = value.trim().length === 0;
  const blocker = useBlocker(() => isDirty && !allowNavigationRef.current);

  useEffect(() => {
    if (!isDirty) return undefined;
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  useEffect(() => {
    if (blocker.state !== "blocked") return;
    const shouldLeave = window.confirm("Bạn có thay đổi JD chưa được lưu. Bạn có chắc muốn rời trang?");
    if (shouldLeave) blocker.proceed();
    else blocker.reset();
  }, [blocker]);

  const save = useMutation({
    mutationFn: () => jobDescriptionsApi.saveCorrectedText(jd.id, value, jd.correctedVersion),
    onSuccess: (result) => {
      queryClient.setQueryData(["jd", jd.id], result);
      setSavedText(result.correctedText ?? value);
    },
  });
  const confirm = useMutation({ mutationFn: async () => {
    const current = value !== (save.data?.correctedText ?? jd.correctedText ?? jd.extractedText ?? "")
      ? await jobDescriptionsApi.saveCorrectedText(jd.id, value, save.data?.correctedVersion ?? jd.correctedVersion)
      : save.data ?? jd;
    const confirmed = await jobDescriptionsApi.confirm(jd.id, current.correctedVersion);
    try {
      const job = await jobDescriptionsApi.startAiAnalysis(jd.id, confirmed.correctedVersion);
      return { confirmed, aiJobId: job.id };
    } catch (error) {
      const fallbackCodes = new Set(["AI_DISABLED", "AI_DISABLED_BY_OPERATIONS", "AI_PROVIDER_UNAVAILABLE", "AI_DAILY_BUDGET_REACHED"]);
      if (!(error instanceof ApiError) || !fallbackCodes.has(error.code)) throw error;
      await jobDescriptionsApi.analyze(jd.id, confirmed.correctedVersion);
      return { confirmed, aiJobId: null };
    }
  }, onSuccess: ({ aiJobId }) => {
    allowNavigationRef.current = true;
    setSavedText(value);
    navigate(`/job-descriptions/${jd.id}/mapping${aiJobId ? `?aiJobId=${aiJobId}` : ""}`);
  } });
  return <><div className="flex flex-wrap items-end justify-between gap-2"><div><label htmlFor="jd-corrected-text" className="block text-xs font-semibold text-ink-secondary">Nội dung JD đã trích xuất</label><p className="mt-1 text-xs text-ink-muted">Kiểm tra và sửa các lỗi trích xuất nếu có. Hệ thống sẽ dùng chính văn bản bạn xác nhận để phân tích JD.</p></div><span className={isDirty ? "text-xs font-medium text-notice-ink" : "text-xs font-medium text-success"}>{isDirty ? "Chưa lưu" : "Đã lưu"}</span></div><textarea id="jd-corrected-text" rows={20} value={value} onChange={(event) => setValue(event.target.value)} aria-describedby="jd-text-status jd-save-hint" aria-invalid={isTooLong} className="mt-2 w-full rounded-lg border border-edge bg-panel p-4 text-sm leading-6 outline-none focus:border-primary" /><div id="jd-text-status" className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs"><span className={isTooLong ? "text-danger" : "text-ink-muted"}>{value.length.toLocaleString("vi-VN")} / {MAX_JD_TEXT_LENGTH.toLocaleString("vi-VN")} ký tự</span>{isTooLong && <span className="text-danger">JD không được vượt quá 50.000 ký tự.</span>}</div><p id="jd-save-hint" className="mt-3 text-xs text-ink-muted">“Lưu bản nháp” chỉ lưu nội dung để bạn có thể quay lại sau. “Xác nhận và phân tích” sẽ tự lưu thay đổi hiện tại, xác nhận JD và bắt đầu phân tích.</p>{(save.error || confirm.error) && <div className="mt-4"><ErrorPanel error={save.error || confirm.error} /></div>}<div className="mt-5 flex flex-wrap justify-end gap-2"><button disabled={save.isPending || !isDirty || isEmpty || isTooLong} onClick={() => save.mutate()} className="rounded-lg border border-edge bg-panel px-5 py-2.5 text-sm font-medium text-ink-secondary disabled:opacity-50">{save.isPending ? "Đang lưu…" : "Lưu bản nháp"}</button><button disabled={confirm.isPending || save.isPending || isEmpty || isTooLong} onClick={() => confirm.mutate()} className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-on-primary disabled:opacity-50">{confirm.isPending ? "Đang tạo phân tích…" : "Xác nhận và phân tích JD"}</button></div></>;
}

export default function JDOCRReview() {
  const { jobDescriptionId = "" } = useParams();
  const jd = useQuery({ queryKey: ["jd", jobDescriptionId], queryFn: () => jobDescriptionsApi.get(jobDescriptionId), enabled: Boolean(jobDescriptionId), refetchInterval: (query) => ["DRAFT", "EXTRACTING"].includes(query.state.data?.status ?? "") ? 2000 : false });
  const retry = useMutation({ mutationFn: () => jobDescriptionsApi.retryExtraction(jobDescriptionId), onSuccess: () => jd.refetch() });
  const processing = jd.data && ["DRAFT", "EXTRACTING"].includes(jd.data.status);
  return <div className="min-h-screen bg-canvas"><AuthNavbar /><main className="mx-auto max-w-[980px] px-6 py-8"><JDFlowStepper currentStep={2} /><h1 className="mt-8 text-[22px] font-semibold text-ink">Kiểm tra nội dung JD</h1><p className="mt-1 text-sm text-ink-secondary">Bạn luôn cần đọc, sửa nếu cần và xác nhận trước khi hệ thống tạo dữ liệu dẫn xuất.</p>
    {jd.isLoading && <p className="mt-8 text-sm text-ink-muted">Đang đọc trạng thái xử lý…</p>}{jd.error && <div className="mt-5"><ErrorPanel error={jd.error} onRetry={() => jd.refetch()} /></div>}
    {processing && <div className="mt-6 rounded-xl border border-notice/20 bg-notice-soft p-6"><p className="text-sm font-semibold text-ink">Đang trích xuất văn bản</p><p className="mt-1 text-xs text-ink-secondary">Worker xử lý tối đa hai job đồng thời. Trang tự cập nhật mỗi 2 giây.</p></div>}
    {jd.data?.status === "FAILED" && <div className="mt-6 rounded-xl border border-danger/20 bg-danger-soft p-6"><p className="text-sm font-semibold text-ink">Không thể trích xuất tự động</p><p className="mt-1 text-xs text-ink-secondary">Bạn có thể thử lại, tải tệp khác hoặc dán văn bản thủ công.</p>{retry.error && <div className="mt-4"><ErrorPanel error={retry.error} /></div>}<div className="mt-4 flex gap-2"><button onClick={() => retry.mutate()} className="rounded-md bg-primary px-4 py-2 text-xs font-medium text-on-primary">Thử lại an toàn</button><Link to="/job-descriptions/new" className="rounded-md border border-edge bg-panel px-4 py-2 text-xs font-medium text-ink-secondary">Dán/tải nội dung khác</Link></div></div>}
    {jd.data && ["READY_FOR_REVIEW", "CONFIRMED", "ANALYZED"].includes(jd.data.status) && <div className="mt-6 rounded-xl border border-edge bg-canvas-subtle p-6"><ReviewEditor key={`${jd.data.id}:${jd.data.correctedVersion}`} jd={jd.data} /></div>}
  </main></div>;
}
