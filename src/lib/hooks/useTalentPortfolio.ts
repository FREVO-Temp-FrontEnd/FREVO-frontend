import { useBusiness } from "./useBusiness";
import { usePortfolio } from "./usePortfolio";
import { talentPortfolioSeeds } from "@/lib/storage/seeds/portfolioSeed";

export function useTalentPortfolio(talentId: string) {
  const { talents } = useBusiness();
  const { works: personalWorks } = usePortfolio();
  const talent = talents.find(item => item.id === talentId);
  const works = (talentId === "minh-anh" ? personalWorks : talentPortfolioSeeds[talentId] ?? []).filter(work => work.visibility === "public");
  const previewWorks = works.filter(work => work.media.some(media => media.kind === "image")).slice(0, 2);
  return { talent, works, previewWorks };
}
