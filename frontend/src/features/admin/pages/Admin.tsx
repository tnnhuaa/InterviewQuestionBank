import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, CalendarX, ClipboardText, Flag, MagnifyingGlass, UserFocus } from '@phosphor-icons/react'
import AuthNavbar from '@/shared/components/AuthNavbar'
import { ADMIN_QUEUE } from '@/shared/data/mock'

const PRIORITY_CONFIG = {
  high: { label: 'Cao', className: 'bg-danger-soft text-danger border-danger/20' },
  medium: { label: 'Trung bình', className: 'bg-notice-soft text-notice-ink border-notice/20' },
  low: { label: 'Thấp', className: 'bg-canvas-subtle text-ink-muted border-edge' },
}

const TYPE_CONFIG: Record<string, string> = {
  'Mentor Review': 'bg-primary-soft text-primary',
  'Report': 'bg-danger-soft text-danger',
  'Question Review': 'bg-notice-soft text-notice-ink',
  'Booking Exception': 'bg-accent-soft text-accent',
}

export default function Admin() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('Tất cả')

  const filtered = ADMIN_QUEUE.filter(q =>
    (typeFilter === 'Tất cả' || q.type === typeFilter) &&
    (search === '' || q.case.toLowerCase().includes(search.toLowerCase()))
  )

  const urgentCount = ADMIN_QUEUE.filter(q => q.priority === 'high').length

  return (
    <div className="min-h-screen bg-canvas">
      <AuthNavbar />

      <div className="max-w-[1280px] mx-auto px-6 py-8">
        <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-[22px] font-semibold text-ink">Operational Queue</h1>
            <p className="text-sm text-ink-secondary mt-1">
              {urgentCount > 0 && <span className="text-danger font-medium">{urgentCount} mục ưu tiên cao</span>}
              {urgentCount > 0 && ' · '}
              {ADMIN_QUEUE.length} tổng số mục cần xử lý
            </p>
          </div>
        </div>

        {/* Priority summary cards */}
        <div className="grid sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Mentor chờ duyệt', count: 2, icon: UserFocus, path: '/admin/mentors/duc-tran/review', urgent: true },
            { label: 'Câu hỏi cần review', count: 1, icon: ClipboardText, path: '/admin/questions', urgent: false },
            { label: 'Booking exception', count: 1, icon: CalendarX, path: '/admin/cases/Q-002', urgent: true },
            { label: 'Báo cáo mở', count: 1, icon: Flag, path: '/admin/cases/Q-002', urgent: true },
          ].map(card => (
            <button key={card.label} onClick={() => navigate(card.path)}
              className={`text-left p-4 rounded-xl border transition-all hover:shadow-sm ${card.urgent ? 'bg-danger-soft border-danger/20' : 'bg-panel border-edge'}`}>
              <div className="flex items-center justify-between mb-2">
                <card.icon aria-hidden size={22} className={card.urgent ? 'text-danger' : 'text-ink-secondary'} />
                <span className={`text-xl font-semibold tabular-nums ${card.urgent ? 'text-danger' : 'text-ink'}`}>{card.count}</span>
              </div>
              <p className={`text-xs font-medium ${card.urgent ? 'text-danger' : 'text-ink-secondary'}`}>{card.label}</p>
            </button>
          ))}
        </div>

        {/* Queue */}
        <div className="bg-panel border border-edge rounded-xl overflow-hidden">
          <div className="flex items-center gap-3 p-4 border-b border-edge flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <MagnifyingGlass aria-hidden size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
              <input type="search" placeholder="Tìm trong queue..." value={search} onChange={e => setSearch(e.target.value)}
                className="w-full bg-canvas-subtle border border-edge rounded-lg pl-9 pr-4 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none" />
            </div>
            <div className="flex gap-1">
              {['Tất cả', 'Mentor Review', 'Report', 'Question Review', 'Booking Exception'].map(t => (
                <button key={t} onClick={() => setTypeFilter(t)}
                  className={`text-xs px-3 py-1.5 rounded-md font-medium transition-colors ${typeFilter === t ? 'bg-primary text-on-primary' : 'text-ink-secondary hover:text-ink hover:bg-canvas-subtle'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <table className="w-full">
            <thead>
              <tr className="border-b border-edge">
                {['Ưu tiên', 'Case', 'Loại', 'Tạo lúc', 'Trạng thái', 'Owner', ''].map(h => (
                  <th key={h} className="text-left text-[11px] font-semibold text-ink-muted uppercase tracking-wider px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-edge">
              {filtered.map(item => {
                const pCfg = PRIORITY_CONFIG[item.priority as keyof typeof PRIORITY_CONFIG]
                const tColor = TYPE_CONFIG[item.type] || 'bg-canvas-subtle text-ink-muted'
                const path = item.type === 'Mentor Review' ? '/admin/mentors/duc-tran/review' :
                             item.type === 'Question Review' ? '/admin/questions' :
                             `/admin/cases/${item.id}`
                return (
                  <tr key={item.id} className="hover:bg-canvas-subtle/50 transition-colors">
                    <td className="px-4 py-3">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border font-semibold ${pCfg.className}`}>{pCfg.label}</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-ink font-medium">{item.case}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${tColor}`}>{item.type}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-ink-muted whitespace-nowrap">{item.created}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-ink-secondary capitalize">{item.status}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-ink-muted">{item.owner || '—'}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => navigate(path)} className="text-xs text-primary font-medium hover:underline whitespace-nowrap">
                        <span className="inline-flex items-center gap-1">Xử lý <ArrowRight aria-hidden size={12} /></span>
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="text-center py-12 text-sm text-ink-muted">Không có mục nào phù hợp.</div>
          )}
        </div>
      </div>
    </div>
  )
}
