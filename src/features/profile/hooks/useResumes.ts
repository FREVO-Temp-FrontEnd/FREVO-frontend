import { useCallback, useEffect, useState } from "react";

export interface ResumeRecord {
  id: string;
  ownerId: string;
  name: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
  file: Blob;
  isPrimary?: boolean;
}

const DATABASE_NAME = "frevo-cv-prototype";
const STORE_NAME = "resumes";
const SEED_STORE_NAME = "seededOwners";
const DEMO_MAX_BYTES = 5 * 1024 * 1024;

const minhAnhDemoResumes = [
  { id: "brand", name: "Minh-Anh_CV_Brand-Designer.pdf", asset: "minh-anh-brand-designer.pdf", uploadedAt: "2026-10-05T09:00:00.000Z" },
  { id: "product", name: "Minh-Anh_CV_Product-Designer.pdf", asset: "minh-anh-product-designer.pdf", uploadedAt: "2026-09-18T09:00:00.000Z" },
] as const;

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, 2);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: "id" }).createIndex("ownerId", "ownerId");
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

async function seedMinhAnhResumes(ownerId: string): Promise<void> {
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
          } satisfies ResumeRecord);
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

async function readResumes(ownerId: string): Promise<ResumeRecord[]> {
  const database = await openDatabase();
  let records: ResumeRecord[];
  try {
    records = await new Promise((resolve, reject) => {
      const request = database.transaction(STORE_NAME, "readonly").objectStore(STORE_NAME)
        .index("ownerId").getAll(ownerId);
      request.onsuccess = () => resolve(request.result as ResumeRecord[]);
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

async function writePrimaryResume(ownerId: string, id: string): Promise<void> {
  const database = await openDatabase();
  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.index("ownerId").getAll(ownerId);
      request.onsuccess = () => {
        const records = request.result as ResumeRecord[];
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

async function writeResume(record: ResumeRecord): Promise<void> {
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

async function deleteResume(id: string): Promise<void> {
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

function validateResume(file: File): string | null {
  const extension = file.name.split(".").at(-1)?.toLowerCase();
  const mimeByExtension: Record<string, string> = {
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  };
  if (!extension || !mimeByExtension[extension]) return "Chỉ nhận tệp PDF, DOC hoặc DOCX.";
  if (file.type && file.type !== mimeByExtension[extension]) return "Định dạng tệp không khớp với CV PDF, DOC hoặc DOCX.";
  if (file.size === 0) return "Tệp trống. Vui lòng chọn CV khác.";
  if (file.size > DEMO_MAX_BYTES) return "Bản demo chỉ nhận tệp tối đa 5 MB.";
  return null;
}

export function useResumes(ownerId: string | undefined, seedDemoResumes = false) {
  const [resumes, setResumes] = useState<ResumeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const reload = useCallback(async () => {
    if (!ownerId) {
      setResumes([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      if (seedDemoResumes) await seedMinhAnhResumes(ownerId);
      setResumes(await readResumes(ownerId));
      setError("");
    } catch {
      setError("Không thể đọc danh sách CV trên trình duyệt này. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }, [ownerId, seedDemoResumes]);

  useEffect(() => { void reload(); }, [reload]);

  const upload = async (file: File) => {
    const validationError = validateResume(file);
    if (validationError) {
      setError(validationError);
      return false;
    }
    if (!ownerId) {
      setError("Vui lòng đăng nhập để quản lý CV.");
      return false;
    }
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await writeResume({
        id: crypto.randomUUID(),
        ownerId,
        name: file.name,
        size: file.size,
        mimeType: file.type,
        uploadedAt: new Date().toISOString(),
        file,
      });
      setResumes(await readResumes(ownerId));
      setNotice("Đã thêm CV vào hồ sơ bản demo.");
      return true;
    } catch {
      setError("Không thể lưu CV trên trình duyệt này. Hãy kiểm tra dung lượng còn trống và thử lại.");
      return false;
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    if (!ownerId || !resumes.some((resume) => resume.id === id && resume.ownerId === ownerId)) return false;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await deleteResume(id);
      setResumes(await readResumes(ownerId));
      setNotice("Đã xóa CV khỏi hồ sơ bản demo.");
      return true;
    } catch {
      setError("Không thể xóa CV lúc này. Vui lòng thử lại.");
      return false;
    } finally {
      setBusy(false);
    }
  };

  const setPrimary = async (id: string) => {
    if (!ownerId || !resumes.some((resume) => resume.id === id && resume.ownerId === ownerId)) return false;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await writePrimaryResume(ownerId, id);
      setResumes(await readResumes(ownerId));
      setNotice("Đã đặt CV chính cho hồ sơ bản demo.");
      return true;
    } catch {
      setError("Không thể cập nhật CV chính. Vui lòng thử lại.");
      return false;
    } finally {
      setBusy(false);
    }
  };

  return { resumes, loading, busy, error, notice, reload, upload, remove, setPrimary };
}
