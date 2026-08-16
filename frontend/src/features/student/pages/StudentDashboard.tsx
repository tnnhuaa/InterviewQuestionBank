import { useNavigate } from 'react-router-dom'
import { ArrowRight, CalendarBlank, FileText, UploadSimple } from '@phosphor-icons/react'
import AuthNavbar from '@/shared/components/AuthNavbar'
import StatusBadge from '@/shared/components/StatusBadge'
import QuestionRow from '@/shared/components/QuestionRow'
import { QUESTIONS, BOOKINGS, MENTORS } from '@/shared/data/mock'

const PROGRESS = [
  { topic: 'JavaScript', done: 7, total: 20 },
  { topic: 'React', done: 3, total: 15 },
  { topic: 'Behavioral', done: 1, total: 12 },
]

export default function StudentDashboard() {
  const navigate = useNavigate()
  const upcomingBooking = BOOKINGS[0]
  const upcomingMentor = MENTORS.find(m => m.id === upcomingBooking.mentorId)!
  const recommendations = QUESTIONS.filter(q => q.status === 'not-started').slice(0, 3)

  return (
    <div className="min-h-screen bg-canvas">
      <AuthNavbar />

      <div className="max-w-[1100px] mx-auto px-6 py-10">
        {/* Page header */}
        <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
          <div>
            <h1 className="text-[22px] font-semibold text-ink leading-[30px]">Chào An, hôm nay bạn muốn luyện gì?</h1>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-ok"/>
                <span className="text-sm text-ink-secondary">Mục tiêu: <strong className="text-ink">Frontend Intern</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <CalendarBlank aria-hidden size={14} className="text-accent" />
                <span className="text-sm text-ink-muted">Phỏng vấn trong <strong className="text-ink">18 ngày</strong></span>
              </div>
              <button className="text-xs text-primary hover:underline">Chỉnh mục tiêu</button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          <div className="space-y-6">
            {/* JD scan — primary action */}
            <div className="bg-panel border border-primary/20 rounded-xl overflow-hidden">
              {/* Header row: JD identity */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-primary/10 bg-primary-soft/40">
                <div className="w-8 h-8 rounded-lg bg-primary-soft border border-primary/25 flex items-center justify-center shrink-0">
                  <FileText aria-hidden size={18} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink leading-none">Frontend Intern</p>
                  <p className="text-[11px] text-ink-muted mt-0.5 truncate">Frontend_Intern_JD.jpg · Cập nhật 2 ngày trước</p>
                </div>
                <span className="text-[10px] font-semibold text-primary bg-primary-soft border border-primary/25 px-2 py-0.5 rounded-full shrink-0">Đã phân tích</span>
              </div>

              {/* Body: skills + actions */}
              <div className="px-5 py-4 flex items-center gap-4 flex-wrap sm:flex-nowrap">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-ink-muted mb-2">Kỹ năng được xác định từ JD</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {['JavaScript', 'React', 'REST API', 'Git'].map(t => (
                      <span key={t} className="text-xs px-2.5 py-1 bg-canvas-subtle border border-edge rounded-lg text-ink-secondary font-medium">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => navigate('/job-descriptions/demo-jd/mapping')}
                    className="text-sm border border-edge text-ink-secondary px-4 py-2 rounded-lg hover:border-primary hover:text-primary transition-colors whitespace-nowrap bg-canvas-subtle"
                  >
                    Xem phân tích
                  </button>
                  <button
                    onClick={() => navigate('/preparation-plans/demo-plan')}
                    className="text-sm bg-primary hover:bg-primary-hover text-on-primary font-semibold px-5 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5"
                  >
                    Luyện ngay
                    <ArrowRight aria-hidden size={15} weight="bold" />
                  </button>
                </div>
              </div>

              {/* Footer: secondary actions */}
              <div className="flex items-center gap-4 px-5 py-3 border-t border-edge bg-canvas-subtle/50">
                <button
                  onClick={() => navigate('/job-descriptions/new')}
                  className="text-xs text-ink-muted hover:text-primary transition-colors flex items-center gap-1.5"
                >
                  <UploadSimple aria-hidden size={13} />
                  Quét JD mới
                </button>
                <span className="w-px h-3 bg-edge-strong" />
                <button
                  onClick={() => navigate('/questions')}
                  className="text-xs text-ink-muted hover:text-ink transition-colors"
                >
                  Luyện câu hỏi tự do
                </button>
                <button
                  onClick={() => navigate('/mentors')}
                  className="text-xs text-ink-muted hover:text-ink transition-colors"
                >
                  Tìm mentor
                </button>
              </div>
            </div>

            {/* Continue practice card */}
            <div className="bg-panel border border-edge rounded-xl p-6">
              <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-4">Tiếp tục luyện</p>
              <div className="flex items-start gap-4 flex-wrap sm:flex-nowrap">
                <div className="flex-1">
                  <h2 className="text-base font-semibold text-ink mb-1">Tiếp tục luyện JavaScript</h2>
                  <p className="text-sm text-ink-secondary">7/20 câu đã luyện · Luyện lần cuối 2 ngày trước</p>
                  <div className="mt-3 h-1.5 bg-edge rounded-full overflow-hidden max-w-[300px]">
                    <div className="h-full bg-ok rounded-full" style={{ width: '35%' }}/>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/questions?topic=JavaScript')}
                  className="bg-canvas-subtle hover:bg-edge border border-edge text-ink-secondary font-medium px-4 py-2 rounded-lg text-sm transition-colors whitespace-nowrap"
                >
                  <span className="inline-flex items-center gap-1">Tiếp tục <ArrowRight aria-hidden size={14} /></span>
                </button>
              </div>
            </div>

            {/* Practice progress */}
            <div className="bg-panel border border-edge rounded-xl p-6">
              <div className="flex items-center justify-between mb-5">
                <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider">Tiến độ luyện tập</p>
                <button onClick={() => navigate('/questions')} className="text-xs text-primary hover:underline">Xem tất cả</button>
              </div>
              <div className="space-y-4">
                {PROGRESS.map(p => {
                  const confident = Math.round(p.done * 0.4)
                  const practicing = p.done - confident
                  return (
                    <div key={p.topic}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium text-ink">{p.topic}</span>
                        <span className="text-xs text-ink-muted tabular-nums">{p.done} / {p.total}</span>
                      </div>
                      <div className="flex h-2 bg-edge rounded-full overflow-hidden gap-0.5">
                        <div className="h-full bg-primary rounded-l-full" style={{ width: `${(confident / p.total) * 100}%` }}/>
                        <div className="h-full bg-notice" style={{ width: `${(practicing / p.total) * 100}%` }}/>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-[10px] text-ink-muted">
                          <span className="w-2 h-1 bg-primary rounded-full inline-block"/>Tự tin ({confident})
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-ink-muted">
                          <span className="w-2 h-1 bg-notice rounded-full inline-block"/>Đang luyện ({practicing})
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-ink-muted">
                          <span className="w-2 h-1 bg-edge rounded-full inline-block"/>Chưa luyện ({p.total - p.done})
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-panel border border-edge rounded-xl p-6">
              <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-4">Bạn nên luyện tiếp</p>
              <div>
                {recommendations.map(q => (
                  <QuestionRow key={q.id} question={q} showStatus={false} />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Upcoming session */}
            <div className="bg-panel border border-edge rounded-xl p-5">
              <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-4">Buổi phỏng vấn sắp tới</p>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-canvas-subtle shrink-0">
                  <img src={upcomingMentor.avatar} alt={upcomingMentor.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">{upcomingMentor.name}</p>
                  <p className="text-xs text-ink-muted">{upcomingMentor.role}</p>
                </div>
              </div>
              <div className="space-y-1.5 mb-4">
                <div className="flex justify-between text-xs">
                  <span className="text-ink-muted">Chủ đề</span>
                  <span className="text-ink font-medium">{upcomingBooking.topic}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-ink-muted">Ngày</span>
                  <span className="text-ink">{upcomingBooking.date}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-ink-muted">Giờ</span>
                  <span className="text-ink">{upcomingBooking.time}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-ink-muted">Múi giờ</span>
                  <span className="text-ink-muted">{upcomingBooking.timezone}</span>
                </div>
              </div>
              <div className="flex items-center justify-between mb-3">
                <StatusBadge status={upcomingBooking.status} />
              </div>
              <button
                onClick={() => navigate(`/bookings/${upcomingBooking.id}`)}
                className="w-full border border-edge hover:border-primary text-ink-secondary hover:text-primary font-medium px-4 py-2 rounded-lg text-xs transition-colors"
              >
                <span className="inline-flex items-center gap-1">Xem buổi phỏng vấn <ArrowRight aria-hidden size={13} /></span>
              </button>
            </div>

            {/* Quick stats */}
            <div className="bg-panel border border-edge rounded-xl p-5">
              <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-4">Tổng kết</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Đã luyện', value: '11', sub: 'câu hỏi' },
                  { label: 'Tự tin', value: '5', sub: 'câu' },
                  { label: 'Buổi mentor', value: '1', sub: 'hoàn thành' },
                  { label: 'Còn lại', value: '36', sub: 'để luyện' },
                ].map(s => (
                  <div key={s.label} className="text-center p-3 bg-canvas-subtle rounded-lg">
                    <p className="text-xl font-semibold text-ink tabular-nums">{s.value}</p>
                    <p className="text-[10px] text-ink-muted mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
