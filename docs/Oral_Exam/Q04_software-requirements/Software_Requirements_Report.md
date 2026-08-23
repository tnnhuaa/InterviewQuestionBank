# Software Requirements and Product Backlog Report

## Document control

| Field | Value |
| --- | --- |
| Project | PrepVI — Interview Practice Platform |
| Version | 1.0 |
| Reporting date | 23 August 2026 |
| Status | Current project report based on versioned repository evidence |
| Primary artifacts | Product Backlog and Acceptance Criteria; Vision and Scope; Future-State Workflow |

## 1. Executive summary

This report describes how PrepVI converts product scope into ordered and testable software requirements. The project uses User Stories, Acceptance Criteria, Business Rules, Non-functional Requirements, release classification, dependencies and traceability to control what is built and how completion is evaluated.

The current backlog contains 27 R1 Must stories with 134 Story Points, two R1 Extended stories with 8 Story Points, and one Future/Maybe story with 8 Story Points. These figures describe the release baseline. The presence of implementation code does not by itself prove Product Owner acceptance or User Acceptance Testing completion.

## 2. Purpose and scope

The requirements baseline is used to:

- define the behavior expected by Students, Mentors and Administrators;
- align product, interface, architecture, implementation and testing work;
- distinguish required, extended and future capabilities;
- provide observable conditions for accepting a story; and
- control the impact of requirement changes.

The report covers the JD-to-preparation-plan flow, Question Bank and practice, Mentor discovery, booking, controlled meeting-link access, feedback, review, notifications and administration.

## 3. Requirement model

| Element | Project use |
| --- | --- |
| Functional requirement | Defines a service or behavior supplied by the system |
| Non-functional requirement | Defines a measurable quality attribute or constraint |
| Business rule | Defines a domain policy shared by one or more stories |
| User Story | Describes an actor, need and expected value |
| Acceptance Criteria | Defines observable pass/fail conditions for a story |
| Definition of Ready | Defines when a story is sufficiently understood to enter delivery |
| Definition of Done | Defines the common completion standard across stories |
| Traceability record | Connects objectives, workflows, stories, rules, tests and evidence |

Acceptance Criteria are verification contracts. They are not statements that a feature has already passed testing or been formally accepted.

## 4. Inputs and development method

The requirements were derived from the Project Charter, Vision and Scope, current and future workflows, prototype, stakeholder needs, architecture constraints and product decisions.

The team applied the following process:

1. normalize actors and product terminology;
2. group needs into product capabilities;
3. write actor–need–value User Stories;
4. identify dependencies and release boundaries;
5. define Business Rules and measurable quality requirements;
6. write testable Acceptance Criteria;
7. estimate stories relatively with Story Points;
8. order the backlog by value, risk and dependency; and
9. link stories to workflows, tests and supporting evidence.

## 5. Release baseline

| Classification | Stories | Story Points | Interpretation |
| --- | ---: | ---: | --- |
| R1 Must | US-01–US-20 and US-24–US-30 | 134 | Required release scope |
| R1 Extended | US-21–US-22 | 8 | Included only when Must work and capacity remain safe |
| Future/Maybe | US-23 | 8 | Not part of the current R1 commitment |

Implementation of US-21, US-22 or US-23 does not automatically change this classification. A release-scope decision must update the backlog and its impact on capacity, dependencies, contracts and validation.

## 6. Acceptance and traceability controls

A story is considered ready only when its actor, value, Acceptance Criteria, dependencies, estimate, rules and evidence needs are sufficiently clear. A story is considered done only when the applicable code, review, database, contract, security, documentation and validation requirements are satisfied.

Traceability follows this chain:

`Product objective → Future-State Workflow → User Story → Acceptance Criteria and Business Rules → API/UI/database implementation → test or manual evidence → acceptance decision`

Private-object authorization, booking consistency and recovery behavior are treated as cross-cutting controls rather than isolated interface details.

## 7. Change control

A proposed requirement change is recorded, classified and assessed before the release baseline is changed. The impact review covers business value, Story Points, dependency order, architecture, API/schema changes, security/privacy, test evidence and release timing. Extended and future work is not silently moved into R1 Must.

## 8. Evidence

![Product Backlog release boundary displayed in GitHub](img/Q04-01-product-backlog-github.png)

**Figure 1.** The versioned Product Backlog displayed in the real GitHub file view at the release-boundary section.

![Product Backlog history displayed in GitHub](img/Q04-02-backlog-history-github.png)

**Figure 2.** The real GitHub history window for the Product Backlog artifact.

## 9. Limitations

- The repository does not contain a signed requirements-baseline approval.
- Implementation presence is not equivalent to complete UAT or formal story acceptance.
- Proposed quality targets must not be reported as achieved without a defined dataset and retained measurement.
- The current release classification remains authoritative until a recorded scope decision changes it.

## 10. Source artifacts

- [Product Backlog and Acceptance Criteria](../../Project_Vision_and_Scope/Product_Backlog_and_Acceptance_Criteria.md)
- [Project Vision and Scope](../../Project_Vision_and_Scope/Project_Vision_and_Scope.md)
- [Future-State Workflow](../../Project_Vision_and_Scope/Future_State_Workflow.md)
- [Project Charter](../../Project_Governance%20&%20Stakeholder/Project_Charter.md)
