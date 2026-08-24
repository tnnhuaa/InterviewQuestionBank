# DevOps Implementation and Infrastructure Report

## Document control

| Field | Value |
| --- | --- |
| Project | PrepVI - Interview Practice Platform |
| Version | 1.1 |
| Reporting date | 24 August 2026 |
| Status | Current-state report based on versioned repository and retained runtime evidence |
| Platforms | GitHub Actions, Render, Supabase PostgreSQL and Terraform |

## 1. Executive summary

PrepVI uses Git and GitHub for version control and review, GitHub Actions for automated quality and secret-scanning checks, Render Git integration for API and frontend deployment, Terraform for versioned Render service configuration, and Supabase PostgreSQL outside the current Terraform state.

The project has a repeatable path from source change to deployment for the API and frontend. Render automatically builds and deploys changes from `main`, but this report does not classify the path as a complete production-ready Continuous Deployment pipeline. The CI workflow does not run the Vitest suites, the background worker is not hosted, Terraform remains a controlled manual operation, and protected staging, immutable release artifacts, automated post-deployment readiness checks and retained rollback evidence are absent.

The retained Terraform plan reports `0 to add, 2 to change, 0 to destroy`. This is evidence that Terraform refreshed two existing resources and proposed in-place changes; it is not a no-op result and does not prove that applying the plan would be risk-free.

## 2. Scope and evidence basis

This report covers:

- the implemented source-to-runtime delivery flow;
- the distinction between CI, automatic deployment and Infrastructure as Code;
- the adoption of two existing Render services into Terraform state;
- configuration, secret and state handling;
- runtime health, feature-flag and worker boundaries; and
- retained evidence, limitations and required manual controls.

Claims are limited to the repository revision, provider configuration and real-window evidence available to the team. A configuration file describes intended state; a plan previews differences; a health response records one observation. None of these artifacts alone proves complete end-to-end production readiness.

## 3. Implemented DevOps system

| Stage | Input | Implemented process | Output/evidence |
| --- | --- | --- | --- |
| Source control | feature branch and code/configuration change | commit, push, Pull Request and review | versioned change history |
| Continuous Integration | commit or Pull Request | install, lint, typecheck, OpenAPI drift, migration replay, seed verification, build and secret scan | `quality` and `secret-scan` job results |
| Automatic deployment | accepted change on `main` | Render builds and deploys the Express API and React static site from Git | provider deployment state and public endpoints |
| Operational check | endpoint, logs and safe correlation data | point-in-time frontend/API check and manual diagnosis | screenshot, response and recovery decision |
| Infrastructure as Code | Terraform configuration, state and provider state | initialize, validate, import, plan, review and controlled apply | reviewed plan or approved infrastructure change |

The GitHub Actions workflow and Render deployment are separate mechanisms. A green workflow proves only the configured CI jobs. A deployment tied to a commit requires provider deployment evidence and post-deployment verification.

## 4. DevOps model and tool mapping

```text
[Developers: VS Code + Git]
              |
              v
[GitHub: branch -> Pull Request -> review]
              |
              v
[GitHub Actions]
  quality: npm ci -> lint -> typecheck -> OpenAPI -> migration/seed -> build
  secret-scan: Gitleaks
              |
              v
        [main branch]
              |
              v
[Render Git integration]
  Node/Express API                 React/Vite static frontend
              |
              v
[Operations: health endpoint + Render logs + correlation ID]
              |
              +---------- defect/feedback ----------> next branch/issue

[Terraform: infra/*.tf + protected local state]
  init -> validate -> import -> plan -> review -> approved apply
              |
              +---------- manages the two Render services

[Supabase PostgreSQL] is outside the current Terraform state.
[Backend worker] exists in source but is not hosted in the current Render model.
```

The main loop moves a reviewed source change through CI, deployment and operational feedback. Terraform is a controlled infrastructure-management branch of the model; it does not build the application and is not executed by the current CI workflow. The model intentionally marks the database and worker boundaries instead of presenting a target architecture as an implemented result.

## 5. Continuous Integration

The `quality` job performs:

- locked dependency installation with `npm ci`;
- ESLint validation;
- TypeScript type checking;
- generated OpenAPI type drift checking;
- PostgreSQL migration replay;
- idempotent reference-seed application and verification; and
- frontend/backend build validation.

