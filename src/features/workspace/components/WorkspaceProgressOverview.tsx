import { Box, ButtonBase, LinearProgress, Paper, Typography } from "@mui/material";
import { Check, ClipboardCheck, Clock3 } from "lucide-react";
import type { Milestone } from "@/lib/types/marketplace.types";
import { milestoneStatuses, milestoneTitle } from "../utils/workspace";

interface WorkspaceProgressOverviewProps {
  milestones: Milestone[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

export function WorkspaceProgressOverview({ milestones, activeId, onSelect }: WorkspaceProgressOverviewProps) {
  const completed = milestones.filter(item => item.status === "completed").length;
  const pending = milestones.filter(item => item.status === "submitted").length;
  const progress = milestones.length ? Math.round(completed / milestones.length * 100) : 0;
  return <Paper component="section" aria-labelledby="workspace-progress-title" variant="outlined" sx={{ p: { xs: 2.5, md: 3 }, borderRadius: "13px" }}>
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 1.5 }}>
      <Box>
        <Typography component="h2" id="workspace-progress-title" sx={{ fontFamily: "h2.fontFamily", fontSize: 20, fontWeight: 700 }}>Tổng quan tiến độ</Typography>
        <Typography color="text.secondary" sx={{ fontSize: 14, mt: 0.75 }}>{completed}/{milestones.length} mốc đã nghiệm thu{pending > 0 && ` · ${pending} mốc đang chờ phản hồi`}</Typography>
      </Box>
      <Typography sx={{ fontFamily: "h2.fontFamily", fontSize: 26, fontWeight: 800, color: "primary.dark", fontVariantNumeric: "tabular-nums" }}>{progress}%</Typography>
    </Box>
    <LinearProgress variant="determinate" value={progress} aria-label="Tỷ lệ mốc đã nghiệm thu" aria-valuetext={`${completed} trên ${milestones.length} mốc đã nghiệm thu`} sx={{ mt: 2, height: 6, borderRadius: 999, bgcolor: "action.hover", "& .MuiLinearProgress-bar": { bgcolor: "primary.dark", borderRadius: 999 }, "@media (prefers-reduced-motion: reduce)": { "& .MuiLinearProgress-bar": { transition: "none" } } }} />
    {milestones.length > 0 && <Box component="nav" aria-label="Chọn mốc công việc" sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: `repeat(${Math.min(milestones.length, 3)}, minmax(0, 1fr))` }, gap: 1.5, mt: 2.5 }}>
      {milestones.map((milestone, index) => {
        const config = milestoneStatuses[milestone.status];
        const Icon = milestone.status === "completed" ? Check : milestone.status === "submitted" ? ClipboardCheck : Clock3;
        return <ButtonBase key={milestone.id} onClick={() => onSelect(milestone.id)} aria-controls={`milestone-${milestone.id}`} aria-current={activeId === milestone.id ? "step" : undefined} sx={{ p: 1.5, display: "flex", alignItems: "start", justifyContent: "flex-start", gap: 1.25, textAlign: "left", border: "1px solid", borderColor: activeId === milestone.id ? "primary.dark" : "divider", bgcolor: activeId === milestone.id ? "#fff0e9" : "background.paper", borderRadius: "10px", minWidth: 0, "&:focus-visible": { outline: "2px solid", outlineColor: "primary.dark", outlineOffset: 3 } }}>
          <Box sx={{ display: "flex", p: 0.75, borderRadius: "50%", bgcolor: config.background, color: config.color, flexShrink: 0 }}><Icon size={16} aria-hidden="true" /></Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 700, overflowWrap: "anywhere" }}>{index + 1}. {milestoneTitle(milestone.name)}</Typography>
            <Typography sx={{ fontSize: 13, mt: 0.5, color: config.color }}>{config.label}</Typography>
          </Box>
        </ButtonBase>;
      })}
    </Box>}
  </Paper>;
}
