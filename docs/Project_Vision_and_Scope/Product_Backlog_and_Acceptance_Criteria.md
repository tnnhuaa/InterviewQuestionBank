# Interview Practice Platform — Product Backlog and Acceptance Criteria

## 1. Mục đích

Tài liệu chuyển vision và business rules thành backlog có thể phát triển, kiểm thử và nghiệm thu. Product Owner sắp xếp lại ưu tiên sau discovery; ID và acceptance criteria phải được giữ ổn định để trace sang test case.

### 1.1 Release boundary

MVP gồm authentication/RBAC, Question Bank, mentor profile/verification/availability, booking, meeting-link handoff, feedback/review, admin moderation và notification. AI interviewer, built-in video và payment automation nằm ngoài release.

### 1.2 Business rules dùng chung

- BR-01: chỉ mentor Approved được công khai và nhận booking.
- BR-02: một slot có tối đa một booking Confirmed.
- BR-03: booking cần goal, interview type/position và slot hợp lệ.
- BR-04: dữ liệu booking/feedback chỉ đúng hai bên và Admin có quyền được xem.
- BR-05: feedback yêu cầu booking Completed.
- BR-06: review yêu cầu booking hợp lệ và chỉ tạo một lần.
- BR-07: question Published phải có taxonomy hợp lệ.
- BR-08: transition booking phải tuân state machine và có audit.

## 2. Product backlog

| ID | Epic | User story | Pri. | Estimate | Dependency |
|---|---|---|---|---:|---|
| US-01 | Identity | Là người dùng, tôi muốn đăng ký/đăng nhập để dùng dữ liệu cá nhân an toàn | Must | TBD | — |
| US-02 | Identity | Là Admin, tôi muốn phân quyền Student/Mentor/Admin để giới hạn chức năng | Must | TBD | US-01 |
| US-03 | Student | Là Student, tôi muốn lưu vị trí và mục tiêu phỏng vấn | Must | TBD | US-01 |
| US-04 | Questions | Là Student, tôi muốn duyệt/tìm/lọc câu hỏi theo taxonomy | Must | TBD | US-02 |
| US-05 | Questions | Là Student, tôi muốn xem detail và tiêu chí trả lời | Must | TBD | US-04 |
| US-06 | Questions | Là Student, tôi muốn bookmark/đánh dấu trạng thái luyện | Must | TBD | US-04 |
| US-07 | Mentor | Là Mentor, tôi muốn tạo hồ sơ và nộp xác minh | Must | TBD | US-01 |
| US-08 | Admin | Là Admin, tôi muốn duyệt/reject mentor có lý do | Must | TBD | US-07 |
| US-09 | Mentor | Là Mentor đã duyệt, tôi muốn quản lý slot rảnh | Must | TBD | US-08 |
| US-10 | Marketplace | Là Student, tôi muốn tìm mentor theo chuyên môn/lịch | Must | TBD | US-08,09 |
| US-11 | Booking | Là Student, tôi muốn gửi booking kèm mục tiêu | Must | TBD | US-03,10 |
| US-12 | Booking | Là Mentor, tôi muốn accept/reject/propose reschedule | Must | TBD | US-11 |
| US-13 | Booking | Là hai bên, tôi muốn hủy/đổi lịch theo policy | Must | TBD | US-12 |
| US-14 | Session | Là hai bên, tôi muốn xem link họp khi booking confirmed | Must | TBD | US-12 |
| US-15 | Feedback | Là Mentor, tôi muốn gửi feedback rubric sau buổi | Must | TBD | US-14 |
| US-16 | Feedback | Là Student, tôi muốn xem feedback và next action | Must | TBD | US-15 |
| US-17 | Review | Là Student, tôi muốn review mentor sau booking hợp lệ | Must | TBD | US-15 |
| US-18 | Admin | Là Admin, tôi muốn CRUD/moderate question và taxonomy | Must | TBD | US-02 |
| US-19 | Notification | Là người dùng, tôi muốn nhận thông báo sự kiện booking | Must | TBD | US-11–15 |
| US-20 | Admin | Là Admin, tôi muốn xử lý report/booking exception | Must | TBD | US-12,17 |
| US-21 | Progress | Là Student, tôi muốn dashboard tiến độ cơ bản | Should | TBD | US-06 |
| US-22 | Reminder | Là người dùng, tôi muốn được nhắc lịch tự động | Should | TBD | US-19 |
| US-23 | Import | Là Admin, tôi muốn import question có kiểm duyệt | Could | TBD | US-18 |

