import { useState } from "react";
import { Avatar, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, Paper, Tab, Tabs, TextField, Typography } from "@mui/material";
import { MailPlus, Plus } from "lucide-react";

// Design sample only. The live TEAM-001 implementation still stores one represented team.
type Member = { name: string; email: string; role: string };
type Invite = { email: string; role: string; status: "pending" | "revoked"; resent?: boolean };
type Team = { id: string; name: string; summary: string; discipline: string; leader: string; members: Member[]; invites: Invite[] };

const initialTeams: Team[] = [
  { id: "may", name: "Mây Creative", summary: "Thiết kế thương hiệu và sản phẩm số.", discipline: "Thiết kế thương hiệu", leader: "Minh Anh", members: [
    { name: "Minh Anh", email: "minhanh@example.com", role: "Người đại diện" },
    { name: "Quốc Huy", email: "quochuy@example.com", role: "UI/UX Designer" },
  ], invites: [{ email: "giahan@example.com", role: "Illustrator", status: "pending" }] },
  { id: "cham", name: "Chạm Studio", summary: "Nghiên cứu và thiết kế trải nghiệm số.", discipline: "UI/UX Design", leader: "Minh Anh", members: [
    { name: "Minh Anh", email: "minhanh@example.com", role: "Người đại diện" },
  ], invites: [] },
];

