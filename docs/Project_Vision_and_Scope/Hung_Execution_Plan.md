# Kế hoạch thực thi Week 10 - Hưng

## 1. Thông tin kiểm soát

| Thuộc tính | Giá trị |
|---|---|
| Người thực hiện | Hưng - Thành viên 3 |
| Công cụ hỗ trợ | Codex - đọc/tìm nguồn, đề xuất nội dung, tạo patch và chạy kiểm tra; không phải owner hay approver |
| Phạm vi | Vision, Scope, Product Backlog, Acceptance Criteria và Future-State Workflow |
| Branch bắt buộc | `feat/member-3-scope-backlog` |
| Tệp sản phẩm | `Project_Vision_and_Scope.md`, `Product_Backlog_and_Acceptance_Criteria.md`, `Future_State_Workflow.md` |
| Tệp hỗ trợ | `Hung_Execution_Plan.md` (tài liệu này), [Hung_AI_Validation_Report.md](Hung_AI_Validation_Report.md) |
| Trạng thái đầu vào | Draft, chưa được phê duyệt baseline |
| Trạng thái hoàn tất mong đợi | Reviewed và sẵn sàng để Product Owner phê duyệt baseline |
| AI implementation snapshot | Hoàn tất 14/08/2026; pending human audit, decision closure và approval |

