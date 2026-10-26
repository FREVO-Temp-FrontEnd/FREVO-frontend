import { Alert, Avatar, Box, Button, Checkbox, Chip, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, IconButton, Tab, Tabs, TextField, Tooltip, Typography } from "@mui/material";
import { ArrowLeft, CheckCircle2, ClipboardCheck, ExternalLink, FileCheck, FilePenLine, Info, RotateCcw, X } from "lucide-react";
import type { Milestone } from "@/lib/types/marketplace.types";
import { useMilestoneReview } from "../hooks/useMilestoneReview";
import { milestoneMoney, workspaceDate } from "../utils/workspace";
import { MilestoneFiles } from "./MilestoneFiles";

interface AcceptanceReviewDialogProps {
  open: boolean;
  milestone: Milestone;
  performerName?: string;
  agreementReference?: string;
  initialDecision?: "approve" | "revision";
  readOnly?: boolean;
  actionError?: string;
  onClose: () => void;
  onApprove: () => void;
  onRequestRevision: (reason: string) => void;
}

export function AcceptanceReviewDialog({ open, milestone, performerName = "Bên thực hiện", agreementReference, initialDecision = "approve", readOnly = false, actionError, onClose, onApprove, onRequestRevision }: AcceptanceReviewDialogProps) {
  const review = useMilestoneReview(milestone, initialDecision);
  const allReviewed = review.reviewedCriteria.length === review.criteria.length;
  function submit() {
    if (readOnly) return;
    if (review.decision === "approve") { if (allReviewed) onApprove(); }
    else { const reason = review.revisionReason(); if (reason) onRequestRevision(reason); }
  }
  return <Dialog
    open={open}
    onClose={onClose}
    fullWidth
    maxWidth="lg"
    aria-labelledby="milestone-review-title"
    slotProps={{
      paper: {
        sx: {
          borderRadius: "20px",
          m: { xs: 1, sm: 3 },
          width: { xs: "calc(100% - 16px)", sm: "calc(100% - 48px)" },
          maxHeight: { xs: "calc(100dvh - 16px)", sm: "calc(100dvh - 48px)" },
          overflow: "hidden"
        }
      },
      backdrop: { sx: { bgcolor: "rgba(32,32,31,.5)", backdropFilter: "blur(3px)" } }
    }}>
    <DialogTitle component="div" sx={{ px: { xs: 2.5, md: 4 }, pt: 3, pb: 2 }}>
      <Box className="flex items-start gap-3">
        <Box
          sx={{
            width: 42,
            height: 42,
            display: { xs: "none", sm: "grid" },
            placeItems: "center",
            borderRadius: "50%",
            bgcolor: "#fff0e9",
            color: "primary.dark",
            flexShrink: 0
          }}>
          <ClipboardCheck size={22} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ color: "primary.dark", fontSize: 10, fontWeight: 600 }}>{agreementReference ?? "Thỏa thuận hợp tác"} · Không gian làm việc mô phỏng</Typography>
          <Typography
            component="h2"
            id="milestone-review-title"
            sx={{ fontFamily: "h2.fontFamily", fontWeight: 800, fontSize: { xs: 20, md: 25 }, mt: .5, lineHeight: 1.35 }}>{readOnly ? "Bàn giao" : "Nghiệm thu"} {milestone.name.replace(" · ", " — ")}</Typography>
          <Typography sx={{ fontSize: 12, color: "text.secondary", mt: .75 }}>Kiểm tra sản phẩm từ {performerName} và đối chiếu với nội dung đã thống nhất.</Typography>
        </Box>
        <IconButton onClick={onClose} aria-label="Đóng nghiệm thu" size="small">
          <X size={20} />
        </IconButton>
      </Box>
    </DialogTitle>
    {!readOnly && <Box sx={{ px: { xs: 2.5, md: 4 }, pb: 2 }}>
      <Tabs
        value={review.decision}
        onChange={(_, value: "approve" | "revision") => review.setDecision(value)}
        variant="fullWidth"
        aria-label="Quyết định nghiệm thu"
        sx={{
          minHeight: 42,
          bgcolor: "background.default",
          p: .5,
          borderRadius: "10px",
          "& .MuiTabs-indicator": { display: "none" },
          "& .MuiTab-root": {
            minHeight: 38,
            fontSize: { xs: 10, sm: 12 },
            textTransform: "none",
            color: "text.secondary",
            borderRadius: "8px",
            px: 1
          },
          "& .Mui-selected": { bgcolor: "background.paper", color: "primary.dark", boxShadow: "0 1px 4px #20201f0a" }
        }}>
        <Tab value="approve" icon={<CheckCircle2 size={16} />} iconPosition="start" label="Chấp nhận bàn giao" />
        <Tab
          value="revision"
          icon={<FilePenLine size={16} />}
          iconPosition="start"
          label={`Yêu cầu chỉnh sửa · ${review.used}/${review.allowed}`} />
      </Tabs>
    </Box>}
    <DialogContent sx={{ px: { xs: 2.5, md: 4 }, pt: "8px !important", pb: 3 }}>
      <Box className="grid items-start gap-6" sx={{ gridTemplateColumns: { xs: "1fr", md: "minmax(0,1fr) minmax(0,1fr)" } }}>
        <Box className="flex min-w-0 flex-col gap-4">
          <Box className="flex flex-wrap items-center justify-between gap-2">
            <Typography className="flex items-center gap-1.5" sx={{ fontWeight: 700, fontSize: 14 }}>
              <FileCheck size={17} />Sản phẩm bàn giao đã nộp
            </Typography>
            <Typography sx={{ fontSize: 10, color: "text.secondary" }}>{workspaceDate(milestone.submittedAt)}</Typography>
          </Box>
          <Box sx={{ p: 2, borderRadius: "12px", bgcolor: "background.default" }}>
            <Box className="flex items-center gap-2">
              <Avatar sx={{ width: 28, height: 28, bgcolor: "#fff0e9", color: "primary.dark", fontSize: 10 }}>{performerName.split(" ").slice(-2).map(item => item[0]).join("")}</Avatar>
              <Typography sx={{ fontSize: 12, fontWeight: 600 }}>{performerName}</Typography>
            </Box>
            <Typography sx={{ mt: 1.25, fontSize: 12, fontStyle: "italic", color: "text.secondary", lineHeight: 1.85 }}>“{milestone.submissionNotes || milestone.deliverable}”</Typography>
          </Box>
          {milestone.previewImage && <Box sx={{ borderRadius: "12px", overflow: "hidden", position: "relative", bgcolor: "background.default" }}>
            <Box
              component="img"
              src={milestone.previewImage}
              alt={milestone.previewAlt ?? "Ảnh sản phẩm bàn giao"}
              sx={{ display: "block", width: "100%", height: { xs: 190, md: 220 }, objectFit: "cover" }} />
            <Box
              sx={{
                position: "absolute",
                inset: "auto 0 0",
                p: 1.5,
                background: "linear-gradient(transparent, rgba(32,32,31,.75))",
                pt: 5,
                color: "#fff"
              }}
              className="flex items-end justify-between gap-2">
              <Typography sx={{ fontSize: 12, fontWeight: 600 }}>Moodboard & hướng thiết kế</Typography>
              <Button
                component="a"
                href={milestone.previewImage}
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<ExternalLink size={13} />}
                size="small"
                sx={{ bgcolor: "background.paper", color: "text.primary", fontSize: 10, px: 1.5, flexShrink: 0 }}>Xem ảnh</Button>
            </Box>
          </Box>}
          <MilestoneFiles compact files={milestone.submissionFiles ?? []} />
        </Box>
        <Box className="flex min-w-0 flex-col gap-4">
          <Box className="flex flex-wrap items-center justify-between gap-2">
            <Typography className="flex items-center gap-1.5" sx={{ fontSize: 14, fontWeight: 700 }}>
              <ClipboardCheck size={17} />Tiêu chí đã thỏa thuận
            </Typography>
            <Chip
              size="small"
              label={readOnly ? "Chỉ xem" : review.decision === "approve" ? `${review.reviewedCriteria.length}/${review.criteria.length} đã đối chiếu` : `${review.selectedCriteria.length} cần chỉnh sửa`}
              sx={{ height: 23, fontSize: 10, bgcolor: "background.default" }} />
          </Box>
          {review.criteria.map(criterion => {
            const checked = review.decision === "approve" ? review.reviewedCriteria.includes(criterion.id) : review.selectedCriteria.includes(criterion.id);
            return <Box
              key={criterion.id}
              sx={{
                p: 1.5,
                borderRadius: "12px",
                bgcolor: checked && review.decision === "approve" ? "#f0f8f3" : "background.default",
                border: "1px solid",
                borderColor: checked ? review.decision === "approve" ? "#c8e5d4" : "#f3cdbb" : "transparent"
              }}>
              <FormControlLabel
                disabled={readOnly}
                sx={{ m: 0, alignItems: "flex-start", width: "100%", "& .MuiFormControlLabel-label": { flex: 1, minWidth: 0 } }}
                control={<Checkbox
                  size="small"
                  checked={checked}
                  onChange={() => review.decision === "approve" ? review.toggleReviewed(criterion.id) : review.toggleCriterion(criterion.id)}
                  sx={{
                    p: .25,
                    mr: 1,
                    color: "text.secondary",
                    "&.Mui-checked": { color: review.decision === "approve" ? "#16805b" : "primary.main" }
                  }} />}
                label={<Box>
                  <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{criterion.title}</Typography>
                  <Typography sx={{ mt: .75, fontSize: 11, color: "text.secondary", lineHeight: 1.8 }}>{criterion.description}</Typography>
                </Box>} />
            </Box>;
          })}
          {!readOnly && review.decision === "revision" && <>
            <TextField
              label="Chi tiết góp ý và phần cần sửa"
              multiline
              minRows={4}
              fullWidth
              value={review.reason}
              onChange={event => review.setReason(event.target.value)}
              error={!!review.error && !review.reason.trim()}
              helperText="Góp ý dựa trên tiêu chí và phạm vi đã thống nhất."
              slotProps={{ htmlInput: { maxLength: 3000 } }}
              sx={{ "& .MuiInputBase-root": { fontSize: 13, bgcolor: "background.default" }, "& .MuiInputLabel-root": { fontSize: 13 } }} />
            <Box className="flex items-start gap-2" sx={{ p: 1.75, bgcolor: "#fff0e9", borderRadius: "12px" }}>
              <RotateCcw size={17} className="shrink-0" />
              <Typography sx={{ fontSize: 11, lineHeight: 1.7 }}>Đã dùng {review.used}/{review.allowed} lượt chỉnh sửa. Yêu cầu ngoài phạm vi hoặc vượt số lượt cần được hai bên thống nhất bằng đề xuất điều chỉnh.</Typography>
            </Box>
          </>}
          {review.decision === "approve" && <Box sx={{ p: 2, borderRadius: "12px", bgcolor: "#fff0e9" }}>
            <Typography className="flex items-center gap-2" sx={{ fontSize: 13, fontWeight: 700, color: "primary.dark" }}>
              <Info size={17} />{readOnly ? "Thông tin nghiệm thu" : "Sau khi xác nhận nghiệm thu"}
            </Typography>
            <Typography sx={{ fontSize: 12, color: "text.secondary", lineHeight: 1.85, mt: 1 }}>Mốc được ghi nhận hoàn thành. Các trạng thái thanh toán được theo dõi riêng trong sổ mô phỏng; không có giao dịch tiền thật.</Typography>
            <Box className="mt-4 flex items-center justify-between gap-2">
              <Typography sx={{ fontSize: 10, color: "text.secondary" }}>Ngân sách của mốc</Typography>
              <Typography sx={{ fontSize: 19, color: "primary.dark", fontWeight: 800 }}>{milestoneMoney(milestone)}</Typography>
            </Box>
          </Box>}
          {(review.error || actionError) && <Alert severity="error" sx={{ fontSize: 12, borderRadius: "10px" }}>{review.error || actionError}</Alert>}
        </Box>
      </Box>
    </DialogContent>
    <DialogActions
      sx={{
        bgcolor: "background.default",
        px: { xs: 2.5, md: 4 },
        py: 2,
        gap: 1,
        flexWrap: "wrap",
        borderTop: "1px solid",
        borderColor: "divider",
        justifyContent: "space-between",
        "& > :not(style) ~ :not(style)": { ml: 0 }
      }}>
      <Button onClick={onClose} startIcon={<ArrowLeft size={15} />} sx={{ color: "text.secondary", fontSize: 11 }}>Đóng / Xem lại sau</Button>
      {!readOnly && <Box className="flex flex-wrap items-center justify-end gap-2" sx={{ width: { xs: "100%", sm: "auto" } }}>
        {review.decision === "approve" && <Button
          onClick={() => review.setDecision("revision")}
          sx={{ fontSize: 11, color: "text.primary", bgcolor: "background.paper" }}
          startIcon={<FilePenLine size={15} />}>Yêu cầu chỉnh sửa</Button>}
        <Tooltip
          title={review.decision === "approve" && !allReviewed ? "Đánh dấu các tiêu chí sau khi bạn đã đối chiếu sản phẩm." : review.decision === "revision" && review.exhausted ? "Cần thống nhất đề xuất điều chỉnh khi đã hết lượt sửa." : ""}>
          <span>
            <Button
              variant="contained"
              onClick={submit}
              disabled={review.decision === "approve" ? !allReviewed : review.exhausted}
              startIcon={review.decision === "approve" ? <CheckCircle2 size={16} /> : <FilePenLine size={16} />}
              sx={{ px: 2.5, fontSize: 11 }}>{review.decision === "approve" ? "Xác nhận nghiệm thu" : "Gửi yêu cầu chỉnh sửa"}</Button>
          </span>
        </Tooltip>
      </Box>}
    </DialogActions>
  </Dialog>;
}
