# FREVO Frontend — Existing Codebase & Architecture Audit

**Author:** Senior Specialist Engineering Team (Product Manager, Business Analyst, UI/UX Designer, Frontend Architect, React/TypeScript Engineer, Code Reviewer, AI Workflow Engineer)  
**Date:** October 2026  
**Status:** Technical Audit Report (Baseline Analysis)  
**Target Repository:** `D:\FPT\Semester7\Exe\FREVO-frontend`  
**Reference Documents:** `AGENTS.md`, `docs/FREVO_SRS_Final.md`, `docs/FREVO_Main_Flow_Full_Product_UI_Scope_v1_FINAL_SCREEN_SPECS.md`, `REACT_STRUCTURE_GUIDE.md`

---

## 1. Executive Summary

This audit evaluates the current state of the FREVO frontend codebase against the authoritative Software Requirements Specification (SRS) and the Full Product UI Scope. The repository currently functions as a partial frontend prototype with 46 source files across three architectural layers (`src/app/`, `src/features/`, `src/lib/`).

### Key Findings
1. **Strong Functional Verticals in Isolation**: Core freelancer discovery (`FreelancerHomePage.tsx`), detailed profile/portfolio editing (`ProfilePage.tsx`, `PortfolioEditor.tsx`), and a consolidated business prototype (`BusinessPrototype.tsx`) exist and render cleanly with zero compile or lint errors (`npm.cmd run typecheck`, `npm.cmd run lint`, and `npm.cmd run build` all pass).
2. **Two-Sided Marketplace Disconnection**: The Business domain (`BusinessPrototype.tsx`) and Freelancer domain (`FreelancerHomePage.tsx`) use completely separate, isolated mock state mechanisms. Projects created by Business in `sessionStorage` do not appear in Freelancer Discovery (which reads from `public/data/projects.json`), and applications submitted by Freelancers do not appear in Business candidate lists.
3. **Critical Business Rule Invariants & Gating**:
   - **Gated Chat Gating Violated**: In `BusinessPrototype.tsx`, as soon as a Freelancer applies or accepts an invitation, chat is immediately accessible. This directly violates SRS rules `BR-012`, `BR-013`, and `FR-031`, which mandate that Business must explicitly review and approve a candidate (`BUS-013`) before an in-app chat channel can be opened.
   - **Recruitment & Negotiation Timelines**: `BusinessPrototype.tsx` hardcodes invitation expiry to 7 days. This behavior conforms to SRS `FR-019` and `BR-024` (invitations expire after 7 days) and is **not** a defect. However, cooperation agreement proposals must enforce a 3-day decision window per `FR-032` and `BR-024`, and `BR-005` defines candidate status creation upon invitation acceptance (`Chờ Business xem xét`), not expiration.
4. **Architectural Monolith in Business Feature**: While `src/features/projects/` and `src/features/profile/` follow the Feature-Based Clean Architecture by decomposing pages, dialogs, cards, and custom hooks, `src/features/business/BusinessPrototype.tsx` is an all-in-one 345-line, 74KB file bundling 24 distinct sub-components and 157 custom `.fb-*` CSS classes (`features/business/business.css`) that bypass the centralized Material UI theme tokens.
5. **Auth Navigation Dead-Ends**: `LoginPage.tsx`, `RegisterPage.tsx`, and `ForgotPasswordPage.tsx` contain client-side validation but produce static alert notices ("Bản giao diện mẫu chưa kết nối...") without establishing session state or routing the user into their respective role workspaces.
6. **Independent Landing Page Architecture**: The root route `/` currently renders the authenticated `FreelancerHomePage`. The public marketing landing page (`PUB-001`) exists in an independent Next.js 16 application (`FREVO_Landing_Page/cm-website`). Per product decision, it will remain independent and integrated via configurable URLs and navigation links, while the Marketplace SPA hosts Guest Project Discovery (`PUB-002`) and Public Project Detail (`PUB-003`).

---

## 2. Skill Discovery & Utilization Report

Before and during this audit, available skills were discovered and evaluated across the environment and repository (`.agents/skills/`):

