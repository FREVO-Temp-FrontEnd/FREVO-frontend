import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { Drawer, useMediaQuery } from "@mui/material";
import { FreelancerHeader } from "../components/FreelancerHeader";
import { FreelancerNav, type ProjectView } from "../components/FreelancerNav";
import "../freelancer-home.css";

export default function FreelancerLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [navNotice, setNavNotice] = useState("");
  const [mobileNavRoute, setMobileNavRoute] = useState<string | null>(null);
  const isMobileNav = useMediaQuery("(max-width:780px)");
  const mobileNavOpen = mobileNavRoute === location.key;
  const currentPath = location.pathname.replace(/\/+$/, "") || "/";
  const selectedView = new URLSearchParams(location.search).get("view");
  const projectView: ProjectView = selectedView === "saved" || selectedView === "recommended" ? selectedView : "discover";
  const secondaryPaths = ["/freelancer/invitations", "/freelancer/applications", "/team/profile"];
  const hasPageSidebar = currentPath === "/" || currentPath === "/explore" || currentPath === "/projects" || /^\/projects\/[^/]+$/.test(currentPath);
  const skipTarget = currentPath === "/profile"
    ? "#profile-content"
    : currentPath.startsWith("/profile/portfolio/")
      ? "#work-main"
      : "#main";

  const openProjectView = (view: ProjectView) => {
    navigate(view === "discover" ? "/projects" : `/projects?view=${view}`);
  };

  return (
    <>
      <a className="skip-link" href={skipTarget}>
        Đi đến nội dung chính
      </a>
      <FreelancerHeader
        mobileNavOpen={mobileNavOpen}
        onToggleMobileNav={() => setMobileNavRoute(mobileNavOpen ? null : location.key)}
      />
      <Drawer
        anchor="left"
        open={mobileNavOpen && isMobileNav}
        onClose={() => setMobileNavRoute(null)}
        className="freelancer-mobile-drawer"
        sx={{ zIndex: 10000 }}
        slotProps={{ paper: { id: "freelancer-mobile-navigation" } }}
      >
        <FreelancerNav
          view={projectView}
          showBrand
          jobNavId="freelancer-mobile-job-nav-options"
          onViewChange={(view) => {
            setMobileNavRoute(null);
            openProjectView(view);
          }}
          onUnavailable={(label) => {
            setMobileNavRoute(null);
            setNavNotice(`${label} đang được phát triển.`);
          }}
          onNavigate={() => setMobileNavRoute(null)}
        />
      </Drawer>
      {!hasPageSidebar ? (
        <div className="freelancer-secondary-shell">
          <FreelancerNav view={projectView} onViewChange={openProjectView} onUnavailable={(label) => setNavNotice(`${label} đang được phát triển.`)} />
          {secondaryPaths.includes(currentPath)
            ? <main id="main" className="freelancer-secondary-content"><Outlet /></main>
            : <div className="freelancer-secondary-content"><Outlet /></div>}
        </div>
      ) : <Outlet />}
      {navNotice && <div id="nav-notice" role="status" onClick={() => setNavNotice("")}>{navNotice}</div>}
    </>
  );
}
