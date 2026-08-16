import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowDown, ArrowRight, CaretDown, CaretUp, Check, MagnifyingGlass, Plus, X } from '@phosphor-icons/react'
import AuthNavbar from '@/shared/components/AuthNavbar'
import JDFlowStepper from '@/shared/components/JDFlowStepper'

type Priority = 'must' | 'should' | 'optional'

interface RecommendedQuestion {
  id: string
  title: string
  topic: string
  difficulty: 'Dễ' | 'Trung bình' | 'Khó'
  estimatedMin: number
  practiceStatus: 'not-started' | 'practicing' | 'confident'
  priority: Priority
  jdSource: string
  mappedTopic: string
  reason: string
  removed?: boolean
}

const INITIAL_QUESTIONS: RecommendedQuestion[] = [
  { id: 'js-event-loop',    title: 'JavaScript Event Loop và Async Programming',            topic: 'JavaScript', difficulty: 'Trung bình', estimatedMin: 12, practiceStatus: 'not-started', priority: 'must',     jdSource: 'Solid knowledge of JavaScript and ES6+',                   mappedTopic: 'JavaScript → Async',      reason: 'JD yêu cầu kiến thức về asynchronous JavaScript.' },
  { id: 'js-closure',       title: 'Closures và Scope trong JavaScript',                    topic: 'JavaScript', difficulty: 'Trung bình', estimatedMin: 10, practiceStatus: 'not-started', priority: 'must',     jdSource: 'Solid knowledge of JavaScript and ES6+',                   mappedTopic: 'JavaScript → Closures',   reason: 'Closure là kiến thức JS cơ bản thường gặp trong phỏng vấn Intern.' },
  { id: 'react-lifecycle',  title: 'React Component Lifecycle',                             topic: 'React',      difficulty: 'Trung bình', estimatedMin: 10, practiceStatus: 'not-started', priority: 'must',     jdSource: 'Basic understanding of React and component lifecycle',      mappedTopic: 'React → Lifecycle',       reason: 'JD nêu trực tiếp "component lifecycle".' },
  { id: 'react-hooks',      title: 'useState và useEffect — lỗi thường gặp và cách tránh', topic: 'React',      difficulty: 'Trung bình', estimatedMin: 12, practiceStatus: 'practicing',  priority: 'must',     jdSource: 'Basic understanding of React and component lifecycle',      mappedTopic: 'React → Hooks',           reason: 'Hooks là cách hiện đại quản lý lifecycle trong React.' },
  { id: 'rest-api',         title: 'REST API — HTTP methods và status codes',               topic: 'REST API',   difficulty: 'Dễ',         estimatedMin:  8, practiceStatus: 'not-started', priority: 'must',     jdSource: 'Familiarity with REST API and HTTP methods',               mappedTopic: 'REST API → HTTP',         reason: 'JD nêu trực tiếp "REST API and HTTP methods".' },
  { id: 'git-workflow',     title: 'Git branching và workflow trong dự án nhóm',            topic: 'Git',        difficulty: 'Dễ',         estimatedMin:  8, practiceStatus: 'not-started', priority: 'must',     jdSource: 'Git knowledge and version control workflows',               mappedTopic: 'Git → Workflow',          reason: 'JD yêu cầu "version control workflows".' },
  { id: 'es6-features',     title: 'ES6+ — Destructuring, Spread, Arrow functions',         topic: 'JavaScript', difficulty: 'Dễ',         estimatedMin: 10, practiceStatus: 'not-started', priority: 'should',   jdSource: 'Solid knowledge of JavaScript and ES6+',                   mappedTopic: 'JavaScript → ES6+',       reason: 'ES6+ được đề cập rõ trong JD.' },
  { id: 'behavioral',       title: 'Xử lý xung đột trong nhóm — câu hỏi tình huống',       topic: 'Behavioral', difficulty: 'Trung bình', estimatedMin: 15, practiceStatus: 'not-started', priority: 'should',   jdSource: 'Good communication skills',                                mappedTopic: 'Behavioral → Giao tiếp', reason: 'JD yêu cầu kỹ năng giao tiếp — câu hỏi Behavioral thường đi kèm.' },
  { id: 'react-state',      title: 'State management — khi nào dùng Context vs Redux?',    topic: 'React',      difficulty: 'Khó',        estimatedMin: 12, practiceStatus: 'not-started', priority: 'should',   jdSource: 'Basic understanding of React',                             mappedTopic: 'React → State',           reason: 'Hiểu về state là nền tảng React.' },
  { id: 'css-specificity',  title: 'CSS Specificity và cascade rules',                      topic: 'CSS',        difficulty: 'Dễ',         estimatedMin:  8, practiceStatus: 'not-started', priority: 'should',   jdSource: 'Basic understanding of CSS-in-JS solutions',               mappedTopic: 'CSS → Specificity',       reason: 'CSS-in-JS yêu cầu hiểu cơ bản về CSS.' },
  { id: 'promise-async',    title: 'Promises vs async/await — sự khác biệt thực tế',       topic: 'JavaScript', difficulty: 'Trung bình', estimatedMin: 10, practiceStatus: 'not-started', priority: 'should',   jdSource: 'Solid knowledge of JavaScript and ES6+',                   mappedTopic: 'JavaScript → Async',      reason: 'Async programming là nền tảng JS hiện đại.' },
  { id: 'typescript-basics',title: 'TypeScript basics — types, interfaces, generics',       topic: 'TypeScript', difficulty: 'Trung bình', estimatedMin: 12, practiceStatus: 'not-started', priority: 'optional', jdSource: 'Experience with TypeScript (Nice to have)',                 mappedTopic: 'TypeScript → Basics',     reason: 'TypeScript được liệt kê là "nice to have" trong JD.' },
  { id: 'git-conflict',     title: 'Xử lý merge conflict trong Git',                        topic: 'Git',        difficulty: 'Dễ',         estimatedMin:  8, practiceStatus: 'not-started', priority: 'optional', jdSource: 'Git knowledge and version control workflows',               mappedTopic: 'Git → Merge conflict',    reason: 'Kỹ năng Git thực tế ngoài lý thuyết.' },
  { id: 'rest-api-auth',    title: 'REST API Authentication — Token vs Session',            topic: 'REST API',   difficulty: 'Khó',        estimatedMin: 15, practiceStatus: 'not-started', priority: 'optional', jdSource: 'Familiarity with REST API',                                 mappedTopic: 'REST API → Auth',         reason: 'Auth là khái niệm nâng cao trong REST API.' },
]

