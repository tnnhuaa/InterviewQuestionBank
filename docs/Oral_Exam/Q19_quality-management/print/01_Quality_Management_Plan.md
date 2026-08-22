# TÀI LIỆU KẾ HOẠCH QUẢN LÝ CHẤT LƯỢNG (SQMP)
**Dự án:** Hệ thống Luyện thi Phỏng vấn (Interview Practice Platform)
**Phiên bản:** 1.0

## 1. Yêu cầu & Tiêu chí Đo lường Chất lượng (Quality Requirements & Metrics)
*Kế hoạch này đảm bảo chất lượng toàn diện trên 4 khía cạnh cốt lõi của dự án:*

### 1.1. Chất lượng Sản phẩm (Product Quality)
- **Hiệu năng (Performance):** Tính năng Upload & OCR JD phản hồi dưới 5 giây. API tìm kiếm Mentor phản hồi dưới 2 giây. *(Đo bằng: Google Lighthouse & API Response Time)*
- **Tính khả dụng (Usability):** Giao diện tương thích trên Mobile và PC. Quy trình Book Mentor không vượt quá 3 bước. *(Đo bằng: Số thao tác click chuột, Phản hồi UAT từ user)*
- **Tính dễ bảo trì (Maintainability):** Code phải sạch, dễ đọc và dễ mở rộng. *(Đo bằng: Tỷ lệ Unit Test Coverage > 70% thông qua Jest)*

### 1.2. Chất lượng Quy trình (Process Quality)
- **Tuân thủ quy trình Scrum:** Tất cả các task trên Jira phải đi qua đúng luồng trạng thái (To Do -> In Progress -> Code Review -> Testing -> Done). *(Đo bằng: Báo cáo Workflow trên Jira)*
- **Quy trình Quản lý mã nguồn:** Bất kỳ thay đổi nào đẩy lên nhánh `develop` phải không phá hỏng code cũ. *(Đo bằng: Tỷ lệ pipeline CI/CD chạy thành công trên Github Actions)*
- **Mức độ tinh gọn:** Không sinh ra các tài liệu rườm rà không cần thiết. *(Đo bằng: Số lượng work products tạo ra so với mức độ hữu ích thực tế)*

### 1.3. Chất lượng Dự án (Project Quality)
- **Tiến độ (Deliverables):** Tỷ lệ các tính năng (User Stories) hoàn thành đúng hạn trong mỗi Sprint phải đạt trên 85%. *(Đo bằng: Biểu đồ Sprint Burndown Chart)*
- **Chi phí & Năng suất (Productivity):** Dự án không được vượt quá số tiền quỹ đã dự trù cho server và cloud. *(Đo bằng: Báo cáo chi phí AWS/Vercel hàng tháng)*
- **Độ hài lòng của khách hàng (Customer Satisfaction):** Đạt nghiệm thu ở cuối mỗi giai đoạn. *(Đo bằng: Số lượng Customer problems / Feedback report)*

### 1.4. Chất lượng Con người (Person Quality)
- **Mức độ hài lòng & Gắn kết (Degree of Satisfaction):** Các thành viên trong nhóm cảm thấy thoải mái, không bị quá tải và có động lực code. *(Đo bằng: Khảo sát nội bộ trong buổi Sprint Retrospective)*
- **Kỹ năng (Personnel Experience):** Đảm bảo chất lượng tay nghề của các Dev. *(Đo bằng: Số lượng bug bị trả về (Defect density) chia trung bình cho từng cá nhân).*

## 2. Hoạt động Đảm bảo Chất lượng (QA - Ngăn ngừa lỗi)
- **Tập trung vào Process & People:** 
  - Cấu hình chung file `.eslintrc` và `.prettierrc` bắt buộc mọi Dev cài đặt vào máy để code tự chuẩn format trước khi commit.
  - Tổ chức meeting đầu Sprint để cả team thống nhất và cam kết "Definition of Done".

## 3. Hoạt động Kiểm soát Chất lượng (QC - Phát hiện lỗi)
- **Tập trung vào Product:** 
  - Bắt buộc tạo **Pull Request (PR)** trên Github, quy định ít nhất 1 người soi code chéo (Code Inspection/Walkthrough) trước khi merge.
  - Chạy Unit Test tự động trên Github Actions. Nếu Test fail thì chặn không cho merge.
  - Thực hiện Exploratory Testing (Kiểm thử tự do) nhập dữ liệu rác/xấu vào form Đăng ký để phát hiện lỗ hổng.
