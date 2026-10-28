import { useEffect, useMemo, useRef, useState } from "react";
import { isDemoMode, projectsApi } from "@/lib/api/projectsApi";
import { mockStorage } from "@/lib/storage/mockStorage";
import { mergeProjectsWithStorage } from "@/lib/utils/projectAdapter";
import type { Project, SortMode } from "@/lib/types/project.types";
import { normalized, deadlineTime } from "@/lib/utils/formatters";
import { moneyDigits } from "@/lib/utils/money";
import { usePortfolio } from "@/lib/hooks/usePortfolio";
import { applicationsApi } from "@/lib/api/applicationsApi";
import type { SubmitApplicationRequest } from "@/lib/types/application.types";
import { validateResumeFile } from "@/lib/utils/validateResumeFile";

const SAVED_PROJECTS_KEY = "frevo-saved-projects";

function loadSavedProjectIds(): Set<string> {
  try {
    const stored = sessionStorage.getItem(SAVED_PROJECTS_KEY);
    if (stored) return new Set(JSON.parse(stored) as string[]);
  } catch {
    // Keep bookmarks available in memory if browser storage is unavailable.
  }
  return new Set(["spa"]);
}

function appliedProjectIds() {
  const talentId = mockStorage.getApplicantTalentId();
  const accountId = mockStorage.getActiveUser().id;
  return new Set(
    mockStorage.getCandidates()
      .filter((candidate) => (candidate.applicantAccountId === accountId || candidate.talentId === talentId) && candidate.source.includes("Ứng tuyển"))
      .map((candidate) => candidate.projectId)
  );
}

export function useProjects() {
  const { works: personalWorks } = usePortfolio();
  const [projects, setProjects] = useState<Project[]>(() =>
    mergeProjectsWithStorage([], mockStorage.getProjects())
  );
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minimumBudget, setMinimumBudget] = useState(0);
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [saved, setSaved] = useState(loadSavedProjectIds);
  const [applied, setApplied] = useState(appliedProjectIds);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let active = true;
    projectsApi.getProjects()
      .then((data) => {
        if (active) {
          const merged = mergeProjectsWithStorage(data, mockStorage.getProjects());
          setProjects(merged);
          setLoadError(false);
        }
      })
      .catch(() => {
        if (active) {
          // If network / API fails, use mockStorage projects as fallback
          const fallback = mergeProjectsWithStorage([], mockStorage.getProjects());
          if (fallback.length > 0) {
            setProjects(fallback);
            setLoadError(false);
          } else {
            setLoadError(true);
          }
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    // Reactive subscription to cross-role project creations/publications
    const unsub = mockStorage.subscribe(() => {
      setProjects((prev) => mergeProjectsWithStorage(prev, mockStorage.getProjects()));
      setApplied(appliedProjectIds());
    });

    return () => {
      active = false;
      unsub();
    };
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const visible = useMemo(() => {
    const term = normalized(query.trim());
    return projects
      .filter(
        (project) =>
          (selectedCategories.length === 0 ||
            selectedCategories.includes(project.category)) &&
          project.min >= minimumBudget &&
          (!term ||
            normalized(
              [
                project.title,
                project.company,
                project.city,
                project.category,
                ...project.skills,
              ].join(" ")
            ).includes(term))
      )
      .sort((a, b) =>
        sortMode === "budget"
          ? b.max - a.max
          : sortMode === "deadline"
          ? deadlineTime(a.deadline) - deadlineTime(b.deadline)
          : a.age - b.age
      );
  }, [projects, query, selectedCategories, minimumBudget, sortMode]);

  const hasFilters =
    selectedCategories.length > 0 || minimumBudget > 0;

  function toggleCategory(category: string) {
    setSelectedCategories((previous) =>
      previous.includes(category)
        ? previous.filter((item) => item !== category)
        : [...previous, category]
    );
  }

  function clearFilters() {
    setSelectedCategories([]);
    setMinimumBudget(0);
  }

  function toggleSaved(id: string) {
    setSaved((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        sessionStorage.setItem(SAVED_PROJECTS_KEY, JSON.stringify([...next]));
      } catch {
        // The current page still reflects the user's choice.
      }
      return next;
    });
  }

  function openApplication(id: string) {
    setApplyingId(id);
    setSubmitError("");
  }

  function closeApplication() {
    setApplyingId(null);
  }

  async function submitApplication(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!applyingId || !event.currentTarget.reportValidity()) return;
    const reapplying = applied.has(applyingId);
    if (reapplying && !isDemoMode) {
      setSubmitError("Chưa thể ứng tuyển lại khi kết nối API: dịch vụ hiện chưa có luồng cập nhật đơn ứng tuyển.");
      return;
    }
    const formData = new FormData(event.currentTarget);
    const proposedBudget = moneyDigits(String(formData.get("proposedBudget") ?? ""));
    const deliveryEstimate = String(formData.get("deliveryEstimate") ?? "").trim();
    const identity = formData.get("applicantType") === "team" ? "team" : "individual";
    const teamId = String(formData.get("teamId") ?? "").trim();
    if (identity === "team" && !teamId) { setSubmitError("Vui lòng chọn nhóm bạn đại diện."); return; }
    const cvFile = formData.get("cvFile");
    if (!(cvFile instanceof File)) { setSubmitError("Vui lòng tải CV lên."); return; }
    const cvError = validateResumeFile(cvFile);
    if (cvError) { setSubmitError(cvError); return; }
    const request: SubmitApplicationRequest = {
      projectId: applyingId,
      applicantIdentity: identity,
      ...(identity === "team" ? { teamId } : {}),
      proposal: "",
      portfolioWorkIds: formData.getAll("portfolioWorkIds").map(String),
      portfolioUrl: "",
      resume: { mode: "upload", file: cvFile },
      proposedBudget: proposedBudget ? Number(proposedBudget) : null,
      deliveryEstimate,
    };
    setSubmitting(true);
    setSubmitError("");
    try {
      await applicationsApi.submit(request, personalWorks);
      setApplied(previous => new Set(previous).add(request.projectId));
      closeApplication();
      setToast(
        reapplying
          ? "Đã cập nhật đơn ứng tuyển của bạn. Doanh nghiệp sẽ thấy nội dung mới trong cùng hồ sơ."
          : "Ứng tuyển đã được gửi thành công. Doanh nghiệp sẽ xem xét hồ sơ của bạn (BR-002, BR-003)."
      );
      if (toastTimer.current) clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setToast(""), 4000);
      requestAnimationFrame(() =>
        document.getElementById("detail-title")?.focus({ preventScroll: true })
      );
    } catch (error: unknown) {
      setSubmitError(error instanceof Error ? error.message : "Không gửi được ứng tuyển. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  }

  return {
    projects,
    visible,
    loading,
    loadError,
    query,
    setQuery,
    selectedCategories,
    toggleCategory,
    minimumBudget,
    setMinimumBudget,
    sortMode,
    setSortMode,
    hasFilters,
    clearFilters,
    saved,
    applied,
    toggleSaved,
    filtersOpen,
    setFiltersOpen,
    applyingId,
    openApplication,
    closeApplication,
    submitting,
    submitError,
    submitApplication,
    toast,
  };
}
