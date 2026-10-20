# FREVO Frontend — Video Recording & Media Assets Report

**Date:** 2026-10-19  
**Target Application:** FREVO Marketplace (React 19 + TypeScript + Vite 7)  
**Media Output Directory:** `artifacts/qa-demo/`  
**Capture Engine:** Headless Chrome 155 via Chrome DevTools Protocol (CDP)  
**Video Encoder:** OpenCV VideoWriter (`mp4v` codec)  

---

## 1. Overview of Delivered Video Assets

All three delivered video recordings are genuine screen captures of the real FREVO frontend running in Google Chrome. No static slideshows, mockups, or simulated animations were used. Every user interaction (typing into inputs, form validation triggers, modal opens, tab switches, and responsive resizes) was executed directly against the live Document Object Model (DOM).

```
artifacts/qa-demo/
├── FREVO_E2E_MAIN_FLOW_DEMO.mp4        (Scenarios A–G: Core marketplace journey)
├── FREVO_EXTENDED_WORKFLOW_DEMO.mp4    (Scenarios H–K: Payments, reviews, admin)
├── FREVO_RESPONSIVE_UI_DEMO.mp4        (Mobile 390px, Tablet 768px, Desktop 1440px)
├── QA_EXECUTION_REPORT.md              (Comprehensive execution & test matrix)
├── BUG_FIX_LOG.md                      (Root causes, file diffs, and verification)
├── SCREEN_COVERAGE_REPORT.md           (100% UI screen inventory & traceability)
├── DEMO_SCENARIO_SCRIPT.md             (Step-by-step narration script)
└── VIDEO_RECORDING_REPORT.md           (Technical specifications & video logs)
```

---

## 2. Technical Specifications

### Video 1: FREVO_E2E_MAIN_FLOW_DEMO.mp4
- **File Location:** `artifacts/qa-demo/FREVO_E2E_MAIN_FLOW_DEMO.mp4`
- **File Size:** 22,642,539 bytes (~22.64 MB)
- **Resolution:** 1280 x 720 (720p HD, 16:9)
- **Framerate:** 15.0 fps (2,401 total frames)
- **Duration:** 2 minutes 40 seconds (160.06s)
- **Scope:** Scenarios A through G (End-to-End Marketplace Flow)
- **Visual Overlays:** High-contrast dark subtitle banner with blue accent bar indicating active scenario, requirement citations (FR/BR), and step descriptions.
- **Content Breakdown:**
  - `00:00 - 00:32` | **Scenario A:** Typed authentication, invalid password trigger, error banner display, successful login, business dashboard overview, and newly integrated Logout buttons.
  - `00:32 - 01:10` | **Scenario B:** Create Brief required field validation, typing Cát Mộc Eco-Resort brief, publication, and direct navigation to `/business/projects/:projectId` without 404 fallback.
  - `01:10 - 01:42` | **Scenario C:** AI candidate suggestions tab, heuristic matching scores, sending 7-day invitation to Minh Anh, and tracking 7-day expiration countdown badge.
  - `01:42 - 02:08` | **Scenario D:** Identity switch via Logout button, freelancer application submission, business applicant review, chat unlocking (BR-005, BR-012), and active project chat messaging (FR-045, FR-046).
  - `02:08 - 02:22` | **Scenario E:** Agreement proposal with 3-day deadline and 2 revision allowances (DEC-03), version history, mutual confirmation, and project state transition to `ongoing`.
  - `02:22 - 02:30` | **Scenario F:** Collaborative workspace overview, milestone timeline, deliverable Figma link and submission notes.
  - `02:30 - 02:40` | **Scenario G:** Deliverable review, revision request with required reason, revision counter decrement (1/2), deliverable resubmission, and milestone approval.

---

### Video 2: FREVO_EXTENDED_WORKFLOW_DEMO.mp4
- **File Location:** `artifacts/qa-demo/FREVO_EXTENDED_WORKFLOW_DEMO.mp4`
- **File Size:** 10,218,055 bytes (~10.21 MB)
- **Resolution:** 1280 x 720 (720p HD, 16:9)
- **Framerate:** 15.0 fps (862 total frames)
- **Duration:** 57.5 seconds
- **Scope:** Scenarios H through K (Extended Marketplace Workflows)
- **Content Breakdown:**
  - `00:00 - 00:18` | **Scenario H:** Financial ledger (`/payments/:projectId`), Milestone 2 escrow funding simulation, platform fee displayed as "Chưa xác định" with survey disclaimer (DEC-04), and dispute resolution advisory.
  - `00:18 - 00:34` | **Scenario I:** Project completion, dual review submission (1–5 stars and qualitative feedback) for both Business and Freelancer without unapproved 14-day locks (BR-016).
  - `00:34 - 00:46` | **Scenario J:** Real-time notification center with category filters and "Mark All as Read", account settings, and PixelCraft creative team profile with roster, portfolio, and permissions preview (FR-063).
  - `00:46 - 00:57` | **Scenario K:** System administrator login (`admin@frevo.vn`), automatic redirect to `/admin`, platform metrics, project oversight, and compliance audit trail.

---

### Video 3: FREVO_RESPONSIVE_UI_DEMO.mp4
- **File Location:** `artifacts/qa-demo/FREVO_RESPONSIVE_UI_DEMO.mp4`
- **File Size:** 3,902,206 bytes (~3.90 MB)
- **Resolution:** 1280 x 720 (Viewport dynamically adapted via Chrome Emulation)
- **Framerate:** 15.0 fps (414 total frames)
- **Duration:** 27.6 seconds
- **Scope:** Responsive UI Evaluation across 3 standard viewports
- **Content Breakdown:**
  - **Part 1 (Mobile — 390 x 844 px):** Mobile login single-column form, public project explorer card stacking, mobile project detail, and compact project chat layout.
  - **Part 2 (Tablet — 768 x 1024 px):** Business dashboard adaptive 2-column grid, workspace milestone timeline on tablet width, and team roster/portfolio cards.
  - **Part 3 (Desktop — 1440 x 900 px):** Persistent desktop sidebar, widescreen financial ledger, and 4-column administrator dashboard.

---

## 3. Playback & Verification Instructions

The MP4 files can be played directly using any standard media player (VLC, Windows Media Player, QuickTime, Chrome, Edge) or inspected via FFprobe / OpenCV:

```powershell
# Verify video duration and stream info
ffprobe -v error -show_entries format=duration,size:stream=codec_name,width,height -of default=noprint_wrappers=1 artifacts/qa-demo/FREVO_E2E_MAIN_FLOW_DEMO.mp4
```
