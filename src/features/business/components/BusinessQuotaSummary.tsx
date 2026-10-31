import { Box, Chip, LinearProgress, Typography } from "@mui/material";
import { useBusiness } from "@/lib/hooks/useBusiness";
import { businessProjectQuota } from "@/lib/utils/businessQuota";

const font = '"Space Grotesk", Arial, sans-serif';

export function BusinessQuotaSummary() {
  const { projects, businessName } = useBusiness();
  const quota = businessProjectQuota(projects, businessName);
  return (
    <Box
      component="section"
      aria-label="Hạn mức dự án đang tuyển"
      sx={{
        mb: 3,
        p: { xs: 2.25, sm: 2.75 },
        border: "1px solid",
        borderColor: "divider",
        borderRadius: "16px",
        bgcolor: "#ffffff",
        boxShadow: "0 1px 3px rgba(16, 24, 40, 0.06), 0 2px 6px rgba(16, 24, 40, 0.04)",
        display: "grid",
        gridTemplateColumns: { xs: "minmax(0,1fr)", md: "minmax(0,1fr) minmax(240px,340px)" },
        gap: 2.5,
        alignItems: "center",
      }}
    >
      <Box>
        <div className="flex flex-wrap items-center gap-2">
          <Typography sx={{ fontFamily: "Archivo, Arial, sans-serif", fontSize: 16, fontWeight: 700 }}>
            Dự án đang tuyển{" "}
            <Box
              component="span"
              sx={{
                ml: 1,
                color: quota.reached ? "primary.dark" : "text.primary",
                fontVariantNumeric: "tabular-nums",
                fontFamily: font,
              }}
            >
              {quota.used} / {quota.limit}
            </Box>
          </Typography>
          <Chip
            size="small"
            label="Free · Mô phỏng"
            sx={{
              height: 24,
              bgcolor: "#fff0e9",
              color: "primary.dark",
              border: "1px solid rgba(244, 73, 11, 0.2)",
              fontSize: 12,
              fontWeight: 600,
            }}
          />
        </div>
        <Typography sx={{ fontSize: 13, color: "text.secondary", mt: 0.75 }}>
          Bản nháp và dự án đã đóng tuyển không chiếm lượt.
        </Typography>
      </Box>
      <Box>
        <LinearProgress
          variant="determinate"
          value={Math.min(100, (quota.used / quota.limit) * 100)}
          aria-label={`Đang tuyển ${quota.used} trên hạn mức ${quota.limit} dự án`}
          sx={{ height: 6, borderRadius: 3, bgcolor: "#e7eaee" }}
        />
        <Typography
          role="status"
          sx={{
            mt: 1,
            fontSize: 13,
            lineHeight: 1.5,
            color: quota.reached ? "primary.dark" : "text.secondary",
          }}
        >
          {quota.reached
            ? quota.mode === "soft"
              ? "Đã đạt hạn mức tham khảo. Bản thử nghiệm vẫn cho đăng thêm và ghi nhận cảnh báo."
              : "Đã đạt hạn mức. Đóng một dự án đang tuyển để đăng dự án mới; bạn vẫn có thể lưu nháp."
            : `Còn ${quota.remaining} lượt đăng tuyển đồng thời.`}
        </Typography>
      </Box>
    </Box>
  );
}
