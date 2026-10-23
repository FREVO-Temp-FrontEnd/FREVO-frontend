import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import type { Invitation, ProjectBrief } from "@/lib/types/marketplace.types";

interface InvitationDetailDialogProps {
  open: boolean;
  onClose: () => void;
  invitation: Invitation | null;
  project: ProjectBrief | undefined;
  action: "accept" | "decline";
  onAccept: (invitationId: string) => void;
  onDecline: (invitationId: string) => void;
}

export function InvitationDetailDialog({ open, onClose, invitation, project, action, onAccept, onDecline }: InvitationDetailDialogProps) {
  if (!invitation || !project) return null;
  const accepting = action === "accept";
  const canRespond = invitation.status === "pending" && new Date(invitation.expiresAt).getTime() > Date.now();
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth aria-labelledby="invitation-confirm-title">
      <DialogTitle id="invitation-confirm-title" sx={{ fontFamily: "Archivo, Arial, sans-serif", fontWeight: 700, pt: 3, px: 3 }}>
        Bạn có chắc chắn muốn {accepting ? "nhận" : "từ chối"} lời mời từ dự án {project.title} không?
      </DialogTitle>
      <DialogActions sx={{ p: 3, pt: 1, gap: 1, flexWrap: "wrap" }}>
        <Button variant="outlined" color="secondary" onClick={onClose}>Quay lại</Button>
        <Button variant="contained" disabled={!canRespond} onClick={() => {
          if (!canRespond) return;
          if (accepting) onAccept(invitation.id);
          else onDecline(invitation.id);
          onClose();
        }}>{accepting ? "Xác nhận nhận lời mời" : "Xác nhận từ chối"}</Button>
      </DialogActions>
    </Dialog>
  );
}
