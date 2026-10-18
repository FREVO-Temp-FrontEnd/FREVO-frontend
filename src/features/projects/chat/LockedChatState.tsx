import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import { Lock, ShieldCheck, ArrowRight, MessageCircle } from "lucide-react";

interface LockedChatStateProps {
  isBusiness: boolean;
  talentName: string;
  projectTitle: string;
  onApproveChat?: () => void;
}

export const LockedChatState: React.FC<LockedChatStateProps> = ({
  isBusiness,
  talentName,
  projectTitle,
  onApproveChat,
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, md: 5 },
        textAlign: "center",
        borderRadius: "16px",
        border: "1px dashed #cbd5e1",
        bgcolor: "#f8fafc",
        maxWidth: "600px",
        mx: "auto",
        my: 4,
      }}
    >
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          bgcolor: "#fff0e9",
          color: "#f4490b",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mx: "auto",
          mb: 2,
        }}
      >
        <Lock size={28} />
      </Box>

      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          fontFamily: "Space Grotesk, sans-serif",
          color: "#1e293b",
          mb: 1,
        }}
      >
        Kênh trao đổi dự án đang được khóa (BR-012)
      </Typography>

      <Typography variant="body2" sx={{ color: "#64748b", mb: 3, lineHeight: 1.6 }}>
        {isBusiness ? (
          <>
            Theo quy định bảo mật thông tin và kiểm soát chất lượng liên lạc của FREVO (
            <strong>FR-031, BR-012</strong>), kênh chat dự án <strong>"{projectTitle}"</strong> với ứng viên{" "}
            <strong>{talentName}</strong> chỉ được kích hoạt sau khi Doanh nghiệp xem xét hồ sơ và phê duyệt mở kênh.
          </>
        ) : (
          <>
            Hồ sơ ứng tuyển của bạn cho dự án <strong>"{projectTitle}"</strong> đang chờ Doanh nghiệp xem xét.
            Kênh trao đổi trực tiếp sẽ tự động kích hoạt ngay khi Doanh nghiệp phê duyệt mở chat (
            <strong>FR-031, BR-012</strong>).
          </>
        )}
      </Typography>

      <Box
        sx={{
          p: 2,
          bgcolor: "#f1f5f9",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          textAlign: "left",
          mb: 3,
        }}
      >
        <ShieldCheck size={20} color="#059669" style={{ flexShrink: 0 }} />
        <Typography variant="caption" sx={{ color: "#475569" }}>
          <strong>Nguyên tắc FREVO:</strong> Giữ liên lạc tập trung trong phạm vi dự án, ngăn chặn tin nhắn rác và bảo vệ quyền riêng tư cho cả hai bên trước khi chính thức trao đổi.
        </Typography>
      </Box>

      {isBusiness && onApproveChat && (
        <Button
          variant="contained"
          onClick={onApproveChat}
          startIcon={<MessageCircle size={18} />}
          endIcon={<ArrowRight size={16} />}
          sx={{
            bgcolor: "#f4490b",
            "&:hover": { bgcolor: "#bd3d14" },
            px: 3,
            py: 1,
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Phê duyệt hồ sơ & Mở chat ngay
        </Button>
      )}
    </Paper>
  );
};
