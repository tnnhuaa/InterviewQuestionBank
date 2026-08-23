# Báo cáo — Quản lý và phát triển nhóm

## Thông tin kiểm soát tài liệu

| Thuộc tính                 | Nội dung                                                                   |
| -------------------------- | -------------------------------------------------------------------------- |
| Tên tài liệu               | Team Management Report — PrepVI (Interview Practice Platform)              |
| Phiên bản                  | 1.0                                                                        |
| Ngày lập báo cáo           | 23/08/2026                                                                 |
| Giai đoạn áp dụng          | 29/06/2026–23/08/2026                                                      |
| Chủ sở hữu và người tổng hợp | Tuấn Anh — Project Manager / Team Leader / Timekeeper                    |
| Người review               | Tuấn Anh                                                                   |
| Ngày review                | 23/08/2026                                                                 |

> **Lưu ý về dữ liệu:** Báo cáo chỉ dùng dữ kiện nhóm xác nhận và nội dung trong repository, không dựng biên bản họp, timesheet hay dữ liệu tracking không thực sự tồn tại. Dữ liệu tái dựng được ghi rõ, không trình bày như actual.

## 1. Tóm tắt điều hành

Nhóm có sáu thành viên và vận hành theo cơ cấu dự án tập trung (projectized), với một đầu mối quyết định. Trong cửa sổ học phần tám tuần 29/06–23/08/2026, nhóm trải qua đủ các giai đoạn hình thành và phát triển: làm việc với Splitly lúc đầu, bế tắc về ý tưởng sau phản biện giữa kỳ, rồi thống nhất hướng mới InterviewQuestionBank ngày 09/08 và thực hiện trong hai tuần cuối, từ 10/08 đến 23/08.

Phân công dựa trên vai trò và kỹ năng từ các dự án trước; việc được giao theo tuần, deadline mặc định 22:00 thứ Bảy, thành viên xác nhận nhận việc qua Messenger và mọi thay đổi đi qua pull request có review. Vấn đề quản lý con người lớn nhất là mọi quyết định đều phụ thuộc vào một người, còn độ phức tạp giữa các phần việc không đồng đều khiến một số task trễ hạn. Cả hai đã được xử lý nhưng nguyên nhân gốc vẫn còn.

## 2. Bối cảnh và mục tiêu

### 2.1 Bối cảnh học phần

| Thời điểm        | Sự kiện                                                                                                   |
| ---------------- | --------------------------------------------------------------------------------------------------------- |
| 29/06/2026       | Nhóm bắt đầu cửa sổ dự án tám tuần với đề tài Splitly.                                                     |
| 24/07/2026       | Sau buổi giữa kỳ, giảng viên phản biện giá trị sản phẩm của Splitly; nhóm phải xem lại bài toán.           |
| 24/07–09/08/2026 | Nhóm brainstorm nhưng chưa chốt được hướng mới.                                                            |
| 09/08/2026       | Nhóm chốt sơ bộ InterviewQuestionBank và làm lại Initiation, Planning.                                    |
| 10/08/2026       | Nhóm bắt đầu execution thực tế cho đề tài mới.                                                             |
| 13/08/2026       | Nhóm xác nhận chính thức hướng “web interview” và chuẩn bị phân chia công việc.                           |
| 14/08/2026       | Giảng viên thực hành góp ý ưu tiên pain point ứng viên; nhóm thu hẹp thành candidate-first theo JD.        |
| 16/08/2026       | Tuấn Anh tái dựng Kanban từ Product Backlog.                                                               |
| 23/08/2026       | Kết thúc cửa sổ học phần; review Project Plan 1.0 và bước vào tổng kết.                                   |

### 2.2 Mục tiêu của công tác quản lý nhóm

- Phân định vai trò và trách nhiệm rõ ràng cho sáu thành viên.
- Phân công công việc theo tuần, có deadline, đầu ra và người kiểm tra chéo.
- Tích hợp công việc của nhiều workstream qua Git/GitHub và pull request.
- Xử lý blocker, thay đổi phạm vi và các vấn đề về người.
- Đảm bảo delivery nằm trong giới hạn thời gian còn lại sau khi pivot.

## 3. Cơ sở lý thuyết

