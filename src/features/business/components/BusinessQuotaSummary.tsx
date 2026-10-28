import { Box, Chip, LinearProgress, Typography } from "@mui/material";
import { useBusiness } from "@/lib/hooks/useBusiness";
import { businessProjectQuota } from "@/lib/utils/businessQuota";

export function BusinessQuotaSummary() {
  const { projects, businessName } = useBusiness();
  const quota = businessProjectQuota(projects, businessName);
  return <Box component="section" aria-label="Hạn mức dự án đang tuyển" sx={{ mb: 3, p: { xs: 2, sm: 2.5 }, border: "1px solid", borderColor: "divider", borderRadius: 3, bgcolor: "background.paper" }}>
    <div className="flex flex-wrap items-center justify-between gap-3"><Box><Typography sx={{ fontSize: 14, fontWeight: 700 }}>Dự án đang tuyển <Box component="span" sx={{ ml: 1, color: quota.reached ? "primary.dark" : "text.primary" }}>{quota.used}/{quota.limit}</Box></Typography><Typography sx={{ fontSize: 12, color: "text.secondary", mt: .5 }}>Bản nháp và dự án đã đóng tuyển không chiếm lượt.</Typography></Box><Chip size="small" label="Hạn mức Free · Mô phỏng" sx={{ bgcolor: "background.default", fontSize: 11 }} /></div>
    <LinearProgress variant="determinate" value={Math.min(100, quota.used / quota.limit * 100)} aria-label={`Đang tuyển ${quota.used} trên hạn mức ${quota.limit} dự án`} sx={{ mt: 2, height: 5, borderRadius: 3, bgcolor: "background.default" }} />
    <Typography role="status" sx={{ mt: 1, fontSize: 12, color: quota.reached ? "primary.dark" : "text.secondary" }}>{quota.reached ? quota.mode === "soft" ? "Đã đạt hạn mức tham khảo. Bản thử nghiệm vẫn cho đăng thêm và ghi nhận cảnh báo." : "Đã đạt hạn mức. Đóng một dự án đang tuyển để đăng dự án mới; bạn vẫn có thể lưu nháp." : `Còn ${quota.remaining} lượt đăng tuyển đồng thời.`}</Typography>
  </Box>;
}
