# Project Charter — Interview Practice Platform

## 1. Document control

| Item                           | Details                                       |
| ------------------------------ | --------------------------------------------- |
| Sponsors                       | Lecturers Ngô Huy Biên and Ngô Ngọc Đăng Khoa |
| Product Owner                  | Hưng                                          |
| Project Manager / Team Leader / Timekeeper | Tuấn Anh                         |
| Project Planning & Estimation Analyst / Full-stack Developer | Gia Thành       |
| Team                           | Gia Thành, Hùng, Hưng, Trí, Luân, Tuấn Anh    |
| Version                        | 1.0 — planning baseline                       |
| Baseline date                  | 14 August 2026                                |
| Planned period                 | 29 June–23 August 2026, 8 weeks               |
| Status                         | Waiting for Sponsor approval                  |

This Charter defines the project's purpose, scope, roles, resources, milestones, limits, and decision gates. It becomes formal authorisation only after Sponsor approval. The repository does not contain Sponsor signatures.

## 2. Purpose

Vietnamese candidates often read a job description (JD) but do not know what knowledge, skills, or interview questions to prepare. They use separate tools for questions, Mentors, schedules, meetings, and feedback.

The project will build a pilot-ready web MVP for Students, Mentors, and Administrators.

```text
JD → extraction/OCR → corrected text → requirements
→ questions and preparation plan → self-practice or Mentor booking
→ mock interview → feedback → next action
```

The project will collect evidence for a Go, Pivot, or Stop decision. It does not assume that the product is already commercially successful.

## 3. Objectives

| Objective            | Target                                                                                        |
| -------------------- | --------------------------------------------------------------------------------------------- |
| Confirm the problem  | At least 70% of a valid discovery sample confirms the main problem                            |
| Check usability      | At least 80% find a relevant question within a median of 2 minutes and create a valid booking |
| Check booking value  | At least 80% of confirmed bookings are completed                                              |
| Check feedback value | At least 90% of completed bookings have strength, weakness, and next action                   |
| Protect quality      | All critical workflow tests pass and no Critical/High defect remains before UAT               |

These values are targets. The repository does not show that they were achieved.

## 4. High-level scope

### In scope

- Authentication and role-based access.
- JD text/file input, extraction, OCR, and correction.
- Requirement analysis, taxonomy, question mapping, and preparation plans.
- Question Bank search and basic practice tracking.
- Mentor profile, approval, expertise, and availability.
- Booking, slot-conflict protection, and external meeting links.
- Notifications, feedback, reviews, audit, and basic administration.

### Out of scope

- AI interviewer and automatic answer scoring.
- Built-in calls, recording, and transcription.
- Payment, escrow, and payout.
- Native mobile applications, applicant tracking, and ML recommendations.

ADR-005 later added optional Gemini support behind feature flags. It does not add an AI interviewer or automatic scoring. Any high-level scope change still needs change control.

## 5. Team and authority

| Member    | Main role                                                     | Main outputs                                                                                                  |
| --------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Tuấn Anh  | Project Manager / Team Leader / Timekeeper                    | Assign roles and work, manage deadlines and Kanban, decide escalations, review merges, and confirm Done      |
| Gia Thành | Project Planning & Estimation Analyst / Full-stack Developer   | Maintain the Charter, resources, cost and estimates; implement Mentor verification, availability, JD, and notifications |
| Hưng      | Product Owner / Business Analyst                              | Own Vision and Scope, Product Backlog, acceptance criteria, future workflow, and User Story acceptance       |
| Luân      | Architecture / Technical Lead                                 | Own the technology stack, ADRs, architecture, and technical support                                          |
| Hùng      | UI/UX Designer / Front-end Developer                          | Produce the prototype, workflow, usability evidence, and front-end interface                                 |
| Trí       | PoC / Integration & E2E Developer                             | Build PoCs, seed data, integrations, end-to-end tests, and technical-risk evidence                           |

Decision rules:

