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

## Email thông báo CI

Workflow `.github/workflows/ci.yml` sau khi chạy xong sẽ gửi email thông báo kết quả (trạng thái SUCCESS/FAILURE, repository, branch, commit SHA, người push, kết quả job `quality` và `secret-scan`, và link tới run). Để kích hoạt, cần cấu hình secrets sau (Settings → Secrets and variables → Actions):

| Secret         | Giá trị                                        |
| -------------- | ---------------------------------------------- |
| `SMTP_HOST`    | `smtp.gmail.com`                               |
| `SMTP_PORT`    | `465`                                          |
| `SMTP_USERNAME`| Email Gmail dùng để gửi (ví dụ `group05@gmail.com`) |
| `SMTP_PASSWORD`| App Password 16 ký tự (xem bước tạo bên dưới)  |
| `NOTIFY_FROM`  | Cùng email với `SMTP_USERNAME`                 |
| `NOTIFY_TO`    | Email nhận thông báo                           |

Các bước tạo App Password cho Gmail:

1. Bật **2-Step Verification** cho tài khoản Gmail (myaccount.google.com → Security).
2. Vào **Security → App passwords** (chọn mục này chỉ hiện khi đã bật 2FA).
3. Chọn app = `Mail` (hoặc `Other`), thiết bị = `Other` → sinh ra mật khẩu 16 ký tự.
4. Dùng mật khẩu đó cho secret `SMTP_PASSWORD`.
5. Thêm các secret ở bảng trên, rồi chạy thử workflow để kiểm tra email nhận được.
End
