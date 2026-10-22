import { useMemo, useState } from "react";
import type { Candidate, ProjectBrief, ProjectStatus, TalentProfile } from "@/lib/types/marketplace.types";

export type ProjectFilter = "all" | ProjectStatus;
export type ProjectSort = "newest" | "deadline" | "budget" | "applicants";

function dateValue(value?: string) {
  if (!value) return Number.POSITIVE_INFINITY;
  const [day, month, year] = value.split("/").map(Number);
  return day && month && year ? new Date(year, month - 1, day).getTime() : Number.POSITIVE_INFINITY;
}

export function useProjectList(projects: ProjectBrief[], candidates: Candidate[], talents: TalentProfile[]) {
  const [filter, setFilter] = useState<ProjectFilter>("published");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<ProjectSort>("newest");

  const counts = useMemo(() => {
    const result: Record<ProjectFilter, number> = {
      all: projects.length,
      draft: 0,
      published: 0,
      ongoing: 0,
      closed: 0,
      completed: 0,
    };
    projects.forEach((project) => { result[project.status] += 1; });
    return result;
  }, [projects]);

  const candidateCounts = useMemo(() => {
    const result = new Map<string, number>();
    candidates.forEach((candidate) => {
      result.set(candidate.projectId, (result.get(candidate.projectId) ?? 0) + 1);
    });
    return result;
  }, [candidates]);

  const pendingCounts = useMemo(() => {
    const result = new Map<string, number>();
    candidates.forEach((candidate) => {
      if ((candidate.status === "new" || candidate.status === "under_review") && !candidate.chatUnlocked) {
        result.set(candidate.projectId, (result.get(candidate.projectId) ?? 0) + 1);
      }
    });
    return result;
  }, [candidates]);

  const executorNames = useMemo(() => {
    const talentNames = new Map(talents.map(talent => [talent.id, talent.name]));
    const selectedIds = new Map(candidates.filter(candidate => candidate.status === "selected").map(candidate => [candidate.projectId, candidate.talentId]));
    return new Map(projects.map(project => [project.id, talentNames.get(project.selectedTalentId || selectedIds.get(project.id) || "")]));
  }, [projects, candidates, talents]);

  const visibleProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("vi");
    return projects
      .filter((project) =>
        (filter === "all" || project.status === filter) &&
        `${project.title} ${project.category}`.toLocaleLowerCase("vi").includes(normalizedQuery)
      )
      .sort((a, b) => {
        if (sort === "deadline") return dateValue(a.status === "published" ? a.applicationDeadline || a.deadline : a.deadline) - dateValue(b.status === "published" ? b.applicationDeadline || b.deadline : b.deadline);
        if (sort === "budget") return (b.budgetMax ?? b.budgetMin ?? 0) - (a.budgetMax ?? a.budgetMin ?? 0);
        if (sort === "applicants") return (candidateCounts.get(b.id) ?? 0) - (candidateCounts.get(a.id) ?? 0);
        return Date.parse(b.publishedAt || b.createdAt) - Date.parse(a.publishedAt || a.createdAt);
      });
  }, [projects, filter, query, sort, candidateCounts]);

  return { filter, setFilter, query, setQuery, sort, setSort, counts, candidateCounts, pendingCounts, executorNames, visibleProjects };
}
