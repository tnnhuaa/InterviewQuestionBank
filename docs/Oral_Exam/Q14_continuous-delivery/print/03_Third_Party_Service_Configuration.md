# Q14 — Third-Party Service Configuration

## Sources

The settings come from `.env.example`, `infra/main.tf`, `infra/variables.tf`, and `infra/terraform.tfvars.example`. This document contains names and rules only. It does not contain real credentials.

| Service | Purpose | Main settings | Security rule |
|---|---|---|---|
| Render | Hosts the frontend and API | Repository, branch, region, plan, build/start commands, health path, domain | Keep the API key and Terraform state private |
| Supabase PostgreSQL | Managed database | `DATABASE_URL`, `DATABASE_SSL`, `DB_POOL_MAX` | Store the URL as a secret and require SSL in production |
| SMTP / Mailpit | Application email | Host, port, TLS, user, password, sender | Use Mailpit locally; keep production credentials outside Git |
| S3-compatible storage | Private file storage | Endpoint, region, bucket, access key, secret key | Use a private bucket and least-privilege access |
| Gemini | Optional backend AI support | Feature flags, API key, model, timeout, quota | Keep the key on the backend and provide a manual/rule-based fallback |
| External meeting provider | Interview meeting link | HTTPS link entered by a Mentor | The provider does not control the booking state |

## Environment summary

| Area | Development | Production |
|---|---|---|
| Database | Local PostgreSQL, SSL off | Supabase secret URL, SSL on |
| Email | Mailpit on port 1025 | Approved SMTP provider and sender |
| Storage | Private local folder | Private local volume or S3-compatible bucket |
| Gemini | Optional for testing | Controlled by flags and quotas |
| Web origin | `http://localhost:5173` | Exact production frontend domain |
