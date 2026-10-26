import { Box, Paper, Typography } from "@mui/material";
import { ShieldQuestion } from "lucide-react";

export function DisputeConceptCard() {
  return <Paper elevation={0} sx={{ p: 2.75, borderRadius: "16px", border: "1px solid", borderColor: "divider" }}><Typography component="h2" className="flex items-center gap-2" sx={{ fontFamily: "h3.fontFamily", fontSize: 15, fontWeight: 700 }}><ShieldQuestion size={18} />Khi có vấn đề phát sinh</Typography><Typography sx={{ fontSize: 12, color: "text.secondary", lineHeight: 1.85, mt: 1.5 }}>Quy trình khiếu nại, hoàn tiền và phân xử đang được xây dựng. Hai bên có thể tiếp tục trao đổi qua kênh chat dự án.</Typography><Box sx={{ mt: 2, p: 1.5, bgcolor: "background.default", borderRadius: "10px" }}><Typography sx={{ fontSize: 10, lineHeight: 1.8, color: "text.secondary" }}>Thông tin tham khảo trong prototype. Chưa thực hiện xử lý hoàn tiền hoặc phân xử thật.</Typography></Box></Paper>;
}
