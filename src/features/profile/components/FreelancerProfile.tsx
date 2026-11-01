import { useAuthSession } from "@/lib/hooks/useAuthSession";
import { useState, type ReactNode } from "react";
import { Link } from "react-router";
import { Avatar, Box, Button, Chip, Dialog, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import { ArrowRight, MapPin, X } from "lucide-react";
import type { TalentProfile } from "@/lib/types/marketplace.types";
import type { Work } from "@/lib/types/portfolio.types";
import { talentWorkPath, talentProfilePath } from "@/lib/utils/portfolioPaths";
import { useProfilePresentation } from "@/lib/hooks/useProfilePresentation";
import { PortfolioCover } from "./PortfolioCover";
import profileImages from "@/lib/storage/seeds/portfolioImages.json";

const panel = { bgcolor: "background.paper", border: "2px solid", borderColor: "text.secondary", borderRadius: "13px", p: { xs: 2, sm: 3 } };

export function FreelancerProfile({ talent, works, owner = false, actions, embedded = false, applicationContent, workPathFor }: {
  talent: TalentProfile;
  works: Work[];
  owner?: boolean;
  actions?: ReactNode;
  embedded?: boolean;
  applicationContent?: ReactNode;
  workPathFor?: (id: string) => string;
}) {
  const { role } = useAuthSession();
  const { profile: personalProfile } = useProfilePresentation(talent.id, {
    name: talent.name, role: talent.role, location: talent.location,
    availability: talent.availability, about: talent.about, skills: talent.skills,
    featuredIds: works.filter(work => work.visibility === "public").slice(0, 3).map(work => work.id),
  });
  const profile = talent.kind === 'Team' ? { name: talent.name, role: talent.role, location: talent.location, availability: talent.availability, about: talent.about, skills: talent.skills, featuredIds: works.filter(work => work.visibility === 'public' && work.featured).slice(0, 3).map(work => work.id) } : personalProfile;
  const [allOpen, setAllOpen] = useState(false);
  const publicWorks = works.filter(work => work.visibility === "public");
  const featuredIds = profile.featuredIds.length ? profile.featuredIds : talent.kind === "Team" ? publicWorks.slice(0, 3).map(work => work.id) : [];
  const featured = featuredIds.flatMap(id => {
    const work = publicWorks.find(item => item.id === id);
    return work ? [work] : [];
  }).slice(0, 3);
  const workPath = (id: string) => workPathFor ? workPathFor(id) : owner ? `/profile/portfolio/${encodeURIComponent(id)}` : talentWorkPath(talent.id, id);
  const workCard = (work: Work, wide = false) => <Box key={work.id} sx={{ minWidth: 0, gridColumn: { xs: "auto", md: wide ? "1 / -1" : "auto" } }}>
    <Box component={Link} to={workPath(work.id)} className="portfolio-card" sx={{ display: "block", textDecoration: "none", color: "text.primary", border: "1px solid", borderColor: "text.secondary", borderRadius: "13px", overflow: "hidden", "&:hover": { borderColor: "primary.dark" }, "&:focus-visible": { outline: "3px solid", outlineColor: "primary.dark", outlineOffset: 3 }, ...(wide ? { "& > div:first-of-type": { aspectRatio: { xs: "1.55", md: "2.6" } } } : {}) }}>
      <PortfolioCover work={work} />
      <Box sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}><Box sx={{ minWidth: 0 }}><Typography component="h3" sx={{ fontSize: 18, fontWeight: 700 }}>{work.title.replace(/[—–]/g, "-")}</Typography><Typography color="text.secondary" sx={{ fontSize: 14, mt: .5 }}>{work.category}</Typography>{work.isSample && <Chip label="Dữ liệu mẫu" size="small" variant="outlined" sx={{ mt: 1 }} />}{work.contributors?.length ? <Typography color="text.secondary" sx={{ mt: 1, fontSize: 13 }}>{work.contributors.map(person => person.name).join(', ')}</Typography> : null}</Box><ArrowRight size={20} aria-hidden="true" /></Box>
    </Box>
  </Box>;

  return <Box component={owner ? "main" : "section"} id="profile-content" sx={{ maxWidth: 1440, mx: "auto", p: { xs: "24px 16px 40px", md: "24px 32px 64px" }, display: "grid", gap: 2.5,
    ...(embedded && { p: 0, "& > section": { borderWidth: 1, borderColor: "divider" } }),
    "& .MuiButton-root": { minHeight: 44, fontWeight: 700, whiteSpace: "nowrap", textTransform: "none" },
    "& .MuiButton-outlined, & .MuiIconButton-root": { border: "1px solid", borderColor: "text.secondary", color: "text.primary" },
    "& .MuiIconButton-root": { borderRadius: "10px", width: 44, height: 44 },
    "& .MuiButton-contained": { bgcolor: "primary.dark", color: "#fff", "&:hover": { bgcolor: "#9f310f" } },
    "& button:focus-visible, & a:focus-visible": { outline: "3px solid", outlineColor: "primary.dark", outlineOffset: 3 },
    "& button:active": { transform: "translateY(1px)" },
  }}>
    <Box component="section" aria-labelledby="profile-name" sx={{ ...panel, p: 0, overflow: "hidden" }}>
      <Box component="img" src={talent.kind === "Team" ? works[0]?.media.find(item => item.kind === "image")?.src ?? "/assets/nang-studio-brief.webp" : "/assets/nang-studio-brief.webp"} alt={talent.kind === "Team" ? "Hình ảnh portfolio nhóm" : "Không gian sáng tạo"} sx={{ display: "block", width: "100%", height: embedded ? { xs: 80, sm: 110 } : { xs: 110, sm: 170 }, objectFit: "cover" }} />
      <Box sx={{ px: { xs: 2, sm: 3 }, pb: 3, display: embedded ? "grid" : "flex", gridTemplateColumns: embedded ? { xs: "64px minmax(0, 1fr)", sm: "88px minmax(0, 1fr) auto" } : undefined, flexWrap: "wrap", gap: embedded ? 2 : 3, alignItems: "center" }}>
        <Avatar src={talent.avatar ?? (talent.id === "minh-anh" ? profileImages[0].src : undefined)} alt={profile.name} sx={{ width: embedded ? { xs: 64, sm: 88 } : { xs: 96, sm: 144 }, height: embedded ? { xs: 64, sm: 88 } : { xs: 96, sm: 144 }, mt: -4, border: "5px solid", borderColor: "background.paper", bgcolor: talent.color, color: "text.primary" }}>{talent.initials}</Avatar>
        <Box sx={{ flex: "1 1 250px", minWidth: 0, pt: embedded ? 1.5 : 2 }}><Typography id="profile-name" component={embedded ? "h3" : "h1"} sx={{ fontSize: embedded ? { xs: 23, sm: 28 } : { xs: 28, sm: 36 }, fontWeight: 800 }}>{profile.name}</Typography><Typography sx={{ fontSize: 18, mt: .5 }}>{profile.role}</Typography><Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 2, mt: 1.5 }}><Typography sx={{ display: "flex", gap: .5, alignItems: "center", fontSize: 14 }}><MapPin size={16} />{profile.location}</Typography><Chip label={profile.availability} variant="outlined" size="small" /></Box></Box>
        {!owner && actions && <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, pt: embedded ? 0 : 2, gridColumn: embedded ? { xs: 2, sm: "auto" } : undefined }}>{actions}</Box>}
      </Box>
    </Box>
    {applicationContent}
    {talent.kind === 'Team' && <Box component="section" aria-labelledby="team-public-members" sx={panel}>
      <Typography id="team-public-members" component={embedded ? 'h3' : 'h2'} sx={{ fontSize: 21, fontWeight: 700 }}>Đội ngũ của {talent.name}</Typography>
      <Typography color="text.secondary" sx={{ mt: 1, mb: 2, fontSize: 14 }}>Vai trò trong nhóm; phân công cho dự án được thống nhất khi trao đổi.</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2,minmax(0,1fr))', lg: 'repeat(3,minmax(0,1fr))' }, gap: 2 }}>
        {talent.teamMembers?.map(member => <Box key={member.id} sx={{ display: 'flex', gap: 1.5, minWidth: 0, alignItems: 'flex-start' }}><Avatar sx={{ bgcolor: 'action.selected', color: 'primary.dark', width: 44, height: 44, fontSize: 14 }}>{member.name.split(' ').map(part => part[0]).slice(0, 2).join('')}</Avatar><Box sx={{ minWidth: 0 }}>{member.talentId && (role === 'client' || role === 'admin') ? <Typography component={Link} to={talentProfilePath(member.talentId)} sx={{ fontWeight: 700, color: 'text.primary', textUnderlineOffset: 3, overflowWrap: 'anywhere' }}>{member.name}</Typography> : <Typography sx={{ fontWeight: 700, overflowWrap: 'anywhere' }}>{member.name}</Typography>}<Typography color="text.secondary" sx={{ fontSize: 14, mt: .5 }}>{member.role}</Typography>{member.isLeader && <Chip label="Người đại diện" size="small" variant="outlined" sx={{ mt: 1 }} />}</Box></Box>)}
        {!talent.teamMembers?.length && <Typography color="text.secondary">Nhóm chưa cập nhật thành viên công khai.</Typography>}
      </Box>
    </Box>}
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr)", lg: "minmax(280px, 1fr) minmax(0, 2.2fr)" }, gap: 2.5, alignItems: "start" }}>
    <Box sx={{ display: "grid", gap: 2.5, minWidth: 0 }}>
    <Box component="section" aria-labelledby="profile-about" sx={panel}><Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}><Typography id="profile-about" component={embedded ? "h3" : "h2"} variant="h5" sx={{ fontWeight: 700 }}>Giới thiệu</Typography></Box><Typography sx={{ lineHeight: 1.75, whiteSpace: "pre-line", maxWidth: "90ch" }}>{profile.about || "Chưa có giới thiệu."}</Typography></Box>
    <Box component="section" aria-labelledby="profile-skills" sx={panel}><Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}><Typography id="profile-skills" component={embedded ? "h3" : "h2"} variant="h5" sx={{ fontWeight: 700 }}>Các kỹ năng chuyên môn</Typography></Box><Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>{profile.skills.length ? profile.skills.map(skill => <Chip key={skill} label={skill} variant="outlined" />) : <Typography color="text.secondary">Chưa cập nhật kỹ năng.</Typography>}</Box></Box>
    </Box>
    <Box component="section" aria-labelledby="profile-portfolio" sx={{ ...panel, minWidth: 0 }}>
      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 2, mb: 2 }}><Typography id="profile-portfolio" component={embedded ? "h3" : "h2"} variant="h5" sx={{ fontWeight: 700 }}>{embedded ? "Portfolio công khai" : "Portfolio nổi bật"}</Typography></Box>
      {featured.length ? <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" }, gap: 2 }}>{featured.map((work, index) => workCard(work, featured.length === 3 && index === 2))}</Box> : <Typography sx={{ py: 4 }} color="text.secondary">{owner ? "Chọn tác phẩm công khai trong mục Quản lý portfolio cá nhân để giới thiệu tại đây." : "Chưa có tác phẩm nổi bật."}</Typography>}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}><Button variant="outlined" onClick={() => setAllOpen(true)}>Xem thêm</Button></Box>
    </Box>
    </Box>
    <Typography sx={{ fontSize: 12, textAlign: "center" }} color="text.secondary">Hồ sơ và tác phẩm minh họa trong bản demo FREVO.</Typography>
    <Dialog open={allOpen} onClose={() => setAllOpen(false)} fullWidth maxWidth="lg"><DialogTitle sx={{ pr: 8 }}>Portfolio của {profile.name}<IconButton aria-label="Đóng portfolio" onClick={() => setAllOpen(false)} sx={{ position: "absolute", top: 8, right: 12 }}><X size={20} /></IconButton></DialogTitle><DialogContent>{publicWorks.length ? <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" }, gap: 3 }}>{publicWorks.map(work => workCard(work))}</Box> : <Typography>Chưa có tác phẩm công khai.</Typography>}</DialogContent></Dialog>
  </Box>;
}
