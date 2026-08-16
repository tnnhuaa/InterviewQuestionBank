import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Check } from '@phosphor-icons/react'

const STEPS = [
  { label: 'Tải JD' },
  { label: 'Kiểm tra' },
  { label: 'Mapping' },
  { label: 'Bộ câu hỏi' },
]

interface JDFlowStepperProps {
  currentStep: 1 | 2 | 3 | 4
}

export default function JDFlowStepper({ currentStep }: JDFlowStepperProps) {
  const navigate = useNavigate()

  return (
    <div className="bg-panel border-b border-edge">
      <div className="max-w-[960px] mx-auto px-6 py-3 flex items-center gap-0">
        {/* Mobile: compact label */}
        <div className="sm:hidden flex items-center gap-2 text-xs text-ink-muted">
          <span className="w-5 h-5 rounded-full bg-primary text-on-primary text-[10px] font-bold flex items-center justify-center shrink-0">
            {currentStep}
          </span>
          <span className="text-ink font-medium">{STEPS[currentStep - 1].label}</span>
          <span className="text-ink-muted">/ {STEPS.length} bước</span>
        </div>

        {/* Desktop: full stepper */}
        <div className="hidden sm:flex items-center gap-0 flex-1">
          {STEPS.map((step, i) => {
            const done = i < currentStep - 1
            const current = i === currentStep - 1
            return (
              <div key={step.label} className="flex items-center gap-0">
                <button
                  className="flex cursor-default items-center gap-2 px-1"
                >
                  <span
                    className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 transition-colors ${
                      done
                        ? 'bg-ok text-on-primary'
                        : current
                        ? 'bg-primary text-on-primary'
                        : 'bg-canvas-subtle border border-edge text-ink-muted'
                    }`}
                  >
                    {done ? (
                      <Check aria-hidden size={10} weight="bold" />
                    ) : (
                      i + 1
                    )}
                  </span>
                  <span
                    className={`text-xs font-medium transition-colors ${
                      current ? 'text-ink' : done ? 'text-ink-secondary' : 'text-ink-muted'
                    }`}
                  >
                    {step.label}
                  </span>
                </button>

                {i < STEPS.length - 1 && (
                  <div className="flex items-center mx-3">
                    <div className={`h-px w-8 transition-colors ${i < currentStep - 1 ? 'bg-ok' : 'bg-edge'}`} />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Right: back to dashboard */}
        <button
          onClick={() => navigate('/student/dashboard')}
          className="hidden sm:flex items-center gap-1 text-xs text-ink-muted hover:text-ink transition-colors ml-auto"
        >
          <ArrowLeft aria-hidden size={13} /> Trang chủ
        </button>
      </div>
    </div>
  )
}
