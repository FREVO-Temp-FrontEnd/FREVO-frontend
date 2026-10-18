import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Link, Navigate, useLocation } from "react-router";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  BriefcaseBusiness,
  Check,
  CheckCheck,
  ChevronDown,
  Clock3,
  FolderOpen,
  MessageCircle,
  Plus,
  Search,
  Send,
  Users,
} from "lucide-react";
import { initialBusinessState, talents, type Agreement, type BusinessProject, type BusinessState, type CandidateStatus, type Milestone, type ProjectStatus, type Talent } from "./business-data";
import { BusinessLayout } from "./layout/BusinessLayout";
import { BusinessDashboardPage } from "./pages/BusinessDashboardPage";
import { MyProjectsPage } from "./pages/MyProjectsPage";
import { CreateBriefPage } from "./pages/CreateBriefPage";
import { BusinessProjectDetailPage } from "./pages/BusinessProjectDetailPage";
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
function statusLabel(status: ProjectStatus) { return ({ draft: "Bản nháp", published: "Đang tuyển", agreement: "Chờ xác nhận", ongoing: "Đang tiến hành", closed: "Đã đóng tuyển" })[status]; }
function candidateLabel(status: CandidateStatus) { return ({ new: "Mới ứng tuyển", discussing: "Đang trao đổi", offer: "Chờ xác nhận", selected: "Đã được chọn", not_selected: "Không được chọn" })[status]; }
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

function ProjectTabs({ project, active, candidateCount, inviteCount }: { project: BusinessProject; active: string; candidateCount: number; inviteCount: number }) {
  const tabs: { segment: string; label: string; count?: number }[] = [{ segment: "", label: "Brief" }];
  if (project.status === "ongoing") tabs.push({ segment: "executor", label: "Người thực hiện" }, { segment: "messages", label: "Tin nhắn" }, { segment: "progress", label: "Tiến độ" }, { segment: "agreement", label: "Hợp đồng" });
  if (project.status === "published") tabs.push({ segment: "applicants", label: "Ứng viên", count: candidateCount }, { segment: "suggestions", label: "Gợi ý" }, { segment: "invitations", label: "Lời mời", count: inviteCount }, { segment: "messages", label: "Tin nhắn" });
  if (project.status === "agreement") tabs.push({ segment: "applicants", label: "Ứng viên", count: candidateCount }, { segment: "messages", label: "Tin nhắn" }, { segment: "agreement", label: "Thỏa thuận" });
  if (project.status === "closed") tabs.push({ segment: "applicants", label: "Ứng viên", count: candidateCount }, { segment: "messages", label: "Tin nhắn" });
  return <nav className="fb-tabs" aria-label="Các mục của dự án">{tabs.map(tab => <Link key={tab.segment} to={projectPath(project.id, tab.segment)} aria-current={active === tab.segment ? "page" : undefined}>{tab.label}{tab.count !== undefined && <span>{tab.count}</span>}</Link>)}</nav>;
}

function ProjectHeader({ project, active, state }: { project: BusinessProject; active: string; state: BusinessState }) {
  return <><Link className="fb-back" to="/business/projects"><ArrowLeft size={16} /> Dự án của tôi</Link><div className="fb-project-header"><div><Badge tone={project.status === "published" || project.status === "ongoing" ? "green" : project.status === "agreement" ? "orange" : "neutral"}>{statusLabel(project.status)}</Badge><h1>{project.title}</h1><p>{project.category} <span>·</span> {project.budget}</p></div><span className="fb-project-monogram"><BriefcaseBusiness size={28} strokeWidth={1.6} /></span></div><ProjectTabs project={project} active={active} candidateCount={state.candidates.filter(candidate => candidate.projectId === project.id).length} inviteCount={state.invitations.filter(invitation => invitation.projectId === project.id).length} /></>;
}

