import { Box, Typography } from "@mui/material";
import { Clock3, MessageCircle } from "lucide-react";

export function InvitationTermsHint() {
  return <Box role="note" aria-label="Điều kiện lời mời" sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, px: 1.5, py: 1.25, borderRadius: "10px", bgcolor: "background.default", color: "text.secondary" }}>
    <Typography sx={{ display: "flex", alignItems: "center", gap: 0.75, fontSize: 13, lineHeight: 1.6 }}><Clock3 size={15} aria-hidden="true" />Hiệu lực lời mời 7 ngày</Typography>
    <Typography sx={{ display: "flex", alignItems: "center", gap: 0.75, fontSize: 13, lineHeight: 1.6 }}><MessageCircle size={15} aria-hidden="true" />Duyệt hồ sơ để mở chat</Typography>
  </Box>;
}
