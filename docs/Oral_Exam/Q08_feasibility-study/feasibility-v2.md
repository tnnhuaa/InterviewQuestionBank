# Feasibility Study

## 1. Purpose

This document assesses how feasible the project is before the team commits to release. The purpose of the feasibility study is to determine whether the MVP has enough **need, value, and practicality** to continue investing resources, and to identify the conditions, risks, and evidence needed before that decision.

## 2. Reason

The problem the team is solving is that candidates, especially students and Intern/Junior applicants, often do not know what to prepare after receiving or choosing a Job Description (JD). Interview practice today is typically fragmented: reading the JD manually, finding questions on their own, building their own study plan, and only looking for a mentor when the interview is close.

The MVP proposes a single continuous flow:

**Choose an interview topic → The website provides a question set for that topic → The user practises.**

The feasibility study is done to avoid building an entire system before confirming that this core loop is valuable, implementable within the team's resources, and safe to operate within the pilot scope.

## 3. Background information

The MVP scope prioritises the value of JD-based interview preparation. The main components are:

- Ingest a JD from PDF/PNG/JPEG and allow editing the extracted text.
- Analyse requirements and map them onto the Question Bank.
- Generate a preparation plan with trace to the JD, requirements, and Question version.
- Practise against the Question Bank.
- Extension: connect with a Mentor for practice.

Current planning baseline: **8 weeks**, **6 members**, about **653 hours of usable capacity** after reserve, and a **cash ceiling of 1,125,000 VND** for the trial.

## 4. Evaluation criteria

The MVP is assessed against the criteria below:

1. **Technology/System:** The core workflow can be implemented stably and securely and has PoC evidence.
2. **Resource:** The team has enough people, skill, and effort capacity to complete the Must scope.
3. **Schedule:** The Must scope fits within the throughput/capacity of the weekly Kanban flow in the 8-week baseline.
4. **Operational:** Moderation, mentor approval, booking, feedback, support, and failure-handling processes can be operated.
5. **Market:** There is a real pain, sufficiently clear demand, and enough mentor supply for the pilot.
6. **Economic:** The pilot cost is reasonable relative to the learning value; the main costs and benefits are identified and controlled.
7. **Legal/Privacy/Ethical:** Data, copyright, consent, and privacy are managed at a level appropriate for an MVP.
8. **Cultural:** JD upload, feedback, mentor use, and trust in the Question Bank behaviour fit the target users.

A conclusion is only considered strong when backed by PoC, pilot, user validation, or measurement evidence rather than assumption alone.

## 5. Study findings

### 5.1 Technology and system feasibility

| Capability | Assessment | Risk / Evidence / Mitigation |
|---|---|---|
| Web CRUD/search/filter | Feasible | Risk: incorrect taxonomy/filter with multi-tag. Evidence: test with multiple positions/topics. Mitigation: versioned taxonomy and automated filter tests. |
| Authentication/RBAC | Conditionally feasible | Risk: object-level access leak. Evidence: negative authorization tests between users. Mitigation: ownership checks at the service/API layer. |
| JD intake/extraction | Feasible with risk | Risk: wrong OCR/extraction or a corrupted file. Evidence: PoC on PDF/PNG/JPEG ≤10 MB. Mitigation: direct extraction first, OCR VI/EN fallback, correction gate, and safe failure. |
| Requirement analysis/Question mapping | Feasible with risk | Risk: missing or misaligned mapping. Evidence: 20 labelled JDs, blind-set recall and precision@10 ≥80%. Mitigation: versioned taxonomy/alias/rules and traceable mapping reason. |
| Preparation plan | Feasible | Risk: plan loses trace or another user accesses it. Evidence: JD/requirement/Question-version trace and authorization tests. Mitigation: immutable references/appropriate versioning. |
| Mentor verification | Feasible | Risk: mentors are not sufficiently reliable. Evidence: moderation workflow and audit. Mitigation: Approved-only participation in the pilot. |
| Availability/booking | Feasible with risk | Risk: double booking under concurrent requests. Evidence: concurrency PoC. Mitigation: transaction + unique constraint/idempotent transition. |
| Notification | Feasible with risk | Risk: email failure loses a booking or sends duplicates. Evidence: retry/idempotency test. Mitigation: decouple booking persistence from delivery with an outbox/retry. |
| Feedback/review | Feasible | Risk: inappropriate feedback or data exposure. Evidence: completed-only rule, privacy/moderation test. Mitigation: rubric, ownership, and report/appeal. |
| Video meeting | Feasible via lightweight integration | Risk: building a separate meeting tool goes out of scope. Evidence: external/manual link meets the pilot. Mitigation: defer a native meeting platform. |
| AI/payment | Excluded from MVP | Risk: increases complexity, compliance, and cost. Mitigation: only consider after the core loop is validated. |

