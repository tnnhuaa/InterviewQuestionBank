# PrepVI — Ngân hàng câu hỏi phỏng vấn R1

PrepVI R1 được xây dựng theo kiến trúc monolith mô-đun, gồm SPA React/TypeScript, API và worker Express/JavaScript, cùng PostgreSQL có tính di động thông qua `pg`. Trình duyệt gọi đường dẫn tương đối `/api/v1`; trình duyệt không bao giờ kết nối trực tiếp đến PostgreSQL hoặc kho lưu trữ đối tượng.

```text
Trình duyệt -> /api/v1 cùng origin -> Express -> dịch vụ ứng dụng/miền -> PostgreSQL
                                             \-> outbox -> worker -> SMTP
                                             \-> kho riêng tư local/tương thích S3
```

Hệ thống đã triển khai toàn bộ backlog sản phẩm `US-01–30`, bao gồm bảng điều khiển Student, lời nhắc trước 24 giờ/1 giờ và quy trình nhập Ngân hàng câu hỏi bằng CSV có kiểm soát. Gemini được tích hợp theo mô hình hybrid để hỗ trợ phân tích JD, giải thích đề xuất, soạn agenda và feedback draft; scorer/ranking, eligibility, booking và feedback chính thức vẫn deterministic hoặc do người dùng xác nhận. AI reranking, video tích hợp, ghi hình, bản ghi lời thoại và thanh toán vẫn nằm ngoài phạm vi; buổi phỏng vấn thử sử dụng liên kết họp HTTPS bên ngoài.

## Thiết lập môi trường local

Yêu cầu: Node.js 24 LTS, npm 11+ và Docker Desktop hoặc một máy chủ PostgreSQL phiên bản 15 trở lên.

### 1. Cài dependency và tạo `.env`

PowerShell:

```powershell
Copy-Item .env.example .env
npm install
```

macOS/Linux:

```bash
cp .env.example .env
npm install
```

Trong `.env`, bắt buộc thay các giá trị sau trước khi chạy ứng dụng:

```dotenv
SESSION_SECRET=chuoi-ngau-nhien-toi-thieu-32-ky-tu
CSRF_SECRET=mot-chuoi-ngau-nhien-khac-toi-thieu-32-ky-tu
GEMINI_API_KEY=api-key-tao-tu-google-ai-studio
```

Không commit `.env`. Không đặt API key trong biến có tiền tố `VITE_`, source frontend hoặc ảnh chụp evidence.

### 2. Khởi tạo database và dịch vụ local

```bash
npm run db:start
npm run db:migrate
npm run db:seed:reference
```

`db:start` khởi động PostgreSQL và Mailpit bằng Docker. Nếu dùng PostgreSQL bên ngoài, cập nhật `DATABASE_URL`/`DATABASE_SSL` rồi chỉ cần chạy migration và seed.

Để có sẵn ba persona cùng dữ liệu cho toàn bộ luồng Student/Mentor/Admin, đặt thêm hai giá trị sau trong `.env`, rồi chạy demo seed một lần:

```dotenv
ALLOW_NON_PRODUCTION_SEED=true
DEMO_SEED_PASSWORD=mat-khau-demo-tu-8-ky-tu
```

```bash
npm run db:seed:demo
```

Tài khoản demo: `student.demo@prepvi.local`, `mentor.demo@prepvi.local` và `admin.demo@prepvi.local`; cả ba dùng `DEMO_SEED_PASSWORD` do người chạy seed tự đặt.

### 3. Chạy toàn bộ ứng dụng

Sau khi database đã được migrate, chỉ cần một lệnh tại thư mục gốc:

```bash
npm run dev
```

Lệnh này khởi động đồng thời và gắn nhãn log cho ba service:

- `api`: Express API tại `http://localhost:3000`.
- `worker`: xử lý extraction, Gemini job, email/outbox, reminder và retention.
- `web`: Vite frontend tại `http://localhost:5173`.

Nếu API, worker hoặc frontend dừng do lỗi, hai process còn lại cũng được dừng để không tạo trạng thái development không đầy đủ. Nhấn `Ctrl+C` để tắt cả ba.

