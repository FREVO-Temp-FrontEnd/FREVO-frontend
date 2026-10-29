import { useEffect, useRef, useState } from "react";
import { Alert, Box, Button, Typography } from "@mui/material";
import { ImagePlus, Trash2 } from "lucide-react";
interface Props { value: string; onChange: (value: string) => void; error?: string }
export function BriefCoverInput({ value, onChange, error }: Props) {
  const reader = useRef<FileReader | null>(null);
  const [issue, setIssue] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => () => reader.current?.abort(), []);
  function upload(file?: File) {
    if (!file) return;
    reader.current?.abort();
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || !file.size || file.size > 1024 * 1024) { setLoading(false); setIssue("Chọn ảnh JPG, PNG hoặc WebP tối đa 1 MB trong bản demo."); return; }
    const next = new FileReader(); reader.current = next; setLoading(true); setIssue("");
    next.onload = () => { if (reader.current !== next) return; onChange(String(next.result)); setLoading(false); };
    next.onerror = () => { if (reader.current !== next) return; setIssue("Không đọc được ảnh. Vui lòng chọn lại."); setLoading(false); };
    next.readAsDataURL(file);
  }
  const previewable = /^https:\/\//i.test(value) || /^\/assets\//.test(value) || /^data:image\/(jpeg|png|webp);base64,/.test(value);
  return <Box sx={{ border: "1px dashed", borderColor: "divider", borderRadius: 2.5, overflow: "hidden", mb: 1 }}>
    <Box sx={{ height: { xs: 140, sm: 180 }, bgcolor: "background.default", position: "relative", display: "grid", placeItems: "center" }}>
      {value && previewable ? <Box component="img" src={value} alt="Xem trước ảnh bìa dự án" onLoad={() => setIssue("")} onError={() => setIssue("Không tải được ảnh bìa. Vui lòng chọn ảnh khác.")} sx={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <Box sx={{ textAlign: "center", color: "text.secondary" }}><ImagePlus size={26} className="mx-auto mb-2" /><Typography sx={{ fontSize: 13 }}>Ảnh bìa giúp ứng viên nhận biết dự án</Typography></Box>}
    </Box>
    <Box sx={{ p: 2 }}>
      <div className="mb-3 flex flex-wrap items-center gap-2"><Button component="label" variant="outlined" disabled={loading} startIcon={<ImagePlus size={16} />}>{loading ? "Đang đọc ảnh…" : value ? "Đổi ảnh bìa" : "Thêm ảnh bìa"}<input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={event => { upload(event.target.files?.[0]); event.target.value = ""; }} /></Button>{value && <Button startIcon={<Trash2 size={15} />} onClick={() => { reader.current?.abort(); reader.current = null; setLoading(false); setIssue(""); onChange(""); }} sx={{ color: "text.secondary" }}>Xóa ảnh</Button>}</div>
      <Typography sx={{ mt: 1, fontSize: 11, color: "text.secondary" }}>JPG, PNG, WebP · Tối đa 1 MB cho bản demo; ảnh được lưu trên trình duyệt, chưa upload lên máy chủ.</Typography>
      {(issue || error) && <Alert severity="warning" sx={{ mt: 1 }}>{issue || error}</Alert>}
    </Box>
  </Box>;
}
