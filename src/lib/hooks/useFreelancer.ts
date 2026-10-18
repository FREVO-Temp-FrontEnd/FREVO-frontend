import { useEffect, useState, useCallback, useMemo } from "react";
import { mockStorage } from "@/lib/storage/mockStorage";
import { useAuthSession } from "./useAuthSession";
import type { Invitation, Candidate, ProjectBrief } from "@/lib/types/marketplace.types";

export function useFreelancer() {
  const { user } = useAuthSession();
  const [state, setState] = useState(() => mockStorage.getState());
  const [toast, setToast] = useState<string>("");

  useEffect(() => {
    const unsubscribe = mockStorage.subscribe(() => {
      setState(mockStorage.getState());
    });
    return unsubscribe;
  }, []);

  // Determine current talent ID (defaults to 'minh-anh' for demo)
  const currentTalentId = useMemo(() => {
    if (user?.id && state.talents.some((t) => t.id === user.id)) {
      return user.id;
    }
    return "minh-anh";
  }, [user, state.talents]);

  const currentTalent = useMemo(() => {
    return state.talents.find((t) => t.id === currentTalentId) || state.talents[0];
  }, [state.talents, currentTalentId]);

  // Invitations addressed to current talent
  const myInvitations: Invitation[] = useMemo(() => {
    return state.invitations.filter((inv) => inv.talentId === currentTalentId);
  }, [state.invitations, currentTalentId]);

  const pendingInvitationsCount = useMemo(() => {
    return myInvitations.filter((inv) => inv.status === "pending").length;
  }, [myInvitations]);

  // Projects relevant to invitations
  const getProjectForInvitation = useCallback(
    (projectId: string): ProjectBrief | undefined => {
      return state.projects.find((p) => p.id === projectId);
    },
    [state.projects]
  );

  // My Applications
  const myApplications: Candidate[] = useMemo(() => {
    return state.candidates.filter((c) => c.talentId === currentTalentId);
  }, [state.candidates, currentTalentId]);

  // Respond to invitation per BR-005
  const acceptInvitation = useCallback((invitationId: string) => {
    mockStorage.respondToInvitation(invitationId, true);
    setToast(
      "Lời mời đã được chấp nhận. Hồ sơ của bạn đã được chuyển cho Doanh nghiệp xem xét để mở kênh trao đổi (BR-005)."
    );
  }, []);

  const declineInvitation = useCallback((invitationId: string) => {
    mockStorage.respondToInvitation(invitationId, false);
    setToast("Bạn đã từ chối lời mời tham gia dự án.");
  }, []);

  // Submit application per BR-002, BR-003, BR-006, BR-010, BR-011
  const applyToProject = useCallback(
    (
      projectId: string,
      proposal: string,
      identityType: "individual" | "team",
      teamId?: string
    ) => {
      const talentIdToUse = identityType === "team" && teamId ? teamId : currentTalentId;

      const existing = state.candidates.find(
        (c) => c.projectId === projectId && c.talentId === talentIdToUse
      );

      if (existing) {
        setToast("Bạn đã nộp hồ sơ ứng tuyển vào dự án này trước đó.");
        return;
      }

      const newCandidate: Candidate = {
        id: `c-app-${Date.now()}`,
        projectId,
        talentId: talentIdToUse,
        source: "Ứng tuyển",
        status: "new",
        proposal,
        receivedAt: new Date().toISOString(),
        unread: true,
        chatUnlocked: false, // BR-012: Locked until Business approval
        fitScore: 88,
      };

      mockStorage.addCandidate(newCandidate);
      setToast("Ứng tuyển thành công! Hồ sơ đã được chuyển đến Doanh nghiệp (BR-002, BR-003).");
    },
    [currentTalentId, state.candidates]
  );

  // Withdraw application per FL-012, BR-010
  const withdrawApplication = useCallback((candidateId: string) => {
    mockStorage.updateCandidateStatus(candidateId, "not_selected");
    setToast("Đã rút hồ sơ ứng tuyển khỏi dự án (FL-012).");
  }, []);

  return {
    currentTalent,
    currentTalentId,
    myInvitations,
    pendingInvitationsCount,
    myApplications,
    projects: state.projects,
    getProjectForInvitation,
    acceptInvitation,
    declineInvitation,
    applyToProject,
    withdrawApplication,
    toast,
    setToast,
  };
}
