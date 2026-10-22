import { Link, useParams } from "react-router";
import type { ReactNode } from "react";
import { Avatar, Box, Button, Chip, Typography } from "@mui/material";
import { ArrowLeft, FolderOpen } from "lucide-react";
import { useTalentPortfolio } from "@/lib/hooks/useTalentPortfolio";
import { talentWorkPath } from "@/lib/utils/portfolioPaths";
import { PortfolioWorkLink } from "@/app/shared/components/PortfolioWorkLink";

export default function TalentPublicProfilePage({ actions }: { actions?: ReactNode }) {
  const { talentId = "" } = useParams();
  const { talent, works } = useTalentPortfolio(talentId);
  if (!talent) return <Box sx={{ py: 6 }}><Typography component="h1" variant="h4">Không tìm thấy hồ sơ</Typography><Button component={Link} to="/business/projects">Về dự án của tôi</Button></Box>;
  return <Box sx={{ maxWidth: 1100, mx: "auto" }}>
    <Button component={Link} to="/business/projects" startIcon={<ArrowLeft size={16} />} sx={{ mb: 3 }}>Dự án của tôi</Button>
    <section className="rounded-3xl border border-[#e4e6e2] bg-white p-5 sm:p-7">
      <div className="flex flex-wrap items-center gap-4"><Avatar src={talent.avatar} alt={talent.name} sx={{ width: 64, height: 64, bgcolor: talent.color, color: "text.primary" }}>{talent.initials}</Avatar><div><div className="flex items-center gap-2"><Typography component="h1" variant="h4" sx={{ fontSize: 28 }}>{talent.name}</Typography><Chip label={talent.kind} size="small" /></div><p className="mt-1 text-sm text-[#747773]">{talent.role} · {talent.location}</p></div></div>
      {actions && <Box sx={{ mt: 2 }}>{actions}</Box>}
      <p className="mt-5 max-w-3xl text-sm leading-6">{talent.about}</p>
      <div className="mt-4 flex flex-wrap gap-2">{talent.skills.map(skill => <Chip key={skill} label={skill} size="small" variant="outlined" />)}</div>
    </section>
    <div className="mb-5 mt-8 flex items-center gap-2"><FolderOpen size={22} aria-hidden="true" /><Typography component="h2" variant="h5" sx={{ fontWeight: 700 }}>Portfolio của {talent.name}</Typography><Chip label={works.length} size="small" /></div>
    {works.length ? <div className="grid gap-4 sm:grid-cols-2">{works.map(work => <article key={work.id} className="rounded-2xl border border-[#e4e6e2] bg-white p-5"><div className="flex items-start gap-4"><PortfolioWorkLink talentId={talent.id} work={work} size={88} /><div className="min-w-0"><Typography component="h3" sx={{ fontSize: 17, fontWeight: 700 }}><Link to={talentWorkPath(talent.id, work.id)}>{work.title}</Link></Typography><p className="mt-1 text-sm text-[#747773]">{work.category}</p><p className="mt-2 text-xs text-[#747773]">{talent.kind === "Team" ? "Dự án của team" : work.team === "Cá nhân" ? "Dự án cá nhân" : "Đóng góp cá nhân trong team"} · {work.role}</p></div></div><p className="mt-4 text-sm leading-6">{work.contribution}</p><Button component={Link} to={talentWorkPath(talent.id, work.id)} sx={{ mt: 1 }}>Xem tác phẩm</Button></article>)}</div> : <Typography color="text.secondary">Chưa có tác phẩm công khai.</Typography>}
    <p className="mt-6 text-xs text-[#747773]">Hồ sơ và tác phẩm mẫu phục vụ demo FREVO.</p>
  </Box>;
}
