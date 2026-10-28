import { useCallback, useEffect, useState } from "react";
import type { StoredResumeRecord } from "@/lib/types/resume.types";
import { readResumes, seedMinhAnhResumes, writeResume, deleteResume, writePrimaryResume } from "@/lib/storage/resumeStorage";
import { validateResumeFile } from "@/lib/utils/validateResumeFile";

export function useResumes(ownerId: string | undefined, seedDemoResumes = false) {
  const [resumes, setResumes] = useState<StoredResumeRecord[]>([]);
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
    const validationError = validateResumeFile(file);
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
