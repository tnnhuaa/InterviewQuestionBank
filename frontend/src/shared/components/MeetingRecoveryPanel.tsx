import { useEffect, useState, type ReactNode } from "react";

interface MeetingRecovery {
  summary: string;
  deadline: string;
}

function durationLabel(milliseconds: number) {
  if (milliseconds <= 0) return "Đã hết thời hạn";
  const totalSeconds = Math.ceil(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function MeetingRecoveryPanel({
  recovery,
  expiredAction,
  onExpired,
}: {
  recovery: MeetingRecovery;
  expiredAction?: ReactNode;
  onExpired?: () => void;
}) {
  const [now, setNow] = useState(Date.now());
  const deadline = new Date(recovery.deadline).getTime();
  const expired = now >= deadline;

  useEffect(() => {
    if (expired) return undefined;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [expired]);

  useEffect(() => {
    if (expired) onExpired?.();
  }, [expired, onExpired]);

  return (
    <section className="mt-5 rounded-xl border border-notice/30 bg-notice-soft p-5">
      <h2 className="text-sm font-semibold text-notice-ink">Khắc phục link phòng họp</h2>
      <p className="mt-2 text-xs text-ink-secondary">{recovery.summary}</p>
      <p className="mt-2 text-xs font-semibold text-notice-ink">
        {expired ? "Đã hết thời hạn thay link" : `Thời gian còn lại: ${durationLabel(deadline - now)}`}
      </p>
      <p className="mt-1 text-xs text-ink-muted">Hạn thay link: {new Date(recovery.deadline).toLocaleString("vi-VN")}</p>
      {expired ? expiredAction : null}
    </section>
  );
}
