import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { BookmarkSimple, CaretRight } from '@phosphor-icons/react'
import PublicNavbar from '@/shared/components/PublicNavbar'
import AuthNavbar from '@/shared/components/AuthNavbar'
import StatusBadge from '@/shared/components/StatusBadge'
import { QUESTIONS } from '@/shared/data/mock'
import { useApp } from '@/app/AppContext'
import type { PracticeStatus } from '@/shared/data/mock'

const STATUS_OPTIONS: { value: PracticeStatus; label: string }[] = [
  { value: 'not-started', label: 'Chưa luyện' },
  { value: 'practicing', label: 'Đang luyện' },
  { value: 'confident', label: 'Tự tin' },
]

const DIFFICULTY_LABELS = { easy: 'Dễ', medium: 'Trung bình', hard: 'Khó' }

export default function QuestionDetail() {
  const { questionId } = useParams()
  const { role } = useApp()
  const navigate = useNavigate()
  const question = QUESTIONS.find(q => q.id === questionId) || QUESTIONS[0]
  const [status, setStatus] = useState<PracticeStatus>(question.status)
  const [bookmarked, setBookmarked] = useState(question.bookmarked)
  const related = QUESTIONS.filter(q => q.id !== question.id && q.tags.some(t => question.tags.includes(t))).slice(0, 3)

  return (
    <div className="min-h-screen bg-canvas">
      {role === 'public' ? <PublicNavbar /> : <AuthNavbar />}

      <div className="max-w-[1280px] mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-ink-muted mb-6">
          <Link to="/questions" className="hover:text-ink transition-colors">Question Bank</Link>
          <span>/</span>
          <span className="text-ink-secondary">{question.tags[0]}</span>
        </div>

        <div className="flex gap-8">
          {/* Main */}
          <div className="flex-1 min-w-0 max-w-[760px]">
            {/* Metadata */}
            <div className="flex items-center gap-2 flex-wrap mb-4">
              {question.tags.map(tag => (
                <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-canvas-subtle text-ink-secondary border border-edge font-medium">{tag}</span>
              ))}
              <span className={`text-xs font-medium ${question.difficulty === 'easy' ? 'text-ok' : question.difficulty === 'medium' ? 'text-notice-ink' : 'text-danger'}`}>
                {DIFFICULTY_LABELS[question.difficulty]}
              </span>
              {question.source && <span className="text-xs text-ink-muted">· Hỏi tại {question.source}</span>}
            </div>

            <h1 className="text-[22px] font-semibold text-ink leading-[30px] mb-6">{question.titleVi}</h1>

            {/* Practice controls */}
            {role !== 'public' && (
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-edge">
                <div className="flex items-center gap-1 bg-panel border border-edge rounded-lg p-0.5">
                  {STATUS_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setStatus(opt.value)}
                      className={`text-xs px-3 py-1.5 rounded-md font-medium transition-colors ${
                        status === opt.value ? 'bg-primary text-on-primary' : 'text-ink-secondary hover:text-ink'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setBookmarked(!bookmarked)}
                  className={`p-2 rounded-lg border transition-colors ${bookmarked ? 'bg-primary-soft text-primary border-primary/20' : 'border-edge text-ink-muted hover:border-primary hover:text-primary'}`}
                  aria-label={bookmarked ? 'Bỏ đánh dấu' : 'Đánh dấu'}
                >
                  <BookmarkSimple aria-hidden size={16} weight={bookmarked ? 'fill' : 'regular'} />
                </button>
                <StatusBadge status={status} />
              </div>
            )}

            {/* Guidance */}
            <div className="mb-8">
              <h2 className="text-base font-semibold text-ink mb-4">Điểm một câu trả lời tốt nên đề cập</h2>
              <div className="space-y-2">
                {question.guidancePoints.map((point, i) => (
                  <div key={i} className="flex gap-3 items-start p-3 bg-panel border border-edge rounded-lg">
                    <div className="w-5 h-5 rounded-full bg-primary-soft text-primary flex items-center justify-center text-[10px] font-semibold shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <p className="text-sm text-ink-secondary leading-relaxed">{point}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-ink-muted mt-3 italic">Với câu hỏi behavioral, không có câu trả lời "đúng" duy nhất. Dùng cấu trúc STAR và ví dụ thực tế.</p>
            </div>

            {/* Related questions */}
            {related.length > 0 && (
              <div>
                <h2 className="text-base font-semibold text-ink mb-4">Câu hỏi liên quan</h2>
                <div className="space-y-1">
                  {related.map(q => (
                    <button
                      key={q.id}
                      onClick={() => navigate(`/questions/${q.id}`)}
                      className="w-full text-left flex items-center gap-3 p-3 rounded-lg hover:bg-primary-soft/30 transition-colors group"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-ink group-hover:text-primary transition-colors">{q.titleVi}</p>
                        <div className="flex gap-1.5 mt-1 flex-wrap">
                          {q.tags.map(t => (
                            <span key={t} className="text-[10px] text-ink-muted">{t}</span>
                          ))}
                        </div>
                      </div>
                      <CaretRight aria-hidden size={16} className="shrink-0 text-ink-muted transition-colors group-hover:text-primary" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sticky right panel */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="bg-panel border border-edge rounded-xl p-6 sticky top-20">
              <p className="text-sm font-semibold text-ink mb-1">Muốn luyện câu này với mentor?</p>
              <p className="text-xs text-ink-muted mb-4">Nhận feedback chuyên sâu cho câu hỏi này từ mentor được xác minh.</p>
              <div className="flex gap-1.5 flex-wrap mb-5">
                {question.tags.map(tag => (
                  <span key={tag} className="text-[11px] px-2 py-0.5 rounded-full bg-primary-soft text-primary border border-primary/20 font-medium">{tag}</span>
                ))}
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-canvas-subtle text-ink-secondary border border-edge">{question.interviewType}</span>
              </div>
              <button
                onClick={() => navigate('/mentors')}
                className="w-full bg-primary hover:bg-primary-hover text-on-primary font-medium px-4 py-2.5 rounded-lg text-sm transition-colors mb-2"
              >
                Tìm mentor cho chủ đề này
              </button>
              {role !== 'public' && (
                <button
                  onClick={() => setStatus('practicing')}
                  className="w-full border border-edge text-ink-secondary hover:border-primary hover:text-primary font-medium px-4 py-2.5 rounded-lg text-sm transition-colors"
                >
                  Đánh dấu đang luyện
                </button>
              )}
              <div className="mt-5 pt-4 border-t border-edge">
                <p className="text-xs text-ink-muted text-center">{question.practiceCount} người đã luyện câu hỏi này</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