#### Mandatory technical PoC

1. A valid JD produces editable text through direct extraction or OCR fallback; a bad file fails safely.
2. Requirements/aliases are normalised and mapping only returns `PUBLISHED` Questions, with source/topic/reason/version, and is stable across versions.
3. Two concurrent requests cannot confirm the same slot.
4. Another user cannot read or edit a JD, plan, booking, meeting link, or feedback.
5. Booking transitions are valid and have an audit trail.
6. Question filters are correct across multiple positions/topics.
7. An email failure does not lose a booking; retries are idempotent.

**Conclusion:** Technical feasibility is at **conditionally feasible**. The core architecture has no clear blocker, but release should only Go when all 7 PoCs above pass.

### 5.2 Resource feasibility

The team has **6 members**, each expected to spend an average of **16 hours/week** on the project for **8 weeks**. Nominal total capacity is roughly **768 hours**. After holding back **15% reserve** for discovery, integration, defect fixing, security/privacy, and UAT, the usable effort for the implementation scope is about **653 hours**.

The mandatory MVP scope is currently expressed as a **Must backlog of 27 user stories totalling 134 Story Points (SP)**. This number helps the team visualise the relative size of the mandatory work, but should not yet be treated as a final delivery commitment, since story points are only a relative estimate and the team does not yet have enough real data to demonstrate the corresponding completion rate.

To check whether the current resources are actually sufficient, the team will re-confirm the Must backlog estimate in **backlog refinement** — possibly using **Planning Poker** to adjust the Story Points before moving an item to Ready — and track **actual throughput/cycle time** on the weekly Kanban flow. If the throughput data shows the Must scope can be delivered within the remaining capacity while still keeping reserve for integration, defects, and UAT, resources are considered adequate. Conversely, if the workload exceeds the team's real capability, the team must reduce or re-prioritise scope rather than consume the entire reserve or cut quality activities. Planning Poker here is a relative estimation technique, not a Scrum ritual, and it does not replace throughput data.

**Conclusion:** Resource feasibility is currently assessed as **conditionally feasible**. The team has enough headcount and a clear capacity baseline, but the final conclusion depends on re-confirming the Must backlog and checking it against the team's actual capability during execution.

### 5.3 Schedule feasibility

Status: **planning baseline exists; no final release commitment yet**.

- Timeline: the 8-week planning window from 29/06 to 23/08/2026; the execution part is reconstructed in four weeks from 27/07 to 23/08. The team runs a weekly Kanban, not sprints.
- Baseline backlog: 134 SP.
- Average load benchmark: about 33.5 SP/week over the four reconstructed execution weeks (134 / 4), used only as a comparison benchmark, not a measured throughput.
- Schedule is feasible when the Must backlog falls within the team's **throughput** over the remaining weeks, while still keeping reserve for defects, integration, security/privacy, and UAT.

The main risk is the team committing to a fixed-date release based on SP before real throughput/cycle-time data exists.

Mitigation:

- Measure throughput and cycle time from the actual Kanban flow.
- Build the **will-have / might-have** line.
- Cut scope before cutting quality gates.

