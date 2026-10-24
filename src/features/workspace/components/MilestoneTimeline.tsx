import React from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Button,
  LinearProgress,
} from "@mui/material";
import {
  CheckCircle2,
  Clock,
  UploadCloud,
  FileCheck,
  Calendar,
} from "lucide-react";
import type { Milestone } from "@/lib/types/marketplace.types";

interface MilestoneTimelineProps {
  milestones: Milestone[];
  isBusiness: boolean;
  onSubmitDeliverable: (milestone: Milestone) => void;
  onReviewDeliverable: (milestone: Milestone) => void;
}

const statusConfig: Record<
  Milestone["status"],
  { label: string; color: string; bg: string; icon: React.ReactNode }
> = {
  upcoming: {
    label: "Sắp tới",
    color: "#64748b",
    bg: "#f1f5f9",
    icon: <Clock size={16} />,
  },
  in_progress: {
    label: "Đang thực hiện",
    color: "#0284c7",
    bg: "#e0f2fe",
    icon: <Clock size={16} />,
  },
  submitted: {
    label: "Chờ Business nghiệm thu",
    color: "#d97706",
    bg: "#fef3c7",
    icon: <FileCheck size={16} />,
  },
  completed: {
    label: "Đã hoàn thành",
    color: "#16a34a",
    bg: "#dcfce7",
    icon: <CheckCircle2 size={16} />,
  },
};

export const MilestoneTimeline: React.FC<MilestoneTimelineProps> = ({
  milestones,
  isBusiness,
  onSubmitDeliverable,
  onReviewDeliverable,
}) => {
  const completedCount = milestones.filter((m) => m.status === "completed").length;
  const progressPercent = Math.round((completedCount / (milestones.length || 1)) * 100);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Progress Summary Card */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: "14px",
          bgcolor: "#ffffff",
          border: "1px solid #e2e8f0",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#1e293b" }}>
              Tiến độ hoàn thành dự án (BR-025)
            </Typography>
            <Typography variant="caption" sx={{ color: "#64748b" }}>
              Tiến trình thực hiện linh hoạt, không bắt buộc tuần tự cứng nhắc
            </Typography>
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              fontFamily: "Space Grotesk, sans-serif",
              color: progressPercent === 100 ? "#16a34a" : "#f4490b",
            }}
          >
            {progressPercent}%
          </Typography>
        </Box>

        <LinearProgress
          variant="determinate"
          value={progressPercent}
          sx={{
            height: 8,
            borderRadius: 4,
            bgcolor: "#f1f5f9",
            "& .MuiLinearProgress-bar": {
              bgcolor: progressPercent === 100 ? "#16a34a" : "#f4490b",
              borderRadius: 4,
            },
          }}
        />

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
          <Typography variant="caption" sx={{ color: "#64748b" }}>
            Đã hoàn thành {completedCount}/{milestones.length} mốc công việc
          </Typography>
        </Box>
      </Paper>

      {/* Timeline Items */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {milestones.map((m, index) => {
          const cfg = statusConfig[m.status];
          const usedRevisions = m.revisionAllowance?.used ?? 0;
          const allowedRevisions = m.revisionAllowance?.allowed ?? 2;

          return (
            <Paper
              key={m.id}
              elevation={0}
              sx={{
                p: 3,
                borderRadius: "14px",
                border: "1px solid #e2e8f0",
                bgcolor: "#ffffff",
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "center" },
                gap: 2.5,
                position: "relative",
                borderLeft: m.status === "completed" ? "4px solid #16a34a" : m.status === "submitted" ? "4px solid #f59e0b" : "4px solid #cbd5e1",
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap", mb: 0.5 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#1e293b" }}>
                    {index + 1}. {m.name}
                  </Typography>
                  <Chip
                    icon={cfg.icon as React.ReactElement}
                    label={cfg.label}
                    size="small"
                    sx={{
                      bgcolor: cfg.bg,
                      color: cfg.color,
                      fontWeight: 700,
                      fontSize: "11px",
                      height: 22,
                    }}
                  />
                  <Chip
                    label={`Sửa đổi: ${usedRevisions}/${allowedRevisions} lượt (DEC-03)`}
                    size="small"
                    sx={{
                      bgcolor: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      color: "#475569",
                      fontSize: "11px",
                      height: 22,
                    }}
                  />
                </Box>

                <Typography variant="body2" sx={{ color: "#475569", mb: 1.5 }}>
                  {m.deliverable}
                </Typography>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, color: "#64748b", fontSize: "12px" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Calendar size={14} /> Hạn chót: <strong>{m.deadline}</strong>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#f4490b" }}>
                    Chi phí: <strong>{m.amount}</strong>
                  </Box>
                  {m.submittedAt && (
                    <Typography variant="caption" sx={{ color: "#d97706" }}>
                      Gửi bàn giao: {new Date(m.submittedAt).toLocaleDateString("vi-VN")}
                    </Typography>
                  )}
                  {m.completedAt && (
                    <Typography variant="caption" sx={{ color: "#16a34a" }}>
                      Nghiệm thu: {new Date(m.completedAt).toLocaleDateString("vi-VN")}
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: "flex", gap: 1, flexShrink: 0 }}>
                {!isBusiness && (m.status === "in_progress" || m.status === "upcoming") && (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => onSubmitDeliverable(m)}
                    startIcon={<UploadCloud size={16} />}
                    sx={{
                      bgcolor: "#f4490b",
                      "&:hover": { bgcolor: "#bd3d14" },
                      textTransform: "none",
                      fontWeight: 600,
                      borderRadius: "999px",
                      px: 2,
                      color: "#ffffff !important",
                      "& *": { color: "#ffffff !important" },
                    }}
                  >
                    Nộp bàn giao
                  </Button>
                )}

                {isBusiness && m.status === "submitted" && (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => onReviewDeliverable(m)}
                    startIcon={<FileCheck size={16} />}
                    sx={{
                      bgcolor: "#059669",
                      "&:hover": { bgcolor: "#047857" },
                      textTransform: "none",
                      fontWeight: 600,
                      borderRadius: "999px",
                      px: 2,
                      color: "#ffffff !important",
                      "& *": { color: "#ffffff !important" },
                    }}
                  >
                    Nghiệm thu mốc
                  </Button>
                )}
              </Box>
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
};
