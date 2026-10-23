import { Avatar, Box } from "@mui/material";
import { Link } from "react-router";
import { ArrowUpRight, FolderOpen } from "lucide-react";
import { useTalentPortfolio } from "@/lib/hooks/useTalentPortfolio";
import { talentProfilePath, talentWorkPath } from "@/lib/utils/portfolioPaths";
import type { Work } from "@/lib/types/portfolio.types";

interface TalentPortfolioPreviewProps {
  talentId: string;
  talentName: string;
  submittedWorks?: Work[];
}

export function TalentPortfolioPreview({ talentId, talentName, submittedWorks }: TalentPortfolioPreviewProps) {
  const { works: profileWorks } = useTalentPortfolio(talentId);
  const works = submittedWorks ?? profileWorks;
  const previewWorks = works.filter(work => work.media.some(media => media.kind === "image")).slice(0, 2);
  return <Box className="flex w-fit max-w-full items-center gap-2.5 rounded-full bg-[#f4f3f1] py-2 pl-2 pr-3.5">
    {previewWorks.length ? <div className="flex shrink-0 items-center -space-x-2">
      {previewWorks.map(work => <Box key={work.id} component={Link} to={talentWorkPath(talentId, work.id)} aria-label={`Xem portfolio: ${work.title}`} title={work.title} sx={{ position: "relative", borderRadius: "50%", "&:hover, &:focus-visible": { zIndex: 1, outline: "2px solid", outlineColor: "primary.main", outlineOffset: 1 } }}>
        <Avatar src={work.media.find(media => media.kind === "image")?.src} alt={work.title} sx={{ width: 38, height: 38, border: "2px solid white", bgcolor: "#e6e5e0", color: "text.primary", fontSize: 11 }}>{work.brand.slice(0, 2)}</Avatar>
      </Box>)}
    </div> : <Box className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-[#747773]"><FolderOpen size={17} aria-hidden="true" /></Box>}
    <Link to={talentProfilePath(talentId)} className="group flex min-h-9 min-w-0 items-center gap-2 text-xs text-[#62665f] hover:text-[#bd3d14]" aria-label={`Xem portfolio của ${talentName}, ${works.length} tác phẩm`}>
      <span className="whitespace-nowrap font-medium">{works.length ? `${works.length} tác phẩm` : "Xem hồ sơ"}</span>
      <ArrowUpRight size={14} className="shrink-0 text-[#747773] group-hover:text-[#bd3d14]" aria-hidden="true" />
    </Link>
  </Box>;
}
