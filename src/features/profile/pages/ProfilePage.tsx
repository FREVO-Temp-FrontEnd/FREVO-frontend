import { Link, useSearchParams } from "react-router";
import { CVTab } from "../components/CVTab";
import { usePortfolio } from "@/lib/hooks/usePortfolio";
import { useFreelancer } from "@/lib/hooks/useFreelancer";
import { useAuthSession } from "@/lib/hooks/useAuthSession";
import { FreelancerProfile } from "../components/FreelancerProfile";
import { Box, Button, Typography } from "@mui/material";

export default function ProfilePage() {
  const { currentTalent } = useFreelancer();
  const { works } = usePortfolio();
  const { isAuthenticated, role, user } = useAuthSession();
  const [params] = useSearchParams();
  if (params.get("tab") === "cv" && isAuthenticated && role === "freelancer") return <Box sx={{ maxWidth: 1440, mx: "auto", p: { xs: 2, md: 4 } }}><Button component={Link} to="/profile" sx={{ mb: 2 }}>Về hồ sơ</Button><CVTab ownerId={user?.id} seedDemoResumes /></Box>;
  if (!currentTalent) return <Box sx={{ p: 4 }}><Typography>Không tìm thấy hồ sơ.</Typography></Box>;
  return <FreelancerProfile key={currentTalent.id} talent={currentTalent} works={works} owner={isAuthenticated && role === "freelancer"}
    />;
}
