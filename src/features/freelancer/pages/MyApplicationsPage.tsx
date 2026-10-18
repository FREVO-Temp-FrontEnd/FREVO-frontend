import { useState } from "react";
import {
  Box,
  Typography,
  Card,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
} from "@mui/material";
import { Link } from "react-router";
import {
  Briefcase,
  MessageCircle,
  AlertTriangle,
  ArrowRight,
  DollarSign,
  Calendar,
} from "lucide-react";
import { useFreelancer } from "@/lib/hooks/useFreelancer";
import type { Candidate } from "@/lib/types/marketplace.types";

export function MyApplicationsPage() {
  const { myApplications, projects, withdrawApplication, toast, setToast } = useFreelancer();
  const [withdrawCandidate, setWithdrawCandidate] = useState<Candidate | null>(null);

  const handleConfirmWithdraw = () => {
    if (withdrawCandidate) {
      withdrawApplication(withdrawCandidate.id);
      setWithdrawCandidate(null);
    }
  };

  const getStatusChip = (status: Candidate["status"], chatUnlocked: boolean) => {
    switch (status) {
      case "new":
        return <Chip label="Chờ xem xét" size="small" sx={{ bgcolor: "#fff7ed", color: "#c2410c", fontWeight: 700 }} />;
      case "under_review":
        return <Chip label="Chờ xem xét (từ lời mời)" size="small" sx={{ bgcolor: "#fef3c7", color: "#b45309", fontWeight: 700 }} />;
      case "discussing":
        return (
          <Chip
            label={chatUnlocked ? "Đang trao đổi (Đã mở chat)" : "Đang trao đổi"}
            size="small"
            color="primary"
            sx={{ fontWeight: 700 }}
          />
        );
      case "offer":
        return <Chip label="Chờ xác nhận thỏa thuận" size="small" color="warning" sx={{ fontWeight: 700 }} />;
      case "selected":
        return <Chip label="Đã được chọn" size="small" color="success" sx={{ fontWeight: 700 }} />;
      case "not_selected":
        return <Chip label="Đã đóng / Đã rút hồ sơ" size="small" sx={{ bgcolor: "#f3f4f6", color: "#6b7280" }} />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", py: 4, px: 2 }}>
      {/* Page Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="overline" sx={{ color: "#f4490b", fontWeight: 700, letterSpacing: 1 }}>
          HỒ SƠ ĐÃ ỨNG TUYỂN (FL-009)
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 800, color: "#1c1917", mt: 0.5 }}>
          Quản lý ứng tuyển của bạn
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary", mt: 0.5 }}>
          Theo dõi tiến độ xét duyệt từ Doanh nghiệp, trạng thái mở kênh trao đổi (FR-031) và quản lý rút hồ sơ (FL-012).
        </Typography>
      </Box>

      {/* Applications List */}
      {myApplications.length > 0 ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          {myApplications.map((app) => {
            const project = projects.find((p) => p.id === app.projectId);
            const canWithdraw = app.status === "new" || app.status === "under_review";
            const canChat = app.chatUnlocked && (app.status === "discussing" || app.status === "offer" || app.status === "selected");

            const formattedReceivedAt = new Date(app.receivedAt).toLocaleDateString("vi-VN");

            return (
              <Card
                key={app.id}
                variant="outlined"
                sx={{
                  p: 3,
                  borderRadius: 3,
                  bgcolor: "#ffffff",
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  justifyContent: "space-between",
                  gap: 2,
                  transition: "box-shadow 0.15s ease",
                  "&:hover": { boxShadow: "0 6px 20px rgba(0,0,0,0.06)" },
                }}
              >
                {/* Left: Summary */}
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1, flexWrap: "wrap" }}>
                    <Chip label={app.source} size="small" sx={{ fontWeight: 600, height: 22 }} />
                    {getStatusChip(app.status, app.chatUnlocked)}
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                      Nộp ngày {formattedReceivedAt}
                    </Typography>
                  </Box>

                  <Typography variant="h6" sx={{ fontWeight: 800, color: "#1c1917", mb: 0.5 }}>
                    {project?.title || "Dự án FREVO"}
                  </Typography>

                  <Typography variant="body2" sx={{ color: "text.secondary", mb: 1.5 }}>
                    Doanh nghiệp: <strong>{project?.company || "Doanh nghiệp"}</strong>
                  </Typography>

                  <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", mb: 1.5 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                      <DollarSign size={15} color="#f4490b" />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {project?.budget || "Thỏa thuận"}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                      <Calendar size={15} color="#f4490b" />
                      <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        Hạn hoàn thành: {project?.deadline || "Chưa xác định"}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Proposal Snippet */}
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#4b5563",
                      bgcolor: "#fafaf9",
                      p: 1.5,
                      borderRadius: 1.5,
                      border: "1px solid #f2f0ea",
                      fontSize: "0.85rem",
                      lineHeight: 1.5,
                      maxHeight: 80,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    <strong>Đề xuất của bạn:</strong> {app.proposal}
                  </Typography>
                </Box>

                {/* Right: Actions */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "row", md: "column" },
                    alignItems: { xs: "center", md: "flex-end" },
                    justifyContent: { xs: "space-between", md: "center" },
                    gap: 1.5,
                    pt: { xs: 2, md: 0 },
                    borderTop: { xs: "1px solid #f3f4f6", md: "none" },
                  }}
                >
                  {canChat ? (
                    <Button
                      component={Link}
                      to={`/projects/${app.projectId}/details`}
                      variant="contained"
                      startIcon={<MessageCircle size={15} />}
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                        bgcolor: "#f4490b",
                        "&:hover": { bgcolor: "#d63b04" },
                        px: 2.5,
                      }}
                    >
                      Mở trao đổi dự án (FR-031)
                    </Button>
                  ) : (
                    <Typography variant="caption" sx={{ color: "text.secondary", textAlign: "right" }}>
                      {app.status === "not_selected"
                        ? "Hồ sơ không tiếp tục xét duyệt"
                        : "Kênh chat sẽ mở sau khi Business duyệt (BR-012)"}
                    </Typography>
                  )}

                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      component={Link}
                      to={`/projects/${app.projectId}/details`}
                      variant="outlined"
                      size="small"
                      sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
                    >
                      Xem chi tiết dự án
                    </Button>

                    {canWithdraw && (
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => setWithdrawCandidate(app)}
                        sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
                      >
                        Rút hồ sơ (FL-012)
                      </Button>
                    )}
                  </Box>
                </Box>
              </Card>
            );
          })}
        </Box>
      ) : (
        <Box
          sx={{
            py: 8,
            px: 3,
            textAlign: "center",
            bgcolor: "#fafaf9",
            borderRadius: 3,
            border: "1px dashed #d6d3d1",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              bgcolor: "#f5f5f4",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#78716c",
              mb: 1,
            }}
          >
            <Briefcase size={26} strokeWidth={1.8} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#292524", fontSize: "1.1rem" }}>
            Bạn chưa ứng tuyển dự án nào
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", maxWidth: 440, mb: 1 }}>
            Khám phá các cơ hội việc làm sáng tạo trên sàn FREVO và nộp đề xuất phù hợp với năng lực của bạn.
          </Typography>
          <Button
            component={Link}
            to="/projects"
            variant="contained"
            endIcon={<ArrowRight size={15} />}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              bgcolor: "#f4490b",
              "&:hover": { bgcolor: "#d63b04" },
            }}
          >
            Khám phá dự án ngay
          </Button>
        </Box>
      )}

      {/* Withdrawal Confirmation Dialog (FL-012, BR-010) */}
      <Dialog
        open={!!withdrawCandidate}
        onClose={() => setWithdrawCandidate(null)}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 3, p: 1 } } }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AlertTriangle size={20} color="#dc2626" />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Rút hồ sơ ứng tuyển? (FL-012)
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.6 }}>
            Bạn có chắc chắn muốn rút hồ sơ ứng tuyển khỏi dự án này? Sau khi rút hồ sơ, Doanh nghiệp sẽ không tiếp tục xem xét bạn cho dự án theo quy định <strong>BR-010</strong>.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setWithdrawCandidate(null)} variant="outlined" sx={{ borderRadius: 2 }}>
            Hủy bỏ
          </Button>
          <Button
            onClick={handleConfirmWithdraw}
            variant="contained"
            color="error"
            sx={{ borderRadius: 2, fontWeight: 600 }}
          >
            Xác nhận rút hồ sơ
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast */}
      <Snackbar
        open={!!toast}
        autoHideDuration={4000}
        onClose={() => setToast("")}
        message={toast}
      />
    </Box>
  );
}
export default MyApplicationsPage;
