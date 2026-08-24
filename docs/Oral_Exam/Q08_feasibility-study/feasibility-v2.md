# Feasibility Study

## 1. Purpose

Tài liệu đánh giá mức độ khả thi của dự án trước khi nhóm cam kết phát hành. Mục tiêu của feasibility study là xác định liệu MVP có đủ **nhu cầu, giá trị và tính thực tiễn** để tiếp tục đầu tư nguồn lực hay không; đồng thời xác định các điều kiện, rủi ro và bằng chứng cần có trước quyết định.

## 2. Reason

Vấn đề nhóm đang giải quyết là ứng viên, đặc biệt là sinh viên và ứng viên Intern/Junior, thường không biết nên chuẩn bị nội dung gì sau khi nhận hoặc chọn một Job Description (JD). Việc luyện phỏng vấn hiện thường rời rạc: đọc JD thủ công, tự tìm câu hỏi, tự lập kế hoạch học và chỉ tìm mentor khi đã gần đến buổi phỏng vấn.

MVP đề xuất một luồng liền mạch:

**Chọn chủ đề phỏng vấn → Website cung cấp bộ câu hỏi theo chủ đề → Người dùng tiến hành luyện tập.**

Feasibility study được thực hiện để tránh xây dựng toàn bộ hệ thống trước khi xác nhận rằng luồng cốt lõi này có giá trị, có thể triển khai trong nguồn lực của nhóm và có thể vận hành an toàn trong phạm vi pilot.

## 3. Background information

Phạm vi MVP ưu tiên giá trị chuẩn bị phỏng vấn theo JD. Các thành phần chính gồm:

- Nhập JD từ PDF/PNG/JPEG và cho phép chỉnh sửa văn bản đã trích xuất.
- Phân tích requirement và ánh xạ sang Question Bank.
- Tạo preparation plan có trace về JD, requirement và Question version.
- Luyện tập với Question Bank.
- Mở rộng: liên hệ Mentor để luyện tập.

Planning baseline hiện tại: **8 tuần**, **6 thành viên**, khoảng **653 giờ usable capacity** sau reserve và **cash ceiling 1.125.000 VNĐ** cho thử nghiệm.

## 4. Evaluation criteria

MVP được đánh giá theo các tiêu chí sau:

1. **Technology/System:** Core workflow có thể triển khai ổn định, bảo mật và có bằng chứng PoC.
2. **Resource:** Nhóm có đủ nhân lực, kỹ năng và effort capacity để hoàn thành Must scope.
3. **Schedule:** Must scope có thể nằm trong throughput/capacity của luồng Kanban theo tuần trong baseline 8 tuần.
4. **Operational:** Quy trình moderation, mentor approval, booking, feedback, support và failure handling có thể vận hành được.
5. **Market:** Có pain thực tế, demand đủ rõ và mentor supply đủ cho pilot.
6. **Economic:** Chi phí pilot hợp lý so với giá trị học được; các cost/benefit chính được nhận diện và kiểm soát.
7. **Legal/Privacy/Ethical:** Dữ liệu, bản quyền, consent và quyền riêng tư được quản lý ở mức phù hợp cho MVP.
8. **Cultural:** Hành vi upload JD, nhận feedback, dùng mentor và tin cậy Question Bank phù hợp với người dùng mục tiêu.

Kết luận chỉ được xem là mạnh khi có bằng chứng từ PoC, pilot, user validation hoặc measurement thay vì chỉ dựa trên assumption.

## 5. Study findings

### 5.1 Technology and system feasibility

