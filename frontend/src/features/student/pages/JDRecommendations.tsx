import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { jobDescriptionsApi, preparationPlansApi, type PreparationPlan, type PracticeStatus } from "@/shared/api/resources";
import AuthNavbar from "@/shared/components/AuthNavbar";
import ErrorPanel from "@/shared/components/ErrorPanel";
import JDFlowStepper from "@/shared/components/JDFlowStepper";

function MatchSelection({ jobDescriptionId, analysisVersion }: { jobDescriptionId: string; analysisVersion?: number }) {
  const navigate = useNavigate();
  const matches = useQuery({ queryKey: ["jd-matches", jobDescriptionId, analysisVersion], queryFn: () => jobDescriptionsApi.getMatches(jobDescriptionId, analysisVersion) });
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const createPlan = useMutation({ mutationFn: () => preparationPlansApi.create({ jobDescriptionId, matchingVersion: matches.data!.matchingVersion, matchIds: [...selected] }), onSuccess: (plan) => navigate(`/preparation-plans/${plan.id}`, { replace: true }) });
  if (matches.error) return <ErrorPanel error={matches.error} onRetry={() => matches.refetch()} />;
  if (matches.isLoading) return <p className="text-sm text-ink-muted">Đang tải kết quả deterministic…</p>;
  if (!matches.data?.matches.length) return <div className="rounded-xl border border-edge bg-panel p-8 text-center"><p className="text-sm font-semibold text-ink">Chưa có câu hỏi vượt threshold 60</p><p className="mt-1 text-xs text-ink-muted">Evidence vẫn được giữ. Bạn có thể tìm Question Bank thủ công.</p><Link to="/questions?from=jd" className="mt-4 inline-block text-sm font-medium text-primary">Mở Question Bank</Link></div>;
  return <>{createPlan.error && <div className="mb-4"><ErrorPanel error={createPlan.error} /></div>}<div className="space-y-3">{matches.data.matches.map((match) => <label key={match.id} className="flex cursor-pointer gap-4 rounded-xl border border-edge bg-panel p-5"><input type="checkbox" checked={selected.has(match.id)} onChange={(event) => setSelected((current) => { const next = new Set(current); if (event.target.checked) next.add(match.id); else next.delete(match.id); return next; })} className="mt-1 accent-primary" /><span className="min-w-0 flex-1"><span className="text-sm font-semibold text-ink">{match.question.title}</span><span className="mt-1 block text-xs text-ink-muted">{match.topic || match.requirement} · điểm {match.score}</span><span className="mt-2 block text-xs leading-5 text-ink-secondary">{match.reason}</span></span></label>)}</div><button disabled={!selected.size || createPlan.isPending} onClick={() => createPlan.mutate()} className="mt-6 w-full rounded-lg bg-primary px-5 py-3 text-sm font-medium text-on-primary disabled:opacity-50">Tạo kế hoạch từ {selected.size} câu đã chọn</button></>;
}

function PlanItem({ plan, item }: { plan: PreparationPlan; item: PreparationPlan["items"][number] }) {
  const queryClient = useQueryClient();
  const update = useMutation({
    mutationFn: (practiceStatus: PracticeStatus) => preparationPlansApi.updateItem(plan.id, item.id, { practiceStatus, version: item.version }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plan", plan.id] });
      queryClient.invalidateQueries({ queryKey: ["student-dashboard"] });
    },
  });
  return <article className="rounded-xl border border-edge bg-panel p-5"><div className="flex flex-wrap items-center justify-between gap-3"><span className="rounded-full bg-primary-soft px-2.5 py-1 text-[11px] font-semibold text-primary">{item.priority}</span><select aria-label="Trạng thái luyện tập" value={item.practiceStatus} disabled={update.isPending || plan.status !== "ACTIVE"} onChange={(event) => update.mutate(event.target.value as PracticeStatus)} className="rounded-md border border-edge bg-canvas px-2 py-1.5 text-xs"><option value="NOT_STARTED">Chưa bắt đầu</option><option value="PRACTICING">Đang luyện</option><option value="COMPLETED">Hoàn thành</option><option value="REVISIT">Cần ôn lại</option></select></div><h2 className="mt-3 text-sm font-semibold text-ink">{item.question?.title ?? item.mentorNextAction}</h2><p className="mt-1 text-xs text-ink-muted">{item.topic ?? "Next action từ Mentor"} · v{item.version}</p>{item.question?.id ? <Link to={`/questions/${item.question.id}`} className="mt-3 inline-block text-xs font-medium text-primary">Mở câu hỏi →</Link> : null}{update.error && <div className="mt-3"><ErrorPanel error={update.error} /></div>}</article>;
}

