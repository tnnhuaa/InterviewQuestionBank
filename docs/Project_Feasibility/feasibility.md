# Feasibility Study — Interview Practice Platform

## 1. Executive summary

MVP **khả thi có điều kiện** về kỹ thuật và vận hành nếu giữ Question Bank, mentor discovery, booking và feedback làm core loop; dùng công cụ họp ngoài; và hoàn thành POC cho concurrency, authorization và notification. Economic, schedule và resource feasibility chưa thể kết luận cho đến khi nhóm điền ngân sách, capacity, mức giá và quy mô pilot.

## 2. Technical feasibility

| Năng lực | Đánh giá | Điều kiện |
|---|---|---|
| Web CRUD/search/filter | Khả thi | Taxonomy/index và test multi-tag |
| Authentication/RBAC | Khả thi có điều kiện | Object-level authorization và negative tests |
| Mentor verification | Khả thi | Workflow moderation và audit |
| Availability/booking | Khả thi có rủi ro | Transaction/unique constraint chống double booking |
| Notification | Khả thi có rủi ro | Outbox/retry; không làm rollback booking |
| Feedback/review | Khả thi | Completed-only rule, privacy và moderation |
| Video meeting | Khả thi bằng tích hợp nhẹ | External/manual link trong MVP |
| AI/payment | Loại khỏi MVP | Chỉ xem xét sau validation |

POC bắt buộc:

1. Hai request đồng thời không thể xác nhận cùng một slot.
2. User khác không thể đọc/sửa booking, meeting link hoặc feedback.
3. Booking transition hợp lệ và có audit trail.
4. Question filter đúng với nhiều position/topic.
5. Email failure không làm mất booking; retry idempotent.

## 3. Schedule và resource feasibility

Trạng thái: **Chưa kết luận**.

Nhóm cần:

- Team roster, skill matrix và giờ/tuần.
- WBS đến work package, estimate từ người thực hiện và reserve.
- Dependency map và critical path cho auth → mentor/slot → booking → feedback.
- Lịch discovery, prototype test, UAT và mentor onboarding.

Schedule được xem là khả thi khi Must backlog nằm trong capacity commitment và còn reserve cho defect, integration, learning và UAT.

## 4. Operational và market feasibility

| Khía cạnh | Đánh giá | Validation |
|---|---|---|
| Nhu cầu sinh viên | Có tín hiệu | ≥70% discovery sample xác nhận pain |
| Mentor supply | Có điều kiện | Đủ mentor Approved và slot cho pilot |
| Booking operation | Có điều kiện | Policy cancel/reschedule/no-show và admin owner |
| Feedback quality | Có điều kiện | Mentor dùng được rubric; ≥90% complete |
| Moderation | Có điều kiện | Provenance câu hỏi, report và appeal |
| Question-to-mentor loop | Chưa chứng minh | Đo funnel và repeat behavior |

Marketplace có rủi ro chicken-and-egg. Pilot nên giới hạn một hoặc vài vị trí nghề nghiệp, tuyển mentor trước và cho phép concierge support có kiểm soát.

## 5. Economic feasibility

Trạng thái: **Chưa kết luận**.

Cần xác định:

- Cash budget và labor value.
- Mức phí mentor, commission/phí dịch vụ và willingness to pay.
- Cost per completed booking, support/moderation cost và provider cost.
- Conversion từ Question Bank đến booking và booking completion rate.

Pilot có thể dùng booking miễn phí/credit hoặc thanh toán thủ công để kiểm chứng nhu cầu, nhưng phải ghi rõ rằng cách này chưa chứng minh unit economics ở quy mô lớn.

## 6. Legal, privacy và ethical feasibility

MVP khả thi có điều kiện nếu:

- Có privacy notice, consent và mục đích xử lý rõ.
- Thu thập tối thiểu dữ liệu; có retention/deletion policy.
- Meeting link, verification evidence và feedback không công khai.
- Question có provenance và không sao chép nội dung có bản quyền trái phép.
- Review/report có guideline, moderation và appeal.
- Không ghi âm/phiên âm trong MVP.
- Terms nêu rõ cancellation, no-show, refund/credit và giới hạn trách nhiệm.

## 7. Khuyến nghị và Go/No-Go gates

| Gate | Go khi | No-Go/Pivot khi |
|---|---|---|
| G1 Problem | Pain được xác nhận và có hành vi hiện tại | Chỉ có ý kiến chung, không có nhu cầu thực |
| G2 Supply | Có đủ mentor/slot cho pilot | Không tuyển được supply đúng phân khúc |
| G3 Prototype | ≥80% task tìm câu hỏi/booking hoàn tất | Luồng không hiểu hoặc cần hỗ trợ lớn |
| G4 Technical | 5 POC bắt buộc pass | Double booking/access leak chưa kiểm soát |
| G5 Delivery | Must backlog vừa capacity/budget | Core loop không thể hoàn tất trong baseline |
| G6 Pilot | Booking diễn ra, feedback hữu ích, có ý định quay lại | Conversion/completion/value quá thấp |

Khuyến nghị hiện tại: **Proceed to discovery and technical POC; chưa phê duyệt full MVP baseline**.

