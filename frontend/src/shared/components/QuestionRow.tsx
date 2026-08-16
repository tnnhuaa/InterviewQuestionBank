import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookmarkSimple, CaretRight } from '@phosphor-icons/react'
import type { Question } from '@/shared/data/mock'
import StatusBadge from './StatusBadge'

const DIFFICULTY_CONFIG = {
  easy: { label: 'Dễ', className: 'text-ok font-medium' },
  medium: { label: 'Trung bình', className: 'text-notice-ink font-medium' },
  hard: { label: 'Khó', className: 'text-danger font-medium' },
}

interface QuestionRowProps {
  question: Question
  showStatus?: boolean
}

export default function QuestionRow({ question, showStatus = true }: QuestionRowProps) {
  const [bookmarked, setBookmarked] = useState(question.bookmarked)
  const navigate = useNavigate()
  const diff = DIFFICULTY_CONFIG[question.difficulty]

  return (
    <div
      className="group flex items-start gap-4 py-4 px-4 -mx-4 rounded-lg hover:bg-primary-soft/40 transition-colors cursor-pointer"
      onClick={() => navigate(`/questions/${question.id}`)}
    >
      <div className="flex-1 min-w-0">
        {question.source && (
          <p className="text-[11px] text-ink-muted mb-1">
            Hỏi tại {question.source} · {question.interviewType}
          </p>
        )}
        <p className="text-sm font-medium text-ink leading-[22px] mb-2">{question.titleVi}</p>
        <div className="flex items-center flex-wrap gap-1.5">
          {question.tags.map(tag => (
            <span key={tag} className="text-[11px] px-2 py-0.5 rounded-full bg-canvas-subtle text-ink-secondary border border-edge font-medium">
              {tag}
            </span>
          ))}
          <span className={`text-[11px] ${diff.className}`}>· {diff.label}</span>
          {showStatus && question.status !== 'not-started' && (
            <StatusBadge status={question.status} size="sm" />
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0 pt-0.5">
        <span className="text-[11px] text-ink-muted hidden sm:block">{question.practiceCount} lượt luyện</span>
        <button
          className={`p-1.5 rounded hover:bg-canvas transition-colors ${bookmarked ? 'text-primary' : 'text-ink-muted group-hover:text-ink-secondary'}`}
          onClick={e => { e.stopPropagation(); setBookmarked(!bookmarked) }}
          aria-label={bookmarked ? 'Bỏ đánh dấu' : 'Đánh dấu'}
        >
          <BookmarkSimple aria-hidden size={16} weight={bookmarked ? 'fill' : 'regular'} />
        </button>
        <CaretRight aria-hidden size={16} className="text-ink-muted group-hover:text-primary transition-colors" />
      </div>
    </div>
  )
}
