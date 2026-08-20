import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { routes } from "@/app/routePaths";
import { aiApi, jobDescriptionsApi, preparationPlansApi, type PreparationPlan, type PracticeStatus, type PlanMentorCandidateFilters } from "@/shared/api/resources";
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
  if (!matches.data?.matches.length) return <div className="rounded-xl border border-edge bg-panel p-8 text-center"><p className="text-sm font-semibold text-ink">Chưa có câu hỏi đạt ngưỡng phù hợp 60 điểm</p><p className="mt-1 text-xs text-ink-muted">Các đoạn trích và yêu cầu đã nhận diện vẫn được giữ lại. Bạn có thể tìm câu hỏi thủ công.</p><Link to="/questions?from=jd" className="mt-4 inline-block text-sm font-medium text-primary">Mở ngân hàng câu hỏi</Link></div>;
  return <>{createPlan.error && <div className="mb-4"><ErrorPanel error={createPlan.error} /></div>}<div className="space-y-3">{matches.data.matches.map((match) => <label key={match.id} className="flex cursor-pointer gap-4 rounded-xl border border-edge bg-panel p-5"><input type="checkbox" checked={selected.has(match.id)} onChange={(event) => setSelected((current) => { const next = new Set(current); if (event.target.checked) next.add(match.id); else next.delete(match.id); return next; })} className="mt-1 accent-primary" /><span className="min-w-0 flex-1"><span className="text-sm font-semibold text-ink">{match.question.title}</span><span className="mt-1 block text-xs text-ink-muted">{match.topic || match.requirement} · điểm {match.score}</span><span className="mt-2 block text-xs leading-5 text-ink-secondary">{match.reason}</span></span></label>)}</div><button disabled={!selected.size || createPlan.isPending} onClick={() => createPlan.mutate()} className="mt-6 w-full rounded-lg bg-primary px-5 py-3 text-sm font-medium text-on-primary disabled:opacity-50">Tạo kế hoạch từ {selected.size} câu đã chọn</button></>;
}

