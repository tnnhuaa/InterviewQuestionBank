# Kế hoạch triển khai Gemini AI cho PrepVI

| Thuộc tính | Giá trị |
| --- | --- |
| Trạng thái | Approved for implementation behind feature flags |
| Nguồn thảo luận | `docs/Project_Architecture/Gemini_AI_Integration_Discussion.md` |
| Phạm vi | JD analysis, recommendation explanation, interview agenda và feedback draft |
| Nguyên tắc | Gemini chỉ hỗ trợ; PostgreSQL, policy và deterministic scorer vẫn là nguồn chân lý |

## 1. Điều kiện trước khi triển khai

- ADR-005 là quyết định triển khai hybrid Gemini; ADR-004 tiếp tục giữ rule-based matching làm baseline/fallback.
- Không cho Gemini tự tạo taxonomy, Question, Mentor, slot, booking, feedback chính thức hoặc thay đổi state nghiệp vụ.
- Gemini failure không được chặn Preparation Plan, Booking hoặc Feedback; flow rule-based/manual luôn phải hoạt động.
- Không gửi original JD file, password/token, verification evidence, meeting link, recording hoặc transcript.
- Không triển khai Gemini reranking trong phiên bản đầu. Question score và Mentor order vẫn deterministic.

## 2. Quyết định cấu hình ban đầu

### Model

- Model đã chốt: `gemini-3.5-flash-lite`.
- Dùng model stable cụ thể; không dùng alias `latest`, model preview hoặc experimental trong production.
- Dùng cùng một model cho JD extraction, explanation, agenda và feedback draft ở phiên bản đầu để giảm biến số khi đánh giá.
- Chỉ tách model theo tác vụ sau khi có số liệu latency, token, chi phí và chất lượng trên corpus của nhóm.
- Trên Gemini API Free tier hiện tại, model này có giới hạn hiển thị `15 RPM`, `250K TPM` và `500 RPD`; ứng dụng đặt budget thấp hơn quota provider để dành biên an toàn.

```dotenv
AI_PROVIDER=gemini
AI_ENABLED=false
AI_JD_ANALYSIS_ENABLED=false
AI_RECOMMENDATION_EXPLANATION_ENABLED=false
AI_AGENDA_DRAFT_ENABLED=false
AI_FEEDBACK_DRAFT_ENABLED=false

GEMINI_API_KEY=
GEMINI_MODEL=gemini-3.5-flash-lite
GEMINI_API_VERSION=v1
GEMINI_TIMEOUT_MS=15000
GEMINI_MAX_ATTEMPTS=2
GEMINI_CONCURRENCY=2
GEMINI_TEMPERATURE=0.1
GEMINI_MAX_INPUT_TOKENS=20000
GEMINI_MAX_OUTPUT_TOKENS=4096
GEMINI_DAILY_REQUEST_BUDGET=450
GEMINI_DAILY_INPUT_TOKEN_BUDGET=5000000
GEMINI_CIRCUIT_BREAKER_FAILURE_THRESHOLD=5
GEMINI_CIRCUIT_BREAKER_RESET_SECONDS=60
AI_RESULT_RETENTION_DAYS=30
```

`GEMINI_API_KEY` chỉ tồn tại ở backend/secret manager. Không tạo biến `VITE_GEMINI_*` và không gọi Gemini trực tiếp từ frontend.

### Các quyết định đã hiện thực hóa

- Requirement có confidence dưới `0.75` bắt buộc Student accept/edit/unmapped trước matching.
- JD analysis gửi corrected text đã xác nhận; original file không được gửi cho Gemini.
- Budget ứng dụng mặc định thấp hơn Free tier và có giới hạn riêng theo Student; có thể điều chỉnh bằng biến môi trường.
- Ghi chú feedback draft được mã hóa, xóa sau xử lý hoặc tối đa 24 giờ; metadata/result AI dùng retention theo cấu hình.
- Cả bốn feature được triển khai nhưng mặc định tắt độc lập.
- Feedback giữ rubric cố định `technical/communication/structure` 0–5 trong increment này.
- Admin chỉ có thể tắt khẩn cấp feature qua Operations Queue; việc bật ở deployment vẫn do biến môi trường/secret manager kiểm soát.

## 3. Hiện trạng UI và khoảng trống