export default function TeamListPrototype() {
  const [teams, setTeams] = useState(initialTeams);
  const [selectedId, setSelectedId] = useState(initialTeams[0].id);
  const [tab, setTab] = useState(0);
  const [dialog, setDialog] = useState<"create" | "invite" | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const selected = teams.find(team => team.id === selectedId) ?? teams[0];
  const pending = selected.invites.filter(invite => invite.status === "pending").length;

  function createTeam() {
    const trimmed = name.trim();
    if (!trimmed || teams.some(team => team.name.toLowerCase() === trimmed.toLowerCase())) {
      setError("Nhập tên nhóm mới, chưa có trong danh sách.");
      return;
    }
    const next: Team = { id: crypto.randomUUID(), name: trimmed, summary: "Chưa có giới thiệu", discipline: "Chưa chọn", leader: "Minh Anh", members: [{ name: "Minh Anh", email: "minhanh@example.com", role: "Người đại diện" }], invites: [] };
    setTeams([...teams, next]);
    setSelectedId(next.id);
    setTab(0);
    setDialog(null);
    setName("");
    setError("");
  }

  function invite() {
    const normalized = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized) || !role.trim()) {
      setError("Nhập email hợp lệ và vai trò chuyên môn.");
      return;
    }
    if (selected.members.some(member => member.email.toLowerCase() === normalized) || selected.invites.some(item => item.email === normalized && item.status === "pending")) {
      setError("Email đã thuộc nhóm hoặc đang chờ phản hồi.");
      return;
    }
    setTeams(teams.map(team => team.id === selected.id ? { ...team, invites: [...team.invites, { email: normalized, role: role.trim(), status: "pending" }] } : team));
    setTab(1);
    setDialog(null);
    setEmail("");
    setRole("");
    setError("");
  }

  function changeInvitation(emailToUpdate: string, action: "resend" | "revoke") {
    setTeams(teams.map(team => team.id === selected.id ? {
      ...team,
      invites: team.invites.map(item => item.email === emailToUpdate && item.status === "pending"
        ? { ...item, status: action === "revoke" ? "revoked" as const : "pending" as const, resent: action === "resend" || item.resent }
        : item),
    } : team));
  }

  return <Box sx={{ maxWidth: 1180, mx: "auto", p: { xs: 2, md: 4 } }}>
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, mb: 3 }}>
      <Box><Typography variant="h4" component="h1">Nhóm của bạn</Typography><Typography color="text.secondary">Chọn một nhóm để xem và cập nhật thông tin.</Typography></Box>
      <Button variant="contained" startIcon={<Plus size={18} />} onClick={() => setDialog("create")}>Tạo nhóm</Button>
    </Box>
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "310px minmax(0, 1fr)" }, gap: 2 }}>
      <Paper variant="outlined" component="aside" aria-label="Danh sách nhóm" sx={{ p: 1 }}>
        <Typography sx={{ p: 1.5, fontWeight: 700 }}>Danh sách nhóm ({teams.length})</Typography>
        {teams.map(team => <Button key={team.id} fullWidth onClick={() => { setSelectedId(team.id); setTab(0); }} aria-pressed={selectedId === team.id} sx={{ justifyContent: "flex-start", textAlign: "left", color: "text.primary", px: 1.5, py: 1.25, my: 0.25, borderRadius: 2, bgcolor: selectedId === team.id ? "action.selected" : "transparent" }}>
          <Avatar variant="rounded" sx={{ mr: 1.5, bgcolor: "action.hover", color: "text.primary", fontSize: 14 }}>{team.name.slice(0, 2).toUpperCase()}</Avatar>
          <Box sx={{ minWidth: 0 }}><Typography noWrap sx={{ fontWeight: 600 }}>{team.name}</Typography><Typography noWrap variant="caption" color="text.secondary">{team.members.length} thành viên · {team.invites.filter(item => item.status === "pending").length} lời mời chờ</Typography></Box>
        </Button>)}
      </Paper>
      <Paper variant="outlined" component="section" aria-label={`Chi tiết ${selected.name}`} sx={{ minWidth: 0 }}>
        <Box sx={{ p: 3 }}><Typography component="h2" variant="h5">{selected.name}</Typography><Typography color="text.secondary" sx={{ mt: 1 }}>{selected.summary}</Typography><Box sx={{ display: "flex", gap: 1, mt: 2, flexWrap: "wrap" }}><Chip size="small" label={selected.discipline} /><Chip size="small" variant="outlined" label={`Đại diện: ${selected.leader}`} /></Box></Box>
        <Tabs value={tab} onChange={(_, value: number) => setTab(value)} aria-label="Thông tin nhóm" sx={{ px: 3, borderBottom: 1, borderColor: "divider" }}><Tab label={`Thành viên (${selected.members.length})`} /><Tab label={`Lời mời (${pending})`} /></Tabs>
        <Box sx={{ p: 3 }}><Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2, mb: 1 }}><Typography component="h3" sx={{ fontWeight: 700 }}>{tab === 0 ? "Cộng sự trong nhóm" : "Lời mời qua email"}</Typography><Button variant="contained" startIcon={<MailPlus size={17} />} onClick={() => setDialog("invite")}>Mời thành viên</Button></Box>
          <List disablePadding>{(tab === 0 ? selected.members : selected.invites).map(item => <ListItem key={item.email} sx={{ borderBottom: 1, borderColor: "divider", px: 0, py: 2, gap: 1, flexWrap: "wrap" }}><Box sx={{ flex: 1 }}><Typography sx={{ fontWeight: 600 }}>{"name" in item ? item.name : item.email}</Typography><Typography variant="body2" color="text.secondary">{item.role}{"status" in item ? ` · ${item.status === "revoked" ? "Đã thu hồi" : item.resent ? "Đã gửi lại, chờ phản hồi" : "Đang chờ"}` : ""}</Typography></Box>{"status" in item && item.status === "pending" && <Box sx={{ display: "flex", gap: 1 }}><Button size="small" onClick={() => changeInvitation(item.email, "resend")}>Gửi lại</Button><Button size="small" color="inherit" onClick={() => changeInvitation(item.email, "revoke")}>Thu hồi</Button></Box>}</ListItem>)}</List>
        </Box>
      </Paper>
    </Box>
    <Dialog open={dialog !== null} onClose={() => { setDialog(null); setError(""); }} fullWidth maxWidth="xs" aria-labelledby="team-sample-dialog-title">
      <DialogTitle id="team-sample-dialog-title">{dialog === "create" ? "Tạo nhóm" : "Mời thành viên"}</DialogTitle>
      <DialogContent>{dialog === "create" ? <TextField margin="normal" fullWidth autoFocus label="Tên nhóm" value={name} onChange={event => setName(event.target.value)} /> : <><TextField margin="normal" fullWidth autoFocus label="Email cộng sự" value={email} onChange={event => setEmail(event.target.value)} /><TextField margin="normal" fullWidth label="Vai trò chuyên môn" value={role} onChange={event => setRole(event.target.value)} /></>}{error && <Typography color="error" role="alert" variant="body2">{error}</Typography>}</DialogContent>
      <DialogActions><Button onClick={() => setDialog(null)} color="inherit">Hủy</Button><Button variant="contained" onClick={dialog === "create" ? createTeam : invite}>Lưu mô phỏng</Button></DialogActions>
    </Dialog>
  </Box>;
}
