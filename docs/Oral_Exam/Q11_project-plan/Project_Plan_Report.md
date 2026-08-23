# Kế hoạch dự án — Interview Practice Platform

## Thông tin kiểm soát tài liệu

| Thuộc tính                 | Nội dung                                                                   |
| -------------------------- | -------------------------------------------------------------------------- |
| Tên tài liệu               | Project Plan — Interview Practice Platform                                 |
| Phiên bản                  | 1.0                                                                        |
| Ngày lập báo cáo           | 23/08/2026                                                                 |
| Giai đoạn áp dụng          | 29/06/2026–23/08/2026                                                      |
| Chủ sở hữu và người điều hành kế hoạch | Tuấn Anh — Project Manager / Team Leader / Timekeeper                  |
| Phụ trách dữ liệu planning và estimation | Gia Thành — Project Planning & Estimation Analyst / Full-stack Developer |
| Người review               | Tuấn Anh                                                                   |
| Ngày review                | 23/08/2026                                                                 |
| Xác nhận phạm vi sản phẩm  | Hưng — Product Owner/Business Analyst                                      |
| Sponsor                    | Giảng viên Ngô Huy Biên và Ngô Ngọc Đăng Khoa                              |
| Trạng thái                 | Đã review nội bộ; chưa có phê duyệt chính thức toàn bộ kế hoạch từ Sponsor |

### Lịch sử tài liệu

| Mốc tài liệu                 | Thời điểm        | Nội dung                                                                                                                                                                                                             | Người thực hiện              |
| ---------------------------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| Các tài liệu planning đơn lẻ | 09/08–21/08/2026 | Nhóm lập và cập nhật Proposal, Charter, Vision and Scope, Product Backlog, Resource Plan, estimate, cost baseline, feasibility và ADR. Đây là nguồn của Project Plan, chưa phải một phiên bản Project Plan hợp nhất. | Các owner theo từng tài liệu |
| Project Plan 1.0             | 23/08/2026       | Tuấn Anh hợp nhất các tài liệu nguồn, bổ sung diễn biến thực tế, quyết định pivot, Planned–Actual và giới hạn bằng chứng; đồng thời review khác biệt giữa nguồn đơn lẻ với bản hợp nhất.                             | Tuấn Anh                     |

Phiên bản 1.0 là Project Plan hợp nhất chính thức đầu tiên của nhóm. Vì trước đó nhóm quản lý nội dung planning bằng nhiều file riêng, báo cáo không tạo lịch sử phiên bản Project Plan giả cho giai đoạn 09/08–21/08.

## 1. Tóm tắt điều hành

Interview Practice Platform là web MVP hỗ trợ ứng viên chuẩn bị phỏng vấn từ một Job Description (JD) cụ thể. Sản phẩm nối các bước nhập JD, trích xuất hoặc OCR, xác nhận văn bản, phân tích yêu cầu, ánh xạ câu hỏi, lập kế hoạch ôn tập, tự luyện hoặc đặt lịch Mentor và nhận feedback.

Kế hoạch dự án được lập trong bối cảnh nhóm thay đổi đề tài giữa học phần. Nhóm bắt đầu với Splitly trong cửa sổ tám tuần, từ ngày 29/06 đến 23/08/2026. Sau phần trình bày giữa kỳ ngày 24/07, nhóm nhận ra ý tưởng này chưa đủ mạnh về giá trị sản phẩm, người dùng và khả năng duy trì. Nhóm mất thời gian brainstorm, chốt sơ bộ InterviewQuestionBank ngày 09/08, thực hiện lại Initiation và Planning, rồi triển khai dự án mới từ ngày 10/08 đến 23/08.

Do InterviewQuestionBank không được theo dõi từ đầu cửa sổ học phần, nhóm tái dựng bốn tuần execution từ ngày 27/07 đến 23/08. Việc tái dựng dựa trên kinh nghiệm thực hiện Splitly, backlog của dự án mới và hướng dẫn của giảng viên về trường hợp thiếu dữ liệu theo dõi ban đầu. Bốn tuần này là **kế hoạch hồi cứu**, không phải lịch sử actual. Diễn biến thực tế và baseline tái dựng luôn được trình bày tách biệt trong báo cáo.

Kế hoạch sử dụng capacity danh nghĩa 768 giờ cho sáu thành viên, giữ reserve 15% và giới hạn khoảng 653 giờ cho phạm vi. Trần tiền mặt là 1.125.000 VNĐ; chi phí tiền mặt thực tế là 0 VNĐ vì nhóm chỉ dùng các dịch vụ free tier. Các mức 606 giờ và 650 giờ chỉ là hai working forecast lịch sử trên 20 Must story cũ; backlog hiện tại có 27 story R1 Bắt buộc, tương đương 134 Story Point (SP), nên nhóm chưa xem các con số này là cam kết phát hành.

## 2. Bối cảnh và cơ sở lập kế hoạch

