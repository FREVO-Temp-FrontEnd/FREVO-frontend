import { useState } from "react";
import { Link } from "react-router";
import { Alert, Avatar, Box, Button, Dialog, DialogContent, DialogTitle, Typography, Chip } from "@mui/material";
import { useBusiness } from "@/lib/hooks/useBusiness";
import type { ProjectBrief } from "@/lib/types/marketplace.types";
import { TalentPortfolioPreview } from "./TalentPortfolioPreview";
import { CandidateResumeSection } from "./CandidateResumeSection";

export function CandidateComparison({ project, suggestions = false, ids, onRemove }: { project: ProjectBrief; suggestions?: boolean; ids: string[]; onRemove: (id?: string) => void }) {
  const { talents, candidates } = useBusiness();
  const records = candidates.filter(candidate => candidate.projectId === project.id);
  const available = talents.filter(talent => suggestions || records.some(candidate => candidate.talentId === talent.id));
  const [open, setOpen] = useState(false);
  const selected = available.filter(talent => ids.includes(talent.id));
  return <>
    {selected.length > 0 && <Box role="region" aria-label="Ứng viên đã chọn so sánh" sx={{ position: "sticky", bottom: { xs: 12, sm: 20 }, zIndex: 10, bgcolor: "background.paper", border: "1px solid", borderColor: "divider", borderRadius: { xs: "18px", sm: "20px" }, p: { xs: 1.5, sm: 2 }, boxShadow: "0 6px 24px rgba(32,32,31,.08)", display: "grid", gridTemplateColumns: { xs: "minmax(0,1fr) auto", sm: "auto minmax(0,1fr) auto auto" }, alignItems: "center", columnGap: 1.5, rowGap: 1 }}>
      <Box sx={{ gridColumn: 1, gridRow: 1, display: "flex", alignItems: "center", gap: 1 }}>
        <Typography sx={{ fontSize: 13, fontWeight: 700 }}>So sánh</Typography>
        <Chip label={`${selected.length}/3`} size="small" sx={{ height: 23, bgcolor: "#fff0e9", color: "primary.dark", fontWeight: 700, fontSize: 11 }} />
      </Box>
      <Box sx={{ gridColumn: { xs: 1, sm: 2 }, gridRow: { xs: 2, sm: 1 }, display: "flex", gap: .75, minWidth: 0, overflowX: "auto", scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } }}>
        {selected.map(talent => <Chip key={talent.id} avatar={<Avatar src={talent.avatar}>{talent.initials}</Avatar>} label={talent.name} onDelete={() => onRemove(talent.id)} sx={{ bgcolor: "background.default", flexShrink: 0, maxWidth: { xs: 135, sm: 170 }, height: 30, fontSize: 11, "& .MuiChip-label": { overflow: "hidden", textOverflow: "ellipsis" }, "& .MuiChip-deleteIcon": { fontSize: 17 } }} />)}
      </Box>
      <Button onClick={() => onRemove()} aria-label="Bỏ chọn tất cả ứng viên" sx={{ gridColumn: { xs: 2, sm: 3 }, gridRow: { xs: 2, sm: 1 }, color: "text.secondary", minWidth: 0, minHeight: 36, px: 1, fontSize: "12px !important" }}>Bỏ chọn</Button>
      <Button variant="contained" disabled={selected.length < 2} onClick={() => setOpen(true)} sx={{ gridColumn: { xs: 2, sm: 4 }, gridRow: 1, minHeight: 38, px: 2, whiteSpace: "nowrap", fontSize: "12px !important" }}>{selected.length < 2 ? "Chọn thêm 1" : "So sánh"}</Button>
    </Box>}
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="lg" fullWidth aria-labelledby="compare-title">
      <DialogTitle id="compare-title"><div className="flex items-center justify-between gap-3"><span>So sánh ứng viên</span><Button onClick={() => setOpen(false)}>Đóng</Button></div><Typography color="text.secondary" sx={{ fontSize: 13 }}>{project.title}</Typography></DialogTitle>
      <DialogContent dividers>
        <Alert severity="info" sx={{ mb: 3 }}>Đối chiếu thông tin do ứng viên cung cấp. Chưa xác minh năng lực; không tự chấm điểm CV hoặc quyết định người phù hợp nhất.</Alert>
        <Box sx={{ overflowX: "auto" }}><Box sx={{ display: "grid", gridTemplateColumns: `repeat(${selected.length}, minmax(260px, 1fr))`, gap: 0, gridTemplateRows: "repeat(11, auto)" }}>
          {selected.map(talent => {
            const candidate = records.find(record => record.talentId === talent.id);
            const submission = candidate?.submission;
            const matched = project.skills.filter(skill => talent.skills.some(value => value.trim().toLocaleLowerCase() === skill.trim().toLocaleLowerCase()));
            const missing = project.skills.filter(skill => !matched.includes(skill));
            return <Box key={talent.id} sx={{ border: "1px solid", borderColor: "divider", display: "grid", gridTemplateRows: "subgrid", gridRow: "span 11", overflow: "hidden" }}>
              <Box sx={{ p: 2, bgcolor: "#fff6f1" }}><Avatar src={talent.avatar} alt="" sx={{ bgcolor: talent.color, color: "text.primary", mb: 1 }}>{talent.initials}</Avatar><Typography component="h3" sx={{ fontWeight: 700 }}>{talent.name}</Typography><Typography sx={{ fontSize: 12, color: "text.secondary" }}>{talent.kind} · {talent.role}</Typography></Box>
              {[
                ["Kỹ năng trùng brief", matched.join(", ") || "Chưa có kỹ năng trùng tên"],
                ["Kỹ năng chưa có bằng chứng", missing.join(", ") || "Đã khai báo các kỹ năng trong brief"],
                [submission?.proposedBudget != null ? "Báo giá đã gửi" : "Mức phí tham khảo", submission?.proposedBudget != null ? `${submission.proposedBudget.toLocaleString("vi-VN")} đ` : talent.rate || "Chưa cung cấp"],
                ["Ngân sách dự án", project.budget || "Chưa cung cấp"],
                ["Thời gian nhận việc", talent.availability || "Chưa cung cấp"],
                ["Thời gian bàn giao đề xuất", submission?.deliveryEstimate || "Chưa cung cấp"],
                ["Proposal", candidate?.proposal || "Chưa cung cấp"],
              ].map(([label, value]) => <Box key={label} sx={{ p: 2, borderTop: "1px solid", borderColor: "divider" }}><Typography color="text.secondary" sx={{ fontSize: 12, mb: .75 }}>{label}</Typography><Typography sx={{ fontSize: 13, overflowWrap: "anywhere", whiteSpace: "pre-wrap" }}>{value}</Typography></Box>)}
              <Box sx={{ p: 2, borderTop: "1px solid", borderColor: "divider" }}><Typography sx={{ fontSize: 12, mb: 1 }}>{submission ? "Portfolio gửi kèm" : "Portfolio công khai"}</Typography><TalentPortfolioPreview talentId={talent.id} talentName={talent.name} submittedWorks={submission?.portfolioWorks} /></Box>
              {candidate && <Box sx={{ p: 1 }}><CandidateResumeSection candidate={candidate} project={project} talent={talent} enabled={open} /></Box>}
              <Button component={Link} to={`/business/talent/${encodeURIComponent(talent.id)}`} sx={{ m: 1 }}>Xem hồ sơ đầy đủ</Button>
            </Box>;
          })}
        </Box></Box>
      </DialogContent>
    </Dialog>
  </>;
}
