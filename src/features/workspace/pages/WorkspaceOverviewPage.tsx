import React, { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ProjectBreadcrumbs } from "@/app/shared/components/ProjectBreadcrumbs";
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Chip,
} from "@mui/material";
import {
  MessageCircle,
  FileText,
  DollarSign,
  FileEdit,
} from "lucide-react";
import { useAuthSession } from "@/lib/hooks/useAuthSession";
import { useBusiness } from "@/lib/hooks/useBusiness";
import { mockStorage } from "@/lib/storage/mockStorage";
import { MilestoneTimeline } from "../components/MilestoneTimeline";
import { SubmitDeliverableDialog } from "../components/SubmitDeliverableDialog";
import { AcceptanceReviewDialog } from "../components/AcceptanceReviewDialog";
import { ProjectCompletedModal } from "../components/ProjectCompletedModal";
import { ScopeChangeRequestModal } from "../components/ScopeChangeRequestModal";
import type { Milestone } from "@/lib/types/marketplace.types";

export const WorkspaceOverviewPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const { role } = useAuthSession();
  const { projects, agreements, talents } = useBusiness();

  const project = projects.find((p) => p.id === projectId) || mockStorage.getProjectById(projectId || "");
  const effectiveAgreement =
    agreements.find((a) => a.projectId === projectId && a.isEffective) ||
    agreements.find((a) => a.projectId === projectId && a.status === "confirmed") ||
    mockStorage.getEffectiveAgreement(projectId || "");
  const talent = talents.find((t) => t.id === effectiveAgreement?.talentId) || talents[0];

  const isBusiness = role === "client" || role === "admin";

  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isScopeChangeOpen, setIsScopeChangeOpen] = useState(false);
  const [isCompletedModalOpen, setIsCompletedModalOpen] = useState(false);

  if (!project || !effectiveAgreement) {
    return (
      <Container maxWidth="lg" sx={{ py: 6, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          Không tìm thấy không gian làm việc hoặc dự án chưa có hợp đồng xác nhận.
        </Typography>
        <Button onClick={() => navigate(-1)} sx={{ mt: 2, color: "#f4490b" }}>
          Quay lại
        </Button>
      </Container>
    );
  }

  const milestones = effectiveAgreement.milestones || [];

  const handleSubmitDeliverable = (milestone: Milestone) => {
    setSelectedMilestone(milestone);
    setIsSubmitOpen(true);
  };

  const handleReviewDeliverable = (milestone: Milestone) => {
    setSelectedMilestone(milestone);
    setIsReviewOpen(true);
  };

  const onConfirmDeliverableSubmission = (
    notes: string,
    files: { name: string; url: string; size: string }[]
  ) => {
    if (selectedMilestone) {
      mockStorage.submitMilestoneDeliverable(project.id, selectedMilestone.id, notes, files);
    }
  };

  const onApproveMilestone = () => {
    if (selectedMilestone) {
      mockStorage.approveMilestone(project.id, selectedMilestone.id);
      // Check if this was the last milestone
      const remaining = milestones.filter(
        (m) => m.id !== selectedMilestone.id && m.status !== "completed"
      );
      if (remaining.length === 0) {
        mockStorage.updateProjectStatus(project.id, "completed");
        setIsCompletedModalOpen(true);
      }
    }
  };

  const onRequestRevision = (reason: string) => {
    if (selectedMilestone) {
      mockStorage.requestMilestoneRevision(project.id, selectedMilestone.id, reason);
    }
  };

  const handleProceedToScopeProposal = (note: string) => {
    navigate(`/business/projects/${project.id}/agreement?talent=${talent.id}&scopeNote=${encodeURIComponent(note)}`);
  };

  const handleOpenReview = () => {
    navigate(`/reviews/${project.id}`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <ProjectBreadcrumbs items={isBusiness
        ? [
            { label: "Dự án của tôi", to: "/business/projects" },
            { label: project.title, to: `/business/projects/${project.id}` },
            { label: "Không gian làm việc" },
          ]
        : [
            { label: "Việc làm đã ứng tuyển", to: "/freelancer/applications" },
            { label: project.title, to: `/projects/${project.id}/details` },
            { label: "Không gian làm việc" },
          ]}
      />

      {/* Header Banner */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          bgcolor: "#ffffff",
          mb: 4,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            gap: 2,
            mb: 2,
          }}
        >
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap", mb: 0.5 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  fontFamily: "Space Grotesk, sans-serif",
                  color: "#1e293b",
                }}
              >
                {project.title}
              </Typography>
              <Chip
                label={project.status === "completed" ? "Đã hoàn thành" : "Đang tiến hành"}
                size="small"
                sx={{
                  bgcolor: project.status === "completed" ? "#dcfce7" : "#e0f2fe",
                  color: project.status === "completed" ? "#166534" : "#0284c7",
                  fontWeight: 700,
                  fontSize: "11px",
                }}
              />
            </Box>
            <Typography variant="body2" sx={{ color: "#64748b" }}>
              Bên giao việc: <strong>{project.company}</strong> · Bên thực hiện: <strong>{talent.name}</strong> ({talent.kind})
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate(`/projects/${project.id}/chat`)}
              startIcon={<MessageCircle size={16} />}
              sx={{ textTransform: "none", color: "#475569", borderColor: "#cbd5e1" }}
            >
              Tin nhắn dự án
            </Button>

            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate(`/business/projects/${project.id}/agreement`)}
              startIcon={<FileText size={16} />}
              sx={{ textTransform: "none", color: "#475569", borderColor: "#cbd5e1" }}
            >
              Hợp đồng hợp tác
            </Button>

            <Button
              variant="outlined"
              size="small"
              onClick={() => navigate(`/payments/${project.id}`)}
              startIcon={<DollarSign size={16} />}
              sx={{ textTransform: "none", color: "#f4490b", borderColor: "#fed7aa" }}
            >
              Sổ thanh toán mô phỏng (PAY-001)
            </Button>
          </Box>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(4, 1fr)" },
            gap: 2,
            pt: 2.5,
            borderTop: "1px solid #f1f5f9",
          }}
        >
          <Box>
            <Typography variant="caption" sx={{ color: "#64748b" }}>
              Ngân sách đã chốt
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#f4490b" }}>
              {effectiveAgreement.budget}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: "#64748b" }}>
              Thời hạn hoàn thành
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1e293b" }}>
              {effectiveAgreement.deadline}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: "#64748b" }}>
              Mã thỏa thuận
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1e293b" }}>
              {effectiveAgreement.reference}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: "#64748b" }}>
              Thay đổi phạm vi (FR-048)
            </Typography>
            <Button
              size="small"
              onClick={() => setIsScopeChangeOpen(true)}
              startIcon={<FileEdit size={14} />}
              sx={{ p: 0, textTransform: "none", color: "#0284c7", fontWeight: 600, fontSize: "13px" }}
            >
              Yêu cầu điều chỉnh phạm vi
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Main Milestones Section */}
      <MilestoneTimeline
        milestones={milestones}
        isBusiness={isBusiness}
        onSubmitDeliverable={handleSubmitDeliverable}
        onReviewDeliverable={handleReviewDeliverable}
      />

      {/* Modals */}
      {selectedMilestone && (
        <SubmitDeliverableDialog
          open={isSubmitOpen}
          milestone={selectedMilestone}
          onClose={() => setIsSubmitOpen(false)}
          onSubmit={onConfirmDeliverableSubmission}
        />
      )}

      {selectedMilestone && (
        <AcceptanceReviewDialog
          open={isReviewOpen}
          milestone={selectedMilestone}
          onClose={() => setIsReviewOpen(false)}
          onApprove={onApproveMilestone}
          onRequestRevision={onRequestRevision}
        />
      )}

      <ScopeChangeRequestModal
        open={isScopeChangeOpen}
        projectTitle={project.title}
        onClose={() => setIsScopeChangeOpen(false)}
        onProceedToProposal={handleProceedToScopeProposal}
      />

      <ProjectCompletedModal
        open={isCompletedModalOpen}
        projectTitle={project.title}
        partnerName={talent.name}
        onClose={() => setIsCompletedModalOpen(false)}
        onOpenReview={handleOpenReview}
      />
    </Container>
  );
};

export default WorkspaceOverviewPage;
