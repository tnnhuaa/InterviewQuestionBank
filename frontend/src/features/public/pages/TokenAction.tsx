import { useMutation } from "@tanstack/react-query";
import { useSearchParams, Link } from "react-router-dom";
import { useState } from "react";
import { authApi } from "@/shared/api/resources";
import AuthFormLayout from "@/shared/components/AuthFormLayout";
import ErrorPanel from "@/shared/components/ErrorPanel";

export function VerifyEmail() {
  const [params] = useSearchParams();
  const mutation = useMutation({ mutationFn: authApi.verifyEmail });
  const token = params.get("token") ?? "";
  return <AuthFormLayout title="Xác minh email" description="Link chỉ dùng một lần và có thời hạn.">{mutation.error && <div className="mb-5"><ErrorPanel error={mutation.error} /></div>}{mutation.isSuccess ? <Link to="/login" className="text-sm font-medium text-primary">Email đã xác minh — đăng nhập</Link> : <button disabled={!token || mutation.isPending} onClick={() => mutation.mutate(token)} className="w-full rounded-lg bg-primary px-5 py-3 text-sm font-medium text-on-primary disabled:opacity-60">Xác minh tài khoản</button>}</AuthFormLayout>;
}

function PasswordTokenForm({ adminInvite = false }: { adminInvite?: boolean }) {
  const [params] = useSearchParams();
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const token = params.get("token") ?? "";
  const mutation = useMutation({ mutationFn: () => adminInvite ? authApi.acceptAdminInvite({ token, password, displayName }) : authApi.resetPassword(token, password), onError: () => setPassword("") });
  return <AuthFormLayout title={adminInvite ? "Thiết lập Admin" : "Đặt lại mật khẩu"} description="Mật khẩu có ít nhất 10 ký tự; link chỉ dùng một lần.">{mutation.error && <div className="mb-5"><ErrorPanel error={mutation.error} /></div>}{mutation.isSuccess ? <Link to="/login" className="text-sm font-medium text-primary">Hoàn tất — đăng nhập</Link> : <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); mutation.mutate(); }}>{adminInvite && <label className="block text-xs font-semibold text-ink-secondary">Họ tên<input required minLength={2} value={displayName} onChange={(event) => setDisplayName(event.target.value)} className="mt-1.5 w-full rounded-lg border border-edge bg-panel px-4 py-2.5 text-sm" /></label>}<label className="block text-xs font-semibold text-ink-secondary">Mật khẩu mới<input required minLength={10} type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1.5 w-full rounded-lg border border-edge bg-panel px-4 py-2.5 text-sm" /></label><button disabled={!token || mutation.isPending} className="w-full rounded-lg bg-primary px-5 py-3 text-sm font-medium text-on-primary disabled:opacity-60">Lưu mật khẩu</button></form>}</AuthFormLayout>;
}
export function ResetPassword() { return <PasswordTokenForm />; }
export function AcceptAdminInvite() { return <PasswordTokenForm adminInvite />; }
