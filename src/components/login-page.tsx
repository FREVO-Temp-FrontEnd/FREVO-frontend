import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import "./login-page.css";

type LoginErrors = { email?: string; password?: string };

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [notice, setNotice] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Đăng nhập | FREVO";
    return () => { document.title = previousTitle; };
  }, []);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: LoginErrors = {};
    if (!email.trim()) nextErrors.email = "Vui lòng nhập email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) nextErrors.email = "Email chưa đúng định dạng.";
    if (!password) nextErrors.password = "Vui lòng nhập mật khẩu.";

    setErrors(nextErrors);
    setNotice("");
    if (nextErrors.email) emailRef.current?.focus();
    else if (nextErrors.password) passwordRef.current?.focus();
    else setNotice("Đây là bản giao diện mẫu. Chức năng đăng nhập chưa được kết nối.");
  }

  return (
    <main className="login-shell">
      <section className="login-story" aria-label="Giới thiệu FREVO">
        <div className="login-story-copy">
          <h1>Ý tưởng hay<br />cần đúng cơ hội<span>.</span></h1>
          <p>Bắt đầu hành trình sáng tạo cùng FREVO.</p>
        </div>
        <img className="login-art" src="/assets/frevo-login-illustration.png" alt="" aria-hidden="true" />
      </section>

      <section className="login-panel" aria-labelledby="login-title">
        <div className="login-panel-inner">
          <Link to="/" className="login-logo-link" aria-label="FREVO, về trang dự án">
            <img src="/assets/frevo-logo.png" className="login-logo" alt="FREVO" />
          </Link>

          <div className="login-form-area">
            <h2 id="login-title">Chào mừng trở lại.</h2>
            <p className="login-subtitle">Nơi doanh nghiệp và freelancer kết nối để hợp tác.</p>

            <form className="login-form" onSubmit={submit} noValidate>
              <div className="login-field">
                <label htmlFor="login-email">Email</label>
                <Input ref={emailRef} id="login-email" name="email" type="email" autoComplete="email" value={email} onChange={event => { setEmail(event.target.value); setErrors(previous => ({ ...previous, email: undefined })); }} placeholder="ban@example.com" aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "login-email-error" : undefined} />
                {errors.email && <p id="login-email-error" className="login-error" role="alert">{errors.email}</p>}
              </div>

              <div className="login-field">
                <label htmlFor="login-password">Mật khẩu</label>
                <div className="login-password-wrap">
                  <Input ref={passwordRef} id="login-password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" value={password} onChange={event => { setPassword(event.target.value); setErrors(previous => ({ ...previous, password: undefined })); }} placeholder="Nhập mật khẩu" aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? "login-password-error" : undefined} />
                  <button type="button" className="login-reveal" onClick={() => setShowPassword(value => !value)} aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"} aria-pressed={showPassword}>{showPassword ? <EyeOff size={20} strokeWidth={1.8} /> : <Eye size={20} strokeWidth={1.8} />}</button>
                </div>
                {errors.password && <p id="login-password-error" className="login-error" role="alert">{errors.password}</p>}
              </div>

              <div className="login-options">
                <label className="login-remember"><Checkbox checked={remember} onCheckedChange={checked => setRemember(checked === true)} aria-label="Ghi nhớ đăng nhập" /> <span>Ghi nhớ đăng nhập</span></label>
                <button className="login-text-link" type="button" onClick={() => setNotice("Chức năng đặt lại mật khẩu chưa được kết nối.")}>Quên mật khẩu?</button>
              </div>

              <Button type="submit" className="login-submit">Đăng nhập</Button>
              {notice && <p className="login-notice" role="status">{notice}</p>}
            </form>

            <p className="login-register">Chưa có tài khoản? <button type="button" className="login-text-link" onClick={() => setNotice("Trang tạo tài khoản chưa được kết nối.")}>Tạo tài khoản</button></p>
          </div>
        </div>
      </section>
    </main>
  );
}
