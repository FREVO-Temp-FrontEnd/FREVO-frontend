import type { FormEvent } from "react";
import { Dialog, DialogContent, DialogTitle, Typography } from "@mui/material";
import type { Project } from "@/lib/types/project.types";
import { Send } from "lucide-react";
import "./project-apply-dialog.css";
import { formatBudget } from "@/lib/util/formatters";

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
  return (
    <Dialog
      open={isOpen}
      onClose={submitting ? undefined : onClose}
      aria-labelledby="apply-title"
      slotProps={{
        backdrop: { sx: { backgroundColor: "rgba(32, 25, 21, .5)", backdropFilter: "blur(4px)" } },
        paper: {
          className: "apply-dialog stitch-apply-dialog",
        },
      }}
    >
      <DialogContent sx={{ p: 0, overflow: "hidden" }}>
        <form id="apply-form" onSubmit={onSubmit}>
          <div className="dialog-head">
            <span className="apply-heading-icon"><Send size={20} /></span>
            <div>
              <DialogTitle
                id="apply-title"
                data-slot="dialog-title"
                sx={{
                  p: 0,
                  fontSize: "20px",
                  fontWeight: 900,
                  color: "inherit",
                  fontFamily: "inherit",
                }}
              >
                Ứng tuyển dự án
              </DialogTitle>
              <Typography
                data-slot="dialog-description"
                component="p"
                sx={{
                  mt: "6px",
                  color: "#8b8e89",
                  fontSize: "12px",
                }}
              >
                {project?.title}
              </Typography>
            </div>
            <button
              className="icon-button close-dialog"
              type="button"
              aria-label="Đóng"
              onClick={onClose}
              disabled={submitting}
            >
              ×
            </button>
          </div>

          <div className="dialog-fields">
            {project && (
              <>
                <label htmlFor="proposed-budget">Chào giá đề xuất (VNĐ)</label>
                <input id="proposed-budget" name="proposedBudget" type="number" min="1000" step="1000" defaultValue={Math.round((project.min + project.max) / 2) * 1000000} required />
                <p className="input-help">Ngân sách dự kiến của khách: {formatBudget(project)}</p>
                <label htmlFor="delivery-estimate">Thời gian hoàn thành ước tính</label>
                <input id="delivery-estimate" name="deliveryEstimate" defaultValue={project.duration} maxLength={80} required />
                <p className="input-help">Chào giá và thời gian sẽ được gửi kèm trong thư ngỏ của bạn.</p>
              </>
            )}
            <label htmlFor="proposal">Thư ngỏ & đề xuất cách tiếp cận</label>
            <textarea
              id="proposal"
              name="proposal"
              value={proposal}
              onChange={(event) => setProposal(event.target.value)}
              maxLength={1000}
              minLength={50}
              required
              placeholder="Vì sao bạn phù hợp với dự án này? Cách bạn sẽ tiếp cận..."
            />
            <p className="input-help">
              <span>{proposal.length}</span>/1000 ký tự · tối thiểu 50
            </p>

            <label htmlFor="portfolio">Liên kết portfolio phù hợp</label>
            <input
              id="portfolio"
              name="portfolio"
              type="url"
              value={portfolio}
              onChange={(event) => setPortfolio(event.target.value)}
              required
              placeholder="https://behance.net/ten-ban"
            />
            <p className="input-help">
              Behance, Dribbble, Google Drive hoặc website cá nhân.
            </p>
          </div>

          {submitError && (
            <p className="submit-error" role="alert">
              {submitError}
            </p>
          )}

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
              {submitting ? "Đang gửi..." : "Gửi hồ sơ ứng tuyển"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
