import { useState } from "react";
import { useAuthSession } from "@/lib/hooks/useAuthSession";
import { useBusiness } from "@/lib/hooks/useBusiness";
import { mockStorage } from "@/lib/storage/mockStorage";
import { businessAccountFields, validateBusinessAccount, type BusinessAccountErrors, type BusinessAccountFields } from "@/lib/utils/businessAccount";

export function useBusinessAccount() {
  const { user: sessionUser } = useAuthSession();
  const user = sessionUser ?? mockStorage.getActiveUser();
  const { projects } = useBusiness();
  const [baseline, setBaseline] = useState(user);
  const [fields, setFields] = useState(() => businessAccountFields(user));
  const [errors, setErrors] = useState<BusinessAccountErrors>({});
  const [feedback, setFeedback] = useState("");
  const [failure, setFailure] = useState("");
  const ownedProjects = projects.filter(project => Boolean(user.companyName) && project.company === user.companyName);
  const dirty = JSON.stringify(fields) !== JSON.stringify(businessAccountFields(baseline));

  function setField(field: keyof BusinessAccountFields, value: string) {
    setFields(current => ({ ...current, [field]: value }));
    setErrors(current => ({ ...current, [field]: undefined }));
    setFeedback("");
    setFailure("");
  }
  function reset() {
    setBaseline(user);
    setFields(businessAccountFields(user));
    setErrors({}); setFailure(""); setFeedback("");
  }
  function save() {
    const nextErrors = validateBusinessAccount(fields);
    setErrors(nextErrors); setFeedback(""); setFailure("");
    const invalid = Object.keys(nextErrors)[0];
    if (invalid) { document.getElementById(`business-account-${invalid}`)?.focus(); return; }
    try {
      mockStorage.saveBusinessAccount(fields, baseline);
      const saved = mockStorage.getActiveUser();
      setBaseline(saved); setFields(businessAccountFields(saved));
      setFeedback("Đã lưu thông tin tài khoản.");
    } catch (error: unknown) {
      setFailure(error instanceof Error ? error.message : "Không lưu được thông tin. Vui lòng thử lại.");
    }
  }
  return { user, fields, setField, errors, dirty, feedback, setFeedback, failure, reset, save, ownedProjects };
}
