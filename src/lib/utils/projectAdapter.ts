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
    heroImage: "/assets/project-placeholder.jpg",
    heroAlt: brief.title,
    heroCaption: brief.category,
    expertise: brief.skills.length > 0 ? brief.skills : ["Thiết kế thương hiệu", "Sáng tạo"],
    tools: ["Figma", "Adobe Creative Cloud", "Illustrator", "Photoshop"],
    experience: "Từ 1–3 năm kinh nghiệm trong lĩnh vực sáng tạo tương ứng",
    audience: "Khách hàng mục tiêu và đối tác truyền thông của thương hiệu",
    intro: [
      brief.description,
      "Dự án yêu cầu bên thực hiện có tư duy thẩm mỹ nhất quán, quy trình làm việc minh bạch và cam kết chất lượng theo từng mốc bàn giao đã thỏa thuận."
    ],
    scope: brief.deliverables.map((item) => ({
      title: item,
      text: `Nghiên cứu định hướng, triển khai phương án thiết kế và hoàn thiện hồ sơ bàn giao tiêu chuẩn cho hạng mục "${item}".`
    })),
    requirements: [
      "Có portfolio chứng minh năng lực thực tế tương thích với yêu cầu brief (BR-002, BR-003).",
      "Chủ động trao đổi, làm rõ yêu cầu và phản hồi kịp thời trong suốt quá trình triển khai.",
      "Cam kết tuân thủ thời hạn mốc bàn giao và chính sách chỉnh sửa đã thống nhất (DEC-03)."
    ],
    deliverables: brief.deliverables.map((item) => ({
      title: item,
      text: "Tệp thiết kế gốc hoàn chỉnh, các định dạng xuất bản chuẩn kỹ thuật số và tài liệu hướng dẫn ứng dụng."
    })),
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
      description: `${brief.company} là đơn vị sáng tạo đăng tuyển dự án trên nền tảng FREVO với hồ sơ doanh nghiệp đã được xác thực thông tin cơ bản.`,
      verified: true,
      teamSize: "5–20 nhân sự",
      completedProjects: "3 dự án",
      rating: "4.9"
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
