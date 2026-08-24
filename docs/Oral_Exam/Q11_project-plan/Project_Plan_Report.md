# Project Plan — Interview Practice Platform

## Document control

| Attribute | Content |
| --------- | ------- |
| Document name | Project Plan — Interview Practice Platform |
| Version | 1.0 |
| Report date | 23/08/2026 |
| Period covered | 29/06/2026–23/08/2026 |
| Owner and plan administrator | Tuấn Anh — Project Manager / Team Leader / Timekeeper |
| Responsible for planning and estimation data | Gia Thành — Project Planning & Estimation Analyst / Full-stack Developer |
| Reviewer | Tuấn Anh |
| Review date | 23/08/2026 |
| Product scope confirmation | Hưng — Product Owner/Business Analyst |
| Sponsor | Lecturers Ngô Huy Biên and Ngô Ngọc Đăng Khoa |
| Status | Reviewed internally; full plan not yet officially approved by the Sponsor |

### Document history

| Document milestone | Date | Content | Person |
| ------------------ | ---- | ------- | ------ |
| Individual planning documents | 09/08–21/08/2026 | The team created and updated the Proposal, Charter, Vision and Scope, Product Backlog, Resource Plan, estimate, cost baseline, feasibility, and ADRs. These are the sources of the Project Plan, not a single consolidated Project Plan version. | Each document's owner |
| Project Plan 1.0 | 23/08/2026 | Tuấn Anh consolidated the source documents, added the actual sequence of events, the pivot decision, Planned–Actual, and evidence limits; and reviewed the differences between the individual sources and the consolidated version. | Tuấn Anh |

Version 1.0 is the team's first official consolidated Project Plan. Because the team previously managed planning content across separate files, the report does not create a fake Project Plan version history for 09/08–21/08.

## 1. Executive summary

Interview Practice Platform is a web MVP that helps candidates prepare for interviews from a specific Job Description (JD). The product connects the steps of entering a JD, extracting or OCR-ing it, confirming the text, analysing requirements, mapping questions, building a study plan, self-practising or booking a Mentor, and receiving feedback.

The project plan was created in the context of the team changing topic mid-course. The team started with Splitly in the eight-week window, from 29/06 to 23/08/2026. After the midterm presentation on 24/07, the team realised this idea was not strong enough on product value, users, and sustainability. The team spent time brainstorming, preliminary-settled on InterviewQuestionBank on 09/08, re-did Initiation and Planning, then implemented the new project from 10/08 to 23/08.

Because InterviewQuestionBank was not tracked from the start of the course window, the team reconstructed four weeks of execution from 27/07 to 23/08. The reconstruction is based on the Splitly execution experience, the new project's backlog, and the lecturer's guidance on the case of missing early tracking data. These four weeks are a **retrospective plan**, not actual history. Actual events and the reconstructed baseline are always presented separately in the report.

The plan uses nominal capacity of 768 hours for six members, keeps a 15% reserve, and caps about 653 hours for the scope. The cash ceiling is 1,125,000 VND; actual cash cost is 0 VND because the team uses only free-tier services. The 606-hour and 650-hour figures are just two historical working forecasts on the old 20 Must stories; the current backlog has 27 mandatory R1 stories, equal to 134 Story Points (SP), so the team does not treat these numbers as a release commitment.

## 2. Context and planning basis

### 2.1 Actual sequence of events

| Date | Event and decision |
| ---- | ------------------ |
| 29/06/2026 | The team started the eight-week project window with the Splitly topic. |
| 24/07/2026 | After the midterm presentation, the lecturers assessed the Splitly idea as weak. The team had entered execution and the risk-management part of the course but had to revisit the product problem. |
| 24/07–09/08/2026 | The team brainstormed many directions but stalled during idea selection. |
| 09/08/2026 | The team preliminary-settled on InterviewQuestionBank and re-did Project Initiation and Project Planning. |
| 10/08/2026 | The team began actual execution for the new project. |
| 12/08/2026 | The team talked directly with the theory lecturer; the InterviewQuestionBank direction was assessed as suitable to continue. |
| 13/08/2026 | The team formally confirmed the "web interview" direction and prepared to divide the work. |
| 14/08/2026 | The team talked directly with the practical lecturer. He suggested prioritising the candidate pain point and narrowing the PoC to JD → OCR → Question Bank. |
| 16/08/2026 | Tuấn Anh reconstructed the Kanban from the Product Backlog to organise tasks that complete User Stories. |
| 23/08/2026 | The end of the eight-week course window and the consolidation of the Project Plan. |

