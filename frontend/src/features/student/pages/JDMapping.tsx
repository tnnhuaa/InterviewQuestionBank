import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, Plus, X } from '@phosphor-icons/react'
import AuthNavbar from '@/shared/components/AuthNavbar'
import JDFlowStepper from '@/shared/components/JDFlowStepper'

type MappingStatus = 'mapped' | 'needs-confirmation' | 'unsupported'

interface Mapping {
  id: string
  requirement: string
  source: string
  status: MappingStatus
  topics: string[]
  options?: string[]
  unsupportedReason?: string
  selected: string[]
  why: string
}

const INITIAL_MAPPINGS: Mapping[] = [
  { id: '1', requirement: 'Solid knowledge of JavaScript and ES6+', source: 'Requirements · dòng 1', status: 'mapped', topics: ['JavaScript', 'ES6+', 'Frontend Fundamentals'], selected: [], why: 'JD đề cập trực tiếp "JavaScript and ES6+"' },
  { id: '2', requirement: 'Basic understanding of React and component lifecycle', source: 'Requirements · dòng 2', status: 'mapped', topics: ['React', 'Frontend'], selected: [], why: 'JD đề cập trực tiếp "React and component lifecycle"' },
  { id: '3', requirement: 'Familiarity with REST API and HTTP methods', source: 'Requirements · dòng 3', status: 'mapped', topics: ['REST API', 'HTTP'], selected: [], why: 'JD đề cập trực tiếp "REST API and HTTP methods"' },
  { id: '4', requirement: 'Git knowledge and version control workflows', source: 'Requirements · dòng 4', status: 'mapped', topics: ['Git'], selected: [], why: 'JD đề cập trực tiếp "Git knowledge"' },
  { id: '5', requirement: 'Good communication skills in English or Vietnamese', source: 'Requirements · dòng 5', status: 'mapped', topics: ['Behavioral', 'Communication'], selected: [], why: 'JD yêu cầu kỹ năng giao tiếp — mapped vào nhóm Behavioral' },
  { id: '6', requirement: 'Experience with modern frontend frameworks', source: 'Nice to have · dòng 1', status: 'needs-confirmation', topics: [], options: ['React', 'Vue', 'Angular'], selected: ['React'], why: 'JD không chỉ rõ framework cụ thể — bạn cần chọn nội dung muốn luyện.' },
  { id: '7', requirement: 'Basic understanding of CSS-in-JS solutions', source: 'Nice to have · dòng 2', status: 'mapped', topics: ['CSS', 'Frontend'], selected: [], why: 'JD đề cập "CSS-in-JS" — mapped vào CSS Frontend' },
  { id: '8', requirement: 'Knowledge of proprietary internal tooling (XYZ Platform)', source: 'Requirements · dòng 6', status: 'unsupported', topics: [], selected: [], unsupportedReason: 'Hiện chưa có topic phù hợp trong Question Bank.', why: '' },
]

const TAXONOMY_OPTIONS = ['JavaScript', 'React', 'Vue', 'Angular', 'CSS', 'TypeScript', 'REST API', 'Git', 'Behavioral', 'System Design', 'Testing', 'Frontend Architecture', 'HTTP']

const STATUS_META: Record<MappingStatus, { label: string; borderColor: string; badgeClass: string; dotClass: string }> = {
  mapped:              { label: 'Đã mapping',    borderColor: 'border-l-ok',      badgeClass: 'text-ok bg-ok-soft border-ok/30',               dotClass: 'bg-ok' },
  'needs-confirmation':{ label: 'Cần xác nhận', borderColor: 'border-l-notice',  badgeClass: 'text-notice-ink bg-notice/20 border-notice/40',   dotClass: 'bg-notice' },
  unsupported:         { label: 'Chưa hỗ trợ',  borderColor: 'border-l-edge-strong', badgeClass: 'text-ink-muted bg-canvas-subtle border-edge', dotClass: 'bg-edge-strong' },
}

