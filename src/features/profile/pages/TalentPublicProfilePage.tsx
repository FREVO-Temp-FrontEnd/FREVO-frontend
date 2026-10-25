import { Link, useParams } from "react-router";
import type { ReactNode } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useTalentPortfolio } from "@/lib/hooks/useTalentPortfolio";
import { FreelancerProfile } from "../components/FreelancerProfile";

export default function TalentPublicProfilePage({ actions }: { actions?: ReactNode }) {
  const { talentId = "" } = useParams();
  const { talent, works } = useTalentPortfolio(talentId);
  if (!talent) return <Box sx={{ py: 6 }}><Typography component="h1" variant="h4">Không tìm thấy hồ sơ</Typography><Button component={Link} to="/business/projects">Về dự án của tôi</Button></Box>;
  return <FreelancerProfile key={talent.id} talent={talent} works={works} actions={actions} />;
}
