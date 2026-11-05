import { useState } from "react";
import { Alert, Box, Button, Chip, Paper, Snackbar, Stack, Typography } from "@mui/material";
import { ArrowLeft, CheckCircle2, ClipboardCheck, Eye, FileText, History, Info, RotateCcw, UploadCloud, Wallet } from "lucide-react";
import { Link, Navigate } from "react-router";
import { ProjectBreadcrumbs } from "@/app/shared/components/ProjectBreadcrumbs";
import { useWorkspace } from "../hooks/useWorkspace";
import { milestoneTitle, workspaceDate } from "../utils/workspace";
import { WorkspaceProgressOverview } from "../components/WorkspaceProgressOverview";
import { WorkspaceContextSidebar } from "../components/WorkspaceContextSidebar";
import { MilestoneTimeline } from "../components/MilestoneTimeline";
import { SubmitDeliverableDialog } from "../components/SubmitDeliverableDialog";
import { AcceptanceReviewDialog } from "../components/AcceptanceReviewDialog";
import { ProjectCompletedModal } from "../components/ProjectCompletedModal";
import { ScopeChangeRequestModal } from "../components/ScopeChangeRequestModal";
import { OverdueWarningBanner } from "../components/OverdueWarningBanner";

const headerActionBtnSx = {
  minHeight: 40,
  borderRadius: 999,
  bgcolor: "background.paper",
  border: "1px solid #e4e6e2",
  color: "text.primary",
  px: 2.25,
  fontSize: 13,
  fontWeight: 600,
  textTransform: "none",
  boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
  "&:hover": {
    bgcolor: "#fffaf7",
    borderColor: "primary.main",
    color: "primary.dark",
  },
};

