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
  ShieldCheck,
  Lock,
  ArrowRight,
  FileText,
} from "lucide-react";
import { useTalentPortfolio } from "@/lib/hooks/useTalentPortfolio";
import { talentWorkPath, talentProfilePath } from "@/lib/utils/portfolioPaths";
import { PortfolioWorkLink } from "@/app/shared/components/PortfolioWorkLink";
import type { Candidate, ProjectBrief, TalentProfile } from "@/lib/types/marketplace.types";

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
  const { works } = useTalentPortfolio(talent?.id ?? "");
  if (!candidate || !talent) return null;

  const matchedSkills = talent.skills.filter((skill) => project.skills.some((required) => required.toLocaleLowerCase("vi") === skill.toLocaleLowerCase("vi")));
  const canApprove = project.status === "published" && (candidate.status === "new" || candidate.status === "under_review") && !candidate.chatUnlocked;
  const canChat = candidate.chatUnlocked && candidate.status !== "not_selected";
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
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
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
              Chi tiết hồ sơ ứng viên
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Nguồn: {candidate.source} · Nộp ngày {formattedReceivedAt}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small" aria-label="Đóng dialog">
          <X size={18} />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2.5, py: 2, scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } }}>
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

          <Chip label={canChat ? "Đã duyệt trao đổi" : canApprove ? "Chờ xem xét" : "Lưu trong lịch sử"} size="small" color={canChat ? "success" : "default"} variant="outlined" />
        </Box>

        {/* Candidate Proposal Statement */}
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
            <FileText size={16} color="#f4490b" />
            Lời giới thiệu ứng tuyển
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
            Kỹ năng liên quan đến brief
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            {matchedSkills.length ? `${matchedSkills.length} kỹ năng trùng với yêu cầu dự án.` : "Chưa có kỹ năng trùng trực tiếp với brief."}
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8 }}>
            {talent.skills.map((skill) => {
              const matched = matchedSkills.includes(skill);
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

        {/* Public works are resolved by owner, using the same records as the profile. */}
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, mb: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Portfolio của {talent.name}</Typography>
            <Button component={Link} to={talentProfilePath(talent.id)} size="small">Hồ sơ cá nhân</Button>
          </Box>
          {works.length ? <Box className="grid gap-3 sm:grid-cols-2">{works.map(work => <Box key={work.id} sx={{ p: 1.5, borderRadius: 2, border: "1px solid", borderColor: "divider", display: "flex", alignItems: "center", gap: 1.5 }}>
            <PortfolioWorkLink talentId={talent.id} work={work} size={54} />
            <Box sx={{ minWidth: 0 }}><Typography component={Link} to={talentWorkPath(talent.id, work.id)} sx={{ fontSize: 14, fontWeight: 600, display: "block" }}>{work.title}</Typography><Typography variant="caption" color="text.secondary">{work.category} · {work.role}</Typography></Box>
          </Box>)}</Box> : <Typography variant="body2" color="text.secondary">Chưa có tác phẩm công khai.</Typography>}
        </Box>

        <Divider />

        {/* GATED CHAT STATUS NOTICE (FR-031, BR-012, BR-013) */}
        {canChat ? (
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
              Kênh trao đổi đã được mở
            </Typography>
            <Typography variant="caption" sx={{ display: "block" }}>
              Hồ sơ này đã được phê duyệt mở chat. Bạn và ứng viên có thể trực tiếp nhắn tin trao đổi về chi tiết phạm vi công việc.
            </Typography>
          </Alert>
        ) : canApprove ? (
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
              Kênh trao đổi đang bị khóa
            </Typography>
            <Typography variant="caption" sx={{ display: "block" }}>
              Business cần duyệt hồ sơ trước khi có thể nhắn tin với ứng viên.
            </Typography>
          </Alert>
        ) : (
          <Alert severity="info" sx={{ borderRadius: 2 }}>
            Hồ sơ này được lưu trong lịch sử tuyển dụng. Hiện không thể duyệt hoặc mở thêm cuộc trao đổi.
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 1, justifyContent: "space-between" }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>
          Đóng
        </Button>

        <Box sx={{ display: "flex", gap: 1.5 }}>
          {canApprove ? (
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
              }}
            >
              Duyệt để trao đổi
            </Button>
          ) : canChat ? (
            <>
              <Button
                component={Link}
                to={`/business/messages?view=project&scope=${project.id}&project=${project.id}&talent=${candidate.talentId}`}
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
                }}
              >
                Tạo đề xuất hợp tác
              </Button>
            </>
          ) : null}
        </Box>
      </DialogActions>
    </Dialog>
  );
}
