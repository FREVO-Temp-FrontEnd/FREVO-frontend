import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { Alert, Box, Button, Chip, Dialog, DialogContent, DialogTitle, IconButton, Rating, Typography } from "@mui/material";
import { ArrowLeft, ArrowUpRight, ChevronLeft, ChevronRight, ImageOff, Maximize2, Pencil, X } from "lucide-react";
import { useAuthSession } from "@/lib/hooks/useAuthSession";
import { usePortfolio } from "@/lib/hooks/usePortfolio";
import { useTalentPortfolio } from "@/lib/hooks/useTalentPortfolio";
import { useProfilePresentation } from "@/lib/hooks/useProfilePresentation";
import { talentProfilePath, talentWorkPath } from "@/lib/utils/portfolioPaths";
import type { PortfolioMedia } from "@/lib/types/portfolio.types";
import { PortfolioCover } from "../components/PortfolioCover";
import { PortfolioEditor } from "../components/PortfolioEditor";
import { partnerReviews } from "./portfolio-review-samples";

const clean = (text: string) => text.replace(/[—–]/g, "-");
const sectionBorder = { borderTop: "1px solid", borderColor: "divider" };

function ProjectMedia({ media, priority = false, expanded = false }: { media: PortfolioMedia; priority?: boolean; expanded?: boolean }) {
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(true);
  if (failed) return <Box role="status" sx={{ minHeight: 260, p: 4, display: "grid", placeContent: "center", justifyItems: "center", gap: 2, color: "text.secondary" }}><ImageOff size={28} aria-hidden="true" /><Typography>Không tải được {media.kind === "image" ? "hình ảnh" : "video"}.</Typography><Button variant="outlined" onClick={() => setFailed(false)}>Thử lại</Button></Box>;
  if (media.kind === "video") return <Box component="video" src={media.src} controls preload="metadata" aria-label={media.alt || "Video tác phẩm"} onError={() => setFailed(true)} sx={{ display: "block", width: "100%", maxHeight: expanded ? "80dvh" : "65dvh", bgcolor: "#edf0ea" }} />;
  return <Box sx={{ position: "relative", width: "100%", height: expanded ? "auto" : "100%", bgcolor: "#edf0ea" }}>
    {loading && <Typography role="status" sx={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontSize: 14, color: "#555d55" }}>Đang tải ảnh...</Typography>}
    <Box component="img" src={media.src} alt={media.alt || "Hình ảnh tác phẩm"} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} onLoad={() => setLoading(false)} onError={() => setFailed(true)} sx={{ display: "block", width: "100%", height: expanded ? "auto" : "100%", maxHeight: expanded ? "80dvh" : "none", objectFit: "contain", opacity: loading ? 0 : 1 }} />
  </Box>;
}

