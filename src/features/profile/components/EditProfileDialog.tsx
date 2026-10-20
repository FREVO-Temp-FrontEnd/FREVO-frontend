import { useState } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  Typography,
  IconButton,
  Button as MuiButton,
} from "@mui/material";
import { X } from "lucide-react";

export type EditRequest = {
  title: string;
  fields: {
    name: string;
    label: string;
    value: string;
    type?: "textarea" | "number" | "month";
    maxLength?: number;
  }[];
  onSave: (values: Record<string, string>) => void;
};

export function EditProfileDialog({
  request,
  onClose,
  onSaved,
}: {
  request: EditRequest;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [error, setError] = useState("");

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const values = Object.fromEntries(
      request.fields.map((field) => [
        field.name,
        String(data.get(field.name) ?? "").trim(),
      ])
    );
    const invalid = request.fields.find(
      (field) =>
        !values[field.name] ||
        ((field.name === "tags" || field.name === "skills") &&
          !values[field.name].split(",").some((tag) => tag.trim()))
    );
    if (invalid) {
      setError(`Vui lòng nhập ${invalid.label.toLocaleLowerCase("vi-VN")}.`);
      (
        event.currentTarget.elements.namedItem(invalid.name) as HTMLElement | null
      )?.focus();
      return;
    }
    request.onSave(values);
    onSaved();
    onClose();
  }

  return (
    <Dialog
      open
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            position: "fixed",
            right: 0,
            top: 0,
            bottom: 0,
            m: 0,
            width: "min(620px, 100vw)",
            maxWidth: "none",
            height: "100dvh",
            maxHeight: "none",
            display: "flex",
            flexDirection: "column",
            borderRadius: 0,
            bgcolor: "var(--card, #fff)",
            borderLeft: "1px solid var(--line, #e4e6e2)",
            boxShadow: "-18px 0 70px rgba(32, 32, 31, 0.1)",
            overflow: "hidden",
          },
        },
      }}
    >
      <Box
        component="header"
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "20px",
          p: { xs: "20px 18px", sm: "26px 28px 22px" },
          borderBottom: "1px solid var(--line, #e4e6e2)",
          flexShrink: 0,
          bgcolor: "var(--card, #fff)",
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            component="span"
            sx={{
              display: "block",
              fontSize: "11px",
              fontWeight: 700,
              color: "var(--orange-dark, #bd3d14)",
              mb: "8px",
            }}
          >
            FREVO Profile Studio
          </Typography>
          <DialogTitle
            sx={{
              p: 0,
              fontFamily: "Archivo, Arial, sans-serif",
              fontSize: { xs: "24px", sm: "27px" },
              lineHeight: 1.2,
              letterSpacing: "-.04em",
              fontWeight: 800,
              "& > span": { color: "var(--orange, #f4490b)" },
            }}
          >
            {request.title}
            <span>.</span>
          </DialogTitle>
          <Typography
            sx={{
              fontSize: "12px",
              lineHeight: 1.5,
              mt: "9px",
              color: "#686d65",
              overflowWrap: "anywhere",
            }}
          >
            Cập nhật thông tin để hồ sơ thể hiện đúng bạn.
          </Typography>
        </Box>
        <IconButton
          aria-label="Đóng chỉnh sửa"
          onClick={onClose}
          sx={{
            flexShrink: 0,
            bgcolor: "var(--bg, #f7f8f6)",
            color: "var(--ink, #20201f)",
            "&:hover": { bgcolor: "var(--peach, #fff0e9)" },
          }}
        >
          <X size={20} />
        </IconButton>
      </Box>

      <Box
        component="form"
        onSubmit={submit}
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          flex: 1,
        }}
      >
        <Box
          sx={{
            minHeight: 0,
            overflowY: "auto",
            overscrollBehavior: "contain",
            flex: 1,
            p: { xs: "22px 18px", sm: "26px 28px" },
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            scrollbarWidth: "thin",
          }}
        >
          {request.fields.map((field) => (
            <Box
              key={field.name}
              sx={{
                display: "grid",
                gap: "8px",
                minWidth: 0,
                "& label": {
                  fontFamily: '"Space Grotesk", Arial, sans-serif',
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "var(--ink, #20201f)",
                },
                "& input, & textarea": {
                  width: "100%",
                  minWidth: 0,
                  bgcolor: "#f4f5f2",
                  border: "1px solid transparent",
                  borderRadius: "10px",
                  p: "10px 13px",
                  color: "var(--ink, #20201f)",
                  fontSize: "13px",
                  boxShadow: "none",
                  transition: "background .15s, border-color .15s",
                  "&:focus-visible": {
                    bgcolor: "#fff",
                    borderColor: "var(--orange, #f4490b)",
                    outline: "2px solid rgba(244, 73, 11, 0.2)",
                    outlineOffset: "2px",
                  },
                },
              }}
            >
              <label htmlFor={`edit-${field.name}`}>{field.label}</label>
              {field.type === "textarea" ? (
                <textarea
                  id={`edit-${field.name}`}
                  name={field.name}
                  defaultValue={field.value}
                  required
                  maxLength={1500}
                />
              ) : (
                <input
                  id={`edit-${field.name}`}
                  name={field.name}
                  defaultValue={field.value}
                  required
                  type={field.type ?? "text"}
                  maxLength={field.maxLength ?? 160}
                  min={
                    field.type === "number"
                      ? 0
                      : field.type === "month"
                      ? "1900-01"
                      : undefined
                  }
                  max={
                    field.type === "number"
                      ? 1000000000000
                      : field.type === "month"
                      ? "9999-12"
                      : undefined
                  }
                  step={field.type === "number" ? 1 : undefined}
                />
              )}
            </Box>
          ))}

          {error && (
            <Typography
              role="alert"
              sx={{ color: "error.main", fontSize: "13px", mt: "4px" }}
            >
              {error}
            </Typography>
          )}

          <Typography
            sx={{
              fontSize: "11px",
              color: "#747773",
              lineHeight: 1.6,
              p: "12px 14px",
              bgcolor: "var(--peach, #fff0e9)",
              borderRadius: "9px",
            }}
          >
            Thay đổi chỉ áp dụng cho bản xem thử và sẽ mất khi rời trang hoặc tải lại.
          </Typography>
        </Box>

        <Box
          component="footer"
          sx={{
            flexShrink: 0,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: "10px",
            p: { xs: "14px 16px 20px", sm: "18px 28px 23px" },
            borderTop: "1px solid var(--line, #e4e6e2)",
            bgcolor: "#fff",
          }}
        >
          <MuiButton
            type="button"
            variant="outlined"
            onClick={onClose}
            sx={{
              minHeight: "42px",
              px: "18px",
              borderRadius: "999px",
              borderColor: "var(--line, #e4e6e2)",
              color: "#333631",
              fontSize: "12px",
              fontWeight: 800,
              textTransform: "none",
              "&:hover": {
                borderColor: "text.secondary",
                bgcolor: "#f7f8f6",
              },
            }}
          >
            Hủy
          </MuiButton>
          <MuiButton
            type="submit"
            variant="contained"
            color="primary"
            sx={{
              minHeight: "45px",
              px: "20px",
              fontSize: "13px",
            }}
          >
            Lưu thay đổi
          </MuiButton>
        </Box>
      </Box>
    </Dialog>
  );
}
