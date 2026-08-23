# Câu 09 — Định nghĩa quy trình phát triển phần mềm

## 1. Câu hỏi chính

**Câu hỏi:** Trình bày quá trình hình thành và phương pháp đánh giá tài liệu Định nghĩa quy trình phát triển phần mềm của nhóm.

**Câu trả lời viết tay trong không quá 10 phút:**

Tài liệu Định nghĩa quy trình phát triển phần mềm mô tả nhóm chuyển yêu cầu thành một increment đã review, kiểm tra và tích hợp như thế nào. Đầu vào gồm Project Charter, Vision & Scope, Product Backlog/acceptance criteria, Resource Plan, prototype, Architecture/ADR, quy tắc Ready/Done và bằng chứng Git/PR/CI.

Từ các đầu vào đó, nhóm xác định quy trình **Kanban theo tuần** vì sáu thành viên làm nhiều workstream song song và cần đổi ưu tiên linh hoạt. Cửa sổ kế hoạch là tám tuần; InterviewQuestionBank được thực hiện thực tế trong hai tuần cuối, còn lịch execution bốn tuần và Trello là dữ liệu tái dựng. Tuấn Anh điều hành deadline, Kanban, blocker, review/merge và xác nhận Done; Hưng ưu tiên backlog và chấp nhận story.

Flow chính là **Product Backlog → Ready (WIP 6) → In Progress (WIP 6) → Review (WIP 3) → Done theo tuần**. Story chỉ vào Ready khi đạt Definition of Ready. Thành viên nhận việc qua phân công/Messenger, thực hiện trên branch, tự kiểm tra acceptance criteria, commit và tạo Pull Request. Tuấn Anh review/feedback; GitHub Actions kiểm tra chất lượng và secret; sau khi đạt yêu cầu, thay đổi được merge và xác nhận Done. PoC dùng để kiểm chứng rủi ro kỹ thuật nhưng được quản lý riêng, không nằm trên Trello. Feedback hoặc change được Product Owner đưa lại backlog để sắp xếp lại.

Tôi đánh giá tài liệu bằng cách kiểm tra đủ vai trò, trạng thái, input/output, WIP, Ready/Done và gate, sau đó đối chiếu với Charter, Backlog, Resource Plan, Trello tái dựng, Messenger, Git history, PR và CI. Cách đánh giá là **Criteria → Evidence → Judgement**. Điểm đạt là flow, ownership và integration có bằng chứng; điểm hạn chế là không có snapshot Trello gốc theo ngày, timesheet, throughput/cycle-time history, weekly reforecast hay UAT record đầy đủ. Vì vậy, tài liệu phải phân biệt rõ quy trình đã định nghĩa, bằng chứng quan sát được và dữ liệu tái dựng.

## 2. Câu hỏi thường gặp

### 2.1 Nhóm dùng mô hình quy trình nào và vì sao?

Nhóm dùng **Kanban/Agile theo tuần**, không vận hành sprint. Kanban phù hợp vì nhóm nhỏ, workstream khác nhau, thời gian thực hiện ngắn và cần thay đổi ưu tiên sau feedback. Nhóm giữ các quality gate như Definition of Ready, Definition of Done, architecture review, Pull Request, CI và release review.

### 2.2 Đầu vào và các bước tạo tài liệu là gì?

**Đầu vào:** Charter; Vision & Scope; Product Backlog/AC; Resource Plan; prototype; Architecture/ADR; Ready/Done; phân công; Trello; Git/PR/CI và feedback của nhóm.

**Các bước:**

1. Xác định vai trò, work product, công cụ và gate từ tài liệu dự án.
2. Tái dựng flow từ backlog, phân công, Trello và luồng Git/PR/CI.
3. Mô tả input, activity, output và điều kiện chuyển trạng thái.
4. Đối chiếu với evidence, ghi rõ phần thực tế, phần tái dựng và khoảng trống.

### 2.3 Quy trình Kanban của nhóm vận hành như thế nào?

`Product Backlog → Ready (6) → In Progress (6) → Review (3) → Done theo tuần`.