export default function BusinessPrototype() {
  const location = useLocation();
  const [state, setState] = useState<BusinessState>(loadState);
  const [toast, setToast] = useState("");
  const parts = location.pathname.split("/").filter(Boolean);
  const projectId = parts[1] === "projects" ? parts[2] : undefined;
  const project = projectId && projectId !== "new" ? projectFor(state, projectId) : undefined;
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
  function sendMessage(projectIdToMessage: string, talentId: string, body: string) {
    const message = { id: uniqueId("m"), projectId: projectIdToMessage, talentId, sender: "business" as const, body: body.trim(), time: "Vừa xong" };
    setState(previous => ({ ...previous, messages: [...previous.messages, message], candidates: previous.candidates.map(candidate => candidate.projectId === projectIdToMessage && candidate.talentId === talentId && candidate.status === "new" ? { ...candidate, status: "discussing" } : candidate) }));
  }
  function proposeAgreement(next: Agreement) {
    setState(previous => ({ ...previous, agreements: [...previous.agreements.filter(item => item.projectId !== next.projectId), next], projects: previous.projects.map(item => item.id === next.projectId ? { ...item, status: "agreement" } : item), candidates: previous.candidates.map(candidate => candidate.projectId === next.projectId && candidate.talentId === next.talentId ? { ...candidate, status: "offer" } : candidate), notices: [addNotice("Đã gửi đề xuất thỏa thuận", "Freelancer có 3 ngày để xác nhận nội dung.", projectPath(next.projectId, "agreement")), ...previous.notices] }));
    setToast("Đã gửi đề xuất. Freelancer có 3 ngày để xác nhận.");
  }
  function confirmAgreement(agreement: Agreement) {
    setState(previous => ({ ...previous, agreements: previous.agreements.map(item => item.projectId === agreement.projectId ? { ...item, status: "confirmed", reference: `FV-2026-${String(previous.agreements.length + 4).padStart(3, "0")}`, confirmedAt: today, milestones: item.milestones?.length ? item.milestones.map((milestone, index) => ({ ...milestone, status: index === 0 ? "in_progress" as const : "upcoming" as const })) : [{ id: uniqueId("ms"), name: "Mốc bàn giao", deliverable: item.deliverables, deadline: item.deadline, amount: item.budget, status: "in_progress" as const }] } : item), projects: previous.projects.map(item => item.id === agreement.projectId ? { ...item, status: "ongoing" } : item), candidates: previous.candidates.map(candidate => candidate.projectId !== agreement.projectId ? candidate : { ...candidate, status: candidate.talentId === agreement.talentId ? "selected" : "not_selected" }), notices: [addNotice("Hợp tác đã được hai bên xác nhận", "Dự án đang tiến hành. Hội thoại chỉ hiển thị người được chọn.", projectPath(agreement.projectId, "agreement")), ...previous.notices] }));
    setToast("Đã xác nhận hợp tác. Dự án chuyển sang đang tiến hành.");
  }
  function completeMilestone(projectIdToUpdate: string, milestoneId: string) {
    setState(previous => ({ ...previous, agreements: previous.agreements.map(agreement => {
      if (agreement.projectId !== projectIdToUpdate || agreement.status !== "confirmed") return agreement;
      const index = agreement.milestones?.findIndex(milestone => milestone.id === milestoneId) ?? -1;
      if (index < 0 || agreement.milestones?.[index]?.status !== "submitted") return agreement;
      return { ...agreement, milestones: agreement.milestones?.map((milestone, milestoneIndex) => milestoneIndex === index ? { ...milestone, status: "completed" as const, completedAt: today } : milestoneIndex === index + 1 && milestone.status === "upcoming" ? { ...milestone, status: "in_progress" as const } : milestone) };
    }) }));
    setToast("Đã xác nhận hoàn thành mốc công việc.");
  }

  let content: ReactNode;
  if (parts.length === 1) {
    content = <BusinessDashboardPage />;
  } else if (parts[1] === "projects" && parts.length === 2) {
    content = <MyProjectsPage />;
  } else if (parts[1] === "projects" && (projectId === "new" || section === "edit")) {
    content = <CreateBriefPage />;
  } else if (project && (!section || section === "suggestions" || section === "invitations" || section === "applicants")) {
    content = <BusinessProjectDetailPage />;
  } else if (project) {
    const header = <ProjectHeader project={project} active={section} state={state} />;
    content = <>{header}{section === "executor" && project.status === "ongoing" ? <ExecutorPage state={state} project={project} /> : section === "progress" && project.status === "ongoing" ? <ProgressPage state={state} project={project} onComplete={completeMilestone} /> : section === "messages" && project.status !== "draft" ? <MessagesPage state={state} project={project} talentId={new URLSearchParams(location.search).get("talent")} onSend={sendMessage} /> : section === "propose" && project.status === "published" ? <AgreementPage key={`${project.id}-propose`} state={state} project={project} initialTalentId={new URLSearchParams(location.search).get("talent")} onPropose={proposeAgreement} onConfirm={confirmAgreement} /> : section === "propose" && project.status === "agreement" ? <Navigate to={projectPath(project.id, "agreement")} replace /> : section === "agreement" && (project.status === "agreement" || project.status === "ongoing") ? <AgreementPage key={`${project.id}-agreement`} state={state} project={project} onPropose={proposeAgreement} onConfirm={confirmAgreement} /> : <Navigate to={projectPath(project.id)} replace />}</>;
  }
  else if (parts[1] === "talent" && parts[2]) content = <TalentProfile state={state} talentId={parts[2]} projectId={new URLSearchParams(location.search).get("project") ?? state.projects[0]?.id ?? ""} onInvite={sendInvitation} />;
  else if (parts[1] === "messages" || parts[1] === "agreements") content = <Navigate to="/business/projects" replace />;
  else if (parts[1] === "notifications") content = <NotificationsPage notices={state.notices} onRead={id => setState(previous => ({ ...previous, notices: previous.notices.map(notice => notice.id === id ? { ...notice, read: true } : notice) }))} onReadAll={() => setState(previous => ({ ...previous, notices: previous.notices.map(notice => ({ ...notice, read: true })) }))} />;
  else if (parts[1] === "profile") content = <BusinessProfilePage name={state.businessName} projectCount={state.projects.length} />;
  else if (parts[1] === "settings") content = <SettingsPage name={state.businessName} onSave={name => { setState(previous => ({ ...previous, businessName: name })); setToast("Đã lưu thông tin Business trong phiên xem này."); }} />;
  else content = <Empty title="Không tìm thấy trang" text="Trang này chưa có trong prototype Business." action={<Link className="fb-button fb-button-primary" to="/business">Về tổng quan</Link>} />;

  return <BusinessLayout>{content}{toast && <div className="fb-toast" role="status"><Check size={18} />{toast}<button type="button" aria-label="Đóng thông báo" onClick={() => setToast("")}>✕</button></div>}</BusinessLayout>;
}

