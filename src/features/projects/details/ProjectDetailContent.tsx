import { useState } from "react";
import { Link } from "react-router";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { ArrowRight, Bookmark, CalendarDays, Camera, Clock3, Hourglass, MapPin, Monitor, Send, Share2, Store, Wallet, X } from "lucide-react";
import type { Project } from "@/lib/types/project.types";
import { formatBudget } from "@/lib/util/formatters";
import { ProjectDetailBody } from "./ProjectDetailBody";
import { ProjectDetailSidebar } from "./ProjectDetailSidebar";
export function ProjectDetailContent({ project, projects, applied, saved, onApply, onSave }: {
    project: Project;
    projects: Project[];
    applied: boolean;
    saved: boolean;
    onApply: (id: string) => void;
    onSave: (id: string) => void;
}) {
    const [notice, setNotice] = useState("");
    const [preview, setPreview] = useState<"brief" | "image" | "company" | null>(null);
    const details = project.details;
    const related = projects.filter((item) => item.id !== project.id).sort((a, b) => Number(b.type === project.type) - Number(a.type === project.type)).slice(0, 2);
    async function share() {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setNotice("Đã sao chép liên kết dự án.");
        }
        catch {
            setNotice("Không thể sao chép tự động. Bạn có thể sao chép địa chỉ trang trên trình duyệt.");
        }
    }
    return <div className="project-page-grid">
    <div className="project-page-main">
      <section className="project-page-card project-page-summary" aria-labelledby="detail-title">
        <div className="project-page-kicker"><span className="detail-category">{project.category}</span><span className="project-page-open">Đang nhận ứng tuyển</span><span className="project-page-age"><Clock3 size={14}/> Đăng {project.age} ngày trước · Cập nhật gần đây</span></div>
        <h1 id="detail-title" tabIndex={-1}>{project.title}<span>.</span></h1>
        <div className="project-page-company"><strong><Store />{project.company}</strong><span>·</span><span><MapPin />{project.city}</span><span>·</span><span><CalendarDays />Hạn chót: {project.deadline}</span></div>
        <div className="project-page-metrics">
          <div className="project-page-metric"><i><Wallet /></i><div><span>Ngân sách dự kiến</span><strong>{formatBudget(project)}</strong></div></div>
          <div className="project-page-metric"><i><Monitor /></i><div><span>Hình thức cộng tác</span><strong>{project.remote ? "Làm việc từ xa" : "Làm việc tại chỗ"}</strong></div></div>
          <div className="project-page-metric"><i><Hourglass /></i><div><span>Thời lượng thực hiện</span><strong>{project.duration} dự kiến</strong></div></div>
        </div>
        <div className="project-page-summary-actions">
          <button className="detail-primary" disabled={applied} onClick={() => onApply(project.id)}><Send size={18}/>{applied ? "Đã ứng tuyển dự án" : "Ứng tuyển dự án này"}</button>
          <button className="detail-secondary" aria-pressed={saved} onClick={() => onSave(project.id)}><Bookmark size={18} fill={saved ? "currentColor" : "none"}/>{saved ? "Đã lưu dự án" : "Lưu dự án"}</button>
          <button className="detail-icon" aria-label="Chia sẻ bài tuyển" onClick={share}><Share2 size={18}/></button>
        </div>
        {notice && <p className="detail-notice" role="status">{notice}</p>}
      </section>
      {details?.heroImage && <figure className="detail-banner"><img src={details.heroImage} alt={details.heroAlt}/><figcaption><div><small>BỐI CẢNH DỰ ÁN</small><strong>{details.heroCaption}</strong></div><span><Camera size={14}/> Concept ảnh thực tế</span></figcaption></figure>}
      <ProjectDetailBody project={project} details={details} onPreview={setPreview}/>
      {related.length > 0 && <section className="detail-related"><div className="detail-section-heading"><div><h2>Dự án tương tự có thể bạn quan tâm</h2><p>Khám phá thêm cơ hội cộng tác trên FREVO</p></div><Link to="/">Xem tất cả <ArrowRight size={16}/></Link></div><div className="detail-related-grid">{related.map((item) => <Link key={item.id} to={`/projects/${encodeURIComponent(item.id)}/details`} className="project-page-card"><small>{item.category}</small><h3>{item.title}</h3><p>{item.company} · {item.city}</p><div><strong>{formatBudget(item)}</strong><span>Chi tiết <ArrowRight size={15}/></span></div></Link>)}</div></section>}
    </div>
    <ProjectDetailSidebar project={project} details={details} onCompany={() => setPreview("company")}/>
    <Dialog open={preview !== null} onClose={() => setPreview(null)} fullWidth maxWidth="sm"><DialogTitle sx={{ pr: 7 }}>{preview === "company" ? project.company : details?.documents.find((document) => document.kind === preview)?.title ?? "Tài liệu tham khảo"}<IconButton aria-label="Đóng xem trước" onClick={() => setPreview(null)} sx={{ position: "absolute", right: 12, top: 12 }}><X /></IconButton></DialogTitle><DialogContent>{preview === "image" ? <img src={details?.heroImage} alt={details?.heroAlt ?? "Ảnh tham khảo dự án"} style={{ width: "100%", borderRadius: 16 }}/> : <>{(details?.intro ?? [project.description]).map((text) => <p key={text}>{text}</p>)}<p>Nội dung doanh nghiệp minh họa trong prototype FREVO.</p></>}</DialogContent></Dialog>
  </div>;
}
