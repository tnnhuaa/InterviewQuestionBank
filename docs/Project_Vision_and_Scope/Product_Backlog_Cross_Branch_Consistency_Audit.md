# Product Backlog — Cross-Branch Consistency and Ref Evaluation

> **AI inspection report — Pending human review.** This report records what Codex actually found in fetched remote snapshots on 14/08/2026. It distinguishes specification, proposed baseline and observed implementation evidence. It does not approve another member’s deliverable.

## 1. Audit control and method

| Attribute | Value |
|---|---|
| Auditor/support tool | Codex, supporting Hưng/Product Owner |
| Repository | `tnnhuaa/InterviewQuestionBank` |
| Audit branch | `feat/member-3-scope-backlog` |
| Remote refresh | `git fetch --all --prune` on 14/08/2026 |
| Evaluation source of truth | Product Backlog criteria in `docs/refs/` |
| Result | Conditional — backlog is reviewable; human decisions, sizing, evidence and acceptance remain |

Method:

1. Resolve every advertised remote ref and immutable commit SHA without switching or modifying another member’s branch.
2. Inspect the changed governance/estimate, architecture/ADR and PoC artifacts, plus the Prototype specification on remote `main`.
3. Re-read the course refs for comprehensive Product Backlog, PO ordering, Release Backlog, MRF/release planning, DoD, WBS coverage, customer-verifiable stories, RTM and inspection.
4. Compare scope, actors, terminology, states, business rules, NFRs, acceptance, architecture, implementation, test claims and estimates.
5. Reconcile the canonical Product Backlog and leave unresolved conflicts with an ID, owner and required evidence.

## 2. Remote snapshot inventory

