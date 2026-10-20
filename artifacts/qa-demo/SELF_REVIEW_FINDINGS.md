# FREVO Frontend — Autonomous Visual Self-Review & Defect Register

**Date:** 2026-10-19  
**Review Lead:** Senior UI/UX Quality Reviewer & Frontend Architect  
**Scope:** Visual inspection of extracted video frames, live browser exploratory testing, business rule verification, and responsive audit.  
**Total Identified Defects:** 8 (2 Critical, 3 High, 3 Medium, 0 Low)  

---

## 1. Executive Summary & Defect Log

Following real-frame extraction and live application inspection, several critical discrepancies between the recorded video, live DOM state, and documented requirements were discovered. In particular, an asynchronous route timing bug in the automation runner caused Scenarios D–G in the primary demo video to display "Không tìm thấy dự án tương ứng" and "Không tìm thấy không gian làm việc", while font encoding in OpenCV destroyed Vietnamese subtitles.

All identified defects are documented below with exact frame timestamps, root cause analyses, and test criteria before proceeding with systematic fixes.

| Issue ID | Severity | Screen ID | Requirement / Rule | Video & Timestamp | Route | Description |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **DEF-001** | **Critical** | AGR-001, WRK-001 | FR-032, FR-048, FR-049 | `FREVO_E2E_MAIN_FLOW_DEMO.mp4` [01:46 - 02:40] | `/projects/new/agreement`, `/workspace/new` | Asynchronous navigation race condition caused project ID to resolve to `"new"`, rendering 404/Empty Error screens for the entire second half of the main demo video. |
| **DEF-002** | **Critical** | Global / Storage | Architecture, Mock DB | All Videos | Storage Adapter | `mockStorage.ts` utilized `sessionStorage` with key `'frevo_marketplace_data_v2'`, whereas external test automation scripts attempted to seed `'frevo_mock_storage_v1'` in `localStorage`. Cross-tab state and automated seeding failed silently. |
| **DEF-003** | **High** | AUTH-001, Global | Product Policy, Acceptance Criteria | All Videos [All Frames] | All Pages | Developer `DemoController` bar (`FREVO DEMO CONTROLLER`) was permanently floating in the bottom-right corner, overlapping content, cards, and modal actions. `LoginPage.tsx` exposed one-click shortcut chips. |
| **DEF-004** | **High** | Global (Video) | Video Quality, Vietnamese Typo | All Videos [All Frames] | Video Overlay | OpenCV's default `cv2.putText` only supports basic ASCII, corrupting Vietnamese UTF-8 characters in subtitle banners into question marks (e.g., `????ng xu????t`, `Thi????t k??? b???`). |
| **DEF-005** | **High** | PUB-002, TAL-001, RESP-001 | Responsive Design, Usability | `FREVO_RESPONSIVE_UI_DEMO.mp4` [00:04s, 00:13s] | `/projects`, `/team/profile` | Header navigation on Mobile (375px/390px) and Tablet (768px) lacked responsive collapsing, causing navigation links to break into awkward vertical word fragments (`Khám`, `phá`, `dự`, `án`) and push the logo off-screen. |
| **DEF-006** | **Medium** | REV-001, PAY-001 | FR-054, BR-016 | `FREVO_EXTENDED_WORKFLOW_DEMO.mp4` [00:09s, 00:18s] | `/reviews/:id`, `/payments/:id` | `ProjectReviewPage.tsx` and `PaymentLedgerPage.tsx` fell back to `projects[0]` and `agreements[0]` (Hà Vy / Trà Cỏ Mây) instead of accurately resolving the active project's selected talent (Minh Anh / Cát Mộc). |
| **DEF-007** | **Medium** | BUS-001 | User Permissions, Security | `FREVO_E2E_MAIN_FLOW_DEMO.mp4` [00:26s] | `/business/*` | Business navigation sidebar contained an ad-hoc shortcut link `"Chuyển sang Freelancer Hub"` that arbitrarily flipped user roles without standard authentication. |
| **DEF-008** | **Medium** | BUS-001, Layout | Usability, Navigation | `FREVO_E2E_MAIN_FLOW_DEMO.mp4` [00:26s] | `/business/*` | `.fb-sidebar` lacked `overflow-y: auto`, causing the `TÀI KHOẢN` and `Đăng xuất` section to be pushed below the fold and cut off on viewport heights $\le 800\text{px}$. |

---

## 2. Detailed Defect Investigations

