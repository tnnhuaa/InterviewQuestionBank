import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  ArrowsOut,
  CaretLeft,
  CaretRight,
  Info,
  MagnifyingGlassMinus,
  MagnifyingGlassPlus,
  PencilSimple,
  Warning,
} from '@phosphor-icons/react'
import AuthNavbar from '@/shared/components/AuthNavbar'
import JDFlowStepper from '@/shared/components/JDFlowStepper'

interface TextSegment {
  text: string
  confidence: 'high' | 'low'
  corrected?: string
  correctionApplied?: boolean
}

const INITIAL_SEGMENTS: TextSegment[] = [
  { text: 'Frontend Intern', confidence: 'high' },
  { text: '', confidence: 'high' },
  { text: 'Requirements', confidence: 'high' },
  { text: '• Solid knowledge of JavaScript and ES6+', confidence: 'high' },
  { text: '• Basic understanding of React and component lifecycle', confidence: 'high' },
  { text: '• Familliarity with REST APl and HTTP methods', confidence: 'low', corrected: '• Familiarity with REST API and HTTP methods' },
  { text: '• Git knowledge and version control workflows', confidence: 'high' },
  { text: '• Good communication skills in English or Vietnamese', confidence: 'high' },
  { text: '', confidence: 'high' },
  { text: 'Nice to have', confidence: 'high' },
  { text: '• Experience with TypeScript', confidence: 'high' },
  { text: '• Basic understanding of CSS-in-JS solutions', confidence: 'high' },
]

