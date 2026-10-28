import { useCallback, useEffect, useState } from "react";
import type { UserSession } from "@/lib/types/marketplace.types";
import { acceptTeamInvitation, parseTeam, parseTeams, validateInvitation, validateTeam, type InvitationDraft, type ManagedTeam, type TeamBasics } from "../team-model";

// TEAM-001/002, FR-063, FLOW-05. Invitations are local simulations, not linked member accounts.
export function useTeamManagement(user: UserSession) {
  const account = encodeURIComponent(user.email.trim().toLowerCase() || user.id);
  const storageKey = `frevo_team_management_v2:${account}`;
  const legacyKey = `frevo_team_management_v1:${account}`;
  const [teams, setTeams] = useState<ManagedTeam[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const team = teams.find(item => item.id === selectedId) || teams[0] || null;

  const load = useCallback(() => {
    setLoading(true);
    try {
      const raw = localStorage.getItem(storageKey);
      let stored: ManagedTeam[];
      if (raw !== null) stored = parseTeams(raw);
      else {
        const previous = localStorage.getItem(legacyKey);
        const legacy = previous === null ? null : parseTeam(previous);
        const fallback = legacy || (previous === null && user.actingIdentity?.type === "team" ? {
          name: user.actingIdentity.teamName || "Nhóm sáng tạo",
          summary: "Nhóm thiết kế thương hiệu và sản phẩm số.",
          discipline: "Thiết kế thương hiệu",
          members: [{ id: user.id, name: user.name, email: user.email, role: "Người đại diện", isLeader: true }],
          invitations: [],
        } : null);
        stored = fallback ? [{ ...fallback, id: crypto.randomUUID() }] : [];
        if (stored.length) localStorage.setItem(storageKey, JSON.stringify(stored));
      }
      setTeams(stored);
      setSelectedId(current => stored.some(item => item.id === current) ? current : stored[0]?.id || "");
      setError("");
    } catch {
      setError("Chưa đọc được dữ liệu nhóm đã lưu. Vui lòng thử lại; dữ liệu hiện tại được giữ nguyên.");
    } finally {
      setLoading(false);
    }
  }, [storageKey, legacyKey, user.id, user.email, user.name, user.actingIdentity?.type, user.actingIdentity?.teamName]);

  useEffect(() => { load(); }, [load]);

  function save(next: ManagedTeam[], message: string) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
      setTeams(next);
      setError("");
      setNotice(message);
      return "";
    } catch {
      return "Chưa lưu được thay đổi trên trình duyệt. Vui lòng thử lại hoặc kiểm tra dung lượng lưu trữ.";
    }
  }

  function saveBasics(basics: TeamBasics, create = false) {
    if (Object.keys(validateTeam(basics)).length) return "Vui lòng kiểm tra thông tin nhóm.";
    const name = basics.name.trim();
    if (teams.some(item => item.name.toLocaleLowerCase("vi") === name.toLocaleLowerCase("vi") && (create || item.id !== team?.id))) return "Tên nhóm này đã có trong danh sách.";
    if (create || !team) {
      const created: ManagedTeam = {
        ...basics, id: crypto.randomUUID(), name, summary: basics.summary.trim(),
        members: [{ id: user.id, name: user.name, email: user.email, role: "Người đại diện", isLeader: true }], invitations: [],
      };
      const result = save([...teams, created], "Đã tạo nhóm. Bạn có thể mời cộng sự qua email.");
      if (!result) setSelectedId(created.id);
      return result;
    }
    return save(teams.map(item => item.id === team.id ? { ...item, ...basics, name, summary: basics.summary.trim() } : item), "Đã cập nhật hồ sơ nhóm.");
  }

  function invite(draft: InvitationDraft) {
    if (!team) return "Vui lòng tạo nhóm trước khi mời thành viên.";
    if (Object.keys(validateInvitation(team, draft)).length) return "Vui lòng kiểm tra thông tin lời mời.";
    return save(teams.map(item => item.id === team.id ? { ...item, invitations: [...item.invitations, {
      id: crypto.randomUUID(), email: draft.email.trim().toLowerCase(), role: draft.role.trim(), message: draft.message.trim(),
      status: "pending" as const, sentAt: new Date().toISOString(), resent: false,
    }] } : item), "Đã tạo lời mời mô phỏng. Không có email thật được gửi.");
  }

  function updateInvitation(id: string, action: "resend" | "revoke") {
    if (!team || !team.invitations.some(invitation => invitation.id === id && invitation.status === "pending")) return "Lời mời này không còn ở trạng thái chờ phản hồi.";
    return save(teams.map(item => item.id === team.id ? { ...item, invitations: item.invitations.map(invitation => invitation.id !== id ? invitation : {
      ...invitation, status: action === "revoke" ? "revoked" as const : "pending" as const,
      resent: action === "resend" || invitation.resent,
      sentAt: action === "resend" ? new Date().toISOString() : invitation.sentAt,
    }) } : item), action === "resend" ? "Đã gửi lại lời mời mô phỏng." : "Đã thu hồi lời mời mô phỏng.");
  }

  function acceptInvitation(id: string, name: string) {
    if (!team) return "Không tìm thấy nhóm của lời mời.";
    try {
      const accepted = acceptTeamInvitation(team, id, name);
      return save(teams.map(item => item.id === team.id ? { ...accepted, id: team.id } : item), "Đã mô phỏng chấp nhận lời mời. Thành viên đã được thêm vào nhóm.");
    } catch (cause) {
      return cause instanceof Error ? cause.message : "Chưa thể chấp nhận lời mời.";
    }
  }

  return { teams, team, selectedId, selectTeam: setSelectedId, loading, error, notice, clearNotice: () => setNotice(""), retry: load, saveBasics, invite, updateInvitation, acceptInvitation };
}
