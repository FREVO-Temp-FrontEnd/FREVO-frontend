import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router";
import { ArrowLeft, CheckCircle2, Mail } from "lucide-react";
import { Button } from "@/app/shared/components/ui/button";
import { Input } from "@/app/shared/components/ui/input";
import "../styles/forgot-password-page.css";

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
      setNotice("Đây là bản giao diện mẫu. Hệ thống gửi email chưa được kết nối backend.");
    }
  }

  return (
    <main className="forgot-shell">
      <section className="forgot-story" aria-label="Giới thiệu FREVO">
        <div className="forgot-story-copy">
          <h1>An tâm tiếp tục<br />hành trình<span>.</span></h1>
          <p>Lấy lại quyền truy cập tài khoản FREVO an toàn và nhanh chóng.</p>
        </div>
        <img className="forgot-art" src="/assets/forgot-password.png" alt="" aria-hidden="true" />
      </section>

      <section className="forgot-panel" aria-labelledby="forgot-title">
        <div className="forgot-panel-inner">
          <Link to="/" className="forgot-logo-link" aria-label="FREVO, về trang dự án">
            <img src="/assets/frevo-logo.png" className="forgot-logo" alt="FREVO" />
          </Link>

          {submittedEmail ? (
            <div className="forgot-success-area">
              <div className="forgot-success-badge" aria-hidden="true">
                <CheckCircle2 size={36} strokeWidth={2.2} />
              </div>
              <h2 id="forgot-title">Kiểm tra hộp thư của bạn<span>.</span></h2>
              <p className="forgot-subtitle">
                Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến địa chỉ email:
              </p>
              <div className="forgot-email-pill">
                <Mail size={16} strokeWidth={2} />
                <span>{submittedEmail}</span>
              </div>
              <p className="forgot-instructions">
                Nếu không thấy email trong vài phút, hãy kiểm tra thư mục Spam hoặc yêu cầu gửi lại.
              </p>

              {notice && <p className="forgot-notice" role="status">{notice}</p>}

              <div className="forgot-success-actions">
                <Button
                  type="button"
                  className="forgot-submit"
                  onClick={() => {
                    setSubmittedEmail(null);
                    setNotice("");
                  }}
                >
                  Gửi lại email khác
                </Button>
                <Link to="/login" className="forgot-back-link">
                  <ArrowLeft size={18} strokeWidth={2} />
                  <span>Quay lại đăng nhập</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="forgot-form-area">
              <h2 id="forgot-title">Quên mật khẩu?</h2>
              <p className="forgot-subtitle">
                Nhập email đăng ký của bạn. Chúng tôi sẽ gửi đường dẫn để bạn thiết lập lại mật khẩu.
              </p>

              <form className="forgot-form" onSubmit={submit} noValidate>
                <div className="forgot-field">
                  <label htmlFor="forgot-email">Email tài khoản</label>
                  <Input
                    ref={emailRef}
                    id="forgot-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={event => {
                      setEmail(event.target.value);
                      setErrors(previous => ({ ...previous, email: undefined }));
                    }}
                    placeholder="ban@example.com"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "forgot-email-error" : undefined}
                  />
                  {errors.email && (
                    <p id="forgot-email-error" className="forgot-error" role="alert">
                      {errors.email}
                    </p>
                  )}
                </div>

                <Button type="submit" className="forgot-submit">Gửi liên kết khôi phục</Button>
                {notice && <p className="forgot-notice" role="status">{notice}</p>}
              </form>

              <p className="forgot-back">
                <Link to="/login" className="forgot-back-link">
                  <ArrowLeft size={18} strokeWidth={2} />
                  <span>Quay lại đăng nhập</span>
                </Link>
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
