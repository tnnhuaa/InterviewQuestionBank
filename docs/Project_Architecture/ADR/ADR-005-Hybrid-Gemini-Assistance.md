# ADR-005 — Hybrid Gemini Assistance

| Thuộc tính | Giá trị |
|---|---|
| Trạng thái | Accepted for implementation behind feature flags |
| Ngày quyết định | 17/08/2026 |
| Liên quan | US-27–US-30, US-10, US-15–US-16 |

## 1. Bối cảnh

Rule-based analysis và deterministic recommendation của ADR-004 đã tạo được luồng end-to-end, nhưng khả năng hiểu JD Việt/Anh trộn lẫn, giải thích recommendation và hỗ trợ Mentor soạn agenda/feedback còn hạn chế. Hệ thống cần thêm Gemini mà không chuyển nguồn chân lý hoặc mutation nghiệp vụ cho model.

## 2. Quyết định

Áp dụng kiến trúc hybrid:

- Gemini xử lý requirement extraction, taxonomy candidate, explanation, interview agenda draft và feedback draft.
- PostgreSQL, authorization policy, active taxonomy, Published Question, Approved Mentor, deterministic scorer/ranking và booking transaction vẫn là nguồn chân lý.
- Mọi Gemini output là untrusted input, bắt buộc structured JSON, schema validation và domain validation.
- Question/Mentor ID chỉ được chấp nhận khi thuộc candidate set do backend cung cấp.
- Student xác nhận requirement low-confidence/unmapped; Mentor review/edit agenda và feedback trước khi submit.
- Provider failure luôn chuyển sang rule-based/manual flow và không rollback business state đã commit.
- Không triển khai Gemini reranking, AI interviewer/scoring, recording hoặc transcript trong increment này.

## 3. Provider và model

- Provider adapter: `AiProvider`, implementation đầu tiên: `GeminiProvider` dùng SDK server-side `@google/genai`.
- API version: `v1`.
- Model đã chốt: `gemini-3.5-flash-lite`.
- API key chỉ ở backend/secret manager; frontend không có biến `VITE_GEMINI_*`.
- Model/prompt/schema version, input/output hash, latency, token metadata, status và correlation ID được lưu để vận hành; raw JD/prompt/response không vào application log.

## 4. Job và failure policy

AI call chạy qua PostgreSQL job với lease và trạng thái `PENDING`, `PROCESSING`, `SUCCEEDED`, `SUCCEEDED_WITH_FALLBACK`, `FAILED`, `CANCELLED`.

- Hai attempts tối đa, timeout và concurrency có cấu hình.
- Quota ứng dụng thấp hơn provider quota; một Student không được chiếm toàn bộ quota.
- Invalid JSON/schema/evidence/candidate ID bị loại bỏ trước khi ghi domain result.
- Job hết retry tạo operation case có reference ID.
- Circuit breaker cho phép tắt provider và giữ manual/rule-based flow.

## 5. Privacy

- Chỉ gửi corrected text đã xác nhận hoặc booking snapshot tối thiểu.
- Không gửi password/token, original JD file, verification evidence, email, meeting link, recording, transcript hoặc dữ liệu unrelated user.
- Không dùng Google Search/Maps grounding cho các use case này.
- Pilot chỉ bật sau khi review data-processing/retention và sử dụng billing configuration phù hợp dữ liệu thật.

## 6. Hệ quả

### Tích cực

- Hiểu ngôn ngữ tự nhiên tốt hơn mà vẫn giữ deterministic eligibility và mutation.
- UI có explanation/evidence rõ, cùng đường manual recovery khi provider lỗi.
- Có thể đo chất lượng/cost theo từng prompt/model/schema version.

### Tiêu cực

- Thêm external dependency, latency, quota, chi phí và failure modes.
- Gemini output không tuyệt đối deterministic; cần version/hash và human confirmation.
- Cần vận hành AI job, redaction, circuit breaker và operation case.

## 7. Release gate

- Requirement recall và Question precision@10 không thấp hơn baseline, mục tiêu ban đầu `≥80%` trên corpus có nhãn.
- Candidate eligibility `100%`: không trả Question chưa Published hoặc Mentor chưa Approved.
- Provider failure vẫn hoàn thành được flow manual/rule-based.
- Không lộ raw JD hoặc secret trong log/error/support details.
- Feature flags mặc định tắt cho đến khi manual walkthrough tương ứng hoàn tất.

## 8. Liên quan

- [ADR-004 — JD Processing and Question Matching Strategy](ADR-004-JD-Processing-and-Question-Matching.md)
- [Software Architecture](../software_architecture.md)
- [Gemini AI Implementation Plan](../../Implementation/Gemini_AI_Implementation_Plan.md)
