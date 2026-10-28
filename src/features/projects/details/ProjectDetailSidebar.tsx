import { Box, Typography, Button } from "@mui/material";
import { ArrowRight, BadgeCheck, ShieldCheck, Star } from "lucide-react";
import type { Project, ProjectDetails } from "@/lib/types/project.types";
import { formatBudget } from "@/lib/utils/formatters";

export function ProjectDetailSidebar({
  project,
  details,
  onCompany,
}: {
  project: Project;
  details?: ProjectDetails;
  onCompany: () => void;
}) {
  const monogram =
    details?.employer.monogram ??
    project.company
      .split(" ")
      .slice(0, 2)
      .map((word) => word[0])
      .join("");

  return (
    <Box
      component="aside"
      aria-label="Thông tin doanh nghiệp và hợp tác"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        minWidth: 0,
        position: { xs: "static", md: "sticky" },
        top: { md: "100px" },
      }}
    >
      {/* 1. Doanh nghiệp tuyển dụng */}
      <Box
        sx={{
          bgcolor: "#fff",
          borderRadius: "16px",
          p: { xs: "22px 18px", sm: "24px" },
          border: "2px solid", borderColor: "text.secondary",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: "14px", mb: "18px" }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              bgcolor: "#303031",
              color: "#fff",
              display: "grid",
              placeItems: "center",
              fontSize: 22,
              fontWeight: 800,
              flexShrink: 0,
            }}
          >
            {monogram}
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              component="h2"
              sx={{
                fontSize: 15,
                fontWeight: 750,
                display: "flex",
                alignItems: "center",
                gap: "4px",
                color: "#1b1c1c",
              }}
            >
              {project.company}{" "}
              {details?.employer.verified && <BadgeCheck size={17} color="#006947" />}
            </Typography>
            <Typography sx={{ fontSize: 12, color: "#75655f" }}>
              {details?.employer.industry ?? project.category}
            </Typography>
          </Box>
        </Box>

        {details?.employer.description && (
          <Typography sx={{ color: "#75655f", fontSize: 12, lineHeight: 1.8 }}>
            {details.employer.description}
          </Typography>
        )}

        <Box
          component="dl"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            borderBlock: "1px solid #eee8e4",
            py: "14px",
            my: "16px",
            fontSize: 12,
            m: 0,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", gap: "16px" }}>
            <Typography component="dt" sx={{ color: "#806b63", fontSize: 12 }}>
              Địa điểm:
            </Typography>
            <Typography component="dd" sx={{ fontWeight: 500, m: 0, color: "#1b1c1c", textAlign: "right" }}>
              {project.city}
            </Typography>
          </Box>
          {details && (
            <>
              <Box sx={{ display: "flex", justifyContent: "space-between", gap: "16px" }}>
                <Typography component="dt" sx={{ color: "#806b63", fontSize: 12 }}>
                  Quy mô nhân sự:
                </Typography>
                <Typography component="dd" sx={{ fontWeight: 500, m: 0, color: "#1b1c1c", textAlign: "right" }}>
                  {details.employer.teamSize}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", gap: "16px" }}>
                <Typography component="dt" sx={{ color: "#806b63", fontSize: 12 }}>
                  Dự án trên FREVO:
                </Typography>
                <Typography component="dd" sx={{ fontWeight: 500, m: 0, color: "#1b1c1c", textAlign: "right" }}>
                  {details.employer.completedProjects}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", gap: "16px" }}>
                <Typography component="dt" sx={{ color: "#806b63", fontSize: 12 }}>
                  Đánh giá từ Freelancer:
                </Typography>
                <Typography
                  component="dd"
                  sx={{
                    fontWeight: 500,
                    m: 0,
                    color: "#1b1c1c",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <Star size={14} color="#ab2e00" />
                  {details.employer.rating}
                </Typography>
              </Box>
            </>
          )}
        </Box>

        {details && (
          <Button
            onClick={onCompany}
            sx={{
              width: "100%",
              minHeight: 38,
              bgcolor: "#f5f3f3",
              color: "#1b1c1c",
              fontSize: 11,
              fontWeight: 600,
              textTransform: "none",
              borderRadius: "999px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              "&:hover": { bgcolor: "#f3eeeb" },
            }}
          >
            Xem hồ sơ doanh nghiệp <ArrowRight size={16} />
          </Button>
        )}
      </Box>

      {/* 2. Thông tin hợp tác */}
      <Box
        sx={{
          bgcolor: "#fff",
          borderRadius: "16px",
          p: { xs: "22px 18px", sm: "24px" },
          border: "2px solid", borderColor: "text.secondary",
        }}
      >
        <Typography component="h2" sx={{ fontSize: 16, fontWeight: 750, color: "#1b1c1c", mb: "16px" }}>
          Thông tin hợp tác
        </Typography>
        <Box component="dl" sx={{ display: "flex", flexDirection: "column", gap: "12px", m: 0, fontSize: 12 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", gap: "16px" }}>
            <Typography component="dt" sx={{ color: "#806b63", fontSize: 12 }}>
              Loại dự án:
            </Typography>
            <Typography component="dd" sx={{ fontWeight: 500, m: 0, color: "#1b1c1c" }}>
              {project.category}
            </Typography>
          </Box>
          {details?.hiringCount && (
            <Box sx={{ display: "flex", justifyContent: "space-between", gap: "16px" }}>
              <Typography component="dt" sx={{ color: "#806b63", fontSize: 12 }}>
                Số lượng tuyển:
              </Typography>
              <Typography component="dd" sx={{ fontWeight: 500, m: 0, color: "#1b1c1c" }}>
                {details.hiringCount}
              </Typography>
            </Box>
          )}
          <Box sx={{ display: "flex", justifyContent: "space-between", gap: "16px" }}>
            <Typography component="dt" sx={{ color: "#806b63", fontSize: 12 }}>
              Hình thức làm việc:
            </Typography>
            <Typography component="dd" sx={{ fontWeight: 500, m: 0, color: "#1b1c1c" }}>
              {project.remote ? "Từ xa (Remote 100%)" : "Tại chỗ"}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", gap: "16px" }}>
            <Typography component="dt" sx={{ color: "#806b63", fontSize: 12 }}>
              Thời lượng dự kiến:
            </Typography>
            <Typography component="dd" sx={{ fontWeight: 500, m: 0, color: "#1b1c1c" }}>
              {project.duration}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", gap: "16px" }}>
            <Typography component="dt" sx={{ color: "#806b63", fontSize: 12 }}>
              Khoảng ngân sách:
            </Typography>
            <Typography component="dd" sx={{ fontWeight: 700, m: 0, color: "#ab2e00" }}>
              {formatBudget(project)}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", gap: "16px" }}>
            <Typography component="dt" sx={{ color: "#806b63", fontSize: 12 }}>
              Hạn ứng tuyển:
            </Typography>
            <Typography component="dd" sx={{ fontWeight: 500, m: 0, color: "#1b1c1c" }}>
              {project.deadline}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* 3. Tiến độ dự kiến */}
      <Box
        sx={{
          bgcolor: "#fff",
          borderRadius: "16px",
          p: { xs: "22px 18px", sm: "24px" },
          border: "2px solid", borderColor: "text.secondary",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "14px", mb: "16px" }}>
          <Typography component="h2" sx={{ fontSize: 16, fontWeight: 750, color: "#1b1c1c" }}>
            Tiến độ dự kiến
          </Typography>
          {details && (
            <Typography sx={{ fontSize: 10, color: "#826b5f", whiteSpace: "nowrap" }}>
              {details.timeline.length} cột mốc
            </Typography>
          )}
        </Box>
        <Box
          component="ol"
          sx={{
            listStyle: "none",
            p: "0 0 0 22px",
            m: 0,
          }}
        >
          {(
            details?.timeline ?? [
              {
                date: project.deadline,
                title: "Hạn chót nộp hồ sơ ứng tuyển",
                description: "Gửi CV và hồ sơ ứng tuyển trước thời hạn.",
              },
            ]
          ).map((milestone, idx) => (
            <Box
              component="li"
              key={milestone.title}
              sx={{
                position: "relative",
                borderLeft: idx === (details?.timeline ?? [1]).length - 1 ? "2px solid transparent" : "2px solid #e4e2e2",
                ml: "-14px",
                pl: "20px",
                pb: "22px",
                "&:before": {
                  content: "''",
                  position: "absolute",
                  left: "-6px",
                  top: "5px",
                  width: 10,
                  height: 10,
                  bgcolor: idx === 0 ? "#ab2e00" : "#655d59",
                  borderRadius: "50%",
                  outline: "4px solid #fff",
                },
              }}
            >
              <Typography
                component="time"
                sx={{
                  fontSize: 10,
                  color: idx === 0 ? "#ab2e00" : "#806b63",
                  fontWeight: 600,
                  display: "block",
                }}
              >
                {milestone.date}
              </Typography>
              <Typography component="h3" sx={{ fontSize: 13, lineHeight: 1.5, my: "4px", fontWeight: 700, color: "#1b1c1c" }}>
                {milestone.title}
              </Typography>
              <Typography sx={{ fontSize: 12, lineHeight: 1.7, color: "#806b63" }}>
                {milestone.description}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* 4. Trust badge */}
      {details && (
        <Box
          sx={{
            display: "flex",
            gap: "12px",
            bgcolor: "#fff0e9",
            p: "20px",
            borderRadius: "16px",
            color: "#ab2e00",
          }}
        >
          <ShieldCheck size={25} style={{ flexShrink: 0 }} />
          <Box>
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#ab2e00" }}>
              {details.benefits.trustTitle}
            </Typography>
            <Typography sx={{ color: "#806b63", fontSize: 12, mt: "5px", lineHeight: 1.6 }}>
              {details.benefits.trustDescription}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}
