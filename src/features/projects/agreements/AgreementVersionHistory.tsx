import { Box, ButtonBase, Chip, Paper, Typography } from "@mui/material";
import { CheckCircle2, ClipboardCheck, History, XCircle } from "lucide-react";
import type { AgreementProposal } from "@/lib/types/marketplace.types";

interface AgreementVersionHistoryProps {
  agreements: AgreementProposal[];
  selectedVersion: number;
  onSelectVersion: (version: number) => void;
}

export function AgreementVersionHistory({ agreements, selectedVersion, onSelectVersion }: AgreementVersionHistoryProps) {
  const sorted = [...agreements].sort((a, b) => b.version - a.version);
  return <Paper elevation={0} sx={{ p: 2.75, borderRadius: "16px", border: "1px solid", borderColor: "divider" }}>
    <Typography component="h2" className="flex items-center gap-2" sx={{ fontFamily: "h3.fontFamily", fontSize: 15, fontWeight: 700, mb: 1 }}><History size={18} />Lịch sử phiên bản</Typography>
    <Typography sx={{ fontSize: 11, color: "text.secondary", lineHeight: 1.8, mb: 2 }}>Theo dõi các đề xuất và nội dung đã được hai bên xác nhận.</Typography>
    <Box className="flex flex-col gap-2">{sorted.map(item => {
      const selected = item.version === selectedVersion;
      const Icon = item.status === "confirmed" ? CheckCircle2 : item.status === "pending" ? ClipboardCheck : XCircle;
      const color = item.isEffective ? "#16805b" : item.status === "pending" ? "#bd3d14" : "#747773";
      const label = item.isEffective ? "Có hiệu lực" : item.status === "confirmed" ? "Bản đã xác nhận" : item.status === "pending" ? "Chờ xác nhận" : item.status === "expired" ? "Hết hạn" : "Đã từ chối";
      return <ButtonBase key={item.id ?? item.version} onClick={() => onSelectVersion(item.version)} aria-pressed={selected} sx={{ display: "block", p: 1.75, border: "1px solid", borderColor: selected ? "#f2c8b6" : "divider", bgcolor: selected ? "#fff0e9" : "background.paper", textAlign: "left", borderRadius: "12px", "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: 2 } }}><Box className="flex items-center justify-between gap-2"><Typography className="flex items-center gap-2" sx={{ fontWeight: 700, fontSize: 12 }}><Icon size={16} color={color} />Phiên bản {item.version}</Typography><Chip size="small" label={label} sx={{ height: 20, fontSize: 9, color, bgcolor: item.isEffective ? "#e8f7ef" : "background.default" }} /></Box><Typography sx={{ fontSize: 10, color: "text.secondary", mt: 1 }}>{new Date(item.sentAt).toLocaleDateString("vi-VN")} · {item.budget}</Typography></ButtonBase>;
    })}</Box>
  </Paper>;
}
