import { useEffect, useState, type ReactNode } from "react";
import { Link, Navigate, useLocation } from "react-router";
import {
  ArrowRight,
  Bell,
  BriefcaseBusiness,
  Check,
  CheckCheck,
  Clock3,
  FolderOpen,
  MessageCircle,
} from "lucide-react";
import { initialBusinessState, talents, type BusinessState, type Talent } from "./business-data";
import { BusinessLayout } from "./layout/BusinessLayout";
import { BusinessDashboardPage } from "./pages/BusinessDashboardPage";
import { MyProjectsPage } from "./pages/MyProjectsPage";
import { CreateBriefPage } from "./pages/CreateBriefPage";
import { BusinessProjectDetailPage } from "./pages/BusinessProjectDetailPage";
import { BusinessInboxPage } from "./pages/BusinessInboxPage";
import { useBusinessNotifications } from "./hooks/useBusinessNotifications";
import { ProjectBreadcrumbs } from "@/app/shared/components/ProjectBreadcrumbs";
import "./business.css";

const STORAGE_KEY = "frevo-business-prototype-v6";
const today = "17/10/2026";

function loadState(): BusinessState {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved) as BusinessState;
  } catch { /* Use demo state when storage is unavailable. */ }
  return initialBusinessState;
}

function talentFor(id: string) { return talents.find(talent => talent.id === id); }
function projectFor(state: BusinessState, id: string) { return state.projects.find(project => project.id === id); }
function projectPath(id: string, section = "") { return `/business/projects/${id}${section ? `/${section}` : ""}`; }
function uniqueId(prefix: string) { return `${prefix}-${Date.now()}`; }

function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "orange" | "green" | "soft" }) {
  return <span className={`fb-badge fb-badge-${tone}`}>{children}</span>;
}

function Empty({ icon: Icon = FolderOpen, title, text, action }: { icon?: typeof FolderOpen; title: string; text: string; action?: ReactNode }) {
  return <div className="fb-empty"><Icon size={28} strokeWidth={1.6} aria-hidden="true" /><h3>{title}</h3><p>{text}</p>{action}</div>;
}

