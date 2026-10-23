import { Alert, Box, Button, Chip, Skeleton, Typography } from "@mui/material";
import { Download, ExternalLink, FileText, LockKeyhole } from "lucide-react";
import { useCandidateResume } from "../hooks/useCandidateResume";
import type { Candidate, ProjectBrief, TalentProfile } from "@/lib/types/marketplace.types";

interface CandidateResumeSectionProps {
  candidate: Candidate;
  talent: TalentProfile;
  project: ProjectBrief;
  enabled: boolean;
}

export function CandidateResumeSection({ candidate, talent, project, enabled }: CandidateResumeSectionProps) {
  const cv = useCandidateResume(candidate, talent, project, enabled);
  const isPdf = cv.selected?.mimeType === "application/pdf" || /\.pdf$/i.test(cv.selected?.name ?? "");
  return <Box component="section" aria-labelledby="candidate-cv-heading" sx={{ p: 2.5, bgcolor: "background.paper", border: "1px solid", borderColor: "divider", borderRadius: 2.5 }}>
    <div className="mb-4 flex items-center justify-between gap-2"><Typography id="candidate-cv-heading" component="h3" sx={{ fontSize: 15, fontWeight: 700 }}>CV đã gửi</Typography><FileText size={18} className="text-[#bd3d14]" aria-hidden="true" /></div>
    {!cv.canView ? <div className="flex items-start gap-2 text-xs leading-5 text-[#747773]"><LockKeyhole size={16} className="mt-0.5 shrink-0" /><p className="m-0">CV chỉ dành cho chủ dự án khi ứng viên đã ứng tuyển hoặc nhận lời mời.</p></div>
      : cv.selected ? <>
        <Chip label={isPdf ? "PDF" : "Tài liệu"} size="small" sx={{ bgcolor: "#fff0e9", color: "primary.dark", fontWeight: 700, mb: 1 }} />
        <p className="m-0 break-words text-sm font-medium">{cv.selected.name}</p>
        {cv.document.loading ? <Skeleton variant="rounded" height={40} sx={{ mt: 2 }} role="status" aria-label="Đang chuẩn bị CV" /> : cv.document.error ? <Alert severity="error" sx={{ mt: 2, fontSize: 12 }} action={<Button size="small" onClick={cv.retry}>Thử lại</Button>}>{cv.document.error}</Alert> : <Button component="a" href={cv.document.url ? `${cv.document.url}${isPdf ? "#toolbar=1&navpanes=0&view=Fit" : ""}` : undefined} target="_blank" rel="noopener noreferrer" download={!isPdf ? cv.selected.name : undefined} disabled={!cv.document.url} fullWidth variant="outlined" startIcon={isPdf ? <ExternalLink size={15} /> : <Download size={15} />} sx={{ mt: 2, minHeight: 40, borderColor: "divider", color: "text.primary", bgcolor: "background.default" }}>{isPdf ? "Xem CV ở tab mới" : "Tải CV"}</Button>}
      </> : <div className="rounded-xl bg-[#f7f8f6] px-3 py-4"><p className="m-0 text-sm font-medium">Không có CV gửi kèm</p><p className="mb-0 mt-1 text-xs leading-5 text-[#747773]">Ứng viên chưa có CV khi gửi đơn này.</p></div>}
  </Box>;
}
