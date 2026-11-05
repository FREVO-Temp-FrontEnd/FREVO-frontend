import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Typography } from "@mui/material";
import { Building2, X } from "lucide-react";
import type { BusinessAccountFields } from "@/lib/utils/businessAccount";
import type { useBusinessAccount } from "../hooks/useBusinessAccount";

const profileFields = [
  { key: "companyName", label: "Tên doanh nghiệp / Đơn vị", required: true, maxLength: 80, autoComplete: "organization" },
  { key: "industry", label: "Lĩnh vực hoạt động", maxLength: 100 },
  { key: "name", label: "Họ và tên người đại diện", required: true, maxLength: 100, autoComplete: "name" },
  { key: "contactEmail", label: "Email liên hệ nhận hồ sơ", type: "email" },
  { key: "phone", label: "Số điện thoại liên hệ", type: "tel", autoComplete: "tel" },
  { key: "address", label: "Địa chỉ văn phòng / Trụ sở", autoComplete: "street-address" },
  { key: "companyBio", label: "Giới thiệu doanh nghiệp & Định hướng thương hiệu", maxLength: 1500, multiline: true },
] satisfies {
  key: Exclude<keyof BusinessAccountFields, "email">;
  label: string;
  required?: boolean;
  maxLength?: number;
  autoComplete?: string;
  type?: string;
  multiline?: boolean;
}[];

interface EditBusinessProfileDialogProps {
  open: boolean;
  onClose: () => void;
  account: Pick<ReturnType<typeof useBusinessAccount>, "fields" | "errors" | "failure" | "setField" | "save" | "dirty">;
}

export function EditBusinessProfileDialog({ open, onClose, account }: EditBusinessProfileDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="edit-business-profile-title"
      slotProps={{
        paper: {
          sx: {
            borderRadius: "20px",
            overflow: "hidden",
          },
        },
      }}
    >
      <Box
        component="form"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          if (account.dirty && account.save()) onClose();
        }}
      >
        <DialogTitle
          id="edit-business-profile-title"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 3,
            py: 2.25,
            borderBottom: "1px solid #eef0eb",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#fff4ee] text-[#bd3d14] border border-[#ffdecb]">
              <Building2 size={16} strokeWidth={2.2} />
            </div>
            <Typography component="span" sx={{ fontSize: 18, fontWeight: 800, color: "#20201f", fontFamily: "Archivo, sans-serif" }}>
              Chỉnh sửa hồ sơ doanh nghiệp
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small" aria-label="Đóng">
            <X size={18} />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 3 }}>
          <Box sx={{ display: "grid", gap: 2.25, gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "repeat(2, minmax(0, 1fr))" } }}>
            {account.failure && <Alert severity="error" sx={{ gridColumn: "1 / -1" }}>{account.failure}</Alert>}
            {profileFields.map(({ key, label, ...options }) => (
              <TextField
                key={key}
                id={`business-account-${key}`}
                label={label}
                value={account.fields[key]}
                onChange={(event) => account.setField(key, event.target.value)}
                error={Boolean(account.errors[key])}
                helperText={account.errors[key]}
                required={options.required}
                type={options.type}
                autoComplete={options.autoComplete}
                multiline={options.multiline}
                minRows={options.multiline ? 4 : undefined}
                autoFocus={key === "companyName"}
                slotProps={{ htmlInput: { maxLength: options.maxLength } }}
                sx={{
                  gridColumn: options.multiline ? "1 / -1" : undefined,
                  "& .MuiOutlinedInput-root": { borderRadius: "12px" },
                }}
              />
            ))}
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, borderTop: "1px solid #eef0eb", gap: 1 }}>
          <Button
            onClick={onClose}
            sx={{
              borderRadius: "999px",
              color: "#62665f",
              fontWeight: 600,
              px: 2.5,
              textTransform: "none",
            }}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            type="submit"
            disabled={!account.dirty}
            sx={{
              borderRadius: "999px",
              px: 3,
              bgcolor: "#f4490b !important",
              color: "#ffffff !important",
              fontWeight: 700,
              textTransform: "none",
              boxShadow: "0 2px 8px rgba(244,73,11,0.25)",
              "&:hover": { bgcolor: "#bd3d14 !important" },
            }}
          >
            Lưu hồ sơ
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
