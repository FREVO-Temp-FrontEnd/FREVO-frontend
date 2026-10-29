import type { MarketplaceState, NotificationItem } from "@/lib/types/marketplace.types";
import { canManageApplication } from "./applicationAccess";

/** Synchronous prototype transaction. A production API must enforce this atomically in its database. */
export function resolveAgreement(state: MarketplaceState, agreementId: string, accept: boolean, now = Date.now()): MarketplaceState {
  const agreement = state.agreements.find(item => item.id === agreementId);
  if (!agreement) throw new Error("Không tìm thấy đề xuất thỏa thuận.");
  const project = state.projects.find(item => item.id === agreement.projectId);
  const candidate = state.candidates.find(item => item.projectId === agreement.projectId && item.talentId === agreement.talentId);
  if (!project || !candidate || !canManageApplication(candidate, state.activeUser)) throw new Error("Chỉ tài khoản đại diện đúng Provider được phản hồi thỏa thuận.");
  if (accept && agreement.status === "confirmed" && agreement.isEffective && project.selectedTalentId === agreement.talentId) return state;
  if (agreement.status !== "pending") throw new Error("Đề xuất không còn chờ xác nhận.");
  if (!Number.isFinite(Date.parse(agreement.expiresAt)) || Date.parse(agreement.expiresAt) <= now) throw new Error("Đề xuất đã hết hạn. Vui lòng yêu cầu phiên bản mới.");
  if (state.agreements.some(item => item.projectId === project.id && item.talentId === agreement.talentId && item.version > agreement.version)) throw new Error("Đã có phiên bản mới hơn. Vui lòng xem lại trước khi phản hồi.");
  if (state.candidates.some(item => item.projectId === project.id && item.status === "selected" && item.talentId !== agreement.talentId)) throw new Error("Dự án đã có Provider được chọn.");
  if (project.selectedTalentId && project.selectedTalentId !== agreement.talentId) throw new Error("Dự án đã chọn Provider khác.");
  if (!(project.status === "published" || (project.status === "ongoing" && project.selectedTalentId === agreement.talentId))) throw new Error("Dự án không còn cho phép xác nhận đề xuất này.");
  if (!candidate.chatUnlocked || !["discussing", "offer", "selected"].includes(candidate.status)) throw new Error("Hồ sơ chưa được duyệt hoặc không còn hợp lệ.");
  const timestamp = new Date(now).toISOString();
  const recipient = (talentId: string) => {
    const record = state.candidates.find(item => item.projectId === project.id && item.talentId === talentId);
    return record?.applicantAccountId || state.talents.find(item => item.id === talentId)?.teamLeaderId || talentId;
  };
  const owners = state.activeUser.companyName === project.company && state.activeUser.role === "client" ? [state.activeUser.id] : [`business:${project.company}`];
  const notices: NotificationItem[] = [];
  const notify = (userId: string, title: string, href: string) => notices.push({ id: crypto.randomUUID(), userId: userId.startsWith("business:") ? undefined : userId, recipientCompany: userId.startsWith("business:") ? project.company : undefined, title, detail: project.title, type: "agreement", time: "Vừa xong", timestamp: now, read: false, href });
  if (!accept) {
    owners.forEach(id => notify(id, "Provider đã từ chối đề xuất thỏa thuận", `/business/projects/${project.id}/agreement?talent=${agreement.talentId}`));
    return { ...state, agreements: state.agreements.map(item => item.id === agreement.id ? { ...item, status: "rejected", rejectedAt: timestamp, isEffective: false } : item), notifications: [...notices, ...state.notifications] };
  }
  const firstSelection = !project.selectedTalentId;
  const losingIds = new Set([
    ...state.candidates.filter(item => item.projectId === project.id && item.talentId !== agreement.talentId).map(item => item.talentId),
    ...state.invitations.filter(item => item.projectId === project.id && item.status === "pending" && item.talentId !== agreement.talentId).map(item => item.talentId),
  ]);
  notify(recipient(agreement.talentId), firstSelection ? "Bạn đã được chọn thực hiện dự án" : "Đã xác nhận phiên bản thỏa thuận mới", `/projects/${project.id}/agreement?talent=${agreement.talentId}`);
  owners.forEach(id => notify(id, firstSelection ? "Đã chốt Provider và đóng tuyển" : "Provider đã xác nhận điều chỉnh thỏa thuận", `/business/projects/${project.id}/agreement?talent=${agreement.talentId}`));
  if (firstSelection) losingIds.forEach(id => notify(recipient(id), "Dự án đã đóng tuyển · Hồ sơ không được chọn", `/freelancer/applications`));
  return {
    ...state,
    projects: state.projects.map(item => item.id === project.id ? { ...item, status: "ongoing", selectedTalentId: agreement.talentId, closedAt: item.closedAt || timestamp } : item),
    candidates: state.candidates.map(item => item.projectId !== project.id ? item : item.talentId === agreement.talentId ? { ...item, status: "selected" } : { ...item, status: "not_selected" }),
    invitations: state.invitations.map(item => item.projectId === project.id && item.status === "pending" ? { ...item, status: "cancelled", invalidatedAt: timestamp, invalidationReason: "selection_closed" } : item),
    agreements: state.agreements.map(item => {
      if (item.projectId !== project.id) return item;
      if (item.id === agreement.id) return { ...item, status: "confirmed", isEffective: true, confirmedAt: timestamp };
      return item.status === "pending" ? { ...item, status: "superseded", isEffective: false, invalidatedAt: timestamp } : { ...item, isEffective: false };
    }),
    notifications: [...notices, ...state.notifications],
  };
}
