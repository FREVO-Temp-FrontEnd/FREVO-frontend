import { Avatar, Box, Chip, List, ListItem, Typography } from "@mui/material";
import { initials, type TeamMember } from "../team-model";

export function TeamRosterTab({ members }: { members: TeamMember[] }) {
  return <List disablePadding aria-label="Danh sách thành viên nhóm">
    {members.map(member => <ListItem key={member.id} disableGutters sx={{ py: 1.75, gap: 1.5, alignItems: "center", flexWrap: { xs: "wrap", sm: "nowrap" }, borderBottom: "1px solid", borderColor: "divider", "&:last-child": { borderBottom: 0 } }}>
      <Avatar sx={{ bgcolor: "action.hover", color: "text.primary", fontSize: 14, fontWeight: 600 }}>{initials(member.name)}</Avatar>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontWeight: 600, overflowWrap: "anywhere" }}>{member.name}{member.isLeader ? " (bạn)" : ""}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ overflowWrap: "anywhere", mt: 0.25 }}>{member.role} · {member.email}</Typography>
      </Box>
      <Chip label={member.isLeader ? "Trưởng nhóm" : "Thành viên"} size="small" variant="outlined" sx={{ ml: { xs: 6.5, sm: 0 }, color: member.isLeader ? "primary.dark" : "text.secondary" }} />
    </ListItem>)}
  </List>;
}
