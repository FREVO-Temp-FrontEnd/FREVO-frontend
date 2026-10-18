# FREVO Marketplace UI — Implementation Task Backlog (Corrected)

**Author:** Senior Specialist Engineering Team (Product Manager, Business Analyst, UI/UX Designer, Frontend Architect, React/TypeScript Engineer, Technical Reviewer)  
**Date:** October 2026  
**Status:** Approved Executable Task Specifications (20 Dependency-Ordered Tasks)  
**Reference Documents:** `AGENTS.md`, `docs/FREVO_SRS_Final.md`, `docs/FREVO_Main_Flow_Full_Product_UI_Scope_v1_FINAL_SCREEN_SPECS.md`, `REACT_STRUCTURE_GUIDE.md`

---

## 1. Backlog Overview & Dependency Map

The implementation backlog organizes the 74 documented screens into 20 discrete, verifiable development tasks ordered strictly by architectural dependency:

```text
TSK-001 (AuthSessionContext & Mock Storage Adapter)
  ├──► TSK-002 (Auth Redirection & Role Guards)
  │      └──► TSK-003 (Native Material UI Public Landing & Guest Exploration)
  └──► TSK-004 (Business Monolith Decomposition & Brief Lifecycle)
         ├──► TSK-005 (Matching, Evidence & AI Fit Simulation)
         ├──► TSK-006 (7-Day Invitations & Freelancer Invitation Hub per BR-024)
         ├──► TSK-007 (Application Submission, Status Tracking & Source Merging)
         ├──► TSK-007A (Portfolio Management, Media Validation & Contribution Attribution)
         └──► TSK-008 (CRITICAL: Candidate Review & Chat Approval Gating Modal)
                ├──► TSK-009 (Two-Sided Gated Project Chat per FR-045, FR-046)
                └──► TSK-010 (Agreement Proposal, Versioning & 3-Day Decision per FR-048, BR-024)
                       └──► TSK-011 (Selection Closure [Đóng tuyển], Candidate Rejection & Notification Center)
                              ├──► TSK-012 (Team Profiles, Roster & Context Switcher per FR-063, BR-020)
                              ├──► TSK-013 (Project Workspace & Flexible Milestone Tracker per BR-025)
                              │      ├──► TSK-014 (Deliverable Submissions, Revision Requests & Acceptance)
                              │      │      ├──► TSK-015 (Simulated Milestone Escrow Ledger per FR-056–062)
                              │      │      └──► TSK-016 (Post-Project Reviews per BR-016, FR-054)
                              │      └──► TSK-017 (Account Settings & Privacy Preferences)
                              └──► TSK-018 (Admin Management & Moderation Queue per FR-043, FR-044)
                                     └──► TSK-019 (Full UI Coverage & E2E Cross-Role Validation)
```

---

## Phase 0: Foundation, Design Tokens & Auth Session Stabilization

### Task TSK-001: Establish AuthSessionContext & Modular Mock Storage Adapter
- **Objective**: Create a modular session context and shared mock storage adapter to sync state across Business and Freelancer domains, avoiding a single monolithic god context.
- **Related Screen IDs**: Architectural Foundation (`AUTH-001`, `AUTH-002`, `BUS-001`, `FL-006`, `SHARED-001`).
- **Relevant Requirements**: `FR-001`, `FR-002`, `FR-004`, `FR-026`, `BR-003`.
- **Main Flows**: `FLOW-01`.
- **User Roles**: Guest, Business, Freelancer, Admin.
- **Files to Inspect**: `src/lib/api/agent.ts`, `src/features/business/business-data.ts`, `src/lib/hooks/useProjects.ts`, `src/app/layout/App.tsx`.
- **Files to Create**:
  - `src/lib/types/marketplace.types.ts` (Domain models: `UserSession`, `Project`, `Candidate`, `Invitation`, `Agreement`, `Milestone`, `Notification`)
  - `src/lib/storage/mockStorage.ts` (Reactive storage adapter with cross-tab and cross-component pub/sub sync)
  - `src/lib/context/auth-context.tsx` (`AuthSessionContext` managing current user, active role, acting identity)
  - `src/lib/hooks/useAuthSession.ts` (Hook for session access and role switching)
- **Files to Modify**: `src/app/layout/App.tsx` (Mount `<AuthSessionProvider>`).
- **Architecture Dependencies**: Replaces proposed single giant `MarketplaceContext` with domain-specific modular hooks per `REACT_STRUCTURE_GUIDE.md` and `vercel-react-best-practices`.
- **Applicable Skills**: `vercel-react-best-practices` (`rerender-split-combined-hooks`), `building-components`.
- **Implementation Steps**:
  1. Define unified TypeScript domain types in `marketplace.types.ts`.
  2. Implement `mockStorage.ts` with typed getter/setter functions and event listeners for real-time reactivity across hooks.
  3. Create `AuthSessionContext` storing `{ user, role, actingAs, login, logout, switchActingIdentity }`.
  4. Seed initial mock storage with coherent baseline data merging business projects and freelancer profiles.
- **Acceptance Criteria**:
  - `AuthSessionContext` provides reactive role and identity state without unneeded global re-renders.
  - Calling storage mutation functions dispatches change events to all subscribed domain hooks.
  - State persists cleanly across page reloads via `sessionStorage`.
- **Verification Method**: `npm.cmd run typecheck`, `npm.cmd run lint`.
- **Effort**: Medium.
- **Dependencies**: None.

---

### Task TSK-002: Wire Authentication Pages to Session Redirection & Role Guards
- **Objective**: Connect `LoginPage.tsx`, `RegisterPage.tsx`, and `ForgotPasswordPage.tsx` to `AuthSessionContext`, replacing dead-end mock alerts with active session establishment and role-based redirection.
- **Related Screen IDs**: `AUTH-001`, `AUTH-002`, `AUTH-003`, `SHARED-001`.
- **Relevant Requirements**: `FR-001`, `FR-002`, `FR-004`, `FR-005`.
- **Main Flows**: `FLOW-01`.
- **User Roles**: Guest to Business / Freelancer.
- **Files to Inspect**: `src/features/auth/pages/LoginPage.tsx`, `RegisterPage.tsx`, `ForgotPasswordPage.tsx`, `src/app/router/Routes.tsx`.
- **Files to Create**:
  - `src/app/shared/components/RoleGuard.tsx` (Route protection component enforcing role boundaries)
  - `src/app/shared/components/ForbiddenPage.tsx` (`SHARED-001` — 403 Forbidden)
