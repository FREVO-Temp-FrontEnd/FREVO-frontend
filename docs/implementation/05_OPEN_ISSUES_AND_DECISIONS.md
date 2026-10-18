# FREVO Marketplace UI — Open Issues, Bugs & Decision Log

**Author:** Senior Specialist Engineering Team  
**Date:** October 2026  
**Status:** Audit & Decision Register  
**Reference Documents:** `AGENTS.md`, `docs/FREVO_SRS_Final.md`, `docs/FREVO_Main_Flow_Full_Product_UI_Scope_v1_FINAL_SCREEN_SPECS.md`

---

## 1. Existing Codebase Bugs & Requirement Contradictions

During the static analysis and functional audit of the current repository, six concrete issues and contradictions were identified:

### Issue BUG-01: Gated Chat Permitted Without Business Approval (Critical Business Contradiction)
- **Source Requirements**: `BR-012`, `BR-013`, `FR-031`.
- **Affected Screens**: `BUS-011`, `BUS-013`, `PROJ-001`.
- **Observed Behavior**: In `src/features/business/BusinessPrototype.tsx` (lines 95–97, 106), as soon as a Freelancer applies or accepts an invitation, the system notifies *"Hội thoại đã được mở ngay cho dự án"* and sending a message immediately flips the candidate status to `discussing`. No explicit review or approval step is required.
- **Authoritative Requirement**: `BR-012` states: *"Chỉ ứng viên đã được Business duyệt hồ sơ mới được mở kênh trao đổi trong ứng dụng. Lời mời được chấp nhận không đồng nghĩa với việc mở chat tự động."*
- **Impact**: Breaks core recruitment flow gating. Candidates could spam or initiate conversations before the employer reviews qualifications.
- **Recommended Correction**: Introduce `BUS-013` (Approve Candidate Dialog). Candidate records remain in status `new` or `reviewing` with chat disabled until Business explicitly clicks "Duyệt hồ sơ (Mở chat)". Add `PROJ-002` explaining to unapproved candidates that review is pending.
- **Approval Required**: No (Directly follows established SRS rule).

---

### Issue BUG-02: Timeline Verification — Invitation Expiry (7 Days) vs. Agreement Proposal Expiry (3 Days)
- **Source Requirements**: `FR-019`, `FR-032`, `BR-024`, `BR-005`.
- **Affected Screens**: `BUS-009`, `BUS-010`, `FL-010`, `FL-011`, `PROJ-004`, `PROJ-007`.
- **Observed Behavior**: Previous analysis notes had erroneously suggested invitations should expire after 3 days. In `src/features/business/BusinessPrototype.tsx` (lines 87–88), the prototype hardcoded: *"Lời mời hết hạn sau 7 ngày"* and *"Freelancer có 7 ngày để phản hồi"*.
- **Authoritative Requirement**:
  - `FR-019` & `BR-024`: Business invitations have an expiration period of **7 days**. (The existing 7-day display in `BusinessPrototype.tsx` was already compliant).
  - `FR-032` & `BR-024`: Cooperation agreement proposals have an expiration period of **3 days**.
  - `BR-005`: Governs candidate record creation upon invitation acceptance (`Chờ Business xem xét`). Accepting an invitation creates/updates the candidate record in status Under Review and does **not** grant negotiation rights or open chat. `BR-005` does **not** define expiration duration.
- **Impact**: Clarifies exact timeline invariants across recruitment and negotiation flows, preventing artificial deadline errors.
- **Recommended Correction**: Enforce **7-day expiration** on invitations (`BUS-009`, `FL-010`, `FL-011`) per `FR-019`/`BR-024`, and enforce **3-day countdown** on agreement proposals (`PROJ-004`, `PROJ-007`) per `FR-032`/`BR-024`. Correct all `BR-005` references to candidate record status creation upon invitation acceptance.
- **Approval Required**: Approved (Directly follows authoritative SRS rules).

---

### Issue BUG-03: Two-Sided Marketplace State Disconnection
- **Source Requirements**: System Architecture, `REACT_STRUCTURE_GUIDE.md`.
- **Affected Screens**: All Business (`BUS-*`) and Freelancer (`FL-*`) screens.
- **Observed Behavior**: Business projects live in `sessionStorage` (`frevo-business-prototype-v6`), while Freelancer project discovery loads from `public/data/projects.json`. When a Business creates a project brief in `/business/projects/new`, it never appears in Freelancer discovery at `/`. When a Freelancer applies via `ProjectApplyDialog.tsx`, it never appears in the Business applicant list.
- **Impact**: Prevents testing end-to-end marketplace journeys across roles.
- **Recommended Correction**: Implement modular domain hooks (`useProjects`, `useCandidates`, `useAgreements`, `useProjectChat`, `useNotifications`) and `AuthSessionContext` backed by `mockStorage.ts` in `TSK-001` providing reactive cross-role synchronization without god-context re-render storms.
- **Approval Required**: Approved (Architectural prerequisite).

