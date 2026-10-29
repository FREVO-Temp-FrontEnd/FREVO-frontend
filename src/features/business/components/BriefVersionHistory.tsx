import { useState } from "react";
import { Box, Button, Chip, Dialog, DialogContent, DialogTitle, Typography } from "@mui/material";
import { History, X } from "lucide-react";
import { briefFieldLabels, type BriefContentField } from "@/lib/utils/briefVersions";
import type { ProjectBrief } from "@/lib/types/marketplace.types";
import { GuidedBriefSummary } from "./GuidedBriefSummary";

function readable(value: unknown): string {
  if (value == null || value === "") return "Chưa cung cấp";
  if (Array.isArray(value)) return value.length ? value.map(item => typeof item === "object" && item && "name" in item ? String(item.name) : String(item)).join("\n") : "Chưa cung cấp";
  if (typeof value === "number") return value.toLocaleString("vi-VN");
  if (value === "both") return "Cả cá nhân và Team";
  if (value === "individual") return "Freelancer cá nhân";
  if (value === "team") return "Team";
  return String(value);
}
export function BriefVersionHistory({ project }: { project: ProjectBrief }) {
  const [open, setOpen] = useState(false);
  const revisions = [...(project.briefHistory ?? [])].reverse();
  return <>
    <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 1, gridColumn: "1 / -1" }}>
      <Chip label={`Brief · Phiên bản ${project.briefVersion ?? 1}`} size="small" sx={{ bgcolor: "background.paper", border: "1px solid", borderColor: "divider", fontSize: 12 }} />
      <Button startIcon={<History size={16} />} onClick={() => setOpen(true)} sx={{ color: "text.secondary", fontSize: 12 }}>Lịch sử thay đổi{revisions.length ? ` (${revisions.length})` : ""}</Button>
    </Box>
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md" aria-labelledby="brief-history-title" slotProps={{ paper: { sx: { borderRadius: 3, m: { xs: 1, sm: 4 }, width: { xs: "calc(100% - 16px)", sm: "100%" }, maxHeight: "90dvh" } } }}>
      <DialogTitle id="brief-history-title"><div className="flex items-center justify-between gap-3"><Typography component="span" sx={{ fontSize: 20, fontWeight: 700 }}>Lịch sử brief</Typography><Button onClick={() => setOpen(false)} aria-label="Đóng lịch sử brief" sx={{ minWidth: 40 }}><X size={18} /></Button></div><Typography sx={{ fontSize: 13, color: "text.secondary", mt: .5 }}>{project.title}</Typography></DialogTitle>
      <DialogContent dividers sx={{ p: { xs: 2, sm: 3 }, bgcolor: "background.default" }}>
        {!revisions.length && <Box sx={{ py: 5, textAlign: "center" }}><History size={28} className="mx-auto mb-3 text-[#747773]" /><Typography sx={{ fontWeight: 600 }}>Chưa có lần chỉnh sửa được ghi nhận</Typography><Typography sx={{ mt: 1, fontSize: 13, color: "text.secondary" }}>Những thay đổi sau khi đăng tuyển sẽ được lưu tại đây.</Typography></Box>}
        <div className="space-y-4">{revisions.map((revision, index) => <Box component="details" key={revision.version} open={index === 0} sx={{ border: "1px solid", borderColor: "divider", bgcolor: "background.paper", borderRadius: 2.5, overflow: "hidden" }}>
          <Box component="summary" sx={{ p: 2, cursor: "pointer", "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main" } }}><Typography component="span" sx={{ fontSize: 14, fontWeight: 700 }}>Phiên bản {revision.version - 1} → {revision.version}</Typography><Typography sx={{ fontSize: 12, color: "text.secondary", mt: .5 }}>{revision.changedBy.name} · {new Date(revision.changedAt).toLocaleString("vi-VN")}</Typography></Box>
          {revision.fields.map(fieldName => {
            const field = fieldName as BriefContentField;
            return <Box key={field} sx={{ borderTop: "1px solid", borderColor: "divider", p: 2 }}><Typography sx={{ fontSize: 13, fontWeight: 700, mb: 1.5 }}>{briefFieldLabels[field] ?? field}</Typography><div className="grid gap-3 sm:grid-cols-2">{([{ label: "Trước thay đổi", snapshot: revision.before }, { label: "Sau thay đổi", snapshot: revision.after }]).map(({ label, snapshot }) => <Box key={label} sx={{ p: 1.5, borderRadius: 2, bgcolor: "background.default", minWidth: 0 }}><Typography sx={{ fontSize: 11, fontWeight: 600, color: "text.secondary", mb: 1 }}>{label}</Typography>{field === "heroImage" && snapshot.heroImage ? <Box component="img" src={snapshot.heroImage} alt={label} sx={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 2 }} /> : field === "guidedBrief" && snapshot.guidedBrief ? <GuidedBriefSummary brief={snapshot.guidedBrief} /> : <Typography sx={{ fontSize: 13, whiteSpace: "pre-wrap", overflowWrap: "anywhere", lineHeight: 1.7 }}>{readable(snapshot[field])}</Typography>}</Box>)}</div></Box>;
          })}
        </Box>)}</div>
      </DialogContent>
    </Dialog>
  </>;
}