### 2.1 Diễn biến thực tế

| Thời điểm        | Sự kiện và quyết định                                                                                                                                                        |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 29/06/2026       | Nhóm bắt đầu cửa sổ dự án tám tuần với đề tài Splitly.                                                                                                                       |
| 24/07/2026       | Sau phần trình bày giữa kỳ, giảng viên đánh giá ý tưởng Splitly còn yếu. Nhóm đã đi vào execution và phần risk management của học phần nhưng phải xem lại bài toán sản phẩm. |
| 24/07–09/08/2026 | Nhóm brainstorm nhiều hướng nhưng bị chững lại trong quá trình chọn ý tưởng.                                                                                                 |
| 09/08/2026       | Nhóm chốt sơ bộ InterviewQuestionBank và thực hiện lại Project Initiation cùng Project Planning.                                                                             |
| 10/08/2026       | Nhóm bắt đầu execution thực tế cho dự án mới.                                                                                                                                |
| 12/08/2026       | Nhóm trao đổi trực tiếp với giảng viên lý thuyết; hướng InterviewQuestionBank được đánh giá là phù hợp để tiếp tục.                                                          |
| 13/08/2026       | Nhóm xác nhận chính thức hướng “web interview” và chuẩn bị phân chia công việc.                                                                                              |
| 14/08/2026       | Nhóm trao đổi trực tiếp với giảng viên thực hành. Thầy đề nghị ưu tiên pain point của ứng viên và thu gọn PoC thành JD → OCR → Question Bank.                                |
| 16/08/2026       | Tuấn Anh tái dựng Kanban từ Product Backlog để tổ chức các task hoàn thành User Story.                                                                                       |
| 23/08/2026       | Kết thúc cửa sổ tám tuần của học phần và tổng hợp Project Plan.                                                                                                              |

Hai lần trao đổi với giảng viên diễn ra trực tiếp, không có ảnh hoặc biên bản. Báo cáo ghi lại nội dung do thành viên xác nhận, không trình bày đó là trích dẫn nguyên văn hay bằng chứng phê duyệt chính thức.

### 2.2 Lý do dừng đầu tư vào Splitly

Trước khi nhóm đổi đề tài, thầy Biên đã nêu ba vấn đề giúp cả nhóm nhìn lại Splitly:

- Người dùng có thể ghi trực tiếp ai nợ ai bao nhiêu và tự bù trừ, thay vì tải ứng dụng hoặc mở web để nhập bill rồi chỉ nhận một phép xử lý đơn giản.
- Nhóm chưa có người dùng thật hoặc dữ liệu cho thấy người dùng sẵn sàng tải và sử dụng sản phẩm.
- Nhóm dự định cung cấp miễn phí nhưng chưa giải thích được nguồn lợi nhuận hoặc cơ chế duy trì sản phẩm nếu đưa ra thị trường.

Các vấn đề trên cho thấy Splitly chưa có value proposition đủ mạnh. Vì vậy, nhóm không chỉ đổi tên đề tài mà quay lại hai bước Initiation và Planning để xác định lại vấn đề, stakeholder, workflow, phạm vi và nguồn lực.

### 2.3 Đầu vào của Project Plan

Project Plan hợp nhất các nguồn sau:

| Nguồn                                              | Vai trò trong kế hoạch                                                                                             |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Project Proposal                                   | Xác định vấn đề, giá trị, phạm vi, điều kiện tiếp tục và trần nguồn lực.                                           |
| Project Charter                                    | Xác định Sponsor, vai trò, milestone, constraint và quyền phê duyệt.                                               |
| Vision and Scope                                   | Giữ ranh giới sản phẩm và workflow mục tiêu.                                                                       |
| Product Backlog and Acceptance Criteria            | Cung cấp 27 story R1 Bắt buộc, 134 SP, dependency, acceptance criteria, Definition of Ready và Definition of Done. |
| Resource Plan                                      | Xác định capacity, reserve, ownership, công cụ và rủi ro nguồn lực.                                                |
| Estimation Comparison                              | Cung cấp hai dự báo độc lập và giới hạn của dữ liệu 20 Must story cũ.                                              |
| Cost–Time–Resources Baseline                       | Xác định lịch tham chiếu, effort, chi phí và ngưỡng escalation.                                                    |
| Feasibility Study, Architecture và ADR             | Đặt các điều kiện Go/No-Go, kiểm soát kỹ thuật và quality gate.                                                    |
| Lịch sử Splitly, trao đổi nhóm và góp ý giảng viên | Giải thích nguyên nhân pivot, cách thu gọn MVP và cơ sở của lịch tái dựng.                                         |

## 3. Mục tiêu và tiêu chí thành công

### 3.1 Mục tiêu dự án

Mục tiêu của dự án là kiểm chứng một quy trình chuẩn bị phỏng vấn có truy vết từ JD đến hành động cải thiện:

