import { useState } from 'react'
import { Check, Star } from '@phosphor-icons/react'
import AuthNavbar from '@/shared/components/AuthNavbar'
import { MENTORS, BOOKINGS } from '@/shared/data/mock'

export default function Review() {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const mentor = MENTORS[0]
  const booking = BOOKINGS[0]

  if (submitted) {
    return (
      <div className="min-h-screen bg-canvas">
        <AuthNavbar />
        <div className="max-w-[480px] mx-auto px-6 py-20 text-center">
          <div className="w-14 h-14 rounded-full bg-ok-soft border-2 border-ok flex items-center justify-center mx-auto mb-6">
            <Check aria-hidden size={25} weight="bold" className="text-ok" />
          </div>
          <h1 className="text-[22px] font-semibold text-ink mb-2">Cảm ơn bạn đã đánh giá!</h1>
          <p className="text-sm text-ink-secondary mb-2">Đánh giá của bạn sẽ được kiểm duyệt trước khi hiển thị công khai.</p>
          <p className="text-xs text-ink-muted">Thông thường trong vòng 24 giờ.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-canvas">
      <AuthNavbar />

      <div className="max-w-[560px] mx-auto px-6 py-8">
        <h1 className="text-[22px] font-semibold text-ink mb-1">Buổi luyện tập vừa rồi thế nào?</h1>
        <p className="text-sm text-ink-secondary mb-6">Đánh giá chỉ dành cho buổi đã hoàn thành.</p>

        {/* Mentor summary */}
        <div className="flex items-center gap-3 mb-6 p-4 bg-panel border border-edge rounded-xl">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-canvas-subtle shrink-0">
            <img src={mentor.avatar} alt={mentor.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">{mentor.name}</p>
            <p className="text-xs text-ink-muted">{booking.topic} · {booking.date}</p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Star rating */}
          <div>
            <label className="block text-xs font-semibold text-ink-secondary mb-2">Đánh giá tổng thể</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(i => (
                <button
                  key={i}
                  onMouseEnter={() => setHoverRating(i)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(i)}
                  className="transition-transform hover:scale-110"
                  aria-label={`${i} sao`}
                >
                  <Star aria-hidden size={34} weight="fill" className={i <= (hoverRating || rating) ? 'text-notice' : 'text-edge-strong'} />
                </button>
              ))}
              {rating > 0 && (
                <span className="text-sm text-ink-secondary self-center ml-1">
                  {['', 'Chưa hài lòng', 'Tạm được', 'Ổn', 'Tốt', 'Rất tốt'][rating]}
                </span>
              )}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-xs font-semibold text-ink-secondary mb-1.5">Nhận xét của bạn</label>
            <textarea
              rows={4}
              placeholder="Buổi luyện tập có ích như thế nào? Mentor giải thích rõ không? Bạn học được gì?"
              value={comment}
              onChange={e => setComment(e.target.value)}
              className="w-full bg-panel border border-edge rounded-lg px-4 py-3 text-sm text-ink placeholder:text-ink-muted focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all resize-none"
            />
          </div>

          {/* Guidelines */}
          <div className="bg-canvas-subtle border border-edge rounded-lg p-4 text-xs text-ink-muted space-y-1">
            <p className="font-semibold text-ink-secondary mb-1.5">Hướng dẫn viết đánh giá</p>
            <p>· Tập trung vào chất lượng buổi học, không phải ý kiến cá nhân.</p>
            <p>· Phản hồi cụ thể sẽ giúp mentor cải thiện và giúp học viên khác chọn mentor phù hợp.</p>
            <p>· Đánh giá có thể bị ẩn nếu vi phạm chính sách cộng đồng.</p>
          </div>

          {/* Visibility */}
          <p className="text-xs text-ink-muted">Đánh giá của bạn sẽ được kiểm duyệt và hiển thị công khai trên hồ sơ mentor sau khi được duyệt.</p>

          <button
            onClick={() => { if (rating > 0) setSubmitted(true) }}
            disabled={rating === 0}
            className="w-full bg-primary hover:bg-primary-hover text-on-primary font-medium px-6 py-3 rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Gửi đánh giá
          </button>
        </div>
      </div>
    </div>
  )
}
