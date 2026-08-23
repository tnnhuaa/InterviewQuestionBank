# PROJECT CHARTER - INTERVIEW PRACTICE PLATFORM

## 1. Thông tin kiểm soát

| Thuộc tính | Giá trị |
| --- | --- |
| Sponsor | Giảng viên Ngô Huy Biên và Ngô Ngọc Đăng Khoa (phê duyệt ở mốc Go/No-Go) |
| Product Owner | Hưng - Vision, scope và backlog |
| Project Manager / Team Leader / Timekeeper | Tuấn Anh - điều hành nhóm, quản lý thời gian, Kanban, escalation và delivery |
| Project Planning & Estimation Analyst / Full-stack Developer | Gia Thành - lập baseline, nguồn lực, chi phí, ước lượng và tham gia implementation |
| Nhóm thực hiện | Gia Thành, Hùng, Hưng, Trí, Luân, Tuấn Anh |
| Phiên bản | 1.0 - planning baseline |
| Ngày baseline | 14/08/2026 |
| Thời gian đề xuất | 29/06/2026-23/08/2026 (8 tuần) |
| Trạng thái | Chờ Sponsor/giảng viên phê duyệt để trở thành cam kết |

## 2. Bối cảnh, mục tiêu và phạm vi

Sinh viên Việt Nam thường đọc một mô tả công việc cụ thể (Job Description - JD) nhưng không biết cần ôn kiến thức, kỹ năng và câu hỏi nào để chuẩn bị phỏng vấn. Họ phải tự ghép các nguồn câu hỏi, tài liệu, kênh tìm mentor, lịch và feedback; vì vậy MVP cần tạo vòng lặp **JD -> extract/OCR -> phân tích yêu cầu -> mapping Question Bank -> kế hoạch ôn -> self-practice hoặc booking mentor -> mock interview -> feedback -> luyện lại**, giúp giảm ma sát điều phối và tạo bằng chứng cho quyết định có nên mở rộng sản phẩm hay không.

Mục tiêu của dự án là bàn giao web MVP có thể pilot cho ba vai trò Student, Mentor và Admin. Thành công ở cấp dự án được đánh giá bằng các điều kiện sau:

| Mục tiêu | Chỉ số / điều kiện thành công |
| --- | --- |
| Xác nhận vấn đề | Ít nhất 70% mẫu discovery xác nhận một pain cốt lõi |
| Khả năng dùng | Ít nhất 80% phiên usability test tìm được câu hỏi phù hợp trong median <= 2 phút và tạo được booking hợp lệ |
| Giá trị vận hành | Ít nhất 80% booking đã xác nhận diễn ra; ít nhất 90% booking hoàn thành có feedback gồm điểm mạnh, điểm yếu và hành động tiếp theo |
| Chất lượng kỹ thuật | 100% critical workflow test pass; không còn defect Critical/High trước UAT |

MVP bao gồm authentication/RBAC, JD ingestion, text extraction/OCR, requirement analysis, taxonomy normalization, question mapping, preparation plan, Question Bank, mentor profile/verification/availability, booking, meeting link ngoài hệ thống, feedback/review, admin tối thiểu và notification. AI interviewer, video/recording tích hợp, payment/payout, mobile native, ATS và ML recommendation nằm ngoài phạm vi.

## 3. Tổ chức và trách nhiệm

| Thành viên | Vai trò chính | Trách nhiệm / đầu ra |
| --- | --- | --- |
| Tuấn Anh | Project Manager / Team Leader / Timekeeper | Phân vai, giao việc, quản lý deadline và Kanban, chốt quyết định, escalation, review/merge và xác nhận Done |
| Gia Thành | Project Planning & Estimation Analyst / Full-stack Developer | Charter, Resource Plan, Cost-Time-Resources, hai estimate độc lập; phát triển mentor verification, availability, JD service và notification |
| Hưng | Product Owner / Business Analyst | Vision & Scope, Product Backlog, acceptance criteria, Future-State Workflow và chấp nhận User Story |
| Luân | Architecture / Technical Lead | Technology stack, ADR, architecture và hỗ trợ kỹ thuật cho PoC/implementation |
| Hùng | UI/UX Designer / Front-end Developer | Clickable prototype, workflow, bằng chứng usability và giao diện front-end |
| Trí | PoC / Integration & E2E Developer | PoC core flow, dữ liệu seed, tích hợp, kiểm thử đầu-cuối và bằng chứng rủi ro kỹ thuật |