function PageHeading({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return <div className="fb-page-heading"><div>{eyebrow && <span className="fb-eyebrow">{eyebrow}</span>}<h1>{title}<span className="fb-dot">.</span></h1>{description && <p>{description}</p>}</div>{action && <div className="fb-heading-action">{action}</div>}</div>;
}

function TalentAvatar({ talent, size = "md" }: { talent: Talent; size?: "sm" | "md" | "lg" }) {
  return <span className={`fb-avatar fb-avatar-${size}`} style={{ background: talent.color }} aria-hidden="true">{talent.initials}</span>;
}



export default function BusinessPrototype() {
  const location = useLocation();
  const [state, setState] = useState<BusinessState>(loadState);
  const [toast, setToast] = useState("");
  const parts = location.pathname.split("/").filter(Boolean);
  const projectId = parts[1] === "projects" ? parts[2] : undefined;
  const section = parts[3] ?? "";

  useEffect(() => {
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* Prototype remains usable. */ }
  }, [state]);
  useEffect(() => { document.title = "Không gian Business | FREVO"; }, []);

  function addNotice(title: string, detail: string, href: string) {
    return { id: uniqueId("n"), title, detail, time: "Vừa xong", read: false, href };
  }
  function sendInvitation(projectIdToInvite: string, talentId: string) {
    const existing = state.invitations.find(item => item.projectId === projectIdToInvite && item.talentId === talentId && item.status === "pending");
    if (existing) { setToast("Lời mời này đang chờ phản hồi."); return; }
    const invited = talentFor(talentId);
    setState(previous => ({ ...previous, invitations: [{ id: uniqueId("i"), projectId: projectIdToInvite, talentId, status: "pending", sent: today }, ...previous.invitations], notices: [addNotice(`Đã gửi lời mời cho ${invited?.name ?? "Freelancer"}`, "Lời mời hết hạn sau 7 ngày.", projectPath(projectIdToInvite, "invitations")), ...previous.notices] }));
    setToast("Đã gửi lời mời. Freelancer có 7 ngày để phản hồi.");
  }

  let content: ReactNode;
  if (parts.length === 1) {
    content = <BusinessDashboardPage />;
  } else if (parts[1] === "projects" && parts.length === 2) {
    content = <MyProjectsPage />;
  } else if (parts[1] === "projects" && (projectId === "new" || section === "edit")) {
    content = <CreateBriefPage />;
  } else if (parts[1] === "projects" && projectId && (!section || section === "suggestions" || section === "invitations" || section === "applicants" || section === "executor")) {
    content = <BusinessProjectDetailPage />;
  } else if (parts[1] === "projects" && projectId && section === "messages") {
    const talentId = new URLSearchParams(location.search).get("talent");
    const inboxParams = new URLSearchParams({ view: "project", scope: projectId });
    if (talentId) {
      inboxParams.set("project", projectId);
      inboxParams.set("talent", talentId);
    }
    content = <Navigate to={`/business/messages?${inboxParams.toString()}`} replace />;
  } else if (parts[1] === "projects" && projectId && (section === "agreement" || section === "propose")) {
    content = <Navigate to={`/projects/${projectId}/agreement`} replace />;
  } else if (parts[1] === "projects" && projectId && section === "progress") {
    content = <Navigate to={`/workspace/${projectId}`} replace />;
  } else if (parts[1] === "projects" && projectId) {
    content = <BusinessProjectDetailPage />;
  }
  else if (parts[1] === "talent" && parts[2]) content = <TalentProfile state={state} talentId={parts[2]} projectId={new URLSearchParams(location.search).get("project") ?? state.projects[0]?.id ?? ""} onInvite={sendInvitation} />;
  else if (parts[1] === "messages") content = <BusinessInboxPage />;
  else if (parts[1] === "agreements") content = <Navigate to="/business/projects" replace />;
  else if (parts[1] === "notifications") content = <NotificationsPage />;
  else if (parts[1] === "profile") content = <BusinessProfilePage name={state.businessName} projectCount={state.projects.length} />;
  else if (parts[1] === "settings") content = <SettingsPage name={state.businessName} onSave={name => { setState(previous => ({ ...previous, businessName: name })); setToast("Đã lưu thông tin Business trong phiên xem này."); }} />;
  else content = <Empty title="Không tìm thấy trang" text="Trang này chưa có trong prototype Business." action={<Link className="fb-button fb-button-primary" to="/business">Về tổng quan</Link>} />;

  return <BusinessLayout>{content}{toast && <div className="fb-toast" role="status"><Check size={18} />{toast}<button type="button" aria-label="Đóng thông báo" onClick={() => setToast("")}>✕</button></div>}</BusinessLayout>;
}





function TalentProfile({ state, talentId, projectId, onInvite }: { state: BusinessState; talentId: string; projectId: string; onInvite: (projectId: string, talentId: string) => void }) {
  const talent = talentFor(talentId);
  const project = projectFor(state, projectId);
  if (!talent) return <Empty title="Không tìm thấy hồ sơ" text="Hồ sơ này không có trong bản minh họa." />;
  const candidate = state.candidates.find(item => item.projectId === projectId && item.talentId === talentId);
  const invitation = state.invitations.find(item => item.projectId === projectId && item.talentId === talentId);
  if (project?.status === "ongoing" && candidate?.status !== "selected") return <Navigate to={projectPath(project.id, "executor")} replace />;
  return <><ProjectBreadcrumbs items={project ? [{ label: "Dự án của tôi", to: "/business/projects" }, { label: project.title, to: projectPath(project.id, project.status === "ongoing" ? "executor" : candidate ? "applicants" : "suggestions") }, { label: talent.name }] : [{ label: "Dự án của tôi", to: "/business/projects" }, { label: talent.name }]} /><div className="fb-profile-hero"><div className="fb-profile-identity"><TalentAvatar talent={talent} size="lg" /><div><Badge>{talent.kind}</Badge><h1>{talent.name}</h1><p>{talent.role} · {talent.location}</p></div></div><div>{candidate && project?.status === "ongoing" && candidate.status !== "selected" ? <Badge>Không được chọn</Badge> : candidate ? <Link className="fb-button fb-button-primary" to={`/business/messages?view=project&scope=${projectId}&project=${projectId}&talent=${talent.id}`}><MessageCircle size={18} /> Mở chat</Link> : <button className="fb-button fb-button-primary" type="button" disabled={!!invitation || project?.status !== "published"} onClick={() => onInvite(projectId, talent.id)}>{invitation ? "Đã gửi lời mời" : "Mời tham gia dự án"} <ArrowRight size={17} /></button>}</div></div><div className="fb-profile-grid"><div><section className="fb-panel fb-profile-section"><span className="fb-eyebrow">GIỚI THIỆU</span><h2>Về {talent.kind === "Team" ? "team" : "freelancer"}</h2><p>{talent.about}</p><div className="fb-profile-facts"><span><Clock3 size={17} /> {talent.availability}</span><span><BriefcaseBusiness size={17} /> {talent.rate}</span></div></section><section className="fb-panel fb-profile-section"><span className="fb-eyebrow">PORTFOLIO</span><h2>Dự án tiêu biểu</h2><div className="fb-portfolio-grid">{talent.portfolio.map(work => <article key={work.title}><div className="fb-portfolio-cover" style={{ background: work.color }}><span>{work.title.slice(0, 1)}</span></div><h3>{work.title}</h3><p>{work.category}</p></article>)}</div></section></div><aside><section className="fb-panel fb-profile-section"><span className="fb-eyebrow">ĐỐI CHIẾU BRIEF</span><h2>Vì sao được gợi ý</h2><div className="fb-fit fb-profile-fit">{talent.fit.map(item => <div key={item}><Check size={16} /> {item}</div>)}</div><h3>Kỹ năng</h3><div className="fb-chips">{talent.skills.map(skill => <span key={skill}>{skill}</span>)}</div></section>{candidate && <section className="fb-panel fb-profile-section"><span className="fb-eyebrow">ĐỀ XUẤT ỨNG TUYỂN</span><h2>Lời giới thiệu</h2><p>{candidate.proposal}</p><Badge tone={candidate.status === "selected" ? "green" : "neutral"}>{candidate.status === "selected" ? "Đã được chọn" : candidate.status === "not_selected" ? "Không được chọn" : "Có thể trao đổi ngay"}</Badge></section>}</aside></div></>;
}



