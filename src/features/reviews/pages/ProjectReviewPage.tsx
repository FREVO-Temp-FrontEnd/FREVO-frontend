import React, { useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Breadcrumbs,
  Link as MuiLink,
} from "@mui/material";
import { ArrowLeft, Star } from "lucide-react";
import { useAuthSession } from "@/lib/hooks/useAuthSession";
import { useBusiness } from "@/lib/hooks/useBusiness";
import { mockStorage } from "@/lib/storage/mockStorage";
import { SubmitReviewDialog } from "../components/SubmitReviewDialog";
import { PublicReviewCard } from "../components/PublicReviewCard";
import type { ReviewItem } from "@/lib/types/marketplace.types";

export const ProjectReviewPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const { user, role } = useAuthSession();
  const { projects, agreements, talents } = useBusiness();

  const project = projects.find((p) => p.id === projectId) || projects[0];
  const effectiveAgreement = agreements.find((a) => a.projectId === project?.id && a.isEffective) || agreements[0];
  const talent = talents.find((t) => t.id === effectiveAgreement?.talentId) || talents[0];

  const [reviews, setReviews] = useState<ReviewItem[]>(() =>
    project ? mockStorage.getReviews(project.id) : []
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  React.useEffect(() => {
    const unsub = mockStorage.subscribe(() => {
      if (project) {
        setReviews(mockStorage.getReviews(project.id));
      }
    });
    return unsub;
  }, [project]);

  if (!project) {
    return (
      <Container maxWidth="lg" sx={{ py: 6, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          Không tìm thấy dự án tương ứng.
        </Typography>
        <Button onClick={() => navigate(-1)} sx={{ mt: 2, color: "#f4490b" }}>
          Quay lại
        </Button>
      </Container>
    );
  }

  const isBusiness = role === "client" || role === "admin";
  const reviewerRole = isBusiness ? "business" : "talent";
  const reviewerName = isBusiness ? project.company : talent.name;
  const targetName = isBusiness ? talent.name : project.company;

  const handleSubmitReview = (rating: number, comment: string) => {
    mockStorage.submitReview({
      projectId: project.id,
      reviewerRole,
      reviewerId: user?.id || "user-1",
      reviewerName,
      targetId: isBusiness ? talent.id : "business-1",
      rating,
      comment,
    });
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 2 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <MuiLink
            component="button"
            variant="body2"
            onClick={() => navigate(`/workspace/${project.id}`)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              color: "#64748b",
              textDecoration: "none",
              "&:hover": { color: "#f4490b" },
            }}
          >
            <ArrowLeft size={16} /> Không gian làm việc
          </MuiLink>
          <Typography variant="body2" color="text.primary" sx={{ fontWeight: 600 }}>
            Đánh giá hợp tác: {project.title}
          </Typography>
        </Breadcrumbs>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          bgcolor: "#ffffff",
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              fontFamily: "Space Grotesk, sans-serif",
              color: "#1e293b",
            }}
          >
            Đánh giá dự án {project.title}
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>
            Ghi nhận đóng góp và sự hài lòng sau khi hoàn thành dự án hợp tác (FR-054, FR-055)
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={() => setIsDialogOpen(true)}
          startIcon={<Star size={16} />}
          sx={{
            bgcolor: "#f4490b",
            "&:hover": { bgcolor: "#bd3d14" },
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 700,
            px: 3,
          }}
        >
          Viết đánh giá đối tác
        </Button>
      </Paper>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1e293b" }}>
          Nhận xét đã ghi nhận ({reviews.length})
        </Typography>

        {reviews.length === 0 ? (
          <Paper
            variant="outlined"
            sx={{ p: 5, textAlign: "center", borderRadius: "14px", color: "#94a3b8" }}
          >
            <Star size={36} style={{ margin: "0 auto 8px", opacity: 0.4 }} />
            <Typography variant="body2">
              Chưa có đánh giá nào cho dự án này. Hãy bấm "Viết đánh giá đối tác" để gửi nhận xét đầu tiên.
            </Typography>
          </Paper>
        ) : (
          reviews.map((r) => (
            <PublicReviewCard key={r.id} review={r} projectTitle={project.title} />
          ))
        )}
      </Box>

      <SubmitReviewDialog
        open={isDialogOpen}
        projectId={project.id}
        projectTitle={project.title}
        reviewerRole={reviewerRole}
        reviewerName={reviewerName}
        targetName={targetName}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleSubmitReview}
      />
    </Container>
  );
};

export default ProjectReviewPage;
