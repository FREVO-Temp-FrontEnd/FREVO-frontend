import { Box, Paper, Typography } from "@mui/material";
import { CheckCircle2 } from "lucide-react";

interface SelectionClosedBannerProps {
  selectedTalentName: string;
  selectedTalentKind: string;
  confirmedAt?: string;
}

export function SelectionClosedBanner({ selectedTalentName, selectedTalentKind, confirmedAt }: SelectionClosedBannerProps) {
  return (
    <Paper
      component="section"
      aria-label="Thông báo tuyển dụng"
      variant="outlined"
      sx={{
        p: { xs: 2, sm: 2.25 },
        mb: 3,
        bgcolor: "#fbfcfb",
        borderColor: "#d4dbd2",
        borderRadius: "12px",
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "flex-start", sm: "center" },
        justifyContent: "space-between",
        gap: 2,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
        <Box sx={{ color: "#16805b", display: "grid", placeItems: "center", pt: 0.25, flexShrink: 0 }}>
          <CheckCircle2 size={19} aria-hidden="true" />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography component="h2" sx={{ fontSize: 14, fontWeight: 700, color: "#20201f" }}>
            Tuyển dụng hoàn tất · Dự án đang trong giai đoạn triển khai
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.25, fontSize: 13, lineHeight: 1.5 }}>
            Đã chọn <strong>{selectedTalentName}</strong> ({selectedTalentKind}) và đóng nhận hồ sơ mới{confirmedAt && ` từ ngày ${new Date(confirmedAt).toLocaleDateString("vi-VN")}`}. Dự án đang được thực hiện (chưa hoàn thành), theo dõi nghiệm thu các mốc bàn giao tại mục Tiến độ.
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}
