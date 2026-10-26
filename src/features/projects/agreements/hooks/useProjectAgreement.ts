import { useState } from "react";
import { useLocation, useParams, useSearchParams } from "react-router";
import { useAuthSession } from "@/lib/hooks/useAuthSession";
import { useBusiness } from "@/lib/hooks/useBusiness";
import { mockStorage } from "@/lib/storage/mockStorage";
import type { AgreementProposal } from "@/lib/types/marketplace.types";

type ProposalData = Pick<AgreementProposal, "scope" | "deliverables" | "deadline" | "budget" | "budgetValue" | "reference" | "milestones">;

export function useProjectAgreement() {
  const params = useParams();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const parts = location.pathname.split("/").filter(Boolean);
  const projectId = params.projectId ?? (parts[0] === "business" ? parts[2] : parts[1]);
  const { role, user } = useAuthSession();
  const { projects, candidates, talents, agreements } = useBusiness();
  const project = projects.find(item => item.id === projectId);
  const versions = agreements.filter(item => item.projectId === projectId).sort((a, b) => b.version - a.version);
  const [selectedVersion, selectVersion] = useState<number | null>(null);
  const [isDrafting, setIsDrafting] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const current = versions.find(item => item.version === selectedVersion) ?? versions[0];
  const effective = versions.find(item => item.isEffective);
  const talentId = current?.talentId ?? searchParams.get("talent") ?? candidates.find(item => item.projectId === projectId && item.status === "offer")?.talentId ?? candidates.find(item => item.projectId === projectId)?.talentId;
  const talent = talents.find(item => item.id === talentId);
  const isBusiness = role === "client" || role === "admin";
  const canAccess = !!project && (role === "admin" || (role === "client" && user?.companyName === project.company) || (role === "freelancer" && talentId === mockStorage.getApplicantTalentId()));
  const projectPath = isBusiness ? `/business/projects/${projectId}` : `/projects/${projectId}/details`;
  const progressPath = isBusiness ? `/business/projects/${projectId}/progress` : `/workspace/${projectId}`;
  const chatPath = isBusiness ? `/business/messages?view=project&scope=${projectId}` : `/projects/${projectId}/chat`;
  function select(version: number) { selectVersion(version); setIsDrafting(false); setError(""); }
  function createProposal(data: ProposalData) {
    if (!project || !talent || !canAccess || !isBusiness) return;
    try {
      mockStorage.createAgreementProposal({ ...data, projectId: project.id, talentId: talent.id });
      selectVersion(null); setIsDrafting(false); setNotice("Đã gửi phiên bản đề xuất mới để bên thực hiện xem xét.");
    } catch { setError("Chưa gửi được đề xuất. Nội dung bạn nhập vẫn được giữ lại để thử lại."); }
  }
  function respond(accept: boolean) {
    if (!canAccess || isBusiness || !current?.id || current.id !== versions[0]?.id || current.status !== "pending" || Date.parse(current.expiresAt) <= Date.now()) return;
    try { mockStorage.respondToAgreement(current.id, accept); setNotice(accept ? "Đã xác nhận thỏa thuận hợp tác." : "Đã từ chối đề xuất. Bạn có thể tiếp tục trao đổi trong chat."); }
    catch { setError("Không ghi nhận được phản hồi. Vui lòng thử lại."); }
  }
  return { project, talent, versions, current, effective, isBusiness, canAccess, isDrafting, setIsDrafting, select, createProposal, respond, projectPath, progressPath, chatPath, notice, setNotice, error };
}
