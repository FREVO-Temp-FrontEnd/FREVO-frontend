import type { AgreementProposal, Candidate, UserSession } from "../types/marketplace.types";

export function canManageApplication(candidate: Candidate, user: UserSession): boolean {
  if (user.role !== "freelancer") return false;
  // Ownerless Minh Anh records are shared demo fixtures, as before team filtering.
  return candidate.applicantAccountId ? candidate.applicantAccountId === user.id : candidate.talentId === user.id || candidate.talentId === "minh-anh";
}

// Team membership is a local prototype record; pending invitations grant no access.
export function applicationTeamIds(user: UserSession, storage: Storage = localStorage): Set<string> {
  const ids = new Set<string>();
  const email = user.email.trim().toLowerCase();
  if (!email || user.role !== "freelancer") return ids;
  for (let index = 0; index < storage.length; index++) {
    const key = storage.key(index);
    if (!key?.startsWith("frevo_team_management_v2:")) continue;
    try {
      const teams: unknown = JSON.parse(storage.getItem(key) ?? "null");
      if (!Array.isArray(teams)) continue;
      for (const team of teams) {
        if (!team || typeof team.id !== "string" || !Array.isArray(team.members)) continue;
        const leader = team.members.find((member: { isLeader?: boolean; id?: string }) => member?.isLeader && typeof member.id === "string");
        if (leader && team.members.some((member: { email?: string }) => typeof member?.email === "string" && member.email.trim().toLowerCase() === email)) {
          ids.add(`managed-team:${leader.id}:${team.id}`);
        }
      }
    } catch {
      // Ignore a damaged team's record without hiding other applications.
    }
  }
  return ids;
}

// Execution belongs to the selected application account, independent of the active persona.
export function canManageWorkspace(agreement: Pick<AgreementProposal, 'projectId' | 'talentId'>, candidates: Candidate[], user: UserSession): boolean {
  return candidates.some(candidate => candidate.projectId === agreement.projectId
    && candidate.talentId === agreement.talentId && candidate.status === 'selected'
    && canManageApplication(candidate, user));
}
