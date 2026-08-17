# Các tính năng MVP/R1 còn cần hoàn thiện

## Trạng thái triển khai ngày 17/08/2026

Các hạng mục code trong checklist này đã được triển khai trên `feat/r1-completion`: plan item versioning, plan-based Mentor discovery xếp hạng deterministic theo topic overlap → position fit → future slot → rating → Mentor ID, server-side expertise/ownership checks, immutable booking context, external meeting-link recovery, structured feedback/action application, completion dispute và review moderation. Các luồng đã được wiring bằng ID thật ở frontend và được bổ sung migration/seed tương ứng.

Trạng thái còn lại trước khi Product Owner đóng checklist là **manual/UAT evidence**: chạy walkthrough ba persona, lưu screenshot/correlation ID và đối chiếu database, audit, outbox. Vì vậy file này vẫn được giữ làm checklist E2E; “đã triển khai” không tự động đồng nghĩa “đã được PO chấp nhận”.

| Hạng mục | Backend/DB | Frontend wiring | Manual evidence |
| --- | --- | --- | --- |
| Plan → Question/self-practice/Mentor | Đã triển khai | Đã triển khai | Chờ walkthrough |
| Mentor discovery + expertise validation | Đã triển khai | Đã triển khai | Chờ walkthrough |
| Booking context snapshot | Đã triển khai | Đã triển khai | Chờ permission/version evidence |
| External meeting link + recovery | Đã triển khai | Đã triển khai | Chờ happy/failure evidence |
| Structured feedback + action application | Đã triển khai | Đã triển khai | Chờ duplicate/permission evidence |
| Review + completion dispute | Đã triển khai | Đã triển khai | Chờ publication-window evidence |

> **Mục đích:** Danh sách tạm thời các tính năng còn thiếu hoặc chưa hoàn chỉnh end-to-end nhưng thuộc phạm vi MVP/R1 hiện tại.  
> **Nguồn phạm vi:** Architecture, Future State Workflow và Product Backlog (`US-10`, `US-14–17`, `US-30`).  
> **Lưu ý:** Chỉ có thể coi một mục hoàn thành sau khi backend policy, frontend wiring, database/audit và manual walkthrough đều có evidence phù hợp.

## 1. Preparation Plan liên kết Question và Mentor

Preparation Plan phải là cầu nối giữa kết quả JD matching, self-practice và Mentor Discovery.

### Cần hoàn thiện

- Hiển thị các Question `PUBLISHED` Student đã chọn từ kết quả matching.
- Giữ requirement, normalized topic, question group, priority và practice state tương ứng.
- Cho Student chọn tiếp tục tự luyện hoặc chuyển sang tìm Mentor từ chính plan.
- Truyền `preparationPlanId` và context cần thiết qua các màn hình, không dùng demo ID hoặc dữ liệu hard-code.
- Khi JD corrected text hoặc matching version thay đổi, phát hiện plan/context cũ và yêu cầu Student xác nhận trước khi tiếp tục.

### Tiêu chí hoàn thành

- Student đi được luồng `JD → Question matching → Preparation Plan → Self-practice/Mentor Discovery` bằng ID thật.
- User khác không đọc hoặc sử dụng được JD/plan của Student.
- Không cần bắt buộc Question và Mentor nằm trên cùng một trang; điều kiện là hành trình end-to-end hoạt động rõ ràng.

## 2. Mentor Discovery lấy topic từ Preparation Plan (`US-10`)

Mentor Discovery phải sử dụng topic/position/goal đã xác nhận trong Preparation Plan thay vì yêu cầu Student nhập lại toàn bộ context.

### Cần hoàn thiện

- Khi mở từ plan, frontend gửi `preparationPlanId` hoặc các topic ID đã được backend cấp quyền đọc.
- Backend tự lấy topic/position từ plan thuộc Student.
- Chỉ trả Mentor `APPROVED` với `MentorExpertise` đã được duyệt.
- Lọc theo topic/position và future slot khả dụng.
- Cho phép Student điều chỉnh topic, khoảng thời gian hoặc tiếp tục self-practice khi không có kết quả.
- Không để Mentor không phù hợp xuất hiện chỉ vì rating cao.

