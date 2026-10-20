import { useState } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router";
import { ArrowRight, BriefcaseBusiness, CalendarDays, Check, Eye, MessageCircle, UserRoundPlus, UsersRound, Wallet } from "lucide-react";
import { Typography } from "@mui/material";
import { ProjectBreadcrumbs } from "@/app/shared/components/ProjectBreadcrumbs";
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
        <Link className="fb-button fb-button-small fb-button-primary" to="/business/projects">
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

  const currentTab = parts[3] || (project.status === "published" ? "applicants" : "");

  const tabs: { segment: string; label: string; count?: number }[] = project.status === "published"
    ? [
        { segment: "applicants", label: "Ứng viên", count: projectCandidates.length },
        { segment: "suggestions", label: "Gợi ý phù hợp" },
        { segment: "invitations", label: "Lời mời đã gửi", count: projectInvitations.length },
      ]
    : [{ segment: "", label: "Brief" }];

  if (project.status === "ongoing") {
    tabs.push(
      { segment: "executor", label: "Người thực hiện" },
      { segment: "messages", label: "Tin nhắn" },
      { segment: "progress", label: "Tiến độ" },
      { segment: "agreement", label: "Hợp đồng" }
    );
  } else if (project.status === "published") {
    // Recruitment tabs are the primary workflow; brief and chat remain in the utility links.
  } else if (project.status === "closed") {
    tabs.push(
      { segment: "applicants", label: "Ứng viên", count: projectCandidates.length },
      { segment: "messages", label: "Tin nhắn" }
    );
  }

  return (
    <>
      <ProjectBreadcrumbs items={[{ label: "Dự án của tôi", to: "/business/projects" }, { label: project.title }]} />

      <header className="rounded-[24px] border border-[#eceae7] bg-white px-5 py-5 sm:px-7 sm:py-6">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div className="min-w-0">
            <Typography component="h1" variant="h4" sx={{ maxWidth: 540, lineHeight: 1.16, fontSize: { xs: "1.5rem", sm: "1.75rem" }, fontWeight: 800 }}>{project.title}</Typography>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[#747773]">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#e8f7ef] px-2 py-0.5 font-semibold text-[#16805b]"><span className="size-1.5 rounded-full bg-[#16805b]" aria-hidden="true" />{statusLabel(project.status)}</span>
              <span className="inline-flex items-center gap-1"><Wallet size={14} className="text-[#bd3d14]" /> Ngân sách dự kiến: <strong className="text-[#bd3d14]">{project.budget || "Chưa đặt"}</strong></span>
              <span className="inline-flex items-center gap-1"><CalendarDays size={14} /> Hạn chót ứng tuyển: <strong className="text-[#20201f]">{project.applicationDeadline || "Chưa đặt"}</strong></span>
              <span className="inline-flex items-center gap-1"><UsersRound size={14} /> Tổng nhận: <strong className="text-[#20201f]">{projectCandidates.length} hồ sơ</strong></span>
              <span className="rounded-full bg-[#f2f3f0] px-2 py-0.5 text-[#62625e]">{project.category}</span>
            </div>
          </div>
          {project.status === "published" && <div className="flex flex-wrap items-center gap-2 lg:shrink-0">
            <Link className="fb-button fb-button-small fb-button-secondary" to={`/projects/${project.id}/details`} target="_blank" rel="noopener noreferrer"><Eye size={14} /> Xem trang tin tuyển</Link>
            <Link className="fb-button fb-button-small fb-button-primary" to={`/business/projects/${project.id}/suggestions`}><UserRoundPlus size={14} /> Tìm thêm đối tác</Link>
          </div>}
        </div>
      </header>

      <nav className="mb-4 mt-3 flex items-center justify-between gap-2 overflow-x-auto border border-[#eceae7] bg-white px-2 sm:px-4" aria-label="Các mục của dự án">
        <div className="flex min-w-0 items-center gap-1 overflow-x-auto">
        {tabs.map((tab) => {
          let targetPath = tab.segment
            ? `/business/projects/${project.id}/${tab.segment}`
            : `/business/projects/${project.id}`;
          if (tab.segment === "messages") {
            targetPath = `/projects/${project.id}/chat`;
          } else if (tab.segment === "agreement") {
            targetPath = `/projects/${project.id}/agreement`;
          } else if (tab.segment === "progress") {
            targetPath = `/workspace/${project.id}`;
          }

          return (
            <Link
              key={tab.segment}
              to={targetPath}
              aria-current={currentTab === tab.segment ? "page" : undefined}
              className={`inline-flex min-h-11 shrink-0 items-center gap-2 border-b-2 px-3 text-xs font-semibold transition-colors sm:px-4 ${currentTab === tab.segment ? "border-[#f4490b] text-[#bd3d14]" : "border-transparent text-[#747773] hover:text-[#20201f]"}`}
            >
              {tab.label}
              {tab.count !== undefined && <span className={`rounded-full px-2 py-0.5 text-xs ${currentTab === tab.segment ? "bg-[#fff0e9] text-[#bd3d14]" : "bg-[#f2f3f0] text-[#747773]"}`}>{tab.count}</span>}
            </Link>
          );
        })}
        {project.status === "published" && <Link to={`/business/projects/${project.id}/brief`} aria-current={currentTab === "brief" ? "page" : undefined} className={`inline-flex min-h-11 shrink-0 items-center border-b-2 px-3 text-xs font-semibold xl:hidden ${currentTab === "brief" ? "border-[#f4490b] text-[#bd3d14]" : "border-transparent text-[#747773]"}`}>Brief</Link>}
        </div>
        {project.status === "published" && <div className="hidden shrink-0 items-center gap-3 text-xs text-[#747773] xl:flex">
          <Link to={`/business/projects/${project.id}/brief`} className={`hover:text-[#bd3d14] ${currentTab === "brief" ? "font-bold text-[#bd3d14]" : ""}`}>Xem brief</Link>
          <Link to={`/projects/${project.id}/chat`} className="inline-flex items-center gap-1 hover:text-[#bd3d14]"><MessageCircle size={14} /> Tin nhắn</Link>
        </div>}
      </nav>

      {/* Tab Switcher: Suggestions (BUS-007) / Invitations (BUS-010) / Applicants (BUS-011) / Executor / Brief View (BUS-005) */}
      {currentTab === "suggestions" && project.status === "published" ? (
        <CandidateSuggestionsTab project={project} />
      ) : currentTab === "invitations" && project.status === "published" ? (
        <SentInvitationsTab project={project} />
      ) : currentTab === "applicants" && project.status !== "draft" ? (
        <ProjectApplicantsTab project={project} />
      ) : currentTab === "executor" && project.status === "ongoing" ? (
        <div className="fb-detail-grid">
          <section className="fb-panel fb-executor">
            <span className="fb-eyebrow">NGƯỜI THỰC HIỆN DỰ ÁN</span>
            {selectedTalent ? (
              <>
                <div className="fb-executor-head">
                  <span
                    className="fb-avatar fb-avatar-lg"
                    style={{ background: selectedTalent.color }}
                  >
                    {selectedTalent.initials}
                  </span>
                  <div>
                    <span className="fb-badge fb-badge-green">Đã chốt hợp tác</span>
                    <h2>{selectedTalent.name}</h2>
                    <p>
                      {selectedTalent.role} · {selectedTalent.kind} · {selectedTalent.location}
                    </p>
                  </div>
                </div>
                <p>{selectedTalent.about}</p>
                <div className="fb-facts">
                  <div>
                    <small>Dự án</small>
                    <strong>{project.title}</strong>
                  </div>
                  <div>
                    <small>Ngân sách đã chốt</small>
                    <strong>{project.budget}</strong>
                  </div>
                </div>
                <div className="fb-executor-actions">
                  <Link
                    className="fb-button fb-button-small fb-button-primary"
                    to={`/projects/${project.id}/chat`}
                  >
                    Mở hội thoại <ArrowRight size={17} />
                  </Link>
                  <Link
                    className="fb-button fb-button-small fb-button-secondary"
                    to={`/workspace/${project.id}`}
                  >
                    Xem tiến độ & Không gian làm việc
                  </Link>
                </div>
              </>
            ) : (
              <p style={{ marginTop: "16px", color: "#777" }}>
                Chưa có thông tin người thực hiện được chọn.
              </p>
            )}
          </section>
        </div>
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
                  className="fb-button fb-button-small fb-button-primary"
                  to={`/business/projects/${project.id}/edit`}
                >
                  Tiếp tục brief <ArrowRight size={17} />
                </Link>
              ) : project.status === "ongoing" ? (
                <>
                  <Link
                    className="fb-button fb-button-small fb-button-primary"
                    to={`/projects/${project.id}/chat`}
                  >
                    Tin nhắn dự án <ArrowRight size={17} />
                  </Link>
                  <Link
                    className="fb-button fb-button-small fb-button-secondary"
                    to={`/workspace/${project.id}`}
                  >
                    Xem tiến độ & Hợp đồng
                  </Link>
                </>
              ) : project.status === "closed" ? (
                <Link
                  className="fb-button fb-button-small fb-button-secondary"
                  to={`/business/projects/${project.id}/applicants`}
                >
                  Xem hồ sơ đã ứng tuyển
                </Link>
              ) : (
                <>
                  <Link
                    className="fb-button fb-button-small fb-button-primary"
                    to={`/business/projects/${project.id}/applicants`}
                  >
                    Xem ứng viên ({projectCandidates.length}) <ArrowRight size={17} />
                  </Link>
                  <Link
                    className="fb-button fb-button-small fb-button-secondary"
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
