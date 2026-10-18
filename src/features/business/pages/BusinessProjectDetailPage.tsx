import { useState } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router";
import { ArrowLeft, ArrowRight, BriefcaseBusiness, Check } from "lucide-react";
import { useBusiness } from "@/lib/hooks/useBusiness";
import { CloseProjectDialog } from "@/features/business/components/CloseProjectDialog";
import { CandidateSuggestionsTab } from "@/features/business/components/CandidateSuggestionsTab";
import { SentInvitationsTab } from "@/features/business/components/SentInvitationsTab";
import { ProjectApplicantsTab } from "@/features/business/components/ProjectApplicantsTab";
import type { ProjectBrief, ProjectStatus } from "@/lib/types/marketplace.types";

function statusLabel(status: ProjectStatus) {
  switch (status) {
    case "draft":
      return "Bản nháp";
    case "published":
      return "Đang tuyển";
    case "ongoing":
      return "Đang tiến hành";
    case "closed":
      return "Đã đóng tuyển";
    case "completed":
      return "Đã hoàn thành";
    default:
      return status;
  }
}

export function BusinessProjectDetailPage() {
  const { projectId: routeProjectId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { projects, candidates, invitations, closeProject, talents } = useBusiness();
  const [closeDialogOpen, setCloseDialogOpen] = useState(false);

  const parts = location.pathname.split("/").filter(Boolean);
  const projectId = routeProjectId || (parts[1] === "projects" ? parts[2] : undefined);
  const project: ProjectBrief | undefined = projects.find((p) => p.id === projectId);

  if (!project) {
    return (
      <div className="fb-empty">
        <BriefcaseBusiness size={32} strokeWidth={1.6} aria-hidden="true" />
        <h3>Không tìm thấy dự án</h3>
        <p>Dự án này không tồn tại hoặc đã bị xóa.</p>
        <Link className="fb-button fb-button-primary" to="/business/projects">
          Về danh sách dự án
        </Link>
      </div>
    );
  }

  const projectCandidates = candidates.filter((c) => c.projectId === project.id);
  const projectInvitations = invitations.filter((i) => i.projectId === project.id);
  const selectedCandidate = projectCandidates.find((c) => c.status === "selected");
  const selectedTalent = selectedCandidate
    ? talents.find((t) => t.id === selectedCandidate.talentId)
    : undefined;

  const currentTab = parts[3] || "";

  const tabs: { segment: string; label: string; count?: number }[] = [
    { segment: "", label: "Brief" },
  ];

  if (project.status === "ongoing") {
    tabs.push(
      { segment: "executor", label: "Người thực hiện" },
      { segment: "messages", label: "Tin nhắn" },
      { segment: "progress", label: "Tiến độ" },
      { segment: "agreement", label: "Hợp đồng" }
    );
  } else if (project.status === "published") {
    tabs.push(
      { segment: "applicants", label: "Ứng viên", count: projectCandidates.length },
      { segment: "suggestions", label: "Gợi ý" },
      { segment: "invitations", label: "Lời mời", count: projectInvitations.length },
      { segment: "messages", label: "Tin nhắn" }
    );
  } else if (project.status === "closed") {
    tabs.push(
      { segment: "applicants", label: "Ứng viên", count: projectCandidates.length },
      { segment: "messages", label: "Tin nhắn" }
    );
  }

  const badgeTone =
    project.status === "published" || project.status === "ongoing"
      ? "green"
      : project.status === "closed"
      ? "neutral"
      : "soft";

  return (
    <>
      <Link className="fb-back" to="/business/projects">
        <ArrowLeft size={16} /> Dự án của tôi
      </Link>

      <div className="fb-project-header">
        <div>
          <span className={`fb-badge fb-badge-${badgeTone}`}>{statusLabel(project.status)}</span>
          <h1>{project.title}</h1>
          <p>
            {project.category} <span>·</span> {project.budget}
          </p>
        </div>
        <span className="fb-project-monogram">
          <BriefcaseBusiness size={28} strokeWidth={1.6} />
        </span>
      </div>

      <nav className="fb-tabs" aria-label="Các mục của dự án">
        {tabs.map((tab) => (
          <Link
            key={tab.segment}
            to={tab.segment ? `/business/projects/${project.id}/${tab.segment}` : `/business/projects/${project.id}`}
            aria-current={currentTab === tab.segment ? "page" : undefined}
          >
            {tab.label}
            {tab.count !== undefined && <span>{tab.count}</span>}
          </Link>
        ))}
      </nav>

      {/* Tab Switcher: Suggestions (BUS-007) / Invitations (BUS-010) / Applicants (BUS-011) / Brief View (BUS-005) */}
      {currentTab === "suggestions" && project.status === "published" ? (
        <CandidateSuggestionsTab project={project} />
      ) : currentTab === "invitations" && project.status === "published" ? (
        <SentInvitationsTab project={project} />
      ) : currentTab === "applicants" && project.status !== "draft" ? (
        <ProjectApplicantsTab project={project} />
      ) : (
      <div className="fb-detail-grid">
        <div>
          <section className="fb-panel fb-brief">
            <div className="fb-section-head">
              <div>
                <span className="fb-eyebrow">PROJECT BRIEF</span>
                <h2>Thông tin dự án</h2>
              </div>
              {project.status === "draft" || project.status === "published" ? (
                <Link
                  className="fb-button fb-button-secondary fb-button-small"
                  to={`/business/projects/${project.id}/edit`}
                >
                  Chỉnh sửa
                </Link>
              ) : null}
            </div>

            <p>{project.description || "Chưa có mô tả. Hãy hoàn thiện brief trước khi công bố."}</p>

            <div className="fb-facts">
              <div>
                <small>Ngân sách dự kiến</small>
                <strong>{project.budget || "Chưa đặt"}</strong>
              </div>
              <div>
                <small>Hạn nhận hồ sơ</small>
                <strong>{project.applicationDeadline || "Chưa đặt"}</strong>
              </div>
              <div>
                <small>Hạn hoàn thành</small>
                <strong>{project.deadline || "Chưa đặt"}</strong>
              </div>
              <div>
                <small>Ưu tiên bên thực hiện (BR-001)</small>
                <strong>
                  {project.preference === "both"
                    ? "Cả cá nhân hoặc team"
                    : project.preference === "individual"
                    ? "Cá nhân"
                    : "Team"}
                </strong>
              </div>
            </div>
          </section>

          <section className="fb-panel fb-brief">
            <span className="fb-eyebrow">PHẠM VI CÔNG VIỆC</span>
            <h2>Kỹ năng và bàn giao</h2>

            <h3 style={{ marginTop: "16px", marginBottom: "8px", fontSize: "14px", fontWeight: 700 }}>
              Kỹ năng cần có
            </h3>
            <div className="fb-chips">
              {project.skills.length ? (
                project.skills.map((skill) => <span key={skill}>{skill}</span>)
              ) : (
                <span>Chưa thêm kỹ năng</span>
              )}
            </div>

            <h3 style={{ marginTop: "20px", marginBottom: "8px", fontSize: "14px", fontWeight: 700 }}>
              Sản phẩm bàn giao
            </h3>
            {project.deliverables.length ? (
              <ul className="fb-check-list">
                {project.deliverables.map((item) => (
                  <li key={item}>
                    <Check size={17} /> {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Chưa thêm sản phẩm bàn giao.</p>
            )}
          </section>
        </div>

        <aside className="fb-detail-aside">
          <div className="fb-panel">
            <span className="fb-eyebrow">
              {project.status === "ongoing" ? "NGƯỜI THỰC HIỆN" : "BƯỚC TIẾP THEO"}
            </span>
            <h2>
              {project.status === "draft"
                ? "Hoàn thiện brief"
                : project.status === "ongoing"
                ? selectedTalent?.name ?? "Đã chọn người thực hiện"
                : project.status === "closed"
                ? "Đã đóng tuyển"
                : "Tìm người phù hợp"}
            </h2>
            <p>
              {project.status === "draft"
                ? "Điền đủ thông tin để công bố dự án và bắt đầu nhận ứng tuyển."
                : project.status === "ongoing"
                ? "Dự án đã chốt người thực hiện. Tin nhắn và hợp đồng được quản lý tại dự án này."
                : project.status === "closed"
                ? "Dự án đã ngừng tuyển ứng viên."
                : "Xem hồ sơ ứng tuyển hoặc tìm người phù hợp từ danh sách gợi ý."}
            </p>

            <div className="fb-aside-actions">
              {project.status === "draft" ? (
                <Link
                  className="fb-button fb-button-primary"
                  to={`/business/projects/${project.id}/edit`}
                >
                  Tiếp tục brief <ArrowRight size={17} />
                </Link>
              ) : project.status === "ongoing" ? (
                <>
                  <Link
                    className="fb-button fb-button-primary"
                    to={`/business/projects/${project.id}/messages`}
                  >
                    Tin nhắn dự án <ArrowRight size={17} />
                  </Link>
                  <Link
                    className="fb-button fb-button-secondary"
                    to={`/business/projects/${project.id}/progress`}
                  >
                    Xem tiến độ & Hợp đồng
                  </Link>
                </>
              ) : project.status === "closed" ? (
                <Link
                  className="fb-button fb-button-secondary"
                  to={`/business/projects/${project.id}/applicants`}
                >
                  Xem hồ sơ đã ứng tuyển
                </Link>
              ) : (
                <>
                  <Link
                    className="fb-button fb-button-primary"
                    to={`/business/projects/${project.id}/applicants`}
                  >
                    Xem ứng viên ({projectCandidates.length}) <ArrowRight size={17} />
                  </Link>
                  <Link
                    className="fb-button fb-button-secondary"
                    to={`/business/projects/${project.id}/suggestions`}
                  >
                    Khám phá gợi ý
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Close Project Button (BUS-006) */}
          {project.status === "published" && (
            <button
              type="button"
              className="fb-text-button"
              onClick={() => setCloseDialogOpen(true)}
            >
              Đóng tuyển dự án (BUS-006)
            </button>
          )}
        </aside>
      </div>
      )}

      <CloseProjectDialog
        open={closeDialogOpen}
        onClose={() => setCloseDialogOpen(false)}
        onConfirm={() => {
          closeProject(project.id);
          navigate(`/business/projects/${project.id}`);
        }}
        projectTitle={project.title}
      />
    </>
  );
}
