# INTERVIEWQUESTIONBANK

## Project Lessons Learned Report

- **Version:** 1.0
- **Release date:** 23/08/2026
- **Owner:** Tuấn Anh — Project Manager / Team Leader / Timekeeper
**Status:** Reviewed and agreed internally

---

## 1. Purpose and scope

This report consolidates the reusable lessons from executing Splitly and the pivot to InterviewQuestionBank. The document keeps only lessons the team confirmed, each with a real event, cause, impact, action, and responsible person.

The team does not require every member to have their own lesson. Duplicated ideas are merged into two shared lessons: assessing feasibility at the initiation stage, and controlling secrets/generated dependencies in the repository.

## 2. Basis for the document

Tuấn Anh compiled the document starting 20/08/2026 and finalised it on 23/08/2026. The main sources are the Project Charter, Project Proposal, Project Plan, Product Backlog, the reconstructed Kanban, Git/PR/CI, brainstorm screenshots, and direct feedback from lecturers Biên and Khoa.

For each lesson, the team cross-checked:

- the event and evidence;
- the cause and impact;
- what to keep or change;
- the action, owner, deadline, and measurement;
- confirmation from those involved.

Tuấn Anh and the relevant members reviewed each section. The team usually confirmed over Messenger as soon as a section was complete, without a separate retrospective minutes document. All members agreed with version 1.0; Tuấn Anh made the final decision.

## 3. Lessons Learned Register

### LL-01 — Assess feasibility during Initiation

**Event.** The team started with Splitly but did not analyse feasibility, use value, and product potential deeply enough. After midterm feedback, the team went back to looking for a topic but still had not settled on an idea by week 7. Views differed between members, and some members did not proactively propose a way out.

Tuấn Anh organised a brainstorm and used objective evaluation questions: how the product replaces existing tools, whether users are willing to switch, which solutions already exist, what risks could arise, and whether the idea fits the remaining time. The team also requested direct feedback from lecturers Biên and Khoa, then settled on InterviewQuestionBank, focused on candidates.

**Impact.** The team had to go back to Initiation and Planning, redoing the Charter, Proposal, and Project Plan. The actual execution window for the new project was only from 10/08 to 23/08. However, the re-evaluation helped the team understand feasibility more deeply and identify a clearly valuable PoC: supporting learners in improving how they answer interviews and recognising what to focus on to be rated highly.

**Lesson.** Feasibility must be assessed before settling on a topic and the plan baseline. An idea should not be accepted just because it is technically buildable; the team must also check the real problem, alternatives, motivation to use, risk, value, and time constraints.

**Action for the next project.** Add a Feasibility Gate at the end of Initiation. Before approving a Charter or Proposal, the team must have an idea comparison scorecard, an internal review, and early confirmation from the appropriate stakeholder.

- **Owner:** Tuấn Anh.
- **Deadline:** Before the end of Initiation for the next project.
- **Measurement:** A reviewed decision matrix exists, and the team does not have to return to Initiation because the core value was not validated.

**Status:** Accepted; applied when choosing InterviewQuestionBank.

### LL-02 — Do not commit secrets and generated dependencies to the repository

**Event.** In Trí's pull request, the `.env` file containing credentials and the `node_modules` directory were pushed to the repository. Tuấn Anh found this during review along with the CI/secret-scan process. The cause was a missing self-check before push and an incomplete ignore rule.

**Impact.** Credentials were exposed and the repository grew unnecessarily. The team had to remove the files, revoke the old credentials, and create new keys.

**Lesson.** Secrets must stay outside version control; generated dependencies must be rebuilt from the manifest and never committed. Manual review needs to be combined with ignore rules and automatic secret scanning.

**Action completed.** The team removed `.env` and `node_modules`, revoked the old key, created a new key, updated `.gitignore`, fixed the Gitleaks configuration, and re-ran CI. The next run showed both `quality` and `secret-scan` passing with no leak detected. The incident did not recur.

- **Owner:** Trí.
- **Deadline:** Completed during 16–20/08/2026.
- **Measurement:** No recurrence; secret scan passes after the fix.

**Status:** Closed.

## 4. Quality assessment and control

The register is considered complete when each lesson has a specific event, a verifiable source, a cause, an impact, an action, an owner, a deadline, and a measurement. The writing focuses on systems and changeable behaviour, and does not use the document to blame individuals.

Internal review results:

| Criterion | Result |
| --- | --- |
| Event and source | Pass |
| Cause and impact | Pass |
| Action, owner, deadline | Pass |
| Evidence of application | Pass |
| Team agreement | Pass |
| Separate retrospective minutes | None; the team confirmed over Messenger |
| User data for PoC effectiveness | Not yet available; no quantitative claim made |

The team will track improvement effectiveness in the next project using **cycle time on Kanban**, not using sprint or velocity as a mandatory metric.

## 5. Evidence appendix

### 5.1 Brainstorm and idea assessment

![Brainstorm and idea assessment](img/Q21-01-brainstorm-idea-evaluation.png)

*Figure 1 — Evidence of the final review/brainstorm to choose an idea based on lecturer feedback and team experience.*

### 5.2 Secret incident and control result

![PR with env and node_modules](../Q16_team-management/img/Q16-02-pr3-env-node-modules-redacted.png)

*Figure 2 — Pull request containing `.env` and `node_modules`; sensitive data in the saved file was redacted.*

![CI passing with no leaks detected](../Q17_monitoring-and-control/img/Q17-06-ci-success-no-leaks.png)

*Figure 3 — CI after the fix: quality and secret-scan pass, no leak detected.*

## 6. Version history

| Version | Date | Content | Updated/reviewed by |
| --- | --- | --- | --- |
| 0.1 | 20/08/2026 | Compiled a draft from documents, Git, PR, and CI. | Tuấn Anh |
| 1.0 | 23/08/2026 | Settled on two lessons; added action, owner, measurement criteria, and evidence. | Tuấn Anh and those involved; Tuấn Anh made the final call |

## 7. Verification sources

- Finalised version of the Project Proposal and Project Plan.
- Product Backlog and reconstructed Kanban.
- GitHub pull request, `.github/workflows/ci.yml`, and CI screenshots.
- Commit `7b51d07` and the regression tests for practice-progress 500 and duplicate-content 409.
- Direct feedback from lecturers Biên and Khoa and confirmation from the members.