The independent `secret-scan` job uses Gitleaks with full Git history. Workflow permissions grant read access to repository contents and Pull Request metadata.

The workflow does not run `npm test`, does not execute Terraform, does not send a deployment-result email and does not verify the hosted endpoints after Render deploys. These are explicit quality and traceability gaps rather than hidden assumptions.

## 6. Git-based deployment and maturity boundary

Render is configured to deploy two Git-connected services from `main`:

| Service | Current role | Deployment configuration |
| --- | --- | --- |
| Render web service | Express API | repository root `backend`, Node runtime, `npm ci; npm run build`, `npm start`, health path `/api/v1/health` |
| Render static site | React/Vite frontend | workspace build, publish `frontend/dist`, custom domain and same-origin/API plus SPA rewrites |
| Supabase PostgreSQL | shared relational database | referenced through environment configuration; outside Terraform state |
| Background worker | extraction, outbox, AI and retention jobs | source code exists; no hosted worker is retained in the current Render configuration |

The Render Git behavior is automatic deployment. It must not be presented as complete Continuous Deployment maturity because the pipeline lacks automated test enforcement, a protected staging strategy, an immutable release artifact, a hosted worker, automated post-deployment readiness checks and retained rollback/restore evidence.

## 7. Concurrent-version development and operation

The implemented repository supports concurrent **source versions**: team members work on separate branches, each push or Pull Request can receive CI feedback, and accepted work is merged into `main`. The hosted configuration does not prove concurrent production versions. Both Render services follow `main`; no retained staging, Pull Request preview, blue-green, canary or parallel production environment exists.

Feature flags such as `AI_*` select behavior inside one deployment and are not independent system versions. The `/api/v1` path versions an API contract and is not evidence of two deployment versions.

If the project must operate multiple versions continuously, the controlled extension is:

1. tag each release and build an immutable, traceable artifact;
2. create isolated preview/staging environments for candidates;
3. keep APIs and schemas backward compatible, using expand-migrate-contract database changes while old and new application versions overlap;
4. use owned, expiring feature flags for gradual capability activation;
5. use blue-green or canary routing and measure errors/latency by release identity;
6. promote only after readiness and acceptance gates; and
7. shift traffic back on failure while preferring database forward-fixes where schema rollback risks data loss.

This is a future operating strategy, not an implemented achievement. The accurate current statement is: the team can develop multiple source versions concurrently, but operates one hosted version from `main`.

## 8. Terraform adoption of existing infrastructure

Terraform does not create the initial project history. It describes and manages two Render services that already existed. The documented adoption sequence is:

1. initialize the locked Render provider with `terraform init`;
2. validate the configuration with `terraform validate`;
3. import the existing API and static-site resource identifiers into local state;
4. inspect the mapping, normally with `terraform state list`;
5. compare configuration, state and provider state with `terraform plan`;
6. review all proposed additions, in-place changes, removals, plan changes, domains, routes and environment variables; and
7. run `terraform apply` only after approval, followed by deployment and readiness verification.

Import changes Terraform state; it does not modify the Render services. Plan previews actions; it does not apply them. Apply can change the live provider configuration and therefore requires authority, current state and an impact review.

The repository does not retain the original init/import/state-list screenshots or a matching apply transcript. The saved plan refreshes both resource identifiers, which demonstrates their presence in the state used for that plan, but it is not a substitute for the missing import transcript.

## 9. Retained Terraform plan assessment

The redacted plan in `docs/DevOps/03-plan.txt` reports:

```text
Plan: 0 to add, 2 to change, 0 to destroy.
```

| Result | Correct interpretation |
| --- | --- |
| `0 to add` | no new resource was proposed |
| `2 to change` | both managed resources had in-place differences requiring review |
| `0 to destroy` | no whole resource deletion was proposed; configuration changes may still be disruptive |

The plan contains environment-variable differences and provider-computed changes. Removing or replacing runtime variables can break the application even when the summary contains no resource destroy action. Domain, rewrite, service-plan and environment differences must therefore be checked individually.

