import { Alert, Avatar, Box, Button, Chip, Divider, Paper, Typography } from "@mui/material";
import { CalendarDays, Check, CheckCircle2, ClipboardList, Clock3, FileCheck2, FilePenLine, Handshake, Info, Layers3, X } from "lucide-react";
import type { AgreementProposal, ProjectBrief, TalentProfile } from "@/lib/types/marketplace.types";
import { formatMoneyText } from "@/lib/utils/money";

interface AgreementReviewCardProps {
  agreement: AgreementProposal;
  project: ProjectBrief;
  talent: TalentProfile;
  isBusiness?: boolean;
  isLatestVersion?: boolean;
  onConfirm: () => void;
  onRequestRevision: () => void;
  onDecline?: () => void;
}

export function AgreementReviewCard({ agreement, project, talent, isBusiness, isLatestVersion = true, onConfirm, onRequestRevision, onDecline }: AgreementReviewCardProps) {
  const hoursRemaining = Math.max(0, Math.ceil((Date.parse(agreement.expiresAt) - Date.now()) / 3600000));
  const isExpired = agreement.status === "expired" || (agreement.status === "pending" && !hoursRemaining);
  const isPending = agreement.status === "pending" && !isExpired;
  const status = agreement.isEffective ? "Đang có hiệu lực" : agreement.status === "confirmed" ? "Đã xác nhận · Bản cũ" : agreement.status === "superseded" ? "Không còn hiệu lực" : agreement.status === "rejected" ? "Đã từ chối" : isExpired ? "Đã hết hạn" : "Chờ phản hồi";
  return <Paper elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: "16px", overflow: "hidden" }}>
    <Box sx={{ px: { xs: 2.5, md: 3.5 }, py: 2.5, borderBottom: "1px solid", borderColor: "divider" }} className="flex flex-wrap items-center justify-between gap-3">
      <Box className="flex items-center gap-3"><Box sx={{ width: 40, height: 44, display: "grid", placeItems: "center", borderRadius: "10px", bgcolor: "#fff0e9", color: "primary.dark" }}><FileCheck2 size={22} /></Box><Box><Typography sx={{ fontSize: 11, color: "text.secondary" }}>Thỏa thuận hợp tác</Typography><Typography component="h2" sx={{ fontFamily: "h2.fontFamily", fontSize: 19, fontWeight: 800, mt: .5 }}>{agreement.reference}</Typography></Box></Box>
      <Box className="flex flex-wrap items-center gap-2"><Chip size="small" label={`Phiên bản ${agreement.version}`} sx={{ fontSize: 10, bgcolor: "background.default" }} /><Chip size="small" icon={agreement.isEffective ? <CheckCircle2 size={13} /> : <Clock3 size={13} />} label={status} sx={{ height: 25, fontSize: 10, bgcolor: agreement.isEffective ? "#e8f7ef" : "#fff0e9", color: agreement.isEffective ? "#16805b" : "primary.dark" }} /></Box>
    </Box>
    <Box sx={{ p: { xs: 2.5, md: 3.5 } }}>
      <Box className="grid gap-3" sx={{ gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, mb: 3.5 }}>
        {[[project.company, "Bên giao việc", project.company.slice(0, 1)], [talent.name, `Bên thực hiện · ${talent.kind}`, talent.initials]].map(([name, label, initials]) => <Box key={label} className="flex items-center gap-3" sx={{ p: 2, bgcolor: "background.default", borderRadius: "12px" }}><Avatar sx={{ bgcolor: "#fff0e9", color: "primary.dark", width: 38, height: 38, fontSize: 13 }}>{initials}</Avatar><Box><Typography sx={{ fontSize: 10, color: "text.secondary" }}>{label}</Typography><Typography sx={{ fontSize: 14, fontWeight: 700, mt: .5 }}>{name}</Typography></Box></Box>)}
      </Box>
      {isPending && <Alert severity="info" icon={<Clock3 size={19} />} sx={{ mb: 3, bgcolor: "#fff0e9", color: "primary.dark", fontSize: 12, borderRadius: "12px" }}>{isLatestVersion ? `Đề xuất chờ phản hồi trong 3 ngày kể từ khi gửi. Còn khoảng ${hoursRemaining} giờ.${isBusiness ? " Bên thực hiện sẽ xem xét và xác nhận nội dung này." : " Hãy kiểm tra nội dung trước khi xác nhận."}` : "Đây là phiên bản đề xuất trước đó. Vui lòng xem phiên bản mới nhất để phản hồi."}</Alert>}
      <Box component="section" sx={{ mb: 3.5 }}><Typography component="h3" className="flex items-center gap-2" sx={{ fontFamily: "h3.fontFamily", fontSize: 17, fontWeight: 700, mb: 1.5 }}><ClipboardList size={19} />Phạm vi công việc</Typography><Typography sx={{ fontSize: 13, color: "text.secondary", lineHeight: 1.9, whiteSpace: "pre-line" }}>{agreement.scope}</Typography></Box>
      <Divider sx={{ mb: 3 }} />
      <Box component="section" sx={{ mb: 3.5 }}><Typography component="h3" className="flex items-center gap-2" sx={{ fontFamily: "h3.fontFamily", fontSize: 17, fontWeight: 700, mb: 2 }}><FileCheck2 size={19} />Sản phẩm bàn giao</Typography><Box component="ul" sx={{ listStyle: "none", p: 0, m: 0 }} className="flex flex-col gap-3">{agreement.deliverables.split("\n").filter(Boolean).map(item => <Box component="li" key={item} className="flex items-start gap-2.5"><Box sx={{ mt: .2, color: "#16805b", flexShrink: 0 }}><Check size={16} /></Box><Typography sx={{ fontSize: 13, color: "text.secondary", lineHeight: 1.7 }}>{item}</Typography></Box>)}</Box></Box>
      <Divider sx={{ mb: 3 }} />
      <Box component="section"><Box className="mb-5 flex flex-wrap items-center justify-between gap-2"><Typography component="h3" className="flex items-center gap-2" sx={{ fontFamily: "h3.fontFamily", fontSize: 17, fontWeight: 700 }}><Layers3 size={19} />Kế hoạch bàn giao</Typography><Chip size="small" label={`${agreement.milestones.length} mốc công việc`} sx={{ fontSize: 10, bgcolor: "background.default" }} /></Box>
        {!agreement.milestones.length && <Typography sx={{ fontSize: 12, color: "text.secondary" }}>Chưa có mốc công việc trong phiên bản này.</Typography>}
        <Box className="flex flex-col gap-3">{agreement.milestones.map((milestone, index) => <Box key={milestone.id} sx={{ p: 2, bgcolor: "background.default", borderRadius: "12px" }}>
          <Box className="flex items-start gap-3"><Typography sx={{ fontFamily: "h2.fontFamily", fontWeight: 800, fontSize: 27, color: "#d6d9d1", lineHeight: 1.2 }}>{String(index + 1).padStart(2, "0")}</Typography><Box sx={{ flex: 1, minWidth: 0 }}><Box className="flex flex-wrap items-start justify-between gap-2"><Typography sx={{ fontWeight: 700, fontSize: 14 }}>{milestone.name.replace(/^Mốc\s*\d+\s*[·:–-]\s*/i, "")}</Typography><Typography sx={{ fontWeight: 700, color: "primary.dark", fontSize: 14, whiteSpace: "nowrap" }}>{formatMoneyText(milestone.amount)} đ</Typography></Box><Typography sx={{ fontSize: 12, lineHeight: 1.8, color: "text.secondary", mt: .75 }}>{milestone.deliverable}</Typography><Box className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1"><Typography className="flex items-center gap-1" sx={{ fontSize: 10, color: "text.secondary" }}><CalendarDays size={12} />{milestone.deadline}</Typography><Typography sx={{ fontSize: 10, color: "text.secondary" }}>Chỉnh sửa: {milestone.revisionAllowance?.allowed === "custom" ? "Theo thỏa thuận" : `${milestone.revisionAllowance?.allowed ?? 2} lượt`}</Typography></Box></Box></Box>
        </Box>)}</Box>
      </Box>
      <Box className="mt-7 flex items-start gap-2.5" sx={{ p: 2, bgcolor: "background.default", borderRadius: "12px" }}><Info size={17} className="shrink-0" /><Typography sx={{ fontSize: 11, color: "text.secondary", lineHeight: 1.8 }}>Bản tóm tắt ghi nhận nội dung hai bên thống nhất trên FREVO; không mặc định là hợp đồng điện tử. Thay đổi nội dung cần tạo phiên bản mới và được bên còn lại xác nhận.</Typography></Box>
      {isPending && isLatestVersion && <Box className="mt-5 flex flex-wrap items-center justify-end gap-2" sx={{ pt: 2.5, borderTop: "1px solid", borderColor: "divider" }}>{isBusiness ? <Button onClick={onRequestRevision} startIcon={<FilePenLine size={15} />} sx={{ fontSize: 12 }}>Điều chỉnh đề xuất</Button> : <><Button onClick={onDecline} startIcon={<X size={15} />} sx={{ color: "text.secondary", fontSize: 12 }}>Từ chối đề xuất</Button><Button variant="contained" onClick={onConfirm} startIcon={<Handshake size={16} />} sx={{ fontSize: 12, px: 2.5 }}>Xác nhận thỏa thuận</Button></>}</Box>}
    </Box>
  </Paper>;
}
