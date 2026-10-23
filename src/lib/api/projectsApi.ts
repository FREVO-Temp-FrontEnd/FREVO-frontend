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
    await agent.post("/applications", payload);
  },
};

export { isDemoMode };
