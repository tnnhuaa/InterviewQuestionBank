# Design QA

final result: passed

## Comparison target

- Source visual truth: `E:/HCMUS/Sem9/Software project management/GroupProject/UI_ref`, rendered at `http://localhost:5174/questions` during QA.
- Source capture: `design-qa-evidence/source-questions-desktop.png`.
- Rendered implementation: `http://localhost:5173/questions`.
- Final implementation capture: `design-qa-evidence/implementation-questions-desktop-final.png`.
- Combined side-by-side evidence: `design-qa-evidence/comparison-questions-desktop-final.png` (source on the left, implementation on the right).
- State: public Question Bank with the default `Frontend Intern` and `JavaScript` filters.
- Desktop viewport: 1440 × 900 CSS px. Source capture: 1435 × 1202 px. Implementation capture: 1434 × 1202 px. The one-pixel width difference is the scrollbar track; browser captures were normalized to CSS pixels despite the source tab initially reporting a 1.5 device pixel ratio.
- Mobile evidence: `design-qa-evidence/implementation-questions-mobile-viewport.png`, tested at 390 × 844 CSS px and captured at 384 × 831 px after the scrollbar/browser viewport inset. The document scroll width was 384 px, so there was no horizontal overflow.

## Findings

No actionable P0, P1, or P2 differences remain.

- Typography: Be Vietnam Pro is loaded locally at weights 300–700. The final measured heading, search field, filter, and card type metrics match the source (22 px/600 heading, 14 px search input, 12 px/500 filters).
- Spacing and layout: the final header is 56 px high, the brand mark is 28 px, the content frame is 1280 px, and the desktop capture height matches the source at 1202 px. Main alignment, section rhythm, card padding, borders, and radii align with the reference.
- Colors and tokens: visible colors match the source PrepVI palette. All component colors now reference semantic Tailwind tokens; no raw color values remain in React page/component code.
- Image and icon quality: the Question Bank target contains no product imagery. Handwritten SVGs and text-glyph controls were replaced with the consistent Phosphor icon set. The slight caret geometry difference is an intentional library substitution.
- Copy and content: source copy and realistic question data are preserved. The active navigation link uses a subtle primary text state plus `aria-current="page"`; this is an intentional accessibility enhancement and does not change layout.
- Accessibility and responsive behavior: form controls retain labels, tabs expose selected state, icon-only controls have accessible names, focus outlines are visible, the mobile menu is keyboard-addressable, and the tested mobile viewport has no clipping or horizontal overflow.

The combined full-view comparison keeps navigation, filters, typography, badges, and the first four question rows readable, so a separate focused crop was not necessary. Measured DOM rectangles were also compared for the header, brand, heading, search field, filters, main frame, and question card.

## Comparison history

### Pass 1 — blocked

- [P1] A global `font: inherit` rule overrode Tailwind's component-level text sizes on inputs and buttons. The search input rendered at 16 px instead of 14 px, and filters rendered at 16 px instead of 12 px.
- [P2] The shared navigation rendered at 64 px with a 32 px mark instead of the source's 56 px header and 28 px mark.
- Evidence: `design-qa-evidence/implementation-questions-desktop-pass1.png`.

Fixes made:

- Changed the global control reset to inherit only the font family, preserving utility-level size, weight, and line height.
- Aligned the shared navbar and brand dimensions with the source.
- Kept the improved active state semantic and replaced handwritten/glyph icons with Phosphor icons.

### Pass 2 — passed

- The corrected typography and geometry match the source measurements.
- Source and implementation full-page heights are both 1202 px.
- Side-by-side evidence: `design-qa-evidence/comparison-questions-desktop-pass2.png` and the final post-icon pass in `design-qa-evidence/comparison-questions-desktop-final.png`.
- No new actionable P0/P1/P2 findings were visible after the final icon and token pass.

## Functional verification

- Question search filtered to one matching result and active filter removal updated the page.
- JD flow: paste validation, extraction transition, OCR correction, mapping confirmation, preparation-plan creation, explanation expansion, question removal, and restoration.
- Mentor flow: discovery, profile navigation, slot selection, booking form validation/submission, and booking-status navigation.
- Mobile: menu open/close state and 390 px responsive layout.
- Route sweep: public, student, mentor, admin, JD, booking, feedback, audit, and system-status routes rendered without runtime error UI.
- Fresh browser console sweep: no warnings or errors.
- Automated checks: TypeScript, ESLint, Vitest, and the production Vite build pass.

## Follow-up polish

- P3: If the team prefers exact visual neutrality over wayfinding, remove the green active-link text in the public navbar. The current state is deliberately retained for orientation and accessibility.

## Implementation checklist

- [x] Match the reference type scale and layout rhythm.
- [x] Centralize colors and typography as semantic tokens.
- [x] Consolidate navigation and repeated domain/UI components.
- [x] Use canonical documented routes and typed API adapters.
- [x] Verify desktop/mobile rendering, primary journeys, console output, and production build.
