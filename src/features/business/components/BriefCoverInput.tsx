import { useEffect, useRef, useState } from "react";
import { Alert, Box, Button, Typography } from "@mui/material";
import { ImagePlus, Trash2 } from "lucide-react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function BriefCoverInput({ value, onChange, error }: Props) {
  const reader = useRef<FileReader | null>(null);
  const [issue, setIssue] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => () => reader.current?.abort(), []);

  function upload(file?: File) {
    if (!file) return;
    reader.current?.abort();
    if (
      !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
      !file.size ||
      file.size > 1024 * 1024
    ) {
      setLoading(false);
      setIssue("Chọn ảnh JPG, PNG hoặc WebP tối đa 1 MB trong bản demo.");
      return;
    }
    const next = new FileReader();
    reader.current = next;
    setLoading(true);
    setIssue("");
    next.onload = () => {
      if (reader.current !== next) return;
      onChange(String(next.result));
      setLoading(false);
    };
    next.onerror = () => {
      if (reader.current !== next) return;
      setIssue("Không đọc được ảnh. Vui lòng chọn lại.");
      setLoading(false);
    };
    next.readAsDataURL(file);
  }

  const previewable =
    /^https:\/\//i.test(value) ||
    /^\/assets\//.test(value) ||
    /^data:image\/(jpeg|png|webp);base64,/.test(value);

  return (
    <Box
      sx={{
        border: "1.5px dashed",
        borderColor: error ? "error.main" : "#cbd5e1",
        borderRadius: "14px",
        overflow: "hidden",
        mb: 1,
        bgcolor: "#f8fafc",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        "&:hover": { borderColor: "primary.main" },
      }}
    >
      <Box
        sx={{
          height: { xs: 150, sm: 190 },
          bgcolor: "#f1f5f9",
          position: "relative",
          display: "grid",
          placeItems: "center",
        }}
      >
        {value && previewable ? (
          <Box
            component="img"
            src={value}
            alt="Xem trước ảnh bìa dự án"
            onLoad={() => setIssue("")}
            onError={() => setIssue("Không tải được ảnh bìa. Vui lòng chọn ảnh khác.")}
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <Box sx={{ textAlign: "center", color: "text.secondary", px: 2 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                bgcolor: "#ffffff",
                display: "grid",
                placeItems: "center",
                mx: "auto",
                mb: 1.5,
                boxShadow: "0 1px 3px rgba(16, 24, 40, 0.08)",
                border: "1px solid #e2e8f0",
                color: "primary.main",
              }}
            >
              <ImagePlus size={22} />
            </Box>
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: "text.primary" }}>
              Tải lên ảnh bìa cho dự án
            </Typography>
            <Typography sx={{ fontSize: 12, color: "text.secondary", mt: 0.5 }}>
              Ảnh bìa giúp dự án nổi bật và thu hút ứng viên tài năng
            </Typography>
          </Box>
        )}
      </Box>
      <Box sx={{ p: 2, bgcolor: "#ffffff", borderTop: "1px solid #e2e8f0" }}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Button
              component="label"
              variant="outlined"
              disabled={loading}
              startIcon={<ImagePlus size={16} />}
              sx={{
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 600,
                textTransform: "none",
                borderColor: "#d0d5dd",
                color: "text.primary",
                "&:hover": { borderColor: "primary.main", bgcolor: "#fff0e9" },
              }}
            >
              {loading ? "Đang đọc ảnh…" : value ? "Đổi ảnh bìa" : "Chọn ảnh từ máy"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={(event) => {
                  upload(event.target.files?.[0]);
                  event.target.value = "";
                }}
              />
            </Button>
            {value && (
              <Button
                startIcon={<Trash2 size={15} />}
                onClick={() => {
                  reader.current?.abort();
                  reader.current = null;
                  setLoading(false);
                  setIssue("");
                  onChange("");
                }}
                sx={{
                  borderRadius: 999,
                  fontSize: 13,
                  color: "error.main",
                  textTransform: "none",
                  "&:hover": { bgcolor: "#fef3f2" },
                }}
              >
                Xóa ảnh
              </Button>
            )}
          </div>
          <Typography sx={{ fontSize: 11, color: "text.secondary" }}>
            JPG, PNG, WebP · Tối đa 1 MB
          </Typography>
        </div>
        {(issue || error) && (
          <Alert severity="warning" sx={{ mt: 1.5, borderRadius: "8px" }}>
            {issue || error}
          </Alert>
        )}
      </Box>
    </Box>
  );
}