---

### Issue BUG-04: Authentication Pages End in Dead-End Mock Notices
- **Source Requirements**: `FR-001`, `FR-002`, `FR-004`.
- **Affected Screens**: `AUTH-001`, `AUTH-002`, `AUTH-003`.
- **Observed Behavior**: `LoginPage.tsx` (line 50) and `RegisterPage.tsx` (line 56) validate inputs but display static notices (*"Đây là bản giao diện mẫu. Chức năng đăng nhập chưa được kết nối."*) without logging in, mutating session, or navigating to dashboards.
- **Impact**: Users cannot test the application starting from the login or registration screens.
- **Recommended Correction**: Wire submit handlers to set active session role in `AuthSessionContext` and redirect to `/business` or `/projects` based on account type (`TSK-002`).
- **Approval Required**: Approved.

---

### Issue BUG-05: Independent Landing Page Architecture & Cross-Application Integration
- **Source Requirements**: `2.3`, `7.1`, `DEC-11`.
- **Affected Screens**: `PUB-001`, `PUB-002`, `PUB-003`.
- **Observed Behavior**: Route `/` currently renders `FreelancerHomePage.tsx`. The public landing page exists in a separate folder outside the repository at `D:\FPT\Semester7\Exe\FREVO_Landing_Page\cm-website` built with Next.js 16.
- **Authoritative Decision**: The marketing Landing Page (`PUB-001`) and the Marketplace Single Page Application remain two separate frontend applications. `PUB-001` is marked as externally implemented in `cm-website`, pending URL integration and visual verification.
- **Impact**: Eliminates unnecessary duplication and avoids forcing incompatible Next.js libraries into Vite/MUI. Preserves complete screen inventory and traceability.
- **Recommended Correction**: Keep `cm-website` as an independent Next.js application. Plan integration through configurable URLs and navigation links. In the Marketplace application, host Guest Project Discovery (`PUB-002`) and Public Project Detail (`PUB-003`) with header/footer navigation linking to the external landing page. Update `TSK-003` to focus on guest exploration and cross-app navigation without recreating `PUB-001`.
- **Approval Required**: Approved by stakeholder (Decision 1).

---

### Issue BUG-06: Static Inactionable Notifications Bell
- **Source Requirements**: `FR-064`, `BR-022`.
- **Affected Screens**: `NOTIF-002`.
- **Observed Behavior**: `NotificationsBell.tsx` displays 3 hardcoded static items. Clicking an item produces no navigation or event handling.
- **Impact**: Breaks deep-linking to active projects, chat rooms, or agreement proposals.
- **Recommended Correction**: Wire `NotificationsBell` to real events dispatched by `mockStorage.ts` via the `useNotifications` hook with actionable deep links (`TSK-011`).
- **Approval Required**: No.

---

## 2. Analysis of the 12 Open Decisions (UI Scope Section 13)

Section 13 of the UI Scope documents 12 unresolved product decisions. The following analysis defines their status, provisional prototype treatment, and whether stakeholder approval is required:

