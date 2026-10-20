import { useState } from "react";
import type { Project } from "@/lib/types/project.types";

const PAGE_SIZE = 10;

export function useProjectPagination(projects: Project[], filterKey: string, selectedId?: string) {
  const selectedIndex = projects.findIndex((project) => project.id === selectedId);
  const [pagination, setPagination] = useState(() => ({
    filterKey,
    page: selectedIndex >= 0 ? Math.floor(selectedIndex / PAGE_SIZE) + 1 : 1,
  }));
  // Reset together with the changed filters, before rendering the new results.
  if (pagination.filterKey !== filterKey) setPagination({ filterKey, page: 1 });
  const pageCount = Math.max(1, Math.ceil(projects.length / PAGE_SIZE));
  const page = pagination.filterKey === filterKey ? Math.min(pagination.page, pageCount) : 1;
  const start = (page - 1) * PAGE_SIZE;

  return {
    page,
    pageCount,
    pageProjects: projects.slice(start, start + PAGE_SIZE),
    firstResult: projects.length ? start + 1 : 0,
    lastResult: Math.min(start + PAGE_SIZE, projects.length),
    changePage: (nextPage: number) => setPagination({ filterKey, page: Math.max(1, Math.min(nextPage, pageCount)) }),
  };
}
