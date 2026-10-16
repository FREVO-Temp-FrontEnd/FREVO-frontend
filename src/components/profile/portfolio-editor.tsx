import { useRef, useState } from "react";
import { Check, ImagePlus, Link2, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import type { PortfolioMedia, Work } from "./portfolio-types";

function readMedia(file: File): Promise<PortfolioMedia> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ id: crypto.randomUUID(), src: String(reader.result), kind: file.type === "video/mp4" ? "video" : "image", alt: file.name });
    reader.onerror = () => reject(new Error("Không đọc được tệp. Vui lòng chọn lại."));
    reader.readAsDataURL(file);
  });
}

export function PortfolioEditor({ work, onClose, onSave, onDelete }: { work: Work | null; onClose: () => void; onSave: (work: Work) => void; onDelete: (id: string) => void }) {
  const [title, setTitle] = useState(work?.title ?? "");
  const [teamType, setTeamType] = useState(work && work.team !== "Cá nhân" ? "team" : "personal");
  const [media, setMedia] = useState<PortfolioMedia[]>(work?.media ?? []);
  const [tags, setTags] = useState(work?.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [error, setError] = useState("");
  const [reading, setReading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const upload = useRef<HTMLInputElement>(null);
  const tagRef = useRef<HTMLInputElement>(null);
  function addTag() {
    const tag = tagInput.trim();
    if (!tag) return;
    if (tags.length >= 12) { setError("Mỗi dự án có tối đa 12 kỹ năng."); return; }
    setTags(previous => previous.some(item => item.toLocaleLowerCase() === tag.toLocaleLowerCase()) ? previous : [...previous, tag]);
    setTagInput("");
  }
  async function chooseFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (!files.length) return;
    if (media.length + files.length > 8) { setError("Mỗi dự án có tối đa 8 tệp."); return; }
    if (files.some(file => !["image/png", "image/jpeg", "video/mp4"].includes(file.type) || file.size > 25 * 1024 * 1024)) {
      setError("Chọn ảnh PNG, JPG hoặc video MP4, tối đa 25 MB mỗi tệp."); return;
    }
    setReading(true); setError("");
    try { const additions = await Promise.all(files.map(readMedia)); setMedia(previous => [...previous, ...additions]); }
    catch { setError("Không đọc được tệp. Vui lòng chọn lại."); }
    finally { setReading(false); }
  }
  function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const value = (name: string) => String(form.get(name) ?? "").trim();
    for (const name of ["title", "role", "contribution", "description", "date", ...(teamType === "team" ? ["team"] : [])]) {
      if (!value(name)) {
        setError("Vui lòng điền đầy đủ các trường bắt buộc, không chỉ nhập khoảng trắng.");
        (event.currentTarget.elements.namedItem(name) as HTMLElement | null)?.focus(); return;
      }
    }
    const url = value("url");
    if (url && !/^https?:\/\//i.test(url)) { setError("Liên kết dự án cần bắt đầu bằng https:// hoặc http://."); return; }
    if (!media.some(item => item.kind === "image")) { setError("Thêm ít nhất một ảnh làm ảnh bìa cho dự án."); upload.current?.focus(); return; }
    const nextTags = [...new Set([...tags, ...(tagInput.trim() ? [tagInput.trim()] : [])])];
    if (nextTags.length > 12) { setError("Mỗi dự án có tối đa 12 kỹ năng."); return; }
    const visibility = value("visibility");
    onSave({ id: work?.id ?? crypto.randomUUID(), title: title.trim(), brand: work?.brand ?? title.trim(), category: work?.category ?? "Portfolio", role: value("role"), contribution: value("contribution"), description: value("description"), team: teamType === "team" ? value("team") : "Cá nhân", date: value("date"), tags: nextTags, media, url, visibility: visibility === "link" || visibility === "private" ? visibility : "public", views: work?.views ?? 0, likes: work?.likes ?? 0, theme: work?.theme ?? "hub" });
  }
  return <Dialog open onOpenChange={open => { if (!open) onClose(); }}>
    <DialogContent className="profile-drawer" showCloseButton={false}>
      <header className="profile-drawer-header"><div><span className="profile-studio-label">FREVO Portfolio Studio</span><DialogTitle>{work ? "Chỉnh sửa dự án" : "Thêm dự án mới"}<span>.</span></DialogTitle><DialogDescription>{work?.title ?? "Kể câu chuyện đằng sau tác phẩm của bạn."}</DialogDescription></div><Button variant="ghost" size="icon" aria-label="Đóng bảng chỉnh sửa" onClick={onClose}><X size={20} /></Button></header>
      <form className="portfolio-editor" onSubmit={save}>
        <div className="profile-drawer-body">
          <div className="studio-field"><label htmlFor="studio-title">Tiêu đề dự án <b>*</b><span>{title.length}/80 ký tự</span></label><Input id="studio-title" name="title" value={title} onChange={event => setTitle(event.target.value)} maxLength={80} required placeholder="Ví dụ: Nhận diện thương hiệu Mộc Coffee" /></div>
          <fieldset className="studio-team"><legend>Phân loại & cơ cấu thực hiện</legend><div className="studio-radios"><label><input type="radio" name="project-type" value="team" checked={teamType === "team"} onChange={() => setTeamType("team")} /> Đội ngũ / Studio (Team)</label><label><input type="radio" name="project-type" value="personal" checked={teamType === "personal"} onChange={() => setTeamType("personal")} /> Dự án cá nhân</label></div><div className="studio-two-columns">{teamType === "team" && <div className="studio-field"><label htmlFor="studio-team">Tên Team / Studio <b>*</b></label><Input id="studio-team" name="team" defaultValue={work?.team === "Cá nhân" ? "" : work?.team} maxLength={100} required placeholder="Tên studio của bạn" /></div>}<div className="studio-field"><label htmlFor="studio-role">Vai trò cụ thể <b>*</b></label><Input id="studio-role" name="role" defaultValue={work?.role} required maxLength={100} placeholder="Ví dụ: Lead Designer" /></div></div><div className="studio-field"><label htmlFor="studio-contribution">Đóng góp trọng tâm <b>*</b></label><Input id="studio-contribution" name="contribution" defaultValue={work?.contribution} required maxLength={300} placeholder="Brand Direction, Logo system, thiết kế bao bì…" /></div></fieldset>
          <div className="studio-field"><label htmlFor="studio-description">Câu chuyện & giải pháp thiết kế <b>*</b></label><Textarea id="studio-description" name="description" defaultValue={work?.description} required maxLength={3000} rows={5} placeholder="Bối cảnh, thách thức và giải pháp sáng tạo bạn đã triển khai…" /></div>
          <section className="studio-media"><div className="studio-section-label"><h3>Hình ảnh & mockup sản phẩm <b>*</b></h3><span>{media.length} / 8 tệp</span></div><div className="studio-media-grid">{media.map(item => <div className={item.id === media.find(entry => entry.kind === "image")?.id ? "studio-media-item is-cover" : "studio-media-item"} key={item.id}>{item.kind === "video" ? <video src={item.src} controls preload="metadata" /> : <img src={item.src} alt={item.alt} />}<button type="button" className="studio-media-remove" aria-label={`Xóa ${item.alt}`} disabled={reading} onClick={() => setMedia(previous => previous.filter(entry => entry.id !== item.id))}><X size={14} /></button>{item.kind === "image" && <button type="button" className="studio-cover-select" onClick={() => setMedia(previous => [item, ...previous.filter(entry => entry.id !== item.id)])}>{item.id === media.find(entry => entry.kind === "image")?.id ? "Ảnh bìa" : "Đặt làm bìa"}</button>}</div>)}</div><input ref={upload} className="sr-only" type="file" id="studio-upload" accept="image/png,image/jpeg,video/mp4" multiple onChange={chooseFiles} disabled={reading || media.length >= 8} /><Button type="button" className="studio-upload" disabled={reading || media.length >= 8} onClick={() => upload.current?.click()}><ImagePlus size={20} />{reading ? "Đang đọc tệp…" : "Thêm ảnh / video"}<small>PNG, JPG, MP4 · Tối đa 25 MB/tệp</small></Button></section>
          <div className="studio-field"><label htmlFor="studio-tags">Kỹ năng & công cụ ứng dụng</label><div className="studio-tags">{tags.map(tag => <span key={tag}>{tag}<button type="button" aria-label={`Bỏ kỹ năng ${tag}`} onClick={() => setTags(previous => previous.filter(item => item !== tag))}><X size={12} /></button></span>)}<div className="studio-tag-input"><Input ref={tagRef} id="studio-tags" value={tagInput} onChange={event => setTagInput(event.target.value)} maxLength={40} placeholder="Thêm kỹ năng" onKeyDown={event => { if (event.key === "Enter") { event.preventDefault(); addTag(); } }} /><button type="button" aria-label="Thêm kỹ năng" onClick={addTag}><Plus size={17} /></button></div></div></div>
          <div className="studio-field"><label htmlFor="studio-url">Liên kết dự án (Behance / Dribbble / Website)</label><div className="studio-link"><Link2 size={17} /><Input id="studio-url" name="url" type="url" defaultValue={work?.url} maxLength={2000} placeholder="https://behance.net/gallery/…" /></div></div>
          <div className="studio-two-columns"><div className="studio-field"><label htmlFor="studio-date">Thời điểm hoàn thành <b>*</b></label><Input id="studio-date" name="date" type="month" defaultValue={work?.date} required min="1900-01" max="9999-12" /></div><div className="studio-field"><label htmlFor="studio-visibility">Chế độ hiển thị</label><select id="studio-visibility" name="visibility" defaultValue={work?.visibility ?? "public"}><option value="public">Công khai trên FREVO</option><option value="link">Chỉ người có liên kết</option><option value="private">Riêng tư</option></select></div></div>
          <p className="studio-demo">Bản xem thử: tệp và thay đổi chỉ giữ trong phiên hiện tại, mất khi tải lại. Chế độ hiển thị chưa áp dụng quyền truy cập thật.</p>
          {error && <p className="submit-error" role="alert">{error}</p>}
        </div>
        <footer className="profile-drawer-footer">{work && <Button type="button" className="studio-delete" onClick={() => setConfirmDelete(true)}><Trash2 size={16} /> Xóa dự án</Button>}<div><Button type="button" className="secondary-button" onClick={onClose}>Hủy</Button><Button type="submit" className="primary-button" disabled={reading}><Check size={16} /> {work ? "Lưu thay đổi" : "Thêm dự án"}</Button></div></footer>
      </form>
      {confirmDelete && <div className="studio-delete-confirm" role="group" aria-label="Xác nhận xóa dự án"><p>Xóa “{work?.title}” khỏi bản xem thử?</p><Button className="secondary-button" onClick={() => setConfirmDelete(false)}>Giữ lại</Button><Button className="studio-delete" onClick={() => { if (work) onDelete(work.id); }}>Xóa dự án</Button></div>}
    </DialogContent>
  </Dialog>;
}
