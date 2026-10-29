/** Prototype policy only. Production quotas must come from the authenticated API. */
export const businessQuotaPolicy = {
  version: "demo-free-v1",
  activeProjects: 3,
  invitationsPerProjectPerDay: 10,
  projectMode: "soft" as "soft" | "hard",
  timeZone: "Asia/Ho_Chi_Minh",
};
