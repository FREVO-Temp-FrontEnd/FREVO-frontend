import { Avatar, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import { Link } from "react-router";
import { ArrowRight, ArrowUpRight, Check, Clock3, FileText, MapPin, MessageCircle, ShieldCheck, UserCheck, Wallet, X } from "lucide-react";
import { useTalentPortfolio } from "@/lib/hooks/useTalentPortfolio";
import { talentWorkPath, talentProfilePath } from "@/lib/utils/portfolioPaths";
import { PortfolioWorkLink } from "@/app/shared/components/PortfolioWorkLink";
import { CandidateResumeSection } from "./CandidateResumeSection";
import type { Candidate, ProjectBrief, TalentProfile } from "@/lib/types/marketplace.types";

interface CandidateReviewModalProps {
  open: boolean;
  onClose: () => void;
  candidate: Candidate | null;
  talent: TalentProfile | undefined;
  project: ProjectBrief;
  onUnlockChat: (talentId: string) => void;
}

export function CandidateReviewModal({ open, onClose, candidate, talent, project, onUnlockChat }: CandidateReviewModalProps) {
  const { works: profileWorks } = useTalentPortfolio(talent?.id ?? "");
  if (!candidate || !talent) return null;
  const works = candidate.submission?.portfolioWorks ?? (candidate.source === "Lời mời" ? profileWorks : []);
  const matchedSkills = talent.skills.filter(skill => project.skills.some(required => required.toLocaleLowerCase("vi") === skill.toLocaleLowerCase("vi")));
  const canApprove = project.status === "published" && (candidate.status === "new" || candidate.status === "under_review") && !candidate.chatUnlocked;
  const canChat = candidate.chatUnlocked && candidate.status !== "not_selected";
  const receivedAt = new Date(candidate.receivedAt);
  const formattedDate = Number.isNaN(receivedAt.getTime()) ? "Chưa xác định" : receivedAt.toLocaleDateString("vi-VN");
  const panelSx = { p: { xs: 2, sm: 2.5 }, border: "1px solid", borderColor: "divider", bgcolor: "background.paper", borderRadius: 2.5 } as const;

  return <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth aria-labelledby="candidate-review-title" slotProps={{ paper: { sx: { maxWidth: 1040, borderRadius: 3, m: { xs: 1.5, sm: 4 }, width: { xs: "calc(100% - 24px)", sm: "calc(100% - 64px)" }, maxHeight: "calc(100dvh - 32px)", scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" }, fontFamily: theme => theme.typography.fontFamily } } }}>
    <DialogTitle component="div" sx={{ px: { xs: 2, sm: 3 }, py: 2, borderBottom: "1px solid", borderColor: "divider", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
      <div className="flex min-w-0 items-center gap-3"><Box sx={{ display: "grid", placeItems: "center", width: 38, height: 38, borderRadius: 2, bgcolor: "#fff0e9", color: "primary.dark", flexShrink: 0 }}><UserCheck size={19} aria-hidden="true" /></Box><div className="min-w-0"><Typography id="candidate-review-title" component="h2" sx={{ fontSize: { xs: 16, sm: 18 }, fontWeight: 700 }}>Chi tiết hồ sơ ứng viên</Typography><Typography sx={{ mt: 0.25, fontSize: 12, color: "text.secondary" }}>{candidate.source} · Nhận ngày {formattedDate}</Typography></div></div>
      <IconButton onClick={onClose} aria-label="Đóng chi tiết hồ sơ ứng viên"><X size={20} /></IconButton>
    </DialogTitle>
    <DialogContent sx={{ p: { xs: 2, sm: 3 }, bgcolor: "background.default", "&&": { pt: { xs: 2, sm: 3 } }, scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } }}>
      <section aria-label={`Thông tin ${talent.name}`} className="mb-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#f3dccf] bg-[#fff4ee] p-5">
        <div className="flex min-w-0 items-center gap-4"><Avatar src={talent.avatar} alt={talent.name} sx={{ width: 60, height: 60, bgcolor: talent.color, color: "text.primary", fontWeight: 700, fontSize: 21, border: "3px solid white" }}>{talent.initials}</Avatar><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><Typography component="h3" sx={{ fontSize: 22, fontWeight: 700, lineHeight: 1.3 }}>{talent.name}</Typography><Chip label={talent.kind} size="small" sx={{ height: 22, fontSize: 11, bgcolor: "background.paper" }} /></div><Typography sx={{ mt: 0.5, fontSize: 14, color: "text.secondary" }}>{talent.role}</Typography></div></div>
        <Chip label={canChat ? "Đã duyệt trao đổi" : canApprove ? "Chờ duyệt" : "Lưu trong lịch sử"} size="small" sx={{ bgcolor: canChat ? "#e8f7ef" : "background.paper", color: canChat ? "#16805b" : "#9a4a1b", fontWeight: 600 }} />
      </section>
      <div className="grid items-start gap-5 md:grid-cols-[minmax(0,1fr)_270px]">
        <div className="min-w-0 space-y-4">
          <Box component="section" sx={panelSx}>
            <Typography component="h3" sx={{ mb: 1.5, fontSize: 16, fontWeight: 700, display: "flex", alignItems: "center", gap: 1 }}><FileText size={17} className="text-[#bd3d14]" aria-hidden="true" />Lời giới thiệu ứng tuyển</Typography>
            <Typography sx={{ whiteSpace: "pre-line", overflowWrap: "anywhere", fontSize: 14, lineHeight: 1.85, color: "text.secondary" }}>{candidate.proposal?.trim() || "Ứng viên chưa gửi lời giới thiệu."}</Typography>
            {(candidate.submission?.proposedBudget || candidate.submission?.deliveryEstimate) && <dl className="mb-0 mt-4 grid gap-3 border-t border-[#e4e6e2] pt-4 sm:grid-cols-2">
              {candidate.submission.proposedBudget != null && <div><dt className="text-xs text-[#747773]">Chào giá đề xuất</dt><dd className="m-0 mt-1 text-sm font-semibold">{candidate.submission.proposedBudget.toLocaleString("vi-VN")} đ</dd></div>}
              {candidate.submission.deliveryEstimate && <div><dt className="text-xs text-[#747773]">Thời gian hoàn thành</dt><dd className="m-0 mt-1 text-sm font-medium">{candidate.submission.deliveryEstimate}</dd></div>}
            </dl>}
          </Box>
          <Box component="section" sx={panelSx}>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2"><Typography component="h3" sx={{ fontSize: 16, fontWeight: 700 }}>{candidate.source === "Lời mời" ? "Portfolio công khai" : "Portfolio đã gửi"} <span className="ml-1 text-xs font-normal text-[#747773]">({works.length})</span></Typography><Button component={Link} to={talentProfilePath(talent.id)} endIcon={<ArrowUpRight size={14} />} size="small" sx={{ color: "text.secondary", fontSize: 12 }}>Xem hồ sơ</Button></div>
            {works.length ? <div className="grid gap-2.5 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">{works.map(work => <Box key={work.id} sx={{ p: 1.25, borderRadius: 2, border: "1px solid", borderColor: "divider", display: "flex", alignItems: "center", gap: 1.25 }}>
              <PortfolioWorkLink talentId={talent.id} work={work} size={48} />
              <div className="min-w-0"><Typography component={Link} to={talentWorkPath(talent.id, work.id)} sx={{ fontSize: 13, fontWeight: 600, lineHeight: 1.5, display: "block", overflowWrap: "anywhere", "&:hover": { color: "primary.dark" } }}>{work.title}</Typography><Typography sx={{ mt: 0.25, fontSize: 11, color: "text.secondary" }}>{work.category}</Typography></div>
            </Box>)}</div> : <p className="m-0 rounded-xl bg-[#f7f8f6] px-4 py-5 text-sm text-[#747773]">{candidate.source === "Lời mời" ? "Chưa có tác phẩm công khai." : "Ứng viên chưa gửi kèm tác phẩm trong đơn này."}</p>}
            {candidate.submission?.portfolioUrl && /^https?:\/\//i.test(candidate.submission.portfolioUrl) && <Button component="a" href={candidate.submission.portfolioUrl} target="_blank" rel="noopener noreferrer" size="small" endIcon={<ArrowUpRight size={14} />} sx={{ mt: 1.5 }}>Portfolio bổ sung</Button>}
          </Box>
          <Box component="section" sx={panelSx}>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2"><Typography component="h3" sx={{ fontSize: 16, fontWeight: 700 }}>Kỹ năng</Typography><span className="flex items-center gap-1 text-xs text-[#16805b]"><Check size={13} aria-hidden="true" />{matchedSkills.length} phù hợp với brief</span></div>
            <div className="flex flex-wrap gap-2">{talent.skills.map(skill => <Chip key={skill} label={skill} size="small" variant="outlined" sx={{ fontSize: 12, borderColor: matchedSkills.includes(skill) ? "#c8e5d6" : "divider", bgcolor: matchedSkills.includes(skill) ? "#e8f7ef" : "background.paper", color: matchedSkills.includes(skill) ? "#16805b" : "text.secondary" }} />)}{!talent.skills.length && <p className="m-0 text-sm text-[#747773]">Chưa cập nhật kỹ năng.</p>}</div>
          </Box>
        </div>
        <aside className="min-w-0 space-y-4">
          <Box component="section" aria-label="Thông tin nhanh" sx={panelSx}><Typography component="h3" sx={{ mb: 2, fontSize: 15, fontWeight: 700 }}>Thông tin nhanh</Typography><dl className="m-0 space-y-4">{[{ label: "Mức phí dự kiến", value: talent.rate, icon: Wallet }, { label: "Lịch làm việc", value: talent.availability, icon: Clock3 }, { label: "Địa điểm", value: talent.location, icon: MapPin }].map(item => <div key={item.label} className="flex items-start gap-2.5"><item.icon size={16} className="mt-0.5 shrink-0 text-[#747773]" aria-hidden="true" /><div className="min-w-0"><dt className="text-xs text-[#747773]">{item.label}</dt><dd className="m-0 mt-1 break-words text-sm font-medium">{item.value || "Chưa cập nhật"}</dd></div></div>)}</dl></Box>
          <CandidateResumeSection key={candidate.id} candidate={candidate} talent={talent} project={project} enabled={open} />
        </aside>
      </div>
    </DialogContent>
    <DialogActions sx={{ px: { xs: 2, sm: 3 }, py: 2, borderTop: "1px solid", borderColor: "divider", display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 2 }}>
      <Typography sx={{ fontSize: 12, color: "text.secondary", maxWidth: 330 }}>{canApprove ? "Duyệt hồ sơ để mở chat. Bước này chưa chốt người thực hiện." : canChat ? "Đã mở chat. Bạn có thể trao đổi và đề xuất hợp tác." : "Hồ sơ được giữ trong lịch sử tuyển dụng."}</Typography>
      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={onClose} sx={{ color: "text.secondary", minHeight: 40 }}>Đóng</Button>
        {canApprove ? <Button variant="contained" startIcon={<ShieldCheck size={16} />} onClick={() => { onUnlockChat(candidate.talentId); onClose(); }} sx={{ minHeight: 40 }}>Duyệt trao đổi</Button> : canChat ? <><Button component={Link} to={`/business/messages?view=project&scope=${project.id}&project=${project.id}&talent=${candidate.talentId}`} variant="outlined" startIcon={<MessageCircle size={16} />} sx={{ minHeight: 40, borderColor: "divider", color: "text.primary" }}>Nhắn tin</Button><Button component={Link} to={`/business/projects/${project.id}/propose?talent=${candidate.talentId}`} variant="contained" endIcon={<ArrowRight size={16} />} sx={{ minHeight: 40 }}>Đề xuất hợp tác</Button></> : null}
      </div>
    </DialogActions>
  </Dialog>;
}
