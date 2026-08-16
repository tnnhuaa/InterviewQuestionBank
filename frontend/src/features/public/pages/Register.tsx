import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";
import { authApi } from "@/shared/api/resources";
import AuthFormLayout from "@/shared/components/AuthFormLayout";
import ErrorPanel from "@/shared/components/ErrorPanel";

const schema = z.object({ displayName: z.string().trim().min(2, "Tên phải có ít nhất 2 ký tự"), email: z.email("Email không hợp lệ"), password: z.string().min(10, "Mật khẩu phải có ít nhất 10 ký tự") });
type Values = z.infer<typeof schema>;
export default function Register() {
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { displayName: "", email: "", password: "" } });
  const mutation = useMutation({ mutationFn: authApi.register, onError: () => form.resetField("password") });
  if (mutation.isSuccess) return <AuthFormLayout title="Kiểm tra email" description="Tài khoản đã được tạo. Mở link xác minh trong email; local có thể xem email tại Mailpit."><Link className="text-sm font-medium text-primary hover:underline" to="/login">Quay lại đăng nhập</Link></AuthFormLayout>;
  return <AuthFormLayout title="Tạo tài khoản Student" description="Dùng email thật để nhận link xác minh và khôi phục tài khoản.">
    {mutation.error && <div className="mb-5"><ErrorPanel error={mutation.error} /></div>}
    <form className="space-y-4" onSubmit={form.handleSubmit((value) => mutation.mutate(value))} noValidate>
      {[{ name: "displayName", label: "Họ tên", type: "text", auto: "name" }, { name: "email", label: "Email", type: "email", auto: "email" }, { name: "password", label: "Mật khẩu", type: "password", auto: "new-password" }].map((field) => <label key={field.name} className="block text-xs font-semibold text-ink-secondary">{field.label}<input type={field.type} autoComplete={field.auto} {...form.register(field.name as keyof Values)} className="mt-1.5 w-full rounded-lg border border-edge bg-panel px-4 py-2.5 text-sm outline-none focus:border-primary" />{form.formState.errors[field.name as keyof Values] && <span className="mt-1 block text-xs text-danger">{form.formState.errors[field.name as keyof Values]?.message}</span>}</label>)}
      <button disabled={mutation.isPending} className="w-full rounded-lg bg-primary px-5 py-3 text-sm font-medium text-on-primary disabled:opacity-60">Tạo tài khoản</button>
      <Link to="/login" className="block text-center text-xs text-primary hover:underline">Đã có tài khoản? Đăng nhập</Link>
    </form>
  </AuthFormLayout>;
}
