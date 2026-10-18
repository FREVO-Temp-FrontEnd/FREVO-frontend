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
  Alert,
} from "@mui/material";
import { X, ArrowRight } from "lucide-react";
import type { Milestone } from "@/lib/types/marketplace.types";

interface SubmitDeliverableDialogProps {
  open: boolean;
  milestone: Milestone;
  onClose: () => void;
  onSubmit: (notes: string, files: { name: string; url: string; size: string }[]) => void;
}

export const SubmitDeliverableDialog: React.FC<SubmitDeliverableDialogProps> = ({
  open,
  milestone,
  onClose,
  onSubmit,
}) => {
  const [notes, setNotes] = useState("");
  const [fileLink, setFileLink] = useState("");
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) {
      setError("Vui lòng nhập ghi chú bàn giao cho Doanh nghiệp.");
      return;
    }

    const files = fileName.trim()
      ? [{ name: fileName.trim(), url: fileLink.trim() || "#", size: "2.4 MB" }]
      : [];

    onSubmit(notes.trim(), files);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: "16px", p: 1 } } }}>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 1 }}>
        <Box>
          <Typography variant="caption" sx={{ color: "#f4490b", fontWeight: 700, textTransform: "uppercase" }}>
            Bàn giao sản phẩm (WORK-004)
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: "Space Grotesk, sans-serif" }}>
            {milestone.name}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box component="form" onSubmit={handleSubmit}>
        <Box sx={{ mb: 2.5, p: 2, bgcolor: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
          <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>
            Sản phẩm bàn giao đã thỏa thuận:
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 600, color: "#1e293b", mt: 0.5 }}>
            {milestone.deliverable}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: "8px" }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            fullWidth
            label="Ghi chú bàn giao *"
            multiline
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Mô tả tóm tắt những nội dung đã hoàn thành, hướng dẫn sử dụng hoặc lưu ý..."
          />

          <TextField
            fullWidth
            size="small"
            label="Tên file / Tài liệu đính kèm"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="Ví dụ: Final_Brand_Guidelines_v1.pdf"
          />

          <TextField
            fullWidth
            size="small"
            label="Liên kết truy cập (Figma / Drive / Dropbox)"
            value={fileLink}
            onChange={(e) => setFileLink(e.target.value)}
            placeholder="https://..."
          />
        </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ textTransform: "none", color: "#64748b" }}>
          Hủy bỏ
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
          Gửi bàn giao nghiệm thu
        </Button>
      </DialogActions>
    </Dialog>
  );
};
