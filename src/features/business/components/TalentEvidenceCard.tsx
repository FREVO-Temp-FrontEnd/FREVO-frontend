import { useState } from "react";
import { Avatar, Box, Button, Card, Typography, Chip, Tooltip, IconButton, Menu, MenuItem } from "@mui/material";
import { Link } from "react-router";
import { Sparkles, Check, ArrowRight, Clock3, Wallet, MoreHorizontal } from "lucide-react";
import type { ProjectBrief, TalentProfile } from "@/lib/types/marketplace.types";
import { calculateMatchingScore, canonicalSkill } from "@/lib/utils/matchingScore";
import { TalentPortfolioPreview } from "./TalentPortfolioPreview";

interface TalentEvidenceCardProps {
  onCompare?: () => void;
  comparing?: boolean;
  compareDisabled?: boolean;
  talent: TalentProfile;
  brief: ProjectBrief;
  isInvited: boolean;
  onOpenAIAnalysis: (talent: TalentProfile) => void;
  onOpenInvite: (talent: TalentProfile) => void;
}

export function TalentEvidenceCard({
  onCompare, comparing, compareDisabled,
  talent,
  brief,
  isInvited,
  onOpenAIAnalysis,
  onOpenInvite,
}: TalentEvidenceCardProps) {
  const [menu, setMenu] = useState<HTMLElement | null>(null);
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
        borderColor: "divider",
        boxShadow: "none",
        transition: "border-color 150ms ease",
        "&:hover": {
          borderColor: "#cfd5ca",
        },
        "@media (prefers-reduced-motion: reduce)": { transition: "none" },
      }}
    >
      {onCompare && <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}><IconButton aria-label={`Thao tác với ${talent.name}`} aria-haspopup="menu" aria-expanded={Boolean(menu)} onClick={event => setMenu(event.currentTarget)}><MoreHorizontal size={18} /></IconButton><Menu anchorEl={menu} open={Boolean(menu)} onClose={() => setMenu(null)}><MenuItem disabled={compareDisabled} onClick={() => { setMenu(null); onCompare(); }}>{comparing ? "Bỏ khỏi so sánh" : compareDisabled ? "Đã chọn tối đa 3 ứng viên" : "Thêm vào so sánh"}</MenuItem></Menu></Box>}
      <Box>
        {/* Card Header: Avatar, Name, Type, Match Score */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
          <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", minWidth: 0, flex: "1 1 190px" }}>
            <Avatar src={talent.avatar} alt={talent.name}
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
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography component="h3" sx={{ fontSize: 18, fontWeight: 700, lineHeight: 1.4 }}>
                {talent.name}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.85rem" }}>
                {talent.role}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 0.5 }}>
            <Chip
              label={evaluation.score ? `${evaluation.score}/3 tiêu chí có bằng chứng` : "Cần đối chiếu thêm"}
              size="small"
              sx={{
                bgcolor: evaluation.score >= 2 ? "#f0fdf4" : "#fff7ed",
                color: evaluation.score >= 2 ? "#15803d" : "#c2410c",
                fontWeight: 700,
                border: "1px solid",
                borderColor: evaluation.score >= 2 ? "#bbf7d0" : "#ffedd5",
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

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1.5, p: 1.5, mb: 2.5, bgcolor: "background.default", borderRadius: 2 }}>
          <div className="flex items-start gap-2"><Wallet size={15} className="mt-0.5 shrink-0 text-[#747773]" aria-hidden="true" /><div><p className="m-0 text-[11px] text-[#747773]">Mức phí dự kiến</p><p className="mb-0 mt-1 text-[13px] font-semibold">{talent.rate || "Chưa cập nhật"}</p></div></div>
          <div className="flex items-start gap-2"><Clock3 size={15} className="mt-0.5 shrink-0 text-[#747773]" aria-hidden="true" /><div><p className="m-0 text-[11px] text-[#747773]">Lịch làm việc</p><p className="mb-0 mt-1 text-[13px] font-medium">{evaluation.availability}</p></div></div>
        </Box>

        {/* Explainable Rationale Badges (BR-026) */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, display: "block", mb: 0.5 }}>
            Lý do phù hợp
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            {!evaluation.reasons.length && <Typography sx={{ fontSize: 12, color: "text.secondary" }}>Chưa đủ dữ liệu đối chiếu. Hãy xem hồ sơ và portfolio.</Typography>}
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

        <Typography sx={{ fontSize: 11, color: evaluation.budget === "outside" ? "primary.dark" : "text.secondary", mb: 2 }}>{evaluation.budget === "unknown" ? "Chưa có đủ khoảng phí để đối chiếu ngân sách." : evaluation.budget === "outside" ? "Khoảng phí tham khảo nằm ngoài ngân sách." : "Mức phí tham khảo chưa phải báo giá cam kết cho dự án."}</Typography>
        {/* Matched & Relevant Skills (FR-017) */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {talent.skills.slice(0, 4).map((skill) => {
              const isOverlap = evaluation.skillOverlap
                .map(canonicalSkill)
                .includes(canonicalSkill(skill));
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
          <Box sx={{ mb: 2, pt: 1, borderTop: "1px dashed #f0f0f0" }}>
            <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, display: "block", mb: 0.8 }}>
              Portfolio
            </Typography>
            <TalentPortfolioPreview talentId={talent.id} talentName={talent.name} />
          </Box>
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
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button size="small" startIcon={<Sparkles size={14} />} onClick={() => onOpenAIAnalysis(talent)} sx={{ minHeight: 38, color: "text.secondary" }}>Độ phù hợp</Button>
          <Button size="small" component={Link} to={`/business/talent/${talent.id}?project=${brief.id}`} sx={{ minHeight: 38, color: "text.primary", bgcolor: "background.default", px: 1.5 }}>
            Hồ sơ
          </Button>
        </Box>

        <Tooltip title={isInvited ? "Đã gửi lời mời cho ứng viên này" : brief.status !== "published" ? "Dự án đã ngừng tuyển dụng" : ""}><span><Button
          variant="contained"
          size="small"
          disabled={isInvited || brief.status !== "published"}
          onClick={() => onOpenInvite(talent)}
          endIcon={!isInvited ? <ArrowRight size={14} /> : undefined}
          sx={{ minHeight: 38, px: 2 }}
        >
          {isInvited ? "Đã gửi lời mời" : "Mời dự án"}
        </Button></span></Tooltip>
      </Box>
    </Card>
  );
}
