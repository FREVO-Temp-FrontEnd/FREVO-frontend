import { Link, useNavigate } from "react-router";
import { NotificationsBell } from "./NotificationsBell";
import { useAuthSession } from "@/lib/hooks/useAuthSession";
import { Button } from "@mui/material";
import { Menu } from "lucide-react";

interface FreelancerHeaderProps {
  mobileNavOpen?: boolean;
  onToggleMobileNav?: () => void;
}

export function FreelancerHeader({ mobileNavOpen, onToggleMobileNav }: FreelancerHeaderProps = {}) {
  const { user, role, logout } = useAuthSession();
  const navigate = useNavigate();

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
