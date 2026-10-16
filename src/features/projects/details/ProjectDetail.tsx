import { Button } from "@/app/shared/components/ui/button";
import type { Project } from "@/lib/types/project.types";
import { formatBudget } from "@/lib/util/formatters";
import { BookmarkButton } from "../dashboard/BookmarkButton";

interface ProjectDetailProps {
  project: Project;
  saved: boolean;
  applied: boolean;
  onSave: (id: string) => void;
  onApply: (id: string) => void;
}

export function ProjectDetail({
  project,
  saved,
  applied,
  onSave,
  onApply,
}: ProjectDetailProps) {
  return (
    <article className="detail-card">
      <div className="detail-hero">
        <span className="category-text">{project.category}</span>
        <h2 id="detail-title" tabIndex={-1}>
          {project.title}
        </h2>
        <p className="detail-company">
          {project.company} · {project.city} ·{" "}
          {project.remote ? "Làm việc từ xa" : "Làm việc tại chỗ"}
        </p>
      </div>
      <dl className="detail-stats grid grid-cols-3">
        <div>
          <dt>Ngân sách</dt>
          <dd>{formatBudget(project)}</dd>
        </div>
        <div>
          <dt>Thời lượng</dt>
          <dd>{project.duration}</dd>
        </div>
        <div>
          <dt>Hạn ứng tuyển</dt>
          <dd>{project.deadline}</dd>
        </div>
      </dl>
      <div className="detail-body">
        <section className="detail-section">
          <h3>MÔ TẢ</h3>
          <p>{project.description}</p>
        </section>
        <section className="detail-section">
          <h3>KỸ NĂNG</h3>
          <ul className="skill-list detail-skills flex flex-wrap">
            {project.skills.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </section>
        <section className="detail-section">
          <h3>SẢN PHẨM BÀN GIAO</h3>
          <ul className="deliverables">
            {project.deliverables.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>
      <div className="detail-actions flex items-center">
        {applied ? (
          <p className="applied-message">✓ Bạn đã ứng tuyển dự án này</p>
        ) : (
          <Button
            className="primary-button"
            type="button"
            onClick={() => onApply(project.id)}
          >
            Ứng tuyển dự án
          </Button>
        )}
        <BookmarkButton project={project} saved={saved} onToggle={onSave} />
      </div>
    </article>
  );
}
