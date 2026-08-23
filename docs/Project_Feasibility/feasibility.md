# Feasibility Study — Interview Practice Platform

## 1. Executive summary

MVP **khả thi có điều kiện** về kỹ thuật và vận hành nếu lấy luồng JD → extraction/correction → requirement analysis → Question mapping → preparation plan làm giá trị đầu vào; giữ Question Bank, mentor booking và feedback làm vòng thực hành; dùng công cụ họp ngoài; và hoàn thành PoC cho xử lý JD, mapping, concurrency, authorization và notification. Planning baseline là 8 tuần, khoảng 653 giờ capacity và trần tiền mặt 1.125.000 VNĐ; khả năng bàn giao chỉ được kết luận sau khi nhóm xác nhận 134 SP bằng Planning Poker, cập nhật hai estimate độc lập và có khoảng throughput thực tế.

## 2. Technical feasibility

| Năng lực | Đánh giá | Điều kiện |
|---|---|---|
| Web CRUD/search/filter | Khả thi | Taxonomy/index và test multi-tag |
| Authentication/RBAC | Khả thi có điều kiện | Object-level authorization và negative tests |
| JD intake/extraction | Khả thi có rủi ro | Một PDF/PNG/JPEG ≤10 MB, PDF ≤5 trang; direct extraction trước, OCR VI/EN fallback, correction gate và safe failure |
| Requirement analysis/Question mapping | Khả thi có rủi ro | 20 JD có nhãn; versioned taxonomy/alias/rules; blind-set recall và precision@10 ≥80% |
| Preparation plan | Khả thi | Trace tới JD/requirement/Question version và object-level authorization |
| Mentor verification | Khả thi | Workflow moderation và audit |
| Availability/booking | Khả thi có rủi ro | Transaction/unique constraint chống double booking |
| Notification | Khả thi có rủi ro | Outbox/retry; không làm rollback booking |
| Feedback/review | Khả thi | Completed-only rule, privacy và moderation |
| Video meeting | Khả thi bằng tích hợp nhẹ | External/manual link trong MVP |
| AI/payment | Loại khỏi MVP | Chỉ xem xét sau validation |

PoC bắt buộc:

1. JD hợp lệ tạo văn bản có thể sửa bằng direct extraction hoặc OCR fallback; lỗi tệp thất bại an toàn.
2. Requirement/alias được chuẩn hóa và mapping chỉ trả Question `PUBLISHED`, có source/topic/reason/version và ổn định cùng phiên bản.
3. Hai request đồng thời không thể xác nhận cùng một slot.
4. User khác không thể đọc/sửa JD, plan, booking, meeting link hoặc feedback.
5. Booking transition hợp lệ và có audit trail.
6. Question filter đúng với nhiều position/topic.
7. Email failure không làm mất booking; retry idempotent.

## 3. Schedule và resource feasibility

Trạng thái: **Có đường cơ sở lập kế hoạch; chưa có cam kết delivery chính thức**.

- Capacity: 6 thành viên × 16 giờ/tuần × 8 tuần = 768 giờ danh nghĩa; dự phòng 15% để lại khoảng 653 giờ cho scope.
- Backlog: 27 story R1 Must = 134 SP; throughput cần thiết 33,5 SP/tuần trong bốn tuần execution tái dựng chỉ là mốc so sánh.
- Nhóm phải Planning Poker, tách/chấp nhận ngoại lệ cho story 8 SP, theo dõi khoảng throughput sau 2–3 tuần có dữ liệu và dựng đường will-have/might-have trước khi cam kết fixed-date release.
- Schedule được xem là khả thi khi Must backlog nằm trong khoảng throughput dự báo và vẫn giữ reserve cho discovery, integration, defect, security/privacy và UAT.

## 4. Operational và market feasibility

