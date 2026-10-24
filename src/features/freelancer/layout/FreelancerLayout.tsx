import { useState } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router";
import { Box, Drawer, ThemeProvider, useMediaQuery } from "@mui/material";
import { FreelancerHeader } from "../components/FreelancerHeader";
import { FreelancerNav, type ProjectView } from "../components/FreelancerNav";
import { freelancerTheme } from "@/app/theme/freelancerTheme";
import { useAuthSession } from "@/lib/hooks/useAuthSession";
import "../freelancer-home.css";

export default function FreelancerLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { role } = useAuthSession();
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

  const legacyChatMatch = currentPath.match(/^\/projects\/([^/]+)\/chat$/);
  if ((role === "client" || role === "admin") && legacyChatMatch) {
    const projectId = legacyChatMatch[1];
    const talentId = new URLSearchParams(location.search).get("talent");
    const inboxParams = new URLSearchParams({ view: "project", scope: projectId });
    if (talentId) {
      inboxParams.set("project", projectId);
      inboxParams.set("talent", talentId);
    }
    return <Navigate to={`/business/messages?${inboxParams.toString()}`} replace />;
  }

  const legacyAgreementMatch = currentPath.match(/^\/projects\/([^/]+)\/agreement$/);
  if ((role === "client" || role === "admin") && legacyAgreementMatch) {
    const projectId = legacyAgreementMatch[1];
    return <Navigate to={`/business/projects/${projectId}/agreement${location.search}`} replace />;
  }

  const legacyWorkspaceMatch = currentPath.match(/^\/workspace\/([^/]+)$/);
  if ((role === "client" || role === "admin") && legacyWorkspaceMatch) {
    const projectId = legacyWorkspaceMatch[1];
    return <Navigate to={`/business/projects/${projectId}/progress${location.search}`} replace />;
  }

  return (
    <ThemeProvider theme={freelancerTheme}>
      <Box sx={{ display: "contents", "--line": freelancerTheme.palette.divider }}>
      <a className="skip-link" href={skipTarget}>
        Đi đến nội dung chính
      </a>
      <FreelancerHeader
        navigation={<FreelancerNav view={projectView} onViewChange={openProjectView} onUnavailable={(label) => setNavNotice(`${label} đang được phát triển.`)} />}
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
          {secondaryPaths.includes(currentPath)
            ? <main id="main" className="freelancer-secondary-content"><Outlet /></main>
            : <div className="freelancer-secondary-content"><Outlet /></div>}
        </div>
      ) : <Outlet />}
      {navNotice && <div id="nav-notice" role="status" onClick={() => setNavNotice("")}>{navNotice}</div>}
      </Box>
    </ThemeProvider>
  );
}
