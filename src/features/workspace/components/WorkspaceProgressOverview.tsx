import { Box, ButtonBase, Chip, Paper, Typography } from "@mui/material";
import { Check, Clock3, ClipboardCheck } from "lucide-react";
import type { Milestone } from "@/lib/types/marketplace.types";
import { milestoneMoney, milestoneStatuses, milestoneTitle } from "../utils/workspace";

interface WorkspaceProgressOverviewProps {
  milestones: Milestone[];
  budget: string;
  onSelect: (id: string) => void;
}

export function WorkspaceProgressOverview({ milestones, budget, onSelect }: WorkspaceProgressOverviewProps) {
  const pending = milestones.findIndex(item => item.status === "submitted");
  return <Paper elevation={0} sx={{ p: { xs: 2.5, md: 3 }, borderRadius: "16px", border: "1px solid", borderColor: "divider" }}>
    <Box
      className="grid items-center gap-6"
      sx={{ gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1fr) 220px" } }}>
      <Box
        className="grid gap-3"
        sx={{ gridTemplateColumns: { xs: "1fr", sm: `repeat(${Math.min(milestones.length || 1, 3)}, minmax(0,1fr))` } }}>
        {milestones.map((milestone, index) => {
          const config = milestoneStatuses[milestone.status];
          const Icon = milestone.status === "completed" ? Check : milestone.status === "submitted" ? ClipboardCheck : Clock3;
          return <ButtonBase
            key={milestone.id}
            onClick={() => onSelect(milestone.id)}
            sx={{
              display: "block",
              textAlign: "left",
              borderRadius: "12px",
              p: 1.75,
              bgcolor: config.background,
              minWidth: 0,
              "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: 3 }
            }}>
            <Box className="flex items-center justify-between gap-2">
              <Typography className="flex items-center gap-1" sx={{ fontSize: 11, fontWeight: 700, color: config.color }}>
                <Icon size={14} />Mốc {index + 1}
              </Typography>
              <Typography sx={{ fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>{milestoneMoney(milestone)}</Typography>
            </Box>
            <Typography sx={{ fontSize: 12, fontWeight: 600, mt: .6 }}>{milestoneTitle(milestone.name)}</Typography>
            <Typography sx={{ fontSize: 10, color: config.color, mt: .5 }}>{config.label}</Typography>
            <Box sx={{ mt: 1.25, height: 3, bgcolor: "divider", borderRadius: 2 }}>
              <Box
                sx={{ height: "100%", borderRadius: "inherit", width: milestone.status === "completed" ? "100%" : 0, bgcolor: config.color }} />
            </Box>
          </ButtonBase>;
        })}
      </Box>
      <Box
        sx={{
          display: "block",
          borderLeft: { lg: "1px solid" },
          borderColor: { lg: "divider" },
          pl: { lg: 2 }
        }}>
        <Box className="flex items-center justify-between gap-3">
          <Typography sx={{ fontSize: 12, color: "text.secondary" }}>Tổng ngân sách</Typography>
          <Typography sx={{ fontWeight: 700, fontSize: 15 }}>{budget}</Typography>
        </Box>
        <Box className="mt-2 flex items-center justify-between gap-3">
          <Typography sx={{ fontSize: 12, color: "text.secondary" }}>Đang chờ duyệt</Typography>
          <Typography sx={{ fontWeight: 600, fontSize: 12, color: "primary.dark" }}>{pending >= 0 ? `Mốc ${pending + 1}` : "Không có"}</Typography>
        </Box>
        <Chip
          label="Không gian làm việc mô phỏng"
          size="small"
          sx={{ mt: 1.5, height: 22, fontSize: 10, bgcolor: "background.default", color: "text.secondary" }} />
      </Box>
    </Box>
  </Paper>;
}
