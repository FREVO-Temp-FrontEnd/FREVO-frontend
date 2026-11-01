import { BusinessQuotaSummary } from "../components/BusinessQuotaSummary";
import { Link } from "react-router";
import {
  Archive,
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  FilePenLine,
  FileText,
  FolderOpen,
  Layers3,
  Plus,
  Search,
  UsersRound,
} from "lucide-react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  InputAdornment,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useBusiness } from "@/lib/hooks/useBusiness";
import type { ProjectBrief, ProjectStatus } from "@/lib/types/marketplace.types";
import { useProjectList, type ProjectFilter, type ProjectSort } from "@/features/business/hooks/useProjectList";

const filters: { value: ProjectFilter; label: string }[] = [
  { value: "all", label: "Tất cả" },
  { value: "published", label: "Đang tuyển" },
  { value: "draft", label: "Bản nháp" },
  { value: "closed", label: "Đã đóng tuyển" },
  { value: "completed", label: "Hoàn thành" },
];

const statuses: Record<ProjectStatus, { label: string; background: string; color: string; icon: typeof BriefcaseBusiness }> = {
  published: { label: "Đang tuyển", background: "#e8f7ef", color: "#16805b", icon: BriefcaseBusiness },
  ongoing: { label: "Đang tiến hành", background: "#eaf4fb", color: "#176c9a", icon: Layers3 },
  draft: { label: "Bản nháp", background: "#f2f3f0", color: "#62645e", icon: FilePenLine },
  closed: { label: "Đã đóng tuyển", background: "#f3efed", color: "#795e55", icon: Archive },
  completed: { label: "Hoàn thành", background: "#e8f7ef", color: "#16805b", icon: Check },
};

interface ProjectCardProps {
  project: ProjectBrief;
  candidateCount: number;
  pendingCount: number;
  executorName?: string;
}

