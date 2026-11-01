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
  isSample?: boolean;
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

// Older mock logins used a different ID for the same email-owned team record.
export function restoreTeamRepresentative(teams: ManagedTeam[], user: { id: string; email: string }): ManagedTeam[] {
  const email = user.email.trim().toLowerCase();
  return teams.map(team => ({ ...team, members: team.members.map(member =>
    member.isLeader && email && member.email.trim().toLowerCase() === email
      ? { ...member, id: user.id } : member) }));
}

export function syncTeamProfiles(teams: ManagedTeam[], sync: (team: ManagedTeam) => void): string {
  const failures: string[] = [];
  for (const team of teams) {
    try { sync(team); } catch (cause) {
      failures.push(team.name + ': ' + (cause instanceof Error ? cause.message : 'Vui lòng thử lại.'));
    }
  }
  return failures.length ? 'Đã tải nhóm, nhưng chưa đồng bộ được hồ sơ công khai. ' + failures.join(' ') : '';
}

export function ensureSampleTeam(teams: ManagedTeam[], user: { id: string; name: string; email: string }): ManagedTeam[] {
  if (teams.some(team => team.isSample || team.name.trim().toLocaleLowerCase('vi') === 'mây creative')) return teams;
  return [...teams, {
    id: 'may-creative-demo', name: 'Mây Creative', isSample: true,
    summary: 'Nhóm mẫu thiết kế nhận diện thương hiệu và bao bì cho doanh nghiệp nhỏ.', discipline: 'Thiết kế thương hiệu',
    members: [
      { id: user.id, name: user.name, email: user.email, role: 'Định hướng sáng tạo', isLeader: true },
      { id: 'quoc-huy-demo', name: 'Quốc Huy', email: 'quochuy@example.com', role: 'Thiết kế nhận diện', isLeader: false },
      { id: 'thuy-trang-demo', name: 'Thùy Trang', email: 'thuytrang@example.com', role: 'Minh họa & hình ảnh', isLeader: false },
    ], invitations: [],
  }];
}
