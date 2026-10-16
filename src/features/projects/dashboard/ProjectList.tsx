import type { Project } from "@/lib/types/project.types";
import { ProjectCard } from "./ProjectCard";

interface ProjectListProps {
  projects: Project[];
  selectedId?: string;
  savedIds: Set<string>;
  appliedIds: Set<string>;
  onSelect: (id: string) => void;
  onSave: (id: string) => void;
}

export function ProjectList({
  projects,
  selectedId,
  savedIds,
  appliedIds,
  onSelect,
  onSave,
}: ProjectListProps) {
  return (
    <div className="project-list grid" aria-label="Dự án đang mở">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          selected={selectedId === project.id}
          saved={savedIds.has(project.id)}
          applied={appliedIds.has(project.id)}
          onSelect={onSelect}
          onSave={onSave}
        />
      ))}
    </div>
  );
}
