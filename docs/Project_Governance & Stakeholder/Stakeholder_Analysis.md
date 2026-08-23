# STAKEHOLDER ANALYSIS — INTERVIEW PRACTICE PLATFORM

## 1. Summary

The project creates initial value from JD-to-preparation-plan and practice value from the Mentor Marketplace. Governance must protect the Student's JD data, taxonomy/mapping quality, and the experience of both Student and Mentor, while giving the Sponsor/Product Owner enough data to control scope, quality, and feasibility.

## 2. Sponsor

Sponsors: **Lecturers Ngô Huy Biên and Ngô Ngọc Đăng Khoa**; the formal approval record is noted in the Charter when signed.

### 2.1 Sponsor expectations

- Proposal, scope, and baseline have evidence.
- The MVP is completed within the approved time and budget.
- Critical workflows are tested and UAT-covered.
- The team reports risk, change, and blockers in time.
- Go/Pivot/Stop conclusions are based on KPIs, not on feature count.

## 3. Stakeholder register

| ID | Stakeholder | Interest/needs | Power | Interest | Strategy |
|---|---|---|---|---|---|
| ST-01 | Sponsor/lecturers | Learning outcomes, governance, deliverable quality | High | High | Manage closely |
| ST-02 | Gia Thành — Project Planning & Estimation Analyst / Full-stack Developer | Baseline, resources, cost, estimates, and Full-stack implementation | Medium | High | Keep engaged |
| ST-03 | Hùng — UI/UX Designer / Front-end Developer | User flows, prototype, usability, research evidence, and interface | Medium | High | Manage closely |
| ST-04 | Hưng — Product Owner / Business Analyst | Product value, vision, scope, backlog, and acceptance | High | High | Manage closely |
| ST-05 | Trí — PoC / Integration & E2E Developer | Technical feasibility, PoC, integration, end-to-end tests, and verification data | Medium | High | Manage closely |
| ST-06 | Luân — Architecture / Technical Lead | Architecture, ADRs, technology, technical constraints, and PoC support | High in engineering | High | Manage closely |
| ST-07 | Tuấn Anh — Project Manager / Team Leader / Timekeeper | Team operations, deadline and Kanban management, escalation, integration, review/merge, and delivery readiness | High | High | Manage closely |
| ST-08 | Development team | Clear requirements, environment, and timely decisions | Medium | High | Keep engaged |
| ST-09 | Students/candidates | Private JD processing, understandable plan/mapping, and contextual booking | Medium | High | Co-design/test |
| ST-10 | Mentors/HR | Clear JD/topics to practice, manageable schedule, reputation, and suitable feedback | Medium | High | Co-design/test |
| ST-11 | Administrators/moderators | Clear taxonomy/aliases, approval process, reports, and audit | Medium | High | Involve early |
| ST-12 | Hosting/database providers | Correct quota and terms usage | Indirect high | Low | Monitor |
| ST-13 | Extraction/OCR, email/calendar/video providers | Stable integration, privacy/policy compliance, and fallback | Indirect high | Low | Monitor/fallback |
| ST-14 | Legal/privacy advisers | Consent, privacy notice, terms, and data processing | Medium | Medium | Consult |

## 4. Needs, responsibilities, and authority

### Sponsor

- Approve charter, baseline, and major changes.
- Remove blockers beyond team authority.
- Review milestone, risk, and KPI reports.

### Product Owner

- Clarify the value proposition and release goal.
- Order the backlog, accept/reject stories, and decide trade-offs.
- Confirm Go/Pivot/Stop with the Sponsor.

### Project Planning & Estimation Analyst / Full-stack Developer

- Create and update the Charter, Resource Plan, Cost–Time–Resources, and two independent estimates.
- Analyze capacity, baseline, and plan impact to provide PM decision data.
- Contribute Full-stack development in mentor verification, availability, JD service, and notification.

### UI/UX Designer / Front-end Developer

- Maintain user flows, clickable prototype, and handoff aligned with the approved backlog.
- Gather research/usability evidence and state clearly what remains unverified.
- Coordinate with the Product Owner to trace prototype changes to requirements and acceptance criteria.

### PoC / Integration & E2E Developer

- Run core-loop PoCs, seed data, end-to-end tests, and Pass/Fail evidence for technical risks.
- Verify extraction/mapping, booking concurrency, authorization, and reliability against approved gates.
- Coordinate with the architecture/technical lead; a PoC does not by itself change scope or ADRs.

### Architecture / Technical Lead

- Own the technology stack, ADRs, system boundaries, and technical/security constraints.
- Guide PoC and implementation technically while recording Accepted/Pending/Rejected decisions.
- Assess the architecture impact of backlog changes without overriding the Product Owner's priority/acceptance authority.

