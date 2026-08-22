# BIÊN BẢN PHẢN HỒI TỪ KHÁCH HÀNG (CUSTOMER FEEDBACK REPORT)
**Dự án:** Hệ thống Luyện thi Phỏng vấn (Interview Practice Platform)
**Giai đoạn:** User Acceptance Testing (UAT) - Sprint 3
**Đại diện khách hàng:** Thầy / Khách hàng giả định

## 1. Điểm Khách hàng Hài lòng (Satisfied)
- Chức năng Upload JD và tự động trích xuất từ khóa hoạt động khá mượt mà.
- Giao diện đặt lịch (Booking Mentor) trực quan, có tính năng xem lịch rảnh (Availability) giống Google Calendar rất dễ hiểu.

## 2. Vấn đề Khách hàng Báo cáo (Customer Problems & True Defects)
**Lỗi logic (Defects):**
- Lúc sinh viên chọn chức năng "Lọc Mentor theo kỹ năng ReactJS", danh sách trả về toàn báo rỗng dù có Mentor dạy ReactJS.
- **Yêu cầu xử lý:** Fix gấp lỗi query API search mentor.

**Lỗi giao diện (Usability Issues):**
- Khi sinh viên làm bài Test xong, nút "Nộp bài" nằm tuốt dưới cùng màn hình, phải cuộn mỏi tay mới thấy.
- **Yêu cầu xử lý:** Đưa nút "Nộp bài" lên góc phải trên cùng (sticky banner) để dễ bấm hơn.

**Hiệu năng (Performance):**
- Mỗi lần upload file JD PDF cỡ 5MB thì app quay mòng mòng tới hơn 15 giây mới hiện kết quả.
- **Yêu cầu xử lý:** Cần tối ưu lại API xử lý OCR, hoặc hiện thanh Progress Bar để user biết hệ thống đang xử lý, tránh việc user tưởng app bị đơ nên bấm reload lại.

## 3. Quyết định (Decision)
- **Kết luận:** Khách hàng **CHƯA NGHIỆM THU (Not Accepted)** Sprint 3 do vướng lỗi "Lọc Mentor" (Lỗi nghiêm trọng cản trở core flow).
- **Hành động của Team:** Log toàn bộ lỗi trên vào Jira. Tập trung nguồn lực fix các lỗi này trong 2 ngày tới để khách hàng test lại.
