import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import { mentorsApi } from "@/shared/api/resources";
import AuthNavbar from "@/shared/components/AuthNavbar";
import ErrorPanel from "@/shared/components/ErrorPanel";

const ALLOWED_TYPES = new Set(["application/pdf", "image/png", "image/jpeg"]);
const MAX_SIZE = 10 * 1024 * 1024;

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MentorVerification() {
  const queryClient = useQueryClient();
  const profile = useQuery({ queryKey: ["mentor-profile"], queryFn: mentorsApi.ownProfile, retry: false });
  const [file, setFile] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: () => {
      return mentorsApi.submitVerification({ evidence: file!, profileVersion: profile.data!.version });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mentor-profile"] });
      setFile(null);
      setConsent(false);
    },
  });

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0] ?? null;
    setFileError(null);
    if (!selected) { setFile(null); return; }
    if (!ALLOWED_TYPES.has(selected.type)) {
      setFileError("Chỉ chấp nhận PDF, PNG hoặc JPEG.");
      setFile(null);
      return;
    }
    if (selected.size > MAX_SIZE) {
      setFileError(`Tệp quá lớn (${formatBytes(selected.size)}). Tối đa 10 MB.`);
      setFile(null);
      return;
    }
    setFile(selected);
  }

  if (profile.isLoading) {
    return <div className="min-h-screen bg-canvas"><AuthNavbar /><main className="mx-auto max-w-[700px] px-6 py-8"><p className="text-sm text-ink-muted">Đang tải hồ sơ…</p></main></div>;
  }

  if (profile.error || !profile.data) {
    return (
      <div className="min-h-screen bg-canvas">
        <AuthNavbar />
        <main className="mx-auto max-w-[700px] px-6 py-8">
          <h1 className="text-[22px] font-semibold text-ink">Xác minh Mentor</h1>
          {profile.error && <div className="mt-5"><ErrorPanel error={profile.error} /></div>}
          <div className="mt-6 rounded-xl border border-edge bg-panel p-6 text-center">
            <p className="text-sm text-ink-secondary">Bạn cần hoàn thiện hồ sơ Mentor trước khi gửi xác minh.</p>
            <Link to="/mentor/onboarding" className="mt-4 inline-block rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-on-primary">Hoàn thiện hồ sơ</Link>
          </div>
        </main>
      </div>
    );
  }

  const status = profile.data.verificationStatus;
  const latest = profile.data.latestVerification;

  return (
    <div className="min-h-screen bg-canvas">
      <AuthNavbar />
      <main className="mx-auto max-w-[700px] px-6 py-8">
        <h1 className="text-[22px] font-semibold text-ink">Xác minh Mentor</h1>
        <p className="mt-1 text-sm text-ink-secondary">Bằng chứng là dữ liệu restricted; chỉ Admin có quyền mới tải được.</p>

        {mutation.error && <div className="mt-5"><ErrorPanel error={mutation.error} /></div>}

        <div className="mt-6 rounded-xl border border-edge bg-panel p-6">

          {/* DRAFT */}
          {status === "DRAFT" && (
            <>
              <p className="text-sm font-semibold text-ink">Trạng thái: Chưa gửi xác minh</p>
              <label className="mt-5 block rounded-lg border border-dashed border-edge p-6 text-center text-sm text-ink-secondary cursor-pointer">
                <input type="file" accept="application/pdf,image/png,image/jpeg" className="sr-only" onChange={handleFileChange} />
                {file ? <span className="text-ink">{file.name} ({formatBytes(file.size)})</span> : "Chọn PDF, PNG hoặc JPEG (tôi đa 10 MB)"}
              </label>
              {fileError && <p className="mt-2 text-xs text-danger">{fileError}</p>}
              <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-lg bg-canvas-subtle p-4 text-xs leading-5 text-ink-secondary">
                <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-1 accent-primary" />
                <span>Toi dong y xu ly bang chung xac minh de kiem tra tinh chinh xac cua ho so Mentor. Bang chung duoc xep loai restricted va chi Admin moi co quyen truy cap.</span>
              </label>
              <button
                disabled={mutation.isPending || !file || !consent}
                onClick={() => mutation.mutate()}
                className="mt-5 w-full rounded-lg bg-primary px-5 py-3 text-sm font-medium text-on-primary disabled:opacity-50"
              >
                {mutation.isPending ? "Đang gửi…" : "Gửi xét duyệt"}
              </button>
            </>
          )}

          {/* PENDING */}
          {status === "PENDING" && (
            <>
              <p className="text-sm font-semibold text-ink">Trạng thái: Đang chờ xét duyệt</p>
              {latest?.submittedAt && <p className="mt-2 text-xs text-ink-secondary">Đã gửi: {new Date(latest.submittedAt).toLocaleString("vi-VN")}</p>}
              <p className="mt-4 text-sm text-ink-secondary">Hồ sơ và bằng chứng dang duoc Admin xem xet.</p>
              <p className="mt-1 text-sm text-ink-secondary">Ban chua the cong khai ho sach hoac mo lich truoc khi duoc duyet.</p>
            </>
          )}

          {/* REJECTED */}
          {status === "REJECTED" && (
            <>
              <p className="text-sm font-semibold text-ink">Trạng thái: Chua duoc chap nhan</p>
              {latest?.decisionReason && (
                <div className="mt-3 rounded-lg bg-canvas-subtle p-4">
                  <p className="text-xs font-semibold text-ink-secondary">Ly do:</p>
                  <p className="mt-1 text-sm text-ink">{latest.decisionReason}</p>
                </div>
              )}
              <Link to="/mentor/profile/edit" className="mt-5 inline-block rounded-lg border border-edge px-4 py-2 text-sm font-medium text-ink hover:bg-canvas-subtle">Chinh sua ho so</Link>
              <label className="mt-5 block rounded-lg border border-dashed border-edge p-6 text-center text-sm text-ink-secondary cursor-pointer">
                <input type="file" accept="application/pdf,image/png,image/jpeg" className="sr-only" onChange={handleFileChange} />
                {file ? <span className="text-ink">{file.name} ({formatBytes(file.size)})</span> : "Chon bang chung moi (PDF, PNG hoac JPEG, toi da 10 MB)"}
              </label>
              {fileError && <p className="mt-2 text-xs text-danger">{fileError}</p>}
              <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-lg bg-canvas-subtle p-4 text-xs leading-5 text-ink-secondary">
                <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-1 accent-primary" />
                <span>Toi dong y xu ly bang chung xac minh de kiem tra tinh chinh xac cua ho so Mentor. Bang chung duoc xep loai restricted va chi Admin moi co quyen truy cap.</span>
              </label>
              <button
                disabled={mutation.isPending || !file || !consent}
                onClick={() => mutation.mutate()}
                className="mt-5 w-full rounded-lg bg-primary px-5 py-3 text-sm font-medium text-on-primary disabled:opacity-50"
              >
                {mutation.isPending ? "Đang gửi…" : "Gửi lại"}
              </button>
            </>
          )}

          {/* APPROVED */}
          {status === "APPROVED" && (
            <>
              <p className="text-sm font-semibold text-ink">Trạng thái: Da xac minh</p>
              <p className="mt-4 text-sm text-ink-secondary">Ho so Mentor cua ban da duoc duyet.</p>
              <div className="mt-5 flex gap-3">
                <Link to="/mentor/profile/edit" className="rounded-lg border border-edge px-4 py-2 text-sm font-medium text-ink hover:bg-canvas-subtle">Quan ly ho so</Link>
                <Link to="/mentor/availability" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary">Thiet lap lich ranh</Link>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
