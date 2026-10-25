import { useState } from "react";
import { Link } from "react-router";
import { Box, Button, Checkbox, Chip, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Typography } from "@mui/material";
import { ArrowLeft, ArrowRight, Pencil, Plus } from "lucide-react";
import { usePortfolio } from "@/lib/hooks/usePortfolio";
import { useFreelancer } from "@/lib/hooks/useFreelancer";
import type { TalentProfile } from "@/lib/types/marketplace.types";
import type { Work } from "@/lib/types/portfolio.types";
import { useProfilePresentation } from "@/lib/hooks/useProfilePresentation";
import { PortfolioCover } from "../components/PortfolioCover";
import { PortfolioEditor } from "../components/PortfolioEditor";

function PortfolioManager({ talent }: { talent: TalentProfile }) {
  const { works, setWorks } = usePortfolio();
  const { profile, setProfile } = useProfilePresentation(talent.id, {
    name: talent.name, role: talent.role, location: talent.location, availability: talent.availability,
    about: talent.about, skills: talent.skills,
    featuredIds: works.filter(work => work.visibility === "public").slice(0, 3).map(work => work.id),
  });
  const [editor, setEditor] = useState<{ work: Work | null } | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [selection, setSelection] = useState<string[]>([]);
  const publicWorks = works.filter(work => work.visibility === "public");
  const featuredIds = profile.featuredIds.filter(id => publicWorks.some(work => work.id === id));
  return <Box component="main" id="main" sx={{ maxWidth: 1440, mx: "auto", p: { xs: "24px 16px", md: "24px 32px 64px" }, "& .MuiButton-root": { minHeight: 44, textTransform: "none", fontWeight: 700 }, "& .MuiButton-contained": { bgcolor: "primary.dark" }, "& .MuiButton-outlined": { borderColor: "text.secondary", color: "text.primary" } }}>
    <Button component={Link} to="/profile" startIcon={<ArrowLeft size={17} />} sx={{ mb: 2 }}>Về hồ sơ cá nhân</Button>
    <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 2, mb: 3 }}>
      <Box><Typography component="h1" variant="h4">Quản lý portfolio cá nhân</Typography><Typography color="text.secondary" sx={{ mt: 1 }}>Thêm, chỉnh sửa tác phẩm và chọn tối đa 3 tác phẩm công khai để giới thiệu trên hồ sơ.</Typography></Box>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}><Button variant="outlined" onClick={() => { setSelection(featuredIds); setPickerOpen(true); }}>Chọn tác phẩm nổi bật</Button><Button variant="contained" startIcon={<Plus size={17} />} onClick={() => setEditor({ work: null })}>Thêm tác phẩm</Button></Box>
    </Box>
    {works.length ? <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", xl: "repeat(3, minmax(0, 1fr))" }, gap: 3 }}>{works.map(work => <Box component="article" key={work.id} sx={{ bgcolor: "background.paper", border: "2px solid", borderColor: "text.secondary", borderRadius: "13px", overflow: "hidden", minWidth: 0 }}>
      <Box component={Link} to={`/profile/portfolio/${encodeURIComponent(work.id)}`} className="portfolio-card" sx={{ display: "block", "&:focus-visible": { outline: "3px solid", outlineColor: "primary.dark", outlineOffset: -3 } }} aria-label={`Xem tác phẩm ${work.title}`}><PortfolioCover work={work} /></Box>
      <Box sx={{ p: 2.5 }}><Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1.5 }}><Chip size="small" variant="outlined" label={work.visibility === "public" ? "Công khai" : work.visibility === "private" ? "Riêng tư" : "Qua liên kết"} />{featuredIds.includes(work.id) && <Chip size="small" label={`Nổi bật ${featuredIds.indexOf(work.id) + 1}`} sx={{ bgcolor: "#fff0e9", color: "primary.dark" }} />}</Box>
        <Typography component="h2" sx={{ fontSize: 18, fontWeight: 700 }}>{work.title.replace(/[—–]/g, "-")}</Typography><Typography color="text.secondary" sx={{ mt: .5 }}>{work.category}</Typography><Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}><Button component={Link} to={`/profile/portfolio/${encodeURIComponent(work.id)}`} variant="contained" endIcon={<ArrowRight size={16} />} aria-label={`Xem chi tiết tác phẩm ${work.title}`}>Xem chi tiết</Button><Button variant="outlined" startIcon={<Pencil size={16} />} onClick={() => setEditor({ work })}>Chỉnh sửa</Button></Box>
      </Box>
    </Box>)}</Box> : <Box sx={{ p: 4, border: "2px dashed", borderColor: "text.secondary", borderRadius: "13px" }}><Typography component="h2" variant="h6">Chưa có tác phẩm</Typography><Typography color="text.secondary">Bấm Thêm tác phẩm để bắt đầu xây dựng portfolio.</Typography></Box>}
    <Dialog open={pickerOpen} onClose={() => setPickerOpen(false)} fullWidth maxWidth="sm"><DialogTitle>Chọn tối đa 3 tác phẩm nổi bật</DialogTitle><DialogContent><Typography sx={{ mb: 2 }} color="text.secondary">Thứ tự chọn là thứ tự hiển thị trên hồ sơ. Chỉ tác phẩm công khai được chọn.</Typography>{publicWorks.length ? publicWorks.map(work => <FormControlLabel key={work.id} sx={{ display: "flex", mb: 1 }} control={<Checkbox checked={selection.includes(work.id)} disabled={!selection.includes(work.id) && selection.length >= 3} onChange={(_, checked) => setSelection(current => checked ? [...current, work.id] : current.filter(id => id !== work.id))} />} label={`${selection.includes(work.id) ? `${selection.indexOf(work.id) + 1}. ` : ""}${work.title.replace(/[—–]/g, "-")}`} />) : <Typography>Chưa có tác phẩm công khai để chọn.</Typography>}</DialogContent><DialogActions><Button onClick={() => setPickerOpen(false)}>Hủy</Button><Button variant="contained" onClick={() => { setProfile(current => ({ ...current, featuredIds: selection })); setPickerOpen(false); }}>Lưu lựa chọn</Button></DialogActions></Dialog>
    {editor && <PortfolioEditor work={editor.work} onClose={() => setEditor(null)} onSave={work => { setWorks(current => current.some(item => item.id === work.id) ? current.map(item => item.id === work.id ? work : item) : [work, ...current]); setEditor(null); }} onDelete={id => { setWorks(current => current.filter(work => work.id !== id)); setProfile(current => ({ ...current, featuredIds: current.featuredIds.filter(item => item !== id) })); setEditor(null); }} />}
  </Box>;
}

export default function PortfolioManagerPage() {
  const { currentTalent } = useFreelancer();
  return currentTalent ? <PortfolioManager key={currentTalent.id} talent={currentTalent} /> : <Box sx={{ p: 4 }}><Typography>Không tìm thấy hồ sơ.</Typography></Box>;
}