```text
JD → trích xuất/OCR → xác nhận văn bản → phân tích yêu cầu
   → ánh xạ Question Bank → preparation plan
   → tự luyện hoặc đặt lịch Mentor → feedback → cập nhật kế hoạch
```

Pilot tập trung vào ứng viên Front-end Intern/Junior tại Việt Nam, trước hết với JavaScript, TypeScript và React. Kế hoạch chuẩn bị phải tạo giá trị độc lập ngay cả khi ứng viên chưa đặt lịch Mentor.

### 3.2 Chỉ số và ngưỡng đánh giá

| Mục tiêu                  | Chỉ số                                                      |             Ngưỡng đề xuất |
| ------------------------- | ----------------------------------------------------------- | -------------------------: |
| Xác nhận pain point       | Mẫu discovery xác nhận ít nhất một pain cốt lõi             |                       ≥70% |
| Hoàn tất JD-to-plan       | Ứng viên nhập JD, sửa văn bản và tạo được kế hoạch          |                       ≥80% |
| Chất lượng phân tích      | Blind requirement recall và precision@10                    |                       ≥80% |
| Tính truy vết             | Kết quả đủ source, topic, reason và version                 |                       100% |
| Kích hoạt từ kế hoạch     | Ứng viên mở câu hỏi hoặc luồng Mentor từ plan               |                       ≥80% |
| Pilot booking             | Booking hợp lệ / confirmed / completed                      |              12 / ≥10 / ≥8 |
| Feedback có thể hành động | Booking hoàn thành có điểm mạnh, điểm yếu và bước tiếp theo |                       ≥90% |
| Giá trị cảm nhận          | Điểm hữu ích và mức tự tin sau–trước                        | ≥4/5; tăng trung bình ≥1/5 |
| Chất lượng kỹ thuật       | Critical workflow pass; defect trước UAT                    |      100%; 0 Critical/High |

Đây là ngưỡng đề xuất cho pilot hẹp, không phải kết quả actual đã đạt.

## 4. Phạm vi và sản phẩm bàn giao

### 4.1 Phạm vi MVP

- Xác thực và phân quyền cho Student, Mentor và Administrator.
- Nhập JD bằng văn bản hoặc PDF/PNG/JPEG; trích xuất trực tiếp hoặc OCR tiếng Việt/Anh.
- Cho người dùng kiểm tra và sửa văn bản sau khi trích xuất.
- Nhận diện yêu cầu, chuẩn hóa taxonomy và ánh xạ sang Question Bank có giải thích.
- Tạo preparation plan truy vết về JD, requirement và phiên bản câu hỏi.
- Hỗ trợ Question Bank, bookmark và trạng thái luyện tập cơ bản.
- Quản lý hồ sơ, xác minh và lịch rảnh của Mentor.
- Đặt lịch, đổi hoặc hủy lịch; dùng link họp bên ngoài.
- Gửi notification hỗ trợ booking nhưng không làm hỏng transaction chính.
- Thu feedback theo rubric, cập nhật kế hoạch và hỗ trợ moderation tối thiểu.

### 4.2 Phạm vi loại trừ

- AI interviewer, chatbot phỏng vấn hoặc chấm điểm tự động.
- Phân tích giọng nói/video, recording hoặc transcript tích hợp.
- Video call tích hợp; MVP dùng link họp bên ngoài hoặc nhập thủ công.
- Payment, escrow, payout và commission.
- Mobile native, ATS/nộp hồ sơ, OCR tổng quát hoặc marketplace đa quốc gia.
- ML recommendation không có deterministic guardrail.

Gemini chỉ có thể hỗ trợ phân tích hoặc soạn nháp sau feature flag và validation. Rule/manual flow phải tiếp tục hoạt động khi nhà cung cấp lỗi.

### 4.3 Sự thay đổi của giải pháp

Ý tưởng InterviewQuestionBank ban đầu thiên về Mentor: Mentor nhận lịch hẹn, phỏng vấn, gửi feedback và có thể dùng AI để phỏng vấn thử. Giải pháp đã có Question Bank nhưng chưa có chuỗi nhập JD, phân tích yêu cầu, chọn câu hỏi và đề xuất Mentor phù hợp cho ứng viên.

Sau góp ý ngày 14/08, nhóm lấy pain point “ứng viên không biết ôn gì cho một JD cụ thể” làm trọng tâm. PoC mới gồm nhập JD, trích xuất/OCR, sửa văn bản, nhận diện kỹ năng, chuẩn hóa taxonomy và ánh xạ câu hỏi. Nhóm giữ luồng Mentor đã làm ở một nhánh riêng, sau đó kết hợp hai luồng trong MVP hiện tại.

## 5. Cách tiếp cận lập kế hoạch

### 5.1 Các giả định chính

