import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, WarningCircle, X } from '@phosphor-icons/react'
import AuthNavbar from '@/shared/components/AuthNavbar'
import { BOOKINGS } from '@/shared/data/mock'

export default function MentorBookingDetail() {
  const navigate = useNavigate()
  const booking = BOOKINGS[1]
  const [action, setAction] = useState<null | 'accept' | 'reject' | 'reschedule' | 'conflict'>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [done, setDone] = useState<null | 'accepted' | 'rejected'>(null)

  if (done) {
    return (
      <div className="min-h-screen bg-canvas">
        <AuthNavbar />
        <div className="max-w-[500px] mx-auto px-6 py-20 text-center">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6 ${done === 'accepted' ? 'bg-ok-soft border-2 border-ok' : 'bg-danger-soft border-2 border-danger'}`}>
            {done === 'accepted'
              ? <Check aria-hidden size={25} weight="bold" className="text-ok" />
              : <X aria-hidden size={25} weight="bold" className="text-danger" />
            }
          </div>
          <h1 className="text-[22px] font-semibold text-ink mb-2">{done === 'accepted' ? 'Đã chấp nhận!' : 'Đã từ chối'}</h1>
          <p className="text-sm text-ink-secondary mb-6">{done === 'accepted' ? 'Slot đã được khóa. Học viên sẽ nhận thông báo.' : 'Học viên sẽ được thông báo và có thể tìm mentor khác.'}</p>
          <button onClick={() => navigate('/mentor/bookings')} className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"><ArrowLeft aria-hidden size={14} /> Quay lại inbox</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-canvas">
      <AuthNavbar />

      <div className="max-w-[760px] mx-auto px-6 py-8">
        <div className="flex items-center gap-2 text-xs text-ink-muted mb-6">
          <button onClick={() => navigate('/mentor/bookings')} className="hover:text-ink transition-colors">Lịch đặt</button>
          <span>/</span>
          <span>{booking.id}</span>
        </div>

        <h1 className="text-[22px] font-semibold text-ink mb-6">Yêu cầu đặt lịch</h1>

        {/* Booking conflict demo */}
        {action === 'conflict' && (
          <div className="bg-danger-soft border border-danger/20 rounded-xl p-5 mb-6">
            <div className="flex items-start gap-3">
              <WarningCircle aria-hidden size={20} className="mt-0.5 shrink-0 text-danger" />
              <div>
                <p className="text-sm font-semibold text-danger mb-1">Slot vừa bị đặt bởi yêu cầu khác</p>
                <p className="text-xs text-ink-secondary mb-3">Thứ Ba, 09:00 – 10:00 không còn khả dụng. Vui lòng chọn slot khác.</p>
                <button onClick={() => setAction(null)} className="text-xs bg-primary hover:bg-primary-hover text-on-primary font-medium px-4 py-2 rounded-lg transition-colors">Chọn slot khác</button>
              </div>
            </div>
          </div>
        )}

        {/* Student request summary */}
        <div className="bg-panel border border-edge rounded-xl p-6 mb-5">
          <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-4">Yêu cầu từ học viên</p>
          <div className="space-y-3">
            {[
              { label: 'Học viên', value: booking.studentName },
              { label: 'Vị trí ứng tuyển', value: 'Frontend Intern tại VNG' },
              { label: 'Loại phỏng vấn', value: booking.interviewType },
              { label: 'Mục tiêu', value: booking.goal },
              { label: 'Slot yêu cầu', value: `${booking.date} · ${booking.time} · ${booking.timezone}` },
              { label: 'Thời lượng', value: `${booking.duration} phút` },
            ].map(r => (
              <div key={r.label} className="flex gap-4">
                <span className="text-xs text-ink-muted w-28 shrink-0">{r.label}</span>
                <span className="text-sm text-ink-secondary">{r.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="bg-panel border border-edge rounded-xl p-6">
          <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-4">Phản hồi</p>

          {action === 'reject' ? (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-ink-secondary mb-1.5">Lý do từ chối <span className="text-accent">*</span></label>
                <select value={rejectReason} onChange={e => setRejectReason(e.target.value)}
                  className="w-full bg-canvas-subtle border border-edge rounded-lg px-4 py-2.5 text-sm focus:border-primary outline-none">
                  <option value="">Chọn lý do</option>
                  <option>Lịch xung đột</option>
                  <option>Chuyên môn không phù hợp với yêu cầu</option>
                  <option>Không thể đảm nhận thêm buổi trong tuần này</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setAction(null)} className="flex-1 border border-edge text-ink-secondary font-medium py-2.5 rounded-lg text-sm hover:border-primary transition-colors">Quay lại</button>
                <button onClick={() => { if (rejectReason) setDone('rejected') }} disabled={!rejectReason}
                  className="flex-1 bg-danger hover:opacity-90 text-on-primary font-medium py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50">
                  Xác nhận từ chối
                </button>
              </div>
            </div>
          ) : action === 'accept' ? (
            <div className="space-y-3">
              <div className="p-4 bg-ok-soft border border-ok/20 rounded-lg text-sm text-ink-secondary">
                <p className="font-semibold text-ink mb-1">Xác nhận chấp nhận</p>
                <p>Slot <strong>{booking.date} · {booking.time}</strong> sẽ được khóa. Các yêu cầu khác cùng slot sẽ bị từ chối tự động.</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setAction(null)} className="flex-1 border border-edge text-ink-secondary font-medium py-2.5 rounded-lg text-sm hover:border-primary transition-colors">Quay lại</button>
                <button onClick={() => setDone('accepted')} className="flex-1 bg-primary hover:bg-primary-hover text-on-primary font-medium py-2.5 rounded-lg text-sm transition-colors">
                  Xác nhận chấp nhận
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-3 flex-wrap">
              <button onClick={() => setAction('accept')} className="flex-1 bg-primary hover:bg-primary-hover text-on-primary font-medium px-5 py-2.5 rounded-lg text-sm transition-colors">
                Chấp nhận
              </button>
              <button onClick={() => setAction('reschedule')} className="flex-1 border border-edge text-ink-secondary hover:border-primary hover:text-primary font-medium px-5 py-2.5 rounded-lg text-sm transition-colors">
                Đề xuất lịch khác
              </button>
              <button onClick={() => setAction('reject')} className="flex-1 border border-edge text-danger/60 hover:border-danger hover:text-danger font-medium px-5 py-2.5 rounded-lg text-sm transition-colors">
                Từ chối
              </button>
            </div>
          )}

          <button onClick={() => setAction('conflict')} className="mt-3 text-[11px] text-ink-muted hover:text-ink transition-colors">
            <span className="inline-flex items-center gap-1">Demo: Xem trạng thái conflict <ArrowRight aria-hidden size={12} /></span>
          </button>
        </div>
      </div>
    </div>
  )
}
