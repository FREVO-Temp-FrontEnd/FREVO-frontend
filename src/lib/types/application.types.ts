export type ApplicantIdentity = "individual" | "team";

/** Primary is resolved once when the application is submitted. */
export type ResumeSelection =
  | { mode: "primary" }
  | { mode: "selected"; resumeId: string }
  | { mode: "upload"; file: File };

/** JSON request: the server obtains the account from authentication, never from this body. */
export interface SubmitApplicationRequest {
  projectId: string;
  applicantIdentity: ApplicantIdentity;
  teamId?: string;
  proposal: string;
  resume: ResumeSelection;
  proposedBudget: number | null;
  deliveryEstimate: string;
}
