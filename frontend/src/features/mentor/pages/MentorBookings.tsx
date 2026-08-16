import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from '@phosphor-icons/react'
import AuthNavbar from '@/shared/components/AuthNavbar'
import StatusBadge from '@/shared/components/StatusBadge'
import { BOOKINGS } from '@/shared/data/mock'

type Tab = 'pending' | 'upcoming' | 'completed' | 'cancelled'

const TABS: { value: Tab; label: string; count: number }[] = [
  { value: 'pending', label: 'Chờ xác nhận', count: 1 },
  { value: 'upcoming', label: 'Sắp tới', count: 1 },
  { value: 'completed', label: 'Hoàn thành', count: 3 },
  { value: 'cancelled', label: 'Đã hủy', count: 0 },
]

export default function MentorBookings() {
  const [tab, setTab] = useState<Tab>('pending')
  const navigate = useNavigate()

  const rows = tab === 'pending' ? [BOOKINGS[1]] : tab === 'upcoming' ? [BOOKINGS[0]] : tab === 'completed' ? BOOKINGS : []

  return (
    <div className="min-h-screen bg-canvas">
      <AuthNavbar />

      <div className="max-w-[1100px] mx-auto px-6 py-8">
        <h1 className="text-[22px] font-semibold text-ink mb-6">Lịch đặt</h1>

        {/* Tabs */}
        <div className="flex gap-0 border-b border-edge mb-6">
          {TABS.map(t => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                tab === t.value ? 'border-primary text-primary' : 'border-transparent text-ink-secondary hover:text-ink'
              }`}
            >
              {t.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                t.value === 'pending' && t.count > 0 ? 'bg-notice-soft text-notice-ink' : 'bg-canvas-subtle text-ink-muted'
              }`}>
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {rows.length === 0 ? (
          <div className="text-center py-16 text-sm text-ink-muted">Không có đặt lịch nào trong mục này.</div>
        ) : (
          <div className="space-y-3">
            {rows.map(booking => {
              const isPending = booking.status === 'pending'
              return (
                <div
                  key={booking.id}
                  className={`border rounded-xl p-5 cursor-pointer hover:shadow-sm transition-all ${
                    isPending ? 'border-notice/30 bg-notice-soft/30 hover:border-notice/60' : 'border-edge bg-panel hover:border-primary/30'
                  }`}
                  onClick={() => navigate(`/mentor/bookings/${booking.id}`)}
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-ink">{booking.studentName}</p>
                        <StatusBadge status={booking.status} size="sm" />
                        {isPending && <span className="text-[10px] font-semibold text-notice-ink bg-notice-soft px-1.5 py-0.5 rounded">Cần phản hồi</span>}
                      </div>
                      <p className="text-xs text-ink-muted mb-2">
                        {booking.interviewType} · {booking.date} · {booking.time}
                      </p>
                      <p className="text-sm text-ink-secondary line-clamp-1">{booking.goal}</p>
                      <div className="flex gap-1.5 mt-2 flex-wrap">
                        {booking.topic.split(' ').slice(0, 3).map(t => (
                          <span key={t} className="text-[10px] px-1.5 py-0.5 rounded-full bg-canvas-subtle text-ink-muted border border-edge">{t}</span>
                        ))}
                      </div>
                    </div>
                    <div className="shrink-0 flex flex-col items-end gap-2">
                      <button
                        onClick={e => { e.stopPropagation(); navigate(`/mentor/bookings/${booking.id}`) }}
                        className={`text-xs font-medium px-3 py-1.5 rounded-md transition-colors ${
                          isPending ? 'bg-primary text-on-primary hover:bg-primary-hover' : 'border border-edge text-ink-secondary hover:border-primary hover:text-primary'
                        }`}
                      >
                        <span className="inline-flex items-center gap-1">{isPending ? 'Xem & phản hồi' : 'Xem chi tiết'} <ArrowRight aria-hidden size={12} /></span>
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