| Luồng | Hiện trạng | Thay đổi AI cần thiết |
| --- | --- | --- |
| Upload/paste JD | Đã có | Thông báo dữ liệu nào được xử lý; frontend không giữ API key |
| Review corrected text | Một phần | Tạo analysis job, polling, retry và fallback rule-based |
| Requirement mapping | Một phần | Evidence highlight, confidence, nhãn AI, accept/edit/unmapped |
| Question recommendation | Đã có deterministic flow | Giữ score hiện tại; AI chỉ giải thích candidate đã hợp lệ |
| Preparation Plan | Đã gom Question, next action và Mentor | Chọn topic cần Mentor hỗ trợ; trạng thái explanation |
| Mentor candidates | Đã hard-filter và deterministic rank | AI explanation; không tự tạo/rerank candidate ở bản đầu |
| Mentor detail → Booking | Một phần | Giữ `planId` và selected topic khi qua Mentor detail |
| Booking | Backend đã revalidate plan/expertise/slot | Không giao mutation hoặc state transition cho AI |
| Mentor booking detail | Chưa có AI | CTA tạo agenda draft và editor để Mentor xác nhận |
| Feedback | Manual form đã có | AI draft theo từng field, không ghi đè nội dung Mentor đã nhập |
| Operations | Chưa có AI case | Retry/dismiss/disable feature và reference ID |

## 4. Kiến trúc triển khai

```text
AI route/controller
  → AI application service
    → prompt/schema registry
      → AiProvider interface
        → GeminiProvider
```

- Dùng SDK server-side `@google/genai`, Gemini API `v1` và structured JSON output.
- Mọi output phải qua JSON Schema/Zod và domain validation.
- Evidence span phải nằm trong corrected text.
- Taxonomy ID/slug phải tồn tại và active.
- Question/Mentor ID phải thuộc candidate set do backend cung cấp.
- Prompt coi nội dung JD là untrusted data và không cho instruction trong JD thay đổi system policy.
- Circuit breaker chuyển sang rule-based/manual flow khi provider lỗi liên tiếp.

## 5. Migration và dữ liệu

Thêm chuỗi migration AI:

- `005_gemini_ai_assistance.sql`: `ai_jobs`, `ai_runs`, requirement decisions, explanation và draft tables.
- `006_ai_private_draft_inputs.sql`: input ghi chú Mentor được mã hóa và có thời hạn tối đa 24 giờ.
- `007_ai_operations.sql`: feature control có version cho thao tác tắt khẩn cấp được audit.
- `ai_jobs`: kind, resource, status, attempt, processing lease, available time và safe error code.
- `ai_runs`: provider, model, prompt/schema version, input/output hash, latency, token/cost metadata và correlation ID.
- `ai_requirement_decisions`: Student accept/edit/unmapped cho requirement.
- `ai_recommendation_explanations`: explanation gắn với candidate ID hợp lệ.
- `interview_agenda_drafts`.
- `feedback_drafts`.

Trạng thái job:

```text
PENDING → PROCESSING → SUCCEEDED
                     → SUCCEEDED_WITH_FALLBACK
                     → FAILED
                     → CANCELLED
```

Không lưu raw prompt/response trong application log. Database ưu tiên lưu normalized result đã validate, hash và metadata điều tra.

## 6. Vertical slices

### Slice A — AI foundation

- Feature flags, Gemini adapter, prompt/schema registry và redaction.
- Job runner có lease, retry tối đa hai lần, timeout, quota và circuit breaker.
- OpenAPI contract cho job status, result metadata và recovery.
- Error code: `AI_TIMEOUT`, `AI_QUOTA_EXCEEDED`, `AI_INVALID_OUTPUT`, `AI_DISABLED`, `AI_PROVIDER_FAILURE`.

### Slice B — JD analysis

```http
POST  /job-descriptions/{id}/analysis-jobs
GET   /ai-jobs/{jobId}
POST  /ai-jobs/{jobId}/retry
GET   /job-descriptions/{id}/analysis
PATCH /job-descriptions/{id}/requirements/{requirementId}
```

1. Student xác nhận corrected text.
2. Backend tạo idempotent job từ resource version, input hash, prompt/schema/model version.
3. Gemini trích xuất requirement, evidence và taxonomy candidate.
4. Backend validate và lưu normalized result.
5. Student xác nhận low-confidence/unmapped requirement.
6. Question matcher tiếp tục dùng scorer `40/30/15/15`, threshold `60` và deterministic tie-break.
7. Nếu Gemini lỗi, worker chạy analyzer rule-based hiện tại và trả `SUCCEEDED_WITH_FALLBACK`.

