import type { Work } from "./portfolio.types";
import type { ResumeRecord } from "./resume.types";

export type ApplicantIdentity = "individual" | "team";

export interface ApplicationMaterials {
  resumes: ResumeRecord[];
  portfolioWorks: Work[];
}

/** Primary is resolved once when the application is submitted. */
export type ResumeSelection =
  | { mode: "primary" }
  | { mode: "selected"; resumeId: string };

/** JSON request: the server obtains the account from authentication, never from this body. */
export interface SubmitApplicationRequest {
  projectId: string;
  applicantIdentity: ApplicantIdentity;
  proposal: string;
  portfolioWorkIds: string[];
  portfolioUrl: string;
  resume: ResumeSelection;
  proposedBudget: number | null;
  deliveryEstimate: string;
}
