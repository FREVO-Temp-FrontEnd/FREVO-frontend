import { useCallback, useEffect, useState } from "react";
import { useAuthSession } from "@/lib/hooks/useAuthSession";
import { usePortfolio } from "@/lib/hooks/usePortfolio";
import { applicationsApi } from "@/lib/api/applicationsApi";
import type { ApplicantIdentity, ApplicationMaterials } from "@/lib/types/application.types";

interface MaterialsState extends ApplicationMaterials {
  ownerId: string;
  identity: ApplicantIdentity;
  loading: boolean;
  error: string;
}

export function useApplicationMaterials(applicantType: ApplicantIdentity, enabled: boolean) {
  const { user } = useAuthSession();
  const { works: personalWorks } = usePortfolio();
  const [library, setLibrary] = useState<MaterialsState>({ ownerId: "", identity: "individual", resumes: [], portfolioWorks: [], loading: true, error: "" });
  const isCurrent = library.ownerId === user?.id && library.identity === applicantType;
  const works = isCurrent ? library.portfolioWorks : [];
  const resumes = isCurrent ? library.resumes : [];
  const [selections, setSelections] = useState<Record<ApplicantIdentity, string[]>>({ individual: [], team: [] });
  const selectedWorkIds = selections[applicantType].filter(id => works.some(work => work.id === id));
  const [resumeId, setResumeId] = useState("");
  const [attempt, setAttempt] = useState(0);
  const reload = useCallback(() => setAttempt(value => value + 1), []);

  useEffect(() => {
    if (!enabled || !user?.id) return;
    const controller = new AbortController();
    const ownerId = user.id;
    setLibrary({ ownerId, identity: applicantType, resumes: [], portfolioWorks: [], loading: true, error: "" });
    void applicationsApi.getMaterials(ownerId, applicantType, personalWorks, controller.signal)
      .then(materials => {
        if (!controller.signal.aborted) setLibrary({ ...materials, ownerId, identity: applicantType, loading: false, error: "" });
      })
      .catch(() => {
        if (!controller.signal.aborted) setLibrary({ ownerId, identity: applicantType, resumes: [], portfolioWorks: [], loading: false, error: "Không tải được CV và portfolio. Vui lòng thử lại trước khi gửi." });
      });
    return () => controller.abort();
  }, [enabled, user?.id, applicantType, personalWorks, attempt]);

  const toggleWork = (id: string) => setSelections(previous => ({ ...previous, [applicantType]: previous[applicantType].includes(id) ? previous[applicantType].filter(item => item !== id) : [...previous[applicantType], id] }));
  return { works, selectedWorkIds, toggleWork, resumeId, setResumeId, resumes, primaryResume: resumes.find(resume => resume.isPrimary), loading: enabled && (!isCurrent || library.loading), error: isCurrent ? library.error : "", reload };
}
