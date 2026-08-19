import { FileArrowUp, SpinnerGap } from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jobDescriptionsApi } from "@/shared/api/resources";
import AuthNavbar from "@/shared/components/AuthNavbar";
import ErrorPanel from "@/shared/components/ErrorPanel";
import JDFlowStepper from "@/shared/components/JDFlowStepper";

export default function JDUpload() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"text" | "file">("text");
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const mutation = useMutation({ mutationFn: async () => {
    if (mode === "text") return jobDescriptionsApi.createFromText(text);
    return await jobDescriptionsApi.extractFromFile(file!);
  }, onSuccess: (jd) => navigate(`/job-descriptions/${jd.id}/review`) });
  const canSubmit = mode === "text" ? text.trim().length > 0 : Boolean(file);
  return <div className="min-h-screen bg-canvas"><AuthNavbar /><main className="mx-auto max-w-[900px] px-6 py-8"><JDFlowStepper currentStep={1} />
    <h1 className="mt-8 text-[22px] font-semibold text-ink">Thêm Job Description</h1><p className="mt-1 text-sm text-ink-secondary">Dán văn bản hoặc tải một PDF/PNG/JPEG. Tệp tối đa 10 MB; PDF tối đa 5 trang.</p>
    {mutation.error && <div className="mt-5"><ErrorPanel error={mutation.error} onRetry={() => mutation.mutate()} /></div>}
    <div className="mt-6 rounded-xl border border-edge bg-panel p-6">
      <div className="mb-5 flex gap-2">{(["text", "file"] as const).map((value) => <button key={value} onClick={() => setMode(value)} className={mode === value ? "rounded-md bg-primary px-4 py-2 text-xs font-medium text-on-primary" : "rounded-md border border-edge px-4 py-2 text-xs font-medium text-ink-secondary"}>{value === "text" ? "Dán văn bản" : "Tải tệp"}</button>)}</div>
      {mode === "text" ? <label className="block text-xs font-semibold text-ink-secondary">Nội dung JD<textarea rows={14} maxLength={50000} value={text} onChange={(event) => setText(event.target.value)} placeholder="Dán toàn bộ mô tả công việc…" className="mt-2 w-full resize-y rounded-lg border border-edge bg-canvas-subtle p-4 text-sm leading-6 outline-none focus:border-primary" /><span className="mt-1 block text-right text-[11px] text-ink-muted">{text.length}/50.000</span></label> : <label className="grid min-h-56 cursor-pointer place-items-center rounded-xl border border-dashed border-edge-strong bg-canvas-subtle p-8 text-center"><input className="sr-only" type="file" accept="application/pdf,image/png,image/jpeg" onChange={(event) => setFile(event.target.files?.[0] ?? null)} /><span><FileArrowUp aria-hidden size={36} className="mx-auto text-primary" /><span className="mt-3 block text-sm font-medium text-ink">{file?.name ?? "Chọn PDF, PNG hoặc JPEG"}</span><span className="mt-1 block text-xs text-ink-muted">Magic bytes sẽ được kiểm tra; tên file không quyết định định dạng.</span></span></label>}
      <button disabled={!canSubmit || mutation.isPending} onClick={() => mutation.mutate()} className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-on-primary disabled:opacity-50">{mutation.isPending && <SpinnerGap aria-hidden size={17} className="animate-spin" />}Tiếp tục kiểm tra văn bản</button>
    </div>
  </main></div>;
}
