import type { FormEvent } from "react";
import { Dialog, DialogContent, DialogTitle, Typography } from "@mui/material";
import type { Project } from "@/lib/types/project.types";

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
      onClose={onClose}
      slotProps={{
        paper: {
          className: "apply-dialog",
        },
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        <form id="apply-form" onSubmit={onSubmit}>
          <div className="dialog-head">
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
            >
              ×
            </button>
          </div>

          <label htmlFor="proposal">Lời giới thiệu ngắn</label>
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
            >
              Hủy
            </button>
            <button
              className="primary-button"
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Đang gửi..." : "Gửi ứng tuyển"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
