export type ProjectStatus = "draft" | "published" | "agreement" | "ongoing" | "closed";
export type CandidateStatus = "new" | "discussing" | "offer" | "selected" | "not_selected";
export type InviteStatus = "pending" | "accepted" | "declined";

export type BusinessProject = {
  id: string;
  title: string;
  category: string;
  description: string;
  skills: string[];
  budget: string;
  deadline: string;
  applicationDeadline: string;
  deliverables: string[];
  preference: "both" | "individual" | "team";
  status: ProjectStatus;
};

export type Talent = {
  id: string;
  name: string;
  role: string;
  kind: "Cá nhân" | "Team";
  initials: string;
  color: string;
  location: string;
  rate: string;
  availability: string;
  skills: string[];
  about: string;
  portfolio: { title: string; category: string; color: string }[];
  fit: string[];
};

export type Candidate = {
  id: string;
  projectId: string;
  talentId: string;
  source: "Ứng tuyển" | "Lời mời" | "Ứng tuyển · Lời mời";
  status: CandidateStatus;
  proposal: string;
  received: string;
  unread: boolean;
};

export type Invitation = {
  id: string;
  projectId: string;
  talentId: string;
  status: InviteStatus;
  sent: string;
};

export type Message = {
  id: string;
  projectId: string;
  talentId: string;
  sender: "business" | "talent";
  body: string;
  time: string;
};

export type Agreement = {
  projectId: string;
  talentId: string;
  scope: string;
  deliverables: string;
  deadline: string;
  budget: string;
  status: "pending" | "confirmed";
  sent: string;
  reference?: string;
  confirmedAt?: string;
  milestones?: Milestone[];
};

export type Milestone = {
  id: string;
  name: string;
  deliverable: string;
  deadline: string;
  amount: string;
  status: "upcoming" | "in_progress" | "submitted" | "completed";
  submittedAt?: string;
  completedAt?: string;
};

export type Notice = { id: string; title: string; detail: string; time: string; read: boolean; href: string };

export type BusinessState = {
  projects: BusinessProject[];
  candidates: Candidate[];
  invitations: Invitation[];
  messages: Message[];
  agreements: Agreement[];
  notices: Notice[];
  businessName: string;
};

export const talents: Talent[] = [
  { id: "minh-anh", name: "Minh Anh", role: "Brand Designer", kind: "Cá nhân", initials: "MA", color: "#eedbc9", location: "TP. Hồ Chí Minh", rate: "18–22 triệu / dự án", availability: "Có thể bắt đầu ngay", skills: ["Brand identity", "Logo design", "Packaging"], about: "Thiết kế nhận diện cho thương hiệu tiêu dùng và các sản phẩm thủ công. Tập trung vào hệ thống có thể sử dụng nhất quán trên bao bì và kênh số.", portfolio: [{ title: "Lúm Coffee", category: "Nhận diện thương hiệu", color: "#d8a983" }, { title: "Mộc", category: "Bao bì sản phẩm", color: "#c6cfbd" }], fit: ["3 kỹ năng trùng brief", "Portfolio cùng lĩnh vực", "Trong khoảng ngân sách"] },
  { id: "may-creative", name: "Mây Creative", role: "Nhóm thiết kế thương hiệu", kind: "Team", initials: "MC", color: "#d9dfda", location: "Hà Nội", rate: "22–28 triệu / dự án", availability: "Sẵn sàng từ tháng 11", skills: ["Brand identity", "Art direction", "Social design"], about: "Team 3 người phụ trách chiến lược hình ảnh, thiết kế nhận diện và triển khai nội dung số. Một tài khoản đại diện trao đổi và xác nhận trên FREVO.", portfolio: [{ title: "Lala", category: "Hệ nhận diện", color: "#c9ccd5" }, { title: "Sớm", category: "Chiến dịch ra mắt", color: "#edcba9" }], fit: ["Năng lực team phù hợp", "Portfolio nhận diện", "Có thể đáp ứng nhiều đầu việc"] },
  { id: "khanh-linh", name: "Khánh Linh", role: "Visual Identity Designer", kind: "Cá nhân", initials: "KL", color: "#d8d4ea", location: "Đà Nẵng", rate: "16–20 triệu / dự án", availability: "Có thể bắt đầu ngay", skills: ["Brand identity", "Typography", "Guideline"], about: "Chuyên xây dựng bộ nhận diện rõ ràng, dễ dùng cho đội ngũ nhỏ. Có kinh nghiệm thiết kế guideline và tài liệu ứng dụng.", portfolio: [{ title: "Tía", category: "Brandbook", color: "#d4b2ad" }, { title: "Nét Studio", category: "Visual identity", color: "#d9d3c0" }], fit: ["Kinh nghiệm nhận diện", "Đúng khoảng ngân sách", "Sẵn sàng ngay"] },
  { id: "ha-vy", name: "Hà Vy", role: "Brand & Packaging Designer", kind: "Cá nhân", initials: "HV", color: "#f2d7c5", location: "TP. Hồ Chí Minh", rate: "20–25 triệu / dự án", availability: "Có thể bắt đầu ngay", skills: ["Brand identity", "Packaging", "Illustration"], about: "Thiết kế hình ảnh thương hiệu và bao bì cho sản phẩm lifestyle, thực phẩm và cửa hàng độc lập.", portfolio: [{ title: "Nâu Market", category: "Bao bì", color: "#d9bc9f" }, { title: "Rì Rào", category: "Nhận diện", color: "#c9d9c8" }], fit: ["Kỹ năng bao bì phù hợp", "Portfolio cùng ngành", "Trong khoảng ngân sách"] },
  { id: "studio-dau", name: "Studio Dâu", role: "Creative team", kind: "Team", initials: "SD", color: "#f1d4d3", location: "Hà Nội", rate: "24–30 triệu / dự án", availability: "Sẵn sàng từ tháng 11", skills: ["Brand identity", "Packaging", "Campaign"], about: "Team thiết kế tập trung vào bộ nhận diện và triển khai đa kênh cho các thương hiệu mới.", portfolio: [{ title: "Mùa", category: "Nhận diện", color: "#dbb7b5" }, { title: "Chạm", category: "Campaign", color: "#e8d2ad" }], fit: ["Đủ năng lực triển khai", "Portfolio liên quan", "Phù hợp dự án theo team"] },
];