| Giả định                                  | Cách sử dụng và giới hạn                                                                                                  |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Cửa sổ dự án vẫn là tám tuần              | Giữ ràng buộc học phần 29/06–23/08 dù dự án mới chỉ execution thực tế trong hai tuần.                                     |
| Sáu thành viên dành 16 giờ/tuần           | Dùng để tính capacity; không phải cam kết làm thêm giờ.                                                                   |
| Reserve 15%                               | Bảo vệ discovery, review, test, defect, tài liệu, học công nghệ và rủi ro; không dùng để thêm scope.                      |
| Execution tái dựng trong bốn tuần         | Dùng để lập lịch và phân bổ backlog; không thay thế actual tracking.                                                      |
| Kinh nghiệm Splitly là dữ liệu tham chiếu | Dùng để ước lượng khi thiếu dữ liệu ban đầu của InterviewQuestionBank; không được gọi là historical actual của dự án mới. |
| Pilot dùng free tier và Mentor tự nguyện  | Chưa chứng minh unit economics hoặc chi phí vận hành thương mại.                                                          |

### 5.2 Baseline sáu giai đoạn

| Giai đoạn              | Khoảng thời gian tham chiếu | Exit criteria                                                           |
| ---------------------- | --------------------------- | ----------------------------------------------------------------------- |
| Discovery/Charter      | 29/06–05/07                 | Problem evidence, Charter và resource baseline.                         |
| Prototype/Requirements | 06/07–12/07                 | Workflow, backlog và prototype được chấp nhận nội bộ.                   |
| Foundation             | 13/07–19/07                 | Architecture, auth, CI/CD và data foundation.                           |
| JD intake & analysis   | 20/07–26/07                 | Nhập JD, OCR, xác nhận text, taxonomy mapping và preparation plan pass. |
| Mentor core loop       | 27/07–09/08                 | Booking-to-feedback E2E pass.                                           |
| UAT/Release            | 10/08–23/08                 | Có UAT evidence, không còn defect Critical/High và pilot sẵn sàng.      |

Bảng trên là baseline lập kế hoạch cho dự án mới trong cửa sổ tám tuần. Nó không mô tả đúng trình tự lịch sử vì nhóm còn thực hiện Splitly trước ngày 09/08.

### 5.3 Execution bốn tuần được tái dựng

| Tuần tái dựng    | User Story trọng tâm                                                                                                  | Ý nghĩa                                             |
| ---------------- | --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| W1 — 27/07–02/08 | Đăng ký/đăng nhập, vai trò, nhập JD, trích xuất, sửa văn bản, hồ sơ Student/Mentor                                    | Foundation và intake.                               |
| W2 — 03/08–09/08 | Quản lý Question Bank/taxonomy, phân tích JD, ánh xạ yêu cầu, tạo preparation plan, duyệt Mentor và quản lý lịch rảnh | Chuẩn bị nội dung và nguồn cung Mentor.             |
| W3 — 10/08–16/08 | Duyệt/tìm câu hỏi, luyện tập, tìm Mentor, gắn JD hoặc plan vào booking, gửi và xử lý yêu cầu đặt lịch, link họp ngoài | Core transaction; trùng một phần execution thực tế. |
| W4 — 17/08–23/08 | Hủy/đổi lịch, notification, feedback, review và cập nhật preparation plan                                             | Hoàn tất vòng lặp và ổn định release.               |

Ngày 16/08, Tuấn Anh tái dựng Kanban từ Product Backlog. Backlog cung cấp mã US, priority, release, dependency, SP, acceptance criteria và Definition of Ready/Done. Assignee, tuần thực hiện và ngày `Ready/Done` trên board là dữ liệu tái dựng, không có sẵn trong backlog.

Kanban gồm Product Backlog; Ready với WIP 6; In Progress với WIP 6; Review với WIP 3; và bốn cột Done theo tuần. Trello chỉ quản lý các task cần để hoàn thành User Story trong backlog. PoC không được đưa lên Trello.

## 6. Nguồn lực và trách nhiệm

### 6.1 Capacity

| Hạng mục                    |                                   Giá trị |
| --------------------------- | ----------------------------------------: |
| Số thành viên               |                                         6 |
| Thời lượng                  |                                    8 tuần |
| Giờ/người/tuần              |                                    16 giờ |
| Capacity danh nghĩa         |                      6 × 8 × 16 = 768 giờ |
| Reserve                     |                           15% = 115,2 giờ |
| Capacity giới hạn cho scope |                            Khoảng 653 giờ |
| Nhịp review kế hoạch        | Theo tuần hoặc khi baseline/luồng Kanban thay đổi đáng kể |

### 6.2 Ownership

