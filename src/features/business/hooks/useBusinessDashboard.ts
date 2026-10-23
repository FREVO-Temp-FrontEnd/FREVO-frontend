import { useState } from "react";
import { useBusiness } from "@/lib/hooks/useBusiness";

interface DashboardTask {
  id: string;
  title: string;
  detail: string;
  href: string;
  action: string;
  kind: "candidate" | "milestone" | "message";
}

function deadlineValue(value: string) {
  const [day, month, year] = value.split("/").map(Number);
  return day && month && year ? new Date(year, month - 1, day).getTime() : Number.POSITIVE_INFINITY;
}

export function useBusinessDashboard() {
  const { businessName, projects, candidates, agreements, messages, notifications, talents, invitations } = useBusiness();
  const [showAllTasks, setShowAllTasks] = useState(false);
  const recruitingProjects = projects.filter(project => project.status === "published");
  const pendingCandidates = candidates.filter(candidate =>
    (candidate.status === "new" || candidate.status === "under_review") && !candidate.chatUnlocked &&
    recruitingProjects.some(project => project.id === candidate.projectId)
  );
  const milestones = agreements.flatMap(agreement => {
    const project = projects.find(item => item.id === agreement.projectId);
    if (!project || agreement.status !== "confirmed" || !agreement.isEffective) return [];
    return agreement.milestones
      .filter(milestone => milestone.status !== "completed")
      .map(milestone => ({ project, milestone }));
  }).sort((a, b) => deadlineValue(a.milestone.deadline) - deadlineValue(b.milestone.deadline));
  const submittedMilestones = milestones.filter(item => item.milestone.status === "submitted");
  const tasks: DashboardTask[] = [];
  recruitingProjects.forEach(project => {
    const count = pendingCandidates.filter(candidate => candidate.projectId === project.id).length;
    if (count) tasks.push({
      id: `applicants-${project.id}`, title: `${count} hồ sơ chờ duyệt`, detail: project.title,
      href: `/business/projects/${project.id}/applicants`, action: "Xem hồ sơ", kind: "candidate",
    });
  });
  submittedMilestones.forEach(({ project, milestone }) => tasks.push({
    id: `milestone-${project.id}-${milestone.id}`, title: `${milestone.name} chờ xác nhận`, detail: project.title,
    href: `/workspace/${project.id}`, action: "Xem bàn giao", kind: "milestone",
  }));
  notifications.filter(notice => !notice.read && notice.type === "chat").forEach(notice => tasks.push({
    id: notice.id, title: notice.title, detail: notice.detail, href: notice.href,
    action: "Mở tin nhắn", kind: "message",
  }));

  const seenThreads = new Set<string>();
  const recentMessages = [...messages]
    .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime())
    .flatMap(message => {
      const thread = `${message.projectId}:${message.talentId}`;
      const talent = talents.find(item => item.id === message.talentId);
      const project = projects.find(item => item.id === message.projectId);
      if (seenThreads.has(thread) || !talent || !project) return [];
      seenThreads.add(thread);
      return [{ message, talent, project }];
    }).slice(0, 3);
  const now = Date.now();
  const projectSummaries = recruitingProjects.map(project => ({
    project,
    candidateCount: candidates.filter(candidate => candidate.projectId === project.id).length,
    pendingCount: pendingCandidates.filter(candidate => candidate.projectId === project.id).length,
    invitationCount: invitations.filter(invitation => invitation.projectId === project.id && invitation.status === "pending" && new Date(invitation.expiresAt).getTime() > now).length,
  }));
  const pendingAgreements = agreements.flatMap(agreement => {
    const project = projects.find(project => project.id === agreement.projectId);
    return project && agreement.status === "pending" && new Date(agreement.expiresAt).getTime() > now
      ? [{ agreement, project }] : [];
  });

  return {
    businessName,
    published: recruitingProjects.length,
    ongoing: projects.filter(project => project.status === "ongoing").length,
    fresh: pendingCandidates.length,
    submittedCount: submittedMilestones.length,
    tasks,
    visibleTasks: showAllTasks ? tasks : tasks.slice(0, 4),
    showAllTasks,
    toggleTasks: () => setShowAllTasks(value => !value),
    recentMessages,
    upcomingMilestones: milestones.slice(0, 3),
    projectSummaries: projectSummaries.slice(0, 3),
    pendingAgreements,
  };
}
