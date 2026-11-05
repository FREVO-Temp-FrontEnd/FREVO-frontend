import { Avatar, Box, Button, Paper, Stack, Typography } from "@mui/material";
import { FilePenLine, FileText, MessageCircle, Wallet } from "lucide-react";
import { Link } from "react-router";
import type { AgreementProposal, PaymentSimulation, TalentProfile } from "@/lib/types/marketplace.types";
import { formatMoneyText } from "@/lib/utils/money";

interface WorkspaceContextSidebarProps {
  agreement: AgreementProposal;
  talent?: TalentProfile;
  company: string;
  isBusiness: boolean;
  payments: PaymentSimulation[];
  agreementPath: string;
  paymentPath: string;
  chatPath: string;
  onScopeChange: () => void;
}

const panelSx = { p: { xs: 2.5, md: 3 }, borderRadius: "13px", minWidth: 0 };
const headingSx = { fontFamily: "h2.fontFamily", fontSize: 18, fontWeight: 700 };
export function WorkspaceContextSidebar({ agreement, talent, company, isBusiness, payments, agreementPath, paymentPath, chatPath, onScopeChange }: WorkspaceContextSidebarProps) {
  const allowances = [...new Set(agreement.milestones.map(item => item.revisionAllowance?.allowed))];
  const partner = isBusiness ? talent?.name ?? "Bên thực hiện" : company;
  const paymentLabel = !payments.length ? "Chưa có giao dịch" : payments.some(item => item.status === "released_simulated") ? "Có mốc đã giải ngân" : "Đã nạp ký quỹ";
  return <Stack component="aside" aria-label="Thông tin hợp tác" spacing={3} sx={{ minWidth: 0 }}>
    <Paper variant="outlined" sx={panelSx}>
      <Typography component="h2" sx={headingSx}>Thông tin hợp tác</Typography>
      <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", mt: 2.5, mb: 2.5 }}>
        <Avatar sx={{ bgcolor: "#fff0e9", color: "primary.dark", fontSize: 14, fontWeight: 700 }}>{isBusiness ? talent?.initials ?? "FL" : company.slice(0, 2).toUpperCase()}</Avatar>
        <Box sx={{ minWidth: 0 }}><Typography sx={{ fontWeight: 700, fontSize: 15, overflowWrap: "anywhere" }}>{partner}</Typography><Typography variant="body2" color="text.secondary">{isBusiness ? talent?.kind ?? "Freelancer" : "Doanh nghiệp"}</Typography></Box>
      </Box>
      <Box component="dl" sx={{ m: 0, display: "grid", gap: 2, "& dt": { fontSize: 13, color: "text.secondary" }, "& dd": { m: 0, mt: 0.5, fontSize: 15, fontWeight: 600, overflowWrap: "anywhere" } }}>
        <Box><Typography component="dt">Ngân sách thống nhất</Typography><Typography component="dd">{formatMoneyText(agreement.budget)} đ</Typography></Box>
        <Box><Typography component="dt">Hạn hoàn thành</Typography><Typography component="dd">{agreement.deadline}</Typography></Box>
        <Box><Typography component="dt">Thỏa thuận có hiệu lực</Typography><Typography component="dd">{agreement.reference} · Phiên bản {agreement.version}</Typography></Box>
      </Box>
      <Stack spacing={1.5} sx={{ mt: 3, pt: 2.5, borderTop: "1px solid", borderColor: "divider" }}>
        <Button component={Link} to={agreementPath} variant="outlined" color="secondary" startIcon={<FileText size={17} aria-hidden="true" />}>Xem thỏa thuận</Button>
        <Button component={Link} to={chatPath} variant="outlined" color="secondary" startIcon={<MessageCircle size={17} aria-hidden="true" />}>Tin nhắn dự án</Button>
      </Stack>
    </Paper>
    <Paper variant="outlined" sx={panelSx}>
      <Typography component="h2" sx={headingSx}>Quy tắc bàn giao</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2, lineHeight: 1.7 }}>
        {allowances.length === 1 && typeof allowances[0] === "number" ? `Mỗi mốc gồm ${allowances[0]} lượt chỉnh sửa trong phạm vi đã thống nhất.` : "Số lượt chỉnh sửa theo nội dung riêng của từng mốc."}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5, lineHeight: 1.7 }}>Thay đổi ngoài phạm vi cần hai bên xác nhận đề xuất điều chỉnh trước khi áp dụng.</Typography>
      <Button onClick={onScopeChange} startIcon={<FilePenLine size={17} aria-hidden="true" />} sx={{ mt: 2, color: "primary.dark" }}>Điều chỉnh phạm vi</Button>
    </Paper>
    {!isBusiness && <Paper variant="outlined" sx={panelSx}>
      <Typography component="h2" sx={headingSx}>Thanh toán</Typography>
      <Typography variant="body2" sx={{ mt: 2, fontWeight: 600 }}>{paymentLabel}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1, lineHeight: 1.7 }}>Nghiệm thu và giải ngân được bảo vệ qua tài khoản FREVO Escrow theo từng mốc hợp tác.</Typography>
      <Button component={Link} to={paymentPath} startIcon={<Wallet size={17} aria-hidden="true" />} sx={{ mt: 2, color: "primary.dark" }}>Sổ thanh toán</Button>
    </Paper>}
  </Stack>;
}
