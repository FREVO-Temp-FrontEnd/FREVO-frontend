"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { projects, type Project } from "@/lib/projects";

type SortMode = "newest" | "budget" | "deadline";

const categories = ["Brand identity", "UI/UX", "Nội dung", "Motion"];
const budgetOptions = [
  { value: 0, label: "Tất cả" },
  { value: 5, label: "Từ 5 triệu" },
  { value: 10, label: "Từ 10 triệu" },
  { value: 20, label: "Từ 20 triệu" },
];

function normalized(value: string) {
  return value.toLocaleLowerCase("vi").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d");
}

function deadlineTime(value: string) {
  const [day, month, year] = value.split("/").map(Number);
  return new Date(year, month - 1, day).getTime();
}

function budget(project: Project) {
  return `${project.min} tr–${project.max} tr`;
}

function BookmarkButton({ project, saved, onToggle }: { project: Project; saved: boolean; onToggle: (id: string) => void }) {
  return (
    <button
      className="bookmark grid place-items-center"
      type="button"
      role="checkbox"
      aria-checked={saved}
      aria-label={`${saved ? "Bỏ lưu" : "Lưu"} ${project.title}`}
      onClick={() => onToggle(project.id)}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3.5h12v17l-6-4-6 4z" /></svg>
    </button>
  );
}

function ProjectCard({
  project, selected, saved, applied, onSelect, onSave,
}: {
  project: Project;
  selected: boolean;
  saved: boolean;
  applied: boolean;
  onSelect: (id: string) => void;
  onSave: (id: string) => void;
}) {
  return (
    <article className={`project-card ${selected ? "selected" : ""}`}>
      <button className="card-main" type="button" aria-pressed={selected} aria-label={project.title} onClick={() => onSelect(project.id)}>
        <span className="card-top flex items-center">
          <span className={`category-pill ${project.type}`}>{project.category}</span>
          {applied && <span className="applied-pill">✓ Đã ứng tuyển</span>}
          <span className="age">{project.age} ngày trước</span>
        </span>
        <h3>{project.title}</h3>
        <span className="card-company">{project.company} · {project.city} · {project.remote ? "Từ xa" : "Tại chỗ"}</span>
      </button>
      <BookmarkButton project={project} saved={saved} onToggle={onSave} />
      <div className="card-bottom">
        <dl className="card-facts flex">
          <div><dt>Ngân sách</dt><dd>{budget(project)}</dd></div>
          <div><dt>Hạn ứng tuyển</dt><dd>{project.deadline}</dd></div>
        </dl>
        <ul className="skill-list flex flex-wrap">{project.skills.map(skill => <li key={skill}>{skill}</li>)}</ul>
      </div>
    </article>
  );
}

function ProjectDetail({
  project, saved, applied, onSave, onApply,
}: {
  project: Project;
  saved: boolean;
  applied: boolean;
  onSave: (id: string) => void;
  onApply: (id: string) => void;
}) {
  return (
    <article className="detail-card">
      <div className="detail-hero">
        <span className="category-text">{project.category}</span>
        <h2 id="detail-title" tabIndex={-1}>{project.title}</h2>
        <p className="detail-company">{project.company} · {project.city} · {project.remote ? "Làm việc từ xa" : "Làm việc tại chỗ"}</p>
      </div>
      <dl className="detail-stats grid grid-cols-3">
        <div><dt>Ngân sách</dt><dd>{budget(project)}</dd></div>
        <div><dt>Thời lượng</dt><dd>{project.duration}</dd></div>
        <div><dt>Hạn ứng tuyển</dt><dd>{project.deadline}</dd></div>
      </dl>
      <div className="detail-body">
        <section className="detail-section"><h3>MÔ TẢ</h3><p>{project.description}</p></section>
        <section className="detail-section"><h3>KỸ NĂNG</h3><ul className="skill-list detail-skills flex flex-wrap">{project.skills.map(skill => <li key={skill}>{skill}</li>)}</ul></section>
        <section className="detail-section"><h3>SẢN PHẨM BÀN GIAO</h3><ul className="deliverables">{project.deliverables.map(item => <li key={item}>{item}</li>)}</ul></section>
      </div>
      <div className="detail-actions flex items-center">
        {applied ? <p className="applied-message">✓ Bạn đã ứng tuyển dự án này</p> : <button className="primary-button" type="button" onClick={() => onApply(project.id)}>Ứng tuyển dự án</button>}
        <BookmarkButton project={project} saved={saved} onToggle={onSave} />
      </div>
    </article>
  );
}