### DEF-001: Video 1 Scenario D–G Navigation Race Condition & 404 Empty Screen
- **Severity:** Critical
- **Screen IDs:** AGR-001 (`ProjectAgreementPage`), WRK-001 (`WorkspaceOverviewPage`)
- **Requirement:** FR-032 (Agreement Proposal), FR-048 (Agreement Confirmation), FR-049 (Workspace Overview)
- **Video Timestamp:** `FREVO_E2E_MAIN_FLOW_DEMO.mp4` at `01:46` (`t106s.jpg`), `02:13` (`t133s.jpg`)
- **Actual Behavior:** After clicking "Công bố dự án", the script read `window.location.pathname.split("/").pop()` before Vite's client-side router transition completed. The project ID was recorded as `"new"`. The script subsequently navigated to `/projects/new/agreement` and `/workspace/new`. The user saw empty warning messages:
  - *"Không tìm thấy dự án tương ứng."* (Frame `t106s.jpg`)
  - *"Không tìm thấy không gian làm việc hoặc dự án chưa có hợp đồng xác nhận."* (Frame `t133s.jpg`)
- **Expected Behavior:** Navigation must wait until the URL updates to `/business/projects/:projectId` with a valid ID, and subsequent agreement, chat, workspace, and payment scenarios must bind to this exact project ID.
- **Root Cause:** Asynchronous timing gap between `navigate()` and URL polling in `record_main_flow.py`.
- **Correction:** Implement a synchronous URL poll waiting for `pathname.includes('/projects/') && !pathname.endsWith('/new')`, extract the real ID from reactive state, and bind all downstream actions to that project.
- **Retest Criteria:** Video 1 must show the actual Agreement Proposal v1 form, mutual confirmation, project transition to `ongoing`, Milestone timeline, Figma deliverable link submission, and revision request dialog.

---

### DEF-002: Storage Adapter Key & Mechanism Mismatch
- **Severity:** Critical
- **Screen IDs:** Global Data Layer
- **Requirement:** System Architecture, Data Synchronization across tabs
- **Actual Behavior:** `mockStorage.ts` was implemented using `sessionStorage` with key `'frevo_marketplace_data_v2'`. Any attempt by external automation or multi-tab flows to modify `localStorage` had no effect on the application.
- **Expected Behavior:** `mockStorage.ts` must use `localStorage` as its primary persistence engine so that data persists reliably across tabs, reloads, and external automation commands. It should also expose `window.__frevo_storage__` for reliable script interaction.
- **Root Cause:** Inconsistent storage mechanism (`sessionStorage` vs `localStorage`) and mismatched key naming.
- **Correction:** Update `mockStorage.ts` to utilize `localStorage` with fallback, and expose `window.__frevo_storage__`.
- **Retest Criteria:** Data seeded or modified via script or across tabs reflects instantly in the UI with zero stale data.

---

### DEF-003: Unprofessional Floating `DemoController` & One-Click Login Chips
- **Severity:** High
- **Screen IDs:** Global (`App.tsx`), AUTH-001 (`LoginPage.tsx`)
- **Requirement:** Product Polish, Production-Grade Authenticated Experience
- **Video Timestamp:** Present across all frames (e.g. `FREVO_E2E_MAIN_FLOW_DEMO_t013s.jpg`, `t026s.jpg`)
- **Actual Behavior:** A fixed dark floating widget `FREVO DEMO CONTROLLER` sat at the bottom-right on every screen, covering action buttons and cards. The login page displayed one-click shortcut chips underneath the login form.
- **Expected Behavior:** The application must present a clean, production-like interface without floating debug overlays. The login page must require typed credentials as the primary workflow.
- **Root Cause:** `DemoController` was rendered unconditionally in `App.tsx`, and `LoginPage.tsx` rendered quick access chips without a feature flag.
- **Correction:** Render `DemoController` only if `localStorage.getItem('frevo_dev_mode') === 'true'` (defaulting to hidden). Demote or hide one-click login chips on `LoginPage.tsx`.
- **Retest Criteria:** Screenshots and videos must be completely free of floating debug banners and one-click shortcut widgets.

---

### DEF-004: Video Subtitle Font Mangling Vietnamese UTF-8 Diacritics
- **Severity:** High
- **Screen IDs:** Video Recording Overlay
- **Requirement:** Video Presentation Standards, Localization Integrity
- **Video Timestamp:** Present on all frames in `FREVO_E2E_MAIN_FLOW_DEMO.mp4`
- **Actual Behavior:** Subtitle text contained `????` for Vietnamese characters (e.g., `????ng xu????t`, `Thi????t k??? b??? nh???n di???n`).
- **Expected Behavior:** Subtitles must render crisp, readable Vietnamese UTF-8 text with correct tone marks and diacritics.
- **Root Cause:** OpenCV `cv2.putText` only supports ASCII Latin glyphs.
- **Correction:** In `demo_recorder_core.py`, render subtitle banners using Pillow (`PIL.ImageDraw` and TrueType font `segoeui.ttf` or `arial.ttf`) before writing to `VideoWriter`.
- **Retest Criteria:** Re-recorded videos must display 100% legible, error-free Vietnamese subtitles.

