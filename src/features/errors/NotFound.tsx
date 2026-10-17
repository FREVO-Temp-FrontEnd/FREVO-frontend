import { Link } from "react-router";
import { Box, Typography, Button } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";

export default function NotFound() {
  return (
    <Box
      component="main"
      sx={{
        display: "grid",
        minHeight: "100vh",
        placeItems: "center",
        px: { xs: 3, sm: 4, lg: 8 },
        py: { xs: 12, sm: 16 },
        bgcolor: "background.default",
      }}
    >
      <Box sx={{ textAlign: "center", maxWidth: 440 }}>
        <Typography
          sx={{
            fontSize: "14px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: "text.secondary",
            textTransform: "uppercase",
          }}
        >
          Lỗi 404
        </Typography>
        <Typography
          variant="h1"
          sx={{
            mt: 1,
            fontSize: { xs: "28px", sm: "36px" },
            fontWeight: 900,
            color: "#20201f",
            "& span": { color: "primary.main" },
          }}
        >
          Không tìm thấy trang<span>.</span>
        </Typography>
        <Typography
          sx={{
            mt: 2,
            fontSize: "15px",
            lineHeight: 1.6,
            color: "text.secondary",
          }}
        >
          Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
        </Typography>
        <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
          <Button
            component={Link}
            to="/"
            startIcon={<ArrowBack />}
            sx={{
              px: 3,
              py: 1.2,
              borderRadius: "999px",
              border: "2px solid #20201f",
              bgcolor: "primary.main",
              color: "#20201f",
              fontWeight: 900,
              fontSize: "15px",
              boxShadow: "3px 3px 0 #20201f",
              "&:hover": {
                bgcolor: "#ff5e22",
                boxShadow: "2px 2px 0 #20201f",
                transform: "translate(1px, 1px)",
              },
            }}
          >
            Về trang chủ
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