The two lecturer discussions were face-to-face with no screenshot or minutes. The report records the content as confirmed by the members, not as a verbatim quotation or an official approval.

### 2.2 Why the team stopped investing in Splitly

Before the team changed topic, lecturer Biên raised three issues that helped the whole team reconsider Splitly:

- Users could record directly who owes whom and how much, and settle it themselves, instead of installing an app or opening a web page to enter a bill and get back a simple calculation.
- The team had no real users or data showing users were willing to download and use the product.
- The team planned to offer it for free but could not explain the source of profit or the mechanism to sustain the product if taken to market.

These issues showed that Splitly did not yet have a strong enough value proposition. So the team did not just rename the topic; it went back to the Initiation and Planning steps to redefine the problem, stakeholders, workflow, scope, and resources.

### 2.3 Inputs to the Project Plan

The Project Plan consolidates the following sources:

| Source | Role in the plan |
| ------ | ---------------- |
| Project Proposal | Defines the problem, value, scope, continuation conditions, and resource ceiling. |
| Project Charter | Defines the Sponsor, roles, milestones, constraints, and approval authority. |
| Vision and Scope | Holds the product boundary and target workflow. |
| Product Backlog and Acceptance Criteria | Provides 27 mandatory R1 stories, 134 SP, dependencies, acceptance criteria, Definition of Ready, and Definition of Done. |
| Resource Plan | Defines capacity, reserve, ownership, tools, and resource risk. |
| Estimation Comparison | Provides two independent forecasts and the limits of the old 20 Must-story data. |
| Cost–Time–Resources Baseline | Defines the reference schedule, effort, cost, and escalation threshold. |
| Feasibility Study, Architecture, and ADRs | Sets the Go/No-Go conditions, technical controls, and quality gate. |
| Splitly history, team discussions, and lecturer feedback | Explains the reason for the pivot, how the MVP was narrowed, and the basis of the reconstructed schedule. |

## 3. Objectives and success criteria

### 3.1 Project objectives

The project's objective is to validate a traceable interview-preparation process from JD to improvement action:

```text
JD → extraction/OCR → confirm text → requirement analysis
   → Question Bank mapping → preparation plan
   → self-practice or Mentor booking → feedback → update plan
```

The pilot targets Front-end Intern/Junior candidates in Vietnam, initially with JavaScript, TypeScript, and React. The preparation plan must create value on its own even before a candidate books a Mentor.

### 3.2 Metrics and evaluation thresholds

| Objective | Metric | Proposed threshold |
| --------- | ------ | -----------------: |
| Confirm the pain point | Discovery sample confirms at least one core pain | ≥70% |
| Complete JD-to-plan | Candidate enters a JD, edits the text, and produces a plan | ≥80% |
| Analysis quality | Blind requirement recall and precision@10 | ≥80% |
| Traceability | Result has sufficient source, topic, reason, and version | 100% |
| Activation from plan | Candidate opens a question or the Mentor flow from the plan | ≥80% |
| Pilot booking | Valid / confirmed / completed bookings | 12 / ≥10 / ≥8 |
| Actionable feedback | Completed booking has strengths, weaknesses, and next steps | ≥90% |
| Perceived value | Usefulness score and before–after confidence | ≥4/5; average increase ≥1/5 |
| Technical quality | Critical workflow passes; defects before UAT | 100%; 0 Critical/High |

These are proposed thresholds for a narrow pilot, not actual results already achieved.

## 4. Scope and deliverables

