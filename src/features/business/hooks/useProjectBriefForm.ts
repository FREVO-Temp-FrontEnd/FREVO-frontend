import type { GuidedBrief } from "@/lib/types/guidedBrief.types";
import { creativeServices, creativeTemplateVersion } from "../data/creativeBriefTemplates";
import { useState } from "react";
import type { ProjectBrief } from "@/lib/types/marketplace.types";

export interface BriefFields {
  heroImage: string;
  tools: string;
  experience: string;
  audience: string;
  requirements: string;
  guidedBrief?: GuidedBrief;
  title: string;
  category: string;
  description: string;
  skills: string[];
  deliverables: string[];
  duration: string;
  budgetMin: string;
  budgetMax: string;
  deadline: string;
  applicationDeadline: string;
  preference: ProjectBrief["preference"];
  referenceFiles: { name: string; size: number }[];
}

export type BriefField = keyof BriefFields;
export type BriefErrors = Partial<Record<BriefField, string>>;

function toInputDate(value?: string) {
  if (!value) return "";
  const [day, month, year] = value.split("/");
  return day && month && year ? `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}` : "";
}

function toDisplayDate(value: string) {
  if (!value) return "";
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

function initialFields(project?: ProjectBrief): BriefFields {
  return {
    heroImage: project?.heroImage ?? "",
    tools: project?.tools?.join(", ") ?? "",
    experience: project?.experience ?? "",
    audience: project?.audience ?? "",
    requirements: project?.requirements?.join("\n") ?? "",
    guidedBrief: project ? (project.guidedBrief ? structuredClone(project.guidedBrief) : undefined) : { serviceId: "brand", templateVersion: creativeTemplateVersion, inScope: "", outOfScope: "", items: [] },
    title: project?.title === "Dự án chưa đặt tên" ? "" : project?.title ?? "",
    category: project?.category ?? creativeServices[0].name,
    description: project?.description ?? "",
    skills: [...(project?.skills ?? [])],
    deliverables: project?.deliverables.length ? [...project.deliverables] : [""],
    duration: project?.duration ?? "4 tuần",
    budgetMin: project?.budgetMin ? String(project.budgetMin) : "",
    budgetMax: project?.budgetMax ? String(project.budgetMax) : "",
    deadline: toInputDate(project?.deadline),
    applicationDeadline: toInputDate(project?.applicationDeadline),
    preference: project?.preference ?? "both",
    referenceFiles: structuredClone(project?.referenceFiles ?? []),
  };
}

function validate(fields: BriefFields, original?: ProjectBrief): BriefErrors {
  const errors: BriefErrors = {};
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  if (fields.heroImage && !/^https:\/\//i.test(fields.heroImage) && !/^\/assets\//.test(fields.heroImage) && !/^data:image\/(jpeg|png|webp);base64,/.test(fields.heroImage)) errors.heroImage = "Dùng ảnh tải lên hoặc liên kết HTTPS hợp lệ.";
  if (!fields.title.trim()) errors.title = "Vui lòng nhập tên dự án.";
  if (!fields.category.trim()) errors.category = "Vui lòng chọn lĩnh vực.";
  if (!fields.description.trim()) errors.description = "Vui lòng mô tả dự án.";
  if (!fields.skills.length) errors.skills = "Hãy thêm ít nhất một kỹ năng.";
  if (!fields.deliverables.some((item) => item.trim())) errors.deliverables = "Hãy thêm ít nhất một sản phẩm bàn giao.";

  const guided = fields.guidedBrief;
  if (guided) {
    const service = creativeServices.find(item => item.id === guided.serviceId);
    const invalidItem = guided.items.some(item => {
      const template = service?.deliverables.find(option => option.id === item.typeId);
      return !template || !item.acceptanceCriteria.trim() || template.fields.some(field => !item.specifications[field.id]?.trim());
    });
    if (!service || !guided.inScope.trim() || !guided.outOfScope.trim() || !guided.items.length || invalidItem) errors.guidedBrief = "Hoàn thiện phạm vi, thông số và tiêu chí nghiệm thu của các hạng mục đã chọn.";
  } else if (!fields.category.trim()) errors.guidedBrief = "Vui lòng chọn loại dịch vụ.";
  const min = Number(fields.budgetMin);
  const max = Number(fields.budgetMax);
  if (!fields.budgetMin || !fields.budgetMax || !Number.isFinite(min) || !Number.isFinite(max) || min <= 0 || max <= 0 || max < min) {
    errors.budgetMin = "Nhập khoảng ngân sách hợp lệ; mức tối đa không nhỏ hơn mức tối thiểu.";
  }

  if (!fields.deadline) errors.deadline = "Vui lòng chọn hạn hoàn thành.";
  else if (fields.deadline <= today && fields.deadline !== toInputDate(original?.deadline)) errors.deadline = "Hạn hoàn thành phải sau hôm nay.";
  if (fields.applicationDeadline && fields.applicationDeadline <= today && fields.applicationDeadline !== toInputDate(original?.applicationDeadline)) {
    errors.applicationDeadline = "Hạn nhận hồ sơ phải sau hôm nay.";
  }
  if (fields.applicationDeadline && fields.deadline && fields.applicationDeadline >= fields.deadline) {
    errors.applicationDeadline = "Hạn nhận hồ sơ phải trước hạn hoàn thành.";
  }
  return errors;
}

export function useProjectBriefForm(existingProject?: ProjectBrief) {
  const [fields, setFields] = useState<BriefFields>(() => initialFields(existingProject));
  const [errors, setErrors] = useState<BriefErrors>({});
  const [skillInput, setSkillInput] = useState("");
  const [isPreview, setIsPreview] = useState(false);

  function setField<K extends BriefField>(field: K, value: BriefFields[K]) {
    setFields((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: field === "guidedBrief" && current.guidedBrief ? validate({ ...fields, [field]: value }, existingProject).guidedBrief : undefined }));
  }

  function addSkill() {
    const skill = skillInput.trim().replace(/,$/, "");
    if (skill && !fields.skills.some((item) => item.toLocaleLowerCase("vi") === skill.toLocaleLowerCase("vi"))) {
      setField("skills", [...fields.skills, skill]);
    }
    setSkillInput("");
  }

  function openPreview() {
    const pendingSkill = skillInput.trim().replace(/,$/, "");
    const preparedFields = pendingSkill && !fields.skills.some((item) => item.toLocaleLowerCase("vi") === pendingSkill.toLocaleLowerCase("vi"))
      ? { ...fields, skills: [...fields.skills, pendingSkill] }
      : fields;
    if (preparedFields !== fields) setFields(preparedFields);
    setSkillInput("");
    const nextErrors = validate(preparedFields, existingProject);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return false;
    setIsPreview(true);
    return true;
  }

  function buildProject(status: "draft" | "published") {
    if (status === "published") {
      const nextErrors = validate(fields, existingProject);
      setErrors(nextErrors);
      if (Object.keys(nextErrors).length) {
        setIsPreview(false);
        return undefined;
      }
    }
    const min = Number(fields.budgetMin);
    const max = Number(fields.budgetMax);
    const hasBudget = min > 0 && max > 0 && max >= min;
    const money = (value: number) => new Intl.NumberFormat("vi-VN").format(value);
    const pendingSkill = skillInput.trim().replace(/,$/, "");
    const skills = pendingSkill && !fields.skills.some((item) => item.toLocaleLowerCase("vi") === pendingSkill.toLocaleLowerCase("vi"))
      ? [...fields.skills, pendingSkill]
      : fields.skills;

    return {
      ...existingProject,
      id: existingProject?.id ?? `project-${Date.now()}`,
      heroImage: fields.heroImage.trim() || undefined,
      tools: fields.tools.trim() ? [...new Set(fields.tools.split(",").map(item => item.trim()).filter(Boolean))] : undefined,
      experience: fields.experience.trim() || undefined,
      audience: fields.audience.trim() || undefined,
      requirements: fields.requirements.trim() ? fields.requirements.split("\n").map(item => item.trim()).filter(Boolean) : undefined,
      guidedBrief: fields.guidedBrief,
      title: fields.title.trim() || "Dự án chưa đặt tên",
      category: fields.category,
      company: existingProject?.company ?? "Nắng Studio",
      remote: existingProject?.remote ?? true,
      description: fields.description.trim(),
      skills,
      deliverables: fields.deliverables.map((item) => item.trim()).filter(Boolean),
      referenceFiles: fields.referenceFiles,
      budget: existingProject && min === existingProject.budgetMin && max === existingProject.budgetMax ? existingProject.budget : hasBudget ? `${money(min)}${min === max ? "" : `–${money(max)}`} VNĐ` : "",
      budgetMin: min > 0 ? min : undefined,
      budgetMax: max > 0 ? max : undefined,
      duration: fields.duration,
      deadline: toDisplayDate(fields.deadline),
      applicationDeadline: toDisplayDate(fields.applicationDeadline),
      preference: fields.preference,
      status,
      createdAt: existingProject?.createdAt ?? new Date().toISOString(),
      publishedAt: status === "published" ? existingProject?.publishedAt ?? new Date().toISOString() : existingProject?.publishedAt,
    } satisfies ProjectBrief;
  }

  const validation = validate(fields, existingProject);
  const sections = [
    { id: "brief-basics", title: "Thông tin cơ bản", complete: !validation.title && !validation.category && !validation.description && !validation.heroImage },
    { id: "brief-guided", title: "Dịch vụ và bàn giao", complete: !validation.guidedBrief },
    { id: "brief-scope", title: "Yêu cầu và bàn giao", complete: !validation.skills && !validation.deliverables && !validation.guidedBrief },
    { id: "brief-budget", title: "Ngân sách và thời hạn", complete: !validation.budgetMin && !validation.deadline && !validation.applicationDeadline },
    { id: "brief-performer", title: "Bên thực hiện", complete: !!fields.preference },
  ];

  return { fields, setField, errors, skillInput, setSkillInput, addSkill, isPreview, setIsPreview, openPreview, buildProject, sections };
}