const PRIORITY_META: Record<Priority, { label: string; desc: string; accentClass: string; borderClass: string }> = {
  must:     { label: 'Cần luyện',  desc: 'Yêu cầu trực tiếp từ JD',       accentClass: 'text-primary bg-primary-soft border-primary/25', borderClass: 'border-l-primary' },
  should:   { label: 'Nên luyện', desc: 'Chủ đề hỗ trợ quan trọng',       accentClass: 'text-ok bg-ok-soft border-ok/25',               borderClass: 'border-l-ok' },
  optional: { label: 'Tuỳ chọn',  desc: 'Hữu ích nhưng ưu tiên thấp hơn', accentClass: 'text-ink-muted bg-canvas-subtle border-edge',   borderClass: 'border-l-edge-strong' },
}

const DIFF_COLOR: Record<string, string> = {
  'Dễ':       'text-ok bg-ok-soft border-ok/30',
  'Trung bình':'text-ink-secondary bg-canvas-subtle border-edge',
  'Khó':      'text-accent bg-accent/10 border-accent/30',
}

const PRACTICE_DOT: Record<string, string> = {
  'not-started': 'bg-edge-strong',
  'practicing':  'bg-notice',
  'confident':   'bg-ok',
}

export default function JDRecommendations() {
  const navigate = useNavigate()
  const [questions, setQuestions] = useState<RecommendedQuestion[]>(INITIAL_QUESTIONS)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [saved, setSaved] = useState(false)
  const [drawerSearch, setDrawerSearch] = useState('')

  const active   = questions.filter(q => !q.removed)
  const removed  = questions.filter(q => q.removed)
  const mustQ    = active.filter(q => q.priority === 'must')
  const shouldQ  = active.filter(q => q.priority === 'should')
  const optionalQ = active.filter(q => q.priority === 'optional')
  const totalMin = active.reduce((s, q) => s + q.estimatedMin, 0)
  const totalTopics = [...new Set(active.map(q => q.topic))].length

  const removeQ  = (id: string) => setQuestions(prev => prev.map(q => q.id === id ? { ...q, removed: true } : q))
  const restoreQ = (id: string) => setQuestions(prev => prev.map(q => q.id === id ? { ...q, removed: false } : q))

  const fmtTime = (min: number) => {
    const h = Math.floor(min / 60), m = min % 60
    return h === 0 ? `${m}m` : m === 0 ? `${h}h` : `${h}h ${m}m`
  }

  const renderQuestion = (q: RecommendedQuestion) => {
    const isExp = expanded === q.id
    const meta  = PRIORITY_META[q.priority]

    return (
      <div key={q.id} className={`bg-panel border border-edge border-l-4 ${meta.borderClass} rounded-xl overflow-hidden transition-shadow hover:shadow-sm`}>
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              {/* Meta row */}
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${DIFF_COLOR[q.difficulty]}`}>
                  {q.difficulty}
                </span>
                <span className="text-xs text-ink-muted">{q.topic}</span>
                <span className="text-xs text-ink-muted">·</span>
                <span className="text-xs text-ink-muted">~{q.estimatedMin} phút</span>
                {q.practiceStatus !== 'not-started' && (
                  <span className="flex items-center gap-1 text-xs text-ink-muted">
                    <span className={`w-1.5 h-1.5 rounded-full ${PRACTICE_DOT[q.practiceStatus]}`} />
                    {q.practiceStatus === 'practicing' ? 'Đang luyện' : 'Tự tin'}
                  </span>
                )}
              </div>

              {/* Title */}
              <p className="text-sm font-semibold text-ink leading-snug mb-1.5">{q.title}</p>

              {/* Reason — always visible */}
              <p className="text-xs text-ink-secondary leading-relaxed">{q.reason}</p>

              {/* Expand: full reasoning chain */}
              <button
                onClick={() => setExpanded(isExp ? null : q.id)}
                className="mt-1.5 text-xs text-ink-muted hover:text-primary transition-colors flex items-center gap-1"
              >
                {isExp ? <><span>Ẩn chi tiết</span><CaretUp aria-hidden size={12} /></> : <><span>Xem lý do đầy đủ</span><CaretDown aria-hidden size={12} /></>}
              </button>

              {isExp && (
                <div className="mt-2 bg-canvas-subtle border border-edge rounded-xl p-3 space-y-2">
                  <div>
                    <p className="text-[10px] text-ink-muted uppercase tracking-wider font-semibold mb-0.5">Yêu cầu trong JD</p>
                    <p className="text-xs text-ink-secondary italic">"{q.jdSource}"</p>
                  </div>
                  <div className="flex items-start gap-1.5 text-xs text-ink-muted">
                    <ArrowDown aria-hidden size={13} className="mt-0.5 shrink-0" />
                    <span>Mapped: <span className="text-ink font-medium">{q.mappedTopic}</span></span>
                  </div>
                  <div className="flex items-start gap-1.5 text-xs text-ink-muted">
                    <ArrowDown aria-hidden size={13} className="mt-0.5 shrink-0" />
                    <span>Đề xuất: <span className="text-ink font-medium">{q.title}</span></span>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-1.5 shrink-0 pt-0.5">
              <button
                onClick={() => navigate('/questions/js-event-loop')}
                className="text-xs bg-primary hover:bg-primary-hover text-on-primary font-semibold px-3.5 py-2 rounded-lg transition-colors whitespace-nowrap"
              >
                <span className="inline-flex items-center gap-1">Luyện ngay <ArrowRight aria-hidden size={13} /></span>
              </button>
              <button
                onClick={() => navigate('/questions/js-event-loop')}
                className="text-xs border border-edge text-ink-secondary px-3.5 py-2 rounded-lg hover:border-primary hover:text-primary transition-colors whitespace-nowrap"
              >
                Xem câu hỏi
              </button>
              <button
                onClick={() => removeQ(q.id)}
                className="text-xs text-ink-muted hover:text-danger transition-colors text-center py-1"
              >
                Bỏ khỏi bộ
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderSection = (qs: RecommendedQuestion[], priority: Priority) => {
    if (qs.length === 0) return null
    const meta = PRIORITY_META[priority]
    return (
      <section className="mb-7">
        <div className="flex items-center gap-2.5 mb-3 pb-2 border-b border-edge">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${meta.accentClass}`}>
            {meta.label}
          </span>
          <span className="text-xs text-ink-muted">{meta.desc}</span>
          <span className="ml-auto text-xs font-semibold text-ink tabular-nums">{qs.length} câu</span>
        </div>
        <div className="space-y-2.5">{qs.map(renderQuestion)}</div>
      </section>
    )
  }

  return (
    <div className="min-h-screen bg-canvas pb-24 lg:pb-0">
      <AuthNavbar />
      <JDFlowStepper currentStep={3} />

      <div className="max-w-[1100px] mx-auto px-6 py-8">
        <div className="mb-5">
          <h1 className="text-2xl font-semibold text-ink tracking-tight">Bộ câu hỏi dành cho JD này</h1>
          <p className="text-sm text-ink-secondary mt-1.5">Mỗi câu hỏi được chọn dựa trên yêu cầu bạn đã xác nhận. Bạn có thể bỏ hoặc thêm bất kỳ câu nào.</p>
        </div>

        {/* Context strip */}
        <div className="bg-panel border border-edge rounded-xl px-5 py-3 flex flex-wrap gap-x-6 gap-y-2 mb-6">
          <span className="text-xs font-semibold text-ink bg-canvas-subtle border border-edge px-2.5 py-1 rounded-full">Frontend Intern</span>
          {[
            { label: 'Yêu cầu', value: '8' },
            { label: 'Topics', value: `${totalTopics}` },
            { label: 'Tổng', value: `${active.length} câu` },
            { label: 'Thời gian', value: fmtTime(totalMin) },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-1.5">
              <span className="text-xs text-ink-muted">{item.label}:</span>
              <span className="text-xs font-semibold text-ink">{item.value}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-6">
          {/* Main list */}
          <div className="flex-1 min-w-0">
            {renderSection(mustQ, 'must')}
            {renderSection(shouldQ, 'should')}
            {renderSection(optionalQ, 'optional')}

            {/* Removed questions */}
            {removed.length > 0 && (
              <div className="border-t border-edge pt-4 mt-2">
                <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-2">Đã bỏ ({removed.length})</p>
                <div className="space-y-1.5">
                  {removed.map(q => (
                    <div key={q.id} className="flex items-center justify-between px-3 py-2 bg-canvas-subtle border border-edge rounded-xl opacity-60">
                      <span className="text-xs text-ink-secondary truncate">{q.title}</span>
                      <button onClick={() => restoreQ(q.id)} className="text-xs text-primary hover:underline font-medium ml-3 shrink-0">Khôi phục</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add from bank */}
            <div className="mt-5 pt-4 border-t border-edge">
              <button
                onClick={() => setDrawerOpen(true)}
                className="text-sm text-primary hover:underline font-medium flex items-center gap-1.5"
              >
                <Plus aria-hidden size={14} weight="bold" />
                Thêm câu hỏi từ Question Bank
              </button>
            </div>

            {/* Transparency */}
            <p className="text-xs text-ink-muted leading-relaxed mt-8 pb-2 border-t border-edge pt-4">
              Thứ tự câu hỏi dựa trên mức độ liên quan với JD. Đây không phải đánh giá năng lực hoặc dự đoán khả năng trúng tuyển.
            </p>
          </div>

          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="bg-panel border border-edge rounded-xl p-4 sticky top-20">
              <p className="text-xs font-bold text-ink-secondary uppercase tracking-wider mb-3">Kế hoạch luyện</p>

              <div className="space-y-2 mb-4">
                {([['must', mustQ.length], ['should', shouldQ.length], ['optional', optionalQ.length]] as const).map(([p, count]) => {
                  const meta = PRIORITY_META[p]
                  return (
                    <div key={p} className="flex items-center justify-between">
                      <span className="text-xs text-ink-muted">{meta.label}</span>
                      <span className="text-xs font-bold text-ink tabular-nums">{count} câu</span>
                    </div>
                  )
                })}
                <div className="border-t border-edge pt-2 flex items-center justify-between">
                  <span className="text-xs font-semibold text-ink-secondary">Tổng</span>
                  <span className="text-sm font-bold text-ink tabular-nums">{active.length} câu</span>
                </div>
                <p className="text-[11px] text-ink-muted">Ước tính: {fmtTime(totalMin)}</p>
              </div>

              <button
                onClick={() => navigate('/questions/js-event-loop')}
                className="w-full bg-primary hover:bg-primary-hover text-on-primary font-semibold py-3 rounded-xl text-sm transition-colors mb-2"
              >
                Bắt đầu luyện
              </button>
              <button
                onClick={() => setSaved(true)}
                className={`w-full border font-semibold py-2.5 rounded-xl text-sm transition-colors ${
                  saved ? 'border-ok text-ok bg-ok-soft' : 'border-edge text-ink-secondary hover:border-primary hover:text-primary'
                }`}
              >
                {saved ? <span className="inline-flex items-center gap-1"><Check aria-hidden size={14} weight="bold" />Đã lưu</span> : 'Lưu bộ câu hỏi'}
              </button>

              <div className="mt-3 pt-3 border-t border-edge">
                <button
                  onClick={() => navigate('/questions')}
                  className="text-xs text-ink-muted hover:text-primary transition-colors"
                >
                  <span className="inline-flex items-center gap-1">Xem toàn bộ Question Bank <ArrowRight aria-hidden size={13} /></span>
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile sticky bottom */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-panel border-t border-edge px-4 py-3 flex items-center gap-3 z-40">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-ink">{active.length} câu · {fmtTime(totalMin)}</p>
          <p className="text-xs text-ink-muted">{mustQ.length} cần · {shouldQ.length} nên luyện</p>
        </div>
        <button
          onClick={() => navigate('/questions/js-event-loop')}
          className="bg-primary hover:bg-primary-hover text-on-primary font-semibold px-6 py-2.5 rounded-xl text-sm transition-colors whitespace-nowrap shrink-0"
        >
          Bắt đầu luyện
        </button>
      </div>

      {/* Add question drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 bg-ink/25 z-50 flex justify-end" onClick={() => setDrawerOpen(false)}>
          <div className="bg-panel w-full max-w-[440px] h-full overflow-y-auto shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-panel border-b border-edge px-5 py-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-ink">Thêm câu hỏi</h2>
              <button onClick={() => setDrawerOpen(false)} className="p-1.5 hover:bg-canvas-subtle rounded-lg text-ink-muted hover:text-ink transition-colors">
                <X aria-hidden size={18} weight="bold" />
              </button>
            </div>
            <div className="p-5">
              <div className="relative mb-4">
                <MagnifyingGlass aria-hidden size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
                <input type="search" placeholder="Tìm câu hỏi..." value={drawerSearch} onChange={e => setDrawerSearch(e.target.value)}
                  className="w-full bg-canvas-subtle border border-edge rounded-xl pl-9 pr-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none" />
              </div>
              <div className="flex gap-1.5 mb-4 flex-wrap">
                {['JavaScript', 'React', 'CSS', 'Git', 'Behavioral'].map(t => (
                  <button key={t} className="text-xs px-3 py-1 border border-edge rounded-full text-ink-secondary hover:border-primary hover:text-primary transition-colors">{t}</button>
                ))}
              </div>
              <div className="space-y-2">
                {[
                  { id: 'css-grid',    title: 'CSS Grid vs Flexbox — khi nào dùng cái nào?', topic: 'CSS',        diff: 'Dễ' },
                  { id: 'ts-generics', title: 'TypeScript Generics — cách dùng và lợi ích',  topic: 'TypeScript', diff: 'Khó' },
                  { id: 'react-memo',  title: 'React.memo và useMemo — khi nào tối ưu?',     topic: 'React',      diff: 'Khó' },
                ].filter(q => !drawerSearch || q.title.toLowerCase().includes(drawerSearch.toLowerCase())).map(q => {
                  const already = active.some(aq => aq.id === q.id)
                  return (
                    <div key={q.id} className="flex items-center gap-3 p-3.5 border border-edge rounded-xl bg-canvas-subtle hover:border-edge-strong transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-ink">{q.title}</p>
                        <p className="text-xs text-ink-muted mt-0.5">{q.topic} · {q.diff}</p>
                      </div>
                      {already ? (
                        <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-ok"><Check aria-hidden size={13} weight="bold" />Đã thêm</span>
                      ) : (
                        <button className="text-xs text-primary border border-primary/30 font-semibold px-3 py-1.5 rounded-lg hover:bg-primary-soft transition-colors shrink-0">Thêm</button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
