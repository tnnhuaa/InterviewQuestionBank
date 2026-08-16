export type Difficulty = 'easy' | 'medium' | 'hard'
export type PracticeStatus = 'not-started' | 'practicing' | 'confident'
export type BookingStatus = 'pending' | 'confirmed' | 'reschedule-proposed' | 'completed' | 'rejected' | 'cancelled'
export type QuestionStatus = 'draft' | 'in-review' | 'published' | 'archived'
export type MentorStatus = 'draft' | 'pending' | 'approved' | 'rejected'

export interface Question {
  id: string
  title: string
  titleVi: string
  tags: string[]
  difficulty: Difficulty
  status: PracticeStatus
  bookmarked: boolean
  source?: string
  interviewType: string
  position: string
  practiceCount: number
  guidancePoints: string[]
}

export interface Mentor {
  id: string
  name: string
  role: string
  company: string
  avatar: string
  verified: boolean
  verificationStatus: MentorStatus
  bio: string
  expertise: string[]
  interviewTypes: string[]
  languages: string[]
  rating: number
  reviewCount: number
  sessionCount: number
  nextAvailable: string
  timezone: string
  experience: string
  canHelp: string[]
}

export interface Booking {
  id: string
  mentorId: string
  studentName: string
  date: string
  time: string
  timezone: string
  duration: number
  topic: string
  interviewType: string
  goal: string
  status: BookingStatus
  timeline: TimelineEvent[]
}

export interface TimelineEvent {
  actor: string
  role: string
  timestamp: string
  description: string
  status?: BookingStatus
}

export interface Review {
  id: string
  bookingId: string
  studentName: string
  rating: number
  comment: string
  date: string
}

export interface FeedbackRubric {
  criterion: string
  score: number
  maxScore: number
  explanation: string
  evidence: string
}

export interface Feedback {
  id: string
  bookingId: string
  mentorName: string
  interviewType: string
  date: string
  overallMessage: string
  rubric: FeedbackRubric[]
  strengths: string[]
  improvements: string[]
  nextActions: { title: string; questionId?: string }[]
}

