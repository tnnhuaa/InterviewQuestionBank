# PrepVI

Ngân hàng câu hỏi và nền tảng hỗ trợ chuẩn bị phỏng vấn.

## Yêu cầu

- Node.js 24+
- npm 11+
- File `.env` dùng chung do người quản lý dự án cung cấp

## Chạy lần đầu

1. Nhận file `.env` từ người quản lý và đặt vào thư mục gốc của dự án, cùng cấp với `package.json`.

2. Cài dependency:

   ```bash
   npm install
   ```

3. Chạy ứng dụng:

   ```bash
   npm run dev
   ```

4. Mở `http://localhost:5173`.

## Tài khoản demo

| Vai trò | Email                       | Mật khẩu     |
| ------- | --------------------------- | ------------ |
| Student | `student.demo@prepvi.local` | `demo@12345` |
| Mentor  | `mentor.demo@prepvi.local`  | `demo@12345` |
| Admin   | `admin.demo@prepvi.local`   | `demo@12345` |

## Lưu ý

- Dự án dùng chung database Supabase và Gemini API key đã cấu hình trong `.env`; thành viên không cần tạo database hoặc API key riêng.
- Chỉ gửi `.env` qua kênh riêng của nhóm. Không commit, chụp màn hình hoặc đăng công khai nội dung file này.
- Không tự chạy `db:migrate`, `db:seed:*` hoặc `db:reset` nếu chưa được yêu cầu; mọi thay đổi đều tác động đến database chung.
- Gemini có quota dùng chung. Khi key hết hạn hoặc hết quota, người quản lý sẽ cập nhật key mới và gửi lại `.env`.
- `npm run dev` chạy API, worker và frontend; kiểm tra API tại `http://localhost:3000/api/v1/health` và nhấn `Ctrl+C` để dừng.
