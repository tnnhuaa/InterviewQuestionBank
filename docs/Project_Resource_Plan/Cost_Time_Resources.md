# Interview Practice Platform — Cost, Time, and Resource Baseline

## 1. Mục đích

Tài liệu là khung baseline để nhóm điền sau khi xác nhận team, lịch và ngân sách. Mọi con số chưa có bằng chứng được giữ ở trạng thái `[CẦN BỔ SUNG]`.

## 2. Baseline phê duyệt

| Hạng mục | Baseline |
|---|---|
| Ngày bắt đầu | [CẦN BỔ SUNG] |
| Ngày kết thúc | [CẦN BỔ SUNG] |
| Thời lượng | [CẦN BỔ SUNG] tuần |
| Team/capacity | [CẦN BỔ SUNG] |
| Cash budget trần | [CẦN BỔ SUNG] VNĐ |
| Contingency reserve | [CẦN BỔ SUNG]% |
| Management reserve | [CẦN BỔ SUNG] |
| Baseline owner | [CẦN BỔ SUNG] |
| Người phê duyệt | [CẦN BỔ SUNG] |

Baseline chỉ có hiệu lực khi Charter, MVP Scope, WBS cấp deliverable và estimate được phê duyệt.

## 3. Phân bổ thời gian

| Giai đoạn | Tỷ lệ | Start/Finish | Exit criteria |
|---|---:|---|---|
| Discovery | 15% | TBD | Problem evidence và charter |
| Prototype/requirement | 15% | TBD | Workflow, backlog, prototype baseline |
| Foundation | 15% | TBD | Architecture, auth, CI/CD, data baseline |
| Question Bank | 15% | TBD | Learn workflow pass |
| Marketplace | 25% | TBD | Booking/feedback end-to-end pass |
| UAT/release | 15% | TBD | UAT, no Critical/High defect, deployment |

## 4. Ước tính chi phí trực tiếp

| Nhóm | Cơ sở estimate | Baseline (VNĐ) | Actual | Variance |
|---|---|---:|---:|---:|
| Domain | 1 domain/năm nếu public pilot | TBD | — | — |
| Hosting web/API | Free tier trước; dự phòng theo load | TBD | — | — |
| Database/storage | Free tier + backup | TBD | — | — |
| Email/notification | Số user/event dự kiến | TBD | — | — |
| Calendar/video | External/manual link ở MVP | TBD | — | — |
| Design/assets | Chỉ tài nguyên có license | TBD | — | — |
| Research/UAT | Quà cảm ơn/di chuyển nếu có | TBD | — | — |
| Security/monitoring | Dịch vụ cần thiết cho pilot | TBD | — | — |
| Contingency | Risk-based reserve | TBD | — | — |
| **Tổng** | Không vượt budget trần | **TBD** | — | — |

## 5. Contingency và kiểm soát chi phí

- Dùng free tier khi vẫn đạt acceptance criteria, security và reliability.
- Nâng cấp trả phí phải có owner, lý do, thời hạn và cách hủy.
- Chi ngoài baseline yêu cầu change request có tác động scope/schedule.
- Reserve chỉ dùng cho risk đã xác định; Management reserve cần Sponsor phê duyệt.
- Theo dõi committed cost và actual cost, không chỉ hóa đơn đã thanh toán.

## 6. Định giá labor

Labor effort phải được ghi riêng cash cost. Nếu môn học yêu cầu quy đổi:

`Labor value = tổng giờ theo vai trò × đơn giá tham chiếu của vai trò`.

Đơn giá, nguồn tham chiếu và ngày tham chiếu: **[CẦN BỔ SUNG]**. Labor value không đồng nghĩa khoản tiền nhóm phải chi.

## 7. Quy tắc theo dõi

- Cập nhật capacity, actual effort và cost ít nhất mỗi sprint.
- Reforecast khi velocity thấp hai sprint, milestone trễ hoặc risk chuyển thành issue.
- Báo Sponsor/PO khi forecast vượt tolerance **[CẦN BỔ SUNG]**.
- Cắt Should/Could trước khi ảnh hưởng core loop Question → Booking → Feedback.
- Ghi decision log cho mọi thay đổi baseline.

## 8. Tham chiếu định giá

Nhóm phải thu báo giá/price page chính thức cho domain, hosting, database và email tại thời điểm phê duyệt. Không khóa kiến trúc vào nhà cung cấp chỉ vì free tier nếu chi phí chuyển đổi hoặc rủi ro vận hành cao.

