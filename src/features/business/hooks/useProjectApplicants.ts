import { useState } from "react";
import { useBusiness } from "@/lib/hooks/useBusiness";
import { mockStorage } from "@/lib/storage/mockStorage";
import type { Candidate, ProjectBrief, TalentProfile } from "@/lib/types/marketplace.types";

export type CandidateFilter = "all" | "pending" | "discussing" | "offer" | "selected" | "not_selected";
export interface CandidateDecision { candidate: Candidate; talent: TalentProfile; action: "approve" | "reject" }
export function matchesCandidateFilter(candidate: Candidate, filter: CandidateFilter) {
  return filter === "all" || (filter === "pending" ? candidate.status === "new" || candidate.status === "under_review" : candidate.status === filter);
}

export function useProjectApplicants(project: ProjectBrief) {
  const { candidates, invitations, talents, unlockChat } = useBusiness();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<CandidateFilter>("all");
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [decision, setDecision] = useState<CandidateDecision | null>(null);
  const [feedback, setFeedback] = useState("");
  const projectCandidates = candidates.filter(candidate => candidate.projectId === project.id);
  const projectInvitations = invitations.filter(invitation => invitation.projectId === project.id);
  const acceptedIds = new Set(projectInvitations.filter(invitation => invitation.status === "accepted").map(invitation => invitation.talentId));
  const isInvited = (candidate: Candidate) => acceptedIds.has(candidate.talentId);
  const talentById = new Map(talents.map(talent => [talent.id, talent]));
  const search = query.trim().toLocaleLowerCase("vi");
  const filtered = projectCandidates.filter(candidate => {
    const talent = talentById.get(candidate.talentId);
    return matchesCandidateFilter(candidate, statusFilter) && (!search || [talent?.name, talent?.role, candidate.proposal].some(value => value?.toLocaleLowerCase("vi").includes(search)));
  }).sort((a, b) => Number(matchesCandidateFilter(b, "pending")) - Number(matchesCandidateFilter(a, "pending")) || b.receivedAt.localeCompare(a.receivedAt));
  const priority = filtered.filter(isInvited);
  const applications = filtered.filter(candidate => !isInvited(candidate));
  const priorityCount = projectCandidates.filter(isInvited).length;

  const confirmDecision = () => {
    if (!decision) return;
    const latest = mockStorage.getState();
    const candidate = latest.candidates.find(item => item.id === decision.candidate.id);
    const currentProject = latest.projects.find(item => item.id === project.id);
    if (currentProject?.status !== "published" || !candidate || !matchesCandidateFilter(candidate, "pending") || candidate.chatUnlocked || latest.candidates.some(item => item.projectId === project.id && item.status === "selected")) {
      setFeedback("Trạng thái hồ sơ đã thay đổi. Hãy xem lại danh sách ứng viên.");
      setDecision(null);
      return;
    }
    try {
      if (decision.action === "approve") {
        unlockChat(project.id, candidate.talentId);
        setFeedback(`Đã duyệt ${decision.talent.name}. Bạn có thể bắt đầu trao đổi.`);
      } else {
        mockStorage.updateCandidateStatus(candidate.id, "not_selected");
        setFeedback(`Đã từ chối hồ sơ ${decision.talent.name}.`);
      }
      setDecision(null);
      setSelectedCandidate(null);
    } catch (error: unknown) {
      setFeedback(error instanceof Error ? error.message : "Không thể cập nhật hồ sơ. Hãy thử lại.");
    }
  };
  const simulateApplicant = () => {
    const talent = talents.find(item => !projectCandidates.some(candidate => candidate.talentId === item.id));
    if (!talent) { setFeedback("Không còn hồ sơ mẫu để mô phỏng."); return; }
    mockStorage.addCandidate({ id: `c-sim-${Date.now()}`, projectId: project.id, talentId: talent.id, source: "Ứng tuyển", status: "new", proposal: `Tôi quan tâm đến dự án “${project.title}” và muốn trao đổi về phạm vi công việc.`, receivedAt: new Date().toISOString(), unread: true, chatUnlocked: false });
    setFeedback("Đã thêm một hồ sơ ứng tuyển mẫu.");
  };
  return { query, setQuery, statusFilter, setStatusFilter, selectedCandidate, setSelectedCandidate, decision, setDecision, feedback, setFeedback, projectCandidates, talentById, priority, applications, priorityCount, confirmDecision, simulateApplicant };
}
