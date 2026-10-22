import { useState } from "react";
import { Link } from "react-router";
import { Alert, Button, Snackbar } from "@mui/material";
import { SendInvitationDialog } from "./SendInvitationDialog";
import { useTalentProfileActions } from "../hooks/useTalentProfileActions";

export function TalentProfileActions() {
  const vm = useTalentProfileActions();
  const [open, setOpen] = useState(false);
  if (!vm.project || !vm.talent) return null;
  const canChat = vm.candidate?.chatUnlocked && vm.candidate.status !== "not_selected";
  return <>
    {canChat ? <Button component={Link} to={`/business/messages?view=project&scope=${vm.project.id}&project=${vm.project.id}&talent=${vm.talent.id}`} variant="contained">Nhắn tin</Button>
      : vm.candidate ? <Button component={Link} to={`/business/projects/${vm.project.id}/applicants`} variant="outlined">Xem hồ sơ ứng tuyển</Button>
      : vm.project.status === "published" && <Button disabled={vm.invited} onClick={() => setOpen(true)} variant="contained">{vm.invited ? "Đã gửi lời mời" : "Gửi lời mời"}</Button>}
    <SendInvitationDialog open={open} onClose={() => setOpen(false)} brief={vm.project} talent={vm.talent} onConfirm={(talentId, note) => vm.sendInvitation(vm.project!.id, talentId, note)} />
    <Snackbar open={Boolean(vm.toast)} autoHideDuration={4500} onClose={() => vm.setToast("")}><Alert onClose={() => vm.setToast("")}>{vm.toast}</Alert></Snackbar>
  </>;
}