### Project Manager / Team Leader / Timekeeper

- Assign roles and weekly work, manage deadlines, and track the Kanban flow across prototype, requirements, architecture, PoC, and implementation.
- Make operational decisions, coordinate scope/priority with the Product Owner, handle escalations, and track delivery readiness.
- Perform or assign product integration work: repository foundation, CI quality gate, shared contracts, and end-to-end integration.
- Manage the configuration/document workflow: correct directory tree, owner/reviewer, version, links/evidence, and consistency before merge.
- Organize technical/document reviews and track action items to closure. Hưng, as Product Owner / Business Analyst, still orders the backlog and accepts stories; the Project Manager's operational decisions do not override this acceptance authority.

### Development team

- Estimate, design, develop, test, and update documentation.
- Comply with Definition of Done, security, and privacy controls.
- Raise blockers and technical risks early.

### Students/candidates

- Provide discovery evidence and join usability/UAT.
- Upload only JDs they have the right to use; review/edit text before confirming analysis.
- Provide honest booking goals, respect the schedule, and follow community rules.
- Share only necessary data.

### Mentors/HR

- Provide verification evidence and accurate availability.
- Use the shared JD/preparation-plan context only for the purpose of the booking.
- Run mock interviews within the published scope.
- Submit structured feedback and comply with privacy/community rules.

### Administrator

- Approve mentors/questions, process reports, and manage taxonomy/aliases; do not view private JDs without business authority.
- Keep an audit trail for moderation decisions and booking exceptions.

### Service providers

- Provide hosting, database/storage, extraction/OCR, email, or video meeting per the chosen SLA/quota.
- Must not be treated as the source of truth for bookings or analysis results; the system must maintain internal state, output checks, and fallback.

## 5. Power–Interest matrix

| Group | Stakeholders | Management approach |
|---|---|---|
| High power, high interest | Sponsor, Product Owner, Project Manager/Team Leader, and Architecture/Technical Lead | Frequent communication; request decisions per milestone and coordinate integration |
| High power, low interest | Infrastructure/integration providers | Monitor quota, outages, terms; prepare fallback |
| Low/medium power, high interest | Team, Student, Mentor, Admin | Co-design, demos, research, and periodic UAT |
| Low power, low interest | Public/future partners | Monitor; update when scope expands |

## 6. Baseline decisions and review triggers

- Sponsors: Ngô Huy Biên and Ngô Ngọc Đăng Khoa; formal signatures remain recorded in the Charter.
- Capacity: 6 members × 16 hours/week over 8 weeks, about 653 hours after reserve; do not use the reserve to add scope.
- Pilot: Front-end Intern/Junior; 20 JDs, 12 Students, 4 Mentors, and 12 bookings per PD-01.
- File/OCR/mapping, booking, privacy, meeting, and reminder use PD-02–PD-08 in the Product Backlog.
- Pilot Mentors need identity evidence and a public professional profile or verifiable experience evidence; Admin reviews reason/audit before `Approved`.
- Go when blind-set recall/precision@10 ≥80%, critical tests 100%, no Critical/High defects remain, and the pilot reaches ≥10 Confirmed/≥8 Completed; Pivot/Stop when these are not met after one remediation cycle or when a security/privacy gate must be dropped.
- Any baseline change needs evidence, impact on scope/schedule/cost, and owner approval via change control.

## 7. Communication plan

| Content | Participants | Cadence | Channel | Owner |
|---|---|---|---|---|
| Kanban coordination | Project team | When assigning work, a blocker arises, or a change needs confirming | Messenger + Kanban | Tuấn Anh |
| Integration/document-control review | Tuấn Anh and each deliverable's owner | Twice weekly and before merge | PR + checklist + action items | Tuấn Anh |
| Backlog refinement | PO, BA, team | Weekly | Backlog tool | PO |
| Flow/replenishment review | PO and team | Weekly or when work needs adding/confirming | Kanban + backlog | Tuấn Anh |
| Risk/change review | Sponsor, PO, and PM | Weekly or when thresholds are exceeded | Risk/change log | Tuấn Anh |
| Student research | BA/UX and students | Per research plan | Interview/test | Research owner |
| Mentor review | PO/BA and mentors | Before prototype and pilot | Interview/demo | PO |
| Milestone report | Sponsor and team | Per milestone | Short report | PM |

### 7.1 Communication rules

- Every scope, acceptance, and change decision must be recorded in the shared source.
- Do not put personal data or meeting links in public channels.
- Members raise blockers to the Messenger group when found so Tuấn Anh and the team can decide how to handle them; the team does not set a fixed response time.
- Research notes must separate the team's interpretation from participants' words/evidence.
