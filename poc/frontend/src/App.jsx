import { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP)

const navItems = [
  { id: 'discover', label: 'Tìm mentor' },
  { id: 'booking', label: 'Lịch luyện tập' },
  { id: 'feedback', label: 'Phản hồi' },
]

const people = {
  1: { name: 'Trần Minh Khoa', role: 'Mentor', initials: 'MK' },
  2: { name: 'Nguyễn An', role: 'Student', initials: 'NA' },
  3: { name: 'Lê Thu Hà', role: 'Student', initials: 'TH' },
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
      <path d="M4 10h11M11 6l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
      <path d="m5 10 3 3 7-7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Message({ children, compact = false }) {
  if (!children) return null
  const normalized = children.toLowerCase()
  const tone = normalized.includes('lỗi') || normalized.includes('vui lòng')
    ? 'error'
    : normalized.includes('đang xử lý')
      ? 'loading'
      : 'success'

  return (
    <div className={`message message-${tone} ${compact ? 'message-compact' : ''}`} role="status" aria-live="polite">
      <span className="message-mark"><CheckIcon /></span>
      <span>{children}</span>
    </div>
  )
}

function App() {
  const appRef = useRef(null)
  const [activeView, setActiveView] = useState('discover')
  const [currentUser, setCurrentUser] = useState('2')
  const [tags, setTags] = useState([])
  const [questions, setQuestions] = useState(null)
  const [bookingRes, setBookingRes] = useState('')
  const [bookingStage, setBookingStage] = useState('Chưa tạo')
  const [mentorInputId, setMentorInputId] = useState('')
  const [mentorRes, setMentorRes] = useState('')
  const [authInputId, setAuthInputId] = useState('')
  const [linkRes, setLinkRes] = useState('')
  const [meetingLink, setMeetingLink] = useState('')
  const [feedback, setFeedback] = useState('')
  const [feedbackRes, setFeedbackRes] = useState('')

  const activePerson = people[currentUser]
  const isMentor = activePerson.role === 'Mentor'

  useGSAP(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    gsap.fromTo('.app-nav',
      { y: reducedMotion ? 0 : -18, opacity: 0 },
      { y: 0, opacity: 1, duration: reducedMotion ? 0.01 : 0.65, ease: 'power3.out' },
    )
  }, { scope: appRef })

  useGSAP(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    gsap.fromTo('.view-enter',
      { y: reducedMotion ? 0 : 18, opacity: 0 },
      { y: 0, opacity: 1, duration: reducedMotion ? 0.01 : 0.5, stagger: 0.06, ease: 'power3.out' },
    )
  }, { scope: appRef, dependencies: [activeView], revertOnUpdate: true })

  const fetchAPI = async (endpoint, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      'X-User-Id': currentUser,
      ...options.headers,
    }

    try {
      const response = await fetch(`/api${endpoint}`, { ...options, headers })
      const data = await response.json()
      return { status: response.status, data }
    } catch (error) {
      return { status: 500, data: { message: error.message } }
    }
  }

  const toggleTag = (value, checked) => {
    setTags((current) => checked ? [...current, value] : current.filter((tag) => tag !== value))
  }

  const handleSearchQuestions = async () => {
    const tagQuery = tags.length > 0 ? `?tags=${tags.join(',')}` : ''
    const { status, data } = await fetchAPI(`/questions${tagQuery}`)
    if (status === 200) setQuestions(data)
    else setQuestions([{ error: true, message: data.message || data.error }])
  }

  const handleBookSlot = async () => {
    setBookingRes('Đang xử lý yêu cầu đặt lịch...')
    const { status, data } = await fetchAPI('/bookings', {
      method: 'POST',
      body: JSON.stringify({ slot_id: 1 }),
    })

    if (status === 201) {
      const id = String(data.booking_id)
      setBookingRes(`Đã gửi yêu cầu BK-${id.padStart(4, '0')}. Mentor sẽ xác nhận lịch.`)
      setMentorInputId(id)
      setAuthInputId(id)
      setBookingStage('Chờ xác nhận')
    } else {
      setBookingRes(`Lỗi: ${data.message || data.error}`)
    }
  }

  const handleMentorAction = async (action) => {
    if (!mentorInputId) return setMentorRes('Vui lòng nhập Booking ID')
    setMentorRes('Đang xử lý cập nhật trạng thái...')
    const { status, data } = await fetchAPI(`/bookings/${mentorInputId}/${action}`, { method: 'POST' })

    if (status === 200) {
      const nextStage = action === 'accept' ? 'Đã xác nhận' : 'Hoàn thành'
      setMentorRes(data.message || `Đã chuyển trạng thái sang ${nextStage}.`)
      setBookingStage(nextStage)
      setAuthInputId(mentorInputId)
    } else {
      setMentorRes(`Lỗi: ${data.message || data.error}`)
    }
  }

  const handleViewLink = async () => {
    if (!authInputId) return setLinkRes('Vui lòng nhập Booking ID')
    setLinkRes('Đang xử lý quyền truy cập...')
    const { status, data } = await fetchAPI(`/bookings/${authInputId}/meeting-link`)

    if (status === 200) {
      setMeetingLink(data.meeting_link)
      setLinkRes('Đã xác thực quyền truy cập. Link chỉ hiển thị cho hai bên tham gia.')
    } else {
      setMeetingLink('')
      setLinkRes(`Lỗi: ${data.message || data.error}`)
    }
  }

  const handleSubmitFeedback = async () => {
    if (!authInputId || !feedback.trim()) return setFeedbackRes('Vui lòng nhập Booking ID và nội dung phản hồi')
    setFeedbackRes('Đang xử lý phản hồi...')
    const { status, data } = await fetchAPI(`/bookings/${authInputId}/feedback`, {
      method: 'POST',
      body: JSON.stringify({ content: feedback.trim() }),
    })

    if (status === 200) setFeedbackRes('Đã lưu phản hồi cho buổi luyện tập.')
    else setFeedbackRes(`Lỗi: ${data.message || data.error}`)
  }

  const navigate = (view) => {
    setActiveView(view)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main ref={appRef} className="app-shell">
      <div className="ambient-shape ambient-one" aria-hidden="true" />
      <div className="ambient-shape ambient-two" aria-hidden="true" />

      <header className="app-nav">
        <button className="wordmark" onClick={() => navigate('discover')} aria-label="Về trang tìm mentor">
          <span className="wordmark-mark">IP</span>
          <span>Interview Practice</span>
        </button>

        <nav className="nav-links" aria-label="Điều hướng chính">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={activeView === item.id ? 'nav-link is-active' : 'nav-link'}
              onClick={() => navigate(item.id)}
              aria-current={activeView === item.id ? 'page' : undefined}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="identity-control">
          <label htmlFor="demo-user">Chế độ xem</label>
          <select id="demo-user" value={currentUser} onChange={(event) => setCurrentUser(event.target.value)}>
            <option value="2">Student · Nguyễn An</option>
            <option value="3">Student · Thu Hà</option>
            <option value="1">Mentor · Minh Khoa</option>
          </select>
          <span className="avatar" aria-hidden="true">{activePerson.initials}</span>
        </div>
      </header>

      {activeView === 'discover' && (
        <div className="page-container">
          <header className="page-title view-enter">
            <h1>Tìm mentor phù hợp</h1>
          </header>

          <section className="discover-grid view-enter">
            <div className="mentor-column">
              <div className="section-heading">
                <div>
                  <p className="context-line">Một mentor phù hợp</p>
                  <h2>Trần Minh Khoa</h2>
                </div>
                <span className="verified-badge"><CheckIcon /> Đã xác minh</span>
              </div>

              <div className="mentor-summary">
                <div className="mentor-avatar">MK</div>
                <div>
                  <p className="mentor-role">Senior Front-end Engineer</p>
                  <p>6 năm kinh nghiệm · Tiếng Việt / English</p>
                </div>
              </div>

              <p className="mentor-bio">Tập trung vào phỏng vấn Front-end entry-level, cách trình bày quyết định kỹ thuật và phản hồi có dẫn chứng.</p>

              <div className="expertise-list" aria-label="Chuyên môn">
                <span>React</span>
                <span>JavaScript</span>
                <span>Behavioral interview</span>
              </div>

              <div className="question-tool">
                <div className="tool-heading">
                  <div>
                    <h3>Bộ câu hỏi nên ôn</h3>
                    <p>Lọc nhanh nội dung trước buổi luyện.</p>
                  </div>
                  <button className="text-action" onClick={handleSearchQuestions}>Tải câu hỏi</button>
                </div>

                <fieldset className="tag-options">
                  <legend className="sr-only">Lọc câu hỏi theo chủ đề</legend>
                  <label>
                    <input type="checkbox" value="1" onChange={(event) => toggleTag(event.target.value, event.target.checked)} />
                    <span>React</span>
                  </label>
                  <label>
                    <input type="checkbox" value="2" onChange={(event) => toggleTag(event.target.value, event.target.checked)} />
                    <span>Node.js</span>
                  </label>
                </fieldset>

                <div className="question-results" aria-live="polite">
                  {questions === null && <p className="empty-copy">Chọn chủ đề rồi tải danh sách câu hỏi.</p>}
                  {questions?.length === 0 && <p className="empty-copy">Không tìm thấy câu hỏi phù hợp.</p>}
                  {questions?.map((question) => (
                    <div key={question.id || question.message} className={question.error ? 'question-row is-error' : 'question-row'}>
                      <span>{question.error ? '!' : String(question.id).padStart(2, '0')}</span>
                      <p>{question.error ? question.message : question.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <aside className="booking-composer">
              <div className="section-heading">
                <div>
                  <p className="context-line">Lịch gần nhất</p>
                  <h2>Chọn thời gian luyện</h2>
                </div>
                <span className="availability">Còn chỗ</span>
              </div>

              <div className="slot-picker" role="radiogroup" aria-label="Chọn thời gian">
                <button className="slot is-selected" role="radio" aria-checked="true">
                  <strong>Thứ Ba, 01/09</strong>
                  <span>10:00-11:00 · GMT+7</span>
                </button>
                <button className="slot" role="radio" aria-checked="false">
                  <strong>Thứ Tư, 02/09</strong>
                  <span>10:00-11:00 · GMT+7</span>
                </button>
              </div>

              <div className="booking-details">
                <div><span>Vị trí mục tiêu</span><strong>Front-end Intern</strong></div>
                <div><span>Thời lượng</span><strong>60 phút</strong></div>
                <div><span>Hình thức</span><strong>Google Meet</strong></div>
              </div>

              <label className="field-label" htmlFor="practice-goal">Mục tiêu buổi luyện</label>
              <textarea id="practice-goal" rows="4" defaultValue="Luyện cách trình bày kiến thức React và xử lý câu hỏi tiếp nối." />

              <button className="primary-button" onClick={handleBookSlot} disabled={isMentor}>
                <span>{isMentor ? 'Chuyển sang Student để đặt lịch' : 'Gửi yêu cầu đặt lịch'}</span>
                <span className="button-icon"><ArrowIcon /></span>
              </button>
              <Message>{bookingRes}</Message>
            </aside>
          </section>
        </div>
      )}

      {activeView === 'booking' && (
        <div className="page-container">
          <header className="page-title view-enter">
            <h1>Lịch luyện tập</h1>
          </header>

          <section className="booking-workspace view-enter">
            <div className="booking-main">
              <div className="people-row">
                <div className="person-card"><span className="avatar avatar-large">NA</span><div><span>Student</span><strong>Nguyễn An</strong></div></div>
                <div className="connection-line"><span /></div>
                <div className="person-card"><span className="avatar avatar-large">MK</span><div><span>Mentor</span><strong>Trần Minh Khoa</strong></div></div>
              </div>

              <div className="session-facts">
                <div><span>Thời gian</span><strong>10:00, Thứ Ba 01/09/2026</strong></div>
                <div><span>Mục tiêu</span><strong>Front-end Intern · React</strong></div>
                <div><span>Thời lượng</span><strong>60 phút · GMT+7</strong></div>
              </div>

              <div className="timeline-section">
                <h2>Tiến trình booking</h2>
                <div className="timeline">
                  <div className="timeline-item is-done"><span className="timeline-dot"><CheckIcon /></span><div><strong>Yêu cầu được tạo</strong><p>Nguyễn An · vừa xong</p></div></div>
                  <div className={['Đã xác nhận', 'Hoàn thành'].includes(bookingStage) ? 'timeline-item is-done' : 'timeline-item'}><span className="timeline-dot"><CheckIcon /></span><div><strong>Mentor xác nhận lịch</strong><p>{['Đã xác nhận', 'Hoàn thành'].includes(bookingStage) ? 'Trần Minh Khoa · đã cập nhật' : 'Đang chờ phản hồi'}</p></div></div>
                  <div className={bookingStage === 'Hoàn thành' ? 'timeline-item is-done' : 'timeline-item'}><span className="timeline-dot"><CheckIcon /></span><div><strong>Buổi luyện hoàn thành</strong><p>{bookingStage === 'Hoàn thành' ? 'Mentor đã xác nhận hoàn thành' : 'Chưa diễn ra'}</p></div></div>
                </div>
              </div>
            </div>

            <aside className="action-panel">
              <div>
                <p className="context-line">Thao tác theo vai trò</p>
                <h2>{isMentor ? 'Xử lý yêu cầu' : 'Truy cập buổi luyện'}</h2>
                <p className="support-copy">Bạn đang xem với quyền {isMentor ? 'Mentor' : 'Student'}.</p>
              </div>

              <label className="field-label" htmlFor="booking-action-id">Booking ID</label>
              <input id="booking-action-id" type="number" placeholder="Ví dụ: 12" value={isMentor ? mentorInputId : authInputId} onChange={(event) => isMentor ? setMentorInputId(event.target.value) : setAuthInputId(event.target.value)} />

              {isMentor ? (
                <div className="action-stack">
                  <button className="primary-button" onClick={() => handleMentorAction('accept')}><span>Xác nhận lịch</span><span className="button-icon"><ArrowIcon /></span></button>
                  <button className="secondary-button" onClick={() => handleMentorAction('complete')}>Đánh dấu hoàn thành</button>
                  <Message compact>{mentorRes}</Message>
                </div>
              ) : (
                <div className="action-stack">
                  <button className="primary-button" onClick={handleViewLink}><span>Kiểm tra meeting link</span><span className="button-icon"><ArrowIcon /></span></button>
                  {meetingLink && <a className="meeting-link" href={meetingLink} target="_blank" rel="noreferrer">Tham gia qua Google Meet <ArrowIcon /></a>}
                  <Message compact>{linkRes}</Message>
                </div>
              )}
            </aside>
          </section>
        </div>
      )}

      {activeView === 'feedback' && (
        <div className="page-container">
          <header className="page-title view-enter">
            <h1>Phản hồi</h1>
          </header>

          <section className="feedback-grid view-enter">
            <div className="feedback-context">
              <div className="section-heading"><div><p className="context-line">Buổi luyện gần nhất</p><h2>Front-end Intern</h2></div><span className="verified-badge">60 phút</span></div>
              <div className="feedback-person"><span className="avatar avatar-large">MK</span><div><strong>Trần Minh Khoa</strong><p>Senior Front-end Engineer</p></div></div>
              <dl className="session-metadata">
                <div><dt>Thời gian</dt><dd>01/09/2026 · 10:00</dd></div>
                <div><dt>Trọng tâm</dt><dd>React và cách diễn đạt</dd></div>
                <div><dt>Trạng thái</dt><dd>{bookingStage}</dd></div>
              </dl>
            </div>

            <div className="feedback-form">
              <div className="section-heading"><div><p className="context-line">{isMentor ? 'Góc nhìn của mentor' : 'Phản hồi dành cho bạn'}</p><h2>{isMentor ? 'Phản hồi có cấu trúc' : 'Nội dung phản hồi'}</h2></div></div>

              <label className="field-label" htmlFor="feedback-booking-id">Booking ID</label>
              <input id="feedback-booking-id" type="number" placeholder="Ví dụ: 12" value={authInputId} onChange={(event) => setAuthInputId(event.target.value)} />

              <label className="field-label" htmlFor="feedback-content">Điểm mạnh, điểm cần cải thiện và hành động tiếp theo</label>
              <textarea id="feedback-content" rows="8" placeholder="Ví dụ: Bạn giải thích component lifecycle rõ ràng. Cần nêu trade-off cụ thể hơn. Bước tiếp theo: luyện hai câu về state management." value={feedback} onChange={(event) => setFeedback(event.target.value)} readOnly={!isMentor && feedbackRes.includes('Đã lưu')} />

              <button className="primary-button" onClick={handleSubmitFeedback} disabled={!isMentor}><span>{isMentor ? 'Gửi phản hồi' : 'Chuyển sang Mentor để gửi'}</span><span className="button-icon"><ArrowIcon /></span></button>
              <Message>{feedbackRes}</Message>
            </div>
          </section>
        </div>
      )}

      <footer className="app-footer"><p>Interview Practice PoC</p><p>Question Bank · Booking · Feedback</p></footer>
    </main>
  )
}

export default App
