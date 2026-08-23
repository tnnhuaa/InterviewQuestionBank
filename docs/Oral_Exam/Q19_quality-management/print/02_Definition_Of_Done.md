# ĐỊNH NGHĨA HOÀN THÀNH (DEFINITION OF DONE - DoD)
**Dự án:** Hệ thống Luyện thi Phỏng vấn

Để một User Story (Task) trên Kaban được di chuyển sang cột **DONE**, phải thỏa mãn toàn bộ các điều kiện dưới đây:

## 1. Khía cạnh Code & Kỹ thuật
- [ ] Code đã được đẩy lên nhánh riêng trên Github.
- [ ] Code không vi phạm các luật của linter (chạy qua lệnh `npm run lint` không báo lỗi đỏ).
- [ ] Không chứa các console.log, comment rác, hoặc hard-code dữ liệu.

## 2. Khía cạnh Kiểm thử (Testing)
- [ ] Đã viết Unit Test cho logic/tính năng mới.
- [ ] Toàn bộ các Unit Test cũ và mới đều Pass 100% khi chạy ở local.
- [ ] Đã được QA/Tester test thủ công và verify chức năng chạy đúng với Acceptance Criteria (Tiêu chí nghiệm thu) ban đầu.

## 3. Khía cạnh Review & Quy trình
- [ ] Đã tạo Pull Request (PR) hợp lệ lên nhánh `develop`.
- [ ] Đã được ít nhất một thành viên khác trong team thực hiện Code Review và **Approve** PR.
- [ ] Các xung đột mã nguồn  đã được giải quyết triệt để.

## 4. Khía cạnh Tài liệu (Documentation)
- [ ] Nếu thay đổi CSDL, các script migration đã được đính kèm.
