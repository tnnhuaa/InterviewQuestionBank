import { useState } from 'react'
import { Check } from '@phosphor-icons/react'
import AuthNavbar from '@/shared/components/AuthNavbar'
import { FEEDBACK_DATA } from '@/shared/data/mock'
import type { FeedbackRubric } from '@/shared/data/mock'

const INITIAL_RUBRIC: FeedbackRubric[] = [
  { criterion: 'Kiến thức kỹ thuật', score: 0, maxScore: 5, explanation: '', evidence: '' },
  { criterion: 'Cấu trúc câu trả lời', score: 0, maxScore: 5, explanation: '', evidence: '' },
  { criterion: 'Giao tiếp', score: 0, maxScore: 5, explanation: '', evidence: '' },
  { criterion: 'Xử lý câu hỏi tiếp theo', score: 0, maxScore: 5, explanation: '', evidence: '' },
]

export default function MentorFeedbackForm() {
  const [rubric, setRubric] = useState<FeedbackRubric[]>(INITIAL_RUBRIC)
  const [strengths, setStrengths] = useState('')
  const [improvements, setImprovements] = useState('')
  const [nextActions, setNextActions] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [draft, setDraft] = useState(false)

  const updateScore = (idx: number, score: number) => {
    setRubric(prev => prev.map((r, i) => i === idx ? { ...r, score } : r))
  }

  const updateField = (idx: number, field: 'explanation' | 'evidence', val: string) => {
    setRubric(prev => prev.map((r, i) => i === idx ? { ...r, [field]: val } : r))
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-canvas">
        <AuthNavbar />
        <div className="max-w-[480px] mx-auto px-6 py-20 text-center">
          <div className="w-14 h-14 rounded-full bg-ok-soft border-2 border-ok flex items-center justify-center mx-auto mb-6">
            <Check aria-hidden size={25} weight="bold" className="text-ok" />
          </div>
          <h1 className="text-[22px] font-semibold text-ink mb-2">Feedback đã được gửi</h1>
          <p className="text-sm text-ink-secondary mb-2">Học viên sẽ nhận được feedback ngay bây giờ.</p>
          <p className="text-xs text-ink-muted">Sau khi gửi, feedback không thể chỉnh sửa theo chính sách audit.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-canvas">
      <AuthNavbar />

      <div className="max-w-[760px] mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-[22px] font-semibold text-ink">Viết feedback</h1>
            <p className="text-xs text-ink-muted mt-1">BK-2024-001 · JavaScript & React · {FEEDBACK_DATA.date}</p>
          </div>
          <button onClick={() => setDraft(true)} className="text-sm border border-edge text-ink-secondary hover:border-primary hover:text-primary font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
            {draft && <Check aria-hidden size={14} weight="bold" />}
            {draft ? 'Đã lưu nháp' : 'Lưu nháp'}
          </button>
        </div>

        <div className="space-y-5">
          {/* Rubric */}
          <div className="bg-panel border border-edge rounded-xl p-6">
            <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-4">Đánh giá theo tiêu chí</p>
            {rubric.map((r, idx) => (
              <div key={r.criterion} className="py-5 border-b border-edge last:border-b-0">
                <p className="text-sm font-semibold text-ink mb-2">{r.criterion}</p>
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: r.maxScore }, (_, i) => i + 1).map(i => (
                    <button key={i} onClick={() => updateScore(idx, i)}
                      className={`w-8 h-8 rounded-md border text-sm font-medium transition-colors ${
                        i <= r.score ? 'bg-primary text-on-primary border-primary' : 'border-edge text-ink-muted hover:border-primary hover:text-primary'
                      }`}
                    >
                      {i}
                    </button>
                  ))}
                  <span className="text-xs text-ink-muted ml-2">
                    {r.score === 5 ? 'Xuất sắc' : r.score === 4 ? 'Tốt' : r.score === 3 ? 'Đạt' : r.score === 2 ? 'Cần cải thiện' : r.score === 1 ? 'Chưa đạt' : '—'}
                  </span>
                </div>
                <div className="space-y-2">
                  <textarea rows={2} placeholder="Giải thích ngắn gọn..." value={r.explanation} onChange={e => updateField(idx, 'explanation', e.target.value)}
                    className="w-full bg-canvas-subtle border border-edge rounded-lg px-3 py-2 text-xs text-ink placeholder:text-ink-muted focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none resize-none" />
                  <input type="text" placeholder="Dẫn chứng từ buổi phỏng vấn (tùy chọn)..." value={r.evidence} onChange={e => updateField(idx, 'evidence', e.target.value)}
                    className="w-full bg-canvas-subtle border border-edge rounded-lg px-3 py-2 text-xs text-ink placeholder:text-ink-muted focus:border-primary outline-none" />
                </div>
              </div>
            ))}
          </div>

          {/* Strengths & Improvements */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-panel border border-edge rounded-xl p-5">
              <label className="block text-xs font-semibold text-ok uppercase tracking-wider mb-2">Điểm mạnh <span className="text-accent">*</span></label>
              <textarea rows={3} placeholder="Những gì học viên đã làm tốt..." value={strengths} onChange={e => setStrengths(e.target.value)}
                className="w-full bg-ok-soft/50 border border-ok/20 rounded-lg px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-ok focus:ring-1 focus:ring-ok/20 outline-none resize-none" />
            </div>
            <div className="bg-panel border border-edge rounded-xl p-5">
              <label className="block text-xs font-semibold text-notice-ink uppercase tracking-wider mb-2">Cần cải thiện <span className="text-accent">*</span></label>
              <textarea rows={3} placeholder="Những điểm cần phát triển..." value={improvements} onChange={e => setImprovements(e.target.value)}
                className="w-full bg-notice-soft/50 border border-notice/20 rounded-lg px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-notice/50 focus:ring-1 focus:ring-notice/20 outline-none resize-none" />
            </div>
          </div>

          {/* Next actions */}
          <div className="bg-panel border border-edge rounded-xl p-5">
            <label className="block text-xs font-semibold text-ink-muted uppercase tracking-wider mb-2">Bước tiếp theo <span className="text-accent">*</span></label>
            <textarea rows={3} placeholder="Đề xuất câu hỏi hoặc chủ đề học viên nên luyện tiếp..." value={nextActions} onChange={e => setNextActions(e.target.value)}
              className="w-full bg-canvas-subtle border border-edge rounded-lg px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none resize-none" />
          </div>

          {/* Submit */}
          {showConfirm ? (
            <div className="bg-notice-soft border border-notice/20 rounded-xl p-5">
              <p className="text-sm font-semibold text-ink mb-1">Xác nhận gửi feedback</p>
              <p className="text-xs text-ink-secondary mb-4">Feedback sẽ được gửi cho học viên ngay sau khi xác nhận. Sau khi gửi, bạn không thể chỉnh sửa.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowConfirm(false)} className="flex-1 border border-edge text-ink-secondary font-medium py-2.5 rounded-lg text-sm hover:border-primary transition-colors">Quay lại</button>
                <button onClick={() => setSubmitted(true)} className="flex-1 bg-primary hover:bg-primary-hover text-on-primary font-medium py-2.5 rounded-lg text-sm transition-colors">Gửi feedback</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setShowConfirm(true)} className="w-full bg-primary hover:bg-primary-hover text-on-primary font-medium px-6 py-3 rounded-lg text-sm transition-colors">
              Xem lại và gửi feedback
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
