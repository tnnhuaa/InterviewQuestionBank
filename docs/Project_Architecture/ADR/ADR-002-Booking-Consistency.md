# ADR-002 — Booking Consistency and Double-Booking Prevention

| Thuộc tính | Giá trị |
|---|---|
| Trạng thái | Accepted, pending PoC evidence |
| Ngày quyết định | 14/08/2026 |
| Liên quan | BR-02, BR-08; US-11, US-12, US-13; architecture validation scenario: Booking consistency |

## 1. Bối cảnh

Hai hoặc nhiều request có thể đồng thời cố xác nhận booking cho cùng một availability slot. Kiểm tra `slot available` ở application rồi update ở bước sau tạo race condition. Notification hoặc retry từ client cũng có thể làm transition bị thực hiện lặp.

Yêu cầu bất biến:

- Một slot chỉ có tối đa một booking ở trạng thái chiếm slot.
- Transition booking đi qua một state machine duy nhất và có audit trail.
- Retry cùng một request không tạo transition hoặc outbox event trùng.
- Notification failure không được rollback booking đã commit.

## 2. Các phương án

### A. Application check đơn thuần

Đọc slot, nếu available thì update booking. Không chọn vì hai transaction có thể cùng đọc trạng thái cũ và cùng xác nhận.

### B. Distributed/Redis lock

Không chọn cho MVP vì thêm hạ tầng, failure mode và chi phí; database vẫn phải giữ constraint để bảo vệ dữ liệu.

### C. Chỉ dùng isolation `SERIALIZABLE`

Có thể bảo vệ invariant nhưng yêu cầu retry tổng quát và tạo overhead không cần thiết cho mọi transaction. Không chọn làm cơ chế duy nhất.

### D. PostgreSQL transaction + row lock + database constraint

Chọn vì PostgreSQL đã là nguồn chân lý, lock chỉ nằm trên slot/booking liên quan và unique partial index là lớp bảo vệ cuối cùng.

## 3. Quyết định

### 3.1 Trạng thái chiếm slot

Các trạng thái chiếm slot là `CONFIRMED`, `COMPLETED` và `NO_SHOW`. `PENDING`, `REJECTED` và `CANCELLED` không chiếm slot. `RESCHEDULE_PROPOSED` chưa chiếm slot mới cho đến khi đề xuất được chấp nhận trong một transaction.

Database migration phải tạo constraint tương đương:

```sql
CREATE UNIQUE INDEX ux_booking_occupied_slot
ON bookings (slot_id)
WHERE state IN ('CONFIRMED', 'COMPLETED', 'NO_SHOW');
```

Nếu PoC chưa có `NO_SHOW`, index tối thiểu vẫn phải bao phủ `CONFIRMED` và `COMPLETED`.

### 3.2 Transaction xác nhận

API `POST /api/v1/bookings/:id/transitions` nhận action `CONFIRM` và `Idempotency-Key`.

Trong một database transaction:

1. Lock booking và availability slot bằng `SELECT ... FOR UPDATE` theo thứ tự cố định: slot trước, booking sau.
2. Xác minh actor là mentor sở hữu booking, booking ở trạng thái cho phép và slot chưa bị chiếm.
3. Update booking với điều kiện trạng thái cũ; nếu affected row bằng 0, trả conflict.
4. Update slot thành `BOOKED`.
5. Insert `booking_transitions` gồm from/to, actor, reason và timestamp.
6. Insert notification event vào outbox bằng event key duy nhất.
7. Commit; chỉ sau commit mới trả `CONFIRMED`.

Unique index là guard cuối nếu application check hoặc lock có lỗi. Vi phạm invariant trả HTTP `409` với code `BOOKING_SLOT_CONFLICT`; không trả raw database error.

### 3.3 Idempotency và retry

- Unique constraint trên `(actor_id, idempotency_key, operation)` hoặc request record tương đương.
- Cùng key và cùng payload trả lại kết quả đã lưu.
- Cùng key nhưng payload khác trả `409 IDEMPOTENCY_KEY_REUSED`.
- Retry toàn transaction tối đa hai lần cho serialization/deadlock error đã phân loại; không retry validation, authorization hoặc unique conflict.

### 3.4 Reschedule

Chấp nhận lịch mới phải lock cả slot cũ và slot mới theo thứ tự ID ổn định, kiểm tra slot mới, chuyển booking và release/consume slot trong cùng transaction. Không update slot ở hai request độc lập.

## 4. Hệ quả

- Correctness không phụ thuộc một API instance hoặc in-memory mutex.
- Lock contention chỉ tập trung vào cùng slot.
- Cần integration test với PostgreSQL thật; mock database không chứng minh concurrency.
- Raw SQL migration là configuration item và phải được review cùng code.
- Mọi code path thay đổi booking state phải gọi Booking state-machine service; admin không update table trực tiếp.

## 5. PoC acceptance

| Test | Pass khi |
|---|---|
| Concurrent confirm | ≥20 request cùng slot, đúng một booking `CONFIRMED`, các request còn lại nhận `409` hoặc kết quả idempotent |
| Side effects | Chỉ một transition xác nhận và một outbox event logic được tạo |
| Retry | Gửi lại cùng idempotency key không tạo record mới |
| Authorization | Mentor khác/Student không thể confirm |
| Invalid transition | `CANCELLED → CONFIRMED` bị chặn và có error code ổn định |
| Reschedule race | Hai booking tranh slot mới vẫn chỉ một booking chiếm slot |

PoC report phải lưu số request, kết quả HTTP, query kiểm tra invariant và log correlation ID; không chỉ chụp UI.

## 6. Nguồn

- PostgreSQL transaction isolation: https://www.postgresql.org/docs/current/transaction-iso.html
- PostgreSQL explicit/row locking: https://www.postgresql.org/docs/current/explicit-locking.html
- PostgreSQL partial indexes: https://www.postgresql.org/docs/current/indexes-partial.html
