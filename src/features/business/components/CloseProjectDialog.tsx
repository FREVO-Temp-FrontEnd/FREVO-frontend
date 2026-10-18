import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { AlertTriangle } from "lucide-react";

interface CloseProjectDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  projectTitle: string;
}

export function CloseProjectDialog({
  open,
  onClose,
  onConfirm,
  projectTitle,
}: CloseProjectDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            p: 1,
          },
        },
      }}
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5, pb: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 40,
            height: 40,
            borderRadius: "50%",
            bgcolor: "#fff0e9",
            color: "#ab2e00",
          }}
        >
          <AlertTriangle size={22} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 750 }}>
          Đóng tuyển dự án?
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Typography variant="body2" sx={{ color: "#494a49", mb: 2, lineHeight: 1.6 }}>
          Bạn đang yêu cầu đóng tuyển cho dự án <strong>"{projectTitle}"</strong>.
        </Typography>

        <Box
          sx={{
            bgcolor: "#fdf8f5",
            border: "1px solid #f6ded3",
            borderRadius: 2,
            p: 1.5,
          }}
        >
          <Typography variant="caption" sx={{ color: "#8c3819", display: "block", lineHeight: 1.5 }}>
            <strong>Quy tắc hệ thống (BR-019):</strong> Dự án sẽ chuyển sang trạng thái <strong>Đã đóng tuyển</strong>. Hệ thống sẽ ngừng nhận hồ sơ mới và các ứng viên đang chờ xét duyệt sẽ không được chọn.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          sx={{
            textTransform: "none",
            color: "text.secondary",
            fontWeight: 600,
          }}
        >
          Hủy bỏ
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            onConfirm();
            onClose();
          }}
          sx={{
            bgcolor: "#ba3b14",
            color: "#fff",
            textTransform: "none",
            fontWeight: 700,
            borderRadius: "999px",
            px: 2.5,
            "&:hover": { bgcolor: "#9a2f0e" },
          }}
        >
          Xác nhận đóng tuyển
        </Button>
      </DialogActions>
    </Dialog>
  );
}
