import { Link } from "react-router";
import { ArrowRight, FolderOpen, Search, SlidersHorizontal } from "lucide-react";
import { Box, Button, Card, Chip, InputAdornment, MenuItem, TextField, Typography } from "@mui/material";
import { useBusiness } from "@/lib/hooks/useBusiness";
import type { ProjectBrief, ProjectStatus } from "@/lib/types/marketplace.types";
import { useProjectList, type ProjectFilter, type ProjectSort } from "@/features/business/hooks/useProjectList";

const filters: { value: ProjectFilter; label: string }[] = [
  { value: "all", label: "Tất cả" },
  { value: "published", label: "Đang tuyển" },
  { value: "ongoing", label: "Đang tiến hành" },
  { value: "draft", label: "Bản nháp" },
  { value: "closed", label: "Đã đóng" },
  { value: "completed", label: "Hoàn thành" },
];

const statusStyles: Record<ProjectStatus, { label: string; background: string; color: string; dot: string }> = {
  published: { label: "Đang tuyển", background: "#e8f7ef", color: "#16805b", dot: "#18a773" },
  ongoing: { label: "Đang tiến hành", background: "#eaf4fb", color: "#176c9a", dot: "#278cc2" },
  draft: { label: "Bản nháp", background: "#f2f2ef", color: "#62645e", dot: "#92958e" },
  closed: { label: "Đã đóng tuyển", background: "#f3efed", color: "#795e55", dot: "#a98a7d" },
  completed: { label: "Đã hoàn thành", background: "#e8f7ef", color: "#16805b", dot: "#18a773" },
};

function ProjectCard({ project, candidateCount, executorName }: {
  project: ProjectBrief;
  candidateCount: number;
  executorName?: string;
}) {
  const isDraft = project.status === "draft";
  const isRecruiting = project.status === "published";
  const isOngoing = project.status === "ongoing";
  const status = statusStyles[project.status];
  const deadlineLabel = isRecruiting ? "Hạn nhận hồ sơ" : isDraft ? "Hạn mong muốn" : "Hạn hoàn thành";
  const deadline = isRecruiting ? project.applicationDeadline || project.deadline : project.deadline;

  return (
    <Card
      component="article"
      variant="outlined"
      sx={{
        display: "flex", flexDirection: "column", minWidth: 0, minHeight: 315,
        p: { xs: 2.25, sm: 3 }, borderColor: "divider", borderRadius: "16px",
        boxShadow: "none", bgcolor: "background.paper",
        transition: "border-color 150ms ease, box-shadow 150ms ease",
        "&:hover": { borderColor: "#d3d6d0", boxShadow: "0 8px 24px rgba(32,32,31,0.05)" },
        "@media (prefers-reduced-motion: reduce)": { transition: "none" },
      }}
    >
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Chip label={project.category} size="small" sx={{ bgcolor: "#f2f3f0", color: "#62645e", fontFamily: '"Be Vietnam Pro", sans-serif', fontSize: 11, fontWeight: 600 }} />
        <Chip
          label={status.label}
          size="small"
          icon={<Box component="span" sx={{ display: "block", width: 6, height: 6, ml: 1, borderRadius: "50%", bgcolor: status.dot }} />}
          sx={{ bgcolor: status.background, color: status.color, fontFamily: '"Be Vietnam Pro", sans-serif', fontSize: 11, fontWeight: 700, "& .MuiChip-icon": { mr: 0.5 } }}
        />
      </div>

      <Typography component="h2" sx={{ fontFamily: "Archivo, Arial, sans-serif", fontSize: { xs: 19, sm: 20 }, fontWeight: 700, lineHeight: 1.3, mb: 1 }}>
        {project.title}
      </Typography>
      <Typography sx={{
        color: "text.secondary", fontFamily: '"Be Vietnam Pro", sans-serif', fontSize: 13, lineHeight: 1.7,
        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", mb: 3,
      }}>
        {project.description || "Dự án chưa có mô tả. Hãy hoàn thiện brief trước khi đăng tuyển."}
      </Typography>

      <div className="mt-auto grid grid-cols-2 gap-x-4 gap-y-4 rounded-xl bg-[#f7f8f6] px-4 py-3 sm:grid-cols-3">
        <div className="min-w-0">
          <Typography sx={{ color: "text.secondary", fontFamily: '"Be Vietnam Pro", sans-serif', fontSize: 11, mb: 0.5 }}>Ngân sách</Typography>
          <Typography sx={{ color: "primary.dark", fontFamily: '"Be Vietnam Pro", sans-serif', fontSize: 12, fontWeight: 700, overflowWrap: "anywhere" }}>{project.budget || "Chưa đặt"}</Typography>
        </div>
        <div className="min-w-0">
          <Typography sx={{ color: "text.secondary", fontFamily: '"Be Vietnam Pro", sans-serif', fontSize: 11, mb: 0.5 }}>{deadlineLabel}</Typography>
          <Typography sx={{ color: "text.primary", fontFamily: '"Be Vietnam Pro", sans-serif', fontSize: 12, fontWeight: 700 }}>{deadline || "Chưa đặt"}</Typography>
        </div>
        <div className="col-span-2 min-w-0 sm:col-span-1">
          <Typography sx={{ color: "text.secondary", fontFamily: '"Be Vietnam Pro", sans-serif', fontSize: 11, mb: 0.5 }}>
            {isOngoing || project.status === "completed" ? "Người thực hiện" : isDraft ? "Tình trạng" : "Ứng viên"}
          </Typography>
          <Typography sx={{ color: "text.primary", fontFamily: '"Be Vietnam Pro", sans-serif', fontSize: 12, fontWeight: 700, overflowWrap: "anywhere" }}>
            {isOngoing || project.status === "completed" ? executorName || "Chưa cập nhật" : isDraft ? "Chưa đăng tuyển" : `${candidateCount} hồ sơ`}
          </Typography>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#e4e6e2] pt-4">
        <Typography sx={{ color: "text.secondary", fontFamily: '"Be Vietnam Pro", sans-serif', fontSize: 11 }}>
          {isDraft ? "Bản nháp chưa hiển thị cho freelancer" : isRecruiting ? "Đang nhận hồ sơ ứng tuyển" : isOngoing ? "Đã chọn người thực hiện" : "Không còn nhận hồ sơ"}
        </Typography>
        <Button
          component={Link}
          to={isDraft ? `/business/projects/${project.id}/edit` : `/business/projects/${project.id}`}
          endIcon={<ArrowRight size={16} />}
          sx={{ flexShrink: 0, px: 0, minWidth: 0, "&&": { color: "primary.dark", fontFamily: '"Be Vietnam Pro", sans-serif', fontSize: 12, fontWeight: 700 }, "&&:hover": { bgcolor: "transparent", textDecoration: "underline" } }}
        >
          {isDraft ? "Tiếp tục brief" : "Xem dự án"}
        </Button>
      </div>
    </Card>
  );
}

