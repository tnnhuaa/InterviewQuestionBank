# PrepVI — Ngân hàng câu hỏi phỏng vấn R1

PrepVI R1 được xây dựng theo kiến trúc monolith mô-đun, gồm SPA React/TypeScript, API và worker Express/JavaScript, cùng PostgreSQL có tính di động thông qua `pg`. Trình duyệt gọi đường dẫn tương đối `/api/v1`; trình duyệt không bao giờ kết nối trực tiếp đến PostgreSQL hoặc kho lưu trữ đối tượng.

```text
Trình duyệt -> /api/v1 cùng origin -> Express -> dịch vụ ứng dụng/miền -> PostgreSQL
                                             \-> outbox -> worker -> SMTP
                                             \-> kho riêng tư local/tương thích S3
```

Hệ thống đã triển khai toàn bộ backlog sản phẩm `US-01–30`, bao gồm bảng điều khiển Student, lời nhắc trước 24 giờ/1 giờ và quy trình nhập Ngân hàng câu hỏi bằng CSV có kiểm soát. AI/đối sánh ngữ nghĩa, video tích hợp, ghi hình, bản ghi lời thoại và thanh toán vẫn chủ động nằm ngoài phạm vi; buổi phỏng vấn thử sử dụng liên kết họp HTTPS bên ngoài.

## Thiết lập môi trường local

Yêu cầu: Node.js 24 LTS, npm 11+ và Docker Desktop hoặc một máy chủ PostgreSQL phiên bản 15 trở lên.

```bash
cp .env.example .env
npm install
npm run db:start
npm run db:migrate
npm run db:seed:reference
npm run dev
```

`npm run dev` khởi động đồng thời API, worker xử lý email/job và frontend. Giữ terminal này hoạt động trong suốt quá trình phát triển.

Thiết lập giá trị mạnh cho `SESSION_SECRET` và `CSRF_SECRET` trong `.env`. Các địa chỉ local:

- Giao diện: `http://localhost:5173`
- Kiểm tra trạng thái API: `http://localhost:3000/api/v1/health`
- Kiểm tra mức sẵn sàng của API: `http://localhost:3000/api/v1/readiness`
- Mailpit: `http://localhost:8025`

Khi cần debug từng process riêng biệt, chạy các lệnh sau trong ba terminal:

```bash
npm run dev --workspace backend
npm run worker --workspace backend
npm run dev --workspace frontend
```

## Quy trình database và seed

Migration chỉ được phép tiến lên phiên bản mới và được bảo vệ bằng checksum. Không chỉnh sửa migration hoặc phiên bản seed đã được áp dụng; hãy tạo phiên bản mới.

```bash
npm run db:migrate
npm run db:seed:reference
npm run db:seed:demo
npm run db:seed:load
npm run db:seed:verify
npm run db:status
```

- `reference`: taxonomy, alias, câu hỏi đã xuất bản và tuyển chọn, provenance, classification cùng matching rule ổn định, an toàn để dùng cho pilot.
- `demo`: các nhóm người dùng mẫu và trạng thái luồng/lỗi đại diện cho local hoặc staging. Yêu cầu `ALLOW_NON_PRODUCTION_SEED=true` và `DEMO_SEED_PASSWORD`; mật khẩu không bao giờ được ghi vào log.
- `load`: dữ liệu chỉ dành cho staging, gồm 1.000 câu hỏi, 100 Mentor, 1.000 slot tương lai và 500 booking trong namespace `load-*` riêng biệt.

Chỉ được chạy seed `demo` và `load` khi `NODE_ENV=development` và `ALLOW_NON_PRODUCTION_SEED=true`. Quy trình khởi tạo production bắt buộc là: migrate → reference seed → `npm run admin:invite --workspace backend -- admin@example.com`. Token mời và mật khẩu phải được chuyển giao hoặc nhập qua kênh riêng, không bao giờ được nhận dưới dạng tham số dòng lệnh.

Khi dùng Neon cho production, đặt `NODE_ENV=production`, `DATABASE_SSL=true` và sử dụng `sslmode=verify-full` trong `DATABASE_URL`; ứng dụng không bao giờ tắt bước xác minh chứng chỉ.

Chỉ được chạy `npm run db:reset` khi `NODE_ENV=development` và host trong database URL được xác định rõ là local. Mọi URL Neon đều bị từ chối.

## Hợp đồng API và chất lượng mã nguồn

OpenAPI 3.1 nằm tại `backend/openapi/openapi.yaml`. Sinh kiểu dữ liệu hợp đồng cho frontend bằng các lệnh:

```bash
npm run api:types
npm run api:types:check
npm run typecheck
npm run lint
npm run build
```

`OPENAPI_VALIDATION=true` bật kiểm tra hợp đồng cho cả request và response. Nên giữ tùy chọn này ở trạng thái bật trong development và production; request không hợp lệ sẽ nhận lỗi an toàn `API_CONTRACT_VALIDATION_ERROR` kèm hướng dẫn khắc phục theo từng trường dữ liệu.

Việc triển khai kiểm thử tự động không thuộc phạm vi phát hành hoặc kiểm chứng R1. Quá trình nghiệm thu sử dụng bằng chứng kiểm tra thủ công/UAT được mô tả trong `docs/Implementation/Manual_Validation_and_Operations.md`. CI vẫn kiểm tra lint, TypeScript, sai lệch OpenAPI, khả năng chạy lại migration, tính toàn vẹn của reference seed, build và quét dữ liệu bí mật.

## An toàn khi vận hành

- Mật khẩu sử dụng Argon2id. Session chỉ lưu hash SHA-256 của token; cookie sử dụng `__Host-`, `Secure`, `HttpOnly` và `SameSite=Lax` trong môi trường bảo mật.
- Request đã xác thực và có thay đổi trạng thái phải vượt qua kiểm tra same-origin và CSRF.
- Các thao tác booking/moderation sử dụng version check và idempotency key. Việc xác nhận slot được tuần tự hóa bằng row lock.
- File JD và bằng chứng xác minh là dữ liệu riêng tư. Meeting link được mã hóa AES-256-GCM khi lưu trữ.
- Lỗi API chứa correlation ID an toàn và hướng khắc phục; log không chứa request body, token, nội dung JD, credential, meeting link hoặc bằng chứng xác minh.
- Lỗi nhà cung cấp không hoàn tác trạng thái nghiệp vụ đã được ghi nhận. Outbox thử gửi lại tại phút thứ 1 và 5, sau đó tạo hồ sơ vận hành có thể truy vết.

Khi PostgreSQL hoặc Mailpit local không thể khởi động, hãy làm theo bảng khắc phục thủ công trong tài liệu hướng dẫn triển khai thay vì thay đổi trực tiếp dữ liệu production.
