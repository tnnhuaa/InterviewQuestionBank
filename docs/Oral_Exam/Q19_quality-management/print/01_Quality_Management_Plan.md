# TÀI LIỆU KẾ HOẠCH QUẢN LÝ CHẤT LƯỢNG (SQMP)
**Dự án:** Hệ thống Luyện thi Phỏng vấn (Interview Practice Platform)
**Phiên bản:** 1.0

## 1. Yêu cầu & Tiêu chí Đo lường Chất lượng (Quality Requirements & Metrics)
*Kế hoạch này đảm bảo chất lượng toàn diện trên 4 khía cạnh cốt lõi của dự án:*

### 1.1. Chất lượng Sản phẩm (Product Quality)
- **Hiệu năng (Performance):** Tính năng Upload & OCR JD phản hồi dưới 5 giây. API tìm kiếm Mentor phản hồi dưới 2 giây.
- **Tính khả dụng (Usability):** Giao diện tương thích trên Mobile và PC. Quy trình Book Mentor phải dễ hiểu, dễ sử dụng
- **Tính dễ bảo trì (Maintainability):** Code phải tuân thủ theo convention của team, dễ đọc, dễ mở rộng.

### 1.2. Chất lượng Quy trình (Process Quality)
- **Tuân thủ quy trình Kaban:** Tất cả các task trên Kaban phải đi qua đúng luồng trạng thái (Ready -> In Progress -> Review  -> Done). 
- **Quy trình Quản lý mã nguồn:** Bất kỳ thay đổi nào đẩy lên nhánh `develop` phải mở pull request và phải có ít nhất 1 người approve

### 1.3. Chất lượng Dự án (Project Quality)
- **Tiến độ:** Tỷ lệ các task hoàn thành đúng hạn.
- **Chi phí & Năng suất:** Dự án không được vượt quá số tiền quỹ đã dự trù cho server và cloud.
- **Độ hài lòng của khách hàng:** Đạt nghiệm thu ở cuối mỗi giai đoạn. 

### 1.4. Chất lượng Con người (Person Quality)
- **Mức độ hài lòng & Gắn kết:** Các thành viên trong nhóm cảm thấy thoải mái, không bị quá tải và có động lực code. 
- **Kỹ năng:** Đảm bảo chất lượng tay nghề của các Dev. 

## 2. Hoạt động Đảm bảo Chất lượng 
  - Cấu hình chung file `.eslintrc` và `.prettierrc` bắt buộc mọi Dev cài đặt vào máy để code tự chuẩn format trước khi commit.
  - Tổ chức meeting đầu tiên để cả team thống nhất và cam kết "Definition of Done".

## 3. Hoạt động Kiểm soát Chất lượng 
- **Tập trung vào Product:** 
  - Bắt buộc tạo **Pull Request (PR)** trên Github, quy định ít nhất 1 người review bấm approve mới merge vào development 
  - Chạy Unit Test tự động trên Github Actions. Nếu Test fail thì chặn không cho merge.

