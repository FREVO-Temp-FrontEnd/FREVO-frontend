import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import {
  Box,
  Typography,
  Breadcrumbs,
  Button as MuiButton,
} from "@mui/material";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Check,
  Eye,
  Heart,
  MessageSquare,
  Star,
  Users,
} from "lucide-react";
import { usePortfolio } from "@/lib/hooks/usePortfolio";
import type { Work } from "@/lib/types/portfolio.types";

const partnerReviews = [
  {
    id: "brand",
    name: "Đại diện thương hiệu",
    role: "Đối tác dự án Mộc Coffee",
    initials: "MC",
    rating: 5,
    text: "Minh Anh nắm bắt tinh thần thương hiệu rất tốt. Hệ thống nhận diện nhất quán, cách trình bày phương án rõ ràng và chủ động trao đổi trong suốt quá trình thực hiện.",
    criteria: ["Hiểu brief", "Chất lượng thiết kế", "Giao tiếp rõ ràng"],
  },
  {
    id: "marketing",
    name: "Đội ngũ Marketing",
    role: "Đối tác triển khai Mộc Coffee",
    initials: "MK",
    rating: 4,
    text: "Bộ file bàn giao được tổ chức dễ sử dụng, bao bì giữ được cảm giác mộc mạc như mong muốn. Các góp ý được tiếp nhận và điều chỉnh cẩn thận.",
    criteria: ["Bàn giao đầy đủ", "Tiếp nhận phản hồi"],
  },
];

function WorkImage({ work }: { work: Work }) {
  const [failed, setFailed] = useState(false);
  const cover = work.media.find((item) => item.kind === "image");
  return cover && !failed ? (
    <img
      src={cover.src}
      alt={work.title}
      onError={() => setFailed(true)}
      style={{
        width: "100%",
        height: "auto",
        maxHeight: "580px",
        objectFit: "contain",
        background: "var(--peach, #fff0e9)",
      }}
    />
  ) : (
    <Box
      sx={{
        display: "grid",
        placeItems: "center",
        minHeight: "260px",
        bgcolor: "var(--peach, #fff0e9)",
        fontFamily: "Archivo, Arial, sans-serif",
        fontSize: "44px",
        fontWeight: 800,
        overflowWrap: "anywhere",
        p: "30px",
      }}
    >
      {work.brand}
    </Box>
  );
}

