import type { ReactNode } from "react";
import { Link } from "react-router";
import { Box, Button, Paper, Typography } from "@mui/material";
import { Building2, Settings2 } from "lucide-react";
import { accountPanelSx } from "./businessAccountStyles";

export function BusinessAccountLayout({ page, children }: { page: "profile" | "settings"; children: ReactNode }) {
  return (
    <Box
      sx={(theme) => ({
        maxWidth: 1160,
        mx: "auto",
        minWidth: 0,
        fontFamily: theme.typography.fontFamily,
        "&& h1, && h2, && h3": {
          fontFamily: theme.typography.h2.fontFamily,
          letterSpacing: "-0.02em",
        },
        "&& .MuiButton-root": {
          fontFamily: theme.typography.fontFamily,
          textTransform: "none",
          minHeight: 40,
          fontWeight: 700,
          fontSize: 13.5,
          borderRadius: 999,
        },
        "&& a.MuiButton-contained, && .MuiButton-contained": {
          color: "#ffffff !important",
          bgcolor: "primary.dark",
          boxShadow: "0 1px 3px rgba(189, 61, 20, 0.25)",
          "& *": { color: "#ffffff !important" },
          "&:hover": {
            bgcolor: "primary.main",
            boxShadow: "0 4px 12px rgba(189, 61, 20, 0.35)",
          },
        },
        "& .MuiOutlinedInput-root": {
          borderRadius: "12px",
          bgcolor: "background.paper",
        },
        "& section[id]": {
          scrollMarginTop: 100,
        },
      })}
    >
      {/* Page Header */}
      <Box component="header" sx={{ mb: 3 }}>
        <Typography
          component="h1"
          sx={{
            fontSize: { xs: 28, sm: 34 },
            fontWeight: 800,
            lineHeight: 1.2,
            color: "text.primary",
          }}
        >
          {page === "profile" ? "Hồ sơ doanh nghiệp" : "Cài đặt tài khoản"}
          <Box component="span" sx={{ color: "primary.main" }}>
            .
          </Box>
        </Typography>
        <Typography sx={{ mt: 0.75, fontSize: 15, lineHeight: 1.6, color: "text.secondary", maxWidth: 680 }}>
          {page === "profile"
            ? "Thông tin nhận diện, hồ sơ năng lực và cách thức liên hệ của bạn trong hệ sinh thái FREVO."
            : "Cập nhật thông tin đơn vị tuyển dụng, phương thức liên lạc và tùy chọn thông báo."}
        </Typography>
      </Box>

      {/* Navigation Sub-Tabs */}
      <Box
        component="nav"
        aria-label="Hồ sơ và cài đặt doanh nghiệp"
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1.25,
          mb: 3.5,
        }}
      >
        {([
          { value: "profile", label: "Hồ sơ doanh nghiệp", icon: Building2 },
          { value: "settings", label: "Cài đặt tài khoản", icon: Settings2 },
        ] as const).map(({ value, label, icon: Icon }) => {
          const isActive = page === value;
          return (
            <Button
              key={value}
              component={Link}
              to={`/business/${value}`}
              aria-current={isActive ? "page" : undefined}
              startIcon={<Icon size={16} />}
              sx={{
                px: 2.5,
                border: "1px solid",
                borderColor: isActive ? "primary.dark" : "divider",
                bgcolor: isActive ? "primary.dark" : "background.paper",
                color: isActive ? "#ffffff !important" : "text.primary",
                boxShadow: isActive ? "0 1px 3px rgba(189, 61, 20, 0.25)" : "0 1px 2px rgba(16, 24, 40, 0.04)",
                transition: "all 0.15s ease",
                "& *": {
                  color: isActive ? "#ffffff !important" : "inherit",
                },
                "&:hover": {
                  bgcolor: isActive ? "primary.main" : "#f8fafc",
                  borderColor: isActive ? "primary.main" : "#b0b8c4",
                },
              }}
            >
              {label}
            </Button>
          );
        })}
      </Box>

      {children}
    </Box>
  );
}

export function BusinessAccountSection({
  title,
  description,
  id,
  children,
}: {
  title: string;
  description?: string;
  id?: string;
  children: ReactNode;
}) {
  return (
    <Paper component="section" id={id} aria-labelledby={id ? `${id}-title` : undefined} elevation={0} sx={accountPanelSx}>
      <Box
        sx={{
          px: { xs: 2.25, sm: 3 },
          py: 2,
          bgcolor: "#fcfdfd",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography
          id={id ? `${id}-title` : undefined}
          component="h2"
          sx={{ fontSize: { xs: 17, sm: 19 }, fontWeight: 800, fontFamily: "Archivo, Arial, sans-serif" }}
        >
          {title}
        </Typography>
        {description && (
          <Typography sx={{ mt: 0.5, fontSize: 13, lineHeight: 1.5, color: "text.secondary" }}>
            {description}
          </Typography>
        )}
      </Box>
      <Box sx={{ p: { xs: 2.25, sm: 3 } }}>{children}</Box>
    </Paper>
  );
}

export function BusinessAccountDetail({ label, value }: { label: string; value?: string }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography component="dt" sx={{ fontSize: 11.5, fontWeight: 700, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.04em", mb: 0.5 }}>
        {label}
      </Typography>
      <Typography component="dd" sx={{ m: 0, fontSize: 15, fontWeight: 600, color: value ? "text.primary" : "text.secondary", lineHeight: 1.5, overflowWrap: "anywhere", whiteSpace: "pre-line" }}>
        {value || "Chưa cập nhật"}
      </Typography>
    </Box>
  );
}
