import { useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  UserRound,
  Settings2,
  Bell,
  Check,
  X,
  ExternalLink,
  LogOut,
} from "lucide-react";
import { useBusiness } from "@/lib/hooks/useBusiness";
import { externalNavConfig } from "@/lib/config/navigation";
import { useAuthSession } from "@/lib/hooks/useAuthSession";
import { Chip } from "@mui/material";
import "@/features/business/business.css";

const navItems = [
  { href: "/business", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/business/projects", label: "Dự án của tôi", icon: BriefcaseBusiness },
];

export function BusinessLayout({ children }: { children?: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { businessName, notifications, toast, setToast } = useBusiness();
  const { logout } = useAuthSession();
  const [mobileNav, setMobileNav] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="fb-app">
      <a className="fb-skip" href="#fb-content">
        Đi đến nội dung chính
      </a>

      {/* Sidebar */}
      <aside className={`fb-sidebar ${mobileNav ? "is-open" : ""}`}>
        <Link
          className="fb-brand"
          to="/business"
          onClick={() => setMobileNav(false)}
        >
          <img src="/assets/frevo-logo.png" alt="FREVO" />
          <span>Business</span>
        </Link>

        <div className="fb-side-label">KHÔNG GIAN LÀM VIỆC</div>
        <nav aria-label="Điều hướng Business">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setMobileNav(false)}
              aria-current={
                item.href === "/business"
                  ? location.pathname === item.href
                    ? "page"
                    : undefined
                  : location.pathname.startsWith(item.href)
                  ? "page"
                  : undefined
              }
            >
              <item.icon size={19} strokeWidth={1.8} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="fb-side-label" style={{ marginTop: "24px" }}>
          LIÊN KẾT NGOÀI
        </div>
        <nav aria-label="Liên kết ngoài">
          <a
            href={externalNavConfig.landingPageUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            <ExternalLink size={17} strokeWidth={1.8} />
            <span>Trang giới thiệu (Next.js)</span>
          </a>
        </nav>

        <div className="fb-sidebar-account">
          <div className="fb-side-label">TÀI KHOẢN</div>
          <nav aria-label="Tài khoản Business">
            <Link
              to="/business/profile"
              onClick={() => setMobileNav(false)}
              aria-current={
                location.pathname === "/business/profile" ? "page" : undefined
              }
            >
              <UserRound size={19} strokeWidth={1.8} />
              <span>Hồ sơ</span>
            </Link>
            <Link
              to="/business/settings"
              onClick={() => setMobileNav(false)}
              aria-current={
                location.pathname === "/business/settings" ? "page" : undefined
              }
            >
              <Settings2 size={19} strokeWidth={1.8} />
              <span>Cài đặt</span>
            </Link>
            <button
              type="button"
              onClick={() => {
                setMobileNav(false);
                logout();
                navigate("/login", { replace: true, state: {} });
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "13px",
                minHeight: "47px",
                padding: "0 15px",
                borderRadius: "9px",
                color: "#a34a31",
                fontSize: "13px",
                fontWeight: 700,
                background: "none",
                border: "none",
                width: "100%",
                cursor: "pointer",
                textAlign: "left",
                transition: "background .15s, color .15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#fff0e9";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "none";
              }}
            >
              <LogOut size={19} strokeWidth={1.8} />
              <span>Đăng xuất</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content Wrap */}
      <div className="fb-content-wrap">
        <header className="fb-topbar">
          <button
            className="fb-mobile-menu"
            type="button"
            aria-label={mobileNav ? "Đóng menu" : "Mở menu"}
            aria-expanded={mobileNav}
            onClick={() => setMobileNav(!mobileNav)}
          >
            {mobileNav ? <X size={22} /> : <span>☰</span>}
          </button>

          <span>Không gian doanh nghiệp · {businessName}</span>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Chip
              size="small"
              label="BẢN XEM TRƯỚC"
              sx={{
                fontWeight: 700,
                fontSize: 11,
                bgcolor: "#fff0e9",
                color: "#ab2e00",
                letterSpacing: "0.05em",
              }}
            />
            <Link
              to="/business/notifications"
              aria-label={`Thông báo, ${unreadCount} chưa đọc`}
              style={{ position: "relative" }}
            >
              <Bell size={19} />
              {unreadCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: -4,
                    right: -4,
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: "#ff5e22",
                  }}
                />
              )}
            </Link>
            <span
              className="fb-top-avatar"
              title={businessName}
              aria-label={`Tài khoản ${businessName}`}
            >
              {businessName.charAt(0).toLocaleUpperCase("vi")}
            </span>
            <button
              type="button"
              onClick={() => {
                logout();
                navigate("/login", { replace: true, state: {} });
              }}
              className="fb-button fb-button-secondary fb-button-small"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
              }}
              title="Đăng xuất khỏi tài khoản"
              aria-label="Đăng xuất"
            >
              <LogOut size={15} />
              <span>Đăng xuất</span>
            </button>
          </div>
        </header>

        <main id="fb-content" className="fb-main">
          {children ? children : <Outlet />}
        </main>

        <div className="fb-demo-foot">
          FREVO Business Space · Dữ liệu tương tác được đồng bộ hai chiều với Freelancer Hub qua mockStorage adapter.
        </div>
      </div>

      {mobileNav && (
        <button
          type="button"
          className="fb-scrim"
          aria-label="Đóng menu"
          onClick={() => setMobileNav(false)}
        />
      )}

      {toast && (
        <div className="fb-toast" role="status">
          <Check size={18} />
          {toast}
          <button
            type="button"
            aria-label="Đóng thông báo"
            onClick={() => setToast("")}
          >
            <X size={17} />
          </button>
        </div>
      )}
    </div>
  );
}
