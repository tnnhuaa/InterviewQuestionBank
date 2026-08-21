# BIÊN BẢN THANH TRA MÃ NGUỒN (CODE INSPECTION)
**Dự án:** Hệ thống Luyện thi Phỏng vấn
**Hình thức:** Bình luận đánh giá trực tiếp trên Github Pull Request

**Pull Request #45:** Thêm chức năng Upload và OCR Job Description (JD)
**Người Code (Assignee):** Tuấn Anh
**Người Review (Reviewer):** Luân, Gia Thành

## Chi tiết các lỗi phát hiện trong quá trình Review:

**1. Lỗi bảo mật / Xử lý file (File: `jdController.js - Dòng 42`)**
- *Luân (Reviewer):* Chỗ này nhận file upload từ user nhưng chưa kiểm tra định dạng MIME type, nếu user upload file `.exe` hoặc script độc hại thay vì PDF/Image thì hệ thống OCR sẽ sập. Cần thêm hàm validation trước khi lưu file.
- *Tuấn Anh (Assignee):* Đã ghi nhận. Sẽ thêm middleware `multer` filter file theo `.pdf, .png, .jpg`.

**2. Lỗi hiệu năng (File: `ocrService.js - Dòng 80`)**
- *Gia Thành (Reviewer):* Đang gọi API của bên thứ 3 (Google Vision) mà không bỏ trong khối `try...catch`. Lỡ API bên thứ 3 timeout thì Node.js sẽ crash toàn bộ app.
- *Tuấn Anh (Assignee):* Đúng rồi, quên mất. Đã bổ sung `try...catch` và xử lý trả về mã lỗi 500 cho FE. (Đã commit sửa lỗi `fix: add error handling for OCR API`).

**3. Vi phạm Coding Standard (File: `jdRoute.js - Dòng 12`)**
- *Luân (Reviewer):* Linter đang báo vàng kìa, import thư viện `path` dư thừa không dùng tới. Xóa đi cho gọn.
- *Tuấn Anh (Assignee):* Đã xóa thư viện thừa.

**=> Kết luận:** Pull Request bị **Request Changes** lần 1. Sau khi Tuấn Anh fix xong 3 lỗi trên, Reviewer mới nhấn **Approve** và cho Merge code vào nhánh chính.
