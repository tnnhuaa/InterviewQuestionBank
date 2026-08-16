# Interview Practice Platform — Cost, Time, and Resource Baseline

## 1. Mục đích

Tài liệu ghi planning baseline đã chốt của sáu thành viên và tách capacity khỏi effort estimate. Việc có thêm capacity không tự mở rộng scope; JD-first stories vẫn phải được Development Team Planning Poker trước sprint commitment.

## 2. Baseline phê duyệt

| Hạng mục | Baseline |
|---|---|
| Ngày bắt đầu | 29/06/2026 — planning baseline |
| Ngày kết thúc | 23/08/2026 — planning baseline |
| Thời lượng | 8 tuần — planning baseline |
| Team/capacity | 6 thành viên × 16 giờ/tuần × 8 tuần = 768 giờ danh nghĩa; khoảng 653 giờ sau reserve 15% |
| Working estimate | 606 giờ Bottom-up + Three-point — cần cập nhật từ 20 lên 27 câu chuyện Bắt buộc |
| Guardrail | 650 giờ Top-down — cần cập nhật từ 20 lên 27 câu chuyện Bắt buộc |
| Cash budget trần | 1.125.000 VNĐ — planning baseline |
| Capacity reserve | 15% |
| Cash contingency reserve | 225.000 VNĐ — 25% của 900.000 VNĐ direct cost |
| Management reserve | Chưa phân bổ; chỉ Sponsor được phê duyệt qua change control |
| Baseline owner | Gia Thành — PM/Scrum Master, initiation & estimation; Tuấn Anh — Trưởng nhóm / leadership & governance — theo dõi tác động tích hợp và độ sẵn sàng delivery |
| Người phê duyệt | Ngô Huy Biên và Ngô Ngọc Đăng Khoa — formal signatures pending |

Planning baseline này dùng để lập kế hoạch nội bộ; cam kết dự án chính thức vẫn cần chữ ký Sponsor trên Charter, MVP Scope, WBS cấp deliverable và estimate đã refinement.

Capacity của Tuấn Anh trong vai trò Trưởng nhóm / leadership & governance trước hết được dành cho điều phối nhóm, scope/priority governance, escalation, delivery readiness, integration, document/configuration management, CI quality gate, review và defect xuyên module. Việc thêm feature hoặc đổi mốc release vẫn cần change control và quyết định PO/Sponsor theo Charter.

JD intake, extraction/OCR fallback, requirement analysis, Question mapping và preparation plan làm R1 Must thành 27 câu chuyện/134 initial SP, trong khi hai estimate hiện có dùng 20 câu chuyện. PM/Development Team phải Planning Poker và cập nhật cả hai estimate trước phê duyệt; không dùng 606/650 giờ như commitment cho backlog mới.

## 3. Phân bổ thời gian

| Giai đoạn | Capacity tham chiếu | Start/Finish | Exit criteria |
|---|---:|---|---|
| Discovery/charter | 82 giờ | 29/06–05/07 | JD-preparation problem evidence và charter |
| Prototype/requirement | 81 giờ | 06/07–12/07 | JD-first workflow, backlog và five-screen prototype baseline |
| Foundation | 82 giờ | 13/07–19/07 | Architecture, auth, private storage, CI/CD và data baseline |
| JD intake/analysis/mapping | 81 giờ | 20/07–26/07 | Corrected text, requirement, explainable match và preparation plan pass |
| Mentor Marketplace | 163 giờ | 27/07–09/08 | Question/practice và contextual booking/meeting/feedback loop pass |
| UAT/release | 164 giờ | 10/08–23/08 | UAT, no Critical/High defect, deployment |
| **Tổng** | **653 giờ** | **8 tuần** | Capacity envelope, không phải effort commitment cho backlog mới |

## 4. Ước tính chi phí trực tiếp

| Nhóm | Cơ sở estimate | Baseline (VNĐ) | Actual | Variance |
|---|---|---:|---:|---:|
| Domain | 1 domain/năm cho public pilot | 300.000 | — | — |
| Hosting web/API, database/private storage | Free tier cho development/pilot nhỏ | 0 | — | — |
| JD extraction/OCR | Internal parser/OCR trong quota pilot; external service cần change/ADR | 0 | — | — |
| Email/notification và meeting | Free tier + external meeting link | 0 | — | — |
| Design, CI/CD, repository | Công cụ giáo dục/free tier | 0 | — | — |
| Research/UAT | 12 Student participant-support lượt × 50.000 VNĐ; Mentor pilot tự nguyện | 600.000 | — | — |
| Security/monitoring | Công cụ miễn phí phù hợp MVP | 0 | — | — |
| Contingency | 25% trên 900.000 VNĐ direct cost | 225.000 | — | — |
| **Tổng** | Không vượt budget trần | **1.125.000** | — | — |

## 5. Contingency và kiểm soát chi phí

- Dùng free tier khi vẫn đạt acceptance criteria, security và reliability.
- Nâng cấp trả phí phải có owner, lý do, thời hạn và cách hủy.
- Chi ngoài baseline yêu cầu change request có tác động scope/schedule.
- Reserve chỉ dùng cho risk đã xác định; Management reserve cần Sponsor phê duyệt.
- Theo dõi committed cost và actual cost, không chỉ hóa đơn đã thanh toán.

## 6. Định giá labor

Labor effort phải được ghi riêng cash cost. Nếu môn học yêu cầu quy đổi:

`Labor value = tổng giờ theo vai trò × đơn giá tham chiếu của vai trò`.

Planning baseline dùng giả định học thuật 50.000 VNĐ/giờ. Working estimate 606 giờ tương đương 30.300.000 VNĐ labor value; cộng cash ceiling là 31.425.000 VNĐ economic planning value. Top-down guardrail 650 giờ tương đương 32.500.000 VNĐ labor value. Các số này là mốc so sánh, không phải khoản lương/chi thực tế và phải cập nhật theo 27 câu chuyện Bắt buộc trước khi dùng cho quyết định cam kết.

## 7. Quy tắc theo dõi

- Cập nhật capacity, actual effort và cost ít nhất mỗi sprint.
- Reforecast khi velocity thấp hai sprint, milestone trễ hoặc risk chuyển thành issue.
- Báo Sponsor/PO khi forecast vượt 8 tuần, khoảng 653 giờ capacity, 1.125.000 VNĐ cash ceiling hoặc khi critical PoC/release gate không đạt.
- Cắt Should/Could trước khi ảnh hưởng core loop JD → Preparation Plan → Self-practice/Mentor Booking → Feedback.
- Ghi decision log cho mọi thay đổi baseline.

## 8. Tham chiếu định giá

Nhóm phải thu báo giá/price page chính thức cho domain, hosting, database/private storage, extraction/OCR nếu dùng dịch vụ và email tại thời điểm phê duyệt. Không khóa kiến trúc vào nhà cung cấp chỉ vì free tier nếu chi phí chuyển đổi hoặc rủi ro vận hành cao.

