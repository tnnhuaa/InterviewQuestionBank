import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  FileText,
  Info,
  ShieldCheck,
  TextT,
  Trash,
  UploadSimple,
  Warning,
} from '@phosphor-icons/react'
import AuthNavbar from '@/shared/components/AuthNavbar'
import JDFlowStepper from '@/shared/components/JDFlowStepper'

interface SelectedFile {
  name: string
  size: number
  warning?: string
}

const DEMO_FILES: SelectedFile[] = [
  { name: 'Frontend_Intern_JD.jpg', size: 1240000 },
]

const UPLOAD_TIPS = ['Ảnh đủ sáng', 'Không bị mờ', 'Chụp thẳng, không nghiêng', 'Không cắt mất nội dung', 'Tránh phản chiếu màn hình']
const PASTE_TIPS = ['Giữ nguyên tiêu đề từng mục', 'Bao gồm yêu cầu kỹ năng', 'Không dán nội dung quá 50.000 ký tự']
const MAX_FILE_SIZE = 10 * 1024 * 1024
const MAX_TEXT_LENGTH = 50_000

export default function JDUpload() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<SelectedFile[]>(DEMO_FILES)
  const [intakeMode, setIntakeMode] = useState<'upload' | 'paste'>('upload')
  const [pastedText, setPastedText] = useState('')
  const [fileError, setFileError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState(0)

  const formatSize = (bytes: number) =>
    bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`

  const addFile = (name: string, size: number) => {
    setFileError(null)
    if (!/\.(pdf|png|jpe?g)$/i.test(name)) {
      setFileError('Chỉ hỗ trợ PDF, PNG, JPG hoặc JPEG.')
      return
    }
    if (size > MAX_FILE_SIZE) {
      setFileError('Tệp vượt quá giới hạn 10 MB.')
      return
    }
    setFiles([{ name, size }])
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) addFile(f.name, f.size)
    e.target.value = ''
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files?.[0]
    if (f) addFile(f.name, f.size)
  }

  const removeFile = () => setFiles([])
  const canExtract = intakeMode === 'paste' ? pastedText.trim().length >= 30 : files.length === 1

  const handleExtract = () => {
    setProcessing(true)
    setProcessingStep(0)
    let step = 0
    const iv = setInterval(() => {
      step++
      setProcessingStep(step)
      if (step >= 2) {
        clearInterval(iv)
        setTimeout(() => navigate('/job-descriptions/demo-jd/review'), 600)
      }
    }, 900)
  }

  const PROCESS_STEPS = ['Đang tải ảnh lên', 'Đang đọc nội dung', 'Chuẩn bị bản xem trước']

  if (processing) {
    return (
      <div className="min-h-screen bg-canvas">
        <AuthNavbar />
        <JDFlowStepper currentStep={0} />
        <div className="max-w-[480px] mx-auto px-6 py-24 text-center">
          <div className="w-12 h-12 border-[3px] border-primary border-t-transparent rounded-full animate-spin mx-auto mb-8" />
          <p className="text-base font-semibold text-ink mb-2">{PROCESS_STEPS[processingStep]}</p>
          <div className="flex justify-center gap-2 mb-4">
            {PROCESS_STEPS.map((s, i) => (
              <div key={s} className={`h-1 rounded-full transition-all duration-500 ${i <= processingStep ? 'bg-primary w-10' : 'bg-edge w-6'}`} />
            ))}
          </div>
          <p className="text-sm text-ink-muted">Quá trình này có thể mất một chút thời gian.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-canvas">
      <AuthNavbar />
      <JDFlowStepper currentStep={0} />

      <div className="max-w-[720px] mx-auto px-6 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-ink tracking-tight">Tải lên Job Description</h1>
          <p className="text-sm text-ink-secondary mt-2 leading-relaxed">
            Tải tệp hoặc dán nội dung JD — hệ thống sẽ trích xuất và giúp bạn xác định những gì cần ôn luyện.
          </p>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-2 rounded-xl border border-edge bg-canvas-subtle p-1" role="tablist" aria-label="Cách nhập Job Description">
          <button
            type="button"
            role="tab"
            aria-selected={intakeMode === 'upload'}
            onClick={() => setIntakeMode('upload')}
            className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${intakeMode === 'upload' ? 'bg-panel text-primary shadow-sm' : 'text-ink-muted hover:text-ink'}`}
          >
            <UploadSimple aria-hidden size={17} />
            Tải tệp
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={intakeMode === 'paste'}
            onClick={() => setIntakeMode('paste')}
            className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${intakeMode === 'paste' ? 'bg-panel text-primary shadow-sm' : 'text-ink-muted hover:text-ink'}`}
          >
            <TextT aria-hidden size={17} />
            Dán nội dung
          </button>
        </div>

        {/* Main upload area */}
        {intakeMode === 'paste' ? (
          <div className="mb-6">
            <label htmlFor="jd-text" className="mb-2 block text-sm font-semibold text-ink">Nội dung Job Description</label>
            <textarea
              id="jd-text"
              value={pastedText}
              maxLength={MAX_TEXT_LENGTH}
              onChange={event => setPastedText(event.target.value)}
              placeholder="Dán toàn bộ nội dung JD vào đây…"
              className="min-h-64 w-full resize-y rounded-xl border border-edge bg-panel px-4 py-3 text-sm leading-6 text-ink outline-none transition-colors placeholder:text-ink-muted focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
            <div className="mt-2 flex items-center justify-between gap-4 text-xs text-ink-muted">
              <span>Cần ít nhất 30 ký tự để tiếp tục.</span>
              <span className="tabular-nums">{pastedText.length.toLocaleString('vi-VN')} / {MAX_TEXT_LENGTH.toLocaleString('vi-VN')}</span>
            </div>
          </div>
        ) : files.length === 0 ? (
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`rounded-2xl border-2 border-dashed transition-all duration-200 mb-6 ${
              dragOver ? 'border-primary bg-primary-soft scale-[1.01]' : 'border-edge bg-panel hover:border-edge-strong'
            }`}
          >
            <div className="py-14 px-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-canvas-subtle border border-edge flex items-center justify-center mx-auto mb-5">
                <FileText aria-hidden size={27} className="text-ink-muted" />
              </div>
              <p className="text-base font-semibold text-ink mb-1">Kéo Job Description vào đây</p>
              <p className="text-sm text-ink-muted mb-6">PDF, PNG, JPG hoặc JPEG · Tối đa 10 MB · PDF tối đa 5 trang</p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-on-primary font-medium px-5 py-2.5 rounded-xl text-sm transition-colors"
                >
                  <UploadSimple aria-hidden size={17} />
                  Chọn tệp
                </button>
                <button onClick={() => cameraInputRef.current?.click()} className="inline-flex items-center gap-2 border border-edge text-ink-secondary hover:border-edge-strong hover:text-ink font-medium px-5 py-2.5 rounded-xl text-sm transition-colors bg-panel">
                  <Camera aria-hidden size={17} />
                  Chụp ảnh
                </button>
              </div>
            </div>
            <input ref={fileInputRef} type="file" accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg" className="hidden" onChange={handleFileInput} />
            <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileInput} />
          </div>
        ) : (
          /* File preview */
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-ink">
                Tệp đã chọn
              </p>
              <button onClick={() => fileInputRef.current?.click()} className="text-sm text-primary hover:underline font-medium">Thay tệp</button>
              <input ref={fileInputRef} type="file" accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg" className="hidden" onChange={handleFileInput} />
            </div>

            <div className="space-y-2">
              {files.map(f => (
                <div
                  key={f.name}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border transition-colors ${
                    f.warning ? 'bg-notice/8 border-notice/25' : 'bg-panel border-edge'
                  }`}
                >
                  {/* Document thumbnail */}
                  <div className="flex h-12 w-10 shrink-0 items-center justify-center rounded-lg border border-edge bg-canvas-subtle text-ink-muted">
                    <FileText aria-hidden size={22} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{f.name}</p>
                    <p className="text-xs text-ink-muted mt-0.5">
                      {formatSize(f.size)}
                    </p>
                    {f.warning && (
                      <p className="text-xs text-notice font-medium mt-1 flex items-center gap-1">
                        <Warning aria-hidden size={13} />
                        {f.warning}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={removeFile}
                      className="p-1.5 text-ink-muted hover:text-danger hover:bg-danger-soft rounded-lg transition-colors"
                      title="Xóa ảnh"
                    >
                      <Trash aria-hidden size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {fileError && <p role="alert" className="mb-5 flex items-center gap-2 rounded-lg border border-danger/20 bg-danger-soft px-3 py-2 text-xs text-danger"><Warning aria-hidden size={15} />{fileError}</p>}

        {/* Input-specific guidance */}
        <div className="flex items-start gap-2.5 bg-canvas-subtle rounded-xl px-4 py-3 mb-5">
          <Info aria-hidden size={16} className="mt-0.5 shrink-0 text-ok" />
          <div>
            <p className="text-xs font-semibold text-ink-secondary mb-1.5">
              {intakeMode === 'paste' ? 'Để giữ đúng cấu trúc JD' : 'Để kết quả chính xác hơn'}
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {(intakeMode === 'paste' ? PASTE_TIPS : UPLOAD_TIPS).map(tip => (
                <span key={tip} className="text-xs text-ink-muted flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-ok shrink-0" />
                  {tip}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Privacy notice */}
        <div className="flex items-start gap-2.5 rounded-xl border border-edge px-4 py-3 mb-8 bg-panel">
          <ShieldCheck aria-hidden size={17} className="mt-0.5 shrink-0 text-ink-muted" />
          <div className="flex-1 min-w-0">
            <span className="text-xs text-ink-secondary font-medium">Kiểm tra thông tin cá nhân trước khi gửi. </span>
            <span className="text-xs text-ink-muted">JD đôi khi chứa email hoặc số điện thoại — hãy che những thông tin không cần thiết. </span>
            <button className="text-xs text-primary hover:underline">Tìm hiểu thêm</button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/student/dashboard')}
            className="text-sm text-ink-secondary hover:text-ink transition-colors"
          >
            <span className="inline-flex items-center gap-1"><ArrowLeft aria-hidden size={15} />Quay lại</span>
          </button>
          <button
            onClick={handleExtract}
            disabled={!canExtract}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed text-on-primary font-semibold px-8 py-3 rounded-xl text-sm transition-colors"
          >
            Trích xuất nội dung
            <ArrowRight aria-hidden size={16} weight="bold" />
          </button>
        </div>
      </div>
    </div>
  )
}
