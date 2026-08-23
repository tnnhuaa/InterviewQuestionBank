# PrepVI Software Process Definition

## Document control

| Field | Value |
| --- | --- |
| Project | PrepVI — Interview Practice Platform |
| Process baseline | Tailored Scrum with iterative and incremental development |
| Scope | From product discovery and backlog definition to an integrated, tested pilot increment |
| Process owner | Project Manager / Scrum Master |
| Approval roles | Product Owner for product acceptance; Technical Lead for technical gates; Team Lead/Sponsor for major scope and release decisions |
| Status | Defined baseline reconstructed and checked against the project repository |

## 1. Purpose, scope, and application

### 1.1 What this process defines

This document defines how the PrepVI team turns an identified user problem into a prioritized backlog, design decisions, source code, verified increments, and a pilot-ready release. It describes the life cycle, phases, activities, roles, inputs, outputs, work products, tools, checkpoints, entry criteria, and exit criteria used by the team.

The process covers:

- product discovery, vision, scope, and feasibility;
- backlog creation, refinement, estimation, and release planning;
- architecture, prototype, and technical-risk validation;
- sprint planning and implementation;
- inspection, testing, integration, and product acceptance;
- review, adaptation, UAT, and release readiness;
- change, risk, defect, and configuration control.

### 1.2 Why the project needs a defined process

A defined process answers the management questions: what should happen next, how the work is performed, how long it may continue, which artifacts it consumes and produces, who is accountable, and what evidence permits the work to move forward. For PrepVI, this prevents independent frontend, backend, database, architecture, and product decisions from drifting apart. It also makes security, booking consistency, notification reliability, JD-processing quality, and acceptance evidence explicit rather than relying on individual memory.

### 1.3 When the process applies

The process starts when a product problem or change request is proposed. It is applied during backlog refinement, every planned sprint, integration, release preparation, and maintenance. Feedback from a review, failed test, technical spike, user evaluation, or production-like walkthrough returns to the appropriate earlier activity instead of being handled through uncontrolled code-and-fix work.

## 2. Process model selection and tailoring

### 2.1 Selected model

PrepVI uses a **Scrum-based, time-boxed iterative and incremental development process**. The release baseline contains four planned two-week sprints. Each sprint is a small development cycle that includes requirement clarification, analysis, design, implementation, inspection, testing, and integration, and aims to produce a stable, integrated, tested increment.

This choice follows the course definitions:

- iterative and incremental development divides the life cycle into iterations and functionality into increments;
- a sprint has a fixed end, while scope may be adjusted according to evidence and capacity;
- working software and retained verification evidence are the primary measures of progress;
- the Product Backlog evolves, but entry and completion gates protect quality.

### 2.2 Why this model fits PrepVI

PrepVI had a clear product direction but uncertain details and technical risks. The team needed early feedback on the JD-first workflow, OCR/extraction, rule-based matching, authorization, concurrent booking, and notification retry. A sequential Waterfall baseline would defer too much feedback until late development. A full Spiral process would add disproportionate risk-analysis overhead for a small pilot team. The V-model's verification discipline is useful, but its sequential decomposition is not the primary life-cycle structure.

Scrum and iterative development fit because the team can prioritize the core JD-to-feedback loop, validate risky behavior early with prototype/PoC work, integrate in small increments, and move lower-value scope when capacity or evidence changes.

### 2.3 Project-specific tailoring

The team does not use unmodified Scrum. The process adds the following controls:

- a Discovery and Charter baseline before sprint delivery;
- prototype and feasibility checks for product and usability risk;
- Architecture Decision Records and technical review for high-impact decisions;
- explicit Definition of Ready and Definition of Done gates;
- PostgreSQL-based tests for transactional and authorization invariants;
- Pull Request review and GitHub Actions integration checks;
- security/privacy review for JD files, meeting links, feedback, and access ownership;
- UAT and release-readiness gates before a pilot is accepted.

This is therefore a lightweight empirical process with defined engineering and governance checkpoints.

## 3. Life-cycle structure

The high-level flow is shown below. Solid forward paths create an increment; feedback paths return work to the backlog or implementation activity.

