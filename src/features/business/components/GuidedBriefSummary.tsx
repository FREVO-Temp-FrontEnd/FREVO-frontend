import { Box, Typography } from "@mui/material";
import type { GuidedBrief } from "@/lib/types/guidedBrief.types";
import { creativeServices } from "../data/creativeBriefTemplates";

export function GuidedBriefSummary({ brief }: { brief: GuidedBrief }) {
  const service = creativeServices.find(item => item.id === brief.serviceId);
  return <Box component="section" aria-label="Phạm vi và tiêu chí nghiệm thu" sx={{ p: { xs: 2, sm: 3 }, border: "1px solid", borderColor: "divider", borderRadius: 3, bgcolor: "background.paper" }}>
    <Typography component="h2" sx={{ fontSize: 18, fontWeight: 700, mb: 2 }}>{service?.name ?? "Yêu cầu bàn giao"}</Typography>
    <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, mb: 3 }}>{[["Trong phạm vi", brief.inScope], ["Ngoài phạm vi", brief.outOfScope]].map(([label, text]) => <div key={label}><Typography sx={{ fontSize: 12, fontWeight: 600, mb: .75 }}>{label}</Typography><Typography sx={{ fontSize: 13, whiteSpace: "pre-wrap", overflowWrap: "anywhere", color: "text.secondary" }}>{text || "Chưa cung cấp"}</Typography></div>)}</Box>
    <div className="space-y-4">{brief.items.map(item => <Box key={item.typeId} sx={{ borderTop: "1px solid", borderColor: "divider", pt: 2 }}><Typography component="h3" sx={{ fontSize: 14, fontWeight: 700, mb: 1 }}>{item.name}</Typography>{Object.entries(item.specifications).map(([key, value]) => <Typography key={key} sx={{ fontSize: 13, whiteSpace: "pre-wrap", overflowWrap: "anywhere", mb: 1 }}><Box component="span" sx={{ color: "text.secondary" }}>{service?.deliverables.find(template => template.id === item.typeId)?.fields.find(field => field.id === key)?.label ?? key}: </Box>{value}</Typography>)}<Typography sx={{ fontSize: 12, fontWeight: 600, mt: 1.5 }}>Tiêu chí nghiệm thu</Typography><Typography sx={{ mt: .5, fontSize: 13, whiteSpace: "pre-wrap", overflowWrap: "anywhere", color: "text.secondary" }}>{item.acceptanceCriteria || "Chưa cung cấp"}</Typography></Box>)}</div>
  </Box>;
}
