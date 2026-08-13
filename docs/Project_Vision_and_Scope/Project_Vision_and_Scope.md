# Interview Practice Platform — Project Vision and Scope

## 1. Mục đích tài liệu

Tài liệu xác định product vision, người dùng, mục tiêu và ranh giới MVP. Đây là nguồn tham chiếu cho backlog, kiến trúc, prototype, UAT và change control.

## 2. Tổng quan sản phẩm

Interview Practice Platform là ứng dụng web dành cho sinh viên Việt Nam chuẩn bị thực tập hoặc công việc entry-level. Sản phẩm cung cấp Question Bank có cấu trúc và Mentor Marketplace để người dùng đi từ tự luyện đến mock interview, feedback và hành động cải thiện.

| Thành phần | Mô tả |
|---|---|
| Người dùng chính | Sinh viên năm cuối, người chuẩn bị thực tập, người mới tốt nghiệp |
| Người cung cấp dịch vụ | Mentor có kinh nghiệm chuyên môn/phỏng vấn/tuyển dụng |
| Người vận hành | Administrator/content moderator |
| Giá trị | Giảm thời gian tìm kiếm, tăng cơ hội luyện thật và chuẩn hóa feedback |

## 3. Product vision

Tạo một điểm đến đáng tin cậy để ứng viên entry-level tại Việt Nam biết cần luyện gì, tìm được người phù hợp để thực hành và biến feedback thành bước chuẩn bị tiếp theo.

## 4. Mission statement

Giúp người học chuyển từ đọc câu hỏi thụ động sang luyện tập có mục tiêu, phản hồi và tiến bộ đo được.

## 5. Product positioning

### 5.1 Vị trí hiện tại

Nội dung, mentor, lịch và feedback nằm trên nhiều công cụ. Người học tự nối quy trình và chịu phần lớn chi phí điều phối.

### 5.2 Vị trí MVP đề xuất

Một web app tích hợp taxonomy câu hỏi, hồ sơ/lịch mentor, booking và feedback rubric; công cụ họp vẫn do nhà cung cấp ngoài đảm nhiệm.

### 5.3 Vị trí tương lai

Sau khi chứng minh demand/supply và unit economics, sản phẩm có thể bổ sung payment, lộ trình cá nhân hóa, báo cáo tiến bộ và AI-assisted practice. Các khả năng này không thuộc MVP.

### 5.4 Positioning statement

> Dành cho sinh viên Việt Nam chuẩn bị thực tập hoặc công việc đầu tiên, Interview Practice Platform kết hợp bộ câu hỏi có cấu trúc với booking mentor theo nhu cầu. Khác với việc tự thu thập tài liệu và tìm mentor rời rạc, sản phẩm tạo một vòng lặp chuẩn bị → thực hành → feedback → luyện lại trong cùng hệ thống.

## 6. Problem statement

### 6.1 Vấn đề chính

Sinh viên thiếu một workflow đơn giản và đáng tin cậy để chuyển từ chuẩn bị kiến thức sang mock interview với mentor và nhận feedback có cấu trúc.

### 6.2 Pain point hiện tại

- Nội dung rải rác, trùng lặp và khó đánh giá độ tin cậy.
- Người học không biết câu trả lời đã rõ và đúng trọng tâm chưa.
- Tìm mentor và chốt lịch qua tin nhắn tốn thời gian.
- Chất lượng feedback không đồng nhất.
- Điểm yếu thường chỉ lộ ra trong phỏng vấn thật.
- Mentor nhận yêu cầu thiếu mục tiêu, bối cảnh và thời gian rõ ràng.

### 6.3 Product opportunity

Question Bank tạo điểm vào và ngữ cảnh luyện tập; Marketplace cung cấp feedback con người. Khi hai phần dùng chung vị trí, chủ đề và lịch sử luyện, sản phẩm có thể tạo giá trị lớn hơn tổng của hai công cụ rời.

## 7. Target users

### 7.1 Primary persona — Sinh viên chuẩn bị thực tập

| Thuộc tính | Mô tả |
|---|---|
| Ví dụ | An, sinh viên năm ba CNTT |
| Mục tiêu | Sẵn sàng cho phỏng vấn Front-end Intern trong ba tuần |
| Hành vi | Tìm câu hỏi từ blog/video/cộng đồng; tự ghi chú |
| Pain | Không biết cách diễn đạt; khó tìm người có kinh nghiệm đúng vị trí |
| Nhu cầu | Lộ trình câu hỏi, mentor phù hợp, lịch rõ và feedback cụ thể |
| Success moment | Hoàn thành mock interview và biết hai hành động cần làm tiếp |