![PrepVI software process overview](img/software-process-overview.png)

The editable definition behind this diagram follows this flow:

`Discovery → Product Backlog → Refinement/DoR → Sprint Planning → Analysis and Design → Implementation → Inspection and Testing → Pull Request/CI → DoD and Product Review → Increment → UAT/Release or next Sprint`

The life cycle has three hierarchical groups:

1. **Pregame — Initiation and release planning:** establish the product goal, feasibility, scope, backlog, architecture direction, release boundary, team, and capacity.
2. **Game — Iterative sprint delivery:** refine, plan, build, inspect, test, integrate, review, and adapt through time-boxed sprints.
3. **Postgame — UAT and release:** integrate the release candidate, resolve blocking defects, prepare operational material, obtain acceptance evidence, and make the release decision.

Activities may overlap. For example, refinement for the next sprint may occur while the current increment is being completed, but a story cannot enter implementation without satisfying the readiness gate.

## 4. Roles and responsibilities

| Role | Process responsibility | Decision authority |
| --- | --- | --- |
| Sponsor / Lecturer | Reviews major Go/No-Go points and the project baseline | Approves or rejects major scope and pilot decisions |
| Product Owner / Business Analyst | Owns product vision, backlog ordering, business rules, acceptance criteria, and story acceptance | Accepts/rejects stories and prioritizes product scope |
| Project Manager / Scrum Master | Facilitates planning/refinement, tracks capacity, dependencies, risks, impediments, and process evidence | Escalates baseline variance and facilitates process changes |
| Team Lead / Governance | Coordinates workstreams, resolves escalation, checks configuration and release readiness | Confirms cross-team priority and readiness decisions |
| Architecture / Technical Lead | Reviews architecture impact, NFRs, security, consistency, reliability, and technical decisions | Accepts technical baselines and requests a PoC or ADR when needed |
| UI/UX | Defines workflows and prototypes and collects usability evidence | Confirms UI handoff and usability findings |
| Development Team | Analyzes, designs, implements, reviews, tests, documents, and integrates the increment | Owns estimates and the implementation plan for selected stories |
| PoC / E2E / QA responsibility | Prepares test data, validates technical risks and end-to-end behavior, and retains results | Reports pass/fail evidence; does not waive failed acceptance criteria |

The team is cross-functional, so one member may perform more than one delivery responsibility. Product, architecture, quality, security/privacy, and release ownership must never be left unassigned.

## 5. Phase definitions

### 5.1 Phase A — Initiation and release planning

| Element | Definition |
| --- | --- |
| Purpose | Establish why the product should be built, who it serves, the pilot boundary, feasibility, governance, capacity, and initial release goal. |
| Entry criteria | A product problem or opportunity has been proposed and an accountable sponsor/team is available. |
| Inputs | Problem evidence, stakeholder needs, course requirements, constraints, assumptions, and available team capacity. |
| Roles | Sponsor, Product Owner, Project Manager/Scrum Master, Team Lead, UI/UX, Technical Lead, Development/PoC representatives. |
| Activities and tools | Kick-off; stakeholder and problem analysis; Vision & Scope; prototype/PoC planning; initial estimation; risk and feasibility review. Markdown and Git store baselines; prototype artifacts support workflow validation. |
| Deliverables | Charter, stakeholder analysis, Vision & Scope, feasibility study, prototype workflow, initial Product Backlog, Resource Plan, architecture direction, and release boundary. |
| Checkpoint | Problem, scope, capacity, key risks, and release objective are reviewed together. |
| Exit criteria | Product goal and R1 boundary are explicit; roles are assigned; initial backlog exists; major feasibility risks have owners and planned validation; Go/No-Go conditions are recorded. |

### 5.2 Phase B — Backlog refinement and readiness

