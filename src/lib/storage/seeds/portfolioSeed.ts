import type { TalentPortfolioItem } from "@/lib/types/marketplace.types";
import type { Work } from "@/lib/types/portfolio.types";
import stitchImages from "./portfolioImages.json";

export const initialWorks: Work[] = [
  { id: "moc", title: "Nhận diện thương hiệu Mộc Coffee", brand: "mộc.", category: "Brand identity", role: "Lead Designer", description: "Xây dựng định hướng hình ảnh, logo và hệ thống bao bì cho thương hiệu cà phê Việt. Mộc mạc, gần gũi và đậm bản sắc.", date: "2024-08", team: "Collective Studio", tags: ["Brand Identity", "Packaging", "Typography"], views: 1200, likes: 84, contribution: "Brand Direction, Logo system, Bao bì phin & túi giấy.", url: "", visibility: "public", media: [1, 6, 7, 8].map(index => ({ id: `stitch-${index}`, src: stitchImages[index].src, alt: stitchImages[index].alt, kind: "image" as const })), theme: "coffee" },
  { id: "fintech", title: "FinTech App — Quản lý dòng tiền SME", brand: "flow", category: "Digital product", role: "Product Designer", description: "Nghiên cứu trải nghiệm, thiết kế hệ thống giao diện và hơn 30 màn hình giúp doanh nghiệp quản lý dòng tiền rõ ràng hơn.", date: "2024-05", team: "Cá nhân", tags: ["UI/UX", "Mobile App", "Figma"], views: 960, likes: 52, contribution: "UX Research, Design System, High-fidelity UI hơn 30 màn hình.", url: "", visibility: "public", media: [2].map(index => ({ id: `stitch-${index}`, src: stitchImages[index].src, alt: stitchImages[index].alt, kind: "image" as const })), theme: "finance" },
  { id: "herbe", title: "Bộ nhận diện & bao bì L’Herbe", brand: "L’Herbe", category: "Packaging design", role: "Art Director", description: "Định hướng hình ảnh, thiết kế bao bì và hướng dẫn in ấn cho dòng mỹ phẩm thuần chay lấy cảm hứng từ thiên nhiên.", date: "2023-11", team: "Collective Studio", tags: ["Packaging", "Art Direction", "3D Render"], views: 1500, likes: 118, contribution: "Visual Concept, 3D Mockup, Hướng dẫn in ấn.", url: "", visibility: "public", media: [3].map(index => ({ id: `stitch-${index}`, src: stitchImages[index].src, alt: stitchImages[index].alt, kind: "image" as const })), theme: "herbe" },
  { id: "freelance", title: "Freelance Hub — Kết nối sáng tạo", brand: "make it happen.", category: "Web experience", role: "UI/UX Designer", description: "Thiết kế trải nghiệm tìm kiếm cơ hội và quản lý công việc cho cộng đồng freelancer sáng tạo.", date: "2023-09", team: "Cá nhân", tags: ["Web Design", "UI/UX"], views: 480, likes: 29, contribution: "UX Research, Wireframe, Thiết kế giao diện và prototype.", url: "", visibility: "public", media: [4].map(index => ({ id: `stitch-${index}`, src: stitchImages[index].src, alt: stitchImages[index].alt, kind: "image" as const })), theme: "hub" },
  { id: "saigon", title: "Sài Gòn phố — Editorial design", brand: "SÀI GÒN\nPHỐ", category: "Editorial design", role: "Graphic Designer", description: "Ấn phẩm kể những câu chuyện đời thường của Sài Gòn qua bố cục chữ và nhịp điệu hình ảnh.", date: "2023-06", team: "Cá nhân", tags: ["Editorial", "Typography"], views: 260, likes: 16, contribution: "Grid layout, Typography hierarchy, Chỉnh lý hình ảnh in ấn.", url: "", visibility: "public", media: [5].map(index => ({ id: `stitch-${index}`, src: stitchImages[index].src, alt: stitchImages[index].alt, kind: "image" as const })), theme: "editorial" },
];

interface PortfolioSeed {
  id: string;
  brand: string;
  title: string;
  category: string;
  description: string;
  contribution: string;
  date: string;
  tags: string[];
  role: string;
}
function work(seed: PortfolioSeed, team = "Cá nhân"): Work {
  return { ...seed, team, views: 0, likes: 0, theme: "brand", url: "", visibility: "public", media: [] };
}

