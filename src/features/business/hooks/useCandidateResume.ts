import { useEffect, useState } from "react";
import { useBusiness } from "@/lib/hooks/useBusiness";
import { applicationsApi } from "@/lib/api/applicationsApi";
import type { Candidate, ProjectBrief, TalentProfile } from "@/lib/types/marketplace.types";

export function useCandidateResume(candidate: Candidate, talent: TalentProfile, project: ProjectBrief, enabled: boolean) {
  const { candidates } = useBusiness();
  const record = candidates.find(item => item.id === candidate.id && item.projectId === project.id && item.talentId === talent.id);
  const canView = enabled && !!record && applicationsApi.canViewResume(record, project);
  const selected = canView ? record?.submission?.resume : undefined;
  const resourceKey = selected ? selected.fileId : "";
  const [attempt, setAttempt] = useState(0);
  const [document, setDocument] = useState({ key: "", url: "", loading: false, error: "" });

  useEffect(() => {
    if (!canView || !selected) return;
    const controller = new AbortController();
    let objectUrl = "";
    setDocument({ key: resourceKey, url: "", loading: true, error: "" });
    void (async () => {
      try {
        const blob = await applicationsApi.getSubmittedResumeContent(record!, project, controller.signal);
        if (controller.signal.aborted) return;
        objectUrl = URL.createObjectURL(new Blob([blob], { type: selected.mimeType || blob.type }));
        setDocument({ key: resourceKey, url: objectUrl, loading: false, error: "" });
      } catch {
        if (!controller.signal.aborted) setDocument({ key: resourceKey, url: "", loading: false, error: "Không tải được CV đã gửi. Vui lòng thử lại." });
      }
    })();
    return () => {
      controller.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [canView, selected, resourceKey, record, project, attempt]);

  const currentDocument = document.key === resourceKey ? document : { key: resourceKey, url: "", loading: !!selected, error: "" };
  return { canView, selected, document: currentDocument, retry: () => setAttempt(value => value + 1) };
}