| Decision ID | Topic | SRS / UI Reference | Core Ambiguity | Affected Screens | Provisional Prototype Treatment | Risk Level | Blocks Prod? | Blocks Proto? | Requires Approval? |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **DEC-01** | Matching weights & thresholds | 1.2, 11.1, BR-026 | Exact mathematical weighting of skills vs budget vs availability undefined | `BUS-007`, `BUS-008`, `BUS-015` | Use transparent rule-based filtering (Category + Skill overlap percentage) with explainable tags | High | No | No | No (Follows SRS 1.2 rule-based guidance) |
| **DEC-02** | File upload limits & retention | 11.2, NFR-10 | Maximum file size, allowed MIME types, and storage duration unfinalized | `FL-004`, `FL-005`, `WORK-004` | Enforce client-side mock validation (Max 25MB for images/PDFs); simulate upload delay | High | Yes | No | **Yes (For production spec)** |
| **DEC-03** | Milestone revision limits & acceptance | 10.2, 10.4, BR-025, BR-014, FR-048 | Revision allowances, round limits, and out-of-scope adjustments undefined in SRS | `WORK-002`–`WORK-007` | **PROTOTYPE APPROVED WITH MUTUAL SCOPE-BASED MODEL**: No platform-wide 2-round cap. Milestones display mutually agreed revision allowance (numeric count or agreed custom arrangement). UI displays used count (e.g. "Đã dùng X/Y lượt"). Business must provide reason for revision (`BR-014`). Allowance exhaustion prompts mutual consultation without automatic fees, auto-rejection, or auto-completion. Out-of-scope work triggers proposed agreement revision (`WORK-007`), preserving currently effective agreement until confirmed per `FR-048`. Labeled as proposed prototype behavior pending formal SRS approval. | High | Yes | No | **Approved for Prototype Only** (Formal SRS policy remains unfinalized) |
| **DEC-04** | Platform fees & payment gateway | 3.13, 11.5 | Service fee percentage, fee payer, gateway provider undefined | `PAY-001`–`PAY-005` | **PROTOTYPE APPROVED WITH ADJUSTMENTS**: Display agreed milestone value; display FREVO platform fees as "Chưa xác định"; do not calculate or display net payout or actual total payable; include mandatory disclaimer *"Mức phí dịch vụ nền tảng đang trong giai đoạn khảo sát chính sách."*; clearly label all payment screens as simulations (`MÔ PHỎNG`); do not implement real escrow/gateway/transactions; do not assume 5% or any fee percentage. | Critical | Yes | No | **Approved for Prototype Only** (Business policy remains unresolved for production) |
| **DEC-05** | Refund & dispute adjudication | 10.5, 11.5 | Arbitration deadlines, evidence requirements, partial refund rules undefined | `PAY-005`, `WORK-005` | Concept card only; no functional refund button that claims legal binding | High | Yes | No | **Yes (Legal/operational requirement)** |
| **DEC-06** | Post-agreement contract cancellation | 11.4 | Penalties and unilateral cancellation policy after agreement confirmed undefined | `BUS-006`, `WORK-001` | Disable project cancellation button once status transitions to `ongoing` | High | Yes | No | **Yes (Legal policy needed)** |
| **DEC-07** | Email provider & dispatch events | FR-064, 11.3 | SMTP provider, email templates, retry policy unfinalized | `NOTIF-003` | In-app notification center is primary; email settings toggle shown as optional mockup | Medium | Yes | No | No (Prototype relies on in-app) |
| **DEC-08** | Review publication & moderation | FR-054, FR-055, BR-016 | Public review dispute rules and mutual review blind submission policy undefined | `REV-001`, `REV-002` | **PROTOTYPE APPROVED AS P2 PROTOTYPE**: Simple review modal triggered by user after project is validly completed (`FR-040`, `FR-053`); supports 1–5 star ratings and qualitative comments; two-sided (Business reviews Freelancer/Team; Freelancer/Team Rep reviews Business); requires valid completed collaboration record (`FR-055`); no 14-day or unapproved deadlines; review visibility, publication, moderation and dispute policies remain unresolved for production; clearly identified as prototype functionality; no fabricated reviews unrelated to valid demo projects. | Medium | Yes | No | **Approved for Prototype Only** (Production review/moderation policy remains unresolved) |
| **DEC-09** | Team member granular permissions | FR-063 | Post-MVP sub-account permissions (who can chat, who can submit deliverables) undefined | `TEAM-005` | Mark `TEAM-005` as explicitly out of scope for current release; render preview card | Low | Yes | No | No (Post-MVP P2) |
| **DEC-10** | Admin moderation policies | FR-043, FR-044 | Content reporting threshold and account ban workflow unfinalized | `ADMIN-001`–`ADMIN-004` | Render visual mock queue with simulated action buttons (Dismiss, Warning, Hide) | Medium | Yes | No | **Yes (Content moderation guidelines)** |
| **DEC-11** | Exact URL route hierarchy | 7.1, FR-001 | Sitemap structure for guest vs authenticated roots | All routes | Follow standard RESTful route hierarchy declared in `Routes.tsx` | Medium | No | No | No (Technical decision) |
| **DEC-12** | Project cancellation concurrency | 11.4, 11.8 | Race condition handling if brief is cancelled while agreement is being confirmed | `BUS-006`, `PROJ-004` | In prototype, show collision error banner if project is closed in another tab | High | Yes | No | No (Prototype mock collision alert) |

---

## 3. Design Inconsistencies & Unification Plan

