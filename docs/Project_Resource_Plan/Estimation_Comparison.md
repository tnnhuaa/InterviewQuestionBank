# Estimation Comparison - Interview Practice Platform

## 1. Mục đích và phạm vi

Tài liệu so sánh hai estimate độc lập cho **baseline 8 tuần**: core loop JD-to-feedback, các hoạt động cross-cutting (discovery, architecture, test, deployment/UAT, documentation) và không gồm AI, video tích hợp, payment, mobile native hay ML. Cả hai là forecast tại thời điểm inception, không phải commitment.

Để giữ deadline 8 tuần, baseline chỉ nhận các Must story phục vụ core loop; Should/Could và hạng mục không cần cho pilot phải được dời sau release. PM/PO phải re-estimate và rebaseline nếu có thay đổi scope.

**Trạng thái đồng bộ backlog:** các phép tính dưới đây dùng 20 Must story tại thời điểm inception. Product Backlog hiện có 27 story R1 Bắt buộc với 134 SP; vì vậy 606/650 giờ chỉ là working forecast lịch sử và phải được cập nhật bằng Planning Poker, truy vết WBS/PERT và hai phép ước lượng độc lập trước khi cam kết phát hành.

## 2. Dữ liệu đầu vào và giả định chung

| Dữ liệu / giả định | Giá trị | Nguồn |
|---|---|---|
| Scope count | 20 Must stories; JD intake, extraction/OCR, requirement analysis, question mapping và preparation plan được estimate như work package trong scope charter và phải được chi tiết hóa trong backlog | Product Backlog / Project Charter |
| Technical scope | Relational DB, RBAC, booking consistency, outbox/retry, external meeting link | Architecture và Feasibility |
| Team capacity | 6 người x 16 giờ x 8 tuần = 768 giờ nominal; 15% reserve = khoảng 653 giờ commitment | Resource Plan |
| Contingency | 15% effort cho uncertainty ban đầu | Planning assumption; cone of uncertainty trong lecture |
| Labor rate | 50.000 VND/giờ, chỉ là giá trị học thuật nội bộ | Planning assumption |
| Historical-data limitation | Nhóm chưa có historical actuals của dự án tương tự; vì vậy không dùng estimation by analogy. Hệ số năng suất của phương pháp A là structured expert judgment và phải được recalibrate sau PoC/tuần delivery đầu | Transparency note |

Các tham chiếu học phần: `docs/refs/05-2-introduction-to-software-estimation.md` (slide 006-007, 013-016, 020-024, 030-036, 040, 054), `docs/refs/06-software-project-planning.md` (slide 029 và 031) và `docs/refs/05-1-work-breakdown-structure.md` (slide 019, 025, 033). Chúng yêu cầu estimate size/duration/cost, dùng dữ liệu đếm được và WBS để tăng độ chính xác, đồng thời không nhầm estimate với commitment.

## 3. Phương pháp A - Top-down parametric / Count-Compute + Structured Expert Judgment

### 3.1 Count, rate và hiệu chỉnh

Phương pháp A đếm **20 Must stories** trong Product Backlog rồi compute effort bằng **26 giờ/story**. Hệ số 26 giờ/story là judgment có cấu trúc của nhóm trong planning workshop, đã được điều chỉnh cho delivery 8 tuần và scope web CRUD/workflow đã baseline; nó không phải actual lịch sử, dữ liệu thị trường, hay dữ liệu của một dự án comparable. Theo thứ tự count → compute → judgment trong tài liệu học phần, đây là top-down parametric sizing có expert judgment, không phải estimation by analogy; nó không thay thế được một analogous estimate khi chưa có actuals của dự án tương tự.

MVP có web CRUD/workflow nhưng có booking transaction, object authorization, notification retry và audit. Ngược lại, nó loại video tích hợp, payment và AI. Các điều chỉnh được ghi tách riêng để PM/PO có thể review và recalibrate:

| Điều chỉnh | Công thức | Giờ |
|---|---:|---:|
| Count-compute base | 20 Must stories x 26 giờ/story | 520 |
| Booking/security/reliability complexity | 20% của 520 giờ | +104 |
| Bỏ built-in video/payment/AI | 12% của 624 giờ, làm tròn | -75 |
| **Top-down expected** | 520 + 104 - 75 | **549** |
| Cross-cutting delivery overhead | 3% x 549, làm tròn (release/UAT/docs chưa hiện diện trong story count) | +16 |
| **Top-down forecast trước contingency** | 549 + 16 | **565 giờ** |
| Contingency | 15% x 565, làm tròn | +85 |
| **Top-down planning estimate** | 565 + 85 | **650 giờ** |

