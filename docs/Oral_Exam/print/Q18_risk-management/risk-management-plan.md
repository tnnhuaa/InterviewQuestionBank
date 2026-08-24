# Software Risk Management Plan

## 1. Objective

The risk management plan helps the team proactively identify uncertainties that could affect the project's scope, schedule, quality, cost, and operational capability; then prioritise risks, prepare preventive actions, and define contingency responses in case a risk actually occurs.

The Risk Management Plan is treated as a **living document** and is updated throughout execution based on real evidence from the Kanban workflow, user testing, pilot, and external dependencies.

## 2. Assessment method

### 2.1. Identification and classification

The team reviews the Project Proposal, Feasibility Study, MVP Scope, requirements, and the assumptions that need validation to identify risk.

Risks are grouped into major categories: **Business/Market, Scope, Technical, Schedule, People/Resource, Operational, Quality/Content, Security/Privacy, and External Dependency**.

### 2.2. Probability × Impact

The team assesses qualitatively on two factors:

- **Probability (P):** Low = 1, Medium = 2, High = 3.
- **Impact (I):** Low = 1, Medium = 2, High = 3.

**Risk Score = P × I**.

| Score | Priority | Meaning |
|---|---|---|
| 1–2 | Low | Monitor; no special action yet |
| 3–4 | Medium | Has mitigation and is tracked in the Kanban flow |
| 6 | High | Prioritise early resolution and monitor frequently |
| 9 | Critical | Must act immediately to avoid affecting the MVP or priority workflow |

The Risk Register is reviewed when new evidence arrives or when a transition indicator reaches its defined threshold.

### 2.3. Fields of a risk

Each risk consists of:

1. **Risk ID** and Category.
2. Risk description.
3. Probability and Impact.
4. Risk Score / Priority.
5. **Transition indicator** — a measurable sign that the risk is starting to occur.
6. **Mitigation** — action taken in advance to reduce probability or impact.
7. **Contingency** — the specific action triggered once the risk has occurred.
8. **Owner** — the role responsible for monitoring the risk and triggering a response.

## 3. Risk Register

