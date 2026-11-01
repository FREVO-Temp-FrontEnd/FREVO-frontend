import { Alert, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import { Link } from "react-router";
import { ArrowRight, FileText, MessageCircle, ShieldCheck, UserCheck, X } from "lucide-react";
import { useTalentPortfolio } from "@/lib/hooks/useTalentPortfolio";
import { applicationsApi } from "@/lib/api/applicationsApi";
import { FreelancerProfile } from "@/features/profile";
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
  const { works, talent: publicTalent } = useTalentPortfolio(talent?.id ?? "");
  if (!candidate || !talent) return null;
  const canReview = applicationsApi.canViewResume(candidate, project);
  const canApprove = canReview && project.status === "published" && (candidate.status === "new" || candidate.status === "under_review") && !candidate.chatUnlocked;
  const canChat = canReview && candidate.chatUnlocked && candidate.status !== "not_selected";
  const receivedAt = new Date(candidate.submission?.submittedAt ?? candidate.receivedAt);
  const formattedDate = Number.isNaN(receivedAt.getTime()) ? "Chưa xác định" : receivedAt.toLocaleDateString("vi-VN");
  const panelSx = { p: { xs: 2, sm: 3 }, border: "1px solid", borderColor: "divider", bgcolor: "background.paper", borderRadius: "13px", minWidth: 0 } as const;
  const identity = candidate.submission?.applicantIdentity === 'team' || (!candidate.submission?.applicantIdentity && talent.kind === 'Team') ? 'Đại diện nhóm' : 'Cá nhân';

  const applicationContent = canReview ? <Box component="section" aria-labelledby="candidate-application-heading" sx={{ ...panelSx, borderColor: 'primary.dark' }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, mb: 2.5 }}>
      <Box><Typography id="candidate-application-heading" component="h3" sx={{ display: 'flex', gap: 1, alignItems: 'center', fontSize: 20, fontWeight: 700 }}><FileText size={20} aria-hidden="true" />Thông tin đã gửi khi ứng tuyển</Typography>
        <Typography color="text.secondary" sx={{ mt: 1, overflowWrap: 'anywhere' }}>Dự án: {project.title}</Typography></Box>
      <Chip variant="outlined" label={canChat ? 'Đã duyệt trao đổi' : canApprove ? 'Chờ duyệt' : 'Hồ sơ trong lịch sử'} />
    </Box>
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0,1fr)', md: 'minmax(0,1fr) 260px' }, gap: 3, alignItems: 'start' }}>
      <Box sx={{ minWidth: 0 }}>
        <Box component="dl" sx={{ m: 0, mb: 3, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5, '& dt': { fontSize: 13, color: 'text.secondary' }, '& dd': { m: 0, mt: .75, fontSize: 16, fontWeight: 600, overflowWrap: 'anywhere' } }}>
          {[{ label: 'Tư cách ứng tuyển', value: identity }, { label: 'Ngày gửi', value: formattedDate }, ...(candidate.submission?.teamAtSubmission ? [{ label: 'Nhóm khi gửi hồ sơ', value: candidate.submission.teamAtSubmission.name }, { label: 'Người đại diện gửi đơn', value: candidate.submission.teamAtSubmission.representativeName }] : []), { label: 'Chào giá đề xuất', value: candidate.submission?.proposedBudget != null ? candidate.submission.proposedBudget.toLocaleString('vi-VN') + ' đ' : 'Chưa cung cấp' }, { label: 'Thời gian hoàn thành dự kiến', value: candidate.submission?.deliveryEstimate || 'Chưa cung cấp' }].map(item => <Box key={item.label}><Typography component="dt">{item.label}</Typography><Typography component="dd">{item.value}</Typography></Box>)}
        </Box>
        <Typography component="h4" sx={{ fontSize: 16, fontWeight: 700, mb: 1 }}>Lời giới thiệu ứng tuyển</Typography>
        <Typography sx={{ whiteSpace: 'pre-line', overflowWrap: 'anywhere', lineHeight: 1.75 }}>{candidate.proposal?.trim() || 'Ứng viên chưa gửi lời giới thiệu.'}</Typography>
      </Box>
      <CandidateResumeSection key={candidate.id} candidate={candidate} talent={talent} project={project} enabled={open} />
    </Box>
  </Box> : <Alert severity="info">Bạn không có quyền xem thông tin ứng tuyển của hồ sơ này.</Alert>;

  return <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth aria-labelledby="candidate-review-title" slotProps={{ paper: { sx: { maxWidth: 1120, borderRadius: '13px', m: { xs: 1.5, sm: 4 }, width: { xs: 'calc(100% - 24px)', sm: 'calc(100% - 64px)' }, maxHeight: 'calc(100dvh - 32px)', '& .MuiButton-root, & .MuiIconButton-root': { minHeight: 44 }, '& .MuiDialogActions-root .MuiButton-contained': { bgcolor: 'primary.dark', color: 'common.white' } } } }}>
    <DialogTitle component="div" sx={{ px: { xs: 2, sm: 3 }, py: 2, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}><UserCheck size={22} aria-hidden="true" /><Box><Typography id="candidate-review-title" component="h2" sx={{ fontSize: 19, fontWeight: 700 }}>Hồ sơ {talent.name}</Typography><Typography color="text.secondary" sx={{ fontSize: 13, mt: .5 }}>{talent.kind === "Team" ? "Hồ sơ nhóm và thông tin ứng tuyển" : "Hồ sơ cá nhân và thông tin ứng tuyển"}</Typography></Box></Box>
      <IconButton onClick={onClose} aria-label="Đóng chi tiết hồ sơ ứng viên" sx={{ flexShrink: 0, minWidth: 44 }}><X size={20} /></IconButton>
    </DialogTitle>
    <DialogContent sx={{ p: { xs: 2, sm: 3 }, bgcolor: 'background.default', '&&': { pt: { xs: 2, sm: 3 } } }}>
      <FreelancerProfile key={talent.id} talent={publicTalent ?? talent} works={works} embedded applicationContent={applicationContent} actions={<Chip variant="outlined" label={talent.kind} />} />
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
