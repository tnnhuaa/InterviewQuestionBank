# PROJECT CHARTER — INTERVIEW PRACTICE PLATFORM

## 1. Thông tin kiểm soát tài liệu

| Thuộc tính | Giá trị |
|---|---|
| Sponsor | Giảng viên Ngô Huy Biên và Ngô Ngọc Đăng Khoa |
| PM/Scrum Master, initiation & estimation | Gia Thành — charter, nguồn lực, ước lượng, tiến độ và rủi ro |
| Trưởng nhóm / leadership & governance | Tuấn Anh — điều phối nhóm, phê duyệt phạm vi/ưu tiên, hỗ trợ escalation và theo dõi độ sẵn sàng delivery |
| UI/UX | Hùng — clickable prototype, workflow và bằng chứng usability |
| Product Owner/BA | Hưng — Vision & Scope, Product Backlog, acceptance criteria và Future-State Workflow |
| PoC/E2E | Trí — PoC core flow, dữ liệu seed, test và bằng chứng rủi ro kỹ thuật |
| Architecture/technical lead | Luân — technology stack, ADR, architecture và hỗ trợ kỹ thuật cho PoC |
| Nhóm thực hiện | Gia Thành, Hùng, Hưng, Trí, Luân, Tuấn Anh |
| Phiên bản | 1.0 — planning baseline |
| Ngày | 15/08/2026 |
| Trạng thái | Planning baseline đã chốt; formal signatures pending |

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

Pilot dùng 20 JD Front-end Intern/Junior (12 calibration, 8 blind), 12 Student, 4 Mentor Approved với ít nhất 3 slot/người và 12 booking hợp lệ; mục tiêu tối thiểu 10 Confirmed và 8 Completed.

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

Planning baseline là 8 tuần, từ 29/06/2026 đến 23/08/2026, với 6 thành viên × 16 giờ/tuần = 768 giờ danh nghĩa và khoảng 653 giờ sau reserve 15%. Sprint commitment vẫn chỉ được lập sau Planning Poker, cập nhật hai estimate độc lập theo 27 câu chuyện Bắt buộc và velocity-range review.

## 7. Stakeholder chính

| Stakeholder | Vai trò |
|---|---|
| Sponsor/giảng viên | Phê duyệt charter, baseline và thay đổi lớn |
| Product Owner | Quyết định ưu tiên, acceptance và release |
| PM/Scrum Master | Điều phối kế hoạch, ước lượng, tiến độ, rủi ro và Scrum events |
| Trưởng nhóm / leadership & governance | Điều phối thực thi liên luồng, phê duyệt phạm vi/ưu tiên, tích hợp code/tài liệu và release readiness |
| Nhóm phát triển | Phân tích, thiết kế, xây dựng, kiểm thử và vận hành |
| Sinh viên/ứng viên | Người dùng/customer chính; cung cấp discovery và UAT |
| Mentor/HR/người phỏng vấn | Cung cấp dịch vụ, review nội dung và feedback |
| Nhà cung cấp ngoài | Hosting, database/storage, email, công cụ họp và OCR adapter nếu được chọn |

### 7.1 Phân công theo Charter

| Thành viên | Vai trò chính | Trách nhiệm / đầu ra |
|---|---|---|
| Gia Thành | PM/Scrum Master, initiation & estimation | Charter, Resource Plan, Cost-Time-Resources, hai estimate độc lập và theo dõi baseline |
| Hùng | UI/UX | Clickable prototype, workflow và bằng chứng usability |
| Hưng | Product Owner/BA | Vision & Scope, Product Backlog, acceptance criteria và Future-State Workflow |
| Trí | PoC/E2E | PoC core flow, dữ liệu seed, test và bằng chứng rủi ro kỹ thuật |
| Luân | Architecture/technical lead | Technology stack, ADR, architecture và hỗ trợ kỹ thuật cho PoC |
| Tuấn Anh | Trưởng nhóm / leadership & governance | Điều phối nhóm, phê duyệt scope/priority, hỗ trợ escalation, theo dõi delivery readiness; đồng thời hỗ trợ repository skeleton, tích hợp và kiểm soát tài liệu |

## 8. Thẩm quyền và governance

### 8.1 Thẩm quyền

- Product Owner ưu tiên backlog và chấp nhận story dựa trên acceptance criteria.
- PM/Scrum Master điều phối kế hoạch, risk, dependency và escalation.
- Trưởng nhóm điều phối nhóm và WIP kỹ thuật, phê duyệt scope/priority ở cấp leadership & governance, hỗ trợ escalation, tích hợp giữa các workstream, PR/code review, configuration/document control và readiness trước merge/release.
- Product Owner vẫn sắp thứ tự Product Backlog và chấp nhận story; PM/Scrum Master sở hữu lịch/risk; Architecture/technical lead sở hữu ADR. Phê duyệt scope/priority của Trưởng nhóm phải được ghi cùng quyết định PO/PM tương ứng, không thay thế các quyền chuyên môn này.
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

- Lịch 8 tuần, khoảng 653 giờ capacity và cash ceiling 1.125.000 VNĐ là planning baseline đã chốt; backlog JD-first 134 initial SP vẫn phải được Development Team re-estimate trước sprint commitment.
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
| Sponsor | Ngô Huy Biên; Ngô Ngọc Đăng Khoa | Formal approval pending | Pending signature |
| Product Owner | Hưng | Planning baseline recorded | Pending signature |
| Project Manager | Gia Thành | Accept responsibility — pending | Pending signature |
| Trưởng nhóm / leadership & governance | Tuấn Anh | Accept leadership/governance, integration và document-control responsibility — pending | Pending signature |

