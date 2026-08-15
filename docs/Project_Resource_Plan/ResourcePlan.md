# Resource Plan — Interview Practice Platform

## 1. Mục đích và cơ sở lập kế hoạch

Tài liệu xác định trách nhiệm, capacity, công cụ và lịch sử dụng nguồn lực cho MVP. Nhóm hiện có sáu thành viên: năm owner trong `Task_W10.pdf` và Tuấn Anh ở vai trò Team Lead cross-cutting. Thời lượng 12 tuần và baseline 816 giờ của năm thành viên ban đầu là đề xuất đã đối chiếu; capacity bổ sung của Tuấn Anh chỉ được tính sau khi xác nhận giờ cam kết.

## 2. Nhân lực và trách nhiệm

| Vai trò | Trách nhiệm chính | Deliverable | Người phụ trách |
|---|---|---|---|
| Sponsor | Phê duyệt charter, baseline, change lớn | Approval/decision | [CẦN BỔ SUNG] |
| Product Owner/BA | Vision, discovery, backlog, priority, acceptance | Requirements/backlog/UAT | Hưng |
| PM/Scrum Master | Charter, plan, estimate, sprint, risk, communication | Plan/status/risk/time-cost-resource | Gia Thành |
| Team Lead/Configuration & Integration | Đã dựng repository skeleton và starter document set; tiếp tục quản lý cross-workstream dependency, PR/code review, document control, CI/integration và release readiness | Repository/document starting point, integrated product, controlled docs, merge/release evidence | Tuấn Anh |
| UI/UX và prototype | Research, workflow, clickable prototype, usability | Prototype/handoff/design evidence | Hùng |
| PoC/Back-end implementation | API, domain, booking concurrency, technical evidence | PoC/services/API/data/tests | Trí |
| Architecture/DevOps/Security | Stack, ADR, boundaries, security, deployment guidance | Architecture/ADR/technical gates | Luân |
| Front-end implementation | Product UI, state, accessibility và integration test | Student/Mentor/Admin UI | Hùng; Tuấn Anh hỗ trợ integration |
| QA/UAT | Test strategy, automation, defect/UAT và evidence review | Test report/quality evidence | Tuấn Anh điều phối peer review chéo; không owner nào tự duyệt deliverable của mình; Hưng chấp nhận UAT |
| Content/Moderator | Taxonomy, question review, mentor/report policy | Pilot content/operations | Hưng accountable; nhóm hỗ trợ |

Một người có thể giữ nhiều vai trò. Nhóm phải ghi rõ accountable owner cho Product, Architecture, Quality, Security/Privacy và Release. Team Lead điều phối và kiểm tra integration nhưng không thay PO quyết định scope/acceptance, PM quyết định schedule/risk hay Architecture owner quyết định ADR.

### 2.1 Phân công deliverable và implementation

