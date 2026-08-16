import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { jobDescriptionsApi, questionsApi } from "@/shared/api/resources";
import AuthNavbar from "@/shared/components/AuthNavbar";
import ErrorPanel from "@/shared/components/ErrorPanel";
import JDFlowStepper from "@/shared/components/JDFlowStepper";

export default function JDMapping() {
  const { jobDescriptionId = "" } = useParams();
  const navigate = useNavigate();
  const analysis = useQuery({ queryKey: ["jd-analysis", jobDescriptionId], queryFn: () => jobDescriptionsApi.getAnalysis(jobDescriptionId), enabled: Boolean(jobDescriptionId) });
  const taxonomy = useQuery({ queryKey: ["taxonomy"], queryFn: questionsApi.taxonomy });
  const [overrides, setOverrides] = useState<Record<string, string>>( {} );
  const normalize = useMutation({ mutationFn: () => jobDescriptionsApi.normalizations(jobDescriptionId, {
    analysisVersion: analysis.data!.analysisVersion,
    mappingInputVersion: 1,
    items: Object.entries(overrides).map(([requirementId, topicId]) => ({ requirementId, topicId: topicId || null, reason: "Student confirmed manual normalization" })),
  }), onSuccess: async () => { setOverrides({}); await analysis.refetch(); } });
  const match = useMutation({ mutationFn: () => jobDescriptionsApi.match(jobDescriptionId, analysis.data!.analysisVersion), onSuccess: () => navigate(`/job-descriptions/${jobDescriptionId}/recommendations?analysisVersion=${analysis.data!.analysisVersion}`) });
  return <div className="min-h-screen bg-canvas"><AuthNavbar /><main className="mx-auto max-w-[980px] px-6 py-8"><JDFlowStepper currentStep={3} /><h1 className="mt-8 text-[22px] font-semibold text-ink">Yêu cầu được nhận diện</h1><p className="mt-1 text-sm text-ink-secondary">Giữ nguyên evidence kể cả khi chưa ánh xạ. Hệ thống không tự hạ threshold.</p>{analysis.isLoading && <p className="mt-8 text-sm text-ink-muted">Đang tải kết quả phân tích…</p>}{analysis.error && <div className="mt-5"><ErrorPanel error={analysis.error} onRetry={() => analysis.refetch()} /></div>}
    <div className="mt-6 space-y-3">{analysis.data?.requirements.map((item) => <article key={item.id} className="rounded-xl border border-edge bg-panel p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">{item.requirement_type}</p><p className="mt-1 text-sm font-medium text-ink">{item.raw_text}</p></div><span className={item.topic_name ? "rounded-full bg-ok-soft px-3 py-1 text-xs font-medium text-ok" : "rounded-full bg-notice-soft px-3 py-1 text-xs font-medium text-notice-ink"}>{item.topic_name ?? "Chưa ánh xạ"}</span></div>{!item.topic_name && <label className="mt-3 block text-xs text-ink-muted">Ánh xạ thủ công<select value={overrides[item.id] ?? ""} onChange={(event) => setOverrides((current) => ({ ...current, [item.id]: event.target.value }))} className="mt-1.5 w-full rounded-md border border-edge bg-canvas px-3 py-2 text-sm text-ink"><option value="">Giữ chưa ánh xạ</option>{taxonomy.data?.topics.map((topic) => <option key={topic.id} value={topic.id}>{topic.name}</option>)}</select></label>}</article>)}</div>
    {Object.keys(overrides).length > 0 && <button disabled={normalize.isPending} onClick={() => normalize.mutate()} className="mt-4 rounded-lg border border-edge bg-panel px-4 py-2 text-xs font-medium text-ink-secondary">Lưu ánh xạ thủ công</button>}
    {normalize.error && <div className="mt-4"><ErrorPanel error={normalize.error} /></div>}
    {match.error && <div className="mt-5"><ErrorPanel error={match.error} onRetry={() => match.mutate()} /></div>}<button disabled={!analysis.data || match.isPending} onClick={() => match.mutate()} className="mt-6 w-full rounded-lg bg-primary px-5 py-3 text-sm font-medium text-on-primary disabled:opacity-50">Tìm câu hỏi phù hợp</button>
  </main></div>;
}
