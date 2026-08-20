import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { bookingsApi, mentorsApi, preparationPlansApi, jobDescriptionsApi, questionsApi, studentProfileApi } from "@/shared/api/resources";
import AuthNavbar from "@/shared/components/AuthNavbar";
import ErrorPanel from "@/shared/components/ErrorPanel";
import { prepareBookingRequest, type BookingRequestAttempt } from "@/features/student/booking-request";
import { createIdempotencyKey } from "@/shared/api/client";

const schema = z.object({
  context: z.string().min(1, "Chọn JD hoặc kế hoạch"),
  interviewType: z.string().min(2, "Chọn loại phỏng vấn"),
  goal: z.string().trim().min(10, "Mục tiêu cần ít nhất 10 ký tự"),
  selectedTopicIds: z.array(z.string()),
}).superRefine((value, context) => {
  if (value.context.startsWith("jd:") && value.selectedTopicIds.length === 0) {
    context.addIssue({ code: "custom", path: ["selectedTopicIds"], message: "Chọn ít nhất một chủ đề" });
  }
});
type Values = z.infer<typeof schema>;

export default function BookingNew() {
  const [params] = useSearchParams();
  const mentorId = params.get("mentorId") ?? "";
  const slotId = params.get("slotId") ?? "";
  const initialPlanId = params.get("planId") ?? "";
  const navigate = useNavigate();
  const requestAttempt = useRef<BookingRequestAttempt | null>(null);
  const mentor = useQuery({ queryKey: ["mentor", mentorId], queryFn: () => mentorsApi.get(mentorId), enabled: Boolean(mentorId) });
  const plans = useQuery({ queryKey: ["plans"], queryFn: preparationPlansApi.list });
  const jds = useQuery({ queryKey: ["job-descriptions"], queryFn: jobDescriptionsApi.list });
  const taxonomy = useQuery({ queryKey: ["taxonomy"], queryFn: questionsApi.taxonomy });
  const profile = useQuery({ queryKey: ["student-profile"], queryFn: studentProfileApi.get });
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    values: {
      context: initialPlanId ? `plan:${initialPlanId}` : "",
      interviewType: profile.data?.interviewType ?? "Technical Interview",
      goal: profile.data?.interviewGoal ?? "",
      selectedTopicIds: [],
    },
  });
  const contextValue = form.watch("context");
  const [contextKind, contextId] = contextValue.split(":");
  const selectedPlan = useQuery({ queryKey: ["plan", contextId], queryFn: () => preparationPlansApi.get(contextId), enabled: contextKind === "plan" && Boolean(contextId) });
  const mutation = useMutation({
    mutationFn: (values: Values) => {
      const [kind, id] = values.context.split(":");
      const planTopicIds = selectedPlan.data?.items.map((item) => item.topicId).filter((topicId): topicId is string => Boolean(topicId)) ?? [];
      const selectedTopicIds = [...new Set(kind === "plan" ? planTopicIds : values.selectedTopicIds)];
      const input = {
        mentorId,
        slotId,
        goal: values.goal,
        interviewType: values.interviewType,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        selectedTopicIds,
        ...(kind === "plan" ? { preparationPlanId: id, preparationPlanVersion: selectedPlan.data!.version } : { jobDescriptionId: id }),
      };
      requestAttempt.current = prepareBookingRequest(requestAttempt.current, input, createIdempotencyKey);
      return bookingsApi.create(input, requestAttempt.current.idempotencyKey);
    },
    onSuccess: (booking) => navigate(`/bookings/${booking.id}`, { replace: true }),
  });
  const slot = mentor.data?.nextSlots.find((item) => item.id === slotId);
  if (!mentorId || !slotId) return <div className="min-h-screen bg-canvas"><AuthNavbar /><main className="mx-auto max-w-xl px-6 py-12"><ErrorPanel error={new Error("Hãy mở booking từ một slot của Mentor.")} /></main></div>;

  return <div className="min-h-screen bg-canvas"><AuthNavbar /><main className="mx-auto max-w-[800px] px-6 py-8"><h1 className="text-[22px] font-semibold text-ink">Gửi yêu cầu đặt lịch</h1><p className="mt-1 text-sm text-ink-secondary">Backend kiểm tra lại ownership, plan version, expertise của Mentor và slot trước khi tạo booking.</p>{(mutation.error || mentor.error || selectedPlan.error) && <div className="mt-5"><ErrorPanel error={mutation.error || mentor.error || selectedPlan.error} /></div>}<form onSubmit={form.handleSubmit((value) => mutation.mutate(value))} className="mt-6 space-y-5 rounded-xl border border-edge bg-panel p-6"><div className="rounded-lg bg-canvas-subtle p-4 text-sm"><strong>{mentor.data?.displayName ?? "Đang tải Mentor…"}</strong><p className="mt-1 text-xs text-ink-muted">{slot ? new Date(slot.startsAt).toLocaleString("vi-VN") : "Slot đang được kiểm tra"}</p></div><label className="block text-xs font-semibold text-ink-secondary">Ngữ cảnh chuẩn bị<select {...form.register("context")} className="mt-1.5 w-full rounded-lg border border-edge bg-canvas px-3 py-2.5 text-sm"><option value="">Chọn một mục</option>{plans.data?.items.map((plan) => <option key={plan.id} value={`plan:${plan.id}`}>Kế hoạch {plan.id.slice(0, 8)} · v{plan.version}</option>)}{jds.data?.items.filter((jd) => jd.status === "CONFIRMED" || jd.status === "ANALYZED").map((jd) => <option key={jd.id} value={`jd:${jd.id}`}>JD {jd.id.slice(0, 8)} · {jd.status}</option>)}</select>{form.formState.errors.context ? <span className="mt-1 block text-xs text-danger">{form.formState.errors.context.message}</span> : null}</label>{contextKind === "plan" ? <div className="rounded-lg border border-edge bg-canvas-subtle p-4"><p className="text-xs font-semibold text-ink-secondary">Chủ đề từ plan v{selectedPlan.data?.version ?? "…"}</p><p className="mt-2 text-sm text-ink">{[...new Set(selectedPlan.data?.items.map((item) => item.topic).filter(Boolean))].join(", ") || "Plan chưa có topic hợp lệ"}</p></div> : contextKind === "jd" ? <fieldset><legend className="text-xs font-semibold text-ink-secondary">Chủ đề chia sẻ với Mentor</legend><div className="mt-2 grid gap-2 sm:grid-cols-2">{taxonomy.data?.topics.map((topic) => <label key={topic.id} className="flex items-center gap-2 rounded-md border border-edge p-3 text-sm text-ink-secondary"><input type="checkbox" value={topic.id} {...form.register("selectedTopicIds")} className="accent-primary" />{topic.name}</label>)}</div>{form.formState.errors.selectedTopicIds ? <span className="mt-1 block text-xs text-danger">{form.formState.errors.selectedTopicIds.message}</span> : null}</fieldset> : null}<label className="block text-xs font-semibold text-ink-secondary">Loại phỏng vấn<select {...form.register("interviewType")} className="mt-1.5 w-full rounded-lg border border-edge bg-canvas px-3 py-2.5 text-sm"><option>Technical Interview</option><option>Behavioral</option><option>System Design</option></select></label><label className="block text-xs font-semibold text-ink-secondary">Mục tiêu<textarea rows={4} {...form.register("goal")} className="mt-1.5 w-full rounded-lg border border-edge bg-canvas p-3 text-sm" />{form.formState.errors.goal ? <span className="mt-1 block text-xs text-danger">{form.formState.errors.goal.message}</span> : null}</label><div className="rounded-lg border border-edge bg-canvas-subtle p-4 text-xs leading-5 text-ink-secondary">Mentor chỉ nhận corrected-text version, role/seniority, topic, question groups và mục tiêu đã xác nhận. Tự hủy/đổi lịch khi còn ≥12 giờ; tối đa hai đề xuất.</div><button disabled={mutation.isPending || !slot || (contextKind === "plan" && !selectedPlan.data)} className="w-full rounded-lg bg-primary px-5 py-3 text-sm font-medium text-on-primary disabled:opacity-50">{mutation.isPending ? "Đang gửi…" : "Gửi yêu cầu"}</button></form></main></div>;
}
