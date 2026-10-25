import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Alert, Button, Dialog, DialogContent, DialogTitle, MenuItem, Snackbar, TextField } from "@mui/material";
import { SendInvitationDialog } from "./SendInvitationDialog";
import { useTalentProfileActions } from "../hooks/useTalentProfileActions";

export function TalentProfileActions() {
  const vm = useTalentProfileActions();
  const [params, setParams] = useSearchParams();
  const [open, setOpen] = useState(false);
  const [choosingProject, setChoosingProject] = useState(false);
  if (!vm.talent) return null;
  const canChat = vm.candidate?.chatUnlocked && vm.candidate.status !== "not_selected";
  const availableProjects = vm.projects.filter(project => project.status === "published");
  return <>
    {!vm.project ? <>
      <Button variant="contained" onClick={() => setChoosingProject(true)}>Mời tham gia dự án</Button>
      <Dialog open={choosingProject} onClose={() => setChoosingProject(false)} fullWidth maxWidth="sm">
        <DialogTitle>Chọn dự án để mời</DialogTitle><DialogContent>
          {availableProjects.length ? <TextField select fullWidth label="Dự án đang tuyển" value="" sx={{ mt: 1 }} onChange={event => { const next = new URLSearchParams(params); next.set("project", event.target.value); setParams(next); setChoosingProject(false); }}>
            {availableProjects.map(project => <MenuItem key={project.id} value={project.id}>{project.title}</MenuItem>)}
          </TextField> : <Alert severity="info">Bạn chưa có dự án đang tuyển. Hãy công bố dự án trước khi gửi lời mời.</Alert>}
          <Button onClick={() => setChoosingProject(false)} sx={{ mt: 2 }}>Đóng</Button>
        </DialogContent>
      </Dialog>
    </> : <>
      {canChat ? <Button component={Link} to={`/business/messages?view=project&scope=${vm.project.id}&project=${vm.project.id}&talent=${vm.talent.id}`} variant="contained">Nhắn tin</Button>
        : vm.candidate ? <Button component={Link} to={`/business/projects/${vm.project.id}/applicants`} variant="outlined">Xem hồ sơ ứng tuyển</Button>
        : vm.project.status === "published" && <Button disabled={vm.invited} onClick={() => setOpen(true)} variant="contained">{vm.invited ? "Đã gửi lời mời" : "Mời tham gia dự án"}</Button>}
      <SendInvitationDialog open={open} onClose={() => setOpen(false)} brief={vm.project} talent={vm.talent} onConfirm={(talentId, note) => vm.sendInvitation(vm.project!.id, talentId, note)} />
    </>}
    <Snackbar open={Boolean(vm.toast)} autoHideDuration={4500} onClose={() => vm.setToast("")}><Alert onClose={() => vm.setToast("")}>{vm.toast}</Alert></Snackbar>
  </>;
}
