# Câu 09 — Định nghĩa quy trình phát triển phần mềm

## 1. Câu hỏi chính

**Câu hỏi:** Trình bày quá trình hình thành và phương pháp đánh giá tài liệu Định nghĩa quy trình phát triển phần mềm của nhóm.

**Câu trả lời viết tay trong không quá 10 phút:**

Trước tiên nhóm xác định Tài liệu Định nghĩa quy trình phát triển phần mềm phải mô tả nhóm chuyển những yêu cầu thành một increment đã review, kiểm tra và tích hợp như thế nào.
Đầu vào của tài liệu này bao gồm Project Charter, Vision & Scope, Product Backlog/acceptance criteria, Resource Plan, prototype, Architecture/ADR, quy tắc Ready/Done và bằng chứng Git/PR/CI.

Từ các đầu vào đó, nhóm xác định quy trình **Kanban theo tuần** vì sáu thành viên làm nhiều công việc song song và cần đổi ưu tiên linh hoạt. Kế hoạch dự kiến là tám tuần. Trưởng nhóm sẽ điều hành deadline, Kanban, blocker, review/merge và xác nhận Done

Flow chính của quy trình là **Product Backlog → Ready (WIP 6) → In Progress (WIP 6) → Review (WIP 3) → Done theo tuần**. Story chỉ vào Ready khi đạt Definition of Ready. Thành viên nhận việc qua phân công/Messenger, thực hiện trên branch, tự kiểm tra acceptance criteria, commit và tạo Pull Request. Trưởng nhóm sẽ review/feedback; GitHub Actions kiểm tra chất lượng và secret; sau khi đạt yêu cầu, thay đổi được merge và xác nhận Done. PoC dùng để kiểm chứng rủi ro kỹ thuật nhưng được quản lý riêng, không nằm trên Trello. Feedback hoặc change được Product Owner phản hồi sẽ đưa các task lại backlog để người được phân công xem lại.

Trong quá trình xây dựng tài liệu Quy trình phát triển phần mềm, nhóm lập dàn ý và sử dụng AI để hỗ trợ diễn đạt nội dung. Sau đó, nhóm kiểm tra xem tài liệu đã mô tả đầy đủ vai trò, trạng thái công việc, đầu vào/đầu ra, giới hạn công việc đang thực hiện (WIP), điều kiện Ready/Done và các bước kiểm soát chất lượng hay chưa. Nội dung tài liệu tiếp tục được đối chiếu với các bằng chứng của dự án như Charter, Backlog, Resource Plan, bảng Trello được tái dựng, tin nhắn Messenger, lịch sử Git, Pull Request và kết quả CI. Nhóm đánh giá theo ba bước **Tiêu chí → Bằng chứng → Kết luận**. Một nội dung chỉ được xem là đạt khi có bằng chứng về luồng công việc, người chịu trách nhiệm và việc tích hợp sản phẩm. Tuy nhiên, nhóm không có đầy đủ ảnh chụp Trello theo từng ngày, bảng ghi thời gian làm việc, lịch sử năng suất và thời gian xử lý công việc, bản cập nhật dự báo hằng tuần hoặc hồ sơ kiểm thử chấp nhận của người dùng (UAT). Vì vậy, tài liệu phải ghi rõ đâu là quy trình nhóm đã đề ra, đâu là thông tin có bằng chứng kiểm chứng được và đâu là dữ liệu được tái dựng sau đó.

## 2. Câu hỏi thường gặp

### 2.1 Các câu hỏi chính cần trả lời trong tài liệu Định nghĩa quy trình phát triển phần mềm là gì?

Tài liệu cần trả lời: nhóm sử dụng mô hình phát triển nào; quy trình gồm những vai trò, hoạt động, đầu vào, đầu ra và công cụ nào; công việc chuyển qua các trạng thái ra sao; điều kiện Ready và Done là gì; các bước kiểm soát chất lượng và tạo bản phân phối hoạt động được thực hiện như thế nào.

### 2.2 Mô hình cơ sở được lựa chọn để hiệu chỉnh là gì?

Nhóm chọn **Kanban/Agile theo tuần**, không vận hành theo sprint. Nhóm hiệu chỉnh Kanban thành luồng `Product Backlog → Ready (WIP 6) → In Progress (WIP 6) → Review (WIP 3) → Done`, đồng thời bổ sung Definition of Ready, Definition of Done, architecture review, Pull Request, CI và release review để phù hợp với dự án.

### 2.3 Thời gian dự kiến của từng giai đoạn là bao lâu?

Kanban không quy định thời lượng cố định cho từng trạng thái như một mô hình chia theo giai đoạn hoặc sprint. Nhóm vận hành theo chu kỳ tuần: refinement, phân công, theo dõi và xác nhận Done được thực hiện trong tuần; thời gian của từng công việc phụ thuộc vào độ phức tạp và giới hạn WIP. Cửa sổ kế hoạch của dự án là tám tuần, từ 29/06 đến 23/08/2026; lịch thực hiện bốn tuần từ 27/07 đến 23/08 là dữ liệu tái dựng, còn InterviewQuestionBank được thực hiện thực tế trong hai tuần từ 10/08 đến 23/08.

