# Interview Practice Platform — Cost, Time, and Resource Baseline

## 1. Mục đích

Tài liệu ghi planning baseline của sáu thành viên và tách capacity khỏi effort estimate. Việc có thêm capacity không tự mở rộng scope; scope JD-first phải được re-estimate và Sponsor/PO phê duyệt trước khi baseline trở thành commitment.

## 2. Baseline phê duyệt

| Hạng mục | Baseline |
|---|---|
| Ngày bắt đầu | 17/08/2026 — proposed |
| Ngày kết thúc | 08/11/2026 — proposed |
| Thời lượng | 12 tuần — proposed baseline |
| Team/capacity | 6 thành viên × 16 giờ/tuần × 12 tuần = 1.152 giờ danh nghĩa; khoảng 979 giờ sau reserve 15% |
| Cash budget trần | 1.125.000 VNĐ — proposed, Sponsor acceptance pending |
| Capacity reserve | 15% |
| Cash contingency reserve | 225.000 VNĐ — 25% của 900.000 VNĐ direct cost |
| Management reserve | Chưa phân bổ; chỉ Sponsor được phê duyệt qua change control |
| Baseline owner | Gia Thành — PM/Scrum Master; Tuấn Anh theo dõi integration impact |
| Người phê duyệt | Sponsor/giảng viên — approval pending |

Baseline chỉ có hiệu lực khi Charter, MVP Scope, WBS cấp deliverable và estimate được phê duyệt.

Capacity của Tuấn Anh trước hết được dành cho integration, document/configuration management, CI quality gate, review và defect xuyên module. Việc thêm feature hoặc đổi mốc release vẫn cần change control và PO/Sponsor approval.

JD intake, extraction/OCR fallback, requirement analysis, Question mapping và preparation plan làm R1 Must tăng từ 92 lên 134 initial SP. Tỷ lệ/effort cũ chưa bao gồm 42 SP này và không được dùng làm commitment cho scope mới; PM/Development Team phải Planning Poker và rebaseline trước phê duyệt.

## 3. Phân bổ thời gian

| Giai đoạn | Capacity tham chiếu | Start/Finish | Exit criteria |
|---|---:|---|---|
| Discovery/charter | 163 giờ | 17/08–30/08 | JD-preparation problem evidence và charter |
| Prototype/requirement | 163 giờ | 31/08–13/09 | JD-first workflow, backlog và five-screen prototype baseline |
| Foundation | 163 giờ | 14/09–27/09 | Architecture, auth, private storage, CI/CD và data baseline |
| JD intake/analysis/mapping | 163 giờ | 28/09–11/10 | Corrected text, requirement, explainable match và preparation plan pass |
| Mentor Marketplace | 245 giờ | 12/10–01/11 | Question/practice và contextual booking/meeting/feedback loop pass |
| UAT/release | 82 giờ | 02/11–08/11 | UAT, no Critical/High defect, deployment |
| **Tổng** | **979 giờ** | **12 tuần** | Capacity envelope, không phải effort commitment cho backlog mới |

## 4. Ước tính chi phí trực tiếp

| Nhóm | Cơ sở estimate | Baseline (VNĐ) | Actual | Variance |
|---|---|---:|---:|---:|
| Domain | 1 domain/năm cho public pilot | 300.000 | — | — |
| Hosting web/API, database/private storage | Free tier cho development/pilot nhỏ | 0 | — | — |
| JD extraction/OCR | Internal parser/OCR trong quota pilot; external service cần change/ADR | 0 | — | — |
| Email/notification và meeting | Free tier + external meeting link | 0 | — | — |
| Design, CI/CD, repository | Công cụ giáo dục/free tier | 0 | — | — |
| Research/UAT | 12 lượt cảm ơn × 50.000 VNĐ | 600.000 | — | — |
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

Planning baseline dùng giả định học thuật 50.000 VNĐ/giờ. Estimate 688 giờ trước JD-first tương đương 34.400.000 VNĐ labor value; cộng cash ceiling là 35.525.000 VNĐ economic planning value. Các số này là mốc so sánh, không phải khoản lương/chi thực tế và không được dùng làm commitment cho backlog JD-first trước khi re-estimate.

## 7. Quy tắc theo dõi

- Cập nhật capacity, actual effort và cost ít nhất mỗi sprint.
- Reforecast khi velocity thấp hai sprint, milestone trễ hoặc risk chuyển thành issue.
- Báo Sponsor/PO khi forecast vượt 12 tuần, khoảng 979 giờ capacity, 1.125.000 VNĐ cash ceiling hoặc khi critical PoC/release gate không đạt.
- Cắt Should/Could trước khi ảnh hưởng core loop JD → Preparation Plan → Self-practice/Mentor Booking → Feedback.
- Ghi decision log cho mọi thay đổi baseline.

## 8. Tham chiếu định giá

Nhóm phải thu báo giá/price page chính thức cho domain, hosting, database/private storage, extraction/OCR nếu dùng dịch vụ và email tại thời điểm phê duyệt. Không khóa kiến trúc vào nhà cung cấp chỉ vì free tier nếu chi phí chuyển đổi hoặc rủi ro vận hành cao.

