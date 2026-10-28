const maxBytes = 5 * 1024 * 1024;
const mimeByExtension: Record<string, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

export function validateResumeFile(file: File): string | null {
  const extension = file.name.split(".").at(-1)?.toLowerCase();
  if (!extension || !mimeByExtension[extension]) return "Chỉ nhận tệp PDF, DOC hoặc DOCX.";
  if (file.type && file.type !== mimeByExtension[extension]) return "Định dạng tệp không khớp với CV PDF, DOC hoặc DOCX.";
  if (file.size === 0) return "Tệp trống. Vui lòng chọn CV khác.";
  if (file.size > maxBytes) return "Bản demo chỉ nhận tệp tối đa 5 MB.";
  return null;
}
