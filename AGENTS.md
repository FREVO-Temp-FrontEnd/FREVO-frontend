# FREVO Frontend — AI Agent Instructions & Development Workflow

This document governs all AI-assisted engineering for the FREVO frontend repository. Every AI coding agent (including Antigravity) must strictly follow these instructions to ensure consistency, requirements traceability, and architectural integrity.

---

## 1. Project Context & Technology Stack

### 1.1 Product Overview
**FREVO (Where Freelancers Evolve)** is a two-sided freelance marketplace platform connecting small businesses (SMEs) in Vietnam with creative freelancers (individual or teams).
- **Core User Roles**:
  - `Guest`: Public landing page visitor, project exploration (read-only), sign-up/login.
  - `Business`: Publishes Project Briefs, discovers and receives recommendations for candidates, reviews applications, sends invitations, approves candidates for chat, negotiates agreements, and selects one executor per project.
  - `Freelancer`: Manages creative portfolio/CV, discovers projects, submits applications, responds to invitations, communicates via chat, and confirms/declines agreements. Can act as an **Individual** or as a **Team Representative (Leader)**.
  - `Admin` [P2 / Post-MVP]: User management and content moderation (UI only).
- **Release Objective**: A high-fidelity, interactive **React UI Prototype** validating user flows, role permissions, matching transparency, recruitment gating, and agreement confirmation before backend/smart-contract integration.

### 1.2 Technology Stack
The project is a client-side Single Page Application (SPA) built with:
- **Core**: React 19.2.0, TypeScript 5.9.0, Vite 7.0.0 (`@vitejs/plugin-react` 5.0.0). *Not Next.js — no SSR, Server Components, or App Router.*
- **Routing**: `react-router` 8.4.0 using `createBrowserRouter`, layout routes, dynamic params (`:projectId`, `:workId`), `ScrollRestoration`, and `Outlet`.
- **UI & Design System**:
  - Primary: **Material UI (MUI)** `@mui/material` 9.5.0, `@mui/icons-material` 9.5.0, `@emotion/react` 11.14.0, `@emotion/styled` 11.14.1.
  - Theme Tokens: `src/app/theme/theme.ts` (Primary: `#f4490b`, Secondary: `#20201f`, Background: `#f7f8f6`, Typography: `Space Grotesk` & `Archivo`).
  - Icons: `lucide-react` 0.468.0 and `@mui/icons-material`.
  - Utility Styling: Tailwind CSS v4 (`@tailwindcss/vite` 4.0.0, `clsx`, `tailwind-merge`, `class-variance-authority`). Tailwind is strictly supplementary to MUI.
- **State & Data Layer**:
  - HTTP Client: Axios 1.12.0 with centralized client in `src/lib/api/agent.ts` (`isDemoMode` detection).
  - API Modules: `src/lib/api/<feature>Api.ts` (e.g. `projectsApi.ts`).
  - State: React Context API (`src/lib/context/`) and domain Custom Hooks (`src/lib/hooks/`).
  - *No unapproved state management libraries (no Redux, Zustand, TanStack Query, or SWR).*
- **Quality Tooling**:
  - ESLint 9 Flat Config (`eslint.config.mjs`) with `typescript-eslint`, React Hooks, and React Refresh plugins.
  - TypeScript build info and project references (`tsconfig.app.json`, `tsconfig.node.json`).

---

## 2. Documentation Hierarchy & Precedence

All implementation must strictly trace to verified documentation. When requirements overlap or conflict, apply this strict precedence order:

```text
┌────────────────────────────────────────────────────────┐
│ 1. Business Requirements: docs/FREVO_SRS_Final.md      │  (Authoritative for FR, BR, NFR, UC, Roles, Scope)
├────────────────────────────────────────────────────────┤
│ 2. UI Scope: docs/FREVO_Main_Flow_Full_Product_UI...md │  (Authoritative for Screens, Flows, States, Interactions)
├────────────────────────────────────────────────────────┤
│ 3. Architecture Guide: REACT_STRUCTURE_GUIDE.md        │  (Authoritative for Code Structure, Placement, Modules)
├────────────────────────────────────────────────────────┤
│ 4. Existing Source Code: src/                          │  (Authoritative for Existing Reusable Patterns & Tokens)
└────────────────────────────────────────────────────────┘
```

