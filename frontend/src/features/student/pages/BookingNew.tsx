import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { routes } from "@/app/routePaths";
import { createIdempotencyKey } from "@/shared/api/client";
import {
  bookingsApi,
  jobDescriptionsApi,
  mentorsApi,
  preparationPlansApi,
  questionsApi,
  studentProfileApi,
} from "@/shared/api/resources";
import AuthNavbar from "@/shared/components/AuthNavbar";
import ErrorPanel from "@/shared/components/ErrorPanel";

const schema = z.object({
  context: z.string().min(1, "Chọn JD hoặc kế hoạch"),
  interviewType: z.string().min(2, "Chọn loại phỏng vấn"),
  goal: z.string().trim().min(10, "Mục tiêu cần ít nhất 10 ký tự"),
  selectedTopicIds: z.array(z.string()).min(1, "Chọn ít nhất một chủ đề"),
});

type Values = z.infer<typeof schema>;
type BookingAttempt = { input: Record<string, unknown>; idempotencyKey: string };

export default function BookingNew() {
  const [params] = useSearchParams();
  const mentorId = params.get("mentorId") ?? "";
  const slotId = params.get("slotId") ?? "";
  const initialPlanId = params.get("planId") ?? "";
  const navigate = useNavigate();
  const submissionLock = useRef(false);
  const previousContext = useRef("");
  const [lastAttempt, setLastAttempt] = useState<BookingAttempt | null>(null);

  const mentor = useQuery({
    queryKey: ["mentor", mentorId],
    queryFn: () => mentorsApi.get(mentorId),
    enabled: Boolean(mentorId),
  });
  const plans = useQuery({ queryKey: ["plans"], queryFn: preparationPlansApi.list });
  const jds = useQuery({ queryKey: ["job-descriptions"], queryFn: jobDescriptionsApi.list });
  const taxonomy = useQuery({ queryKey: ["taxonomy"], queryFn: questionsApi.taxonomy });
  const profile = useQuery({ queryKey: ["student-profile"], queryFn: studentProfileApi.get });
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      context: initialPlanId ? `plan:${initialPlanId}` : "",
      interviewType: "Technical Interview",
      goal: "",
      selectedTopicIds: [],
    },
  });
  const contextValue = form.watch("context");
  const [contextKind, contextId] = contextValue.split(":");
  const selectedPlan = useQuery({
    queryKey: ["plan", contextId],
    queryFn: () => preparationPlansApi.get(contextId),
    enabled: contextKind === "plan" && Boolean(contextId),
  });
  const planTopicIds = useMemo(
    () => [
      ...new Set(
        selectedPlan.data?.items
          .map((item) => item.topicId)
          .filter((topicId): topicId is string => Boolean(topicId)) ?? [],
      ),
    ],
    [selectedPlan.data],
  );
  const planHasNoTopics = contextKind === "plan" && Boolean(selectedPlan.data) && planTopicIds.length === 0;

  useEffect(() => {
    if (!profile.data) return;
    if (!form.formState.dirtyFields.interviewType && profile.data.interviewType) {
      form.setValue("interviewType", profile.data.interviewType);
    }
    if (!form.formState.dirtyFields.goal && profile.data.interviewGoal) {
      form.setValue("goal", profile.data.interviewGoal);
    }
  }, [form, profile.data]);

  useEffect(() => {
    if (previousContext.current !== contextValue) {
      previousContext.current = contextValue;
      form.setValue("selectedTopicIds", [], { shouldValidate: false });
      setLastAttempt(null);
    }
  }, [contextValue, form]);

  useEffect(() => {
    if (contextKind === "plan" && selectedPlan.data) {
      form.setValue("selectedTopicIds", planTopicIds, { shouldValidate: true });
    }
  }, [contextKind, form, planTopicIds, selectedPlan.data]);

  const mutation = useMutation({
    mutationFn: (attempt: BookingAttempt) => bookingsApi.create(attempt.input, attempt.idempotencyKey),
    onSettled: () => {
      submissionLock.current = false;
    },
    onSuccess: (booking) => navigate(routes.booking(booking.id), { replace: true }),
  });

  const submit = (values: Values) => {
    if (submissionLock.current) return;
    const [kind, id] = values.context.split(":");
    const plan = kind === "plan" ? selectedPlan.data : undefined;
    if ((kind === "plan" && !plan) || !id) return;
    const attempt: BookingAttempt = {
      idempotencyKey: createIdempotencyKey(),
      input: {
        mentorId,
        slotId,
        goal: values.goal,
        interviewType: values.interviewType,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        selectedTopicIds: [...new Set(values.selectedTopicIds)],
        ...(kind === "plan"
          ? { preparationPlanId: id, preparationPlanVersion: plan!.version }
          : { jobDescriptionId: id }),
      },
    };
    submissionLock.current = true;
    setLastAttempt(attempt);
    mutation.mutate(attempt);
  };

  const retry = () => {
    if (!lastAttempt || submissionLock.current) return;
    submissionLock.current = true;
    mutation.mutate(lastAttempt);
  };

  const slot = mentor.data?.nextSlots.find((item) => item.id === slotId);
  const dependenciesReady = Boolean(
    mentor.data &&
      slot &&
      plans.data &&
      jds.data &&
      (contextKind !== "plan" || selectedPlan.data),
  );

  if (!mentorId || !slotId) {
    return (
      <div className="min-h-screen bg-canvas">
        <AuthNavbar />
        <main className="mx-auto max-w-xl px-6 py-12">
          <ErrorPanel error={new Error("Hãy mở booking từ một slot của Mentor.")} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas">
      <AuthNavbar />
      <main className="mx-auto max-w-[800px] px-6 py-8">
        <h1 className="text-[22px] font-semibold text-ink">Gửi yêu cầu đặt lịch</h1>
        <p className="mt-1 text-sm text-ink-secondary">
          Hệ thống kiểm tra quyền sở hữu, phiên bản kế hoạch, chuyên môn Mentor và slot trước khi tạo booking.
        </p>
        {mutation.error || mentor.error || selectedPlan.error ? (
          <div className="mt-5">
            <ErrorPanel
              error={mutation.error || mentor.error || selectedPlan.error}
              onRetry={mutation.error ? retry : undefined}
            />
          </div>
        ) : null}
        <form onSubmit={form.handleSubmit(submit)} className="mt-6 space-y-5 rounded-xl border border-edge bg-panel p-6">
          <div className="rounded-lg bg-canvas-subtle p-4 text-sm">
            <strong>{mentor.data?.displayName ?? "Đang tải Mentor…"}</strong>
            <p className="mt-1 text-xs text-ink-muted">
              {slot ? new Date(slot.startsAt).toLocaleString("vi-VN") : "Slot đang được kiểm tra"}
            </p>
          </div>

          <label className="block text-xs font-semibold text-ink-secondary">
            Ngữ cảnh chuẩn bị
            <select {...form.register("context")} className="mt-1.5 w-full rounded-lg border border-edge bg-canvas px-3 py-2.5 text-sm">
              <option value="">Chọn một mục</option>
              {plans.data?.items.map((plan) => (
                <option key={plan.id} value={`plan:${plan.id}`}>Kế hoạch {plan.id.slice(0, 8)} · v{plan.version}</option>
              ))}
              {jds.data?.items
                .filter((jd) => jd.status === "CONFIRMED" || jd.status === "ANALYZED")
                .map((jd) => (
                  <option key={jd.id} value={`jd:${jd.id}`}>JD {jd.id.slice(0, 8)} · {jd.status}</option>
                ))}
            </select>
            {form.formState.errors.context ? <span className="mt-1 block text-xs text-danger">{form.formState.errors.context.message}</span> : null}
          </label>

          {contextKind === "plan" ? (
            <div className="rounded-lg border border-edge bg-canvas-subtle p-4">
              <p className="text-xs font-semibold text-ink-secondary">Chủ đề từ plan v{selectedPlan.data?.version ?? "…"}</p>
              <p className="mt-2 text-sm text-ink">
                {[...new Set(selectedPlan.data?.items.map((item) => item.topic).filter(Boolean))].join(", ") || "Plan chưa có chủ đề hợp lệ"}
              </p>
              {planHasNoTopics ? (
                <div className="mt-3 rounded-md border border-notice/30 bg-notice-soft p-3 text-xs text-notice-ink">
                  Không thể đặt lịch vì kế hoạch chưa có chủ đề. Hãy hoàn thiện mapping hoặc chọn câu hỏi thủ công trước.
                  <div className="mt-2 flex flex-wrap gap-3 font-semibold">
                    <Link to={routes.preparationPlan(contextId)} className="underline">Quay lại kế hoạch</Link>
                    <Link to={routes.jobDescriptionMapping(selectedPlan.data!.jobDescriptionId)} className="underline">Mở mapping</Link>
                    <Link to={routes.questions} className="underline">Mở Question Bank</Link>
                  </div>
                </div>
              ) : null}
              {form.formState.errors.selectedTopicIds ? <span className="mt-2 block text-xs text-danger">{form.formState.errors.selectedTopicIds.message}</span> : null}
            </div>
          ) : contextKind === "jd" ? (
            <fieldset>
              <legend className="text-xs font-semibold text-ink-secondary">Chủ đề chia sẻ với Mentor</legend>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {taxonomy.data?.topics.map((topic) => (
                  <label key={topic.id} className="flex items-center gap-2 rounded-md border border-edge p-3 text-sm text-ink-secondary">
                    <input type="checkbox" value={topic.id} {...form.register("selectedTopicIds")} className="accent-primary" />
                    {topic.name}
                  </label>
                ))}
              </div>
              {form.formState.errors.selectedTopicIds ? <span className="mt-1 block text-xs text-danger">{form.formState.errors.selectedTopicIds.message}</span> : null}
            </fieldset>
          ) : null}

          <label className="block text-xs font-semibold text-ink-secondary">
            Loại phỏng vấn
            <select {...form.register("interviewType")} className="mt-1.5 w-full rounded-lg border border-edge bg-canvas px-3 py-2.5 text-sm">
              <option>Technical Interview</option>
              <option>Behavioral</option>
              <option>System Design</option>
            </select>
          </label>
          <label className="block text-xs font-semibold text-ink-secondary">
            Mục tiêu
            <textarea rows={4} {...form.register("goal")} className="mt-1.5 w-full rounded-lg border border-edge bg-canvas p-3 text-sm" />
            {form.formState.errors.goal ? <span className="mt-1 block text-xs text-danger">{form.formState.errors.goal.message}</span> : null}
          </label>
          <div className="rounded-lg border border-edge bg-canvas-subtle p-4 text-xs leading-5 text-ink-secondary">
            Mentor chỉ nhận corrected-text version, role/seniority, topic, question groups và mục tiêu đã xác nhận. Tự hủy/đổi lịch khi còn ≥12 giờ; tối đa hai đề xuất.
          </div>
          <button
            disabled={mutation.isPending || !dependenciesReady || planHasNoTopics}
            className="w-full rounded-lg bg-primary px-5 py-3 text-sm font-medium text-on-primary disabled:opacity-50"
          >
            {mutation.isPending ? "Đang gửi…" : dependenciesReady ? "Gửi yêu cầu" : "Đang kiểm tra dữ liệu…"}
          </button>
        </form>
      </main>
    </div>
  );
}
