import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Paper,
  Snackbar,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  ArrowRight,
  Bell,
  Building2,
  Globe,
  KeyRound,
  Laptop,
  Save,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { useBusinessAccount } from "../hooks/useBusinessAccount";

const NOTIF_STORAGE_KEY = "frevo-business-notif-prefs-v1";

export function BusinessSettingsPage() {
  const account = useBusinessAccount();

  const [savedNotifs, setSavedNotifs] = useState(() => {
    const defaults = { onNewApplicant: true, onMessage: true, onDeliverable: true, weeklyDigest: false };
    try {
      const saved = localStorage.getItem(NOTIF_STORAGE_KEY);
      return saved ? ({ ...defaults, ...JSON.parse(saved) } as typeof defaults) : defaults;
    } catch {
      return defaults;
    }
  });
  const [notifs, setNotifs] = useState(savedNotifs);
  const [preferenceError, setPreferenceError] = useState("");
  const preferencesDirty = JSON.stringify(notifs) !== JSON.stringify(savedNotifs);
  const dirty = account.dirty || preferencesDirty;

  // Password change dialog state
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [passwordFields, setPasswordFields] = useState({ current: "", newPass: "", confirm: "" });
  const [passwordFeedback, setPasswordFeedback] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    document.title = "Cài đặt tài khoản Business | FREVO";
  }, []);

  const handleSaveAll = (event: React.FormEvent) => {
    event.preventDefault();
    setPreferenceError("");
    if (account.dirty && !account.save()) return;
    if (!preferencesDirty) return;
    try {
      localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(notifs));
      setSavedNotifs(notifs);
      account.setFeedback("Đã lưu cài đặt tài khoản.");
    } catch {
      setPreferenceError("Không lưu được tùy chọn thông báo. Vui lòng thử lại.");
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordFields.current.trim()) {
      setPasswordError("Vui lòng nhập mật khẩu hiện tại.");
      return;
    }
    if (passwordFields.newPass.length < 6) {
      setPasswordError("Mật khẩu mới cần tối thiểu 6 ký tự.");
      return;
    }
    if (passwordFields.newPass !== passwordFields.confirm) {
      setPasswordError("Xác nhận mật khẩu mới không khớp.");
      return;
    }
    setPasswordError("");
    setPasswordDialogOpen(false);
    setPasswordFields({ current: "", newPass: "", confirm: "" });
    setPasswordFeedback("Đã cập nhật mật khẩu mới thành công.");
  };

  return (
    <Box
      component="main"
      id="business-settings-container"
      sx={{
        maxWidth: 960,
        mx: "auto",
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 2, sm: 3 },
        minWidth: 0,
        "& .MuiButton-root": { textTransform: "none", fontWeight: 700, borderRadius: 999 },
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 3.5 }}>
        <Typography
          component="h1"
          sx={{
            fontSize: { xs: 26, sm: 32 },
            fontWeight: 800,
            lineHeight: 1.2,
            color: "#20201f",
            fontFamily: "Archivo, sans-serif",
          }}
        >
          Cài đặt tài khoản
        </Typography>
        <Typography sx={{ mt: 0.5, fontSize: 14.5, color: "#747773" }}>
          Quản lý thông tin đăng nhập, bảo mật và tùy chọn nhận thông báo của doanh nghiệp.
        </Typography>
      </Box>

      {/* Form Content */}
      <Box component="form" noValidate onSubmit={handleSaveAll} sx={{ display: "grid", gap: 3 }}>
        {(account.failure || preferenceError) && <Alert severity="error">{account.failure || preferenceError}</Alert>}

        {/* 1. Account Identity & Credentials */}
        <Paper
          variant="outlined"
          sx={{
            borderRadius: "16px",
            borderColor: "#d0d5dd",
            bgcolor: "background.paper",
            overflow: "hidden",
          }}
        >
          <Box sx={{ px: { xs: 2.5, sm: 3.5 }, py: 2, bgcolor: "#fafaf8", borderBottom: "1px solid #eef0eb" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#fff4ee] text-[#bd3d14] border border-[#ffdecb]">
                <UserCheck size={16} strokeWidth={2.2} />
              </div>
              <div>
                <Typography component="h2" sx={{ fontSize: 17, fontWeight: 800, color: "#20201f" }}>
                  Thông tin đăng nhập &amp; Người quản trị
                </Typography>
                <Typography sx={{ fontSize: 12.5, color: "#747773" }}>
                  Tài khoản định danh chính dùng để quản trị và nhận các thông báo pháp lý.
                </Typography>
              </div>
            </Box>
          </Box>

          <Box sx={{ p: { xs: 2.5, sm: 3.5 }, display: "grid", gap: 2.5, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" } }}>
            <TextField
              id="business-account-email"
              fullWidth
              required
              type="email"
              label="Email đăng nhập (Chính)"
              value={account.fields.email}
              onChange={(event) => account.setField("email", event.target.value)}
              error={Boolean(account.errors.email)}
              helperText={account.errors.email || "Email đăng nhập chính thức vào hệ thống FREVO"}
              sx={{ gridColumn: { xs: "1 / -1", sm: "1 / -1" } }}
            />
            <TextField
              id="business-account-name"
              fullWidth
              required
              label="Họ và tên người đại diện"
              value={account.fields.name}
              onChange={(event) => account.setField("name", event.target.value)}
              error={Boolean(account.errors.name)}
              helperText={account.errors.name}
            />
            <TextField
              id="business-account-phone"
              fullWidth
              label="Số điện thoại bảo mật"
              value={account.fields.phone}
              onChange={(event) => account.setField("phone", event.target.value)}
              error={Boolean(account.errors.phone)}
              helperText={account.errors.phone || "Dùng để nhận mã xác thực và liên hệ khẩn cấp"}
            />
          </Box>
        </Paper>

        {/* 2. Security & Password */}
        <Paper
          variant="outlined"
          sx={{
            borderRadius: "16px",
            borderColor: "#d0d5dd",
            bgcolor: "background.paper",
            overflow: "hidden",
          }}
        >
          <Box sx={{ px: { xs: 2.5, sm: 3.5 }, py: 2, bgcolor: "#fafaf8", borderBottom: "1px solid #eef0eb" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#fff4ee] text-[#bd3d14] border border-[#ffdecb]">
                <ShieldCheck size={16} strokeWidth={2.2} />
              </div>
              <div>
                <Typography component="h2" sx={{ fontSize: 17, fontWeight: 800, color: "#20201f" }}>
                  Bảo mật &amp; Phiên đăng nhập
                </Typography>
                <Typography sx={{ fontSize: 12.5, color: "#747773" }}>
                  Quản lý mật khẩu và các thiết bị đang đăng nhập tài khoản.
                </Typography>
              </div>
            </Box>
          </Box>

          <Box sx={{ p: { xs: 2.5, sm: 3.5 }, display: "grid", gap: 2.5 }}>
            <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
              <Box>
                <Typography sx={{ fontSize: 14.5, fontWeight: 700, color: "#20201f" }}>
                  Mật khẩu tài khoản
                </Typography>
                <Typography sx={{ fontSize: 13, color: "#747773", mt: 0.25 }}>
                  Mật khẩu được mã hóa an toàn. Lần đổi gần nhất: 17/10/2026.
                </Typography>
              </Box>
              <Button
                variant="outlined"
                startIcon={<KeyRound size={15} />}
                onClick={() => setPasswordDialogOpen(true)}
                sx={{
                  borderRadius: "999px",
                  minHeight: 38,
                  px: 2.5,
                  fontSize: 13,
                  borderColor: "#d0d5dd",
                  color: "#20201f",
                  "&:hover": { borderColor: "primary.main", bgcolor: "#fff5f0" },
                }}
              >
                Đổi mật khẩu
              </Button>
            </Box>

            <Divider />

            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Laptop size={18} className="text-[#62665f]" />
                <div>
                  <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#20201f" }}>
                    Phiên làm việc hiện tại
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: "#747773" }}>
                    Windows · Chrome · TP. Hồ Chí Minh · Đang hoạt động
                  </Typography>
                </div>
              </Box>
              <Chip label="Thiết bị này" size="small" sx={{ bgcolor: "#e8f7ef", color: "#16805b", fontWeight: 700, fontSize: 11 }} />
            </Box>
          </Box>
        </Paper>

        {/* 3. Notification Preferences */}
        <Paper
          variant="outlined"
          sx={{
            borderRadius: "16px",
            borderColor: "#d0d5dd",
            bgcolor: "background.paper",
            overflow: "hidden",
          }}
        >
          <Box sx={{ px: { xs: 2.5, sm: 3.5 }, py: 2, bgcolor: "#fafaf8", borderBottom: "1px solid #eef0eb" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#fff4ee] text-[#bd3d14] border border-[#ffdecb]">
                <Bell size={16} strokeWidth={2.2} />
              </div>
              <div>
                <Typography component="h2" sx={{ fontSize: 17, fontWeight: 800, color: "#20201f" }}>
                  Cài đặt thông báo (Email &amp; In-app)
                </Typography>
                <Typography sx={{ fontSize: 12.5, color: "#747773" }}>
                  Chọn những sự kiện bạn muốn nhận cảnh báo tức thời khi vận hành dự án.
                </Typography>
              </div>
            </Box>
          </Box>

          <Box sx={{ p: { xs: 2.5, sm: 3.5 }, display: "grid", gap: 2 }}>
            {[
              {
                key: "onNewApplicant" as const,
                title: "Thông báo hồ sơ ứng tuyển mới",
                desc: "Nhận thông báo ngay khi có freelancer hoặc nhóm gửi hồ sơ vào brief dự án của bạn.",
              },
              {
                key: "onMessage" as const,
                title: "Thông báo tin nhắn trao đổi",
                desc: "Gửi thông báo khi đối tác sáng tạo nhắn tin trong phòng chat tuyển dụng.",
              },
              {
                key: "onDeliverable" as const,
                title: "Thông báo nộp sản phẩm bàn giao mốc",
                desc: "Nhắc nhở bạn kiểm tra và nghiệm thu tệp kết quả mốc tiến độ trên workspace.",
              },
              {
                key: "weeklyDigest" as const,
                title: "Bản tin tổng hợp tiến độ hàng tuần",
                desc: "Nhận email tóm tắt các công việc cần duyệt và mốc hạn sắp tới vào sáng thứ Hai.",
              },
            ].map(({ key, title, desc }) => (
              <FormControlLabel
                key={key}
                control={
                  <Checkbox
                    checked={notifs[key]}
                    onChange={(e) => setNotifs({ ...notifs, [key]: e.target.checked })}
                    sx={{ color: "#d0d5dd", "&.Mui-checked": { color: "#f4490b" } }}
                  />
                }
                label={
                  <Box>
                    <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#20201f" }}>{title}</Typography>
                    <Typography sx={{ fontSize: 12.5, color: "#747773" }}>{desc}</Typography>
                  </Box>
                }
                sx={{ alignItems: "flex-start", ml: -0.5 }}
              />
            ))}
          </Box>
        </Paper>

        {/* 4. System & Region Preferences */}
        <Paper
          variant="outlined"
          sx={{
            borderRadius: "16px",
            borderColor: "#d0d5dd",
            bgcolor: "background.paper",
            overflow: "hidden",
          }}
        >
          <Box sx={{ px: { xs: 2.5, sm: 3.5 }, py: 2, bgcolor: "#fafaf8", borderBottom: "1px solid #eef0eb" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#fff4ee] text-[#bd3d14] border border-[#ffdecb]">
                <Globe size={16} strokeWidth={2.2} />
              </div>
              <div>
                <Typography component="h2" sx={{ fontSize: 17, fontWeight: 800, color: "#20201f" }}>
                  Tùy chọn vùng &amp; Hiển thị
                </Typography>
                <Typography sx={{ fontSize: 12.5, color: "#747773" }}>
                  Định dạng múi giờ và ngôn ngữ làm việc mặc định trên FREVO.
                </Typography>
              </div>
            </Box>
          </Box>

          <Box sx={{ p: { xs: 2.5, sm: 3.5 }, display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" } }}>
            <Box>
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#747773", textTransform: "uppercase" }}>
                Ngôn ngữ giao diện
              </Typography>
              <Typography sx={{ fontSize: 14.5, fontWeight: 700, color: "#20201f", mt: 0.5 }}>
                Tiếng Việt (Mặc định)
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#747773", textTransform: "uppercase" }}>
                Múi giờ hệ thống
              </Typography>
              <Typography sx={{ fontSize: 14.5, fontWeight: 700, color: "#20201f", mt: 0.5 }}>
                (GMT+07:00) Bangkok, Hanoi, Jakarta
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* 5. Direct Link to Public Business Profile */}
        <Paper
          variant="outlined"
          sx={{
            p: 2.5,
            borderRadius: "16px",
            borderColor: "#d0d5dd",
            bgcolor: "#fafaf8",
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Building2 size={22} className="text-[#bd3d14] shrink-0" />
            <Box>
              <Typography sx={{ fontSize: 14.5, fontWeight: 700, color: "#20201f" }}>
                Cập nhật thông tin công khai doanh nghiệp?
              </Typography>
              <Typography sx={{ fontSize: 12.5, color: "#747773" }}>
                Tên công ty, logo, giới thiệu thương hiệu và thông tin liên hệ tuyển dụng được quản lý tại trang Hồ sơ.
              </Typography>
            </Box>
          </Box>
          <Button
            component={Link}
            to="/business/profile"
            variant="outlined"
            endIcon={<ArrowRight size={15} />}
            sx={{
              borderColor: "#d0d5dd",
              color: "#20201f",
              whiteSpace: "nowrap",
              "&:hover": { borderColor: "primary.main", bgcolor: "#ffffff" },
            }}
          >
            Đến trang Hồ sơ
          </Button>
        </Paper>

        {/* 6. Sticky/Bottom Save Bar */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            p: 2.5,
            borderRadius: "16px",
            bgcolor: "background.paper",
            border: "1px solid #d0d5dd",
            boxShadow: "0 1px 3px rgba(16, 24, 40, 0.05)",
          }}
        >
          <Typography role="status" sx={{ fontSize: 14, fontWeight: 600, color: dirty ? "#bd3d14" : "text.secondary" }}>
            {dirty ? "● Bạn có thay đổi chưa lưu trên form." : "✓ Thông tin cài đặt tài khoản đã đồng bộ."}
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
            <Button
              variant="outlined"
              onClick={() => {
                account.reset();
                setNotifs(savedNotifs);
                setPreferenceError("");
              }}
              sx={{
                borderRadius: "999px",
                minHeight: 40,
                px: 2.5,
                fontSize: 13.5,
                borderColor: "#d0d5dd",
                color: "#20201f",
                "&:hover": { bgcolor: "#f8fafc" },
              }}
            >
              Hủy thay đổi
            </Button>

            <Tooltip title={dirty ? "" : "Chưa có thay đổi để lưu"}>
              <span>
                <Button
                  type="submit"
                  disabled={!dirty}
                  variant="contained"
                  startIcon={<Save size={16} />}
                  sx={{
                    borderRadius: "999px",
                    minHeight: 40,
                    px: 3,
                    fontSize: 13.5,
                    bgcolor: "#f4490b !important",
                    color: "#ffffff !important",
                    boxShadow: "0 2px 8px rgba(244,73,11,0.25)",
                    "&:hover": { bgcolor: "#bd3d14 !important" },
                  }}
                >
                  Lưu cài đặt
                </Button>
              </span>
            </Tooltip>
          </Box>
        </Box>
      </Box>

      {/* Password Change Dialog */}
      <Dialog
        open={passwordDialogOpen}
        onClose={() => setPasswordDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        aria-labelledby="change-password-title"
      >
        <Box component="form" onSubmit={handlePasswordSubmit}>
          <DialogTitle id="change-password-title" sx={{ fontWeight: 800, fontFamily: "Archivo, Arial, sans-serif" }}>
            Đổi mật khẩu tài khoản
          </DialogTitle>
          <DialogContent sx={{ display: "grid", gap: 2, pt: 1 }}>
            {passwordError && <Alert severity="error">{passwordError}</Alert>}
            <TextField
              fullWidth
              type="password"
              label="Mật khẩu hiện tại"
              required
              value={passwordFields.current}
              onChange={(e) => setPasswordFields({ ...passwordFields, current: e.target.value })}
            />
            <TextField
              fullWidth
              type="password"
              label="Mật khẩu mới (tối thiểu 6 ký tự)"
              required
              value={passwordFields.newPass}
              onChange={(e) => setPasswordFields({ ...passwordFields, newPass: e.target.value })}
            />
            <TextField
              fullWidth
              type="password"
              label="Xác nhận mật khẩu mới"
              required
              value={passwordFields.confirm}
              onChange={(e) => setPasswordFields({ ...passwordFields, confirm: e.target.value })}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
            <Button onClick={() => setPasswordDialogOpen(false)}>Hủy</Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                borderRadius: "999px",
                bgcolor: "#f4490b !important",
                color: "#fff !important",
                fontWeight: 700,
                "&:hover": { bgcolor: "#bd3d14 !important" },
              }}
            >
              Cập nhật mật khẩu
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Snackbars */}
      <Snackbar
        open={Boolean(account.feedback)}
        autoHideDuration={4000}
        onClose={() => account.setFeedback("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => account.setFeedback("")}>
          {account.feedback}
        </Alert>
      </Snackbar>

      <Snackbar
        open={Boolean(passwordFeedback)}
        autoHideDuration={4000}
        onClose={() => setPasswordFeedback("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setPasswordFeedback("")}>
          {passwordFeedback}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default BusinessSettingsPage;
