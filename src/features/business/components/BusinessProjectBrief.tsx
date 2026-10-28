import { GuidedBriefSummary } from "./GuidedBriefSummary";
import { useState } from "react";
import { Link } from "react-router";
import { Alert, Box, Button, Chip, Dialog, DialogContent, DialogTitle, IconButton, Skeleton, Typography } from "@mui/material";
import { ArrowRight, CalendarDays, Check, Clock3, FileText, Maximize2, Pencil, UsersRound, Wallet, X } from "lucide-react";
import type { ProjectBrief } from "@/lib/types/marketplace.types";

interface BusinessProjectBriefProps {
  project: ProjectBrief;
  candidateCount: number;
  executorName?: string;
  inboxPath: string;
  onCloseProject: () => void;
}

export function BusinessProjectBrief({ project, candidateCount, executorName, inboxPath, onCloseProject }: BusinessProjectBriefProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const editable = project.status === "draft" || project.status === "published";
  const recruiting = project.status === "published";
  const active = project.status === "ongoing";
  const basePath = `/business/projects/${project.id}`;
  const buttonSx = { minHeight: 42, borderRadius: 999, px: 2 } as const;

  return <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
    {project.guidedBrief && <Box sx={{ gridColumn: "1 / -1" }}><GuidedBriefSummary brief={project.guidedBrief} /></Box>}<section aria-labelledby="brief-overview-title" className="min-w-0 overflow-hidden rounded-3xl border border-[#e4e6e2] bg-white">
      <div className="p-5 sm:p-7">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div><span className="text-xs font-medium text-[#747773]">{project.category}</span><Typography id="brief-overview-title" component="h2" sx={{ mt: 0.5, fontSize: 23, fontWeight: 700 }}>Về dự án</Typography></div>
          {editable && <Button component={Link} to={`${basePath}/edit`} startIcon={<Pencil size={15} />} variant="outlined" sx={{ ...buttonSx, borderColor: "divider", color: "text.primary" }}>Chỉnh sửa brief</Button>}
        </div>
        <div className={`grid items-start gap-5 ${project.heroImage ? "md:grid-cols-[minmax(0,1fr)_220px]" : ""}`}>
          <p className="whitespace-pre-line text-[15px] leading-7 text-[#62665f]">{project.description || "Chưa có mô tả. Hoàn thiện brief để freelancer hiểu rõ nhu cầu của bạn."}</p>
      {project.heroImage && <figure className="m-0 min-w-0 overflow-hidden rounded-2xl border border-[#e4e6e2] bg-[#f7f8f6]">
        {imageFailed ? <Box sx={{ p: 3 }}><Alert severity="warning" action={<Button onClick={() => { setImageFailed(false); setImageLoaded(false); }}>Thử lại</Button>}>Chưa tải được ảnh tham chiếu.</Alert></Box>
          : <Box sx={{ position: "relative", height: { xs: 160, md: 148 }, bgcolor: "background.default", overflow: "hidden" }}>
            {!imageLoaded && <Skeleton variant="rectangular" animation="wave" role="status" aria-label="Đang tải ảnh tham chiếu" sx={{ position: "absolute", inset: 0, height: "100%" }} />}
            <Box component="img" src={project.heroImage} alt={`Ảnh minh họa định hướng cho ${project.title}`} onLoad={() => setImageLoaded(true)} onError={() => setImageFailed(true)} sx={{ display: "block", width: "100%", height: "100%", objectFit: "cover", visibility: imageLoaded ? "visible" : "hidden" }} />
          </Box>}
        <figcaption className="flex items-center justify-between gap-1 px-3 py-2 text-xs text-[#747773]">
          <span>Ảnh định hướng</span>
          {!imageFailed && <Button size="small" onClick={() => setPreviewOpen(true)} startIcon={<Maximize2 size={13} />} sx={{ minHeight: 32, minWidth: 0, whiteSpace: "nowrap", color: "text.secondary", px: 1 }}>Xem ảnh</Button>}
        </figcaption>
      </figure>}

        </div>

        <div className="mt-7 border-t border-[#e4e6e2] pt-6">
          <div className="mb-4 flex items-center justify-between gap-3"><Typography component="h3" sx={{ fontSize: 17, fontWeight: 700 }}>Sản phẩm cần bàn giao</Typography><Chip label={`${project.deliverables.length} hạng mục`} size="small" sx={{ bgcolor: "background.default", fontSize: 12 }} /></div>
          {project.deliverables.length ? <ul className="m-0 list-none space-y-3 p-0">{project.deliverables.map((item, index) => <li key={`${index}-${item}`} className="flex items-start gap-3 rounded-xl bg-[#f7f8f6] px-4 py-3"><span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-white text-[#16805b]"><Check size={13} aria-hidden="true" /></span><span className="text-sm leading-6">{item}</span></li>)}</ul> : <p className="text-sm text-[#747773]">Chưa thêm sản phẩm bàn giao.</p>}
        </div>

        <div className="mt-7 border-t border-[#e4e6e2] pt-6"><Typography component="h3" sx={{ mb: 2, fontSize: 17, fontWeight: 700 }}>Kỹ năng cần có</Typography><div className="flex flex-wrap gap-2">{project.skills.length ? project.skills.map(skill => <Chip key={skill} label={skill} size="small" variant="outlined" sx={{ borderColor: "divider", bgcolor: "background.default", fontSize: 13, height: 30 }} />) : <p className="text-sm text-[#747773]">Chưa thêm kỹ năng.</p>}</div></div>

        {!!project.referenceFiles?.length && <div className="mt-7 border-t border-[#e4e6e2] pt-6"><Typography component="h3" sx={{ mb: 2, fontSize: 17, fontWeight: 700 }}>Tài liệu tham khảo</Typography><ul className="m-0 list-none space-y-2 p-0">{project.referenceFiles.map((file, index) => <li key={`${file.name}-${index}`} className="flex items-center gap-2.5 rounded-xl border border-[#e4e6e2] px-3 py-3 text-sm"><FileText size={17} className="shrink-0 text-[#747773]" aria-hidden="true" /><span className="min-w-0 break-words">{file.name}</span></li>)}</ul><p className="mt-2 text-xs text-[#747773]">Bản mẫu chỉ lưu thông tin tệp, chưa hỗ trợ tải xuống.</p></div>}
      </div>
    </section>

    <aside aria-label="Tóm tắt brief và thao tác" className="space-y-4 xl:sticky xl:top-5">
      <section className="rounded-3xl border border-[#e4e6e2] bg-white p-5 sm:p-6">
        <div className="mb-5 border-b border-[#e4e6e2] pb-5"><p className="mb-2 flex items-center gap-2 text-xs text-[#747773]"><Wallet size={15} aria-hidden="true" />Ngân sách dự kiến</p><Typography sx={{ fontSize: 25, fontWeight: 700, color: "primary.dark", lineHeight: 1.3 }}>{project.budget || "Chưa đặt"}</Typography></div>
        <dl className="m-0 space-y-5">
          {[
            { label: "Hạn ứng tuyển", value: project.applicationDeadline || "Chưa đặt", icon: CalendarDays },
            { label: "Hạn hoàn thành", value: project.deadline || "Chưa đặt", icon: CalendarDays },
            { label: "Thời lượng dự kiến", value: project.duration || "Chưa đặt", icon: Clock3 },
            { label: "Người thực hiện", value: project.preference === "both" ? "Cá nhân hoặc Team" : project.preference === "team" ? "Team" : "Cá nhân", icon: UsersRound },
          ].map(item => <div key={item.label} className="flex items-start gap-2.5"><item.icon size={16} className="mt-0.5 shrink-0 text-[#747773]" aria-hidden="true" /><div><dt className="text-xs text-[#747773]">{item.label}</dt><dd className="m-0 mt-1 text-sm font-semibold">{item.value}</dd></div></div>)}
        </dl>
      </section>

      <section className="rounded-3xl border border-[#e0e5dc] bg-[#f1f3ef] p-5 sm:p-6">
        <Typography component="h2" sx={{ fontSize: 17, fontWeight: 700 }}>{project.status === "draft" ? "Sẵn sàng đăng tuyển?" : recruiting ? "Quản lý tuyển dụng" : active ? "Đã chốt người thực hiện" : "Lịch sử dự án"}</Typography>
        <p className="mb-4 mt-2 text-sm leading-6 text-[#747773]">{project.status === "draft" ? "Hoàn thiện brief trước khi công bố." : recruiting ? `${candidateCount} hồ sơ đã nhận. Xem và duyệt để bắt đầu trao đổi.` : active ? executorName || "Theo dõi công việc trong không gian dự án." : "Brief được giữ lại để bạn đối chiếu thông tin."}</p>
        <div className="flex flex-col gap-2">
          {project.status === "draft" ? <Button component={Link} to={`${basePath}/edit`} variant="contained" endIcon={<ArrowRight size={15} />} sx={buttonSx}>Tiếp tục soạn brief</Button>
            : recruiting ? <><Button component={Link} to={`${basePath}/applicants`} variant="contained" endIcon={<ArrowRight size={15} />} sx={buttonSx}>Xem ứng viên</Button><Button component={Link} to={`${basePath}/suggestions`} sx={{ ...buttonSx, bgcolor: "white", color: "text.primary" }}>Gợi ý phù hợp</Button></>
            : active ? <><Button component={Link} to={`/workspace/${project.id}`} variant="contained" sx={buttonSx}>Xem tiến độ</Button><Button component={Link} to={inboxPath} sx={{ ...buttonSx, bgcolor: "white", color: "text.primary" }}>Tin nhắn dự án</Button></>
            : <Button component={Link} to={`${basePath}/applicants`} variant="outlined" sx={{ ...buttonSx, borderColor: "divider", color: "text.primary" }}>Xem hồ sơ đã nhận</Button>}
        </div>
      </section>
      {recruiting && <Button onClick={onCloseProject} sx={{ width: "100%", minHeight: 40, color: "text.secondary" }}>Đóng tuyển dự án</Button>}
    </aside>

    <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="lg" fullWidth aria-labelledby="brief-image-title"><DialogTitle id="brief-image-title" sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>Ảnh tham chiếu dự án<IconButton aria-label="Đóng ảnh tham chiếu" onClick={() => setPreviewOpen(false)}><X size={20} /></IconButton></DialogTitle><DialogContent><Box component="img" src={project.heroImage} alt={`Ảnh minh họa định hướng cho ${project.title}`} sx={{ display: "block", width: "100%", maxHeight: "75dvh", objectFit: "contain", borderRadius: 2 }} /></DialogContent></Dialog>
  </div>;
}
