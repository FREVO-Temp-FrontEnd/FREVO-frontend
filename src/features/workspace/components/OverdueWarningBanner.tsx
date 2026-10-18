import React from "react";
import { Box, Typography, Paper, Button } from "@mui/material";
import { AlertTriangle, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router";

interface OverdueWarningBannerProps {
  milestoneName: string;
  deadline: string;
  projectId: string;
}

export const OverdueWarningBanner: React.FC<OverdueWarningBannerProps> = ({
  milestoneName,
  deadline,
  projectId,
}) => {
  const navigate = useNavigate();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        px: 2.5,
        borderRadius: "12px",
        bgcolor: "#fef2f2",
        border: "1px solid #fecaca",
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "flex-start", sm: "center" },
        justifyContent: "space-between",
        gap: 2,
        my: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <AlertTriangle size={20} color="#dc2626" style={{ flexShrink: 0 }} />
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#991b1b" }}>
            Mốc công việc quá hạn: {milestoneName} (Hạn chót: {deadline})
          </Typography>
          <Typography variant="caption" sx={{ color: "#7f1d1d" }}>
            Tiến độ đang chậm so với kế hoạch ban đầu. Hãy trao đổi qua kênh chat để điều chỉnh thời gian nếu cần thiết.
          </Typography>
        </Box>
      </Box>

      <Button
        size="small"
        onClick={() => navigate(`/projects/${projectId}/chat`)}
        startIcon={<MessageCircle size={15} />}
        sx={{
          bgcolor: "#ffffff",
          color: "#dc2626",
          borderColor: "#fca5a5",
          border: "1px solid",
          textTransform: "none",
          fontWeight: 600,
          borderRadius: "6px",
          flexShrink: 0,
          "&:hover": { bgcolor: "#fee2e2" },
        }}
      >
        Mở chat dự án
      </Button>
    </Paper>
  );
};
