import type { Project, ProjectDetails } from "@/lib/types/project.types";
import type { ProjectBrief } from "@/lib/types/marketplace.types";

/**
 * Parses numeric budget min & max (in millions VND) from string or numeric fields.
 */
function parseBudgetValues(brief: ProjectBrief): { min: number; max: number } {
  if (brief.budgetMin && brief.budgetMax) {
    const minM = brief.budgetMin > 1000 ? Math.round(brief.budgetMin / 1_000_000) : brief.budgetMin;
    const maxM = brief.budgetMax > 1000 ? Math.round(brief.budgetMax / 1_000_000) : brief.budgetMax;
    return { min: minM, max: maxM };
  }

  if (brief.budget) {
    const numbers = brief.budget.match(/\d+/g);
    if (numbers && numbers.length >= 2) {
      return { min: parseInt(numbers[0], 10), max: parseInt(numbers[1], 10) };
    }
    if (numbers && numbers.length === 1) {
      const val = parseInt(numbers[0], 10);
      return { min: val, max: val };
    }
  }

  return { min: 15, max: 25 };
}

/**
 * Converts a ProjectBrief domain entity into a full Project model for discovery and detail views.
 */
export function projectBriefToProject(brief: ProjectBrief): Project {
  const { min, max } = parseBudgetValues(brief);
  const createdDate = new Date(brief.createdAt);
  const ageDays = Math.max(1, Math.round((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24)));

  const details: ProjectDetails = {
    heroImage: brief.heroImage || "",
    heroAlt: brief.title,
    heroCaption: brief.category,
    expertise: brief.skills.length > 0 ? brief.skills : ["Thiết kế thương hiệu", "Sáng tạo"],
    tools: brief.tools ?? [],
    experience: brief.experience || "Chưa có yêu cầu kinh nghiệm cụ thể",
    audience: brief.audience || "Ứng viên có năng lực phù hợp với yêu cầu dự án",
    intro: [brief.description],
    scope: brief.guidedBrief ? [{ title: "Trong phạm vi", text: brief.guidedBrief.inScope }, { title: "Ngoài phạm vi", text: brief.guidedBrief.outOfScope }] : brief.deliverables.map(item => ({ title: item, text: "Theo nội dung brief và thỏa thuận hai bên." })),
    requirements: brief.requirements?.length ? brief.requirements : ["Doanh nghiệp chưa bổ sung yêu cầu khác."],
    deliverables: brief.guidedBrief ? brief.guidedBrief.items.map(item => ({ title: item.name, text: [...Object.values(item.specifications), `Tiêu chí nghiệm thu: ${item.acceptanceCriteria}`].filter(Boolean).join("\n") })) : brief.deliverables.map(item => ({ title: item, text: "Chi tiết sẽ được hai bên thống nhất trong thỏa thuận." })),
    benefits: {
      title: "Chính sách hợp tác & Bảo đảm quy trình",
      payments: [
        {
          label: "Thanh toán theo mốc",
          title: "Giải ngân minh bạch (Mô phỏng)",
          description: "Chi phí được phê duyệt và giải ngân độc lập theo từng mốc công việc đã hoàn thành và nghiệm thu."
        },
        {
          label: "Bảo đảm quyền tác giả",
          title: "Bàn giao quyền sử dụng",
          description: "Quyền sở hữu tác phẩm và quyền tác giả được xác lập rõ ràng theo thỏa thuận hợp tác."
        }
      ],
      note: "FREVO cung cấp hạ tầng trao đổi, quản lý mốc và ghi nhận thỏa thuận minh bạch giữa Doanh nghiệp và Bên thực hiện.",
      trustTitle: "Hợp tác an toàn & rõ ràng",
      trustDescription: "Mọi điều khoản về phạm vi, số lượt chỉnh sửa và chi phí đều được hai bên xác nhận trước khi bắt đầu thực hiện."
    },
    documents: [
      {
        title: "Tài liệu tóm tắt dự án (Project Brief)",
        description: "Bản đặc tả phạm vi, mục tiêu thương hiệu và tiêu chuẩn kỹ thuật.",
        kind: "brief"
      }
    ],
    employer: {
      monogram: brief.company.slice(0, 2).toUpperCase(),
      industry: brief.category,
      description: `${brief.company} đăng tuyển dự án trên FREVO.`,
      verified: false,
      teamSize: "Chưa cung cấp",
      completedProjects: "Chưa có dữ liệu",
      rating: "Chưa có đánh giá"
    },
    hiringCount: brief.preference === "team" ? "1 Nhóm sáng tạo" : brief.preference === "individual" ? "1 Freelancer cá nhân" : "1 Cá nhân hoặc Nhóm",
    timeline: [
      {
        date: brief.applicationDeadline || "31/10/2026",
        title: "Hạn nộp hồ sơ ứng tuyển",
        description: "Đóng nhận hồ sơ và hoàn tất xem xét ứng viên."
      },
      {
        date: brief.deadline,
        title: "Hạn bàn giao toàn diện",
        description: "Hoàn tất nghiệm thu sản phẩm cuối cùng."
      }
    ]
  };

  return {
    id: brief.id,
    category: brief.category,
    type: brief.type || "brand",
    age: ageDays,
    title: brief.title,
    company: brief.company,
    city: brief.city || "TP. Hồ Chí Minh",
    remote: brief.remote ?? true,
    min,
    max,
    duration: brief.duration || "4 tuần",
    deadline: brief.deadline,
    skills: brief.skills,
    description: brief.description,
    deliverables: brief.deliverables,
    details
  };
}

/**
 * Merges API static projects with reactive mock storage briefs.
 */
export function mergeProjectsWithStorage(
  apiProjects: Project[],
  storageBriefs: ProjectBrief[]
): Project[] {
  const publicBriefs = storageBriefs.filter(
    (b) => b.status === "published" || b.status === "ongoing" || b.status === "closed"
  );

  const convertedStorageProjects = publicBriefs.map(projectBriefToProject);

  // Map by id to avoid duplicates, with storage taking precedence
  const map = new Map<string, Project>();

  // Add API projects first
  apiProjects.forEach((p) => {
    map.set(p.id, p);
  });

  // Overlay storage projects (they have latest edits/publications)
  convertedStorageProjects.forEach((p) => {
    map.set(p.id, p);
  });

  return Array.from(map.values());
}
