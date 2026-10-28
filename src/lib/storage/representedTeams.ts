import type { UserSession } from "@/lib/types/marketplace.types";

export interface RepresentedTeam {
  id: string;
  name: string;
  summary: string;
  discipline: string;
  memberCount: number;
}

export function readRepresentedTeams(user: UserSession): RepresentedTeam[] {
  const account = encodeURIComponent(user.email.trim().toLowerCase() || user.id);
  const raw = localStorage.getItem(`frevo_team_management_v2:${account}`);
  if (!raw) return [];
  const value: unknown = JSON.parse(raw);
  if (!Array.isArray(value)) throw new Error("Không đọc được danh sách nhóm. Hãy mở trang Nhóm và thử lại.");
  return value.map((team: unknown) => {
    if (!team || typeof team !== "object") throw new Error("Dữ liệu nhóm không hợp lệ.");
    const record = team as Record<string, unknown>;
    if (typeof record.id !== "string" || !record.id || typeof record.name !== "string" || !record.name.trim()
      || typeof record.summary !== "string" || typeof record.discipline !== "string" || !Array.isArray(record.members)) throw new Error("Dữ liệu nhóm không hợp lệ.");
    return { id: record.id, name: record.name, summary: record.summary, discipline: record.discipline, memberCount: record.members.length };
  });
}
