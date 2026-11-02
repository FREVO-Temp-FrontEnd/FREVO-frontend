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
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        minHeight: "440px",
        p: { xs: 2, sm: 3 },
        bgcolor: isBusiness ? "#f8fafc" : "#f7f8f6",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3.5, sm: 5 },
          textAlign: "center",
          borderRadius: "20px",
          border: "1.5px solid #cbd5e1",
          bgcolor: "#ffffff",
          maxWidth: "560px",
          width: "100%",
          boxShadow: "0 4px 20px rgba(16, 24, 40, 0.08)",
        }}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: "20px",
            bgcolor: "#fff0e9",
            color: "#f4490b",
            display: "grid",
            placeItems: "center",
            mx: "auto",
            mb: 2.5,
            border: "1px solid rgba(244, 73, 11, 0.2)",
            boxShadow: "0 4px 14px rgba(244, 73, 11, 0.15)",
          }}
        >
          <Lock size={28} />
        </Box>

        <Typography
          component="h2"
          sx={{
            fontWeight: 800,
            fontFamily: "Archivo, Arial, sans-serif",
            fontSize: { xs: 18, sm: 20 },
            color: "#0f172a",
            mb: 1.25,
            lineHeight: 1.3,
          }}
        >
          Kênh trao đổi dự án đang được khóa
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "#64748b",
            mb: 3,
            lineHeight: 1.65,
            fontFamily: "Space Grotesk, Arial, sans-serif",
            fontSize: 13.5,
          }}
        >
          {isBusiness ? (
            <>
              Kênh trao đổi của dự án <strong className="text-[#0f172a]">"{projectTitle}"</strong> với ứng viên{" "}
              <strong className="text-[#0f172a]">{talentName}</strong> chỉ được kích hoạt sau khi Doanh nghiệp xem xét hồ sơ và phê duyệt mở kênh.
            </>
          ) : (
            <>
              Hồ sơ ứng tuyển của bạn cho dự án <strong className="text-[#0f172a]">"{projectTitle}"</strong> đang chờ Doanh nghiệp xem xét.
              Bạn có thể nhắn tin sau khi doanh nghiệp duyệt hồ sơ.
            </>
          )}
        </Typography>

        <Box
          sx={{
            p: 2,
            bgcolor: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: "12px",
            display: "flex",
            alignItems: "flex-start",
            gap: 1.5,
            textAlign: "left",
            mb: 3.5,
          }}
        >
          <ShieldCheck size={20} color="#16a34a" style={{ flexShrink: 0, marginTop: 1 }} />
          <Typography
            variant="caption"
            sx={{
              color: "#166534",
              fontSize: 12.5,
              lineHeight: 1.55,
              fontFamily: "Space Grotesk, Arial, sans-serif",
            }}
          >
            <strong className="font-bold text-[#14532d]">Nguyên tắc FREVO:</strong> Giữ liên lạc tập trung trong phạm vi dự án, ngăn chặn tin nhắn rác và bảo vệ quyền riêng tư cho cả hai bên trước khi chính thức trao đổi.
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
              background: "linear-gradient(135deg, #f4490b 0%, #e03a00 100%)",
              boxShadow: "0 2px 8px rgba(244, 73, 11, 0.28)",
              "&:hover": { background: "#bd3d14" },
              px: 3.5,
              py: 1.25,
              borderRadius: 999,
              textTransform: "none",
              fontWeight: 700,
              fontFamily: "Space Grotesk, Arial, sans-serif",
              fontSize: 13.5,
            }}
          >
            Phê duyệt hồ sơ & Mở chat ngay
          </Button>
        )}
      </Paper>
    </Box>
  );
};
