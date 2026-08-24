# Project Estimation Report

## Document control

| Field | Value |
| --- | --- |
| Project | PrepVI — Interview Practice Platform |
| Version | 1.0 |
| Reporting date | 23 August 2026 |
| Status | Planning report based on the current repository artifacts |
| Estimation window | Eight-week academic project baseline |

## 1. Executive summary

PrepVI used two independent estimation approaches to forecast project effort: top-down parametric estimation and bottom-up three-point estimation. The top-down result is 650 hours after contingency; the bottom-up result is 606 hours after contingency. The difference is 44 hours, or approximately 7.3% of the bottom-up estimate.

The team used 606 hours as the working forecast and 650 hours as a guardrail against the capacity available to scope, approximately 653 hours. These values were calculated from an earlier 20-Must-story scope and are forecasts rather than commitments for the current 27-story, 134-Story-Point backlog.

## 2. Estimation objectives

The estimation process supports:

- feasibility checking against time and team capacity;
- comparison of independent methods;
- transparent treatment of uncertainty and contingency;
- cost and resource planning; and
- re-estimation when scope or assumptions change.

## 3. Formation and evaluation process

The estimate was formed from the historical Product Backlog, functional work packages, team availability, an eight-week planning window, direct-cost assumptions and explicit contingency. The team produced two independent views: a story-count-based top-down forecast and a work-package-based bottom-up three-point forecast.

The document was evaluated by:

1. checking arithmetic, units and contingency treatment;
2. comparing the two methods for omissions or double counting;
3. reconciling forecast effort with team capacity, schedule and cost constraints;
4. reviewing scope and technical assumptions; and
5. defining re-estimation triggers rather than treating the first estimate as a permanent commitment.

The 7.3% method difference is a consistency signal, not proof of accuracy. Both methods can be wrong together when they share an obsolete scope or unsupported productivity assumption. Complete actual-effort records are not retained, so project-level Magnitude of Relative Error has not been validated.

## 4. Shared assumptions

| Input | Planning value |
| --- | ---: |
| Team size | 6 people |
| Availability | 16 hours per person per week |
| Duration | 8 weeks |
| Nominal capacity | 768 hours |
| Capacity reserve | 15%, approximately 115 hours |
| Capacity available to scope | Approximately 653 hours |
| Effort contingency | 15% |
| Reference labor rate | 50,000 VND/hour |

The labor rate is an academic planning assumption. It is not a salary, supplier quotation or cash payment.

## 5. Method A — top-down parametric estimate

The method counted 20 Must stories in the historical baseline and applied 26 hours per story as structured expert judgment. Complexity, exclusions and cross-cutting delivery overhead were recorded separately.

| Calculation | Hours |
| --- | ---: |
| Base count | 520 |
| Booking, security and reliability adjustment | +104 |
| Excluded video, payment and AI adjustment | -75 |
| Expected effort | 549 |
| Cross-cutting overhead | +16 |
| Forecast before contingency | 565 |
| 15% contingency | +85 |
| Top-down forecast | **650** |

## 6. Method B — bottom-up three-point estimate

The work was divided into functional and cross-cutting work packages. Each package used the PERT expected-value formula:

`E = (O + 4M + P) / 6`

where `O` is optimistic effort, `M` is most likely effort and `P` is pessimistic effort.

| Calculation | Hours |
| --- | ---: |
| Sum of expected work-package effort | 527 |
| 15% contingency | +79 |
| Bottom-up forecast | **606** |

## 7. Comparison and planning decision

| Criterion | Top-down | Bottom-up |
| --- | ---: | ---: |
| Forecast before contingency | 565 hours | 527 hours |
| Forecast after contingency | 650 hours | 606 hours |
| Approximate duration at 82 hours/week | 8.0 weeks | 7.4 weeks |
| Remaining capacity against 653 hours | 3 hours | 47 hours |

The comparison provides a range, not permission to add work. Remaining capacity protects integration, review, defects, documentation and uncertainty.

## 8. Cost baseline

| Cost component | Planning value |
| --- | ---: |
| Direct cash ceiling | 1,125,000 VND |
| Reference labor value | 30,300,000 VND |
| Total economic planning value | 31,425,000 VND |

Direct cash and reference labor value are reported separately to avoid presenting notional academic labor as an actual expense.

## 9. Re-estimation control

Re-estimation is required when scope changes, a critical proof of concept fails, provider constraints change, actual capacity differs materially, or the forecast exceeds the eight-week/653-hour constraint. The current 27-story backlog must be traced into the work breakdown and recalculated before the historical estimates are treated as a release commitment.

## 10. Evidence

![Estimation Comparison displayed in GitHub](img/Q10-01-estimation-comparison-github.png)

**Figure 1.** The versioned Estimation Comparison opened in the real GitHub file view.

![Cost Time Resources baseline displayed in GitHub](img/Q10-02-cost-baseline-github.png)

**Figure 2.** The versioned cost, time and resource baseline opened in the real GitHub file view.

## 11. Limitations

- The project has no comparable historical actual-effort dataset.
- Complete actual timesheets are not retained.
- The 606/650-hour values use the historical 20-Must-story scope.
- Story Points cannot be converted directly to hours. A Kanban forecast should use credible historical throughput, cycle-time, lead-time and Work in Progress data; the repository does not retain enough of that history.
- The academic labor rate is not a market quote.

## 12. Source artifacts

- [Estimation Comparison](../../Project_Resource_Plan/Estimation_Comparison.md)
- [Cost, Time and Resources](../../Project_Resource_Plan/Cost_Time_Resources.md)
- [Resource Plan](../../Project_Resource_Plan/ResourcePlan.md)
- [Product Backlog and Acceptance Criteria](../../Project_Vision_and_Scope/Product_Backlog_and_Acceptance_Criteria.md)
