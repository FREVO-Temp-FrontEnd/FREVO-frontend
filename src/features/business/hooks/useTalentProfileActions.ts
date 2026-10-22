import { useParams, useSearchParams } from "react-router";
import { useBusiness } from "@/lib/hooks/useBusiness";

export function useTalentProfileActions() {
  const { talentId } = useParams();
  const [params] = useSearchParams();
  const business = useBusiness();
  const project = business.projects.find(item => item.id === params.get("project"));
  const talent = business.talents.find(item => item.id === talentId);
  const candidate = business.candidates.find(item => item.projectId === project?.id && item.talentId === talentId);
  const invited = business.invitations.some(item => item.projectId === project?.id && item.talentId === talentId && (item.status === "accepted" || (item.status === "pending" && new Date(item.expiresAt).getTime() > Date.now())));
  return { ...business, project, talent, candidate, invited };
}
