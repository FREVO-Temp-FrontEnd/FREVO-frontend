import { Avatar, Box, Button, Chip, Paper, Typography } from "@mui/material";
import { ArrowUpRight, BellDot, CalendarDays, Clock3, Package2, UserRound, Wallet } from "lucide-react";
import { Link } from "react-router";
import { formatMoneyText } from "@/lib/utils/money";
import type { TalentProfile } from "@/lib/types/marketplace.types";
import type { OngoingProjectItem } from "../hooks/useOngoingProjects";

interface OngoingProjectCardProps {
  item: OngoingProjectItem;
}

function PerformerAvatar({ talent }: { talent?: TalentProfile }) {
  if (!talent) return <Avatar sx={{ width: 34, height: 34, bgcolor: "#f0f1ed", color: "text.secondary" }}><UserRound size={17} /></Avatar>;
  if (talent.kind === "Cá nhân") {
    return <Avatar src={talent.avatar} alt={talent.name} sx={{ width: 36, height: 36, bgcolor: talent.color, color: "text.primary", fontSize: 11, fontWeight: 700 }}>{talent.initials}</Avatar>;
  }

  const count = Math.max(1, talent.teamMembersCount ?? 1);
  return <Box aria-label={`${talent.name}, ${count} thành viên`} className="flex items-center pl-1">
    {Array.from({ length: Math.min(count, 3) }, (_, index) => <Avatar
      key={index}
      alt={index === 0 ? talent.name : `Thành viên ${index + 1} của ${talent.name}`}
      src={index === 0 ? talent.avatar : undefined}
      sx={{ width: 34, height: 34, ml: "-5px", border: "2px solid white", bgcolor: [talent.color, "#e3d6cb", "#dce5dc"][index], color: "#554e49", fontSize: 10, fontWeight: 700, zIndex: 3 - index }}
    >{index === 0 ? talent.initials : <UserRound size={16} />}</Avatar>)}
    {count > 3 && <Avatar sx={{ width: 34, height: 34, ml: "-5px", border: "2px solid white", bgcolor: "#f0f1ed", color: "text.primary", fontSize: 10, fontWeight: 700 }}>+{count - 3}</Avatar>}
  </Box>;
}

export function OngoingProjectCard({ item }: OngoingProjectCardProps) {
  const { project, talent, agreement, needsReview, update, updateDate } = item;
  const progressPath = `/business/ongoing/${project.id}/progress`;
  const budget = formatMoneyText(agreement?.budget ?? project.budget);
  const budgetText = budget === (agreement?.budget ?? project.budget) && budget.includes("triệu") ? budget : `${budget} đ`;
  return <Paper component="article" elevation={0} sx={{ overflow: "hidden", border: "1px solid", borderColor: needsReview ? "#f2c4b0" : "divider", borderRadius: "16px", bgcolor: "background.paper" }}>
    <Box className="grid gap-5" sx={{ p: { xs: 2.25, md: 3 }, gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) 175px 160px" }, alignItems: "center" }}>
      <Box className="flex min-w-0 items-start gap-4">
        <Avatar variant="rounded" src={project.heroImage} alt={project.title} sx={{ width: { xs: 74, sm: 92 }, height: { xs: 74, sm: 92 }, flexShrink: 0, borderRadius: "12px", bgcolor: "#e8dfd2", color: "primary.dark" }}><Package2 size={31} /></Avatar>
        <Box sx={{ minWidth: 0 }}>
          <Box className="mb-2 flex flex-wrap items-center gap-2">
            <Typography sx={{ fontSize: 11, color: "text.secondary" }}>{project.category}</Typography>
            <Chip size="small" label={needsReview ? "Cần bạn phản hồi" : "Đang thực hiện"} sx={{ height: 24, fontSize: 10, fontWeight: 700, bgcolor: needsReview ? "#fff0e9" : "#e8f7ef", color: needsReview ? "primary.dark" : "#16805b" }} />
          </Box>
          <Typography component="h2" sx={{ fontFamily: "h2.fontFamily", fontWeight: 800, fontSize: { xs: 17, sm: 19 }, lineHeight: 1.35, "& a:hover": { color: "primary.dark" } }}>
            <Link to={progressPath}>{project.title}</Link>
          </Typography>
          <Box className="mt-3 flex items-center gap-2.5">
            <PerformerAvatar talent={talent} />
            <Box sx={{ minWidth: 0 }}><Typography sx={{ fontSize: 12, fontWeight: 700, lineHeight: 1.3 }}>{talent?.name ?? "Chưa có thông tin người thực hiện"}</Typography><Typography sx={{ color: "text.secondary", fontSize: 10, mt: 0.35 }}>{talent?.kind === "Team" ? `Nhóm sáng tạo · ${talent.teamMembersCount ?? 1} thành viên` : talent?.role ?? "Đối tác thực hiện"}</Typography></Box>
          </Box>
        </Box>
      </Box>
      <Box className="grid gap-3" sx={{ gridTemplateColumns: { xs: "1fr 1fr", md: "1fr" }, pl: { xs: 0, md: 2 }, borderLeft: { md: "1px solid" }, borderColor: { md: "divider" } }}>
        <Box><Typography className="flex items-center gap-1.5" sx={{ fontSize: 10, color: "text.secondary" }}><Wallet size={13} />Ngân sách</Typography><Typography sx={{ mt: .5, fontSize: 14, fontWeight: 800, color: "primary.dark" }}>{budgetText}</Typography></Box>
        <Box><Typography className="flex items-center gap-1.5" sx={{ fontSize: 10, color: "text.secondary" }}><CalendarDays size={13} />Hạn hoàn thành</Typography><Typography sx={{ mt: .5, fontSize: 12, fontWeight: 700 }}>{agreement?.deadline ?? project.deadline}</Typography></Box>
      </Box>
      <Box sx={{ flexShrink: 0 }}>
        <Button
          component={Link}
          to={progressPath}
          variant="contained"
          endIcon={<ArrowUpRight size={15} />}
          sx={{
            minHeight: 40,
            borderRadius: 999,
            px: 2.5,
            bgcolor: "primary.dark",
            color: "#ffffff !important",
            "&&": { color: "#ffffff !important" },
            "& *": { color: "#ffffff !important" },
            "&:hover": { bgcolor: "primary.main", color: "#ffffff !important" },
            fontSize: 12,
            fontWeight: 700,
            whiteSpace: "nowrap",
          }}
        >
          Xem dự án
        </Button>
      </Box>
    </Box>
    <Box className="flex flex-wrap items-start gap-2" sx={{ mx: { xs: 2.25, md: 3 }, mb: { xs: 2.25, md: 3 }, px: 1.75, py: 1.4, borderRadius: "10px", bgcolor: needsReview ? "#fff0e9" : "#f4f5f2", color: needsReview ? "primary.dark" : "text.secondary" }}>
      {needsReview ? <BellDot size={16} className="mt-0.5 shrink-0" /> : <Clock3 size={16} className="mt-0.5 shrink-0" />}
      <Typography sx={{ flex: 1, minWidth: 180, fontSize: 11, fontWeight: 600, lineHeight: 1.7 }}>{update}</Typography>
      {updateDate && <Typography sx={{ fontSize: 10, color: "text.secondary", whiteSpace: "nowrap", ml: "auto" }}>Cập nhật {updateDate.includes("T") ? new Date(updateDate).toLocaleDateString("vi-VN") : updateDate}</Typography>}
    </Box>
  </Paper>;
}
