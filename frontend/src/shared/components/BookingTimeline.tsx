import type { TimelineEvent } from '@/shared/data/mock'

interface BookingTimelineProps {
  events: TimelineEvent[]
}

export default function BookingTimeline({ events }: BookingTimelineProps) {
  return (
    <div className="space-y-0">
      {events.map((event, i) => (
        <div key={i} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className={`w-2.5 h-2.5 rounded-full border-2 mt-1.5 shrink-0 ${
              event.status === 'confirmed' ? 'border-ok bg-ok' :
              event.status === 'rejected' ? 'border-danger bg-danger' :
              i === events.length - 1 ? 'border-primary bg-primary' : 'border-edge-strong bg-panel'
            }`}/>
            {i < events.length - 1 && <div className="w-px flex-1 bg-edge mt-1 mb-1 min-h-[24px]"/>}
          </div>
          <div className="pb-5 flex-1">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-sm font-medium text-ink">{event.actor}</span>
              <span className="text-xs text-ink-muted">{event.timestamp}</span>
            </div>
            <p className="text-sm text-ink-secondary mt-0.5">{event.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
