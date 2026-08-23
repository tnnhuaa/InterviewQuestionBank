# Câu 02 — Viễn cảnh và phạm vi dự án (Project Vision and Scope)

## 1. Đề bài

Trình bày quá trình hình thành và phương pháp đánh giá tài liệu Viễn cảnh và phạm vi dự án (Project Vision and Scope) của nhóm; giải thích lý do tạo, cách sử dụng và cập nhật. Bản in bắt buộc là [Project Vision and Scope](../../Project_Vision_and_Scope/Project_Vision_and_Scope.md), đã được chuẩn hóa hoàn toàn bằng tiếng Anh.

## 2. Dàn ý viết A4 trong 10 phút

1. Tài liệu xác định **sản phẩm đi về đâu** và **ranh giới MVP ở đâu**: người dùng, vấn đề, giá trị, mục tiêu đo lường, trong/ngoài phạm vi, giả định và ràng buộc.
2. Đầu vào thực tế: Đề xuất dự án, phân tích công cụ/đối thủ, quy trình hiện tại–tương lai, Ủy nhiệm dự án, tính khả thi, nguồn lực và bài giảng.
3. Quá trình: lấy vấn đề và giá trị từ Proposal → xác định users/vision/goals → giới hạn in-scope/out-of-scope → đặt chỉ số → review chéo với feasibility, resources, backlog, prototype và architecture → điều chỉnh thành baseline JD-first.
4. Đánh giá bằng độ đầy đủ, truy vết `vấn đề → mục tiêu → năng lực → yêu cầu/AC`, ranh giới MVP, tính đo được, khả thi và nhất quán với backlog–prototype–architecture.
5. Kết quả chỉnh sửa: JD trở thành điểm bắt đầu; thêm extract/OCR, correction gate, taxonomy, mapping có giải thích, 8 mục tiêu đo lường và giới hạn cụ thể; loại thanh toán, video tích hợp và AI interviewer.
6. Tài liệu được dùng để tạo backlog/AC, quy trình tương lai, prototype, architecture, feasibility, resource plan và mã nguồn.
7. Cập nhật: khi nhóm làm rõ giải pháp, tài liệu được chỉnh từ mô hình chung sang JD-first; thay đổi kỹ thuật chi tiết được quản lý bằng ADR nếu không làm đổi vision và high-level scope.

## 3. Tài liệu là gì và tại sao cần tạo?

- **CÁI GÌ (WHAT):** Viễn cảnh nêu trạng thái tương lai và giá trị sản phẩm; phạm vi xác định kết quả, năng lực, ranh giới trong/ngoài MVP, giả định và ràng buộc.
- **TẠI SAO (WHY):** giúp các bên liên quan thống nhất sản phẩm, ngăn phát sinh phạm vi (Scope Creep), tạo cơ sở phân rã backlog, ước lượng, thiết kế, kiểm thử và nghiệm thu.
- **KHI NÀO (WHEN):** tạo sau khi ý tưởng/vấn đề có đủ cơ sở sơ bộ và trước khi chi tiết hóa backlog hoặc cam kết thực hiện; cập nhật khi vấn đề, mục tiêu, nhóm người dùng hoặc ranh giới cấp cao thay đổi.

Các câu hỏi chính tài liệu phải trả lời:

- Ai là người dùng và họ gặp vấn đề gì?
- Trạng thái tương lai và giá trị khác biệt là gì?
- Thành công được đo bằng chỉ số nào?
- MVP cung cấp năng lực gì và loại trừ gì?
- Hệ thống tương tác với người dùng/hệ thống ngoài ở ranh giới nào?
- Giả định, ràng buộc, phụ thuộc và hướng tương lai là gì?

## 4. Nội dung Viễn cảnh và phạm vi của nhóm

**Viễn cảnh:** tạo một nơi đáng tin cậy để ứng viên entry-level hiểu một JD cụ thể đòi hỏi gì, biết câu hỏi nào cần luyện và có thể thực hành với Cố vấn trong cùng vòng chuẩn bị.

**Vòng giá trị:** `JD → Kế hoạch chuẩn bị → Tự luyện/Cố vấn → Phản hồi → Hành động tiếp theo`.

**Trong MVP:** tài khoản/RBAC; nhập JD; extract/OCR và hiệu chỉnh; phân tích yêu cầu; taxonomy; mapping câu hỏi có nguồn/chủ đề/lý do; kế hoạch; Question Bank; hồ sơ/xác minh/lịch Cố vấn; booking; liên kết họp ngoài; notification; feedback/review; quản trị tối thiểu.

