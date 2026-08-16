# Resource Plan — Interview Practice Platform

## 1. Mục đích và cơ sở lập kế hoạch

Tài liệu xác định trách nhiệm, capacity, công cụ và lịch sử dụng nguồn lực cho MVP. Planning baseline có sáu thành viên, mỗi người 16 giờ/tuần trong 8 tuần; reserve 15% để lại khoảng 653 giờ capacity cho scope. Đây chưa phải effort commitment của backlog JD-first.

## 2. Nhân lực và trách nhiệm

| Vai trò | Trách nhiệm chính | Deliverable | Người phụ trách |
|---|---|---|---|
| Sponsor | Phê duyệt charter, baseline, change lớn | Approval/decision | Ngô Huy Biên; Ngô Ngọc Đăng Khoa |
| PM/Scrum Master, initiation & estimation | Charter, plan, estimate, sprint, risk, communication | Plan/status/risk/time-cost-resource | Gia Thành |
| UI/UX | Research, workflow, clickable prototype, usability | Prototype/handoff/design evidence | Hùng |
| Product Owner/BA | Vision, scope, backlog, priority và acceptance | Vision & Scope, Product Backlog, AC, Future-State Workflow và UAT acceptance | Hưng |
| PoC/E2E | JD processing/mapping, API/domain, E2E, booking concurrency và technical evidence | PoC/services/API/data/tests | Trí |
| Architecture/technical lead | Stack, ADR, boundaries, security, deployment guidance | Architecture/ADR/technical gates | Luân |
| Trưởng nhóm / leadership & governance | Điều phối nhóm, phê duyệt scope/priority, escalation, delivery readiness; quản lý dependency, PR/code review, document control và CI/integration | Integrated product, controlled docs, merge/release evidence và governance decision | Tuấn Anh |
| Front-end implementation | Product UI, state, accessibility và integration test | Student/Mentor/Admin UI | Hùng; Tuấn Anh hỗ trợ integration |
| QA/UAT | Test strategy, automation, defect/UAT và evidence review | Test report/quality evidence | Tuấn Anh điều phối peer review chéo; không owner nào tự duyệt deliverable của mình; Hưng chấp nhận UAT |
| Content/Moderator | Labeled JD set, taxonomy/alias, Question review và mentor/report policy | Pilot content/operations | Hưng accountable; nhóm hỗ trợ |

Sáu dòng vai trò mang tên thành viên ở trên là vai trò chính theo Charter. Các dòng Front-end implementation, QA/UAT và Content/Moderator là chức năng hỗ trợ trong kế hoạch nguồn lực, không thay thế hoặc tạo thêm chức danh chính. Một người có thể thực hiện nhiều chức năng nhưng phải ghi rõ accountable owner cho Product, Architecture, Quality, Security/Privacy và Release. Theo Charter, Trưởng nhóm phê duyệt scope/priority ở cấp leadership & governance; Hưng với vai trò Product Owner/BA vẫn sắp thứ tự backlog và chấp nhận story, Gia Thành sở hữu schedule/risk và Luân sở hữu ADR.

### 2.1 Phân công deliverable và implementation

| Workstream/deliverable | Accountable | Responsible | Consulted/Reviewer | Exit evidence |
|---|---|---|---|---|
| Charter, resource và time-cost estimate | Gia Thành | Gia Thành | Tuấn Anh, Hưng, cả nhóm | Hai estimate độc lập, assumptions, capacity và approval record |
| Prototype workflow/handoff/usability | Hùng | Hùng | Hưng, Tuấn Anh | Clickable link, exported evidence, task result và trace tới backlog |
| Vision, Scope, Product Backlog, AC và Future Workflow | Hưng | Hưng | Tuấn Anh và owner các workstream | PO order/decision, RTM, acceptance record và approved change record |
| Architecture, stack và ADR | Luân | Luân | Trí, Tuấn Anh | ADR rationale/status, security/data/deployment constraints và review record |
| End-to-End PoC | Trí | Trí | Luân, Tuấn Anh | Source, labeled JD/seed, commands và Pass/Fail cho JD extraction/mapping cùng booking/security/reliability risks |
| Integrated product foundation | Tuấn Anh | Tuấn Anh, Trí, Hùng | Luân, Hưng | Repository/CI, shared contracts, auth/RBAC foundation và integrated smoke test |
| Document/configuration management | Tuấn Anh | Tuấn Anh; từng owner cập nhật file của mình | Gia Thành, Hưng | Cây thư mục, version/source/link nhất quán; action item đóng trước merge |
| UAT/release readiness | Hưng | Tuấn Anh và toàn nhóm | Gia Thành, pilot users | Critical tests pass, no Critical/High defect, UAT/PO acceptance và release evidence |

### 2.2 Trách nhiệm của Trưởng nhóm / leadership & governance

- Duy trì integration checklist và dependency map giữa requirement, prototype, architecture, PoC và implementation.
- Điều phối nhóm, tham gia phê duyệt scope/priority cùng PO/PM, hỗ trợ escalation và theo dõi delivery readiness.
- Thiết lập/duy trì CI quality gates, shared contract và smoke path `JD -> Preparation Plan -> Question/Mentor -> Booking -> Session -> Feedback`.
- Tham gia implementation ở foundation, auth/RBAC, integration và defect xuyên module; pair với Trí cho API/PoC, Hùng cho UI và Luân cho constraint/ADR.
- Review PR/code và tài liệu theo traceability; kiểm tra source, version, owner, status và link/evidence trước merge.
- Điều phối fix cho mismatch; quyết định governance về scope/priority phải có Tuấn Anh và Hưng, trong đó Hưng sắp thứ tự/chấp nhận backlog; schedule/risk do Gia Thành sở hữu và kiến trúc do Luân sở hữu.

