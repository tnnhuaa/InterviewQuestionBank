# STAKEHOLDER ANALYSIS — INTERVIEW PRACTICE PLATFORM

## 1. Tóm tắt

Dự án tạo giá trị ban đầu từ JD-to-preparation-plan và giá trị thực hành từ Mentor Marketplace. Governance phải bảo vệ dữ liệu JD của Student, chất lượng taxonomy/mapping và trải nghiệm của cả Student/Mentor, đồng thời cho Sponsor/Product Owner đủ dữ liệu để kiểm soát phạm vi, chất lượng và tính khả thi.

## 2. Sponsor

Sponsor: **Giảng viên Ngô Huy Biên và Ngô Ngọc Đăng Khoa**; formal approval record được ghi tại Charter khi ký.

### 2.1 Kỳ vọng của Sponsor

- Proposal, phạm vi và baseline có bằng chứng.
- MVP hoàn thành trong thời gian và ngân sách được duyệt.
- Critical workflow được kiểm thử và UAT.
- Nhóm báo cáo risk, change và blocker kịp thời.
- Kết luận Go/Pivot/Stop dựa trên KPI, không dựa trên số lượng tính năng.

## 3. Stakeholder register

| ID | Stakeholder | Lợi ích/nhu cầu | Power | Interest | Chiến lược |
|---|---|---|---|---|---|
| ST-01 | Sponsor/giảng viên | Kết quả học tập, governance, chất lượng deliverable | Cao | Cao | Manage closely |
| ST-02 | Gia Thành — Project Planning & Estimation Analyst / Full-stack Developer | Baseline, nguồn lực, chi phí, ước lượng và implementation Full-stack | Trung bình | Cao | Keep engaged |
| ST-03 | Hùng — UI/UX Designer / Front-end Developer | Luồng người dùng, nguyên mẫu, khả dụng, bằng chứng nghiên cứu và giao diện | Trung bình | Cao | Manage closely |
| ST-04 | Hưng — Product Owner / Business Analyst | Giá trị sản phẩm, tầm nhìn, phạm vi, backlog và acceptance | Cao | Cao | Manage closely |
| ST-05 | Trí — PoC / Integration & E2E Developer | Tính khả thi kỹ thuật, PoC, tích hợp, kiểm thử đầu-cuối và dữ liệu kiểm chứng | Trung bình | Cao | Manage closely |
| ST-06 | Luân — Architecture / Technical Lead | Kiến trúc, ADR, công nghệ, ràng buộc kỹ thuật và hỗ trợ PoC | Cao trong kỹ thuật | Cao | Manage closely |
| ST-07 | Tuấn Anh — Project Manager / Team Leader / Timekeeper | Điều hành nhóm, quản lý deadline và Kanban, escalation, tích hợp, review/merge và delivery readiness | Cao | Cao | Manage closely |
| ST-08 | Development team | Requirement rõ, môi trường và quyết định kịp thời | Trung bình | Cao | Keep engaged |
| ST-09 | Sinh viên/ứng viên | JD được xử lý riêng tư, plan/mapping dễ hiểu và booking có ngữ cảnh | Trung bình | Cao | Co-design/test |
| ST-10 | Mentor/HR | JD/topic cần luyện rõ, lịch kiểm soát được, uy tín và feedback phù hợp | Trung bình | Cao | Co-design/test |
| ST-11 | Administrator/moderator | Taxonomy/alias, quy trình duyệt, report và audit rõ | Trung bình | Cao | Involve early |
| ST-12 | Hosting/database provider | Sử dụng đúng quota và điều khoản | Cao gián tiếp | Thấp | Monitor |
| ST-13 | Extraction/OCR, email/calendar/video provider | Tích hợp ổn định, tuân thủ privacy/policy và có fallback | Cao gián tiếp | Thấp | Monitor/fallback |
| ST-14 | Cố vấn pháp lý/privacy | Consent, privacy notice, terms và xử lý dữ liệu | Trung bình | Trung bình | Consult |

