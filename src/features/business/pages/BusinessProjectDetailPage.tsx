import { useState } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router";
import { ArrowRight, BriefcaseBusiness, CalendarDays, Eye, MessageCircleMore, Wallet } from "lucide-react";
import { Box, Button, Typography } from "@mui/material";
import { ProjectBreadcrumbs } from "@/app/shared/components/ProjectBreadcrumbs";
import { useBusiness } from "@/lib/hooks/useBusiness";
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
  const selectedTalent = selectedCandidate
    ? talents.find((t) => t.id === selectedCandidate.talentId)
    : undefined;

  const currentTab = parts[3] || (project.status === "published" ? "applicants" : "brief");

  const tabs: { segment: string; label: string; count?: number }[] = project.status === "published"
    ? [
        { segment: "applicants", label: "Ứng viên", count: projectCandidates.length },
        { segment: "suggestions", label: "Gợi ý phù hợp" },
        { segment: "invitations", label: "Lời mời đã gửi", count: projectInvitations.length },
      ]
    : [{ segment: "brief", label: "Brief" }];

  if (project.status === "ongoing") {
    tabs.push(
      { segment: "executor", label: "Người thực hiện" },
      { segment: "messages", label: "Hộp tin nhắn" },
      { segment: "progress", label: "Tiến độ" },
      { segment: "agreement", label: "Hợp đồng" }
    );
  } else if (project.status === "published") {
    // Recruitment tabs are the primary workflow; brief and chat remain in the utility links.
  } else if (project.status === "closed") {
    tabs.push(
      { segment: "applicants", label: "Ứng viên", count: projectCandidates.length },
      { segment: "messages", label: "Hộp tin nhắn" }
    );
  }

  return (
    <Box sx={(theme) => ({
      zoom: 0.9,
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
    })}>
      <ProjectBreadcrumbs items={[{ label: "Dự án của tôi", to: "/business/projects" }, { label: project.title }]} />

      <header className="rounded-[24px] border border-[#eceae7] bg-white px-5 py-5 sm:px-7 sm:py-6">
        <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
          <div className="min-w-0">
            <span className={`mb-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${project.status === "published" || project.status === "ongoing" ? "bg-[#e8f7ef] text-[#16805b]" : "bg-[#f2f3f0] text-[#62625e]"}`}><span className="size-1.5 rounded-full bg-current" aria-hidden="true" />{statusLabel(project.status)}</span>
            <Typography component="h1" variant="h4" sx={{ maxWidth: 650, lineHeight: 1.22, fontSize: { xs: "1.5rem", sm: "1.875rem" }, fontWeight: 800 }}>{project.title}</Typography>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#747773]">
              <span className="inline-flex items-center gap-1.5"><Wallet size={16} className="text-[#bd3d14]" aria-hidden="true" /> Ngân sách: <strong className="font-semibold text-[#20201f]">{project.budget || "Chưa đặt"}</strong></span>
              <span className="inline-flex items-center gap-1.5"><CalendarDays size={16} aria-hidden="true" /> Hạn ứng tuyển: <strong className="font-semibold text-[#20201f]">{project.applicationDeadline || "Chưa đặt"}</strong></span>
            </div>
          </div>
          {project.status !== "draft" && <div className="flex flex-wrap items-center gap-2 lg:shrink-0">
            {project.status === "published" && currentTab !== "brief" && <Button component={Link} to={`/business/projects/${project.id}/brief`} startIcon={<Eye size={16} />} sx={{ minHeight: 40, borderRadius: 999, bgcolor: "#f2f3f0", color: "text.primary", px: 2, fontSize: 13 }}>Xem brief</Button>}
            <Button component={Link} to={projectInboxPath} startIcon={<MessageCircleMore size={16} />} sx={{ minHeight: 40, borderRadius: 999, bgcolor: "#f2f3f0", color: "text.primary", px: 2, fontSize: 13 }}>Tin nhắn</Button>
          </div>}
        </div>
      </header>

      <nav className="mb-5 mt-3 flex items-center justify-between gap-2 overflow-x-auto border-b border-[#e4e6e2] px-1" aria-label="Các mục của dự án">
        <div className="flex min-w-0 items-center gap-1 overflow-x-auto">
        {tabs.map((tab) => {
          let targetPath = tab.segment
            ? `/business/projects/${project.id}/${tab.segment}`
            : `/business/projects/${project.id}`;
          if (tab.segment === "messages") {
            targetPath = projectInboxPath;
          } else if (tab.segment === "agreement") {
            targetPath = `/projects/${project.id}/agreement`;
          } else if (tab.segment === "progress") {
            targetPath = `/workspace/${project.id}`;
          }

          return (
            <Link
              key={tab.segment}
              to={targetPath}
              aria-current={currentTab === tab.segment ? "page" : undefined}
              className={`inline-flex min-h-12 shrink-0 items-center gap-2 border-b-2 px-3 text-sm font-semibold transition-colors sm:px-4 ${currentTab === tab.segment ? "border-[#f4490b] text-[#bd3d14]" : "border-transparent text-[#747773] hover:text-[#20201f]"}`}
            >
              {tab.label}
              {tab.count !== undefined && <span className={`rounded-full px-2 py-0.5 text-xs ${currentTab === tab.segment ? "bg-[#fff0e9] text-[#bd3d14]" : "bg-[#f2f3f0] text-[#747773]"}`}>{tab.count}</span>}
            </Link>
          );
        })}
        {project.status === "published" && <Link to={`/business/projects/${project.id}/brief`} aria-current={currentTab === "brief" ? "page" : undefined} className={`inline-flex min-h-11 shrink-0 items-center border-b-2 px-3 text-xs font-semibold xl:hidden ${currentTab === "brief" ? "border-[#f4490b] text-[#bd3d14]" : "border-transparent text-[#747773]"}`}>Brief</Link>}
        </div>
      </nav>

      {/* Tab Switcher: Suggestions (BUS-007) / Invitations (BUS-010) / Applicants (BUS-011) / Executor / Brief View (BUS-005) */}
      {currentTab === "suggestions" && project.status === "published" ? (
        <CandidateSuggestionsTab project={project} />
      ) : currentTab === "invitations" && project.status === "published" ? (
        <SentInvitationsTab project={project} />
      ) : currentTab === "applicants" && project.status !== "draft" ? (
        <ProjectApplicantsTab project={project} />
      ) : currentTab === "executor" && project.status === "ongoing" ? (
        <div className="fb-detail-grid">
          <section className="fb-panel fb-executor">
            <span className="fb-eyebrow">NGƯỜI THỰC HIỆN DỰ ÁN</span>
            {selectedTalent ? (
              <>
                <div className="fb-executor-head">
                  <span
                    className="fb-avatar fb-avatar-lg"
                    style={{ background: selectedTalent.color }}
                  >
                    {selectedTalent.initials}
                  </span>
                  <div>
                    <span className="fb-badge fb-badge-green">Đã chốt hợp tác</span>
                    <h2>{selectedTalent.name}</h2>
                    <p>
                      {selectedTalent.role} · {selectedTalent.kind} · {selectedTalent.location}
                    </p>
                  </div>
                </div>
                <p>{selectedTalent.about}</p>
                <div className="fb-facts">
                  <div>
                    <small>Dự án</small>
                    <strong>{project.title}</strong>
                  </div>
                  <div>
                    <small>Ngân sách đã chốt</small>
                    <strong>{project.budget}</strong>
                  </div>
                </div>
                <div className="fb-executor-actions">
                  <Link
                    className="fb-button fb-button-small fb-button-primary"
                    to={projectInboxPath}
                  >
                    Mở hội thoại <ArrowRight size={17} />
                  </Link>
                  <Link
                    className="fb-button fb-button-small fb-button-secondary"
                    to={`/workspace/${project.id}`}
                  >
                    Xem tiến độ & Không gian làm việc
                  </Link>
                </div>
              </>
            ) : (
              <p style={{ marginTop: "16px", color: "#777" }}>
                Chưa có thông tin người thực hiện được chọn.
              </p>
            )}
          </section>
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
