import type { Project } from "@/lib/types/project.types";
import { Box, Button } from "@mui/material";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import { formatBudget } from "@/lib/util/formatters";
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
      <Box className="project-card-actions" sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 1.5, position: "absolute", top: 20, right: 20 }}>
        <BookmarkButton project={project} saved={saved} onToggle={onSave} />
        <Button
          component={Link}
          to={`/projects/${encodeURIComponent(project.id)}/details`}
          variant="outlined"
          endIcon={<ArrowUpRight size={17} aria-hidden="true" />}
          aria-label={`Xem thêm về ${project.title}`}
          sx={{
            minHeight: 44, px: 2.5, fontSize: 14, whiteSpace: "nowrap",
            borderColor: "primary.dark", color: "primary.dark",
            transition: "background-color 160ms ease-out, color 160ms ease-out, transform 160ms ease-out",
            "& .MuiButton-endIcon": { transition: "transform 160ms ease-out" },
            "&:hover, &:focus-visible": {
              borderColor: "primary.dark", bgcolor: "primary.dark", color: "primary.contrastText",
              "& .MuiButton-endIcon": { transform: "translate(2px, -2px)" },
            },
            "&:active": { transform: "scale(0.98)" },
            "@media (prefers-reduced-motion: reduce)": {
              transition: "none", "& .MuiButton-endIcon": { transition: "none" },
              "&:hover .MuiButton-endIcon, &:focus-visible .MuiButton-endIcon, &:active": { transform: "none" },
            },
          }}
        >
          Xem thêm
        </Button>
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
      <div className="card-bottom">
        <dl className="card-facts flex">
          <div>
            <dt>Ngân sách</dt>
            <dd>{formatBudget(project)}</dd>
          </div>
          <div>
            <dt>Hạn ứng tuyển</dt>
            <dd>{project.deadline}</dd>
          </div>
        </dl>
        <ul className="skill-list flex flex-wrap">
          {project.skills.map((skill) => (
            <li key={skill}>{skill}</li>
          ))}
        </ul>
      </div>

    </article>
  );
}
