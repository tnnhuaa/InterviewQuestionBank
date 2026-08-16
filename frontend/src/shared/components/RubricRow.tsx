import type { FeedbackRubric } from '@/shared/data/mock'

interface RubricRowProps {
  rubric: FeedbackRubric
  interactive?: boolean
  value?: number
  onChange?: (score: number) => void
}

export default function RubricRow({ rubric, interactive = false, value, onChange }: RubricRowProps) {
  const score = value ?? rubric.score

  return (
    <div className="py-5 border-b border-edge last:border-b-0">
      <div className="flex items-start justify-between gap-4 mb-2">
        <div>
          <p className="text-sm font-semibold text-ink">{rubric.criterion}</p>
          {rubric.explanation && <p className="text-sm text-ink-secondary mt-1 leading-relaxed">{rubric.explanation}</p>}
        </div>
        <div className="shrink-0 text-right">
          <span className="text-lg font-semibold text-ink tabular-nums">{score}</span>
          <span className="text-sm text-ink-muted">/{rubric.maxScore}</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 mt-2">
        {Array.from({ length: rubric.maxScore }, (_, i) => i + 1).map(i => (
          <button
            key={i}
            disabled={!interactive}
            onClick={() => onChange?.(i)}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i <= score
                ? score >= 4 ? 'bg-ok' : score >= 3 ? 'bg-notice' : 'bg-accent'
                : 'bg-edge'
            } ${interactive ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}`}
            aria-label={`Score ${i}`}
          />
        ))}
        <span className="text-[11px] text-ink-muted ml-1 shrink-0">
          {score === 5 ? 'Xuất sắc' : score === 4 ? 'Tốt' : score === 3 ? 'Đạt yêu cầu' : score === 2 ? 'Cần cải thiện' : 'Chưa đạt'}
        </span>
      </div>
      {rubric.evidence && (
        <p className="text-xs text-ink-muted mt-2 pl-3 border-l-2 border-edge italic">{rubric.evidence}</p>
      )}
    </div>
  )
}
