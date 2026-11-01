import { ThemeProvider } from "@mui/material/styles";
import { freelancerTheme } from "@/app/theme/freelancerTheme";
import { Link } from "react-router";
import { Avatar, Box, Button, Chip, Paper, Typography } from "@mui/material";
import { ArrowRight, ArrowUpRight, BriefcaseBusiness, CalendarDays, CheckCheck, ChevronDown, Clock3, FileCheck2, FolderOpen, Layers3, MessageCircle, Plus, Users } from "lucide-react";
import { useBusinessDashboard } from "../hooks/useBusinessDashboard";

const taskIcons = { candidate: Users, milestone: FileCheck2, message: MessageCircle };
const surfaceSx = { border: "2px solid", borderColor: "text.secondary", borderRadius: "13px", bgcolor: "background.paper", boxShadow: "none", overflow: "hidden" } as const;
const sectionTitleSx = { fontSize: { xs: 19, sm: 21 }, fontWeight: 900, lineHeight: 1.3 };
const textLinkSx = { "&&": { color: "primary.dark" }, color: "primary.dark", border: "1px solid", borderColor: "primary.dark", borderRadius: 999, fontSize: 14, minHeight: 44, px: 2.25, flexShrink: 0, "&:hover": { "&&": { color: "primary.contrastText" }, color: "primary.contrastText", bgcolor: "primary.dark" } };
const interactiveSx = { color: "text.primary", "&:hover": { bgcolor: "#fff0e9" }, "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: -3 } };

export function BusinessDashboardPage() {
  const dashboard = useBusinessDashboard();
  const metrics = [
    { label: "Dự án đang tuyển", value: dashboard.published, icon: BriefcaseBusiness, href: "/business/projects", action: "Xem danh sách dự án", attention: false },
    { label: "Đang thực hiện", value: dashboard.ongoing, icon: Layers3, href: "/business/ongoing", action: "Theo dõi tiến độ", attention: false },
    { label: "Hồ sơ chờ duyệt", value: dashboard.fresh, icon: Users, href: "#dashboard-tasks-title", action: "Xem việc cần xử lý", attention: dashboard.fresh > 0 },
    { label: "Bàn giao chờ duyệt", value: dashboard.submittedCount, icon: FileCheck2, href: "#dashboard-tasks-title", action: "Xem việc cần xử lý", attention: dashboard.submittedCount > 0 },
  ];

  return <ThemeProvider theme={freelancerTheme}><Box sx={theme => ({
    minWidth: 0, fontFamily: theme.typography.fontFamily,
    "&& h1, && h2, && h3": { fontFamily: theme.typography.h2.fontFamily, letterSpacing: "-0.035em" },
    "&& .MuiButton-root": { fontFamily: theme.typography.fontFamily, fontSize: 14, fontWeight: 700, textTransform: "none", letterSpacing: 0 },
    "&& a.MuiButton-contained": { color: "primary.contrastText" },
  })}>
    <Box component="header" sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 2.5, mb: 3.5 }}>
      <Box>
        <Typography component="h1" sx={{ fontSize: { xs: 30, sm: 36 }, fontWeight: 900, lineHeight: 1.1 }}>Chào {dashboard.businessName}<Box component="span" sx={{ color: "primary.main" }}>.</Box></Typography>
        <Typography sx={{ mt: 1, fontSize: 16, color: "text.secondary", lineHeight: 1.6 }}>Theo dõi dự án và kết nối với cộng sự sáng tạo của bạn.</Typography>
      </Box>
      <Button component={Link} to="/business/projects/new" variant="contained" startIcon={<Plus size={18} />} sx={{ minHeight: 46, px: 3, bgcolor: "primary.dark", boxShadow: "none" }}>Đăng dự án</Button>
    </Box>

    <Box component="section" aria-label="Số liệu tổng quan" sx={{ ...surfaceSx, display: "grid", gridTemplateColumns: { xs: "repeat(2,minmax(0,1fr))", md: "repeat(4,minmax(0,1fr))" }, mb: 4 }}>
      {metrics.map(({ label, value, icon: Icon, href, action, attention }, index) => <Box component={Link} key={label} to={href} onClick={href.startsWith("#") ? () => document.getElementById(href.slice(1))?.focus() : undefined} aria-label={`${label}: ${value}. ${action}`} sx={{ ...interactiveSx, p: { xs: 2, sm: 2.5 }, minWidth: 0, borderRight: { xs: index % 2 === 0 ? "1px solid" : 0, md: index < 3 ? "1px solid" : 0 }, borderBottom: { xs: index < 2 ? "1px solid" : 0, md: 0 }, borderColor: { xs: "divider", md: "divider" }, display: "flex", flexDirection: "column", gap: 1.25 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, minHeight: { xs: 42, md: 21 }, color: "text.secondary" }}><Icon size={17} className="shrink-0" aria-hidden="true" /><Typography sx={{ fontSize: 14, lineHeight: 1.5 }}>{label}</Typography></Box>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}><Typography sx={{ fontSize: 32, fontWeight: 800, fontFamily: "Archivo, Arial, sans-serif", lineHeight: 1.2, color: attention ? "primary.dark" : "text.primary", fontVariantNumeric: "tabular-nums" }}>{value}</Typography><ArrowUpRight size={18} color={attention ? "#bd3d14" : "#667085"} aria-hidden="true" /></Box>
      </Box>)}
    </Box>

    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0,1fr)", lg: "minmax(0,1.75fr) minmax(290px,1fr)" }, gap: { xs: 4, lg: 3.5 }, alignItems: "start" }}>
      <Box sx={{ display: "grid", gap: 4, minWidth: 0 }}>
        <Box component="section" aria-labelledby="dashboard-tasks-title" sx={{ ...surfaceSx, borderColor: "text.primary" }}>
          <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1.25, p: 2.5, bgcolor: "#fff0e9", borderBottom: "2px solid", borderColor: "text.primary" }}>
            <Typography id="dashboard-tasks-title" component="h2" tabIndex={-1} sx={{ ...sectionTitleSx, scrollMarginTop: "100px" }}>Cần bạn xử lý</Typography>
            <Chip label={dashboard.tasks.length} size="small" sx={{ height: 25, bgcolor: dashboard.tasks.length ? "#fff0e9" : "background.paper", color: dashboard.tasks.length ? "primary.dark" : "text.secondary", fontSize: 13, fontWeight: 700 }} />
          </Box>
          <Paper elevation={0} sx={{ border: 0, borderRadius: 0, boxShadow: "none" }}>
            <Box id="dashboard-task-list">
              {dashboard.visibleTasks.length ? dashboard.visibleTasks.map(task => {
                const Icon = taskIcons[task.kind];
                return <Box key={task.id} sx={{ display: "flex", flexWrap: { xs: "wrap", sm: "nowrap" }, alignItems: "center", gap: 1.5, p: { xs: 2.25, sm: 2.5 }, borderBottom: "1px solid", borderColor: "divider", "&:last-child": { borderBottom: 0 } }}>
                  <Box sx={{ display: "grid", placeItems: "center", width: 40, height: 40, flexShrink: 0, borderRadius: "50%", border: "1px solid #20201f", bgcolor: "#fff0e9", color: "text.primary" }}><Icon size={19} aria-hidden="true" /></Box>
                  <Box sx={{ flex: 1, minWidth: 0, flexBasis: { xs: "calc(100% - 54px)", sm: "auto" } }}><Typography sx={{ fontSize: 16, fontWeight: 700, lineHeight: 1.5 }}>{task.title}</Typography><Typography sx={{ mt: 0.5, fontSize: 14, color: "text.secondary", lineHeight: 1.6, overflowWrap: "anywhere" }}>{task.detail}</Typography></Box>
                  <Button component={Link} to={task.href} endIcon={<ArrowUpRight size={16} />} sx={{ ...textLinkSx, ml: { xs: "52px", sm: 0 } }}>{task.action}</Button>
                </Box>;
              }) : <Box sx={{ p: 4, textAlign: "center" }}><CheckCheck size={28} className="mx-auto mb-3 text-[#667085]" aria-hidden="true" /><Typography sx={{ fontSize: 16, fontWeight: 600 }}>Bạn đã xử lý hết việc đang chờ</Typography><Typography sx={{ mt: 1, color: "text.secondary", fontSize: 14 }}>Hồ sơ và bàn giao mới sẽ xuất hiện tại đây.</Typography></Box>}
            </Box>
            {dashboard.tasks.length > 4 && <Box sx={{ borderTop: "1px solid", borderColor: "divider", textAlign: "center", py: 1 }}><Button onClick={dashboard.toggleTasks} aria-expanded={dashboard.showAllTasks} aria-controls="dashboard-task-list" endIcon={<ChevronDown size={16} className={dashboard.showAllTasks ? "rotate-180" : ""} />} sx={textLinkSx}>{dashboard.showAllTasks ? "Thu gọn" : `Xem thêm ${dashboard.tasks.length - 4} việc`}</Button></Box>}
          </Paper>
        </Box>

        <Box component="section" aria-labelledby="dashboard-projects-title">
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1, mb: 1.5 }}><Typography id="dashboard-projects-title" component="h2" sx={sectionTitleSx}>Dự án đang tuyển <Box component="span" sx={{ color: "text.secondary", fontWeight: 500, fontSize: 16 }}>({dashboard.published})</Box></Typography><Button component={Link} to="/business/projects" endIcon={<ArrowRight size={15} />} sx={textLinkSx}>Tất cả dự án</Button></Box>
          <Box sx={{ display: "grid", gap: 2 }}>
            {dashboard.projectSummaries.length ? dashboard.projectSummaries.map(({ project, candidateCount, pendingCount, invitationCount }) => <Paper component="article" key={project.id} elevation={0} sx={{ ...surfaceSx, p: { xs: 2.25, sm: 3 }, "&:focus-within": { borderColor: "text.primary" } }}>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                <Avatar variant="rounded" src={project.heroImage} alt="" sx={{ width: { xs: 64, sm: 88 }, height: { xs: 64, sm: 88 }, borderRadius: "12px", bgcolor: "#f7f8f6", color: "text.secondary", flexShrink: 0, "& img": { objectFit: "contain", p: 0.5 } }}><BriefcaseBusiness size={25} aria-hidden="true" /></Avatar>
                <Box sx={{ minWidth: 0, flex: 1 }}><Typography sx={{ fontSize: 13, color: "text.secondary", mb: 0.75 }}>{project.category}</Typography><Typography component="h3" sx={{ fontSize: { xs: 17, sm: 19 }, fontWeight: 900, lineHeight: 1.3, overflowWrap: "anywhere", "& a:hover": { color: "primary.dark" } }}><Link to={`/business/projects/${project.id}`}>{project.title}</Link></Typography><Typography sx={{ mt: 1, fontSize: 16, fontWeight: 700, color: "primary.dark" }}>{project.budget || "Chưa đặt ngân sách"}</Typography></Box>
              </Box>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2.5, pb: 2, borderBottom: "1px solid", borderColor: "divider", color: "text.secondary" }}><Typography sx={{ display: "flex", alignItems: "center", gap: 0.75, fontSize: 14 }}><Users size={16} aria-hidden="true" />{candidateCount} ứng viên{pendingCount > 0 && <Box component="span" sx={{ color: "primary.dark", fontWeight: 600 }}>({pendingCount} chờ duyệt)</Box>}</Typography><Typography sx={{ display: "flex", alignItems: "center", gap: 0.75, fontSize: 14 }}><CalendarDays size={16} aria-hidden="true" />Hạn tuyển {project.applicationDeadline || "Chưa đặt"}</Typography></Box>
              <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 1, pt: 1.5 }}>
                {invitationCount > 0 ? <Button component={Link} to={`/business/projects/${project.id}/invitations`} startIcon={<Clock3 size={14} />} sx={{ ...textLinkSx, color: "text.secondary", fontSize: 13 }}>{invitationCount} lời mời chờ phản hồi</Button> : <Button component={Link} to={`/business/projects/${project.id}/brief`} sx={{ ...textLinkSx, color: "text.secondary" }}>Xem brief</Button>}
                <Button component={Link} to={`/business/projects/${project.id}/applicants`} endIcon={<ArrowUpRight size={16} />} sx={{ ...textLinkSx, color: "primary.dark" }}>Xem ứng viên</Button>
              </Box>
            </Paper>) : <Paper elevation={0} sx={{ ...surfaceSx, p: 4, textAlign: "center" }}><FolderOpen size={28} className="mx-auto mb-3 text-[#667085]" aria-hidden="true" /><Typography sx={{ fontSize: 16, fontWeight: 600 }}>Chưa có dự án đang tuyển</Typography><Typography sx={{ mt: 1, fontSize: 14, color: "text.secondary" }}>Đăng brief để bắt đầu tìm cộng sự phù hợp.</Typography><Button component={Link} to="/business/projects/new" startIcon={<Plus size={16} />} sx={{ mt: 1.5 }}>Tạo dự án mới</Button></Paper>}
          </Box>
        </Box>
      </Box>

      <Box component="aside" aria-label="Trao đổi và lịch bàn giao" sx={{ display: "grid", gap: 3, minWidth: 0 }}>
        <Paper component="section" aria-labelledby="dashboard-messages-title" elevation={0} sx={surfaceSx}>
          <Box sx={{ px: 2.5, py: 2.5, bgcolor: "#fff0e9", borderBottom: "2px solid", borderColor: "text.primary", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}><Typography id="dashboard-messages-title" component="h2" sx={{ ...sectionTitleSx, fontSize: 18 }}>Tin nhắn gần đây</Typography><Button component={Link} to="/business/messages" aria-label="Mở hộp tin nhắn" sx={{ ...textLinkSx, minWidth: 44, p: 0 }}><ArrowUpRight size={19} /></Button></Box>
          {dashboard.recentMessages.length ? dashboard.recentMessages.map(({ message, talent, project }) => <Box component={Link} key={`${project.id}:${talent.id}`} to={`/business/messages?view=project&scope=${project.id}&project=${project.id}&talent=${talent.id}`} sx={{ ...interactiveSx, display: "flex", gap: 1.5, px: 2.5, py: 2, borderBottom: "1px solid", borderColor: "divider", "&:last-child": { borderBottom: 0 } }}>
            <Avatar src={talent.avatar} alt="" sx={{ width: 40, height: 40, bgcolor: talent.color, color: "text.primary", fontSize: 14, fontWeight: 700 }}>{talent.initials}</Avatar>
            <Box sx={{ minWidth: 0, flex: 1 }}><Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}><Typography noWrap sx={{ fontSize: 15, fontWeight: 700 }}>{talent.name}</Typography><Typography component="time" dateTime={message.sentAt} sx={{ fontSize: 13, color: "text.secondary", flexShrink: 0 }}>{new Date(message.sentAt).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })}</Typography></Box><Typography noWrap sx={{ fontSize: 14, mt: 0.5, color: "text.secondary" }}>{message.sender === "business" ? "Bạn: " : ""}{message.body}</Typography><Typography noWrap sx={{ fontSize: 13, mt: 0.75, color: "text.secondary" }}>{project.title}</Typography></Box>
          </Box>) : <Typography sx={{ px: 2.5, pb: 3, pt: 1, fontSize: 14, color: "text.secondary" }}>Tin nhắn từ cộng sự sẽ xuất hiện tại đây.</Typography>}
        </Paper>

        <Paper component="section" aria-labelledby="dashboard-milestones-title" elevation={0} sx={surfaceSx}>
          <Box sx={{ px: 2.5, py: 2.5, bgcolor: "#fff0e9", borderBottom: "2px solid", borderColor: "text.primary", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}><Typography id="dashboard-milestones-title" component="h2" sx={{ ...sectionTitleSx, fontSize: 18 }}>Lịch bàn giao</Typography><CalendarDays size={19} color="#667085" aria-hidden="true" /></Box>
          <Typography sx={{ px: 2.5, pt: 1.5, pb: 0.5, fontSize: 13, color: "text.secondary" }}>Tiến độ mô phỏng</Typography>
          {dashboard.upcomingMilestones.length ? dashboard.upcomingMilestones.map(({ project, milestone }) => {
            const [day, month] = milestone.deadline.split("/");
            return <Box component={Link} key={`${project.id}:${milestone.id}`} to={`/business/projects/${project.id}/progress`} sx={{ ...interactiveSx, display: "flex", alignItems: "flex-start", gap: 1.5, px: 2.5, py: 2, borderBottom: "1px solid", borderColor: "divider", "&:last-child": { borderBottom: 0 } }}>
              <Box sx={{ width: 60, flexShrink: 0, border: "1px solid", borderColor: "divider", borderRadius: "10px", textAlign: "center", overflow: "hidden" }}><Typography sx={{ py: 0.5, fontSize: 11, bgcolor: "#fff0e9", color: "primary.dark", fontWeight: 600 }}>{month ? `Tháng ${month}` : "Chưa đặt"}</Typography><Typography sx={{ py: 0.5, fontSize: 23, fontWeight: 700 }}>{day || "—"}</Typography></Box>
              <Box sx={{ minWidth: 0 }}><Typography sx={{ fontSize: 15, fontWeight: 700, lineHeight: 1.5 }}>{milestone.name}</Typography><Typography sx={{ mt: 0.5, fontSize: 13, color: "text.secondary", overflowWrap: "anywhere" }}>{project.title}</Typography><Typography sx={{ mt: 0.75, fontSize: 13, fontWeight: 600, color: milestone.status === "submitted" ? "primary.dark" : "text.secondary" }}>{milestone.status === "submitted" ? "Chờ duyệt bàn giao" : milestone.status === "in_progress" ? "Đang thực hiện" : "Chưa bắt đầu"}</Typography></Box>
            </Box>;
          }) : <Typography sx={{ px: 2.5, pt: 1, pb: 3, fontSize: 14, color: "text.secondary" }}>Chưa có mốc bàn giao đang chờ.</Typography>}
        </Paper>

        {dashboard.pendingAgreements.length > 0 && <Paper component="section" aria-labelledby="dashboard-agreements-title" elevation={0} sx={surfaceSx}><Typography id="dashboard-agreements-title" component="h2" sx={{ ...sectionTitleSx, fontSize: 18, px: 2.5, py: 2.5, bgcolor: "#fff0e9", borderBottom: "2px solid", borderColor: "text.primary" }}>Chờ xác nhận thỏa thuận</Typography>{dashboard.pendingAgreements.map(({ agreement, project }) => <Box component={Link} key={agreement.id || `${agreement.projectId}:${agreement.talentId}:${agreement.version}`} to={`/business/projects/${agreement.projectId}/agreement?talent=${agreement.talentId}`} sx={{ ...interactiveSx, display: "flex", alignItems: "center", gap: 1.5, p: 2.5 }}><Clock3 size={18} className="shrink-0 text-[#667085]" aria-hidden="true" /><Typography sx={{ flex: 1, minWidth: 0, fontSize: 14 }}>{project.title}</Typography><ArrowUpRight size={16} className="shrink-0" aria-hidden="true" /></Box>)}</Paper>}
      </Box>
    </Box>
  </Box></ThemeProvider>;
}
