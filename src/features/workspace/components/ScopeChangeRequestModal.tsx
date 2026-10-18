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
import { X, ShieldAlert, ArrowRight } from "lucide-react";

interface ScopeChangeRequestModalProps {
  open: boolean;
  projectTitle: string;
  onClose: () => void;
  onProceedToProposal: (scopeNote: string) => void;
}

export const ScopeChangeRequestModal: React.FC<ScopeChangeRequestModalProps> = ({
  open,
  projectTitle,
  onClose,
  onProceedToProposal,
}) => {
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const handleProceed = () => {
    if (!note.trim()) {
      setError("Vui lòng nêu rõ nội dung thay đổi hoặc phần việc phát sinh ngoài phạm vi ban đầu.");
      return;
    }
    setError("");
    onProceedToProposal(note.trim());
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: "16px", p: 1 } } }}>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 1 }}>
        <Box>
          <Typography variant="caption" sx={{ color: "#f4490b", fontWeight: 700, textTransform: "uppercase" }}>
            Thay đổi phạm vi công việc (WORK-007) · {projectTitle}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: "Space Grotesk, sans-serif" }}>
            Đề xuất phụ lục / Điều chỉnh thỏa thuận
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 2.5, p: 2, bgcolor: "#fffaf7", borderRadius: "10px", border: "1px solid #fed7aa" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <ShieldAlert size={18} color="#f4490b" />
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#9a3412" }}>
              Nguyên tắc bảo toàn hiệu lực thỏa thuận (FR-048)
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: "#7c2d12", lineHeight: 1.5, display: "block" }}>
            Mọi yêu cầu công việc nằm ngoài phạm vi mốc ban đầu sẽ được chuyển thành một bản <strong>Đề xuất điều chỉnh thỏa thuận (Phiên bản mới)</strong>. Phiên bản thỏa thuận hiện tại vẫn giữ nguyên hiệu lực ràng buộc cho đến khi bản mới được cả hai bên xác nhận.
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: "8px" }}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          multiline
          rows={4}
          label="Nội dung điều chỉnh / Yêu cầu phát sinh *"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Mô tả cụ thể những hạng mục mới, thay đổi về deadline hoặc ngân sách bổ sung cần đưa vào thỏa thuận..."
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ textTransform: "none", color: "#64748b" }}>
          Đóng
        </Button>
        <Button
          onClick={handleProceed}
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
          Tiếp tục soạn đề xuất mới
        </Button>
      </DialogActions>
    </Dialog>
  );
};