### Precedence Rules:
1. **SRS is Authoritative for Business Logic**: Functional Requirements (`FR-001`–`FR-064`), Business Rules (`BR-001`–`BR-028`), Non-Functional Requirements (`NFR-01`–`NFR-10`), Use Cases (`UC-01`–`UC-09`), roles, permissions, and MVP boundaries govern what the system does.
2. **UI Scope is Authoritative for UI Behavior**: Screen Inventory (`PUB`, `AUTH`, `SET`, `SHARED`, `BUS`, `FL`, `TEAM`, `PROJ`, `WORK`, `PAY`, `REV`, `NOTIF`, `ADMIN`), Main User Flows (`FLOW-01`–`FLOW-20`), component states, interaction matrices, and mock transitions govern how the UI behaves.
3. **Architecture Guide is Authoritative for Code Layout**: Directory structures, component decomposition, custom hooks isolation, and API layering follow `REACT_STRUCTURE_GUIDE.md`.
4. **Source Code Establishes Reusable Patterns**: Established theme tokens, CSS variables, and shared dialogs/cards must be reused before creating new primitives.
5. **Conflict Policy**: If UI Scope contradicts the SRS on a business rule, or if documentation is ambiguous, **never silently pick an interpretation**. Report the conflict with exact IDs and request clarification.

---

## 3. Mandatory Pre-Implementation Workflow

Before generating or modifying code for any marketplace screen or component, the agent must complete this 10-step checklist:

1. **Identify Screen IDs**: Determine the exact Screen IDs involved (e.g. `BUS-003`, `FL-008`, `PROJ-004`).
2. **Read UI Scope Specifications**: Read the full screen specification in Section 6.1 of `docs/FREVO_Main_Flow_Full_Product_UI_Scope_v1_FINAL_SCREEN_SPECS.md`.
3. **Cross-Reference SRS**: Inspect the source requirements in `docs/FREVO_SRS_Final.md` referenced by the screen.
4. **Extract Requirements IDs**: Note all associated `FR-xxx`, `BR-xxx`, `NFR-xxx`, and `UC-xx` identifiers.
5. **Identify User Flows**: Determine which Main Flows (`FLOW-01` through `FLOW-20`) touch this screen.
6. **Inspect Existing Code**: Search `src/features/` and `src/app/shared/components/` for reusable components, dialogs, cards, and styling.
7. **Determine Feature Placement**: Confirm the module that owns the screen according to `REACT_STRUCTURE_GUIDE.md`.
8. **Check Routing & Layout**: Verify route declarations in `src/app/router/Routes.tsx` and parent layouts (`App.tsx`, `FreelancerLayout.tsx`, etc.).
9. **Identify Fixtures / Mock Data**: Define mock entities and session state changes required to support realistic prototype interaction.
10. **Review Open Decisions**: Check Section 13 (`DEC-01` to `DEC-12`) of the UI Scope. If the feature touches an unresolved decision, adhere to the documented provisional behavior and never invent production policies.

*For any non-trivial screen or flow change, present a brief implementation plan citing the Screen and Requirement IDs before writing code.*

---

## 4. Implementation Contract & UI State Guarantees

Every implemented screen must satisfy the following contract:

