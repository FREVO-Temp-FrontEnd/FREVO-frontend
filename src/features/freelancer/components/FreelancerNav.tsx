import { useState } from "react";
import { Link, NavLink, matchPath, useLocation } from "react-router";
import { BriefcaseBusiness, ChevronDown, ExternalLink, FileText, Mail, MessageCircle, Search, Settings, Sparkles, UserRound, Bookmark, Users } from "lucide-react";
import { useAuthSession } from "@/lib/hooks/useAuthSession";
import { useFreelancer } from "@/lib/hooks/useFreelancer";
import { externalNavConfig } from "@/lib/config/navigation";

export type ProjectView = "discover" | "saved" | "recommended";

interface FreelancerNavProps {
  view: ProjectView;
  onViewChange: (view: ProjectView) => void;
  onUnavailable: (label: string) => void;
  onNavigate?: () => void;
  jobNavId?: string;
  showBrand?: boolean;
}

export function FreelancerNav({ view, onViewChange, onUnavailable, onNavigate, jobNavId = "freelancer-job-nav-options", showBrand = false }: FreelancerNavProps) {
  const location = useLocation();
  const { role, switchRole, isAuthenticated } = useAuthSession();
  const currentPath = location.pathname.replace(/\/+$/, "");
  const applicationsActive = currentPath === "/freelancer/applications";
  const invitationsActive = currentPath === "/freelancer/invitations";
  const teamActive = currentPath === "/team/profile";
  const discoveryActive = currentPath === "" || currentPath === "/explore" || !!matchPath("/projects/*", currentPath);
  const discoverViewActive = discoveryActive && (!isAuthenticated || view === "discover");
  const savedActive = discoveryActive && view === "saved";
  const recommendedActive = discoveryActive && view === "recommended";
  const jobsActive = savedActive || recommendedActive || applicationsActive;
  const navigationKey = location.pathname + location.search;
  const [jobsMenu, setJobsMenu] = useState({ key: navigationKey, open: jobsActive });
  const jobsOpen = jobsMenu.key === navigationKey ? jobsMenu.open : jobsActive;
  const { pendingInvitationsCount } = useFreelancer();
  const showFreelancerItems = isAuthenticated && (role === "freelancer" || role === "client" || applicationsActive || invitationsActive || teamActive);

  const enterFreelancerArea = () => {
    if (role === "client") switchRole("freelancer");
    onNavigate?.();
  };

  const changeJobView = (nextView: ProjectView) => {
    if (role === "client") switchRole("freelancer");
    onViewChange(nextView);
  };

  return <aside className="freelancer-nav" aria-label="Điều hướng freelancer">
    {showBrand && <Link to="/projects" className="freelancer-nav-brand" onClick={onNavigate} aria-label="FREVO Freelancer - Khám phá dự án"><img src="/assets/frevo-logo.png" width={100} height={40} alt="FREVO" /><span>Freelancer</span></Link>}
    <nav aria-label="Freelancer Hub">
      {isAuthenticated && <p className="nav-caption">Freelancer Hub</p>}
      <button type="button" className={`nav-item ${discoverViewActive ? "active" : ""}`} aria-current={discoverViewActive ? "page" : undefined} onClick={() => onViewChange("discover")} title="Khám phá dự án"><Search size={17} /><span>Khám phá dự án</span></button>
      {showFreelancerItems && <div className="job-nav-group">
        <button
          type="button"
          className={`nav-item job-nav-trigger ${jobsActive ? "active" : ""}`}
          aria-expanded={jobsOpen}
          aria-controls={jobNavId}
          onClick={() => setJobsMenu({ key: navigationKey, open: !jobsOpen })}
        >
          <span className="job-nav-icon" aria-hidden="true"><BriefcaseBusiness size={17} /></span>
          <span>Quản lý tìm việc</span>
          <ChevronDown className={`job-nav-chevron ${jobsOpen ? "is-open" : ""}`} size={16} aria-hidden="true" />
        </button>
        {jobsOpen && (
          <div id={jobNavId} className="job-nav-options">
            <button type="button" className={`job-nav-option ${savedActive ? "active" : ""}`} onClick={() => changeJobView("saved")} aria-current={savedActive ? "page" : undefined}><Bookmark size={15} /><span>Việc làm đã lưu</span></button>
            <Link className={`job-nav-option ${applicationsActive ? "active" : ""}`} to="/freelancer/applications" onClick={enterFreelancerArea} aria-current={applicationsActive ? "page" : undefined}><FileText size={15} /><span>Việc làm đã ứng tuyển</span></Link>
            <button type="button" className={`job-nav-option ${recommendedActive ? "active" : ""}`} onClick={() => changeJobView("recommended")} aria-current={recommendedActive ? "page" : undefined}><Sparkles size={15} /><span>Việc làm phù hợp với bạn</span></button>
          </div>
        )}
      </div>}
      {showFreelancerItems && <Link className={`nav-item ${invitationsActive ? "active" : ""}`} to="/freelancer/invitations" onClick={enterFreelancerArea} aria-current={invitationsActive ? "page" : undefined} title="Lời mời tham gia dự án"><Mail size={17} /><span>Lời mời</span>{pendingInvitationsCount > 0 && <span className="nav-invitation-count" aria-label={`${pendingInvitationsCount} lời mời đang chờ`}>{pendingInvitationsCount}</span>}</Link>}
      {showFreelancerItems && <Link className={`nav-item ${teamActive ? "active" : ""}`} to="/team/profile" onClick={enterFreelancerArea} aria-current={teamActive ? "page" : undefined} title="Hồ sơ Nhóm sáng tạo"><Users size={17} /><span>Nhóm</span></Link>}
      {isAuthenticated && <button type="button" className="nav-item" onClick={() => onUnavailable("Tin nhắn")} title="Tin nhắn"><MessageCircle size={17} /><span>Tin nhắn</span></button>}
    </nav>
    {isAuthenticated && <div className="nav-footer">
      <p className="nav-caption">Hồ sơ &amp; tài khoản</p>
      <NavLink className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`} to="/profile" onClick={onNavigate} title="Hồ sơ & Portfolio"><UserRound size={17} /><span>Hồ sơ &amp; Portfolio</span></NavLink>
      <NavLink className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`} to="/settings" onClick={onNavigate} title="Cài đặt"><Settings size={16} /><span>Cài đặt</span></NavLink>
      <a className="nav-item" href={externalNavConfig.landingPageUrl} target="_blank" rel="noopener noreferrer"><ExternalLink size={16} /><span>Trang giới thiệu</span></a>
    </div>}
  </aside>;
}