## 3. Acceptance criteria

| Story | Acceptance criteria dạng Given/When/Then |
|---|---|
| US-01 | Given email hợp lệ chưa tồn tại, when đăng ký và xác minh thành công, then tài khoản được tạo; credential không được lưu dạng plaintext. |
| US-02 | Given actor không có role phù hợp, when gọi route bị giới hạn, then hệ thống trả 403 và không lộ dữ liệu. |
| US-04 | Given question thuộc nhiều tag, when áp dụng filter kết hợp, then kết quả đúng, không trùng và giữ phân trang ổn định. |
| US-05 | Given question Published, when Student mở detail, then thấy nội dung, taxonomy và answer criteria; draft không công khai. |
| US-06 | Given Student đăng nhập, when bookmark/đổi trạng thái, then trạng thái được lưu riêng và khôi phục sau đăng nhập lại. |
| US-07 | Given Mentor nhập đủ trường bắt buộc, when submit verification, then hồ sơ chuyển Pending và không công khai. |
| US-08 | Given verification Pending, when Admin approve/reject, then quyết định, lý do, actor và timestamp được audit. |
| US-09 | Given Mentor Approved, when tạo slot không chồng slot của chính mình, then slot được lưu với timezone rõ; mentor chưa duyệt bị chặn. |
| US-10 | Given mentor/slot công khai, when Student lọc, then chỉ mentor Approved và slot khả dụng xuất hiện. |
| US-11 | Given slot khả dụng, when Student gửi đủ goal/type/position, then booking Pending được tạo; dữ liệu thiếu bị báo lỗi cụ thể. |
| US-12 | Given booking Pending và đúng Mentor, when accept, then booking Confirmed và slot bị khóa atomically; accept đồng thời thứ hai thất bại an toàn. |
| US-13 | Given booking hợp lệ, when actor hủy/đề xuất đổi lịch, then transition theo policy, lý do và timestamp được lưu. |
| US-14 | Given booking Confirmed, when đúng Student/Mentor mở detail, then thấy meeting link; người khác nhận 403/404 an toàn. |
| US-15 | Given booking Completed, when Mentor gửi đủ rubric, then feedback được lưu; mọi trạng thái khác bị chặn. |
| US-16 | Given feedback tồn tại, when Student của booking mở, then thấy score/comment/next action; user khác bị chặn. |
| US-17 | Given booking Completed và chưa review, when Student submit rating hợp lệ, then review được tạo một lần và gắn booking. |
| US-18 | Given Admin, when publish question có taxonomy/provenance hợp lệ, then question công khai; dữ liệu thiếu bị từ chối. |
| US-19 | Given event booking đã commit, when gửi notification lỗi, then booking giữ nguyên và notification được retry/đánh dấu xử lý. |
| US-20 | Given report mở, when Admin resolve, then quyết định, lý do và audit trail được lưu. |

## 4. KPI plan

| KPI | Event/source | Công thức | Target |
|---|---|---|---:|
| Question task completion | Usability session | completed / attempted | ≥ 80% |
| Search time | Usability session | median task duration | ≤ 2 phút |
| Booking task completion | Usability session | valid requests / attempts | ≥ 80% |
| Booking reliability | Booking events | completed / confirmed | ≥ 80% |
| Feedback completeness | Feedback records | complete rubric / completed bookings | ≥ 90% |
| Perceived value | Post-session survey | average score | ≥ 4/5 |
| Confidence lift | Pre/post survey | average post − pre | ≥ 1/5 |

## 5. Definition of Done