### 2.4 Các vai trò nào từng thành viên trong nhóm sẽ đảm nhiệm?

| Thành viên | Vai trò chính                                                                                  |
| ---------- | ---------------------------------------------------------------------------------------------- |
| Tuấn Anh   | Project Manager / Team Leader / Timekeeper; Kanban, deadline, escalation, review/merge và Done |
| Gia Thành  | Project Planning & Estimation Analyst / Full-stack Developer                                   |
| Hưng       | Product Owner / Business Analyst; backlog, AC và acceptance                                    |
| Luân       | Architecture / Technical Lead; stack, ADR và technical review                                  |
| Hùng       | UI/UX Designer / Front-end Developer                                                           |
| Trí        | PoC / Integration & E2E Developer                                                              |

### 2.5 Các sản phẩm nào dự kiến sẽ khởi tạo?

Các sản phẩm dự kiến gồm Charter; Stakeholder Analysis; Vision & Scope; Product Backlog và acceptance criteria; Resource Plan; prototype; Architecture/ADR; bảng Trello Kanban; PoC; source code; migration; API contract; Pull Request; kết quả CI; bằng chứng kiểm thử; increment và hướng dẫn phát hành.

### 2.6 Quy trình để đưa ra một bản phân phối hoạt động là gì?

Product Owner sắp xếp backlog và đưa story đạt Definition of Ready vào Ready. Trưởng nhóm phân công story; thành viên xác nhận qua Messenger, thực hiện trên branch, tự kiểm tra acceptance criteria, commit và tạo Pull Request. Sau khi Pull Request được review, phản hồi được xử lý và CI chạy đạt, thay đổi được merge. Nhóm kiểm tra increment đã tích hợp, Product Owner xác nhận kết quả và trưởng nhóm xác nhận Done trước khi đưa vào bản phân phối.

### 2.7 Ưu và khuyết điểm của mô hình nhóm lựa chọn là gì?

**Ưu điểm:** Kanban trực quan hóa luồng công việc, giới hạn việc đang làm, giúp phát hiện blocker, hỗ trợ nhiều công việc song song và cho phép thay đổi ưu tiên linh hoạt.

**Khuyết điểm:** nếu bảng không được cập nhật đúng thời điểm thì khó đo năng suất và thời gian xử lý; giới hạn WIP chỉ có ý nghĩa khi được tuân thủ; nếu thiếu nhịp review đều đặn thì backlog và trạng thái công việc có thể lệch so với thực tế.

### 2.8 Tài liệu Định nghĩa quy trình phát triển phần mềm của nhóm đã được đánh giá thế nào?

Nhóm đánh giá theo phương pháp **Tiêu chí → Bằng chứng → Kết luận**. Tiêu chí gồm vai trò, trạng thái, WIP, Ready/Done, đầu vào/đầu ra và các bước kiểm soát chất lượng. Bằng chứng được lấy từ Charter, Backlog, Resource Plan, Trello, Messenger, Git, Pull Request, CI, kiểm thử và các tài liệu dự án. Nội dung có bằng chứng thì được kết luận là đạt; nội dung thiếu bằng chứng được ghi là chưa đủ dữ liệu; dữ liệu tái dựng phải được ghi rõ và không được xem là dữ liệu thực tế theo thời điểm.

### 2.9 Tại sao cần tạo tài liệu Định nghĩa quy trình phát triển phần mềm?

Tài liệu giúp các thành viên thống nhất cách làm việc, biết rõ trách nhiệm của mình, hiểu điều kiện chuyển trạng thái và tuân theo cùng các bước review, kiểm tra, tích hợp và xác nhận Done. Tài liệu cũng là cơ sở để kiểm soát công việc, phát hiện điểm nghẽn, đánh giá việc tuân thủ quy trình và cải tiến cách làm việc của nhóm.

### 2.10 Tài liệu được sử dụng và cập nhật trong quá trình thực hiện dự án như thế nào?

Nhóm sử dụng tài liệu để liên kết backlog, phân công, quá trình thực hiện, Pull Request, CI và trạng thái Done. Khi dự án chuyển từ Splitly sang InterviewQuestionBank rồi thu hẹp sang hướng candidate-first, nhóm cập nhật Charter, Proposal, backlog, kế hoạch, kiến trúc và quy trình liên quan. Khi luồng công việc, vai trò hoặc bằng chứng thay đổi, tài liệu quy trình cũng được cập nhật và tiếp tục ghi rõ phần nào là dữ liệu thực tế, phần nào là dữ liệu tái dựng.

## 3. Tài liệu đi kèm

- [ ] [Software Process Definition — English version](../../print/Q09_software-process/Software_Process_Definition_EN.md).
- [ ] [Kanban software-process overview](../../print/Q09_software-process/img/software-process-overview.png).
- [ ] [Reconstructed Kanban evidence](../../print/Q11_project-plan/img/Q11-06-reconstructed-kanban-user-stories.png).
