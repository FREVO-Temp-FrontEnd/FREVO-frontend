import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Chip,
  Button,
  Alert,
  IconButton,
  Divider,
} from "@mui/material";
import { Sparkles, Check, X, Briefcase, Info, ArrowRight } from "lucide-react";
import type { ProjectBrief, TalentProfile } from "@/lib/types/marketplace.types";
import { calculateMatchingScore } from "@/lib/utils/matchingScore";

interface AIFitAnalysisModalProps {
  open: boolean;
  onClose: () => void;
  brief: ProjectBrief;
  talent: TalentProfile;
  onInvite: (talentId: string) => void;
  isInvited: boolean;
}

export function AIFitAnalysisModal({
  open,
  onClose,
  brief,
  talent,
  onInvite,
  isInvited,
}: AIFitAnalysisModalProps) {
  const evaluation = calculateMatchingScore(brief, talent);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            p: 1,
            boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              bgcolor: "rgba(244, 73, 11, 0.1)",
              color: "#f4490b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Sparkles size={20} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.1rem" }}>
              Đánh giá mức độ phù hợp AI (BUS-015)
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Đối chiếu hồ sơ ứng viên với yêu cầu dự án theo FR-034 và FR-035
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small" aria-label="Đóng modal">
          <X size={18} />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2.5, py: 2 }}>
        {/* Candidate & Project Header Banner */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            bgcolor: "#faf8f5",
            borderRadius: 2,
            border: "1px solid #eee",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                bgcolor: talent.color || "#f4490b",
                color: "#fff",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.1rem",
              }}
            >
              {talent.initials}
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {talent.name}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {talent.role} · <Chip label={talent.kind} size="small" sx={{ height: 20, fontSize: "0.75rem" }} />
              </Typography>
            </Box>
          </Box>

          <Box sx={{ textAlign: "right" }}>
            <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
              Điểm tương thích AI (DEC-01)
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: evaluation.score >= 80 ? "#1e8e3e" : "#f4490b",
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              {evaluation.score}%
            </Typography>
          </Box>
        </Box>

        {/* Explainable Rationale Badges (BR-026) */}
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
            Lý do gợi ý chính (BR-026)
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {evaluation.reasons.map((reason, idx) => (
              <Chip
                key={idx}
                icon={<Check size={14} color="#1e8e3e" />}
                label={reason}
                variant="outlined"
                sx={{
                  bgcolor: "#f0fdf4",
                  borderColor: "#bbf7d0",
                  color: "#166534",
                  fontWeight: 500,
                }}
              />
            ))}
          </Box>
        </Box>

        <Divider />

        {/* Skill Overlap Breakdown */}
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
            Đối sánh kỹ năng yêu cầu (FR-035)
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {brief.skills.map((skill) => {
              const matched = evaluation.skillOverlap
                .map((s) => s.toLowerCase().trim())
                .includes(skill.toLowerCase().trim());
              return (
                <Chip
                  key={skill}
                  label={skill}
                  color={matched ? "success" : "default"}
                  variant={matched ? "filled" : "outlined"}
                  size="small"
                  sx={{
                    fontWeight: 600,
                    ...(matched
                      ? { bgcolor: "#e6f4ea", color: "#137333" }
                      : { color: "text.secondary", borderColor: "#ddd" }),
                  }}
                />
              );
            })}
          </Box>
          <Typography variant="caption" sx={{ color: "text.secondary", mt: 0.5, display: "block" }}>
            Trùng khớp {evaluation.skillOverlap.length}/{brief.skills.length} kỹ năng theo yêu cầu của brief.
          </Typography>
        </Box>

        {/* Relevant Portfolio Evidence (BR-027) */}
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
            Bằng chứng Portfolio liên quan (BR-027)
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1.5 }}>
            {talent.portfolio.map((item, idx) => (
              <Box
                key={idx}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  p: 1.5,
                  borderRadius: 2,
                  border: "1px solid #e5e7eb",
                  bgcolor: "#fff",
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 1.5,
                    bgcolor: item.color || "#e0e7ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Briefcase size={18} color="#4f46e5" />
                </Box>
                <Box sx={{ overflow: "hidden" }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                    {item.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    {item.category}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Advisory Disclaimer Notice (FR-036) */}
        <Alert
          severity="info"
          icon={<Info size={18} />}
          sx={{
            borderRadius: 2,
            bgcolor: "#f0f9ff",
            borderColor: "#bae6fd",
            color: "#0369a1",
            "& .MuiAlert-icon": { color: "#0284c7" },
          }}
        >
          <Typography variant="caption" sx={{ display: "block", lineHeight: 1.4 }}>
            <strong>Khuyến cáo quy định (FR-036):</strong> Đánh giá mức độ phù hợp mang tính chất tham khảo dựa trên đối sánh kỹ năng và portfolio minh họa trong bản mẫu thử nghiệm. Doanh nghiệp chủ động thẩm định trước khi quyết định hợp tác.
          </Typography>
        </Alert>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 1, justifyContent: "space-between" }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>
          Đóng
        </Button>
        <Button
          onClick={() => {
            onInvite(talent.id);
            onClose();
          }}
          disabled={isInvited || brief.status !== "published"}
          variant="contained"
          endIcon={<ArrowRight size={16} />}
          sx={{
            borderRadius: 2,
            bgcolor: "#f4490b",
            "&:hover": { bgcolor: "#d63b04" },
            fontWeight: 600,
          }}
        >
          {isInvited ? "Đã gửi lời mời" : "Gửi lời mời tham gia dự án (FR-019)"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
