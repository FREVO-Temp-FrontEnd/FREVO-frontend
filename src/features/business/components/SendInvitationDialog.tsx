import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Button,
  TextField,
  Alert,
  IconButton,
} from "@mui/material";
import { Mail, Clock, X, ShieldCheck } from "lucide-react";
import type { ProjectBrief, TalentProfile } from "@/lib/types/marketplace.types";

interface SendInvitationDialogProps {
  open: boolean;
  onClose: () => void;
  brief: ProjectBrief;
  talent: TalentProfile | null;
  onConfirm: (talentId: string, note: string) => void;
}

export function SendInvitationDialog({
  open,
  onClose,
  brief,
  talent,
  onConfirm,
}: SendInvitationDialogProps) {
  const [note, setNote] = useState("");

  if (!talent) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(talent.id, note.trim());
    setNote("");
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
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
      <form onSubmit={handleSubmit}>
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
                Gửi lời mời tham gia dự án (BUS-009)
              </Typography>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Thời hạn phản hồi 7 ngày theo FR-019 và BR-024
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} size="small" aria-label="Đóng dialog">
            <X size={18} />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2, py: 2, scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } }}>
          {/* Target Talent & Brief Summary */}
          <Box
            sx={{
              p: 2,
              bgcolor: "#fdf8f6",
              borderRadius: 2,
              border: "1px solid #fed7aa",
            }}
          >
            <Typography variant="caption" sx={{ color: "#c2410c", fontWeight: 700, display: "block", mb: 0.5 }}>
              ĐỐI TƯỢNG NHẬN LỜI MỜI
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1f2937" }}>
              {talent.name} ({talent.kind})
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Dự án: <strong>{brief.title}</strong> · Ngân sách: {brief.budget}
            </Typography>
          </Box>

          {/* Invitation Message Note */}
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.8 }}>
              Lời nhắn gửi kèm (tùy chọn)
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ví dụ: Chào bạn, chúng tôi rất ấn tượng với portfolio của bạn và muốn mời bạn tham gia thực hiện dự án này..."
              variant="outlined"
              size="small"
            />
          </Box>

          {/* 7-Day Expiry Guarantee Banner (FR-019, BR-024) */}
          <Alert
            severity="warning"
            icon={<Clock size={18} />}
            sx={{
              borderRadius: 2,
              bgcolor: "#fffbeb",
              color: "#92400e",
              border: "1px solid #fde68a",
              "& .MuiAlert-icon": { color: "#d97706" },
            }}
          >
            <Typography variant="caption" sx={{ display: "block", fontWeight: 600 }}>
              Hiệu lực 7 ngày (FR-019, BR-024):
            </Typography>
            <Typography variant="caption" sx={{ display: "block", mt: 0.2 }}>
              Lời mời có thời hạn phản hồi trong vòng <strong>7 ngày</strong>. Sau thời hạn này, nếu Freelancer chưa phản hồi thì lời mời sẽ tự động hết hạn.
            </Typography>
          </Alert>

          {/* Candidate Approval & Chat Gating Reminder (BR-005, FR-031) */}
          <Alert
            severity="info"
            icon={<ShieldCheck size={18} />}
            sx={{
              borderRadius: 2,
              bgcolor: "#f0fdf4",
              color: "#166534",
              border: "1px solid #bbf7d0",
              "& .MuiAlert-icon": { color: "#16a34a" },
            }}
          >
            <Typography variant="caption" sx={{ display: "block" }}>
              <strong>Quy trình trao đổi (BR-005, FR-031):</strong> Khi đối tác chấp nhận lời mời, hồ sơ sẽ chuyển về trạng thái <em>Chờ xem xét</em>. Bạn cần phê duyệt ứng viên để mở tính năng nhắn tin trao đổi trực tiếp.
            </Typography>
          </Alert>
        </DialogContent>

        <DialogActions sx={{ p: 2, pt: 1, justifyContent: "space-between" }}>
          <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>
            Hủy
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{
              borderRadius: 2,
              bgcolor: "#f4490b",
              "&:hover": { bgcolor: "#d63b04" },
              fontWeight: 600,
            }}
          >
            Gửi lời mời (7 ngày)
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
