# FREVO Marketplace UI — Full Implementation Strategy & Roadmap (Corrected)

**Author:** Senior Specialist Engineering Team (Product Manager, Business Analyst, UI/UX Designer, Frontend Architect, React/TypeScript Engineer, Technical Reviewer)  
**Date:** October 2026  
**Status:** Architecture Implementation Strategy (Prototype Decisions Approved; Production Policies Unresolved)  
**Reference Documents:** `AGENTS.md`, `docs/FREVO_SRS_Final.md`, `docs/FREVO_Main_Flow_Full_Product_UI_Scope_v1_FINAL_SCREEN_SPECS.md`, `REACT_STRUCTURE_GUIDE.md`

---

## 1. Executive Implementation Strategy

This roadmap defines the implementation strategy for the entire FREVO marketplace UI prototype, delivering all **74 documented screens** across **P0 (49 screens)**, **P1 (13 screens)**, and **P2 (12 screens)**.

### 1.1 Core Strategic Tenets
1. **Strict Fidelity to the SRS**:
   - **Invitation Expiration is 7 Days** (`FR-019`, `BR-024`): Business invitations remain active for 7 days.
   - **Agreement Proposal Expiration is 3 Days** (`FR-032`, `BR-024`): Cooperation agreement proposals remain active for 3 days.
   - **Invitation Acceptance Role (`BR-005`)**: Accepting an invitation creates/updates a candidate record in status `Chờ Business xem xét` (Under Review). It does **not** grant negotiation rights and does **not** open chat.
   - **Gated Chat Authorization (`FR-045`, `FR-046`, `FR-031`, `BR-012`, `BR-013`)**: In-app chat is strictly gated behind an explicit Business candidate approval action (`BUS-013`). (Note: `FR-034`–`FR-036` govern AI Profile Evaluation, not chat).
   - **Agreement Versioning Invariant (`FR-048`)**: When modifying an agreement, the existing confirmed version remains effective until both parties confirm the new proposed version. If the new version is rejected or expires, the old confirmed version continues in force.
   - **Review Policy Prototype (`BR-016`, `FR-054`, `FR-055`, `DEC-08`)**: Approved as a P2 prototype only. Implements a simple review modal triggered by the user after a project has been validly completed (`FR-040`, `FR-053`). Supports 1–5 star ratings and qualitative comments for two-sided evaluation (Business reviews Freelancer/Team; Freelancer/Team Rep reviews Business). Requires a valid completed collaboration record (`FR-055`). No 14-day or unapproved deadlines are imposed. Review publication, moderation, and dispute policies remain uncommitted and marked unresolved for production. No fabricated reviews unrelated to valid demo projects are generated.
   - **Payment Simulation & Fee Policy (`DEC-04`, `FR-056`–`FR-062`)**: Approved for prototype behavior only. Screens `PAY-001` to `PAY-005` display agreed milestone values and list FREVO platform fees as `"Chưa xác định"`. The UI does not calculate or display net payouts or total payable amounts pending production policy approval. Includes mandatory disclaimer: *"Mức phí dịch vụ nền tảng đang trong giai đoạn khảo sát chính sách."* Screens are prominently labeled as simulations (`MÔ PHỎNG`); no real escrow, payment gateway, or monetary transactions are implemented, and no fee percentage (e.g. 5%) is assumed.
   - **Team Representation (`FR-063`, `FR-026`, `BR-003`, `BR-020`, `BR-027`, `BR-028`)**: Governed by `FR-063` (Team profile and single leader operation in MVP) and `FR-026` (acting identity). `FR-061` and `FR-062` govern payment data compliance and financial reporting, not teams.
   - **Milestone Flexibility & Revision Policy (`DEC-03`, `BR-025`, `BR-014`, `FR-048`, `FR-049`–`FR-053`)**: Milestones have defined deliverables, deadlines, and amounts; sequential execution is not artificially forced unless dictated by project terms. FREVO does **not** impose a platform-wide fixed maximum of 2 revision rounds. Revision allowances are mutually agreed between Business and Freelancer/Team Representative based on milestone scope (configurable numeric count or custom arrangement). The UI displays used revision counts. Business must state specific reasons when requesting revisions (`BR-014`). Exhausted allowances prompt mutual consultation rather than automatic fees, auto-completion, or auto-rejection. Out-of-scope work requires a proposed agreement revision (`WORK-007`/`PROJ-005`), preserving the active agreement version until mutually confirmed per `FR-048`. Additional mechanics are labeled as proposed prototype behavior pending formal SRS approval.
   - **Lifecycle State Integrity (`BR-023`)**: Clear distinction between `Đã đóng tuyển` (recruitment closed upon agreement confirmation) and post-selection project execution/completion states.