### 4.1 MVP scope

- Authentication and role-based access for Student, Mentor, and Administrator.
- JD intake by text or PDF/PNG/JPEG; direct extraction or Vietnamese/English OCR.
- Let the user review and edit the text after extraction.
- Identify requirements, normalise the taxonomy, and map onto the Question Bank with an explanation.
- Build a preparation plan traceable to the JD, requirements, and question version.
- Support the Question Bank, bookmarks, and basic practice status.
- Manage Mentor profiles, verification, and availability.
- Book, reschedule, or cancel; use external meeting links.
- Send booking-supporting notifications without breaking the main transaction.
- Collect rubric-based feedback, update the plan, and provide minimal moderation.

### 4.2 Out of scope

- AI interviewer, interview chatbot, or automatic grading.
- Voice/video analysis, integrated recording, or transcription.
- Integrated video calls; the MVP uses external meeting links or manual entry.
- Payment, escrow, payout, and commission.
- Native mobile, ATS/job application, general OCR, or a multi-country marketplace.
- ML recommendation without a deterministic guardrail.

Gemini may only support analysis or drafting behind a feature flag and validation. Rule/manual flows must keep working when a provider fails.

### 4.3 How the solution changed

The original InterviewQuestionBank idea leaned toward the Mentor: a Mentor accepts bookings, conducts interviews, sends feedback, and might use AI for mock interviews. The solution already had a Question Bank but lacked the chain of JD intake, requirement analysis, question selection, and recommending a suitable Mentor to the candidate.

After the 14/08 feedback, the team centred on the pain point "candidates do not know what to study for a specific JD." The new PoC consists of JD intake, extraction/OCR, text editing, skill recognition, taxonomy normalisation, and question mapping. The team kept the Mentor flow already built on a separate branch, then combined the two flows in the current MVP.

## 5. Planning approach

### 5.1 Key assumptions

| Assumption | Use and limit |
| ---------- | ------------- |
| Project window remains eight weeks | Keep the course constraint 29/06–23/08 even though the new project only actually executed for two weeks. |
| Six members give 16 hours/week | Used to compute capacity; not a commitment to work overtime. |
| 15% reserve | Protects discovery, review, test, defect, documentation, learning new technology, and risk; not used to add scope. |
| Four weeks of reconstructed execution | Used for scheduling and backlog allocation; does not replace actual tracking. |
| Splitly experience is reference data | Used to estimate when InterviewQuestionBank early data is missing; must not be called historical actual of the new project. |
| Pilot uses free tiers and volunteer Mentors | Does not yet demonstrate unit economics or commercial operating cost. |

### 5.2 Six-phase baseline

| Phase | Reference time range | Exit criteria |
| ----- | -------------------- | ------------- |
| Discovery/Charter | 29/06–05/07 | Problem evidence, Charter, and resource baseline. |
| Prototype/Requirements | 06/07–12/07 | Workflow, backlog, and prototype accepted internally. |
| Foundation | 13/07–19/07 | Architecture, auth, CI/CD, and data foundation. |
| JD intake & analysis | 20/07–26/07 | JD entry, OCR, text confirmation, taxonomy mapping, and preparation plan pass. |
| Mentor core loop | 27/07–09/08 | End-to-end booking-to-feedback passes. |
| UAT/Release | 10/08–23/08 | UAT evidence exists, no Critical/High defects, and pilot is ready. |

The table above is a planning baseline for the new project in the eight-week window. It does not describe the actual historical sequence, since the team was still executing Splitly before 09/08.

### 5.3 Four-week reconstructed execution

| Reconstructed week | Focus User Stories | Meaning |
| ------------------ | ------------------ | ------- |
| W1 — 27/07–02/08 | Register/login, roles, JD entry, extraction, text editing, Student/Mentor profiles | Foundation and intake. |
| W2 — 03/08–09/08 | Question Bank/taxonomy management, JD analysis, requirement mapping, preparation plan generation, Mentor approval and availability management | Content and Mentor supply preparation. |
| W3 — 10/08–16/08 | Review/find questions, practice, find a Mentor, attach a JD or plan to a booking, send/handle booking requests, external meeting link | Core transaction; partly overlaps actual execution. |
| W4 — 17/08–23/08 | Cancel/reschedule, notification, feedback, review, and preparation plan update | Complete the loop and stabilise release. |

