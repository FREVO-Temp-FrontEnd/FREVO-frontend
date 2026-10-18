# FREVO Marketplace UI — Screen Coverage Matrix & Traceability (Audited)

**Author:** Senior Specialist Engineering Team (Product Manager, Business Analyst, UI/UX Designer, Frontend Architect, React/TypeScript Engineer, Technical Reviewer)  
**Date:** October 2026  
**Status:** Complete Screen Registry & Traceability Matrix (Prototype Decisions Approved; Production Policies Unresolved)  
**Reference Documents:** `AGENTS.md`, `docs/FREVO_SRS_Final.md`, `docs/FREVO_Main_Flow_Full_Product_UI_Scope_v1_FINAL_SCREEN_SPECS.md`, `REACT_STRUCTURE_GUIDE.md`

---

## 1. Full Screen Coverage Registry (74 In-Scope Screens)

The following matrix documents all **74 screens** defined in the authoritative Full Product UI Scope, analyzing their implementation state, gap analysis, and planned action:

| Screen ID | Screen Name | Role | Priority | Main Flow | SRS Reference | Expected UI Components & Content | Existing Implementation | Coverage Status | Gap Description | Proposed Action | Dependencies | Effort | Phase |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **PUB-001** | Landing / Giới thiệu FREVO | Guest | P0 | FLOW-01 | 2.3; 7.1 | Hero brand banner, value proposition, CTAs for Business & Freelancer, Explore link | Completed in Next.js 16 (`cm-website`) | **Externally Implemented** | Exists outside Vite SPA; needs navigation link integration | **Integrate via Nav Links (TSK-003)** | External App | Low | Phase 0 |
| **PUB-002** | Khám phá Project công khai (read-only) | Guest | P0 | FLOW-01 | 2.3; 2.1 | Public project list, category & budget filters, read-only cards, sign-in CTA on actions | `FreelancerHomePage.tsx` (serves auth discovery) | **Partial** | Currently displays authenticated controls (bookmark/apply) to guests | **Build Guest Mode (TSK-003)** | App Shell | Med | Phase 0 |
| **PUB-003** | Chi tiết Project công khai | Guest | P0 | FLOW-01 | 2.3; FR-025 | Public brief view, deliverables, budget range, "Đăng nhập để ứng tuyển" CTA | `ProjectDetailPage.tsx` | **Partial** | Shows direct apply; needs guest mode with returnUrl redirect | **Extend (TSK-003)** | PUB-002 | Low | Phase 0 |
| **AUTH-001** | Đăng ký và chọn vai trò | Guest | P0 | FLOW-01 | FR-001 | Role selector (Client/Freelancer), company name input, email, password, validation | `RegisterPage.tsx` (`/register`) | **Partial** | Form validates but submit shows dead-end mock alert | **Fix & Connect (TSK-002)** | App Shell | Low | Phase 0 |
| **AUTH-002** | Đăng nhập | Guest | P0 | FLOW-01 | FR-002 | Email, password, remember me, validation, forgot password link, login action | `LoginPage.tsx` (`/login`) | **Partial** | Form validates but submit shows dead-end mock alert | **Fix & Connect (TSK-002)** | App Shell | Low | Phase 0 |
| **AUTH-003** | Quên / đặt lại mật khẩu | Guest | P1 | FLOW-01 | FR-005 | Email input, reset code input, new password, confirmation, return to login | `ForgotPasswordPage.tsx` (`/forgot-password`) | **Partial** | Shows static simulation notice without recovery state | **Fix (TSK-002)** | AUTH-002 | Low | Phase 0 |
| **AUTH-004** | Chọn hồ sơ hành động Individual / Team | Business / Freelancer | P0 | FLOW-01, FLOW-05 | FR-026, FR-063, BR-003 | Context selection modal/card: choose acting as individual freelancer or team leader | None | **Missing** | Missing context selection modal for hybrid accounts | **Build (TSK-007, TSK-012)** | AUTH-002 | Med | Phase 1 |
| **SET-001** | Thông tin tài khoản | Business / Freelancer | P0 | FLOW-01 | FR-003 | Profile information, email, display name, contact phone, avatar upload simulation | `BusinessPrototype.tsx` (`SettingsPage`) | **Partial** | Only single company name field in Business; missing for Freelancer | **Extend (TSK-017)** | App Shell | Med | Phase 4 |
| **SET-002** | Privacy và giới hạn chia sẻ hồ sơ | Business / Freelancer | P1 | FLOW-01 | 3.2, NFR-05, 11.2 | Privacy toggles (hide contact info, unlisted profile, portfolio visibility) | None | **Missing** | Missing privacy preferences tab | **Build (TSK-017)** | SET-001 | Low | Phase 4 |
| **SHARED-001**| 403 / Không có quyền truy cập | All | P0 | FLOW-20 | FR-004, NFR-04, NFR-05 | Access denied screen with explanation of required role and return home button | None | **Missing** | Role boundary unauthorized access has no dedicated screen | **Build (TSK-002)** | App Shell | Low | Phase 0 |
| **SHARED-002**| 404 / Không tìm thấy hoặc đã đóng | All | P0 | FLOW-20 | 2.1 | Friendly 404 view with search or return to home navigation | `NotFound.tsx` (`/not-found`) | **Complete** | Well styled with return navigation | **Keep** | None | None | Complete |
| **SHARED-003**| Lỗi mạng / retry / loading tổng quát | All | P0 | FLOW-20 | NFR-01, NFR-02 | Accessible loading skeleton, full-page network error banner with retry trigger | Inline in `useProjects` | **Partial** | Inline error text only; lacks reusable retry UI component | **Build Component (TSK-003)** | App Shell | Low | Phase 0 |
| **BUS-001** | Dashboard Business | Business | P0 | FLOW-02 | 2.3 | Active project cards, applicant counter, message summary, quick create brief CTA | `BusinessPrototype.tsx` (`Dashboard`) | **Partial** | Bundled in monolith; custom CSS styling | **Decompose & Refactor (TSK-004)** | App Shell | Med | Phase 1 |
| **BUS-002** | Danh sách dự án của tôi | Business | P0 | FLOW-02 | 2.3, FR-015 | Filterable tabbed list (All, Draft, Published, Ongoing, Closed) with project stats | `BusinessPrototype.tsx` (`ProjectsPage`) | **Partial** | Bundled in monolith; custom CSS | **Decompose & Refactor (TSK-004)** | BUS-001 | Med | Phase 1 |
| **BUS-003** | Tạo / sửa Structured Project Brief | Business | P0 | FLOW-02 | FR-012–014, UC-01, BR-001 | Form: title, category, budget min/max, deadline, deliverables, skills, executor pref | `BusinessPrototype.tsx` (`BriefForm`) | **Partial** | Works locally; needs unified state & MUI form components | **Decompose & Refactor (TSK-004)** | BUS-002 | High | Phase 1 |
| **BUS-004** | Xem trước / kiểm tra / công bố Brief | Business | P0 | FLOW-02 | FR-014, UC-01, BR-002 | Preview card, validation checklist, "Lưu nháp" & "Công bố dự án" buttons | `BusinessPrototype.tsx` (`ProjectBrief`) | **Partial** | Bundled in monolith; publish only updates local sessionStorage | **Decompose & Refactor (TSK-004)** | BUS-003 | Med | Phase 1 |
| **BUS-005** | Chi tiết dự án Business | Business | P0 | FLOW-02 | 2.3, FR-015 | Structured brief display, status badge, action bar, sub-navigation tabs | `BusinessPrototype.tsx` (`ProjectBrief`) | **Partial** | Custom styling, monolithic file | **Decompose & Refactor (TSK-004)** | BUS-004 | Med | Phase 1 |
| **BUS-006** | Đóng tuyển hoặc hủy dự án | Business | P0 | FLOW-12 | FR-016, 11.4, 11.8 | Confirmation dialog explaining effect on pending applicants/invitations | `BusinessPrototype.tsx` (Basic alert) | **Partial** | Missing confirmation modal detailing candidate impacts | **Build Dialog (TSK-004)** | BUS-005 | Low | Phase 1 |
| **BUS-007** | Danh sách matching và bộ lọc | Business | P0 | FLOW-03 | FR-017–018, BR-004, BR-028, UC-02 | Recommended candidates with transparent match tags, category & budget filters | `BusinessPrototype.tsx` (`SuggestionsPage`) | **Partial** | Uses static `talents` array; needs live portfolio evidence link | **Refactor & Extend (TSK-005)** | BUS-005 | Med | Phase 1 |
| **BUS-008** | Chi tiết năng lực ứng viên / evidence | Business | P0 | FLOW-03 | FR-018, BR-027, UC-02 | Verified portfolio preview, relevant past work evidence, skills, "Gửi lời mời" CTA | `BusinessPrototype.tsx` (`TalentProfile`) | **Partial** | Displays static talent details; needs direct portfolio links | **Refactor (TSK-005)** | BUS-007 | Med | Phase 1 |
| **BUS-009** | Xác nhận gửi lời mời | Business | P0 | FLOW-03 | FR-019, BR-008, BR-024, UC-02 | Dialog: select project, custom message note, **7-day expiry note per FR-019, BR-024** | `BusinessPrototype.tsx` (inline function) | **Partial** | Lacks dedicated accessible modal; logic in monolith | **Build Dialog (TSK-006)** | BUS-007 | Low | Phase 1 |
| **BUS-010** | Lời mời đã gửi và trạng thái | Business | P0 | FLOW-03 | FR-021, FR-022, BR-024 | Sent invitations cards/table, status (Pending, Accepted, Expired, Declined) | `BusinessPrototype.tsx` (`InvitationsPage`) | **Partial** | Bundled in monolith; displays 7-day expiration per FR-019/BR-024 | **Decompose & Refactor (TSK-006)** | BUS-009 | Med | Phase 1 |
| **BUS-011** | Ứng viên theo dự án (inbox chung) | Business | P0 | FLOW-08 | FR-029–030, BR-006, BR-011, UC-05 | Unified candidate list combining applications and accepted invitations | `BusinessPrototype.tsx` (`ApplicantsPage`) | **Partial** | Correctly merges source tags, but missing explicit review actions | **Decompose & Refactor (TSK-007)** | BUS-005 | Med | Phase 1 |
| **BUS-012** | Review proposal + CV theo quyền | Business | P0 | FLOW-08 | FR-030, BR-012, UC-05 | Candidate proposal cover letter, portfolio sample, attached CV viewer | `BusinessPrototype.tsx` (simple proposal text) | **Partial** | Missing CV attachment preview and portfolio link verification | **Extend (TSK-007)** | BUS-011 | Med | Phase 1 |
| **BUS-013** | Duyệt / từ chối ứng viên (Mở chat) | Business | P0 | FLOW-08 | FR-031, FR-045, BR-012, BR-013, UC-05 | Modal with explicit actions: "Duyệt hồ sơ (Mở chat)" or "Từ chối hồ sơ" | None (Chat opens immediately without approval) | **Inconsistent / Missing** | **CRITICAL GATING DEFECT**: Chat opens without approval step | **Build Gating Modal (TSK-008)** | BUS-011 | Med | Phase 2 |
| **BUS-014** | Ứng viên trống / không matching | Business | P0 | FLOW-03 | UC-02, FR-017 | Empty state illustration with guidance on relaxing criteria or revising brief | `BusinessPrototype.tsx` (`Empty` block) | **Partial** | Rendered via `.fb-empty`; needs theme standardization | **Refactor (TSK-005)** | BUS-007 | Low | Phase 1 |
| **BUS-015** | Candidate fit analysis (future AI) | Business | P1 | FLOW-03 | FR-034–036, 1.2, 11.1 | Non-committal simulation showing skills match breakdown & transparent criteria | None | **Missing** | Missing explainable criteria breakdown card | **Build Card (TSK-005)** | BUS-008 | Low | Phase 1 |
| **FL-001** | Dashboard Freelancer | Freelancer | P0 | FLOW-04 | 2.3 | Active applications status, received invitations alert, recommended projects | `FreelancerHomePage.tsx` (serves only discovery) | **Partial** | Missing dedicated overview card summary | **Build Dashboard (TSK-007)** | App Shell | Med | Phase 1 |
| **FL-002** | Hồ sơ nghề nghiệp cá nhân | Freelancer | P0 | FLOW-04 | FR-006–007, FR-011, UC-04 | Bio, avatar, title, rates, availability badge, skills chips, social links | `ProfilePage.tsx` | **Complete** | Fully implemented with `EditProfileDialog` | **Keep & Refactor (TSK-007)** | None | Low | Complete |
| **FL-003** | Quản lý portfolio | Freelancer | P0 | FLOW-04 | FR-008, BR-027, UC-04 | Case study grid, cover cards, add work CTA, edit/delete actions | `ProfilePage.tsx` | **Partial** | Renders grid, but lacks individual/team contribution tags (`BR-027`) | **Extend (TSK-007A)** | FL-002 | Low | Phase 1 |
| **FL-004** | Portfolio item editor / media upload | Freelancer | P0 | FLOW-04 | FR-008, NFR-10, BR-027, DEC-02 | Rich modal: title, category, client, challenge, solution, image uploaders | `PortfolioEditor.tsx` & `PortfolioDetailPage.tsx` | **Partial** | Editor works, but lacks configurable client media validation & member tags | **Extend (TSK-007A)** | FL-003 | Med | Phase 1 |
| **FL-005** | Quản lý CV tùy chọn | Freelancer | P1 | FLOW-04 | FR-010, NFR-10, BR-012 | Optional PDF CV uploader, preview, download, replace, delete | None | **Missing** | Missing optional CV management block in Profile | **Build (TSK-007)** | FL-002 | Med | Phase 1 |
| **FL-006** | Tìm và lọc Project | Freelancer | P0 | FLOW-06 | FR-023–024, UC-03 | Search bar, category multi-select, budget slider, remote filter, sort dropdown | `FreelancerHomePage.tsx`, `ProjectFilters.tsx`, `ProjectList.tsx` | **Complete** | High-fidelity filtering and sorting | **Keep & Connect (TSK-007)** | None | Low | Phase 1 |
| **FL-007** | Chi tiết dự án & điều kiện | Freelancer | P0 | FLOW-06 | FR-025, UC-03 | Complete brief view, client info, required deliverables, "Ứng tuyển" CTA | `ProjectDetailPage.tsx`, `ProjectDetailBody.tsx`, `ProjectDetailSidebar.tsx` | **Complete** | Fully functional with application trigger | **Keep (TSK-007)** | FL-006 | None | Complete |
| **FL-008** | Gửi proposal / ứng tuyển | Freelancer | P0 | FLOW-06 | FR-026–027, BR-002, BR-003, BR-007, UC-03 | Dialog: select Individual or Team identity, proposal text, portfolio link | `ProjectApplyDialog.tsx` | **Partial** | Lacks Team identity selection selector (`BR-003`) | **Extend (TSK-007)** | FL-007 | Med | Phase 1 |
| **FL-009** | Theo dõi đơn ứng tuyển | Freelancer | P0 | FLOW-06 | FR-027, UC-03 | Status tracker: Submitted, Under Review, Approved for Chat, Not Selected | `FreelancerNav.tsx` (`view === "applications"`) | **Partial** | Only shows project card; missing status timeline | **Extend (TSK-007)** | FL-008 | Med | Phase 1 |
| **FL-010** | Hộp thư lời mời | Freelancer | P0 | FLOW-07 | FR-020, BR-024, UC-04 | Invitations list with sender company, project summary, **7-day response countdown** | None in Freelancer view | **Missing** | Freelancer has no way to view incoming invitations | **Build (TSK-006)** | BUS-009 | Med | Phase 1 |
| **FL-011** | Chi tiết và phản hồi lời mời | Freelancer | P0 | FLOW-07 | FR-020, BR-005, BR-024, UC-04 | View brief details, "Chấp nhận lời mời" & "Từ chối" buttons, 7-day indicator; accepting sets to Under Review per BR-005 | None in Freelancer view | **Missing** | Missing invitation response view | **Build (TSK-006)** | FL-010 | Med | Phase 1 |
| **FL-012** | Xác nhận rút ứng tuyển | Freelancer | P0 | FLOW-12 | FR-028, BR-010 | Modal to withdraw proposal before agreement with confirmation | None | **Missing** | Missing withdraw application action | **Build (TSK-007)** | FL-009 | Low | Phase 1 |
| **FL-013** | Trạng thái không được chọn / hết hiệu lực | Freelancer | P0 | FLOW-11 | FR-033, BR-023 | Polite feedback banner when another candidate was selected or invitation expired | None | **Missing** | Missing "Not Selected" notification card | **Build (TSK-011)** | FL-009 | Low | Phase 2 |
| **TEAM-001**| Hồ sơ Team | Team Rep | P0 | FLOW-05 | FR-063, BR-020 | Team name, tagline, collective bio, skills, representative leader indicator | None | **Missing** | No dedicated Team Profile view | **Build (TSK-012)** | FL-002 | Med | Phase 3 |
| **TEAM-002**| Danh sách thành viên và vai trò hiển thị| Team Rep | P0 | FLOW-05 | FR-063, BR-020 | Member cards, display roles, skills contributions (read-only for members in MVP) | None | **Missing** | Missing team member list view | **Build (TSK-012)** | TEAM-001 | Med | Phase 3 |
| **TEAM-003**| Portfolio & contribution của Team | Team Rep | P0 | FLOW-05 | FR-063, BR-021, BR-027 | Team shared portfolio cases with member attribution tags | None | **Missing** | Missing team portfolio showcase | **Build (TSK-012)** | TEAM-001 | Med | Phase 3 |
| **TEAM-004**| Chuyển context Team / Individual | Team Rep | P0 | FLOW-05 | FR-026, FR-063, BR-003, BR-020 | Header / profile toggle allowing leader to act as self or on behalf of team | None | **Missing** | Missing context switcher toggle | **Build (TSK-012)** | TEAM-001 | Low | Phase 3 |
| **TEAM-005**| Phân quyền thành viên Team (future) | Team Rep | P2 | FLOW-05 | FR-063, DEC-09 | Non-functional preview of multi-user team member permissions | None | **Missing** | Post-MVP placeholder card | **Build Preview (TSK-012)** | TEAM-002 | Low | Phase 3 |
| **PROJ-001**| Chat theo project + candidate | Business / Freelancer | P0 | FLOW-09 | FR-045–046, FR-031, BR-012–013, UC-06 | Project header, candidate header, message feed, text input, proposal trigger | `BusinessPrototype.tsx` (`MessagesPage`) | **Inconsistent** | Only in Business; missing in Freelancer; lacks approval check | **Build Shared View (TSK-009)** | BUS-013 | High | Phase 2 |
| **PROJ-002**| Chat chưa được mở / read-only sau đóng | Business / Freelancer | P0 | FLOW-09 | FR-045, BR-012, BR-013, 11.6 | Locked chat placeholder with clear notice: "Hồ sơ chưa được duyệt" / "Dự án đã đóng" | None | **Missing** | Missing locked chat explanation screen | **Build (TSK-009)** | PROJ-001 | Low | Phase 2 |
| **PROJ-003**| Soạn bản tóm tắt thỏa thuận | Business / Freelancer | P0 | FLOW-10 | FR-032, FR-047, BR-015, 11.7 | Form: scope summary, milestone schedule, budget, deadlines, deliverables | `BusinessPrototype.tsx` (`AgreementPage` propose mode) | **Partial** | Works in business; needs shared agreement data schema | **Refactor & Shared (TSK-010)** | PROJ-001 | Med | Phase 2 |
| **PROJ-004**| Xem / xác nhận / từ chối thỏa thuận | Business / Freelancer | P0 | FLOW-10 | FR-032, FR-047, BR-015, BR-024, 11.7 | Summary document card, **3-day countdown**, "Xác nhận hợp tác" & "Từ chối" buttons | `BusinessPrototype.tsx` (`AgreementPage` confirm mode) | **Partial** | Missing for Freelancer view | **Extend to FL (TSK-010)** | PROJ-003 | Med | Phase 2 |
| **PROJ-005**| Lịch sử phiên bản agreement / change | Business / Freelancer | P0 | FLOW-11 | FR-048, 11.7 | Version history comparison showing active confirmed version preserved until replacement is confirmed | None | **Missing** | Missing agreement version changelog | **Build (TSK-010)** | PROJ-004 | Med | Phase 2 |
| **PROJ-006**| Kết quả đóng tuyển & selected candidate | Business / Freelancer | P0 | FLOW-11 | FR-033, BR-023 | Banner: "Đã chọn người thực hiện", transition to workspace link | `BusinessPrototype.tsx` (`confirmAgreement`) | **Partial** | Simulated inline; needs clear celebration banner & workspace transition | **Refactor (TSK-011)** | PROJ-004 | Low | Phase 2 |
| **PROJ-007**| Thỏa thuận hết hạn / từ chối / superseded| Business / Freelancer | P0 | FLOW-10 | FR-032, FR-048, BR-024 | Status banner explaining reason for agreement invalidation and next action | None | **Missing** | Missing expired/rejected agreement state | **Build (TSK-010)** | PROJ-004 | Low | Phase 2 |
| **WORK-001**| Project workspace overview | Business / Freelancer | P1 | FLOW-13 | FR-037, UC-07 | Overview banner, confirmed agreement summary, current milestone, team card | `BusinessPrototype.tsx` (`ExecutorPage` / `ProgressPage`) | **Partial** | Basic progress view; lacks unified 2-sided workspace layout | **Extend & Build (TSK-013)** | PROJ-006 | High | Phase 3 |
| **WORK-002**| Milestones & timeline | Business / Freelancer | P1 | FLOW-13 | FR-039, FR-049, BR-025 | Step timeline: Milestone 1, 2, 3 with deadline, deliverables list, status; flexible progression | `BusinessPrototype.tsx` (`ProgressPage`) | **Partial** | Static progress cards; needs deliverable submission hooks | **Extend (TSK-013)** | WORK-001 | Med | Phase 3 |
| **WORK-003**| Chi tiết milestone / cập nhật tiến độ | Business / Freelancer | P1 | FLOW-13 | FR-049, FR-050 | Milestone parameters, progress bar, note update input | `BusinessPrototype.tsx` (simple complete action) | **Partial** | Needs progress update dialog | **Extend (TSK-013)** | WORK-002 | Low | Phase 3 |
| **WORK-004**| Gửi deliverable và phiên bản | Freelancer | P1 | FLOW-14 | FR-038, FR-050, FR-052 | Form to submit deliverable files/links, version label (V1, V2), notes | None | **Missing** | Missing deliverable submission modal | **Build (TSK-014)** | WORK-002 | Med | Phase 3 |
| **WORK-005**| Nghiệm thu hoặc yêu cầu sửa | Business | P1 | FLOW-14 | FR-051, BR-014, 10.4, DEC-03 | Deliverable review card: "Nghiệm thu (Accept)" or "Yêu cầu chỉnh sửa (Request Revision)" with reason; tracks revision count | None | **Missing** | Missing acceptance / revision decision dialog | **Build (TSK-014)** | WORK-004 | Med | Phase 3 |
| **WORK-006**| Hoàn tất dự án (demo) | Business / Freelancer | P1 | FLOW-14 | FR-040, FR-053 | Project completed celebration card with transition to review & simulated release | `BusinessPrototype.tsx` (partial alert) | **Partial** | Needs formal completion card | **Extend (TSK-014)** | WORK-005 | Low | Phase 3 |
| **WORK-007**| Change request phạm vi / milestone | Business / Freelancer | P1 | FLOW-13 | 10.2, 10.4, 11.7, FR-048 | Proposed change dialog to adjust milestone deadline or scope proposing agreement revision | None | **Missing** | Missing milestone change request modal | **Build (TSK-014)** | WORK-002 | Low | Phase 3 |
| **WORK-008**| Milestone overdue / missing deliverable | Business / Freelancer | P1 | FLOW-13 | FR-049–FR-053 | Warning indicator when milestone passes deadline without submission | None | **Missing** | Missing overdue alert state | **Build (TSK-014)** | WORK-002 | Low | Phase 3 |
| **PAY-001** | Milestone funding overview (SIMULATED) | Business / Freelancer | P2 | FLOW-15 | FR-056–059, FR-061, 10.3, 11.5, DEC-04 | Simulated escrow ledger, agreed milestone value, platform fee "Chưa xác định", no net calculation, disclaimer | None | **Missing** | Missing simulated payment overview | **Build Simulation (TSK-015)** | WORK-002 | Med | Phase 3 |
| **PAY-002** | Fund milestone / breakdown (SIMULATED) | Business | P2 | FLOW-15 | FR-056, FR-061, 11.5, DEC-04 | Simulated payment modal: card details mock, funding confirmation, simulated receipt | None | **Missing** | Missing simulated funding modal | **Build Simulation (TSK-015)** | PAY-001 | Low | Phase 3 |
| **PAY-003** | Lịch sử payment & release (SIMULATED) | Business / Freelancer | P2 | FLOW-15 | FR-058, FR-060, FR-062, DEC-04 | Table of simulated disbursements upon milestone acceptance; compliant reporting | None | **Missing** | Missing simulated transaction history | **Build Simulation (TSK-015)** | PAY-001 | Low | Phase 3 |
| **PAY-004** | Thanh toán failed / retry (SIMULATED) | Business | P2 | FLOW-15 | FR-059, 11.5 | Simulated failed transaction scenario with retry button | None | **Missing** | Missing simulated payment failure state | **Build Simulation (TSK-015)** | PAY-002 | Low | Phase 3 |
| **PAY-005** | Dispute / refund scenario (concept only) | Business / Freelancer | P2 | FLOW-16 | 10.5, 11.5, DEC-05 | Concept mockup explaining future arbitration with non-functional placeholder | None | **Missing** | Missing dispute concept card | **Build Concept Card (TSK-015)**| PAY-001 | Low | Phase 3 |
| **REV-001** | Đánh giá sau dự án | Business / Freelancer | P2 | FLOW-17 | FR-041, FR-054, BR-016, DEC-08 | User-triggered modal on valid completion: 1–5 star rating, qualitative comments, two-sided review | None | **Missing** | Missing review submission dialog | **Build Modal (TSK-016)** | WORK-006 | Med | Phase 3 |
| **REV-002** | Uy tín / đánh giá công khai hợp lệ | Public / All | P2 | FLOW-17 | FR-042, FR-055, DEC-08 | Public testimonial cards displayed on profile/business page linked to valid project | None | **Missing** | Missing public review cards on profile | **Build Card (TSK-016)** | REV-001 | Low | Phase 3 |
| **NOTIF-001**| Notification center | Business / Freelancer | P0 | FLOW-18 | FR-064, 11.3, BR-022 | Full page of categorized notifications (Invitations, Applications, Agreements, Updates) | `BusinessPrototype.tsx` (`NotificationsPage`) | **Partial** | Implemented for Business; missing for Freelancer | **Refactor & Unified Page (TSK-011)** | App Shell | Med | Phase 2 |
| **NOTIF-002**| Dropdown notification / deep link | Business / Freelancer | P0 | FLOW-18 | FR-064, 11.3, BR-022 | Header bell popover with unread counter, actionable deep links to project/chat | `NotificationsBell.tsx` | **Inconsistent** | Hardcoded static text; clicking produces no navigation | **Fix & Connect (TSK-011)** | NOTIF-001 | Med | Phase 2 |
| **NOTIF-003**| Email notification preference (optional)| Business / Freelancer | P1 | FLOW-18 | FR-064, 11.3, DEC-07 | Settings tab to toggle email alerts for invitations and proposals | None | **Missing** | Missing email preference checkboxes | **Build Tab (TSK-017)** | SET-001 | Low | Phase 4 |
| **ADMIN-001**| Admin account overview | Admin | P2 | FLOW-19 | FR-043, FR-062 | Table of registered Business and Freelancer accounts with status & role filters | None | **Missing** | Missing admin account management table | **Build View (TSK-018)** | App Shell | Med | Phase 4 |
| **ADMIN-002**| Account detail / moderation actions | Admin | P2 | FLOW-19 | FR-043, FR-046 | Account profile detail, verification badge toggle, suspension action | None | **Missing** | Missing admin account moderation modal | **Build Modal (TSK-018)** | ADMIN-001 | Low | Phase 4 |
| **ADMIN-003**| Moderation / report queue | Admin | P2 | FLOW-19 | FR-044 | Flagged briefs, inappropriate portfolio items, report reason and status | None | **Missing** | Missing moderation queue | **Build View (TSK-018)** | App Shell | Med | Phase 4 |
| **ADMIN-004**| Moderation case detail | Admin | P2 | FLOW-19 | FR-044 | Reported content preview, decision buttons (Dismiss, Warning, Hide Content) | None | **Missing** | Missing moderation case inspector | **Build Modal (TSK-018)** | ADMIN-003 | Low | Phase 4 |

