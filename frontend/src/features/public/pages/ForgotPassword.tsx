import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { authApi } from "@/shared/api/resources";
import AuthFormLayout from "@/shared/components/AuthFormLayout";
import ErrorPanel from "@/shared/components/ErrorPanel";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const mutation = useMutation({ mutationFn: authApi.forgotPassword });
  return <AuthFormLayout title="Khôi phục mật khẩu" description="Vì lý do bảo mật, hệ thống luôn trả cùng một kết quả dù email có tồn tại hay không.">
    {mutation.error && <div className="mb-5"><ErrorPanel error={mutation.error} /></div>}
    {mutation.isSuccess ? <p className="rounded-lg border border-ok/20 bg-ok-soft p-4 text-sm text-ink">Nếu tài khoản hợp lệ, email hướng dẫn đã được đưa vào hàng đợi gửi.</p> : <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); mutation.mutate(email); }}><label className="block text-xs font-semibold text-ink-secondary">Email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1.5 w-full rounded-lg border border-edge bg-panel px-4 py-2.5 text-sm" /></label><button className="w-full rounded-lg bg-primary px-5 py-3 text-sm font-medium text-on-primary">Gửi hướng dẫn</button></form>}
  </AuthFormLayout>;
}