The command did not save a binary plan with `terraform plan -out=...`. Terraform consequently warned that a later apply was not guaranteed to perform exactly the displayed actions if provider state changed. A fresh plan and approval are required before any future apply.

## 10. Configuration-change operating example

For an approved new runtime variable, the controlled sequence is:

1. declare the variable and intended service mapping in Terraform;
2. review the source/configuration change through a Pull Request;
3. run a fresh plan with credentials kept outside Git;
4. confirm that the plan changes only the approved variable and preserves other environment values, routes, domains and service plans;
5. apply the reviewed plan under an authorized operator account;
6. inspect the Render deployment associated with the change; and
7. verify health/readiness and the affected user behavior, retaining a redacted plan, apply result, deployment log and verification record.

This is the documented operating procedure. The repository currently proves configuration, a prior plan and point-in-time health; it does not retain evidence that this example was completed end to end with Terraform apply.

## 11. Configuration, feature flags and observability

The API Terraform resource declares core production settings such as `NODE_ENV`, database SSL/URL, session security, frontend origin and the primary AI switch/key. The retained provider plan shows that the live services contained additional variables not fully represented by the current Terraform map. An apply must not remove those values accidentally.

Environment flags such as `AI_ENABLED` and related `AI_*` settings support controlled enablement of optional capabilities. A feature flag reduces rollout coupling but does not replace review, provider configuration, monitoring or fallback validation.

The project retains an API health endpoint, safe correlation identifiers and provider logs for diagnosis. It does not retain a complete alerting platform, service-level objective, automated deployment notification, worker health check or post-deployment readiness gate. A health response proves only that the API process responded at the capture time.

## 12. Security and state controls

- Render API keys, database URLs, session secrets, Gemini credentials and environment values must not be committed or shown in screenshots.
- Terraform credential variables are marked `sensitive`, but this label does not remove values from state; the state file still requires protection.
- `terraform.tfvars`, `.terraform/` and local state files are excluded from Git.
- Local state is not a durable team collaboration backend. A future shared setup requires encrypted remote state, access control, locking, retention and recovery ownership.
- A plan with `0 to destroy` still requires review of in-place configuration changes.
- Production database repair and provider changes require an audited operational decision; they are not routine troubleshooting shortcuts.

## 13. Background-worker and manual-operation boundary

The backend worker contains extraction/OCR processing, email and in-app outbox delivery, AI jobs, original-file and AI-input retention cleanup, due-review publication/rating updates and meeting-link recovery escalation. No hosted worker appears in the current Render Terraform configuration.

The hosted environment must therefore not be described as fully supporting those asynchronous flows. Manual paste/edit paths and in-application recovery reduce user impact but do not prove that worker-dependent processing operates continuously. Before pilot release, the team must deploy or replace the worker and retain readiness, retry, failure and recovery evidence.

## 14. Retained evidence

![Public PrepVI frontend](img/Q15-01-live-frontend.png)

**Figure 1.** The real PrepVI frontend window captured from the public site. It proves point-in-time frontend reachability only.

![GitHub Actions workflow runs](img/Q15-02-github-actions.png)

**Figure 2.** The real GitHub Actions window for the repository. A specific run must be opened to verify individual steps.

![Terraform configuration displayed in GitHub](img/Q15-03-terraform-github.png)

**Figure 3.** The versioned Terraform API/static-site configuration displayed in the real GitHub file view.

![Public API health response in Windows Terminal](img/Q15-04-api-health-terminal.png)

**Figure 4.** A real Windows Terminal window calling the production Render endpoint and showing HTTP 200, the public API health payload, safe correlation identifier, observed CORS header and process exit code 0. The response is not database-readiness, worker or complete user-journey evidence.

The text plan is retained separately because the available image set does not include a real Terraform plan terminal capture. No synthetic terminal or provider screenshot is used as evidence.

## 15. Evidence still required for a complete IaC operation record

If the submission requires proof of the full Terraform/Render operation, an authorized team member must capture real windows showing:

- successful `terraform init` and `terraform validate`;
- two imported/state-listed resources without secret values;
- a fresh, reviewed `terraform plan` summary;
- the Render deployment page tied to the relevant commit and marked Live; and
- health/readiness checks performed after that deployment.

