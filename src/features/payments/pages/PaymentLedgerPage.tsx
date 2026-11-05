import { useEffect } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Snackbar,
  Typography,
} from "@mui/material";
import {
  ArrowLeft,
  ArrowUpRight,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  Download,
  FileSignature,
  FileText,
  Layers3,
  CreditCard,
  MessageSquareText,
  Receipt,
  ReceiptText,
  ShieldAlert,
  ShieldCheck,
  Users,
  Wallet,
} from "lucide-react";
import { Link, Navigate } from "react-router";
import { ProjectBreadcrumbs } from "@/app/shared/components/ProjectBreadcrumbs";
import { usePaymentLedger } from "../hooks/usePaymentLedger";
import { FundMilestoneModal } from "../components/FundMilestoneModal";
import { DisbursementHistoryTable } from "../components/DisbursementHistoryTable";
import { formatMoneyText, parseMoneyText } from "@/lib/utils/money";

const headerActionBtnSx = {
  minHeight: 40,
  borderRadius: 999,
  bgcolor: "background.paper",
  border: "1px solid #e4e6e2",
  color: "text.primary",
  px: 2.25,
  fontSize: 13,
  fontWeight: 600,
  textTransform: "none",
  boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
  "&:hover": {
    bgcolor: "#fffaf7",
    borderColor: "primary.main",
    color: "primary.dark",
  },
};

