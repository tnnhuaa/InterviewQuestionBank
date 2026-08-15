# PROJECT CHARTER — INTERVIEW PRACTICE PLATFORM

## 1. Thông tin kiểm soát tài liệu

| Thuộc tính | Giá trị |
|---|---|
| Sponsor | Giảng viên — xác nhận danh tính/acceptance record còn thiếu |
| Product Owner | Hưng |
| Project Manager/Scrum Master | Gia Thành |
| Team Lead/Integration Lead | Tuấn Anh |
| Nhóm thực hiện | Gia Thành, Hùng, Hưng, Trí, Luân, Tuấn Anh |
| Phiên bản | 0.4 |
| Ngày | 15/08/2026 |
| Trạng thái | Draft — chưa phê duyệt baseline |

## 2. Mục đích dự án

Interview Practice Platform giúp sinh viên chuẩn bị phỏng vấn theo một vòng lặp thống nhất: chọn vị trí, luyện câu hỏi, đặt lịch với mentor, tham gia mock interview, nhận feedback và luyện lại chủ đề yếu.

## 3. Nhu cầu kinh doanh và lý do thực hiện

Sinh viên hiện phải kết hợp nhiều nguồn nội dung và kênh liên lạc để luyện phỏng vấn. Quy trình này tốn thời gian, khó đánh giá chất lượng câu trả lời và phụ thuộc vào mạng lưới cá nhân. Dự án kiểm chứng liệu Question Bank kết hợp Mentor Marketplace có thể giảm ma sát và nâng chất lượng chuẩn bị cho nhóm người dùng entry-level tại Việt Nam hay không.

## 4. Mục tiêu và tiêu chí thành công cấp cao

| Mục tiêu | Chỉ số/điều kiện |
|---|---|
| Xác nhận vấn đề | Ít nhất 70% mẫu discovery xác nhận một pain cốt lõi |
| Tìm nội dung hiệu quả | Ít nhất 80% phiên usability test tìm được câu hỏi phù hợp; median ≤ 2 phút |
| Hoàn tất booking | Ít nhất 80% phiên usability test tạo được yêu cầu hợp lệ |
| Booking đáng tin cậy | Ít nhất 80% booking đã xác nhận thực sự diễn ra |
| Feedback có giá trị | Ít nhất 90% booking hoàn thành có điểm mạnh, điểm yếu và hành động tiếp theo |
| Chất lượng kỹ thuật | 100% critical workflow pass; không còn defect Critical/High trước UAT |

Mục tiêu số lượng người dùng, mentor và booking tuyệt đối: **[CẦN BỔ SUNG]**.

## 5. Phạm vi cấp cao

### 5.1 Trong phạm vi MVP

- Authentication và phân quyền Student/Mentor/Admin.
- Question Bank: taxonomy, tìm kiếm/lọc, chi tiết, bookmark và trạng thái luyện.
- Mentor profile, verification và availability.
- Booking lifecycle, khóa time slot và notification.
- Link họp ngoài, feedback rubric và review hợp lệ.
- Admin tối thiểu cho nội dung, mentor, booking và report.
- Deployment, test, UAT và tài liệu sử dụng.

### 5.2 Ngoài phạm vi nếu chưa qua change control

- AI interviewer, tự động chấm, speech analysis.
- Video call tích hợp, ghi âm và phiên âm.
- Payment escrow/payout tự động.
- Mobile native, ATS, job board và ML recommendation.

### 5.3 Deliverable chính

1. Bộ requirement, workflow, backlog và acceptance criteria.
2. Prototype luồng Student, Mentor và Admin.
3. Ứng dụng web MVP đã deployment.
4. Question Bank pilot và danh sách mentor pilot.
5. Test report, UAT evidence và báo cáo KPI.
6. User guide, release note và risk register cập nhật.

## 6. Mốc chính

| Mốc | Tỷ lệ lịch dự án | Exit criteria |
|---|---:|---|
| Discovery complete | 15% | Evidence vấn đề, stakeholder map, scope draft |
| Requirement/prototype baseline | 30% | Workflow, prototype, backlog được PO duyệt |
| Foundation complete | 45% | Kiến trúc, CI/CD, auth và dữ liệu nền hoạt động |
| Question Bank complete | 60% | Luồng tìm/lọc/luyện đạt acceptance criteria |
| Marketplace complete | 85% | Luồng mentor/booking/feedback end-to-end hoạt động |
| UAT and release | 100% | Critical tests pass, UAT ký nhận, deployment sẵn sàng |

