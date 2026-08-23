# Estimation Comparison - Interview Practice Platform

## 1. Purpose and scope

This document compares two independent estimates for the **8-week baseline**: the JD-to-feedback core loop, cross-cutting activities (discovery, architecture, testing, deployment/UAT, documentation), and excludes AI, built-in video, payment, native mobile, and ML. Both are forecasts made at inception, not commitments.

To keep the 8-week deadline, the baseline accepts only the Must stories serving the core loop; Should/Could items and anything not needed for the pilot must be deferred after release. The PM/PO must re-estimate and rebaseline if scope changes.

**Backlog sync status:** the calculations below use the 20 Must stories at inception. The current Product Backlog has 27 R1 Mandatory stories with 134 SP; therefore 606/650 hours are only a historical working forecast and must be updated with Planning Poker, WBS/PERT traceability, and two independent estimations before any release commitment.

## 2. Inputs and shared assumptions

| Data / assumption | Value | Source |
|---|---|---|
| Scope count | 20 Must stories; JD intake, extraction/OCR, requirement analysis, question mapping, and preparation plan are estimated as a work package in the scope charter and must be detailed in the backlog | Product Backlog / Project Charter |
| Technical scope | Relational DB, RBAC, booking consistency, outbox/retry, external meeting link | Architecture and Feasibility |
| Team capacity | 6 people x 16 hours x 8 weeks = 768 nominal hours; 15% reserve = about 653 committed hours | Resource Plan |
| Contingency | 15% effort for initial uncertainty | Planning assumption; cone of uncertainty in the lecture |
| Labor rate | 50,000 VND/hour, internal academic value only | Planning assumption |
| Historical-data limitation | The team has no historical actuals for a comparable project, so estimation by analogy is not used. Method A's productivity factor is structured expert judgment and must be recalibrated after the PoC/first delivery weeks | Transparency note |

Course references: `docs/refs/05-2-introduction-to-software-estimation.md` (slides 006-007, 013-016, 020-024, 030-036, 040, 054), `docs/refs/06-software-project-planning.md` (slides 029 and 031) and `docs/refs/05-1-work-breakdown-structure.md` (slides 019, 025, 033). They require estimating size/duration/cost, using countable data and a WBS for accuracy, and not confusing an estimate with a commitment.

## 3. Method A - Top-down parametric / Count-Compute + Structured Expert Judgment

### 3.1 Count, rate, and adjustments

Method A counts the **20 Must stories** in the Product Backlog and computes effort with **26 hours/story**. The 26 hours/story factor is the team's structured judgment from the planning workshop, adjusted for the 8-week delivery and the baselined web CRUD/workflow scope; it is not historical actual data, market data, or data from a comparable project. Following the count → compute → judgment order in the course notes, this is top-down parametric sizing with expert judgment, not estimation by analogy; it cannot replace an analogous estimate while no comparable-project actuals exist.

The MVP has web CRUD/workflow plus booking transactions, object authorization, notification retry, and audit. Conversely, it excludes built-in video, payment, and AI. Adjustments are recorded separately so the PM/PO can review and recalibrate:

| Adjustment | Formula | Hours |
|---|---:|---:|
| Count-compute base | 20 Must stories x 26 hours/story | 520 |
| Booking/security/reliability complexity | 20% of 520 hours | +104 |
| Remove built-in video/payment/AI | 12% of 624 hours, rounded | -75 |
| **Top-down expected** | 520 + 104 - 75 | **549** |
| Cross-cutting delivery overhead | 3% x 549, rounded (release/UAT/docs not present in story count) | +16 |
| **Top-down forecast before contingency** | 549 + 16 | **565 hours** |
| Contingency | 15% x 565, rounded | +85 |
| **Top-down planning estimate** | 565 + 85 | **650 hours** |

Reference duration forecast: `650 / (6 x 16 x 0.85) = 8.0 weeks`. Method A nearly touches the committed capacity threshold, so it is used only as a guardrail: any variance or scope addition requires reforecast and a PO/Sponsor decision.

## 4. Method B - Bottom-up + Three-point

PERT formula per epic: **E = (O + 4M + P) / 6**, where O = optimistic, M = most likely, P = pessimistic. The estimate includes development plus the work needed to deliver/verify, consistent with the 100% in-scope WBS principle.

| Epic / work package | O | M | P | E = (O+4M+P)/6 |
|---|---:|---:|---:|---:|
| Initiation, discovery, requirements baseline | 36 | 48 | 60 | 48 |
| Foundation: architecture, CI/CD, auth/RBAC, data | 54 | 76 | 100 | 76 |
| JD intake, Question Bank, and self-practice | 64 | 88 | 116 | 89 |
| Mentor profile, verification, availability | 40 | 56 | 80 | 57 |
| Booking, meeting handoff, notification | 76 | 100 | 140 | 103 |
| Feedback, review, admin moderation | 40 | 52 | 76 | 54 |
| Quality, E2E, UAT, deployment | 48 | 68 | 92 | 69 |
| Management, release notes, documentation | 22 | 30 | 42 | 31 |
| **Bottom-up expected effort** |  |  |  | **527 hours** |
| Contingency | 15% x 527, rounded |  |  | **79 hours** |
| **Bottom-up planning estimate** |  |  |  | **606 hours** |

PERT rows are rounded to the nearest hour for review; the 527-hour total is the working estimate for the core loop. Reference duration forecast: `606 / 81.6 hours/week = 7.4 weeks`, leaving about 47 hours of the 8-week committed capacity.

## 5. Comparison and decision

| Criterion | Top-down parametric / Count-Compute + expert judgment | Bottom-up + Three-point |
|---|---:|---:|
| Effort before contingency | 565 hours | 527 hours |
| 15% contingency | 85 hours | 79 hours |
| Planning estimate | **650 hours** | **606 hours** |
| Reference duration forecast for 6 people | 8.0 weeks | 7.4 weeks |
| Against ~653-hour capacity | 3 hours left | 47 hours left |
| Labor value including contingency | 32,650,000 VND | 30,300,000 VND |

The planning estimate difference is **44 hours (7.3% versus bottom-up)**. Top-down is higher because the per-story rate and broad complexity factor for booking/security/reliability create a conservative guardrail; bottom-up splits work packages so it removes some double counting, but it still carries omission risk and depends on backlog/architecture maturity.

**Decision at inception:** use the **606-hour Bottom-up + Three-point** as the working forecast for the 8-week core loop because of its traceability to epics/work packages; use the **650-hour Top-down parametric** as an independent guardrail. These two numbers are not yet a committed baseline for the 27-story/134-SP backlog. Do not interpret the 47-hour buffer as capacity for new scope; the next re-estimate must update the WBS/PERT and the top-down count, and be approved by the PO/Sponsor before Go.

## 6. Uncertainty reduction plan

1. After M2, use the PO-accepted backlog/prototype to review the story count, rate judgment, and complexity factors of Method A.
2. After M3/M5, record actual effort for the foundation and booking PoC; update productivity, PERT ranges, and the forecast.
3. At the end of each week, compare actual data when available and the number of Done items against the 81.6 hours/week committed capacity. A week below forecast or a failed critical PoC must trigger immediate reforecast because the 8-week buffer is very small.
4. Add Should/Could into the plan only when the Must backlog, reserve, and Go/No-Go conditions remain safe.
