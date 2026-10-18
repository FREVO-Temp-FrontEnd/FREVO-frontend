import React from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  ShieldAlert,
  Edit3,
} from "lucide-react";
import type {
  AgreementProposal,
  ProjectBrief,
  TalentProfile,
} from "@/lib/types/marketplace.types";

interface AgreementReviewCardProps {
  agreement: AgreementProposal;
  project: ProjectBrief;
  talent: TalentProfile;
  isBusiness?: boolean;
  onConfirm: () => void;
  onRequestRevision: () => void;
}

export const AgreementReviewCard: React.FC<AgreementReviewCardProps> = ({
  agreement,
  project,
  talent,
  onConfirm,
  onRequestRevision,
}) => {
  const expiresAt = new Date(agreement.expiresAt);
  const now = new Date();
  const msRemaining = expiresAt.getTime() - now.getTime();
  const hoursRemaining = Math.max(0, Math.floor(msRemaining / (1000 * 60 * 60)));
  const isExpired = msRemaining <= 0 && agreement.status === "pending";

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, md: 4 },
        borderRadius: "16px",
        border: "1px solid #e2e8f0",
        bgcolor: "#ffffff",
      }}
    >
      {/* Top Banner */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
            <Typography
              variant="caption"
              sx={{ fontWeight: 700, color: "#64748b", letterSpacing: "0.05em" }}
            >
              MÃ THỎA THUẬN: {agreement.reference}
            </Typography>
            <Chip
              label={`Phiên bản ${agreement.version}`}
              size="small"
              sx={{ bgcolor: "#f1f5f9", fontWeight: 600, fontSize: "11px", height: 22 }}
            />
            {agreement.isEffective && (
              <Chip
                label="Đang có hiệu lực"
                size="small"
                sx={{ bgcolor: "#ecfdf5", color: "#059669", fontWeight: 700, fontSize: "11px", height: 22 }}
              />
            )}
          </Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              fontFamily: "Space Grotesk, sans-serif",
              color: "#1e293b",
            }}
          >
            Thỏa thuận hợp tác dự án
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b" }}>
            {project.title} · Giữa <strong>{project.company}</strong> và <strong>{talent.name}</strong>
          </Typography>
        </Box>

        <Box>
          {agreement.status === "confirmed" ? (
            <Chip
              icon={<CheckCircle2 size={16} />}
              label="Hai bên đã xác nhận"
              sx={{ bgcolor: "#dcfce7", color: "#166534", fontWeight: 700, px: 1 }}
            />
          ) : agreement.status === "rejected" ? (
            <Chip
              label="Đã từ chối"
              sx={{ bgcolor: "#fee2e2", color: "#991b1b", fontWeight: 700, px: 1 }}
            />
          ) : isExpired ? (
            <Chip
              icon={<AlertTriangle size={16} />}
              label="Đã hết hạn 3 ngày"
              sx={{ bgcolor: "#fef3c7", color: "#92400e", fontWeight: 700, px: 1 }}
            />
          ) : (
            <Chip
              icon={<Clock size={16} />}
              label={`Chờ xác nhận · Còn ${hoursRemaining} giờ`}
              sx={{ bgcolor: "#ffedd5", color: "#c2410c", fontWeight: 700, px: 1 }}
            />
          )}
        </Box>
      </Box>

      {/* 3-Day Countdown Notice Banner */}
      {agreement.status === "pending" && !isExpired && (
        <Box
          sx={{
            mb: 3,
            p: 2,
            borderRadius: "10px",
            bgcolor: "#fffaf7",
            border: "1px solid #fed7aa",
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Clock size={20} color="#f4490b" />
          <Typography variant="body2" sx={{ color: "#9a3412" }}>
            Đề xuất hết hạn sau <strong>3 ngày</strong> kể từ khi gửi (theo quy tắc <strong>FR-032, BR-024</strong>). Còn lại xấp xỉ <strong>{hoursRemaining} giờ</strong> để phản hồi.
          </Typography>
        </Box>
      )}

      {/* Details Grid */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, mb: 4 }}>
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#1e293b", mb: 0.5 }}>
            01. Phạm vi công việc thống nhất
          </Typography>
          <Typography variant="body2" sx={{ color: "#334155", lineHeight: 1.6 }}>
            {agreement.scope}
          </Typography>
        </Box>

        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#1e293b", mb: 0.5 }}>
            02. Sản phẩm bàn giao cụ thể
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "#334155", lineHeight: 1.6, whiteSpace: "pre-wrap" }}
          >
            {agreement.deliverables}
          </Typography>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
          <Box sx={{ p: 2, bgcolor: "#f8fafc", borderRadius: "8px" }}>
            <Typography variant="caption" sx={{ color: "#64748b" }}>
              Thời hạn hoàn thành
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1e293b" }}>
              {agreement.deadline}
            </Typography>
          </Box>
          <Box sx={{ p: 2, bgcolor: "#f8fafc", borderRadius: "8px" }}>
            <Typography variant="caption" sx={{ color: "#64748b" }}>
              Tổng ngân sách thống nhất
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#f4490b" }}>
              {agreement.budget}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Milestones Table */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#1e293b", mb: 1.5 }}>
          03. Kế hoạch mốc bàn giao & Số lượt chỉnh sửa (DEC-03)
        </Typography>

        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: "8px" }}>
          <Table size="small">
            <TableHead sx={{ bgcolor: "#f8fafc" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, fontSize: "12px" }}>Mốc công việc</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "12px" }}>Sản phẩm bàn giao</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "12px" }}>Hạn chót</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "12px" }}>Chi phí</TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: "12px" }}>Số lượt sửa</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {agreement.milestones.map((m, idx) => (
                <TableRow key={m.id}>
                  <TableCell sx={{ fontWeight: 600, fontSize: "13px" }}>
                    {idx + 1}. {m.name}
                  </TableCell>
                  <TableCell sx={{ fontSize: "13px", color: "#475569" }}>
                    {m.deliverable}
                  </TableCell>
                  <TableCell sx={{ fontSize: "13px", whiteSpace: "nowrap" }}>
                    {m.deadline}
                  </TableCell>
                  <TableCell sx={{ fontSize: "13px", fontWeight: 600, color: "#f4490b" }}>
                    {m.amount}
                  </TableCell>
                  <TableCell sx={{ fontSize: "13px" }}>
                    {m.revisionAllowance.allowed} lượt
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Legal Disclaimer */}
      <Box
        sx={{
          mb: 4,
          p: 2,
          borderRadius: "8px",
          bgcolor: "#f1f5f9",
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <ShieldAlert size={20} color="#475569" style={{ flexShrink: 0 }} />
        <Typography variant="caption" sx={{ color: "#475569", lineHeight: 1.5 }}>
          <strong>Lưu ý pháp lý (FR-047, BR-022):</strong> Bản tóm tắt thỏa thuận hợp tác ghi nhận phạm vi đã thống nhất, không mặc định là hợp đồng điện tử có chứng thực.
        </Typography>
      </Box>

      {/* Action Buttons */}
      {agreement.status === "pending" && !isExpired && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 2,
            pt: 2,
            borderTop: "1px solid #e2e8f0",
          }}
        >
          <Button
            variant="outlined"
            onClick={onRequestRevision}
            startIcon={<Edit3 size={16} />}
            sx={{ textTransform: "none", color: "#475569", borderColor: "#cbd5e1" }}
          >
            Yêu cầu điều chỉnh
          </Button>

          <Button
            variant="contained"
            onClick={onConfirm}
            startIcon={<CheckCircle2 size={18} />}
            sx={{
              bgcolor: "#f4490b",
              "&:hover": { bgcolor: "#bd3d14" },
              px: 3,
              py: 1,
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 700,
            }}
          >
            Xác nhận thỏa thuận
          </Button>
        </Box>
      )}
    </Paper>
  );
};