export default function JDOCRReview() {
  const navigate = useNavigate()
  const [segments, setSegments] = useState<TextSegment[]>(INITIAL_SEGMENTS)
  const [editingIdx, setEditingIdx] = useState<number | null>(null)
  const [editValue, setEditValue] = useState('')
  const [activeTab, setActiveTab] = useState<'image' | 'content'>('image')
  const [highlightedLine, setHighlightedLine] = useState<number | null>(null)

  const hasLowConf = segments.some(s => s.confidence === 'low' && !s.correctionApplied)
  const anyEdited = segments.some(s => s.correctionApplied)

  const applyCorrection = (idx: number) => {
    setSegments(prev => prev.map((s, i) =>
      i === idx ? { ...s, text: s.corrected!, correctionApplied: true } : s
    ))
  }

  const startEdit = (idx: number, text: string) => {
    setEditingIdx(idx)
    setEditValue(text)
  }

  const commitEdit = () => {
    if (editingIdx === null) return
    setSegments(prev => prev.map((s, i) =>
      i === editingIdx ? { ...s, text: editValue, confidence: 'high', correctionApplied: true } : s
    ))
    setEditingIdx(null)
  }

  const isEmpty = segments.every(s => s.text.trim() === '')

  return (
    <div className="min-h-screen bg-canvas">
      <AuthNavbar />
      <JDFlowStepper currentStep={1} />

      <div className="max-w-[1100px] mx-auto px-6 py-8">
        <div className="mb-5">
          <h1 className="text-2xl font-semibold text-ink tracking-tight">Kiểm tra nội dung đã trích xuất</h1>
          <p className="text-sm text-ink-secondary mt-1.5">
            So sánh với ảnh gốc và chỉnh sửa nếu cần. Các đề xuất tiếp theo sẽ dựa trên phiên bản này.
          </p>
        </div>

        {/* Low-confidence alert */}
        {hasLowConf && (
          <div className="flex items-start gap-3 bg-notice/10 border border-notice/25 rounded-xl px-4 py-3 mb-5">
            <Warning aria-hidden size={18} className="mt-0.5 shrink-0 text-ink-secondary" />
            <div>
              <p className="text-sm font-semibold text-ink-secondary">Có {segments.filter(s => s.confidence === 'low' && !s.correctionApplied).length} đoạn cần kiểm tra</p>
              <p className="text-xs text-ink-muted mt-0.5">Những dòng được đánh dấu vàng có thể chưa được đọc chính xác — nhấn "Sửa" để áp dụng gợi ý.</p>
            </div>
          </div>
        )}

        {/* Mobile tabs */}
        <div className="md:hidden flex gap-1 mb-4 bg-canvas-subtle p-1 rounded-xl">
          {(['image', 'content'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 text-sm font-medium py-2 rounded-lg transition-colors ${activeTab === tab ? 'bg-panel text-ink shadow-sm' : 'text-ink-muted'}`}
            >
              {tab === 'image' ? 'Ảnh gốc' : 'Nội dung trích xuất'}
            </button>
          ))}
        </div>

        {/* Split workspace */}
        <div className="mb-5 min-h-[520px] overflow-hidden rounded-2xl border border-edge bg-panel">
          <div className="flex h-full">

            {/* Left: Image panel */}
            <div className={`${activeTab === 'content' ? 'hidden md:flex' : 'flex'} flex-col md:w-[42%] shrink-0 border-r border-edge`}>
              <div className="flex items-center justify-between px-4 py-3 border-b border-edge bg-canvas-subtle/60">
                <span className="text-xs font-semibold text-ink-secondary">Ảnh gốc</span>
                <div className="flex items-center gap-0.5">
                  {([
                    { icon: MagnifyingGlassPlus, title: 'Phóng to' },
                    { icon: MagnifyingGlassMinus, title: 'Thu nhỏ' },
                    { icon: ArrowsOut, title: 'Vừa khung' },
                  ] as const).map(ctrl => (
                    <button key={ctrl.title} title={ctrl.title} className="p-1.5 text-ink-muted hover:text-ink hover:bg-canvas rounded-lg transition-colors">
                      <ctrl.icon aria-hidden size={15} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 bg-canvas-subtle flex items-center justify-center p-6 relative">
                {/* Simulated JD document scan */}
                <div className="w-full max-w-[260px] bg-panel rounded-xl border border-edge-strong shadow-md px-5 py-5 font-mono text-[11px] leading-[22px] text-ink-secondary select-none">
                  <p className="font-bold text-ink text-[13px] mb-2.5">Frontend Intern</p>
                  <p className="font-semibold text-[11px] text-ink-secondary mb-1">Requirements</p>
                  <p>• Solid knowledge of JavaScript and ES6+</p>
                  <p>• Basic understanding of React and component lifecycle</p>
                  <p
                    className={`cursor-pointer rounded px-0.5 -mx-0.5 transition-colors ${highlightedLine === 5 ? 'bg-notice/40 outline outline-1 outline-notice/50' : 'hover:bg-notice/15'}`}
                    onClick={() => { setHighlightedLine(5); setActiveTab('content') }}
                    title="Nhấn để xem trong nội dung trích xuất"
                  >
                    • Familiarity with REST API and HTTP methods
                  </p>
                  <p>• Git knowledge and version control workflows</p>
                  <p>• Good communication skills</p>
                  <p className="font-semibold text-[11px] text-ink-secondary mt-2.5 mb-1">Nice to have</p>
                  <p>• Experience with TypeScript</p>
                  <p>• Basic understanding of CSS-in-JS solutions</p>
                </div>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-ink/65 text-on-primary/90 text-xs px-3 py-1.5 rounded-full">
                  <button aria-label="Trang trước" className="hover:text-on-primary transition-colors"><CaretLeft aria-hidden size={13} /></button>
                  <span>Trang 1 / 1</span>
                  <button aria-label="Trang sau" className="hover:text-on-primary transition-colors"><CaretRight aria-hidden size={13} /></button>
                </div>
              </div>
            </div>

            {/* Right: Extracted content */}
            <div className={`${activeTab === 'image' ? 'hidden md:flex' : 'flex'} flex-col flex-1`}>
              <div className="flex items-center justify-between px-4 py-3 border-b border-edge bg-canvas-subtle/60">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-ink-secondary">Nội dung trích xuất</span>
                  {anyEdited && (
                    <span className="text-[11px] font-semibold text-primary bg-primary-soft border border-primary/20 px-2 py-0.5 rounded-full">
                      Đã chỉnh sửa
                    </span>
                  )}
                </div>
                <span className="text-xs text-ink-muted">Nhấp vào dòng để chỉnh sửa</span>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-0.5">
                  {segments.map((seg, i) => {
                    const isLow = seg.confidence === 'low' && !seg.correctionApplied
                    const isEditing = editingIdx === i
                    const isHL = highlightedLine === i

                    if (isEditing) {
                      return (
                        <div key={i} className="px-2 py-1">
                          <input
                            autoFocus
                            value={editValue}
                            onChange={e => setEditValue(e.target.value)}
                            onBlur={commitEdit}
                            onKeyDown={e => e.key === 'Enter' && commitEdit()}
                            className="w-full font-mono text-sm text-ink bg-canvas-subtle border border-primary rounded-lg px-3 py-1.5 outline-none ring-2 ring-primary/20"
                          />
                        </div>
                      )
                    }

                    if (seg.text === '') {
                      return <div key={i} className="h-3" />
                    }

                    return (
                      <div
                        key={i}
                        onClick={() => !isLow && startEdit(i, seg.text)}
                        className={`group flex items-center gap-2 px-2 py-1 rounded-lg transition-colors ${
                          isLow
                            ? 'bg-notice/15 hover:bg-notice/20'
                            : isHL
                            ? 'bg-primary-soft'
                            : 'hover:bg-canvas-subtle cursor-text'
                        }`}
                      >
                        <span className={`font-mono text-sm leading-6 flex-1 min-w-0 ${isLow ? 'text-notice-ink' : 'text-ink'}`}>
                          {seg.text}
                        </span>

                        {isLow ? (
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-xs text-notice font-medium border border-notice/40 bg-panel px-2 py-0.5 rounded-md">
                              Cần kiểm tra
                            </span>
                            <button
                              onClick={e => { e.stopPropagation(); applyCorrection(i) }}
                              className="text-xs text-primary font-semibold border border-primary/30 bg-primary-soft hover:bg-primary/10 px-2.5 py-0.5 rounded-md transition-colors"
                            >
                              Sửa
                            </button>
                          </div>
                        ) : (
                          <PencilSimple aria-hidden size={14} className="shrink-0 text-ink-muted opacity-0 transition-opacity group-hover:opacity-100" />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer notice */}
        <div className="flex items-center gap-2.5 text-xs text-ink-muted bg-canvas-subtle border border-edge rounded-xl px-4 py-3 mb-6">
          <Info aria-hidden size={15} className="shrink-0 text-primary" />
          <span>
            Các đề xuất câu hỏi tiếp theo sẽ dựa trên phiên bản bạn xác nhận ở đây.
            Bạn có thể chỉnh sửa bằng cách nhấp vào từng dòng.
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/job-descriptions/new')}
            className="inline-flex items-center gap-2 text-sm text-ink-secondary hover:text-ink border border-edge px-4 py-2.5 rounded-xl transition-colors bg-panel"
          >
            <ArrowLeft aria-hidden size={15} />
            Quét lại
          </button>
          <button
            onClick={() => navigate('/job-descriptions/demo-jd/mapping')}
            disabled={isEmpty}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed text-on-primary font-semibold px-8 py-3 rounded-xl text-sm transition-colors"
          >
            Xác nhận nội dung
            <ArrowRight aria-hidden size={16} weight="bold" />
          </button>
        </div>
      </div>
    </div>
  )
}
