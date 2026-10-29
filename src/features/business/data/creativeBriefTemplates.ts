import type { CreativeServiceId } from "@/lib/types/guidedBrief.types";
interface DeliverableTemplate { id: string; name: string; fields: { id: string; label: string; hint: string }[] }
interface CreativeService { id: CreativeServiceId; name: string; description: string; skills: string[]; deliverables: DeliverableTemplate[] }
export const creativeServices: CreativeService[] = [
  { id: "brand", name: "Nhận diện thương hiệu", description: "Logo, hệ thống hình ảnh và quy chuẩn sử dụng", skills: ["Brand Identity", "Logo Design"], deliverables: [
    { id: "logo", name: "Logo", fields: [{ id: "formats", label: "Định dạng và phiên bản", hint: "Ví dụ: AI, SVG, PNG; bản màu, đơn sắc, âm bản" }] },
    { id: "guidelines", name: "Brand guidelines", fields: [{ id: "coverage", label: "Nội dung quy chuẩn", hint: "Logo, bảng màu, typography, ví dụ ứng dụng…" }] },
    { id: "stationery", name: "Ấn phẩm thương hiệu", fields: [{ id: "applications", label: "Hạng mục và kích thước", hint: "Danh thiếp, bao bì, tiêu đề thư; kích thước và file in" }] },
  ] },
  { id: "social", name: "Thiết kế mạng xã hội", description: "Bộ nội dung hình ảnh theo kênh và chiến dịch", skills: ["Social Media Design", "Graphic Design"], deliverables: [
    { id: "posts", name: "Bộ bài đăng", fields: [{ id: "quantity", label: "Số lượng và kênh", hint: "Ví dụ: 12 ảnh cho Facebook, Instagram" }, { id: "sizes", label: "Kích thước và định dạng", hint: "1080×1080, 1080×1350; PNG, file nguồn…" }] },
    { id: "social-template", name: "Template mạng xã hội", fields: [{ id: "editable", label: "Số mẫu và công cụ chỉnh sửa", hint: "Ví dụ: 6 mẫu Canva có thể chỉnh sửa" }] },
  ] },
  { id: "video", name: "Dựng video ngắn", description: "Video theo footage, thời lượng và nền tảng", skills: ["Video Editing", "Motion Graphics"], deliverables: [
    { id: "short-video", name: "Video ngắn", fields: [{ id: "footage", label: "Footage đầu vào", hint: "Nguồn footage, ai cung cấp, tình trạng âm thanh/hình ảnh" }, { id: "duration", label: "Số lượng và thời lượng", hint: "Ví dụ: 3 video, mỗi video 30–45 giây" }, { id: "aspect", label: "Tỷ lệ và định dạng xuất", hint: "9:16, 1080p, MP4; có/không phụ đề" }] },
    { id: "video-cutdown", name: "Phiên bản cắt ngắn", fields: [{ id: "versions", label: "Các phiên bản cần xuất", hint: "Số phiên bản, thời lượng, tỷ lệ khung hình" }] },
  ] },
  { id: "copy", name: "Viết nội dung", description: "Bài viết, nội dung chiến dịch và kịch bản", skills: ["Copywriting", "Content Writing"], deliverables: [
    { id: "articles", name: "Bài viết", fields: [{ id: "channel", label: "Kênh và đối tượng đọc", hint: "Website, blog, Facebook; đối tượng mục tiêu" }, { id: "tone", label: "Giọng văn", hint: "Thân thiện, chuyên gia, trẻ trung…" }, { id: "length", label: "Số bài và độ dài", hint: "Ví dụ: 4 bài, mỗi bài 800–1.000 từ" }] },
    { id: "script", name: "Kịch bản", fields: [{ id: "script-scope", label: "Số lượng, thời lượng và giọng điệu", hint: "Ví dụ: 3 kịch bản video 60 giây, kể chuyện gần gũi" }] },
  ] },
  { id: "strategy", name: "Chiến lược & định hướng sáng tạo", description: "Ý tưởng, hướng hình ảnh và kế hoạch triển khai", skills: ["Creative Strategy", "Art Direction"], deliverables: [
    { id: "creative-direction", name: "Định hướng sáng tạo", fields: [{ id: "objectives", label: "Mục tiêu và đầu ra", hint: "Vấn đề cần giải quyết, concept, moodboard, bản trình bày" }] },
    { id: "campaign-plan", name: "Kế hoạch chiến dịch", fields: [{ id: "channels", label: "Kênh, thời gian và phạm vi kế hoạch", hint: "Đối tượng mục tiêu, kênh triển khai, timeline và mức độ chi tiết" }] },
  ] },
];
export const creativeTemplateVersion = "creative-v1";
