import { useEffect } from "react";
import { Link } from "react-router";
import { Avatar, Box, Button, Chip, Divider, Paper, Typography } from "@mui/material";
import {
  ArrowUpRight,
  Building2,
  Clock,
  Pencil,
  Plus,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import { BusinessAccountDetail, BusinessAccountLayout, BusinessAccountSection } from "../components/BusinessAccountLayout";
import { accountPanelSx } from "../components/businessAccountStyles";
import { useBusinessAccount } from "../hooks/useBusinessAccount";
import { useBusiness } from "@/lib/hooks/useBusiness";

export function BusinessProfilePage() {
  const { user, ownedProjects } = useBusinessAccount();
  const { projects } = useBusiness();

  useEffect(() => {
    document.title = "Hồ sơ doanh nghiệp | FREVO";
  }, []);

  const effectiveProjects = ownedProjects.length > 0 ? ownedProjects : projects;
  const publishedProjects = effectiveProjects.filter((p) => p.status === "published");
  const ongoingProjects = effectiveProjects.filter((p) => p.status === "ongoing");
  const completedProjects = effectiveProjects.filter((p) => p.status === "completed");

  const companyDisplayName = user.companyName?.trim() || "Nắng Studio";
  const representativeName = user.name?.trim() || "Nguyễn Hoàng Nam";
  const contactEmail = user.contactEmail?.trim() || user.email;
  const phoneNumber = user.phone?.trim() || "0912 345 678";
  const officeAddress = user.address?.trim() || "Tầng 5, Tòa nhà Creative Hub, Quận 1, TP. Hồ Chí Minh";

  return (
    <BusinessAccountLayout page="profile">
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "minmax(0, 1fr)", lg: "minmax(0, 1.85fr) minmax(310px, 1fr)" },
          alignItems: "start",
          gap: 3.5,
        }}
      >
        {/* Main Column */}
        <Box sx={{ display: "grid", gap: 3.5, minWidth: 0 }}>
          {/* Hero Profile Card */}
          <Paper component="section" aria-labelledby="business-profile-name" elevation={0} sx={accountPanelSx}>
            {/* Top Identity Row */}
            <Box
              sx={{
                p: { xs: 2.5, sm: 3.5 },
                display: "flex",
                flexWrap: { xs: "wrap", sm: "nowrap" },
                alignItems: "flex-start",
                gap: 2.5,
                bgcolor: "#fffaf7",
                borderBottom: "1px solid",
                borderColor: "#fcd5c5",
              }}
            >
              <Avatar
                src={user.avatar}
                alt={companyDisplayName}
                sx={{
                  width: { xs: 68, sm: 84 },
                  height: { xs: 68, sm: 84 },
                  borderRadius: "18px",
                  bgcolor: "#ffffff",
                  color: "primary.dark",
                  border: "2px solid #fcd5c5",
                  boxShadow: "0 2px 8px rgba(189, 61, 20, 0.12)",
                  fontFamily: "Archivo, Arial, sans-serif",
                  fontSize: 32,
                  fontWeight: 900,
                  flexShrink: 0,
                }}
              >
                {companyDisplayName.slice(0, 1).toLocaleUpperCase("vi") || <Building2 size={32} />}
              </Avatar>

              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1, mb: 1 }}>
                  <Chip
                    icon={<ShieldCheck size={14} color="#15803d" />}
                    label="Đã xác minh doanh nghiệp"
                    size="small"
                    sx={{
                      height: 24,
                      fontSize: 11,
                      fontWeight: 700,
                      bgcolor: "#ecfdf5",
                      color: "#15803d",
                      border: "1px solid #a7f3d0",
                      "& .MuiChip-icon": { ml: 0.5 },
                    }}
                  />
                  <Chip
                    label="Doanh nghiệp SME"
                    size="small"
                    sx={{ height: 24, fontSize: 11, fontWeight: 600, bgcolor: "#f0f2f5", color: "#475467" }}
                  />
                  <Chip
                    label="Đang mở tuyển"
                    size="small"
                    sx={{ height: 24, fontSize: 11, fontWeight: 700, bgcolor: "#fff0e9", color: "#bd3d14" }}
                  />
                </Box>

                <Typography
                  id="business-profile-name"
                  component="h2"
                  sx={{
                    fontSize: { xs: 22, sm: 27 },
                    fontWeight: 800,
                    fontFamily: "Archivo, Arial, sans-serif",
                    lineHeight: 1.25,
                    color: "text.primary",
                    overflowWrap: "anywhere",
                  }}
                >
                  {companyDisplayName}
                </Typography>

                <Typography sx={{ mt: 0.5, fontSize: 14, color: "text.secondary", overflowWrap: "anywhere" }}>
                  Người đại diện: <strong className="text-[#20201f]">{representativeName}</strong> · Lĩnh vực: Sáng tạo &amp; Nội dung số
                </Typography>
              </Box>
            </Box>

            {/* Quick Summary Highlights */}
            <Box
              sx={{
                px: { xs: 2.5, sm: 3.5 },
                py: 2.25,
                bgcolor: "#ffffff",
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
                gap: 2,
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                <Sparkles size={18} className="text-[#bd3d14] shrink-0" aria-hidden="true" />
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontSize: 11, color: "text.secondary", fontWeight: 600, textTransform: "uppercase" }}>
                    Lĩnh vực chính
                  </Typography>
                  <Typography sx={{ fontSize: 13, fontWeight: 700, color: "primary.dark" }}>
                    Sáng tạo &amp; Nội dung số
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                <Users size={18} className="text-[#15803d] shrink-0" aria-hidden="true" />
                <Box>
                  <Typography sx={{ fontSize: 11, color: "text.secondary", fontWeight: 600, textTransform: "uppercase" }}>
                    Quy mô nhân sự
                  </Typography>
                  <Typography sx={{ fontSize: 13, fontWeight: 700, color: "text.primary" }}>
                    10 – 25 thành viên
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                <Clock size={18} className="text-[#176c9a] shrink-0" aria-hidden="true" />
                <Box>
                  <Typography sx={{ fontSize: 11, color: "text.secondary", fontWeight: 600, textTransform: "uppercase" }}>
                    Gia nhập FREVO
                  </Typography>
                  <Typography sx={{ fontSize: 13, fontWeight: 700, color: "text.primary" }}>
                    Tháng 10/2026
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Profile Bio / About Section */}
            <Box sx={{ p: { xs: 2.5, sm: 3.5 } }}>
              <Typography component="h3" sx={{ fontSize: 17, fontWeight: 800, fontFamily: "Archivo, Arial, sans-serif", mb: 1.5 }}>
                Về doanh nghiệp của chúng tôi
              </Typography>
              <Typography sx={{ fontSize: 14, color: "#475467", lineHeight: 1.7, maxWidth: "78ch" }}>
                Nắng Studio là đơn vị sáng tạo chuyên sản xuất nội dung số, định vị hình ảnh thương hiệu và thiết kế bao bì cho các thương hiệu vừa và nhỏ (SME) tại Việt Nam. Chúng tôi luôn tìm kiếm những freelancer và nhóm sáng tạo tài năng, đề cao tính đúng hạn và tư duy thẩm mỹ hiện đại để đồng hành trong các dự án.
              </Typography>

              <Box
                sx={{
                  mt: 3,
                  pt: 2.5,
                  borderTop: "1px solid",
                  borderColor: "divider",
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                <Typography sx={{ fontSize: 13, color: "text.secondary", lineHeight: 1.5 }}>
                  Hồ sơ đầy đủ giúp ứng viên tin cậy và chủ động ứng tuyển hơn.
                </Typography>
                <Button
                  component={Link}
                  to="/business/settings"
                  variant="outlined"
                  startIcon={<Pencil size={15} />}
                  sx={{
                    borderRadius: "999px",
                    minHeight: 38,
                    px: 2.5,
                    fontSize: 13,
                    fontWeight: 700,
                    borderColor: "#d0d5dd",
                    color: "text.primary",
                    "&:hover": { borderColor: "primary.main", bgcolor: "#fff0e9" },
                  }}
                >
                  Chỉnh sửa hồ sơ
                </Button>
              </Box>
            </Box>
          </Paper>

          {/* Contact & Legal Information Section */}
          <BusinessAccountSection
            id="business-profile-contact-info"
            title="Thông tin tài khoản &amp; Liên hệ"
            description="Thông tin này được dùng khi xác lập thỏa thuận hợp tác và trao đổi với freelancer."
          >
            <Box
              component="dl"
              sx={{
                m: 0,
                display: "grid",
                gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "repeat(2, minmax(0, 1fr))" },
                columnGap: 4,
                rowGap: 3,
              }}
            >
              <BusinessAccountDetail label="Người đại diện" value={representativeName} />
              <BusinessAccountDetail label="Email đăng nhập" value={user.email} />
              <BusinessAccountDetail label="Email liên hệ nhận hồ sơ" value={contactEmail} />
              <BusinessAccountDetail label="Số điện thoại" value={phoneNumber} />
              <Box sx={{ gridColumn: "1 / -1" }}>
                <BusinessAccountDetail label="Địa chỉ văn phòng / Trụ sở" value={officeAddress} />
              </Box>
            </Box>
          </BusinessAccountSection>
        </Box>

        {/* Aside Sidebar Column */}
        <Box component="aside" aria-label="Dự án và thống kê hoạt động" sx={{ display: "grid", gap: 3 }}>
          {/* Projects Overview Card */}
          <BusinessAccountSection
            id="business-profile-projects"
            title="Thống kê dự án"
            description="Số lượng dự án của bạn trên FREVO."
          >
            <Box component="dl" sx={{ m: 0, display: "grid", gap: 2 }}>
              {[
                { label: "Tổng dự án đã tạo", count: effectiveProjects.length, color: "text.primary" },
                { label: "Đang mở tuyển", count: publishedProjects.length, color: "#bd3d14" },
                { label: "Đang tiến hành", count: ongoingProjects.length, color: "#176c9a" },
                { label: "Đã hoàn thành", count: completedProjects.length, color: "#15803d" },
              ].map((item) => (
                <Box
                  key={item.label}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                    p: 1.25,
                    borderRadius: "10px",
                    bgcolor: "#f8fafc",
                    border: "1px solid #eaedf2",
                  }}
                >
                  <Typography component="dt" sx={{ fontSize: 13, fontWeight: 600, color: "text.secondary" }}>
                    {item.label}
                  </Typography>
                  <Typography component="dd" sx={{ m: 0, fontSize: 18, fontWeight: 800, fontFamily: "Archivo, Arial, sans-serif", color: item.color }}>
                    {item.count}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Button
              component={Link}
              to="/business/projects"
              fullWidth
              variant="outlined"
              endIcon={<ArrowUpRight size={16} />}
              sx={{
                mt: 2.5,
                borderRadius: "999px",
                minHeight: 40,
                fontSize: 13,
                fontWeight: 700,
                color: "text.primary",
                borderColor: "#d0d5dd",
                "&:hover": { borderColor: "primary.main", bgcolor: "#fff0e9" },
              }}
            >
              Quản lý dự án
            </Button>
          </BusinessAccountSection>

          {/* Reputation & Trust Score Card */}
          <Paper elevation={0} sx={{ ...accountPanelSx, p: 2.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 1.5 }}>
              <Box
                sx={{
                  display: "grid",
                  placeItems: "center",
                  width: 36,
                  height: 36,
                  borderRadius: "10px",
                  bgcolor: "#fff0e9",
                  color: "primary.dark",
                }}
              >
                <Star size={18} fill="#f4490b" color="#f4490b" aria-hidden="true" />
              </Box>
              <Box>
                <Typography sx={{ fontSize: 15, fontWeight: 800, fontFamily: "Archivo, Arial, sans-serif" }}>
                  Chỉ số tin cậy tuyển dụng
                </Typography>
                <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                  Đánh giá từ các freelancer đã hợp tác
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mt: 2, display: "grid", gap: 1.25 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span className="text-[#667085]">Điểm hài lòng:</span>
                <strong className="text-[#20201f]">5.0 / 5.0 ★</strong>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span className="text-[#667085]">Thời gian phản hồi:</span>
                <strong className="text-[#15803d]">&lt; 24 giờ</strong>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                <span className="text-[#667085]">Tỷ lệ thanh toán đúng hạn:</span>
                <strong className="text-[#15803d]">100%</strong>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography sx={{ fontSize: 12, color: "text.secondary", lineHeight: 1.6 }}>
              Doanh nghiệp có brief rõ ràng và thanh toán minh bạch sẽ được ưu tiên xếp hạng cao hơn trong kết quả gợi ý ứng viên.
            </Typography>
          </Paper>

          {/* Quick Action: Post New Brief */}
          <Box sx={{ p: 2, borderRadius: "14px", bgcolor: "#fff0e9", border: "1px solid #fcd5c5" }}>
            <Typography sx={{ fontSize: 14, fontWeight: 700, color: "primary.dark" }}>
              Cần tìm thêm cộng sự sáng tạo?
            </Typography>
            <Typography sx={{ mt: 0.5, fontSize: 12, color: "#667085", lineHeight: 1.5 }}>
              Đăng brief mới để nhận đề xuất hồ sơ phù hợp từ AI matching trong 24 giờ.
            </Typography>
            <Button
              component={Link}
              to="/business/projects/new"
              variant="contained"
              startIcon={<Plus size={15} />}
              fullWidth
              sx={{
                mt: 1.5,
                borderRadius: "999px",
                minHeight: 38,
                fontSize: 13,
                fontWeight: 700,
                bgcolor: "primary.dark",
                color: "#ffffff !important",
                "&:hover": { bgcolor: "primary.main" },
              }}
            >
              Đăng dự án mới
            </Button>
          </Box>
        </Box>
      </Box>
    </BusinessAccountLayout>
  );
}