export default function PortfolioDetailPage() {
  const { workId } = useParams();
  const { works } = usePortfolio();
  const work = works.find((item) => item.id === workId);
  const workTitle = work?.title;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    const previousTitle = document.title;
    document.title = workTitle
      ? `${workTitle} | FREVO Portfolio`
      : "Không tìm thấy dự án | FREVO";
    return () => {
      document.title = previousTitle;
    };
  }, [workId, workTitle]);

  const reviews = work?.id === "moc" ? partnerReviews : [];
  const cover = work?.media.find((item) => item.kind === "image");
  const gallery = work?.media.filter((item) => item.id !== cover?.id) ?? [];
  const related = works.filter((item) => item.id !== workId).slice(0, 2);

  return (
    <>
      {!work ? (
        <Box
          component="main"
          id="work-main"
          sx={{
            maxWidth: "800px",
            m: { xs: "35px auto", sm: "80px auto" },
            p: "24px",
            "& h1": {
              fontSize: { xs: "28px", sm: "36px" },
              fontWeight: 800,
              lineHeight: 1.2,
              "& > span": { color: "var(--orange, #f4490b)" },
            },
            "& p": { my: "20px", color: "#747773" },
          }}
        >
          <h1>
            Chưa tìm thấy tác phẩm này<span>.</span>
          </h1>
          <p>
            Dự án có thể đã bị xóa hoặc chỉ tồn tại trong bản xem thử trước khi
            tải lại.
          </p>
          <Link
            className="secondary-button"
            to="/profile?tab=portfolio"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <ArrowLeft size={16} /> Trở về Portfolio
          </Link>
        </Box>
      ) : (
        <Box
          component="main"
          id="work-main"
          sx={{
            maxWidth: "1280px",
            m: "auto",
            p: { xs: "22px 16px 40px", md: "24px", lg: "28px 32px 64px" },
          }}
        >
          <Breadcrumbs
            aria-label="Đường dẫn"
            sx={{
              fontSize: { xs: "11px", sm: "12px" },
              color: "#747773",
              mb: { xs: "24px", sm: "34px" },
              "& a": {
                display: "flex",
                alignItems: "center",
                gap: { xs: "8px", sm: "14px" },
                color: "var(--ink, #20201f)",
                textDecoration: "none",
                fontWeight: 500,
                "&:hover": { color: "var(--orange-dark, #bd3d14)" },
              },
            }}
          >
            <Link to="/profile?tab=portfolio">
              <ArrowLeft size={16} /> Portfolio của Minh Anh
            </Link>
            <Typography sx={{ fontSize: "inherit", color: "#747773" }}>
              Chi tiết dự án
            </Typography>
          </Breadcrumbs>

          <Box
            sx={{
              display: "flex",
              alignItems: { xs: "flex-start", sm: "center" },
              justifyContent: "space-between",
              gap: { xs: "18px", sm: "32px" },
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <Box sx={{ maxWidth: "810px" }}>
              <Typography
                component="span"
                sx={{
                  fontSize: "12px",
                  color: "var(--orange-dark, #bd3d14)",
                  fontWeight: 600,
                }}
              >
                {work.category}
              </Typography>
              <Typography
                component="h1"
                sx={{
                  fontFamily: "Archivo, Arial, sans-serif",
                  fontSize: { xs: "32px", sm: "clamp(30px, 3.5vw, 46px)" },
                  fontWeight: 900,
                  lineHeight: 1.12,
                  letterSpacing: "-.05em",
                  m: "12px 0 18px",
                  overflowWrap: "anywhere",
                  "& > span": { color: "var(--orange, #f4490b)" },
                }}
              >
                {work.title}
                <span>.</span>
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "20px",
                  color: "#656b63",
                  fontSize: "12px",
                  "& > span": {
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                  },
                }}
              >
                <span>
                  <CalendarDays size={15} /> Hoàn thành {work.date.slice(5)}/
                  {work.date.slice(0, 4)}
                </span>
                <span>
                  <Users size={15} />
                  {work.team}
                </span>
              </Box>
            </Box>
          </Box>

          <Typography
            sx={{
              fontSize: "11px",
              color: "#747773",
              m: "22px 0",
            }}
          >
            Hồ sơ minh họa · Thông tin và đánh giá trên trang là dữ liệu mẫu.
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "minmax(0, 1fr) 250px",
                lg: "minmax(0, 1fr) 290px",
              },
              gap: { xs: "24px", md: "22px", lg: "32px" },
              alignItems: "start",
            }}
          >
            {/* Main Column */}
            <Box sx={{ minWidth: 0, width: "100%" }}>
              <Box
                component="figure"
                sx={{
                  m: 0,
                  borderRadius: "var(--radius, 13px)",
                  overflow: "hidden",
                  bgcolor: "#fff",
                  border: "1px solid var(--line, #e4e6e2)",
                  "& figcaption": {
                    fontSize: { xs: "10px", sm: "11px" },
                    p: "12px 18px",
                    color: "#747773",
                  },
                }}
              >
                <WorkImage key={cover?.src ?? work.id} work={work} />
                <figcaption>{work.title}</figcaption>
              </Box>

              <Box
                component="nav"
                aria-label="Nội dung dự án"
                sx={{
                  display: "flex",
                  gap: { xs: "20px", sm: "24px" },
                  overflowX: "auto",
                  borderBottom: "1px solid var(--line, #e4e6e2)",
                  mt: "20px",
                  "& a": {
                    display: "flex",
                    gap: "7px",
                    alignItems: "center",
                    whiteSpace: "nowrap",
                    py: "17px",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#555d51",
                    textDecoration: "none",
                    "&:hover": { color: "var(--orange-dark, #bd3d14)" },
                    "& > span": {
                      p: "1px 6px",
                      borderRadius: "99px",
                      bgcolor: "var(--peach, #fff0e9)",
                      color: "var(--orange-dark, #bd3d14)",
                      fontSize: "10px",
                    },
                  },
                }}
              >
                <a href="#work-story">Tổng quan</a>
                <a href="#work-gallery">Hình ảnh & sản phẩm</a>
                <a href="#work-reviews">
                  Đánh giá đối tác <span>{reviews.length}</span>
                </a>
              </Box>

              {/* Story section */}
              <Box
                component="section"
                id="work-story"
                sx={{
                  py: "34px",
                  borderBottom: "1px solid var(--line, #e4e6e2)",
                  scrollMarginTop: "95px",
                  "& h2": {
                    fontSize: { xs: "24px", sm: "27px" },
                    lineHeight: 1.2,
                    letterSpacing: "-.04em",
                    fontWeight: 800,
                    fontFamily: "Archivo, Arial, sans-serif",
                    "& > span": { color: "var(--orange, #f4490b)" },
                  },
                  "& .work-section-kicker": {
                    display: "block",
                    color: "#747773",
                    fontSize: "11px",
                    mb: "10px",
                  },
                  "& > p": {
                    mt: "18px",
                    fontSize: "14px",
                    color: "#62695e",
                    lineHeight: 1.85,
                    whiteSpace: "pre-line",
                  },
                  "& h3": {
                    fontSize: "15px",
                    fontWeight: 700,
                    mb: "12px",
                    fontFamily: "Archivo, Arial, sans-serif",
                  },
                }}
              >
                <span className="work-section-kicker">Đằng sau tác phẩm</span>
                <h2>
                  Câu chuyện dự án<span>.</span>
                </h2>
                <p>{work.description}</p>
                <Box
                  sx={{
                    my: "26px",
                    p: "24px",
                    bgcolor: "var(--peach, #fff0e9)",
                    borderRadius: "0 var(--radius, 13px) var(--radius, 13px) 0",
                    borderLeft: "3px solid var(--orange, #f4490b)",
                    "& strong": {
                      fontSize: "12px",
                      color: "var(--orange-dark, #bd3d14)",
                    },
                    "& p": {
                      fontSize: "14px",
                      lineHeight: 1.8,
                      mt: "10px",
                      color: "#6c5143",
                      whiteSpace: "pre-line",
                    },
                  }}
                >
                  <h3>Vai trò & đóng góp</h3>
                  <strong>{work.role}</strong>
                  <p>{work.contribution}</p>
                </Box>
                <h3>Kỹ năng & công cụ sử dụng</h3>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                    "& > span": {
                      p: "6px 12px",
                      border: "1px solid var(--line, #e4e6e2)",
                      borderRadius: "99px",
                      bgcolor: "#fff",
                      fontSize: "11px",
                    },
                  }}
                >
                  {work.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </Box>
              </Box>

              {/* Gallery section */}
              <Box
                component="section"
                id="work-gallery"
                sx={{
                  py: "34px",
                  borderBottom: "1px solid var(--line, #e4e6e2)",
                  scrollMarginTop: "95px",
                  "& h2": {
                    fontSize: { xs: "24px", sm: "27px" },
                    lineHeight: 1.2,
                    letterSpacing: "-.04em",
                    fontWeight: 800,
                    fontFamily: "Archivo, Arial, sans-serif",
                    "& > span": { color: "var(--orange, #f4490b)" },
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: { xs: "flex-start", sm: "center" },
                    gap: "18px",
                    mb: "22px",
                    "& > span": {
                      fontSize: "11px",
                      color: "#747773",
                      flexShrink: 0,
                    },
                  }}
                >
                  <h2>
                    Hình ảnh & sản phẩm<span>.</span>
                  </h2>
                  <span>{work.media.length} tệp</span>
                </Box>
                {gallery.length ? (
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(2, minmax(0, 1fr))",
                      },
                      gap: { xs: "12px", sm: "18px" },
                      alignItems: "start",
                      "& figure": {
                        m: 0,
                        bgcolor: "#fff",
                        border: "1px solid var(--line, #e4e6e2)",
                        borderRadius: "var(--radius, 13px)",
                        overflow: "hidden",
                        "&:last-child:nth-child(odd)": {
                          gridColumn: { sm: "1 / -1" },
                        },
                      },
                      "& img, & video": {
                        display: "block",
                        width: "100%",
                        height: "auto",
                      },
                      "& figcaption": {
                        p: "12px 16px",
                        color: "#747773",
                        fontSize: "11px",
                      },
                    }}
                  >
                    {gallery.map((item, index) => (
                      <figure key={item.id}>
                        {item.kind === "image" ? (
                          <img src={item.src} alt={item.alt} loading="lazy" />
                        ) : (
                          <video src={item.src} controls preload="metadata" />
                        )}
                        <figcaption>
                          {item.kind === "image" ? "Hình ảnh" : "Video"} dự án ·{" "}
                          {index + 1}
                        </figcaption>
                      </figure>
                    ))}
                  </Box>
                ) : (
                  <Box
                    sx={{
                      p: "26px",
                      border: "1px dashed #cfd4cb",
                      borderRadius: "var(--radius, 13px)",
                      fontSize: "13px",
                      color: "#747773",
                      lineHeight: 1.8,
                    }}
                  >
                    Ảnh bìa phía trên là hình ảnh hiện có của dự án. Các sản phẩm
                    bổ sung sẽ hiển thị tại đây.
                  </Box>
                )}
              </Box>

              {/* Reviews section */}
              <Box
                component="section"
                id="work-reviews"
                sx={{
                  py: "34px",
                  borderBottom: "1px solid var(--line, #e4e6e2)",
                  scrollMarginTop: "95px",
                  "& h2": {
                    fontSize: { xs: "24px", sm: "27px" },
                    lineHeight: 1.2,
                    letterSpacing: "-.04em",
                    fontWeight: 800,
                    fontFamily: "Archivo, Arial, sans-serif",
                    "& > span": { color: "var(--orange, #f4490b)" },
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: { xs: "flex-start", sm: "center" },
                    gap: "18px",
                    mb: "22px",
                    "& .work-sample-badge": {
                      p: "4px 9px",
                      border: "1px solid var(--line, #e4e6e2)",
                      borderRadius: "99px",
                      bgcolor: "white",
                      fontSize: { xs: "9px !important", sm: "11px" },
                    },
                  }}
                >
                  <h2>
                    Đối tác nói gì<span>?</span>
                  </h2>
                  <span className="work-sample-badge">Đánh giá mẫu</span>
                </Box>
                <Typography sx={{ fontSize: "14px", color: "#62695e", mb: "20px" }}>
                  Góc nhìn từ phía đối tác sau quá trình hợp tác và bàn giao dự án.
                </Typography>
                {reviews.length ? (
                  <>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: { xs: "18px", sm: "24px" },
                        p: { xs: "20px", sm: "24px" },
                        bgcolor: "var(--peach, #fff0e9)",
                        borderRadius: "var(--radius, 13px)",
                        my: "24px",
                        "& strong": {
                          fontFamily: "Archivo, Arial, sans-serif",
                          fontSize: "44px",
                          fontWeight: 800,
                          letterSpacing: "-.05em",
                        },
                        "& > div:first-of-type": {
                          display: "flex",
                          alignItems: "baseline",
                          gap: "6px",
                          "& > span": { fontSize: "15px", color: "#747773" },
                        },
                      }}
                    >
                      <div>
                        <strong>
                          {(
                            reviews.reduce((sum, r) => sum + r.rating, 0) /
                            reviews.length
                          ).toFixed(1)}
                        </strong>
                        <span>/ 5</span>
                      </div>
                      <div>
                        <Box
                          sx={{
                            display: "flex",
                            gap: "4px",
                            color: "var(--orange-dark, #bd3d14)",
                          }}
                          aria-label="Điểm trung bình 4,5 trên 5"
                        >
                          <Star fill="currentColor" size={18} />
                          <Star fill="currentColor" size={18} />
                          <Star fill="currentColor" size={18} />
                          <Star fill="currentColor" size={18} />
                          <Star size={18} />
                        </Box>
                        <p style={{ fontSize: "11px", color: "#747773", marginTop: "7px" }}>
                          Từ {reviews.length} đánh giá minh họa
                        </p>
                      </div>
                    </Box>
                    <Box
                      sx={{
                        display: "grid",
                        gap: "16px",
                        "& .work-review": {
                          p: { xs: "18px", sm: "24px" },
                          border: "1px solid var(--line, #e4e6e2)",
                          borderRadius: "var(--radius, 13px)",
                          bgcolor: "white",
                          "& header": {
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            flexWrap: { xs: "wrap", sm: "nowrap" },
                            "& h3": {
                              fontSize: { xs: "12px", sm: "13px" },
                              m: 0,
                              fontFamily: "Archivo, Arial, sans-serif",
                            },
                            "& p": {
                              fontSize: "11px",
                              color: "#747773",
                              mt: "4px",
                            },
                          },
                          "& .work-review-avatar": {
                            display: "grid",
                            placeItems: "center",
                            width: "40px",
                            height: "40px",
                            bgcolor: "var(--bg, #f7f8f6)",
                            border: "1px solid var(--line, #e4e6e2)",
                            borderRadius: "50%",
                            fontSize: "11px",
                            fontWeight: 700,
                            flexShrink: 0,
                          },
                          "& .work-review-score": {
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            ml: "auto",
                            flexShrink: 0,
                            fontSize: "12px",
                            fontWeight: 700,
                            color: "var(--orange-dark, #bd3d14)",
                          },
                          "& blockquote": {
                            my: "20px",
                            fontSize: "14px",
                            lineHeight: 1.85,
                            color: "#50564d",
                          },
                          "& .work-review-tags": {
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "8px",
                            "& > span": {
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                              fontSize: "10px",
                              color: "#4b6550",
                              bgcolor: "#f0f5ef",
                              p: "4px 8px",
                              borderRadius: "99px",
                            },
                          },
                        },
                      }}
                    >
                      {reviews.map((review) => (
                        <article className="work-review" key={review.id}>
                          <header>
                            <span className="work-review-avatar">
                              {review.initials}
                            </span>
                            <div>
                              <h3>{review.name}</h3>
                              <p>{review.role}</p>
                            </div>
                            <span className="work-review-score">
                              <Star size={14} fill="currentColor" />{" "}
                              {review.rating}.0
                            </span>
                          </header>
                          <blockquote>{review.text}</blockquote>
                          <div className="work-review-tags">
                            {review.criteria.map((item) => (
                              <span key={item}>
                                <Check size={12} />
                                {item}
                              </span>
                            ))}
                          </div>
                        </article>
                      ))}
                    </Box>
                  </>
                ) : (
                  <Box
                    sx={{
                      p: "26px",
                      border: "1px dashed #cfd4cb",
                      borderRadius: "var(--radius, 13px)",
                      fontSize: "13px",
                      color: "#747773",
                      lineHeight: 1.8,
                      "& svg": {
                        color: "var(--orange-dark, #bd3d14)",
                        mb: "14px",
                      },
                      "& h3": {
                        color: "var(--ink, #20201f)",
                        fontFamily: "Archivo, Arial, sans-serif",
                      },
                    }}
                  >
                    <MessageSquare size={24} />
                    <h3>Chưa có đánh giá từ đối tác</h3>
                    <p>
                      Phản hồi của đối tác sau khi hoàn thành dự án sẽ được hiển
                      thị tại đây khi kết nối dữ liệu thật.
                    </p>
                  </Box>
                )}
                <Typography
                  sx={{
                    fontSize: "11px",
                    color: "#747773",
                    lineHeight: 1.7,
                    mt: "16px",
                  }}
                >
                  Nội dung minh họa cho giao diện, chưa phải phản hồi đã xác thực
                  từ khách hàng.
                </Typography>
              </Box>
            </Box>

            {/* Sidebar Column */}
            <Box
              component="aside"
              sx={{
                position: { xs: "static", md: "sticky" },
                top: "100px",
                display: "flex",
                flexDirection: "column",
                gap: "18px",
                width: "100%",
                ...( {
                  "@media(max-width:760px) and (min-width:481px)": {
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    alignItems: "start",
                  },
                }),
              }}
            >
              <Box
                component="section"
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "48px minmax(0, 1fr)", md: "48px minmax(0, 1fr)" },
                  gap: "13px",
                  p: { xs: "18px", md: "22px" },
                  bgcolor: "var(--peach, #fff0e9)",
                  border: "1px solid #efd8cb",
                  borderRadius: "var(--radius, 13px)",
                  "& .work-author-avatar": {
                    display: "grid",
                    placeItems: "center",
                    width: "48px",
                    height: "48px",
                    border: "1px solid var(--ink, #20201f)",
                    borderRadius: "50%",
                    bgcolor: "#fff",
                    fontSize: "14px",
                    fontWeight: 700,
                    boxShadow: "2px 2px 0 var(--ink, #20201f)",
                  },
                  "& span": { fontSize: "10px", color: "#747773" },
                  "& h2": {
                    fontSize: "22px",
                    letterSpacing: "-.04em",
                    fontWeight: 800,
                    my: "4px",
                    fontFamily: "Archivo, Arial, sans-serif",
                    "& > span": { color: "var(--orange, #f4490b)" },
                  },
                  "& p": { fontSize: "11px", color: "#6d5b51" },
                  "& > a": {
                    gridColumn: "1 / -1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderTop: "1px solid #efd8cb",
                    pt: "14px",
                    color: "var(--orange-dark, #bd3d14)",
                    fontSize: "12px",
                    fontWeight: 600,
                    textDecoration: "none",
                  },
                }}
              >
                <span className="work-author-avatar">MA</span>
                <div>
                  <span>Người thực hiện</span>
                  <h2>
                    Minh Anh<span>.</span>
                  </h2>
                  <p>Brand & Product Designer</p>
                </div>
                <Link to="/profile?tab=personal">
                  Xem hồ sơ <ArrowUpRight size={16} />
                </Link>
              </Box>

              <Box
                component="section"
                sx={{
                  p: "23px",
                  bgcolor: "#fff",
                  border: "1px solid var(--line, #e4e6e2)",
                  borderRadius: "var(--radius, 13px)",
                  "& h2": {
                    fontSize: "17px",
                    fontWeight: 800,
                    fontFamily: "Archivo, Arial, sans-serif",
                  },
                  "& dl": {
                    display: "grid",
                    gap: "20px",
                    my: "24px",
                  },
                  "& dt": {
                    fontSize: "11px",
                    color: "#747773",
                    mb: "5px",
                  },
                  "& dd": {
                    fontSize: "13px",
                    fontWeight: 500,
                    m: 0,
                    overflowWrap: "anywhere",
                  },
                  "& .work-engagement": {
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "15px",
                    pt: "18px",
                    borderTop: "1px solid var(--line, #e4e6e2)",
                    fontSize: "10px",
                    color: "#656b63",
                    "& span": {
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    },
                  },
                }}
              >
                <h2>Thông tin dự án</h2>
                <dl>
                  <div>
                    <dt>Lĩnh vực</dt>
                    <dd>{work.category}</dd>
                  </div>
                  <div>
                    <dt>Vai trò</dt>
                    <dd>{work.role}</dd>
                  </div>
                  <div>
                    <dt>Hình thức</dt>
                    <dd>
                      {work.team === "Cá nhân"
                        ? "Dự án cá nhân"
                        : "Hợp tác đội ngũ"}
                    </dd>
                  </div>
                  <div>
                    <dt>Đơn vị thực hiện</dt>
                    <dd>{work.team}</dd>
                  </div>
                  <div>
                    <dt>Hoàn thành</dt>
                    <dd>
                      Tháng {work.date.slice(5)} / {work.date.slice(0, 4)}
                    </dd>
                  </div>
                  <div>
                    <dt>Hiển thị (bản mẫu)</dt>
                    <dd>
                      {work.visibility === "private"
                        ? "Riêng tư"
                        : work.visibility === "link"
                        ? "Người có liên kết"
                        : "Công khai"}
                    </dd>
                  </div>
                </dl>
                <div className="work-engagement">
                  <span>
                    <Eye size={16} />
                    {work.views.toLocaleString("vi-VN")} lượt xem
                  </span>
                  <span>
                    <Heart size={16} />
                    {work.likes} yêu thích
                  </span>
                </div>
                {work.url && (
                  <MuiButton
                    component="a"
                    href={work.url}
                    target="_blank"
                    rel="noreferrer"
                    variant="contained"
                    color="primary"
                    endIcon={<ArrowUpRight size={16} />}
                    sx={{
                      width: "100%",
                      minHeight: "45px",
                      mt: "22px",
                      fontSize: "13px",
                    }}
                  >
                    Xem sản phẩm
                  </MuiButton>
                )}
              </Box>

              <Box
                sx={{
                  p: "12px",
                  color: "#747773",
                  fontSize: "12px",
                  lineHeight: 1.8,
                  display: { xs: "none", sm: "block" },
                  "& svg": {
                    mb: "10px",
                    color: "var(--orange-dark, #bd3d14)",
                  },
                }}
              >
                <MessageSquare size={21} />
                <p>
                  Mỗi dự án là một câu chuyện hợp tác. Những phản hồi giúp câu
                  chuyện ấy trọn vẹn hơn.
                </p>
              </Box>
            </Box>
          </Box>

          {related.length > 0 && (
            <Box
              component="section"
              sx={{
                mt: "44px",
                "& h2": {
                  fontSize: { xs: "24px", sm: "27px" },
                  lineHeight: 1.2,
                  letterSpacing: "-.04em",
                  fontWeight: 800,
                  fontFamily: "Archivo, Arial, sans-serif",
                  "& > span": { color: "var(--orange, #f4490b)" },
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: { xs: "flex-start", sm: "center" },
                  flexDirection: { xs: "column", sm: "row" },
                  gap: "18px",
                  mb: "22px",
                  "& a": {
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "12px",
                    color: "var(--orange-dark, #bd3d14)",
                    textDecoration: "none",
                    fontWeight: 600,
                  },
                }}
              >
                <h2>
                  Khám phá thêm từ Minh Anh<span>.</span>
                </h2>
                <Link to="/profile?tab=portfolio">
                  Tất cả tác phẩm <ArrowUpRight size={16} />
                </Link>
              </Box>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: "22px",
                  "& .work-related-card": {
                    display: "block",
                    border: "1px solid var(--line, #e4e6e2)",
                    borderRadius: "var(--radius, 13px)",
                    bgcolor: "#fff",
                    overflow: "hidden",
                    textDecoration: "none",
                    color: "inherit",
                    transition: "border-color .15s, box-shadow .15s",
                    "&:hover": {
                      borderColor: "var(--ink, #20201f)",
                      boxShadow: "3px 3px 0 var(--orange, #f4490b)",
                    },
                    "& > img": {
                      width: "100%",
                      aspectRatio: "2.2",
                      objectFit: "cover",
                    },
                    "& > div:last-child": {
                      position: "relative",
                      p: "18px 45px 20px 20px",
                      "& > span": { fontSize: "10px", color: "#747773" },
                      "& h3": {
                        fontSize: { xs: "15px", sm: "17px" },
                        fontWeight: 800,
                        lineHeight: 1.4,
                        mt: "5px",
                        fontFamily: "Archivo, Arial, sans-serif",
                      },
                      "& > svg": {
                        position: "absolute",
                        right: "18px",
                        top: "30px",
                      },
                    },
                  },
                }}
              >
                {related.map((item) => (
                  <Link
                    to={`/profile/portfolio/${item.id}`}
                    className="work-related-card"
                    key={item.id}
                  >
                    <WorkImage
                      key={item.media[0]?.src ?? item.id}
                      work={item}
                    />
                    <div>
                      <span>{item.category}</span>
                      <h3>{item.title}</h3>
                      <ArrowUpRight size={20} />
                    </div>
                  </Link>
                ))}
              </Box>
            </Box>
          )}
        </Box>
      )}
    </>
  );
}
