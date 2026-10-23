import type { StoredResumeRecord } from "@/lib/types/resume.types";
import { resumeSeedsByTalent } from "./seeds/resumeSeed";

const DATABASE_NAME = "frevo-cv-prototype";
const STORE_NAME = "resumes";
const SEED_STORE_NAME = "seededOwners";

const minhAnhDemoResumes = resumeSeedsByTalent["minh-anh"];

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, 3);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: "id" }).createIndex("ownerId", "ownerId");
      }
      if (!database.objectStoreNames.contains("applicationFiles")) {
        database.createObjectStore("applicationFiles", { keyPath: "id" });
      }
      if (!database.objectStoreNames.contains(SEED_STORE_NAME)) {
        database.createObjectStore(SEED_STORE_NAME, { keyPath: "ownerId" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function hasSeededResumes(ownerId: string): Promise<boolean> {
  const database = await openDatabase();
  try {
    return await new Promise((resolve, reject) => {
      const request = database.transaction(SEED_STORE_NAME, "readonly").objectStore(SEED_STORE_NAME).get(ownerId);
      request.onsuccess = () => resolve(Boolean(request.result));
      request.onerror = () => reject(request.error);
    });
  } finally {
    database.close();
  }
}

export async function seedMinhAnhResumes(ownerId: string): Promise<void> {
  if (await hasSeededResumes(ownerId)) return;
  const files = await Promise.all(minhAnhDemoResumes.map(async (resume) => {
    const response = await fetch(`${import.meta.env.BASE_URL}assets/cv/${resume.asset}`);
    if (!response.ok) throw new Error(`Could not load ${resume.asset}`);
    return response.blob();
  }));

  const database = await openDatabase();
  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction([STORE_NAME, SEED_STORE_NAME], "readwrite");
      const resumeStore = transaction.objectStore(STORE_NAME);
      const markerStore = transaction.objectStore(SEED_STORE_NAME);
      const markerRequest = markerStore.get(ownerId);
      markerRequest.onsuccess = () => {
        if (markerRequest.result) return;
        minhAnhDemoResumes.forEach((resume, index) => {
          const file = files[index];
          resumeStore.put({
            id: `demo-${resume.id}-${ownerId}`,
            ownerId,
            name: resume.name,
            size: file.size,
            mimeType: "application/pdf",
            uploadedAt: resume.uploadedAt,
            file,
            isPrimary: index === 0,
          } satisfies StoredResumeRecord);
        });
        markerStore.put({ ownerId });
      };
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
  } finally {
    database.close();
  }
}

export async function readResumes(ownerId: string): Promise<StoredResumeRecord[]> {
  const database = await openDatabase();
  let records: StoredResumeRecord[];
  try {
    records = await new Promise((resolve, reject) => {
      const request = database.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME)
        .index("ownerId").getAll(ownerId);
      request.onsuccess = () => resolve(request.result as StoredResumeRecord[]);
      request.onerror = () => reject(request.error);
    });
  } finally {
    database.close();
  }
  records.sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
  if (records.length > 0 && records.filter((resume) => resume.isPrimary).length !== 1) {
    const primaryId = records.find((resume) => resume.isPrimary)?.id ?? records[0].id;
    await writePrimaryResume(ownerId, primaryId);
    return records.map((resume) => ({ ...resume, isPrimary: resume.id === primaryId }));
  }
  return records;
}

export async function writePrimaryResume(ownerId: string, id: string): Promise<void> {
  const database = await openDatabase();
  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.index("ownerId").getAll(ownerId);
      request.onsuccess = () => {
        const records = request.result as StoredResumeRecord[];
        if (!records.some((resume) => resume.id === id)) {
          transaction.abort();
          return;
        }
        records.forEach((resume) => store.put({ ...resume, isPrimary: resume.id === id }));
      };
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
  } finally {
    database.close();
  }
}

export async function writeResume(record: StoredResumeRecord): Promise<void> {
  const database = await openDatabase();
  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, "readwrite");
      transaction.objectStore(STORE_NAME).put(record);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
  } finally {
    database.close();
  }
}

export async function deleteResume(id: string): Promise<void> {
  const database = await openDatabase();
  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, "readwrite");
      transaction.objectStore(STORE_NAME).delete(id);
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
  } finally {
    database.close();
  }
}

export async function saveApplicationFile(file: Blob): Promise<string> {
  const database = await openDatabase();
  const id = crypto.randomUUID();
  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction("applicationFiles", "readwrite");
      transaction.objectStore("applicationFiles").put({ id, file });
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
    return id;
  } finally {
    database.close();
  }
}

export async function readApplicationFile(id: string): Promise<Blob> {
  const database = await openDatabase();
  try {
    return await new Promise((resolve, reject) => {
      const request = database.transaction("applicationFiles", "readonly").objectStore("applicationFiles").get(id);
      request.onsuccess = () => request.result?.file ? resolve(request.result.file as Blob) : reject(new Error("Không tìm thấy CV đã gửi."));
      request.onerror = () => reject(request.error);
    });
  } finally {
    database.close();
  }
}

export async function readSubmittedResumeFile(fileId: string, signal?: AbortSignal): Promise<Blob> {
  if (!fileId.startsWith("seed:")) return readApplicationFile(fileId);
  const asset = fileId.slice(5);
  const knownAsset = Object.values(resumeSeedsByTalent).some(resumes => resumes.some(resume => resume.asset === asset));
  if (!knownAsset) throw new Error("Không tìm thấy CV đã gửi.");
  const response = await fetch(`${import.meta.env.BASE_URL}assets/cv/${asset}`, { signal });
  if (!response.ok) throw new Error("Không tải được CV đã gửi.");
  return response.blob();
}
