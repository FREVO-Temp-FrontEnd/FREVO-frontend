import React, { useState, useRef, useEffect } from "react";
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
  ) => void;
  onApproveChat?: () => void;
  onNavigateToAgreement?: () => void;
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
}) => {
  const [draft, setDraft] = useState("");
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    url: string;
  } | null>(null);
  const streamEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isBusiness = currentUserRole === "client" || currentUserRole === "admin";
  const isChatUnlocked = candidate.chatUnlocked;
  const isReadOnly =
    candidate.status === "not_selected" ||
    (project.status === "closed" && project.selectedTalentId !== talent.id);

  useEffect(() => {
    streamEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim() && !selectedFile) return;
    onSendMessage(draft.trim(), selectedFile || undefined);
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
        talentName={talent.name}
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
        height: "calc(100vh - 180px)",
        minHeight: "560px",
        bgcolor: "#ffffff",
        borderRadius: "16px",
        border: "1px solid #e2e8f0",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          px: 3,
          borderBottom: "1px solid #e2e8f0",
          bgcolor: "#f8fafc",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar
            sx={{
              bgcolor: talent.color || "#f4490b",
              color: "#1e293b",
              fontWeight: 700,
            }}
          >
            {talent.initials}
          </Avatar>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1e293b" }}>
                {talent.name}
              </Typography>
              <Chip
                label={talent.kind}
                size="small"
                sx={{
                  bgcolor: talent.kind === "Team" ? "#e0e7ff" : "#f1f5f9",
                  color: talent.kind === "Team" ? "#4338ca" : "#475569",
                  fontWeight: 600,
                  fontSize: "11px",
                  height: 20,
                }}
              />
            </Box>
            <Typography variant="caption" sx={{ color: "#64748b" }}>
              {project.title} · {project.category}
            </Typography>
          </Box>
        </Box>

        {isBusiness && onNavigateToAgreement && project.status !== "closed" && (
          <Button
            variant="contained"
            size="small"
            onClick={onNavigateToAgreement}
            startIcon={<FileText size={16} />}
            endIcon={<ArrowRight size={14} />}
            sx={{
              bgcolor: "#f4490b",
              "&:hover": { bgcolor: "#bd3d14" },
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "13px",
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
            Hội thoại này hiện ở chế độ chỉ đọc do dự án đã kết thúc tuyển dụng hoặc chọn đối tác khác (FR-045).
          </Typography>
        </Box>
      )}

      {/* Conversation Stream */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          bgcolor: "#fafafa",
        }}
      >
        <Box
          sx={{
            textAlign: "center",
            py: 1,
            borderBottom: "1px dashed #e2e8f0",
            mb: 1,
          }}
        >
          <Typography variant="caption" sx={{ color: "#94a3b8" }}>
            Kênh liên lạc chính thức cho dự án <strong>{project.title}</strong> · Tuân thủ quy định bảo mật FREVO
          </Typography>
        </Box>

        {messages.length === 0 ? (
          <Box sx={{ textAlign: "center", my: "auto", color: "#94a3b8" }}>
            <Briefcase size={36} style={{ margin: "0 auto 8px" }} />
            <Typography variant="body2">
              Chưa có tin nhắn nào. Hãy bắt đầu trao đổi về phạm vi công việc, thời gian và yêu cầu sản phẩm.
            </Typography>
          </Box>
        ) : (
          messages.map((msg) => {
            const isMine =
              (isBusiness && msg.sender === "business") ||
              (!isBusiness && msg.sender === "talent");

            return (
              <Box
                key={msg.id}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: isMine ? "flex-end" : "flex-start",
                  maxWidth: "75%",
                  alignSelf: isMine ? "flex-end" : "flex-start",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ color: "#94a3b8", mb: 0.5, px: 1 }}
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
                    p: 2,
                    borderRadius: isMine
                      ? "16px 16px 4px 16px"
                      : "16px 16px 16px 4px",
                    bgcolor: isMine ? "#f4490b" : "#ffffff",
                    color: isMine ? "#ffffff" : "#1e293b",
                    border: isMine ? "none" : "1px solid #e2e8f0",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      lineHeight: 1.5,
                      whiteSpace: "pre-wrap",
                      fontSize: "14px",
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
                          : "1px solid #e2e8f0",
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
        <div ref={streamEndRef} />
      </Box>

      {/* Compose Form */}
      {!isReadOnly ? (
        <Box
          component="form"
          onSubmit={handleSend}
          sx={{
            p: 2,
            borderTop: "1px solid #e2e8f0",
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
                bgcolor: "#f1f5f9",
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
              style={{ display: "none" }}
              onChange={handleMockFileUpload}
            />
            <Tooltip title="Đính kèm tệp tài liệu / hình ảnh">
              <IconButton
                onClick={() => fileInputRef.current?.click()}
                sx={{ color: "#64748b" }}
              >
                <Paperclip size={20} />
              </IconButton>
            </Tooltip>

            <TextField
              fullWidth
              size="small"
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
                  bgcolor: "#f8fafc",
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              disabled={!draft.trim() && !selectedFile}
              sx={{
                borderRadius: "24px",
                minWidth: "44px",
                height: "40px",
                p: 0,
                bgcolor: "#f4490b",
                "&:hover": { bgcolor: "#bd3d14" },
              }}
            >
              <Send size={18} />
            </Button>
          </Box>
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
