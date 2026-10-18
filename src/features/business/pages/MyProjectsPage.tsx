import { useState } from "react";
import { Link } from "react-router";
import { Plus, Search, ArrowRight, FolderOpen } from "lucide-react";
import { useBusiness } from "@/lib/hooks/useBusiness";
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

export function MyProjectsPage() {
  const { projects, candidates, talents } = useBusiness();
  const [filter, setFilter] = useState<string>("all");
  const [query, setQuery] = useState<string>("");

  const visible = projects.filter((project) => {
    const matchesFilter = filter === "all" || project.status === filter;
    const matchesQuery = `${project.title} ${project.category}`
      .toLowerCase()
      .includes(query.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  return (
    <>
      <div className="fb-page-heading">
        <div>
          <span className="fb-eyebrow">QUẢN LÝ DỰ ÁN</span>
          <h1>
            Dự án của tôi<span className="fb-dot">.</span>
          </h1>
          <p>Theo dõi brief, ứng viên, hội thoại và hợp đồng trong từng dự án.</p>
        </div>
        <div className="fb-heading-action">
          <Link className="fb-button fb-button-primary" to="/business/projects/new">
            <Plus size={18} /> Tạo dự án mới
          </Link>
        </div>
      </div>

      <div className="fb-toolbar">
        <div className="fb-segmented" role="group" aria-label="Lọc trạng thái dự án">
          {[
            ["all", "Tất cả"],
            ["published", "Đang tuyển"],
            ["ongoing", "Đang tiến hành"],
            ["draft", "Bản nháp"],
            ["closed", "Đã đóng"],
          ].map(([value, label]) => (
            <button
              type="button"
              key={value}
              className={filter === value ? "active" : ""}
              aria-pressed={filter === value}
              onClick={() => setFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>

        <label className="fb-search">
          <Search size={17} />
          <span className="sr-only">Tìm dự án</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm dự án theo tên hoặc lĩnh vực"
          />
        </label>
      </div>

      {visible.length > 0 ? (
        <div className="fb-project-grid">
          {visible.map((project: ProjectBrief) => {
            const projectCandidates = candidates.filter((c) => c.projectId === project.id);
            const count = projectCandidates.length;
            const selected = projectCandidates.find((c) => c.status === "selected");
            const selectedTalent = selected
              ? talents.find((t) => t.id === selected.talentId)
              : undefined;

            const badgeTone =
              project.status === "published" || project.status === "ongoing"
                ? "green"
                : project.status === "closed"
                ? "neutral"
                : "soft";

            return (
              <article className="fb-project-card" key={project.id}>
                <div className="fb-card-top">
                  <span className={`fb-badge fb-badge-${badgeTone}`}>
                    {statusLabel(project.status)}
                  </span>
                  <span>{project.category}</span>
                </div>
                <h2>{project.title}</h2>
                <p>{project.description}</p>
                <div className="fb-project-metrics">
                  <div>
                    <strong>{project.budget}</strong>
                    <span>Ngân sách</span>
                  </div>
                  <div>
                    <strong>{selectedTalent ? selectedTalent.name : count}</strong>
                    <span>{selectedTalent ? "Người thực hiện" : "Ứng viên"}</span>
                  </div>
                  <div>
                    <strong>{project.deadline || "Chưa đặt"}</strong>
                    <span>Hạn hoàn thành</span>
                  </div>
                </div>
                <Link
                  to={
                    project.status === "draft"
                      ? `/business/projects/${project.id}/edit`
                      : `/business/projects/${project.id}`
                  }
                  className="fb-card-link"
                >
                  {project.status === "draft" ? "Tiếp tục brief" : "Xem dự án"}
                  <ArrowRight size={17} />
                </Link>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="fb-empty">
          <FolderOpen size={32} strokeWidth={1.6} aria-hidden="true" />
          <h3>Không tìm thấy dự án</h3>
          <p>Thử tìm kiếm với từ khóa khác hoặc chuyển sang tab trạng thái khác.</p>
        </div>
      )}
    </>
  );
}
