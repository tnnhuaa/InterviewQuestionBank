# Feasibility Study — Interview Practice Platform

## 1. Executive summary

The MVP is **conditionally feasible** technically and operationally if the JD → extraction/correction → requirement analysis → Question mapping → preparation plan flow is treated as the value entry point; the Question Bank, mentor booking, and feedback remain the practice loop; external meeting tools are used; and PoCs are completed for JD processing, mapping, concurrency, authorization, and notification. The planning baseline is 8 weeks, roughly 653 hours of capacity, and a cash ceiling of 1,125,000 VND. Delivery capability can only be concluded after the team confirms the 134 SP with Planning Poker, updates both independent estimates, and has a realistic throughput range.

## 2. Technical feasibility

| Capability | Assessment | Conditions |
|---|---|---|
| Web CRUD/search/filter | Feasible | Taxonomy/index and multi-tag tests |
| Authentication/RBAC | Conditionally feasible | Object-level authorization and negative tests |
| JD intake/extraction | Feasible with risk | One PDF/PNG/JPEG ≤10 MB, PDF ≤5 pages; direct extraction first, VI/EN OCR fallback, correction gate and safe failure |
| Requirement analysis/Question mapping | Feasible with risk | 20 labeled JDs; versioned taxonomy/alias/rules; blind-set recall and precision@10 ≥80% |
| Preparation plan | Feasible | Traceability to JD/requirement/Question version and object-level authorization |
| Mentor verification | Feasible | Moderation workflow and audit |
| Availability/booking | Feasible with risk | Transactional/unique constraints prevent double booking |
| Notification | Feasible with risk | Outbox/retry; must not roll back booking |
| Feedback/review | Feasible | Completed-only rule, privacy and moderation |
| Video meeting | Feasible with light integration | External/manual link in MVP |
| AI/payment | Excluded from MVP | Consider only after validation |

Mandatory PoCs:

1. A valid JD produces editable text via direct extraction or OCR fallback; file errors fail safely.
2. Requirements/aliases are normalized, and mapping returns only `PUBLISHED` Questions with source/topic/reason/version, stable within a version.
3. Two simultaneous requests cannot confirm the same slot.
4. Unrelated users cannot read or modify JD, plan, booking, meeting link, or feedback.
5. Booking transitions are valid and auditable.
6. Question filters work correctly across multiple positions/topics.
7. Email failure does not lose a booking; retry is idempotent.

## 3. Schedule and resource feasibility

Status: **Planning baseline exists; no formal delivery commitment yet**.

- Capacity: 6 members × 16 hours/week × 8 weeks = 768 nominal hours; a 15% reserve leaves about 653 hours for scope.
- Backlog: 27 R1 Must stories = 134 SP; the required throughput of 33.5 SP/week over four reconstructed execution weeks is only a comparison marker.
- The team must run Planning Poker, split or accept the 8-SP exception, track a throughput range after 2–3 weeks of data, and build a will-have/might-have line before committing to a fixed-date release.
- The schedule is considered feasible when the Must backlog fits within the forecast throughput range while reserving capacity for discovery, integration, defects, security/privacy, and UAT.

## 4. Operational and market feasibility

| Aspect | Assessment | Validation |
|---|---|---|
| Student need | Hypothesis to verify | ≥70% of the discovery sample confirms a JD-based preparation pain point |
| JD-to-plan value | Conditional | ≥80% task completion; extraction ≥90%; blind-set recall/precision@10 ≥80% |
| Mentor supply | Conditional | 4 Approved mentors, each with ≥3 slots for the pilot |
| Booking operation | Conditional | Cancel/reschedule/no-show policy and admin owner |
| Feedback quality | Conditional | Mentors can use the rubric; ≥90% complete |
| Moderation | Conditional | Question provenance, report and appeal |
| Plan-to-mentor loop | Not yet proven | 12 valid bookings; targets ≥10 Confirmed and ≥8 Completed |

The marketplace has a chicken-and-egg risk, but it does not block overall value because the Student receives a preparation plan before booking a Mentor. The pilot is limited to Front-end Intern/Junior candidates using JavaScript/TypeScript/React, 20 de-identified JDs, 12 Students, and 4 volunteer Mentors.

## 5. Economic feasibility

Status: **Cash baseline exists for the trial; unit economics not proven**.

- Direct cash: domain 300,000 VND + supporting 12 Student participants 600,000 VND = 900,000 VND.
- 25% contingency = 225,000 VND; cash ceiling = 1,125,000 VND.
- Pilot mentors participate voluntarily; payment, escrow, payout, and commission are out of MVP scope.
- Labor cost must be tracked separately; the academic conversion rate is not a wage or cash cost.
- Any paid OCR/email/hosting service needs a dated quote, impact assessment, and change approval before replacing the internal/free-tier baseline.

## 6. Legal, privacy, and ethical feasibility

The MVP is conditionally feasible if:

- A privacy notice, consent, and clear processing purpose exist.
- Data is minimal: original JD deleted within ≤24 hours, derived data after 90 days of inactivity, booking/feedback after 180 days, active deletion ≤7 days, and backup expiry ≤30 days.
- Meeting links, verification evidence, and feedback are not public.
- Questions have provenance and do not copy copyrighted content without authorization.
- Reviews/reports have guidelines, moderation, and appeal.
- No recording/transcription in the MVP.
- Terms state cancellation, no-show, refund/credit, and liability limits.

## 7. Recommendation and Go/No-Go gates

| Gate | Go when | No-Go/Pivot when |
|---|---|---|
| G1 Problem | Pain is confirmed with current behavior | Only general opinions, no real need |
| G2 JD data | 20 legal/de-identified JDs, 12 calibration + 8 blind, double-labeled | No corpus or unreliable labels |
| G3 Prototype | ≥80% JD-to-plan and plan-to-booking tasks complete | Flow is unintelligible or requires heavy support |
| G4 Technical | 7 mandatory PoCs pass; blind recall/precision@10 ≥80% | Extraction/mapping fails, double booking or access leaks uncontrolled |
| G5 Supply | 4 Approved mentors with ≥3 slots each | Cannot recruit supply in the right segment |
| G6 Delivery | Must backlog fits throughput range/capacity/budget | Core loop cannot complete within baseline |
| G7 Pilot | ≥10 Confirmed, ≥8 Completed; feedback useful | Completion/value too low after one remediation cycle |

Current recommendation: **proceed with a narrow trial and PoC; go to release only when the gates pass**. The planning baseline is for internal coordination; official approval still requires Sponsor signatures from Ngô Huy Biên and Ngô Ngọc Đăng Khoa.
