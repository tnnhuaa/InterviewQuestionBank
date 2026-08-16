# PrepVI — Interview Question Bank R1

PrepVI R1 is a modular monolith: React/TypeScript SPA, Express/JavaScript API and worker, and portable PostgreSQL through `pg`. The browser calls relative `/api/v1`; it never connects directly to PostgreSQL or object storage.

```text
Browser -> same-origin /api/v1 -> Express -> application/domain services -> PostgreSQL
                                      \-> outbox -> worker -> SMTP
                                      \-> private local/S3-compatible storage
```

The implementation covers mandatory R1 stories `US-01–20` and `US-24–30`. Advanced dashboard, scheduled reminders, bulk import, AI/semantic matching, integrated video, and payment are deliberately out of scope.

## Local setup

Requirements: Node.js 24 LTS, npm 11+, and Docker Desktop (or another PostgreSQL 15+ instance).

```bash
cp .env.example .env
npm install
npm run db:start
npm run db:migrate
npm run db:seed:reference
npm run dev
```

Set strong local `SESSION_SECRET` and `CSRF_SECRET` values in `.env`. Local endpoints:

- Frontend: `http://localhost:5173`
- API health: `http://localhost:3000/api/v1/health`
- API readiness: `http://localhost:3000/api/v1/readiness`
- Mailpit: `http://localhost:8025`

Run the API and worker separately when validating extraction/notifications:

```bash
npm run dev --workspace backend
npm run worker --workspace backend
npm run dev --workspace frontend
```

## Database and seed workflow

Migrations are forward-only and checksum protected. Never edit an applied migration or seed version; create a new version.

```bash
npm run db:migrate
npm run db:seed:reference
npm run db:seed:demo
npm run db:seed:load
npm run db:seed:verify
npm run db:status
```

- `reference`: stable pilot-safe taxonomy, aliases, curated published questions, provenance, classifications, and matching rules.
- `demo`: local/staging personas and representative workflow/error states. Requires `ALLOW_NON_PRODUCTION_SEED=true` and `DEMO_SEED_PASSWORD`; the password is never logged.
- `load`: staging-only 1,000 questions, 100 mentors, 1,000 future slots, and 500 bookings under a distinct `load-*` namespace.

`demo` and `load` fail closed in `APP_ENV=pilot|production`. Pilot bootstrap is exactly: migrate → reference seed → `npm run admin:invite --workspace backend -- admin@example.com`. Invitation tokens and passwords are delivered/entered out-of-band and never accepted as CLI arguments.

`npm run db:reset` is allowed only for `APP_ENV=local|test` and a local database URL. It is not a pilot operation.

## Contracts and quality

OpenAPI 3.1 is at `backend/openapi/openapi.yaml`. Generate the frontend contract with:

```bash
npm run api:types
npm run api:types:check
npm run typecheck
npm run lint
npm run build
```

Automated-test implementation is not part of the R1 release/validation scope. Release acceptance uses the manual/UAT evidence process in `docs/Implementation/Manual_Validation_and_Operations.md`. CI still validates lint, TypeScript, OpenAPI drift, migration replay, reference seed integrity, build, and secret scanning.

## Runtime safety

- Passwords use Argon2id. Sessions store only SHA-256 token hashes; cookies are `__Host-`, `Secure`, `HttpOnly`, `SameSite=Lax` in secure environments.
- State-changing authenticated requests require same-origin and CSRF validation.
- Booking/moderation operations use version checks and idempotency keys. Slot confirmation is serialized with row locks.
- JD files and verification evidence are private. Meeting links are AES-256-GCM encrypted at rest.
- API errors contain a safe correlation ID and recovery action; logs omit request bodies, tokens, JD text, credentials, meeting links, and evidence.
- Failed providers do not roll back committed business state. The outbox retries at minute 1 and 5, then creates an auditable operation case.

When local PostgreSQL or Mailpit cannot start, follow the manual-recovery table in the implementation runbook instead of changing production data directly.
