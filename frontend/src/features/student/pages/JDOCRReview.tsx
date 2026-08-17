import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ApiError } from "@/shared/api/client";
import { jobDescriptionsApi, type JobDescription } from "@/shared/api/resources";
import AuthNavbar from "@/shared/components/AuthNavbar";
import ErrorPanel from "@/shared/components/ErrorPanel";
import JDFlowStepper from "@/shared/components/JDFlowStepper";

function ReviewEditor({ jd }: { jd: JobDescription }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [value, setValue] = useState(jd.correctedText ?? jd.extractedText ?? "");
  const save = useMutation({ mutationFn: () => jobDescriptionsApi.saveCorrectedText(jd.id, value, jd.correctedVersion), onSuccess: (result) => queryClient.setQueryData(["jd", jd.id], result) });
  const confirm = useMutation({ mutationFn: async () => {
    const current = value.trim() !== (save.data?.correctedText ?? jd.correctedText ?? jd.extractedText ?? "").trim()
      ? await jobDescriptionsApi.saveCorrectedText(jd.id, value, save.data?.correctedVersion ?? jd.correctedVersion)
      : save.data ?? jd;
    const confirmed = await jobDescriptionsApi.confirm(jd.id, current.correctedVersion);
    try {
      const job = await jobDescriptionsApi.startAiAnalysis(jd.id, confirmed.correctedVersion);
      return { confirmed, aiJobId: job.id };
    } catch (error) {
      const fallbackCodes = new Set(["AI_DISABLED", "AI_PROVIDER_UNAVAILABLE", "AI_DAILY_BUDGET_REACHED"]);
      if (!(error instanceof ApiError) || !fallbackCodes.has(error.code)) throw error;
      await jobDescriptionsApi.analyze(jd.id, confirmed.correctedVersion);
      return { confirmed, aiJobId: null };
    }
  }, onSuccess: ({ aiJobId }) => navigate(`/job-descriptions/${jd.id}/mapping${aiJobId ? `?aiJobId=${aiJobId}` : ""}`) });
  return <><label className="block text-xs font-semibold text-ink-secondary">Văn bản đã chỉnh sửa<textarea rows={20} value={value} onChange={(event) => setValue(event.target.value)} className="mt-2 w-full rounded-lg border border-edge bg-panel p-4 text-sm leading-6 outline-none focus:border-primary" /></label><p className="mt-3 text-xs text-ink-muted">Gemini có thể hỗ trợ nhận diện yêu cầu. Bạn vẫn là người xác nhận kết quả trước khi hệ thống tìm câu hỏi; khi AI không khả dụng, hệ thống tự dùng bộ phân tích quy tắc.</p>{(save.error || confirm.error) && <div className="mt-4"><ErrorPanel error={save.error || confirm.error} /></div>}<div className="mt-5 flex flex-wrap justify-end gap-2"><button disabled={save.isPending || value.trim().length === 0} onClick={() => save.mutate()} className="rounded-lg border border-edge bg-panel px-5 py-2.5 text-sm font-medium text-ink-secondary">Lưu bản chỉnh sửa</button><button disabled={confirm.isPending || save.isPending || value.trim().length === 0} onClick={() => confirm.mutate()} className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-on-primary">{confirm.isPending ? "Đang tạo phân tích…" : "Xác nhận và phân tích"}</button></div></>;
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
