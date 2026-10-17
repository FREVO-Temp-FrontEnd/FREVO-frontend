import { useState } from "react";
import { Check, CheckCircle2, FileText, Image, ShieldCheck } from "lucide-react";
import type { Project, ProjectDetails } from "@/lib/types/project.types";
const sections = [["overview", "Tổng quan"], ["brief", "Brief dự án"], ["scope", "Phạm vi công việc"], ["requirements", "Yêu cầu"], ["deliverables", "Bàn giao"], ["benefits", "Quyền lợi"], ["documents", "Tài liệu"]];
export function ProjectDetailBody({ project, details, onPreview }: {
    project: Project;
    details?: ProjectDetails;
    onPreview: (view: "brief" | "image") => void;
}) {
    const [activeSection, setActiveSection] = useState("overview");
    const deliverables = details?.deliverables ?? project.deliverables.map((title) => ({ title, text: "" }));
    return (<article className="project-page-card detail-editorial">
        <nav className="detail-tabs" aria-label="Nội dung dự án">{sections.filter(([id]) => details || !["benefits", "documents"].includes(id)).map(([id, label]) => <a key={id} href={`#${id}`} aria-current={activeSection === id ? "location" : undefined} onClick={() => setActiveSection(id)}>{label}</a>)}</nav>
        <section id="overview"><h2>Tổng quan tiêu chí</h2><div className="detail-overview">
          <div><h3>Chuyên môn cần có</h3><div className="detail-tags">{(details?.expertise ?? project.skills).map((skill) => <span key={skill}>{skill}</span>)}</div></div>
          <div><h3>{details ? "Công cụ chính" : "Hình thức cộng tác"}</h3>{details ? <div className="detail-tags">{details.tools.map((tool) => <span key={tool}>{tool}</span>)}</div> : <p>{project.remote ? "Làm việc từ xa" : "Làm việc tại chỗ"} · {project.city}</p>}</div>
          <div><h3>Kinh nghiệm {details ? "tối thiểu" : "phù hợp"}</h3><p>{details?.experience ?? `Có portfolio thể hiện năng lực ${project.category}.`}</p></div>
          <div><h3>Đối tượng phù hợp</h3><p>{details?.audience ?? "Freelancer hoặc studio phù hợp với dự án."}</p></div>
        </div></section>
        <section id="brief"><h2>Giới thiệu dự án & Tinh thần cốt lõi</h2>{(details?.intro ?? [project.description]).map((text) => <p className="detail-prose" key={text}>{text}</p>)}</section>
        <section id="scope"><h2>Phạm vi công việc</h2><ol className="detail-scope">{(details?.scope ?? project.deliverables.map((title) => ({ title, text: "" }))).map((item, index) => <li key={item.title}><span>{index + 1}</span><p><strong>{item.title}</strong> {item.text}</p></li>)}</ol></section>
        <section id="requirements"><h2>Yêu cầu năng lực</h2><div className="detail-requirements">{(details?.requirements ?? [`Có portfolio phù hợp với lĩnh vực ${project.category}.`, `Có thể thực hiện và bàn giao trong ${project.duration}.`]).map((text) => <div key={text}><CheckCircle2 size={22}/><p>{text}</p></div>)}</div></section>
        <section id="deliverables"><div className="detail-section-heading"><h2>Hạng mục sản phẩm bàn giao</h2><small>{deliverables.length} hạng mục chính</small></div><ul className="detail-deliverables">{deliverables.map((item) => <li key={item.title}><Check size={16}/><div><strong>{item.title}</strong>{item.text && <p>{item.text}</p>}</div></li>)}</ul></section>
        {details && <><section id="benefits"><h2>Quyền lợi & Lộ trình thanh toán</h2><div className="detail-benefits"><strong><ShieldCheck size={20}/>{details.benefits.title}</strong><div className="detail-payments">{details.benefits.payments.map((payment) => <div key={payment.label}><small>{payment.label}</small><h3>{payment.title}</h3><p>{payment.description}</p></div>)}</div><p>* {details.benefits.note}</p></div></section>
        <section id="documents"><h2>Tài liệu tham khảo</h2>{details.documents.map((document) => <div className="detail-document" key={document.title}>{document.kind === "brief" ? <FileText /> : <Image />}<div><strong>{document.title}</strong><small>{document.description}</small></div><button onClick={() => onPreview(document.kind)}>{document.kind === "image" ? "Xem ảnh" : "Xem trước"}</button></div>)}<p className="detail-footnote">Nội dung minh họa dành cho prototype FREVO.</p></section></>}
      </article>);
}
