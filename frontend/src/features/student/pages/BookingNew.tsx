import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Check, SpinnerGap } from '@phosphor-icons/react'
import AuthNavbar from '@/shared/components/AuthNavbar'
import { MENTORS, BOOKINGS } from '@/shared/data/mock'

export default function BookingNew() {
  const navigate = useNavigate()
  const mentor = MENTORS[0]
  const booking = BOOKINGS[0]
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [form, setForm] = useState({
    position: '',
    interviewType: '',
    goal: '',
    topics: '',
    question: '',
    note: '',
    agreedPolicy: false,
  })

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.position) e.position = 'Vui lòng nhập vị trí đang ứng tuyển.'
    if (!form.interviewType) e.interviewType = 'Vui lòng chọn loại phỏng vấn.'
    if (!form.goal.trim()) e.goal = 'Vui lòng nhập mục tiêu buổi luyện tập.'
    if (!form.agreedPolicy) e.policy = 'Bạn cần đồng ý với chính sách trước khi gửi.'
    return e
  }

  const handleSubmit = () => {
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    setSubmitting(true)
    setTimeout(() => { setSubmitting(false); setSubmitted(true) }, 1500)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-canvas">
        <AuthNavbar />
        <div className="max-w-[500px] mx-auto px-6 py-20 text-center">
          <div className="w-14 h-14 rounded-full bg-ok-soft border-2 border-ok flex items-center justify-center mx-auto mb-6">
            <Check aria-hidden size={25} weight="bold" className="text-ok" />
          </div>
          <h1 className="text-[22px] font-semibold text-ink mb-2">Yêu cầu đã được gửi!</h1>
          <p className="text-sm text-ink-secondary mb-8">Mentor sẽ xác nhận trong vòng 24 giờ. Bạn sẽ nhận thông báo qua email.</p>
          <button onClick={() => navigate('/bookings/BK-2024-001')} className="bg-primary hover:bg-primary-hover text-on-primary font-medium px-6 py-2.5 rounded-lg text-sm transition-colors">
            <span className="inline-flex items-center gap-1.5">Xem trạng thái đặt lịch <ArrowRight aria-hidden size={15} /></span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-canvas">
      <AuthNavbar />

      <div className="max-w-[1100px] mx-auto px-6 py-8">
        <h1 className="text-[22px] font-semibold text-ink mb-6">Gửi yêu cầu đặt lịch</h1>

        <div className="flex gap-8">
          {/* Form */}
          <div className="flex-1 min-w-0 space-y-5">
            <div className="bg-panel border border-edge rounded-xl p-6">
              <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-5">Thông tin buổi luyện tập</p>
              <div className="space-y-4">
                {/* Position */}
                <div>
                  <label className="block text-xs font-semibold text-ink-secondary mb-1.5">Vị trí đang ứng tuyển <span className="text-accent">*</span></label>
                  <input
                    type="text"
                    placeholder="vd. Frontend Intern tại Shopee"
                    value={form.position}
                    onChange={e => setForm(p => ({ ...p, position: e.target.value }))}
                    className={`w-full bg-canvas-subtle border rounded-lg px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all ${errors.position ? 'border-danger' : 'border-edge'}`}
                  />
                  {errors.position && <p className="text-xs text-danger mt-1">{errors.position}</p>}
                </div>

                {/* Interview type */}
                <div>
                  <label className="block text-xs font-semibold text-ink-secondary mb-1.5">Loại phỏng vấn <span className="text-accent">*</span></label>
                  <select
                    value={form.interviewType}
                    onChange={e => setForm(p => ({ ...p, interviewType: e.target.value }))}
                    className={`w-full bg-canvas-subtle border rounded-lg px-4 py-2.5 text-sm text-ink focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all ${errors.interviewType ? 'border-danger' : 'border-edge'}`}
                  >
                    <option value="">Chọn loại phỏng vấn</option>
                    <option>Technical Interview</option>
                    <option>System Design</option>
                    <option>Behavioral</option>
                  </select>
                  {errors.interviewType && <p className="text-xs text-danger mt-1">{errors.interviewType}</p>}
                </div>

                {/* Goal */}
                <div>
                  <label className="block text-xs font-semibold text-ink-secondary mb-1.5">Mục tiêu buổi luyện tập <span className="text-accent">*</span></label>
                  <textarea
                    rows={3}
                    placeholder="vd. Tôi muốn luyện câu hỏi về Event Loop và cải thiện cách cấu trúc câu trả lời."
                    value={form.goal}
                    onChange={e => setForm(p => ({ ...p, goal: e.target.value }))}
                    className={`w-full bg-canvas-subtle border rounded-lg px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all resize-none ${errors.goal ? 'border-danger' : 'border-edge'}`}
                  />
                  {errors.goal && <p className="text-xs text-danger mt-1">{errors.goal}</p>}
                </div>

                {/* Topics */}
                <div>
                  <label className="block text-xs font-semibold text-ink-secondary mb-1.5">Nội dung muốn luyện</label>
                  <input
                    type="text"
                    placeholder="vd. Event Loop, React Hooks, CSS Flexbox"
                    value={form.topics}
                    onChange={e => setForm(p => ({ ...p, topics: e.target.value }))}
                    className="w-full bg-canvas-subtle border border-edge rounded-lg px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>

                {/* Optional note */}
                <div>
                  <label className="block text-xs font-semibold text-ink-secondary mb-1.5">Ghi chú thêm <span className="text-ink-muted font-normal">(tùy chọn)</span></label>
                  <textarea
                    rows={2}
                    placeholder="Bất kỳ thông tin nào giúp mentor chuẩn bị tốt hơn."
                    value={form.note}
                    onChange={e => setForm(p => ({ ...p, note: e.target.value }))}
                    className="w-full bg-canvas-subtle border border-edge rounded-lg px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Policy */}
            <div className={`bg-canvas-subtle border rounded-xl p-5 space-y-3 ${errors.policy ? 'border-danger' : 'border-edge'}`}>
              <p className="text-xs font-semibold text-ink">Chính sách</p>
              {[
                { title: 'Chính sách hủy lịch', desc: 'Bạn có thể hủy lịch ít nhất 24 giờ trước buổi phỏng vấn. Hủy muộn hơn sẽ không được hoàn lịch.' },
                { title: 'Chính sách no-show', desc: 'Không xuất hiện mà không báo trước sẽ ảnh hưởng đến lịch sử đặt lịch của bạn.' },
                { title: 'Công cụ họp', desc: 'Buổi phỏng vấn sử dụng công cụ họp bên ngoài (Google Meet / Zoom). PrepVI không cung cấp phòng họp tích hợp.' },
              ].map(p => (
                <div key={p.title} className="flex gap-2">
                  <div className="w-1 shrink-0 bg-edge-strong rounded-full mt-1"/>
                  <div>
                    <p className="text-xs font-semibold text-ink">{p.title}</p>
                    <p className="text-xs text-ink-muted mt-0.5">{p.desc}</p>
                  </div>
                </div>
              ))}
              <label className="flex items-start gap-2 cursor-pointer mt-3">
                <input
                  type="checkbox"
                  checked={form.agreedPolicy}
                  onChange={e => setForm(p => ({ ...p, agreedPolicy: e.target.checked }))}
                  className="mt-0.5 accent-primary"
                />
                <span className="text-xs text-ink-secondary">Tôi đã đọc và đồng ý với các chính sách trên.</span>
              </label>
              {errors.policy && <p className="text-xs text-danger">{errors.policy}</p>}
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-primary hover:bg-primary-hover text-on-primary font-medium px-6 py-3 rounded-lg text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {submitting && (
                <SpinnerGap aria-hidden size={16} className="animate-spin" />
              )}
              {submitting ? 'Đang gửi...' : 'Gửi yêu cầu đặt lịch'}
            </button>
          </div>

          {/* Summary sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="bg-panel border border-edge rounded-xl p-5 sticky top-20">
              <p className="text-xs font-semibold text-ink-muted uppercase tracking-wider mb-4">Tóm tắt đặt lịch</p>
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-edge">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-canvas-subtle">
                  <img src={mentor.avatar} alt={mentor.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">{mentor.name}</p>
                  <p className="text-xs text-ink-muted">{mentor.role}</p>
                </div>
              </div>
              <div className="space-y-2.5">
                {[
                  { label: 'Ngày', value: booking.date },
                  { label: 'Giờ', value: booking.time },
                  { label: 'Múi giờ', value: booking.timezone },
                  { label: 'Thời lượng', value: `${booking.duration} phút` },
                  { label: 'Hình thức', value: 'Video call' },
                ].map(row => (
                  <div key={row.label} className="flex justify-between text-xs">
                    <span className="text-ink-muted">{row.label}</span>
                    <span className="text-ink font-medium">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
