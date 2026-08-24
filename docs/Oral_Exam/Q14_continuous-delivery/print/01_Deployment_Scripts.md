# Q14 — Deployment Scripts

## Purpose

The project uses a GitHub Actions workflow to trigger and verify the production API deployment. Terraform describes the frontend and API services on Render.

Sources: `.github/workflows/deploy.yml` and `infra/main.tf`.

## Automated deployment workflow

The workflow runs after `CI` succeeds on `main`. It reads the Render deploy hook from the `RENDER_DEPLOY_HOOK` repository secret, waits for Render, checks the production health endpoint, and sends the result by email.

```yaml
on:
  workflow_run:
    workflows: [CI]
    types: [completed]
    branches: [main]

jobs:
  deploy:
    if: github.event.workflow_run.conclusion == 'success'
    steps:
      - name: Trigger Render deployment
        env:
          RENDER_DEPLOY_HOOK: ${{ secrets.RENDER_DEPLOY_HOOK }}
        run: |
          curl --fail --silent --show-error \
            --request POST \
            "$RENDER_DEPLOY_HOOK"

      - name: Verify production health
        run: |
          curl --fail --silent --show-error \
            "https://api.prepvi.tinthanh.id.vn/api/v1/health"

  notify:
    if: always()
    needs: [deploy]
    steps:
      - name: Send deployment result email
        uses: dawidd6/action-send-mail@v3
```

The full workflow includes retry logic, captures the Render deploy ID, and reports success or failure. Secret values are not stored in this document.

## API service

```hcl
resource "render_web_service" "api" {
  name              = "InterviewQuestionBank"
  root_directory    = "backend"
  health_check_path = "/api/v1/health"

  runtime_source = {
    native_runtime = {
      auto_deploy   = true
      branch        = var.branch
      build_command = "npm ci; npm run build"
      repo_url      = var.repo_url
      runtime       = "node"
    }
  }

  start_command = "npm start"
}
```

## Frontend service

```hcl
resource "render_static_site" "frontend" {
  name          = "InterviewQuestionBank-fe"
  repo_url      = var.repo_url
  branch        = var.branch
  build_command = "npm ci; npm run build --workspace frontend"
  publish_path  = "frontend/dist"
  auto_deploy   = true

  custom_domains = [{ name = "prepvi.tinthanh.id.vn" }]
  routes = [
    { source = "/api/*", destination = "https://interviewquestionbank.onrender.com/api/*", type = "rewrite" },
    { source = "/*", destination = "/index.html", type = "rewrite" },
  ]
}
```

## Deployment flow

1. Merge an approved change into `main`.
2. The `CI` workflow runs its quality checks.
3. When `CI` succeeds, the `CD` workflow calls the protected Render deploy hook.
4. Render builds and deploys the API.
5. The workflow checks the production health endpoint and records the Render deploy ID.
6. The workflow sends a success or failure email.

Terraform changes follow a separate reviewed process: `terraform init`, `terraform validate`, `terraform plan`, and `terraform apply`.
