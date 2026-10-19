import { Link } from "react-router";
import { NotificationsBell } from "./NotificationsBell";
import { useAuthSession } from "@/lib/hooks/useAuthSession";
import { externalNavConfig } from "@/lib/config/navigation";
import { Chip } from "@mui/material";
import { ExternalLink, ArrowLeftRight, Menu } from "lucide-react";

interface FreelancerHeaderProps {
  mobileNavOpen: boolean;
  onToggleMobileNav: () => void;
}

export function FreelancerHeader({ mobileNavOpen, onToggleMobileNav }: FreelancerHeaderProps) {
  const { user, role, switchRole } = useAuthSession();

  const isGuest = role === "guest";
  const displayName = user?.name || (role === "client" ? "Nắng Studio" : "Minh Anh");
  const displayRole = role === "client" ? "Doanh nghiệp" : role === "admin" ? "Quản trị viên" : "Freelancer";
  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || (role === "client" ? "NS" : "MA");

  return (
    <header className="site-header freelancer-header flex items-center justify-between">
      <div className="header-left flex items-center gap-3">
        <button
          type="button"
          className="freelancer-mobile-menu"
          aria-label="Mở menu điều hướng"
          aria-expanded={mobileNavOpen}
          aria-controls="freelancer-mobile-navigation"
          onClick={onToggleMobileNav}
        >
          <Menu size={22} aria-hidden="true" />
        </button>
        <Link to="/" className="freelancer-header-logo" aria-label="FREVO - Khám phá dự án">
          <img className="logo" src="/assets/frevo-logo.png" width={112} height={45} alt="FREVO" />
        </Link>
        <span className="header-divider" aria-hidden="true" />
        <Link to="/projects" className="screen-name hover:text-orange-600 transition-colors">
          {isGuest ? "Khám phá dự án (Khách)" : "Khám phá dự án"}
        </Link>

        {/* Link to external Next.js landing page per Decision 1 */}
        <a
          href={externalNavConfig.landingPageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="freelancer-external-link text-xs font-semibold text-neutral-500 hover:text-neutral-900 flex items-center gap-1 ml-2 transition-colors"
          title="Mở Trang giới thiệu FREVO (Next.js)"
        >
          <span>Trang giới thiệu</span>
          <ExternalLink size={12} />
        </a>
      </div>

      <div className="header-actions flex items-center gap-3">
        {isGuest ? (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="text-sm font-bold text-neutral-800 hover:text-orange-600 px-3 py-1.5 transition-colors"
            >
              Đăng nhập
            </Link>
            <Link
              to="/register"
              className="text-sm font-extrabold text-neutral-900 bg-[#ff6c37] hover:bg-[#ff5518] px-3.5 py-1.5 rounded-full border border-neutral-900 shadow-[2px_2px_0_#20201f] transition-all"
            >
              Đăng ký
            </Link>
          </div>
        ) : (
          <>
            {/* Quick role switcher chip for easy prototype demoing */}
            <Chip
              className="freelancer-role-chip"
              size="small"
              icon={<ArrowLeftRight size={14} />}
              label={`Vai trò: ${displayRole}`}
              clickable
              onClick={() => {
                const nextRole = role === "client" ? "freelancer" : "client";
                switchRole(nextRole);
              }}
              title="Nhấn để đổi nhanh vai trò Doanh nghiệp / Freelancer trong demo"
              sx={{ fontWeight: 600, fontSize: 12, bgcolor: "#fff0e9", color: "#ab2e00" }}
            />

            <NotificationsBell />

            {role === "client" ? (
              <Link
                to="/business"
                className="account flex items-center"
                aria-label="Chuyển đến Không gian Doanh nghiệp"
              >
                <span className="account-copy">
                  <strong>{displayName}</strong>
                  <small className="text-orange-600 font-bold">Bảng quản trị</small>
                </span>
                <span className="avatar grid place-items-center" aria-hidden="true">
                  {initials}
                </span>
              </Link>
            ) : (
              <Link
                to="/profile"
                className="account flex items-center"
                aria-label={`Tài khoản của ${displayName}`}
              >
                <span className="account-copy">
                  <strong>{displayName}</strong>
                  <small>{displayRole}</small>
                </span>
                <span className="avatar grid place-items-center" aria-hidden="true">
                  {initials}
                </span>
              </Link>
            )}

          </>
        )}
      </div>
    </header>
  );
}
