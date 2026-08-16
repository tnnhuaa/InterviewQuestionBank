import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from '@phosphor-icons/react'
import AuthNavbar from '@/shared/components/AuthNavbar'
import { BOOKINGS } from '@/shared/data/mock'

export default function MentorSessionDetail() {
  const navigate = useNavigate()
  const booking = BOOKINGS[0]
  const [sessionDone, setSessionDone] = useState(false)
  const [noShow, setNoShow] = useState(false)

  return (
    <div className="min-h-screen bg-canvas">
      <AuthNavbar />

      <div className="max-w-[760px] mx-auto px-6 py-8">
        <h1 className="text-[22px] font-semibold text-ink mb-6">Chi tiết buổi phỏng vấn</h1>

        <div className="space-y-5">
          {/* Session info */}
          <div className="bg-panel border border-edge rounded-xl p-6">
            <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-4">Thông tin buổi</p>
            <div className="space-y-2.5">
              {[
                { label: 'Học viên', value: `${booking.studentName} (ẩn danh với công chúng)` },
                { label: 'Mục tiêu', value: booking.goal },
                { label: 'Loại phỏng vấn', value: booking.interviewType },
                { label: 'Chủ đề', value: booking.topic },
                { label: 'Ngày/giờ', value: `${booking.date} · ${booking.time} · ${booking.timezone}` },
                { label: 'Thời lượng', value: `${booking.duration} phút` },
              ].map(r => (
                <div key={r.label} className="flex gap-4">
                  <span className="text-xs text-ink-muted w-28 shrink-0">{r.label}</span>
                  <span className="text-sm text-ink-secondary">{r.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Meeting link */}
          <div className="bg-primary-soft border border-primary/20 rounded-xl p-5">
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Link tham gia</p>
            <div className="flex items-center gap-3 bg-panel/60 rounded-lg px-4 py-2.5 border border-primary/10">
              <span className="text-sm text-ink-secondary flex-1 truncate">meet.google.com/abc-defg-hij</span>
              <button className="text-xs text-primary font-medium hover:underline shrink-0">Sao chép</button>
            </div>
            <p className="text-[11px] text-primary/60 mt-2">Link chỉ hiển thị với bạn và học viên đã được xác nhận.</p>
          </div>

          {/* Preparation note */}
          <div className="bg-panel border border-edge rounded-xl p-5">
            <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-2">Ghi chú chuẩn bị của học viên</p>
            <p className="text-sm text-ink-secondary italic">"{booking.goal}"</p>
          </div>

          {/* Post-session actions */}
          {!sessionDone && !noShow ? (
            <div className="bg-panel border border-edge rounded-xl p-5">
              <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-3">Sau buổi phỏng vấn</p>
              <div className="flex gap-3 flex-wrap">
                <button onClick={() => setSessionDone(true)} className="flex-1 bg-primary hover:bg-primary-hover text-on-primary font-medium px-5 py-2.5 rounded-lg text-sm transition-colors">
                  Đánh dấu hoàn thành
                </button>
                <button onClick={() => setNoShow(true)} className="border border-edge text-ink-secondary hover:border-danger hover:text-danger font-medium px-5 py-2.5 rounded-lg text-sm transition-colors">
                  Học viên không xuất hiện
                </button>
              </div>
              <p className="text-[11px] text-ink-muted mt-3">Feedback chỉ có thể gửi sau khi buổi được đánh dấu hoàn thành.</p>
            </div>
          ) : sessionDone ? (
            <div className="space-y-3">
              <div className="bg-ok-soft border border-ok/20 rounded-xl p-5">
                <p className="text-sm font-semibold text-ink mb-1">Buổi đã hoàn thành</p>
                <p className="text-xs text-ink-secondary">Bạn có thể gửi feedback cho học viên ngay bây giờ.</p>
              </div>
              <button onClick={() => navigate('/mentor/feedback/BK-2024-001')} className="w-full bg-primary hover:bg-primary-hover text-on-primary font-medium px-6 py-3 rounded-lg text-sm transition-colors">
                <span className="inline-flex items-center gap-1">Viết feedback <ArrowRight aria-hidden size={14} /></span>
              </button>
            </div>
          ) : (
            <div className="bg-notice-soft border border-notice/20 rounded-xl p-5">
              <p className="text-sm font-semibold text-ink mb-1">Học viên không xuất hiện</p>
              <p className="text-xs text-ink-secondary">Đã ghi nhận no-show. Team PrepVI sẽ xem xét và liên hệ nếu cần.</p>
            </div>
          )}

          {/* Support */}
          <div className="text-center py-2">
            <button className="text-xs text-ink-muted hover:text-ink transition-colors">Báo cáo sự cố với buổi phỏng vấn này</button>
          </div>
        </div>
      </div>
    </div>
  )
}
