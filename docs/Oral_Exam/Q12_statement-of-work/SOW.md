# STATEMENT OF WORK (SOW)

## Thông tin kiểm soát tài liệu
- **Tên dự án:** Interview Practice Platform (Nền tảng luyện phỏng vấn)
- **Nhóm thực hiện:** Gia Thành, Hùng, Hưng, Trí, Luân, Tuấn Anh.
- **Ngày lập:** 21/08/2026
- **Phiên bản:** 1.0

---

## 1. Mục đích (Purpose)
Xây dựng một ứng dụng web (MVP) giúp ứng viên Việt Nam (sinh viên năm cuối, người chuẩn bị thực tập hoặc cấp đầu vào) chuyển đổi một Mô tả công việc (Job Description - JD) cụ thể thành một kế hoạch ôn tập phỏng vấn có cấu trúc. Ứng dụng cung cấp ngân hàng câu hỏi để tự luyện tập và kết nối ứng viên với các Cố vấn (Mentor) để phỏng vấn thử (mock interview) và nhận phản hồi (feedback).

## 2. Mục tiêu của công việc (Objectives of the work)
- Hoàn thành phiên bản MVP của hệ thống trong vòng 8 tuần.
- Đảm bảo quy trình xử lý JD (bao gồm trích xuất văn bản, phân tích yêu cầu và ánh xạ câu hỏi) đạt độ chính xác (Precision) và độ phủ (Recall) ≥ 80%.
- Tổ chức chạy thử nghiệm (Pilot) thành công với tối thiểu 10 lịch hẹn (Booking) được xác nhận và 8 lịch hẹn hoàn thành.
- Kiểm soát ngân sách tiền mặt tối đa cho dự án không vượt quá 1.125.000 VNĐ.

## 3. Phạm vi công việc (Scope of work)
### 3.1. Các hạng mục trong phạm vi (In Scope)
- Hệ thống phân quyền cho 3 vai trò: Student, Mentor, Admin.
- Tính năng nhập JD: dán văn bản (tối đa 50.000 ký tự) hoặc tải tệp (PDF/PNG/JPEG tối đa 10MB).
- Trích xuất văn bản và sử dụng OCR nội bộ (Việt/Anh) cho ảnh/scan. Cung cấp giao diện cho Student hiệu chỉnh và xác nhận văn bản JD.
- Phân tích yêu cầu từ JD, chuẩn hóa phân loại (taxonomy) và ánh xạ (mapping) với Ngân hàng câu hỏi để tạo Kế hoạch chuẩn bị (Preparation Plan).
- Quản lý Ngân hàng câu hỏi (tìm kiếm, lọc, đánh dấu).
- Quản lý hồ sơ Mentor, xác minh và thiết lập lịch rảnh.
- Luồng đặt lịch (Booking) kèm ngữ cảnh từ JD/Plan.
- Tích hợp link họp ngoài hệ thống (Google Meet/Zoom) và thông báo qua Email.
- Hệ thống đánh giá và phản hồi (Feedback) dựa trên rubric có sẵn.

### 3.2. Các hạng mục ngoài phạm vi (Out of Scope)
- Phỏng vấn tự động bằng AI, chấm điểm câu trả lời, phân tích giọng nói/video.
- Gợi ý câu hỏi bằng mô hình học máy (Machine Learning recommendation).
- Gọi video, ghi âm, phiên âm trực tiếp trên nền tảng.
- Cổng thanh toán, ký quỹ, tính hoa hồng và chi trả tự động.
- Ứng dụng di động (Mobile App).

## 4. Địa điểm làm việc (Location of the work)
Dự án được triển khai theo mô hình phân tán (Remote). Nhóm phát triển sử dụng các công cụ làm việc nhóm trực tuyến và quản lý mã nguồn qua GitHub. Máy chủ thử nghiệm sẽ được lưu trữ trên môi trường Cloud (Free tier/Education tier).

## 5. Thời gian thực hiện (Period of performance)
- **Thời lượng:** 8 tuần.
- **Ngày bắt đầu:** 29/06/2026.
- **Ngày kết thúc:** 23/08/2026.
- **Tổng dung lượng làm việc (Capacity):** Khoảng 653 giờ (sau khi trừ 15% dự phòng rủi ro từ tổng 768 giờ danh nghĩa).

## 6. Lịch trình giao nộp (Deliverables schedule)
- **05/07/2026 (Discovery/Charter):** Bàn giao Problem evidence, Project Charter, Resource baseline.
- **12/07/2026 (Prototype/Requirements):** Bàn giao Workflow, Product Backlog, Prototype (đã được PO phê duyệt).
- **19/07/2026 (Foundation):** Bàn giao Kiến trúc hệ thống, Authentication, CI/CD, cơ sở dữ liệu.
- **26/07/2026 (JD Intake & Analysis):** Bàn giao chức năng nhập JD, Extract/OCR, taxonomy mapping và preparation plan.
- **09/08/2026 (Marketplace Core Loop):** Bàn giao hoàn chỉnh luồng Booking tới Feedback (E2E).
- **23/08/2026 (UAT/Release):** Bàn giao Biên bản UAT, báo cáo kiểm thử (không còn lỗi Critical/High), hệ thống sẵn sàng cho Pilot.