- **Files to Modify**: `LoginPage.tsx`, `RegisterPage.tsx`, `ForgotPasswordPage.tsx`, `Routes.tsx`.
- **Components to Reuse**: Existing Material UI `TextField`, `Button`, `Checkbox`.
- **Interactions**:
  - Submitting `LoginPage` authenticates user and redirects to `/business` or `/projects` based on role.
  - Submitting `RegisterPage` registers account with chosen role (`client` vs `freelancer`) and navigates to dashboard.
  - Submitting `ForgotPasswordPage` displays simulated recovery code confirmation dialog.
  - Navigating to unauthorized role routes renders `SHARED-001` with an explanation and return button.
- **Applicable Skills**: `building-components`, `web-design-guidelines`.
- **Acceptance Criteria**:
  - Logging in as Business redirects to `/business`.
  - Logging in as Freelancer redirects to `/projects`.
  - Attempting to access `/business` while authenticated as Freelancer displays `SHARED-001` (403).
- **Verification Method**: `npm.cmd run typecheck`, `npm.cmd run lint`, browser test.
- **Effort**: Low.
- **Dependencies**: `TSK-001`.

---

### Task TSK-003: Implement Guest Project Exploration & Cross-Application Navigation
- **Objective**: Implement Guest Project Discovery (`PUB-002`) and Public Project Detail (`PUB-003`), configure cross-application navigation links to the external Next.js landing page (`PUB-001`), and establish public guest navigation without recreating or rewriting `PUB-001`.
- **Related Screen IDs**: `PUB-001` (external integration), `PUB-002`, `PUB-003`, `SHARED-002`, `SHARED-003`.
- **Relevant Requirements**: `2.3`, `2.1`, `FR-025`, `NFR-01`, `NFR-02`, `DEC-11`.
- **Main Flows**: `FLOW-01`.
- **User Roles**: Guest.
- **Files to Inspect**: `src/features/freelancer/FreelancerHomePage.tsx`, `src/app/router/Routes.tsx`, `src/app/theme/theme.ts`.
- **Files to Create**:
  - `src/lib/config/navigation.ts` (External landing page URL configuration, e.g. `VITE_LANDING_PAGE_URL`)
  - `src/features/public/pages/GuestProjectExplorerPage.tsx` (`PUB-002` — Read-only project discovery with filter bar and sign-in prompts)
  - `src/features/public/pages/PublicProjectDetailPage.tsx` (`PUB-003`)
  - `src/app/shared/components/ErrorRetryBanner.tsx` (`SHARED-003`)
- **Files to Modify**:
  - `src/app/router/Routes.tsx` (Marketplace root `/` renders Guest Project Explorer `PUB-002` for unauthenticated visitors; authenticated users navigate to `/business` or `/projects`)
  - `src/features/freelancer/components/FreelancerHeader.tsx` (Add navigation links and logo link to external Landing Page `PUB-001`)
- **Components to Reuse**: `ProjectCard.tsx`, `ProjectFilters.tsx`, `NotFound.tsx` (`SHARED-002`).
- **Interactions**:
  - Guests visiting Marketplace explore projects in read-only mode (`PUB-002`, `PUB-003`).
  - Header displays clear link and logo navigation connecting back to the external Landing Page (`PUB-001`), configured via `navigation.ts`.
  - `PUB-001` remains an independent Next.js application (`cm-website`), marked as externally implemented pending integration and visual verification.
  - Clicking "Ứng tuyển" on `PUB-003` directs unauthenticated guests to `/login?returnUrl=/projects/:id`.
- **Applicable Skills**: `web-design-guidelines`, `building-components`.
- **Acceptance Criteria**:
  - `PUB-001` is preserved in the screen inventory and marked as externally implemented in `cm-website`.
  - Marketplace integrates with external landing page via configurable URLs and navigation links.
  - Guests can explore projects in read-only mode (`PUB-002`, `PUB-003`).
  - Unauthenticated actions prompt cleanly to log in or register.
- **Verification Method**: `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run build`.
- **Effort**: Low to Medium.
- **Dependencies**: `TSK-002`.

---

## Phase 1: Core Marketplace — Briefs, Discovery, Matching, Applications & Gating

### Task TSK-004: Decompose Business Prototype & Standardize Brief Lifecycle on MUI
- **Objective**: Decompose `BusinessPrototype.tsx` into modular feature pages, standardize all forms on Material UI theme tokens, and manage project brief states (`draft`, `published`, `closed`).
- **Related Screen IDs**: `BUS-001`, `BUS-002`, `BUS-003`, `BUS-004`, `BUS-005`, `BUS-006`.
- **Relevant Requirements**: `FR-012`–`FR-016`, `BR-001`, `BR-002`, `BR-019`, `UC-01`.
- **Main Flows**: `FLOW-02`, `FLOW-12`.
- **User Roles**: Business.
- **Files to Inspect**: `src/features/business/BusinessPrototype.tsx`, `src/features/business/business.css`.
- **Files to Create**:
  - `src/features/business/layout/BusinessLayout.tsx` (MUI sidebar and header shell)
  - `src/features/business/pages/BusinessDashboardPage.tsx` (`BUS-001`)
  - `src/features/business/pages/MyProjectsPage.tsx` (`BUS-002`)
  - `src/features/business/pages/CreateBriefPage.tsx` (`BUS-003`, `BUS-004`)
  - `src/features/business/pages/ProjectDetailPage.tsx` (`BUS-005`)
  - `src/features/business/components/CloseProjectDialog.tsx` (`BUS-006`)
- **Files to Modify**: `src/app/router/Routes.tsx` (Register nested routes under `/business/*`).
- **Components to Reuse**: Material UI `Box`, `Typography`, `Button`, `Dialog`, `Chip`, `TextField`, `Select`.
- **Interactions**:
  - Form validates title, category, budget range, deadline, deliverables list, and executor preference (`Individual`, `Team`, `Both` per `BR-001`).
  - "Lưu nháp" stores brief in `draft` status (`FR-013`).
  - "Công bố dự án" transitions brief to `published` (`FR-014`), immediately publishing it to shared mock storage.
  - "Đóng tuyển" opens `CloseProjectDialog` (`BUS-006`), explaining that pending candidates will not be selected (`BR-019`).