**Conclusion:** Schedule feasibility currently **lacks enough evidence to commit**, but is potentially feasible if actual throughput supports the Must scope.

### 5.4 Market feasibility

| Aspect | Assessment | Validation |
|---|---|---|
| Student need | Hypothesis to validate | ≥70% of the discovery sample confirms the JD-based preparation pain |
| JD-to-plan value | Conditional | ≥80% complete tasks; extraction ≥90%; blind-set recall/precision@10 ≥80% |
| Mentor supply | Conditional | 4 Approved mentors, each with ≥3 slots for the pilot |
| Plan-to-mentor loop | Not yet proven | 12 valid bookings; target ≥10 Confirmed and ≥8 Completed |

The pilot target is limited to **Front-end Intern/Junior roles using JavaScript/TypeScript/React**, with **20 de-identified JDs, 12 students, and 4 volunteer mentors**.

The marketplace carries a chicken-and-egg risk, but it does not block the whole product value, since a student can still receive a preparation plan before using the mentor service.

**Conclusion:** Market feasibility **shows positive signals but is not yet proven**. The pilot must confirm both student demand and mentor supply before scaling.

### 5.5 Operational feasibility

Operational feasibility focuses on the ability to run daily processes once the features work correctly technically.

| Activity | Risk | Validation / Mitigation |
|---|---|---|
| Mentor approval | Unfit mentor or inconsistent approval | Have an owner, approval criteria, and audit trail |
| Booking | Cancellations/reschedules/no-shows cause disputes | Clear policy, an owner to handle them, and fixed state transitions |
| Feedback | Mentors skip it or it is not useful | Rubric, Completed-only rule, ≥90% feedback-completion target |
| Question moderation | Wrong/low-quality/copyrighted content | Provenance, report, moderation, and appeal |
| Notification | Delivery failure causes confusion | Idempotent retry; booking stays intact if email fails |
| User support | Unclear who handles exceptions | Assign an admin/owner for the pilot |

The MVP does not require operating payment, escrow, payout, or a separate video infrastructure, which significantly reduces the operational burden.

**Conclusion:** Operational feasibility is **conditionally feasible** if the team defines owners and policies before the pilot rather than handling exceptions ad-hoc.

### 5.6 Economic feasibility

Status: **cost baseline for the pilot exists; commercial ROI/unit economics not yet proven**.

#### Cost baseline

- Domain: **300,000 VND**.
- Support for 12 student participants: **600,000 VND**.
- Direct cash baseline: **900,000 VND**.
- 25% contingency: **225,000 VND**.
- Cash ceiling: **1,125,000 VND**.
- Pilot mentors participate voluntarily.
- Payment, escrow, payout, and commission are not part of the MVP.
- Labour cost is tracked separately and is not considered a cash expense of the pilot.

#### Cost–Benefit Analysis

| Cost / Investment | Expected benefit |
|---|---|
| Domain and minimal infrastructure cost | An accessible pilot environment and real testing |
| Participant incentive | Real-user evidence instead of self-testing alone |
| 653 hours usable team capacity | Build and validate the core JD-to-plan-to-mentor workflow |
| Effort to create 20 labelled JDs | Measure extraction/mapping quality with calibration + blind set |
| Mentor volunteer effort | Validate mentor supply, booking, and feedback loop |

The main value of the MVP at this stage is not revenue but **validation value**: confirming problem-solution fit, technical risk, operational burden, and demand before investing in AI, payment, or marketplace scale.

### 5.7 Legal, privacy and ethical feasibility

The MVP is conditionally feasible if:

- There is a privacy notice, consent, and a clear processing purpose.
- Data collection is minimal.
- The original JD is deleted within ≤24 hours.
- Derived data is deleted after 90 days of inactivity.
- Booking/feedback is retained for a maximum of 180 days.
- Active deletion is ≤7 days and backup expiry is ≤30 days.
- Meeting links, verification evidence, and feedback are not public.
- Questions have provenance and do not copy copyrighted content unlawfully.
- Reviews/reports have guidelines, moderation, and appeal.
- No recording/transcription in the MVP.
- The terms state cancellation, no-show, refund/credit, and liability limits, if these policies apply.

