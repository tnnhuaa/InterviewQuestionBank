# Software Risk Management Plan

## 1. Mục tiêu

Kế hoạch quản lý rủi ro giúp nhóm chủ động nhận diện các yếu tố không chắc chắn có thể ảnh hưởng đến phạm vi, tiến độ, chất lượng, chi phí và khả năng vận hành của dự án; sau đó ưu tiên rủi ro, chuẩn bị hành động phòng ngừa và phương án xử lý nếu rủi ro thực sự xảy ra.

Risk Management Plan được xem là **living document** và được cập nhật trong quá trình thực hiện dự án dựa trên evidence thực tế từ luồng công việc Kanban, user testing, pilot và các dependency bên ngoài.

## 2. Phương pháp đánh giá

### 2.1. Nhận diện và phân loại

Nhóm xem lại Project Proposal, Feasibility Study, MVP Scope, requirement và các giả định cần xác thực để nhận diện risk.

Risk được phân loại theo các nhóm chính: **Business/Market, Scope, Technical, Schedule, People/Resource, Operational, Quality/Content, Security/Privacy và External Dependency**.

### 2.2. Probability × Impact

Nhóm đánh giá định tính theo hai yếu tố:

- **Probability (P):** Low = 1, Medium = 2, High = 3.
- **Impact (I):** Low = 1, Medium = 2, High = 3.

**Risk Score = P × I**.

| Score | Priority | Ý nghĩa |
|---|---|---|
| 1–2 | Low | Theo dõi, chưa cần hành động đặc biệt |
| 3–4 | Medium | Có mitigation và theo dõi trong luồng Kanban |
| 6 | High | Ưu tiên xử lý sớm và theo dõi thường xuyên |
| 9 | Critical | Phải có hành động ngay để tránh ảnh hưởng MVP hoặc luồng công việc ưu tiên |

Risk Register được review khi có evidence mới hoặc khi transition indicator đạt ngưỡng đã xác định.

### 2.3. Thông tin của một risk

Mỗi risk gồm:

1. **Risk ID** và Category.
2. Mô tả risk.
3. Probability và Impact.
4. Risk Score / Priority.
5. **Transition indicator** — dấu hiệu đo được cho thấy risk đang bắt đầu xảy ra.
6. **Mitigation** — hành động thực hiện trước để giảm xác suất hoặc ảnh hưởng.
7. **Contingency** — hành động cụ thể được kích hoạt khi risk đã xảy ra.
8. **Owner** — role chịu trách nhiệm theo dõi risk và kích hoạt response.

## 3. Risk Register

