import { businessQuotaPolicy as policy } from "@/lib/config/businessQuota";
import type { Invitation, ProjectBrief } from "@/lib/types/marketplace.types";

export function quotaDay(timestamp: string | number) {
  const date = new Date(timestamp);
  return Number.isNaN(date.getTime()) ? "" : new Intl.DateTimeFormat("en-CA", { timeZone: policy.timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}

export function businessProjectQuota(projects: ProjectBrief[], company: string) {
  const used = projects.filter(project => project.company === company && project.status === "published").length;
  return { used, limit: policy.activeProjects, remaining: Math.max(0, policy.activeProjects - used), reached: used >= policy.activeProjects, mode: policy.projectMode };
}

export function businessInvitationQuota(invitations: Invitation[], projectId: string, now = Date.now()) {
  const today = quotaDay(now);
  const used = invitations.filter(invitation => invitation.projectId === projectId && quotaDay(invitation.sentAt) === today).length;
  return { used, limit: policy.invitationsPerProjectPerDay, remaining: Math.max(0, policy.invitationsPerProjectPerDay - used), reached: used >= policy.invitationsPerProjectPerDay };
}
