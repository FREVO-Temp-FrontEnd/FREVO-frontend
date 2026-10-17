import { useEffect, useState, type FormEvent } from "react";
import { Link, useLocation } from "react-router";
import { ArrowRight, BriefcaseBusiness, Check, ChevronDown, Clock3, FolderOpen, Plus, Search, Sparkles, Users, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/app/shared/components/ui/dialog";
import { sampleProjects, type Project } from "./business-demo-data";
import "./business-workspace.css";

function initialProjects(storageKey: string, isNewPreview: boolean): Project[] {
  try {
    const stored = sessionStorage.getItem(storageKey);
    if (stored) return (JSON.parse(stored) as (Project & { pendingApplications?: number })[]).map(project => ({ ...project, unreadApplications: project.unreadApplications ?? project.pendingApplications ?? 0 }));
  } catch { /* Sample data remains available. */ }
  return isNewPreview ? [] : sampleProjects;
}

export default function BusinessWorkspace() {
  const location = useLocation();
  const isNewPreview = new URLSearchParams(location.search).get("preview") === "new";
  const previewQuery = isNewPreview ? "?preview=new" : "";
  const storageKey = isNewPreview ? "frevo-business-new-preview" : "frevo-business-sample-preview";
  const [projects, setProjects] = useState<Project[]>(() => initialProjects(storageKey, isNewPreview));
  const [projectFilter, setProjectFilter] = useState<"all" | Project["status"]>("all");
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Thiết kế thương hiệu");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Dự án của tôi | FREVO";
    return () => { document.title = previousTitle; };
  }, []);
  useEffect(() => {
    try { sessionStorage.setItem(storageKey, JSON.stringify(projects)); } catch { /* Preview works without storage. */ }
  }, [projects, storageKey]);

  const publishedCount = projects.filter(project => project.status === "published").length;
  const draftCount = projects.filter(project => project.status === "draft").length;
  const visibleProjects = projects.filter(project =>
    (projectFilter === "all" || project.status === projectFilter) &&
    (!search.trim() || `${project.title} ${project.category}`.toLocaleLowerCase("vi").includes(search.trim().toLocaleLowerCase("vi")))
  );
  function createDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!newTitle.trim()) return;
    setProjects(previous => [{ id: Date.now(), title: newTitle.trim(), category: newCategory, budget: "Chưa đặt ngân sách", status: "draft", applications: 0, unreadApplications: 0, matches: 0, updated: "Vừa lưu" }, ...previous]);
    setProjectFilter("all");
    setSearch("");
    setNewTitle("");
    setCreateOpen(false);
    setNotice("Đã tạo bản nháp minh họa trong phiên xem này.");
  }

  return <div className="bw-page">
    <a className="bw-skip" href="#bw-main">Đi đến nội dung chính</a>
    <header className="bw-header"><div className="bw-header-inner">
      <Link className="bw-brand" to={`/business/projects${previewQuery}`} aria-label="FREVO, về dự án của tôi"><img src="/assets/frevo-logo.png" alt="FREVO" /></Link>
      <span className="bw-divider" aria-hidden="true" /><span className="bw-workspace">Không gian doanh nghiệp</span>
      <nav className="bw-nav" aria-label="Điều hướng Business">
        <Link to={`/business/projects${previewQuery}`} aria-current="page">Dự án của tôi</Link>
      </nav>
      <div className="bw-account"><span>Nắng Studio<small>Tài khoản Business</small></span><b aria-label="Tài khoản minh họa Nắng Studio">N</b></div>
    </div></header>

    <main id="bw-main" className="bw-main">
        <div className="bw-heading"><div><p className="bw-eyebrow">KHÔNG GIAN DOANH NGHIỆP</p><h1>Dự án của bạn<span>.</span></h1><p>Tạo brief và theo dõi từng dự án từ lúc chuẩn bị đến khi tìm được người phù hợp.</p></div>{projects.length > 0 && <button className="bw-primary" type="button" onClick={() => setCreateOpen(true)}><Plus size={19} strokeWidth={2.3} aria-hidden="true" /> Tạo dự án mới</button>}</div>
        {projects.length > 0 ? <section className="bw-section" aria-labelledby="bw-project-title"><div className="bw-section-heading"><div><h2 id="bw-project-title">Danh sách dự án</h2><p>{publishedCount} đang tuyển <span aria-hidden="true">·</span> {draftCount} bản nháp</p></div><span>{projects.length.toString().padStart(2, "0")} dự án</span></div><div className="bw-controls"><div className="bw-filters" role="group" aria-label="Lọc dự án"><button type="button" className={projectFilter === "all" ? "active" : ""} aria-pressed={projectFilter === "all"} onClick={() => setProjectFilter("all")}>Tất cả</button><button type="button" className={projectFilter === "published" ? "active" : ""} aria-pressed={projectFilter === "published"} onClick={() => setProjectFilter("published")}>Đang tuyển</button><button type="button" className={projectFilter === "draft" ? "active" : ""} aria-pressed={projectFilter === "draft"} onClick={() => setProjectFilter("draft")}>Bản nháp</button></div><label className="bw-search"><Search size={18} aria-hidden="true" /><span className="sr-only">Tìm dự án</span><input type="search" placeholder="Tìm dự án" value={search} onChange={event => setSearch(event.target.value)} /></label></div><div className="bw-project-list">{visibleProjects.map(project => <article className="bw-project" key={project.id}><div className="bw-project-top"><span className={`bw-status ${project.status}`}><i aria-hidden="true" />{project.status === "published" ? "Đang tuyển" : "Bản nháp"}</span><small>{project.updated}</small></div><div className="bw-project-body"><span className="bw-project-icon"><BriefcaseBusiness size={23} strokeWidth={1.7} aria-hidden="true" /></span><div><h3>{project.title}</h3><p>{project.category} · {project.budget}</p></div></div><div className="bw-project-bottom"><div>{project.status === "published" ? <><span><Users size={16} aria-hidden="true" /> {project.applications} ứng viên · {project.unreadApplications} chưa đọc</span><span><Sparkles size={16} aria-hidden="true" /> {project.matches} gợi ý</span></> : <span><Clock3 size={16} aria-hidden="true" /> Chưa công bố</span>}</div><Link to={`/business/projects/${project.id}${project.status === "published" ? "/applicants" : ""}${previewQuery}`}>{project.status === "published" ? "Xem ứng viên" : "Tiếp tục brief"}<ArrowRight size={18} aria-hidden="true" /></Link></div></article>)}</div>{visibleProjects.length === 0 && <div className="bw-no-results"><FolderOpen size={30} aria-hidden="true" /><strong>Không tìm thấy dự án.</strong><p>Thử từ khóa hoặc trạng thái khác.</p></div>}</section> : <section className="bw-empty" aria-labelledby="bw-empty-title"><div className="bw-empty-art"><img src="/assets/frevo-login-illustration.png" alt="" /></div><div className="bw-empty-copy"><p className="bw-eyebrow">BẮT ĐẦU TỪ ĐÂY</p><h2 id="bw-empty-title">Bắt đầu bằng một dự án.</h2><p>Hãy viết brief đầu tiên. Khi dự án được công bố, freelancer phù hợp có thể tìm thấy và ứng tuyển.</p><button className="bw-primary" type="button" onClick={() => setCreateOpen(true)}><Plus size={18} aria-hidden="true" /> Tạo dự án đầu tiên</button></div></section>}
      <p className="bw-footnote">Bản xem trước giao diện Business. Tên, dự án và số liệu là dữ liệu minh họa.</p>
    </main>

    {notice && <div className="bw-toast" role="status"><Check size={17} aria-hidden="true" />{notice}<button type="button" aria-label="Đóng thông báo" onClick={() => setNotice("")}><X size={17} aria-hidden="true" /></button></div>}
    <Dialog open={createOpen} onOpenChange={setCreateOpen}><DialogContent className="bw-modal" showCloseButton={false}><div className="bw-modal-head"><div><p className="bw-eyebrow">DỰ ÁN MỚI</p><DialogTitle>Bắt đầu từ một brief.</DialogTitle></div><button type="button" aria-label="Đóng" onClick={() => setCreateOpen(false)}><X size={22} aria-hidden="true" /></button></div><DialogDescription>Tạo bản nháp đầu tiên. Bạn có thể hoàn thiện nội dung trước khi công bố.</DialogDescription><form onSubmit={createDraft}><label htmlFor="bw-title">Tên dự án</label><input id="bw-title" autoFocus required maxLength={90} value={newTitle} onChange={event => setNewTitle(event.target.value)} placeholder="Ví dụ: Thiết kế bộ nhận diện thương hiệu" /><label htmlFor="bw-category">Lĩnh vực</label><span className="bw-select"><select id="bw-category" value={newCategory} onChange={event => setNewCategory(event.target.value)}><option>Thiết kế thương hiệu</option><option>UI/UX & Website</option><option>Nội dung sáng tạo</option><option>Motion & Digital</option></select><ChevronDown size={18} aria-hidden="true" /></span><div className="bw-modal-actions"><button type="button" className="bw-secondary" onClick={() => setCreateOpen(false)}>Hủy</button><button type="submit" className="bw-primary">Tạo bản nháp <ArrowRight size={17} aria-hidden="true" /></button></div></form></DialogContent></Dialog>
  </div>;
}
