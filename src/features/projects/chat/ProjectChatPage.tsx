import React from "react";
import { useParams, useSearchParams, useNavigate } from "react-router";
import { Container, Typography, Button } from "@mui/material";
import { ProjectBreadcrumbs } from "@/app/shared/components/ProjectBreadcrumbs";
import { useAuthSession } from "@/lib/hooks/useAuthSession";
import { useBusiness } from "@/lib/hooks/useBusiness";
import { mockStorage } from "@/lib/storage/mockStorage";
import { ProjectChatRoom } from "./ProjectChatRoom";

interface ProjectChatPageProps {
  projectIdOverride?: string;
  talentIdOverride?: string;
  embedded?: boolean;
  onBackToList?: () => void;
}

export const ProjectChatPage: React.FC<ProjectChatPageProps> = ({
  projectIdOverride,
  talentIdOverride,
  embedded = false,
  onBackToList,
}) => {
  const { projectId: routeProjectId } = useParams<{ projectId: string }>();
  const projectId = projectIdOverride ?? routeProjectId;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { user, role } = useAuthSession();
  const { projects, candidates, talents, unlockChat } = useBusiness();

  // Find project
  const project = projects.find((p) => p.id === projectId) || mockStorage.getProjectById(projectId || "");

  // Determine candidate/talent to chat with
  const queryTalentId = talentIdOverride ?? searchParams.get("talent");
  const projectCandidates = candidates.filter((c) => c.projectId === projectId);

  let targetCandidate = projectCandidates.find((c) => c.talentId === queryTalentId);
  if (!targetCandidate && projectCandidates.length > 0) {
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
    const isBusiness = role === "client" || role === "admin";
    const senderRole = isBusiness ? "business" : "talent";
    const senderName = user?.name || (isBusiness ? project.company : targetTalent.name);

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

  const chatRoom = (
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
      inboxMode={embedded}
      onBackToList={onBackToList}
    />
  );

  if (embedded) return chatRoom;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <ProjectBreadcrumbs
        items={
          role === "client" || role === "admin"
            ? [
                { label: "Dự án của tôi", to: "/business/projects" },
                { label: project.title, to: `/business/projects/${project.id}` },
                { label: "Tin nhắn" },
              ]
            : [
                { label: "Việc làm đã ứng tuyển", to: "/freelancer/applications" },
                { label: project.title, to: `/projects/${project.id}/details` },
                { label: "Tin nhắn" },
              ]
        }
      />

      {chatRoom}
    </Container>
  );
};

export default ProjectChatPage;