| Workstream/deliverable | Accountable | Responsible | Consulted/Reviewer | Exit evidence |
|---|---|---|---|---|
| Repository skeleton và document scaffolding | Tuấn Anh | Tuấn Anh | Gia Thành, Hưng | **Completed:** [`ff41b3c`](https://github.com/tnnhuaa/InterviewQuestionBank/commit/ff41b3ce37b6187df6590d1d77b057e59792f25d) + [`0743a68`](https://github.com/tnnhuaa/InterviewQuestionBank/commit/0743a685195a3396511a59c83515860c9f11bfdd); root/docs structure và starter content đã bàn giao cho các owner |
| Charter, resource và time-cost estimate | Gia Thành | Gia Thành | Tuấn Anh, Hưng, cả nhóm | Hai estimate độc lập, assumptions, capacity và approval record |
| Prototype workflow/handoff/usability | Hùng | Hùng | Hưng, Tuấn Anh | Clickable link, exported evidence, task result và trace tới backlog |
| Vision, Scope, Product Backlog, AC và Future Workflow | Hưng | Hưng | Tuấn Anh và owner các workstream | PO order/decision, RTM, inspection result và approved change record |
| Architecture, stack và ADR | Luân | Luân | Trí, Tuấn Anh | ADR rationale/status, security/data/deployment constraints và review record |
| End-to-End PoC | Trí | Trí | Luân, Tuấn Anh | Source, seed, commands và asserted Pass/Fail cho năm technical risks |
| Integrated product foundation | Tuấn Anh | Tuấn Anh, Trí, Hùng | Luân, Hưng | Repository/CI, shared contracts, auth/RBAC foundation và integrated smoke test |
| Document/configuration management | Tuấn Anh | Tuấn Anh; từng owner cập nhật file của mình | Gia Thành, Hưng | Đúng cây W10, version/source/link nhất quán, action item đóng trước merge |
| UAT/release readiness | Hưng | Tuấn Anh và toàn nhóm | Gia Thành, pilot users | Critical tests pass, no Critical/High defect, UAT/PO acceptance và release evidence |

### 2.2 Đóng góp và công việc của Tuấn Anh

**Đã hoàn thành**

- Khởi tạo repository và README gốc tại [`ff41b3c`](https://github.com/tnnhuaa/InterviewQuestionBank/commit/ff41b3ce37b6187df6590d1d77b057e59792f25d).
- Tạo skeleton `docs/` và nội dung nền cho 16 đường dẫn ban đầu (1.925 dòng) tại [`0743a68`](https://github.com/tnnhuaa/InterviewQuestionBank/commit/0743a685195a3396511a59c83515860c9f11bfdd).
- Bàn giao khung cấu trúc/nội dung khởi đầu; việc bootstrap không thay thế trách nhiệm của từng owner trong hoàn thiện, kiểm chứng và xin acceptance cho deliverable của mình.

**Tiếp tục phụ trách**

- Duy trì integration checklist và dependency map giữa requirement, prototype, architecture, PoC và implementation.
- Thiết lập/duy trì CI quality gates, shared contract và smoke path `Question -> Mentor -> Booking -> Session -> Feedback`.
- Tham gia implementation ở foundation, auth/RBAC, integration và defect xuyên module; pair với Trí cho API/PoC, Hùng cho UI và Luân cho constraint/ADR.
- Review PR/code và tài liệu theo traceability; kiểm tra source, version, owner, status và link/evidence trước merge.
- Điều phối fix cho mismatch nhưng chuyển quyết định scope cho Hưng, schedule/risk cho Gia Thành và kiến trúc cho Luân.

## 3. Capacity và effort baseline

| Thông tin | Giá trị |
|---|---|
| Số thành viên | 6: Gia Thành, Hùng, Hưng, Trí, Luân, Tuấn Anh |
| Thời lượng đề xuất | 12 tuần |
| Baseline năm thành viên ban đầu | 5 × 12 × 16 = 960 giờ danh nghĩa; 816 giờ sau reserve 15% |
| Giờ của Tuấn Anh | `h_TA` giờ/tuần — [CẦN TUẤN ANH XÁC NHẬN] |
| Capacity bổ sung của Tuấn Anh | `12 × h_TA × (1 − 15%)` |
| Revised commitment | `816 + 12 × h_TA × 0.85` giờ; cần PM/team/Sponsor rebaseline |
| Working estimate hiện có | 688 giờ; không tự tăng scope khi capacity tăng |
| Reserve | 15% cho học tập, risk và nghỉ |

Quy tắc:

- Chỉ commit sau khi story đạt Definition of Ready và người thực hiện estimate.
- Capacity của Tuấn Anh chưa xác nhận không được dùng để cam kết thêm story hoặc kéo Future Backlog vào R1.
- Không dùng 100% capacity cho feature; dành chỗ cho discovery, review, test, defect và documentation.
- Theo dõi actual effort, velocity, carry-over và blocker để reforecast.
- Không bù lịch bằng overtime kéo dài.

## 4. Môi trường và công cụ

| Nhóm | Nhu cầu | Lựa chọn/Trạng thái |
|---|---|---|
| Backlog | Story, acceptance, sprint, defect | [CẦN CHỌN] |
| Repository | Source control, PR review | [CẦN CHỌN] |
| Design | Wireframe/prototype | [CẦN CHỌN] |
| CI/CD | Build, test, deploy | [CẦN CHỌN] |
| Web/API | Framework production | Chốt bằng ADR sau spike |
| Database | Transaction, constraint, backup | Relational DB đề xuất |
| Email | Booking notification | Provider + retry/fallback |
| Meeting | External link | Google Meet/Zoom/manual link |
| Analytics | Funnel/KPI, privacy-aware | [CẦN CHỌN] |
| Test | Unit, integration, E2E, UAT | [CẦN CHỌN] |

## 5. Resource schedule

| Giai đoạn | Tỷ lệ | Resource trọng tâm |
|---|---:|---|
| Discovery/charter | 15% | Sponsor, PO/BA, UX, Student/Mentor sample |
| Prototype/requirements | 15% | PO/BA, UX, QA, tech leads |
| Foundation | 15% | Back-end, Front-end, DevOps, QA |
| Question Bank | 15% | Content, PO, Front-end, Back-end, QA |
| Mentor Marketplace | 25% | Full team, mentor reviewers |
| Integration/UAT/release | 15% | QA, DevOps, PO, pilot users, full team |

## 6. Resource risks và mitigation

| Risk | Indicator | Mitigation | Contingency |
|---|---|---|---|
| Thiếu skill về concurrency/security | Spike thất bại, defect quyền truy cập | Spike/POC sớm, pair review | Thu hẹp workflow và dùng managed service phù hợp |
| Phụ thuộc một thành viên | Task/blocker chỉ một người xử lý | Pairing, ADR, docs, code review | Reassign và giảm WIP |
| Thiếu mentor/student test | Không đủ lịch research/UAT | Tuyển từ discovery, đặt lịch sớm | Controlled usability/concierge pilot |
| Quota/provider | Cảnh báo quota hoặc outage | Monitor, adapter, free-tier review | Fallback/manual notification |
| Capacity thấp hơn dự kiến | Carry-over hai sprint | Re-estimate và ưu tiên Must | Cắt Should/Could, giữ core loop |

