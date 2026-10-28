import { useState } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router";
import {
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock,
  Eye,
  FileCheck2,
  Layers3,
  MessageCircleMore,
  Sparkles,
  Wallet,
  XCircle,
} from "lucide-react";
import { Avatar, Box, Button, Chip, LinearProgress, Paper, Typography } from "@mui/material";
import { ProjectBreadcrumbs } from "@/app/shared/components/ProjectBreadcrumbs";
import { useBusiness } from "@/lib/hooks/useBusiness";
import { mockStorage } from "@/lib/storage/mockStorage";
import { CloseProjectDialog } from "@/features/business/components/CloseProjectDialog";
import { CandidateSuggestionsTab } from "@/features/business/components/CandidateSuggestionsTab";
import { SentInvitationsTab } from "@/features/business/components/SentInvitationsTab";
import { BusinessProjectBrief } from "@/features/business/components/BusinessProjectBrief";
import { ProjectApplicantsTab } from "@/features/business/components/ProjectApplicantsTab";
import type { ProjectBrief, ProjectStatus } from "@/lib/types/marketplace.types";

function statusLabel(status: ProjectStatus) {
  switch (status) {
    case "draft":
      return "Bản nháp";
    case "published":
      return "Đang tuyển";
    case "ongoing":
      return "Đang tiến hành";
    case "closed":
      return "Đã đóng tuyển";
    case "completed":
      return "Đã hoàn thành";
    default:
      return status;
  }
}

