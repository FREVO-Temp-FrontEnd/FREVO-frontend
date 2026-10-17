import { type FormEvent, useState } from "react";
import { Dialog, DialogContent } from "@mui/material";
import type { Project } from "@/lib/types/project.types";
import { Send, X, Info, Coffee, Leaf, User, Users, Link, Clock3 } from "lucide-react";
import "./project-apply-dialog.css";
import { formatBudget } from "@/lib/util/formatters";
import { isDemoMode } from "@/lib/api/projectsApi";

// ─── Static mock portfolio items (minh họa) ───────────────────────────────────
const MOCK_PORTFOLIOS = [
  { id: "p1", icon: Coffee, label: "Đậu Specialty Coffee", sub: "Bộ nhận diện & Bao bì túi" },
  { id: "p2", icon: Leaf,   label: "Trà Mộc Thảo Mộc",   sub: "Brand identity & Mockup" },
];

interface ProjectApplyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project;
  proposal: string;
  setProposal: (val: string) => void;
  portfolio: string;
  setPortfolio: (val: string) => void;
  submitting: boolean;
  submitError: string;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export function ProjectApplyDialog({
  isOpen,
  onClose,
  project,
  proposal,
  setProposal,
  portfolio,
  setPortfolio,
  submitting,
  submitError,
  onSubmit,
}: ProjectApplyDialogProps) {
  // Tư cách ứng tuyển: "individual" | "team"
  const [applicantType, setApplicantType] = useState<"individual" | "team">("individual");
  // Portfolio items được chọn
  const [selectedPortfolios, setSelectedPortfolios] = useState<Set<string>>(
    new Set(["p1", "p2"])
  );

  function togglePortfolio(id: string) {
    setSelectedPortfolios((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const budgetDefault = project
    ? Math.round((project.min + project.max) / 2) * 1_000_000
    : 0;

  return (
    <Dialog
      open={isOpen}
      onClose={submitting ? undefined : onClose}
      aria-labelledby="apply-title"
      slotProps={{
        backdrop: {
          sx: { backgroundColor: "rgba(32,25,21,.5)", backdropFilter: "blur(4px)" },
        },
        paper: { className: `apply-dialog stitch-apply-dialog ${isOpen ? "dialog-enter" : ""}` },
      }}
    >
      <DialogContent sx={{ p: 0, overflow: "hidden" }}>
        <form id="apply-form" onSubmit={onSubmit}>
          {/* ── HEADER ───────────────────────────────────────────────────── */}
          <div className="dialog-head">
            <span className="apply-heading-icon">
              <Send size={18} />
            </span>
            <div className="flex-1 min-w-0">
              <h2 id="apply-title" className="apply-title">
                Ứng tuyển dự án<span className="apply-title-dot">.</span>
              </h2>
            </div>
            <button
              className="icon-button close-dialog"
              type="button"
              aria-label="Đóng"
              onClick={onClose}
              disabled={submitting}
            >
              <X size={16} />
            </button>
          </div>

          {/* Scrollable body */}
          <div className="dialog-body">
            {/* Project banner */}
            {project && (
              <div className="dialog-project-terms">
                <div className="flex items-center gap-2">
                  <Coffee size={15} className="text-primary-icon" />
                  <span className="project-terms-name">{project.company}</span>
                </div>
                <span className="project-terms-budget">
                  Ngân sách: {formatBudget(project)}
                </span>
              </div>
            )}

            {/* Info note */}
            {isDemoMode && (
              <p className="dialog-info-note">
                <Info size={13} aria-hidden="true" />
                Thao tác ứng tuyển minh họa — dữ liệu không lưu thật.
              </p>
            )}

            {/* ── 1. Tư cách ứng tuyển ───────────────────────────────── */}
            <div className="dialog-fields">
              <input type="hidden" name="applicantType" value={applicantType} />
              <input
                type="hidden"
                name="selectedPortfolioLabels"
                value={MOCK_PORTFOLIOS.filter(({ id }) => selectedPortfolios.has(id)).map(({ label }) => label).join(", ")}
              />
              <div className="field-label-row">
                <label className="field-label">
                  Tư cách ứng tuyển <span className="required-star">*</span>
                </label>
                <span className="field-hint">Bắt buộc</span>
              </div>
              <div className="applicant-type-grid">
                {/* Cá nhân */}
                <button
                  type="button"
                  className={`applicant-card ${applicantType === "individual" ? "selected" : ""}`}
                  onClick={() => setApplicantType("individual")}
                >
                  <span className={`applicant-card-icon ${applicantType === "individual" ? "active" : ""}`}>
                    <User size={18} />
                  </span>
                  <span className="applicant-card-text">
                    <span className="applicant-card-title">Cá nhân</span>
                    <span className="applicant-card-sub">Minh Anh • Brand Designer</span>
                  </span>
                  <span className={`applicant-radio ${applicantType === "individual" ? "checked" : ""}`}>
                    {applicantType === "individual" && (
                      <span className="applicant-radio-dot" />
                    )}
                  </span>
                </button>
                {/* Đại diện Team */}
                <button
                  type="button"
                  className={`applicant-card ${applicantType === "team" ? "selected" : ""}`}
                  onClick={() => setApplicantType("team")}
                >
                  <span className={`applicant-card-icon ${applicantType === "team" ? "active" : ""}`}>
                    <Users size={18} />
                  </span>
                  <span className="applicant-card-text">
                    <span className="applicant-card-title">Đại diện Team</span>
                    <span className="applicant-card-sub">Agency / Creative Studio</span>
                  </span>
                  <span className={`applicant-radio ${applicantType === "team" ? "checked" : ""}`}>
                    {applicantType === "team" && (
                      <span className="applicant-radio-dot" />
                    )}
                  </span>
                </button>
              </div>

              {/* ── 2. Thư đề xuất ─────────────────────────────────────── */}
              <div className="field-label-row" style={{ marginTop: "20px" }}>
                <label htmlFor="proposal" className="field-label">
                  Thư đề xuất &amp; Kế hoạch (Proposal){" "}
                  <span className="required-star">*</span>
                </label>
                <span className="field-hint">Bắt buộc</span>
              </div>
              <textarea
                id="proposal"
                name="proposal"
                value={proposal}
                onChange={(e) => setProposal(e.target.value)}
                maxLength={2000}
                minLength={50}
                required
                placeholder="Vì sao bạn phù hợp với dự án này? Cách bạn sẽ tiếp cận..."
                className="proposal-textarea"
              />
              <p className="char-count">
                {proposal.length} / 2000 ký tự
              </p>

              {/* ── 3. Đính kèm portfolio ──────────────────────────────── */}
              <span className="field-label portfolio-section-label">Tác phẩm liên quan (minh họa)</span>
              <div className="portfolio-grid">
                {MOCK_PORTFOLIOS.map(({ id, icon: Icon, label, sub }) => {
                  const active = selectedPortfolios.has(id);
                  return (
                    <button
                      key={id}
                      type="button"
                      className={`portfolio-card ${active ? "selected" : ""}`}
                      onClick={() => togglePortfolio(id)}
                    >
                      <span className={`portfolio-card-icon ${active ? "active" : ""}`}>
                        <Icon size={20} />
                      </span>
                      <span className="portfolio-card-text">
                        <span className="portfolio-card-title">{label}</span>
                        <span className="portfolio-card-sub">{sub}</span>
                      </span>
                      {active && (
                        <span className="portfolio-card-check">✓</span>
                      )}
                    </button>
                  );
                })}
              </div>
              <p className="portfolio-selection-note">Tác phẩm đã chọn được ghi trong thư đề xuất; liên kết portfolio bên dưới là thông tin được gửi đi.</p>
              {/* Portfolio link */}
              <label htmlFor="portfolio" className="field-label portfolio-url-label">Liên kết portfolio <span className="required-star">*</span></label>
              <div className="portfolio-link-wrap">
                <Link size={14} className="portfolio-link-icon" />
                <input
                  id="portfolio"
                  name="portfolio"
                  type="url"
                  value={portfolio}
                  onChange={(e) => setPortfolio(e.target.value)}
                  placeholder="https://behance.net/ten-ban"
                  className="portfolio-link-input"
                  required
                />
              </div>

              {/* ── 4. Ngân sách & Thời gian bắt đầu ──────────────────── */}
              {project && (
                <>
                  <span className="field-label budget-section-label">
                    Ngân sách đề xuất &amp; Thời gian hoàn thành
                  </span>
                  <div className="budget-row">
                    <div className="budget-col">
                      <label htmlFor="proposed-budget" className="budget-col-label">Ngân sách đề xuất (VNĐ)</label>
                      <div className="budget-input-wrap">
                        <input
                          id="proposed-budget"
                          name="proposedBudget"
                          type="number"
                          min={1_000}
                          step={1_000}
                          defaultValue={budgetDefault}
                          required
                          className="budget-input"
                        />
                        <span className="budget-suffix">VNĐ</span>
                      </div>
                    </div>
                    <div className="budget-col">
                      <label htmlFor="delivery-estimate" className="budget-col-label">Thời gian hoàn thành dự kiến</label>
                      <div className="budget-input-wrap">
                        <input
                          id="delivery-estimate"
                          name="deliveryEstimate"
                          defaultValue={project.duration}
                          maxLength={80}
                          required
                          className="budget-input"
                          placeholder="Ví dụ: 4 tuần"
                        />
                        <Clock3 size={16} className="budget-suffix calendar-icon" aria-hidden="true" />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Error */}
            {submitError && (
              <p className="submit-error" role="alert">
                {submitError}
              </p>
            )}
          </div>

          {/* ── FOOTER ──────────────────────────────────────────────────── */}
          <div className="dialog-actions">
            <button
              className="secondary-button"
              type="button"
              onClick={onClose}
              disabled={submitting}
            >
              Hủy
            </button>
            <button
              className="primary-button"
              type="submit"
              disabled={submitting}
            >
              <Send size={15} />
              {submitting ? "Đang gửi..." : "Gửi đơn ứng tuyển"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
