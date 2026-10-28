import { Link, useNavigate, useParams } from "react-router";
import { isDemoMode } from "@/lib/api/projectsApi";
import { useProjects } from "@/lib/hooks/useProjects";
import { ProjectFilters } from "./ProjectFilters";
import { ProjectList } from "./ProjectList";
import { ProjectDetail } from "../details/ProjectDetail";
import { ProjectApplyDialog } from "../application/ProjectApplyDialog";

export default function ProjectDashboard() {
  const navigate = useNavigate();
  const { projectId } = useParams();

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
    submitting,
    submitError,
    submitApplication,
    toast,
  } = useProjects();

  const selected =
    visible.find((project) => project.id === (projectId ?? "coffee")) ??
    visible[0];
  const applyingProject = projects.find((project) => project.id === applyingId);

  function selectProject(id: string) {
    navigate(`/projects/${id}`, { preventScrollReset: true });
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

  return (
    <>
      <a className="skip-link" href="#main">
        Đi đến nội dung chính
      </a>
      <header className="site-header flex items-center justify-between">
        <div className="header-left flex items-center">
          <Link to="/" aria-label="FREVO - Khám phá dự án">
            <img
              className="logo"
              src="/assets/frevo-logo.png"
              width={112}
              height={45}
              alt="FREVO"
            />
          </Link>
          <span className="header-divider" aria-hidden="true" />
          <span className="screen-name">Khám phá dự án</span>
        </div>
        <Link
          to="/profile"
          className="account flex items-center"
          aria-label="Tài khoản của Minh Anh"
        >
          <span className="account-copy">
            <strong>Minh Anh</strong>
            <small>Freelancer</small>
          </span>
          <span className="avatar grid place-items-center" aria-hidden="true">
            MA
          </span>
        </Link>
      </header>
      {isDemoMode && (
        <p className="prototype-note">
          Prototype dùng dữ liệu minh họa — thao tác ứng tuyển không gửi dữ liệu
          thật.
        </p>
      )}

      <div className="page-grid grid">
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

        <main id="main" className="main-column min-w-0">
          <h1>
            Dự án đang mở<span>.</span>
          </h1>
          <p className="intro">
            Brief từ doanh nghiệp nhỏ đang tìm creative freelancer.
          </p>
          <div className="toolbar">
            <label className="search-wrap">
              <span className="sr-only">Tìm kiếm dự án</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Tìm theo tên, doanh nghiệp, kỹ năng..."
              />
            </label>
          </div>
          <p className="result-line" role="status" aria-live="polite">
            {loading ? (
              "Đang tải dự án..."
            ) : loadError ? (
              "Không tải được dự án."
            ) : (
              <>
                <strong>{visible.length}</strong> dự án phù hợp
              </>
            )}
          </p>
          <ProjectList
            projects={visible}
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
          {!loading && !loadError && visible.length === 0 && (
            <div className="empty-state">
              <strong>Chưa tìm thấy dự án phù hợp.</strong>
              <span>Thử một từ khóa hoặc bộ lọc khác.</span>
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
              onApply={openApplication}
            />
          ) : !loading && !loadError ? (
            <p className="detail-empty">
              Chọn bộ lọc khác để xem chi tiết dự án.
            </p>
          ) : null}
        </aside>
      </div>

      <ProjectApplyDialog
        key={applyingId ?? "closed"}
        isOpen={applyingId !== null}
        onClose={closeApplication}
        project={applyingProject}
        reapplying={applyingId !== null && applied.has(applyingId)}
        submitting={submitting}
        submitError={submitError}
        onSubmit={submitApplication}
      />

      {toast && (
        <div id="toast" role="status" aria-live="polite">
          {toast}
        </div>
      )}
    </>
  );
}
