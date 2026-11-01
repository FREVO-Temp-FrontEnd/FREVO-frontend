import { Box, Button, Chip, LinearProgress, Typography } from "@mui/material";
import { Check, FileText } from "lucide-react";
import type { BriefFields } from "@/features/business/hooks/useProjectBriefForm";

interface BriefFormSummaryProps {
  fields: BriefFields;
  sections: { id: string; title: string; complete: boolean }[];
  isPreview: boolean;
}

export function BriefFormSummary({ fields, sections, isPreview }: BriefFormSummaryProps) {
  const completed = sections.filter((section) => section.complete).length;

  return (
    <aside aria-label="Tóm tắt brief" className="min-w-0 space-y-4 xl:sticky xl:top-5">
      <Box
        sx={{
          p: 3,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: "16px",
          bgcolor: "background.paper",
          boxShadow: "0 1px 3px rgba(16, 24, 40, 0.06), 0 2px 6px rgba(16, 24, 40, 0.04)",
        }}
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <Typography
            component="h2"
            sx={{ fontFamily: "Archivo, Arial, sans-serif", fontSize: 16, fontWeight: 700 }}
          >
            Brief của bạn
          </Typography>
          <Chip
            size="small"
            label={isPreview ? "Xem trước" : "Đang soạn"}
            sx={{ bgcolor: "#fff0e9", color: "primary.dark", fontSize: 11, fontWeight: 700 }}
          />
        </div>
        <Typography sx={{ fontSize: 15, fontWeight: 700, overflowWrap: "anywhere", lineHeight: 1.4 }}>
          {fields.title.trim() || "Dự án chưa đặt tên"}
        </Typography>
        <Typography sx={{ mt: 0.75, fontSize: 12, color: "text.secondary" }}>
          {fields.category}
        </Typography>

        <dl className="mb-0 mt-5 space-y-3 border-t border-[#e4e6e2] pt-4 text-sm">
          <div className="rounded-xl border border-[#eef2f6] bg-[#f8fafc] p-3">
            <dt className="text-xs font-medium text-[#747773]">Ngân sách dự kiến</dt>
            <dd className="m-0 mt-1 text-[15px] font-bold text-[#bd3d14]">
              {fields.budgetMin && fields.budgetMax
                ? `${Number(fields.budgetMin).toLocaleString("vi-VN")}–${Number(fields.budgetMax).toLocaleString("vi-VN")} đ`
                : "Chưa thiết lập"}
            </dd>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="rounded-xl border border-[#eef2f6] bg-[#f8fafc] p-2.5">
              <dt className="text-xs font-medium text-[#747773]">Thời lượng</dt>
              <dd className="m-0 mt-1 text-xs font-semibold text-[#20201f]">{fields.duration}</dd>
            </div>
            <div className="rounded-xl border border-[#eef2f6] bg-[#f8fafc] p-2.5">
              <dt className="text-xs font-medium text-[#747773]">Bàn giao</dt>
              <dd className="m-0 mt-1 text-xs font-semibold text-[#20201f]">
                {fields.deliverables.filter((item) => item.trim()).length} hạng mục
              </dd>
            </div>
          </div>
          <div className="rounded-xl border border-[#eef2f6] bg-[#f8fafc] p-2.5">
            <dt className="text-xs font-medium text-[#747773]">Bên thực hiện</dt>
            <dd className="m-0 mt-1 text-xs font-semibold text-[#20201f]">
              {fields.preference === "both"
                ? "Cá nhân hoặc Team"
                : fields.preference === "team"
                ? "Team sáng tạo"
                : "Freelancer cá nhân"}
            </dd>
          </div>
        </dl>
      </Box>

      {!isPreview && (
        <Box
          sx={{
            p: 3,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: "16px",
            bgcolor: "background.paper",
            boxShadow: "0 1px 3px rgba(16, 24, 40, 0.06), 0 2px 6px rgba(16, 24, 40, 0.04)",
          }}
        >
          <div className="mb-3 flex justify-between text-xs">
            <span className="font-semibold text-[#20201f]">Hoàn thiện nội dung</span>
            <span className="font-medium text-[#747773]">
              {completed}/{sections.length} mục
            </span>
          </div>
          <LinearProgress
            aria-label="Mức độ hoàn thiện brief"
            variant="determinate"
            value={(completed / sections.length) * 100}
            sx={{ height: 6, borderRadius: 999, bgcolor: "#e2e8f0", mb: 2 }}
          />
          <nav aria-label="Các phần của brief" className="space-y-1">
            {sections.map((section, index) => (
              <Button
                component="a"
                href={`#${section.id}`}
                key={section.id}
                fullWidth
                sx={{
                  justifyContent: "flex-start",
                  gap: 1.25,
                  px: 1,
                  py: 1,
                  color: "text.primary",
                  fontSize: 13,
                  borderRadius: 2,
                  "&:hover": { bgcolor: "#f8fafc" },
                }}
              >
                <Box
                  component="span"
                  sx={{
                    display: "grid",
                    placeItems: "center",
                    width: 24,
                    height: 24,
                    flexShrink: 0,
                    borderRadius: "50%",
                    bgcolor: section.complete ? "#e8f7ef" : "#f1f5f9",
                    color: section.complete ? "#16805b" : "#64748b",
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  {section.complete ? <Check size={13} aria-hidden="true" /> : index + 1}
                </Box>
                <span className="truncate">{section.title}</span>
                <span className="sr-only">
                  {section.complete ? ": Đã đủ thông tin" : ": Chưa đủ thông tin"}
                </span>
              </Button>
            ))}
          </nav>
        </Box>
      )}

      <div className="flex items-start gap-2.5 rounded-xl border border-[#e2e8f0] bg-white p-3 text-xs leading-5 text-[#667085] shadow-xs">
        <FileText size={16} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
        <p className="m-0">
          Bạn có thể lưu nháp bất cứ lúc nào. Dự án chỉ hiển thị khi được công bố.
        </p>
      </div>
    </aside>
  );
}
