import type { ProjectBrief, TalentProfile } from "@/lib/types/marketplace.types";
import { skillAliases } from "@/lib/config/skillTaxonomy";
import { normalized } from "./formatters";

const clean = (value: string) => normalized(value).trim().replace(/\s+/g, " ");
export function canonicalSkill(value: string): string {
  const text = clean(value);
  return Object.entries(skillAliases).find(([, aliases]) => aliases.some(alias => clean(alias) === text))?.[0] ?? `custom:${text}`;
}
export interface MatchEvaluation {
  /** Count of supported criteria (skills, portfolio category, budget), not a suitability percentage. */
  score: number;
  reasons: string[];
  skillOverlap: string[];
  missingSkills: string[];
  preferenceFit: boolean;
  budget: "overlap" | "outside" | "unknown";
  portfolioRelevant: boolean;
  availability: string;
  availableNow: boolean;
}
export function calculateMatchingScore(
  brief: Pick<ProjectBrief, "skills" | "preference" | "category" | "budget"> & Partial<Pick<ProjectBrief, "budgetMin" | "budgetMax">>,
  talent: Pick<TalentProfile, "skills" | "kind" | "portfolio" | "rate" | "fit"> & Partial<Pick<TalentProfile, "rateMin" | "rateMax" | "availability">>,
): MatchEvaluation {
  const talentSkills = new Set(talent.skills.map(canonicalSkill));
  const requested = [...new Map(brief.skills.filter(skill => skill.trim()).map(skill => [canonicalSkill(skill), skill])).values()];
  const skillOverlap = requested.filter(skill => talentSkills.has(canonicalSkill(skill)));
  const missingSkills = requested.filter(skill => !talentSkills.has(canonicalSkill(skill)));
  const preferenceFit = brief.preference === "both" || (brief.preference === "individual" && talent.kind === "Cá nhân") || (brief.preference === "team" && talent.kind === "Team");
  const category = clean(brief.category);
  const portfolioRelevant = !!category && talent.portfolio.some(work => !!clean(work.category) && canonicalSkill(work.category) === canonicalSkill(brief.category));
  const validRange = (min?: number, max?: number) => Number.isFinite(min) && Number.isFinite(max) && min! > 0 && max! >= min!;
  const budget = validRange(brief.budgetMin, brief.budgetMax) && validRange(talent.rateMin, talent.rateMax)
    ? talent.rateMin! <= brief.budgetMax! && talent.rateMax! >= brief.budgetMin! ? "overlap" : "outside" : "unknown";
  const declared = talent.availability?.trim() ?? "";
  const availability = !declared || /^(chua cap nhat|chua ro|unknown|n\/a|chua cung cap)$/.test(clean(declared)) ? "Chưa cung cấp lịch nhận việc" : declared;
  const availableNow = /^(co the bat dau ngay|san sang nhan viec ngay|san sang bat dau ngay|available now)$/.test(clean(declared));
  const reasons = [
    ...(skillOverlap.length ? [`Khai báo ${skillOverlap.length}/${requested.length} kỹ năng trong brief`] : []),
    ...(portfolioRelevant ? ["Portfolio khai báo cùng lĩnh vực"] : []),
    ...(budget === "overlap" ? ["Khoảng phí tham khảo giao với ngân sách"] : []),
  ];
  return { score: Number(skillOverlap.length > 0) + Number(portfolioRelevant) + Number(budget === "overlap"), reasons, skillOverlap, missingSkills, preferenceFit, budget, portfolioRelevant, availability, availableNow };
}
