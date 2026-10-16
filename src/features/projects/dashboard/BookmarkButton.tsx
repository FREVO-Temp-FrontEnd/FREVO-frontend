import type { Project } from "@/lib/types/project.types";

interface BookmarkButtonProps {
  project: Project;
  saved: boolean;
  onToggle: (id: string) => void;
}

export function BookmarkButton({ project, saved, onToggle }: BookmarkButtonProps) {
  return (
    <button
      className="bookmark grid place-items-center"
      type="button"
      role="checkbox"
      aria-checked={saved}
      aria-label={`${saved ? "Bỏ lưu" : "Lưu"} ${project.title}`}
      onClick={() => onToggle(project.id)}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 3.5h12v17l-6-4-6 4z" />
      </svg>
    </button>
  );
}