export function BusinessProjectDetailPage() {
  const { projectId: routeProjectId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { projects, candidates, invitations, closeProject, talents } = useBusiness();
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);

  const parts = location.pathname.split("/").filter(Boolean);
  const projectId = routeProjectId || (parts[1] === "projects" ? parts[2] : undefined);
  const project: ProjectBrief | undefined = projects.find((p) => p.id === projectId);

  if (!project) {
    return (
      <div className="fb-empty">
        <BriefcaseBusiness size={32} strokeWidth={1.6} aria-hidden="true" />
        <h3>Không tìm thấy dự án</h3>
        <p>Dự án này không tồn tại hoặc đã bị xóa.</p>
        <Link className="fb-button fb-button-small fb-button-primary" to="/business/projects">
          Về danh sách dự án
        </Link>
      </div>
    );
  }

  const projectCandidates = candidates.filter((c) => c.projectId === project.id);
  const firstChatCandidate = projectCandidates
    .filter((candidate) => candidate.chatUnlocked)
    .sort((a, b) => (b.chatUnlockedAt ?? "").localeCompare(a.chatUnlockedAt ?? ""))[0];
  const projectInboxPath = `/business/messages?view=project&scope=${project.id}`
    + (firstChatCandidate ? `&project=${project.id}&talent=${firstChatCandidate.talentId}` : "");
  const projectInvitations = invitations.filter((i) => i.projectId === project.id);
  const selectedCandidate = projectCandidates.find((c) => c.status === "selected");
  const selectedTalent = (selectedCandidate ? talents.find((t) => t.id === selectedCandidate.talentId) : undefined)
    || (project.selectedTalentId ? talents.find((t) => t.id === project.selectedTalentId) : undefined);

  // Retrieve effective agreement and its milestones for ongoing project overview
  const effectiveAgreement = project.status === "ongoing"
    ? mockStorage.getEffectiveAgreement(project.id)
    : undefined;
  const milestones = effectiveAgreement?.milestones || [];
  const completedMilestonesCount = milestones.filter((m) => m.status === "completed").length;
  const progressPercent = milestones.length > 0 ? Math.round((completedMilestonesCount / milestones.length) * 100) : 0;
  const hasSubmittedMilestone = milestones.some((m) => m.status === "submitted");

  // In-page Tab definitions (strictly content switching within this screen):
  // - published: applicants (default), suggestions, invitations, brief
  // - ongoing: overview (default), applicants (review history), brief
  // - closed: applicants (default), brief
  // - draft: brief (default)
  const defaultTab = project.status === "published"
    ? "applicants"
    : project.status === "ongoing"
    ? "overview"
    : project.status === "closed"
    ? "applicants"
    : "brief";

  const rawTab = parts[3];
  const currentTab = (rawTab === "executor" ? "overview" : rawTab) || defaultTab;

  const tabs: { segment: string; label: string; count?: number }[] = [];
  if (project.status === "published") {
    tabs.push(
      { segment: "applicants", label: "Ứng viên", count: projectCandidates.length },
      { segment: "suggestions", label: "Gợi ý phù hợp" },
      { segment: "invitations", label: "Lời mời đã gửi", count: projectInvitations.length },
      { segment: "brief", label: "Bản Brief" }
    );
  } else if (project.status === "ongoing") {
    tabs.push(
      { segment: "overview", label: "Tiến độ dự án" },
      { segment: "applicants", label: "Hồ sơ ứng viên", count: projectCandidates.length },
      { segment: "brief", label: "Bản Brief" }
    );
  } else if (project.status === "closed") {
    tabs.push(
      { segment: "applicants", label: "Hồ sơ ứng viên", count: projectCandidates.length },
      { segment: "brief", label: "Bản Brief" }
    );
  } else {
    tabs.push({ segment: "brief", label: "Bản Brief" });
  }

  return (
    <Box sx={(theme) => ({
      fontFamily: theme.typography.fontFamily,
      "&& .MuiBreadcrumbs-li > *": { fontFamily: theme.typography.fontFamily },
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
      // Ensure white text on all contained and primary buttons (overrides .fb-app a { color: inherit })
      "&&& .MuiButton-contained, &&& a.MuiButton-contained, &&& .fb-button-primary, &&& [class*='MuiButton-contained']": {
        color: "#ffffff !important",
        "& *": {
          color: "#ffffff !important",
        },
      },
    })}>
      <ProjectBreadcrumbs items={[{ label: "Dự án của tôi", to: "/business/projects" }, { label: project.title }]} />

      {/* Project Header Banner */}
      <header className="rounded-[24px] border border-[#f3dccf] bg-[#fff4ee] px-5 py-5 sm:px-7 sm:py-6">
        <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
          <div className="min-w-0">
            <span className={`mb-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
              project.status === "published" || project.status === "ongoing"
                ? "bg-[#e8f7ef] text-[#16805b]"
                : "bg-[#f2f3f0] text-[#62625e]"
            }`}>
              <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
              {statusLabel(project.status)}
            </span>
            <Typography component="h1" variant="h4" sx={{ maxWidth: 680, lineHeight: 1.22, fontSize: { xs: "1.5rem", sm: "1.875rem" }, fontWeight: 800 }}>
              {project.title}
            </Typography>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#747773]">
              <span className="inline-flex items-center gap-1.5">
                <Wallet size={16} className="text-[#bd3d14]" aria-hidden="true" /> Ngân sách: <strong className="font-semibold text-[#20201f]">{project.budget || "Chưa đặt"}</strong>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays size={16} aria-hidden="true" /> {project.status === "published" ? "Hạn ứng tuyển:" : "Hạn hoàn thành:"} <strong className="font-semibold text-[#20201f]">{project.status === "published" ? (project.applicationDeadline || "Chưa đặt") : (project.deadline || "Chưa đặt")}</strong>
              </span>
              {selectedTalent && (
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-[#16805b]" aria-hidden="true" /> Đối tác: <strong className="font-semibold text-[#20201f]">{selectedTalent.name} ({selectedTalent.kind})</strong>
                </span>
              )}
            </div>
          </div>

          {/* Header Action Cluster */}
          {project.status !== "draft" && (
            <div className="flex flex-wrap items-center gap-2.5 lg:shrink-0">
              {project.status === "ongoing" && (
                <>
                  <Button
                    component={Link}
                    to={`/business/projects/${project.id}/progress`}
                    variant="contained"
                    startIcon={<Layers3 size={16} />}
                    sx={{
                      minHeight: 40,
                      borderRadius: 999,
                      px: 2.5,
                      fontSize: 13,
                      fontWeight: 700,
                      bgcolor: "#f4490b !important",
                      color: "#ffffff !important",
                      "&&": { color: "#ffffff !important" },
                      "& *": { color: "#ffffff !important" },
                      "&:hover": { bgcolor: "#bd3d14 !important", color: "#ffffff !important" },
                      boxShadow: "0 2px 8px rgba(244,73,11,0.25)",
                    }}
                  >
                    Vào Workspace (Tiến độ)
                  </Button>
                  <Button
                    component={Link}
                    to={`/business/projects/${project.id}/agreement`}
                    startIcon={<FileCheck2 size={16} />}
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
                </>
              )}
              {project.status === "published" && currentTab !== "brief" && (
                <Button
                  component={Link}
                  to={`/business/projects/${project.id}/brief`}
                  startIcon={<Eye size={16} />}
                  sx={{
                    minHeight: 40,
                    borderRadius: 999,
                    bgcolor: "background.paper",
                    border: "1px solid #f3dccf",
                    color: "text.primary",
                    px: 2,
                    fontSize: 13,
                    "&:hover": { bgcolor: "#fffaf7", borderColor: "primary.main", color: "primary.dark" },
                  }}
                >
                  Xem brief
                </Button>
              )}
              <Button
                component={Link}
                to={projectInboxPath}
                startIcon={<MessageCircleMore size={16} />}
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
              {project.status === "published" && (
                <Button
                  onClick={() => setCloseDialogOpen(true)}
                  startIcon={<XCircle size={16} />}
                  sx={{
                    minHeight: 40,
                    borderRadius: 999,
                    bgcolor: "background.paper",
                    border: "1px solid #e4e6e2",
                    color: "#a34a31",
                    px: 2,
                    fontSize: 13,
                    fontWeight: 600,
                    "&:hover": {
                      bgcolor: "#fff0e9",
                      borderColor: "#f3dccf",
                      color: "primary.dark",
                    },
                  }}
                >
                  Đóng tuyển
                </Button>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Pure In-Page Tab Navigation (Content switches below without navigation jumps) */}
      <nav className="mb-5 mt-3 flex items-center justify-between gap-2 overflow-x-auto max-sm:[scrollbar-width:none] max-sm:[&::-webkit-scrollbar]:hidden border-b border-[#e4e6e2] px-1" aria-label="Các mục của dự án">
        <div className="flex min-w-0 items-center gap-1 overflow-x-auto max-sm:[scrollbar-width:none] max-sm:[&::-webkit-scrollbar]:hidden">
          {tabs.map((tab) => {
            const targetPath = tab.segment === defaultTab
              ? `/business/projects/${project.id}`
              : `/business/projects/${project.id}/${tab.segment}`;

            const isActive = currentTab === tab.segment;

            return (
              <Link
                key={tab.segment}
                to={targetPath}
                aria-current={isActive ? "page" : undefined}
                className={`inline-flex min-h-12 shrink-0 items-center gap-2 border-b-2 px-3 text-sm font-semibold transition-colors sm:px-4 ${
                  isActive ? "border-[#f4490b] text-[#bd3d14]" : "border-transparent text-[#747773] hover:text-[#20201f]"
                }`}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span className={`rounded-full px-2 py-0.5 text-xs ${isActive ? "bg-[#fff0e9] text-[#bd3d14]" : "bg-[#f2f3f0] text-[#747773]"}`}>
                    {tab.count}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Tab Content Switcher: All rendered right on this screen */}
      {currentTab === "suggestions" && project.status === "published" ? (
        <CandidateSuggestionsTab project={project} />
      ) : currentTab === "invitations" && project.status === "published" ? (
        <SentInvitationsTab project={project} />
      ) : currentTab === "applicants" && project.status !== "draft" ? (
        <ProjectApplicantsTab project={project} />
      ) : currentTab === "overview" && project.status === "ongoing" ? (
        <div className="grid gap-6">
          {/* 1. Quick Stats Metric Cards (Clean, visual KPI cards) */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <Paper
              variant="outlined"
              sx={{
                p: 2.25,
                borderRadius: "18px",
                bgcolor: "background.paper",
                borderColor: "#e4e6e2",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div className="flex items-center justify-between text-xs text-[#747773] mb-2">
                <span>Người phụ trách</span>
                <span className="flex size-2 rounded-full bg-[#16805b]" />
              </div>
              <div className="flex items-center gap-2.5">
                {selectedTalent && (
                  <Avatar
                    sx={{
                      width: 34,
                      height: 34,
                      bgcolor: selectedTalent.color || "#eedbc9",
                      color: "#20201f",
                      fontWeight: 800,
                      fontSize: 13,
                      borderRadius: "10px",
                    }}
                  >
                    {selectedTalent.initials}
                  </Avatar>
                )}
                <div className="min-w-0">
                  <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#20201f" }}>
                    {selectedTalent?.name || "Chưa chọn"}
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: "text.secondary", lineClamp: 1 }}>
                    {selectedTalent?.role}
                  </Typography>
                </div>
              </div>
            </Paper>

            <Paper
              variant="outlined"
              sx={{
                p: 2.25,
                borderRadius: "18px",
                bgcolor: "background.paper",
                borderColor: "#e4e6e2",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div className="flex items-center justify-between text-xs text-[#747773] mb-2">
                <span>Tổng ngân sách</span>
                <Wallet size={16} className="text-[#bd3d14]" />
              </div>
              <div>
                <Typography sx={{ fontSize: 18, fontWeight: 800, color: "#bd3d14" }}>
                  {project.budget}
                </Typography>
                <Typography sx={{ fontSize: 11, color: "text.secondary", mt: 0.25 }}>
                  {effectiveAgreement ? `Hợp đồng v${effectiveAgreement.version} đã chốt` : "Đã xác nhận"}
                </Typography>
              </div>
            </Paper>

            <Paper
              variant="outlined"
              sx={{
                p: 2.25,
                borderRadius: "18px",
                bgcolor: "background.paper",
                borderColor: "#e4e6e2",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div className="flex items-center justify-between text-xs text-[#747773] mb-2">
                <span>Tiến độ mốc</span>
                <Layers3 size={16} className="text-[#176c9a]" />
              </div>
              <div>
                <Typography sx={{ fontSize: 18, fontWeight: 800, color: "#176c9a" }}>
                  {completedMilestonesCount}/{milestones.length || 2} mốc ({progressPercent}%)
                </Typography>
                <Typography sx={{ fontSize: 11, color: hasSubmittedMilestone ? "#bd3d14" : "text.secondary", fontWeight: hasSubmittedMilestone ? 700 : 400, mt: 0.25 }}>
                  {hasSubmittedMilestone ? "● Có mốc chờ bạn duyệt" : "Đang triển khai"}
                </Typography>
              </div>
            </Paper>

            <Paper
              variant="outlined"
              sx={{
                p: 2.25,
                borderRadius: "18px",
                bgcolor: "background.paper",
                borderColor: "#e4e6e2",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div className="flex items-center justify-between text-xs text-[#747773] mb-2">
                <span>Hạn hoàn thành</span>
                <CalendarDays size={16} className="text-[#62645e]" />
              </div>
              <div>
                <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#20201f" }}>
                  {project.deadline || "Chưa đặt"}
                </Typography>
                <Typography sx={{ fontSize: 11, color: "text.secondary", mt: 0.25 }}>
                  Thời lượng: {project.duration || "5 tuần"}
                </Typography>
              </div>
            </Paper>
          </div>

          {/* 2. Visual Milestone Pipeline & Progress Execution */}
          <Paper
            variant="outlined"
            sx={{
              p: { xs: 2.5, sm: 3.5 },
              borderRadius: "22px",
              bgcolor: "background.paper",
              borderColor: "#e4e6e2",
            }}
          >
            {/* Header with Title and Status Chip */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#eef0ea] pb-4 mb-5">
              <div>
                <div className="flex items-center gap-2">
                  <Typography sx={{ fontSize: 18, fontWeight: 800, color: "#20201f" }}>
                    Tiến độ thực hiện các mốc công việc
                  </Typography>
                  <Chip
                    label={`${progressPercent}% hoàn thành`}
                    size="small"
                    sx={{
                      height: 22,
                      fontWeight: 700,
                      fontSize: 11,
                      bgcolor: progressPercent > 0 ? "#e8f7ef" : "#f2f3f0",
                      color: progressPercent > 0 ? "#16805b" : "#747773",
                    }}
                  />
                </div>
                <Typography sx={{ fontSize: 13, color: "text.secondary", mt: 0.5 }}>
                  Theo dõi từng giai đoạn sản phẩm, kiểm tra tệp bàn giao và duyệt giải ngân.
                </Typography>
              </div>
            </div>

            {/* Overall Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center text-xs font-semibold mb-1.5 text-[#747773]">
                <span>Tiến trình dự án</span>
                <span className="text-[#20201f]">{completedMilestonesCount} / {milestones.length} mốc hoàn tất</span>
              </div>
              <LinearProgress
                variant="determinate"
                value={progressPercent}
                sx={{
                  height: 8,
                  borderRadius: 99,
                  bgcolor: "#f0f2eb",
                  "& .MuiLinearProgress-bar": {
                    bgcolor: progressPercent > 0 ? "#16805b" : "#f4490b",
                    borderRadius: 99,
                  },
                }}
              />
            </div>

            {/* Visual Milestone Cards Grid */}
            <div className="grid gap-4 md:grid-cols-2">
              {milestones.length > 0 ? (
                milestones.map((m, idx) => {
                  const isSubmitted = m.status === "submitted";
                  const isCompleted = m.status === "completed";

                  return (
                    <div
                      key={m.id}
                      className={`relative flex flex-col justify-between rounded-2xl border p-4 transition-all ${
                        isSubmitted
                          ? "border-[#f4490b] bg-[#fffaf7] shadow-sm"
                          : isCompleted
                          ? "border-[#cce9d8] bg-[#f7fbf8]"
                          : "border-[#e4e6e2] bg-[#fafbf9]"
                      }`}
                    >
                      <div>
                        {/* Top row: step number + status chip */}
                        <div className="flex items-center justify-between gap-2 mb-2.5">
                          <span className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-0.5 text-xs font-bold ${
                            isCompleted
                              ? "bg-[#e8f7ef] text-[#16805b]"
                              : isSubmitted
                              ? "bg-[#fff0e9] text-[#bd3d14]"
                              : "bg-[#eeefeb] text-[#747773]"
                          }`}>
                            {isCompleted ? <CheckCircle2 size={13} /> : <Clock size={13} />}
                            Mốc {idx + 1}
                          </span>

                          <Chip
                            label={
                              isCompleted
                                ? "Đã nghiệm thu"
                                : isSubmitted
                                ? "Chờ bạn duyệt"
                                : "Chưa bắt đầu"
                            }
                            size="small"
                            sx={{
                              height: 23,
                              fontSize: 11,
                              fontWeight: 700,
                              bgcolor: isCompleted
                                ? "#e8f7ef"
                                : isSubmitted
                                ? "#f4490b"
                                : "#f2f3f0",
                              color: isSubmitted ? "#ffffff !important" : isCompleted ? "#16805b" : "#747773",
                            }}
                          />
                        </div>

                        {/* Milestone Name & Deliverable */}
                        <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#20201f", mb: 0.5 }}>
                          {m.name}
                        </Typography>
                        <Typography sx={{ fontSize: 13, color: "#62665f", lineHeight: 1.5, mb: 3 }}>
                          {m.deliverable}
                        </Typography>
                      </div>

                      {/* Bottom Info & Action */}
                      <div className="border-t border-[#edf0ea] pt-3 mt-auto">
                        <div className="flex items-center justify-between text-sm mb-3">
                          <span className="text-[#747773] text-xs">Giá trị mốc:</span>
                          <strong className="text-base font-bold text-[#bd3d14]">{m.amount}</strong>
                        </div>

                        <div className="flex items-center justify-between text-xs text-[#747773] mb-3">
                          <span>Hạn nộp: <strong>{m.deadline}</strong></span>
                          {isSubmitted && <span className="font-semibold text-[#bd3d14]">Có sản phẩm đính kèm</span>}
                        </div>

                        {isSubmitted ? (
                          <Button
                            component={Link}
                            to={`/business/projects/${project.id}/progress`}
                            variant="contained"
                            fullWidth
                            startIcon={<Sparkles size={15} />}
                            sx={{
                              minHeight: 38,
                              borderRadius: 999,
                              fontWeight: 700,
                              fontSize: 13,
                              bgcolor: "#f4490b !important",
                              color: "#ffffff !important",
                              "&&": { color: "#ffffff !important" },
                              "& *": { color: "#ffffff !important" },
                              "&:hover": { bgcolor: "#bd3d14 !important", color: "#ffffff !important" },
                            }}
                          >
                            Kiểm tra & Nghiệm thu mốc này
                          </Button>
                        ) : (
                          <Button
                            component={Link}
                            to={`/business/projects/${project.id}/progress`}
                            variant="outlined"
                            fullWidth
                            sx={{
                              minHeight: 36,
                              borderRadius: 999,
                              fontSize: 12,
                              fontWeight: 600,
                              borderColor: "#e4e6e2",
                              color: "text.secondary",
                              "&:hover": { borderColor: "primary.main", color: "primary.dark", bgcolor: "#fffaf7" },
                            }}
                          >
                            Xem chi tiết trong Workspace
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-[#747773] py-6 text-center col-span-2">Chưa có mốc công việc nào.</p>
              )}
            </div>
          </Paper>

          {/* 3. Deliverables Checklist (Clean, visual 3-column cards) */}
          <Paper
            variant="outlined"
            sx={{
              p: { xs: 2.5, sm: 3 },
              borderRadius: "20px",
              bgcolor: "background.paper",
              borderColor: "#e4e6e2",
            }}
          >
            <div className="flex items-center justify-between gap-2 border-b border-[#eef0ea] pb-3 mb-3.5">
              <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#20201f" }}>
                Hạng mục bàn giao cam kết (Deliverables)
              </Typography>
              <span className="text-xs text-[#747773] font-medium">{project.deliverables?.length || 0} hạng mục chính</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {project.deliverables?.map((deliv, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2.5 rounded-xl border border-[#edf0ea] bg-[#fafbf9] p-3 text-sm text-[#30322f]"
                >
                  <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-[#16805b]" />
                  <span className="font-medium leading-snug">{deliv}</span>
                </div>
              ))}
            </div>
          </Paper>
        </div>
      ) : (
        <BusinessProjectBrief
          key={project.id}
          project={project}
          candidateCount={projectCandidates.length}
          executorName={selectedTalent?.name}
          inboxPath={projectInboxPath}
          onCloseProject={() => setCloseDialogOpen(true)}
        />
      )}

      <CloseProjectDialog
        open={closeDialogOpen}
        onClose={() => setCloseDialogOpen(false)}
        onConfirm={() => {
          closeProject(project.id);
          navigate(`/business/projects/${project.id}`);
        }}
        projectTitle={project.title}
      />
    </Box>
  );
}