| Element | Definition |
| --- | --- |
| Purpose | Convert product scope and feedback into ordered, testable, estimable stories that can be completed within a sprint. |
| Entry criteria | A Product Backlog or an approved change request exists. |
| Inputs | Vision/scope, business rules, workflow/prototype, architecture constraints, defects, review feedback, risks, and previous increment results. |
| Roles | Product Owner, Scrum Master, Development Team, Architecture, UI/UX, and QA/PoC responsibility. |
| Activities and tools | Clarify actor and value; write Given/When/Then acceptance criteria; identify dependencies and NFRs; link workflow/design/API/data inputs; estimate with the agreed Fibonacci scale; split oversized stories; prepare test data and expected results. |
| Deliverables | Ordered Product Backlog, refined stories, acceptance criteria, dependency/traceability links, estimates, and candidate Sprint Backlog items. |
| Checkpoint | Definition of Ready review. |
| Exit criteria | Only stories satisfying every applicable DoR condition may be selected for Sprint Planning. Unready work remains in the Product Backlog. |

### 5.3 Phase C — Sprint planning

| Element | Definition |
| --- | --- |
| Purpose | Select a coherent sprint goal and a feasible set of Ready stories within team capacity. |
| Entry criteria | Ordered Ready stories, current capacity, known carry-over, dependencies, and risks are available. |
| Inputs | Product Backlog, release goal, estimates, capacity/reserve, architecture decisions, and prior sprint evidence. |
| Roles | Product Owner, Scrum Master, Development Team; Technical Lead and QA participate for affected work. |
| Activities and tools | Agree the Sprint Goal; select stories without exceeding credible capacity; break stories into tasks; identify owners, integration order, test needs, and blockers; reserve effort for review, testing, defects, learning, and risk. |
| Deliverables | Sprint Goal, Sprint Backlog, task/dependency plan, test approach, and risk actions. |
| Checkpoint | Product Owner and Development Team agree on the goal and selected scope; the team owns the implementation estimate. |
| Exit criteria | Selected work is Ready, feasible for the timebox, testable, and has no unresolved dependency that makes the Sprint Goal impossible. |

### 5.4 Phase D — Sprint execution: analyze, design, build, inspect, and test

| Element | Definition |
| --- | --- |
| Purpose | Produce a working, reviewed, tested increment that satisfies the Sprint Goal and applicable NFRs. |
| Entry criteria | Sprint Goal and Sprint Backlog are agreed; required environments and inputs are available. |
| Inputs | Ready stories, acceptance criteria, prototype/workflow, ADRs, API/data contracts, test data, and coding conventions. |
| Roles | Development Team, Architecture/Technical Lead, UI/UX, QA/PoC responsibility, and Product Owner for clarification. |
| Activities and tools | Analyze the story; update design/API/data contracts when required; implement React/Express/PostgreSQL changes; write or update tests; perform peer inspection; commit through Git; open/review a Pull Request; run CI; correct defects and re-run failed checks. |
| Deliverables | Source code, unit/integration/policy tests, migrations, API contracts, updated documentation, review record, CI result, and a deployable integrated build. |
| Checkpoints | Technical review for high-risk decisions; peer review; automated integration checks; story-level verification against AC/NFR. |
| Exit criteria | All applicable DoD conditions are met. A failed review, test, build, migration, security check, or acceptance criterion returns the work to implementation and does not produce a Done story. |

### 5.5 Phase E — Sprint review, retrospective, and replanning

| Element | Definition |
| --- | --- |
| Purpose | Inspect the increment and the way of working, accept demonstrated value, and adapt the Product Backlog and process. |
| Entry criteria | The sprint timebox ends and the integrated increment plus evidence are available. |
| Inputs | Sprint Goal, increment, acceptance evidence, unresolved defects, CI results, capacity/carry-over, stakeholder feedback, and risk status. |
| Roles | Product Owner, Scrum Master, Development Team, relevant stakeholders, and technical/quality reviewers. |
| Activities and tools | Demonstrate Done behavior; accept or reject stories; record defects and feedback; compare planned and completed work; review risks and impediments; agree one or more process improvements; reorder/re-estimate the backlog. |
| Deliverables | Accepted increment, updated Product/Release Backlog, defect records, review evidence, retrospective actions, and a revised forecast. |
| Checkpoint | Product acceptance is based on AC/NFR evidence, not presentation alone. |
| Exit criteria | Story states are accurate; rejected or incomplete work is returned to the backlog; feedback, risks, and improvement actions have owners; the next planning baseline is updated. |

