interface StatusBadgeProps {
  status: string
  size?: 'sm' | 'md'
}

const STATUS_CONFIG: Record<string, { label: string; className: string; dot?: string }> = {
  'not-started': { label: 'Chưa luyện', className: 'bg-canvas-subtle text-ink-muted', dot: 'bg-edge-strong' },
  practicing: { label: 'Đang luyện', className: 'bg-notice-soft text-notice-ink', dot: 'bg-notice' },
  confident: { label: 'Tự tin', className: 'bg-ok-soft text-primary', dot: 'bg-ok' },
  pending: { label: 'Đang chờ', className: 'bg-notice-soft text-notice-ink', dot: 'bg-notice' },
  confirmed: { label: 'Đã xác nhận', className: 'bg-ok-soft text-primary', dot: 'bg-ok' },
  completed: { label: 'Hoàn thành', className: 'bg-primary-soft text-primary', dot: 'bg-primary' },
  rejected: { label: 'Đã từ chối', className: 'bg-danger-soft text-danger', dot: 'bg-danger' },
  cancelled: { label: 'Đã hủy', className: 'bg-canvas-subtle text-ink-muted', dot: 'bg-edge-strong' },
  'reschedule-proposed': { label: 'Đề xuất đổi lịch', className: 'bg-accent-soft text-accent', dot: 'bg-accent' },
  draft: { label: 'Draft', className: 'bg-canvas-subtle text-ink-muted' },
  'in-review': { label: 'Đang review', className: 'bg-notice-soft text-notice-ink' },
  published: { label: 'Đã xuất bản', className: 'bg-ok-soft text-primary' },
  archived: { label: 'Lưu trữ', className: 'bg-canvas-subtle text-ink-muted' },
  approved: { label: 'Đã duyệt', className: 'bg-ok-soft text-primary', dot: 'bg-ok' },
  'pending-verification': { label: 'Chờ xác minh', className: 'bg-notice-soft text-notice-ink' },
}

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] || { label: status, className: 'bg-canvas-subtle text-ink-muted' }
  const sizeClass = size === 'sm' ? 'text-[10px] px-1.5 py-0.5 gap-1' : 'text-xs px-2 py-1 gap-1.5'
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${config.className} ${sizeClass}`}>
      {config.dot && <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} aria-hidden="true"/>}
      {config.label}
    </span>
  )
}
