import React from "react";
import { Box, Typography, Paper, Chip } from "@mui/material";
import { CheckCircle2, Info } from "lucide-react";

interface SelectionClosedBannerProps {
  selectedTalentName: string;
  selectedTalentKind: "Cá nhân" | "Team";
  confirmedAt?: string;
}

export const SelectionClosedBanner: React.FC<SelectionClosedBannerProps> = ({
  selectedTalentName,
  selectedTalentKind,
  confirmedAt,
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: "12px",
        bgcolor: "#f0fdf4",
        border: "1px solid #bbf7d0",
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "flex-start", sm: "center" },
        justifyContent: "space-between",
        gap: 2,
        mb: 3,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: "50%",
            bgcolor: "#dcfce7",
            color: "#16a34a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <CheckCircle2 size={24} />
        </Box>

        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap", mb: 0.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#166534" }}>
              Đã đóng tuyển · Đã chọn người thực hiện
            </Typography>
            <Chip
              label="Đã chọn đối tác"
              size="small"
              sx={{ bgcolor: "#22c55e", color: "#ffffff", fontWeight: 700, height: 20, fontSize: "10px" }}
            />
          </Box>
          <Typography variant="body2" sx={{ color: "#15803d" }}>
            Dự án chính thức hợp tác cùng <strong>{selectedTalentName}</strong> ({selectedTalentKind}).{" "}
            {confirmedAt && `Xác nhận ngày ${new Date(confirmedAt).toLocaleDateString("vi-VN")}.`}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          bgcolor: "#ffffff",
          p: 1.5,
          borderRadius: "8px",
          border: "1px solid #dcfce7",
          maxWidth: { xs: "100%", sm: "320px" },
          display: "flex",
          gap: 1,
        }}
      >
        <Info size={16} color="#16a34a" style={{ flexShrink: 0, marginTop: 2 }} />
        <Typography variant="caption" sx={{ color: "#166534", lineHeight: 1.4 }}>
          <strong>Trạng thái dự án:</strong> Đóng tuyển ghi nhận việc chốt đối tác và khóa nhận hồ sơ mới, không đồng nghĩa dự án đã hoàn thành. Dự án đang chuyển sang giai đoạn thực hiện.
        </Typography>
      </Box>
    </Paper>
  );
};
