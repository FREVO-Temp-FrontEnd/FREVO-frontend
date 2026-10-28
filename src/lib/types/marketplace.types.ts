import type { GuidedBrief } from "./guidedBrief.types";
/**
 * FREVO Marketplace Unified Domain Types
 * Traceable to SRS (FR-001 through FR-065, BR-001 through BR-030)
 * and Full Product UI Scope Screen Specifications.
 */

import type { Work } from "./portfolio.types";
import type { SubmittedResume } from "./resume.types";
import type { ApplicantIdentity } from "./application.types";

export type UserRole = "guest" | "client" | "freelancer" | "admin";

export interface ActingIdentity {
  type: "individual" | "team";
  teamId?: string;
  teamName?: string;
  roleInTeam?: string;
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  companyName?: string;
  phone?: string;
  contactEmail?: string;
  address?: string;
  accountPreferences?: { emailOnInvite: boolean; emailOnMessage: boolean; emailOnAgreement: boolean; showProfilePublicly: boolean; allowMatchingAI: boolean };
  actingIdentity?: ActingIdentity;
  rating?: number;
  completedProjects?: number;
  verified?: boolean;
}

export type ProjectStatus =
  | "draft"          // BUS-001 / BUS-002
  | "published"      // BUS-006: Open for recruitment
  | "closed"         // FR-022 / BR-008: Đã đóng tuyển (Selected candidate / Closed recruitment)
  | "ongoing"        // In progress / Execution
  | "completed";     // FR-040: Valid project completion

export type CandidateStatus =
  | "new"            // Newly submitted
  | "under_review"   // BR-005: Chờ Business xem xét
  | "discussing"     // Active gated communication (FR-031, BR-012)
  | "offer"          // Agreement proposal sent (FR-032)
  | "selected"       // Confirmed collaboration (FR-039)
  | "not_selected";  // Declined candidate

export type CandidateSource =
  | "Ứng tuyển"
  | "Lời mời"
  | "Ứng tuyển · Lời mời";

export interface CandidateSubmission {
  /** Read model: snapshots preserve exactly what was submitted. */
  portfolioWorks: Work[];
  portfolioUrl?: string;
  resume?: SubmittedResume;
  applicantIdentity?: ApplicantIdentity;
  proposedBudget?: number | null;
  deliveryEstimate?: string;
  submittedAt: string;
}

export interface Candidate {
  briefAtSubmission?: Omit<ProjectBrief, "briefHistory">;
  id: string;
  projectId: string;
  talentId: string;
  source: CandidateSource;
  status: CandidateStatus;
  proposal: string;
  receivedAt: string;
  unread: boolean;
  chatUnlocked: boolean; // Gated candidate approval per FR-031, BR-012, BR-013
  chatUnlockedAt?: string;
  fitScore?: number;     // Heuristic match score 0-100% (DEC-01)
  submission?: CandidateSubmission;
  applicantAccountId?: string;
  permissions?: { canViewResume: boolean };
}

export type InviteStatus = "pending" | "accepted" | "declined" | "expired" | "cancelled";

export interface Invitation {
  invalidatedAt?: string;
  invalidationReason?: "selection_closed";
  id: string;
  projectId: string;
  talentId: string;
  status: InviteStatus;
  sentAt: string;
  expiresAt: string; // 7 days from sentAt per FR-019 and BR-024
  respondedAt?: string;
  note?: string;
}

export interface TalentPortfolioItem {
  id?: string;
  title: string;
  category: string;
  color: string;
  imageUrl?: string;
  tags?: string[];
  attribution?: "Cá nhân" | "Team"; // BR-027
  teamRole?: string;
}

export interface TalentProfile {
  id: string;
  name: string;
  role: string;
  kind: "Cá nhân" | "Team";
  initials: string;
  avatar?: string;
  color: string;
  location: string;
  rate: string;
  rateMin?: number;
  rateMax?: number;
  availability: string;
  skills: string[];
  about: string;
  portfolio: TalentPortfolioItem[];
  fit?: string[];
  teamMembersCount?: number;
  teamLeaderId?: string;
  verified?: boolean; // DEC-09
}

export interface RevisionAllowance {
  allowed: number | "custom"; // DEC-03: mutually agreed allowance
  used: number;               // Tracks used revision rounds
  customTerms?: string;
}

export interface MilestoneRevision {
  requestedAt: string;
  reason: string;             // Mandatory per BR-014
  resolvedAt?: string;
}

export type MilestoneStatus = "upcoming" | "in_progress" | "submitted" | "completed";