function PlanView({ planId }: { planId: string }) {
  const plan = useQuery({ queryKey: ["plan", planId], queryFn: () => preparationPlansApi.get(planId) });
  const candidates = useQuery({ queryKey: ["plan-mentor-candidates", planId], queryFn: () => preparationPlansApi.mentorCandidates(planId), enabled: plan.data?.status === "ACTIVE" });
  if (plan.error) return <ErrorPanel error={plan.error} onRetry={() => plan.refetch()} />;
  if (plan.isLoading) return <p className="text-sm text-ink-muted">Đang tải kế hoạch…</p>;
  if (!plan.data) return null;
  return <div className="space-y-8">{plan.data.status !== "ACTIVE" && <div className="rounded-xl border border-notice/30 bg-notice-soft p-5 text-sm text-notice-ink">Kế hoạch này đã {plan.data.status.toLowerCase()}. Hãy xác nhận lại JD và tạo plan mới trước khi đặt lịch.</div>}<section><h2 className="mb-3 text-sm font-semibold text-ink">Câu hỏi và next actions</h2><div className="space-y-3">{plan.data.items.map((item) => <PlanItem key={`${item.id}:${item.version}`} plan={plan.data} item={item} />)}</div></section><section><div className="mb-3"><h2 className="text-sm font-semibold text-ink">Mentor phù hợp với kế hoạch</h2><p className="mt-1 text-xs text-ink-muted">Backend kiểm tra lại expertise được duyệt và future slot; thứ tự kết quả deterministic.</p></div>{candidates.error ? <ErrorPanel error={candidates.error} onRetry={() => candidates.refetch()} /> : candidates.isLoading ? <p className="text-sm text-ink-muted">Đang tìm Mentor theo topic…</p> : candidates.data?.items.length ? <div className="grid gap-4 md:grid-cols-2">{candidates.data.items.map((mentor) => <article key={mentor.id} className="rounded-xl border border-edge bg-panel p-5"><h3 className="text-sm font-semibold text-ink">{mentor.displayName}</h3><p className="mt-1 text-xs text-ink-muted">{mentor.headline}</p><ul className="mt-3 space-y-1">{mentor.matchReasons?.map((reason) => <li key={reason} className="text-xs text-ink-secondary">• {reason}</li>)}</ul><div className="mt-4 flex flex-wrap gap-2">{mentor.nextSlots.map((slot) => <Link key={slot.id} to={`/bookings/new?mentorId=${mentor.id}&slotId=${slot.id}&planId=${planId}`} className="rounded-md border border-primary/30 px-3 py-2 text-xs font-medium text-primary">{new Date(slot.startsAt).toLocaleString("vi-VN")}</Link>)}</div></article>)}</div> : <div className="rounded-xl border border-dashed border-edge p-8 text-center"><p className="text-sm text-ink">Chưa có Mentor phù hợp trong khoảng hiện tại.</p><div className="mt-3 flex justify-center gap-4"><Link to="/mentors" className="text-xs font-medium text-primary">Tìm Mentor thủ công</Link><Link to="/questions" className="text-xs text-ink-secondary">Tiếp tục tự luyện</Link></div></div>}</section></div>;
}

export default function JDRecommendations() {
  const { jobDescriptionId, planId } = useParams();
  const [params] = useSearchParams();
  return <div className="min-h-screen bg-canvas"><AuthNavbar /><main className="mx-auto max-w-[980px] px-6 py-8"><JDFlowStepper currentStep={4} /><h1 className="mt-8 text-[22px] font-semibold text-ink">Kế hoạch luyện tập</h1><p className="mt-1 text-sm text-ink-secondary">Question và Mentor cùng được dẫn từ một plan có version; không dùng AI score.</p><div className="mt-6">{jobDescriptionId ? <MatchSelection jobDescriptionId={jobDescriptionId} analysisVersion={Number(params.get("analysisVersion")) || undefined} /> : planId ? <PlanView planId={planId} /> : <ErrorPanel error={new Error("Thiếu JD hoặc preparation plan ID")} />}</div></main></div>;
}
