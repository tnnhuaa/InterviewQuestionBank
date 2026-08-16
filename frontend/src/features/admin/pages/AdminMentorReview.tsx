import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Check, PaperPlaneTilt } from '@phosphor-icons/react'
import AuthNavbar from '@/shared/components/AuthNavbar'
import { MENTORS } from '@/shared/data/mock'

const CHECKLIST_ITEMS = [
  { id: 'identity', label: 'Xác minh danh tính / bằng chứng nghề nghiệp', required: true },
  { id: 'expertise', label: 'Chuyên môn nhất quán với hồ sơ LinkedIn', required: true },
  { id: 'profile', label: 'Hồ sơ đầy đủ (bio, expertise, languages)', required: true },
  { id: 'policy', label: 'Tuân thủ chính sách cộng đồng PrepVI', required: true },
  { id: 'quality', label: 'Chất lượng bio đủ để học viên đánh giá', required: false },
]

export default function AdminMentorReview() {
  const navigate = useNavigate()
  const mentor = MENTORS[2]
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [action, setAction] = useState<null | 'approve' | 'reject'>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [done, setDone] = useState(false)

  const allRequired = CHECKLIST_ITEMS.filter(i => i.required).every(i => checked[i.id])

  if (done) {
    return (
      <div className="min-h-screen bg-canvas">
        <AuthNavbar />
        <div className="max-w-[500px] mx-auto px-6 py-20 text-center">
          <div className="w-12 h-12 rounded-full bg-ok-soft border-2 border-ok flex items-center justify-center mx-auto mb-5">
            <Check aria-hidden size={23} weight="bold" className="text-ok" />
          </div>
          <h1 className="text-[22px] font-semibold text-ink mb-2">Quyết định đã được ghi nhận</h1>
          <p className="text-sm text-ink-secondary mb-2">Mentor sẽ nhận thông báo. Audit log đã được tạo.</p>
          <div className="mt-5 p-4 bg-canvas-subtle border border-edge rounded-lg text-xs text-ink-muted text-left space-y-1">
            <p className="font-semibold text-ink-secondary">Audit summary (immutable)</p>
            <p>Actor: Admin (demo)</p>
            <p>Decision: {action === 'approve' ? 'Approved' : 'Rejected'}</p>
            <p>Timestamp: {new Date().toLocaleString('vi-VN')}</p>
            <p>Mentor: {mentor.name}</p>
          </div>
          <button onClick={() => navigate('/admin')} className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"><ArrowLeft aria-hidden size={14} /> Quay lại Queue</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-canvas">
      <AuthNavbar />

      <div className="max-w-[1100px] mx-auto px-6 py-8">
        <div className="flex items-center gap-2 text-xs text-ink-muted mb-6">
          <button onClick={() => navigate('/admin')} className="hover:text-ink">Admin</button>
          <span>/</span>
          <span>Xét duyệt mentor</span>
        </div>
        <h1 className="text-[22px] font-semibold text-ink mb-6">Xét duyệt hồ sơ mentor</h1>

        <div className="flex gap-6">
          {/* Profile preview */}
          <div className="flex-1 space-y-5">
            <div className="bg-panel border border-edge rounded-xl p-6">
              <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-4">Hồ sơ công khai (preview)</p>
              <div className="flex gap-4 items-start">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-canvas-subtle shrink-0">
                  <img src={mentor.avatar} alt={mentor.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-ink">{mentor.name}</h2>
                  <p className="text-sm text-ink-secondary">{mentor.role} · {mentor.company}</p>
                  <p className="text-xs text-ink-muted">{mentor.timezone} · {mentor.experience}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {mentor.expertise.map(e => <span key={e} className="text-[10px] px-1.5 py-0.5 rounded-full bg-canvas-subtle text-ink-secondary border border-edge">{e}</span>)}
                  </div>
                </div>
              </div>
              <p className="text-sm text-ink-secondary mt-4 leading-relaxed">{mentor.bio}</p>
            </div>

            {/* Verification evidence */}
            <div className="bg-panel border border-edge rounded-xl p-5">
              <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-3">Bằng chứng xác minh</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <PaperPlaneTilt aria-hidden size={16} className="text-ok" />
                  <a href="#" className="text-primary hover:underline">linkedin.com/in/duc-anh-tran</a>
                  <span className="text-xs text-ink-muted">(Engineering Manager at Sea)</span>
                </div>
              </div>
            </div>

            {/* Previous decisions */}
            <div className="bg-panel border border-edge rounded-xl p-5">
              <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-3">Lịch sử quyết định</p>
              <p className="text-sm text-ink-muted italic">Hồ sơ mới, chưa có quyết định trước đây.</p>
            </div>
          </div>

          {/* Review panel */}
          <aside className="w-72 shrink-0 space-y-4">
            <div className="bg-panel border border-edge rounded-xl p-5 sticky top-20">
              <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-4">Checklist xét duyệt</p>
              <div className="space-y-2.5 mb-5">
                {CHECKLIST_ITEMS.map(item => (
                  <label key={item.id} className="flex items-start gap-2 cursor-pointer">
                    <div
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${checked[item.id] ? 'bg-primary border-primary' : 'border-edge'}`}
                      onClick={() => setChecked(p => ({ ...p, [item.id]: !p[item.id] }))}
                    >
                      {checked[item.id] && <Check aria-hidden size={9} weight="bold" />}
                    </div>
                    <span className="text-xs text-ink-secondary">
                      {item.label}
                      {item.required && <span className="text-accent ml-0.5">*</span>}
                    </span>
                  </label>
                ))}
              </div>

              {action === 'reject' ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-ink-secondary mb-1.5">Lý do từ chối <span className="text-accent">*</span></label>
                    <select value={rejectReason} onChange={e => setRejectReason(e.target.value)} className="w-full bg-canvas-subtle border border-edge rounded-lg px-3 py-2 text-xs focus:border-primary outline-none">
                      <option value="">Chọn lý do</option>
                      <option>Thiếu bằng chứng xác minh nghề nghiệp</option>
                      <option>Hồ sơ chưa đầy đủ</option>
                      <option>Vi phạm chính sách cộng đồng</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setAction(null)} className="flex-1 border border-edge text-ink-secondary py-2 rounded-lg text-xs font-medium hover:border-primary transition-colors">Hủy</button>
                    <button onClick={() => { if (rejectReason) { setAction('reject'); setDone(true) } }} disabled={!rejectReason}
                      className="flex-1 bg-danger hover:opacity-90 text-on-primary py-2 rounded-lg text-xs font-medium transition-colors disabled:opacity-50">
                      Xác nhận từ chối
                    </button>
                  </div>
                </div>
              ) : action === 'approve' ? (
                <div className="space-y-3">
                  <div className="text-xs text-ink-secondary p-3 bg-ok-soft border border-ok/20 rounded-lg">
                    <p className="font-semibold mb-1">Xác nhận phê duyệt</p>
                    <p>Mentor sẽ nhận thông báo và có thể đăng lịch. Không thể hoàn tác.</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setAction(null)} className="flex-1 border border-edge text-ink-secondary py-2 rounded-lg text-xs font-medium hover:border-primary transition-colors">Hủy</button>
                    <button onClick={() => setDone(true)} className="flex-1 bg-primary hover:bg-primary-hover text-on-primary py-2 rounded-lg text-xs font-medium transition-colors">
                      Xác nhận phê duyệt
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <button
                    onClick={() => setAction('approve')}
                    disabled={!allRequired}
                    className="w-full bg-primary hover:bg-primary-hover text-on-primary font-medium px-4 py-2.5 rounded-lg text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Phê duyệt
                  </button>
                  <button onClick={() => setAction('reject')} className="w-full border border-edge text-danger hover:border-danger font-medium px-4 py-2.5 rounded-lg text-sm transition-colors">
                    Từ chối
                  </button>
                  {!allRequired && <p className="text-[10px] text-ink-muted text-center">Hoàn thành checklist bắt buộc (*) trước khi phê duyệt.</p>}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