2. **Modular State Architecture (No God Context)**: Avoid creating a single monolithic `MarketplaceContext` that triggers re-render storms across the application. Use modular, domain-aligned contexts and hooks (`AuthSessionContext`, `useProjects`, `useCandidates`, `useAgreements`, `useProjectChat`, `useNotifications`) backed by a shared mock storage adapter (`src/lib/storage/mockStorage.ts`).
3. **Architectural De-monolithization**: Decompose the 74KB `BusinessPrototype.tsx` into clean, single-responsibility feature components under `src/features/business/pages/` and `src/features/business/components/`, standardizing on Material UI theme tokens and retiring custom `.fb-*` styles.
4. **Independent Landing Page Architecture & Configurable Navigation**: Keep the completed FREVO Landing Page as an independent Next.js application (`FREVO_Landing_Page/cm-website`). Do not recreate, rewrite, or port `PUB-001` into the React + Vite Marketplace application. Plan integration through configurable URLs and navigation links. The Marketplace application hosts Guest Project Discovery (`PUB-002`) and Public Project Detail (`PUB-003`). `PUB-001` is marked as externally implemented, pending integration and visual verification. `TSK-003` focuses on guest discovery and cross-application navigation while preserving the complete 74 Screen ID inventory and SRS traceability.
5. **Full Portfolio Coverage**: Provide complete implementation for `FL-003` and `FL-004`, including media validation (`NFR-10`, `DEC-02`), contribution attribution (`BR-027`), and responsive UI states.

---

## 2. Target Architecture & Domain State Design

### 2.1 Modular State & Hook Topology
In accordance with `REACT_STRUCTURE_GUIDE.md` and `vercel-react-best-practices` (`rerender-split-combined-hooks`), state is separated by domain boundaries rather than bundled into a single god context:

```text
                                  ┌─────────────────────────────────────────┐
                                  │           App Shell & Router            │
                                  │   (ThemeProvider, CssBaseline, Outlet)  │
                                  └────────────────────┬────────────────────┘
                                                       │
                                  ┌────────────────────┴────────────────────┐
                                  │           AuthSessionContext            │
                                  │   (Current User, Role, Acting Identity) │
                                  └────────────────────┬────────────────────┘
                                                       │
        ┌──────────────────────────────┬───────────────┴──────────────┬──────────────────────────────┐
        ▼                              ▼                              ▼                              ▼
┌─────────────────┐          ┌─────────────────┐            ┌─────────────────┐            ┌─────────────────┐
│   useProjects   │          │  useCandidates  │            │  useAgreements  │            │useNotifications │
│ (Briefs, Browse,│          │  (Applications, │            │(Proposal, V1/V2,│            │(Events, Unread, │
│  Filter, Status)│          │  Invites, Gating│            │ 3-Day Decision) │            │  Deep Links)    │
└────────┬────────┘          └────────┬────────┘            └────────┬────────┘            └────────┬────────┘
         │                            │                              │                              │
         └────────────────────────────┼──────────────────────────────┴──────────────────────────────┘
                                      ▼
                        ┌───────────────────────────┐
                        │    Shared Mock Storage    │
                        │ (mockStorage.ts + Session)│
                        └───────────────────────────┘
```

