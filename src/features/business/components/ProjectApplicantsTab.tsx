import { useMemo, useState } from "react";
import { Link } from "react-router";
import { Alert, Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, Snackbar, TextField, Tooltip, Typography } from "@mui/material";
import { ArrowRight, CheckCircle2, LockKeyhole, MessageCircle, PlusCircle, Search, Users, XCircle } from "lucide-react";
import type { Candidate, CandidateStatus, ProjectBrief, TalentProfile } from "@/lib/types/marketplace.types";
import { useBusiness } from "@/lib/hooks/useBusiness";
import { mockStorage } from "@/lib/storage/mockStorage";
import { CandidateReviewModal } from "./CandidateReviewModal";

interface ProjectApplicantsTabProps { project: ProjectBrief }
type CandidateFilter = "all" | "pending" | "discussing" | "offer" | "selected" | "not_selected";
type Decision = { candidate: Candidate; talent: TalentProfile; action: "approve" | "reject" };

const statusLabels: Record<CandidateStatus, string> = {
  new: "Chờ xem xét", under_review: "Chờ xem xét", discussing: "Đã duyệt trao đổi",
  offer: "Chờ xác nhận thỏa thuận", selected: "Đã được chọn", not_selected: "Không được chọn",
};

function matchesFilter(candidate: Candidate, filter: CandidateFilter) {
  if (filter === "all") return true;
  if (filter === "pending") return candidate.status === "new" || candidate.status === "under_review";
  return candidate.status === filter;
}

