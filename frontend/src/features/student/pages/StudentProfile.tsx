import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { studentProfileApi } from "@/shared/api/resources";
import AuthNavbar from "@/shared/components/AuthNavbar";
import ErrorPanel from "@/shared/components/ErrorPanel";

const schema = z.object({
  targetPosition: z.string().max(120),
  interviewType: z.string().max(80),
  interviewGoal: z.string().max(1000),
  interviewDate: z.string(),
  timezone: z.string().min(1).max(80),
});
type Values = z.infer<typeof schema>;

export default function StudentProfile() {
  const queryClient = useQueryClient();
  const profile = useQuery({ queryKey: ["student-profile"], queryFn: studentProfileApi.get });
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    values: {
      targetPosition: profile.data?.targetPosition ?? "",
      interviewType: profile.data?.interviewType ?? "Technical Interview",
      interviewGoal: profile.data?.interviewGoal ?? "",
      interviewDate: profile.data?.interviewDate ?? "",
      timezone: profile.data?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  });
  const update = useMutation({
    mutationFn: (values: Values) => studentProfileApi.update({
      ...values,
      targetPosition: values.targetPosition || null,
      interviewType: values.interviewType || null,
      interviewGoal: values.interviewGoal || null,
      interviewDate: values.interviewDate || null,
      version: profile.data!.version,
    }),
    onSuccess: (data) => {
      queryClient.setQueryData(["student-profile"], data);
      toast.success("Lưu hồ sơ thành công");
    },
  });

  return <div className="min-h-screen bg-canvas"><AuthNavbar /><main className="mx-auto max-w-[760px] px-6 py-8">
    <h1 className="text-[22px] font-semibold text-ink">Hồ sơ và mục tiêu phỏng vấn</h1>
    <p className="mt-1 text-sm text-ink-secondary">Thông tin này dùng để prefill các flow chuẩn bị; bạn luôn có thể sửa trước khi gửi booking.</p>
    {(profile.error || update.error) && <div className="mt-5"><ErrorPanel error={profile.error || update.error} onRetry={() => profile.refetch()} /></div>}
    {profile.isLoading ? <p className="mt-6 text-sm text-ink-muted">Đang tải hồ sơ…</p> : <form onSubmit={form.handleSubmit((values) => update.mutate(values))} className="mt-6 space-y-5 rounded-xl border border-edge bg-panel p-6">
      <label className="block text-xs font-semibold text-ink-secondary">Vị trí mục tiêu<input {...form.register("targetPosition")} placeholder="Frontend Intern" className="mt-1.5 w-full rounded-lg border border-edge bg-canvas px-4 py-2.5 text-sm" /></label>
      <label className="block text-xs font-semibold text-ink-secondary">Loại phỏng vấn<select {...form.register("interviewType")} className="mt-1.5 w-full rounded-lg border border-edge bg-canvas px-4 py-2.5 text-sm"><option>Technical Interview</option><option>Behavioral</option><option>System Design</option></select></label>
      <label className="block text-xs font-semibold text-ink-secondary">Mục tiêu<textarea rows={5} {...form.register("interviewGoal")} className="mt-1.5 w-full rounded-lg border border-edge bg-canvas p-4 text-sm" /></label>
      <div className="grid gap-4 sm:grid-cols-2"><label className="block text-xs font-semibold text-ink-secondary">Ngày phỏng vấn dự kiến<input type="date" {...form.register("interviewDate")} className="mt-1.5 w-full rounded-lg border border-edge bg-canvas px-4 py-2.5 text-sm" /></label><label className="block text-xs font-semibold text-ink-secondary">Múi giờ<input {...form.register("timezone")} className="mt-1.5 w-full rounded-lg border border-edge bg-canvas px-4 py-2.5 text-sm" /></label></div>
      <button disabled={update.isPending || !profile.data} className="w-full rounded-lg bg-primary px-5 py-3 text-sm font-medium text-on-primary disabled:opacity-50">{update.isPending ? "Đang lưu…" : "Lưu hồ sơ"}</button>
    </form>}
  </main></div>;
}