### 3.1 Năm giai đoạn phát triển nhóm (Tuckman)

| Giai đoạn  | Đặc điểm                                                             | Việc người lãnh đạo nên làm                              |
| ---------- | -------------------------------------------------------------------- | -------------------------------------------------------- |
| Forming    | Thành viên dè dặt, mục tiêu và vai trò chưa rõ                        | Làm rõ mục tiêu, vai trò, công cụ và cách giao tiếp      |
| Storming   | Xuất hiện khác biệt về ưu tiên, cách làm hoặc quyền quyết định        | Lắng nghe, làm rõ tiêu chí và giữ thảo luận vào vấn đề   |
| Norming    | Nhóm thống nhất quy tắc và tin nhau hơn                               | Chuẩn hóa cách làm và giao trách nhiệm rõ                |
| Performing | Nhóm chủ động phối hợp để đạt mục tiêu                                 | Trao quyền, gỡ blocker, tránh can thiệp quá mức          |
| Adjourning | Công việc kết thúc, bàn giao và rút kinh nghiệm                       | Ghi nhận đóng góp, bàn giao tri thức, rút bài học        |

### 3.2 Các loại hình tổ chức

| Loại             | Quyền của PM | Nguồn lực                             | Đặc điểm                                             |
| ---------------- | ------------ | ------------------------------------- | ---------------------------------------------------- |
| Chức năng        | Thấp         | Thuộc trưởng bộ phận                  | Nhân sự theo chuyên môn; dự án qua nhiều phòng       |
| Theo dự án       | Cao          | Dành chủ yếu cho dự án                | Nhóm tập trung một dự án; PM điều phối trực tiếp     |
| Ma trận yếu      | Thấp         | Functional Manager giữ quyền chính    | PM giống điều phối viên                              |
| Ma trận cân bằng | Chia sẻ      | PM và Functional Manager cùng quản lý | Cần phối hợp thẩm quyền rõ                           |
| Ma trận mạnh     | Khá cao      | PM kiểm soát phần lớn nguồn lực       | Gần projectized nhưng chuyên môn thuộc phòng ban     |

### 3.3 Theory X, Y và Z

- **Theory X:** con người ngại làm và cần kiểm soát chặt; hữu ích ngắn hạn, dễ giảm sáng tạo.
- **Theory Y:** con người tự định hướng khi hiểu mục tiêu và được trao trách nhiệm; quản lý tập trung gỡ cản trở và phản hồi.
- **Theory Z:** đầu tư vào giá trị chung, niềm tin, quyết định có sự tham gia và trách nhiệm cá nhân.

### 3.4 Tháp nhu cầu Maslow

Từ thấp đến cao gồm nhu cầu sinh lý, an toàn, quan hệ/thuộc về, được tôn trọng và tự thể hiện. Trong nhóm sinh viên, người lãnh đạo không thể đáp ứng mọi nhu cầu, nhưng có thể tạo môi trường an toàn khi nêu lỗi, giữ lịch làm việc hợp lý, xây cảm giác thuộc về, ghi nhận đóng góp và giao cơ hội học kỹ năng mới.

## 4. Cách áp dụng vào dự án

### 4.1 Cơ cấu vai trò

Cách tổ chức của nhóm gần với **projectized**: sáu thành viên cùng làm một sản phẩm, không thuộc các phòng ban chức năng, có vai trò dự án riêng và Tuấn Anh giữ quyền điều hành trực tiếp.

| Thành viên | Vai trò chính                              | Trách nhiệm / đầu ra                                                                      |
| ---------- | ------------------------------------------ | ------------------------------------------------------------------------------------------ |
| Tuấn Anh   | Project Manager / Team Leader / Timekeeper | Phân vai, giao việc, deadline và Kanban, chốt quyết định, review/merge, xác nhận Done      |
| Gia Thành  | Project Planning & Estimation Analyst / Full-stack Developer | Charter, Resource Plan, Cost–Time–Resources, hai estimate và implementation Full-stack |
| Hưng       | Product Owner / Business Analyst           | Vision & Scope, Product Backlog, acceptance criteria, workflow và acceptance               |
| Luân       | Architecture / Technical Lead              | Technology stack, ADR, architecture và hỗ trợ kỹ thuật PoC/implementation                  |
| Hùng       | UI/UX Designer / Front-end Developer       | Clickable prototype, workflow, bằng chứng usability và giao diện front-end                 |
| Trí        | PoC / Integration & E2E Developer          | PoC core flow, seed data, tích hợp, test đầu-cuối và bằng chứng rủi ro kỹ thuật            |

