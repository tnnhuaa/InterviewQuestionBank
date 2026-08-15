# Resource Plan - Interview Practice Platform

## 1. Capacity baseline

Baseline này dùng để kiểm tra tính khả thi của MVP; không phải cam kết làm thêm giờ.

| Thông tin | Giá trị |
|---|---:|
| Số thành viên | 6 |
| Thời lượng | 12 tuần (17/08/2026-08/11/2026) |
| Giờ/người/tuần | 16 giờ |
| Capacity danh nghĩa | 6 x 12 x 16 = 1.152 giờ |
| Reserve | 15% = 173 giờ |
| Capacity cam kết cho scope | **~979 giờ** |
| Nhịp làm việc | Sprint 2 tuần; review/reforecast ở cuối mỗi sprint |

Reserve bảo vệ discovery, review, test, defect, tài liệu, học công nghệ và rủi ro. Một story chỉ được đưa vào sprint sau khi đạt Definition of Ready và có estimate của người thực hiện.

## 2. Phân công và ownership

| Thành viên | Capacity danh nghĩa | Ownership chính | Hỗ trợ / kiểm tra chéo |
|---|---:|---|---|
| Gia Thành | 192 giờ | PM, plan, risk, cost/time/resource, release coordination | Review requirement, UAT, documentation |
| Tuấn Anh | 192 giờ | Trưởng nhóm, governance, scope review, stakeholder alignment | Review chất lượng delivery, issue escalation và priority quyết định |
| Hùng | 192 giờ | UX research, workflow, clickable prototype, usability evidence | UI acceptance và accessibility |
| Hưng | 192 giờ | PO/BA, scope, backlog, acceptance criteria, content/business rule | Discovery và UAT acceptance |
| Trí | 192 giờ | E2E PoC, seed data, integration tests, technical risk evidence | Core flow implementation |
| Luân | 192 giờ | Architecture, ADR, stack, security/consistency/reliability design | PoC technical review |

Mỗi người chịu trách nhiệm deliverable được giao trong `Task_W10.pdf`; ownership của Product, Architecture, Quality, Security/Privacy và Release không được để trống. Khi bắt đầu build MVP, các vai trò front-end, back-end, QA, DevOps và content được phân bổ theo work package thay vì giả định một người cho một chức danh cố định.

## 3. Phân bổ effort dự kiến theo giai đoạn

| Giai đoạn | Tuần | Capacity cam kết tham chiếu | Trọng tâm nguồn lực |
|---|---:|---:|---|
| Discovery/charter | 1-2 | 163 giờ | Gia Thành, Tuấn Anh, Hưng, Hùng; mentor/student sample |
| Prototype/requirement | 3-4 | 163 giờ | Hưng, Hùng, Gia Thành, Tuấn Anh; requirement và workflow baseline |
| Foundation | 5-6 | 163 giờ | Luân, Trí; auth, schema, CI/CD, test foundation |
| JD intake & analysis | 7-8 | 163 giờ | Hưng, Trí, Hùng, Gia Thành; extraction/OCR, taxonomy, matching, prep plan |
| Marketplace | 9-11 | 245 giờ | Cả nhóm; availability, booking, notification, feedback |
| UAT/release | 12 | 82 giờ | Gia Thành, Tuấn Anh, Hưng, Trí, Luân; pilot users và defect triage |
| **Tổng** | **12** | **~979 giờ** | |

## 4. Công cụ và cơ sở vật chất

| Nhu cầu | Lựa chọn baseline | Mục đích / kiểm soát |
|---|---|---|
| Backlog và quyết định | GitHub Issues/Projects hoặc công cụ tương đương | Story, acceptance, sprint, defect, decision log |
| Repository | Git + GitHub, protected main, Pull Request review | Version control, review, traceability |
| Design | Figma | Prototype, usability evidence, handoff |
| CI/CD | GitHub Actions hoặc pipeline tương đương | Build, test, deploy; secret không nằm trong repo |
| Database | Relational DB managed/free tier phù hợp ADR | Transaction, constraint, migration, backup |
| Notification/meeting | Email provider và Google Meet/Zoom link ngoài | Retry/fallback; meeting provider không là source of truth |
| Test | Unit, integration, E2E, UAT checklist | Bao phủ critical workflow và negative authorization test |
| Documentation | Markdown trong repository | Versioned charter, ADR, plan, test evidence |

Tên nhà cung cấp runtime được chốt ở ADR-001 sau skill matrix/spike; chỉ được chọn free tier nếu vẫn đạt security, backup và reliability yêu cầu.

## 5. Quy tắc vận hành nguồn lực

- Theo dõi actual effort, carry-over, blocker và velocity theo sprint; reforecast khi carry-over hoặc velocity thấp kéo dài hai sprint.
- Ưu tiên cắt Should/Could trước; không cắt kiểm soát access, consistency, audit, test hay UAT của core loop.
- Mọi thay đổi làm forecast vượt khoảng 979 giờ hoặc 1.125.000 VND cash budget cần change request và quyết định PO/Sponsor. Scope JD mới phải được re-estimate/rebaseline trước khi dùng phần capacity còn lại của baseline cũ.
- Pair review cho booking concurrency, authorization, notification và deployment; tài liệu/ADR giảm phụ thuộc vào một người.

## 6. Resource risks

| Rủi ro | Dấu hiệu | Phòng ngừa | Contingency |
|---|---|---|---|
| Thiếu skill về concurrency/security | Spike/PoC fail hoặc defect quyền truy cập | Spike sớm, ADR, pair review, negative tests | Thu hẹp workflow, dùng managed service phù hợp |
| Phụ thuộc một thành viên | Chỉ một người xử lý blocker/domain | PR review, docs, pairing, WIP limit | Reassign và giảm scope không cốt lõi |
| Thiếu mentor/student thử nghiệm | Không có lịch discovery/UAT | Tuyển và đặt lịch từ tuần 1 | Concierge pilot có kiểm soát |
| Provider/quota lỗi | Alert quota/outage | Adapter, retry, monitor | In-app/manual notification |
| Capacity thấp hơn forecast | Carry-over hai sprint | Re-estimate, bảo vệ reserve | Cắt Should/Could, xin quyết định Go/No-Go |

## 7. Tham chiếu

- `docs/refs/03-software-project-initiation.md`, slide 008-009: charter cần governance/resources; RAM/RACI làm rõ trách nhiệm.
- `docs/refs/05-1-work-breakdown-structure.md`, slide 025 và 033: WBS giúp estimate/control; chỉ gồm 100% công việc trong scope.
- `docs/Project_Vision_and_Scope/Product_Backlog_and_Acceptance_Criteria.md`: 20 Must stories, dependency và Definition of Ready.
