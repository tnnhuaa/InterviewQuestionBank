# Statement of Work (SOW)

## Document control
- **Project name:** Interview Practice Platform
- **Executing team:** Gia Thành, Hùng, Hưng, Trí, Luân, Tuấn Anh.
- **Created:** 21/08/2026
- **Version:** 1.0

---

## 1. Purpose
Build a web application (MVP) that helps Vietnamese candidates (final-year students, people preparing for internships, or entry-level applicants) turn a specific Job Description (JD) into a structured interview-preparation plan. The application provides a question bank for self-practice and connects candidates with Mentors for mock interviews and feedback.

## 2. Objectives of the work
- Complete the MVP version of the system within 8 weeks.
- Ensure the JD processing pipeline (text extraction, requirement analysis, and question mapping) reaches a high accuracy.

## 3. Scope of work
### 3.1. In Scope
- **Focus:**
  - JD intake feature: paste text or upload a file.
  - Text extraction, including internal OCR for images/scans. Provide an interface for the Student to edit and confirm the JD text.
  - Analyse requirements from the JD through standardised classification, then map them against the Question Bank to generate a Preparation Plan.
- **Mentor flow (developed in parallel and integrated):**
  - Role-based access for three roles: Student, Mentor, Admin.
  - Question Bank management (search, filter, bookmark).
  - Mentor profile management, verification, and availability setup.
  - Booking flow carrying context from the JD/Plan.
  - Integration with external meeting links (Google Meet/Zoom) and email notifications.
  - Rubric-based Feedback and rating system.

### 3.2. Out of Scope
- AI-based automated interviewing, answer grading, and voice/video analysis.
- Machine-learning question recommendations.
- In-platform video calling, recording, and live transcription.
- Payment gateway, escrow, commission calculation, and automatic payout.
- Mobile application.

## 4. Work location
- Team: works at Simple Coffee, 218 Lê Lai, Bến Thành, Hồ Chí Minh 70000, Vietnam.
- Online meetings via Google Meet.
- Communication via Messenger.
- Task management via Trello.
- Source code and documents stored on GitHub.

## 5. Period of performance
- **Course framework:** 8 weeks (29/06/2026 - 23/08/2026).
  - *Phase 1 (29/06 - 24/07):* Worked on the previous project (Splitly), then abandoned it as unfeasible.
  - *Phase 2 (10/08 - 23/08):* Actual execution of the InterviewQuestionBank project (2 weeks).
- **Total effort:** Approximately 653 hours.

## 6. Deliverables schedule

- **Week 1 (27/07 - 02/08) - Foundation & Prototype:** Set up the architecture, design the prototype, and define the workflow and Product Backlog.
- **Week 2 (03/08 - 09/08) - Candidate PoC:** Build the core features (JD Intake, OCR, text extraction).
- **Week 3 (10/08 - 16/08) - Mapping & Integration:** Complete the Question Bank taxonomy mapping, generate the Preparation Plan, and integrate the Mentor flow.
- **Week 4 (17/08 - 23/08) - UAT & Release:** Hand over the end-to-end Booking-to-Feedback flow, provide the test report (no remaining Critical/High defects), and make the system ready for Pilot.

## 7. Applicable standards
- Uses the Kanban model.

## 8. Acceptance criteria
- The system successfully extracts and maps a test suite of 20 (de-identified) JDs, achieving Precision@10 and Recall ≥ 80%.
- The entire core business flow passes 100% of the test scenarios.
- No Critical or High severity defects remain after the UAT process.

## 9. Assumptions
- Resource availability: six members contributing an average of 16 hours per person per week.
- Budget: 1,125,000 VND is sufficient to cover domain costs and pilot thank-you gifts. Server/database configuration uses free tiers.

## 10. Roles & Responsibilities
- **Gia Thành (PM/Scrum Master):** Owns the schedule, tracks progress, estimates, and manages risk.
- **Tuấn Anh (Team Leader):** Leads and administers the project, coordinates between members.
- **Hưng (Product Owner/BA):** Owns the Product Vision, manages the Backlog, and approves acceptance criteria.
- **Luân (Architecture/Tech Lead):** Designs the architecture and makes technical decisions.
- **Hùng (UI/UX Designer):** Designs the interface, user experience, and prototype.
- **Trí (PoC/E2E):** Validates technical feasibility and end-to-end integration.

## 11. Change management process
- Any change affecting Scope, Schedule, or Budget beyond the agreed tolerance must be submitted through a Change Request (CR).
- The Change Control Board (CCB), made up of the Sponsor, PO, PM, and Tech Lead, analyses the impact and decides (Approve/Reject). Defects that violate the original acceptance criteria are prioritised for fixing without requiring a CR.

---

## 12. References

This Statement of Work is based on the following foundation documents:

1. **SOW structure:**
   - Inspired by slide `06. Software Project Planning.pdf`, Slide 12 (*Statement of Work*). The structure answers the "WHAT" question through standard sections such as Purpose, Scope, Period of performance, Deliverables schedule, Acceptance criteria, and Assumptions.
2. **Project, Problem, Solution, and Scope overview:**
   - Taken from `docs/Project_Proposal/Project_Proposal.md` (Purpose, Problem, MVP Scope, and Expected Outcome sections).
   - Further reference from `docs/Project_Vision_and_Scope/Project_Vision_and_Scope.md` (especially the scope boundary, assumptions, and JD data constraint sections).
3. **Cost, Time, Resources, and Deliverables schedule:**
   - Extracted from `docs/Project_Resource_Plan/Cost_Time_Resources.md` (Baseline planning, cash budget 1,125,000 VND, and the 8-week schedule and tolerance with specific dates).
4. **Acceptance criteria:**
   - Compiled from the *product objectives and how they are measured* section of `Project_Vision_and_Scope.md` (Precision ≥80%, Pilot KPI) and the constraints in `Cost_Time_Resources.md`.
5. **Roles:**
   - Follows the role assignment table in `Project_Proposal.md`.
