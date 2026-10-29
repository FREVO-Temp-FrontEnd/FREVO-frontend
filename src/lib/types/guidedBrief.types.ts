export type CreativeServiceId = "brand" | "social" | "video" | "copy" | "strategy";

export interface GuidedBrief {
  serviceId: CreativeServiceId;
  templateVersion: string;
  inScope: string;
  outOfScope: string;
  items: { typeId: string; name: string; specifications: Record<string, string>; acceptanceCriteria: string }[];
}
