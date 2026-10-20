# Freelancer section border contrast

## Scope and traceability

- FL-002 (personal profile), FL-003/004 (portfolio and editor): FR-006/007/008, FLOW-04/05.
- FL-006 (project discovery), FL-009 (applications), FL-010/011 (invitations): FR-023/024/027/020/064, FLOW-06/07.
- TEAM-001 (team profile): FR-063, FLOW-05.
- Visual change only; no business rules, fixtures, storage, or simulated workflows changed.

## Implementation

FreelancerLayout now applies a scoped theme with divider #a8b0a2 (previously #e4e6e2). The same token feeds CSS --line and MUI outlined surfaces, including Paper surfaces rendered through portals. Existing strong project-card outlines and semantic status colors remain intact. Hardcoded pale neutral section borders now use the theme divider. Profile hover borders use text.secondary so they remain stronger than the normal border.

## Files created and modified in this change

- src/app/theme/freelancerTheme.ts (created)
- src/features/freelancer/layout/FreelancerLayout.tsx
- src/features/freelancer/pages/MyApplicationsPage.tsx
- src/features/freelancer/pages/InvitationsHubPage.tsx
- src/features/freelancer/components/InvitationDetailDialog.tsx
- src/features/freelancer/components/NotSelectedNoticeCard.tsx
- src/features/profile/components/PortfolioAttributionSelector.tsx
- src/features/profile/components/PortfolioEditor.tsx
- src/features/profile/components/EditProfileDialog.tsx
- src/features/profile/pages/ProfilePage.tsx
- src/features/team/pages/TeamProfilePage.tsx
- docs/implementation/FREELANCER_BORDER_CONTRAST_REPORT.md

## Verification

- Typecheck: passed.
- ESLint for all files changed in this request: passed.
- Full-project lint: blocked by seven existing errors in DemoController.tsx (conditional hooks) and AgreementReviewCard.tsx (explicit any).
- Production build: passed; existing bundle-size warning remains.
- Browser visual verification: not performed; final appearance still needs browser review.