export interface Milestone {
  id: string;
  name: string;
  deliverable: string;
  deadline: string;
  amount: string;             // e.g. "8 triệu" or numeric formatted
  amountValue?: number;       // Numeric for simulated calculations
  status: MilestoneStatus;
  submittedAt?: string;
  completedAt?: string;
  submissionNotes?: string;
  submissionFiles?: { name: string; url: string; size: string }[];
  previewImage?: string;
  previewAlt?: string;
  acceptanceCriteria?: { id: string; title: string; description: string }[];
  revisionAllowance: RevisionAllowance;
  revisionHistory?: MilestoneRevision[];
}

export type AgreementStatus = "draft" | "pending" | "confirmed" | "rejected" | "expired" | "superseded";

export interface AgreementProposal {
  confirmationSource?: "provider" | "demo";
  invalidatedAt?: string;
  id?: string;
  projectId: string;
  talentId: string;
  version: number;            // FR-048
  isEffective: boolean;       // FR-048: Current active agreement remains until replacement confirmed
  scope: string;
  deliverables: string;
  deadline: string;
  budget: string;             // e.g. "24 triệu"
  budgetValue?: number;
  status: AgreementStatus;
  sentAt: string;
  expiresAt: string;          // 3 days from sentAt per FR-032 and BR-024
  confirmedAt?: string;
  rejectedAt?: string;
  reference: string;          // e.g. "FV-2026-004"
  milestones: Milestone[];
}

export interface ChatMessage {
  id: string;
  projectId: string;
  talentId: string;
  sender: "business" | "talent";
  senderName: string;
  body: string;
  sentAt: string;
  attachmentUrl?: string;
  attachmentName?: string;
}

export type NotificationType =
  | "invitation"
  | "application"
  | "chat"
  | "agreement"
  | "milestone"
  | "review"
  | "system";

export interface NotificationItem {
  recipientCompany?: string;
  id: string;
  userId?: string;
  title: string;
  detail: string;
  type: NotificationType;
  time: string;
  timestamp: number;
  read: boolean;
  href: string;
}

export interface ReviewItem {
  id: string;
  projectId: string;
  reviewerRole: "business" | "talent";
  reviewerId: string;
  reviewerName: string;
  targetId: string;
  rating: number; // 1-5 stars
  comment: string;
  createdAt: string;
}

export interface PaymentSimulation {
  id: string;
  projectId: string;
  milestoneId: string;
  milestoneName: string;
  milestoneValue: string;
  platformFeeLabel: "Chưa xác định"; // DEC-04
  disclaimer: "Mức phí dịch vụ nền tảng đang trong giai đoạn khảo sát chính sách."; // DEC-04
  status: "held_simulated" | "released_simulated";
  createdAt: string;
  releasedAt?: string;
}

export interface ProjectBrief {
  tools?: string[];
  experience?: string;
  audience?: string;
  requirements?: string[];
  briefVersion?: number;
  briefHistory?: ProjectBriefRevision[];
  guidedBrief?: GuidedBrief;
  id: string;
  title: string;
  category: string;
  type?: "uiux" | "brand" | "motion" | "content";
  company: string;
  companyLogo?: string;
  city?: string;
  remote: boolean;
  budget: string;             // e.g. "15–25 triệu"
  budgetMin?: number;
  budgetMax?: number;
  duration: string;
  deadline: string;
  applicationDeadline: string;
  skills: string[];
  description: string;
  deliverables: string[];
  referenceFiles?: { name: string; size: number }[]; // Local prototype metadata only; no file content upload.
  preference: "both" | "individual" | "team";
  status: ProjectStatus;
  createdAt: string;
  publishedAt?: string;
  closedAt?: string;
  completedAt?: string;
  selectedTalentId?: string;
  heroImage?: string;
}

export interface MarketplaceState {
  businessQuotaEvents?: { id: string; projectId: string; policyVersion: string; createdAt: string; kind: "project_soft_limit" }[];
  portfolioSeedVersion?: number;
  projects: ProjectBrief[];
  talents: TalentProfile[];
  candidates: Candidate[];
  invitations: Invitation[];
  agreements: AgreementProposal[];
  messages: ChatMessage[];
  notifications: NotificationItem[];
  reviews: ReviewItem[];
  payments: PaymentSimulation[];
  activeUser: UserSession;
}

/** Immutable before/after snapshots; agreement versions remain independent. */
export interface ProjectBriefRevision {
  version: number;
  changedAt: string;
  changedBy: { id: string; name: string };
  fields: string[];
  before: Omit<ProjectBrief, "briefHistory">;
  after: Omit<ProjectBrief, "briefHistory">;
}
