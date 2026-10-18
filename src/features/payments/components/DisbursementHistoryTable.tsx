import React from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Box,
} from "@mui/material";
import { CheckCircle2 } from "lucide-react";
import type { PaymentSimulation } from "@/lib/types/marketplace.types";

interface DisbursementHistoryTableProps {
  payments: PaymentSimulation[];
}

export const DisbursementHistoryTable: React.FC<DisbursementHistoryTableProps> = ({
  payments,
}) => {
  return (
    <Box sx={{ my: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1e293b" }}>
            Lịch sử giải ngân mô phỏng (PAY-003 / FR-058, FR-060)
          </Typography>
          <Typography variant="caption" sx={{ color: "#64748b" }}>
            Chứng từ đối soát mô phỏng phục vụ mục đích kiểm thử luồng sản phẩm (FR-062)
          </Typography>
        </Box>
        <Chip
          label="MÔ PHỎNG / SIMULATED DISBURSEMENTS"
          size="small"
          sx={{ bgcolor: "#ffedd5", color: "#c2410c", fontWeight: 700, fontSize: "10px" }}
        />
      </Box>

      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: "12px" }}>
        <Table size="small">
          <TableHead sx={{ bgcolor: "#f8fafc" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, fontSize: "12px" }}>Mã GD mô phỏng</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: "12px" }}>Mốc công việc</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: "12px" }}>Giá trị mốc</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: "12px" }}>Phí nền tảng (DEC-04)</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: "12px" }}>Thời gian giải ngân</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: "12px" }}>Trạng thái</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: "center", py: 4, color: "#94a3b8" }}>
                  Chưa có giao dịch giải ngân nào. Khi Business nghiệm thu mốc, chứng từ mô phỏng sẽ hiển thị tại đây.
                </TableCell>
              </TableRow>
            ) : (
              payments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell sx={{ fontWeight: 600, fontSize: "12px", color: "#64748b" }}>
                    {p.id}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, fontSize: "13px" }}>
                    {p.milestoneName}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#f4490b", fontSize: "13px" }}>
                    {p.milestoneValue}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={p.platformFeeLabel}
                      size="small"
                      sx={{ bgcolor: "#f1f5f9", color: "#475569", fontSize: "10px", height: 20 }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontSize: "12px", color: "#64748b" }}>
                    {new Date(p.releasedAt || p.createdAt).toLocaleString("vi-VN")}
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={<CheckCircle2 size={12} />}
                      label="Giải ngân mô phỏng"
                      size="small"
                      sx={{
                        bgcolor: "#dcfce7",
                        color: "#166534",
                        fontWeight: 700,
                        fontSize: "10px",
                        height: 20,
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