- Sponsors approve the Charter, baseline scope, and major changes.
- The Product Owner sets backlog priority and accepts stories.
- Tuấn Anh assigns work, manages deadlines and the Kanban flow, resolves escalations, reviews merges, and confirms delivery.
- Gia Thành maintains planning and estimation data for project decisions and also contributes as a Full-stack Developer.
- Technical decisions follow accepted ADRs.

These role assignments do not prove that a person reviewed a specific change. A review record is still required.

## 6. Resources, assumptions, and limits

| Item               | Baseline                                          |
| ------------------ | ------------------------------------------------- |
| Team capacity      | 6 members × 16 hours/week × 8 weeks               |
| Risk reserve       | 15%                                               |
| Available capacity | About 653 hours                                   |
| Cash limit         | VND 1,125,000                                     |
| Meeting tool       | External link such as Google Meet or Zoom         |
| Pilot data         | Legal, de-identified, and traceable to its source |

Main limits:

- Major features need an approved change request.
- Private JD, Mentor, meeting, booking, and feedback data needs role- and owner-based access.
- Booking must prevent double booking.
- Email failure must not undo a saved booking.
- The part-time team must not depend on long-term overtime.
- Secrets must stay outside the repository.
- Demo and load seeds must never run in production.

## 7. Milestones

| Milestone                       | Planned dates    | Exit condition                                                               |
| ------------------------------- | ---------------- | ---------------------------------------------------------------------------- |
| M1 — Discovery and Charter      | 29 June–5 July   | Stakeholders, problem evidence, Charter, and resources approved              |
| M2 — Requirements and Prototype | 6–12 July        | Vision, workflow, backlog, acceptance criteria, and prototype accepted       |
| M3 — Foundation                 | 13–19 July       | Architecture, CI/CD, authentication, and reference data ready                |
| M4 — JD Intake and Analysis     | 20–26 July       | JD input, extraction/OCR, correction, mapping, and plan meet criteria        |
| M5 — Mentor Practice Loop       | 27 July–9 August | Mentor, booking, meeting handoff, feedback, and notification work end-to-end |
| M6 — UAT and Release            | 10–23 August     | Critical tests pass, no Critical/High defect remains, and pilot is ready     |

These are planned milestones, not proof of completion. The repository has CI but no automated deployment workflow or deployment-run evidence.

## 8. Go/No-Go gates

| Gate               | Go condition                                          | No-Go or Pivot condition                    |
| ------------------ | ----------------------------------------------------- | ------------------------------------------- |
| G1 — Problem       | Discovery confirms the main problem                   | No clear user need                          |
| G2 — Mentor supply | Enough approved Mentors and slots exist               | Not enough suitable Mentors                 |
| G3 — Prototype     | At least 80% complete the main tasks                  | The flow remains difficult to use           |
| G4 — Technical     | Access, booking, audit, filter, and retry checks pass | Data leaks or booking conflicts remain      |
| G5 — Delivery      | Scope fits about 653 hours and VND 1,125,000          | Core scope exceeds time or cost             |
| G6 — Pilot         | Bookings happen and feedback is useful                | Conversion, completion, or value is too low |

## 9. Approval

| Role            | Name               | Status                                |
| --------------- | ------------------ | ------------------------------------- |
| Sponsor         | Ngô Huy Biên       | Pending                               |
| Sponsor         | Ngô Ngọc Đăng Khoa | Pending                               |
| Product Owner   | Hưng               | Role assigned; signature not recorded |
| Project Manager | Tuấn Anh           | Role assigned; signature not recorded |

Until Sponsor approval is recorded, this Charter is an internal planning baseline.

## 10. Change history and references

Git records:

- initial Charter in commit `0743a68`;
- the eight-week JD-first baseline in `dfdaf1c`, PR `#3`, by Gia Thành; and
- scope alignment in `7ca1f6e`, PR `#6`, by Git author `Z3n`.

The repository does not contain named review comments or signed approval.

- [Project Proposal](../Project_Proposal/Project_Proposal.md)
- [Project Vision and Scope](../Project_Vision_and_Scope/Project_Vision_and_Scope.md)
- [Resource Plan](../Project_Resource_Plan/ResourcePlan.md)
- [Feasibility Study](../Project_Feasibility/feasibility.md)
