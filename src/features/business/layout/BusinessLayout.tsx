import { useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  CirclePlus,
  MessageCircleMore,
  UserRound,
  Settings2,
  Check,
  X,
  ExternalLink,
  LogOut,
  ChevronDown,
  LifeBuoy,
} from "lucide-react";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import { useBusiness } from "@/lib/hooks/useBusiness";
import { BusinessNotificationPopover } from "../components/BusinessNotificationPopover";
import { externalNavConfig } from "@/lib/config/navigation";
import { useAuthSession } from "@/lib/hooks/useAuthSession";
import { Avatar, Box, Chip, Menu, MenuItem } from "@mui/material";
import "@/features/business/business.css";

const navItems = [
  { href: "/business", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/business/projects", label: "Dự án của tôi", icon: BriefcaseBusiness },
  { href: "/business/messages", label: "Hộp tin nhắn", icon: MessageCircleMore },
  { href: "/business/projects/new", label: "Đăng dự án", icon: CirclePlus },
];

function isCurrentNavItem(href: string, pathname: string) {
  if (href === "/business") return pathname === href;
  if (href === "/business/projects") {
    return (
      (pathname === href || pathname.startsWith(`${href}/`)) &&
      pathname !== "/business/projects/new" &&
      pathname !== "/business/messages"
    );
  }
  return pathname === href;
}

export function BusinessLayout({ children }: { children?: ReactNode }) {
  const location = useLocation();
  const currentPath = location.pathname.replace(/\/+$/, "") || "/";
  const navigate = useNavigate();
  const { businessName, toast, setToast } = useBusiness();
  const { logout } = useAuthSession();
  const [mobileNav, setMobileNav] = useState(false);
  const [accountMenuAnchor, setAccountMenuAnchor] = useState<HTMLElement | null>(null);

  return (
    <Box
      className="fb-app"
      sx={{
        "&& .fb-button": {
          fontFamily: '"Be Vietnam Pro", sans-serif',
          fontSize: "13px",
          fontWeight: 700,
          letterSpacing: 0,
          lineHeight: 1.35,
          textTransform: "none",
        },
        "&& .fb-button-small": { fontSize: "12px", fontWeight: 600 },
      }}
    >
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
              aria-current={isCurrentNavItem(item.href, currentPath) ? "page" : undefined}
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

          <Box sx={{ "&&": { display: "flex", alignItems: "center", gap: { xs: 2, sm: 3 } } }}>
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
            <BusinessNotificationPopover />
            <Box
              component="button"
              type="button"
              onClick={(event) => setAccountMenuAnchor(event.currentTarget)}
              aria-label={`Tài khoản ${businessName}`}
              aria-haspopup="menu"
              aria-expanded={Boolean(accountMenuAnchor)}
              aria-controls={accountMenuAnchor ? "business-account-menu" : undefined}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.75,
                minWidth: 72,
                height: 42,
                p: "5px 8px 5px 5px",
                borderRadius: 999,
                bgcolor: "#f3f5f3",
                color: "#4e5a62",
                border: "1px solid #e4e6e2",
                cursor: "pointer",
                transition: "background-color 150ms ease",
                "&:hover": { bgcolor: "#e9eeeb" },
                "&:focus-visible": { outline: "2px solid #f4490b", outlineOffset: 3 },
              }}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: "#dfe5e9", color: "#fff" }}>
                <PersonRoundedIcon sx={{ fontSize: 27 }} />
              </Avatar>
              <ChevronDown size={16} strokeWidth={2.5} aria-hidden="true" />
            </Box>
            <Menu
              id="business-account-menu"
              anchorEl={accountMenuAnchor}
              open={Boolean(accountMenuAnchor)}
              onClose={() => setAccountMenuAnchor(null)}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              slotProps={{ paper: { sx: { mt: 1, minWidth: 180, border: "1px solid #e4e6e2", borderRadius: 2, boxShadow: "0 12px 30px rgba(32,32,31,.12)" } } }}
            >
              <MenuItem
                onClick={() => {
                  setAccountMenuAnchor(null);
                  setToast("Kênh hỗ trợ đang được hoàn thiện trong bản xem trước.");
                }}
                sx={{ gap: 1.5, py: 1.25, fontFamily: '"Space Grotesk", Arial, sans-serif', fontSize: 13, fontWeight: 600 }}
              >
                <LifeBuoy size={17} aria-hidden="true" /> Hỗ trợ
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setAccountMenuAnchor(null);
                  logout();
                  navigate("/login", { replace: true, state: {} });
                }}
                sx={{ gap: 1.5, py: 1.25, fontFamily: '"Space Grotesk", Arial, sans-serif', fontSize: 13, fontWeight: 600, color: "#a34a31" }}
              >
                <LogOut size={17} aria-hidden="true" /> Đăng xuất
              </MenuItem>
            </Menu>
          </Box>
        </header>

        <Box
          component="main"
          id="fb-content"
          className="fb-main"
          sx={
            currentPath === "/business/messages"
              ? {
                  "&&": {
                    maxWidth: "none",
                    padding: 0,
                    height: { xs: "calc(100dvh - 60px)", sm: "calc(100dvh - 71px)" },
                    minHeight: "unset",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                  },
                }
              : undefined
          }
        >
          {children ? children : <Outlet />}
        </Box>

        {currentPath !== "/business/messages" && (
          <div className="fb-demo-foot">
            FREVO Business Space · Dữ liệu tương tác được đồng bộ hai chiều với Freelancer Hub qua mockStorage adapter.
          </div>
        )}
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
    </Box>
  );
}