On 16/08, Tuấn Anh reconstructed the Kanban from the Product Backlog. The backlog provides the US code, priority, release, dependency, SP, acceptance criteria, and Definition of Ready/Done. The assignee, execution week, and `Ready/Done` dates on the board are reconstructed data, not present in the backlog.

The Kanban has a Product Backlog; Ready with WIP 6; In Progress with WIP 6; Review with WIP 3; and four weekly Done columns. Trello only manages the tasks needed to complete the User Stories in the backlog. The PoC is not on Trello.

## 6. Resources and responsibility

### 6.1 Capacity

| Item | Value |
| ---- | ----: |
| Members | 6 |
| Duration | 8 weeks |
| Hours/person/week | 16 hours |
| Nominal capacity | 6 × 8 × 16 = 768 hours |
| Reserve | 15% = 115.2 hours |
| Capacity capped for scope | About 653 hours |
| Plan review cadence | Weekly, or when the baseline/Kanban flow changes significantly |

### 6.2 Ownership

| Member/role | Primary ownership | Coordination responsibility |
| ----------- | ----------------- | --------------------------- |
| Tuấn Anh — Project Manager / Team Leader / Timekeeper | Operations, role assignment, deadlines, Kanban, escalation, integration, and delivery | Scope/priority coordination, review/merge, confirm Done, and stakeholder alignment. |
| Gia Thành — Project Planning & Estimation Analyst / Full-stack Developer | Charter, estimation, plan, cost/time/resource, and Full-stack implementation | Requirement review, UAT, and documentation. |
| Hưng — Product Owner / Business Analyst | Vision, scope, backlog, acceptance criteria, and business rules | Discovery, value prioritisation, and UAT acceptance. |
| Luân — Architecture / Technical Lead | ADRs, stack, security, consistency, and reliability design | Technical review for the PoC and critical flows. |
| Hùng — UI/UX Designer / Front-end Developer | Research, workflow, clickable prototype, usability, and interface | UI acceptance and accessibility. |
| Trí — PoC / Integration & E2E Developer | PoC, seed data, integration testing, and technical-risk evidence | Core flow implementation. |
| Sponsor | Approve the Charter, baseline, and major changes | Go, Pivot, or Stop decisions at key gates. |

Front-end, back-end, QA, DevOps, and content roles are assigned by work package; the team does not assume each title belongs to only one person. A story is only pulled into Ready when it meets its Definition of Ready and the implementer has joined the estimate.

## 7. Effort and cost plan

### 7.1 Effort

Two methods were used to cross-check:

| Method | Historical result | Use |
| ------ | ----------------: | --- |
| Bottom-up + Three-point/PERT | 606 hours after 15% contingency | Working forecast traceable by epic/work package. |
| Top-down Count–Compute + expert judgment | 650 hours after 15% contingency | Conservative guardrail against the ≈653 hours capacity. |

The two calculations used the 20 Must stories at inception. The backlog locked afterwards has 27 mandatory R1 stories, 134 SP. Therefore:

- 606/650 hours are not actual.
- 606/650 hours are not yet a commitment for the current backlog.
- The 47-hour difference between 606 and capacity is not spare room to add scope.
- Before a release commitment, the team needs Planning Poker on the current backlog, an updated WBS/PERT, and a check with two independent estimates.

### 7.2 Direct cash baseline

| Cost group | Basis | Baseline (VND) |
| ---------- | ----- | -------------: |
| Domain | One domain for a one-year pilot | 300,000 |
| Hosting, database, storage | Free tier for dev/small pilot | 0 |
| Email/notification and meeting | Free tier, external meeting link | 0 |
| Design, CI/CD, repository | Education/free-tier tools | 0 |
| Discovery/UAT | 12 thank-you tokens × 50,000 | 600,000 |
| Security/monitoring | Free tools suitable for an MVP | 0 |
| Direct cash | | 900,000 |
| Cash contingency | 25% of direct cash | 225,000 |
| **Cash ceiling** | | **1,125,000** |