| Thành viên/vai trò                 | Ownership chính                                                                | Trách nhiệm phối hợp                                                  |
| ---------------------------------- | ------------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| Tuấn Anh — Project Manager / Team Leader / Timekeeper | Điều hành, phân vai, deadline, Kanban, escalation, integration và delivery | Scope/priority coordination, review/merge, xác nhận Done và stakeholder alignment. |
| Gia Thành — Project Planning & Estimation Analyst / Full-stack Developer | Charter, estimation, plan, cost/time/resource và implementation Full-stack | Review requirement, UAT và tài liệu. |
| Hưng — Product Owner / Business Analyst | Vision, scope, backlog, acceptance criteria và business rule | Discovery, ưu tiên giá trị và UAT acceptance. |
| Luân — Architecture / Technical Lead | ADR, stack, security, consistency và reliability design | Review kỹ thuật cho PoC và các luồng quan trọng. |
| Hùng — UI/UX Designer / Front-end Developer | Research, workflow, clickable prototype, usability và giao diện | UI acceptance và accessibility. |
| Trí — PoC / Integration & E2E Developer | PoC, seed data, integration test và technical-risk evidence | Core flow implementation. |
| Sponsor                            | Phê duyệt Charter, baseline và thay đổi lớn                                    | Quyết định Go, Pivot hoặc Stop ở các gate quan trọng.                 |

Các vai trò front-end, back-end, QA, DevOps và content được giao theo work package; nhóm không giả định mỗi chức danh chỉ thuộc một người. Story chỉ được kéo vào Ready khi đạt Definition of Ready và được người thực hiện tham gia estimate.

## 7. Kế hoạch effort và chi phí

### 7.1 Effort

Hai phương pháp đã được dùng để kiểm tra chéo:

| Phương pháp                              |             Kết quả lịch sử | Cách sử dụng                                         |
| ---------------------------------------- | --------------------------: | ---------------------------------------------------- |
| Bottom-up + Three-point/PERT             | 606 giờ sau contingency 15% | Working forecast có truy vết theo epic/work package. |
| Top-down Count–Compute + expert judgment | 650 giờ sau contingency 15% | Guardrail bảo thủ so với capacity khoảng 653 giờ.    |

Hai phép tính dùng 20 Must story ở thời điểm inception. Backlog chốt sau đó có 27 story R1 Bắt buộc, 134 SP. Vì vậy:

- 606/650 giờ không phải actual.
- 606/650 giờ chưa phải commitment cho backlog hiện tại.
- 47 giờ chênh giữa 606 và capacity không phải phần trống để thêm scope.
- Trước khi cam kết release, nhóm cần Planning Poker cho backlog hiện tại, cập nhật WBS/PERT và kiểm tra bằng hai estimate độc lập.

### 7.2 Direct cash baseline

| Nhóm chi phí                  | Cơ sở                              | Baseline (VNĐ) |
| ----------------------------- | ---------------------------------- | -------------: |
| Domain                        | Một domain cho pilot trong một năm |        300.000 |
| Hosting, database, storage    | Free tier cho phát triển/pilot nhỏ |              0 |
| Email/notification và meeting | Free tier, dùng link họp ngoài     |              0 |
| Design, CI/CD và repository   | Công cụ giáo dục/free tier         |              0 |
| Discovery/UAT                 | 12 lượt cảm ơn × 50.000            |        600.000 |
| Security/monitoring           | Công cụ miễn phí phù hợp MVP       |              0 |
| Direct cash                   |                                    |        900.000 |
| Contingency tiền mặt          | 25% direct cash                    |        225.000 |
| **Trần tiền mặt**             |                                    |  **1.125.000** |

Đây là envelope planning ngày 14/08/2026, không phải số tiền actual đã chi hay báo giá nhà cung cấp. Đến ngày 23/08/2026, **actual cash cost là 0 VNĐ** vì nhóm chỉ dùng các gói free tier và không mua domain hoặc chi khoản cảm ơn discovery/UAT theo baseline. Nếu phát sinh khoản mua sau thời điểm báo cáo, owner phải lưu nguồn giá, thời điểm kiểm tra và điều kiện hủy.

Giá trị lao động tham chiếu là 606 giờ × 50.000 VNĐ/giờ = 30.300.000 VNĐ. Đơn giá 50.000 VNĐ/giờ chỉ là giả định học thuật của nhóm, không phải lương thực tế hoặc báo giá thị trường.

## 8. Phương pháp phát triển và cơ chế điều hành

Nhóm áp dụng cách làm thích ứng trong giới hạn học phần:

1. Product Owner quản lý backlog và acceptance criteria; Tuấn Anh với vai trò Project Manager / Team Leader / Timekeeper điều hành delivery, deadline, Kanban và risk; Gia Thành chuẩn bị dữ liệu cost, resource, estimate và baseline để hỗ trợ quyết định.
2. Nhóm ưu tiên Must story phục vụ core loop JD-to-feedback; Should/Could chỉ được nhận khi reserve và critical flow vẫn an toàn.
3. Nhóm vận hành Kanban theo tuần. Tuấn Anh review WIP, blocker, chất lượng và forecast-to-complete mỗi tuần hoặc khi cần chốt thay đổi.
4. Kanban giới hạn WIP để tránh mở quá nhiều việc cùng lúc: Ready 6, In Progress 6 và Review 3.
5. Git/GitHub quản lý version, Pull Request và traceability. CI kiểm tra lint, typecheck, OpenAPI drift, migration, seed, build và secret scan.
6. Figma lưu prototype và usability evidence; Markdown trong repository lưu Proposal, Charter, ADR, kế hoạch và test evidence.
7. PoC dùng để giảm bất định kỹ thuật, nhưng không nằm trên Trello. Trello chỉ phân rã và theo dõi task hoàn thành các User Story trong backlog.

