import type { UserSession } from "../types/marketplace.types";

const accountKey = (email: string) => `frevo_account_identity_v1:${encodeURIComponent(email.trim().toLowerCase())}`;

export function rememberAccountIdentity(user: UserSession, storage: Storage = localStorage): void {
  if (user.role !== "guest" && user.email.trim()) storage.setItem(accountKey(user.email), user.id);
}

export function resolveAccountIdentity(email: string, storage: Storage = localStorage): string {
  const normalized = email.trim().toLowerCase();
  const saved = storage.getItem(accountKey(normalized));
  if (saved) return saved;
  // Older team records retain their representative's ID across logout.
  try {
    const teams: unknown = JSON.parse(storage.getItem(`frevo_team_management_v2:${encodeURIComponent(normalized)}`) ?? "null");
    if (Array.isArray(teams)) {
      for (const team of teams) {
        const leader = Array.isArray(team?.members) ? team.members.find((member: { isLeader?: boolean; email?: string; id?: string }) => member?.isLeader && typeof member.email === "string" && member.email.trim().toLowerCase() === normalized && typeof member.id === "string") : undefined;
        if (leader) return leader.id;
      }
    }
  } catch {
    // Preserve unreadable team data; a new login must not overwrite it.
  }
  return `user:${encodeURIComponent(normalized)}`;
}
