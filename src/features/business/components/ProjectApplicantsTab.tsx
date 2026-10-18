import { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Card,
  Chip,
  Button,
  TextField,
  InputAdornment,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { Link } from "react-router";
import {
  Users,
  Search,
  MessageCircle,
  Lock,
  ShieldCheck,
  ArrowRight,
  PlusCircle,
} from "lucide-react";
import type { Candidate, ProjectBrief } from "@/lib/types/marketplace.types";
import { useBusiness } from "@/lib/hooks/useBusiness";
import { mockStorage } from "@/lib/storage/mockStorage";
import { CandidateReviewModal } from "./CandidateReviewModal";
import { calculateMatchingScore } from "@/lib/utils/matchingScore";

interface ProjectApplicantsTabProps {
  project: ProjectBrief;
}

export function ProjectApplicantsTab({ project }: ProjectApplicantsTabProps) {
  const { candidates, talents, unlockChat } = useBusiness();

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const projectCandidates = useMemo(() => {
    return candidates.filter((c) => c.projectId === project.id);
  }, [candidates, project.id]);

  const filteredCandidates = useMemo(() => {
    return projectCandidates.filter((c) => {
      const talent = talents.find((t) => t.id === c.talentId);

      // Search query
      if (query.trim()) {
        const q = query.toLowerCase().trim();
        const matchesName = talent?.name.toLowerCase().includes(q) ?? false;
        const matchesProposal = c.proposal.toLowerCase().includes(q);
        const matchesRole = talent?.role.toLowerCase().includes(q) ?? false;
        if (!matchesName && !matchesProposal && !matchesRole) return false;
      }

      // Status filter
      if (statusFilter === "new") {
        return c.status === "new" || c.status === "under_review";
      }
      if (statusFilter !== "all" && c.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [projectCandidates, talents, query, statusFilter]);

  const selectedTalent = selectedCandidate
    ? talents.find((t) => t.id === selectedCandidate.talentId)
    : undefined;

  const handleSimulateNewApplicant = () => {
    const unappliedTalents = talents.filter(
      (t) => !projectCandidates.some((c) => c.talentId === t.id)
    );
    if (unappliedTalents.length > 0) {
      const nextTalent = unappliedTalents[0];
      const newCand: Candidate = {
        id: `c-sim-${Date.now()}`,
        projectId: project.id,
        talentId: nextTalent.id,
        source: "Ứng tuyển",
        status: "new",
        proposal: `Tôi rất quan tâm đến dự án "${project.title}" và tin rằng năng lực của tôi hoàn toàn đáp ứng các sản phẩm bàn giao theo brief.`,
        receivedAt: new Date().toISOString(),
        unread: true,
        chatUnlocked: false, // BR-012: locked until business approval
        fitScore: 89,
      };
      mockStorage.addCandidate(newCand);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Tab Header & Simulation Action */}
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
            HỒ SƠ ỨNG TUYỂN (BUS-011, BUS-012)
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Danh sách ứng viên ({projectCandidates.length})
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Thẩm định hồ sơ, đánh giá mức độ tương thích và phê duyệt mở kênh chat trực tiếp (FR-031, BR-012).
          </Typography>
        </Box>

        {project.status === "published" && (
          <Button
            variant="outlined"
            size="small"
            startIcon={<PlusCircle size={15} />}
            onClick={handleSimulateNewApplicant}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              color: "#44403c",
              borderColor: "#d6d3d1",
            }}
          >
            Mô phỏng ứng tuyển mới
          </Button>
        )}
      </Box>

      {/* Filter & Search Toolbar (BUS-012) */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", md: "center" },
          gap: 2,
          p: 2,
          bgcolor: "#fafaf9",
          borderRadius: 2.5,
          border: "1px solid #e7e5e4",
        }}
      >
        <ToggleButtonGroup
          value={statusFilter}
          exclusive
          onChange={(_, val) => val && setStatusFilter(val)}
          size="small"
          sx={{
            flexWrap: "wrap",
            "& .MuiToggleButton-root": {
              textTransform: "none",
              fontWeight: 600,
              px: 1.8,
              py: 0.6,
              fontSize: "0.8rem",
            },
          }}
        >
          <ToggleButton value="all">Tất cả ({projectCandidates.length})</ToggleButton>
          <ToggleButton value="new">
            Chờ xem xét ({projectCandidates.filter((c) => c.status === "new" || c.status === "under_review").length})
          </ToggleButton>
          <ToggleButton value="discussing">
            Đang trao đổi ({projectCandidates.filter((c) => c.status === "discussing").length})
          </ToggleButton>
          <ToggleButton value="offer">
            Chờ xác nhận ({projectCandidates.filter((c) => c.status === "offer").length})
          </ToggleButton>
          <ToggleButton value="selected">
            Đã chọn ({projectCandidates.filter((c) => c.status === "selected").length})
          </ToggleButton>
        </ToggleButtonGroup>

        <TextField
          size="small"
          placeholder="Tìm tên, đề xuất ứng tuyển..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={16} color="#78716c" />
                </InputAdornment>
              ),
            },
          }}
          sx={{ minWidth: 260 }}
        />
      </Box>

      {/* Candidates List */}
      {filteredCandidates.length > 0 ? (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {filteredCandidates.map((candidate) => {
            const talent = talents.find((t) => t.id === candidate.talentId);
            if (!talent) return null;

            const evaluation = calculateMatchingScore(project, talent);
            const formattedDate = new Date(candidate.receivedAt).toLocaleDateString("vi-VN");

            return (
              <Card
                key={candidate.id}
                variant="outlined"
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  bgcolor: "#ffffff",
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  justifyContent: "space-between",
                  alignItems: { xs: "stretch", md: "center" },
                  gap: 2,
                  transition: "box-shadow 0.15s ease",
                  "&:hover": { boxShadow: "0 6px 20px rgba(0,0,0,0.06)" },
                }}
              >
                {/* Identity & Content */}
                <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start", flex: 1 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      bgcolor: talent.color || "#f4490b",
                      color: "#fff",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.1rem",
                      flexShrink: 0,
                    }}
                  >
                    {talent.initials}
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5, flexWrap: "wrap" }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        {talent.name}
                      </Typography>
                      <Chip
                        label={talent.kind}
                        size="small"
                        variant="outlined"
                        sx={{ height: 20, fontSize: "0.75rem", fontWeight: 600 }}
                      />
                      <Chip
                        label={candidate.source}
                        size="small"
                        sx={{ height: 20, fontSize: "0.75rem", bgcolor: "#f3f4f6", color: "#4b5563" }}
                      />
                      <Chip
                        label={`${evaluation.score}% phù hợp`}
                        size="small"
                        color={evaluation.score >= 80 ? "success" : "warning"}
                        sx={{ height: 20, fontSize: "0.75rem", fontWeight: 700 }}
                      />
                    </Box>

                    <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
                      {talent.role} · {talent.location} · Nhận ngày {formattedDate}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: "#374151",
                        bgcolor: "#fafaf9",
                        p: 1.2,
                        borderRadius: 1.5,
                        fontSize: "0.85rem",
                        lineHeight: 1.5,
                        maxHeight: 60,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {candidate.proposal}
                    </Typography>
                  </Box>
                </Box>

                {/* Right: Gated Chat & Actions */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: { xs: "stretch", md: "flex-end" },
                    gap: 1.2,
                    minWidth: 200,
                  }}
                >
                  {/* Chat Gating Indicator (FR-031, BR-012) */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                    {candidate.chatUnlocked ? (
                      <Chip
                        icon={<MessageCircle size={13} color="#15803d" />}
                        label="Đã mở chat"
                        size="small"
                        sx={{ bgcolor: "#f0fdf4", color: "#15803d", fontWeight: 600 }}
                      />
                    ) : (
                      <Chip
                        icon={<Lock size={12} color="#b45309" />}
                        label="Chat đang khóa (BR-012)"
                        size="small"
                        sx={{ bgcolor: "#fffbeb", color: "#b45309", fontWeight: 600 }}
                      />
                    )}
                  </Box>

                  <Box sx={{ display: "flex", gap: 1, width: "100%", justifyContent: { xs: "stretch", md: "flex-end" } }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setSelectedCandidate(candidate)}
                      sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600, flex: { xs: 1, md: "initial" } }}
                    >
                      Xem hồ sơ
                    </Button>

                    {!candidate.chatUnlocked ? (
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<ShieldCheck size={14} />}
                        onClick={() => unlockChat(project.id, candidate.talentId)}
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: 600,
                          bgcolor: "#16a34a",
                          "&:hover": { bgcolor: "#15803d" },
                          flex: { xs: 1, md: "initial" },
                        }}
                      >
                        Duyệt mở chat
                      </Button>
                    ) : (
                      <Button
                        component={Link}
                        to={`/business/projects/${project.id}/messages?talent=${candidate.talentId}`}
                        variant="contained"
                        size="small"
                        endIcon={<ArrowRight size={14} />}
                        sx={{
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: 600,
                          bgcolor: "#f4490b",
                          "&:hover": { bgcolor: "#d63b04" },
                          flex: { xs: 1, md: "initial" },
                        }}
                      >
                        Nhắn tin
                      </Button>
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
            <Users size={26} strokeWidth={1.8} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#292524", fontSize: "1.1rem" }}>
            Không có ứng viên nào trong mục này
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", maxWidth: 440 }}>
            {statusFilter === "all"
              ? "Dự án hiện chưa có hồ sơ ứng tuyển nào. Bạn có thể xem gợi ý và gửi lời mời tham gia dự án."
              : "Không tìm thấy hồ sơ nào phù hợp với bộ lọc hoặc từ khóa tìm kiếm."}
          </Typography>
        </Box>
      )}

      {/* Candidate Review Modal (BUS-013) */}
      {selectedCandidate && (
        <CandidateReviewModal
          open={!!selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
          candidate={selectedCandidate}
          talent={selectedTalent}
          project={project}
          onUnlockChat={(talentId) => unlockChat(project.id, talentId)}
        />
      )}
    </Box>
  );
}