function NotificationsPage() {
  const { notifications, markRead, markAllRead } = useBusinessNotifications();
  return <><PageHeading eyebrow="CẬP NHẬT" title="Thông báo" description="Những thay đổi mới trong các dự án và cuộc trao đổi của bạn." action={<button type="button" className="fb-button fb-button-secondary" onClick={markAllRead}><CheckCheck size={18} /> Đánh dấu đã đọc</button>} /><section className="fb-panel fb-notices">{notifications.length ? notifications.map(notice => <Link key={notice.id} className={notice.read ? "" : "unread"} to={notice.href} onClick={() => markRead(notice.id)}><span className="fb-notice-icon"><Bell size={18} /></span><span><strong>{notice.title}</strong><small>{notice.detail}</small></span><time>{notice.time}</time></Link>) : <p className="py-10 text-center text-sm text-[#747773]">Chưa có thông báo nào.</p>}</section></>;
}

function BusinessProfilePage({ name, projectCount }: { name: string; projectCount: number }) {
  return <><PageHeading eyebrow="TÀI KHOẢN" title="Hồ sơ Business" description="Thông tin đại diện cho bạn trong không gian làm việc FREVO." /><section className="fb-panel fb-business-profile"><span className="fb-business-profile-avatar" aria-hidden="true">{name.charAt(0).toLocaleUpperCase("vi")}</span><div className="fb-business-profile-details"><span className="fb-eyebrow">TÀI KHOẢN BUSINESS</span><h2>{name}</h2><p>hello@nangstudio.vn</p><small>{projectCount} dự án trong không gian làm việc</small></div><Link className="fb-button fb-button-secondary" to="/business/settings">Chỉnh sửa hồ sơ <ArrowRight size={16} /></Link></section></>;
}

function SettingsPage({ name, onSave }: { name: string; onSave: (name: string) => void }) {
  const [value, setValue] = useState(name);
  return <><PageHeading eyebrow="TÀI KHOẢN" title="Cài đặt" description="Thông tin Business hiển thị trong bản xem trước." /><form className="fb-panel fb-settings" onSubmit={event => { event.preventDefault(); if (value.trim()) onSave(value.trim()); }}><div className="fb-section-head"><div><h2>Thông tin Business</h2><p>Thông tin này xuất hiện trong không gian làm việc của bạn.</p></div></div><label>Tên doanh nghiệp hoặc cá nhân<input value={value} onChange={event => setValue(event.target.value)} maxLength={80} required /></label><label>Email đăng nhập<input value="hello@nangstudio.vn" readOnly aria-describedby="fb-demo-email" /></label><small id="fb-demo-email">Email minh họa cho prototype.</small><button className="fb-button fb-button-primary" type="submit">Lưu thay đổi</button></form></>;
}
