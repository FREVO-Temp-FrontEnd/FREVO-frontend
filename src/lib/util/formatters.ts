import type { Project } from "@/lib/types/project.types";

export function normalized(value: string): string {
  return value
    .toLocaleLowerCase("vi")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d");
}

export function deadlineTime(value: string): number {
  const [day, month, year] = value.split("/").map(Number);
  return new Date(year, month - 1, day).getTime();
}

export function formatBudget(project: Project): string {
  return `${project.min} tr–${project.max} tr`;
}
