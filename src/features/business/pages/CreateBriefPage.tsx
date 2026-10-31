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
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { useBusiness } from "@/lib/hooks/useBusiness";
import type { ProjectBrief } from "@/lib/types/marketplace.types";
import { useProjectBriefForm } from "@/features/business/hooks/useProjectBriefForm";
import { BriefFormSummary } from "@/features/business/components/BriefFormSummary";
import { formatMoneyInput, moneyDigits } from "@/lib/utils/money";

const categories = [
  "Nhận diện thương hiệu",
  "Thiết kế mạng xã hội",
  "Dựng video ngắn",
  "Viết nội dung",
  "Chiến lược & định hướng sáng tạo",
  "Thiết kế thương hiệu",
  "UI/UX & Website",
  "Nội dung sáng tạo",
  "Motion & Digital",
  "Nhiếp ảnh & Video",
];
const durations = ["2 tuần", "4 tuần", "6 tuần", "8 tuần"];
const font = '"Space Grotesk", Arial, sans-serif';
const buttonSx = {
  "&&": {
    fontFamily: font,
    fontSize: 13,
    fontWeight: 600,
    textTransform: "none",
  },
};

function SectionHeading({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-6 flex items-start gap-3 pb-3 border-b border-[#f0f2f5]">
      <Box
        component="span"
        sx={{
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
          width: 32,
          height: 32,
          borderRadius: "50%",
          bgcolor: "#fff0e9",
          border: "1px solid rgba(244, 73, 11, 0.25)",
          color: "primary.dark",
          fontFamily: font,
          fontSize: 13,
          fontWeight: 800,
        }}
      >
        {number}
      </Box>
      <div>
        <Typography
          component="h2"
          sx={{
            fontFamily: "Archivo, Arial, sans-serif",
            fontSize: 18,
            fontWeight: 700,
            lineHeight: 1.3,
            color: "text.primary",
          }}
        >
          {title}
        </Typography>
        {description && (
          <Typography
            sx={{
              mt: 0.5,
              color: "text.secondary",
              fontFamily: font,
              fontSize: 12.5,
              lineHeight: 1.6,
            }}
          >
            {description}
          </Typography>
        )}
      </div>
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  return message ? (
    <Typography
      role="alert"
      sx={{ color: "error.main", fontFamily: font, fontSize: 11, mt: 0.75 }}
    >
      {message}
    </Typography>
  ) : null;
}

function SectionCard({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <Card
      id={id}
      component="section"
      variant="outlined"
      sx={{
        p: { xs: 2.5, sm: 3.5 },
        scrollMarginTop: 24,
        borderColor: "divider",
        borderRadius: "16px",
        boxShadow: "0 1px 3px rgba(16, 24, 40, 0.06), 0 2px 6px rgba(16, 24, 40, 0.04)",
        bgcolor: "background.paper",
      }}
    >
      {children}
    </Card>
  );
}

function BriefEditor({
  existingProject,
  saveProject,
}: {
  existingProject?: ProjectBrief;
  saveProject: (project: ProjectBrief) => void;
}) {
  const navigate = useNavigate();
  const { candidates } = useBusiness();
  const [pendingPublish, setPendingPublish] = useState<ProjectBrief | null>(null);
  const [saveError, setSaveError] = useState("");
  const [showGuidedTemplate, setShowGuidedTemplate] = useState(
    !existingProject || !!existingProject.guidedBrief
  );
  const {
    fields,
    setField,
    errors,
    skillInput,
    setSkillInput,
    addSkill,
    isPreview,
    setIsPreview,
    openPreview,
    buildProject,
    sections,
  } = useProjectBriefForm(existingProject);
  const isEditingPublished = existingProject?.status === "published";
  const durationOptions = durations.includes(fields.duration)
    ? durations
    : [...durations, fields.duration];

  function saveDraft() {
    const project = buildProject("draft");
    if (!project) return;
    try {
      saveProject(project);
      navigate(`/business/projects/${project.id}`);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Không lưu được dự án. Vui lòng thử lại.");
    }
  }

  function publish() {
    const project = buildProject("published");
    if (!project) return;
    if (
      existingProject?.status === "published" &&
      candidates.some(
        (candidate) => candidate.projectId === project.id && candidate.status !== "not_selected"
      ) &&
      materialBriefChanges(existingProject, project).length
    ) {
      setPendingPublish(project);
      return;
    }
    try {
      saveProject(project);
      navigate(`/business/projects/${project.id}`);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Không lưu được dự án. Vui lòng thử lại.");
    }
  }

  const formFieldsSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      bgcolor: "#fcfdfd",
      transition: "border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease",
      "& fieldset": { borderColor: "#d0d5dd" },
      "&:hover fieldset": { borderColor: "#98a2b3" },
      "&.Mui-focused": {
        bgcolor: "#ffffff",
        "& fieldset": { borderColor: "primary.main", borderWidth: "1.5px" },
        boxShadow: "0 0 0 3px rgba(244, 73, 11, 0.12)",
      },
    },
    "&& .MuiInputBase-input": { fontFamily: font, fontSize: 14, color: "text.primary" },
    "&& .MuiInputBase-inputMultiline": { fontFamily: font, fontSize: 14, lineHeight: 1.7 },
    "&& .MuiInputLabel-root": {
      fontFamily: font,
      fontSize: 14,
      color: "#667085",
      "&.Mui-focused": { color: "primary.main" },
    },
  };

  return (
    <Box sx={{ fontFamily: font }}>
      <Dialog
        open={!!pendingPublish}
        onClose={() => setPendingPublish(null)}
        maxWidth="sm"
        fullWidth
        aria-labelledby="confirm-brief-change"
      >
        <DialogTitle id="confirm-brief-change">Cập nhật brief đã có ứng viên?</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: 14, lineHeight: 1.7 }}>
            Hệ thống giữ phiên bản cũ và thông báo cho các ứng viên liên quan. Thay đổi brief không
            tự sửa thỏa thuận hoặc có nghĩa ứng viên đã đồng ý với yêu cầu mới.
          </Typography>
          <div className="mt-4 flex flex-wrap gap-2">
            {pendingPublish &&
              existingProject &&
              materialBriefChanges(existingProject, pendingPublish).map((field) => (
                <Chip key={field} label={briefFieldLabels[field]} size="small" />
              ))}
          </div>
          {saveError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {saveError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPendingPublish(null)}>Quay lại kiểm tra</Button>
          <Button
            variant="contained"
            onClick={() => {
              if (!pendingPublish) return;
              try {
                saveProject(pendingPublish);
                navigate(`/business/projects/${pendingPublish.id}/brief`);
              } catch (issue) {
                setSaveError(issue instanceof Error ? issue.message : "Không lưu được thay đổi.");
              }
            }}
          >
            Lưu phiên bản mới
          </Button>
        </DialogActions>
      </Dialog>

      <div className="mb-6">
        <Button
          component={Link}
          to="/business/projects"
          startIcon={<ArrowLeft size={15} />}
          sx={{ ...buttonSx, mb: 2, px: 0, color: "text.secondary", "&:hover": { color: "primary.main" } }}
        >
          Dự án của tôi
        </Button>
        <Typography
          component="h1"
          sx={{
            fontFamily: "Archivo, Arial, sans-serif",
            fontSize: { xs: 28, sm: 32 },
            fontWeight: 800,
            lineHeight: 1.25,
            letterSpacing: "-0.02em",
          }}
        >
          {existingProject ? "Chỉnh sửa brief" : "Tạo dự án mới"}
        </Typography>
        <Typography
          sx={{
            mt: 1.25,
            maxWidth: 650,
            color: "text.secondary",
            fontFamily: font,
            fontSize: { xs: 13, sm: 14 },
            lineHeight: 1.65,
          }}
        >
          Chia sẻ nhu cầu để tìm người phù hợp với dự án của bạn.
        </Typography>
      </div>

      {saveError && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: "10px" }}>
          {saveError}
        </Alert>
      )}

      <BusinessQuotaSummary />

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 space-y-6">
          {isPreview ? (
            <>
              <Alert severity="info" sx={{ borderRadius: "12px", fontFamily: font, fontSize: 13 }}>
                Đây là bản xem trước. Hãy kiểm tra nội dung trước khi công bố dự án.
              </Alert>
              <SectionCard>
                {fields.heroImage && (
                  <Box
                    component="img"
                    src={fields.heroImage}
                    alt={`Ảnh bìa ${fields.title}`}
                    sx={{
                      width: "100%",
                      height: { xs: 180, sm: 240 },
                      objectFit: "cover",
                      borderRadius: "12px",
                      mb: 3,
                    }}
                  />
                )}
                <div className="mb-5 flex flex-wrap items-center gap-2">
                  <Chip
                    label={fields.category}
                    size="small"
                    sx={{ bgcolor: "#f2f3f0", fontFamily: font, fontSize: 11, fontWeight: 600 }}
                  />
                  <Chip
                    label="Bản xem trước"
                    size="small"
                    sx={{
                      bgcolor: "#fff0e9",
                      color: "primary.dark",
                      fontFamily: font,
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  />
                </div>
                <Typography
                  component="h2"
                  sx={{
                    fontFamily: "Archivo, Arial, sans-serif",
                    fontSize: { xs: 24, sm: 28 },
                    fontWeight: 700,
                    lineHeight: 1.3,
                    mb: 2,
                  }}
                >
                  {fields.title}
                </Typography>
                <Typography
                  sx={{
                    whiteSpace: "pre-line",
                    fontFamily: font,
                    fontSize: 13.5,
                    lineHeight: 1.8,
                    color: "text.secondary",
                  }}
                >
                  {fields.description}
                </Typography>
                <div className="mt-6 grid gap-4 rounded-xl border border-[#e4e6e2] bg-[#f8fafc] p-4 sm:grid-cols-3">
                  <div>
                    <Typography sx={{ color: "text.secondary", fontFamily: font, fontSize: 11 }}>
                      Ngân sách
                    </Typography>
                    <Typography
                      sx={{ fontFamily: font, fontSize: 14, fontWeight: 700, color: "#bd3d14" }}
                    >
                      {Number(fields.budgetMin).toLocaleString("vi-VN")}–
                      {Number(fields.budgetMax).toLocaleString("vi-VN")} VNĐ
                    </Typography>
                  </div>
                  <div>
                    <Typography sx={{ color: "text.secondary", fontFamily: font, fontSize: 11 }}>
                      Thời lượng
                    </Typography>
                    <Typography sx={{ fontFamily: font, fontSize: 14, fontWeight: 700 }}>
                      {fields.duration}
                    </Typography>
                  </div>
                  <div>
                    <Typography sx={{ color: "text.secondary", fontFamily: font, fontSize: 11 }}>
                      Hạn hoàn thành
                    </Typography>
                    <Typography sx={{ fontFamily: font, fontSize: 14, fontWeight: 700 }}>
                      {fields.deadline.split("-").reverse().join("/")}
                    </Typography>
                  </div>
                </div>
                {fields.applicationDeadline && (
                  <Typography
                    sx={{ mt: 2, color: "text.secondary", fontFamily: font, fontSize: 12 }}
                  >
                    Hạn nhận hồ sơ: {fields.applicationDeadline.split("-").reverse().join("/")}
                  </Typography>
                )}
              </SectionCard>

              <SectionCard>
                <SectionHeading number="2" title="Yêu cầu và bàn giao" />
                <Typography sx={{ fontFamily: font, fontSize: 12.5, fontWeight: 700, mb: 1.5 }}>
                  Kỹ năng cần có
                </Typography>
                <div className="mb-5 flex flex-wrap gap-2">
                  {fields.skills.map((skill) => (
                    <Chip
                      key={skill}
                      label={skill}
                      size="small"
                      sx={{ bgcolor: "#eef4ff", color: "#315da8", fontFamily: font, fontSize: 11 }}
                    />
                  ))}
                </div>
                <Typography sx={{ fontFamily: font, fontSize: 12.5, fontWeight: 700, mb: 1.5 }}>
                  Sản phẩm bàn giao
                </Typography>
                <ul className="space-y-2">
                  {fields.deliverables.filter(Boolean).map((item, index) => (
                    <li
                      key={`${item}-${index}`}
                      className="flex items-start gap-2 text-[13px] leading-6 text-[#62645e]"
                    >
                      <Check size={16} className="mt-1 shrink-0 text-[#16805b]" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Typography
                  sx={{ mt: 3, fontFamily: font, fontSize: 12.5, color: "text.secondary" }}
                >
                  Ưu tiên bên thực hiện:{" "}
                  <strong className="text-[#20201f]">
                    {fields.preference === "both"
                      ? "Cả cá nhân và team"
                      : fields.preference === "individual"
                      ? "Freelancer cá nhân"
                      : "Team sáng tạo"}
                  </strong>
                </Typography>
                {fields.referenceFiles.length > 0 && (
                  <Typography
                    sx={{ mt: 1, fontFamily: font, fontSize: 12.5, color: "text.secondary" }}
                  >
                    Tệp tham khảo: {fields.referenceFiles.map((file) => file.name).join(", ")}
                  </Typography>
                )}
              </SectionCard>

              {fields.guidedBrief && <GuidedBriefSummary brief={fields.guidedBrief} />}
              <BriefRequirementsSummary
                project={{
                  tools: fields.tools
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean),
                  experience: fields.experience,
                  audience: fields.audience,
                  requirements: fields.requirements.split("\n").filter(Boolean),
                }}
              />
              <div className="flex flex-wrap justify-end gap-2.5">
                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => setIsPreview(false)}
                  sx={{ ...buttonSx, borderRadius: 999, px: 3, py: 1 }}
                >
                  Quay lại chỉnh sửa
                </Button>
                <Button
                  type="button"
                  variant="contained"
                  onClick={publish}
                  endIcon={<ArrowRight size={16} />}
                  sx={{ ...buttonSx, borderRadius: 999, px: 3.5, py: 1, boxShadow: "none" }}
                >
                  {isEditingPublished ? "Lưu thay đổi" : "Công bố dự án"}
                </Button>
              </div>
            </>
          ) : (
            <form
              noValidate
              onSubmit={(event) => {
                event.preventDefault();
                openPreview();
              }}
              className="space-y-6"
            >
              {Object.values(errors).some(Boolean) && (
                <Alert
                  severity="error"
                  sx={{ borderRadius: "12px", fontFamily: font, fontSize: 13 }}
                >
                  Kiểm tra các trường được đánh dấu bên dưới trước khi xem trước.
                </Alert>
              )}

              <SectionCard id="brief-basics">
                <SectionHeading
                  number="1"
                  title="Thông tin cơ bản"
                  description="Các trường có dấu * là bắt buộc."
                />
                <div className="space-y-6">
                  <div>
                    <Typography sx={{ fontSize: 13, fontWeight: 700, mb: 1 }}>
                      Ảnh bìa dự án
                    </Typography>
                    <BriefCoverInput
                      value={fields.heroImage}
                      error={errors.heroImage}
                      onChange={(value) => setField("heroImage", value)}
                    />
                  </div>
                  <div>
                    <TextField
                      fullWidth
                      required
                      label="Tên dự án"
                      value={fields.title}
                      onChange={(event) => setField("title", event.target.value)}
                      slotProps={{
                        htmlInput: { maxLength: 100 },
                        formHelperText: { sx: { textAlign: errors.title ? "left" : "right" } },
                      }}
                      placeholder="Ví dụ: Thiết kế bộ nhận diện cho Nắng Studio"
                      error={!!errors.title}
                      helperText={errors.title}
                      sx={formFieldsSx}
                    />
                  </div>
                  {!fields.guidedBrief && (
                    <div className="pt-2">
                      <TextField
                        select
                        fullWidth
                        required
                        label="Lĩnh vực chuyên môn"
                        value={fields.category}
                        onChange={(event) => setField("category", event.target.value)}
                        error={!!errors.category}
                        helperText={errors.category}
                        sx={formFieldsSx}
                      >
                        {(categories.includes(fields.category)
                          ? categories
                          : [...categories, fields.category]
                        ).map((item) => (
                          <MenuItem key={item} value={item}>
                            {item}
                          </MenuItem>
                        ))}
                      </TextField>
                    </div>
                  )}
                  <div className="pt-3">
                    <TextField
                      fullWidth
                      required
                      multiline
                      minRows={5}
                      label="Mô tả chi tiết dự án"
                      value={fields.description}
                      onChange={(event) => setField("description", event.target.value)}
                      placeholder="Bối cảnh, đối tượng và kết quả bạn mong muốn..."
                      error={!!errors.description}
                      helperText={errors.description}
                      sx={formFieldsSx}
                    />
                  </div>
                </div>
              </SectionCard>

              {!showGuidedTemplate && (
                <Alert
                  severity="info"
                  sx={{ borderRadius: "12px" }}
                  action={
                    <Button onClick={() => setShowGuidedTemplate(true)} sx={{ whiteSpace: "nowrap" }}>
                      Bổ sung mẫu
                    </Button>
                  }
                >
                  Thông tin cũ đã được điền sẵn. Bạn có thể sửa trực tiếp bên dưới; chỉ chọn mẫu mới
                  nếu cần bổ sung yêu cầu chi tiết.
                </Alert>
              )}

              {showGuidedTemplate && (
                <GuidedBriefEditor
                  fields={fields}
                  error={errors.guidedBrief}
                  onChange={(value, category, deliverables) => {
                    setField("guidedBrief", value);
                    setField("category", category);
                    setField("deliverables", deliverables);
                  }}
                />
              )}

              <SectionCard id="brief-scope">
                <SectionHeading number="3" title="Kỹ năng và tài liệu tham khảo" />
                <div className="space-y-5">
                  <div>
                    <Typography sx={{ fontFamily: font, fontSize: 13, fontWeight: 700, mb: 1 }}>
                      Kỹ năng yêu cầu *
                    </Typography>
                    <div className="mb-2.5 flex flex-wrap gap-2">
                      {fields.skills.map((skill) => (
                        <Chip
                          key={skill}
                          label={skill}
                          onDelete={() =>
                            setField(
                              "skills",
                              fields.skills.filter((item) => item !== skill)
                            )
                          }
                          sx={{
                            fontFamily: font,
                            fontSize: 12,
                            fontWeight: 600,
                            bgcolor: "#eef4ff",
                            color: "#25539a",
                            border: "1px solid #c7d7f7",
                            "& .MuiChip-deleteIcon": {
                              color: "#25539a",
                              "&:hover": { color: "#1d4179" },
                            },
                          }}
                        />
                      ))}
                    </div>
                    <div className="flex items-start gap-2">
                      <TextField
                        fullWidth
                        size="small"
                        value={skillInput}
                        error={!!errors.skills}
                        slotProps={{
                          htmlInput: {
                            "aria-label": "Kỹ năng yêu cầu",
                            "aria-required": true,
                          },
                        }}
                        onChange={(event) => setSkillInput(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === ",") {
                            event.preventDefault();
                            addSkill();
                          }
                        }}
                        placeholder="Nhập kỹ năng rồi nhấn Enter"
                        sx={formFieldsSx}
                      />
                      <Button
                        type="button"
                        variant="outlined"
                        onClick={addSkill}
                        disabled={!skillInput.trim()}
                        sx={{
                          ...buttonSx,
                          flexShrink: 0,
                          minHeight: 40,
                          px: 2.5,
                          borderColor: "#d0d5dd",
                          "&:hover": { borderColor: "primary.main" },
                        }}
                      >
                        Thêm
                      </Button>
                    </div>
                    <FieldError message={errors.skills} />
                    {fields.guidedBrief && (
                      <Box sx={{ mt: 2.5 }}>
                        <Typography sx={{ fontSize: 12, color: "text.secondary", mb: 1 }}>
                          Gợi ý theo dịch vụ — bấm để chọn hoặc bỏ
                        </Typography>
                        <div className="flex flex-wrap gap-2">
                          {creativeServices
                            .find((service) => service.id === fields.guidedBrief?.serviceId)
                            ?.skills.map((skill) => {
                              const chosen = fields.skills.some(
                                (value) => value.toLocaleLowerCase() === skill.toLocaleLowerCase()
                              );
                              return (
                                <Chip
                                  key={skill}
                                  label={`${chosen ? "✓ " : "+ "}${skill}`}
                                  aria-pressed={chosen}
                                  onClick={() =>
                                    setField(
                                      "skills",
                                      chosen
                                        ? fields.skills.filter(
                                            (value) =>
                                              value.toLocaleLowerCase() !== skill.toLocaleLowerCase()
                                          )
                                        : [...fields.skills, skill]
                                    )
                                  }
                                  variant={chosen ? "filled" : "outlined"}
                                  sx={{
                                    bgcolor: chosen ? "#fff0e9" : "#f8fafc",
                                    color: chosen ? "primary.dark" : "text.secondary",
                                    border: "1px solid",
                                    borderColor: chosen ? "#f4490b" : "#d0d5dd",
                                    fontWeight: chosen ? 700 : 500,
                                    minHeight: 34,
                                    transition: "all 0.15s ease",
                                    "&:hover": {
                                      bgcolor: chosen ? "#ffe6db" : "#f1f5f9",
                                      borderColor: chosen ? "#f4490b" : "#98a2b3",
                                    },
                                  }}
                                />
                              );
                            })}
                        </div>
                      </Box>
                    )}
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <TextField
                      label="Công cụ sử dụng"
                      value={fields.tools}
                      onChange={(event) => setField("tools", event.target.value)}
                      helperText="Phân cách bằng dấu phẩy, ví dụ: Figma, FigJam."
                      sx={formFieldsSx}
                    />
                    <TextField
                      label="Kinh nghiệm mong muốn"
                      value={fields.experience}
                      onChange={(event) => setField("experience", event.target.value)}
                      placeholder="Ví dụ: Đã thiết kế ứng dụng đặt lịch"
                      sx={formFieldsSx}
                    />
                    <TextField
                      label="Ứng viên phù hợp"
                      value={fields.audience}
                      onChange={(event) => setField("audience", event.target.value)}
                      multiline
                      minRows={2}
                      placeholder="Mô tả chuyên môn hoặc thế mạnh bạn tìm kiếm"
                      sx={formFieldsSx}
                    />
                    <TextField
                      label="Yêu cầu bổ sung"
                      value={fields.requirements}
                      onChange={(event) => setField("requirements", event.target.value)}
                      multiline
                      minRows={2}
                      helperText="Mỗi yêu cầu một dòng. Các trường này là tùy chọn."
                      sx={formFieldsSx}
                    />
                  </div>

                  {!fields.guidedBrief && (
                    <>
                      <div>
                        <Typography sx={{ fontFamily: font, fontSize: 13, fontWeight: 700, mb: 1 }}>
                          Sản phẩm bàn giao *
                        </Typography>
                        <div className="space-y-2">
                          {fields.deliverables.map((item, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <TextField
                                fullWidth
                                size="small"
                                value={item}
                                slotProps={{
                                  htmlInput: {
                                    "aria-label": `Hạng mục bàn giao ${index + 1}`,
                                    "aria-required": true,
                                  },
                                }}
                                error={!!errors.deliverables}
                                onChange={(event) =>
                                  setField(
                                    "deliverables",
                                    fields.deliverables.map((current, currentIndex) =>
                                      currentIndex === index ? event.target.value : current
                                    )
                                  )
                                }
                                placeholder={`Hạng mục ${index + 1}`}
                                sx={formFieldsSx}
                              />
                              <Button
                                type="button"
                                aria-label={`Xóa hạng mục ${index + 1}`}
                                onClick={() =>
                                  setField(
                                    "deliverables",
                                    fields.deliverables.filter(
                                      (_, currentIndex) => currentIndex !== index
                                    )
                                  )
                                }
                                disabled={fields.deliverables.length === 1}
                                sx={{
                                  minWidth: 40,
                                  width: 40,
                                  height: 40,
                                  color: "text.secondary",
                                  "&:hover": { color: "error.main" },
                                }}
                              >
                                <X size={17} />
                              </Button>
                            </div>
                          ))}
                        </div>
                        <Button
                          type="button"
                          onClick={() => setField("deliverables", [...fields.deliverables, ""])}
                          startIcon={<Plus size={16} />}
                          sx={{ ...buttonSx, mt: 1, px: 0 }}
                        >
                          Thêm hạng mục bàn giao
                        </Button>
                        <FieldError message={errors.deliverables} />
                      </div>
                    </>
                  )}

                  <div className="rounded-xl border border-dashed border-[#cbd5e1] bg-[#f8fafc] p-4.5 transition-colors hover:border-[#98a2b3]">
                    <Typography sx={{ fontFamily: font, fontSize: 13, fontWeight: 700, mb: 1 }}>
                      Tệp tham khảo (tùy chọn)
                    </Typography>
                    <div className="flex flex-wrap items-center gap-3">
                      <Button
                        component="label"
                        variant="outlined"
                        startIcon={<Upload size={16} />}
                        sx={{
                          ...buttonSx,
                          borderRadius: 999,
                          borderColor: "#d0d5dd",
                          bgcolor: "#ffffff",
                          "&:hover": { borderColor: "primary.main", bgcolor: "#fff0e9" },
                        }}
                      >
                        Chọn tệp
                        <input
                          type="file"
                          multiple
                          className="sr-only"
                          onChange={(event) => {
                            const files = Array.from(event.target.files ?? []).map((file) => ({
                              name: file.name,
                              size: file.size,
                            }));
                            setField("referenceFiles", [...fields.referenceFiles, ...files]);
                            event.target.value = "";
                          }}
                        />
                      </Button>
                      <Typography sx={{ color: "text.secondary", fontFamily: font, fontSize: 12 }}>
                        Bản mẫu chỉ lưu tên tệp, chưa tải nội dung tệp lên máy chủ.
                      </Typography>
                    </div>
                    {fields.referenceFiles.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {fields.referenceFiles.map((file, index) => (
                          <Chip
                            key={`${file.name}-${index}`}
                            icon={<FileText size={15} />}
                            label={file.name}
                            onDelete={() =>
                              setField(
                                "referenceFiles",
                                fields.referenceFiles.filter(
                                  (_, currentIndex) => currentIndex !== index
                                )
                              )
                            }
                            sx={{
                              maxWidth: "100%",
                              fontFamily: font,
                              fontSize: 12,
                              bgcolor: "#ffffff",
                              border: "1px solid #d0d5dd",
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </SectionCard>

              <SectionCard id="brief-budget">
                <SectionHeading number="4" title="Ngân sách và thời hạn" />
                <div className="mb-5">
                  <Typography sx={{ fontFamily: font, fontSize: 13, fontWeight: 700, mb: 1.5 }}>
                    Thời lượng dự kiến
                  </Typography>
                  <div className="flex flex-wrap gap-2">
                    {durationOptions.map((duration) => (
                      <Button
                        key={duration}
                        type="button"
                        aria-pressed={fields.duration === duration}
                        variant="outlined"
                        onClick={() => setField("duration", duration)}
                        sx={{
                          ...buttonSx,
                          minHeight: 40,
                          px: 2.25,
                          borderRadius: "10px",
                          borderColor: fields.duration === duration ? "primary.main" : "#d0d5dd",
                          bgcolor: fields.duration === duration ? "#fff0e9" : "#fcfdfd",
                          color: fields.duration === duration ? "primary.dark" : "text.primary",
                          boxShadow: fields.duration === duration ? "0 0 0 1px #f4490b" : "none",
                          "&:hover": {
                            borderColor: "primary.main",
                            bgcolor: fields.duration === duration ? "#ffe6db" : "#f8fafc",
                          },
                        }}
                      >
                        {duration}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField
                    fullWidth
                    required
                    label="Ngân sách tối thiểu (VND)"
                    value={formatMoneyInput(fields.budgetMin)}
                    onChange={(event) => setField("budgetMin", moneyDigits(event.target.value))}
                    slotProps={{ htmlInput: { inputMode: "numeric" } }}
                    error={!!errors.budgetMin}
                    helperText={errors.budgetMin}
                    sx={formFieldsSx}
                  />
                  <TextField
                    fullWidth
                    required
                    label="Ngân sách tối đa (VND)"
                    value={formatMoneyInput(fields.budgetMax)}
                    onChange={(event) => setField("budgetMax", moneyDigits(event.target.value))}
                    slotProps={{ htmlInput: { inputMode: "numeric" } }}
                    error={!!errors.budgetMin}
                    sx={formFieldsSx}
                  />
                  <TextField
                    fullWidth
                    required
                    type="date"
                    label="Hạn hoàn thành"
                    value={fields.deadline}
                    onChange={(event) => setField("deadline", event.target.value)}
                    error={!!errors.deadline}
                    helperText={errors.deadline}
                    slotProps={{ inputLabel: { shrink: true } }}
                    sx={formFieldsSx}
                  />
                  <TextField
                    fullWidth
                    type="date"
                    label="Hạn nhận hồ sơ"
                    value={fields.applicationDeadline}
                    onChange={(event) => setField("applicationDeadline", event.target.value)}
                    error={!!errors.applicationDeadline}
                    helperText={errors.applicationDeadline}
                    slotProps={{ inputLabel: { shrink: true } }}
                    sx={formFieldsSx}
                  />
                </div>
              </SectionCard>

              <SectionCard id="brief-performer">
                <SectionHeading number="5" title="Bên thực hiện ưu tiên" />
                <RadioGroup
                  value={fields.preference}
                  onChange={(event) =>
                    setField("preference", event.target.value as ProjectBrief["preference"])
                  }
                  aria-label="Bên thực hiện ưu tiên"
                  sx={{
                    display: "grid",
                    gap: 1.5,
                    gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0,1fr))" },
                  }}
                >
                  {(
                    [
                      ["both", "Cả cá nhân và team", "Mở rộng lựa chọn ứng viên"],
                      ["individual", "Freelancer cá nhân", "Trao đổi trực tiếp 1-1"],
                      ["team", "Team sáng tạo", "Nhóm có nhiều kỹ năng"],
                    ] as const
                  ).map(([value, label, description]) => (
                    <FormControlLabel
                      key={value}
                      value={value}
                      control={
                        <Radio
                          size="small"
                          sx={{
                            p: 0,
                            mt: 0.25,
                            color: fields.preference === value ? "primary.main" : "#98a2b3",
                          }}
                        />
                      }
                      label={
                        <span className="block">
                          <span className="block text-[13.5px] font-semibold text-[#20201f]">
                            {label}
                          </span>
                          <span className="mt-1 block text-xs leading-5 text-[#667085]">
                            {description}
                          </span>
                        </span>
                      }
                      sx={{
                        m: 0,
                        gap: 1.25,
                        alignItems: "flex-start",
                        minHeight: 90,
                        p: 2,
                        border: "1.5px solid",
                        borderRadius: "12px",
                        borderColor: fields.preference === value ? "primary.main" : "#d0d5dd",
                        bgcolor: fields.preference === value ? "#fff0e9" : "#ffffff",
                        boxShadow:
                          fields.preference === value
                            ? "0 0 0 1px #f4490b, 0 1px 3px rgba(244,73,11,0.12)"
                            : "0 1px 2px rgba(16, 24, 40, 0.04)",
                        transition: "all 0.15s ease",
                        "&:hover": {
                          borderColor: "primary.main",
                          bgcolor: fields.preference === value ? "#fff0e9" : "#fcfdfd",
                        },
                      }}
                    />
                  ))}
                </RadioGroup>
                <Typography sx={{ mt: 1.75, color: "text.secondary", fontFamily: font, fontSize: 12 }}>
                  Ưu tiên hỗ trợ sắp xếp hồ sơ phù hợp, không tự động loại trừ các hồ sơ khác.
                </Typography>
              </SectionCard>

              <div className="sticky bottom-4 z-20 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#d0d5dd] bg-white/95 p-3.5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] backdrop-blur-md sm:p-4">
                <div className="flex items-center gap-2 text-xs text-[#667085]">
                  <span className="inline-block h-2 w-2 rounded-full bg-[#16805b]" />
                  <span>Tự động lưu tạm thời</span>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  {!isEditingPublished && (
                    <Button
                      type="button"
                      variant="outlined"
                      onClick={saveDraft}
                      sx={{
                        ...buttonSx,
                        borderRadius: 999,
                        borderColor: "#d0d5dd",
                        color: "text.primary",
                        px: 2.5,
                        py: 1,
                        "&:hover": { borderColor: "#98a2b3", bgcolor: "#f8fafc" },
                      }}
                    >
                      Lưu bản nháp
                    </Button>
                  )}
                  <Button
                    type="submit"
                    variant="contained"
                    endIcon={<Eye size={16} />}
                    sx={{
                      ...buttonSx,
                      borderRadius: 999,
                      px: 3,
                      py: 1,
                      boxShadow: "0 1px 3px rgba(244, 73, 11, 0.3)",
                    }}
                  >
                    Xem trước brief
                  </Button>
                </div>
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
  const existingProject = projectId
    ? projects.find((project) => project.id === projectId)
    : undefined;
  if (projectId && !existingProject) {
    return (
      <Card
        variant="outlined"
        sx={{
          p: 4,
          borderRadius: "16px",
          textAlign: "center",
          borderColor: "divider",
          boxShadow: "0 1px 3px rgba(16, 24, 40, 0.06)",
        }}
      >
        <Typography
          component="h1"
          sx={{ fontFamily: "Archivo, Arial, sans-serif", fontSize: 22, fontWeight: 700 }}
        >
          Không tìm thấy dự án
        </Typography>
        <Typography sx={{ mt: 1, mb: 2, color: "text.secondary", fontFamily: font, fontSize: 13 }}>
          Dự án này không tồn tại hoặc đã bị xóa.
        </Typography>
        <Button
          component={Link}
          to="/business/projects"
          variant="contained"
          sx={{ ...buttonSx, borderRadius: 999 }}
        >
          Về danh sách dự án
        </Button>
      </Card>
    );
  }
  return (
    <BriefEditor
      key={projectId ?? "new"}
      existingProject={existingProject}
      saveProject={saveProject}
    />
  );
}