## 9. Quản lý chất lượng, rủi ro và thay đổi

### 9.1 Quality gate

- Chỉ câu hỏi `PUBLISHED` và Mentor `APPROVED` được đưa vào kết quả phù hợp.
- Người dùng phải xác nhận văn bản sau extraction/OCR.
- Booking phải chống double booking, kiểm soát object authorization và lưu audit.
- Lỗi notification không được làm mất booking đã ghi nhận.
- Critical workflow phải có unit, integration, E2E hoặc UAT evidence phù hợp.
- Không phát hành pilot khi còn defect Critical/High.

### 9.2 Rủi ro trọng yếu

| Rủi ro                       | Dấu hiệu                                                    | Ứng phó                                                                    |
| ---------------------------- | ----------------------------------------------------------- | -------------------------------------------------------------------------- |
| Không đủ Mentor              | Dưới 4 Mentor hoặc dưới 3 slot/người                        | Outreach sớm, concierge pilot và giữ giá trị của preparation plan độc lập. |
| Extraction/mapping không đạt | Recall hoặc precision@10 dưới 80%                           | Correction gate, corpus có nhãn, taxonomy review và rule fallback.         |
| AI/provider lỗi              | Schema/evidence fail, quota hoặc latency tăng               | Feature flag, validation và manual fallback.                               |
| Booking sai hoặc lộ dữ liệu  | Double booking, invalid transition hoặc truy cập trái quyền | Transaction, unique constraint, audit và negative test.                    |
| Scope vượt giới hạn          | Thêm AI/video/payment hoặc forecast vượt 653 giờ            | Cắt Should/Could, lập change request và rebaseline.                        |
| Thiếu dữ liệu theo dõi       | Không có timesheet, throughput lịch sử hoặc trạng thái gốc  | Gắn nhãn reconstructed, không suy diễn thành actual.                       |

### 9.3 Ngưỡng reforecast và escalation

PM phải reforecast và trình PO/Sponsor khi xảy ra một trong các trường hợp:

- dự báo vượt ngày 23/08/2026;
- forecast effort vượt khoảng 653 giờ;
- committed/actual cash có nguy cơ vượt 1.125.000 VNĐ;
- critical PoC không đạt gate;
- công việc bị kẹt hoặc throughput thấp kéo dài hai tuần;
- thay đổi chạm core scope, privacy, authorization, booking consistency hoặc release quality.

Change request phải nêu nguyên nhân, ảnh hưởng đến scope/time/cost/resource/risk, phương án lựa chọn và người phê duyệt. Reserve không tự động cấp quyền thêm phạm vi.

## 10. Sử dụng, cập nhật và trạng thái kế hoạch

Project Plan được dùng để thống nhất nhóm sẽ làm gì, trong giới hạn nào và ai chịu trách nhiệm. Product Backlog chuyển phạm vi thành User Story và acceptance criteria; Resource Plan chuyển vai trò thành ownership; Architecture và ADR cụ thể hóa các constraint kỹ thuật; Trello phân rã User Story thành task thực hiện.

Trong giai đoạn 10/08–23/08, nhóm dùng baseline mới để triển khai các hạng mục thuộc luồng JD-first và Mentor. Các thay đổi quan trọng gồm:

1. Dừng tiếp tục đầu tư vào Splitly và quay lại Initiation/Planning.
2. Chuyển từ hướng Mentor-first/AI mock interview sang candidate-first.
3. Thêm JD intake, OCR, correction, requirement analysis, Question Bank mapping và preparation plan.
4. Giữ luồng Mentor đã có để tích hợp sau thay vì bỏ toàn bộ phần đã làm.
5. Loại AI interviewer, video tích hợp, payment, mobile native và ATS khỏi MVP.
6. Tái dựng Kanban ngày 16/08 từ backlog để mô tả phân bổ User Story theo bốn tuần.

### 10.1 Đối chiếu Planned–Actual từ backlog và Reconstructed Kanban

Product Backlog đặt baseline R1 gồm 27 User Story Bắt buộc, tương đương 134 SP. Ảnh Reconstructed Kanban cho thấy 26 User Story Bắt buộc đã nằm trong bốn cột Done, tương đương 129 SP. Như vậy, mức hoàn thành ghi nhận trên board là **26/27 story và 129/134 SP, cùng đạt khoảng 96,3%**.

