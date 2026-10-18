import { Link } from "react-router";
import { NotificationsBell } from "./NotificationsBell";
import { useAuthSession } from "@/lib/hooks/useAuthSession";
import { useFreelancer } from "@/lib/hooks/useFreelancer";
import { externalNavConfig } from "@/lib/config/navigation";
import { Button, Chip } from "@mui/material";
import { ExternalLink, ArrowLeftRight, Mail, Briefcase, Users } from "lucide-react";

export function FreelancerHeader() {
  const { user, role, switchRole } = useAuthSession();
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
    <header className="site-header freelancer-header flex items-center justify-between">
      <div className="header-left flex items-center gap-3">
        <Link to="/" aria-label="FREVO - Khám phá dự án">
          <img className="logo" src="/assets/frevo-logo.png" width={112} height={45} alt="FREVO" />
        </Link>
        <span className="header-divider" aria-hidden="true" />
        <Link to="/projects" className="screen-name hover:text-orange-600 transition-colors">
          {isGuest ? "Khám phá dự án (Khách)" : "Khám phá dự án"}
        </Link>

        {/* Freelancer Invitations Link (FL-010) */}
        {!isGuest && (
          <Link
            to="/freelancer/invitations"
            className="text-xs font-bold text-neutral-700 hover:text-orange-600 flex items-center gap-1.5 ml-2 px-2.5 py-1 rounded-full bg-neutral-100 hover:bg-orange-50 transition-colors"
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
        )}

        {/* Freelancer Applications Link (FL-009) */}
        {!isGuest && (
          <Link
            to="/freelancer/applications"
            className="text-xs font-bold text-neutral-700 hover:text-orange-600 flex items-center gap-1.5 ml-1 px-2.5 py-1 rounded-full bg-neutral-100 hover:bg-orange-50 transition-colors"
            title="Quản lý các dự án đã ứng tuyển (FL-009)"
          >
            <Briefcase size={13} />
            <span>Đã ứng tuyển</span>
          </Link>
        )}

        {/* Team Profile Link (TEAM-001) */}
        {!isGuest && (
          <Link
            to="/team/profile"
            className="text-xs font-bold text-neutral-700 hover:text-orange-600 flex items-center gap-1.5 ml-1 px-2.5 py-1 rounded-full bg-neutral-100 hover:bg-orange-50 transition-colors"
            title="Hồ sơ Nhóm sáng tạo & Phân quyền (TEAM-001)"
          >
            <Users size={13} />
            <span>Nhóm (Team)</span>
          </Link>
        )}

        {/* Link to external Next.js landing page per Decision 1 */}
        <a
          href={externalNavConfig.landingPageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 flex items-center gap-1 ml-2 transition-colors"
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

            <Button
              size="small"
              onClick={() => {
                switchRole("guest");
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
