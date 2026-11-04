import { CandidateComparison } from "./CandidateComparison";
import { useState } from "react";
import { Link } from "react-router";
import { Alert, Avatar, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputAdornment, Menu, MenuItem, Snackbar, TextField, Typography } from "@mui/material";
import { CheckCircle2, Clock3, FileUser, MailCheck, MessageCircle, MoreHorizontal, Search, Users } from "lucide-react";
import type { Candidate, CandidateStatus, ProjectBrief, TalentProfile } from "@/lib/types/marketplace.types";
import { matchesCandidateFilter, useProjectApplicants, type CandidateDecision, type CandidateFilter } from "../hooks/useProjectApplicants";
import { TalentPortfolioPreview } from "./TalentPortfolioPreview";
import { CandidateReviewModal } from "./CandidateReviewModal";

const statusLabels: Record<CandidateStatus, string> = { new: "Chờ duyệt", under_review: "Chờ duyệt", discussing: "Đã duyệt", offer: "Chờ xác nhận thỏa thuận", selected: "Đã chọn", not_selected: "Không được chọn" };
const pillSx = { minHeight: 40, borderRadius: 999, px: 2, fontSize: 13, whiteSpace: "nowrap" } as const;
interface CardProps {
  candidate: Candidate; talent: TalentProfile; project: ProjectBrief; priority: boolean;
  onCompare: () => void; comparing: boolean; compareDisabled: boolean;
  onReview: () => void; onDecision: (action: CandidateDecision["action"]) => void;
}
function CandidateCard({ candidate, talent, project, priority, onReview, onDecision, onCompare, comparing, compareDisabled }: CardProps) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const pending = matchesCandidateFilter(candidate, "pending");
  const canDecide = project.status === "published" && pending && !candidate.chatUnlocked;
  const canChat = candidate.chatUnlocked && candidate.status !== "not_selected";
  return <Box
    component="article"
    className="grid min-w-0 gap-5 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4 sm:px-5 xl:grid-cols-[minmax(210px,1fr)_minmax(180px,0.8fr)_auto] xl:items-center xl:gap-6"
    sx={{ transition: "all 150ms ease", "&:hover": { bgcolor: "#ffffff", borderColor: "#b8c0cc", boxShadow: "0 4px 12px rgba(16, 24, 40, 0.06)", transform: "translateY(-1px)" } }}
  >
    <div className="flex min-w-0 items-start gap-3.5">
      <Avatar src={talent.avatar} alt={talent.name} sx={{ bgcolor: talent.color, color: "text.primary", width: 48, height: 48, fontSize: 16, fontWeight: 700 }}>{talent.initials}</Avatar>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <Typography component="h3" sx={{ fontSize: 17, fontWeight: 700, lineHeight: 1.4 }}>{talent.name}</Typography>
          <Chip label={talent.kind} size="small" sx={{ height: 22, bgcolor: "#f2f3f0", color: "#62665f", fontSize: 11, "& .MuiChip-label": { px: 1 } }} />
          {candidate.unread && <span className="size-1.5 rounded-full bg-[#f4490b]" title="Hồ sơ mới" />}
        </div>
        <p className="mt-1 text-sm leading-5 text-[#747773]">{talent.role}</p>
        {priority && <p className="mt-2 flex items-start gap-1.5 text-xs leading-5 text-[#62665f]"><Clock3 size={13} className="mt-0.5 shrink-0" aria-hidden="true" />{talent.availability}</p>}
      </div>
    </div>

    <TalentPortfolioPreview talentId={talent.id} talentName={talent.name} />

    <div className="min-w-0 border-t border-[#eeefeb] pt-4 xl:min-w-[290px] xl:border-0 xl:pt-0">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <div><p className="text-[11px] leading-4 text-[#747773]">Mức phí dự kiến</p><p className="mt-0.5 text-[15px] font-bold leading-[22px] text-[#20201f]">{talent.rate}</p></div>
        <Chip label={statusLabels[candidate.status]} size="small" sx={{ height: "auto", minHeight: 24, maxWidth: 160, "& .MuiChip-label": { whiteSpace: "normal", py: 0.4 }, bgcolor: pending ? "#fff4eb" : canChat ? "#e8f7ef" : "#f2f3f0", color: pending ? "#9a4a1b" : canChat ? "#16805b" : "#62625e", fontSize: 11, fontWeight: 600 }} />
      </div>
      <div className="flex flex-wrap items-center gap-2 xl:justify-end">
        <Button onClick={onReview} sx={{ ...pillSx, bgcolor: "#f2f3f0", color: "text.primary", "&:hover": { bgcolor: "#e9ece5" } }}>Xem hồ sơ</Button>
        {canDecide && <Button onClick={() => onDecision("approve")} variant="contained" sx={pillSx}>Duyệt trao đổi</Button>}
        {canChat && <Button component={Link} to={`/business/messages?view=project&scope=${project.id}&project=${project.id}&talent=${candidate.talentId}`} variant="contained" startIcon={<MessageCircle size={15} />} sx={pillSx}>Nhắn tin</Button>}
        {<IconButton aria-label={`Thao tác với ${talent.name}`} aria-haspopup="menu" aria-expanded={Boolean(anchor)} onClick={event => setAnchor(event.currentTarget)} sx={{ width: 36, height: 40, color: "text.secondary" }}><MoreHorizontal size={18} /></IconButton>}
      </div>
    </div>
    <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}><MenuItem disabled={compareDisabled} onClick={() => { setAnchor(null); onCompare(); }}>{comparing ? "Bỏ khỏi so sánh" : compareDisabled ? "Đã chọn tối đa 3 ứng viên" : "Thêm vào so sánh"}</MenuItem>{canDecide && <MenuItem onClick={() => { setAnchor(null); onDecision("reject"); }} sx={{ color: "error.main", fontSize: 14 }}>Từ chối hồ sơ</MenuItem>}</Menu>
  </Box>;
}