function ExecutorPage({ state, project }: { state: BusinessState; project: BusinessProject }) {
  const agreement = state.agreements.find(item => item.projectId === project.id && item.status === "confirmed");
  const talent = agreement && talentFor(agreement.talentId);
  if (!agreement || !talent) return <Empty icon={Users} title="Chưa có người thực hiện" text="Thông tin người thực hiện sẽ xuất hiện sau khi hai bên xác nhận hợp tác." />;
  return <div className="fb-detail-grid"><section className="fb-panel fb-executor"><span className="fb-eyebrow">NGƯỜI THỰC HIỆN DỰ ÁN</span><div className="fb-executor-head"><TalentAvatar talent={talent} size="lg" /><div><Badge tone="green">Đã chốt hợp tác</Badge><h2>{talent.name}</h2><p>{talent.role} · {talent.kind} · {talent.location}</p></div></div><p>{talent.about}</p><div className="fb-facts"><div><small>Xác nhận hợp tác</small><strong>{agreement.confirmedAt}</strong></div><div><small>Ngân sách đã chốt</small><strong>{agreement.budget}</strong></div><div><small>Hạn hoàn thành</small><strong>{agreement.deadline}</strong></div><div><small>Phạm vi</small><strong>{project.category}</strong></div></div><div className="fb-executor-actions"><Link className="fb-button fb-button-primary" to={projectPath(project.id, "messages")}>Mở hội thoại <ArrowRight size={17} /></Link><Link className="fb-button fb-button-secondary" to={`/business/talent/${talent.id}?project=${project.id}`}>Xem hồ sơ</Link></div></section><aside className="fb-detail-aside"><div className="fb-panel"><span className="fb-eyebrow">THỰC HIỆN DỰ ÁN</span><h2>Theo dõi công việc</h2><p>Các mốc tiến độ lấy từ hợp đồng đã xác nhận với {talent.name}.</p><div className="fb-aside-actions"><Link className="fb-button fb-button-primary" to={projectPath(project.id, "progress")}>Xem tiến độ <ArrowRight size={17} /></Link><Link className="fb-button fb-button-secondary" to={projectPath(project.id, "agreement")}>Xem hợp đồng</Link></div></div></aside></div>;
}