---

## 2. Coverage Summary Metrics

- **Total In-Scope Screens**: **74 screens**
- **Existing Screens Complete / Near Complete**: **3 screens** (4.1%) (`FL-002`, `SHARED-002`, `FL-007`)
- **Existing Screens Requiring Extension / Refactoring**: **27 screens** (36.5%) (including `FL-003`, `FL-004` extended for media validation & contribution tags)
- **Existing Screens Inconsistent with Business Rules**: **2 screens** (2.7%)
  - `BUS-013`: Missing candidate approval gating before chat (`BR-012`, `BR-013`, `FR-031`, `FR-045`).
  - `NOTIF-002`: Notification bell contains static dead-end items without navigation (`FR-064`, `BR-022`).
- **Externally Implemented & Integrated**: **1 screen** (1.4%) (`PUB-001` in Next.js `cm-website`)
- **Screens Requiring New Implementation**: **41 screens** (55.4%)

### Priority Breakdown
- **P0 Screens (Core MVP)**: **49 screens** (18 implemented/partial, 1 external, 30 missing/to build)
- **P1 Screens (Execution Simulation)**: **13 screens** (2 partial, 11 missing/to build)
- **P2 Screens (Post-Selection & Support)**: **12 screens** (0 complete, 12 missing/to build)