| Branch/ref | Commit inspected | Changed/relevant artifacts | Finding |
|---|---|---|---|
| `origin/feat/member-1-initiation-estimation` | [`a060693`](https://github.com/tnnhuaa/InterviewQuestionBank/commit/a0606934f63da9497b574f092835197d55d08f10) | [Charter](https://github.com/tnnhuaa/InterviewQuestionBank/blob/a0606934f63da9497b574f092835197d55d08f10/docs/Project_Governance%20%26%20Stakeholder/Project_Charter.md), [Resource Plan](https://github.com/tnnhuaa/InterviewQuestionBank/blob/a0606934f63da9497b574f092835197d55d08f10/docs/Project_Resource_Plan/ResourcePlan.md), [Cost/Time/Resources](https://github.com/tnnhuaa/InterviewQuestionBank/blob/a0606934f63da9497b574f092835197d55d08f10/docs/Project_Resource_Plan/Cost_Time_Resources.md), [Estimate comparison](https://github.com/tnnhuaa/InterviewQuestionBank/blob/a0606934f63da9497b574f092835197d55d08f10/docs/Project_Resource_Plan/Estimation_Comparison.md) | Supplies proposed roles, date/capacity/budget and two whole-release estimates; not story estimates or Sponsor acceptance |
| `origin/feat/member-5-architecture-stack` | [`8d6a10f`](https://github.com/tnnhuaa/InterviewQuestionBank/commit/8d6a10fd2d262fe5f1c9e696569841858326b4b7) | [Architecture](https://github.com/tnnhuaa/InterviewQuestionBank/blob/8d6a10fd2d262fe5f1c9e696569841858326b4b7/docs/Project_Architecture/software_architecture.md), [ADR-001](https://github.com/tnnhuaa/InterviewQuestionBank/blob/8d6a10fd2d262fe5f1c9e696569841858326b4b7/docs/Project_Architecture/ADR/ADR-001-Technology-Stack.md), [ADR-002](https://github.com/tnnhuaa/InterviewQuestionBank/blob/8d6a10fd2d262fe5f1c9e696569841858326b4b7/docs/Project_Architecture/ADR/ADR-002-Booking-Consistency.md), [ADR-003](https://github.com/tnnhuaa/InterviewQuestionBank/blob/8d6a10fd2d262fe5f1c9e696569841858326b4b7/docs/Project_Architecture/ADR/ADR-003-Notification-Reliability.md) | Strong specification; explicitly pending valid PoC/design-review evidence |
| `origin/tri/poc` | [`e1d6911`](https://github.com/tnnhuaa/InterviewQuestionBank/commit/e1d691135497d6d10b786d539bb5888c4b0f8291) | `poc/` frontend, SQL, Express server, worker and scripts | Partial demo implementation; does not satisfy the architecture’s PoC contract or five acceptance gates |
| `origin/main` | [`6548e12`](https://github.com/tnnhuaa/InterviewQuestionBank/commit/6548e129d702facf741641dbfb2e38ddf392d310) | [Prototype Workflow](https://github.com/tnnhuaa/InterviewQuestionBank/blob/6548e129d702facf741641dbfb2e38ddf392d310/docs/Project_Prototype/Prototype_Workflow.md) | Detailed prototype specification, but no dedicated Member 2 branch, clickable frames/handoff or observed usability evidence found |
| `origin/feat/member-3-scope-backlog` | [`dca6a09`](https://github.com/tnnhuaa/InterviewQuestionBank/commit/dca6a09998f2082880525e41bb4899fa069278f6) | Vision, Backlog, Future Workflow, execution plan and AI validation | Prior Member 3 input; Product Backlog is superseded locally by version 0.3 after this audit |

No other remote head was advertised after the fetch. In particular, no `feat/member-2-*` branch was available. The expected Member 4 path `poc/mentor-booking-feedback/` was also absent; `tri/poc` uses a different root and contains no `POC_Result.md`.

## 3. Cross-document consistency matrix

| Concern | Proposal/Vision/Prototype | Governance/estimate | Architecture/ADR | PoC at `e1d6911` | Canonical backlog decision |
|---|---|---|---|---|---|
| Product boundary | Question Bank → Mentor → Booking → external meeting → Feedback; AI/video/payment automation excluded | Same 20-story Must boundary | Same; modular monolith, no AI/video/payment | Implements a narrow Question/Booking/Link/Feedback slice | Preserve R1 boundary; manual/free pilot treatment remains DEC-04 |
| Actors | Student, Mentor, Administrator | Hưng PO; Gia Thành PM; instructor Sponsor | Same product actors plus Operations/PO | IDs 1–3, role stored but trusted identity header | Keep three product roles; PoC identity is not acceptance evidence |
| Question governance | Published-only, taxonomy, provenance, no duplicate multi-tag results | Included in Must scope | Status/taxonomy/provenance and deterministic filtering | Questions have content/tags only; no status/provenance/pagination | US-04/18 + EN-06; PoC result is Partial |
| Mentor trust | Verification states and Admin decision/audit | Required R1 scope | Private evidence and object authorization | No mentor profile/verification | US-07/08; no implementation claim |
| Slot/booking invariant | At most one confirmed/occupying booking; exceptions audited | Critical technical gate | `CONFIRMED`, `COMPLETED`, `NO_SHOW` occupy; row lock/partial index/idempotency | Index protects only `Confirmed`; no idempotency; lock order differs | BR-02/10 + EN-03; PoC result Fail |
| Reschedule occupancy | Old/new slot and prior state must be auditable | Policy remains a risk | New slot not occupied before acceptance; old-slot behavior is under-specified when state becomes reschedule-proposed | Not implemented | DEC-03 and AC-12-03/AC-13-01 force old-slot preservation; ADR owner must select mechanism |
| Meeting-link privacy | Confirmed-only, only booking parties/authorized Admin | Private-data constraint | Object-level policy, restricted logging | Read route checks party IDs but not Confirmed state; Admin and secure identity are absent | US-14 + EN-04; PoC result Fail |
| Completion/feedback | Confirmed → Completed → feedback; authorized Mentor; structured rubric | Core value and KPI | Central state service, ownership, rubric, audit | Complete/feedback exist but do not verify owning Mentor; feedback is free text | US-15/16 + EN-04/05; PoC result Partial/Fail |
| Notification | Failure cannot roll back booking | Critical gate | Atomic outbox, dedup key, competing-worker claim, backoff, Dead/manual state | Simple polling/random outcome; no dedup/claim/backoff/dead state | BR-09 + EN-07; PoC result Fail |
| Delivery baseline | Prior Member 3 left estimate open | 12 weeks; 816h capacity; 688h working estimate; 756h guardrail; 20 Must stories | Architecture work included as foundation/PoC | No reliable effort/result report | Adopt as proposed whole-release baseline; per-story estimates/velocity still missing |
| Prototype/usability | Specification defines S01–S10, M01–M08, A01–A05 and ≥80% tasks | Prototype gate required | Route/story mapping | Frontend demos only three navigation views and a narrow happy slice | EN-01 remains Gap; do not call demo a completed clickable prototype/usability result |

## 4. Discrepancy register

| ID | Severity | Evidence-based discrepancy | Backlog response | Owner action / exit evidence |
|---|---|---|---|---|
| CONS-01 | High | No Member 2 remote branch, prototype frames, handoff or usability result was found. | EN-01 Gap; PB-G03/G07 Conditional | Hùng publishes immutable frame links/assets, handoff and observed task report mapped to ACs |
| CONS-02 | Medium | Local Feasibility still says schedule/resources are unresolved, while Member 1 proposes concrete values. | DEC-06 records proposed resolution, not approval | PM/Feasibility owner merges or updates the feasibility conclusion after Sponsor acceptance |
| CONS-03 | High | DEC-04 and DEC-05 were reused with different meanings between Vision and prior Backlog/Workflow. | Canonical register uses DEC-04 payment, DEC-05 privacy, DEC-08 MRF and DEC-09 reminders | Member 3 docs synchronized in this branch; other owners use the canonical IDs |
| CONS-04 | High | Confirmed-source reschedule can free the old slot if `RESCHEDULE_PROPOSED` replaces `CONFIRMED` while the partial index excludes it. | BR-02 and AC-12-03 require old-slot protection; DEC-03 remains open | PO/Architecture select proposal entity or equivalent invariant; update ADR/migration/test |
| CONS-05 | Medium | Feasibility names five PoC gates; ADR-001 lists those plus independent build and deployed session/CSRF gates. | EN-02 covers two delivery/stack gates; EN-03–07 cover five product-risk gates | Architecture/PoC report labels categories instead of claiming seven different product requirements |
| CONS-06 | High | Architecture expects `poc/mentor-booking-feedback/README.md`, `POC_Result.md`, migrations/tests/contracts; PoC supplies none at that path. | All PoC statuses remain Partial/Fail/Pending | Trí publishes required structure, commands, asserted results, limitations and immutable evidence |
| CONS-07 | Critical | `test_concurrency.js` calls `/api/bookings/accept`, but server exposes `/api/bookings/:id/accept`; it also omits the required identity header. `test_runner.js` uses two calls against one booking, not ≥20 competing bookings for one slot. | EN-03 Fail; AC-12-01 is the authoritative test contract | Replace test with ≥20 distinct bookings/requests on real PostgreSQL; assert one owner, conflicts, invariant, transition/event counts |
| CONS-08 | Critical | PoC trusts `X-User-Id` and does not enforce owning Mentor/role on accept, complete or feedback. | EN-02/04 Fail; NFR-01/05 not met | Implement accepted session topology and negative role/relationship matrix; retain results |
| CONS-09 | High | PoC index covers only `Confirmed`; audit lacks actor/reason; no idempotency records; lock order is booking then slot rather than ADR slot then booking. | BR-02/08/10 and EN-03/05 define the required invariant | Align migration/service with ADR or revise ADR through review; prove conflict/idempotency/audit behavior |
| CONS-10 | High | PoC Question test proves only one tag-intersection example; Questions have no lifecycle/provenance and no pagination/sort. | EN-06 Partial, never Pass | Add zero/one/many, multi-tag, Draft leak, deterministic pagination/sort and provenance tests |
| CONS-11 | Critical | Notification test increments `passCount` without an assertion. Worker has no deduplication key, claim lock, scheduled backoff, Dead state or deterministic provider control. | EN-07 Fail; AC-19-01/02 are authoritative | Use controllable fake provider, competing workers and database assertions; publish result/limitations |
| CONS-12 | Critical | Remote PoC tree tracks `poc/.env` and `poc/node_modules/`. No secret value was read during this audit. | NFR-05 and DoD fail repository hygiene | Remove tracked generated/development secret files, rotate any real credential, add ignore rules and verify history/CI secret scan |
| CONS-13 | High | PoC UI is a demo slice, not the complete S/M/A prototype specification and does not establish usability success. | EN-01 Gap; UI presence is not customer acceptance | Map frames/routes to all R1 stories or explicitly identify the tested MRF; run observed tasks and publish evidence |
| CONS-14 | High | Member 1’s 688/756-hour values are whole-release work-package forecasts. No story estimates or measured velocity range exist. | Release remains Conditional; no invented will-have/might-have line | Development Team sizes stories/enablers and PM records faster/slower velocity/reforecast |
| CONS-15 | Medium | Member 1 counts 20 Must stories while Review/Admin minimality was previously an open decision. Proposal/Charter include them. | DEC-08 proposes US-17/20 as Must to preserve the 20-story baseline | PO confirms or cuts them and re-estimates/rebaselines with an explicit change record |

## 5. PoC gate evaluation

| Gate | Required evidence | Observed evidence | Result |
|---|---|---|---|
| POC-1 Booking consistency | ≥20 concurrent competing confirmations; one occupied booking; stable conflict/idempotency; one transition/event | Separate script targets a nonexistent route; runner tests two requests on one booking and expects 400 for the loser | **Fail** |
| POC-2 Authorization | Student A/B, Mentor A/B, Admin matrix for booking, link, feedback, verification; server-side identity | One unrelated Student link denial; identity is a caller-controlled header; mutation ownership missing | **Fail** |
| POC-3 Transition/audit | Happy and invalid state paths, actor ownership, retry, actor/reason/time, no bypass | Pending→Confirmed→Completed and one invalid jump; actor/reason and exception paths absent | **Partial — not Pass** |
| POC-4 Question filtering | Zero/one/many, multi-tag, Draft exclusion, deterministic pagination, no duplicate | One intersection example returning Question 3 | **Partial — not Pass** |
| POC-5 Notification resilience | Commit despite timeout/5xx, deduplication, competing worker claim, configured retries, Dead/manual recovery | Random worker and unasserted `passCount++`; missing required states/keys/locking | **Fail** |
| Stack gate A | Independent frontend build, backend test and migration in CI | Frontend scripts exist; backend `npm test` intentionally exits 1; no CI evidence | **Fail/not evidenced** |
| Stack gate B | Deployed same-origin session, protected API and negative CSRF test | Permissive CORS plus `X-User-Id`; no deployed evidence | **Fail/not evidenced** |

The architecture correctly states that it is pending PoC. This audit therefore does not reject the architecture specification; it rejects the claim that the current PoC has validated it.

## 6. Evaluation against refs (single source of truth)

| Ref criterion | Source | Evaluation of revised backlog | Reason |
|---|---|---|---|
| Comprehensive Product Backlog | [Scrum, Slide 014](../refs/04-02-scrum-development-process.md#slide-014--the-product-backlog) | **Pass structurally** | 23 stories, eight delivery PBIs, BR/NFR/AC, decisions and release controls are included |
| PO orders highest value first | [Scrum, Slide 015](../refs/04-02-scrum-development-process.md#slide-015--the-product-owner-2) | **Conditional** | Explicit Order 1–23 exists; Hưng’s human confirmation is pending |
| Release Backlog contains next-release stories/object mapping | [Scrum, Slide 019](../refs/04-02-scrum-development-process.md#slide-019--release-backlog) | **Pass structurally** | R1 Must/Stretch/Future and RTM/domain/workflow mapping are explicit |
| Release focuses on MRF and is replanned | [Agile Planning, Slides 011 and 014–016](../refs/06-1-agile-planning.md#slide-011--2-create-a-product-roadmap) | **Conditional** | Proposed 20-story MRF exists; stakeholder consensus and sprint replanning evidence do not |
| PBIs created, estimated and prioritized with velocity range | [Agile Planning, Slides 021–025](../refs/06-1-agile-planning.md#slide-021--7-create-a-fixed-date-release-plan-i) | **Fail/Gap** | Whole-release forecasts are not story sizing; velocity/will-have/might-have lines are absent |
| Stories understandable, valuable and customer-verifiable | [Planning, Slide 079](../refs/06-software-project-planning.md#slide-079--sales-tip-5-real-business-requirements) | **Conditional** | Wording/value/AC trace is present, but customer/team walkthrough is not |
| DoD includes review/test/integration/deployment/docs/PO acceptance | [Scrum, Slides 035–036](../refs/04-02-scrum-development-process.md#slide-035--example-dod-1) | **Pass as definition; Fail/Pending as evidence** | Revised DoD covers criteria; current PoC cannot satisfy it |
| 100% in-scope decomposition | [WBS, Slides 007, 019, 033](../refs/05-1-work-breakdown-structure.md#slide-007--how-to-create-wbs-round-1) | **Pass structurally/Conditional quantitatively** | Stories plus cross-cutting PBIs cover the declared release; team must reconcile their size to estimate packages |
| RTM and stakeholder inspection | [Monitoring, Slides 039–042](../refs/09-software-project-monitoring-and-control.md#slide-039--9-validate-scope) | **RTM Pass; inspection Pending** | Origin-to-deliverable/value links exist; accepted-deliverable decision does not |
| Prototype/bad/malicious input testing | [Quality, Slide 007](../refs/11-software-quality-management.md#slide-007--how-to-meet-user-requirements) | **Conditional/Gap** | Negative/concurrency/provider criteria exist; observed prototype/PoC evidence is incomplete |

## 7. Required owner handoff before approval

| Owner | Required next action |
|---|---|
| Hưng / PO | Audit Order, R1 boundary, DEC-02/03/04/05/07/08/09 and accept/revise each R1 story/AC |
| Gia Thành / PM | Integrate the proposed delivery baseline, obtain Sponsor decision, drive story sizing/velocity and update Feasibility/plan |
| Hùng / UX | Publish prototype/handoff/usability artifacts and trace observed findings to stories/ACs |
| Trí / PoC | Rebuild tests to the EN-03–EN-07 contracts, publish `POC_Result.md`, remove hygiene risks and never self-pass an unasserted gate |
| Luân / Architecture | Review actual PoC, resolve reschedule occupancy/session topology, and update ADR status through a recorded review |
| Sponsor / instructor | Inspect the Release Backlog, proposed budget/capacity/date and unresolved policy risk; record Accept/Revise/No-Go |

## 8. Conclusion

The revised Product Backlog is internally structured and traceable enough for Hưng’s human review. It is **not Approved and not implementation-complete**. The strongest remaining blockers are customer/prototype evidence, story estimates/velocity, booking policy/reschedule design, privacy/link authority, and a valid PoC for concurrency, authorization, transition/audit, filtering and notification reliability.