export default function ProjectExplorer() {
  const [query, setQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minimumBudget, setMinimumBudget] = useState(0);
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [selectedId, setSelectedId] = useState("coffee");
  const [saved, setSaved] = useState(() => new Set(["spa"]));
  const [applied, setApplied] = useState(() => new Set(["bakery"]));
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [proposal, setProposal] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [toast, setToast] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const visible = useMemo(() => {
    const term = normalized(query.trim());
    return projects.filter(project =>
      (selectedCategories.length === 0 || selectedCategories.includes(project.category)) &&
      project.min >= minimumBudget &&
      (!remoteOnly || project.remote) &&
      (!term || normalized([project.title, project.company, project.city, project.category, ...project.skills].join(" ")).includes(term))
    ).sort((a, b) => sortMode === "budget" ? b.max - a.max : sortMode === "deadline" ? deadlineTime(a.deadline) - deadlineTime(b.deadline) : a.age - b.age);
  }, [query, selectedCategories, minimumBudget, remoteOnly, sortMode]);

  const selected = visible.find(project => project.id === selectedId) ?? visible[0];
  const applyingProject = projects.find(project => project.id === applyingId);
  const hasFilters = selectedCategories.length > 0 || minimumBudget > 0 || remoteOnly;

  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

  function toggleCategory(category: string) {
    setSelectedCategories(previous => previous.includes(category) ? previous.filter(item => item !== category) : [...previous, category]);
  }

  function toggleSaved(id: string) {
    setSaved(previous => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function selectProject(id: string) {
    setSelectedId(id);
    if (window.matchMedia("(max-width: 720px)").matches) {
      requestAnimationFrame(() => {
        document.getElementById("detail-region")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
        document.getElementById("detail-title")?.focus({ preventScroll: true });
      });
    }
  }

  function openApplication(id: string) {
    setApplyingId(id);
    setProposal("");
    setPortfolio("");
    dialogRef.current?.showModal();
  }

  function closeApplication() {
    dialogRef.current?.close();
  }

  function submitApplication(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!applyingId || !event.currentTarget.reportValidity()) return;
    setApplied(previous => new Set(previous).add(applyingId));
    closeApplication();
    setToast("Đã mô phỏng gửi ứng tuyển. Không có dữ liệu nào được gửi đi.");
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 4000);
    requestAnimationFrame(() => document.getElementById("detail-title")?.focus({ preventScroll: true }));
  }

  return (
    <>
      <a className="skip-link" href="#main">Đi đến nội dung chính</a>
      <header className="site-header flex items-center justify-between">
        <div className="header-left flex items-center">
          <Image className="logo" src="/assets/frevo-logo.png" width={112} height={45} alt="FREVO" priority />
          <span className="header-divider" aria-hidden="true" />
          <span className="screen-name">Khám phá dự án</span>
        </div>
        <div className="account flex items-center" aria-label="Tài khoản của Minh Anh">
          <span className="account-copy"><strong>Minh Anh</strong><small>Freelancer</small></span>
          <button className="avatar" type="button" aria-label="Tài khoản của Minh Anh">MA</button>
        </div>
      </header>
      <p className="prototype-note">Prototype dùng dữ liệu minh họa — thao tác ứng tuyển không gửi dữ liệu thật.</p>

      <div className="page-grid grid">
        <aside className={`filter-rail ${filtersOpen ? "open" : ""}`} aria-label="Bộ lọc dự án">
          <button className="filter-toggle" type="button" aria-expanded={filtersOpen} aria-controls="filters-panel" onClick={() => setFiltersOpen(value => !value)}>Bộ lọc <span aria-hidden="true">{filtersOpen ? "−" : "+"}</span></button>
          <div id="filters-panel" className="filters-panel">
            <div className="filters-heading"><h2>Bộ lọc</h2><button type="button" disabled={!hasFilters} onClick={() => { setSelectedCategories([]); setMinimumBudget(0); setRemoteOnly(false); }}>Xóa bộ lọc</button></div>
            <fieldset className="filter-group category-group"><legend>LĨNH VỰC</legend>
              {categories.map(category => <label key={category}><input type="checkbox" checked={selectedCategories.includes(category)} onChange={() => toggleCategory(category)} /> <span>{category}</span></label>)}
            </fieldset>
            <fieldset className="filter-group budget-group"><legend>NGÂN SÁCH TỐI THIỂU</legend>
              {budgetOptions.map(option => <label key={option.value}><input type="radio" name="budget" checked={minimumBudget === option.value} onChange={() => setMinimumBudget(option.value)} /> <span>{option.label}</span></label>)}
            </fieldset>
            <label className="remote-row"><span>Làm việc từ xa</span><input type="checkbox" role="switch" checked={remoteOnly} onChange={event => setRemoteOnly(event.target.checked)} /></label>
          </div>
        </aside>

        <main id="main" className="main-column min-w-0">
          <h1>Dự án đang mở<span>.</span></h1>
          <p className="intro">Brief từ doanh nghiệp nhỏ đang tìm creative freelancer.</p>
          <div className="toolbar">
            <label className="search-wrap"><span className="sr-only">Tìm kiếm dự án</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Tìm theo tên, doanh nghiệp, kỹ năng..." /></label>
            <label className="sort-wrap" htmlFor="sort"><span>Sắp xếp</span><select id="sort" value={sortMode} onChange={event => setSortMode(event.target.value as SortMode)}><option value="newest">Mới nhất</option><option value="budget">Ngân sách cao</option><option value="deadline">Hạn gần nhất</option></select></label>
          </div>
          <p className="result-line" role="status" aria-live="polite"><strong>{visible.length}</strong> dự án phù hợp</p>
          <div className="project-list grid" aria-label="Dự án đang mở">
            {visible.map(project => <ProjectCard key={project.id} project={project} selected={selected?.id === project.id} saved={saved.has(project.id)} applied={applied.has(project.id)} onSelect={selectProject} onSave={toggleSaved} />)}
          </div>
          {visible.length === 0 && <div className="empty-state"><strong>Chưa tìm thấy dự án phù hợp.</strong><span>Thử một từ khóa hoặc bộ lọc khác.</span></div>}
        </main>

        <aside id="detail-region" className="detail-column" aria-label="Chi tiết dự án">
          {selected ? <ProjectDetail project={selected} saved={saved.has(selected.id)} applied={applied.has(selected.id)} onSave={toggleSaved} onApply={openApplication} /> : <p className="detail-empty">Chọn bộ lọc khác để xem chi tiết dự án.</p>}
        </aside>
      </div>

      <dialog ref={dialogRef} id="apply-dialog" aria-labelledby="apply-title" onClick={event => { if (event.target === dialogRef.current) closeApplication(); }}>
        <form id="apply-form" onSubmit={submitApplication}>
          <div className="dialog-head"><div><h2 id="apply-title">Ứng tuyển dự án</h2><p>{applyingProject?.title}</p></div><button className="icon-button close-dialog" type="button" aria-label="Đóng" onClick={closeApplication}>×</button></div>
          <label htmlFor="proposal">Lời giới thiệu ngắn</label>
          <textarea id="proposal" name="proposal" value={proposal} onChange={event => setProposal(event.target.value)} maxLength={1000} minLength={50} required placeholder="Vì sao bạn phù hợp với dự án này? Cách bạn sẽ tiếp cận..." />
          <p className="input-help"><span>{proposal.length}</span>/1000 ký tự · tối thiểu 50</p>
          <label htmlFor="portfolio">Liên kết portfolio phù hợp</label>
          <input id="portfolio" name="portfolio" type="url" value={portfolio} onChange={event => setPortfolio(event.target.value)} required placeholder="https://behance.net/ten-ban" />
          <p className="input-help">Behance, Dribbble, Google Drive hoặc website cá nhân.</p>
          <div className="dialog-actions"><button className="secondary-button" type="button" onClick={closeApplication}>Hủy</button><button className="primary-button" type="submit">Gửi ứng tuyển</button></div>
        </form>
      </dialog>
      {toast && <div id="toast" role="status" aria-live="polite">{toast}</div>}
    </>
  );
}
