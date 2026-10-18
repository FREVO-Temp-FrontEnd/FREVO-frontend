import React from "react";
import { Box, Typography, Paper, Chip } from "@mui/material";
import { ShieldAlert } from "lucide-react";

export const DisputeConceptCard: React.FC = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: "12px",
        bgcolor: "#f8fafc",
        border: "1px dashed #cbd5e1",
        display: "flex",
        alignItems: "flex-start",
        gap: 2,
        my: 2,
      }}
    >
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: "8px",
          bgcolor: "#fee2e2",
          color: "#dc2626",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <ShieldAlert size={18} />
      </Box>

      <Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#1e293b" }}>
            Cơ chế Khiếu nại & Trọng tài giải quyết tranh chấp (PAY-005 / DEC-05)
          </Typography>
          <Chip
            label="Khái niệm nghiên cứu (Concept Mockup)"
            size="small"
            sx={{ bgcolor: "#fee2e2", color: "#991b1b", fontWeight: 700, fontSize: "10px", height: 20 }}
          />
        </Box>
        <Typography variant="caption" sx={{ color: "#64748b", lineHeight: 1.5, display: "block" }}>
          Quy trình hòa giải thanh toán ký quỹ và cơ chế trọng tài trung gian đang được khảo sát chính sách vận hành (theo quyết định <strong>DEC-05</strong>). Trong bản prototype hiện tại, mọi thắc mắc hoặc yêu cầu hoàn tiền mô phỏng được điều phối trực tiếp thông qua đội ngũ hỗ trợ FREVO.
        </Typography>
      </Box>
    </Paper>
  );
};
