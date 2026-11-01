import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  Paper,
  Snackbar,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { ArrowUpRight, KeyRound, Save, ShieldCheck } from "lucide-react";
import { BusinessAccountDetail, BusinessAccountLayout, BusinessAccountSection } from "../components/BusinessAccountLayout";
import { accountPanelSx } from "../components/businessAccountStyles";
import { useBusinessAccount } from "../hooks/useBusinessAccount";
import type { BusinessAccountFields } from "@/lib/utils/businessAccount";

const industries = [
  "Thiết kế & Sáng tạo thương hiệu",
  "Truyền thông & Marketing số",
  "Nhiếp ảnh & Sản xuất Video",
  "Công nghệ & Phần mềm",
  "Thương mại điện tử & Bán lẻ",
  "F&B & Khách sạn - Dịch vụ",
  "Khác",
];

const NOTIF_STORAGE_KEY = "frevo-business-notif-prefs-v1";
const EXTRA_PROFILE_KEY = "frevo-business-extra-profile-v1";

export function BusinessSettingsPage() {
  const account = useBusinessAccount();

  // Local companion states for extra settings
  const [industry, setIndustry] = useState(() => {
    try {
      const saved = localStorage.getItem(EXTRA_PROFILE_KEY);
      if (saved) return JSON.parse(saved).industry || industries[0];
    } catch { /* ignore */ }
    return industries[0];
  });

  const [bio, setBio] = useState(() => {
    try {
      const saved = localStorage.getItem(EXTRA_PROFILE_KEY);
      if (saved) return JSON.parse(saved).bio || "";
    } catch { /* ignore */ }
    return "Nắng Studio là đơn vị sáng tạo chuyên sản xuất nội dung số, định vị hình ảnh thương hiệu và thiết kế bao bì cho các thương hiệu vừa và nhỏ (SME) tại Việt Nam.";
  });

  // Notification preferences
  const [notifs, setNotifs] = useState({
    onNewApplicant: true,
    onMessage: true,
    onDeliverable: true,
    weeklyDigest: false,
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(NOTIF_STORAGE_KEY);
      if (saved) setNotifs(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

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
    account.save();
    try {
      localStorage.setItem(EXTRA_PROFILE_KEY, JSON.stringify({ industry, bio }));
      localStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(notifs));
    } catch { /* ignore */ }
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
    setPasswordFeedback("Đã cập nhật mật khẩu mới thành công (Mô phỏng demo).");
  };

  const input = (
    field: keyof BusinessAccountFields,
    label: string,
    options: {
      required?: boolean;
      type?: string;
      maxLength?: number;
      autoComplete?: string;
      helperText?: string;
      multiline?: boolean;
      readOnly?: boolean;
    } = {}
  ) => (
    <TextField
      id={`business-account-${field}`}
      fullWidth
      label={label}
      value={account.fields[field]}
      onChange={(event) => account.setField(field, event.target.value)}
      required={options.required}
      type={options.type}
      autoComplete={options.autoComplete}
      multiline={options.multiline}
      minRows={options.multiline ? 3 : undefined}
      error={Boolean(account.errors[field])}
      helperText={account.errors[field] || options.helperText}
      disabled={options.readOnly}
      slotProps={{
        htmlInput: { maxLength: options.maxLength },
        formHelperText: { sx: { mx: 0, lineHeight: 1.5, fontSize: 12 } },
      }}
    />
  );

  return (
    <BusinessAccountLayout page="settings">
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "minmax(0, 1fr)", lg: "minmax(0, 1.85fr) minmax(310px, 1fr)" },
          alignItems: "start",
          gap: 3.5,
        }}
      >
        {/* Main Form Column */}
        <Box component="form" noValidate onSubmit={handleSaveAll} sx={{ display: "grid", gap: 3.5, minWidth: 0 }}>
          {account.failure && (
            <Alert severity="error" action={<Button color="inherit" size="small" onClick={account.save}>Thử lại</Button>}>
              {account.failure}
            </Alert>
          )}

          {/* Section 1: Thông tin doanh nghiệp */}
          <BusinessAccountSection
            id="business-account-identity"
            title="Thông tin doanh nghiệp"
            description="Tên đơn vị, lĩnh vực và thông tin người đại diện xuất hiện trong không gian làm việc."
          >
            <Box sx={{ display: "grid", gap: 2.5 }}>
              {input("companyName", "Tên doanh nghiệp / Đơn vị tuyển dụng", {
                required: true,
                maxLength: 80,
                autoComplete: "organization",
                helperText: "Tên thương hiệu hoặc pháp nhân tuyển dụng trên FREVO.",
              })}

              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2.5 }}>
                {input("name", "Họ và tên người đại diện", {
                  required: true,
                  maxLength: 100,
                  autoComplete: "name",
                })}

                <TextField
                  select
                  fullWidth
                  label="Lĩnh vực hoạt động chính"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                >
                  {industries.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>


              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Giới thiệu ngắn về doanh nghiệp (Bio)"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Giới thiệu về phong cách làm việc, văn hóa và tiêu chuẩn dự án..."
                helperText="Giúp cộng sự và freelancer hiểu rõ hơn về văn hóa và tiêu chuẩn của bạn."
              />
            </Box>
          </BusinessAccountSection>

          {/* Section 2: Thông tin liên hệ */}
          <BusinessAccountSection
            id="business-account-contact"
            title="Thông tin liên hệ &amp; Nhận thông báo"
            description="Thông tin dùng để gửi thông báo thỏa thuận và liên hệ trực tiếp khi cần."
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "repeat(2, minmax(0, 1fr))" },
                gap: 2.5,
              }}
            >
              <Box sx={{ gridColumn: "1 / -1" }}>
                {input("email", "Email đăng nhập tài khoản", {
                  required: true,
                  type: "email",
                  autoComplete: "email",
                  helperText: "Email tài khoản chính trong phiên làm việc prototype.",
                })}
              </Box>

              {input("contactEmail", "Email liên hệ nhận hồ sơ", {
                type: "email",
                helperText: "Có thể khác email đăng nhập (ví dụ: hr@nangstudio.vn).",
              })}

              {input("phone", "Số điện thoại liên hệ", {
                type: "tel",
                autoComplete: "tel",
                helperText: "Dùng để liên hệ trao đổi công việc nhanh.",
              })}

              <Box sx={{ gridColumn: "1 / -1" }}>
                {input("address", "Địa chỉ văn phòng / Trụ sở", {
                  autoComplete: "street-address",
                  multiline: true,
                  helperText: "Địa chỉ hiển thị trên thỏa thuận hợp tác dự án.",
                })}
              </Box>
            </Box>
          </BusinessAccountSection>

          {/* Section 3: Tùy chọn thông báo */}
          <BusinessAccountSection
            id="business-account-notifications"
            title="Cài đặt thông báo (Email &amp; In-app)"
            description="Chọn những sự kiện bạn muốn nhận thông báo khi làm việc cùng cộng sự."
          >
            <Box sx={{ display: "grid", gap: 1.5 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={notifs.onNewApplicant}
                    onChange={(e) => setNotifs({ ...notifs, onNewApplicant: e.target.checked })}
                  />
                }
                label={
                  <Box>
                    <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Thông báo hồ sơ ứng tuyển mới</Typography>
                    <Typography sx={{ fontSize: 12, color: "text.secondary" }}>Nhận thông báo ngay khi có freelancer hoặc nhóm nộp hồ sơ vào brief của bạn.</Typography>
                  </Box>
                }
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={notifs.onMessage}
                    onChange={(e) => setNotifs({ ...notifs, onMessage: e.target.checked })}
                  />
                }
                label={
                  <Box>
                    <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Thông báo tin nhắn trao đổi</Typography>
                    <Typography sx={{ fontSize: 12, color: "text.secondary" }}>Gửi cảnh báo khi đối tác gửi tin nhắn trong phòng chat dự án.</Typography>
                  </Box>
                }
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={notifs.onDeliverable}
                    onChange={(e) => setNotifs({ ...notifs, onDeliverable: e.target.checked })}
                  />
                }
                label={
                  <Box>
                    <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Thông báo nộp sản phẩm bàn giao mốc</Typography>
                    <Typography sx={{ fontSize: 12, color: "text.secondary" }}>Nhắc nhở bạn vào duyệt và nghiệm thu sản phẩm của mốc tiến độ.</Typography>
                  </Box>
                }
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={notifs.weeklyDigest}
                    onChange={(e) => setNotifs({ ...notifs, weeklyDigest: e.target.checked })}
                  />
                }
                label={
                  <Box>
                    <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Bản tin tóm tắt dự án hàng tuần</Typography>
                    <Typography sx={{ fontSize: 12, color: "text.secondary" }}>Nhận email tổng hợp tiến độ và các hạn nộp sắp tới vào sáng thứ Hai.</Typography>
                  </Box>
                }
              />
            </Box>
          </BusinessAccountSection>

          {/* Section 4: Bảo mật & Mật khẩu */}
          <BusinessAccountSection
            id="business-account-security"
            title="Bảo mật tài khoản"
            description="Quản lý mật khẩu và các tùy chọn bảo mật phiên đăng nhập của doanh nghiệp."
          >
            <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
              <Box>
                <Typography sx={{ fontSize: 14, fontWeight: 700 }}>Mật khẩu đăng nhập</Typography>
                <Typography sx={{ mt: 0.5, fontSize: 13, color: "text.secondary" }}>
                  Mật khẩu được bảo vệ và mã hóa. Lần đổi gần nhất: 17/10/2026.
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
                  fontWeight: 700,
                  borderColor: "#d0d5dd",
                  color: "text.primary",
                  "&:hover": { borderColor: "primary.main", bgcolor: "#fff0e9" },
                }}
              >
                Đổi mật khẩu
              </Button>
            </Box>
          </BusinessAccountSection>

          {/* Action Bar */}
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
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "0 1px 3px rgba(16, 24, 40, 0.05)",
            }}
          >
            <Typography role="status" sx={{ fontSize: 14, fontWeight: 600, color: account.dirty ? "#bd3d14" : "text.secondary" }}>
              {account.dirty ? "● Bạn có thay đổi chưa lưu trên form." : "✓ Thông tin tài khoản đã đồng bộ."}
            </Typography>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
              <Button
                variant="outlined"
                onClick={account.reset}
                sx={{
                  borderRadius: "999px",
                  minHeight: 40,
                  px: 2.5,
                  fontSize: 13.5,
                  fontWeight: 700,
                  borderColor: "#d0d5dd",
                  color: "text.primary",
                  "&:hover": { bgcolor: "#f8fafc" },
                }}
              >
                Hủy thay đổi
              </Button>

              <Tooltip title={account.dirty ? "" : "Chưa có thay đổi để lưu"}>
                <span>
                  <Button
                    type="submit"
                    disabled={!account.dirty}
                    variant="contained"
                    startIcon={<Save size={16} />}
                    sx={{
                      borderRadius: "999px",
                      minHeight: 40,
                      px: 3,
                      fontSize: 13.5,
                      fontWeight: 700,
                      bgcolor: "primary.dark",
                      color: "#ffffff !important",
                      "& *": { color: "#ffffff !important" },
                      boxShadow: "0 1px 3px rgba(189, 61, 20, 0.25)",
                      "&:hover": { bgcolor: "primary.main" },
                    }}
                  >
                    Lưu thay đổi
                  </Button>
                </span>
              </Tooltip>
            </Box>
          </Box>
        </Box>

        {/* Aside Sidebar Column */}
        <Box
          component="aside"
          aria-label="Tóm tắt thông tin tài khoản"
          sx={{
            position: { lg: "sticky" },
            top: 90,
            display: "grid",
            gap: 3,
          }}
        >
          {/* Summary Card */}
          <BusinessAccountSection
            id="business-account-summary"
            title="Xem trước hồ sơ"
            description="Thông tin hiển thị khi bạn lưu các thay đổi."
          >
            <Box component="dl" sx={{ display: "grid", gap: 2.25, m: 0 }}>
              <BusinessAccountDetail label="Tên doanh nghiệp" value={account.fields.companyName || account.user.companyName} />
              <BusinessAccountDetail label="Người đại diện" value={account.fields.name || account.user.name} />
              <BusinessAccountDetail label="Lĩnh vực" value={industry} />
              <BusinessAccountDetail label="Email liên hệ" value={account.fields.contactEmail || account.fields.email} />
            </Box>

            <Button
              component={Link}
              to="/business/profile"
              variant="outlined"
              fullWidth
              endIcon={<ArrowUpRight size={16} />}
              sx={{
                mt: 3,
                borderRadius: "999px",
                minHeight: 40,
                fontSize: 13,
                fontWeight: 700,
                color: "text.primary",
                borderColor: "#d0d5dd",
                "&:hover": { borderColor: "primary.main", bgcolor: "#fff0e9" },
              }}
            >
              Xem trang hồ sơ công khai
            </Button>
          </BusinessAccountSection>

          {/* Tips Card */}
          <Paper elevation={0} sx={{ ...accountPanelSx, p: 2.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <ShieldCheck size={18} className="text-[#15803d]" aria-hidden="true" />
              <Typography sx={{ fontSize: 14, fontWeight: 700 }}>Mẹo cho doanh nghiệp</Typography>
            </Box>
            <Typography sx={{ fontSize: 13, lineHeight: 1.6, color: "text.secondary" }}>
              Cung cấp đầy đủ email liên hệ và số điện thoại giúp tăng 35% tốc độ phản hồi từ các nhóm sáng tạo và freelancer chất lượng cao.
            </Typography>
          </Paper>
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
                bgcolor: "primary.dark",
                color: "#fff !important",
                fontWeight: 700,
                "&:hover": { bgcolor: "primary.main" },
              }}
            >
              Cập nhật mật khẩu
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Feedback Snackbars */}
      <Snackbar
        open={Boolean(account.feedback)}
        autoHideDuration={4500}
        onClose={() => account.setFeedback("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => account.setFeedback("")}>
          {account.feedback}
        </Alert>
      </Snackbar>

      <Snackbar
        open={Boolean(passwordFeedback)}
        autoHideDuration={4500}
        onClose={() => setPasswordFeedback("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setPasswordFeedback("")}>
          {passwordFeedback}
        </Alert>
      </Snackbar>
    </BusinessAccountLayout>
  );
}
