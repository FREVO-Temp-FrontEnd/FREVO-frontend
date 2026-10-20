import type { Project } from "@/lib/types/project.types";
import { Bookmark } from "lucide-react";

interface BookmarkButtonProps {
  project: Project;
  saved: boolean;
  onToggle: (id: string) => void;
}

export function BookmarkButton({ project, saved, onToggle }: BookmarkButtonProps) {
  return (
    <button
      className="bookmark"
      type="button"
      aria-pressed={saved}
      aria-label={`${saved ? "Bỏ lưu" : "Lưu"} ${project.title}`}
      onClick={(e) => {
        e.stopPropagation();
        onToggle(project.id);
      }}
    >
      <Bookmark aria-hidden="true" size={19} strokeWidth={1.9} fill={saved ? "currentColor" : "none"} />
    </button>
  );
}
