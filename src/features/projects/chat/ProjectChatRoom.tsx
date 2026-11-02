import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  IconButton,
  TextField,
  Button,
  Chip,
  Tooltip,
} from "@mui/material";
import {
  Send,
  Paperclip,
  ArrowRight,
  FileText,
  Pin,
  AlertCircle,
  File,
  Lock,
  LockKeyhole,
  ArrowLeft,
  MessageSquare,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import type {
  AgreementProposal,
  Candidate,
  ChatMessage,
  ProjectBrief,
  TalentProfile,
  UserRole,
} from "@/lib/types/marketplace.types";
import { LockedChatState } from "./LockedChatState";

interface ProjectChatRoomProps {
  agreement?: AgreementProposal;
  project: ProjectBrief;
  candidate: Candidate;
  talent: TalentProfile;
  currentUserRole: UserRole;
  currentUserName?: string;
  messages: ChatMessage[];
  onSendMessage: (
    body: string,
    attachment?: { name: string; url: string }
  ) => boolean | void;
  onApproveChat?: () => void;
  onNavigateToAgreement?: () => void;
  inboxMode?: boolean;
  onBackToList?: () => void;
}

const chatFont = '"Space Grotesk", Arial, sans-serif';
const headingFont = '"Archivo", Arial, sans-serif';

export const ProjectChatRoom: React.FC<ProjectChatRoomProps> = ({
  agreement,
  project,
  candidate,
  talent,
  currentUserRole,
  messages,
  onSendMessage,
  onApproveChat,
  onNavigateToAgreement,
  inboxMode = false,
  onBackToList,
}) => {
  const [draft, setDraft] = useState("");
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    url: string;
  } | null>(null);
  const streamRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isBusiness = currentUserRole === "client" || currentUserRole === "admin";
  const isChatUnlocked = candidate.chatUnlocked;
  const isReadOnly =
    candidate.status === "not_selected" ||
    (["ongoing", "closed", "completed"].includes(project.status) &&
      project.selectedTalentId !== talent.id);

  useEffect(() => {
    const stream = streamRef.current;
    if (stream) stream.scrollTop = stream.scrollHeight;
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim() && !selectedFile) return;
    if (isReadOnly || !isChatUnlocked) return;
    if (onSendMessage(draft.trim(), selectedFile || undefined) === false) return;
    setDraft("");
    setSelectedFile(null);
  };

  const handleMockFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile({
        name: file.name,
        url: URL.createObjectURL(file),
      });
    }
  };

  // If chat is gated per FR-031 / BR-012
  if (!isChatUnlocked) {
    return (
      <LockedChatState
        isBusiness={isBusiness}
        talentName={isBusiness ? talent.name : project.company}
        projectTitle={project.title}
        onApproveChat={onApproveChat}
      />
    );
  }

  // Helper for agreement status badge
  const renderAgreementStatus = () => {
    if (!agreement) return null;
    if (agreement.isEffective || agreement.status === "confirmed") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-[#ecfdf5] px-2 py-0.5 text-[11px] font-semibold text-[#047857]">
          <CheckCircle2 size={12} /> Đang có hiệu lực
        </span>
      );
    }
    if (agreement.status === "rejected") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-[#fef2f2] px-2 py-0.5 text-[11px] font-semibold text-[#b91c1c]">
          <XCircle size={12} /> Đã từ chối
        </span>
      );
    }
    if (agreement.status === "superseded") {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-[#f1f5f9] px-2 py-0.5 text-[11px] font-semibold text-[#475569]">
          Đã thay thế
        </span>
      );
    }
    if (agreement.status === "expired" || Date.parse(agreement.expiresAt) <= Date.now()) {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-[#f1f5f9] px-2 py-0.5 text-[11px] font-semibold text-[#64748b]">
          Đã hết hạn
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[#fff7ed] px-2 py-0.5 text-[11px] font-semibold text-[#c2410c]">
        <Clock size={12} /> Phản hồi trước {new Date(agreement.expiresAt).toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
      </span>
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: inboxMode ? "100%" : { xs: "min(76dvh, 640px)", md: "calc(100dvh - 200px)" },
        minHeight: inboxMode ? 0 : "520px",
        bgcolor: "#ffffff",
        borderRadius: inboxMode ? 0 : "16px",
        border: inboxMode ? "none" : "1.5px solid #cbd5e1",
        boxShadow: inboxMode ? "none" : "0 4px 20px rgba(16, 24, 40, 0.08), 0 1px 3px rgba(16, 24, 40, 0.05)",
        overflow: "hidden",
        "& .MuiTypography-root": { fontFamily: chatFont },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: { xs: 1.5, sm: 2 },
          px: { xs: 2, sm: 2.5 },
          minHeight: 68,
          borderBottom: "1.5px solid #cbd5e1",
          bgcolor: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 1.5,
          zIndex: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
          {inboxMode && onBackToList && (
            <IconButton
              onClick={onBackToList}
              size="small"
              aria-label="Quay lại danh sách hội thoại"
              sx={{
                display: { xs: "inline-flex", lg: "none" },
                mr: 0.5,
                color: "#64748b",
                bgcolor: "#f1f5f9",
                "&:hover": { bgcolor: "#e2e8f0", color: "#0f172a" },
              }}
            >
              <ArrowLeft size={16} />
            </IconButton>
          )}

          <Avatar
            sx={{
              bgcolor: talent.color || "#fff0e9",
              color: "#f4490b",
              fontWeight: 800,
              width: 42,
              height: 42,
              fontFamily: chatFont,
              fontSize: 14,
              border: "1px solid rgba(244, 73, 11, 0.2)",
              boxShadow: "0 1px 2px rgba(16, 24, 40, 0.05)",
            }}
          >
            {isBusiness ? talent.initials : project.company.slice(0, 2).toUpperCase()}
          </Avatar>

          <Box sx={{ minWidth: 0 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                component="h2"
                noWrap
                sx={{
                  fontFamily: headingFont,
                  fontWeight: 800,
                  fontSize: 15,
                  color: "#0f172a",
                  lineHeight: 1.3,
                }}
              >
                {isBusiness ? talent.name : project.title}
              </Typography>
              <Chip
                label={isReadOnly ? "Chỉ xem" : "Đã duyệt trao đổi"}
                size="small"
                sx={{
                  bgcolor: !isReadOnly ? "#ecfdf5" : "#f1f5f9",
                  color: !isReadOnly ? "#047857" : "#64748b",
                  border: !isReadOnly ? "1px solid #a7f3d0" : "1px solid #e2e8f0",
                  fontWeight: 600,
                  fontSize: "11px",
                  height: 22,
                  fontFamily: chatFont,
                }}
              />
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0, mt: 0.25 }}>
              <Typography variant="caption" noWrap sx={{ color: "#64748b", fontSize: 12 }}>
                {!isBusiness ? project.company : `Dự án: ${project.title}`}
              </Typography>
              <span className="text-[#cbd5e1]">·</span>
              <Link
                to={isBusiness ? `/business/projects/${project.id}` : `/projects/${project.id}/details`}
                className="shrink-0 text-[11.5px] font-semibold text-[#f4490b] transition-colors hover:text-[#bd3d14] hover:underline"
              >
                Xem chi tiết dự án
              </Link>
            </Box>
          </Box>
        </Box>

        {isBusiness && onNavigateToAgreement && project.status === "published" && !isReadOnly && (
          <Button
            variant="contained"
            size="small"
            onClick={onNavigateToAgreement}
            startIcon={<FileText size={15} />}
            endIcon={<ArrowRight size={14} />}
            sx={{
              bgcolor: "#f4490b",
              color: "#ffffff",
              boxShadow: "0 2px 8px rgba(244,73,11,0.25)",
              "&:hover": { bgcolor: "#bd3d14" },
              borderRadius: 999,
              textTransform: "none",
              fontFamily: chatFont,
              fontWeight: 700,
              fontSize: "12px",
              px: 2,
              py: 0.75,
            }}
          >
            Tạo đề xuất thỏa thuận
          </Button>
        )}
      </Box>

      {/* Read-only banner if recruitment closed without this candidate */}
      {isReadOnly && (
        <Box
          sx={{
            bgcolor: "#fffbeb",
            color: "#92400e",
            p: 1.5,
            px: 2.5,
            borderBottom: "1px solid #fef3c7",
            display: "flex",
            alignItems: "center",
            gap: 1.25,
            fontSize: "13px",
          }}
        >
          <AlertCircle size={16} className="shrink-0 text-[#b45309]" />
          <Typography variant="caption" sx={{ fontWeight: 600, fontSize: 12.5, color: "#92400e" }}>
            Hội thoại này hiện ở chế độ chỉ xem vì dự án đã chọn người thực hiện khác hoặc hồ sơ không còn được trao đổi.
          </Typography>
        </Box>
      )}

      {/* Pinned Agreement Banner */}
      {agreement && (
        <Box
          component="section"
          aria-label="Thỏa thuận được ghim"
          sx={{
            flexShrink: 0,
            px: { xs: 2, sm: 2.5 },
            py: 1.25,
            bgcolor: "#fff7f2",
            borderBottom: "1.5px solid #fdba74",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: "10px",
                bgcolor: "#ffedd5",
                color: "#ea580c",
                display: "grid",
                placeItems: "center",
                flexShrink: 0,
              }}
            >
              <Pin size={16} aria-hidden="true" />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#9a3412" }}>
                  Thỏa thuận hợp tác được ghim
                </Typography>
                {renderAgreementStatus()}
              </Box>
              <Typography sx={{ mt: 0.25, fontSize: 12, color: "#7c2d12", overflowWrap: "anywhere" }}>
                Phiên bản {agreement.version} · Ngân sách thỏa thuận: <strong>{agreement.budget}</strong>
              </Typography>
            </Box>
          </Box>

          <Button
            component={Link}
            to={`${isBusiness ? "/business/projects" : "/projects"}/${encodeURIComponent(
              project.id
            )}/agreement?${new URLSearchParams({ talent: talent.id })}`}
            variant="outlined"
            size="small"
            sx={{
              flexShrink: 0,
              borderRadius: 999,
              bgcolor: "#ffffff",
              borderColor: "#fdba74",
              color: "#c2410c",
              fontSize: 12,
              fontWeight: 700,
              textTransform: "none",
              px: 2,
              py: 0.5,
              boxShadow: "0 1px 2px rgba(194, 65, 12, 0.05)",
              "&:hover": {
                bgcolor: "#fff0e9",
                borderColor: "#f97316",
                color: "#9a3412",
              },
            }}
          >
            Xem thỏa thuận
          </Button>
        </Box>
      )}

      {/* Conversation Stream */}
      <Box
        ref={streamRef}
        sx={{
          flex: 1,
          overflowY: "auto",
          p: { xs: 2, sm: 2.5, md: 3 },
          display: "flex",
          flexDirection: "column",
          bgcolor: !isBusiness ? "#f7f8f6" : "#f8fafc",
        }}
      >
        {/* Security & Privacy Notice */}
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Box
            sx={{
              display: "inline-flex",
              maxWidth: "100%",
              alignItems: "center",
              gap: 1,
              px: 2,
              py: 0.75,
              border: "1.5px solid #cbd5e1",
              borderRadius: 999,
              bgcolor: "#ffffff",
              color: "#64748b",
              boxShadow: "0 1px 2px rgba(16, 24, 40, 0.04)",
            }}
          >
            <LockKeyhole size={13} style={{ flexShrink: 0, color: "#f4490b" }} aria-hidden="true" />
            <Typography variant="caption" sx={{ fontSize: 11.5, lineHeight: 1.4, color: "#64748b" }}>
              Chỉ bạn và người được duyệt trong dự án này mới xem được cuộc trao đổi.
            </Typography>
          </Box>
        </Box>

        {messages.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              my: "auto",
              py: 6,
              px: 3,
            }}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: "16px",
                bgcolor: "#fff0e9",
                color: "#f4490b",
                display: "grid",
                placeItems: "center",
                mx: "auto",
                mb: 2,
                border: "1px solid rgba(244, 73, 11, 0.2)",
                boxShadow: "0 2px 8px rgba(244, 73, 11, 0.12)",
              }}
            >
              <MessageSquare size={26} />
            </Box>
            <Typography
              component="h3"
              sx={{
                fontFamily: headingFont,
                fontWeight: 800,
                fontSize: 16,
                color: "#0f172a",
                mb: 0.75,
              }}
            >
              Bắt đầu cuộc trao đổi
            </Typography>
            <Typography
              variant="body2"
              sx={{
                maxWidth: 420,
                mx: "auto",
                color: "#64748b",
                fontSize: 13,
                lineHeight: 1.6,
              }}
            >
              Chưa có tin nhắn nào. Hãy gửi lời chào và trao đổi về phạm vi công việc, tiến độ giao nộp sản phẩm và các yêu cầu cụ thể.
            </Typography>
          </Box>
        ) : (
          messages.map((msg, index) => {
            const isMine =
              (isBusiness && msg.sender === "business") ||
              (!isBusiness && msg.sender === "talent");

            const sentDate = new Date(msg.sentAt);
            const showDate =
              index === 0 ||
              sentDate.toDateString() !== new Date(messages[index - 1].sentAt).toDateString();
            const timeLabel = sentDate.toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <React.Fragment key={msg.id}>
                {showDate && (
                  <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
                    <Typography
                      component="time"
                      dateTime={msg.sentAt}
                      sx={{
                        px: 2,
                        py: 0.5,
                        borderRadius: 999,
                        bgcolor: "#ffffff",
                        border: "1.5px solid #cbd5e1",
                        color: "#64748b",
                        fontSize: 11,
                        fontWeight: 600,
                        boxShadow: "0 1px 2px rgba(16, 24, 40, 0.04)",
                      }}
                    >
                      {sentDate.toLocaleDateString("vi-VN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </Typography>
                  </Box>
                )}

                <Box
                  sx={{
                    display: "flex",
                    alignSelf: isMine ? "flex-end" : "flex-start",
                    alignItems: "flex-start",
                    gap: 1.25,
                    maxWidth: { xs: "92%", sm: "80%", md: "72%" },
                    minWidth: 0,
                    mb: 2,
                  }}
                >
                  {!isMine && (
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        mt: 0.25,
                        flexShrink: 0,
                        bgcolor: talent.color || "#fff0e9",
                        color: "#f4490b",
                        fontFamily: chatFont,
                        fontSize: 12,
                        fontWeight: 800,
                        border: "1.5px solid #cbd5e1",
                        boxShadow: "0 1px 2px rgba(16, 24, 40, 0.04)",
                      }}
                    >
                      {isBusiness ? talent.initials : project.company.slice(0, 2).toUpperCase()}
                    </Avatar>
                  )}

                  <Box
                    sx={{
                      minWidth: 0,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: isMine ? "flex-end" : "flex-start",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: isMine ? "row-reverse" : "row",
                        alignItems: "baseline",
                        gap: 1,
                        mb: 0.5,
                        px: 0.5,
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: isMine ? "#bd3d14" : "#0f172a",
                          fontSize: 11.5,
                          fontWeight: 700,
                        }}
                      >
                        {isMine ? "Bạn" : msg.senderName}
                      </Typography>
                      <Typography
                        component="time"
                        dateTime={msg.sentAt}
                        variant="caption"
                        sx={{ color: "#94a3b8", fontSize: 10.5 }}
                      >
                        {timeLabel}
                      </Typography>
                    </Box>

                    <Paper
                      elevation={0}
                      sx={{
                        px: 2,
                        py: 1.35,
                        maxWidth: "100%",
                        borderRadius: isMine
                          ? "18px 18px 4px 18px"
                          : "18px 18px 18px 4px",
                        background: isMine
                          ? "linear-gradient(135deg, #f4490b 0%, #e03a00 100%)"
                          : "#ffffff",
                        color: isMine ? "#ffffff" : "#0f172a",
                        border: isMine ? "none" : "1.5px solid #cbd5e1",
                        boxShadow: isMine
                          ? "0 2px 8px rgba(244, 73, 11, 0.22)"
                          : "0 2px 8px rgba(16, 24, 40, 0.08), 0 1px 3px rgba(16, 24, 40, 0.04)",
                      }}
                    >
                      {msg.body && (
                        <Typography
                          variant="body2"
                          sx={{
                            whiteSpace: "pre-wrap",
                            overflowWrap: "anywhere",
                            fontSize: 13.5,
                            lineHeight: 1.6,
                            color: "inherit",
                          }}
                        >
                          {msg.body}
                        </Typography>
                      )}

                      {msg.attachmentUrl && (
                        <Box
                          component="a"
                          href={msg.attachmentUrl}
                          download={msg.attachmentName || "tep-dinh-kem"}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.25,
                            mt: msg.body ? 1.25 : 0,
                            px: 1.5,
                            py: 1,
                            borderRadius: "10px",
                            bgcolor: isMine
                              ? "rgba(255, 255, 255, 0.2)"
                              : "#f8fafc",
                            border: isMine
                              ? "1px solid rgba(255, 255, 255, 0.3)"
                              : "1.5px solid #cbd5e1",
                            color: "inherit",
                            textDecoration: "none",
                            transition: "all 0.15s ease",
                            "&:hover": {
                              bgcolor: isMine
                                ? "rgba(255, 255, 255, 0.28)"
                                : "#f1f5f9",
                            },
                          }}
                        >
                          <File size={16} aria-hidden="true" className="shrink-0" />
                          <Typography
                            variant="caption"
                            sx={{
                              fontSize: 12,
                              fontWeight: 600,
                              overflowWrap: "anywhere",
                            }}
                          >
                            {msg.attachmentName || "Tệp đính kèm"}
                          </Typography>
                        </Box>
                      )}
                    </Paper>
                  </Box>
                </Box>
              </React.Fragment>
            );
          })
        )}
      </Box>

      {/* Compose Form */}
      {!isReadOnly ? (
        <Box
          component="form"
          onSubmit={handleSend}
          sx={{
            p: { xs: 1.5, sm: 2 },
            borderTop: "1.5px solid #cbd5e1",
            bgcolor: "#ffffff",
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          {selectedFile && (
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                bgcolor: "#fff0e9",
                border: "1px solid rgba(244, 73, 11, 0.2)",
                px: 1.5,
                py: 0.5,
                borderRadius: "8px",
                width: "fit-content",
                color: "#c2410c",
              }}
            >
              <File size={14} color="#f4490b" />
              <Typography variant="caption" sx={{ fontWeight: 600, fontSize: 12 }}>
                {selectedFile.name}
              </Typography>
              <IconButton
                size="small"
                onClick={() => setSelectedFile(null)}
                sx={{
                  p: 0.25,
                  color: "#ea580c",
                  "&:hover": { bgcolor: "#fed7aa" },
                }}
                aria-label="Xóa tệp đính kèm"
              >
                ×
              </IconButton>
            </Box>
          )}

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleMockFileUpload}
            />
            <Tooltip title="Đính kèm tệp tài liệu / hình ảnh">
              <IconButton
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  color: "#64748b",
                  p: 1.25,
                  borderRadius: "50%",
                  transition: "all 0.15s ease",
                  "&:hover": { bgcolor: "#fff0e9", color: "#f4490b" },
                }}
              >
                <Paperclip size={20} />
              </IconButton>
            </Tooltip>

            <TextField
              id="chat-message-input"
              fullWidth
              size="small"
              slotProps={{ htmlInput: { "aria-label": "Soạn tin nhắn" } }}
              placeholder={`Nhập tin nhắn trao đổi với ${
                isBusiness ? talent.name : project.company
              }...`}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "24px",
                  bgcolor: "#ffffff",
                  height: 44,
                  fontSize: 13.5,
                  "& fieldset": { borderColor: "#cbd5e1", borderWidth: 1.5 },
                  "&:hover fieldset": { borderColor: "#94a3b8" },
                  "&.Mui-focused fieldset": {
                    borderColor: "#f4490b",
                    borderWidth: 2,
                  },
                },
                "& .MuiInputBase-input": {
                  fontFamily: chatFont,
                  px: 2,
                  "&::placeholder": { color: "#94a3b8", opacity: 1 },
                },
              }}
            />

            <Button
              id="chat-send-button"
              type="submit"
              variant="contained"
              aria-label="Gửi tin nhắn"
              disabled={!draft.trim() && !selectedFile}
              sx={{
                borderRadius: "50%",
                minWidth: "44px",
                width: "44px",
                height: "44px",
                p: 0,
                background: "linear-gradient(135deg, #f4490b 0%, #e03a00 100%)",
                boxShadow: "0 2px 8px rgba(244, 73, 11, 0.28)",
                "&:hover": { background: "#bd3d14" },
                "&.Mui-disabled": {
                  bgcolor: "#f1f5f9",
                  color: "#cbd5e1",
                  boxShadow: "none",
                },
              }}
            >
              <Send size={18} />
            </Button>
          </Box>
          <Typography
            variant="caption"
            sx={{
              pl: 6.5,
              color: "#94a3b8",
              fontSize: 11,
              fontFamily: chatFont,
            }}
          >
            Nhấn Enter để gửi tin nhắn · Shift + Enter để xuống dòng
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            p: 2,
            borderTop: "1px solid #e2e8f0",
            bgcolor: !isBusiness ? "#f7f8f6" : "#f8fafc",
            textAlign: "center",
          }}
        >
          <Typography variant="caption" sx={{ color: "#64748b", fontSize: 12 }}>
            <Lock size={13} style={{ display: "inline", marginRight: 6 }} />
            Hội thoại đã kết thúc và được lưu trữ cho mục đích đối soát.
          </Typography>
        </Box>
      )}
    </Box>
  );
};