| ID | Category | Rủi ro | P | I | Score / Priority | Transition indicator | Mitigation | Contingency | Owner |
|---|---|---|---|---|---|---|---|---|---|
| R1 | Business / Resource | Không tuyển đủ mentor cho pilot | H | H | 9 / Critical | Trước pilot 2 tuần, số mentor xác nhận < 70% mục tiêu pilot | Tiếp cận alumni, CLB, giảng viên và người đi làm từ sớm; giới hạn số lĩnh vực pilot | Giảm số chủ đề pilot theo số mentor thực có, gom booking vào các khung giờ cố định và chỉ mở booking cho những mentor đã xác nhận | PO / Business |
| R2 | Business / Market | Sinh viên xem câu hỏi nhưng không đặt mentor | M | H | 6 / High | Sau pilot đầu tiên, < 10% user đã luyện câu hỏi tiếp tục mở hoặc gửi booking mentor | Phỏng vấn nguyên nhân, làm rõ giá trị feedback và đặt CTA sau các chủ đề user làm chưa tốt | Tạm dừng mở rộng mentor marketplace; giữ Question Bank là core flow và chạy 1 vòng user interview để xác định lại nhu cầu trước khi tiếp tục đầu tư booking | PO / UX |
| R3 | Quality / Operational | Chất lượng mentor hoặc feedback không đồng đều | M | H | 6 / High | Có ≥ 2 complaint tương tự hoặc mentor nhận rating < 3/5 trong pilot | Xác minh hồ sơ, dùng rubric và mẫu feedback; hướng dẫn mentor trước khi nhận booking | Tạm ngừng booking mới của mentor đó, kiểm tra các session bị complaint và chuyển các booking chưa diễn ra sang mentor khác phù hợp | Mentor Ops |
| R4 | Operational | No-show, hủy muộn hoặc trùng lịch | M | H | 6 / High | No-show/cancel-late > 15% booking hoặc xuất hiện 1 double-booking | Lock time slot khi booking được xác nhận; reminder; cancellation rule và timezone rõ ràng | Với double-booking: giữ booking được xác nhận trước và chuyển booking còn lại sang slot/mentor khác; với no-show: cho phép reschedule 1 lần và giải phóng slot ngay | Booking Owner |
| R5 | Scope | Scope creep sang AI, video và payment | H | H | 9 / Critical | Có ≥ 2 work item ngoài MVP được đưa vào luồng In Progress hoặc làm WIP vượt giới hạn đã đặt | Baseline MVP, future backlog, change control và approval của Project Lead | Đưa toàn bộ work item ngoài MVP trở lại future backlog; nếu WIP đã vượt giới hạn thì dừng pull item mới và defer item chưa bắt đầu có priority thấp nhất để bảo vệ core MVP | Project Lead |
| R6 | Quality / Content | Câu hỏi sai, lỗi thời hoặc vi phạm bản quyền | M | H | 6 / High | Có report nội dung, reviewer không xác minh được nguồn, hoặc phát hiện nội dung copy nguyên văn không được phép | Nội dung do nhóm/mentor biên soạn; review trước khi publish; lưu provenance/source | Unpublish câu hỏi bị report ngay, thay bằng câu hỏi đã review; nếu cùng contributor vi phạm lặp lại thì khóa quyền đóng góp nội dung | Content Owner |
| R7 | Security / Privacy | Rò rỉ dữ liệu cá nhân hoặc link họp | L | H | 3 / Medium | Phát hiện truy cập không đúng quyền, link/token bị chia sẻ ngoài booking hoặc log chứa dữ liệu nhạy cảm | Least privilege, validation, secret management và privacy-by-design | Thu hồi ngay link/token bị lộ, revoke session liên quan và tạm khóa endpoint/chức năng gây lộ; sửa access rule hoặc logging config, kiểm tra lại bằng test quyền truy cập rồi mới mở lại | Backend / Security |
| R8 | External Dependency | Email/calendar/hosting bên thứ ba bị outage, quota hoặc thay đổi API | M | M | 4 / Medium | API trả lỗi liên tục ≥ 15 phút, quota đạt > 80%, hoặc integration test fail sau API change | Adapter cho integration; theo dõi quota; không phụ thuộc notification ngoài cho trạng thái booking chính | Disable integration đang lỗi nhưng vẫn cho tạo/xem booking trong hệ thống; admin lấy danh sách booking bị ảnh hưởng, gửi thông báo trực tiếp cho user và cập nhật lịch bằng tay cho các booking đó cho đến khi integration hoạt động lại | Backend / DevOps |
| R9 | Schedule / Estimation | Effort thực tế cao hơn estimate | M | H | 6 / High | Cycle time tăng liên tục, throughput giảm trong 2 kỳ review liên tiếp hoặc số blocked item vượt ngưỡng WIP | WBS, relative estimation khi cần, capacity reserve và spike cho phần chưa biết | Re-estimate các work item chưa hoàn thành, tách item quá lớn và defer item ngoài core MVP theo priority thấp nhất cho đến khi WIP và cycle time quay về mức kiểm soát | Project Lead / Team |
| R10 | Resource / Validation | Thiếu user cho UAT hoặc dữ liệu đánh giá | M | H | 6 / High | Trước UAT 1 tuần, số participant xác nhận < 70% mục tiêu test | Tuyển participant từ discovery; đặt lịch UAT sớm và có danh sách dự phòng | Chuyển UAT sang các core workflow trước, phân bổ participant hiện có để mỗi workflow quan trọng vẫn có người test; các workflow phụ chưa đủ mẫu được ghi nhận là chưa đủ evidence và chuyển sang vòng test bổ sung sau | UX / QA |
| R11 | Operational / Reputation | Review gây tranh chấp hoặc ảnh hưởng danh tiếng | M | M | 4 / Medium | Có report review về nội dung công kích, sai sự thật hoặc không liên quan đến session | Chỉ cho review từ booking hoàn tất; community guidelines và quyền report | Ẩn review bị report khỏi public view, lưu lại để kiểm tra; chỉ publish lại nếu hợp lệ, nếu không thì xóa và cảnh báo tài khoản vi phạm | Admin / Mentor Ops |
| R12 | People / Resource | Thành viên thiếu thời gian hoặc kỹ năng | M | H | 6 / High | Task critical bị blocked > 2 ngày, số blocked item tăng liên tiếp hoặc chỉ một người có thể xử lý module quan trọng | Skill matrix, pair work, knowledge sharing và giới hạn WIP | Chuyển task critical cho người có năng lực gần nhất, pair với thành viên còn thiếu kỹ năng và defer task non-core để không làm trễ critical path | Project Lead / Team |

## 4. Risk Response Strategy

- **Avoid:** loại khỏi MVP những hạng mục có risk/effort cao nhưng chưa cần thiết, ví dụ video call, AI interviewer và payout tự động.
- **Mitigate:** thực hiện PoC, validation hoặc process control sớm để giảm Probability hoặc Impact, ví dụ test booking concurrency, permission và notification.
- **Transfer:** với dependency bên ngoài, cô lập integration qua adapter và có khả năng chuyển provider khi chi phí thay đổi thấp hơn việc tự xây lại toàn bộ chức năng.
- **Accept:** chấp nhận một số giới hạn có chủ đích trong pilot, ví dụ một số thao tác admin thực hiện thủ công, nhưng phải có owner, trigger và contingency rõ ràng.

## 5. Theo dõi và cập nhật

Risk Register không được lập một lần rồi giữ nguyên. Trong quá trình thực hiện dự án:

1. Risk Owner theo dõi transition indicator của risk được giao.
2. Khi có evidence mới, nhóm xem lại Probability, Impact và Priority.
3. Nếu indicator đạt ngưỡng nhưng risk chưa xảy ra, nhóm tăng cường mitigation.
4. Nếu risk đã xảy ra, contingency tương ứng được kích hoạt.
5. Nếu risk ảnh hưởng backlog, WIP, cycle time, throughput hoặc release plan, Project Lead/Team cập nhật priority và scope tương ứng.

Các evidence được dùng để review risk gồm cycle time, throughput, WIP, blocked items, defect, số mentor/user tuyển được, booking conversion, complaint, no-show, UAT participation, outage và quota của dịch vụ ngoài.
