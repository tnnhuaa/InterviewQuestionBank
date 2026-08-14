import { useState } from 'react'

function App() {
  const [currentUser, setCurrentUser] = useState('2')
  
  // States for Question Filtering
  const [tags, setTags] = useState([])
  const [questions, setQuestions] = useState(null)
  
  // States for Booking
  const [bookingRes, setBookingRes] = useState('')
  const [bookingId, setBookingId] = useState('') // Just for reference
  
  // States for Mentor
  const [mentorInputId, setMentorInputId] = useState('')
  const [mentorRes, setMentorRes] = useState('')
  
  // States for Link & Feedback
  const [authInputId, setAuthInputId] = useState('')
  const [linkRes, setLinkRes] = useState('')
  const [feedback, setFeedback] = useState('')
  const [feedbackRes, setFeedbackRes] = useState('')

  const fetchAPI = async (endpoint, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      'X-User-Id': currentUser,
      ...options.headers
    }
    try {
      const response = await fetch(`/api${endpoint}`, { ...options, headers })
      const data = await response.json()
      return { status: response.status, data }
    } catch (error) {
      return { status: 500, data: { message: error.message } }
    }
  }

  const handleSearchQuestions = async () => {
    const tagQuery = tags.length > 0 ? `?tags=${tags.join(',')}` : ''
    const { status, data } = await fetchAPI(`/questions${tagQuery}`)
    if (status === 200) setQuestions(data)
    else setQuestions([{ error: true, message: data.message || data.error }])
  }

  const handleBookSlot = async () => {
    setBookingRes('Đang xử lý...')
    const { status, data } = await fetchAPI('/bookings', {
      method: 'POST',
      body: JSON.stringify({ slot_id: 1 })
    })
    if (status === 201) {
      setBookingRes(`Thành công! Booking ID: ${data.booking_id} (Pending)`)
      setBookingId(data.booking_id)
    } else {
      setBookingRes(`Lỗi: ${data.message || data.error}`)
    }
  }

  const handleMentorAction = async (action) => {
    if (!mentorInputId) return setMentorRes('Vui lòng nhập ID')
    setMentorRes('Đang xử lý...')
    const { status, data } = await fetchAPI(`/bookings/${mentorInputId}/${action}`, { method: 'POST' })
    if (status === 200) setMentorRes(`Thành công: ${data.message}`)
    else setMentorRes(`Lỗi: ${data.message || data.error}`)
  }

  const handleViewLink = async () => {
    if (!authInputId) return setLinkRes('Vui lòng nhập ID')
    setLinkRes('Đang xử lý...')
    const { status, data } = await fetchAPI(`/bookings/${authInputId}/meeting-link`)
    if (status === 200) setLinkRes(`Link: ${data.meeting_link}`)
    else setLinkRes(`Lỗi: ${data.message || data.error}`)
  }

  const handleSubmitFeedback = async () => {
    if (!authInputId || !feedback) return setFeedbackRes('Vui lòng nhập đủ thông tin')
    setFeedbackRes('Đang xử lý...')
    const { status, data } = await fetchAPI(`/bookings/${authInputId}/feedback`, {
      method: 'POST',
      body: JSON.stringify({ content: feedback })
    })
    if (status === 200) setFeedbackRes('Gửi feedback thành công!')
    else setFeedbackRes(`Lỗi: ${data.message || data.error}`)
  }

  return (
    <>
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>

      <div className="flex flex-col items-center min-h-screen pb-12">
        <header className="glass-panel w-[90%] max-w-5xl mt-8 p-6 flex flex-wrap justify-between items-center gap-4">
          <h1 className="text-2xl font-bold">Interview Practice (React + Tailwind)</h1>
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium">Đăng nhập (Giả lập):</label>
            <select 
              className="bg-slate-900/60 border border-white/20 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
              value={currentUser} 
              onChange={e => setCurrentUser(e.target.value)}
            >
              <option value="2">Student B (ID: 2)</option>
              <option value="3">Student C (ID: 3)</option>
              <option value="1">Mentor A (ID: 1)</option>
            </select>
          </div>
        </header>

        <main className="w-[90%] max-w-5xl mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Section 1: Questions */}
          <section className="glass-panel p-6 flex flex-col">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-white/10">📚 Ngân hàng câu hỏi</h2>
            <div className="flex items-center gap-4 mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" value="1" onChange={(e) => {
                  const val = e.target.value;
                  setTags(prev => e.target.checked ? [...prev, val] : prev.filter(t => t !== val))
                }} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                React
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" value="2" onChange={(e) => {
                  const val = e.target.value;
                  setTags(prev => e.target.checked ? [...prev, val] : prev.filter(t => t !== val))
                }} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                Node.js
              </label>
              <button onClick={handleSearchQuestions} className="ml-auto bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-all active:scale-95">Tìm kiếm</button>
            </div>
            
            <ul className="flex flex-col gap-2 mt-2">
              {questions?.length === 0 && <li className="bg-black/20 p-3 rounded-lg text-sm">Không tìm thấy câu hỏi phù hợp.</li>}
              {questions?.map((q, i) => (
                <li key={i} className={`bg-black/20 p-3 rounded-lg text-sm ${q.error ? 'text-red-400' : ''}`}>
                  {q.error ? q.message : `[ID: ${q.id}] ${q.content}`}
                </li>
              ))}
            </ul>
          </section>

          {/* Section 2: Student Book */}
          <section className="glass-panel p-6 flex flex-col">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-white/10">🎓 Dành cho Sinh Viên</h2>
            <p className="mb-4 text-slate-300">Slot 1 (2026-09-01) của Mentor A</p>
            <button onClick={handleBookSlot} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-all active:scale-95 w-fit">Đặt lịch (Book Slot)</button>
            <p className={`mt-4 p-3 rounded-lg text-sm min-h-[44px] ${bookingRes.includes('Lỗi') ? 'bg-red-500/20 text-red-200' : 'bg-green-500/20 text-green-200'}`}>
              {bookingRes}
            </p>
          </section>

          {/* Section 3: Mentor Action */}
          <section className="glass-panel p-6 flex flex-col">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-white/10">👨‍🏫 Dành cho Mentor</h2>
            <p className="mb-3 text-sm text-slate-300">Nhập Booking ID để xử lý:</p>
            <div className="flex flex-wrap gap-3 mb-4">
              <input 
                type="number" 
                placeholder="Booking ID..." 
                value={mentorInputId}
                onChange={e => setMentorInputId(e.target.value)}
                className="bg-slate-900/60 border border-white/20 rounded-lg px-3 py-2 flex-1 min-w-[120px] outline-none focus:border-blue-500"
              />
              <button onClick={() => handleMentorAction('accept')} className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium transition-all active:scale-95">Accept</button>
              <button onClick={() => handleMentorAction('complete')} className="bg-amber-500 hover:bg-amber-400 text-white px-4 py-2 rounded-lg font-medium transition-all active:scale-95">Complete</button>
            </div>
            <p className={`mt-auto p-3 rounded-lg text-sm min-h-[44px] ${mentorRes.includes('Lỗi') ? 'bg-red-500/20 text-red-200' : 'bg-green-500/20 text-green-200'}`}>
              {mentorRes}
            </p>
          </section>

          {/* Section 4: Auth & Feedback */}
          <section className="glass-panel p-6 flex flex-col">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-white/10">🔒 Link Meeting & Feedback</h2>
            
            <div className="flex gap-3 mb-3">
              <input 
                type="number" 
                placeholder="Booking ID..." 
                value={authInputId}
                onChange={e => setAuthInputId(e.target.value)}
                className="bg-slate-900/60 border border-white/20 rounded-lg px-3 py-2 w-32 outline-none focus:border-blue-500"
              />
              <button onClick={handleViewLink} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-all active:scale-95 flex-1">Xem Link Meeting</button>
            </div>
            <div className="p-3 bg-black/20 rounded-lg text-sm mb-4 min-h-[44px] text-blue-300 break-all">{linkRes}</div>

            <div className="flex gap-3 mb-3">
              <input 
                type="text" 
                placeholder="Nhập feedback..." 
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
                className="bg-slate-900/60 border border-white/20 rounded-lg px-3 py-2 flex-1 outline-none focus:border-blue-500"
              />
              <button onClick={handleSubmitFeedback} className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-all active:scale-95">Gửi</button>
            </div>
            <p className={`mt-auto p-3 rounded-lg text-sm min-h-[44px] ${feedbackRes.includes('Lỗi') ? 'bg-red-500/20 text-red-200' : 'bg-green-500/20 text-green-200'}`}>
              {feedbackRes}
            </p>
          </section>

        </main>
      </div>
    </>
  )
}

export default App
