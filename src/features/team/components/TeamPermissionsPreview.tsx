import React from "react";
import { Box, Typography, Paper, Chip } from "@mui/material";
import { Sparkles } from "lucide-react";

export const TeamPermissionsPreview: React.FC = () => {
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
          bgcolor: "#ede9fe",
          color: "#7c3aed",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Sparkles size={18} />
      </Box>

      <Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#1e293b" }}>
            Quản trị & Phân quyền thành viên nhiều tài khoản (TEAM-005)
          </Typography>
          <Chip
            label="Tính năng nâng cao (P2 Preview)"
            size="small"
            sx={{ bgcolor: "#f3e8ff", color: "#7e22ce", fontWeight: 700, fontSize: "10px", height: 20 }}
          />
        </Box>
        <Typography variant="caption" sx={{ color: "#64748b", lineHeight: 1.5, display: "block" }}>
          Trong phiên bản MVP hiện tại, Nhóm sáng tạo hoạt động thông qua <strong>một tài khoản Đại diện duy nhất</strong> (Team Leader) để ứng tuyển, trao đổi và ký thỏa thuận hợp tác (theo <strong>FR-026, BR-003</strong>). Tính năng mời thành viên đăng nhập riêng biệt và phân quyền đa tài khoản đang trong lộ trình phát triển P2.
        </Typography>
      </Box>
    </Paper>
  );
};
