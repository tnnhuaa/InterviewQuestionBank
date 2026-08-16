import { useNavigate } from 'react-router-dom'
import { ArrowRight, LockSimple } from '@phosphor-icons/react'
import AuthNavbar from '@/shared/components/AuthNavbar'

export default function AdminAudit() {
  const navigate = useNavigate()

  const record = {
    id: 'AUD-001',
    type: 'Case Resolution',
    object: 'Case Q-002 / Booking BK-2024-089',
    actor: 'Admin (demo)',
    timestamp: '16 tháng 3, 2025 · 11:23:04 GMT+7',
    reason: 'No-show confirmed. Mentor không có phản hồi sau 2 giờ.',
    previousState: 'Open',
    newState: 'Resolved',
    notificationResult: 'Email gửi thành công cho học viên Bảo và mentor Phạm Thị Linh.',
    impact: 'Booking đã được đánh dấu hủy. Mentor nhận cảnh cáo lần 1 theo no-show policy v1.2.',
  }

  return (
    <div className="min-h-screen bg-canvas">
      <AuthNavbar />

      <div className="max-w-[760px] mx-auto px-6 py-8">
        <div className="flex items-center gap-2 text-xs text-ink-muted mb-6">
          <button onClick={() => navigate('/admin')} className="hover:text-ink">Admin</button>
          <span>/</span>
          <span>Audit Log</span>
          <span>/</span>
          <span>{record.id}</span>
        </div>

        <div className="flex items-start gap-4 mb-6 flex-wrap">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-[22px] font-semibold text-ink">Decision Record</h1>
              <span className="text-[10px] font-semibold bg-canvas-subtle border border-edge text-ink-muted px-2 py-0.5 rounded">IMMUTABLE</span>
            </div>
            <p className="text-sm text-ink-muted">{record.id} · Không thể chỉnh sửa</p>
          </div>
        </div>

        <div className="bg-panel border-2 border-edge rounded-xl overflow-hidden">
          {/* Immutable record header */}
          <div className="bg-canvas-subtle border-b border-edge px-6 py-3 flex items-center gap-2">
            <LockSimple aria-hidden size={16} className="shrink-0 text-ink-muted" />
            <p className="text-xs text-ink-muted font-medium">Audit record — chỉ đọc, không thể xóa hoặc chỉnh sửa.</p>
          </div>

          <div className="p-6 space-y-4">
            {[
              { label: 'Loại quyết định', value: record.type },
              { label: 'Đối tượng bị ảnh hưởng', value: record.object },
              { label: 'Người thực hiện', value: record.actor },
              { label: 'Thời gian', value: record.timestamp },
              { label: 'Lý do', value: record.reason },
              { label: 'Trạng thái trước', value: record.previousState },
              { label: 'Trạng thái sau', value: record.newState },
              { label: 'Kết quả thông báo', value: record.notificationResult },
              { label: 'Tác động', value: record.impact },
            ].map(row => (
              <div key={row.label} className="flex gap-4 py-3 border-b border-edge last:border-b-0">
                <span className="text-xs text-ink-muted w-36 shrink-0 font-medium">{row.label}</span>
                <span className="text-sm text-ink-secondary flex-1">{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Related links */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button onClick={() => navigate('/admin/cases/Q-002')} className="text-sm border border-edge text-ink-secondary hover:border-primary hover:text-primary font-medium px-4 py-2 rounded-lg transition-colors">
            <span className="inline-flex items-center gap-1">Xem Case <ArrowRight aria-hidden size={13} /></span>
          </button>
          <button onClick={() => navigate('/mentor/bookings/BK-2024-089')} className="text-sm border border-edge text-ink-secondary hover:border-primary hover:text-primary font-medium px-4 py-2 rounded-lg transition-colors">
            <span className="inline-flex items-center gap-1">Xem Booking <ArrowRight aria-hidden size={13} /></span>
          </button>
          <button className="text-sm border border-edge text-ink-secondary hover:border-primary hover:text-primary font-medium px-4 py-2 rounded-lg transition-colors">
            <span className="inline-flex items-center gap-1">Xem Mentor <ArrowRight aria-hidden size={13} /></span>
          </button>
        </div>
      </div>
    </div>
  )
}