This is an envelope plan dated 14/08/2026, not actual spending or vendor quotes. As of 23/08/2026, **actual cash cost is 0 VND** because the team used only free-tier packages and did not buy a domain or spend the discovery/UAT thank-you amount per the baseline. If any purchase occurs after the report date, the owner must record the price source, the check time, and the cancellation conditions.

The reference labour value is 606 hours × 50,000 VND/hour = 30,300,000 VND. The 50,000 VND/hour rate is only an academic assumption by the team, not real wages or a market quote.

## 8. Development method and operating mechanism

The team applies an adaptive approach within the course limits:

1. The Product Owner manages the backlog and acceptance criteria; Tuấn Anh, as Project Manager / Team Leader / Timekeeper, runs delivery, deadlines, Kanban, and risk; Gia Thành prepares cost, resource, estimate, and baseline data to support decisions.
2. The team prioritises Must stories that serve the core JD-to-feedback loop; Should/Could are only taken when the reserve and critical flow remain safe.
3. The team runs a weekly Kanban. Tuấn Anh reviews WIP, blockers, quality, and forecast-to-complete each week, or whenever a change needs to be locked.
4. The Kanban limits WIP to avoid opening too much at once: Ready 6, In Progress 6, and Review 3.
5. Git/GitHub manages versioning, Pull Requests, and traceability. CI checks lint, typecheck, OpenAPI drift, migration, seed, build, and secret scan.
6. Figma stores prototype and usability evidence; Markdown in the repository stores the Proposal, Charter, ADRs, plans, and test evidence.
7. The PoC reduces technical uncertainty but is not on Trello. Trello only breaks down and tracks tasks that complete the User Stories in the backlog.

## 9. Quality, risk, and change management

### 9.1 Quality gate

- Only `PUBLISHED` Questions and `APPROVED` Mentors are included in the relevant results.
- Users must confirm the text after extraction/OCR.
- Booking must prevent double booking, enforce object authorization, and record an audit.
- Notification errors must not lose an already-recorded booking.
- Critical workflows must have appropriate unit, integration, E2E, or UAT evidence.
- Do not release the pilot while Critical/High defects remain.

### 9.2 Key risks

| Risk | Signal | Response |
| ---- | ------ | -------- |
| Not enough Mentors | Fewer than 4 Mentors or fewer than 3 slots/person | Early outreach, concierge pilot, and keeping the preparation plan valuable on its own. |
| Extraction/mapping fails | Recall or precision@10 below 80% | Correction gate, labelled corpus, taxonomy review, and rule fallback. |
| AI/provider error | Schema/evidence fail, quota or latency rising | Feature flag, validation, and manual fallback. |
| Wrong booking or data exposure | Double booking, invalid transition, or unauthorised access | Transaction, unique constraint, audit, and negative test. |
| Scope exceeds the limit | Adding AI/video/payment or forecast over 653 hours | Cut Should/Could, raise a change request, and rebaseline. |
| Missing tracking data | No timesheet, historical throughput, or original status | Label as reconstructed; do not infer as actual. |

### 9.3 Reforecast and escalation thresholds

The PM must reforecast and escalate to the PO/Sponsor when any of these occurs:

- the forecast exceeds 23/08/2026;
- the forecast effort exceeds about 653 hours;
- committed/actual cash risks exceeding 1,125,000 VND;
- a critical PoC fails a gate;
- work is blocked or throughput stays low for two weeks;
- a change touches core scope, privacy, authorization, booking consistency, or release quality.

A change request must state the cause, the impact on scope/time/cost/resource/risk, the alternatives, and the approver. The reserve does not automatically grant authority to add scope.

## 10. Plan use, updates, and status