| Skill Name | Source / Location | Primary Capability | Applied Activity in Audit & Plan | Status |
| :--- | :--- | :--- | :--- | :--- |
| `building-components` | `.agents/skills/building-components/SKILL.md` | Accessible, composable UI component patterns, ARIA, focus, design tokens | Auditing dialogs, card composition, accessibility, and form state | **Used during audit & planning** |
| `web-design-guidelines` | `.agents/skills/web-design-guidelines/SKILL.md` | Web interface guidelines, visual hierarchy, spacing, typography, mobile UX | Evaluating UI/UX consistency, button styling, layout grids, and mobile breakpoints | **Used during audit & planning** |
| `vercel-react-best-practices` | `.agents/skills/vercel-react-best-practices/SKILL.md` | React 19 performance, rerender optimization, state derivation, bundle size | Evaluating hook design, state ownership, and modularization of `BusinessPrototype` | **Used during audit & planning** |
| `vercel-composition-patterns` | `.agents/skills/vercel-composition-patterns/SKILL.md` | Component composition vs prop drilling, compound components | Planning decomposition of monoliths and shared marketplace widgets | **Used during audit & planning** |
| `before-and-after` | `.agents/skills/before-and-after/SKILL.md` | Visual diffs, before-and-after UI progression | Structuring walkthroughs and comparative task breakdowns | **Used during planning** |
| `agent-browser` | `.agents/skills/agent-browser/SKILL.md` | Browser automation CLI via CDP, DOM inspection | Checked for visual automation; CLI binary not installed globally on PATH | **Unavailable** (Static analysis used) |
| `find-skills` | `.agents/skills/find-skills/SKILL.md` | Discovery utility for installed agent capabilities | Discovered repository-level skills | **Used during audit** |
| `ucp` | `.agents/skills/ucp/SKILL.md` | User context protocols | Context validation | **Not applicable** to UI prototype |
| `vercel-optimize` | `.agents/skills/vercel-optimize/SKILL.md` | Next.js / Vercel deployment bundle optimization | Analyzed Vite bundle chunks | **Recommended for future release** |
| `vercel-react-view-transitions`| `.agents/skills/vercel-react-view-transitions/` | View transition animations | Page navigation transitions | **Recommended for future release** |

---

## 3. Repository Architecture Findings

The codebase conforms to the high-level 3-layer architecture defined in `REACT_STRUCTURE_GUIDE.md`:

```text
FREVO-frontend/
├── docs/
│   ├── FREVO_SRS_Final.md                                           # Authoritative SRS
│   └── FREVO_Main_Flow_Full_Product_UI_Scope_v1_FINAL_SCREEN_SPECS.md # Authoritative UI Scope
├── public/
│   ├── assets/                                                      # Logos, badges, and icons
│   └── data/
│       └── projects.json                                            # Freelancer discovery mock dataset
├── src/
│   ├── app/                                                         # Shell & Core Infrastructure
│   │   ├── layout/App.tsx                                           # Root Layout with ThemeProvider & ScrollRestoration
│   │   ├── router/Routes.tsx                                        # Centralized React Router configuration
│   │   └── theme/theme.ts                                           # MUI Theme (Primary: #f4490b, Text: #20201f)
│   ├── features/                                                    # Business Domain Slices
│   │   ├── auth/pages/                                              # LoginPage, RegisterPage, ForgotPasswordPage
│   │   ├── business/                                                # BusinessPrototype.tsx, business-data.ts, business.css
│   │   ├── errors/                                                  # NotFound.tsx
│   │   ├── freelancer/                                              # FreelancerHomePage, Nav, Header, Bell, Layout
│   │   ├── profile/                                                 # ProfilePage, PortfolioDetailPage, Editor, Cover
│   │   └── projects/                                                # Dashboard, Details, Application Dialog
│   ├── lib/                                                         # Shared Core Utilities
│   │   ├── api/                                                     # Axios agent (agent.ts), projectsApi.ts
│   │   ├── context/                                                 # PortfolioContext, PortfolioProvider
│   │   ├── hooks/                                                   # useProjects, usePortfolio
│   │   ├── types/                                                   # project.types.ts, portfolio.types.ts
│   │   └── util/                                                    # formatters.ts
│   ├── index.css                                                    # Global styles, Tailwind imports, CSS variables
│   └── main.tsx                                                     # Entry point mounting RouterProvider
├── AGENTS.md                                                        # Authoritative Agent Development Workflow
├── package.json                                                     # Dependencies & Scripts
└── REACT_STRUCTURE_GUIDE.md                                         # Architecture Guidelines
```

