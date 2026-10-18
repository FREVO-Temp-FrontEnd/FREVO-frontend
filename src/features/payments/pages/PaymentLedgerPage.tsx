import React, { useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Container,
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Breadcrumbs,
  Link as MuiLink,
} from "@mui/material";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { useBusiness } from "@/lib/hooks/useBusiness";
import { mockStorage } from "@/lib/storage/mockStorage";
import { FundMilestoneModal } from "../components/FundMilestoneModal";
import { DisbursementHistoryTable } from "../components/DisbursementHistoryTable";
import { PaymentRetryState } from "../components/PaymentRetryState";
import { DisputeConceptCard } from "../components/DisputeConceptCard";
import type { Milestone, PaymentSimulation } from "@/lib/types/marketplace.types";

export const PaymentLedgerPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const { projects, agreements } = useBusiness();

  const project = projects.find((p) => p.id === projectId) || projects[0];
  const effectiveAgreement = agreements.find((a) => a.projectId === project?.id && a.isEffective) || agreements[0];

  const [payments, setPayments] = useState<PaymentSimulation[]>(() =>
    project ? mockStorage.getPayments(project.id) : []
  );
  const [selectedMilestoneToFund, setSelectedMilestoneToFund] = useState<Milestone | null>(null);
  const [showRetryDemo, setShowRetryDemo] = useState(false);

  React.useEffect(() => {
    const unsub = mockStorage.subscribe(() => {
      if (project) {
        setPayments(mockStorage.getPayments(project.id));
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

  const milestones = effectiveAgreement?.milestones || [];

  const handleFundConfirm = () => {
    if (selectedMilestoneToFund) {
      mockStorage.fundMilestone(project.id, selectedMilestoneToFund.id);
      setSelectedMilestoneToFund(null);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
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
            Sổ thanh toán mô phỏng: {project.title}
          </Typography>
        </Breadcrumbs>
      </Box>

      {/* Main Simulation Warning Banner per DEC-04 & BR-017 */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: "16px",
          bgcolor: "#fffaf7",
          border: "2px dashed #fed7aa",
          mb: 4,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              bgcolor: "#ffedd5",
              color: "#ea580c",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <ShieldAlert size={24} />
          </Box>

          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap", mb: 0.5 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  fontFamily: "Space Grotesk, sans-serif",
                  color: "#9a3412",
                }}
              >
                MÔ PHỎNG THANH TOÁN / SIMULATED LEDGER (BR-017)
              </Typography>
              <Chip
                label="Không phát sinh dòng tiền thật"
                size="small"
                sx={{ bgcolor: "#fee2e2", color: "#991b1b", fontWeight: 700, fontSize: "11px" }}
              />
            </Box>

            <Typography variant="body2" sx={{ color: "#7c2d12", lineHeight: 1.6, mb: 1 }}>
              <strong>Lưu ý chính sách (DEC-04):</strong> Mức phí dịch vụ nền tảng đang trong giai đoạn khảo sát chính sách. Tất cả các khoản phí dịch vụ hiển thị trạng thái <strong>"Chưa xác định"</strong>; hệ thống không tính toán số tiền thực trả hay thực nhận cuối cùng và không áp dụng bất kỳ tỷ lệ phần trăm phí nào.
            </Typography>

            <Typography variant="caption" sx={{ color: "#9a3412" }}>
              Tuân thủ quy định bảo mật thông tin tài chính (<strong>FR-061</strong>): FREVO không thu thập, không lưu trữ thông tin thẻ ngân hàng hoặc dữ liệu thanh toán nhạy cảm của người dùng.
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Active Milestones Escrow Table */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          bgcolor: "#ffffff",
          mb: 4,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#1e293b" }}>
              Mốc công việc theo hợp đồng đã chốt
            </Typography>
            <Typography variant="caption" sx={{ color: "#64748b" }}>
              Tổng ngân sách: <strong>{effectiveAgreement?.budget || project.budget}</strong>
            </Typography>
          </Box>

          <Button
            size="small"
            variant="text"
            onClick={() => setShowRetryDemo(!showRetryDemo)}
            sx={{ textTransform: "none", color: "#64748b", fontSize: "12px" }}
          >
            {showRetryDemo ? "Ẩn mô phỏng lỗi" : "Xem kịch bản thử lại lỗi (FR-059)"}
          </Button>
        </Box>

        {showRetryDemo && <PaymentRetryState onRetry={() => setShowRetryDemo(false)} />}

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {milestones.map((m, idx) => (
            <Paper
              key={m.id}
              variant="outlined"
              sx={{
                p: 2.5,
                borderRadius: "12px",
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "center" },
                gap: 2,
              }}
            >
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#1e293b" }}>
                    {idx + 1}. {m.name}
                  </Typography>
                  <Chip
                    label={
                      m.status === "completed"
                        ? "Đã giải ngân mô phỏng"
                        : m.status === "submitted"
                        ? "Đang chờ duyệt nghiệm thu"
                        : "Chưa kích hoạt"
                    }
                    size="small"
                    sx={{
                      fontSize: "11px",
                      bgcolor: m.status === "completed" ? "#dcfce7" : "#f1f5f9",
                      color: m.status === "completed" ? "#166534" : "#475569",
                      fontWeight: 600,
                    }}
                  />
                </Box>
                <Typography variant="caption" sx={{ color: "#64748b" }}>
                  {m.deliverable} · Hạn chót: {m.deadline}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                <Box sx={{ textAlign: "right" }}>
                  <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>
                    Giá trị mốc
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#f4490b" }}>
                    {m.amount}
                  </Typography>
                </Box>

                <Box sx={{ textAlign: "right" }}>
                  <Typography variant="caption" sx={{ color: "#64748b", display: "block" }}>
                    Phí FREVO
                  </Typography>
                  <Chip
                    label="Chưa xác định"
                    size="small"
                    sx={{ bgcolor: "#f1f5f9", color: "#64748b", fontSize: "10px" }}
                  />
                </Box>

                {m.status !== "completed" && (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setSelectedMilestoneToFund(m)}
                    sx={{
                      color: "#f4490b",
                      borderColor: "#f4490b",
                      textTransform: "none",
                      fontWeight: 600,
                      borderRadius: "8px",
                      "&:hover": { borderColor: "#bd3d14", bgcolor: "#fffaf7" },
                    }}
                  >
                    Mô phỏng ký quỹ
                  </Button>
                )}
              </Box>
            </Paper>
          ))}
        </Box>
      </Paper>

      {/* Disbursement History Table */}
      <DisbursementHistoryTable payments={payments} />

      {/* Dispute Concept Card */}
      <DisputeConceptCard />

      {/* Modal */}
      {selectedMilestoneToFund && (
        <FundMilestoneModal
          open={Boolean(selectedMilestoneToFund)}
          milestone={selectedMilestoneToFund}
          projectTitle={project.title}
          onClose={() => setSelectedMilestoneToFund(null)}
          onConfirmFund={handleFundConfirm}
        />
      )}
    </Container>
  );
};

export default PaymentLedgerPage;
