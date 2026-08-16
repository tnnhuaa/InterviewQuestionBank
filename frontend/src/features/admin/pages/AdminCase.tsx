import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Info } from '@phosphor-icons/react'
import AuthNavbar from '@/shared/components/AuthNavbar'
import BookingTimeline from '@/shared/components/BookingTimeline'

const CASE_TIMELINE = [
  { actor: 'Học viên Bảo', role: 'student', timestamp: '15 tháng 3, 2025 · 18:30', description: 'Gửi yêu cầu đặt lịch.' },
  { actor: 'Phạm Thị Linh', role: 'mentor', timestamp: '15 tháng 3, 2025 · 19:00', description: 'Xác nhận lịch hẹn.' },
  { actor: 'Học viên Bảo', role: 'student', timestamp: '16 tháng 3, 2025 · 10:00', description: 'Báo cáo: Mentor không xuất hiện trong buổi phỏng vấn.' },
  { actor: 'System', role: 'system', timestamp: '16 tháng 3, 2025 · 10:05', description: 'Case được tự động tạo và đưa vào queue admin.' },
]

export default function AdminCase() {
  const navigate = useNavigate()
  const [internalNote, setInternalNote] = useState('')
  const [done, setDone] = useState(false)

  return (
    <div className="min-h-screen bg-canvas">
      <AuthNavbar />

      <div className="max-w-[1100px] mx-auto px-6 py-8">
        <div className="flex items-center gap-2 text-xs text-ink-muted mb-6">
          <button onClick={() => navigate('/admin')} className="hover:text-ink">Admin</button>
          <span>/</span>
          <span>Case Q-002</span>
        </div>

        <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
          <div>
            <h1 className="text-[22px] font-semibold text-ink">BK-2024-089 — Báo cáo no-show</h1>
            <div className="flex items-center gap-3 mt-1 text-xs flex-wrap">
              <span className="bg-danger-soft text-danger border border-danger/20 px-2 py-0.5 rounded-full font-medium">Report</span>
              <span className="text-ink-muted">Tạo: 16 tháng 3, 2025 · 10:05</span>
              <span className="text-ink-muted">Trạng thái: Đang mở</span>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          <div className="flex-1 space-y-5">
            {/* Case summary */}
            <div className="bg-panel border border-edge rounded-xl p-6">
              <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-4">Tóm tắt case</p>
              <div className="space-y-2.5">
                {[
                  { label: 'Loại case', value: 'No-show report' },
                  { label: 'Booking ID', value: 'BK-2024-089' },
                  { label: 'Học viên', value: 'Bảo (ẩn danh với công chúng)' },
                  { label: 'Mentor', value: 'Phạm Thị Linh' },
                  { label: 'Slot báo cáo', value: 'Thứ Sáu, 21 tháng 3, 2025 · 14:00' },
                  { label: 'Lý do báo cáo', value: 'Mentor không xuất hiện sau 15 phút.' },
                  { label: 'Chính sách liên quan', value: 'No-show Policy v1.2' },
                ].map(r => (
                  <div key={r.label} className="flex gap-4">
                    <span className="text-xs text-ink-muted w-32 shrink-0">{r.label}</span>
                    <span className="text-sm text-ink-secondary">{r.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-panel border border-edge rounded-xl p-6">
              <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-4">Timeline</p>
              <BookingTimeline events={CASE_TIMELINE} />
            </div>

            {/* Internal notes — visually distinct */}
            <div className="border-2 border-dashed border-edge-strong rounded-xl p-5 bg-canvas-subtle">
              <div className="flex items-center gap-2 mb-3">
                <Info aria-hidden size={16} className="text-ink-muted" />
                <p className="text-xs font-semibold text-ink-secondary uppercase tracking-wider">Ghi chú nội bộ — không hiển thị cho người dùng</p>
              </div>
              <textarea rows={3} placeholder="Thêm ghi chú nội bộ về case này..." value={internalNote} onChange={e => setInternalNote(e.target.value)}
                className="w-full bg-panel border border-edge-strong rounded-lg px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none resize-none" />
              <p className="text-[10px] text-ink-muted mt-1">Chỉ hiển thị với admin. Không bao giờ được gửi cho học viên hay mentor.</p>
            </div>
          </div>

          {/* Action panel */}
          <aside className="w-64 shrink-0">
            <div className="bg-panel border border-edge rounded-xl p-5 sticky top-20 space-y-3">
              <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider">Hành động</p>

              {done ? (
                <div className="text-center py-4">
                  <p className="text-sm font-medium text-ok mb-1">Đã xử lý</p>
                  <p className="text-xs text-ink-muted">Case được đóng và ghi log.</p>
                </div>
              ) : (
                <>
                  <button onClick={() => setDone(true)} className="w-full bg-primary hover:bg-primary-hover text-on-primary font-medium px-4 py-2.5 rounded-lg text-sm transition-colors">
                    Resolve case
                  </button>
                  <button className="w-full border border-edge text-ink-secondary hover:border-primary hover:text-primary font-medium px-4 py-2.5 rounded-lg text-sm transition-colors">
                    Ẩn đánh giá (placeholder)
                  </button>
                  <button className="w-full border border-edge text-ink-secondary hover:border-primary hover:text-primary font-medium px-4 py-2.5 rounded-lg text-sm transition-colors">
                    Đổi lịch (placeholder)
                  </button>
                  <button className="w-full border border-edge text-ink-secondary hover:border-primary hover:text-primary font-medium px-4 py-2.5 rounded-lg text-sm transition-colors">
                    Hoàn lịch (placeholder)
                  </button>
                  <p className="text-[10px] text-ink-muted">Mỗi hành động yêu cầu xác nhận và được ghi audit log.</p>
                </>
              )}

              <div className="border-t border-edge pt-3">
                <button onClick={() => navigate('/admin/audit/AUD-001')} className="inline-flex items-center gap-1 text-xs text-primary hover:underline">Xem audit log <ArrowRight aria-hidden size={12} /></button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
