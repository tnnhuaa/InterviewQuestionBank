# Đề xuất thảo luận: Gemini hỗ trợ Smart Preparation Plan

> **Trạng thái:** Đề xuất để nhóm thảo luận, chưa phải quyết định kiến trúc đã phê duyệt.<br>
> **Phạm vi:** Kết hợp (1) JD → Question Bank, (2) Preparation Plan → Mentor và vòng lặp (3) mock interview → feedback → cập nhật kế hoạch.<br>
> **Nguyên tắc:** Gemini là thành phần tư vấn; application, rule nghiệp vụ và PostgreSQL vẫn là nguồn quyết định cuối cùng.

## 1. Bối cảnh

Thiết kế R1 hiện tại dùng quy tắc có version để phân tích JD và ánh xạ câu hỏi. Luồng chuẩn là:

```text
JD → extract/OCR → Student sửa và xác nhận corrected_text
   → phân tích requirement → chuẩn hóa taxonomy
   → ánh xạ Question PUBLISHED → Preparation Plan
   → tự luyện hoặc tìm Mentor phù hợp
   → mock interview → feedback → cập nhật Preparation Plan
```

`ADR-004` hiện xếp Generative/LLM recommendation ngoài phạm vi R1 nhằm bảo đảm chi phí thấp, riêng tư, giải thích được và deterministic. Vì vậy, việc dùng Gemini cần được xem là một thay đổi kiến trúc và phạm vi, phải được nhóm và Product Owner chấp thuận trước khi triển khai production.

## 2. Quyết định được đề xuất

Áp dụng kiến trúc **hybrid**:

- Gemini xử lý phần ngôn ngữ tự nhiên: trích xuất requirement, đề xuất taxonomy và tạo lời giải thích.
- Hệ thống chỉ chấp nhận dữ liệu Gemini đúng JSON schema và đi qua validation.
- Student xác nhận các kết quả không chắc chắn hoặc chưa ánh xạ.
- Backend thực hiện toàn bộ hard filter, authorization, scoring chính thức và mutation.
- Khi Gemini không khả dụng, hệ thống tiếp tục hoạt động bằng rule-based flow và thao tác thủ công.

Gemini không được là nguồn quyết định cho Question lifecycle, Mentor approval, quyền truy cập, availability, slot locking hoặc booking state.

## 3. Luồng Smart Preparation Plan tổng thể

Hai loại đề xuất nên được kết hợp ở cấp độ trải nghiệm và Preparation Plan, nhưng không gộp thành một lần gọi Gemini hoặc một thuật toán duy nhất.

```text
                               ┌─→ Question Matching → Self-practice
JD → JDAnalysisResult → Plan ──┤
                               └─→ Mentor Discovery → Mock interview
                                                           │
                                                           ↓
                                              Feedback → Plan update
```

`JDAnalysisResult` là artifact dùng chung, có version và gồm:

- Requirement cùng source evidence.
- Role, seniority, skill và technology.
- Normalized topic/position và confidence.
- Analysis version, prompt/schema version và input/output hash.

Question Matching và Mentor Discovery là hai domain service độc lập cùng đọc artifact/plan này. Một `Recommendation Orchestrator` có thể tổng hợp kết quả để frontend hiển thị chung, nhưng không được thay thế validation của từng service.

Không yêu cầu Gemini trả đồng thời danh sách Question và Mentor trong cùng một response. Question/Mentor có thể đổi trạng thái sau khi AI chạy; backend phải truy vấn lại dữ liệu hiện hành trước khi hiển thị hoặc mutation.

### Trải nghiệm UI đề xuất

Một Preparation Plan hiển thị ba nhóm rõ ràng:

1. **Câu hỏi nên tự luyện:** Question `PUBLISHED` đã qua scorer và được Student chọn.
2. **Chủ đề nên luyện với Mentor:** topic/goal mà Student xác nhận cần hỗ trợ hoặc mock interview.
3. **Mentor phù hợp:** Mentor đã duyệt, có expertise và slot khớp với plan.

Không bắt buộc đề xuất Mentor cho mọi JD. Nhánh Mentor được mở khi Student chủ động chọn, muốn mock interview, đánh dấu topic khó, thiếu Question phù hợp hoặc cần hỗ trợ sau khi luyện.

