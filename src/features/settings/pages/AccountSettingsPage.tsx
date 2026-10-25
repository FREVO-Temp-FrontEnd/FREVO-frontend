import { validateContact } from "../validation";
import { PasswordSettings } from "../components/PasswordSettings";
import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
} from "@mui/material";
import { ArrowLeft, Save, Shield, Bell, User, LockKeyhole } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuthSession } from "@/lib/hooks/useAuthSession";
import { useFreelancer } from "@/lib/hooks/useFreelancer";
import { usePortfolio } from "@/lib/hooks/usePortfolio";
import { useProfilePresentation } from "@/lib/hooks/useProfilePresentation";

const AccountSettingsForm: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser, role } = useAuthSession();
  const { currentTalent } = useFreelancer();
  const { works } = usePortfolio();
  const { profile, setProfile } = useProfilePresentation(currentTalent?.id ?? user?.id ?? "minh-anh", {
    name: currentTalent?.name ?? "", role: currentTalent?.role ?? "", location: currentTalent?.location ?? "",
    availability: currentTalent?.availability ?? "", about: currentTalent?.about ?? "", skills: currentTalent?.skills ?? [],
    featuredIds: works.filter(work => work.visibility === "public").slice(0, 3).map(work => work.id),
  });
  const [publicProfile, setPublicProfile] = useState(() => ({ availability: profile.availability, about: profile.about, skills: profile.skills.join(", ") }));

  const [name, setName] = useState(user?.name || profile.name);
  const [email, setEmail] = useState(user?.email || "");
  const [companyName, setCompanyName] = useState(user?.companyName || "");

  const [phone, setPhone] = useState(user?.phone || "");
  const [contactEmail, setContactEmail] = useState(user?.contactEmail || "");
  const [address, setAddress] = useState(user?.address || (role === "freelancer" ? profile.location : ""));
  const [contactError, setContactError] = useState("");

  // Notification preferences (NOTIF-003 / FR-064)
  const [emailOnInvite, setEmailOnInvite] = useState(user?.accountPreferences?.emailOnInvite ?? true);
  const [emailOnMessage, setEmailOnMessage] = useState(user?.accountPreferences?.emailOnMessage ?? true);
  const [emailOnAgreement, setEmailOnAgreement] = useState(user?.accountPreferences?.emailOnAgreement ?? true);

  // Privacy controls (SET-002 / FR-003, NFR-05)
  const [showProfilePublicly, setShowProfilePublicly] = useState(user?.accountPreferences?.showProfilePublicly ?? true);
  const [allowMatchingAI, setAllowMatchingAI] = useState(user?.accountPreferences?.allowMatchingAI ?? true);

  const [saveOpen, setSaveOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("account-info");

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("#main section[id]"));
    const mobile = window.innerWidth < 768;
    const cutoff = window.innerHeight * (mobile ? .5 : .44);
    const headings = sections.map(section => section.querySelector<HTMLElement>("h2")).filter((heading): heading is HTMLElement => Boolean(heading));
    const observer = new IntersectionObserver(() => {
      const current = [...sections].reverse().find(section => (section.querySelector("h2")?.getBoundingClientRect().top ?? Infinity) <= cutoff);
      setActiveSection(current?.id ?? sections[0]?.id ?? "account-info");
    }, { rootMargin: `0px 0px -${mobile ? 50 : 56}% 0px` });
    headings.forEach(heading => observer.observe(heading));
    return () => observer.disconnect();
  }, [role]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateContact(name, email, phone, contactEmail);
    if (error) { setContactError(error); return; }
    setContactError("");
    if (role === "freelancer" && currentTalent) {
      setProfile(current => ({ ...current, name: name.trim(), location: address.trim(), availability: publicProfile.availability.trim(), about: publicProfile.about.trim(), skills: [...new Set(publicProfile.skills.split(",").map(value => value.trim()).filter(Boolean))] }));
    }
    updateUser({
      phone: phone.trim(), contactEmail: contactEmail.trim(), address: address.trim(),
      accountPreferences: { emailOnInvite, emailOnMessage, emailOnAgreement, showProfilePublicly, allowMatchingAI },
      name: name.trim(),
      email: email.trim(),
      companyName: companyName.trim() || undefined,
    });
    setSaveOpen(true);
  };

  return (
    <Container component="main" id="main" maxWidth="lg" sx={{ py: { xs: 3, md: 5 }, pb: { xs: 12, md: 24 }, "& .MuiPaper-root": { border: "1px solid", borderColor: "divider", borderRadius: "13px", boxShadow: "none" }, "& .MuiButton-root": { minHeight: 44, borderRadius: "999px", textTransform: "none", fontWeight: 700 }, "& .MuiButton-contained": { bgcolor: "primary.dark", color: "#fff", "&:hover": { bgcolor: "#9f310f" } }, "& .MuiButton-outlined": { borderColor: "primary.dark", color: "primary.dark", "&:hover": { borderColor: "primary.dark", bgcolor: "#fff0e9" } }, "& section[id]": { scrollMarginTop: "96px" }, "& .MuiFormControlLabel-root": { m: 0, py: 1.5, display: "flex", flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", gap: 2, width: "100%" }, "& .MuiFormControlLabel-label": { flex: 1 }, "& .MuiSwitch-root": { flexShrink: 0 } }}>
      <Button variant="outlined" onClick={() => navigate(-1)} startIcon={<ArrowLeft size={17} />} sx={{ mb: 2 }}>Quay lại</Button>
      <Box sx={{ mb: { xs: 3, md: 5 } }}>
        <Typography component="h1" variant="h4" sx={{ fontFamily: "Archivo, sans-serif", fontWeight: 800, color: "text.primary" }}>Cài đặt tài khoản</Typography>
        <Typography sx={{ color: "text.secondary", mt: 1, maxWidth: 620 }}>Quản lý thông tin liên hệ, hồ sơ, quyền riêng tư và bảo mật tại một nơi.</Typography>
      </Box>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "220px minmax(0, 1fr)" }, alignItems: "start", gap: { xs: 3, md: 5 } }}>
        <Box component="nav" aria-label="Các mục cài đặt" sx={{ display: "flex", flexDirection: { xs: "row", md: "column" }, flexWrap: { xs: "wrap", md: "nowrap" }, gap: .5, position: { md: "sticky" }, top: { md: 88 } }}>
          {[
            ["#account-info", "Thông tin tài khoản", User],
            ["#account-security", "Mật khẩu", LockKeyhole],
            ["#account-privacy", "Quyền riêng tư", Shield],
            ["#account-notifications", "Thông báo", Bell],
          ].map(([href, label, Icon]) => <Box key={href as string} component="a" href={href as string} aria-current={activeSection === (href as string).slice(1) ? "location" : undefined} onClick={event => { if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return; event.preventDefault(); const id = (href as string).slice(1); document.getElementById(id)?.scrollIntoView({ block: "start", behavior: "instant" }); window.history.replaceState(window.history.state, "", href as string); setActiveSection(id); }} sx={{ display: "flex", alignItems: "center", gap: 1.25, minHeight: 44, px: 1.5, borderRadius: "10px", textDecoration: "none", color: activeSection === (href as string).slice(1) ? "primary.dark" : "text.primary", bgcolor: activeSection === (href as string).slice(1) ? "#fff0e9" : "transparent", fontSize: 14, fontWeight: 700, whiteSpace: "nowrap", "&:hover, &:focus-visible": { bgcolor: "#edf0ea", color: "primary.dark" } }}><Icon size={17} aria-hidden="true" />{label as string}</Box>)}
        </Box>
        <Box sx={{ minWidth: 0 }}>

      {contactError && <Alert severity="error" sx={{ mb: 2 }}>{contactError}</Alert>}

      <Box
        component="form"
        id="account-settings-form"
        onSubmit={handleSave}
        sx={{ display: "flex", flexDirection: "column", gap: 3 }}
      >
        {/* Profile Information (SET-001) */}
        <Paper
          component="section" id="account-info" aria-labelledby="account-info-heading" elevation={0}
          sx={{
            p: { xs: 2.5, sm: 3.5 },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <User size={18} color="#f4490b" />
            <Typography id="account-info-heading" component="h2" variant="h6" sx={{ fontWeight: 800, color: "text.primary" }}>
              Thông tin tài khoản
            </Typography>
          </Box>

          <Typography sx={{ color: "text.secondary", mb: 3, fontSize: 14 }}>Thông tin dùng để đăng nhập và liên hệ về dự án.</Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" }, gap: 2.5, "& .MuiFormHelperText-root": { ml: 0 } }}>
            <TextField
              fullWidth
              required label="Họ và tên"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <TextField
              fullWidth
              required type="email" label="Email đăng nhập"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              helperText="Email dùng để nhận thông báo quan trọng và phục hồi mật khẩu."
            />

            <TextField fullWidth label="Số điện thoại" type="tel" autoComplete="tel" value={phone} onChange={e => setPhone(e.target.value)} helperText="Thông tin liên lạc riêng, không hiển thị trên hồ sơ công khai." />
            <TextField fullWidth label="Email liên hệ" type="email" autoComplete="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} helperText="Có thể khác email đăng nhập." />
            <TextField fullWidth label="Địa chỉ liên hệ" autoComplete="street-address" value={address} onChange={e => setAddress(e.target.value)} multiline minRows={2} helperText={role === "freelancer" ? "Địa chỉ này cũng hiển thị trên hồ sơ của bạn." : undefined} sx={{ gridColumn: { sm: "1 / -1" } }} />
            {role === "client" && (
              <TextField
                fullWidth
                label="Tên doanh nghiệp / Đơn vị tuyển dụng"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            )}
          </Box>
          {role === "freelancer" && currentTalent && <Box sx={{ mt: 2.5 }}>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" }, gap: 2.5 }}>
              <TextField required label="Trạng thái nhận việc" value={publicProfile.availability} onChange={e => setPublicProfile(current => ({ ...current, availability: e.target.value }))} slotProps={{ htmlInput: { maxLength: 120, pattern: ".*\\S.*" } }} sx={{ gridColumn: { sm: "1 / -1" } }} />
              <TextField label="Giới thiệu" value={publicProfile.about} multiline minRows={3} onChange={e => setPublicProfile(current => ({ ...current, about: e.target.value }))} sx={{ gridColumn: { sm: "1 / -1" } }} />
              <TextField label="Các kỹ năng chuyên môn" value={publicProfile.skills} helperText="Phân cách các kỹ năng bằng dấu phẩy." onChange={e => setPublicProfile(current => ({ ...current, skills: e.target.value }))} sx={{ gridColumn: { sm: "1 / -1" } }} />
            </Box>
          </Box>}
          <Box sx={{ display: "flex", justifyContent: "flex-end", flexWrap: "wrap", gap: 1.5, mt: 3 }}>
            <Button variant="outlined" onClick={() => { setName(user?.name || profile.name); setEmail(user?.email || ""); setPhone(user?.phone || ""); setContactEmail(user?.contactEmail || ""); setAddress(user?.address || (role === "freelancer" ? profile.location : "")); setCompanyName(user?.companyName || ""); setPublicProfile({ availability: profile.availability, about: profile.about, skills: profile.skills.join(", ") }); setContactError(""); setSaveOpen(false); setEmailOnInvite(user?.accountPreferences?.emailOnInvite ?? true); setEmailOnMessage(user?.accountPreferences?.emailOnMessage ?? true); setEmailOnAgreement(user?.accountPreferences?.emailOnAgreement ?? true); setShowProfilePublicly(user?.accountPreferences?.showProfilePublicly ?? true); setAllowMatchingAI(user?.accountPreferences?.allowMatchingAI ?? true); }}>Hủy thay đổi</Button>
            <Button type="submit" variant="contained" startIcon={<Save size={18} />}>Lưu thay đổi cài đặt</Button>
          </Box>
        </Paper>

      </Box>
      <PasswordSettings />
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 3 }}>

        {/* Privacy & Visibility Preferences (SET-002 / FR-003, NFR-05) */}
        <Paper
          component="section" id="account-privacy" aria-labelledby="account-privacy-heading" elevation={0}
          sx={{
            p: { xs: 2.5, sm: 3.5 },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Shield size={18} color="#f4490b" />
            <Typography id="account-privacy-heading" component="h2" variant="h6" sx={{ fontWeight: 800, color: "text.primary" }}>
              Quyền riêng tư
            </Typography>
          </Box>
          <Typography sx={{ color: "text.secondary", display: "block", mb: 2.5, fontSize: 14 }}>
            Tùy chọn mô phỏng, chưa thay đổi khả năng hiển thị hồ sơ thực tế.
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={showProfilePublicly}
                  onChange={(e) => setShowProfilePublicly(e.target.checked)}
                  sx={{ "& .Mui-checked": { color: "#f4490b" }, "& .Mui-checked + .MuiSwitch-track": { bgcolor: "#f4490b" } }}
                />
              }
              label={
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Hiển thị hồ sơ trên danh mục công khai
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#64748b" }}>
                    Cho phép Doanh nghiệp và khách vãng lai tìm thấy bạn khi khám phá tài năng.
                  </Typography>
                </Box>
              }
            />


            <FormControlLabel
              control={
                <Switch
                  checked={allowMatchingAI}
                  onChange={(e) => setAllowMatchingAI(e.target.checked)}
                  sx={{ "& .Mui-checked": { color: "#f4490b" }, "& .Mui-checked + .MuiSwitch-track": { bgcolor: "#f4490b" } }}
                />
              }
              label={
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Đề xuất dự án phù hợp
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#64748b" }}>
                    Cho phép thuật toán so khớp phân tích kỹ năng và danh mục tác phẩm để gợi ý dự án phù hợp.
                  </Typography>
                </Box>
              }
            />
          </Box>
        </Paper>

        {/* Email Notification Preferences (NOTIF-003 / FR-064) */}
        <Paper
          component="section" id="account-notifications" aria-labelledby="account-notifications-heading" elevation={0}
          sx={{
            p: { xs: 2.5, sm: 3.5 },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Bell size={18} color="#f4490b" />
            <Typography id="account-notifications-heading" component="h2" variant="h6" sx={{ fontWeight: 800, color: "text.primary" }}>
              Thông báo qua email
            </Typography>
          </Box>
          <Typography sx={{ color: "text.secondary", display: "block", mb: 2.5, fontSize: 14 }}>
            Chọn những cập nhật bạn muốn nhận qua email.
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={emailOnInvite}
                  onChange={(e) => setEmailOnInvite(e.target.checked)}
                  sx={{ "& .Mui-checked": { color: "#f4490b" }, "& .Mui-checked + .MuiSwitch-track": { bgcolor: "#f4490b" } }}
                />
              }
              label={
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Lời mời tham gia dự án
                </Typography>
              }
            />

            <FormControlLabel
              control={
                <Switch
                  checked={emailOnMessage}
                  onChange={(e) => setEmailOnMessage(e.target.checked)}
                  sx={{ "& .Mui-checked": { color: "#f4490b" }, "& .Mui-checked + .MuiSwitch-track": { bgcolor: "#f4490b" } }}
                />
              }
              label={
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Tin nhắn mới
                </Typography>
              }
            />

            <FormControlLabel
              control={
                <Switch
                  checked={emailOnAgreement}
                  onChange={(e) => setEmailOnAgreement(e.target.checked)}
                  sx={{ "& .Mui-checked": { color: "#f4490b" }, "& .Mui-checked + .MuiSwitch-track": { bgcolor: "#f4490b" } }}
                />
              }
              label={
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Đề xuất hoặc điều chỉnh thỏa thuận
                </Typography>
              }
            />
          </Box>
        </Paper>

      </Box>
        </Box>
      </Box>
      <Snackbar open={saveOpen} autoHideDuration={4500} onClose={() => setSaveOpen(false)} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert onClose={() => setSaveOpen(false)} severity="success" variant="filled" role="status" sx={{ width: "100%" }}>{role === "freelancer" ? "Đã cập nhật thông tin tài khoản và hồ sơ thành công." : "Đã cập nhật thông tin tài khoản thành công."}</Alert>
      </Snackbar>
    </Container>
  );
};

export function AccountSettingsPage() {
  const { user, role } = useAuthSession();
  return <AccountSettingsForm key={`${user?.id ?? "guest"}:${role}`} />;
}
export default AccountSettingsPage;
