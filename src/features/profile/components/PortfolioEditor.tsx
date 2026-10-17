import { useRef, useState } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  Typography,
  IconButton,
  Button as MuiButton,
} from "@mui/material";
import { Check, ImagePlus, Link2, Plus, Trash2, X } from "lucide-react";
import type { PortfolioMedia, Work } from "@/lib/types/portfolio.types";

function readMedia(file: File): Promise<PortfolioMedia> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      resolve({
        id: crypto.randomUUID(),
        src: String(reader.result),
        kind: file.type === "video/mp4" ? "video" : "image",
        alt: file.name,
      });
    reader.onerror = () =>
      reject(new Error("Không đọc được tệp. Vui lòng chọn lại."));
    reader.readAsDataURL(file);
  });
}

export function PortfolioEditor({
  work,
  onClose,
  onSave,
  onDelete,
}: {
  work: Work | null;
  onClose: () => void;
  onSave: (work: Work) => void;
  onDelete: (id: string) => void;
}) {
  const [title, setTitle] = useState(work?.title ?? "");
  const [teamType, setTeamType] = useState(
    work && work.team !== "Cá nhân" ? "team" : "personal"
  );
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
    if (tags.length >= 12) {
      setError("Mỗi dự án có tối đa 12 kỹ năng.");
      return;
    }
    setTags((previous) =>
      previous.some((item) => item.toLocaleLowerCase() === tag.toLocaleLowerCase())
        ? previous
        : [...previous, tag]
    );
    setTagInput("");
  }

  async function chooseFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (!files.length) return;
    if (media.length + files.length > 8) {
      setError("Mỗi dự án có tối đa 8 tệp.");
      return;
    }
    if (
      files.some(
        (file) =>
          !["image/png", "image/jpeg", "video/mp4"].includes(file.type) ||
          file.size > 25 * 1024 * 1024
      )
    ) {
      setError("Chọn ảnh PNG, JPG hoặc video MP4, tối đa 25 MB mỗi tệp.");
      return;
    }
    setReading(true);
    setError("");
    try {
      const additions = await Promise.all(files.map(readMedia));
      setMedia((previous) => [...previous, ...additions]);
    } catch {
      setError("Không đọc được tệp. Vui lòng chọn lại.");
    } finally {
      setReading(false);
    }
  }

  function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const value = (name: string) => String(form.get(name) ?? "").trim();
    for (const name of [
      "title",
      "role",
      "contribution",
      "description",
      "date",
      ...(teamType === "team" ? ["team"] : []),
    ]) {
      if (!value(name)) {
        setError(
          "Vui lòng điền đầy đủ các trường bắt buộc, không chỉ nhập khoảng trắng."
        );
        (
          event.currentTarget.elements.namedItem(name) as HTMLElement | null
        )?.focus();
        return;
      }
    }
    const url = value("url");
    if (url && !/^https?:\/\//i.test(url)) {
      setError("Liên kết dự án cần bắt đầu bằng https:// hoặc http://.");
      return;
    }
    if (!media.some((item) => item.kind === "image")) {
      setError("Thêm ít nhất một ảnh làm ảnh bìa cho dự án.");
      upload.current?.focus();
      return;
    }
    const nextTags = [
      ...new Set([...tags, ...(tagInput.trim() ? [tagInput.trim()] : [])]),
    ];
    if (nextTags.length > 12) {
      setError("Mỗi dự án có tối đa 12 kỹ năng.");
      return;
    }
    const visibility = value("visibility");
    onSave({
      id: work?.id ?? crypto.randomUUID(),
      title: title.trim(),
      brand: work?.brand ?? title.trim(),
      category: work?.category ?? "Portfolio",
      role: value("role"),
      contribution: value("contribution"),
      description: value("description"),
      team: teamType === "team" ? value("team") : "Cá nhân",
      date: value("date"),
      tags: nextTags,
      media,
      url,
      visibility:
        visibility === "link" || visibility === "private"
          ? visibility
          : "public",
      views: work?.views ?? 0,
      likes: work?.likes ?? 0,
      theme: work?.theme ?? "hub",
    });
  }

  return (
    <Dialog
      open
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            position: "fixed",
            right: 0,
            top: 0,
            bottom: 0,
            m: 0,
            width: "min(620px, 100vw)",
            maxWidth: "none",
            height: "100dvh",
            maxHeight: "none",
            display: "flex",
            flexDirection: "column",
            borderRadius: 0,
            bgcolor: "var(--card, #fff)",
            borderLeft: "1px solid var(--line, #e4e6e2)",
            boxShadow: "-18px 0 70px rgba(32, 32, 31, 0.1)",
            overflow: "hidden",
          },
        },
      }}
    >
      <Box
        component="header"
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "20px",
          p: { xs: "20px 18px", sm: "26px 28px 22px" },
          borderBottom: "1px solid var(--line, #e4e6e2)",
          flexShrink: 0,
          bgcolor: "var(--card, #fff)",
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            component="span"
            sx={{
              display: "block",
              fontSize: "11px",
              fontWeight: 700,
              color: "var(--orange-dark, #bd3d14)",
              mb: "8px",
            }}
          >
            FREVO Portfolio Studio
          </Typography>
          <DialogTitle
            sx={{
              p: 0,
              fontFamily: "Archivo, Arial, sans-serif",
              fontSize: { xs: "24px", sm: "27px" },
              lineHeight: 1.2,
              letterSpacing: "-.04em",
              fontWeight: 800,
              "& > span": { color: "var(--orange, #f4490b)" },
            }}
          >
            {work ? "Chỉnh sửa dự án" : "Thêm dự án mới"}
            <span>.</span>
          </DialogTitle>
          <Typography
            sx={{
              fontSize: "12px",
              lineHeight: 1.5,
              mt: "9px",
              color: "#686d65",
              overflowWrap: "anywhere",
            }}
          >
            {work?.title ?? "Kể câu chuyện đằng sau tác phẩm của bạn."}
          </Typography>
        </Box>
        <IconButton
          aria-label="Đóng bảng chỉnh sửa"
          onClick={onClose}
          sx={{
            flexShrink: 0,
            bgcolor: "var(--bg, #f7f8f6)",
            color: "var(--ink, #20201f)",
            "&:hover": { bgcolor: "var(--peach, #fff0e9)" },
          }}
        >
          <X size={20} />
        </IconButton>
      </Box>

      <Box
        component="form"
        onSubmit={save}
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
          flex: 1,
        }}
      >
        <Box
          sx={{
            minHeight: 0,
            overflowY: "auto",
            overscrollBehavior: "contain",
            flex: 1,
            p: { xs: "22px 18px", sm: "26px 28px" },
            display: "flex",
            flexDirection: "column",
            gap: "25px",
            scrollbarWidth: "thin",
            "& .studio-field": {
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              minWidth: 0,
              "& > label": {
                fontFamily: '"Space Grotesk", Arial, sans-serif',
                fontSize: "13px",
                fontWeight: 600,
                lineHeight: 1.5,
                display: "flex",
                gap: "4px",
                flexWrap: "wrap",
                "& b": { color: "var(--orange-dark, #bd3d14)" },
                "& > span": {
                  ml: "auto",
                  fontSize: "11px",
                  fontWeight: 400,
                  color: "#747773",
                },
              },
              "& input:not([type=radio]):not([type=file]), & textarea, & select": {
                width: "100%",
                minWidth: 0,
                height: "44px",
                bgcolor: "#f4f5f2",
                border: "1px solid transparent",
                borderRadius: "10px",
                p: "10px 13px",
                color: "var(--ink, #20201f)",
                fontSize: "13px",
                boxShadow: "none",
                transition: "background .15s, border-color .15s",
                "&:focus-visible": {
                  bgcolor: "#fff",
                  borderColor: "var(--orange, #f4490b)",
                  outline: "2px solid rgba(244, 73, 11, 0.2)",
                  outlineOffset: "2px",
                },
              },
              "& textarea": {
                height: "auto",
                minHeight: "120px",
                resize: "vertical",
                lineHeight: 1.7,
              },
            },
          }}
        >
          <div className="studio-field">
            <label htmlFor="studio-title">
              Tiêu đề dự án <b>*</b>
              <span>{title.length}/80 ký tự</span>
            </label>
            <input
              id="studio-title"
              name="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={80}
              required
              placeholder="Ví dụ: Nhận diện thương hiệu Mộc Coffee"
            />
          </div>

          <Box
            component="fieldset"
            sx={{
              minWidth: 0,
              m: 0,
              p: { xs: "14px", sm: "18px" },
              bgcolor: "var(--bg, #f7f8f6)",
              border: "1px solid var(--line, #e4e6e2)",
              borderRadius: "var(--radius, 13px)",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              "& legend": {
                fontFamily: '"Space Grotesk", Arial, sans-serif',
                fontSize: "13px",
                fontWeight: 600,
                p: "0 6px",
              },
              "& input:not([type=radio])": {
                bgcolor: "#fff !important",
                borderColor: "var(--line, #e4e6e2) !important",
              },
            }}
          >
            <legend>Phân loại & cơ cấu thực hiện</legend>
            <Box
              sx={{
                display: "flex",
                gap: { xs: "12px", sm: "18px" },
                flexWrap: "wrap",
                pb: "15px",
                borderBottom: "1px solid var(--line, #e4e6e2)",
                "& label": {
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  fontSize: "12px",
                  cursor: "pointer",
                },
                "& input": {
                  accentColor: "var(--orange, #f4490b)",
                  width: "16px",
                  height: "16px",
                },
              }}
            >
              <label>
                <input
                  type="radio"
                  name="project-type"
                  value="team"
                  checked={teamType === "team"}
                  onChange={() => setTeamType("team")}
                />{" "}
                Đội ngũ / Studio (Team)
              </label>
              <label>
                <input
                  type="radio"
                  name="project-type"
                  value="personal"
                  checked={teamType === "personal"}
                  onChange={() => setTeamType("personal")}
                />{" "}
                Dự án cá nhân
              </label>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
                gap: "14px",
              }}
            >
              {teamType === "team" && (
                <div className="studio-field">
                  <label htmlFor="studio-team">
                    Tên Team / Studio <b>*</b>
                  </label>
                  <input
                    id="studio-team"
                    name="team"
                    defaultValue={work?.team === "Cá nhân" ? "" : work?.team}
                    maxLength={100}
                    required
                    placeholder="Tên studio của bạn"
                  />
                </div>
              )}
              <div className="studio-field">
                <label htmlFor="studio-role">
                  Vai trò cụ thể <b>*</b>
                </label>
                <input
                  id="studio-role"
                  name="role"
                  defaultValue={work?.role}
                  required
                  maxLength={100}
                  placeholder="Ví dụ: Lead Designer"
                />
              </div>
            </Box>

            <div className="studio-field">
              <label htmlFor="studio-contribution">
                Đóng góp trọng tâm <b>*</b>
              </label>
              <input
                id="studio-contribution"
                name="contribution"
                defaultValue={work?.contribution}
                required
                maxLength={300}
                placeholder="Brand Direction, Logo system, thiết kế bao bì…"
              />
            </div>
          </Box>

          <div className="studio-field">
            <label htmlFor="studio-description">
              Câu chuyện & giải pháp thiết kế <b>*</b>
            </label>
            <textarea
              id="studio-description"
              name="description"
              defaultValue={work?.description}
              required
              maxLength={3000}
              rows={5}
              placeholder="Bối cảnh, thách thức và giải pháp sáng tạo bạn đã triển khai…"
            />
          </div>

          <Box component="section">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "10px",
                mb: "12px",
                "& h3": {
                  fontFamily: '"Space Grotesk", Arial, sans-serif',
                  fontSize: "13px",
                  fontWeight: 600,
                  m: 0,
                  "& b": { color: "var(--orange-dark, #bd3d14)" },
                },
                "& span": {
                  color: "#747773",
                  fontSize: "11px",
                  whiteSpace: "nowrap",
                },
              }}
            >
              <h3>
                Hình ảnh & mockup sản phẩm <b>*</b>
              </h3>
              <span>{media.length} / 8 tệp</span>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(2, minmax(0, 1fr))",
                  sm: "repeat(4, minmax(0, 1fr))",
                },
                gap: "9px",
              }}
            >
              {media.map((item) => {
                const isCover =
                  item.id === media.find((entry) => entry.kind === "image")?.id;
                return (
                  <Box
                    key={item.id}
                    sx={{
                      position: "relative",
                      minWidth: 0,
                      height: "115px",
                      overflow: "hidden",
                      bgcolor: "var(--bg, #f7f8f6)",
                      borderRadius: "9px",
                      gridColumn: isCover ? { xs: "span 2", sm: "span 2" } : "span 1",
                      "& img, & video": {
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      },
                    }}
                  >
                    {item.kind === "video" ? (
                      <video src={item.src} controls preload="metadata" />
                    ) : (
                      <img src={item.src} alt={item.alt} />
                    )}
                    <button
                      type="button"
                      aria-label={`Xóa ${item.alt}`}
                      disabled={reading}
                      onClick={() =>
                        setMedia((previous) =>
                          previous.filter((entry) => entry.id !== item.id)
                        )
                      }
                      style={{
                        position: "absolute",
                        top: "6px",
                        right: "6px",
                        width: "25px",
                        height: "25px",
                        display: "grid",
                        placeItems: "center",
                        background: "#fff",
                        border: 0,
                        borderRadius: "50%",
                        color: "var(--ink, #20201f)",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
                        cursor: "pointer",
                      }}
                    >
                      <X size={14} />
                    </button>
                    {item.kind === "image" && (
                      <button
                        type="button"
                        onClick={() =>
                          setMedia((previous) => [
                            item,
                            ...previous.filter((entry) => entry.id !== item.id),
                          ])
                        }
                        style={{
                          position: "absolute",
                          left: "6px",
                          bottom: "6px",
                          maxWidth: "calc(100% - 12px)",
                          padding: "4px 7px",
                          background: isCover ? "var(--orange, #f4490b)" : "white",
                          color: "var(--ink, #20201f)",
                          border: 0,
                          borderRadius: "99px",
                          fontSize: "9px",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        {isCover ? "Ảnh bìa" : "Đặt làm bìa"}
                      </button>
                    )}
                  </Box>
                );
              })}
            </Box>

            <input
              ref={upload}
              style={{ display: "none" }}
              type="file"
              id="studio-upload"
              accept="image/png,image/jpeg,video/mp4"
              multiple
              onChange={chooseFiles}
              disabled={reading || media.length >= 8}
            />

            <MuiButton
              type="button"
              disabled={reading || media.length >= 8}
              onClick={() => upload.current?.click()}
              sx={{
                width: "100%",
                display: "flex",
                gap: "7px",
                flexWrap: "wrap",
                height: "auto",
                minHeight: "66px",
                mt: "10px",
                p: "12px",
                bgcolor: "var(--bg, #f7f8f6)",
                border: "1px dashed #c7ccc3",
                borderRadius: "10px",
                color: "#626b5d",
                fontSize: "12px",
                textTransform: "none",
                "&:hover": {
                  bgcolor: "var(--peach, #fff0e9)",
                  color: "var(--orange-dark, #bd3d14)",
                  borderColor: "var(--orange, #f4490b)",
                },
                "& small": {
                  fontSize: "10px",
                  fontWeight: 400,
                  width: { xs: "100%", sm: "auto" },
                },
              }}
            >
              <ImagePlus size={20} />
              {reading ? "Đang đọc tệp…" : "Thêm ảnh / video"}
              <small>PNG, JPG, MP4 · Tối đa 25 MB/tệp</small>
            </MuiButton>
          </Box>

          <div className="studio-field">
            <label htmlFor="studio-tags">Kỹ năng & công cụ ứng dụng</label>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "8px",
                p: "12px",
                bgcolor: "var(--bg, #f7f8f6)",
                borderRadius: "10px",
                "& > span": {
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  p: "6px 9px",
                  border: "1px solid var(--line, #e4e6e2)",
                  borderRadius: "99px",
                  bgcolor: "#fff",
                  fontSize: "11px",
                  "& > button": {
                    display: "grid",
                    placeItems: "center",
                    color: "#747773",
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    border: 0,
                    bgcolor: "transparent",
                    cursor: "pointer",
                  },
                },
              }}
            >
              {tags.map((tag) => (
                <span key={tag}>
                  {tag}
                  <button
                    type="button"
                    aria-label={`Bỏ kỹ năng ${tag}`}
                    onClick={() =>
                      setTags((previous) =>
                        previous.filter((item) => item !== tag)
                      )
                    }
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  maxWidth: "100%",
                  width: "150px",
                  "& input": {
                    height: "32px !important",
                    p: "5px 7px !important",
                    fontSize: "11px !important",
                  },
                  "& > button": {
                    p: "5px",
                    color: "var(--orange-dark, #bd3d14)",
                    border: 0,
                    bgcolor: "transparent",
                    cursor: "pointer",
                  },
                }}
              >
                <input
                  ref={tagRef}
                  id="studio-tags"
                  value={tagInput}
                  onChange={(event) => setTagInput(event.target.value)}
                  maxLength={40}
                  placeholder="Thêm kỹ năng"
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addTag();
                    }
                  }}
                />
                <button
                  type="button"
                  aria-label="Thêm kỹ năng"
                  onClick={addTag}
                >
                  <Plus size={17} />
                </button>
              </Box>
            </Box>
          </div>

          <div className="studio-field">
            <label htmlFor="studio-url">
              Liên kết dự án (Behance / Dribbble / Website)
            </label>
            <Box sx={{ position: "relative" }}>
              <Link2
                size={17}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "14px",
                  color: "#747773",
                }}
              />
              <input
                id="studio-url"
                name="url"
                type="url"
                defaultValue={work?.url}
                maxLength={2000}
                placeholder="https://behance.net/gallery/…"
                style={{ paddingLeft: "38px" }}
              />
            </Box>
          </div>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
              gap: "14px",
            }}
          >
            <div className="studio-field">
              <label htmlFor="studio-date">
                Thời điểm hoàn thành <b>*</b>
              </label>
              <input
                id="studio-date"
                name="date"
                type="month"
                defaultValue={work?.date}
                required
                min="1900-01"
                max="9999-12"
              />
            </div>
            <div className="studio-field">
              <label htmlFor="studio-visibility">Chế độ hiển thị</label>
              <select
                id="studio-visibility"
                name="visibility"
                defaultValue={work?.visibility ?? "public"}
              >
                <option value="public">Công khai trên FREVO</option>
                <option value="link">Chỉ người có liên kết</option>
                <option value="private">Riêng tư</option>
              </select>
            </div>
          </Box>

          <Typography
            sx={{
              fontSize: "11px",
              color: "#747773",
              lineHeight: 1.6,
              p: "12px 14px",
              bgcolor: "var(--peach, #fff0e9)",
              borderRadius: "9px",
            }}
          >
            Bản xem thử: tệp và thay đổi chỉ giữ trong phiên hiện tại, mất khi tải lại. Chế độ hiển thị chưa áp dụng quyền truy cập thật.
          </Typography>

          {error && (
            <Typography
              role="alert"
              sx={{ color: "error.main", fontSize: "13px" }}
            >
              {error}
            </Typography>
          )}
        </Box>

        <Box
          component="footer"
          sx={{
            flexShrink: 0,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "10px",
            p: { xs: "14px 16px 20px", sm: "18px 28px 23px" },
            borderTop: "1px solid var(--line, #e4e6e2)",
            bgcolor: "#fff",
            flexWrap: { xs: "wrap", sm: "nowrap" },
          }}
        >
          {work && (
            <MuiButton
              type="button"
              onClick={() => setConfirmDelete(true)}
              sx={{
                display: "inline-flex",
                gap: "6px",
                alignItems: "center",
                bgcolor: "transparent",
                color: "#b42318",
                fontSize: "12px",
                p: "8px 12px",
                borderRadius: "99px",
                textTransform: "none",
                "&:hover": {
                  bgcolor: "#fff0ed",
                  color: "#8d1c14",
                },
              }}
            >
              <Trash2 size={16} /> Xóa dự án
            </MuiButton>
          )}
          <Box
            sx={{
              display: "flex",
              gap: { xs: "8px", sm: "10px" },
              ml: "auto",
            }}
          >
            <MuiButton
              type="button"
              variant="outlined"
              onClick={onClose}
              sx={{
                minHeight: "42px",
                px: { xs: "12px", sm: "18px" },
                borderRadius: "999px",
                borderColor: "var(--line, #e4e6e2)",
                color: "#333631",
                fontSize: { xs: "12px", sm: "12px" },
                fontWeight: 800,
                textTransform: "none",
                "&:hover": {
                  borderColor: "#d5d7d2",
                  bgcolor: "#f7f8f6",
                },
              }}
            >
              Hủy
            </MuiButton>
            <MuiButton
              type="submit"
              variant="contained"
              disabled={reading}
              sx={{
                minHeight: "45px",
                px: { xs: "14px", sm: "20px" },
                borderRadius: "999px",
                bgcolor: "var(--orange, #f4490b)",
                color: "#1b1b19",
                fontSize: { xs: "12px", sm: "13px" },
                fontWeight: 900,
                textTransform: "none",
                boxShadow: "2px 3px 0 #242521",
                border: "2px solid #262724",
                gap: "7px",
                "&:hover": {
                  bgcolor: "#ff5b1c",
                  boxShadow: "2px 3px 0 #242521",
                },
              }}
            >
              <Check size={16} /> {work ? "Lưu thay đổi" : "Thêm dự án"}
            </MuiButton>
          </Box>
        </Box>
      </Box>

      {confirmDelete && (
        <Box
          role="group"
          aria-label="Xác nhận xóa dự án"
          sx={{
            p: "18px 28px",
            bgcolor: "var(--peach, #fff0e9)",
            borderTop: "1px solid var(--line, #e4e6e2)",
            fontSize: "13px",
            flexShrink: 0,
            "& p": { mb: "12px", overflowWrap: "anywhere" },
          }}
        >
          <p>Xóa “{work?.title}” khỏi bản xem thử?</p>
          <MuiButton
            variant="outlined"
            onClick={() => setConfirmDelete(false)}
            sx={{
              mr: "10px",
              minHeight: "36px",
              borderRadius: "999px",
              borderColor: "var(--line, #e4e6e2)",
              color: "#333631",
              textTransform: "none",
            }}
          >
            Giữ lại
          </MuiButton>
          <MuiButton
            onClick={() => {
              if (work) onDelete(work.id);
            }}
            sx={{
              bgcolor: "#b42318",
              color: "#fff",
              borderRadius: "999px",
              textTransform: "none",
              "&:hover": { bgcolor: "#8d1c14" },
            }}
          >
            Xóa dự án
          </MuiButton>
        </Box>
      )}
    </Dialog>
  );
}