## 4. Tính năng 1: JD → Question Bank

### Luồng đề xuất

```text
corrected_text đã được Student xác nhận
→ Gemini trích xuất requirement, role, seniority, skill và evidence span
→ Gemini đề xuất taxonomy candidate cùng confidence
→ Backend validate schema và đối chiếu active taxonomy/alias
→ Student xác nhận mục low-confidence hoặc unmapped
→ Backend lấy candidate Question PUBLISHED
→ scorer có version xếp hạng
→ Student chọn câu hỏi để tạo Preparation Plan
```

### Trách nhiệm của Gemini

- Hiểu JD tiếng Việt, tiếng Anh hoặc nội dung trộn hai ngôn ngữ.
- Trích xuất requirement dưới dạng dữ liệu có cấu trúc.
- Giữ source evidence bằng đoạn trích hoặc vị trí ký tự trong `corrected_text`.
- Đề xuất taxonomy candidate và confidence; không tự tạo taxonomy.
- Có thể tạo lời giải thích dễ hiểu cho các match đã được backend xác nhận.

### Trách nhiệm của hệ thống

- Chỉ gửi `corrected_text` đã xác nhận, không gửi file JD gốc nếu không cần thiết.
- Chỉ lấy Question `PUBLISHED` có taxonomy và provenance hợp lệ.
- Giữ scorer R1 `40/30/15/15`, ngưỡng `60`, tối đa `10` câu/JD và `3` câu/requirement trong giai đoạn đầu.
- Áp dụng deterministic tie-break và lưu matching-rule version/result hash.
- Giữ requirement không chắc chắn ở trạng thái `unmapped`; không bịa topic hoặc câu hỏi.
- Cho Student sửa requirement, chọn taxonomy hoặc tìm Question Bank thủ công.

Không nên dùng Gemini để sinh câu hỏi mới trực tiếp trong luồng này. Việc tạo nội dung mới, nếu có, phải là một workflow quản trị riêng và vẫn đi qua `DRAFT → IN_REVIEW → PUBLISHED`.

## 5. Tính năng 2: Preparation Plan → Mentor

### Luồng đề xuất

```text
Preparation Plan đã có topic/position/goal chuẩn hóa
→ Backend lọc Mentor APPROVED
→ lọc MentorExpertise APPROVED khớp topic/position
→ lọc future slot còn khả dụng
→ deterministic ranking
→ Gemini giải thích hoặc rerank nhẹ trong tập candidate hợp lệ
→ Student tự chọn Mentor
→ Booking service kiểm tra lại toàn bộ invariant trong transaction
```

### Trách nhiệm của Gemini

- Hiểu mục tiêu luyện tập do Student nhập.
- Đề xuất mức ưu tiên giữa các topic đã có trong plan.
- Giải thích vì sao từng Mentor phù hợp dựa trên public profile/expertise đã được duyệt.
- Có thể rerank một tập candidate đã qua hard filter nếu nhóm quyết định cần semantic ranking.

### Trách nhiệm của hệ thống

- Chỉ trả Mentor và expertise ở trạng thái `APPROVED`.
- Kiểm tra topic/position fit, availability, timezone và slot conflict.
- Không gửi verification evidence, email, meeting link hoặc thông tin riêng tư của Mentor cho Gemini.
- Kiểm tra Student sở hữu JD/plan và Mentor phù hợp với context khi tạo booking.
- Không cho Gemini tạo slot, xác nhận booking hoặc thay đổi booking state.

Trong phiên bản đầu, deterministic ranking cộng với lời giải thích do Gemini tạo là đủ. Chỉ thêm Gemini reranking sau khi có labeled dataset và tiêu chí đánh giá rõ ràng.

## 6. Mock interview → Feedback → cập nhật kế hoạch

### Luồng nghiệp vụ

```text
Student chọn Mentor/slot từ Preparation Plan
→ tạo Booking mang JD/plan context và goal
→ Mentor xem context tối thiểu rồi confirm/reschedule/reject
→ Mentor cung cấp external meeting link
→ Student và Mentor tham gia mock interview
→ sau giờ kết thúc, Mentor đánh dấu COMPLETED
→ Mentor gửi feedback có cấu trúc
→ Student xem feedback và chọn next action áp dụng vào plan
→ tiếp tục self-practice hoặc đặt buổi tiếp theo
```

