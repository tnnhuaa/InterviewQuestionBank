import { useNavigate } from 'react-router-dom'
import { ArrowRight, Check, WarningCircle } from '@phosphor-icons/react'
import AuthNavbar from '@/shared/components/AuthNavbar'
import RubricRow from '@/shared/components/RubricRow'
import { FEEDBACK_DATA } from '@/shared/data/mock'

export default function Feedback() {
  const navigate = useNavigate()
  const feedback = FEEDBACK_DATA

  return (
    <div className="min-h-screen bg-canvas">
      <AuthNavbar />

      <div className="max-w-[900px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-[22px] font-semibold text-ink">Feedback buổi luyện tập</h1>
          <div className="flex items-center gap-3 mt-2 text-xs text-ink-muted flex-wrap">
            <span>Mentor: <strong className="text-ink-secondary">{feedback.mentorName}</strong></span>
            <span>·</span>
            <span>{feedback.interviewType}</span>
            <span>·</span>
            <span>{feedback.date}</span>
          </div>
        </div>

        {/* Overall message */}
        <div className="bg-primary-soft border border-primary/20 rounded-xl p-5 mb-6">
          <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Nhận xét tổng quan</p>
          <p className="text-base font-medium text-ink leading-relaxed">"{feedback.overallMessage}"</p>
        </div>

        {/* Rubric */}
        <div className="bg-panel border border-edge rounded-xl p-6 mb-6">
          <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-2">Đánh giá theo tiêu chí</p>
          <p className="text-xs text-ink-muted mb-4">Điểm phản ánh chất lượng buổi luyện, không phải năng lực tuyệt đối của bạn.</p>
          {feedback.rubric.map(r => (
            <RubricRow key={r.criterion} rubric={r} />
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-5 mb-6">
          {/* Strengths */}
          <div className="bg-ok-soft border border-ok/20 rounded-xl p-5">
            <p className="text-xs font-semibold text-ok uppercase tracking-wider mb-3">Điểm mạnh</p>
            <ul className="space-y-2">
              {feedback.strengths.map((s, i) => (
                <li key={i} className="flex gap-2 items-start text-sm text-ink-secondary">
                  <Check aria-hidden size={16} weight="bold" className="mt-0.5 shrink-0 text-ok" />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Areas to improve */}
          <div className="bg-notice-soft border border-notice/20 rounded-xl p-5">
            <p className="text-xs font-semibold text-notice-ink uppercase tracking-wider mb-3">Cần cải thiện</p>
            <ul className="space-y-2">
              {feedback.improvements.map((s, i) => (
                <li key={i} className="flex gap-2 items-start text-sm text-ink-secondary">
                  <WarningCircle aria-hidden size={16} weight="bold" className="mt-0.5 shrink-0 text-notice-ink" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Next actions */}
        <div className="bg-panel border border-edge rounded-xl p-6 mb-6">
          <p className="text-sm font-semibold text-ink mb-1">Bạn nên làm gì tiếp theo?</p>
          <p className="text-xs text-ink-muted mb-4">Được đề xuất bởi mentor dựa trên buổi luyện tập.</p>
          <div className="space-y-3">
            {feedback.nextActions.map((action, i) => (
              <div key={i} className="flex items-center gap-4 p-3 bg-canvas-subtle rounded-lg hover:bg-primary-soft/30 transition-colors group">
                <div className="w-6 h-6 rounded-full bg-primary text-on-primary text-xs font-semibold flex items-center justify-center shrink-0">
                  {i + 1}
                </div>
                <p className="text-sm text-ink-secondary flex-1">{action.title}</p>
                {action.questionId && (
                  <button
                    onClick={() => navigate(`/questions/${action.questionId}`)}
                    className="text-xs text-primary font-medium hover:underline shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <span className="inline-flex items-center gap-1">Luyện ngay <ArrowRight aria-hidden size={12} /></span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sharing */}
        <div className="bg-canvas-subtle border border-edge rounded-xl p-5 flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-sm font-medium text-ink">Chia sẻ feedback</p>
            <p className="text-xs text-ink-muted mt-0.5">Feedback của bạn là riêng tư. Chỉ bạn mới thấy nội dung này.</p>
          </div>
          <button className="text-sm border border-edge text-ink-secondary hover:border-primary hover:text-primary font-medium px-4 py-2 rounded-lg transition-colors">
            Chia sẻ feedback
          </button>
        </div>
      </div>
    </div>
  )
}