### 5.6 Phase F — UAT and release

| Element | Definition |
| --- | --- |
| Purpose | Verify the integrated core workflow in its target-like environment and decide whether the pilot release is ready. |
| Entry criteria | Required R1 stories are Done; a release candidate can be built and deployed; UAT scenarios and participants are available. |
| Inputs | Integrated build, release backlog, test/UAT plan, migration and seed procedure, user/deployment guidance, known defects, and release risks. |
| Roles | Product Owner, Project Manager/Scrum Master, Team Lead, Development/QA, Technical Lead, and pilot users. |
| Activities and tools | Deploy the release candidate; perform smoke, critical workflow, negative authorization, migration, and UAT checks; triage defects; update guidance and evidence; evaluate Go/No-Go criteria. |
| Deliverables | Release candidate, UAT/test results, defect disposition, deployment/user guidance, release evidence, and Go/No-Go decision. |
| Checkpoint | No open Critical/High defect; critical workflows pass; Product Owner accepts the intended behavior; unresolved limitations are explicit. |
| Exit criteria | A Go decision produces the pilot increment and retained evidence. A No-Go decision returns affected items to the backlog with priority, owner, and corrective action. |

## 6. Definition of Ready

A story is Ready only when all applicable conditions below are satisfied:

1. The actor, user value, priority, and business outcome are clear.
2. Acceptance criteria are testable and use Given/When/Then where appropriate.
3. Dependencies, business rules, privacy/security constraints, and applicable NFRs are identified.
4. Required workflow, prototype, API, data, architecture, or provider inputs are available.
5. The implementation follows approved product/technical decisions, or an approved change record exists.
6. The Development Team has estimated the story using the agreed relative scale.
7. An eight-point story is split or explicitly accepted as a sprint exception.
8. Test data and expected results exist for extraction, analysis, matching, booking, and other evidence-sensitive work.
9. Product Owner, implementer, and QA responsibility agree that the story can be implemented and verified within the sprint.

Failure of any required condition keeps the item in refinement; urgency alone does not bypass DoR.

## 7. Definition of Done

A story or increment is Done only when:

1. applicable acceptance criteria and NFRs pass and evidence is retained;
2. the Product Owner accepts the demonstrated business behavior;
3. code follows project conventions and has been reviewed by another team member;
4. relevant unit, integration, end-to-end, policy, negative authorization, or concurrency tests pass;
5. PostgreSQL—not only mocks—is used to prove database concurrency, state-machine, authorization, and outbox invariants when applicable;
6. the build succeeds and applicable lint, type, API drift, migration replay, seed, and secret checks pass;
7. database migrations, API contracts, audit/observability behavior, and documentation are updated;
8. secrets, unnecessary JD content, and personal data are absent from the repository and logs;
9. the integrated build is deployed or run in the target-like environment and smoke-checked by another member;
10. no open Critical/High defect blocks the story or release;
11. the release backlog, plan/forecast, guidance, and evidence links are updated.

Partially implemented work is not counted as Done and returns to the Product Backlog or defect flow.

## 8. Work products and traceability

| Work product | Created or updated by | Used as input for | Acceptance/control |
| --- | --- | --- | --- |
| Charter and stakeholder baseline | PM/Scrum Master, Product Owner, Sponsor | Vision, scope, governance, release planning | Sponsor/Go-No-Go review |
| Vision & Scope and workflow | Product Owner/BA, UI/UX | Product Backlog, prototype, acceptance criteria | Product baseline review |
| Product/Release Backlog | Product Owner with team | Refinement, Sprint Planning, release decision | Ordered, traceable, estimated, and current |
| Sprint Backlog and Sprint Goal | Development Team with PO/SM | Sprint execution | Capacity and DoR review |
| Prototype and usability evidence | UI/UX and participants | Requirement clarification and acceptance design | Task completion/feedback evidence |
| Architecture and ADRs | Technical Lead with reviewers | Design, implementation, technical validation | Decision status and evidence review |
| Source, migrations, and API contracts | Development Team | Build, integration, testing, deployment | Peer review and automated checks |
| Test data, tests, and results | Development/QA/PoC responsibility | Story acceptance, UAT, release gate | Expected-versus-actual result retained |
| Increment and release candidate | Development Team | Sprint Review, UAT, pilot | DoD and release gate |
| Review, defect, risk, and improvement records | PO/SM/Team | Replanning and process improvement | Owner, state, priority, and follow-up |

