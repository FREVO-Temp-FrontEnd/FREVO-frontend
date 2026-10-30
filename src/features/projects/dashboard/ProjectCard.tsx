import type { Project } from "@/lib/types/project.types";
import { Box, Button } from "@mui/material";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import { formatBudget } from "@/lib/utils/formatters";
import { BookmarkButton } from "./BookmarkButton";

interface ProjectCardProps {
  project: Project;
  selected: boolean;
  saved: boolean;
  applied: boolean;
  onSelect: (id: string) => void;
  onSave: (id: string) => void;
}

export function ProjectCard({
  project,
  selected,
  saved,
  applied,
  onSelect,
  onSave,
}: ProjectCardProps) {
  return (
    <article className={`project-card interactive-card ${selected ? "selected" : ""}`}>
      <Box className="project-card-actions" sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", position: "absolute", top: 20, right: 20 }}>
        <BookmarkButton project={project} saved={saved} onToggle={onSave} />
      </Box>
      <button
        className="card-main"
        type="button"
        aria-pressed={selected}
        aria-label={project.title}
        onClick={() => onSelect(project.id)}
      >
        <span className="card-top flex items-center">
          <span className={`category-pill ${project.type}`}>{project.category}</span>
          {applied && <span className="applied-pill">✓ Đã ứng tuyển</span>}
          <span className="age">{project.age} ngày trước</span>
        </span>
        <h3>{project.title}</h3>
        <span className="card-company">
          {project.company} · {project.city} · {project.remote ? "Từ xa" : "Tại chỗ"}
        </span>
      </button>
      <dl className="card-facts">
        <div>
          <dt>Ngân sách</dt>
          <dd>{formatBudget(project)}</dd>
        </div>
        <div>
          <dt>Hạn ứng tuyển</dt>
          <dd>{project.deadline}</dd>
        </div>
        <div>
          <dt>Thời lượng</dt>
          <dd>{project.duration}</dd>
        </div>
      </dl>
      <div className="card-bottom">
        <ul className="skill-list flex flex-wrap">
          {project.skills.map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>
        <Button
          component={Link}
          to={`/projects/${encodeURIComponent(project.id)}/details`}
          endIcon={<ArrowUpRight size={16} aria-hidden="true" />}
          aria-label={`Xem chi tiết dự án ${project.title}`}
          sx={{ minHeight: 44, px: 1.5, fontSize: 14, whiteSpace: "nowrap", flexShrink: 0, color: "primary.dark", "&:hover": { bgcolor: "#fff0e9" } }}
        >
          Xem chi tiết
        </Button>
      </div>

    </article>
  );
}