### Architectural Conformity & Violations
- **App Shell**: Well-structured. `App.tsx` wraps the app in `<ThemeProvider theme={theme}>`, `<CssBaseline />`, `<PortfolioProvider>`, and `<ScrollRestoration />`.
- **Router Layer**: Centralized in `Routes.tsx`. Uses React Router v8 (`createBrowserRouter`). However, internal sub-routes of `/business/*` are managed imperatively inside `BusinessPrototype.tsx` using `location.pathname.split("/")` rather than nested route declarations.
- **Feature Encapsulation**:
  - `features/projects/` and `features/profile/` cleanly separate pages, components, dialogs, and hooks.
  - `features/business/` violates component modularity by bundling 24 separate screens/views into a single 345-line, 74KB file.
- **Styling Discipline**:
  - Global CSS tokens in `src/index.css` define `--orange: #f4490b`, `--ink: #20201f`, `--bg: #f7f8f6`, `--line: #e4e6e2`.
  - `src/app/theme/theme.ts` establishes Material UI palette and typography (`Archivo`, `Space Grotesk`).
  - `src/features/business/business.css` introduces an independent `.fb-*` styling system that duplicates theme tokens and uses raw CSS classes instead of MUI components (`sx` prop or `@emotion/styled`).

---

## 4. Existing Route Inventory

