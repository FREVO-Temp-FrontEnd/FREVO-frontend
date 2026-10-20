import { Link } from "react-router";
import {
  Users,
  Clock3,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import { useBusiness } from "@/lib/hooks/useBusiness";
import type { Milestone, ProjectBrief, TalentProfile } from "@/lib/types/marketplace.types";

export function BusinessDashboardPage() {
  const { businessName, projects, candidates, agreements, messages, notifications, talents } =
    useBusiness();

  const published = projects.filter((p) => p.status === "published").length;
  const ongoing = projects.filter((p) => p.status === "ongoing").length;
  const fresh = candidates.filter((c) => c.status === "new" || c.status === "under_review").length;

  const submittedMilestones = agreements.flatMap((agr) =>
    agr.status === "confirmed" && agr.isEffective
      ? (agr.milestones || [])
          .filter((m) => m.status === "submitted")
          .map((m) => ({ agreement: agr, milestone: m }))
      : []
  );

  const tasks: {
    id: string;
    title: string;
    detail: string;
    href: string;
    action: string;
    icon: typeof Users;
    tone: string;
  }[] = [];

  // 1. Pending candidate review tasks (BUS-013 / FR-031)
  projects.forEach((project) => {
    const pendingCandidates = candidates.filter(
      (c) => c.projectId === project.id && (c.status === "new" || c.status === "under_review")
    );
    if (pendingCandidates.length > 0) {
      tasks.push({
        id: `applicants-${project.id}`,
        title: `${pendingCandidates.length} ứng viên chờ Business xem xét`,
        detail: `Dự án: ${project.title}`,
        href: `/business/projects/${project.id}/applicants`,
        action: `Xem ứng viên (${pendingCandidates.length})`,
        icon: Users,
        tone: "orange",
      });
    }
  });

  // 2. Milestone deliverable reviews
  submittedMilestones.forEach(({ agreement, milestone }) => {
    const project = projects.find((p) => p.id === agreement.projectId);
    if (project) {
      tasks.push({
        id: `milestone-${milestone.id}`,
        title: `${milestone.name} chờ xác nhận`,
        detail: `${project.title} · Gửi bàn giao ${milestone.submittedAt ? new Date(milestone.submittedAt).toLocaleDateString("vi-VN") : "gần đây"}`,
        href: `/business/projects/${project.id}/progress`,
        action: "Xem bàn giao",
        icon: Clock3,
        tone: "green",
      });
    }
  });

  // 3. Unread chat notifications
  notifications
    .filter((n) => !n.read && n.type === "chat")
    .forEach((notice) => {
      tasks.push({
        id: notice.id,
        title: notice.title,
        detail: notice.detail,
        href: notice.href,
        action: "Mở tin nhắn",
        icon: MessageCircle,
        tone: "purple",
      });
    });

  const visibleTasks = tasks.slice(0, 4);

  // Recent messages
  const seenThreads = new Set<string>();
  const recentMessages = [...messages]
    .reverse()
    .filter((msg) => {
      const thread = `${msg.projectId}:${msg.talentId}`;
      if (seenThreads.has(thread)) return false;
      seenThreads.add(thread);
      return true;
    })
    .slice(0, 3);

  // Upcoming milestones
  const upcomingMilestones: { project: ProjectBrief; milestone: Milestone }[] = agreements
    .flatMap((agr) =>
      agr.status === "confirmed" && agr.isEffective
        ? (agr.milestones || [])
            .filter((m) => m.status !== "completed")
            .map((m) => {
              const proj = projects.find((p) => p.id === agr.projectId);
              return proj ? { project: proj, milestone: m } : null;
            })
            .filter(Boolean) as { project: ProjectBrief; milestone: Milestone }[]
        : []
    )
    .slice(0, 3);

  return (
    <div className="fb-dash-layout">
      <div className="fb-dash-main">
        <section className="fb-dash-welcome">
          <div>
            <h1>
              Chào {businessName}
              <span className="fb-dot">.</span>
            </h1>
            <p>Theo dõi tiến độ dự án và tìm cộng sự tài năng cho ý tưởng tiếp theo.</p>
          </div>
        </section>

        {/* Stats Grid */}
        <div className="fb-dash-stats" aria-label="Số liệu tổng quan">
          <div>
            <span>
              Dự án đang tuyển
              <i className="fb-stat-mark blue" />
            </span>
            <strong>{published}</strong>
            <small>Dự án nhận ứng tuyển</small>
          </div>
          <div>
            <span>
              Đang thực hiện
              <i className="fb-stat-mark green" />
            </span>
            <strong>{ongoing}</strong>
            <small>Hợp đồng đang chạy</small>
          </div>
          <div>
            <span>
              Ứng tuyển mới
              <i className="fb-stat-mark orange" />
            </span>
            <strong>{fresh}</strong>
            <small>Hồ sơ cần xem</small>
          </div>
          <div>
            <span>
              Cần phê duyệt
              <i className="fb-stat-mark amber" />
            </span>
            <strong>{submittedMilestones.length}</strong>
            <small>Mốc đã bàn giao</small>
          </div>
        </div>

        {/* Actionable Priorities List */}
        <section className="fb-panel fb-dash-priorities">
          <div className="fb-dash-title-row">
            <div>
              <h2>
                <span className="fb-priority-dot" /> Cần bạn xử lý{" "}
                <small>{tasks.length} việc ưu tiên</small>
              </h2>
            </div>
            <span>Cập nhật trực tiếp</span>
          </div>
          {visibleTasks.length ? (
            <div className="fb-dash-task-list">
              {visibleTasks.map((task) => (
                <div className="fb-dash-task" key={task.id}>
                  <span className={`fb-dash-task-icon ${task.tone}`}>
                    <task.icon size={18} strokeWidth={1.8} />
                  </span>
                  <div>
                    <strong>{task.title}</strong>
                    <small>{task.detail}</small>
                  </div>
                  <Link
                    className={`fb-button fb-button-small ${task.tone === "orange" ? "fb-button-primary" : "fb-button-secondary"}`}
                    to={task.href}
                  >
                    {task.action} <ArrowRight size={14} />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="fb-dash-empty">Hiện chưa có việc cần xử lý.</p>
          )}
        </section>
      </div>

      {/* Rail Aside */}
      <aside className="fb-dash-rail" aria-label="Cập nhật dự án">
        <section>
          <div className="fb-dash-rail-head">
            <h2>
              Tin nhắn gần đây<span className="fb-dot">.</span>
            </h2>
            <Link to="/business/projects">Xem dự án</Link>
          </div>
          {recentMessages.length ? (
            <div className="fb-dash-message-list">
              {recentMessages.map((msg) => {
                const talent = talents.find((t: TalentProfile) => t.id === msg.talentId);
                const proj = projects.find((p) => p.id === msg.projectId);
                if (!talent || !proj) return null;
                return (
                  <Link
                    key={`${msg.projectId}-${msg.talentId}`}
                    to={`/business/projects/${proj.id}/messages?talent=${talent.id}`}
                  >
                    <span
                      className="fb-avatar fb-avatar-sm"
                      style={{ background: talent.color }}
                      aria-hidden="true"
                    >
                      {talent.initials}
                    </span>
                    <span>
                      <strong>{talent.name}</strong>
                      <small>
                        {msg.sender === "business" ? `Bạn: ${msg.body}` : msg.body}
                      </small>
                    </span>
                    <time>
                      {new Date(msg.sentAt).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </time>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="fb-dash-rail-empty">Chưa có tin nhắn trong các dự án.</p>
          )}
        </section>

        <section>
          <div className="fb-dash-rail-head">
            <h2>
              Mốc sắp tới<span className="fb-dot">.</span>
            </h2>
            <span>Trong hợp đồng</span>
          </div>
          {upcomingMilestones.length ? (
            <div className="fb-dash-milestone-list">
              {upcomingMilestones.map(({ project: p, milestone: m }) => {
                const parts = m.deadline.split("/");
                const day = parts[0] || "25";
                const month = parts[1] || "10";
                return (
                  <Link
                    key={m.id}
                    to={`/business/projects/${p.id}/progress`}
                    className={m.status === "submitted" ? "is-submitted" : ""}
                  >
                    <span className="fb-dash-date">
                      <small>THG {month}</small>
                      <strong>{day}</strong>
                    </span>
                    <span>
                      <em>
                        {m.status === "submitted"
                          ? "CHỜ DUYỆT BÀN GIAO"
                          : m.status === "in_progress"
                          ? "ĐANG THỰC HIỆN"
                          : "SẮP ĐẾN HẠN"}
                      </em>
                      <strong>{m.name}</strong>
                      <small>{p.title}</small>
                    </span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="fb-dash-rail-empty">Chưa có mốc công việc sắp tới.</p>
          )}
        </section>
      </aside>
    </div>
  );
}
