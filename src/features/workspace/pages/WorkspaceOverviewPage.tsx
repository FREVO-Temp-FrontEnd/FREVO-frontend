import React, { useState } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router";
import { ProjectBreadcrumbs } from "@/app/shared/components/ProjectBreadcrumbs";
import {
  Box,
  Typography,
  Paper,
  Button,
} from "@mui/material";
import {
  ArrowLeft,
  CalendarDays,
  DollarSign,
  FileEdit,
  FileText,
  Layers3,
  MessageCircle,
  Wallet,
} from "lucide-react";
import { useAuthSession } from "@/lib/hooks/useAuthSession";
import { useBusiness } from "@/lib/hooks/useBusiness";
import { mockStorage } from "@/lib/storage/mockStorage";
import { MilestoneTimeline } from "../components/MilestoneTimeline";
import { SubmitDeliverableDialog } from "../components/SubmitDeliverableDialog";
import { AcceptanceReviewDialog } from "../components/AcceptanceReviewDialog";
import { ProjectCompletedModal } from "../components/ProjectCompletedModal";
import { ScopeChangeRequestModal } from "../components/ScopeChangeRequestModal";
import { OverdueWarningBanner } from "../components/OverdueWarningBanner";
import type { Milestone } from "@/lib/types/marketplace.types";

