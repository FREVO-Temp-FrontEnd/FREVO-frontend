import { Box, Button, Paper, Typography } from "@mui/material";
import { MessageSquareText, ShieldAlert } from "lucide-react";
import { Link } from "react-router";

interface DisputeConceptCardProps {
  chatPath?: string;
}

export function DisputeConceptCard({ chatPath }: DisputeConceptCardProps) {
  return (
    <Paper elevation={0} sx={{ p: 2.75, borderRadius: "16px", border: "1px solid", borderColor: "divider" }}>
      <Typography component="h2" className="flex items-center gap-2" sx={{ fontFamily: "h3.fontFamily", fontSize: 15, fontWeight: 700 }}>
        <ShieldAlert size={18} className="text-primary" />
        Bảo vệ quyền lợi & Giải quyết tranh chấp
      </Typography>

      <Typography sx={{ fontSize: 12, color: "text.secondary", lineHeight: 1.8, mt: 1.5 }}>
        Tiền ký quỹ chỉ được giải ngân khi bạn hài lòng và bấm xác nhận nghiệm thu. Nếu đối tác giao trễ hoặc sản phẩm không đạt tiêu chí brief:
      </Typography>

      <Box sx={{ mt: 1.5, display: "flex", flexDirection: "column", gap: 1 }}>
        <Box sx={{ p: 1.5, bgcolor: "background.default", borderRadius: "10px", border: "1px solid", borderColor: "divider" }}>
          <Typography sx={{ fontSize: 11.5, fontWeight: 700, color: "text.primary" }}>
            1. Yêu cầu chỉnh sửa trong phạm vi
          </Typography>
          <Typography sx={{ fontSize: 11, lineHeight: 1.6, color: "text.secondary", mt: 0.5 }}>
            Bạn có thể gửi phản hồi yêu cầu bên thực hiện điều chỉnh theo đúng số lượt thỏa thuận trước khi duyệt mốc.
          </Typography>
        </Box>

        <Box sx={{ p: 1.5, bgcolor: "background.default", borderRadius: "10px", border: "1px solid", borderColor: "divider" }}>
          <Typography sx={{ fontSize: 11.5, fontWeight: 700, color: "text.primary" }}>
            2. Trọng tài phân xử FREVO
          </Typography>
          <Typography sx={{ fontSize: 11, lineHeight: 1.6, color: "text.secondary", mt: 0.5 }}>
            Khi phát sinh bất đồng, ban quản trị FREVO sẽ hỗ trợ đối soát dựa trên brief, thỏa thuận và lịch sử trao đổi.
          </Typography>
        </Box>
      </Box>

      {chatPath && (
        <Button
          component={Link}
          to={chatPath}
          startIcon={<MessageSquareText size={14} />}
          fullWidth
          sx={{ mt: 2, bgcolor: "background.default", color: "text.primary", fontSize: 11, border: "1px solid", borderColor: "divider" }}
        >
          Trao đổi qua kênh chat dự án
        </Button>
      )}
    </Paper>
  );
}