---

## 3. Implementation Reuse & Refactoring Strategy

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ REUSE VS REFACTOR VS BUILD STRATEGY                                                    │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ KEEP UNCHANGED:                                                                        │
│ • ProfilePage.tsx (FL-002 personal profile UI)                                         │
│ • NotFound.tsx (SHARED-002)                                                            │
│ • ProjectDetailPage.tsx (FL-007 detail presentation)                                  │
│                                                                                        │
│ REFACTOR & EXTEND (Theme, Validation & Modular State Hookup):                          │
│ • ProfilePage.tsx & PortfolioEditor.tsx (FL-003, FL-004): Add configurable client      │
│   media validation (NFR-10, DEC-02) and member contribution tags (BR-027) via TSK-007A.│
│ • FreelancerHomePage.tsx (FL-006): Connect to modular domain hooks.                    │
│ • ProjectApplyDialog.tsx (FL-008): Add Team selector, dispatch candidate to state.     │
│ • LoginPage.tsx, RegisterPage.tsx (AUTH-001, AUTH-002): Add session redirection.       │
│ • BusinessPrototype.tsx: Decompose into feature pages & replace .fb-* with MUI tokens. │
│                                                                                        │
│ CORRECT CRITICAL BUSINESS INVARIANTS:                                                  │
│ • Build BUS-013 Approval Modal and gate PROJ-001 chat behind explicit candidate        │
│   approval (BR-012, BR-013, FR-031, FR-045).                                           │
│ • Enforce 7-day countdown on invitations (FR-019, BR-024) and 3-day countdown on       │
│   agreement proposals (FR-032, BR-024).                                                │
│ • Enforce candidate Under Review status upon invitation acceptance (BR-005).           │
│ • Preserve active agreement version until replacement confirmed (FR-048).              │
│ • Mutual milestone revision allowances without fixed 2-round cap (DEC-03, BR-014).    │
│ • Wire NotificationsBell.tsx to reactive domain notification events.                   │
│                                                                                        │
│ BUILD FROM SCRATCH / INTEGRATE:                                                        │
│ • Independent Next.js Landing Integration (PUB-001 via TSK-003 navigation links) and   │
│   Guest Project Discovery (PUB-002, PUB-003).                                          │
│ • Freelancer Invitation Hub (FL-010, FL-011).                                          │
│ • Team Profile & Roster (TEAM-001, TEAM-002, TEAM-003, TEAM-004 per FR-063, BR-020).    │
│ • Two-Sided Project Workspace & Flexible Milestone Tracker (WORK-001 to WORK-008).      │
│ • Simulated Payments & Disbursements (PAY-001 to PAY-005 per DEC-04).                  │
│ • Post-project Reviews & Reputation (REV-001, REV-002 per BR-016, DEC-08).             │
│ • Admin Moderation Queue (ADMIN-001 to ADMIN-004).                                     │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Authoritative Requirements Traceability Matrix