export const initialBusinessState: BusinessState = {
  businessName: "Nắng Studio",
  projects: [
    { id: "nang-brand", title: "Bộ nhận diện cho Nắng Studio", category: "Thiết kế thương hiệu", description: "Nắng Studio cần một hệ nhận diện ấm áp, hiện đại cho thương hiệu sản phẩm thủ công. Thiết kế cần sử dụng tốt trên bao bì, mạng xã hội và tài liệu giới thiệu.", skills: ["Brand identity", "Logo design", "Packaging"], budget: "15–25 triệu", deadline: "30/11/2026", applicationDeadline: "31/10/2026", deliverables: ["Logo chính và các phiên bản sử dụng", "Bảng màu, kiểu chữ và hướng dẫn thương hiệu", "Mẫu bao bì và bộ bài đăng mạng xã hội"], preference: "both", status: "published" },
    { id: "landing-collection", title: "Landing page ra mắt bộ sưu tập mới", category: "UI/UX & Website", description: "Thiết kế landing page giới thiệu bộ sưu tập mới, dễ xem trên điện thoại và thể hiện rõ sản phẩm nổi bật.", skills: ["UI design", "Landing page"], budget: "12–18 triệu", deadline: "15/12/2026", applicationDeadline: "10/11/2026", deliverables: ["Thiết kế desktop và mobile", "Bộ thành phần giao diện"], preference: "individual", status: "draft" },
    { id: "co-may-packaging", title: "Bao bì cho dòng trà Cỏ Mây", category: "Thiết kế thương hiệu", description: "Thiết kế hệ bao bì cho ba vị trà mới của Nắng Studio, thống nhất ngôn ngữ thị giác với nhận diện hiện có và sẵn sàng bàn giao cho nhà in.", skills: ["Packaging", "Illustration", "Print design"], budget: "24 triệu", deadline: "20/11/2026", applicationDeadline: "01/10/2026", deliverables: ["Định hướng hình ảnh cho bộ bao bì", "Thiết kế hộp và nhãn cho ba vị trà", "Tệp in và hướng dẫn sử dụng"], preference: "individual", status: "ongoing" },
  ],
  candidates: [
    { id: "c1", projectId: "nang-brand", talentId: "minh-anh", source: "Ứng tuyển", status: "new", proposal: "Mình muốn xây dựng một hệ nhận diện linh hoạt, từ logo đến bao bì. Hai dự án Lúm Coffee và Mộc trong portfolio có phạm vi khá gần với brief này.", received: "Hôm nay, 09:42", unread: true },
    { id: "c2", projectId: "nang-brand", talentId: "may-creative", source: "Ứng tuyển", status: "new", proposal: "Team Mây có thể đảm nhận toàn bộ hệ nhận diện và ứng dụng mạng xã hội, với một người đại diện xuyên suốt dự án.", received: "Hôm qua, 16:20", unread: true },
    { id: "c3", projectId: "nang-brand", talentId: "khanh-linh", source: "Ứng tuyển", status: "discussing", proposal: "Mình có kinh nghiệm xây dựng brandbook cho studio nhỏ và muốn trao đổi thêm về các điểm chạm ưu tiên.", received: "15/10, 11:08", unread: false },
    { id: "c4", projectId: "co-may-packaging", talentId: "ha-vy", source: "Ứng tuyển", status: "selected", proposal: "Mình có thể xây dựng một hệ bao bì thống nhất cho ba vị trà và chuẩn bị tệp in đầy đủ.", received: "28/09, 14:15", unread: false },
    { id: "c5", projectId: "co-may-packaging", talentId: "studio-dau", source: "Ứng tuyển", status: "not_selected", proposal: "Team mình từng triển khai bao bì sản phẩm đồ uống và có thể đáp ứng tiến độ.", received: "29/09, 09:30", unread: false },
  ],
  invitations: [],
  messages: [
    { id: "m1", projectId: "nang-brand", talentId: "khanh-linh", sender: "talent", body: "Em đã xem brief và gửi thêm hai dự án nhận diện gần đây để anh/chị tham khảo.", time: "Hôm nay, 10:18" },
    { id: "m2", projectId: "nang-brand", talentId: "khanh-linh", sender: "business", body: "Cảm ơn Linh. Bên mình muốn ưu tiên bao bì và bộ bài đăng trong giai đoạn đầu.", time: "Hôm nay, 10:24" },
    { id: "m3", projectId: "co-may-packaging", talentId: "ha-vy", sender: "business", body: "Bên mình đã xác nhận nội dung hợp tác. Vy gửi giúp bản định hướng màu sắc cho ba vị trà trước nhé.", time: "15/10, 09:10" },
    { id: "m4", projectId: "co-may-packaging", talentId: "ha-vy", sender: "talent", body: "Mình đã bắt đầu lên hướng màu và minh họa. Chiều mai mình sẽ gửi bản xem trước để bên bạn góp ý.", time: "15/10, 09:26" },
    { id: "m5", projectId: "co-may-packaging", talentId: "studio-dau", sender: "business", body: "Cảm ơn team đã quan tâm. Dự án đã chọn một freelancer khác cho đợt này.", time: "03/10, 16:40" },
  ],
  agreements: [
    { projectId: "co-may-packaging", talentId: "ha-vy", scope: "Thiết kế hệ bao bì cho ba vị trà Cỏ Mây của Nắng Studio, bao gồm định hướng hình ảnh, thiết kế hộp và nhãn, chuẩn bị tệp in.", deliverables: "Định hướng hình ảnh cho bộ bao bì\nThiết kế hộp và nhãn cho ba vị trà\nTệp in và hướng dẫn sử dụng", deadline: "20/11/2026", budget: "24 triệu", status: "confirmed", sent: "02/10/2026", confirmedAt: "03/10/2026", reference: "FV-2026-004", milestones: [{ id: "co-may-1", name: "Mốc 1 · Định hướng", deliverable: "Moodboard, bảng màu và hướng minh họa cho ba vị trà", deadline: "25/10/2026", amount: "8 triệu", status: "submitted", submittedAt: "16/10/2026" }, { id: "co-may-2", name: "Mốc 2 · Thiết kế bao bì", deliverable: "Thiết kế hộp, nhãn và tệp in hoàn chỉnh", deadline: "20/11/2026", amount: "16 triệu", status: "upcoming" }] },
  ],
  notices: [
    { id: "n1", title: "Minh Anh vừa ứng tuyển", detail: "Bộ nhận diện cho Nắng Studio", time: "09:42 hôm nay", read: false, href: "/business/projects/nang-brand/applicants" },
    { id: "n2", title: "Bạn có tin nhắn mới", detail: "Khánh Linh đã gửi một tin nhắn trong dự án.", time: "10:18 hôm nay", read: false, href: "/business/projects/nang-brand/messages?talent=khanh-linh" },
    { id: "n3", title: "Mây Creative đã ứng tuyển", detail: "Bộ nhận diện cho Nắng Studio", time: "Hôm qua", read: true, href: "/business/projects/nang-brand/applicants" },
  ],
};
