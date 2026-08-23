import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { bookingsApi } from "@/shared/api/resources";
import AuthNavbar from "@/shared/components/AuthNavbar";
import ErrorPanel from "@/shared/components/ErrorPanel";
import MeetingRecoveryPanel from "@/shared/components/MeetingRecoveryPanel";

export default function MentorSessionDetail() {
  const { sessionId = "" } = useParams();
  const queryClient = useQueryClient();
  const [url, setUrl] = useState("");
  const [recoveryExpired, setRecoveryExpired] = useState(false);
  const booking = useQuery({
    queryKey: ["booking", sessionId],
    queryFn: () => bookingsApi.get(sessionId),
    enabled: Boolean(sessionId),
  });
  const mutation = useMutation({
    mutationFn: () => bookingsApi.meetingLink(sessionId, {
      url,
      version: booking.data?.meetingLinkVersion,
    }),
    onSuccess: async () => {
      setUrl("");
      await queryClient.invalidateQueries({ queryKey: ["booking", sessionId] });
    },
  });
  const policy = booking.data?.meetingLinkPolicy;
  const recoveryDeadline = booking.data?.meetingRecovery?.deadline;
  const markRecoveryExpired = useCallback(() => setRecoveryExpired(true), []);

  useEffect(() => {
    setRecoveryExpired(Boolean(recoveryDeadline && new Date(recoveryDeadline).getTime() <= Date.now()));
  }, [recoveryDeadline]);

  return (
    <div className="min-h-screen bg-canvas">
      <AuthNavbar />
      <main className="mx-auto max-w-[720px] px-6 py-8">
        <h1 className="text-[22px] font-semibold text-ink">Phòng phỏng vấn</h1>
        <p className="mt-1 text-sm text-ink-secondary">Link được mã hóa và chỉ hai người tham gia xem trong cửa sổ hợp lệ.</p>
        {booking.error || mutation.error ? (
          <div className="mt-5"><ErrorPanel error={booking.error || mutation.error} onRetry={booking.error ? () => booking.refetch() : undefined} /></div>
        ) : null}
        {booking.isLoading ? <p className="mt-6 text-sm text-ink-muted">Đang tải buổi phỏng vấn…</p> : null}
        {booking.data ? (
          <>
            <section className="mt-6 rounded-xl border border-edge bg-panel p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-ink-muted">Booking</p>
                  <p className="mt-1 font-mono text-sm font-semibold text-ink">{booking.data.id}</p>
                </div>
                <span className="text-xs font-semibold text-primary">{booking.data.status}</span>
              </div>
              <p className="mt-4 text-sm text-ink-secondary">{new Date(booking.data.startsAt).toLocaleString("vi-VN")}</p>
              {booking.data.meetingLink ? (
                <div className="mt-5 rounded-lg border border-edge bg-canvas-subtle p-4">
                  <p className="text-xs font-semibold text-ink-secondary">Link hiện tại · v{booking.data.meetingLinkVersion}</p>
                  <a href={booking.data.meetingLink} target="_blank" rel="noreferrer" className="mt-2 block break-all text-sm text-primary underline">{booking.data.meetingLink}</a>
                  {booking.data.meetingLinkUpdatedAt ? <p className="mt-2 text-xs text-ink-muted">Cập nhật: {new Date(booking.data.meetingLinkUpdatedAt).toLocaleString("vi-VN")}</p> : null}
                </div>
              ) : (
                <p className="mt-5 rounded-lg bg-canvas-subtle p-4 text-xs text-ink-secondary">Chưa có link đang khả dụng để hiển thị.</p>
              )}
            </section>

            {booking.data.meetingRecovery ? <MeetingRecoveryPanel recovery={booking.data.meetingRecovery} onExpired={markRecoveryExpired} /> : null}

            {policy?.canEdit && !recoveryExpired ? (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  if (!mutation.isPending) mutation.mutate();
                }}
                className="mt-5 rounded-xl border border-edge bg-panel p-6"
              >
                <label className="block text-xs font-semibold text-ink-secondary">
                  HTTPS meeting link mới
                  <input required type="url" pattern="https://.*" value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://meet.example.com/..." className="mt-1.5 w-full rounded-lg border border-edge px-4 py-2.5 text-sm" />
                </label>
                <button disabled={mutation.isPending || !url.startsWith("https://")} className="mt-4 w-full rounded-lg bg-primary px-5 py-3 text-sm font-medium text-on-primary disabled:opacity-50">
                  {mutation.isPending ? "Đang lưu…" : booking.data.meetingLinkVersion ? "Thay link" : "Lưu link"}
                </button>
                {mutation.isSuccess ? <p className="mt-3 text-xs font-medium text-ok">Link đã được lưu và Student đã nhận thông báo.</p> : null}
                {policy.editDeadline ? <p className="mt-3 text-xs text-ink-muted">Hạn chỉnh sửa thông thường: {new Date(policy.editDeadline).toLocaleString("vi-VN")}</p> : null}
              </form>
            ) : (
              <section className="mt-5 rounded-xl border border-edge bg-panel p-5">
                <h2 className="text-sm font-semibold text-ink">Không thể chỉnh sửa link</h2>
                <p className="mt-2 text-xs text-ink-secondary">
                  {policy?.state === "INVALID_BOOKING_STATE"
                    ? "Booking đã bị hủy, từ chối, no-show hoặc chưa được xác nhận."
                    : "Cửa sổ chỉnh sửa đã đóng. Nếu người tham gia báo link lỗi, cửa sổ thay link 15 phút sẽ được mở lại."}
                </p>
              </section>
            )}
          </>
        ) : null}
      </main>
    </div>
  );
}
