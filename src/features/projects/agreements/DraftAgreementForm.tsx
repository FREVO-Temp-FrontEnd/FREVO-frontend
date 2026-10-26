import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  IconButton,
  Alert,
  Divider,
} from "@mui/material";
import { Plus, Trash2, ShieldAlert, Clock, ArrowRight } from "lucide-react";
import { formatMoneyText, parseMoneyText } from "@/lib/utils/money";
import type {
  AgreementProposal,
  Milestone,
  ProjectBrief,
  TalentProfile,
} from "@/lib/types/marketplace.types";

interface DraftAgreementFormProps {
  project: ProjectBrief;
  talent: TalentProfile;
  existingAgreement?: AgreementProposal;
  onSubmit: (proposal: {
    scope: string;
    deliverables: string;
    deadline: string;
    budget: string;
    budgetValue?: number;
    reference: string;
    milestones: Milestone[];
  }) => void;
  onCancel?: () => void;
}

export const DraftAgreementForm: React.FC<DraftAgreementFormProps> = ({
  project,
  talent,
  existingAgreement,
  onSubmit,
  onCancel,
}) => {
  const [scope, setScope] = useState(existingAgreement?.scope || project.description);
  const [deliverables, setDeliverables] = useState(
    existingAgreement?.deliverables || project.deliverables.join("\n")
  );
  const [deadline, setDeadline] = useState(existingAgreement?.deadline || project.deadline);
  const [budget, setBudget] = useState(existingAgreement?.budget || project.budget);

  const initialMilestones: Milestone[] = existingAgreement?.milestones?.length
    ? existingAgreement.milestones
    : [
        {
          id: `ms-1-${Date.now()}`,
          name: "Mốc 1 · Định hướng & Nghiên cứu",
          deliverable: "Tài liệu moodboard, phân tích yêu cầu và định hướng thiết kế sơ bộ.",
          deadline: project.deadline || "10/11/2026",
          amount: "8 triệu",
          amountValue: 8000000,
          status: "upcoming",
          revisionAllowance: { allowed: 2, used: 0 }, // Mutually agreed allowance per DEC-03
        },
        {
          id: `ms-2-${Date.now()}`,
          name: "Mốc 2 · Hoàn thiện & Bàn giao",
          deliverable: "Thiết kế hoàn chỉnh, bàn giao tài liệu và tệp gốc sử dụng.",
          deadline: project.deadline || "30/11/2026",
          amount: "16 triệu",
          amountValue: 16000000,
          status: "upcoming",
          revisionAllowance: { allowed: 2, used: 0 },
        },
      ];

  const [milestones, setMilestones] = useState<Milestone[]>(initialMilestones);
  const [error, setError] = useState("");

  const handleAddMilestone = () => {
    const nextIndex = milestones.length + 1;
    const newMilestone: Milestone = {
      id: `ms-${nextIndex}-${Date.now()}`,
      name: `Mốc ${nextIndex} · Bàn giao`,
      deliverable: "",
      deadline: deadline || "30/11/2026",
      amount: "",
      status: "upcoming",
      revisionAllowance: { allowed: 2, used: 0 },
    };
    setMilestones([...milestones, newMilestone]);
  };

  const handleRemoveMilestone = (id: string) => {
    if (milestones.length <= 1) {
      setError("Dự án cần có ít nhất 1 mốc công việc bàn giao.");
      return;
    }
    setMilestones(milestones.filter((m) => m.id !== id));
  };

  const handleUpdateMilestone = (
    id: string,
    field: keyof Milestone | "revisionAllowed",
    value: unknown
  ) => {
    setMilestones(
      milestones.map((m) => {
        if (m.id === id) {
          if (field === "revisionAllowed") {
            return {
              ...m,
              revisionAllowance: {
                ...m.revisionAllowance,
                allowed: value as number | "custom",
              },
            };
          }
          if (field === "amount") {
            const amount = formatMoneyText(String(value));
            return { ...m, amount, amountValue: parseMoneyText(amount) };
          }
          return { ...m, [field]: value };
        }
        return m;
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scope.trim() || !deliverables.trim() || !deadline.trim() || !budget.trim()) {
      setError("Vui lòng điền đầy đủ các thông tin phạm vi, bàn giao, hạn chót và ngân sách.");
      return;
    }

    const invalidMilestones = milestones.some(
      (m) => !m.name.trim() || !m.deliverable.trim() || !m.deadline.trim() || !m.amount.trim()
    );
    if (invalidMilestones) {
      setError("Vui lòng nhập đầy đủ tên, sản phẩm, hạn chót và chi phí cho từng mốc công việc.");
      return;
    }

    setError("");
    const reference = existingAgreement?.reference || `FV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

    onSubmit({
      scope: scope.trim(),
      deliverables: deliverables.trim(),
      deadline: deadline.trim(),
      budget: budget.trim(),
      budgetValue: parseMoneyText(budget),
      reference,
      milestones,
    });
  };

  return (
    <Paper
      elevation={0}
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: { xs: 2.5, md: 3.5 },
        borderRadius: "16px",
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 700,
            color: "primary.dark",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          {existingAgreement ? `Điều chỉnh thỏa thuận · Phiên bản ${existingAgreement.version + 1}` : "Soạn thảo thỏa thuận hợp tác"}
        </Typography>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            fontFamily: "h2.fontFamily",
            color: "text.primary",
            mt: 0.5,
          }}
        >
          Đề xuất điều khoản hợp tác với {talent.name}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
          Dự án: <strong>{project.title}</strong> · Đối tác: <strong>{talent.name}</strong> ({talent.kind})
        </Typography>
      </Box>

      {/* Expiration Note & Version Preservation Guarantee */}
      <Box
        sx={{
          mb: 3,
          p: 2,
          borderRadius: "12px",
          bgcolor: "#fff0e9",
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Clock size={18} color="#bd3d14" />
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "primary.dark" }}>
            Thời hạn phản hồi: 3 ngày
          </Typography>
        </Box>
        <Typography variant="caption" sx={{ color: "text.secondary", lineHeight: 1.7 }}>
          Sau khi gửi, đối tác có tối đa <strong>3 ngày</strong> để xác nhận hoặc yêu cầu chỉnh sửa. Nếu đề xuất hết hạn mà không được xác nhận, hai bên có thể gửi lại đề xuất mới.
        </Typography>
        {existingAgreement?.isEffective && (
          <Typography variant="caption" sx={{ color: "text.primary", mt: 0.5, lineHeight: 1.7 }}>
            <strong>Phiên bản đang có hiệu lực:</strong> Thỏa thuận phiên bản {existingAgreement.version} vẫn được áp dụng cho đến khi đề xuất mới được cả hai bên xác nhận.
          </Typography>
        )}
      </Box>

      {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: "12px" }}>
          {error}
        </Alert>
      )}

      {/* Main Fields */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, mb: 4 }}>
        <TextField
          fullWidth
          label="Phạm vi công việc *"
          multiline
          rows={3}
          value={scope}
          onChange={(e) => setScope(e.target.value)}
          placeholder="Mô tả cụ thể mục tiêu, phạm vi và ranh giới công việc cần triển khai..."
        />

        <TextField
          fullWidth
          label="Sản phẩm bàn giao *"
          multiline
          rows={3}
          value={deliverables}
          onChange={(e) => setDeliverables(e.target.value)}
          placeholder="Liệt kê danh sách các sản phẩm, file nguồn, định dạng bàn giao cuối cùng..."
        />

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
          <TextField
            fullWidth
            label="Thời hạn hoàn thành *"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            placeholder="Ví dụ: 30/11/2026"
          />
          <TextField
            fullWidth
            label="Tổng ngân sách thống nhất *"
            slotProps={{ htmlInput: { inputMode: "numeric" } }}
            value={formatMoneyText(budget)}
            onChange={(e) => setBudget(formatMoneyText(e.target.value))}
            placeholder="Ví dụ: 24.000.000"
          />
        </Box>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Milestones Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Box>
            <Typography variant="subtitle1" sx={{ fontFamily: "h3.fontFamily", fontWeight: 700, color: "text.primary" }}>
              Kế hoạch mốc công việc & số lượt chỉnh sửa
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Thỏa thuận số lượt chỉnh sửa phù hợp theo từng mốc. FREVO không áp đặt cố định 2 lượt.
            </Typography>
          </Box>
          <Button
            size="small"
            onClick={handleAddMilestone}
            startIcon={<Plus size={16} />}
            sx={{ color: "primary.dark", fontWeight: 600, textTransform: "none" }}
          >
            Thêm mốc
          </Button>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {milestones.map((milestone, index) => (
            <Paper
              key={milestone.id}
              variant="outlined"
              sx={{ p: 2.5, borderRadius: "12px", bgcolor: "background.default", borderColor: "divider", position: "relative" }}
            >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
                <Typography variant="subtitle2" sx={{ fontFamily: "h3.fontFamily", fontWeight: 700, color: "text.primary" }}>
                  Mốc {index + 1}
                </Typography>
                {milestones.length > 1 && (
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveMilestone(milestone.id)}
                    aria-label={`Xóa mốc ${index + 1}`}
                    sx={{ color: "text.secondary", "&:hover": { color: "error.main" } }}
                  >
                    <Trash2 size={16} />
                  </IconButton>
                )}
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Tên mốc *"
                  value={milestone.name}
                  onChange={(e) => handleUpdateMilestone(milestone.id, "name", e.target.value)}
                />
                <TextField
                  fullWidth
                  size="small"
                  multiline
                  rows={2}
                  label="Sản phẩm bàn giao mốc này *"
                  value={milestone.deliverable}
                  onChange={(e) =>
                    handleUpdateMilestone(milestone.id, "deliverable", e.target.value)
                  }
                />
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" }, gap: 1.5 }}>
                  <TextField
                    size="small"
                    label="Hạn bàn giao *"
                    value={milestone.deadline}
                    onChange={(e) =>
                      handleUpdateMilestone(milestone.id, "deadline", e.target.value)
                    }
                  />
                  <TextField
                    size="small"
                    label="Chi phí mốc *"
                    slotProps={{ htmlInput: { inputMode: "numeric" } }}
                    value={formatMoneyText(milestone.amount)}
                    onChange={(e) =>
                      handleUpdateMilestone(milestone.id, "amount", e.target.value)
                    }
                  />
                  <TextField
                    size="small"
                    type="number"
                    label="Số lượt sửa đổi"
                    value={typeof milestone.revisionAllowance?.allowed === "number" ? milestone.revisionAllowance.allowed : 2}
                    onChange={(e) =>
                      handleUpdateMilestone(
                        milestone.id,
                        "revisionAllowed",
                        parseInt(e.target.value, 10) || 0
                      )
                    }
                    helperText="Thỏa thuận giữa 2 bên"
                  />
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      </Box>

      {/* Mandatory Legal Disclaimer per FR-047, BR-022 */}
      <Box
        sx={{
          mb: 4,
          p: 2,
          borderRadius: "12px",
          bgcolor: "background.default",
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <ShieldAlert size={20} color="#747773" style={{ flexShrink: 0 }} />
        <Typography variant="caption" sx={{ color: "text.secondary", lineHeight: 1.7 }}>
          Bản tóm tắt thỏa thuận hợp tác ghi nhận phạm vi công việc và các mốc bàn giao đã được hai bên thống nhất; đây không mặc định là hợp đồng điện tử có chứng thực.
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-end", gap: 2 }}>
        {onCancel && (
          <Button variant="outlined" onClick={onCancel} sx={{ textTransform: "none" }}>
            Hủy bỏ
          </Button>
        )}
        <Button
          type="submit"
          variant="contained"
          endIcon={<ArrowRight size={18} />}
          sx={{
            bgcolor: "primary.dark",
            "&:hover": { bgcolor: "primary.main" },
            px: 3,
            py: 1.2,
            borderRadius: "999px",
            textTransform: "none",
            fontWeight: 700,
          }}
        >
          {existingAgreement ? "Gửi đề xuất điều chỉnh" : "Gửi đề xuất thỏa thuận"}
        </Button>
      </Box>
    </Paper>
  );
};
