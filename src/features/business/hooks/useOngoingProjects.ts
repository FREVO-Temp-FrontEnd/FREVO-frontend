import { useEffect, useMemo, useState } from "react";
import { useBusiness } from "@/lib/hooks/useBusiness";
import { useAuthSession } from "@/lib/hooks/useAuthSession";
import type { AgreementProposal, ProjectBrief, TalentProfile } from "@/lib/types/marketplace.types";

export type OngoingFilter = "all" | "needs_review";
export type OngoingSort = "recent" | "deadline";

export interface OngoingProjectItem {
  project: ProjectBrief;
  talent?: TalentProfile;
  agreement?: AgreementProposal;
  needsReview: boolean;
  update: string;
  updateDate?: string;
  updatedAt: number;
}

function dateValue(value?: string) {
  if (!value) return 0;
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(value)) {
    const [day, month, year] = value.split("/").map(Number);
    return new Date(year, month - 1, day).getTime();
  }
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function searchValue(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("vi");
}

export function useOngoingProjects() {
  const { projects, agreements, talents } = useBusiness();
  const { user, role } = useAuthSession();
  const [filter, setFilter] = useState<OngoingFilter>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<OngoingSort>("recent");

  const items = useMemo<OngoingProjectItem[]>(() => projects
    .filter(project => project.status === "ongoing" && (role === "admin" || project.company === user?.companyName))
    .map(project => {
      const agreement = agreements.find(item => item.projectId === project.id && item.isEffective);
      const talent = talents.find(item => item.id === (project.selectedTalentId ?? agreement?.talentId));
      const submitted = agreement?.milestones
        .filter(milestone => milestone.status === "submitted")
        .sort((a, b) => dateValue(b.submittedAt) - dateValue(a.submittedAt))[0];
      const completed = agreement?.milestones
        .filter(milestone => milestone.status === "completed")
        .sort((a, b) => dateValue(b.completedAt) - dateValue(a.completedAt))[0];
      const needsReview = !!submitted;
      const updateDate = submitted?.submittedAt ?? completed?.completedAt ?? agreement?.confirmedAt;
      const update = submitted
        ? `${talent?.name ?? "Bên thực hiện"} đã gửi bàn giao, đang chờ bạn xem xét.`
        : completed
          ? `Bàn giao gần nhất đã được nghiệm thu. Dự án tiếp tục thực hiện.`
          : agreement
            ? `Hai bên đã xác nhận thỏa thuận và bắt đầu hợp tác.`
            : `Dự án đang thực hiện. Mở không gian làm việc để xem cập nhật.`;
      return { project, talent, agreement, needsReview, update, updateDate, updatedAt: dateValue(updateDate) || dateValue(project.closedAt) || dateValue(project.publishedAt) };
    }), [projects, agreements, talents, role, user?.companyName]);

  const needsReviewCount = useMemo(() => items.filter(item => item.needsReview).length, [items]);

  useEffect(() => {
    if (filter === "needs_review" && needsReviewCount === 0) {
      setFilter("all");
    }
  }, [filter, needsReviewCount]);

  const visibleItems = useMemo(() => {
    const term = searchValue(query.trim());
    return items.filter(item => {
      if (filter === "needs_review" && !item.needsReview) return false;
      return !term || searchValue(`${item.project.title} ${item.project.category} ${item.talent?.name ?? ""}`).includes(term);
    }).sort((a, b) => sort === "deadline"
      ? (dateValue(a.project.deadline) || Infinity) - (dateValue(b.project.deadline) || Infinity)
      : b.updatedAt - a.updatedAt);
  }, [items, filter, query, sort]);

  return {
    items,
    visibleItems,
    needsReviewCount,
    filter,
    setFilter,
    query,
    setQuery,
    sort,
    setSort,
    clearFilters: () => { setFilter("all"); setQuery(""); },
  };
}
