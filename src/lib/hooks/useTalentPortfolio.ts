import { seededTeamPortfolio, sampleTeamMembers } from "@/lib/storage/seeds/teamPortfolioSeed";
import { publicTeamWorks } from "@/lib/storage/teamPortfolio";
import { useBusiness } from "./useBusiness";
import { usePortfolio } from "./usePortfolio";
import { talentPortfolioSeeds } from "@/lib/storage/seeds/portfolioSeed";

export function useTalentPortfolio(talentId: string) {
  const { talents, teamPortfolios } = useBusiness();
  const { works: personalWorks } = usePortfolio();
  const storedTalent = talents.find(item => item.id === talentId);
  const seededWorks = seededTeamPortfolio(talentId);
  const talent = storedTalent && seededWorks && !storedTalent.teamMembers ? { ...storedTalent, teamMembers: sampleTeamMembers, teamMembersCount: sampleTeamMembers.length } : storedTalent;
  const works = publicTeamWorks(talent?.kind === "Team" ? teamPortfolios[talentId] ?? seededWorks ?? [] : talentId === "minh-anh" ? personalWorks : talentPortfolioSeeds[talentId] ?? []);
  const previewWorks = works.filter(work => work.media.some(media => media.kind === "image")).slice(0, 2);
  return { talent, works, previewWorks };
}
