import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { useAuthSession } from "@/lib/hooks/useAuthSession";
import {
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

type RoleType = "freelancer" | "client";
const compactDesktop = "@media (min-width:900px) and (max-height:800px)";
const compactWideDesktop = "@media (min-width:1200px) and (max-height:800px)";

type RegisterErrors = {
  companyName?: string;
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
};

export default function RegisterPage() {
  const [role, setRole] = useState<RoleType>("freelancer");

  const [companyName, setCompanyName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [notice, setNotice] = useState("");

  const companyNameRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const { login } = useAuthSession();
  const navigate = useNavigate();

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Đăng ký | FREVO";
    return () => {
      document.title = previousTitle;
    };
  }, []);

  function handleRoleChange(newRole: RoleType) {
    if (newRole === role) return;
    setRole(newRole);
    setErrors({});
    setNotice("");
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: RegisterErrors = {};

    if (role === "client" && !companyName.trim()) {
      nextErrors.companyName = "Vui lòng nhập tên công ty.";
    }

    if (!name.trim()) {
      nextErrors.name =
        role === "client"
          ? "Vui lòng nhập họ và tên người liên hệ."
          : "Vui lòng nhập họ và tên.";
    }

    if (!email.trim()) {
      nextErrors.email =
        role === "client" ? "Vui lòng nhập email liên hệ." : "Vui lòng nhập email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = "Email chưa đúng định dạng.";
    }

    if (!password) {
      nextErrors.password = "Vui lòng nhập mật khẩu.";
    } else if (password.length < 6) {
      nextErrors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = "Vui lòng xác nhận mật khẩu.";
    } else if (confirmPassword !== password) {
      nextErrors.confirmPassword = "Mật khẩu xác nhận không khớp.";
    }

    if (!agreeTerms) {
      nextErrors.terms = "Vui lòng đồng ý với Điều khoản dịch vụ và Chính sách bảo mật.";
    }

    setErrors(nextErrors);
    setNotice("");

    if (nextErrors.companyName) {
      companyNameRef.current?.focus();
    } else if (nextErrors.name) {
      nameRef.current?.focus();
    } else if (nextErrors.email) {
      emailRef.current?.focus();
    } else if (nextErrors.password) {
      passwordRef.current?.focus();
    } else if (nextErrors.confirmPassword) {
      confirmPasswordRef.current?.focus();
    } else {
      login(email.trim(), role).then(() => {
        navigate(role === "client" ? "/business" : "/projects", { replace: true });
      });
    }
  }

  return (
    <Box
      component="main"
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "52% 48%" },
        minHeight: "100dvh",
        height: { md: "100dvh" },
        overflow: { md: "hidden" },
        bgcolor: "#ffffff",
      }}
    >
      {/* Story Column */}
      <Box
        component="section"
        aria-label="Giới thiệu FREVO"
        sx={{
          display: { xs: "none", md: "block" },
          position: "relative",
          height: "100%",
          overflow: "hidden",
          bgcolor: "var(--peach, #fff0e9)",
          p: {
            md: "68px 44px",
            lg: "clamp(68px, 6vw, 90px) clamp(44px, 5.1vw, 86px)",
          },
          [compactDesktop]: { pt: "24px", pb: "20px" },
        }}
      >
        <Box sx={{ position: "relative", zIndex: 2, maxWidth: 660 }}>
          {role === "freelancer" ? (
            <>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { md: "clamp(50px, 5vw, 75px)", lg: "clamp(58px, 5.6vw, 88px)" },
                  lineHeight: 0.99,
                  letterSpacing: "-0.065em",
                  fontWeight: 900,
                  color: "#20201f",
                  "& span": { color: "primary.main" },
                }}
              >
                Khởi đầu mới<br />cùng những<br />dự án hay<span>.</span>
              </Typography>
              <Typography
                sx={{
                  maxWidth: 480,
                  mt: "28px",
                  fontSize: "clamp(20px, 1.6vw, 24px)",
                  lineHeight: 1.4,
                  fontWeight: 500,
                  color: "#20201f",
                }}
              >
                Gia nhập mạng lưới sáng tạo kết nối freelancer và doanh nghiệp hàng đầu.
              </Typography>
            </>
          ) : (
            <>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { md: "clamp(50px, 5vw, 75px)", lg: "clamp(58px, 5.6vw, 88px)" },
                  lineHeight: 0.99,
                  letterSpacing: "-0.065em",
                  fontWeight: 900,
                  color: "#20201f",
                  "& span": { color: "primary.main" },
                }}
              >
                Tìm tài năng<br />cho dự án của bạn<span>.</span>
              </Typography>
              <Typography
                sx={{
                  maxWidth: 480,
                  mt: "28px",
                  fontSize: "clamp(20px, 1.6vw, 24px)",
                  lineHeight: 1.4,
                  fontWeight: 500,
                  color: "#20201f",
                }}
              >
                Kết nối nhanh chóng với các chuyên gia sáng tạo tự do xuất sắc nhất.
              </Typography>
            </>
          )}
        </Box>
        <Box
          component="img"
          src="/assets/register_page.png"
          alt=""
          aria-hidden="true"
          sx={{
            position: "absolute",
            left: "50%",
            bottom: "16px",
            width: "min(580px, 92%)",
            maxHeight: "min(370px, calc(100% - 350px))",
            objectFit: "contain",
            transform: "translateX(-50%)",
          }}
        />
      </Box>

      {/* Form Column */}
      <Box
        component="section"
        aria-labelledby="register-title"
        sx={{
          display: "flex",
          alignItems: "flex-start",
          height: { md: "100%" },
          maxHeight: { md: "100dvh" },
          overflowY: { md: "auto" },
          p: {
            xs: "28px 24px 44px",
            md: "clamp(28px, 3vh, 44px) clamp(36px, 5vw, 84px)",
          },
          [compactDesktop]: { pt: "20px", pb: "16px" },
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        <Box sx={{ width: "min(100%, 540px)", mx: "auto" }}>
          <Box
            component={Link}
            to="/"
            sx={{ display: "inline-block", borderRadius: "6px" }}
            aria-label="FREVO, về trang dự án"
          >
            <Box
              component="img"
              src="/assets/frevo-logo.png"
              alt="FREVO"
              sx={{
                width: { xs: 160, md: "clamp(146px, 14vw, 192px)" },
                height: "auto",
              }}
            />
          </Box>

          <Box sx={{ mt: "16px", [compactDesktop]: { mt: "10px" } }}>
            <Typography
              id="register-title"
              variant="h2"
              sx={{
                fontSize: "clamp(30px, 2.7vw, 42px)",
                lineHeight: 1.05,
                letterSpacing: "-0.055em",
                fontWeight: 900,
                color: "#20201f",
              }}
            >
              Tạo tài khoản mới.
            </Typography>
            <Typography
              sx={{
                mt: "6px",
                color: "#686c69",
                fontSize: 15,
                lineHeight: 1.45,
              }}
            >
              {role === "freelancer"
                ? "Đăng ký để khám phá cơ hội và kết nối với đối tác sáng tạo."
                : "Đăng ký tài khoản để đăng tuyển và tìm kiếm freelancer phù hợp."}
            </Typography>

            {/* Role switchers */}
            <Box sx={{ mt: "16px", [compactDesktop]: { mt: "10px" } }} role="group" aria-labelledby="register-role-label">
              <Typography
                id="register-role-label"
                sx={{
                  display: "block",
                  mb: "6px",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#525752",
                }}
              >
                Vai trò của bạn:
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                }}
              >
                <Button
                  type="button"
                  onClick={() => handleRoleChange("freelancer")}
                  sx={{
                    height: 42,
                    px: "14px",
                    border: "1.5px solid",
                    borderColor: role === "freelancer" ? "#20201f" : "#c8cdca",
                    borderRadius: "999px",
                    bgcolor: role === "freelancer" ? "#20201f" : "#fff",
                    color: role === "freelancer" ? "#fff" : "#525752",
                    fontSize: "13.5px",
                    fontWeight: 700,
                    "&:hover": {
                      borderColor: "#20201f",
                      color: role === "freelancer" ? "#fff" : "#20201f",
                      bgcolor: role === "freelancer" ? "#20201f" : "#f7f8f6",
                    },
                  }}
                >
                  Freelancer tìm việc
                </Button>
                <Button
                  type="button"
                  onClick={() => handleRoleChange("client")}
                  sx={{
                    height: 42,
                    px: "14px",
                    border: "1.5px solid",
                    borderColor: role === "client" ? "#20201f" : "#c8cdca",
                    borderRadius: "999px",
                    bgcolor: role === "client" ? "#20201f" : "#fff",
                    color: role === "client" ? "#fff" : "#525752",
                    fontSize: "13.5px",
                    fontWeight: 700,
                    "&:hover": {
                      borderColor: "#20201f",
                      color: role === "client" ? "#fff" : "#20201f",
                      bgcolor: role === "client" ? "#20201f" : "#f7f8f6",
                    },
                  }}
                >
                  Doanh nghiệp tuyển dụng
                </Button>
              </Box>
            </Box>

            <Box component="form" onSubmit={submit} noValidate sx={{ mt: "18px", [compactDesktop]: { mt: "10px" }, [compactWideDesktop]: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", columnGap: "12px" } }}>
              {role === "client" && (
                <Box sx={{ mb: "14px", [compactDesktop]: { mb: "8px" }, [compactWideDesktop]: { gridColumn: "1 / -1" } }}>
                  <Typography
                    component="label"
                    htmlFor="register-company"
                    sx={{
                      display: "block",
                      mb: "4px",
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#20201f",
                    }}
                  >
                    Tên công ty
                  </Typography>
                  <TextField
                    inputRef={companyNameRef}
                    id="register-company"
                    name="companyName"
                    autoComplete="organization"
                    value={companyName}
                    onChange={(event) => {
                      setCompanyName(event.target.value);
                      setErrors((previous) => ({
                        ...previous,
                        companyName: undefined,
                      }));
                    }}
                    placeholder="Ví dụ: Công ty TNHH Mộc"
                    error={Boolean(errors.companyName)}
                    helperText={errors.companyName}
                    fullWidth
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        height: 46,
                        borderRadius: "9px",
                        bgcolor: "#fff",
                        fontSize: 14.5,
                        "& fieldset": { borderColor: "#c8cdca", borderWidth: 1.5 },
                        "&:hover fieldset": { borderColor: "#8d9690" },
                        "&.Mui-focused fieldset": { borderColor: "primary.main", borderWidth: 2 },
                      },
                    }}
                  />
                </Box>
              )}

              <Box sx={{ mb: "14px", [compactDesktop]: { mb: "8px" } }}>
                <Typography
                  component="label"
                  htmlFor="register-name"
                  sx={{
                    display: "block",
                    mb: "4px",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#20201f",
                  }}
                >
                  {role === "client" ? "Họ và tên người liên hệ" : "Họ và tên"}
                </Typography>
                <TextField
                  inputRef={nameRef}
                  id="register-name"
                  name="name"
                  autoComplete="name"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    setErrors((previous) => ({ ...previous, name: undefined }));
                  }}
                  placeholder="Nguyễn Văn A"
                  error={Boolean(errors.name)}
                  helperText={errors.name}
                  fullWidth
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: 46,
                      borderRadius: "9px",
                      bgcolor: "#fff",
                      fontSize: 14.5,
                      "& fieldset": { borderColor: "#c8cdca", borderWidth: 1.5 },
                      "&:hover fieldset": { borderColor: "#8d9690" },
                      "&.Mui-focused fieldset": { borderColor: "primary.main", borderWidth: 2 },
                    },
                  }}
                />
              </Box>

              <Box sx={{ mb: "14px", [compactDesktop]: { mb: "8px" } }}>
                <Typography
                  component="label"
                  htmlFor="register-email"
                  sx={{
                    display: "block",
                    mb: "4px",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#20201f",
                  }}
                >
                  {role === "client" ? "Email liên hệ" : "Email"}
                </Typography>
                <TextField
                  inputRef={emailRef}
                  id="register-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setErrors((previous) => ({ ...previous, email: undefined }));
                  }}
                  placeholder={role === "client" ? "contact@example.com" : "ban@example.com"}
                  error={Boolean(errors.email)}
                  helperText={errors.email}
                  fullWidth
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: 46,
                      borderRadius: "9px",
                      bgcolor: "#fff",
                      fontSize: 14.5,
                      "& fieldset": { borderColor: "#c8cdca", borderWidth: 1.5 },
                      "&:hover fieldset": { borderColor: "#8d9690" },
                      "&.Mui-focused fieldset": { borderColor: "primary.main", borderWidth: 2 },
                    },
                  }}
                />
              </Box>

              <Box sx={{ mb: "14px", [compactDesktop]: { mb: "8px" } }}>
                <Typography
                  component="label"
                  htmlFor="register-password"
                  sx={{
                    display: "block",
                    mb: "4px",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#20201f",
                  }}
                >
                  Mật khẩu
                </Typography>
                <TextField
                  inputRef={passwordRef}
                  id="register-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setErrors((previous) => ({ ...previous, password: undefined }));
                  }}
                  placeholder="Tối thiểu 6 ký tự"
                  error={Boolean(errors.password)}
                  helperText={errors.password}
                  fullWidth
                  size="small"
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword((value) => !value)}
                            edge="end"
                            size="small"
                            aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                            sx={{ color: "#626965" }}
                          >
                            {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: 46,
                      borderRadius: "9px",
                      bgcolor: "#fff",
                      fontSize: 14.5,
                      "& fieldset": { borderColor: "#c8cdca", borderWidth: 1.5 },
                      "&:hover fieldset": { borderColor: "#8d9690" },
                      "&.Mui-focused fieldset": { borderColor: "primary.main", borderWidth: 2 },
                    },
                  }}
                />
              </Box>

              <Box sx={{ mb: "14px", [compactDesktop]: { mb: "8px" } }}>
                <Typography
                  component="label"
                  htmlFor="register-confirm-password"
                  sx={{
                    display: "block",
                    mb: "4px",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#20201f",
                  }}
                >
                  Xác nhận mật khẩu
                </Typography>
                <TextField
                  inputRef={confirmPasswordRef}
                  id="register-confirm-password"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => {
                    setConfirmPassword(event.target.value);
                    setErrors((previous) => ({
                      ...previous,
                      confirmPassword: undefined,
                    }));
                  }}
                  placeholder="Nhập lại mật khẩu vừa đặt"
                  error={Boolean(errors.confirmPassword)}
                  helperText={errors.confirmPassword}
                  fullWidth
                  size="small"
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowConfirmPassword((value) => !value)}
                            edge="end"
                            size="small"
                            aria-label={showConfirmPassword ? "Ẩn mật khẩu xác nhận" : "Hiện mật khẩu xác nhận"}
                            sx={{ color: "#626965" }}
                          >
                            {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: 46,
                      borderRadius: "9px",
                      bgcolor: "#fff",
                      fontSize: 14.5,
                      "& fieldset": { borderColor: "#c8cdca", borderWidth: 1.5 },
                      "&:hover fieldset": { borderColor: "#8d9690" },
                      "&.Mui-focused fieldset": { borderColor: "primary.main", borderWidth: 2 },
                    },
                  }}
                />
              </Box>

              <Box sx={{ mt: "14px", [compactDesktop]: { mt: "8px" }, [compactWideDesktop]: { gridColumn: "1 / -1" } }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={agreeTerms}
                      onChange={(e) => {
                        setAgreeTerms(e.target.checked);
                        setErrors((previous) => ({ ...previous, terms: undefined }));
                      }}
                      size="small"
                      sx={{
                        color: "#89908b",
                        "&.Mui-checked": { color: "primary.main" },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: 13, color: "#525752" }}>
                      Tôi đồng ý với các{" "}
                      <Typography
                        component="span"
                        sx={{
                          color: "#ba3b14",
                          fontWeight: 700,
                          fontSize: "inherit",
                          textDecoration: "none",
                          "&:hover": { textDecoration: "underline" },
                        }}
                      >
                        Điều khoản dịch vụ
                      </Typography>{" "}
                      và{" "}
                      <Typography
                        component="span"
                        sx={{
                          color: "#ba3b14",
                          fontWeight: 700,
                          fontSize: "inherit",
                          textDecoration: "none",
                          "&:hover": { textDecoration: "underline" },
                        }}
                      >
                        Chính sách bảo mật
                      </Typography>{" "}
                      của FREVO.
                    </Typography>
                  }
                />
                {errors.terms && (
                  <Typography sx={{ color: "#a42117", fontSize: 12.5, fontWeight: 600, mt: 0.5 }}>
                    {errors.terms}
                  </Typography>
                )}
              </Box>

              <Button
                type="submit"
                fullWidth
                sx={{
                  height: 52,
                  mt: "22px",
                  [compactDesktop]: { mt: "12px" },
                  [compactWideDesktop]: { gridColumn: "1 / -1" },
                  border: "2px solid #20201f",
                  borderRadius: "999px",
                  bgcolor: "primary.main",
                  color: "#20201f",
                  fontSize: 17,
                  fontWeight: 900,
                  boxShadow: "4px 5px 0 #20201f",
                  transition: "transform .15s ease, box-shadow .15s ease, background .15s ease",
                  "&:hover": {
                    bgcolor: "#ff5e22",
                    transform: "translate(1px, 1px)",
                    boxShadow: "3px 4px 0 #20201f",
                  },
                  "&:active": {
                    transform: "translate(4px, 5px)",
                    boxShadow: "none",
                  },
                }}
              >
                Tạo tài khoản
              </Button>

              {notice && (
                <Box
                  role="status"
                  sx={{
                    mt: "14px",
                    [compactWideDesktop]: { gridColumn: "1 / -1" },
                    p: "10px 14px",
                    border: "1px solid #f7c3aa",
                    borderRadius: "9px",
                    bgcolor: "#fff4ef",
                    color: "#8c3819",
                    fontSize: 13.5,
                    lineHeight: 1.45,
                  }}
                >
                  {notice}
                </Box>
              )}
            </Box>

            <Typography
              sx={{
                mt: "28px",
                mb: "20px",
                [compactDesktop]: { mt: "12px", mb: "8px" },
                color: "#686c69",
                textAlign: "center",
                fontSize: 14.5,
              }}
            >
              Đã có tài khoản?{" "}
              <Typography
                component={Link}
                to="/login"
                sx={{
                  color: "#ba3b14",
                  fontWeight: 700,
                  textDecoration: "none",
                  "&:hover": {
                    color: "#8f2c10",
                    textDecoration: "underline",
                    textUnderlineOffset: "3px",
                  },
                }}
              >
                Đăng nhập
              </Typography>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
