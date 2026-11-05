import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Typography } from "@mui/material";
import { CalendarDays, CreditCard, ShieldCheck, X } from "lucide-react";
import type { Milestone } from "@/lib/types/marketplace.types";
import { formatMoneyText } from "@/lib/utils/money";

interface FundMilestoneModalProps {
  open: boolean;
  milestone: Milestone;
  projectTitle: string;
  onClose: () => void;
  onConfirmFund: () => void;
}

export function FundMilestoneModal({ open, milestone, projectTitle, onClose, onConfirmFund }: FundMilestoneModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="fund-milestone-title"
      slotProps={{ paper: { sx: { borderRadius: "20px", overflow: "hidden" } } }}
    >
      <DialogTitle component="div" sx={{ px: 3, pt: 3, pb: 2 }}>
        <Box className="flex items-start gap-3">
          <Box sx={{ width: 44, height: 44, display: "grid", placeItems: "center", borderRadius: "50%", bgcolor: "#fff0e9", color: "primary.dark", flexShrink: 0 }}>
            <CreditCard size={22} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Chip
              icon={<ShieldCheck size={13} className="text-emerald-600" />}
              size="small"
              label="FREVO Escrow Protection"
              sx={{ bgcolor: "#ecfdf5", color: "#065f46", fontSize: 10, fontWeight: 700, height: 22, mb: 1, border: "1px solid #a7f3d0" }}
            />
            <Typography component="h2" id="fund-milestone-title" sx={{ fontFamily: "h2.fontFamily", fontSize: 21, fontWeight: 800 }}>
              Ký quỹ ngân sách mốc
            </Typography>
          </Box>
          <IconButton aria-label="Đóng cửa sổ ký quỹ" size="small" onClick={onClose}>
            <X size={19} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pb: 2 }}>
        <Box sx={{ p: 2.25, bgcolor: "background.default", borderRadius: "14px", border: "1px solid", borderColor: "divider", mb: 2.5 }}>
          <Typography sx={{ fontSize: 11, color: "text.secondary", fontWeight: 500 }}>
            {projectTitle}
          </Typography>
          <Typography sx={{ fontSize: 16, fontWeight: 700, mt: 0.5, color: "text.primary" }}>
            {milestone.name}
          </Typography>
          {milestone.deliverable && (
            <Typography sx={{ fontSize: 12, color: "text.secondary", lineHeight: 1.7, mt: 0.75 }}>
              {milestone.deliverable}
            </Typography>
          )}
          {milestone.deadline && (
            <Typography className="mt-2 flex items-center gap-1.5" sx={{ fontSize: 11, color: "text.secondary", fontWeight: 500 }}>
              <CalendarDays size={13} />
              Hạn hoàn thành mốc: {milestone.deadline}
            </Typography>
          )}
        </Box>

        <Box className="flex flex-col gap-2.5">
          <Box className="flex items-center justify-between gap-2">
            <Typography sx={{ fontSize: 13, color: "text.secondary" }}>Giá trị mốc bàn giao</Typography>
            <Typography sx={{ fontSize: 15, fontWeight: 700, color: "text.primary" }}>
              {formatMoneyText(milestone.amount)} đ
            </Typography>
          </Box>
          <Box className="flex items-center justify-between gap-2">
            <Typography sx={{ fontSize: 13, color: "text.secondary" }}>Phí bảo đảm FREVO Escrow</Typography>
            <Box className="flex items-center gap-1.5">
              <Typography sx={{ fontSize: 12, color: "text.secondary", textDecoration: "line-through" }}>3%</Typography>
              <Chip size="small" label="0 đ · Miễn phí" sx={{ bgcolor: "#ecfdf5", color: "#065f46", fontSize: 10, fontWeight: 700, height: 20 }} />
            </Box>
          </Box>
          <Divider sx={{ my: 1 }} />
          <Box className="flex items-center justify-between gap-2">
            <Typography sx={{ fontSize: 14, fontWeight: 700, color: "text.primary" }}>Tổng số tiền ký quỹ</Typography>
            <Typography sx={{ fontFamily: "h2.fontFamily", fontSize: 24, fontWeight: 800, color: "primary.dark" }}>
              {formatMoneyText(milestone.amount)} đ
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mt: 2.5, p: 2, bgcolor: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "12px", display: "flex", gap: 1.5, alignItems: "flex-start" }}>
          <ShieldCheck size={20} className="shrink-0 text-emerald-600 mt-0.5" />
          <Typography sx={{ fontSize: 11.5, lineHeight: 1.75, color: "#065f46" }}>
            Số tiền này được tạm giữ an toàn trong tài khoản trung gian của FREVO. Đối tác sẽ được thông báo bắt đầu thực hiện mốc, và khoản tiền chỉ được giải ngân cho đối tác khi bạn xác nhận kết quả nghiệm thu đạt yêu cầu.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2.25, bgcolor: "background.default", borderTop: "1px solid", borderColor: "divider", gap: 1 }}>
        <Button onClick={onClose} sx={{ color: "text.secondary", fontSize: 12, px: 2 }}>
          Để sau
        </Button>
        <Button
          variant="contained"
          data-testid="confirm-fund-modal-btn"
          onClick={onConfirmFund}
          startIcon={<CreditCard size={15} />}
          sx={{ fontSize: 12, px: 2.5, bgcolor: "primary.main", "&:hover": { bgcolor: "primary.dark" }, fontWeight: 700 }}
        >
          Xác nhận ký quỹ
        </Button>
      </DialogActions>
    </Dialog>
  );
}
