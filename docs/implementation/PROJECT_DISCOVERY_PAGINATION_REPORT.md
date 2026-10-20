# Project discovery pagination and card action

## Screens and requirements

FL-006 (project discovery) and FL-007 (project details). Traceability: FR-023, FR-024, FR-025, UC-03, FLOW-06. Page size of ten and larger card action follow the user request.

## Behavior

- Paginate the filtered and sorted results into pages of ten; final page may contain fewer items.
- Show total count and visible result range, with localized MUI pagination controls.
- Reset to page one when search, category, minimum budget, sort, or discovery view changes. Clamp the current page when the result count shrinks.
- Preview a project from the current page. Page navigation scrolls back to the list.
- Every project card has a permanently visible MUI outlined Xem thêm link button, minimum height 44px, with the project title in its accessible label. Existing bookmark and preview actions remain independent.
- Client-side pagination only, using existing project data and mock/API loading; no backend pagination or new fixtures.

## Files

- src/features/freelancer/hooks/useProjectPagination.ts (created)
- src/features/freelancer/FreelancerHomePage.tsx
- src/features/projects/dashboard/ProjectCard.tsx
- src/index.css (removed hidden legacy card-more link styles)
- docs/implementation/PROJECT_DISCOVERY_PAGINATION_REPORT.md (created)

## Validation

- Typecheck: passed.
- Lint for changed TypeScript files: passed.
- Full lint: seven pre-existing errors in DemoController.tsx and AgreementReviewCard.tsx.
- Pagination logic boundary checks: 21 results form pages of 10/10/1; filter reset, empty range, and initial selected-project page passed using a minimal state harness.
- Build: passed; bundle-size warning remains.
- Browser interaction/visual verification not performed.


## Follow-up: card action placement and hover

User request: place Xem thêm to the right of the bookmark button and add hover feedback.

- Updated src/features/projects/dashboard/ProjectCard.tsx and src/index.css.
- Actions are grouped at the bottom right: bookmark first, detail button second. Both have at least 44px targets. The detail-preview title area now uses the full card width.
- Detail button changes to the dark primary fill with white text on hover/focus. Its arrow moves slightly; pressing gives scale feedback. Reduced-motion preference disables movement.
- Screen traceability remains FL-006/007, FR-023/025, FLOW-06. No data or simulation behavior changed.
- Verification for this follow-up: typecheck, targeted lint, and production build passed. Full lint retains seven pre-existing errors. Browser visual verification not performed.


### Follow-up: upper-right actions

Moved the bookmark and Xem thêm action group to the top right of each card, on its own row above the title, preserving the action order and hover feedback. File: src/features/projects/dashboard/ProjectCard.tsx. Traceability: FL-006/007, FR-023/025, FLOW-06. No data changes. Verification: typecheck and production build passed. Full lint reports only the same seven pre-existing errors in unrelated files. Browser visual verification not performed.


### Follow-up: original bookmark position

Positioned the action group at top:20px/right:20px, matching the original bookmark anchor, instead of a separate normal-flow row. The metadata header reserves space beside the controls; narrow cards move metadata below the controls using a container query to prevent overlap. Files: src/features/projects/dashboard/ProjectCard.tsx and src/index.css. FL-006/007, FR-023/025, FLOW-06. Data and actions unchanged. Verification: typecheck and production build passed; lint reports only seven pre-existing errors outside this change. Browser visual verification not performed.


### Bug fix: no automatic card selection

Removed the first-card fallback in src/features/freelancer/FreelancerHomePage.tsx. Discovery, saved, and recommended lists start without a selected card when the route has no project ID. The details panel prompts the user to select a project; empty search results get a filter hint. Explicit project routes still show the matching project if it is on the visible page. FL-006/007, FR-023/024/025, FLOW-06. No mock/API data changes. Verification: typecheck and production build passed. Full lint shows only the same seven pre-existing errors outside the changed file. Browser visual verification not performed.

