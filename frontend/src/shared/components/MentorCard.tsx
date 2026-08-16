import { useNavigate } from 'react-router-dom'
import { ArrowRight, Check, SealCheck, Star } from '@phosphor-icons/react'
import type { Mentor } from '@/shared/data/mock'

interface MentorCardProps {
  mentor: Mentor
  compact?: boolean
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} aria-hidden size={12} weight="fill" className={i <= Math.round(rating) ? 'text-notice' : 'text-edge-strong'} />
      ))}
    </div>
  )
}

export default function MentorCard({ mentor, compact = false }: MentorCardProps) {
  const navigate = useNavigate()

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-4 border border-edge rounded-lg hover:border-primary/30 hover:bg-primary-soft/20 transition-all cursor-pointer" onClick={() => navigate(`/mentors/${mentor.id}`)}>
        <div className="w-10 h-10 rounded-full overflow-hidden bg-canvas-subtle shrink-0">
          <img src={mentor.avatar} alt={mentor.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <p className="text-sm font-semibold text-ink truncate">{mentor.name}</p>
            {mentor.verified && (
              <SealCheck aria-hidden size={15} weight="fill" className="text-primary" />
            )}
          </div>
          <p className="text-xs text-ink-muted truncate">{mentor.role} · {mentor.company}</p>
          <div className="flex items-center gap-2 mt-1">
            <StarRating rating={mentor.rating} />
            <span className="text-[10px] text-ink-muted">{mentor.rating} ({mentor.reviewCount})</span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1 text-[11px] font-medium text-primary">Xem <ArrowRight aria-hidden size={12} /></div>
      </div>
    )
  }

  return (
    <div className="border border-edge rounded-xl p-6 hover:border-primary/30 hover:shadow-sm transition-all bg-panel">
      <div className="flex gap-5">
        <div className="shrink-0">
          <div className="relative">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-canvas-subtle">
              <img src={mentor.avatar} alt={mentor.name} className="w-full h-full object-cover" />
            </div>
            {mentor.verified && (
              <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-primary rounded-full flex items-center justify-center border-2 border-panel" title="Mentor đã được xác minh">
                <Check aria-hidden size={11} weight="bold" />
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="text-[15px] font-semibold text-ink">{mentor.name}</h3>
                {mentor.verified && <span className="text-[10px] text-primary font-semibold border border-primary/30 rounded px-1.5 py-0.5 bg-primary-soft">Verified</span>}
              </div>
              <p className="text-sm text-ink-secondary">{mentor.role} · {mentor.company}</p>
              <p className="text-xs text-ink-muted mt-0.5">{mentor.experience} · {mentor.timezone}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1.5 justify-end mb-0.5">
                <StarRating rating={mentor.rating} />
                <span className="text-sm font-semibold text-ink">{mentor.rating}</span>
                <span className="text-xs text-ink-muted">({mentor.reviewCount} đánh giá)</span>
              </div>
              <p className="text-xs text-ink-muted">{mentor.sessionCount} buổi đã thực hiện</p>
            </div>
          </div>
          <p className="text-sm text-ink-secondary mt-3 leading-relaxed line-clamp-2">{mentor.bio}</p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {mentor.expertise.map(e => (
              <span key={e} className="text-xs px-2 py-0.5 rounded-full bg-canvas-subtle text-ink-secondary border border-edge">{e}</span>
            ))}
            {mentor.languages.map(l => (
              <span key={l} className="text-xs px-2 py-0.5 rounded-full bg-canvas text-ink-muted border border-edge">{l}</span>
            ))}
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-edge flex-wrap gap-3">
            <div>
              <p className="text-xs text-ink-muted">Slot gần nhất</p>
              <p className="text-sm font-medium text-ink">{mentor.nextAvailable}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => navigate(`/mentors/${mentor.id}`)} className="text-sm px-4 py-1.5 border border-edge rounded-md text-ink-secondary hover:border-primary hover:text-primary transition-colors font-medium">
                Xem hồ sơ
              </button>
              <button onClick={() => navigate(`/mentors/${mentor.id}`)} className="text-sm px-4 py-1.5 bg-primary hover:bg-primary-hover text-on-primary rounded-md font-medium transition-colors">
                Xem lịch
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
