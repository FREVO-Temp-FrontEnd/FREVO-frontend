import { Link } from "react-router";
import { Bookmark, BriefcaseBusiness, FileText, MessageCircle, Search, Settings, UserRound } from "lucide-react";

export type ProjectView = "discover" | "applications" | "saved";

interface FreelancerNavProps {
  view: ProjectView;
  onViewChange: (view: ProjectView) => void;
  onUnavailable: (label: string) => void;
}

export function FreelancerNav({ view, onViewChange, onUnavailable }: FreelancerNavProps) {
  return <aside className="freelancer-nav" aria-label="Điều hướng freelancer">
    <nav aria-label="Freelancer Hub">
      <p className="nav-caption">Freelancer Hub</p>
      <button type="button" className={`nav-item ${view === "discover" ? "active" : ""}`} aria-current={view === "discover" ? "page" : undefined} onClick={() => onViewChange("discover")} title="Khám phá dự án"><Search size={17} /><span>Khám phá dự án</span></button>
      <button type="button" className={`nav-item ${view === "applications" ? "active" : ""}`} aria-current={view === "applications" ? "page" : undefined} onClick={() => onViewChange("applications")} title="Ứng tuyển của tôi"><FileText size={17} /><span>Ứng tuyển của tôi</span></button>
      <button type="button" className="nav-item" onClick={() => onUnavailable("Dự án đang làm")} title="Dự án đang làm"><BriefcaseBusiness size={17} /><span>Dự án đang làm</span></button>
      <button type="button" className="nav-item" onClick={() => onUnavailable("Tin nhắn")} title="Tin nhắn"><MessageCircle size={17} /><span>Tin nhắn</span><span className="nav-badge">3</span></button>
      <button type="button" className={`nav-item ${view === "saved" ? "active" : ""}`} aria-current={view === "saved" ? "page" : undefined} onClick={() => onViewChange("saved")} title="Dự án đã lưu"><Bookmark size={17} /><span>Dự án đã lưu</span></button>
    </nav>
    <div className="nav-footer">
      <p className="nav-caption">Hồ sơ &amp; tài khoản</p>
      <Link className="nav-item" to="/profile" title="Hồ sơ & Portfolio"><UserRound size={17} /><span>Hồ sơ &amp; Portfolio</span></Link>
      <button type="button" className="nav-item" onClick={() => onUnavailable("Cài đặt")} title="Cài đặt"><Settings size={16} /><span>Cài đặt</span></button>
    </div>
  </aside>;
}
