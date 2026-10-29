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
  Briefcase,
  FileText,
  AlertCircle,
  File,
  Lock,
  LockKeyhole,
  ArrowLeft,
} from "lucide-react";
import type {
  Candidate,
  ChatMessage,
  ProjectBrief,
  TalentProfile,
  UserRole,
} from "@/lib/types/marketplace.types";
import { LockedChatState } from "./LockedChatState";

interface ProjectChatRoomProps {
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

export const ProjectChatRoom: React.FC<ProjectChatRoomProps> = ({
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
    (["ongoing", "closed", "completed"].includes(project.status) && project.selectedTalentId !== talent.id);
  const chatFont = inboxMode ? '"Space Grotesk", Arial, sans-serif' : '"Be Vietnam Pro", sans-serif';

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

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: inboxMode ? "100%" : { xs: "min(72dvh, 620px)", md: "calc(100dvh - 220px)" },
        minHeight: inboxMode ? 0 : "480px",
        bgcolor: "#ffffff",
        borderRadius: inboxMode ? 0 : "18px",
        border: inboxMode ? "none" : "1px solid #a8b0a2",
        overflow: "hidden",
        "& .MuiTypography-root": { fontFamily: chatFont },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: { xs: 1.5, sm: inboxMode ? 1.5 : 2 },
          px: { xs: 2, sm: 2.5 },
          minHeight: inboxMode ? 70 : undefined,
          borderBottom: "1px solid #a8b0a2",
          bgcolor: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: inboxMode ? 1.5 : 2,
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
                color: "#62645e",
                bgcolor: "#f2f3f0",
                "&:hover": { bgcolor: "#e4e6e2" },
              }}
            >
              <ArrowLeft size={16} />
            </IconButton>
          )}
          <Avatar
            sx={{
              bgcolor: talent.color || "#f4490b",
              color: "#20201f",
              fontWeight: 700,
              width: inboxMode ? 38 : 40,
              height: inboxMode ? 38 : 40,
              fontFamily: chatFont,
              fontSize: inboxMode ? 13 : undefined,
            }}
          >
            {isBusiness ? talent.initials : project.company.slice(0, 2).toUpperCase()}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="subtitle1" noWrap sx={{ fontWeight: 700, fontSize: inboxMode ? 14 : 14, color: "#20201f" }}>
                {isBusiness ? talent.name : project.title}
              </Typography>
              <Chip
                label={inboxMode ? (isReadOnly ? "Chỉ xem" : "Đã duyệt trao đổi") : talent.kind}
                size="small"
                sx={{
                  bgcolor: inboxMode && !isReadOnly ? "#eaf6ef" : "#f2f3f0",
                  color: inboxMode && !isReadOnly ? "#27704c" : "#62645e",
                  fontWeight: 600,
                  fontSize: inboxMode ? "10px" : "11px",
                  height: 20,
                  fontFamily: chatFont,
                }}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
              <Typography variant="caption" noWrap sx={{ color: "#747773", fontSize: inboxMode ? 12 : 10 }}>
                {!isBusiness ? project.company : inboxMode ? `Dự án: ${project.title}` : `${project.title} · ${project.category}`}
              </Typography>
              {inboxMode && <Link to={isBusiness ? `/business/projects/${project.id}` : `/projects/${project.id}/details`} className="shrink-0 text-[11px] font-semibold text-[#bd3d14] hover:underline">Xem dự án</Link>}
            </Box>
          </Box>
        </Box>

        {isBusiness && onNavigateToAgreement && project.status === "published" && !isReadOnly && (
          <Button
            variant="contained"
            size="small"
            onClick={onNavigateToAgreement}
            startIcon={<FileText size={16} />}
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
              fontSize: inboxMode ? "12px" : "11px",
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
            px: 3,
            borderBottom: "1px solid #fef3c7",
            display: "flex",
            alignItems: "center",
            gap: 1,
            fontSize: "13px",
          }}
        >
          <AlertCircle size={16} />
          <Typography variant="caption" sx={{ fontWeight: 500 }}>
            Hội thoại này hiện ở chế độ chỉ xem vì dự án đã chọn người thực hiện khác hoặc hồ sơ không còn được trao đổi.
          </Typography>
        </Box>
      )}

      {/* Conversation Stream */}
      <Box
        ref={streamRef}
        sx={{
          flex: 1,
          overflowY: "auto",
          p: inboxMode ? { xs: 2, sm: 3 } : { xs: 2, sm: 2.5 },
          display: "flex",
          flexDirection: "column",
          gap: inboxMode ? 0 : 2,
          bgcolor: inboxMode ? "#f8f9f7" : "#f7f8f6",
        }}
      >
        <Box
          sx={{
            textAlign: "center",
            py: inboxMode ? 0 : 1,
            borderBottom: inboxMode ? "none" : "1px solid #a8b0a2",
            mb: inboxMode ? 2.5 : 1,
          }}
        >
          {inboxMode ? (
            <Box sx={{ display: "inline-flex", maxWidth: "100%", alignItems: "center", gap: 0.75, px: 1.5, py: 0.75, border: "1px solid #a8b0a2", borderRadius: 99, bgcolor: "#fff", color: "#747773" }}>
              <LockKeyhole size={13} style={{ flexShrink: 0 }} aria-hidden="true" />
              <Typography variant="caption" sx={{ fontSize: 11, lineHeight: 1.35 }}>Chỉ bạn và người được duyệt trong dự án này mới xem được cuộc trao đổi.</Typography>
            </Box>
          ) : <Typography variant="caption" sx={{ color: "#747773", fontSize: 10 }}>Chỉ bạn và người được duyệt trong dự án này mới xem được cuộc trao đổi.</Typography>}
        </Box>

        {messages.length === 0 ? (
          <Box sx={{ textAlign: "center", my: "auto", color: "#747773" }}>
            <Briefcase size={36} style={{ margin: "0 auto 8px" }} />
            <Typography variant="body2">
              Chưa có tin nhắn nào. Hãy bắt đầu trao đổi về phạm vi công việc, thời gian và yêu cầu sản phẩm.
            </Typography>
          </Box>
        ) : (
          messages.map((msg, index) => {
            const isMine =
              (isBusiness && msg.sender === "business") ||
              (!isBusiness && msg.sender === "talent");

            if (inboxMode) {
              const sentDate = new Date(msg.sentAt);
              const showDate = index === 0 || sentDate.toDateString() !== new Date(messages[index - 1].sentAt).toDateString();
              const timeLabel = sentDate.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

              return (
                <React.Fragment key={msg.id}>
                  {showDate && (
                    <Box sx={{ display: "flex", justifyContent: "center", my: 1.5 }}>
                      <Typography component="time" dateTime={msg.sentAt} sx={{ px: 1.5, py: 0.4, borderRadius: 99, bgcolor: "#e9ebe7", color: "#747773", fontSize: 11, fontWeight: 600 }}>
                        {sentDate.toLocaleDateString("vi-VN", { day: "numeric", month: "long", year: "numeric" })}
                      </Typography>
                    </Box>
                  )}
                  <Box sx={{ display: "flex", alignSelf: isMine ? "flex-end" : "flex-start", alignItems: "flex-start", gap: 1.25, maxWidth: { xs: "94%", sm: "78%" }, minWidth: 0, mb: 2.25 }}>
                    {!isMine && <Avatar sx={{ width: 30, height: 30, mt: 0.25, flexShrink: 0, bgcolor: talent.color || "#f1e0d1", color: "#20201f", fontFamily: chatFont, fontSize: 11, fontWeight: 700 }}>{isBusiness ? talent.initials : project.company.slice(0, 2).toUpperCase()}</Avatar>}
                    <Box sx={{ minWidth: 0, display: "flex", flexDirection: "column", alignItems: isMine ? "flex-end" : "flex-start" }}>
                      <Box sx={{ display: "flex", flexDirection: isMine ? "row-reverse" : "row", alignItems: "baseline", gap: 1, mb: 0.5, px: 0.5 }}>
                        <Typography variant="caption" sx={{ color: isMine ? "#bd3d14" : "#20201f", fontSize: 11, fontWeight: 700 }}>{msg.senderName}</Typography>
                        <Typography component="time" dateTime={msg.sentAt} variant="caption" sx={{ color: "#92958e", fontSize: 10 }}>{timeLabel}</Typography>
                      </Box>
                      <Paper elevation={0} sx={{ px: 1.75, py: 1.35, maxWidth: "100%", borderRadius: isMine ? "15px 15px 4px 15px" : "15px 15px 15px 4px", bgcolor: isMine ? "#f4490b" : "#fff", color: isMine ? "#fff" : "#20201f", border: isMine ? "1px solid #f4490b" : "1px solid #a8b0a2", boxShadow: "0 1px 2px rgba(32,32,31,.04)" }}>
                        {msg.body && <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere", fontSize: 13, lineHeight: 1.6 }}>{msg.body}</Typography>}
                        {msg.attachmentUrl && (
                          <Box component="a" href={msg.attachmentUrl} download={msg.attachmentName || "tep-dinh-kem"}
                            sx={{ display: "flex", alignItems: "center", gap: 1, mt: msg.body ? 1.25 : 0, px: 1.25, py: 1, borderRadius: 1.5, bgcolor: isMine ? "rgba(255,255,255,.16)" : "#f7f8f6", color: "inherit", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
                            <File size={16} aria-hidden="true" />
                            <Typography variant="caption" sx={{ fontSize: 11, fontWeight: 600, overflowWrap: "anywhere" }}>{msg.attachmentName || "Tệp đính kèm"}</Typography>
                          </Box>
                        )}
                      </Paper>
                    </Box>
                  </Box>
                </React.Fragment>
              );
            }

            return (
              <Box
                key={msg.id}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: isMine ? "flex-end" : "flex-start",
                  maxWidth: { xs: "92%", sm: "78%" },
                  alignSelf: isMine ? "flex-end" : "flex-start",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ color: "#747773", mb: 0.5, px: 1, fontSize: inboxMode ? 11 : 10 }}
                >
                  {msg.senderName} ·{" "}
                  {new Date(msg.sentAt).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Typography>
                <Paper
                  elevation={0}
                  sx={{
                    px: 1.75,
                    py: 1.25,
                    borderRadius: isMine
                      ? "16px 16px 4px 16px"
                      : "16px 16px 16px 4px",
                    bgcolor: isMine ? "#f4490b" : "#ffffff",
                    color: isMine ? "#ffffff" : "#20201f",
                    border: isMine ? "none" : "1px solid #a8b0a2",
                    boxShadow: "none",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      lineHeight: 1.5,
                      whiteSpace: "pre-wrap",
                      fontSize: inboxMode ? "13px" : "12px",
                    }}
                  >
                    {msg.body}
                  </Typography>

                  {msg.attachmentUrl && (
                    <Box
                      sx={{
                        mt: 1.5,
                        pt: 1,
                        borderTop: isMine
                          ? "1px solid rgba(255,255,255,0.2)"
                          : "1px solid #a8b0a2",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <File size={16} />
                      <Typography
                        variant="caption"
                        sx={{
                          textDecoration: "underline",
                          cursor: "pointer",
                          fontWeight: 500,
                        }}
                      >
                        {msg.attachmentName || "Tệp đính kèm"}
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </Box>
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
            p: inboxMode ? { xs: 1.5, sm: 2 } : 2,
            borderTop: "1px solid #a8b0a2",
            bgcolor: "#ffffff",
            display: "flex",
            flexDirection: "column",
            gap: inboxMode ? 0.75 : 1,
          }}
        >
          {selectedFile && (
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                bgcolor: "#f2f3f0",
                px: 1.5,
                py: 0.5,
                borderRadius: "6px",
                width: "fit-content",
              }}
            >
              <File size={14} color="#f4490b" />
              <Typography variant="caption" sx={{ fontWeight: 500 }}>
                {selectedFile.name}
              </Typography>
              <IconButton
                size="small"
                onClick={() => setSelectedFile(null)}
                sx={{ p: 0.25 }}
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
                sx={{ color: "#747773", "&:hover": { bgcolor: "#fff0e9", color: "#bd3d14" } }}
              >
                <Paperclip size={20} />
              </IconButton>
            </Tooltip>

            <TextField
              fullWidth
              size="small"
              slotProps={{ htmlInput: { "aria-label": "Soạn tin nhắn" } }}
              placeholder={`Nhập tin nhắn trao đổi với ${isBusiness ? talent.name : project.company}...`}
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
                  bgcolor: "#f7f8f6",
                  height: inboxMode ? 42 : undefined,
                },
                "& .MuiInputBase-input": inboxMode ? { fontFamily: '"Space Grotesk", Arial, sans-serif', fontSize: 13 } : {},
              }}
            />

            <Button
              type="submit"
              variant="contained"
              disabled={!draft.trim() && !selectedFile}
              sx={{
                borderRadius: "50%",
                minWidth: inboxMode ? "42px" : "44px",
                height: inboxMode ? "42px" : "40px",
                p: 0,
                bgcolor: "#f4490b",
                "&:hover": { bgcolor: "#bd3d14" },
              }}
            >
              <Send size={18} />
            </Button>
          </Box>
          {inboxMode && <Typography variant="caption" sx={{ pl: 6.5, color: "#92958e", fontSize: 11, fontFamily: chatFont }}>Nhấn Enter để gửi tin nhắn · Shift + Enter để xuống dòng</Typography>}
        </Box>
      ) : (
        <Box
          sx={{
            p: 2,
            borderTop: "1px solid #e2e8f0",
            bgcolor: "#f8fafc",
            textAlign: "center",
          }}
        >
          <Typography variant="caption" sx={{ color: "#94a3b8" }}>
            <Lock size={12} style={{ display: "inline", marginRight: 4 }} />
            Hội thoại đã kết thúc và được lưu trữ cho mục đích đối soát.
          </Typography>
        </Box>
      )}
    </Box>
  );
};