// Ownership is explicit. IDs are stable and shared by candidate evidence and profile routes.
// Other owners use text-only demo works; only Minh Anh retains the existing image portfolio.
export const talentPortfolioSeeds: Record<string, Work[]> = {
  "minh-anh": initialWorks,
  "may-creative": [
    work({ id: "lala-id", brand: "Lala", title: "Lala — Hệ nhận diện studio gốm", category: "Brand identity", description: "Hệ nhận diện cho studio gốm thủ công, từ logo và bảng màu đến nhãn sản phẩm và tài liệu giới thiệu.", contribution: "Team Mây phụ trách định hướng hình ảnh, hệ logo và ứng dụng nhận diện. Đại diện team phụ trách art direction và trình bày phương án.", role: "Art Director & Lead Designer", date: "2026-06", tags: ["Brand identity", "Art direction", "Packaging"] }, "Mây Creative"),
    work({ id: "som-campaign", brand: "Sớm", title: "Sớm — Hình ảnh chiến dịch ra mắt", category: "Campaign design", description: "Hệ thống hình ảnh ra mắt cho một thương hiệu đồ uống với mẫu bài đăng và bố cục quảng bá nhất quán.", contribution: "Team thực hiện key visual và bộ mẫu social; người đại diện phụ trách visual identity và kiểm tra tính nhất quán.", role: "Visual Identity", date: "2026-03", tags: ["Social design", "Art direction"] }, "Mây Creative"),
  ],
  "khanh-linh": [
    work({ id: "tia-brandbook", brand: "Tía", title: "Tía — Cẩm nang thương hiệu", category: "Brandbook", description: "Cẩm nang sử dụng logo, màu sắc, kiểu chữ và ứng dụng cơ bản cho một thương hiệu thời trang nhỏ.", contribution: "Thiết kế hệ chữ, quy tắc logo và toàn bộ bố cục brandbook.", role: "Brand Designer", date: "2026-05", tags: ["Brand identity", "Typography", "Guideline"] }),
    work({ id: "net-studio-vi", brand: "Nét Studio", title: "Nét Studio — Nhận diện sáng tạo", category: "Visual identity", description: "Bộ nhận diện tối giản phục vụ website, danh thiếp và hồ sơ giới thiệu studio.", contribution: "Phát triển logo, hệ lưới và mẫu tài liệu giới thiệu.", role: "Visual Designer", date: "2026-02", tags: ["Brand identity", "Typography"] }),
  ],
  "ha-vy": [
    work({ id: "nau-market", brand: "Nâu Market", title: "Nâu Market — Bao bì thực phẩm", category: "Packaging design", description: "Bộ nhãn và bao bì cho cửa hàng thực phẩm thủ công, chú trọng phân loại sản phẩm và tính dễ đọc.", contribution: "Thiết kế cấu trúc thông tin trên nhãn, minh họa nguyên liệu và bộ mẫu bao bì.", role: "Packaging Designer", date: "2026-07", tags: ["Packaging", "Illustration"] }),
    work({ id: "ri-rao", brand: "Rì Rào", title: "Rì Rào — Nhận diện cửa hàng lifestyle", category: "Brand identity", description: "Hình ảnh thương hiệu lấy cảm hứng từ thiên nhiên cho cửa hàng sản phẩm sử dụng hằng ngày.", contribution: "Phụ trách logo, bảng màu, họa tiết minh họa và nhãn treo sản phẩm.", role: "Brand Designer", date: "2026-04", tags: ["Brand identity", "Illustration"] }),
  ],
  "studio-dau": [
    work({ id: "mua-vi", brand: "Mùa", title: "Mùa — Nhận diện nông sản", category: "Brand identity", description: "Bộ nhận diện và hệ nhãn cho sản phẩm nông nghiệp theo mùa.", contribution: "Studio Dâu thực hiện chiến lược hình ảnh, logo và thiết kế nhãn; đại diện team phụ trách định hướng sáng tạo.", role: "Creative Lead", date: "2026-06", tags: ["Brand identity", "Packaging"] }, "Studio Dâu"),
    work({ id: "cham-camp", brand: "Chạm", title: "Chạm — Chiến dịch sản phẩm thủ công", category: "Campaign design", description: "Bộ hình ảnh giới thiệu sản phẩm thủ công trên các kênh truyền thông số.", contribution: "Team phát triển key visual và bộ social; đại diện team phụ trách art direction.", role: "Art Director", date: "2026-01", tags: ["Campaign", "Art direction"] }, "Studio Dâu"),
  ],
};

export function portfolioEvidence(talentId: string): TalentPortfolioItem[] {
  return (talentPortfolioSeeds[talentId] ?? []).filter(item => item.visibility === "public").map(item => ({
    id: item.id, title: item.title, category: item.category, color: "#f2f3f0",
    imageUrl: item.media.find(media => media.kind === "image")?.src,
    attribution: talentId === "may-creative" || talentId === "studio-dau" ? "Team" : "Cá nhân",
    teamRole: item.team !== "Cá nhân" ? item.role : undefined,
  }));
}