export function MyProjectsPage() {
  const { projects, candidates, talents } = useBusiness();
  const { filter, setFilter, query, setQuery, sort, setSort, counts, candidateCounts, visibleProjects } = useProjectList(projects, candidates);
  const activeFilters = filters.filter((item) => item.value !== "completed" || counts.completed > 0);
  const hasActiveFilter = filter !== "all" || query.trim().length > 0;

  return (
    <Box sx={{ fontFamily: '"Be Vietnam Pro", sans-serif' }}>
      <div className="mb-8">
        <Typography sx={{ color: "primary.dark", fontFamily: '"Be Vietnam Pro", sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: "0.11em", mb: 0.75 }}>QUẢN LÝ DỰ ÁN</Typography>
        <Typography component="h1" sx={{ color: "text.primary", fontFamily: "Archivo, Arial, sans-serif", fontSize: { xs: 32, sm: 42 }, fontWeight: 800, lineHeight: 1.15, letterSpacing: "-0.03em" }}>
          Dự án của tôi<span className="text-[#f4490b]">.</span>
        </Typography>
        <Typography sx={{ mt: 1.25, color: "text.secondary", fontFamily: '"Be Vietnam Pro", sans-serif', fontSize: { xs: 13, sm: 14 }, lineHeight: 1.65, maxWidth: 650 }}>
          Theo dõi brief, hồ sơ ứng tuyển và tiến độ hợp tác trong từng dự án.
        </Typography>
      </div>

      <div className="mb-5 flex flex-col gap-4">
        <div role="group" aria-label="Lọc trạng thái dự án" className="flex max-w-full gap-1 overflow-x-auto rounded-full border border-[#e4e6e2] bg-white p-1 sm:w-fit">
          {activeFilters.map((item) => (
            <Button
              key={item.value}
              type="button"
              aria-pressed={filter === item.value}
              onClick={() => setFilter(item.value)}
              sx={{
                flexShrink: 0, minHeight: 36, px: 1.75, py: 0.75, borderRadius: 999,
                "&&": {
                  color: filter === item.value ? "#fff" : "#62645e",
                  bgcolor: filter === item.value ? "#f4490b" : "transparent",
                  fontFamily: '"Be Vietnam Pro", sans-serif', fontSize: 12,
                  fontWeight: filter === item.value ? 700 : 600, textTransform: "none",
                },
                "&&:hover": {
                  color: filter === item.value ? "#fff" : "#bd3d14",
                  bgcolor: filter === item.value ? "#bd3d14" : "#fff0e9",
                },
                "&&:focus-visible": { outline: "2px solid #f4490b", outlineOffset: 2 },
              }}
            >
              {item.label}
              <span className={`ml-2 rounded-full px-1.5 py-0.5 text-[10px] leading-none ${filter === item.value ? "bg-white/20 text-white" : "bg-[#f2f3f0] text-[#62645e]"}`}>{counts[item.value]}</span>
            </Button>
          ))}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <TextField
            size="small"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tìm dự án theo tên hoặc lĩnh vực"
            aria-label="Tìm dự án theo tên hoặc lĩnh vực"
            slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search size={18} /></InputAdornment> } }}
            sx={{ width: { xs: "100%", sm: 350 }, "& .MuiOutlinedInput-root": { bgcolor: "#fff", borderRadius: 999, height: 44 }, "&& .MuiInputBase-input": { fontFamily: '"Be Vietnam Pro", sans-serif', fontSize: 12 } }}
          />
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="shrink-0 text-[#747773]" aria-hidden="true" />
            <TextField
              select size="small" label="Sắp xếp" value={sort}
              onChange={(event) => setSort(event.target.value as ProjectSort)}
              sx={{ minWidth: { xs: 0, sm: 210 }, flex: { xs: 1, sm: "none" }, "& .MuiOutlinedInput-root": { bgcolor: "#fff", borderRadius: 999, height: 44 }, "&& .MuiSelect-select": { fontFamily: '"Be Vietnam Pro", sans-serif', fontSize: 12 }, "&& .MuiInputLabel-root": { fontFamily: '"Be Vietnam Pro", sans-serif', fontSize: 12 } }}
            >
              <MenuItem value="newest">Mới nhất</MenuItem>
              <MenuItem value="deadline">Hạn gần nhất</MenuItem>
              <MenuItem value="budget">Ngân sách cao nhất</MenuItem>
              <MenuItem value="applicants">Nhiều hồ sơ nhất</MenuItem>
            </TextField>
          </div>
        </div>
      </div>

      {visibleProjects.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {visibleProjects.map((project) => {
            const selectedCandidate = candidates.find((candidate) => candidate.projectId === project.id && candidate.status === "selected");
            const executor = talents.find((talent) => talent.id === (project.selectedTalentId || selectedCandidate?.talentId));
            return <ProjectCard key={project.id} project={project} candidateCount={candidateCounts.get(project.id) ?? 0} executorName={executor?.name} />;
          })}
        </div>
      ) : (
        <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: "16px", bgcolor: "background.paper", px: 3, py: 7, textAlign: "center" }}>
          {hasActiveFilter ? <Search size={30} className="mx-auto mb-3 text-[#747773]" aria-hidden="true" /> : <FolderOpen size={30} className="mx-auto mb-3 text-[#747773]" aria-hidden="true" />}
          <Typography component="h2" sx={{ fontFamily: "Archivo, Arial, sans-serif", fontSize: 18, fontWeight: 700, mb: 1 }}>
            {hasActiveFilter ? "Không tìm thấy dự án phù hợp" : "Chưa có dự án nào"}
          </Typography>
          <Typography sx={{ color: "text.secondary", fontFamily: '"Be Vietnam Pro", sans-serif', fontSize: 13, mb: hasActiveFilter ? 2 : 0 }}>
            {hasActiveFilter ? "Thử từ khóa khác hoặc xóa bộ lọc để xem tất cả dự án." : "Bạn có thể đăng dự án từ thanh điều hướng Business."}
          </Typography>
          {hasActiveFilter && <Button type="button" onClick={() => { setFilter("all"); setQuery(""); }} sx={{ color: "primary.dark", "&&": { fontFamily: '"Be Vietnam Pro", sans-serif', fontSize: 12, fontWeight: 700 } }}>Xem tất cả dự án</Button>}
        </Box>
      )}
    </Box>
  );
}