| ID | Category | Risk | P | I | Score / Priority | Transition indicator | Mitigation | Contingency | Owner |
|---|---|---|---|---|---|---|---|---|---|
| R1 | Business / Resource | Not enough mentors recruited for the pilot | H | H | 9 / Critical | Two weeks before pilot, confirmed mentors < 70% of pilot target | Approach alumni, clubs, lecturers, and working professionals early; limit the number of pilot domains | Reduce pilot topics to the number of mentors actually available, group bookings into fixed time slots, and only open booking for confirmed mentors | PO / Business |
| R2 | Business / Market | Students view questions but do not book mentors | M | H | 6 / High | After the first pilot, < 10% of users who practised questions continue to open or send a mentor booking | Interview to find the cause, clarify the feedback value, and place a CTA after the topics users did poorly on | Pause growth of the mentor marketplace; keep the Question Bank as the core flow and run one user-interview round to revalidate demand before further investing in booking | PO / UX |
| R3 | Quality / Operational | Mentor or feedback quality is uneven | M | H | 6 / High | ≥ 2 similar complaints, or a mentor rated < 3/5 during the pilot | Verify profiles, use a rubric and feedback template; brief mentors before accepting bookings | Temporarily halt new bookings for that mentor, review the complained-about sessions, and move unbooked sessions to a more suitable mentor | Mentor Ops |
| R4 | Operational | No-shows, late cancellations, or double bookings | M | H | 6 / High | No-show/cancel-late > 15% of bookings, or one double-booking appears | Lock the time slot once a booking is confirmed; send reminders; define a clear cancellation rule and timezone | For double-booking: keep the earlier-confirmed booking and move the other to a different slot/mentor. For no-shows: allow one reschedule and free the slot immediately | Booking Owner |
| R5 | Scope | Scope creep toward AI, video, and payment | H | H | 9 / Critical | ≥ 2 non-MVP work items enter In Progress, or WIP exceeds the set limit | Baseline MVP, future backlog, change control, and Project Lead approval | Move all non-MVP work items back to the future backlog; if WIP exceeds the limit, stop pulling new items and defer untracked lowest-priority items to protect the core MVP | Project Lead |
| R6 | Quality / Content | Questions are wrong, outdated, or violate copyright | M | H | 6 / High | A content report is filed, a reviewer cannot verify a source, or verbatim unauthorised copying is found | Content compiled by the team/mentors; reviewed before publishing; provenance/source recorded | Unpublish the reported question immediately and replace it with a reviewed one; if the same contributor repeats the violation, lock their content-contribution rights | Content Owner |
| R7 | Security / Privacy | Personal data or meeting links leak | L | H | 3 / Medium | Detect unauthorised access, a link/token shared outside a booking, or logs containing sensitive data | Least privilege, validation, secret management, and privacy-by-design | Immediately revoke the exposed link/token, revoke related sessions, and temporarily lock the leaking endpoint/feature; fix the access rule or logging config, re-verify with an access test, then re-open | Backend / Security |
| R8 | External Dependency | Third-party email/calendar/hosting outage, quota, or API change | M | M | 4 / Medium | API returns persistent errors ≥ 15 minutes, quota exceeds 80%, or integration tests fail after an API change | Adapter for integration; monitor quota; do not depend on external notifications for primary booking status | Disable the failing integration while still allowing booking create/view in the system; the admin pulls affected bookings, notifies users directly, and updates schedules manually until the integration is back | Backend / DevOps |
| R9 | Schedule / Estimation | Actual effort exceeds the estimate | M | H | 6 / High | Cycle time keeps rising, throughput falls for two consecutive review periods, or blocked items exceed the WIP threshold | Relative estimation when needed, capacity reserve, and spikes for unknowns | Re-estimate unfinished work items, split oversized items, and defer non-core-MVP items by lowest priority until WIP and cycle time return to a controlled level | Project Lead / Team |
| R10 | Resource / Validation | Not enough users for UAT or evaluation data | M | H | 6 / High | One week before UAT, confirmed participants < 70% of test target | Recruit participants from discovery; schedule UAT early and keep a backup list | Shift UAT to core workflows first, distribute the available participants so every important workflow still gets tested; secondary workflows with insufficient sample are recorded as lacking evidence and moved to a later test round | UX / QA |
| R11 | Operational / Reputation | A review causes dispute or affects reputation | M | M | 4 / Medium | A review is reported for offensive content, factual inaccuracy, or irrelevance to the session | Only allow reviews from completed bookings; publish community guidelines and a report right | Hide a reported review from public view and keep it for examination; only re-publish if valid, otherwise delete and warn the offending account | Admin / Mentor Ops |
| R12 | People / Resource | Members lack time or skill | M | H | 6 / High | A critical task is blocked > 2 days, blocked items rise consecutively, or only one person can handle an important module | Skill matrix, pair work, knowledge sharing, WIP limits | Move the critical task to the closest capable person, pair with a member lacking the skill, and defer non-core tasks so the critical path is not delayed | Project Lead / Team |

## 4. Risk response strategies

- **Avoid:** remove from the MVP items with high risk/effort that are not yet necessary, such as video calls, an AI interviewer, and automatic payout.
- **Mitigate:** run an early PoC, validation, or process control to reduce Probability or Impact, for example testing booking concurrency, permission, and notifications.
- **Transfer:** for external dependencies, isolate the integration through an adapter and keep the option to switch providers when the cost of switching is lower than rebuilding the whole feature.
- **Accept:** intentionally accept some pilot limitations, for example a few admin operations done manually, but each must have a clear owner, trigger, and contingency.

## 5. Monitoring and updating

The Risk Register is not created once and left unchanged. During project execution:

1. The Risk Owner monitors the transition indicator of their assigned risk.
2. When new evidence arrives, the team revisits Probability, Impact, and Priority.
3. If an indicator reaches its threshold but the risk has not occurred, the team strengthens mitigation.
4. If the risk has occurred, the corresponding contingency is triggered.
5. If the risk affects the backlog, WIP, cycle time, throughput, or release plan, the Project Lead/Team updates priority and scope accordingly.

Evidence used to review risk includes cycle time, throughput, WIP, blocked items, defects, the number of mentors/users recruited, booking conversion, complaints, no-shows, UAT participation, outage, and third-party service quota.
