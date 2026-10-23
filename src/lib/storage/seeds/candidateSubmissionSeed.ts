import type { CandidateSubmission } from "@/lib/types/marketplace.types";
import { talentPortfolioSeeds } from "./portfolioSeed";
import { resumeSeedsByTalent } from "./resumeSeed";

function submission(talentId: string, ids: string[], submittedAt: string): CandidateSubmission {
  const cv = talentId === "minh-anh" ? resumeSeedsByTalent[talentId]?.[0] : undefined;
  return {
    portfolioWorks: (talentPortfolioSeeds[talentId] ?? []).filter(work => ids.includes(work.id)),
    resume: cv ? { id: `demo-${cv.id}-${talentId}`, name: cv.name, mimeType: "application/pdf", fileId: `seed:${cv.asset}` } : undefined,
    applicantIdentity: talentId === "may-creative" || talentId === "studio-dau" ? "team" : "individual",
    submittedAt,
  };
}

export const candidateSubmissionSeeds: Record<string, CandidateSubmission> = {
  c1: submission("minh-anh", ["moc", "herbe"], "2026-10-18T09:42:00.000Z"),
  c2: submission("may-creative", ["lala-id", "som-campaign"], "2026-10-17T16:20:00.000Z"),
  c3: submission("khanh-linh", ["tia-brandbook"], "2026-10-15T11:08:00.000Z"),
  c4: submission("ha-vy", ["nau-market"], "2026-09-28T14:15:00.000Z"),
  c5: submission("studio-dau", ["mua-vi"], "2026-09-29T09:30:00.000Z"),
};
