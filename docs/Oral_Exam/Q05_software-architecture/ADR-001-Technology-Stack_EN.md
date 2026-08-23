# ADR-001 — Technology Stack

| Attribute | Value |
|---|---|
| Status | Accepted for PoC; Proposed for MVP |
| Decision date | 14/08/2026 |
| Owner | Luân — Architecture/Technology Stack |
| PoC confirmation owner | Trí — End-to-End PoC |
| Scope | Frontend, backend, database, testing, and deployment |

## 1. Context

The MVP must support the Question Bank, mentor discovery, availability, booking, meeting-link handoff, feedback, and notifications. The two most important technical attributes are object-level access control and prevention of double booking under concurrent requests.

Confirmed team information:

- Frontend: React and Tailwind CSS.
- Backend: Node.js and Express.
- Database: PostgreSQL.
- Frontend and backend are separate applications with independent build and deployment.
- No deployment-provider constraint.
- No PoC result was available when the decision was made.

Because no detailed skill matrix was available for every member, the decision prioritizes technologies already identified by the team and limits new technologies. JavaScript is used end-to-end. TypeScript requires a new change/ADR if the team confirms sufficient skills and capacity.

## 2. Decision criteria

Each option is scored from 1 to 5, where 5 is the best fit.

| Criterion | Weight | Meaning |
|---|---:|---|
| Team fit | 30% | Familiar technology and little new-learning time |
| Development speed | 20% | Setup, feedback loop, and boilerplate |
| Testability | 20% | Unit, integration, E2E, and concurrency testing |
| Deployment/operations | 15% | Separate builds, containers, CI/CD, and observability |
| Pilot cost | 10% | Free/low-cost tiers without provider lock-in |
| Data consistency | 5% | Transactions, constraints, locks, and migrations |

## 3. Options considered

| Option | Team fit | Dev speed | Test | Deploy | Cost | Consistency | Weighted score |
|---|---:|---:|---:|---:|---:|---:|---:|
| **A. React/Vite + Express + PostgreSQL** | 5 | 5 | 5 | 5 | 5 | 5 | **5.00** |
| B. Next.js full-stack + PostgreSQL | 3 | 4 | 4 | 4 | 4 | 5 | 3.70 |
| C. React + Spring Boot + PostgreSQL | 2 | 2 | 5 | 3 | 4 | 5 | 3.00 |

### Option A — React/Vite + Express + PostgreSQL

Advantages: matches confirmed skills, uses JavaScript end-to-end, keeps frontend/backend separate, provides a fast Vite feedback loop, makes APIs simple with Express, and uses PostgreSQL transactions/constraints for booking.

Disadvantages: Express does not impose a module structure, so the team must enforce boundaries, validation, and error contracts. Raw SQL requires review and migration discipline.

### Option B — Next.js full-stack + PostgreSQL

Advantages: integrated routing, data loading, and deployment may reduce frontend decisions.

Rejected because the current requirement is independent frontend/backend applications; the MVP does not need SSR or React Server Components, and a full-stack framework adds unnecessary learning and coupling for the PoC.

### Option C — React + Spring Boot + PostgreSQL

Advantages: mature backend ecosystem, strong typing, and good testing/transaction support.

Rejected because Java/Spring was not among the stated team skills; learning and setup cost would reduce PoC speed without a necessary pilot-scale benefit.

### 3.1 Architectural styles considered

The course material requires an explanation of architectural style, not only framework choice.

| Style | Booking transaction | Testability | Operations/cost | Team fit | Conclusion |
|---|---|---|---|---|---|
| **Modular monolith backend** | One transaction/database boundary | Clear module and integration tests | One API deployable; low cost | Fits Express | **Selected** |
| Microservices | Requires distributed consistency/sagas | Good service tests but complex E2E | Multiple services, network, and observability | Too large for the pilot | Rejected |
| Route-based serverless functions | Short transactions are possible | Easy units, difficult worker/lifecycle | Scale-to-zero with cold-start/connection pressure | Adds platform coupling | Not selected as baseline |

A modular monolith does not allow every module to modify shared data arbitrarily. Modules communicate through application contracts; Booking owns its state machine, Notification only consumes outbox events, and the frontend never accesses the database.

## 4. Decision

Select option A with this baseline:

