import { validatePassword } from "../validation";
import { useState, type FormEvent } from "react";
import { Alert, Box, Button, Paper, TextField, Typography } from "@mui/material";
import { LockKeyhole } from "lucide-react";

export function PasswordSettings() {
  const [current, setCurrent] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  function reset() { setCurrent(""); setPassword(""); setConfirmation(""); setErrors({}); setChecked(false); }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = validatePassword(current, password, confirmation);
    setErrors(next);
    if (Object.keys(next).length) { event.currentTarget.querySelector<HTMLInputElement>(`[name="${Object.keys(next)[0]}"]`)?.focus(); return; }
    setCurrent(""); setPassword(""); setConfirmation(""); setChecked(true);
  }
  return <Paper component="section" elevation={0} sx={{ p: { xs: 2, sm: 3 }, mt: 3, border: "2px solid", borderColor: "text.secondary", borderRadius: "13px" }}>
    <Typography component="h2" variant="h6" sx={{ display: "flex", gap: 1, alignItems: "center", mb: 2 }}><LockKeyhole size={20} />Mật khẩu & bảo mật</Typography>
    <Alert severity="info" sx={{ mb: 2 }}>Bản demo chưa kết nối hệ thống xác thực. Form chỉ kiểm tra dữ liệu nhập; không xác minh mật khẩu hiện tại, không đổi mật khẩu đăng nhập và không lưu mật khẩu.</Alert>
    {checked && <Alert severity="success" role="status" sx={{ mb: 2 }}>Dữ liệu đã hợp lệ và các ô mật khẩu đã được xóa. Mật khẩu đăng nhập chưa thay đổi.</Alert>}
    <Box component="form" noValidate onSubmit={submit} sx={{ display: "grid", gap: 2, maxWidth: 640 }}>
      <TextField required label="Mật khẩu hiện tại" name="current" type="password" autoComplete="current-password" value={current} onChange={e => { setCurrent(e.target.value); setChecked(false); }} error={Boolean(errors.current)} helperText={errors.current} />
      <TextField required label="Mật khẩu mới" name="password" type="password" autoComplete="new-password" value={password} onChange={e => { setPassword(e.target.value); setChecked(false); }} error={Boolean(errors.password)} helperText={errors.password || "Ít nhất 6 ký tự theo quy tắc đăng ký của bản demo."} />
      <TextField required label="Xác nhận mật khẩu mới" name="confirmation" type="password" autoComplete="new-password" value={confirmation} onChange={e => { setConfirmation(e.target.value); setChecked(false); }} error={Boolean(errors.confirmation)} helperText={errors.confirmation} />
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}><Button type="submit" variant="contained">Kiểm tra thay đổi (demo)</Button><Button variant="outlined" onClick={reset}>Hủy</Button></Box>
    </Box>
  </Paper>;
}
