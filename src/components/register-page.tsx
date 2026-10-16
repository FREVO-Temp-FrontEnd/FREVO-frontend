import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import "./register-page.css";

type RoleType = "freelancer" | "client";

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

  // Form fields (preserved across role toggling)
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

    // Validate Tên công ty only for Doanh nghiệp tuyển dụng
    if (role === "client") {
      if (!companyName.trim()) {
        nextErrors.companyName = "Vui lòng nhập tên công ty.";
      }
    }

    // Validate Name
    if (!name.trim()) {
      nextErrors.name =
        role === "client"
          ? "Vui lòng nhập họ và tên người liên hệ."
          : "Vui lòng nhập họ và tên.";
    }

    // Validate Email
    if (!email.trim()) {
      nextErrors.email =
        role === "client" ? "Vui lòng nhập email liên hệ." : "Vui lòng nhập email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = "Email chưa đúng định dạng.";
    }

    // Validate Password (min 6 characters)
    if (!password) {
      nextErrors.password = "Vui lòng nhập mật khẩu.";
    } else if (password.length < 6) {
      nextErrors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
    }

    // Validate Confirm Password
    if (!confirmPassword) {
      nextErrors.confirmPassword = "Vui lòng xác nhận mật khẩu.";
    } else if (confirmPassword !== password) {
      nextErrors.confirmPassword = "Mật khẩu xác nhận không khớp.";
    }

    // Validate Terms
    if (!agreeTerms) {
      nextErrors.terms = "Vui lòng đồng ý với Điều khoản dịch vụ và Chính sách bảo mật.";
    }

    setErrors(nextErrors);
    setNotice("");

    // Auto-focus on first error
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
      setNotice(
        role === "client"
          ? "Đây là bản giao diện mẫu. Đăng ký tài khoản doanh nghiệp chưa được kết nối backend."
          : "Đây là bản giao diện mẫu. Đăng ký tài khoản freelancer chưa được kết nối backend."
      );
    }
  }

  return (
    <main className="register-shell">
      <section className="register-story" aria-label="Giới thiệu FREVO">
        <div className="register-story-copy">
          {role === "freelancer" ? (
            <>
              <h1>
                Khởi đầu mới<br />cùng dự án hay<span>.</span>
              </h1>
              <p>Gia nhập mạng lưới sáng tạo kết nối freelancer và doanh nghiệp hàng đầu.</p>
            </>
          ) : (
            <>
              <h1>
                Tìm kiếm tài năng<br />cho dự án của bạn<span>.</span>
              </h1>
              <p>Kết nối nhanh chóng với các chuyên gia sáng tạo tự do xuất sắc nhất.</p>
            </>
          )}
        </div>
        {/* Sử dụng ảnh register_page.png cho cả 2 tab */}
        <img
          className="register-art"
          src="/assets/register_page.png"
          alt=""
          aria-hidden="true"
        />
      </section>

      <section className="register-panel" aria-labelledby="register-title">
        <div className="register-panel-inner">
          <Link to="/" className="register-logo-link" aria-label="FREVO, về trang dự án">
            <img src="/assets/frevo-logo.png" className="register-logo" alt="FREVO" />
          </Link>

          <div className="register-form-area">
            <h2 id="register-title">Tạo tài khoản mới.</h2>
            <p className="register-subtitle">
              {role === "freelancer"
                ? "Đăng ký để khám phá cơ hội và kết nối với đối tác sáng tạo."
                : "Đăng ký tài khoản để đăng tuyển và tìm kiếm freelancer phù hợp."}
            </p>

            {/* Role switchers: chỉ giữ Vai trò của bạn */}
            <div className="register-role-group" role="group" aria-labelledby="register-role-label">
              <span id="register-role-label" className="register-role-label">
                Vai trò của bạn:
              </span>
              <div className="register-role-options">
                <button
                  type="button"
                  className={`register-role-btn ${role === "freelancer" ? "active" : ""}`}
                  onClick={() => handleRoleChange("freelancer")}
                  aria-pressed={role === "freelancer"}
                >
                  Freelancer tìm việc
                </button>
                <button
                  type="button"
                  className={`register-role-btn ${role === "client" ? "active" : ""}`}
                  onClick={() => handleRoleChange("client")}
                  aria-pressed={role === "client"}
                >
                  Doanh nghiệp tuyển dụng
                </button>
              </div>
            </div>

            <form className="register-form" onSubmit={submit} noValidate>
              {/* Trường Tên công ty (chỉ hiển thị khi là Doanh nghiệp tuyển dụng) */}
              {role === "client" && (
                <div className="register-field">
                  <label htmlFor="register-company">Tên công ty</label>
                  <Input
                    ref={companyNameRef}
                    id="register-company"
                    name="companyName"
                    type="text"
                    autoComplete="organization"
                    value={companyName}
                    onChange={event => {
                      setCompanyName(event.target.value);
                      setErrors(previous => ({ ...previous, companyName: undefined }));
                    }}
                    placeholder="Ví dụ: Công ty TNHH Mộc"
                    aria-invalid={Boolean(errors.companyName)}
                    aria-describedby={errors.companyName ? "register-company-error" : undefined}
                  />
                  {errors.companyName && (
                    <p id="register-company-error" className="register-error" role="alert">
                      {errors.companyName}
                    </p>
                  )}
                </div>
              )}

              {/* Trường Họ và tên */}
              <div className="register-field">
                <label htmlFor="register-name">
                  {role === "client" ? "Họ và tên người liên hệ" : "Họ và tên"}
                </label>
                <Input
                  ref={nameRef}
                  id="register-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={event => {
                    setName(event.target.value);
                    setErrors(previous => ({ ...previous, name: undefined }));
                  }}
                  placeholder="Nguyễn Văn A"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "register-name-error" : undefined}
                />
                {errors.name && (
                  <p id="register-name-error" className="register-error" role="alert">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Trường Email */}
              <div className="register-field">
                <label htmlFor="register-email">
                  {role === "client" ? "Email liên hệ" : "Email"}
                </label>
                <Input
                  ref={emailRef}
                  id="register-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={event => {
                    setEmail(event.target.value);
                    setErrors(previous => ({ ...previous, email: undefined }));
                  }}
                  placeholder={role === "client" ? "contact@example.com" : "ban@example.com"}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "register-email-error" : undefined}
                />
                {errors.email && (
                  <p id="register-email-error" className="register-error" role="alert">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Trường Mật khẩu */}
              <div className="register-field">
                <label htmlFor="register-password">Mật khẩu</label>
                <div className="register-password-wrap">
                  <Input
                    ref={passwordRef}
                    id="register-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={password}
                    onChange={event => {
                      setPassword(event.target.value);
                      setErrors(previous => ({ ...previous, password: undefined }));
                    }}
                    placeholder="Tối thiểu 6 ký tự"
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={errors.password ? "register-password-error" : undefined}
                  />
                  <button
                    type="button"
                    className="register-reveal"
                    onClick={() => setShowPassword(value => !value)}
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? <EyeOff size={20} strokeWidth={1.8} /> : <Eye size={20} strokeWidth={1.8} />}
                  </button>
                </div>
                {errors.password && (
                  <p id="register-password-error" className="register-error" role="alert">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Trường Xác nhận mật khẩu */}
              <div className="register-field">
                <label htmlFor="register-confirm-password">Xác nhận mật khẩu</label>
                <div className="register-password-wrap">
                  <Input
                    ref={confirmPasswordRef}
                    id="register-confirm-password"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={event => {
                      setConfirmPassword(event.target.value);
                      setErrors(previous => ({ ...previous, confirmPassword: undefined }));
                    }}
                    placeholder="Nhập lại mật khẩu vừa đặt"
                    aria-invalid={Boolean(errors.confirmPassword)}
                    aria-describedby={errors.confirmPassword ? "register-confirm-password-error" : undefined}
                  />
                  <button
                    type="button"
                    className="register-reveal"
                    onClick={() => setShowConfirmPassword(value => !value)}
                    aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    aria-pressed={showConfirmPassword}
                  >
                    {showConfirmPassword ? <EyeOff size={20} strokeWidth={1.8} /> : <Eye size={20} strokeWidth={1.8} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p id="register-confirm-password-error" className="register-error" role="alert">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Checkbox điều khoản */}
              <div className="register-terms">
                <label className="register-terms-label">
                  <Checkbox
                    checked={agreeTerms}
                    onCheckedChange={checked => {
                      setAgreeTerms(checked === true);
                      setErrors(previous => ({ ...previous, terms: undefined }));
                    }}
                    aria-label="Đồng ý điều khoản"
                    aria-invalid={Boolean(errors.terms)}
                    aria-describedby={errors.terms ? "register-terms-error" : undefined}
                  />
                  <span>
                    Tôi đồng ý với các{" "}
                    <a href="#terms" className="register-text-link" onClick={e => e.preventDefault()}>
                      Điều khoản dịch vụ
                    </a>{" "}
                    và{" "}
                    <a href="#privacy" className="register-text-link" onClick={e => e.preventDefault()}>
                      Chính sách bảo mật
                    </a>{" "}
                    của FREVO.
                  </span>
                </label>
                {errors.terms && (
                  <p id="register-terms-error" className="register-error" role="alert">
                    {errors.terms}
                  </p>
                )}
              </div>

              <Button type="submit" className="register-submit">
                Tạo tài khoản
              </Button>
              {notice && (
                <p className="register-notice" role="status">
                  {notice}
                </p>
              )}
            </form>

            <p className="register-login">
              Đã có tài khoản?{" "}
              <Link to="/login" className="register-text-link">
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