### 4.1 Functional Requirements (FR-001 to FR-064)
*(Note: FR-009 is an intentional numbering gap in the SRS; FR-065 is not defined in SRS)*

- **FR-001 (Registration & Role Selection)**: Traced to `AUTH-001`, `RegisterPage.tsx`. Covered in Phase 0 (`TSK-002`).
- **FR-002 (Login & Logout)**: Traced to `AUTH-002`, `LoginPage.tsx`. Covered in Phase 0 (`TSK-002`).
- **FR-003 (Account Information)**: Traced to `SET-001`. Covered in Phase 4 (`TSK-017`).
- **FR-004 (Role-Based Access Control)**: Traced to `SHARED-001`, `RoleGuard.tsx`. Covered in Phase 0 (`TSK-002`).
- **FR-005 (Password Recovery)**: Traced to `AUTH-003`, `ForgotPasswordPage.tsx`. Covered in Phase 0 (`TSK-002`).
- **FR-006 (Profile Editing)**: Traced to `FL-002`, `ProfilePage.tsx`, `EditProfileDialog.tsx`. Complete.
- **FR-007 (Skills Management)**: Traced to `FL-002`, `ProfilePage.tsx`. Complete.
- **FR-008 (Portfolio Management)**: Traced to `FL-003`, `FL-004`, `PortfolioEditor.tsx`. Extended in Phase 1 (`TSK-007A`).
- **FR-010 (CV Management)**: Traced to `FL-005`. Covered in Phase 1 (`TSK-007`).
- **FR-011 (Profile Availability & Rates)**: Traced to `FL-002`. Complete.
- **FR-012 (Create Project Brief)**: Traced to `BUS-003`. Covered in Phase 1 (`TSK-004`).
- **FR-013 (Draft Brief Storage)**: Traced to `BUS-003`. Covered in Phase 1 (`TSK-004`).
- **FR-014 (Publish Brief)**: Traced to `BUS-004`. Covered in Phase 1 (`TSK-004`).
- **FR-015 (Brief Modification)**: Traced to `BUS-003`, `BUS-005`. Covered in Phase 1 (`TSK-004`).
- **FR-016 (Project Cancellation)**: Traced to `BUS-006`. Covered in Phase 1 (`TSK-004`).
- **FR-017 (Matching Suggestions)**: Traced to `BUS-007`, `BUS-014`. Covered in Phase 1 (`TSK-005`).
- **FR-018 (Explainable Criteria)**: Traced to `BUS-008`, `BUS-015`. Covered in Phase 1 (`TSK-005`).
- **FR-019 (Send Invitation)**: Traced to `BUS-009`. Enforces 7-day expiry per `BR-024`. Covered in Phase 1 (`TSK-006`).
- **FR-020 (Respond to Invitation)**: Traced to `FL-010`, `FL-011`. Enforces 7-day expiry per `BR-024`. Covered in Phase 1 (`TSK-006`).
- **FR-021 (Track Invitations)**: Traced to `BUS-010`. Covered in Phase 1 (`TSK-006`).
- **FR-022 (Cancel Invitation)**: Traced to `BUS-010`. Covered in Phase 1 (`TSK-006`).
- **FR-023 (Search Projects)**: Traced to `FL-006`. Complete (`TSK-007`).
- **FR-024 (Filter Projects)**: Traced to `FL-006`, `ProjectFilters.tsx`. Complete (`TSK-007`).
- **FR-025 (Project Detail View)**: Traced to `FL-007`, `PUB-003`. Complete (`TSK-003`, `TSK-007`).
- **FR-026 (Apply as Individual or Team)**: Traced to `FL-008`, `AUTH-004`, `TEAM-004`. Covered in Phase 1 (`TSK-007`, `TSK-012`).
- **FR-027 (Proposal Formulation)**: Traced to `FL-008`, `ProjectApplyDialog.tsx`. Covered in Phase 1 (`TSK-007`).
- **FR-028 (Track & Withdraw Application)**: Traced to `FL-009`, `FL-012`. Covered in Phase 1 (`TSK-007`).
- **FR-029 (Single Candidate Record per Account)**: Traced to `BUS-011`, domain hooks. Covered in Phase 1 (`TSK-007`).
- **FR-030 (Review Proposals & CV)**: Traced to `BUS-011`, `BUS-012`. Covered in Phase 1 (`TSK-007`).
- **FR-031 (Approve / Reject Candidate)**: Traced to `BUS-013`. Mandatory gating modal. Covered in Phase 2 (`TSK-008`).
- **FR-032 (Agreement Proposal & Confirmation)**: Traced to `PROJ-003`, `PROJ-004`. Enforces 3-day countdown per `BR-024`. Covered in Phase 2 (`TSK-010`).
- **FR-033 (Selection Closes Other Applicants)**: Traced to `PROJ-006`, `FL-013`. Covered in Phase 2 (`TSK-011`).
- **FR-034 (AI Profile Evaluation — Criteria Alignment)**: Traced to `BUS-015`. Prototype simulation. Covered in Phase 1 (`TSK-005`).
- **FR-035 (AI Profile Evaluation — Evidence Extraction)**: Traced to `BUS-015`. Prototype simulation. Covered in Phase 1 (`TSK-005`).
- **FR-036 (AI Profile Evaluation — Fit Score Breakdown)**: Traced to `BUS-015`. Prototype simulation. Covered in Phase 1 (`TSK-005`).
- **FR-037 (Project Workspace)**: Traced to `WORK-001`. Covered in Phase 3 (`TSK-013`).
- **FR-038 (Submit Deliverables)**: Traced to `WORK-004`. Covered in Phase 3 (`TSK-014`).
- **FR-039 (Milestone Tracking)**: Traced to `WORK-002`, `WORK-003`. Flexible execution per `BR-025`. Covered in Phase 3 (`TSK-013`).
- **FR-040 (Project Completion)**: Traced to `WORK-006`. Covered in Phase 3 (`TSK-014`).
- **FR-041 (Submit Post-Project Review)**: Traced to `REV-001`. Covered in Phase 3 (`TSK-016`).
- **FR-042 (Public Reputation Score)**: Traced to `REV-002`. Covered in Phase 3 (`TSK-016`).
- **FR-043 (Admin Account Overview & Action)**: Traced to `ADMIN-001`, `ADMIN-002`. Covered in Phase 4 (`TSK-018`).
- **FR-044 (Admin Moderation Queue)**: Traced to `ADMIN-003`, `ADMIN-004`. Covered in Phase 4 (`TSK-018`).
- **FR-045 (In-App Project Chat)**: Traced to `PROJ-001`. Gated behind candidate approval per `BR-012`. Covered in Phase 2 (`TSK-009`).
- **FR-046 (Chat Message History & Read-Only Post-Closure)**: Traced to `PROJ-001`, `PROJ-002`. Covered in Phase 2 (`TSK-009`).
- **FR-047 (Structured Agreement Content)**: Traced to `PROJ-003`, `PROJ-004`. Covered in Phase 2 (`TSK-010`).
- **FR-048 (Agreement Versioning & Active Invariant)**: Traced to `PROJ-005`, `WORK-007`. Preserves active version until replacement confirmed. Covered in Phase 2 (`TSK-010`).
- **FR-049 (Milestone Status Transitions)**: Traced to `WORK-002`, `WORK-003`. Covered in Phase 3 (`TSK-013`).
- **FR-050 (Deliverable History)**: Traced to `WORK-004`. Covered in Phase 3 (`TSK-014`).
- **FR-051 (Acceptance & Revision Requests)**: Traced to `WORK-005`. Requires reason per `BR-014`; tracks agreed revision allowance per `DEC-03`. Covered in Phase 3 (`TSK-014`).
- **FR-052 (Deliverable Submission Deadline)**: Traced to `WORK-004`, `WORK-008`. Covered in Phase 3 (`TSK-014`).
- **FR-053 (Project Closure Upon Final Acceptance)**: Traced to `WORK-006`. Covered in Phase 3 (`TSK-014`).
- **FR-054 (Review Eligibility)**: Traced to `REV-001`. Prototype simulation without arbitrary deadlines per `BR-016`. Covered in Phase 3 (`TSK-016`).
- **FR-055 (Display Public Reviews)**: Traced to `REV-002`. Requires valid completed project. Covered in Phase 3 (`TSK-016`).
- **FR-056 (Milestone Funding Simulation)**: Traced to `PAY-001`, `PAY-002`. Displays agreed amount; fees as "Chưa xác định" per `DEC-04`. Covered in Phase 3 (`TSK-015`).
- **FR-057 (Fund Hold Status)**: Traced to `PAY-001`. Covered in Phase 3 (`TSK-015`).
- **FR-058 (Disbursement Simulation)**: Traced to `PAY-003`. Covered in Phase 3 (`TSK-015`).
- **FR-059 (Payment Failure Handling Simulation)**: Traced to `PAY-004`. Covered in Phase 3 (`TSK-015`).
- **FR-060 (Transaction History Simulation)**: Traced to `PAY-003`. Covered in Phase 3 (`TSK-015`).
- **FR-061 (Payment Data Compliance)**: Traced to `PAY-001`–`PAY-005`. No sensitive payment credentials stored. Covered in Phase 3 (`TSK-015`).
- **FR-062 (Financial & Tax Reporting Standard)**: Traced to `PAY-003`, `ADMIN-001`. Covered in Phase 3 & 4 (`TSK-015`, `TSK-018`).
- **FR-063 (Team Profile, Roster & Single Leader Operation)**: Traced to `TEAM-001`–`TEAM-005`. Covered in Phase 3 (`TSK-012`).
- **FR-064 (In-App & Email Notifications)**: Traced to `NOTIF-001`, `NOTIF-002`, `NOTIF-003`. Covered in Phase 2 & 4 (`TSK-011`, `TSK-017`).

