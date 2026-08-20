import { SealCheck, Star } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import type { PublicMentor } from "@/shared/api/resources";

export default function MentorCard({ mentor, compact = false }: { mentor: PublicMentor; compact?: boolean }) {
  const next = mentor.nextSlots[0];
  return <article className={compact ? "rounded-lg border border-edge bg-panel p-4" : "rounded-xl border border-edge bg-panel p-6"}>
    <div className="flex items-start gap-4"><div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary-soft text-sm font-semibold text-primary">{mentor.displayName?.slice(0, 2).toUpperCase()}</div><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><h2 className="font-semibold text-ink">{mentor.displayName}</h2><SealCheck aria-label="Đã xác minh" size={16} weight="fill" className="text-primary" /></div><p className="mt-0.5 text-sm text-ink-secondary">{mentor.headline}</p><div className="mt-2 flex items-center gap-1 text-xs text-ink-muted"><Star aria-hidden size={13} weight="fill" className="text-notice" />{Number(mentor.publicRating || 0).toFixed(1)} · {mentor.timezone}</div>{!compact && <><p className="mt-3 line-clamp-2 text-sm leading-6 text-ink-secondary">{mentor.bio}</p><div className="mt-3 flex flex-wrap gap-1.5">{mentor.expertise.map((topic) => <span key={topic} className="rounded-full border border-edge bg-canvas-subtle px-2 py-0.5 text-xs text-ink-secondary">{topic}</span>)}</div></>}<div className="mt-4 flex items-center justify-between gap-3 border-t border-edge pt-4"><p className="text-xs text-ink-muted">{next ? `Slot gần nhất: ${new Date(next.startsAt).toLocaleString("vi-VN")}` : "Chưa có slot tương lai"}</p><Link to={`/mentors/${mentor.id}`} className="shrink-0 rounded-md bg-primary px-4 py-2 text-xs font-medium text-on-primary">Xem hồ sơ</Link></div></div></div>
  </article>;
}
