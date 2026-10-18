import { useState, useMemo } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { Search, Sparkles } from "lucide-react";
import type { ProjectBrief, TalentProfile } from "@/lib/types/marketplace.types";
import { useBusiness } from "@/lib/hooks/useBusiness";
import { TalentEvidenceCard } from "./TalentEvidenceCard";
import { AIFitAnalysisModal } from "./AIFitAnalysisModal";
import { SendInvitationDialog } from "./SendInvitationDialog";
import { EmptyMatchingState } from "./EmptyMatchingState";
import { calculateMatchingScore } from "@/lib/utils/matchingScore";

interface CandidateSuggestionsTabProps {
  project: ProjectBrief;
}

export function CandidateSuggestionsTab({ project }: CandidateSuggestionsTabProps) {
  const { talents, invitations, sendInvitation } = useBusiness();

  // Search & Filter state (BUS-008)
  const [query, setQuery] = useState("");
  const [entityFilter, setEntityFilter] = useState<string>("all");
  const [minScoreFilter, setMinScoreFilter] = useState<number>(0);
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string | null>(null);

  // Dialog states
  const [aiAnalysisTalent, setAiAnalysisTalent] = useState<TalentProfile | null>(null);
  const [inviteTalent, setInviteTalent] = useState<TalentProfile | null>(null);

  // 1. Deduplication per BR-028:
  // "Team profiles appear at most once in suggestions list; team members may appear individually based on personal skills."
  const deduplicatedTalents = useMemo(() => {
    const seenTeams = new Set<string>();
    const result: TalentProfile[] = [];

    for (const t of talents) {
      if (t.kind === "Team") {
        if (!seenTeams.has(t.name)) {
          seenTeams.add(t.name);
          result.push(t);
        }
      } else {
        result.push(t);
      }
    }
    return result;
  }, [talents]);

  // 2. Filter & Sort by Matching Score (DEC-01)
  const filteredAndScoredTalents = useMemo(() => {
    const scored = deduplicatedTalents.map((t) => ({
      talent: t,
      evaluation: calculateMatchingScore(project, t),
    }));

    return scored
      .filter(({ talent, evaluation }) => {
        // Query search
        if (query.trim()) {
          const q = query.toLowerCase().trim();
          const matchesName = talent.name.toLowerCase().includes(q);
          const matchesRole = talent.role.toLowerCase().includes(q);
          const matchesSkills = talent.skills.some((s) => s.toLowerCase().includes(q));
          if (!matchesName && !matchesRole && !matchesSkills) return false;
        }

        // Entity filter (All / Individual / Team)
        if (entityFilter !== "all" && talent.kind !== entityFilter) {
          return false;
        }

        // Min score filter
        if (evaluation.score < minScoreFilter) {
          return false;
        }

        // Specific skill chip filter
        if (selectedSkillFilter) {
          const hasSkill = talent.skills
            .map((s) => s.toLowerCase().trim())
            .includes(selectedSkillFilter.toLowerCase().trim());
          if (!hasSkill) return false;
        }

        return true;
      })
      .sort((a, b) => b.evaluation.score - a.evaluation.score);
  }, [deduplicatedTalents, project, query, entityFilter, minScoreFilter, selectedSkillFilter]);

  const handleResetFilters = () => {
    setQuery("");
    setEntityFilter("all");
    setMinScoreFilter(0);
    setSelectedSkillFilter(null);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Header Eyebrow & AI Recommendation Banner */}
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
            GỢI Ý THEO BRIEF (BUS-007)
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Ứng viên & Đội ngũ phù hợp
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Hệ thống đối sánh kỹ năng và portfolio minh họa để gợi ý các hồ sơ tương thích nhất (FR-017, BR-026).
          </Typography>
        </Box>

        <Chip
          icon={<Sparkles size={16} color="#f4490b" />}
          label="Gợi ý thông minh (DEC-01)"
          variant="outlined"
          sx={{
            borderColor: "#fed7aa",
            bgcolor: "#fff7ed",
            color: "#c2410c",
            fontWeight: 700,
          }}
        />
      </Box>

      {/* Filter & Search Toolbar (BUS-008) */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          p: 2,
          bgcolor: "#fafaf9",
          borderRadius: 2.5,
          border: "1px solid #e7e5e4",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          {/* Entity Segmented Control */}
          <ToggleButtonGroup
            value={entityFilter}
            exclusive
            onChange={(_, val) => val && setEntityFilter(val)}
            size="small"
            sx={{
              "& .MuiToggleButton-root": {
                textTransform: "none",
                fontWeight: 600,
                px: 2,
                fontSize: "0.85rem",
              },
            }}
          >
            <ToggleButton value="all">Tất cả</ToggleButton>
            <ToggleButton value="Cá nhân">Cá nhân</ToggleButton>
            <ToggleButton value="Team">Team (BR-028)</ToggleButton>
          </ToggleButtonGroup>

          {/* Min Score Filter */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
              Độ phù hợp:
            </Typography>
            <ToggleButtonGroup
              value={minScoreFilter}
              exclusive
              onChange={(_, val) => val !== null && setMinScoreFilter(val)}
              size="small"
              sx={{
                "& .MuiToggleButton-root": {
                  textTransform: "none",
                  fontWeight: 600,
                  px: 1.5,
                  fontSize: "0.8rem",
                },
              }}
            >
              <ToggleButton value={0}>Tất cả</ToggleButton>
              <ToggleButton value={75}>&gt;= 75%</ToggleButton>
              <ToggleButton value={85}>&gt;= 85%</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Search Bar */}
          <TextField
            size="small"
            placeholder="Tìm tên, chuyên môn, kỹ năng..."
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

        {/* Skill filter chips */}
        {project.skills.length > 0 && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap", pt: 1, borderTop: "1px dashed #e7e5e4" }}>
            <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
              Lọc theo kỹ năng dự án:
            </Typography>
            {project.skills.map((skill) => {
              const isSelected = selectedSkillFilter === skill;
              return (
                <Chip
                  key={skill}
                  label={skill}
                  size="small"
                  onClick={() => setSelectedSkillFilter(isSelected ? null : skill)}
                  color={isSelected ? "primary" : "default"}
                  variant={isSelected ? "filled" : "outlined"}
                  sx={{
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: "0.75rem",
                    ...(isSelected
                      ? { bgcolor: "#f4490b", color: "#fff" }
                      : { bgcolor: "#fff" }),
                  }}
                />
              );
            })}
            {selectedSkillFilter && (
              <Chip
                label="Bỏ chọn kỹ năng"
                size="small"
                onDelete={() => setSelectedSkillFilter(null)}
                sx={{ fontSize: "0.75rem" }}
              />
            )}
          </Box>
        )}
      </Box>

      {/* Suggestions Grid */}
      {filteredAndScoredTalents.length > 0 ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
            gap: 2.5,
          }}
        >
          {filteredAndScoredTalents.map(({ talent }) => {
            const isInvited = invitations.some(
              (inv) =>
                inv.projectId === project.id &&
                inv.talentId === talent.id &&
                (inv.status === "pending" || inv.status === "accepted")
            );

            return (
              <TalentEvidenceCard
                key={talent.id}
                talent={talent}
                brief={project}
                isInvited={isInvited}
                onOpenAIAnalysis={(t) => setAiAnalysisTalent(t)}
                onOpenInvite={(t) => setInviteTalent(t)}
              />
            );
          })}
        </Box>
      ) : (
        <EmptyMatchingState onResetFilters={handleResetFilters} />
      )}

      {/* Advisory Legal Note */}
      <Typography variant="caption" sx={{ color: "text.secondary", textAlign: "center", display: "block" }}>
        Dữ liệu gợi ý được tính toán minh họa theo thuật toán đối sánh heuristic (DEC-01) của FREVO. Khuyến cáo quy định theo FR-036.
      </Typography>

      {/* AI Fit Breakdown Modal (BUS-015) */}
      {aiAnalysisTalent && (
        <AIFitAnalysisModal
          open={!!aiAnalysisTalent}
          onClose={() => setAiAnalysisTalent(null)}
          brief={project}
          talent={aiAnalysisTalent}
          onInvite={(talentId) => {
            const t = talents.find((item) => item.id === talentId);
            if (t) setInviteTalent(t);
          }}
          isInvited={invitations.some(
            (inv) =>
              inv.projectId === project.id &&
              inv.talentId === aiAnalysisTalent.id &&
              (inv.status === "pending" || inv.status === "accepted")
          )}
        />
      )}

      {/* Send 7-Day Invitation Dialog (BUS-009) */}
      {inviteTalent && (
        <SendInvitationDialog
          open={!!inviteTalent}
          onClose={() => setInviteTalent(null)}
          brief={project}
          talent={inviteTalent}
          onConfirm={(talentId, note) => {
            sendInvitation(project.id, talentId, note);
          }}
        />
      )}
    </Box>
  );
}
