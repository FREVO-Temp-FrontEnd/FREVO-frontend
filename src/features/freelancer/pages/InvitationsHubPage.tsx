import { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Card,
  Chip,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Alert,
  Snackbar,
} from "@mui/material";
import { Mail, Clock, CheckCircle2, XCircle, ArrowRight, DollarSign, Calendar } from "lucide-react";
import { useFreelancer } from "@/lib/hooks/useFreelancer";
import { InvitationDetailDialog } from "../components/InvitationDetailDialog";
import type { Invitation } from "@/lib/types/marketplace.types";

export function InvitationsHubPage() {
  const {
    myInvitations,
    getProjectForInvitation,
    acceptInvitation,
    declineInvitation,
    toast,
    setToast,
  } = useFreelancer();

  const [filter, setFilter] = useState<string>("all");
  const [selectedInvitation, setSelectedInvitation] = useState<Invitation | null>(null);

  const filteredInvitations = useMemo(() => {
    return myInvitations.filter((inv) => {
      if (filter === "pending") return inv.status === "pending";
      if (filter === "accepted") return inv.status === "accepted";
      if (filter === "declined") return inv.status === "declined";
      return true;
    });
  }, [myInvitations, filter]);

  const selectedProject = selectedInvitation
    ? getProjectForInvitation(selectedInvitation.projectId)
    : undefined;

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", py: 4, px: 2 }}>
      {/* Page Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="overline" sx={{ color: "#f4490b", fontWeight: 700, letterSpacing: 1 }}>
          TRUNG TÂM LỜI MỜI (FL-010)
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 800, color: "#1c1917", mt: 0.5 }}>
          Lời mời tham gia dự án
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary", mt: 0.5 }}>
          Các dự án được Doanh nghiệp chủ động gửi lời mời trực tiếp đến bạn theo thời hạn 7 ngày (FR-019, BR-024).
        </Typography>
      </Box>

      {/* 7-Day Guarantee Banner */}
      <Alert
        severity="info"
        icon={<Clock size={18} />}
        sx={{
          mb: 3,
          borderRadius: 2.5,
          bgcolor: "#f0f9ff",
          borderColor: "#bae6fd",
          color: "#0369a1",
          "& .MuiAlert-icon": { color: "#0284c7" },
        }}
      >
        <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
          <strong>Lưu ý về quy trình phản hồi lời mời (FR-019, BR-005):</strong> Mỗi lời mời có hiệu lực phản hồi trong vòng <strong>7 ngày</strong>. Khi bạn nhấn <em>Chấp nhận lời mời</em>, hồ sơ của bạn sẽ chuyển sang trạng thái <em>Chờ Business xem xét</em> (BR-005). Doanh nghiệp sẽ đánh giá và mở kênh trao đổi sau khi duyệt.
        </Typography>
      </Alert>

      {/* Filter Toolbar */}
      <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
        <ToggleButtonGroup
          value={filter}
          exclusive
          onChange={(_, val) => val && setFilter(val)}
          size="small"
          sx={{
            "& .MuiToggleButton-root": {
              textTransform: "none",
              fontWeight: 600,
              px: 2,
              py: 0.8,
            },
          }}
        >
          <ToggleButton value="all">
            Tất cả ({myInvitations.length})
          </ToggleButton>
          <ToggleButton value="pending">
            Chờ phản hồi ({myInvitations.filter((i) => i.status === "pending").length})
          </ToggleButton>
          <ToggleButton value="accepted">
            Đã chấp nhận ({myInvitations.filter((i) => i.status === "accepted").length})
          </ToggleButton>
          <ToggleButton value="declined">
            Đã từ chối ({myInvitations.filter((i) => i.status === "declined").length})
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Invitations List */}
      {filteredInvitations.length > 0 ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          {filteredInvitations.map((inv) => {
            const project = getProjectForInvitation(inv.projectId);
            if (!project) return null;

            const isPending = inv.status === "pending";
            const isAccepted = inv.status === "accepted";
            const isDeclined = inv.status === "declined";

            const formattedSentAt = new Date(inv.sentAt).toLocaleDateString("vi-VN");
            const formattedExpiresAt = new Date(inv.expiresAt).toLocaleDateString("vi-VN");

            return (
              <Card
                key={inv.id}
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
                {/* Left: Project & Note Summary */}
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1, flexWrap: "wrap" }}>
                    <Chip label={project.category} size="small" sx={{ fontWeight: 600, height: 22 }} />
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>
                      Gửi ngày {formattedSentAt}
                    </Typography>
                    {isPending && (
                      <Chip
                        icon={<Clock size={12} />}
                        label={`Hết hạn: ${formattedExpiresAt} (7 ngày)`}
                        size="small"
                        color="warning"
                        sx={{ fontWeight: 600, height: 22 }}
                      />
                    )}
                    {isAccepted && (
                      <Chip
                        icon={<CheckCircle2 size={12} />}
                        label="Đã chấp nhận (BR-005)"
                        size="small"
                        color="success"
                        sx={{ fontWeight: 600, height: 22 }}
                      />
                    )}
                    {isDeclined && (
                      <Chip
                        icon={<XCircle size={12} />}
                        label="Đã từ chối"
                        size="small"
                        color="default"
                        sx={{ fontWeight: 600, height: 22 }}
                      />
                    )}
                  </Box>

                  <Typography variant="h6" sx={{ fontWeight: 800, color: "#1c1917", mb: 0.5 }}>
                    {project.title}
                  </Typography>

                  <Typography variant="body2" sx={{ color: "text.secondary", mb: 1.5 }}>
                    Doanh nghiệp: <strong>{project.company}</strong> ({project.city || "Toàn quốc"})
                  </Typography>

                  <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", mb: 1.5 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                      <DollarSign size={15} color="#f4490b" />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {project.budget}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                      <Calendar size={15} color="#f4490b" />
                      <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        Hạn: {project.deadline}
                      </Typography>
                    </Box>
                  </Box>

                  {inv.note && (
                    <Box
                      sx={{
                        p: 1.5,
                        bgcolor: "#fff7ed",
                        borderRadius: 1.5,
                        border: "1px solid #fed7aa",
                        maxWidth: 600,
                      }}
                    >
                      <Typography variant="caption" sx={{ color: "#c2410c", fontWeight: 700, display: "block" }}>
                        Lời nhắn từ Doanh nghiệp:
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#7c2d12", fontStyle: "italic" }}>
                        &ldquo;{inv.note}&rdquo;
                      </Typography>
                    </Box>
                  )}
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
                  <Button
                    variant="outlined"
                    onClick={() => setSelectedInvitation(inv)}
                    sx={{
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 600,
                      px: 2.5,
                    }}
                  >
                    Xem chi tiết
                  </Button>

                  {isPending && (
                    <Button
                      variant="contained"
                      endIcon={<ArrowRight size={15} />}
                      onClick={() => acceptInvitation(inv.id)}
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                        bgcolor: "#f4490b",
                        "&:hover": { bgcolor: "#d63b04" },
                        px: 2.5,
                      }}
                    >
                      Chấp nhận lời mời (BR-005)
                    </Button>
                  )}
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
            <Mail size={26} strokeWidth={1.8} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#292524", fontSize: "1.1rem" }}>
            Không có lời mời nào trong mục này
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", maxWidth: 440 }}>
            {filter === "all"
              ? "Bạn chưa nhận được lời mời tham gia dự án nào từ Doanh nghiệp. Hãy cập nhật hồ sơ và bổ sung portfolio để thu hút khách hàng."
              : "Không có lời mời nào phù hợp với bộ lọc đã chọn."}
          </Typography>
        </Box>
      )}

      {/* Invitation Detail Dialog (FL-011) */}
      <InvitationDetailDialog
        open={!!selectedInvitation}
        onClose={() => setSelectedInvitation(null)}
        invitation={selectedInvitation}
        project={selectedProject}
        onAccept={(id) => acceptInvitation(id)}
        onDecline={(id) => declineInvitation(id)}
      />

      {/* Toast Feedback */}
      <Snackbar
        open={!!toast}
        autoHideDuration={5000}
        onClose={() => setToast("")}
        message={toast}
      />
    </Box>
  );
}
export default InvitationsHubPage;