## 4. Nhu cầu, trách nhiệm và thẩm quyền

### Sponsor

- Phê duyệt charter, baseline và change lớn.
- Gỡ blocker vượt thẩm quyền nhóm.
- Xem báo cáo milestone, risk và KPI.

### Product Owner

- Làm rõ value proposition và release goal.
- Sắp xếp backlog, chấp nhận/reject story và quyết định trade-off.
- Xác nhận Go/Pivot/Stop cùng Sponsor.

### Project Planning & Estimation Analyst / Full-stack Developer

- Lập và cập nhật Charter, Resource Plan, Cost–Time–Resources cùng hai estimate độc lập.
- Phân tích capacity, baseline và tác động kế hoạch để cung cấp dữ liệu cho PM ra quyết định.
- Tham gia phát triển Full-stack ở mentor verification, availability, JD service và notification.

### UI/UX Designer / Front-end Developer

- Duy trì luồng người dùng, clickable prototype và handoff bám theo backlog đã duyệt.
- Thu thập bằng chứng nghiên cứu/khả dụng và nêu rõ điểm chưa được kiểm chứng.
- Phối hợp với Product Owner để truy vết thay đổi nguyên mẫu về requirement và acceptance criteria.

### PoC / Integration & E2E Developer

- Thực hiện PoC luồng cốt lõi, dữ liệu seed, kiểm thử đầu-cuối và bằng chứng Pass/Fail cho rủi ro kỹ thuật.
- Kiểm chứng extraction/mapping, booking concurrency, authorization và reliability theo gate đã duyệt.
- Phối hợp với Architecture/technical lead; PoC không tự thay đổi phạm vi hoặc ADR.

### Architecture / Technical Lead

- Sở hữu technology stack, ADR, ranh giới hệ thống và các ràng buộc kỹ thuật/bảo mật.
- Hướng dẫn kỹ thuật cho PoC và implementation, đồng thời ghi rõ quyết định Accepted/Pending/Rejected.
- Đánh giá tác động kiến trúc của thay đổi backlog nhưng không thay quyền ưu tiên/acceptance của Product Owner.

### Project Manager / Team Leader / Timekeeper

- Phân vai, giao việc theo tuần, quản lý deadline và theo dõi luồng Kanban giữa prototype, requirement, architecture, PoC và implementation.
- Chốt quyết định điều hành, phối hợp với Product Owner về scope/priority, xử lý escalation và theo dõi delivery readiness.
- Thực hiện hoặc phân công phần tích hợp sản phẩm: repository foundation, CI quality gate, shared contracts và end-to-end integration.
- Quản lý configuration/document workflow: đúng cây thư mục, owner/reviewer, version, link/evidence và consistency trước merge.
- Tổ chức technical/document review và theo dõi action item đến khi đóng. Hưng với vai trò Product Owner / Business Analyst vẫn sắp thứ tự backlog và chấp nhận story; quyết định điều hành của Project Manager không thay quyền acceptance này.

### Development team

- Ước lượng, thiết kế, phát triển, test và cập nhật tài liệu.
- Tuân thủ Definition of Done, security và privacy controls.
- Nêu blocker và rủi ro kỹ thuật sớm.

### Sinh viên/ứng viên

- Cung cấp discovery evidence và tham gia usability/UAT.
- Chỉ upload JD có quyền sử dụng; kiểm tra/sửa text trước khi xác nhận analysis.
- Cung cấp mục tiêu booking trung thực, tuân thủ lịch và community rules.
- Chỉ chia sẻ dữ liệu cần thiết.

### Mentor/HR

- Cung cấp bằng chứng xác minh và lịch chính xác.
- Chỉ sử dụng JD/preparation-plan context được chia sẻ cho mục đích của booking.
- Thực hiện mock interview trong phạm vi đã công bố.
- Gửi feedback có cấu trúc và tuân thủ privacy/community rules.

### Administrator

- Duyệt mentor/câu hỏi, xử lý report và quản lý taxonomy/alias; không xem JD riêng tư nếu không có thẩm quyền nghiệp vụ.
- Giữ audit trail cho quyết định moderation và booking exception.

