import { useMemo, useState } from "react";
import { Box, Pagination, Snackbar, Typography } from "@mui/material";
import { useFreelancer } from "@/lib/hooks/useFreelancer";
import type { Invitation } from "@/lib/types/marketplace.types";
import { InvitationDetailDialog } from "../components/InvitationDetailDialog";
import { InvitationProjectCard } from "../components/InvitationProjectCard";
import { InvitationProjectDetail } from "../components/InvitationProjectDetail";

export function InvitationsHubPage() {
  const { myInvitations, getProjectForInvitation, acceptInvitation, declineInvitation, toast, setToast } = useFreelancer();
  const [selection, setSelection] = useState<{ invitation: Invitation; action: "accept" | "decline" } | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pending = useMemo(() => myInvitations.filter((invitation) => invitation.status === "pending" && new Date(invitation.expiresAt).getTime() > Date.now()), [myInvitations]);
  const pageCount = Math.max(1, Math.ceil(pending.length / 10));
  const currentPage = Math.min(page, pageCount);
  const pageInvitations = pending.slice((currentPage - 1) * 10, currentPage * 10);
  const selectedProject = selection ? getProjectForInvitation(selection.invitation.projectId) : undefined;
  const activeInvitation = pageInvitations.find((invitation) => invitation.id === selectedId) ?? pageInvitations[0];
  const activeProject = activeInvitation ? getProjectForInvitation(activeInvitation.projectId) : undefined;

  function selectCard(id: string) {
    setSelectedId(id);
    if (window.matchMedia("(max-width: 899px)").matches) {
      requestAnimationFrame(() => {
        document.getElementById("invitation-detail-region")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
        document.getElementById("invitation-detail-title")?.focus({ preventScroll: true });
      });
    }
  }

  return (
    <Box className="page-grid grid freelancer-home" sx={{
      "& .intro": { mt: 2 },
      "& .result-line": { mt: 3, mb: 3 },
    }}>
      <Box className="main-column min-w-0" component="section" aria-label="Danh sách lời mời">
        <Typography component="h1" sx={{ fontFamily: "Archivo, Arial, sans-serif", fontSize: { xs: 30, md: 36 }, lineHeight: 1.1, fontWeight: 900, letterSpacing: "-0.047em" }}>Lời mời dành cho bạn<Box component="span" color="primary.main">.</Box></Typography>
        <Typography className="intro">Xem lời mời từ doanh nghiệp và phản hồi trước khi hết hạn.</Typography>
        <Typography className="result-line" component="p" role="status"><strong>{pending.length}</strong> lời mời chờ phản hồi{pending.length > 0 && ` · Hiển thị ${(currentPage - 1) * 10 + 1}-${Math.min(currentPage * 10, pending.length)}`}</Typography>
        <Box className="project-list">
            {pageInvitations.map((invitation) => {
              const project = getProjectForInvitation(invitation.projectId);
              if (!project) return null;
              return <InvitationProjectCard key={invitation.id} invitation={invitation} project={project} selected={activeInvitation?.id === invitation.id} onSelect={() => selectCard(invitation.id)} onAccept={() => setSelection({ invitation, action: "accept" })} onDecline={() => setSelection({ invitation, action: "decline" })} />;
            })}
            {pending.length === 0 && <Box sx={{ bgcolor: "background.paper", border: "1px dashed", borderColor: "divider", borderRadius: "13px", textAlign: "center", px: 3, py: 7 }}><Typography variant="h6" sx={{ fontWeight: 700 }}>Bạn chưa có lời mời cần phản hồi</Typography><Typography color="text.secondary" sx={{ mt: 1 }}>Lời mời mới từ doanh nghiệp sẽ xuất hiện tại đây.</Typography></Box>}
        </Box>
        {pending.length > 0 && <Pagination count={pageCount} page={currentPage} color="primary" size="large" siblingCount={0} aria-label="Phân trang lời mời" getItemAriaLabel={(type, itemPage, selected) => type === "page" ? `${selected ? "Trang hiện tại, trang" : "Đến trang"} ${itemPage}` : type === "previous" ? "Trang trước" : type === "next" ? "Trang sau" : type === "first" ? "Trang đầu" : "Trang cuối"} onChange={(_, nextPage) => { setPage(nextPage); setSelectedId(null); document.getElementById("main")?.scrollIntoView({ block: "start", behavior: "instant" }); }} sx={{ mt: 3, "& .MuiPagination-ul": { justifyContent: "center", flexWrap: "wrap" } }} />}
      </Box>
      {activeInvitation && activeProject && <Box className="detail-column" component="aside" id="invitation-detail-region" aria-label="Chi tiết lời mời"><InvitationProjectDetail invitation={activeInvitation} project={activeProject} /></Box>}
      <InvitationDetailDialog open={!!selection} onClose={() => setSelection(null)} invitation={selection?.invitation ?? null} project={selectedProject} action={selection?.action ?? "accept"} onAccept={acceptInvitation} onDecline={declineInvitation} />
      <Snackbar open={!!toast} autoHideDuration={5000} onClose={() => setToast("")} message={toast} />
    </Box>
  );
}

export default InvitationsHubPage;
