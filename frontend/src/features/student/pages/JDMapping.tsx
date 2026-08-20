import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { aiApi, jobDescriptionsApi, questionsApi, type Requirement } from "@/shared/api/resources";
import AuthNavbar from "@/shared/components/AuthNavbar";
import ErrorPanel from "@/shared/components/ErrorPanel";
import JDFlowStepper from "@/shared/components/JDFlowStepper";

const AI_RUNNING = new Set(["PENDING", "PROCESSING"]);

function confidenceLabel(confidence?: number) {
  if (confidence === undefined || confidence === null) return "Không có điểm tin cậy";
  return `Tin cậy ${Math.round(confidence * 100)}%`;
}

function RequirementCard({
  item,
  analysisVersion,
  topics,
  selectedTopic,
  onTopicChange,
  onDecision,
  pending,
}: {
  item: Requirement;
  analysisVersion: number;
  topics: Array<{ id: string; name: string }>;
  selectedTopic: string;
  onTopicChange: (topicId: string) => void;
  onDecision: (input: { requirementId: string; analysisVersion: number; decision: "ACCEPTED" | "EDITED" | "UNMAPPED"; topicId?: string | null }) => void;
  pending: boolean;
}) {
  const requiresReview = item.source === "GEMINI" && (item.confidence ?? 0) < 0.75 && !item.decision;
  const changed = selectedTopic !== (item.normalized_topic_id ?? "");
  return (
    <article className={`rounded-xl border bg-panel p-5 ${requiresReview ? "border-notice" : "border-edge"}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">{item.requirement_type}</p>
            {item.source === "GEMINI" && <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-medium text-primary">Gemini đề xuất</span>}
            {item.decision && <span className="rounded-full bg-ok-soft px-2 py-0.5 text-[11px] font-medium text-ok">Đã xác nhận</span>}
          </div>
          <blockquote className="mt-2 border-l-2 border-edge pl-3 text-sm font-medium text-ink">{item.raw_text}</blockquote>
          {item.source_start !== undefined && item.source_end !== undefined && <p className="mt-1 text-[11px] text-ink-muted">Evidence nguyên văn, ký tự {item.source_start}–{item.source_end}</p>}
        </div>
        <span className={(item.confidence ?? 1) < 0.75 ? "rounded-full bg-notice-soft px-3 py-1 text-xs font-medium text-notice-ink" : "rounded-full bg-ok-soft px-3 py-1 text-xs font-medium text-ok"}>{confidenceLabel(item.confidence)}</span>
      </div>
      <label className="mt-4 block text-xs font-medium text-ink-secondary">Chủ đề đối chiếu
        <select value={selectedTopic} onChange={(event) => onTopicChange(event.target.value)} className="mt-1.5 w-full rounded-md border border-edge bg-canvas px-3 py-2 text-sm text-ink">
          <option value="">Chưa ánh xạ</option>
          {topics.map((topic) => <option key={topic.id} value={topic.id}>{topic.name}</option>)}
        </select>
      </label>
      <div className="mt-3 flex flex-wrap gap-2">
        <button disabled={pending || !selectedTopic} onClick={() => onDecision({ requirementId: item.id, analysisVersion, decision: changed ? "EDITED" : "ACCEPTED", topicId: selectedTopic || null })} className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-on-primary disabled:opacity-50">{item.source === "GEMINI" ? (changed ? "Xác nhận chủ đề đã sửa" : "Xác nhận đề xuất") : "Lưu ánh xạ"}</button>
        <button disabled={pending} onClick={() => onDecision({ requirementId: item.id, analysisVersion, decision: "UNMAPPED", topicId: null })} className="rounded-md border border-edge bg-panel px-3 py-1.5 text-xs font-medium text-ink-secondary">Giữ chưa ánh xạ</button>
      </div>
    </article>
  );
}

export default function JDMapping() {
  const { jobDescriptionId = "" } = useParams();
  const [searchParams] = useSearchParams();
  const aiJobId = searchParams.get("aiJobId") ?? "";
  const navigate = useNavigate();
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const aiJob = useQuery({
    queryKey: ["ai-job", aiJobId],
    queryFn: () => aiApi.getJob(aiJobId),
    enabled: Boolean(aiJobId),
    refetchInterval: (query) => AI_RUNNING.has(query.state.data?.status ?? "") ? 1500 : false,
  });
  const waitingForAi = Boolean(aiJobId) && (!aiJob.data || AI_RUNNING.has(aiJob.data.status));
  const analysis = useQuery({
    queryKey: ["jd-analysis", jobDescriptionId],
    queryFn: () => jobDescriptionsApi.getAnalysis(jobDescriptionId),
    enabled: Boolean(jobDescriptionId) && !waitingForAi && aiJob.data?.status !== "FAILED",
  });
  const jd = useQuery({ queryKey: ["jd", jobDescriptionId], queryFn: () => jobDescriptionsApi.get(jobDescriptionId), enabled: Boolean(jobDescriptionId) });
  const taxonomy = useQuery({ queryKey: ["taxonomy"], queryFn: questionsApi.taxonomy });
  const decision = useMutation({
    mutationFn: (input: { requirementId: string; analysisVersion: number; decision: "ACCEPTED" | "EDITED" | "UNMAPPED"; topicId?: string | null }) => jobDescriptionsApi.decideRequirement(jobDescriptionId, input.requirementId, {
      analysisVersion: input.analysisVersion,
      decision: input.decision,
      topicId: input.topicId,
      reason: "Học sinh xác nhận kết quả phân tích JD",
    }),
    onSuccess: async () => { await analysis.refetch(); },
  });
  const fallback = useMutation({
    mutationFn: () => jobDescriptionsApi.analyze(jobDescriptionId, jd.data!.correctedVersion),
    onSuccess: () => navigate(`/job-descriptions/${jobDescriptionId}/mapping`, { replace: true }),
  });
  const retryAi = useMutation({ mutationFn: () => aiApi.retry(aiJobId), onSuccess: () => aiJob.refetch() });
  const match = useMutation({
    mutationFn: () => jobDescriptionsApi.match(jobDescriptionId, analysis.data!.analysisVersion),
    onSuccess: () => navigate(`/job-descriptions/${jobDescriptionId}/recommendations?analysisVersion=${analysis.data!.analysisVersion}`),
  });
  const pendingHumanReview = analysis.data?.requirements.filter((item) => item.source === "GEMINI" && (item.confidence ?? 0) < 0.75 && !item.decision).length ?? 0;

  return <div className="min-h-screen bg-canvas"><AuthNavbar /><main className="mx-auto max-w-[980px] px-6 py-8"><JDFlowStepper currentStep={3} /><h1 className="mt-8 text-[22px] font-semibold text-ink">Yêu cầu được nhận diện</h1><p className="mt-1 text-sm text-ink-secondary">Gemini chỉ đề xuất dựa trên đoạn nguồn. Bạn xác nhận trước khi matching; hệ thống không tự hạ threshold.</p>
    {waitingForAi && <div className="mt-6 rounded-xl border border-primary/20 bg-primary-soft p-6"><p className="text-sm font-semibold text-ink">Đang phân tích JD bằng Gemini</p><p className="mt-1 text-xs text-ink-secondary">Tác vụ chạy nền và trang tự cập nhật. Bạn có thể rời trang rồi quay lại mà không tạo tác vụ trùng.</p></div>}
    {aiJob.data?.status === "SUCCEEDED_WITH_FALLBACK" && <div className="mt-5 rounded-xl border border-notice/20 bg-notice-soft p-4 text-xs text-notice-ink">Gemini không trả kết quả an toàn sau các lượt thử. Hệ thống đã chuyển sang bộ phân tích quy tắc để bạn tiếp tục.</div>}
    {analysis.data && <div className={analysis.data.analysisSource === "GEMINI" ? "mt-5 rounded-xl border border-primary/20 bg-primary-soft p-4 text-xs text-primary" : "mt-5 rounded-xl border border-notice/20 bg-notice-soft p-4 text-xs text-notice-ink"}>{analysis.data.analysisSource === "GEMINI" ? "Kết quả phiên bản này được Gemini hỗ trợ và vẫn cần bạn xác nhận." : `Kết quả phiên bản này được tạo bởi bộ phân tích quy tắc.${analysis.data.fallbackErrorCode ? ` Gemini fallback: ${analysis.data.fallbackErrorCode}.` : " Gemini không được dùng cho phiên bản này."}`}</div>}
    {aiJob.data?.status === "FAILED" && <div className="mt-6 rounded-xl border border-danger/20 bg-danger-soft p-6"><p className="text-sm font-semibold text-ink">Không thể hoàn tất tác vụ phân tích AI</p><p className="mt-1 text-xs text-ink-secondary">Mã lỗi: {aiJob.data.errorCode ?? "AI_JOB_FAILED"}. Bạn có thể thử lại nếu còn lượt, hoặc tiếp tục ngay bằng bộ phân tích quy tắc.</p>{aiJob.data.operationCaseId && <p className="mt-2 font-mono text-[11px] text-ink-muted">Mã hỗ trợ vận hành: {aiJob.data.operationCaseId}</p>}{retryAi.error && <div className="mt-4"><ErrorPanel error={retryAi.error} /></div>}{fallback.error && <div className="mt-4"><ErrorPanel error={fallback.error} /></div>}<div className="mt-4 flex flex-wrap gap-2"><button disabled={retryAi.isPending || aiJob.data.attemptCount >= aiJob.data.maxAttempts} onClick={() => retryAi.mutate()} className="rounded-md border border-edge bg-panel px-4 py-2 text-xs font-medium text-ink-secondary disabled:opacity-50">Thử lại AI</button><button disabled={fallback.isPending || !jd.data} onClick={() => fallback.mutate()} className="rounded-md bg-primary px-4 py-2 text-xs font-medium text-on-primary disabled:opacity-50">Dùng phân tích quy tắc</button><Link to={`/job-descriptions/${jobDescriptionId}/review`} className="rounded-md border border-edge bg-panel px-4 py-2 text-xs font-medium text-ink-secondary">Sửa lại nội dung JD</Link></div></div>}
    {analysis.isLoading && !waitingForAi && <p className="mt-8 text-sm text-ink-muted">Đang tải kết quả phân tích…</p>}{(analysis.error || aiJob.error) && <div className="mt-5"><ErrorPanel error={analysis.error || aiJob.error} onRetry={() => aiJob.error ? aiJob.refetch() : analysis.refetch()} /></div>}
    {pendingHumanReview > 0 && <div className="mt-5 rounded-xl border border-notice/20 bg-notice-soft p-4 text-xs text-notice-ink">Còn {pendingHumanReview} yêu cầu có độ tin cậy dưới 75% cần bạn xác nhận, chỉnh chủ đề hoặc giữ chưa ánh xạ.</div>}
    <div className="mt-6 space-y-3">{analysis.data?.requirements.map((item) => <RequirementCard key={item.id} item={item} analysisVersion={analysis.data.analysisVersion} topics={taxonomy.data?.topics ?? []} selectedTopic={overrides[item.id] ?? item.effective_topic_id ?? ""} onTopicChange={(topicId) => setOverrides((current) => ({ ...current, [item.id]: topicId }))} onDecision={(input) => decision.mutate(input)} pending={decision.isPending && decision.variables?.requirementId === item.id} />)}</div>
    {decision.error && <div className="mt-4"><ErrorPanel error={decision.error} /></div>}
    {match.error && <div className="mt-5"><ErrorPanel error={match.error} /></div>}<button disabled={!analysis.data || match.isPending || pendingHumanReview > 0} onClick={() => match.mutate()} className="mt-6 w-full rounded-lg bg-primary px-5 py-3 text-sm font-medium text-on-primary disabled:opacity-50">{pendingHumanReview > 0 ? "Xác nhận các mục độ tin cậy thấp để tiếp tục" : "Tìm câu hỏi phù hợp"}</button>
  </main></div>;
}
