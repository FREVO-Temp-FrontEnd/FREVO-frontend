import { Box, Button, Typography, Container, IconButton } from "@mui/material";
import { Sparkles, ArrowRight, ExternalLink, X } from "lucide-react";
import { Link } from "react-router";
import { externalNavConfig } from "@/lib/config/navigation";

interface GuestBannerProps {
  onDismiss?: () => void;
}

export function GuestBanner({ onDismiss }: GuestBannerProps) {
  return (
    <Box
      sx={{
        bgcolor: "#fff4ef",
        borderBottom: "1px solid #fbd9c9",
        py: 1.5,
        px: 2,
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "primary.main",
              color: "#20201f",
              borderRadius: "50%",
              p: 0.75,
            }}
          >
            <Sparkles size={16} />
          </Box>
          <Typography variant="body2" sx={{ color: "#20201f", fontWeight: 500, fontSize: 13.5 }}>
            <strong>Chế độ khám phá công khai:</strong> Bạn đang xem các dự án sáng tạo trên FREVO. Đăng ký tài khoản hoặc đăng nhập để nộp hồ sơ, trao đổi trực tiếp và ký kết hợp đồng.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexShrink: 0 }}>
          <Button
            component="a"
            href={externalNavConfig.landingPageUrl}
            target="_blank"
            rel="noopener noreferrer"
            size="small"
            endIcon={<ExternalLink size={14} />}
            sx={{
              color: "#686c69",
              textTransform: "none",
              fontSize: 13,
              fontWeight: 600,
              "&:hover": { color: "#20201f" },
            }}
          >
            Giới thiệu FREVO
          </Button>

          <Button
            component={Link}
            to="/login"
            variant="outlined"
            size="small"
            sx={{
              borderColor: "#20201f",
              color: "#20201f",
              textTransform: "none",
              fontWeight: 700,
              fontSize: 13,
              borderRadius: "999px",
              px: 2,
              "&:hover": { bgcolor: "#f5f0eb", borderColor: "#20201f" },
            }}
          >
            Đăng nhập
          </Button>

          <Button
            component={Link}
            to="/register"
            variant="contained"
            color="primary"
            size="small"
            endIcon={<ArrowRight size={14} />}
            sx={{
              bgcolor: "primary.main",
              color: "#20201f",
              textTransform: "none",
              fontWeight: 800,
              fontSize: 13,
              borderRadius: "999px",
              px: 2,
              boxShadow: "2px 2px 0 #20201f",
              border: "1px solid #20201f",
              "&:hover": { bgcolor: "#ff5e22", boxShadow: "1px 1px 0 #20201f" },
            }}
          >
            Tạo tài khoản
          </Button>

          {onDismiss && (
            <IconButton size="small" onClick={onDismiss} aria-label="Đóng thông báo" sx={{ color: "#686c69" }}>
              <X size={16} />
            </IconButton>
          )}
        </Box>
      </Container>
    </Box>
  );
}
