import { useState } from 'react'
import { MagnifyingGlass, Plus, X } from '@phosphor-icons/react'
import AuthNavbar from '@/shared/components/AuthNavbar'
import StatusBadge from '@/shared/components/StatusBadge'
import { ADMIN_QUESTIONS } from '@/shared/data/mock'
import type { QuestionStatus } from '@/shared/data/mock'

const STATUS_ACTIONS: Record<QuestionStatus, { next: string; label: string }[]> = {
  draft: [{ next: 'in-review', label: 'Gửi review' }],
  'in-review': [{ next: 'published', label: 'Xuất bản' }, { next: 'draft', label: 'Trả về Draft' }],
  published: [{ next: 'archived', label: 'Lưu trữ' }],
  archived: [{ next: 'draft', label: 'Khôi phục Draft' }],
}

export default function AdminQuestions() {
  const [questions, setQuestions] = useState(ADMIN_QUESTIONS)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<QuestionStatus | 'all'>('all')
  const [drawerOpen, setDrawerOpen] = useState(false)

  const filtered = questions.filter(q =>
    (statusFilter === 'all' || q.status === statusFilter) &&
    (search === '' || q.title.toLowerCase().includes(search.toLowerCase()))
  )

  const changeStatus = (id: string, newStatus: string) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, status: newStatus as QuestionStatus } : q))
  }

  return (
    <div className="min-h-screen bg-canvas">
      <AuthNavbar />

      <div className="max-w-[1280px] mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h1 className="text-[22px] font-semibold text-ink">Quản lý câu hỏi</h1>
          <button onClick={() => setDrawerOpen(true)} className="text-sm bg-primary hover:bg-primary-hover text-on-primary font-medium px-5 py-2.5 rounded-lg transition-colors flex items-center gap-2">
            <Plus aria-hidden size={14} weight="bold" />
            Thêm câu hỏi
          </button>
        </div>

        <div className="flex gap-3 mb-5 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <MagnifyingGlass aria-hidden size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
            <input type="search" placeholder="Tìm câu hỏi..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full bg-panel border border-edge rounded-lg pl-9 pr-4 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none" />
          </div>
          <div className="flex gap-1">
            {(['all', 'draft', 'in-review', 'published', 'archived'] as const).map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`text-xs px-3 py-1.5 rounded-md font-medium transition-colors ${statusFilter === s ? 'bg-primary text-on-primary' : 'text-ink-secondary hover:text-ink hover:bg-canvas-subtle'} capitalize`}>
                {s === 'all' ? 'Tất cả' : s}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-panel border border-edge rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-edge bg-canvas-subtle/50">
                {['Câu hỏi', 'Vị trí', 'Chủ đề', 'Nguồn', 'Ver.', 'Trạng thái', 'Cập nhật', 'Owner', 'Hành động'].map(h => (
                  <th key={h} className="text-left text-[11px] font-semibold text-ink-muted uppercase tracking-wider px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-edge">
              {filtered.map(q => (
                <tr key={q.id} className="hover:bg-canvas-subtle/30 transition-colors">
                  <td className="px-4 py-3 max-w-[280px]">
                    <p className="text-sm text-ink line-clamp-2">{q.title}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-ink-muted whitespace-nowrap">{q.position}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {q.topics.map(t => (
                        <span key={t} className="text-[10px] px-1.5 py-0.5 rounded-full bg-canvas-subtle text-ink-secondary border border-edge">{t}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-ink-muted">{q.source}</td>
                  <td className="px-4 py-3 text-xs text-ink-muted text-center">{q.version}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={q.status} size="sm" />
                  </td>
                  <td className="px-4 py-3 text-xs text-ink-muted whitespace-nowrap">{q.updated}</td>
                  <td className="px-4 py-3 text-xs text-ink-muted">{q.owner}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {STATUS_ACTIONS[q.status as QuestionStatus]?.map(a => (
                        <button key={a.label} onClick={() => changeStatus(q.id, a.next)}
                          className="text-[11px] px-2 py-1 border border-edge rounded text-ink-secondary hover:border-primary hover:text-primary transition-colors font-medium whitespace-nowrap">
                          {a.label}
                        </button>
                      ))}
                      <button className="text-[11px] px-2 py-1 border border-edge rounded text-ink-secondary hover:border-primary hover:text-primary transition-colors">
                        Sửa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="text-center py-10 text-sm text-ink-muted">Không có câu hỏi nào.</div>}
        </div>

        {/* Side drawer */}
        {drawerOpen && (
          <div className="fixed inset-0 bg-ink/30 z-50 flex justify-end" onClick={() => setDrawerOpen(false)}>
            <div className="bg-panel w-full max-w-[480px] h-full overflow-y-auto p-6 shadow-xl" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-semibold text-ink">Thêm câu hỏi mới</h2>
                <button onClick={() => setDrawerOpen(false)} className="p-1.5 hover:bg-canvas-subtle rounded text-ink-muted hover:text-ink transition-colors">
                  <X aria-hidden size={18} weight="bold" />
                </button>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Tiêu đề câu hỏi', type: 'input' },
                  { label: 'Vị trí', type: 'select', opts: ['Frontend Intern', 'Frontend Engineer'] },
                  { label: 'Chủ đề', type: 'input' },
                  { label: 'Nguồn', type: 'select', opts: ['Community', 'Submission', 'Admin'] },
                ].map(f => (
                  <div key={f.label}>
                    <label className="block text-xs font-semibold text-ink-secondary mb-1.5">{f.label}</label>
                    {f.type === 'input'
                      ? <input type="text" className="w-full bg-canvas-subtle border border-edge rounded-lg px-4 py-2.5 text-sm text-ink focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none" />
                      : <select className="w-full bg-canvas-subtle border border-edge rounded-lg px-4 py-2.5 text-sm focus:border-primary outline-none">{f.opts?.map(o => <option key={o}>{o}</option>)}</select>
                    }
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-semibold text-ink-secondary mb-1.5">Điểm hướng dẫn</label>
                  <textarea rows={4} placeholder="Mỗi điểm trên một dòng..." className="w-full bg-canvas-subtle border border-edge rounded-lg px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none resize-none" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setDrawerOpen(false)} className="flex-1 border border-edge text-ink-secondary font-medium py-2.5 rounded-lg text-sm hover:border-primary transition-colors">Hủy</button>
                  <button onClick={() => setDrawerOpen(false)} className="flex-1 bg-primary hover:bg-primary-hover text-on-primary font-medium py-2.5 rounded-lg text-sm transition-colors">Lưu nháp</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
