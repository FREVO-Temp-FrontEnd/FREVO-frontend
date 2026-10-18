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

export const AccountSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser, role } = useAuthSession();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [companyName, setCompanyName] = useState(user?.companyName || "");

  // Notification preferences (NOTIF-003 / FR-064)
  const [emailOnInvite, setEmailOnInvite] = useState(true);
  const [emailOnMessage, setEmailOnMessage] = useState(true);
  const [emailOnAgreement, setEmailOnAgreement] = useState(true);

  // Privacy controls (SET-002 / FR-003, NFR-05)
  const [showProfilePublicly, setShowProfilePublicly] = useState(true);
  const [allowMatchingAI, setAllowMatchingAI] = useState(true);

  const [savedMessage, setSavedMessage] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name: name.trim(),
      email: email.trim(),
      companyName: companyName.trim() || undefined,
    });
    setSavedMessage("Cài đặt tài khoản và quyền riêng tư đã được cập nhật thành công.");
    setTimeout(() => setSavedMessage(""), 4000);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
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
          variant="h4"
          sx={{
            fontWeight: 800,
            fontFamily: "Space Grotesk, sans-serif",
            color: "#1e293b",
          }}
        >
          Cài đặt tài khoản (SET-001)
        </Typography>
        <Typography variant="body2" sx={{ color: "#64748b", mt: 0.5 }}>
          Quản lý thông tin định danh, tùy chọn thông báo và quyền riêng tư dữ liệu (FR-003, NFR-05)
        </Typography>
      </Box>

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
              Thông tin hồ sơ & Định danh
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              fullWidth
              label="Họ và tên hiển thị *"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <TextField
              fullWidth
              label="Email đăng nhập *"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              helperText="Email dùng để nhận thông báo quan trọng và phục hồi mật khẩu."
            />

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
              Quyền riêng tư & Hiển thị hồ sơ (SET-002 / FR-003, NFR-05)
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: "#64748b", display: "block", mb: 2 }}>
            Bảo vệ dữ liệu cá nhân theo tiêu chuẩn NFR-05 và kiểm soát khả năng tìm kiếm
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
              Tùy chọn nhận thông báo qua Email (NOTIF-003 / FR-064)
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

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
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
    </Container>
  );
};

export default AccountSettingsPage;
