import type { Project } from "@/lib/types/project.types";
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
      <BookmarkButton project={project} saved={saved} onToggle={onSave} />
      <button
        className="card-more"
        type="button"
        disabled={!selected}
        onClick={() => onSelect(project.id)}
      >
        Xem thêm
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