**Ngoài MVP:** AI interviewer và tự động chấm; gọi/ghi âm/phiên âm tích hợp; thanh toán; mobile native; ATS; marketplace quy mô vận hành thật.

**Các ngưỡng chính:** pain discovery ≥70%; hoàn tất intake ≥80%; requirement recall ≥80%; mapping relevance ≥80% và 100% kết quả có source/topic/reason; plan activation ≥80%; booking completion ≥80%; feedback đầy đủ ≥90%. Đây là **mục tiêu đề xuất, chưa phải kết quả đạt được**.

## 5. Quá trình hình thành thực tế

| Đầu vào                             | Cách sử dụng                                                             | Bằng chứng                                                                                                                                                                                                  |
| ----------------------------------- | ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Đề xuất dự án                       | Lấy vấn đề, giải pháp và giá trị cấp cao                                 | [Project Proposal](../../Project_Proposal/Project_Proposal_Draft.md)                                                                                                                                        |
| Phân tích cách làm hiện tại/đối thủ | Xác định ma sát và giả thuyết định vị                                    | [Existing Tools Analysis](../../Project_Proposal/Existing_Tools_Analysis.md), [Competitor Analysis](../../Project_Proposal/Competitor_Analysis.md)                                                          |
| Quy trình hiện tại và tương lai     | Xác định actors, các bước và system boundary                             | [Current-State](../../Project_Vision_and_Scope/Current_State_Workflow.md), [Future-State](../../Project_Vision_and_Scope/Future_State_Workflow.md)                                                          |
| Charter, nguồn lực, tính khả thi    | Kiểm tra quyền hạn, 8 tuần, 653 giờ, 1.125.000 VNĐ và gates              | [Project Charter](<../../Project_Governance & Stakeholder/Project_Charter.md>), [Resource Plan](../../Project_Resource_Plan/ResourcePlan.md), [Feasibility Study](../../Project_Feasibility/feasibility.md) |
| Bài giảng                           | Kiểm tra cấu trúc business requirements, vision, scope và change control | [Business Requirements](../../refs/03-1-business-requirements.md), [Project Initiation](../../refs/03-software-project-initiation.md)                                                                       |

Tiến trình kiểm chứng được:

```text
Vấn đề/đối thủ/quy trình hiện tại
→ xác định người dùng và phát biểu vấn đề
→ viết vision, mission và positioning
→ đặt mục tiêu và chỉ số
→ xác định in-scope/out-of-scope và system boundary
→ đối chiếu feasibility/resource/charter
→ truy vết sang backlog, workflow, prototype, architecture
→ thống nhất baseline JD-first để dẫn xuất các tài liệu phía sau
```

Các vai trò tham gia được trình bày như sau:

- Product Owner/BA chịu trách nhiệm chính về người dùng, giá trị, mục tiêu và phạm vi;
- PM/Scrum Master kiểm tra baseline, lịch, nguồn lực và rủi ro;
- UI/UX kiểm tra luồng người dùng và khả năng hiểu sản phẩm;
- Architecture/PoC kiểm tra ranh giới kỹ thuật và các giả định khó;
- Team Lead kiểm tra tính thống nhất và khả năng bàn giao.

## 6. Phương pháp đánh giá và thay đổi sau đánh giá

| Tiêu chí           | Cách kiểm tra                                                                               | Kết quả nhìn thấy                                                            |
| ------------------ | ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Đủ nội dung        | Checklist: users, problem, vision, goals, scope, boundary, assumptions, constraints, future | Bản hiện tại có đủ các phần                                                  |
| Truy vết giá trị   | Kiểm tra `pain → objective → capability → user story/AC`                                    | 8 mục tiêu được ánh xạ sang năng lực và nguồn đo                             |
| Rõ ranh giới       | Tách in-scope, out-of-scope, external systems                                               | Loại payment, integrated video, AI interviewer, mobile/ATS                   |
| Có thể đo          | Mỗi mục tiêu có công thức, threshold, nguồn và owner role                                   | Thêm OBJ-01 đến OBJ-08; baseline ghi “Not measured”                          |
| Khả thi            | Đối chiếu 8 tuần, capacity, cash ceiling, PoC/gates                                         | Thu hẹp pilot vào Front-end Intern/Junior và công cụ họp ngoài               |
| Nhất quán          | Đối chiếu proposal, backlog/AC, prototype, architecture và code                             | Luồng JD, Question Bank, Mentor, Booking, Feedback có mặt ở các artefact sau |
| Kiểm soát thay đổi | So sánh nội dung trước/sau và kiểm tra các tài liệu phụ thuộc                               | Bản JD-first được đồng bộ sang backlog, workflow, prototype và architecture  |