| Khoảng giao việc → Done trên board                    | User Story Bắt buộc đã hoàn thành                      | Số story |      SP |
| ----------------------------------------------------- | ------------------------------------------------------ | -------: | ------: |
| W1 — 27/07–02/08                                      | US-01, US-02, US-24, US-25, US-26, US-03, US-07        |        7 |      34 |
| W2 — 03/08–09/08; riêng US-09 kéo dài đến 16/08       | US-27, US-18, US-28, US-29, US-08, US-09               |        6 |      34 |
| W3 — 10/08–16/08; US-04 được đánh dấu xong ngày 11/08 | US-04, US-05, US-06, US-10, US-30, US-11, US-12, US-14 |        8 |      34 |
| W4 — giao từ 17/08, đánh dấu xong trong 18/08–23/08   | US-13, US-15, US-17, US-16, US-19                      |        5 |      27 |
| **Tổng đã Done**                                      | **26 User Story Bắt buộc**                             |   **26** | **129** |

US-20, “Giải quyết báo cáo và ngoại lệ”, còn trong Product Backlog với 5 SP. Hai story R1 Mở rộng US-21–US-22, tổng 8 SP, và story Tương lai US-23, 8 SP, chưa được thực hiện; ba story này không thuộc 134 SP Bắt buộc. Tại thời điểm chụp, các cột Ready, In Progress và Review đều không có card.

Các ngày trên board được tính từ lúc thành viên nhận/giao task đến khi card được đánh dấu Done. Chúng phản ánh **elapsed time của task trên Reconstructed Kanban**, không phải actual effort theo giờ. Nhóm không có timesheet để quy đổi các khoảng ngày này thành person-hour. Ngoài ra, board được tái dựng ngày 16/08, nên số liệu cho biết trạng thái nhóm đã ghi nhận lại, không chứng minh toàn bộ card được cập nhật theo thời gian thực từ ngày 27/07.

### 10.2 Trạng thái tại ngày 23/08/2026

- Proposal phiên bản 0.4 ngày 21/08 là bản đề xuất đã chốt nội bộ.
- Project Plan này hợp nhất scope, schedule, cost, resource, ownership và các quyết định pivot.
- Tuấn Anh đã review bản hợp nhất ngày 23/08 bằng cách đối chiếu với các tài liệu planning đơn lẻ và các dữ kiện nhóm xác nhận.
- Kế hoạch chưa có phê duyệt chính thức toàn bộ baseline từ Sponsor.
- Actual cash cost là 0 VNĐ; board ghi nhận 129/134 SP Bắt buộc đã Done; nhóm không có actual effort theo giờ.
- Bốn tuần trên Kanban là reconstruction có disclosure, không phải tracking gốc.

## 11. Bằng chứng và giới hạn kiểm chứng

### 11.1 Quyết định phạm vi

**Hình 1 — Phạm vi MVP candidate-first sau khi ưu tiên giá trị chuẩn bị phỏng vấn theo JD.**

![Phạm vi MVP candidate-first](img/Q11-01-mvp-scope-candidate-first.png)

**Hình 2 — Nhóm xác nhận chính thức ý tưởng web interview ngày 13/08/2026.**

![Nhóm xác nhận ý tưởng web interview](img/Q11-02-team-confirms-interview-idea.png)

**Hình 3 — Thành viên tóm tắt góp ý của giảng viên thực hành ngày 14/08/2026.**

![Tóm tắt góp ý về pain point ứng viên](img/Q11-03-instructor-feedback-summary.png)

**Hình 4 — Nhóm thông báo cập nhật phạm vi và chuẩn bị Pull Request để review.**

![Thông báo cập nhật phạm vi và kế hoạch](img/Q11-04-team-updates-scope-and-plan.png)

**Hình 5 — PoC ứng viên và quyết định giữ luồng Mentor riêng.**

![PoC ứng viên và luồng Mentor](img/Q11-05-candidate-poc-and-mentor-split.png)

### 11.2 Kế hoạch thực hiện tái dựng

**Hình 6 — Reconstructed Kanban tổ chức task theo User Story trong bốn tuần.**

![Reconstructed Kanban theo User Story](img/Q11-06-reconstructed-kanban-user-stories.png)

Năm hình đầu là trao đổi nội bộ sau các buổi góp ý. Chúng chứng minh nhóm đã tóm tắt ý kiến, thống nhất hướng đi và cập nhật phạm vi; chúng không phải ảnh giảng viên phê duyệt Project Plan. Hình 6 là board được Tuấn Anh tái dựng ngày 16/08; board không chứng minh card đã được cập nhật đúng thời điểm trong quá khứ.

## 12. Đánh giá kế hoạch và kết luận

