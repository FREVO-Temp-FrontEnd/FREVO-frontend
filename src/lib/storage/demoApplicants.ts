import type { Candidate, MarketplaceState, ProjectBrief } from "@/lib/types/marketplace.types";

export const DEMO_APPLICATION_DELAY = 5000;

/** Generates a single persisted batch, respecting executor identity and review gating. */
export function demoApplicants(project: ProjectBrief, state: MarketplaceState, now: number): Candidate[] {
  if (project.status !== "published" || !project.demoApplicationsDueAt || project.demoApplicationsCompleted || now < project.demoApplicationsDueAt) return [];
  const [day, month, year] = project.applicationDeadline.split("/").map(Number);
  if (year && now >= new Date(year, month - 1, day + 1).getTime()) return [];
  const existing = state.candidates.filter(candidate => candidate.projectId === project.id);
  const accounts = new Set(existing.map(candidate => candidate.applicantAccountId || state.talents.find(talent => talent.id === candidate.talentId)?.teamLeaderId || candidate.talentId));
  return state.talents.filter(talent => {
    const account = talent.teamLeaderId || talent.id;
    if (existing.some(candidate => candidate.talentId === talent.id) || accounts.has(account)) return false;
    if (project.preference === "individual" && talent.kind !== "Cá nhân") return false;
    if (project.preference === "team" && talent.kind !== "Team") return false;
    accounts.add(account);
    return true;
  }).slice(0, 2).map(talent => ({
    id: `c-demo-${project.id}-${talent.id}`, projectId: project.id, talentId: talent.id,
    applicantAccountId: talent.teamLeaderId || talent.id,
    source: "Ứng tuyển", status: "new", unread: true, chatUnlocked: false,
    proposal: `Tôi quan tâm đến dự án “${project.title}” và muốn trao đổi về phạm vi công việc.`,
    receivedAt: new Date(now).toISOString(),
  }));
}
