import { agreementChanges } from "@/lib/utils/agreementVersions";
import { isDemoMode } from "@/lib/api/agent";
import { resolveAgreement } from "./agreementSelection";
import { canManageApplication } from "./applicationAccess";
import { briefSnapshot, changedBriefFields, materialBriefChanges } from "@/lib/utils/briefVersions";
import { businessQuotaPolicy } from "@/lib/config/businessQuota";
import { businessInvitationQuota, businessProjectQuota } from "@/lib/utils/businessQuota";
/**
 * FREVO Reactive Mock Storage Adapter
 * Provides local session persistence and pub/sub event reactivity across domain hooks.
 * Strictly enforces business rules:
 * - FR-019 & BR-024: 7-day invitation expiration
 * - FR-032 & BR-024: 3-day agreement proposal expiration
 * - FR-048: Agreement versioning & effective version preservation
 * - FR-031 & BR-012/013: Gated candidate review & chat unlock
 * - DEC-03 & BR-014: Mutual milestone revision allowances & mandatory revision reasons
 * - DEC-04: Platform fee simulation ("Chưa xác định")
 */

import type {
  AgreementProposal,
  Candidate,
  CandidateSubmission,
  ChatMessage,
  Invitation,
  MarketplaceState,
  Milestone,
  NotificationItem,
  PaymentSimulation,
  ProjectBrief,
  ReviewItem,
  TalentProfile,
  UserSession,
} from "@/lib/types/marketplace.types";

import { portfolioEvidence, talentPortfolioSeeds } from "@/lib/storage/seeds/portfolioSeed";
import { candidateSubmissionSeeds } from "@/lib/storage/seeds/candidateSubmissionSeed";
import { normalizeSubmittedResume } from "@/lib/utils/resumeAdapters";
import type { ApplicantIdentity } from "@/lib/types/application.types";
import type { Work } from "@/lib/types/portfolio.types";

const STORAGE_KEY = "frevo_marketplace_data_v2";
const PENDING_CANDIDATES_DEMO_KEY = "frevo_nang_brand_pending_candidates_demo_v1";
const STORAGE_EVENT = "frevo_marketplace_storage_change";

// Base Talents Seed Data (Traceable to business-data.ts talents)
export const initialTalentsSeed: TalentProfile[] = [
  {
    id: "minh-anh",
    name: "Minh Anh",
    role: "Brand Designer",
    kind: "Cá nhân",
    initials: "MA",
    color: "#eedbc9",
    location: "TP. Hồ Chí Minh",
    rate: "18–22 triệu / dự án",
    rateMin: 18000000,
    rateMax: 22000000,
    availability: "Có thể bắt đầu ngay",
    skills: ["Brand identity", "Logo design", "Packaging"],
    about:
      "Thiết kế nhận diện cho thương hiệu tiêu dùng và các sản phẩm thủ công. Tập trung vào hệ thống có thể sử dụng nhất quán trên bao bì và kênh số.",
    portfolio: portfolioEvidence("minh-anh"),
    fit: ["3 kỹ năng trùng brief", "Portfolio cùng lĩnh vực", "Trong khoảng ngân sách"],
    verified: true,
  },
  {
    id: "may-creative",
    name: "Mây Creative",
    role: "Nhóm thiết kế thương hiệu",
    kind: "Team",
    initials: "MC",
    color: "#d9dfda",
    location: "Hà Nội",
    rate: "22–28 triệu / dự án",
    rateMin: 22000000,
    rateMax: 28000000,
    availability: "Sẵn sàng từ tháng 11",
    skills: ["Brand identity", "Art direction", "Social design"],
    about:
      "Team 3 người phụ trách chiến lược hình ảnh, thiết kế nhận diện và triển khai nội dung số. Một tài khoản đại diện trao đổi và xác nhận trên FREVO.",
    portfolio: portfolioEvidence("may-creative"),
    fit: ["Năng lực team phù hợp", "Portfolio nhận diện", "Có thể đáp ứng nhiều đầu việc"],
    teamMembersCount: 3,
    verified: true,
  },
  {
    id: "khanh-linh",
    name: "Khánh Linh",
    role: "Visual Identity Designer",
    kind: "Cá nhân",
    initials: "KL",
    color: "#d8d4ea",
    location: "Đà Nẵng",
    rate: "16–20 triệu / dự án",
    rateMin: 16000000,
    rateMax: 20000000,
    availability: "Có thể bắt đầu ngay",
    skills: ["Brand identity", "Typography", "Guideline"],
    about:
      "Chuyên xây dựng bộ nhận diện rõ ràng, dễ dùng cho đội ngũ nhỏ. Có kinh nghiệm thiết kế guideline và tài liệu ứng dụng.",
    portfolio: portfolioEvidence("khanh-linh"),
    fit: ["Kinh nghiệm nhận diện", "Đúng khoảng ngân sách", "Sẵn sàng ngay"],
    verified: false,
  },
  {
    id: "ha-vy",
    name: "Hà Vy",
    role: "Brand & Packaging Designer",
    kind: "Cá nhân",
    initials: "HV",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCLXtAvIjT9q-Q0o9Z57kH1Nlif2_urVGsvxL_xvQGXKHYl5mOLu_8lhPGvDNpp8xq2HO2m_OUlpDwvYCEuf6aikygzl3RME-vc6mn9ictLfM_RpKejXaIuJM0qxcnIX185ZEWRmEEv4gap3YK65fU9hJeghpElbcPYcGs7F1b96y0rS2fjnRfmJXponPlrijc8PNXBVtXrmfUkwAdCPvge5ppJsAzmJ11xCO0eJEzc9ZdHPJAERv4s",
    color: "#f2d7c5",
    location: "TP. Hồ Chí Minh",
    rate: "20–25 triệu / dự án",
    rateMin: 20000000,
    rateMax: 25000000,
    availability: "Có thể bắt đầu ngay",
    skills: ["Brand identity", "Packaging", "Illustration"],
    about:
      "Thiết kế hình ảnh thương hiệu và bao bì cho sản phẩm lifestyle, thực phẩm và cửa hàng độc lập.",
    portfolio: portfolioEvidence("ha-vy"),
    fit: ["Kỹ năng bao bì phù hợp", "Portfolio cùng ngành", "Trong khoảng ngân sách"],
    verified: true,
  },
  {
    id: "studio-dau",
    name: "Studio Dâu",
    role: "Creative team",
    kind: "Team",
    initials: "SD",
    color: "#f1d4d3",
    location: "Hà Nội",
    rate: "24–30 triệu / dự án",
    rateMin: 24000000,
    rateMax: 30000000,
    availability: "Sẵn sàng từ tháng 11",
    skills: ["Brand identity", "Packaging", "Campaign"],
    about:
      "Team thiết kế tập trung vào bộ nhận diện và triển khai đa kênh cho các thương hiệu mới.",
    portfolio: portfolioEvidence("studio-dau"),
    fit: ["Đủ năng lực triển khai", "Portfolio liên quan", "Phù hợp dự án theo team"],
    teamMembersCount: 4,
    verified: false,
  },
];

