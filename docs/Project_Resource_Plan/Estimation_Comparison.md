# Estimation Comparison - Interview Practice Platform

## 1. Mục đích và phạm vi

Tài liệu so sánh hai estimate độc lập cho **toàn bộ MVP** đã baseline trong Vision & Scope: 20 Must stories, hoạt động cross-cutting (discovery, architecture, test, deployment/UAT, documentation) và không gồm AI, video tích hợp, payment, mobile native hay ML. Cả hai là forecast tại thời điểm inception, không phải commitment.

## 2. Dữ liệu đầu vào và giả định chung

| Dữ liệu / giả định | Giá trị | Nguồn |
|---|---|---|
| Scope count | 20 Must stories; US-21-23 là Should/Could, không tính vào baseline | Product Backlog |
| Technical scope | Relational DB, RBAC, booking consistency, outbox/retry, external meeting link | Architecture và Feasibility |
| Team capacity | 5 người x 16 giờ x 12 tuần = 960 giờ nominal; 15% reserve = 816 giờ commitment | Resource Plan |
| Contingency | 15% effort cho uncertainty ban đầu | Planning assumption; cone of uncertainty trong lecture |
| Labor rate | 50.000 VND/giờ, chỉ là giá trị học thuật nội bộ | Planning assumption |
| Historical-data limitation | Nhóm chưa có historical actuals của dự án tương tự; vì vậy không dùng estimation by analogy. Hệ số năng suất của phương pháp A là structured expert judgment và phải được recalibrate sau PoC/sprint đầu | Transparency note |

Các tham chiếu học phần: `docs/refs/05-2-introduction-to-software-estimation.md` (slide 006-007, 013-016, 020-024, 030-036, 040, 054), `docs/refs/06-software-project-planning.md` (slide 029 và 031) và `docs/refs/05-1-work-breakdown-structure.md` (slide 019, 025, 033). Chúng yêu cầu estimate size/duration/cost, dùng dữ liệu đếm được và WBS để tăng độ chính xác, đồng thời không nhầm estimate với commitment.

## 3. Phương pháp A - Top-down parametric / Count-Compute + Structured Expert Judgment

### 3.1 Count, rate và hiệu chỉnh

Phương pháp A đếm **20 Must stories** trong Product Backlog rồi compute effort bằng **29 giờ/story**. Hệ số 29 giờ/story là judgment có cấu trúc của nhóm trong planning workshop, dựa trên scope web CRUD/workflow đã baseline; nó không phải actual lịch sử, dữ liệu thị trường, hay dữ liệu của một dự án comparable. Theo thứ tự count → compute → judgment trong tài liệu học phần, đây là top-down parametric sizing có expert judgment, không phải estimation by analogy; nó không thay thế được một analogous estimate khi chưa có actuals của dự án tương tự.

MVP có web CRUD/workflow nhưng có booking transaction, object authorization, notification retry và audit. Ngược lại, nó loại video tích hợp, payment và AI. Các điều chỉnh được ghi tách riêng để PM/PO có thể review và recalibrate:

| Điều chỉnh | Công thức | Giờ |
|---|---:|---:|
| Count-compute base | 20 Must stories x 29 giờ/story | 580 |
| Booking/security/reliability complexity | 25% của 580 giờ | +145 |
| Bỏ built-in video/payment/AI | 12% của 725 giờ | -87 |
| **Top-down expected** | 580 + 145 - 87 | **638** |
| Cross-cutting delivery overhead | 3% x 638, làm tròn (release/UAT/docs chưa hiện diện trong story count) | +19 |
| **Top-down forecast trước contingency** | 638 + 19 | **657 giờ** |
| Contingency | 15% x 657, làm tròn | +99 |
| **Top-down planning estimate** | 657 + 99 | **756 giờ** |