- **Applicable Skills**: `vercel-react-best-practices`, `building-components`.
- **Acceptance Criteria**:
  - `BusinessPrototype.tsx` is completely decomposed into clean single-responsibility files.
  - Newly published briefs appear immediately in Freelancer discovery (`FL-006`).
  - All styling utilizes Material UI theme tokens (`#f4490b`, `#20201f`, `Space Grotesk`, `Archivo`).
- **Verification Method**: `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run build`.
- **Effort**: High.
- **Dependencies**: `TSK-001`.

---

### Task TSK-005: Implement Candidate Matching, Evidence & AI Fit Simulation
- **Objective**: Implement explainable matching suggestions with portfolio evidence cards, matching deduplication per `BR-028`, and simulated AI fit breakdown per `FR-034`–`FR-036`.
- **Related Screen IDs**: `BUS-007`, `BUS-008`, `BUS-014`, `BUS-015`.
- **Relevant Requirements**: `FR-017`, `FR-018`, `FR-034`, `FR-035`, `FR-036`, `BR-004`, `BR-026`, `BR-027`, `BR-028`, `UC-02`.
- **Main Flows**: `FLOW-03`.
- **User Roles**: Business.
- **Files to Inspect**: `src/features/business/BusinessPrototype.tsx` (`SuggestionsPage`, `TalentProfile`).
- **Files to Create**:
  - `src/features/business/components/CandidateSuggestionsTab.tsx` (`BUS-007`)
  - `src/features/business/components/TalentEvidenceCard.tsx` (`BUS-008`)
  - `src/features/business/components/EmptyMatchingState.tsx` (`BUS-014`)
  - `src/features/business/components/AIFitAnalysisModal.tsx` (`BUS-015` — Governed by `FR-034`–`FR-036`)
- **Components to Reuse**: `PortfolioCover.tsx`, MUI `Chip`, `Card`.
- **Interactions**:
  - Displays candidates matching project category and skills with transparent rationale tags (`BR-026`).
  - Team profiles appear at most once in suggestions list; team members may appear individually based on personal skills (`BR-028`).
  - Clicking candidate opens `TalentEvidenceCard` linking directly to actual portfolio items (`BR-027`).
  - `BUS-015` modal renders AI profile evaluation analysis with explicit disclaimer that results are advisory (`FR-034`, `FR-035`, `FR-036`).
- **Applicable Skills**: `web-design-guidelines`, `building-components`.
- **Acceptance Criteria**:
  - Matching list enforces `BR-028` team deduplication.
  - Evidence cards link directly to verified portfolio items per `BR-027`.
  - `BUS-015` clearly displays advisory disclaimer per `FR-036`.
- **Verification Method**: `npm.cmd run typecheck`, `npm.cmd run lint`.
- **Effort**: Medium.
- **Dependencies**: `TSK-004`.

---

### Task TSK-006: Implement 7-Day Invitations & Freelancer Invitation Hub
- **Objective**: Standardize invitation dispatching with SRS-compliant 7-day expiration (`FR-019`, `BR-024`), and build the Freelancer Invitation Hub with acceptance handling under `BR-005`.
- **Related Screen IDs**: `BUS-009`, `BUS-010`, `FL-010`, `FL-011`.
- **Relevant Requirements**: `FR-019`, `FR-020`, `FR-021`, `FR-022`, `BR-004`, `BR-005`, `BR-008`, `BR-009`, `BR-024`, `UC-04`.
- **Main Flows**: `FLOW-03`, `FLOW-07`, `FLOW-12`.
- **User Roles**: Business, Freelancer.
- **Files to Create**:
  - `src/features/business/components/SendInvitationDialog.tsx` (`BUS-009`)
  - `src/features/business/components/SentInvitationsTab.tsx` (`BUS-010`)
  - `src/features/freelancer/pages/InvitationsHubPage.tsx` (`FL-010`)
  - `src/features/freelancer/components/InvitationDetailDialog.tsx` (`FL-011`)
- **Files to Modify**: `src/features/freelancer/components/FreelancerNav.tsx` (Add "Lời mời" tab with unread count).
- **Interactions**:
  - Business clicks "Gửi lời mời" on `BUS-007` -> opens dialog showing brief and **7-day expiration note** per `FR-019`, `BR-024`.
  - Sent invitations tab (`BUS-010`) displays active 7-day countdown.
  - Freelancer views incoming invitations in `FL-010` and opens `FL-011`.
  - Clicking "Chấp nhận lời mời" updates candidate status to `Chờ Business xem xét` per `BR-005`.
  - Displays explicit confirmation per `BR-005`: *"Lời mời đã được chấp nhận. Hồ sơ của bạn đã được chuyển cho Doanh nghiệp xem xét để mở kênh trao đổi."* (Chat remains gated!).
- **Applicable Skills**: `building-components`, `web-design-guidelines`.
- **Acceptance Criteria**:
  - Invitations display an accurate **7-day expiration** window per `FR-019` and `BR-024`.
  - Accepting an invitation creates candidate record in status `Chờ Business xem xét` (`BR-005`).
  - Chat does NOT open automatically upon invitation acceptance.
- **Verification Method**: `npm.cmd run typecheck`, `npm.cmd run lint`.
- **Effort**: Medium.
- **Dependencies**: `TSK-004`, `TSK-001`.

---

### Task TSK-007: Implement Application Submission, Status Tracking & Source Merging
- **Objective**: Implement multi-identity proposal submission (`Individual` vs `Team` per `BR-003`, `FR-026`), application tracking (`FL-009`), withdrawal (`FL-012`), and candidate inbox source merging per `BR-011`.
- **Related Screen IDs**: `FL-001`, `FL-005`, `FL-006`, `FL-007`, `FL-008`, `FL-009`, `FL-012`, `BUS-011`, `BUS-012`.
- **Relevant Requirements**: `FR-010`, `FR-023`–`FR-030`, `BR-002`, `BR-003`, `BR-006`, `BR-007`, `BR-010`, `BR-011`, `BR-012`, `UC-03`, `UC-05`.
- **Main Flows**: `FLOW-04`, `FLOW-06`, `FLOW-08`, `FLOW-12`.
- **User Roles**: Freelancer, Business.
- **Files to Inspect**: `src/features/projects/application/ProjectApplyDialog.tsx`, `src/features/projects/dashboard/ProjectList.tsx`.
- **Files to Create**:
  - `src/features/freelancer/pages/ApplicationTrackingPage.tsx` (`FL-009`)
  - `src/features/freelancer/components/WithdrawApplicationDialog.tsx` (`FL-012`)
  - `src/features/freelancer/components/OptionalCVUploadCard.tsx` (`FL-005`)
  - `src/features/business/components/ApplicantsInboxTab.tsx` (`BUS-011`)
  - `src/features/business/components/ProposalReviewDrawer.tsx` (`BUS-012`)
