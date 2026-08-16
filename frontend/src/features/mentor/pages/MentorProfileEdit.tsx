import { useState } from 'react'
import { Check } from '@phosphor-icons/react'
import AuthNavbar from '@/shared/components/AuthNavbar'
import { MENTORS } from '@/shared/data/mock'

export default function MentorProfileEdit() {
  const mentor = MENTORS[0]
  const [saved, setSaved] = useState(false)
  const [tab, setTab] = useState<'editor' | 'preview'>('editor')
  const [bio, setBio] = useState(mentor.bio)

  return (
    <div className="min-h-screen bg-canvas">
      <AuthNavbar />

      <div className="max-w-[1100px] mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h1 className="text-[22px] font-semibold text-ink">Hồ sơ & Dịch vụ</h1>
          <div className="flex gap-2">
            <button className="text-sm border border-edge text-ink-secondary hover:border-primary hover:text-primary font-medium px-4 py-2 rounded-lg transition-colors">
              Xem hồ sơ công khai
            </button>
            <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000) }}
              className="text-sm bg-primary hover:bg-primary-hover text-on-primary font-medium px-5 py-2 rounded-lg transition-colors flex items-center gap-2">
              {saved && <Check aria-hidden size={14} weight="bold" />}
              {saved ? 'Đã lưu!' : 'Lưu thay đổi'}
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1 bg-canvas-subtle rounded-lg p-0.5 w-fit mb-6">
          {(['editor', 'preview'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`text-xs px-4 py-1.5 rounded font-medium transition-colors ${tab === t ? 'bg-panel text-ink shadow-sm' : 'text-ink-muted'}`}>
              {t === 'editor' ? 'Chỉnh sửa' : 'Xem trước công khai'}
            </button>
          ))}
        </div>

        {tab === 'editor' ? (
          <div className="grid lg:grid-cols-[1fr_260px] gap-6">
            <div className="space-y-5">
              {/* Public info */}
              <div className="bg-panel border border-edge rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider">Thông tin công khai</p>
                  <span className="text-[10px] px-1.5 py-0.5 bg-ok-soft text-ok border border-ok/20 rounded font-medium">Hiển thị với học viên</span>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-canvas-subtle shrink-0">
                      <img src={mentor.avatar} alt={mentor.name} className="w-full h-full object-cover" />
                    </div>
                    <button className="text-xs text-primary hover:underline">Thay ảnh đại diện</button>
                  </div>
                  {[
                    { label: 'Tên hiển thị', value: mentor.name, placeholder: 'Tên của bạn' },
                    { label: 'Vị trí hiện tại', value: mentor.role, placeholder: 'vd. Senior Frontend Engineer' },
                    { label: 'Công ty', value: mentor.company, placeholder: 'vd. Shopee' },
                  ].map(f => (
                    <div key={f.label}>
                      <label className="block text-xs font-semibold text-ink-secondary mb-1.5">{f.label}</label>
                      <input type="text" defaultValue={f.value} placeholder={f.placeholder}
                        className="w-full bg-canvas-subtle border border-edge rounded-lg px-4 py-2.5 text-sm text-ink focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none" />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs font-semibold text-ink-secondary mb-1.5">Giới thiệu bản thân</label>
                    <textarea rows={4} value={bio} onChange={e => setBio(e.target.value)}
                      className="w-full bg-canvas-subtle border border-edge rounded-lg px-4 py-2.5 text-sm text-ink focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none resize-none" />
                    <p className="text-[11px] text-ink-muted mt-1">{bio.length} / 500 ký tự</p>
                  </div>
                </div>
              </div>

              {/* Session settings */}
              <div className="bg-panel border border-edge rounded-xl p-6">
                <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-4">Cài đặt buổi phỏng vấn</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-ink-secondary mb-2">Thời lượng (phút)</label>
                    <div className="flex gap-2">
                      {['30', '45', '60', '90'].map(d => (
                        <button key={d} className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${d === '60' ? 'bg-primary text-on-primary border-primary' : 'border-edge text-ink-secondary hover:border-primary'}`}>{d}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink-secondary mb-1.5">Hình thức</label>
                    <select className="w-full bg-canvas-subtle border border-edge rounded-lg px-4 py-2.5 text-sm text-ink focus:border-primary outline-none">
                      <option>Video call</option>
                      <option>Audio only</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink-secondary mb-1.5">Kỳ vọng từ học viên</label>
                    <textarea rows={2} placeholder="Những gì bạn muốn học viên chuẩn bị trước khi vào buổi phỏng vấn..."
                      className="w-full bg-canvas-subtle border border-edge rounded-lg px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none resize-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Private info sidebar */}
            <div className="space-y-4">
              <div className="bg-panel border border-edge rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider">Thông tin riêng tư</p>
                  <span className="text-[10px] px-1.5 py-0.5 bg-canvas-subtle text-ink-muted border border-edge rounded font-medium">Chỉ PrepVI</span>
                </div>
                <div className="space-y-3 text-xs">
                  {[
                    { label: 'Email liên lạc', value: 'minh@example.com', note: 'Không hiển thị công khai' },
                    { label: 'Múi giờ', value: 'GMT+7 · Hồ Chí Minh' },
                  ].map(f => (
                    <div key={f.label}>
                      <p className="text-ink-muted mb-0.5">{f.label}</p>
                      <p className="text-ink-secondary">{f.value}</p>
                      {f.note && <p className="text-ink-muted italic">{f.note}</p>}
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-panel border border-edge rounded-xl p-5">
                <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-3">Bằng chứng xác minh</p>
                <p className="text-xs text-ink-muted mb-2">Đã gửi. Đang chờ xét duyệt.</p>
                <button className="text-xs text-primary hover:underline">Xem trạng thái xác minh</button>
              </div>
            </div>
          </div>
        ) : (
          /* Preview */
          <div className="max-w-[640px]">
            <div className="bg-panel border border-edge rounded-xl p-6">
              <div className="flex gap-5 items-start mb-6">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-canvas-subtle shrink-0">
                  <img src={mentor.avatar} alt={mentor.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-ink">{mentor.name}</h2>
                  <p className="text-sm text-ink-secondary">{mentor.role} · {mentor.company}</p>
                  <p className="text-xs text-ink-muted mt-0.5">{mentor.timezone}</p>
                </div>
              </div>
              <p className="text-sm text-ink-secondary leading-relaxed">{bio}</p>
              <div className="flex flex-wrap gap-1.5 mt-4">
                {mentor.expertise.map(e => (
                  <span key={e} className="text-xs px-2 py-0.5 rounded-full bg-canvas-subtle text-ink-secondary border border-edge">{e}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
