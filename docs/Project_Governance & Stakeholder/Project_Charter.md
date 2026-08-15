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

Interview Practice Platform giúp ứng viên chuyển một Job Description (JD) cụ thể thành preparation plan có cấu trúc, sau đó tự luyện hoặc đặt mentor, tham gia mock interview, nhận feedback và cập nhật kế hoạch.

## 3. Nhu cầu kinh doanh và lý do thực hiện

Ứng viên thường đọc một JD nhưng phải tự suy luận kiến thức/kỹ năng cần ôn, ghép câu hỏi từ nhiều nguồn và không biết requirement nào đã được bao phủ. Dự án kiểm chứng liệu luồng JD intake → extraction/correction → requirement/taxonomy analysis → explainable Question mapping → preparation plan → self-practice hoặc Mentor booking → feedback có giúp nhóm entry-level chuẩn bị rõ ràng và hiệu quả hơn hay không.

## 4. Mục tiêu và tiêu chí thành công cấp cao

| Mục tiêu | Chỉ số/điều kiện |
|---|---|
| Xác nhận vấn đề | Ít nhất 70% mẫu discovery xác nhận một pain cốt lõi |
| Hoàn tất JD-to-plan | Ít nhất 80% phiên usability hoàn tất nhập/upload, xác nhận text và mở preparation plan |
| Nhận diện requirement | Ít nhất 80% expected requirement trong bộ JD pilot được phát hiện |
| Mapping có liên quan | Ít nhất 80% Question được reviewer đánh giá relevant; 100% kết quả có requirement/topic/reason |
| Hoàn tất booking | Ít nhất 80% phiên usability tạo được booking hợp lệ có JD/preparation-plan context |
| Booking đáng tin cậy | Ít nhất 80% booking đã xác nhận thực sự diễn ra |
| Feedback có giá trị | Ít nhất 90% booking hoàn thành có điểm mạnh, điểm yếu và hành động tiếp theo |
| Chất lượng kỹ thuật | 100% critical workflow pass; không còn defect Critical/High trước UAT |

Mục tiêu số lượng người dùng, mentor và booking tuyệt đối chưa được baseline; Product Owner/Research phải chốt trong PD-01 trước khi tuyển mẫu pilot.

## 5. Phạm vi cấp cao

### 5.1 Trong phạm vi MVP

- Authentication và phân quyền Student/Mentor/Admin.
- JD text/file intake, direct extraction hoặc OCR fallback và manual correction trước analysis.
- Requirement detection, taxonomy/alias normalization, explainable Question mapping và preparation plan.
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
- OCR cho mọi định dạng/ngôn ngữ hoặc tài liệu không phải JD.

### 5.3 Deliverable chính

1. Bộ requirement, workflow, backlog và acceptance criteria.
2. Prototype luồng Student, Mentor và Admin.
3. Ứng dụng web MVP đã deployment.
4. Bộ JD test, taxonomy/alias, Question Bank và danh sách mentor pilot.
5. Test report, UAT evidence và báo cáo KPI.
6. User guide, release note và risk register cập nhật.

## 6. Mốc chính

| Mốc | Tỷ lệ lịch dự án | Exit criteria |
|---|---:|---|
| Discovery complete | 15% | Evidence vấn đề, stakeholder map, scope draft |
| Requirement/prototype baseline | 30% | Workflow, prototype, backlog được PO duyệt |
| Foundation complete | 45% | Kiến trúc, CI/CD, auth và dữ liệu nền hoạt động |
| JD analysis and plan complete | 65% | Intake, extraction/correction, requirement/mapping và preparation plan đạt acceptance criteria |
| Marketplace complete | 85% | Luồng mentor/booking/feedback end-to-end hoạt động |
| UAT and release | 100% | Critical tests pass, UAT ký nhận, deployment sẵn sàng |

Lịch đề xuất là 12 tuần, từ 17/08/2026 đến 08/11/2026. Capacity planning dùng 6 thành viên × 16 giờ/tuần = 1.152 giờ danh nghĩa, khoảng 979 giờ sau reserve 15%; lịch chỉ trở thành commitment sau khi scope JD-first được re-estimate và Sponsor/team chấp nhận.

