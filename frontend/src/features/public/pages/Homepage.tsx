import { useNavigate } from 'react-router-dom'
import { ArrowRight, CaretRight, Check } from '@phosphor-icons/react'
import PublicNavbar from '@/shared/components/PublicNavbar'
import { QUESTIONS, MENTORS } from '@/shared/data/mock'
import MentorCard from '@/shared/components/MentorCard'

const STEPS = [
  { num: '01', title: 'Chọn mục tiêu', desc: 'Chọn vị trí bạn muốn ứng tuyển.' },
  { num: '02', title: 'Luyện câu hỏi', desc: 'Thực hành với câu hỏi phù hợp.' },
  { num: '03', title: 'Đặt lịch mentor', desc: 'Tìm mentor có chuyên môn phù hợp.' },
  { num: '04', title: 'Nhận feedback', desc: 'Nhận đánh giá cụ thể theo tiêu chí.' },
  { num: '05', title: 'Luyện tiếp', desc: 'Cải thiện theo đề xuất từ mentor.' },
]

export default function Homepage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-canvas">
      <PublicNavbar />

      {/* Hero */}
      <section className="max-w-[1280px] mx-auto px-6 pt-16 pb-20 grid lg:grid-cols-[1fr_1fr] gap-16 items-center">
        <div>
          <p className="text-xs font-semibold text-primary tracking-widest uppercase mb-4">Interview preparation, with direction.</p>
          <h1 className="text-[36px] font-semibold text-ink leading-[44px] mb-5">
            Luyện đúng câu hỏi.<br className="hidden md:block"/>
            Gặp đúng mentor.<br className="hidden md:block"/>
            <span className="text-primary">Biết chính xác điều cần cải thiện.</span>
          </h1>
          <p className="text-base text-ink-secondary leading-relaxed mb-8 max-w-[440px]">
            PrepVI kết nối bạn với câu hỏi phỏng vấn thực tế, mentor được xác minh, và hệ thống feedback có cấu trúc — giúp bạn chuẩn bị đúng hướng, không lãng phí thời gian.
          </p>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => navigate('/questions')}
              className="bg-primary hover:bg-primary-hover text-on-primary font-medium px-6 py-2.5 rounded-md text-sm transition-colors"
            >
              Khám phá câu hỏi
            </button>
            <button
              onClick={() => navigate('/mentors')}
              className="border border-edge hover:border-primary text-ink-secondary hover:text-primary font-medium px-6 py-2.5 rounded-md text-sm transition-colors"
            >
              Tìm mentor
            </button>
          </div>
        </div>

        {/* Editorial UI preview */}
        <div className="relative hidden lg:block">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-soft/60 to-canvas-subtle rounded-2xl -z-10"/>
          <div className="space-y-3 p-6">
            {/* Question preview card */}
            <div className="bg-panel rounded-xl border border-edge p-4 shadow-sm">
              <p className="text-[10px] text-ink-muted mb-1">Hỏi tại Google · Technical</p>
              <p className="text-sm font-medium text-ink mb-2">Giải thích Event Loop và cách microtask khác macrotask.</p>
              <div className="flex gap-1.5 flex-wrap">
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-canvas-subtle text-ink-secondary border border-edge">JavaScript</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-canvas-subtle text-ink-secondary border border-edge">Frontend</span>
                <span className="text-[10px] font-medium text-notice-ink">· Trung bình</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-notice-soft text-notice-ink font-medium">Đang luyện</span>
              </div>
            </div>
            {/* Availability row */}
            <div className="bg-panel rounded-xl border border-edge p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full overflow-hidden bg-canvas-subtle">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format" className="w-full h-full object-cover" alt="Mentor" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">Nguyễn Minh Tuấn</p>
                  <p className="text-[11px] text-ink-muted">Senior FE · Shopee · GMT+7</p>
                </div>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {['T2 09:00', 'T3 09:00', 'T4 14:00'].map((slot, i) => (
                  <button key={slot} className={`text-[11px] px-2 py-1 rounded border font-medium transition-colors ${i === 1 ? 'bg-primary text-on-primary border-primary' : 'border-edge text-ink-secondary hover:border-primary'}`}>
                    {slot}
                  </button>
                ))}
              </div>
            </div>
            {/* Feedback rubric preview */}
            <div className="bg-panel rounded-xl border border-edge p-4 shadow-sm">
              <p className="text-xs font-semibold text-ink mb-3">Feedback từ mentor</p>
              {[
                { label: 'Kiến thức', score: 4 },
                { label: 'Cấu trúc', score: 3 },
                { label: 'Giao tiếp', score: 4 },
              ].map(r => (
                <div key={r.label} className="flex items-center gap-2 mb-1.5">
                  <span className="text-[11px] text-ink-secondary w-20">{r.label}</span>
                  <div className="flex gap-0.5 flex-1">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full ${i <= r.score ? 'bg-ok' : 'bg-edge'}`}/>
                    ))}
                  </div>
                  <span className="text-[11px] text-ink-muted tabular-nums">{r.score}/5</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-canvas-subtle border-y border-edge py-16">
        <div className="max-w-[1280px] mx-auto px-6">
          <p className="text-xs font-semibold text-ink-muted tracking-widest uppercase mb-10 text-center">Quy trình chuẩn bị</p>
          <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
            {STEPS.map((step, i) => (
              <div key={step.num} className="flex sm:flex-col items-start sm:items-start gap-4 sm:gap-2 flex-1">
                <div className="flex items-center gap-3 sm:gap-0">
                  <span className="text-2xl font-light text-edge-strong tabular-nums">{step.num}</span>
                  {i < STEPS.length - 1 && (
                    <div className="hidden sm:block w-full h-px bg-edge-strong mx-4 mt-3"/>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">{step.title}</p>
                  <p className="text-xs text-ink-muted mt-0.5">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Question preview */}
      <section className="max-w-[1280px] mx-auto px-6 py-20">
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <h2 className="text-[28px] font-semibold text-ink leading-[36px]">Luyện những câu hỏi bạn thực sự có thể gặp</h2>
            <p className="text-sm text-ink-secondary mt-1">Được chọn lọc từ các buổi phỏng vấn thực tế tại các công ty tech.</p>
          </div>
          <button onClick={() => navigate('/questions')} className="text-sm text-primary hover:text-primary-hover font-medium transition-colors hidden md:block">
            <span className="inline-flex items-center gap-1">Xem tất cả <ArrowRight aria-hidden size={14} /></span>
          </button>
        </div>
        <div className="border border-edge rounded-xl bg-panel overflow-hidden">
          <div className="flex gap-2 px-4 py-3 border-b border-edge bg-canvas-subtle/50">
            {['JavaScript', 'React', 'System Design', 'Behavioral'].map((tag, i) => (
              <button key={tag} className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${i === 0 ? 'bg-primary text-on-primary' : 'text-ink-secondary hover:text-ink'}`}>
                {tag}
              </button>
            ))}
          </div>
          <div className="divide-y divide-edge">
            {QUESTIONS.slice(0, 5).map(q => (
              <div key={q.id} onClick={() => navigate(`/questions/${q.id}`)} className="flex items-start gap-4 px-5 py-3.5 hover:bg-primary-soft/30 cursor-pointer transition-colors">
                <div className="flex-1 min-w-0">
                  {q.source && <p className="text-[10px] text-ink-muted mb-0.5">Hỏi tại {q.source}</p>}
                  <p className="text-sm text-ink leading-[22px]">{q.titleVi}</p>
                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    {q.tags.map(tag => (
                      <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-full bg-canvas-subtle text-ink-secondary border border-edge">{tag}</span>
                    ))}
                    <span className="text-[10px] text-ink-muted">· {q.practiceCount} lượt luyện</span>
                  </div>
                </div>
                <CaretRight aria-hidden size={16} className="mt-1 shrink-0 text-ink-muted" />
              </div>
            ))}
          </div>
          <div className="px-5 py-3 border-t border-edge bg-canvas-subtle/30">
            <button onClick={() => navigate('/questions')} className="text-sm text-primary font-medium hover:text-primary-hover transition-colors">
              <span className="inline-flex items-center gap-1">Xem Question Bank <ArrowRight aria-hidden size={14} /></span>
            </button>
          </div>
        </div>
      </section>

      {/* Mentor preview */}
      <section className="bg-canvas-subtle border-y border-edge py-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex items-baseline justify-between mb-8">
            <div>
              <h2 className="text-[28px] font-semibold text-ink leading-[36px]">Mentor được xác minh</h2>
              <p className="text-sm text-ink-secondary mt-1">Kỹ sư từ các công ty hàng đầu, sẵn sàng giúp bạn luyện tập.</p>
            </div>
            <button onClick={() => navigate('/mentors')} className="hidden items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary-hover md:inline-flex">Xem tất cả <ArrowRight aria-hidden size={14} /></button>
          </div>
          <div className="grid lg:grid-cols-[2fr_1fr] gap-4">
            <MentorCard mentor={MENTORS[0]} />
            <div className="flex flex-col gap-3">
              {MENTORS.slice(1).map(m => (
                <MentorCard key={m.id} mentor={m} compact />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feedback preview */}
      <section className="max-w-[1280px] mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-[28px] font-semibold text-ink leading-[36px] mb-4">Feedback có cấu trúc, không phải nhận xét chung chung</h2>
            <p className="text-base text-ink-secondary leading-relaxed mb-6">
              Mỗi buổi phỏng vấn được đánh giá theo tiêu chí rõ ràng — kiến thức, cấu trúc, giao tiếp, và xử lý câu hỏi tiếp theo. Bạn biết chính xác phải cải thiện điều gì.
            </p>
            <button onClick={() => navigate('/bookings/BK-2024-001/feedback')} className="text-sm text-primary font-medium hover:text-primary-hover transition-colors">
              <span className="inline-flex items-center gap-1">Xem ví dụ feedback <ArrowRight aria-hidden size={14} /></span>
            </button>
          </div>
          <div className="bg-panel rounded-xl border border-edge p-6">
            <p className="text-xs text-ink-muted mb-1">Nhận xét tổng quan</p>
            <p className="text-sm font-medium text-ink mb-5">"Bạn đang làm tốt phần kiến thức, nhưng cần cấu trúc câu trả lời rõ hơn."</p>
            {[
              { label: 'Kiến thức kỹ thuật', score: 4, max: 5 },
              { label: 'Cấu trúc', score: 3, max: 5 },
              { label: 'Giao tiếp', score: 4, max: 5 },
              { label: 'Xử lý câu tiếp theo', score: 3, max: 5 },
            ].map(r => (
              <div key={r.label} className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-ink">{r.label}</span>
                  <span className="text-xs text-ink-muted tabular-nums">{r.score}/{r.max}</span>
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: r.max }, (_, i) => (
                    <div key={i} className={`h-1.5 flex-1 rounded-full ${i < r.score ? 'bg-ok' : 'bg-edge'}`}/>
                  ))}
                </div>
              </div>
            ))}
            <div className="mt-5 pt-4 border-t border-edge space-y-2">
              <p className="text-xs font-semibold text-ink">Điểm mạnh</p>
              <p className="flex items-start gap-1.5 text-xs text-ink-secondary"><Check aria-hidden size={13} className="mt-0.5 shrink-0 text-ok" />Giải thích closure bằng ví dụ thực tế rõ ràng.</p>
              <p className="text-xs font-semibold text-ink mt-3">Cần cải thiện</p>
              <p className="flex items-start gap-1.5 text-xs text-ink-secondary"><ArrowRight aria-hidden size={13} className="mt-0.5 shrink-0" />Xác định assumption trước khi trả lời.</p>
              <p className="text-xs font-semibold text-ink mt-3">Bước tiếp theo</p>
              <p className="flex items-start gap-1.5 text-xs text-primary"><ArrowRight aria-hidden size={13} className="mt-0.5 shrink-0" />Luyện Event Loop · Luyện React rendering</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-warm border-y border-edge-strong py-20">
        <div className="max-w-[760px] mx-auto px-6 text-center">
          <h2 className="text-[28px] font-semibold text-ink leading-[36px] mb-4">
            Buổi phỏng vấn tiếp theo không nên là lần đầu bạn luyện tập.
          </h2>
          <p className="text-base text-ink-secondary mb-8">Bắt đầu với câu hỏi miễn phí. Tìm mentor khi bạn sẵn sàng nhận feedback chuyên sâu.</p>
          <button onClick={() => navigate('/questions')} className="bg-primary hover:bg-primary-hover text-on-primary font-medium px-8 py-3 rounded-md text-sm transition-colors">
            Bắt đầu luyện tập
          </button>
        </div>
      </section>

      <footer className="border-t border-edge py-10">
        <div className="max-w-[1280px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-muted">
          <span>© 2025 PrepVI. Nền tảng luyện phỏng vấn.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-ink transition-colors">Điều khoản</a>
            <a href="#" className="hover:text-ink transition-colors">Quyền riêng tư</a>
            <a href="#" className="hover:text-ink transition-colors">Liên hệ</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
