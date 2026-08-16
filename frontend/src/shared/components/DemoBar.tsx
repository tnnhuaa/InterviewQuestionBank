import { useNavigate } from 'react-router-dom'
import { useApp, type Role } from '@/app/AppContext'
import { routes } from '@/app/routePaths'

const ROLES: { value: Role; label: string; path: string }[] = [
  { value: 'public', label: 'Khách', path: routes.home },
  { value: 'student', label: 'Học viên', path: routes.studentDashboard },
  { value: 'mentor', label: 'Mentor', path: routes.mentorBookings },
  { value: 'admin', label: 'Admin', path: routes.adminQueue },
]

const QUICK_LINKS: { label: string; path: string; role: Role }[] = [
  { label: 'Homepage', path: '/homepage', role: 'public' },
  { label: 'Login', path: '/login', role: 'public' },
  { label: 'Question Bank', path: '/questions', role: 'public' },
  { label: 'Event Loop', path: '/questions/js-event-loop', role: 'public' },
  { label: 'Mentors', path: '/mentors', role: 'public' },
  { label: 'Mentor Profile', path: '/mentors/minh-nguyen', role: 'public' },
  { label: 'Dashboard', path: '/student/dashboard', role: 'student' },
  { label: 'S11 JD Upload', path: routes.jobDescriptionNew, role: 'student' },
  { label: 'S12 OCR Review', path: routes.jobDescriptionReview('demo-jd'), role: 'student' },
  { label: 'S13 Mapping', path: routes.jobDescriptionMapping('demo-jd'), role: 'student' },
  { label: 'S14 Questions', path: routes.preparationPlan('demo-plan'), role: 'student' },
  { label: 'Booking Form', path: '/bookings/new', role: 'student' },
  { label: 'Booking Status', path: routes.booking('BK-2024-001'), role: 'student' },
  { label: 'Session', path: '/sessions/S-001', role: 'student' },
  { label: 'Feedback', path: routes.feedback('BK-2024-001'), role: 'student' },
  { label: 'Review', path: routes.review('BK-2024-001'), role: 'student' },
  { label: 'Onboarding', path: '/mentor/onboarding', role: 'mentor' },
  { label: 'Verification', path: '/mentor/verification', role: 'mentor' },
  { label: 'Profile Edit', path: '/mentor/profile', role: 'mentor' },
  { label: 'Availability', path: '/mentor/availability', role: 'mentor' },
  { label: 'Inbox', path: '/mentor/bookings', role: 'mentor' },
  { label: 'Booking Decision', path: '/mentor/bookings/BK-2024-002', role: 'mentor' },
  { label: 'Mentor Session', path: '/mentor/sessions/S-001', role: 'mentor' },
  { label: 'Give Feedback', path: '/mentor/feedback/BK-2024-001', role: 'mentor' },
  { label: 'Admin Queue', path: '/admin', role: 'admin' },
  { label: 'Mentor Review', path: '/admin/mentors/duc-tran/review', role: 'admin' },
  { label: 'Question Mgmt', path: '/admin/questions', role: 'admin' },
  { label: 'Case Detail', path: '/admin/cases/Q-002', role: 'admin' },
  { label: 'Audit Log', path: '/admin/audit/AUD-001', role: 'admin' },
]

export default function DemoBar() {
  const { role, setRole } = useApp()
  const navigate = useNavigate()

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole)
    const target = ROLES.find(r => r.value === newRole)
    if (target) navigate(target.path)
  }

  const currentLinks = QUICK_LINKS.filter(l => l.role === role || l.role === 'public')

  return (
    <div className="bg-ink text-canvas-subtle text-[11px] border-b border-ink/30 sticky top-0 z-50">
      <div className="flex items-center gap-0 overflow-x-auto">
        <div className="flex items-center gap-1 px-3 py-1.5 border-r border-panel/10 shrink-0">
          <span className="text-ink-muted mr-1">Demo</span>
          {ROLES.map(r => (
            <button
              key={r.value}
              onClick={() => handleRoleChange(r.value)}
              className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                role === r.value ? 'bg-primary text-on-primary' : 'text-on-primary/60 hover:text-on-primary'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-0 overflow-x-auto px-2">
          {currentLinks.map(l => (
            <button
              key={l.path}
              onClick={() => navigate(l.path)}
              className="px-2 py-1.5 text-on-primary/50 hover:text-on-primary/90 whitespace-nowrap transition-colors"
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
