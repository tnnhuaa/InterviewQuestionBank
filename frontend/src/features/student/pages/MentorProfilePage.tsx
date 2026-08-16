import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Check, Star } from '@phosphor-icons/react'
import PublicNavbar from '@/shared/components/PublicNavbar'
import AuthNavbar from '@/shared/components/AuthNavbar'
import { MENTORS, REVIEWS } from '@/shared/data/mock'
import { useApp } from '@/app/AppContext'

const DAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
const SLOTS: Record<string, { time: string; available: boolean; held?: boolean }[]> = {
  T2: [{ time: '09:00', available: true }, { time: '14:00', available: false, held: true }],
  T3: [{ time: '09:00', available: true }, { time: '16:00', available: true }],
  T4: [{ time: '14:00', available: true }],
  T5: [{ time: '10:00', available: false }, { time: '15:00', available: true }],
  T6: [],
  T7: [{ time: '10:00', available: true }],
  CN: [],
}

export default function MentorProfilePage() {
  const { mentorId } = useParams()
  const { role } = useApp()
  const navigate = useNavigate()
  const mentor = MENTORS.find(m => m.id === mentorId) || MENTORS[0]
  const [selectedSlot, setSelectedSlot] = useState<{ day: string; time: string } | null>(null)
  const [showVerifyTooltip, setShowVerifyTooltip] = useState(false)

  return (
    <div className="min-h-screen bg-canvas">
      {role === 'public' ? <PublicNavbar /> : <AuthNavbar />}

      <div className="max-w-[1280px] mx-auto px-6 py-8">
        <div className="flex items-center gap-2 text-xs text-ink-muted mb-6">
          <Link to="/mentors" className="hover:text-ink transition-colors">Mentor</Link>
          <span>/</span>
          <span className="text-ink-secondary">{mentor.name}</span>
        </div>

        <div className="flex gap-8">
          {/* Main profile */}
          <div className="flex-1 min-w-0 max-w-[720px]">
            {/* Header */}
            <div className="flex gap-5 mb-8 pb-8 border-b border-edge">
              <div className="relative shrink-0">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-canvas-subtle">
                  <img src={mentor.avatar} alt={mentor.name} className="w-full h-full object-cover" />
                </div>
                {mentor.verified && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center border-2 border-canvas">
                    <Check aria-hidden size={12} weight="bold" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h1 className="text-[22px] font-semibold text-ink">{mentor.name}</h1>
                  {mentor.verified && (
                    <div className="relative">
                      <button
                        onMouseEnter={() => setShowVerifyTooltip(true)}
                        onMouseLeave={() => setShowVerifyTooltip(false)}
                        className="text-[10px] text-primary font-semibold border border-primary/30 rounded px-1.5 py-0.5 bg-primary-soft cursor-help"
                      >
                        Verified Mentor
                      </button>
                      {showVerifyTooltip && (
                        <div className="absolute left-0 top-full mt-2 w-56 bg-ink text-canvas-subtle text-xs rounded-lg p-3 z-30 shadow-lg">
                          Mentor đã được xác minh qua bằng chứng công việc, profile LinkedIn, và quy trình duyệt của PrepVI.
                          <div className="absolute -top-1 left-4 w-2 h-2 bg-ink rotate-45"/>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <p className="text-sm text-ink-secondary mb-0.5">{mentor.role} · {mentor.company}</p>
                <p className="text-xs text-ink-muted">{mentor.timezone} · {mentor.experience}</p>
                <div className="flex items-center gap-4 mt-3 flex-wrap">
                  <div className="flex items-center gap-1">
                    <Star aria-hidden size={14} weight="fill" className="text-notice" />
                    <span className="text-sm font-semibold text-ink">{mentor.rating}</span>
                    <span className="text-xs text-ink-muted">({mentor.reviewCount} đánh giá)</span>
                  </div>
                  <span className="text-xs text-ink-muted">{mentor.sessionCount} buổi hoàn thành</span>
                  {mentor.languages.map(l => (
                    <span key={l} className="text-xs px-2 py-0.5 rounded-full bg-canvas-subtle text-ink-secondary border border-edge">{l}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* About */}
            <section className="mb-8">
              <h2 className="text-base font-semibold text-ink mb-3">Giới thiệu</h2>
              <p className="text-sm text-ink-secondary leading-relaxed">{mentor.bio}</p>
            </section>

            {/* Can help */}
            <section className="mb-8">
              <h2 className="text-base font-semibold text-ink mb-3">Mentor này có thể giúp bạn</h2>
              <div className="grid sm:grid-cols-2 gap-2">
                {mentor.canHelp.map(h => (
                  <div key={h} className="flex items-center gap-2 p-3 bg-panel border border-edge rounded-lg text-sm text-ink-secondary">
                    <div className="w-1.5 h-1.5 rounded-full bg-ok shrink-0"/>
                    {h}
                  </div>
                ))}
              </div>
            </section>

            {/* Expertise chips */}
            <section className="mb-8">
              <h2 className="text-base font-semibold text-ink mb-3">Chuyên môn</h2>
              <div className="flex flex-wrap gap-2">
                {[...new Set([...mentor.expertise, ...mentor.interviewTypes])].map(e => (
                  <span key={e} className="text-xs px-3 py-1 rounded-full bg-canvas-subtle text-ink-secondary border border-edge">{e}</span>
                ))}
              </div>
            </section>

            {/* Reviews */}
            <section className="mb-8">
              <h2 className="text-base font-semibold text-ink mb-4">Đánh giá từ học viên</h2>
              <div className="space-y-4">
                {REVIEWS.map(r => (
                  <div key={r.id} className="p-4 bg-panel border border-edge rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-full bg-primary-soft text-primary text-xs font-semibold flex items-center justify-center">
                        {r.studentName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-ink">{r.studentName}</p>
                        <div className="flex items-center gap-0.5">
                          {[1,2,3,4,5].map(i => (
                            <Star key={i} aria-hidden size={11} weight="fill" className={i <= r.rating ? 'text-notice' : 'text-edge-strong'} />
                          ))}
                          <span className="text-[10px] text-ink-muted ml-1">{r.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-ink-secondary leading-relaxed">{r.comment}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sticky booking panel */}
          <aside className="hidden lg:block w-80 shrink-0">
            <div className="bg-panel border border-edge rounded-xl p-5 sticky top-20">
              <p className="text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-1">Đặt lịch luyện tập</p>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs text-ink-muted">60 phút · Video call</span>
                <span className="text-xs bg-canvas-subtle border border-edge px-2 py-0.5 rounded text-ink-muted">{mentor.timezone}</span>
              </div>

              {/* Calendar */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-ink mb-2">Tuần này</p>
                <div className="grid grid-cols-7 gap-0.5 mb-2">
                  {DAYS.map(d => (
                    <div key={d} className="text-[10px] text-ink-muted text-center py-1">{d}</div>
                  ))}
                </div>
                <div className="space-y-1">
                  {DAYS.map(day => {
                    const daySlots = SLOTS[day] || []
                    if (daySlots.length === 0) return null
                    return (
                      <div key={day} className="flex items-center gap-1.5">
                        <span className="text-[10px] text-ink-muted w-5">{day}</span>
                        <div className="flex gap-1 flex-wrap">
                          {daySlots.map(slot => (
                            <button
                              key={`${day}-${slot.time}`}
                              disabled={!slot.available}
                              onClick={() => setSelectedSlot({ day, time: slot.time })}
                              className={`text-[11px] px-2 py-1 rounded border font-medium transition-colors ${
                                selectedSlot?.day === day && selectedSlot?.time === slot.time
                                  ? 'bg-primary text-on-primary border-primary'
                                  : slot.held
                                  ? 'bg-canvas-subtle text-ink-muted border-edge cursor-not-allowed line-through'
                                  : !slot.available
                                  ? 'bg-canvas-subtle text-ink-muted border-edge cursor-not-allowed'
                                  : 'border-edge text-ink-secondary hover:border-primary hover:text-primary'
                              }`}
                            >
                              {slot.time}
                            </button>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {selectedSlot && (
                <div className="mb-4 p-3 bg-primary-soft border border-primary/20 rounded-lg text-xs text-primary">
                  <p className="font-semibold">Đã chọn: {selectedSlot.day}, {selectedSlot.time}</p>
                  <p className="text-primary/70 mt-0.5">{mentor.timezone} · 60 phút</p>
                </div>
              )}

              <p className="text-[11px] text-ink-muted mb-4 pb-3 border-b border-edge">
                Buổi phỏng vấn sử dụng công cụ họp bên ngoài (Google Meet / Zoom).
              </p>

              <button
                onClick={() => navigate('/bookings/new')}
                disabled={!selectedSlot}
                className="w-full bg-primary hover:bg-primary-hover text-on-primary font-medium px-4 py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {selectedSlot ? 'Chọn lịch này' : 'Chọn một khung giờ'}
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
