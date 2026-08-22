# PrepVI Continuous Integration — Printed Attachment

## Document purpose

This document consolidates the printed material required for the PrepVI Continuous Integration presentation:

- the CI model and the tool used by each component;
- the CI workflow implemented on `feat/add-workflow-noti` and the relevant build-script excerpts;
- developer workstation setup and source-build instructions;
- captured GitHub Actions, email-notification, link-navigation, job-detail, and branch-ruleset screenshots.

The five screenshots are loaded from the local `img` directory. The email and notification screenshots were captured from Pull Request #16 on the `feat/add-workflow-noti` branch. The workflow reproduced in Section 2 was verified against `origin/feat/add-workflow-noti` at commit `23ce115`. This evidence proves the behavior of that feature branch; it does not by itself prove that the change has been merged into `main`. Complete the privacy and consistency checks in Section 8 before printing.

## 1. Continuous Integration model

~~~mermaid
flowchart LR
    A[Developer<br/>Git commit, push, Pull Request] --> B[GitHub Repository]
    B -->|push or pull_request| C[GitHub Actions]
    C --> D[Quality job<br/>Ubuntu + Node.js 24 + npm]
    D --> E[ESLint]
    E --> F[TypeScript]
    F --> G[OpenAPI drift]
    G --> H[PostgreSQL 17<br/>migration replay + reference seed]
    H --> I[Vite frontend build<br/>backend import validation]
    C --> J[Secret-scan job<br/>Gitleaks + full Git history]
    I --> K[Notify job<br/>needs both jobs + always]
    J --> K
    K --> L["dawidd6/action-send-mail@v3"]
    L --> M[SMTP server<br/>configured by GitHub Secrets]
    M --> N[Result email<br/>job results + Actions run link]
    I --> O[GitHub Actions<br/>status and logs]
    J --> O
    K --> O
~~~

### 1.1 Input, process, and output

- **Input:** a Git commit pushed to any branch or a Pull Request event, together with the versioned source code and `package-lock.json`.
- **Process:** GitHub Actions checks out the repository, installs locked dependencies, runs quality/build/database checks, scans Git history for secrets, and then runs the notification job regardless of the two preceding job results.
- **Output:** a Pass/Fail workflow result and step logs in GitHub Actions, plus a custom result email containing the two job results and a link to the corresponding Actions run.

### 1.2 Component and tool mapping

| Component | Tool/configuration used by PrepVI | Responsibility |
| --- | --- | --- |
| Developer workstation | Git, Node.js 24+, npm 11+ | Create changes and reproduce build commands locally |
| Shared source repository | GitHub | Store source, history, branches, and Pull Requests |
| Build server/orchestrator | GitHub Actions | Start the workflow for pushes and Pull Requests |
| Build runner | `ubuntu-latest` | Provide an isolated build environment |
| Dependency installation | Node.js 24 and `npm ci` | Install versions locked by `package-lock.json` |
| Static code check | ESLint | Check frontend and backend lint rules |
| Type check | TypeScript `tsc --noEmit` | Validate frontend types without generating output |
| API contract check | `openapi-typescript` and Git diff | Detect drift between OpenAPI and generated frontend types |
| Database verification | PostgreSQL 17 Alpine | Replay migrations and verify idempotent reference seed data |
| Frontend build | Vite | Produce the frontend production bundle |
| Backend build validation | Node.js dynamic imports | Confirm required backend entry modules load successfully |
| Secret scanning | Gitleaks | Scan complete Git history for committed secrets |
| Result interface | GitHub Actions/Checks | Display status and logs for each job and step |
| Notification orchestrator | `notify`, `needs: [quality, secret-scan]`, `if: always()` | Run after both verification jobs and attempt notification even when one fails |
| Email action | `dawidd6/action-send-mail@v3` | Construct and send the custom HTML result email |
| Email transport | SMTP configured through six GitHub Actions secrets | Authenticate the sender without storing credentials in the repository |
| Email destination | `NOTIFY_TO` and the generated Actions run URL | Deliver the result and allow the recipient to open the matching run |

## 2. CI workflow on `feat/add-workflow-noti`

Reference source: `origin/feat/add-workflow-noti:.github/workflows/ci.yml`, commit `23ce115`.

The following is the feature-branch workflow to be printed with the submission:

~~~yaml
name: CI

on:
  push:
    branches: ["**"]
  pull_request:

permissions:
  contents: read
  pull-requests: read