Booking phải snapshot/tham chiếu đúng `job_description_id`, `preparation_plan_id`, topic, question group và goal thuộc Student. Trước khi tạo booking, backend kiểm tra lại Mentor `APPROVED`, expertise phù hợp, slot khả dụng và ownership trong transaction.

Mentor chỉ nhận context tối thiểu cần cho mock interview:

- `corrected_text` đã xác nhận khi thật sự cần thiết.
- Role/seniority và topic đã chọn.
- Nhóm Question `PUBLISHED` trong plan.
- Mục tiêu hoặc loại buổi luyện do Student xác nhận.

Mentor không được xem original JD file, AI prompt/output nội bộ, verification evidence hoặc dữ liệu không liên quan.

### Meeting và xử lý sự cố

- R1 dùng meeting link bên ngoài; không tích hợp video, ghi âm hoặc transcript tự động.
- Chỉ hai bên booking xem được link trong cửa sổ được phép.
- Mentor quản lý link theo cutoff hiện hành; nếu link lỗi, Mentor có 15 phút thay link.
- Nếu không có link thay thế, hệ thống mở reschedule/operation case rõ ràng và không tự đổi booking state.
- Provider meeting hoặc notification lỗi không được rollback booking đã commit.

### Feedback và đánh giá

- Mentor chỉ được đánh dấu `COMPLETED` sau giờ kết thúc.
- Mỗi booking `COMPLETED` chỉ có một feedback từ Mentor.
- Feedback gồm rubric score, điểm mạnh, điểm cần cải thiện và next actions; có thể tham chiếu topic/question trong plan.
- Student xem feedback riêng tư và chủ động chọn next action để thêm vào Preparation Plan; feedback không tự sửa plan.
- Review của Student dành cho chất lượng Mentor là đối tượng riêng với feedback chuyên môn.
- Student có thể dispute completion trong cửa sổ chính sách; review chưa public cho đến khi hết cửa sổ hoặc Admin giải quyết.

### Vai trò tùy chọn của Gemini

Gemini có thể hỗ trợ trước và sau buổi mock interview, nhưng Mentor vẫn là người chịu trách nhiệm cho đánh giá cuối:

- Trước buổi gặp: đề xuất agenda và Question `PUBLISHED` từ plan để Mentor lựa chọn.
- Sau buổi gặp: giúp Mentor chuyển ghi chú đã nhập thành feedback có cấu trúc hoặc đề xuất next action.
- Mentor phải review, sửa và xác nhận trước khi submit; không tự động gửi feedback cho Student.
- Không gửi meeting link, recording hoặc transcript cho Gemini. Nếu tương lai xử lý transcript, cần consent và privacy decision riêng, không thuộc đề xuất hiện tại.

Gemini không được tự đánh dấu `COMPLETED`, quyết định no-show/dispute, chấm điểm Student không có Mentor xác nhận hoặc tự cập nhật Preparation Plan.

## 7. Contract AI tối thiểu

Gemini phải trả structured JSON; output dạng prose không được dùng trực tiếp để ghi dữ liệu nghiệp vụ. Ví dụ rút gọn:

```json
{
  "requirements": [
    {
      "text": "Experience building reusable React components",
      "sourceStart": 152,
      "sourceEnd": 197,
      "kind": "SKILL",
      "taxonomyCandidate": "react",
      "confidence": 0.94
    }
  ]
}
```

Backend cần kiểm tra:

- JSON schema và giới hạn độ dài/số lượng phần tử.
- Evidence span thật sự nằm trong input.
- Taxonomy ID/slug tồn tại và đang active.
- Confidence threshold và rule yêu cầu Student xác nhận.
- Không có ID câu hỏi/Mentor ngoài candidate set do backend cung cấp.

Mỗi AI run nên lưu metadata phục vụ tái hiện và vận hành: provider, model identifier, prompt version, schema version, input hash, output hash, trạng thái, latency, token/cost metadata nếu có và correlation ID. Không ghi API key hoặc raw JD vào log.

## 8. Fallback và thao tác thủ công

Gemini failure không được chặn Preparation Plan hoặc Booking.

