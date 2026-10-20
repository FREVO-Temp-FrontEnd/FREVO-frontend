import React, { useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router";
import {
  Box,
  Container,
  Breadcrumbs,
  Link as MuiLink,
  Typography,
  Button,
} from "@mui/material";
import { ArrowLeft, Plus } from "lucide-react";
import { useAuthSession } from "@/lib/hooks/useAuthSession";
import { useBusiness } from "@/lib/hooks/useBusiness";
import { mockStorage } from "@/lib/storage/mockStorage";
import { DraftAgreementForm } from "./DraftAgreementForm";
import { AgreementReviewCard } from "./AgreementReviewCard";
import { AgreementVersionHistory } from "./AgreementVersionHistory";
import { SelectionClosedBanner } from "./SelectionClosedBanner";
import { AgreementExpiredState } from "./AgreementExpiredState";

export const ProjectAgreementPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { role } = useAuthSession();
  const { projects, candidates, talents, agreements, confirmAgreement } = useBusiness();

  const project = projects.find((p) => p.id === projectId) || mockStorage.getProjectById(projectId || "");
  const projectAgreements = agreements.filter((a) => a.projectId === projectId);

  const [selectedVersion, setSelectedVersion] = useState<number>(() => {
    if (projectAgreements.length > 0) {
      return Math.max(...projectAgreements.map((a) => a.version));
    }
    return 1;
  });

  const [isDraftingNew, setIsDraftingNew] = useState(false);

  // Determine talent
  const queryTalentId = searchParams.get("talent");
  const currentAgreement = projectAgreements.find((a) => a.version === selectedVersion) || projectAgreements[0];
  const effectiveAgreement = projectAgreements.find((a) => a.isEffective);

  const targetTalentId =
    currentAgreement?.talentId ||
    queryTalentId ||
    (candidates.find((c) => c.projectId === projectId && c.status === "offer")?.talentId) ||
    candidates.find((c) => c.projectId === projectId)?.talentId ||
    "minh-anh";

  const talent = talents.find((t) => t.id === targetTalentId) || talents[0];
  const isBusiness = role === "client" || role === "admin";

  if (!project) {
    return (
      <Container maxWidth="lg" sx={{ py: 6, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          Không tìm thấy dự án tương ứng.
        </Typography>
        <Button onClick={() => navigate("/business/projects")} sx={{ mt: 2, color: "#f4490b" }}>
          Quay lại danh sách dự án
        </Button>
      </Container>
    );
  }

  const handleCreateProposal = (proposalData: Parameters<typeof DraftAgreementForm>[0]["onSubmit"] extends (arg: infer T) => void ? T : never) => {
    mockStorage.createAgreementProposal({
      projectId: project.id,
      talentId: talent.id,
      scope: proposalData.scope,
      deliverables: proposalData.deliverables,
      deadline: proposalData.deadline,
      budget: proposalData.budget,
      budgetValue: proposalData.budgetValue,
      reference: proposalData.reference,
      milestones: proposalData.milestones,
    });
    setIsDraftingNew(false);
  };

  const handleConfirm = () => {
    if (currentAgreement?.id) {
      confirmAgreement(currentAgreement.id);
    }
  };

  const handleRequestRevision = () => {
    setIsDraftingNew(true);
  };

  const backLink = isBusiness
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
            Thỏa thuận hợp tác: {project.title}
          </Typography>
        </Breadcrumbs>
      </Box>

      {/* Selection Closed Banner if agreed */}
      {project.status === "ongoing" && effectiveAgreement && (
        <SelectionClosedBanner
          selectedTalentName={talent.name}
          selectedTalentKind={talent.kind}
          confirmedAt={effectiveAgreement.confirmedAt}
        />
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: projectAgreements.length > 1 ? "1fr 340px" : "1fr" },
          gap: 3,
        }}
      >
        <Box>
          {isDraftingNew || projectAgreements.length === 0 ? (
            <DraftAgreementForm
              project={project}
              talent={talent}
              existingAgreement={effectiveAgreement}
              onSubmit={handleCreateProposal}
              onCancel={projectAgreements.length > 0 ? () => setIsDraftingNew(false) : undefined}
            />
          ) : currentAgreement ? (
            currentAgreement.status === "expired" ? (
              <AgreementExpiredState
                version={currentAgreement.version}
                hasEffectiveVersion={!!effectiveAgreement && effectiveAgreement.version !== currentAgreement.version}
                effectiveVersionNumber={effectiveAgreement?.version}
                isBusiness={isBusiness}
                onRecreateProposal={() => setIsDraftingNew(true)}
              />
            ) : (
              <AgreementReviewCard
                agreement={currentAgreement}
                project={project}
                talent={talent}
                isBusiness={isBusiness}
                onConfirm={handleConfirm}
                onRequestRevision={handleRequestRevision}
              />
            )
          ) : null}
        </Box>

        {/* Version History Sidebar if versions exist */}
        {projectAgreements.length > 1 && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <AgreementVersionHistory
              agreements={projectAgreements}
              selectedVersion={selectedVersion}
              onSelectVersion={(v) => {
                setSelectedVersion(v);
                setIsDraftingNew(false);
              }}
            />

            {isBusiness && !isDraftingNew && (
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Plus size={16} />}
                onClick={() => setIsDraftingNew(true)}
                sx={{
                  borderColor: "#f4490b",
                  color: "#f4490b",
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: "8px",
                  "&:hover": { borderColor: "#bd3d14", bgcolor: "#fffaf7" },
                }}
              >
                Đề xuất điều chỉnh phiên bản mới
              </Button>
            )}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default ProjectAgreementPage;