Traceability follows this chain:

`Product objective → requirement/user story → acceptance criteria and NFR → workflow/design/ADR → code/API/migration → test evidence → accepted increment`

## 9. Control procedures

### 9.1 Requirement and scope change

The Product Owner reviews each change for value, priority, acceptance criteria, dependency, estimate, traceability, and release impact. Architecture, UX, QA, and Development review affected contracts and evidence. Changes that exceed the release capacity/budget baseline or materially change the core workflow require an explicit PO/Sponsor decision. Lower-priority Should/Could work is moved before mandatory quality controls are removed.

### 9.2 Technical decision and risk

A high-impact or difficult-to-reverse decision requires an ADR or recorded technical review. A risky assumption is validated with a spike, PoC, prototype, benchmark, or test before broad implementation. Evidence may confirm, revise, or supersede a decision; it must not silently rewrite the original rationale.

### 9.3 Defect handling

Defects are reproduced, classified, linked to affected behavior, assigned, fixed, reviewed, and regression-tested. Critical/High defects block Done/release. A failed test or CI check returns work to implementation. Lower-severity accepted limitations require an owner and explicit disposition.

### 9.4 Configuration and integration

Git is the configuration baseline. Changes use focused commits and Pull Request review before integration to `main`. Documentation, API contracts, migrations, seed behavior, and source changes are versioned together when they form one product change. CI checks the integrated state rather than relying only on a developer's local environment.

### 9.5 Release control

A release decision uses retained test/UAT results, known-defect status, migration/deployment readiness, privacy/security checks, and Product Owner acceptance. Release is a decision gate, not an automatic result of reaching the end of the schedule.

## 10. Tools and project configuration

| Need | Project tool/configuration | Evidence or control |
| --- | --- | --- |
| Version control and integration | Git and GitHub | Commit history, merged PR references, versioned project artifacts |
| Backlog and decisions | Versioned Markdown; GitHub Issues/Projects when used | Backlog, acceptance criteria, ADRs, and change history |
| Prototype and workflow | Figma/prototype images plus Markdown workflow specification | Screen-flow traceability and usability scenarios |
| Implementation | React/Vite frontend, Express backend, PostgreSQL | Source, package scripts, schema/migrations, API contracts |
| Review | Pull Request and peer review | Reviewable change set before integration |
| Continuous integration | GitHub Actions on push and pull request | Install, lint, typecheck, OpenAPI drift, migration replay, reference-seed verification, build, and Gitleaks scan |
| Testing | Project test suites and PostgreSQL-backed checks where required | Unit/integration/policy/regression evidence |
| Documentation | Markdown in the repository | Versioned process, product, architecture, test, and operating knowledge |

## 11. Monitoring, evaluation, and improvement

### 11.1 Defined monitoring

At each sprint boundary, the team should inspect delivered scope, carry-over, blockers, defects, risks, capacity, and the forecast. Velocity is the long-term amount of completed work per iteration and must be calculated only from Done work. A burn-down chart may show remaining sprint work, but neither metric replaces acceptance or quality evidence.

The process is evaluated using **Evidence → Criteria → Judgement**:

1. define a criterion such as DoR, DoD, Sprint Goal, acceptance criterion, NFR, or release gate;
2. collect evidence from the backlog, source, review, CI, test, deployment, or user evaluation;
3. judge Pass, Fail, or Pending and record the action;
4. update the backlog, risk, process, or technical baseline when evidence differs from the assumption.

### 11.2 Repository evidence observed

The repository currently provides evidence of:

