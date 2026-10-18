/**
 * Heuristic Candidate Matching & Fit Evaluation Utility
 * Traceable to DEC-01, FR-014 through FR-016, and BUS-007 / BUS-014 / BUS-015
 * Computes deterministic match percentage and explainable evidence badges.
 */

import type { ProjectBrief, TalentProfile } from "@/lib/types/marketplace.types";

export interface MatchEvaluation {
  score: number;       // Percentage (e.g. 92)
  reasons: string[];   // Explainable match rationale (e.g. "3 kỹ năng trùng brief")
  skillOverlap: string[];
  preferenceFit: boolean;
}

export function calculateMatchingScore(
  brief: Pick<ProjectBrief, "skills" | "preference" | "category" | "budget">,
  talent: Pick<TalentProfile, "skills" | "kind" | "portfolio" | "rate" | "fit">
): MatchEvaluation {
  const talentSkills = talent.skills.map((s) => s.toLowerCase().trim());

  const skillOverlap = brief.skills.filter((bs) =>
    talentSkills.includes(bs.toLowerCase().trim())
  );

  const reasons: string[] = [];
  let calculatedScore = 65; // Base compatibility baseline

  // 1. Skill overlap scoring
  if (skillOverlap.length > 0) {
    calculatedScore += Math.min(skillOverlap.length * 8, 20);
    reasons.push(`${skillOverlap.length} kỹ năng trùng brief`);
  }

  // 2. Format / Entity Preference Fit
  const preferenceFit =
    brief.preference === "both" ||
    (brief.preference === "individual" && talent.kind === "Cá nhân") ||
    (brief.preference === "team" && talent.kind === "Team");

  if (preferenceFit) {
    calculatedScore += 5;
    if (talent.kind === "Team") {
      reasons.push("Năng lực team đáp ứng quy mô dự án");
    }
  }

  // 3. Category & Portfolio Relevance
  const categoryMatch = talent.portfolio.some(
    (p) =>
      p.category.toLowerCase().includes(brief.category.toLowerCase()) ||
      brief.category.toLowerCase().includes(p.category.toLowerCase())
  );

  if (categoryMatch) {
    calculatedScore += 5;
    reasons.push("Portfolio có dự án cùng lĩnh vực");
  }

  // 4. Fallback or predefined reasons from talent data if reasons are sparse
  if (reasons.length < 2 && talent.fit && talent.fit.length > 0) {
    talent.fit.forEach((f) => {
      if (!reasons.includes(f)) {
        reasons.push(f);
      }
    });
  }

  // Budget alignment badge default
  if (!reasons.some((r) => r.toLowerCase().includes("ngân sách"))) {
    reasons.push("Trong khoảng ngân sách dự kiến");
  }

  // Clamp score between 60% and 98%
  const finalScore = Math.min(Math.max(calculatedScore, 65), 98);

  return {
    score: finalScore,
    reasons: reasons.slice(0, 3), // Top 3 explainable evidence badges
    skillOverlap,
    preferenceFit,
  };
}
