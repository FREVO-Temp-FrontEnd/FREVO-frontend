import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router";
import { NotificationsBell } from "./NotificationsBell";
import { useAuthSession } from "@/lib/hooks/useAuthSession";
import { Box, Button, Divider, ListItemIcon, Menu as AccountMenu, MenuItem, Typography } from "@mui/material";
import { ChevronDown, FolderOpen, Settings, LogOut, Menu, UserRound } from "lucide-react";

interface FreelancerHeaderProps {
  navigation?: ReactNode;
  mobileNavOpen?: boolean;
  onToggleMobileNav?: () => void;
}

export function FreelancerHeader({ navigation, mobileNavOpen, onToggleMobileNav }: FreelancerHeaderProps = {}) {
  const { user, role, logout } = useAuthSession();
  const navigate = useNavigate();
  const [accountAnchor, setAccountAnchor] = useState<HTMLElement | null>(null);

  const [accountHover, setAccountHover] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelAccountClose = () => {
    if (closeTimer.current !== null) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };
  const scheduleAccountClose = () => {
    cancelAccountClose();
    closeTimer.current = setTimeout(() => setAccountAnchor(null), 160);
  };
  useEffect(() => () => {
    if (closeTimer.current !== null) clearTimeout(closeTimer.current);
  }, []);

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

      <div className="freelancer-header-navigation">{navigation}</div>

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
              <Button
                id="freelancer-account-button"
                aria-haspopup="menu"
                aria-expanded={Boolean(accountAnchor)}
                aria-controls={accountAnchor ? "freelancer-account-menu" : undefined}
                onPointerEnter={(event) => {
                  if (event.pointerType !== "mouse") return;
                  cancelAccountClose();
                  setAccountHover(true);
                  setAccountAnchor(event.currentTarget);
                }}
                onPointerLeave={(event) => {
                  if (event.pointerType === "mouse") scheduleAccountClose();
                }}
                onClick={(event) => {
                  cancelAccountClose();
                  setAccountHover(false);
                  setAccountAnchor(event.currentTarget);
                }}
                className="account flex items-center gap-2"
                aria-label={`Tài khoản của ${displayName}`}
              >
                <span className="avatar grid place-items-center w-8 h-8 rounded-full bg-orange-600 text-white text-xs font-bold" aria-hidden="true">
                  {initials}
                </span>
                <ChevronDown size={15} aria-hidden="true" className={`account-chevron ${accountAnchor ? "is-open" : ""}`} />
              </Button>
            )}

            {role !== "client" && <AccountMenu
              id="freelancer-account-menu"
              anchorEl={accountAnchor}
              open={Boolean(accountAnchor)}
              onClose={() => { cancelAccountClose(); setAccountAnchor(null); }}
              autoFocus={!accountHover}
              disableAutoFocusItem={accountHover}
              disableEnforceFocus={accountHover}
              disableScrollLock={accountHover}
              sx={accountHover ? { pointerEvents: "none" } : undefined}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              slotProps={{
                paper: {
                  onPointerEnter: cancelAccountClose,
                  onPointerLeave: scheduleAccountClose,
                  sx: {
                    pointerEvents: "auto",
                    mt: 1, width: 264, maxWidth: "calc(100vw - 32px)", borderRadius: "13px",
                    border: "1px solid", borderColor: "divider",
                    boxShadow: "0 12px 32px rgba(32, 32, 31, 0.12)",
                    "& .MuiMenuItem-root": { mx: 1, my: 0.5, px: 1.5, minHeight: 46, borderRadius: "9px", fontSize: 14, fontWeight: 600 },
                    "& .MuiMenuItem-root:hover, & .MuiMenuItem-root.Mui-focusVisible": { bgcolor: "action.hover", color: "primary.dark" },
                  },
                },
                list: { "aria-labelledby": "freelancer-account-button", sx: { py: 1 } },
              }}
            >
              <Box component="li" role="presentation" sx={{ px: 2.5, pt: 1, pb: 1.5, listStyle: "none" }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, overflowWrap: "anywhere" }}>
                  {displayName} <Box component="span" sx={{ color: "text.secondary", fontWeight: 400 }}>({displayRole})</Box>
                </Typography>
              </Box>
              <Divider component="li" sx={{ mx: 2, mb: 1 }} />
              <MenuItem component={Link} to="/profile" onClick={() => setAccountAnchor(null)}>
                <ListItemIcon><UserRound size={18} aria-hidden="true" /></ListItemIcon>
                Hồ sơ cá nhân
              </MenuItem>
              {role === "freelancer" && <MenuItem component={Link} to="/profile/portfolio" onClick={() => setAccountAnchor(null)}><ListItemIcon><FolderOpen size={18} aria-hidden="true" /></ListItemIcon>Quản lý portfolio cá nhân</MenuItem>}
              <MenuItem component={Link} to="/settings" onClick={() => setAccountAnchor(null)}><ListItemIcon><Settings size={18} aria-hidden="true" /></ListItemIcon>Cài đặt tài khoản</MenuItem>
              <Divider component="li" sx={{ mx: 2, my: 1 }} />
              <MenuItem onClick={() => { setAccountAnchor(null); logout(); navigate("/login", { replace: true, state: {} }); }}>
                <ListItemIcon><LogOut size={18} aria-hidden="true" /></ListItemIcon>
                Đăng xuất
              </MenuItem>
            </AccountMenu>}

            {role === "client" && <Button
              size="small"
              onClick={() => {
                logout();
                navigate("/login", { replace: true, state: {} });
              }}
              sx={{ color: "text.secondary", textTransform: "none", fontSize: 12, minWidth: "auto", px: 1 }}
            >
              Đăng xuất
            </Button>}
          </>
        )}
      </div>
    </header>
  );
}
