import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import {
  Box,
  Typography,
  Button as MuiButton,
} from "@mui/material";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Eye,
  FolderOpen,
  Heart,
  MapPin,
  Pencil,
  Plus,
  SlidersHorizontal,
  Sparkles,
  UserRound,
  Users,
  Wallet,
} from "lucide-react";
import { usePortfolio } from "@/lib/hooks/usePortfolio";
import type { Work } from "@/lib/types/portfolio.types";
import { EditProfileDialog, type EditRequest } from "../components/EditProfileDialog";
import { PortfolioEditor } from "../components/PortfolioEditor";
import { PortfolioCover } from "../components/PortfolioCover";

const tabs = [
  { id: "personal", label: "Thông tin cá nhân", icon: UserRound },
  { id: "portfolio", label: "Portfolio", icon: FolderOpen },
  { id: "experience", label: "Kinh nghiệm & Kỹ năng", icon: Sparkles },
  { id: "services", label: "Dịch vụ & Báo giá", icon: Wallet },
];

function splitTags(value: string) {
  return [...new Set(value.split(",").map((tag) => tag.trim()).filter(Boolean))];
}

export default function ProfilePage() {
  const [params] = useSearchParams();
  const activeTab = tabs.some((tab) => tab.id === params.get("tab"))
    ? params.get("tab")!
    : "portfolio";
  const { works, setWorks } = usePortfolio();
  const [sort, setSort] = useState("newest");
  const [portfolioEditor, setPortfolioEditor] = useState<{
    work: Work | null;
  } | null>(null);
  const [personal, setPersonal] = useState({
    name: "Minh Anh",
    specialty: "Brand & Product Designer",
    location: "TP. Hồ Chí Minh",
    working: "Freelance · Làm việc từ xa",
    availability: "Sẵn sàng hợp tác",
    bio: "Mình là designer tập trung vào nhận diện thương hiệu và sản phẩm số. Mình thích biến những bài toán phức tạp thành trải nghiệm trực quan, gần gũi và có cá tính.",
  });
  const [experiences, setExperiences] = useState([
    {
      id: "independent",
      period: "2023 — Hiện tại",
      title: "Independent Designer",
      description:
        "Thiết kế thương hiệu, bao bì và sản phẩm số cho doanh nghiệp vừa và nhỏ.",
    },
    {
      id: "studio",
      period: "2022 — 2023",
      title: "Designer · Collective Studio",
      description:
        "Phối hợp cùng đội ngũ sáng tạo phát triển hệ thống nhận diện và các điểm chạm thương hiệu.",
    },
  ]);
  const [skills, setSkills] = useState([
    "Brand Strategy",
    "Visual Identity",
    "UI/UX Design",
    "Typography",
    "Packaging",
    "Figma",
    "Adobe Illustrator",
    "Adobe Photoshop",
  ]);
  const [services, setServices] = useState([
    {
      id: "brand",
      title: "Nhận diện thương hiệu",
      price: "8000000",
      text: "Định hướng hình ảnh, thiết kế logo, bảng màu, typography và hướng dẫn sử dụng.",
    },
    {
      id: "ux",
      title: "Thiết kế UI/UX",
      price: "12000000",
      text: "Nghiên cứu trải nghiệm, wireframe, giao diện và prototype tương tác trên Figma.",
    },
    {
      id: "packaging",
      title: "Thiết kế bao bì",
      price: "5000000",
      text: "Ý tưởng bao bì, thiết kế nhãn và hoàn thiện file in cho sản phẩm.",
    },
  ]);
  const [editing, setEditing] = useState<EditRequest | null>(null);
  const initials = personal.name
    .split(/\s+/)
    .slice(-2)
    .map((word) => word[0])
    .join("")
    .toLocaleUpperCase("vi-VN");

  function editPersonal() {
    setEditing({
      title: "Chỉnh sửa thông tin cá nhân",
      fields: [
        { name: "name", label: "Họ và tên", value: personal.name, maxLength: 80 },
        { name: "specialty", label: "Chuyên môn", value: personal.specialty },
        { name: "location", label: "Địa điểm", value: personal.location },
        { name: "working", label: "Hình thức làm việc", value: personal.working },
        {
          name: "availability",
          label: "Trạng thái hợp tác",
          value: personal.availability,
        },
        {
          name: "bio",
          label: "Giới thiệu bản thân",
          value: personal.bio,
          type: "textarea",
        },
      ],
      onSave: (values) =>
        setPersonal({
          name: values.name,
          specialty: values.specialty,
          location: values.location,
          working: values.working,
          availability: values.availability,
          bio: values.bio,
        }),
    });
  }

  function editWork(work: Work) {
    setPortfolioEditor({ work });
  }

  const [notice, setNotice] = useState("");
  const sorted = [...works].sort((a, b) =>
    sort === "popular"
      ? b.views - a.views
      : b.date.localeCompare(a.date)
  );

  return (
    <>
      <a className="skip-link" href="#profile-content">
        Đến nội dung hồ sơ
      </a>
      <header className="site-header">
        <div className="header-left">
          <Link to="/" aria-label="FREVO — Khám phá dự án">
            <img className="logo" src="/assets/frevo-logo.png" alt="FREVO" />
          </Link>
          <span className="header-divider" />
          <span className="screen-name">Hồ sơ của tôi</span>
        </div>
        <Link
          to="/profile"
          className="account"
          aria-label={`Tài khoản của ${personal.name}`}
          aria-current="page"
        >
          <span className="account-copy">
            <strong>{personal.name}</strong>
            <small>Freelancer</small>
          </span>
          <span className="avatar grid place-items-center">{initials}</span>
        </Link>
      </header>

      <Box
        sx={{
          maxWidth: "1480px",
          margin: "auto",
          display: { xs: "block", md: "grid" },
          gridTemplateColumns: {
            md: "190px minmax(0, 1fr)",
            lg: "215px minmax(0, 1fr)",
          },
          gap: { md: "24px", lg: "32px" },
          p: { xs: "20px 16px 40px", md: "24px", lg: "28px 28px 60px" },
        }}
      >
        {/* Sidebar */}
        <Box
          component="aside"
          sx={{
            alignSelf: "start",
            position: { xs: "static", md: "sticky" },
            top: "104px",
          }}
        >
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "9px",
              color: "#5b605a",
              fontSize: "13px",
              textDecoration: "none",
              marginBottom: "24px",
            }}
          >
            <ArrowLeft size={16} /> Khám phá dự án
          </Link>

          <Box
            sx={{
              display: { xs: "none", md: "block" },
              py: "30px 26px",
              borderBottom: "1px solid var(--line, #e4e6e2)",
            }}
          >
            <Box
              sx={{
                position: "relative",
                display: "grid",
                placeItems: "center",
                width: "76px",
                height: "76px",
                border: "2px solid var(--ink, #20201f)",
                borderRadius: "50%",
                bgcolor: "var(--peach, #fff0e9)",
                fontSize: "25px",
                fontWeight: 700,
                boxShadow: "3px 3px 0 var(--ink, #20201f)",
                mb: "20px",
                "& > span": {
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: "17px",
                  height: "17px",
                  border: "3px solid var(--bg, #f7f8f6)",
                  borderRadius: "50%",
                  bgcolor: "#3c7650",
                },
              }}
            >
              {initials}
              <span />
            </Box>
            <Typography
              component="h2"
              sx={{
                fontSize: "28px",
                fontWeight: 900,
                letterSpacing: "-.045em",
                fontFamily: "Archivo, Arial, sans-serif",
                overflowWrap: "anywhere",
                "& > span": { color: "var(--orange, #f4490b)" },
              }}
            >
              {personal.name}
              <span>.</span>
            </Typography>
            <Typography
              sx={{
                fontSize: "13px",
                mt: "5px",
                color: "#5b605a",
                overflowWrap: "anywhere",
              }}
            >
              {personal.specialty}
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: "5px",
                alignItems: "center",
                fontSize: "12px",
                color: "#656b63",
                mt: "12px",
              }}
            >
              <MapPin size={14} /> {personal.location}
            </Box>
            <Box
              component="span"
              sx={{
                display: "inline-block",
                color: "#336447",
                bgcolor: "#eaf2e9",
                borderRadius: "99px",
                px: "10px",
                py: "5px",
                fontSize: "11px",
                mt: "16px",
                fontWeight: 600,
              }}
            >
              {personal.availability}
            </Box>
          </Box>

          <Box
            component="nav"
            aria-label="Các mục hồ sơ"
            sx={{
              display: { xs: "none", md: "grid" },
              gap: "6px",
              py: "22px 0",
              "& a": {
                display: "flex",
                alignItems: "center",
                gap: "10px",
                borderRadius: "9px",
                p: "12px 10px",
                fontSize: "13px",
                color: "#5b605a",
                textDecoration: "none",
                "&[aria-current=page]": {
                  bgcolor: "var(--peach, #fff0e9)",
                  color: "var(--orange-dark, #bd3d14)",
                  fontWeight: 700,
                },
                "&:hover": {
                  bgcolor: "var(--peach, #fff0e9)",
                },
                "& > span": {
                  ml: "auto",
                  fontSize: "11px",
                },
              },
            }}
          >
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                to={`/profile?tab=${tab.id}`}
                aria-current={activeTab === tab.id ? "page" : undefined}
              >
                <tab.icon size={18} />
                {tab.label}
                {tab.id === "portfolio" && <span>{works.length}</span>}
              </Link>
            ))}
          </Box>

          <Box
            sx={{
              display: { xs: "none", md: "block" },
              mt: "28px",
              p: "22px 18px",
              bgcolor: "var(--peach, #fff0e9)",
              borderRadius: "var(--radius, 13px)",
              "& > svg": { color: "var(--orange-dark, #bd3d14)" },
              "& h3": {
                mt: "12px",
                fontSize: "16px",
                fontWeight: 800,
                fontFamily: "Archivo, Arial, sans-serif",
              },
              "& p": {
                mt: "9px",
                fontSize: "12px",
                lineHeight: 1.65,
                color: "#72635b",
              },
            }}
          >
            <Sparkles size={22} />
            <h3>Để tác phẩm lên tiếng.</h3>
            <p>
              Chia sẻ những dự án thể hiện rõ nhất cá tính và cách bạn sáng tạo.
            </p>
          </Box>
        </Box>

        {/* Main Content */}
        <Box component="main" id="profile-content" sx={{ minWidth: 0 }}>
          <Box
            component="nav"
            aria-label="Điều hướng hồ sơ"
            sx={{
              display: "flex",
              gap: { xs: "22px", sm: "20px", lg: "24px" },
              borderBottom: "1px solid var(--line, #e4e6e2)",
              overflowX: "auto",
              "& a": {
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                whiteSpace: "nowrap",
                p: { xs: "8px 0 15px", sm: "8px 0 19px" },
                color: "#5b605a",
                fontSize: { xs: "12px", sm: "11px", lg: "12px" },
                fontWeight: 500,
                textDecoration: "none",
                "&[aria-current=page]": {
                  color: "var(--orange-dark, #bd3d14)",
                  fontWeight: 700,
                  "&:after": {
                    content: "''",
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "3px",
                    bgcolor: "var(--orange, #f4490b)",
                  },
                },
                "& > span": {
                  bgcolor: "var(--peach, #fff0e9)",
                  px: "6px",
                  borderRadius: "20px",
                  fontSize: "10px",
                },
                "& svg": {
                  display: { xs: "block", sm: "none", md: "block" },
                },
              },
            }}
          >
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                to={`/profile?tab=${tab.id}`}
                aria-current={activeTab === tab.id ? "page" : undefined}
              >
                <tab.icon size={16} />
                {tab.label}
                {tab.id === "portfolio" && <span>{works.length}</span>}
              </Link>
            ))}
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: "10px",
              fontSize: "11px",
              color: "#686d65",
              m: { xs: "24px 0 12px", sm: "28px 0 12px" },
              "& > span": { color: "#a1a59e" },
            }}
          >
            Hồ sơ <span>/</span> {tabs.find((tab) => tab.id === activeTab)?.label}
          </Box>

          {activeTab === "portfolio" ? (
            <>
              <Box
                sx={{
                  display: "flex",
                  alignItems: { xs: "flex-start", sm: "center" },
                  justifyContent: "space-between",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: "20px",
                  mb: "28px",
                  "& h1": {
                    fontSize: { xs: "30px", sm: "36px" },
                    fontWeight: 900,
                    lineHeight: 1.12,
                    letterSpacing: "-.047em",
                    fontFamily: "Archivo, Arial, sans-serif",
                    "& > span": { color: "var(--orange, #f4490b)" },
                  },
                  "& p": {
                    fontSize: "14px",
                    color: "#686d65",
                    mt: "12px",
                    maxWidth: "570px",
                    lineHeight: 1.65,
                  },
                }}
              >
                <div>
                  <h1>
                    Portfolio của tôi<span>.</span>
                  </h1>
                  <p>
                    Trưng bày những dự án nổi bật, chia sẻ vai trò và dấu ấn sáng
                    tạo của bạn.
                  </p>
                </div>
                <MuiButton
                  variant="contained"
                  onClick={() => setPortfolioEditor({ work: null })}
                  sx={{
                    width: { xs: "100%", sm: "auto" },
                    flexShrink: 0,
                    minHeight: "45px",
                    px: "20px",
                    borderRadius: "999px",
                    bgcolor: "var(--orange, #f4490b)",
                    color: "#1b1b19",
                    fontSize: "13px",
                    fontWeight: 900,
                    textTransform: "none",
                    boxShadow: "2px 3px 0 #242521",
                    border: "2px solid #262724",
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                    "&:hover": {
                      bgcolor: "#ff5b1c",
                      boxShadow: "2px 3px 0 #242521",
                    },
                  }}
                >
                  <Plus size={17} /> Thêm dự án mới
                </MuiButton>
              </Box>

              {/* Stats */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "repeat(3, minmax(0, 1fr))" },
                  gap: { xs: "8px", sm: "16px", md: "18px" },
                  mb: "30px",
                  "& > div": {
                    position: "relative",
                    p: { xs: "14px 10px", sm: "16px", md: "20px" },
                    bgcolor: "var(--card, #fff)",
                    border: "1px solid var(--line, #e4e6e2)",
                    borderRadius: "var(--radius, 13px)",
                    "& span": {
                      display: "block",
                      fontSize: { xs: "10px", sm: "12px" },
                      color: "#686d65",
                    },
                    "& strong": {
                      display: "block",
                      fontFamily: "Archivo, Arial, sans-serif",
                      fontWeight: 800,
                      fontSize: { xs: "16px", sm: "18px", md: "23px" },
                      letterSpacing: "-.03em",
                      mt: "6px",
                    },
                    "& svg": {
                      position: "absolute",
                      right: "17px",
                      top: "28px",
                      boxSizing: "content-box",
                      width: "18px",
                      height: "18px",
                      p: "11px",
                      borderRadius: "50%",
                      bgcolor: "var(--peach, #fff0e9)",
                      color: "var(--orange-dark, #bd3d14)",
                      display: { xs: "none", sm: "none", md: "block" },
                    },
                  },
                }}
              >
                <div>
                  <span>Tổng dự án</span>
                  <strong>{works.length} tác phẩm</strong>
                  <FolderOpen />
                </div>
                <div>
                  <span>Lượt tiếp cận</span>
                  <strong>
                    {new Intl.NumberFormat("vi-VN").format(
                      works.reduce((n, w) => n + w.views, 0)
                    )}
                  </strong>
                  <Eye />
                </div>
                <div>
                  <span>Lượt yêu thích</span>
                  <strong>
                    {works.reduce((n, w) => n + w.likes, 0)} lượt
                  </strong>
                  <Heart />
                </div>
              </Box>

              {/* Toolbar */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: "17px",
                  fontSize: "13px",
                  "& p > strong": {
                    color: "#686d65",
                    fontWeight: 400,
                    ml: "5px",
                  },
                  "& label": {
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    bgcolor: "white",
                    p: "9px 13px",
                    border: "1px solid var(--line, #e4e6e2)",
                    borderRadius: "999px",
                    "& select": {
                      bgcolor: "transparent",
                      border: "none",
                      fontSize: "12px",
                      maxWidth: "145px",
                      outline: "none",
                    },
                  },
                }}
              >
                <p>
                  Bộ sưu tập <strong>({works.length})</strong>
                </p>
                <label>
                  <SlidersHorizontal size={15} />
                  <span className="sr-only">Sắp xếp dự án</span>
                  <select
                    value={sort}
                    onChange={(event) => setSort(event.target.value)}
                  >
                    <option value="newest">Mới nhất</option>
                    <option value="popular">Xem nhiều nhất</option>
                  </select>
                </label>
              </Box>

              {/* Portfolio Grid */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, minmax(0, 1fr))",
                    lg: "repeat(3, minmax(0, 1fr))",
                  },
                  gap: { xs: "14px", md: "20px" },
                }}
              >
                {sorted.map((work) => (
                  <Box
                    component="article"
                    className="portfolio-card"
                    key={work.id}
                    sx={{
                      overflow: "hidden",
                      border: "1px solid var(--line, #e4e6e2)",
                      borderRadius: "var(--radius, 13px)",
                      bgcolor: "#fff",
                      transition: "border-color .15s, box-shadow .15s",
                      display: "flex",
                      flexDirection: "column",
                      "&:hover, &:focus-within": {
                        borderColor: "var(--ink, #20201f)",
                        boxShadow: "4px 4px 0 var(--orange, #f4490b)",
                      },
                    }}
                  >
                    <Link
                      to={`/profile/portfolio/${work.id}`}
                      aria-label={`Xem ${work.title}`}
                      style={{
                        display: "block",
                        width: "100%",
                        height: "auto",
                        flex: 1,
                        textAlign: "left",
                        background: "transparent",
                        textDecoration: "none",
                        color: "inherit",
                      }}
                    >
                      <Box sx={{ position: "relative" }}>
                        <PortfolioCover
                          key={
                            work.media.find((item) => item.kind === "image")
                              ?.src ?? work.id
                          }
                          work={work}
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            top: "12px",
                            left: "12px",
                            right: "12px",
                            display: "flex",
                            justifyContent: "space-between",
                            gap: "4px",
                            "& > span": {
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                              bgcolor: "rgba(255, 255, 255, 0.85)",
                              borderRadius: "20px",
                              p: "4px 8px",
                              fontSize: { xs: "9px", sm: "10px" },
                              "&:last-child": {
                                bgcolor: "var(--peach, #fff0e9)",
                                color: "#75402b",
                              },
                            },
                          }}
                        >
                          <span>Năm {work.date.slice(0, 4)}</span>
                          <span>
                            {work.team === "Cá nhân" ? (
                              <UserRound size={11} />
                            ) : (
                              <Users size={11} />
                            )}
                            {work.team}
                          </span>
                        </Box>
                      </Box>

                      <Box
                        sx={{
                          p: { xs: "14px 12px", sm: "17px 16px 13px", lg: "20px" },
                          "& h2": {
                            fontSize: { xs: "14px", sm: "16px", lg: "17px" },
                            fontWeight: 800,
                            lineHeight: 1.4,
                            letterSpacing: "-.02em",
                            minHeight: { xs: "40px", sm: "45px" },
                            fontFamily: "Archivo, Arial, sans-serif",
                            overflowWrap: "anywhere",
                          },
                          "& .portfolio-contribution": {
                            p: "10px 11px",
                            bgcolor: "var(--peach, #fff0e9)",
                            color: "#754a38",
                            borderRadius: "8px",
                            lineHeight: 1.65,
                            fontSize: "11px",
                            fontStyle: "italic",
                            minHeight: "74px",
                            my: "12px",
                            "& strong": {
                              color: "var(--ink, #20201f)",
                              fontStyle: "normal",
                              fontWeight: 600,
                            },
                            "& span": { color: "var(--orange-dark, #bd3d14)" },
                          },
                          "& .portfolio-tags": {
                            display: "flex",
                            gap: "5px",
                            flexWrap: "wrap",
                            "& > span": {
                              p: "3px 7px",
                              border: "1px solid transparent",
                              bgcolor: "var(--bg, #f7f8f6)",
                              borderRadius: "99px",
                              fontSize: "9px",
                              color: "#596054",
                            },
                          },
                          "& .portfolio-card-footer": {
                            borderTop: "1px solid var(--line, #e4e6e2)",
                            pt: "13px",
                            mt: "19px",
                            display: "flex",
                            justifyContent: "space-between",
                            gap: "6px",
                            color: "#646a60",
                            fontSize: "10px",
                            "& > span:first-of-type": {
                              display: "flex",
                              alignItems: "center",
                              gap: "5px",
                              "& svg:nth-of-type(2)": { ml: "6px" },
                            },
                          },
                        }}
                      >
                        <h2>{work.title}</h2>
                        <p className="portfolio-contribution">
                          <span>Vai trò:</span> <strong>{work.role}</strong> ·{" "}
                          <span>Đóng góp:</span> {work.contribution}
                        </p>
                        <div className="portfolio-tags">
                          {work.tags.map((tag) => (
                            <span key={tag}>{tag}</span>
                          ))}
                        </div>
                        <div className="portfolio-card-footer">
                          <span>
                            <Eye size={13} />
                            {new Intl.NumberFormat("vi-VN", {
                              notation: "compact",
                            }).format(work.views)}
                            <Heart size={13} />
                            {work.likes}
                          </span>
                          <span>
                            Hoàn thành: {work.date.slice(5)}/
                            {work.date.slice(0, 4)}
                          </span>
                        </div>
                      </Box>
                    </Link>

                    <Box
                      sx={{
                        p: { xs: "0 14px 14px", sm: "0 16px 16px" },
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "8px",
                      }}
                    >
                      <Typography
                        component="span"
                        sx={{ fontSize: "10px", color: "#656b63" }}
                      >
                        {work.visibility === "private"
                          ? "Riêng tư"
                          : work.visibility === "link"
                          ? "Có liên kết"
                          : "Công khai"}
                      </Typography>
                      <MuiButton
                        variant="outlined"
                        aria-label={`Chỉnh sửa ${work.title}`}
                        onClick={() => editWork(work)}
                        sx={{
                          minHeight: "32px",
                          p: "0 10px",
                          fontSize: "11px",
                          gap: "7px",
                          whiteSpace: "normal",
                          borderRadius: "999px",
                          borderColor: "var(--line, #e4e6e2)",
                          color: "#333631",
                          fontWeight: 800,
                          textTransform: "none",
                          "&:hover": {
                            borderColor: "#d5d7d2",
                            bgcolor: "#f7f8f6",
                          },
                        }}
                      >
                        <Pencil size={14} /> Chỉnh sửa
                      </MuiButton>
                    </Box>
                  </Box>
                ))}

                <Box
                  component="button"
                  onClick={() => setPortfolioEditor({ work: null })}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "14px",
                    p: "30px 20px",
                    minHeight: { xs: "240px", sm: "300px", md: "380px" },
                    border: "1px dashed #dba48f",
                    borderRadius: "var(--radius, 13px)",
                    bgcolor: "#fff6f1",
                    color: "var(--orange-dark, #bd3d14)",
                    textAlign: "center",
                    cursor: "pointer",
                    transition: "border-color .15s, background .15s",
                    "&:hover": {
                      borderColor: "var(--orange, #f4490b)",
                      bgcolor: "var(--peach, #fff0e9)",
                    },
                    "& > span": {
                      display: "grid",
                      placeItems: "center",
                      width: "52px",
                      height: "52px",
                      bgcolor: "#fff",
                      border: "1px solid #f1d4c6",
                      borderRadius: "50%",
                    },
                    "& strong": { fontSize: "15px" },
                    "& p": { fontSize: "12px", color: "#806c61", m: 0 },
                  }}
                >
                  <span>
                    <Plus size={24} />
                  </span>
                  <strong>Dự án tiếp theo của bạn</strong>
                  <p>Thêm một dấu ấn mới vào portfolio.</p>
                </Box>
              </Box>
            </>
          ) : activeTab === "personal" ? (
            <>
              <Box
                sx={{
                  display: "flex",
                  alignItems: { xs: "flex-start", sm: "center" },
                  justifyContent: "space-between",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: "20px",
                  mb: "28px",
                  "& h1": {
                    fontSize: { xs: "30px", sm: "36px" },
                    fontWeight: 900,
                    lineHeight: 1.12,
                    letterSpacing: "-.047em",
                    fontFamily: "Archivo, Arial, sans-serif",
                    "& > span": { color: "var(--orange, #f4490b)" },
                  },
                  "& p": {
                    fontSize: "14px",
                    color: "#686d65",
                    mt: "12px",
                  },
                }}
              >
                <div>
                  <h1>
                    Một chút về tôi<span>.</span>
                  </h1>
                  <p>Con người đứng sau những ý tưởng.</p>
                </div>
                <MuiButton
                  variant="outlined"
                  onClick={editPersonal}
                  sx={{
                    minHeight: "42px",
                    px: "18px",
                    borderRadius: "999px",
                    borderColor: "var(--line, #e4e6e2)",
                    color: "#333631",
                    fontSize: "12px",
                    fontWeight: 800,
                    textTransform: "none",
                    gap: "7px",
                    "&:hover": {
                      borderColor: "#d5d7d2",
                      bgcolor: "#f7f8f6",
                    },
                  }}
                >
                  <Pencil size={15} /> Chỉnh sửa thông tin
                </MuiButton>
              </Box>

              <Box
                component="section"
                sx={{
                  p: { xs: "22px", sm: "28px" },
                  border: "1px solid var(--line, #e4e6e2)",
                  bgcolor: "var(--card, #fff)",
                  borderRadius: "var(--radius, 13px)",
                  "& h2": {
                    fontSize: "22px",
                    fontWeight: 800,
                    letterSpacing: "-.03em",
                    mb: "16px",
                    fontFamily: "Archivo, Arial, sans-serif",
                    overflowWrap: "anywhere",
                  },
                  "& > p": {
                    fontSize: "15px",
                    lineHeight: 1.8,
                    color: "#5b605a",
                    maxWidth: "680px",
                    whiteSpace: "pre-line",
                    overflowWrap: "anywhere",
                  },
                  "& .profile-facts": {
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    gap: "26px",
                    mt: "30px",
                    pt: "26px",
                    borderTop: "1px solid var(--line, #e4e6e2)",
                    "& dt": {
                      fontSize: "12px",
                      color: "#747773",
                      mb: "6px",
                    },
                    "& dd": {
                      m: 0,
                      fontSize: "15px",
                      fontWeight: 600,
                      overflowWrap: "anywhere",
                    },
                  },
                }}
              >
                <h2>Xin chào, mình là {personal.name}.</h2>
                <p>{personal.bio}</p>
                <dl className="profile-facts">
                  <div>
                    <dt>Họ và tên</dt>
                    <dd>{personal.name}</dd>
                  </div>
                  <div>
                    <dt>Chuyên môn</dt>
                    <dd>{personal.specialty}</dd>
                  </div>
                  <div>
                    <dt>Địa điểm</dt>
                    <dd>{personal.location}</dd>
                  </div>
                  <div>
                    <dt>Hình thức làm việc</dt>
                    <dd>{personal.working}</dd>
                  </div>
                </dl>
              </Box>
            </>
          ) : activeTab === "experience" ? (
            <>
              <Box
                sx={{
                  display: "flex",
                  alignItems: { xs: "flex-start", sm: "center" },
                  justifyContent: "space-between",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: "20px",
                  mb: "28px",
                  "& h1": {
                    fontSize: { xs: "30px", sm: "36px" },
                    fontWeight: 900,
                    lineHeight: 1.12,
                    letterSpacing: "-.047em",
                    fontFamily: "Archivo, Arial, sans-serif",
                    "& > span": { color: "var(--orange, #f4490b)" },
                  },
                  "& p": {
                    fontSize: "14px",
                    color: "#686d65",
                    mt: "12px",
                  },
                }}
              >
                <div>
                  <h1>
                    Kinh nghiệm & kỹ năng<span>.</span>
                  </h1>
                  <p>Hành trình sáng tạo và những điều mình làm tốt.</p>
                </div>
              </Box>

              <Box
                component="section"
                sx={{
                  p: { xs: "22px", sm: "28px" },
                  border: "1px solid var(--line, #e4e6e2)",
                  bgcolor: "var(--card, #fff)",
                  borderRadius: "var(--radius, 13px)",
                  "& h2": {
                    fontSize: "22px",
                    fontWeight: 800,
                    letterSpacing: "-.03em",
                    mb: "16px",
                    fontFamily: "Archivo, Arial, sans-serif",
                  },
                  "& .profile-experience": {
                    display: "flex",
                    gap: "16px",
                    my: "28px 35px",
                    "& > svg": {
                      flexShrink: 0,
                      color: "var(--orange-dark, #bd3d14)",
                    },
                    "& span": { fontSize: "12px", color: "#747773" },
                    "& h3": {
                      fontSize: "17px",
                      fontWeight: 700,
                      my: "8px 0",
                      fontFamily: "Archivo, Arial, sans-serif",
                    },
                    "& p": {
                      fontSize: "14px",
                      color: "#5b605a",
                      maxWidth: "600px",
                      whiteSpace: "pre-line",
                    },
                  },
                }}
              >
                <h2>Kinh nghiệm làm việc</h2>
                {experiences.map((experience) => (
                  <div className="profile-experience" key={experience.id}>
                    <BriefcaseBusiness />
                    <div>
                      <span>{experience.period}</span>
                      <h3>{experience.title}</h3>
                      <p>{experience.description}</p>
                      <MuiButton
                        variant="outlined"
                        aria-label={`Chỉnh sửa kinh nghiệm ${experience.title}`}
                        onClick={() =>
                          setEditing({
                            title: "Chỉnh sửa kinh nghiệm",
                            fields: [
                              {
                                name: "period",
                                label: "Thời gian",
                                value: experience.period,
                              },
                              {
                                name: "title",
                                label: "Vị trí & đơn vị",
                                value: experience.title,
                              },
                              {
                                name: "description",
                                label: "Mô tả công việc",
                                value: experience.description,
                                type: "textarea",
                              },
                            ],
                            onSave: (values) =>
                              setExperiences((previous) =>
                                previous.map((item) =>
                                  item.id === experience.id
                                    ? {
                                        ...item,
                                        period: values.period,
                                        title: values.title,
                                        description: values.description,
                                      }
                                    : item
                                )
                              ),
                          })
                        }
                        sx={{
                          mt: "18px",
                          minHeight: "36px",
                          px: "14px",
                          borderRadius: "999px",
                          borderColor: "var(--line, #e4e6e2)",
                          color: "#333631",
                          fontSize: "12px",
                          fontWeight: 800,
                          textTransform: "none",
                          gap: "7px",
                          "&:hover": {
                            borderColor: "#d5d7d2",
                            bgcolor: "#f7f8f6",
                          },
                        }}
                      >
                        <Pencil size={14} /> Chỉnh sửa
                      </MuiButton>
                    </div>
                  </div>
                ))}

                <Box
                  sx={{
                    display: "flex",
                    alignItems: { xs: "flex-start", sm: "center" },
                    justifyContent: "space-between",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: "16px",
                    mb: "18px",
                    "& h2": { m: 0 },
                  }}
                >
                  <h2>Kỹ năng & công cụ</h2>
                  <MuiButton
                    variant="outlined"
                    onClick={() =>
                      setEditing({
                        title: "Chỉnh sửa kỹ năng & công cụ",
                        fields: [
                          {
                            name: "skills",
                            label: "Kỹ năng (phân cách bằng dấu phẩy)",
                            value: skills.join(", "),
                            type: "textarea",
                          },
                        ],
                        onSave: (values) => setSkills(splitTags(values.skills)),
                      })
                    }
                    sx={{
                      minHeight: "36px",
                      px: "14px",
                      borderRadius: "999px",
                      borderColor: "var(--line, #e4e6e2)",
                      color: "#333631",
                      fontSize: "12px",
                      fontWeight: 800,
                      textTransform: "none",
                      gap: "7px",
                      "&:hover": {
                        borderColor: "#d5d7d2",
                        bgcolor: "#f7f8f6",
                      },
                    }}
                  >
                    <Pencil size={14} /> Chỉnh sửa kỹ năng
                  </MuiButton>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "10px",
                    "& span": {
                      fontSize: "13px",
                      p: "8px 13px",
                      border: "1px solid var(--line, #e4e6e2)",
                      borderRadius: "99px",
                    },
                  }}
                >
                  {skills.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </Box>
              </Box>
            </>
          ) : (
            <>
              <Box
                sx={{
                  display: "flex",
                  alignItems: { xs: "flex-start", sm: "center" },
                  justifyContent: "space-between",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: "20px",
                  mb: "28px",
                  "& h1": {
                    fontSize: { xs: "30px", sm: "36px" },
                    fontWeight: 900,
                    lineHeight: 1.12,
                    letterSpacing: "-.047em",
                    fontFamily: "Archivo, Arial, sans-serif",
                    "& > span": { color: "var(--orange, #f4490b)" },
                  },
                  "& p": {
                    fontSize: "14px",
                    color: "#686d65",
                    mt: "12px",
                  },
                }}
              >
                <div>
                  <h1>
                    Dịch vụ & báo giá<span>.</span>
                  </h1>
                  <p>Chọn cách chúng ta có thể cùng tạo nên điều hay.</p>
                </div>
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" },
                  gap: "18px",
                }}
              >
                {services.map((service) => (
                  <Box
                    key={service.id}
                    component="section"
                    sx={{
                      p: "24px",
                      display: "flex",
                      flexDirection: "column",
                      border: "1px solid var(--line, #e4e6e2)",
                      bgcolor: "var(--card, #fff)",
                      borderRadius: "var(--radius, 13px)",
                      "& svg": { color: "var(--orange-dark, #bd3d14)" },
                      "& h2": {
                        fontSize: "20px",
                        mt: "20px",
                        fontFamily: "Archivo, Arial, sans-serif",
                      },
                      "& p": {
                        fontSize: "14px",
                        mb: "28px",
                        color: "#5b605a",
                      },
                      "& .profile-price": {
                        fontSize: "18px",
                        mt: "auto",
                      },
                      "& .profile-price-note": {
                        fontSize: "11px",
                        color: "#747773",
                        mt: "8px",
                      },
                    }}
                  >
                    <Wallet size={24} />
                    <h2>{service.title}</h2>
                    <p>{service.text}</p>
                    <strong className="profile-price">
                      Từ{" "}
                      {new Intl.NumberFormat("vi-VN").format(
                        Number(service.price)
                      )}{" "}
                      đ
                    </strong>
                    <span className="profile-price-note">
                      Báo giá tham khảo · Tùy phạm vi dự án
                    </span>
                    <MuiButton
                      variant="outlined"
                      aria-label={`Chỉnh sửa dịch vụ ${service.title}`}
                      onClick={() =>
                        setEditing({
                          title: "Chỉnh sửa dịch vụ & báo giá",
                          fields: [
                            {
                              name: "title",
                              label: "Tên dịch vụ",
                              value: service.title,
                            },
                            {
                              name: "text",
                              label: "Mô tả dịch vụ",
                              value: service.text,
                              type: "textarea",
                            },
                            {
                              name: "price",
                              label: "Giá khởi điểm (đ)",
                              value: service.price,
                              type: "number",
                            },
                          ],
                          onSave: (values) =>
                            setServices((previous) =>
                              previous.map((item) =>
                                item.id === service.id
                                  ? {
                                      ...item,
                                      title: values.title,
                                      text: values.text,
                                      price: values.price,
                                    }
                                  : item
                              )
                            ),
                        })
                      }
                      sx={{
                        mt: "18px",
                        alignSelf: "flex-start",
                        minHeight: "36px",
                        px: "14px",
                        borderRadius: "999px",
                        borderColor: "var(--line, #e4e6e2)",
                        color: "#333631",
                        fontSize: "12px",
                        fontWeight: 800,
                        textTransform: "none",
                        gap: "7px",
                        "&:hover": {
                          borderColor: "#d5d7d2",
                          bgcolor: "#f7f8f6",
                        },
                      }}
                    >
                      <Pencil size={14} /> Chỉnh sửa dịch vụ
                    </MuiButton>
                  </Box>
                ))}
              </Box>
            </>
          )}

          <Typography
            sx={{
              mt: "30px",
              fontSize: "11px",
              color: "#747773",
            }}
          >
            Hồ sơ mẫu để xem trước giao diện. Thông tin, tác phẩm và số liệu chưa
            kết nối với tài khoản thật.
          </Typography>
          <Typography
            role="status"
            sx={{
              fontSize: "13px",
              color: "#336447",
              mt: "10px",
            }}
          >
            {notice}
          </Typography>
        </Box>
      </Box>

      {editing && (
        <EditProfileDialog
          request={editing}
          onClose={() => setEditing(null)}
          onSaved={() =>
            setNotice(
              "Đã cập nhật bản xem thử. Thay đổi sẽ mất khi rời trang hoặc tải lại."
            )
          }
        />
      )}

      {portfolioEditor && (
        <PortfolioEditor
          work={portfolioEditor.work}
          onClose={() => setPortfolioEditor(null)}
          onSave={(work) => {
            setWorks((previous) =>
              previous.some((item) => item.id === work.id)
                ? previous.map((item) => (item.id === work.id ? work : item))
                : [work, ...previous]
            );
            setPortfolioEditor(null);
            setNotice(
              "Đã cập nhật portfolio trong bản xem thử. Thay đổi sẽ mất khi tải lại ứng dụng."
            );
          }}
          onDelete={(id) => {
            setWorks((previous) => previous.filter((item) => item.id !== id));
            setPortfolioEditor(null);
            setNotice("Đã xóa dự án khỏi bản xem thử.");
          }}
        />
      )}
    </>
  );
}
