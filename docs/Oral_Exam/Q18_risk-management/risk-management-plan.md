# Software Risk Management Plan

## 1. Mục tiêu

Kế hoạch quản lý rủi ro được tạo để nhóm chủ động nhận diện những yếu tố không chắc chắn có thể ảnh hưởng đến phạm vi, tiến độ, chất lượng, chi phí và khả năng vận hành của dự án; sau đó đánh giá mức độ ưu tiên và chuẩn bị phương án xử lý trước khi rủi ro trở thành vấn đề thực tế.

Trong tài liệu môn học, Risk Analysis được mô tả theo hướng: xác định các vùng bất định có thể trở thành nguồn rủi ro đáng kể của dự án, sau đó xây dựng chiến lược có chi phí hợp lý để giải quyết chúng. Các biện pháp có thể bao gồm prototype, simulation, benchmarking, reference checking, questionnaire hoặc analytic modelling. Với Scrum, rủi ro cần được đánh giá liên tục, lập response và được review lại trong Sprint Review.

## 2. Phương pháp đánh giá

Nhóm sử dụng đánh giá định tính theo hai yếu tố:

- **Probability (P):** khả năng rủi ro xảy ra — Low / Medium / High.
- **Impact (I):** mức ảnh hưởng nếu rủi ro xảy ra — Low / Medium / High.

Mức ưu tiên được xác định dựa trên tổ hợp **P × I**, kết hợp với thời điểm rủi ro có thể xuất hiện và các dấu hiệu cảnh báo sớm. Risk Register được xem lại trong quá trình thực hiện dự án thay vì chỉ lập một lần ở đầu dự án.

Mỗi rủi ro gồm các thông tin:

1. Risk ID và mô tả rủi ro.
2. Probability.
3. Impact.
4. Transition indicator / dấu hiệu cảnh báo.
5. Mitigation — hành động giảm xác suất hoặc ảnh hưởng trước khi rủi ro xảy ra.
6. Contingency — phương án thực hiện nếu rủi ro thực sự xảy ra.

## 3. Risk Register

| ID | Rủi ro | P | I | Transition indicator | Mitigation | Contingency |
|---|---|---|---|---|---|---|
| R1 | Không tuyển đủ mentor cho pilot | H | H | Số mentor xác nhận thấp hơn mục tiêu discovery | Tiếp cận alumni, CLB, giảng viên và người đi làm từ sớm; giới hạn số lĩnh vực pilot | Chạy concierge pilot với số mentor nhỏ và lịch theo đợt |
| R2 | Sinh viên xem câu hỏi nhưng không đặt mentor | M | H | Conversion từ question bank sang xem/đặt mentor thấp | Phỏng vấn nguyên nhân, làm rõ giá trị feedback, gắn CTA theo chủ đề yếu | Thu hẹp business hypothesis hoặc thử buổi nhóm/peer trước |
| R3 | Chất lượng mentor/feedback không đồng đều | M | H | Rating thấp, complaint hoặc feedback thiếu hành động | Xác minh hồ sơ, rubric, mẫu feedback và hướng dẫn mentor | Tạm ẩn mentor, review thủ công, hoàn credit theo policy |
| R4 | No-show, hủy muộn hoặc trùng lịch | M | H | Tỷ lệ booking không diễn ra vượt ngưỡng | Lock time slot, nhắc lịch, cancellation policy và timezone rõ ràng | Cho đổi lịch, admin xử lý tranh chấp, ghi nhận reliability |
| R5 | Scope creep sang AI, video và payment | H | H | Story ngoài MVP liên tục được đưa vào sprint | Baseline MVP, backlog future, change control và PO approval | Loại/defer story có giá trị thấp để bảo vệ Sprint Goal |
| R6 | Câu hỏi sai, lỗi thời hoặc vi phạm bản quyền | M | H | Report nội dung hoặc không xác định được nguồn | Nội dung do nhóm/mentor biên soạn, review và lưu provenance | Gỡ nội dung, sửa/đổi câu hỏi, khóa contributor vi phạm |
| R7 | Rò rỉ dữ liệu cá nhân hoặc link họp | L–M | H | Truy cập trái phép hoặc log chứa dữ liệu nhạy cảm | Least privilege, validation, secret management, privacy-by-design | Thu hồi link/token, thông báo sự cố, vá lỗi và audit |
| R8 | Phụ thuộc email/calendar/hosting bên thứ ba | M | M | Quota, outage hoặc thay đổi API | Adapter, theo dõi quota, fallback in-app notification | Chuyển nhà cung cấp hoặc dùng quy trình thủ công tạm thời |
| R9 | Ước lượng thấp hơn effort thực tế | M | H | Velocity thấp liên tiếp, nhiều story carry-over | WBS, Planning Poker, reserve và spike cho phần chưa biết | Re-estimate, giảm scope theo ưu tiên, cập nhật release plan |
| R10 | Thiếu user cho UAT hoặc dữ liệu đánh giá | M | H | Không đủ người đăng ký test trước mốc UAT | Tuyển người tham gia từ discovery, đặt lịch test sớm | Usability test có kiểm soát và kéo dài pilot sau môn học |
| R11 | Review/đánh giá gây tranh chấp hoặc ảnh hưởng danh tiếng | M | M | Khiếu nại về nội dung không công bằng | Chỉ review từ booking hợp lệ, community guidelines, quyền report | Ẩn review trong lúc kiểm tra và có quy trình appeal |
| R12 | Thành viên thiếu thời gian/kỹ năng | M | H | Blocker kéo dài, task quá hạn, phụ thuộc một người | Skill matrix, pair work, chia sẻ knowledge, giới hạn WIP | Điều phối lại work package và giảm scope không cốt lõi |

## 4. Risk Response Strategy

- **Avoid:** loại khỏi MVP các hạng mục có rủi ro/effort cao nhưng chưa cần thiết như video call, AI interviewer và payout tự động.
- **Mitigate:** thực hiện PoC sớm cho booking concurrency, permission và notification để giảm technical risk.
- **Contain:** giữ schedule/cost reserve sau khi có estimate nhằm hấp thụ biến động nhỏ mà không phá vỡ commitment.
- **Accept:** chấp nhận một số thao tác admin/đối soát thủ công trong pilot nếu có owner và quy trình rõ ràng.

## 5. Nguồn tham khảo môn học liên quan

- `docs/refs/04-01-software-development-models.md` — Slide 048 Risk Analysis: identify significant sources of project risk và formulate cost-effective strategies để resolve risk; có đề cập prototyping, simulation, benchmarking, reference checking, questionnaires và analytic modelling.
- `docs/refs/04-02-scrum-development-process.md` — Slides 054–055: risks affecting project success are continuously assessed and responses planned; management và team jointly manage risks và review controls tại Sprint Review.
- `docs/refs/03-software-project-initiation.md` — Feasibility Study giúp identify và plan for risks.
- `docs/refs/06-1-agile-planning.md` — assessment of risk and appropriate risk controls trong planning.
