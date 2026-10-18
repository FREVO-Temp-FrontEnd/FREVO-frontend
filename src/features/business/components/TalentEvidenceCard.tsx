import { Box, Card, Typography, Chip, Button } from "@mui/material";
import { Link } from "react-router";
import { Sparkles, Check, ArrowRight, Briefcase } from "lucide-react";
import type { ProjectBrief, TalentProfile } from "@/lib/types/marketplace.types";
import { calculateMatchingScore } from "@/lib/utils/matchingScore";

interface TalentEvidenceCardProps {
  talent: TalentProfile;
  brief: ProjectBrief;
  isInvited: boolean;
  onOpenAIAnalysis: (talent: TalentProfile) => void;
  onOpenInvite: (talent: TalentProfile) => void;
}

export function TalentEvidenceCard({
  talent,
  brief,
  isInvited,
  onOpenAIAnalysis,
  onOpenInvite,
}: TalentEvidenceCardProps) {
  const evaluation = calculateMatchingScore(brief, talent);

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 3,
        p: 2.5,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        bgcolor: "#ffffff",
        transition: "transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
        },
      }}
    >
      <Box>
        {/* Card Header: Avatar, Name, Type, Match Score */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
          <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                bgcolor: talent.color || "#f4490b",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "1.1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {talent.initials}
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                {talent.name}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.85rem" }}>
                {talent.role} · {talent.location}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 0.5 }}>
            <Chip
              label={`${evaluation.score}% phù hợp`}
              size="small"
              sx={{
                bgcolor: evaluation.score >= 80 ? "#f0fdf4" : "#fff7ed",
                color: evaluation.score >= 80 ? "#15803d" : "#c2410c",
                fontWeight: 700,
                border: "1px solid",
                borderColor: evaluation.score >= 80 ? "#bbf7d0" : "#ffedd5",
              }}
            />
            <Chip
              label={talent.kind}
              size="small"
              variant="outlined"
              sx={{ fontSize: "0.75rem", height: 20 }}
            />
          </Box>
        </Box>

        {/* Explainable Rationale Badges (BR-026) */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, display: "block", mb: 0.5 }}>
            Lý do phù hợp (BR-026):
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            {evaluation.reasons.map((reason, idx) => (
              <Box key={idx} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Check size={14} color="#16a34a" />
                <Typography variant="caption" sx={{ color: "#374151" }}>
                  {reason}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Matched & Relevant Skills (FR-017) */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {talent.skills.slice(0, 4).map((skill) => {
              const isOverlap = evaluation.skillOverlap
                .map((s) => s.toLowerCase().trim())
                .includes(skill.toLowerCase().trim());
              return (
                <Chip
                  key={skill}
                  label={skill}
                  size="small"
                  variant={isOverlap ? "filled" : "outlined"}
                  sx={{
                    fontSize: "0.75rem",
                    ...(isOverlap
                      ? { bgcolor: "#eff6ff", color: "#1d4ed8", fontWeight: 600 }
                      : { color: "text.secondary" }),
                  }}
                />
              );
            })}
          </Box>
        </Box>

        {/* Portfolio Highlights (BR-027) */}
        {talent.portfolio.length > 0 && (
          <Box sx={{ mb: 2, pt: 1, borderTop: "1px dashed #f0f0f0" }}>
            <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, display: "block", mb: 0.8 }}>
              Dự án tiêu biểu (BR-027):
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              {talent.portfolio.slice(0, 2).map((item, idx) => (
                <Box
                  key={idx}
                  sx={{
                    flex: 1,
                    p: 1,
                    borderRadius: 1.5,
                    bgcolor: "#fafaf9",
                    border: "1px solid #f2f0ea",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Briefcase size={14} color="#6b7280" />
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 500,
                      color: "#444",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.title}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>

      {/* Card Actions */}
      <Box
        sx={{
          pt: 2,
          mt: 1,
          borderTop: "1px solid #f3f4f6",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            size="small"
            variant="text"
            startIcon={<Sparkles size={14} color="#f4490b" />}
            onClick={() => onOpenAIAnalysis(talent)}
            sx={{
              color: "#f4490b",
              fontWeight: 600,
              fontSize: "0.8rem",
              textTransform: "none",
            }}
          >
            Phân tích AI
          </Button>

          <Button
            component={Link}
            to={`/business/talent/${talent.id}?project=${brief.id}`}
            size="small"
            variant="text"
            sx={{
              color: "text.secondary",
              fontSize: "0.8rem",
              textTransform: "none",
            }}
          >
            Hồ sơ
          </Button>
        </Box>

        <Button
          size="small"
          variant="contained"
          disabled={isInvited || brief.status !== "published"}
          onClick={() => onOpenInvite(talent)}
          endIcon={!isInvited && <ArrowRight size={14} />}
          sx={{
            bgcolor: "#f4490b",
            "&:hover": { bgcolor: "#d63b04" },
            fontWeight: 600,
            fontSize: "0.8rem",
            textTransform: "none",
            borderRadius: 2,
          }}
        >
          {isInvited ? "Đã gửi lời mời" : "Mời dự án"}
        </Button>
      </Box>
    </Card>
  );
}