The main risks are handling JDs containing company/personal information, sharing meeting links, and reusing interview content with unclear provenance.

The main mitigation is data minimisation, de-identification, access control, retention policy, provenance, and moderation.

**Conclusion:** Legal/privacy/ethical feasibility is **conditionally feasible** in a small pilot if these controls are implemented and tested.

### 5.8 Cultural feasibility

Cultural feasibility assesses whether the behaviour the system requires fits the habits, expectations, and trust levels of the target Student/Mentor.

Hypotheses to validate:

1. **Students are willing to upload a JD:** Users may worry the JD contains company or sensitive data. The pilot must clearly explain purpose, retention, and de-identification.
2. **Students accept a structured preparation plan:** Users must see that a JD-based plan is more useful than finding questions themselves on Google/YouTube/ChatGPT.
3. **Students are willing to receive direct feedback:** An interview feedback can feel like being graded; the rubric needs to be constructive, specific, and actionable.
4. **Mentors accept a standardised workflow:** Mentors may be used to free-form feedback; the pilot needs to check whether the rubric and structured feedback add significant burden.
5. **Trust in the Question Bank:** Students need to know where questions come from, why they were mapped, and who approved them, to avoid the impression that the system returns arbitrary questions.
6. **Booking habits:** Users need to understand Confirmed/Completed/Cancelled/No-show and accept a clear policy.

Proposed validation:

- ≥80% of pilot students understand why the system asks them to upload/correct a JD.
- ≥80% of students find the preparation plan easy to understand and useful.
- ≥75% of students are willing to use the mentor feedback workflow again.
- ≥75% of mentors find the rubric/feedback flow acceptable in effort.
- No recurring trust/privacy concern remains unresolved after the pilot interview.

**Conclusion:** Cultural feasibility is currently **not yet proven**, but has no clear blocker. User/mentor interviews after the pilot are needed to confirm acceptance and trust.

## 6. Recommendations and Go/No-Go gates

| Gate | Go when | No-Go/Pivot when |
|---|---|---|
| G1 Problem | Pain is confirmed and there is existing behaviour | Only general opinions, no real need |
| G2 JD data | 20 legal/de-identified JDs, 12 calibration + 8 blind, with two-pass labels | No corpus or labels that are not reliable enough |
| G3 Prototype | ≥80% of JD-to-plan and plan-to-booking tasks complete | Flow is not understood or needs major support |
| G4 Technical | 7 mandatory PoCs pass; blind recall/precision@10 ≥80% | Extraction/mapping fails, or double booking or access leak is not controlled |
| G5 Supply | 4 Approved mentors with ≥3 slots each | Cannot recruit supply in the right segment |
| G6 Delivery | Must backlog within throughput range/capacity/budget | Core loop cannot be completed within baseline |
| G7 Pilot | ≥10 Confirmed, ≥8 Completed; feedback useful | Completion/value too low after one remediation cycle |
| G8 Cultural acceptance | Student/Mentor acceptance reaches the pilot threshold and no serious recurring trust/privacy concern remains | Users refuse to upload a JD, do not trust mapping/feedback, or the mentor workflow is too burdensome |
| G9 Economic pilot | Pilot stays within 1,125,000 VND and produces enough evidence for the next decision | Cost exceeds baseline without a proportionate validation value |

## 7. Final recommendation

**Proceed with a narrow trial and PoC; do not Go for full release yet.**

The MVP has a good foundation in technology/system, resource, and operational feasibility, but still needs real evidence for market demand, cultural acceptance, throughput, and mapping quality. Economic feasibility is enough for a small pilot, but there is not enough data to conclude commercial ROI or unit economics.

The planning baseline is used for internal coordination; official approval still requires the signature of sponsors Ngô Huy Biên and Ngô Ngọc Đăng Khoa.