| Năng lực | Đánh giá | Risk / Evidence / Mitigation |
|---|---|---|
| Web CRUD/search/filter | Khả thi | Risk: taxonomy/filter sai khi multi-tag. Evidence: test với nhiều position/topic. Mitigation: versioned taxonomy và automated filter tests. |
| Authentication/RBAC | Khả thi có điều kiện | Risk: object-level access leak. Evidence: negative authorization tests giữa các user. Mitigation: ownership checks tại service/API layer. |
| JD intake/extraction | Khả thi có rủi ro | Risk: OCR/extraction sai hoặc file lỗi. Evidence: PoC trên PDF/PNG/JPEG ≤10 MB. Mitigation: direct extraction trước, OCR VI/EN fallback, correction gate và safe failure. |
| Requirement analysis/Question mapping | Khả thi có rủi ro | Risk: mapping thiếu/lệch. Evidence: 20 JD có nhãn, blind-set recall và precision@10 ≥80%. Mitigation: versioned taxonomy/alias/rules và traceable mapping reason. |
| Preparation plan | Khả thi | Risk: plan mất trace hoặc user khác truy cập. Evidence: trace JD/requirement/Question version và authorization tests. Mitigation: immutable references/versioning phù hợp. |
| Mentor verification | Khả thi | Risk: mentor không đủ độ tin cậy. Evidence: moderation workflow và audit. Mitigation: Approved-only participation trong pilot. |
| Availability/booking | Khả thi có rủi ro | Risk: double booking khi concurrent requests. Evidence: concurrency PoC. Mitigation: transaction + unique constraint/idempotent transition. |
| Notification | Khả thi có rủi ro | Risk: email failure làm mất booking hoặc gửi trùng. Evidence: retry/idempotency test. Mitigation: decouple booking persistence khỏi delivery bằng outbox/retry. |
| Feedback/review | Khả thi | Risk: feedback không phù hợp hoặc lộ dữ liệu. Evidence: completed-only rule, privacy/moderation test. Mitigation: rubric, ownership và report/appeal. |
| Video meeting | Khả thi bằng tích hợp nhẹ | Risk: xây meeting riêng vượt scope. Evidence: external/manual link đáp ứng pilot. Mitigation: defer native meeting platform. |
| AI/payment | Loại khỏi MVP | Risk: tăng complexity, compliance và cost. Mitigation: chỉ xem xét sau khi core loop được validate. |

#### Mandatory technical PoC

1. JD hợp lệ tạo văn bản có thể sửa bằng direct extraction hoặc OCR fallback; lỗi tệp thất bại an toàn.
2. Requirement/alias được chuẩn hóa và mapping chỉ trả Question `PUBLISHED`, có source/topic/reason/version và ổn định cùng phiên bản.
3. Hai request đồng thời không thể xác nhận cùng một slot.
4. User khác không thể đọc/sửa JD, plan, booking, meeting link hoặc feedback.
5. Booking transition hợp lệ và có audit trail.
6. Question filter đúng với nhiều position/topic.
7. Email failure không làm mất booking; retry idempotent.

**Kết luận:** Technical feasibility ở mức **khả thi có điều kiện**. Core architecture không có blocker rõ ràng, nhưng release chỉ nên Go khi 7 PoC trên đều pass.

### 5.2 Resource feasibility

Nhóm hiện có **6 thành viên**, mỗi người dự kiến dành trung bình **16 giờ/tuần** cho project trong **8 tuần**. Tổng capacity danh nghĩa là khoảng **768 giờ**. Sau khi giữ lại **15% dự phòng** cho discovery, integration, defect fixing, security/privacy và UAT, lượng thời gian có thể sử dụng cho phạm vi triển khai còn khoảng **653 giờ**.

Phạm vi bắt buộc của MVP hiện được thể hiện bằng **Must backlog gồm 27 user story, tổng 134 Story Point (SP)**. Con số này giúp nhóm hình dung quy mô tương đối của phần việc bắt buộc, nhưng chưa nên được xem là cam kết giao hàng cuối cùng vì Story Point chỉ là estimate tương đối và team chưa có đủ dữ liệu thực tế để chứng minh tốc độ hoàn thành tương ứng.