### 4.2 Quá trình hình thành và phát triển nhóm

| Giai đoạn  | Sự kiện của nhóm                                                                   | Giới hạn diễn giải                                                            |
| ---------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Forming    | 29/06: sáu thành viên bắt đầu dự án Splitly                                        | Chưa có biên bản lập nhóm hoặc bằng chứng vai trò ban đầu                      |
| Storming   | 24/07–09/08: bế tắc brainstorming, chưa chốt hướng mới sau phản biện của giảng viên | Bất ổn về mục tiêu/quyết định; không đủ bằng chứng gọi là xung đột cá nhân    |
| Norming    | 09/08–14/08: chốt InterviewQuestionBank, tham khảo giảng viên, làm lại Initiation/Planning, chuyển candidate-first | Nhóm giữ vai trò cũ và ánh xạ scope mới theo phần việc tương tự |
| Performing | 10/08–23/08: phát triển song song, tích hợp qua PR/CI; board ghi 129/134 SP Bắt buộc Done | Board tái dựng 16/08; không dùng SP/commit xếp hạng thành viên |
| Adjourning | 23/08: review Project Plan 1.0, bước vào tổng kết và Lessons Learned             | Chỉ nói “bắt đầu close”; chưa có bằng chứng nhóm đã giải thể                   |

### 4.3 Quy tắc làm việc nhóm đã áp dụng

| Quy tắc                    | Nội dung                                                                                          |
| -------------------------- | ------------------------------------------------------------------------------------------------- |
| Phân công                  | Tuấn Anh giao việc theo tuần; bảng tuần ghi thành viên, cụm phụ trách, nội dung, file đầu ra, người cross-check |
| Deadline mặc định          | 22:00 thứ Bảy hằng tuần; khi nhiều thành viên bận lịch khác, Tuấn Anh nới hạn cho cả nhóm         |
| Kênh liên lạc              | Messenger; thành viên thả tim tin nhắn phân công để xác nhận đã nhận việc                         |
| Nhịp họp                   | Không họp cố định; chỉ họp khi có quyết định cần chốt để tránh lệch hướng                         |
| Blocker                    | Báo lên nhóm Messenger để cả nhóm trao đổi; nhóm không quy định thời gian phản hồi                |
| Quy tắc repository         | Không push trực tiếp lên `main`; thay đổi qua pull request và cần ít nhất một approval            |
| Definition of Done         | Owner tự kiểm tra acceptance criteria trước PR; Tuấn Anh review, feedback, merge, xác nhận Done   |
| Chất lượng tự động         | GitHub Actions: lint, typecheck, OpenAPI drift, migration, seed, build và Gitleaks                |

### 4.4 Quy trình phân công trong bảng tuần

1. Tuấn Anh lập bảng giao việc: thành viên, cụm phụ trách, nội dung cụ thể, file đầu ra, người cross-check.
2. Gửi bảng qua Messenger; thành viên thả tim để xác nhận đã nhận thông tin.
3. Thành viên thực hiện trên branch, tự kiểm tra acceptance criteria rồi tạo pull request.
4. Người cross-check và Tuấn Anh review, chỉ ra phần chưa đạt; CI chạy quality gate.
5. Sau ít nhất một approval, Tuấn Anh merge và xác nhận trạng thái Done.

## 5. Vấn đề quản lý con người thực tế

