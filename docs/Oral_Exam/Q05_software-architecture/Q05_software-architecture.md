# Câu 05 — Kiến trúc phần mềm (Software Architecture)

## 1. Câu hỏi chính

**Câu hỏi:** Trình bày quá trình hình thành và phương pháp đánh giá tài liệu Kiến trúc phần mềm của nhóm.

**Câu trả lời viết tay trong không quá 10 phút:**

Tài liệu Kiến trúc phần mềm mô tả cấu trúc, thành phần, cách giao tiếp, dữ liệu và quyết định kỹ thuật của PrepVI. Tôi tạo tài liệu để frontend, backend, database và dịch vụ ngoài cùng theo một định hướng, đồng thời kiểm soát bảo mật, phân quyền, chống trùng lịch và độ tin cậy.

Đầu vào để hình thành kiến trúc ban đầu gồm Charter, Vision & Scope, Backlog/acceptance criteria, NFR, Resource Plan, ràng buộc thời gian–chi phí–năng lực nhóm và prototype nghiệp vụ nếu có. Kiến thức đầu tiên là lựa chọn kiến trúc phải giải thích được style, stack, platform và framework. Vì vậy, tôi so sánh phương án trong ADR-001 rồi chọn modular monolith, React/Vite, Express và PostgreSQL vì phù hợp quy mô pilot và yêu cầu transaction.

Kiến thức thứ hai là phân rã giải pháp phải làm rõ component, technology, dịch vụ ngoài, database, algorithm và pattern. Tôi viết bằng Markdown, vẽ Mermaid và phân rã PrepVI thành React SPA, Express API, module nghiệp vụ, PostgreSQL, worker/outbox, provider ngoài, JD extraction và matching. Matching dùng rule có phiên bản; Gemini chỉ hỗ trợ qua adapter/feature flag.

Từ baseline đó, nhóm xây dựng PoC theo các validation scenario. PoC, source, migration và test là bằng chứng để xác nhận giả định; nếu evidence khác baseline, tôi cập nhật sơ đồ, contract hoặc trạng thái ADR nhưng vẫn giữ lịch sử quyết định.

Tôi đánh giá tài liệu theo hai lớp. Trước hết, tôi dùng AI review một vòng rồi tự kiểm tra tính đầy đủ, nhất quán, khả thi và khả năng truy vết từ requirement/NFR đến sơ đồ và ADR. Sau đó, tôi đánh giá từng quyết định theo **Criteria → Evidence → Judgement**: criteria gồm không double booking, lỗi email không rollback booking và không lộ dữ liệu riêng tư; evidence gồm PoC, source, migration và test. Phần đủ bằng chứng được chấp nhận, phần chưa đủ giữ pending. Tôi dùng tài liệu để tổ chức module, thống nhất API/data boundary và hướng dẫn triển khai.

## 2. Câu hỏi thường gặp

### 2.1 Các câu hỏi chính cần trả lời trong tài liệu Kiến trúc phần mềm là gì?

- Hệ thống phục vụ ai và hỗ trợ những luồng nghiệp vụ nào?
- Hệ thống gồm component/container/module nào và chúng giao tiếp ra sao?
- Dữ liệu được lưu, trao đổi và bảo vệ như thế nào?
- Vì sao chọn architectural style, stack, platform, framework và dịch vụ ngoài đó?
- Kiến trúc đáp ứng NFR về security, performance, consistency và reliability thế nào?
- Các rủi ro, trade-off, validation criteria và điều kiện cập nhật quyết định là gì?

### 2.2 Các đầu vào cần thiết và các bước tôi đã thực hiện để tạo tài liệu là gì?

**Đầu vào để thiết kế kiến trúc ban đầu:** Charter; Vision & Scope; Backlog/AC/NFR; Resource Plan; ràng buộc thời gian, chi phí, năng lực nhóm; prototype nghiệp vụ nếu có và kiến thức kiến trúc trong `docs/refs`.

**Bằng chứng để kiểm chứng và cập nhật kiến trúc:** PoC, source code, migration, test, log và kết quả đo. Đây không phải điều kiện phải có trước khi tạo kiến trúc ban đầu.

**Các bước:**

1. Review backlog và xác định architecture driver/NFR.
2. Phân rã solution thành component, technology, integration, database, algorithm và pattern.
3. So sánh architectural style, stack, platform và framework.
4. Chọn modular monolith, React/Vite, Express và PostgreSQL; ghi lý do/trade-off trong ADR.
5. Vẽ system context, container, module/data flow; xác định API, security và reliability boundary.
6. Dùng kiến trúc và ADR làm baseline để nhóm xây dựng PoC/mã nguồn và thực hiện validation scenario.
7. Đối chiếu evidence từ PoC/source/test với criteria; cập nhật sơ đồ, contract hoặc trạng thái ADR khi có khác biệt.

### 2.3 Tài liệu Kiến trúc phần mềm được đánh giá thế nào?

Tôi đánh giá theo hai lớp. Lớp thứ nhất đánh giá bản thân tài liệu: có bao phủ requirement/NFR không, các sơ đồ–API–data model–ADR có nhất quán không, trade-off/rủi ro có rõ không và giải pháp có khả thi với nguồn lực nhóm không. Lớp thứ hai dùng **Criteria → Evidence → Judgement** để kiểm chứng quyết định bằng PoC và implementation. Ví dụ, criteria là một slot chỉ được xác nhận một booking và lỗi email không làm rollback booking; evidence là database constraint/transaction, outbox worker và test. Nếu evidence đáp ứng criteria thì quyết định được chấp nhận trong phạm vi đó; nếu chưa đủ thì giữ pending.

### 2.4 Tại sao cần tạo tài liệu Kiến trúc phần mềm?

Tài liệu tạo technical baseline chung, giúp các phần của hệ thống không triển khai mâu thuẫn; hỗ trợ phân chia module, kiểm soát NFR, giải thích trade-off và giảm phụ thuộc vào trí nhớ của một người. Nó cũng cho biết bằng chứng nào cần có trước khi chấp nhận một quyết định kỹ thuật.

### 2.5 Tài liệu đã được sử dụng và cập nhật trong dự án như thế nào?

Tôi dùng tài liệu làm baseline trước khi triển khai để định hướng module backend, API/data boundary, booking transaction, outbox worker, JD matching và AI adapter. Sau khi có PoC/source/test, tôi đối chiếu evidence với validation criteria. Khi backlog thay đổi hoặc evidence khác giả định, tôi cập nhật sơ đồ, interface, validation scenario hoặc trạng thái ADR liên quan, đồng thời giữ lại lịch sử và lý do của quyết định cũ.

## 3. Tài liệu đi kèm

Các bản tiếng Anh dưới đây nằm cùng thư mục với câu trả lời:

- [ ] [Software Architecture](Software_Architecture_EN.md).
- [ ] [ADR-001 — Technology Stack](ADR-001-Technology-Stack_EN.md).
- [ ] [ADR-002 — Booking Consistency](ADR-002-Booking-Consistency_EN.md).
- [ ] [ADR-003 — Notification Reliability](ADR-003-Notification-Reliability_EN.md).
- [ ] [ADR-004 — JD Processing and Question Matching](ADR-004-JD-Processing-and-Question-Matching_EN.md).
- [ ] [ADR-005 — Hybrid Gemini Assistance](ADR-005-Hybrid-Gemini-Assistance_EN.md).
- [ ] [Architecture Diagrams — rendered images](Architecture_Diagrams_EN.md).
- [ ] Bản in các sơ đồ System Context, Container và JD component trong bản Software Architecture tiếng Anh.
