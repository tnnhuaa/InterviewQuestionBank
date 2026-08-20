import { FileArrowUp, SpinnerGap } from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createIdempotencyKey } from "@/shared/api/client";
import { jobDescriptionsApi, type JobDescription } from "@/shared/api/resources";
import AuthNavbar from "@/shared/components/AuthNavbar";
import ErrorPanel from "@/shared/components/ErrorPanel";
import JDFlowStepper from "@/shared/components/JDFlowStepper";

export default function JDUpload() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"text" | "file">("text");
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [createAttempt, setCreateAttempt] = useState<{ mode: "text" | "file"; key: string; text?: string; file?: File } | null>(null);
  const [extractionAttempt, setExtractionAttempt] = useState<{ id: string; key: string } | null>(null);
  const [createdJd, setCreatedJd] = useState<JobDescription | null>(null);
  const extraction = useMutation({
    mutationFn: (attempt: { id: string; key: string }) => jobDescriptionsApi.startExtraction(attempt.id, attempt.key),
    onSuccess: (_, attempt) => navigate(`/job-descriptions/${attempt.id}/review`),
  });
  const creation = useMutation({
    mutationFn: (attempt: { mode: "text" | "file"; key: string; text?: string; file?: File }) => attempt.mode === "text"
      ? jobDescriptionsApi.createFromText(attempt.text!, attempt.key)
      : jobDescriptionsApi.upload(attempt.file!, attempt.key),
    onSuccess: (jd, attempt) => {
      if (attempt.mode === "text") {
        navigate(`/job-descriptions/${jd.id}/review`);
        return;
      }
      setCreatedJd(jd);
      const nextExtraction = { id: jd.id, key: createIdempotencyKey() };
      setExtractionAttempt(nextExtraction);
      extraction.mutate(nextExtraction);
    },
  });
  const canSubmit = mode === "text" ? text.trim().length > 0 : Boolean(file);
  function resetAttempt() {
    setCreateAttempt(null);
    setExtractionAttempt(null);
    setCreatedJd(null);
    creation.reset();
    extraction.reset();
  }
  function submit() {
    const attempt = mode === "text"
      ? { mode, key: createIdempotencyKey(), text }
      : { mode, key: createIdempotencyKey(), file: file! };
    setCreateAttempt(attempt);
    creation.mutate(attempt);
  }
  return <div className="min-h-screen bg-canvas"><AuthNavbar /><main className="mx-auto max-w-[900px] px-6 py-8"><JDFlowStepper currentStep={1} />
    <h1 className="mt-8 text-[22px] font-semibold text-ink">Thêm Job Description</h1><p className="mt-1 text-sm text-ink-secondary">Dán văn bản hoặc tải một PDF/PNG/JPEG. Tệp tối đa 10 MB; PDF tối đa 5 trang.</p>
    {creation.error && createAttempt && <div className="mt-5"><ErrorPanel error={creation.error} onRetry={() => creation.mutate(createAttempt)} /></div>}
    {extraction.error && extractionAttempt && <div className="mt-5"><ErrorPanel error={extraction.error} onRetry={() => extraction.mutate(extractionAttempt)} /></div>}
    {createdJd && <div className="mt-5 rounded-xl border border-notice/20 bg-notice-soft p-4 text-xs text-notice-ink">Tệp đã được lưu với mã {createdJd.id}. Nếu extraction lỗi, thao tác thử lại chỉ xử lý JD này và không upload lại tệp.</div>}
    <div className="mt-6 rounded-xl border border-edge bg-panel p-6">
      <div className="mb-5 flex gap-2">{(["text", "file"] as const).map((value) => <button key={value} disabled={creation.isPending || extraction.isPending || Boolean(createdJd)} onClick={() => { setMode(value); resetAttempt(); }} className={mode === value ? "rounded-md bg-primary px-4 py-2 text-xs font-medium text-on-primary" : "rounded-md border border-edge px-4 py-2 text-xs font-medium text-ink-secondary"}>{value === "text" ? "Dán văn bản" : "Tải tệp"}</button>)}</div>
      {mode === "text" ? <label className="block text-xs font-semibold text-ink-secondary">Nội dung JD<textarea rows={14} maxLength={50000} disabled={Boolean(createdJd)} value={text} onChange={(event) => { setText(event.target.value); resetAttempt(); }} placeholder="Dán toàn bộ mô tả công việc…" className="mt-2 w-full resize-y rounded-lg border border-edge bg-canvas-subtle p-4 text-sm leading-6 outline-none focus:border-primary" /><span className="mt-1 block text-right text-[11px] text-ink-muted">{text.length}/50.000</span></label> : <label className="grid min-h-56 cursor-pointer place-items-center rounded-xl border border-dashed border-edge-strong bg-canvas-subtle p-8 text-center"><input className="sr-only" type="file" accept="application/pdf,image/png,image/jpeg" disabled={Boolean(createdJd)} onChange={(event) => { setFile(event.target.files?.[0] ?? null); resetAttempt(); }} /><span><FileArrowUp aria-hidden size={36} className="mx-auto text-primary" /><span className="mt-3 block text-sm font-medium text-ink">{file?.name ?? "Chọn PDF, PNG hoặc JPEG"}</span><span className="mt-1 block text-xs text-ink-muted">Magic bytes sẽ được kiểm tra; tên file không quyết định định dạng.</span></span></label>}
      <button disabled={!canSubmit || creation.isPending || extraction.isPending || Boolean(createdJd)} onClick={submit} className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-on-primary disabled:opacity-50">{(creation.isPending || extraction.isPending) && <SpinnerGap aria-hidden size={17} className="animate-spin" />}{extraction.isPending ? "Đang bắt đầu trích xuất…" : "Tiếp tục kiểm tra văn bản"}</button>
    </div>
  </main></div>;
}
