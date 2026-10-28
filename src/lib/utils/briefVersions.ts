import type { ProjectBrief } from "@/lib/types/marketplace.types";

export const briefFieldLabels = {
  heroImage: "Ảnh bìa", tools: "Công cụ", experience: "Kinh nghiệm", audience: "Ứng viên phù hợp", requirements: "Yêu cầu bổ sung",
  title: "Tên dự án", category: "Dịch vụ", description: "Mô tả", skills: "Kỹ năng", deliverables: "Sản phẩm bàn giao",
  guidedBrief: "Phạm vi và tiêu chí nghiệm thu", budget: "Ngân sách", budgetMin: "Ngân sách tối thiểu", budgetMax: "Ngân sách tối đa",
  deadline: "Hạn hoàn thành", applicationDeadline: "Hạn tuyển", duration: "Thời lượng", preference: "Bên thực hiện ưu tiên", referenceFiles: "Tệp tham khảo",
} satisfies Partial<Record<keyof ProjectBrief, string>>;
export type BriefContentField = keyof typeof briefFieldLabels;
const materialFields: BriefContentField[] = ["tools", "experience", "audience", "requirements", "category", "description", "skills", "deliverables", "guidedBrief", "budget", "budgetMin", "budgetMax", "deadline", "applicationDeadline", "duration", "preference"];
export function changedBriefFields(before: ProjectBrief, after: ProjectBrief): BriefContentField[] {
  return (Object.keys(briefFieldLabels) as BriefContentField[]).filter(field => JSON.stringify(before[field] ?? null) !== JSON.stringify(after[field] ?? null));
}
export function materialBriefChanges(before: ProjectBrief, after: ProjectBrief) {
  return changedBriefFields(before, after).filter(field => materialFields.includes(field));
}
export function briefSnapshot(project: ProjectBrief): Omit<ProjectBrief, "briefHistory"> {
  const copy = structuredClone(project);
  delete copy.briefHistory;
  return copy;
}
