import React from "react";
import { Box, Typography, Paper, Button, Chip } from "@mui/material";
import { Info, ArrowRight, Compass } from "lucide-react";
import { useNavigate } from "react-router";

interface NotSelectedNoticeCardProps {
  projectTitle: string;
  companyName: string;
  category?: string;
}

export const NotSelectedNoticeCard: React.FC<NotSelectedNoticeCardProps> = ({
  projectTitle,
  companyName,
  category,
}) => {
  const navigate = useNavigate();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: "12px",
        bgcolor: "#f8fafc",
        border: "1px solid #e2e8f0",
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "flex-start", sm: "center" },
        justifyContent: "space-between",
        gap: 2,
        my: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            bgcolor: "#f1f5f9",
            color: "#64748b",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            mt: 0.5,
          }}
        >
          <Info size={20} />
        </Box>

        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5, flexWrap: "wrap" }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#1e293b" }}>
              {projectTitle}
            </Typography>
            {category && (
              <Chip
                label={category}
                size="small"
                variant="outlined"
                sx={{ fontSize: "11px", height: 20, color: "#64748b" }}
              />
            )}
            <Chip
              label="Không được chọn (BR-023)"
              size="small"
              sx={{ bgcolor: "#f1f5f9", color: "#64748b", fontSize: "11px", height: 20 }}
            />
          </Box>
          <Typography variant="body2" sx={{ color: "#64748b", lineHeight: 1.5 }}>
            Doanh nghiệp <strong>{companyName}</strong> đã hoàn tất lựa chọn đối tác phù hợp cho dự án này và đóng tuyển dụng. Hồ sơ của bạn đã được lưu trữ trong lịch sử ứng tuyển.
          </Typography>
        </Box>
      </Box>

      <Button
        variant="outlined"
        size="small"
        onClick={() => navigate("/explore")}
        startIcon={<Compass size={16} />}
        endIcon={<ArrowRight size={14} />}
        sx={{
          flexShrink: 0,
          color: "#f4490b",
          borderColor: "#f4490b",
          textTransform: "none",
          fontWeight: 600,
          borderRadius: "8px",
          "&:hover": { borderColor: "#bd3d14", bgcolor: "#fffaf7" },
        }}
      >
        Khám phá brief khác
      </Button>
    </Paper>
  );
};
