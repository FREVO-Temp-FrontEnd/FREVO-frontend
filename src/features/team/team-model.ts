export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  isLeader: boolean;
}

export interface TeamInvitation {
  id: string;
  email: string;
  role: string;
  message: string;
  status: "pending" | "accepted" | "revoked";
  sentAt: string;
  resent: boolean;
}

export interface TeamProfile {
  name: string;
  summary: string;
  discipline: string;
  members: TeamMember[];
  invitations: TeamInvitation[];
}

export interface ManagedTeam extends TeamProfile {
  id: string;
}

export type TeamBasics = Pick<TeamProfile, "name" | "summary" | "discipline">;
export type InvitationDraft = Pick<TeamInvitation, "email" | "role" | "message">;

export const teamDisciplines = ["Thiết kế thương hiệu", "UI/UX Design", "Minh họa", "Video & Motion", "Nội dung sáng tạo"];

export function validateTeam(basics: TeamBasics): Partial<Record<keyof TeamBasics, string>> {
  return {
    ...(!basics.name.trim() || basics.name.trim().length > 60 ? { name: "Nhập tên nhóm từ 1 đến 60 ký tự." } : {}),
    ...(!basics.summary.trim() || basics.summary.trim().length > 240 ? { summary: "Nhập giới thiệu từ 1 đến 240 ký tự." } : {}),
    ...(!teamDisciplines.includes(basics.discipline) ? { discipline: "Vui lòng chọn chuyên môn chính." } : {}),
  };
}

export function validateInvitation(team: TeamProfile, draft: InvitationDraft): Partial<Record<keyof InvitationDraft, string>> {
  const email = draft.email.trim().toLowerCase();
  let emailError = "";
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) emailError = "Vui lòng nhập địa chỉ email hợp lệ.";
  else if (team.members.some(member => member.email.toLowerCase() === email)) emailError = "Email này đã là thành viên của nhóm.";
  else if (team.invitations.some(invite => invite.email === email && invite.status === "pending")) emailError = "Email này đang có lời mời chờ phản hồi.";
  return {
    ...(emailError ? { email: emailError } : {}),
    ...(!draft.role.trim() || draft.role.trim().length > 80 ? { role: "Nhập vai trò chuyên môn từ 1 đến 80 ký tự." } : {}),
    ...(draft.message.trim().length > 500 ? { message: "Lời nhắn tối đa 500 ký tự." } : {}),
  };
}

export function acceptTeamInvitation(team: TeamProfile, invitationId: string, memberName: string): TeamProfile {
  const invitation = team.invitations.find(item => item.id === invitationId && item.status === "pending");
  if (!invitation) throw new Error("Lời mời này không còn chờ phản hồi.");
  const name = memberName.trim();
  if (!name || name.length > 80) throw new Error("Nhập tên thành viên từ 1 đến 80 ký tự.");
  if (team.members.some(member => member.email.toLowerCase() === invitation.email.toLowerCase())) throw new Error("Email này đã là thành viên của nhóm.");
  return {
    ...team,
    members: [...team.members, { id: crypto.randomUUID(), name, email: invitation.email, role: invitation.role, isLeader: false }],
    invitations: team.invitations.map(item => item.id === invitationId ? { ...item, status: "accepted" } : item),
  };
}

export function parseTeam(raw: string): TeamProfile | null {
  const value: unknown = JSON.parse(raw);
  if (value === null) return null;
  if (typeof value !== "object") throw new Error("Invalid team data");
  const team = value as Record<string, unknown>;
  if (typeof team.name !== "string" || typeof team.summary !== "string" || typeof team.discipline !== "string"
    || !Array.isArray(team.members) || !Array.isArray(team.invitations)
    || !team.members.every((m: unknown) => !!m && typeof m === "object" && "id" in m && typeof m.id === "string" && "name" in m && typeof m.name === "string" && "email" in m && typeof m.email === "string" && "role" in m && typeof m.role === "string" && "isLeader" in m && typeof m.isLeader === "boolean")
    || !team.invitations.every((i: unknown) => !!i && typeof i === "object" && "id" in i && typeof i.id === "string" && "email" in i && typeof i.email === "string" && "role" in i && typeof i.role === "string" && "message" in i && typeof i.message === "string" && "status" in i && (i.status === "pending" || i.status === "accepted" || i.status === "revoked") && "sentAt" in i && typeof i.sentAt === "string" && Number.isFinite(Date.parse(i.sentAt)) && "resent" in i && typeof i.resent === "boolean")) {
    throw new Error("Invalid team data");
  }
  const profile = value as TeamProfile;
  if (Object.keys(validateTeam(profile)).length || profile.members.filter(member => member.isLeader).length !== 1) throw new Error("Invalid team data");
  return profile;
}

export function parseTeams(raw: string): ManagedTeam[] {
  const value: unknown = JSON.parse(raw);
  if (!Array.isArray(value) || !value.every(item => !!item && typeof item === "object" && typeof item.id === "string" && item.id.length > 0)) throw new Error("Invalid teams data");
  const teams = value.map(item => ({ ...parseTeam(JSON.stringify(item)), id: item.id }) as ManagedTeam);
  if (new Set(teams.map(team => team.id)).size !== teams.length) throw new Error("Duplicate team IDs");
  return teams;
}

export function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map(word => word[0]).join("").toUpperCase();
}
