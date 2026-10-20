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
    portfolio: [
      { id: "lum-coffee", title: "Lúm Coffee", category: "Nhận diện thương hiệu", color: "#d8a983", attribution: "Cá nhân" },
      { id: "moc-packaging", title: "Mộc", category: "Bao bì sản phẩm", color: "#c6cfbd", attribution: "Cá nhân" },
    ],
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
    portfolio: [
      { id: "lala-id", title: "Lala", category: "Hệ nhận diện", color: "#c9ccd5", attribution: "Team", teamRole: "Art Director & Lead Designer" },
      { id: "som-campaign", title: "Sớm", category: "Chiến dịch ra mắt", color: "#edcba9", attribution: "Team", teamRole: "Visual Identity" },
    ],
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
    portfolio: [
      { id: "tia-brandbook", title: "Tía", category: "Brandbook", color: "#d4b2ad", attribution: "Cá nhân" },
      { id: "net-studio-vi", title: "Nét Studio", category: "Visual identity", color: "#d9d3c0", attribution: "Cá nhân" },
    ],
    fit: ["Kinh nghiệm nhận diện", "Đúng khoảng ngân sách", "Sẵn sàng ngay"],
    verified: false,
  },
  {
    id: "ha-vy",
    name: "Hà Vy",
    role: "Brand & Packaging Designer",
    kind: "Cá nhân",
    initials: "HV",
    color: "#f2d7c5",
    location: "TP. Hồ Chí Minh",
    rate: "20–25 triệu / dự án",
    rateMin: 20000000,
    rateMax: 25000000,
    availability: "Có thể bắt đầu ngay",
    skills: ["Brand identity", "Packaging", "Illustration"],
    about:
      "Thiết kế hình ảnh thương hiệu và bao bì cho sản phẩm lifestyle, thực phẩm và cửa hàng độc lập.",
    portfolio: [
      { id: "nau-market", title: "Nâu Market", category: "Bao bì", color: "#d9bc9f", attribution: "Cá nhân" },
      { id: "ri-rao", title: "Rì Rào", category: "Nhận diện", color: "#c9d9c8", attribution: "Cá nhân" },
    ],
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
    portfolio: [
      { id: "mua-vi", title: "Mùa", category: "Nhận diện", color: "#dbb7b5", attribution: "Team" },
      { id: "cham-camp", title: "Chạm", category: "Campaign", color: "#e8d2ad", attribution: "Team" },
    ],
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
    projectId: "nang-brand",
    talentId: "minh-anh",
    source: "Ứng tuyển",
    status: "new",
    proposal:
      "Mình muốn xây dựng một hệ nhận diện linh hoạt, từ logo đến bao bì. Hai dự án Lúm Coffee và Mộc trong portfolio có phạm vi khá gần với brief này.",
    receivedAt: "2026-10-18T09:42:00.000Z",
    unread: true,
    chatUnlocked: false, // Locked until Business candidate review (BUS-013)
    fitScore: 92,
  },
  {
    id: "c2",
    projectId: "nang-brand",
    talentId: "may-creative",
    source: "Ứng tuyển",
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
    href: "/business/projects/nang-brand/messages?talent=khanh-linh",
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
        const state = JSON.parse(stored) as MarketplaceState;
        const alreadyPrepared = localStorage.getItem(PENDING_CANDIDATES_DEMO_KEY) || sessionStorage.getItem(PENDING_CANDIDATES_DEMO_KEY);
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

  private saveToStorage(state: MarketplaceState): void {
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
    const existingIndex = this.memoryState.projects.findIndex((p) => p.id === project.id);
    let updatedProjects: ProjectBrief[];
    if (existingIndex >= 0) {
      updatedProjects = [...this.memoryState.projects];
      updatedProjects[existingIndex] = project;
    } else {
      updatedProjects = [project, ...this.memoryState.projects];
    }
    this.saveToStorage({ ...this.memoryState, projects: updatedProjects });
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
  public submitApplication(projectId: string, talentId: string, proposal: string): Candidate {
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
      };
      nextCandidates = this.memoryState.candidates.map((c) =>
        c.id === existing.id ? candidateRecord : c
      );
    } else {
      candidateRecord = {
        id: `c-app-${Date.now()}`,
        projectId,
        talentId,
        source: "Ứng tuyển",
        status: "new",
        proposal,
        receivedAt: new Date().toISOString(),
        unread: true,
        chatUnlocked: false, // BR-012: locked until Business review
        fitScore: 88,
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
    const project = this.getProjectById(projectId);
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
    proposal: Omit<AgreementProposal, "id" | "version" | "isEffective" | "sentAt" | "expiresAt" | "status">
  ): AgreementProposal {
    const existing = this.memoryState.agreements.filter(
      (a) => a.projectId === proposal.projectId && a.talentId === proposal.talentId
    );
    const version = existing.length + 1;
    const now = new Date();
    const expires = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // 3-day countdown per FR-032 & BR-024

    const newProposal: AgreementProposal = {
      ...proposal,
      id: `agr-${Date.now()}`,
      version,
      isEffective: false, // Preserves active agreement until confirmed per FR-048
      status: "pending",
      sentAt: now.toISOString(),
      expiresAt: expires.toISOString(),
    };

    const nextAgreements = [newProposal, ...this.memoryState.agreements];

    // Notification for talent
    const project = this.getProjectById(proposal.projectId);
    const nextNotifications: NotificationItem[] = [
      {
        id: `notif-agr-${Date.now()}`,
        title: `Đề xuất hợp tác mới (Phiên bản ${version})`,
        detail: `${project?.company || "Doanh nghiệp"} đã gửi đề xuất hợp tác cho dự án "${project?.title}". Vui lòng phản hồi trong 3 ngày.`,
        type: "agreement",
        time: "Vừa xong",
        timestamp: Date.now(),
        read: false,
        href: `/projects/${proposal.projectId}/agreement`,
      },
      ...this.memoryState.notifications,
    ];

    this.saveToStorage({
      ...this.memoryState,
      agreements: nextAgreements,
      notifications: nextNotifications,
    });

    return newProposal;
  }

  public respondToAgreement(agreementId: string, accept: boolean): void {
    let targetAgr: AgreementProposal | undefined;
    const nextAgreements = this.memoryState.agreements.map((a) => {
      if (a.id === agreementId) {
        targetAgr = {
          ...a,
          status: accept ? ("confirmed" as const) : ("rejected" as const),
          confirmedAt: accept ? new Date().toISOString() : undefined,
          rejectedAt: !accept ? new Date().toISOString() : undefined,
          isEffective: accept, // Becomes the effective version if confirmed per FR-048
        };
        return targetAgr;
      }
      // If confirmed, deactivate any older versions for this project per FR-048
      if (accept && targetAgr && a.projectId === targetAgr.projectId) {
        return { ...a, isEffective: false };
      }
      return a;
    });

    let nextProjects = [...this.memoryState.projects];
    let nextCandidates = [...this.memoryState.candidates];

    if (accept && targetAgr) {
      // Transition project status to ongoing and lock recruitment (FR-022)
      nextProjects = nextProjects.map((p) =>
        p.id === targetAgr!.projectId
          ? {
              ...p,
              status: "ongoing" as const,
              selectedTalentId: targetAgr!.talentId,
              closedAt: p.closedAt || new Date().toISOString(),
            }
        : p
      );

      // Transition candidate status to selected
      nextCandidates = nextCandidates.map((c) =>
        c.projectId === targetAgr!.projectId && c.talentId === targetAgr!.talentId
          ? { ...c, status: "selected" as const }
          : c
      );
    }

    this.saveToStorage({
      ...this.memoryState,
      agreements: nextAgreements,
      projects: nextProjects,
      candidates: nextCandidates,
    });
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
