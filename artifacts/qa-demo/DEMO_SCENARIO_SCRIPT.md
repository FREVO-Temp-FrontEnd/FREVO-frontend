# FREVO Frontend — End-to-End Demo Scenario Script

**Test Suite:** Production-Grade Marketplace UI End-to-End Walkthrough  
**Target Application:** FREVO Marketplace (React 19 + TypeScript + Vite 7)  
**Execution Environment:** Headless Chrome 155 via DevTools Protocol (CDP)  
**Actors:**
- **Business Client:** Nắng Studio (`contact@nangstudio.vn`)
- **Freelancer / Creative Talent:** Minh Anh (`minhanh.design@frevo.vn`)
- **Creative Team Representative:** PixelCraft Studio (`contact@pixelcraft.vn`)
- **Platform Administrator:** FREVO Operations Team (`admin@frevo.vn`)

---

## Part 1: Main Marketplace Flow (Video 1: Scenarios A–G)

### Scenario A: Authentication, Form Validation & Business Dashboard
- **Target Route:** `/login` -> `/business`
- **Actor:** Business Client (Nắng Studio)
- **Step 1 (Form Validation):**
  - Type email: `contact@nangstudio.vn`.
  - Type invalid password: `wrongpassword`.
  - Click button **Đăng nhập**.
  - **Banner:** `FREVO E2E QA | Scenario A: Validation Error Banner Triggered`
  - **Expected Result:** Red alert banner appears: *"Email hoặc mật khẩu không chính xác. Vui lòng thử lại."*
- **Step 2 (Successful Login):**
  - Clear and type valid password: `password123`.
  - Click button **Đăng nhập**.
  - **Banner:** `FREVO E2E QA | Scenario A: Business Dashboard Overview`
  - **Expected Result:** Navigate to `/business`. Smooth scroll displaying active projects, metrics overview, and quick creation action.
- **Step 3 (Logout Accessibility Check):**
  - Demonstrate newly added **Đăng xuất** buttons in both the persistent sidebar footer and topbar header.

---

### Scenario B: Create Project Brief & Direct Navigation
- **Target Route:** `/business/projects/new` -> `/business/projects/:projectId`
- **Actor:** Business Client
- **Step 1 (Form Validation Trigger):**
  - Click **Tạo dự án mới**.
  - Click **Công bố dự án** without filling fields.
  - **Banner:** `FREVO E2E QA | Scenario B: Validation Check (FR-012)`
  - **Expected Result:** Validation warning appears requiring project title, description, skills, budget, and deliverables before publication per FR-012.
- **Step 2 (Typing Project Details):**
  - Title: `Thiết kế bộ nhận diện thương hiệu Cát Mộc Eco-Resort`.
  - Category: `Thiết kế thương hiệu`.
  - Description: `Xây dựng hệ thống nhận diện thương hiệu hoàn chỉnh gồm logo, typography và ấn phẩm truyền thông cho khu nghỉ dưỡng sinh thái Cát Mộc.`
  - Skills: `Brand identity, Logo design, Packaging, Typography`.
  - Deliverables:
    - `Logo chính và biến thể`
    - `Bảng quy chuẩn màu sắc và kiểu chữ`
    - `Bộ ấn phẩm nhận diện và bao bì sản phẩm`
  - Budget: `20-25 triệu VND`.
  - Deadlines: Project: `30/11/2026`, Application: `15/11/2026`.
  - Preference: `Cả hai` (Individual & Team per BR-001).
- **Step 3 (Publishing & Direct Route):**
  - Click **Công bố dự án**.
  - **Banner:** `FREVO E2E QA | Scenario B: Project Created Successfully`
  - **Expected Result:** Project state is saved reactively into `useBusiness()` and navigates immediately to `/business/projects/:projectId` without any 404 fallback. Complete brief summary rendered with status `Đang mở nhận hồ sơ` (`open`).

---

### Scenario C: Talent Matching & 7-Day Invitation Expiration
- **Target Route:** `/business/projects/:projectId` (Tabs: Gợi ý ứng viên / Lời mời đã gửi)
- **Actor:** Business Client
- **Step 1 (Candidate Exploration):**
  - Switch to tab **Gợi ý ứng viên** (`CandidateSuggestionsTab`).
  - **Banner:** `FREVO E2E QA | Scenario C: AI Candidate Suggestions (DEC-01)`
  - **Expected Result:** Talent cards ranked by heuristic matching score (e.g. Minh Anh - Senior Brand Designer, Match 95%).
