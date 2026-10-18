import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Chip,
  Divider,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Sliders,
  RotateCcw,
  Building2,
  Users,
  Shield,
  Eye,
  ChevronUp,
  ChevronDown,
  Palette,
} from "lucide-react";
import { useAuthSession } from "@/lib/hooks/useAuthSession";
import { mockStorage } from "@/lib/storage/mockStorage";

export const DemoController: React.FC = () => {
  const navigate = useNavigate();
  const { role, actingIdentity, switchRole, switchActingIdentity } = useAuthSession();

  const [expanded, setExpanded] = useState(false);
  const [resetToast, setResetToast] = useState(false);

  const handleSwitchIdentity = (
    targetRole: "client" | "freelancer" | "admin" | "guest",
    targetActing: "individual" | "team" = "individual"
  ) => {
    switchRole(targetRole);
    switchActingIdentity(
      targetActing === "team"
        ? { type: "team", teamId: "may-creative", teamName: "Mây Creative", roleInTeam: "Lead Designer" }
        : { type: "individual" }
    );
  };

  const handleResetDemo = () => {
    mockStorage.reset();
    setResetToast(true);
    // Reload current route after brief delay to rehydrate all state
    setTimeout(() => {
      window.location.reload();
    }, 600);
  };

  const currentRoleLabel =
    role === "client"
      ? "Doanh nghiệp (Nắng Studio)"
      : role === "freelancer"
      ? actingIdentity?.type === "team"
        ? "Đại diện Team (Mây Creative)"
        : "Freelancer cá nhân (Minh Anh)"
      : role === "admin"
      ? "Quản trị viên (Admin)"
      : "Khách (Guest)";

  return (
    <>
      <Paper
        elevation={6}
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          zIndex: 9999,
          borderRadius: "16px",
          bgcolor: "#1e293b",
          color: "#fff",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.35)",
          overflow: "hidden",
          transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          maxWidth: expanded ? 380 : "auto",
        }}
      >
        {/* Collapsed Pill Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            p: "10px 14px",
            cursor: "pointer",
            userSelect: "none",
            bgcolor: expanded ? "#0f172a" : "transparent",
            borderBottom: expanded ? "1px solid rgba(255, 255, 255, 0.08)" : "none",
          }}
          onClick={() => setExpanded(!expanded)}
        >
          <Box
            sx={{
              width: 26,
              height: 26,
              borderRadius: "8px",
              bgcolor: "#f4490b",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Sliders size={15} />
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography sx={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                FREVO Demo Controller
              </Typography>
              <Chip
                label="LIVE MOCK"
                size="small"
                sx={{
                  bgcolor: "rgba(244, 73, 11, 0.2)",
                  color: "#ff8254",
                  fontSize: "9px",
                  fontWeight: 800,
                  height: 16,
                }}
              />
            </Box>
            <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "#f8fafc" }}>
              {currentRoleLabel}
            </Typography>
          </Box>

          <IconButton
            size="small"
            sx={{ color: "#94a3b8", ml: "auto", p: 0.5 }}
            aria-label={expanded ? "Thu gọn controller" : "Mở rộng controller"}
          >
            {expanded ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
          </IconButton>
        </Box>

        {/* Expanded Panel Body */}
        {expanded && (
          <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Identity Switcher */}
            <Box>
              <Typography sx={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", mb: 1 }}>
                01. Chuyển đổi vai trò & Danh tính
              </Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
                <Button
                  size="small"
                  variant={role === "client" ? "contained" : "outlined"}
                  startIcon={<Building2 size={14} />}
                  onClick={() => handleSwitchIdentity("client")}
                  sx={{
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: "11.5px",
                    borderRadius: "8px",
                    bgcolor: role === "client" ? "#f4490b" : "transparent",
                    color: role === "client" ? "#fff" : "#cbd5e1",
                    borderColor: role === "client" ? "#f4490b" : "#475569",
                    justifyContent: "flex-start",
                    p: "6px 10px",
                  }}
                >
                  Doanh nghiệp
                </Button>

                <Button
                  size="small"
                  variant={role === "freelancer" && actingIdentity?.type === "individual" ? "contained" : "outlined"}
                  startIcon={<Palette size={14} />}
                  onClick={() => handleSwitchIdentity("freelancer", "individual")}
                  sx={{
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: "11.5px",
                    borderRadius: "8px",
                    bgcolor: role === "freelancer" && actingIdentity?.type === "individual" ? "#f4490b" : "transparent",
                    color: role === "freelancer" && actingIdentity?.type === "individual" ? "#fff" : "#cbd5e1",
                    borderColor: role === "freelancer" && actingIdentity?.type === "individual" ? "#f4490b" : "#475569",
                    justifyContent: "flex-start",
                    p: "6px 10px",
                  }}
                >
                  Freelancer đơn
                </Button>

                <Button
                  size="small"
                  variant={role === "freelancer" && actingIdentity?.type === "team" ? "contained" : "outlined"}
                  startIcon={<Users size={14} />}
                  onClick={() => handleSwitchIdentity("freelancer", "team")}
                  sx={{
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: "11.5px",
                    borderRadius: "8px",
                    bgcolor: role === "freelancer" && actingIdentity?.type === "team" ? "#f4490b" : "transparent",
                    color: role === "freelancer" && actingIdentity?.type === "team" ? "#fff" : "#cbd5e1",
                    borderColor: role === "freelancer" && actingIdentity?.type === "team" ? "#f4490b" : "#475569",
                    justifyContent: "flex-start",
                    p: "6px 10px",
                  }}
                >
                  Đại diện Team
                </Button>

                <Button
                  size="small"
                  variant={role === "admin" ? "contained" : "outlined"}
                  startIcon={<Shield size={14} />}
                  onClick={() => handleSwitchIdentity("admin")}
                  sx={{
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: "11.5px",
                    borderRadius: "8px",
                    bgcolor: role === "admin" ? "#f4490b" : "transparent",
                    color: role === "admin" ? "#fff" : "#cbd5e1",
                    borderColor: role === "admin" ? "#f4490b" : "#475569",
                    justifyContent: "flex-start",
                    p: "6px 10px",
                  }}
                >
                  Quản trị viên
                </Button>
              </Box>

              <Button
                fullWidth
                size="small"
                variant={role === "guest" ? "contained" : "text"}
                startIcon={<Eye size={14} />}
                onClick={() => handleSwitchIdentity("guest")}
                sx={{
                  mt: 1,
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "11.5px",
                  color: role === "guest" ? "#fff" : "#94a3b8",
                  bgcolor: role === "guest" ? "#475569" : "transparent",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.06)" },
                }}
              >
                Chế độ Khách (Guest)
              </Button>
            </Box>

            <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />

            {/* Quick Flow Jump Links */}
            <Box>
              <Typography sx={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", mb: 1 }}>
                02. Điều hướng quy trình nhanh
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                <Button
                  size="small"
                  onClick={() => navigate("/business")}
                  sx={{ justifyContent: "flex-start", color: "#e2e8f0", textTransform: "none", fontSize: "12px", py: 0.4 }}
                >
                  🏢 Bảng điều khiển Doanh nghiệp
                </Button>
                <Button
                  size="small"
                  onClick={() => navigate("/business/projects/nang-brand/applicants")}
                  sx={{ justifyContent: "flex-start", color: "#e2e8f0", textTransform: "none", fontSize: "12px", py: 0.4 }}
                >
                  👥 Xem hồ sơ ứng viên & Mở chat
                </Button>
                <Button
                  size="small"
                  onClick={() => navigate("/projects/nang-brand/chat?talent=minh-anh")}
                  sx={{ justifyContent: "flex-start", color: "#e2e8f0", textTransform: "none", fontSize: "12px", py: 0.4 }}
                >
                  💬 Phòng chat dự án (PROJ-001)
                </Button>
                <Button
                  size="small"
                  onClick={() => navigate("/projects/nang-brand/agreement?talent=khanh-linh")}
                  sx={{ justifyContent: "flex-start", color: "#e2e8f0", textTransform: "none", fontSize: "12px", py: 0.4 }}
                >
                  📑 Đề xuất hợp tác & Thỏa thuận (PROJ-003)
                </Button>
                <Button
                  size="small"
                  onClick={() => navigate("/workspace/co-may-packaging")}
                  sx={{ justifyContent: "flex-start", color: "#e2e8f0", textTransform: "none", fontSize: "12px", py: 0.4 }}
                >
                  🛠️ Không gian làm việc mốc (WORK-001)
                </Button>
                <Button
                  size="small"
                  onClick={() => navigate("/payments/co-may-packaging")}
                  sx={{ justifyContent: "flex-start", color: "#e2e8f0", textTransform: "none", fontSize: "12px", py: 0.4 }}
                >
                  💳 Sổ thanh toán mô phỏng (PAY-001)
                </Button>
                <Button
                  size="small"
                  onClick={() => navigate("/reviews/co-may-packaging")}
                  sx={{ justifyContent: "flex-start", color: "#e2e8f0", textTransform: "none", fontSize: "12px", py: 0.4 }}
                >
                  ⭐ Đánh giá đối tác hoàn tất (REV-001)
                </Button>
                <Button
                  size="small"
                  onClick={() => navigate("/team/profile")}
                  sx={{ justifyContent: "flex-start", color: "#e2e8f0", textTransform: "none", fontSize: "12px", py: 0.4 }}
                >
                  👥 Hồ sơ Nhóm sáng tạo (TEAM-001)
                </Button>
              </Box>
            </Box>

            <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />

            {/* Reset Button */}
            <Tooltip title="Khôi phục toàn bộ dự án, ứng viên, hợp đồng và tin nhắn về trạng thái ban đầu">
              <Button
                variant="outlined"
                color="warning"
                size="small"
                startIcon={<RotateCcw size={14} />}
                onClick={handleResetDemo}
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  borderRadius: "8px",
                  borderColor: "#f59e0b",
                  color: "#fbbf24",
                  "&:hover": { borderColor: "#d97706", bgcolor: "rgba(245, 158, 11, 0.1)" },
                }}
              >
                Khôi phục dữ liệu Demo ban đầu
              </Button>
            </Tooltip>
          </Box>
        )}
      </Paper>

      <Snackbar
        open={resetToast}
        autoHideDuration={3000}
        onClose={() => setResetToast(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: "100%", borderRadius: "12px", fontWeight: 600 }}>
          Đã khôi phục dữ liệu prototype về trạng thái ban đầu thành công!
        </Alert>
      </Snackbar>
    </>
  );
};
