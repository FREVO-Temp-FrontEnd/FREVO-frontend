import type { ReactNode } from "react";
import { Box, Paper, Typography } from "@mui/material";
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
      {page === "settings" && (
        <Box component="header" sx={{ mb: 3 }}>
          <Typography component="h1" sx={{ fontSize: { xs: 28, sm: 34 }, fontWeight: 800 }}>
            Cài đặt tài khoản
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Quản lý đăng nhập, bảo mật và tùy chọn thông báo.
          </Typography>
        </Box>
      )}
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