function ProgressPage({ state, project, onComplete }: { state: BusinessState; project: BusinessProject; onComplete: (projectId: string, milestoneId: string) => void }) {
  const agreement = state.agreements.find(item => item.projectId === project.id && item.status === "confirmed");
  if (!agreement) return <Empty icon={Clock3} title="Chưa có tiến độ" text="Các mốc sẽ hiển thị sau khi hai bên xác nhận hợp đồng." />;
  const milestones: Milestone[] = agreement.milestones?.length ? agreement.milestones : [{ id: `${project.id}-delivery`, name: "Mốc bàn giao", deliverable: agreement.deliverables, deadline: agreement.deadline, amount: agreement.budget, status: "in_progress" }];
  const completed = milestones.filter(milestone => milestone.status === "completed").length;
  const active = milestones.find(milestone => milestone.status === "submitted" || milestone.status === "in_progress");
  const percent = Math.round(completed / milestones.length * 100);
  const labels: Record<Milestone["status"], string> = { upcoming: "Sắp tới", in_progress: "Đang thực hiện", submitted: "Chờ Business duyệt", completed: "Đã hoàn thành" };
  return <><div className="fb-section-head fb-outside-head"><div><span className="fb-eyebrow">THEO DÕI THỰC HIỆN</span><h2>Tiến độ dự án</h2><p>Các mốc bên dưới được lấy từ hợp đồng đã xác nhận. Business duyệt khi nhận đủ sản phẩm bàn giao.</p></div><Link className="fb-button fb-button-secondary fb-button-small" to={projectPath(project.id, "agreement")}>Xem hợp đồng <ArrowRight size={16} /></Link></div><div className="fb-progress-layout"><div><section className="fb-panel fb-progress-summary"><div><span className="fb-eyebrow">TIẾN ĐỘ TỔNG THỂ</span><strong>{completed}/{milestones.length} mốc hoàn thành</strong><p>{active ? `${active.name} · ${labels[active.status]}` : "Tất cả các mốc đã hoàn thành."}</p></div><span className="fb-progress-percent">{percent}%</span><div className="fb-progress-bar" role="progressbar" aria-label="Tiến độ dự án" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${percent}%` }} /></div></section><section className="fb-panel fb-progress-panel"><div className="fb-section-head"><div><span className="fb-eyebrow">MỐC TRONG HỢP ĐỒNG</span><h2>Lộ trình công việc</h2></div></div><ol className="fb-progress-list">{milestones.map((milestone, index) => <li key={milestone.id} className={`is-${milestone.status}`}><span className="fb-progress-marker">{milestone.status === "completed" ? <Check size={17} /> : String(index + 1).padStart(2, "0")}</span><div className="fb-progress-item"><div className="fb-progress-item-top"><div><small>MỐC {String(index + 1).padStart(2, "0")}</small><h3>{milestone.name}</h3></div><Badge tone={milestone.status === "completed" ? "green" : milestone.status === "submitted" ? "orange" : "neutral"}>{labels[milestone.status]}</Badge></div><p>{milestone.deliverable}</p><div className="fb-progress-meta"><span>Hạn {milestone.deadline}</span><span>{milestone.amount}</span></div>{milestone.submittedAt && <small className="fb-progress-event">Đã gửi bàn giao {milestone.submittedAt}</small>}{milestone.completedAt && <small className="fb-progress-event">Business xác nhận {milestone.completedAt}</small>}{milestone.status === "submitted" && <button type="button" className="fb-button fb-button-primary fb-button-small" onClick={() => onComplete(project.id, milestone.id)}>Xác nhận hoàn thành <Check size={16} /></button>}</div></li>)}</ol></section></div><aside className="fb-detail-aside"><div className="fb-panel"><span className="fb-eyebrow">NGƯỜI THỰC HIỆN</span><h2>{talentFor(agreement.talentId)?.name}</h2><p>Mọi trao đổi về bàn giao thuộc hội thoại của dự án này.</p><div className="fb-aside-actions"><Link className="fb-button fb-button-secondary" to={projectPath(project.id, "messages")}>Mở tin nhắn <ArrowRight size={17} /></Link></div></div><div className="fb-panel"><span className="fb-eyebrow">ĐÃ THỐNG NHẤT</span><h2>{agreement.budget}</h2><p>Ngân sách và ngày bàn giao hiển thị theo hợp đồng. Xác nhận mốc tại đây chỉ cập nhật tiến độ trong prototype.</p></div></aside></div></>;
}



function TalentProfile({ state, talentId, projectId, onInvite }: { state: BusinessState; talentId: string; projectId: string; onInvite: (projectId: string, talentId: string) => void }) {
  const talent = talentFor(talentId);
  const project = projectFor(state, projectId);
  if (!talent) return <Empty title="Không tìm thấy hồ sơ" text="Hồ sơ này không có trong bản minh họa." />;
  const candidate = state.candidates.find(item => item.projectId === projectId && item.talentId === talentId);
  const invitation = state.invitations.find(item => item.projectId === projectId && item.talentId === talentId);
  if (project?.status === "ongoing" && candidate?.status !== "selected") return <Navigate to={projectPath(project.id, "executor")} replace />;
  return <><Link className="fb-back" to={project ? projectPath(project.id, project.status === "ongoing" ? "executor" : candidate ? "applicants" : "suggestions") : "/business/projects"}><ArrowLeft size={16} /> Trở lại dự án</Link><div className="fb-profile-hero"><div className="fb-profile-identity"><TalentAvatar talent={talent} size="lg" /><div><Badge>{talent.kind}</Badge><h1>{talent.name}</h1><p>{talent.role} · {talent.location}</p></div></div><div>{candidate && project?.status === "ongoing" && candidate.status !== "selected" ? <Badge>Không được chọn</Badge> : candidate ? <Link className="fb-button fb-button-primary" to={`${projectPath(projectId, "messages")}?talent=${talent.id}`}><MessageCircle size={18} /> Mở chat</Link> : <button className="fb-button fb-button-primary" type="button" disabled={!!invitation || project?.status !== "published"} onClick={() => onInvite(projectId, talent.id)}>{invitation ? "Đã gửi lời mời" : "Mời tham gia dự án"} <ArrowRight size={17} /></button>}</div></div><div className="fb-profile-grid"><div><section className="fb-panel fb-profile-section"><span className="fb-eyebrow">GIỚI THIỆU</span><h2>Về {talent.kind === "Team" ? "team" : "freelancer"}</h2><p>{talent.about}</p><div className="fb-profile-facts"><span><Clock3 size={17} /> {talent.availability}</span><span><BriefcaseBusiness size={17} /> {talent.rate}</span></div></section><section className="fb-panel fb-profile-section"><span className="fb-eyebrow">PORTFOLIO</span><h2>Dự án tiêu biểu</h2><div className="fb-portfolio-grid">{talent.portfolio.map(work => <article key={work.title}><div className="fb-portfolio-cover" style={{ background: work.color }}><span>{work.title.slice(0, 1)}</span></div><h3>{work.title}</h3><p>{work.category}</p></article>)}</div></section></div><aside><section className="fb-panel fb-profile-section"><span className="fb-eyebrow">ĐỐI CHIẾU BRIEF</span><h2>Vì sao được gợi ý</h2><div className="fb-fit fb-profile-fit">{talent.fit.map(item => <div key={item}><Check size={16} /> {item}</div>)}</div><h3>Kỹ năng</h3><div className="fb-chips">{talent.skills.map(skill => <span key={skill}>{skill}</span>)}</div></section>{candidate && <section className="fb-panel fb-profile-section"><span className="fb-eyebrow">ĐỀ XUẤT ỨNG TUYỂN</span><h2>Lời giới thiệu</h2><p>{candidate.proposal}</p><Badge tone={candidate.status === "selected" ? "green" : "neutral"}>{candidate.status === "selected" ? "Đã được chọn" : candidate.status === "not_selected" ? "Không được chọn" : "Có thể trao đổi ngay"}</Badge></section>}</aside></div></>;
}

function MessagesPage({ state, project, talentId, onSend }: { state: BusinessState; project: BusinessProject; talentId: string | null; onSend: (projectId: string, talentId: string, body: string) => void }) {
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const conversations = state.candidates.filter(candidate => candidate.projectId === project.id && (project.status !== "ongoing" || candidate.status === "selected")).filter(candidate => talentFor(candidate.talentId)?.name.toLocaleLowerCase("vi").includes(query.toLocaleLowerCase("vi")));
  const selected = conversations.find(candidate => candidate.talentId === talentId) ?? conversations[0];
  const talent = selected && talentFor(selected.talentId);
  const messages = selected ? state.messages.filter(message => message.projectId === project.id && message.talentId === selected.talentId) : [];
  const canSend = selected?.status !== "not_selected";
  return <><div className="fb-section-head fb-outside-head"><div><span className="fb-eyebrow">TRAO ĐỔI THEO DỰ ÁN</span><h2>Tin nhắn</h2><p>{project.status === "ongoing" ? "Chỉ hiển thị hội thoại với người thực hiện đã được chọn." : "Ứng viên ứng tuyển hoặc chấp nhận lời mời có thể trao đổi ngay."}</p></div>{project.status === "ongoing" && <Badge tone="green">Đang hợp tác</Badge>}</div>{project.status === "published" && selected && <div className="fb-proposal-callout"><span>Đã thống nhất phạm vi với {talent?.name}? Tạo đề xuất để hai bên xác nhận trước khi bắt đầu dự án.</span><Link className="fb-button fb-button-secondary fb-button-small" to={`${projectPath(project.id, "propose")}?talent=${selected.talentId}`}>Tạo đề xuất hợp tác <ArrowRight size={16} /></Link></div>}<div className="fb-chat"><aside className="fb-chat-list"><div className="fb-chat-list-head"><h2>Hội thoại dự án</h2><label className="fb-search"><Search size={16} /><span className="sr-only">Tìm hội thoại</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Tìm freelancer" /></label></div>{conversations.map(candidate => { const person = talentFor(candidate.talentId); if (!person) return null; const last = state.messages.filter(message => message.projectId === project.id && message.talentId === candidate.talentId).at(-1); return <Link className={selected?.id === candidate.id ? "active" : ""} key={candidate.id} to={`${projectPath(project.id, "messages")}?talent=${candidate.talentId}`}><TalentAvatar talent={person} size="sm" /><span><strong>{person.name}</strong><small>{candidateLabel(candidate.status)}</small><em>{last?.body ?? "Bắt đầu trao đổi về dự án"}</em></span>{candidate.unread && <i />}</Link>; })}{conversations.length === 0 && <Empty icon={MessageCircle} title="Chưa có hội thoại" text="Hội thoại sẽ xuất hiện khi có người ứng tuyển hoặc chấp nhận lời mời." />}</aside><section className="fb-chat-main">{talent && selected ? <><div className="fb-chat-header"><TalentAvatar talent={talent} size="sm" /><span><strong>{talent.name}</strong><small>{project.title}</small></span><Link to={`/business/talent/${talent.id}?project=${project.id}`}>Xem hồ sơ <ArrowRight size={15} /></Link></div><div className="fb-chat-stream"><div className="fb-chat-context">Hội thoại của <strong>{project.title}</strong><small>{project.status === "ongoing" ? "Người thực hiện đã được hai bên xác nhận." : "Trao đổi về phạm vi, thời gian và ngân sách."}</small></div>{messages.map(message => <div className={`fb-bubble ${message.sender === "business" ? "mine" : "theirs"}`} key={message.id}><p>{message.body}</p><time>{message.time}</time></div>)}</div>{canSend ? <form className="fb-chat-compose" onSubmit={event => { event.preventDefault(); if (!draft.trim()) return; onSend(project.id, talent.id, draft); setDraft(""); }}><label className="sr-only" htmlFor="fb-message">Soạn tin nhắn</label><input id="fb-message" value={draft} onChange={event => setDraft(event.target.value)} placeholder="Nhập tin nhắn về dự án..." /><button type="submit" aria-label="Gửi tin nhắn" disabled={!draft.trim()}><Send size={18} /></button></form> : <p className="fb-chat-readonly">Hội thoại này chỉ còn để xem lại.</p>}</> : <Empty icon={MessageCircle} title="Chọn một hội thoại" text="Trao đổi với ứng viên của dự án này." />}</section></div></>;
}

function AgreementPage({ state, project, initialTalentId, onPropose, onConfirm }: { state: BusinessState; project: BusinessProject; initialTalentId?: string | null; onPropose: (agreement: Agreement) => void; onConfirm: (agreement: Agreement) => void }) {
  const candidates = state.candidates.filter(candidate => candidate.projectId === project.id && candidate.status !== "not_selected");
  const agreement = state.agreements.find(item => item.projectId === project.id);
  const [talentId, setTalentId] = useState(agreement?.talentId ?? candidates.find(candidate => candidate.talentId === initialTalentId)?.talentId ?? candidates[0]?.talentId ?? "");
  const [scope, setScope] = useState(agreement?.scope ?? project.description);
  const [deliverables, setDeliverables] = useState(agreement?.deliverables ?? project.deliverables.join("\n"));
  const [deadline, setDeadline] = useState(agreement?.deadline ?? project.deadline);
  const [budget, setBudget] = useState(agreement?.budget ?? project.budget);
  const [milestones, setMilestones] = useState<Milestone[]>(agreement?.milestones?.length ? agreement.milestones : [{ id: uniqueId("ms"), name: "Mốc 1 · Bàn giao", deliverable: project.deliverables.join(", "), deadline: project.deadline, amount: project.budget, status: "upcoming" }]);
  const [error, setError] = useState("");
  function submit(event: FormEvent) { event.preventDefault(); if (!talentId || !scope.trim() || !deliverables.trim() || !deadline.trim() || !budget.trim() || milestones.some(milestone => !milestone.name.trim() || !milestone.deliverable.trim() || !milestone.deadline.trim() || !milestone.amount.trim())) { setError("Vui lòng hoàn thiện mọi trường của đề xuất và các mốc công việc."); return; } setError(""); onPropose({ projectId: project.id, talentId, scope: scope.trim(), deliverables: deliverables.trim(), deadline: deadline.trim(), budget: budget.trim(), status: "pending", sent: today, milestones: milestones.map(milestone => ({ ...milestone, name: milestone.name.trim(), deliverable: milestone.deliverable.trim(), deadline: milestone.deadline.trim(), amount: milestone.amount.trim(), status: "upcoming" })) }); }
  return <div className="fb-detail-grid"><section className="fb-panel fb-agreement"><div className="fb-section-head"><div><span className="fb-eyebrow">{agreement?.status === "confirmed" ? "HỢP ĐỒNG DỰ ÁN" : "TÓM TẮT HỢP TÁC"}</span><h2>{agreement?.status === "confirmed" ? "Hợp đồng hợp tác" : agreement ? "Đang chờ Freelancer xác nhận" : "Đề xuất thỏa thuận"}</h2><p>{agreement?.status === "confirmed" ? "Nội dung đã chốt với người thực hiện, hiển thị trong phạm vi dự án." : "Bản tóm tắt trên FREVO không mặc định là hợp đồng điện tử."}</p></div>{agreement && <Badge tone={agreement.status === "confirmed" ? "green" : "orange"}>{agreement.status === "confirmed" ? "Hai bên đã xác nhận" : "Chờ phản hồi"}</Badge>}</div>{agreement?.status === "confirmed" ? <ContractDocument agreement={agreement} project={project} businessName={state.businessName} /> : <form onSubmit={submit} className="fb-agreement-form"><fieldset className="fb-agreement-fields" disabled={!!agreement}><label>Ứng viên được đề xuất <span>*</span><span className="fb-select"><select value={talentId} onChange={event => setTalentId(event.target.value)} disabled={!!agreement}><option value="">Chọn ứng viên</option>{candidates.map(candidate => <option key={candidate.id} value={candidate.talentId}>{talentFor(candidate.talentId)?.name} · {talentFor(candidate.talentId)?.kind}</option>)}</select><ChevronDown size={17} /></span></label><label>Phạm vi công việc <span>*</span><textarea rows={4} value={scope} onChange={event => setScope(event.target.value)} /></label><label>Sản phẩm bàn giao <span>*</span><textarea rows={4} value={deliverables} onChange={event => setDeliverables(event.target.value)} /></label><div className="fb-fields"><label>Thời hạn <span>*</span><input value={deadline} onChange={event => setDeadline(event.target.value)} /></label><label>Ngân sách <span>*</span><input value={budget} onChange={event => setBudget(event.target.value)} /></label></div><MilestoneFields milestones={milestones} onChange={setMilestones} disabled={!!agreement} /></fieldset>{error && <p className="fb-form-error" role="alert">{error}</p>}{agreement?.status === "pending" ? <div className="fb-agreement-pending"><Clock3 size={19} /><span>Gửi ngày {agreement.sent}. Đề xuất hết hạn sau 3 ngày. Trong prototype, dùng nút bên dưới để xem trạng thái sau khi Freelancer xác nhận.</span><button type="button" className="fb-button fb-button-primary" onClick={() => onConfirm(agreement)}>Mô phỏng Freelancer xác nhận</button></div> : <button className="fb-button fb-button-primary" type="submit" disabled={!candidates.length || project.status === "closed"}>Gửi đề xuất thỏa thuận <ArrowRight size={17} /></button>}</form>}</section><aside className="fb-detail-aside"><div className="fb-panel"><span className="fb-eyebrow">{agreement?.status === "confirmed" ? "DỰ ÁN ĐANG TIẾN HÀNH" : "QUY TẮC CHỌN NGƯỜI"}</span><h2>{agreement?.status === "confirmed" ? talentFor(agreement.talentId)?.name : "Một dự án, một đơn vị thực hiện."}</h2><p>{agreement?.status === "confirmed" ? "Người thực hiện đã được chốt. Hội thoại và hợp đồng được lưu trong dự án này." : "Khi hai bên xác nhận, dự án đóng tuyển. Ứng viên được chọn và các ứng viên còn lại được cập nhật trạng thái."}</p>{agreement?.status === "confirmed" ? <Link className="fb-button fb-button-primary fb-contract-chat-link" to={projectPath(project.id, "messages")}>Mở tin nhắn <ArrowRight size={16} /></Link> : <div className="fb-rule"><Check size={17} /> Thay đổi nội dung sau xác nhận cần được hai bên xác nhận lại.</div>}</div></aside></div>;
}

function MilestoneFields({ milestones, onChange, disabled }: { milestones: Milestone[]; onChange: (milestones: Milestone[]) => void; disabled: boolean }) {
  function update(id: string, field: "name" | "deliverable" | "deadline" | "amount", value: string) {
    onChange(milestones.map(milestone => milestone.id === id ? { ...milestone, [field]: value } : milestone));
  }
  return <fieldset className="fb-milestone-fields" disabled={disabled}><legend>Mốc công việc trong hợp đồng</legend><p>Tiến độ dự án sẽ theo đúng các mốc này sau khi hai bên xác nhận.</p>{milestones.map((milestone, index) => <div className="fb-milestone-fields-item" key={milestone.id}><div><strong>Mốc {index + 1}</strong>{milestones.length > 1 && <button type="button" onClick={() => onChange(milestones.filter(item => item.id !== milestone.id))}>Xóa mốc</button>}</div><div className="fb-fields"><label>Tên mốc <span>*</span><input value={milestone.name} onChange={event => update(milestone.id, "name", event.target.value)} /></label><label>Hạn bàn giao <span>*</span><input value={milestone.deadline} onChange={event => update(milestone.id, "deadline", event.target.value)} /></label><label className="fb-field-full">Sản phẩm bàn giao <span>*</span><textarea rows={2} value={milestone.deliverable} onChange={event => update(milestone.id, "deliverable", event.target.value)} /></label><label>Giá trị mốc <span>*</span><input value={milestone.amount} onChange={event => update(milestone.id, "amount", event.target.value)} /></label></div></div>)}<button className="fb-button fb-button-secondary fb-button-small" type="button" onClick={() => onChange([...milestones, { id: uniqueId("ms"), name: `Mốc ${milestones.length + 1}`, deliverable: "", deadline: "", amount: "", status: "upcoming" }])}><Plus size={15} /> Thêm mốc</button></fieldset>;
}

function ContractDocument({ agreement, project, businessName }: { agreement: Agreement; project: BusinessProject; businessName: string }) {
  const executor = talentFor(agreement.talentId);
  const milestones = agreement.milestones ?? [{ id: `${project.id}-delivery`, name: "Mốc bàn giao", deliverable: agreement.deliverables, deadline: agreement.deadline, amount: agreement.budget, status: "in_progress" }];
  return <div className="fb-contract-doc" aria-label={`Hợp đồng của dự án ${project.title}`}>
    <div className="fb-contract-top"><span>FREVO / HỢP TÁC DỰ ÁN</span><strong>{agreement.reference ?? "FV-2026"}</strong></div>
    <div className="fb-contract-title"><span>BẢN XEM HỢP ĐỒNG MINH HỌA</span><h3>Hợp đồng hợp tác</h3><p>{project.title}</p></div>
    <div className="fb-contract-parties"><div><small>BÊN GIAO VIỆC · BUSINESS</small><strong>{businessName}</strong></div><div><small>BÊN THỰC HIỆN · {executor?.kind ?? "FREELANCER"}</small><strong>{executor?.name ?? "Freelancer"}</strong></div></div>
    <section><h4>01. Phạm vi công việc</h4><p>{agreement.scope}</p></section>
    <section><h4>02. Sản phẩm bàn giao</h4><ul>{agreement.deliverables.split("\n").filter(Boolean).map(item => <li key={item}><Check size={15} /> {item}</li>)}</ul></section>
    <section><h4>03. Kế hoạch mốc công việc</h4><div className="fb-contract-milestones">{milestones.map(milestone => <div key={milestone.name}><strong>{milestone.name}</strong><p>{milestone.deliverable}</p><span>Hạn {milestone.deadline}</span><b>{milestone.amount}</b></div>)}</div></section>
    <div className="fb-contract-total"><div><small>THỜI HẠN CUỐI</small><strong>{agreement.deadline}</strong></div><div><small>TỔNG NGÂN SÁCH</small><strong>{agreement.budget}</strong></div></div>
    <div className="fb-contract-confirm"><div><small>BUSINESS</small><strong>{businessName}</strong><span><Check size={14} /> Đã xác nhận {agreement.confirmedAt ?? today}</span></div><div><small>NGƯỜI THỰC HIỆN</small><strong>{executor?.name}</strong><span><Check size={14} /> Đã xác nhận {agreement.confirmedAt ?? today}</span></div></div>
    <p className="fb-contract-note">Nội dung và xác nhận trong prototype là dữ liệu minh họa; trang này không thực hiện ký hợp đồng điện tử.</p>
  </div>;
}

function NotificationsPage({ notices, onRead, onReadAll }: { notices: BusinessState["notices"]; onRead: (id: string) => void; onReadAll: () => void }) {
  return <><PageHeading eyebrow="CẬP NHẬT" title="Thông báo" description="Những thay đổi mới trong các dự án và cuộc trao đổi của bạn." action={<button type="button" className="fb-button fb-button-secondary" onClick={onReadAll}><CheckCheck size={18} /> Đánh dấu đã đọc</button>} /><section className="fb-panel fb-notices">{notices.map(notice => <Link key={notice.id} className={notice.read ? "" : "unread"} to={notice.href} onClick={() => onRead(notice.id)}><span className="fb-notice-icon"><Bell size={18} /></span><span><strong>{notice.title}</strong><small>{notice.detail}</small></span><time>{notice.time}</time></Link>)}</section></>;
}

function BusinessProfilePage({ name, projectCount }: { name: string; projectCount: number }) {
  return <><PageHeading eyebrow="TÀI KHOẢN" title="Hồ sơ Business" description="Thông tin đại diện cho bạn trong không gian làm việc FREVO." /><section className="fb-panel fb-business-profile"><span className="fb-business-profile-avatar" aria-hidden="true">{name.charAt(0).toLocaleUpperCase("vi")}</span><div className="fb-business-profile-details"><span className="fb-eyebrow">TÀI KHOẢN BUSINESS</span><h2>{name}</h2><p>hello@nangstudio.vn</p><small>{projectCount} dự án trong không gian làm việc</small></div><Link className="fb-button fb-button-secondary" to="/business/settings">Chỉnh sửa hồ sơ <ArrowRight size={16} /></Link></section></>;
}

function SettingsPage({ name, onSave }: { name: string; onSave: (name: string) => void }) {
  const [value, setValue] = useState(name);
  return <><PageHeading eyebrow="TÀI KHOẢN" title="Cài đặt" description="Thông tin Business hiển thị trong bản xem trước." /><form className="fb-panel fb-settings" onSubmit={event => { event.preventDefault(); if (value.trim()) onSave(value.trim()); }}><div className="fb-section-head"><div><h2>Thông tin Business</h2><p>Thông tin này xuất hiện trong không gian làm việc của bạn.</p></div></div><label>Tên doanh nghiệp hoặc cá nhân<input value={value} onChange={event => setValue(event.target.value)} maxLength={80} required /></label><label>Email đăng nhập<input value="hello@nangstudio.vn" readOnly aria-describedby="fb-demo-email" /></label><small id="fb-demo-email">Email minh họa cho prototype.</small><button className="fb-button fb-button-primary" type="submit">Lưu thay đổi</button></form></>;
}
