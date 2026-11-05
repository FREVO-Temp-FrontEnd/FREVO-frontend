import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Paper,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Globe,
  MapPin,
  Pencil,
  Plus,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { EditBusinessProfileDialog } from "../components/EditBusinessProfileDialog";
import { useBusinessAccount } from "../hooks/useBusinessAccount";

export function BusinessProfilePage() {
  const account = useBusinessAccount();
  const { user, ownedProjects } = account;
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const name = user.companyName?.trim() || user.name;
  const activeProjects = ownedProjects.filter(({ status }) => status === "published" || status === "ongoing");

  useEffect(() => {
    document.title = `${name} | Hồ sơ doanh nghiệp FREVO`;
  }, [name]);

  function openEditor() {
    account.reset();
    setEditing(true);
  }

  const copyEmail = () => {
    const emailToCopy = user.contactEmail || user.email;
    if (emailToCopy) {
      navigator.clipboard.writeText(emailToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <Box
      component="main"
      id="business-profile-container"
      sx={{
        maxWidth: 1200,
        mx: "auto",
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 2, sm: 3 },
        minWidth: 0,
        "& .MuiButton-root": { textTransform: "none", fontWeight: 700, borderRadius: 999 },
      }}
    >
      {/* 1. HERO BRAND CARD & COVER */}
      <Paper
        variant="outlined"
        sx={{
          borderRadius: "20px",
          overflow: "hidden",
          borderColor: "#d0d5dd",
          bgcolor: "background.paper",
          boxShadow: "0 1px 4px rgba(16, 24, 40, 0.04)",
          mb: 3,
        }}
      >
        {/* Creative Cover Banner */}
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: { xs: 130, sm: 200, md: 240 },
            overflow: "hidden",
            bgcolor: "#f4f3f0",
          }}
        >
          <Box
            component="img"
            src="/assets/nang-studio-brief.webp"
            alt="Không gian sáng tạo Nắng Studio"
            sx={{
              display: "block",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 45%",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 60%)",
            }}
          />
        </Box>

        {/* Identity & Header Actions Bar */}
        <Box sx={{ px: { xs: 2.5, sm: 4 }, pb: 3.5, pt: 0 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "flex-start", sm: "flex-end" },
              justifyContent: "space-between",
              gap: 2,
              mt: { xs: -5, sm: -6 },
              mb: 2.5,
            }}
          >
            {/* Overlapping Avatar */}
            <Avatar
              variant="rounded"
              src={user.avatar}
              sx={{
                width: { xs: 80, sm: 104 },
                height: { xs: 80, sm: 104 },
                borderRadius: "22px",
                border: "4px solid #ffffff",
                bgcolor: "#20201f",
                color: "#ffffff",
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
                fontSize: 28,
                fontWeight: 800,
              }}
            >
              <Building2 size={42} aria-hidden="true" />
            </Avatar>

            {/* Action Buttons */}
            <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1.5 }}>
              <Button
                variant="outlined"
                color="secondary"
                component={Link}
                to="/business/projects/new"
                startIcon={<Plus size={16} />}
                sx={{
                  minHeight: 40,
                  px: 2.5,
                  fontSize: 13.5,
                  borderColor: "#d0d5dd",
                  color: "#20201f",
                  "&:hover": { borderColor: "primary.main", bgcolor: "#fff5f0" },
                }}
              >
                Đăng dự án mới
              </Button>
              <Button
                variant="contained"
                onClick={openEditor}
                startIcon={<Pencil size={15} />}
                sx={{
                  minHeight: 40,
                  px: 3,
                  fontSize: 13.5,
                  bgcolor: "#f4490b !important",
                  color: "#ffffff !important",
                  boxShadow: "0 2px 8px rgba(244,73,11,0.25)",
                  "&:hover": { bgcolor: "#bd3d14 !important" },
                }}
              >
                Chỉnh sửa hồ sơ
              </Button>
            </Box>
          </Box>

          {/* Company Details Title & Meta */}
          <Box sx={{ minWidth: 0 }}>
            <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1.5, mb: 1 }}>
              <Typography
                component="h1"
                sx={{
                  fontSize: { xs: 26, sm: 34 },
                  fontWeight: 800,
                  lineHeight: 1.2,
                  color: "#20201f",
                  fontFamily: "Archivo, sans-serif",
                }}
              >
                {name}
              </Typography>
              <Chip
                icon={<CheckCircle2 size={14} className="text-[#16805b]" />}
                label="Doanh nghiệp đã xác thực"
                size="small"
                sx={{
                  bgcolor: "#e8f7ef",
                  color: "#16805b",
                  fontWeight: 700,
                  fontSize: 11.5,
                  border: "1px solid #b7ebcf",
                  height: 24,
                  "& .MuiChip-icon": { color: "#16805b" },
                }}
              />
              <Chip
                label="Thành viên FREVO"
                size="small"
                sx={{
                  bgcolor: "#f2f3f0",
                  color: "#62665f",
                  fontWeight: 600,
                  fontSize: 11,
                  height: 24,
                }}
              />
            </Box>

            {user.industry && (
              <Typography sx={{ fontSize: { xs: 15, sm: 16 }, fontWeight: 500, color: "#62665f", mb: 2 }}>
                {user.industry}
              </Typography>
            )}

            {/* Quick Metadata Row */}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                columnGap: 3,
                rowGap: 1.5,
                pt: 1.5,
                borderTop: "1px solid #eef0eb",
                fontSize: 13.5,
                color: "#747773",
              }}
            >
              <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
                <MapPin size={15} className="text-[#8c9188] shrink-0" aria-hidden="true" />
                <span>{user.address || "Quận 1, TP. Hồ Chí Minh"}</span>
              </Box>
              <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
                <Users size={15} className="text-[#8c9188] shrink-0" aria-hidden="true" />
                <span>Quy mô: 10–25 nhân sự</span>
              </Box>
              <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
                <Globe size={15} className="text-[#8c9188] shrink-0" aria-hidden="true" />
                <a
                  href="https://nangstudio.vn"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-[#20201f] hover:text-[#bd3d14] inline-flex items-center gap-0.5"
                >
                  nangstudio.vn <ExternalLink size={12} className="opacity-70" />
                </a>
              </Box>
              <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
                <Calendar size={15} className="text-[#8c9188] shrink-0" aria-hidden="true" />
                <span>Gia nhập: T10/2026</span>
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* 2. STATS & REPUTATION STRIP */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
          gap: 2,
          mb: 3,
        }}
      >
        {[
          { label: "Dự án đã công bố", val: "2 dự án", sub: "100% hoàn thành tuyển chọn" },
          { label: "Ngân sách chi trả", val: "39–49 triệu", sub: "Tổng ngân sách các dự án" },
          { label: "Thời gian phản hồi", val: "< 24 giờ", sub: "Tích cực trao đổi với ứng viên" },
          { label: "Hình thức hợp tác", val: "Cá nhân & Nhóm", sub: "Linh hoạt theo quy mô việc" },
        ].map((item, index) => (
          <Paper
            key={index}
            variant="outlined"
            sx={{
              p: 2.25,
              borderRadius: "14px",
              borderColor: "#d0d5dd",
              bgcolor: "background.paper",
            }}
          >
            <Typography sx={{ fontSize: 11.5, fontWeight: 700, color: "#747773", textTransform: "uppercase", letterSpacing: 0.5 }}>
              {item.label}
            </Typography>
            <Typography sx={{ fontSize: { xs: 18, sm: 20 }, fontWeight: 800, color: "#20201f", mt: 0.5, lineHeight: 1.2 }}>
              {item.val}
            </Typography>
            <Typography sx={{ fontSize: 12, color: "#8c9188", mt: 0.5 }}>
              {item.sub}
            </Typography>
          </Paper>
        ))}
      </Box>

      {/* 3. MAIN TWO-COLUMN CONTENT GRID */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "minmax(0, 1fr)", lg: "minmax(0, 2fr) minmax(320px, 1fr)" },
          gap: 3,
          alignItems: "start",
        }}
      >
        {/* LEFT COLUMN: ABOUT, SKILLS, PROJECTS & SHOWCASE */}
        <Stack spacing={3} sx={{ minWidth: 0 }}>
          {/* Section: Giới thiệu doanh nghiệp */}
          <Paper
            variant="outlined"
            sx={{
              p: { xs: 2.5, sm: 3.5 },
              borderRadius: "16px",
              borderColor: "#d0d5dd",
              bgcolor: "background.paper",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#fff4ee] text-[#bd3d14] border border-[#ffdecb]">
                <Building2 size={16} strokeWidth={2.2} />
              </div>
              <Typography component="h2" sx={{ fontSize: 18, fontWeight: 800, color: "#20201f" }}>
                Giới thiệu doanh nghiệp
              </Typography>
            </Box>
            <Typography
              sx={{
                fontSize: 14.5,
                lineHeight: 1.8,
                color: user.companyBio ? "#20201f" : "#747773",
                whiteSpace: "pre-wrap",
              }}
            >
              {user.companyBio ||
                "Nắng Studio là thương hiệu sản phẩm thủ công và quà tặng phong cách sống tại TP.HCM. Chúng tôi tập trung vào trải nghiệm thương hiệu ấm áp, bền vững và tôn vinh chất liệu bản địa Việt Nam.\n\nTại FREVO, chúng tôi tìm kiếm những chuyên gia sáng tạo có tư duy thẩm mỹ tinh tế, yêu mến văn hóa truyền thống để cùng hợp tác lâu dài."}
            </Typography>

            {/* Core Values / Working Principles */}
            <Box sx={{ mt: 3, pt: 3, borderTop: "1px solid #f0f2ed" }}>
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#62665f", textTransform: "uppercase", letterSpacing: 0.5, mb: 1.5 }}>
                Nguyên tắc làm việc với Freelancer &amp; Team
              </Typography>
              <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" } }}>
                <Box sx={{ p: 2, borderRadius: "12px", bgcolor: "#fafaf8", border: "1px solid #eef0eb" }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#20201f", mb: 0.5 }}>
                    🌱 Bản sắc &amp; Bền vững
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: "#747773", lineHeight: 1.5 }}>
                    Ưu tiên giải pháp tôn vinh chất liệu và câu chuyện bản địa Việt Nam.
                  </Typography>
                </Box>
                <Box sx={{ p: 2, borderRadius: "12px", bgcolor: "#fafaf8", border: "1px solid #eef0eb" }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#20201f", mb: 0.5 }}>
                    🤝 Tôn trọng sáng tạo
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: "#747773", lineHeight: 1.5 }}>
                    Brief rõ ràng, tôn trọng phong cách riêng và phản hồi nhanh chóng theo mốc.
                  </Typography>
                </Box>
                <Box sx={{ p: 2, borderRadius: "12px", bgcolor: "#fafaf8", border: "1px solid #eef0eb" }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#20201f", mb: 0.5 }}>
                    💳 Ký quỹ minh bạch
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: "#747773", lineHeight: 1.5 }}>
                    Tạm giữ ngân sách mốc đầy đủ và giải ngân nghiệm thu đúng hẹn.
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>

          {/* Section: Lĩnh vực sáng tạo quan tâm */}
          <Paper
            variant="outlined"
            sx={{
              p: { xs: 2.5, sm: 3.5 },
              borderRadius: "16px",
              borderColor: "#d0d5dd",
              bgcolor: "background.paper",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#fff4ee] text-[#bd3d14] border border-[#ffdecb]">
                <Sparkles size={16} strokeWidth={2.2} />
              </div>
              <Typography component="h2" sx={{ fontSize: 18, fontWeight: 800, color: "#20201f" }}>
                Lĩnh vực sáng tạo thường tuyển chọn
              </Typography>
            </Box>
            <Typography sx={{ fontSize: 13, color: "#747773", mb: 2 }}>
              Các chuyên môn Nắng Studio ưu tiên hợp tác và theo dõi portfolio thường xuyên trên FREVO:
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {[
                "Bộ nhận diện thương hiệu (Branding)",
                "Thiết kế bao bì sản phẩm (Packaging)",
                "Chụp ảnh sản phẩm & Lookbook",
                "Thiết kế ấn phẩm truyền thông số",
                "Minh họa thủ công & Hand-drawn Art",
                "Thiết kế POSM & Không gian trưng bày",
              ].map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  variant="outlined"
                  sx={{
                    borderRadius: "999px",
                    borderColor: "#d0d5dd",
                    color: "#20201f",
                    fontWeight: 600,
                    fontSize: 13,
                    bgcolor: "#fafaf8",
                    py: 2,
                    "&:hover": { borderColor: "primary.main", bgcolor: "#fff5f0" },
                  }}
                />
              ))}
            </Box>
          </Paper>

          {/* Section: Dự án của doanh nghiệp */}
          <Paper
            variant="outlined"
            sx={{
              p: { xs: 2.5, sm: 3.5 },
              borderRadius: "16px",
              borderColor: "#d0d5dd",
              bgcolor: "background.paper",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, mb: 2.5 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Typography component="h2" sx={{ fontSize: 18, fontWeight: 800, color: "#20201f" }}>
                  Dự án của doanh nghiệp
                </Typography>
                <Chip
                  label={`${activeProjects.length} dự án`}
                  size="small"
                  sx={{ height: 22, bgcolor: "#fff4ee", color: "#bd3d14", fontWeight: 700, fontSize: 11.5, border: "1px solid #ffd5c4" }}
                />
              </Box>
              <Button
                component={Link}
                to="/business/projects"
                size="small"
                endIcon={<ArrowRight size={14} />}
                sx={{ color: "text.secondary", fontSize: 13, "&:hover": { color: "primary.dark" } }}
              >
                Tất cả dự án
              </Button>
            </Box>

            {activeProjects.length ? (
              <Stack spacing={2}>
                {activeProjects.map((project) => (
                  <Box
                    key={project.id}
                    component={Link}
                    to={`/business/projects/${project.id}`}
                    sx={{
                      display: "block",
                      textDecoration: "none",
                      p: 2.5,
                      borderRadius: "14px",
                      border: "1px solid #e4e7ec",
                      bgcolor: "#ffffff",
                      transition: "all 0.15s ease",
                      "&:hover": {
                        borderColor: "primary.main",
                        boxShadow: "0 4px 14px rgba(16,24,40,0.06)",
                        transform: "translateY(-1px)",
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2, mb: 1 }}>
                      <Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
                          <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#20201f" }}>
                            {project.title}
                          </Typography>
                          <Chip
                            label={project.status === "published" ? "Đang tuyển" : "Đang thực hiện"}
                            size="small"
                            sx={{
                              height: 22,
                              fontSize: 11,
                              fontWeight: 700,
                              bgcolor: project.status === "published" ? "#e8f7ef" : "#eff8ff",
                              color: project.status === "published" ? "#16805b" : "#175cd3",
                              border: project.status === "published" ? "1px solid #b7ebcf" : "1px solid #b2ddff",
                            }}
                          />
                        </Box>
                        <Typography sx={{ fontSize: 13, color: "#747773" }}>
                          Ngân sách: <strong className="text-[#20201f]">{project.budget || "Thỏa thuận"}</strong> · Hạn hoàn thành: <strong className="text-[#20201f]">{project.deadline || "Chưa đặt"}</strong>
                        </Typography>
                      </Box>
                      <ArrowUpRight size={18} className="text-[#747773] shrink-0 mt-0.5" />
                    </Box>
                  </Box>
                ))}
              </Stack>
            ) : (
              <Box sx={{ textAlign: "center", py: 5, border: "1px dashed #d0d5dd", borderRadius: "12px", bgcolor: "#fafaf8" }}>
                <Typography sx={{ fontSize: 14, color: "#747773" }}>Chưa có dự án nào đang hoạt động.</Typography>
                <Button component={Link} to="/business/projects/new" variant="contained" sx={{ mt: 1.5 }}>
                  Đăng dự án đầu tiên
                </Button>
              </Box>
            )}
          </Paper>
        </Stack>

        {/* RIGHT COLUMN: CONTACT, CRITERIA & TRUST */}
        <Stack spacing={3} sx={{ minWidth: 0 }}>
          {/* Card: Thông tin liên hệ & Pháp nhân */}
          <Paper
            variant="outlined"
            sx={{
              p: { xs: 2.5, sm: 3 },
              borderRadius: "16px",
              borderColor: "#d0d5dd",
              bgcolor: "background.paper",
            }}
          >
            <Typography component="h2" sx={{ fontSize: 17, fontWeight: 800, color: "#20201f", mb: 2 }}>
              Thông tin liên hệ &amp; Trụ sở
            </Typography>

            <Box component="dl" sx={{ m: 0, display: "grid", gap: 2 }}>
              <Box>
                <Typography component="dt" sx={{ fontSize: 11.5, fontWeight: 700, color: "#747773", textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Người đại diện doanh nghiệp
                </Typography>
                <Typography component="dd" sx={{ m: 0, mt: 0.5, fontSize: 15, fontWeight: 700, color: "#20201f" }}>
                  {user.name || "Thuận Nguyễn"}
                </Typography>
                <Typography variant="caption" sx={{ color: "#747773" }}>
                  Founder &amp; Quản lý điều hành
                </Typography>
              </Box>

              <Box>
                <Typography component="dt" sx={{ fontSize: 11.5, fontWeight: 700, color: "#747773", textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Email liên hệ nhận hồ sơ
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 0.5 }}>
                  <Typography component="dd" sx={{ m: 0, fontSize: 14.5, fontWeight: 600, color: "#20201f" }}>
                    {user.contactEmail || user.email || "contact@nangstudio.vn"}
                  </Typography>
                  <Button size="small" onClick={copyEmail} sx={{ fontSize: 11, minHeight: 28, px: 1.5, bgcolor: "#f2f3f0", color: "#62665f" }}>
                    {copied ? "Đã chép" : "Sao chép"}
                  </Button>
                </Box>
              </Box>

              <Box>
                <Typography component="dt" sx={{ fontSize: 11.5, fontWeight: 700, color: "#747773", textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Số điện thoại
                </Typography>
                <Typography component="dd" sx={{ m: 0, mt: 0.5, fontSize: 14.5, fontWeight: 600, color: "#20201f" }}>
                  {user.phone || "0908 123 456"}
                </Typography>
              </Box>

              <Box>
                <Typography component="dt" sx={{ fontSize: 11.5, fontWeight: 700, color: "#747773", textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Địa chỉ văn phòng / Trụ sở
                </Typography>
                <Typography component="dd" sx={{ m: 0, mt: 0.5, fontSize: 14.5, fontWeight: 600, color: "#20201f" }}>
                  {user.address || "Quận 1, TP. Hồ Chí Minh"}
                </Typography>
              </Box>

              <Box>
                <Typography component="dt" sx={{ fontSize: 11.5, fontWeight: 700, color: "#747773", textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Thời gian làm việc
                </Typography>
                <Typography component="dd" sx={{ m: 0, mt: 0.5, fontSize: 14, color: "#62665f" }}>
                  Thứ Hai – Thứ Sáu (08:30 – 17:30)
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Card: Tiêu chí tuyển chọn cộng sự */}
          <Paper
            variant="outlined"
            sx={{
              p: { xs: 2.5, sm: 3 },
              borderRadius: "16px",
              borderColor: "#d0d5dd",
              bgcolor: "background.paper",
            }}
          >
            <Typography component="h2" sx={{ fontSize: 17, fontWeight: 800, color: "#20201f", mb: 1.5 }}>
              Tiêu chí tìm cộng sự
            </Typography>
            <Stack spacing={1.5} sx={{ fontSize: 13, color: "#62665f" }}>
              <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                <CheckCircle2 size={16} className="text-[#16805b] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#20201f]">Hình thức hợp tác:</strong> Cả Cá nhân (Freelancer) và Nhóm thiết kế (Team) đều được chào đón.
                </div>
              </Box>
              <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                <CheckCircle2 size={16} className="text-[#16805b] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#20201f]">Minh chứng năng lực:</strong> Ưu tiên ứng viên có dự án thực tế đính kèm trong thư ứng tuyển.
                </div>
              </Box>
              <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                <CheckCircle2 size={16} className="text-[#16805b] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#20201f]">Giao tiếp minh bạch:</strong> Trao đổi thẳng thắn qua hệ thống tin nhắn FREVO trước khi ký thỏa thuận.
                </div>
              </Box>
            </Stack>
          </Paper>

          {/* Card: Cam kết uy tín */}
          <Paper
            variant="outlined"
            sx={{
              p: { xs: 2.5, sm: 3 },
              borderRadius: "16px",
              borderColor: "#ffd4c3",
              bgcolor: "#fffaf7",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <ShieldCheck size={18} className="text-[#bd3d14]" />
              <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#bd3d14" }}>
                Cam kết từ Nắng Studio
              </Typography>
            </Box>
            <Typography sx={{ fontSize: 13, color: "#747773", lineHeight: 1.6 }}>
              Mọi dự án công bố đều có ngân sách thực và ký quỹ bảo chứng qua FREVO. Quyền tác giả và file gốc luôn được tôn trọng theo thỏa thuận.
            </Typography>
          </Paper>

          {/* Quick link to Settings */}
          <Paper
            variant="outlined"
            sx={{
              p: 2.5,
              borderRadius: "16px",
              borderColor: "#e4e7ec",
              bgcolor: "#fafaf8",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Box>
              <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#20201f" }}>
                Cài đặt tài khoản
              </Typography>
              <Typography sx={{ fontSize: 12, color: "#747773", mt: 0.25 }}>
                Đổi mật khẩu, email đăng nhập &amp; thông báo
              </Typography>
            </Box>
            <Button
              component={Link}
              to="/business/settings"
              size="small"
              variant="outlined"
              sx={{ borderColor: "#d0d5dd", color: "#20201f", whiteSpace: "nowrap" }}
            >
              Vào cài đặt
            </Button>
          </Paper>
        </Stack>
      </Box>

      {/* 4. EDIT PROFILE DIALOG (Opens right on profile page!) */}
      <EditBusinessProfileDialog open={editing} onClose={() => setEditing(false)} account={account} />

      {/* 5. SUCCESS SNACKBAR */}
      <Snackbar open={Boolean(account.feedback)} autoHideDuration={3000} onClose={() => account.setFeedback("")}>
        <Alert severity="success" onClose={() => account.setFeedback("")}>
          {account.feedback || "Đã lưu hồ sơ doanh nghiệp."}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default BusinessProfilePage;
