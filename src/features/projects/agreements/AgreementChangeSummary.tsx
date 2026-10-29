import { Box, Chip, Paper, Typography } from "@mui/material";
import type { AgreementProposal } from "@/lib/types/marketplace.types";
import { agreementChanges, type AgreementTerms } from "@/lib/utils/agreementVersions";
const labels: Record<keyof AgreementTerms, string> = { scope: "Phạm vi", deliverables: "Sản phẩm bàn giao", deadline: "Hạn hoàn thành", budget: "Ngân sách", milestones: "Kế hoạch bàn giao" };
function value(agreement: AgreementProposal, field: keyof AgreementTerms) {
  if (field !== "milestones") return agreement[field];
  return agreement.milestones.map((item, index) => `${index + 1}. ${item.name}\n${item.deliverable}\nHạn: ${item.deadline} · Chi phí: ${item.amount}\nChỉnh sửa: ${item.revisionAllowance?.allowed === "custom" ? item.revisionAllowance.customTerms || "Theo thỏa thuận" : item.revisionAllowance?.allowed ?? "Chưa cung cấp"}\n${item.acceptanceCriteria?.map(criterion => `${criterion.title}: ${criterion.description}`).join("\n") || ""}`).join("\n\n");
}
export function AgreementChangeSummary({ before, after }: { before: AgreementProposal; after: AgreementProposal }) {
  const changes = agreementChanges(before, after);
  return <Paper variant="outlined" component="section" sx={{ borderRadius: 3, overflow: "hidden", mb: 3 }}>
    <Box sx={{ px: 2.5, py: 2, bgcolor: "background.default" }}><Typography component="h2" sx={{ fontSize: 16, fontWeight: 700 }}>Thay đổi từ phiên bản {before.version} → {after.version}</Typography><Typography sx={{ mt: .5, fontSize: 12, color: "text.secondary" }}>Đối chiếu điều khoản; bản đã xác nhận chỉ được thay thế khi bản mới được chấp thuận.</Typography></Box>
    {!changes.length && <Typography sx={{ p: 2.5, fontSize: 13, color: "text.secondary" }}>Nội dung điều khoản giống phiên bản trước.</Typography>}
    {changes.map(field => <Box key={field} sx={{ p: 2.5, borderTop: "1px solid", borderColor: "divider" }}><Chip label={labels[field]} size="small" sx={{ mb: 1.5, bgcolor: "#fff0e9", color: "primary.dark" }} /><div className="grid gap-3 sm:grid-cols-2">{[{ label: `Trước · v${before.version}`, record: before }, { label: `Sau · v${after.version}`, record: after }].map(({ label, record }) => <Box key={label} sx={{ p: 2, bgcolor: "background.default", borderRadius: 2, minWidth: 0 }}><Typography sx={{ fontSize: 11, color: "text.secondary", mb: 1 }}>{label}</Typography><Typography sx={{ fontSize: 13, whiteSpace: "pre-wrap", overflowWrap: "anywhere", lineHeight: 1.7 }}>{value(record, field) || "Chưa cung cấp"}</Typography></Box>)}</div></Box>)}
  </Paper>;
}
