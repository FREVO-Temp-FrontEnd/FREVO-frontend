import { Box, Button, Container, Typography, Paper } from "@mui/material";
import { LockOutlined, HomeOutlined, LoginOutlined, SwapHorizOutlined } from "@mui/icons-material";
import { Link, useNavigate } from "react-router";
import { useAuthSession } from "@/lib/hooks/useAuthSession";

export default function ForbiddenPage() {
  const { user, role, switchRole } = useAuthSession();
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ py: 10, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Paper
        elevation={0}
        sx={{
          p: 5,
          width: "100%",
          textAlign: "center",
          borderRadius: 4,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            bgcolor: "error.light",
            color: "error.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 3,
          }}
        >
          <LockOutlined sx={{ fontSize: 36 }} />
        </Box>

        <Typography variant="h4" gutterBottom sx={{ fontWeight: 800, letterSpacing: "-0.03em" }}>
          403 · Không có quyền truy cập
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
          Bạn đang đăng nhập với vai trò <strong>{role === "client" ? "Doanh nghiệp" : role === "freelancer" ? "Freelancer" : role}</strong> ({user?.name || "Người dùng"}). Trang này yêu cầu quyền truy cập khác để xem nội dung.
        </Typography>

        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, justifyContent: "center", mb: 3 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<HomeOutlined />}
            component={Link}
            to={role === "client" ? "/business" : "/"}
            sx={{ borderRadius: 2, px: 3, py: 1.2, textTransform: "none", fontWeight: 600 }}
          >
            Về trang chủ của bạn
          </Button>
          <Button
            variant="outlined"
            startIcon={<LoginOutlined />}
            component={Link}
            to="/login"
            sx={{ borderRadius: 2, px: 3, py: 1.2, textTransform: "none", fontWeight: 600 }}
          >
            Đăng nhập tài khoản khác
          </Button>
        </Box>

        {/* Demo switcher */}
        <Box
          sx={{
            mt: 4,
            pt: 3,
            borderTop: "1px dashed",
            borderColor: "divider",
            bgcolor: "grey.50",
            p: 2,
            borderRadius: 2,
          }}
        >
          <Typography variant="caption" color="text.secondary" gutterBottom sx={{ display: "block" }}>
            Chuyển nhanh vai trò để tiếp tục thử nghiệm:
          </Typography>
          <Button
            size="small"
            startIcon={<SwapHorizOutlined />}
            onClick={() => {
              const targetRole = role === "client" ? "freelancer" : "client";
              switchRole(targetRole);
              navigate(targetRole === "client" ? "/business" : "/");
            }}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            Chuyển sang vai trò {role === "client" ? "Freelancer" : "Doanh nghiệp (Client)"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
