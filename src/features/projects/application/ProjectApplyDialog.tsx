import type { FormEvent } from "react";
import { Button } from "@/app/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/app/shared/components/ui/dialog";
import { Input } from "@/app/shared/components/ui/input";
import { Textarea } from "@/app/shared/components/ui/textarea";
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
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="apply-dialog" showCloseButton={false}>
        <form id="apply-form" onSubmit={onSubmit}>
          <div className="dialog-head">
            <div>
              <DialogTitle id="apply-title">Ứng tuyển dự án</DialogTitle>
              <DialogDescription>{project?.title}</DialogDescription>
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
          <Textarea
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
          <Input
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
            <Button
              className="secondary-button"
              variant="outline"
              type="button"
              onClick={onClose}
            >
              Hủy
            </Button>
            <Button
              className="primary-button"
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Đang gửi..." : "Gửi ứng tuyển"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
