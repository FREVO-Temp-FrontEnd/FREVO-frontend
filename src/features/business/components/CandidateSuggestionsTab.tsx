import { normalized } from "@/lib/utils/formatters";
import { CandidateComparison } from "./CandidateComparison";
import { useState, useMemo } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Chip, Checkbox, FormControlLabel,
} from "@mui/material";
import { Search } from "lucide-react";
import type { ProjectBrief, TalentProfile } from "@/lib/types/marketplace.types";
import { useBusiness } from "@/lib/hooks/useBusiness";
import { TalentEvidenceCard } from "./TalentEvidenceCard";
import { AIFitAnalysisModal } from "./AIFitAnalysisModal";
import { SendInvitationDialog } from "./SendInvitationDialog";
import { EmptyMatchingState } from "./EmptyMatchingState";
import { calculateMatchingScore, canonicalSkill } from "@/lib/utils/matchingScore";

interface CandidateSuggestionsTabProps {
  project: ProjectBrief;
}

export function CandidateSuggestionsTab({ project }: CandidateSuggestionsTabProps) {
  const { talents, invitations, sendInvitation } = useBusiness();

  // Search & Filter state (BUS-008)
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [budgetOnly, setBudgetOnly] = useState(false);
  const [availableOnly, setAvailableOnly] = useState(false);
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
        if (!seenTeams.has(t.id)) {
          seenTeams.add(t.id);
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
          const q = normalized(query).trim();
          const matchesName = normalized(talent.name).includes(q);
          const matchesRole = normalized(talent.role).includes(q);
          const matchesSkills = talent.skills.some((s) => normalized(s).includes(q) || canonicalSkill(s) === canonicalSkill(query));
          if (!matchesName && !matchesRole && !matchesSkills) return false;
        }

        // Entity filter (All / Individual / Team)
        if (entityFilter !== "all" && talent.kind !== entityFilter) {
          return false;
        }

        if (budgetOnly && evaluation.budget !== "overlap") return false;
        if (availableOnly && !evaluation.availableNow) return false;
        // Min score filter
        if (evaluation.score < minScoreFilter) {
          return false;
        }

        // Specific skill chip filter
        if (selectedSkillFilter) {
          const hasSkill = talent.skills
            .map(canonicalSkill)
            .includes(canonicalSkill(selectedSkillFilter));
          if (!hasSkill) return false;
        }

        return true;
      })
      .sort((a, b) => b.evaluation.score - a.evaluation.score || Number(b.evaluation.preferenceFit) - Number(a.evaluation.preferenceFit));
  }, [deduplicatedTalents, project, query, entityFilter, minScoreFilter, selectedSkillFilter, budgetOnly, availableOnly]);

  const handleResetFilters = () => {
    setBudgetOnly(false); setAvailableOnly(false);
    setQuery("");
    setEntityFilter("all");
    setMinScoreFilter(0);
    setSelectedSkillFilter(null);
  };

  return (
    <Box
      sx={(theme) => ({
        display: "flex",
        flexDirection: "column",
        gap: 2,
        fontFamily: theme.typography.fontFamily,
        "&& button:not(.fb-button), && .MuiButton-root": {
          fontFamily: theme.typography.fontFamily,
          fontSize: "12px",
          fontWeight: 600,
          letterSpacing: 0,
          lineHeight: 1.4,
          textTransform: "none",
        },
        "&& input": { fontFamily: theme.typography.fontFamily, fontSize: "13px" },
        "&& .MuiTypography-root": { fontFamily: theme.typography.fontFamily, letterSpacing: 0 },
        "&& h2, && h3": { fontFamily: theme.typography.h2.fontFamily },
        "&& .MuiChip-root": { fontFamily: theme.typography.fontFamily, fontSize: "12px" },
      })}
    >
      <div className="mb-1 flex flex-wrap items-center justify-between gap-3"><div><div className="flex items-center gap-2"><Typography component="h2" sx={{ fontSize: 22, fontWeight: 700 }}>Ứng viên phù hợp</Typography><Chip size="small" label={filteredAndScoredTalents.length} sx={{ height: 24, bgcolor: "#eeefeb", fontWeight: 700 }} /></div><Typography sx={{ mt: 0.5, fontSize: 13, color: "text.secondary" }}>Khám phá năng lực, xem portfolio và chủ động gửi lời mời.</Typography></div></div>
      {/* Filter & Search Toolbar (BUS-008) */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          px: { xs: 2, sm: 2.5 },
          py: 2,
          bgcolor: "#fff",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1.5,
          }}
        >
          {/* Entity Segmented Control */}
          <div className="flex flex-wrap items-center gap-1" role="group" aria-label="Lọc theo loại hồ sơ">
            {([ ["all", "Tất cả"], ["Cá nhân", "Cá nhân"], ["Team", "Team"] ] as const).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setEntityFilter(value)}
                aria-pressed={entityFilter === value}
                className={`rounded-full px-3 py-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f4490b] ${entityFilter === value ? "bg-[#20201f] text-white" : "bg-[#f7f7f6] text-[#20201f] hover:bg-[#eeeae7]"}`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Min Score Filter */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
            <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>Tiêu chí có bằng chứng:</Typography>
            {([ [0, "Tất cả"], [2, "Từ 2 tiêu chí"], [3, "Đủ 3 tiêu chí"] ] as const).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setMinScoreFilter(value)}
                aria-pressed={minScoreFilter === value}
                className={`rounded-full px-3 py-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f4490b] ${minScoreFilter === value ? "bg-[#20201f] text-white" : "bg-[#f7f7f6] text-[#20201f] hover:bg-[#eeeae7]"}`}
              >
                {label}
              </button>
            ))}
          </Box>

          {/* Search Bar */}
          <TextField
            size="small"
            placeholder="Tìm tên, chuyên môn, kỹ năng..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            slotProps={{
              htmlInput: { "aria-label": "Tìm hồ sơ phù hợp" },
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={16} color="#78716c" />
                  </InputAdornment>
                ),
              },
            }}
            sx={{ minWidth: { xs: "100%", md: 220 }, "& .MuiOutlinedInput-root": { height: 36, borderRadius: 999, bgcolor: "#f7f7f6", fontSize: 13 }, "& fieldset": { borderColor: "transparent" } }}
          />
        </Box>

        <div className="flex flex-wrap gap-x-5 gap-y-1"><FormControlLabel control={<Checkbox size="small" checked={budgetOnly} onChange={event => setBudgetOnly(event.target.checked)} />} label={<Typography sx={{ fontSize: 12 }}>Khoảng phí giao với ngân sách</Typography>} /><FormControlLabel control={<Checkbox size="small" checked={availableOnly} onChange={event => setAvailableOnly(event.target.checked)} />} label={<Typography sx={{ fontSize: 12 }}>Hồ sơ ghi có thể bắt đầu ngay</Typography>} /></div>
        {/* Skill filter chips */}
        {project.skills.length > 0 && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap", pt: 1, borderTop: "1px solid #eceae7" }}>
            <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
              Kỹ năng:
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
                    fontSize: "12px",
                    fontFamily: '"Be Vietnam Pro", sans-serif',
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
                sx={{ fontFamily: '"Be Vietnam Pro", sans-serif', fontSize: "12px" }}
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
            gridTemplateColumns: { xs: "1fr", lg: "repeat(2, minmax(0, 1fr))" },
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
                comparing={compareIds.includes(talent.id)}
                compareDisabled={!compareIds.includes(talent.id) && compareIds.length >= 3}
                onCompare={() => setCompareIds(ids => ids.includes(talent.id) ? ids.filter(id => id !== talent.id) : ids.length < 3 ? [...ids, talent.id] : ids)}
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

      <Typography variant="caption" sx={{ color: "text.secondary", textAlign: "center", display: "block" }}>
        Gợi ý được mô phỏng từ kỹ năng và hồ sơ năng lực. Hãy xem hồ sơ trước khi gửi lời mời.
      </Typography>

      <CandidateComparison project={project} suggestions ids={compareIds} onRemove={id => setCompareIds(ids => id ? ids.filter(value => value !== id) : [])} />
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
