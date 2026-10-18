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
  Chip,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { X, RotateCcw, Info } from "lucide-react";
import type { Milestone } from "@/lib/types/marketplace.types";

interface AcceptanceReviewDialogProps {
  open: boolean;
  milestone: Milestone;
  onClose: () => void;
  onApprove: () => void;
  onRequestRevision: (reason: string) => void;
}

export const AcceptanceReviewDialog: React.FC<AcceptanceReviewDialogProps> = ({
  open,
  milestone,
  onClose,
  onApprove,
  onRequestRevision,
}) => {
  const [decision, setDecision] = useState<"approve" | "revision">("approve");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const used = milestone.revisionAllowance?.used ?? 0;
  const allowed = milestone.revisionAllowance?.allowed ?? 2;
  const isAllowanceExhausted = typeof allowed === "number" && used >= allowed;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (decision === "approve") {
      onApprove();
      onClose();
    } else {
      // BR-014: Mandatory reason specifying unmet criteria
      if (!reason.trim()) {
        setError("Lý do yêu cầu chỉnh sửa là bắt buộc theo quy tắc BR-014. Vui lòng nêu rõ tiêu chí chưa đạt.");
        return;
      }
      onRequestRevision(reason.trim());
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: "16px", p: 1 } } }}>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 1 }}>
        <Box>
          <Typography variant="caption" sx={{ color: "#f4490b", fontWeight: 700, textTransform: "uppercase" }}>
            Nghiệm thu & Đánh giá mốc (WORK-005)
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
        {/* Deliverable Info */}
        <Box sx={{ mb: 2.5, p: 2, bgcolor: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
          <Typography variant="caption" sx={{ color: "#64748b" }}>
            Ghi chú từ bên thực hiện:
          </Typography>
          <Typography variant="body2" sx={{ color: "#1e293b", mt: 0.5, fontStyle: "italic" }}>
            "{milestone.submissionNotes || "Đã hoàn thành sản phẩm bàn giao theo thỏa thuận."}"
          </Typography>
          {milestone.submissionFiles && milestone.submissionFiles.length > 0 && (
            <Box sx={{ mt: 1, pt: 1, borderTop: "1px dashed #cbd5e1" }}>
              <Typography variant="caption" sx={{ color: "#64748b" }}>
                Tệp đính kèm: <strong>{milestone.submissionFiles.map((f) => f.name).join(", ")}</strong>
              </Typography>
            </Box>
          )}
        </Box>

        {/* Revision Allowance Tracker per DEC-03 */}
        <Box
          sx={{
            mb: 2.5,
            p: 1.5,
            px: 2,
            borderRadius: "8px",
            bgcolor: isAllowanceExhausted ? "#fffbeb" : "#f1f5f9",
            border: isAllowanceExhausted ? "1px solid #fde68a" : "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <RotateCcw size={16} color={isAllowanceExhausted ? "#d97706" : "#64748b"} />
            <Typography variant="body2" sx={{ fontWeight: 600, color: "#1e293b" }}>
              Số lượt sửa đổi thỏa thuận (DEC-03):
            </Typography>
          </Box>
          <Chip
            label={`Đã dùng ${used}/${allowed} lượt`}
            size="small"
            sx={{
              fontWeight: 700,
              bgcolor: isAllowanceExhausted ? "#fef3c7" : "#e2e8f0",
              color: isAllowanceExhausted ? "#92400e" : "#475569",
            }}
          />
        </Box>

        {isAllowanceExhausted && (
          <Box
            sx={{
              mb: 2.5,
              p: 2,
              borderRadius: "8px",
              bgcolor: "#fffaf7",
              border: "1px solid #fed7aa",
              display: "flex",
              alignItems: "flex-start",
              gap: 1.5,
            }}
          >
            <Info size={18} color="#f4490b" style={{ flexShrink: 0, marginTop: 2 }} />
            <Box>
              <Typography variant="subtitle2" sx={{ color: "#9a3412", fontWeight: 700 }}>
                Lưu ý vượt hạn mức chỉnh sửa (DEC-03)
              </Typography>
              <Typography variant="caption" sx={{ color: "#7c2d12", lineHeight: 1.4, display: "block" }}>
                Số lượt sửa đổi theo thỏa thuận ban đầu đã hết. Theo nguyên tắc FREVO, hệ thống <strong>không tự động phạt phí hay hủy bỏ sản phẩm</strong>. Thay vào đó, hai bên cần trao đổi trực tiếp để thống nhất về các yêu cầu bổ sung hoặc ký phụ lục điều chỉnh thỏa thuận.
              </Typography>
            </Box>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: "8px" }}>
            {error}
          </Alert>
        )}

        {/* Decision Radio */}
        <RadioGroup
          value={decision}
          onChange={(e) => setDecision(e.target.value as "approve" | "revision")}
          sx={{ mb: 2 }}
        >
          <FormControlLabel
            value="approve"
            control={<Radio sx={{ color: "#059669", "&.Mui-checked": { color: "#059669" } }} />}
            label={
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 700, color: "#166534" }}>
                  Chấp thuận nghiệm thu mốc
                </Typography>
                <Typography variant="caption" sx={{ color: "#64748b" }}>
                  Sản phẩm đáp ứng yêu cầu. Hệ thống ghi nhận hoàn thành và kích hoạt quy trình giải ngân mô phỏng.
                </Typography>
              </Box>
            }
          />
          <FormControlLabel
            value="revision"
            control={<Radio sx={{ color: "#ea580c", "&.Mui-checked": { color: "#ea580c" } }} />}
            label={
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 700, color: "#9a3412" }}>
                  Yêu cầu chỉnh sửa thêm (BR-014)
                </Typography>
                <Typography variant="caption" sx={{ color: "#64748b" }}>
                  Sản phẩm chưa đạt tiêu chí thống nhất. Bắt buộc nêu rõ lý do cụ thể.
                </Typography>
              </Box>
            }
          />
        </RadioGroup>

        {decision === "revision" && (
          <Box sx={{ mt: 1 }}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Lý do & Tiêu chí chưa đạt (Bắt buộc per BR-014) *"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Chỉ rõ tiêu chí hoặc chi tiết cụ thể chưa đạt theo đúng thỏa thuận ban đầu..."
              helperText="Yêu cầu chỉnh sửa phải dựa trên các cam kết trong thỏa thuận hợp tác."
            />
          </Box>
        )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ textTransform: "none", color: "#64748b" }}>
          Đóng
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            bgcolor: decision === "approve" ? "#059669" : "#ea580c",
            "&:hover": { bgcolor: decision === "approve" ? "#047857" : "#c2410c" },
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 700,
            px: 2.5,
          }}
        >
          {decision === "approve" ? "Xác nhận nghiệm thu" : "Gửi yêu cầu chỉnh sửa"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