| Inconsistency | Existing State | Target Design Rule | Affected Files | Resolution Phase |
| :--- | :--- | :--- | :--- | :--- |
| **Button Hierarchy** | Mixed MUI `<Button>`, `.fb-button`, and raw HTML `<button>` | All buttons use MUI `<Button>` or `<IconButton>` adopting pill `borderRadius: 999` and theme palette | `business.css`, `BusinessPrototype.tsx`, `ProjectFilters.tsx` | Phase 0 & Phase 1 |
| **Application Shell** | Two separate shells (`FreelancerHeader` vs `.fb-sidebar` / `.fb-topbar`) | Unify around a shared app shell that switches navigation drawer/header based on active session role | `FreelancerLayout.tsx`, `BusinessLayout.tsx` | Phase 0 |
| **Dialog Accessibility** | `ProjectApplyDialog` uses accessible MUI `<Dialog>`, while Business modals use custom inline `<div>` | All dialogs and popups standardize on Material UI `<Dialog>` with proper focus traps and ARIA labels | `BusinessPrototype.tsx` | Phase 1 |
| **Typography Usage** | Some components use inline fonts or raw heading tags without tracking theme tokens | All headings use `variant="h1"`–`"h4"` (`Archivo`), all body copy uses `Space Grotesk` via MUI `<Typography>` | `business.css`, `index.css` | Phase 0 & Phase 1 |
| **Simulation Labels** | Inconsistent labeling of demo-only features | Standardize on `<SimulationBadge type="payment" | "ai" | "contract" />` | `PAY-*`, `BUS-015`, `WORK-*` | Phase 2 & Phase 3 |

---

## 4. Stakeholder Approvals & Prototype Agreements Register

The following items have received explicit stakeholder decisions for prototype execution:

1. **Independent Landing Page Architecture (`PUB-001`)**:
   - **Decision**: **APPROVED**. Keep the completed FREVO Landing Page as an independent Next.js application (`FREVO_Landing_Page/cm-website`).
   - Do **not** recreate, rewrite, or port `PUB-001` into the React + Vite Marketplace application.
   - Plan integration through configurable URLs and navigation links.
   - Keep Guest Project Discovery (`PUB-002`) and Public Project Detail (`PUB-003`) within the Marketplace where documented.
   - Mark `PUB-001` as externally implemented, pending integration and visual verification.
   - Update `TSK-003` accordingly, focusing on guest discovery and cross-application navigation instead of rebuilding the landing page.
   - Preserve the complete Screen ID inventory and traceability (do not delete `PUB-001` from the UI Scope).
2. **DEC-04 — Platform Fee Representation**:
   - **Decision**: **APPROVED WITH ADJUSTMENTS FOR PROTOTYPE ONLY**.
   - For `PAY-001` through `PAY-005`:
     - Display the agreed milestone value.
     - Display FREVO platform fees as `"Chưa xác định"`.
     - Do not calculate or display a final net payout or actual total payable until fee policy and fee payer have been approved.
     - Use mandatory disclaimer: *"Mức phí dịch vụ nền tảng đang trong giai đoạn khảo sát chính sách."*
     - Clearly label all payment screens as simulations (`MÔ PHỎNG`).
     - Do not implement a real escrow, payment gateway, or financial transaction.
     - Do not assume a 5% commission or any other fee percentage.
     - *Note*: Production fee policies and financial compliance remain uncommitted.
3. **BR-016 / FR-054 — Review Policy**:
   - **Decision**: **APPROVED AS A P2 PROTOTYPE ONLY**.
   - Implement a simple review modal triggered by the user after a project has been validly completed (`FR-040`, `FR-053`).
   - Support 1–5 star ratings and qualitative comments.
   - Allow Business to review the selected Freelancer/Team.
   - Allow Freelancer/Team Representative to review Business as a simulated P2 experience.
   - Require a valid completed collaboration record (`FR-055`).
   - Do not impose a 14-day deadline or any other unapproved deadline.
   - Keep review visibility, publication, moderation and dispute policies marked as unresolved for production.
   - Clearly identify the feature as prototype functionality.
   - Do not generate fabricated reviews unrelated to valid demo projects.
4. **Milestone Revision Policy (`DEC-03`)**:
   - **Decision**: **APPROVED WITH MUTUAL SCOPE-BASED MODEL FOR PROTOTYPE ONLY**.
   - FREVO must not impose a platform-wide fixed maximum of 2 revision rounds.
   - Revision allowances should be agreed upon between Business and Freelancer/Team Representative, based on the scope of each milestone.
   - For the UI prototype:
     - Allow each milestone to display a mutually agreed revision allowance (configurable numeric count or an explicitly agreed custom arrangement).
     - Show how many revision rounds have been used when a numeric allowance exists.
     - Require Business to provide a reason when requesting revisions (`BR-014`).
     - Do not automatically charge fees, reject deliverables, or mark milestones complete when the allowance is exhausted.
     - Instead, show that additional revisions require consultation and agreement between the parties.
     - For work outside the agreed scope, represent a proposed agreement change (`WORK-007`, `PROJ-005`) rather than silently altering the existing agreement.
     - Preserve the currently effective agreement version until a replacement is mutually confirmed, according to `FR-048`.
     - Label any additional revision mechanics not explicitly defined in the SRS as proposed prototype behavior pending formal SRS approval.
