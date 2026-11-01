import { Link } from "react-router";
import { Avatar, Box, Button, Chip, Paper, Typography } from "@mui/material";
import {
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCheck,
  ChevronDown,
  Clock3,
  FileCheck2,
  FileText,
  FolderOpen,
  Layers3,
  MessageCircle,
  Plus,
  Users,
} from "lucide-react";
import { useBusinessDashboard } from "../hooks/useBusinessDashboard";

const taskIcons = { candidate: Users, milestone: FileCheck2, message: MessageCircle };

export function BusinessDashboardPage() {
  const dashboard = useBusinessDashboard();
  const metrics = [
    { label: "Dự án đang tuyển", value: dashboard.published, icon: BriefcaseBusiness, href: "/business/projects", action: "Xem danh sách dự án", attention: false },
    { label: "Đang thực hiện", value: dashboard.ongoing, icon: Layers3, href: "/business/ongoing", action: "Theo dõi tiến độ", attention: false },
    { label: "Hồ sơ chờ duyệt", value: dashboard.fresh, icon: Users, href: "#dashboard-tasks-title", action: "Xem việc cần xử lý", attention: dashboard.fresh > 0 },
    { label: "Bàn giao chờ duyệt", value: dashboard.submittedCount, icon: FileCheck2, href: "#dashboard-tasks-title", action: "Xem việc cần xử lý", attention: dashboard.submittedCount > 0 },
  ];

  return (
    <Box
      sx={(theme) => ({
        minWidth: 0,
        fontFamily: theme.typography.fontFamily,
        "&& h1, && h2, && h3": {
          fontFamily: theme.typography.h2.fontFamily,
          letterSpacing: "-0.02em",
        },
        "&& .MuiButton-root": {
          fontFamily: theme.typography.fontFamily,
          textTransform: "none",
          letterSpacing: 0,
        },
        "&& .MuiButton-contained, && a.MuiButton-contained": {
          color: "#ffffff !important",
          "& *": {
            color: "#ffffff !important",
          },
        },
      })}
    >
      {/* Header */}
      <Box
        component="header"
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2.5,
          mb: 3.5,
        }}
      >
        <Box>
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: 28, sm: 34 },
              fontWeight: 800,
              lineHeight: 1.2,
              color: "text.primary",
            }}
          >
            Chào {dashboard.businessName}
            <Box component="span" sx={{ color: "primary.main" }}>
              .
            </Box>
          </Typography>
          <Typography sx={{ mt: 0.75, fontSize: 15, color: "text.secondary", lineHeight: 1.6 }}>
            Theo dõi dự án và kết nối với cộng sự sáng tạo của bạn.
          </Typography>
        </Box>
        <Button
          component={Link}
          to="/business/projects/new"
          variant="contained"
          startIcon={<Plus size={17} />}
          sx={{
            minHeight: 44,
            px: 3,
            borderRadius: "999px",
            bgcolor: "primary.dark",
            color: "#ffffff !important",
            fontSize: 14,
            fontWeight: 700,
            boxShadow: "0 1px 3px rgba(189, 61, 20, 0.25)",
            transition: "all 0.2s ease",
            "&:hover": {
              bgcolor: "primary.main",
              boxShadow: "0 4px 12px rgba(189, 61, 20, 0.35)",
              transform: "translateY(-1px)",
            },
            "@media (prefers-reduced-motion: reduce)": { transition: "none", transform: "none" },
          }}
        >
          Đăng dự án
        </Button>
      </Box>

      {/* Overview Stat Cards */}
      <Box
        component="section"
        aria-label="Số liệu tổng quan"
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", md: "repeat(4, minmax(0, 1fr))" },
          gap: { xs: 2, sm: 2.5 },
          mb: 4,
        }}
      >
        {metrics.map(({ label, value, icon: Icon, href, action, attention }) => (
          <Paper
            component={Link}
            key={label}
            to={href}
            onClick={href.startsWith("#") ? () => document.getElementById(href.slice(1))?.focus() : undefined}
            elevation={0}
            aria-label={`${label}: ${value}. ${action}`}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              p: { xs: 2.25, sm: 2.5 },
              minHeight: 124,
              borderRadius: "16px",
              border: "1px solid",
              borderColor: attention ? "#ffd4c3" : "divider",
              bgcolor: "background.paper",
              boxShadow: "0 1px 3px rgba(16, 24, 40, 0.05), 0 1px 2px rgba(16, 24, 40, 0.03)",
              textDecoration: "none",
              color: "inherit",
              transition: "border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease",
              "&:hover": {
                borderColor: attention ? "primary.main" : "#b0b8c4",
                boxShadow: "0 8px 24px -4px rgba(16, 24, 40, 0.08), 0 3px 8px -2px rgba(16, 24, 40, 0.04)",
                transform: "translateY(-2px)",
                "& .metric-arrow": {
                  color: "primary.dark",
                  transform: "translate(2px, -2px)",
                },
              },
              "@media (prefers-reduced-motion: reduce)": { transition: "none", transform: "none" },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
              <Box
                sx={{
                  display: "grid",
                  placeItems: "center",
                  width: 38,
                  height: 38,
                  borderRadius: "10px",
                  bgcolor: attention ? "#fff0e9" : "#f0f2f5",
                  color: attention ? "primary.dark" : "#475467",
                  transition: "background-color 0.2s ease",
                }}
              >
                <Icon size={19} aria-hidden="true" />
              </Box>
              <Box
                className="metric-arrow"
                sx={{
                  display: "grid",
                  placeItems: "center",
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  color: attention ? "primary.dark" : "#98a2b3",
                  transition: "all 0.2s ease",
                }}
              >
                <ArrowUpRight size={17} aria-hidden="true" />
              </Box>
            </Box>

            <Box sx={{ mt: 1.5 }}>
              <Typography
                sx={{
                  fontSize: { xs: 28, sm: 32 },
                  fontWeight: 800,
                  fontFamily: "Archivo, Arial, sans-serif",
                  lineHeight: 1.1,
                  color: attention ? "primary.dark" : "text.primary",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {value}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: "text.secondary", lineHeight: 1.4 }}>
                  {label}
                </Typography>
                {attention && (
                  <Box
                    component="span"
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      bgcolor: "primary.main",
                      flexShrink: 0,
                    }}
                  />
                )}
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>

      {/* Main Grid: Left Column (Tasks & Projects) + Right Column (Aside) */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "minmax(0, 1fr)", lg: "minmax(0, 1.75fr) minmax(290px, 1fr)" },
          gap: { xs: 4, lg: 3.5 },
          alignItems: "start",
        }}
      >
        {/* Left Column */}
        <Box sx={{ display: "grid", gap: 4, minWidth: 0 }}>
          {/* Section: Cần bạn xử lý */}
          <Paper
            component="section"
            aria-labelledby="dashboard-tasks-title"
            elevation={0}
            sx={{
              borderRadius: "16px",
              border: "1px solid",
              borderColor: dashboard.tasks.length > 0 ? "#ffd4c3" : "divider",
              bgcolor: "background.paper",
              boxShadow: "0 1px 3px rgba(16, 24, 40, 0.06), 0 1px 2px rgba(16, 24, 40, 0.04)",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1.5,
                px: { xs: 2.25, sm: 3 },
                py: 2,
                bgcolor: dashboard.tasks.length > 0 ? "#fffaf7" : "background.paper",
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                <Typography
                  id="dashboard-tasks-title"
                  component="h2"
                  tabIndex={-1}
                  sx={{
                    fontSize: { xs: 17, sm: 19 },
                    fontWeight: 800,
                    fontFamily: "Archivo, Arial, sans-serif",
                    lineHeight: 1.3,
                    scrollMarginTop: "100px",
                  }}
                >
                  Cần bạn xử lý
                </Typography>
                <Chip
                  label={dashboard.tasks.length}
                  size="small"
                  sx={{
                    height: 24,
                    px: 0.5,
                    bgcolor: dashboard.tasks.length > 0 ? "#fff0e9" : "#e8f7ef",
                    color: dashboard.tasks.length > 0 ? "primary.dark" : "#16805b",
                    border: "1px solid",
                    borderColor: dashboard.tasks.length > 0 ? "#fcd5c5" : "#c8ecd7",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                />
              </Box>
              {dashboard.tasks.length > 0 && (
                <Typography sx={{ fontSize: 12, color: "text.secondary", fontWeight: 500, display: { xs: "none", sm: "block" } }}>
                  Ưu tiên xử lý để tiến độ không gián đoạn
                </Typography>
              )}
            </Box>

            <Box id="dashboard-task-list">
              {dashboard.visibleTasks.length ? (
                dashboard.visibleTasks.map((task) => {
                  const Icon = taskIcons[task.kind];
                  return (
                    <Box
                      key={task.id}
                      sx={{
                        display: "flex",
                        flexWrap: { xs: "wrap", sm: "nowrap" },
                        alignItems: "center",
                        gap: 2,
                        p: { xs: 2, sm: 2.5 },
                        borderBottom: "1px solid",
                        borderColor: "divider",
                        transition: "background-color 0.15s ease",
                        "&:hover": { bgcolor: "#fcfdfc" },
                        "&:last-child": { borderBottom: 0 },
                      }}
                    >
                      <Box
                        sx={{
                          display: "grid",
                          placeItems: "center",
                          width: 42,
                          height: 42,
                          flexShrink: 0,
                          borderRadius: "12px",
                          border: "1px solid",
                          bgcolor: task.kind === "candidate" ? "#fff0e9" : task.kind === "milestone" ? "#eaf4fb" : "#e8f7ef",
                          borderColor: task.kind === "candidate" ? "#fcd5c5" : task.kind === "milestone" ? "#c9e3f5" : "#c8ecd7",
                          color: task.kind === "candidate" ? "primary.dark" : task.kind === "milestone" ? "#176c9a" : "#16805b",
                        }}
                      >
                        <Icon size={20} aria-hidden="true" />
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0, flexBasis: { xs: "calc(100% - 60px)", sm: "auto" } }}>
                        <Typography sx={{ fontSize: 15, fontWeight: 700, lineHeight: 1.4, color: "text.primary" }}>
                          {task.title}
                        </Typography>
                        <Typography sx={{ mt: 0.25, fontSize: 13, color: "text.secondary", lineHeight: 1.5, overflowWrap: "anywhere" }}>
                          {task.detail}
                        </Typography>
                      </Box>
                      <Button
                        component={Link}
                        to={task.href}
                        endIcon={<ArrowUpRight size={15} />}
                        sx={{
                          borderRadius: "999px",
                          minHeight: 38,
                          px: 2.25,
                          fontSize: 13,
                          fontWeight: 700,
                          whiteSpace: "nowrap",
                          bgcolor: "#fff0e9",
                          color: "primary.dark",
                          border: "1px solid #fcd5c5",
                          ml: { xs: "58px", sm: 0 },
                          transition: "all 0.15s ease",
                          "&:hover": {
                            bgcolor: "primary.dark",
                            borderColor: "primary.dark",
                            color: "#ffffff !important",
                            "& *": { color: "#ffffff !important" },
                            boxShadow: "0 2px 6px rgba(189, 61, 20, 0.25)",
                          },
                        }}
                      >
                        {task.action}
                      </Button>
                    </Box>
                  );
                })
              ) : (
                <Box sx={{ p: { xs: 4, sm: 5 }, textAlign: "center" }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      mx: "auto",
                      mb: 2,
                      display: "grid",
                      placeItems: "center",
                      borderRadius: "50%",
                      bgcolor: "#e8f7ef",
                      color: "#16805b",
                    }}
                  >
                    <CheckCheck size={24} aria-hidden="true" />
                  </Box>
                  <Typography sx={{ fontSize: 16, fontWeight: 700, color: "text.primary" }}>
                    Bạn đã xử lý hết việc đang chờ
                  </Typography>
                  <Typography sx={{ mt: 0.75, color: "text.secondary", fontSize: 14 }}>
                    Hồ sơ ứng tuyển và bàn giao mới sẽ tự động hiển thị tại đây.
                  </Typography>
                </Box>
              )}
            </Box>

            {dashboard.tasks.length > 4 && (
              <Box sx={{ borderTop: "1px solid", borderColor: "divider", textAlign: "center", py: 1.25, bgcolor: "#fafafa" }}>
                <Button
                  onClick={dashboard.toggleTasks}
                  aria-expanded={dashboard.showAllTasks}
                  aria-controls="dashboard-task-list"
                  endIcon={<ChevronDown size={16} className={dashboard.showAllTasks ? "rotate-180" : ""} />}
                  sx={{
                    borderRadius: "999px",
                    minHeight: 36,
                    px: 2.5,
                    fontSize: 13,
                    fontWeight: 600,
                    color: "text.secondary",
                    "&:hover": { bgcolor: "#f0f2f5", color: "text.primary" },
                  }}
                >
                  {dashboard.showAllTasks ? "Thu gọn" : `Xem thêm ${dashboard.tasks.length - 4} việc`}
                </Button>
              </Box>
            )}
          </Paper>

          {/* Section: Dự án đang tuyển */}
          <Box component="section" aria-labelledby="dashboard-projects-title">
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 1.5, mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                <Typography
                  id="dashboard-projects-title"
                  component="h2"
                  sx={{ fontSize: { xs: 18, sm: 20 }, fontWeight: 800, fontFamily: "Archivo, Arial, sans-serif" }}
                >
                  Dự án đang tuyển
                </Typography>
                <Chip
                  label={dashboard.published}
                  size="small"
                  sx={{
                    height: 24,
                    px: 0.5,
                    bgcolor: "#f0f2f5",
                    color: "text.secondary",
                    border: "1px solid #d0d5dd",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                />
              </Box>
              <Button
                component={Link}
                to="/business/projects"
                endIcon={<ArrowRight size={15} />}
                sx={{
                  borderRadius: "999px",
                  minHeight: 36,
                  px: 2,
                  fontSize: 13,
                  fontWeight: 700,
                  color: "primary.dark",
                  bgcolor: "transparent",
                  "&:hover": { bgcolor: "#fff0e9" },
                }}
              >
                Tất cả dự án
              </Button>
            </Box>

            <Box sx={{ display: "grid", gap: 2 }}>
              {dashboard.projectSummaries.length ? (
                dashboard.projectSummaries.map(({ project, candidateCount, pendingCount, invitationCount }) => (
                  <Paper
                    component="article"
                    key={project.id}
                    elevation={0}
                    sx={{
                      p: { xs: 2.25, sm: 3 },
                      borderRadius: "16px",
                      border: "1px solid",
                      borderColor: pendingCount > 0 ? "#ffd4c3" : "divider",
                      bgcolor: "background.paper",
                      boxShadow: "0 1px 3px rgba(16, 24, 40, 0.06), 0 1px 2px rgba(16, 24, 40, 0.04)",
                      transition: "border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease",
                      "&:hover": {
                        borderColor: pendingCount > 0 ? "primary.main" : "#b0b8c4",
                        boxShadow: "0 8px 24px -4px rgba(16, 24, 40, 0.08), 0 3px 8px -2px rgba(16, 24, 40, 0.04)",
                        transform: "translateY(-1.5px)",
                      },
                      "@media (prefers-reduced-motion: reduce)": { transition: "none", transform: "none" },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2.25 }}>
                      <Avatar
                        variant="rounded"
                        src={project.heroImage}
                        alt={project.title}
                        sx={{
                          width: { xs: 60, sm: 76 },
                          height: { xs: 60, sm: 76 },
                          borderRadius: "14px",
                          bgcolor: "#f8fafc",
                          border: "1px solid #eaedf2",
                          color: "text.secondary",
                          flexShrink: 0,
                          "& img": { objectFit: "contain", p: 0.5 },
                        }}
                      >
                        <BriefcaseBusiness size={28} aria-hidden="true" />
                      </Avatar>
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography sx={{ fontSize: 12, fontWeight: 600, color: "text.secondary", mb: 0.5 }}>
                          {project.category}
                        </Typography>
                        <Typography
                          component="h3"
                          sx={{
                            fontSize: { xs: 17, sm: 19 },
                            fontWeight: 800,
                            fontFamily: "Archivo, Arial, sans-serif",
                            lineHeight: 1.35,
                            overflowWrap: "anywhere",
                            "& a": { color: "text.primary", textDecoration: "none" },
                            "& a:hover": { color: "primary.dark" },
                          }}
                        >
                          <Link to={`/business/projects/${project.id}`}>{project.title}</Link>
                        </Typography>
                        <Typography sx={{ mt: 0.75, fontSize: 16, fontWeight: 800, color: "primary.dark" }}>
                          {project.budget || "Chưa đặt ngân sách"}
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        gap: 2,
                        mt: 2.25,
                        pt: 2,
                        borderTop: "1px solid",
                        borderColor: "divider",
                        color: "text.secondary",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, fontSize: 13, fontWeight: 600 }}>
                        <Users size={15} aria-hidden="true" />
                        <span>{candidateCount} ứng viên</span>
                      </Box>
                      {pendingCount > 0 && (
                        <Box
                          component={Link}
                          to={`/business/projects/${project.id}/applicants`}
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 1,
                            bgcolor: "#fff0e9",
                            border: "1px solid #fcd5c5",
                            color: "#bd3d14",
                            borderRadius: "999px",
                            px: 1.5,
                            py: 0.25,
                            fontSize: 12,
                            fontWeight: 700,
                            textDecoration: "none",
                            transition: "background-color 0.15s ease",
                            "&:hover": { bgcolor: "#ffe5d9" },
                          }}
                        >
                          <Box component="span" sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#f4490b" }} />
                          {pendingCount} chờ duyệt
                        </Box>
                      )}
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, fontSize: 13, ml: { sm: "auto" } }}>
                        <CalendarDays size={15} className="text-[#98a2b3]" aria-hidden="true" />
                        <span>Hạn tuyển:</span>
                        <Box component="span" sx={{ fontWeight: 700, color: "text.primary" }}>
                          {project.applicationDeadline || "Chưa đặt"}
                        </Box>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 1.5,
                        mt: 2,
                        pt: 1.5,
                        borderTop: "1px dashed",
                        borderColor: "divider",
                      }}
                    >
                      {invitationCount > 0 ? (
                        <Button
                          component={Link}
                          to={`/business/projects/${project.id}/invitations`}
                          startIcon={<Clock3 size={14} />}
                          sx={{
                            borderRadius: "999px",
                            minHeight: 36,
                            px: 2,
                            fontSize: 12.5,
                            fontWeight: 600,
                            color: "#b54708",
                            bgcolor: "#fffaeb",
                            border: "1px solid #fedf89",
                            "&:hover": { bgcolor: "#fef0c7" },
                          }}
                        >
                          {invitationCount} lời mời chờ phản hồi
                        </Button>
                      ) : (
                        <Button
                          component={Link}
                          to={`/business/projects/${project.id}/brief`}
                          startIcon={<FileText size={14} />}
                          sx={{
                            borderRadius: "999px",
                            minHeight: 36,
                            px: 2,
                            fontSize: 12.5,
                            fontWeight: 600,
                            color: "#475467",
                            bgcolor: "#f8fafc",
                            border: "1px solid #e2e8f0",
                            "&:hover": { bgcolor: "#eaedf2", color: "#1e293b" },
                          }}
                        >
                          Xem brief
                        </Button>
                      )}
                      <Button
                        component={Link}
                        to={`/business/projects/${project.id}/applicants`}
                        variant="contained"
                        endIcon={<ArrowUpRight size={15} />}
                        sx={{
                          borderRadius: "999px",
                          minHeight: 38,
                          px: 2.5,
                          fontSize: 13,
                          fontWeight: 700,
                          bgcolor: "primary.dark",
                          color: "#ffffff !important",
                          "& *": { color: "#ffffff !important" },
                          boxShadow: "0 1px 2px rgba(189, 61, 20, 0.2)",
                          "&:hover": {
                            bgcolor: "primary.main",
                            boxShadow: "0 4px 10px rgba(189, 61, 20, 0.3)",
                          },
                        }}
                      >
                        Xem ứng viên
                      </Button>
                    </Box>
                  </Paper>
                ))
              ) : (
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: "16px",
                    border: "1px dashed",
                    borderColor: "divider",
                    bgcolor: "background.paper",
                    p: { xs: 4, sm: 6 },
                    textAlign: "center",
                  }}
                >
                  <Box
                    sx={{
                      mx: "auto",
                      mb: 2,
                      display: "grid",
                      placeItems: "center",
                      width: 52,
                      height: 52,
                      borderRadius: "50%",
                      bgcolor: "#f0f2f5",
                      color: "text.secondary",
                    }}
                  >
                    <FolderOpen size={24} aria-hidden="true" />
                  </Box>
                  <Typography sx={{ fontSize: 17, fontWeight: 700 }}>Chưa có dự án đang tuyển</Typography>
                  <Typography sx={{ mt: 1, fontSize: 14, color: "text.secondary", maxWidth: 360, mx: "auto" }}>
                    Đăng brief để bắt đầu tiếp cận và nhận đề xuất từ cộng sự tài năng.
                  </Typography>
                  <Button
                    component={Link}
                    to="/business/projects/new"
                    variant="contained"
                    startIcon={<Plus size={16} />}
                    sx={{
                      mt: 2.5,
                      borderRadius: "999px",
                      minHeight: 40,
                      px: 3,
                      bgcolor: "primary.dark",
                      color: "#ffffff !important",
                      "& *": { color: "#ffffff !important" },
                      fontSize: 13.5,
                      fontWeight: 700,
                      "&:hover": { bgcolor: "primary.main" },
                    }}
                  >
                    Tạo dự án mới
                  </Button>
                </Paper>
              )}
            </Box>
          </Box>
        </Box>

        {/* Right Column (Aside) */}
        <Box component="aside" aria-label="Trao đổi và lịch bàn giao" sx={{ display: "grid", gap: 3, minWidth: 0 }}>
          {/* Card: Tin nhắn gần đây */}
          <Paper
            component="section"
            aria-labelledby="dashboard-messages-title"
            elevation={0}
            sx={{
              borderRadius: "16px",
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
              boxShadow: "0 1px 3px rgba(16, 24, 40, 0.06), 0 1px 2px rgba(16, 24, 40, 0.04)",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                px: 2.5,
                py: 2,
                bgcolor: "#fcfdfd",
                borderBottom: "1px solid",
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <MessageCircle size={18} className="text-[#667085]" aria-hidden="true" />
                <Typography
                  id="dashboard-messages-title"
                  component="h2"
                  sx={{ fontSize: 16, fontWeight: 800, fontFamily: "Archivo, Arial, sans-serif" }}
                >
                  Tin nhắn gần đây
                </Typography>
              </Box>
              <Button
                component={Link}
                to="/business/messages"
                aria-label="Mở hộp tin nhắn"
                sx={{
                  minWidth: 32,
                  width: 32,
                  height: 32,
                  p: 0,
                  borderRadius: "50%",
                  bgcolor: "#f0f2f5",
                  color: "text.primary",
                  "&:hover": { bgcolor: "#fff0e9", color: "primary.dark" },
                }}
              >
                <ArrowUpRight size={17} />
              </Button>
            </Box>

            {dashboard.recentMessages.length ? (
              dashboard.recentMessages.map(({ message, talent, project }) => (
                <Box
                  component={Link}
                  key={`${project.id}:${talent.id}`}
                  to={`/business/messages?view=project&scope=${project.id}&project=${project.id}&talent=${talent.id}`}
                  sx={{
                    display: "flex",
                    gap: 1.5,
                    px: 2.5,
                    py: 2,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    textDecoration: "none",
                    color: "inherit",
                    transition: "background-color 0.15s ease",
                    "&:hover": { bgcolor: "#f8fafc" },
                    "&:last-child": { borderBottom: 0 },
                  }}
                >
                  <Avatar
                    src={talent.avatar}
                    alt={talent.name}
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "12px",
                      bgcolor: talent.color,
                      color: "text.primary",
                      fontSize: 13,
                      fontWeight: 800,
                      fontFamily: "Archivo, Arial, sans-serif",
                      flexShrink: 0,
                    }}
                  >
                    {talent.initials}
                  </Avatar>
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
                      <Typography noWrap sx={{ fontSize: 14, fontWeight: 700 }}>
                        {talent.name}
                      </Typography>
                      <Typography component="time" dateTime={message.sentAt} sx={{ fontSize: 12, color: "text.secondary", flexShrink: 0 }}>
                        {new Date(message.sentAt).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })}
                      </Typography>
                    </Box>
                    <Typography noWrap sx={{ fontSize: 13, mt: 0.25, color: "text.secondary" }}>
                      {message.sender === "business" ? "Bạn: " : ""}{message.body}
                    </Typography>
                    <Typography noWrap sx={{ fontSize: 12, mt: 0.5, color: "#98a2b3" }}>
                      {project.title}
                    </Typography>
                  </Box>
                </Box>
              ))
            ) : (
              <Box sx={{ p: 3, textAlign: "center" }}>
                <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                  Tin nhắn từ cộng sự sẽ xuất hiện tại đây.
                </Typography>
              </Box>
            )}
          </Paper>

          {/* Card: Lịch bàn giao */}
          <Paper
            component="section"
            aria-labelledby="dashboard-milestones-title"
            elevation={0}
            sx={{
              borderRadius: "16px",
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
              boxShadow: "0 1px 3px rgba(16, 24, 40, 0.06), 0 1px 2px rgba(16, 24, 40, 0.04)",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                px: 2.5,
                py: 2,
                bgcolor: "#fcfdfd",
                borderBottom: "1px solid",
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CalendarDays size={18} className="text-[#667085]" aria-hidden="true" />
                <Typography
                  id="dashboard-milestones-title"
                  component="h2"
                  sx={{ fontSize: 16, fontWeight: 800, fontFamily: "Archivo, Arial, sans-serif" }}
                >
                  Lịch bàn giao
                </Typography>
              </Box>
              <Chip
                label="Mô phỏng"
                size="small"
                sx={{ height: 22, fontSize: 10, fontWeight: 700, bgcolor: "#f0f2f5", color: "text.secondary" }}
              />
            </Box>

            {dashboard.upcomingMilestones.length ? (
              dashboard.upcomingMilestones.map(({ project, milestone }) => {
                const [day, month] = milestone.deadline.split("/");
                return (
                  <Box
                    component={Link}
                    key={`${project.id}:${milestone.id}`}
                    to={`/business/ongoing/${project.id}/progress`}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.75,
                      px: 2.5,
                      py: 2,
                      borderBottom: "1px solid",
                      borderColor: "divider",
                      textDecoration: "none",
                      color: "inherit",
                      transition: "background-color 0.15s ease",
                      "&:hover": { bgcolor: "#f8fafc" },
                      "&:last-child": { borderBottom: 0 },
                    }}
                  >
                    <Box
                      sx={{
                        width: 50,
                        flexShrink: 0,
                        border: "1px solid",
                        borderColor: milestone.status === "submitted" ? "#fcd5c5" : "#e4e7ec",
                        borderRadius: "10px",
                        textAlign: "center",
                        overflow: "hidden",
                        bgcolor: "#ffffff",
                        boxShadow: "0 1px 2px rgba(16, 24, 40, 0.04)",
                      }}
                    >
                      <Typography
                        sx={{
                          py: 0.25,
                          fontSize: 10,
                          fontWeight: 700,
                          bgcolor: milestone.status === "submitted" ? "#fff0e9" : "#f8fafc",
                          color: milestone.status === "submitted" ? "primary.dark" : "text.secondary",
                          borderBottom: "1px solid",
                          borderColor: milestone.status === "submitted" ? "#fcd5c5" : "#e4e7ec",
                        }}
                      >
                        {month ? `T${month}` : "—"}
                      </Typography>
                      <Typography
                        sx={{
                          py: 0.5,
                          fontSize: 18,
                          fontWeight: 800,
                          fontFamily: "Archivo, Arial, sans-serif",
                          color: milestone.status === "submitted" ? "primary.dark" : "text.primary",
                          lineHeight: 1.1,
                        }}
                      >
                        {day || "—"}
                      </Typography>
                    </Box>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography sx={{ fontSize: 14, fontWeight: 700, lineHeight: 1.4 }} noWrap>
                        {milestone.name}
                      </Typography>
                      <Typography sx={{ mt: 0.25, fontSize: 12, color: "text.secondary" }} noWrap>
                        {project.title}
                      </Typography>
                      <Box sx={{ mt: 0.75 }}>
                        <Chip
                          size="small"
                          label={
                            milestone.status === "submitted"
                              ? "Chờ duyệt bàn giao"
                              : milestone.status === "in_progress"
                              ? "Đang thực hiện"
                              : "Chưa bắt đầu"
                          }
                          sx={{
                            height: 22,
                            fontSize: 11,
                            fontWeight: 700,
                            bgcolor:
                              milestone.status === "submitted"
                                ? "#fff0e9"
                                : milestone.status === "in_progress"
                                ? "#eaf4fb"
                                : "#f2f3f0",
                            color:
                              milestone.status === "submitted"
                                ? "primary.dark"
                                : milestone.status === "in_progress"
                                ? "#176c9a"
                                : "#62645e",
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                );
              })
            ) : (
              <Box sx={{ p: 3, textAlign: "center" }}>
                <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                  Chưa có mốc bàn giao đang chờ.
                </Typography>
              </Box>
            )}
          </Paper>

          {/* Card: Chờ xác nhận thỏa thuận */}
          {dashboard.pendingAgreements.length > 0 && (
            <Paper
              component="section"
              aria-labelledby="dashboard-agreements-title"
              elevation={0}
              sx={{
                borderRadius: "16px",
                border: "1px solid #ffd4c3",
                bgcolor: "background.paper",
                boxShadow: "0 1px 3px rgba(16, 24, 40, 0.06)",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  px: 2.5,
                  py: 2,
                  bgcolor: "#fffaf7",
                  borderBottom: "1px solid #fcd5c5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Clock3 size={18} className="text-[#bd3d14]" aria-hidden="true" />
                  <Typography
                    id="dashboard-agreements-title"
                    component="h2"
                    sx={{ fontSize: 15, fontWeight: 800, fontFamily: "Archivo, Arial, sans-serif", color: "primary.dark" }}
                  >
                    Chờ xác nhận thỏa thuận
                  </Typography>
                </Box>
                <Chip
                  label={dashboard.pendingAgreements.length}
                  size="small"
                  sx={{ height: 22, fontSize: 11, fontWeight: 700, bgcolor: "#fff0e9", color: "primary.dark" }}
                />
              </Box>
              {dashboard.pendingAgreements.map(({ agreement, project }) => (
                <Box
                  component={Link}
                  key={agreement.id || `${agreement.projectId}:${agreement.talentId}:${agreement.version}`}
                  to={`/business/projects/${agreement.projectId}/agreement?talent=${agreement.talentId}`}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1.5,
                    p: 2,
                    borderBottom: "1px solid #fcd5c5",
                    textDecoration: "none",
                    color: "inherit",
                    transition: "background-color 0.15s ease",
                    "&:hover": { bgcolor: "#fff8f5" },
                    "&:last-child": { borderBottom: 0 },
                  }}
                >
                  <Typography sx={{ flex: 1, minWidth: 0, fontSize: 13.5, fontWeight: 600 }} noWrap>
                    {project.title}
                  </Typography>
                  <ArrowUpRight size={16} className="shrink-0 text-[#bd3d14]" aria-hidden="true" />
                </Box>
              ))}
            </Paper>
          )}
        </Box>
      </Box>
    </Box>
  );
}
