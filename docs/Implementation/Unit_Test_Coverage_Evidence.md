# Minh chứng unit test và độ phủ mã nguồn

## Phạm vi

Tài liệu này ghi lại kết quả kiểm thử tự động cho các unit có logic xác định, có thể cô lập khỏi PostgreSQL, SMTP, private storage và Gemini. Đây là **coverage của unit-test scope**, không phải tỷ lệ phủ toàn bộ backend/frontend.

Các test integration/regression cần PostgreSQL được giữ riêng và không được tính vào số liệu dưới đây.

## Môi trường thực thi

- Ngày thực thi: 2026-08-21
- Node.js: 24.16.0
- npm: 11.16.0
- Vitest: 3.2.4
- Coverage provider: V8
- Lệnh tái hiện:

```powershell
npm ci
npm run test:unit:coverage
```

## Kết quả

| Workspace | Test files | Test cases | Statements | Branches | Functions | Lines | Kết quả |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| Backend | 8 | 41 | 100% | 97.97% | 100% | 100% | Pass |
| Frontend | 6 | 31 | 99.50% | 92.38% | 97.05% | 99.50% | Pass |
| Tổng | 14 | 72 | — | — | — | — | 72/72 pass |

Ngưỡng bắt buộc cho từng workspace:

- Statements: 90%
- Branches: 85%
- Functions: 90%
- Lines: 90%

Nếu một ngưỡng không đạt, `npm run test:unit:coverage` trả exit code khác 0 và CI thất bại.

## Các unit và tính chất đã xác thực

| Nhóm | Unit | Minh chứng hành vi |
| --- | --- | --- |
| Booking | `createBookingSchema` | Chấp nhận đúng một JD hoặc preparation plan; từ chối thiếu context, trộn hai context, thiếu plan version, topic rỗng và input quá ngắn. |
| Idempotency | `requestHash`, `findIdempotentResult`, `saveIdempotentResult` | Hash ổn định, bắt buộc key, trả lại response cũ cho retry giống nhau, chặn tái sử dụng key với payload khác và lưu đúng resource/result. |
| JD matching | `scoreQuestionMatch` | Xác thực trọng số 40/30/15/15, role fit, seniority, độ khó, chuẩn hóa dấu tiếng Việt và trường hợp không có keyword đủ dài. |
| Configuration | `getEnvironment`, `validateEnvironment` | Default an toàn, kiểu số/boolean, AI chỉ tự bật trong development có key, production config hợp lệ và các cấu hình sai bị từ chối. |
| Token | Token ngẫu nhiên, hash và one-time token | Token có entropy, hash không giữ plaintext, token bị ràng buộc theo purpose/secret/thời hạn; token malformed, tampered hoặc expired bị từ chối. |
| Encryption | Meeting-link encryption/fingerprint | AES-GCM round-trip, ciphertext ngẫu nhiên, sai secret hoặc ciphertext bị sửa không giải mã được, fingerprint xác định. |
| Error contract | `AppError`, `validationError`, `notFoundError`, `parse` | Chuẩn hóa status/code/recovery, field error lồng nhau và form-level error; danh sách recovery kind bất biến. |
| Status HTTP | Health/readiness/not-found | Response thành công, dependency failure `503` và `404` đều tuân theo safe error envelope có correlation ID. |
| Route access | `requiredRoleForPath`, `canAccessPath`, `postLoginPath` | Phân quyền Student/Mentor/Admin, home theo persona, chặn URL ngoài hệ thống và chỉ dùng return path được phép. |
| API client | CSRF/error/idempotency helpers | Base URL, JSON/header, structured error, `204`, CSRF refresh một lần, anonymous session, provider failure và UUID idempotency key. |
| UI policies | Booking retry/reason/reschedule | Giữ idempotency key khi payload không đổi, tạo key mới khi input đổi, policy yêu cầu reason và chỉ bên nhận proposal được phản hồi. |
| UI utilities | Route builders và `cn` | Tạo đúng URL resource/placeholder và ghép class có điều kiện theo thứ tự. |

## Khả năng tái hiện và CI

- Cấu hình unit suite nằm trong `backend/vitest.unit.config.js` và `frontend/vitest.unit.config.js`.
- Báo cáo HTML cục bộ được sinh tại `backend/coverage/unit/index.html` và `frontend/coverage/unit/index.html`; thư mục coverage không được commit.
- GitHub Actions chạy `npm run test:unit:coverage` sau lint và trước typecheck. Vì vậy pull request không thể pass quality job nếu test đỏ hoặc coverage giảm dưới threshold.
- Test unit không gọi database, Gemini, SMTP hoặc internet; kết quả không phụ thuộc credential hay dữ liệu demo.

## Quality gates cùng lần thực thi

| Gate | Kết quả |
| --- | --- |
| `npm ci` | Pass từ lockfile sạch |
| `npm run test:unit:coverage` | Pass, 72/72 test đạt và vượt mọi threshold |
| `npm run lint` | Pass cho frontend và backend |
| `npm run typecheck` | Pass |
| `npm run build` | Pass cho frontend và backend |
| `npm run api:types:check` | Pass, không có OpenAPI drift |
| `npm audit --omit=dev --audit-level=critical` | 0 runtime vulnerabilities |

Frontend build còn cảnh báo chunk chính lớn hơn 500 kB. Đây là cảnh báo tối ưu bundle, không làm gate thất bại và không ảnh hưởng kết quả unit test.

## Giới hạn

- Service/repository dùng PostgreSQL, transaction concurrency, OCR/PDF và worker scheduling phải được xác thực bằng integration test hoặc manual walkthrough riêng.
- Coverage cao chỉ chứng minh các nhánh mã được thực thi; các assertion hành vi ở bảng trên mới là bằng chứng về tính đúng của unit.
- Khi thêm unit logic mới vào scope, cần cập nhật `coverage.include`, test cases và tài liệu này cùng một commit.
