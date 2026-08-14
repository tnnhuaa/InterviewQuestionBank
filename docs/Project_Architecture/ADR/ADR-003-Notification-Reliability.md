# ADR-003 — Notification Reliability

| Thuộc tính | Giá trị |
|---|---|
| Trạng thái | Accepted, pending PoC evidence |
| Ngày quyết định | 14/08/2026 |
| Liên quan | BR-09; US-19; POC notification resilience |

## 1. Bối cảnh

Booking phải được lưu ngay cả khi email provider timeout hoặc unavailable. Gửi email trực tiếp trong HTTP request tạo hai lỗi nguy hiểm: provider failure làm rollback nghiệp vụ, hoặc booking commit nhưng response timeout khiến client retry và gửi trùng.

Notification là side effect, không phải nguồn chân lý cho booking. MVP cần retry, idempotency và khả năng xử lý thủ công mà không thêm message broker riêng.

## 2. Các phương án

### A. Gửi đồng bộ trong request

Không chọn vì tăng latency và coupling với provider; không thể atomic giữa PostgreSQL và email provider.

### B. Message broker riêng

Có khả năng scale tốt nhưng không chọn cho MVP vì thêm service, chi phí và operational skill chưa được xác nhận.

### C. PostgreSQL transactional outbox + worker

Chọn vì event và business change commit trong cùng transaction; dùng hạ tầng sẵn có và có thể tách worker khi scale.

## 3. Quyết định

### 3.1 Event creation

Booking service insert outbox record trong cùng transaction với business change. Event tối thiểu gồm:

- `id` bất biến.
- `event_type`, `aggregate_type`, `aggregate_id`.
- `recipient_user_id`; không lưu email nếu có thể resolve lúc gửi.
- Payload versioned và chỉ chứa dữ liệu tối thiểu.
- `occurred_at`, `available_at`, `attempt_count`, `status`.
- `deduplication_key` duy nhất theo business event và channel.

Các event MVP: `booking.requested`, `booking.confirmed`, `booking.reschedule_proposed`, `booking.cancelled`, `session.reminder_due` và `feedback.submitted`.

### 3.2 Delivery semantics

- Cam kết **at-least-once processing**, không tuyên bố exactly-once với external provider.
- Worker claim batch bằng transaction/row locking; nhiều worker không xử lý đồng thời một job.
- Provider adapter nhận `deduplication_key` làm idempotency key nếu provider hỗ trợ.
- Thành công ghi `SENT` và provider message ID.
- Timeout/5xx/network error được retry bằng exponential backoff có jitter.
- Lỗi validation/permanent provider error chuyển `DEAD` không retry vô hạn.
- Sau tối đa 5 lần thử, job chuyển `DEAD` và xuất hiện trong operational queue để admin/manual resend.

Lịch retry mặc định cho pilot: khoảng 1, 5, 15, 60 và 360 phút; worker có jitter và có thể cấu hình bằng environment variable.

### 3.3 PII, logging và template

- Outbox không chứa meeting secret, feedback text đầy đủ hoặc verification evidence.
- Log dùng event ID, aggregate ID, attempt và error class; không log body email/token.
- Template được version hóa; user-facing time luôn có timezone.
- Email link dùng HTTPS và không chứa credential dài hạn trong query string.

### 3.4 Deployment

- PoC một API instance được phép chạy worker loop cùng process để giảm chi phí, nhưng module và lifecycle phải tách rõ.
- Staging/production chạy API và worker thành process/service riêng.
- Chỉ một scheduler tạo reminder event; unique deduplication key chống reminder trùng.
- Shutdown phải ngừng claim job mới và hoàn tất/rollback job đang giữ.

## 4. Hệ quả

- Booking response không phụ thuộc email provider.
- Có độ trễ eventual consistency giữa booking và notification.
- PostgreSQL nhận thêm outbox traffic nhưng phù hợp pilot.
- Cần cleanup/retention cho event đã gửi và dashboard/metric cho backlog.
- Recipient có thể nhận trùng nếu provider xử lý request nhưng response bị mất; template và provider idempotency giảm rủi ro này.

## 5. Metrics và cảnh báo

- Số job `PENDING/RETRY/DEAD` và tuổi job cũ nhất.
- Delivery success rate và attempts per event type.
- Alert khi có job `DEAD`, backlog quá ngưỡng hoặc provider error tăng liên tục.
- Business KPI dùng booking state; không dùng trạng thái email để suy ra booking success.

## 6. PoC acceptance

| Test | Pass khi |
|---|---|
| Provider timeout | Booking vẫn commit và có một outbox event |
| Retry | Job được thử lại theo policy và không tạo booking/transition mới |
| Duplicate worker | Hai worker tranh cùng job nhưng chỉ một worker claim tại một thời điểm |
| Duplicate event | `deduplication_key` ngăn hai event logic giống nhau |
| Permanent failure | Sau ngưỡng retry job chuyển `DEAD`, có error class và manual action |
| Recovery | Khi provider hoạt động lại, job retry chuyển `SENT` |

PoC có thể dùng fake provider điều khiển được timeout/5xx; không cần gửi email thật để chứng minh reliability.