Ngày 23/08/2026, Tuấn Anh review bản Project Plan 1.0 bằng cách so sánh nội dung hợp nhất với Proposal, Charter, Vision and Scope, Product Backlog, Resource Plan, Estimation Comparison, Cost–Time–Resources, Feasibility Study, ADR, lịch sử Git và Reconstructed Kanban. Việc review tập trung vào tính đầy đủ, nhất quán, khả thi, truy vết và mức độ phân biệt giữa kế hoạch, actual và dữ liệu tái dựng.

Review phát hiện sáu khác biệt chính giữa các tài liệu đơn lẻ và bản Project Plan cần nộp:

1. Thông tin về scope, schedule, cost, resource và ownership nằm rải rác, chưa có một báo cáo Project Plan hợp nhất.
2. Cửa sổ học phần tám tuần, execution thực tế hai tuần và lịch tái dựng bốn tuần dễ bị hiểu là cùng một loại dữ liệu.
3. Hai estimate 606/650 giờ dùng 20 Must story cũ, trong khi backlog hiện tại có 27 story Bắt buộc và 134 SP.
4. Trello chỉ theo dõi task hoàn thành User Story; PoC nằm ngoài Trello và board được tái dựng ngày 16/08.
5. Cash ceiling 1.125.000 VNĐ là baseline, còn actual cash cost là 0 VNĐ do nhóm dùng free tier.
6. Góp ý của giảng viên xác nhận hướng ý tưởng, không phải phê duyệt chính thức toàn bộ Project Plan.

Tuấn Anh đã xử lý các khác biệt trên trong phiên bản 1.0: hợp nhất tài liệu, tách ba lớp thời gian, thêm bảng Planned–Actual, ghi rõ giới hạn của estimate và Kanban, cập nhật actual cash, bổ sung bằng chứng thay đổi phạm vi và giữ trạng thái Sponsor chưa phê duyệt. Sau review, Project Plan đáp ứng mục đích quản trị ở mức baseline nội bộ: có mục tiêu, phạm vi, lịch, effort, ngân sách, ownership, quality gate, risk, change control và bằng chứng thay đổi.

Giới hạn lớn nhất là dữ liệu actual về tiến độ và effort. Nhóm chỉ execution InterviewQuestionBank trong hai tuần, trong khi kế hoạch phải mô tả cửa sổ tám tuần. Việc tái dựng bốn tuần giúp giải thích cách phân bổ backlog nhưng không thay thế timesheet, throughput lịch sử, burndown hoặc board được cập nhật tại thời điểm thực hiện. Estimate 606/650 giờ cũng đã lệch phiên bản backlog. Riêng actual cash đã được nhóm xác nhận là 0 VNĐ do chỉ dùng free tier.

Vì vậy, khuyến nghị của kế hoạch là **tiếp tục có điều kiện**. Trước khi xem đây là commitment phát hành, nhóm cần cập nhật estimate cho 27 R1 Must story/134 SP, hoàn tất các PoC và quality gate, rồi xin PO/Sponsor phê duyệt baseline hoặc quyết định Go, Pivot hay Stop.

## 13. Xác nhận và phê duyệt

| Vai trò                      | Người phụ trách    | Nội dung xác nhận                                | Trạng thái                |
| ---------------------------- | ------------------ | ------------------------------------------------ | ------------------------- |
| Project Manager / Team Leader / Timekeeper | Tuấn Anh | Điều hành, deadline, Kanban, risk, integration và readiness | Đã review ngày 23/08/2026 |
| Project Planning & Estimation Analyst / Full-stack Developer | Gia Thành | Baseline, cost, resource, estimate và phần implementation phụ trách | Chờ xác nhận |
| Product Owner / Business Analyst | Hưng | Mục tiêu, phạm vi, backlog và acceptance | Chờ xác nhận |
| Sponsor                      | Ngô Huy Biên       | Baseline và thay đổi lớn                         | Chờ phê duyệt chính thức  |
| Sponsor                      | Ngô Ngọc Đăng Khoa | Baseline và thay đổi lớn                         | Chờ phê duyệt chính thức  |

## 14. Tài liệu tham chiếu

- `docs/Project_Proposal/Project_Proposal.md`
- `docs/Project_Governance & Stakeholder/Project_Charter.md`
- `docs/Project_Governance & Stakeholder/Stakeholder_Analysis.md`
- `docs/Project_Vision_and_Scope/Project_Vision_and_Scope.md`
- `docs/Project_Vision_and_Scope/Product_Backlog_and_Acceptance_Criteria.md`
- `docs/Project_Resource_Plan/ResourcePlan.md`
- `docs/Project_Resource_Plan/Estimation_Comparison.md`
- `docs/Project_Resource_Plan/Cost_Time_Resources.md`
- `docs/Project_Feasibility/feasibility.md`
- `docs/Project_Architecture/software_architecture.md`
- `docs/refs/05-1-work-breakdown-structure.md`
- `docs/refs/05-2-introduction-to-software-estimation.md`
- `docs/refs/06-software-project-planning.md`
- `docs/refs/09-software-project-monitoring-and-control.md`
