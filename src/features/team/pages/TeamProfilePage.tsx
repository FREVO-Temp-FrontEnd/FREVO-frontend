import { useState } from "react";
import { Alert, Avatar, Box, Button, Chip, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, InputAdornment, Paper, Skeleton, Snackbar, Tab, Tabs, TextField, Typography } from "@mui/material";
import { Info, Mail, MailPlus, Pencil, Plus, Search, Users } from "lucide-react";
import { useAuthSession } from "@/lib/hooks/useAuthSession";
import type { UserSession } from "@/lib/types/marketplace.types";
import { TeamRosterTab } from "../components/TeamRosterTab";
import { TeamInvitationsTab } from "../components/TeamInvitationsTab";
import { TeamInviteDialog, TeamProfileDialog } from "../components/TeamManagementDialogs";
import { useTeamManagement } from "../hooks/useTeamManagement";
import { initials, type TeamInvitation } from "../team-model";

const pressSx = { "@media (prefers-reduced-motion: no-preference)": { transition: "transform 120ms cubic-bezier(0.2, 0, 0, 1)", "&:active": { transform: "scale(0.97)" } } };
const primaryActionSx = { ...pressSx, bgcolor: "primary.dark", "&:hover": { bgcolor: "primary.dark" } };

function TeamManagement({ user }: { user: UserSession }) {
  const { teams, team, selectedId, selectTeam, loading, error, notice, clearNotice, retry, saveBasics, invite, updateInvitation, acceptInvitation } = useTeamManagement(user);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState(0);
  const [dialog, setDialog] = useState<"create" | "edit" | "invite" | null>(null);
  const [revoking, setRevoking] = useState<TeamInvitation | null>(null);
  const [accepting, setAccepting] = useState<TeamInvitation | null>(null);
  const [memberName, setMemberName] = useState("");
  const [actionError, setActionError] = useState("");
  const filtered = teams.filter(item => `${item.name} ${item.discipline}`.toLocaleLowerCase("vi").includes(query.trim().toLocaleLowerCase("vi")));
  const pending = team?.invitations.filter(invitation => invitation.status === "pending").length || 0;
  function changeInvitation(id: string, action: "resend" | "revoke") {
    const result = updateInvitation(id, action);
    setActionError(result);
    if (!result) setRevoking(null);
  }

  return <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 }, px: { xs: 2, md: 4 }, minHeight: "calc(100dvh - 76px)" }}>
    <Box sx={{ display: "flex", alignItems: { xs: "flex-start", sm: "center" }, justifyContent: "space-between", gap: 2, mb: 3, flexWrap: "wrap" }}>
      <Box>
        <Typography component="h1" sx={{ fontFamily: "Archivo, sans-serif", fontSize: { xs: 27, md: 31 }, fontWeight: 800, letterSpacing: "-0.04em" }}>Nhóm của bạn</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>Chọn một nhóm để xem và cập nhật thông tin.</Typography>
      </Box>
      <Button variant="contained" startIcon={<Plus size={18} />} onClick={() => setDialog("create")} sx={primaryActionSx}>Tạo nhóm</Button>
    </Box>

    {loading ? <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "320px minmax(0, 1fr)" }, gap: 3 }} aria-busy="true" aria-label="Đang tải danh sách nhóm">
      <Skeleton variant="rounded" height={410} /><Skeleton variant="rounded" height={480} />
    </Box> : error ? <Alert severity="error" action={<Button color="inherit" onClick={retry}>Thử lại</Button>}>{error}</Alert> : !team ? <Paper variant="outlined" sx={{ py: { xs: 6, md: 9 }, px: 3, textAlign: "center" }}>
      <Avatar variant="rounded" sx={{ width: 68, height: 68, mx: "auto", mb: 2, bgcolor: "#fff0e9", color: "primary.dark" }}><Users size={28} /></Avatar>
      <Typography component="h2" variant="h6" sx={{ fontWeight: 700 }}>Bắt đầu từ một nhóm nhỏ</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 390, mx: "auto", mt: 1, mb: 3 }}>Tạo hồ sơ nhóm và mời cộng sự qua email.</Typography>
      <Button variant="contained" startIcon={<Plus size={18} />} onClick={() => setDialog("create")} sx={primaryActionSx}>Tạo nhóm</Button>
    </Paper> : <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(270px, 320px) minmax(0, 1fr)" }, gap: 3, alignItems: "start" }}>
      <Paper component="aside" variant="outlined" aria-label="Danh sách nhóm" sx={{ overflow: "hidden" }}>
        <Box sx={{ p: 2.25, pb: 1.5 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography component="h2" sx={{ fontWeight: 700 }}>Danh sách nhóm</Typography>
            <Chip size="small" icon={<Users size={13} />} label={teams.length} sx={{ height: 25 }} />
          </Box>
          <Typography variant="caption" color="text.secondary">Các nhóm bạn đại diện</Typography>
          <TextField fullWidth size="small" placeholder="Tìm theo tên hoặc chuyên môn" aria-label="Tìm nhóm theo tên hoặc chuyên môn" value={query} onChange={event => { const next = event.target.value; setQuery(next); const matches = teams.filter(item => `${item.name} ${item.discipline}`.toLocaleLowerCase("vi").includes(next.trim().toLocaleLowerCase("vi"))); if (matches.length && !matches.some(item => item.id === team?.id)) { selectTeam(matches[0].id); setTab(0); } }} sx={{ mt: 1.5, "& .MuiOutlinedInput-root": { borderRadius: 2 } }} slotProps={{ input: { startAdornment: <InputAdornment position="start"><Search size={17} /></InputAdornment> } }} />
        </Box>
        <Box sx={{ px: 1, pb: 1 }}>
          {filtered.length ? filtered.map(item => {
            const selected = item.id === selectedId;
            const waiting = item.invitations.filter(invitation => invitation.status === "pending").length;
            return <Box key={item.id} component="button" type="button" aria-pressed={selected} onClick={() => { selectTeam(item.id); setTab(0); setActionError(""); }} sx={{ display: "flex", alignItems: "flex-start", width: "100%", gap: 1.4, p: 1.4, mb: 0.5, textAlign: "left", bgcolor: selected ? "#fff0e9" : "transparent", color: "text.primary", border: "1px solid", borderColor: selected ? "#ffd4c3" : "transparent", borderRadius: 1.5, font: "inherit", position: "relative", "&::before": selected ? { content: '""', position: "absolute", left: 0, top: 9, bottom: 9, width: 3, borderRadius: 3, bgcolor: "primary.main" } : {}, "@media (hover: hover) and (pointer: fine)": { "&:hover": { bgcolor: selected ? "#fff0e9" : "action.hover" } }, "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: -2 }, "@media (prefers-reduced-motion: no-preference)": { transition: "background-color 160ms cubic-bezier(0.2, 0, 0, 1), transform 120ms cubic-bezier(0.2, 0, 0, 1)", "&:active": { transform: "scale(0.985)" } } }}>
              <Avatar variant="rounded" sx={{ width: 40, height: 40, bgcolor: selected ? "#ffe3d5" : "#f0f1ed", color: selected ? "primary.dark" : "text.primary", fontSize: 13, fontWeight: 700, borderRadius: 1.5 }}>{initials(item.name)}</Avatar>
              <Box sx={{ minWidth: 0, flex: 1 }}><Typography sx={{ fontWeight: 700, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</Typography><Typography variant="caption" color="text.secondary" sx={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.discipline}</Typography><Box sx={{ display: "flex", gap: 1, mt: 0.5, flexWrap: "wrap" }}><Typography variant="caption">{item.members.length} thành viên</Typography>{waiting > 0 && <Typography variant="caption" sx={{ color: "primary.dark" }}>{waiting} lời mời chờ</Typography>}</Box></Box>
            </Box>;
          }) : <Typography variant="body2" color="text.secondary" sx={{ px: 2, py: 4, textAlign: "center" }}>Không tìm thấy nhóm phù hợp.</Typography>}
        </Box>
        <Box sx={{ borderTop: "1px solid", borderColor: "divider", px: 2, py: 1.5, display: "flex", gap: 1, color: "text.secondary" }}><Info size={15} /><Typography variant="caption">Mỗi nhóm có hồ sơ và lời mời riêng.</Typography></Box>
      </Paper>

      <Paper component="section" variant="outlined" aria-label={`Chi tiết nhóm ${team.name}`} sx={{ minWidth: 0, overflow: "hidden" }}>
        <Box sx={{ p: { xs: 2, sm: 3 }, display: "flex", alignItems: "flex-start", gap: 2, flexWrap: { xs: "wrap", sm: "nowrap" } }}>
          <Avatar variant="rounded" sx={{ width: 54, height: 54, bgcolor: "#fff0e9", color: "primary.dark", fontWeight: 700, fontSize: 17, borderRadius: 2 }}>{initials(team.name)}</Avatar>
          <Box sx={{ flex: 1, minWidth: 180 }}>
            <Typography component="h2" sx={{ fontFamily: "Archivo, sans-serif", fontSize: { xs: 21, sm: 24 }, fontWeight: 800, lineHeight: 1.2, overflowWrap: "anywhere" }}>{team.name}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, overflowWrap: "anywhere" }}>{team.summary}</Typography>
            <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap", mt: 1.4 }}><Chip label={team.discipline} size="small" variant="outlined" /><Chip label="Bạn là người đại diện" size="small" sx={{ bgcolor: "#fff0e9", color: "primary.dark" }} /></Box>
          </Box>
          <Box sx={{ display: "flex", gap: 0.75, ml: { xs: "auto", sm: 0 } }}><IconButton onClick={() => setDialog("edit")} aria-label={`Chỉnh sửa ${team.name}`} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1.5 }}><Pencil size={17} /></IconButton><Button variant="contained" startIcon={<MailPlus size={17} />} onClick={() => { setActionError(""); setDialog("invite"); }} sx={primaryActionSx}>Mời thành viên</Button></Box>
        </Box>
        <Tabs value={tab} onChange={(_, value: number) => setTab(value)} aria-label="Thông tin nhóm" sx={{ mx: { xs: 2, sm: 3 }, borderBottom: "1px solid", borderColor: "divider", "& .MuiTab-root": { px: 0, mr: 3, textTransform: "none", fontWeight: 600 }, "& .MuiTab-root.Mui-selected": { color: "primary.dark" } }}><Tab id="team-tab-members" aria-controls="team-panel-members" label={`Thành viên (${team.members.length})`} /><Tab id="team-tab-invites" aria-controls="team-panel-invites" label={`Lời mời (${pending})`} /></Tabs>
        <Box sx={{ px: { xs: 2, sm: 3 }, pb: 2 }}>
          {actionError && !revoking && <Alert severity="error" sx={{ mt: 2 }}>{actionError}</Alert>}
          <Box id="team-panel-members" role="tabpanel" aria-labelledby="team-tab-members" hidden={tab !== 0}><TeamRosterTab members={team.members} /></Box>
          <Box id="team-panel-invites" role="tabpanel" aria-labelledby="team-tab-invites" hidden={tab !== 1}><TeamInvitationsTab invitations={team.invitations} onResend={id => changeInvitation(id, "resend")} onRevoke={invitation => { setActionError(""); setRevoking(invitation); }} onAccept={invitation => { setActionError(""); setMemberName(""); setAccepting(invitation); }} /></Box>
        </Box>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center", px: { xs: 2, sm: 3 }, py: 1.5, bgcolor: "#f7f8f6", color: "text.secondary", borderTop: "1px solid", borderColor: "divider" }}><Mail size={15} /><Typography variant="caption">Lời mời chỉ được mô phỏng, chưa gửi email thật.</Typography></Box>
      </Paper>
    </Box>}

    {dialog === "create" && <TeamProfileDialog team={null} onClose={() => setDialog(null)} onSave={basics => saveBasics(basics, true)} />}
    {dialog === "edit" && team && <TeamProfileDialog team={team} onClose={() => setDialog(null)} onSave={basics => saveBasics(basics)} />}
    {dialog === "invite" && team && <TeamInviteDialog team={team} onClose={() => setDialog(null)} onInvite={draft => { const result = invite(draft); if (!result) setTab(1); return result; }} />}
    <Dialog open={!!accepting} onClose={() => setAccepting(null)} maxWidth="xs" fullWidth aria-labelledby="accept-invitation-title" aria-describedby="accept-invitation-description">
      <Box component="form" onSubmit={event => { event.preventDefault(); if (!accepting) return; const result = acceptInvitation(accepting.id, memberName); setActionError(result); if (!result) { setAccepting(null); setTab(0); } }}>
        <DialogTitle id="accept-invitation-title">Chấp nhận lời mời thử</DialogTitle>
        <DialogContent><DialogContentText id="accept-invitation-description">Mô phỏng {accepting?.email} chấp nhận lời mời vào nhóm. Thành viên sẽ xuất hiện trong danh sách của nhóm này.</DialogContentText>
          <Typography component="label" htmlFor="accepted-member-name" sx={{ display: "block", mt: 2.5, mb: 1, fontWeight: 600, fontSize: 14 }}>Tên hiển thị *</Typography>
          <TextField id="accepted-member-name" fullWidth size="small" autoFocus value={memberName} onChange={event => setMemberName(event.target.value)} slotProps={{ htmlInput: { maxLength: 80 } }} placeholder="Ví dụ: Gia Hân" />
          {actionError && <Alert severity="error" sx={{ mt: 2 }}>{actionError}</Alert>}
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}><Button color="inherit" onClick={() => setAccepting(null)}>Hủy</Button><Button type="submit" variant="contained" sx={primaryActionSx}>Chấp nhận thử</Button></DialogActions>
      </Box>
    </Dialog>
    <Dialog open={!!revoking} onClose={() => setRevoking(null)} maxWidth="xs" fullWidth aria-labelledby="revoke-invitation-title" aria-describedby="revoke-invitation-description"><DialogTitle id="revoke-invitation-title">Thu hồi lời mời?</DialogTitle><DialogContent><DialogContentText id="revoke-invitation-description" sx={{ overflowWrap: "anywhere" }}>Thu hồi lời mời gửi đến {revoking?.email}? Người nhận sẽ không được thêm vào nhóm từ lời mời này.</DialogContentText>{actionError && <Alert severity="error" sx={{ mt: 2 }}>{actionError}</Alert>}</DialogContent><DialogActions sx={{ p: 2.5 }}><Button color="inherit" onClick={() => setRevoking(null)} autoFocus>Giữ lời mời</Button><Button variant="contained" sx={primaryActionSx} onClick={() => revoking && changeInvitation(revoking.id, "revoke")}>Thu hồi</Button></DialogActions></Dialog>
    <Snackbar open={!!notice} autoHideDuration={5000} onClose={clearNotice} message={notice} />
  </Container>;
}

export default function TeamProfilePage() {
  const { user } = useAuthSession();
  if (!user) return null;
  return <Box sx={{ bgcolor: "background.default", color: "text.primary", minHeight: "calc(100dvh - 76px)" }}><TeamManagement key={user.email || user.id} user={user} /></Box>;
}