- an ordered Product Backlog with acceptance criteria, NFRs, DoR, DoD, release planning, and change-control rules;
- versioned Charter, Resource Plan, Vision & Scope, prototype workflow, feasibility, architecture, and ADR artifacts;
- incremental source history and commits containing Pull Request identifiers;
- frontend and backend test files, including booking, idempotency, JD matching, mentor, policy, and regression coverage;
- a GitHub Actions workflow that runs on pushes and pull requests;
- automated lint, typecheck, OpenAPI drift, migration replay, reference-seed, build, and secret-scan controls.

### 11.3 Gaps and improvement actions

The repository does not by itself prove that Daily Scrum, Sprint Review, Sprint Retrospective, burn-down/velocity tracking, or UAT were consistently performed. These activities must be supported by meeting notes, board snapshots, review decisions, metrics, or UAT results before they are reported as completed practice.

The current CI workflow does not invoke the repository's `npm test` script even though test files exist. The process therefore requires retained test evidence, but automated test execution in CI remains an improvement action. Recommended improvements are:

1. add the relevant automated test command to CI and retain the result;
2. store one concise Sprint Review and Retrospective record per sprint;
3. retain Sprint Goal, committed/completed scope, carry-over reason, and velocity evidence;
4. store UAT scenarios, actual results, defect disposition, and the final release decision;
5. update this definition when the team's observed process differs from the prescribed baseline.

## 12. Strengths and limitations

### Strengths

- Early and repeated feedback reduces the cost of misunderstanding requirements.
- Timeboxes and ordered scope protect the schedule while allowing empirical adjustment.
- DoR, DoD, architecture/PoC gates, and CI provide stronger control than informal code-and-fix work.
- Small integrated increments reveal interface, database, security, and workflow risks earlier.
- Versioned artifacts improve communication, review, traceability, and redesign support.

### Limitations

- The process depends on disciplined refinement, evidence retention, and Product Owner availability.
- A small cross-functional team may create role overlap and single-person dependencies.
- Without reliable sprint records, velocity and process conformance cannot be demonstrated.
- Iterative delivery can accumulate architectural debt if short-term increments bypass technical review.
- Ceremonies and documentation become waste if they do not support a decision, artifact, quality gate, or feedback loop.

## 13. References and evidence sources

### Course references used to define the process

- [Software Development Life Cycle Model](../../refs/04-software-development-life-cycle-model.md): SDLC elements and the phase-definition template of purpose, entry criteria, inputs, roles, tasks, flow, deliverables, checkpoints, outputs, and exit criteria.
- [Software Development Models](../../refs/04-01-software-development-models.md): Waterfall, iterative/incremental, evolutionary, Spiral, and V-model characteristics and trade-offs.
- [Scrum Development Process](../../refs/04-02-scrum-development-process.md): Scrum roles, activities, work products, phases, DoD, review, retrospective, velocity, and adaptation.
- [Oral-exam process template](../template/03-template-mo-hinh-quy-trinh.md): WHAT–WHY–WHEN, project-specific flow, inputs/outputs, tools, evidence, and improvement requirements.

### PrepVI sources used to tailor and verify the definition

- [Project Charter](../../Project_Governance%20&%20Stakeholder/Project_Charter.md)
- [Resource Plan](../../Project_Resource_Plan/ResourcePlan.md)
- [Vision and Scope](../../Project_Vision_and_Scope/Project_Vision_and_Scope.md)
- [Product Backlog and Acceptance Criteria](../../Project_Vision_and_Scope/Product_Backlog_and_Acceptance_Criteria.md)
- [Prototype Workflow](../../Project_Prototype/Prototype_Workflow.md)
- [Feasibility Study](../../Project_Feasibility/feasibility.md)
- [Software Architecture](../../Project_Architecture/software_architecture.md)
- [CI workflow](../../../.github/workflows/ci.yml)

## 14. Print checklist

- [ ] The process overview diagram is visible and readable.
- [ ] Every phase includes purpose, entry criteria, inputs, roles, activities, deliverables, checkpoint, and exit criteria.
- [ ] Definition of Ready and Definition of Done are included.
- [ ] Defined practice is distinguished from repository-observed evidence.
- [ ] Gaps and improvement actions are not presented as completed activities.
- [ ] The printed version includes this document only as the required Software Process Definition attachment.
