import React from "react";
import { Alert, Button, Typography } from "@mui/material";
import { RefreshCw, AlertTriangle } from "lucide-react";

interface ErrorRetryBannerProps {
  message?: string;
  onRetry: () => void;
}

export const ErrorRetryBanner: React.FC<ErrorRetryBannerProps> = ({
  message = "Không thể tải dữ liệu vào lúc này. Vui lòng kiểm tra lại kết nối.",
  onRetry,
}) => {
  return (
    <Alert
      severity="warning"
      icon={<AlertTriangle size={20} />}
      action={
        <Button
          color="inherit"
          size="small"
          onClick={onRetry}
          startIcon={<RefreshCw size={14} />}
          sx={{ textTransform: "none", fontWeight: 700 }}
        >
          Thử lại
        </Button>
      }
      sx={{
        borderRadius: "10px",
        my: 2,
        alignItems: "center",
      }}
    >
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {message}
      </Typography>
    </Alert>
  );
};

export default ErrorRetryBanner;
