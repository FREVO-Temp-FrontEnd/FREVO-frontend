import { Box, Button } from "@mui/material";
import { BriefcaseBusiness, CirclePlus, Layers3, LayoutDashboard, MessageCircleMore } from "lucide-react";
import { Link, useLocation } from "react-router";

const navItems = [
  { href: "/business", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/business/projects/new", label: "Đăng dự án", icon: CirclePlus },
  { href: "/business/projects", label: "Dự án của tôi", icon: BriefcaseBusiness },
  { href: "/business/ongoing", label: "Đang tiến hành", icon: Layers3 },
  { href: "/business/messages", label: "Hộp tin nhắn", icon: MessageCircleMore },
];

function isCurrentNavItem(href: string, pathname: string) {
  if (href === "/business") return pathname === href;
  if (href === "/business/ongoing") return pathname === href || pathname.startsWith(`${href}/`);
  if (href === "/business/projects") {
    return (pathname === href || pathname.startsWith(`${href}/`) || pathname.startsWith("/payments/"))
      && pathname !== "/business/projects/new";
  }
  return pathname === href;
}

export function BusinessNav({ mobile = false, onNavigate }: { mobile?: boolean; onNavigate?: () => void }) {
  const { pathname } = useLocation();
  const currentPath = pathname.replace(/\/+$/, "") || "/";

  return (
    <Box component="nav" aria-label="Điều hướng Business" sx={{ display: "flex", flexDirection: mobile ? "column" : "row", alignItems: mobile ? "stretch" : "center", gap: mobile ? 0.5 : { md: 0.5, lg: 0.75 }, minWidth: 0 }}>
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = isCurrentNavItem(href, currentPath);
        return <Button
          key={href} component={Link} to={href} onClick={onNavigate}
          aria-current={active ? "page" : undefined}
          startIcon={<Icon size={17} strokeWidth={1.8} aria-hidden="true" />}
          sx={{
            "&&": {
              justifyContent: "flex-start", minWidth: 0, minHeight: 44, px: mobile ? 2 : { md: 0.875, lg: 1.25 },
              borderRadius: "9px", border: "1px solid", borderColor: active ? "#ffd4c3" : "transparent",
              bgcolor: active ? "#fff0e9" : "transparent", color: active ? "primary.dark" : "text.secondary",
              fontSize: mobile ? 13 : { md: 12, lg: 13 }, fontWeight: 700, whiteSpace: "nowrap", textTransform: "none",
              "&:hover": { bgcolor: active ? "#fff0e9" : "action.hover", color: "primary.dark" },
              "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: 2 },
              "& .MuiButton-startIcon": { display: mobile ? "inline-flex" : { md: "none", lg: "inline-flex" }, mr: 1 },
            },
          }}
        >{label}</Button>;
      })}
    </Box>
  );
}