- **Files to Modify**: `ProjectApplyDialog.tsx` (`FL-008`), `FreelancerHomePage.tsx` (`FL-001`).
- **Interactions**:
  - `ProjectApplyDialog` allows selecting whether applying as Individual or as Team Representative (`FR-026`, `BR-003`).
  - Submitting proposal adds candidate record to Business inbox (`BUS-011`).
  - If freelancer had already accepted an invitation, sources are merged into `Ứng tuyển · Lời mời` on the single candidate record (`BR-011`).
  - Freelancer tracks application stages (`FL-009`) and can withdraw proposal before review (`FL-012`, `BR-010`).
  - Business inspects proposal cover letter, attached portfolio items, and optional CV in `BUS-012` (`BR-012`).
- **Applicable Skills**: `building-components`, `vercel-composition-patterns`.
- **Acceptance Criteria**:
  - Exactly one candidate record exists per account per project (`BR-006`, `BR-011`).
  - Candidate identity (`Individual` vs `Team`) cannot be changed after submission (`BR-003`).
  - Proposal withdrawal updates status and removes candidate from active review.
- **Verification Method**: `npm.cmd run typecheck`, `npm.cmd run lint`.
- **Effort**: High.
- **Dependencies**: `TSK-006`.

---

### Task TSK-007A: Implement Complete Portfolio Management & Media Validation
- **Objective**: Implement comprehensive portfolio management (`FL-003`) and rich case study editor (`FL-004`), including media upload validation (`NFR-10`, `DEC-02`), individual vs team attribution (`BR-027`), and responsive empty/error states.
- **Related Screen IDs**: `FL-003`, `FL-004`.
- **Relevant Requirements**: `FR-008`, `NFR-10`, `BR-027`, `DEC-02`, `UC-04`.
- **Main Flows**: `FLOW-04`.
- **User Roles**: Freelancer, Team Representative.
- **Files to Inspect**: `src/features/profile/pages/ProfilePage.tsx`, `src/features/profile/components/PortfolioEditor.tsx`, `PortfolioCover.tsx`.
- **Files to Create**:
  - `src/features/profile/components/PortfolioMediaValidator.tsx` (Enforces client-side validation for image formats, file sizes, and video limits using configurable prototype mock limits per `NFR-10`, `DEC-02`)
  - `src/features/profile/components/PortfolioAttributionSelector.tsx` (Selects individual vs team attribution per `BR-027`)
- **Files to Modify**: `PortfolioEditor.tsx`, `ProfilePage.tsx`.
- **Interactions**:
  - Freelancer adds/edits portfolio case study with title, category, client, challenge, solution, deliverables.
  - Media uploader validates file size (configurable prototype mock limit: max 25MB per `NFR-10`, `DEC-02`) and format (JPEG, PNG, MP4) with clear inline error alerts (`NFR-10`).
  - Contribution selector explicitly records whether work was produced individually or as part of a team, and specifies the member's exact role per `BR-027`.
  - Empty portfolio state renders an encouraging prompt with example templates.
- **Applicable Skills**: `building-components`, `web-design-guidelines`.
- **Acceptance Criteria**:
  - Media uploader enforces file size and format validation rules per `NFR-10` (with 25MB designated as configurable prototype mock limit).
  - Team vs individual attribution tags are saved and rendered on portfolio cards per `BR-027`.
  - Responsive layout renders cleanly across mobile, tablet, and desktop.
- **Verification Method**: `npm.cmd run typecheck`, `npm.cmd run lint`.
- **Effort**: Medium.
- **Dependencies**: `TSK-007`.

---

### Task TSK-008: Implement Critical Business Candidate Review & Chat Approval Gating
- **Objective**: Implement `BUS-013` (Candidate Review & Approval Modal) and strictly enforce that chat cannot be opened until Business reviews and approves the candidate per `FR-031`, `FR-045`, `BR-012`, `BR-013`.
- **Related Screen IDs**: `BUS-013`, `BUS-011`, `PROJ-001`, `PROJ-002`.
- **Relevant Requirements**: `FR-031`, `FR-045`, `BR-012`, `BR-013`, `UC-05`.
- **Main Flows**: `FLOW-08`, `FLOW-09`.
- **User Roles**: Business.
- **Files to Create**: `src/features/business/components/ApproveCandidateDialog.tsx` (`BUS-013`).
- **Files to Modify**: `src/features/business/components/ApplicantsInboxTab.tsx`.
- **Interactions**:
  - Candidate cards display actions: "Duyệt hồ sơ (Mở chat)" or "Từ chối".
  - Clicking "Duyệt hồ sơ" opens `ApproveCandidateDialog` confirming: *"Duyệt hồ sơ này sẽ mở kênh trao đổi trực tiếp trong dự án giữa Doanh nghiệp và Ứng viên."*
  - On confirmation, candidate `chatApproved` is set to `true`, status updates to `discussing`, and Freelancer receives notification.
  - Chat CTA becomes enabled only after approval.
- **Applicable Skills**: `building-components`, `web-design-guidelines`.
- **Acceptance Criteria**:
  - **Resolves critical bug**: Chat is locked before approval.
  - Business approving candidate explicitly unlocks chat for both parties (`FR-031`, `FR-045`).
  - Rejection transitions candidate to `not_selected` and locks chat permanently.
- **Verification Method**: `npm.cmd run typecheck`, `npm.cmd run lint`, manual test.
- **Effort**: Medium.
- **Dependencies**: `TSK-007`.

---

## Phase 2: Selection, Gated Communication & Agreements