- **Step 2 (Sending 7-Day Invitation):**
  - Click **Gửi lời mời** on candidate Minh Anh.
  - `SendInvitationDialog` opens.
  - **Banner:** `FREVO E2E QA | Scenario C: Send 7-Day Invitation (FR-019, BR-024)`
  - Type note: `Chào Minh Anh, studio của chúng tôi rất ấn tượng với phong cách nhận diện của bạn và muốn mời bạn tham gia dự án Cát Mộc.`
  - Click **Gửi lời mời (7 ngày)**.
- **Step 3 (Tracking Expiration Badge):**
  - Switch to tab **Lời mời đã gửi** (`SentInvitationsTab`).
  - **Banner:** `FREVO E2E QA | Scenario C: Tracking Sent Invitation (FR-019)`
  - **Expected Result:** Invitation displayed with active countdown badge: `Thời hạn phản hồi: 7 ngày` per FR-019 / BR-024.

---

### Scenario D: Freelancer Application, Candidate Review & Gated Chat
- **Target Route:** `/freelancer/invitations` -> `/business/projects/:id` -> `/projects/:id/chat`
- **Actors:** Freelancer (Minh Anh) & Business Client (Nắng Studio)
- **Step 1 (Logout via New Button):**
  - Click **Đăng xuất** button in Business layout.
  - **Banner:** `FREVO E2E QA | Scenario D: Logout & Switch Identity`
- **Step 2 (Freelancer Login & Application):**
  - Login as `minhanh.design@frevo.vn` (`password123`).
  - Navigate to `/freelancer/invitations`.
  - Submit application proposal with quote `20.000.000 đ` and duration `21 ngày`.
- **Step 3 (Business Candidate Review & Chat Gating):**
  - Logout and login back as Business (`contact@nangstudio.vn`).
  - Navigate to project applicants tab (`ProjectApplicantsTab`).
  - Observe candidate card: Chat badge indicates `Chat đang khóa (BR-012)` until Business approval.
  - Click **Duyệt mở chat** button.
  - **Banner:** `FREVO E2E QA | Scenario D: Business Approves & Unlocks Chat (BR-005, BR-012)`
  - Status updates to `Đã mở chat`.
- **Step 4 (Project Chat Messaging):**
  - Click **Vào phòng chat** -> routes to `/projects/:projectId/chat`.
  - **Banner:** `FREVO E2E QA | Scenario D: Gated Project Chat Active (FR-045, FR-046)`
  - Type message: `Chào Minh Anh, rất vui được kết nối! Chúng tôi muốn chia dự án thành 2 giai đoạn: Logo Concept và Brand Guidelines.`
  - Click **Gửi**. Message renders dynamically in the conversation stream with sender identity and timestamp.

---

### Scenario E: Agreement Proposal & Confirmation
- **Target Route:** `/projects/:projectId/agreement`
- **Actors:** Business Client & Freelancer
- **Step 1 (Proposal Creation):**
  - Navigate to Agreement page.
  - **Banner:** `FREVO E2E QA | Scenario E: Agreement Proposal (FR-032, FR-048, DEC-03)`
  - Verify proposal expiration period: **3 ngày** (FR-032).
  - Verify mutually agreed milestone revisions: **Tối đa 2 lần chỉnh sửa (thỏa thuận)** per DEC-03.
  - Click **Gửi đề xuất hợp đồng**. Version `v1` is created.
- **Step 2 (Mutual Agreement Confirmation):**
  - Freelancer signs and confirms agreement terms.
  - **Banner:** `FREVO E2E QA | Scenario E: Confirming Agreement & Project State Transition`
  - **Expected Result:** Agreement confirmed. Project status transitions to `ongoing`. Workspace is unlocked.

---

### Scenario F: Collaborative Workspace & Deliverable Submission
- **Target Route:** `/workspace/:projectId`
- **Actor:** Freelancer (Minh Anh)
- **Step 1 (Workspace Overview):**
  - Navigate to project workspace.
  - **Banner:** `FREVO E2E QA | Scenario F: Project Workspace (FR-049)`
  - Milestone timeline rendered: Milestone 1 `Logo Concept & Moodboard` (In Progress).
- **Step 2 (Deliverable Submission):**
  - Click **Nộp sản phẩm bàn giao**.
  - **Banner:** `FREVO E2E QA | Scenario F: Freelancer Submitting Deliverables (FR-049)`
  - Enter deliverable link: `https://figma.com/@minhanh/cat-moc-eco-resort-v1`.
  - Enter submission notes: `Bàn giao 3 concept logo theo moodboard sinh thái tự nhiên.`
  - Submit deliverable. Milestone status updates to `Chờ duyệt` (`submitted`).