## 3. Capacity và effort baseline

| Thông tin | Giá trị |
|---|---|
| Số thành viên | 6: Gia Thành, Hùng, Hưng, Trí, Luân, Tuấn Anh |
| Thời lượng đề xuất | 8 tuần, 29/06/2026–23/08/2026 |
| Giờ/người/tuần | 16 giờ |
| Capacity danh nghĩa | 6 × 8 × 16 = 768 giờ |
| Reserve | 15% = khoảng 115 giờ |
| Capacity cho scope | Khoảng 653 giờ — planning baseline đã chốt |
| Working estimate hiện có | 606 giờ Bottom-up + Three-point; 650 giờ Top-down guardrail, đều dựa trên 20 câu chuyện Bắt buộc cũ và phải cập nhật theo 27 câu chuyện/134 SP |

Quy tắc:

- Chỉ commit sau khi story đạt Definition of Ready và người thực hiện estimate.
- Capacity baseline không được dùng để cam kết thêm story hoặc kéo Future Backlog vào R1 khi JD-first scope chưa được re-estimate.
- Không dùng 100% capacity cho feature; dành chỗ cho discovery, review, test, defect và documentation.
- Theo dõi actual effort, velocity, carry-over và blocker để reforecast.
- Không bù lịch bằng overtime kéo dài.

## 4. Môi trường và công cụ

| Nhóm | Nhu cầu | Lựa chọn/Trạng thái |
|---|---|---|
| Backlog | Story, acceptance, sprint, defect | GitHub Issues/Projects hoặc công cụ tương đương |
| Repository | Source control, PR review | Git + GitHub; protected main và PR review |
| Design | Wireframe/prototype | Figma |
| CI/CD | Build, test, deploy | GitHub Actions hoặc pipeline tương đương; secret không nằm trong repo |
| Web/API | Framework production | React/Vite/Tailwind + Node.js/Express baseline từ Architecture owner |
| Database | Transaction, constraint, backup | PostgreSQL baseline |
| JD processing | Private upload/storage, direct extraction, internal OCR VI/EN | Theo PD-06/07: 50k hoặc một PDF/PNG/JPEG ≤10 MB, PDF ≤5 trang, timeout 60s, ≤2 attempts và 2 concurrent jobs/worker |
| Matching | Taxonomy/alias, 20-JD labeled set, versioned 40/30/15/15 rules | Theo PD-08: threshold 60, top 10/JD, max 3/requirement; recall/precision@10 ≥80%; owner/reviewer rõ |
| Email | Booking notification | Provider + retry/fallback |
| Meeting | External link | Google Meet/Zoom/manual link |
| Analytics | Funnel/KPI, privacy-aware | PostgreSQL aggregate event table + versioned SQL export; không dùng third-party tracker và không chứa JD content |
| Test | Unit, integration, E2E, UAT | Framework theo stack + UAT checklist; chốt trong implementation plan |

## 5. Resource schedule

| Giai đoạn | Tuần | Capacity tham chiếu | Resource trọng tâm |
|---|---:|---:|---|
| Discovery/charter | 1 | 82 giờ | Sponsor, PO/BA, UX, Student/Mentor sample |
| Prototype/requirements | 2 | 81 giờ | PO/BA, UX, QA, tech leads |
| Foundation | 3 | 82 giờ | Back-end, Front-end, DevOps, QA |
| JD intake/analysis/mapping | 4 | 81 giờ | PO/Content, UX, Back-end, Front-end, Architecture, QA |
| Mentor Marketplace | 5–6 | 163 giờ | Full team; Question/practice, booking, feedback và mentor reviewers |
| Integration/UAT/release | 7–8 | 164 giờ | QA, DevOps, PO, pilot users, full team |
| **Tổng** | **8** | **653 giờ** | Capacity envelope; backlog mới vẫn cần re-estimate |

Backlog sau JD-first change có 27 câu chuyện/134 initial SP cho R1 Must thay vì 20 câu chuyện dùng trong hai estimate hiện có. PM/Development Team phải Planning Poker, cập nhật cả Bottom-up và Top-down, rồi so thông lượng cần thiết 33,5 SP/sprint với khoảng velocity trước khi cam kết. Không nội suy tỷ lệ từ baseline cũ.

## 6. Resource risks và mitigation

| Risk | Indicator | Mitigation | Contingency |
|---|---|---|---|
| Thiếu skill về concurrency/security | Spike thất bại, defect quyền truy cập | Spike/POC sớm, pair review | Thu hẹp workflow và dùng managed service phù hợp |
| Thiếu skill/corpus cho extraction và mapping | PoC không tái lập hoặc relevance thấp | Labeled JD set, direct extraction trước, rule-based versioned matching và pair với Architecture/Content | Giới hạn định dạng/vị trí pilot; giữ manual correction/coverage-gap |
| Phụ thuộc một thành viên | Task/blocker chỉ một người xử lý | Pairing, ADR, docs, code review | Reassign và giảm WIP |
| Thiếu mentor/student test | Không đủ lịch research/UAT | Tuyển từ discovery, đặt lịch sớm | Controlled usability/concierge pilot |
| Quota/provider | Cảnh báo quota hoặc outage | Monitor, adapter, free-tier review | Fallback/manual notification |
| Capacity thấp hơn dự kiến | Carry-over hai sprint | Re-estimate và ưu tiên Must | Cắt Should/Could, giữ core loop |

