import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { useAuthSession } from "@/lib/hooks/useAuthSession";
import { useBusiness } from "@/lib/hooks/useBusiness";
import { mockStorage } from "@/lib/storage/mockStorage";
import type { Milestone } from "@/lib/types/marketplace.types";
import { milestoneTitle, parseWorkspaceDate } from "../utils/workspace";

export interface WorkspaceActivity {
  id: string;
  title: string;
  date: string;
  description: string;
  type: "submitted" | "completed" | "revision" | "agreement";
}

export function useWorkspace() {
  const { projectId: routeProjectId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const parts = location.pathname.split("/").filter(Boolean);
  const projectId = routeProjectId ?? (parts[1] === "projects" ? parts[2] : parts[1]);
  const { user, role } = useAuthSession();
  const { projects, agreements, talents, payments } = useBusiness();
  const project = projects.find(item => item.id === projectId);
  const agreement = agreements.find(item => item.projectId === projectId && item.isEffective)
    ?? agreements.find(item => item.projectId === projectId && item.status === "confirmed");
  const talent = talents.find(item => item.id === agreement?.talentId);
  const isBusiness = role === "client" || role === "admin";
  const canAccess = !!project && !!agreement && (role === "admin"
    || (role === "client" && user?.companyName === project.company)
    || (role === "freelancer" && mockStorage.getApplicantTalentId() === agreement.talentId));
  const milestones = agreement?.milestones ?? [];
  const pendingMilestone = milestones.find(item => item.status === "submitted");
  const overdueMilestone = milestones.find(item => item.status !== "completed" && item.status !== "submitted"
    && (parseWorkspaceDate(item.deadline)?.getTime() ?? Infinity) < Date.now());
  const projectPath = isBusiness ? `/business/projects/${projectId}` : `/projects/${projectId}/details`;
  const agreementPath = isBusiness ? `/business/projects/${projectId}/agreement` : `/projects/${projectId}/agreement`;
  const chatPath = isBusiness ? `/business/messages?view=project&scope=${projectId}` : `/projects/${projectId}/chat`;
  const [reviewId, setReviewId] = useState<string | null>(null);
  const [reviewMode, setReviewMode] = useState<"approve" | "revision">("approve");
  const [submitId, setSubmitId] = useState<string | null>(null);
  const [scopeOpen, setScopeOpen] = useState(false);
  const [completedOpen, setCompletedOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [actionError, setActionError] = useState("");
  const reviewMilestone = milestones.find(item => item.id === reviewId);
  const submitMilestone = milestones.find(item => item.id === submitId);
  const activities: WorkspaceActivity[] = milestones.flatMap(milestone => [
    ...(milestone.submittedAt ? [{
      id: `${milestone.id}-submitted`,
      title: `${talent?.name ?? "Freelancer"} đã gửi bàn giao · ${milestoneTitle(milestone.name)}`,
      date: milestone.submittedAt,
      description: `${milestone.submissionFiles?.length ?? 0} tệp đính kèm. ${milestone.submissionNotes ?? ""}`,
      type: "submitted" as const
    }] : []),
    ...(milestone.completedAt ? [{
      id: `${milestone.id}-completed`,
      title: `Đã nghiệm thu · ${milestoneTitle(milestone.name)}`,
      date: milestone.completedAt,
      description: "Đã ghi nhận nghiệm thu trong không gian làm việc mô phỏng.",
      type: "completed" as const
    }] : []),
    ...(milestone.revisionHistory ?? []).map((revision, index) => ({
      id: `${milestone.id}-revision-${index}`,
      title: `Yêu cầu chỉnh sửa · ${milestoneTitle(milestone.name)}`,
      date: revision.requestedAt,
      description: revision.reason,
      type: "revision" as const
    })),
  ]);
  if (agreement?.confirmedAt) activities.push({
    id: "agreement-confirmed",
    title: `Hai bên đã xác nhận thỏa thuận ${agreement.reference}`,
    date: agreement.confirmedAt,
    description: "Phạm vi và các mốc hợp tác được ghi nhận trên FREVO.",
    type: "agreement"
  });
  activities.sort((a, b) => (parseWorkspaceDate(b.date)?.getTime() ?? 0) - (parseWorkspaceDate(a.date)?.getTime() ?? 0));

  function openReview(milestone: Milestone, mode: "approve" | "revision" = "approve") {
    if (!canAccess) return;
    setReviewMode(mode);
    setReviewId(milestone.id);
    setActionError("");
  }

  function approve() {
    if (!canAccess || !isBusiness || !reviewMilestone || reviewMilestone.status !== "submitted" || !project) return;
    if (mockStorage.getEffectiveAgreement(project.id)?.milestones.find(item => item.id === reviewMilestone.id)?.status !== "submitted") return;
    try {
      mockStorage.approveMilestone(project.id, reviewMilestone.id);
      setReviewId(null);
      setToast("Đã nghiệm thu mốc. Sổ thanh toán chỉ ghi nhận trạng thái mô phỏng.");
      if (milestones.every(item => item.id === reviewMilestone.id || item.status === "completed")) {
        mockStorage.updateProjectStatus(project.id, "completed");
        setCompletedOpen(true);
      }
    } catch { setActionError("Không ghi nhận được nghiệm thu. Vui lòng thử lại."); }
  }

  function requestRevision(reason: string) {
    if (!canAccess || !isBusiness || !reviewMilestone || reviewMilestone.status !== "submitted" || !project) return;
    if (mockStorage.getEffectiveAgreement(project.id)?.milestones.find(item => item.id === reviewMilestone.id)?.status !== "submitted") return;
    try {
      mockStorage.requestMilestoneRevision(project.id, reviewMilestone.id, reason);
      setReviewId(null);
      setToast("Đã gửi yêu cầu chỉnh sửa kèm tiêu chí và góp ý của bạn.");
    } catch { setActionError("Không gửi được yêu cầu chỉnh sửa. Vui lòng thử lại."); }
  }

  function submitDeliverable(notes: string, files: NonNullable<Milestone["submissionFiles"]>) {
    if (!canAccess || isBusiness || !submitMilestone || !project) return;
    mockStorage.submitMilestoneDeliverable(project.id, submitMilestone.id, notes, files);
    setSubmitId(null);
    setToast("Đã gửi bàn giao và chuyển sang chờ nghiệm thu.");
  }

  return {
    project,
    agreement,
    talent,
    isBusiness,
    canAccess,
    milestones,
    pendingMilestone,
    overdueMilestone,
    activities,
    projectPayments: payments.filter(item => item.projectId === projectId),
    projectPath,
    agreementPath,
    chatPath,
    reviewMode,
    reviewMilestone,
    openReview,
    closeReview: () => setReviewId(null),
    approve,
    requestRevision,
    submitMilestone,
    openSubmit: (milestone: Milestone) => setSubmitId(milestone.id),
    closeSubmit: () => setSubmitId(null),
    submitDeliverable,
    scopeOpen,
    setScopeOpen,
    completedOpen,
    setCompletedOpen,
    toast,
    setToast,
    actionError,
    openProjectReview: () => navigate(`/reviews/${projectId}`),
    proceedToScope: (note: string) => navigate(`${agreementPath}?talent=${agreement?.talentId}&scopeNote=${encodeURIComponent(note)}`),
  };
}
