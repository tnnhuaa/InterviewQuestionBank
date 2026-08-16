# ADR-004 — JD Processing and Question Matching Strategy

| Thuộc tính | Giá trị |
|---|---|
| Trạng thái | Accepted for PoC; Proposed for MVP |
| Ngày quyết định | 15/08/2026 |
| Người chịu trách nhiệm | Luân — Architecture/Technology Stack |
| Người cần xác nhận bằng PoC | Trí — End-to-End PoC |
| Liên quan | US-24–US-30; JD intake, analysis, matching, preparation plan |

## 1. Bối cảnh

Pain point mới bắt đầu từ một JD cụ thể. Hệ thống phải lấy được text, cho Student sửa, nhận diện requirement, chuẩn hóa theo taxonomy và đề xuất Published Question kèm lý do trước khi chuyển sang self-practice hoặc mentor booking.

Các constraint của PoC:

- React/Node.js/Express/PostgreSQL và modular monolith trong ADR-001 vẫn giữ nguyên.
- PDF có text phải extract trực tiếp; OCR chỉ dành cho ảnh hoặc PDF scan.
- Kết quả cần ít hạ tầng, deterministic, giải thích được và kiểm thử bằng golden dataset.
- Chưa dùng machine learning, semantic embedding, LLM/AI interviewer hoặc OCR cho mọi định dạng/ngôn ngữ.
- JD có thể chứa dữ liệu cá nhân hoặc thông tin công ty; file/text không được công khai hoặc gửi ra bên thứ ba mặc định.
- Student phải kiểm tra và xác nhận text trước khi analysis/matching.

## 2. Decision drivers

1. **Explainability:** mỗi question phải truy ngược được về requirement, topic và rule.
2. **Repeatability:** cùng input, taxonomy và matching version phải cho cùng ordered result.
3. **PoC cost/operations:** tránh thêm cloud OCR, vector database hoặc model service.
4. **Privacy:** giảm truyền JD sang external provider và giảm thời gian giữ original file.
5. **Testability:** có thể fixture parser/OCR và so kết quả với ground truth.
6. **Graceful correction:** extraction sai không được âm thầm trở thành analysis sai.

## 3. Các phương án extraction/OCR

| Phương án | Ưu điểm | Nhược điểm | Kết luận |
|---|---|---|---|
| A. OCR mọi input | Một pipeline bề ngoài đơn giản | Chậm, tốn CPU, làm giảm chất lượng PDF đã có text và dùng sai vai trò OCR | Không chọn |
| **B. Direct extraction trước, internal OCR fallback** | Ít hạ tầng, không gửi JD ra ngoài, dễ fixture/mock; đúng quy tắc PDF text vs scan | Internal OCR dùng CPU và cần giới hạn file/language; chất lượng phụ thuộc ảnh | **Chọn cho PoC** |
| C. Direct extraction + external OCR service | Chất lượng/format có thể tốt hơn, giảm CPU backend | Chi phí, vendor/privacy/network dependency; cần DPA, quota và fallback | Không chọn cho PoC |

### Quyết định extraction

- Pasted text đi thẳng vào `extracted_text` nhưng vẫn cần màn hình xác nhận.
- PDF được direct-extract trước. Nếu không có usable text hoặc text density dưới ngưỡng cấu hình, document được phân loại là scan và chuyển qua OCR adapter.
- PNG/JPEG đi qua internal OCR adapter. OCR implementation nằm sau interface để PoC có thể thay library mà không đổi module contract.
- PoC lưu original file tạm thời sau `PrivateFileStorage` adapter, dùng opaque key và xóa sau extraction hoặc chậm nhất 24 giờ; PoC không bắt buộc triển khai durable object storage.
- MVP/pilot dùng private object storage sau cùng adapter; PostgreSQL chỉ giữ private reference và metadata cần thiết.
- File extraction dùng PostgreSQL-backed job với trạng thái `PENDING`, `PROCESSING`, `SUCCEEDED`, `FAILED`, attempt/error class và `extraction_version`. Pasted text không tạo extraction job. PoC một instance có thể chạy worker cùng backend process.
- Kết quả luôn đi qua manual correction. `analyze` chỉ nhận `corrected_text` đã xác nhận và expected text version.
- Đầu vào PoC nhận tối đa 50.000 ký tự văn bản dán hoặc một PDF/PNG/JPEG tối đa 10 MB; PDF tối đa 5 trang, PNG/JPEG là một ảnh. OCR nội bộ hỗ trợ tiếng Việt/Anh, tối đa 2 tác vụ đồng thời/tiến trình, hết hạn 60 giây và tối đa 2 lần chạy tự động; luôn có dán/sửa thủ công làm dự phòng.

## 4. Các phương án question matching

| Phương án | Ưu điểm | Nhược điểm | Kết luận |
|---|---|---|---|
| **A. Keyword + alias + taxonomy + versioned rule score** | Deterministic, giải thích/kiểm thử dễ, không thêm service, phù hợp dữ liệu pilot | Phụ thuộc độ phủ taxonomy/alias; hiểu ngữ nghĩa và synonym lạ kém | **Chọn cho PoC** |
| B. Semantic matching bằng embedding/vector search | Bắt paraphrase tốt hơn, có thể tăng recall | Cần model/vector index, benchmark và explainability phức tạp; kết quả/version khó kiểm soát hơn | Hoãn |
| C. Generative/LLM recommendation | Linh hoạt với JD dài và ngôn ngữ tự nhiên | Chi phí, latency, privacy, hallucination và khó deterministic | Ngoài phạm vi |

### Quyết định analysis và matching

