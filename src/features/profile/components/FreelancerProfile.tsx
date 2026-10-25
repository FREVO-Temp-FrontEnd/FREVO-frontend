import { useState, type ReactNode } from "react";
import { Link } from "react-router";
import { Avatar, Box, Button, Chip, Dialog, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import { ArrowRight, MapPin, X } from "lucide-react";
import type { TalentProfile } from "@/lib/types/marketplace.types";
import type { Work } from "@/lib/types/portfolio.types";
import { talentWorkPath } from "@/lib/utils/portfolioPaths";
import { useProfilePresentation } from "@/lib/hooks/useProfilePresentation";
import { PortfolioCover } from "./PortfolioCover";
import profileImages from "@/lib/storage/seeds/portfolioImages.json";

const panel = { bgcolor: "background.paper", border: "2px solid", borderColor: "text.secondary", borderRadius: "13px", p: { xs: 2, sm: 3 } };

export function FreelancerProfile({ talent, works, owner = false, actions }: {
  talent: TalentProfile;
  works: Work[];
  owner?: boolean;
  actions?: ReactNode;
}) {
  const { profile } = useProfilePresentation(talent.id, {
    name: talent.name, role: talent.role, location: talent.location,
    availability: talent.availability, about: talent.about, skills: talent.skills,
    featuredIds: works.filter(work => work.visibility === "public").slice(0, 3).map(work => work.id),
  });
  const [allOpen, setAllOpen] = useState(false);
  const publicWorks = works.filter(work => work.visibility === "public");
  const featured = profile.featuredIds.flatMap(id => {
    const work = publicWorks.find(item => item.id === id);
    return work ? [work] : [];
  }).slice(0, 3);
  const workPath = (id: string) => owner ? `/profile/portfolio/${encodeURIComponent(id)}` : talentWorkPath(talent.id, id);
  const workCard = (work: Work, wide = false) => <Box key={work.id} sx={{ minWidth: 0, gridColumn: { xs: "auto", md: wide ? "1 / -1" : "auto" } }}>
    <Box component={Link} to={workPath(work.id)} className="portfolio-card" sx={{ display: "block", textDecoration: "none", color: "text.primary", border: "1px solid", borderColor: "text.secondary", borderRadius: "13px", overflow: "hidden", "&:hover": { borderColor: "primary.dark" }, "&:focus-visible": { outline: "3px solid", outlineColor: "primary.dark", outlineOffset: 3 }, ...(wide ? { "& > div:first-of-type": { aspectRatio: { xs: "1.55", md: "2.6" } } } : {}) }}>
      <PortfolioCover work={work} />
      <Box sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}><Box sx={{ minWidth: 0 }}><Typography component="h3" sx={{ fontSize: 18, fontWeight: 700 }}>{work.title.replace(/[—–]/g, "-")}</Typography><Typography color="text.secondary" sx={{ fontSize: 14, mt: .5 }}>{work.category}</Typography></Box><ArrowRight size={20} aria-hidden="true" /></Box>
    </Box>
  </Box>;

  return <Box component={owner ? "main" : "section"} id="profile-content" sx={{ maxWidth: 1440, mx: "auto", p: { xs: "24px 16px 40px", md: "24px 32px 64px" }, display: "grid", gap: 2.5,
    "& .MuiButton-root": { minHeight: 44, fontWeight: 700, whiteSpace: "nowrap", textTransform: "none" },
    "& .MuiButton-outlined, & .MuiIconButton-root": { border: "1px solid", borderColor: "text.secondary", color: "text.primary" },
    "& .MuiIconButton-root": { borderRadius: "10px", width: 44, height: 44 },
    "& .MuiButton-contained": { bgcolor: "primary.dark", color: "#fff", "&:hover": { bgcolor: "#9f310f" } },
    "& button:focus-visible, & a:focus-visible": { outline: "3px solid", outlineColor: "primary.dark", outlineOffset: 3 },
    "& button:active": { transform: "translateY(1px)" },
  }}>
    <Box component="section" aria-labelledby="profile-name" sx={{ ...panel, p: 0, overflow: "hidden" }}>
      <Box component="img" src="/assets/nang-studio-brief.webp" alt="Không gian sáng tạo" sx={{ display: "block", width: "100%", height: { xs: 110, sm: 170 }, objectFit: "cover" }} />
      <Box sx={{ px: { xs: 2, sm: 3 }, pb: 3, display: "flex", flexWrap: "wrap", gap: 3, alignItems: "center" }}>
        <Avatar src={talent.avatar ?? (talent.id === "minh-anh" ? profileImages[0].src : undefined)} alt={profile.name} sx={{ width: { xs: 96, sm: 144 }, height: { xs: 96, sm: 144 }, mt: -4, border: "5px solid", borderColor: "background.paper", bgcolor: talent.color, color: "text.primary" }}>{talent.initials}</Avatar>
        <Box sx={{ flex: "1 1 250px", pt: 2 }}><Typography id="profile-name" component="h1" sx={{ fontSize: { xs: 28, sm: 36 }, fontWeight: 800 }}>{profile.name}</Typography><Typography sx={{ fontSize: 18, mt: .5 }}>{profile.role}</Typography><Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 2, mt: 1.5 }}><Typography sx={{ display: "flex", gap: .5, alignItems: "center", fontSize: 14 }}><MapPin size={16} />{profile.location}</Typography><Chip label={profile.availability} variant="outlined" size="small" /></Box></Box>
        {!owner && actions && <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, pt: 2 }}>{actions}</Box>}
      </Box>
    </Box>
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr)", lg: "minmax(280px, 1fr) minmax(0, 2.2fr)" }, gap: 2.5, alignItems: "start" }}>
    <Box sx={{ display: "grid", gap: 2.5, minWidth: 0 }}>
    <Box component="section" aria-labelledby="profile-about" sx={panel}><Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}><Typography id="profile-about" component="h2" variant="h5" sx={{ fontWeight: 700 }}>Giới thiệu</Typography></Box><Typography sx={{ lineHeight: 1.75, whiteSpace: "pre-line", maxWidth: "90ch" }}>{profile.about || "Chưa có giới thiệu."}</Typography></Box>
    <Box component="section" aria-labelledby="profile-skills" sx={panel}><Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}><Typography id="profile-skills" component="h2" variant="h5" sx={{ fontWeight: 700 }}>Các kỹ năng chuyên môn</Typography></Box><Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>{profile.skills.length ? profile.skills.map(skill => <Chip key={skill} label={skill} variant="outlined" />) : <Typography color="text.secondary">Chưa cập nhật kỹ năng.</Typography>}</Box></Box>
    </Box>
    <Box component="section" aria-labelledby="profile-portfolio" sx={{ ...panel, minWidth: 0 }}>
      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 2, mb: 2 }}><Typography id="profile-portfolio" component="h2" variant="h5" sx={{ fontWeight: 700 }}>Portfolio nổi bật</Typography></Box>
      {featured.length ? <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" }, gap: 2 }}>{featured.map((work, index) => workCard(work, featured.length === 3 && index === 2))}</Box> : <Typography sx={{ py: 4 }} color="text.secondary">{owner ? "Chọn tác phẩm công khai trong mục Quản lý portfolio cá nhân để giới thiệu tại đây." : "Chưa có tác phẩm nổi bật."}</Typography>}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}><Button variant="outlined" onClick={() => setAllOpen(true)}>Xem thêm</Button></Box>
    </Box>
    </Box>
    <Typography sx={{ fontSize: 12, textAlign: "center" }} color="text.secondary">Hồ sơ và tác phẩm minh họa trong bản demo FREVO.</Typography>
    <Dialog open={allOpen} onClose={() => setAllOpen(false)} fullWidth maxWidth="lg"><DialogTitle sx={{ pr: 8 }}>Portfolio của {profile.name}<IconButton aria-label="Đóng portfolio" onClick={() => setAllOpen(false)} sx={{ position: "absolute", top: 8, right: 12 }}><X size={20} /></IconButton></DialogTitle><DialogContent>{publicWorks.length ? <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" }, gap: 3 }}>{publicWorks.map(work => workCard(work))}</Box> : <Typography>Chưa có tác phẩm công khai.</Typography>}</DialogContent></Dialog>
  </Box>;
}