- Product Owner sắp xếp backlog; refinement thực hiện ít nhất hằng tuần hoặc khi cần thêm việc.
- Story chỉ vào Ready khi actor/value, AC, dependency, input kỹ thuật, estimate và test data cần thiết đã rõ.
- Tuấn Anh giao việc; thành viên xác nhận qua Messenger và thực hiện trên branch.
- Owner tự kiểm tra AC → commit → Pull Request → review/feedback → GitHub Actions → merge → xác nhận Done.
- Blocker được báo qua Messenger; change ảnh hưởng scope được đưa lại backlog và reforecast.
- PoC chạy song song để kiểm chứng rủi ro kỹ thuật và không nằm trên Trello.

### 2.4 Vai trò của các thành viên là gì?

| Thành viên | Vai trò chính |
| --- | --- |
| Tuấn Anh | Project Manager / Team Leader / Timekeeper; Kanban, deadline, escalation, review/merge và Done |
| Gia Thành | Project Planning & Estimation Analyst / Full-stack Developer |
| Hưng | Product Owner / Business Analyst; backlog, AC và acceptance |
| Luân | Architecture / Technical Lead; stack, ADR và technical review |
| Hùng | UI/UX Designer / Front-end Developer |
| Trí | PoC / Integration & E2E Developer |

### 2.5 Thời gian dự án được hiểu như thế nào?

- **8 tuần:** cửa sổ kế hoạch học phần, từ 29/06 đến 23/08/2026.
- **4 tuần:** lịch execution tái dựng, từ 27/07 đến 23/08; không phải actual đầy đủ.
- **2 tuần:** thời gian thực hiện InterviewQuestionBank thực tế, từ 10/08 đến 23/08.


### 2.6 Các work product chính là gì?

Charter; Stakeholder Analysis; Vision & Scope; Product Backlog/AC; Resource Plan; prototype; Architecture/ADR; Trello Kanban; PoC; source code; migrations; API contract; Pull Request; CI result; test/evidence; increment và release guidance.

### 2.7 Tài liệu và quy trình được đánh giá như thế nào?

Tôi dùng **Criteria → Evidence → Judgement**:

1. Criteria: đúng vai trò, flow, WIP, Ready/Done, input/output và quality gate.
2. Evidence: Charter, Backlog, Resource Plan, Trello, Messenger, Git, PR, CI, test và tài liệu dự án.
3. Judgement: Pass khi mô tả có evidence; Pending khi thiếu dữ liệu; phần tái dựng phải được gắn nhãn, không được gọi là actual.

### 2.8 Ưu và nhược điểm của Kanban trong dự án là gì?

**Ưu điểm:** trực quan hóa flow, giới hạn việc đang làm, dễ đổi ưu tiên, thấy blocker và hỗ trợ nhiều workstream song song.

**Nhược điểm:** nếu board không được cập nhật đúng thời điểm thì khó đo cycle time/throughput và dự báo; WIP limit chỉ có ý nghĩa khi nhóm thực sự tuân thủ; thiếu cadence review có thể làm backlog và flow lệch thực tế.

### 2.9 Tài liệu được sử dụng và cập nhật như thế nào?

Tài liệu liên kết backlog với phân công, implementation, PR/CI và Done. Khi nhóm pivot từ Splitly sang InterviewQuestionBank rồi thu hẹp sang candidate-first, Charter, Proposal, backlog, planning và architecture được làm lại. Khi flow hoặc evidence thay đổi, tài liệu quy trình phải cập nhật nhưng vẫn giữ disclosure về dữ liệu tái dựng.

### 2.10 Những giới hạn bằng chứng nào phải công khai?

Nhóm không có snapshot Trello gốc theo ngày, timesheet, throughput/cycle-time history đáng tin cậy, biên bản retrospective, weekly reforecast record hoặc UAT record đầy đủ. Board được tái dựng ngày 16/08; 26/27 story và 129/134 SP Done là trạng thái ghi trên board tái dựng, không phải phần trăm hoàn thành theo effort.

### 2.11 Software Process Definition khác Project Plan thế nào?

Software Process Definition trả lời **nhóm làm việc theo flow nào, dùng công cụ/gate gì và chuyển trạng thái khi nào**. Project Plan trả lời **làm scope nào, ai làm, trong thời gian–nguồn lực–chi phí nào và dự báo ra sao**.

## 3. Tài liệu đi kèm

- [ ] [Software Process Definition — English version](Software_Process_Definition_EN.md).
- [ ] [Kanban software-process overview](img/software-process-overview.png).
- [ ] [Reconstructed Kanban evidence](../Q11_project-plan/img/Q11-06-reconstructed-kanban-user-stories.png).
