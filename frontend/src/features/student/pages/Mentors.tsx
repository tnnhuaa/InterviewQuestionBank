import { useState } from 'react'
import { Info, X } from '@phosphor-icons/react'
import PublicNavbar from '@/shared/components/PublicNavbar'
import AuthNavbar from '@/shared/components/AuthNavbar'
import MentorCard from '@/shared/components/MentorCard'
import { MENTORS } from '@/shared/data/mock'
import { useApp } from '@/app/AppContext'

export default function Mentors() {
  const { role } = useApp()
  const [contextFilter, setContextFilter] = useState<string | null>('JavaScript · Frontend')
  const [, setFilters] = useState<Record<string, string>>({})

  return (
    <div className="min-h-screen bg-canvas">
      {role === 'public' ? <PublicNavbar /> : <AuthNavbar />}

      <div className="max-w-[1280px] mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-[22px] font-semibold text-ink">Tìm mentor phù hợp với buổi phỏng vấn của bạn</h1>
          <p className="text-sm text-ink-secondary mt-1">Chỉ hiển thị mentor đã được xác minh.</p>
        </div>

        {/* Context banner */}
        {contextFilter && (
          <div className="flex items-center gap-3 bg-primary-soft border border-primary/20 rounded-lg px-4 py-3 mb-5">
            <Info aria-hidden size={16} className="shrink-0 text-primary" />
            <p className="text-sm text-primary flex-1">Đang tìm mentor cho: <strong>{contextFilter}</strong></p>
            <button onClick={() => setContextFilter(null)} className="text-primary/60 hover:text-primary transition-colors">
              <X aria-hidden size={16} weight="bold" />
            </button>
          </div>
        )}

        <div className="flex gap-6">
          {/* Filters sidebar */}
          <aside className="hidden md:block w-52 shrink-0">
            <div className="space-y-6">
              {[
                { label: 'Chuyên môn', opts: ['React', 'JavaScript', 'CSS', 'System Design', 'Node.js', 'Leadership'] },
                { label: 'Loại phỏng vấn', opts: ['Technical', 'System Design', 'Behavioral', 'Leadership'] },
                { label: 'Ngôn ngữ', opts: ['Tiếng Việt', 'English'] },
                { label: 'Múi giờ', opts: ['GMT+7', 'GMT+8', 'GMT+9'] },
              ].map(section => (
                <div key={section.label}>
                  <p className="text-xs font-semibold text-ink-secondary uppercase tracking-wider mb-2">{section.label}</p>
                  <div className="space-y-1">
                    {section.opts.map(opt => (
                      <label key={opt} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          className="w-3.5 h-3.5 rounded border-edge-strong accent-primary"
                          onChange={e => setFilters(prev => e.target.checked ? { ...prev, [opt]: '1' } : Object.fromEntries(Object.entries(prev).filter(([k]) => k !== opt)))}
                        />
                        <span className="text-xs text-ink-secondary group-hover:text-ink transition-colors">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-edge">
              <p className="text-sm text-ink-secondary">
                <span className="font-semibold text-ink">{MENTORS.length}</span> mentor
              </p>
              <select className="text-xs bg-panel border border-edge rounded-md px-2 py-1 text-ink-secondary focus:border-primary outline-none">
                <option>Phù hợp nhất</option>
                <option>Rating cao nhất</option>
                <option>Slot sớm nhất</option>
              </select>
            </div>

            <div className="space-y-4">
              {MENTORS.map(m => (
                <MentorCard key={m.id} mentor={m} />
              ))}
            </div>

            {/* Empty state variant */}
            <div className="mt-8 p-6 border border-dashed border-edge rounded-xl text-center bg-canvas-subtle/50">
              <p className="text-sm font-medium text-ink-secondary mb-1">Không tìm thấy mentor khớp bộ lọc thời gian</p>
              <p className="text-xs text-ink-muted mb-3">Có mentor với chuyên môn phù hợp, nhưng chưa có slot trong khung giờ bạn chọn.</p>
              <button className="text-xs text-primary font-medium hover:underline">Xóa bộ lọc thời gian</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
