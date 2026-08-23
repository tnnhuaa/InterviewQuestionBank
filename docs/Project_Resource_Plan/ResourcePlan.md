# Resource Plan - Interview Practice Platform

## 1. Capacity baseline

Baseline này dùng để kiểm tra tính khả thi của MVP; không phải cam kết làm thêm giờ.

| Thông tin | Giá trị |
| --- | ---: |
| Số thành viên | 6 |
| Thời lượng | 8 tuần (29/06/2026-23/08/2026) |
| Giờ/người/tuần | 16 giờ |
| Capacity danh nghĩa | 6 x 8 x 16 = 768 giờ |
| Reserve | 15% = 115 giờ |
| Capacity cam kết cho scope | **~653 giờ** |
| Nhịp làm việc | Kanban theo tuần; replenishment/review mỗi tuần hoặc khi cần chốt thay đổi |

Reserve bảo vệ discovery, review, test, defect, tài liệu, học công nghệ và rủi ro. Một story chỉ được kéo vào cột Ready sau khi đạt Definition of Ready và có estimate của người thực hiện.

## 2. Phân công và ownership

| Thành viên | Capacity danh nghĩa | Ownership chính | Hỗ trợ / kiểm tra chéo |
| --- | ---: | --- | --- |
| Tuấn Anh | 128 giờ | Project Manager / Team Leader / Timekeeper; phân vai, giao việc, deadline, Kanban, escalation và delivery | Review/merge, xác nhận Done, stakeholder alignment và quyết định điều hành |
| Gia Thành | 128 giờ | Project Planning & Estimation Analyst / Full-stack Developer; charter, plan, cost/time/resource, estimates và implementation | Review requirement, UAT và tài liệu |
| Hưng | 128 giờ | Product Owner / Business Analyst; scope, backlog, acceptance criteria, content/business rule | Discovery và UAT acceptance |
| Luân | 128 giờ | Architecture / Technical Lead; ADR, stack, security/consistency/reliability design | PoC và implementation technical review |
| Hùng | 128 giờ | UI/UX Designer / Front-end Developer; research, workflow, prototype, usability và giao diện | UI acceptance và accessibility |
| Trí | 128 giờ | PoC / Integration & E2E Developer; seed data, integration tests và technical risk evidence | Core flow implementation |

Mỗi người chịu trách nhiệm deliverable được giao trong WBS/backlog; ownership của Product, Architecture, Quality, Security/Privacy và Release không được để trống. Khi bắt đầu build MVP, các vai trò front-end, back-end, QA, DevOps và content được phân bổ theo work package thay vì giả định một người cho một chức danh cố định.

## 3. Phân bổ effort dự kiến theo giai đoạn

| Giai đoạn | Tuần | Capacity cam kết tham chiếu | Trọng tâm nguồn lực |
| --- | ---: | ---: | --- |
| Discovery/charter | 1 | 82 giờ | Gia Thành, Tuấn Anh, Hưng, Hùng; mentor/student sample |
| Prototype/requirement | 2 | 81 giờ | Hưng, Hùng, Gia Thành, Tuấn Anh; requirement và workflow baseline |
| Foundation | 3 | 82 giờ | Luân, Trí; auth, schema, CI/CD, test foundation |
| JD intake & analysis | 4 | 81 giờ | Hưng, Trí, Hùng, Gia Thành; extraction/OCR, taxonomy, matching, prep plan |
| Marketplace core loop | 5-6 | 163 giờ | Cả nhóm; availability, booking, notification, feedback |
| UAT/release | 7-8 | 164 giờ | Gia Thành, Tuấn Anh, Hưng, Trí, Luân; pilot users, defect triage và release |
| **Tổng** | **8** | **~653 giờ** | |

## 4. Công cụ và cơ sở vật chất

| Nhu cầu | Lựa chọn baseline | Mục đích / kiểm soát |
| --- | --- | --- |
| Backlog và quyết định | Trello Kanban/GitHub hoặc công cụ tương đương | Story, acceptance, trạng thái luồng, defect và decision log |
| Repository | Git + GitHub, protected main, Pull Request review | Version control, review, traceability |
| Design | Figma | Prototype, usability evidence, handoff |
| CI/CD | GitHub Actions hoặc pipeline tương đương | Build, test, deploy; secret không nằm trong repo |
| Database | Relational DB managed/free tier phù hợp ADR | Transaction, constraint, migration, backup |
| Notification/meeting | Email provider và Google Meet/Zoom link ngoài | Retry/fallback; meeting provider không là source of truth |
| Test | Unit, integration, E2E, UAT checklist | Bao phủ critical workflow và negative authorization test |
| Documentation | Markdown trong repository | Versioned charter, ADR, plan, test evidence |

Tên nhà cung cấp runtime được chốt ở ADR-001 trong bảng Architecture decisions của `docs/Project_Architecture/software_architecture.md`, sau skill matrix/spike; chỉ được chọn free tier nếu vẫn đạt security, backup và reliability yêu cầu.

## 5. Quy tắc vận hành nguồn lực

- Theo dõi actual effort nếu có, blocker, WIP, cycle time và throughput theo tuần; reforecast khi công việc bị kẹt hoặc throughput thấp kéo dài hai tuần.
- Ưu tiên cắt Should/Could trước; không cắt kiểm soát access, consistency, audit, test hay UAT của core loop.
- Mọi thay đổi làm forecast vượt khoảng 653 giờ hoặc 1.125.000 VND cash budget cần change request và quyết định PO/Sponsor. Trong cửa sổ 8 tuần, chỉ core loop JD-to-feedback và các kiểm soát chất lượng bắt buộc được ưu tiên; Should/Could hoặc hạng mục không cần cho pilot phải được dời sau release.
- Pair review cho booking concurrency, authorization, notification và deployment; tài liệu/ADR giảm phụ thuộc vào một người.

## 6. Resource risks

| Rủi ro | Dấu hiệu | Phòng ngừa | Contingency |
| --- | --- | --- | --- |
| Thiếu skill về concurrency/security | Spike/PoC fail hoặc defect quyền truy cập | Spike sớm, ADR, pair review, negative tests | Thu hẹp workflow, dùng managed service phù hợp |
| Phụ thuộc một thành viên | Chỉ một người xử lý blocker/domain | PR review, docs, pairing, WIP limit | Reassign và giảm scope không cốt lõi |
| Thiếu mentor/student thử nghiệm | Không có lịch discovery/UAT | Tuyển và đặt lịch từ tuần 1 | Concierge pilot có kiểm soát |
| Provider/quota lỗi | Alert quota/outage | Adapter, retry, monitor | In-app/manual notification |
| Capacity thấp hơn forecast | Công việc bị kẹt hoặc throughput thấp hai tuần | Re-estimate, bảo vệ reserve | Cắt Should/Could, xin quyết định Go/No-Go |

## 7. Tham chiếu

- `docs/refs/03-software-project-initiation.md`, slide 008-009: charter cần governance/resources; RAM/RACI làm rõ trách nhiệm.
- `docs/refs/05-1-work-breakdown-structure.md`, slide 025 và 033: WBS giúp estimate/control; chỉ gồm 100% công việc trong scope.
- `docs/Project_Vision_and_Scope/Product_Backlog_and_Acceptance_Criteria.md`: 20 Must stories, dependency và Definition of Ready.
