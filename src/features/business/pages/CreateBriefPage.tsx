import { BriefRequirementsSummary } from "../components/BriefRequirementsSummary";
import { BriefCoverInput } from "../components/BriefCoverInput";
import { materialBriefChanges, briefFieldLabels } from "@/lib/utils/briefVersions";
import { creativeServices } from "../data/creativeBriefTemplates";
import { GuidedBriefSummary } from "../components/GuidedBriefSummary";
import { GuidedBriefEditor } from "../components/GuidedBriefEditor";
import { useState } from "react";
import { BusinessQuotaSummary } from "../components/BusinessQuotaSummary";
import { Link, useNavigate, useMatch } from "react-router";
import { ArrowLeft, ArrowRight, Check, Eye, FileText, Plus, Upload, X } from "lucide-react";
import { Alert, Box, Button, Card, Chip, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, MenuItem, Radio, RadioGroup, TextField, Typography } from "@mui/material";
import { useBusiness } from "@/lib/hooks/useBusiness";
import type { ProjectBrief } from "@/lib/types/marketplace.types";
import { useProjectBriefForm } from "@/features/business/hooks/useProjectBriefForm";
import { BriefFormSummary } from "@/features/business/components/BriefFormSummary";
import { formatMoneyInput, moneyDigits } from "@/lib/utils/money";

const categories = ["Nhận diện thương hiệu", "Thiết kế mạng xã hội", "Dựng video ngắn", "Viết nội dung", "Chiến lược & định hướng sáng tạo", "Thiết kế thương hiệu", "UI/UX & Website", "Nội dung sáng tạo", "Motion & Digital", "Nhiếp ảnh & Video"];
const durations = ["2 tuần", "4 tuần", "6 tuần", "8 tuần"];
const font = '"Space Grotesk", Arial, sans-serif';
const buttonSx = { "&&": { fontFamily: font, fontSize: 13, fontWeight: 600, textTransform: "none" } };

function SectionHeading({ number, title, description }: { number: string; title: string; description?: string }) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <Box component="span" sx={{ display: "grid", placeItems: "center", flexShrink: 0, width: 30, height: 30, borderRadius: "50%", bgcolor: "#fff0e9", color: "primary.dark", fontFamily: font, fontSize: 12, fontWeight: 700 }}>{number}</Box>
      <div>
        <Typography component="h2" sx={{ fontFamily: "Archivo, Arial, sans-serif", fontSize: 18, fontWeight: 700, lineHeight: 1.3 }}>{title}</Typography>
        {description && <Typography sx={{ mt: 0.5, color: "text.secondary", fontFamily: font, fontSize: 12, lineHeight: 1.6 }}>{description}</Typography>}
      </div>
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  return message ? <Typography role="alert" sx={{ color: "error.main", fontFamily: font, fontSize: 11, mt: 0.75 }}>{message}</Typography> : null;
}

function SectionCard({ children, id }: { children: React.ReactNode; id?: string }) {
  return <Card id={id} component="section" variant="outlined" sx={{ p: { xs: 2.25, sm: 3 }, scrollMarginTop: 24, borderColor: "divider", borderRadius: "20px", boxShadow: "none", bgcolor: "background.paper" }}>{children}</Card>;
}

