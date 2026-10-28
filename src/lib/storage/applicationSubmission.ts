import type { CandidateSubmission } from "@/lib/types/marketplace.types";
import type { Work } from "@/lib/types/portfolio.types";
import { readResumes, saveApplicationFile, seedMinhAnhResumes } from "./resumeStorage";
import type { SubmitApplicationRequest } from "@/lib/types/application.types";
import { validateResumeFile } from "@/lib/utils/validateResumeFile";

interface SubmissionOptions {
  ownerId: string;
  talentId: string;
  request: SubmitApplicationRequest;
  works: Work[];
}

export async function createApplicationSubmission(options: SubmissionOptions): Promise<CandidateSubmission> {
  const { request } = options;
  const ids = [...new Set(request.portfolioWorkIds)];
  const works = options.works.filter(work => work.visibility === "public" && ids.includes(work.id));
  if (works.length !== ids.length) throw new Error("Có tác phẩm không còn khả dụng. Vui lòng chọn lại portfolio.");
  const selection = request.resume;
  if (selection.mode !== "upload" && options.talentId === "minh-anh") await seedMinhAnhResumes(options.ownerId);
  const resumes = selection.mode === "upload" ? [] : await readResumes(options.ownerId);
  const resume = selection.mode === "selected" ? resumes.find(item => item.id === selection.resumeId) : selection.mode === "primary" ? resumes.find(item => item.isPrimary) : undefined;
  if (selection.mode === "selected" && !resume) throw new Error("CV đã chọn không còn khả dụng. Vui lòng chọn lại CV.");
  if (selection.mode === "upload") {
    const error = validateResumeFile(selection.file);
    if (error) throw new Error(error);
  }
  const uploadedFile = selection.mode === "upload" ? selection.file : undefined;
  return {
    portfolioWorks: structuredClone(works),
    portfolioUrl: request.portfolioUrl.trim() || undefined,
    resume: uploadedFile ? { id: crypto.randomUUID(), name: uploadedFile.name, mimeType: uploadedFile.type || "application/octet-stream", fileId: await saveApplicationFile(uploadedFile) } : resume ? { id: resume.id, name: resume.name, mimeType: resume.mimeType || (/\.pdf$/i.test(resume.name) ? "application/pdf" : resume.file.type), fileId: await saveApplicationFile(resume.file) } : undefined,
    applicantIdentity: request.applicantIdentity,
    proposedBudget: request.proposedBudget,
    deliveryEstimate: request.deliveryEstimate,
    submittedAt: new Date().toISOString(),
  };
}