jobs:
  quality:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - name: Check out repository
        uses: actions/checkout@v4
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 24
          cache: npm
      - name: Install dependencies
        run: npm ci
      - name: Lint
        run: npm run lint
      - name: Typecheck
        run: npm run typecheck
      - name: OpenAPI drift
        run: npm run api:types:check
      - name: Migration replay
        env:
          DATABASE_URL: postgresql://prepvi:prepvi@localhost:5432/prepvi
          NODE_ENV: test
          SESSION_SECRET: ci-only-session-secret-not-for-deployment
        run: npm run db:migrate && npm run db:migrate
      - name: Reference seed verification
        env:
          DATABASE_URL: postgresql://prepvi:prepvi@localhost:5432/prepvi
          NODE_ENV: test
        run: npm run db:seed:reference && npm run db:seed:reference && npm run db:seed:verify
      - name: Build
        run: npm run build
    services:
      postgres:
        image: postgres:17-alpine
        env:
          POSTGRES_DB: prepvi
          POSTGRES_USER: prepvi
          POSTGRES_PASSWORD: prepvi
        ports: ["5432:5432"]
        options: >-
          --health-cmd "pg_isready -U prepvi -d prepvi"
          --health-interval 5s
          --health-timeout 5s
          --health-retries 10

  secret-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Gitleaks scan
        uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

  notify:
    runs-on: ubuntu-latest
    if: always()
    needs: [quality, secret-scan]
    steps:
      - name: Send CI email notification
        uses: dawidd6/action-send-mail@v3
        with:
          server_address: ${{ secrets.SMTP_HOST }}
          server_port: ${{ secrets.SMTP_PORT }}
          secure: true
          username: ${{ secrets.SMTP_USERNAME }}
          password: ${{ secrets.SMTP_PASSWORD }}
          from: ${{ secrets.NOTIFY_FROM }}
          to: ${{ secrets.NOTIFY_TO }}
          subject: >-
            [CI] ${{ github.repository }} /
            ${{ github.ref_name }} /
            ${{ needs.quality.result == 'success' && needs.secret-scan.result == 'success' && 'SUCCESS' || 'FAILURE' }}
          html_body: |
            <html>
              <body style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; color: #1f2937;">
                <h2 style="margin-bottom: 4px;">
                  CI: ${{ needs.quality.result == 'success' && needs.secret-scan.result == 'success' && 'SUCCESS' || 'FAILURE' }}
                </h2>
                <p style="margin-top: 0; color: #6b7280;">Workflow: <strong>CI</strong> &middot; GitHub Actions</p>

                <table style="border-collapse: collapse; width: 100%; max-width: 560px;">
                  <tr>
                    <td style="padding: 8px 0; width: 160px; font-weight: bold;">Repository</td>
                    <td style="padding: 8px 0;"><code>${{ github.repository }}</code></td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold;">Branch</td>
                    <td style="padding: 8px 0;"><code>${{ github.ref_name }}</code></td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold;">Commit SHA</td>
                    <td style="padding: 8px 0;"><code>${{ github.sha }}</code></td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold;">Pushed by</td>
                    <td style="padding: 8px 0;">${{ github.actor }}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold;">Job: quality</td>
                    <td style="padding: 8px 0;"><code>${{ needs.quality.result }}</code></td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold;">Job: secret-scan</td>
                    <td style="padding: 8px 0;"><code>${{ needs.secret-scan.result }}</code></td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: bold;">Run link</td>
                    <td style="padding: 8px 0;">
                      <a href="${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}">
                        View run #${{ github.run_id }}
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="margin-top: 16px; color: #9ca3af; font-size: 12px;">
                  Sent by GitHub Actions workflow <code>.github/workflows/ci.yml</code>.
                </p>
              </body>
            </html>
~~~

### 2.1 Pass and fail rules

The email subject reports `SUCCESS` only when both `quality` and `secret-scan` succeed; otherwise it reports `FAILURE`. Because `notify` has `if: always()` and depends on both jobs, it still attempts to run after either verification job fails. A non-zero exit code fails the current step and its job. The complete workflow run is successful only when `quality`, `secret-scan`, and `notify` all succeed. If the mail action fails, the `notify` job and therefore the overall run can fail even when both verification jobs passed. The developer uses the failed step's log, reproduces the corresponding command locally, corrects the source/configuration, and pushes a new commit.

### 2.2 Known limitations

- The repository has an `npm test` command and test files, but the workflow above does **not** call `npm test`; automated tests must not be presented as a current CI gate.
- The workflow does not deploy the application, so it implements Continuous Integration rather than Continuous Delivery.
- The custom SMTP notification requires all six repository secrets to be configured. A missing or invalid SMTP setting can fail `notify` without indicating a source-code quality failure.
- This attachment documents the feature-branch implementation. It must not be described as merged into `main` until repository history confirms that merge.
- Branch protection is configured outside this repository file and requires a GitHub settings screenshot if it is presented as an enforced merge gate.

## 3. Package build scripts

### 3.1 Root workspace scripts