Để kiểm tra liệu nguồn lực hiện tại có thực sự đủ hay không, nhóm sẽ xác nhận lại estimate của Must backlog trong backlog refinement — có thể dùng **Planning Poker** để hiệu chỉnh Story Point trước khi đưa hạng mục vào Ready — và theo dõi **throughput/cycle time thực tế** trên luồng Kanban theo tuần. Nếu dữ liệu throughput cho thấy phần Must có thể hoàn thành trong capacity còn lại mà vẫn giữ được reserve cho integration, defect và UAT, nguồn lực được xem là phù hợp. Ngược lại, nếu workload vượt quá khả năng thực tế của team, nhóm phải giảm hoặc ưu tiên lại scope thay vì sử dụng toàn bộ reserve hoặc cắt giảm quality activities. Planning Poker ở đây là kỹ thuật ước lượng tương đối, không phải nghi thức Scrum và không thay thế dữ liệu throughput.

**Kết luận:** Resource feasibility hiện được đánh giá là **khả thi có điều kiện**. Nhóm có đủ quy mô nhân lực và một capacity baseline rõ ràng, nhưng kết luận cuối cùng phụ thuộc vào việc xác nhận lại Must backlog và đối chiếu nó với năng lực thực tế của team trong quá trình triển khai.

### 5.3 Schedule feasibility

Trạng thái: **Có planning baseline; chưa có cam kết phát hành cuối cùng**.

- Timeline: cửa sổ kế hoạch 8 tuần từ 29/06 đến 23/08/2026; phần thực hiện được tái dựng trong bốn tuần từ 27/07 đến 23/08. Nhóm vận hành Kanban theo tuần, không chia sprint.
- Backlog baseline: 134 SP.
- Mốc tải trung bình: khoảng 33,5 SP/tuần trên bốn tuần thực hiện tái dựng (`134 / 4`), chỉ dùng làm mốc so sánh chứ không phải throughput đo được.
- Schedule được xem là feasible khi Must backlog nằm trong khoảng **throughput** của nhóm trên số tuần còn lại, đồng thời vẫn giữ reserve cho defect, integration, security/privacy và UAT.

Risk chính là nhóm cam kết fixed-date release dựa trên SP trước khi có dữ liệu throughput/cycle time thật.

Mitigation:

- Đo throughput và cycle time từ luồng Kanban thực tế.
- Dựng đường **will-have / might-have**.
- Cắt scope trước khi cắt quality gate.

**Kết luận:** Schedule feasibility hiện **chưa đủ bằng chứng để cam kết**, nhưng có khả năng feasible nếu throughput thực tế hỗ trợ Must scope.

### 5.4 Market feasibility

| Khía cạnh | Đánh giá | Validation |
|---|---|---|
| Nhu cầu sinh viên | Có giả thuyết cần kiểm chứng | ≥70% discovery sample xác nhận pain chuẩn bị theo JD |
| Giá trị JD-to-plan | Có điều kiện | ≥80% hoàn tất tác vụ; extraction ≥90%; blind-set recall/precision@10 ≥80% |
| Mentor supply | Có điều kiện | 4 mentor Approved, mỗi người ≥3 slot cho pilot |
| Plan-to-mentor loop | Chưa chứng minh | 12 booking hợp lệ; mục tiêu ≥10 Confirmed và ≥8 Completed |

Target pilot giới hạn ở **Front-end Intern/Junior dùng JavaScript/TypeScript/React**, với **20 JD đã khử định danh, 12 Student và 4 Mentor tự nguyện**.

Marketplace có risk chicken-and-egg, nhưng không chặn toàn bộ product value vì Student vẫn có thể nhận preparation plan trước khi dùng mentor service.

**Kết luận:** Market feasibility **có tín hiệu tích cực nhưng chưa được chứng minh**. Pilot phải xác nhận cả student demand và mentor supply trước khi mở rộng.

### 5.5 Operational feasibility

Operational feasibility tập trung vào khả năng vận hành quy trình hàng ngày sau khi chức năng đã chạy đúng về kỹ thuật.

