import { Alert, Box, Button, Chip, IconButton, Paper, Snackbar, Typography } from "@mui/material";
import { ArrowLeft, CalendarDays, CheckCircle2, ClipboardCheck, Eye, FileText, Handshake, History, Info, MessageCircle, RotateCcw, UploadCloud, Wallet } from "lucide-react";
import { Link, Navigate } from "react-router";
import { ProjectBreadcrumbs } from "@/app/shared/components/ProjectBreadcrumbs";
import { useWorkspace } from "../hooks/useWorkspace";
import { workspaceDate } from "../utils/workspace";
import { WorkspaceProgressOverview } from "../components/WorkspaceProgressOverview";
import { WorkspaceContextSidebar } from "../components/WorkspaceContextSidebar";
import { MilestoneTimeline } from "../components/MilestoneTimeline";
import { SubmitDeliverableDialog } from "../components/SubmitDeliverableDialog";
import { AcceptanceReviewDialog } from "../components/AcceptanceReviewDialog";
import { ProjectCompletedModal } from "../components/ProjectCompletedModal";
import { ScopeChangeRequestModal } from "../components/ScopeChangeRequestModal";
import { OverdueWarningBanner } from "../components/OverdueWarningBanner";

export function WorkspaceOverviewPage() {
  const workspace = useWorkspace();
  const { project, agreement, talent, isBusiness, milestones, pendingMilestone } = workspace;
  if (!project || !agreement) return <Paper elevation={0} sx={{ p: 5, borderRadius: "16px", textAlign: "center" }}>
    <Typography component="h1" variant="h5">Không tìm thấy không gian làm việc</Typography>
    <Typography sx={{ my: 2, fontSize: 13, color: "text.secondary" }}>Dự án chưa có thỏa thuận hợp tác được xác nhận hoặc không còn trong dữ liệu hiện tại.</Typography>
    <Button
      component={Link}
      to={isBusiness ? "/business/projects" : "/freelancer/applications"}
      startIcon={<ArrowLeft size={16} />}>Về danh sách dự án</Button>
  </Paper>;
  if (!workspace.canAccess) return <Navigate to="/forbidden" replace />;
  const pendingIndex = milestones.findIndex(item => item.id === pendingMilestone?.id);
  function selectMilestone(id: string) {
    document.getElementById(`milestone-${id}`)?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
  }
  return <Box
    sx={{
      minWidth: 0,
      "&& .MuiButton-root": { fontFamily: "inherit", fontSize: 12, fontWeight: 600, minHeight: 36 },
      "&& .MuiButton-contained": { color: "primary.contrastText" },
      "& h1, & h2, & h3": { letterSpacing: "-.015em" }
    }}>
    {agreement.confirmationSource === "demo" && <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>Dự án bắt đầu từ xác nhận mô phỏng của Provider. Không phải phản hồi thật hoặc giao dịch thanh toán.</Alert>}
    <ProjectBreadcrumbs
      items={isBusiness ? [
        { label: "Dự án của tôi", to: "/business/projects" },
        { label: project.title, to: workspace.projectPath },
        { label: "Tiến độ" },
      ] : [
        { label: "Việc làm đã ứng tuyển", to: "/freelancer/applications" },
        { label: project.title, to: workspace.projectPath },
        { label: "Tiến độ" },
      ]} />
    <Box component="section" aria-labelledby="workspace-title" sx={{ mb: 3.5 }}>
      <Box className="flex flex-wrap items-center gap-3">
        <Typography
          component="h1"
          id="workspace-title"
          sx={{ fontFamily: "h1.fontFamily", fontSize: { xs: 25, md: 32 }, fontWeight: 800, lineHeight: 1.25 }}>{project.title}
          <Box component="span" sx={{ color: "primary.main" }}>.</Box>
        </Typography>
        <Chip
          size="small"
          icon={<Box sx={{ width: "6px !important", height: 6, bgcolor: "currentColor", borderRadius: "50%", ml: "10px !important" }} />}
          label={project.status === "completed" ? "Đã hoàn thành" : "Đang tiến hành"}
          sx={{ height: 25, fontSize: 10, bgcolor: "#e8f7ef", color: "#16805b", fontWeight: 600 }} />
      </Box>
      <Box className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2" sx={{ color: "text.secondary" }}>
        <Typography className="flex items-center gap-1.5" sx={{ fontSize: 12, fontWeight: 600, color: "text.primary" }}>
          <Handshake size={15} />{project.company}
          <Box component="span" sx={{ mx: .5, color: "text.secondary" }}>↔</Box>{talent?.name ?? "Bên thực hiện"} ({talent?.kind ?? "Freelancer"})
        </Typography>
        <Typography className="flex items-center gap-1" sx={{ fontSize: 12 }}>
          <CalendarDays size={14} />Hạn hoàn thành:
          <Box component="strong" sx={{ color: "text.primary" }}>{agreement.deadline}</Box>
        </Typography>
        <Typography sx={{ fontSize: 11 }}>{agreement.reference}</Typography>
      </Box>
      <Box className="mt-5 flex flex-wrap items-center gap-2">
        <Button
          component={Link}
          to={workspace.projectPath}
          startIcon={<FileText size={14} />}
          sx={{ bgcolor: "#efefec", color: "text.primary", fontSize: 11, px: 1.75 }}>Về dự án</Button>
        <Button
          component={Link}
          to={workspace.agreementPath}
          startIcon={<Handshake size={14} />}
          sx={{ bgcolor: "#efefec", color: "text.primary", fontSize: 11, px: 1.75 }}>Thỏa thuận</Button>
        <Button
          component={Link}
          to={workspace.chatPath}
          startIcon={<MessageCircle size={14} />}
          sx={{ bgcolor: "#efefec", color: "text.primary", fontSize: 11, px: 1.75 }}>Tin nhắn</Button>
        <Button
          component={Link}
          to={isBusiness ? `/payments/${project.id}` : `/freelancer/payments/${project.id}`}
          startIcon={<Wallet size={14} />}
          sx={{ bgcolor: "#efefec", color: "text.primary", fontSize: 11, px: 1.75 }}>Sổ thanh toán (Mô phỏng)</Button>
      </Box>
    </Box>
    <Box className="flex flex-col">
      <Box sx={{ mb: 3, order: { xs: 2, md: 1 } }}>
        <WorkspaceProgressOverview
          milestones={milestones}
          budget={agreement.budgetValue != null ? `${agreement.budgetValue.toLocaleString("vi-VN")} đ` : agreement.budget}
          onSelect={selectMilestone} />
      </Box>
      {pendingMilestone && <Paper
        elevation={0}
        sx={{ p: { xs: 2.5, md: 3 }, bgcolor: "#fff0e9", borderRadius: "16px", mb: 4, order: { xs: 1, md: 2 } }}>
        <Box
          className="flex flex-col justify-between gap-5"
          sx={{ flexDirection: { xs: "column", xl: "row" }, alignItems: { xl: "center" } }}>
          <Box className="flex items-start gap-3">
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
                bgcolor: "primary.dark",
                color: "primary.contrastText"
              }}>
              <ClipboardCheck size={21} />
            </Box>
            <Box>
              <Box className="flex flex-wrap items-center gap-2">
                <Typography component="h2" sx={{ fontFamily: "h3.fontFamily", fontSize: 17, fontWeight: 700, lineHeight: 1.5 }}>{isBusiness ? `Bàn giao Mốc ${pendingIndex + 1} đã được gửi, đang chờ bạn nghiệm thu` : `Mốc ${pendingIndex + 1} đang chờ doanh nghiệp nghiệm thu`}</Typography>{isBusiness && <Chip
                  size="small"
                  label="Cần hành động"
                  sx={{ height: 21, bgcolor: "#ffdbcb", color: "primary.dark", fontSize: 9, fontWeight: 700 }} />}
              </Box>
              <Typography sx={{ fontSize: 12, lineHeight: 1.85, color: "text.secondary", mt: .75 }}>{talent?.name ?? "Bên thực hiện"} đã gửi bàn giao ngày
                <Box component="strong" sx={{ color: "text.primary" }}>{workspaceDate(pendingMilestone.submittedAt)}</Box>. Kiểm tra sản phẩm và đối chiếu các tiêu chí trước khi phản hồi.
              </Typography>
            </Box>
          </Box>
          <Box className="flex flex-wrap items-center gap-2" sx={{ flexShrink: 0, pl: { xs: 0, sm: "54px", xl: 0 } }}>{isBusiness && <Button
            variant="contained"
            startIcon={<CheckCircle2 size={15} />}
            onClick={() => workspace.openReview(pendingMilestone)}
            sx={{ fontSize: 11, px: 2.5, bgcolor: "primary.dark", "&:hover": { bgcolor: "primary.main" } }}>Nghiệm thu mốc {pendingIndex + 1}</Button>}
            <Button
              onClick={() => workspace.openReview(pendingMilestone)}
              startIcon={<Eye size={15} />}
              sx={{ bgcolor: "background.paper", color: "text.primary", fontSize: 11, px: 2 }}>Kiểm tra bàn giao</Button>
            <IconButton
              component={Link}
              to={workspace.chatPath}
              aria-label="Nhắn tin trao đổi"
              size="small"
              sx={{ bgcolor: "background.paper", p: 1.1 }}>
              <MessageCircle size={16} />
            </IconButton>
          </Box>
        </Box>
      </Paper>}
    </Box>
    {workspace.overdueMilestone && <OverdueWarningBanner
      milestoneName={workspace.overdueMilestone.name}
      deadline={workspace.overdueMilestone.deadline}
      projectId={project.id}
      chatPath={workspace.chatPath} />}
    <Box
      className="grid items-start gap-6"
      sx={{ gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 2.2fr) minmax(270px, 1fr)" } }}>
      <Box className="flex min-w-0 flex-col gap-6">
        <MilestoneTimeline
          milestones={milestones}
          isBusiness={isBusiness}
          onSubmitDeliverable={workspace.openSubmit}
          onReviewDeliverable={workspace.openReview} />
        <Paper elevation={0} sx={{ p: { xs: 2.5, md: 3 }, border: "1px solid", borderColor: "divider", borderRadius: "16px" }}>
          <Typography
            component="h2"
            className="flex items-center gap-2"
            sx={{ fontFamily: "h3.fontFamily", fontSize: 16, fontWeight: 700, mb: 2.5 }}>
            <History size={19} color="currentColor" />Nhật ký hoạt động dự án
          </Typography>
          {!workspace.activities.length && <Typography sx={{ fontSize: 12, color: "text.secondary" }}>Chưa có cập nhật. Các lần bàn giao và nghiệm thu sẽ xuất hiện tại đây.</Typography>}
          <Box component="ol" sx={{ p: 0, m: 0, listStyle: "none" }}>{workspace.activities.map((activity, index) => {
            const Icon = activity.type === "submitted" ? UploadCloud : activity.type === "revision" ? RotateCcw : CheckCircle2;
            return <Box
              component="li"
              key={activity.id}
              sx={{
                ml: 1.5,
                pl: 3.5,
                pb: index === workspace.activities.length - 1 ? 0 : 3,
                position: "relative",
                borderLeft: index === workspace.activities.length - 1 ? "1px solid transparent" : "1px solid",
                borderColor: index === workspace.activities.length - 1 ? "transparent" : "divider"
              }}>
              <Box
                sx={{
                  position: "absolute",
                  left: -12,
                  top: 0,
                  width: 24,
                  height: 24,
                  display: "grid",
                  placeItems: "center",
                  borderRadius: "50%",
                  bgcolor: activity.type === "completed" ? "#e8f7ef" : "#fff0e9",
                  color: activity.type === "completed" ? "#16805b" : "primary.dark",
                  outline: "4px solid white"
                }}>
                <Icon size={13} />
              </Box>
              <Box className="flex flex-wrap items-baseline justify-between gap-2">
                <Typography sx={{ fontSize: 12, fontWeight: 600 }}>{activity.title}</Typography>
                <Typography component="time" sx={{ fontSize: 10, color: "text.secondary" }}>{workspaceDate(activity.date)}</Typography>
              </Box>
              <Typography sx={{ fontSize: 11, lineHeight: 1.8, color: "text.secondary", mt: .75, whiteSpace: "pre-line" }}>{activity.description}</Typography>
            </Box>;
          })}</Box>
        </Paper>
      </Box>
      <WorkspaceContextSidebar
        agreement={agreement}
        talent={talent}
        payments={workspace.projectPayments}
        chatPath={workspace.chatPath}
        onScopeChange={() => workspace.setScopeOpen(true)} />
    </Box>
    <Box className="mt-6 flex items-start gap-2" sx={{ color: "text.secondary" }}>
      <Info size={13} className="shrink-0" />
      <Typography sx={{ fontSize: 10 }}>Không gian làm việc mô phỏng. Bàn giao, nghiệm thu và thanh toán minh họa giúp hai bên thử luồng hợp tác.</Typography>
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
