import { useState } from "react";
import { Button } from "@/app/shared/components/ui/button";
import { Input } from "@/app/shared/components/ui/input";
import { Textarea } from "@/app/shared/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/app/shared/components/ui/dialog";
import { X } from "lucide-react";

export type EditRequest = {
  title: string;
  fields: {
    name: string;
    label: string;
    value: string;
    type?: "textarea" | "number" | "month";
    maxLength?: number;
  }[];
  onSave: (values: Record<string, string>) => void;
};

export function EditProfileDialog({
  request,
  onClose,
  onSaved,
}: {
  request: EditRequest;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [error, setError] = useState("");

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const values = Object.fromEntries(
      request.fields.map((field) => [
        field.name,
        String(data.get(field.name) ?? "").trim(),
      ])
    );
    const invalid = request.fields.find(
      (field) =>
        !values[field.name] ||
        ((field.name === "tags" || field.name === "skills") &&
          !values[field.name].split(",").some((tag) => tag.trim()))
    );
    if (invalid) {
      setError(`Vui lòng nhập ${invalid.label.toLocaleLowerCase("vi-VN")}.`);
      (
        event.currentTarget.elements.namedItem(invalid.name) as HTMLElement | null
      )?.focus();
      return;
    }
    request.onSave(values);
    onSaved();
    onClose();
  }

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        className="profile-drawer profile-details-drawer"
        showCloseButton={false}
      >
        <header className="profile-drawer-header">
          <div>
            <span className="profile-studio-label">FREVO Profile Studio</span>
            <DialogTitle>
              {request.title}
              <span>.</span>
            </DialogTitle>
            <DialogDescription>
              Cập nhật thông tin để hồ sơ thể hiện đúng bạn.
            </DialogDescription>
          </div>
          <Button
            className="profile-dialog-close"
            variant="ghost"
            size="icon"
            aria-label="Đóng chỉnh sửa"
            onClick={onClose}
          >
            <X />
          </Button>
        </header>
        <form className="portfolio-editor" onSubmit={submit}>
          <div className="profile-drawer-body profile-form">
            {request.fields.map((field) => (
              <div className="profile-edit-field" key={field.name}>
                <label htmlFor={`edit-${field.name}`}>{field.label}</label>
                {field.type === "textarea" ? (
                  <Textarea
                    id={`edit-${field.name}`}
                    name={field.name}
                    defaultValue={field.value}
                    required
                    maxLength={1500}
                  />
                ) : (
                  <Input
                    id={`edit-${field.name}`}
                    name={field.name}
                    defaultValue={field.value}
                    required
                    type={field.type ?? "text"}
                    maxLength={field.maxLength ?? 160}
                    min={
                      field.type === "number"
                        ? 0
                        : field.type === "month"
                        ? "1900-01"
                        : undefined
                    }
                    max={
                      field.type === "number"
                        ? 1000000000000
                        : field.type === "month"
                        ? "9999-12"
                        : undefined
                    }
                    step={field.type === "number" ? 1 : undefined}
                  />
                )}
              </div>
            ))}
            {error && <p role="alert" className="submit-error">{error}</p>}
            <p className="studio-demo">
              Thay đổi chỉ áp dụng cho bản xem thử và sẽ mất khi rời trang hoặc tải lại.
            </p>
          </div>
          <footer className="profile-drawer-footer">
            <div>
              <Button type="button" className="secondary-button" onClick={onClose}>
                Hủy
              </Button>
              <Button type="submit" className="primary-button">
                Lưu thay đổi
              </Button>
            </div>
          </footer>
        </form>
      </DialogContent>
    </Dialog>
  );
}
