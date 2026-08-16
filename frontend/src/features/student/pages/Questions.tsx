import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowRight, CaretDown, FileText, MagnifyingGlass, X } from '@phosphor-icons/react'
import PublicNavbar from '@/shared/components/PublicNavbar'
import AuthNavbar from '@/shared/components/AuthNavbar'
import QuestionRow from '@/shared/components/QuestionRow'
import { QUESTIONS } from '@/shared/data/mock'
import { useApp } from '@/app/AppContext'

const JD_TOPICS = ['Frontend', 'JavaScript', 'React', 'REST API']

const FILTER_OPTIONS = {
  position: ['Frontend Intern', 'Frontend Engineer', 'Backend Engineer', 'Fullstack'],
  topic: ['JavaScript', 'React', 'CSS', 'TypeScript', 'System Design', 'Behavioral'],
  type: ['Technical', 'System Design', 'Behavioral'],
  difficulty: ['Dễ', 'Trung bình', 'Khó'],
  status: ['Chưa luyện', 'Đang luyện', 'Tự tin'],
}

function SkeletonRow() {
  return (
    <div className="py-4 px-4 animate-pulse">
      <div className="h-2 bg-edge rounded w-24 mb-2"/>
      <div className="h-4 bg-edge rounded w-3/4 mb-2"/>
      <div className="flex gap-2">
        <div className="h-5 bg-edge rounded-full w-20"/>
        <div className="h-5 bg-edge rounded-full w-16"/>
      </div>
    </div>
  )
}

