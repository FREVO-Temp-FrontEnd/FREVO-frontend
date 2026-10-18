import React from "react";
import { Typography, Paper, Button } from "@mui/material";
import { RefreshCw, AlertCircle } from "lucide-react";

interface PaymentRetryStateProps {
  onRetry: () => void;
}

export const PaymentRetryState: React.FC<PaymentRetryStateProps> = ({ onRetry }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: "12px",
        bgcolor: "#fef2f2",
        border: "1px solid #fecaca",
        textAlign: "center",
        my: 2,
      }}
    >
      <AlertCircle size={28} color="#dc2626" style={{ margin: "0 auto 8px" }} />
      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#991b1b", mb: 0.5 }}>
        Mô phỏng gián đoạn xử lý giao dịch (FR-059)
      </Typography>
      <Typography variant="caption" sx={{ color: "#7f1d1d", display: "block", mb: 2 }}>
        Cổng thanh toán đối tác tạm thời không phản hồi. Trong môi trường thử nghiệm, bạn có thể thực hiện thử lại ngay lập tức.
      </Typography>
      <Button
        variant="contained"
        size="small"
        onClick={onRetry}
        startIcon={<RefreshCw size={14} />}
        sx={{
          bgcolor: "#dc2626",
          "&:hover": { bgcolor: "#b91c1c" },
          textTransform: "none",
          fontWeight: 600,
          borderRadius: "6px",
        }}
      >
        Thử lại giao dịch mô phỏng
      </Button>
    </Paper>
  );
};
