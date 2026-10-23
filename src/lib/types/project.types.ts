export type ProjectDetails = {
  heroImage: string;
  heroAlt: string;
  heroCaption: string;
  expertise: string[];
  tools: string[];
  experience: string;
  audience: string;
  intro: string[];
  scope: { title: string; text: string }[];
  requirements: string[];
  deliverables: { title: string; text: string }[];
  benefits: {
    title: string;
    payments: { label: string; title: string; description: string }[];
    note: string;
    trustTitle: string;
    trustDescription: string;
  };
  documents: { title: string; description: string; kind: "brief" | "image" }[];
  employer: {
    monogram: string;
    industry: string;
    description: string;
    verified: boolean;
    teamSize: string;
    completedProjects: string;
    rating: string;
  };
  hiringCount: string;
  timeline: { date: string; title: string; description: string }[];
};

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
  details?: ProjectDetails;
};

export type SortMode = "newest" | "budget" | "deadline";