export default function PortfolioDetailPage() {
  const { workId, talentId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuthSession();
  const canEdit = !talentId && isAuthenticated && role === "freelancer";
  const { works: personalWorks, setWorks } = usePortfolio();
  const { talent, works: publicWorks } = useTalentPortfolio(talentId ?? "minh-anh");
  const works = talentId ? (talent ? publicWorks : []) : personalWorks;
  const work = works.find(item => item.id === workId);
  const { profile, setProfile } = useProfilePresentation(talentId ?? "minh-anh", {
    name: talent?.name ?? "Minh Anh", role: talent?.role ?? "", location: talent?.location ?? "",
    availability: talent?.availability ?? "", about: talent?.about ?? "", skills: talent?.skills ?? [],
    featuredIds: publicWorks.slice(0, 3).map(item => item.id),
  });
  const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<PortfolioMedia | null>(null);
  const [editing, setEditing] = useState(false);
  const selectedMedia = work?.media.find(item => item.id === selectedMediaId) ?? work?.media[0];
  const selectedMediaIndex = work?.media.findIndex(item => item.id === selectedMedia?.id) ?? -1;
  const moveMedia = (direction: -1 | 1, fromExpanded = false) => {
    if (!work?.media.length) return;
    const currentId = fromExpanded ? expanded?.id : selectedMedia?.id;
    const currentIndex = work.media.findIndex(item => item.id === currentId);
    const next = work.media[(currentIndex + direction + work.media.length) % work.media.length];
    setSelectedMediaId(next.id);
    if (fromExpanded) setExpanded(next);
  };
  const profilePath = talentId ? talentProfilePath(talentId) : "/profile";
  const workPath = (id: string) => talentId ? talentWorkPath(talentId, id) : `/profile/portfolio/${encodeURIComponent(id)}`;
  const reviews = work?.id === "moc" ? partnerReviews : [];
  const related = works.filter(item => item.id !== workId && item.visibility === "public").slice(0, 2);
  const title = work ? clean(work.title) : "Không tìm thấy tác phẩm";
  const externalUrl = work?.url && /^https?:\/\//i.test(work.url) ? work.url : undefined;

  useEffect(() => {
    const previous = document.title;
    document.title = `${title} | FREVO Portfolio`;
    return () => { document.title = previous; };
  }, [title]);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const anchor = ["#work-gallery", "#work-story", "#work-reviews"].includes(location.hash) ? document.getElementById(location.hash.slice(1)) : null;
      if (anchor) anchor.scrollIntoView({ block: "start", behavior: "instant" });
      else window.scrollTo({ top: 0, behavior: "instant" });
    });
    return () => cancelAnimationFrame(frame);
  }, [workId, location.hash]);

  return <Box component={talentId ? "section" : "main"} id="work-main" sx={{ maxWidth: 1240, mx: "auto", p: { xs: "20px 16px 48px", md: "28px 32px 72px" },
    "& .MuiButton-root": { minHeight: 44, fontWeight: 700, whiteSpace: "nowrap", textTransform: "none" },
    "& a:focus-visible, & button:focus-visible": { outline: "3px solid", outlineColor: "primary.dark", outlineOffset: 3 },
    "& section[id]": { scrollMarginTop: "100px" },
  }}>
    <Box sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 1.5, mb: { xs: 2.5, md: 3 } }}>
      <Button variant="outlined" startIcon={<ArrowLeft size={17} aria-hidden="true" />} onClick={() => { if (window.history.state?.idx > 0) navigate(-1); else navigate(profilePath); }} sx={{ borderColor: "text.secondary", color: "text.primary", bgcolor: "background.paper" }}>Quay lại</Button>
      {canEdit && work && <Button variant="contained" startIcon={<Pencil size={17} aria-hidden="true" />} onClick={() => setEditing(true)} sx={{ bgcolor: "primary.dark", "&:hover": { bgcolor: "#9f310f" } }}>Chỉnh sửa dự án</Button>}
    </Box>
    {!work ? <Box sx={{ py: 8 }}><Typography component="h1" variant="h4">Không tìm thấy tác phẩm</Typography><Typography sx={{ mt: 2 }} color="text.secondary">Tác phẩm có thể đã bị xóa hoặc không được phép hiển thị.</Typography></Box> : <>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(260px, 360px) minmax(0, 1fr)" }, gap: { xs: 3.5, md: 5, lg: 6 }, alignItems: "start" }}>
        <Box component="header" sx={{ pt: { md: 1.5 }, minWidth: 0 }}>
          <Typography sx={{ color: "primary.dark", fontSize: 14, fontWeight: 700, mb: 1.5 }}>{work.category}</Typography>
          <Typography component="h1" sx={{ fontFamily: "Archivo, sans-serif", fontSize: { xs: 34, sm: 40, md: 46 }, lineHeight: 1.1, letterSpacing: "-.035em", fontWeight: 800, overflowWrap: "anywhere" }}>{title}</Typography>
          <Typography sx={{ mt: 2.5, fontSize: { xs: 16, md: 17 }, lineHeight: 1.6, color: "#41463f", whiteSpace: "pre-line" }}>{clean(work.description) || "Chưa có mô tả dự án."}</Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 2, mt: 2.5, borderTop: "1px solid", borderBottom: "1px solid", borderColor: "divider" }}>
            <Box aria-hidden="true" sx={{ width: 40, height: 40, borderRadius: "50%", bgcolor: "#dce2da", display: "grid", placeItems: "center", flexShrink: 0, fontSize: 13, fontWeight: 800 }}>{profile.name.split(" ").map(part => part[0]).slice(-2).join("").toUpperCase()}</Box>
            <Box sx={{ minWidth: 0 }}><Box component={Link} to={profilePath} sx={{ color: "text.primary", fontWeight: 700, textUnderlineOffset: "3px" }}>{profile.name}</Box><Typography sx={{ color: "#555d55", fontSize: 13, mt: .25 }}>{work.role}{work.team !== "Cá nhân" ? ` tại ${work.team}` : ""}</Typography></Box>
          </Box>
          <Box component="dl" sx={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 2, mt: 2.5, mb: 0, "& dt": { color: "#555d55", fontSize: 12, mb: .5 }, "& dd": { m: 0, fontSize: 14, fontWeight: 700, overflowWrap: "anywhere" } }}>
            <Box><Typography component="dt">Vai trò</Typography><Typography component="dd">{work.role}</Typography></Box>
            <Box><Typography component="dt">Hoàn thành</Typography><Typography component="dd">{work.date ? `${work.date.slice(5)}/${work.date.slice(0, 4)}` : "Chưa cập nhật"}</Typography></Box>
            <Box><Typography component="dt">Hình thức</Typography><Typography component="dd">{work.team === "Cá nhân" ? "Dự án cá nhân" : "Hợp tác đội ngũ"}</Typography></Box>
            <Box><Typography component="dt">Lĩnh vực</Typography><Typography component="dd">{work.category}</Typography></Box>
          </Box>
          {canEdit && <Chip variant="outlined" size="small" label={work.visibility === "private" ? "Riêng tư" : work.visibility === "link" ? "Qua liên kết" : "Công khai"} sx={{ mt: 2.5 }} />}
          {externalUrl && <Button component="a" href={externalUrl} target="_blank" rel="noopener noreferrer" variant="outlined" endIcon={<ArrowUpRight size={17} />} sx={{ mt: 2.5, borderColor: "text.secondary", color: "text.primary" }}>Xem sản phẩm</Button>}
        </Box>
        <Box component="section" id="work-gallery" aria-label="Hình ảnh và sản phẩm dự án" sx={{ minWidth: 0 }}>
          <Box sx={{ position: "relative", aspectRatio: { xs: "1.2", sm: "1.55", md: "1.4" }, bgcolor: "#edf0ea", borderRadius: "13px", overflow: "hidden", display: "grid", placeItems: "center" }}>
            {selectedMedia ? <ProjectMedia key={selectedMedia.id} media={selectedMedia} priority /> : <PortfolioCover work={work} />}
            {work.media.length > 1 && <>
              <IconButton aria-label="Ảnh trước" onClick={() => moveMedia(-1)} sx={{ position: "absolute", left: { xs: 8, md: 16 }, top: "50%", transform: "translateY(-50%)", width: 44, height: 44, bgcolor: "background.paper", boxShadow: 2, "&:hover": { bgcolor: "#edf0ea" } }}><ChevronLeft size={22} /></IconButton>
              <IconButton aria-label="Ảnh tiếp theo" onClick={() => moveMedia(1)} sx={{ position: "absolute", right: { xs: 8, md: 16 }, top: "50%", transform: "translateY(-50%)", width: 44, height: 44, bgcolor: "background.paper", boxShadow: 2, "&:hover": { bgcolor: "#edf0ea" } }}><ChevronRight size={22} /></IconButton>
              <Box aria-live="polite" sx={{ position: "absolute", left: 16, bottom: 16, px: 1.25, py: .5, borderRadius: 5, bgcolor: "background.paper", fontSize: 13, fontWeight: 700 }}>{selectedMediaIndex + 1}/{work.media.length}</Box>
            </>}
            {selectedMedia?.kind === "image" && <Button variant="contained" startIcon={<Maximize2 size={16} aria-hidden="true" />} onClick={() => setExpanded(selectedMedia)} sx={{ position: "absolute", right: 16, bottom: 16, bgcolor: "background.paper", color: "text.primary", border: "1px solid", borderColor: "text.secondary", "&:hover": { bgcolor: "#edf0ea" } }}>Xem ảnh lớn</Button>}
          </Box>
          {work.media.length > 1 && <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(4, minmax(0, 1fr))", md: "repeat(4, minmax(0, 1fr))" }, gap: { xs: .75, md: 1.5 }, mt: 1.5 }}>
            {work.media.map((media, index) => <Box component="button" type="button" key={media.id} aria-label={`Xem ${media.kind === "video" ? "video" : "ảnh"} dự án ${index + 1}`} aria-pressed={selectedMedia?.id === media.id} onClick={() => setSelectedMediaId(media.id)} sx={{ p: 0, minWidth: 0, aspectRatio: { xs: "1", md: "1.4" }, border: "2px solid", borderColor: selectedMedia?.id === media.id ? "primary.dark" : "transparent", borderRadius: "10px", overflow: "hidden", bgcolor: "#edf0ea", "& img, & video": { width: "100%", height: "100%", objectFit: "cover" } }}>{media.kind === "image" ? <img src={media.src} alt="" loading="lazy" /> : <video src={media.src} muted preload="metadata" aria-hidden="true" />}</Box>)}
          </Box>}
          {!work.media.length && <Alert severity="info" sx={{ mt: 2 }}>Dự án chưa có hình ảnh hoặc video.</Alert>}
        </Box>
      </Box>
      <Box component="section" id="work-story" aria-labelledby="story-heading" sx={{ ...sectionBorder, display: "grid", gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) minmax(240px, 350px)" }, gap: { xs: 3, md: 7 }, mt: { xs: 6, md: 9 }, py: { xs: 4, md: 6 } }}>
        <Box><Typography id="story-heading" component="h2" sx={{ fontFamily: "Archivo, sans-serif", fontSize: { xs: 27, md: 34 }, fontWeight: 800, mb: 2.5 }}>Phần đóng góp của tôi</Typography><Typography sx={{ fontSize: { xs: 16, md: 17 }, lineHeight: 1.75, whiteSpace: "pre-line", maxWidth: "65ch" }}>{clean(work.contribution) || "Chưa cập nhật phần đóng góp."}</Typography></Box>
        <Box component="aside" sx={{ bgcolor: "#edf0ea", borderRadius: "13px", p: { xs: 2.5, md: 3 }, alignSelf: "start" }}><Typography component="h3" sx={{ fontSize: 16, fontWeight: 700, mb: 1.5 }}>Kỹ năng và công cụ</Typography>{work.tags.length ? <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>{work.tags.map(tag => <Chip key={tag} label={tag} variant="outlined" size="small" sx={{ bgcolor: "background.paper" }} />)}</Box> : <Typography sx={{ fontSize: 15 }}>Chưa cập nhật.</Typography>}</Box>
      </Box>
      <Box component="section" id="work-reviews" aria-labelledby="reviews-heading" sx={{ ...sectionBorder, py: { xs: 4, md: 5 } }}><Typography id="reviews-heading" component="h2" sx={{ fontFamily: "Archivo, sans-serif", fontSize: 26, fontWeight: 800, mb: 1 }}>Đánh giá đối tác</Typography><Typography sx={{ fontSize: 14, color: "#555d55", mb: reviews.length ? 3 : 0 }}>{reviews.length ? "Dữ liệu minh họa trong bản demo, chưa phải đánh giá từ giao dịch thực tế." : "Chưa có đánh giá cho tác phẩm này."}</Typography>{reviews.length > 0 && <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>{reviews.map(review => <Box key={review.id} sx={{ borderTop: "1px solid", borderColor: "divider", pt: 2 }}><Typography component="h3" sx={{ fontSize: 16, fontWeight: 700 }}>{review.name}</Typography><Typography sx={{ fontSize: 14, color: "#555d55", mt: .5 }}>{review.role}</Typography><Rating readOnly value={review.rating} size="small" sx={{ color: "primary.dark", my: 1 }} getLabelText={value => `${value} trên 5 sao`} /><Typography sx={{ lineHeight: 1.7 }}>{clean(review.text)}</Typography></Box>)}</Box>}</Box>
      {related.length > 0 && <Box component="section" aria-labelledby="related-heading" sx={{ ...sectionBorder, pt: { xs: 4, md: 5 } }}><Typography id="related-heading" component="h2" sx={{ fontFamily: "Archivo, sans-serif", fontSize: { xs: 27, md: 34 }, fontWeight: 800, mb: 3 }}>Tác phẩm khác</Typography><Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 3 }}>{related.map(item => <Box component={Link} key={item.id} to={workPath(item.id)} sx={{ textDecoration: "none", color: "text.primary", minWidth: 0, "&:hover h3": { color: "primary.dark" } }}><Box sx={{ borderRadius: "13px", overflow: "hidden", "& > div": { aspectRatio: "1.65" } }}><PortfolioCover work={{ ...item, title: clean(item.title) }} /></Box><Typography component="h3" sx={{ fontSize: 18, fontWeight: 700, mt: 1.5 }}>{clean(item.title)}</Typography><Typography sx={{ color: "#555d55", fontSize: 14, mt: .5 }}>{item.category}</Typography></Box>)}</Box></Box>}
      <Typography sx={{ fontSize: 12, color: "#555d55", mt: 5 }}>Hồ sơ và tác phẩm minh họa trong bản demo FREVO.</Typography>
    </>}
    <Dialog open={Boolean(expanded)} onClose={() => setExpanded(null)} fullWidth maxWidth="lg" aria-labelledby="expanded-media-title"><DialogTitle id="expanded-media-title" sx={{ pr: 8 }}>Hình ảnh tác phẩm{work && work.media.length > 1 && <Typography component="span" sx={{ ml: 1, color: "text.secondary", fontSize: 14 }}>{work.media.findIndex(item => item.id === expanded?.id) + 1}/{work.media.length}</Typography>}<IconButton aria-label="Đóng ảnh lớn" onClick={() => setExpanded(null)} sx={{ position: "absolute", right: 12, top: 8, width: 44, height: 44 }}><X size={20} /></IconButton></DialogTitle><DialogContent sx={{ position: "relative" }}>{expanded && <ProjectMedia key={expanded.src} media={expanded} expanded />}{work && work.media.length > 1 && <><IconButton aria-label="Ảnh trước" onClick={() => moveMedia(-1, true)} sx={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", width: 44, height: 44, bgcolor: "background.paper", boxShadow: 2, "&:hover": { bgcolor: "#edf0ea" } }}><ChevronLeft size={22} /></IconButton><IconButton aria-label="Ảnh tiếp theo" onClick={() => moveMedia(1, true)} sx={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", width: 44, height: 44, bgcolor: "background.paper", boxShadow: 2, "&:hover": { bgcolor: "#edf0ea" } }}><ChevronRight size={22} /></IconButton></>}</DialogContent></Dialog>
    {canEdit && editing && work && <PortfolioEditor key={work.id} work={work} onClose={() => setEditing(false)} onSave={updated => { setWorks(current => current.map(item => item.id === updated.id ? updated : item)); setEditing(false); }} onDelete={id => { setWorks(current => current.filter(item => item.id !== id)); setProfile(current => ({ ...current, featuredIds: current.featuredIds.filter(item => item !== id) })); setEditing(false); navigate("/profile/portfolio"); }} />}
  </Box>;
}
