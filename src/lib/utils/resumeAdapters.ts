import type { SubmittedResume } from "@/lib/types/resume.types";

/** Upgrade previously persisted prototype records without changing the submitted file. */
export function normalizeSubmittedResume(value: SubmittedResume | undefined): SubmittedResume | undefined {
  if (!value || value.fileId) return value;
  const legacy = value as Partial<SubmittedResume> & { snapshotId?: string; asset?: string };
  const fileId = legacy.snapshotId ?? (legacy.asset ? `seed:${legacy.asset}` : undefined);
  if (!fileId || !legacy.id || !legacy.name) return undefined;
  return { id: legacy.id, name: legacy.name, mimeType: legacy.mimeType || "application/pdf", fileId };
}