function CandidateCard({ candidate, talent, project, onReview, onDecision }: {
  candidate: Candidate; talent: TalentProfile; project: ProjectBrief;
  onReview: () => void; onDecision: (action: Decision["action"]) => void;
}) {
  const pending = matchesFilter(candidate, "pending");
  const canDecide = project.status === "published" && pending && !candidate.chatUnlocked;
  const canChat = candidate.chatUnlocked && candidate.status !== "not_selected";
  return <article className="border border-[#eceae7] bg-white px-4 py-3.5 shadow-[0_2px_12px_rgba(32,32,31,0.03)] sm:px-5">
    <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
      <div className="flex min-w-0 items-start gap-3">
        <Avatar sx={{ bgcolor: talent.color, color: "#20201f", width: 42, height: 42, fontWeight: 700, fontSize: 13 }} aria-hidden="true">{talent.initials}</Avatar>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <h3 className="text-sm font-bold text-[#20201f]">{talent.name}</h3>
            {talent.verified && <span className="text-xs font-bold text-[#bd3d14]" title="Hồ sơ đã xác minh">✦</span>}
            <span className="rounded-full bg-[#f2f3f0] px-2 py-0.5 text-[10px] text-[#62625e]">{talent.kind}</span>
          </div>
          <p className="mt-0.5 text-xs text-[#747773]">{talent.role} · {talent.location}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-[#747773]">
            <span>Nguồn: {candidate.source}</span><span aria-hidden="true">·</span><span>Nhận {new Date(candidate.receivedAt).toLocaleDateString("vi-VN")}</span>
            {candidate.unread && <span className="rounded-full bg-[#fff0e9] px-1.5 py-0.5 font-semibold text-[#bd3d14]">Mới</span>}
          </div>
        </div>
      </div>
      <span className={`self-start rounded-full px-2.5 py-1 text-[11px] font-bold ${pending ? "bg-[#fff0e9] text-[#bd3d14]" : canChat ? "bg-[#e8f7ef] text-[#16805b]" : "bg-[#f2f3f0] text-[#62625e]"}`}>{statusLabels[candidate.status]}</span>
    </div>
    <div className="mt-3 grid gap-3 rounded-lg bg-[#f7f7f6] px-3 py-2.5 md:grid-cols-[minmax(0,1fr)_auto]">
      <div className="min-w-0"><p className="text-[10px] font-semibold tracking-wide text-[#747773]">THÔNG ĐIỆP ỨNG TUYỂN</p><p className="mt-0.5 line-clamp-2 text-xs leading-5 text-[#20201f]">{candidate.proposal}</p></div>
      <div className="md:min-w-40 md:text-right"><p className="text-[10px] text-[#747773]">Mức phí dự kiến</p><p className="mt-0.5 text-xs font-bold text-[#bd3d14]">{talent.rate}</p><p className="mt-0.5 text-[10px] text-[#747773]">{talent.availability}</p></div>
    </div>
    <div className="mt-3 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
      {canChat ? <span className="flex items-center gap-1.5 text-xs font-medium text-[#16805b]"><MessageCircle size={14} /> Kênh chat riêng đang hoạt động</span>
        : pending ? <Tooltip title="Duyệt hồ sơ để mở kênh nhắn tin" arrow><span className="flex w-fit items-center gap-1.5 rounded-full bg-[#f2f3f0] px-2.5 py-1.5 text-xs text-[#747773]"><LockKeyhole size={13} /> Nhắn tin trao đổi</span></Tooltip>
          : <span className="text-xs text-[#747773]">Hồ sơ lưu trong lịch sử tuyển dụng</span>}
      <div className="flex flex-wrap items-center gap-1.5">
        {canDecide && <button type="button" className="fb-button fb-button-small fb-button-secondary" onClick={() => onDecision("reject")}>Từ chối</button>}
        <button type="button" className="fb-button fb-button-small fb-button-secondary" onClick={onReview}>Xem chi tiết</button>
        {canDecide && <button type="button" className="fb-button fb-button-small fb-button-primary" onClick={() => onDecision("approve")}><CheckCircle2 size={14} /> Duyệt để trao đổi</button>}
        {canChat && <Link className="fb-button fb-button-small fb-button-primary" to={`/business/projects/${project.id}/messages?talent=${candidate.talentId}`}>Mở tin nhắn <ArrowRight size={14} /></Link>}
      </div>
    </div>
  </article>;
}

export function ProjectApplicantsTab({ project }: ProjectApplicantsTabProps) {
  const { candidates, talents, unlockChat } = useBusiness();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<CandidateFilter>("all");
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [decision, setDecision] = useState<Decision | null>(null);
  const [feedback, setFeedback] = useState("");
  const projectCandidates = useMemo(() => candidates.filter((candidate) => candidate.projectId === project.id), [candidates, project.id]);
  const filteredCandidates = useMemo(() => {
    const search = query.trim().toLocaleLowerCase("vi");
    return projectCandidates.filter((candidate) => {
      if (!matchesFilter(candidate, statusFilter)) return false;
      if (!search) return true;
      const talent = talents.find((item) => item.id === candidate.talentId);
      return [talent?.name, talent?.role, candidate.proposal].some((value) => value?.toLocaleLowerCase("vi").includes(search));
    });
  }, [projectCandidates, query, statusFilter, talents]);
  const filters: { value: CandidateFilter; label: string }[] = [
    { value: "all", label: "Tất cả" }, { value: "pending", label: "Chờ xem xét" },
    { value: "discussing", label: "Đã duyệt trao đổi" }, { value: "offer", label: "Đã gửi thỏa thuận" },
    { value: "selected", label: "Đã chọn" }, { value: "not_selected", label: "Không chọn" },
  ];

  const handleSimulateNewApplicant = () => {
    const nextTalent = talents.find((talent) => !projectCandidates.some((candidate) => candidate.talentId === talent.id));
    if (!nextTalent) { setFeedback("Không còn hồ sơ mẫu để mô phỏng."); return; }
    mockStorage.addCandidate({ id: `c-sim-${Date.now()}`, projectId: project.id, talentId: nextTalent.id, source: "Ứng tuyển", status: "new", proposal: `Tôi quan tâm đến dự án “${project.title}” và muốn trao đổi về phạm vi công việc trong brief.`, receivedAt: new Date().toISOString(), unread: true, chatUnlocked: false });
    setFeedback("Đã thêm một hồ sơ ứng tuyển mẫu.");
  };

  const confirmDecision = () => {
    if (!decision) return;
    const latestCandidate = mockStorage.getState().candidates.find((item) => item.id === decision.candidate.id);
    if (project.status !== "published" || !latestCandidate || !matchesFilter(latestCandidate, "pending") || latestCandidate.chatUnlocked) {
      setFeedback("Trạng thái hồ sơ đã thay đổi. Hãy xem lại danh sách ứng viên."); setDecision(null); return;
    }
    if (decision.action === "approve") { unlockChat(project.id, decision.candidate.talentId); setFeedback(`Đã duyệt ${decision.talent.name}. Kênh trao đổi đã mở.`); }
    else { mockStorage.updateCandidateStatus(decision.candidate.id, "not_selected"); setFeedback(`Đã chuyển hồ sơ ${decision.talent.name} sang “Không được chọn”.`); }
    setDecision(null); setSelectedCandidate(null);
  };

  return <Box component="section" id="candidate-list" className="space-y-3" aria-labelledby="applicants-heading" sx={{ fontFamily: '"Be Vietnam Pro", sans-serif', "&& button:not(.fb-button)": { fontFamily: '"Be Vietnam Pro", sans-serif', fontSize: "11px", fontWeight: 600, letterSpacing: 0, lineHeight: 1.4 }, "&& h3": { fontFamily: '"Be Vietnam Pro", sans-serif', letterSpacing: 0 }, "&& input": { fontFamily: '"Be Vietnam Pro", sans-serif', fontSize: "11px" } }}>
    <h2 id="applicants-heading" className="sr-only">Ứng viên của dự án</h2>
    <div className="flex flex-col gap-2 border border-[#eceae7] bg-white px-3 py-2 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-w-0 gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Lọc theo trạng thái ứng viên">{filters.map((filter) => {
        const count = projectCandidates.filter((candidate) => matchesFilter(candidate, filter.value)).length;
        return <button key={filter.value} type="button" onClick={() => setStatusFilter(filter.value)} aria-pressed={statusFilter === filter.value} className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f4490b] ${statusFilter === filter.value ? "bg-[#20201f] text-white" : "bg-[#f7f7f6] text-[#20201f] hover:bg-[#eeeae7]"}`}>{filter.label} ({count})</button>;
      })}</div>
      <TextField size="small" placeholder="Tìm tên, chuyên môn..." value={query} onChange={(event) => setQuery(event.target.value)} sx={{ minWidth: { lg: 190 }, "& .MuiOutlinedInput-root": { height: 32, borderRadius: 999, bgcolor: "#f7f7f6", fontSize: 11 }, "& fieldset": { borderColor: "transparent" } }} slotProps={{ htmlInput: { "aria-label": "Tìm ứng viên" }, input: { startAdornment: <InputAdornment position="start"><Search size={14} /></InputAdornment> } }} />
    </div>
    {filteredCandidates.length ? <div className="space-y-4">{filteredCandidates.map((candidate) => {
      const talent = talents.find((item) => item.id === candidate.talentId);
      if (!talent) return null;
      return <CandidateCard key={candidate.id} candidate={candidate} talent={talent} project={project} onReview={() => setSelectedCandidate(candidate)} onDecision={(action) => setDecision({ candidate, talent, action })} />;
    })}</div> : <div className="flex flex-col items-center rounded-2xl border border-dashed border-[#d4d8d2] bg-white px-5 py-12 text-center">
      <Users size={30} className="text-[#747773]" /><Typography variant="h6" sx={{ mt: 2, fontWeight: 700 }}>Không tìm thấy ứng viên</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, maxWidth: 440 }}>{projectCandidates.length ? "Thử đổi bộ lọc hoặc từ khóa tìm kiếm." : "Dự án chưa có hồ sơ ứng tuyển. Bạn có thể xem gợi ý và gửi lời mời."}</Typography>
      {projectCandidates.length ? <button type="button" className="fb-button fb-button-small fb-button-secondary mt-4" onClick={() => { setQuery(""); setStatusFilter("all"); }}>Xóa bộ lọc</button> : <Link className="fb-button fb-button-small fb-button-primary mt-4" to={`/business/projects/${project.id}/suggestions`}>Xem gợi ý phù hợp <ArrowRight size={14} /></Link>}
    </div>}
    {project.status === "published" && <div className="text-right"><Button size="small" variant="text" startIcon={<PlusCircle size={14} />} onClick={handleSimulateNewApplicant} sx={{ fontSize: 11, color: "text.secondary" }}>Mô phỏng hồ sơ mới</Button></div>}
    {selectedCandidate && <CandidateReviewModal open onClose={() => setSelectedCandidate(null)} candidate={selectedCandidate} talent={talents.find((item) => item.id === selectedCandidate.talentId)} project={project} onUnlockChat={(talentId) => { const talent = talents.find((item) => item.id === talentId); if (talent) setDecision({ candidate: selectedCandidate, talent, action: "approve" }); }} />}
    <Dialog open={Boolean(decision)} onClose={() => setDecision(null)} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>{decision?.action === "approve" ? <CheckCircle2 size={22} color="#f4490b" /> : <XCircle size={22} color="#747773" />}{decision?.action === "approve" ? "Duyệt để trao đổi?" : "Từ chối hồ sơ?"}</DialogTitle>
      <DialogContent><Typography variant="body2">{decision?.action === "approve" ? `Sau khi duyệt ${decision.talent.name}, kênh chat của dự án này sẽ được mở.` : `Hồ sơ của ${decision?.talent.name} sẽ chuyển sang “Không được chọn” và vẫn được lưu trong lịch sử.`}</Typography></DialogContent>
      <DialogActions><Button onClick={() => setDecision(null)}>Quay lại</Button><Button variant="contained" onClick={confirmDecision}>{decision?.action === "approve" ? "Duyệt hồ sơ" : "Xác nhận từ chối"}</Button></DialogActions>
    </Dialog>
    <Snackbar open={Boolean(feedback)} autoHideDuration={4500} onClose={() => setFeedback("")} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}><Alert severity="info" onClose={() => setFeedback("")}>{feedback}</Alert></Snackbar>
  </Box>;
}
