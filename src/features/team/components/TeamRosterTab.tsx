import React from "react";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Chip,
} from "@mui/material";
import { ShieldCheck, UserCheck } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  initials: string;
  color: string;
  isLeader: boolean;
  skills: string[];
}

const defaultMembers: TeamMember[] = [
  {
    id: "m-1",
    name: "Minh Anh",
    role: "Trưởng nhóm · Art Director & Visual Strategist",
    initials: "MA",
    color: "#f4490b",
    isLeader: true,
    skills: ["Brand Strategy", "Art Direction", "Visual Identity"],
  },
  {
    id: "m-2",
    name: "Quốc Huy",
    role: "Lead UI/UX Designer",
    initials: "QH",
    color: "#0284c7",
    isLeader: false,
    skills: ["Figma Design Systems", "Wireframing", "User Testing"],
  },
  {
    id: "m-3",
    name: "Thùy Trang",
    role: "Motion & Graphic Designer",
    initials: "TT",
    color: "#7c3aed",
    isLeader: false,
    skills: ["Motion Graphics", "3D Modeling", "Social Assets"],
  },
];

export const TeamRosterTab: React.FC = () => {
  const members = defaultMembers;

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
            Danh sách thành viên đội ngũ (FR-063)
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b" }}>
            Cơ cấu nhân sự và vai trò chuyên môn trong các dự án hợp tác nhóm
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            p: 1,
            px: 1.5,
            bgcolor: "#f0fdf4",
            borderRadius: "8px",
            border: "1px solid #bbf7d0",
          }}
        >
          <ShieldCheck size={16} color="#16a34a" />
          <Typography variant="caption" sx={{ color: "#166534", fontWeight: 600 }}>
            Tài khoản đại diện duy nhất (BR-003)
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 2.5 }}>
        {members.map((member) => (
          <Paper
            key={member.id}
            variant="outlined"
            sx={{
              p: 3,
              borderRadius: "14px",
              bgcolor: "#ffffff",
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
              position: "relative",
              border: member.isLeader ? "2px solid #fed7aa" : "1px solid #e2e8f0",
            }}
          >
            {member.isLeader && (
              <Chip
                icon={<UserCheck size={12} />}
                label="Đại diện nhóm (Leader)"
                size="small"
                sx={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  bgcolor: "#fffaf7",
                  color: "#ea580c",
                  borderColor: "#fed7aa",
                  border: "1px solid",
                  fontWeight: 700,
                  fontSize: "10px",
                  height: 22,
                }}
              />
            )}

            <Avatar
              sx={{
                width: 48,
                height: 48,
                bgcolor: member.color,
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "16px",
              }}
            >
              {member.initials}
            </Avatar>

            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1e293b" }}>
                {member.name}
              </Typography>
              <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>
                {member.role}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: "auto", pt: 1 }}>
              {member.skills.map((skill) => (
                <Chip
                  key={skill}
                  label={skill}
                  size="small"
                  sx={{
                    bgcolor: "#f1f5f9",
                    color: "#475569",
                    fontSize: "11px",
                    height: 22,
                  }}
                />
              ))}
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};