### 7.2 Secondary persona — Người mới tốt nghiệp/chuyển hướng entry-level

Cần rà soát kiến thức, hiểu kỳ vọng của vị trí mới và thực hành trong bối cảnh gần phỏng vấn thật nhưng có mạng lưới hạn chế.

### 7.3 Supply persona — Mentor/người phỏng vấn

Muốn chia sẻ kinh nghiệm, xây dựng uy tín hoặc tạo thu nhập; cần yêu cầu rõ, lịch chủ động, công cụ quản lý booking và rubric đủ nhanh để sử dụng.

### 7.4 Operational persona — Administrator

Cần duyệt mentor/câu hỏi, theo dõi booking, xử lý report và giữ audit trail mà không can thiệp thủ công vào mọi giao dịch.

## 8. Product goals and measures

| Goal | Measure | Target đề xuất |
|---|---|---:|
| Xác nhận pain | Tỷ lệ discovery sample xác nhận pain cốt lõi | ≥ 70% |
| Tìm câu hỏi dễ | Task completion | ≥ 80% |
| Tìm câu hỏi nhanh | Median time-on-task | ≤ 2 phút |
| Booking dễ | Tạo yêu cầu hợp lệ trong usability test | ≥ 80% |
| Booking diễn ra | Confirmed-to-completed rate | ≥ 80% |
| Feedback tốt | Có strength, weakness, next action | ≥ 90% |
| Giá trị cảm nhận | Điểm hữu ích sau buổi | ≥ 4/5 |
| Tự tin | Chênh lệch pre/post | Trung bình +1/5 |

## 9. MVP scope

### 9.1 In scope

- Tài khoản, xác thực và RBAC cho Student/Mentor/Admin.
- Student profile và mục tiêu phỏng vấn.
- Question taxonomy, browse/search/filter, detail, bookmark và progress cơ bản.
- Mentor profile, verification, expertise, service scope, pricing placeholder và availability.
- Booking request, accept/reject/reschedule/cancel/complete và chống trùng slot.
- External meeting link, email/in-app notification.
- Feedback rubric và review sau booking.
- Admin moderation, report và operational metrics cơ bản.

### 9.2 Out of scope

- AI interviewer, automatic scoring, voice/video analysis.
- Built-in video call, recording và transcription.
- Automated payment/escrow/payout.
- Native mobile app, ATS/job application và ML recommendation.
- Marketplace đa quốc gia hoặc coaching ngoài phỏng vấn.

## 10. Scope boundary

| Năng lực | MVP | Future |
|---|---:|---:|
| Question Bank có taxonomy | Có | Mở rộng nội dung/cá nhân hóa |
| Mentor profile/verification | Có | Xác minh nâng cao |
| Availability/booking | Có | Calendar sync nâng cao |
| External meeting link | Có | Video tích hợp |
| Feedback rubric | Có | AI-assisted analysis |
| Review hợp lệ | Có | Reputation nâng cao |
| Manual/free pilot payment | Có thể | Payment/payout tự động |

## 11. Giả định

- Có mentor và sinh viên đủ cho pilot.
- Người dùng chấp nhận công cụ họp ngoài.
- Mentor chấp nhận rubric chung.
- Nội dung pilot có thể được nhóm/mentor biên soạn hợp pháp.
- Free tier đủ cho giai đoạn phát triển và pilot nhỏ.

## 12. Ràng buộc

- Chưa có baseline về team, lịch và ngân sách.
- Marketplace cần đồng thời demand và supply.
- Booking và feedback chứa dữ liệu riêng tư.
- Nội dung phỏng vấn có nguy cơ sai, lỗi thời hoặc vi phạm bản quyền.
- Tích hợp bên thứ ba có quota và outage.

## 13. Future backlog

- AI interviewer và gợi ý cải thiện câu trả lời.
- Ghi âm, phiên âm và phân tích giao tiếp.
- Payment, escrow, refund và mentor payout.
- Calendar sync hai chiều và video tích hợp.
- Personalized learning path và analytics nâng cao.
- Subscription, coupon, group session và enterprise/university partnership.