### 4.2 Business Rules (BR-001 to BR-028)
- **BR-001 (Brief Executor Preference)**: Enforced in `BUS-003`.
- **BR-002 (Brief Publication Preconditions)**: Enforced in `BUS-004`.
- **BR-003 (Proposal Identity Immutability)**: Enforced in `FL-008` & `mockStorage.ts`.
- **BR-004 (Matching Based on Published Criteria)**: Enforced in `BUS-007`.
- **BR-005 (Candidate Review Status on Invitation Acceptance)**: Accepting sets status to `Chờ Business xem xét` (`FL-011`, `BUS-011`). Does not grant chat or negotiation.
- **BR-006 (One Candidate Record per Account/Project)**: Enforced in `mockStorage.ts` & domain hooks.
- **BR-007 (Freelancer Active Proposals Limit)**: Enforced in `FL-008`.
- **BR-008 (Invitation Only for Published Projects)**: Enforced in `BUS-009`.
- **BR-009 (Invitation Cancellation Before Response)**: Enforced in `BUS-010`.
- **BR-010 (Freelancer Proposal Withdrawal)**: Enforced in `FL-012`.
- **BR-011 (Application & Invitation Source Merging)**: Enforced in `BUS-011`.
- **BR-012 (Gated Chat Requires Explicit Business Approval)**: Enforced via `BUS-013` & `PROJ-001`.
- **BR-013 (Chat Scoped to Candidate & Project)**: Enforced in `PROJ-001`.
- **BR-014 (Revision Request Criteria)**: Enforced in `WORK-005`. Requires stating unmet criteria; tracks agreed revision allowance (`DEC-03`).
- **BR-015 (Agreement Requires Mutual Confirmation)**: Enforced in `PROJ-004`.
- **BR-016 (Review Policy)**: Prototype allows 1–5 star ratings upon project completion without unapproved 14-day deadlines. Production policy unresolved.
- **BR-017 (Simulated Payment Notice Disclaimers)**: Enforced in `PAY-001`–`PAY-005`.
- **BR-018 (Refund Request Scenario)**: Enforced in `PAY-005` (concept only).
- **BR-019 (Project Cancellation Invariants)**: Enforced in `BUS-006`.
- **BR-020 (Team Leader Sole Operational Authority)**: Enforced in `TEAM-001`–`TEAM-004`.
- **BR-021 (Team Member Portfolio Attribution)**: Enforced in `TEAM-003`.
- **BR-022 (Notification Triggers for Key Events)**: Enforced in `NOTIF-001`–`NOTIF-002`.
- **BR-023 (Confirmation Closes Recruitment)**: Agreement confirmation transitions project to `Đã đóng tuyển` (`PROJ-006`, `FL-013`).
- **BR-024 (Recruitment & Agreement Expiration Timelines)**: Invitations expire after **7 days** (`FR-019`); agreement proposals expire after **3 days** (`FR-032`).
- **BR-025 (Flexible Milestone Progression)**: Flexible execution across milestones without rigid sequential blocking.
- **BR-026 (Matching Recommendations Transparent Rationale)**: Enforced in `BUS-007`, `BUS-008`.
- **BR-027 (Attribution of Member Contributions)**: Explicit individual contribution tags on team portfolio works (`TEAM-003`, `FL-003`, `FL-004`).
- **BR-028 (Candidate Deduplication in Matching)**: Deduplication between matching suggestions, applications, and invitations (`BUS-007`).
