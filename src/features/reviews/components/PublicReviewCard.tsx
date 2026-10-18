import React from "react";
import { Box, Typography, Paper, Rating, Chip, Avatar } from "@mui/material";
import { ShieldCheck } from "lucide-react";
import type { ReviewItem } from "@/lib/types/marketplace.types";

interface PublicReviewCardProps {
  review: ReviewItem;
  projectTitle?: string;
}

export const PublicReviewCard: React.FC<PublicReviewCardProps> = ({
  review,
  projectTitle,
}) => {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2.5,
        borderRadius: "14px",
        bgcolor: "#ffffff",
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar sx={{ width: 36, height: 36, bgcolor: "#ffedd5", color: "#c2410c", fontWeight: 700, fontSize: "13px" }}>
            {review.reviewerName.slice(0, 2).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#1e293b" }}>
              {review.reviewerName}
            </Typography>
            <Typography variant="caption" sx={{ color: "#64748b" }}>
              {review.reviewerRole === "business" ? "Doanh nghiệp tuyển dụng" : "Freelancer thực hiện"}
            </Typography>
          </Box>
        </Box>

        <Chip
          icon={<ShieldCheck size={12} />}
          label="Dự án thực tế (FR-055)"
          size="small"
          sx={{ bgcolor: "#ecfdf5", color: "#059669", fontWeight: 600, fontSize: "10px", height: 20 }}
        />
      </Box>

      <Rating value={review.rating} readOnly size="small" sx={{ color: "#f4490b" }} />

      <Typography variant="body2" sx={{ color: "#334155", lineHeight: 1.6, fontStyle: "italic" }}>
        "{review.comment}"
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pt: 1, borderTop: "1px dashed #e2e8f0" }}>
        <Typography variant="caption" sx={{ color: "#94a3b8" }}>
          {projectTitle ? `Dự án: ${projectTitle}` : "Hợp tác hoàn thành trên FREVO"}
        </Typography>
        <Typography variant="caption" sx={{ color: "#94a3b8" }}>
          {new Date(review.createdAt).toLocaleDateString("vi-VN")}
        </Typography>
      </Box>
    </Paper>
  );
};
