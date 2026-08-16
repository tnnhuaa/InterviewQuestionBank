import { useEffect, useRef, useState } from 'react'
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
  4: { name: 'Phạm Hoàng', role: 'Mentor', initials: 'PH' },
  5: { name: 'Đỗ Văn Cường', role: 'Student', initials: 'DC' },
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
  
  // Discover Data
  const [mentors, setMentors] = useState([])
  const [selectedMentor, setSelectedMentor] = useState(null)
  const [slots, setSlots] = useState([])
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [bookingRes, setBookingRes] = useState('')

  // Booking Data
  const [bookings, setBookings] = useState([])
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [actionRes, setActionRes] = useState('')
  const [meetingLink, setMeetingLink] = useState('')

  // Feedback Data
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

  const fetchBookings = async () => {
    const { status, data } = await fetchAPI('/bookings')
    if (status === 200) {
      setBookings(data);
    }
  }

  useEffect(() => {
    if (activeView === 'discover') {
      fetchAPI('/mentors').then(({ status, data }) => {
        if (status === 200) {
          setMentors(data)
          if (data.length > 0 && !selectedMentor) setSelectedMentor(data[0])
        }
      })
    }
    if (activeView === 'booking' || activeView === 'feedback') {
      fetchBookings();
      setSelectedBooking(null);
      setActionRes('');
      setMeetingLink('');
      setFeedbackRes('');
      setFeedback('');
    }
  }, [activeView, currentUser])

  useEffect(() => {
      if (selectedMentor) {
          fetchAPI(`/mentors/${selectedMentor.id}/slots`).then(({ status, data }) => {
              if (status === 200) {
                setSlots(data)
                setSelectedSlot(null)
              }
          })
      }
  }, [selectedMentor])

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
    if (!selectedSlot) return setBookingRes('Vui lòng chọn thời gian')
    setBookingRes('Đang xử lý yêu cầu đặt lịch...')
    const { status, data } = await fetchAPI('/bookings', {
      method: 'POST',
      body: JSON.stringify({ slot_id: selectedSlot.id }),
    })

    if (status === 201) {
      const id = String(data.booking_id)
      setBookingRes(`Đã gửi yêu cầu đặt lịch thành công (Mã BK-${id.padStart(4, '0')}).`)
      // Refresh slots
      fetchAPI(`/mentors/${selectedMentor.id}/slots`).then((res) => {
          if (res.status === 200) setSlots(res.data)
      })
      setSelectedSlot(null)
    } else {
      setBookingRes(`Lỗi: ${data.message || data.error}`)
    }
  }

  const handleMentorAction = async (action) => {
    if (!selectedBooking) return setActionRes('Vui lòng chọn yêu cầu')
    setActionRes('Đang xử lý...')
    const { status, data } = await fetchAPI(`/bookings/${selectedBooking.id}/${action}`, { method: 'POST' })

    if (status === 200) {
      setActionRes(data.message || `Thao tác thành công.`)
      fetchBookings() // Refresh danh sách
      setSelectedBooking({...selectedBooking, status: action === 'accept' ? 'Confirmed' : 'Completed'})
    } else {
      setActionRes(`Lỗi: ${data.message || data.error}`)
    }
  }

  const handleViewLink = async () => {
    if (!selectedBooking) return setActionRes('Vui lòng chọn lịch để xem')
    setActionRes('Đang xử lý quyền truy cập...')
    const { status, data } = await fetchAPI(`/bookings/${selectedBooking.id}/meeting-link`)

    if (status === 200) {
      setMeetingLink(data.meeting_link)
      setActionRes('Đã lấy meeting link thành công.')
    } else {
      setMeetingLink('')
      setActionRes(`Lỗi: ${data.message || data.error}`)
    }
  }

  const handleSubmitFeedback = async () => {
    if (!selectedBooking || !feedback.trim()) return setFeedbackRes('Vui lòng chọn lịch và nhập phản hồi')
    setFeedbackRes('Đang xử lý phản hồi...')
    const { status, data } = await fetchAPI(`/bookings/${selectedBooking.id}/feedback`, {
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

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
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
            {Object.entries(people).map(([id, p]) => (
                <option key={id} value={id}>{p.role} · {p.name}</option>
            ))}
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
                  <p className="context-line">Danh sách Mentor</p>
                  <h2>Chọn một mentor</h2>
                </div>
              </div>
              
              <div className="mentor-list" style={{display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px'}}>
                {mentors.map(m => (
                    <button 
                        key={m.id} 
                        className={`secondary-button ${selectedMentor?.id === m.id ? 'is-selected' : ''}`}
                        onClick={() => setSelectedMentor(m)}
                        style={selectedMentor?.id === m.id ? {background: 'var(--forest)', color: 'white'} : {}}
                    >
                        {m.name}
                    </button>
                ))}
              </div>

              {selectedMentor && (
                  <div className="mentor-summary">
                    <div className="mentor-avatar">{people[selectedMentor.id]?.initials || 'M'}</div>
                    <div>
                      <p className="mentor-role">Chuyên gia / Mentor</p>
                      <p>{selectedMentor.name}</p>
                    </div>
                  </div>
              )}

              <p className="mentor-bio">Tập trung vào phỏng vấn, cách trình bày quyết định kỹ thuật và phản hồi có dẫn chứng.</p>

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
                  <p className="context-line">Lịch gần nhất của {selectedMentor?.name || 'Mentor'}</p>
                  <h2>Chọn thời gian luyện</h2>
                </div>
                <span className="availability">Còn chỗ</span>
              </div>

              <div className="slot-picker" role="radiogroup" aria-label="Chọn thời gian">
                {slots.length === 0 && <p className="empty-copy">Mentor này chưa có lịch trống.</p>}
                {slots.map(slot => (
                    <button 
                        key={slot.id}
                        className={`slot ${selectedSlot?.id === slot.id ? 'is-selected' : ''}`} 
                        role="radio" 
                        aria-checked={selectedSlot?.id === slot.id}
                        onClick={() => setSelectedSlot(slot)}
                    >
                        <strong>{formatDate(slot.start_time)}</strong>
                        <span>GMT+7</span>
                    </button>
                ))}
              </div>

              <label className="field-label" htmlFor="practice-goal">Mục tiêu buổi luyện</label>
              <textarea id="practice-goal" rows="4" defaultValue="Luyện cách trình bày kiến thức và xử lý câu hỏi tiếp nối." />

              <button className="primary-button" onClick={handleBookSlot} disabled={isMentor || !selectedSlot}>
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
            <div className="booking-main" style={{flex: 2}}>
                <h2>Danh sách các buổi phỏng vấn</h2>
                <div className="question-results" style={{marginTop: '1rem'}}>
                    {bookings.length === 0 && <p className="empty-copy">Bạn chưa có lịch hẹn nào.</p>}
                    {bookings.map(b => (
                        <div 
                            key={b.id} 
                            className={`question-row ${selectedBooking?.id === b.id ? 'is-selected' : ''}`}
                            style={{cursor: 'pointer', border: selectedBooking?.id === b.id ? '1px solid var(--forest)' : '1px solid transparent', background: selectedBooking?.id === b.id ? 'var(--mint)' : '', padding: '10px', borderRadius: '10px'}}
                            onClick={() => { setSelectedBooking(b); setActionRes(''); setMeetingLink(''); }}
                        >
                            <span>BK-{String(b.id).padStart(4, '0')}</span>
                            <div style={{flex: 1}}>
                                <p><strong>{formatDate(b.start_time)}</strong> - Trạng thái: <span style={{color: b.status === 'Completed' ? 'green' : b.status === 'Confirmed' ? 'var(--forest)' : 'orange'}}>{b.status}</span></p>
                                <p style={{fontSize: '0.85rem', color: 'var(--gray-500)'}}>{isMentor ? `Sinh viên: ${b.student_name}` : `Mentor: ${b.mentor_name}`}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <aside className="action-panel" style={{flex: 1}}>
              <div>
                <p className="context-line">Thao tác theo vai trò</p>
                <h2>{isMentor ? 'Xử lý yêu cầu' : 'Truy cập buổi luyện'}</h2>
                <p className="support-copy">Bạn đang xem với quyền {isMentor ? 'Mentor' : 'Student'}.</p>
              </div>

              {!selectedBooking && (
                  <div className="empty-copy">Vui lòng chọn một lịch hẹn từ danh sách bên trái.</div>
              )}

              {selectedBooking && isMentor && (
                <div className="action-stack">
                  <div className="booking-details" style={{marginBottom: '1rem'}}>
                    <div><span>Booking ID</span><strong>BK-{String(selectedBooking.id).padStart(4, '0')}</strong></div>
                    <div><span>Trạng thái</span><strong>{selectedBooking.status}</strong></div>
                  </div>
                  {selectedBooking.status === 'Pending' && (
                    <button className="primary-button" onClick={() => handleMentorAction('accept')}><span>Xác nhận lịch</span><span className="button-icon"><ArrowIcon /></span></button>
                  )}
                  {selectedBooking.status === 'Confirmed' && (
                    <button className="secondary-button" onClick={() => handleMentorAction('complete')}>Đánh dấu hoàn thành</button>
                  )}
                  {selectedBooking.status === 'Completed' && (
                      <p className="empty-copy">Buổi phỏng vấn này đã hoàn thành.</p>
                  )}
                  <Message compact>{actionRes}</Message>
                </div>
              )}

              {selectedBooking && !isMentor && (
                <div className="action-stack">
                  <div className="booking-details" style={{marginBottom: '1rem'}}>
                    <div><span>Booking ID</span><strong>BK-{String(selectedBooking.id).padStart(4, '0')}</strong></div>
                    <div><span>Trạng thái</span><strong>{selectedBooking.status}</strong></div>
                  </div>
                  {(selectedBooking.status === 'Confirmed' || selectedBooking.status === 'Completed') && (
                    <>
                        <button className="primary-button" onClick={handleViewLink}><span>Lấy meeting link</span><span className="button-icon"><ArrowIcon /></span></button>
                        {meetingLink && <a className="meeting-link" href={meetingLink} target="_blank" rel="noreferrer">Tham gia qua Google Meet <ArrowIcon /></a>}
                    </>
                  )}
                  {selectedBooking.status === 'Pending' && (
                      <p className="empty-copy">Đang chờ mentor xác nhận. Chưa có link tham gia.</p>
                  )}
                  <Message compact>{actionRes}</Message>
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
              <div className="section-heading">
                  <div><p className="context-line">Các cuộc phỏng vấn (Đã xác nhận / Hoàn thành)</p><h2>Chọn cuộc phỏng vấn</h2></div>
              </div>
              <div className="question-results" style={{marginTop: '1rem'}}>
                  {bookings.filter(b => ['Confirmed', 'Completed'].includes(b.status)).length === 0 && <p className="empty-copy">Không có cuộc phỏng vấn nào khả dụng.</p>}
                  {bookings.filter(b => ['Confirmed', 'Completed'].includes(b.status)).map(b => (
                      <div 
                          key={b.id} 
                          className={`question-row ${selectedBooking?.id === b.id ? 'is-selected' : ''}`}
                          style={{cursor: 'pointer', border: selectedBooking?.id === b.id ? '1px solid var(--forest)' : '1px solid transparent', background: selectedBooking?.id === b.id ? 'var(--mint)' : '', padding: '10px', borderRadius: '10px'}}
                          onClick={() => { setSelectedBooking(b); setFeedback(''); setFeedbackRes(''); }}
                      >
                          <span>BK-{String(b.id).padStart(4, '0')}</span>
                          <div style={{flex: 1}}>
                              <p><strong>{formatDate(b.start_time)}</strong></p>
                              <p style={{fontSize: '0.85rem', color: 'var(--gray-500)'}}>{isMentor ? `Sinh viên: ${b.student_name}` : `Mentor: ${b.mentor_name}`}</p>
                          </div>
                      </div>
                  ))}
              </div>
            </div>

            <div className="feedback-form">
              <div className="section-heading"><div><p className="context-line">{isMentor ? 'Góc nhìn của mentor' : 'Phản hồi dành cho bạn'}</p><h2>{isMentor ? 'Viết phản hồi' : 'Nội dung phản hồi'}</h2></div></div>

              {!selectedBooking && <div className="empty-copy">Vui lòng chọn một lịch phỏng vấn để tiếp tục.</div>}

              {selectedBooking && (
                  <>
                    <label className="field-label" htmlFor="feedback-content">Điểm mạnh, điểm cần cải thiện và hành động tiếp theo</label>
                    <textarea id="feedback-content" rows="8" placeholder="Ví dụ: Bạn giải thích component lifecycle rõ ràng. Cần nêu trade-off cụ thể hơn. Bước tiếp theo: luyện hai câu về state management." value={feedback} onChange={(event) => setFeedback(event.target.value)} readOnly={!isMentor && feedbackRes.includes('Đã lưu')} />

                    <button className="primary-button" onClick={handleSubmitFeedback} disabled={!isMentor}><span>{isMentor ? 'Gửi phản hồi' : 'Chuyển sang Mentor để gửi'}</span><span className="button-icon"><ArrowIcon /></span></button>
                    <Message>{feedbackRes}</Message>
                  </>
              )}
            </div>
          </section>
        </div>
      )}

      <footer className="app-footer"><p>Interview Practice PoC</p><p>Question Bank · Booking · Feedback</p></footer>
    </main>
  )
}

export default App