### Slice C — Smart Plan và Mentor explanation

- Giữ Question scorer và Mentor ranking hiện tại.
- Chỉ gửi candidate set đã hard-filter cùng public expertise, topic overlap và goal tối thiểu.
- Gemini trả explanation theo ID thuộc candidate set.
- UI phân biệt rõ “Điểm phù hợp do quy tắc hệ thống” và “Giải thích được AI hỗ trợ”.
- Khi AI lỗi vẫn hiển thị deterministic reason hiện tại.

Luồng UI:

```text
Preparation Plan
→ Chọn topic cần Mentor hỗ trợ
→ Xem candidate hợp lệ
→ Xem Mentor detail giữ planId/topicIds
→ Chọn slot
→ Backend revalidate và tạo Booking
```

### Slice D — Agenda và feedback draft

```http
POST  /bookings/{id}/agenda-drafts
PATCH /bookings/{id}/agenda-drafts/{draftId}
POST  /bookings/{id}/feedback-drafts
PATCH /bookings/{id}/feedback-drafts/{draftId}
```

- Mentor chủ động yêu cầu draft.
- Agenda chỉ dùng role/seniority, topic, goal và Question Published trong booking snapshot.
- Feedback draft chỉ hỗ trợ điền rubric/strengths/weaknesses/next actions.
- Không ghi đè nội dung Mentor đã nhập.
- Mentor phải review và submit bằng mutation feedback hiện có.
- Student vẫn chủ động chọn `actionIds` để cập nhật plan.

### Slice E — Operations và rollout

- AI job hết retry tạo operation case với reference ID.
- Admin action allowlist: `RETRY_AI_JOB`, `DISMISS`, `DISABLE_FEATURE`.
- Rollout lần lượt local → staging → pilot nhỏ.
- Chỉ xem xét Gemini reranking sau khi có labeled dataset và tiêu chí so sánh với deterministic baseline.

## 7. Manual validation và release gate

Không thêm automated-test implementation theo phạm vi đã khóa. Walkthrough thủ công cần bao gồm:

- JD tiếng Việt, tiếng Anh và nội dung trộn hai ngôn ngữ.
- Low-confidence, unmapped và evidence span không hợp lệ.
- Prompt injection được nhúng trong JD.
- Gemini timeout, `429`, `503`, invalid JSON và safety block.
- Question chưa Published và Mentor chưa Approved không bao giờ xuất hiện.
- Booking revalidation vẫn bảo đảm chỉ một transaction chiếm slot.
- AI failure không làm mất corrected text, Mentor note hoặc feedback form state.
- User khác không đọc được AI result của JD/plan/booking.
- Tắt toàn bộ feature flags vẫn hoàn thành flow rule-based/manual end-to-end.

Release gate:

- Requirement extraction và Question precision@10 không thấp hơn baseline; mục tiêu ban đầu `≥80%` trên corpus có nhãn.
- Candidate eligibility đạt `100%`.
- Có evidence cho latency, token/cost, invalid-output, low-confidence và fallback rate.
- Không còn Critical/High defect trong AI flow hoặc fallback flow.

## 8. Thứ tự commit/PR

1. `docs: approve hybrid Gemini architecture`
2. `feat(ai): add provider adapter and job persistence`
3. `feat(jd): add AI-assisted requirement analysis`
4. `feat(plan): add recommendation explanations`
5. `feat(interview): add agenda and feedback drafts`
6. `feat(operations): add AI recovery and feature controls`
7. `docs: add manual AI validation evidence`

Mỗi feature mặc định `false` cho đến khi migration, OpenAPI, UI fallback và walkthrough tương ứng hoàn tất.

## 9. Tài liệu Gemini tham khảo

- [Models](https://ai.google.dev/gemini-api/docs/models)
- [API versions](https://ai.google.dev/gemini-api/docs/api-versions)
- [Structured outputs](https://ai.google.dev/gemini-api/docs/structured-output)
- [API key security](https://ai.google.dev/gemini-api/docs/generate-content/api-key)
- [Gemini API Terms](https://ai.google.dev/gemini-api/terms)
- [Zero Data Retention](https://ai.google.dev/gemini-api/docs/zdr)
