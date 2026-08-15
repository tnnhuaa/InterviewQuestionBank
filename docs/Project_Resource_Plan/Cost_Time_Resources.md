# Cost, Time and Resources Baseline - Interview Practice Platform

## 1. Baseline được đề xuất

| Hạng mục | Baseline planning |
|---|---|
| Start / finish | 17/08/2026-08/11/2026 |
| Thời lượng | 12 tuần, 6 giai đoạn theo Project Charter |
| Team / capacity | 6 người x 16 giờ/tuần x 12 tuần = 1.152 giờ danh nghĩa; khoảng 979 giờ cam kết sau reserve 15% |
| Estimate điều hành hiện hữu | Bottom-up + Three-point: 598 giờ expected, 688 giờ sau contingency 15% (chỉ là mốc tham chiếu trước khi rebaseline scope JD) |
| Cross-check hiện hữu | Top-down parametric Count-Compute + structured expert judgment: 657 giờ, 756 giờ sau contingency 15% (không phải analogous vì chưa có comparable-project actuals; cần rebaseline cho scope JD) |
| Cash budget ceiling | **1.125.000 VND** |
| Labor value tham chiếu | 688 giờ x 50.000 VND/giờ = **34.400.000 VND** |
| Total economic planning value | **35.525.000 VND** (= cash + labor value) |

Labor value chỉ dùng để so sánh phương án và không phải khoản nhóm phải chi. Đơn giá 50.000 VND/giờ là **giả định học thuật thống nhất của nhóm**, không phải báo giá thị trường hay lương thực tế; phải thay bằng báo giá/đơn giá được Sponsor chấp nhận nếu dự án chuyển thành triển khai thương mại.

JD intake, extraction/OCR, requirement analysis, question mapping và preparation plan là scope mới. Các con số 598/688/657/756 ở trên chưa bao gồm các story JD dự kiến bổ sung, nên không được dùng làm commitment cho scope mới; PM/PO phải re-estimate và rebaseline sau khi backlog được cập nhật/phê duyệt.

## 2. Lịch và tolerance

| Giai đoạn | Thời gian | Exit criteria |
|---|---|---|
| Discovery/charter | 17/08-30/08 | Problem evidence, charter, resource baseline |
| Prototype/requirements | 31/08-13/09 | Workflow, backlog, prototype được chấp nhận |
| Foundation | 14/09-27/09 | Architecture, auth, CI/CD, data foundation |
| JD intake & analysis | 28/09-11/10 | Nhập JD, extract/OCR, xác nhận text, taxonomy mapping và preparation plan pass |
| Marketplace | 12/10-01/11 | Booking-to-feedback E2E pass |
| UAT/release | 02/11-08/11 | UAT evidence, zero Critical/High defect |

Reforecast và escalation khi forecast vượt 12 tuần, vượt khoảng 979 giờ, vượt cash ceiling, hoặc bất kỳ PoC critical nào chưa pass. Estimate là dự báo, không phải cam kết; baseline chỉ thành commitment sau khi Sponsor/PO phê duyệt scope, capacity và budget. Scope mới bổ sung JD intake, extraction/OCR, requirement analysis và preparation plan đã được phản ánh trong charter; backlog và estimate phải được rebaseline trước khi Go.

## 3. Direct cash cost

| Nhóm | Cơ sở tính | Baseline (VND) |
|---|---|---:|
| Domain | 1 domain cho pilot, giới hạn 1 năm | 300.000 |
| Hosting, database, storage | Free tier trong phát triển/pilot nhỏ | 0 |
| Email/notification, meeting | Free tier + link họp ngoài | 0 |
| Design, CI/CD, repository | Công cụ giáo dục/free tier | 0 |
| Discovery/UAT | 12 lượt cảm ơn x 50.000 VND | 600.000 |
| Security/monitoring | Tool miễn phí phù hợp MVP | 0 |
| Contingency cash | 25% trên 900.000 VND direct cost | 225.000 |
| **Tổng cash budget** |  | **1.125.000** |

Đây là envelope planning ngày 14/08/2026, không phải bảng giá nhà cung cấp. Trước khi mua, owner phải lưu price page/báo giá, thời điểm tra cứu, thời hạn và phương án hủy; chi ngoài baseline cần change request.

## 4. Phân bổ labor value của estimate tham chiếu trước thay đổi JD

| Nhóm công việc | Expected effort (giờ) | Labor value (VND) |
|---|---:|---:|
| Product/PM/discovery | 78 | 3.900.000 |
| UX/prototype | 54 | 2.700.000 |
| Architecture/DevOps | 58 | 2.900.000 |
| Front-end | 126 | 6.300.000 |
| Back-end/integration | 142 | 7.100.000 |
| QA/UAT | 70 | 3.500.000 |
| Content/operations | 56 | 2.800.000 |
| Management/documentation | 14 | 700.000 |
| **Expected effort** | **598** | **29.900.000** |
| Contingency 15% | 90 | 4.500.000 |
| **Baseline labor value** | **688** | **34.400.000** |

## 5. Contingency và kiểm soát

- Reserve 15% trong capacity và contingency 15% trong effort chỉ dùng cho rủi ro/uncertainty đã nêu; không tự động dùng để thêm scope.
- Cash contingency chỉ do PM ghi nhận, Product Owner xác nhận và Sponsor phê duyệt khi phát sinh.
- Theo dõi committed/actual cash, actual effort, forecast-to-complete và variance mỗi sprint.
- Nếu cần giữ deadline, cắt US-21-23 (Should/Could) trước. Không đưa AI, video hoặc payment vào MVP để "tăng giá trị" mà không rebaseline.

## 6. Tham chiếu phương pháp

- `docs/refs/05-2-introduction-to-software-estimation.md`, slide 006-007: estimate dự báo size, duration, cost; effort = staff x time.
- `docs/refs/05-2-introduction-to-software-estimation.md`, slide 013-016 và 020-024: phân biệt estimate/commitment, quản lý cone of uncertainty và dùng count/compute trước judgment.
- Chi tiết hai phương pháp, dữ liệu đầu vào, công thức và chênh lệch nằm tại `Estimation_Comparison.md`.