export function WorkspaceOverviewPage() {
  const workspace = useWorkspace();
  const [expandedId, setExpandedId] = useState<string | null | undefined>(undefined);
  const { project, agreement, talent, isBusiness, milestones, pendingMilestone } = workspace;
  const containerSx = {
    maxWidth: 1440, mx: "auto", minWidth: 0,
    px: isBusiness ? 0 : { xs: 2, md: 4 }, py: isBusiness ? 0 : 3, pb: isBusiness ? 0 : 6,
    "& .MuiButton-root": { minHeight: 44, fontSize: 14 },
    "& .MuiButton-contained": { bgcolor: "primary.dark", color: "primary.contrastText", "&:hover": { bgcolor: "primary.dark" } },
  };
  if (!project || !agreement) return <Box className={isBusiness ? undefined : "frevo-work-surface"} sx={containerSx}><Paper variant="outlined" sx={{ p: { xs: 3, md: 6 }, borderRadius: "13px", textAlign: "center" }}>
    <Typography component="h1" variant="h5">Không tìm thấy không gian làm việc</Typography>
    <Typography color="text.secondary" sx={{ my: 2 }}>Dự án chưa có thỏa thuận hợp tác được xác nhận hoặc không còn trong dữ liệu hiện tại.</Typography>
    <Button component={Link} to={isBusiness ? "/business/projects" : "/freelancer/work"} variant="outlined">Về danh sách công việc</Button>
  </Paper></Box>;
  if (!workspace.canAccess) return <Navigate to="/forbidden" replace />;

  const nextMilestone = pendingMilestone ?? milestones.find(item => item.status === "in_progress") ?? milestones.find(item => item.status === "upcoming");
  const activeId = expandedId === undefined ? nextMilestone?.id ?? milestones[0]?.id ?? null : expandedId;
  const listPath = isBusiness ? "/business/ongoing" : "/freelancer/work";
  const paymentPath = isBusiness ? `/payments/${project.id}` : `/freelancer/payments/${project.id}`;
  function selectMilestone(id: string) {
    setExpandedId(id);
    requestAnimationFrame(() => {
      document.getElementById(`milestone-${id}`)?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
      document.getElementById(`milestone-${id}-heading`)?.focus({ preventScroll: true });
    });
  }

  return <Box className={isBusiness ? undefined : "frevo-work-surface"} component={isBusiness ? "div" : "main"} id={isBusiness ? "workspace-content" : "main"} sx={containerSx}>
    <ProjectBreadcrumbs items={[
      { label: isBusiness ? "Đang tiến hành" : "Công việc của tôi", to: listPath },
      { label: project.title, to: workspace.projectPath }, { label: "Tiến độ" },
    ]} />
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 2, flexWrap: "wrap", mb: 3 }}>
      <Box sx={{ minWidth: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
          <Typography component="h1" id="workspace-title" sx={{ fontFamily: "h1.fontFamily", fontSize: { xs: 27, md: 32 }, fontWeight: 800, lineHeight: 1.25 }}>
            Tiến độ dự án<Box component="span" color="primary.main">.</Box>
          </Typography>
          <Chip label={project.status === "completed" ? "Đã hoàn thành" : "Đang thực hiện"} size="small" sx={{ bgcolor: "#fff0e9", color: "primary.dark", fontWeight: 600 }} />
        </Box>
        <Typography color="text.secondary" sx={{ mt: 1, overflowWrap: "anywhere" }}>{project.title}</Typography>
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, alignItems: "center" }}>
        <Button
          component={Link}
          to={listPath}
          startIcon={<ArrowLeft size={16} aria-hidden="true" />}
          sx={headerActionBtnSx}
        >
          {isBusiness ? "Về danh sách đang tiến hành" : "Về danh sách công việc"}
        </Button>
        {isBusiness && (
          <Button
            component={Link}
            to={paymentPath}
            startIcon={<Wallet size={16} aria-hidden="true" />}
            sx={headerActionBtnSx}
          >
            Sổ thanh toán & Ký quỹ
          </Button>
        )}
        <Button
          component={Link}
          to={workspace.agreementPath}
          startIcon={<FileText size={16} aria-hidden="true" />}
          sx={headerActionBtnSx}
        >
          Thỏa thuận hợp tác
        </Button>
      </Box>
    </Box>

    <Alert severity="info" icon={<Info size={19} aria-hidden="true" />} sx={{ mb: 3, borderRadius: "13px", bgcolor: "background.paper", color: "text.secondary", border: "1px solid", borderColor: "divider", "& .MuiAlert-icon": { color: "primary.dark" } }}>
      Không gian làm việc mô phỏng. Bàn giao, nghiệm thu và thanh toán tại đây giúp hai bên thử luồng hợp tác; không có tiền thật được chuyển.
      {agreement.confirmationSource === "demo" && " Dự án bắt đầu từ xác nhận mô phỏng của bên thực hiện."}
    </Alert>
    <WorkspaceProgressOverview milestones={milestones} activeId={activeId} onSelect={selectMilestone} />

    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr)", lg: "minmax(0, 1fr) 340px" }, gap: 3, alignItems: "start", mt: 3 }}>
      <Stack spacing={3} sx={{ minWidth: 0 }}>
        {nextMilestone && <Paper component="section" aria-label="Mốc cần theo dõi" variant="outlined" sx={{ p: { xs: 2.5, md: 3 }, bgcolor: pendingMilestone ? "#fff0e9" : "background.paper", borderRadius: "13px" }}>
          <Typography sx={{ fontSize: 13, color: "primary.dark", fontWeight: 700, mb: 1 }}>
            {pendingMilestone ? isBusiness ? "Cần phản hồi" : "Đang chờ nghiệm thu" : isBusiness ? "Mốc tiếp theo" : "Việc cần làm"}
          </Typography>
          <Typography component="h2" sx={{ fontFamily: "h2.fontFamily", fontSize: 20, fontWeight: 700, overflowWrap: "anywhere" }}>{milestoneTitle(nextMilestone.name)}</Typography>
          <Typography sx={{ mt: 1, fontSize: 15, color: "text.secondary", lineHeight: 1.7 }}>
            {pendingMilestone
              ? isBusiness ? "Bên thực hiện đã gửi bàn giao. Kiểm tra sản phẩm và đối chiếu tiêu chí trước khi phản hồi." : "Bàn giao đã được gửi. Doanh nghiệp sẽ kiểm tra và phản hồi theo các tiêu chí đã thống nhất."
              : nextMilestone.deliverable}
          </Typography>
          <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
            {pendingMilestone
              ? <Button variant={isBusiness ? "contained" : "outlined"} startIcon={isBusiness ? <ClipboardCheck size={17} aria-hidden="true" /> : <Eye size={17} aria-hidden="true" />} onClick={() => workspace.openReview(pendingMilestone)}>{isBusiness ? "Kiểm tra & nghiệm thu" : "Xem bàn giao"}</Button>
              : !isBusiness ? <Button variant="contained" startIcon={<UploadCloud size={17} aria-hidden="true" />} onClick={() => workspace.openSubmit(nextMilestone)}>Nộp bàn giao</Button>
              : <Button variant="outlined" onClick={() => selectMilestone(nextMilestone.id)}>Xem mốc công việc</Button>}
            <Typography variant="body2" color="text.secondary">Hạn bàn giao: {nextMilestone.deadline}</Typography>
          </Box>
        </Paper>}
        {workspace.overdueMilestone && <OverdueWarningBanner milestoneName={workspace.overdueMilestone.name} deadline={workspace.overdueMilestone.deadline} projectId={project.id} chatPath={workspace.chatPath} />}
        <MilestoneTimeline milestones={milestones} expandedId={activeId} onToggle={setExpandedId} isBusiness={isBusiness} onSubmitDeliverable={workspace.openSubmit} onReviewDeliverable={workspace.openReview} />
        <Paper component="section" aria-labelledby="workspace-activity-title" variant="outlined" sx={{ p: { xs: 2.5, md: 3 }, borderRadius: "13px" }}>
          <Typography component="h2" id="workspace-activity-title" sx={{ fontFamily: "h2.fontFamily", fontSize: 20, fontWeight: 700, display: "flex", alignItems: "center", gap: 1, mb: 2.5 }}><History size={20} aria-hidden="true" />Nhật ký hoạt động</Typography>
          {!workspace.activities.length && <Typography color="text.secondary">Chưa có cập nhật. Các lần bàn giao và nghiệm thu sẽ xuất hiện tại đây.</Typography>}
          <Stack component="ol" spacing={2.5} sx={{ m: 0, p: 0, listStyle: "none" }}>{workspace.activities.map(activity => {
            const Icon = activity.type === "submitted" ? UploadCloud : activity.type === "revision" ? RotateCcw : CheckCircle2;
            return <Box component="li" key={activity.id} sx={{ display: "flex", gap: 1.5, alignItems: "start" }}>
              <Box sx={{ display: "flex", p: 1, borderRadius: "50%", bgcolor: "background.default", color: "primary.dark", flexShrink: 0 }}><Icon size={17} aria-hidden="true" /></Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontSize: 15, fontWeight: 600, overflowWrap: "anywhere" }}>{activity.title}</Typography>
                <Typography component="time" sx={{ fontSize: 13, color: "text.secondary", display: "block", mt: 0.5 }}>{workspaceDate(activity.date)}</Typography>
                <Typography sx={{ mt: 0.75, color: "text.secondary", fontSize: 14, lineHeight: 1.7, whiteSpace: "pre-line", overflowWrap: "anywhere" }}>{activity.description}</Typography>
              </Box>
            </Box>;
          })}</Stack>
        </Paper>
      </Stack>
      <WorkspaceContextSidebar agreement={agreement} talent={talent} company={project.company} isBusiness={isBusiness} payments={workspace.projectPayments} agreementPath={workspace.agreementPath} paymentPath={paymentPath} chatPath={workspace.chatPath} onScopeChange={() => workspace.setScopeOpen(true)} />
    </Box>
    {workspace.reviewMilestone && <AcceptanceReviewDialog
      key={workspace.reviewMilestone.id}
      open
      milestone={workspace.reviewMilestone}
      performerName={talent?.name}
      agreementReference={agreement.reference}
      initialDecision={workspace.reviewMode}
      readOnly={!isBusiness || workspace.reviewMilestone.status !== "submitted"}
      actionError={workspace.actionError}
      onClose={workspace.closeReview}
      onApprove={workspace.approve}
      onRequestRevision={workspace.requestRevision} />}
    {workspace.submitMilestone && <SubmitDeliverableDialog
      key={workspace.submitMilestone.id}
      open
      milestone={workspace.submitMilestone}
      onClose={workspace.closeSubmit}
      onSubmit={workspace.submitDeliverable} />}
    {workspace.scopeOpen && <ScopeChangeRequestModal
      open
      projectTitle={project.title}
      onClose={() => workspace.setScopeOpen(false)}
      onProceedToProposal={workspace.proceedToScope} />}
    <ProjectCompletedModal
      open={workspace.completedOpen}
      projectTitle={project.title}
      partnerName={talent?.name ?? "Bên thực hiện"}
      onClose={() => workspace.setCompletedOpen(false)}
      onOpenReview={workspace.openProjectReview} />
    <Snackbar
      open={!!workspace.toast}
      autoHideDuration={5000}
      onClose={() => workspace.setToast("")}
      message={workspace.toast} />
  </Box>;
}

export default WorkspaceOverviewPage;
