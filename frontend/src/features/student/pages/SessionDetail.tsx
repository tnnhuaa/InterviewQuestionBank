import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check } from '@phosphor-icons/react'
import AuthNavbar from '@/shared/components/AuthNavbar'
import StatusBadge from '@/shared/components/StatusBadge'
import { BOOKINGS, MENTORS } from '@/shared/data/mock'

export default function SessionDetail() {
  const navigate = useNavigate()
  const booking = BOOKINGS[0]
  const mentor = MENTORS[0]
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  const checklist = [
    { id: 'questions', label: 'Xem lại câu hỏi đã chọn để luyện' },
    { id: 'env', label: 'Kiểm tra micro, camera, và kết nối mạng' },
    { id: 'goals', label: 'Chuẩn bị mục tiêu và điểm muốn hỏi mentor' },
  ]

  return (
    <div className="min-h-screen bg-canvas">
      <AuthNavbar />

      <div className="max-w-[1100px] mx-auto px-6 py-8">
        <div className="flex gap-8">
          <div className="flex-1 min-w-0">
            {/* Hero */}
            <div className="bg-panel border border-edge rounded-xl p-6 mb-6">
              <div className="flex items-start justify-between gap-4 flex-wrap mb-5">
                <div>
                  <p className="text-xs text-ink-muted mb-1">Chủ đề</p>
                  <h1 className="text-[18px] font-semibold text-ink">{booking.topic}</h1>
                </div>
                <StatusBadge status={booking.status} />
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-canvas-subtle shrink-0">
                  <img src={mentor.avatar} alt={mentor.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">{mentor.name}</p>
                  <p className="text-xs text-ink-muted">{mentor.role} · {mentor.company}</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { label: 'Ngày', value: booking.date },
                  { label: 'Giờ', value: `${booking.time} ${booking.timezone}` },
                  { label: 'Còn', value: '3 ngày 14 giờ' },
                ].map(r => (
                  <div key={r.label} className="bg-canvas-subtle rounded-lg p-3 text-center">
                    <p className="text-[11px] text-ink-muted mb-0.5">{r.label}</p>
                    <p className="text-sm font-medium text-ink">{r.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Preparation checklist */}
            <div className="bg-panel border border-edge rounded-xl p-6 mb-6">
              <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-4">Chuẩn bị trước buổi phỏng vấn</p>
              <div className="space-y-3">
                {checklist.map(item => (
                  <label key={item.id} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors shrink-0 ${checked[item.id] ? 'bg-primary border-primary' : 'border-edge group-hover:border-primary/50'}`} onClick={() => setChecked(p => ({ ...p, [item.id]: !p[item.id] }))}>
                      {checked[item.id] && (
                        <Check aria-hidden size={11} weight="bold" />
                      )}
                    </div>
                    <span className={`text-sm transition-colors ${checked[item.id] ? 'line-through text-ink-muted' : 'text-ink-secondary group-hover:text-ink'}`}>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Meeting card */}
            <div className="bg-primary-soft border border-primary/20 rounded-xl p-6 mb-6">
              <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">Tham gia buổi phỏng vấn</p>
              <p className="text-sm text-ink-secondary mb-4">Link tham gia sẽ xuất hiện 15 phút trước khi bắt đầu.</p>
              <div className="flex gap-3 flex-wrap">
                <button className="bg-primary hover:bg-primary-hover text-on-primary font-medium px-5 py-2.5 rounded-lg text-sm transition-colors">
                  Tham gia buổi phỏng vấn
                </button>
                <button className="border border-edge text-ink-secondary hover:border-primary hover:text-primary font-medium px-5 py-2.5 rounded-lg text-sm transition-colors">
                  Thêm vào lịch
                </button>
              </div>
              <p className="text-[11px] text-ink-muted mt-3">Buổi phỏng vấn sử dụng công cụ họp bên ngoài (Google Meet). PrepVI không cung cấp phòng họp tích hợp.</p>
            </div>

            {/* Session goals */}
            <div className="bg-panel border border-edge rounded-xl p-6">
              <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-4">Mục tiêu buổi luyện tập</p>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-ink-muted mb-0.5">Vị trí mục tiêu</p>
                  <p className="text-sm text-ink">Frontend Intern tại Shopee</p>
                </div>
                <div>
                  <p className="text-xs text-ink-muted mb-0.5">Mục tiêu</p>
                  <p className="text-sm text-ink">{booking.goal}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Support sidebar */}
          <aside className="hidden lg:block w-60 shrink-0">
            <div className="space-y-4">
              <div className="bg-panel border border-edge rounded-xl p-4">
                <p className="text-xs font-semibold text-ink mb-3">Hỗ trợ</p>
                <div className="space-y-2">
                  <button className="w-full text-left text-xs text-ink-secondary hover:text-ink py-1 transition-colors">Báo cáo sự cố</button>
                  <button onClick={() => navigate(`/bookings/${booking.id}`)} className="w-full text-left text-xs text-ink-secondary hover:text-ink py-1 transition-colors">Quy tắc no-show</button>
                  <button className="w-full text-left text-xs text-ink-secondary hover:text-ink py-1 transition-colors">Chính sách hủy lịch</button>
                </div>
              </div>
              <div className="bg-panel border border-edge rounded-xl p-4">
                <p className="text-xs font-semibold text-ink mb-2">Sau buổi phỏng vấn</p>
                <p className="text-xs text-ink-muted mb-3">Feedback sẽ được gửi trong vòng 48 giờ sau buổi hoàn thành.</p>
                <button disabled className="w-full bg-canvas-subtle text-ink-muted font-medium px-3 py-2 rounded-lg text-xs cursor-not-allowed">
                  Xem feedback (chưa có)
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