Những thay đổi nổi bật sau đánh giá:

- chuyển từ Question Bank + Mentor Marketplace chung sang **JD-first**;
- thêm direct extraction/OCR fallback và cổng hiệu chỉnh;
- thêm taxonomy/alias, mapping có source/topic/reason và preparation plan;
- thêm mục tiêu đo lường và ranh giới file/OCR/pilot;
- tách rõ tính năng tương lai và giới hạn phạm vi;
- liên kết booking và feedback trở lại JD/plan.

Sau review, Product Owner/BA tổng hợp thay đổi vào baseline; các vai trò liên quan kiểm tra lại phần thuộc trách nhiệm của mình. Sponsor approval được quản lý ở Charter, không phải là mục tiêu chính của Vision & Scope.

## 7. Sử dụng và cập nhật

- Product Owner/BA dùng làm nguồn cấp cao để phân rã [Product Backlog and Acceptance Criteria](../../Project_Vision_and_Scope/Product_Backlog_and_Acceptance_Criteria.md).
- UI/UX dùng để thiết kế luồng và [Prototype](../../Project_Prototype/Prototype_Workflow.md).
- Kiến trúc/PoC dùng để chọn boundary, component và kiểm chứng rủi ro.
- PM dùng để kiểm tra feasibility, nguồn lực, estimate, milestone và scope change.
- Nhóm phát triển dùng backlog/AC dẫn xuất từ tài liệu để xây JD, Question Bank, Mentor, Booking, Feedback và Admin flows.

Tài liệu được cập nhật khi nhóm chuyển trọng tâm sang JD-first: bổ sung correction gate, taxonomy, explainable mapping, các chỉ số và giới hạn pilot. Với Gemini, nhóm quản lý bằng ADR và feature flag vì đây là cách hỗ trợ kỹ thuật; AI interviewer và automatic scoring vẫn ngoài MVP. Nếu Gemini làm thay đổi giá trị hoặc phạm vi cấp cao, nhóm phải tạo change request và cập nhật Vision & Scope.

## 8. Thứ tự trình bày miệng

1. Định nghĩa, WHY và WHEN.
2. Nói vision, người dùng, vấn đề và vòng giá trị.
3. Nêu ranh giới in/out và 3–4 chỉ số tiêu biểu.
4. Trình bày đầu vào và quy trình từ Proposal → baseline JD-first.
5. Giải thích 6 lớp đánh giá và thay đổi sau đánh giá.
6. Nêu cách tài liệu được dùng và nguyên tắc phân biệt scope change với technical decision.

## 9. Bản in và bằng chứng

- [ ] **Bắt buộc:** [Project Vision and Scope](../../Project_Vision_and_Scope/Project_Vision_and_Scope.md) — hoàn toàn bằng tiếng Anh.
- [ ] Trang đầu và phần scope/objectives của [Product Backlog and Acceptance Criteria](../../Project_Vision_and_Scope/Product_Backlog_and_Acceptance_Criteria.md) nếu tài liệu này được chuẩn hóa hoàn toàn bằng tiếng Anh trước khi in.
- [ ] Một trang thể hiện truy vết `problem → objective → capability → backlog/acceptance criteria`.
- [ ] Không in tài liệu tiếng Việt như tài liệu nộp chính; phần Oral Exam này chỉ dùng để ôn.

## 10. Nguồn kiểm chứng

- [Project Vision and Scope](../../Project_Vision_and_Scope/Project_Vision_and_Scope.md)
- [Project Proposal](../../Project_Proposal/Project_Proposal_Draft.md)
- [Project Charter](<../../Project_Governance & Stakeholder/Project_Charter.md>)
- [Product Backlog and Acceptance Criteria](../../Project_Vision_and_Scope/Product_Backlog_and_Acceptance_Criteria.md)
- Git: `0743a685195a3396511a59c83515860c9f11bfdd`, `7ca1f6ede1a0d71b3541cb2c15d06f03323a9135`.