| Sự kiện thật                                                    | Nguyên nhân                                                                  | Cách nhóm xử lý                                                                                                                                    | Kết quả và giới hạn                                                                                                                          |
| --------------------------------------------------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| 24/07–09/08: bế tắc brainstorm                                   | Thành viên đưa ý kiến nhưng không tự quyết; nhóm thiếu tiêu chí sàng lọc chung | Tuấn Anh tổ chức brainstorm, đánh giá ý tưởng theo sản phẩm hiện có, khả năng kết hợp giải pháp, mức sẵn sàng đổi công cụ của người dùng và rủi ro; tự chốt phương án và tham khảo giảng viên | Chốt InterviewQuestionBank 09/08 và thực hiện từ 10/08. Phá được bế tắc nhưng tập trung quyết định vào một người |
| Một số phần việc trễ deadline                                    | Độ phức tạp task không đồng đều; thành viên bận lịch nộp bài môn khác          | Tuấn Anh nới deadline cho cả nhóm thay vì chỉ điều chỉnh cá nhân                                                                                   | Giữ mức hoàn thiện tương đối đồng đều; chưa có timesheet nên không đo được mức trễ chính xác                                               |
| Trí commit `.env` (có key) và `node_modules` vào repository       | Thiếu bước tự kiểm tra file nhạy cảm và file sinh tự động trước khi push        | Tuấn Anh phát hiện qua review/CI; Trí loại file trong `df3d6c1`; Tuấn Anh bổ sung rule `.gitignore` trong `0556a6e`; nhóm revoke credential cũ, tạo key mới | Loại file nhạy cảm và dependency khỏi phiên bản theo dõi; giảm nguy cơ lặp lại nhưng credential đã từng lộ trong lịch sử Git                      |

### 5.1 Đánh giá từ góc độ lý thuyết

- **Tuckman:** nhóm đạt Norming–Performing trong hai tuần cuối nhờ giữ vai trò, stack quen thuộc và hành trình candidate-first rõ ràng. Giai đoạn Storming xuất phát từ bất ổn mục tiêu sau khi đề tài cũ bị phản biện, không phải xung đột cá nhân.
- **Tổ chức:** cơ cấu gần projectized, với thẩm quyền phân vai, chốt ý tưởng và điều chỉnh deadline đúng với vai trò thực tế của Tuấn Anh.
- **Theory Y và X:** giao vai trò theo kinh nghiệm và để thành viên dùng stack quen thuộc phù hợp Theory Y. Khi nhóm bị bế tắc, Tuấn Anh điều hành trực tiếp và kiểm soát quyết định chặt hơn, có nét gần Theory X, nhưng chưa đủ để nói anh cho rằng thành viên lười biếng.
- **Maslow:** nhóm chưa có bằng chứng về hoạt động tạo động lực, cross-training hoặc coaching; môi trường an toàn kỹ thuật (CI, review, sai sót có hướng khắc phục) phản ánh một phần nhu cầu an toàn và thuộc về.

## 6. Bằng chứng

### 6.1 Ảnh nhóm tại buổi học cuối

![Ảnh nhóm tại buổi học cuối](img/Q16-04-group-final-class.png)

Hình 1 là ảnh nhóm chụp tại buổi học cuối, dùng để minh chứng sự hiện diện và thời điểm nhóm làm việc.

### 6.2 Bảng phân công tuần 6

![Bảng phân công tuần 6](img/Q16-03-weekly-assignment-w6.png)

Hình 2 ghi nhận sáu cụm phụ trách tuần 6: Governance/Stakeholder, Business/Competitor, Product Vision/Scope/UX, Requirement/Acceptance, Architecture/Technical PoC và Feasibility/Project Planning. Bảng cho thấy cách phân công và lịch dự kiến, nhưng không chứng minh mọi đầu ra hoàn thành đúng 22:00 thứ Bảy.

### 6.3 Xác nhận nhận việc qua Messenger

![Tin nhắn Messenger có phản ứng tim](img/Q16-06-messenger-heart-ack.png)

Hình 3 cho thấy tin nhắn phân công có phản ứng tim. Phản ứng này chỉ xác nhận thành viên đã tiếp nhận thông tin, không chứng minh công việc đã bắt đầu hoặc hoàn thành.

### 6.4 Sự cố credential và cách khắc phục

