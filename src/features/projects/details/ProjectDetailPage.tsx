import { useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router";
import { Box, Typography, Button } from "@mui/material";
import { ArrowLeft } from "lucide-react";
import { ProjectApplyDialog } from "@/features/projects/application/ProjectApplyDialog";
import { useProjects } from "@/lib/hooks/useProjects";
import { useAuthSession } from "@/lib/hooks/useAuthSession";
import { ProjectDetailContent } from "./ProjectDetailContent";

export default function ProjectDetailPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { role } = useAuthSession();
  const {
    projects,
    loading,
    loadError,
    applied,
    saved,
    toggleSaved,
    applyingId,
    openApplication,
    closeApplication,
    submitting,
    submitError,
    submitApplication,
    toast,
  } = useProjects();
  const project = projects.find((item) => item.id === projectId);

  function handleApply(id: string) {
    if (role === "guest") {
      navigate("/login", { state: { from: { pathname: `/projects/${id}/details` } } });
      return;
    }
    openApplication(id);
  }

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [projectId]);

  return (
    <>
      <Box
        component="main"
        id="main"
        sx={{
          width: "100%",
          maxWidth: 1440,
          mx: "auto",
          minWidth: 0,
          p: { xs: "24px 16px 40px", md: "24px 32px 64px" },
          color: "#1b1c1c",
          fontSize: 14,
          lineHeight: 1.6,
          "& .MuiButton-root, & .MuiIconButton-root": {
            minHeight: 44,
            border: "2px solid",
            borderColor: "text.secondary",
            fontWeight: 700,
            cursor: "pointer",
          },
          "& .MuiButton-root:hover, & .MuiIconButton-root:hover": {
            borderColor: "#bd3d14",
            boxShadow: "0 3px 0 rgba(189, 61, 20, 0.18)",
          },
          "& .MuiButton-root:focus-visible, & .MuiIconButton-root:focus-visible": {
            outline: "3px solid #bd3d14",
            outlineOffset: 3,
          },
          "& .MuiButton-root:active, & .MuiIconButton-root:active": {
            transform: "translateY(1px)",
            boxShadow: "none",
          },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "flex-start", mb: "24px" }}>
          <Button
            component={Link}
            to={project ? `/projects/${encodeURIComponent(project.id)}` : "/"}
            startIcon={<ArrowLeft size={18} aria-hidden="true" />}
            sx={{
              minHeight: 44,
              px: 2.5,
              border: "2px solid",
              borderColor: "text.secondary",
              bgcolor: "background.paper",
              color: "text.primary",
              fontWeight: 700,
              textTransform: "none",
              "&:hover": { bgcolor: "#fff0e9", borderColor: "#bd3d14", color: "#9f310f" },
            }}
          >
            Quay lại danh sách
          </Button>
        </Box>
        {/* State rendering */}
        {loading ? (
          <Box
            role="status"
            sx={{
              p: "60px 24px",
              textAlign: "center",
              bgcolor: "#fff",
              borderRadius: "16px",
              color: "#75655f",
            }}
          >
            Đang tải chi tiết dự án...
          </Box>
        ) : loadError ? (
          <Box
            role="alert"
            sx={{
              p: "60px 24px",
              textAlign: "center",
              bgcolor: "#fff",
              borderRadius: "16px",
            }}
          >
            <Typography component="h1" sx={{ fontSize: 22, fontWeight: 750, mb: 1 }}>
              Không tải được dự án
            </Typography>
            <Typography sx={{ color: "#75655f", mb: 3 }}>
              Kiểm tra kết nối hoặc cấu hình API rồi tải lại trang.
            </Typography>
            <Button
              type="button"
              onClick={() => window.location.reload()}
              sx={{
                bgcolor: "#f5f3f3",
                color: "#1b1c1c",
                borderRadius: "999px",
                px: 3,
                py: 1,
                textTransform: "none",
                fontWeight: 600,
                "&:hover": { bgcolor: "#ece0db" },
              }}
            >
              Thử lại
            </Button>
          </Box>
        ) : !project ? (
          <Box
            sx={{
              p: "60px 24px",
              textAlign: "center",
              bgcolor: "#fff",
              borderRadius: "16px",
            }}
          >
            <Typography component="h1" sx={{ fontSize: 22, fontWeight: 750, mb: 1 }}>
              Không tìm thấy dự án
            </Typography>
            <Typography sx={{ color: "#75655f", mb: 3 }}>
              Bài đăng này không có trong danh sách hiện tại.
            </Typography>
            <Button
              component={Link}
              to="/"
              sx={{
                bgcolor: "#f5f3f3",
                color: "#1b1c1c",
                borderRadius: "999px",
                px: 3,
                py: 1,
                textTransform: "none",
                fontWeight: 600,
                "&:hover": { bgcolor: "#ece0db" },
              }}
            >
              Về danh sách dự án
            </Button>
          </Box>
        ) : (
          <ProjectDetailContent
            key={project.id}
            project={project}
            projects={projects}
            applied={applied.has(project.id)}
            saved={saved.has(project.id)}
            onSave={toggleSaved}
            onApply={handleApply}
          />
        )}
      </Box>

      <ProjectApplyDialog
        key={applyingId ?? "closed"}
        isOpen={applyingId !== null}
        onClose={closeApplication}
        project={project}
        reapplying={applyingId !== null && applied.has(applyingId)}
        submitting={submitting}
        submitError={submitError}
        onSubmit={submitApplication}
      />

      {toast && (
        <Box
          id="toast"
          role="status"
          aria-live="polite"
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            bgcolor: "#1b1c1c",
            color: "#fff",
            px: "20px",
            py: "12px",
            borderRadius: "12px",
            fontSize: 13,
            fontWeight: 600,
            boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
            zIndex: 1000,
          }}
        >
          {toast}
        </Box>
      )}
    </>
  );
}
