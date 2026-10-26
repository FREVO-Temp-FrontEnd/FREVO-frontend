import { useState } from "react";
import { useParams } from "react-router";
import { useAuthSession } from "@/lib/hooks/useAuthSession";
import { useBusiness } from "@/lib/hooks/useBusiness";
import { mockStorage } from "@/lib/storage/mockStorage";
import { parseMoneyText } from "@/lib/utils/money";
import type { Milestone } from "@/lib/types/marketplace.types";

export function usePaymentLedger() {
  const { projectId } = useParams();
  const { role, user } = useAuthSession();
  const { projects, agreements, talents, payments: allPayments } = useBusiness();
  const project = projects.find(item => item.id === projectId);
  const agreement = agreements.find(item => item.projectId === projectId && item.isEffective);
  const talent = talents.find(item => item.id === agreement?.talentId);
  const milestones = agreement?.milestones ?? [];
  const payments = allPayments.filter(item => item.projectId === projectId).sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  const [fundId, setFundId] = useState<string | null>(null);
  const [showRetryDemo, setShowRetryDemo] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const isBusiness = role === "client" || role === "admin";
  const canAccess = !!project && (role === "admin" || (role === "client" && user?.companyName === project.company) || (role === "freelancer" && agreement?.talentId === mockStorage.getApplicantTalentId()));
  const selectedMilestone = milestones.find(item => item.id === fundId);
  const milestoneRecords = milestones.map(milestone => {
    const records = payments.filter(item => item.milestoneId === milestone.id);
    const released = records.find(item => item.status === "released_simulated");
    const held = records.find(item => item.status === "held_simulated");
    return { milestone, payment: released ?? held, canFund: isBusiness && canAccess && !records.length && milestone.status !== "completed" };
  });
  const sumFor = (status: "held_simulated" | "released_simulated") => milestoneRecords.filter(item => item.payment?.status === status).reduce((sum, item) => sum + (item.milestone.amountValue ?? parseMoneyText(item.milestone.amount) ?? 0), 0);
  const heldTotal = sumFor("held_simulated");
  const releasedTotal = sumFor("released_simulated");
  const projectPath = isBusiness ? `/business/projects/${projectId}` : `/projects/${projectId}/details`;
  const progressPath = isBusiness ? `/business/projects/${projectId}/progress` : `/workspace/${projectId}`;
  const agreementPath = isBusiness ? `/business/projects/${projectId}/agreement` : `/projects/${projectId}/agreement`;
  function openFund(milestone: Milestone) { if (milestoneRecords.find(item => item.milestone.id === milestone.id)?.canFund) { setFundId(milestone.id); setError(""); } }
  function confirmFund() {
    if (!project || !selectedMilestone || !canAccess || !isBusiness) return;
    if (mockStorage.getPayments(project.id).some(item => item.milestoneId === selectedMilestone.id)) { setFundId(null); setNotice("Mốc đã có giao dịch mô phỏng, không tạo thêm giao dịch trùng."); return; }
    try { mockStorage.fundMilestone(project.id, selectedMilestone.id); setFundId(null); setNotice("Đã ghi nhận tạm giữ mô phỏng. Không có tiền thật được chuyển."); }
    catch { setError("Không ghi nhận được thao tác mô phỏng. Vui lòng thử lại."); }
  }
  return { project, agreement, talent, milestones, payments, milestoneRecords, selectedMilestone, openFund, confirmFund, closeFund: () => setFundId(null), heldTotal, releasedTotal, showRetryDemo, setShowRetryDemo, notice, setNotice, error, isBusiness, canAccess, projectPath, progressPath, agreementPath };
}