export default function Questions() {
  const { role } = useApp()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const fromJD = searchParams.get('from') === 'jd'
  const [jdFilters, setJdFilters] = useState<string[]>(fromJD ? JD_TOPICS : [])
  const [activeFilters, setActiveFilters] = useState<string[]>(fromJD ? [] : ['Frontend Intern', 'JavaScript'])
  const [sort, setSort] = useState('Phù hợp nhất')
  const [search, setSearch] = useState('')
  const [loading] = useState(false)

  const removeFilter = (f: string) => setActiveFilters(prev => prev.filter(x => x !== f))
  const removeJdFilter = (f: string) => setJdFilters(prev => prev.filter(x => x !== f))

  const filtered = QUESTIONS.filter(q =>
    search === '' || q.titleVi.toLowerCase().includes(search.toLowerCase()) || q.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-canvas">
      {role === 'public' ? <PublicNavbar /> : <AuthNavbar />}

      <div className="max-w-[1280px] mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-[22px] font-semibold text-ink">Question Bank</h1>
          <p className="text-sm text-ink-secondary mt-1">Tìm và luyện những câu hỏi phù hợp với vị trí bạn đang chuẩn bị.</p>
        </div>

        {/* JD filter context bar */}
        {jdFilters.length > 0 && (
          <div className="bg-primary-soft border border-primary/20 rounded-xl px-4 py-3 mb-5 flex items-start gap-3">
            <FileText aria-hidden size={16} className="mt-0.5 shrink-0 text-primary" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-primary mb-2">Bộ lọc từ JD — Frontend Intern</p>
              <div className="flex items-center gap-1.5 flex-wrap">
                {jdFilters.map(f => (
                  <button
                    key={f}
                    onClick={() => removeJdFilter(f)}
                    className="flex items-center gap-1 text-xs px-2.5 py-1 bg-panel text-primary border border-primary/25 rounded-full font-medium hover:bg-danger-soft hover:text-danger hover:border-danger/20 transition-colors"
                  >
                    {f}
                    <X aria-hidden size={11} weight="bold" />
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => setJdFilters([])}
              className="text-xs text-ink-muted hover:text-danger transition-colors whitespace-nowrap shrink-0"
            >
              Xóa bộ lọc từ JD
            </button>
          </div>
        )}

        {/* Search */}
        <div className="relative mb-4">
          <MagnifyingGlass aria-hidden size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            type="search"
            placeholder="Tìm câu hỏi, chủ đề hoặc kỹ năng…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-panel border border-edge rounded-lg pl-10 pr-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
          />
        </div>

        {/* Filters row */}
        <div className="flex items-center gap-2 flex-wrap mb-2">
          {Object.entries(FILTER_OPTIONS).map(([key, opts]) => (
            <div key={key} className="relative group">
              <button className="text-xs px-3 py-1.5 border border-edge rounded-md text-ink-secondary hover:border-primary hover:text-primary transition-colors bg-panel font-medium capitalize">
                {key === 'position' ? 'Vị trí' : key === 'topic' ? 'Chủ đề' : key === 'type' ? 'Loại PV' : key === 'difficulty' ? 'Độ khó' : 'Trạng thái'}
                <CaretDown aria-hidden size={11} className="ml-1 inline opacity-50" />
              </button>
              <div className="absolute top-full left-0 mt-1 bg-panel border border-edge rounded-lg shadow-sm p-2 z-30 hidden group-hover:block min-w-[160px]">
                {opts.map(o => (
                  <button key={o} onClick={() => { if (!activeFilters.includes(o)) setActiveFilters(prev => [...prev, o]) }}
                    className="w-full text-left text-xs px-3 py-1.5 hover:bg-canvas rounded-md text-ink-secondary hover:text-ink transition-colors">
                    {o}
                  </button>
                ))}
              </div>
            </div>
          ))}
          {activeFilters.length > 0 && (
            <button onClick={() => setActiveFilters([])} className="text-xs text-ink-muted hover:text-danger transition-colors px-2">
              Xóa bộ lọc
            </button>
          )}
        </div>

        {/* Active filters */}
        {activeFilters.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap mb-5">
            {activeFilters.map(f => (
              <button
                key={f}
                onClick={() => removeFilter(f)}
                className="flex items-center gap-1.5 text-xs px-2.5 py-1 bg-primary-soft text-primary border border-primary/20 rounded-full font-medium hover:bg-danger-soft hover:text-danger hover:border-danger/20 transition-colors"
              >
                {f}
                <X aria-hidden size={11} weight="bold" />
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-6">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Results header */}
            <div className="flex items-center justify-between mb-3 py-2 border-b border-edge">
              <p className="text-sm text-ink-secondary">
                <span className="font-semibold text-ink">{filtered.length}</span> câu hỏi
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-ink-muted">Sắp xếp:</span>
                <select
                  value={sort}
                  onChange={e => setSort(e.target.value)}
                  className="text-xs bg-panel border border-edge rounded-md px-2 py-1 text-ink-secondary focus:border-primary outline-none"
                >
                  <option>Phù hợp nhất</option>
                  <option>Mới nhất</option>
                  <option>Được luyện nhiều</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="bg-panel border border-edge rounded-xl divide-y divide-edge">
                {[1,2,3,4,5].map(i => <SkeletonRow key={i} />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16">
                <MagnifyingGlass aria-hidden size={42} className="mx-auto mb-4 text-edge-strong" />
                <p className="text-sm font-medium text-ink mb-1">Không tìm thấy câu hỏi</p>
                <p className="text-xs text-ink-muted">Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc.</p>
                <button onClick={() => { setSearch(''); setActiveFilters([]) }} className="text-xs text-primary mt-3 hover:underline">Xóa tất cả bộ lọc</button>
              </div>
            ) : (
              <div className="bg-panel border border-edge rounded-xl px-4">
                {filtered.map(q => <QuestionRow key={q.id} question={q} showStatus={role !== 'public'} />)}
              </div>
            )}
          </div>

          {/* Contextual sidebar — lg+ only */}
          {role !== 'public' && (
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="bg-panel border border-edge rounded-xl p-5 sticky top-20">
                <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-4">Mục tiêu hiện tại</p>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-ok shrink-0"/>
                  <div>
                    <p className="text-sm font-semibold text-ink">Frontend Intern</p>
                    <p className="text-xs text-ink-muted">Phỏng vấn trong 18 ngày</p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  {[
                    { topic: 'JavaScript', done: 7, total: 20 },
                    { topic: 'React', done: 3, total: 15 },
                    { topic: 'Behavioral', done: 1, total: 12 },
                  ].map(p => (
                    <div key={p.topic}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-ink-secondary">{p.topic}</span>
                        <span className="text-ink-muted">{p.done}/{p.total}</span>
                      </div>
                      <div className="h-1 bg-edge rounded-full overflow-hidden">
                        <div className="h-full bg-ok rounded-full" style={{ width: `${(p.done / p.total) * 100}%` }}/>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-ink-muted mb-1.5">Đề xuất tiếp theo</p>
                <button onClick={() => navigate('/questions/behavioral-conflict')} className="w-full text-left text-xs px-3 py-2 bg-canvas-subtle hover:bg-canvas rounded-md text-ink-secondary hover:text-ink transition-colors border border-edge">
                  <span className="inline-flex items-center gap-1">Luyện câu hỏi Behavioral <ArrowRight aria-hidden size={12} /></span>
                </button>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  )
}
