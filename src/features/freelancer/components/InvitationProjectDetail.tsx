import type { Invitation, ProjectBrief } from "@/lib/types/marketplace.types";

interface InvitationProjectDetailProps {
  invitation: Invitation;
  project: ProjectBrief;
}

export function InvitationProjectDetail({ invitation, project }: InvitationProjectDetailProps) {
  return (
    <article className="detail-card">
      <div className="detail-hero">
        <span className="category-text">{project.category}</span>
        <h2 id="invitation-detail-title" tabIndex={-1}>{project.title}</h2>
        <p className="detail-company">{project.company}{project.city ? ` · ${project.city}` : ""} · {project.remote ? "Làm việc từ xa" : "Làm việc tại chỗ"}</p>
      </div>
      <dl className="detail-stats grid grid-cols-3">
        <div><dt>Ngân sách</dt><dd>{project.budget}</dd></div>
        <div><dt>Thời lượng</dt><dd>{project.duration}</dd></div>
        <div><dt>Phản hồi trước</dt><dd>{new Date(invitation.expiresAt).toLocaleDateString("vi-VN")}</dd></div>
      </dl>
      <div className="detail-body">
        {invitation.note && <section className="detail-section"><h3>LỜI NHẮN</h3><p>“{invitation.note}”</p></section>}
        <section className="detail-section"><h3>MÔ TẢ</h3><p>{project.description}</p></section>
        {project.skills.length > 0 && <section className="detail-section"><h3>KỸ NĂNG</h3><ul className="skill-list detail-skills flex flex-wrap">{project.skills.map((skill) => <li key={skill}>{skill}</li>)}</ul></section>}
        {project.deliverables.length > 0 && <section className="detail-section"><h3>SẢN PHẨM BÀN GIAO</h3><ul className="deliverables">{project.deliverables.map((item) => <li key={item}>{item}</li>)}</ul></section>}
      </div>
    </article>
  );
}