### Nhà cung cấp dịch vụ

- Cung cấp hosting, database/storage, extraction/OCR, email hoặc video meeting theo SLA/quota đã chọn.
- Không được xem là nguồn chân lý cho booking hoặc kết quả analysis; hệ thống phải có trạng thái nội bộ, kiểm tra output và fallback.

## 5. Power–Interest matrix

| Nhóm | Stakeholder | Cách quản lý |
|---|---|---|
| Power cao, Interest cao | Sponsor, Product Owner, Project Manager/Team Leader và Architecture/Technical Lead | Trao đổi thường xuyên; xin quyết định theo milestone và điều phối integration |
| Power cao, Interest thấp | Nhà cung cấp hạ tầng/tích hợp | Theo dõi quota, outage, điều khoản; chuẩn bị fallback |
| Power thấp/trung bình, Interest cao | Team, Student, Mentor, Admin | Đồng thiết kế, demo, research và UAT định kỳ |
| Power thấp, Interest thấp | Công chúng/đối tác tương lai | Theo dõi; cập nhật khi phạm vi mở rộng |

## 6. Baseline decisions và review trigger

- Sponsor: Ngô Huy Biên và Ngô Ngọc Đăng Khoa; formal signatures vẫn được lưu tại Charter.
- Capacity: 6 thành viên × 16 giờ/tuần trong 8 tuần, khoảng 653 giờ sau reserve; không dùng reserve để thêm scope.
- Pilot: Front-end Intern/Junior; 20 JD, 12 Student, 4 Mentor và 12 booking theo PD-01.
- File/OCR/mapping, booking, privacy, meeting và reminder dùng PD-02–PD-08 trong Product Backlog.
- Mentor pilot cần identity evidence và public professional profile hoặc verifiable experience evidence; Admin review reason/audit trước `Approved`.
- Go khi blind-set recall/precision@10 ≥80%, critical tests 100%, không còn Critical/High defect và pilot đạt ≥10 Confirmed/≥8 Completed; Pivot/Stop khi không đạt sau một remediation cycle hoặc phải bỏ security/privacy gate.
- Mọi thay đổi baseline cần evidence, impact tới scope/schedule/cost và owner approval qua change control.

## 7. Kế hoạch truyền thông

| Nội dung | Người tham gia | Nhịp | Kênh | Owner |
|---|---|---|---|---|
| Kanban coordination | Nhóm dự án | Khi giao việc, phát sinh blocker hoặc cần chốt thay đổi | Messenger + Kanban | Tuấn Anh |
| Integration/document-control review | Tuấn Anh và owner từng deliverable | Hai lần/tuần và trước merge | PR + checklist + action items | Tuấn Anh |
| Backlog refinement | PO, BA, team | Mỗi tuần | Công cụ backlog | PO |
| Flow/replenishment review | PO và team | Mỗi tuần hoặc khi cần bổ sung/chốt công việc | Kanban + backlog | Tuấn Anh |
| Risk/change review | Sponsor, PO và PM | Mỗi tuần hoặc khi vượt ngưỡng | Risk/change log | Tuấn Anh |
| Student research | BA/UX và sinh viên | Theo research plan | Interview/test | Research owner |
| Mentor review | PO/BA và mentor | Trước prototype, pilot | Interview/demo | PO |
| Milestone report | Sponsor và nhóm | Mỗi milestone | Báo cáo ngắn | PM |

### 7.1 Quy tắc truyền thông

- Mọi quyết định scope, acceptance và change phải được ghi trong nguồn dùng chung.
- Không đưa dữ liệu cá nhân hoặc link họp vào kênh công khai.
- Thành viên đưa blocker lên Messenger khi phát hiện để Tuấn Anh và nhóm chốt cách xử lý; nhóm không quy định thời gian phản hồi cố định.
- Research note phải tách nhận định của nhóm khỏi lời/evidence của người tham gia.