The Project Plan is used to align on what the team will do, within which limits, and who is responsible. The Product Backlog translates scope into User Stories and acceptance criteria; the Resource Plan translates roles into ownership; Architecture and ADRs specify the technical constraints; Trello breaks User Stories into implementation tasks.

During 10/08–23/08, the team used the new baseline to implement items in the JD-first and Mentor flows. The key changes were:

1. Stopped further investment in Splitly and returned to Initiation/Planning.
2. Moved from a Mentor-first/AI mock-interview direction to candidate-first.
3. Added JD intake, OCR, correction, requirement analysis, Question Bank mapping, and preparation plan.
4. Kept the existing Mentor flow to integrate later instead of discarding all the work already done.
5. Removed the AI interviewer, integrated video, payment, native mobile, and ATS from the MVP.
6. Reconstructed the Kanban on 16/08 from the backlog to describe the distribution of User Stories across four weeks.

### 10.1 Planned–Actual comparison from the backlog and Reconstructed Kanban

The Product Backlog sets an R1 baseline of 27 mandatory User Stories, equal to 134 SP. The Reconstructed Kanban screenshot shows 26 mandatory User Stories in the four Done columns, equal to 129 SP. So the completion recorded on the board is **26/27 stories and 129/134 SP, both about 96.3%**.

| Assigned → Done range on the board | Mandatory User Stories completed | Stories | SP |
| ---------------------------------- | -------------------------------- | -------: | -------: |
| W1 — 27/07–02/08 | US-01, US-02, US-24, US-25, US-26, US-03, US-07 | 7 | 34 |
| W2 — 03/08–09/08; US-09 separately ran to 16/08 | US-27, US-18, US-28, US-29, US-08, US-09 | 6 | 34 |
| W3 — 10/08–16/08; US-04 marked done on 11/08 | US-04, US-05, US-06, US-10, US-30, US-11, US-12, US-14 | 8 | 34 |
| W4 — assigned from 17/08, marked done within 18/08–23/08 | US-13, US-15, US-17, US-16, US-19 | 5 | 27 |
| **Total Done** | **26 mandatory User Stories** | **26** | **129** |

US-20, "Handle reports and exceptions", remains in the Product Backlog with 5 SP. Two expanded R1 stories US-21–US-22, totalling 8 SP, and one Future story US-23, 8 SP, were not implemented; these three are not part of the mandatory 134 SP. At the time of the screenshot, the Ready, In Progress, and Review columns all had no cards.

The dates on the board are counted from when a member received/was assigned the task to when the card was marked Done. They reflect the **elapsed time of the task on the Reconstructed Kanban**, not actual per-hour effort. The team has no timesheet to convert these date ranges into person-hours. In addition, the board was reconstructed on 16/08, so the figures describe the state the team recorded retrospectively and do not prove every card was updated in real time from 27/07.

### 10.2 Status as of 23/08/2026

- The Proposal version 0.4 on 21/08 is the internally-finalised proposal.
- This Project Plan consolidates scope, schedule, cost, resource, ownership, and the pivot decisions.
- Tuấn Anh reviewed the consolidated version on 23/08 by comparing it against the individual planning documents and the facts the team confirmed.
- The plan does not yet have formal baseline approval from the Sponsor.
- Actual cash cost is 0 VND; the board records 129/134 mandatory SP as Done; the team has no actual per-hour effort.
- The four weeks on the Kanban are a disclosed reconstruction, not original tracking.

## 11. Evidence and verification limits

### 11.1 Scope decisions

**Figure 1 — Candidate-first MVP scope after prioritising JD-based preparation value.**

![Candidate-first MVP scope](img/Q11-01-mvp-scope-candidate-first.png)

**Figure 2 — The team formally confirms the web-interview idea on 13/08/2026.**

![Team confirms the web-interview idea](img/Q11-02-team-confirms-interview-idea.png)

**Figure 3 — A member summarises the practical lecturer's feedback on 14/08/2026.**

![Summary of feedback on the candidate pain point](img/Q11-03-instructor-feedback-summary.png)

