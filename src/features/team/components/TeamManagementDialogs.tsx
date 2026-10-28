import { useState, type FormEvent } from "react";
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, TextField, Typography, type TextFieldProps } from "@mui/material";
import { X } from "lucide-react";
import { teamDisciplines, validateInvitation, validateTeam, type InvitationDraft, type TeamBasics, type TeamProfile } from "../team-model";

function Field({ label, ...props }: TextFieldProps) {
  return <Box sx={{ mt: 2.5 }}>
    <Typography component="label" id={`${props.id}-label`} htmlFor={props.id} sx={{ display: "block", mb: 1, fontSize: 14, fontWeight: 600 }}>{label}{props.required ? " *" : ""}</Typography>
    <TextField {...props} fullWidth size="small" slotProps={{ ...(props.select ? { select: { labelId: `${props.id}-label` } } : {}), ...props.slotProps }} helperText={props.error ? <span role="alert">{props.helperText}</span> : props.helperText} />
  </Box>;
}

function Title({ children, onClose }: { children: string; onClose: () => void }) {
  return <DialogTitle id="team-dialog-title" sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, fontWeight: 700 }}>
    {children}<IconButton onClick={onClose} aria-label="Đóng hộp thoại"><X size={20} /></IconButton>
  </DialogTitle>;
}

export function TeamProfileDialog({ team, onClose, onSave }: { team: TeamProfile | null; onClose: () => void; onSave: (basics: TeamBasics) => string }) {
  const [draft, setDraft] = useState<TeamBasics>({ name: team?.name || "", summary: team?.summary || "", discipline: team?.discipline || "" });
  const [errors, setErrors] = useState<Partial<Record<keyof TeamBasics, string>>>({});
  const [saveError, setSaveError] = useState("");
  function submit(event: FormEvent) {
    event.preventDefault();
    const validation = validateTeam(draft);
    setErrors(validation);
    setSaveError("");
    const first = Object.keys(validation)[0];
    if (first) { document.getElementById(`team-${first}`)?.focus(); return; }
    const error = onSave(draft);
    if (error) setSaveError(error); else onClose();
  }
  return <Dialog open onClose={onClose} fullWidth maxWidth="sm" aria-labelledby="team-dialog-title">
    <Box component="form" noValidate onSubmit={submit}>
      <Title onClose={onClose}>{team ? "Chỉnh sửa nhóm" : "Tạo nhóm của bạn"}</Title>
      <DialogContent sx={{ pt: 0 }}>
        <Typography color="text.secondary" variant="body2">{team ? "Cập nhật thông tin giới thiệu với cộng sự và khách hàng." : "Tạo hồ sơ chung. Bạn sẽ là người đại diện của nhóm."}</Typography>
        <Field id="team-name" label="Tên nhóm" autoFocus required value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} error={!!errors.name} helperText={errors.name || "Tối đa 60 ký tự."} placeholder="Ví dụ: Mây Creative" slotProps={{ htmlInput: { maxLength: 60 } }} />
        <Field id="team-summary" label="Giới thiệu ngắn" required multiline minRows={3} value={draft.summary} onChange={e => setDraft({ ...draft, summary: e.target.value })} error={!!errors.summary} helperText={errors.summary || "Giới thiệu thế mạnh và loại dự án của nhóm."} slotProps={{ htmlInput: { maxLength: 240 } }} />
        <Field id="team-discipline" label="Chuyên môn chính" select required value={draft.discipline} onChange={e => setDraft({ ...draft, discipline: e.target.value })} error={!!errors.discipline} helperText={errors.discipline}>
          {teamDisciplines.map(discipline => <MenuItem key={discipline} value={discipline}>{discipline}</MenuItem>)}
        </Field>
        {saveError && <Alert severity="error" sx={{ mt: 2 }}>{saveError}</Alert>}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}><Button onClick={onClose} color="inherit">Hủy</Button><Button type="submit" variant="contained" sx={{ bgcolor: "primary.dark", "&:hover": { bgcolor: "primary.dark" } }}>{team ? "Lưu thay đổi" : "Tạo nhóm"}</Button></DialogActions>
    </Box>
  </Dialog>;
}

export function TeamInviteDialog({ team, onClose, onInvite }: { team: TeamProfile; onClose: () => void; onInvite: (draft: InvitationDraft) => string }) {
  const [draft, setDraft] = useState<InvitationDraft>({ email: "", role: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof InvitationDraft, string>>>({});
  const [saveError, setSaveError] = useState("");
  function submit(event: FormEvent) {
    event.preventDefault();
    const validation = validateInvitation(team, draft);
    setErrors(validation);
    setSaveError("");
    const first = Object.keys(validation)[0];
    if (first) { document.getElementById(`invite-${first}`)?.focus(); return; }
    const error = onInvite(draft);
    if (error) setSaveError(error); else onClose();
  }
  return <Dialog open onClose={onClose} fullWidth maxWidth="sm" aria-labelledby="team-dialog-title">
    <Box component="form" noValidate onSubmit={submit}>
      <Title onClose={onClose}>Mời thành viên</Title>
      <DialogContent sx={{ pt: 0 }}>
        <Typography color="text.secondary" variant="body2">Mời cộng sự tham gia {team.name} qua email.</Typography>
        <Field id="invite-email" label="Email cộng sự" type="email" autoFocus required value={draft.email} onChange={e => setDraft({ ...draft, email: e.target.value })} error={!!errors.email} helperText={errors.email} placeholder="congsu@example.com" slotProps={{ htmlInput: { maxLength: 254 } }} />
        <Field id="invite-role" label="Vai trò chuyên môn" required value={draft.role} onChange={e => setDraft({ ...draft, role: e.target.value })} error={!!errors.role} helperText={errors.role || "Mô tả đóng góp chuyên môn, không thiết lập quyền truy cập."} placeholder="Ví dụ: UI/UX Designer" slotProps={{ htmlInput: { maxLength: 80 } }} />
        <Field id="invite-message" label="Lời nhắn (không bắt buộc)" multiline minRows={3} value={draft.message} onChange={e => setDraft({ ...draft, message: e.target.value })} error={!!errors.message} helperText={errors.message} placeholder="Chia sẻ ngắn về nhóm và mong muốn cộng tác" slotProps={{ htmlInput: { maxLength: 500 } }} />
        <Alert severity="info" sx={{ mt: 2.5 }}>Lời mời được mô phỏng và lưu trên trình duyệt. Không có email thật được gửi.</Alert>
        {saveError && <Alert severity="error" sx={{ mt: 2 }}>{saveError}</Alert>}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}><Button onClick={onClose} color="inherit">Hủy</Button><Button type="submit" variant="contained" sx={{ bgcolor: "primary.dark", "&:hover": { bgcolor: "primary.dark" } }}>Gửi lời mời</Button></DialogActions>
    </Box>
  </Dialog>;
}