Lịch đề xuất là 12 tuần, từ 17/08/2026 đến 08/11/2026; chỉ trở thành baseline sau khi Tuấn Anh xác nhận capacity và Sponsor/team chấp nhận.

## 7. Stakeholder chính

| Stakeholder | Vai trò |
|---|---|
| Sponsor/giảng viên | Phê duyệt charter, baseline và thay đổi lớn |
| Product Owner | Quyết định ưu tiên, acceptance và release |
| Team Lead | Điều phối thực thi liên luồng, tích hợp code/tài liệu và release readiness |
| Nhóm phát triển | Phân tích, thiết kế, xây dựng, kiểm thử và vận hành |
| Sinh viên/ứng viên | Người dùng/customer chính; cung cấp discovery và UAT |
| Mentor/HR/người phỏng vấn | Cung cấp dịch vụ, review nội dung và feedback |
| Nhà cung cấp ngoài | Hosting, database, email và công cụ họp |

## 8. Thẩm quyền và governance

### 8.1 Thẩm quyền

- Product Owner ưu tiên backlog và chấp nhận story dựa trên acceptance criteria.
- Project Manager/Scrum Master điều phối kế hoạch, risk, dependency và escalation.
- Team Lead điều phối WIP kỹ thuật, tích hợp giữa các workstream, PR/code review, configuration/document control và readiness trước merge/release.
- Team Lead không thay Product Owner quyết định scope/acceptance, không thay Project Manager sở hữu lịch/risk và không tự thay đổi ADR do Architecture owner quản lý.
- Nhóm kỹ thuật quyết định cách triển khai trong giới hạn architecture, security và scope đã duyệt.
- Admin pilot có quyền duyệt mentor, nội dung và xử lý report theo policy.

### 8.2 Change control

Mọi thay đổi ảnh hưởng MVP, lịch, ngân sách hoặc dữ liệu nhạy cảm phải có change request gồm lý do, lợi ích, effort, risk, tác động và người phê duyệt. AI, video và payment mặc định được đưa vào Future Backlog.

## 9. Giả định

- Có thể tuyển một nhóm mentor và sinh viên đủ cho pilot.
- MVP dùng Google Meet/Zoom hoặc link họp ngoài.
- Nhóm dùng free tier khi đáp ứng acceptance criteria.
- Một người có thể giữ nhiều vai trò nhưng trách nhiệm phải rõ.
- Feedback rubric được mentor chấp nhận sau khi thử nghiệm.

## 10. Ràng buộc

- Lịch 12 tuần và 816 giờ của năm thành viên ban đầu đang ở trạng thái proposed; capacity Tuấn Anh và ngân sách cần phê duyệt chính thức.
- Nội dung phải tôn trọng bản quyền và lưu provenance.
- Dữ liệu hồ sơ, booking, link họp và feedback cần kiểm soát truy cập.
- Marketplace mới có nguồn cung mentor hạn chế.
- MVP phải tránh phụ thuộc không cần thiết vào AI, video và payment.

## 11. Rủi ro cấp cao

| Rủi ro | Mức | Phản ứng |
|---|---|---|
| Thiếu mentor pilot | Cao | Tuyển sớm từ alumni, CLB, giảng viên; chạy concierge pilot |
| Sinh viên không chuyển từ câu hỏi sang booking | Cao | Đo funnel, phỏng vấn nguyên nhân, thử CTA và value proposition |
| Chất lượng mentor/feedback không đều | Cao | Verification, rubric, hướng dẫn và moderation |
| Trùng lịch/no-show | Cao | Lock slot, reminder, cancellation policy và admin resolution |
| Scope creep | Cao | Baseline, future backlog và change control |
| Rò rỉ dữ liệu | Cao | Least privilege, privacy-by-design, audit và incident response |

## 12. Phê duyệt

| Vai trò | Họ tên | Quyết định | Ngày/Chữ ký |
|---|---|---|---|
| Sponsor | [CẦN BỔ SUNG] | Approve/Reject | [CẦN BỔ SUNG] |
| Product Owner | Hưng | Approve/Reject | [CẦN BỔ SUNG] |
| Project Manager | Gia Thành | Accept responsibility | [CẦN BỔ SUNG] |
| Team Lead | Tuấn Anh | Accept integration/document-control responsibility | [CẦN BỔ SUNG] |