Phân công, branch và ba tệp sản phẩm lấy trực tiếp từ [Task_W10.pdf, trang 2-3](../../../Task_W10.pdf#page=2). Hưng không được thêm chức năng ngoài MVP nếu chưa có quyết định scope; chuỗi tài liệu phải giữ nhất quán theo `Vision & Scope -> Backlog -> Prototype -> Architecture -> PoC -> Time-Cost-Resource` như [Task_W10.pdf, trang 1](../../../Task_W10.pdf#page=1).

Codex được dùng như **copilot tài liệu**. Hưng vẫn là người chịu trách nhiệm về tính đúng của bằng chứng, quyết định nghiệp vụ, nội dung được merge và handoff cho nhóm.

## 2. Mục tiêu và kết quả phải bàn giao

Mục tiêu của Hưng là tạo một baseline yêu cầu đủ rõ để nhóm có thể thiết kế, làm prototype, kiến trúc, PoC, WBS và estimate mà không phải tự suy diễn phạm vi.

Kết quả phải đạt đồng thời:

1. `Project_Vision_and_Scope.md` mô tả có bằng chứng vấn đề, người dùng, mục tiêu, product scope, project scope, giới hạn MVP, giả định, rủi ro, deliverable và tiêu chí chấp nhận cấp dự án.
2. `Product_Backlog_and_Acceptance_Criteria.md` bao phủ chuỗi Question Bank -> Mentor -> Booking -> Session -> Feedback; mọi story thuộc MVP có priority, dependency, business-rule mapping, acceptance criteria và traceability.
3. `Future_State_Workflow.md` dùng cùng thuật ngữ, ID, business rule và trạng thái với backlog/prototype; mô tả cả happy path và ngoại lệ quan trọng.
4. Mọi nhận định từ phỏng vấn có nguồn; khi chưa có evidence phải ghi `Hypothesis/TBD`, không biến giả định thành kết luận.
5. Ba tệp qua đủ các quality gate trong kế hoạch này và được review qua Pull Request.
6. Mọi phần do Codex đề xuất được Hưng kiểm tra lại với source/refs trước khi chấp nhận; output của Codex không được xem là interview evidence, quyết định scope hoặc approval.

## 3. Thứ tự nguồn và quy tắc xử lý xung đột

### 3.1 Thứ tự ưu tiên

1. **Phân công:** `Task_W10.pdf` quyết định người, branch, tệp và giới hạn nhiệm vụ.
2. **Tiêu chí hoàn thiện:** `docs/refs/` là single source of truth để đánh giá cấu trúc, độ rõ, khả năng kiểm chứng, traceability, baseline và change control.
3. **Baseline nghiệp vụ hiện có:** Proposal, Charter, Stakeholder Analysis, Current-State Workflow và Feasibility là nguồn để giữ consistency; chúng không được dùng để hạ thấp tiêu chí trong refs.
4. **Bằng chứng thực tế:** interview/research note được dùng để xác nhận hoặc điều chỉnh problem, user, priority và scope. Evidence không tự động thay đổi baseline; thay đổi vượt MVP phải qua change control.
5. **Tài liệu downstream:** Prototype, Architecture và PoC dùng để phát hiện mâu thuẫn hoặc tính không khả thi; không được âm thầm mở rộng scope.

### 3.2 Quy tắc xung đột

- Nếu tài liệu dự án mâu thuẫn với refs về tiêu chí hoàn thiện, sửa tài liệu theo refs.
- Nếu hai tài liệu dự án mâu thuẫn về nghiệp vụ, ghi issue/decision cần Product Owner chốt trước khi baseline.
- Nếu interview đề xuất chức năng ngoài MVP, ghi vào Future Backlog hoặc lập change request; không thêm trực tiếp vào MVP.
- Nếu thiếu dữ liệu phỏng vấn, giữ nội dung ở trạng thái giả thuyết và nêu rõ validation còn thiếu.
- Sau khi baseline được duyệt, mọi sửa đổi phải có change request và impact analysis.

### 3.3 Mô hình Hưng - Codex - Product Owner

| Chủ thể | Trách nhiệm | Không được ủy quyền/giả định |
|---|---|---|
| Hưng | Cung cấp context; chọn source; xác nhận evidence mapping; review diff; phối hợp thành viên; chịu trách nhiệm nội dung và PR | Không chấp nhận output Codex mà chưa đối chiếu source/refs |
| Codex | Đọc và tìm trong repo; trích tiêu chí kèm file/slide; phân tích gap; đề xuất cấu trúc/nội dung; tạo patch nhỏ; chạy link/ID/scope/consistency checks; soạn review note/PR draft | Không bịa interview finding/số liệu; không tự quyết priority, policy, MVP boundary hay trạng thái Approved; không tự commit/push/mở PR nếu Hưng chưa yêu cầu rõ |
| Product Owner/Sponsor | Chốt priority, policy, scope, change request và acceptance/baseline | Không xem bản nháp do Codex tạo là approval |
| Reviewer/owner downstream | Xác nhận consistency với Prototype, Architecture, PoC và Estimate | Không chuyển trách nhiệm review cho Codex |

Quy trình sử dụng Codex cho mỗi work item:

1. **Context:** Hưng nêu work-item ID, tệp được phép sửa, source được phép dùng và quyết định còn mở.
2. **Retrieve:** Codex đọc lại refs bắt buộc của gate và các source dự án liên quan; không làm từ trí nhớ.
3. **Propose:** Codex trả gap/evidence mapping và patch đề xuất, tách rõ `Source fact`, `Inference`, `Hypothesis`, `Decision needed`.
4. **Human review:** Hưng kiểm tra trích dẫn, ý nghĩa nghiệp vụ và phạm vi; Product Owner trả lời decision nếu cần.
5. **Apply:** Codex chỉ áp dụng phần đã nằm trong phạm vi; thay đổi lớn được chia thành patch/commit theo artifact.
6. **Verify:** Codex chạy kiểm tra tự động và đọc lại refs; Hưng walkthrough, xác nhận checklist và quyết định có đưa vào PR hay không.

Các guardrail bắt buộc:

- Mọi câu chứa số liệu/finding phải có evidence ID hoặc nhãn `Hypothesis/TBD`.
- Mọi tiêu chí đánh giá phải trỏ về refs bằng file và slide; Codex không bổ sung “best practice” ngoài refs như tiêu chí bắt buộc nếu chưa được Hưng chấp thuận.
- Codex không đưa dữ liệu cá nhân thô từ interview vào tài liệu; chỉ dùng participant ID và synthesis cần thiết.
- Codex phải báo mâu thuẫn và xin decision thay vì tự hòa giải scope/policy.
- Hưng phải xem `git diff` trước khi yêu cầu Codex commit, push hoặc mở PR.

## 4. Ma trận trích xuất tiêu chí từ refs

Các refs dưới đây phải được đọc lại tại quality gate được chỉ định, không chỉ đọc một lần ở đầu công việc.

| ID | Nguồn chuẩn | Tiêu chí được trích xuất | Áp dụng |
|---|---|---|---|
| REF-01 | [02-software-project.md](../refs/02-software-project.md), Slide 009 | Phân biệt product scope (tính năng/chức năng) và project scope (công việc tạo ra sản phẩm). | Vision & Scope |
| REF-02 | [03-1-business-requirements.md](../refs/03-1-business-requirements.md), Slides 005, 007-014 | Business requirements phải nêu nhu cầu, outcome, nguồn đầu vào, stakeholder và thuật ngữ/domain. | Evidence, problem, glossary |
| REF-03 | [03-1-business-requirements.md](../refs/03-1-business-requirements.md), Slides 019, 044-050 | Problem là chênh lệch current/goal state; mọi requirement chi tiết phải đóng góp vào goal; goal phải đo được và theo tinh thần SMART; discovery phải ghi ai, ở đâu, thu gì và bằng cách nào. | Problem, objective, interview synthesis |
| REF-04 | [03-1-business-requirements.md](../refs/03-1-business-requirements.md), Slides 053, 055-060, 066 | Goal dẫn tới high-level feature; phải xác định expected artifact/deliverable; scope thể hiện phần khảo sát và phần loại trừ; context làm rõ boundary; executive summary phải nối audience, pain, solution, risk, goal, feature và artifact. | Vision, scope, deliverable, context |
| REF-05 | [03-2-user-requirements.md](../refs/03-2-user-requirements.md), Slides 005-007, 014-015 | Bắt đầu từ user/problem/need/goal; glossary có format/validation/alias khi cần; business rule cần ID, rule, changeability và source; feature phải gắn user, business goal, metric, action và được kiểm chứng bằng prototype. | Personas, glossary, business rules, features |
| REF-06 | [03-2-user-requirements.md](../refs/03-2-user-requirements.md), Slides 017-018 | Vision & Scope phải có context, current/future use cases, current/future domain model, problem/objective, thành phần bao gồm/loại trừ, assumption, risk và conclusion. Scope statement phải có product scope, exclusions, deliverables, acceptance criteria, constraints và assumptions. | Vision & Scope Definition of Done |
| REF-07 | [04-02-scrum-development-process.md](../refs/04-02-scrum-development-process.md), Slides 013-015, 019 | Kick-off dùng project vision và initial product backlog; Product Backlog phải toàn diện; Product Owner ưu tiên giá trị cao trước; release backlog là các story của release kế tiếp. | Product Backlog, MVP boundary |
| REF-08 | [04-02-scrum-development-process.md](../refs/04-02-scrum-development-process.md), Slides 035-036 | Definition of Done gồm review, documentation, test/verification và PO acceptance; tài liệu/story/release backlog phải được cập nhật. | Review và PR gate |
| REF-09 | [05-1-work-breakdown-structure.md](../refs/05-1-work-breakdown-structure.md), Slides 006-012, 019-021 | Vision/Scope là đầu vào để phân rã product -> system -> feature -> use case/user story -> work; requirement engineering còn cần rule, model, review note và dữ liệu giao tiếp. | Backlog decomposition, handoff sang WBS |
| REF-10 | [06-1-agile-planning.md](../refs/06-1-agile-planning.md), Slides 011, 014-016 | Release tập trung vào minimum releasable features có đồng thuận; priority dựa trên story map/business value; sprint mapping chỉ làm sau khi có size và velocity. | Story map, priority, giới hạn trách nhiệm estimate |
| REF-11 | [06-software-project-planning.md](../refs/06-software-project-planning.md), Slide 079 | Mỗi feature/use case/user story phải được customer và team hiểu, tạo business value và customer có thể kiểm chứng. | Definition of Ready và acceptance criteria |
| REF-12 | [07-software-configuration-management.md](../refs/07-software-configuration-management.md), Slides 012, 017, 032, 041-042 | Tài liệu là configuration item; chỉ thành baseline sau formal review/agreement; approval phải có item, producer/responsible/approver, điều kiện và metadata; version control phải giữ lịch sử, branch và merge. | Versioning, approval, branch/PR |
| REF-13 | [09-software-project-monitoring-and-control.md](../refs/09-software-project-monitoring-and-control.md), Slides 025, 027-030, 037 | Mọi sửa baseline là change request; phải chống scope creep, phân tích feature/use case bị ảnh hưởng, effort/cost/benefit/schedule và cập nhật requirement/traceability. | Change control |
| REF-14 | [09-software-project-monitoring-and-control.md](../refs/09-software-project-monitoring-and-control.md), Slides 039-042 | Validate Scope dùng requirement documentation, traceability và verified deliverable; inspection/review kiểm tra acceptance criteria; RTM nối origin -> requirement -> deliverable và business/project objective. | Final inspection và RTM |
| REF-15 | [11-software-quality-management.md](../refs/11-software-quality-management.md), Slides 006-007 | Chất lượng được so với baseline/standard; user requirement phải chứng minh problem được giải quyết, objective đạt được, prototype/workflow được exploratory test với cả input xấu/đối nghịch. | Quality gate, negative/exception scenarios |

## 5. Đánh giá baseline hiện tại

### 5.1 `Project_Vision_and_Scope.md`

**Đã có:** product vision, problem/pain, bốn nhóm user, product goal/measure, in-scope/out-of-scope, assumption, constraint và future backlog.

**Khoảng trống bắt buộc xử lý:**

- Chưa có evidence register và chưa phân biệt fact/validated finding với hypothesis.
- Mục tiêu có target nhưng chưa ghi owner, nguồn đo, mẫu, thời hạn và baseline; chưa đủ điều kiện kiểm tra SMART.
- Đang thiên về product scope; chưa tách project scope, project deliverables và project acceptance criteria.
- Chưa liên kết rõ current business use case/current domain model và future business use case/future domain model theo REF-06.
- Chưa có context boundary thể hiện trách nhiệm hệ thống so với email/meeting provider và quy trình thủ công.
- Chưa có bảng risk/response/owner, conclusion và quyết định readiness cho baseline.
- `Manual/free pilot payment` còn mơ hồ, cần khẳng định đây chỉ là giả định vận hành pilot; payment automation vẫn ngoài MVP.
- Chưa có document control, source list, reviewer/approver và approval condition.

### 5.2 `Product_Backlog_and_Acceptance_Criteria.md`

**Đã có:** 23 story, MoSCoW-like priority, dependency, business-rule section, acceptance criteria cho phần lớn Must story, KPI, DoR/DoD, RTM và story map sơ bộ.

**Lỗi/khoảng trống không được merge:**

- `BR-09` được dùng trong RTM và Future-State nhưng chưa được định nghĩa ở mục business rules.
- `US-03` là Must story nhưng không có acceptance criteria và không được trace đầy đủ trong RTM.
- Bảng backlog chưa có cột Business Rule, Objective/Feature và Workflow/Prototype link cho từng story.
- Business rule chưa có source và changeability như REF-05 yêu cầu.
- Nhiều acceptance criteria mới có một happy-path sentence; chưa đủ negative, boundary, authorization, state-transition hoặc provider-failure case cho story rủi ro cao.
- Chưa chứng minh tại sao tất cả `US-01..US-20` đều là Must bằng story map/business value/minimum releasable feature.
- Cột `Estimate` còn `TBD`. Hưng không tự gán estimate thay team, nhưng phải đưa story về trạng thái Ready for Estimation và ghi owner/sự kiện estimate.
- Dependency đang dùng nhiều kiểu biểu diễn (`US-08,09`, range và dấu gạch); phải chuẩn hóa ID và kiểm tra không có dependency vòng.
- RTM chưa nối đầy đủ Objective -> Feature -> Requirement -> Story -> Business Rule -> Acceptance Criteria -> Workflow -> Screen/Test.
- Chưa có evidence/source cho priority và business rule xuất phát từ phỏng vấn hay quyết định Product Owner.

### 5.3 `Future_State_Workflow.md`

**Đã có:** vòng lặp Question Bank -> Mentor -> Booking -> external session -> Feedback, actor/precondition/postcondition, input model, business rules và risk.

**Lỗi/khoảng trống không được merge:**

- Workflow chưa có hành động/transition rõ ràng chuyển booking sang `Completed` trước khi feedback, dù feedback yêu cầu `Completed`.
- Main diagram chưa thể hiện `Cancelled`, no-show và đường quay lại sau reschedule/reject đầy đủ.
- Thuật ngữ `Propose change`, `Reschedule proposed` và `Reschedule` chưa được chuẩn hóa.
- Chưa có booking state machine/transition table gồm source state, event, actor, target state, guard, audit và hành động tiếp theo.
- Chưa trace từng `FS-*` sang story, BR, acceptance criteria và prototype screen.
- Chưa mô tả rõ Admin xử lý exception/report và provider failure trong future workflow.
- Chưa có future domain model hoặc link/mapping thể hiện entity và quan hệ chính.
- Chưa có tiêu chí nghiệm thu workflow bằng walkthrough/exploratory scenario.

### 5.4 Dependency đang thiếu

Task yêu cầu dùng kết quả phỏng vấn do người giao việc cung cấp, nhưng repository hiện chưa có interview findings/research notes độc lập. Đây là dependency bắt buộc cho việc nâng finding từ hypothesis thành validated evidence. Không được tự tạo tỷ lệ, lời người tham gia hoặc kết luận phỏng vấn.

## 6. Definition of Ready trước khi chỉnh sửa sản phẩm

Chỉ bắt đầu thay đổi baseline khi đạt các điều kiện sau:

- [ ] Đang ở branch `feat/member-3-scope-backlog`, tạo từ baseline mới nhất được nhóm thống nhất.
- [ ] Ghi nhận commit SHA đầu vào và trạng thái ba tệp sản phẩm.
- [ ] Có danh sách source hiện hành: Proposal, Charter, Stakeholder Analysis, Current-State, Prototype, Architecture, Feasibility và refs.
- [ ] Có interview/research note hoặc đã ghi rõ `Không có evidence - giữ Hypothesis`.
- [ ] Interview note đưa cho Codex đã loại dữ liệu cá nhân không cần thiết và dùng participant/evidence ID.
- [ ] Product Owner/owner quyết định scope được xác định; nếu còn `[CẦN BỔ SUNG]`, ghi decision owner thay vì đoán tên.
- [ ] Canonical glossary và canonical booking states được thống nhất tạm thời để rà soát.
- [ ] Mỗi work item giao Codex đã nêu tệp được phép sửa, source/refs bắt buộc, constraints, output và acceptance gate.
- [ ] Không có thay đổi chưa commit của thành viên khác trong ba tệp sản phẩm.

Nếu interview evidence chưa được cung cấp, vẫn có thể hoàn thiện cấu trúc, traceability và gap list; không được gắn nhãn `Validated` hoặc đề nghị phê duyệt final baseline.

## 7. Work Breakdown Structure và trình tự thực hiện

Thời lượng là giờ tập trung ước tính để lập kế hoạch capacity, không phải cam kết deadline. Estimate phải được cập nhật sau khi kiểm tra khối lượng interview evidence và số vòng review.

| ID | Công việc | Đầu vào | Đầu ra/evidence | Phụ thuộc | Timebox | Ref phải đọc lại trước khi đóng việc |
|---|---|---|---|---|---:|---|
| W0.1 | Tạo branch, snapshot baseline và source inventory | Git, Task PDF, cây tài liệu | Branch đúng tên; baseline SHA; danh sách nguồn | - | 0.5h | REF-12 |
| W0.2 | Lập evidence register | Interview note, proposal, current state | `E-*` source ID; ngày; loại nguồn; finding; confidence; phần bị ảnh hưởng | W0.1 | 1.0-2.0h | REF-02, REF-03 |
| W0.3 | Chuẩn hóa glossary và state vocabulary | Ba tệp sản phẩm, prototype, architecture | Term/definition/alias/validation; canonical state list | W0.2 | 0.75h | REF-05 |
| W1.1 | Viết lại problem và current/goal gap | Evidence register, Current-State | Problem có actor, current state, pain/cost, goal state, evidence status | W0.2 | 0.75h | REF-03, REF-15 |
| W1.2 | Rà target user/stakeholder và mục tiêu | Stakeholder Analysis, evidence | Persona/needs/goals; objective có metric, owner, source, target, thời hạn | W1.1 | 1.0h | REF-02, REF-03 |
| W1.3 | Tách product scope/project scope | Proposal, Charter, Feasibility | In/out; project work; deliverable; constraint; assumption; acceptance cấp dự án | W1.2 | 1.0h | REF-01, REF-04, REF-06 |
| W1.4 | Bổ sung context, use case/domain links, risk và conclusion | Current/Future State, Architecture | Context boundary; current/future mapping; risk/owner; baseline readiness | W1.3 | 1.0h | REF-04, REF-06 |
| W1.G | Gate Vision & Scope | Draft `Project_Vision_and_Scope.md` | Checklist mục 9.1 pass; không còn fact vô nguồn | W1.4 | 0.5h | REF-01..REF-06 |
| W2.1 | Tạo story map và release boundary | Vision, goals, MVP core loop | Backbone Question Bank -> Mentor -> Booking -> Session -> Feedback; MRF/MVP slice | W1.G | 0.75h | REF-07, REF-10 |
| W2.2 | Rà từng story về value, priority, dependency | Story map, architecture order | Mỗi story dễ hiểu, có value, priority reason, dependency chuẩn, estimate readiness | W2.1 | 1.25h | REF-07, REF-10, REF-11 |
| W2.3 | Hoàn thiện business-rule catalogue | Evidence, policy decision, Future State | `BR-*` có rule, source, changeability, owner/status; định nghĩa `BR-09` | W0.3, W2.2 | 0.75h | REF-05 |
| W2.4 | Hoàn thiện acceptance criteria cho mọi MVP story | Story, BR, risks | AC ID; happy, validation, negative, authorization, boundary/exception phù hợp; bổ sung `US-03` | W2.3 | 2.0-3.0h | REF-11, REF-15 |
| W2.5 | Xây RTM đầy đủ | Goals, features, stories, BR, AC, FS, screen/test | Không có orphan Must story/rule/workflow; mỗi requirement có business value | W2.4 | 1.0h | REF-09, REF-14 |
| W2.G | Gate Product Backlog | Draft backlog | Checklist mục 9.2 pass; dependency không vòng; `TBD` có owner/decision date | W2.5 | 0.75h | REF-07..REF-11, REF-14 |
| W3.1 | Sửa happy path và actor flow | Vision, story map, prototype | Main E2E flow đúng thứ tự, có mark Completed trước feedback | W2.G | 0.75h | REF-05, REF-06 |
| W3.2 | Tạo booking state machine | BR/AC, prototype, architecture | Transition table/diagram cho `Pending`, `Confirmed`, `RescheduleProposed`, `Rejected`, `Cancelled`, `Completed`, `NoShow` nếu được duyệt | W3.1 | 1.0h | REF-05, REF-15 |
| W3.3 | Bổ sung exception/admin/provider flows | Feasibility, prototype, architecture | Double booking conflict, unauthorized, cancel/reschedule, no-show, provider failure, report resolution | W3.2 | 0.75h | REF-15 |
| W3.4 | Trace workflow và domain model | Backlog, prototype, architecture | `FS -> US -> BR -> AC -> Screen`; entity/relationship mapping hoặc link rõ | W3.3 | 0.75h | REF-06, REF-14 |
| W3.G | Gate Future-State Workflow | Draft Future State | Checklist mục 9.3 pass; walkthrough không có dead end trái business rule | W3.4 | 0.5h | REF-05, REF-06, REF-14, REF-15 |
| W4.1 | Cross-document consistency review | Ba tệp của Hưng + downstream docs | Consistency matrix và issue list có owner | W1.G, W2.G, W3.G | 1.0h | REF-14 |
| W4.2 | Walkthrough với Hùng/Luân/Trí/Gia Thành | Prototype, Architecture, PoC, Estimate owner | Review note; quyết định/issue; không sửa tệp người khác ngoài phạm vi | W4.1 | 0.75-1.5h | REF-08, REF-09 |
| W4.3 | Self-inspection, proofread và link check | Toàn bộ source/ref | Checklist pass; link/ID hợp lệ; không còn orphan/TBD vô owner | W4.2 | 0.75h | REF-08, REF-14, REF-15 |
| W4.4 | Commit theo artifact, mở PR và xin approval | Branch + review evidence | Commit tách biệt; PR checklist; producer/reviewer/approver/condition | W4.3 | 0.75h | REF-08, REF-12 |

Tổng timebox ban đầu: **20-23 giờ tập trung của Hưng**, chưa gồm thời gian chờ interview evidence hoặc chờ quyết định Product Owner. Codex giúp giảm thời gian tìm kiếm, soạn nháp và kiểm tra cơ học; không làm giảm thời gian cần cho validation, quyết định và review của con người.

### 7.1 Bản đồ hỗ trợ của Codex theo giai đoạn

| Giai đoạn | Codex hỗ trợ | Hưng phải thực hiện/xác nhận | Output lưu lại |
|---|---|---|---|
| W0 - Setup/evidence | Kiểm tra Git read-only; lập source inventory; tìm refs theo keyword/slide; tạo evidence-register template; phát hiện source thiếu | Cung cấp interview note; xác nhận source hợp lệ; loại dữ liệu cá nhân; quyết định finding nào chỉ là hypothesis | Baseline SHA, source inventory, evidence register, missing-input list |
| W1 - Vision & Scope | So sánh document hiện tại với REF-01..REF-06; đề xuất cấu trúc; draft wording có citation; kiểm tra goal/scope/deliverable coverage | Xác nhận problem, persona, mục tiêu, metric, product/project scope, risk và baseline readiness | Gap report, patch Vision/Scope, open-decision list, G1 report |
| W2 - Backlog | Parse ID; tìm story/BR/AC/dependency mồ côi; tạo story-map/RTM draft; đề xuất AC từ source rule/risk; kiểm tra dependency cycle | Chốt business value/priority/policy với PO; xác nhận AC đúng nghiệp vụ và có thể nghiệm thu; tổ chức estimation với team | Backlog/BR/AC patch, ID integrity report, RTM, G2 report |
| W3 - Future State | Đề xuất Mermaid/transition table; so sánh state/term giữa backlog, prototype và architecture; sinh exception walkthrough list | Chốt state/policy; walkthrough với Hùng/Trí; xác nhận diagram phản ánh quy trình thật | Workflow patch, state-decision log, traceability, G3 report |
| W4 - QA/handoff | Chạy link, placeholder, ID, scope-keyword và cross-file checks; tóm tắt diff; soạn PR/checklist/review note | Đọc diff; xử lý false positive; lấy xác nhận downstream/PO; quyết định commit/PR | Validation report, issue list, reviewed diff, PR draft, G4/G5 evidence |

Codex chỉ sửa ba tệp sản phẩm và plan khi Hưng giao rõ phạm vi. Nếu phát hiện lỗi trong tài liệu của thành viên khác, Codex lập issue/handoff note thay vì tự sửa.

### 7.2 Gói prompt chuẩn cho Codex

Mỗi yêu cầu gửi Codex phải có tối thiểu:

| Trường prompt | Nội dung |
|---|---|
| Work item | Ví dụ `W2.4 - Hoàn thiện AC cho MVP stories` |
| Tệp được phép đọc/sửa | Đường dẫn cụ thể; mặc định chỉ ba tệp của Hưng và plan |
| Nguồn nghiệp vụ | Interview/evidence ID và project documents được phép dùng |
| Refs bắt buộc đọc lại | REF ID, file và slide |
| Constraints | Không bịa dữ liệu; không mở rộng MVP; không quyết policy/priority; giữ ID ổn định |
| Output | Gap list, patch, decision-needed list và validation report mong muốn |
| Acceptance | Gate/checklist cụ thể phải pass |

Prompt mẫu theo giai đoạn:

- **Evidence:** “Đọc các source được liệt kê, tạo bảng `Source fact / Evidence ID / Affected section / Confidence`. Không suy diễn finding; mục thiếu đánh dấu `Hypothesis`.”
- **Vision & Scope:** “Đọc lại REF-01..REF-06, đối chiếu tệp hiện tại, đề xuất patch chỉ cho gap có source. Tách product scope/project scope và liệt kê decision cần PO chốt.”
- **Backlog:** “Đọc lại REF-07..REF-11 và REF-14..REF-15. Kiểm tra story/BR/AC/dependency/RTM; bổ sung nháp nhưng không tự đổi priority hoặc estimate. Báo riêng orphan ID và dependency cycle.”
- **Workflow:** “Đọc lại REF-05, REF-06, REF-14 và REF-15. Đồng bộ canonical state, tạo transition/exception draft và trace `FS -> US -> BR -> AC -> Screen`; policy chưa có phải ghi `Decision needed`.”
- **QA:** “Không sửa nội dung trước. Chạy link/ID/scope/placeholder/consistency checks, đọc lại refs của gate, rồi trả danh sách lỗi theo mức `Block merge / Needs decision / Improvement`.”

## 8. Thiết kế chi tiết cho từng sản phẩm

### 8.1 Cấu trúc đích của `Project_Vision_and_Scope.md`

1. Document control: version, status, owner, reviewers, approver, source/baseline.
2. Executive summary và product vision.
3. Background/context và evidence status.
4. Current-state use case/workflow và current domain references.
5. Problem statement: current state -> gap -> desired state -> evidence.
6. Target users/stakeholders, needs và success moment.
7. Product goals/objectives: ID, metric, formula/source, baseline, target, time window, owner, validation status.
8. High-level features và feature-to-goal mapping.
9. Product scope: MVP in/out/future.
10. Project scope: work, deliverables, exclusions, constraints và assumptions.
11. Context boundary/adjacent systems: email, external meeting, hosting và quy trình thủ công.
12. Future-state use case/workflow và future domain references.
13. Project acceptance criteria và Go/Pivot/Stop input.
14. Risks, response, owner và trigger.
15. Open decisions/TBD có owner và due milestone.
16. Conclusion và recommendation: ready/not ready for baseline.
17. Source/evidence index và approval record.

### 8.2 Cấu trúc đích của `Product_Backlog_and_Acceptance_Criteria.md`

1. Document control, release goal và MVP boundary.
2. Story map theo backbone `Question Bank -> Mentor -> Booking -> Session -> Feedback`.
3. Business-rule catalogue: ID, rule, source, changeability, owner, status.
4. Product backlog với tối thiểu các cột:

   `Story ID | Epic/Feature | User story | Business value | Priority | Priority reason | Dependency | BR | Workflow | Estimate | Estimate status`

5. Acceptance criteria catalogue:

   `AC ID | Story | Given | When | Then | Scenario type | Test/Prototype evidence`

6. Definition of Ready và Ready-for-Estimate status.
7. Definition of Done cho story/document.
8. Release backlog/MRF và Future Backlog.
9. RTM:

   `Objective -> Feature/RQ -> Story -> BR -> AC -> FS -> Prototype screen -> Test/PoC -> KPI`

10. KPI plan và measurement note.
11. Change control, glossary, decision log và source index.

Không tự điền story point của developer. Nếu chưa tổ chức estimation, giữ `TBD` nhưng phải ghi `Owner = Development Team`, `Event = Estimation session` và điều kiện Ready.

### 8.3 Cấu trúc đích của `Future_State_Workflow.md`

1. Document control, mục tiêu và scope boundary.
2. Canonical actors/entities/terms.
3. E2E happy path từ Question Bank đến feedback và vòng luyện lại.
4. Actor swimlane hoặc các flow riêng Student/Mentor/Admin/System.
5. Booking state machine và transition table.
6. Đặc tả từng `FS-*`: actor, trigger, precondition, input, action, rule, postcondition, exception, audit.
7. Exception flows: reject, reschedule, cancel, no-show, slot conflict, unauthorized access, notification/provider failure, report/admin resolution.
8. Current-to-future pain resolution matrix.
9. Future domain/entity relationship mapping.
10. Traceability `FS -> US -> BR -> AC -> Screen/Test`.
11. Workflow validation scenarios và expected result.
12. Risk/limit, open decisions và source index.

### 8.4 Canonical booking state draft cần Product Owner xác nhận

| From | Event/actor | To | Guard tối thiểu | Evidence/audit |
|---|---|---|---|---|
| - | Student tạo booking | Pending | Slot hợp lệ; goal/type/position đủ | Actor, timestamp, selected slot |
| Pending | Mentor accept | Confirmed | Mentor là chủ slot; slot chưa Confirmed bởi booking khác | Atomic lock/constraint; transition audit |
| Pending | Mentor reject | Rejected | Reason hợp lệ | Actor, reason, timestamp |
| Pending/Confirmed | Một bên đề xuất đổi lịch | `RescheduleProposed` | Policy và slot đề xuất hợp lệ | Requester, old/new slot, reason |
| `RescheduleProposed` | Bên còn lại accept | Confirmed | New slot còn khả dụng | Atomic slot switch; audit |
| `RescheduleProposed` | Bên còn lại reject | Trạng thái trước hoặc Cancelled | Policy phải được PO chốt | Decision/reason |
| Pending/Confirmed/`RescheduleProposed` | Actor được phép cancel | Cancelled | Policy, cutoff và reason hợp lệ | Actor/reason/timestamp |
| Confirmed | Actor có thẩm quyền mark complete | Completed | Buổi đã đến hạn; rule completion được duyệt | Actor/timestamp/audit |
| Confirmed | Actor/Admin ghi no-show | `NoShow` hoặc Cancelled | No-show policy được duyệt | Evidence/decision/audit |
| Completed | Mentor submit feedback | Completed | Feedback không phải booking state; chỉ tạo artifact sau Completed | Feedback ID/author/timestamp |

`RescheduleProposed`, `Rejected` và `NoShow` chỉ được giữ trong canonical model sau khi Product Owner xác nhận policy. Không được ép chúng vào `Cancelled` nếu làm mất nghĩa nghiệp vụ hoặc audit.

## 9. Acceptance checklist

### 9.1 Gate G1 - Vision & Scope

- [ ] Problem mô tả được current state, goal state và khoảng cách; mỗi kết luận có evidence ID hoặc nhãn Hypothesis.
- [ ] User/stakeholder không bị lẫn; need và objective nối được đến feature.
- [ ] Goal có ID, metric/source, target, time window, owner và validation status.
- [ ] Product scope và project scope được tách rõ.
- [ ] In-scope, out-of-scope và Future Backlog không mâu thuẫn Proposal/Charter/Feasibility.
- [ ] Có project deliverables và project acceptance criteria.
- [ ] Có current/future workflow và domain-model reference/mapping.
- [ ] Có context boundary với external meeting/email provider.
- [ ] Assumption, constraint, risk và open decision có owner/status.
- [ ] Có conclusion và baseline-readiness statement.
- [ ] REF-01..REF-06 đã được đọc lại và ghi ngày self-review trong document control.

### 9.2 Gate G2 - Product Backlog

- [ ] Core loop Question Bank -> Mentor -> Booking -> Session -> Feedback được bao phủ không đứt đoạn.
- [ ] Mỗi MVP story có actor, action, value; customer và team có thể hiểu cùng một nghĩa.
- [ ] Mỗi MVP story có priority, priority reason, dependency và business-rule mapping.
- [ ] Mỗi MVP story có AC ID và ít nhất một happy scenario; story rủi ro có negative/boundary/authorization/exception scenario phù hợp.
- [ ] `US-03` có acceptance criteria và traceability đầy đủ.
- [ ] `BR-09` được định nghĩa hoặc mọi tham chiếu đến nó được sửa theo quyết định chính thức.
- [ ] Mỗi BR có source, changeability, owner/status; không có BR mồ côi.
- [ ] Không có dependency ID sai, dependency vòng hoặc range mơ hồ.
- [ ] Story `TBD` có owner, event và điều kiện giải quyết; không có `TBD` vô chủ.
- [ ] RTM không có Must story, MVP requirement, AC hoặc workflow mồ côi.
- [ ] MRF/release boundary được Product Owner xác nhận; feature ngoài MVP ở Future Backlog/change request.
- [ ] REF-07..REF-11 và REF-14..REF-15 đã được đọc lại trước khi đóng gate.

### 9.3 Gate G3 - Future-State Workflow

- [ ] Main flow đi đúng thứ tự và có transition sang `Completed` trước feedback.
- [ ] Có flow reject, reschedule, cancel, no-show/exception theo policy được duyệt.
- [ ] Một canonical term dùng nhất quán trong workflow, backlog, prototype và architecture.
- [ ] Mỗi transition có actor, guard, target state và audit requirement.
- [ ] Double booking/conflict không dẫn tới hai booking Confirmed.
- [ ] Notification/provider failure không làm thay đổi nguồn chân lý booking.
- [ ] Meeting link/feedback chỉ đúng actor có quyền được truy cập.
- [ ] Mỗi `FS-*` trace được sang Story, BR, AC và Screen/Test.
- [ ] Workflow không thêm built-in video, payment automation, AI interviewer hoặc feature ngoài MVP.
- [ ] Walkthrough với Student, Mentor, Admin và System không có dead end trái rule.
- [ ] REF-05, REF-06, REF-14 và REF-15 đã được đọc lại trước khi đóng gate.

### 9.4 Gate G4 - Cross-document consistency

| Đối chiếu | Điều kiện pass |
|---|---|
| Goal -> Feature/Story | Mọi Must story đóng góp cho goal hoặc enabling requirement được giải thích. |
| Scope -> Backlog | Không có Must story ngoài in-scope; mọi in-scope capability có story/requirement. |
| BR -> AC -> Workflow | Rule được thực thi trong acceptance criteria và transition/workflow phù hợp. |
| Backlog -> Prototype | Mỗi story có screen/interaction hoặc được ghi non-UI; state/term thống nhất. |
| Backlog -> Architecture | Module/API/quality driver không mở rộng product scope; rủi ro kỹ thuật có AC/PoC. |
| Backlog -> PoC | Năm nội dung feasibility/Task có story, BR và acceptance gate tương ứng. |
| Backlog -> Estimate/WBS | Story đạt DoR; dependency rõ; unknown được ghi để người estimate xử lý. |
| KPI -> Goal/Events | KPI có công thức/source và đo outcome, không thay test behavior. |

### 9.5 Gate G5 - Review, approval và baseline

- [ ] Hưng self-inspection theo G1-G4 và lưu review note.
- [ ] Hùng xác nhận prototype không thiếu state/screen do scope-backlog thay đổi.
- [ ] Luân xác nhận architecture không bị ép hỗ trợ feature ngoài scope và các quality driver có requirement.
- [ ] Trí xác nhận năm PoC risk có requirement/AC rõ.
- [ ] Gia Thành nhận được story/dependency/unknown đủ để WBS và estimate; Hưng không tự sửa estimate của thành viên 1.
- [ ] Product Owner xác nhận priority, MVP boundary, policy và acceptance criteria.
- [ ] PR ghi producer (Hưng), reviewer, approver, điều kiện phê duyệt và related decisions theo REF-12.
- [ ] Chỉ gắn nhãn/bản ghi `Baseline` sau formal review và agreement; trước đó giữ `Draft/Reviewed`.

## 10. Phương pháp kiểm tra và bằng chứng hoàn tất

### 10.1 Kiểm tra tĩnh

Chạy các kiểm tra sau trên ba tệp sản phẩm:

```powershell
rg -n "\[CẦN BỔ SUNG\]|TBD|TODO|Hypothesis" docs/Project_Vision_and_Scope
rg -n "BR-[0-9]+|US-[0-9]+|FS-[0-9]+|AC-[0-9]+" docs/Project_Vision_and_Scope
rg -n "AI interviewer|built-in video|payment|payout|mobile native|ML recommendation" docs/Project_Vision_and_Scope
```

Kết quả tìm kiếm không bắt buộc bằng 0. Mỗi placeholder/hypothesis phải có owner, trạng thái và milestone giải quyết; mỗi feature ngoài MVP chỉ được xuất hiện ở Out-of-Scope/Future/Change Request.

### 10.2 Kiểm tra ma trận ID

Lập bảng đếm và kiểm tra thủ công hoặc bằng script:

- Tập Must/MVP story trừ tập story có AC phải rỗng.
- Tập BR được tham chiếu trừ tập BR được định nghĩa phải rỗng.
- Tập dependency được tham chiếu trừ tập story được định nghĩa phải rỗng.
- Tập `FS-*` trong workflow trừ tập `FS-*` trong RTM phải rỗng.
- Mỗi Must story phải có ít nhất một Objective/Feature và một verification path.

### 10.3 Walkthrough scenario tối thiểu

1. Student chọn mục tiêu, lọc câu hỏi nhiều tag, bookmark và chuyển sang tìm mentor.
2. Student chọn mentor Approved/slot, gửi booking hợp lệ và hiểu trạng thái Pending.
3. Hai accept đồng thời cùng slot: chỉ một booking Confirmed.
4. Mentor reject hoặc propose reschedule; Student chấp nhận/từ chối theo policy.
5. Một bên cancel/no-show; trạng thái, reason, action và audit rõ.
6. Người không thuộc booking thử xem meeting link/feedback và bị chặn an toàn.
7. Notification lỗi nhưng booking vẫn giữ trạng thái chính xác và có retry/fallback.
8. Booking được mark Completed, sau đó Mentor gửi rubric và Student xem next action/review.
9. Admin xử lý report/exception và quyết định có reason/audit.
10. Đề xuất AI/video/payment được đưa vào Future Backlog/change request, không chèn vào MVP.

Bằng chứng gồm review note, issue/decision log, RTM, ảnh/link prototype liên quan và PR review; không dùng số liệu giả.

### 10.4 Vòng kiểm tra Codex - Hưng

| Kiểm tra | Codex thực hiện | Hưng xác nhận |
|---|---|---|
| Source/citation | Liệt kê mọi finding/số liệu không có evidence ID; kiểm tra link source/ref | Source đúng ngữ cảnh, citation thực sự hỗ trợ claim |
| ID integrity | So tập ID định nghĩa/tham chiếu cho Objective, RQ, US, BR, AC, FS và dependency | False positive, ID đổi/xóa có chủ ý và tác động nghiệp vụ |
| Scope diff | So in-scope/out-of-scope/Future với Must backlog và từ khóa feature ngoài MVP | Feature classification và change decision của PO |
| Cross-document | So term/state/rule/story giữa Vision, Backlog, Workflow, Prototype và Architecture | Mâu thuẫn nào cần sửa, mâu thuẫn nào cần owner downstream quyết định |
| Ref compliance | Đọc lại slide của gate và lập bảng `criterion -> location -> pass/fail/evidence` | Pass/fail cuối cùng; Codex không tự ký acceptance |
| Git/PR | Tóm tắt `git diff`, file ngoài phạm vi, link/check result và checklist chưa đạt | Cho phép/không cho phép commit, push hoặc mở PR |

Nếu Codex báo “pass” nhưng Hưng chưa walkthrough hoặc source chưa được kiểm chứng, gate vẫn chưa đóng.

## 11. Kế hoạch phối hợp và handoff

| Người/role | Hưng cần nhận | Hưng bàn giao | Thời điểm |
|---|---|---|---|
| Người cung cấp interview | Research note, sample/context, finding và giới hạn | Evidence mapping; câu hỏi làm rõ | Trước W1.G |
| Codex - công cụ hỗ trợ | Work-item, source/refs, phạm vi tệp, constraints và acceptance gate do Hưng giao | Gap report, patch, validation report, decision-needed list và PR draft | Trong W0-W4, luôn trước human review |
| Product Owner | MVP boundary, priority, policy, acceptance decision | Vision/Scope, story map, open decisions, AC | W1.G, W2.G, G5 |
| Hùng - Prototype | Screen/state hiện có, usability finding | Story/AC/FS mapping; state/policy thay đổi | Sau W2.G, trước W4.2 |
| Luân - Architecture | Module/quality constraint/technical risk | Scope, NFR/BR, dependency và AC liên quan | Sau W2.G |
| Trí - PoC | Pass/Fail risk validation | Requirement/AC cho 5 PoC checks | Trước W4.2 |
| Gia Thành - Estimate | Estimate format/unknown cần làm rõ | Ready backlog, dependency map, assumption/TBD | Sau W4.1 |
| Reviewer/Approver | Review criteria và quyết định | PR, checklist, RTM, issue/decision log | W4.4 |

Hưng chỉ cập nhật ba tệp được giao. Mâu thuẫn phát hiện trong Prototype/Architecture/PoC được mở issue hoặc trao đổi với owner, không chỉnh trực tiếp để tránh conflict.

Trao đổi với Codex không thay thế backlog refinement, walkthrough, PR review hoặc approval của Product Owner/nhóm.

## 12. Change control

Mọi đề xuất thay đổi sau khi baseline hoặc mọi feature vượt MVP phải có bản ghi:

| Trường | Nội dung bắt buộc |
|---|---|
| Change ID | `CR-###` |
| Mô tả/lý do | Problem/evidence thúc đẩy thay đổi |
| Giá trị | Objective/KPI được cải thiện |
| Phạm vi ảnh hưởng | Vision, story, BR, AC, workflow, screen, architecture, PoC/test |
| Delivery impact | WBS, effort, cost, schedule, risk và dependency |
| Lựa chọn | Approve / Reject / Defer to Future Backlog |
| Người quyết định | Product Owner/Sponsor theo ngưỡng governance |
| Verification | Cách xác nhận thay đổi đã được cập nhật đúng |
| Archive/feedback | Link decision, PR và bài học |

Không merge trực tiếp một scope change chỉ vì đã sửa được Markdown. REF-13 yêu cầu phân tích và phê duyệt thay đổi trước khi cập nhật baseline.

## 13. Kế hoạch commit và Pull Request

Commit đề xuất, mỗi commit chỉ chứa một concern có thể review:

1. `docs(scope): refine evidence-based vision and MVP boundaries`
2. `docs(backlog): complete MVP rules acceptance criteria and traceability`
3. `docs(workflow): align future state and booking transitions`
4. `docs(scope): add review evidence and resolve cross-document issues`

PR phải ghi:

- Task/member/branch và ba tệp trong phạm vi.
- Tóm tắt gap đã xử lý, đặc biệt `US-03`, `BR-09`, Completed/cancel/reschedule flow.
- Evidence đã dùng và evidence còn thiếu.
- Link/ID của scope decision hoặc change request.
- Kết quả G1-G5 và các placeholder còn owner.
- Phần nào do Codex hỗ trợ soạn/kiểm tra, prompt/refs chính đã dùng và cách Hưng xác minh output.
- Reviewer theo dependency; không tự đánh dấu Product Owner accepted.

Hưng có thể yêu cầu Codex tạo patch, chạy kiểm tra và soạn PR description. Codex chỉ thực hiện commit/push/mở PR khi Hưng đã xem diff và ra yêu cầu rõ cho hành động đó.

## 14. Rủi ro thực thi của Hưng

| Risk | Trigger | Ứng phó | Owner |
|---|---|---|---|
| Thiếu interview evidence | Không có research note trước W1.G | Hoàn thiện cấu trúc, gắn Hypothesis, không xin final baseline | Hưng + research owner |
| Scope creep | Story AI/video/payment xuất hiện trong MVP | Chuyển Future Backlog hoặc CR; chạy scope-to-backlog diff | Hưng + PO |
| Priority không có căn cứ | Tất cả story bị gắn Must | Story-map workshop; ghi value/reason; PO chốt MRF | PO |
| Business rule mâu thuẫn | BR khác nhau giữa backlog/workflow/prototype | Dùng canonical catalogue; mở decision log | Hưng + PO |
| State machine có dead end | Feedback không đạt được hoặc reschedule mất trạng thái | Walkthrough 10 scenario và transition table | Hưng + Hùng + Trí |
| Estimate dựa trên story chưa ready | Gia Thành phải tự đoán AC/dependency | DoR/RTM gate trước handoff; unknown có owner | Hưng |
| Merge conflict | Sửa ngoài thư mục hoặc sửa chung file | Branch riêng, commit nhỏ, không sửa artifact owner khác | Hưng |
| Baseline giả | Tài liệu tự ghi Approved khi chưa review | Giữ Draft/Reviewed; approval record bắt buộc | Hưng + approver |
| Codex bịa/suy diễn evidence | Claim hoặc số liệu không có evidence ID/source | Tách Source fact/Inference/Hypothesis; chạy citation audit; Hưng đối chiếu source | Hưng |
| Codex âm thầm mở rộng scope | Diff xuất hiện feature ngoài MVP hoặc đổi priority/policy | Scope constraints trong prompt; scope diff; yêu cầu PO decision/CR | Hưng + PO |
| Context Codex bị cũ | Source/ref thay đổi sau lần đọc đầu | Codex đọc lại refs/source tại mỗi gate; ghi baseline SHA và thời điểm kiểm tra | Hưng |
| Patch Codex quá rộng | Nhiều concern/tệp owner khác trong một diff | Giới hạn tệp; patch nhỏ theo work item; Hưng xem diff trước apply/commit | Hưng |

## 15. Tiêu chí hoàn tất cuối cùng

Nhiệm vụ của Hưng chỉ được coi là hoàn tất khi:

- Ba tệp sản phẩm và tài liệu kế hoạch nằm đúng thư mục được giao.
- G1, G2, G3 và G4 pass; G5 có review evidence và quyết định Product Owner hoặc ghi rõ còn chờ approval.
- Không có Must story thiếu AC, BR tham chiếu nhưng chưa định nghĩa, dependency ID sai hoặc FS flow không trace.
- Mọi finding phỏng vấn có source; mọi giả định chưa kiểm chứng có nhãn và owner.
- Không có chức năng mới ngoài MVP mà thiếu change decision.
- Prototype/Architecture/PoC/Estimate owner đã nhận handoff và issue list.
- Commit tách theo artifact và PR có checklist, reviewer, approver, approval condition.
- Refs liên quan đã được đọc lại tại từng gate; review note ghi rõ slide đã dùng.
- Mọi nội dung/patch do Codex đề xuất đã được Hưng review với source/refs; không có “Codex says” dùng làm evidence hoặc approval.
- Validation report của Codex được đính kèm/tóm tắt trong PR, nhưng gate chỉ pass sau human walkthrough và quyết định đúng thẩm quyền.

Nếu chưa có interview evidence hoặc Product Owner chưa quyết định policy/scope, kết quả hợp lệ cao nhất là **Reviewed - conditionally ready**, không phải **Approved baseline**.

## 16. Danh mục nguồn dự án để đối chiếu consistency

- [Project Proposal Draft](../Project_Proposal/Project_Proposal_Draft.md)
- [Project Charter](../Project_Governance%20%26%20Stakeholder/Project_Charter.md)
- [Stakeholder Analysis](../Project_Governance%20%26%20Stakeholder/Stakeholder_Analysis.md)
- [Current-State Workflow](Current_State_Workflow.md)
- [Feasibility Study](../Project_Feasibility/feasibility.md)
- [Prototype Workflow](../Project_Prototype/Prototype_Workflow.md)
- [Software Architecture](../Project_Architecture/software_architecture.md)
- [Refs index](../refs/README.md)
