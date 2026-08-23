# Cost, Time and Resources Baseline - Interview Practice Platform

## 1. Proposed baseline

| Item | Planning baseline |
|---|---|
| Start / finish | 29/06/2026-23/08/2026 |
| Duration | 8 weeks, 6 phases per the Project Charter |
| Team / capacity | 6 people x 16 hours/week x 8 weeks = 768 nominal hours; about 653 hours committed after a 15% reserve |
| Operating estimate | Bottom-up + Three-point: 527 expected hours, 606 hours after a 15% contingency; currently based on the old 20 Must stories and must be updated for 27 stories/134 SP |
| Cross-check | Top-down parametric Count-Compute + structured expert judgment: 565 hours, 650 hours after a 15% contingency; currently based on the old 20 Must stories and must be updated for 27 stories/134 SP |
| Cash budget ceiling | **1,125,000 VND** |
| Reference labor value | 606 hours x 50,000 VND/hour = **30,300,000 VND** |
| Total economic planning value | **31,425,000 VND** (= cash + labor value) |

The labor value is only for comparing alternatives; it is not an amount the team must spend. The 50,000 VND/hour rate is a **team-agreed academic assumption**, not a market quote or real salary; it must be replaced with a Sponsor-accepted quote/rate if the project moves to commercial deployment.

To keep the 8-week window, the baseline covers only the JD intake, extraction/OCR, requirement analysis, question mapping, preparation plan, self-practice or mentor booking, feedback, and required technical controls. The PM/PO must defer Should/Could and any non-core-loop items; changes that push the forecast beyond 653 hours require Sponsor/PO approval.

The current backlog has 27 R1 Mandatory stories with 134 SP. The 653-hour capacity remains the planning constraint, but 606/650 hours are not yet a commitment for the current backlog until the development team finishes Planning Poker, traces each story into the WBS/PERT, and updates both independent estimates.

## 2. Schedule and tolerance

| Phase | Period | Exit criteria |
|---|---|---|
| Discovery/charter | 29/06-05/07 | Problem evidence, charter, resource baseline |
| Prototype/requirements | 06/07-12/07 | Workflow, backlog, prototype accepted |
| Foundation | 13/07-19/07 | Architecture, auth, CI/CD, data foundation |
| JD intake & analysis | 20/07-26/07 | JD input, extract/OCR, text confirmation, taxonomy mapping, and preparation plan pass |
| Marketplace core loop | 27/07-09/08 | Booking-to-feedback E2E pass |
| UAT/release | 10/08-23/08 | UAT evidence, zero Critical/High defects, pilot ready |

Reforecast and escalate when the forecast exceeds 8 weeks, ~653 hours, the cash ceiling, or when any critical PoC fails. Estimates are forecasts, not commitments; the baseline only becomes a commitment after the Sponsor/PO approves scope, capacity, and budget.

## 3. Direct cash cost

| Group | Basis | Baseline (VND) |
|---|---|---:|
| Domain | 1 domain for the pilot, 1-year limit | 300,000 |
| Hosting, database, storage | Free tier for development/small pilot | 0 |
| Email/notification, meeting | Free tier + external meeting link | 0 |
| Design, CI/CD, repository | Educational/free-tier tools | 0 |
| Discovery/UAT | 12 thank-you gifts x 50,000 VND | 600,000 |
| Security/monitoring | Free tools suitable for MVP | 0 |
| Cash contingency | 25% of the 900,000 VND direct cost | 225,000 |
| **Total cash budget** |  | **1,125,000** |

This is envelope planning from 14/08/2026, not a vendor price list. Before purchasing, the owner must record the price page/quote, lookup time, validity, and cancellation options; spending beyond the baseline needs a change request.

## 4. Labor value allocation per the current working estimate

| Work group | Expected effort (hours) | Labor value (VND) |
|---|---:|---:|
| Product/PM/discovery | 70 | 3,500,000 |
| UX/prototype | 42 | 2,100,000 |
| Architecture/DevOps | 52 | 2,600,000 |
| Front-end | 112 | 5,600,000 |
| Back-end/integration | 124 | 6,200,000 |
| QA/UAT | 65 | 3,250,000 |
| Content/operations | 52 | 2,600,000 |
| Management/documentation | 10 | 500,000 |
| **Expected effort** | **527** | **26,350,000** |
| 15% contingency | 79 | 3,950,000 |
| **Baseline labor value** | **606** | **30,300,000** |

## 5. Contingency and control

- The 15% capacity reserve and the 15% effort contingency are only for the stated risks/uncertainty; they are not automatically used to add scope.
- Cash contingency is recorded by the PM, confirmed by the Product Owner, and approved by the Sponsor when it arises.
- Track committed/actual cash, actual effort when available, forecast-to-complete, and variance weekly or whenever the baseline changes.
- If the deadline must be kept, cut US-21–23 (Should/Could) first. Do not add AI, video, or payment to the MVP "for value" without a rebaseline.

## 6. Methodology references

- `docs/refs/05-2-introduction-to-software-estimation.md`, slides 006-007: estimates forecast size, duration, cost; effort = staff x time.
- `docs/refs/05-2-introduction-to-software-estimation.md`, slides 013-016 and 020-024: distinguish estimate/commitment, manage the cone of uncertainty, and use count/compute before judgment.
- See `Estimation_Comparison.md` for details of the two methods, inputs, formulas, and the difference.
