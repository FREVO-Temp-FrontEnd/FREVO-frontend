import { useState } from "react";
import type { Milestone } from "@/lib/types/marketplace.types";
import { milestoneCriteria } from "../utils/workspace";

export function useMilestoneReview(milestone: Milestone, initialDecision: "approve" | "revision") {
  const [decision, setDecisionState] = useState(initialDecision);
  const [reason, setReason] = useState("");
  const [selectedCriteria, setSelectedCriteria] = useState<string[]>([]);
  const [reviewedCriteria, setReviewedCriteria] = useState<string[]>([]);
  const [error, setError] = useState("");
  const criteria = milestoneCriteria(milestone);
  const used = milestone.revisionAllowance?.used ?? 0;
  const allowed = milestone.revisionAllowance?.allowed ?? 2;
  const exhausted = typeof allowed === "number" && used >= allowed;
  function setDecision(value: "approve" | "revision") {
    setDecisionState(value);
    setError("");
  }
  function toggleCriterion(id: string) {
    setSelectedCriteria(previous => previous.includes(id) ? previous.filter(item => item !== id) : [...previous, id]);
    setError("");
  }
  function toggleReviewed(id: string) {
    setReviewedCriteria(previous => previous.includes(id) ? previous.filter(item => item !== id) : [...previous, id]);
  }
  function revisionReason() {
    if (exhausted) { setError("Đã dùng hết lượt chỉnh sửa. Hai bên cần thống nhất đề xuất điều chỉnh trước."); return null; }
    if (!selectedCriteria.length) { setError("Vui lòng chọn ít nhất một tiêu chí chưa đạt."); return null; }
    if (!reason.trim()) { setError("Vui lòng mô tả cụ thể phần cần chỉnh sửa."); return null; }
    return `Tiêu chí chưa đạt: ${criteria.filter(item => selectedCriteria.includes(item.id)).map(item => item.title).join("; ")}\nGóp ý: ${reason.trim()}`;
  }
  return {
    decision,
    setDecision,
    reason,
    setReason,
    selectedCriteria,
    toggleCriterion,
    error,
    criteria,
    used,
    allowed,
    exhausted,
    revisionReason,
    reviewedCriteria,
    toggleReviewed
  };
}
