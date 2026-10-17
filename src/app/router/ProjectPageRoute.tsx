import { useParams } from "react-router";
import FreelancerHomePage from "@/features/freelancer/FreelancerHomePage";
import ProjectDashboard from "@/features/projects/dashboard/ProjectDashboard";

export default function ProjectPageRoute() {
  const { projectId } = useParams();
  return projectId === "interior" ? <ProjectDashboard /> : <FreelancerHomePage />;
}