### 4.1 Mandatory States
Every asynchronous or data-driven component must explicitly handle:
- **Loading State**: Accessible skeleton or progress indicator.
- **Empty State**: Meaningful illustration, explanatory copy, and clear call-to-action (e.g. `BUS-014` when no candidates match).
- **Error State**: Informative error message with retry capability (`SHARED-003`).
- **Success State**: Clear confirmation feedback (toast, dialog, or status banner).
- **Disabled State**: Visual disablement with contextual tooltip when preconditions are not met.
- **Expired / Read-Only State**: Explicit indicators when an invitation or agreement is expired, rejected, or superseded (`PROJ-002`, `PROJ-007`).

### 4.2 Interaction Integrity
- **No Decorative Buttons**: Every button, link, or tab must produce a real state transition, navigation, dialog opening, or clear feedback.
- **Validation**: Forms must enforce client-side validation with localized inline errors before submitting.
- **Role Permissions**: Restrict views and actions based on active role (`Guest`, `Business`, `Freelancer`, `Team Leader`). Unauthorized access must route to `SHARED-001` (403).

---

## 5. React & Clean Architecture Standards

Follow the Feature-Based Clean Architecture documented in `REACT_STRUCTURE_GUIDE.md`:

```text
src/
├── app/                  # Application Shell & Shared Infrastructure
│   ├── layout/           # Root layouts (App.tsx, wrappers)
│   ├── router/           # Centralized routing (Routes.tsx)
│   ├── theme/            # Theme tokens, palette, component overrides (theme.ts)
│   └── shared/           # Reusable multi-feature components (app/shared/components/)
├── features/             # Business Domain Slices
│   ├── auth/             # Authentication & role selection (pages/, components/)
│   ├── freelancer/       # Freelancer dashboard & navigation
│   ├── business/         # Business dashboard, brief management, candidate review
│   ├── projects/         # Project discovery, details, application
│   ├── profile/          # Profiles, portfolio, resume
│   └── errors/           # 404 and system error screens
└── lib/                  # Shared Core Libraries
    ├── api/              # Axios client (agent.ts) and feature API modules
    ├── context/          # React Context providers
    ├── hooks/            # Shared custom hooks (useProjects, usePortfolio)
    ├── types/            # TypeScript domain interfaces and types
    └── util/             # Utility helpers (formatters, text normalization)
```

### 5.1 Architecture Rules
1. **Feature Encapsulation**: Keep feature-specific components, hooks, and types inside `src/features/<feature-name>/`.
2. **Presentation vs. Data Separation**: Components focus strictly on rendering and user interaction. Data fetching, filtering, and local state management belong in custom hooks (`lib/hooks/` or feature-level hooks).
3. **No Direct Axios in UI**: Presentational components must never invoke `axios` directly; use API client modules in `src/lib/api/` wrapped by custom hooks.
4. **No Circular Dependencies**: Feature modules must not import internal components from other feature modules. Shared abstractions belong in `src/app/shared/` or `src/lib/`.
5. **TypeScript Strictness**: Define explicit interfaces for all props, states, and data payloads. Avoid `any`.

---

## 6. MUI & Design System Rules

1. **MUI First**: Always prioritize `@mui/material` components (`Box`, `Typography`, `Button`, `Dialog`, `TextField`, `Card`, `Chip`, `Stack`).
2. **Theme Consistency**: Reuse theme tokens defined in `src/app/theme/theme.ts`:
   - Primary: `#f4490b` (Dark: `#bd3d14`)
   - Secondary / Text: `#20201f`
   - Background: `#f7f8f6`, Paper: `#ffffff`
   - Text Secondary: `#747773`, Divider: `#e4e6e2`
   - Fonts: `Space Grotesk` (body & buttons), `Archivo` (headings `h1`–`h4`)
   - Shape: `borderRadius: 13` (Buttons: pill `borderRadius: 999`)
3. **Styling Precedence**:
   - Primary: MUI `sx` prop with theme tokens or styled components via `@emotion/styled`.
   - Supplementary: Tailwind CSS utilities for layout spacing, flexbox, or grid where appropriate.
   - Do not introduce arbitrary inline styles or conflicting CSS rules that override theme typography/palette.
