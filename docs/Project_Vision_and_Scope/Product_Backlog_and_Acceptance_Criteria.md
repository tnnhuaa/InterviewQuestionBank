# Interview Practice Platform — Product Backlog and Acceptance Criteria

> **AI-assisted reference version — Pending human audit.** Codex hỗ trợ phát hiện gap, tạo traceability và kiểm tra ID; Hưng/Product Owner phải xác minh business value, priority, policy, acceptance và estimate. Tài liệu chưa phải Approved release baseline.

## 0. Kiểm soát tài liệu

| Thuộc tính | Giá trị |
|---|---|
| Owner/Producer | Hưng — Thành viên 3 |
| Công cụ hỗ trợ | Codex |
| Phiên bản | 0.2-ai-reference |
| Trạng thái | AI checks completed; pending human audit/PO acceptance |
| Branch | `feat/member-3-scope-backlog` |
| Ngày cập nhật | 14/08/2026 |
| Reviewer/Approver | `[CẦN BỔ SUNG — Product Owner]` |

Mỗi feature/story phải được customer và team hiểu, tạo business value và customer có thể kiểm chứng theo [Software Project Planning, Slide 079](../refs/06-software-project-planning.md#slide-079--sales-tip-5-real-business-requirements). Product Owner là người quyết định priority/release; mọi priority trong bản AI reference là **proposed** cho đến khi PO audit.

## 1. Mục đích

Tài liệu chuyển vision và business rules thành backlog có thể phát triển, kiểm thử và nghiệm thu. Product Owner sắp xếp lại ưu tiên sau discovery; ID và acceptance criteria phải được giữ ổn định để trace sang test case.

### 1.1 Release boundary

MVP gồm authentication/RBAC, Question Bank, mentor profile/verification/availability, booking, meeting-link handoff, feedback/review, admin moderation và notification. AI interviewer, built-in video và payment automation nằm ngoài release.

### 1.2 Business rules dùng chung

Business rule cần ID, rule, changeability và source theo [User Requirements, Slide 007](../refs/03-2-user-requirements.md#slide-007--business-rules). Source dưới đây là tài liệu nội bộ/decision, không thay cho pháp lý hoặc interview evidence.

| ID | Rule | Source | Changeability | Owner/status |
|---|---|---|---|---|
| BR-01 | Chỉ mentor `Approved` được công khai profile/slot và nhận booking. | Vision/Charter/Stakeholder | Medium — phụ thuộc verification policy | PO/Admin — Proposed |
| BR-02 | Một slot có tối đa một booking `Confirmed`. | Feasibility technical gate | Low — invariant MVP | Technical/PO — Proposed |
| BR-03 | Booking phải có goal, position/interview type và slot hợp lệ. | Vision/Prototype | Medium — required fields cần usability review | PO — Proposed |
| BR-04 | Chỉ Student/Mentor thuộc booking và Admin có thẩm quyền được xem dữ liệu booking/meeting link/feedback. | Charter/Feasibility/privacy constraint | Low — security invariant | PO/Security — Proposed |
| BR-05 | Feedback chỉ được tạo cho booking `Completed`. | Vision/Prototype | Medium — completion authority còn DEC-03 | PO — Conditional |
| BR-06 | Student chỉ review một lần cho booking hợp lệ đã `Completed`. | Vision/Prototype | Medium — moderation policy còn mở | PO/Admin — Proposed |
| BR-07 | Question chỉ công khai khi `Published`, có taxonomy và provenance hợp lệ. | Vision/Prototype/Charter | Medium — content policy còn mở | PO/Admin — Proposed |
| BR-08 | Booking transition phải theo canonical state machine và ghi actor/reason/timestamp/audit phù hợp. | Vision/Architecture | Medium — DEC-03 chưa đóng | PO/Operations — Conditional |
| BR-09 | Notification failure không rollback hoặc điều khiển booking state; event phải retry/fallback/idempotent và trạng thái nội bộ là source of truth. | Feasibility/Architecture | Low — reliability invariant | Technical/Operations — Proposed |

## 2. Product backlog

Priority dùng MoSCoW như một nhãn release draft. `Priority basis` nêu business value/enablement; PO phải audit minimum releasable feature và có thể giảm Must scope theo story map ([Agile Planning, Slides 011, 014-015](../refs/06-1-agile-planning.md#slide-011--2-create-a-product-roadmap)). Estimate không do Codex/Hưng tự gán; Development Team thực hiện sau Definition of Ready.

| ID | Epic | User story | Obj./BR | Pri. | Priority basis | Dependency | Workflow | Estimate status |
|---|---|---|---|---|---|---|---|---|
| US-01 | Identity | Là người dùng, tôi muốn đăng ký/đăng nhập để dùng dữ liệu cá nhân an toàn | Enabler/BR-04 | Must* | Foundation và privacy | — | FS-01 | Ready for team estimate |
| US-02 | Identity | Là Admin, tôi muốn phân quyền Student/Mentor/Admin để giới hạn chức năng | Enabler/BR-04 | Must* | Security invariant | US-01 | Cross-flow | Ready for team estimate |
| US-03 | Student | Là Student, tôi muốn lưu vị trí và mục tiêu phỏng vấn | OBJ-02, OBJ-03 / BR-03 | Must* | Context cho Learn/Booking | US-01 | FS-01 | Ready for team estimate |
| US-04 | Questions | Là Student, tôi muốn duyệt/tìm/lọc câu hỏi theo taxonomy | OBJ-02/BR-07 | Must* | Core Question Bank value | US-02, US-18 | FS-02 | Ready for team estimate |
| US-05 | Questions | Là Student, tôi muốn xem detail và tiêu chí trả lời | OBJ-02/BR-07 | Must* | Self-practice value | US-04 | FS-02 | Ready for team estimate |
| US-06 | Questions | Là Student, tôi muốn bookmark/đánh dấu trạng thái luyện | OBJ-02, OBJ-06 | Must* | Feedback-to-practice loop | US-04 | FS-03, FS-11 | Ready for team estimate |
| US-07 | Mentor | Là Mentor, tôi muốn tạo hồ sơ và nộp xác minh | OBJ-03/BR-01 | Must* | Supply onboarding | US-01 | FS-04 | Ready for team estimate |
| US-08 | Admin | Là Admin, tôi muốn duyệt/reject mentor có lý do | OBJ-03 / BR-01, BR-08 | Must* | Trust/supply gate | US-02, US-07 | FS-04 | Ready for team estimate |
| US-09 | Mentor | Là Mentor đã duyệt, tôi muốn quản lý slot rảnh | OBJ-03, OBJ-04 / BR-01, BR-02 | Must* | Booking availability | US-08 | FS-04 | Ready for team estimate |
| US-10 | Marketplace | Là Student, tôi muốn tìm mentor theo chuyên môn/lịch | OBJ-03/BR-01 | Must* | Mentor discovery | US-08, US-09 | FS-04 | Ready for team estimate |
| US-11 | Booking | Là Student, tôi muốn gửi booking kèm mục tiêu | OBJ-03 / BR-02, BR-03, BR-08 | Must* | Conversion/core loop | US-03, US-10 | FS-05 | Ready for team estimate |
| US-12 | Booking | Là Mentor, tôi muốn accept/reject/propose reschedule | OBJ-04 / BR-02, BR-08 | Must* | Booking lifecycle | US-11 | FS-06 | Conditional on DEC-03 |
| US-13 | Booking | Là hai bên, tôi muốn hủy/đổi lịch theo policy | OBJ-04/BR-08 | Must* | Operational exception | US-12 | FS-06 | Conditional on DEC-03 |
| US-14 | Session | Là hai bên, tôi muốn xem link họp khi booking Confirmed | OBJ-04/BR-04 | Must* | External session handoff | US-12 | FS-07, FS-08 | Ready for team estimate |
| US-15 | Feedback | Là Mentor, tôi muốn gửi feedback rubric sau buổi | OBJ-05, OBJ-06 / BR-04, BR-05 | Must* | Core value | US-14 | FS-09 | Conditional on DEC-03 |
| US-16 | Feedback | Là Student, tôi muốn xem feedback và next action | OBJ-05, OBJ-06 / BR-04 | Must* | Core value/learning loop | US-15 | FS-11 | Ready for team estimate |
| US-17 | Review | Là Student, tôi muốn review mentor sau booking hợp lệ | Trust/BR-06 | Must* | Marketplace trust | US-15 | FS-10 | PO to confirm MVP necessity |
| US-18 | Admin | Là Admin, tôi muốn CRUD/moderate question và taxonomy | OBJ-02 / BR-07, BR-08 | Must* | Published content prerequisite | US-02 | Admin flow | Ready for team estimate |
| US-19 | Notification | Là người dùng, tôi muốn nhận thông báo sự kiện booking | OBJ-04/BR-09 | Must* | Reliability/coordination | US-11, US-12, US-13, US-14, US-15 | FS-07, exceptions | Ready for team estimate |
| US-20 | Admin | Là Admin, tôi muốn xử lý report/booking exception | Trust / BR-01, BR-07, BR-08 | Must* | Pilot operations | US-12, US-17 | Admin flow | PO to confirm minimal slice |
| US-21 | Progress | Là Student, tôi muốn dashboard tiến độ cơ bản | OBJ-06 | Should | Retention/visibility | US-06 | FS-11 | Ready for team estimate |
| US-22 | Reminder | Là người dùng, tôi muốn được nhắc lịch tự động | OBJ-04/BR-09 | Should | Reduce no-show | US-19 | FS-07 | Conditional on reminder policy |
| US-23 | Import | Là Admin, tôi muốn import question có kiểm duyệt | OBJ-02/BR-07 | Could | Content operations efficiency | US-18 | Admin flow | Ready for team estimate |

`Must*` = AI-proposed release classification inherited from the draft; PO must confirm. All dependencies use explicit full IDs; no compact range is authoritative.

## 3. Acceptance criteria

AC là verification contract; không phải bằng chứng feature đã được implement. Scenario rủi ro được kiểm tra với happy, negative, boundary, authorization hoặc provider-failure path phù hợp theo [Software Quality Management, Slide 007](../refs/11-software-quality-management.md#slide-007--how-to-meet-user-requirements).

| AC ID | Story | Type | Acceptance criteria dạng Given/When/Then |
|---|---|---|---|
| AC-01-01 | US-01 | Happy/security | Given email hợp lệ chưa tồn tại, when đăng ký và xác minh thành công, then tài khoản được tạo; credential không lưu plaintext và secret không xuất hiện trong log. |
| AC-02-01 | US-02 | Authorization | Given actor không có role phù hợp, when gọi route bị giới hạn, then hệ thống trả 403/404 an toàn, không đổi dữ liệu và không lộ nội dung nhạy cảm. |
| AC-03-01 | US-03 | Happy/validation | Given Student đã đăng nhập, when lưu target position, interview type và goal hợp lệ, then profile lưu đúng và hiển thị lại sau đăng nhập; field thiếu/sai trả lỗi cụ thể, không ghi partial data ngoài thiết kế. |
| AC-04-01 | US-04 | Boundary | Given zero/one/many Published questions và question nhiều tag, when áp dụng filter kết hợp, then kết quả đúng, không trùng và phân trang/sort deterministic. |
| AC-05-01 | US-05 | Visibility | Given question `Published`, when Student mở detail, then thấy content, taxonomy, answer criteria/provenance phù hợp; `Draft`/`Archived` không công khai. |
| AC-06-01 | US-06 | Ownership | Given Student đăng nhập, when bookmark/đổi practice state, then state được lưu riêng và khôi phục; Student khác không đọc/sửa state này. |
| AC-07-01 | US-07 | State/privacy | Given Mentor nhập đủ field và consent, when submit verification, then hồ sơ chuyển `Pending`, evidence giữ private; thiếu field bị chặn. |
| AC-08-01 | US-08 | Authorization/audit | Given verification `Pending`, when đúng Admin approve/reject, then status, reason, actor và timestamp được audit; non-Admin bị chặn. |
| AC-09-01 | US-09 | Boundary/state | Given Mentor `Approved`, when tạo future slot không overlap với slot của mình, then slot lưu với timezone rõ; past/invalid/overlap hoặc Mentor chưa Approved bị chặn. |
| AC-10-01 | US-10 | Visibility | Given public mentor/slot data, when Student lọc, then chỉ Mentor `Approved` và available slot phù hợp xuất hiện; empty state phân biệt không mentor/không slot. |
| AC-11-01 | US-11 | Happy/validation | Given slot khả dụng, when Student gửi đủ goal/type/position, then một booking `Pending` được tạo; dữ liệu thiếu hoặc duplicate submit được xử lý an toàn. |
| AC-12-01 | US-12 | Concurrency | Given booking `Pending` và đúng Mentor, when accept, then booking `Confirmed` và slot khóa atomically; concurrent accept thứ hai nhận conflict, không có side effect thừa. |
| AC-12-02 | US-12 | Transition | Given booking `Pending`, when đúng Mentor reject hoặc propose reschedule với reason/slot hợp lệ, then transition theo canonical state machine và audit đầy đủ. |
| AC-13-01 | US-13 | Policy/transition | Given booking ở state cho phép, when actor được quyền cancel/propose/answer reschedule, then policy/guard được áp dụng và old/new slot, reason, actor, timestamp được lưu; transition sai bị chặn. |
| AC-14-01 | US-14 | Object authorization | Given booking `Confirmed`, when đúng Student/Mentor mở detail, then thấy meeting link; user khác nhận 403/404 an toàn và link không xuất hiện trong public/log. |
| AC-15-01 | US-15 | State/validation | Given booking `Completed`, when đúng Mentor gửi đủ rubric, strength, weakness và next action, then feedback được lưu/audit; state khác, actor khác hoặc rubric thiếu bị chặn. |
| AC-16-01 | US-16 | Object authorization | Given feedback tồn tại, when Student của booking mở, then thấy score/comment/next action; user khác bị chặn và share không tự động public. |
| AC-17-01 | US-17 | Uniqueness | Given booking `Completed` và chưa review, when đúng Student submit rating/comment hợp lệ, then một review gắn booking được tạo; duplicate/actor khác bị chặn. |
| AC-18-01 | US-18 | Moderation | Given đúng Admin, when publish question có taxonomy/provenance hợp lệ, then question công khai và audit decision; thiếu data/non-Admin bị từ chối. |
| AC-19-01 | US-19 | Provider failure | Given booking event đã commit, when notification provider timeout/fail/duplicate delivery, then booking giữ nguyên, job retry idempotent và có trạng thái vận hành/fallback. |
| AC-20-01 | US-20 | Authorization/audit | Given report/exception mở, when đúng Admin resolve, then decision, reason, actor, timestamp và affected record được audit; internal note không public. |

## 4. KPI plan

| KPI | Event/source | Công thức | Target |
|---|---|---|---:|
| Question task completion | Usability session | completed / attempted | ≥ 80% |
| Search time | Usability session | median task duration | ≤ 2 phút |
| Booking task completion | Usability session | valid requests / attempts | ≥ 80% |
| Booking reliability | Booking events | completed / confirmed | ≥ 80% |
| Feedback completeness | Feedback records | complete rubric / completed bookings | ≥ 90% |
| Perceived value | Post-session survey | average score | ≥ 4/5 |
| Confidence lift | Pre/post survey | average post − pre | ≥ 1/5 |

## 5. Definition of Done

- Acceptance criteria pass và PO chấp nhận.
- Code được review; unit/integration/E2E test phù hợp đều pass.
- Authorization, validation và negative paths được test.
- Không còn defect Critical/High liên quan story.
- Telemetry/audit cần thiết hoạt động và không log secret/PII không cần thiết.
- Tài liệu, migration, API contract và release note được cập nhật.
- Tính năng chạy trên môi trường deployment mục tiêu.

## 6. Requirement Traceability Matrix

RTM nối requirement từ origin đến deliverable và business/project objective theo [Monitoring and Control, Slide 042](../refs/09-software-project-monitoring-and-control.md#slide-042--requirements-traceability-matrix).

| Requirement | Origin/objective | Stories | BR / AC | Workflow / prototype | Verification/KPI |
|---|---|---|---|---|---|
| RQ-01 Identity/RBAC | Enabler; privacy constraint | US-01, US-02 | BR-04 / AC-01-01, AC-02-01 | FS-01; S01; cross-flow permission | TC-AUTH; access-control pass |
| RQ-02 Student goal | OBJ-02, OBJ-03 | US-03 | BR-03 / AC-03-01 | FS-01; S01 | TC-STUDENT; valid context rate |
| RQ-03 Question Bank | OBJ-02, OBJ-06 | US-04, US-05, US-06, US-18 | BR-07, BR-08 / AC-04-01, AC-05-01, AC-06-01, AC-18-01 | FS-02, FS-03, FS-11; S02-S03, A03 | TC-Q; completion/time |
| RQ-04 Mentor onboarding | OBJ-03 | US-07, US-08 | BR-01, BR-08 / AC-07-01, AC-08-01 | FS-04; M01-M03, A02 | TC-M; Approved mentor count |
| RQ-05 Availability/discovery | OBJ-03, OBJ-04 | US-09, US-10 | BR-01, BR-02 / AC-09-01, AC-10-01 | FS-04; S04-S05, M04 | TC-SLOT; search success |
| RQ-06 Booking lifecycle | OBJ-03, OBJ-04 | US-11, US-12, US-13 | BR-02, BR-03, BR-08 / AC-11-01, AC-12-01, AC-12-02, AC-13-01 | FS-05, FS-06; S06-S07, M05-M06 | TC-B; completion/reliability |
| RQ-07 Session access | OBJ-04 | US-14 | BR-04, BR-08 / AC-14-01 | FS-07, FS-08; S08, M07 | TC-SESSION; access-control pass |
| RQ-08 Feedback/review | OBJ-05, OBJ-06 | US-15, US-16, US-17 | BR-04, BR-05, BR-06 / AC-15-01, AC-16-01, AC-17-01 | FS-09, FS-10, FS-11; S09-S10, M08 | TC-F; completeness/value |
| RQ-09 Notification | OBJ-04 | US-19, US-22 | BR-09 / AC-19-01 | FS-07 + exceptions | TC-N; delivery/retry rate |
| RQ-10 Moderation/exception | Trust/operations | US-18, US-20 | BR-01, BR-07, BR-08 / AC-18-01, AC-20-01 | Admin flow; A01-A05 | TC-ADM; resolution time |

## 7. Test-case index

| Suite | Trọng tâm |
|---|---|
| TC-AUTH | Đăng ký, đăng nhập, role escalation, session expiry |
| TC-Q | Zero/one/many result, multi-tag filter, draft visibility, input length |
| TC-M | Verification states, unauthorized approval, public visibility |
| TC-SLOT | Timezone, overlap, past slot, concurrent update |
| TC-B | State transition, double booking, cancellation, idempotency |
| TC-SESSION | Meeting-link privacy và object-level authorization |
| TC-F | Completed-only feedback, rubric validation, review uniqueness |
| TC-N | Retry, duplicate event, provider outage và fallback |
| TC-ADM | CRUD, moderation, report resolution và audit trail |

## 8. Mapping summary

Mỗi Must story ánh xạ ít nhất một requirement/objective hoặc enabling constraint, AC và verification path. KPI chỉ đo outcome; test case xác nhận behavior. Hai loại bằng chứng phải được báo cáo riêng. Bản AI reference không tuyên bố test/KPI đã pass.

## 9. Product Backlog controls

### 9.1 Glossary

| Thuật ngữ | Nghĩa |
|---|---|
| Question | Nội dung phỏng vấn đã gắn taxonomy và trạng thái moderation |
| Mentor | User cung cấp mock interview; chỉ Approved mới công khai |
| Slot | Khoảng thời gian có timezone do Mentor cung cấp |
| Booking | Yêu cầu giữa một Student, Mentor và Slot |
| Feedback | Rubric riêng tư sau booking Completed |
| Review | Đánh giá công khai từ booking hợp lệ |

### 9.2 Business-value map

- Acquisition: Question Bank và nội dung tìm kiếm được.
- Activation: lưu câu hỏi hoặc xem mentor phù hợp.
- Conversion: gửi booking hợp lệ.
- Core value: booking diễn ra và feedback hoàn chỉnh.
- Retention: quay lại luyện chủ đề/đặt phiên tiếp theo.

### 9.3 Definition of Ready

Story sẵn sàng khi có actor/value, acceptance criteria, dependency, design/contract cần thiết, estimate của người thực hiện và không còn quyết định business chưa có owner. `Conditional on DEC-*` chưa đạt Ready; `Ready for team estimate` chỉ có nghĩa đủ đầu vào để team estimate, không phải đã estimate.

### 9.4 Release backlog và story map

1. Foundation: US-01,02,18.
2. Learn: US-03–06.
3. Discover mentor: US-07–10.
4. Book and attend: US-11–14,19.
5. Improve and trust: US-15–17,20.
6. Optional: US-21–23.

### 9.5 Change scope

Story AI, video, recording, payment/payout, mobile native và ML recommendation phải nằm ở Future Backlog trừ khi Sponsor/PO phê duyệt change request có capacity bù trừ.

### 9.6 Open decisions và readiness

| ID | Decision/unknown | Owner | Stories/rules bị ảnh hưởng | Trạng thái |
|---|---|---|---|---|
| DEC-01 | Product Owner/approver và authority matrix | Sponsor/group | Toàn bộ priority/acceptance | Open |
| DEC-02 | Pilot segment, sample/mentor/booking target | PO/Research | OBJ-01..OBJ-06; release boundary | Open |
| DEC-03 | Cancellation, reschedule, no-show, mark-complete authority/policy | PO/Operations | US-12, US-13, US-15; BR-05, BR-08 | Open — block Ready |
| DEC-04 | US-17 và US-20 có thuộc minimum releasable feature hay giảm slice | PO | US-17, US-20 | Open |
| DEC-05 | Reminder policy/cadence | PO/Operations | US-22; BR-09 | Open |
| DEC-06 | Team estimate/capacity/date | Development Team/PM | Mọi story release | Open |

### 9.7 Change control

Sau khi PO phê duyệt release baseline, thêm/xóa/đổi priority, BR, AC hoặc dependency phải có change record mô tả origin/evidence, story/feature bị ảnh hưởng, business value, effort/cost/schedule/risk và verification. Đây là yêu cầu chống scope creep theo [Monitoring and Control, Slides 025, 027-030](../refs/09-software-project-monitoring-and-control.md#slide-025--change-requests-4).

### 9.8 Human audit checklist

- [ ] PO xác nhận `Must*` và minimum releasable feature; đặc biệt US-17/US-20.
- [ ] PO/Operations đóng DEC-03 và canonical state machine.
- [ ] Development Team estimate; Codex/Hưng không tự gán story point.
- [ ] Mỗi MVP story được customer/PO và team hiểu, có value và có thể verify.
- [ ] Không có Must story thiếu AC, BR tham chiếu chưa định nghĩa hoặc dependency ID sai/vòng.
- [ ] RTM và prototype/workflow/architecture/PoC được owner tương ứng walkthrough.
- [ ] Evidence/phỏng vấn còn thiếu được giữ Hypothesis; không coi AI draft là discovery evidence.
- [ ] PO ký nhận/ghi decision trước khi đổi trạng thái thành Approved baseline.

## 10. Source và ref compliance index

| Nội dung | Source/ref | Áp dụng |
|---|---|---|
| Vision/objective/MVP | [Project Vision and Scope](Project_Vision_and_Scope.md) | Release boundary, objective mapping |
| Workflow/state | [Future-State Workflow](Future_State_Workflow.md) | FS mapping và transition |
| Prototype screens | [Prototype Workflow](../Project_Prototype/Prototype_Workflow.md) | Screen/interaction mapping |
| Technical gates | [Feasibility Study](../Project_Feasibility/feasibility.md), [Architecture](../Project_Architecture/software_architecture.md) | High-risk AC/PoC |
| Product Backlog/PO | [Scrum, Slides 013-015, 019](../refs/04-02-scrum-development-process.md#slide-013--kick-off-meeting) | Comprehensive backlog, value priority, release stories |
| Minimum releasable feature/story map | [Agile Planning, Slides 011, 014-016](../refs/06-1-agile-planning.md#slide-011--2-create-a-product-roadmap) | Priority/release audit |
| Understandable/value/verifiable story | [Project Planning, Slide 079](../refs/06-software-project-planning.md#slide-079--sales-tip-5-real-business-requirements) | DoR/AC gate |
| Traceability/inspection | [Monitoring and Control, Slides 039-042](../refs/09-software-project-monitoring-and-control.md#slide-039--9-validate-scope) | RTM/human acceptance |

**Readiness:** `AI-assisted reference — conditionally ready for human audit`. Chưa được xem là Approved Product/Release Backlog và chưa có observed test/KPI result.