function BriefEditor({ existingProject, saveProject }: { existingProject?: ProjectBrief; saveProject: (project: ProjectBrief) => void }) {
  const navigate = useNavigate();
  const { candidates } = useBusiness();
  const [pendingPublish, setPendingPublish] = useState<ProjectBrief | null>(null);
  const [saveError, setSaveError] = useState("");
  const [showGuidedTemplate, setShowGuidedTemplate] = useState(!existingProject || !!existingProject.guidedBrief);
  const { fields, setField, errors, skillInput, setSkillInput, addSkill, isPreview, setIsPreview, openPreview, buildProject, sections } = useProjectBriefForm(existingProject);
  const isEditingPublished = existingProject?.status === "published";
  const durationOptions = durations.includes(fields.duration) ? durations : [...durations, fields.duration];

  function saveDraft() {
    const project = buildProject("draft");
    if (!project) return;
    try { saveProject(project); navigate(`/business/projects/${project.id}`); }
    catch (error) { setSaveError(error instanceof Error ? error.message : "Không lưu được dự án. Vui lòng thử lại."); }
  }

  function publish() {
    const project = buildProject("published");
    if (!project) return;
    if (existingProject?.status === "published" && candidates.some(candidate => candidate.projectId === project.id && candidate.status !== "not_selected") && materialBriefChanges(existingProject, project).length) {
      setPendingPublish(project); return;
    }
    try { saveProject(project); navigate(`/business/projects/${project.id}`); }
    catch (error) { setSaveError(error instanceof Error ? error.message : "Không lưu được dự án. Vui lòng thử lại."); }
  }

  const formFieldsSx = {
    "& .MuiOutlinedInput-root": { borderRadius: "10px", bgcolor: "#fff" },
    "&& .MuiInputBase-input": { fontFamily: font, fontSize: 14 },
    "&& .MuiInputBase-inputMultiline": { fontFamily: font, fontSize: 14, lineHeight: 1.75 },
    "&& .MuiInputLabel-root": { fontFamily: font, fontSize: 14 },
  };

  return (
    <Box sx={{ fontFamily: font }}>
      <Dialog open={!!pendingPublish} onClose={() => setPendingPublish(null)} maxWidth="sm" fullWidth aria-labelledby="confirm-brief-change">
        <DialogTitle id="confirm-brief-change">Cập nhật brief đã có ứng viên?</DialogTitle>
        <DialogContent><Typography sx={{ fontSize: 14, lineHeight: 1.7 }}>Hệ thống giữ phiên bản cũ và thông báo cho các ứng viên liên quan. Thay đổi brief không tự sửa thỏa thuận hoặc có nghĩa ứng viên đã đồng ý với yêu cầu mới.</Typography><div className="mt-4 flex flex-wrap gap-2">{pendingPublish && existingProject && materialBriefChanges(existingProject, pendingPublish).map(field => <Chip key={field} label={briefFieldLabels[field]} size="small" />)}</div>{saveError && <Alert severity="error" sx={{ mt: 2 }}>{saveError}</Alert>}</DialogContent>
        <DialogActions><Button onClick={() => setPendingPublish(null)}>Quay lại kiểm tra</Button><Button variant="contained" onClick={() => { if (!pendingPublish) return; try { saveProject(pendingPublish); navigate(`/business/projects/${pendingPublish.id}/brief`); } catch (issue) { setSaveError(issue instanceof Error ? issue.message : "Không lưu được thay đổi."); } }}>Lưu phiên bản mới</Button></DialogActions>
      </Dialog>
      <div className="mb-6">
        <Button component={Link} to="/business/projects" startIcon={<ArrowLeft size={15} />} sx={{ ...buttonSx, mb: 2, px: 0, color: "text.secondary" }}>Dự án của tôi</Button>
        <Typography component="h1" sx={{ fontFamily: "Archivo, Arial, sans-serif", fontSize: { xs: 28, sm: 32 }, fontWeight: 800, lineHeight: 1.25, letterSpacing: "-0.02em" }}>
          {existingProject ? "Chỉnh sửa brief" : "Tạo dự án mới"}
        </Typography>
        <Typography sx={{ mt: 1.25, maxWidth: 650, color: "text.secondary", fontFamily: font, fontSize: { xs: 13, sm: 14 }, lineHeight: 1.65 }}>
          Chia sẻ nhu cầu để tìm người phù hợp với dự án của bạn.
        </Typography>
      </div>

      {saveError && <Alert severity="error" sx={{ mb: 2 }}>{saveError}</Alert>}
      <BusinessQuotaSummary />
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_290px]">
        <div className="min-w-0 space-y-5">
          {isPreview ? (
            <>
              <Alert severity="info" sx={{ borderRadius: "12px", fontFamily: font, fontSize: 12 }}>
                Đây là bản xem trước. Hãy kiểm tra nội dung trước khi công bố dự án.
              </Alert>
              <SectionCard>
                {fields.heroImage && <Box component="img" src={fields.heroImage} alt={`Ảnh bìa ${fields.title}`} sx={{ width: "100%", height: { xs: 150, sm: 200 }, objectFit: "cover", borderRadius: 2, mb: 3 }} />}
                <div className="mb-5 flex flex-wrap items-center gap-2">
                  <Chip label={fields.category} size="small" sx={{ bgcolor: "#f2f3f0", fontFamily: font, fontSize: 11 }} />
                  <Chip label="Bản xem trước" size="small" sx={{ bgcolor: "#fff0e9", color: "primary.dark", fontFamily: font, fontSize: 11, fontWeight: 700 }} />
                </div>
                <Typography component="h2" sx={{ fontFamily: "Archivo, Arial, sans-serif", fontSize: { xs: 24, sm: 28 }, fontWeight: 700, lineHeight: 1.3, mb: 2 }}>{fields.title}</Typography>
                <Typography sx={{ whiteSpace: "pre-line", fontFamily: font, fontSize: 13, lineHeight: 1.8, color: "text.secondary" }}>{fields.description}</Typography>
                <div className="mt-6 grid gap-4 border-t border-[#e4e6e2] pt-5 sm:grid-cols-3">
                  <div><Typography sx={{ color: "text.secondary", fontFamily: font, fontSize: 11 }}>Ngân sách</Typography><Typography sx={{ fontFamily: font, fontSize: 13, fontWeight: 700 }}>{Number(fields.budgetMin).toLocaleString("vi-VN")}–{Number(fields.budgetMax).toLocaleString("vi-VN")} VNĐ</Typography></div>
                  <div><Typography sx={{ color: "text.secondary", fontFamily: font, fontSize: 11 }}>Thời lượng</Typography><Typography sx={{ fontFamily: font, fontSize: 13, fontWeight: 700 }}>{fields.duration}</Typography></div>
                  <div><Typography sx={{ color: "text.secondary", fontFamily: font, fontSize: 11 }}>Hạn hoàn thành</Typography><Typography sx={{ fontFamily: font, fontSize: 13, fontWeight: 700 }}>{fields.deadline.split("-").reverse().join("/")}</Typography></div>
                </div>
                {fields.applicationDeadline && <Typography sx={{ mt: 2, color: "text.secondary", fontFamily: font, fontSize: 12 }}>Hạn nhận hồ sơ: {fields.applicationDeadline.split("-").reverse().join("/")}</Typography>}
              </SectionCard>
              <SectionCard>
                <SectionHeading number="2" title="Yêu cầu và bàn giao" />
                <Typography sx={{ fontFamily: font, fontSize: 12, fontWeight: 700, mb: 1 }}>Kỹ năng cần có</Typography>
                <div className="mb-5 flex flex-wrap gap-2">{fields.skills.map((skill) => <Chip key={skill} label={skill} size="small" sx={{ bgcolor: "#eef4ff", color: "#315da8", fontFamily: font, fontSize: 11 }} />)}</div>
                <Typography sx={{ fontFamily: font, fontSize: 12, fontWeight: 700, mb: 1 }}>Sản phẩm bàn giao</Typography>
                <ul className="space-y-2">{fields.deliverables.filter(Boolean).map((item, index) => <li key={`${item}-${index}`} className="flex items-start gap-2 text-[13px] leading-6 text-[#62645e]"><Check size={16} className="mt-1 shrink-0 text-[#16805b]" />{item}</li>)}</ul>
                <Typography sx={{ mt: 3, fontFamily: font, fontSize: 12, color: "text.secondary" }}>Ưu tiên bên thực hiện: {fields.preference === "both" ? "Cả cá nhân và team" : fields.preference === "individual" ? "Freelancer cá nhân" : "Team"}</Typography>
                {fields.referenceFiles.length > 0 && <Typography sx={{ mt: 1, fontFamily: font, fontSize: 12, color: "text.secondary" }}>Tệp tham khảo: {fields.referenceFiles.map((file) => file.name).join(", ")}</Typography>}
              </SectionCard>
              {fields.guidedBrief && <GuidedBriefSummary brief={fields.guidedBrief} />}
              <BriefRequirementsSummary project={{ tools: fields.tools.split(",").map(item => item.trim()).filter(Boolean), experience: fields.experience, audience: fields.audience, requirements: fields.requirements.split("\n").filter(Boolean) }} />
              <div className="flex flex-wrap justify-end gap-2">
                <Button type="button" variant="outlined" onClick={() => setIsPreview(false)} sx={{ ...buttonSx, borderRadius: 999 }}>Quay lại chỉnh sửa</Button>
                <Button type="button" variant="contained" onClick={publish} endIcon={<ArrowRight size={16} />} sx={{ ...buttonSx, borderRadius: 999, boxShadow: "none" }}>{isEditingPublished ? "Lưu thay đổi" : "Công bố dự án"}</Button>
              </div>
            </>
          ) : (
            <form noValidate onSubmit={(event) => { event.preventDefault(); openPreview(); }} className="space-y-5">
              {Object.values(errors).some(Boolean) && <Alert severity="error" sx={{ borderRadius: "12px", fontFamily: font, fontSize: 12 }}>Kiểm tra các trường được đánh dấu bên dưới trước khi xem trước.</Alert>}
              <SectionCard id="brief-basics">
                <SectionHeading number="1" title="Thông tin cơ bản" description="Các trường có dấu * là bắt buộc." />
                <div className="space-y-5">
                  <div><Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1 }}>Ảnh bìa dự án</Typography><BriefCoverInput value={fields.heroImage} error={errors.heroImage} onChange={value => setField("heroImage", value)} /></div>
                  <TextField fullWidth required label="Tên dự án" value={fields.title} onChange={(event) => setField("title", event.target.value)} slotProps={{ htmlInput: { maxLength: 100 }, formHelperText: { sx: { textAlign: errors.title ? "left" : "right" } } }} placeholder="Ví dụ: Thiết kế bộ nhận diện cho Nắng Studio" error={!!errors.title} helperText={errors.title} sx={formFieldsSx} />
                  {!fields.guidedBrief && <div className="pt-2">
                    <TextField select fullWidth required label="Lĩnh vực chuyên môn" value={fields.category} onChange={event => setField("category", event.target.value)} error={!!errors.category} helperText={errors.category} sx={formFieldsSx}>{(categories.includes(fields.category) ? categories : [...categories, fields.category]).map(item => <MenuItem key={item} value={item}>{item}</MenuItem>)}</TextField>
                  </div>}
                  <TextField fullWidth required multiline minRows={5} label="Mô tả chi tiết dự án" value={fields.description} onChange={(event) => setField("description", event.target.value)} placeholder="Bối cảnh, đối tượng và kết quả bạn mong muốn..." error={!!errors.description} helperText={errors.description} sx={formFieldsSx} />
                </div>
              </SectionCard>

              {!showGuidedTemplate && <Alert severity="info" action={<Button onClick={() => setShowGuidedTemplate(true)} sx={{ whiteSpace: "nowrap" }}>Bổ sung mẫu</Button>}>Thông tin cũ đã được điền sẵn. Bạn có thể sửa trực tiếp bên dưới; chỉ chọn mẫu mới nếu cần bổ sung yêu cầu chi tiết.</Alert>}
              {showGuidedTemplate && <GuidedBriefEditor fields={fields} error={errors.guidedBrief} onChange={(value, category, deliverables) => { setField("guidedBrief", value); setField("category", category); setField("deliverables", deliverables); }} />}
              <SectionCard id="brief-scope">
                <SectionHeading number="3" title="Kỹ năng và tài liệu tham khảo" />
                <div className="space-y-5">
                  <div>
                    <Typography sx={{ fontFamily: font, fontSize: 12, fontWeight: 700, mb: 1 }}>Kỹ năng yêu cầu *</Typography>
                    <div className="mb-2 flex flex-wrap gap-2">{fields.skills.map((skill) => <Chip key={skill} label={skill} onDelete={() => setField("skills", fields.skills.filter((item) => item !== skill))} sx={{ fontFamily: font, fontSize: 11 }} />)}</div>
                    <div className="flex items-start gap-2">
                      <TextField fullWidth size="small" value={skillInput} error={!!errors.skills} slotProps={{ htmlInput: { "aria-label": "Kỹ năng yêu cầu", "aria-required": true } }} onChange={(event) => setSkillInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === ",") { event.preventDefault(); addSkill(); } }} placeholder="Nhập kỹ năng rồi nhấn Enter" sx={formFieldsSx} />
                      <Button type="button" variant="outlined" onClick={addSkill} disabled={!skillInput.trim()} sx={{ ...buttonSx, flexShrink: 0, minHeight: 40 }}>Thêm</Button>
                    </div>
                    <FieldError message={errors.skills} />
                    {fields.guidedBrief && <Box sx={{ mt: 2 }}><Typography sx={{ fontSize: 12, color: "text.secondary", mb: 1 }}>Gợi ý theo dịch vụ — bấm để chọn hoặc bỏ</Typography><div className="flex flex-wrap gap-2">{creativeServices.find(service => service.id === fields.guidedBrief?.serviceId)?.skills.map(skill => {
                      const chosen = fields.skills.some(value => value.toLocaleLowerCase() === skill.toLocaleLowerCase());
                      return <Chip key={skill} label={`${chosen ? "✓ " : "+ "}${skill}`} aria-pressed={chosen} onClick={() => setField("skills", chosen ? fields.skills.filter(value => value.toLocaleLowerCase() !== skill.toLocaleLowerCase()) : [...fields.skills, skill])} variant={chosen ? "filled" : "outlined"} sx={{ bgcolor: chosen ? "#fff0e9" : "background.paper", color: chosen ? "primary.dark" : "text.secondary", minHeight: 34 }} />;
                    })}</div></Box>}

                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <TextField label="Công cụ sử dụng" value={fields.tools} onChange={event => setField("tools", event.target.value)} helperText="Phân cách bằng dấu phẩy, ví dụ: Figma, FigJam." sx={formFieldsSx} />
                    <TextField label="Kinh nghiệm mong muốn" value={fields.experience} onChange={event => setField("experience", event.target.value)} placeholder="Ví dụ: Đã thiết kế ứng dụng đặt lịch" sx={formFieldsSx} />
                    <TextField label="Ứng viên phù hợp" value={fields.audience} onChange={event => setField("audience", event.target.value)} multiline minRows={2} placeholder="Mô tả chuyên môn hoặc thế mạnh bạn tìm kiếm" sx={formFieldsSx} />
                    <TextField label="Yêu cầu bổ sung" value={fields.requirements} onChange={event => setField("requirements", event.target.value)} multiline minRows={2} helperText="Mỗi yêu cầu một dòng. Các trường này là tùy chọn." sx={formFieldsSx} />
                  </div>
                  {!fields.guidedBrief && <>
                  <div>
                    <Typography sx={{ fontFamily: font, fontSize: 12, fontWeight: 700, mb: 1 }}>Sản phẩm bàn giao *</Typography>
                    <div className="space-y-2">{fields.deliverables.map((item, index) => <div key={index} className="flex items-start gap-2">
                      <TextField fullWidth size="small" value={item} slotProps={{ htmlInput: { "aria-label": `Hạng mục bàn giao ${index + 1}`, "aria-required": true } }} error={!!errors.deliverables} onChange={(event) => setField("deliverables", fields.deliverables.map((current, currentIndex) => currentIndex === index ? event.target.value : current))} placeholder={`Hạng mục ${index + 1}`} sx={formFieldsSx} />
                      <Button type="button" aria-label={`Xóa hạng mục ${index + 1}`} onClick={() => setField("deliverables", fields.deliverables.filter((_, currentIndex) => currentIndex !== index))} disabled={fields.deliverables.length === 1} sx={{ minWidth: 40, width: 40, height: 40, color: "text.secondary" }}><X size={17} /></Button>
                    </div>)}</div>
                    <Button type="button" onClick={() => setField("deliverables", [...fields.deliverables, ""])} startIcon={<Plus size={16} />} sx={{ ...buttonSx, mt: 1, px: 0 }}>Thêm hạng mục bàn giao</Button>
                    <FieldError message={errors.deliverables} />
                  </div>

                  </>}
                  <div className="rounded-2xl border border-dashed border-[#d7dbd2] bg-[#fafbf9] p-4">
                    <Typography sx={{ fontFamily: font, fontSize: 12, fontWeight: 700, mb: 1 }}>Tệp tham khảo (tùy chọn)</Typography>
                    <Button component="label" variant="outlined" startIcon={<Upload size={16} />} sx={{ ...buttonSx, borderRadius: 999 }}>
                      Chọn tệp
                      <input type="file" multiple className="sr-only" onChange={(event) => { const files = Array.from(event.target.files ?? []).map((file) => ({ name: file.name, size: file.size })); setField("referenceFiles", [...fields.referenceFiles, ...files]); event.target.value = ""; }} />
                    </Button>
                    <Typography sx={{ mt: 1, color: "text.secondary", fontFamily: font, fontSize: 11 }}>Bản mẫu chỉ lưu tên tệp, chưa tải nội dung tệp lên máy chủ.</Typography>
                    <div className="mt-2 flex flex-wrap gap-2">{fields.referenceFiles.map((file, index) => <Chip key={`${file.name}-${index}`} icon={<FileText size={15} />} label={file.name} onDelete={() => setField("referenceFiles", fields.referenceFiles.filter((_, currentIndex) => currentIndex !== index))} sx={{ maxWidth: "100%", fontFamily: font, fontSize: 11 }} />)}</div>
                  </div>
                </div>
              </SectionCard>

              <SectionCard id="brief-budget">
                <SectionHeading number="4" title="Ngân sách và thời hạn" />
                <div className="mb-5">
                  <Typography sx={{ fontFamily: font, fontSize: 13, fontWeight: 600, mb: 1 }}>Thời lượng dự kiến</Typography>
                  <div className="flex flex-wrap gap-2">{durationOptions.map(duration => <Button key={duration} type="button" aria-pressed={fields.duration === duration} variant="outlined" onClick={() => setField("duration", duration)} sx={{ ...buttonSx, minHeight: 38, px: 2, borderColor: fields.duration === duration ? "primary.main" : "divider", bgcolor: fields.duration === duration ? "#fff0e9" : "background.paper", color: fields.duration === duration ? "primary.dark" : "text.secondary" }}>{duration}</Button>)}</div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField fullWidth required label="Ngân sách tối thiểu (VND)" value={formatMoneyInput(fields.budgetMin)} onChange={(event) => setField("budgetMin", moneyDigits(event.target.value))} slotProps={{ htmlInput: { inputMode: "numeric" } }} error={!!errors.budgetMin} helperText={errors.budgetMin} sx={formFieldsSx} />
                  <TextField fullWidth required label="Ngân sách tối đa (VND)" value={formatMoneyInput(fields.budgetMax)} onChange={(event) => setField("budgetMax", moneyDigits(event.target.value))} slotProps={{ htmlInput: { inputMode: "numeric" } }} error={!!errors.budgetMin} sx={formFieldsSx} />
                  <TextField fullWidth required type="date" label="Hạn hoàn thành" value={fields.deadline} onChange={(event) => setField("deadline", event.target.value)} error={!!errors.deadline} helperText={errors.deadline} slotProps={{ inputLabel: { shrink: true } }} sx={formFieldsSx} />
                  <TextField fullWidth type="date" label="Hạn nhận hồ sơ" value={fields.applicationDeadline} onChange={(event) => setField("applicationDeadline", event.target.value)} error={!!errors.applicationDeadline} helperText={errors.applicationDeadline} slotProps={{ inputLabel: { shrink: true } }} sx={formFieldsSx} />
                </div>
              </SectionCard>

              <SectionCard id="brief-performer">
                <SectionHeading number="5" title="Bên thực hiện ưu tiên" />
                <RadioGroup value={fields.preference} onChange={event => setField("preference", event.target.value as ProjectBrief["preference"])} aria-label="Bên thực hiện ưu tiên" sx={{ display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0,1fr))" } }}>
                  {([
                    ["both", "Cả cá nhân và team", "Mở rộng lựa chọn ứng viên"],
                    ["individual", "Freelancer cá nhân", "Trao đổi trực tiếp 1-1"],
                    ["team", "Team sáng tạo", "Nhóm có nhiều kỹ năng"],
                  ] as const).map(([value, label, description]) => <FormControlLabel key={value} value={value} control={<Radio size="small" sx={{ p: 0, mt: 0.25 }} />} label={<span className="block"><span className="block text-[13px] font-semibold">{label}</span><span className="mt-1 block text-xs leading-5 text-[#747773]">{description}</span></span>} sx={{ m: 0, gap: 1, alignItems: "flex-start", minHeight: 90, p: 1.5, border: "1px solid", borderRadius: 2, borderColor: fields.preference === value ? "primary.main" : "divider", bgcolor: fields.preference === value ? "#fff0e9" : "background.paper", "&:hover": { borderColor: "primary.main" } }} />)}
                </RadioGroup>
                <Typography sx={{ mt: 1.5, color: "text.secondary", fontFamily: font, fontSize: 11 }}>Ưu tiên hỗ trợ sắp xếp hồ sơ phù hợp, không tự động loại trừ các hồ sơ khác.</Typography>
              </SectionCard>

              <div className="sticky bottom-3 z-10 flex flex-wrap justify-end gap-2 rounded-2xl border border-[#e4e6e2] bg-white p-3 sm:p-4">
                {!isEditingPublished && <Button type="button" variant="outlined" onClick={saveDraft} sx={{ ...buttonSx, borderRadius: 999 }}>Lưu bản nháp</Button>}
                <Button type="submit" variant="contained" endIcon={<Eye size={16} />} sx={{ ...buttonSx, borderRadius: 999, boxShadow: "none" }}>Xem trước brief</Button>
              </div>
            </form>
          )}
        </div>
        <BriefFormSummary fields={fields} sections={sections} isPreview={isPreview} />
      </div>
    </Box>
  );
}

export function CreateBriefPage() {
  const editRoute = useMatch("/business/projects/:projectId/edit");
  const projectId = editRoute?.params.projectId;
  const { projects, saveProject } = useBusiness();
  const existingProject = projectId ? projects.find((project) => project.id === projectId) : undefined;
  if (projectId && !existingProject) {
    return <Card variant="outlined" sx={{ p: 4, borderRadius: "16px", textAlign: "center" }}>
      <Typography component="h1" sx={{ fontFamily: "Archivo, Arial, sans-serif", fontSize: 22, fontWeight: 700 }}>Không tìm thấy dự án</Typography>
      <Typography sx={{ mt: 1, mb: 2, color: "text.secondary", fontFamily: font, fontSize: 13 }}>Dự án này không tồn tại hoặc đã bị xóa.</Typography>
      <Button component={Link} to="/business/projects" variant="contained" sx={{ ...buttonSx, borderRadius: 999 }}>Về danh sách dự án</Button>
    </Card>;
  }
  return <BriefEditor key={projectId ?? "new"} existingProject={existingProject} saveProject={saveProject} />;
}
