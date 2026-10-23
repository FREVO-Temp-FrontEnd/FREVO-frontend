import { useState } from "react";
import { Link } from "react-router";
import { Dialog, DialogContent, DialogTitle, IconButton, Box, Typography, Button } from "@mui/material";
import {
  ArrowRight,
  Bookmark,
  CalendarDays,
  Camera,
  CircleCheck,
  Clock3,
  Hourglass,
  MapPin,
  Monitor,
  RotateCcw,
  Send,
  Share2,
  Store,
  Wallet,
  X,
} from "lucide-react";
import type { Project } from "@/lib/types/project.types";
import { formatBudget } from "@/lib/util/formatters";
import { ProjectDetailBody } from "./ProjectDetailBody";
import { ProjectDetailSidebar } from "./ProjectDetailSidebar";

export function ProjectDetailContent({
  project,
  projects,
  applied,
  saved,
  onApply,
  onSave,
}: {
  project: Project;
  projects: Project[];
  applied: boolean;
  saved: boolean;
  onApply: (id: string) => void;
  onSave: (id: string) => void;
}) {
  const [notice, setNotice] = useState("");
  const [preview, setPreview] = useState<"brief" | "image" | "company" | null>(null);
  const details = project.details;
  const related = projects
    .filter((item) => item.id !== project.id)
    .sort((a, b) => Number(b.type === project.type) - Number(a.type === project.type))
    .slice(0, 2);

  async function share() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setNotice("Đã sao chép liên kết dự án.");
    } catch {
      setNotice("Không thể sao chép tự động. Bạn có thể sao chép địa chỉ trang trên trình duyệt.");
    }
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "minmax(0, 2fr) minmax(280px, 1fr)" },
        gap: { xs: "18px", sm: "24px" },
        alignItems: "start",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: "18px", sm: "24px" }, minWidth: 0 }}>
        {/* Summary Card */}
        <Box
          component="section"
          aria-labelledby="detail-title"
          sx={{
            bgcolor: "#fff",
            borderRadius: "16px",
            p: { xs: "22px 18px", sm: "32px" },
            border: "2px solid", borderColor: "text.secondary",
            background: "radial-gradient(ellipse at 100% 0, rgba(255, 240, 233, 0.67), transparent 55%), #fff",
          }}
        >
          {/* Kicker */}
          <Box sx={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", fontSize: 11 }}>
            <Box
              component="span"
              sx={{
                bgcolor: "#303031",
                color: "#fff",
                borderRadius: "30px",
                px: "12px",
                py: "4px",
                textTransform: "uppercase",
                fontWeight: 650,
                letterSpacing: "0.4px",
                fontSize: 11,
              }}
            >
              {project.category}
            </Box>
            <Box
              component="span"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                bgcolor: "#e0f1e9",
                color: "#006947",
                px: "10px",
                py: "4px",
                borderRadius: "30px",
                fontWeight: 600,
                fontSize: 11,
                "&:before": {
                  content: "''",
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  bgcolor: "#00855b",
                },
              }}
            >
              Đang nhận ứng tuyển
            </Box>
            {applied && (
              <Box
                component="span"
                sx={{ display: "inline-flex", alignItems: "center", gap: "6px", px: "10px", py: "4px", borderRadius: "30px", bgcolor: "#e9f5ee", color: "#236747", fontSize: 11, fontWeight: 700 }}
              >
                <CircleCheck size={14} aria-hidden="true" /> Đã ứng tuyển
              </Box>
            )}
            <Box
              component="span"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                ml: { xs: 0, sm: "auto" },
                color: "#806b63",
                fontSize: 11,
              }}
            >
              <Clock3 size={14} /> Đăng {project.age} ngày trước · Cập nhật gần đây
            </Box>
          </Box>

          {/* Title */}
          <Typography
            id="detail-title"
            tabIndex={-1}
            component="h1"
            sx={{
              fontSize: { xs: 27, sm: 34 },
              lineHeight: 1.24,
              letterSpacing: { xs: "-0.6px", sm: "-1px" },
              fontWeight: 850,
              my: { xs: "16px", sm: "22px" },
              color: "#1b1c1c",
            }}
          >
            {project.title}
            <Typography component="span" sx={{ color: "#ab2e00", fontWeight: 850, fontSize: "inherit" }}>
              .
            </Typography>
          </Typography>

          {/* Company details */}
          <Box
            sx={{
              display: "flex",
              gap: "6px 12px",
              flexWrap: "wrap",
              color: "#79685f",
              fontSize: 12,
              alignItems: "center",
            }}
          >
            <Typography
              component="strong"
              sx={{
                color: "#1b1c1c",
                fontSize: 12,
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                fontWeight: 700,
              }}
            >
              <Store size={15} color="#ab2e00" />
              {project.company}
            </Typography>
            <span>·</span>
            <Typography component="span" sx={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: 12 }}>
              <MapPin size={15} />
              {project.city}
            </Typography>
            <span>·</span>
            <Typography component="span" sx={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: 12 }}>
              <CalendarDays size={15} />
              Hạn chót: {project.deadline}
            </Typography>
          </Box>

          {/* Metrics */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(3, minmax(0, 1fr))" },
              gap: { xs: "8px", sm: "12px" },
              my: { xs: "22px", sm: "26px" },
            }}
          >
            {/* Metric 1 */}
            <Box
              sx={{
                bgcolor: "#f5f3f3",
                borderRadius: { xs: "22px", sm: "48px" },
                display: "flex",
                alignItems: "center",
                gap: "10px",
                p: { xs: "12px 16px", sm: "15px 12px" },
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  placeItems: "center",
                  width: 38,
                  height: 38,
                  flexShrink: 0,
                  borderRadius: "50%",
                  bgcolor: "#f8e4db",
                  color: "#ab2e00",
                }}
              >
                <Wallet size={20} />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  component="span"
                  sx={{
                    display: "block",
                    fontSize: 9,
                    lineHeight: 1.35,
                    textTransform: "uppercase",
                    letterSpacing: "0.4px",
                    color: "#6e554b",
                  }}
                >
                  Ngân sách dự kiến
                </Typography>
                <Typography component="strong" sx={{ display: "block", fontSize: 13, mt: "4px", color: "#ab2e00", fontWeight: 700 }}>
                  {formatBudget(project)}
                </Typography>
              </Box>
            </Box>

            {/* Metric 2 */}
            <Box
              sx={{
                bgcolor: "#f5f3f3",
                borderRadius: { xs: "22px", sm: "48px" },
                display: "flex",
                alignItems: "center",
                gap: "10px",
                p: { xs: "12px 16px", sm: "15px 12px" },
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  placeItems: "center",
                  width: 38,
                  height: 38,
                  flexShrink: 0,
                  borderRadius: "50%",
                  bgcolor: "#ece0db",
                  color: "#4c4542",
                }}
              >
                <Monitor size={20} />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  component="span"
                  sx={{
                    display: "block",
                    fontSize: 9,
                    lineHeight: 1.35,
                    textTransform: "uppercase",
                    letterSpacing: "0.4px",
                    color: "#6e554b",
                  }}
                >
                  Hình thức cộng tác
                </Typography>
                <Typography component="strong" sx={{ display: "block", fontSize: 13, mt: "4px", color: "#1b1c1c", fontWeight: 700 }}>
                  {project.remote ? "Làm việc từ xa" : "Làm việc tại chỗ"}
                </Typography>
              </Box>
            </Box>

            {/* Metric 3 */}
            <Box
              sx={{
                bgcolor: "#f5f3f3",
                borderRadius: { xs: "22px", sm: "48px" },
                display: "flex",
                alignItems: "center",
                gap: "10px",
                p: { xs: "12px 16px", sm: "15px 12px" },
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  placeItems: "center",
                  width: 38,
                  height: 38,
                  flexShrink: 0,
                  borderRadius: "50%",
                  bgcolor: "#ece0db",
                  color: "#4c4542",
                }}
              >
                <Hourglass size={20} />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  component="span"
                  sx={{
                    display: "block",
                    fontSize: 9,
                    lineHeight: 1.35,
                    textTransform: "uppercase",
                    letterSpacing: "0.4px",
                    color: "#6e554b",
                  }}
                >
                  Thời lượng thực hiện
                </Typography>
                <Typography component="strong" sx={{ display: "block", fontSize: 13, mt: "4px", color: "#1b1c1c", fontWeight: 700 }}>
                  {project.duration} dự kiến
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <Button
              onClick={() => onApply(project.id)}
              sx={{
                bgcolor: applied ? "#fff" : "#bd3d14",
                color: applied ? "#bd3d14" : "#fff",
                border: "1px solid #bd3d14",
                borderRadius: "999px",
                minHeight: 46,
                px: "20px",
                fontSize: "12px !important",
                fontWeight: "700 !important",
                textTransform: "none",
                boxShadow: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                "&:hover": { bgcolor: applied ? "#fff0e9" : "#9f310f", borderColor: applied ? "#bd3d14" : "#9f310f" },
              }}
            >
              {applied ? <RotateCcw size={18} aria-hidden="true" /> : <Send size={18} aria-hidden="true" />}
              {applied ? "Ứng tuyển lại" : "Ứng tuyển dự án này"}
            </Button>

            <Button
              aria-pressed={saved}
              onClick={() => onSave(project.id)}
              sx={{
                bgcolor: "#fff",
                color: saved ? "#ab2e00" : "#1b1c1c",
                borderRadius: "999px",
                minHeight: 46,
                px: "20px",
                fontSize: "12px !important",
                fontWeight: "700 !important",
                textTransform: "none",
                boxShadow: "0 1px 4px rgba(48, 32, 26, 0.04)",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                "&:hover": { bgcolor: "#f3eeeb" },
              }}
            >
              <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
              {saved ? "Đã lưu dự án" : "Lưu dự án"}
            </Button>

            <IconButton
              aria-label="Chia sẻ bài tuyển"
              onClick={share}
              sx={{
                width: 46,
                height: 46,
                borderRadius: "999px",
                bgcolor: "#fff",
                color: "#1b1c1c",
                boxShadow: "0 1px 4px rgba(48, 32, 26, 0.04)",
                "&:hover": { bgcolor: "#f3eeeb" },
              }}
            >
              <Share2 size={18} />
            </IconButton>
          </Box>

          {notice && (
            <Typography role="status" sx={{ fontSize: 12, color: "#ab2e00", mt: "14px !important" }}>
              {notice}
            </Typography>
          )}
        </Box>

        {/* Hero Banner */}
        {details?.heroImage && (
          <Box
            component="figure"
            sx={{
              height: 176,
              position: "relative",
              borderRadius: "16px",
              overflow: "hidden",
              bgcolor: "#e9e8e7",
              m: 0,
            }}
          >
            <Box
              component="img"
              src={details.heroImage}
              alt={details.heroAlt}
              sx={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
            />
            <Box
              component="figcaption"
              sx={{
                position: "absolute",
                inset: 0,
                p: { xs: "18px", sm: "24px" },
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                gap: "12px",
                color: "#fff",
                background: "linear-gradient(0deg, rgba(33, 26, 22, 0.79), transparent 90%)",
              }}
            >
              <Box>
                <Typography component="small" sx={{ fontSize: 10, letterSpacing: "0.8px", color: "#ffdbd1", display: "block" }}>
                  BỐI CẢNH DỰ ÁN
                </Typography>
                <Typography component="strong" sx={{ fontSize: { xs: 13, sm: 14 }, fontWeight: 700, display: "block" }}>
                  {details.heroCaption}
                </Typography>
              </Box>
              <Box
                component="span"
                sx={{
                  display: { xs: "none", sm: "flex" },
                  alignItems: "center",
                  gap: "5px",
                  fontSize: 10,
                  px: "10px",
                  py: "4px",
                  bgcolor: "rgba(255, 255, 255, 0.19)",
                  borderRadius: "30px",
                  whiteSpace: "nowrap",
                }}
              >
                <Camera size={14} /> Concept ảnh thực tế
              </Box>
            </Box>
          </Box>
        )}

        {/* Editorial Body */}
        <ProjectDetailBody project={project} details={details} onPreview={setPreview} />

        {/* Related Projects */}
        {related.length > 0 && (
          <Box component="section" sx={{ pt: "8px" }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "14px", mb: "20px" }}>
              <Box>
                <Typography component="h2" sx={{ fontSize: { xs: 20, sm: 21 }, fontWeight: 750, color: "#1b1c1c", lineHeight: 1.4 }}>
                  Dự án tương tự có thể bạn quan tâm
                </Typography>
                <Typography sx={{ fontSize: 12, color: "#806b63", mt: "6px" }}>
                  Khám phá thêm cơ hội cộng tác trên FREVO
                </Typography>
              </Box>
              <Link
                to="/"
                style={{
                  display: "flex",
                  gap: 6,
                  alignItems: "center",
                  color: "#ab2e00",
                  fontSize: 12,
                  whiteSpace: "nowrap",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Xem tất cả <ArrowRight size={16} />
              </Link>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: "16px",
              }}
            >
              {related.map((item) => (
                <Box
                  component={Link}
                  key={item.id}
                  to={`/projects/${encodeURIComponent(item.id)}/details`}
                  sx={{
                    bgcolor: "#fff",
                    borderRadius: "16px",
                    p: { xs: "22px 18px", sm: "24px" },
                    border: "2px solid", borderColor: "text.secondary",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    textDecoration: "none",
                    color: "inherit",
                    transition: "box-shadow 0.15s ease",
                    "&:hover": {
                      boxShadow: "0 4px 16px rgba(48, 32, 26, 0.07)",
                    },
                  }}
                >
                  <Box
                    component="small"
                    sx={{
                      alignSelf: "flex-start",
                      fontSize: 10,
                      bgcolor: "#f5f3f3",
                      px: "10px",
                      py: "3px",
                      borderRadius: "30px",
                      color: "#1b1c1c",
                      fontWeight: 600,
                    }}
                  >
                    {item.category}
                  </Box>
                  <Typography component="h3" sx={{ fontSize: 16, lineHeight: 1.5, fontWeight: 750, color: "#1b1c1c" }}>
                    {item.title}
                  </Typography>
                  <Typography sx={{ color: "#75655f", fontSize: 12 }}>
                    {item.company} · {item.city}
                  </Typography>
                  <Box
                    sx={{
                      mt: "auto",
                      borderTop: "1px solid #eee8e4",
                      pt: "14px",
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "8px",
                      alignItems: "center",
                    }}
                  >
                    <Typography component="strong" sx={{ color: "#ab2e00", fontWeight: 700, fontSize: 13 }}>
                      {formatBudget(item)}
                    </Typography>
                    <Typography
                      component="span"
                      sx={{ display: "flex", alignItems: "center", gap: "4px", fontSize: 11, color: "#1b1c1c", fontWeight: 600 }}
                    >
                      Chi tiết <ArrowRight size={15} />
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>

      {/* Sidebar */}
      <ProjectDetailSidebar project={project} details={details} onCompany={() => setPreview("company")} />

      {/* Preview Dialog */}
      <Dialog open={preview !== null} onClose={() => setPreview(null)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ pr: 7, fontWeight: 750 }}>
          {preview === "company"
            ? project.company
            : details?.documents.find((document) => document.kind === preview)?.title ?? "Tài liệu tham khảo"}
          <IconButton
            aria-label="Đóng xem trước"
            onClick={() => setPreview(null)}
            sx={{ position: "absolute", right: 12, top: 12 }}
          >
            <X />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {preview === "image" ? (
            <img
              src={details?.heroImage}
              alt={details?.heroAlt ?? "Ảnh tham khảo dự án"}
              style={{ width: "100%", borderRadius: 16 }}
            />
          ) : (
            <>
              {(details?.intro ?? [project.description]).map((text) => (
                <Typography key={text} sx={{ mb: 2, lineHeight: 1.7 }}>
                  {text}
                </Typography>
              ))}
              <Typography sx={{ fontStyle: "italic", color: "#806b63", fontSize: 12 }}>
                Nội dung doanh nghiệp minh họa trong prototype FREVO.
              </Typography>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
