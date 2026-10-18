import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  IconButton,
  Chip,
  Divider,
} from "@mui/material";
import { X, ShieldAlert, ArrowRight } from "lucide-react";
import type { Milestone } from "@/lib/types/marketplace.types";

interface FundMilestoneModalProps {
  open: boolean;
  milestone: Milestone;
  projectTitle: string;
  onClose: () => void;
  onConfirmFund: () => void;
}

export const FundMilestoneModal: React.FC<FundMilestoneModalProps> = ({
  open,
  milestone,
  projectTitle,
  onClose,
  onConfirmFund,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: "16px", p: 1 } } }}
    >
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 1 }}>
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <Typography variant="caption" sx={{ color: "#f4490b", fontWeight: 700, textTransform: "uppercase" }}>
              Ký quỹ mốc công việc (PAY-002)
            </Typography>
            <Chip
              label="MÔ PHỎNG / SIMULATION"
              size="small"
              sx={{ bgcolor: "#ffedd5", color: "#c2410c", fontWeight: 700, fontSize: "10px", height: 20 }}
            />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: "Space Grotesk, sans-serif" }}>
            Mô phỏng tạm giữ thanh toán mốc
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {/* Simulation Warning Banner per DEC-04 & BR-017 */}
        <Box sx={{ mb: 2.5, p: 2, bgcolor: "#fffaf7", borderRadius: "10px", border: "1px solid #fed7aa" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <ShieldAlert size={18} color="#f4490b" />
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#9a3412" }}>
              Mức phí dịch vụ nền tảng đang trong giai đoạn khảo sát chính sách (DEC-04)
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: "#7c2d12", lineHeight: 1.5, display: "block" }}>
            Trang này chỉ thực hiện <strong>mô phỏng quy trình giao dịch</strong>. FREVO không thực hiện giao dịch tài chính thật, không thu tiền từ thẻ và không áp dụng bất kỳ tỷ lệ phần trăm phí cố định nào trong giai đoạn thử nghiệm này.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ p: 2, bgcolor: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
            <Typography variant="caption" sx={{ color: "#64748b" }}>
              Dự án: {projectTitle}
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1e293b", mt: 0.5 }}>
              {milestone.name}
            </Typography>
            <Typography variant="body2" sx={{ color: "#475569" }}>
              {milestone.deliverable}
            </Typography>
          </Box>

          <Box sx={{ p: 2, bgcolor: "#ffffff", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                Giá trị mốc đã thỏa thuận:
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#f4490b" }}>
                {milestone.amount}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                Phí dịch vụ nền tảng FREVO:
              </Typography>
              <Chip
                label="Chưa xác định"
                size="small"
                sx={{ bgcolor: "#f1f5f9", color: "#475569", fontWeight: 700, fontSize: "11px" }}
              />
            </Box>

            <Divider sx={{ my: 1.5 }} />

            <Typography variant="caption" sx={{ color: "#94a3b8", display: "block", fontStyle: "italic" }}>
              * Theo quyết định DEC-04, hệ thống không tính toán số tiền thực trả hay thực nhận cuối cùng cho đến khi chính sách phí và đối tượng chịu phí được phê duyệt chính thức.
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ textTransform: "none", color: "#64748b" }}>
          Hủy bỏ
        </Button>
        <Button
          onClick={() => {
            onConfirmFund();
            onClose();
          }}
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
          Xác nhận mô phỏng ký quỹ
        </Button>
      </DialogActions>
    </Dialog>
  );
};