// Initial Projects Seed Data
export const initialProjectsSeed: ProjectBrief[] = [
  {
    id: "nang-brand",
    title: "Bộ nhận diện cho Nắng Studio",
    heroImage: "/assets/nang-studio-brief.webp",
    category: "Thiết kế thương hiệu",
    type: "brand",
    company: "Nắng Studio",
    city: "TP. Hồ Chí Minh",
    remote: true,
    budget: "15–25 triệu",
    budgetMin: 15000000,
    budgetMax: 25000000,
    duration: "4 tuần",
    deadline: "30/11/2026",
    applicationDeadline: "31/10/2026",
    skills: ["Brand identity", "Logo design", "Packaging"],
    description:
      "Nắng Studio cần một hệ nhận diện ấm áp, hiện đại cho thương hiệu sản phẩm thủ công. Thiết kế cần sử dụng tốt trên bao bì, mạng xã hội và tài liệu giới thiệu.",
    deliverables: [
      "Logo chính và các phiên bản sử dụng",
      "Bảng màu, kiểu chữ và hướng dẫn thương hiệu",
      "Mẫu bao bì và bộ bài đăng mạng xã hội",
    ],
    preference: "both",
    status: "published",
    createdAt: "2026-10-01T08:00:00.000Z",
    publishedAt: "2026-10-01T09:00:00.000Z",
  },
  {
    id: "landing-collection",
    title: "Landing page ra mắt bộ sưu tập mới",
    category: "UI/UX & Website",
    type: "uiux",
    company: "Nắng Studio",
    city: "TP. Hồ Chí Minh",
    remote: true,
    budget: "12–18 triệu",
    budgetMin: 12000000,
    budgetMax: 18000000,
    duration: "3 tuần",
    deadline: "15/12/2026",
    applicationDeadline: "10/11/2026",
    skills: ["UI design", "Landing page", "Figma"],
    description:
      "Thiết kế landing page giới thiệu bộ sưu tập mới, dễ xem trên điện thoại và thể hiện rõ sản phẩm nổi bật.",
    deliverables: ["Thiết kế desktop và mobile", "Bộ thành phần giao diện"],
    preference: "individual",
    status: "draft",
    createdAt: "2026-10-10T10:00:00.000Z",
  },
  {
    id: "co-may-packaging",
    title: "Bao bì cho dòng trà Cỏ Mây",
    heroImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCl18bgNot-gy3kxxD-DzWy_ZbioA6jIEaj-AU1p3VwMTqcd7xgHBgDq557MMEQkg2EPjgYJVoJTyzAaqWHyP5IYtoH1l4Kai7EXWFHid3j1OWDlf7ke2sFSzuMEGO_XA8mP1NbIHTwVfFMDvc-m6Gfk8u9whc-Zwd5Mk2cKsz-p8WHZHexeB8R8eIB-SCpPd80T2CresPH26bHiuRRJ14izbMR3UEwTRffR7NWbkXS8TW6M1VCxNEV",
    category: "Thiết kế thương hiệu",
    type: "brand",
    company: "Nắng Studio",
    city: "TP. Hồ Chí Minh",
    remote: true,
    budget: "24 triệu",
    budgetMin: 24000000,
    budgetMax: 24000000,
    duration: "5 tuần",
    deadline: "20/11/2026",
    applicationDeadline: "01/10/2026",
    skills: ["Packaging", "Illustration", "Print design"],
    description:
      "Thiết kế hệ bao bì cho ba vị trà mới của Nắng Studio, thống nhất ngôn ngữ thị giác với nhận diện hiện có và sẵn sàng bàn giao cho nhà in.",
    deliverables: [
      "Định hướng hình ảnh cho bộ bao bì",
      "Thiết kế hộp và nhãn cho ba vị trà",
      "Tệp in và hướng dẫn sử dụng",
    ],
    preference: "individual",
    status: "ongoing",
    createdAt: "2026-09-15T08:00:00.000Z",
    publishedAt: "2026-09-15T09:00:00.000Z",
    closedAt: "2026-10-03T10:00:00.000Z",
    selectedTalentId: "ha-vy",
  },
];

// Initial Candidates Seed Data (with gated chat status per FR-031)
export const initialCandidatesSeed: Candidate[] = [
  {
    id: "c1",
    submission: candidateSubmissionSeeds.c1,
    projectId: "nang-brand",
    talentId: "minh-anh",
    source: "Ứng tuyển · Lời mời",
    status: "new",
    proposal:
      "Mình muốn xây dựng một hệ nhận diện linh hoạt, từ logo đến bao bì. Hai dự án Mộc Coffee và L’Herbe trong portfolio có phạm vi khá gần với brief này.",
    receivedAt: "2026-10-18T09:42:00.000Z",
    unread: true,
    chatUnlocked: false, // Locked until Business candidate review (BUS-013)
    fitScore: 92,
  },
  {
    id: "c2",
    submission: candidateSubmissionSeeds.c2,
    projectId: "nang-brand",
    talentId: "may-creative",
    source: "Ứng tuyển · Lời mời",
    status: "new",
    proposal:
      "Team Mây có thể đảm nhận toàn bộ hệ nhận diện và ứng dụng mạng xã hội, với một người đại diện xuyên suốt dự án.",
    receivedAt: "2026-10-17T16:20:00.000Z",
    unread: true,
    chatUnlocked: false,
    fitScore: 88,
  },
  {
    id: "c3",
    submission: candidateSubmissionSeeds.c3,
    projectId: "nang-brand",
    talentId: "khanh-linh",
    source: "Ứng tuyển",
    status: "new",
    proposal:
      "Mình có kinh nghiệm xây dựng brandbook cho studio nhỏ và muốn trao đổi thêm về các điểm chạm ưu tiên.",
    receivedAt: "2026-10-15T11:08:00.000Z",
    unread: true,
    chatUnlocked: false, // Locked until Business review for the demo
    fitScore: 85,
  },
  {
    id: "c4",
    submission: candidateSubmissionSeeds.c4,
    projectId: "co-may-packaging",
    talentId: "ha-vy",
    source: "Ứng tuyển",
    status: "selected",
    proposal:
      "Mình có thể xây dựng một hệ bao bì thống nhất cho ba vị trà và chuẩn bị tệp in đầy đủ.",
    receivedAt: "2026-09-28T14:15:00.000Z",
    unread: false,
    chatUnlocked: true,
    chatUnlockedAt: "2026-09-29T09:00:00.000Z",
    fitScore: 95,
  },
  {
    id: "c5",
    submission: candidateSubmissionSeeds.c5,
    projectId: "co-may-packaging",
    talentId: "studio-dau",
    source: "Ứng tuyển",
    status: "not_selected",
    proposal:
      "Team mình từng triển khai bao bì sản phẩm đồ uống và có thể đáp ứng tiến độ.",
    receivedAt: "2026-09-29T09:30:00.000Z",
    unread: false,
    chatUnlocked: false,
    fitScore: 78,
  },
];

// Initial Invitations Seed Data (7 days expiration per FR-019 & BR-024)
export const initialInvitationsSeed: Invitation[] = [
  { id: "inv-minh-anh", projectId: "nang-brand", talentId: "minh-anh", status: "accepted", sentAt: "2026-10-17T08:00:00.000Z", expiresAt: "2026-10-24T08:00:00.000Z", respondedAt: "2026-10-18T09:42:00.000Z", note: "Mời Minh Anh trao đổi về bộ nhận diện Nắng Studio." },
  { id: "inv-may-creative", projectId: "nang-brand", talentId: "may-creative", status: "accepted", sentAt: "2026-10-16T08:00:00.000Z", expiresAt: "2026-10-23T08:00:00.000Z", respondedAt: "2026-10-17T16:20:00.000Z", note: "Mời đại diện Mây Creative tham gia tuyển người thực hiện dự án." },
  {
    id: "inv-1",
    projectId: "nang-brand",
    talentId: "ha-vy",
    status: "pending",
    sentAt: "2026-10-16T10:00:00.000Z",
    // 7 days after sentAt per FR-019 & BR-024
    expiresAt: "2026-10-23T10:00:00.000Z",
    note: "Chào Vy, bên mình rất thích portfolio của bạn và muốn mời bạn tham gia brief Nắng Studio.",
  },
];

