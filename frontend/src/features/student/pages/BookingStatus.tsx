import { useParams, useNavigate } from 'react-router-dom'
import { ArrowRight, Check } from '@phosphor-icons/react'
import AuthNavbar from '@/shared/components/AuthNavbar'
import StatusBadge from '@/shared/components/StatusBadge'
import BookingTimeline from '@/shared/components/BookingTimeline'
import { BOOKINGS, MENTORS } from '@/shared/data/mock'

export default function BookingStatus() {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  const booking = BOOKINGS.find(b => b.id === bookingId) || BOOKINGS[0]
  const mentor = MENTORS.find(m => m.id === booking.mentorId)!

  return (
    <div className="min-h-screen bg-canvas">
      <AuthNavbar />

      <div className="max-w-[760px] mx-auto px-6 py-8">
        {/* Top status */}
        <div className="bg-panel border border-edge rounded-xl p-6 mb-6">
          <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
            <div>
              <p className="text-xs text-ink-muted mb-1">Mã đặt lịch</p>
              <p className="text-sm font-mono font-semibold text-ink">{booking.id}</p>
            </div>
            <StatusBadge status={booking.status} />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-canvas-subtle shrink-0">
              <img src={mentor.avatar} alt={mentor.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">{mentor.name}</p>
              <p className="text-xs text-ink-muted">{mentor.role}</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-2">
            {[
              { label: 'Chủ đề', value: booking.topic },
              { label: 'Loại phỏng vấn', value: booking.interviewType },
              { label: 'Ngày', value: booking.date },
              { label: 'Giờ', value: `${booking.time} · ${booking.timezone}` },
            ].map(row => (
              <div key={row.label} className="flex justify-between text-xs p-2 bg-canvas-subtle rounded-lg">
                <span className="text-ink-muted">{row.label}</span>
                <span className="text-ink font-medium text-right max-w-[60%]">{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-[1fr_240px] gap-6">
          {/* Timeline */}
          <div className="bg-panel border border-edge rounded-xl p-6">
            <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-5">Lịch sử hoạt động</p>
            <BookingTimeline events={booking.timeline} />
          </div>

          {/* Contextual action panel */}
          <div className="space-y-4">
            {booking.status === 'confirmed' && (
              <div className="bg-ok-soft border border-ok/20 rounded-xl p-5">
                <div className="w-8 h-8 rounded-full bg-ok/20 flex items-center justify-center mb-3">
                  <Check aria-hidden size={17} weight="bold" className="text-ok" />
                </div>
                <p className="text-sm font-semibold text-ink mb-1">Đã xác nhận</p>
                <p className="text-xs text-ink-secondary mb-4">Chuẩn bị cho buổi phỏng vấn của bạn.</p>
                <button
                  onClick={() => navigate('/sessions/S-001')}
                  className="w-full bg-primary hover:bg-primary-hover text-on-primary font-medium px-4 py-2.5 rounded-lg text-sm transition-colors"
                >
                  <span className="inline-flex items-center gap-1.5">Xem buổi phỏng vấn <ArrowRight aria-hidden size={15} /></span>
                </button>
              </div>
            )}

            {booking.status === 'pending' && (
              <div className="bg-notice-soft border border-notice/20 rounded-xl p-5">
                <p className="text-sm font-semibold text-ink mb-1">Đang chờ xác nhận</p>
                <p className="text-xs text-ink-secondary mb-2">Mentor sẽ phản hồi trong vòng 24 giờ.</p>
                <button className="w-full border border-edge text-ink-secondary hover:border-danger hover:text-danger font-medium px-4 py-2 rounded-lg text-xs transition-colors mt-2">
                  Hủy yêu cầu
                </button>
              </div>
            )}

            {booking.status === 'reschedule-proposed' && (
              <div className="bg-accent-soft border border-accent/20 rounded-xl p-5">
                <p className="text-sm font-semibold text-ink mb-1">Mentor đề xuất đổi lịch</p>
                <p className="text-xs text-ink-secondary mb-3">Slot mới: <strong>Thứ Tư, 14:00</strong></p>
                <div className="space-y-2">
                  <button className="w-full bg-primary hover:bg-primary-hover text-on-primary font-medium px-4 py-2.5 rounded-lg text-sm transition-colors">
                    Chấp nhận
                  </button>
                  <button className="w-full border border-edge text-ink-secondary font-medium px-4 py-2 rounded-lg text-sm hover:border-primary hover:text-primary transition-colors">
                    Chọn lịch khác
                  </button>
                </div>
              </div>
            )}

            {booking.status === 'rejected' && (
              <div className="bg-danger-soft border border-danger/20 rounded-xl p-5">
                <p className="text-sm font-semibold text-ink mb-1">Yêu cầu không được chấp nhận</p>
                <p className="text-xs text-ink-secondary mb-4">Slot đã không còn khả dụng. Mentor đã hủy do lịch xung đột.</p>
                <button onClick={() => navigate('/mentors')} className="w-full bg-primary hover:bg-primary-hover text-on-primary font-medium px-4 py-2.5 rounded-lg text-sm transition-colors">
                  Quay lại tìm mentor
                </button>
              </div>
            )}

            <div className="bg-panel border border-edge rounded-xl p-4">
              <p className="text-xs font-semibold text-ink mb-2">Cần hỗ trợ?</p>
              <button className="inline-flex items-center gap-1 text-xs text-ink-secondary transition-colors hover:text-ink">Báo cáo sự cố <ArrowRight aria-hidden size={13} /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
