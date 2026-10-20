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
import { Mail, Clock, X, CheckCircle, XCircle, Briefcase, Calendar, DollarSign, ShieldAlert } from "lucide-react";
import type { Invitation, ProjectBrief } from "@/lib/types/marketplace.types";

interface InvitationDetailDialogProps {
  open: boolean;
  onClose: () => void;
  invitation: Invitation | null;
  project: ProjectBrief | undefined;
  onAccept: (invitationId: string) => void;
  onDecline: (invitationId: string) => void;
}

export function InvitationDetailDialog({
  open,
  onClose,
  invitation,
  project,
  onAccept,
  onDecline,
}: InvitationDetailDialogProps) {
  if (!invitation || !project) return null;

  const isPending = invitation.status === "pending";
  const isAccepted = invitation.status === "accepted";

  const formattedSentAt = new Date(invitation.sentAt).toLocaleDateString("vi-VN");
  const formattedExpiresAt = new Date(invitation.expiresAt).toLocaleDateString("vi-VN");

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
            <Mail size={18} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.1rem" }}>
              Chi tiết lời mời tham gia dự án (FL-011)
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Doanh nghiệp: {project.company || "Nắng Studio"} · Gửi ngày {formattedSentAt}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small" aria-label="Đóng dialog">
          <X size={18} />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2.5, py: 2 }}>
        {/* Project Header Info */}
        <Box
          sx={{
            p: 2,
            bgcolor: "#fafaf9",
            borderRadius: 2,
            border: "1px solid", borderColor: "divider",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
            <Box>
              <Chip
                label={project.category}
                size="small"
                sx={{ bgcolor: "#f5f5f4", color: "#57534e", fontWeight: 600, mb: 0.5 }}
              />
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#1c1917" }}>
                {project.title}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Bởi <strong>{project.company}</strong> ({project.city || "Toàn quốc"})
              </Typography>
            </Box>

            <Box sx={{ textAlign: "right" }}>
              <Chip
                icon={<Clock size={13} />}
                label={
                  isPending
                    ? `Hết hạn: ${formattedExpiresAt} (7 ngày)`
                    : isAccepted
                    ? "Đã chấp nhận"
                    : "Đã từ chối"
                }
                color={isPending ? "warning" : isAccepted ? "success" : "default"}
                size="small"
                sx={{ fontWeight: 700 }}
              />
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 3, mt: 1.5, flexWrap: "wrap" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <DollarSign size={16} color="#f4490b" />
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Ngân sách: <strong>{project.budget}</strong>
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Calendar size={16} color="#f4490b" />
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Hạn hoàn thành: <strong>{project.deadline}</strong>
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Briefcase size={16} color="#f4490b" />
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Thời gian dự kiến: <strong>{project.duration || "4-6 tuần"}</strong>
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Business Invitation Note */}
        {invitation.note && (
          <Box sx={{ p: 2, bgcolor: "#fff7ed", borderRadius: 2, border: "1px solid #fed7aa" }}>
            <Typography variant="caption" sx={{ color: "#c2410c", fontWeight: 700, display: "block", mb: 0.5 }}>
              LỜI NHẮN TỪ DOANH NGHIỆP:
            </Typography>
            <Typography variant="body2" sx={{ color: "#7c2d12", fontStyle: "italic" }}>
              &ldquo;{invitation.note}&rdquo;
            </Typography>
          </Box>
        )}

        {/* Project Description */}
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
            Mô tả công việc & Phạm vi dự án
          </Typography>
          <Typography variant="body2" sx={{ color: "#44403c", lineHeight: 1.6 }}>
            {project.description}
          </Typography>
        </Box>

        {/* Skills Required */}
        {project.skills && project.skills.length > 0 && (
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
              Kỹ năng yêu cầu
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8 }}>
              {project.skills.map((skill) => (
                <Chip
                  key={skill}
                  label={skill}
                  size="small"
                  variant="outlined"
                  sx={{ borderColor: "#d6d3d1", fontWeight: 500 }}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Deliverables List */}
        {project.deliverables && project.deliverables.length > 0 && (
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.8 }}>
              Sản phẩm bàn giao mong đợi
            </Typography>
            <Box component="ul" sx={{ pl: 2.5, m: 0, color: "#57534e", fontSize: "0.875rem" }}>
              {project.deliverables.map((item, idx) => (
                <li key={idx} style={{ marginBottom: "4px" }}>
                  {item}
                </li>
              ))}
            </Box>
          </Box>
        )}

        <Divider />

        {/* BR-005 & FR-031 Candidate Approval Notice */}
        <Alert
          severity="info"
          icon={<ShieldAlert size={18} />}
          sx={{
            borderRadius: 2,
            bgcolor: "#f0f9ff",
            color: "#0369a1",
            borderColor: "#bae6fd",
            "& .MuiAlert-icon": { color: "#0284c7" },
          }}
        >
          <Typography variant="caption" sx={{ display: "block", lineHeight: 1.5 }}>
            <strong>Quy tắc chấp nhận lời mời (BR-005, FR-031):</strong> Khi bạn chấp nhận lời mời, hệ thống sẽ tự động cập nhật trạng thái hồ sơ của bạn thành <em>Chờ Business xem xét</em>. Doanh nghiệp sẽ đánh giá và mở kênh chat trao đổi nếu xét thấy phù hợp. Kênh chat không tự động mở ngay lập tức.
          </Typography>
        </Alert>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 1, justifyContent: "space-between" }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>
          Đóng
        </Button>

        {isPending ? (
          <Box sx={{ display: "flex", gap: 1.5 }}>
            <Button
              variant="outlined"
              color="error"
              startIcon={<XCircle size={16} />}
              onClick={() => {
                onDecline(invitation.id);
                onClose();
              }}
              sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
            >
              Từ chối lời mời
            </Button>
            <Button
              variant="contained"
              startIcon={<CheckCircle size={16} />}
              onClick={() => {
                onAccept(invitation.id);
                onClose();
              }}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                bgcolor: "#f4490b",
                "&:hover": { bgcolor: "#d63b04" },
              }}
            >
              Chấp nhận lời mời (BR-005)
            </Button>
          </Box>
        ) : (
          <Typography variant="body2" sx={{ color: isAccepted ? "#15803d" : "#b91c1c", fontWeight: 600 }}>
            {isAccepted ? "Bạn đã chấp nhận lời mời này." : "Bạn đã từ chối lời mời này."}
          </Typography>
        )}
      </DialogActions>
    </Dialog>
  );
}