// Initial Agreements Seed Data (3 days countdown per FR-032 & BR-024; versioned per FR-048)
export const initialAgreementsSeed: AgreementProposal[] = [
  {
    id: "agr-1",
    projectId: "co-may-packaging",
    talentId: "ha-vy",
    version: 1,
    isEffective: true, // Effective active agreement
    scope:
      "Thiết kế hệ bao bì cho ba vị trà Cỏ Mây của Nắng Studio, bao gồm định hướng hình ảnh, thiết kế hộp và nhãn, chuẩn bị tệp in.",
    deliverables:
      "Định hướng hình ảnh cho bộ bao bì\nThiết kế hộp và nhãn cho ba vị trà\nTệp in và hướng dẫn sử dụng",
    deadline: "20/11/2026",
    budget: "24 triệu",
    budgetValue: 24000000,
    status: "confirmed",
    sentAt: "2026-10-02T08:00:00.000Z",
    // 3 days window per FR-032
    expiresAt: "2026-10-05T08:00:00.000Z",
    confirmedAt: "2026-10-03T10:00:00.000Z",
    reference: "FV-2026-004",
    milestones: [
      {
        id: "co-may-1",
        name: "Mốc 1 · Định hướng",
        deliverable: "Moodboard, bảng màu và hướng minh họa cho ba vị trà",
        deadline: "25/10/2026",
        amount: "8 triệu",
        amountValue: 8000000,
        status: "submitted",
        submittedAt: "2026-10-16T14:00:00.000Z",
        submissionNotes: "Gửi team bản moodboard và 2 phương án màu sắc chủ đạo cho 3 vị trà.",
        previewImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBXJS-Ccq5-QzPTAW7D_JfWxl-YJtuKGRavSIr89UTy1flppmahYrroG9ysKc9coSkodjjce9Kh1VZcG_FBzqv0qZdPFUOCiqTEy5es3v7H6YOdU2HyeiitsOVDK56gibF9qNFEssmeCXSZUhsWy61gVgOn9sOc9IuoPQihZfJA1joblgOlugXHSQGrYQS984Tmy_JSkzGPMEfw1xMr_HLSbtv0JVWjCBfd58iw2uWZlTB_nZ8OI_dG",
        previewAlt: "Moodboard bao bì trà Cỏ Mây, minh họa thảo mộc và bảng màu tự nhiên",
        submissionFiles: [
          { name: "Moodboard_DinhHuong_CoMay_v1.pdf", url: "/assets/demo/co-may-moodboard.pdf", size: "Tệp demo PDF" },
          { name: "BangMau_MinhHoa_Preview.png", url: "https://lh3.googleusercontent.com/aida-public/AB6AXuBXJS-Ccq5-QzPTAW7D_JfWxl-YJtuKGRavSIr89UTy1flppmahYrroG9ysKc9coSkodjjce9Kh1VZcG_FBzqv0qZdPFUOCiqTEy5es3v7H6YOdU2HyeiitsOVDK56gibF9qNFEssmeCXSZUhsWy61gVgOn9sOc9IuoPQihZfJA1joblgOlugXHSQGrYQS984Tmy_JSkzGPMEfw1xMr_HLSbtv0JVWjCBfd58iw2uWZlTB_nZ8OI_dG", size: "Ảnh tham khảo Stitch" },
          { name: "GhiChu_YTuong_Concept.pdf", url: "/assets/demo/co-may-concept.pdf", size: "Tệp demo PDF" },
        ],
        acceptanceCriteria: [
          { id: "moodboard", title: "Moodboard đúng tinh thần mộc mạc", description: "Thể hiện chất liệu giấy thô, gam màu đất và lá trà tự nhiên theo brief đã thống nhất." },
          { id: "palette", title: "Bảng màu cho ba vị trà", description: "Phân biệt rõ ba dòng trà; ghi nhận thông số màu và hướng ứng dụng trên bao bì." },
          { id: "illustration", title: "Hướng minh họa cho ba bao bì", description: "Có phác thảo minh họa tương ứng cho Oolong, Hoa Vàng và Búp Non." },
        ],
        revisionAllowance: { allowed: 2, used: 0 }, // Mutual allowance per DEC-03
      },
      {
        id: "co-may-2",
        name: "Mốc 2 · Thiết kế bao bì",
        deliverable: "Thiết kế hộp, nhãn và tệp in hoàn chỉnh",
        deadline: "20/11/2026",
        amount: "16 triệu",
        amountValue: 16000000,
        status: "upcoming",
        revisionAllowance: { allowed: 2, used: 0 },
      },
    ],
  },
];

// Initial Chat Messages Seed Data
export const initialMessagesSeed: ChatMessage[] = [
  {
    id: "m1",
    projectId: "nang-brand",
    talentId: "khanh-linh",
    sender: "talent",
    senderName: "Khánh Linh",
    body: "Em đã xem brief và gửi thêm hai dự án nhận diện gần đây để anh/chị tham khảo.",
    sentAt: "2026-10-18T10:18:00.000Z",
  },
  {
    id: "m2",
    projectId: "nang-brand",
    talentId: "khanh-linh",
    sender: "business",
    senderName: "Nắng Studio",
    body: "Cảm ơn Linh. Bên mình muốn ưu tiên bao bì và bộ bài đăng trong giai đoạn đầu.",
    sentAt: "2026-10-18T10:24:00.000Z",
  },
  {
    id: "m3",
    projectId: "co-may-packaging",
    talentId: "ha-vy",
    sender: "business",
    senderName: "Nắng Studio",
    body: "Bên mình đã xác nhận nội dung hợp tác. Vy gửi giúp bản định hướng màu sắc cho ba vị trà trước nhé.",
    sentAt: "2026-10-15T09:10:00.000Z",
  },
  {
    id: "m4",
    projectId: "co-may-packaging",
    talentId: "ha-vy",
    sender: "talent",
    senderName: "Hà Vy",
    body: "Mình đã bắt đầu lên hướng màu và minh họa. Chiều mai mình sẽ gửi bản xem trước để bên bạn góp ý.",
    sentAt: "2026-10-15T09:26:00.000Z",
  },
];

// Initial Notifications Seed Data
export const initialNotificationsSeed: NotificationItem[] = [
  {
    id: "n1",
    title: "Minh Anh vừa ứng tuyển",
    detail: "Bộ nhận diện cho Nắng Studio",
    type: "application",
    time: "09:42 hôm nay",
    timestamp: Date.now() - 3600000 * 2,
    read: false,
    href: "/business/projects/nang-brand/applicants",
  },
  {
    id: "n2",
    title: "Bạn có tin nhắn mới",
    detail: "Khánh Linh đã gửi một tin nhắn trong dự án.",
    type: "chat",
    time: "10:18 hôm nay",
    timestamp: Date.now() - 3600000,
    read: false,
    href: "/business/messages?view=project&scope=nang-brand&project=nang-brand&talent=khanh-linh",
  },
  {
    id: "n3",
    title: "Mây Creative đã ứng tuyển",
    detail: "Bộ nhận diện cho Nắng Studio",
    type: "application",
    time: "Hôm qua",
    timestamp: Date.now() - 86400000,
    read: true,
    href: "/business/projects/nang-brand/applicants",
  },
];