Source: [`package.json`](../../../package.json)

~~~json
{
  "scripts": {
    "lint": "npm run lint --workspaces --if-present",
    "typecheck": "npm run typecheck --workspace frontend",
    "test": "npm run test --workspaces --if-present",
    "build": "npm run build --workspaces --if-present",
    "api:types": "openapi-typescript backend/openapi/openapi.yaml -o frontend/src/shared/api/generated.ts",
    "api:types:check": "npm run api:types && git diff --exit-code -- frontend/src/shared/api/generated.ts",
    "db:migrate": "npm run db:migrate --workspace backend",
    "db:seed:reference": "npm run db:seed:reference --workspace backend",
    "db:seed:verify": "npm run db:seed:verify --workspace backend"
  },
  "engines": {
    "node": ">=24"
  }
}
~~~

The root commands coordinate the npm workspaces. `api:types:check` regenerates frontend types from the OpenAPI contract and fails if the generated file differs from the committed version.

### 3.2 Frontend scripts

Source: [`frontend/package.json`](../../../frontend/package.json)

~~~json
{
  "scripts": {
    "dev": "vite",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "build": "vite build"
  }
}
~~~

`vite build` creates the frontend production bundle in `frontend/dist`.

### 3.3 Backend scripts

Source: [`backend/package.json`](../../../backend/package.json)

~~~json
{
  "scripts": {
    "dev": "node --watch src/server.js",
    "start": "node src/server.js",
    "lint": "eslint .",
    "test": "vitest run",
    "build": "node scripts/build.js",
    "worker": "node src/worker/index.js",
    "db:migrate": "node scripts/db.js migrate",
    "db:seed:reference": "node scripts/db.js seed reference",
    "db:seed:verify": "node scripts/db.js verify"
  }
}
~~~

The backend does not create a bundle. Its build command runs a Node.js validation script that imports required modules and fails if they cannot be loaded.

## 4. Backend build-validation script

Source: [`backend/scripts/build.js`](../../../backend/scripts/build.js)

~~~javascript
const requiredModules = [
  "../src/app.js",
  "../src/config/environment.js",
  "../src/modules/system/status.routes.js",
];

await Promise.all(requiredModules.map((modulePath) => import(modulePath)));
console.log("Backend build validation passed");
~~~

This script validates the backend application, environment configuration module, and status-route module as importable entry points. An import or syntax/configuration initialization failure produces a non-zero process result and fails the workspace build.

## 5. Developer setup and source-build guide

This section is the consolidated, English, print-ready developer setup and source-build guide for PrepVI.

### 5.1 Required tools

- Git.
- Node.js 24 or later.
- npm 11 or later.
- A project `.env` file delivered through an approved private channel. Never commit or capture its secret values in screenshots.
- PostgreSQL when using a local database. Docker Desktop is needed only when PostgreSQL/Mailpit is started through `docker-compose.yml`.

Verify the tool versions:

~~~powershell
git --version
node --version
npm --version
~~~

### 5.2 Clone the source and install locked dependencies

~~~powershell
git clone git@github.com:tnnhuaa/InterviewQuestionBank.git
cd InterviewQuestionBank
npm ci
~~~

`npm ci` installs the exact dependency versions in `package-lock.json` and is also used by CI. Use `npm install` only when intentionally changing dependencies, and review the lockfile change.

### 5.3 Configure the environment

Place `.env` in the repository root beside `package.json`. Use `.env.example` only to identify variable names; obtain real values privately. Do not include real tokens, database URLs, credentials, or JD/personal data in commits, logs, or evidence screenshots.

The project documentation states that the team currently uses a shared Supabase database and Gemini API key. Do not run migration, seed, or reset commands against a shared connection without authorization from the project owner.

### 5.4 Run the application

~~~powershell
npm run dev
~~~

The root development command starts the API, worker, and frontend processes. Default local endpoints are:

- frontend: `http://localhost:5173`;
- API health endpoint: `http://localhost:3000/api/v1/health`.

Use `Ctrl+C` to stop the development processes.

### 5.5 Run the safe local quality and build sequence

~~~powershell
npm run lint
npm run typecheck
npm run api:types:check
npm run build
~~~

Expected results:

- lint finishes without ESLint errors;
- TypeScript finishes without emitting files;
- generated OpenAPI types match the committed file;
- Vite creates `frontend/dist`;
- the backend prints `Backend build validation passed`.

CI additionally replays migrations and reference seed operations on its disposable PostgreSQL service. Do not copy those database commands to a shared database merely to reproduce CI.

### 5.6 Run the existing tests locally

~~~powershell
npm run test
~~~

This runs workspace test commands. It is a valid local verification command, but the feature-branch `.github/workflows/ci.yml` does not invoke it, so the local result is not evidence of an automated CI test gate in the demonstrated workflow.

