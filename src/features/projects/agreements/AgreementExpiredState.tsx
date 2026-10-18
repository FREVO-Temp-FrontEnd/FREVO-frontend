import React from "react";
import { Box, Typography, Paper, Button } from "@mui/material";
import { Clock, RefreshCw, ArrowRight } from "lucide-react";

interface AgreementExpiredStateProps {
  version: number;
  hasEffectiveVersion: boolean;
  effectiveVersionNumber?: number;
  isBusiness: boolean;
  onRecreateProposal?: () => void;
}

export const AgreementExpiredState: React.FC<AgreementExpiredStateProps> = ({
  version,
  hasEffectiveVersion,
  effectiveVersionNumber,
  isBusiness,
  onRecreateProposal,
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        textAlign: "center",
        borderRadius: "16px",
        border: "1px dashed #cbd5e1",
        bgcolor: "#f8fafc",
        maxWidth: "560px",
        mx: "auto",
        my: 3,
      }}
    >
      <Box
        sx={{
          width: 52,
          height: 52,
          borderRadius: "50%",
          bgcolor: "#fef3c7",
          color: "#d97706",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mx: "auto",
          mb: 2,
        }}
      >
        <Clock size={26} />
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
        Đề xuất thỏa thuận (Phiên bản {version}) đã hết hạn (BR-024)
      </Typography>

      <Typography variant="body2" sx={{ color: "#64748b", mb: 2, lineHeight: 1.6 }}>
        Thời hạn xác nhận <strong>3 ngày</strong> (theo quy tắc <strong>FR-032, BR-024</strong>) đã trôi qua mà không nhận được phản hồi xác nhận từ cả hai bên.
      </Typography>

      {hasEffectiveVersion ? (
        <Box
          sx={{
            p: 2,
            bgcolor: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: "8px",
            mb: 3,
            textAlign: "left",
          }}
        >
          <Typography variant="body2" sx={{ color: "#166534", fontWeight: 600 }}>
            Tự động bảo toàn hiệu lực (FR-048):
          </Typography>
          <Typography variant="caption" sx={{ color: "#15803d", display: "block", mt: 0.5 }}>
            Do đề xuất Phiên bản {version} đã hết hạn, hệ thống tự động duy trì <strong>Phiên bản {effectiveVersionNumber}</strong> đã xác nhận trước đó làm cơ sở pháp lý và tiến độ hợp tác hiện hành.
          </Typography>
        </Box>
      ) : (
        <Typography variant="caption" sx={{ color: "#94a3b8", display: "block", mb: 3 }}>
          Dự án chưa có phiên bản hợp tác nào có hiệu lực. Bạn có thể gửi lại đề xuất mới sau khi thảo luận lại qua kênh tin nhắn.
        </Typography>
      )}

      {isBusiness && onRecreateProposal && (
        <Button
          variant="contained"
          onClick={onRecreateProposal}
          startIcon={<RefreshCw size={16} />}
          endIcon={<ArrowRight size={16} />}
          sx={{
            bgcolor: "#f4490b",
            "&:hover": { bgcolor: "#bd3d14" },
            textTransform: "none",
            borderRadius: "8px",
            fontWeight: 600,
          }}
        >
          Tạo đề xuất thỏa thuận mới
        </Button>
      )}
    </Paper>
  );
};
