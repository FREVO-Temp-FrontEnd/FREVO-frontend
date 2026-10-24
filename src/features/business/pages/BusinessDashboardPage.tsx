import { Link } from "react-router";
import { Avatar, Box, Button, Chip, Paper, Typography } from "@mui/material";
import { ArrowRight, BriefcaseBusiness, CalendarDays, CheckCheck, ChevronDown, Clock3, FileCheck2, FolderOpen, Layers3, MessageCircle, Plus, Users } from "lucide-react";
import { useBusinessDashboard } from "../hooks/useBusinessDashboard";

const taskAppearance = {
  candidate: { icon: Users, color: "#bd3d14", background: "#fff0e9" },
  milestone: { icon: FileCheck2, color: "#16805b", background: "#e8f7ef" },
  message: { icon: MessageCircle, color: "#176c9a", background: "#eaf4fb" },
};
const panelSx = { borderRadius: "22px", borderColor: "divider", overflow: "hidden", bgcolor: "background.paper" };
const sectionTitleSx = { fontSize: 17, fontWeight: 700, lineHeight: 1.4 };
const quietButtonSx = { color: "text.secondary", fontSize: 12, flexShrink: 0, minHeight: 36 };
const rowLinkSx = {
  color: "text.primary", transition: "background-color 150ms ease",
  "&:hover": { bgcolor: "#fafbf9" },
  "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: -2 },
  "@media (prefers-reduced-motion: reduce)": { transition: "none" },
};

