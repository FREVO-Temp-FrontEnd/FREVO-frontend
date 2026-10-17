import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router";
import { ArrowLeft, ArrowRight, BriefcaseBusiness, Check, Clock3, FileText, MessageCircle, Sparkles, Users } from "lucide-react";
import { sampleProjects, type Project } from "./business-demo-data";
import "./business-workspace.css";

const applicants = [
  { name: "Minh Anh", role: "Brand Designer", type: "Cá nhân", budget: "18 triệu", status: "Chưa đọc", portfolio: "Nhận diện Lúm Coffee · Bao bì Mộc", initials: "MA" },
  { name: "Mây Creative", role: "Nhóm thiết kế thương hiệu", type: "Team", budget: "22 triệu", status: "Chưa đọc", portfolio: "Hệ nhận diện Lala · Campaign Sớm", initials: "MC" },
  { name: "Khánh Linh", role: "Visual Identity Designer", type: "Cá nhân", budget: "20 triệu", status: "Đã đọc", portfolio: "Brandbook Tía · Nét Studio", initials: "KL" },
];

const suggestions = [
  { name: "Hà Vy", role: "Brand & Packaging Designer", fit: "Kỹ năng nhận diện · Đúng ngân sách", initials: "HV" },
  { name: "Studio Dâu", role: "Creative team", fit: "Portfolio cùng lĩnh vực · Sẵn sàng tháng này", initials: "SD" },
  { name: "Tuấn Phong", role: "Visual Designer", fit: "Kinh nghiệm thương hiệu · Đúng ngân sách", initials: "TP" },
  { name: "Lan Nhi", role: "Art Director", fit: "Portfolio liên quan · Sẵn sàng tháng này", initials: "LN" },
];

function getProject(id: number, preview: string): Project | undefined {
  const key = preview === "?preview=new" ? "frevo-business-new-preview" : "frevo-business-sample-preview";
  try {
    const stored = sessionStorage.getItem(key);
    if (stored) {
      const saved = (JSON.parse(stored) as Project[]).find(project => project.id === id);
      const defaults = sampleProjects.find(project => project.id === id);
      return saved && defaults ? { ...defaults, ...saved } : saved;
    }
  } catch { /* The sample remains available. */ }
  return preview ? undefined : sampleProjects.find(project => project.id === id);
}

function BriefContent({ project }: { project: Project }) {
  return <div className="bw-brief-content">
      <section className="bw-detail-panel"><p className="bw-eyebrow">PROJECT BRIEF</p><h2>Thông tin dự án</h2><p className="bw-detail-lead">{project.description ?? "Chưa có mô tả dự án."}</p>
        <div className="bw-brief-fields"><div><small>LĨNH VỰC</small><strong>{project.category}</strong></div><div><small>NGÂN SÁCH DỰ KIẾN</small><strong>{project.budget}</strong></div><div><small>ƯU TIÊN HỢP TÁC</small><strong>{project.preferredTalent ?? "Chưa chọn"}</strong></div><div><small>HẠN NHẬN HỒ SƠ</small><strong>{project.applicationDeadline ?? "Chưa đặt"}</strong></div><div><small>HẠN HOÀN THÀNH DỰ KIẾN</small><strong>{project.deadline ?? "Chưa đặt"}</strong></div></div>
      </section>
      <section className="bw-detail-panel"><p className="bw-eyebrow">YÊU CẦU</p><h2>Kỹ năng & sản phẩm bàn giao</h2><h3 className="bw-brief-subhead">Kỹ năng cần có</h3><div className="bw-skill-list">{project.skills?.length ? project.skills.map(skill => <span key={skill}>{skill}</span>) : <p>Chưa thêm kỹ năng.</p>}</div><h3 className="bw-brief-subhead">Sản phẩm bàn giao</h3>{project.deliverables?.length ? <ul className="bw-deliverables">{project.deliverables.map(item => <li key={item}><Check size={17} aria-hidden="true" />{item}</li>)}</ul> : <p className="bw-detail-lead">Chưa thêm sản phẩm bàn giao.</p>}</section>
  </div>;
}

