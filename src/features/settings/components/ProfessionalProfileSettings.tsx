import { useState, type FormEvent } from "react";
import { Alert, Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useFreelancer } from "@/lib/hooks/useFreelancer";
import { usePortfolio } from "@/lib/hooks/usePortfolio";
import type { TalentProfile } from "@/lib/types/marketplace.types";
import { useProfilePresentation } from "@/lib/hooks/useProfilePresentation";

function ProfileForm({ talent }: { talent: TalentProfile }) {
  const { works } = usePortfolio();
  const { profile, setProfile } = useProfilePresentation(talent.id, {
    name: talent.name, role: talent.role, location: talent.location, availability: talent.availability,
    about: talent.about, skills: talent.skills,
    featuredIds: works.filter(work => work.visibility === "public").slice(0, 3).map(work => work.id),
  });
  const [draft, setDraft] = useState({ ...profile, skills: profile.skills.join(", ") });
  const [saved, setSaved] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setProfile(current => ({ ...current, name: draft.name.trim(), role: draft.role.trim(), location: draft.location.trim(), availability: draft.availability.trim(), about: draft.about.trim(), skills: [...new Set(draft.skills.split(",").map(value => value.trim()).filter(Boolean))] }));
    setSaved(true);
  }
  return <Paper component="section" elevation={0} sx={{ p: { xs: 2, sm: 3 }, mt: 3 }}>
    <Typography component="h2" variant="h6" sx={{ mb: 1 }}>Thông tin hồ sơ công khai</Typography>
    <Typography color="text.secondary" sx={{ mb: 2 }}>Thông tin dưới đây hiển thị trên trang cá nhân. Thông tin liên lạc và mật khẩu được quản lý riêng.</Typography>
    {saved && <Alert severity="success" sx={{ mb: 2 }} role="status">Đã cập nhật hồ sơ công khai trong bản demo.</Alert>}
    <Box component="form" onSubmit={submit} sx={{ display: "grid", gap: 2 }}>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
        {([['name', 'Tên công khai'], ['role', 'Chuyên môn'], ['location', 'Địa điểm hiển thị'], ['availability', 'Trạng thái nhận việc']] as const).map(([field, label]) => <TextField key={field} required label={label} value={draft[field]} onChange={e => { setDraft(current => ({ ...current, [field]: e.target.value })); setSaved(false); }} slotProps={{ htmlInput: { maxLength: 120, pattern: ".*\\S.*" } }} />)}
      </Box>
      <TextField label="Giới thiệu" value={draft.about} multiline minRows={3} onChange={e => { setDraft(current => ({ ...current, about: e.target.value })); setSaved(false); }} />
      <TextField label="Các kỹ năng chuyên môn" value={draft.skills} helperText="Phân cách các kỹ năng bằng dấu phẩy." onChange={e => { setDraft(current => ({ ...current, skills: e.target.value })); setSaved(false); }} />
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}><Button type="submit" variant="contained">Lưu hồ sơ công khai</Button><Button variant="outlined" onClick={() => { setDraft({ ...profile, skills: profile.skills.join(", ") }); setSaved(false); }}>Hủy thay đổi</Button></Box>
    </Box>
  </Paper>;
}

export function ProfessionalProfileSettings() {
  const { currentTalent } = useFreelancer();
  return currentTalent ? <ProfileForm key={currentTalent.id} talent={currentTalent} /> : null;
}