export function BusinessDashboardPage() {
  const dashboard = useBusinessDashboard();
  const metrics = [
    { label: "Dự án đang tuyển", value: dashboard.published, icon: BriefcaseBusiness, color: "#16805b", background: "#e8f7ef" },
    { label: "Đang thực hiện", value: dashboard.ongoing, icon: Layers3, color: "#176c9a", background: "#eaf4fb" },
    { label: "Hồ sơ chờ duyệt", value: dashboard.fresh, icon: Users, color: "#bd3d14", background: "#fff0e9" },
    { label: "Bàn giao chờ duyệt", value: dashboard.submittedCount, icon: FileCheck2, color: "#80621d", background: "#fbf4e4" },
  ];

  return (
    <Box sx={theme => ({
      fontFamily: theme.typography.fontFamily,
      "&& h1, && h2, && h3": { fontFamily: theme.typography.h2.fontFamily, letterSpacing: "-0.015em" },
      "&& .MuiButton-root": { fontFamily: theme.typography.fontFamily, fontSize: 13, fontWeight: 600, textTransform: "none", letterSpacing: 0 },
      "&& a.MuiButton-contained": { color: "primary.contrastText" },
    })}>
      <header className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <Typography component="h1" sx={{ fontSize: { xs: 27, sm: 32 }, fontWeight: 800, lineHeight: 1.3 }}>Chào {dashboard.businessName}</Typography>
          <Typography sx={{ mt: 1, fontSize: 14, color: "text.secondary" }}>Mọi dự án và việc cần làm, trong một góc nhìn.</Typography>
        </div>
      </header>

      <Paper variant="outlined" component="section" aria-label="Số liệu tổng quan" sx={{ ...panelSx, mb: 3 }}>
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {metrics.map(({ label, value, icon: Icon, color, background }, index) => (
            <Box key={label} sx={{ p: { xs: 2, sm: 2.5 }, borderRight: { xs: index % 2 === 0 ? "1px solid" : "none", lg: index < 3 ? "1px solid" : "none" }, borderBottom: { xs: index < 2 ? "1px solid" : "none", lg: "none" }, borderColor: { xs: "divider", lg: "divider" } }}>
              <div className="flex items-start justify-between gap-2">
                <Typography sx={{ color: "text.secondary", fontSize: { xs: 12, sm: 13 }, mt: 0.5 }}>{label}</Typography>
                <Box sx={{ width: 32, height: 32, borderRadius: "10px", bgcolor: background, color, display: "grid", placeItems: "center", flexShrink: 0 }}><Icon size={17} aria-hidden="true" /></Box>
              </div>
              <Typography sx={{ mt: 0.5, fontSize: { xs: 30, sm: 36 }, fontWeight: 700, lineHeight: 1.2, fontVariantNumeric: "tabular-nums" }}>{value}</Typography>
            </Box>
          ))}
        </div>
      </Paper>

      <div className="grid min-w-0 items-start gap-6 xl:grid-cols-[minmax(0,1.8fr)_minmax(290px,1fr)]">
        <div className="grid min-w-0 gap-6">
          <Paper variant="outlined" component="section" aria-labelledby="dashboard-tasks-title" sx={panelSx}>
            <Box sx={{ px: { xs: 2.5, sm: 3 }, py: 2.5, bgcolor: "#fff6f1", borderBottom: "1px solid", borderColor: "#f5e5da" }}>
              <div className="flex flex-wrap items-center gap-2.5">
                <Typography id="dashboard-tasks-title" component="h2" sx={sectionTitleSx}>Cần bạn xử lý</Typography>
                <Chip label={dashboard.tasks.length} size="small" sx={{ height: 23, minWidth: 25, bgcolor: "#ffe6d8", color: "primary.dark", fontWeight: 700, fontSize: 12 }} />
              </div>
              <Typography sx={{ mt: 0.75, fontSize: 12, color: "text.secondary" }}>Ưu tiên hồ sơ ứng viên và bàn giao đang chờ bạn.</Typography>
            </Box>
            <div id="dashboard-task-list">
              {dashboard.visibleTasks.length ? dashboard.visibleTasks.map(task => {
                const appearance = taskAppearance[task.kind];
                const Icon = appearance.icon;
                return <Box key={task.id} sx={{ display: "flex", gap: 1.5, alignItems: "center", flexWrap: { xs: "wrap", sm: "nowrap" }, px: { xs: 2.5, sm: 3 }, py: 2.25, borderBottom: "1px solid", borderColor: "divider", "&:last-child": { borderBottom: 0 } }}>
                  <Box sx={{ width: 40, height: 40, borderRadius: "13px", bgcolor: appearance.background, color: appearance.color, display: "grid", placeItems: "center", flexShrink: 0 }}><Icon size={19} aria-hidden="true" /></Box>
                  <Box sx={{ minWidth: 0, flex: 1, flexBasis: { xs: "calc(100% - 52px)", sm: "auto" } }}>
                    <Typography sx={{ fontSize: 14, fontWeight: 600, lineHeight: 1.5 }}>{task.title}</Typography>
                    <Typography sx={{ mt: 0.5, fontSize: 12, color: "text.secondary", overflowWrap: "anywhere" }}>{task.detail}</Typography>
                  </Box>
                  <Button component={Link} to={task.href} endIcon={<ArrowRight size={14} />} sx={{ ml: { xs: "52px", sm: 0 }, flexShrink: 0, bgcolor: task.kind === "candidate" ? "#fff0e9" : "#f2f3f0", color: task.kind === "candidate" ? "primary.dark" : "text.primary", px: 1.75, minHeight: 38, "&:hover": { bgcolor: task.kind === "candidate" ? "#ffe3d4" : "#e9ece5" } }}>{task.action}</Button>
                </Box>;
              }) : <Box sx={{ p: 4, textAlign: "center" }}><CheckCheck size={28} color="#16805b" className="mx-auto mb-3" aria-hidden="true" /><Typography sx={{ fontSize: 14, fontWeight: 600 }}>Bạn đã xử lý hết việc đang chờ</Typography><Typography sx={{ mt: 1, color: "text.secondary", fontSize: 12 }}>Hồ sơ và bàn giao mới sẽ xuất hiện tại đây.</Typography></Box>}
            </div>
            {dashboard.tasks.length > 4 && <Box sx={{ px: 2, py: 1, borderTop: "1px solid", borderColor: "divider", textAlign: "center" }}><Button onClick={dashboard.toggleTasks} aria-expanded={dashboard.showAllTasks} aria-controls="dashboard-task-list" endIcon={<ChevronDown size={15} className={dashboard.showAllTasks ? "rotate-180" : ""} />} sx={quietButtonSx}>{dashboard.showAllTasks ? "Thu gọn" : `Xem thêm ${dashboard.tasks.length - 4} việc`}</Button></Box>}
          </Paper>

          <Paper variant="outlined" component="section" aria-labelledby="dashboard-projects-title" sx={panelSx}>
            <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-4 sm:px-6">
              <Typography id="dashboard-projects-title" component="h2" sx={sectionTitleSx}>Dự án đang tuyển <Box component="span" sx={{ ml: 0.5, color: "text.secondary", fontSize: 14, fontWeight: 500 }}>({dashboard.published})</Box></Typography>
              <Button component={Link} to="/business/projects" endIcon={<ArrowRight size={14} />} sx={quietButtonSx}>Tất cả dự án</Button>
            </div>
            {dashboard.projectSummaries.length ? dashboard.projectSummaries.map(({ project, candidateCount, pendingCount, invitationCount }) => <Box key={project.id} component="article" sx={{ px: { xs: 2.5, sm: 3 }, py: 2.5, borderTop: "1px solid", borderColor: "divider" }}>
              <div className="flex items-start gap-3.5">
                <Avatar variant="rounded" src={project.heroImage} alt="" sx={{ width: 52, height: 52, borderRadius: 2.5, bgcolor: "#f2f3f0", color: "text.secondary", flexShrink: 0 }}><BriefcaseBusiness size={22} aria-hidden="true" /></Avatar>
                <div className="min-w-0 flex-1">
                  <Typography sx={{ fontSize: 11, color: "text.secondary", mb: 0.5 }}>{project.category}</Typography>
                  <Typography component="h3" sx={{ fontSize: 15, fontWeight: 700, lineHeight: 1.5, "& a:hover": { color: "primary.dark" }, overflowWrap: "anywhere" }}><Link to={`/business/projects/${project.id}`}>{project.title}</Link></Typography>
                  <Typography sx={{ mt: 0.75, fontSize: 12, color: "text.secondary" }}>{project.budget} <Box component="span" sx={{ mx: 0.5 }} aria-hidden="true">·</Box> Hạn tuyển {project.applicationDeadline || "Chưa đặt"}</Typography>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <Typography sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 0.75, fontSize: 12, color: "text.secondary" }}><Users size={14} aria-hidden="true" />{candidateCount} ứng viên{pendingCount > 0 && <Box component="span" sx={{ color: "primary.dark", fontWeight: 600 }}>({pendingCount} chờ duyệt)</Box>}</Typography>
                  {invitationCount > 0 && <Button component={Link} to={`/business/projects/${project.id}/invitations`} startIcon={<Clock3 size={13} />} sx={{ p: 0, minHeight: 28, fontSize: "12px !important", color: "text.secondary" }}>{invitationCount} lời mời chờ phản hồi</Button>}
                </div>
                <Button component={Link} to={`/business/projects/${project.id}/applicants`} endIcon={<ArrowRight size={14} />} sx={{ minHeight: 34, color: "primary.dark", px: 1.5 }}>Xem ứng viên</Button>
              </div>
            </Box>) : <Box sx={{ px: 3, py: 4, textAlign: "center" }}><FolderOpen size={28} className="mx-auto mb-3 text-[#747773]" aria-hidden="true" /><Typography sx={{ fontSize: 14, fontWeight: 600 }}>Chưa có dự án đang tuyển</Typography><Typography sx={{ mt: 1, fontSize: 12, color: "text.secondary" }}>Đăng brief để bắt đầu tìm cộng sự phù hợp.</Typography><Button component={Link} to="/business/projects/new" startIcon={<Plus size={15} />} sx={{ mt: 1.5 }}>Tạo dự án mới</Button></Box>}
          </Paper>
        </div>

        <aside className="grid min-w-0 gap-6" aria-label="Trao đổi và lịch bàn giao">
          <Paper variant="outlined" component="section" aria-labelledby="dashboard-messages-title" sx={panelSx}>
            <div className="flex items-center justify-between gap-2 px-5 pb-2 pt-4">
              <Typography id="dashboard-messages-title" component="h2" sx={sectionTitleSx}>Tin nhắn gần đây</Typography>
              <Button component={Link} to="/business/messages" aria-label="Mở hộp tin nhắn" sx={{ ...quietButtonSx, minWidth: 36 }}><ArrowRight size={17} /></Button>
            </div>
            {dashboard.recentMessages.length ? dashboard.recentMessages.map(({ message, talent, project }) => <Box component={Link} key={`${project.id}:${talent.id}`} to={`/business/messages?view=project&scope=${project.id}&project=${project.id}&talent=${talent.id}`} sx={{ ...rowLinkSx, display: "flex", gap: 1.5, px: 2.5, py: 2, borderBottom: "1px solid", borderColor: "divider", "&:last-child": { borderBottom: 0 } }}>
              <Avatar src={talent.avatar} alt="" sx={{ width: 38, height: 38, bgcolor: talent.color, color: "text.primary", fontSize: 12, fontWeight: 700 }}>{talent.initials}</Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2"><Typography noWrap sx={{ fontSize: 13, fontWeight: 600 }}>{talent.name}</Typography><Typography component="time" dateTime={message.sentAt} sx={{ fontSize: 10, color: "text.secondary", flexShrink: 0 }}>{new Date(message.sentAt).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })}</Typography></div>
                <Typography noWrap sx={{ fontSize: 12, color: "text.secondary", mt: 0.5 }}>{message.sender === "business" ? "Bạn: " : ""}{message.body}</Typography>
                <Typography noWrap sx={{ fontSize: 10, color: "text.secondary", mt: 0.75 }}>{project.title}</Typography>
              </div>
            </Box>) : <Typography sx={{ px: 2.5, pb: 3, pt: 1, fontSize: 13, color: "text.secondary" }}>Tin nhắn từ cộng sự sẽ xuất hiện tại đây.</Typography>}
          </Paper>

          <Paper variant="outlined" component="section" aria-labelledby="dashboard-milestones-title" sx={panelSx}>
            <div className="flex items-center justify-between gap-2 px-5 pb-4 pt-5"><Typography id="dashboard-milestones-title" component="h2" sx={sectionTitleSx}>Lịch bàn giao</Typography><CalendarDays size={17} color="#747773" aria-hidden="true" /></div>
            <Chip label="Tiến độ mô phỏng" size="small" sx={{ mx: 2.5, mb: 1, height: 22, fontSize: 10, bgcolor: "#f2f3f0", color: "text.secondary" }} />
            {dashboard.upcomingMilestones.length ? dashboard.upcomingMilestones.map(({ project, milestone }) => {
              const [day, month] = milestone.deadline.split("/");
              return <Box component={Link} key={`${project.id}:${milestone.id}`} to={`/business/projects/${project.id}/progress`} sx={{ ...rowLinkSx, display: "flex", alignItems: "flex-start", gap: 1.5, px: 2.5, py: 2, borderBottom: "1px solid", borderColor: "divider", "&:last-child": { borderBottom: 0 } }}>
                <Box sx={{ width: 46, flexShrink: 0, bgcolor: "#f7f8f6", border: "1px solid", borderColor: "divider", borderRadius: "12px", py: 0.75, textAlign: "center" }}><Typography sx={{ fontSize: 9, color: "text.secondary" }}>{month ? `Tháng ${month}` : "Chưa đặt"}</Typography><Typography sx={{ fontSize: 20, fontWeight: 700, lineHeight: 1.4 }}>{day || "—"}</Typography></Box>
                <div className="min-w-0"><Typography sx={{ fontSize: 13, fontWeight: 600, lineHeight: 1.5 }}>{milestone.name}</Typography><Typography sx={{ mt: 0.5, fontSize: 11, color: "text.secondary", overflowWrap: "anywhere" }}>{project.title}</Typography><Typography sx={{ mt: 0.75, fontSize: 10, fontWeight: 600, color: milestone.status === "submitted" ? "primary.dark" : "#176c9a" }}>{milestone.status === "submitted" ? "Chờ duyệt bàn giao" : milestone.status === "in_progress" ? "Đang thực hiện" : "Chưa bắt đầu"}</Typography></div>
              </Box>;
            }) : <Typography sx={{ px: 2.5, pt: 1, pb: 3, fontSize: 13, color: "text.secondary" }}>Chưa có mốc bàn giao đang chờ.</Typography>}
          </Paper>

          {dashboard.pendingAgreements.length > 0 && <Paper variant="outlined" component="section" aria-labelledby="dashboard-agreements-title" sx={panelSx}>
            <Typography id="dashboard-agreements-title" component="h2" sx={{ ...sectionTitleSx, px: 2.5, pt: 2.5, pb: 1 }}>Chờ xác nhận thỏa thuận</Typography>
            {dashboard.pendingAgreements.map(({ agreement, project }) => <Box component={Link} key={agreement.id || `${agreement.projectId}:${agreement.talentId}:${agreement.version}`} to={`/business/projects/${agreement.projectId}/agreement?talent=${agreement.talentId}`} sx={{ ...rowLinkSx, display: "flex", alignItems: "center", gap: 1.5, p: 2.5 }}><Clock3 size={18} className="shrink-0 text-[#747773]" aria-hidden="true" /><Typography sx={{ flex: 1, minWidth: 0, fontSize: 13 }}>{project.title}</Typography><ArrowRight size={15} className="shrink-0" aria-hidden="true" /></Box>)}
          </Paper>}
        </aside>
      </div>
    </Box>
  );
}
