import axios from "axios";
import type { Project } from "@/lib/projects";

const baseURL = import.meta.env.VITE_API_BASE_URL?.trim();

export const api = axios.create({
  baseURL: baseURL || undefined,
  timeout: 10000,
  headers: { "Content-Type": "application/json" }
});

export const isDemoMode = !baseURL;

export async function getProjects(): Promise<Project[]> {
  const response = await api.get<Project[]>(baseURL ? "/projects" : "/data/projects.json");
  return response.data;
}

export type ApplicationPayload = {
  projectId: string;
  proposal: string;
  portfolioUrl: string;
};

export async function createApplication(payload: ApplicationPayload): Promise<void> {
  if (isDemoMode) return;
  await api.post("/applications", payload);
}
