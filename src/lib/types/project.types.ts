export type Project = {
  id: string;
  category: string;
  type: 'uiux' | 'brand' | 'motion' | 'content';
  age: number;
  title: string;
  company: string;
  city: string;
  remote: boolean;
  min: number;
  max: number;
  duration: string;
  deadline: string;
  skills: string[];
  description: string;
  deliverables: string[];
};

export type SortMode = "newest" | "budget" | "deadline";

export type ApplicationPayload = {
  projectId: string;
  proposal: string;
  portfolioUrl: string;
};
