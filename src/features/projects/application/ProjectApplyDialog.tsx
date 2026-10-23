import { type FormEvent, useState } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  IconButton,
  keyframes,
  Alert, Avatar, Checkbox, MenuItem, Skeleton, TextField,
} from "@mui/material";
import type { Project } from "@/lib/types/project.types";
import { Send, RotateCcw, X, Info, Coffee, FileText, User, Users, Link as LinkIcon, Clock3 } from "lucide-react";
import { formatBudget } from "@/lib/utils/formatters";
import { formatMoneyInput, moneyDigits } from "@/lib/utils/money";
import { isDemoMode } from "@/lib/api/projectsApi";
import { useApplicationMaterials } from "../hooks/useApplicationMaterials";

const dialogSlideDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-28px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

interface ProjectApplyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project;
  reapplying: boolean;
  proposal: string;
  setProposal: (val: string) => void;
  portfolio: string;
  setPortfolio: (val: string) => void;
  submitting: boolean;
  submitError: string;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export function ProjectApplyDialog({
  isOpen,
  onClose,
  project,
  reapplying,
  proposal,
  setProposal,
  portfolio,
  setPortfolio,
  submitting,
  submitError,
  onSubmit,
}: ProjectApplyDialogProps) {
  const [applicantType, setApplicantType] = useState<"individual" | "team">("individual");
  const materials = useApplicationMaterials(applicantType, isOpen);

  const budgetDefault = project
    ? Math.round((project.min + project.max) / 2) * 1_000_000
    : 0;

  return (
    <Dialog
      open={isOpen}
      onClose={submitting ? undefined : onClose}
      aria-labelledby="apply-title"
      slotProps={{
        backdrop: {
          sx: { backgroundColor: "rgba(32,25,21,.5)", backdropFilter: "blur(4px)" },
        },
        paper: {
          sx: {
            width: "min(700px, calc(100vw - 32px))",
            m: "16px",
            maxWidth: "calc(100vw - 32px)",
            border: 0,
            borderRadius: "24px",
            boxShadow: "0 24px 90px rgba(32, 25, 21, 0.22)",
            overflow: "hidden",
            animation: isOpen
              ? `${dialogSlideDown} 0.3s cubic-bezier(0.22, 1, 0.36, 1) both`
              : "none",
          },
        },
      }}
    >
      <DialogContent sx={{ p: 0, overflow: "hidden" }}>
        <Box
          component="form"
          id="apply-form"
          onSubmit={onSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            maxHeight: "calc(100dvh - 48px)",
            overflow: "hidden",
            p: 0,
          }}
        >
          {/* ── HEADER ── */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              p: { xs: "18px 18px 14px", sm: "22px 24px 16px" },
              borderBottom: "1px solid #f0eeee",
              flexShrink: 0,
              bgcolor: "#fff",
            }}
          >
            <Box
              sx={{
                width: 34,
                height: 34,
                display: "grid",
                placeItems: "center",
                borderRadius: "50%",
                bgcolor: "#fff0e9",
                color: "#ab2e00",
                flexShrink: 0,
              }}
            >
              {reapplying ? <RotateCcw size={18} aria-hidden="true" /> : <Send size={18} aria-hidden="true" />}
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                id="apply-title"
                component="h2"
                sx={{
                  fontSize: 20,
                  fontWeight: 900,
                  color: "#1b1c1c",
                  letterSpacing: "-0.01em",
                  lineHeight: 1.2,
                  m: 0,
                }}
              >
                {reapplying ? "Ứng tuyển lại dự án" : "Ứng tuyển dự án"}
                <Typography component="span" sx={{ color: "#ab2e00", fontWeight: 900, fontSize: "inherit" }}>
                  .
                </Typography>
              </Typography>
            </Box>
            <IconButton
              aria-label="Đóng"
              onClick={onClose}
              disabled={submitting}
              sx={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                bgcolor: "#f5f3f3",
                color: "#5b4039",
                p: 0,
                "&:hover": { bgcolor: "#ece0db" },
              }}
            >
              <X size={16} />
            </IconButton>
          </Box>

          {/* ── SCROLLABLE BODY ── */}
          <Box
            sx={{
              overflowY: "auto",
              overflowX: "hidden",
              p: { xs: "16px 18px 8px", sm: "20px 24px 8px" },
              flex: 1,
              minWidth: 0,
              minHeight: 0,
              display: "flex",
              flexDirection: "column",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            {/* Project terms banner */}
            {project && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "10px",
                  p: "10px 14px",
                  borderRadius: "14px",
                  bgcolor: "rgba(255, 200, 170, 0.2)",
                  border: "1px solid rgba(255, 181, 160, 0.4)",
                  mb: "10px",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Coffee size={15} color="#ab2e00" />
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#1b1c1c" }}>
                    {project.company}
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#ab2e00", whiteSpace: "nowrap" }}>
                  Ngân sách: {formatBudget(project)}
                </Typography>
              </Box>
            )}

            {/* Info note */}
            {isDemoMode && (
              <Typography
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: 11,
                  color: "#75655f",
                  mb: "16px",
                  pl: "2px",
                }}
              >
                <Info size={13} aria-hidden="true" />
                Thao tác ứng tuyển minh họa — dữ liệu không lưu thật.
              </Typography>
            )}

            {reapplying && (
              <Typography sx={{ mb: "16px", color: "#4c7651", fontSize: 12, fontWeight: 700 }}>
                Bạn đã ứng tuyển dự án này. Gửi lại sẽ cập nhật hồ sơ hiện có.
              </Typography>
            )}

            {/* ── 1. Tư cách ứng tuyển ── */}
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <input type="hidden" name="applicantType" value={applicantType} />
              {materials.selectedWorkIds.map(id => <input key={id} type="hidden" name="portfolioWorkIds" value={id} />)}
              <input type="hidden" name="resumeId" value={materials.resumeId} />

              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: "8px" }}>
                <Typography component="label" sx={{ fontSize: 13, fontWeight: 700, color: "#1b1c1c" }}>
                  Tư cách ứng tuyển <span style={{ color: "#ab2e00" }}>*</span>
                </Typography>
                <Typography component="span" sx={{ fontSize: 11, color: "#907067" }}>
                  Bắt buộc
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
                  gap: "10px",
                }}
              >
                {/* Cá nhân */}
                <Box
                  component="button"
                  type="button"
                  onClick={() => setApplicantType("individual")}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    p: "12px 14px",
                    borderRadius: "16px",
                    border: "2px solid",
                    borderColor: applicantType === "individual" ? "#ab2e00" : "#e4e2e2",
                    bgcolor: applicantType === "individual" ? "rgba(255, 219, 209, 0.18)" : "#f9f8f7",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s ease",
                    fontFamily: "inherit",
                    "&:hover": { bgcolor: "#f5f3f3" },
                  }}
                >
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      bgcolor: applicantType === "individual" ? "#ab2e00" : "#e4e2e2",
                      color: applicantType === "individual" ? "#fff" : "#5b4039",
                      display: "grid",
                      placeItems: "center",
                      flexShrink: 0,
                      transition: "all 0.15s ease",
                    }}
                  >
                    <User size={18} />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "1px" }}>
                    <Typography noWrap sx={{ fontSize: 13, fontWeight: 700, color: "#1b1c1c" }}>
                      Cá nhân
                    </Typography>
                    <Typography noWrap sx={{ fontSize: 11, color: "#75655f" }}>
                      Minh Anh • Brand Designer
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      border: "2px solid",
                      borderColor: applicantType === "individual" ? "#ab2e00" : "#c5b3ac",
                      bgcolor: applicantType === "individual" ? "#ab2e00" : "transparent",
                      display: "grid",
                      placeItems: "center",
                      flexShrink: 0,
                    }}
                  >
                    {applicantType === "individual" && (
                      <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: "#fff" }} />
                    )}
                  </Box>
                </Box>

                {/* Đại diện Team */}
                <Box
                  component="button"
                  type="button"
                  onClick={() => setApplicantType("team")}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    p: "12px 14px",
                    borderRadius: "16px",
                    border: "2px solid",
                    borderColor: applicantType === "team" ? "#ab2e00" : "#e4e2e2",
                    bgcolor: applicantType === "team" ? "rgba(255, 219, 209, 0.18)" : "#f9f8f7",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.15s ease",
                    fontFamily: "inherit",
                    "&:hover": { bgcolor: "#f5f3f3" },
                  }}
                >
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      bgcolor: applicantType === "team" ? "#ab2e00" : "#e4e2e2",
                      color: applicantType === "team" ? "#fff" : "#5b4039",
                      display: "grid",
                      placeItems: "center",
                      flexShrink: 0,
                      transition: "all 0.15s ease",
                    }}
                  >
                    <Users size={18} />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "1px" }}>
                    <Typography noWrap sx={{ fontSize: 13, fontWeight: 700, color: "#1b1c1c" }}>
                      Đại diện Team
                    </Typography>
                    <Typography noWrap sx={{ fontSize: 11, color: "#75655f" }}>
                      Agency / Creative Studio
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      border: "2px solid",
                      borderColor: applicantType === "team" ? "#ab2e00" : "#c5b3ac",
                      bgcolor: applicantType === "team" ? "#ab2e00" : "transparent",
                      display: "grid",
                      placeItems: "center",
                      flexShrink: 0,
                    }}
                  >
                    {applicantType === "team" && (
                      <Box sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: "#fff" }} />
                    )}
                  </Box>
                </Box>
              </Box>

              {/* ── 2. Thư đề xuất ── */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mt: "20px",
                  mb: "8px",
                }}
              >
                <Typography
                  component="label"
                  htmlFor="proposal"
                  sx={{ fontSize: 13, fontWeight: 700, color: "#1b1c1c" }}
                >
                  Thư đề xuất &amp; Kế hoạch (Proposal)
                </Typography>
                <Typography component="span" sx={{ fontSize: 11, color: "#907067" }}>
                  Không bắt buộc
                </Typography>
              </Box>

              <Box
                component="textarea"
                id="proposal"
                name="proposal"
                value={proposal}
                onChange={(e) => setProposal(e.target.value)}
                maxLength={2000}
                minLength={50}
                placeholder="Vì sao bạn phù hợp với dự án này? Cách bạn sẽ tiếp cận..."
                sx={{
                  width: "100%",
                  minHeight: "120px",
                  height: "130px",
                  resize: "vertical",
                  p: "12px 14px",
                  borderRadius: "16px",
                  border: "1.5px solid transparent",
                  bgcolor: "#f5f3f3",
                  fontFamily: "inherit",
                  fontSize: 13,
                  lineHeight: 1.7,
                  color: "#1b1c1c",
                  boxSizing: "border-box",
                  transition: "all 0.15s ease",
                  "&::placeholder": { color: "#b0a09a" },
                  "&:focus": {
                    outline: "none",
                    borderColor: "#ab2e00",
                    bgcolor: "#fff",
                  },
                }}
              />
              <Typography sx={{ fontSize: 11, color: "#907067", textAlign: "right", mt: "4px" }}>
                {proposal.length} / 2000 ký tự
              </Typography>

              <Typography sx={{ fontSize: 13, fontWeight: 700, mt: 3, mb: 1 }}>Tác phẩm gửi kèm ({materials.selectedWorkIds.length})</Typography>
              <Typography sx={{ fontSize: 12, color: "text.secondary", mb: 1.5 }}>Chọn một hoặc nhiều dự án bạn muốn doanh nghiệp xem trong đơn này.</Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1 }}>
                {materials.works.map(work => <Box key={work.id} component="label" sx={{ display: "flex", gap: 1, alignItems: "center", minWidth: 0, p: 1.25, border: "1px solid", borderColor: materials.selectedWorkIds.includes(work.id) ? "primary.main" : "divider", bgcolor: materials.selectedWorkIds.includes(work.id) ? "#fff0e9" : "background.paper", borderRadius: 2, cursor: "pointer" }}>
                  <Checkbox size="small" checked={materials.selectedWorkIds.includes(work.id)} onChange={() => materials.toggleWork(work.id)} sx={{ p: 0.5 }} slotProps={{ input: { "aria-label": `Gửi kèm ${work.title}` } }} />
                  <Avatar variant="rounded" src={work.media.find(media => media.kind === "image")?.src} alt="" sx={{ width: 36, height: 36, bgcolor: "background.default", fontSize: 12, color: "text.secondary" }}>{work.brand.slice(0, 2)}</Avatar>
                  <div className="min-w-0"><Typography sx={{ fontSize: 12, fontWeight: 600, lineHeight: 1.5 }}>{work.title}</Typography><Typography sx={{ fontSize: 11, color: "text.secondary" }}>{work.category}</Typography></div>
                </Box>)}
              </Box>
              {!materials.loading && !materials.error && !materials.works.length && <Alert severity="info" sx={{ mt: 1 }}>Chưa có tác phẩm công khai. Bạn có thể gửi liên kết portfolio bên dưới.</Alert>}
              <Box sx={{ mt: 3, p: 2, border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
                <Typography sx={{ mb: 1.5, fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 1 }}><FileText size={16} />CV gửi kèm</Typography>
                {materials.loading ? <Skeleton variant="rectangular" height={44} sx={{ borderRadius: 1.5 }} /> : materials.error ? <Alert severity="error" action={<Button onClick={materials.reload}>Thử lại</Button>}>{materials.error}</Alert> : <>
                  <TextField select fullWidth size="small" label="Chọn một CV" value={materials.resumeId} onChange={event => materials.setResumeId(event.target.value)} sx={{ "& .MuiSelect-select": { fontSize: 12 } }}>
                    <MenuItem value="" sx={{ fontSize: 12 }}>{materials.primaryResume ? `CV mặc định: ${materials.primaryResume.name}` : "Chưa có CV mặc định"}</MenuItem>
                    {materials.resumes.map(resume => <MenuItem key={resume.id} value={resume.id} sx={{ fontSize: 12 }}>{resume.name}</MenuItem>)}
                  </TextField>
                  <Typography sx={{ mt: 1, fontSize: 11, color: "text.secondary", lineHeight: 1.6 }}>{materials.primaryResume ? "Không chọn CV khác sẽ gửi CV mặc định. Mỗi đơn chỉ gửi một CV." : "Bạn chưa có CV. Đơn vẫn có thể gửi với portfolio và lời giới thiệu."}</Typography>
                </>}
              </Box>

              {/* Portfolio link */}
              <Typography
                component="label"
                htmlFor="portfolio"
                sx={{ fontSize: 13, fontWeight: 700, color: "#1b1c1c", mt: "12px", mb: "8px", display: "block" }}
              >
                Liên kết portfolio bổ sung
              </Typography>

              <Box sx={{ position: "relative", display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    position: "absolute",
                    left: 12,
                    color: "#907067",
                    display: "flex",
                    alignItems: "center",
                    pointerEvents: "none",
                  }}
                >
                  <LinkIcon size={14} />
                </Box>
                <Box
                  component="input"
                  id="portfolio"
                  name="portfolio"
                  type="url"
                  value={portfolio}
                  onChange={(e) => setPortfolio(e.target.value)}
                  placeholder="https://behance.net/ten-ban"
                  required={materials.selectedWorkIds.length === 0}
                  sx={{
                    width: "100%",
                    height: "40px",
                    p: "0 14px 0 34px",
                    borderRadius: "20px",
                    border: "1.5px solid transparent",
                    bgcolor: "#f5f3f3",
                    fontFamily: "inherit",
                    fontSize: 12,
                    color: "#1b1c1c",
                    boxSizing: "border-box",
                    transition: "all 0.15s ease",
                    "&::placeholder": { color: "#b0a09a" },
                    "&:focus": {
                      outline: "none",
                      borderColor: "#ab2e00",
                      bgcolor: "#fff",
                    },
                  }}
                />
              </Box>

              {/* ── 4. Ngân sách & Thời gian hoàn thành ── */}
              {project && (
                <>
                  <Typography
                    sx={{ fontSize: 13, fontWeight: 700, color: "#1b1c1c", mt: "20px", mb: "10px", display: "block" }}
                  >
                    Ngân sách đề xuất &amp; Thời gian hoàn thành
                  </Typography>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
                      gap: "12px",
                    }}
                  >
                    <Box sx={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <Typography
                        component="label"
                        htmlFor="proposed-budget"
                        sx={{ fontSize: 11, fontWeight: 600, color: "#75655f", textTransform: "uppercase", letterSpacing: "0.03em" }}
                      >
                        Ngân sách đề xuất (VNĐ)
                      </Typography>
                      <Box sx={{ position: "relative", display: "flex", alignItems: "center" }}>
                        <Box
                          component="input"
                          id="proposed-budget"
                          name="proposedBudget"
                          type="text"
                          inputMode="numeric"
                          defaultValue={formatMoneyInput(budgetDefault)}
                          onChange={event => {
                            const input = event.currentTarget;
                            input.value = formatMoneyInput(input.value);
                            const amount = Number(moneyDigits(input.value));
                            input.setCustomValidity(amount >= 1000 && amount % 1000 === 0 ? "" : "Nhập số tiền từ 1.000 VNĐ, theo bước 1.000 VNĐ.");
                          }}
                          required
                          sx={{
                            width: "100%",
                            height: "44px",
                            p: "0 44px 0 14px",
                            borderRadius: "16px",
                            border: "1.5px solid transparent",
                            bgcolor: "#f5f3f3",
                            fontFamily: "inherit",
                            fontSize: 15,
                            fontWeight: 800,
                            color: "#ab2e00",
                            boxSizing: "border-box",
                            transition: "all 0.15s ease",
                            "&:focus": {
                              outline: "none",
                              borderColor: "#ab2e00",
                              bgcolor: "#fff",
                            },
                          }}
                        />
                        <Typography
                          component="span"
                          sx={{
                            position: "absolute",
                            right: 12,
                            fontSize: 11,
                            fontWeight: 700,
                            color: "#907067",
                            pointerEvents: "none",
                          }}
                        >
                          VNĐ
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      <Typography
                        component="label"
                        htmlFor="delivery-estimate"
                        sx={{ fontSize: 11, fontWeight: 600, color: "#75655f", textTransform: "uppercase", letterSpacing: "0.03em" }}
                      >
                        Thời gian hoàn thành dự kiến
                      </Typography>
                      <Box sx={{ position: "relative", display: "flex", alignItems: "center" }}>
                        <Box
                          component="input"
                          id="delivery-estimate"
                          name="deliveryEstimate"
                          defaultValue={project.duration}
                          maxLength={80}
                          required
                          placeholder="Ví dụ: 4 tuần"
                          sx={{
                            width: "100%",
                            height: "44px",
                            p: "0 44px 0 14px",
                            borderRadius: "16px",
                            border: "1.5px solid transparent",
                            bgcolor: "#f5f3f3",
                            fontFamily: "inherit",
                            fontSize: 15,
                            fontWeight: 800,
                            color: "#ab2e00",
                            boxSizing: "border-box",
                            transition: "all 0.15s ease",
                            "&::placeholder": { color: "#b0a09a" },
                            "&:focus": {
                              outline: "none",
                              borderColor: "#ab2e00",
                              bgcolor: "#fff",
                            },
                          }}
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            right: 12,
                            color: "#907067",
                            display: "flex",
                            alignItems: "center",
                            pointerEvents: "none",
                          }}
                        >
                          <Clock3 size={16} />
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </>
              )}
            </Box>

            {/* Error */}
            {submitError && (
              <Box
                role="alert"
                sx={{
                  mt: "8px",
                  p: "10px 14px",
                  borderRadius: "12px",
                  bgcolor: "#ffdad6",
                  color: "#93000a",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {submitError}
              </Box>
            )}
          </Box>

          {/* ── FOOTER ── */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "10px",
              p: { xs: "12px 18px 16px", sm: "14px 24px 20px" },
              borderTop: "1px solid #f0eeee",
              flexShrink: 0,
              bgcolor: "#fff",
            }}
          >
            <Button
              type="button"
              onClick={onClose}
              disabled={submitting}
              sx={{
                height: 42,
                px: "20px",
                borderRadius: "999px",
                bgcolor: "#f5f3f3",
                color: "#1b1c1c",
                fontSize: 13,
                fontWeight: 600,
                textTransform: "none",
                "&:hover": { bgcolor: "#ece0db" },
              }}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={submitting || materials.loading || !!materials.error}
              sx={{
                height: 42,
                px: "22px",
                borderRadius: "999px",
                bgcolor: "#ab2e00",
                color: "#fff",
                fontSize: 13,
                fontWeight: 700,
                textTransform: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                boxShadow: "2px 2px 0 #1b1c1c22",
                "&:hover": {
                  bgcolor: "#8f2600",
                  filter: "brightness(1.08)",
                },
              }}
            >
              {reapplying ? <RotateCcw size={15} aria-hidden="true" /> : <Send size={15} aria-hidden="true" />}
              {submitting ? "Đang gửi..." : reapplying ? "Gửi lại đơn ứng tuyển" : "Gửi đơn ứng tuyển"}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
