# Resource Plan - Interview Practice Platform

## 1. Capacity baseline

This baseline is used to check the feasibility of the MVP; it is not a commitment to work overtime.

| Item | Value |
| --- | ---: |
| Team size | 6 |
| Duration | 8 weeks (29/06/2026-23/08/2026) |
| Hours/person/week | 16 hours |
| Nominal capacity | 6 x 8 x 16 = 768 hours |
| Reserve | 15% = 115 hours |
| Capacity committed to scope | **~653 hours** |
| Working rhythm | Weekly Kanban; replenishment/review weekly or when a change needs to be confirmed |

The reserve protects discovery, review, testing, defects, documentation, learning new technology, and risk. A story is only pulled into the Ready column after it meets the Definition of Ready and has an estimate from the person doing it.

## 2. Assignment and ownership

| Member | Nominal capacity | Primary ownership | Support / cross-check |
| --- | ---: | --- | --- |
| Tuấn Anh | 128 hours | Project Manager / Team Leader / Timekeeper; assigning roles and work, deadlines, Kanban, escalation, and delivery | Review/merge, confirming Done, stakeholder alignment, and operational decisions |
| Gia Thành | 128 hours | Project Planning & Estimation Analyst / Full-stack Developer; charter, plan, cost/time/resource, estimates, and implementation | Requirement review, UAT, and documentation |
| Hưng | 128 hours | Product Owner / Business Analyst; scope, backlog, acceptance criteria, content/business rules | Discovery and UAT acceptance |
| Luân | 128 hours | Architecture / Technical Lead; ADRs, stack, security/consistency/reliability design | PoC and implementation technical review |
| Hùng | 128 hours | UI/UX Designer / Front-end Developer; research, workflow, prototype, usability, and interface | UI acceptance and accessibility |
| Trí | 128 hours | PoC / Integration & E2E Developer; seed data, integration tests, and technical risk evidence | Core flow implementation |

Each person is responsible for the deliverables assigned in the WBS/backlog; ownership of Product, Architecture, Quality, Security/Privacy, and Release must not be left empty. When building the MVP, the front-end, back-end, QA, DevOps, and content roles are assigned per work package rather than assuming one person per fixed title.

## 3. Expected effort allocation per phase

| Phase | Weeks | Reference committed capacity | Resource focus |
| --- | ---: | ---: | --- |
| Discovery/charter | 1 | 82 hours | Gia Thành, Tuấn Anh, Hưng, Hùng; mentor/student sample |
| Prototype/requirements | 2 | 81 hours | Hưng, Hùng, Gia Thành, Tuấn Anh; requirement and workflow baseline |
| Foundation | 3 | 82 hours | Luân, Trí; auth, schema, CI/CD, test foundation |
| JD intake & analysis | 4 | 81 hours | Hưng, Trí, Hùng, Gia Thành; extraction/OCR, taxonomy, matching, preparation plan |
| Marketplace core loop | 5-6 | 163 hours | Entire team; availability, booking, notification, feedback |
| UAT/release | 7-8 | 164 hours | Gia Thành, Tuấn Anh, Hưng, Trí, Luân; pilot users, defect triage, and release |
| **Total** | **8** | **~653 hours** | |

## 4. Tools and infrastructure

| Need | Baseline choice | Purpose / control |
| --- | --- | --- |
| Backlog and decisions | Trello Kanban/GitHub or equivalent tool | Stories, acceptance, flow status, defects, and decision log |
| Repository | Git + GitHub, protected main, Pull Request review | Version control, review, traceability |
| Design | Figma | Prototype, usability evidence, handoff |
| CI/CD | GitHub Actions or equivalent pipeline | Build, test, deploy; no secrets in the repository |
| Database | Managed/free-tier relational DB per ADR-001 | Transactions, constraints, migrations, backup |
| Notification/meeting | Email provider and external Google Meet/Zoom links | Retry/fallback; meeting provider is not the source of truth |
| Testing | Unit, integration, E2E, UAT checklist | Covers critical workflows and negative authorization tests |
| Documentation | Markdown in the repository | Versioned charter, ADR, plan, test evidence |

Runtime provider names are finalized in ADR-001 in the Architecture decisions table of `docs/Project_Architecture/software_architecture.md`, after the skill matrix/spike; a free tier is only chosen if it still meets the required security, backup, and reliability levels.

## 5. Resource operation rules

- Track actual effort when available, plus blockers, WIP, cycle time, and throughput weekly; reforecast when work stalls or throughput stays low for two weeks.
- Prioritize cutting Should/Could first; never cut access control, consistency, audit, tests, or UAT for the core loop.
- Any change that pushes the forecast beyond ~653 hours or the 1,125,000 VND cash budget needs a change request and a PO/Sponsor decision. Within the 8-week window, only the JD-to-feedback core loop and the required quality controls are prioritized; Should/Could items or anything not needed for the pilot must be pushed after release.
- Pair review for booking concurrency, authorization, notification, and deployment; documentation/ADRs reduce dependence on a single person.

## 6. Resource risks

| Risk | Indicator | Prevention | Contingency |
| --- | --- | --- | --- |
| Lacking concurrency/security skill | Spike/PoC fails or access defects appear | Early spike, ADR, pair review, negative tests | Narrow the workflow, use a suitable managed service |
| Single-member dependency | One person handles blockers/domain | PR review, docs, pairing, WIP limit | Reassign and reduce non-core scope |
| Lacking mentor/student testers | No discovery/UAT slots | Recruit and schedule from week 1 | Controlled concierge pilot |
| Provider/quota failure | Quota/outage alerts | Adapter, retry, monitoring | In-app/manual notification |
| Lower capacity than forecast | Work stalls or low throughput for two weeks | Re-estimate, protect the reserve | Cut Should/Could, ask for a Go/No-Go decision |

## 7. References

- `docs/refs/03-software-project-initiation.md`, slides 008-009: a charter needs governance/resources; RAM/RACI clarifies responsibility.
- `docs/refs/05-1-work-breakdown-structure.md`, slides 025 and 033: the WBS supports estimation/control; it includes only 100% of in-scope work.
- `docs/Project_Vision_and_Scope/Product_Backlog_and_Acceptance_Criteria.md`: 20 Must stories, dependencies, and the Definition of Ready.
