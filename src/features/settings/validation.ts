export function validateContact(name: string, email: string, phone: string, contactEmail: string): string {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!name.trim() || !emailPattern.test(email.trim())) return "Nhập họ tên và email đăng nhập hợp lệ.";
  if (contactEmail.trim() && !emailPattern.test(contactEmail.trim())) return "Email liên hệ chưa hợp lệ.";
  const digits = phone.replace(/\D/g, "");
  if (phone.trim() && (!/^\+?[\d\s().-]+$/.test(phone.trim()) || digits.length < 8 || digits.length > 15)) return "Số điện thoại cần từ 8 đến 15 chữ số.";
  return "";
}

export function validatePassword(current: string, password: string, confirmation: string): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!current) errors.current = "Nhập mật khẩu hiện tại.";
  if (password.length < 6) errors.password = "Mật khẩu cần ít nhất 6 ký tự, theo quy tắc đăng ký demo hiện tại.";
  else if (password === current) errors.password = "Mật khẩu mới phải khác mật khẩu hiện tại.";
  if (!confirmation || confirmation !== password) errors.confirmation = "Mật khẩu xác nhận chưa khớp.";
  return errors;
}