The captures must exclude `terraform.tfvars`, Terraform state contents, access tokens, environment values, private JD data and session information. Until these captures exist, the report must not claim that they are attached.

## 16. Current limitations and release actions

- Add automated test execution to CI before claiming test-enforced delivery.
- Deploy or replace the background worker before claiming hosted asynchronous flows.
- Add protected staging/production policy, immutable release identification and post-deployment readiness checks.
- Move Terraform state to an encrypted, access-controlled and locked collaboration backend if the team continues shared IaC operations.
- Reconcile all live environment variables, domains and routes before apply.
- Retain deployment, rollback/forward-fix, backup and restore evidence for release readiness.
- Correct the production frontend-origin/CORS configuration if a fresh check still returns the localhost origin observed in the existing terminal evidence.

## 17. Submission coverage

| Official requirement | Coverage in this report |
| --- | --- |
| Draw and explain the team DevOps model | Sections 3-4 |
| Label tools for every component | Section 4 |
| Explain why DevOps is needed | Sections 1-3 |
| Explain concurrent development, deployment and operation of versions | Section 7, with current/future states separated |
| Print infrastructure initialization/configuration script | Appendix A and the versioned `infra/` sources |
| Print the infrastructure-management directory/file system | Appendix B |
| Provide real evidence | Section 14; missing evidence is disclosed in Section 15 |

## 18. Source artifacts

- [GitHub Actions workflow](../../../.github/workflows/ci.yml)
- [Terraform main configuration](../../../infra/main.tf)
- [Terraform variables](../../../infra/variables.tf)
- [Terraform provider configuration](../../../infra/providers.tf)
- [Redacted Terraform plan](../../../docs/DevOps/03-plan.txt)
- [IaC operations guide](../../../iaac_tutorial.md)
- [Backend worker](../../../backend/src/worker/index.js)
- [Manual Validation and Operations](../../Implementation/Manual_Validation_and_Operations.md)

## Appendix A - Safe infrastructure initialization script

The following PowerShell scenario initializes and adopts the two existing Render services. It must be executed only by an authorized operator with a private `terraform.tfvars`. Secret values and Terraform state are excluded from the submission.

```powershell
Set-Location infra
Copy-Item terraform.tfvars.example terraform.tfvars

terraform init
terraform validate

terraform import render_web_service.api srv-da402mjtqb8s73fplbcg
terraform import render_static_site.frontend srv-da403pbtqb8s73fpnmig
terraform state list

terraform plan

# Run only after a fresh plan has been fully reviewed and approved:
# terraform apply
```

The required private inputs are the Render API key/owner identifier and approved runtime values declared by `infra/variables.tf`. The operator must obtain them from the authorized secret source or provider dashboard, never from chat, screenshots or a committed `.env` file.

## Appendix B - Infrastructure-management directory and file system

```text
InterviewQuestionBank/
|-- .github/
|   `-- workflows/
|       `-- ci.yml                    # application quality and secret scanning
|-- infra/
|   |-- .terraform.lock.hcl           # locked provider selection
|   |-- providers.tf                  # Terraform and Render provider requirements
|   |-- variables.tf                  # typed/sensitive infrastructure inputs
|   |-- main.tf                       # Render API and static-site resources
|   |-- outputs.tf                    # non-secret service identifiers/URLs
|   `-- terraform.tfvars.example      # safe input template; real tfvars is ignored
|-- docs/
|   `-- DevOps/
|       `-- 03-plan.txt               # redacted retained Terraform plan
|-- iaac_tutorial.md                  # operator-oriented IaC procedure
`-- docs/Oral_Exam/Q15_devops/        # report, study guide and real evidence images
```

Local `.terraform/`, `terraform.tfvars`, `*.tfstate` and backup state files are intentionally excluded from Git because they may contain credentials or sensitive runtime values.

## Appendix C - Configuration excerpt and responsibility boundary

`infra/main.tf` declares `render_web_service.api` and `render_static_site.frontend`. It records the repository, `main` branch, build/start commands, API health path, frontend publish directory, custom domain and rewrite rules. Supabase PostgreSQL and a hosted background worker are not declared resources. The full versioned Terraform files, rather than copied snippets in this report, are the authoritative configuration source.
