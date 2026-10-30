import { Box, Chip, LinearProgress, Typography } from "@mui/material";
import { useBusiness } from "@/lib/hooks/useBusiness";
import { businessProjectQuota } from "@/lib/utils/businessQuota";

export function BusinessQuotaSummary() {
  const { projects, businessName } = useBusiness();
  const quota = businessProjectQuota(projects, businessName);
  return <Box component="section" aria-label="Hạn mức dự án đang tuyển" sx={{ mb: 3, p: { xs: 2, sm: 2.5 }, border: "1px solid", borderColor: "var(--surface-border)", borderRadius: "16px", bgcolor: "var(--surface-inset)", display: "grid", gridTemplateColumns: { xs: "minmax(0,1fr)", md: "minmax(0,1fr) minmax(220px,320px)" }, gap: 2.5, alignItems: "center" }}>
    <Box>
      <div className="flex flex-wrap items-center gap-2"><Typography sx={{ fontSize: 16, fontWeight: 700 }}>Dự án đang tuyển <Box component="span" sx={{ ml: 1, color: quota.reached ? "primary.dark" : "text.primary", fontVariantNumeric: "tabular-nums" }}>{quota.used} / {quota.limit}</Box></Typography><Chip size="small" label="Free · Mô phỏng" sx={{ height: 26, bgcolor: "background.paper", border: "1px solid", borderColor: "divider", fontSize: 13 }} /></div>
      <Typography sx={{ fontSize: 14, color: "text.secondary", mt: .75 }}>Bản nháp và dự án đã đóng tuyển không chiếm lượt.</Typography>
    </Box>
    <Box>
      <LinearProgress variant="determinate" value={Math.min(100, quota.used / quota.limit * 100)} aria-label={`Đang tuyển ${quota.used} trên hạn mức ${quota.limit} dự án`} sx={{ height: 6, borderRadius: 3, bgcolor: "#e7eaee" }} />
      <Typography role="status" sx={{ mt: 1, fontSize: 14, lineHeight: 1.5, color: quota.reached ? "primary.dark" : "text.secondary" }}>{quota.reached ? quota.mode === "soft" ? "Đã đạt hạn mức tham khảo. Bản thử nghiệm vẫn cho đăng thêm và ghi nhận cảnh báo." : "Đã đạt hạn mức. Đóng một dự án đang tuyển để đăng dự án mới; bạn vẫn có thể lưu nháp." : `Còn ${quota.remaining} lượt đăng tuyển đồng thời.`}</Typography>
    </Box>
  </Box>;
}