Các địa chỉ kiểm tra:

- Giao diện: `http://localhost:5173`
- Kiểm tra trạng thái API: `http://localhost:3000/api/v1/health`
- Kiểm tra mức sẵn sàng của API: `http://localhost:3000/api/v1/readiness`
- Mailpit: `http://localhost:8025`

Khi cần debug từng process riêng biệt, chạy các lệnh sau trong ba terminal:

```bash
npm run dev:api
npm run dev:worker
npm run dev:web
```

## Kiểm tra toàn bộ tính năng Gemini trong development

`.env.example` bật sẵn cả bốn feature AI cho `NODE_ENV=development`. Nếu các cờ bị bỏ khỏi `.env`, development vẫn tự bật toàn bộ khi có `GEMINI_API_KEY`; production không tự bật. API key chỉ được cấu hình ở backend/secret manager và trình duyệt không gọi Gemini trực tiếp.

```dotenv
AI_PROVIDER=gemini
AI_ENABLED=true
AI_JD_ANALYSIS_ENABLED=true
AI_RECOMMENDATION_EXPLANATION_ENABLED=true
AI_AGENDA_DRAFT_ENABLED=true
AI_FEEDBACK_DRAFT_ENABLED=true
GEMINI_API_KEY=your-secret-key
GEMINI_MODEL=gemini-3.5-flash-lite
GEMINI_API_VERSION=v1
```

Sau khi đăng nhập, gọi `GET /api/v1/ai/capabilities` qua frontend/API để xác nhận `enabled`, `available` và bốn feature đều là `true`. Nếu `available=false`, kiểm tra API key, model và trạng thái circuit breaker; nếu một feature riêng lẻ là `false`, kiểm tra cờ môi trường và `ai_feature_controls` vì feature có thể đã bị Admin tắt qua Operations Queue.

Các điểm vào UI để test:

- Student: upload/dán JD → xác nhận corrected text → trang mapping để tạo AI analysis và xử lý requirement confidence thấp.
- Student: Preparation Plan → tạo explanation cho Question và Mentor candidate đã qua hard filter.
- Mentor: Booking Detail của lịch đã xác nhận → tạo, sửa và xác nhận interview agenda draft.
- Mentor: Booking đã hoàn tất → nhập ghi chú không nhạy cảm, tạo/sửa feedback draft rồi chủ động gửi feedback chính thức.

API chỉ đưa AI job vào hàng đợi; vì vậy `worker` phải chạy. Lệnh root `npm run dev` đã bao gồm worker. Theo dõi log có prefix `[worker]`; trạng thái job có thể được polling qua `GET /api/v1/ai-jobs/{jobId}`.

Các giới hạn timeout, retry, concurrency, token và budget đầy đủ có trong `.env.example`. Khi hết quota hoặc provider lỗi, phân tích JD chuyển sang rule-based và các luồng còn lại tiếp tục bằng lý do/form thủ công. Ghi chú dùng để tạo feedback draft được mã hóa tạm thời và xóa sau xử lý hoặc tối đa 24 giờ. Để kiểm tra fallback có chủ đích, đặt `AI_ENABLED=false` rồi khởi động lại `npm run dev`.

Không cần sao chép `.env` vào `backend` hoặc `frontend`: API, worker và Vite đều đọc file `.env` duy nhất ở repository root.

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
- File JD, ghi chú feedback draft và bằng chứng xác minh là dữ liệu riêng tư. Meeting link và input AI tạm thời được mã hóa AES-256-GCM khi lưu trữ.
- Lỗi API chứa correlation ID an toàn và hướng khắc phục; log không chứa request body, token, nội dung JD, credential, meeting link hoặc bằng chứng xác minh.
- Lỗi nhà cung cấp không hoàn tác trạng thái nghiệp vụ đã được ghi nhận. Outbox thử gửi lại tại phút thứ 1 và 5, sau đó tạo hồ sơ vận hành có thể truy vết.

Khi PostgreSQL hoặc Mailpit local không thể khởi động, hãy làm theo bảng khắc phục thủ công trong tài liệu hướng dẫn triển khai thay vì thay đổi trực tiếp dữ liệu production.