---

### Scenario G: Revision Request & Milestone Approval
- **Target Route:** `/workspace/:projectId`
- **Actor:** Business Client
- **Step 1 (Revision Request):**
  - Business clicks **Đánh giá bàn giao** -> **Yêu cầu chỉnh sửa**.
  - **Banner:** `FREVO E2E QA | Scenario G: Milestone Review & Revision Request (DEC-03)`
  - Enter mandatory revision reason: `Vui lòng tăng sắc độ xanh lá đậm hơn 10% ở Concept 2 và bổ sung bản âm bản monochrome.`
  - Confirm revision.
- **Step 2 (Revision Counter Verification):**
  - **Banner:** `FREVO E2E QA | Scenario G: Revision Counter Decremented (DEC-03)`
  - Status updates to `Đang chỉnh sửa (Lần 1/2)`.
- **Step 3 (Resubmission & Final Acceptance):**
  - Freelancer submits revision `https://figma.com/@minhanh/cat-moc-eco-resort-v2`.
  - Business reviews updated deliverable and clicks **Nghiệm thu bàn giao**.
  - **Banner:** `FREVO E2E QA | Scenario G: Milestone Approval & Acceptance (FR-050)`
  - **Expected Result:** Milestone 1 marked `Hoàn thành` (`completed`).

---

## Part 2: Extended Marketplace Workflows (Video 2: Scenarios H–K)

### Scenario H: Payment Ledger & Fee Representation
- **Target Route:** `/payments/:projectId`
- **Actors:** Business Client & System
- **Key Verifications:**
  - Fund Milestone 2 escrow (`10.000.000 đ`).
  - Verify platform fee representation: **"Chưa xác định"** per DEC-04.
  - Verify mandatory advisory notice: *"Mức phí dịch vụ nền tảng đang trong giai đoạn khảo sát chính sách."*
  - Verify that no arbitrary 5% deduction is calculated or displayed.

---

### Scenario I: Project Completion & Dual Review Experience
- **Target Route:** `/reviews/:projectId`
- **Actors:** Business Client & Freelancer
- **Key Verifications:**
  - Complete all milestones -> project status transitions to `completed`.
  - Business rates Freelancer 5 stars with qualitative review.
  - Freelancer rates Business 5 stars with reciprocal review.
  - Reviews published without arbitrary 14-day deadline locks per BR-016.

---

### Scenario J: Notifications, Account Settings & Creative Team Profile
- **Target Routes:** `/notifications`, `/settings`, `/team/profile`
- **Actors:** Any Authenticated User / Team Representative
- **Key Verifications:**
  - View real-time alerts across milestone, chat, agreement, and payment events.
  - Trigger **Đánh dấu tất cả đã đọc** -> unread badges clear immediately.
  - Account Settings: manage notification preferences and security settings.
  - Creative Team Profile (`/team/profile`): view PixelCraft Studio roster, Team Lead identity (Quốc Bảo), shared portfolio attribution, and team permissions preview per FR-063.

---

### Scenario K: Platform Administrator Governance Dashboard
- **Target Route:** `/admin`
- **Actor:** System Administrator (`admin@frevo.vn`)
- **Key Verifications:**
  - Auto-routed upon login to `/admin`.
  - Metrics cards: Total Projects, Active Freelancers, Completed Milestones, System Health.
  - Projects Oversight: inspect projects across all statuses (Open, Ongoing, Completed, Dispute).
  - Dispute Resolution & Audit Log tab: audit trails of agreement confirmations, payment escrow events, and compliance logs per FR-058, FR-059, FR-060.

---

## Part 3: Responsive Multi-Device UI (Video 3)

### Mobile Viewport (390 x 844 — iPhone 14/15)
- Login single-column layout, full-width inputs and action buttons.
- Public project explorer: stacked cards, touch-optimized chips, mobile filters.
- Project chat: compact sticky header, responsive bubble layout, mobile keyboard-friendly input.

### Tablet Viewport (768 x 1024 — iPad Portrait)
- Business dashboard: adaptive 2-column layout.
- Workspace: horizontal milestone timeline adapted to medium tablet screen width.
- Team profile: 2-column team roster and portfolio showcase.

### Desktop Viewport (1440 x 900 — High-Res Widescreen)
- Persistent sidebar navigation and multi-column grid layouts.
- Comprehensive payment ledger with wide multi-column tables.
- Admin dashboard with 4-column metric cards and full-width data tables.
