# Resource Plan — Interview Practice Platform

## 1. Mục đích và cơ sở lập kế hoạch

Tài liệu xác định trách nhiệm, capacity, công cụ và lịch sử dụng nguồn lực cho MVP. Vì nhóm, thời lượng và giờ cam kết chưa được xác nhận, kế hoạch dùng vai trò và tỷ lệ; không giả định số người hoặc ngày cụ thể.

## 2. Nhân lực và trách nhiệm

| Vai trò | Trách nhiệm chính | Deliverable | Người phụ trách |
|---|---|---|---|
| Sponsor | Phê duyệt charter, baseline, change lớn | Approval/decision | [CẦN BỔ SUNG] |
| Product Owner/BA | Vision, discovery, backlog, acceptance | Requirements/backlog/UAT | [CẦN BỔ SUNG] |
| PM/Scrum Master | Kế hoạch, sprint, risk, communication | Plan/status/risk log | [CẦN BỔ SUNG] |
| UI/UX | Research, workflow, prototype, usability | Prototype/design system | [CẦN BỔ SUNG] |
| Front-end | Web UI, state, accessibility, test | Student/Mentor/Admin UI | [CẦN BỔ SUNG] |
| Back-end | API, domain, auth, booking concurrency | Services/API/data | [CẦN BỔ SUNG] |
| QA | Test strategy, cases, automation, defect/UAT | Test report/quality evidence | [CẦN BỔ SUNG] |
| DevOps/Security | CI/CD, environment, secret, monitoring | Deployment/observability | [CẦN BỔ SUNG] |
| Content/Moderator | Taxonomy, question review, mentor/report policy | Pilot content/operations | [CẦN BỔ SUNG] |

Một người có thể giữ nhiều vai trò. Nhóm phải ghi rõ accountable owner cho Product, Architecture, Quality, Security/Privacy và Release.

## 3. Capacity và effort baseline

| Thông tin | Giá trị |
|---|---|
| Số thành viên | [CẦN BỔ SUNG] |
| Thời lượng | [CẦN BỔ SUNG] tuần |
| Giờ/người/tuần | [CẦN BỔ SUNG] |
| Capacity danh nghĩa | Thành viên × tuần × giờ/người/tuần |
| Reserve | [CẦN BỔ SUNG]% cho học tập, risk và nghỉ |
| Capacity commitment | Capacity danh nghĩa × (1 − reserve) |

Quy tắc:

- Chỉ commit sau khi story đạt Definition of Ready và người thực hiện estimate.
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

