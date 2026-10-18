import { useEffect, useState, useCallback } from "react";
import { mockStorage } from "@/lib/storage/mockStorage";
import type { ProjectBrief } from "@/lib/types/marketplace.types";

export function useBusiness() {
  const [state, setState] = useState(() => mockStorage.getState());
  const [toast, setToast] = useState<string>("");

  useEffect(() => {
    const unsubscribe = mockStorage.subscribe(() => {
      setState(mockStorage.getState());
    });
    return unsubscribe;
  }, []);

  const saveProject = useCallback((project: ProjectBrief) => {
    mockStorage.saveProject(project);
    setToast(project.status === "draft" ? "Đã lưu bản nháp." : "Đã công bố dự án lên thị trường.");
  }, []);

  const closeProject = useCallback((projectId: string) => {
    mockStorage.updateProjectStatus(projectId, "closed");
    setToast("Đã đóng tuyển dự án. Các ứng viên đang chờ xét duyệt sẽ không được chọn (BR-019).");
  }, []);

  const sendInvitation = useCallback((projectId: string, talentId: string, note?: string) => {
    const existing = state.invitations.find(
      (i) => i.projectId === projectId && i.talentId === talentId && i.status === "pending"
    );
    if (existing) {
      setToast("Lời mời này đang chờ phản hồi từ Freelancer.");
      return;
    }
    mockStorage.createInvitation(projectId, talentId, note);
    setToast("Đã gửi lời mời thành công. Freelancer có 7 ngày để phản hồi (FR-019).");
  }, [state.invitations]);

  const unlockChat = useCallback((projectId: string, talentId: string) => {
    mockStorage.unlockCandidateChat(projectId, talentId);
    setToast("Đã duyệt hồ sơ và mở đoạn chat cho ứng viên (FR-031).");
  }, []);

  const approveMilestone = useCallback((projectId: string, milestoneId: string) => {
    mockStorage.approveMilestone(projectId, milestoneId);
    setToast("Đã xác nhận hoàn thành mốc công việc và ghi nhận mô phỏng giải ngân.");
  }, []);

  const requestRevision = useCallback((projectId: string, milestoneId: string, reason: string) => {
    try {
      mockStorage.requestMilestoneRevision(projectId, milestoneId, reason);
      setToast("Đã gửi yêu cầu chỉnh sửa mốc bàn giao kèm lý do (BR-014).");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setToast(err.message);
      }
    }
  }, []);

  const sendMessage = useCallback(
    (projectId: string, talentId: string, senderName: string, body: string) => {
      mockStorage.sendMessage(projectId, talentId, "business", senderName, body);
    },
    []
  );

  const confirmAgreement = useCallback((agreementId: string) => {
    mockStorage.respondToAgreement(agreementId, true);
    setToast("Đã xác nhận thỏa thuận hợp tác. Dự án đóng tuyển và chuyển sang tiến hành (BR-023).");
  }, []);

  return {
    businessName: state.activeUser.companyName || "Nắng Studio",
    projects: state.projects,
    talents: state.talents,
    candidates: state.candidates,
    invitations: state.invitations,
    agreements: state.agreements,
    messages: state.messages,
    notifications: state.notifications,
    reviews: state.reviews,
    payments: state.payments,
    saveProject,
    closeProject,
    sendInvitation,
    unlockChat,
    approveMilestone,
    requestRevision,
    sendMessage,
    confirmAgreement,
    toast,
    setToast,
  };
}