export const QUESTIONS: Question[] = [
  {
    id: 'js-event-loop',
    title: 'Giải thích Event Loop trong JavaScript và cách microtask khác macrotask.',
    titleVi: 'Giải thích Event Loop trong JavaScript và cách microtask khác macrotask.',
    tags: ['JavaScript', 'Frontend'],
    difficulty: 'medium',
    status: 'practicing',
    bookmarked: true,
    source: 'Google',
    interviewType: 'Technical',
    position: 'Frontend Intern',
    practiceCount: 312,
    guidancePoints: [
      'Giải thích call stack, task queue và microtask queue',
      'Phân biệt Promise callbacks (microtask) với setTimeout (macrotask)',
      'Mô tả thứ tự thực thi với ví dụ cụ thể',
      'Đề cập đến requestAnimationFrame nếu biết',
    ],
  },
  {
    id: 'react-reconciliation',
    title: 'React reconciliation hoạt động như thế nào? Virtual DOM là gì?',
    titleVi: 'React reconciliation hoạt động như thế nào? Virtual DOM là gì?',
    tags: ['React', 'Frontend'],
    difficulty: 'medium',
    status: 'confident',
    bookmarked: false,
    source: 'Shopee',
    interviewType: 'Technical',
    position: 'Frontend Intern',
    practiceCount: 245,
    guidancePoints: [
      'Giải thích Virtual DOM và tại sao nó tồn tại',
      'Mô tả thuật toán diffing của React',
      'Giải thích vai trò của key trong danh sách',
      'Đề cập đến React Fiber nếu phù hợp',
    ],
  },
  {
    id: 'css-specificity',
    title: 'CSS specificity hoạt động như thế nào? Giải thích với ví dụ.',
    titleVi: 'CSS specificity hoạt động như thế nào? Giải thích với ví dụ.',
    tags: ['CSS', 'Frontend'],
    difficulty: 'easy',
    status: 'confident',
    bookmarked: false,
    interviewType: 'Technical',
    position: 'Frontend Intern',
    practiceCount: 198,
    guidancePoints: [
      'Mô tả hệ thống điểm: inline styles > IDs > classes > elements',
      'Giải thích !important và khi nào nên tránh dùng',
      'Cho ví dụ thực tế về xung đột specificity',
    ],
  },
  {
    id: 'system-design-url-shortener',
    title: 'Thiết kế một hệ thống rút gọn URL (URL shortener) như bit.ly.',
    titleVi: 'Thiết kế một hệ thống rút gọn URL (URL shortener) như bit.ly.',
    tags: ['System Design'],
    difficulty: 'hard',
    status: 'not-started',
    bookmarked: false,
    source: 'Meta',
    interviewType: 'System Design',
    position: 'Frontend Engineer',
    practiceCount: 421,
    guidancePoints: [
      'Xác định requirements: bao nhiêu request mỗi giây?',
      'Thiết kế schema database cho URLs',
      'Giải thích cách tạo short code (hash, base62)',
      'Đề cập đến caching layer và CDN',
      'Thảo luận về scalability và availability',
    ],
  },
  {
    id: 'behavioral-conflict',
    title: 'Kể về một lần bạn xử lý xung đột với đồng nghiệp. Bạn đã làm gì?',
    titleVi: 'Kể về một lần bạn xử lý xung đột với đồng nghiệp. Bạn đã làm gì?',
    tags: ['Behavioral'],
    difficulty: 'medium',
    status: 'not-started',
    bookmarked: false,
    interviewType: 'Behavioral',
    position: 'Frontend Intern',
    practiceCount: 156,
    guidancePoints: [
      'Dùng cấu trúc STAR: Situation, Task, Action, Result',
      'Chọn ví dụ thực tế, không quá nghiêm trọng',
      'Tập trung vào hành động của bạn, không đổ lỗi',
      'Kết thúc với bài học rút ra',
    ],
  },
  {
    id: 'react-hooks-rules',
    title: 'Các quy tắc của React Hooks là gì và tại sao chúng tồn tại?',
    titleVi: 'Các quy tắc của React Hooks là gì và tại sao chúng tồn tại?',
    tags: ['React', 'Frontend'],
    difficulty: 'easy',
    status: 'practicing',
    bookmarked: true,
    source: 'VNG',
    interviewType: 'Technical',
    position: 'Frontend Intern',
    practiceCount: 289,
    guidancePoints: [
      'Giải thích 2 quy tắc chính: chỉ gọi ở top level, chỉ gọi trong React functions',
      'Giải thích lý do: thứ tự hooks phải nhất quán giữa các lần render',
      'Đề cập đến eslint-plugin-react-hooks',
    ],
  },
  {
    id: 'frontend-architecture',
    title: 'Bạn sẽ tổ chức code của một ứng dụng React lớn như thế nào?',
    titleVi: 'Bạn sẽ tổ chức code của một ứng dụng React lớn như thế nào?',
    tags: ['Frontend Architecture', 'React'],
    difficulty: 'hard',
    status: 'not-started',
    bookmarked: false,
    interviewType: 'Technical',
    position: 'Frontend Engineer',
    practiceCount: 134,
    guidancePoints: [
      'Thảo luận về folder structure: feature-based vs. layer-based',
      'Đề cập đến state management: Context, Zustand, Redux',
      'Giải thích code splitting và lazy loading',
      'Thảo luận về component design patterns',
    ],
  },
  {
    id: 'async-await-promise',
    title: 'Giải thích sự khác biệt giữa Promises và async/await trong JavaScript.',
    titleVi: 'Giải thích sự khác biệt giữa Promises và async/await trong JavaScript.',
    tags: ['JavaScript', 'Frontend'],
    difficulty: 'easy',
    status: 'confident',
    bookmarked: false,
    source: 'Tiki',
    interviewType: 'Technical',
    position: 'Frontend Intern',
    practiceCount: 376,
    guidancePoints: [
      'Giải thích Promise chain vs async/await syntax',
      'So sánh error handling: .catch() vs try/catch',
      'Đề cập đến Promise.all, Promise.race',
      'Giải thích async/await chỉ là syntactic sugar',
    ],
  },
]