function ProjectCard({ project, candidateCount, pendingCount, executorName }: ProjectCardProps) {
  const isDraft = project.status === "draft";
  const recruiting = project.status === "published";
  const inProgress = project.status === "ongoing";
  const status = statuses[project.status];
  const Icon = status.icon;
  const detailPath = `/business/projects/${project.id}`;
  const target = isDraft ? `${detailPath}/edit` : inProgress ? `${detailPath}/progress` : detailPath;
  const deadline = recruiting ? project.applicationDeadline || project.deadline : project.deadline;

  return (
    <Paper
      component="article"
      elevation={0}
      sx={{
        p: { xs: 2.25, sm: 3 },
        borderRadius: "16px",
        border: "1px solid",
        borderColor: recruiting && pendingCount > 0 ? "#ffd4c3" : "divider",
        bgcolor: "background.paper",
        boxShadow: "0 1px 3px rgba(16, 24, 40, 0.06), 0 1px 2px rgba(16, 24, 40, 0.04)",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease",
        "&:hover": {
          borderColor: recruiting && pendingCount > 0 ? "#f4490b" : "#b0b8c4",
          boxShadow: "0 8px 24px -4px rgba(16, 24, 40, 0.08), 0 3px 8px -2px rgba(16, 24, 40, 0.04)",
          transform: "translateY(-1.5px)",
        },
        "@media (prefers-reduced-motion: reduce)": { transition: "none", transform: "none" },
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "minmax(0, 1.4fr) minmax(130px, auto) minmax(170px, auto) auto",
          },
          gap: { xs: 2.5, md: 3 },
          alignItems: "center",
        }}
      >
        {/* Project Thumbnail & Basic Info */}
        <div className="flex min-w-0 items-start gap-4">
          <Avatar
            variant="rounded"
            src={project.heroImage}
            alt={project.title}
            sx={{
              mt: 0.5,
              width: 52,
              height: 52,
              borderRadius: "12px",
              bgcolor: status.background,
              color: status.color,
              flexShrink: 0,
            }}
          >
            <Icon size={24} strokeWidth={1.8} aria-hidden="true" />
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Chip
                icon={<Icon size={14} aria-hidden="true" />}
                label={status.label}
                size="small"
                sx={{
                  height: 26,
                  bgcolor: status.background,
                  color: status.color,
                  fontSize: 12,
                  fontWeight: 700,
                  "& .MuiChip-icon": { color: "inherit", ml: 0.75 },
                }}
              />
              <span className="text-xs font-semibold text-[#667085]">{project.category}</span>
            </div>
            <Typography
              component="h2"
              sx={{
                fontSize: { xs: 17, sm: 19 },
                fontWeight: 700,
                lineHeight: 1.4,
                overflowWrap: "anywhere",
                "& a": { color: "text.primary", textDecoration: "none" },
                "& a:hover": { color: "primary.dark" },
              }}
            >
              <Link to={isDraft ? `${detailPath}/edit` : detailPath}>{project.title}</Link>
            </Typography>
            <p className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-[#667085]">
              <CalendarDays size={14} className="text-[#98a2b3]" aria-hidden="true" />
              <span>{recruiting ? "Nhận hồ sơ đến:" : isDraft ? "Dự kiến hoàn thành:" : "Hạn hoàn thành:"}</span>
              <span className="font-semibold text-[#344054]">{deadline || "Chưa đặt"}</span>
            </p>
          </div>
        </div>

        {/* Budget */}
        <Box sx={{ pl: { xs: 0, md: 2.5 }, borderLeft: { md: "1px solid" }, borderColor: { md: "divider" } }}>
          <Typography sx={{ fontSize: 11, fontWeight: 600, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.03em" }}>
            Ngân sách
          </Typography>
          <Typography sx={{ mt: 0.5, fontSize: { xs: 16, sm: 18 }, fontWeight: 800, color: "primary.dark" }}>
            {project.budget || "Chưa đặt"}
          </Typography>
        </Box>

        {/* Candidates & Cooperation Status */}
        <Box sx={{ pl: { xs: 0, md: 2.5 }, borderLeft: { md: "1px solid" }, borderColor: { md: "divider" } }}>
          <Typography sx={{ fontSize: 11, fontWeight: 600, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.03em" }}>
            Ứng viên / Tiến độ
          </Typography>
          <Box sx={{ mt: 0.5 }}>
            {recruiting ? (
              <>
                <Typography sx={{ display: "flex", alignItems: "center", gap: 1, fontSize: 14, fontWeight: 600, color: "#344054" }}>
                  <UsersRound size={15} className="text-[#667085]" aria-hidden="true" />
                  {candidateCount} ứng viên
                </Typography>
                {pendingCount > 0 ? (
                  <Link
                    to={`${detailPath}/applicants`}
                    className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-[#fff0e9] border border-[#fcd5c5] px-2.5 py-0.5 text-xs font-bold text-[#bd3d14] hover:bg-[#ffe5d9] transition-colors"
                  >
                    <span className="size-1.5 rounded-full bg-[#f4490b] animate-pulse" aria-hidden="true" />
                    {pendingCount} hồ sơ chờ duyệt
                  </Link>
                ) : (
                  <Typography sx={{ mt: 0.5, fontSize: 12, color: "text.secondary" }}>
                    {candidateCount ? "Không có hồ sơ chờ duyệt" : "Chưa có ứng viên"}
                  </Typography>
                )}
              </>
            ) : isDraft ? (
              <>
                <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#475467" }}>Chưa đăng tuyển</Typography>
                <Typography sx={{ fontSize: 12, color: "text.secondary" }}>Chỉ bạn nhìn thấy</Typography>
              </>
            ) : executorName ? (
              <div className="flex items-center gap-2">
                <Avatar sx={{ width: 28, height: 28, bgcolor: "#f2f3f0", color: "text.primary", fontSize: 11, fontWeight: 700 }}>
                  {executorName.split(" ").map(part => part[0]).slice(0, 2).join("")}
                </Avatar>
                <div className="min-w-0">
                  <Typography sx={{ fontSize: 11, color: "text.secondary" }}>Người thực hiện</Typography>
                  <Typography noWrap sx={{ fontSize: 13, fontWeight: 700 }}>{executorName}</Typography>
                </div>
              </div>
            ) : (
              <>
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#475467" }}>
                  {project.status === "completed" ? "Đã hoàn thành dự án" : `${candidateCount} hồ sơ đã nhận`}
                </Typography>
                <Typography sx={{ fontSize: 11, color: "text.secondary" }}>Không còn nhận ứng tuyển</Typography>
              </>
            )}
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "row", md: "column" },
            gap: 1.25,
            justifyContent: { xs: "flex-start", md: "center" },
            flexShrink: 0,
            width: { xs: "100%", md: 160 },
            pt: { xs: 2, md: 0 },
            borderTop: { xs: "1px solid", md: "none" },
            borderColor: { xs: "divider" },
          }}
        >
          <Button
            component={Link}
            to={target}
            variant={recruiting && pendingCount > 0 ? "contained" : "outlined"}
            endIcon={<ArrowRight size={15} />}
            fullWidth
            sx={{
              minHeight: 40,
              px: 2,
              borderRadius: "999px",
              fontSize: 13.5,
              fontWeight: 700,
              whiteSpace: "nowrap",
              ...(recruiting && pendingCount > 0
                ? {
                    boxShadow: "0 1px 2px rgba(244, 73, 11, 0.15)",
                  }
                : inProgress
                ? {
                    color: status.color,
                    bgcolor: status.background,
                    borderColor: "#c6e0ef",
                    "&:hover": { bgcolor: "#dceef9", borderColor: status.color },
                  }
                : {
                    color: "text.primary",
                    bgcolor: "background.paper",
                    borderColor: "#d0d5dd",
                    "&:hover": { borderColor: "#b8c0cc", bgcolor: "#f8fafc" },
                  }),
            }}
          >
            {isDraft ? "Tiếp tục soạn" : inProgress ? "Xem tiến độ" : recruiting ? "Xem ứng viên" : "Xem dự án"}
          </Button>
          <Button
            component={Link}
            to={`${detailPath}/brief`}
            startIcon={<FileText size={15} />}
            aria-label={`Xem brief: ${project.title}`}
            fullWidth
            sx={{
              minHeight: 38,
              px: 2,
              borderRadius: "999px",
              fontSize: 13,
              fontWeight: 600,
              bgcolor: "#f4f6f8",
              color: "#475467",
              border: "1px solid #e2e8f0",
              "&:hover": { bgcolor: "#eaedf2", color: "#1e293b", borderColor: "#cbd2dc" },
            }}
          >
            Xem brief
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}

export function MyProjectsPage() {
  const { projects, candidates, talents } = useBusiness();
  const { filter, setFilter, query, setQuery, sort, setSort, counts, candidateCounts, pendingCounts, executorNames, visibleProjects } = useProjectList(projects, candidates, talents);
  const hasActiveFilter = filter !== "all" || query.trim().length > 0;
  const activeFilters = filters.filter(item => item.value !== "completed" || counts.completed > 0 || filter === "completed");

  return (
    <Box
      sx={(theme) => ({
        fontFamily: theme.typography.fontFamily,
        "&& h1, && h2": {
          fontFamily: theme.typography.h2.fontFamily,
          letterSpacing: "-0.015em",
        },
        "&& .MuiButton-root": {
          fontFamily: theme.typography.fontFamily,
          fontSize: 14,
          fontWeight: 600,
          textTransform: "none",
          letterSpacing: 0,
          lineHeight: 1.4,
        },
        "&& a.MuiButton-contained": {
          color: "primary.contrastText",
        },
      })}
    >
      <header className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <Typography component="h1" sx={{ fontSize: { xs: 28, sm: 32 }, fontWeight: 800, lineHeight: 1.25 }}>
            Dự án của tôi
          </Typography>
          <p className="mt-2 text-base text-[#747773]">Quản lý tuyển dụng và hợp tác tại một nơi.</p>
        </div>
        <Button
          component={Link}
          to="/business/projects/new"
          variant="contained"
          startIcon={<Plus size={17} />}
          sx={{ minHeight: 44, px: 2.5, alignSelf: { xs: "flex-start", sm: "center" }, flexShrink: 0 }}
        >
          Đăng dự án
        </Button>
      </header>

      <BusinessQuotaSummary />

      {/* Status Filter Tabs */}
      <div
        className="mb-4 flex max-w-full gap-1 overflow-x-auto border-b border-[#d0d5dd]"
        role="group"
        aria-label="Lọc trạng thái dự án"
      >
        {activeFilters.map(item => (
          <Button
            key={item.value}
            aria-pressed={filter === item.value}
            onClick={() => setFilter(item.value)}
            sx={{
              flexShrink: 0,
              minHeight: 46,
              px: 2,
              borderRadius: 0,
              borderBottom: "2px solid",
              borderColor: filter === item.value ? "primary.main" : "transparent",
              color: filter === item.value ? "primary.dark" : "text.secondary",
              bgcolor: "transparent",
              fontSize: 14,
              fontWeight: filter === item.value ? 700 : 600,
              transition: "all 150ms ease",
              "&:hover": { bgcolor: "#f0f2ed", color: filter === item.value ? "primary.dark" : "text.primary" },
            }}
          >
            {item.label}
            <span
              className={`ml-2 rounded-full px-2 py-0.5 text-xs font-bold ${
                filter === item.value ? "bg-[#fff0e9] text-[#bd3d14]" : "bg-[#e5e8ec] text-[#667085]"
              }`}
            >
              {counts[item.value]}
            </span>
          </Button>
        ))}
      </div>

      {/* Search and Sort Filter Bar */}
      <Box
        sx={{
          mb: 3,
          p: { xs: 2, sm: 2.5 },
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: "14px",
          boxShadow: "0 1px 3px rgba(16, 24, 40, 0.06), 0 1px 2px rgba(16, 24, 40, 0.04)",
        }}
      >
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <TextField
            size="small"
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder="Tìm tên hoặc lĩnh vực…"
            slotProps={{
              htmlInput: { "aria-label": "Tìm dự án theo tên hoặc lĩnh vực" },
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={17} className="text-[#667085]" />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              width: { xs: "100%", sm: 340 },
              "& .MuiOutlinedInput-root": {
                height: 42,
                bgcolor: "#f8fafc",
                borderRadius: "10px",
                fontSize: 14,
                "& fieldset": { borderColor: "#d0d5dd" },
                "&:hover fieldset": { borderColor: "#b8c0cc" },
              },
            }}
          />
          <TextField
            select
            size="small"
            label="Sắp xếp"
            value={sort}
            onChange={event => setSort(event.target.value as ProjectSort)}
            sx={{
              minWidth: 190,
              "& .MuiOutlinedInput-root": {
                height: 42,
                bgcolor: "#f8fafc",
                borderRadius: "10px",
                fontSize: 14,
                "& fieldset": { borderColor: "#d0d5dd" },
                "&:hover fieldset": { borderColor: "#b8c0cc" },
              },
              "& .MuiInputLabel-root": { fontSize: 14 },
            }}
          >
            <MenuItem value="newest">Mới nhất</MenuItem>
            <MenuItem value="deadline">Hạn gần nhất</MenuItem>
            <MenuItem value="budget">Ngân sách cao nhất</MenuItem>
            <MenuItem value="applicants">Nhiều hồ sơ nhất</MenuItem>
          </TextField>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#f0f2f5] pt-3 text-sm">
          <Typography component="h2" sx={{ fontSize: 14, fontWeight: 600, color: "text.secondary" }}>
            {filter === "all" ? "Tất cả dự án" : filter === "draft" ? "Dự án nháp" : `Dự án ${filters.find(item => item.value === filter)?.label.toLocaleLowerCase("vi")}`}
            <span className="ml-1.5 font-bold text-[#20201f]">({visibleProjects.length})</span>
          </Typography>
          {hasActiveFilter && (
            <Button
              size="small"
              onClick={() => { setFilter("all"); setQuery(""); }}
              sx={{ minHeight: 32, px: 1.5, fontSize: 13, color: "primary.dark", "&:hover": { bgcolor: "#fff0e9" } }}
            >
              Xóa bộ lọc
            </Button>
          )}
        </div>
      </Box>

      {/* Projects List as Separated Cards */}
      <section aria-label="Danh sách dự án của tôi">
        {visibleProjects.length ? (
          <div className="flex flex-col gap-4">
            {visibleProjects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                candidateCount={candidateCounts.get(project.id) ?? 0}
                pendingCount={pendingCounts.get(project.id) ?? 0}
                executorName={executorNames.get(project.id)}
              />
            ))}
          </div>
        ) : (
          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, sm: 8 },
              textAlign: "center",
              borderRadius: "16px",
              border: "1px dashed",
              borderColor: "divider",
              bgcolor: "background.paper",
            }}
          >
            <Box
              sx={{
                mx: "auto",
                mb: 2,
                display: "grid",
                placeItems: "center",
                width: 56,
                height: 56,
                borderRadius: "50%",
                bgcolor: "#f0f2f5",
                color: "text.secondary",
              }}
            >
              {hasActiveFilter ? <Search size={25} aria-hidden="true" /> : <FolderOpen size={25} aria-hidden="true" />}
            </Box>
            <Typography component="h2" sx={{ fontSize: 20, fontWeight: 700 }}>
              {hasActiveFilter ? "Không tìm thấy dự án phù hợp" : "Chưa có dự án nào"}
            </Typography>
            <p className="mx-auto mt-2 max-w-sm text-base leading-6 text-[#747773]">
              {hasActiveFilter ? "Thử thay đổi từ khóa hoặc bộ lọc trạng thái." : "Tạo brief đầu tiên để bắt đầu tìm người phù hợp."}
            </p>
            {hasActiveFilter ? (
              <Button onClick={() => { setFilter("all"); setQuery(""); }} sx={{ mt: 2 }}>
                Xóa bộ lọc
              </Button>
            ) : (
              <Button
                component={Link}
                to="/business/projects/new"
                variant="contained"
                startIcon={<Plus size={16} />}
                sx={{ mt: 3, borderRadius: 999 }}
              >
                Tạo dự án đầu tiên
              </Button>
            )}
          </Paper>
        )}
      </section>
    </Box>
  );
}