4. **Shared Component Reuse**: Check for existing shared widgets (`BookmarkButton`, `ProjectCard`, `NotificationsBell`, `EditProfileDialog`) before implementing redundant variants.

---

## 7. Prototype Simulation & Mock Data Integrity

The current FREVO application is a high-fidelity interactive prototype. To ensure fidelity without misrepresenting production readiness:

1. **Realistic Mock Fixtures**: Use coherent, domain-realistic fictional data for projects, briefs, freelancer profiles, portfolios, and proposals.
2. **State Continuity**: Store interactive prototype state in React Context, custom hooks, or `sessionStorage` / `localStorage` so user actions persist across navigation.
3. **Clear Simulation Disclaimers**:
   - **Payment & Escrow** (`PAY-001`–`PAY-005`): Strictly simulated ledger. Display an explicit badge (e.g. `MÔ PHỎNG / SIMULATED`) to confirm no real money or legal escrow is involved.
   - **Agreements** (`PROJ-003`–`PROJ-005`): The cooperation summary records confirmed terms on FREVO; it is **not** an electronically signed legal contract.
   - **AI Matching** (`BUS-007`, `BUS-015`): Matching is rule-based filtering and ranking with explainable criteria (skills, availability, portfolio evidence). Do not claim it is powered by real verified AI.
   - **Email Notifications** (`NOTIF-003`): In-app notifications are primary; email delivery is simulated/optional.

---

## 8. Business-Critical Workflow Rules

When implementing or touching recruitment flows, adhere strictly to these core business invariants:

1. **Project Brief Lifecycle**:
   - Projects transition: `Draft` → `Published` → `Under Review / Agreement` → `Ongoing` → `Closed` (`BUS-003`, `BUS-004`, `BUS-006`).
   - Projects specify executor preference: `Individual`, `Team`, or `Both` (`BR-001`).
2. **Single Candidate Record per Project**:
   - Whether a Freelancer applies directly (`FLOW-06`) or accepts an invitation (`FLOW-07`), only **one candidate record** exists per freelancer account per project (`FR-029`, `BR-011`).
   - Merge sources: Keep both invitation and application history on that single candidate entity.
   - An account cannot switch its applied identity between Individual and Team after submission.
3. **Recruitment Chat Gating**:
   - Accepting an invitation does **not** automatically open chat!
   - Business **must explicitly review and approve** the candidate (`BUS-013`, `FR-031`, `BR-012`) before the chat room (`PROJ-001`) becomes accessible (`BR-013`).
   - If not approved, the chat remains locked with explanatory guidance (`PROJ-002`).
4. **Agreements & Selection Closure**:
   - Business submits a cooperation agreement summary (`PROJ-003`, `FR-032`).
   - Freelancer has 3 days to confirm or decline (`PROJ-004`, `BR-024`).
   - Any modification creates a new proposal version and supersedes the prior version (`PROJ-005`, `FR-048`).
   - **Final Selection**: Once confirmed by both parties, the project selects that single entity (Individual or Team) and transitions to `Ongoing` (`PROJ-006`). All other applicants automatically transition to `Not Selected` (`FR-033`, `BR-023`).
5. **Team Representation**:
   - In MVP, a Team is represented by a single Freelancer leader account (`FR-061`–`FR-063`, `BR-003`, `BR-020`).
   - Granular multi-account team permissions (`TEAM-005`) are strictly post-MVP (P2) and marked out of current scope (`DEC-09`).

---

## 9. Scope Discipline & Release Boundaries