| Khía cạnh | Đánh giá | Validation |
|---|---|---|
| Nhu cầu sinh viên | Có giả thuyết cần kiểm chứng | ≥70% discovery sample xác nhận pain chuẩn bị theo JD |
| Giá trị JD-to-plan | Có điều kiện | ≥80% hoàn tất tác vụ; extraction ≥90%; blind-set recall/precision@10 ≥80% |
| Mentor supply | Có điều kiện | 4 mentor Approved, mỗi người ≥3 slot cho pilot |
| Booking operation | Có điều kiện | Policy cancel/reschedule/no-show và admin owner |
| Feedback quality | Có điều kiện | Mentor dùng được rubric; ≥90% complete |
| Moderation | Có điều kiện | Provenance câu hỏi, report và appeal |
| Plan-to-mentor loop | Chưa chứng minh | 12 booking hợp lệ; mục tiêu ≥10 Confirmed và ≥8 Completed |

Marketplace có rủi ro chicken-and-egg nhưng không chặn toàn bộ giá trị vì Student nhận preparation plan trước khi đặt Mentor. Pilot giới hạn Front-end Intern/Junior dùng JavaScript/TypeScript/React, 20 JD đã khử định danh, 12 Student và 4 Mentor tự nguyện.

## 5. Economic feasibility

Trạng thái: **Có đường cơ sở tiền mặt cho thử nghiệm; chưa chứng minh unit economics**.

- Direct cash: tên miền 300.000 VNĐ + hỗ trợ 12 Student participant 600.000 VNĐ = 900.000 VNĐ.
- Contingency 25% = 225.000 VNĐ; cash ceiling = 1.125.000 VNĐ.
- Mentor pilot tham gia tự nguyện; payment, escrow, payout và commission không thuộc MVP.
- Chi phí lao động phải theo dõi riêng; giá trị quy đổi học thuật không phải khoản lương hoặc cash cost.
- Mọi dịch vụ OCR/email/hosting trả phí cần báo giá có ngày, impact và change approval trước khi thay baseline nội bộ/free tier.

## 6. Legal, privacy và ethical feasibility

MVP khả thi có điều kiện nếu:

- Có privacy notice, consent và mục đích xử lý rõ.
- Thu thập tối thiểu dữ liệu; JD gốc xóa ≤24 giờ, dữ liệu dẫn xuất sau 90 ngày không hoạt động, booking/feedback sau 180 ngày, active deletion ≤7 ngày và backup expiry ≤30 ngày.
- Meeting link, verification evidence và feedback không công khai.
- Question có provenance và không sao chép nội dung có bản quyền trái phép.
- Review/report có guideline, moderation và appeal.
- Không ghi âm/phiên âm trong MVP.
- Terms nêu rõ cancellation, no-show, refund/credit và giới hạn trách nhiệm.

## 7. Khuyến nghị và Go/No-Go gates

| Gate | Go khi | No-Go/Pivot khi |
|---|---|---|
| G1 Problem | Pain được xác nhận và có hành vi hiện tại | Chỉ có ý kiến chung, không có nhu cầu thực |
| G2 JD data | Có 20 JD hợp pháp/khử định danh, 12 calibration + 8 blind và nhãn hai lượt | Không có corpus hoặc nhãn không đủ tin cậy |
| G3 Prototype | ≥80% task JD-to-plan và plan-to-booking hoàn tất | Luồng không hiểu hoặc cần hỗ trợ lớn |
| G4 Technical | 7 PoC bắt buộc pass; blind recall/precision@10 ≥80% | Extraction/mapping không đạt, double booking hoặc access leak chưa kiểm soát |
| G5 Supply | 4 Mentor Approved có ≥3 slot/người | Không tuyển được supply đúng phân khúc |
| G6 Delivery | Must backlog nằm trong throughput range/capacity/budget | Core loop không thể hoàn tất trong baseline |
| G7 Pilot | ≥10 Confirmed, ≥8 Completed; feedback hữu ích | Completion/value quá thấp sau một remediation cycle |

Khuyến nghị hiện tại: **Proceed với thử nghiệm hẹp và PoC; chỉ Go cho phát hành khi các gate đạt**. Planning baseline dùng cho điều phối nội bộ; phê duyệt chính thức vẫn cần chữ ký Sponsor Ngô Huy Biên và Ngô Ngọc Đăng Khoa.