### 2.2 Core Domain Interfaces (`src/lib/types/marketplace.types.ts`)
```typescript
export type UserRole = "guest" | "business" | "freelancer" | "admin";
export type ActingIdentity = "individual" | "team";
export type ProjectStatus = "draft" | "published" | "agreement" | "closed" | "ongoing" | "completed" | "cancelled";
export type CandidateStatus = "new" | "reviewing" | "discussing" | "offer" | "selected" | "not_selected";
export type InvitationStatus = "pending" | "accepted" | "declined" | "expired" | "cancelled";
export type AgreementStatus = "proposed" | "confirmed" | "rejected" | "superseded" | "expired";
export type MilestoneStatus = "upcoming" | "in_progress" | "submitted" | "revision_requested" | "completed";

export interface CandidateRecord {
  id: string;
  projectId: string;
  freelancerId: string;
  freelancerName: string;
  actingAs: ActingIdentity;
  teamId?: string;
  source: "application" | "invitation" | "merged";
  status: CandidateStatus;
  proposalText: string;
  portfolioSampleUrl?: string;
  submittedAt: string;
  invitationId?: string;
  chatApproved: boolean; // Governed strictly by BUS-013 per FR-031, FR-045, BR-012, BR-013
}

export interface InvitationRecord {
  id: string;
  projectId: string;
  talentId: string;
  status: InvitationStatus;
  sentAt: string;
  expiresAt: string; // Exactly 7 days from sentAt per FR-019 and BR-024
}

export interface AgreementRecord {
  id: string;
  projectId: string;
  candidateId: string;
  version: number;
  status: AgreementStatus;
  scopeSummary: string;
  totalBudget: number;
  deadline: string;
  milestones: Array<{
    id: string;
    name: string;
    deliverables: string[];
    deadline: string;
    amount: number;
    status: MilestoneStatus;
    revisionCount?: number;
  }>;
  proposedAt: string;
  expiresAt: string; // Exactly 3 days from proposedAt per FR-032 and BR-024
  confirmedAt?: string;
  isEffective: boolean; // Active confirmed version preserved until replacement confirmed per FR-048
}
```

---

## 3. Phased Implementation Roadmap

