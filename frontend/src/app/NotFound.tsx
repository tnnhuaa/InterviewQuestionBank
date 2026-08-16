import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center px-6 text-center">
      <p className="text-6xl font-light text-edge-strong mb-4">404</p>
      <h1 className="text-[22px] font-semibold text-ink mb-2">Trang không tìm thấy</h1>
      <p className="text-sm text-ink-secondary mb-8">Trang bạn đang tìm không tồn tại hoặc đã bị di chuyển.</p>
      <button onClick={() => navigate('/homepage')} className="bg-primary hover:bg-primary-hover text-on-primary font-medium px-6 py-2.5 rounded-lg text-sm transition-colors">
        Về trang chủ
      </button>
    </div>
  )
}
