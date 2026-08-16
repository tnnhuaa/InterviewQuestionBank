# PrepVI frontend

This package turns the UI reference into a routed React prototype while keeping the seams needed for the API described in `../docs`.

## Run locally

```bash
npm install
npm run dev --workspace frontend
```

Quality checks:

```bash
npm run typecheck --workspace frontend
npm run lint --workspace frontend
npm test --workspace frontend
npm run build --workspace frontend
```

## Structure

- `src/app` owns route definitions, route constants, demo role state, and app-level error/loading states.
- `src/features` groups pages by the public, student, mentor, admin, and system-status surfaces.
- `src/shared/components` contains the navigation shell and reusable domain/UI components.
- `src/shared/data` is realistic prototype data only; replace these imports with feature hooks backed by `src/shared/api/resources.ts` during backend integration.
- `src/shared/styles/index.css` is the single source of truth for the visual system. Product colors, radii, shadows, and typography are exposed as semantic Tailwind tokens instead of being repeated in components.

## Integration seams

The canonical paths follow the product workflow documented in `../docs`, including:

1. `POST /api/v1/job-descriptions` from `/job-descriptions/new`.
2. Extraction review at `/job-descriptions/:jobDescriptionId/review`.
3. Analysis and explainable matching at `/job-descriptions/:jobDescriptionId/mapping`.
4. A persisted plan at `/preparation-plans/:planId`.
5. Mentor discovery and booking through `/mentors` and `/bookings/new?plan=:planId`.

The typed resource adapters normalize request construction, error envelopes, optimistic versions, and idempotency keys. Page components currently use local state so the complete journey remains demonstrable without a backend. When endpoints are ready, keep rendering components stable and move server interaction into feature-specific hooks that call the adapters.

The developer-only role switcher is shown by default in Vite development. Set `VITE_ENABLE_DEMO_TOOLS=true` to expose it in another environment.
