import { Box, Button, IconButton, Paper, Tooltip, Typography } from "@mui/material";
import { Download, ExternalLink, FileText, Image as ImageIcon, Paperclip } from "lucide-react";
import type { Milestone } from "@/lib/types/marketplace.types";

interface MilestoneFilesProps {
  files: NonNullable<Milestone["submissionFiles"]>;
  compact?: boolean;
}

export function MilestoneFiles({ files, compact = false }: MilestoneFilesProps) {
  if (!files.length) return <Typography sx={{ fontSize: 12, color: "text.secondary", py: 1.5 }}>Chưa có tệp đính kèm. Xem ghi chú bàn giao để biết thêm chi tiết.</Typography>;
  return <Box>
    <Typography className="flex items-center gap-1.5" sx={{ fontSize: 12, fontWeight: 600, mb: 1.25 }}>
      <Paperclip size={15} />Tệp sản phẩm bàn giao ({files.length})
    </Typography>
    <Box
      className="grid gap-2"
      sx={{ gridTemplateColumns: !compact ? { xs: "1fr", sm: "repeat(3, minmax(0, 1fr))" } : "1fr" }}>
      {files.map((file, index) => {
        const isImage = /\.(png|jpe?g|webp)(\?|$)/i.test(file.name);
        const href = /^(https?:\/\/|blob:|\/[^/])/.test(file.url) ? file.url : undefined;
        return <Paper
          key={`${file.name}-${index}`}
          elevation={0}
          sx={{ p: 1.5, bgcolor: "background.default", borderRadius: "10px", minWidth: 0 }}>
          <Box className="flex items-center gap-2">
            <Box
              sx={{
                flexShrink: 0,
                width: 34,
                height: 38,
                borderRadius: "8px",
                bgcolor: isImage ? "#e8f7ef" : "#fff0e9",
                color: isImage ? "#16805b" : "primary.dark",
                display: "grid",
                placeItems: "center"
              }}>{isImage && href ? <Box
                component="img"
                src={href}
                alt=""
                sx={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }} /> : isImage ? <ImageIcon size={18} /> : <FileText size={18} />}</Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                sx={{ fontSize: 11, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                title={file.name}>{file.name}</Typography>
              <Typography sx={{ fontSize: 10, color: "text.secondary", mt: .5 }}>{file.size}</Typography>
            </Box>
            {href && <Tooltip title={`Mở ${file.name}`}>
              <IconButton
                component="a"
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Mở ${file.name}`}
                size="small"
                sx={{ color: "text.secondary", display: compact ? "inline-flex" : { xs: "inline-flex", sm: "none" } }}>
                <ExternalLink size={15} />
              </IconButton>
            </Tooltip>}
          </Box>
          <Box className="mt-2 flex items-center justify-between gap-2">
            <Typography sx={{ fontSize: 9, color: "text.secondary" }}>{href ? "Bản bàn giao" : "Chưa có liên kết tệp"}</Typography>
            <Tooltip title={href ? "Mở hoặc lưu tệp từ trình xem" : "Tệp này chưa có liên kết hợp lệ"}>
              <span>
                <Button
                  component="a"
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  disabled={!href}
                  size="small"
                  startIcon={<Download size={13} />}
                  sx={{ minWidth: 0, fontSize: 10, py: 0 }}>Mở tệp</Button>
              </span>
            </Tooltip>
          </Box>
        </Paper>;
      })}
    </Box>
  </Box>;
}