```text
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ PHASE 0: Foundation, Design Tokens & Auth Session Stabilization                         │
│ • Establish AuthSessionContext & Mock Storage Adapter (mockStorage.ts)                  │
│ • Connect Auth Pages to session redirection & Role Guard (AUTH-001, AUTH-002, SHARED-001)│
│ • Cross-App Navigation to Next.js Landing (PUB-001) & Guest Discovery (PUB-002, PUB-003)│
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ PHASE 1: Core Marketplace — Briefs, Discovery, Matching, Applications & Gating          │
│ • Decompose Business Brief Lifecycle (BUS-001 to BUS-006)                               │
│ • Candidate Matching & Explainable Evidence (BUS-007, BUS-008, BUS-014, BUS-015)        │
│ • 7-Day Invitation Flow & Freelancer Hub (BUS-009, BUS-010, FL-010, FL-011 per BR-024)  │
│ • Complete Portfolio Management & Media Validation (FL-003, FL-004 per NFR-10, BR-027)  │
│ • Multi-Identity Application & Source Merging (FL-006 to FL-009, FL-012, BUS-011, BUS-012)│
│ • CRITICAL: Candidate Review & Chat Approval Gating Modal (BUS-013 per FR-031, BR-012)  │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ PHASE 2: Selection, Gated Communication & Agreements                                    │
│ • Two-Sided Gated Chat & Locked Placeholders (PROJ-001, PROJ-002 per FR-045, FR-046)    │
│ • Agreement Drafting, 3-Day Decision & Active Version Preservation (PROJ-003 to PROJ-005)│
│ • Selection Closure (Đã đóng tuyển), Rejection Notices & Notifications (PROJ-006, FL-013)│
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ PHASE 3: Extended Product UI — Teams, Workspace, Execution & Payments                   │
│ • Team Profile, Roster, Attributed Portfolio & Context Toggle (TEAM-001 to TEAM-004)    │
│ • Two-Sided Project Workspace & Milestone Tracker (WORK-001 to WORK-003)                │
│ • Deliverable Submission, Revision Requests & Acceptance (WORK-004 to WORK-008)         │
│ • Simulated Milestone Escrow Ledger & Disbursements (PAY-001 to PAY-005 per FR-056–062)│
│ • Post-Project Rating & Testimonials (REV-001, REV-002 per BR-016, FR-054)             │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ PHASE 4: Supporting & Exceptional UI — Settings, Administration & Polish                │
│ • Account Settings, Privacy Preferences & Notification Opts (SET-001, SET-002, NOTIF-003)│
│ • Admin Account Management & Moderation Queue (ADMIN-001 to ADMIN-004 per FR-043–044)  │
│ • Comprehensive Responsive Audit & Cross-Role Journey Validation (All 74 Screens)      │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Phase Breakdown & Deliverables

### Phase 0 — Foundation, Design Tokens & Auth Session Stabilization
- **Deliverables**:
  - `AuthSessionContext` (`src/lib/context/auth-context.tsx`) managing active role and session identity.
  - `mockStorage.ts` (`src/lib/storage/mockStorage.ts`): Unified reactive storage adapter with pre-seeded demo dataset.
  - Wire `LoginPage.tsx` and `RegisterPage.tsx` to authenticate session and navigate to role dashboard.
  - Configurable cross-app navigation link setup (`src/lib/config/navigation.ts`) connecting Marketplace to the external Next.js landing page (`PUB-001` — marked as externally implemented in `cm-website`).
  - Guest Project Discovery (`PUB-002`) and Public Project Detail (`PUB-003`) at Marketplace root `/` with read-only exploration and login prompts on apply actions.
  - `RoleGuard.tsx` (`SHARED-001` - 403 Forbidden) and `ErrorRetryBanner.tsx` (`SHARED-003`).
- **Screens Addressed (10)**: `PUB-001` (external integration), `PUB-002`, `PUB-003`, `AUTH-001`, `AUTH-002`, `AUTH-003`, `SHARED-001`, `SHARED-002` (kept), `SHARED-003`, `FL-006` (guest hookup).

### Phase 1 — Core Marketplace: Briefs, Matching, Applications & Gating
- **Deliverables**:
  - Decompose `BusinessPrototype.tsx` into `BusinessLayout.tsx`, `BusinessDashboardPage.tsx` (`BUS-001`), `MyProjectsPage.tsx` (`BUS-002`), `CreateBriefPage.tsx` (`BUS-003`, `BUS-004`), and `ProjectDetailPage.tsx` (`BUS-005`).
  - Close recruitment modal (`BUS-006`) detailing impact on candidates.
  - Candidate Suggestions (`BUS-007`) and Evidence Card (`BUS-008`, `BUS-014`).
  - Explainable Criteria Card (`BUS-015` — Prototype simulation, `FR-034`–`FR-036`).
  - 7-Day Invitation Workflow (`BUS-009`, `BUS-010`, `FL-010`, `FL-011`) enforcing 7-day expiry per `FR-019` and `BR-024`.
  - Full Portfolio Management (`FL-003`, `FL-004`): Media validation (`NFR-10`, `DEC-02`), contribution attribution (`BR-027`), responsive empty and error states.
  - Application Submission & Tracking (`FL-007`, `FL-008`, `FL-009`, `FL-012`, `BUS-011`, `BUS-012`): Support Individual vs Team identity (`BR-003`), source merging (`BR-011`).
  - **CRITICAL GATING MODAL**: `ApproveCandidateDialog.tsx` (`BUS-013`). Chat remains locked until Business confirms candidate review per `FR-031`, `FR-045`, `BR-012`, `BR-013`.
- **Screens Addressed (24)**: `BUS-001` to `BUS-015`, `FL-001`, `FL-003`, `FL-004`, `FL-005`, `FL-007`, `FL-008`, `FL-009`, `FL-010`, `FL-011`, `FL-012`.

### Phase 2 — Selection, Gated Communication & Agreements
- **Deliverables**:
  - Two-Sided Gated Chat (`PROJ-001`, `PROJ-002`): Accessible only to approved candidates per `FR-045`, `FR-046`, `BR-012`, `BR-013`.
  - Structured Agreement Proposal (`PROJ-003`) and 3-Day Decision Card (`PROJ-004`) per `FR-032`, `BR-024`.
  - Agreement Versioning (`PROJ-005`): Preserves active confirmed version until new proposed replacement version is mutually confirmed per `FR-048`.
  - Selection Closure (`PROJ-006`, `FL-013`): Agreement confirmation moves project to `Đã đóng tuyển`, marks candidate `selected`, and updates other applicants to `not_selected` per `BR-023`.
  - Reactive In-App Notification Center (`NOTIF-001`) and Deep-Linking Dropdown Bell (`NOTIF-002`) per `FR-064`.
- **Screens Addressed (10)**: `PROJ-001` to `PROJ-007`, `FL-013`, `NOTIF-001`, `NOTIF-002`.

### Phase 3 — Extended Product UI: Teams, Workspace & Payments
- **Deliverables**:
  - Team Domain (`TEAM-001` to `TEAM-005`): Profile, roster, team portfolio with individual attribution (`BR-027`), and leader context switcher per `FR-063`, `BR-020`. `TEAM-005` rendered as post-MVP preview card (`DEC-09`).
  - Project Workspace (`WORK-001` to `WORK-003`): Multi-milestone dashboard with flexible execution order.
  - Deliverable Management (`WORK-004` to `WORK-008`): Submission with version tags, mutually agreed milestone revision allowance with used count tracking (`DEC-03`), Business revision request with required reason (`WORK-005`, `BR-014`), mutual consultation banner upon allowance exhaustion without auto-penalties, scope change requests (`WORK-007`) proposing agreement amendment preserving active version (`FR-048`), and project completion celebration (`WORK-006`).
  - Simulated Milestone Escrow Module (`PAY-001` to `PAY-005`): Transparent milestone ledger displaying agreed milestone amounts, platform fees as `"Chưa xác định"`, no net payout calculations, and mandatory disclaimer *"Mức phí dịch vụ nền tảng đang trong giai đoạn khảo sát chính sách."* All screens prominently badged as `MÔ PHỎNG THANH TOÁN` (`DEC-04`, `FR-056`–`FR-062`).
  - Post-Project Reviews (`REV-001`, `REV-002`): Simple review modal triggered by user upon valid project completion (`FR-040`, `FR-053`), supporting two-sided 1–5 star ratings and qualitative feedback (`BR-016`, `FR-054`, `FR-055`) without artificial 14-day deadlines. Marked as prototype functionality with production policies unresolved.
- **Screens Addressed (21)**: `TEAM-001` to `TEAM-005`, `WORK-001` to `WORK-008`, `PAY-001` to `PAY-005`, `REV-001`, `REV-002`.

### Phase 4 — Supporting & Exceptional UI: Settings, Administration & Polish
- **Deliverables**:
  - Account Settings (`SET-001`) and Privacy Preferences (`SET-002`, `NOTIF-003`).
  - Admin Interface (`ADMIN-001` to `ADMIN-004`): User directory, account moderation, flagged content queue per `FR-043`, `FR-044`, `FR-062`.
  - Comprehensive responsive verification across desktop (1440px), tablet (768px), and mobile (375px).
- **Screens Addressed (7)**: `SET-001`, `SET-002`, `NOTIF-003`, `ADMIN-001`, `ADMIN-002`, `ADMIN-003`, `ADMIN-004`.

---

## 5. Screen Coverage Summary (All 74 Documented Screens)

| Screen ID | Screen Name | Role | P | Main Flow | Core SRS References | Implementation Task |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `PUB-001` | Landing / Giới thiệu FREVO | Guest | P0 | FLOW-01 | 2.3; 7.1 | TSK-003 (Externally implemented in Next.js `cm-website`; integrated via navigation links) |
| `PUB-002` | Khám phá Project công khai (read-only) | Guest | P0 | FLOW-01 | 2.3; 2.1 | TSK-003 |
| `PUB-003` | Chi tiết Project công khai | Guest | P0 | FLOW-01 | 2.3; FR-025 | TSK-003 |
| `AUTH-001`| Đăng ký và chọn vai trò | Guest | P0 | FLOW-01 | FR-001 | TSK-002 |
| `AUTH-002`| Đăng nhập | Guest | P0 | FLOW-01 | FR-002 | TSK-002 |
| `AUTH-003`| Quên / đặt lại mật khẩu | Guest | P1 | FLOW-01 | FR-005 | TSK-002 |
| `AUTH-004`| Chọn hồ sơ hành động Individual / Team | Business/FL | P0 | FLOW-01 | FR-026; FR-063; BR-003 | TSK-007, TSK-012 |
| `SET-001` | Thông tin tài khoản | Business/FL | P0 | FLOW-01 | FR-003 | TSK-017 |
| `SET-002` | Privacy và giới hạn chia sẻ hồ sơ | Business/FL | P1 | FLOW-01 | 3.2; NFR-05; 11.2 | TSK-017 |
| `SHARED-001`| 403 / Không có quyền truy cập | All | P0 | FLOW-20 | FR-004; NFR-04; NFR-05 | TSK-002 |
| `SHARED-002`| 404 / Không tìm thấy hoặc đã đóng | All | P0 | FLOW-20 | 2.1 | TSK-003 (Verify complete) |
| `SHARED-003`| Lỗi mạng / retry / loading tổng quát | All | P0 | FLOW-20 | NFR-01; NFR-02 | TSK-003 |
| `BUS-001` | Dashboard Business | Business | P0 | FLOW-02 | 2.3 | TSK-004 |
| `BUS-002` | Danh sách dự án của tôi | Business | P0 | FLOW-02 | 2.3; FR-015 | TSK-004 |
| `BUS-003` | Tạo / sửa Structured Project Brief | Business | P0 | FLOW-02 | FR-012–014; BR-001; UC-01 | TSK-004 |
| `BUS-004` | Xem trước / kiểm tra / công bố Brief | Business | P0 | FLOW-02 | FR-014; UC-01; BR-002 | TSK-004 |
| `BUS-005` | Chi tiết dự án Business | Business | P0 | FLOW-02 | 2.3; FR-015 | TSK-004 |
| `BUS-006` | Đóng tuyển hoặc hủy dự án | Business | P0 | FLOW-12 | FR-016; 11.4; 11.8 | TSK-004 |
| `BUS-007` | Danh sách matching và bộ lọc | Business | P0 | FLOW-03 | FR-017–018; BR-004; BR-028; UC-02 | TSK-005 |
| `BUS-008` | Chi tiết năng lực ứng viên / evidence | Business | P0 | FLOW-03 | FR-018; BR-027; UC-02 | TSK-005 |
| `BUS-009` | Xác nhận gửi lời mời | Business | P0 | FLOW-03 | FR-019; BR-008; BR-024; UC-02 | TSK-006 |
| `BUS-010` | Lời mời đã gửi và trạng thái | Business | P0 | FLOW-03 | FR-021; FR-022; BR-024 | TSK-006 |
| `BUS-011` | Ứng viên theo dự án (inbox chung) | Business | P0 | FLOW-08 | FR-029–030; BR-006; BR-011; UC-05 | TSK-007 |
| `BUS-012` | Review proposal + CV theo quyền | Business | P0 | FLOW-08 | FR-030; BR-012; UC-05 | TSK-007 |
| `BUS-013` | Duyệt / từ chối ứng viên (Mở chat) | Business | P0 | FLOW-08 | FR-031; FR-045; BR-012; BR-013; UC-05 | TSK-008 |
| `BUS-014` | Ứng viên trống / không matching | Business | P0 | FLOW-03 | UC-02; FR-017 | TSK-005 |
| `BUS-015` | Candidate fit analysis (future AI) | Business | P1 | FLOW-03 | FR-034–036; 1.2; 11.1 | TSK-005 |
| `FL-001`  | Dashboard Freelancer | Freelancer | P0 | FLOW-04 | 2.3 | TSK-007 |
| `FL-002`  | Hồ sơ nghề nghiệp cá nhân | Freelancer | P0 | FLOW-04 | FR-006–007; FR-011; UC-04 | TSK-007 (Verify complete) |
| `FL-003`  | Quản lý portfolio | Freelancer | P0 | FLOW-04 | FR-008; BR-027; UC-04 | TSK-007A |
| `FL-004`  | Portfolio item editor / media upload | Freelancer | P0 | FLOW-04 | FR-008; NFR-10; BR-027; DEC-02 | TSK-007A |
| `FL-005`  | Quản lý CV tùy chọn | Freelancer | P1 | FLOW-04 | FR-010; NFR-10; BR-012 | TSK-007 |
| `FL-006`  | Tìm và lọc Project | Freelancer | P0 | FLOW-06 | FR-023–024; UC-03 | TSK-007 |
| `FL-007`  | Chi tiết dự án & điều kiện | Freelancer | P0 | FLOW-06 | FR-025; UC-03 | TSK-007 |
| `FL-008`  | Gửi proposal / ứng tuyển | Freelancer | P0 | FLOW-06 | FR-026–027; BR-002; BR-003; BR-007; UC-03 | TSK-007 |
| `FL-009`  | Theo dõi đơn ứng tuyển | Freelancer | P0 | FLOW-06 | FR-027; UC-03 | TSK-007 |
| `FL-010`  | Hộp thư lời mời | Freelancer | P0 | FLOW-07 | FR-020; BR-024; UC-04 | TSK-006 |
| `FL-011`  | Chi tiết và phản hồi lời mời | Freelancer | P0 | FLOW-07 | FR-020; BR-005; BR-024; UC-04 | TSK-006 |
| `FL-012`  | Xác nhận rút ứng tuyển | Freelancer | P0 | FLOW-12 | FR-028; BR-010 | TSK-007 |
| `FL-013`  | Trạng thái không được chọn / hết hiệu lực | Freelancer | P0 | FLOW-11 | FR-033; BR-023 | TSK-011 |
| `TEAM-001`| Hồ sơ Team | Team Rep | P0 | FLOW-05 | FR-063; BR-020 | TSK-012 |
| `TEAM-002`| Danh sách thành viên và vai trò | Team Rep | P0 | FLOW-05 | FR-063; BR-020 | TSK-012 |
| `TEAM-003`| Portfolio & contribution của Team | Team Rep | P0 | FLOW-05 | FR-063; BR-021; BR-027 | TSK-012 |
| `TEAM-004`| Chuyển context Team / Individual | Team Rep | P0 | FLOW-05 | FR-026; FR-063; BR-003; BR-020 | TSK-012 |
| `TEAM-005`| Phân quyền thành viên Team (future) | Team Rep | P2 | FLOW-05 | FR-063; DEC-09 | TSK-012 |
| `PROJ-001`| Chat theo project + candidate | Business/FL | P0 | FLOW-09 | FR-045–046; FR-031; BR-012–013; UC-06 | TSK-009 |
| `PROJ-002`| Chat chưa được mở / read-only sau đóng | Business/FL | P0 | FLOW-09 | FR-045; BR-012; BR-013; 11.6 | TSK-009 |
| `PROJ-003`| Soạn bản tóm tắt thỏa thuận | Business/FL | P0 | FLOW-10 | FR-032; FR-047; BR-015; 11.7 | TSK-010 |
| `PROJ-004`| Xem / xác nhận / từ chối thỏa thuận | Business/FL | P0 | FLOW-10 | FR-032; FR-047; BR-015; BR-024; 11.7 | TSK-010 |
| `PROJ-005`| Lịch sử phiên bản agreement / change | Business/FL | P0 | FLOW-11 | FR-048; 11.7 | TSK-010 |
| `PROJ-006`| Kết quả đóng tuyển & selected candidate | Business/FL | P0 | FLOW-11 | FR-033; BR-023 | TSK-011 |
| `PROJ-007`| Thỏa thuận hết hạn / từ chối / superseded| Business/FL | P0 | FLOW-10 | FR-032; FR-048; BR-024 | TSK-010 |
| `WORK-001`| Project workspace overview | Business/FL | P1 | FLOW-13 | FR-037; UC-07 | TSK-013 |
| `WORK-002`| Milestones & timeline | Business/FL | P1 | FLOW-13 | FR-039; FR-049; BR-025 | TSK-013 |
| `WORK-003`| Chi tiết milestone / cập nhật tiến độ | Business/FL | P1 | FLOW-13 | FR-049; FR-050 | TSK-013 |
| `WORK-004`| Gửi deliverable và phiên bản | Freelancer | P1 | FLOW-14 | FR-038; FR-050; FR-052 | TSK-014 |
| `WORK-005`| Nghiệm thu hoặc yêu cầu sửa | Business | P1 | FLOW-14 | FR-051; BR-014; 10.4 | TSK-014 |
| `WORK-006`| Hoàn tất dự án (demo) | Business/FL | P1 | FLOW-14 | FR-040; FR-053 | TSK-014 |
| `WORK-007`| Change request phạm vi / milestone | Business/FL | P1 | FLOW-13 | 10.2; 10.4; 11.7 | TSK-014 |
| `WORK-008`| Milestone overdue / missing deliverable | Business/FL | P1 | FLOW-13 | FR-049–FR-053 | TSK-014 |
| `PAY-001` | Milestone funding overview (SIMULATED) | Business/FL | P2 | FLOW-15 | FR-056–059; FR-061; 10.3; 11.5 | TSK-015 |
| `PAY-002` | Fund milestone / breakdown (SIMULATED) | Business | P2 | FLOW-15 | FR-056; FR-061; 11.5 | TSK-015 |
| `PAY-003` | Lịch sử payment & release (SIMULATED) | Business/FL | P2 | FLOW-15 | FR-058; FR-060; FR-062 | TSK-015 |
| `PAY-004` | Thanh toán failed / retry (SIMULATED) | Business | P2 | FLOW-15 | FR-059; 11.5 | TSK-015 |
| `PAY-005` | Dispute / refund scenario (concept) | Business/FL | P2 | FLOW-16 | 10.5; 11.5; BR-018; DEC-05 | TSK-015 |
| `REV-001` | Đánh giá sau dự án | Business/FL | P2 | FLOW-17 | FR-041; FR-054; BR-016 | TSK-016 |
| `REV-002` | Uy tín / đánh giá công khai hợp lệ | Public/All | P2 | FLOW-17 | FR-042; FR-055 | TSK-016 |
| `NOTIF-001`| Notification center | Business/FL | P0 | FLOW-18 | FR-064; 11.3; BR-022 | TSK-011 |
| `NOTIF-002`| Dropdown notification / deep link | Business/FL | P0 | FLOW-18 | FR-064; 11.3; BR-022 | TSK-011 |
| `NOTIF-003`| Email notification preference | Business/FL | P1 | FLOW-18 | FR-064; 11.3; DEC-07 | TSK-017 |
| `ADMIN-001`| Admin account overview | Admin | P2 | FLOW-19 | FR-043; FR-062 | TSK-018 |
| `ADMIN-002`| Account detail / moderation actions | Admin | P2 | FLOW-19 | FR-043; FR-046 | TSK-018 |
| `ADMIN-003`| Moderation / report queue | Admin | P2 | FLOW-19 | FR-044 | TSK-018 |
| `ADMIN-004`| Moderation case detail | Admin | P2 | FLOW-19 | FR-044 | TSK-018 |

---

## 6. Definition of Done (DoD) for Implementation Tasks

1. **Traceability**: Task explicitly references verified `FR-xxx`, `BR-xxx`, `UC-xx`, and `FLOW-xx` IDs.
2. **State Guarantees**: Component handles Loading, Empty, Error, Disabled, and Success states.
3. **MUI First**: Adheres strictly to `theme.ts` tokens (`#f4490b`, `#20201f`, `Space Grotesk`, `Archivo`, `borderRadius: 13/999`).
4. **Automated Quality Gates**:
   - `npm.cmd run typecheck` exits 0.
   - `npm.cmd run lint` exits 0.
   - `npm.cmd run build` exits 0.
5. **Two-Sided Integrity**: Multi-role interactions verify seamlessly without data desynchronization.
