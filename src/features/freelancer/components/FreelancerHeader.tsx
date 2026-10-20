import { Link, useNavigate } from "react-router";
import { NotificationsBell } from "./NotificationsBell";
import { useAuthSession } from "@/lib/hooks/useAuthSession";
import { useFreelancer } from "@/lib/hooks/useFreelancer";
import { externalNavConfig } from "@/lib/config/navigation";
import { Button } from "@mui/material";
import { ExternalLink, Mail, Briefcase, Users, Menu } from "lucide-react";

interface FreelancerHeaderProps {
  mobileNavOpen?: boolean;
  onToggleMobileNav?: () => void;
}

export function FreelancerHeader({ mobileNavOpen, onToggleMobileNav }: FreelancerHeaderProps = {}) {
  const { user, role, logout } = useAuthSession();
  const navigate = useNavigate();
  const { pendingInvitationsCount } = useFreelancer();

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
    <header className="site-header freelancer-header flex items-center justify-between px-4 py-2 border-b border-neutral-200 bg-white">
      <div className="header-left flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
        {onToggleMobileNav && (
          <button
            type="button"
            className="freelancer-mobile-menu md:hidden p-1.5 rounded text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
            aria-label="Mở menu điều hướng"
            aria-expanded={mobileNavOpen}
            aria-controls="freelancer-mobile-navigation"
            onClick={onToggleMobileNav}
          >
            <Menu size={22} aria-hidden="true" />
          </button>
        )}
        <Link to="/" aria-label="FREVO - Khám phá dự án" className="freelancer-header-logo shrink-0">
          <img className="logo h-8 sm:h-9 w-auto" src="/assets/frevo-logo.png" width={112} height={45} alt="FREVO" />
        </Link>
        <span className="header-divider hidden sm:inline-block w-px h-5 bg-neutral-300" aria-hidden="true" />
        <Link to="/projects" className="screen-name text-xs sm:text-sm font-bold text-neutral-800 hover:text-orange-600 transition-colors whitespace-nowrap">
          {isGuest ? "Khám phá dự án (Khách)" : "Khám phá dự án"}
        </Link>

        {/* Freelancer navigation links - shown on medium and desktop screens */}
        {!isGuest && (
          <div className="hidden md:flex items-center gap-1.5 ml-1">
            <Link
              to="/freelancer/invitations"
              className="text-xs font-bold text-neutral-700 hover:text-orange-600 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-100 hover:bg-orange-50 transition-colors whitespace-nowrap"
              title="Xem các lời mời hợp tác từ Doanh nghiệp (FL-010)"
            >
              <Mail size={13} />
              <span>Lời mời</span>
              {pendingInvitationsCount > 0 && (
                <span className="bg-orange-600 text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded-full leading-tight">
                  {pendingInvitationsCount}
                </span>
              )}
            </Link>

            <Link
              to="/freelancer/applications"
              className="text-xs font-bold text-neutral-700 hover:text-orange-600 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-100 hover:bg-orange-50 transition-colors whitespace-nowrap"
              title="Quản lý các dự án đã ứng tuyển (FL-009)"
            >
              <Briefcase size={13} />
              <span>Đã ứng tuyển</span>
            </Link>

            <Link
              to="/team/profile"
              className="text-xs font-bold text-neutral-700 hover:text-orange-600 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-100 hover:bg-orange-50 transition-colors whitespace-nowrap"
              title="Hồ sơ Nhóm sáng tạo & Phân quyền (TEAM-001)"
            >
              <Users size={13} />
              <span>Nhóm (Team)</span>
            </Link>
          </div>
        )}

        {/* Link to external Next.js landing page per Decision 1 */}
        <a
          href={externalNavConfig.landingPageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="freelancer-external-link hidden lg:flex text-xs font-semibold text-neutral-500 hover:text-neutral-900 items-center gap-1 ml-2 transition-colors whitespace-nowrap"
          title="Mở Trang giới thiệu FREVO (Next.js)"
        >
          <span>Trang giới thiệu</span>
          <ExternalLink size={12} />
        </a>
      </div>

      <div className="header-actions flex items-center gap-2 sm:gap-3 shrink-0">
        {isGuest ? (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="text-xs sm:text-sm font-bold text-neutral-800 hover:text-orange-600 px-2 sm:px-3 py-1.5 transition-colors"
            >
              Đăng nhập
            </Link>
            <Link
              to="/register"
              className="text-xs sm:text-sm font-extrabold text-neutral-900 bg-[#ff6c37] hover:bg-[#ff5518] px-2.5 sm:px-3.5 py-1.5 rounded-full border border-neutral-900 shadow-[2px_2px_0_#20201f] transition-all whitespace-nowrap"
            >
              Đăng ký
            </Link>
          </div>
        ) : (
          <>
            <NotificationsBell />

            {role === "client" ? (
              <Link
                to="/business"
                className="account flex items-center gap-2"
                aria-label="Chuyển đến Không gian Doanh nghiệp"
              >
                <span className="account-copy hidden sm:inline-block text-right">
                  <strong className="block text-xs font-bold text-neutral-900">{displayName}</strong>
                  <small className="text-orange-600 font-bold text-[11px]">Bảng quản trị</small>
                </span>
                <span className="avatar grid place-items-center w-8 h-8 rounded-full bg-neutral-900 text-white text-xs font-bold" aria-hidden="true">
                  {initials}
                </span>
              </Link>
            ) : (
              <Link
                to="/profile"
                className="account flex items-center gap-2"
                aria-label={`Tài khoản của ${displayName}`}
              >
                <span className="account-copy hidden sm:inline-block text-right">
                  <strong className="block text-xs font-bold text-neutral-900">{displayName}</strong>
                  <small className="text-neutral-500 text-[11px]">{displayRole}</small>
                </span>
                <span className="avatar grid place-items-center w-8 h-8 rounded-full bg-orange-600 text-white text-xs font-bold" aria-hidden="true">
                  {initials}
                </span>
              </Link>
            )}

            <Button
              size="small"
              onClick={() => {
                logout();
                navigate("/login", { replace: true, state: {} });
              }}
              sx={{ color: "text.secondary", textTransform: "none", fontSize: 12, minWidth: "auto", px: 1 }}
            >
              Đăng xuất
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