export function PaymentLedgerPage() {
  const page = usePaymentLedger();

  useEffect(() => {
    document.title = "Sổ thanh toán & Ký quỹ | FREVO";
  }, []);

  const { project, agreement, talent } = page;

  if (!project) {
    return (
      <Paper elevation={0} sx={{ p: 5, borderRadius: "16px", textAlign: "center" }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Không tìm thấy dự án
        </Typography>
        <Button component={Link} to={page.isBusiness ? "/business/projects" : "/freelancer/applications"} sx={{ mt: 2 }}>
          Về danh sách dự án
        </Button>
      </Paper>
    );
  }

  if (!page.canAccess) {
    return <Navigate to="/forbidden" replace />;
  }

  const isOngoing = project.status === "ongoing";
  const rawBudget = agreement?.budgetValue ?? parseMoneyText(agreement?.budget ?? project.budget) ?? 0;
  const budgetFormatted = agreement?.budgetValue != null
    ? `${agreement.budgetValue.toLocaleString("vi-VN")} đ`
    : `${formatMoneyText(agreement?.budget ?? project.budget)} đ`;

  const heldTotal = page.heldTotal;
  const releasedTotal = page.releasedTotal;
  const pendingFundingTotal = Math.max(0, rawBudget - heldTotal - releasedTotal);

  const releasedPercent = rawBudget > 0 ? Math.round((releasedTotal / rawBudget) * 100) : 0;
  const heldPercent = rawBudget > 0 ? Math.round((heldTotal / rawBudget) * 100) : 0;
  const pendingPercent = Math.max(0, 100 - releasedPercent - heldPercent);

  const breadcrumbRoot = page.isBusiness
    ? (isOngoing
        ? { label: "Đang tiến hành", to: "/business/ongoing" }
        : { label: "Dự án của tôi", to: "/business/projects" })
    : { label: "Việc làm đã ứng tuyển", to: "/freelancer/applications" };

  return (
    <Box
      sx={{
        maxWidth: 1240,
        mx: "auto",
        minWidth: 0,
        py: { xs: 2.5, md: 4 },
        px: { xs: 0, md: 1 },
        "&& .MuiButton-contained": { color: "primary.contrastText" },
      }}
    >
      <ProjectBreadcrumbs
        items={[
          breadcrumbRoot,
          { label: project.title, to: isOngoing ? page.progressPath : page.projectPath },
          { label: "Sổ thanh toán & Ký quỹ" },
        ]}
      />

      {/* Top Header */}
      <Box className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <Box>
          <Box className="flex flex-wrap items-center gap-3">
            <Typography component="h1" sx={{ fontFamily: "h1.fontFamily", fontSize: { xs: 26, md: 32 }, fontWeight: 800, lineHeight: 1.3 }}>
              Sổ thanh toán & Ký quỹ<Box component="span" sx={{ color: "primary.main" }}>.</Box>
            </Typography>
            <Chip
              icon={<ShieldCheck size={14} className="text-emerald-700" />}
              size="small"
              label={agreement ? `Tài khoản Escrow · ${agreement.reference}` : "Tài khoản Escrow chưa kích hoạt"}
              sx={{
                bgcolor: "#f0fdf4",
                color: "#166534",
                fontSize: 11,
                fontWeight: 700,
                height: 26,
                border: "1px solid #bbf7d0",
                px: 0.5,
              }}
            />
          </Box>
          <Typography sx={{ mt: 0.75, color: "text.secondary", fontSize: 13, fontWeight: 500 }}>
            {project.title}
            {talent && (
              <Box component="span" sx={{ color: "text.primary", fontWeight: 700, ml: 1 }}>
                · Bên thụ hưởng: {talent.name} ({talent.kind})
              </Box>
            )}
          </Typography>
        </Box>

        <Box className="flex flex-wrap items-center gap-2">
          {isOngoing ? (
            <>
              <Button component={Link} to={page.progressPath} startIcon={<ArrowLeft size={16} />} sx={headerActionBtnSx}>
                Về tiến độ công việc
              </Button>
              <Button component={Link} to={page.agreementPath} startIcon={<FileText size={16} />} sx={headerActionBtnSx}>
                Thỏa thuận hợp tác
              </Button>
              <Button component={Link} to={page.projectPath} startIcon={<BriefcaseBusiness size={16} />} sx={headerActionBtnSx}>
                Chi tiết dự án
              </Button>
            </>
          ) : (
            <>
              <Button component={Link} to={page.projectPath} startIcon={<ArrowLeft size={16} />} sx={headerActionBtnSx}>
                Về chi tiết dự án
              </Button>
              <Button component={Link} to={`/business/projects/${project.id}/applicants`} startIcon={<Users size={16} />} sx={headerActionBtnSx}>
                Hồ sơ ứng viên
              </Button>
              <Button component={Link} to={page.agreementPath} startIcon={<FileText size={16} />} sx={headerActionBtnSx}>
                Thỏa thuận hợp tác
              </Button>
            </>
          )}
        </Box>
      </Box>

      {/* Fintech-grade Statement Panel (Bảng cân đối tài khoản ký quỹ) */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 3 },
          borderRadius: "16px",
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          mb: 4,
          boxShadow: "0 1px 3px rgba(16, 24, 40, 0.04)",
        }}
      >
        <Box className="flex flex-wrap items-center justify-between gap-2" sx={{ pb: 2.25, borderBottom: "1px solid", borderColor: "#f0f2ed" }}>
          <Box className="flex items-center gap-2">
            <Wallet size={18} className="text-primary" />
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: "text.primary" }}>
              Cân đối ngân sách & Trạng thái ký quỹ
            </Typography>
          </Box>
          <Typography sx={{ fontSize: 11.5, color: "text.secondary" }}>
            Cơ chế bảo vệ thanh toán trung gian · Chỉ giải ngân khi nghiệm thu đạt chuẩn
          </Typography>
        </Box>

        {/* 4 Financial Columns */}
        <Box
          className="grid gap-4"
          sx={{
            gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, minmax(0, 1fr))" },
            py: 2.5,
          }}
        >
          <Box>
            <Typography sx={{ fontSize: 11.5, color: "text.secondary", fontWeight: 600 }}>
              {agreement ? "Tổng giá trị hợp đồng" : "Ngân sách dự kiến brief"}
            </Typography>
            <Typography sx={{ fontFamily: "h2.fontFamily", fontSize: { xs: 22, md: 26 }, fontWeight: 800, color: "text.primary", mt: 0.75 }}>
              {budgetFormatted}
            </Typography>
            <Typography sx={{ fontSize: 11, color: "text.secondary", mt: 0.5 }}>
              {agreement ? `${page.milestones.length} mốc bàn giao` : "Dự toán theo brief"}
            </Typography>
          </Box>

          <Box sx={{ borderLeft: { md: "1px solid #f0f2ed" }, pl: { md: 3 } }}>
            <Typography sx={{ fontSize: 11.5, color: "#b43403", fontWeight: 700 }} className="flex items-center gap-1">
              <ShieldCheck size={14} />
              Đang giữ trong ký quỹ
            </Typography>
            <Typography sx={{ fontFamily: "h2.fontFamily", fontSize: { xs: 22, md: 26 }, fontWeight: 800, color: "primary.dark", mt: 0.75 }}>
              {heldTotal.toLocaleString("vi-VN")} đ
            </Typography>
            <Typography sx={{ fontSize: 11, color: "text.secondary", mt: 0.5 }}>
              {heldTotal > 0 ? "Bảo vệ an toàn chờ nghiệm thu" : "Chưa có mốc nào nạp quỹ"}
            </Typography>
          </Box>

          <Box sx={{ borderLeft: { md: "1px solid #f0f2ed" }, pl: { md: 3 } }}>
            <Typography sx={{ fontSize: 11.5, color: "#16805b", fontWeight: 700 }} className="flex items-center gap-1">
              <ArrowUpRight size={13} />
              Đã giải ngân cho đối tác
            </Typography>
            <Typography sx={{ fontFamily: "h2.fontFamily", fontSize: { xs: 22, md: 26 }, fontWeight: 800, color: "#16805b", mt: 0.75 }}>
              {releasedTotal.toLocaleString("vi-VN")} đ
            </Typography>
            <Typography sx={{ fontSize: 11, color: "text.secondary", mt: 0.5 }}>
              {releasedTotal > 0 ? "Đã nghiệm thu và chuyển tiền" : "Chưa phát sinh giải ngân"}
            </Typography>
          </Box>

          <Box sx={{ borderLeft: { md: "1px solid #f0f2ed" }, pl: { md: 3 } }}>
            <Typography sx={{ fontSize: 11.5, color: "text.secondary", fontWeight: 600 }}>
              Chưa nạp ký quỹ
            </Typography>
            <Typography sx={{ fontFamily: "h2.fontFamily", fontSize: { xs: 22, md: 26 }, fontWeight: 800, color: "text.secondary", mt: 0.75 }}>
              {pendingFundingTotal.toLocaleString("vi-VN")} đ
            </Typography>
            <Typography sx={{ fontSize: 11, color: "text.secondary", mt: 0.5 }}>
              Nạp trước khi đối tác làm mốc
            </Typography>
          </Box>
        </Box>

        {/* Visual Multi-segment Escrow Progress Bar */}
        {agreement && rawBudget > 0 && (
          <Box sx={{ pt: 1, borderTop: "1px solid", borderColor: "#f0f2ed" }}>
            <Box sx={{ height: 8, bgcolor: "#f1f5f9", borderRadius: 999, overflow: "hidden", display: "flex", width: "100%" }}>
              {releasedPercent > 0 && (
                <Box
                  sx={{
                    width: `${releasedPercent}%`,
                    bgcolor: "#10b981",
                    transition: "width 0.3s ease",
                  }}
                  title={`Đã giải ngân: ${releasedPercent}%`}
                />
              )}
              {heldPercent > 0 && (
                <Box
                  sx={{
                    width: `${heldPercent}%`,
                    bgcolor: "#f4490b",
                    transition: "width 0.3s ease",
                  }}
                  title={`Đang ký quỹ: ${heldPercent}%`}
                />
              )}
            </Box>
            <Box className="mt-2 flex flex-wrap items-center justify-between gap-2">
              <Box className="flex items-center gap-4 text-xs font-semibold">
                <Box className="flex items-center gap-1.5 text-emerald-700">
                  <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#10b981" }} />
                  Đã giải ngân: {releasedPercent}%
                </Box>
                <Box className="flex items-center gap-1.5 text-orange-700">
                  <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#f4490b" }} />
                  Đang giữ trong ký quỹ: {heldPercent}%
                </Box>
                <Box className="flex items-center gap-1.5 text-slate-500">
                  <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#cbd5e1" }} />
                  Chưa nạp quỹ: {pendingPercent}%
                </Box>
              </Box>
              <Typography sx={{ fontSize: 11, color: "text.secondary" }}>
                Phí bảo chứng FREVO Escrow: <strong>0 đ</strong>
              </Typography>
            </Box>
          </Box>
        )}
      </Paper>

      {page.error && <Alert severity="error" sx={{ mb: 3 }}>{page.error}</Alert>}

      {/* Main Two-Column Layout */}
      <Box className="grid items-start gap-6" sx={{ gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 2.3fr) minmax(290px, 1fr)" } }}>
        <Box className="flex min-w-0 flex-col gap-6">
          {/* Milestones Escrow Table */}
          <Paper elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: "16px", overflow: "hidden" }}>
            <Box className="flex flex-wrap items-center justify-between gap-3" sx={{ p: { xs: 2.25, md: 2.75 }, borderBottom: "1px solid", borderColor: "divider" }}>
              <Box>
                <Typography component="h2" className="flex items-center gap-2" sx={{ fontFamily: "h2.fontFamily", fontSize: 18, fontWeight: 800 }}>
                  <Layers3 size={19} className="text-primary" />
                  Kế hoạch giải ngân theo từng mốc bàn giao
                </Typography>
                <Typography sx={{ fontSize: 12, color: "text.secondary", mt: 0.5 }}>
                  Doanh nghiệp nạp ký quỹ trước khi đối tác bắt đầu mốc và duyệt giải ngân sau khi nghiệm thu.
                </Typography>
              </Box>
              <Chip
                size="small"
                label={agreement ? `${agreement.reference} · Phiên bản ${agreement.version}` : "Chưa kích hoạt thỏa thuận"}
                sx={{ bgcolor: "background.default", fontSize: 11, fontWeight: 600, border: "1px solid", borderColor: "divider" }}
              />
            </Box>

            {/* Empty state when no agreement/milestones (e.g. /payments/nang-brand) */}
            {!page.milestones.length ? (
              <Box sx={{ p: { xs: 3, md: 5 }, textAlign: "center" }}>
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    mx: "auto",
                    bgcolor: "background.default",
                    color: "text.secondary",
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    mb: 2,
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <ReceiptText size={24} />
                </Box>
                <Typography sx={{ fontFamily: "h3.fontFamily", fontSize: 17, fontWeight: 700, color: "text.primary" }}>
                  Chưa có lịch giải ngân cho dự án này
                </Typography>
                <Typography sx={{ fontSize: 12.5, color: "text.secondary", mt: 1, maxWidth: 440, mx: "auto", lineHeight: 1.75 }}>
                  Dự án đang trong giai đoạn tiếp nhận và xét duyệt ứng viên. Lịch ký quỹ theo mốc sẽ tự động thiết lập ngay khi bạn và bên thực hiện xác nhận Thỏa thuận hợp tác.
                </Typography>

                {/* Brief Info Box */}
                <Box
                  sx={{
                    mt: 3,
                    p: 2.25,
                    bgcolor: "background.default",
                    borderRadius: "14px",
                    border: "1px solid",
                    borderColor: "divider",
                    textAlign: "left",
                    maxWidth: 500,
                    mx: "auto",
                  }}
                >
                  <Typography sx={{ fontSize: 11, color: "text.secondary", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>
                    Dự toán từ Project Brief
                  </Typography>
                  <Box className="mt-2 grid gap-2" sx={{ gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" } }}>
                    <Box>
                      <Typography sx={{ fontSize: 11, color: "text.secondary" }}>Khung ngân sách brief:</Typography>
                      <Typography sx={{ fontSize: 13, fontWeight: 700, color: "text.primary", mt: 0.25 }}>
                        {project.budget} đ
                      </Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: 11, color: "text.secondary" }}>Thời hạn hoàn thành:</Typography>
                      <Typography sx={{ fontSize: 13, fontWeight: 700, color: "text.primary", mt: 0.25 }}>
                        {project.duration}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box className="mt-4 flex flex-wrap items-center justify-center gap-3">
                  <Button
                    component={Link}
                    to={page.agreementPath}
                    variant="contained"
                    startIcon={<FileSignature size={14} />}
                    sx={{ px: 2.5, minHeight: 40, borderRadius: 999, bgcolor: "primary.main", "&:hover": { bgcolor: "primary.dark" }, fontWeight: 700 }}
                  >
                    Soạn thỏa thuận hợp tác
                  </Button>
                  {page.isBusiness && (
                    <Button
                      component={Link}
                      to={`/business/projects/${project.id}/applicants`}
                      startIcon={<Users size={14} />}
                      sx={headerActionBtnSx}
                    >
                      Xem hồ sơ ứng viên
                    </Button>
                  )}
                </Box>
              </Box>
            ) : (
              page.milestoneRecords.map(({ milestone, payment, canFund }, index) => {
                const isReleased = payment?.status === "released_simulated";
                const isHeld = payment?.status === "held_simulated";
                return (
                  <Box
                    key={milestone.id}
                    sx={{
                      p: { xs: 2.25, md: 2.75 },
                      borderBottom: index < page.milestones.length - 1 ? "1px solid" : "none",
                      borderColor: "divider",
                    }}
                  >
                    <Box className="flex flex-wrap items-start justify-between gap-3">
                      <Box sx={{ flex: 1, minWidth: 240 }}>
                        <Box className="flex items-center gap-2">
                          <Chip
                            size="small"
                            label={`Mốc ${index + 1}`}
                            sx={{ bgcolor: "#f1f5f9", color: "text.secondary", fontSize: 11, fontWeight: 700, height: 22 }}
                          />
                          <Typography component="h3" sx={{ fontFamily: "h3.fontFamily", fontSize: 15.5, fontWeight: 700, color: "text.primary" }}>
                            {milestone.name.replace(/^Mốc\s*\d+\s*[·:–-]\s*/i, "")}
                          </Typography>
                        </Box>
                        <Typography sx={{ fontSize: 12, color: "text.secondary", lineHeight: 1.7, mt: 0.75 }}>
                          {milestone.deliverable}
                        </Typography>
                        <Typography className="mt-2 flex items-center gap-1.5" sx={{ fontSize: 11, color: "text.secondary" }}>
                          <CalendarDays size={13} />
                          Hạn bàn giao: <strong>{milestone.deadline}</strong>
                        </Typography>
                      </Box>

                      <Box className="flex flex-col items-end gap-1">
                        <Typography sx={{ fontSize: 17, fontWeight: 800, color: "text.primary", whiteSpace: "nowrap" }}>
                          {formatMoneyText(milestone.amount)} đ
                        </Typography>
                        <Typography sx={{ fontSize: 10.5, color: "text.secondary" }}>
                          Phí nền tảng: 0 đ
                        </Typography>
                      </Box>
                    </Box>

                    {/* Milestone Status & Action Row */}
                    <Box
                      className="mt-3.5 flex flex-wrap items-center justify-between gap-3"
                      sx={{ p: 1.5, bgcolor: "background.default", borderRadius: "12px", border: "1px solid", borderColor: "divider" }}
                    >
                      <Box className="flex flex-wrap items-center gap-3">
                        <Box className="flex items-center gap-1.5">
                          <Typography sx={{ fontSize: 11, color: "text.secondary" }}>Công việc:</Typography>
                          <Typography sx={{ fontSize: 11.5, fontWeight: 700, color: milestone.status === "completed" ? "#16805b" : "text.primary" }}>
                            {milestone.status === "completed"
                              ? "Đã nghiệm thu đạt chuẩn"
                              : milestone.status === "submitted"
                              ? "Chờ nghiệm thu"
                              : milestone.status === "in_progress"
                              ? "Đang triển khai"
                              : "Chưa bắt đầu"}
                          </Typography>
                        </Box>

                        <Divider orientation="vertical" flexItem sx={{ height: 14, my: "auto" }} />

                        <Box className="flex items-center gap-1.5">
                          <Typography sx={{ fontSize: 11, color: "text.secondary" }}>Ký quỹ:</Typography>
                          {isReleased ? (
                            <Chip
                              size="small"
                              icon={<CheckCircle2 size={13} className="text-emerald-700" />}
                              label="Đã giải ngân"
                              sx={{ bgcolor: "#ecfdf5", color: "#065f46", fontSize: 10.5, fontWeight: 700, height: 23, border: "1px solid #a7f3d0" }}
                            />
                          ) : isHeld ? (
                            <Chip
                              size="small"
                              icon={<ShieldCheck size={13} />}
                              label="Đã nạp ký quỹ (An toàn)"
                              sx={{ bgcolor: "#fff0e9", color: "primary.dark", fontSize: 10.5, fontWeight: 700, height: 23, border: "1px solid #ffd4c3" }}
                            />
                          ) : (
                            <Chip
                              size="small"
                              label="Chưa nạp ký quỹ"
                              sx={{ bgcolor: "background.paper", color: "text.secondary", fontSize: 10.5, fontWeight: 600, height: 23, border: "1px solid", borderColor: "divider" }}
                            />
                          )}
                        </Box>
                      </Box>

                      {/* Direct CTA */}
                      {canFund ? (
                        <Button
                          variant="contained"
                          data-testid={`fund-milestone-btn-${milestone.id}`}
                          onClick={() => page.openFund(milestone)}
                          startIcon={<CreditCard size={15} />}
                          sx={{
                            minHeight: 36,
                            borderRadius: 999,
                            px: 2.25,
                            fontSize: 12.5,
                            bgcolor: "primary.main",
                            "&:hover": { bgcolor: "primary.dark" },
                            fontWeight: 700,
                          }}
                        >
                          Nạp ký quỹ mốc này
                        </Button>
                      ) : (
                        <Typography sx={{ fontSize: 11, color: "text.secondary", fontWeight: 500 }}>
                          {payment
                            ? "Đã lưu vào lịch sử giao dịch"
                            : page.isBusiness
                            ? "Ký quỹ sẽ mở theo tiến độ"
                            : "Doanh nghiệp sẽ nạp ký quỹ trước khi bạn thực hiện"}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                );
              })
            )}
          </Paper>

          {/* Transaction History Table */}
          <DisbursementHistoryTable payments={page.payments} />
        </Box>

        {/* Sidebar: Financial & Beneficiary Utilities */}
        <Box component="aside" aria-label="Chi tiết tài chính dự án" className="flex flex-col gap-4">
          {/* Beneficiary Card */}
          {talent && (
            <Paper elevation={0} sx={{ p: 2.5, border: "1px solid", borderColor: "divider", borderRadius: "16px" }}>
              <Typography sx={{ fontSize: 11, color: "text.secondary", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, mb: 1.5 }}>
                Bên thụ hưởng giải ngân
              </Typography>
              <Box className="flex items-center gap-3">
                <Avatar sx={{ bgcolor: "#fff0e9", color: "primary.dark", fontWeight: 700, width: 44, height: 44 }}>
                  {talent.initials}
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontSize: 15, fontWeight: 700, color: "text.primary" }}>
                    {talent.name}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                    {talent.role} · {talent.kind}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid", borderColor: "divider", display: "grid", gap: 1 }}>
                <Box className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Kênh nhận tiền:</span>
                  <span className="font-semibold text-slate-800">Tài khoản ngân hàng</span>
                </Box>
                <Box className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Trạng thái định danh:</span>
                  <span className="font-semibold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 size={12} /> Đã xác thực KYC
                  </span>
                </Box>
              </Box>

              <Button
                component={Link}
                to={`/business/messages?view=project&scope=${project.id}&talent=${talent.id}`}
                startIcon={<MessageSquareText size={14} />}
                fullWidth
                sx={{
                  mt: 2,
                  minHeight: 36,
                  borderRadius: 999,
                  bgcolor: "background.default",
                  border: "1px solid #e4e6e2",
                  color: "text.primary",
                  fontSize: 12,
                  fontWeight: 600,
                  "&:hover": { bgcolor: "#fffaf7", borderColor: "primary.main", color: "primary.dark" },
                }}
              >
                Nhắn tin trao đổi
              </Button>
            </Paper>
          )}

          {/* Billing & Receipts */}
          <Paper elevation={0} sx={{ p: 2.5, border: "1px solid", borderColor: "divider", borderRadius: "16px" }}>
            <Typography sx={{ fontSize: 11, color: "text.secondary", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, mb: 1.5 }}>
              Chứng từ & Hóa đơn
            </Typography>

            <Box className="flex flex-col gap-2">
              <Box className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <Box className="flex items-center gap-2">
                  <Receipt size={15} className="text-slate-500" />
                  <span className="font-medium text-slate-700">Phiếu xác nhận ký quỹ</span>
                </Box>
                <Button size="small" startIcon={<Download size={13} />} sx={{ minHeight: 28, fontSize: 11, px: 1 }}>
                  Tải PDF
                </Button>
              </Box>

              <Box className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <Box className="flex items-center gap-2">
                  <Building2 size={15} className="text-slate-500" />
                  <span className="font-medium text-slate-700">Hóa đơn điện tử VAT</span>
                </Box>
                <Chip size="small" label="Sau giải ngân" sx={{ height: 20, fontSize: 10, bgcolor: "#f1f5f9" }} />
              </Box>
            </Box>
          </Paper>

          {/* Dispute & Escrow Rule Summary */}
          <Paper elevation={0} sx={{ p: 2.5, border: "1px solid", borderColor: "divider", borderRadius: "16px" }}>
            <Box className="flex items-center gap-2 mb-1.5">
              <ShieldAlert size={16} className="text-primary" />
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: "text.primary" }}>
                Bảo đảm an toàn giao dịch
              </Typography>
            </Box>
            <Typography sx={{ fontSize: 11.5, color: "text.secondary", lineHeight: 1.7 }}>
              Số tiền ký quỹ được giữ tại tài khoản trung gian của FREVO và chỉ được chuyển cho đối tác khi bạn xác nhận duyệt sản phẩm đạt tiêu chí brief.
            </Typography>
            <Typography sx={{ fontSize: 11.5, color: "text.secondary", lineHeight: 1.7, mt: 1 }}>
              Nếu có bất đồng hoặc đối tác giao trễ hạn, bạn có quyền giữ lại quỹ hoặc yêu cầu ban quản trị FREVO đối soát và phân xử hoàn tiền.
            </Typography>
          </Paper>
        </Box>
      </Box>

      {page.selectedMilestone && (
        <FundMilestoneModal
          open
          milestone={page.selectedMilestone}
          projectTitle={project.title}
          onClose={page.closeFund}
          onConfirmFund={page.confirmFund}
        />
      )}

      <Snackbar
        open={!!page.notice}
        message={page.notice}
        autoHideDuration={5000}
        onClose={() => page.setNotice("")}
      />
    </Box>
  );
}

export default PaymentLedgerPage;