| Hoạt động | Risk | Validation / Mitigation |
|---|---|---|
| Mentor approval | Mentor không phù hợp hoặc approval không nhất quán | Có owner, approval criteria và audit trail |
| Booking | Cancel/reschedule/no-show gây tranh chấp | Policy rõ, owner xử lý và state transition cố định |
| Feedback | Mentor bỏ qua hoặc feedback không hữu ích | Rubric, Completed-only rule, mục tiêu ≥90% feedback completion |
| Question moderation | Nội dung sai/chất lượng thấp/bản quyền | Provenance, report, moderation và appeal |
| Notification | Delivery failure gây confusion | Retry idempotent; booking vẫn giữ nguyên nếu email fail |
| User support | Không rõ ai xử lý exception | Chỉ định admin/owner cho pilot |

MVP không yêu cầu vận hành payment, escrow, payout hoặc video infrastructure riêng, giúp giảm đáng kể operational burden.

**Kết luận:** Operational feasibility **khả thi có điều kiện** nếu nhóm định nghĩa owner và policy trước pilot thay vì xử lý exception ad-hoc.

### 5.6 Economic feasibility

Trạng thái: **Có cost baseline cho pilot; chưa chứng minh commercial ROI/unit economics**.

#### Cost baseline

- Tên miền: **300.000 VNĐ**.
- Hỗ trợ 12 Student participant: **600.000 VNĐ**.
- Direct cash baseline: **900.000 VNĐ**.
- Contingency 25%: **225.000 VNĐ**.
- Cash ceiling: **1.125.000 VNĐ**.
- Mentor pilot tham gia tự nguyện.
- Payment, escrow, payout và commission không thuộc MVP.
- Chi phí lao động được theo dõi riêng, không xem là cash expense của pilot.

#### Cost–Benefit Analysis

| Cost / Investment | Expected benefit |
|---|---|
| Domain và chi phí hạ tầng tối thiểu | Có môi trường pilot có thể truy cập và kiểm thử thực tế |
| Participant incentive | Thu được evidence từ user thật thay vì chỉ self-test |
| 653 giờ usable team capacity | Xây và validate core JD-to-plan-to-mentor workflow |
| Effort tạo 20 JD có nhãn | Đo được extraction/mapping quality bằng calibration + blind set |
| Mentor volunteer effort | Validate mentor supply, booking và feedback loop |

Giá trị chính của MVP giai đoạn này không phải doanh thu mà là **validation value**: xác nhận problem-solution fit, technical risk, operational burden và demand trước khi đầu tư vào AI, payment hoặc marketplace scale.

### 5.7 Legal, privacy and ethical feasibility

MVP khả thi có điều kiện nếu:

- Có privacy notice, consent và mục đích xử lý rõ.
- Thu thập tối thiểu dữ liệu.
- JD gốc xóa ≤24 giờ.
- Dữ liệu dẫn xuất xóa sau 90 ngày không hoạt động.
- Booking/feedback lưu tối đa 180 ngày.
- Active deletion ≤7 ngày và backup expiry ≤30 ngày.
- Meeting link, verification evidence và feedback không công khai.
- Question có provenance và không sao chép nội dung có bản quyền trái phép.
- Review/report có guideline, moderation và appeal.
- Không ghi âm/phiên âm trong MVP.
- Terms nêu rõ cancellation, no-show, refund/credit và giới hạn trách nhiệm nếu các chính sách này được áp dụng.

Risk chính là xử lý JD chứa thông tin công ty/cá nhân, sharing meeting link và reuse nội dung interview có nguồn không rõ ràng.

Mitigation chính là data minimization, de-identification, access control, retention policy, provenance và moderation.

**Kết luận:** Legal/privacy/ethical feasibility **khả thi có điều kiện** trong pilot nhỏ nếu các control trên được triển khai và kiểm tra.

### 5.8 Cultural feasibility

Cultural feasibility đánh giá liệu hành vi mà hệ thống yêu cầu có phù hợp với thói quen, kỳ vọng và mức độ tin cậy của Student/Mentor mục tiêu hay không.

Các giả thuyết cần kiểm chứng:

