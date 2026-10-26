import { validatePassword } from "../validation";
import { useState, type FormEvent } from "react";
import { Alert, Box, Button, Paper, Snackbar, TextField, Typography } from "@mui/material";
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
  return <Paper component="section" id="account-security" aria-labelledby="account-security-heading" elevation={0} sx={{ p: { xs: 2.5, sm: 3.5 }, mt: 3 }}>
    <Typography id="account-security-heading" component="h2" variant="h6" sx={{ display: "flex", gap: 1, alignItems: "center", mb: 2, fontWeight: 800 }}><LockKeyhole size={20} />Mật khẩu & bảo mật</Typography>
    <Alert severity="info" sx={{ mb: 2 }}>Bản demo chưa kết nối hệ thống xác thực. Form chỉ kiểm tra dữ liệu nhập; không xác minh mật khẩu hiện tại, không đổi mật khẩu đăng nhập và không lưu mật khẩu.</Alert>
    <Box component="form" noValidate onSubmit={submit} sx={{ display: "grid", gap: 2, width: "100%", minWidth: 0 }}>
      <TextField required label="Mật khẩu hiện tại" name="current" type="password" autoComplete="current-password" value={current} onChange={e => { setCurrent(e.target.value); setChecked(false); }} error={Boolean(errors.current)} helperText={errors.current} />
      <TextField required label="Mật khẩu mới" name="password" type="password" autoComplete="new-password" value={password} onChange={e => { setPassword(e.target.value); setChecked(false); }} error={Boolean(errors.password)} helperText={errors.password || "Ít nhất 6 ký tự theo quy tắc đăng ký của bản demo."} />
      <TextField required label="Xác nhận mật khẩu mới" name="confirmation" type="password" autoComplete="new-password" value={confirmation} onChange={e => { setConfirmation(e.target.value); setChecked(false); }} error={Boolean(errors.confirmation)} helperText={errors.confirmation} />
      <Box sx={{ display: "flex", justifyContent: "flex-end", flexWrap: "wrap", gap: 1.5 }}><Button variant="outlined" onClick={reset}>Hủy</Button><Button type="submit" variant="contained">Kiểm tra thay đổi (demo)</Button></Box>
    </Box>
    <Snackbar open={checked} autoHideDuration={4500} onClose={() => setChecked(false)} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
      <Alert onClose={() => setChecked(false)} severity="success" variant="filled" role="status" sx={{ width: "100%" }}>Thông tin hợp lệ. Mật khẩu đăng nhập chưa thay đổi trong bản demo.</Alert>
    </Snackbar>
  </Paper>;
}