### Task TSK-009: Implement Two-Sided Gated Project Chat & Read-Only Gating
- **Objective**: Build the shared chat interface between Business and approved candidate (`PROJ-001`), governed strictly by `FR-045`, `FR-046`, `BR-012`, `BR-013`, with locked placeholder (`PROJ-002`).
- **Related Screen IDs**: `PROJ-001`, `PROJ-002`.
- **Relevant Requirements**: `FR-031`, `FR-045`, `FR-046`, `BR-012`, `BR-013`, `UC-06`.
- **Main Flows**: `FLOW-09`.
- **User Roles**: Business, Freelancer.
- **Files to Create**:
  - `src/features/projects/chat/ProjectChatRoom.tsx` (`PROJ-001` — Governed by `FR-045`, `FR-046`)
  - `src/features/projects/chat/LockedChatState.tsx` (`PROJ-002` — Governed by `BR-012`, `BR-013`)
- **Files to Modify**: `src/app/router/Routes.tsx` (Add `/projects/:projectId/chat/:candidateId`).
- **Interactions**:
  - Displays conversation history, sender attribution, timestamps, and message input (`FR-046`).
  - Business header contains "Soạn thỏa thuận hợp tác" trigger button.
  - If `chatApproved === false`, renders `PROJ-002` explaining: *"Hồ sơ đang chờ Doanh nghiệp xem xét để mở kênh trao đổi"* (`BR-012`).
  - When recruitment is closed or agreement confirmed, chat becomes read-only (`FR-045`).
- **Applicable Skills**: `building-components`, `web-design-guidelines`.
- **Acceptance Criteria**:
  - Chat references verified chat requirements (`FR-045`, `FR-046`), not AI evaluation (`FR-034`–`036`).
  - Unapproved candidates see locked state explaining approval prerequisite (`BR-012`).
  - Message exchange synchronizes in real time between Business and Freelancer.
- **Verification Method**: `npm.cmd run typecheck`, `npm.cmd run lint`.
- **Effort**: High.
- **Dependencies**: `TSK-008`.

---

### Task TSK-010: Implement Agreement Proposal, Versioning & 3-Day Decision
- **Objective**: Implement agreement drafting (`PROJ-003`), two-sided review with **3-day countdown** (`PROJ-004` per `FR-032`, `BR-024`), and versioning preserving active confirmed version (`PROJ-005` per `FR-048`).
- **Related Screen IDs**: `PROJ-003`, `PROJ-004`, `PROJ-005`, `PROJ-007`.
- **Relevant Requirements**: `FR-032`, `FR-047`, `FR-048`, `BR-015`, `BR-021`, `BR-022`, `BR-024`, `11.7`.
- **Main Flows**: `FLOW-10`, `FLOW-11`.
- **User Roles**: Business, Freelancer.
- **Files to Create**:
  - `src/features/projects/agreements/DraftAgreementForm.tsx` (`PROJ-003`)
  - `src/features/projects/agreements/AgreementReviewCard.tsx` (`PROJ-004` — 3-day countdown per `BR-024`)
  - `src/features/projects/agreements/AgreementVersionHistory.tsx` (`PROJ-005` — Preserves active version per `FR-048`)
  - `src/features/projects/agreements/AgreementExpiredState.tsx` (`PROJ-007`)
- **Interactions**:
  - Business drafts scope, milestone breakdown, budget, deadline (`FR-047`).
  - Freelancer reviews agreement showing **3-day countdown** per `FR-032`, `BR-024`.
  - Actions: "Xác nhận thỏa thuận" or "Yêu cầu điều chỉnh".
  - **Version Preservation (`FR-048`)**: Editing an agreement creates proposed V2. V1 remains the effective confirmed agreement until V2 is confirmed by both parties. If V2 is rejected or expires, V1 remains in force.
  - Prominently displays legal disclaimer per `FR-047`, `BR-022`: *"Bản tóm tắt thỏa thuận hợp tác ghi nhận phạm vi đã thống nhất, không mặc định là hợp đồng điện tử có chứng thực."*
- **Applicable Skills**: `building-components`, `web-design-guidelines`.
- **Acceptance Criteria**:
  - Agreement proposals enforce a **3-day expiration** countdown (`BR-024`).
  - Proposed revisions preserve the existing confirmed version as effective until mutual confirmation (`FR-048`).
  - Rejection of a revision reverts to the existing confirmed version (`FR-048`, `BR-021`).
- **Verification Method**: `npm.cmd run typecheck`, `npm.cmd run lint`.
- **Effort**: High.
- **Dependencies**: `TSK-009`.

---

### Task TSK-011: Implement Selection Closure, Candidate Rejection & Notification Center
- **Objective**: Handle selection closure (`Đã đóng tuyển` per `BR-023`, `PROJ-006`), notify unselected candidates (`FL-013`), and connect the Notification Center and Header Bell (`NOTIF-001`, `NOTIF-002`) to real events.
- **Related Screen IDs**: `PROJ-006`, `FL-013`, `NOTIF-001`, `NOTIF-002`.
- **Relevant Requirements**: `FR-033`, `FR-064`, `BR-022`, `BR-023`.
- **Main Flows**: `FLOW-11`, `FLOW-18`.
- **User Roles**: Business, Freelancer.
- **Files to Create**:
  - `src/features/projects/agreements/SelectionClosedBanner.tsx` (`PROJ-006`)
  - `src/features/freelancer/components/NotSelectedNoticeCard.tsx` (`FL-013`)
  - `src/features/notifications/pages/NotificationCenterPage.tsx` (`NOTIF-001`)
- **Files to Modify**: `src/features/freelancer/components/NotificationsBell.tsx` (`NOTIF-002`).
- **Interactions**:
  - Confirming an agreement sets project status to `Đã đóng tuyển` (`closed` recruitment) and candidate to `Đã được chọn` (`selected`) per `BR-023`.
  - Explains that `Đóng tuyển không đồng nghĩa dự án đã hoàn thành` (`BR-023`).
  - All other applicants transition to `Không được chọn` (`not_selected`) with notification banner (`FL-013`).
  - `NotificationsBell` displays live unread counter and deep-links directly to target object per `FR-064`.
- **Applicable Skills**: `building-components`, `web-design-guidelines`.
- **Acceptance Criteria**:
  - Confirming agreement closes recruitment and marks all other applicants as not selected per `BR-023`.
  - Notification bell items navigate directly to target projects, messages, or agreements.
