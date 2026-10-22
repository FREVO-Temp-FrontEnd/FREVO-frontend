import { Avatar, Box } from "@mui/material";
import { Link } from "react-router";
import { talentWorkPath } from "@/lib/utils/portfolioPaths";
import type { Work } from "@/lib/types/portfolio.types";

export function PortfolioWorkLink({ talentId, work, size = 44, width = size }: { talentId: string; work: Work; size?: number; width?: number }) {
  return <Box component={Link} to={talentWorkPath(talentId, work.id)} aria-label={`Xem portfolio: ${work.title}`} title={work.title} sx={{ display: "block", borderRadius: 1.5, flexShrink: 0, "&:hover": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: 2 }, "&:focus-visible": { outline: "2px solid", outlineColor: "primary.main", outlineOffset: 2 } }}>
    <Avatar variant="rounded" src={work.media.find(item => item.kind === "image")?.src} alt={work.title} sx={{ width, height: size, bgcolor: "#eee8e0", color: "text.primary", fontSize: 12, border: "1px solid", borderColor: "divider" }}>{work.brand.slice(0, 2)}</Avatar>
  </Box>;
}
