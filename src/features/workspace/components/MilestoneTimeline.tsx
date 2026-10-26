import { Accordion, AccordionDetails, AccordionSummary, Alert, Box, Button, Chip, Typography } from "@mui/material";
import { CalendarDays, CheckCircle2, ChevronDown, Eye, FileCheck, FilePenLine, UploadCloud } from "lucide-react";
import type { Milestone } from "@/lib/types/marketplace.types";
import { MilestoneFiles } from "./MilestoneFiles";
import { milestoneMoney, milestoneStatuses, milestoneTitle, workspaceDate } from "../utils/workspace";

interface MilestoneTimelineProps {
  milestones: Milestone[];
  isBusiness: boolean;
  onSubmitDeliverable: (milestone: Milestone) => void;
  onReviewDeliverable: (milestone: Milestone, mode?: "approve" | "revision") => void;
}

export function MilestoneTimeline({ milestones, isBusiness, onSubmitDeliverable, onReviewDeliverable }: MilestoneTimelineProps) {
  return <Box className="flex min-w-0 flex-col gap-4">
    <Box className="flex flex-wrap items-start justify-between gap-3" sx={{ mb: .5 }}>
      <Box>
        <Typography
          component="h2"
          sx={{ fontFamily: "h2.fontFamily", fontSize: { xs: 21, md: 23 }, fontWeight: 800, lineHeight: 1.35 }}>Lộ trình dự án & các mốc bàn giao</Typography>
        <Typography sx={{ mt: .75, fontSize: 12, color: "text.secondary" }}>Theo dõi sản phẩm, phản hồi và nghiệm thu theo từng mốc.</Typography>
      </Box>
      <Chip label={`${milestones.length} mốc thực thi`} size="small" sx={{ bgcolor: "#efefec", fontSize: 10 }} />
    </Box>
    {!milestones.length && <Alert severity="info" sx={{ borderRadius: "13px" }}>Chưa có mốc công việc. Xem thỏa thuận hoặc đề xuất điều chỉnh để thống nhất kế hoạch.</Alert>}
    {milestones.map((milestone, index) => {
      const config = milestoneStatuses[milestone.status];
      const revisionPending = milestone.status === "in_progress" && !!milestone.revisionHistory?.length;
      const used = milestone.revisionAllowance?.used ?? 0;
      const allowance = milestone.revisionAllowance?.allowed ?? 2;
      return <Accordion
        key={milestone.id}
        id={`milestone-${milestone.id}`}
        defaultExpanded={milestone.status !== "upcoming"}
        disableGutters
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderTop: milestone.status === "submitted" ? "3px solid" : "1px solid",
          borderTopColor: milestone.status === "submitted" ? "primary.main" : "divider",
          borderRadius: "16px !important",
          overflow: "hidden",
          "&:before": { display: "none" },
          scrollMarginTop: 100
        }}>
        <AccordionSummary
          expandIcon={<ChevronDown size={18} />}
          aria-controls={`milestone-${milestone.id}-content`}
          id={`milestone-${milestone.id}-heading`}
          sx={{ px: { xs: 2, md: 3 }, py: 1.5, "& .MuiAccordionSummary-content": { gap: 2, alignItems: "flex-start" } }}>
          <Typography
            aria-hidden="true"
            sx={{
              fontFamily: "h2.fontFamily",
              fontSize: 36,
              lineHeight: 1.15,
              fontWeight: 800,
              color: milestone.status === "submitted" ? "#f1c8b7" : milestone.status === "completed" ? "#b7daca" : "#d4d7d1",
              flexShrink: 0
            }}>{String(index + 1).padStart(2, "0")}</Typography>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Box className="flex flex-wrap items-center gap-2">
              <Typography component="h3" sx={{ fontFamily: "h3.fontFamily", fontSize: { xs: 16, md: 19 }, fontWeight: 700 }}>{milestoneTitle(milestone.name)}</Typography>
              <Chip
                label={revisionPending ? "Cần chỉnh sửa" : config.label}
                size="small"
                sx={{ bgcolor: config.background, color: config.color, height: 22, fontSize: 10, fontWeight: 600 }} />
            </Box>
            <Box className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
              <Typography sx={{ fontSize: 12, color: "text.secondary" }}>Ngân sách mốc:
                <Box component="strong" sx={{ color: milestone.status === "submitted" ? "primary.dark" : "text.primary" }}>{milestoneMoney(milestone)}</Box>
              </Typography>
              <Typography className="flex items-center gap-1" sx={{ fontSize: 11, color: "text.secondary" }}>
                <CalendarDays size={12} />Hạn: {milestone.deadline}
              </Typography>
            </Box>
            <Typography sx={{ fontSize: 10, color: "text.secondary", mt: 1 }}>Chỉnh sửa: {used}/{allowance === "custom" ? "theo thỏa thuận" : allowance} lượt{milestone.submittedAt ? ` · Bàn giao ngày ${workspaceDate(milestone.submittedAt)}` : ""}</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ px: { xs: 2, md: 3 }, pt: 0, pb: 2.5 }}>
          <Box sx={{ p: 2, bgcolor: "background.default", borderRadius: "12px", mb: 2.5 }}>
            <Typography sx={{ fontSize: 13, lineHeight: 1.85 }}>{milestone.deliverable}</Typography>
          </Box>
          {(milestone.status !== "upcoming" || milestone.submissionFiles?.length) && <MilestoneFiles files={milestone.submissionFiles ?? []} />}
          {milestone.submissionNotes && <Typography
            sx={{
              fontSize: 12,
              color: "text.secondary",
              fontStyle: "italic",
              lineHeight: 1.85,
              mt: 2,
              pl: 2,
              borderLeft: "2px solid",
              borderColor: "divider"
            }}>“{milestone.submissionNotes}”</Typography>}
          {revisionPending && <Alert severity="warning" sx={{ mt: 2, borderRadius: "12px", fontSize: 12, whiteSpace: "pre-line" }}>{milestone.revisionHistory?.at(-1)?.reason}</Alert>}
          {milestone.status === "upcoming" && <Typography sx={{ color: "text.secondary", fontSize: 12 }}>Mốc chưa bắt đầu. Các điều kiện triển khai theo thỏa thuận đã được hai bên xác nhận.</Typography>}
          <Box className="mt-5 flex flex-wrap items-center justify-end gap-2">
            {milestone.status === "completed" && <Typography className="mr-auto flex items-center gap-1.5" sx={{ color: "#16805b", fontSize: 12 }}>
              <CheckCircle2 size={16} />Đã nghiệm thu {workspaceDate(milestone.completedAt)}
            </Typography>}
            {(milestone.status === "submitted" || milestone.status === "completed") && <Button
              onClick={() => onReviewDeliverable(milestone)}
              startIcon={<Eye size={15} />}
              size="small"
              sx={{ fontSize: 11, color: "text.secondary" }}>Xem bàn giao</Button>}
            {isBusiness && milestone.status === "submitted" && <><Button
              onClick={() => onReviewDeliverable(milestone, "revision")}
              startIcon={<FilePenLine size={15} />}
              size="small"
              sx={{ bgcolor: "background.default", color: "text.primary", px: 2, fontSize: 11 }}>Yêu cầu chỉnh sửa</Button><Button
                onClick={() => onReviewDeliverable(milestone)}
                startIcon={<FileCheck size={15} />}
                variant="contained"
                size="small"
                sx={{ px: 2.25, fontSize: 11 }}>Nghiệm thu mốc {index + 1}</Button></>}
            {!isBusiness && (milestone.status === "in_progress" || milestone.status === "upcoming") && <Button
              onClick={() => onSubmitDeliverable(milestone)}
              variant="contained"
              startIcon={<UploadCloud size={15} />}
              size="small">Nộp bàn giao</Button>}
          </Box>
        </AccordionDetails>
      </Accordion>;
    })}
  </Box>;
}
