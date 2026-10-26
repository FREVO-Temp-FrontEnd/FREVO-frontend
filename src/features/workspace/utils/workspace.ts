import type { Milestone } from "@/lib/types/marketplace.types";

export function workspaceDate(value?: string) {
  if (!value) return "Chưa cập nhật";
  const date = parseWorkspaceDate(value);
  return date ? date.toLocaleDateString("vi-VN") : value;
}

export function parseWorkspaceDate(value: string) {
  const parts = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  const date = parts ? new Date(Number(parts[3]), Number(parts[2]) - 1, Number(parts[1]), 23, 59, 59) : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function milestoneTitle(name: string) {
  return name.replace(/^Mốc\s*\d+\s*[·:–-]\s*/i, "");
}

export function milestoneMoney(milestone: Milestone) {
  return milestone.amountValue != null ? `${milestone.amountValue.toLocaleString("vi-VN")} đ` : milestone.amount;
}

export function milestoneCriteria(milestone: Milestone) {
  return milestone.acceptanceCriteria?.length ? milestone.acceptanceCriteria : [
    { id: "agreed-deliverable", title: "Sản phẩm bàn giao theo thỏa thuận", description: milestone.deliverable },
  ];
}

export const milestoneStatuses = {
  upcoming: { label: "Sắp tới", color: "#747773", background: "#f0f1ee" },
  in_progress: { label: "Đang thực hiện", color: "#176c9a", background: "#eef6fa" },
  submitted: { label: "Chờ nghiệm thu", color: "#bd3d14", background: "#fff0e9" },
  completed: { label: "Đã nghiệm thu", color: "#16805b", background: "#e8f7ef" },
} as const;
