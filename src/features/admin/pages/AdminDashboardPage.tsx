import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Avatar,
  Breadcrumbs,
  Link as MuiLink,
} from "@mui/material";
import {
  ShieldCheck,
  Briefcase,
  Users,
  FileText,
  Activity,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useBusiness } from "@/lib/hooks/useBusiness";
import { mockStorage } from "@/lib/storage/mockStorage";

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { projects, talents, agreements } = useBusiness();
  const [activeTab, setActiveTab] = useState(0);

  // Stats calculation
  const totalBriefs = projects.length;
  const publishedBriefs = projects.filter((p) => p.status === "published").length;
  const ongoingAgreements = agreements.filter((a) => a.status === "confirmed").length;
  const totalTalents = talents.length;
  const verifiedTalents = talents.filter((t) => t.verified).length;

  const handleToggleVerifyTalent = (talentId: string) => {
    // In-memory toggle
    const target = talents.find((t) => t.id === talentId);
    if (target) {
      target.verified = !target.verified;
      mockStorage.saveProject({ ...projects[0] }); // Triggers reactivity
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 2 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <MuiLink
            component="button"
            variant="body2"
            onClick={() => navigate("/business")}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              color: "#64748b",
              textDecoration: "none",
              "&:hover": { color: "#f4490b" },
            }}
          >
            <ArrowLeft size={16} /> Về Business Workspace
          </MuiLink>
          <Typography variant="body2" color="text.primary" sx={{ fontWeight: 600 }}>
            Trung tâm quản trị & Giám sát hệ thống (ADM-001)
          </Typography>
        </Breadcrumbs>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            fontFamily: "Space Grotesk, sans-serif",
            color: "#1e293b",
          }}
        >
          Bảng điều khiển Quản trị viên (ADM-001)
        </Typography>
        <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>
          Giám sát tin tuyển dụng, xác thực hồ sơ sáng tạo và kiểm soát tuân thủ quy tắc sàn FREVO
        </Typography>
      </Box>

      {/* KPI Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" },
          gap: 2.5,
          mb: 4,
        }}
      >
        <Paper elevation={0} sx={{ p: 2.5, borderRadius: "14px", border: "1px solid #e2e8f0" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1, color: "#f4490b" }}>
            <Briefcase size={20} />
            <Typography variant="caption" sx={{ fontWeight: 700, textTransform: "uppercase" }}>
              Tin tuyển dụng
            </Typography>
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: "Space Grotesk, sans-serif" }}>
            {totalBriefs}
          </Typography>
          <Typography variant="caption" sx={{ color: "#64748b" }}>
            {publishedBriefs} brief đang mở tuyển
          </Typography>
        </Paper>

        <Paper elevation={0} sx={{ p: 2.5, borderRadius: "14px", border: "1px solid #e2e8f0" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1, color: "#0284c7" }}>
            <Users size={20} />
            <Typography variant="caption" sx={{ fontWeight: 700, textTransform: "uppercase" }}>
              Tài năng sáng tạo
            </Typography>
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: "Space Grotesk, sans-serif" }}>
            {totalTalents}
          </Typography>
          <Typography variant="caption" sx={{ color: "#64748b" }}>
            {verifiedTalents} hồ sơ đã xác thực (DEC-09)
          </Typography>
        </Paper>

        <Paper elevation={0} sx={{ p: 2.5, borderRadius: "14px", border: "1px solid #e2e8f0" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1, color: "#16a34a" }}>
            <FileText size={20} />
            <Typography variant="caption" sx={{ fontWeight: 700, textTransform: "uppercase" }}>
              Hợp đồng hợp tác
            </Typography>
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: "Space Grotesk, sans-serif" }}>
            {ongoingAgreements}
          </Typography>
          <Typography variant="caption" sx={{ color: "#64748b" }}>
            Đang thực hiện mốc bàn giao
          </Typography>
        </Paper>

        <Paper elevation={0} sx={{ p: 2.5, borderRadius: "14px", border: "1px solid #e2e8f0" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1, color: "#7c3aed" }}>
            <Activity size={20} />
            <Typography variant="caption" sx={{ fontWeight: 700, textTransform: "uppercase" }}>
              Sức khỏe hệ thống
            </Typography>
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: "Space Grotesk, sans-serif" }}>
            100%
          </Typography>
          <Typography variant="caption" sx={{ color: "#16a34a" }}>
            Mock Storage Reactive Ok
          </Typography>
        </Paper>
      </Box>

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
          <Tab label="Kiểm duyệt Brief dự án (ADM-002)" />
          <Tab label="Xác thực hồ sơ Freelancer & Team (ADM-003 / DEC-09)" />
          <Tab label="Nhật ký kiểm toán sự kiện sàn (ADM-004)" />
        </Tabs>
      </Box>

      {/* Tab 0: Brief Moderation (ADM-002) */}
      {activeTab === 0 && (
        <Paper elevation={0} sx={{ borderRadius: "14px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
          <TableContainer>
            <Table size="small">
              <TableHead sx={{ bgcolor: "#f8fafc" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Tên brief / Dự án</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Doanh nghiệp</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Lĩnh vực</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Ngân sách</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Trạng thái</TableCell>
                  <TableCell sx={{ fontWeight: 700, textAlign: "right" }}>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {projects.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell sx={{ fontWeight: 600, color: "#1e293b" }}>{p.title}</TableCell>
                    <TableCell sx={{ color: "#475569" }}>{p.company}</TableCell>
                    <TableCell>{p.category}</TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#f4490b" }}>{p.budget}</TableCell>
                    <TableCell>
                      <Chip
                        label={
                          p.status === "published"
                            ? "Đang tuyển"
                            : p.status === "ongoing"
                            ? "Đang tiến hành"
                            : p.status === "closed"
                            ? "Đã đóng tuyển"
                            : p.status === "completed"
                            ? "Hoàn thành"
                            : "Bản nháp"
                        }
                        size="small"
                        sx={{ fontSize: "11px", height: 22 }}
                      />
                    </TableCell>
                    <TableCell sx={{ textAlign: "right" }}>
                      <Button
                        size="small"
                        onClick={() => navigate(`/projects/${p.id}/details`)}
                        sx={{ textTransform: "none", color: "#f4490b", fontWeight: 600 }}
                      >
                        Kiểm tra
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Tab 1: Talent Verification Queue (ADM-003 / DEC-09) */}
      {activeTab === 1 && (
        <Paper elevation={0} sx={{ borderRadius: "14px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
          <TableContainer>
            <Table size="small">
              <TableHead sx={{ bgcolor: "#f8fafc" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Tài năng sáng tạo</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Hình thức</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Khu vực</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Dự án Portfolio</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Huy hiệu xác thực (DEC-09)</TableCell>
                  <TableCell sx={{ fontWeight: 700, textAlign: "right" }}>Cập nhật</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {talents.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: t.color, fontSize: "12px", fontWeight: 700 }}>
                          {t.initials}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {t.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: "#64748b" }}>
                            {t.role}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={t.kind}
                        size="small"
                        sx={{
                          bgcolor: t.kind === "Team" ? "#ede9fe" : "#f1f5f9",
                          color: t.kind === "Team" ? "#7c3aed" : "#475569",
                          fontSize: "10px",
                          height: 20,
                        }}
                      />
                    </TableCell>
                    <TableCell>{t.location}</TableCell>
                    <TableCell>{t.portfolio.length} tác phẩm</TableCell>
                    <TableCell>
                      {t.verified ? (
                        <Chip
                          icon={<ShieldCheck size={12} />}
                          label="Đã xác thực"
                          size="small"
                          sx={{ bgcolor: "#dcfce7", color: "#166534", fontWeight: 700, fontSize: "11px" }}
                        />
                      ) : (
                        <Chip
                          label="Chưa xác thực"
                          size="small"
                          sx={{ bgcolor: "#f1f5f9", color: "#64748b", fontSize: "11px" }}
                        />
                      )}
                    </TableCell>
                    <TableCell sx={{ textAlign: "right" }}>
                      <Button
                        size="small"
                        onClick={() => handleToggleVerifyTalent(t.id)}
                        sx={{
                          textTransform: "none",
                          fontSize: "12px",
                          color: t.verified ? "#dc2626" : "#059669",
                        }}
                      >
                        {t.verified ? "Hủy huy hiệu" : "Cấp xác thực"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Tab 2: Audit Log (ADM-004) */}
      {activeTab === 2 && (
        <Paper elevation={0} sx={{ p: 3, borderRadius: "14px", border: "1px solid #e2e8f0" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
            Nhật ký kiểm toán sự kiện toàn sàn (ADM-004)
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Box sx={{ p: 2, bgcolor: "#f8fafc", borderRadius: "8px", border: "1px solid #f1f5f9" }}>
              <Typography variant="caption" sx={{ color: "#64748b" }}>
                18/10/2026 10:24
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: "#1e293b" }}>
                Nắng Studio đã phê duyệt hồ sơ ứng viên và mở kênh trao đổi với Khánh Linh (FR-031, BR-012)
              </Typography>
            </Box>

            <Box sx={{ p: 2, bgcolor: "#f8fafc", borderRadius: "8px", border: "1px solid #f1f5f9" }}>
              <Typography variant="caption" sx={{ color: "#64748b" }}>
                16/10/2026 14:00
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: "#1e293b" }}>
                Hà Vy đã nộp sản phẩm bàn giao Mốc 1 cho dự án Thiết kế hệ bao bì Cỏ Mây (WORK-004)
              </Typography>
            </Box>

            <Box sx={{ p: 2, bgcolor: "#f8fafc", borderRadius: "8px", border: "1px solid #f1f5f9" }}>
              <Typography variant="caption" sx={{ color: "#64748b" }}>
                03/10/2026 10:00
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: "#1e293b" }}>
                Hai bên đã xác nhận Thỏa thuận hợp tác Phiên bản 1 (Mã FV-2026-004) - Dự án đóng tuyển dụng (BR-023)
              </Typography>
            </Box>
          </Box>
        </Paper>
      )}
    </Container>
  );
};

export default AdminDashboardPage;
