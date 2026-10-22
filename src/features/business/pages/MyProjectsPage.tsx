import { Link } from "react-router";
import { Archive, ArrowRight, BriefcaseBusiness, CalendarDays, Check, FilePenLine, FileText, FolderOpen, Layers3, Plus, Search, UsersRound } from "lucide-react";
import { Avatar, Box, Button, Chip, InputAdornment, MenuItem, TextField, Typography } from "@mui/material";
import { useBusiness } from "@/lib/hooks/useBusiness";
import type { ProjectBrief, ProjectStatus } from "@/lib/types/marketplace.types";
import { useProjectList, type ProjectFilter, type ProjectSort } from "@/features/business/hooks/useProjectList";

const filters: { value: ProjectFilter; label: string }[] = [
  { value: "all", label: "Tất cả" },
  { value: "published", label: "Đang tuyển" },
  { value: "ongoing", label: "Đang tiến hành" },
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
interface ProjectRowProps {
  project: ProjectBrief;
  candidateCount: number;
  pendingCount: number;
  executorName?: string;
}
function ProjectRow({ project, candidateCount, pendingCount, executorName }: ProjectRowProps) {
  const isDraft = project.status === "draft";
  const recruiting = project.status === "published";
  const inProgress = project.status === "ongoing";
  const status = statuses[project.status];
  const Icon = status.icon;
  const detailPath = `/business/projects/${project.id}`;
  const target = isDraft ? `${detailPath}/edit` : inProgress ? `/workspace/${project.id}` : detailPath;
  const deadline = recruiting ? project.applicationDeadline || project.deadline : project.deadline;
  return <Box component="article" className="grid min-w-0 gap-5 border-b border-[#e4e6e2] px-4 py-5 last:border-b-0 sm:px-6 xl:grid-cols-[minmax(220px,1fr)_130px_175px_170px] xl:items-center xl:gap-5" sx={{ transition: "background-color 150ms ease", "&:hover": { bgcolor: "#fafbf9" }, "@media (prefers-reduced-motion: reduce)": { transition: "none" } }}>
    <div className="flex min-w-0 items-start gap-3.5">
      <Avatar variant="rounded" src={project.heroImage} alt={project.title} sx={{ mt: 0.5, width: 44, height: 44, borderRadius: 2, bgcolor: status.background, color: status.color }}><Icon size={21} strokeWidth={1.7} aria-hidden="true" /></Avatar>
      <div className="min-w-0">
        <div className="mb-2 flex flex-wrap items-center gap-2"><Chip label={status.label} size="small" sx={{ height: 23, bgcolor: status.background, color: status.color, fontSize: 11, fontWeight: 600 }} /><span className="text-xs text-[#747773]">{project.category}</span></div>
        <Typography component="h2" sx={{ fontSize: { xs: 17, sm: 18 }, fontWeight: 700, lineHeight: 1.4, overflowWrap: "anywhere", "& a:hover": { color: "primary.dark" } }}><Link to={`${detailPath}/brief`}>{project.title}</Link></Typography>
        <p className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs leading-5 text-[#747773]"><CalendarDays size={13} aria-hidden="true" /><span>{recruiting ? "Nhận hồ sơ đến" : isDraft ? "Dự kiến hoàn thành" : "Hạn hoàn thành"}</span><span className="font-medium text-[#62665f]">{deadline || "Chưa đặt"}</span></p>
      </div>
    </div>
    <div className="pl-[58px] xl:pl-0"><p className="text-xs text-[#747773]">Ngân sách dự kiến</p><p className="mt-1.5 text-[15px] font-bold text-[#20201f]">{project.budget || "Chưa đặt"}</p></div>
    <div className="min-w-0 pl-[58px] xl:pl-0">
      {recruiting ? <><p className="flex items-center gap-1.5 text-sm font-medium"><UsersRound size={15} className="text-[#747773]" aria-hidden="true" />{candidateCount} ứng viên</p>{pendingCount > 0 ? <Link to={`${detailPath}/applicants`} className="mt-2 inline-flex min-h-7 items-center gap-1.5 rounded-full bg-[#fff0e9] px-2.5 py-1 text-xs font-semibold"><span className="size-1.5 rounded-full bg-[#f4490b]" aria-hidden="true" />{pendingCount} hồ sơ chờ duyệt</Link> : <p className="mt-1.5 text-xs text-[#747773]">{candidateCount ? "Không có hồ sơ chờ duyệt" : "Chưa có hồ sơ ứng tuyển"}</p>}</>
        : isDraft ? <><p className="text-sm font-medium text-[#62665f]">Chưa đăng tuyển</p><p className="mt-1.5 text-xs text-[#747773]">Chỉ bạn nhìn thấy</p></>
        : executorName ? <div className="flex items-center gap-2"><Avatar sx={{ width: 32, height: 32, bgcolor: "#f2f3f0", color: "text.primary", fontSize: 11, fontWeight: 700 }}>{executorName.split(" ").map(part => part[0]).slice(0, 2).join("")}</Avatar><div className="min-w-0"><p className="text-xs text-[#747773]">Người thực hiện</p><p className="mt-1 text-sm font-semibold">{executorName}</p></div></div>
        : <><p className="text-sm font-medium text-[#62665f]">{project.status === "completed" ? "Đã hoàn thành dự án" : `${candidateCount} hồ sơ đã nhận`}</p><p className="mt-1.5 text-xs text-[#747773]">Không còn nhận ứng tuyển</p></>}
    </div>
    <div className="flex flex-wrap items-center gap-2 border-t border-[#eef0ea] pt-4 sm:pl-[58px] xl:flex-col xl:items-stretch xl:border-0 xl:pl-0 xl:pt-0">
      <Button component={Link} to={target} variant={recruiting && pendingCount > 0 ? "contained" : "outlined"} endIcon={<ArrowRight size={15} />} sx={{ minHeight: 40, px: 2, borderColor: "divider", whiteSpace: "nowrap", ...(recruiting && pendingCount > 0 ? {} : inProgress ? { color: status.color, bgcolor: status.background, borderColor: "#c6e0ef", "&:hover": { bgcolor: "#dceef9", borderColor: status.color } } : { color: "text.primary", bgcolor: "background.paper" }) }}>{isDraft ? "Tiếp tục soạn" : inProgress ? "Xem tiến độ" : recruiting ? "Xem ứng viên" : "Xem dự án"}</Button>
      <Button component={Link} to={`${detailPath}/brief`} startIcon={<FileText size={15} />} aria-label={`Xem brief: ${project.title}`} sx={{ minHeight: 38, px: 2, bgcolor: "#f2f3f0", color: "text.secondary", "&:hover": { bgcolor: "#e9ece5", color: "text.primary" } }}>Xem brief</Button>
    </div>
  </Box>;
}

export function MyProjectsPage() {
  const { projects, candidates, talents } = useBusiness();
  const { filter, setFilter, query, setQuery, sort, setSort, counts, candidateCounts, pendingCounts, executorNames, visibleProjects } = useProjectList(projects, candidates, talents);
  const hasActiveFilter = filter !== "all" || query.trim().length > 0;
  const activeFilters = filters.filter(item => item.value !== "completed" || counts.completed > 0 || filter === "completed");
  return <Box sx={(theme) => ({ fontFamily: theme.typography.fontFamily, "&& h1, && h2": { fontFamily: theme.typography.h2.fontFamily, letterSpacing: "-0.015em" }, "&& .MuiButton-root": { fontFamily: theme.typography.fontFamily, fontSize: 13, fontWeight: 600, textTransform: "none", letterSpacing: 0, lineHeight: 1.4 }, "&& a.MuiButton-contained": { color: "primary.contrastText" } })}>
    <header className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
      <div><Typography component="h1" sx={{ fontSize: { xs: 28, sm: 32 }, fontWeight: 800, lineHeight: 1.25 }}>Dự án của tôi</Typography><p className="mt-2 text-sm text-[#747773]">Quản lý tuyển dụng và hợp tác tại một nơi.</p></div>
      <Button component={Link} to="/business/projects/new" variant="contained" startIcon={<Plus size={17} />} sx={{ minHeight: 44, px: 2.5, alignSelf: { xs: "flex-start", sm: "center" }, flexShrink: 0 }}>Đăng dự án</Button>
    </header>
    <div className="mb-5 flex max-w-full gap-1 overflow-x-auto border-b border-[#e4e6e2]" role="group" aria-label="Lọc trạng thái dự án">
      {activeFilters.map(item => <Button key={item.value} aria-pressed={filter === item.value} onClick={() => setFilter(item.value)} sx={{ flexShrink: 0, minHeight: 48, px: 1.75, borderRadius: 0, borderBottom: "2px solid", borderColor: filter === item.value ? "primary.main" : "transparent", "&&": { color: filter === item.value ? "primary.dark" : "text.secondary", bgcolor: "transparent" }, "&:hover": { bgcolor: "#f0f2ed" } }}>{item.label}<span className={`ml-2 rounded-full px-2 py-0.5 text-[11px] ${filter === item.value ? "bg-[#fff0e9] text-[#bd3d14]" : "bg-[#eeefeb] text-[#747773]"}`}>{counts[item.value]}</span></Button>)}
    </div>
    <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
      <TextField size="small" value={query} onChange={event => setQuery(event.target.value)} placeholder="Tìm tên hoặc lĩnh vực…" slotProps={{ htmlInput: { "aria-label": "Tìm dự án theo tên hoặc lĩnh vực" }, input: { startAdornment: <InputAdornment position="start"><Search size={17} /></InputAdornment> } }} sx={{ width: { xs: "100%", sm: 300 }, "& .MuiOutlinedInput-root": { height: 42, bgcolor: "background.paper", borderRadius: 999, fontSize: 14 } }} />
      <TextField select size="small" label="Sắp xếp" value={sort} onChange={event => setSort(event.target.value as ProjectSort)} sx={{ minWidth: 190, "& .MuiOutlinedInput-root": { height: 42, bgcolor: "background.paper", borderRadius: 999, fontSize: 13 }, "& .MuiInputLabel-root": { fontSize: 13 } }}><MenuItem value="newest">Mới nhất</MenuItem><MenuItem value="deadline">Hạn gần nhất</MenuItem><MenuItem value="budget">Ngân sách cao nhất</MenuItem><MenuItem value="applicants">Nhiều hồ sơ nhất</MenuItem></TextField>
    </div>
    <section aria-labelledby="project-list-heading" className="overflow-hidden rounded-3xl border border-[#e4e6e2] bg-white">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e4e6e2] bg-[#fafbf9] px-4 py-3.5 sm:px-6"><Typography id="project-list-heading" component="h2" sx={{ fontSize: 14, fontWeight: 600 }}>{filter === "all" ? "Tất cả dự án" : filter === "draft" ? "Dự án nháp" : `Dự án ${filters.find(item => item.value === filter)?.label.toLocaleLowerCase("vi")}`} <span className="ml-1 text-[#747773]">({visibleProjects.length})</span></Typography>{hasActiveFilter && <Button onClick={() => { setFilter("all"); setQuery(""); }} sx={{ minHeight: 32, py: 0, color: "text.secondary" }}>Xóa bộ lọc</Button>}</div>
      {visibleProjects.length ? visibleProjects.map(project => <ProjectRow key={project.id} project={project} candidateCount={candidateCounts.get(project.id) ?? 0} pendingCount={pendingCounts.get(project.id) ?? 0} executorName={executorNames.get(project.id)} />) : <div className="px-5 py-14 text-center"><Box sx={{ mx: "auto", mb: 2, display: "grid", placeItems: "center", width: 56, height: 56, borderRadius: "50%", bgcolor: "background.default", color: "text.secondary" }}>{hasActiveFilter ? <Search size={25} aria-hidden="true" /> : <FolderOpen size={25} aria-hidden="true" />}</Box><Typography component="h2" sx={{ fontSize: 20, fontWeight: 700 }}>{hasActiveFilter ? "Không tìm thấy dự án" : "Chưa có dự án nào"}</Typography><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#747773]">{hasActiveFilter ? "Thử từ khóa khác hoặc xóa bộ lọc để xem tất cả dự án." : "Tạo brief đầu tiên để bắt đầu tìm người phù hợp."}</p>{hasActiveFilter ? <Button onClick={() => { setFilter("all"); setQuery(""); }} sx={{ mt: 2 }}>Xóa bộ lọc</Button> : <Button component={Link} to="/business/projects/new" variant="contained" startIcon={<Plus size={16} />} sx={{ mt: 3 }}>Tạo dự án đầu tiên</Button>}</div>}
    </section>
  </Box>;
}
