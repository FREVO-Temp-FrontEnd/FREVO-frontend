import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Rating,
  Alert,
  Chip,
} from "@mui/material";
import { X, ShieldAlert, ArrowRight } from "lucide-react";

interface SubmitReviewDialogProps {
  open: boolean;
  projectId?: string;
  projectTitle?: string;
  reviewerRole?: "business" | "talent";
  reviewerName?: string;
  targetName: string;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
}

export const SubmitReviewDialog: React.FC<SubmitReviewDialogProps> = ({
  open,
  targetName,
  onClose,
  onSubmit,
}) => {
  const [rating, setRating] = useState<number | null>(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || rating < 1) {
      setError("Vui lòng chọn số sao đánh giá (1–5 sao).");
      return;
    }
    if (!comment.trim()) {
      setError("Vui lòng để lại nhận xét đóng góp chất lượng hợp tác.");
      return;
    }

    onSubmit(rating, comment.trim());
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: "16px", p: 1 } } }}>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 1 }}>
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <Typography variant="caption" sx={{ color: "#f4490b", fontWeight: 700, textTransform: "uppercase" }}>
              Đánh giá & Nhận xét đối tác (REV-001)
            </Typography>
            <Chip
              label="PROTOTYPE P2 (BR-016)"
              size="small"
              sx={{ bgcolor: "#f1f5f9", color: "#475569", fontWeight: 700, fontSize: "10px", height: 20 }}
            />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: "Space Grotesk, sans-serif" }}>
            Đánh giá hợp tác với {targetName}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box component="form" onSubmit={handleSubmit}>
        {/* Policy Unresolved Disclaimer per BR-016 */}
        <Box sx={{ mb: 2.5, p: 2, bgcolor: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <ShieldAlert size={16} color="#64748b" />
            <Typography variant="caption" sx={{ fontWeight: 700, color: "#334155" }}>
              Chính sách hiển thị & Kiểm duyệt đánh giá đang trong giai đoạn khảo sát (BR-016)
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: "#64748b", lineHeight: 1.4, display: "block" }}>
            Tính năng đánh giá hai chiều được triển khai thử nghiệm trên các dự án đã hoàn thành hợp lệ (<strong>FR-054, FR-055</strong>). Hệ thống không áp đặt thời hạn 14 ngày hay bất kỳ quy tắc hạn chót chưa được phê duyệt nào.
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: "8px" }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, py: 1 }}>
          <Box sx={{ textAlign: "center", py: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#1e293b", mb: 1 }}>
              Mức độ hài lòng tổng thể về chất lượng hợp tác
            </Typography>
            <Rating
              value={rating}
              onChange={(_, v) => setRating(v)}
              size="large"
              sx={{ color: "#f4490b" }}
            />
          </Box>

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Nhận xét chi tiết *"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Chia sẻ về sự chuyên nghiệp, đúng hẹn, chất lượng bàn giao hoặc khả năng phối hợp..."
          />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ textTransform: "none", color: "#64748b" }}>
          Đóng
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          endIcon={<ArrowRight size={16} />}
          sx={{
            bgcolor: "#f4490b",
            "&:hover": { bgcolor: "#bd3d14" },
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 700,
            px: 2.5,
          }}
        >
          Gửi nhận xét
        </Button>
      </DialogActions>
    </Dialog>
  );
};
