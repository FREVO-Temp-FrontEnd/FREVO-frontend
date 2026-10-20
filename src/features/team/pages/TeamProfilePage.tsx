import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Avatar,
  Chip,
  Breadcrumbs,
  Link as MuiLink,
} from "@mui/material";
import { ShieldCheck, MapPin, Clock, DollarSign, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { TeamRosterTab } from "../components/TeamRosterTab";
import { TeamPortfolioTab } from "../components/TeamPortfolioTab";
import { TeamContextToggle } from "../components/TeamContextToggle";
import { TeamPermissionsPreview } from "../components/TeamPermissionsPreview";

export const TeamProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 2 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <MuiLink
            component="button"
            variant="body2"
            onClick={() => navigate("/profile")}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              color: "#64748b",
              textDecoration: "none",
              "&:hover": { color: "#f4490b" },
            }}
          >
            <ArrowLeft size={16} /> Hồ sơ cá nhân
          </MuiLink>
          <Typography variant="body2" color="text.primary" sx={{ fontWeight: 600 }}>
            Hồ sơ Nhóm sáng tạo
          </Typography>
        </Breadcrumbs>
      </Box>

      {/* Hero Banner */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: "16px",
          border: "1px solid", borderColor: "divider",
          bgcolor: "#ffffff",
          mb: 4,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            gap: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
            <Avatar
              sx={{
                width: { xs: 64, sm: 80 },
                height: { xs: 64, sm: 80 },
                bgcolor: "#d9dfda",
                color: "#1e293b",
                fontWeight: 800,
                fontSize: "24px",
                fontFamily: "Space Grotesk, sans-serif",
              }}
            >
              MC
            </Avatar>

            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap", mb: 0.5 }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    fontFamily: "Space Grotesk, sans-serif",
                    color: "#1e293b",
                  }}
                >
                  Mây Creative
                </Typography>
                <Chip
                  icon={<ShieldCheck size={14} />}
                  label="Team đã xác thực"
                  size="small"
                  sx={{ bgcolor: "#dcfce7", color: "#166534", fontWeight: 700, fontSize: "11px" }}
                />
                <Chip
                  label="Team 3 thành viên (FR-063)"
                  size="small"
                  sx={{ bgcolor: "#ede9fe", color: "#6d28d9", fontWeight: 700, fontSize: "11px" }}
                />
              </Box>

              <Typography variant="body2" sx={{ color: "#64748b", mb: 1.5 }}>
                Nhóm thiết kế thương hiệu, chiến lược hình ảnh và sản phẩm số
              </Typography>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, color: "#64748b", fontSize: "13px" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <MapPin size={15} /> Hà Nội
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Clock size={15} /> Sẵn sàng từ tháng 11
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <DollarSign size={15} /> 22–28 triệu / dự án
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box sx={{ mt: 3, pt: 2.5, borderTop: "1px solid #f1f5f9" }}>
          <Typography variant="body2" sx={{ color: "#475569", lineHeight: 1.6 }}>
            Team 3 người phụ trách chiến lược hình ảnh, thiết kế nhận diện và triển khai nội dung số. Một tài khoản đại diện trao đổi và xác nhận thỏa thuận trên FREVO (theo quy định BR-003).
          </Typography>
        </Box>
      </Paper>

      <TeamPermissionsPreview />

      {/* Tabs */}
      <Box sx={{ mb: 3, borderBottom: "1px solid #e2e8f0" }}>
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          sx={{
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 700,
              fontSize: "14px",
              "&.Mui-selected": { color: "#f4490b" },
            },
            "& .MuiTabs-indicator": { bgcolor: "#f4490b" },
          }}
        >
          <Tab label="Thành viên đội ngũ (FR-063)" />
          <Tab label="Dự án tiêu biểu (BR-027)" />
          <Tab label="Chuyển đổi tư cách hoạt động (AUTH-004)" />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      {activeTab === 0 && <TeamRosterTab />}
      {activeTab === 1 && <TeamPortfolioTab />}
      {activeTab === 2 && <TeamContextToggle />}
    </Container>
  );
};

export default TeamProfilePage;
