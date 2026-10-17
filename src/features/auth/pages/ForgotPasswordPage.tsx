import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router";
import {
  Box,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { ArrowBack, CheckCircleOutlined, MailOutlined } from "@mui/icons-material";

type ForgotErrors = {
  email?: string;
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<ForgotErrors>({});
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Quên mật khẩu | FREVO";
    return () => {
      document.title = previousTitle;
    };
  }, []);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: ForgotErrors = {};

    if (!email.trim()) {
      nextErrors.email = "Vui lòng nhập email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = "Email chưa đúng định dạng.";
    }

    setErrors(nextErrors);
    setNotice("");

    if (nextErrors.email) {
      emailRef.current?.focus();
    } else {
      setSubmittedEmail(email.trim());
      setNotice(
        "Đây là bản giao diện mẫu. Hệ thống gửi email chưa được kết nối backend."
      );
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
          minHeight: "760px",
          overflow: "hidden",
          bgcolor: "var(--peach, #fff0e9)",
          p: {
            md: "clamp(68px, 6vw, 90px) clamp(44px, 5.1vw, 86px)",
          },
        }}
      >
        <Box sx={{ position: "relative", zIndex: 2, maxWidth: 660 }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: "clamp(58px, 5.6vw, 88px)",
              lineHeight: 0.99,
              letterSpacing: "-0.065em",
              fontWeight: 900,
              color: "#20201f",
              "& span": { color: "primary.main" },
            }}
          >
            An tâm tiếp tục<br />hành trình<span>.</span>
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
            Lấy lại quyền truy cập tài khoản FREVO an toàn và nhanh chóng.
          </Typography>
        </Box>
        <Box
          component="img"
          src="/assets/forgot-password.png"
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
        aria-labelledby="forgot-title"
        sx={{
          display: "flex",
          alignItems: "flex-start",
          p: {
            xs: "38px 24px 48px",
            sm: "48px 40px",
            md: "clamp(52px, 5vw, 76px) clamp(42px, 6vw, 104px)",
          },
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
              }}
            />
          </Box>

          {submittedEmail ? (
            <Box sx={{ mt: "clamp(22px, 2vw, 30px)" }}>
              <Box
                sx={{
                  display: "grid",
                  placeItems: "center",
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  bgcolor: "#dcfce7",
                  color: "#15803d",
                  mb: "24px",
                }}
              >
                <CheckCircleOutlined sx={{ fontSize: 36 }} />
              </Box>
              <Typography
                id="forgot-title"
                variant="h2"
                sx={{
                  fontSize: {
                    xs: "clamp(32px, 7vw, 44px)",
                    md: "clamp(34px, 3vw, 48px)",
                  },
                  lineHeight: 1.05,
                  letterSpacing: "-0.055em",
                  fontWeight: 900,
                  color: "#20201f",
                  "& span": { color: "primary.main" },
                }}
              >
                Kiểm tra hộp thư của bạn<span>.</span>
              </Typography>
              <Typography
                sx={{
                  mt: "14px",
                  color: "#686c69",
                  fontSize: 16,
                  lineHeight: 1.5,
                }}
              >
                Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến địa chỉ email:
              </Typography>
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1.5,
                  my: "16px",
                  px: 2,
                  py: 1,
                  borderRadius: "999px",
                  bgcolor: "#f0f1ee",
                  color: "#20201f",
                  fontWeight: 700,
                  fontSize: 15,
                }}
              >
                <MailOutlined sx={{ fontSize: 18 }} />
                <span>{submittedEmail}</span>
              </Box>
              <Typography
                sx={{
                  color: "#8b8e89",
                  fontSize: 14,
                  lineHeight: 1.5,
                }}
              >
                Nếu không thấy email trong vài phút, hãy kiểm tra thư mục Spam hoặc yêu cầu gửi lại.
              </Typography>

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
                  }}
                >
                  {notice}
                </Box>
              )}

              <Box sx={{ mt: "32px", display: "flex", flexDirection: "column", gap: 2 }}>
                <Button
                  type="button"
                  onClick={() => {
                    setSubmittedEmail(null);
                    setNotice("");
                  }}
                  sx={{
                    height: 54,
                    border: "2px solid #20201f",
                    borderRadius: "999px",
                    bgcolor: "primary.main",
                    color: "#20201f",
                    fontSize: 16,
                    fontWeight: 900,
                    boxShadow: "3px 4px 0 #20201f",
                    "&:hover": {
                      bgcolor: "#ff5e22",
                      transform: "translate(1px, 1px)",
                    },
                  }}
                >
                  Gửi lại email khác
                </Button>
                <Box
                  component={Link}
                  to="/login"
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    color: "#686c69",
                    fontWeight: 700,
                    fontSize: 15,
                    textDecoration: "none",
                    "&:hover": { color: "#20201f" },
                  }}
                >
                  <ArrowBack sx={{ fontSize: 18 }} />
                  <span>Quay lại đăng nhập</span>
                </Box>
              </Box>
            </Box>
          ) : (
            <Box sx={{ mt: "clamp(22px, 2vw, 30px)" }}>
              <Typography
                id="forgot-title"
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
                Quên mật khẩu?
              </Typography>
              <Typography
                sx={{
                  mt: "14px",
                  color: "#686c69",
                  fontSize: 18,
                  lineHeight: 1.5,
                }}
              >
                Nhập email đăng ký của bạn. Chúng tôi sẽ gửi đường dẫn để bạn thiết lập lại mật khẩu.
              </Typography>

              <Box
                component="form"
                onSubmit={submit}
                noValidate
                sx={{ mt: "38px" }}
              >
                <Box sx={{ mb: "23px" }}>
                  <Typography
                    component="label"
                    htmlFor="forgot-email"
                    sx={{
                      display: "block",
                      mb: "10px",
                      fontSize: 16,
                      fontWeight: 700,
                      color: "#20201f",
                    }}
                  >
                    Email tài khoản
                  </Typography>
                  <TextField
                    inputRef={emailRef}
                    id="forgot-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setErrors((previous) => ({
                        ...previous,
                        email: undefined,
                      }));
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

                <Button
                  type="submit"
                  fullWidth
                  sx={{
                    height: 60,
                    mt: "15px",
                    border: "2px solid #20201f",
                    borderRadius: "999px",
                    bgcolor: "primary.main",
                    color: "#20201f",
                    fontSize: 18,
                    fontWeight: 900,
                    boxShadow: "4px 5px 0 #20201f",
                    transition:
                      "transform .15s ease, box-shadow .15s ease, background .15s ease",
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
                  Gửi liên kết khôi phục
                </Button>

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
                    }}
                  >
                    {notice}
                  </Box>
                )}
              </Box>

              <Box sx={{ mt: "48px", textAlign: "center" }}>
                <Box
                  component={Link}
                  to="/login"
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 1,
                    color: "#686c69",
                    fontWeight: 700,
                    fontSize: 15,
                    textDecoration: "none",
                    "&:hover": { color: "#20201f" },
                  }}
                >
                  <ArrowBack sx={{ fontSize: 18 }} />
                  <span>Quay lại đăng nhập</span>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