1. JD Analysis đọc `corrected_text`, phát hiện role, seniority, skill, technology và requirement bằng dictionary/rule set có version.
2. Alias được canonicalize về active taxonomy, ví dụ `ReactJS → React`; alias không biết được ghi nhận là unmapped thay vì tự tạo topic.
3. Candidate Question chỉ lấy từ Question `PUBLISHED` và topic/position active.
4. Rule score 0–100 gồm exact topic/alias match 40 điểm, requirement keyword coverage 30 điểm, role fit 15 điểm và seniority/difficulty fit 15 điểm. Chỉ Question đạt ít nhất 60 điểm được chọn; trả tối đa 10 câu/JD và 3 câu/yêu cầu. Các trọng số, ngưỡng và giới hạn là configuration item có version và được review cùng golden dataset.
5. Tie được sort deterministic theo score, taxonomy priority và question ID.
6. Mỗi `JDQuestionMatch` lưu requirement/source span, normalized topic, question, score, reason template và `matching_version`. Reason được dựng từ rule evidence, không sinh tự do bằng AI.
7. `matching_version` định danh tối thiểu taxonomy version, alias version và scoring-rule version. Rerun với version mới tạo snapshot mới; plan/booking cũ vẫn truy được version đã dùng.
8. Preparation Plan chỉ được tạo từ match hợp lệ. Booking từ plan lưu `preparation_plan_id` và `job_description_id` để Mentor nhận đúng context tối thiểu.

## 5. Security, privacy và failure handling

- Student là owner của JD/plan. Mentor chỉ đọc corrected text/topic/question qua booking mình tham gia; unrelated user bị default-deny.
- Kiểm tra MIME/magic bytes, size/page limit, parser timeout và quota. Parser/OCR chạy least privilege, không có outbound network mặc định.
- Không log raw JD, filename gốc, extracted/corrected text hoặc match reason chứa đoạn JD đầy đủ.
- Original file tự xóa chậm nhất 24 giờ sau trạng thái extraction cuối. Abandoned draft cleanup theo baseline 90 ngày; policy phải review lại trước pilot thật.
- Parser/OCR fail trả error code an toàn và cho paste/sửa text thủ công; không tự chuyển sang external provider.
- Low-confidence/unmapped requirement vẫn hiển thị để Student sửa hoặc bỏ qua; không tạo topic/question giả.

## 6. Hệ quả và đánh đổi

### Tích cực

- Luồng có thể chạy end-to-end mà không cần AI, external OCR hoặc durable object storage trong PoC.
- Kết quả có nguồn và version nên debug, review relevance và regression test được.
- Manual correction tạo control point ngăn extraction error lan truyền âm thầm.
- Adapter boundary cho phép thay parser/OCR hoặc thêm semantic matcher sau này bằng ADR mới.

### Tiêu cực

- OCR nội bộ có thể chậm và chiếm CPU; PoC phải giới hạn file/page/language và benchmark riêng.
- Rule matching bỏ sót synonym hoặc ngữ cảnh chưa có trong taxonomy.
- Nhóm phải chuẩn bị corpus, alias và ground truth đủ tốt cho vị trí pilot.
- PostgreSQL job polling phù hợp pilot nhưng có thể không phù hợp throughput lớn.

### Mitigation

- Direct extraction trước, bounded worker concurrency, timeout và manual paste fallback.
- Theo dõi unmapped requirement, false positive/negative và bổ sung taxonomy qua review/versioned change.
- Đo recall, precision@10, repeatability và task completion; không đánh giá chỉ bằng ảnh chụp UI.

## 7. PoC acceptance

Ngưỡng relevance dưới đây là exit gate đề xuất để PoC có tiêu chí kiểm chứng; Product Owner và Trí cần xác nhận corpus/rubric trước khi chạy.

| Test | Pass khi |
|---|---|
| Source routing | PDF có text dùng direct extraction; ảnh/PDF scan mới dùng OCR |
| Editable text | Input hợp lệ tạo text Student xem/sửa/xác nhận được; lỗi có action rõ |
| Alias normalization | Fixture `ReactJS` map đúng topic `React` |
| Eligibility | Không trả Draft Question hoặc taxonomy inactive |
| Explainability | Mỗi result có requirement nguồn, topic, question, score, reason và version |
| Repeatability | Cùng corrected text + data + version cho cùng ordered result/hash |
| Relevance | Requirement recall ≥ 80% và precision@10 ≥ 80% trên corpus pilot đã gắn nhãn |
| Context authorization | Booking từ plan truyền đúng context cho Mentor; unrelated user bị từ chối |
| Privacy/failure | File quá giới hạn bị chặn; original file hết hạn; log không chứa raw JD; parser fail có manual fallback |

## 8. Revisit triggers

Tạo ADR mới để thay thế quyết định này nếu xảy ra một trong các điều kiện:

- Internal OCR không đạt chất lượng/thời gian trên corpus pilot dù đã giới hạn input.
- Rule-based matching không đạt relevance target sau khi taxonomy/alias đã được review.
- Khối lượng OCR yêu cầu scale độc lập hoặc PostgreSQL job gây ảnh hưởng transaction nghiệp vụ.
- Product yêu cầu nhiều ngôn ngữ/format, semantic search hoặc external processing.
- Privacy/legal review cấm cách lưu/xử lý file hiện tại hoặc yêu cầu data residency/DPA khác.

## 9. Related decisions

- [ADR-001 — Technology Stack](ADR-001-Technology-Stack.md): giữ React/Express/PostgreSQL và modular monolith.
- [ADR-002 — Booking Consistency](ADR-002-Booking-Consistency.md): vẫn bảo vệ booking được tạo từ preparation plan.
- [ADR-003 — Notification Reliability](ADR-003-Notification-Reliability.md): notification vẫn là side effect sau transaction booking/feedback.
- [Software Architecture](../software_architecture.md): module, data, API, security, observability và PoC mapping chi tiết.