- Acceptance criteria pass và PO chấp nhận.
- Code được review; unit/integration/E2E test phù hợp đều pass.
- Authorization, validation và negative paths được test.
- Không còn defect Critical/High liên quan story.
- Telemetry/audit cần thiết hoạt động và không log secret/PII không cần thiết.
- Tài liệu, migration, API contract và release note được cập nhật.
- Tính năng chạy trên môi trường deployment mục tiêu.

## 6. Requirement Traceability Matrix

| Requirement | Stories | Business rules | Test IDs | KPI |
|---|---|---|---|---|
| RQ-01 Identity/RBAC | US-01,02 | BR-04 | TC-AUTH-01..06 | Access-control pass |
| RQ-02 Question Bank | US-04,05,06,18 | BR-07 | TC-Q-01..10 | Search completion/time |
| RQ-03 Mentor onboarding | US-07,08 | BR-01 | TC-M-01..08 | Approved mentor count |
| RQ-04 Availability | US-09,10 | BR-01,02 | TC-SLOT-01..08 | Search success |
| RQ-05 Booking | US-11,12,13 | BR-02,03,08 | TC-B-01..16 | Completion/reliability |
| RQ-06 Session access | US-14 | BR-04 | TC-SESSION-01..05 | Access-control pass |
| RQ-07 Feedback/review | US-15,16,17 | BR-04,05,06 | TC-F-01..12 | Feedback completeness/value |
| RQ-08 Notification | US-19 | BR-09 | TC-N-01..06 | Delivery/retry rate |
| RQ-09 Moderation | US-18,20 | BR-01,07,08 | TC-ADM-01..10 | Resolution time |

## 7. Test-case index

| Suite | Trọng tâm |
|---|---|
| TC-AUTH | Đăng ký, đăng nhập, role escalation, session expiry |
| TC-Q | Zero/one/many result, multi-tag filter, draft visibility, input length |
| TC-M | Verification states, unauthorized approval, public visibility |
| TC-SLOT | Timezone, overlap, past slot, concurrent update |
| TC-B | State transition, double booking, cancellation, idempotency |
| TC-SESSION | Meeting-link privacy và object-level authorization |
| TC-F | Completed-only feedback, rubric validation, review uniqueness |
| TC-N | Retry, duplicate event, provider outage và fallback |
| TC-ADM | CRUD, moderation, report resolution và audit trail |

## 8. Mapping summary

Mỗi Must story ánh xạ ít nhất một requirement, business rule và test suite. KPI chỉ đo outcome; test case xác nhận behavior. Hai loại bằng chứng phải được báo cáo riêng.

## 9. Product Backlog controls

### 9.1 Glossary

| Thuật ngữ | Nghĩa |
|---|---|
| Question | Nội dung phỏng vấn đã gắn taxonomy và trạng thái moderation |
| Mentor | User cung cấp mock interview; chỉ Approved mới công khai |
| Slot | Khoảng thời gian có timezone do Mentor cung cấp |
| Booking | Yêu cầu giữa một Student, Mentor và Slot |
| Feedback | Rubric riêng tư sau booking Completed |
| Review | Đánh giá công khai từ booking hợp lệ |

### 9.2 Business-value map

- Acquisition: Question Bank và nội dung tìm kiếm được.
- Activation: lưu câu hỏi hoặc xem mentor phù hợp.
- Conversion: gửi booking hợp lệ.
- Core value: booking diễn ra và feedback hoàn chỉnh.
- Retention: quay lại luyện chủ đề/đặt phiên tiếp theo.

### 9.3 Definition of Ready

Story sẵn sàng khi có actor/value, acceptance criteria, dependency, design/contract cần thiết, estimate của người thực hiện và không còn quyết định business chưa có owner.

### 9.4 Release backlog và story map

1. Foundation: US-01,02,18.
2. Learn: US-03–06.
3. Discover mentor: US-07–10.
4. Book and attend: US-11–14,19.
5. Improve and trust: US-15–17,20.
6. Optional: US-21–23.

### 9.5 Change scope

Story AI, video, recording, payment/payout, mobile native và ML recommendation phải nằm ở Future Backlog trừ khi Sponsor/PO phê duyệt change request có capacity bù trừ.

