# STAKEHOLDER ANALYSIS — INTERVIEW PRACTICE PLATFORM

## 1. Tóm tắt

Dự án phụ thuộc đồng thời vào demand side (sinh viên) và supply side (mentor). Governance phải bảo vệ trải nghiệm của cả hai nhóm, đồng thời cho Sponsor/Product Owner đủ dữ liệu để kiểm soát phạm vi, chất lượng và tính khả thi.

## 2. Sponsor

Sponsor: **[CẦN BỔ SUNG]**.

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
| ST-02 | Hưng — Product Owner | Giá trị sản phẩm, backlog, acceptance | Cao | Cao | Manage closely |
| ST-03 | Gia Thành — Project Manager/Scrum Master | Kế hoạch, delivery, risk và team health | Cao | Cao | Manage closely |
| ST-04 | Tuấn Anh — Team Lead | Đã bootstrap repository và bộ tài liệu nền; tiếp tục phụ trách tích hợp, chất lượng PR, configuration/document control và release readiness | Cao trong delivery | Cao | Manage closely |
| ST-05 | Development team | Requirement rõ, môi trường và quyết định kịp thời | Trung bình | Cao | Keep engaged |
| ST-06 | Sinh viên/ứng viên | Nội dung phù hợp, booking dễ, riêng tư và giá hợp lý | Trung bình | Cao | Co-design/test |
| ST-07 | Mentor/HR | Yêu cầu rõ, lịch kiểm soát được, uy tín và compensation | Trung bình | Cao | Co-design/test |
| ST-08 | Administrator/moderator | Quy trình duyệt, report và audit rõ | Trung bình | Cao | Involve early |
| ST-09 | Hosting/database provider | Sử dụng đúng quota và điều khoản | Cao gián tiếp | Thấp | Monitor |
| ST-10 | Email/calendar/video provider | Tích hợp ổn định, tuân thủ policy | Cao gián tiếp | Thấp | Monitor/fallback |
| ST-11 | Cố vấn pháp lý/privacy | Consent, privacy notice, terms và xử lý dữ liệu | Trung bình | Trung bình | Consult |

## 4. Nhu cầu, trách nhiệm và thẩm quyền

### Sponsor

- Phê duyệt charter, baseline và change lớn.
- Gỡ blocker vượt thẩm quyền nhóm.
- Xem báo cáo milestone, risk và KPI.

### Product Owner

- Làm rõ value proposition và release goal.
- Sắp xếp backlog, chấp nhận/reject story và quyết định trade-off.
- Xác nhận Go/Pivot/Stop cùng Sponsor.

### Project Manager/Scrum Master

- Duy trì kế hoạch, dependency, risk register và communication cadence.
- Tổ chức sprint events và escalation.
- Bảo đảm quyết định được ghi lại.

### Team Lead

