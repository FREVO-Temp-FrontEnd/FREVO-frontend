import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
} from "@mui/material";
import { Award, Star, ArrowRight } from "lucide-react";

interface ProjectCompletedModalProps {
  open: boolean;
  projectTitle: string;
  partnerName: string;
  onClose: () => void;
  onOpenReview: () => void;
}

export const ProjectCompletedModal: React.FC<ProjectCompletedModalProps> = ({
  open,
  projectTitle,
  partnerName,
  onClose,
  onOpenReview,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth slotProps={{ paper: { sx: { borderRadius: "16px", p: 1, textAlign: "center" } } }}>
      <DialogContent sx={{ pt: 4 }}>
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            bgcolor: "#ecfdf5",
            color: "#059669",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 2,
          }}
        >
          <Award size={36} />
        </Box>

        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            fontFamily: "Space Grotesk, sans-serif",
            color: "#1e293b",
            mb: 1,
          }}
        >
          Dự án đã hoàn thành!
        </Typography>

        <Typography variant="body2" sx={{ color: "#64748b", mb: 3, lineHeight: 1.6 }}>
          Tất cả các mốc bàn giao của dự án <strong>"{projectTitle}"</strong> giữa bạn và đối tác <strong>{partnerName}</strong> đã được nghiệm thu đầy đủ (theo quy định <strong>FR-040, FR-053</strong>).
        </Typography>

        <Box sx={{ p: 2, bgcolor: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0", mb: 1 }}>
          <Typography variant="caption" sx={{ color: "#475569", display: "block" }}>
            Đánh giá của bạn sẽ giúp xây dựng uy tín thực chất cho cộng đồng sáng tạo trên FREVO.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, justifyContent: "center", gap: 1.5 }}>
        <Button onClick={onClose} sx={{ textTransform: "none", color: "#64748b" }}>
          Xem lại sau
        </Button>
        <Button
          onClick={() => {
            onClose();
            onOpenReview();
          }}
          variant="contained"
          startIcon={<Star size={16} />}
          endIcon={<ArrowRight size={14} />}
          sx={{
            bgcolor: "#f4490b",
            "&:hover": { bgcolor: "#bd3d14" },
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 700,
            px: 2.5,
          }}
        >
          Đánh giá đối tác ngay
        </Button>
      </DialogActions>
    </Dialog>
  );
};
