# Câu 09 — Định nghĩa quy trình phát triển phần mềm

## 1. Câu hỏi chính

**Câu hỏi:** Trình bày quá trình hình thành và phương pháp đánh giá tài liệu Định nghĩa quy trình phát triển phần mềm của nhóm.

**Câu trả lời viết tay trong không quá 10 phút:**

Tài liệu Định nghĩa quy trình phát triển phần mềm mô tả mô hình, giai đoạn, vai trò, sản phẩm công việc, điều kiện chuyển bước và cách tạo một bản phân phối PrepVI. Tôi tạo tài liệu để thống nhất cách chuyển yêu cầu thành backlog, thiết kế, mã nguồn, kiểm thử và increment.

Đầu vào gồm Charter, Vision & Scope, Product Backlog/acceptance criteria, Resource Plan, prototype, Architecture/ADR, Definition of Ready, Definition of Done, CI và Git history. Tôi chọn Scrum/Agile làm mô hình cơ sở rồi hiệu chỉnh bằng architecture review, PoC, security/privacy check, CI và UAT/release gate. Kế hoạch gồm bốn sprint hai tuần trong tám tuần, chia thành Discovery/Charter, Prototype/Requirement, Foundation, JD Intake & Analysis, Marketplace Core Loop và UAT/Release. Các vai trò chính là Product Owner/BA, PM/Scrum Master, Architecture/Technical Lead, PoC/E2E, UI/UX và Leadership/Governance.

Quy trình bắt đầu từ Product Backlog đã ưu tiên. Story được refinement để rõ actor, giá trị, acceptance criteria, dependency và estimate; chỉ vào sprint khi đạt DoR. Trong sprint, nhóm hiện thực code, UI, API và migration; thay đổi được lưu bằng Git, đưa qua Pull Request và CI. Story chỉ đạt DoD khi AC/NFR đạt, build thành công, có test/evidence, tài liệu được cập nhật và không còn lỗi nghiêm trọng. Increment được review/UAT, sau đó feedback quay lại backlog.

Tôi đánh giá tài liệu bằng cách kiểm tra đủ vai trò và hoạt động, kiểm tra đầu ra bước trước có trở thành đầu vào bước sau, rồi đối chiếu mô tả với source, commit, CI và tài liệu dự án. Mô hình này giúp nhận feedback và phát hiện rủi ro sớm, nhưng cần backlog discipline, review đều và bằng chứng sprint. Tôi dùng tài liệu để phân công, xác định gate và hướng dẫn tích hợp; khi backlog, architecture hoặc release flow thay đổi, tôi cập nhật quy trình tương ứng.

## 2. Câu hỏi thường gặp

### 2.1 Tài liệu Định nghĩa quy trình phát triển phần mềm cần trả lời gì?

Tài liệu phải trả lời: dùng mô hình nào; vì sao chọn; gồm giai đoạn/hoạt động/vai trò nào; đầu vào và đầu ra từng bước; tạo những work product nào; khi nào công việc được xem là sẵn sàng/hoàn thành; và làm sao tạo, đánh giá, phát hành một increment.

### 2.2 Mô hình cơ sở được chọn để hiệu chỉnh là gì?

Tôi chọn Scrum/Agile vì yêu cầu và rủi ro kỹ thuật cần được kiểm chứng theo increment ngắn. Tôi hiệu chỉnh Scrum bằng ADR/architecture gate, PoC, CI, security/privacy check và UAT/release gate. Đây không phải Waterfall vì backlog có thể được cập nhật từ feedback sau mỗi increment.

### 2.3 Thời gian dự kiến của từng giai đoạn là bao lâu?

| Giai đoạn | Thời gian dự kiến | Đầu ra chính |
| --- | ---: | --- |
| Discovery/Charter | Tuần 1 | Charter, stakeholder và scope baseline |
| Prototype/Requirement | Tuần 2 | Workflow, prototype, backlog/AC |
| Foundation | Tuần 3 | Architecture/ADR, auth, schema và CI foundation |
| JD Intake & Analysis | Tuần 4 | Extraction/OCR, taxonomy, matching và preparation plan |
| Marketplace Core Loop | Tuần 5–6 | Mentor, availability, booking, notification và feedback |
| UAT/Release | Tuần 7–8 | Defect triage, UAT và release evidence |

Đây là kế hoạch 8 tuần, được tổ chức theo bốn sprint hai tuần.

### 2.4 Các vai trò của từng thành viên là gì?

| Thành viên | Vai trò theo tài liệu dự án |
| --- | --- |
| Hưng | Product Owner/BA |
| Gia Thành | PM/Scrum Master |
| Luân | Architecture/Technical Lead |
| Trí | PoC/E2E |
| Hùng | UI/UX |
| Tuấn Anh | Leadership/Governance và release readiness |

Khi vấn đáp về quá trình tạo và áp dụng tài liệu này, tôi trình bày các hoạt động dưới góc nhìn công việc tôi đã thực hiện và kiểm soát.

### 2.5 Những sản phẩm nào được khởi tạo?

Charter; Stakeholder Analysis; Vision & Scope; current/future workflow; Product Backlog và AC; prototype; Architecture và ADR; PoC; source code frontend/backend; OpenAPI contract; database migrations; CI workflow; test/evidence; hướng dẫn chạy/build và release/UAT evidence.

### 2.6 Quy trình để đưa ra một bản phân phối hoạt động là gì?

Backlog ưu tiên → refinement và estimate → đạt DoR → thực hiện work package → code/API/UI/migration → Pull Request và CI → kiểm tra DoD → build tích hợp → review/UAT → chấp nhận hoặc đưa feedback về backlog.

### 2.7 Ưu và khuyết điểm của mô hình đã chọn là gì?

**Ưu điểm:** nhận feedback sớm, ưu tiên core loop, phát hiện rủi ro OCR/matching/booking sớm và dễ cập nhật theo evidence.

**Khuyết điểm:** cần Product Owner/refinement đều đặn; thiếu kỷ luật DoR/DoD dễ làm scope trôi; thiếu bằng chứng sprint làm khó theo dõi velocity và đánh giá quy trình.

### 2.8 Tài liệu được đánh giá thế nào?

Tôi kiểm tra tính đầy đủ của vai trò, bước, input/output và gate; sau đó đối chiếu với Charter, Resource Plan, Backlog/DoR/DoD, Architecture, CI, source code và Git history. Một mô tả chỉ được giữ khi có tài liệu hoặc sản phẩm thực tế hỗ trợ.

### 2.9 Tại sao cần tạo tài liệu này?

Để mọi thành viên hiểu cùng một cách làm việc, biết công việc cần đầu vào gì, khi nào được chuyển bước, ai chịu trách nhiệm và bằng chứng nào chứng minh increment đã hoàn thành.

### 2.10 Tài liệu được sử dụng và cập nhật thế nào?

Tôi dùng nó để liên kết backlog, architecture, implementation, CI và release gate. Khi scope, NFR, ADR, DoR/DoD hoặc build flow thay đổi, quy trình và work product tương ứng phải được cập nhật để không lệch thực tế.

### 2.11 Software Process Definition khác Project Plan thế nào?

Process Definition trả lời “làm theo cách nào và qua những gate nào”. Project Plan trả lời “làm việc gì, khi nào, ai làm và cần bao nhiêu nguồn lực”.

## 3. Tài liệu đi kèm

- [ ] [Software Process Definition — English version](Software_Process_Definition_EN.md).
