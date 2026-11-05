import type { MarketplaceState, UserSession } from "@/lib/types/marketplace.types";

export interface BusinessAccountFields {
  companyName: string;
  industry: string;
  companyBio: string;
  name: string;
  email: string;
  phone: string;
  contactEmail: string;
  address: string;
}
export type BusinessAccountErrors = Partial<Record<keyof BusinessAccountFields, string>>;

export function businessAccountFields(user: UserSession): BusinessAccountFields {
  return { companyName: user.companyName ?? "", industry: user.industry ?? "", companyBio: user.companyBio ?? "", name: user.name, email: user.email, phone: user.phone ?? "", contactEmail: user.contactEmail ?? "", address: user.address ?? "" };
}

export function validateBusinessAccount(fields: BusinessAccountFields): BusinessAccountErrors {
  const errors: BusinessAccountErrors = {};
  const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!fields.companyName.trim()) errors.companyName = "Nhập tên doanh nghiệp hoặc đơn vị tuyển dụng.";
  else if (fields.companyName.trim().length > 80) errors.companyName = "Tên doanh nghiệp tối đa 80 ký tự.";
  if (fields.industry.trim().length > 100) errors.industry = "Lĩnh vực tối đa 100 ký tự.";
  if (fields.companyBio.trim().length > 1500) errors.companyBio = "Giới thiệu tối đa 1500 ký tự.";
  if (!fields.name.trim()) errors.name = "Nhập tên người đại diện.";
  else if (fields.name.trim().length > 100) errors.name = "Tên người đại diện tối đa 100 ký tự.";
  if (!email.test(fields.email.trim())) errors.email = "Nhập email đăng nhập hợp lệ.";
  if (fields.contactEmail.trim() && !email.test(fields.contactEmail.trim())) errors.contactEmail = "Email liên hệ chưa hợp lệ.";
  const phone = fields.phone.trim();
  const digits = phone.replace(/\D/g, "");
  if (phone && (!/^\+?[\d\s().-]+$/.test(phone) || digits.length < 8 || digits.length > 15)) errors.phone = "Số điện thoại cần từ 8 đến 15 chữ số.";
  return errors;
}

/** Keep the current prototype's company-based project ownership intact on rename. */
export function applyBusinessAccountUpdate(state: MarketplaceState, fields: BusinessAccountFields, expected: UserSession): MarketplaceState {
  const actor = state.activeUser;
  if (actor.id !== expected.id || actor.role !== expected.role || !["client", "admin"].includes(actor.role)) throw new Error("Phiên tài khoản đã thay đổi. Vui lòng tải lại trang.");
  if (JSON.stringify(businessAccountFields(actor)) !== JSON.stringify(businessAccountFields(expected))) throw new Error("Thông tin tài khoản vừa thay đổi. Hủy thay đổi để tải thông tin mới nhất rồi thử lại.");
  const errors = validateBusinessAccount(fields);
  if (Object.keys(errors).length) throw new Error("Kiểm tra lại các thông tin chưa hợp lệ.");
  const trimmed: BusinessAccountFields = { companyName: fields.companyName.trim(), industry: fields.industry.trim(), companyBio: fields.companyBio.trim(), name: fields.name.trim(), email: fields.email.trim().toLowerCase(), phone: fields.phone.trim(), contactEmail: fields.contactEmail.trim().toLowerCase(), address: fields.address.trim() };
  if (trimmed.companyName !== actor.companyName && state.projects.some(project => project.company === trimmed.companyName)) throw new Error("Tên doanh nghiệp này đang gắn với một không gian dự án khác. Vui lòng dùng tên khác.");
  return {
    ...state,
    activeUser: { ...actor, ...trimmed },
    projects: state.projects.map(project => actor.companyName && project.company === actor.companyName ? { ...project, company: trimmed.companyName } : project),
  };
}
