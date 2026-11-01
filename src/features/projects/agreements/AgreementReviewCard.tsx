import { Avatar, Box, Chip, Paper, Stack, Typography } from "@mui/material";
import { Check, FileText, Info } from "lucide-react";
import type { AgreementProposal, ProjectBrief, TalentProfile } from "@/lib/types/marketplace.types";
import { formatMoneyText } from "@/lib/utils/money";

interface AgreementReviewCardProps {
  agreement: AgreementProposal;
  project: ProjectBrief;
  talent: TalentProfile;
}

const headingSx = { fontFamily: "h3.fontFamily", fontSize: 19, fontWeight: 700, mb: 2 };
const bodySx = { maxWidth: "70ch", fontSize: 16, lineHeight: 1.75, whiteSpace: "pre-line", overflowWrap: "anywhere" };

export function AgreementReviewCard({ agreement, project, talent }: AgreementReviewCardProps) {
  return <Paper component="article" aria-label="Nội dung thỏa thuận" variant="outlined" sx={{ borderRadius: "13px", overflow: "hidden" }}>
    <Box sx={{ px: { xs: 2.5, md: 4 }, py: 3, borderBottom: "1px solid", borderColor: "divider", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
        <Box sx={{ p: 1.25, bgcolor: "#fff0e9", borderRadius: "10px", color: "primary.dark", display: "flex" }}><FileText size={22} aria-hidden="true" /></Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography color="text.secondary" sx={{ fontSize: 13 }}>Nội dung thỏa thuận</Typography>
          <Typography component="h2" sx={{ fontFamily: "h2.fontFamily", fontSize: 21, fontWeight: 800, mt: 0.25, overflowWrap: "anywhere" }}>{agreement.reference}</Typography>
        </Box>
      </Box>
      <Chip label={`Phiên bản ${agreement.version}`} size="small" variant="outlined" />
    </Box>
    <Stack spacing={4} sx={{ p: { xs: 2.5, md: 4 } }}>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "repeat(2, minmax(0, 1fr))" }, gap: 2 }}>
        {[
          { name: project.company, label: "Bên giao việc", initials: project.company.slice(0, 1) },
          { name: talent.name, label: `Bên thực hiện · ${talent.kind}`, initials: talent.initials },
        ].map(party => <Box key={party.label} sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 2, bgcolor: "background.default", borderRadius: "10px", minWidth: 0 }}>
          <Avatar sx={{ bgcolor: "#fff0e9", color: "primary.dark", fontSize: 14, fontWeight: 700 }}>{party.initials}</Avatar>
          <Box sx={{ minWidth: 0 }}><Typography sx={{ fontSize: 13, color: "text.secondary" }}>{party.label}</Typography><Typography sx={{ fontWeight: 700, fontSize: 15, mt: 0.5, overflowWrap: "anywhere" }}>{party.name}</Typography></Box>
        </Box>)}
      </Box>

      <Box component="section" aria-labelledby="agreement-scope">
        <Typography component="h3" id="agreement-scope" sx={headingSx}>Phạm vi công việc</Typography>
        <Typography sx={bodySx}>{agreement.scope}</Typography>
      </Box>
      <Box component="section" aria-labelledby="agreement-deliverables">
        <Typography component="h3" id="agreement-deliverables" sx={headingSx}>Sản phẩm bàn giao</Typography>
        <Stack component="ul" spacing={1.5} sx={{ listStyle: "none", m: 0, p: 0 }}>
          {agreement.deliverables.split("\n").filter(Boolean).map((item, index) => <Box component="li" key={index} sx={{ display: "flex", alignItems: "start", gap: 1.25 }}>
            <Check size={18} aria-hidden="true" style={{ flexShrink: 0, marginTop: 5 }} /><Typography sx={bodySx}>{item}</Typography>
          </Box>)}
        </Stack>
      </Box>
      <Box component="section" aria-labelledby="agreement-milestones">
        <Typography component="h3" id="agreement-milestones" sx={headingSx}>Kế hoạch bàn giao</Typography>
        {!agreement.milestones.length && <Typography color="text.secondary">Chưa có mốc công việc trong phiên bản này.</Typography>}
        <Stack spacing={2}>
          {agreement.milestones.map((milestone, index) => <Box key={milestone.id} sx={{ border: "1px solid", borderColor: "divider", borderRadius: "10px", p: { xs: 2, md: 2.5 }, minWidth: 0 }}>
            <Box sx={{ display: "flex", alignItems: "start", justifyContent: "space-between", gap: 1.5, flexWrap: "wrap", mb: 1.5 }}>
              <Typography component="h4" sx={{ fontSize: 16, fontWeight: 700, overflowWrap: "anywhere" }}>{index + 1}. {milestone.name.replace(/^Mốc\s*\d+\s*[·:–-]\s*/i, "")}</Typography>
              <Typography sx={{ fontSize: 16, fontWeight: 700, color: "primary.dark", fontVariantNumeric: "tabular-nums" }}>{formatMoneyText(milestone.amount)} đ</Typography>
            </Box>
            <Typography sx={bodySx}>{milestone.deliverable}</Typography>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 1.5 }}>
              <Typography variant="body2" color="text.secondary">Hạn bàn giao: {milestone.deadline}</Typography>
              <Typography variant="body2" color="text.secondary">Chỉnh sửa: {milestone.revisionAllowance?.allowed === "custom" ? milestone.revisionAllowance.customTerms || "Theo thỏa thuận" : milestone.revisionAllowance ? `${milestone.revisionAllowance.allowed} lượt` : "Chưa thống nhất"}</Typography>
            </Box>
            {!!milestone.acceptanceCriteria?.length && <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid", borderColor: "divider" }}>
              <Typography sx={{ fontSize: 14, fontWeight: 700, mb: 1 }}>Tiêu chí nghiệm thu</Typography>
              <Stack component="ul" spacing={1} sx={{ pl: 2.5, m: 0 }}>{milestone.acceptanceCriteria.map((criterion, criterionIndex) => <Typography component="li" key={criterionIndex} variant="body2" sx={{ overflowWrap: "anywhere" }}><Box component="span" sx={{ fontWeight: 600 }}>{criterion.title}</Box>{criterion.description && `: ${criterion.description}`}</Typography>)}</Stack>
            </Box>}
          </Box>)}
        </Stack>
      </Box>
      <Box sx={{ display: "flex", gap: 1.25, alignItems: "start", p: 2, bgcolor: "background.default", borderRadius: "10px" }}>
        <Info size={19} aria-hidden="true" style={{ flexShrink: 0, marginTop: 2 }} />
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>Bản tóm tắt ghi nhận nội dung hai bên thống nhất trên FREVO; không mặc định là hợp đồng điện tử. Thay đổi nội dung cần tạo phiên bản mới và được bên còn lại xác nhận.</Typography>
      </Box>
    </Stack>
  </Paper>;
}