export const MENTORS: Mentor[] = [
  {
    id: 'minh-nguyen',
    name: 'Nguyễn Minh Tuấn',
    role: 'Senior Frontend Engineer',
    company: 'Shopee',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format',
    verified: true,
    verificationStatus: 'approved',
    bio: 'Senior Frontend Engineer tại Shopee với 7 năm kinh nghiệm xây dựng ứng dụng web quy mô lớn. Tôi đã phỏng vấn hàng trăm ứng viên và hiểu rõ những gì các công ty tech hàng đầu tìm kiếm.',
    expertise: ['React', 'JavaScript', 'TypeScript', 'System Design'],
    interviewTypes: ['Technical', 'System Design', 'Behavioral'],
    languages: ['Tiếng Việt', 'English'],
    rating: 4.9,
    reviewCount: 47,
    sessionCount: 83,
    nextAvailable: 'Thứ Ba, 09:00 sáng',
    timezone: 'GMT+7 · Hồ Chí Minh',
    experience: '7 năm kinh nghiệm',
    canHelp: ['Frontend interviews', 'JavaScript deep dive', 'React interviews', 'Behavioral communication'],
  },
  {
    id: 'linh-pham',
    name: 'Phạm Thị Linh',
    role: 'Product Engineer',
    company: 'VNG',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b22c?w=200&h=200&fit=crop&auto=format',
    verified: true,
    verificationStatus: 'approved',
    bio: 'Product Engineer tại VNG, chuyên về React và Node.js. Tôi thích giúp junior developers chuẩn bị cho technical interviews với phương pháp thực tế và rõ ràng.',
    expertise: ['React', 'Node.js', 'CSS', 'Frontend Architecture'],
    interviewTypes: ['Technical', 'Behavioral'],
    languages: ['Tiếng Việt'],
    rating: 4.8,
    reviewCount: 31,
    sessionCount: 52,
    nextAvailable: 'Thứ Tư, 14:00',
    timezone: 'GMT+7 · Hồ Chí Minh',
    experience: '5 năm kinh nghiệm',
    canHelp: ['CSS & Frontend basics', 'React patterns', 'Behavioral STAR method'],
  },
  {
    id: 'duc-tran',
    name: 'Trần Đức Anh',
    role: 'Engineering Manager',
    company: 'Sea Group',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&auto=format',
    verified: true,
    verificationStatus: 'approved',
    bio: 'Engineering Manager tại Sea Group với kinh nghiệm tuyển dụng và phỏng vấn kỹ sư ở nhiều cấp độ. Tôi giúp bạn nhìn từ góc độ người phỏng vấn để chuẩn bị tốt hơn.',
    expertise: ['System Design', 'Leadership', 'Technical Strategy'],
    interviewTypes: ['System Design', 'Behavioral', 'Leadership'],
    languages: ['Tiếng Việt', 'English'],
    rating: 4.7,
    reviewCount: 28,
    sessionCount: 41,
    nextAvailable: 'Thứ Năm, 20:00',
    timezone: 'GMT+8 · Singapore',
    experience: '10 năm kinh nghiệm',
    canHelp: ['System design interviews', 'Engineering manager interviews', 'Career strategy'],
  },
]