### Tiêu chí hoàn thành

- Kết quả chỉ chứa Mentor đã duyệt, expertise phù hợp và slot hợp lệ.
- Empty state hướng dẫn Student thay topic/thời gian hoặc quay lại luyện câu hỏi.
- Manual walkthrough chứng minh topic trong plan được truyền đúng đến truy vấn Mentor.

## 3. Backend kiểm tra Mentor expertise khớp Preparation Plan

UI filter không phải security hoặc business-policy boundary. Booking service phải kiểm tra lại topic fit phía server trong transaction.

### Cần hoàn thiện

- Xác minh Student sở hữu `jobDescriptionId`/`preparationPlanId`.
- Đọc topic/position hợp lệ từ plan hoặc JD analysis đã xác nhận.
- Xác minh Mentor và expertise đều ở trạng thái `APPROVED`.
- Yêu cầu có ít nhất một expertise topic/position giao với context được chọn.
- Xác minh slot thuộc đúng Mentor, còn khả dụng và không nằm trong quá khứ.
- Trả lỗi an toàn, có recovery instruction khi topic hoặc slot không còn phù hợp.

### Error UX dự kiến

- Expertise không còn hợp lệ: yêu cầu quay lại danh sách Mentor.
- Slot vừa bị chiếm: yêu cầu chọn slot khác.
- Plan đã thay đổi version: tải lại plan và xác nhận context mới.
- Không tiết lộ dữ liệu Mentor/JD/plan mà actor không có quyền xem.

## 4. Booking mang đúng JD/Plan/Question context (`US-30`)

Booking phải tham chiếu đúng ngữ cảnh chuẩn bị của Student để Mentor biết phạm vi mock interview.

### Cần hoàn thiện

- Booking lưu `job_description_id` hoặc `preparation_plan_id` thuộc đúng Student.
- Context Mentor nhận được chỉ gồm dữ liệu tối thiểu:
  - corrected JD text khi cần;
  - role/seniority;
  - topic đã chọn;
  - nhóm Question trong plan;
  - mục tiêu và loại buổi luyện.
- Không chia sẻ original JD file, credential, AI prompt/output, dữ liệu nhận dạng không cần thiết hoặc context của Student khác.
- Context cần có version/snapshot phù hợp để thay đổi plan sau đó không làm booking đã xác nhận trở nên mơ hồ.

### Tiêu chí hoàn thành

- Mentor của booking xem đúng context; Mentor khác và user không liên quan nhận `404 RESOURCE_NOT_FOUND`.
- Booking không được tạo nếu plan/JD không thuộc Student hoặc không phù hợp Mentor/slot.
- Audit ghi actor, booking/context ID và outcome an toàn nhưng không ghi raw JD.

## 5. External meeting link (`US-14`)

MVP sử dụng external meeting provider; không tích hợp video trực tiếp.

### Cần hoàn thiện/kiểm chứng

- Mentor của booking `CONFIRMED` tạo hoặc cập nhật HTTPS meeting link theo cutoff.
- Meeting link được mã hóa khi lưu và chỉ hai bên xem trong cửa sổ được phép.
- Student và Mentor có màn hình tham gia mock interview.
- Khi link lỗi, tạo operation case; Mentor có 15 phút cung cấp link thay thế.
- Nếu không khắc phục được, UI cung cấp reschedule rõ ràng và không tự thay đổi booking state.
- Provider hoặc notification lỗi không rollback booking đã commit.

### Tiêu chí hoàn thành

- Unrelated user không xem được meeting link.
- Link hết hạn không còn được trả qua API.
- Có manual evidence cho happy path, link lỗi, replacement và reschedule fallback.

## 6. Mentor gửi feedback có cấu trúc (`US-15`)

Sau mock interview, Mentor phải cung cấp đánh giá chuyên môn có thể hành động.

### Cần hoàn thiện/kiểm chứng