Duration forecast: `756 / (5 x 16 x 0,85) = 11,1 tuần`. Vì vậy phương pháp A phù hợp cửa sổ 12 tuần nhưng chỉ còn khoảng 0,9 tuần buffer; không được thêm scope.

## 4. Phương pháp B - Bottom-up + Three-point

Công thức PERT cho từng epic: **E = (O + 4M + P) / 6**, trong đó O = optimistic, M = most likely, P = pessimistic. Estimate gồm development và công việc cần thiết để bàn giao/kiểm chứng, phù hợp nguyên tắc WBS 100% trong scope.

| Epic / work package | O | M | P | E = (O+4M+P)/6 |
|---|---:|---:|---:|---:|
| Initiation, discovery, requirements baseline | 48 | 64 | 88 | 65 |
| Foundation: architecture, CI/CD, auth/RBAC, data | 64 | 88 | 128 | 91 |
| Question Bank và practice | 64 | 80 | 112 | 83 |
| Mentor profile, verification, availability | 54 | 76 | 110 | 78 |
| Booking, meeting handoff, notification | 88 | 116 | 160 | 119 |
| Feedback, review, admin moderation | 48 | 64 | 96 | 67 |
| Quality, E2E, UAT, deployment | 48 | 60 | 88 | 63 |
| Management, release notes, documentation | 24 | 30 | 48 | 32 |
| **Bottom-up expected effort** |  |  |  | **598 giờ** |
| Contingency | 15% x 598, làm tròn |  |  | **90 giờ** |
| **Bottom-up planning estimate** |  |  |  | **688 giờ** |

Các dòng PERT được làm tròn đến giờ gần nhất để review; tổng 598 giờ khớp bảng Cost-Time-Resources. Duration forecast: `688 / 68 giờ/tuần = 10,1 tuần`, còn khoảng 1,9 tuần buffer trong cửa sổ 12 tuần.

## 5. So sánh và quyết định

| Tiêu chí | Top-down parametric / Count-Compute + expert judgment | Bottom-up + Three-point |
|---|---:|---:|
| Effort trước contingency | 657 giờ | 598 giờ |
| Contingency 15% | 99 giờ | 90 giờ |
| Planning estimate | **756 giờ** | **688 giờ** |
| Duration forecast | 11,1 tuần | 10,1 tuần |
| So với capacity 816 giờ | còn 60 giờ | còn 128 giờ |
| Labor value gồm contingency | 37.800.000 VND | 34.400.000 VND |

Chênh lệch planning estimate là **68 giờ (9,9% so với bottom-up)**. Top-down cao hơn vì rate theo story và complexity factor rộng cho booking/security/reliability tạo guardrail bảo thủ; bottom-up tách work package nên bỏ bớt double counting, nhưng còn rủi ro omission và phụ thuộc độ trưởng thành của backlog/architecture.

**Quyết định:** dùng **688 giờ Bottom-up + Three-point** làm working baseline vì có traceability đến epic/work package. Dùng **756 giờ Top-down parametric** làm guardrail độc lập: nếu reforecast tiến gần 756 giờ, PM phải báo PO/Sponsor, kiểm tra scope/assumption và kích hoạt change control. Cả hai estimate đều nằm dưới 816 giờ commitment; Go chỉ có hiệu lực khi các gate Problem, Supply, Prototype và năm PoC kỹ thuật cũng pass.

## 6. Kế hoạch giảm bất định

1. Sau M2, dùng backlog/prototype được PO chấp nhận để review lại story count, rate judgment và các complexity factor của phương pháp A.
2. Sau M3/M5, ghi actual effort của foundation và booking PoC; cập nhật productivity, PERT ranges và forecast.
3. Cuối mỗi sprint, so actual/carry-over với 68 giờ/tuần capacity commitment. Hai sprint thấp hơn forecast hoặc một critical PoC fail phải reforecast ngay.
4. Chỉ đưa Should/Could vào plan khi Must backlog, reserve và Go/No-Go vẫn an toàn.
