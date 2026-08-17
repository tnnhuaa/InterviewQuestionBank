import { Copy, WarningCircle } from "@phosphor-icons/react";
import { useLocation } from "react-router-dom";
import { ApiError } from "@/shared/api/client";

const RECOVERY_LABELS: Record<string, string> = {
  RETRY_SAFE: "Bạn có thể thử lại an toàn.",
  EDIT_INPUT: "Kiểm tra các trường được đánh dấu rồi gửi lại.",
  REUPLOAD: "Chọn lại tệp đúng định dạng và giới hạn được hướng dẫn.",
  PASTE_TEXT: "Bạn có thể dán nội dung thủ công để tiếp tục.",
  SELECT_ANOTHER_SLOT: "Chọn một khung giờ còn trống khác.",
  WAIT: "Vui lòng chờ theo thời gian hiển thị rồi kiểm tra lại.",
  CONTACT_SUPPORT: "Cần người vận hành hỗ trợ; hãy gửi mã tham chiếu bên dưới.",
  NONE: "Không có thao tác tự khắc phục cho lỗi này.",
};

export default function ErrorPanel({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  const location = useLocation();
  const apiError = error instanceof ApiError ? error : null;
  const safeDetails = [
    `code=${apiError?.code ?? "UNEXPECTED_ERROR"}`,
    `timestamp=${new Date().toISOString()}`,
    `route=${location.pathname}`,
    `correlationId=${apiError?.correlationId ?? "unavailable"}`,
  ].join("\n");
  return (
    <div role="alert" className="rounded-xl border border-danger/20 bg-danger-soft p-5 text-sm text-ink">
      <div className="flex gap-3">
        <WarningCircle aria-hidden size={20} className="mt-0.5 shrink-0 text-danger" />
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{apiError?.message ?? "Đã có lỗi không mong đợi."}</p>
          <p className="mt-1 text-xs text-ink-secondary">{RECOVERY_LABELS[apiError?.recovery.kind ?? "NONE"]}</p>
          {apiError && Object.keys(apiError.fieldErrors).length > 0 ? <ul className="mt-3 space-y-1 rounded-md border border-danger/15 bg-panel/70 p-3">{Object.entries(apiError.fieldErrors).map(([field, message]) => <li key={field} className="text-xs text-ink-secondary"><span className="font-semibold text-danger">{field}:</span> {message}</li>)}</ul> : null}
          {apiError?.status === 429 && apiError.recovery.retryAfterSeconds && <p className="mt-1 text-xs text-ink-secondary">Thử lại sau {apiError.recovery.retryAfterSeconds} giây.</p>}
          <div className="mt-3 flex flex-wrap gap-2">
            {onRetry && apiError?.recovery.retryable && <button type="button" onClick={onRetry} className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-on-primary">Thử lại</button>}
            <button type="button" onClick={() => navigator.clipboard.writeText(safeDetails)} className="inline-flex items-center gap-1 rounded-md border border-edge bg-panel px-3 py-1.5 text-xs font-medium text-ink-secondary">
              <Copy aria-hidden size={13} /> Sao chép thông tin hỗ trợ
            </button>
          </div>
          {apiError?.correlationId && <p className="mt-3 break-all font-mono text-[11px] text-ink-muted">Reference: {apiError.correlationId}</p>}
        </div>
      </div>
    </div>
  );
}
