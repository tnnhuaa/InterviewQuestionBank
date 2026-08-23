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
- Đảm bảo quy trình xử lý JD (bao gồm trích xuất văn bản, phân tích yêu cầu và ánh xạ câu hỏi) đạt độ chính xác cao

## 3. Phạm vi công việc (Scope of work)
### 3.1. Các hạng mục trong phạm vi (In Scope)
- **Trọng tâm:** 
  - Tính năng nhập JD: dán văn bản hoặc tải tệp 
  - Trích xuất văn bản và sử dụng OCR nội bộ  cho ảnh/scan. Cung cấp giao diện cho Student hiệu chỉnh và xác nhận văn bản JD.
  - Phân tích yêu cầu từ JD, chuẩn hóa phân loại  và ánh xạ  với Ngân hàng câu hỏi để tạo Kế hoạch chuẩn bị .
- **Luồng Mentor (Phát triển song song & tích hợp):**
  - Hệ thống phân quyền cho 3 vai trò: Student, Mentor, Admin.
  - Quản lý Ngân hàng câu hỏi (tìm kiếm, lọc, đánh dấu).
  - Quản lý hồ sơ Mentor, xác minh và thiết lập lịch rảnh.
  - Luồng đặt lịch (Booking) kèm ngữ cảnh từ JD/Plan.
  - Tích hợp link họp ngoài hệ thống (Google Meet/Zoom) và thông báo qua Email.
  - Hệ thống đánh giá và phản hồi (Feedback) dựa trên rubric có sẵn.

### 3.2. Các hạng mục ngoài phạm vi 
- Phỏng vấn tự động bằng AI, chấm điểm câu trả lời, phân tích giọng nói/video.
- Gợi ý câu hỏi bằng mô hình học máy
- Gọi video, ghi âm, phiên âm trực tiếp trên nền tảng.
- Cổng thanh toán, ký quỹ, tính hoa hồng và chi trả tự động.
- Ứng dụng di động 

## 4. Địa điểm làm việc 
- Team: Làm việc tại Simple Coffee tại địa chỉ: 218 Lê Lai, Bến Thành, Hồ Chí Minh 70000, Việt Nam
- Họp online qua google meet 
- Giao tiếp qua messenger 
- Quản lý công việc qua trello 
- Lưu trữ mã nguồn và tài liệu trên github 

## 5. Thời gian thực hiện (Period of performance)
- **Khung thời gian học phần:** 8 tuần (29/06/2026 - 23/08/2026).
  - *Giai đoạn 1 (29/06 - 24/07):* Thực hiện dự án cũ (Splitly), sau đó hủy bỏ do không khả thi.
  - *Giai đoạn 2 (10/08 - 23/08):* Triển khai thực tế dự án InterviewQuestionBank (2 tuần execution).
- **Tổng thời gian thực hiện :** Khoảng 653 giờ 

## 6. Lịch trình giao nộp 

- **Tuần 1 (27/07 - 02/08) - Foundation & Prototype:** Khởi tạo kiến trúc, thiết kế nguyên mẫu, xác định Workflow và Product Backlog.
- **Tuần 2 (03/08 - 09/08) - Candidate PoC:** Phát triển các tính năng lõi (JD Intake, OCR, trích xuất văn bản).
- **Tuần 3 (10/08 - 16/08) - Mapping & Integration:** Hoàn thiện ánh xạ Ngân hàng câu hỏi (Taxonomy mapping), tạo Preparation Plan và kết hợp luồng Mentor.
- **Tuần 4 (17/08 - 23/08) - UAT & Release:** Bàn giao hoàn chỉnh luồng Booking tới Feedback (E2E), báo cáo kiểm thử (không còn lỗi Critical/High), hệ thống sẵn sàng cho Pilot.

## 7. Tiêu chuẩn áp dụng 
- Sử dụng mô hình Kaban

## 8. Tiêu chí nghiệm thu (Acceptance criteria)
- Hệ thống trích xuất và ánh xạ thành công bộ test 20 JD (có khử định danh) đạt Precision@10 và Recall ≥ 80%.
- Toàn bộ luồng nghiệp vụ cốt lõi  pass 100% các kịch bản kiểm thử 
- Kết thúc quá trình UAT không tồn tại lỗi  ở mức độ Critical hoặc High.

## 9. Các giả định (Assumptions)
- Nguồn lực đảm bảo 6 thành viên đóng góp trung bình 16 giờ/người/tuần.
- Ngân sách cho phép  ở mức 1.125.000 VNĐ là đủ để chi trả cho chi phí Domain và quà tri ân Pilot. Cấu hình Server/Database  tận dụng các gói miễn phí 

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
   - Lấy từ `docs/Project_Proposal/Project_Proposal.md` (các phần Mục đích, Vấn đề, Phạm vi MVP và Kết quả mong đợi).
   - Tham khảo bổ sung từ `docs/Project_Vision_and_Scope/Project_Vision_and_Scope.md` (Đặc biệt phần Ranh giới phạm vi, Giả định và Ràng buộc bảo mật dữ liệu JD).
3. **Chi phí, Thời gian, Nguồn lực và Lịch trình Giao nộp:** 
   - Trích xuất từ `docs/Project_Resource_Plan/Cost_Time_Resources.md` (Các mục Baseline planning, Cash budget 1.125.000 VNĐ, Lịch và tolerance 8 tuần với mốc ngày cụ thể).
4. **Tiêu chí nghiệm thu (Acceptance Criteria):** 
   - Tổng hợp từ mục *Mục tiêu sản phẩm và cách đo* trong `Project_Vision_and_Scope.md` (Precision ≥80%, Pilot KPI) và các ràng buộc từ `Cost_Time_Resources.md`.
5. **Trách nhiệm (Roles):** 
   - Bám sát bảng phân công vai trò trong `Project_Proposal.md`.
