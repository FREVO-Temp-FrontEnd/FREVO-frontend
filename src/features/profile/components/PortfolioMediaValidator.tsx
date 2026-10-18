import React from "react";
import { Box, Typography, Alert } from "@mui/material";
import { UploadCloud, AlertCircle } from "lucide-react";

export interface MediaValidationConfig {
  maxFileSizeMB: number;
  allowedFormats: string[];
  maxFileCount: number;
}

const DEFAULT_MEDIA_CONFIG: MediaValidationConfig = {
  maxFileSizeMB: 25, // Configurable prototype mock limit per NFR-10, DEC-02
  allowedFormats: ["image/png", "image/jpeg", "image/webp", "video/mp4"],
  maxFileCount: 8,
};

interface PortfolioMediaValidatorProps {
  currentCount: number;
  config?: MediaValidationConfig;
  onFilesValidated: (files: File[]) => void;
  error?: string;
  onError: (error: string) => void;
}

export const PortfolioMediaValidator: React.FC<PortfolioMediaValidatorProps> = ({
  currentCount,
  config = DEFAULT_MEDIA_CONFIG,
  onFilesValidated,
  error,
  onError,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (files.length === 0) return;

    if (currentCount + files.length > config.maxFileCount) {
      onError(`Mỗi dự án portfolio có thể chứa tối đa ${config.maxFileCount} tệp đính kèm.`);
      return;
    }

    const invalidTypeFiles = files.filter(
      (f) => !config.allowedFormats.includes(f.type)
    );
    if (invalidTypeFiles.length > 0) {
      onError(
        `Định dạng không hỗ trợ (${invalidTypeFiles.map((f) => f.name).join(", ")}). Vui lòng tải lên PNG, JPG, WEBP hoặc MP4.`
      );
      return;
    }

    const maxBytes = config.maxFileSizeMB * 1024 * 1024;
    const oversizedFiles = files.filter((f) => f.size > maxBytes);
    if (oversizedFiles.length > 0) {
      onError(
        `Dung lượng vượt quá giới hạn ${config.maxFileSizeMB}MB (${oversizedFiles
          .map((f) => f.name)
          .join(", ")}).`
      );
      return;
    }

    onError("");
    onFilesValidated(files);
  };

  return (
    <Box sx={{ my: 2 }}>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={config.allowedFormats.join(",")}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <Box
        onClick={() => fileInputRef.current?.click()}
        sx={{
          border: "2px dashed #e2e8f0",
          borderRadius: "12px",
          p: 3,
          textAlign: "center",
          cursor: "pointer",
          bgcolor: "#f8fafc",
          transition: "all 0.2s ease",
          "&:hover": {
            borderColor: "#f4490b",
            bgcolor: "#fffaf7",
          },
        }}
      >
        <UploadCloud size={32} color="#f4490b" style={{ margin: "0 auto 8px" }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#1e293b" }}>
          Tải lên hình ảnh hoặc video minh họa
        </Typography>
        <Typography variant="caption" sx={{ color: "#64748b", display: "block", mt: 0.5 }}>
          Hỗ trợ PNG, JPG, WEBP hoặc MP4 (Tối đa {config.maxFileSizeMB}MB/tệp, giới hạn{" "}
          {config.maxFileCount} tệp)
        </Typography>
        <Typography variant="caption" sx={{ color: "#94a3b8", display: "block", mt: 0.5 }}>
          Hiện có {currentCount}/{config.maxFileCount} tệp
        </Typography>
      </Box>

      {error && (
        <Alert
          severity="error"
          icon={<AlertCircle size={18} />}
          sx={{ mt: 1.5, borderRadius: "8px", fontSize: "0.825rem" }}
        >
          {error}
        </Alert>
      )}
    </Box>
  );
};
