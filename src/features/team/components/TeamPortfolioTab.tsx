import React from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
} from "@mui/material";
import { Users } from "lucide-react";

interface TeamProjectCase {
  id: string;
  title: string;
  category: string;
  client: string;
  color: string;
  attribution: "Team";
  teamRole: string;
  contributors: string[];
}

const teamCases: TeamProjectCase[] = [
  {
    id: "lala-id",
    title: "Hệ thống nhận diện thương hiệu Lala",
    category: "Brand Identity",
    client: "Lala Lifestyle F&B",
    color: "#c9ccd5",
    attribution: "Team",
    teamRole: "Art Director & Lead Designer (Minh Anh)",
    contributors: ["Minh Anh (Art Direction)", "Quốc Huy (Design System)", "Thùy Trang (Motion)"],
  },
  {
    id: "som-campaign",
    title: "Chiến dịch hình ảnh ra mắt Sớm",
    category: "Campaign & Social",
    client: "Sớm Concept Store",
    color: "#edcba9",
    attribution: "Team",
    teamRole: "Visual Identity & Creative Strategy",
    contributors: ["Minh Anh (Creative Lead)", "Thùy Trang (Visual Assets)"],
  },
];

export const TeamPortfolioTab: React.FC = () => {
  return (
    <Box sx={{ py: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b" }}>
            Dự án tiêu biểu của Team (BR-027)
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b" }}>
            Minh bạch thành quả chung và ghi nhận phần đóng góp cụ thể của từng thành viên
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
        {teamCases.map((work) => (
          <Paper
            key={work.id}
            variant="outlined"
            sx={{
              borderRadius: "14px",
              overflow: "hidden",
              bgcolor: "#ffffff",
              display: "flex",
              flexDirection: "column",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
              },
            }}
          >
            <Box
              sx={{
                height: 180,
                bgcolor: work.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#1e293b",
                fontWeight: 800,
                fontSize: "32px",
                fontFamily: "Space Grotesk, sans-serif",
                position: "relative",
              }}
            >
              {work.title.slice(0, 2).toUpperCase()}
              <Chip
                icon={<Users size={12} />}
                label="Dự án Team (BR-027)"
                size="small"
                sx={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  bgcolor: "#ffffff",
                  color: "#475569",
                  fontWeight: 700,
                  fontSize: "11px",
                }}
              />
            </Box>

            <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 1.5, flex: 1 }}>
              <Box>
                <Typography variant="caption" sx={{ color: "#f4490b", fontWeight: 700 }}>
                  {work.category} · {work.client}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b" }}>
                  {work.title}
                </Typography>
              </Box>

              <Box sx={{ p: 1.5, bgcolor: "#f8fafc", borderRadius: "8px" }}>
                <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>
                  Vai trò của đại diện (Minh Anh):
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#1e293b" }}>
                  {work.teamRole}
                </Typography>
              </Box>

              <Box sx={{ mt: "auto", pt: 1 }}>
                <Typography variant="caption" sx={{ color: "#64748b", display: "block", mb: 0.5 }}>
                  Thành viên đóng góp:
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {work.contributors.map((c) => (
                    <Chip
                      key={c}
                      label={c}
                      size="small"
                      sx={{ fontSize: "11px", bgcolor: "#f1f5f9", color: "#475569" }}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};