| Tình huống | Hành vi bắt buộc |
|---|---|
| Timeout, quota hoặc provider unavailable | Dùng rule-based analysis/filter và thông báo có thể tiếp tục thủ công |
| JSON sai schema | Bỏ output, retry an toàn theo cùng input hash hoặc chuyển sang manual flow |
| Confidence thấp | Hiển thị evidence và yêu cầu Student chọn/sửa taxonomy |
| Không có Question đạt ngưỡng | Hiển thị coverage gap; không tự hạ threshold |
| Không có Mentor phù hợp | Cho đổi topic/thời gian hoặc tiếp tục self-practice |
| Meeting link lỗi | Mentor thay link trong 15 phút; nếu thất bại thì mở reschedule/operation case |
| Gemini hỗ trợ feedback lỗi | Mentor nhập và gửi feedback thủ công; không mất ghi chú đã lưu cục bộ an toàn trên form |
| AI job hết retry | Tạo operation case với reference ID, không làm mất dữ liệu đã xác nhận |

Thông báo lỗi cần hướng dẫn hành động cụ thể, ví dụ: “Phân tích nâng cao tạm thời không khả dụng. Bạn vẫn có thể xác nhận kỹ năng và tìm câu hỏi thủ công.” Không hiển thị prompt, credential, raw request hoặc dữ liệu riêng tư trong support details.

## 9. Bảo mật và quyền riêng tư

- API key chỉ tồn tại ở backend/secret manager; frontend không gọi Gemini trực tiếp.
- Chỉ gửi trường dữ liệu tối thiểu cần thiết và redaction thông tin nhận dạng nếu có thể.
- Không gửi password, session/token, original JD file, verification evidence, meeting link hoặc dữ liệu của user không liên quan.
- Không lưu JD hoặc AI payload trong application log, analytics hay error report.
- Xác minh điều khoản data processing, retention và model-training của cấu hình/provider trước pilot.
- Áp dụng timeout, rate limit, quota/cost ceiling và circuit breaker.
- AI output luôn được xem là untrusted input và phải chống prompt injection trước khi dùng.
- Quyền xem AI result tuân theo ownership của JD/plan/booking hiện có.
- Không ghi âm, tạo transcript hoặc gửi nội dung cuộc họp cho Gemini trong phạm vi hiện tại.

## 10. Thay đổi tài liệu và contract cần thiết

Trước khi triển khai cần cập nhật:

1. **ADR mới:** thay đổi hoặc bổ sung `ADR-004`, ghi rõ lý do chọn hybrid, phạm vi Gemini, fallback và tiêu chí rollback.
2. **Software Architecture:** thêm AI provider adapter/job boundary, data flow, trust boundary và failure mode.
3. **Scope/Backlog:** xác định Gemini thuộc R1 hay feature flag sau R1; mô tả Smart Preparation Plan xuyên suốt Question, Mentor, mock interview và feedback mà không ngầm thay đổi AC cũ.
4. **Acceptance Criteria:** bổ sung schema validity, evidence accuracy, confidence/manual confirmation, fallback, latency, precision/recall, mentor eligibility, booking context và privacy.
5. **OpenAPI:** thêm AI job status/result metadata, endpoint tổng hợp recommendation và error/recovery code; Question, Mentor, booking và feedback mutation vẫn là contract độc lập.
6. **Database:** thêm versioned AI run/decision metadata; liên kết requirement/result bằng ID và hash; feedback next action tham chiếu plan/topic/question khi phù hợp, không phụ thuộc prose hoặc AI response.
7. **Operations:** thêm dashboard/case cho timeout, invalid output, quota và provider failure; có nút retry an toàn.
8. **Manual validation:** bổ sung JD song ngữ, alias lạ, prompt injection, output sai schema, provider offline, mentor no-result và walkthrough đầy đủ plan → booking → meeting → feedback → plan update.
9. **Seed:** thêm dữ liệu demo cho mapped/unmapped/low-confidence requirement, AI job failed, booking mock interview, meeting-link failure, feedback và next action; reference seed không phụ thuộc Gemini.

## 11. Tiêu chí đánh giá đề xuất

