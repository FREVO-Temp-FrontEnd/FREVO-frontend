import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Button,
  Chip,
  Alert,
  IconButton,
  Divider,
} from "@mui/material";
import { Link } from "react-router";
import {
  UserCheck,
  MessageCircle,
  X,
  Check,
  ShieldCheck,
  Lock,
  ArrowRight,
  Briefcase,
  FileText,
} from "lucide-react";
import type { Candidate, ProjectBrief, TalentProfile } from "@/lib/types/marketplace.types";
import { calculateMatchingScore } from "@/lib/utils/matchingScore";

interface CandidateReviewModalProps {
  open: boolean;
  onClose: () => void;
  candidate: Candidate | null;
  talent: TalentProfile | undefined;
  project: ProjectBrief;
  onUnlockChat: (talentId: string) => void;
}

export function CandidateReviewModal({
  open,
  onClose,
  candidate,
  talent,
  project,
  onUnlockChat,
}: CandidateReviewModalProps) {
  if (!candidate || !talent) return null;

  const evaluation = calculateMatchingScore(project, talent);
  const formattedReceivedAt = new Date(candidate.receivedAt).toLocaleDateString("vi-VN");

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
            <UserCheck size={18} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.1rem" }}>
              Thẩm định hồ sơ ứng viên (BUS-013)
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Nguồn: {candidate.source} (BR-011) · Nộp ngày {formattedReceivedAt}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small" aria-label="Đóng dialog">
          <X size={18} />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2.5, py: 2 }}>
        {/* Candidate Identity Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            bgcolor: "#fafaf9",
            borderRadius: 2,
            border: "1px solid #e7e5e4",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                bgcolor: talent.color || "#f4490b",
                color: "#fff",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.2rem",
              }}
            >
              {talent.initials}
            </Box>
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {talent.name}
                </Typography>
                <Chip
                  label={talent.kind}
                  size="small"
                  variant="outlined"
                  sx={{ height: 22, fontSize: "0.75rem", fontWeight: 600 }}
                />
              </Box>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {talent.role} · {talent.location} · {talent.rate}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ textAlign: "right" }}>
            <Chip
              label={`${evaluation.score}% phù hợp AI`}
              color={evaluation.score >= 80 ? "success" : "warning"}
              size="small"
              sx={{ fontWeight: 700 }}
            />
            <Typography variant="caption" sx={{ color: "text.secondary", display: "block", mt: 0.5 }}>
              Đối sánh theo brief (DEC-01)
            </Typography>
          </Box>
        </Box>

        {/* Candidate Proposal Statement */}
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
            <FileText size={16} color="#f4490b" />
            Nội dung đề xuất ứng tuyển:
          </Typography>
          <Box
            sx={{
              p: 2,
              bgcolor: "#ffffff",
              borderRadius: 2,
              border: "1px solid #e5e7eb",
              lineHeight: 1.6,
              color: "#374151",
              fontSize: "0.9rem",
              whiteSpace: "pre-line",
            }}
          >
            {candidate.proposal}
          </Box>
        </Box>

        {/* Explainable Fit Badges & Overlap Skills */}
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
            Đối sánh năng lực & Bằng chứng kỹ năng (FR-035, BR-026)
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1.5 }}>
            {evaluation.reasons.map((reason, idx) => (
              <Chip
                key={idx}
                icon={<Check size={14} color="#15803d" />}
                label={reason}
                size="small"
                sx={{ bgcolor: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0", fontWeight: 500 }}
              />
            ))}
          </Box>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8 }}>
            {talent.skills.map((skill) => {
              const matched = evaluation.skillOverlap
                .map((s) => s.toLowerCase().trim())
                .includes(skill.toLowerCase().trim());
              return (
                <Chip
                  key={skill}
                  label={skill}
                  size="small"
                  color={matched ? "primary" : "default"}
                  variant={matched ? "filled" : "outlined"}
                  sx={{ fontSize: "0.75rem", ...(matched ? { bgcolor: "#f4490b" } : {}) }}
                />
              );
            })}
          </Box>
        </Box>

        {/* Portfolio Samples (BR-027) */}
        {talent.portfolio.length > 0 && (
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
              Portfolio minh chứng năng lực (BR-027)
            </Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1.5 }}>
              {talent.portfolio.slice(0, 4).map((item, idx) => (
                <Box
                  key={idx}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    border: "1px solid #e5e7eb",
                    bgcolor: "#fafaf9",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <Briefcase size={16} color="#6b7280" />
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
        )}

        <Divider />

        {/* GATED CHAT STATUS NOTICE (FR-031, BR-012, BR-013) */}
        {candidate.chatUnlocked ? (
          <Alert
            severity="success"
            icon={<ShieldCheck size={18} />}
            sx={{
              borderRadius: 2,
              bgcolor: "#f0fdf4",
              borderColor: "#bbf7d0",
              color: "#15803d",
              "& .MuiAlert-icon": { color: "#16a34a" },
            }}
          >
            <Typography variant="caption" sx={{ display: "block", fontWeight: 600 }}>
              Kênh trao đổi đã được kích hoạt (FR-031)
            </Typography>
            <Typography variant="caption" sx={{ display: "block" }}>
              Hồ sơ này đã được phê duyệt mở chat. Bạn và ứng viên có thể trực tiếp nhắn tin trao đổi về chi tiết phạm vi công việc.
            </Typography>
          </Alert>
        ) : (
          <Alert
            severity="warning"
            icon={<Lock size={18} />}
            sx={{
              borderRadius: 2,
              bgcolor: "#fffbeb",
              borderColor: "#fde68a",
              color: "#92400e",
              "& .MuiAlert-icon": { color: "#d97706" },
            }}
          >
            <Typography variant="caption" sx={{ display: "block", fontWeight: 700 }}>
              Kênh trao đổi đang bị khóa (BR-012, BR-013, FR-031)
            </Typography>
            <Typography variant="caption" sx={{ display: "block" }}>
              Để bảo vệ chất lượng trao đổi trên nền tảng, tính năng nhắn tin chỉ được kích hoạt sau khi Doanh nghiệp nhấn nút <strong>Phê duyệt trao đổi & Mở chat</strong> dưới đây.
            </Typography>
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 1, justifyContent: "space-between" }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>
          Đóng
        </Button>

        <Box sx={{ display: "flex", gap: 1.5 }}>
          {!candidate.chatUnlocked ? (
            <Button
              variant="contained"
              startIcon={<ShieldCheck size={16} />}
              onClick={() => {
                onUnlockChat(candidate.talentId);
                onClose();
              }}
              sx={{
                borderRadius: 2,
                fontWeight: 700,
                bgcolor: "#16a34a",
                "&:hover": { bgcolor: "#15803d" },
              }}
            >
              Phê duyệt trao đổi & Mở chat (FR-031)
            </Button>
          ) : (
            <>
              <Button
                component={Link}
                to={`/business/projects/${project.id}/messages?talent=${candidate.talentId}`}
                variant="outlined"
                startIcon={<MessageCircle size={16} />}
                sx={{ borderRadius: 2, fontWeight: 600 }}
              >
                Mở tin nhắn dự án
              </Button>

              <Button
                component={Link}
                to={`/business/projects/${project.id}/propose?talent=${candidate.talentId}`}
                variant="contained"
                endIcon={<ArrowRight size={16} />}
                sx={{
                  borderRadius: 2,
                  fontWeight: 600,
                  bgcolor: "#f4490b",
                  "&:hover": { bgcolor: "#d63b04" },
                }}
              >
                Tạo đề xuất hợp tác (FR-032)
              </Button>
            </>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
}