1. **Student sẵn sàng upload JD:** Người dùng có thể lo ngại JD chứa thông tin công ty hoặc dữ liệu nhạy cảm. Pilot phải giải thích rõ mục đích, retention và de-identification.
2. **Student chấp nhận structured preparation plan:** Người dùng phải thấy plan theo JD hữu ích hơn việc tự tìm câu hỏi trên Google/YouTube/ChatGPT.
3. **Student sẵn sàng nhận feedback trực tiếp:** Feedback interview có thể gây cảm giác bị đánh giá; rubric cần mang tính xây dựng, cụ thể và actionable.
4. **Mentor chấp nhận workflow chuẩn hóa:** Mentor có thể quen feedback tự do; pilot cần kiểm tra liệu rubric và structured feedback có tạo thêm burden đáng kể hay không.
5. **Niềm tin vào Question Bank:** Student cần biết câu hỏi đến từ đâu, vì sao được map và ai đã duyệt để tránh cảm giác hệ thống trả câu hỏi tùy ý.
6. **Thói quen đặt lịch:** User cần hiểu Confirmed/Completed/Cancelled/No-show và chấp nhận policy rõ ràng.

Validation đề xuất:

- ≥80% Student pilot hiểu được vì sao hệ thống yêu cầu upload/correct JD.
- ≥80% Student cho rằng preparation plan dễ hiểu và hữu ích.
- ≥75% Student sẵn sàng sử dụng mentor feedback workflow lần nữa.
- ≥75% Mentor cho rằng rubric/feedback flow chấp nhận được về effort.
- Không xuất hiện recurring trust/privacy concern chưa có mitigation sau pilot interview.

**Kết luận:** Cultural feasibility hiện **chưa được chứng minh**, nhưng không có blocker rõ ràng. Cần user/mentor interview sau pilot để xác nhận acceptance và trust.

## 6. Recommendations and Go/No-Go gates

| Gate | Go khi | No-Go/Pivot khi |
|---|---|---|
| G1 Problem | Pain được xác nhận và có hành vi hiện tại | Chỉ có ý kiến chung, không có nhu cầu thực |
| G2 JD data | Có 20 JD hợp pháp/khử định danh, 12 calibration + 8 blind và nhãn hai lượt | Không có corpus hoặc nhãn không đủ tin cậy |
| G3 Prototype | ≥80% task JD-to-plan và plan-to-booking hoàn tất | Luồng không hiểu hoặc cần hỗ trợ lớn |
| G4 Technical | 7 PoC bắt buộc pass; blind recall/precision@10 ≥80% | Extraction/mapping không đạt, double booking hoặc access leak chưa kiểm soát |
| G5 Supply | 4 Mentor Approved có ≥3 slot/người | Không tuyển được supply đúng phân khúc |
| G6 Delivery | Must backlog nằm trong throughput range/capacity/budget | Core loop không thể hoàn tất trong baseline |
| G7 Pilot | ≥10 Confirmed, ≥8 Completed; feedback hữu ích | Completion/value quá thấp sau một remediation cycle |
| G8 Cultural acceptance | Student/Mentor acceptance đạt ngưỡng pilot và không còn recurring trust/privacy concern nghiêm trọng | User từ chối upload JD, không tin mapping/feedback hoặc mentor workflow có burden quá cao |
| G9 Economic pilot | Pilot nằm trong 1.125.000 VNĐ và tạo đủ evidence cho quyết định tiếp theo | Cost vượt baseline mà validation value không tương xứng |

## 7. Final recommendation

**Proceed với thử nghiệm hẹp và PoC; chưa Go cho full release.**

MVP hiện có cơ sở tốt về technology/system, resource và operational feasibility, nhưng vẫn cần bằng chứng thực tế cho market demand, cultural acceptance, throughput và mapping quality. Economic feasibility đủ cho pilot nhỏ, nhưng chưa đủ dữ liệu để kết luận commercial ROI hoặc unit economics.

Planning baseline được dùng cho điều phối nội bộ, phê duyệt chính thức vẫn cần chữ ký Sponsor Ngô Huy Biên và Ngô Ngọc Đăng Khoa.