| Layer | Decision |
|---|---|
| Frontend runtime | React SPA, JavaScript modules |
| Frontend build | Vite; do not use Create React App |
| UI | Tailwind CSS; check component accessibility with semantic HTML and automated tests |
| Routing/data | React Router; fetch wrapper and feature-level server-state hooks |
| Backend runtime | Node.js 24 LTS |
| HTTP API | Express 5, REST/JSON under /api/v1 |
| Validation | Schema validation at the API boundary; never trust client data or roles |
| Database | PostgreSQL with pg and versioned SQL migrations |
| Architecture style | Modular-monolith backend; separately deployable frontend |
| Background work | PostgreSQL transactional outbox; worker logic outside the request path |
| Authentication | Server-side session through a same-origin /api reverse proxy; __Host- cookie with Secure, HttpOnly, and SameSite=Lax |
| Unit/integration testing | Vitest, React Testing Library, Supertest, and real PostgreSQL for integration/concurrency tests |
| E2E testing | Playwright for critical workflows |
| Quality/CI | ESLint, formatter, dependency audit, migration check, test, and build in CI |
| Packaging | Commit package-lock.json; API has a Dockerfile; frontend builds static assets |

The ADR does not pin UI-library versions. Each application pins dependencies through the lockfile and uses supported releases at scaffold time. Node.js is pinned to a major LTS version in the runtime/container.

## 5. Source organization and deployment boundary

Frontend and backend are independent projects:

~~~text
frontend/
  src/
    features/
    routes/
    shared/
  tests/

backend/
  src/
    modules/
    platform/
    worker/
  database/migrations/
  tests/
~~~

For the PoC submission, both projects may exist under poc/mentor-booking-feedback/ to match the Task W10 directory tree, but they do not share a runtime build and the frontend never accesses the database directly.

Proposed pilot deployment:

- Static frontend: Vercel Hobby or an equivalent static host; configure same-origin /api/* rewrites to the backend.
- Backend API: Render Free for demo/PoC; move to a paid instance when the pilot requires stable uptime.
- Database: Neon Free for a small PoC/pilot; use pooled connections and monitor quota.
- Worker: run in the backend process only for a one-instance PoC; separate it into a worker process in staging/production when supported by the platform.

This is the default deployment profile, not vendor lock-in. The API, worker, and database are configured through environment variables; the schema and migrations do not depend on proprietary extensions.

## 6. Consequences

### Positive

- The team uses familiar technology and can divide frontend/backend work independently.
- One language reduces context-switching cost.
- PostgreSQL directly protects booking consistency instead of relying on an in-memory lock.
- A static frontend and containerized API have several low-cost deployment choices.

### Trade-offs

- The team must maintain Express module conventions.
- JavaScript needs schema validation and strong tests to compensate for the lack of compile-time type checking.
- Free tiers have cold starts and quotas and do not provide production SLAs.
- Running the worker with the API suits only a PoC and is not assumed safe for multiple instances.

## 7. PoC gates before MVP acceptance

Trí must record Pass/Fail and evidence for:

1. At least 20 concurrent requests try to confirm the same slot; only one booking occupies it.
2. A Student/Mentor outside a booking cannot read its meeting link or feedback.
3. Every valid booking transition creates an audit record; an invalid transition returns a stable error.
4. Multi-tag question filtering creates no duplicates and exposes no Draft question.
5. Notification-provider failure does not roll back booking; retry does not duplicate delivery for an event key.
6. Frontend build, backend tests, and migrations run independently in CI.
7. The deployed frontend logs in and calls protected /api/v1 through a same-origin proxy; cookies do not depend on third-party access and the CSRF negative test passes.

If a gate fails because of a stack limitation rather than an implementation defect, a new ADR changes this ADR to Superseded or Rejected; do not rewrite the decision history.

## 8. Verification sources

Verified on 14/08/2026:

- React — Creating a React App: https://react.dev/learn/creating-a-react-app
- Vite — Getting Started: https://vite.dev/guide/
- Tailwind CSS — Using Vite: https://tailwindcss.com/docs/installation/using-vite
- Express 5 — Installing/TypeScript/Node requirements: https://expressjs.com/en/5x/starter/installing/
- Node.js release status: https://nodejs.org/en/about/previous-releases
- PostgreSQL locking: https://www.postgresql.org/docs/current/explicit-locking.html
- Playwright: https://playwright.dev/docs/intro
- Vercel pricing: https://vercel.com/pricing
- Vercel external-origin rewrites: https://vercel.com/docs/routing/rewrites
- Render free services: https://render.com/docs/free
- Neon pricing: https://neon.com/pricing
