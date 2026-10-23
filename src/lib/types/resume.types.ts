export interface ResumeRecord {
  id: string;
  ownerId: string;
  name: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
  isPrimary?: boolean;
}

/** Browser-only persistence record. This is never an API payload. */
export interface StoredResumeRecord extends ResumeRecord {
  file: Blob;
}

/** Immutable document reference captured on an application, not a live profile CV. */
export interface SubmittedResume {
  id: string;
  name: string;
  mimeType: string;
  fileId: string;
}