The following table documents all routes declared in [`src/app/router/Routes.tsx`](file:///D:/FPT/Semester7/Exe/FREVO-frontend/src/app/router/Routes.tsx) and sub-paths routed imperatively inside `BusinessPrototype.tsx`:

| Route Path | Component / View | Feature | Parent Layout | Role | Screen ID | Implementation Status | Reachable via Nav? | Notes / Deficiencies |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/` | `FreelancerHomePage` | `freelancer` | `FreelancerLayout` | Freelancer | `FL-006` / `FL-001` | Partial | Yes (Default root) | Renders project discovery directly. Marketplace root `/` will host Guest Discovery (`PUB-002`) & Public Detail (`PUB-003`) linking to external Next.js Landing Page (`PUB-001`). |
| `/projects/:projectId` | `FreelancerHomePage` | `freelancer` | `FreelancerLayout` | Freelancer | `FL-006` / `FL-007` | Partial | Yes (Project list click) | Split view with project details on desktop. |
| `/projects/:projectId/details` | `ProjectDetailPage` | `projects` | `FreelancerLayout` | Freelancer | `FL-007` | Complete | Yes ("Xem chi tiết" CTA) | Full page project details with application CTA. |
| `/login` | `LoginPage` | `auth` | `App` | Guest | `AUTH-002` | Partial | Yes | Form validates email/password, but submit displays mock notice without login/redirect. |
| `/register` | `RegisterPage` | `auth` | `App` | Guest | `AUTH-001` | Partial | Yes | Role selector (Client/Freelancer), validates fields, but submit displays mock notice without redirect. |
| `/forgot-password` | `ForgotPasswordPage` | `auth` | `App` | Guest | `AUTH-003` | Partial | Yes | Validates email, displays mock notice; no redirect. |
| `/business` | `BusinessPrototype` (`Dashboard`) | `business` | Independent Shell | Business | `BUS-001` | Partial | Yes (Direct URL / header) | Imperatively handled inside `BusinessPrototype.tsx`. |
| `/business/projects` | `BusinessPrototype` (`ProjectsPage`) | `business` | Independent Shell | Business | `BUS-002` | Partial | Yes (Sidebar nav) | Lists business projects (Draft, Published, Ongoing, Closed). |
| `/business/projects/new` | `BusinessPrototype` (`BriefForm`) | `business` | Independent Shell | Business | `BUS-003` / `BUS-004` | Partial | Yes ("Tạo dự án mới" CTA) | Multi-field brief creation and editing. |
| `/business/projects/:id` | `BusinessPrototype` (`ProjectBrief`) | `business` | Independent Shell | Business | `BUS-005` | Partial | Yes (Project row click) | Displays structured brief and actions (Publish, Close). |
| `/business/projects/:id/applicants` | `BusinessPrototype` (`ApplicantsPage`) | `business` | Independent Shell | Business | `BUS-011` / `BUS-012` | Inconsistent | Yes (Project tab) | Candidate inbox; missing explicit `BUS-013` approval step before chat. |
| `/business/projects/:id/suggestions` | `BusinessPrototype` (`SuggestionsPage`) | `business` | Independent Shell | Business | `BUS-007` / `BUS-014` | Partial | Yes (Project tab) | Matching recommendations with invite action (`BUS-009`). |
| `/business/projects/:id/invitations` | `BusinessPrototype` (`InvitationsPage`) | `business` | Independent Shell | Business | `BUS-010` | Partial | Yes (Project tab) | Displays 7-day expiration (compliant with `FR-019` & `BR-024`). Needs decomposition from monolith and reactive candidate tracking. |
| `/business/projects/:id/messages` | `BusinessPrototype` (`MessagesPage`) | `business` | Independent Shell | Business | `PROJ-001` | Inconsistent | Yes (Project tab) | Business messaging; chat opens without approval check. |
| `/business/projects/:id/propose` | `BusinessPrototype` (`AgreementPage`) | `business` | Independent Shell | Business | `PROJ-003` | Partial | Yes ("Đề xuất thỏa thuận") | Form to draft milestone scope, budget, deadline. |
| `/business/projects/:id/agreement` | `BusinessPrototype` (`AgreementPage`) | `business` | Independent Shell | Business | `PROJ-004` / `PROJ-006` | Partial | Yes (Project tab) | Agreement confirmation; selecting one candidate closes recruitment. |
| `/business/projects/:id/progress` | `BusinessPrototype` (`ProgressPage`) | `business` | Independent Shell | Business | `WORK-001` / `WORK-002` | Partial | Yes (Ongoing project tab) | Milestone progress simulation. |
| `/business/projects/:id/executor` | `BusinessPrototype` (`ExecutorPage`) | `business` | Independent Shell | Business | `WORK-001` | Partial | Yes (Ongoing project tab) | Displays confirmed talent profile. |
| `/business/talent/:id` | `BusinessPrototype` (`TalentProfile`) | `business` | Independent Shell | Business | `BUS-008` | Partial | Yes (Talent card click) | Displays candidate competence, evidence, portfolio preview. |
| `/business/notifications` | `BusinessPrototype` (`NotificationsPage`) | `business` | Independent Shell | Business | `NOTIF-001` | Partial | Yes (Bell icon click) | In-app notification center for business notices. |
| `/business/profile` | `BusinessPrototype` (`BusinessProfilePage`) | `business` | Independent Shell | Business | `BUS-001` (subview) | Partial | Yes (Header avatar click) | Basic company name & project counter. |
| `/business/settings` | `BusinessPrototype` (`SettingsPage`) | `business` | Independent Shell | Business | `SET-001` | Partial | Yes (Sidebar nav) | Single company name edit input. |
| `/profile` | `ProfilePage` | `profile` | `App` | Freelancer | `FL-002` / `FL-003` | Partial | Yes (FreelancerHeader) | Comprehensive personal profile implemented; portfolio management (FL-003) lacks contribution attribution tags (`BR-027`). |
| `/profile/portfolio/:workId` | `PortfolioDetailPage` | `profile` | `App` | Freelancer | `FL-004` | Partial | Yes (Portfolio card click) | Rich portfolio case study viewer implemented; editor lacks configurable client media validation (`NFR-10`, `DEC-02`) and team attribution. |
| `/not-found` | `NotFound` | `errors` | `App` | All | `SHARED-002` | Complete | Yes (Catch-all redirect) | 404 page with return link. |
| `*` | `Navigate` to `/not-found` | `errors` | `App` | All | `SHARED-002` | Complete | Yes (Fallback) | Catch-all route. |

---

## 5. Existing Screen Inventory & Evaluation

Each existing screen has been analyzed against the authoritative specifications:

### 5.1 Authentication Screens
- **`LoginPage.tsx` (Route `/login` | `AUTH-002`)**:
  - *UI Components*: Split 2-column layout (Brand hero banner + Form panel), Material UI `TextField`, `Checkbox`, `Button`.
  - *Functional Interactions*: Client-side email format and required password validation with DOM ref focusing.
  - *Deficiencies*: Does not mutate session state or redirect to dashboard upon successful submission. Displays a dead-end message.
  - *Status*: **Partially implemented**.
- **`RegisterPage.tsx` (Route `/register` | `AUTH-001`)**:
  - *UI Components*: Role toggle (`client` vs `freelancer`), Company Name conditional field (`FR-001`), Material UI inputs, password confirmation, terms checkbox.
  - *Functional Interactions*: Thorough validation covering required fields, email regex, password minimum 8 characters, password matching.
  - *Deficiencies*: Does not create account session or redirect. Displays static notice.
  - *Status*: **Partially implemented**.
- **`ForgotPasswordPage.tsx` (Route `/forgot-password` | `AUTH-003`)**:
  - *UI Components*: Email entry form, return to login link, branded side banner.
  - *Functional Interactions*: Email validation.
  - *Deficiencies*: Displays static simulation message; no simulated token or reset flow.
  - *Status*: **Partially implemented**.

### 5.2 Freelancer Discovery & Application Screens
- **`FreelancerHomePage.tsx` (Route `/` & `/projects/:projectId` | `FL-006`, `FL-001`)**:
  - *UI Components*: 3-column desktop layout (`FreelancerNav` [248px], `ProjectList` [1fr], `ProjectDetail` [420px]).
  - *Functional Interactions*: Category filtering (Branding, Web, Video, Illustration, Content), minimum budget slider, remote-only checkbox, search query filtering, sorting (Newest, Budget high/low, Deadline), bookmark toggle, project selection.
  - *Application Trigger*: Opens `ProjectApplyDialog.tsx` for unapplied projects.
  - *Deficiencies*: Hardcoded project dataset in `public/data/projects.json`. No live connection with Business project creations.
  - *Status*: **Complete for discovery view; Partial for full FL-001 dashboard**.
- **`ProjectDetailPage.tsx` (Route `/projects/:projectId/details` | `FL-007`)**:
  - *UI Components*: Responsive detail view with `ProjectDetailBody` (overview, deliverables, required skills, timeline) and `ProjectDetailSidebar` (budget card, business profile, bookmark button, apply CTA).
  - *Functional Interactions*: Opens `ProjectApplyDialog`, toggles bookmarks, navigates back to list.
  - *Status*: **Complete**.
- **`ProjectApplyDialog.tsx` (Triggered from `FL-006` / `FL-007` | `FL-008`)**:
  - *UI Components*: Material UI `Dialog`, identity confirmation, proposal cover letter `TextField`, portfolio sample link/selector.
  - *Functional Interactions*: Character length validation, submission simulation with toast confirmation.
  - *Deficiencies*: Updates local `applied` state in `useProjects`, but does not push the candidate record into the Business candidate inbox.
  - *Status*: **Complete for local interaction; Partial for cross-marketplace integration**.

### 5.3 Freelancer Profile & Portfolio Screens
- **`ProfilePage.tsx` (Route `/profile` | `FL-002`, `FL-003`)**:
  - *UI Components*: Header banner, avatar, contact details, bio, hourly rate, availability status, skills chips, portfolio grid (`PortfolioCover`), social links, `EditProfileDialog`.
  - *Functional Interactions*: Edit profile dialog allows modifying title, bio, location, rate, skills, and links; persists via `PortfolioContext`.
  - *Status*: **Complete for personal profile UI (FL-002); Partial for portfolio management (FL-003)** (grid works, but lacks individual/team contribution attribution tags per `BR-027` and responsive empty/error states).
- **`PortfolioDetailPage.tsx` & `PortfolioEditor.tsx` (Route `/profile/portfolio/:workId` | `FL-004`)**:
  - *UI Components*: Full case-study presentation with hero image, challenge/solution copy, role/client metadata, deliverable image galleries, and inline `PortfolioEditor`.
  - *Functional Interactions*: Inline modal editing of case study content, image re-upload simulation, tags management.
  - *Status*: **Partial** (rich case study viewer and editor are implemented, but lack configurable client-side media validation per `NFR-10` / `DEC-02` and contribution attribution per `BR-027`; to be extended via `TSK-007A` without rebuilding the existing component).

### 5.4 Business Prototype Screens (`BusinessPrototype.tsx`)
- **`Dashboard` (`/business` | `BUS-001`)**: Displays summary metrics (Active projects, Candidate reviews, Unread messages), quick actions, recent project cards.
- **`ProjectsPage` (`/business/projects` | `BUS-002`)**: Tabbed project list filtering by status (All, Published, In Progress, Agreement, Draft, Closed).
- **`BriefForm` (`/business/projects/new` | `BUS-003`, `BUS-004`)**: Structured multi-step form for project title, category, budget range, deadline, deliverables list, skills required, executor preference (Individual/Team/Both per `BR-001`). Saves as Draft or Publishes immediately.
- **`ProjectBrief` (`/business/projects/:id` | `BUS-005`, `BUS-006`)**: Displays structured brief parameters, status badge, and project closure action.
- **`SuggestionsPage` (`/business/projects/:id/suggestions` | `BUS-007`, `BUS-014`)**: Displays recommended talents matching brief category and skills, match reason tags, and "Gửi lời mời" CTA.
- **`TalentProfile` (`/business/talent/:id` | `BUS-008`)**: Displays candidate profile, skills, verified portfolio items, and invitation trigger.
- **`InvitationsPage` (`/business/projects/:id/invitations` | `BUS-010`)**: Lists sent invitations and pending/accepted status.
- **`ApplicantsPage` (`/business/projects/:id/applicants` | `BUS-011`, `BUS-012`)**: Lists candidate cards with proposal summary and submission source.
- **`MessagesPage` (`/business/projects/:id/messages` | `PROJ-001`)**: Project-linked chat room between Business and talent.
- **`AgreementPage` (`/business/projects/:id/agreement` | `PROJ-003`, `PROJ-004`, `PROJ-006`)**: Proposal formulation and two-sided confirmation simulation.
- **`ProgressPage` & `ExecutorPage` (`/business/projects/:id/progress` | `WORK-001`, `WORK-002`, `WORK-003`)**: Milestone checklist and completion simulation.
- **`NotificationsPage` (`/business/notifications` | `NOTIF-001`)**: Business event notifications log.

---

## 6. UI/UX and Design System Audit

### 6.1 Theme & Token Consistency
- **Primary Color Palette**:
  - Primary Brand Orange: `#f4490b` (Dark hover: `#bd3d14`, Soft Peach: `#fff0e9`). Consistent across `src/app/theme/theme.ts`, `src/index.css`, and `business.css`.
  - Secondary Ink: `#20201f`. Consistent.
  - Neutral Background: `#f7f8f6`. Consistent.
  - Border Line: `#e4e6e2`. Consistent.
- **Typography**:
  - Headings: `Archivo, Arial, sans-serif` (Weights: 700, 800, 900).
  - Body & Buttons: `Space Grotesk, Arial, sans-serif` (Weights: 400, 500, 600, 700).
  - Both fonts imported via Google Fonts in `src/index.css`.
- **Border Radius**:
  - Global card/container radius: `13px` (`shape.borderRadius: 13`).
  - Button radius: `999px` (Pill buttons configured in `theme.ts` overrides).
  - Dialog radius: `16px`.

### 6.2 Identified Design Inconsistencies
1. **Button Style Divergence**:
   - `features/auth/` and `features/profile/` use `<Button variant="contained" color="primary">` which properly adopts the `borderRadius: 999` and `#f4490b` from MUI `theme.ts`.
   - `features/business/BusinessPrototype.tsx` uses custom HTML buttons with classes `.fb-button.fb-button-primary` and `.fb-button.fb-button-ghost` styled in `business.css`.
   - `features/projects/dashboard/ProjectFilters.tsx` and `ProjectCard.tsx` mix MUI `Chip`, `Button`, and custom raw CSS buttons.
2. **Layout & Shell Inconsistency**:
   - Freelancer views render inside `FreelancerLayout.tsx` using `FreelancerHeader.tsx` (top bar with `.site-header`, height 76px).
   - Business views render their own internal `.fb-sidebar` (220px fixed dark sidebar) and `.fb-topbar` (header with company avatar).
   - A unified application shell that switches navigation context dynamically between Guest, Business, and Freelancer does not exist.
3. **Modal & Dialog Patterns**:
   - `ProjectApplyDialog.tsx` and `EditProfileDialog.tsx` use Material UI `<Dialog>` with standard transitions, accessibility, and focus trapping.
   - Modals in `BusinessPrototype.tsx` (such as talent previews) are rendered as simple inline conditional divs (`.fb-modal`) without proper ARIA dialog attributes or focus traps.
4. **Notification Bell Inconsistency**:
   - `NotificationsBell.tsx` in `FreelancerHeader.tsx` renders a static popover with 3 hardcoded notification items and no navigation links.
   - `BusinessPrototype.tsx` maintains dynamic notices in `state.notices` rendered on `/business/notifications`.
   - The two systems do not share a common notification data model or notification center.

---

## 7. Code Quality & Technical Health

Automated checks were executed directly on the workspace:

| Check | Tool / Command | Result | Findings |
| :--- | :--- | :--- | :--- |
| **Type Check** | `npm.cmd run typecheck` (`tsc -b --pretty false`) | **PASS** (Exit code 0) | Zero TypeScript compiler errors. Proper typing across existing components. |
| **Linting** | `npm.cmd run lint` (`eslint .`) | **PASS** (Exit code 0) | Zero ESLint warnings or errors under ESLint 9 Flat Config. |
| **Production Build** | `npm.cmd run build` (`tsc -b && vite build`) | **PASS** (Exit code 0) | 13,395 modules transformed into production assets (`dist/`). Notice: `index-o3Fi77NO.js` is 860 kB (exceeds 500 kB chunk warning; code-splitting via dynamic imports recommended). |

### React 19 & Hook Audit
- **Strict Mode Compatibility**: Existing components mount cleanly without double-render side effects.
- **Dependencies**: React 19.2.0 is correctly paired with Emotion 11.14 and MUI 9.5.
- **Hook Rules**: Effects in `useProjects.ts` and `ProfilePage.tsx` cleanly return cleanup functions (`active = false`, timers cleared).
- **Monolith Risk**: `BusinessPrototype.tsx` (74KB, 345 lines) manages multiple disparate concerns (briefs, invitations, candidates, chat, agreements, milestones) in a single component state, leading to unnecessary re-renders across unaffected tabs.

---

## 8. Summary of Critical Codebase Deficiencies

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ CRITICAL CODEBASE DEFICIENCIES TO RESOLVE IN IMPLEMENTATION                            │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 1. GATED CHAT BYPASS: BusinessPrototype allows chat immediately without candidate     │
│    approval (BUS-013), violating SRS BR-012, BR-013, FR-031.                           │
│ 2. AGREEMENT TIMERS & CANDIDATE STATUS: While 7-day invitations match FR-019/BR-024,   │
│    agreement proposals lack 3-day expiry (FR-032/BR-024) and BR-005 candidate status.  │
│ 3. STATE DISCONNECTION: Business briefs/invitations and Freelancer discovery/proposals │
│    live in separate silos; requires approved modular mock-state architecture.          │
│ 4. AUTH DEAD-ENDS: Login and Register submit handlers display alert text without      │
│    establishing user role or navigating to dashboards.                                 │
│ 5. BUSINESS MONOLITH: BusinessPrototype.tsx bundles 24 components and 157 custom      │
│    CSS classes into one file instead of clean feature modules.                         │
│ 6. MISSING 43 SCREENS: Out of 74 documented screens, 43 have no implementation.        │
│ 7. INDEPENDENT LANDING INTEGRATION: Root / goes directly to Freelancer discovery;      │
│    needs guest discovery (PUB-002/003) & navigation links to external Next.js PUB-001. │
└────────────────────────────────────────────────────────────────────────────────────────┘
```
