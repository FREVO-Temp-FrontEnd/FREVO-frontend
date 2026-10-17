import { useEffect } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import { FreelancerHeader } from "@/components/freelancer/FreelancerHeader";
import { ProjectApplyDialog } from "@/features/projects/application/ProjectApplyDialog";
import { isDemoMode } from "@/lib/api/projectsApi";
import { useProjects } from "@/lib/hooks/useProjects";
import { ProjectDetailContent } from "./ProjectDetailContent";
import "./project-detail-page.css";

export default function ProjectDetailPage() {
  const { projectId } = useParams();
  const {
    projects, loading, loadError, applied, saved, toggleSaved, applyingId, openApplication,
    closeApplication, proposal, setProposal, portfolio, setPortfolio,
    submitting, submitError, submitApplication, toast,
  } = useProjects();
  const project = projects.find((item) => item.id === projectId);

  useEffect(() => { window.scrollTo(0, 0); }, [projectId]);

  return (
    <>
      <a className="skip-link" href="#main">Đi đến nội dung chính</a>
      <FreelancerHeader />
      {isDemoMode && <p className="prototype-note">Prototype dùng dữ liệu minh họa — thao tác ứng tuyển không gửi dữ liệu thật.</p>}
      <main id="main" className="project-page">
        <div className="project-page-navigation">
          <nav aria-label="Đường dẫn" className="project-page-breadcrumb"><Link to="/">Khám phá dự án</Link><span aria-hidden="true">/</span><span>{project?.category ?? "Dự án"}</span><span aria-hidden="true">/</span><span aria-current="page">Chi tiết dự án</span></nav>
          <Link className="project-page-back" to={project ? `/projects/${encodeURIComponent(project.id)}` : "/"}><ArrowLeft size={18} aria-hidden="true" /> Quay lại danh sách</Link>
        </div>
        {loading ? (
          <div className="project-page-state" role="status">Đang tải chi tiết dự án...</div>
        ) : loadError ? (
          <div className="project-page-state" role="alert"><h1>Không tải được dự án</h1><p>Kiểm tra kết nối hoặc cấu hình API rồi tải lại trang.</p><button className="secondary-button" type="button" onClick={() => window.location.reload()}>Thử lại</button></div>
        ) : !project ? (
          <div className="project-page-state"><h1>Không tìm thấy dự án</h1><p>Bài đăng này không có trong danh sách hiện tại.</p><Link className="secondary-button" to="/">Về danh sách dự án</Link></div>
        ) : (
          <ProjectDetailContent key={project.id} project={project} projects={projects} applied={applied.has(project.id)} saved={saved.has(project.id)} onSave={toggleSaved} onApply={openApplication} />
        )}
      </main>
      <ProjectApplyDialog
        isOpen={applyingId !== null} onClose={closeApplication}
        project={project} proposal={proposal} setProposal={setProposal}
        portfolio={portfolio} setPortfolio={setPortfolio}
        submitting={submitting} submitError={submitError} onSubmit={submitApplication}
      />
      {toast && <div id="toast" role="status" aria-live="polite">{toast}</div>}
    </>
  );
}
