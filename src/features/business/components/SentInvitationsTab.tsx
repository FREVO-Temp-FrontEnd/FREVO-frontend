import { useState } from "react";
import {
  Box,
  Typography,
  Chip,
  Card,
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
} from "@mui/material";
import { Link } from "react-router";
import { Clock, CheckCircle2, XCircle, ArrowRight, Sparkles, Mail } from "lucide-react";
import type { ProjectBrief } from "@/lib/types/marketplace.types";
import { useBusiness } from "@/lib/hooks/useBusiness";
import { mockStorage } from "@/lib/storage/mockStorage";

interface SentInvitationsTabProps {
  project: ProjectBrief;
}

export function SentInvitationsTab({ project }: SentInvitationsTabProps) {
  const { invitations, talents, candidates, unlockChat } = useBusiness();
  const [reviewTalentId, setReviewTalentId] = useState<string | null>(null);
  const [reviewError, setReviewError] = useState("");
  const [feedback, setFeedback] = useState("");

  const projectInvitations = invitations.filter((i) => i.projectId === project.id);
  const reviewTalent = talents.find((talent) => talent.id === reviewTalentId);

  const handleSimulateAccept = (invitationId: string) => {
    mockStorage.respondToInvitation(invitationId, true);
  };

  const handleApprove = () => {
    if (!reviewTalentId) return;
    const latest = mockStorage.getState();
    const latestProject = latest.projects.find((item) => item.id === project.id);
    const latestInvitation = latest.invitations.find((item) => item.projectId === project.id && item.talentId === reviewTalentId && item.status === "accepted");
    const latestCandidate = latest.candidates.find((item) => item.projectId === project.id && item.talentId === reviewTalentId);
    const hasSelectedExecutor = latest.candidates.some((item) => item.projectId === project.id && item.status === "selected");

    if (latestProject?.status !== "published" || !latestInvitation || !latestCandidate || !["new", "under_review"].includes(latestCandidate.status) || latestCandidate.chatUnlocked || hasSelectedExecutor) {
      setReviewError("Trạng thái lời mời hoặc hồ sơ đã thay đổi. Hãy kiểm tra lại danh sách ứng viên.");
      return;
    }

    unlockChat(project.id, reviewTalentId);
    setReviewTalentId(null);
    setReviewError("");
    setFeedback(`Đã duyệt ${reviewTalent?.name ?? "ứng viên"} và mở kênh trao đổi.`);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Header Eyebrow */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="overline" sx={{ color: "#f4490b", fontWeight: 700, letterSpacing: 1 }}>
            QUẢN LÝ LỜI MỜI (BUS-010)
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Lời mời tham gia dự án đã gửi
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Theo dõi tình trạng phản hồi. Tất cả lời mời tuân thủ thời hạn 7 ngày theo FR-019 và BR-024.
          </Typography>
        </Box>

        <Link className="fb-button fb-button-small fb-button-secondary" to={`/business/projects/${project.id}/suggestions`}>
          <Sparkles size={14} /> Tìm thêm ứng viên phù hợp
        </Link>
      </Box>

      {/* 7-Day Guarantee Banner */}
      <Alert
        severity="info"
        icon={<Clock size={18} />}
        sx={{
          borderRadius: 2,
          bgcolor: "#f0f9ff",
          borderColor: "#bae6fd",
          color: "#0369a1",
          "& .MuiAlert-icon": { color: "#0284c7" },
        }}
      >
        <Typography variant="caption" sx={{ display: "block", lineHeight: 1.5 }}>
          <strong>Quy tắc thời hạn lời mời (FR-019, BR-024):</strong> Lời mời tự động hết hạn sau <strong>7 ngày</strong> kể từ thời điểm gửi. Khi Freelancer chấp nhận, hệ thống ghi nhận ứng tuyển ở trạng thái <em>Chờ xem xét</em> (BR-005) và chưa mở chat cho đến khi bạn phê duyệt.
        </Typography>
      </Alert>

      {/* Invitations List */}
      {projectInvitations.length > 0 ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {projectInvitations.map((inv) => {
            const talent = talents.find((t) => t.id === inv.talentId);
            const candidateRecord = candidates.find(
              (c) => c.projectId === project.id && c.talentId === inv.talentId
            );

            const isPending = inv.status === "pending";
            const isAccepted = inv.status === "accepted";
            const isDeclined = inv.status === "declined";

            return (
              <Card
                key={inv.id}
                variant="outlined"
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 2,
                  bgcolor: "#ffffff",
                }}
              >
                {/* Talent Identity & Invitation Meta */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      bgcolor: talent?.color || "#f4490b",
                      color: "#fff",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.1rem",
                      flexShrink: 0,
                    }}
                  >
                    {talent?.initials || "FL"}
                  </Box>
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        {talent?.name || "Ứng viên FREVO"}
                      </Typography>
                      <Chip
                        label={talent?.kind || "Cá nhân"}
                        size="small"
                        variant="outlined"
                        sx={{ height: 20, fontSize: "0.75rem" }}
                      />
                    </Box>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      {talent?.role} · Gửi ngày {new Date(inv.sentAt).toLocaleDateString("vi-VN")}
                    </Typography>
                    {inv.note && (
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          mt: 0.5,
                          fontStyle: "italic",
                          color: "#4b5563",
                          bgcolor: "#f9fafb",
                          p: 0.8,
                          borderRadius: 1,
                        }}
                      >
                        &ldquo;{inv.note}&rdquo;
                      </Typography>
                    )}
                  </Box>
                </Box>

                {/* Expiration Countdown & Status */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box sx={{ textAlign: "right" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: "flex-end", mb: 0.5 }}>
                      {isPending && (
                        <Chip
                          icon={<Clock size={13} />}
                          label={`Hết hạn: ${new Date(inv.expiresAt).toLocaleDateString("vi-VN")} (7 ngày)`}
                          size="small"
                          sx={{
                            bgcolor: "#fffbeb",
                            color: "#b45309",
                            border: "1px solid #fde68a",
                            fontWeight: 600,
                            fontSize: "0.75rem",
                          }}
                        />
                      )}
                      {isAccepted && (
                        <Chip
                          icon={<CheckCircle2 size={13} color="#15803d" />}
                          label="Đã chấp nhận"
                          size="small"
                          sx={{
                            bgcolor: "#f0fdf4",
                            color: "#15803d",
                            border: "1px solid #bbf7d0",
                            fontWeight: 600,
                          }}
                        />
                      )}
                      {isDeclined && (
                        <Chip
                          icon={<XCircle size={13} color="#b91c1c" />}
                          label="Đã từ chối"
                          size="small"
                          sx={{
                            bgcolor: "#fef2f2",
                            color: "#b91c1c",
                            border: "1px solid #fecaca",
                            fontWeight: 600,
                          }}
                        />
                      )}
                    </Box>

                    {isAccepted && (
                      <Typography variant="caption" sx={{ color: "#15803d", display: "block" }}>
                        {candidateRecord?.chatUnlocked
                          ? "Đã duyệt và mở chat (FR-031)"
                          : "Đang chờ xem xét mở chat (BR-005)"}
                      </Typography>
                    )}
                  </Box>

                  {/* Actions */}
                  <Box sx={{ display: "flex", gap: 1 }}>
                    {isPending && project.status === "published" && (
                      <button type="button" className="fb-button fb-button-small fb-button-secondary" onClick={() => handleSimulateAccept(inv.id)}>
                        Mô phỏng chấp nhận
                      </button>
                    )}

                    {isAccepted && candidateRecord && !candidateRecord.chatUnlocked && (candidateRecord.status === "new" || candidateRecord.status === "under_review") && project.status === "published" && (
                      <button type="button" className="fb-button fb-button-small fb-button-primary" onClick={() => { setReviewTalentId(inv.talentId); setReviewError(""); }}>
                        <CheckCircle2 size={14} /> Duyệt để trao đổi
                      </button>
                    )}
                    {isAccepted && candidateRecord?.chatUnlocked && (
                      <Link className="fb-button fb-button-small fb-button-primary" to={`/projects/${project.id}/chat?talent=${inv.talentId}`}>
                        Mở tin nhắn <ArrowRight size={14} />
                      </Link>
                    )}
                    {isAccepted && !candidateRecord && (
                      <Link className="fb-button fb-button-small fb-button-secondary" to={`/business/projects/${project.id}/applicants`}>
                        Kiểm tra hồ sơ <ArrowRight size={14} />
                      </Link>
                    )}
                  </Box>
                </Box>
              </Card>
            );
          })}
        </Box>
      ) : (
        <Box
          sx={{
            py: 8,
            px: 3,
            textAlign: "center",
            bgcolor: "#fafaf9",
            borderRadius: 3,
            border: "1px dashed #d6d3d1",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              bgcolor: "#f5f5f4",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#78716c",
              mb: 1,
            }}
          >
            <Mail size={26} strokeWidth={1.8} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#292524", fontSize: "1.1rem" }}>
            Chưa có lời mời nào được gửi
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", maxWidth: 440, mb: 1 }}>
            Dự án này chưa gửi lời mời nào. Bạn có thể khám phá danh sách gợi ý phù hợp để gửi lời mời trực tiếp đến Freelancer hoặc Team.
          </Typography>
          <Link className="fb-button fb-button-small fb-button-primary" to={`/business/projects/${project.id}/suggestions`}>
            Xem danh sách gợi ý <ArrowRight size={14} />
          </Link>
        </Box>
      )}
      <Dialog
        open={Boolean(reviewTalentId)}
        onClose={() => { setReviewTalentId(null); setReviewError(""); }}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } } } }}
      >
        <DialogTitle>Duyệt để trao đổi?</DialogTitle>
        <DialogContent sx={{ scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } }}>
          <Typography variant="body2">
            Sau khi duyệt {reviewTalent?.name ?? "ứng viên"}, kênh nhắn tin của dự án sẽ được mở. Việc chấp nhận lời mời trước đó chưa tự mở chat.
          </Typography>
          {reviewError && <Alert severity="error" sx={{ mt: 2 }}>{reviewError}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setReviewTalentId(null); setReviewError(""); }}>Quay lại</Button>
          <Button variant="contained" onClick={handleApprove}>Duyệt hồ sơ</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={Boolean(feedback)} autoHideDuration={4500} onClose={() => setFeedback("")} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity="success" onClose={() => setFeedback("")}>{feedback}</Alert>
      </Snackbar>
    </Box>
  );
}
