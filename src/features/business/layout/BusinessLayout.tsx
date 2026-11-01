import { useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router";
import {
  UserRound,
  Settings2,
  Check,
  X,
  LogOut,
  ChevronDown,
  LifeBuoy,
  Menu as MenuIcon,
} from "lucide-react";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import { useBusiness } from "@/lib/hooks/useBusiness";
import { BusinessNotificationPopover } from "../components/BusinessNotificationPopover";
import { BusinessNav } from "../components/BusinessNav";
import { useAuthSession } from "@/lib/hooks/useAuthSession";
import { Avatar, Box, Divider, Drawer, IconButton, Menu, MenuItem, Typography, useMediaQuery } from "@mui/material";
import "@/features/business/business.css";

export function BusinessLayout({ children }: { children?: ReactNode }) {
  const location = useLocation();
  const currentPath = location.pathname.replace(/\/+$/, "") || "/";
  const navigate = useNavigate();
  const { businessName, toast, setToast } = useBusiness();
  const { logout } = useAuthSession();
  const [mobileNavRoute, setMobileNavRoute] = useState<string | null>(null);
  const isMobileNav = useMediaQuery("(max-width:899.95px)");
  const mobileNav = mobileNavRoute === location.key;
  const [accountMenuAnchor, setAccountMenuAnchor] = useState<HTMLElement | null>(null);

  return (
    <Box
      className="fb-app"
      sx={{
        "&&": { display: "block" },
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

      <Box component="header" sx={{ bgcolor: "background.paper", borderBottom: "1px solid", borderColor: "divider" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, md: 2 }, minHeight: { xs: 64, md: 76 }, px: { xs: 2, md: 3 }, maxWidth: 1600, mx: "auto" }}>
          <IconButton
            aria-label={mobileNav ? "Đóng menu điều hướng" : "Mở menu điều hướng"}
            aria-expanded={mobileNav && isMobileNav}
            aria-controls="business-mobile-navigation"
            onClick={() => setMobileNavRoute(mobileNav ? null : location.key)}
            sx={{ display: { xs: "inline-flex", md: "none" }, color: "text.primary" }}
          ><MenuIcon size={22} /></IconButton>
          <Box component={Link} to="/business" aria-label="FREVO — Tổng quan doanh nghiệp" sx={{ display: "flex", alignItems: "center", gap: 1.5, flexShrink: 0 }}>
            <Box component="img" src="/assets/frevo-logo.png" alt="FREVO" sx={{ width: { xs: 90, sm: 100 }, height: "auto" }} />
            <Typography component="span" sx={{ display: { xs: "none", sm: "block", md: "none", lg: "block" }, pl: 1.5, borderLeft: "1px solid", borderColor: "divider", fontSize: 12, fontWeight: 700, color: "primary.dark" }}>Business</Typography>
          </Box>
          <Box sx={{ display: { xs: "none", md: "block" }, flex: 1, minWidth: 0, ml: { md: 2, lg: 4 } }}><BusinessNav /></Box>
          <Box sx={{ "&&": { display: "flex", alignItems: "center", gap: { xs: 0.5, sm: 1.5 }, ml: "auto" } }}>
            <BusinessNotificationPopover />
            <Box
              component="button"
              id="business-account-button"
              type="button"
              onClick={(event) => setAccountMenuAnchor(event.currentTarget)}
              aria-label={`Tài khoản ${businessName}`}
              aria-haspopup="menu"
              aria-expanded={Boolean(accountMenuAnchor)}
              aria-controls={accountMenuAnchor ? "business-account-menu" : undefined}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1.25,
                minWidth: 64,
                minHeight: 48,
                p: "4px 8px 4px 12px",
                borderRadius: 3,
                bgcolor: accountMenuAnchor ? "#fff0e9" : "transparent",
                color: "text.primary",
                border: 0,
                cursor: "pointer",
                transition: "background-color 150ms ease",
                "&:hover": { bgcolor: "#f2f3f0" },
                "&:focus-visible": { outline: "2px solid #f4490b", outlineOffset: 3 },
              }}
            >
              <Typography component="span" noWrap sx={{ display: { xs: "none", sm: "block", md: "none", lg: "block" }, maxWidth: 140, fontSize: 13, fontWeight: 700 }}>
                {businessName}
              </Typography>
              <Avatar sx={{ width: 36, height: 36, bgcolor: "primary.dark", color: "#fff" }}>
                <PersonRoundedIcon sx={{ fontSize: 23 }} />
              </Avatar>
              <Box component="span" sx={{ display: "inline-flex", transform: accountMenuAnchor ? "rotate(180deg)" : "none" }}><ChevronDown size={16} strokeWidth={2.5} aria-hidden="true" /></Box>
            </Box>
            <Menu
              id="business-account-menu"
              anchorEl={accountMenuAnchor}
              open={Boolean(accountMenuAnchor)}
              onClose={() => setAccountMenuAnchor(null)}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              slotProps={{
                paper: { sx: { mt: 1, width: 264, maxWidth: "calc(100vw - 32px)", border: "1px solid", borderColor: "divider", borderRadius: "13px", boxShadow: "0 12px 32px rgba(32,32,31,.12)", "& .MuiMenuItem-root": { mx: 1, my: 0.5, px: 1.5, minHeight: 46, borderRadius: "9px", fontSize: 14, fontWeight: 600 } } },
                list: { "aria-labelledby": "business-account-button" },
              }}
            >
              <Box component="li" role="presentation" sx={{ px: 2.5, py: 1, listStyle: "none" }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, overflowWrap: "anywhere" }}>{businessName}</Typography>
                <Typography variant="caption" color="text.secondary">Doanh nghiệp</Typography>
              </Box>
              <Divider component="li" sx={{ mx: 2, mb: 1 }} />
              <MenuItem component={Link} to="/business/profile" selected={currentPath === "/business/profile"} onClick={() => setAccountMenuAnchor(null)} sx={{ gap: 1.5 }}>
                <UserRound size={18} aria-hidden="true" /> Hồ sơ doanh nghiệp
              </MenuItem>
              <MenuItem component={Link} to="/business/settings" selected={currentPath === "/business/settings"} onClick={() => setAccountMenuAnchor(null)} sx={{ gap: 1.5 }}>
                <Settings2 size={18} aria-hidden="true" /> Cài đặt tài khoản
              </MenuItem>
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
        </Box>
      </Box>
      <Drawer
        open={mobileNav && isMobileNav} onClose={() => setMobileNavRoute(null)}
        slotProps={{ paper: { id: "business-mobile-navigation", sx: { width: "min(300px, 85vw)", p: 2 } } }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
          <Box component={Link} to="/business" onClick={() => setMobileNavRoute(null)} aria-label="FREVO Business — Tổng quan">
            <Box component="img" src="/assets/frevo-logo.png" alt="FREVO" sx={{ width: 100, height: "auto" }} />
          </Box>
          <IconButton aria-label="Đóng menu điều hướng" onClick={() => setMobileNavRoute(null)}><X size={20} /></IconButton>
        </Box>
        <BusinessNav mobile onNavigate={() => setMobileNavRoute(null)} />
      </Drawer>
      <div className="fb-content-wrap">
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
                    height: { xs: "calc(100dvh - 65px)", md: "calc(100dvh - 77px)" },
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
