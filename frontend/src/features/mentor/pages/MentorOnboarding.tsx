import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Check } from '@phosphor-icons/react'
import AuthNavbar from '@/shared/components/AuthNavbar'

const STEPS = [
  { id: 'background', label: 'Kinh nghiệm' },
  { id: 'expertise', label: 'Chuyên môn' },
  { id: 'service', label: 'Dịch vụ' },
  { id: 'verification', label: 'Xác minh' },
]

export default function MentorOnboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    role: '',
    company: '',
    experience: '',
    bio: '',
    expertise: [] as string[],
    interviewTypes: [] as string[],
    languages: [] as string[],
    duration: '60',
    format: 'Video call',
    evidenceUrl: '',
    agreedPrivacy: false,
  })

  const toggleArr = (key: 'expertise' | 'interviewTypes' | 'languages', val: string) => {
    setForm(p => ({
      ...p,
      [key]: p[key].includes(val) ? p[key].filter(x => x !== val) : [...p[key], val],
    }))
  }

  const steps = [
    // Step 0: Background
    <div key="0" className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-ink-secondary mb-1.5">Vị trí hiện tại <span className="text-accent">*</span></label>
        <input type="text" placeholder="vd. Senior Frontend Engineer" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
          className="w-full bg-canvas-subtle border border-edge rounded-lg px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-ink-secondary mb-1.5">Công ty <span className="text-accent">*</span></label>
        <input type="text" placeholder="vd. Shopee, VNG, Google" value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))}
          className="w-full bg-canvas-subtle border border-edge rounded-lg px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none" />
      </div>
      <div>
        <label className="block text-xs font-semibold text-ink-secondary mb-1.5">Số năm kinh nghiệm <span className="text-accent">*</span></label>
        <select value={form.experience} onChange={e => setForm(p => ({ ...p, experience: e.target.value }))}
          className="w-full bg-canvas-subtle border border-edge rounded-lg px-4 py-2.5 text-sm text-ink focus:border-primary outline-none">
          <option value="">Chọn</option>
          {['1-2 năm', '3-5 năm', '5-8 năm', '8+ năm'].map(o => <option key={o}>{o}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold text-ink-secondary mb-1.5">Giới thiệu bản thân <span className="text-accent">*</span></label>
        <textarea rows={4} placeholder="Mô tả kinh nghiệm và phong cách mentor của bạn..." value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
          className="w-full bg-canvas-subtle border border-edge rounded-lg px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none resize-none" />
      </div>
    </div>,

    // Step 1: Expertise
    <div key="1" className="space-y-5">
      {[
        { label: 'Chuyên môn kỹ thuật', key: 'expertise' as const, opts: ['JavaScript', 'TypeScript', 'React', 'Vue', 'CSS', 'Node.js', 'System Design', 'Leadership'] },
        { label: 'Loại phỏng vấn bạn có thể mentor', key: 'interviewTypes' as const, opts: ['Technical', 'System Design', 'Behavioral', 'Leadership', 'Case study'] },
        { label: 'Ngôn ngữ', key: 'languages' as const, opts: ['Tiếng Việt', 'English', 'Tiếng Nhật', 'Tiếng Hàn'] },
      ].map(section => (
        <div key={section.label}>
          <p className="text-xs font-semibold text-ink-secondary mb-2">{section.label} <span className="text-accent">*</span></p>
          <div className="flex flex-wrap gap-2">
            {section.opts.map(o => (
              <button key={o} onClick={() => toggleArr(section.key, o)}
                className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
                  form[section.key].includes(o) ? 'bg-primary text-on-primary border-primary' : 'border-edge text-ink-secondary hover:border-primary hover:text-primary'
                }`}>
                {o}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>,

    // Step 2: Service
    <div key="2" className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-ink-secondary mb-1.5">Thời lượng buổi (phút)</label>
        <div className="flex gap-2">
          {['30', '45', '60', '90'].map(d => (
            <button key={d} onClick={() => setForm(p => ({ ...p, duration: d }))}
              className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${form.duration === d ? 'bg-primary text-on-primary border-primary' : 'border-edge text-ink-secondary hover:border-primary'}`}>
              {d}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-ink-secondary mb-1.5">Hình thức</label>
        <select value={form.format} onChange={e => setForm(p => ({ ...p, format: e.target.value }))}
          className="w-full bg-canvas-subtle border border-edge rounded-lg px-4 py-2.5 text-sm text-ink focus:border-primary outline-none">
          <option>Video call</option>
          <option>Audio only</option>
        </select>
      </div>
      <div className="p-4 bg-canvas-subtle border border-edge rounded-lg text-xs text-ink-muted">
        <p className="font-semibold text-ink-secondary mb-1">Lưu ý về phí</p>
        <p>Trong giai đoạn beta, tất cả buổi mentor là miễn phí. Chúng tôi sẽ thông báo khi chính sách phí được áp dụng.</p>
      </div>
    </div>,

    // Step 3: Verification
    <div key="3" className="space-y-4">
      <div className="p-4 bg-notice-soft border border-notice/20 rounded-lg text-xs text-ink-secondary">
        <p className="font-semibold text-ink mb-1">Tại sao cần xác minh?</p>
        <p>PrepVI xác minh tất cả mentor để đảm bảo chất lượng. Quá trình này thường mất 2-3 ngày làm việc.</p>
      </div>
      <div>
        <label className="block text-xs font-semibold text-ink-secondary mb-1.5">LinkedIn profile URL <span className="text-accent">*</span></label>
        <input type="url" placeholder="https://linkedin.com/in/your-name" value={form.evidenceUrl} onChange={e => setForm(p => ({ ...p, evidenceUrl: e.target.value }))}
          className="w-full bg-canvas-subtle border border-edge rounded-lg px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-primary outline-none" />
      </div>
      <div className="p-4 bg-canvas-subtle border border-edge rounded-lg text-xs text-ink-muted space-y-1">
        <p className="font-semibold text-ink-secondary">Bằng chứng bổ sung (tùy chọn)</p>
        <p>· Ảnh thẻ nhân viên hoặc email công ty</p>
        <p>· Link GitHub / portfolio</p>
        <p>· Bất kỳ tài liệu nào xác minh vai trò hiện tại</p>
      </div>
      <label className="flex items-start gap-2 cursor-pointer">
        <input type="checkbox" checked={form.agreedPrivacy} onChange={e => setForm(p => ({ ...p, agreedPrivacy: e.target.checked }))} className="mt-0.5 accent-primary" />
        <span className="text-xs text-ink-secondary">Tôi đồng ý với Chính sách quyền riêng tư và cho phép PrepVI xử lý thông tin xác minh của tôi.</span>
      </label>
    </div>,
  ]

  return (
    <div className="min-h-screen bg-canvas">
      <AuthNavbar />

      <div className="max-w-[640px] mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-[22px] font-semibold text-ink mb-1">Đăng ký làm mentor</h1>
          <p className="text-sm text-ink-secondary">Chia sẻ kiến thức và giúp học viên chuẩn bị phỏng vấn tốt hơn.</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-0 mb-8">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                  i < step ? 'bg-primary text-on-primary' : i === step ? 'bg-primary-soft border-2 border-primary text-primary' : 'bg-canvas-subtle border border-edge text-ink-muted'
                }`}>
                  {i < step ? (
                    <Check aria-hidden size={14} weight="bold" />
                  ) : i + 1}
                </div>
                <span className="text-[10px] text-ink-muted mt-1 whitespace-nowrap">{s.label}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`flex-1 h-px mx-1 ${i < step ? 'bg-primary' : 'bg-edge'}`}/>}
            </div>
          ))}
        </div>

        <div className="bg-panel border border-edge rounded-xl p-6 mb-5">
          <p className="text-sm font-semibold text-ink mb-4">{STEPS[step].label}</p>
          {steps[step]}
        </div>

        <div className="flex justify-between">
          <div className="flex gap-2">
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)} className="text-sm border border-edge text-ink-secondary hover:border-primary hover:text-primary font-medium px-5 py-2.5 rounded-lg transition-colors">
                Quay lại
              </button>
            )}
            <button className="text-sm text-ink-muted hover:text-ink transition-colors px-3 py-2">
              Lưu nháp
            </button>
          </div>
          {step < STEPS.length - 1 ? (
            <button onClick={() => setStep(s => s + 1)} className="text-sm bg-primary hover:bg-primary-hover text-on-primary font-medium px-6 py-2.5 rounded-lg transition-colors">
              <span className="inline-flex items-center gap-1">Tiếp tục <ArrowRight aria-hidden size={14} /></span>
            </button>
          ) : (
            <button onClick={() => navigate('/mentor/verification')} className="text-sm bg-primary hover:bg-primary-hover text-on-primary font-medium px-6 py-2.5 rounded-lg transition-colors">
              Gửi hồ sơ
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
