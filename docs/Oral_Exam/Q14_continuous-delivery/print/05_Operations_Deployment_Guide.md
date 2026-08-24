# PrepVI — Deployment Guide for Operations Engineers

## 1. Current system

- Frontend: React/Vite static site on Render
- API: Node.js/Express web service on Render
- Database: Supabase PostgreSQL
- Infrastructure definition: Terraform in `infra/`
- Deployment trigger: GitHub Actions calls the protected Render deploy hook after `CI` succeeds on `main`

The background worker is not deployed. Worker-based reminders and email jobs are not ready for production use.

## 2. Before deployment

1. Record the commit SHA, environment, operator, approver, and target URLs.
2. Confirm Pull Request approval.
3. Confirm the GitHub Actions quality and secret-scan jobs passed.
4. Run the test suite separately because the current CI workflow does not run `npm test`.
5. Review pending database migrations.
6. Confirm a current database backup and a recovery owner.
7. Confirm production secrets are stored outside Git.

Stop if a required check fails or a Critical/High defect is open.

## 3. Infrastructure

```text
terraform init
terraform validate
terraform plan -out=<reviewed-plan>
terraform apply <reviewed-plan>
```

- Review every add, change, and destroy action.
- Apply only the reviewed plan.
- Never share Terraform state or real variable values.

## 4. Database

```text
npm run db:migrate
npm run db:seed:reference
npm run db:seed:verify
npm run db:status
```

- Use one controlled migration runner.
- Record applied versions and checksums.
- Never run reset, demo seed, or load seed in production.

## 5. Application deployment

1. Merge the approved commit into `main`.
2. Confirm that the `CI` workflow succeeds.
3. The `CD` workflow calls the Render deploy hook and records the API deploy ID.
4. The workflow waits for Render and checks `/api/v1/health` with retries.
5. Confirm that the deployment-result email shows the expected commit, deploy ID, and `SUCCESS` result.
6. Check the frontend separately because this workflow triggers the API service only.

## 6. Verification

Check:

- the public frontend;
- `/api/v1/health` and `/api/v1/readiness`;
- frontend-to-API routing and CORS;
- migration status;
- Render logs and safe correlation IDs; and
- the main Student, Mentor, and Administrator flows.

A health response with status `200` proves only that the API responded at that time. It does not prove the complete user flow.

## 7. Failure and recovery

- Stop promotion when a gate fails.
- For an application regression, redeploy the last known-good commit.
- Do not reverse a database schema without a reviewed plan.
- Prefer a prepared forward fix or an approved restore.
- Run all verification checks again after recovery.

## 8. Deployment record

Keep the environment, commit SHA, deploy IDs, time, gate results, migration versions, approver, URLs, defects, recovery action, and deployment notification.

Current gaps: no full automated user-flow smoke test, no staging approval gate, no immutable release artifact, and no deployed worker. The workflow health check proves API availability only.