function PlanItem({ plan, item }: { plan: PreparationPlan; item: PreparationPlan["items"][number] }) {
  const queryClient = useQueryClient();
  const update = useMutation({
    mutationFn: (change: { practiceStatus?: PracticeStatus; priority?: "MUST" | "SHOULD" | "OPTIONAL" }) => preparationPlansApi.updateItem(plan.id, item.id, { ...change, version: item.version }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plan", plan.id] });
      queryClient.invalidateQueries({ queryKey: ["student-dashboard"] });
    },
  });
  return <article className="rounded-xl border border-edge bg-panel p-5"><div className="flex flex-wrap items-center justify-between gap-3"><select aria-label="Mức ưu tiên" value={item.priority} disabled={update.isPending || plan.status !== "ACTIVE"} onChange={(event) => update.mutate({ priority: event.target.value as "MUST" | "SHOULD" | "OPTIONAL" })} className="rounded-md border border-edge bg-primary-soft px-2 py-1.5 text-xs font-semibold text-primary"><option value="MUST">Cần luyện</option><option value="SHOULD">Nên luyện</option><option value="OPTIONAL">Tùy chọn</option></select><select aria-label="Trạng thái luyện tập" value={item.practiceStatus} disabled={update.isPending || plan.status !== "ACTIVE"} onChange={(event) => update.mutate({ practiceStatus: event.target.value as PracticeStatus })} className="rounded-md border border-edge bg-canvas px-2 py-1.5 text-xs"><option value="NOT_STARTED">Chưa bắt đầu</option><option value="PRACTICING">Đang luyện</option><option value="COMPLETED">Hoàn thành</option><option value="REVISIT">Cần ôn lại</option></select></div><h2 className="mt-3 text-sm font-semibold text-ink">{item.question?.title ?? item.mentorNextAction}</h2><p className="mt-1 text-xs text-ink-muted">{item.topic ?? "Hành động tiếp theo từ Mentor"} · v{item.version}</p>{item.reason && <div className="mt-3 rounded-md bg-canvas-subtle p-3"><p className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">Điểm phù hợp do quy tắc hệ thống</p><p className="mt-1 text-xs leading-5 text-ink-secondary">{item.reason}</p></div>}{item.aiExplanation && <div className="mt-2 rounded-md border border-primary/15 bg-primary-soft p-3"><p className="text-[11px] font-semibold uppercase tracking-wide text-primary">Giải thích được Gemini hỗ trợ</p><p className="mt-1 text-xs leading-5 text-ink-secondary">{item.aiExplanation}</p></div>}{item.question?.id ? <Link to={`/questions/${item.question.id}`} className="mt-3 inline-block text-xs font-medium text-primary">Mở câu hỏi →</Link> : null}{update.error && <div className="mt-3"><ErrorPanel error={update.error} /></div>}</article>;
}

function PlanView({ planId }: { planId: string }) {
  const queryClient = useQueryClient();
  const [aiJobId, setAiJobId] = useState("");
  const [availFrom, setAvailFrom] = useState("");
  const [availTo, setAvailTo] = useState("");

  const plan = useQuery({ queryKey: ["plan", planId], queryFn: () => preparationPlansApi.get(planId) });

  const candidateFilters: PlanMentorCandidateFilters = {
    availableFrom: availFrom ? new Date(availFrom).toISOString() : undefined,
    availableTo: availTo ? new Date(availTo).toISOString() : undefined,
  };

  const candidates = useQuery({
    queryKey: ["plan-mentor-candidates", planId, candidateFilters.availableFrom, candidateFilters.availableTo],
    queryFn: () => preparationPlansApi.mentorCandidates(planId, candidateFilters),
    enabled: plan.data?.status === "ACTIVE",
  });

  const capabilities = useQuery({ queryKey: ["ai-capabilities"], queryFn: aiApi.capabilities });
  const startExplanations = useMutation({ mutationFn: () => preparationPlansApi.startRecommendationExplanations(planId), onSuccess: (job) => setAiJobId(job.id) });
  const explanationJob = useQuery({ queryKey: ["ai-job", aiJobId], queryFn: () => aiApi.getJob(aiJobId), enabled: Boolean(aiJobId), refetchInterval: (query) => ["PENDING", "PROCESSING"].includes(query.state.data?.status ?? "") ? 1500 : false });
  useEffect(() => {
    if (!["SUCCEEDED", "SUCCEEDED_WITH_FALLBACK"].includes(explanationJob.data?.status ?? "")) return;
    void queryClient.invalidateQueries({ queryKey: ["plan", planId] });
    void queryClient.invalidateQueries({ queryKey: ["plan-mentor-candidates", planId] });
  }, [explanationJob.data?.status, planId, queryClient]);

  if (plan.error) return <ErrorPanel error={plan.error} onRetry={() => plan.refetch()} />;
  if (plan.isLoading) return <p className="text-sm text-ink-muted">Đang tải kế hoạch…</p>;
  if (!plan.data) return null;
  const explanationEnabled = capabilities.data?.enabled && capabilities.data.features.recommendationExplanation;
  const explanationRunning = ["PENDING", "PROCESSING"].includes(explanationJob.data?.status ?? "");
  const searchCtx = candidates.data?.searchContext;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-lg font-semibold text-ink">{plan.data.title}</h2><p className="mt-1 text-xs text-ink-muted">Cập nhật {new Date(plan.data.updatedAt).toLocaleString("vi-VN")} · phiên bản {plan.data.version}</p></div><Link to={routes.studentPreparationContexts} className="rounded-md border border-edge px-3 py-2 text-xs font-semibold text-ink-secondary">Quản lý kế hoạch</Link></div>
      {plan.data.status !== "ACTIVE" && <div className="rounded-xl border border-notice/30 bg-notice-soft p-5 text-sm text-notice-ink">Kế hoạch này đã {plan.data.status.toLowerCase()}. Hãy xác nhận lại JD và tạo plan mới trước khi đặt lịch.</div>}
      {plan.data.status === "ACTIVE" && <section className="rounded-xl border border-edge bg-canvas-subtle p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-sm font-semibold text-ink">Giải thích gợi ý bằng Gemini</h2><p className="mt-1 text-xs text-ink-muted">AI chỉ diễn giải candidate đã qua bộ lọc; không đổi điểm, thứ tự hoặc điều kiện đặt lịch.</p></div><button disabled={!explanationEnabled || startExplanations.isPending || explanationRunning} onClick={() => startExplanations.mutate()} className="rounded-md bg-primary px-4 py-2 text-xs font-medium text-on-primary disabled:opacity-50">{explanationRunning ? "Đang tạo giải thích…" : "Tạo giải thích AI"}</button></div>{capabilities.data && !explanationEnabled && <p className="mt-3 text-xs text-ink-muted">Tính năng đang tắt; các lý do deterministic bên dưới vẫn đầy đủ.</p>}{explanationJob.data?.status === "SUCCEEDED_WITH_FALLBACK" && <p className="mt-3 text-xs text-notice-ink">Gemini không khả dụng. Hệ thống giữ nguyên lý do deterministic để bạn tiếp tục.</p>}{startExplanations.error && <div className="mt-4"><ErrorPanel error={startExplanations.error} /></div>}{explanationJob.error && <div className="mt-4"><ErrorPanel error={explanationJob.error} onRetry={() => explanationJob.refetch()} /></div>}</section>}

      <section>
        <h2 className="mb-3 text-sm font-semibold text-ink">Câu hỏi và next actions</h2>
        <div className="space-y-3">{plan.data.items.map((item) => <PlanItem key={`${item.id}:${item.version}`} plan={plan.data} item={item} />)}</div>
      </section>

      <section>
        <div className="mb-3">
          <h2 className="text-sm font-semibold text-ink">Mentor phù hợp với kế hoạch</h2>
          <p className="mt-1 text-xs text-ink-muted">Backend kiểm tra approved expertise trùng chủ đề kế hoạch và lịch trống tương lai.</p>
        </div>

        {plan.data.status === "ACTIVE" && (
          <div className="mb-4 flex flex-wrap items-end gap-4">
            <label className="text-xs font-semibold text-ink-secondary">
              Lịch rảnh từ
              <input
                type="datetime-local"
                value={availFrom}
                onChange={(e) => { setAvailFrom(e.target.value); }}
                className="mt-1 block rounded-lg border border-edge bg-panel px-3 py-2 text-sm font-normal"
              />
            </label>
            <label className="text-xs font-semibold text-ink-secondary">
              đến
              <input
                type="datetime-local"
                value={availTo}
                onChange={(e) => { setAvailTo(e.target.value); }}
                className="mt-1 block rounded-lg border border-edge bg-panel px-3 py-2 text-sm font-normal"
              />
            </label>
          </div>
        )}

        {candidates.error && <div className="mb-4"><ErrorPanel error={candidates.error} onRetry={() => candidates.refetch()} /></div>}
        {candidates.isLoading && <p className="text-sm text-ink-muted">Đang tải mentor phù hợp…</p>}

        {candidates.data && candidates.data.items.length === 0 && (
          <div className="rounded-xl border border-dashed border-edge p-8 text-center text-sm text-ink-muted">
            {searchCtx?.emptyReason === "NO_MATCHING_MENTOR" ? (
              <>
                <p className="font-semibold text-ink">Chưa có Mentor đã duyệt có expertise trùng với chủ đề trong kế hoạch này.</p>
                <p className="mt-2">Bạn có thể tiếp tục tự luyện, mở Question Bank, hoặc dùng tìm Mentor thủ công.</p>
                <Link to="/mentors" className="mt-3 inline-block text-xs font-medium text-primary">Tìm Mentor thủ công →</Link>
              </>
            ) : searchCtx?.emptyReason === "NO_AVAILABLE_SLOT" ? (
              <>
                <p className="font-semibold text-ink">Có Mentor phù hợp với chủ đề kế hoạch, nhưng chưa có lịch rảnh trong khoảng đã chọn.</p>
                <p className="mt-2">Hãy mở rộng khoảng thời gian.</p>
              </>
            ) : (
              <p>Chưa có mentor phù hợp.</p>
            )}
          </div>
        )}

        {candidates.data && candidates.data.items.length > 0 && (
          <div className="space-y-4">
            {candidates.data.items.map((mentor) => (
              <article key={mentor.id} className="rounded-xl border border-edge bg-panel p-5">
                <div className="flex items-start gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary-soft text-sm font-semibold text-primary">{mentor.displayName?.slice(0, 2).toUpperCase()}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-ink">{mentor.displayName}</h3>
                      <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-semibold text-primary">{mentor.topicOverlap} chủ đề khớp</span>
                    </div>
                    <p className="mt-0.5 text-sm text-ink-secondary">{mentor.headline}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">{mentor.matchReasons?.map((r, i) => <span key={i} className="rounded-full border border-edge bg-canvas-subtle px-2 py-0.5 text-xs text-ink-secondary">{r}</span>)}</div>
                    {mentor.aiExplanation && <div className="mt-2 rounded-md border border-primary/15 bg-primary-soft p-3"><p className="text-[11px] font-semibold uppercase tracking-wide text-primary">Giải thích AI</p><p className="mt-1 text-xs leading-5 text-ink-secondary">{mentor.aiExplanation}</p></div>}
                    {mentor.nextSlots?.length > 0 && (
                      <div className="mt-3 border-t border-edge pt-3">
                        <p className="text-xs font-semibold text-ink-secondary">Lịch trống:</p>
                        <div className="mt-1 flex flex-wrap gap-2">{mentor.nextSlots.map((slot) => <Link key={slot.id} to={`/bookings/new?mentorId=${mentor.id}&slotId=${slot.id}&planId=${planId}`} className="rounded-md border border-edge bg-canvas-subtle px-2.5 py-1.5 text-xs text-ink hover:border-primary">{new Date(slot.startsAt).toLocaleString("vi-VN")}</Link>)}</div>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default function JDRecommendations() {
  const { jobDescriptionId, planId } = useParams();
  const [params] = useSearchParams();
  return <div className="min-h-screen bg-canvas"><AuthNavbar /><main className="mx-auto max-w-[980px] px-6 py-8"><JDFlowStepper currentStep={4} /><h1 className="mt-8 text-[22px] font-semibold text-ink">Kế hoạch luyện tập</h1><p className="mt-1 text-sm text-ink-secondary">Question và Mentor cùng được dẫn từ một plan có version; không dùng AI score.</p><div className="mt-6">{jobDescriptionId ? <MatchSelection jobDescriptionId={jobDescriptionId} analysisVersion={Number(params.get("analysisVersion")) || undefined} /> : planId ? <PlanView planId={planId} /> : <ErrorPanel error={new Error("Thiếu JD hoặc preparation plan ID")} />}</div></main></div>;
}