- **Verification Method**: `npm.cmd run typecheck`, `npm.cmd run lint`.
- **Effort**: Medium.
- **Dependencies**: `TSK-010`.

---

## Phase 3: Extended Product UI — Teams, Workspace, Execution & Payments

### Task TSK-012: Implement Team Profiles, Roster & Context Switcher
- **Objective**: Implement team profile, member roster, attributed team portfolio, and leader context switcher per `FR-063`, `FR-026`, `BR-003`, `BR-020`, `BR-027`.
- **Related Screen IDs**: `AUTH-004`, `TEAM-001`, `TEAM-002`, `TEAM-003`, `TEAM-004`, `TEAM-005`.
- **Relevant Requirements**: `FR-026`, `FR-063`, `BR-003`, `BR-020`, `BR-021`, `BR-027`, `DEC-09`.
- **Main Flows**: `FLOW-05`.
- **User Roles**: Freelancer Leader.
- **Files to Create**:
  - `src/features/team/pages/TeamProfilePage.tsx` (`TEAM-001` — Governed by `FR-063`)
  - `src/features/team/components/TeamRosterTab.tsx` (`TEAM-002` — Governed by `FR-063`)
  - `src/features/team/components/TeamPortfolioTab.tsx` (`TEAM-003` — Governed by `BR-027`)
  - `src/features/team/components/TeamContextToggle.tsx` (`TEAM-004` / `AUTH-004`)
  - `src/features/team/components/TeamPermissionsPreview.tsx` (`TEAM-005` — Post-MVP P2 preview)
- **Files to Modify**: `src/features/freelancer/components/FreelancerHeader.tsx`.
- **Interactions**:
  - Freelancer leader manages Team profile: name, leader, bio, member roster with expected roles (`FR-063`).
  - Team portfolio displays cases with explicit individual attribution tags per `BR-027`.
  - Context switcher toggles acting persona between Individual and Team Leader (`FR-026`, `BR-003`).
  - `TEAM-005` displays clear preview note: *"Phân quyền thành viên nhiều tài khoản là tính năng ngoài MVP."*
- **Applicable Skills**: `building-components`, `web-design-guidelines`.
- **Acceptance Criteria**:
  - Correctly references `FR-063` (Team profile) rather than payment compliance (`FR-061`/`FR-062`).
  - Context toggle updates acting identity in application modal (`BR-003`).
  - Team portfolio attributes specific member contributions per `BR-027`.
- **Verification Method**: `npm.cmd run typecheck`, `npm.cmd run lint`.
- **Effort**: Medium.
- **Dependencies**: `TSK-007`.

---

### Task TSK-013: Implement Project Workspace & Milestone Tracker
- **Objective**: Build the post-selection workspace where Business and selected talent monitor milestone progression with flexible execution order per `BR-025`.
- **Related Screen IDs**: `WORK-001`, `WORK-002`, `WORK-003`.
- **Relevant Requirements**: `FR-037`, `FR-039`, `FR-049`, `FR-050`, `BR-025`, `UC-07`.
- **Main Flows**: `FLOW-13`.
- **User Roles**: Business, Selected Freelancer.
- **Files to Create**:
  - `src/features/workspace/pages/WorkspaceOverviewPage.tsx` (`WORK-001`)
  - `src/features/workspace/components/MilestoneTimeline.tsx` (`WORK-002` — Flexible progression per `BR-025`)
  - `src/features/workspace/components/MilestoneDetailModal.tsx` (`WORK-003`)
- **Files to Modify**: `src/app/router/Routes.tsx` (Add `/workspace/:projectId`).
- **Interactions**:
  - Displays project workspace overview, confirmed budget, executor card, active milestone parameters.
  - **Flexible Milestone Execution (`BR-025`)**: Allows progress updates and deliverables across milestones without forcing rigid sequential locking unless specified by agreement.
- **Applicable Skills**: `building-components`, `web-design-guidelines`.
- **Acceptance Criteria**:
  - Workspace displays confirmed agreement deliverables and deadlines.
  - Milestones execute flexibly without artificial sequential blocking.
- **Verification Method**: `npm.cmd run typecheck`, `npm.cmd run lint`.
- **Effort**: High.
- **Dependencies**: `TSK-011`.

---

### Task TSK-014: Implement Deliverable Submissions, Revision Requests & Acceptance
- **Objective**: Implement deliverable submission with version tracking, mutually agreed revision allowances per milestone (`DEC-03`), Business revision requests requiring specific reasons (`WORK-005`, `BR-014`), mutual consultation on exhausted revisions, and project completion (`WORK-006`, `FR-040`, `FR-053`).
- **Related Screen IDs**: `WORK-004`, `WORK-005`, `WORK-006`, `WORK-007`, `WORK-008`.
- **Relevant Requirements**: `FR-038`, `FR-040`, `FR-048`, `FR-050`, `FR-051`, `FR-052`, `FR-053`, `BR-014`, `BR-025`, `10.4`, `DEC-03`.
- **Main Flows**: `FLOW-14`.
- **User Roles**: Business, Freelancer.
- **Files to Create**:
  - `src/features/workspace/components/SubmitDeliverableDialog.tsx` (`WORK-004`)
  - `src/features/workspace/components/AcceptanceReviewDialog.tsx` (`WORK-005` — Accept or Revision per `BR-014`, `DEC-03`)
  - `src/features/workspace/components/ProjectCompletedModal.tsx` (`WORK-006` — Per `FR-040`, `FR-053`)
  - `src/features/workspace/components/ScopeChangeRequestModal.tsx` (`WORK-007` — Scope change proposing agreement revision per `FR-048`)
  - `src/features/workspace/components/OverdueWarningBanner.tsx` (`WORK-008`)
