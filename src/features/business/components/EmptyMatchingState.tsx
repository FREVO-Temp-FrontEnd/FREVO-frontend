import { Box, Typography, Button } from "@mui/material";
import { SlidersHorizontal, RotateCcw } from "lucide-react";

interface EmptyMatchingStateProps {
  onResetFilters?: () => void;
  message?: string;
}

export function EmptyMatchingState({
  onResetFilters,
  message = "Không tìm thấy hồ sơ ứng viên phù hợp với tiêu chí lọc hiện tại.",
}: EmptyMatchingStateProps) {
  return (
    <Box
      sx={{
        py: 8,
        px: 3,
        textAlign: "center",
        bgcolor: "#fafaf9",
        borderRadius: 3,
        border: "1px dashed #d6d3d1",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1.5,
        my: 3,
      }}
    >
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          bgcolor: "#f5f5f4",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#78716c",
          mb: 1,
        }}
      >
        <SlidersHorizontal size={26} strokeWidth={1.8} />
      </Box>

      <Typography variant="h6" sx={{ fontWeight: 700, color: "#292524", fontSize: "1.1rem" }}>
        Không có ứng viên phù hợp (BUS-014)
      </Typography>

      <Typography variant="body2" sx={{ color: "text.secondary", maxWidth: 440, mb: 1 }}>
        {message} Hãy thử bỏ chọn bộ lọc kỹ năng, nới lỏng mức điểm tương thích hoặc tìm kiếm với từ khóa khác.
      </Typography>

      {onResetFilters && (
        <Button
          variant="outlined"
          onClick={onResetFilters}
          startIcon={<RotateCcw size={15} />}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            borderColor: "#d6d3d1",
            color: "#44403c",
            "&:hover": { borderColor: "#a8a29e", bgcolor: "#f5f5f4" },
          }}
        >
          Đặt lại bộ lọc
        </Button>
      )}
    </Box>
  );
}