## 7. Stakeholder chính

| Stakeholder | Vai trò |
|---|---|
| Sponsor/giảng viên | Phê duyệt charter, baseline và thay đổi lớn |
| Product Owner | Quyết định ưu tiên, acceptance và release |
| Team Lead | Điều phối thực thi liên luồng, tích hợp code/tài liệu và release readiness |
| Nhóm phát triển | Phân tích, thiết kế, xây dựng, kiểm thử và vận hành |
| Sinh viên/ứng viên | Người dùng/customer chính; cung cấp discovery và UAT |
| Mentor/HR/người phỏng vấn | Cung cấp dịch vụ, review nội dung và feedback |
| Nhà cung cấp ngoài | Hosting, database/storage, email, công cụ họp và OCR adapter nếu được chọn |

## 8. Thẩm quyền và governance

### 8.1 Thẩm quyền

- Product Owner ưu tiên backlog và chấp nhận story dựa trên acceptance criteria.
- Project Manager/Scrum Master điều phối kế hoạch, risk, dependency và escalation.
- Team Lead điều phối WIP kỹ thuật, tích hợp giữa các workstream, PR/code review, configuration/document control và readiness trước merge/release.
- Team Lead không thay Product Owner quyết định scope/acceptance, không thay Project Manager sở hữu lịch/risk và không tự thay đổi ADR do Architecture owner quản lý.
- Nhóm kỹ thuật quyết định cách triển khai trong giới hạn architecture, security và scope đã duyệt.
- Admin pilot có quyền duyệt mentor, nội dung và xử lý report theo policy.

### 8.2 Change control

Mọi thay đổi ảnh hưởng MVP, lịch, ngân sách hoặc dữ liệu nhạy cảm phải có change request gồm lý do, lợi ích, effort, risk, tác động và người phê duyệt. Semantic/ML recommendation, phỏng vấn tự động, video tích hợp và payment mặc định nằm trong Future Backlog.

## 9. Giả định

- Có thể tuyển một nhóm mentor và sinh viên đủ cho pilot.
- MVP dùng Google Meet/Zoom hoặc link họp ngoài.
- Nhóm dùng free tier khi đáp ứng acceptance criteria.
- Một người có thể giữ nhiều vai trò nhưng trách nhiệm phải rõ.
- Feedback rubric được mentor chấp nhận sau khi thử nghiệm.
- Có bộ JD mẫu đã loại dữ liệu nhạy cảm, expected requirement và taxonomy/alias đủ cho phân khúc pilot.
- Student chấp nhận kiểm tra/sửa text trước khi analysis.

## 10. Ràng buộc

- Lịch 12 tuần và khoảng 979 giờ capacity của sáu thành viên đang ở trạng thái proposed; backlog JD-first 134 initial SP phải được re-estimate/rebaseline và ngân sách cần Sponsor phê duyệt chính thức.
- Nội dung phải tôn trọng bản quyền và lưu provenance.
- File/text JD, requirement/mapping/plan, hồ sơ, booking, link họp và feedback cần kiểm soát truy cập, retention và deletion.
- OCR phụ thuộc chất lượng file; mapping chỉ được đánh giá trong taxonomy và bộ JD pilot đã xác định.
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
| Extraction/OCR sai dẫn đến analysis sai | Cao | Direct extraction trước, correction gate, known-output test và failure state rõ |
| Taxonomy/mapping thiếu hoặc không relevant | Cao | Labeled JD set, alias governance, versioned deterministic matching và expert relevance review |

## 12. Phê duyệt

| Vai trò | Họ tên | Quyết định | Ngày/Chữ ký |
|---|---|---|---|
| Sponsor | Giảng viên phụ trách môn học | Approve/Reject — pending | Pending signature |
| Product Owner | Hưng | Approve/Reject — pending | Pending signature |
| Project Manager | Gia Thành | Accept responsibility — pending | Pending signature |
| Team Lead | Tuấn Anh | Accept integration/document-control responsibility — pending | Pending signature |