export const BOOKINGS: Booking[] = [
  {
    id: 'BK-2024-001',
    mentorId: 'minh-nguyen',
    studentName: 'An',
    date: 'Thứ Ba, 18 tháng 3, 2025',
    time: '09:00 sáng',
    timezone: 'GMT+7 · Hồ Chí Minh',
    duration: 60,
    topic: 'JavaScript & React Technical Interview',
    interviewType: 'Technical',
    goal: 'Luyện tập trả lời câu hỏi về Event Loop và React hooks cho vị trí Frontend Intern tại Shopee.',
    status: 'confirmed',
    timeline: [
      { actor: 'An (Bạn)', role: 'student', timestamp: '14 tháng 3, 2025 · 10:23', description: 'Gửi yêu cầu đặt lịch cho buổi luyện tập JavaScript & React.' },
      { actor: 'Nguyễn Minh Tuấn', role: 'mentor', timestamp: '14 tháng 3, 2025 · 14:07', description: 'Mentor đã xem yêu cầu.' },
      { actor: 'Nguyễn Minh Tuấn', role: 'mentor', timestamp: '14 tháng 3, 2025 · 14:15', description: 'Xác nhận lịch hẹn. Buổi phỏng vấn sẽ diễn ra theo kế hoạch.', status: 'confirmed' },
    ],
  },
  {
    id: 'BK-2024-002',
    mentorId: 'linh-pham',
    studentName: 'Bảo',
    date: 'Thứ Sáu, 21 tháng 3, 2025',
    time: '14:00',
    timezone: 'GMT+7 · Hồ Chí Minh',
    duration: 45,
    topic: 'Behavioral Interview Preparation',
    interviewType: 'Behavioral',
    goal: 'Luyện câu hỏi behavioral cho vị trí intern tại VNG.',
    status: 'pending',
    timeline: [
      { actor: 'Bảo (Bạn)', role: 'student', timestamp: '15 tháng 3, 2025 · 09:00', description: 'Gửi yêu cầu đặt lịch cho buổi luyện tập Behavioral.' },
    ],
  },
]

export const FEEDBACK_DATA: Feedback = {
  id: 'FB-001',
  bookingId: 'BK-2024-001',
  mentorName: 'Nguyễn Minh Tuấn',
  interviewType: 'Technical Interview',
  date: '18 tháng 3, 2025',
  overallMessage: 'Bạn đang làm tốt phần kiến thức, nhưng cần cấu trúc câu trả lời rõ hơn trước khi đi vào chi tiết.',
  rubric: [
    { criterion: 'Kiến thức kỹ thuật', score: 4, maxScore: 5, explanation: 'Hiểu sâu về Event Loop và Promises. Có thể giải thích microtask vs macrotask một cách chính xác.', evidence: 'Trả lời đúng về thứ tự thực thi của Promise.then và setTimeout.' },
    { criterion: 'Cấu trúc câu trả lời', score: 3, maxScore: 5, explanation: 'Câu trả lời đôi khi bắt đầu quá chi tiết trước khi xác định context. Cần lập outline trước.', evidence: 'Câu hỏi về reconciliation: bắt đầu giải thích Fiber ngay mà chưa giới thiệu Virtual DOM.' },
    { criterion: 'Giao tiếp', score: 4, maxScore: 5, explanation: 'Giải thích rõ ràng, dùng ví dụ thực tế tốt. Cần chủ động check-in với người phỏng vấn.', evidence: 'Ví dụ closure với counter function rất trực quan.' },
    { criterion: 'Xử lý câu hỏi tiếp theo', score: 3, maxScore: 5, explanation: 'Khi không biết chắc câu trả lời, cần nói rõ ra thay vì đoán. Thinking out loud tốt hơn.', evidence: 'Câu hỏi về React Server Components: im lặng 30 giây rồi mới trả lời.' },
  ],
  strengths: [
    'Giải thích closure bằng ví dụ thực tế rõ ràng và dễ hiểu.',
    'Kiến thức về JavaScript async programming rất vững.',
    'Thái độ học hỏi tốt, sẵn sàng nhận feedback.',
  ],
  improvements: [
    'Cần xác định assumption và scope câu trả lời trước khi đi vào chi tiết.',
    'Luyện tập thinking out loud — nói ra quá trình suy nghĩ.',
    'Chủ động hỏi người phỏng vấn để clarify câu hỏi.',
  ],
  nextActions: [
    { title: 'Luyện thêm về Event Loop và async patterns', questionId: 'js-event-loop' },
    { title: 'Luyện React reconciliation và Fiber', questionId: 'react-reconciliation' },
    { title: 'Luyện 1 câu behavioral bằng cấu trúc STAR', questionId: 'behavioral-conflict' },
  ],
}