- **Interactions**:
  - Freelancer submits deliverable URL + notes -> milestone updates to `submitted`.
  - **Milestone Revision Allowance (`DEC-03`)**: Each milestone displays its mutually agreed revision allowance (e.g. configurable numeric count or an explicitly agreed custom arrangement). Shows how many revision rounds have been used when a numeric allowance exists (e.g., "Đã dùng 1/2 lượt sửa đổi").
  - Business reviews submission: "Nghiệm thu (Accept)" or "Yêu cầu chỉnh sửa (Request Revision)" with specific unmet criteria per `BR-014`.
  - **Allowance Exhaustion Protocol (`DEC-03`)**: Does **not** automatically charge fees, reject deliverables, or mark milestones complete when the allowance is exhausted. Instead, UI displays a clear consultation notice indicating that additional revisions require consultation and mutual agreement between both parties.
  - **Out-of-Scope Work & Agreement Amendment (`WORK-007`, `PROJ-005`)**: For work outside the agreed milestone scope, represents a proposed agreement change rather than silently altering the existing agreement. In accordance with `FR-048`, the currently effective agreement version remains active and in force until a replacement agreement is mutually confirmed by both parties.
  - When all milestones are accepted, project transitions to `completed` (`FR-053`) and renders `ProjectCompletedModal` (`WORK-006`).
  - Label additional revision mechanics not explicitly defined in the SRS as proposed prototype behavior pending formal SRS approval.
- **Applicable Skills**: `building-components`, `web-design-guidelines`.
- **Acceptance Criteria**:
  - Revision requests require stating unmet agreed criteria per `BR-014`.
  - Each milestone displays mutually agreed revision allowance and tracks used rounds (`DEC-03`).
  - Does not impose a platform-wide 2-round cap or automatic completion/penalty when exhausted.
  - Exhausted allowance displays mutual consultation guidance.
  - Out-of-scope work prompts agreement modification proposal, preserving active version per `FR-048`.
  - Project completion occurs only when all agreed milestones are accepted per `FR-053`.
- **Verification Method**: `npm.cmd run typecheck`, `npm.cmd run lint`.
- **Effort**: High.
- **Dependencies**: `TSK-013`.

---

### Task TSK-015: Implement Simulated Milestone Escrow Ledger & Disbursements
- **Objective**: Build simulated milestone payment flows, breakdowns, receipts, and retry scenarios with prominent non-production badges per `FR-056`–`FR-062` and approved prototype decision `DEC-04`.
- **Related Screen IDs**: `PAY-001`, `PAY-002`, `PAY-003`, `PAY-004`, `PAY-005`.
- **Relevant Requirements**: `FR-056`–`FR-060`, `FR-061` (payment compliance), `FR-062` (tax/accounting reporting), `BR-017`, `BR-018`, `10.3`, `11.5`, `DEC-04`.
- **Main Flows**: `FLOW-15`, `FLOW-16`.
- **User Roles**: Business, Freelancer.
- **Files to Create**:
  - `src/features/payments/pages/PaymentLedgerPage.tsx` (`PAY-001`)
  - `src/features/payments/components/FundMilestoneModal.tsx` (`PAY-002` — Governed by `FR-056`, `FR-061`, `DEC-04`)
  - `src/features/payments/components/DisbursementHistoryTable.tsx` (`PAY-003` — Governed by `FR-058`, `FR-060`, `FR-062`, `DEC-04`)
  - `src/features/payments/components/PaymentRetryState.tsx` (`PAY-004` — Governed by `FR-059`)
  - `src/features/payments/components/DisputeConceptCard.tsx` (`PAY-005` — Concept mockup per `DEC-05`)
- **Interactions**:
  - Displays the agreed milestone value from the confirmed agreement.
  - Displays FREVO platform fees as `"Chưa xác định"`.
  - Does **not** calculate or display a final net payout or actual total payable until fee policy and fee payer have been approved.
  - Prominently displays mandatory disclaimer: *"Mức phí dịch vụ nền tảng đang trong giai đoạn khảo sát chính sách."*
  - Clearly labels all payment screens as simulations (`MÔ PHỎNG THANH TOÁN / SIMULATED LEDGER`) per `BR-017`.
  - Funding milestone updates simulated escrow hold status (`FR-056`, `FR-057`).
  - Milestone acceptance triggers simulated disbursement record (`FR-058`, `FR-060`).
  - Does **not** implement a real escrow, payment gateway, or financial transaction.
  - Does **not** assume a 5% commission or any other fee percentage.
  - Does not collect or store sensitive payment credentials per `FR-061`.
- **Applicable Skills**: `building-components`, `web-design-guidelines`.
- **Acceptance Criteria**:
  - References `FR-061` (data compliance) and `FR-062` (reporting) in payment tasks.
  - Payment screens display agreed milestone amount and list platform fees as "Chưa xác định" without calculating net payout.
  - Displays disclaimer: "Mức phí dịch vụ nền tảng đang trong giai đoạn khảo sát chính sách."
  - All payment screens clearly labeled as simulations (`MÔ PHỎNG`) without real gateway integration or assumed 5% commission.
- **Verification Method**: `npm.cmd run typecheck`, `npm.cmd run lint`.
- **Effort**: Medium.
- **Dependencies**: `TSK-014`.

---

### Task TSK-016: Implement Post-Project Rating & Testimonials
- **Objective**: Implement 5-star rating and qualitative feedback submission upon project completion per `BR-016`, `FR-040`, `FR-053`, `FR-054`, `FR-055` as an approved P2 prototype.
- **Related Screen IDs**: `REV-001`, `REV-002`.
- **Relevant Requirements**: `FR-040`, `FR-041`, `FR-042`, `FR-053`, `FR-054`, `FR-055`, `BR-016`, `DEC-08`.
- **Main Flows**: `FLOW-17`.
- **User Roles**: Business, Freelancer, Public.
- **Files to Create**:
  - `src/features/reviews/components/SubmitReviewDialog.tsx` (`REV-001` — Governed by `BR-016`, `FR-054`)
  - `src/features/reviews/components/PublicReviewCard.tsx` (`REV-002` — Governed by `FR-055`)
- **Files to Modify**:
  - `src/features/profile/pages/ProfilePage.tsx` (Add verified Testimonials section)
  - `src/features/workspace/components/ProjectCompletedModal.tsx` (`WORK-006` — Trigger review modal on user action)
- **Interactions**:
  - Review modal is triggered by the user after a project has been validly completed (`FR-040`, `FR-053`).
  - Supports 1–5 star ratings and qualitative comments.
  - Allows Business to review the selected Freelancer/Team.
  - Allows Freelancer/Team Representative to review Business as a simulated P2 experience.
  - Requires a valid completed collaboration record (`FR-055`).
  - Does **not** impose a 14-day deadline or any other unapproved deadline (`BR-016`).
  - Review visibility, publication, moderation, and dispute policies remain marked as unresolved for production.
  - Clearly identifies the feature as prototype functionality.
  - Does not generate fabricated reviews unrelated to valid demo projects.
