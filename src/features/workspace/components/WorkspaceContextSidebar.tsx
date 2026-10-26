import { Avatar, Box, Button, Chip, Divider, Paper, Typography } from "@mui/material";
import { Check, FilePenLine, Info, MessageCircle, ShieldCheck } from "lucide-react";
import { Link } from "react-router";
import type { AgreementProposal, PaymentSimulation, TalentProfile } from "@/lib/types/marketplace.types";

interface WorkspaceContextSidebarProps {
  agreement: AgreementProposal;
  talent?: TalentProfile;
  payments: PaymentSimulation[];
  chatPath: string;
  onScopeChange: () => void;
}

export function WorkspaceContextSidebar({ agreement, talent, payments, chatPath, onScopeChange }: WorkspaceContextSidebarProps) {
  const allowances = [...new Set(agreement.milestones.map(item => item.revisionAllowance?.allowed ?? 2))];
  const paymentLabel = !payments.length ? "Chưa có giao dịch mô phỏng" : payments.some(item => item.status === "released_simulated") ? "Có mốc đã giải ngân mô phỏng" : "Có giao dịch mô phỏng";
  return <Box component="aside" aria-label="Thông tin hợp tác" className="flex flex-col gap-5">
    <Paper elevation={0} sx={{ p: 2.75, borderRadius: "16px", border: "1px solid", borderColor: "divider" }}>
      <Box className="flex flex-wrap items-center justify-between gap-2">
        <Typography
          className="flex items-center gap-1.5"
          component="h2"
          sx={{ fontSize: 14, fontFamily: "h3.fontFamily", fontWeight: 700 }}>
          <ShieldCheck size={17} />Thỏa thuận
        </Typography>
        <Chip size="small" label="Đã xác nhận" sx={{ height: 22, fontSize: 9, bgcolor: "#e8f7ef", color: "#16805b" }} />
      </Box>
      <Typography sx={{ fontWeight: 700, fontSize: 16, mt: .75 }}>{agreement.reference}</Typography>
      <Box className="my-5 flex items-center gap-3" sx={{ bgcolor: "background.default", p: 1.5, borderRadius: "12px" }}>
        <Avatar sx={{ width: 40, height: 40, bgcolor: "#fff0e9", color: "primary.dark", fontSize: 14 }}>{talent?.initials ?? "FL"}</Avatar>
        <Box>
          <Typography sx={{ fontSize: 13, fontWeight: 700 }}>{talent?.name ?? "Bên thực hiện"}</Typography>
          <Typography sx={{ fontSize: 10, color: "text.secondary", mt: .5 }}>{talent?.role ?? "Freelancer"}</Typography>
        </Box>
      </Box>
      <Box className="flex flex-col gap-3">
        <Box className="flex justify-between gap-2">
          <Typography sx={{ fontSize: 12, color: "text.secondary" }}>Tổng chi phí</Typography>
          <Typography sx={{ fontSize: 13, fontWeight: 700 }}>{agreement.budget}</Typography>
        </Box>
        <Box className="flex justify-between gap-2">
          <Typography sx={{ fontSize: 12, color: "text.secondary" }}>Số lượng mốc</Typography>
          <Typography sx={{ fontSize: 12 }}>{agreement.milestones.length} mốc thực thi</Typography>
        </Box>
      </Box>
      <Divider sx={{ my: 2.25 }} />
      <Typography sx={{ fontSize: 12, fontWeight: 600, mb: 1.25 }}>Các trạng thái cần phân biệt</Typography>
      {[["Đã gửi bàn giao", "Chờ kiểm tra sản phẩm"], ["Đã nghiệm thu", "Được chấp nhận theo tiêu chí"], ["Giải ngân mô phỏng", "Theo dõi riêng ở sổ thanh toán"]].map(([title, detail], index) => <Box key={title} className="flex items-start gap-2" sx={{ mt: 1.25 }}>
        <Box
          sx={{ width: 6, height: 6, bgcolor: index === 1 ? "#16805b" : "primary.main", borderRadius: "50%", mt: .6, flexShrink: 0 }} />
        <Typography sx={{ fontSize: 10, color: "text.secondary" }}>
          <Box component="span" sx={{ fontWeight: 600, color: "text.primary" }}>{title}</Box> · {detail}
        </Typography>
      </Box>)}
      <Box sx={{ mt: 2, p: 1.5, borderRadius: "10px", bgcolor: "background.default" }}>
        <Typography sx={{ fontSize: 10, fontWeight: 600 }}>{paymentLabel}</Typography>
        <Typography sx={{ fontSize: 10, color: "text.secondary", mt: .5 }}>Không có tiền thật được chuyển trong prototype.</Typography>
      </Box>
    </Paper>
    <Paper elevation={0} sx={{ p: 2.75, borderRadius: "16px", border: "1px solid", borderColor: "divider" }}>
      <Typography component="h2" sx={{ fontSize: 14, fontFamily: "h3.fontFamily", fontWeight: 700, mb: 2 }}>Quy tắc chỉnh sửa & nghiệm thu</Typography>
      <Box className="flex items-start gap-2">
        <Check size={17} className="shrink-0" />
        <Typography sx={{ fontSize: 12, color: "text.secondary" }}>{allowances.length === 1 && typeof allowances[0] === "number" ? `Mỗi mốc gồm ${allowances[0]} lượt chỉnh sửa trong phạm vi đã thống nhất.` : "Số lượt chỉnh sửa theo nội dung riêng của từng mốc."}</Typography>
      </Box>
      <Box className="mt-4 flex items-start gap-2">
        <Info size={17} className="shrink-0" />
        <Typography sx={{ fontSize: 12, color: "text.secondary" }}>Thay đổi ngoài brief cần hai bên xác nhận đề xuất điều chỉnh trước khi áp dụng.</Typography>
      </Box>
      <Button
        onClick={onScopeChange}
        startIcon={<FilePenLine size={15} />}
        sx={{ mt: 2, fontSize: 11, justifyContent: "flex-start", px: 0 }}>Đề xuất điều chỉnh phạm vi</Button>
      <Typography sx={{ fontSize: 10, color: "text.secondary", mt: 1 }}>Quy tắc minh họa cho không gian làm việc mô phỏng.</Typography>
    </Paper>
    <Paper elevation={0} sx={{ p: 2.75, borderRadius: "16px", bgcolor: "#fff0e9" }}>
      <Typography
        className="flex items-center gap-2"
        component="h2"
        sx={{ fontSize: 14, fontFamily: "h3.fontFamily", fontWeight: 700 }}>
        <MessageCircle size={18} />Trao đổi trực tiếp
      </Typography>
      <Typography sx={{ mt: 1.25, fontSize: 12, color: "text.secondary", lineHeight: 1.8 }}>Cần làm rõ nội dung bàn giao hoặc hướng thiết kế trước khi phản hồi? Trao đổi trong kênh chat dự án.</Typography>
      <Button
        component={Link}
        to={chatPath}
        startIcon={<MessageCircle size={15} />}
        sx={{ mt: 2, bgcolor: "background.paper", color: "text.primary", fontSize: 11, px: 2 }}>Mở chat dự án</Button>
    </Paper>
  </Box>;
}
