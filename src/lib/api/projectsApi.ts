import agent, { isDemoMode } from "./agent";
import type { Project } from "@/lib/types/project.types";
import type { SubmitApplicationRequest } from "@/lib/types/application.types";

const baseURL = import.meta.env.VITE_API_BASE_URL?.trim();

export const projectsApi = {
  getProjects: async (): Promise<Project[]> => {
    const response = await agent.get<Project[]>(
      baseURL ? "/projects" : "/data/projects.json"
    );
    return response.data;
  },

  createApplication: async (payload: SubmitApplicationRequest): Promise<void> => {
    if (isDemoMode) return;
    if (payload.resume.mode !== "upload") throw new Error("Vui lòng tải CV lên trước khi gửi ứng tuyển.");
    const body = new FormData();
    body.set("projectId", payload.projectId);
    body.set("applicantIdentity", payload.applicantIdentity);
    if (payload.teamId) body.set("teamId", payload.teamId);
    body.set("proposal", payload.proposal);
    payload.portfolioWorkIds.forEach(id => body.append("portfolioWorkIds", id));
    if (payload.proposedBudget !== null) body.set("proposedBudget", String(payload.proposedBudget));
    body.set("deliveryEstimate", payload.deliveryEstimate);
    body.set("cv", payload.resume.file);
    await agent.post("/applications", body);
  },
};

export { isDemoMode };