---

### DEF-005: Mobile & Tablet Header Navigation Layout Breakage
- **Severity:** High
- **Screen IDs:** PUB-002, TAL-001, RESP-001
- **Requirement:** Responsive Web Design, WCAG Usability
- **Video Timestamp:** `FREVO_RESPONSIVE_UI_DEMO.mp4` at `00:04s` (`t004s.jpg`), `00:13s` (`t013s.jpg`)
- **Actual Behavior:** In `FreelancerHeader.tsx`, navigation links ("Khám phá dự án", "Lời mời", "Đã ứng tuyển", "Nhóm (Team)", "Trang giới thiệu") were rendered in a rigid horizontal flex container without wrapping or mobile hiding, breaking into single-letter vertical stacks on viewports $\le 768\text{px}$.
- **Expected Behavior:** Header navigation must gracefully collapse on mobile/tablet viewports, hiding secondary links and providing a clean, non-overflowing bar.
- **Root Cause:** Lack of responsive breakpoints (`md:flex`, `hidden`) in `FreelancerHeader.tsx`.
- **Correction:** Add responsive Tailwind/CSS rules to `FreelancerHeader.tsx`: hide secondary links on mobile (`hidden md:flex`), keep logo and primary action accessible.
- **Retest Criteria:** In mobile (375px/390px) and tablet (768px), the header maintains clean spacing with no clipped text or awkward wrapping.

---

### DEF-006: Inaccurate Talent & Project Fallback on Review and Payment Pages
- **Severity:** Medium
- **Screen IDs:** REV-001 (`ProjectReviewPage`), PAY-001 (`PaymentLedgerPage`)
- **Requirement:** FR-054 (Review Policy), FR-052 (Payment Ledger)
- **Video Timestamp:** `FREVO_EXTENDED_WORKFLOW_DEMO.mp4` at `00:09s`, `00:18s` (`t018s.jpg`)
- **Actual Behavior:** Review dialog showed *"Đánh giá hợp tác với Hà Vy"* and payment ledger showed *"Bộ bao bì cho ba vị trà"* even when viewing project `prj-catmoc` (Cát Mộc Eco-Resort with Minh Anh).
- **Expected Behavior:** The review and payment pages must resolve the talent strictly from the project's `selectedTalentId` and confirmed agreement.
- **Root Cause:** Fallback to `projects[0]` and `agreements[0]` when array lookup failed.
- **Correction:** Ensure strict lookup by `projectId`, properly checking `project.selectedTalentId` and `effectiveAgreement?.talentId`.
- **Retest Criteria:** When reviewing Cát Mộc Eco-Resort, the dialog reads *"Đánh giá hợp tác với Minh Anh"*.

---

### DEF-007: Ad-Hoc Role Switcher Link in Business Sidebar
- **Severity:** Medium
- **Screen ID:** BUS-001 (`BusinessLayout.tsx`)
- **Requirement:** Clean Session Management, Usability
- **Video Timestamp:** `FREVO_E2E_MAIN_FLOW_DEMO.mp4` at `00:26s` (`t026s.jpg`)
- **Actual Behavior:** Sidebar contained a link: *"Chuyển sang Freelancer Hub"*.
- **Expected Behavior:** Role switching should only occur via standard authentication (Logout -> Login).
- **Root Cause:** Hardcoded navigation link in `BusinessLayout.tsx`.
- **Correction:** Remove the shortcut link from `BusinessLayout.tsx`.
- **Retest Criteria:** Business sidebar shows only legitimate Business navigation.

---

### DEF-008: Sidebar Height Clipping Logout Button on Shorter Viewports
- **Severity:** Medium
- **Screen ID:** BUS-001 (`business.css`, `BusinessLayout.tsx`)
- **Requirement:** Usability, Accessibility
- **Video Timestamp:** `FREVO_E2E_MAIN_FLOW_DEMO.mp4` at `00:26s`
- **Actual Behavior:** `.fb-sidebar` had `height: 100dvh` without `overflow-y: auto`, clipping the `TÀI KHOẢN` and `Đăng xuất` section on viewports $\le 800\text{px}$.
- **Expected Behavior:** Sidebar must be scrollable if its content exceeds the viewport height.
- **Root Cause:** Missing `overflow-y: auto; overflow-x: hidden;` in `.fb-sidebar`.
- **Correction:** Add `overflow-y: auto; overflow-x: hidden;` to `.fb-sidebar`.
- **Retest Criteria:** On any screen height, the sidebar can be scrolled to view and click the Logout button.