export default function BusinessProjectDetail() {
  const { projectId } = useParams();
  const location = useLocation();
  const preview = new URLSearchParams(location.search).get("preview") === "new" ? "?preview=new" : "";
  const project = getProject(Number(projectId), preview);
  const section = location.pathname.split("/")[4] ?? "brief";
  const base = `/business/projects/${projectId}`;
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const oldTitle = document.title;
    document.title = `${project?.title ?? "Dự án"} | FREVO`;
    return () => { document.title = oldTitle; };
  }, [project?.title]);

  if (!project) return <div className="bw-page"><main className="bw-main"><Link className="bw-back-link" to={`/business/projects${preview}`}><ArrowLeft size={18} /> Dự án của tôi</Link><div className="bw-no-results"><strong>Không tìm thấy dự án.</strong><p>Dự án minh họa chỉ được lưu trong phiên xem này.</p></div></main></div>;

  const isDraft = project.status === "draft";
  const tabs = [
    { path: "", label: "Brief", icon: FileText, count: undefined },
    ...(!isDraft ? [
      { path: "/applicants", label: "Ứng viên", icon: Users, count: project.applications },
      { path: "/suggestions", label: "Gợi ý", icon: Sparkles, count: project.matches },
      { path: "/messages", label: "Tin nhắn", icon: MessageCircle, count: undefined },
    ] : []),
  ];

  return <div className="bw-page">
    <a className="bw-skip" href="#bw-main">Đi đến nội dung chính</a>
    <header className="bw-header"><div className="bw-header-inner">
      <Link className="bw-brand" to={`/business/projects${preview}`} aria-label="FREVO, về dự án của tôi"><img src="/assets/frevo-logo.png" alt="FREVO" /></Link>
      <span className="bw-divider" aria-hidden="true" /><span className="bw-workspace">Không gian doanh nghiệp</span>
      <nav className="bw-nav" aria-label="Điều hướng Business"><Link to={`/business/projects${preview}`} aria-current="page">Dự án của tôi</Link></nav>
      <div className="bw-account"><span>Nắng Studio<small>Tài khoản Business</small></span><b aria-label="Tài khoản minh họa Nắng Studio">N</b></div>
    </div></header>

    <main id="bw-main" className="bw-main bw-detail-main">
      <Link className="bw-detail-back" to={`/business/projects${preview}`}><ArrowLeft size={17} aria-hidden="true" /> Dự án của tôi</Link>
      <div className="bw-detail-title"><div><span className={`bw-status ${project.status}`}><i aria-hidden="true" />{isDraft ? "Bản nháp" : "Đang tuyển"}</span><h1>{project.title}</h1><p>{project.category} <span aria-hidden="true">·</span> {project.budget}</p></div><span className="bw-detail-icon"><BriefcaseBusiness size={29} strokeWidth={1.6} aria-hidden="true" /></span></div>
      <nav className="bw-detail-tabs" aria-label="Các mục của dự án">{tabs.map(tab => <Link key={tab.path} to={`${base}${tab.path}${preview}`} aria-current={(section === "brief" && !tab.path) || section === tab.path.slice(1) ? "page" : undefined}><tab.icon size={17} strokeWidth={1.9} aria-hidden="true" /><span>{tab.label}</span>{tab.count !== undefined && <span className="bw-tab-count">{tab.count}</span>}</Link>)}</nav>

      {isDraft ? <section className="bw-detail-panel"><p className="bw-eyebrow">BẢN NHÁP</p><h2>Hoàn thiện brief trước khi công bố</h2><p className="bw-detail-lead">Bản nháp hiện có tên dự án và lĩnh vực. Bước tiếp theo là thêm mô tả, kỹ năng, ngân sách, thời hạn và sản phẩm bàn giao theo đặc tả FREVO.</p><div className="bw-detail-facts"><div><small>TÊN DỰ ÁN</small><strong>{project.title}</strong></div><div><small>LĨNH VỰC</small><strong>{project.category}</strong></div><div><small>NGÂN SÁCH</small><strong>{project.budget}</strong></div></div><p className="bw-detail-note"><Clock3 size={17} aria-hidden="true" /> Màn hình chỉnh sửa brief đầy đủ sẽ là bước tiếp theo của prototype.</p></section> : <>
        {section === "brief" && <BriefContent project={project} />}
        {section === "applicants" && <section className="bw-detail-panel"><p className="bw-eyebrow">HỒ SƠ ỨNG TUYỂN</p><h2>Ứng viên của dự án</h2><p className="bw-detail-lead">Hồ sơ được gắn nhãn Đã đọc hoặc Chưa đọc để bạn dễ theo dõi.</p><div className="bw-person-list">{applicants.map(person => <article className="bw-person" key={person.name}><span className="bw-person-avatar">{person.initials}</span><div className="bw-person-content"><div className="bw-person-heading"><h3>{person.name}</h3><span className={person.status === "Chưa đọc" ? "bw-unread" : "bw-read"}>{person.status}</span></div><p>{person.role} · {person.type}</p><small>Portfolio: {person.portfolio}</small></div><div className="bw-person-end"><strong>{person.budget}</strong><button type="button" onClick={() => setNotice(`Hồ sơ chi tiết của ${person.name} sẽ được thiết kế ở bước tiếp theo.`)}>Xem hồ sơ <ArrowRight size={16} /></button></div></article>)}</div></section>}
        {section === "suggestions" && <section className="bw-detail-panel"><p className="bw-eyebrow">GỢI Ý CHO BRIEF</p><h2>Freelancer phù hợp</h2><p className="bw-detail-lead">Lý do gợi ý được hiển thị để Business tự đánh giá trước khi gửi lời mời.</p><div className="bw-person-list">{suggestions.map(person => <article className="bw-person" key={person.name}><span className="bw-person-avatar">{person.initials}</span><div className="bw-person-content"><h3>{person.name}</h3><p>{person.role}</p><small><Sparkles size={14} aria-hidden="true" /> {person.fit}</small></div><div className="bw-person-end"><button type="button" onClick={() => setNotice(`Hồ sơ và thao tác mời ${person.name} sẽ được thiết kế ở bước tiếp theo.`)}>Xem hồ sơ <ArrowRight size={16} /></button></div></article>)}</div><p className="bw-detail-note">Gợi ý và lý do phù hợp trên trang này chỉ là dữ liệu minh họa.</p></section>}
        {section === "messages" && <section className="bw-detail-panel"><p className="bw-eyebrow">TRAO ĐỔI THEO DỰ ÁN</p><h2>Tin nhắn</h2><p className="bw-detail-lead">Hội thoại chỉ mở sau khi ứng viên được duyệt hoặc đã chấp nhận lời mời hợp lệ.</p><div className="bw-message-preview"><span className="bw-person-avatar">KL</span><div><strong>Khánh Linh</strong><p>Em đã xem brief và gửi thêm hai dự án nhận diện gần đây để anh/chị tham khảo.</p><small>Hội thoại minh họa · Chờ phản hồi</small></div><ArrowRight size={18} aria-hidden="true" /></div></section>}
      </>}
      <p className="bw-footnote">Bản xem trước giao diện Business. Tên, dự án và số liệu là dữ liệu minh họa.</p>
    </main>
    {notice && <div className="bw-toast" role="status"><Check size={17} aria-hidden="true" />{notice}<button type="button" aria-label="Đóng thông báo" onClick={() => setNotice("")}>×</button></div>}
  </div>;
}
