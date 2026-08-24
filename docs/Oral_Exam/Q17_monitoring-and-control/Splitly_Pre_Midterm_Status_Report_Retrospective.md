# Splitly Pre-Midterm Status Report — Retrospective

## 1. Report information

| Attribute | Content |
| --------- | ------- |
| Project | Splitly — Smart Expense Sharing Platform |
| Reporting period (reconstructed) | 13/07–19/07/2026, the week before the midterm session on 24/07/2026 |
| Retrospective created | 23/08/2026 |
| Compiled by | Tuấn Anh |
| Overall status | **At Risk (Amber)** |

> **Disclosure:** The team did not produce a status report during 13/07–19/07. This report was reconstructed on 23/08 from the Splitly document set the team confirmed was used before the midterm, and from what happened after the presentation. It does not replace the board snapshot, timesheet, or minutes that would have been produced at the time.

## 2. Executive summary

By the week before the midterm, Splitly had most of its baseline in document form: a Project Charter dated 15/07, a Proposal dated 16/07, plus Vision & Scope, backlog, acceptance criteria, workflow, prototype, architecture, Resource Plan, Cost–Time–Resources, and a Feasibility Study [S1–S9]. These artifacts clarified the bill-splitting problem, the MVP scope, and the technical direction.

However, all sources describe Splitly as a new or proposed baseline; they do not demonstrate completed functionality [S1, S3, S4]. The team also had no board history, timesheet, or test results from which to compute a real percentage complete. For that reason the pre-midterm status is assessed as **At Risk**: the planning had formed, but the appeal of the idea, the readiness for use, and the sustainability model were not strongly validated.

## 3. Scope and outputs produced

| Output group | Provable status | Source |
| ------------ | --------------- | ------ |
| Project initiation | Charter 1.0 at proposed-baseline status, pending approval; sponsor recorded as Naver, but PM/PO and the remaining signatures are TBD | [S1] |
| Business proposal | Proposal 2.0 draft describing the problem, existing tools, competitors, market gap, and proposed value | [S2] |
| Product baseline | Vision, MVP scope, 21 User Story backlog, and acceptance criteria described | [S3], [S4] |
| Workflow and prototype | Current/future workflow and prototype for both manual and Gemini-assisted bill entry | [S5], [S6] |
| Technical planning | Modular monolith architecture on React/Node/MongoDB, with Gemini/VietQR/email adapters proposed | [S7] |
| Resource, cost, feasibility | Six-person plan with capacity, projected cost, and a Conditional Go conclusion | [S8], [S9], [S10] |

These statuses reflect document completeness. There is insufficient evidence to convert them into a software completion percentage or to claim the MVP ran end-to-end.

## 4. Plan assessment against the real context

| Aspect | Planned in the Splitly documents | Retrospective assessment |
| ------ | -------------------------------- | ------------------------ |
| Time | Ten weeks, 120 person-days / 960 hours [S1, S8, S9] | Does not match the eight-week course window (29/06–23/08) the team confirmed. The baseline needs reconciling before it is used to commit to delivery. |
| Scope | Authentication, groups, three bill-splitting modes, Gemini OCR, VietQR, payment confirmation, reminders, notifications, and history [S1, S3, S4] | Scope is large relative to the time available, and there is no actual tracking to demonstrate feasibility of completion. |
| Cost | USD 360 for six Codex Plus accounts, cap USD 432 [S1, S9] | This is a forecast, not actual cash. The documents contain no invoices or actual cost. |
| Technical feasibility | Feasibility Study concluded Conditional Go if MVP is protected, an early PoC is done, and a manual fallback is kept [S10] | There is a technical control direction, but none of the go/no-go gates have execution results in the document set. |
| Market feasibility | Proposal argues for the receipt-to-settlement flow and VietQR [S2] | No evidence that real users are ready to switch from notes/chat/calculator or to install the product; revenue/sustainability is not demonstrated. |

## 5. Key issues and risks