### 5.7 Troubleshooting

| Symptom | Check and corrective action |
| --- | --- |
| Incorrect Node/npm version | Run `node --version` and `npm --version`; install a compatible Node.js 24+ environment. |
| Missing environment variable | Compare names with `.env.example` and obtain the real value privately. |
| API unavailable | Inspect the API terminal, `/api/v1/health`, and the database connection. |
| OpenAPI drift | Run `npm run api:types`, review the generated diff, then rerun the check. |
| Frontend build failure | Correct the TypeScript/Vite error printed in the terminal, then rerun typecheck/build. |
| CI-only database failure | Reproduce only on a dedicated local/test PostgreSQL instance; never test replay/reset behavior on the shared database. |

### 5.8 Evidence to retain

- Node/npm versions without environment secrets.
- A terminal showing successful `npm ci` and `npm run build` results.
- The GitHub Actions run associated with the demonstrated commit.
- Logs for any discussed failure and the later successful rerun.
- No `.env`, token, real database URL, private JD, or personal information in any screenshot.

## 6. Screenshot evidence from `img`

The image links below load the evidence currently stored in `img`.

### 6.1 Successful GitHub Actions run

Evidence file: `img/github-actions-success.png`

This Pull Request view shows that all six checks passed for the push and Pull Request events, including `quality`, `secret-scan`, and `notify` on the notification feature branch.

![Successful CI checks on the notification feature Pull Request](img/github-actions-success.png)

### 6.2 Quality-job step details

Evidence file: `img/github-actions-job-details.png`

The screenshot shows the successful `quality`, `secret-scan`, and `notify` jobs. The expanded `quality` job shows dependency installation, lint, typecheck, OpenAPI drift, migration replay, reference-seed verification, and build. No secret/environment value is displayed.

![GitHub Actions quality-job details](img/github-actions-job-details.png)

### 6.3 GitHub email notification

Evidence file: `img/github-email-notification.png`

The screenshot shows a custom CI success email generated for the notification feature branch. It includes the repository, branch, commit SHA, triggering actor, `quality` and `secret-scan` results, and a `View run` hyperlink. **The captured image currently exposes personal email addresses; redact them before printing or submission.**

![Custom CI result email from the notification feature branch](img/github-email-notification.png)

### 6.4 Email link opens the corresponding Actions run

Evidence file: `img/github-action-click.png`

This screenshot shows the browser after selecting `View run` in the email. The Actions-run identifier in the browser URL matches the run link shown in the email, demonstrating navigation from the notification to its corresponding workflow run.

![Email run link opened in GitHub Actions](img/github-action-click.png)

### 6.5 Main-branch ruleset

Evidence file: `img/main-branch-protection.png`

The screenshot shows an Active ruleset targeting `main`, requiring a Pull Request, restricting deletion, and blocking force pushes. Although `Require status checks to pass` is selected, the settings also show `No checks have been added`. Therefore, this evidence does **not** prove that a specific CI check is currently enforced before merge.

![Active main-branch ruleset without a selected required status check](img/main-branch-protection.png)

## 7. Evidence interpretation

| Evidence | What it proves | What it does not prove by itself |
| --- | --- | --- |
| Successful Pull Request checks | The notification feature branch completed its configured push and PR checks | That the feature branch has been merged into the current baseline |
| Quality-job details | The listed workflow steps ran for that job | Product acceptance or production readiness |
| Custom CI email | The notification feature branch sent a result email with job and commit context | That the notification implementation has been merged into `main` |
| Email link navigation | `View run` opens the Actions run whose identifier is shown in the email | That all future links or recipients are configured correctly |
| Main-branch ruleset | The active rule targets `main` and requires Pull Requests | That a specific CI check is enforced; the screenshot explicitly shows no required check selected |
| Printed scripts | The repository defines the shown commands | That a particular run succeeded |

## 8. Pre-print checklist

- [x] `img/github-actions-success.png` has been added and is readable.
- [x] `img/github-actions-job-details.png` has been added and is readable.
- [x] `img/github-email-notification.png` has been added and is readable.
- [x] `img/github-action-click.png` has been added and is readable.
- [x] `img/main-branch-protection.png` has been added and shows the active ruleset.
- [ ] Personal email addresses in `img/github-email-notification.png` have been redacted before printing.
- [ ] The demonstrated commit identifier is consistent across the workflow and email screenshots.
- [ ] No screenshot contains a token, `.env` value, real database credential, private JD, or unnecessary personal information.
- [x] The printed CI workflow matches `origin/feat/add-workflow-noti:.github/workflows/ci.yml` at commit `23ce115`.
- [ ] The developer setup/build commands have been checked on the intended workstation.
