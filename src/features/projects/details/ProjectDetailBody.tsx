import { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { Check, CheckCircle2, FileText, Image, ShieldCheck } from "lucide-react";
import type { Project, ProjectDetails } from "@/lib/types/project.types";

const sections = [
  ["overview", "Tổng quan"],
  ["brief", "Brief dự án"],
  ["scope", "Phạm vi công việc"],
  ["requirements", "Yêu cầu"],
  ["deliverables", "Bàn giao"],
  ["benefits", "Quyền lợi"],
  ["documents", "Tài liệu"],
];

export function ProjectDetailBody({
  project,
  details,
  onPreview,
}: {
  project: Project;
  details?: ProjectDetails;
  onPreview: (view: "brief" | "image") => void;
}) {
  const [activeSection, setActiveSection] = useState("overview");
  const deliverables =
    details?.deliverables ??
    project.deliverables.map((title) => ({ title, text: "" }));

  return (
    <Box
      component="article"
      sx={{
        bgcolor: "#fff",
        borderRadius: "16px",
        p: { xs: "22px 18px", sm: "32px" },
        border: "2px solid",
        borderColor: "text.secondary",
        "& > section": {
          mt: "20px",
          p: { xs: "20px 16px", sm: "24px" },
          bgcolor: "background.default",
          border: "2px solid",
          borderColor: "text.secondary",
          borderRadius: "13px",
        },
      }}
    >
      {/* Tabs */}
      <Box
        component="nav"
        aria-label="Nội dung dự án"
        sx={{
          display: "flex",
          gap: "8px",
          overflowX: "auto",
          pb: "8px",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {sections
          .filter(([id]) => details || !["benefits", "documents"].includes(id))
          .map(([id, label]) => {
            const isSelected = activeSection === id;
            return (
              <Box
                component="a"
                key={id}
                href={`#${id}`}
                aria-current={isSelected ? "location" : undefined}
                onClick={() => setActiveSection(id)}
                sx={{
                  whiteSpace: "nowrap",
                  bgcolor: isSelected ? "#ffdbd1" : "#f5f3f3",
                  color: isSelected ? "#862200" : "#1b1c1c",
                  px: "13px",
                  py: "8px",
                  borderRadius: "999px",
                  fontSize: 11,
                  fontWeight: 600,
                  textDecoration: "none",
                  transition: "all 0.15s ease",
                  "&:hover": {
                    bgcolor: isSelected ? "#ffdbd1" : "#ece0db",
                  },
                }}
              >
                {label}
              </Box>
            );
          })}
      </Box>

      {/* 1. Overview */}
      <Box
        component="section"
        id="overview"
        sx={{
          py: "30px",
          borderBottom: "1px solid #e9e6e3",
          scrollMarginTop: "110px",
        }}
      >
        <Typography
          component="h2"
          sx={{
            fontSize: { xs: 19, sm: 22 },
            fontWeight: 750,
            lineHeight: 1.4,
            mb: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "#1b1c1c",
            "&:before": {
              content: "''",
              width: 9,
              height: 9,
              flexShrink: 0,
              bgcolor: "#ab2e00",
              borderRadius: "2px",
            },
          }}
        >
          Tổng quan tiêu chí
        </Typography>

        <Box
          sx={{
            bgcolor: "#f8f6f5",
            borderRadius: "28px",
            p: "22px",
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: "20px",
          }}
        >
          <Box>
            <Typography
              component="h3"
              sx={{
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                color: "#6e554b",
                mb: "8px",
                fontWeight: 700,
              }}
            >
              Chuyên môn cần có
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {(details?.expertise ?? project.skills).map((skill) => (
                <Box
                  component="span"
                  key={skill}
                  sx={{
                    fontSize: 11,
                    bgcolor: "#fff",
                    borderRadius: "30px",
                    px: "10px",
                    py: "4px",
                    color: "#1b1c1c",
                  }}
                >
                  {skill}
                </Box>
              ))}
            </Box>
          </Box>

          <Box>
            <Typography
              component="h3"
              sx={{
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                color: "#6e554b",
                mb: "8px",
                fontWeight: 700,
              }}
            >
              {details ? "Công cụ chính" : "Hình thức cộng tác"}
            </Typography>
            {details ? (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {details.tools.map((tool) => (
                  <Box
                    component="span"
                    key={tool}
                    sx={{
                      fontSize: 11,
                      bgcolor: "#fff",
                      borderRadius: "30px",
                      px: "10px",
                      py: "4px",
                      color: "#1b1c1c",
                    }}
                  >
                    {tool}
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography sx={{ fontSize: 12, lineHeight: 1.7, color: "#1b1c1c" }}>
                {project.remote ? "Làm việc từ xa" : "Làm việc tại chỗ"} · {project.city}
              </Typography>
            )}
          </Box>

          <Box>
            <Typography
              component="h3"
              sx={{
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                color: "#6e554b",
                mb: "8px",
                fontWeight: 700,
              }}
            >
              Kinh nghiệm {details ? "tối thiểu" : "phù hợp"}
            </Typography>
            <Typography sx={{ fontSize: 12, lineHeight: 1.7, color: "#1b1c1c" }}>
              {details?.experience ?? `Có portfolio thể hiện năng lực ${project.category}.`}
            </Typography>
          </Box>

          <Box>
            <Typography
              component="h3"
              sx={{
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                color: "#6e554b",
                mb: "8px",
                fontWeight: 700,
              }}
            >
              Đối tượng phù hợp
            </Typography>
            <Typography sx={{ fontSize: 12, lineHeight: 1.7, color: "#1b1c1c" }}>
              {details?.audience ?? "Freelancer hoặc studio phù hợp với dự án."}</Typography>
          </Box>
        </Box>
      </Box>

      {/* 2. Brief */}
      <Box
        component="section"
        id="brief"
        sx={{
          py: "30px",
          borderBottom: "1px solid #e9e6e3",
          scrollMarginTop: "110px",
        }}
      >
        <Typography
          component="h2"
          sx={{
            fontSize: { xs: 19, sm: 22 },
            fontWeight: 750,
            lineHeight: 1.4,
            mb: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "#1b1c1c",
            "&:before": {
              content: "''",
              width: 9,
              height: 9,
              flexShrink: 0,
              bgcolor: "#ab2e00",
              borderRadius: "2px",
            },
          }}
        >
          Giới thiệu dự án &amp; Tinh thần cốt lõi
        </Typography>
        {(details?.intro ?? [project.description]).map((text) => (
          <Typography
            key={text}
            sx={{
              fontSize: 15,
              color: "#655d59",
              lineHeight: 1.85,
              mb: "14px",
            }}
          >
            {text}
          </Typography>
        ))}
      </Box>

      {/* 3. Scope */}
      <Box
        component="section"
        id="scope"
        sx={{
          py: "30px",
          borderBottom: "1px solid #e9e6e3",
          scrollMarginTop: "110px",
        }}
      >
        <Typography
          component="h2"
          sx={{
            fontSize: { xs: 19, sm: 22 },
            fontWeight: 750,
            lineHeight: 1.4,
            mb: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "#1b1c1c",
            "&:before": {
              content: "''",
              width: 9,
              height: 9,
              flexShrink: 0,
              bgcolor: "#ab2e00",
              borderRadius: "2px",
            },
          }}
        >
          Phạm vi công việc
        </Typography>
        <Box
          component="ol"
          sx={{
            listStyle: "none",
            p: 0,
            m: 0,
            display: "flex",
            flexDirection: "column",
            gap: "18px",
          }}
        >
          {(
            details?.scope ??
            project.deliverables.map((title) => ({ title, text: "" }))
          ).map((item, index) => (
            <Box component="li" key={item.title} sx={{ display: "flex", gap: "12px", color: "#655d59" }}>
              <Box
                component="span"
                sx={{
                  width: 24,
                  height: 24,
                  display: "grid",
                  placeItems: "center",
                  borderRadius: "50%",
                  bgcolor: "#ffdbd1",
                  color: "#862200",
                  flexShrink: 0,
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                {index + 1}
              </Box>
              <Typography sx={{ fontSize: 14, lineHeight: 1.6, color: "#655d59" }}>
                <strong style={{ color: "#1b1c1c" }}>{item.title}</strong> {item.text}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* 4. Requirements */}
      <Box
        component="section"
        id="requirements"
        sx={{
          py: "30px",
          borderBottom: "1px solid #e9e6e3",
          scrollMarginTop: "110px",
        }}
      >
        <Typography
          component="h2"
          sx={{
            fontSize: { xs: 19, sm: 22 },
            fontWeight: 750,
            lineHeight: 1.4,
            mb: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "#1b1c1c",
            "&:before": {
              content: "''",
              width: 9,
              height: 9,
              flexShrink: 0,
              bgcolor: "#ab2e00",
              borderRadius: "2px",
            },
          }}
        >
          Yêu cầu năng lực
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: "14px",
          }}
        >
          {(
            details?.requirements ?? [
              `Có portfolio phù hợp với lĩnh vực ${project.category}.`,
              `Có thể thực hiện và bàn giao trong ${project.duration}.`,
            ]
          ).map((text) => (
            <Box
              key={text}
              sx={{
                bgcolor: "#f5f3f3",
                p: "20px",
                borderRadius: "26px",
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
                fontSize: 13,
              }}
            >
              <CheckCircle2 size={22} color="#ab2e00" style={{ flexShrink: 0 }} />
              <Typography sx={{ fontSize: 13, lineHeight: 1.6, color: "#1b1c1c" }}>
                {text}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* 5. Deliverables */}
      <Box
        component="section"
        id="deliverables"
        sx={{
          py: "30px",
          borderBottom: details ? "1px solid #e9e6e3" : 0,
          scrollMarginTop: "110px",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "14px", mb: "20px" }}>
          <Typography
            component="h2"
            sx={{
              fontSize: { xs: 19, sm: 22 },
              fontWeight: 750,
              lineHeight: 1.4,
              display: "flex",
              alignItems: "center",
              gap: "10px",
              color: "#1b1c1c",
              m: 0,
              "&:before": {
                content: "''",
                width: 9,
                height: 9,
                flexShrink: 0,
                bgcolor: "#ab2e00",
                borderRadius: "2px",
              },
            }}
          >
            Hạng mục sản phẩm bàn giao
          </Typography>
          <Typography sx={{ fontSize: 10, color: "#826b5f", whiteSpace: "nowrap" }}>
            {deliverables.length} hạng mục chính
          </Typography>
        </Box>
        <Box
          component="ul"
          sx={{
            listStyle: "none",
            m: 0,
            p: 0,
            display: "grid",
            gap: "10px",
          }}
        >
          {deliverables.map((item) => (
            <Box
              component="li"
              key={item.title}
              sx={{
                display: "flex",
                gap: "12px",
                borderRadius: "20px",
                bgcolor: "#faf8f7",
                p: "16px",
              }}
            >
              <Box
                sx={{
                  flexShrink: 0,
                  bgcolor: "#ab2e00",
                  color: "#fff",
                  mt: "4px",
                  borderRadius: "2px",
                  width: 18,
                  height: 18,
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <Check size={14} />
              </Box>
              <Box>
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#1b1c1c" }}>
                  {item.title}
                </Typography>
                {item.text && (
                  <Typography sx={{ fontSize: 12, color: "#75655f", mt: "4px", lineHeight: 1.6 }}>
                    {item.text}
                  </Typography>
                )}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* 6. Benefits & Documents (only if details present) */}
      {details && (
        <>
          <Box
            component="section"
            id="benefits"
            sx={{
              py: "30px",
              borderBottom: "1px solid #e9e6e3",
              scrollMarginTop: "110px",
            }}
          >
            <Typography
              component="h2"
              sx={{
                fontSize: { xs: 19, sm: 22 },
                fontWeight: 750,
                lineHeight: 1.4,
                mb: "20px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                color: "#1b1c1c",
                "&:before": {
                  content: "''",
                  width: 9,
                  height: 9,
                  flexShrink: 0,
                  bgcolor: "#ab2e00",
                  borderRadius: "2px",
                },
              }}
            >
              Quyền lợi &amp; Lộ trình thanh toán
            </Typography>
            <Box sx={{ bgcolor: "#f5f3f3", borderRadius: "28px", p: "22px" }}>
              <Typography
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#ab2e00",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                <ShieldCheck size={20} />
                {details.benefits.title}
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
                  gap: "10px",
                  my: "20px",
                }}
              >
                {details.benefits.payments.map((payment) => (
                  <Box
                    key={payment.label}
                    sx={{
                      bgcolor: "#fff",
                      p: "16px",
                      borderRadius: "20px",
                    }}
                  >
                    <Typography sx={{ fontSize: 10, color: "#75655f" }}>
                      {payment.label}
                    </Typography>
                    <Typography component="h3" sx={{ fontSize: 13, my: "8px", fontWeight: 700, color: "#1b1c1c" }}>
                      {payment.title}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: "#75655f", lineHeight: 1.6 }}>
                      {payment.description}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <Typography sx={{ fontSize: 12, color: "#75655f" }}>
                * {details.benefits.note}
              </Typography>
            </Box>
          </Box>

          <Box
            component="section"
            id="documents"
            sx={{
              pt: "30px",
              scrollMarginTop: "110px",
            }}
          >
            <Typography
              component="h2"
              sx={{
                fontSize: { xs: 19, sm: 22 },
                fontWeight: 750,
                lineHeight: 1.4,
                mb: "20px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                color: "#1b1c1c",
                "&:before": {
                  content: "''",
                  width: 9,
                  height: 9,
                  flexShrink: 0,
                  bgcolor: "#ab2e00",
                  borderRadius: "2px",
                },
              }}
            >
              Tài liệu tham khảo
            </Typography>
            {details.documents.map((document) => (
              <Box
                key={document.title}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  bgcolor: "#f5f3f3",
                  borderRadius: "24px",
                  p: "16px",
                  mt: "12px",
                }}
              >
                <Box sx={{ color: "#ab2e00", display: "grid", placeItems: "center", flexShrink: 0 }}>
                  {document.kind === "brief" ? <FileText size={20} /> : <Image size={20} />}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#1b1c1c", wordBreak: "break-word" }}>
                    {document.title}
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: "#75655f" }}>
                    {document.description}
                  </Typography>
                </Box>
                <Button
                  onClick={() => onPreview(document.kind)}
                  sx={{
                    bgcolor: "#fff",
                    color: "#1b1c1c",
                    px: "12px",
                    py: "7px",
                    borderRadius: "30px",
                    fontSize: 11,
                    fontWeight: 600,
                    textTransform: "none",
                    flexShrink: 0,
                    "&:hover": { bgcolor: "#f3eeeb" },
                  }}
                >
                  {document.kind === "image" ? "Xem ảnh" : "Xem trước"}
                </Button>
              </Box>
            ))}
            <Typography sx={{ fontSize: 11, color: "#907067", fontStyle: "italic", mt: "14px" }}>
              Nội dung minh họa dành cho prototype FREVO.
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );
}