1. **Business-value risk:** the benefit of a standalone app does not clearly exceed the cost to the user of opening a web/app and entering bills, when they could instead quickly record who owes whom and how much.
2. **Adoption risk:** no real users have downloaded or used the product; the proposal stops at argumentation and competitor benchmarks.
3. **Sustainability risk:** the team planned to offer the product free but did not identify a revenue source or a reason to keep the product running after the course.
4. **Schedule risk:** the ten-week baseline does not match the eight-week course window.
5. **Scope risk:** many interdependent capabilities, OCR, financial calculation, payment status, and notifications, while there is no reliable actual progress.
6. **Technical and data risk:** the Feasibility Study itself flags high risk in correctness, OCR/provider, secrets, privacy, and external-service availability [S10].

The first three risks were only clearly identified after direct critique from the lecturer during the midterm session; accordingly this is a retrospective assessment, not an issue log the team produced before 24/07.

## 6. Decisions and actions after the reporting period

After the midterm presentation, the team recognised that Splitly was not strong enough on business value and usability. The team stopped treating the Splitly baseline as a suitable execution plan and returned to seeking a new idea. The brainstorming phase ran until 09/08; after settling on InterviewQuestionBank, the team re-did Project Initiation and Project Planning and then continued execution in the remaining time.

| Control action | Outcome |
| -------------- | ------- |
| Stop committing to scaling Splitly | Avoided further investment in an unconfirmed business case |
| Return to ideation and idea assessment | Used the critique on problem, alternatives, adoption, risk, and sustainability as a screening filter |
| Chose InterviewQuestionBank | Moved to the pain point of JD-based interview preparation |
| Redid Initiation and Planning | Created a new Charter, Proposal, backlog, architecture, resource/cost plan, and scope |

## 7. Data limitations

- No status report was produced during the week 13/07–19/07.
- No dated Splitly board snapshot or timesheet exists.
- No reliable actual cost, actual effort, or software completion percentage.
- The number of documents is not used as a substitute for product completion percentage.
- Documents other than the Charter and Proposal do not state dates clearly in their content; placing them in the pre-midterm set is based on the team's confirmation.

## 8. Internal sources

- **[S1]** `F:/Obsidian/Uni/QLDUPM/Spiltly/docs/Project_Governance & Stakeholder/Project_Charter.md` — Document Control, Objectives, Scope, Milestones, Risks.
- **[S2]** `F:/Obsidian/Uni/QLDUPM/Spiltly/docs/Project_Proposal/Project_Proposal_Draft.md` — Problem Statement, Competitor Context, Business Value.
- **[S3]** `F:/Obsidian/Uni/QLDUPM/Spiltly/docs/Project_Vision_and_Scope/Project_Vision_and_Scope.md` — Product Positioning, Goals, MVP Scope, Constraints.
- **[S4]** `F:/Obsidian/Uni/QLDUPM/Spiltly/docs/Project_Vision_and_Scope/Product_Backlog_and_Acceptance_Criteria.md` — release boundary, 21 User Stories and acceptance criteria.
- **[S5]** `F:/Obsidian/Uni/QLDUPM/Spiltly/docs/Project_Vision_and_Scope/Current_State_Workflow.md` and `Future_State_Workflow.md`.
- **[S6]** `F:/Obsidian/Uni/QLDUPM/Spiltly/docs/Project_Prototype/Prototype_Workflow.md`.
- **[S7]** `F:/Obsidian/Uni/QLDUPM/Spiltly/docs/Project_Architecture/software_architecture.md`.
- **[S8]** `F:/Obsidian/Uni/QLDUPM/Spiltly/docs/Project_Resource_Plan/ResourcePlan.md`.
- **[S9]** `F:/Obsidian/Uni/QLDUPM/Spiltly/docs/Project_Resource_Plan/Cost_Time_Resources.md`.
- **[S10]** `F:/Obsidian/Uni/QLDUPM/Spiltly/docs/Project_Feasibility/feasibility.md`.
