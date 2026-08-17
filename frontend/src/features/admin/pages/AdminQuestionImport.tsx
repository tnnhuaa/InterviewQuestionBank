import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { adminApi, type QuestionImport } from "@/shared/api/resources";
import AuthNavbar from "@/shared/components/AuthNavbar";
import ErrorPanel from "@/shared/components/ErrorPanel";

export default function AdminQuestionImport() {
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [batch, setBatch] = useState<QuestionImport | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [reason, setReason] = useState("Import validated questions as drafts");
  const preview = useMutation({
    mutationFn: () => adminApi.previewImport(file!),
    onSuccess: (result) => { setStatusFilter(""); setBatch(result); },
  });
  const loadRows = useMutation({
    mutationFn: ({ page, status = statusFilter }: { page: number; status?: string }) => adminApi.getImport(batch!.id, { page, pageSize: 100, status }),
    onSuccess: setBatch,
  });
  const commit = useMutation({
    mutationFn: () => adminApi.commitImport(batch!.id, batch!.version, reason),
    onSuccess: async () => {
      const refreshed = await adminApi.getImport(batch!.id, { page: 1, pageSize: 100, status: statusFilter });
      setBatch(refreshed);
      queryClient.invalidateQueries({ queryKey: ["admin-questions"] });
    },
  });
  const error = preview.error || commit.error || loadRows.error;

  return <div className="min-h-screen bg-canvas"><AuthNavbar /><main className="mx-auto max-w-[1100px] px-6 py-8">
    <h1 className="text-[22px] font-semibold text-ink">Bulk import Question Bank</h1>
    <p className="mt-1 text-sm text-ink-secondary">CSV được preview theo từng dòng; chỉ dòng hợp lệ được commit vào DRAFT và không bao giờ auto-publish.</p>
    {error ? <div className="mt-5"><ErrorPanel error={error} /></div> : null}
    <section className="mt-6 rounded-xl border border-edge bg-panel p-6">
      <p className="text-xs font-semibold text-ink-secondary">Header bắt buộc</p>
      <code className="mt-2 block overflow-x-auto rounded-md bg-canvas-subtle p-3 text-[11px] text-ink">slug,title,content,answerCriteria,difficulty,topicSlugs,positionSlugs,sourceName,sourceUrl,provenanceNote</code>
      <div className="mt-4 flex flex-wrap items-center gap-3"><label className="flex-1 rounded-lg border border-dashed border-edge p-4 text-sm text-ink-secondary"><input type="file" accept=".csv,text/csv" onChange={(event) => { setFile(event.target.files?.[0] ?? null); setBatch(null); }} className="mr-3" />{file?.name ?? "CSV UTF-8, tối đa 5 MB / 1.000 dòng"}</label><button disabled={!file || preview.isPending} onClick={() => preview.mutate()} className="rounded-md bg-primary px-5 py-3 text-sm font-medium text-on-primary disabled:opacity-50">{preview.isPending ? "Đang kiểm tra…" : "Preview"}</button></div>
    </section>
    {batch ? <>
      <section className="mt-5 grid gap-3 sm:grid-cols-4">{[{ label: "Tổng dòng", value: batch.totalRows }, { label: "Hợp lệ", value: batch.validRows }, { label: "Có lỗi", value: batch.invalidRows }, { label: "Đã import", value: batch.importedRows }].map((item) => <article key={item.label} className="rounded-xl border border-edge bg-panel p-4"><p className="text-xl font-semibold text-ink">{item.value}</p><p className="mt-1 text-xs text-ink-muted">{item.label}</p></article>)}</section>
      <section className="mt-5 overflow-hidden rounded-xl border border-edge bg-panel">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-edge p-4"><div><h2 className="text-sm font-semibold text-ink">{batch.fileName}</h2><p className="text-xs text-ink-muted">{batch.status} · v{batch.version}</p></div><div className="flex gap-2"><select aria-label="Lọc trạng thái dòng import" value={statusFilter} disabled={loadRows.isPending} onChange={(event) => { const status = event.target.value; setStatusFilter(status); loadRows.mutate({ page: 1, status }); }} className="rounded-md border border-edge px-3 py-2 text-xs"><option value="">Tất cả dòng</option><option value="VALID">VALID</option><option value="INVALID">INVALID</option><option value="IMPORTED">IMPORTED</option><option value="SKIPPED">SKIPPED</option></select>{batch.invalidRows > 0 ? <a href={`/api/v1/admin/question-imports/${batch.id}/errors.csv`} className="rounded-md border border-edge px-3 py-2 text-xs font-medium text-ink-secondary">Tải error CSV</a> : null}</div></div>
        <div className="overflow-x-auto"><table className="w-full text-left text-xs"><thead className="bg-canvas-subtle text-ink-muted"><tr><th className="px-4 py-3">Dòng</th><th className="px-4 py-3">Slug</th><th className="px-4 py-3">Trạng thái</th><th className="px-4 py-3">Lỗi</th></tr></thead><tbody className="divide-y divide-edge">{batch.rows.map((row) => <tr key={row.id}><td className="px-4 py-3">{row.rowNumber}</td><td className="px-4 py-3 font-mono">{String(row.payload.slug ?? "")}</td><td className="px-4 py-3 font-medium">{row.status}</td><td className="px-4 py-3 text-danger">{row.errors.map((item) => `${item.field}: ${item.message}`).join(" · ") || "—"}</td></tr>)}</tbody></table></div>
        {batch.pageInfo.total > batch.pageInfo.pageSize ? <nav aria-label="Phân trang dòng import" className="flex items-center justify-between border-t border-edge p-4"><button disabled={batch.pageInfo.page === 1 || loadRows.isPending} onClick={() => loadRows.mutate({ page: batch.pageInfo.page - 1 })} className="rounded-md border border-edge px-3 py-2 text-xs disabled:opacity-40">Trang trước</button><span className="text-xs text-ink-muted">Trang {batch.pageInfo.page} / {Math.ceil(batch.pageInfo.total / batch.pageInfo.pageSize)}</span><button disabled={batch.pageInfo.page * batch.pageInfo.pageSize >= batch.pageInfo.total || loadRows.isPending} onClick={() => loadRows.mutate({ page: batch.pageInfo.page + 1 })} className="rounded-md border border-edge px-3 py-2 text-xs disabled:opacity-40">Trang sau</button></nav> : null}
      </section>
      {!batch.status.includes("IMPORTED") ? <section className="mt-5 rounded-xl border border-edge bg-panel p-5"><label className="block text-xs font-semibold text-ink-secondary">Lý do commit<input value={reason} onChange={(event) => setReason(event.target.value)} className="mt-1.5 w-full rounded-md border border-edge px-3 py-2 text-sm" /></label><button disabled={!batch.validRows || reason.trim().length < 3 || commit.isPending} onClick={() => commit.mutate()} className="mt-4 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-on-primary disabled:opacity-50">Import {batch.validRows} dòng hợp lệ vào DRAFT</button></section> : null}
    </> : null}
  </main></div>;
}
