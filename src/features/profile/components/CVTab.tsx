import { useRef, useState, type ChangeEvent } from "react";
import { Alert, Box, Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Paper, Skeleton, Tooltip, Typography } from "@mui/material";
import { Download, Eye, FileText, FolderClosed, Plus, ShieldCheck, Star, Trash2, UploadCloud } from "lucide-react";
import { useResumes, type ResumeRecord } from "../hooks/useResumes";

interface CVTabProps {
  ownerId: string | undefined;
  seedDemoResumes: boolean;
}

const fileSize = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(2)} MB`;
const uploadedDate = (value: string) => new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(value));

function openResume(resume: ResumeRecord) {
  const url = URL.createObjectURL(resume.file);
  if (/\.pdf$/i.test(resume.name)) {
    window.open(url, "_blank", "noopener,noreferrer");
  } else {
    const link = document.createElement("a");
    link.href = url;
    link.download = resume.name;
    link.click();
  }
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

export function CVTab({ ownerId, seedDemoResumes }: CVTabProps) {
  const { resumes, loading, busy, error, notice, reload, upload, remove, setPrimary } = useResumes(ownerId, seedDemoResumes);
  const inputRef = useRef<HTMLInputElement>(null);
  const [removeTarget, setRemoveTarget] = useState<ResumeRecord | null>(null);

  const chooseFile = () => inputRef.current?.click();

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file) void upload(file);
  };

  return (
    <section aria-labelledby="cv-title" className="pb-10">
      <input ref={inputRef} type="file" accept=".pdf,.doc,.docx" onChange={handleFile} className="hidden" aria-label="Chọn tệp CV PDF, DOC hoặc DOCX" />

      <div className="mb-7 flex flex-wrap items-start justify-between gap-5">
        <div>
          <Typography id="cv-title" component="h1" sx={{ fontFamily: "Archivo, sans-serif", fontWeight: 900, fontSize: { xs: 30, sm: 36 }, lineHeight: 1.15, letterSpacing: "-.04em", color: "text.primary" }}>
            CV của tôi<span className="text-[#f4490b]">.</span>
          </Typography>
          <Typography sx={{ mt: 1.5, color: "text.secondary", fontSize: 14 }}>
            Lưu nhiều phiên bản CV để chuẩn bị cho các cơ hội khác nhau.
          </Typography>
        </div>
        <Button variant="contained" startIcon={busy ? <CircularProgress size={16} color="inherit" /> : <Plus size={18} />} onClick={() => chooseFile()} disabled={!ownerId || busy || loading} sx={{ borderRadius: 999, px: 2.5, py: 1.2, textTransform: "none", fontWeight: 700, boxShadow: "none" }}>
          Tải CV lên
        </Button>
      </div>

      <Alert icon={<ShieldCheck size={20} />} severity="info" sx={{ mb: 3, borderRadius: 2, bgcolor: "#f0f6f4", color: "#245044", "& .MuiAlert-icon": { color: "#245044" } }}>
        CV chỉ được Business sở hữu dự án xem sau khi bạn ứng tuyển hoặc chấp nhận lời mời. Bản demo này lưu tệp trong trình duyệt của bạn; chưa tải lên máy chủ hoặc cấp quyền xem thật.
      </Alert>

      <Paper variant="outlined" className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl! p-5! shadow-none!" sx={{ borderColor: "divider" }}>
        <div className="flex items-center gap-4">
          <div className="flex size-11 items-center justify-center rounded-xl bg-[#fff0e9] text-[#bd3d14]"><UploadCloud size={22} /></div>
          <div>
            <Typography sx={{ fontWeight: 800, fontSize: 14 }}>Tệp PDF, DOC hoặc DOCX</Typography>
            <Typography sx={{ color: "text.secondary", fontSize: 12 }}>Tối đa 5 MB mỗi tệp trong bản demo · Giới hạn chính thức chưa được chốt.</Typography>
          </div>
        </div>
        <Chip label={`${resumes.length} CV`} size="small" sx={{ bgcolor: "#fff0e9", color: "#bd3d14", fontWeight: 800 }} />
      </Paper>

      {error && <Alert severity="error" className="mb-5" action={<Button color="inherit" size="small" onClick={() => void reload()}>Thử lại</Button>}>{error}</Alert>}
      {notice && <Alert severity="success" className="mb-5" role="status">{notice}</Alert>}

      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3" aria-label="Đang tải danh sách CV">
          <Skeleton variant="rounded" height={100} />
          <Skeleton variant="rounded" height={100} />
        </div>
      ) : resumes.length === 0 ? (
        <Paper variant="outlined" className="rounded-2xl! border-dashed! p-8! text-center shadow-none! sm:p-12!" sx={{ borderColor: "divider" }}>
          <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-[#fff0e9] text-[#bd3d14]"><FileText size={29} /></div>
          <Typography component="h2" sx={{ fontFamily: "Archivo, sans-serif", fontWeight: 800, fontSize: 20 }}>Bạn chưa có CV nào</Typography>
          <Typography sx={{ mt: 1, mb: 3, color: "text.secondary", fontSize: 13 }}>Tải CV đầu tiên lên để quản lý các phiên bản trong hồ sơ của bạn.</Typography>
          <Button variant="outlined" startIcon={<UploadCloud size={17} />} onClick={() => chooseFile()} disabled={!ownerId || busy} sx={{ borderRadius: 999, textTransform: "none", fontWeight: 700 }}>Chọn tệp CV</Button>
        </Paper>
      ) : (
        <Box component="ul" className="grid list-none grid-cols-1 gap-5 p-0 sm:grid-cols-2 xl:grid-cols-3" aria-label="Danh sách CV của tôi">
          {resumes.map((resume) => (
            <Box component="li" key={resume.id} className="min-w-0 w-full max-w-[340px]">
              <Paper variant="outlined" className="h-full overflow-hidden rounded-2xl! shadow-none!" sx={{ borderColor: resume.isPrimary ? "#f4c66a" : "divider" }}>
                <div className="relative flex h-40 items-center justify-center border-b border-[#e4e6e2] bg-[#f9faf8]">
                  <div className="flex size-28 flex-col items-center justify-center rounded-2xl border border-[#f6d6c6] bg-[#fff0e9] text-[#bd3d14]">
                    <FolderClosed size={53} strokeWidth={1.4} />
                    <span className="mt-1 text-[11px] font-extrabold tracking-[.18em]">CV</span>
                  </div>
                  <div className="absolute top-3 right-3 rounded-full bg-white shadow-sm">
                    {resume.isPrimary ? (
                      <Tooltip title="CV chính"><Box component="span" aria-label="CV chính" className="flex size-10 items-center justify-center"><Star size={25} fill="#f5b301" color="#e39b00" strokeWidth={2} /></Box></Tooltip>
                    ) : (
                      <Tooltip title="Đặt làm CV chính"><span><IconButton size="small" aria-label={`Đặt ${resume.name} làm CV chính`} onClick={() => void setPrimary(resume.id)} disabled={busy || !ownerId} sx={{ width: 40, height: 40 }}><Star size={23} color="#8d918a" /></IconButton></span></Tooltip>
                    )}
                  </div>
                </div>
                <div className="flex min-h-36 flex-col p-4">
                  <div className="mb-1 flex min-w-0 flex-wrap items-start justify-between gap-2">
                    <Typography component="h2" className="min-w-0 break-words" sx={{ fontWeight: 800, fontSize: 14, lineHeight: 1.4 }}>{resume.name}</Typography>
                    {resume.isPrimary && <Chip label="CV chính" size="small" sx={{ bgcolor: "#fff4d9", color: "#8c5a00", fontWeight: 800, fontSize: 10 }} />}
                  </div>
                  <Typography sx={{ color: "text.secondary", fontSize: 11 }}>
                    {fileSize(resume.size)} · Cập nhật {uploadedDate(resume.uploadedAt)}
                  </Typography>
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-1 pt-4">
                    <Button size="small" startIcon={/\.pdf$/i.test(resume.name) ? <Eye size={15} /> : <Download size={15} />} onClick={() => openResume(resume)} sx={{ textTransform: "none", color: "text.primary", fontWeight: 700 }}>
                      {/\.pdf$/i.test(resume.name) ? "Xem CV" : "Tải về"}
                    </Button>
                    <Button size="small" startIcon={<Trash2 size={15} />} onClick={() => setRemoveTarget(resume)} disabled={busy || !ownerId} color="error" sx={{ textTransform: "none" }}>Xóa</Button>
                  </div>
                </div>
              </Paper>
            </Box>
          ))}
        </Box>
      )}

      <Typography sx={{ mt: 3, color: "text.secondary", fontSize: 12 }}>
        Mỗi CV là một tệp riêng. Bạn có thể chọn một CV chính bằng ngôi sao; xóa CV không ảnh hưởng đến các CV còn lại.
      </Typography>

      <Dialog open={Boolean(removeTarget)} onClose={() => setRemoveTarget(null)} aria-labelledby="remove-cv-title" maxWidth="xs" fullWidth>
        <DialogTitle id="remove-cv-title">Xóa CV khỏi hồ sơ?</DialogTitle>
        <DialogContent><Typography sx={{ overflowWrap: "anywhere" }}>{removeTarget?.name} sẽ bị xóa khỏi bản demo trên trình duyệt này.</Typography></DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setRemoveTarget(null)} sx={{ textTransform: "none" }}>Giữ lại</Button>
          <Button color="error" variant="contained" disabled={busy} onClick={() => {
            if (removeTarget) void remove(removeTarget.id).then((removed) => { if (removed) setRemoveTarget(null); });
          }} sx={{ textTransform: "none" }}>Xóa CV</Button>
        </DialogActions>
      </Dialog>
    </section>
  );
}
