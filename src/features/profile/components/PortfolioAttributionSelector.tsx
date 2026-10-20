import React from "react";
import {
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
} from "@mui/material";
import { User, Users, Info } from "lucide-react";

interface PortfolioAttributionSelectorProps {
  attribution: "Cá nhân" | "Team";
  teamRole?: string;
  onAttributionChange: (val: "Cá nhân" | "Team") => void;
  onRoleChange: (val: string) => void;
}

export const PortfolioAttributionSelector: React.FC<PortfolioAttributionSelectorProps> = ({
  attribution,
  teamRole = "",
  onAttributionChange,
  onRoleChange,
}) => {
  return (
    <Box sx={{ my: 2, p: 2, bgcolor: "#f8fafc", borderRadius: "10px", border: "1px solid", borderColor: "divider" }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#1e293b", mb: 0.5 }}>
        Hình thức thực hiện & Đóng góp (BR-027)
      </Typography>
      <Typography variant="caption" sx={{ color: "#64748b", display: "block", mb: 1.5 }}>
        Minh bạch vai trò cá nhân khi tham gia dự án độc lập hoặc cùng đội nhóm sáng tạo.
      </Typography>

      <RadioGroup
        row
        value={attribution}
        onChange={(e) => onAttributionChange(e.target.value as "Cá nhân" | "Team")}
        sx={{ mb: 1.5 }}
      >
        <FormControlLabel
          value="Cá nhân"
          control={<Radio size="small" sx={{ color: "#f4490b", "&.Mui-checked": { color: "#f4490b" } }} />}
          label={
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <User size={16} />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Cá nhân (Solo Project)
              </Typography>
            </Box>
          }
        />
        <FormControlLabel
          value="Team"
          control={<Radio size="small" sx={{ color: "#f4490b", "&.Mui-checked": { color: "#f4490b" } }} />}
          label={
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <Users size={16} />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Team / Nhóm sáng tạo
              </Typography>
            </Box>
          }
        />
      </RadioGroup>

      {attribution === "Team" && (
        <Box sx={{ mt: 1 }}>
          <TextField
            fullWidth
            size="small"
            label="Vai trò cụ thể trong team *"
            placeholder="Ví dụ: Lead Designer, Art Director, Visual Strategist..."
            value={teamRole}
            onChange={(e) => onRoleChange(e.target.value)}
            helperText="Nêu rõ phần việc hoặc sản phẩm trực tiếp do bạn phụ trách trong dự án nhóm."
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                "&.Mui-focused fieldset": { borderColor: "#f4490b" },
              },
            }}
          />
        </Box>
      )}

      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
        <Info size={14} color="#64748b" />
        <Typography variant="caption" sx={{ color: "#64748b" }}>
          Thông tin thuộc tính này sẽ được hiển thị trên thẻ minh chứng năng lực khi Doanh nghiệp xem hồ sơ.
        </Typography>
      </Box>
    </Box>
  );
};