export const REVIEWS: Review[] = [
  { id: 'RV-001', bookingId: 'BK-2024-001', studentName: 'An N.', rating: 5, comment: 'Mentor giải thích rất rõ ràng và kiên nhẫn. Feedback cụ thể và actionable. Tôi hiểu rõ hơn về những điểm cần cải thiện sau buổi này.', date: '19 tháng 3, 2025' },
  { id: 'RV-002', bookingId: 'BK-2024-003', studentName: 'Hải T.', rating: 5, comment: 'Buổi mock interview rất thực tế. Mentor hỏi đúng những câu mà Shopee hay hỏi. Rất có ích!', date: '10 tháng 3, 2025' },
  { id: 'RV-003', bookingId: 'BK-2024-004', studentName: 'Mai P.', rating: 4, comment: 'Feedback chuyên sâu về kỹ thuật. Tôi học được nhiều từ cách mentor tiếp cận system design.', date: '2 tháng 3, 2025' },
]

export const ADMIN_QUEUE = [
  { id: 'Q-001', type: 'Mentor Review', case: 'Trần Văn Hùng — Hồ sơ mentor mới', priority: 'high', created: '2 giờ trước', status: 'pending', owner: null },
  { id: 'Q-002', type: 'Report', case: 'BK-2024-089 — Báo cáo no-show', priority: 'high', created: '3 giờ trước', status: 'open', owner: 'Admin A' },
  { id: 'Q-003', type: 'Question Review', case: '"Giải thích WebSocket vs HTTP polling" — Đang chờ review', priority: 'medium', created: '1 ngày trước', status: 'in-review', owner: 'Admin B' },
  { id: 'Q-004', type: 'Booking Exception', case: 'BK-2024-076 — Yêu cầu hoàn tiền', priority: 'medium', created: '1 ngày trước', status: 'open', owner: null },
  { id: 'Q-005', type: 'Mentor Review', case: 'Ngô Thị Hương — Hồ sơ mentor mới', priority: 'low', created: '2 ngày trước', status: 'pending', owner: null },
  { id: 'Q-006', type: 'Question Review', case: '"React Server Components là gì?" — Draft', priority: 'low', created: '3 ngày trước', status: 'draft', owner: 'Admin A' },
]

export const ADMIN_QUESTIONS = [
  { id: 'Q-JS-001', title: 'Giải thích Event Loop trong JavaScript', position: 'Frontend Intern', topics: ['JavaScript'], source: 'Community', version: '2', status: 'published' as QuestionStatus, updated: '10 tháng 3', owner: 'Admin A' },
  { id: 'Q-React-001', title: 'React reconciliation hoạt động như thế nào?', position: 'Frontend Intern', topics: ['React'], source: 'Community', version: '1', status: 'published' as QuestionStatus, updated: '8 tháng 3', owner: 'Admin B' },
  { id: 'Q-WS-001', title: 'Giải thích WebSocket vs HTTP polling', position: 'Frontend Engineer', topics: ['Networking'], source: 'Submission', version: '1', status: 'in-review' as QuestionStatus, updated: '14 tháng 3', owner: 'Admin B' },
  { id: 'Q-RSC-001', title: 'React Server Components là gì?', position: 'Frontend Engineer', topics: ['React'], source: 'Community', version: '1', status: 'draft' as QuestionStatus, updated: '12 tháng 3', owner: 'Admin A' },
  { id: 'Q-CSS-001', title: 'CSS specificity hoạt động như thế nào?', position: 'Frontend Intern', topics: ['CSS'], source: 'Community', version: '3', status: 'published' as QuestionStatus, updated: '1 tháng 3', owner: 'Admin A' },
  { id: 'Q-SD-001', title: 'Thiết kế hệ thống rút gọn URL', position: 'Frontend Engineer', topics: ['System Design'], source: 'Community', version: '1', status: 'archived' as QuestionStatus, updated: '20 tháng 2', owner: 'Admin B' },
]
