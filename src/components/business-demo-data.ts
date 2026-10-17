export type Project = {
  id: number;
  title: string;
  category: string;
  budget: string;
  status: "published" | "draft";
  applications: number;
  unreadApplications: number;
  matches: number;
  updated: string;
  description?: string;
  skills?: string[];
  deliverables?: string[];
  deadline?: string;
  applicationDeadline?: string;
  preferredTalent?: string;
};

export const sampleProjects: Project[] = [
  { id: 1, title: "Bộ nhận diện cho Nắng Studio", category: "Thiết kế thương hiệu", budget: "15–25 triệu", status: "published", applications: 3, unreadApplications: 2, matches: 4, updated: "Cập nhật 2 giờ trước", description: "Nắng Studio cần một hệ nhận diện ấm áp, hiện đại cho thương hiệu sản phẩm thủ công. Thiết kế cần sử dụng tốt trên bao bì, mạng xã hội và tài liệu giới thiệu.", skills: ["Brand identity", "Logo design", "Packaging"], deliverables: ["Logo chính và các phiên bản sử dụng", "Bảng màu, kiểu chữ và hướng dẫn thương hiệu", "Mẫu bao bì và bộ bài đăng mạng xã hội"], deadline: "30/11/2026", applicationDeadline: "31/10/2026", preferredTalent: "Cá nhân hoặc team" },
  { id: 2, title: "Landing page ra mắt bộ sưu tập mới", category: "UI/UX & Website", budget: "12–18 triệu", status: "draft", applications: 0, unreadApplications: 0, matches: 0, updated: "Lưu hôm qua" },
];