- Requirement extraction recall và Question precision@10 không thấp hơn baseline đã duyệt; mục tiêu ban đầu vẫn là `≥80%` trên labeled corpus.
- Evidence span hợp lệ và kết quả giải thích được cho mọi recommendation được hiển thị.
- Candidate eligibility chính xác `100%`: không lộ Question chưa Published hoặc Mentor chưa Approved.
- Booking recommendation phải kiểm tra lại topic fit, ownership và slot availability; chỉ một transaction được chiếm slot.
- Mentor feedback chỉ xuất hiện sau `COMPLETED`, thuộc đúng booking và Student áp dụng next action bằng thao tác xác nhận riêng.
- Provider failure vẫn cho phép hoàn thành manual flow.
- Cùng input/prompt/model/schema version có metadata đủ để điều tra khác biệt; không cam kết Gemini output tuyệt đối deterministic.
- Đo riêng latency, token/cost, invalid-output rate, low-confidence rate và fallback rate.

## 12. Lộ trình đề xuất

1. **Giai đoạn A:** Gemini chỉ trích xuất requirement và đề xuất taxonomy; scorer câu hỏi giữ nguyên.
2. **Giai đoạn B:** hoàn thiện Smart Preparation Plan UI và wiring plan topic → Mentor filter → booking context.
3. **Giai đoạn C:** Gemini tạo explanation cho Question/Mentor và hỗ trợ Mentor soạn feedback để Mentor xác nhận.
4. **Giai đoạn D:** thử nghiệm mentor/question reranking sau feature flag trên labeled dataset.
5. Chỉ đưa từng giai đoạn vào pilot khi đạt acceptance criteria và manual fallback đã được walkthrough.

## 13. Mức độ xử lý hiện tại

Luồng booking → external meeting → feedback đã được mô tả trong architecture và đã có baseline backend/frontend:

- Booking mang JD/Preparation Plan context và có state machine.
- Mentor có màn hình xác nhận booking và quản lý meeting link.
- Student có màn hình tham gia phòng phỏng vấn/báo link lỗi.
- Mentor chỉ submit feedback sau `COMPLETED` với rubric, strengths, weaknesses và next actions.
- Student xem feedback, chọn next action áp dụng về plan và có thể review Mentor.

Các phần còn cần hoàn thiện/kiểm chứng trước khi coi là end-to-end hoàn chỉnh:

- Smart Preparation Plan chưa tổng hợp hai nhánh Question và Mentor trong cùng trải nghiệm.
- Mentor UI chưa luôn nhận plan ID để tự suy ra topic; hiện vẫn có đường chọn topic thủ công.
- Booking service cần enforce expertise/topic overlap với plan thay vì chỉ kiểm tra ownership và slot.
- Chưa có Gemini adapter/job, AI contract, feature flag hoặc AI-assisted feedback.
- Meeting vẫn là external link; không có integrated video, recording, transcript hoặc AI đánh giá trực tiếp.
- Cần manual walkthrough và database/audit/outbox evidence cho toàn bộ vòng lặp.

## 14. Các câu hỏi nhóm cần quyết định

- Gemini chỉ hỗ trợ JD analysis hay được tham gia reranking Question/Mentor?
- Confidence threshold nào yêu cầu Student xác nhận?
- Có gửi toàn bộ `corrected_text` hay chia theo section/requirement?
- Dữ liệu và metadata AI được giữ trong bao lâu?
- Cost/latency ceiling và quota theo Student là bao nhiêu?
- Khi AI và deterministic scorer bất đồng, kết quả nào được ưu tiên?
- Mentor ranking dùng công thức nào trước khi Gemini tham gia?
- Có cho Gemini hỗ trợ Mentor soạn feedback hay chỉ dùng Gemini trước khi tạo plan?
- Rubric mock interview chuẩn gồm những tiêu chí nào theo từng role/seniority?
- Có cần lưu liên kết từ feedback đến Question/topic cụ thể để đo tiến bộ không?
- Feature được bật cho local/staging/pilot theo flag nào và ai có quyền tắt khẩn cấp?

## 15. Tài liệu liên quan

- `docs/Project_Architecture/ADR/ADR-004-JD-Processing-and-Question-Matching.md`
- `docs/Project_Architecture/software_architecture.md`
- `docs/Project_Vision_and_Scope/Future_State_Workflow.md`
- `docs/Project_Vision_and_Scope/Product_Backlog_and_Acceptance_Criteria.md`