![PR #3 có .env và node_modules, đã che credential](img/Q16-02-pr3-env-node-modules-redacted.png)

![GitHub Actions secret-scan thất bại](img/Q16-05-secret-scan-failed.png)

Hình 4 chứng minh `.env` và `node_modules` xuất hiện trong diff PR #3, giá trị credential đã được che. Hình 5 cho thấy job `secret-scan` thất bại vì thiếu `GITHUB_TOKEN` khi quét pull request, nên ảnh này không chứng minh Gitleaks phát hiện credential trong `.env`. Cách khắc phục nằm trong commit `df3d6c1` (16/08) và `0556a6e` (18/08); credential cũ đã được revoke.

### 6.5 Bằng chứng về thay đổi phạm vi

Các ảnh `../Q11_project-plan/img/Q11-02-team-confirms-interview-idea.png` đến `Q11-05-candidate-poc-and-mentor-split.png` cho thấy nhóm xác nhận hướng InterviewQuestionBank ngày 13/08, tóm tắt góp ý giảng viên 14/08, cập nhật phạm vi candidate-first và quyết định giữ luồng Mentor riêng.

## 7. Đánh giá

### 7.1 Điểm mạnh

- Vai trò, ownership và DoD được ghi thành tài liệu, có người cross-check.
- Công việc được chia theo tuần, có file đầu ra rõ ràng và deadline mặc định.
- Messenger giúp xác nhận nhận việc nhanh; blocker được đưa lên nhóm chat.
- Git/GitHub và CI tạo lịch sử thay đổi cùng quality gate tự động.
- Giữ vai trò, stack quen thuộc và một đầu mối quyết định giúp nhóm thoát bế tắc trong thời gian gấp.
- Các sự cố kỹ thuật được xử lý kịp thời và có hướng phòng ngừa.

### 7.2 Điểm yếu

- Nhóm không có biên bản họp, retrospective record hoặc action-item log.
- Không quy định thời gian phản hồi trên Messenger, nên việc escalation phụ thuộc vào thành viên chủ động theo dõi nhóm chat.
- Chưa có actual effort theo giờ, contribution review theo tuần hay dữ liệu tracking đáng tin cậy.
- Quyền quyết định tập trung vào Tuấn Anh; các thành viên chưa có phạm vi tự quyết rõ.
- Việc nới deadline chưa đi kèm phân tích nguyên nhân định lượng.
- Chưa có bằng chứng về hoạt động tạo động lực, coaching, cross-training hoặc xử lý xung đột.

### 7.3 Cải tiến cho lần sau

1. Chia nhỏ task, ước lượng sơ bộ và review độ phức tạp sớm.
2. Trao quyền quyết định trong phạm vi rõ ràng cho từng owner, giảm phụ thuộc vào một người.
3. Ghi biên bản ngắn khi có quyết định quan trọng và theo dõi action item.
4. Thu actual effort và phân tích nguyên nhân trễ thay vì chỉ nới deadline.
5. Thêm checklist trước push: file nhạy cảm, file sinh tự động và secret.

## 8. Kết luận

Nhóm đã trải qua đầy đủ các giai đoạn phát triển và đạt mức Norming–Performing khi làm đề tài mới. Những quy tắc làm việc đơn giản, nhất quán giúp nhóm giao việc, phối hợp và tích hợp công việc hiệu quả. Hạn chế lớn nhất là dữ liệu theo dõi con người gần như không tồn tại và quyền quyết định tập trung vào một người; đây là hai hướng cải tiến chính cho các dự án sau.

## 9. Tài liệu tham chiếu

- `docs/Project_Governance & Stakeholder/Project_Charter.md`
- `docs/Project_Governance & Stakeholder/Stakeholder_Analysis.md`
- `docs/Project_Resource_Plan/ResourcePlan.md`
- `docs/refs/08-software-team-management.md`
- `docs/refs/12-software-project-management.md`
- `docs/Oral_Exam/Q11_project-plan/img/Q11-02-team-confirms-interview-idea.png`
- `docs/Oral_Exam/Q11_project-plan/img/Q11-03-instructor-feedback-summary.png`
- `docs/Oral_Exam/Q11_project-plan/img/Q11-04-team-updates-scope-and-plan.png`
- `docs/Oral_Exam/Q11_project-plan/img/Q11-05-candidate-poc-and-mentor-split.png`
- Git history và pull request merge từ 13/08/2026 đến 20/08/2026
- `.github/workflows/ci.yml`