- Chỉ Mentor sở hữu booking được đánh dấu `COMPLETED` sau giờ kết thúc.
- Mỗi booking `COMPLETED` chỉ có một feedback.
- Feedback gồm:
  - rubric scores;
  - điểm mạnh;
  - điểm cần cải thiện;
  - next actions;
  - topic/question reference khi phù hợp.
- Validate rubric, độ dài và nội dung bắt buộc ở backend.
- Gửi notification cho Student nhưng lỗi notification không rollback feedback.

### Tiêu chí hoàn thành

- Không tạo feedback trước `COMPLETED` hoặc cho booking không thuộc Mentor.
- Feedback riêng tư, có audit và không xuất hiện trong public review.
- Submit trùng không tạo feedback thứ hai.

## 7. Student xem feedback và áp dụng next action (`US-16`)

Feedback phải quay lại Preparation Plan bằng thao tác xác nhận riêng của Student.

### Cần hoàn thiện/kiểm chứng

- Student thuộc booking xem rubric, strengths, weaknesses và next actions.
- Student chọn từng action muốn áp dụng; hệ thống không tự thay đổi plan khi Mentor gửi feedback.
- Backend kiểm tra action còn thuộc feedback hiện hành và plan thuộc Student.
- Action đã chọn trở thành plan item hoặc cập nhật priority/practice state phù hợp.
- Tránh tạo plan item trùng khi Student gửi lại cùng thao tác.

### Tiêu chí hoàn thành

- Luồng `COMPLETED → Feedback → Student confirmation → Preparation Plan update` hoạt động bằng ID thật.
- Student khác không xem hoặc áp dụng được feedback.
- Có audit cho số action được áp dụng, không sao chép toàn bộ feedback vào log.

## 8. Student review Mentor (`US-17`)

Review chất lượng Mentor là dữ liệu riêng với feedback chuyên môn Mentor gửi cho Student.

### Cần hoàn thiện/kiểm chứng

- Chỉ Student của booking `COMPLETED` được tạo review.
- Tối đa một review cho mỗi booking.
- Review gồm rating hợp lệ và comment có giới hạn độ dài.
- Review chỉ public sau 24 giờ không có dispute hoặc sau quyết định Admin.
- Dispute giữ review chưa public; Admin decision phải có reason và audit.

### Tiêu chí hoàn thành

- Không review booking chưa hoàn tất hoặc booking của user khác.
- Không tạo review trùng.
- Public Mentor profile chỉ hiển thị review đủ điều kiện công khai.

## 9. Manual walkthrough bắt buộc

Chạy end-to-end bằng demo seed và lưu correlation ID/audit evidence:

```text
Student nhập JD
→ xác nhận corrected text
→ nhận/chọn Question
→ tạo Preparation Plan
→ tìm Mentor theo topic plan và slot
→ tạo booking có context
→ Mentor confirm và cung cấp meeting link
→ hai bên tham gia mock interview
→ Mentor mark COMPLETED và gửi feedback
→ Student áp dụng next action vào plan
→ Student review Mentor
```

Phải kiểm tra thêm permission denied, plan version conflict, Mentor expertise thay đổi, slot conflict, link lỗi, provider failure, submit feedback/review trùng và dispute window.

## 10. Ngoài điều kiện hoàn thành MVP/R1 hiện tại

Các hạng mục sau không được dùng để chặn hoàn thành các tính năng bắt buộc phía trên:

- Bắt buộc Question và Mentor phải được trình bày trên cùng một trang “Smart Preparation Plan”. Đây là lựa chọn UX; nhiều màn hình vẫn hợp lệ nếu luồng end-to-end rõ ràng.
- Gemini phân tích JD, tạo explanation hoặc rerank Question/Mentor. `ADR-004` hiện vẫn xác định LLM ngoài baseline; muốn triển khai phải có change request/ADR và feature flag riêng.
- Gemini hỗ trợ soạn feedback hoặc tự đánh giá Student.
- Video meeting tích hợp, recording hoặc transcript.
- AI tự thay đổi Question, Mentor, booking state, feedback hoặc Preparation Plan.
