import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { useAuthSession } from "@/lib/hooks/useAuthSession";
import type { UserRole } from "@/lib/types/marketplace.types";
import {
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  IconButton,
  InputAdornment,
  Chip,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  BusinessOutlined,
  PersonOutlined,
  GroupsOutlined,
  AdminPanelSettingsOutlined,
} from "@mui/icons-material";

type LoginErrors = { email?: string; password?: string };
const compactDesktop = "@media (min-width:900px) and (max-height:800px)";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [notice, setNotice] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const { login } = useAuthSession();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Đăng nhập | FREVO";
    return () => {
      document.title = previousTitle;
    };
  }, []);

  async function performLogin(targetEmail: string, targetRole?: UserRole) {
    const isClient =
      targetRole === "client" ||
      (!targetRole &&
        (targetEmail.includes("client") ||
          targetEmail.includes("nang") ||
          targetEmail.includes("business")));
    const isAdmin =
      targetRole === "admin" ||
      (!targetRole && targetEmail.includes("admin"));
    const resolvedRole: UserRole = isAdmin ? "admin" : isClient ? "client" : "freelancer";

    await login(targetEmail, resolvedRole);

    const from = (location.state as { from?: { pathname: string } })?.from?.pathname;

    let canRedirectToFrom = false;
    if (from && from !== "/login" && from !== "/forbidden") {
      if (from.startsWith("/business")) {
        canRedirectToFrom = isClient || isAdmin;
      } else if (from.startsWith("/admin")) {
        canRedirectToFrom = isAdmin;
      } else if (from.startsWith("/freelancer")) {
        canRedirectToFrom = resolvedRole === "freelancer";
      } else {
        canRedirectToFrom = true;
      }
    }

    if (canRedirectToFrom && from) {
      navigate(from, { replace: true });
    } else {
      if (isAdmin) {
        navigate("/admin", { replace: true });
      } else if (isClient) {
        navigate("/business", { replace: true });
      } else {
        navigate("/projects", { replace: true });
      }
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: LoginErrors = {};
    if (!email.trim()) nextErrors.email = "Vui lòng nhập email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      nextErrors.email = "Email chưa đúng định dạng.";
    if (!password) nextErrors.password = "Vui lòng nhập mật khẩu.";
    else if (password.length < 6) nextErrors.password = "Mật khẩu phải có ít nhất 6 ký tự.";

    setErrors(nextErrors);
    setNotice("");
    if (nextErrors.email) emailRef.current?.focus();
    else if (nextErrors.password) passwordRef.current?.focus();
    else if (password === "wrong" || password === "sai" || password === "wrongpassword") {
      setNotice("Tài khoản hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại thông tin đăng nhập.");
    } else {
      performLogin(email.trim());
    }
  }

  return (
    <Box
      component="main"
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "52% 48%" },
        minHeight: "100dvh",
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
          overflow: "hidden",
          bgcolor: "var(--peach, #fff0e9)",
          p: {
            xs: "68px 44px",
            lg: "clamp(68px, 6vw, 90px) clamp(44px, 5.1vw, 86px)",
          },
          [compactDesktop]: { pt: "24px", pb: "20px" },
        }}
      >
        <Box sx={{ position: "relative", zIndex: 2, maxWidth: 660 }}>
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
            Ý tưởng hay
            <br />
            cần đúng cơ hội<span>.</span>
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
            Bắt đầu hành trình sáng tạo cùng FREVO.
          </Typography>
        </Box>
        <Box
          component="img"
          className="login-art"
          src="/assets/frevo-login-illustration.png"
          alt=""
          aria-hidden="true"
          sx={{
            position: "absolute",
            left: "50%",
            bottom: "18px",
            width: "min(680px, 96%)",
            maxHeight: "calc(100% - 390px)",
            objectFit: "contain",
            transform: "translateX(-50%)",
          }}
        />
      </Box>

      {/* Form Column */}
      <Box
        component="section"
        aria-labelledby="login-title"
        sx={{
          display: "flex",
          alignItems: "flex-start",
          p: {
            xs: "38px 24px 48px",
            sm: "48px 40px",
            md: "clamp(52px, 5vw, 76px) clamp(42px, 6vw, 104px)",
          },
          [compactDesktop]: { pt: "24px", pb: "20px" },
        }}
      >
        <Box sx={{ width: "min(100%, 560px)", mx: "auto" }}>
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
                width: { xs: 190, md: "clamp(178px, 17vw, 244px)" },
                height: "auto",
                [compactDesktop]: { width: 178 },
              }}
            />
          </Box>

          <Box sx={{ mt: "clamp(22px, 2vw, 30px)", [compactDesktop]: { mt: "18px" } }}>
            <Typography
              id="login-title"
              variant="h2"
              sx={{
                fontSize: {
                  xs: "clamp(36px, 8vw, 48px)",
                  md: "clamp(38px, 3.4vw, 53px)",
                },
                lineHeight: 1.05,
                letterSpacing: "-0.055em",
                fontWeight: 900,
                color: "#20201f",
              }}
            >
              Chào mừng trở lại.
            </Typography>
            <Typography
              sx={{
                mt: "14px",
                [compactDesktop]: { mt: "10px" },
                color: "#686c69",
                fontSize: 18,
                lineHeight: 1.5,
              }}
            >
              Nơi doanh nghiệp và freelancer kết nối để hợp tác.
            </Typography>

            <Box
              component="form"
              onSubmit={submit}
              noValidate
              sx={{ mt: "38px", [compactDesktop]: { mt: "22px" } }}
            >
              <Box sx={{ mb: "23px", [compactDesktop]: { mb: "16px" } }}>
                <Typography
                  component="label"
                  htmlFor="login-email"
                  sx={{
                    display: "block",
                    mb: "10px",
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#20201f",
                  }}
                >
                  Email
                </Typography>
                <TextField
                  inputRef={emailRef}
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setErrors((previous) => ({ ...previous, email: undefined }));
                  }}
                  placeholder="ban@example.com"
                  error={Boolean(errors.email)}
                  helperText={errors.email}
                  fullWidth
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: 58,
                      borderRadius: "11px",
                      bgcolor: "#fff",
                      fontSize: 16,
                      "& fieldset": { borderColor: "#c8cdca", borderWidth: 1.5 },
                      "&:hover fieldset": { borderColor: "#8d9690" },
                      "&.Mui-focused fieldset": {
                        borderColor: "primary.main",
                        borderWidth: 2,
                      },
                    },
                  }}
                />
              </Box>

              <Box sx={{ mb: "23px", [compactDesktop]: { mb: "16px" } }}>
                <Typography
                  component="label"
                  htmlFor="login-password"
                  sx={{
                    display: "block",
                    mb: "10px",
                    fontSize: 16,
                    fontWeight: 700,
                    color: "#20201f",
                  }}
                >
                  Mật khẩu
                </Typography>
                <TextField
                  inputRef={passwordRef}
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setErrors((previous) => ({
                      ...previous,
                      password: undefined,
                    }));
                  }}
                  placeholder="Nhập mật khẩu"
                  error={Boolean(errors.password)}
                  helperText={errors.password}
                  fullWidth
                  variant="outlined"
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword((value) => !value)}
                            edge="end"
                            aria-label={
                              showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                            }
                            sx={{ color: "#626965" }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: 58,
                      borderRadius: "11px",
                      bgcolor: "#fff",
                      fontSize: 16,
                      "& fieldset": { borderColor: "#c8cdca", borderWidth: 1.5 },
                      "&:hover fieldset": { borderColor: "#8d9690" },
                      "&.Mui-focused fieldset": {
                        borderColor: "primary.main",
                        borderWidth: 2,
                      },
                    },
                  }}
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                  mt: "21px",
                  [compactDesktop]: { mt: "12px" },
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      size="small"
                      sx={{
                        color: "#89908b",
                        "&.Mui-checked": { color: "primary.main" },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: 14, color: "#525752" }}>
                      Ghi nhớ đăng nhập
                    </Typography>
                  }
                />
                <Typography
                  component={Link}
                  to="/forgot-password"
                  sx={{
                    color: "#ba3b14",
                    fontSize: 14,
                    fontWeight: 700,
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                    "&:hover": {
                      color: "#8f2c10",
                      textDecoration: "underline",
                      textUnderlineOffset: "3px",
                    },
                  }}
                >
                  Quên mật khẩu?
                </Typography>
              </Box>

              <Button
                type="submit"
                fullWidth
                sx={{
                  height: 60,
                  mt: "35px",
                  [compactDesktop]: { mt: "20px" },
                  border: "2px solid #20201f",
                  borderRadius: "999px",
                  bgcolor: "primary.main",
                  color: "#20201f",
                  fontSize: 18,
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
                Đăng nhập
              </Button>

              {/* Developer Quick Access (debug mode only) */}
              {typeof window !== "undefined" &&
                new URLSearchParams(window.location.search).get("debug") === "true" && (
                  <Box sx={{ mt: 3, pt: 2, borderTop: "1px dashed #e4dfd7", textAlign: "center" }}>
                    <Typography variant="caption" sx={{ color: "#7a7d7b", display: "block", mb: 1.5 }}>
                      Chế độ thử nghiệm · Đăng nhập nhanh:
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1.5, justifyContent: "center", flexWrap: "wrap" }}>
                      <Chip
                        icon={<BusinessOutlined />}
                        label="Doanh nghiệp (Nắng Studio)"
                        clickable
                        color="primary"
                        variant="outlined"
                        onClick={() => performLogin("contact@nangstudio.vn", "client")}
                        sx={{ fontWeight: 600, py: 1 }}
                      />
                      <Chip
                        icon={<PersonOutlined />}
                        label="Freelancer (Minh Anh)"
                        clickable
                        color="default"
                        variant="outlined"
                        onClick={() => performLogin("minhanh.design@frevo.vn", "freelancer")}
                        sx={{ fontWeight: 600, py: 1 }}
                      />
                      <Chip
                        icon={<GroupsOutlined />}
                        label="Team (Pixel Craft)"
                        clickable
                        color="default"
                        variant="outlined"
                        onClick={() => performLogin("contact@pixelcraft.vn", "freelancer")}
                        sx={{ fontWeight: 600, py: 1 }}
                      />
                      <Chip
                        icon={<AdminPanelSettingsOutlined />}
                        label="Quản trị (Admin)"
                        clickable
                        color="secondary"
                        variant="outlined"
                        onClick={() => performLogin("admin@frevo.vn", "admin")}
                        sx={{ fontWeight: 600, py: 1 }}
                      />
                    </Box>
                  </Box>
                )}

              {notice && (
                <Box
                  role="status"
                  sx={{
                    mt: "18px",
                    p: "11px 14px",
                    border: "1px solid #f7c3aa",
                    borderRadius: "9px",
                    bgcolor: "#fff4ef",
                    color: "#8c3819",
                    fontSize: 14,
                    lineHeight: 1.45,
                  }}
                >
                  {notice}
                </Box>
              )}
            </Box>

            <Typography
              sx={{
                mt: "52px",
                [compactDesktop]: { mt: "24px" },
                color: "#686c69",
                textAlign: "center",
                fontSize: 15,
              }}
            >
              Chưa có tài khoản?{" "}
              <Typography
                component={Link}
                to="/register"
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
                Tạo tài khoản
              </Typography>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
