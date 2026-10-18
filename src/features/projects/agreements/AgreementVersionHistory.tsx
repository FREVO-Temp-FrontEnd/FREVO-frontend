import React from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import { CheckCircle2, Clock, XCircle, History, ShieldCheck } from "lucide-react";
import type { AgreementProposal } from "@/lib/types/marketplace.types";

interface AgreementVersionHistoryProps {
  agreements: AgreementProposal[];
  selectedVersion: number;
  onSelectVersion: (version: number) => void;
}

export const AgreementVersionHistory: React.FC<AgreementVersionHistoryProps> = ({
  agreements,
  selectedVersion,
  onSelectVersion,
}) => {
  const sorted = [...agreements].sort((a, b) => b.version - a.version);
  const effective = agreements.find((a) => a.isEffective);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: "16px",
        border: "1px solid #e2e8f0",
        bgcolor: "#ffffff",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <History size={18} color="#f4490b" />
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#1e293b" }}>
          Lịch sử phiên bản thỏa thuận (FR-048)
        </Typography>
      </Box>

      <Typography variant="caption" sx={{ color: "#64748b", display: "block", mb: 2 }}>
        Theo quy tắc <strong>FR-048</strong>, phiên bản đang có hiệu lực vẫn duy trì ràng buộc nguyên vẹn trong khi hai bên đề xuất và xem xét bản điều chỉnh mới.
      </Typography>

      <List disablePadding sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {sorted.map((item) => {
          const isSelected = item.version === selectedVersion;
          return (
            <ListItem
              key={item.id}
              onClick={() => onSelectVersion(item.version)}
              sx={{
                p: 1.5,
                borderRadius: "8px",
                border: isSelected ? "2px solid #f4490b" : "1px solid #e2e8f0",
                bgcolor: isSelected ? "#fffaf7" : "#ffffff",
                cursor: "pointer",
                transition: "all 0.15s ease",
                "&:hover": { bgcolor: "#f8fafc" },
              }}
            >
              <ListItemIcon sx={{ minWidth: 32 }}>
                {item.status === "confirmed" ? (
                  <CheckCircle2 size={18} color="#059669" />
                ) : item.status === "pending" ? (
                  <Clock size={18} color="#ea580c" />
                ) : (
                  <XCircle size={18} color="#dc2626" />
                )}
              </ListItemIcon>

              <ListItemText
                primary={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: "#1e293b" }}>
                      Phiên bản {item.version}
                    </Typography>
                    {item.isEffective && (
                      <Chip
                        label="Đang có hiệu lực"
                        size="small"
                        sx={{
                          bgcolor: "#ecfdf5",
                          color: "#059669",
                          fontWeight: 700,
                          fontSize: "10px",
                          height: 20,
                        }}
                      />
                    )}
                    <Chip
                      label={
                        item.status === "confirmed"
                          ? "Đã xác nhận"
                          : item.status === "pending"
                          ? "Đang đề xuất"
                          : "Đã từ chối"
                      }
                      size="small"
                      sx={{ fontSize: "10px", height: 20 }}
                    />
                  </Box>
                }
                secondary={
                  <Typography variant="caption" sx={{ color: "#64748b" }}>
                    Ngân sách: {item.budget} · Hạn chót: {item.deadline}
                  </Typography>
                }
              />
            </ListItem>
          );
        })}
      </List>

      {effective && (
        <Box
          sx={{
            mt: 2.5,
            p: 1.5,
            borderRadius: "6px",
            bgcolor: "#f0fdf4",
            border: "1px solid #bbf7d0",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <ShieldCheck size={16} color="#16a34a" style={{ flexShrink: 0 }} />
          <Typography variant="caption" sx={{ color: "#166534" }}>
            <strong>Bảo vệ quyền lợi:</strong> Phiên bản {effective.version} bảo đảm dự án không bị gián đoạn hay mất hiệu lực trong khi thỏa thuận phiên bản kế tiếp.
          </Typography>
        </Box>
      )}
    </Paper>
  );
};
