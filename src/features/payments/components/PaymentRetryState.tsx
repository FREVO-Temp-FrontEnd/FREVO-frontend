import { Alert, Button, Stack, Typography } from "@mui/material";
import { RefreshCw } from "lucide-react";

interface PaymentRetryStateProps {
  onRetry: () => void;
}

export function PaymentRetryState({ onRetry }: PaymentRetryStateProps) {
  return (
    <Alert
      severity="warning"
      sx={{ mt: 2, borderRadius: "12px", bgcolor: "#fff0e9", color: "text.primary", alignItems: "flex-start" }}
      action={
        <Button size="small" onClick={onRetry} startIcon={<RefreshCw size={14} />} sx={{ color: "primary.dark" }}>
          Thử lại
        </Button>
      }
    >
      <Stack spacing={0.5}>
        <Typography sx={{ fontSize: 12, fontWeight: 700 }}>Giao dịch mô phỏng chưa được ghi nhận</Typography>
        <Typography sx={{ fontSize: 11, color: "text.secondary", lineHeight: 1.6 }}>
          Đây là tình huống kiểm tra giao diện. Chọn thử lại để đóng thông báo; không có tiền thật được xử lý.
        </Typography>
      </Stack>
    </Alert>
  );
}