**Figure 4 — The team announces the scope update and prepares a Pull Request for review.**

![Scope and plan update announcement](img/Q11-04-team-updates-scope-and-plan.png)

**Figure 5 — Candidate PoC and the decision to keep a separate Mentor flow.**

![Candidate PoC and Mentor flow](img/Q11-05-candidate-poc-and-mentor-split.png)

### 11.2 Reconstructed execution plan

**Figure 6 — Reconstructed Kanban organising tasks by User Story across four weeks.**

![Reconstructed Kanban by User Story](img/Q11-06-reconstructed-kanban-user-stories.png)

The first five figures are internal discussions after the feedback sessions. They show the team summarised the feedback, agreed on the direction, and updated the scope; they are not screenshots of the lecturers approving the Project Plan. Figure 6 is a board Tuấn Anh reconstructed on 16/08; the board does not prove the cards were updated at the correct time in the past.

## 12. Plan assessment and conclusion

On 23/08/2026, Tuấn Anh reviewed Project Plan 1.0 by comparing the consolidated content against the Proposal, Charter, Vision and Scope, Product Backlog, Resource Plan, Estimation Comparison, Cost–Time–Resources, Feasibility Study, ADRs, Git history, and the Reconstructed Kanban. The review focused on completeness, consistency, feasibility, traceability, and the separation between plan, actual, and reconstructed data.

The review found six key differences between the individual documents and the Project Plan for submission:

1. Scope, schedule, cost, resource, and ownership information was scattered, with no consolidated Project Plan report.
2. The eight-week course window, two-week actual execution, and four-week reconstructed schedule could easily be read as the same kind of data.
3. The two estimates of 606/650 hours used the old 20 Must stories, while the current backlog has 27 mandatory stories and 134 SP.
4. Trello only tracks tasks that complete User Stories; the PoC is outside Trello and the board was reconstructed on 16/08.
5. The 1,125,000 VND cash ceiling is a baseline, while actual cash cost is 0 VND because the team used free tiers.
6. The lecturer feedback confirmed the direction of the idea, not the official approval of the whole Project Plan.

Tuấn Anh addressed these differences in version 1.0: consolidated the documents, separated the three time layers, added a Planned–Actual table, stated the limits of the estimate and Kanban, updated actual cash, added scope-change evidence, and kept the Sponsor status as not yet approved. After review, the Project Plan meets the governance purpose at an internal baseline level: it has objectives, scope, schedule, effort, budget, ownership, quality gate, risk, change control, and change evidence.

The biggest limitation is actual progress and effort data. The team only executed InterviewQuestionBank for two weeks, while the plan must describe the eight-week window. The four-week reconstruction helps explain how the backlog was allocated but does not replace a timesheet, historical throughput, burndown, or a board updated at execution time. The 606/650-hour estimates are also out of step with the backbone version. Actual cash, however, was confirmed by the team as 0 VND because only free tiers were used.

Therefore the plan's recommendation is **continue conditionally**. Before treating this as a release commitment, the team needs to update the estimate for the 27 R1 Must stories/134 SP, complete the PoCs and quality gate, then ask the PO/Sponsor to approve the baseline or decide Go, Pivot, or Stop.

## 13. Confirmation and approval

| Role | Person in charge | Confirmation content | Status |
| ---- | ---------------- | -------------------- | ------ |
| Project Manager / Team Leader / Timekeeper | Tuấn Anh | Operations, deadlines, Kanban, risk, integration, and readiness | Reviewed 23/08/2026 |
| Project Planning & Estimation Analyst / Full-stack Developer | Gia Thành | Baseline, cost, resource, estimate, and responsible implementation | Awaiting confirmation |
| Product Owner / Business Analyst | Hưng | Objectives, scope, backlog, and acceptance | Awaiting confirmation |
| Sponsor | Ngô Huy Biên | Baseline and major changes | Awaiting official approval |
| Sponsor | Ngô Ngọc Đăng Khoa | Baseline and major changes | Awaiting official approval |

## 14. References

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
