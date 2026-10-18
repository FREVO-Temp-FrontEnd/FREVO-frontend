import React from "react";
import {
  Box,
  Typography,
  Paper,
  RadioGroup,
  Radio,
  Avatar,
  Chip,
} from "@mui/material";
import { useAuthSession } from "@/lib/hooks/useAuthSession";

interface TeamContextToggleProps {
  onContextSwitched?: (identity: "individual" | "team") => void;
}

export const TeamContextToggle: React.FC<TeamContextToggleProps> = ({
  onContextSwitched,
}) => {
  const { user, actingIdentity, switchActingIdentity } = useAuthSession();
  const currentIdentity = actingIdentity?.type || "individual";

  const handleSwitch = (val: "individual" | "team") => {
    switchActingIdentity({
      type: val,
      teamId: val === "team" ? "may-creative" : undefined,
      teamName: val === "team" ? "Mây Creative" : undefined,
      roleInTeam: val === "team" ? "Trưởng nhóm (Team Leader)" : undefined,
    });
    if (onContextSwitched) {
      onContextSwitched(val);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: "14px",
        bgcolor: "#ffffff",
        border: "1px solid #e2e8f0",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#1e293b" }}>
            Tư cách hoạt động trên FREVO (AUTH-004 / TEAM-004)
          </Typography>
          <Typography variant="caption" sx={{ color: "#64748b" }}>
            Lựa chọn tư cách đại diện khi nộp hồ sơ ứng tuyển hoặc tạo đề xuất thỏa thuận (FR-026, BR-003).
          </Typography>
        </Box>
        <Chip
          label={currentIdentity === "team" ? "Đang là: Đại diện Team" : "Đang là: Cá nhân"}
          size="small"
          sx={{
            bgcolor: currentIdentity === "team" ? "#ede9fe" : "#f1f5f9",
            color: currentIdentity === "team" ? "#7c3aed" : "#475569",
            fontWeight: 700,
            fontSize: "11px",
          }}
        />
      </Box>

      <RadioGroup
        value={currentIdentity}
        onChange={(e) => handleSwitch(e.target.value as "individual" | "team")}
        sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
      >
        <Box
          onClick={() => handleSwitch("individual")}
          sx={{
            p: 1.5,
            px: 2,
            borderRadius: "10px",
            border: currentIdentity === "individual" ? "2px solid #f4490b" : "1px solid #e2e8f0",
            bgcolor: currentIdentity === "individual" ? "#fffaf7" : "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
            transition: "all 0.15s ease",
            "&:hover": { borderColor: "#f4490b" },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar sx={{ width: 36, height: 36, bgcolor: "#f4490b", fontSize: "14px", fontWeight: 700 }}>
              MA
            </Avatar>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 700, color: "#1e293b" }}>
                Freelancer Cá nhân
              </Typography>
              <Typography variant="caption" sx={{ color: "#64748b" }}>
                {user?.name || "Minh Anh"} · Brand & Product Designer
              </Typography>
            </Box>
          </Box>
          <Radio
            checked={currentIdentity === "individual"}
            size="small"
            sx={{ color: "#f4490b", "&.Mui-checked": { color: "#f4490b" } }}
          />
        </Box>

        <Box
          onClick={() => handleSwitch("team")}
          sx={{
            p: 1.5,
            px: 2,
            borderRadius: "10px",
            border: currentIdentity === "team" ? "2px solid #7c3aed" : "1px solid #e2e8f0",
            bgcolor: currentIdentity === "team" ? "#fbfaff" : "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
            transition: "all 0.15s ease",
            "&:hover": { borderColor: "#7c3aed" },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar sx={{ width: 36, height: 36, bgcolor: "#7c3aed", fontSize: "14px", fontWeight: 700 }}>
              MC
            </Avatar>
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: "#1e293b" }}>
                  Mây Creative (Đại diện Team)
                </Typography>
                <Chip
                  label="Team 3 người"
                  size="small"
                  sx={{ height: 18, fontSize: "10px", bgcolor: "#ede9fe", color: "#6d28d9" }}
                />
              </Box>
              <Typography variant="caption" sx={{ color: "#64748b" }}>
                Tài khoản đại diện trao đổi và ký thỏa thuận hợp tác (BR-003)
              </Typography>
            </Box>
          </Box>
          <Radio
            checked={currentIdentity === "team"}
            size="small"
            sx={{ color: "#7c3aed", "&.Mui-checked": { color: "#7c3aed" } }}
          />
        </Box>
      </RadioGroup>
    </Paper>
  );
};
