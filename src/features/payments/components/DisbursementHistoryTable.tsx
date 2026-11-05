import { Box, Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { ArrowUpRight, ReceiptText, ShieldCheck } from "lucide-react";
import type { PaymentSimulation } from "@/lib/types/marketplace.types";

interface DisbursementHistoryTableProps {
  payments: PaymentSimulation[];
}

export function DisbursementHistoryTable({ payments }: DisbursementHistoryTableProps) {
  return (
    <Paper elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: "16px", overflow: "hidden" }}>
      <Box className="flex flex-wrap items-center justify-between gap-2" sx={{ p: { xs: 2.5, md: 3 }, borderBottom: "1px solid", borderColor: "divider" }}>
        <Box>
          <Typography component="h2" className="flex items-center gap-2" sx={{ fontFamily: "h2.fontFamily", fontSize: 19, fontWeight: 800 }}>
            <ReceiptText size={20} className="text-primary" />
            Lịch sử giao dịch ký quỹ & giải ngân
          </Typography>
          <Typography sx={{ mt: 0.5, color: "text.secondary", fontSize: 12 }}>
            Nhật ký minh bạch các khoản nạp ký quỹ và giải ngân theo từng mốc bàn giao.
          </Typography>
        </Box>
        <Chip size="small" label={`${payments.length} giao dịch`} sx={{ bgcolor: "background.default", fontSize: 11, fontWeight: 600, border: "1px solid", borderColor: "divider" }} />
      </Box>

      {!payments.length ? (
        <Box sx={{ py: 6, px: 3, textAlign: "center" }}>
          <Box sx={{ width: 52, height: 52, mx: "auto", bgcolor: "background.default", color: "text.secondary", borderRadius: "50%", display: "grid", placeItems: "center", mb: 2 }}>
            <ReceiptText size={24} />
          </Box>
          <Typography sx={{ fontWeight: 700, fontSize: 15, color: "text.primary" }}>
            Chưa có giao dịch phát sinh
          </Typography>
          <Typography sx={{ fontSize: 12, color: "text.secondary", mt: 0.75, maxWidth: 380, mx: "auto", lineHeight: 1.7 }}>
            Các khoản nạp ký quỹ bảo đảm và giải ngân sau khi nghiệm thu mốc sẽ được ghi nhận chi tiết tại đây.
          </Typography>
        </Box>
      ) : (
        <>
          <TableContainer sx={{ display: { xs: "none", md: "block" } }}>
            <Table size="small" aria-label="Lịch sử giao dịch ký quỹ">
              <TableHead>
                <TableRow sx={{ bgcolor: "background.default" }}>
                  {["Mốc & Mã giao dịch", "Số tiền", "Thời gian", "Trạng thái"].map((label) => (
                    <TableCell key={label} sx={{ fontSize: 11, fontWeight: 700, color: "text.secondary", borderColor: "divider", py: 1.5 }}>
                      {label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.map((payment) => {
                  const isReleased = payment.status === "released_simulated";
                  return (
                    <TableRow key={payment.id} hover sx={{ "&:last-child td": { borderBottom: 0 } }}>
                      <TableCell sx={{ borderColor: "divider", py: 2 }}>
                        <Typography sx={{ fontSize: 13, fontWeight: 700, color: "text.primary" }}>
                          {payment.milestoneName}
                        </Typography>
                        <Typography sx={{ fontSize: 10, color: "text.secondary", mt: 0.5, fontFamily: "monospace" }}>
                          Mã GD: {payment.id}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ borderColor: "divider", fontWeight: 700, whiteSpace: "nowrap", fontSize: 13 }}>
                        {payment.milestoneValue}
                        <Typography sx={{ fontSize: 10, color: "text.secondary", mt: 0.5, fontWeight: 400 }}>
                          Phí FREVO: 0 đ
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ borderColor: "divider", fontSize: 11, whiteSpace: "nowrap", color: "text.secondary" }}>
                        {new Date(payment.releasedAt ?? payment.createdAt).toLocaleDateString("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                      <TableCell sx={{ borderColor: "divider" }}>
                        <Chip
                          size="small"
                          icon={isReleased ? <ArrowUpRight size={13} /> : <ShieldCheck size={13} />}
                          label={isReleased ? "Đã giải ngân" : "Đã nạp ký quỹ"}
                          sx={{
                            height: 24,
                            fontSize: 10.5,
                            fontWeight: 700,
                            bgcolor: isReleased ? "#ecfdf5" : "#fff0e9",
                            color: isReleased ? "#065f46" : "primary.dark",
                            border: "1px solid",
                            borderColor: isReleased ? "#a7f3d0" : "#ffd4c3",
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: { xs: "block", md: "none" } }}>
            {payments.map((payment) => {
              const isReleased = payment.status === "released_simulated";
              return (
                <Box key={payment.id} sx={{ p: 2.25, borderBottom: "1px solid", borderColor: "divider" }}>
                  <Box className="flex flex-wrap items-start justify-between gap-2">
                    <Typography sx={{ fontSize: 13, fontWeight: 700, color: "text.primary" }}>
                      {payment.milestoneName}
                    </Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 800, color: "primary.dark" }}>
                      {payment.milestoneValue}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontSize: 10, color: "text.secondary", mt: 0.5, fontFamily: "monospace" }}>
                    Mã GD: {payment.id}
                  </Typography>
                  <Box className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    <Typography sx={{ fontSize: 11, color: "text.secondary" }}>
                      {new Date(payment.releasedAt ?? payment.createdAt).toLocaleDateString("vi-VN")}
                    </Typography>
                    <Chip
                      size="small"
                      icon={isReleased ? <ArrowUpRight size={12} /> : <ShieldCheck size={12} />}
                      label={isReleased ? "Đã giải ngân" : "Đã nạp ký quỹ"}
                      sx={{
                        fontSize: 10,
                        fontWeight: 700,
                        height: 24,
                        bgcolor: isReleased ? "#ecfdf5" : "#fff0e9",
                        color: isReleased ? "#065f46" : "primary.dark",
                        border: "1px solid",
                        borderColor: isReleased ? "#a7f3d0" : "#ffd4c3",
                      }}
                    />
                  </Box>
                </Box>
              );
            })}
          </Box>
        </>
      )}
    </Paper>
  );
}
