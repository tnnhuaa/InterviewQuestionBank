import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { jobDescriptionsApi, preparationPlansApi } from "@/shared/api/resources";
import AuthNavbar from "@/shared/components/AuthNavbar";
import ErrorPanel from "@/shared/components/ErrorPanel";
import JDFlowStepper from "@/shared/components/JDFlowStepper";

function MatchSelection({ jobDescriptionId, analysisVersion }: { jobDescriptionId: string; analysisVersion?: number }) {
  const navigate = useNavigate();
  const matches = useQuery({ queryKey: ["jd-matches", jobDescriptionId, analysisVersion], queryFn: () => jobDescriptionsApi.getMatches(jobDescriptionId, analysisVersion) });
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const createPlan = useMutation({ mutationFn: () => preparationPlansApi.create({ jobDescriptionId, matchingVersion: matches.data!.matchingVersion, matchIds: [...selected] }), onSuccess: (plan) => navigate(`/preparation-plans/${plan.id}`, { replace: true }) });
  if (matches.error) return <ErrorPanel error={matches.error} onRetry={() => matches.refetch()} />;
  if (matches.isLoading) return <p className="text-sm text-ink-muted">Đang tải kết quả deterministic…</p>;
  if (!matches.data?.matches.length) return <div className="rounded-xl border border-edge bg-panel p-8 text-center"><p className="text-sm font-semibold text-ink">Chưa có câu hỏi vượt threshold 60</p><p className="mt-1 text-xs text-ink-muted">Evidence vẫn được giữ. Bạn có thể tìm Question Bank thủ công.</p><Link to="/questions?from=jd" className="mt-4 inline-block text-sm font-medium text-primary">Mở Question Bank</Link></div>;
  return <>{createPlan.error && <div className="mb-4"><ErrorPanel error={createPlan.error} /></div>}<div className="space-y-3">{matches.data.matches.map((match) => <label key={match.id} className="flex cursor-pointer gap-4 rounded-xl border border-edge bg-panel p-5"><input type="checkbox" checked={selected.has(match.id)} onChange={(event) => setSelected((current) => { const next = new Set(current); if (event.target.checked) next.add(match.id); else next.delete(match.id); return next; })} className="mt-1 accent-primary" /><span className="min-w-0 flex-1"><span className="text-sm font-semibold text-ink">{match.question.title}</span><span className="mt-1 block text-xs text-ink-muted">{match.topic || match.requirement} · điểm {match.score}</span><span className="mt-2 block text-xs leading-5 text-ink-secondary">{match.reason}</span></span></label>)}</div><button disabled={!selected.size || createPlan.isPending} onClick={() => createPlan.mutate()} className="mt-6 w-full rounded-lg bg-primary px-5 py-3 text-sm font-medium text-on-primary disabled:opacity-50">Tạo kế hoạch từ {selected.size} câu đã chọn</button></>;
}

export default function JDRecommendations() {
  const { jobDescriptionId, planId } = useParams();
  const [params] = useSearchParams();
  const plan = useQuery({ queryKey: ["plan", planId], queryFn: () => preparationPlansApi.get(planId!), enabled: Boolean(planId) });
  return <div className="min-h-screen bg-canvas"><AuthNavbar /><main className="mx-auto max-w-[980px] px-6 py-8"><JDFlowStepper currentStep={4} /><h1 className="mt-8 text-[22px] font-semibold text-ink">Kế hoạch luyện tập</h1><p className="mt-1 text-sm text-ink-secondary">Kết quả có matching version và lý do để có thể tái hiện.</p><div className="mt-6">{jobDescriptionId ? <MatchSelection jobDescriptionId={jobDescriptionId} analysisVersion={Number(params.get("analysisVersion")) || undefined} /> : plan.error ? <ErrorPanel error={plan.error} onRetry={() => plan.refetch()} /> : plan.isLoading ? <p className="text-sm text-ink-muted">Đang tải kế hoạch…</p> : <div className="space-y-3">{plan.data?.items.map((item) => <article key={item.id} className="rounded-xl border border-edge bg-panel p-5"><span className="rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-semibold text-primary">{item.priority}</span><h2 className="mt-3 text-sm font-semibold text-ink">{item.question?.title ?? item.mentorNextAction}</h2><p className="mt-1 text-xs text-ink-muted">{item.topic} · {item.practiceStatus}</p>{item.question?.id && <Link to={`/questions/${item.question.id}`} className="mt-3 inline-block text-xs font-medium text-primary">Mở câu hỏi →</Link>}</article>)}</div>}</div></main></div>;
}
