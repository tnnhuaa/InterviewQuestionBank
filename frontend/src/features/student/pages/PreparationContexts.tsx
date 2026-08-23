import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PencilSimple } from "@phosphor-icons/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { routes } from "@/app/routePaths";
import {
  jobDescriptionsApi,
  preparationPlansApi,
  type JobDescription,
  type PreparationPlanSummary,
} from "@/shared/api/resources";
import AuthNavbar from "@/shared/components/AuthNavbar";
import ErrorPanel from "@/shared/components/ErrorPanel";

const jdStatus: Record<JobDescription["status"], string> = {
  DRAFT: "Bản nháp",
  EXTRACTING: "Đang trích xuất",
  READY_FOR_REVIEW: "Chờ kiểm tra",
  CONFIRMED: "Đã xác nhận",
  ANALYZED: "Đã phân tích",
  FAILED: "Xử lý thất bại",
  ARCHIVED: "Đã lưu trữ",
};

const planStatus: Record<PreparationPlanSummary["status"], string> = {
  ACTIVE: "Đang sử dụng",
  COMPLETED: "Đã hoàn thành",
  INVALIDATED: "Cần tạo lại",
  ARCHIVED: "Đã lưu trữ",
};

function EditableTitle({
  value,
  onSave,
  saving,
}: {
  value: string;
  onSave: (title: string) => void;
  saving: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(value);
  if (!editing) {
    return <div className="flex flex-wrap items-center gap-2"><h2 className="text-sm font-semibold text-ink">{value}</h2><button type="button" aria-label="Đổi tên" title="Đổi tên" onClick={() => { setTitle(value); setEditing(true); }} className="rounded-md p-1.5 text-ink-muted transition-colors hover:bg-primary-soft hover:text-primary"><PencilSimple aria-hidden size={16} /></button></div>;
  }
  return <div className="flex min-w-0 flex-1 flex-wrap gap-2"><input autoFocus value={title} maxLength={120} onChange={(event) => setTitle(event.target.value)} className="min-w-56 flex-1 rounded-md border border-edge bg-canvas px-3 py-2 text-sm" /><button type="button" disabled={saving || !title.trim()} onClick={() => onSave(title.trim())} className="rounded-md bg-primary px-3 py-2 text-xs font-semibold text-on-primary disabled:opacity-50">Lưu</button><button type="button" disabled={saving} onClick={() => setEditing(false)} className="rounded-md border border-edge px-3 py-2 text-xs text-ink-secondary">Hủy</button></div>;
}

function JobDescriptionCard({ jd }: { jd: JobDescription }) {
  const queryClient = useQueryClient();
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const rename = useMutation({
    mutationFn: (title: string) => jobDescriptionsApi.update(jd.id, { title, version: jd.version }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["job-descriptions"] }),
  });
  const archive = useMutation({
    mutationFn: () => jobDescriptionsApi.archive(jd.id, jd.version),
    onSuccess: () => {
      setConfirmingDelete(false);
      void queryClient.invalidateQueries({ queryKey: ["job-descriptions"] });
      void queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
  });
  const reviewRoute = routes.jobDescriptionReview(jd.id);
  return <article className="rounded-xl border border-edge bg-panel p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div className="min-w-0 flex-1"><EditableTitle value={jd.title} saving={rename.isPending} onSave={(title) => rename.mutate(title)} /><p className="mt-1 text-xs text-ink-muted">{jdStatus[jd.status]} · cập nhật {new Date(jd.updatedAt).toLocaleString("vi-VN")}</p></div><span className="rounded-full bg-canvas-subtle px-2.5 py-1 text-[11px] font-semibold text-ink-secondary">{jd.sourceType === "PASTED_TEXT" ? "Văn bản" : jd.sourceType}</span></div>{rename.error ? <div className="mt-3"><ErrorPanel error={rename.error} /></div> : null}<div className="mt-4 flex flex-wrap gap-2"><Link to={reviewRoute} className="rounded-md border border-edge px-3 py-2 text-xs font-semibold text-ink-secondary">Xem và chỉnh sửa nội dung</Link>{["CONFIRMED", "ANALYZED"].includes(jd.status) ? <Link to={routes.jobDescriptionMapping(jd.id)} className="rounded-md border border-edge px-3 py-2 text-xs font-semibold text-ink-secondary">Mở yêu cầu đã nhận diện</Link> : null}{jd.status !== "ARCHIVED" && !confirmingDelete ? <button type="button" onClick={() => setConfirmingDelete(true)} className="rounded-md px-3 py-2 text-xs font-semibold text-danger">Xóa khỏi danh sách</button> : null}</div>{confirmingDelete ? <div className="mt-4 rounded-lg border border-danger/20 bg-danger-soft p-4 text-xs text-ink-secondary"><p className="font-semibold text-danger">Lưu trữ JD này?</p><p className="mt-1">Các kế hoạch đang hoạt động từ JD cũng sẽ được lưu trữ. Booking, audit và dữ liệu lịch sử vẫn được giữ an toàn.</p><div className="mt-3 flex gap-2"><button type="button" disabled={archive.isPending} onClick={() => archive.mutate()} className="rounded-md bg-danger px-3 py-2 font-semibold text-on-primary disabled:opacity-50">Xác nhận xóa</button><button type="button" disabled={archive.isPending} onClick={() => setConfirmingDelete(false)} className="rounded-md border border-edge bg-panel px-3 py-2">Giữ lại</button></div></div> : null}{archive.error ? <div className="mt-3"><ErrorPanel error={archive.error} /></div> : null}</article>;
}

function PlanCard({ plan }: { plan: PreparationPlanSummary }) {
  const queryClient = useQueryClient();
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const rename = useMutation({
    mutationFn: (title: string) => preparationPlansApi.update(plan.id, { title, version: plan.version }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["plans"] }),
  });
  const archive = useMutation({
    mutationFn: () => preparationPlansApi.archive(plan.id, plan.version),
    onSuccess: () => {
      setConfirmingDelete(false);
      void queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
  });
  return <article className="rounded-xl border border-edge bg-panel p-5"><EditableTitle value={plan.title} saving={rename.isPending} onSave={(title) => rename.mutate(title)} /><p className="mt-1 text-xs text-ink-muted">{planStatus[plan.status]} · từ {plan.jobDescriptionTitle} · cập nhật {new Date(plan.updatedAt).toLocaleString("vi-VN")}</p><div className="mt-3 flex flex-wrap gap-1.5">{plan.topics.length ? plan.topics.map((topic) => <span key={topic} className="rounded-full bg-primary-soft px-2.5 py-1 text-[11px] text-primary">{topic}</span>) : <span className="text-xs text-notice-ink">Chưa có chủ đề hợp lệ</span>}</div>{rename.error ? <div className="mt-3"><ErrorPanel error={rename.error} /></div> : null}<div className="mt-4 flex flex-wrap gap-2"><Link to={routes.preparationPlan(plan.id)} className="rounded-md border border-edge px-3 py-2 text-xs font-semibold text-ink-secondary">Xem và chỉnh sửa kế hoạch</Link>{plan.status !== "ARCHIVED" && !confirmingDelete ? <button type="button" onClick={() => setConfirmingDelete(true)} className="rounded-md px-3 py-2 text-xs font-semibold text-danger">Xóa khỏi danh sách</button> : null}</div>{confirmingDelete ? <div className="mt-4 rounded-lg border border-danger/20 bg-danger-soft p-4 text-xs text-ink-secondary"><p className="font-semibold text-danger">Lưu trữ kế hoạch này?</p><p className="mt-1">Kế hoạch sẽ không còn xuất hiện khi đặt lịch. Booking và lịch sử luyện tập cũ vẫn được giữ.</p><div className="mt-3 flex gap-2"><button type="button" disabled={archive.isPending} onClick={() => archive.mutate()} className="rounded-md bg-danger px-3 py-2 font-semibold text-on-primary disabled:opacity-50">Xác nhận xóa</button><button type="button" disabled={archive.isPending} onClick={() => setConfirmingDelete(false)} className="rounded-md border border-edge bg-panel px-3 py-2">Giữ lại</button></div></div> : null}{archive.error ? <div className="mt-3"><ErrorPanel error={archive.error} /></div> : null}</article>;
}

export default function PreparationContexts() {
  const [showArchived, setShowArchived] = useState(false);
  const jobDescriptions = useQuery({ queryKey: ["job-descriptions"], queryFn: jobDescriptionsApi.list });
  const plans = useQuery({ queryKey: ["plans"], queryFn: preparationPlansApi.list });
  const visibleJds = jobDescriptions.data?.items.filter((jd) => showArchived || jd.status !== "ARCHIVED") ?? [];
  const visiblePlans = plans.data?.items.filter((plan) => showArchived || plan.status !== "ARCHIVED") ?? [];
  return <div className="min-h-screen bg-canvas"><AuthNavbar /><main className="mx-auto max-w-[1050px] px-6 py-8"><div className="flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-[22px] font-semibold text-ink">JD và kế hoạch của tôi</h1><p className="mt-1 text-sm text-ink-secondary">Quản lý nội dung mà bạn dùng để tìm câu hỏi, tìm Mentor và đặt lịch phỏng vấn.</p></div><Link to={routes.jobDescriptionNew} className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary">Phân tích JD mới</Link></div><label className="mt-5 inline-flex items-center gap-2 text-xs text-ink-secondary"><input type="checkbox" checked={showArchived} onChange={(event) => setShowArchived(event.target.checked)} className="accent-primary" />Hiển thị mục đã lưu trữ</label>{jobDescriptions.error || plans.error ? <div className="mt-5"><ErrorPanel error={jobDescriptions.error || plans.error} onRetry={() => { void jobDescriptions.refetch(); void plans.refetch(); }} /></div> : null}<div className="mt-8 grid gap-8 lg:grid-cols-2"><section><div className="mb-3 flex items-center justify-between"><h2 className="text-base font-semibold text-ink">Mô tả công việc (JD)</h2><span className="text-xs text-ink-muted">{visibleJds.length} mục</span></div><div className="space-y-3">{visibleJds.map((jd) => <JobDescriptionCard key={`${jd.id}:${jd.version}`} jd={jd} />)}{!jobDescriptions.isLoading && visibleJds.length === 0 ? <p className="rounded-xl border border-dashed border-edge p-8 text-center text-sm text-ink-muted">Bạn chưa có JD nào trong danh sách.</p> : null}</div></section><section><div className="mb-3 flex items-center justify-between"><h2 className="text-base font-semibold text-ink">Kế hoạch luyện tập</h2><span className="text-xs text-ink-muted">{visiblePlans.length} mục</span></div><div className="space-y-3">{visiblePlans.map((plan) => <PlanCard key={`${plan.id}:${plan.version}`} plan={plan} />)}{!plans.isLoading && visiblePlans.length === 0 ? <p className="rounded-xl border border-dashed border-edge p-8 text-center text-sm text-ink-muted">Chưa có kế hoạch. Hãy phân tích JD và chọn câu hỏi phù hợp.</p> : null}</div></section></div></main></div>;
}