- **Applicable Skills**: `building-components`, `web-design-guidelines`.
- **Acceptance Criteria**:
  - Reviews require a valid completed collaboration record per `FR-055`.
  - Supports two-sided 1–5 star ratings and qualitative comments.
  - No unapproved review deadlines are imposed per `BR-016`.
  - Displays clear prototype badge indicating production moderation and publication policies remain unresolved.
- **Verification Method**: `npm.cmd run typecheck`, `npm.cmd run lint`.
- **Effort**: Low.
- **Dependencies**: `TSK-014`.

---

## Phase 4: Supporting & Exceptional UI — Settings, Administration & Polish

### Task TSK-017: Implement Account Settings & Privacy Preferences
- **Objective**: Build Account Settings with profile privacy controls and optional email preferences per `FR-003`, `FR-064`, `NFR-05`.
- **Related Screen IDs**: `SET-001`, `SET-002`, `NOTIF-003`.
- **Relevant Requirements**: `FR-003`, `FR-064`, `NFR-05`, `DEC-07`.
- **Main Flows**: `FLOW-01`, `FLOW-18`.
- **User Roles**: Business, Freelancer.
- **Files to Create**:
  - `src/features/settings/pages/AccountSettingsPage.tsx` (`SET-001`)
  - `src/features/settings/components/PrivacySettingsTab.tsx` (`SET-002` — Governed by `NFR-05`, `3.2`)
  - `src/features/settings/components/EmailPreferencesTab.tsx` (`NOTIF-003` — Governed by `FR-064`, `DEC-07`)
- **Files to Modify**: `src/app/router/Routes.tsx` (Add `/settings`).
- **Interactions**:
  - Update display name, contact phone, avatar upload simulation.
  - Toggle profile visibility and contact sharing limits (`NFR-05`).
  - Toggle optional email notification preferences (`FR-064`).
- **Applicable Skills**: `building-components`, `web-design-guidelines`.
- **Acceptance Criteria**:
  - Settings correctly cite `NFR-05` and `FR-064` (removes misattributed `BR-027`).
  - Preferences persist cleanly in mock storage.
- **Verification Method**: `npm.cmd run typecheck`, `npm.cmd run lint`.
- **Effort**: Medium.
- **Dependencies**: `TSK-001`.

---

### Task TSK-018: Implement Admin Account Directory & Moderation Queue Mockup
- **Objective**: Build admin user directory and moderation queue views for P2 administrative prototype coverage per `FR-043`, `FR-044`, `FR-062`.
- **Related Screen IDs**: `ADMIN-001`, `ADMIN-002`, `ADMIN-003`, `ADMIN-004`.
- **Relevant Requirements**: `FR-043`, `FR-044`, `FR-062`, `DEC-10`.
- **Main Flows**: `FLOW-19`.
- **User Roles**: Admin.
- **Files to Create**:
  - `src/features/admin/pages/AdminAccountsPage.tsx` (`ADMIN-001` — Governed by `FR-043`, `FR-062`)
  - `src/features/admin/components/AccountModerationModal.tsx` (`ADMIN-002` — Governed by `FR-043`)
  - `src/features/admin/pages/ModerationQueuePage.tsx` (`ADMIN-003` — Governed by `FR-044`)
  - `src/features/admin/components/ModerationCaseInspector.tsx` (`ADMIN-004` — Governed by `FR-044`)
- **Files to Modify**: `src/app/router/Routes.tsx` (Add `/admin/*` guarded by admin role).
- **Interactions**:
  - Filter accounts by role and status; inspect suspension actions.
  - Review flagged project briefs and portfolio items with mock resolution actions.
- **Applicable Skills**: `building-components`, `web-design-guidelines`.
- **Acceptance Criteria**:
  - Correctly cites `FR-043`, `FR-044`, `FR-062` (removes misattributed `BR-028`).
  - Admin screens are protected by `RoleGuard` and inaccessible to non-admin roles.
- **Verification Method**: `npm.cmd run typecheck`, `npm.cmd run lint`.
- **Effort**: Medium.
- **Dependencies**: `TSK-002`.

---

### Task TSK-019: Full UI Coverage & End-to-End Cross-Role Validation
- **Objective**: Conduct full 74-screen validation across desktop, tablet, and mobile, verify keyboard accessibility, and ensure all quality gates pass.
- **Related Screen IDs**: All 74 Screen IDs (`PUB-001` through `ADMIN-004`).
- **Relevant Requirements**: All FRs, BRs, NFRs (`NFR-01` to `NFR-10`).
- **Main Flows**: `FLOW-01` through `FLOW-20`.
- **User Roles**: Guest, Business, Freelancer, Admin.
- **Activities**:
  1. Walk through the complete fictional SME Brand Identity story per Section 15 of UI Scope:
     Brief creation -> Matching -> Invite (7-day expiry) -> Application -> Review -> Approve (`BUS-013`) -> Gated Chat (`PROJ-001`) -> Propose Agreement -> Confirm (3-day expiry, preserves active version) -> Selection Closed (`Đã đóng tuyển`) -> Workspace -> Deliverable -> Revision -> Accept -> Payment Simulation -> Review.
  2. Validate all exception screens: `SHARED-001` (403), `SHARED-002` (404), `SHARED-003` (Error/Retry), `PROJ-002` (Locked chat), `PROJ-007` (Superseded agreement), `FL-013` (Not selected banner).
  3. Verify responsive layout, focus visible rings, and keyboard tab navigation.
  4. Run automated checks:
     - `npm.cmd run typecheck`
     - `npm.cmd run lint`
     - `npm.cmd run build`
- **Applicable Skills**: `web-design-guidelines`, `vercel-react-best-practices`.
- **Acceptance Criteria**:
  - 100% of the 74 documented screens render without errors.
  - Continuous journey executes smoothly across roles.
  - Zero TypeScript or lint errors; production build succeeds.
- **Verification Method**: `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run build`.
- **Effort**: High.
- **Dependencies**: All prior tasks (`TSK-001` to `TSK-018`).
