import { type FormEvent, useMemo, useState } from "react";
import { Link } from "react-router";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  IconButton,
  keyframes,
  Alert, Avatar, Checkbox, MenuItem, TextField,
} from "@mui/material";
import type { Project } from "@/lib/types/project.types";
import { Send, RotateCcw, X, Info, Coffee, FileText, User, Users, Clock3 } from "lucide-react";
import { formatBudget } from "@/lib/utils/formatters";
import { formatMoneyInput, moneyDigits } from "@/lib/utils/money";
import { isDemoMode } from "@/lib/api/projectsApi";
import { useApplicationMaterials } from "../hooks/useApplicationMaterials";
import { useAuthSession } from "@/lib/hooks/useAuthSession";
import { readRepresentedTeams } from "@/lib/storage/representedTeams";
import { validateResumeFile } from "@/lib/utils/validateResumeFile";

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
  submitting: boolean;
  submitError: string;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export function ProjectApplyDialog({
  isOpen,
  onClose,
  project,
  reapplying,
  submitting,
  submitError,
  onSubmit,
}: ProjectApplyDialogProps) {
  const [applicantType, setApplicantType] = useState<"individual" | "team">("individual");
  const [teamId, setTeamId] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvError, setCvError] = useState("");
  const { user } = useAuthSession();
  const teamLibrary = useMemo(() => {
    try { return { teams: user ? readRepresentedTeams(user) : [], error: "" }; }
    catch (error) { return { teams: [], error: error instanceof Error ? error.message : "Không đọc được danh sách nhóm." }; }
  }, [user]);
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

              {applicantType === "team" && <Box sx={{ mt: 2 }}>
                <Typography component="label" htmlFor="apply-team" sx={{ display: "block", mb: 1, fontSize: 13, fontWeight: 700 }}>Chọn nhóm ứng tuyển *</Typography>
                {teamLibrary.error ? <Alert severity="error">{teamLibrary.error}</Alert> : teamLibrary.teams.length ? <TextField id="apply-team" select name="teamId" fullWidth size="small" required value={teamId} onChange={event => setTeamId(event.target.value)} slotProps={{ select: { displayEmpty: true } }}>
                  <MenuItem value="" disabled>Chọn một nhóm bạn đại diện</MenuItem>
                  {teamLibrary.teams.map(team => <MenuItem key={team.id} value={team.id}>{team.name} · {team.discipline}</MenuItem>)}
                </TextField> : <Alert severity="info" action={<Button component={Link} to="/team/profile" size="small">Tạo nhóm</Button>}>Bạn chưa có nhóm. Hãy tạo nhóm trước khi ứng tuyển theo Team.</Alert>}
              </Box>}

              {applicantType === "individual" && <>
              <Typography sx={{ fontSize: 13, fontWeight: 700, mt: 3, mb: 1 }}>Tác phẩm gửi kèm ({materials.selectedWorkIds.length})</Typography>
              <Typography sx={{ fontSize: 12, color: "text.secondary", mb: 1.5 }}>Chọn tác phẩm bạn muốn doanh nghiệp xem trong đơn này (không bắt buộc).</Typography>
              {materials.error && <Alert severity="warning" action={<Button onClick={materials.reload}>Thử lại</Button>}>{materials.error} Bạn vẫn có thể gửi CV.</Alert>}
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1 }}>
                {materials.works.map(work => <Box key={work.id} component="label" sx={{ display: "flex", gap: 1, alignItems: "center", minWidth: 0, p: 1.25, border: "1px solid", borderColor: materials.selectedWorkIds.includes(work.id) ? "primary.main" : "divider", bgcolor: materials.selectedWorkIds.includes(work.id) ? "#fff0e9" : "background.paper", borderRadius: 2, cursor: "pointer" }}>
                  <Checkbox size="small" checked={materials.selectedWorkIds.includes(work.id)} onChange={() => materials.toggleWork(work.id)} sx={{ p: 0.5 }} slotProps={{ input: { "aria-label": `Gửi kèm ${work.title}` } }} />
                  <Avatar variant="rounded" src={work.media.find(media => media.kind === "image")?.src} alt="" sx={{ width: 36, height: 36, bgcolor: "background.default", fontSize: 12, color: "text.secondary" }}>{work.brand.slice(0, 2)}</Avatar>
                  <div className="min-w-0"><Typography sx={{ fontSize: 12, fontWeight: 600, lineHeight: 1.5 }}>{work.title}</Typography><Typography sx={{ fontSize: 11, color: "text.secondary" }}>{work.category}</Typography></div>
                </Box>)}
              </Box>
              {!materials.loading && !materials.error && !materials.works.length && <Alert severity="info" sx={{ mt: 1 }}>Chưa có tác phẩm công khai. Bạn vẫn có thể ứng tuyển bằng CV.</Alert>}
              </>}
              <Box sx={{ mt: 3, p: 2, border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
                <Typography component="label" htmlFor="apply-cv" sx={{ mb: 1.5, fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 1 }}><FileText size={16} />Tải CV lên *</Typography>
                <Box component="input" id="apply-cv" name="cvFile" type="file" accept=".pdf,.doc,.docx" required onChange={(event: React.ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0] || null; const issue = file ? validateResumeFile(file) : ""; setCvError(issue || ""); setCvFile(issue ? null : file); if (issue) event.target.value = ""; }} sx={{ display: "block", width: "100%", fontSize: 13, "&::file-selector-button": { border: "1px solid", borderColor: "divider", bgcolor: "background.default", borderRadius: 999, px: 2, py: 1, mr: 1.5, font: "inherit", cursor: "pointer" } }} />
                <Typography sx={{ mt: 1, fontSize: 11, color: "text.secondary", lineHeight: 1.6 }}>{cvFile ? `Đã chọn: ${cvFile.name}` : "PDF, DOC hoặc DOCX, tối đa 5 MB. CV chỉ đính kèm vào đơn này."}</Typography>
                {cvError && <Alert severity="error" sx={{ mt: 1 }}>{cvError}</Alert>}
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
              disabled={submitting || materials.loading}
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
