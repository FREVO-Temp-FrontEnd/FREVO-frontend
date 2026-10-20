import React from "react";
import { useParams, useSearchParams, useNavigate } from "react-router";
import { Box, Container, Breadcrumbs, Link as MuiLink, Typography, Button } from "@mui/material";
import { ArrowLeft } from "lucide-react";
import { useAuthSession } from "@/lib/hooks/useAuthSession";
import { useBusiness } from "@/lib/hooks/useBusiness";
import { mockStorage } from "@/lib/storage/mockStorage";
import { ProjectChatRoom } from "./ProjectChatRoom";

export const ProjectChatPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { user, role } = useAuthSession();
  const { projects, candidates, talents, unlockChat } = useBusiness();

  // Find project
  const project = projects.find((p) => p.id === projectId) || mockStorage.getProjectById(projectId || "");

  // Determine candidate/talent to chat with
  const queryTalentId = searchParams.get("talent");
  const projectCandidates = candidates.filter((c) => c.projectId === projectId);

  let targetCandidate = projectCandidates.find((c) => c.talentId === queryTalentId);
  if (!targetCandidate && projectCandidates.length > 0) {
    // If freelancer is logged in, pick their own candidate record
    if (role === "freelancer") {
      targetCandidate = projectCandidates.find((c) => c.talentId === "minh-anh" || c.talentId === "ha-vy") || projectCandidates[0];
    } else {
      targetCandidate = projectCandidates[0];
    }
  }

  const targetTalent = talents.find((t) => t.id === targetCandidate?.talentId);
  const [messages, setMessages] = React.useState(
    project && targetCandidate ? mockStorage.getMessages(project.id, targetCandidate.talentId) : []
  );

  React.useEffect(() => {
    if (project && targetCandidate) {
      setMessages(mockStorage.getMessages(project.id, targetCandidate.talentId));
    }
  }, [project, targetCandidate]);

  if (!project) {
    return (
      <Container maxWidth="lg" sx={{ py: 6, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          Không tìm thấy dự án tương ứng.
        </Typography>
        <Button
          onClick={() => navigate(role === "client" ? "/business/projects" : "/freelancer/applications")}
          sx={{ mt: 2, color: "#f4490b" }}
        >
          Quay lại danh sách
        </Button>
      </Container>
    );
  }

  if (!targetCandidate || !targetTalent) {
    return (
      <Container maxWidth="lg" sx={{ py: 6, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          Chưa có ứng viên nào để mở đoạn hội thoại cho dự án này.
        </Typography>
        <Button
          onClick={() => navigate(`/business/projects/${project.id}`)}
          sx={{ mt: 2, color: "#f4490b" }}
        >
          Quay lại quản lý dự án
        </Button>
      </Container>
    );
  }

  const handleSendMessage = (body: string, attachment?: { name: string; url: string }) => {
    const senderRole = role === "client" ? "business" : "talent";
    const senderName = user?.name || (role === "client" ? project.company : targetTalent.name);

    const newMsg = mockStorage.sendMessage(
      project.id,
      targetTalent.id,
      senderRole,
      senderName,
      body,
      attachment
    );
    setMessages((prev) => [...prev, newMsg]);
  };

  const handleApproveChat = () => {
    unlockChat(project.id, targetTalent.id);
  };

  const handleNavigateToAgreement = () => {
    navigate(`/business/projects/${project.id}/agreement?talent=${targetTalent.id}`);
  };

  const backLink =
    role === "client"
      ? `/business/projects/${project.id}`
      : `/freelancer/applications`;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 2 }}>
        <Breadcrumbs aria-label="breadcrumb">
          <MuiLink
            component="button"
            variant="body2"
            onClick={() => navigate(backLink)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              color: "#64748b",
              textDecoration: "none",
              "&:hover": { color: "#f4490b" },
            }}
          >
            <ArrowLeft size={16} /> Quay lại dự án
          </MuiLink>
          <Typography variant="body2" color="text.primary" sx={{ fontWeight: 600 }}>
            Kênh trao đổi: {project.title}
          </Typography>
        </Breadcrumbs>
      </Box>

      <ProjectChatRoom
        project={project}
        candidate={targetCandidate}
        talent={targetTalent}
        currentUserRole={role}
        currentUserName={user?.name || "Người dùng"}
        messages={messages}
        onSendMessage={handleSendMessage}
        onApproveChat={handleApproveChat}
        onNavigateToAgreement={handleNavigateToAgreement}
      />
    </Container>
  );
};

export default ProjectChatPage;