export const WorkspaceOverviewPage: React.FC = () => {
  const { projectId: routeProjectId } = useParams<{ projectId: string }>();
  const location = useLocation();
  const parts = location.pathname.split("/").filter(Boolean);
  const pathProjectId = parts[1] === "projects"
    ? parts[2]
    : parts[0] === "projects" || parts[0] === "workspace"
    ? parts[1]
    : undefined;
  const projectId = routeProjectId ?? pathProjectId;
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
      <Box sx={{ py: 6, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          Không tìm thấy không gian làm việc hoặc dự án chưa có hợp đồng xác nhận.
        </Typography>
        <Button onClick={() => navigate(-1)} sx={{ mt: 2, color: "#f4490b" }}>
          Quay lại
        </Button>
      </Box>
    );
  }

  const milestones = effectiveAgreement.milestones || [];

  const overdueMilestone = milestones.find((m) => {
    if (m.status === "completed") return false;
    if (!m.deadline) return false;
    const dateParts = m.deadline.split(/[/.-]/);
    if (dateParts.length === 3) {
      let deadlineDate: Date;
      if (dateParts[0].length === 4) {
        deadlineDate = new Date(`${dateParts[0]}-${dateParts[1]}-${dateParts[2]}`);
      } else {
        deadlineDate = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
      }
      return !isNaN(deadlineDate.getTime()) && deadlineDate.getTime() < Date.now();
    }
    const parsed = new Date(m.deadline);
    return !isNaN(parsed.getTime()) && parsed.getTime() < Date.now();
  });

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
    <Box
      sx={(theme) => ({
        zoom: 0.9,
        fontFamily: theme.typography.fontFamily,
        "&& .MuiBreadcrumbs-li > *": {
          fontFamily: theme.typography.fontFamily,
          fontSize: 13,
        },
        "&& h1": { fontFamily: theme.typography.h1.fontFamily, letterSpacing: "-0.02em" },
        "&& h2": { fontFamily: theme.typography.h2.fontFamily, letterSpacing: "-0.015em" },
        "&& h3": { fontFamily: theme.typography.h3.fontFamily, letterSpacing: 0 },
        "&&& .MuiButton-root, &&& .fb-button": {
          fontFamily: theme.typography.fontFamily,
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: 0,
          lineHeight: 1.4,
          textTransform: "none",
        },
        "&&& .MuiButton-contained, &&& a.MuiButton-contained, &&& .fb-button-primary, &&& [class*='MuiButton-contained']": {
          color: "#ffffff !important",
          "& *": {
            color: "#ffffff !important",
          },
        },
      })}
    >
      {/* Nav Breadcrumbs elevated to top matching BusinessProjectDetailPage */}
      <ProjectBreadcrumbs
        items={isBusiness
          ? [
              { label: "Dự án của tôi", to: "/business/projects" },
              { label: project.title, to: `/business/projects/${project.id}` },
              { label: "Không gian làm việc & Tiến độ" },
            ]
          : [
              { label: "Việc làm đã ứng tuyển", to: "/freelancer/applications" },
              { label: project.title, to: `/projects/${project.id}/details` },
              { label: "Không gian làm việc & Tiến độ" },
            ]}
      />

      {/* Header Banner - Matching FREVO Signature Design */}
      <header className="rounded-[24px] border border-[#f3dccf] bg-[#fff4ee] px-5 py-5 sm:px-7 sm:py-6 mb-5">
        <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e8f7ef] px-2.5 py-1 text-xs font-semibold text-[#16805b]">
                <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
                {project.status === "completed" ? "Đã hoàn thành" : "Đang tiến hành"}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#fff0e9] px-2.5 py-1 text-xs font-bold text-[#bd3d14]">
                <Layers3 size={13} /> Không gian làm việc & Tiến độ
              </span>
            </div>

            <Typography component="h1" variant="h4" sx={{ maxWidth: 700, lineHeight: 1.22, fontSize: { xs: "1.5rem", sm: "1.875rem" }, fontWeight: 800 }}>
              {project.title}
            </Typography>

            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#747773]">
              <span>Bên giao việc: <strong className="font-semibold text-[#20201f]">{project.company}</strong></span>
              <span>Bên thực hiện: <strong className="font-semibold text-[#20201f]">{talent.name} ({talent.kind})</strong></span>
              <span className="inline-flex items-center gap-1">
                <Wallet size={15} className="text-[#bd3d14]" /> Ngân sách: <strong className="font-semibold text-[#bd3d14]">{effectiveAgreement.budget}</strong>
              </span>
              <span className="inline-flex items-center gap-1">
                <CalendarDays size={15} /> Hạn hoàn thành: <strong className="font-semibold text-[#20201f]">{effectiveAgreement.deadline}</strong>
              </span>
            </div>
          </div>

          {/* Action Cluster on Right */}
          <div className="flex flex-wrap items-center gap-2 lg:shrink-0">
            <Button
              component={Link}
              to={isBusiness ? `/business/projects/${project.id}` : `/projects/${project.id}/details`}
              startIcon={<ArrowLeft size={16} />}
              sx={{
                minHeight: 40,
                borderRadius: 999,
                bgcolor: "background.paper",
                border: "1px solid #f3dccf",
                color: "text.primary",
                px: 2,
                fontSize: 13,
                fontWeight: 600,
                "&:hover": { bgcolor: "#fffaf7", borderColor: "primary.main", color: "primary.dark" },
              }}
            >
              Về dự án
            </Button>

            <Button
              component={Link}
              to={isBusiness ? `/business/projects/${project.id}/agreement` : `/projects/${project.id}/agreement`}
              startIcon={<FileText size={16} />}
              sx={{
                minHeight: 40,
                borderRadius: 999,
                bgcolor: "background.paper",
                border: "1px solid #f3dccf",
                color: "text.primary",
                px: 2,
                fontSize: 13,
                fontWeight: 600,
                "&:hover": { bgcolor: "#fffaf7", borderColor: "primary.main", color: "primary.dark" },
              }}
            >
              Hợp đồng
            </Button>

            <Button
              component={Link}
              to={isBusiness ? `/business/messages?view=project&scope=${project.id}` : `/projects/${project.id}/chat`}
              startIcon={<MessageCircle size={16} />}
              sx={{
                minHeight: 40,
                borderRadius: 999,
                bgcolor: "background.paper",
                border: "1px solid #f3dccf",
                color: "text.primary",
                px: 2,
                fontSize: 13,
                fontWeight: 600,
                "&:hover": { bgcolor: "#fffaf7", borderColor: "primary.main", color: "primary.dark" },
              }}
            >
              Tin nhắn
            </Button>

            <Button
              component={Link}
              to={`/payments/${project.id}`}
              startIcon={<DollarSign size={16} />}
              sx={{
                minHeight: 40,
                borderRadius: 999,
                bgcolor: "#fffaf7",
                border: "1px solid #fed7aa",
                color: "#bd3d14",
                px: 2,
                fontSize: 13,
                fontWeight: 600,
                "&:hover": { bgcolor: "#fff0e9", borderColor: "primary.main" },
              }}
            >
              Sổ thanh toán (Mô phỏng)
            </Button>
          </div>
        </div>
      </header>

      {/* Agreement Reference & Scope Change Bar */}
      <Paper
        variant="outlined"
        sx={{
          p: 2.5,
          borderRadius: "20px",
          bgcolor: "background.paper",
          borderColor: "#e4e6e2",
          mb: 4,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
          <div>
            <span className="text-[#747773] text-xs block">Mã thỏa thuận hợp tác</span>
            <strong className="font-mono text-sm text-[#20201f]">{effectiveAgreement.reference || "FV-2026-004"}</strong>
          </div>
          <div>
            <span className="text-[#747773] text-xs block">Quy tắc sửa đổi (DEC-03)</span>
            <strong className="text-sm text-[#20201f]">Tối đa 2 lượt / mốc</strong>
          </div>
          <div>
            <span className="text-[#747773] text-xs block">Trạng thái giải ngân</span>
            <strong className="text-sm text-[#16805b]">Giải ngân sau khi nghiệm thu</strong>
          </div>
        </div>

        <Button
          onClick={() => setIsScopeChangeOpen(true)}
          startIcon={<FileEdit size={15} />}
          sx={{
            minHeight: 36,
            borderRadius: 999,
            px: 2,
            bgcolor: "#f0f7fb",
            color: "#0284c7",
            border: "1px solid #bae6fd",
            fontWeight: 700,
            fontSize: 12,
            "&:hover": { bgcolor: "#e0f2fe", borderColor: "#0284c7" },
          }}
        >
          Yêu cầu điều chỉnh phạm vi (FR-048)
        </Button>
      </Paper>

      {/* Overdue Warning Banner (WORK-008) */}
      {overdueMilestone && (
        <OverdueWarningBanner
          milestoneName={overdueMilestone.name}
          deadline={overdueMilestone.deadline}
          projectId={project.id}
        />
      )}

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
    </Box>
  );
};

export default WorkspaceOverviewPage;
