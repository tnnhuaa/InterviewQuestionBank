import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { bookingsApi } from "@/shared/api/resources";
import AuthNavbar from "@/shared/components/AuthNavbar";
import ErrorPanel from "@/shared/components/ErrorPanel";

export default function Feedback() {
  const { bookingId = "" } = useParams();
  const queryClient = useQueryClient();
  const feedback = useQuery({ queryKey: ["feedback", bookingId], queryFn: () => bookingsApi.feedback(bookingId) });
  const [selected, setSelected] = useState<string[]>([]);
  const apply = useMutation({
    mutationFn: () => bookingsApi.applyFeedback(bookingId, selected),
    onSuccess: () => {
      setSelected([]);
      queryClient.invalidateQueries({ queryKey: ["feedback", bookingId] });
      queryClient.invalidateQueries({ queryKey: ["student-dashboard"] });
    },
  });
  return <div className="min-h-screen bg-canvas"><AuthNavbar /><main className="mx-auto max-w-[850px] px-6 py-8"><h1 className="text-[22px] font-semibold text-ink">Feedback riêng tư</h1><p className="mt-1 text-sm text-ink-secondary">Chỉ participant của booking được xem. Bạn chủ động chọn action muốn thêm vào plan.</p>{feedback.error ? <div className="mt-5"><ErrorPanel error={feedback.error} /></div> : feedback.isLoading ? <p className="mt-6 text-sm text-ink-muted">Đang tải feedback…</p> : feedback.data ? <><section className="mt-6 rounded-xl border border-edge bg-panel p-6"><h2 className="text-sm font-semibold text-ink">Rubric cố định</h2><div className="mt-3 grid gap-3 sm:grid-cols-3">{Object.entries(feedback.data.rubricScores).map(([name, score]) => <div key={name} className="rounded-lg bg-canvas-subtle p-4"><p className="text-xs text-ink-muted">{name}</p><p className="mt-1 text-xl font-semibold text-ink">{score}/5</p></div>)}</div></section><div className="mt-5 grid gap-5 sm:grid-cols-2"><section className="rounded-xl border border-ok/20 bg-ok-soft p-5"><h2 className="text-xs font-semibold uppercase text-ok">Điểm mạnh</h2><p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-ink-secondary">{feedback.data.strengths}</p></section><section className="rounded-xl border border-notice/20 bg-notice-soft p-5"><h2 className="text-xs font-semibold uppercase text-notice-ink">Cần cải thiện</h2><p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-ink-secondary">{feedback.data.weaknesses}</p></section></div><section className="mt-5 rounded-xl border border-edge bg-panel p-6"><h2 className="text-sm font-semibold text-ink">Next actions</h2><p className="mt-1 text-xs text-ink-muted">Action có ID ổn định; action đã áp dụng sẽ không tạo plan item trùng.</p><div className="mt-4 space-y-2">{feedback.data.actions.map((action) => <label key={action.id} className="flex gap-3 rounded-lg bg-canvas-subtle p-3 text-sm text-ink-secondary"><input type="checkbox" disabled={action.applied} checked={action.applied || selected.includes(action.id)} onChange={(event) => setSelected((current) => event.target.checked ? [...current, action.id] : current.filter((item) => item !== action.id))} className="accent-primary" /><span>{action.description}{action.applied ? <span className="ml-2 text-xs font-medium text-ok">Đã áp dụng</span> : null}</span></label>)}</div>{apply.error && <div className="mt-4"><ErrorPanel error={apply.error} /></div>}{apply.isSuccess ? <p className="mt-4 rounded-lg bg-ok-soft p-3 text-sm text-ok">Đã cập nhật kế hoạch; action trùng được bỏ qua an toàn.</p> : <button disabled={!selected.length || apply.isPending} onClick={() => apply.mutate()} className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-on-primary disabled:opacity-50">Áp dụng đã chọn</button>}</section></> : null}</main></div>;
}