export function ProjectApplicantsTab({ project }: { project: ProjectBrief }) {
  const vm = useProjectApplicants(project);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const { selectedCandidate, decision } = vm;
  const filtered = vm.query.trim() !== "" || vm.statusFilter !== "all";
  const filters: { value: CandidateFilter; label: string }[] = [{ value: "all", label: "Tất cả" }, { value: "pending", label: "Chờ duyệt" }, { value: "discussing", label: "Đã duyệt" }];
  const resetFilters = () => { vm.setQuery(""); vm.setStatusFilter("all"); };
  const renderCandidate = (candidate: Candidate, priority: boolean) => {
    const talent = vm.talentById.get(candidate.talentId);
    return talent ? <CandidateCard key={candidate.id} candidate={candidate} talent={talent} project={project} priority={priority} comparing={compareIds.includes(talent.id)} compareDisabled={!compareIds.includes(talent.id) && compareIds.length >= 3} onCompare={() => setCompareIds(ids => ids.includes(talent.id) ? ids.filter(id => id !== talent.id) : ids.length < 3 ? [...ids, talent.id] : ids)} onReview={() => vm.setSelectedCandidate(candidate)} onDecision={action => vm.setDecision({ candidate, talent, action })} /> : null;
  };
  return <Box component="section" id="candidate-list" aria-label="Ứng viên của dự án" className="space-y-5" sx={{ "& .MuiButton-root": { textTransform: "none" }, "&& a.MuiButton-contained": { color: "primary.contrastText" } }}>
    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
      <TextField size="small" placeholder="Tìm ứng viên…" value={vm.query} onChange={event => vm.setQuery(event.target.value)} sx={{ width: { xs: "100%", sm: 220 }, "& .MuiOutlinedInput-root": { borderRadius: 999, bgcolor: "background.paper", fontSize: 14 } }} slotProps={{ htmlInput: { "aria-label": "Tìm tên hoặc chuyên môn ứng viên" }, input: { startAdornment: <InputAdornment position="start"><Search size={17} /></InputAdornment> } }} />
      <div className="flex flex-wrap items-center gap-1 rounded-2xl bg-[#eeefec] p-1" role="group" aria-label="Lọc trạng thái">
        {filters.map(filter => <Button key={filter.value} aria-pressed={vm.statusFilter === filter.value} onClick={() => vm.setStatusFilter(filter.value)} sx={{ ...pillSx, minHeight: 36, px: 1.5, color: vm.statusFilter === filter.value ? "primary.dark" : "text.secondary", bgcolor: vm.statusFilter === filter.value ? "background.paper" : "transparent" }}>{filter.label} ({vm.projectCandidates.filter(candidate => matchesCandidateFilter(candidate, filter.value)).length})</Button>)}
        <TextField select size="small" value={["offer", "selected", "not_selected"].includes(vm.statusFilter) ? vm.statusFilter : "other"} onChange={event => vm.setStatusFilter(event.target.value as CandidateFilter)} slotProps={{ select: { inputProps: { "aria-label": "Lọc trạng thái khác" } } }} sx={{ minWidth: 90, "& .MuiOutlinedInput-root": { borderRadius: 999, fontSize: 13 }, "& fieldset": { border: 0 }, "& .MuiSelect-select": { py: 1 } }}><MenuItem value="other" disabled>Khác</MenuItem><MenuItem value="offer">Chờ thỏa thuận</MenuItem><MenuItem value="selected">Đã chọn</MenuItem><MenuItem value="not_selected">Không được chọn</MenuItem></TextField>
      </div>
    </div>
    {[{ priority: true, id: "invited-candidates", title: "Đã nhận lời mời", count: vm.priorityCount, items: vm.priority, icon: MailCheck, subtitle: "Từ gợi ý hệ thống · Đã xác nhận tham gia" }, { priority: false, id: "direct-applicants", title: "Tự ứng tuyển", count: vm.projectCandidates.length - vm.priorityCount, items: vm.applications, icon: FileUser, subtitle: "Hồ sơ ứng viên nộp trực tiếp vào bài đăng" }].map(zone => <section key={zone.id} id={zone.id} aria-labelledby={`${zone.id}-heading`} className="scroll-mt-6 rounded-2xl border border-[#b8c0cc] bg-white p-5 sm:p-6 shadow-[0_2px_8px_rgba(16,24,40,0.05),0_1px_2px_rgba(16,24,40,0.03)]">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-[#eef1f5] pb-4">
        <div className="flex items-center gap-3"><div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#fff0e9] text-[#bd3d14]"><zone.icon size={20} strokeWidth={2.2} aria-hidden="true" /></div><div><div className="flex items-center gap-2"><Typography id={`${zone.id}-heading`} component="h2" sx={{ fontSize: { xs: 18, sm: 20 }, fontWeight: 700, color: "#20201f" }}>{zone.title}</Typography><Chip label={zone.count} size="small" sx={{ height: 23, px: 0.5, bgcolor: "#fff0e9", color: "#bd3d14", fontWeight: 700, fontSize: "12px", border: "1px solid #ffd4c3" }} /></div><p className="mt-0.5 text-xs text-[#667085]">{zone.subtitle}</p></div></div>
        {!zone.priority && <span className="rounded-full bg-[#f2f3f0] px-3 py-1 text-xs font-semibold text-[#62625e]">Chờ duyệt trước · Mới nhất</span>}
      </div>
      {zone.items.length ? <div className="space-y-3">{zone.items.map(candidate => renderCandidate(candidate, zone.priority))}</div> : <div className="rounded-xl border border-dashed border-[#cbd5e1] bg-[#f8fafc] px-5 py-8 text-center"><Users size={26} className="mx-auto text-[#667085]" aria-hidden="true" /><p className="mt-3 text-sm font-semibold text-[#20201f]">{filtered ? "Không có hồ sơ khớp bộ lọc" : zone.priority ? "Chưa có người nhận lời mời" : "Chưa có ứng viên tự ứng tuyển"}</p><p className="mt-1 text-sm text-[#667085]">{filtered ? "Thử đổi trạng thái hoặc từ khóa tìm kiếm." : zone.priority ? "Ứng viên xuất hiện tại đây sau khi chấp nhận lời mời." : "Hồ sơ mới từ bài đăng sẽ xuất hiện tại đây."}</p></div>}
    </section>)}
    <CandidateComparison project={project} ids={compareIds} onRemove={id => setCompareIds(ids => id ? ids.filter(value => value !== id) : [])} />
    {filtered && <Button onClick={resetFilters} sx={pillSx}>Xóa bộ lọc</Button>}
    {selectedCandidate && <CandidateReviewModal open onClose={() => vm.setSelectedCandidate(null)} candidate={selectedCandidate} talent={vm.talentById.get(selectedCandidate.talentId)} project={project} onUnlockChat={talentId => { const talent = vm.talentById.get(talentId); if (talent) vm.setDecision({ candidate: selectedCandidate, talent, action: "approve" }); }} />}
    <Dialog open={Boolean(decision)} onClose={() => vm.setDecision(null)} maxWidth="xs" fullWidth aria-labelledby="candidate-decision-title"><DialogTitle id="candidate-decision-title" sx={{ display: "flex", alignItems: "center", gap: 1 }}><CheckCircle2 size={22} />{decision?.action === "approve" ? `Duyệt ${decision.talent.name}?` : "Từ chối hồ sơ?"}</DialogTitle><DialogContent><Typography variant="body2">{decision?.action === "approve" ? "Mở chat để trao đổi về dự án. Bạn chưa chốt người thực hiện ở bước này." : `Hồ sơ ${decision?.talent.name} sẽ chuyển sang “Không được chọn” và được giữ trong lịch sử.`}</Typography></DialogContent><DialogActions><Button onClick={() => vm.setDecision(null)}>Quay lại</Button><Button variant="contained" onClick={vm.confirmDecision}>{decision?.action === "approve" ? "Duyệt trao đổi" : "Xác nhận từ chối"}</Button></DialogActions></Dialog>
    <Snackbar open={Boolean(vm.feedback)} autoHideDuration={4500} onClose={() => vm.setFeedback("")} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}><Alert severity="info" onClose={() => vm.setFeedback("")}>{vm.feedback}</Alert></Snackbar>
  </Box>;
}