Duration forecast tham chiếu: `650 / (6 x 16 x 0,85) = 8,0 tuần`. Phương pháp A gần chạm ngưỡng capacity cam kết, vì vậy chỉ dùng làm guardrail: bất kỳ variance hoặc scope bổ sung nào cũng cần reforecast và quyết định PO/Sponsor.

## 4. Phương pháp B - Bottom-up + Three-point

Công thức PERT cho từng epic: **E = (O + 4M + P) / 6**, trong đó O = optimistic, M = most likely, P = pessimistic. Estimate gồm development và công việc cần thiết để bàn giao/kiểm chứng, phù hợp nguyên tắc WBS 100% trong scope.

| Epic / work package | O | M | P | E = (O+4M+P)/6 |
|---|---:|---:|---:|---:|
| Initiation, discovery, requirements baseline | 36 | 48 | 60 | 48 |
| Foundation: architecture, CI/CD, auth/RBAC, data | 54 | 76 | 100 | 76 |
| JD intake, Question Bank và self-practice | 64 | 88 | 116 | 89 |
| Mentor profile, verification, availability | 40 | 56 | 80 | 57 |
| Booking, meeting handoff, notification | 76 | 100 | 140 | 103 |
| Feedback, review, admin moderation | 40 | 52 | 76 | 54 |
| Quality, E2E, UAT, deployment | 48 | 68 | 92 | 69 |
| Management, release notes, documentation | 22 | 30 | 42 | 31 |
| **Bottom-up expected effort** |  |  |  | **527 giờ** |
| Contingency | 15% x 527, làm tròn |  |  | **79 giờ** |
| **Bottom-up planning estimate** |  |  |  | **606 giờ** |

Các dòng PERT được làm tròn đến giờ gần nhất để review; tổng 527 giờ là working estimate cho core loop. Duration forecast tham chiếu: `606 / 81,6 giờ/tuần = 7,4 tuần`, còn khoảng 47 giờ trong capacity commitment của cửa sổ 8 tuần.

## 5. So sánh và quyết định

| Tiêu chí | Top-down parametric / Count-Compute + expert judgment | Bottom-up + Three-point |
|---|---:|---:|
| Effort trước contingency | 565 giờ | 527 giờ |
| Contingency 15% | 85 giờ | 79 giờ |
| Planning estimate | **650 giờ** | **606 giờ** |
| Duration forecast tham chiếu với 6 người | 8,0 tuần | 7,4 tuần |
| So với capacity ~653 giờ | còn 3 giờ | còn 47 giờ |
| Labor value gồm contingency | 32.650.000 VND | 30.300.000 VND |

Chênh lệch planning estimate là **44 giờ (7,3% so với bottom-up)**. Top-down cao hơn vì rate theo story và complexity factor rộng cho booking/security/reliability tạo guardrail bảo thủ; bottom-up tách work package nên bỏ bớt double counting, nhưng còn rủi ro omission và phụ thuộc độ trưởng thành của backlog/architecture.

**Quyết định tại thời điểm inception:** dùng **606 giờ Bottom-up + Three-point** làm working forecast cho core loop 8 tuần vì có traceability đến epic/work package; dùng **650 giờ Top-down parametric** làm guardrail độc lập. Hai số này chưa phải baseline cam kết cho backlog 27 story/134 SP. Không được suy diễn 47 giờ buffer là capacity cho scope mới; lần re-estimate phải cập nhật WBS/PERT, top-down count và được PO/Sponsor phê duyệt trước Go.

## 6. Kế hoạch giảm bất định

1. Sau M2, dùng backlog/prototype được PO chấp nhận để review lại story count, rate judgment và các complexity factor của phương pháp A.
2. Sau M3/M5, ghi actual effort của foundation và booking PoC; cập nhật productivity, PERT ranges và forecast.
3. Cuối mỗi tuần, so actual nếu có và số công việc Done với 81,6 giờ/tuần capacity commitment. Một tuần thấp hơn forecast hoặc một critical PoC fail phải reforecast ngay vì buffer của kế hoạch 8 tuần rất nhỏ.
4. Chỉ đưa Should/Could vào plan khi Must backlog, reserve và Go/No-Go vẫn an toàn.