Respect the three-tier prioritization established in the UI Scope:
- **P0 (Core MVP — 49 Screens)**: Public discovery, authentication, profile/portfolio setup, brief authoring, matching suggestions, invitations, applications, candidate inbox, gated chat, agreement confirmation, selection closure, in-app notifications.
- **P1 (Execution Simulation — 13 Screens)**: Workspace overview, milestone progress, deliverable submission, acceptance / revision requests, change proposals (`WORK-001`–`WORK-008`), optional CV upload (`FL-005`), privacy settings (`SET-002`), forgot password (`AUTH-003`).
- **P2 (Post-Selection & Support — 12 Screens)**: Milestone payment simulation (`PAY-001`–`PAY-005`), post-project reviews (`REV-001`–`REV-002`), admin moderation UI (`ADMIN-001`–`ADMIN-004`), team permissions (`TEAM-005`).

*Rule*: All 74 screens belong to full UI coverage. However, P1 and P2 screens must clearly display prototype/simulation status and must not block P0 core MVP delivery.

---

## 10. Existing Code Protection & Blast Radius Control

1. **Inspect Before Touching**: When modifying shared components (`src/app/shared/`, `src/app/theme/`, `src/lib/`), identify all consumers across the codebase first.
2. **Minimal Changes**: Keep edits surgical. Never refactor working features or rewrite unrelated CSS/components during a task.
3. **Preserve Functionality**: Existing routes, authentication flows, and prototype pages must remain functional after every change.
4. **Regression Verification**: Always verify that existing screens render and operate properly following any shared code adjustment.

---

## 11. Handling Unresolved Decisions (Decision Log)

If an unaddressed business policy arises, refer to Section 13 of the UI Scope:
- `DEC-01`: Matching weights and exact thresholds (Provisional: transparent keyword & category fit).
- `DEC-02`: File upload limits and retention policies (Provisional: client-side mock limits).
- `DEC-03`: Milestone acceptance criteria & revision limits (Provisional: simulated revision cycles).
- `DEC-04` & `DEC-05`: Platform fees, escrow provider, refund & dispute adjudication (Provisional: non-functional concept disclaimers; no real monetary transactions).
- `DEC-06`: Post-agreement contract cancellation rules (Provisional: cancellation disabled once confirmed).
- `DEC-07`: Email provider & dispatch events (Provisional: in-app notifications primary).
- `DEC-08`: Review publication eligibility (Provisional: fictional demo ratings).
- `DEC-09`: Granular team member permissions (Provisional: excluded from MVP).
- `DEC-10`: Admin moderation policies (Provisional: visual-only mock queue).
- `DEC-11`: Exact URL route structure (Provisional: follow `src/app/router/Routes.tsx`).
- `DEC-12`: Project cancellation concurrency (Provisional: mock collision alert).

**Strict Mandate**: Never invent financial fee percentages, legally binding contract terms, refund policies, or dispute rulings. If a policy is missing, report the gap and seek confirmation.

---

## 12. Quality Gates & Verification Commands

All changes must pass these automated quality gates from `package.json`:

```bash
# 1. Typecheck (TypeScript compiler check)
npm.cmd run typecheck

# 2. Linting (ESLint 9 flat config)
npm.cmd run lint

# 3. Production Build (Vite bundling check)
npm.cmd run build
```

*Note for Windows environments*: Execute via `npm.cmd` rather than `npm` to avoid PowerShell script execution policy (`.ps1`) restrictions.

---

## 13. Implementation Completion Report

At the conclusion of every development task, the AI agent must provide a structured completion report covering:

1. **Screens Addressed**: Screen IDs and screen titles (e.g. `BUS-003`, `PROJ-004`).
2. **Traceability**: Linked `FR-xxx`, `BR-xxx`, `NFR-xxx`, `UC-xx`, and `FLOW-xx` IDs.
3. **Files Created & Modified**: Complete relative paths of all affected files.
4. **Key Interactions Implemented**: Specific user actions, state changes, and validations added.
5. **Mock / Simulation Boundaries**: Clarification of what is interactive simulation vs. real client logic.
6. **Verification Results**: Outcomes of `npm.cmd run typecheck`, `npm.cmd run lint`, and `npm.cmd run build`.
7. **Known Limitations & Open Questions**: Any remaining gaps or items requiring user decision.