- Đã khởi tạo repository tại [`ff41b3c`](https://github.com/tnnhuaa/InterviewQuestionBank/commit/ff41b3ce37b6187df6590d1d77b057e59792f25d) và tạo skeleton `docs/` cùng nội dung nền ban đầu tại [`0743a68`](https://github.com/tnnhuaa/InterviewQuestionBank/commit/0743a685195a3396511a59c83515860c9f11bfdd).
- Điều phối dependency và WIP kỹ thuật giữa prototype, requirement, architecture, PoC và implementation.
- Thực hiện hoặc phân công phần tích hợp sản phẩm: repository foundation, CI quality gate, shared contracts và end-to-end integration.
- Quản lý configuration/document workflow: đúng cây thư mục, owner/reviewer, version, link/evidence và consistency trước merge.
- Tổ chức technical/document review; theo dõi action item đến khi đóng nhưng không tự phê duyệt scope thay Product Owner.
- Skeleton và starter content là điểm khởi đầu được bàn giao; owner chuyên môn chịu trách nhiệm hoàn thiện, kiểm chứng và phê duyệt nội dung thuộc workstream của mình.

### Development team

- Ước lượng, thiết kế, phát triển, test và cập nhật tài liệu.
- Tuân thủ Definition of Done, security và privacy controls.
- Nêu blocker và rủi ro kỹ thuật sớm.

### Sinh viên/ứng viên

- Cung cấp discovery evidence và tham gia usability/UAT.
- Cung cấp mục tiêu booking trung thực, tuân thủ lịch và community rules.
- Chỉ chia sẻ dữ liệu cần thiết.

### Mentor/HR

- Cung cấp bằng chứng xác minh và lịch chính xác.
- Thực hiện mock interview trong phạm vi đã công bố.
- Gửi feedback có cấu trúc và tuân thủ privacy/community rules.

### Administrator

- Duyệt mentor/câu hỏi, xử lý report và quản lý taxonomy.
- Giữ audit trail cho quyết định moderation và booking exception.

### Nhà cung cấp dịch vụ

- Cung cấp hosting, database, email hoặc video meeting theo SLA/quota.
- Không được xem là nguồn chân lý duy nhất cho booking; hệ thống phải có trạng thái nội bộ và fallback.

## 5. Power–Interest matrix

| Nhóm | Stakeholder | Cách quản lý |
|---|---|---|
| Power cao, Interest cao | Sponsor, Product Owner, Project Manager, Team Lead | Trao đổi thường xuyên; xin quyết định theo milestone và điều phối integration |
| Power cao, Interest thấp | Nhà cung cấp hạ tầng/tích hợp | Theo dõi quota, outage, điều khoản; chuẩn bị fallback |
| Power thấp/trung bình, Interest cao | Team, Student, Mentor, Admin | Đồng thiết kế, demo, research và UAT định kỳ |
| Power thấp, Interest thấp | Công chúng/đối tác tương lai | Theo dõi; cập nhật khi phạm vi mở rộng |

## 6. Vấn đề cần quyết định

- Danh tính Sponsor và acceptance authority chính thức.
- Xác nhận capacity hằng tuần của Tuấn Anh trước khi rebaseline schedule/estimate; không dùng thành viên mới để thêm scope ngầm.
- Phân khúc nghề nghiệp đầu tiên và quy mô pilot.
- Tiêu chí xác minh mentor và policy hủy/no-show.
- Booking miễn phí, trả phí thủ công hay credit trong pilot.
- Dữ liệu nào được công khai, lưu bao lâu và ai có quyền xóa.
- Ngưỡng KPI và điều kiện Go/Pivot/Stop.

## 7. Kế hoạch truyền thông

| Nội dung | Người tham gia | Nhịp | Kênh | Owner |
|---|---|---|---|---|
| Daily coordination | Nhóm dự án | Hằng ngày làm việc | Chat/stand-up | Scrum Master |
| Integration/document-control review | Tuấn Anh và owner từng deliverable | Hai lần/tuần và trước merge | PR + checklist + action items | Tuấn Anh |
| Backlog refinement | PO, BA, team | Mỗi tuần | Công cụ backlog | PO |
| Sprint planning/review/retro | PO và team | Mỗi sprint | Meeting + backlog | Scrum Master |
| Risk/change review | Sponsor, PO, PM, Team Lead | Mỗi tuần hoặc khi vượt ngưỡng | Risk/change log | PM |
| Student research | BA/UX và sinh viên | Theo research plan | Interview/test | Research owner |
| Mentor review | PO/BA và mentor | Trước prototype, pilot | Interview/demo | PO |
| Milestone report | Sponsor và nhóm | Mỗi milestone | Báo cáo ngắn | PM |

### 7.1 Quy tắc truyền thông

- Mọi quyết định scope, acceptance và change phải được ghi trong nguồn dùng chung.
- Không đưa dữ liệu cá nhân hoặc link họp vào kênh công khai.
- Blocker ảnh hưởng sprint goal phải được nêu trong ngày làm việc.
- Research note phải tách nhận định của nhóm khỏi lời/evidence của người tham gia.