// Default Active User Session (Client user by default)
export const initialActiveUserSeed: UserSession = {
  id: "user-client-1",
  name: "Thuận Nguyễn",
  email: "thuan@nangstudio.vn",
  role: "client",
  companyName: "Nắng Studio",
  verified: true,
  actingIdentity: { type: "individual" },
};

function getInitialState(): MarketplaceState {
  return {
    portfolioSeedVersion: 2,
    projects: initialProjectsSeed,
    talents: initialTalentsSeed,
    candidates: initialCandidatesSeed,
    invitations: initialInvitationsSeed,
    agreements: initialAgreementsSeed,
    messages: initialMessagesSeed,
    notifications: initialNotificationsSeed,
    reviews: [],
    payments: [],
    activeUser: initialActiveUserSeed,
  };
}

class MockStorageAdapter {
  private memoryState: MarketplaceState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.memoryState = this.loadFromStorage();

    // Listen to storage events across tabs
    if (typeof window !== "undefined") {
      window.addEventListener("storage", (e) => {
        if (e.key === STORAGE_KEY) {
          this.memoryState = this.loadFromStorage();
          this.notify();
        }
      });
    }
  }

  private loadFromStorage(): MarketplaceState {
    if (typeof window === "undefined") {
      return getInitialState();
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        let state = JSON.parse(stored) as MarketplaceState;
        if (state.portfolioSeedVersion !== 2) {
          state = {
            ...state,
            portfolioSeedVersion: 2,
            talents: state.talents.map(talent => {
              if (!talentPortfolioSeeds[talent.id]) return talent;
              const canonical = portfolioEvidence(talent.id);
              const seededIds = new Set([...canonical.map(item => item.id), "lum-coffee", "moc-packaging"]);
              return { ...talent, portfolio: [...canonical, ...talent.portfolio.filter(item => !seededIds.has(item.id))] };
            }),
            candidates: state.candidates.map(candidate => candidate.talentId === "minh-anh" ? { ...candidate, proposal: candidate.proposal.replace("Hai dự án Lúm Coffee và Mộc trong portfolio", "Hai dự án Mộc Coffee và L’Herbe trong portfolio") } : candidate),
          };
          this.saveToStorage(state);
        }
        const projectImages = new Map(initialProjectsSeed.filter(project => project.heroImage).map(project => [project.id, project.heroImage]));
        if (state.projects.some(project => !project.heroImage && projectImages.has(project.id))) {
          state = { ...state, projects: state.projects.map(project => !project.heroImage && projectImages.has(project.id) ? { ...project, heroImage: projectImages.get(project.id) } : project) };
          this.saveToStorage(state);
        }
        const talentAvatars = new Map(initialTalentsSeed.filter(talent => talent.avatar).map(talent => [talent.id, talent.avatar]));
        if (state.talents.some(talent => !talent.avatar && talentAvatars.has(talent.id))) {
          state = { ...state, talents: state.talents.map(talent => !talent.avatar && talentAvatars.has(talent.id) ? { ...talent, avatar: talentAvatars.get(talent.id) } : talent) };
          this.saveToStorage(state);
        }
        // Enrich the original demo submission only; keep all user uploads and decisions.
        let workspaceSeedUpdated = false;
        state = { ...state, agreements: state.agreements.map(agreement => {
          const seedAgreement = initialAgreementsSeed.find(seed => seed.id === agreement.id && seed.version === agreement.version);
          if (!seedAgreement) return agreement;
          return { ...agreement, milestones: agreement.milestones.map(milestone => {
            const seed = seedAgreement.milestones.find(item => item.id === milestone.id);
            if (!seed?.acceptanceCriteria || milestone.acceptanceCriteria) return milestone;
            workspaceSeedUpdated = true;
            const originalSubmission = milestone.submittedAt === seed.submittedAt && !milestone.submissionFiles?.length;
            return { ...milestone, acceptanceCriteria: seed.acceptanceCriteria,
              ...(originalSubmission ? { submissionFiles: seed.submissionFiles, previewImage: seed.previewImage, previewAlt: seed.previewAlt } : {}) };
          }) };
        }) };
        if (workspaceSeedUpdated) this.saveToStorage(state);
        const alreadyPrepared = localStorage.getItem(PENDING_CANDIDATES_DEMO_KEY) || sessionStorage.getItem(PENDING_CANDIDATES_DEMO_KEY);
        if (state.candidates.some(candidate => candidate.submission?.resume && !candidate.submission.resume.fileId)) {
          state = { ...state, candidates: state.candidates.map(candidate => candidate.submission?.resume && !candidate.submission.resume.fileId
            ? { ...candidate, submission: { ...candidate.submission, resume: normalizeSubmittedResume(candidate.submission.resume) } } : candidate) };
          this.saveToStorage(state);
        }
        if (state.candidates.some(candidate => !candidate.submission && candidateSubmissionSeeds[candidate.id])) {
          state = { ...state, candidates: state.candidates.map(candidate => {
            const seed = initialCandidatesSeed.find(item => item.id === candidate.id && item.talentId === candidate.talentId && item.projectId === candidate.projectId);
            return !candidate.submission && seed ? { ...candidate, submission: seed.submission } : candidate;
          }) };
          this.saveToStorage(state);
        }
        if (alreadyPrepared) return state;

        const nextState: MarketplaceState = {
          ...state,
          candidates: state.candidates.map((candidate) =>
            candidate.projectId === "nang-brand"
              ? { ...candidate, status: "new" as const, unread: true, chatUnlocked: false, chatUnlockedAt: undefined }
              : candidate
          ),
        };
        this.saveToStorage(nextState);
        try {
          localStorage.setItem(PENDING_CANDIDATES_DEMO_KEY, "1");
          sessionStorage.setItem(PENDING_CANDIDATES_DEMO_KEY, "1");
        } catch {
          // Keep the migrated state in memory if storage is unavailable.
        }
        return nextState;
      }
    } catch {
      // Ignore storage parsing or quota errors
    }
    const fresh = getInitialState();
    this.saveToStorage(fresh);
    try {
      localStorage.setItem(PENDING_CANDIDATES_DEMO_KEY, "1");
      sessionStorage.setItem(PENDING_CANDIDATES_DEMO_KEY, "1");
    } catch {
      // Demo state still works in memory when storage is unavailable.
    }
    return fresh;
  }

  private saveToStorage(state: MarketplaceState, requirePersistence = false): void {
    if (requirePersistence && typeof window !== "undefined") {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
      catch { throw new Error("Không đủ dung lượng lưu brief trên trình duyệt. Chọn ảnh nhỏ hơn hoặc dùng liên kết ảnh; nội dung đang nhập được giữ lại."); }
    }
    this.memoryState = state;
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        window.dispatchEvent(new CustomEvent(STORAGE_EVENT));
      } catch {
        // Fallback gracefully in incognito or constrained environments
      }
    }
    this.notify();
  }

  private notify(): void {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error("Error in mockStorage listener:", err);
      }
    });
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getState(): MarketplaceState {
    return this.memoryState;
  }

  public reset(): void {
    const fresh = getInitialState();
    this.saveToStorage(fresh);
  }

  // --- Session & User Operations ---
  public getActiveUser(): UserSession {
    return this.memoryState.activeUser;
  }

  public getApplicantTalentId(identity?: ApplicantIdentity): string {
    const user = this.getActiveUser();
    if ((identity ?? user.actingIdentity?.type) === "team") return "may-creative";
    return this.memoryState.talents.some(talent => talent.id === user.id && talent.kind === "Cá nhân") ? user.id : "minh-anh";
  }

  public getApplicantWorks(identity: ApplicantIdentity, personalWorks: Work[]): Work[] {
    const works = identity === "team" ? [] : personalWorks;
    return works.filter(work => work.visibility === "public");
  }

  public canViewCandidateResume(candidateId: string, projectId: string): boolean {
    const user = this.getActiveUser();
    const project = this.getProjectById(projectId);
    const candidate = this.memoryState.candidates.find(item => item.id === candidateId && item.projectId === projectId);
    if (user.role !== "client" || !user.companyName || user.companyName !== project?.company || !candidate) return false;
    return candidate.source.includes("Ứng tuyển") || this.memoryState.invitations.some(invitation => invitation.projectId === projectId && invitation.talentId === candidate.talentId && invitation.status === "accepted");
  }

  public setActiveUser(user: UserSession): void {
    const next = { ...this.memoryState, activeUser: user };
    this.saveToStorage(next);
  }

  public switchRole(role: UserSession["role"]): void {
    const updatedUser: UserSession = {
      ...this.memoryState.activeUser,
      role,
      name:
        role === "client"
          ? "Thuận Nguyễn (Nắng Studio)"
          : role === "freelancer"
          ? "Minh Anh"
          : "Quản trị viên FREVO",
      companyName: role === "client" ? "Nắng Studio" : undefined,
    };
    this.setActiveUser(updatedUser);
  }

  // --- Project Brief Operations ---
  public getProjects(): ProjectBrief[] {
    return this.memoryState.projects;
  }

  public getProjectById(id: string): ProjectBrief | undefined {
    return this.memoryState.projects.find((p) => p.id === id);
  }

  public saveProject(project: ProjectBrief): void {
    const quota = businessProjectQuota(this.memoryState.projects, project.company);
    const previous = this.getProjectById(project.id);
    if (project.status === "published" && previous?.status !== "published" && quota.reached && quota.mode === "hard") {
      throw new Error("Đã đạt hạn mức dự án đang tuyển. Bạn vẫn có thể lưu bản nháp.");
    }
    if (previous && !["draft", "published"].includes(previous.status)) throw new Error("Dự án đã đóng tuyển. Thay đổi phạm vi cần qua đề xuất điều chỉnh thỏa thuận.");
    if (previous && (project.briefVersion ?? 1) !== (previous.briefVersion ?? 1)) throw new Error("Brief đã có phiên bản mới. Tải lại trang và kiểm tra thay đổi trước khi lưu.");
    const changed = previous ? changedBriefFields(previous, project) : [];
    const material = previous ? materialBriefChanges(previous, project) : [];
    const versioned = !!previous && previous.status === "published" && changed.length > 0;
    const version = (previous?.briefVersion ?? 1) + (versioned ? 1 : 0);
    const now = new Date().toISOString();
    const revision = versioned ? { version, changedAt: now, changedBy: { id: this.memoryState.activeUser.id, name: this.memoryState.activeUser.name }, fields: changed, before: briefSnapshot(previous!), after: briefSnapshot({ ...project, briefVersion: version }) } : undefined;
    project = { ...project, briefVersion: version, briefHistory: [...(previous?.briefHistory ?? []), ...(revision ? [revision] : [])] };
    const recipients = versioned && material.length ? [...new Set(this.memoryState.candidates.filter(candidate => candidate.projectId === project.id && candidate.status !== "not_selected").map(candidate => candidate.applicantAccountId || this.getTalentById(candidate.talentId)?.teamLeaderId || candidate.talentId))] : [];
    const notices: NotificationItem[] = recipients.map(userId => ({ id: crypto.randomUUID(), userId, title: "Brief dự án đã được cập nhật", detail: `${project.title} · Phiên bản ${version}. Vui lòng kiểm tra nội dung trước khi tiếp tục trao đổi.`, type: "system", time: "Vừa xong", timestamp: Date.now(), read: false, href: `/projects/${project.id}/details` }));
    const existingIndex = this.memoryState.projects.findIndex((p) => p.id === project.id);
    let updatedProjects: ProjectBrief[];
    if (existingIndex >= 0) {
      updatedProjects = [...this.memoryState.projects];
      updatedProjects[existingIndex] = project;
    } else {
      updatedProjects = [project, ...this.memoryState.projects];
    }
    this.saveToStorage({ ...this.memoryState, projects: updatedProjects, notifications: [...notices, ...this.memoryState.notifications],
      businessQuotaEvents: project.status === "published" && previous?.status !== "published" && quota.reached && quota.mode === "soft"
        ? [...(this.memoryState.businessQuotaEvents ?? []), { id: crypto.randomUUID(), projectId: project.id, policyVersion: businessQuotaPolicy.version, createdAt: new Date().toISOString(), kind: "project_soft_limit" }]
        : this.memoryState.businessQuotaEvents,
    }, true);
  }

  public updateProjectStatus(id: string, status: ProjectBrief["status"]): void {
    const updatedProjects = this.memoryState.projects.map((p) =>
      p.id === id
        ? {
            ...p,
            status,
            closedAt: status === "closed" ? new Date().toISOString() : p.closedAt,
            completedAt: status === "completed" ? new Date().toISOString() : p.completedAt,
          }
        : p
    );
    this.saveToStorage({ ...this.memoryState, projects: updatedProjects });
  }

  // --- Talent Profile Operations ---
  public getTalents(): TalentProfile[] {
    return this.memoryState.talents;
  }

  public getTalentById(id: string): TalentProfile | undefined {
    return this.memoryState.talents.find((t) => t.id === id);
  }

  public registerRepresentedTeam(accountId: string, team: { id: string; name: string; summary: string; discipline: string; memberCount: number }): string {
    const id = `managed-team:${accountId}:${team.id}`;
    const previous = this.getTalentById(id);
    const profile: TalentProfile = {
      id, name: team.name, role: team.discipline, kind: "Team",
      initials: team.name.trim().split(/\s+/).slice(0, 2).map(part => part[0]).join("").toUpperCase(),
      color: "#fff0e9", location: "Việt Nam", rate: "Theo dự án", availability: "Sẵn sàng",
      skills: [team.discipline], about: team.summary, portfolio: [], teamMembersCount: team.memberCount,
      teamLeaderId: accountId,
    };
    this.saveToStorage({ ...this.memoryState, talents: previous ? this.memoryState.talents.map(item => item.id === id ? { ...item, ...profile } : item) : [...this.memoryState.talents, profile] });
    return id;
  }

  // --- Candidate Operations ---
  public getCandidates(projectId?: string): Candidate[] {
    if (projectId) {
      return this.memoryState.candidates.filter((c) => c.projectId === projectId);
    }
    return this.memoryState.candidates;
  }

  public addCandidate(candidate: Candidate): void {
    const nextCandidates = [candidate, ...this.memoryState.candidates];
    this.saveToStorage({ ...this.memoryState, candidates: nextCandidates });
  }

  /**
   * Submits application with source merging per BR-011 and locked chat per BR-012
   */
  public submitApplication(projectId: string, talentId: string, proposal: string, submission?: CandidateSubmission, applicantAccountId?: string): Candidate {
    const latestProject = this.getProjectById(projectId);
    if (latestProject && latestProject.status !== "published") throw new Error("Dự án đã ngừng nhận hồ sơ ứng tuyển.");
    if (applicantAccountId && this.memoryState.candidates.some(candidate => candidate.projectId === projectId && candidate.applicantAccountId === applicantAccountId && candidate.talentId !== talentId)) {
      throw new Error("Bạn không thể đổi tư cách cá nhân/Team của đơn đã gửi cho dự án này.");
    }
    const existing = this.memoryState.candidates.find(
      (c) => c.projectId === projectId && c.talentId === talentId
    );

    let nextCandidates: Candidate[];
    let candidateRecord: Candidate;

    if (existing) {
      // BR-011: Source merging
      candidateRecord = {
        ...existing,
        source: existing.source === "Lời mời" ? "Ứng tuyển · Lời mời" : existing.source,
        proposal: proposal || existing.proposal,
        submission: submission ?? existing.submission,
        applicantAccountId: applicantAccountId ?? existing.applicantAccountId,
      };
      nextCandidates = this.memoryState.candidates.map((c) =>
        c.id === existing.id ? candidateRecord : c
      );
    } else {
      candidateRecord = {
        id: `c-app-${Date.now()}`,
        briefAtSubmission: latestProject ? briefSnapshot({ ...latestProject, briefVersion: latestProject.briefVersion ?? 1 }) : undefined,
        projectId,
        talentId,
        source: "Ứng tuyển",
        status: "new",
        proposal,
        receivedAt: new Date().toISOString(),
        unread: true,
        chatUnlocked: false, // BR-012: locked until Business review
        fitScore: 88,
        submission,
        applicantAccountId,
      };
      nextCandidates = [candidateRecord, ...this.memoryState.candidates];
    }

    const project = this.getProjectById(projectId);
    const talent = this.getTalentById(talentId);
    const nextNotifications: NotificationItem[] = [
      {
        id: `notif-app-${Date.now()}`,
        title: `${talent?.name || "Ứng viên"} vừa ${existing ? "cập nhật" : "nộp"} hồ sơ ứng tuyển`,
        detail: `Dự án: ${project?.title || "Dự án"}`,
        type: "application",
        time: "Vừa xong",
        timestamp: Date.now(),
        read: false,
        href: `/business/projects/${projectId}/applicants`,
      },
      ...this.memoryState.notifications,
    ];

    this.saveToStorage({
      ...this.memoryState,
      candidates: nextCandidates,
      notifications: nextNotifications,
    });

    return candidateRecord;
  }

  /**
   * Withdraw candidate application per FL-012 and BR-010
   */
  public withdrawApplication(candidateId: string): void {
    const nextCandidates = this.memoryState.candidates.map((c) =>
      c.id === candidateId ? { ...c, status: "not_selected" as const } : c
    );
    this.saveToStorage({ ...this.memoryState, candidates: nextCandidates });
  }

  public updateCandidateStatus(id: string, status: Candidate["status"]): void {
    const nextCandidates = this.memoryState.candidates.map((c) =>
      c.id === id ? { ...c, status } : c
    );
    this.saveToStorage({ ...this.memoryState, candidates: nextCandidates });
  }

  /**
   * Unlocks project chat for candidate upon explicit Business approval
   * Traceable to FR-031, BR-012, BR-013, BUS-013
   */
  public unlockCandidateChat(projectId: string, talentId: string): void {
    const project = this.getProjectById(projectId);
    const actor = this.getActiveUser();
    const candidate = this.memoryState.candidates.find(item => item.projectId === projectId && item.talentId === talentId);
    if (!project || project.status !== "published" || project.selectedTalentId || !candidate || !["new", "under_review"].includes(candidate.status)) throw new Error("Dự án đã đóng tuyển hoặc hồ sơ không còn chờ duyệt.");
    if (!(actor.role === "admin" || (actor.role === "client" && actor.companyName === project.company))) throw new Error("Chỉ chủ dự án được duyệt mở chat.");
    const nextCandidates = this.memoryState.candidates.map((c) => {
      if (c.projectId === projectId && c.talentId === talentId) {
        return {
          ...c,
          status: "discussing" as const,
          chatUnlocked: true,
          chatUnlockedAt: new Date().toISOString(),
        };
      }
      return c;
    });

    // Also push a notification to the talent

    const nextNotifications: NotificationItem[] = [
      {
        id: `notif-chat-${Date.now()}`,
        userId: talentId,
        title: "Business đã mở kênh trao đổi",
        detail: `${project?.company || "Doanh nghiệp"} đã duyệt hồ sơ và mở đoạn chat cho dự án "${project?.title}".`,
        type: "chat",
        time: "Vừa xong",
        timestamp: Date.now(),
        read: false,
        href: `/projects/${projectId}/chat`,
      },
      ...this.memoryState.notifications,
    ];

    this.saveToStorage({
      ...this.memoryState,
      candidates: nextCandidates,
      notifications: nextNotifications,
    });
  }

  // --- Invitation Operations (FR-019 & BR-024: 7-Day Window) ---
  public getInvitations(projectId?: string): Invitation[] {
    if (projectId) {
      return this.memoryState.invitations.filter((i) => i.projectId === projectId);
    }
    return this.memoryState.invitations;
  }

  public createInvitation(projectId: string, talentId: string, note?: string): Invitation {
    const projectRecord = this.getProjectById(projectId);
    if (!projectRecord || projectRecord.status !== "published") throw new Error("Dự án đã ngừng tuyển.");
    const existing = this.memoryState.invitations.find(item => item.projectId === projectId && item.talentId === talentId && (item.status === "accepted" || (item.status === "pending" && Date.parse(item.expiresAt) > Date.now())));
    if (existing) return existing;
    if (businessInvitationQuota(this.memoryState.invitations, projectId).reached) throw new Error("Đã dùng hết 10 lời mời của dự án hôm nay. Lượt gửi mới mở lại lúc 00:00 giờ Việt Nam.");
    const now = new Date();
    const expires = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // Strict 7-day rule per FR-019

    const newInvitation: Invitation = {
      id: `inv-${Date.now()}`,
      projectId,
      talentId,
      status: "pending",
      sentAt: now.toISOString(),
      expiresAt: expires.toISOString(),
      note,
    };

    const nextInvitations = [newInvitation, ...this.memoryState.invitations];

    // Notification for talent
    const project = this.getProjectById(projectId);
    const nextNotifications: NotificationItem[] = [
      {
        id: `notif-inv-${Date.now()}`,
        title: "Lời mời tham gia dự án mới",
        detail: `${project?.company || "Doanh nghiệp"} đã gửi lời mời tham gia dự án "${project?.title}". Lời mời có hiệu lực trong 7 ngày.`,
        type: "invitation",
        time: "Vừa xong",
        timestamp: Date.now(),
        read: false,
        href: `/freelancer/invitations`,
      },
      ...this.memoryState.notifications,
    ];

    this.saveToStorage({
      ...this.memoryState,
      invitations: nextInvitations,
      notifications: nextNotifications,
    });

    return newInvitation;
  }

  public respondToInvitation(invitationId: string, accept: boolean): void {
    const requested = this.memoryState.invitations.find(item => item.id === invitationId);
    if (!requested || requested.status !== "pending" || Date.parse(requested.expiresAt) <= Date.now() || this.getProjectById(requested.projectId)?.status !== "published") throw new Error("Lời mời đã hết hạn hoặc dự án đã đóng tuyển.");
    let targetInv: Invitation | undefined;
    const nextInvitations = this.memoryState.invitations.map((i) => {
      if (i.id === invitationId) {
        targetInv = {
          ...i,
          status: accept ? ("accepted" as const) : ("declined" as const),
          respondedAt: new Date().toISOString(),
        };
        return targetInv;
      }
      return i;
    });

    let nextCandidates = [...this.memoryState.candidates];

    if (accept && targetInv) {
      // Per BR-005: Accepting invitation creates/updates candidate in "under_review" (Chờ Business xem xét)
      const existingCandidate = nextCandidates.find(
        (c) => c.projectId === targetInv!.projectId && c.talentId === targetInv!.talentId
      );

      if (existingCandidate) {
        nextCandidates = nextCandidates.map((c) =>
          c.id === existingCandidate.id
            ? { ...c, source: "Ứng tuyển · Lời mời" as const, status: "under_review" as const }
            : c
        );
      } else {
        const newCandidate: Candidate = {
          id: `c-inv-${Date.now()}`,
          briefAtSubmission: this.getProjectById(targetInv.projectId) ? briefSnapshot({ ...this.getProjectById(targetInv.projectId)!, briefVersion: this.getProjectById(targetInv.projectId)?.briefVersion ?? 1 }) : undefined,
          projectId: targetInv.projectId,
          talentId: targetInv.talentId,
          source: "Lời mời",
          status: "under_review", // BR-005: Chờ Business xem xét
          proposal: "Đã đồng ý lời mời hợp tác từ Business.",
          receivedAt: new Date().toISOString(),
          unread: true,
          chatUnlocked: false, // BR-005 does NOT automatically unlock chat!
          fitScore: 90,
        };
        nextCandidates = [newCandidate, ...nextCandidates];
      }
    }

    this.saveToStorage({
      ...this.memoryState,
      invitations: nextInvitations,
      candidates: nextCandidates,
    });
  }

  // --- Agreement & Proposal Operations (FR-032 3-Day Window & FR-048 Versioning) ---
  public getAgreements(projectId?: string): AgreementProposal[] {
    if (projectId) {
      return this.memoryState.agreements.filter((a) => a.projectId === projectId);
    }
    return this.memoryState.agreements;
  }

  public getEffectiveAgreement(projectId: string): AgreementProposal | undefined {
    return this.memoryState.agreements.find(
      (a) =>
        a.projectId === projectId &&
        a.isEffective &&
        a.status === "confirmed"
    );
  }

  public createAgreementProposal(
    proposal: Omit<AgreementProposal, "id" | "version" | "isEffective" | "sentAt" | "expiresAt" | "status">,
    expectedVersion?: number
  ): AgreementProposal {
    const projectRecord = this.getProjectById(proposal.projectId);
    const candidateRecord = this.memoryState.candidates.find(item => item.projectId === proposal.projectId && item.talentId === proposal.talentId);
    const owner = this.getActiveUser();
    if (!projectRecord || !(owner.role === "admin" || (owner.role === "client" && owner.companyName === projectRecord.company))) throw new Error("Chỉ chủ dự án được gửi thỏa thuận.");
    if (!candidateRecord?.chatUnlocked || !["discussing", "offer", "selected"].includes(candidateRecord.status)) throw new Error("Cần duyệt ứng viên trước khi gửi thỏa thuận.");
    if (projectRecord.status !== "published" && !(projectRecord.status === "ongoing" && projectRecord.selectedTalentId === proposal.talentId)) throw new Error("Dự án đã đóng tuyển với Provider khác.");
    const existing = this.memoryState.agreements.filter(
      (a) => a.projectId === proposal.projectId && a.talentId === proposal.talentId
    );
    const latest = [...existing].sort((a, b) => b.version - a.version)[0];
    if (expectedVersion !== undefined && expectedVersion !== (latest?.version ?? 0)) throw new Error("Đã có đề xuất mới hơn. Hãy tải lại và kiểm tra nội dung trước khi gửi.");
    if (latest && !agreementChanges(latest, proposal).length) throw new Error("Nội dung chưa thay đổi so với phiên bản mới nhất.");
    const version = (latest?.version ?? 0) + 1;
    const now = new Date();
    const expires = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // 3-day countdown per FR-032 & BR-024

    const newProposal: AgreementProposal = {
      projectId: proposal.projectId,
      talentId: proposal.talentId,
      scope: proposal.scope,
      deliverables: proposal.deliverables,
      deadline: proposal.deadline,
      budget: proposal.budget,
      budgetValue: proposal.budgetValue,
      reference: proposal.reference,
      milestones: structuredClone(proposal.milestones),
      id: `agr-${crypto.randomUUID()}`,
      createdBy: { id: owner.id, name: owner.name },
      version,
      isEffective: false, // Preserves active agreement until confirmed per FR-048
      status: "pending",
      sentAt: now.toISOString(),
      expiresAt: expires.toISOString(),
    };

    const nextAgreements = [newProposal, ...this.memoryState.agreements.map(item => item.projectId === proposal.projectId && item.talentId === proposal.talentId && item.status === "pending" ? { ...item, status: Date.parse(item.expiresAt) <= now.getTime() ? "expired" as const : "superseded" as const, isEffective: false, invalidatedAt: now.toISOString() } : item)];

    // Notification for talent
    const project = this.getProjectById(proposal.projectId);
    const nextNotifications: NotificationItem[] = [
      {
        id: crypto.randomUUID(),
        userId: candidateRecord.applicantAccountId || this.getTalentById(proposal.talentId)?.teamLeaderId || proposal.talentId,
        title: `Đề xuất hợp tác mới (Phiên bản ${version})`,
        detail: `${project?.company || "Doanh nghiệp"} đã gửi đề xuất hợp tác cho dự án "${project?.title}". Vui lòng phản hồi trong 3 ngày.`,
        type: "agreement",
        time: "Vừa xong",
        timestamp: Date.now(),
        read: false,
        href: `/projects/${proposal.projectId}/agreement?talent=${proposal.talentId}`,
      },
      ...this.memoryState.notifications,
    ];

    this.saveToStorage({
      ...this.memoryState,
      agreements: nextAgreements,
      notifications: nextNotifications,
    }, true);

    return newProposal;
  }

  /** Explicit demo action: execute provider acceptance without changing the signed-in session. */
  public simulateAgreementAcceptance(agreementId: string): void {
    if (!isDemoMode) throw new Error("Thao tác này chỉ có trong chế độ demo.");
    const agreement = this.memoryState.agreements.find(item => item.id === agreementId);
    const project = this.memoryState.projects.find(item => item.id === agreement?.projectId);
    const actor = this.getActiveUser();
    if (!agreement || !project || !(actor.role === "admin" || (actor.role === "client" && actor.companyName === project.company))) throw new Error("Chỉ chủ dự án được dùng công cụ demo này.");
    if (agreement.status === "confirmed" && agreement.confirmationSource === "demo") return;
    if (agreement.status !== "pending") throw new Error("Chỉ mô phỏng phản hồi cho đề xuất đang chờ xác nhận.");
    const candidate = this.memoryState.candidates.find(item => item.projectId === project.id && item.talentId === agreement.talentId);
    if (!candidate) throw new Error("Không tìm thấy hồ sơ Provider.");
    const talent = this.getTalentById(agreement.talentId);
    const provider: UserSession = { ...actor, id: candidate.applicantAccountId || talent?.teamLeaderId || agreement.talentId, name: talent?.name || "Provider", role: "freelancer", companyName: undefined, actingIdentity: talent?.kind === "Team" ? { type: "team", teamId: talent.id } : { type: "individual" } };
    const next = resolveAgreement({ ...this.memoryState, activeUser: provider }, agreementId, true);
    this.saveToStorage({ ...next, activeUser: actor, agreements: next.agreements.map(item => item.id === agreementId ? { ...item, confirmationSource: "demo" } : item) }, true);
  }

  public respondToAgreement(agreementId: string, accept: boolean): void {
    const next = resolveAgreement(this.memoryState, agreementId, accept);
    if (next !== this.memoryState) this.saveToStorage(next, true);
  }

  // --- Milestone & Deliverable Operations (DEC-03 & BR-014) ---
  public submitMilestoneDeliverable(
    projectId: string,
    milestoneId: string,
    notes: string,
    files?: { name: string; url: string; size: string }[]
  ): void {
    const nextAgreements = this.memoryState.agreements.map((a) => {
      if (a.projectId === projectId && a.isEffective) {
        const nextMilestones = a.milestones.map((m) =>
          m.id === milestoneId
            ? {
                ...m,
                status: "submitted" as const,
                submittedAt: new Date().toISOString(),
                submissionNotes: notes,
                submissionFiles: files || [],
              }
            : m
        );
        return { ...a, milestones: nextMilestones };
      }
      return a;
    });

    this.saveToStorage({ ...this.memoryState, agreements: nextAgreements });
  }

  public requestMilestoneRevision(projectId: string, milestoneId: string, reason: string): void {
    if (!reason || reason.trim().length === 0) {
      throw new Error("Lý do yêu cầu chỉnh sửa là bắt buộc theo quy tắc BR-014.");
    }

    const nextAgreements = this.memoryState.agreements.map((a) => {
      if (a.projectId === projectId && a.isEffective) {
        const nextMilestones = a.milestones.map((m) => {
          if (m.id === milestoneId) {
            const currentUsed = m.revisionAllowance?.used ?? 0;
            const history = m.revisionHistory || [];
            return {
              ...m,
              status: "in_progress" as const,
              revisionAllowance: {
                ...m.revisionAllowance,
                used: currentUsed + 1,
              },
              revisionHistory: [
                ...history,
                { requestedAt: new Date().toISOString(), reason: reason.trim() },
              ],
            };
          }
          return m;
        });
        return { ...a, milestones: nextMilestones };
      }
      return a;
    });

    this.saveToStorage({ ...this.memoryState, agreements: nextAgreements });
  }

  public approveMilestone(projectId: string, milestoneId: string): void {
    let approvedMilestone: Milestone | undefined;
    const nextAgreements = this.memoryState.agreements.map((a) => {
      if (a.projectId === projectId && a.isEffective) {
        const nextMilestones = a.milestones.map((m) => {
          if (m.id === milestoneId) {
            approvedMilestone = {
              ...m,
              status: "completed" as const,
              completedAt: new Date().toISOString(),
            };
            return approvedMilestone;
          }
          return m;
        });
        return { ...a, milestones: nextMilestones };
      }
      return a;
    });

    // Record Payment Simulation per DEC-04
    let nextPayments = [...this.memoryState.payments];
    if (approvedMilestone) {
      const paymentSim: PaymentSimulation = {
        id: `pay-${Date.now()}`,
        projectId,
        milestoneId,
        milestoneName: approvedMilestone.name,
        milestoneValue: approvedMilestone.amount,
        platformFeeLabel: "Chưa xác định",
        disclaimer: "Mức phí dịch vụ nền tảng đang trong giai đoạn khảo sát chính sách.",
        status: "released_simulated",
        createdAt: new Date().toISOString(),
        releasedAt: new Date().toISOString(),
      };
      nextPayments = [paymentSim, ...nextPayments];
    }

    this.saveToStorage({
      ...this.memoryState,
      agreements: nextAgreements,
      payments: nextPayments,
    });
  }

  public fundMilestone(projectId: string, milestoneId: string): void {
    const agreement = this.getEffectiveAgreement(projectId);
    const milestone = agreement?.milestones.find((m) => m.id === milestoneId);
    if (!milestone) return;

    const paymentSim: PaymentSimulation = {
      id: `pay-fund-${Date.now()}`,
      projectId,
      milestoneId,
      milestoneName: milestone.name,
      milestoneValue: milestone.amount,
      platformFeeLabel: "Chưa xác định",
      disclaimer: "Mức phí dịch vụ nền tảng đang trong giai đoạn khảo sát chính sách.",
      status: "held_simulated",
      createdAt: new Date().toISOString(),
    };

    const nextPayments = [paymentSim, ...this.memoryState.payments];
    this.saveToStorage({
      ...this.memoryState,
      payments: nextPayments,
    });
  }

  // --- Project Chat Operations (Gated per FR-045, FR-046, FR-031) ---
  public getMessages(projectId: string, talentId: string): ChatMessage[] {
    return this.memoryState.messages.filter(
      (m) => m.projectId === projectId && m.talentId === talentId
    );
  }

  public sendMessage(
    projectId: string,
    talentId: string,
    sender: "business" | "talent",
    senderName: string,
    body: string,
    attachment?: { name: string; url: string }
  ): ChatMessage {
    const candidate = this.memoryState.candidates.find(item => item.projectId === projectId && item.talentId === talentId);
    const project = this.getProjectById(projectId);
    const user = this.getActiveUser();
    const business = user.role === "client" && user.companyName === project?.company;
    const authorized = user.role === "admin" || business || (!!candidate && canManageApplication(candidate, user));
    if (!authorized || sender !== (user.role === "client" || user.role === "admin" ? "business" : "talent")) throw new Error("Bạn không có quyền gửi tin nhắn trong cuộc trao đổi này.");
    if (!project || !candidate?.chatUnlocked || candidate.status === "not_selected" || project.status === "draft" || (["ongoing", "closed", "completed"].includes(project.status) && project.selectedTalentId !== talentId)) throw new Error("Cuộc trao đổi chỉ còn quyền xem hoặc chưa được duyệt.");
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      projectId,
      talentId,
      sender,
      senderName,
      body,
      sentAt: new Date().toISOString(),
      attachmentUrl: attachment?.url,
      attachmentName: attachment?.name,
    };

    const nextMessages = [...this.memoryState.messages, newMessage];
    this.saveToStorage({ ...this.memoryState, messages: nextMessages });
    return newMessage;
  }

  // --- Notification Operations ---
  public getNotifications(): NotificationItem[] {
    return this.memoryState.notifications;
  }

  public markNotificationRead(id: string): void {
    const nextNotifications = this.memoryState.notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    this.saveToStorage({ ...this.memoryState, notifications: nextNotifications });
  }

  public markAllNotificationsRead(): void {
    const nextNotifications = this.memoryState.notifications.map((n) => ({
      ...n,
      read: true,
    }));
    this.saveToStorage({ ...this.memoryState, notifications: nextNotifications });
  }

  // --- Reviews Prototype Operations (BR-016 & FR-054) ---
  public getReviews(projectId?: string): ReviewItem[] {
    if (projectId) {
      return this.memoryState.reviews.filter((r) => r.projectId === projectId);
    }
    return this.memoryState.reviews;
  }

  public submitReview(review: Omit<ReviewItem, "id" | "createdAt">): ReviewItem {
    const newReview: ReviewItem = {
      ...review,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const nextReviews = [newReview, ...this.memoryState.reviews];
    this.saveToStorage({ ...this.memoryState, reviews: nextReviews });
    return newReview;
  }

  // --- Payment Simulation Operations (DEC-04) ---
  public getPayments(projectId?: string): PaymentSimulation[] {
    if (projectId) {
      return this.memoryState.payments.filter((p) => p.projectId === projectId);
    }
    return this.memoryState.payments;
  }
}

export const mockStorage = new MockStorageAdapter();

if (typeof window !== "undefined") {
  (window as unknown as { __frevo_storage__: MockStorageAdapter }).__frevo_storage__ = mockStorage;
}
