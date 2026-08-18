import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { adminApi } from "@/shared/api/resources";
import AuthNavbar from "@/shared/components/AuthNavbar";
import ErrorPanel from "@/shared/components/ErrorPanel";

const ACTION_LABELS: Record<string, string> = {
  RETRY_AI_JOB: "Đưa AI job về hàng đợi",
  DISABLE_FEATURE: "Tắt feature AI liên quan",
  DISMISS: "Đóng case, không thay đổi dữ liệu",
  ASSIGN: "Nhận xử lý case",
};

export default function AdminCase() {
  const { caseId = "" } = useParams();
  const queryClient = useQueryClient();
  const item = useQuery({ queryKey: ["operation-case", caseId], queryFn: () => adminApi.case(caseId) });
  const impact = useQuery({ queryKey: ["operation-impact", caseId], queryFn: () => adminApi.impact(caseId) });
  const [reason, setReason] = useState("");
  const action = useMutation({
    mutationFn: (name: string) => adminApi.act(caseId, { action: name, reason, version: item.data!.version }),
    onSuccess: (data) => {
      queryClient.setQueryData(["operation-case", caseId], data);
      queryClient.invalidateQueries({ queryKey: ["operation-cases"] });
      queryClient.invalidateQueries({ queryKey: ["ai-capabilities"] });
    },
  });
  return <div className="min-h-screen bg-canvas"><AuthNavbar /><main className="mx-auto max-w-[800px] px-6 py-8">{item.error || impact.error ? <ErrorPanel error={item.error || impact.error} /> : item.isLoading ? <p className="text-sm text-ink-muted">Đang tải case…</p> : item.data && <><section className="rounded-xl border border-edge bg-panel p-6"><div className="flex justify-between gap-3"><div><p className="text-xs font-semibold text-primary">{item.data.type}</p><h1 className="mt-2 text-lg font-semibold text-ink">{item.data.summary}</h1></div><span className="text-xs font-medium text-ink-muted">{item.data.status} · v{item.data.version}</span></div><p className="mt-5 text-xs text-ink-muted">Target: {item.data.targetType} / {item.data.targetId}</p>{item.data.aiJob && <dl className="mt-4 grid gap-2 rounded-lg bg-canvas-subtle p-4 text-xs sm:grid-cols-2"><div><dt className="text-ink-muted">Tác vụ</dt><dd className="mt-1 font-medium text-ink">{item.data.aiJob.kind}</dd></div><div><dt className="text-ink-muted">Model</dt><dd className="mt-1 font-medium text-ink">{item.data.aiJob.model}</dd></div><div><dt className="text-ink-muted">Lỗi an toàn</dt><dd className="mt-1 font-mono text-ink">{item.data.aiJob.errorCode ?? "AI_JOB_FAILED"}</dd></div><div><dt className="text-ink-muted">Lượt chạy</dt><dd className="mt-1 font-medium text-ink">{item.data.aiJob.attemptCount}/{item.data.aiJob.maxAttempts}</dd></div></dl>}</section><section className="mt-5 rounded-xl border border-edge bg-panel p-6"><h2 className="text-sm font-semibold text-ink">Impact preview</h2><ul className="mt-3 space-y-2">{impact.data?.effects.map((effect) => <li key={effect} className="text-sm text-ink-secondary">• {effect}</li>)}</ul><label className="mt-5 block text-xs font-semibold text-ink-secondary">Lý do bắt buộc<textarea minLength={5} required value={reason} onChange={(event) => setReason(event.target.value)} className="mt-1.5 w-full rounded-md border border-edge p-3 text-sm" /></label>{action.error && <div className="mt-4"><ErrorPanel error={action.error} /></div>}<div className="mt-4 flex flex-wrap gap-2">{item.data.allowedActions.map((name) => <button key={name} disabled={reason.trim().length < 5 || action.isPending || !["OPEN", "IN_PROGRESS"].includes(item.data!.status)} onClick={() => action.mutate(name)} className={`rounded-md border px-4 py-2 text-xs font-medium disabled:opacity-40 ${name === "DISABLE_FEATURE" ? "border-danger/30 bg-danger-soft text-danger" : "border-edge bg-canvas text-ink-secondary"}`}>{ACTION_LABELS[name] ?? name}</button>)}</div></section></>}</main></div>;
}
