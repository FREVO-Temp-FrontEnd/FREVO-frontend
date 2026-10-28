import { useState } from "react";
import { Alert, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField, Typography } from "@mui/material";
import type { GuidedBrief } from "@/lib/types/guidedBrief.types";
import { creativeServices, creativeTemplateVersion } from "../data/creativeBriefTemplates";
import type { BriefFields } from "../hooks/useProjectBriefForm";

interface Props { fields: BriefFields; error?: string; onChange: (value: GuidedBrief, category: string, deliverables: string[]) => void }
export function GuidedBriefEditor({ fields, error, onChange }: Props) {
  const [pending, setPending] = useState<string | null>(null);
  const value = fields.guidedBrief;
  const service = creativeServices.find(item => item.id === value?.serviceId);
  function changeService(id: string) {
    const next = creativeServices.find(item => item.id === id);
    if (!next) return;
    onChange({ serviceId: next.id, templateVersion: creativeTemplateVersion, inScope: value?.inScope ?? "", outOfScope: value?.outOfScope ?? "", items: [] }, next.name, []);
    setPending(null);
  }
  function update(next: GuidedBrief) { if (service) onChange(next, service.name, next.items.map(item => item.name)); }
  return <Box id="brief-guided" component="section" aria-label="Dịch vụ và yêu cầu bàn giao" sx={{ p: { xs: 2, sm: 3 }, border: "1px solid", borderColor: "divider", borderRadius: 3, bgcolor: "background.paper", scrollMarginTop: 24 }}>
    <Typography component="h2" sx={{ fontSize: 18, fontWeight: 700 }}>2. Dịch vụ và sản phẩm bàn giao</Typography>
    <Typography sx={{ mt: .75, mb: 3, fontSize: 13, color: "text.secondary" }}>Chọn loại dịch vụ, sau đó thêm các hạng mục bạn cần nhận.</Typography>
    <TextField select fullWidth required label="Loại dịch vụ" helperText="Bạn có thể đổi dịch vụ; hệ thống sẽ hỏi trước khi bỏ các hạng mục đã nhập." sx={{ "& .MuiOutlinedInput-root": { bgcolor: "background.default" } }} value={service?.id ?? ""} onChange={event => { const id = event.target.value; if (id === service?.id) return; if (value?.items.length || fields.deliverables.some(item => item.trim())) setPending(id); else changeService(id); }}>
      {creativeServices.map(item => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)}
    </TextField>
    {!value && <Alert severity="info" sx={{ mt: 2 }}>Brief cũ vẫn được giữ nguyên. Chọn dịch vụ để chuyển sang mẫu hướng dẫn.</Alert>}
    {service && value && <>
      <Typography sx={{ mt: 1, mb: 2.5, fontSize: 12, color: "text.secondary" }}>{service.description}</Typography>
      <Typography sx={{ mb: 1, fontSize: 13, fontWeight: 600 }}>Chọn sản phẩm bàn giao *</Typography>
      <div className="mb-5 flex flex-wrap gap-2">{service.deliverables.map(template => {
        const chosen = value.items.some(item => item.typeId === template.id);
        return <Chip key={template.id} label={`${chosen ? "✓ " : "+ "}${template.name}`} variant={chosen ? "filled" : "outlined"} sx={{ minHeight: 38, px: .5, bgcolor: chosen ? "#fff0e9" : "background.paper", color: chosen ? "primary.dark" : "text.primary", border: "1px solid", borderColor: chosen ? "#f4490b" : "divider", fontWeight: chosen ? 600 : 400 }} aria-pressed={chosen} onClick={() => {
          if (chosen) { setPending(`remove:${template.id}`); return; }
          update({ ...value, items: [...value.items, { typeId: template.id, name: template.name, specifications: {}, acceptanceCriteria: "" }] });
        }} />;
      })}</div>
      {!value.items.length && <Alert severity="info" sx={{ mb: 3 }}>Chọn ít nhất một sản phẩm ở trên để nhập thông số bàn giao.</Alert>}
      <Box sx={{ display: "grid", gap: 2, mb: 3, gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" } }}>
        <TextField label="Trong phạm vi" required error={!!error && !value.inScope.trim()} helperText={error && !value.inScope.trim() ? "Mô tả các công việc bao gồm trong dự án." : undefined} multiline minRows={3} value={value.inScope} onChange={event => update({ ...value, inScope: event.target.value })} placeholder="Những công việc bên thực hiện cần làm" />
        <TextField label="Ngoài phạm vi" required error={!!error && !value.outOfScope.trim()} helperText={error && !value.outOfScope.trim() ? "Ghi các công việc không bao gồm, hoặc Không có." : undefined} multiline minRows={3} value={value.outOfScope} onChange={event => update({ ...value, outOfScope: event.target.value })} placeholder="Những công việc không bao gồm; ghi Không có nếu phù hợp" />
      </Box>
      <div className="space-y-4">{value.items.map((item, index) => {
        const template = service.deliverables.find(option => option.id === item.typeId);
        return <Box key={item.typeId} sx={{ p: 2, border: "1px solid", borderColor: "divider", borderRadius: 2, bgcolor: "background.default" }}>
          <Typography component="h3" sx={{ fontSize: 14, fontWeight: 700, mb: 2 }}>{index + 1}. {item.name}</Typography>
          <div className="grid gap-4">{template?.fields.map(field => <TextField key={field.id} label={field.label} required error={!!error && !item.specifications[field.id]?.trim()} helperText={error && !item.specifications[field.id]?.trim() ? "Vui lòng nhập thông số này." : undefined} fullWidth multiline minRows={2} value={item.specifications[field.id] ?? ""} placeholder={field.hint} onChange={event => update({ ...value, items: value.items.map(current => current.typeId === item.typeId ? { ...current, specifications: { ...current.specifications, [field.id]: event.target.value } } : current) })} />)}
            <TextField label="Tiêu chí nghiệm thu" required error={!!error && !item.acceptanceCriteria.trim()} helperText={error && !item.acceptanceCriteria.trim() ? "Nêu điều kiện cụ thể để chấp nhận sản phẩm." : undefined} multiline minRows={2} value={item.acceptanceCriteria} placeholder="Điều kiện cụ thể để xác nhận hạng mục đạt yêu cầu" onChange={event => update({ ...value, items: value.items.map(current => current.typeId === item.typeId ? { ...current, acceptanceCriteria: event.target.value } : current) })} />
          </div>
        </Box>;
      })}</div>

    </>}
    {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    <Dialog open={!!pending} onClose={() => setPending(null)} maxWidth="xs" fullWidth aria-labelledby="change-service-title"><DialogTitle id="change-service-title">{pending?.startsWith("remove:") ? "Bỏ hạng mục này?" : "Đổi loại dịch vụ?"}</DialogTitle><DialogContent><Typography sx={{ fontSize: 14, lineHeight: 1.7 }}>Thông số và tiêu chí của hạng mục bị bỏ sẽ không nằm trong bản nháp mới. Phạm vi và thông tin chung được giữ lại.</Typography></DialogContent><DialogActions><Button onClick={() => setPending(null)}>Giữ nguyên</Button><Button variant="contained" onClick={() => {
      if (pending?.startsWith("remove:") && value) { update({ ...value, items: value.items.filter(item => item.typeId !== pending.slice(7)) }); setPending(null); }
      else if (pending) changeService(pending);
    }}>Xác nhận</Button></DialogActions></Dialog>
  </Box>;
}
