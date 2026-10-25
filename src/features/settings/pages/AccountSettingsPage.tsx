import { ProfessionalProfileSettings } from "../components/ProfessionalProfileSettings";
import { validateContact } from "../validation";
import { PasswordSettings } from "../components/PasswordSettings";
import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Breadcrumbs,
  Link as MuiLink,
} from "@mui/material";
import { ArrowLeft, Save, Shield, Bell, User, Check } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuthSession } from "@/lib/hooks/useAuthSession";

const AccountSettingsForm: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser, role } = useAuthSession();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [companyName, setCompanyName] = useState(user?.companyName || "");

  const [phone, setPhone] = useState(user?.phone || "");
  const [contactEmail, setContactEmail] = useState(user?.contactEmail || "");
  const [address, setAddress] = useState(user?.address || "");
  const [contactError, setContactError] = useState("");

  // Notification preferences (NOTIF-003 / FR-064)
  const [emailOnInvite, setEmailOnInvite] = useState(user?.accountPreferences?.emailOnInvite ?? true);
  const [emailOnMessage, setEmailOnMessage] = useState(user?.accountPreferences?.emailOnMessage ?? true);
  const [emailOnAgreement, setEmailOnAgreement] = useState(user?.accountPreferences?.emailOnAgreement ?? true);

  // Privacy controls (SET-002 / FR-003, NFR-05)
  const [showProfilePublicly, setShowProfilePublicly] = useState(user?.accountPreferences?.showProfilePublicly ?? true);
  const [allowMatchingAI, setAllowMatchingAI] = useState(user?.accountPreferences?.allowMatchingAI ?? true);

  const [savedMessage, setSavedMessage] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateContact(name, email, phone, contactEmail);
    if (error) { setContactError(error); return; }
    setContactError("");
    updateUser({
      phone: phone.trim(), contactEmail: contactEmail.trim(), address: address.trim(),
      accountPreferences: { emailOnInvite, emailOnMessage, emailOnAgreement, showProfilePublicly, allowMatchingAI },
      name: name.trim(),
      email: email.trim(),
      companyName: companyName.trim() || undefined,
    });
    setSavedMessage("Đã lưu thông tin tài khoản trong bản demo. Thay đổi email chưa được xác minh; tùy chọn thông báo và quyền riêng tư chỉ được mô phỏng.");
  };

  return (
    <Container component="main" id="main" maxWidth="lg" sx={{ py: 4, "& .MuiPaper-root": { border: "2px solid", borderColor: "text.secondary", borderRadius: "13px" }, "& .MuiButton-root": { minHeight: 44, textTransform: "none", fontWeight: 700 }, "& .MuiButton-contained": { bgcolor: "primary.dark", color: "#fff" } }}>
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <MuiLink
            component="button"
            variant="body2"
            onClick={() => navigate(-1)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              color: "#64748b",
              textDecoration: "none",
              "&:hover": { color: "#f4490b" },
            }}
          >
            <ArrowLeft size={16} /> Quay lại
          </MuiLink>
          <Typography variant="body2" color="text.primary" sx={{ fontWeight: 600 }}>
            Cài đặt tài khoản & Quyền riêng tư
          </Typography>
        </Breadcrumbs>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography
          component="h1"
          variant="h4"
          sx={{
            fontWeight: 800,
            fontFamily: "Space Grotesk, sans-serif",
            color: "#1e293b",
          }}
        >
          Cài đặt tài khoản
        </Typography>
        <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>
          Quản lý thông tin liên lạc, mật khẩu và tùy chọn tài khoản.
        </Typography>
      </Box>

      {contactError && <Alert severity="error" sx={{ mb: 2 }}>{contactError}</Alert>}
      {savedMessage && (
        <Alert
          icon={<Check size={18} />}
          severity="success"
          sx={{ mb: 3, borderRadius: "10px" }}
        >
          {savedMessage}
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={handleSave}
        sx={{ display: "flex", flexDirection: "column", gap: 3 }}
      >
        {/* Profile Information (SET-001) */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            bgcolor: "#ffffff",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <User size={18} color="#f4490b" />
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1e293b" }}>
              Thông tin cá nhân & Liên lạc
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              fullWidth
              required label="Họ và tên hiển thị"
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
            <TextField fullWidth label="Địa chỉ liên hệ" autoComplete="street-address" value={address} onChange={e => setAddress(e.target.value)} multiline minRows={2} />
            {role === "client" && (
              <TextField
                fullWidth
                label="Tên doanh nghiệp / Đơn vị tuyển dụng"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            )}
          </Box>
        </Paper>

        {/* Privacy & Visibility Preferences (SET-002 / FR-003, NFR-05) */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            bgcolor: "#ffffff",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Shield size={18} color="#f4490b" />
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1e293b" }}>
              Quyền riêng tư & Hiển thị hồ sơ
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: "#64748b", display: "block", mb: 2 }}>
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

            <Divider sx={{ my: 1 }} />

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
                    Đề xuất thông minh & Khớp nối brief (FR-017, FR-034)
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
          elevation={0}
          sx={{
            p: 3,
            borderRadius: "16px",
            border: "1px solid #e2e8f0",
            bgcolor: "#ffffff",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Bell size={18} color="#f4490b" />
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1e293b" }}>
              Tùy chọn thông báo qua email
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: "#64748b", display: "block", mb: 2 }}>
            Nhận thông báo tự động khi có tương tác quan trọng trong chu trình dự án
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
                  Gửi email khi nhận được lời mời tham gia dự án mới (7 ngày phản hồi)
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
                  Gửi email khi có tin nhắn mới trong kênh trao đổi dự án đã mở
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
                  Gửi email khi có đề xuất hoặc điều chỉnh thỏa thuận hợp tác (3 ngày phản hồi)
                </Typography>
              }
            />
          </Box>
        </Paper>

        <Box sx={{ display: "flex", justifyContent: "flex-end", flexWrap: "wrap", gap: 2 }}>
          <Button variant="outlined" onClick={() => { setName(user?.name || ""); setEmail(user?.email || ""); setPhone(user?.phone || ""); setContactEmail(user?.contactEmail || ""); setAddress(user?.address || ""); setCompanyName(user?.companyName || ""); setContactError(""); setSavedMessage("");setEmailOnInvite(user?.accountPreferences?.emailOnInvite ?? true); setEmailOnMessage(user?.accountPreferences?.emailOnMessage ?? true); setEmailOnAgreement(user?.accountPreferences?.emailOnAgreement ?? true); setShowProfilePublicly(user?.accountPreferences?.showProfilePublicly ?? true); setAllowMatchingAI(user?.accountPreferences?.allowMatchingAI ?? true); }}>Hủy thay đổi</Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={<Save size={18} />}
            sx={{
              bgcolor: "#f4490b",
              "&:hover": { bgcolor: "#bd3d14" },
              px: 4,
              py: 1.2,
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 700,
            }}
          >
            Lưu thay đổi cài đặt
          </Button>
        </Box>
      </Box>
      {role === "freelancer" && <ProfessionalProfileSettings />}
      <PasswordSettings />
    </Container>
  );
};

export function AccountSettingsPage() {
  const { user, role } = useAuthSession();
  return <AccountSettingsForm key={`${user?.id ?? "guest"}:${role}`} />;
}
export default AccountSettingsPage;
