import { useState } from 'react'
import { Plus, X } from '@phosphor-icons/react'
import AuthNavbar from '@/shared/components/AuthNavbar'

interface Slot {
  id: string
  day: string
  start: string
  end: string
  state: 'available' | 'held' | 'booked' | 'past'
}

const INITIAL_SLOTS: Slot[] = [
  { id: '1', day: 'Thứ Hai', start: '09:00', end: '10:00', state: 'booked' },
  { id: '2', day: 'Thứ Ba', start: '09:00', end: '10:00', state: 'available' },
  { id: '3', day: 'Thứ Ba', start: '14:00', end: '15:00', state: 'held' },
  { id: '4', day: 'Thứ Tư', start: '14:00', end: '15:00', state: 'available' },
  { id: '5', day: 'Thứ Năm', start: '16:00', end: '17:00', state: 'available' },
  { id: '6', day: 'Thứ Bảy', start: '10:00', end: '11:00', state: 'past' },
]

const STATE_CONFIG = {
  available: { label: 'Khả dụng', className: 'bg-ok-soft border-ok/30 text-ok' },
  held: { label: 'Đang giữ', className: 'bg-notice-soft border-notice/30 text-notice-ink' },
  booked: { label: 'Đã đặt', className: 'bg-primary-soft border-primary/30 text-primary' },
  past: { label: 'Đã qua', className: 'bg-canvas-subtle border-edge text-ink-muted' },
}

const DAYS = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật']

export default function MentorAvailability() {
  const [slots, setSlots] = useState<Slot[]>(INITIAL_SLOTS)
  const [showAdd, setShowAdd] = useState(false)
  const [newSlot, setNewSlot] = useState({ day: 'Thứ Hai', start: '09:00', end: '10:00' })
  const [addError, setAddError] = useState('')

  const addSlot = () => {
    if (newSlot.start >= newSlot.end) { setAddError('Giờ kết thúc phải sau giờ bắt đầu.'); return }
    const overlaps = slots.some(s => s.day === newSlot.day && !(newSlot.end <= s.start || newSlot.start >= s.end))
    if (overlaps) { setAddError('Slot này trùng với slot đã có.'); return }
    setSlots(prev => [...prev, { ...newSlot, id: Date.now().toString(), state: 'available' }])
    setShowAdd(false)
    setAddError('')
  }

  const deleteSlot = (slot: Slot) => {
    if (slot.state === 'booked') return
    setSlots(prev => prev.filter(s => s.id !== slot.id))
  }

  return (
    <div className="min-h-screen bg-canvas">
      <AuthNavbar />

      <div className="max-w-[1100px] mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-[22px] font-semibold text-ink">Lịch khả dụng</h1>
            <p className="text-xs text-ink-muted mt-1">GMT+7 · Hồ Chí Minh · Tuần hiện tại: 18–24 tháng 3</p>
          </div>
          <button onClick={() => setShowAdd(true)} className="text-sm bg-primary hover:bg-primary-hover text-on-primary font-medium px-5 py-2.5 rounded-lg transition-colors flex items-center gap-2">
            <Plus aria-hidden size={15} weight="bold" />
            Thêm slot
          </button>
        </div>

        {/* Legend */}
        <div className="flex gap-4 flex-wrap mb-5">
          {Object.entries(STATE_CONFIG).map(([key, val]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded border ${val.className}`}/>
              <span className="text-xs text-ink-muted">{val.label}</span>
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="bg-panel border border-edge rounded-xl overflow-hidden">
          <div className="grid grid-cols-7 border-b border-edge">
            {DAYS.map(day => (
              <div key={day} className="text-center text-[11px] font-semibold text-ink-secondary py-2.5 border-r border-edge last:border-r-0">{day.replace('Thứ ', 'T')}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 min-h-[320px]">
            {DAYS.map(day => {
              const daySlots = slots.filter(s => s.day === day)
              return (
                <div key={day} className="border-r border-edge last:border-r-0 p-2 space-y-1.5 min-h-[80px]">
                  {daySlots.map(slot => {
                    const cfg = STATE_CONFIG[slot.state]
                    return (
                      <div key={slot.id} className={`border rounded-md p-1.5 text-[10px] font-medium ${cfg.className} relative group`}>
                        <p>{slot.start} – {slot.end}</p>
                        <p className="opacity-60">{cfg.label}</p>
                        {slot.state !== 'booked' && slot.state !== 'past' && (
                          <button onClick={() => deleteSlot(slot)}
                            className="absolute top-0.5 right-0.5 w-4 h-4 rounded opacity-0 group-hover:opacity-100 flex items-center justify-center bg-panel/70 text-danger transition-opacity">
                            <X aria-hidden size={10} weight="bold" />
                          </button>
                        )}
                        {slot.state === 'booked' && (
                          <button className="mt-1 text-[9px] text-primary hover:underline block">Xem đặt lịch</button>
                        )}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>

        {/* Add slot dialog */}
        {showAdd && (
          <div className="fixed inset-0 bg-ink/30 flex items-center justify-center z-50 p-4">
            <div className="bg-panel border border-edge rounded-xl p-6 w-full max-w-[380px] shadow-xl">
              <h2 className="text-base font-semibold text-ink mb-4">Thêm slot khả dụng</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-ink-secondary mb-1.5">Ngày trong tuần</label>
                  <select value={newSlot.day} onChange={e => setNewSlot(p => ({ ...p, day: e.target.value }))}
                    className="w-full bg-canvas-subtle border border-edge rounded-lg px-4 py-2.5 text-sm focus:border-primary outline-none">
                    {DAYS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-ink-secondary mb-1.5">Từ</label>
                    <input type="time" value={newSlot.start} onChange={e => setNewSlot(p => ({ ...p, start: e.target.value }))}
                      className="w-full bg-canvas-subtle border border-edge rounded-lg px-3 py-2.5 text-sm focus:border-primary outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink-secondary mb-1.5">Đến</label>
                    <input type="time" value={newSlot.end} onChange={e => setNewSlot(p => ({ ...p, end: e.target.value }))}
                      className="w-full bg-canvas-subtle border border-edge rounded-lg px-3 py-2.5 text-sm focus:border-primary outline-none" />
                  </div>
                </div>
                {addError && <p className="text-xs text-danger">{addError}</p>}
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={() => { setShowAdd(false); setAddError('') }} className="flex-1 border border-edge text-ink-secondary font-medium py-2.5 rounded-lg text-sm hover:border-primary hover:text-primary transition-colors">Hủy</button>
                <button onClick={addSlot} className="flex-1 bg-primary hover:bg-primary-hover text-on-primary font-medium py-2.5 rounded-lg text-sm transition-colors">Thêm</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
