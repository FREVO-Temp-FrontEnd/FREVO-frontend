import agent, { isDemoMode } from "./agent";
import { projectsApi } from "./projectsApi";
import { mockStorage } from "@/lib/storage/mockStorage";
import { createApplicationSubmission } from "@/lib/storage/applicationSubmission";
import { readSubmittedResumeFile } from "@/lib/storage/resumeStorage";
import { readRepresentedTeams } from "@/lib/storage/representedTeams";
import { validateResumeFile } from "@/lib/utils/validateResumeFile";
import type { ApplicantIdentity, ApplicationMaterials, SubmitApplicationRequest } from "@/lib/types/application.types";
import type { Candidate, ProjectBrief } from "@/lib/types/marketplace.types";
import type { Work } from "@/lib/types/portfolio.types";

/** API boundary. Demo identifiers, IndexedDB and fixtures stay behind this module.
 * Remote paths define the client contract for future backend integration.
 */
export const applicationsApi = {
  async getMaterials(identity: ApplicantIdentity, personalWorks: Work[], signal?: AbortSignal): Promise<ApplicationMaterials> {
    if (!isDemoMode) {
      const works = await agent.get<Work[]>("/portfolio/works", { params: { identity }, signal });
      return { resumes: [], portfolioWorks: works.data };
    }
    return {
      resumes: [],
      portfolioWorks: mockStorage.getApplicantWorks(identity, personalWorks),
    };
  },

  async submit(request: SubmitApplicationRequest, personalWorks: Work[]): Promise<void> {
    if (request.resume.mode !== "upload") throw new Error("Vui lòng tải CV lên trước khi gửi ứng tuyển.");
    const fileError = validateResumeFile(request.resume.file);
    if (fileError) throw new Error(fileError);
    if (!isDemoMode) {
      await projectsApi.createApplication(request);
      return;
    }
    const account = mockStorage.getActiveUser();
    if (account.role !== "freelancer") throw new Error("Vui lòng dùng tài khoản freelancer để gửi hồ sơ ứng tuyển.");
    const team = request.applicantIdentity === "team" ? readRepresentedTeams(account).find(item => item.id === request.teamId) : undefined;
    if (request.applicantIdentity === "team" && !team) throw new Error("Vui lòng chọn một nhóm bạn đại diện.");
    const talentId = team ? `managed-team:${account.id}:${team.id}` : mockStorage.getApplicantTalentId("individual");
    const prior = mockStorage.getCandidates().find(candidate => candidate.projectId === request.projectId && candidate.applicantAccountId === account.id);
    if (prior && prior.talentId !== talentId) throw new Error("Bạn không thể đổi tư cách cá nhân/Team của đơn đã gửi cho dự án này.");
    const project = mockStorage.getProjectById(request.projectId);
    if (project && project.status !== "published") throw new Error("Dự án đã ngừng nhận hồ sơ ứng tuyển.");
    const submission = await createApplicationSubmission({ ownerId: account.id, talentId, request, works: mockStorage.getApplicantWorks(request.applicantIdentity, personalWorks) });
    if (team) mockStorage.registerRepresentedTeam(account.id, team);
    mockStorage.submitApplication(request.projectId, talentId, request.proposal, submission, account.id);
  },

  canViewResume(candidate: Candidate, project: ProjectBrief): boolean {
    return isDemoMode ? mockStorage.canViewCandidateResume(candidate.id, project.id) : candidate.permissions?.canViewResume === true;
  },

  async getSubmittedResumeContent(candidate: Candidate, project: ProjectBrief, signal?: AbortSignal): Promise<Blob> {
    if (!applicationsApi.canViewResume(candidate, project)) throw new Error("Bạn không có quyền xem CV của hồ sơ này.");
    if (!isDemoMode) {
      const response = await agent.get<Blob>(`/applications/${encodeURIComponent(candidate.id)}/resume`, { responseType: "blob", signal });
      return response.data;
    }
    const record = mockStorage.getCandidates().find(item => item.id === candidate.id && item.projectId === project.id);
    if (!record?.submission?.resume) throw new Error("Hồ sơ này không có CV gửi kèm.");
    return readSubmittedResumeFile(record.submission.resume.fileId, signal);
  },
};
