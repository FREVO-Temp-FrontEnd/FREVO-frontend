import { Avatar, Box, Button, Chip, List, ListItem, Typography } from "@mui/material";
import { Mail } from "lucide-react";
import type { TeamInvitation } from "../team-model";

export function TeamInvitationsTab({ invitations, onResend, onRevoke, onAccept }: { invitations: TeamInvitation[]; onResend: (id: string) => void; onRevoke: (invitation: TeamInvitation) => void; onAccept: (invitation: TeamInvitation) => void }) {
  if (!invitations.length) return <Box sx={{ textAlign: "center", py: 5 }}>
    <Typography sx={{ fontWeight: 600 }}>Chưa có lời mời</Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Mời cộng sự đầu tiên của nhóm qua email.</Typography>
  </Box>;
  return <List disablePadding aria-label="Danh sách lời mời qua email">
    {invitations.map(invitation => <ListItem key={invitation.id} disableGutters sx={{ py: 2, gap: 1.5, alignItems: "flex-start", flexWrap: { xs: "wrap", md: "nowrap" }, borderBottom: "1px solid", borderColor: "divider", "&:last-child": { borderBottom: 0 } }}>
      <Avatar sx={{ bgcolor: "action.hover", color: "text.secondary" }}><Mail size={18} /></Avatar>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontWeight: 600, overflowWrap: "anywhere" }}>{invitation.email}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{invitation.role}</Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
          {invitation.status === "accepted" ? "Đã chấp nhận (mô phỏng)" : invitation.status === "revoked" ? "Đã thu hồi" : "Đang chờ phản hồi"} · {invitation.resent ? "Gửi lại" : "Đã mời"} {new Date(invitation.sentAt).toLocaleDateString("vi-VN")}
        </Typography>
      </Box>
      {invitation.status === "pending" ? <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", ml: { xs: 6.5, md: 0 } }}>
        <Button size="small" onClick={() => onAccept(invitation)} aria-label={`Mô phỏng chấp nhận lời mời cho ${invitation.email}`}>Chấp nhận thử</Button>
        <Button size="small" onClick={() => onResend(invitation.id)} aria-label={`Gửi lại lời mời cho ${invitation.email}`}>Gửi lại</Button>
        <Button size="small" color="inherit" onClick={() => onRevoke(invitation)} aria-label={`Thu hồi lời mời cho ${invitation.email}`}>Thu hồi</Button>
      </Box> : <Chip label={invitation.status === "accepted" ? "Đã chấp nhận" : "Đã thu hồi"} size="small" variant="outlined" sx={{ ml: { xs: 6.5, md: 0 } }} />}
    </ListItem>)}
  </List>;
}