Sponsor phê duyệt charter, phạm vi baseline và thay đổi lớn. Tuấn Anh giữ quyền điều hành dự án: phân vai, giao việc, quản lý deadline và luồng Kanban, xử lý escalation và chốt delivery. Gia Thành lập, phân tích và cập nhật dữ liệu planning/estimation để PM ra quyết định, đồng thời tham gia phát triển Full-stack. Product Owner ưu tiên backlog và chấp nhận User Story. Quyết định kỹ thuật phải tuân theo architecture/ADR đã được chấp nhận.

## 4. Giả định và ràng buộc

### Giả định planning

- Có 6 thành viên, mỗi người cam kết trung bình 16 giờ/tuần trong 8 tuần.
- Nhóm dành 15% capacity cho học tập, review, nghỉ và rủi ro; chỉ khoảng 653 giờ được xem là capacity cam kết.
- Có đủ sinh viên và mentor cho discovery, prototype test và pilot nhỏ.
- MVP dùng Google Meet, Zoom hoặc link họp ngoài; free tier đáp ứng phát triển và pilot nhỏ.
- Question, JD mẫu và dữ liệu pilot được nhóm/mentor biên soạn hợp pháp, có provenance.

### Ràng buộc

- Không phát triển AI, video tích hợp hoặc payment trong release này nếu không có change request được Sponsor/PO phê duyệt.
- Booking, meeting link, feedback và bằng chứng mentor là dữ liệu riêng tư; phải kiểm soát truy cập theo role và ownership.
- Booking phải chống double booking; notification lỗi không được rollback nghiệp vụ đã commit.
- Capacity là bán thời gian; không dùng overtime kéo dài để bù kế hoạch.

## 5. Milestone và lịch baseline

| Mốc | Thời gian | Exit criteria |
| --- | --- | --- |
| M1 - Discovery/Charter | 29/06-05/07 | Stakeholder map, problem evidence, charter và resource baseline được duyệt |
| M2 - Requirement/Prototype baseline | 06/07-12/07 | Vision, workflow, backlog, acceptance criteria và prototype được PO chấp nhận |
| M3 - Foundation | 13/07-19/07 | ADR/architecture, CI/CD, auth/RBAC và dữ liệu nền hoạt động |
| M4 - JD intake & analysis | 20/07-26/07 | Nhập JD, extract/OCR, xác nhận text, taxonomy mapping và preparation plan pass acceptance criteria |
| M5 - Mentor Marketplace core loop | 27/07-09/08 | Mentor, availability, booking, meeting handoff, feedback và notification chạy end-to-end |
| M6 - UAT/Release | 10/08-23/08 | Critical tests pass, không còn Critical/High defect, UAT evidence và triển khai pilot sẵn sàng |

## 6. Go/No-Go

| Gate | Quyết định Go khi | No-Go/Pivot khi |
| --- | --- | --- |
| G1 - Problem | Pain được discovery xác nhận và có hành vi hiện tại cần cải thiện | Chỉ có ý kiến chung, không có nhu cầu thực |
| G2 - Supply | Có mentor Approved và slot đủ cho pilot | Không tuyển được supply đúng phân khúc |
| G3 - Prototype | >=80% người thử hoàn tất tìm câu hỏi và booking không cần hỗ trợ lớn | Luồng vẫn khó hiểu hoặc không tạo được booking hợp lệ |
| G4 - Technical | Năm PoC: double booking, authorization, transition/audit, filter và notification retry đều pass | Còn access leak hoặc booking không nhất quán |
| G5 - Delivery | Forecast đã rebaseline cho scope JD <= khoảng 653 giờ capacity cam kết, cash cost <= 1.125.000 VND | Core loop vượt capacity/budget hoặc phải cắt kiểm soát chất lượng |
| G6 - Pilot | Booking diễn ra, feedback hữu ích và có tín hiệu quay lại | Conversion/completion/value quá thấp sau pilot |

## 7. Tham chiếu

- `docs/refs/03-software-project-initiation.md`, slide 008: Charter phải nêu bối cảnh, governance, nguồn lực, milestone, impact, assumptions và phê duyệt.
- `docs/Project_Vision_and_Scope/Project_Vision_and_Scope.md`: product goal, phạm vi MVP và ràng buộc.
- `docs/Project_Feasibility/feasibility.md`: sáu Go/No-Go gates và năm điều kiện PoC.