## 7. Tiêu chuẩn áp dụng (Applicable standards)
- Sử dụng mô hình Agile/Scrum (2 tuần/sprint).
- Đảm bảo quyền riêng tư và bảo mật: Xóa tệp JD gốc của người dùng trong vòng 24 giờ.
- Luồng gửi thông báo (Notification) phải có cơ chế retry/outbox để không làm hỏng dữ liệu khi bên thứ 3 (Email provider) gặp lỗi.

## 8. Tiêu chí nghiệm thu (Acceptance criteria)
- Hệ thống trích xuất và ánh xạ thành công bộ test 20 JD (có khử định danh) đạt Precision@10 và Recall ≥ 80%.
- Toàn bộ luồng nghiệp vụ cốt lõi (Critical workflow) pass 100% các kịch bản kiểm thử (TC-JD, TC-MAP, TC-PLAN, TC-B, TC-SESSION, TC-F).
- Kết thúc quá trình UAT không tồn tại lỗi (Defect) ở mức độ Critical hoặc High.
- Đợt thử nghiệm Pilot đạt tối thiểu 10 lượt Booking được xác nhận (Confirmed) và 8 lượt hoàn thành (Completed) kèm phản hồi hợp lệ.

## 9. Các giả định (Assumptions)
- Nguồn lực đảm bảo 6 thành viên đóng góp trung bình 16 giờ/người/tuần.
- Tuyển đủ 12 Student và ít nhất 4 Mentor tham gia đợt Pilot hoàn toàn tự nguyện.
- Ngân sách cho phép (Cash ceiling) ở mức 1.125.000 VNĐ là đủ để chi trả cho chi phí Domain và quà tri ân Pilot. Cấu hình Server/Database sẽ tận dụng các gói miễn phí.

## 10. Trách nhiệm các bên (Roles & Responsibilities)
- **Gia Thành (PM/Scrum Master):** Lên lịch trình, theo dõi tiến độ, ước lượng và quản lý rủi ro.
- **Tuấn Anh (Team Leader):** Lãnh đạo, quản trị dự án, điều phối giữa các thành viên.
- **Hưng (Product Owner/BA):** Sở hữu Product Vision, quản lý Backlog và duyệt tiêu chí nghiệm thu.
- **Luân (Architecture/Tech Lead):** Thiết kế kiến trúc và quyết định kỹ thuật.
- **Hùng (UI/UX Designer):** Thiết kế giao diện và trải nghiệm người dùng, nguyên mẫu (Prototype).
- **Trí (PoC/E2E):** Kiểm chứng tính khả thi kỹ thuật và tích hợp end-to-end.

## 11. Quy trình quản lý thay đổi (Change management process)
- Bất kỳ thay đổi nào ảnh hưởng đến Phạm vi (Scope), Lịch trình (Schedule) hoặc Ngân sách (Budget) vượt ngoài khoảng dung sai (tolerance) đều phải được đệ trình thông qua Yêu cầu thay đổi (Change Request - CR).
- Ban kiểm soát thay đổi (CCB) bao gồm Sponsor, PO, PM và Tech Lead sẽ phân tích tác động và ra quyết định (Approve/Reject). Trừ các lỗi (Defects) vi phạm tiêu chí nghiệm thu ban đầu sẽ được ưu tiên sửa mà không cần CR.

---

## 12. References (Nguồn tham khảo)

Bản Statement of Work này được thiết lập dựa trên các tài liệu nền tảng sau:

1. **Cấu trúc SOW:** 
   - Lấy cảm hứng từ slide `06. Software Project Planning.pdf`, Slide 12 (*Statement of Work*). Cấu trúc tuân thủ nguyên tắc trả lời câu hỏi "WHAT" thông qua các đề mục tiêu chuẩn như Purpose, Scope, Period of performance, Deliverables schedule, Acceptance criteria, Assumptions.
2. **Khái quát Dự án, Vấn đề, Giải pháp và Phạm vi:** 
   - Lấy từ `docs/Project_Proposal/Project_Proposal_Draft.md` (Các phần Mục đích, Vấn đề, Phạm vi MVP, Kết quả mong đợi).
   - Tham khảo bổ sung từ `docs/Project_Vision_and_Scope/Project_Vision_and_Scope.md` (Đặc biệt phần Ranh giới phạm vi, Giả định và Ràng buộc bảo mật dữ liệu JD).
3. **Chi phí, Thời gian, Nguồn lực và Lịch trình Giao nộp:** 
   - Trích xuất từ `docs/Project_Resource_Plan/Cost_Time_Resources.md` (Các mục Baseline planning, Cash budget 1.125.000 VNĐ, Lịch và tolerance 8 tuần với mốc ngày cụ thể).
4. **Tiêu chí nghiệm thu (Acceptance Criteria):** 
   - Tổng hợp từ mục *Mục tiêu sản phẩm và cách đo* trong `Project_Vision_and_Scope.md` (Precision ≥80%, Pilot KPI) và các ràng buộc từ `Cost_Time_Resources.md`.
5. **Trách nhiệm (Roles):** 
   - Bám sát bảng phân công vai trò trong `Project_Proposal_Draft.md`.
