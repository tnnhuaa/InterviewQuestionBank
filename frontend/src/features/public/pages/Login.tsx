import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { SpinnerGap } from "@phosphor-icons/react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";
import { useApp } from "@/app/AppContext";
import { authApi } from "@/shared/api/resources";
import { ApiError } from "@/shared/api/client";
import AuthFormLayout from "@/shared/components/AuthFormLayout";
import ErrorPanel from "@/shared/components/ErrorPanel";

const schema = z.object({ email: z.email("Email không hợp lệ"), password: z.string().min(1, "Nhập mật khẩu") });
type Values = z.infer<typeof schema>;

export default function Login() {
  const { applyLogin } = useApp();
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { email: "", password: "" } });
  const login = useMutation({ mutationFn: authApi.login, onSuccess: async (payload) => {
    await applyLogin(payload);
  }, onError: (error) => {
    form.resetField("password");
    if (error instanceof ApiError) Object.entries(error.fieldErrors).forEach(([name, message]) => form.setError(name as keyof Values, { message }));
  } });

  return <AuthFormLayout title="Chào mừng trở lại" description="Đăng nhập bằng email và mật khẩu để tiếp tục.">
    {login.error && <div className="mb-5"><ErrorPanel error={login.error} /></div>}
    <form className="space-y-4" onSubmit={form.handleSubmit((values) => login.mutate(values))} noValidate>
      <label className="block text-xs font-semibold text-ink-secondary">Email
        <input autoComplete="email" type="email" {...form.register("email")} className="mt-1.5 w-full rounded-lg border border-edge bg-panel px-4 py-2.5 text-sm outline-none focus:border-primary" />
        {form.formState.errors.email && <span className="mt-1 block text-xs text-danger">{form.formState.errors.email.message}</span>}
      </label>
      <label className="block text-xs font-semibold text-ink-secondary">Mật khẩu
        <input autoComplete="current-password" type="password" {...form.register("password")} className="mt-1.5 w-full rounded-lg border border-edge bg-panel px-4 py-2.5 text-sm outline-none focus:border-primary" />
        {form.formState.errors.password && <span className="mt-1 block text-xs text-danger">{form.formState.errors.password.message}</span>}
      </label>
      <div className="flex items-center justify-between text-xs"><Link to="/register" className="text-primary hover:underline">Tạo tài khoản Student</Link><Link to="/forgot-password" className="text-primary hover:underline">Quên mật khẩu?</Link></div>
      <button disabled={login.isPending} className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-on-primary hover:bg-primary-hover disabled:opacity-60">
        {login.isPending && <SpinnerGap aria-hidden size={17} className="animate-spin" />} Đăng nhập
      </button>
    </form>
  </AuthFormLayout>;
}
