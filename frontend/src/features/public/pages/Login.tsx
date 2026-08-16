import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GoogleLogo, SpinnerGap } from '@phosphor-icons/react'
import { useApp } from '@/app/AppContext'
import { Brand } from '@/shared/components/navigation/Brand'

export default function Login() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { setRole } = useApp()
  const navigate = useNavigate()

  const handleGoogle = () => {
    setLoading(true)
    setError(null)
    setTimeout(() => {
      setLoading(false)
      setRole('student')
      navigate('/student/dashboard')
    }, 1200)
  }

  return (
    <div className="min-h-screen flex flex-col sm:flex-row">
      {/* Brand panel */}
      <div className="sm:w-[45%] bg-warm flex flex-col justify-between p-10 sm:p-14 min-h-[200px] sm:min-h-screen">
        <Brand to="/homepage" />
        <div className="my-10 sm:my-0">
          <p className="text-[11px] font-semibold text-primary tracking-widest uppercase mb-6">Practice with purpose.</p>
          <div className="space-y-6">
            {[
              { step: '01', label: 'Chọn câu hỏi phù hợp' },
              { step: '02', label: 'Luyện tập với mentor' },
              { step: '03', label: 'Nhận feedback có cấu trúc' },
            ].map(item => (
              <div key={item.step} className="flex items-center gap-4">
                <span className="text-2xl font-light text-edge-strong tabular-nums">{item.step}</span>
                <div className="h-px flex-1 bg-edge-strong/60"/>
                <span className="text-sm font-medium text-ink">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-ink-muted">Chỉ dành cho người dùng được mời.</p>
      </div>

      {/* Auth panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-canvas">
        <div className="w-full max-w-[380px]">
          <div className="mb-10">
            <h1 className="text-[28px] font-semibold text-ink leading-[36px] mb-2">Chào mừng trở lại</h1>
            <p className="text-sm text-ink-secondary">Đăng nhập để tiếp tục quá trình luyện phỏng vấn.</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-danger-soft border border-danger/20 rounded-lg text-sm text-danger">
              {error}
            </div>
          )}

          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-panel border border-edge hover:border-primary/40 text-ink font-medium px-5 py-3 rounded-lg text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed mb-6"
          >
            {loading ? (
              <SpinnerGap aria-hidden size={18} className="animate-spin" />
            ) : (
              <GoogleLogo aria-hidden size={18} weight="bold" />
            )}
            {loading ? 'Đang đăng nhập...' : 'Tiếp tục với Google'}
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-edge"/>
            </div>
            <div className="relative text-center">
              <span className="bg-canvas px-3 text-xs text-ink-muted">hoặc</span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-ink-secondary mb-1.5">Email tổ chức</label>
              <input
                type="email"
                placeholder="ten@congty.com"
                className="w-full bg-panel border border-edge rounded-lg px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
            <button className="w-full bg-canvas-subtle hover:bg-edge text-ink font-medium px-5 py-2.5 rounded-lg text-sm border border-edge transition-colors">
              Tiếp tục với email
            </button>
          </div>

          <p className="text-[11px] text-ink-muted mt-8 text-center leading-relaxed">
            Bằng cách tiếp tục, bạn đồng ý với{' '}
            <a href="#" className="text-primary hover:underline">Điều khoản dịch vụ</a>
            {' '}và{' '}
            <a href="#" className="text-primary hover:underline">Chính sách quyền riêng tư</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
