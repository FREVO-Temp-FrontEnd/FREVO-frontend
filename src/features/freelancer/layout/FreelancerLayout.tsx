import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { Typography } from "@mui/material";
import { FreelancerHeader } from "../components/FreelancerHeader";
import { GuestBanner } from "@/features/public/components/GuestBanner";
import { useAuthSession } from "@/lib/hooks/useAuthSession";
import { isDemoMode } from "@/lib/api/projectsApi";
import { FreelancerNav, type ProjectView } from "../components/FreelancerNav";
import "../freelancer-home.css";

export default function FreelancerLayout() {
  const { role } = useAuthSession();
  const location = useLocation();
  const navigate = useNavigate();
  const [navNotice, setNavNotice] = useState("");
  const currentPath = location.pathname.replace(/\/+$/, "") || "/";
  const secondaryPaths = ["/freelancer/invitations", "/freelancer/applications", "/team/profile"];
  const showSecondaryNav = secondaryPaths.includes(currentPath);
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
      {role === "guest" && <GuestBanner />}
      <FreelancerHeader />
      {isDemoMode && (
        <Typography
          sx={{
            minHeight: "44px",
            py: "10px",
            px: { xs: "16px", sm: "28px" },
            bgcolor: "#fff0e9",
            color: "#ab2e00",
            fontSize: 13,
            lineHeight: 1.4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          Prototype dùng dữ liệu minh họa — thao tác ứng tuyển không gửi dữ liệu thật.
        </Typography>
      )}
      {showSecondaryNav ? (
        <div className="freelancer-secondary-shell">
          <FreelancerNav view="discover" onViewChange={openProjectView} onUnavailable={(label) => setNavNotice(`${label} đang được phát triển.`)} />
          <main id="main" className="freelancer-secondary-content"><Outlet /></main>
        </div>
      ) : <Outlet />}
      {navNotice && <div id="nav-notice" role="status" onClick={() => setNavNotice("")}>{navNotice}</div>}
    </>
  );
}
