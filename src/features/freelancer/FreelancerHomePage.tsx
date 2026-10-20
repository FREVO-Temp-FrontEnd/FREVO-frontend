import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { useProjects } from "@/lib/hooks/useProjects";
import { useAuthSession } from "@/lib/hooks/useAuthSession";
import { useFreelancer } from "@/lib/hooks/useFreelancer";
import { ProjectFilters } from "@/features/projects/dashboard/ProjectFilters";
import { FreelancerNav, type ProjectView } from "./components/FreelancerNav";
import { ProjectList } from "@/features/projects/dashboard/ProjectList";
import { ProjectDetail } from "@/features/projects/details/ProjectDetail";
import { ProjectApplyDialog } from "@/features/projects/application/ProjectApplyDialog";
import "./freelancer-home.css";

export default function FreelancerHomePage() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [searchParams] = useSearchParams();
  const { role } = useAuthSession();
  const { currentTalent } = useFreelancer();
  const selectedView = searchParams.get("view");
  const view: ProjectView = selectedView === "saved" || selectedView === "recommended" ? selectedView : "discover";
  const [navNotice, setNavNotice] = useState("");

  const {
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
    applyingId,
    openApplication,
    closeApplication,
    proposal,
    setProposal,
    portfolio,
    setPortfolio,
    submitting,
    submitError,
    submitApplication,
    toast,
  } = useProjects();

  function handleApply(id: string) {
    if (role === "guest") {
      navigate("/login", { state: { from: { pathname: `/projects/${id}` } } });
      return;
    }
    openApplication(id);
  }

  const talentSkills = new Set(currentTalent?.skills.map((skill) => skill.toLocaleLowerCase("vi").trim()) ?? []);
  const displayed = visible.filter((project) =>
    view === "discover" ||
    (view === "saved"
      ? saved.has(project.id)
      : project.skills.some((skill) => talentSkills.has(skill.toLocaleLowerCase("vi").trim())))
  );
  const selected = displayed.find((project) => project.id === (projectId ?? "coffee")) ?? displayed[0];
  const applyingProject = projects.find((project) => project.id === applyingId);

  function selectProject(id: string) {
    document.getElementById("detail-region")?.scrollTo({ top: 0 });
    navigate(`/projects/${id}${view === "discover" ? "" : `?view=${view}`}`, { preventScrollReset: true });
    if (window.matchMedia("(max-width: 720px)").matches) {
      requestAnimationFrame(() => {
        document
          .getElementById("detail-region")
          ?.scrollIntoView({
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
              .matches
              ? "instant"
              : "smooth",
            block: "start",
          });
        document
          .getElementById("detail-title")
          ?.focus({ preventScroll: true });
      });
    }
  }

  function changeView(nextView: ProjectView) {
    setNavNotice("");
    navigate(nextView === "discover" ? "/projects" : `/projects?view=${nextView}`);
  }

  return (
    <>
      <div className="page-grid grid freelancer-home">
        <FreelancerNav view={view} onViewChange={changeView} onUnavailable={(label) => setNavNotice(`${label} đang được phát triển.`)} />

        <main id="main" className="main-column min-w-0">
          <h1>{view === "saved" ? "Việc làm đã lưu" : view === "recommended" ? "Việc làm phù hợp với bạn" : "Dự án đang mở"}<span>.</span></h1>
          <p className="intro">{view === "discover" ? "Brief từ doanh nghiệp nhỏ đang tìm creative freelancer." : view === "saved" ? "Những dự án bạn muốn xem lại." : "Gợi ý theo kỹ năng trong hồ sơ của bạn, chưa sử dụng AI."}</p>
          <div className="toolbar">
            <label className="search-wrap">
              <span className="sr-only">Tìm kiếm dự án</span>
              <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm theo tên, doanh nghiệp, kỹ năng..." />
            </label>
          </div>
          <ProjectFilters
          sortMode={sortMode}
          setSortMode={setSortMode}
          selectedCategories={selectedCategories}
          toggleCategory={toggleCategory}
          minimumBudget={minimumBudget}
          setMinimumBudget={setMinimumBudget}
          hasFilters={hasFilters}
          clearFilters={clearFilters}
        />
          <p className="result-line" role="status" aria-live="polite">
            {loading ? (
              "Đang tải dự án..."
            ) : loadError ? (
              "Không tải được dự án."
            ) : (
              <>
                <strong>{displayed.length}</strong> dự án phù hợp
              </>
            )}
          </p>
          <ProjectList
            projects={displayed}
            selectedId={selected?.id}
            savedIds={saved}
            appliedIds={applied}
            onSelect={selectProject}
            onSave={toggleSaved}
          />
          {loadError && (
            <div className="empty-state">
              <strong>Không tải được danh sách dự án.</strong>
              <span>
                Kiểm tra kết nối hoặc cấu hình API rồi tải lại trang.
              </span>
            </div>
          )}
          {!loading && !loadError && displayed.length === 0 && (
            <div className="empty-state">
              <strong>{view === "saved" ? "Bạn chưa lưu việc làm nào." : view === "recommended" ? "Chưa có việc làm trùng kỹ năng trong hồ sơ." : "Chưa tìm thấy dự án phù hợp."}</strong>
              <span>{view === "saved" ? "Khám phá dự án và chọn biểu tượng lưu để xem lại ở đây." : view === "recommended" ? "Cập nhật kỹ năng trong hồ sơ hoặc thử một bộ lọc khác." : "Thử một từ khóa hoặc bộ lọc khác."}</span>
            </div>
          )}
        </main>

        <aside
          id="detail-region"
          className="detail-column"
          aria-label="Chi tiết dự án"
        >
          {selected ? (
            <ProjectDetail
              project={selected}
              saved={saved.has(selected.id)}
              applied={applied.has(selected.id)}
              onSave={toggleSaved}
              onApply={handleApply}
            />
          ) : !loading && !loadError ? (
            <p className="detail-empty">
              Chọn bộ lọc khác để xem chi tiết dự án.
            </p>
          ) : null}
        </aside>
      </div>

      <ProjectApplyDialog
        isOpen={applyingId !== null}
        onClose={closeApplication}
        project={applyingProject}
        reapplying={applyingId !== null && applied.has(applyingId)}
        proposal={proposal}
        setProposal={setProposal}
        portfolio={portfolio}
        setPortfolio={setPortfolio}
        submitting={submitting}
        submitError={submitError}
        onSubmit={submitApplication}
      />

      {toast && (
        <div id="toast" role="status" aria-live="polite">
          {toast}
        </div>
      )}
      {navNotice && <div id="nav-notice" role="status" onClick={() => setNavNotice("")}>{navNotice}</div>}
    </>
  );
}