export default function JDMapping() {
  const navigate = useNavigate()
  const [mappings, setMappings] = useState<Mapping[]>(INITIAL_MAPPINGS)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [taxonomySearch, setTaxonomySearch] = useState('')
  const [sourceOpenId, setSourceOpenId] = useState<string | null>(null)

  const mapped     = mappings.filter(m => m.status === 'mapped')
  const needsConf  = mappings.filter(m => m.status === 'needs-confirmation')
  const unsupported = mappings.filter(m => m.status === 'unsupported')
  const allTopics   = [...new Set(mapped.flatMap(m => m.topics))]
  const hasValid    = mapped.length > 0 || needsConf.some(m => m.selected.length > 0)

  const toggleOption = (id: string, opt: string) => {
    setMappings(prev => prev.map(m => {
      if (m.id !== id) return m
      const sel = m.selected.includes(opt) ? m.selected.filter(s => s !== opt) : [...m.selected, opt]
      return { ...m, selected: sel }
    }))
  }

  const confirmSelection = (id: string) => {
    setMappings(prev => prev.map(m =>
      m.id !== id ? m : { ...m, status: 'mapped', topics: m.selected }
    ))
  }

  const removeTopic = (id: string, topic: string) => {
    setMappings(prev => prev.map(m => {
      if (m.id !== id) return m
      const topics = m.topics.filter(t => t !== topic)
      return { ...m, topics, status: topics.length === 0 ? 'needs-confirmation' : 'mapped' }
    }))
  }

  const addTopic = (id: string, topic: string) => {
    setMappings(prev => prev.map(m =>
      m.id !== id || m.topics.includes(topic) ? m : { ...m, topics: [...m.topics, topic], status: 'mapped' }
    ))
    setEditingId(null)
    setTaxonomySearch('')
  }

  const filteredTaxonomy = TAXONOMY_OPTIONS.filter(t =>
    t.toLowerCase().includes(taxonomySearch.toLowerCase())
  )

  const renderRow = (m: Mapping) => {
    const meta = STATUS_META[m.status]
    const sourceOpen = sourceOpenId === m.id

    return (
      <div
        key={m.id}
        className={`bg-panel border border-edge border-l-4 ${meta.borderColor} rounded-xl overflow-hidden transition-shadow hover:shadow-sm`}
      >
        <div className="p-4">
          {/* Header row */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-ink-muted mb-0.5">{m.source}</p>
              <p className="text-sm font-medium text-ink leading-snug">"{m.requirement}"</p>
            </div>
            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border flex items-center gap-1.5 shrink-0 whitespace-nowrap ${meta.badgeClass}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${meta.dotClass} shrink-0`} />
              {meta.label}
            </span>
          </div>

          {/* Mapped: topic chips */}
          {m.status === 'mapped' && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <ArrowRight aria-hidden size={13} className="shrink-0 text-ink-muted" />
              {m.topics.map(t => (
                <button
                  key={t}
                  onClick={() => removeTopic(m.id, t)}
                  className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-ok-soft border border-ok/25 text-ok rounded-full font-medium hover:bg-danger-soft hover:border-danger/25 hover:text-danger transition-colors group"
                  title="Nhấn để xóa topic này"
                >
                  {t}
                  <X aria-hidden size={10} weight="bold" className="opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
              ))}

              {/* Add topic */}
              {editingId === m.id ? (
                <div className="relative">
                  <input
                    autoFocus
                    value={taxonomySearch}
                    onChange={e => setTaxonomySearch(e.target.value)}
                    onBlur={() => { setEditingId(null); setTaxonomySearch('') }}
                    placeholder="Tìm topic…"
                    className="text-xs px-2.5 py-1 border border-primary rounded-full outline-none w-28 bg-panel focus:ring-2 focus:ring-primary/20"
                  />
                  {filteredTaxonomy.length > 0 && (
                    <div className="absolute top-full left-0 mt-1 bg-panel border border-edge rounded-xl shadow-md py-1 z-20 w-40">
                      {filteredTaxonomy.slice(0, 6).map(t => (
                        <button
                          key={t}
                          onMouseDown={() => addTopic(m.id, t)}
                          className="w-full text-left text-xs px-3 py-1.5 text-ink-secondary hover:bg-canvas hover:text-ink transition-colors"
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => { setEditingId(m.id); setTaxonomySearch('') }}
                  className="text-xs text-ink-muted hover:text-primary border border-dashed border-edge hover:border-primary px-2.5 py-1 rounded-full transition-colors"
                >
                  <span className="inline-flex items-center gap-1"><Plus aria-hidden size={12} />topic</span>
                </button>
              )}
            </div>
          )}

          {/* Needs confirmation: option picker */}
          {m.status === 'needs-confirmation' && (
            <div>
              <p className="text-xs text-ink-muted mb-2">{m.why}</p>
              <div className="flex gap-1.5 flex-wrap mb-2.5">
                {(m.options ?? []).map(opt => {
                  const sel = m.selected.includes(opt)
                  return (
                    <button
                      key={opt}
                      onClick={() => toggleOption(m.id, opt)}
                      className={`text-sm px-3.5 py-1.5 rounded-full border font-medium transition-colors ${
                        sel ? 'bg-primary text-on-primary border-primary' : 'border-edge text-ink-secondary hover:border-primary hover:text-primary'
                      }`}
                    >
                      {opt}
                    </button>
                  )
                })}
              </div>
              {m.selected.length > 0 && (
                <button
                  onClick={() => confirmSelection(m.id)}
                  className="text-xs text-ok border border-ok/30 bg-ok-soft px-3 py-1.5 rounded-full font-medium hover:bg-ok/15 transition-colors"
                >
                  <span className="inline-flex items-center gap-1"><Check aria-hidden size={13} weight="bold" />Xác nhận ({m.selected.join(', ')})</span>
                </button>
              )}
            </div>
          )}

          {/* Unsupported */}
          {m.status === 'unsupported' && (
            <div className="flex items-center justify-between flex-wrap gap-2">
              <p className="text-xs text-ink-muted">{m.unsupportedReason}</p>
              <div className="flex gap-2">
                <button className="text-xs border border-edge text-ink-muted px-3 py-1.5 rounded-full hover:border-edge-strong hover:text-ink-secondary transition-colors">Bỏ qua</button>
                <button onClick={() => navigate('/questions')} className="inline-flex items-center gap-1 text-xs border border-edge text-ink-secondary px-3 py-1.5 rounded-full hover:border-primary hover:text-primary transition-colors">Tìm thủ công <ArrowRight aria-hidden size={12} /></button>
              </div>
            </div>
          )}
        </div>

        {/* Source traceability footer */}
        <div className="border-t border-edge/60 px-4 py-2 flex items-center gap-4 bg-canvas-subtle/40">
          <button
            onClick={() => setSourceOpenId(sourceOpen ? null : m.id)}
            className="text-xs text-primary hover:underline flex items-center gap-1"
          >
            <ArrowRight aria-hidden size={13} />
            Xem đoạn JD
          </button>
          {sourceOpen && (
            <span className="text-xs text-ink-secondary italic flex-1 truncate">"{m.requirement}" — {m.source}</span>
          )}
          {m.why && !sourceOpen && (
            <span className="text-[11px] text-ink-muted ml-auto">{m.why}</span>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-canvas">
      <AuthNavbar />
      <JDFlowStepper currentStep={2} />

      <div className="max-w-[1100px] mx-auto px-6 py-8">
        <div className="mb-5">
          <h1 className="text-2xl font-semibold text-ink tracking-tight">Chúng tôi hiểu JD của bạn như thế nào?</h1>
          <p className="text-sm text-ink-secondary mt-1.5">Kiểm tra từng yêu cầu và cách chúng được liên kết với nội dung luyện tập. Bạn có thể chỉnh sửa bất kỳ mapping nào.</p>
        </div>

        {/* Context strip */}
        <div className="bg-panel border border-edge rounded-xl px-5 py-3.5 flex flex-wrap gap-x-8 gap-y-2 mb-6">
          {[
            { label: 'Vị trí', value: 'Frontend Intern' },
            { label: 'Cấp độ', value: 'Intern / Entry level' },
            { label: 'Loại phỏng vấn', value: 'Technical' },
            { label: 'Yêu cầu', value: `${mappings.length} mục` },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-2">
              <span className="text-xs text-ink-muted">{item.label}:</span>
              <span className="text-xs font-semibold text-ink">{item.value}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-6">
          {/* Mapping list */}
          <div className="flex-1 min-w-0">
            {mapped.length > 0 && (
              <section className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-ok shrink-0" />
                  <h2 className="text-xs font-bold text-ink-secondary uppercase tracking-wider">Đã mapping</h2>
                  <span className="text-xs text-ink-muted ml-auto">{mapped.length} yêu cầu</span>
                </div>
                <div className="space-y-2.5">{mapped.map(renderRow)}</div>
              </section>
            )}

            {needsConf.length > 0 && (
              <section className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-notice shrink-0" />
                  <h2 className="text-xs font-bold text-ink-secondary uppercase tracking-wider">Cần xác nhận</h2>
                  <span className="text-xs text-ink-muted ml-auto">{needsConf.length} yêu cầu</span>
                </div>
                <div className="space-y-2.5">{needsConf.map(renderRow)}</div>
              </section>
            )}

            {unsupported.length > 0 && (
              <section className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-edge-strong shrink-0" />
                  <h2 className="text-xs font-bold text-ink-secondary uppercase tracking-wider">Chưa hỗ trợ</h2>
                  <span className="text-xs text-ink-muted ml-auto">{unsupported.length} yêu cầu</span>
                </div>
                <div className="space-y-2.5">{unsupported.map(renderRow)}</div>
              </section>
            )}

            {/* Back link (desktop) */}
            <div className="mt-4 pt-4 border-t border-edge">
              <button
                onClick={() => navigate('/job-descriptions/demo-jd/review')}
                className="text-sm text-ink-muted hover:text-ink transition-colors"
              >
                <span className="inline-flex items-center gap-1"><ArrowLeft aria-hidden size={15} />Quay lại kiểm tra nội dung</span>
              </button>
            </div>
          </div>

          {/* Summary sidebar */}
          <aside className="hidden lg:block w-52 shrink-0">
            <div className="bg-panel border border-edge rounded-xl p-4 sticky top-20">
              <p className="text-xs font-bold text-ink-secondary uppercase tracking-wider mb-3">Topics sẽ luyện</p>

              <div className="space-y-1.5 mb-4 min-h-[60px]">
                {allTopics.length === 0 ? (
                  <p className="text-xs text-ink-muted italic">Chưa có topic nào.</p>
                ) : (
                  allTopics.map(t => (
                    <div key={t} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      <span className="text-xs text-ink-secondary">{t}</span>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t border-edge pt-3 space-y-1.5 mb-4">
                {[
                  { label: 'Đã mapping', value: mapped.length, color: 'text-ok' },
                  { label: 'Cần xác nhận', value: needsConf.length, color: 'text-notice-ink' },
                  { label: 'Chưa hỗ trợ', value: unsupported.length, color: 'text-ink-muted' },
                ].map(row => (
                  <div key={row.label} className="flex items-center justify-between">
                    <span className="text-xs text-ink-muted">{row.label}</span>
                    <span className={`text-xs font-bold tabular-nums ${row.color}`}>{row.value}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate('/preparation-plans/demo-plan')}
                disabled={!hasValid}
                className="w-full bg-primary hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed text-on-primary font-semibold py-2.5 rounded-xl text-sm transition-colors"
              >
                <span className="inline-flex items-center gap-1">Tạo bộ câu hỏi <ArrowRight aria-hidden size={15} /></span>
              </button>
            </div>
          </aside>
        </div>

        {/* Mobile CTA */}
        <div className="lg:hidden flex justify-end mt-6">
          <button
            onClick={() => navigate('/preparation-plans/demo-plan')}
            disabled={!hasValid}
            className="bg-primary hover:bg-primary-hover disabled:opacity-40 text-on-primary font-semibold px-8 py-3 rounded-xl text-sm transition-colors"
          >
            <span className="inline-flex items-center gap-1">Tạo bộ câu hỏi <ArrowRight aria-hidden size={15} /></span>
          </button>
        </div>
      </div>
    </div>
  )
}
