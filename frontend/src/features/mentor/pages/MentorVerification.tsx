import { useState } from 'react'
import { Check, Hourglass, Info, PencilSimple, SealCheck, X } from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'
import AuthNavbar from '@/shared/components/AuthNavbar'

type VerifStatus = 'draft' | 'pending' | 'approved' | 'rejected'

const STATUS_INFO: Record<VerifStatus, { color: string; icon: Icon; title: string; desc: string; canPublish: boolean; nextAction: string }> = {
  draft: { color: 'bg-canvas-subtle border-edge text-ink-secondary', icon: PencilSimple, title: 'Hồ sơ chưa hoàn chỉnh', desc: 'Hoàn thành hồ sơ và gửi để được xét duyệt.', canPublish: false, nextAction: 'Hoàn thành hồ sơ' },
  pending: { color: 'bg-notice-soft border-notice/20 text-ink', icon: Hourglass, title: 'Đang chờ xét duyệt', desc: 'Hồ sơ của bạn đang được team PrepVI xem xét. Thường mất 2-3 ngày làm việc.', canPublish: false, nextAction: '' },
  approved: { color: 'bg-ok-soft border-ok/20 text-ink', icon: SealCheck, title: 'Đã được phê duyệt', desc: 'Hồ sơ mentor của bạn đã được xác minh. Bạn có thể đăng lịch và nhận yêu cầu đặt lịch từ học viên.', canPublish: true, nextAction: 'Quản lý lịch' },
  rejected: { color: 'bg-danger-soft border-danger/20 text-ink', icon: X, title: 'Không được phê duyệt', desc: 'Hồ sơ của bạn chưa đáp ứng yêu cầu. Xem lý do bên dưới và cập nhật để gửi lại.', canPublish: false, nextAction: 'Cập nhật và gửi lại' },
}

const HISTORY = [
  { date: '14 tháng 3, 2025', status: 'pending', note: 'Hồ sơ được gửi lần đầu.' },
  { date: '10 tháng 3, 2025', status: 'rejected', note: 'Thiếu bằng chứng xác minh vai trò hiện tại.' },
  { date: '5 tháng 3, 2025', status: 'draft', note: 'Bắt đầu tạo hồ sơ mentor.' },
]

export default function MentorVerification() {
  const [currentStatus, setCurrentStatus] = useState<VerifStatus>('pending')
  const info = STATUS_INFO[currentStatus]

  return (
    <div className="min-h-screen bg-canvas">
      <AuthNavbar />

      <div className="max-w-[640px] mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h1 className="text-[22px] font-semibold text-ink">Trạng thái xác minh</h1>
          {/* Demo switcher */}
          <div className="flex gap-1 bg-canvas-subtle rounded-lg p-0.5">
            {(['draft', 'pending', 'approved', 'rejected'] as VerifStatus[]).map(s => (
              <button key={s} onClick={() => setCurrentStatus(s)}
                className={`text-[10px] px-2 py-1 rounded font-medium transition-colors ${currentStatus === s ? 'bg-panel text-ink shadow-sm' : 'text-ink-muted'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Status card */}
        <div className={`border rounded-xl p-6 mb-6 ${info.color}`}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-panel/50 flex items-center justify-center text-lg">
              <info.icon aria-hidden size={20} weight="bold" />
            </div>
            <div>
              <p className="text-base font-semibold">{info.title}</p>
              <p className="text-xs text-ink-muted">Cập nhật: 14 tháng 3, 2025</p>
            </div>
          </div>
          <p className="text-sm text-ink-secondary mb-4">{info.desc}</p>

          {!info.canPublish && currentStatus !== 'draft' && (
            <div className="flex items-center gap-2 text-xs text-ink-muted p-2 bg-panel/50 rounded-lg mb-3">
              <Info aria-hidden size={14} />
              Mentor chưa được duyệt không thể đăng lịch khả dụng.
            </div>
          )}

          {info.nextAction && (
            <button className="text-sm bg-primary hover:bg-primary-hover text-on-primary font-medium px-5 py-2.5 rounded-lg transition-colors">
              {info.nextAction}
            </button>
          )}
        </div>

        {/* Rejection reason */}
        {currentStatus === 'rejected' && (
          <div className="bg-danger-soft border border-danger/20 rounded-xl p-5 mb-6">
            <p className="text-xs font-semibold text-danger uppercase tracking-wider mb-2">Lý do không được phê duyệt</p>
            <p className="text-sm text-ink-secondary mb-3">Hồ sơ thiếu bằng chứng xác minh rõ ràng về vai trò hiện tại tại công ty. Vui lòng cung cấp thêm:</p>
            <ul className="text-sm text-ink-secondary space-y-1">
              <li className="flex gap-2"><span className="text-danger shrink-0">·</span> Ảnh thẻ nhân viên hoặc email công ty</li>
              <li className="flex gap-2"><span className="text-danger shrink-0">·</span> LinkedIn với vai trò được xác minh</li>
            </ul>
            <p className="text-xs text-ink-muted mt-3">Lý do được ẩn danh để bảo vệ quy trình xét duyệt nội bộ.</p>
          </div>
        )}

        {/* What you can do now */}
        <div className="bg-panel border border-edge rounded-xl p-5 mb-6">
          <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-3">Bạn có thể làm gì ngay bây giờ</p>
          <div className="space-y-2">
            {[
              { label: 'Xem và chỉnh sửa hồ sơ công khai', enabled: true },
              { label: 'Đăng lịch khả dụng', enabled: info.canPublish },
              { label: 'Nhận yêu cầu đặt lịch từ học viên', enabled: info.canPublish },
              { label: 'Tham gia buổi phỏng vấn đã xác nhận', enabled: info.canPublish },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2 text-sm">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${item.enabled ? 'bg-ok' : 'bg-edge'}`}>
                  {item.enabled ? (
                    <Check aria-hidden size={9} weight="bold" />
                  ) : (
                    <X aria-hidden size={9} weight="bold" />
                  )}
                </div>
                <span className={item.enabled ? 'text-ink-secondary' : 'text-ink-muted'}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Decision history */}
        <div className="bg-panel border border-edge rounded-xl p-5">
          <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-4">Lịch sử quyết định</p>
          <div className="space-y-3">
            {HISTORY.map((h, i) => (
              <div key={i} className="flex gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${h.status === 'rejected' ? 'bg-danger' : h.status === 'pending' ? 'bg-notice' : 'bg-edge-strong'}`}/>
                <div>
                  <p className="text-xs text-ink-muted">{h.date}</p>
                  <p className="text-sm text-ink-secondary">{h.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
