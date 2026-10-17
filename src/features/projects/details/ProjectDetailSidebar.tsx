import { ArrowRight, BadgeCheck, ShieldCheck, Star } from "lucide-react";
import type { Project, ProjectDetails } from "@/lib/types/project.types";
import { formatBudget } from "@/lib/util/formatters";
export function ProjectDetailSidebar({ project, details, onCompany }: {
    project: Project;
    details?: ProjectDetails;
    onCompany: () => void;
}) {
    return (<aside className="project-page-aside" aria-label="Thông tin doanh nghiệp và hợp tác">
      <section className="project-page-card project-page-employer"><div className="project-page-employer-head"><span className="project-page-monogram">{details?.employer.monogram ?? project.company.split(" ").slice(0, 2).map((word) => word[0]).join("")}</span><div><h2>{project.company} {details?.employer.verified && <BadgeCheck size={17}/>}</h2><p>{details?.employer.industry ?? project.category}</p></div></div>
        {details?.employer.description && <p>{details.employer.description}</p>}
        <dl className="project-page-facts"><div><dt>Địa điểm:</dt><dd>{project.city}</dd></div>{details && <><div><dt>Quy mô nhân sự:</dt><dd>{details.employer.teamSize}</dd></div><div><dt>Dự án trên FREVO:</dt><dd>{details.employer.completedProjects}</dd></div><div><dt>Đánh giá từ Freelancer:</dt><dd><Star size={14}/>{details.employer.rating}</dd></div></>}</dl>
        {details && <button className="detail-secondary detail-wide" onClick={onCompany}>Xem hồ sơ doanh nghiệp <ArrowRight size={16}/></button>}
      </section>
      <section className="project-page-card"><h2>Thông tin hợp tác</h2><dl className="project-page-facts"><div><dt>Loại dự án:</dt><dd>{project.category}</dd></div>{details?.hiringCount && <div><dt>Số lượng tuyển:</dt><dd>{details.hiringCount}</dd></div>}<div><dt>Hình thức làm việc:</dt><dd>{project.remote ? "Từ xa (Remote 100%)" : "Tại chỗ"}</dd></div><div><dt>Thời lượng dự kiến:</dt><dd>{project.duration}</dd></div><div><dt>Khoảng ngân sách:</dt><dd className="detail-orange">{formatBudget(project)}</dd></div><div><dt>Hạn ứng tuyển:</dt><dd>{project.deadline}</dd></div></dl></section>
      <section className="project-page-card"><div className="detail-section-heading"><h2>Tiến độ dự kiến</h2>{details && <small>{details.timeline.length} cột mốc</small>}</div><ol className="detail-timeline">{(details?.timeline ?? [{ date: project.deadline, title: "Hạn chót nộp hồ sơ ứng tuyển", description: "Gửi portfolio và đề xuất của bạn trước thời hạn." }]).map((milestone) => <li key={milestone.title}><time>{milestone.date}</time><h3>{milestone.title}</h3><p>{milestone.description}</p></li>)}</ol></section>
      {details && <div className="detail-trust"><ShieldCheck size={25}/><div><strong>{details.benefits.trustTitle}</strong><p>{details.benefits.trustDescription}</p></div></div>}
    </aside>);
}
