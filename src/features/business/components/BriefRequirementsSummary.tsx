import { Box, Typography } from "@mui/material";
import type { ProjectBrief } from "@/lib/types/marketplace.types";
export function BriefRequirementsSummary({ project }: { project: Pick<ProjectBrief, "tools" | "experience" | "audience" | "requirements"> }) {
  const rows = [ ["Công cụ", project.tools?.join(", ")], ["Kinh nghiệm mong muốn", project.experience], ["Ứng viên phù hợp", project.audience], ["Yêu cầu bổ sung", project.requirements?.join("\n")] ].filter(([,value]) => value);
  if (!rows.length) return null;
  return <Box component="section" aria-label="Yêu cầu ứng viên" sx={{ p: { xs: 2, sm: 3 }, border: "1px solid", borderColor: "divider", borderRadius: 3, bgcolor: "background.paper" }}><Typography component="h2" sx={{ fontSize: 18, fontWeight: 700, mb: 2 }}>Yêu cầu ứng viên</Typography><div className="grid gap-5 sm:grid-cols-2">{rows.map(([label,value]) => <div key={label}><Typography sx={{ fontSize: 12, color: "text.secondary", mb: .75 }}>{label}</Typography><Typography sx={{ fontSize: 13, lineHeight: 1.7, whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{value}</Typography></div>)}</div></Box>;
}
