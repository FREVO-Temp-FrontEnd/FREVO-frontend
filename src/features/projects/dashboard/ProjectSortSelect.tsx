import { Box, MenuItem, Select } from "@mui/material";
import { ArrowDownUp, ChevronDown } from "lucide-react";
import type { SortMode } from "@/lib/types/project.types";

interface ProjectSortSelectProps {
  value: SortMode;
  onChange: (value: SortMode) => void;
}

const sortLabels: Record<SortMode, string> = { newest: "Mới nhất", budget: "Ngân sách cao", deadline: "Hạn gần nhất" };

export function ProjectSortSelect({ value, onChange }: ProjectSortSelectProps) {
  return (
    <Select
      value={value}
      onChange={(event) => onChange(event.target.value as SortMode)}
      inputProps={{ "aria-label": "Sắp xếp" }}
      IconComponent={ChevronDown}
      renderValue={(selected) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, fontSize: 14, "& > svg": { flexShrink: 0 } }}>
          <ArrowDownUp size={17} strokeWidth={1.5} aria-hidden="true" />
          <Box component="span">Sắp xếp:</Box>
          <Box component="span" sx={{ fontWeight: 600 }}>{sortLabels[selected]}</Box>
        </Box>
      )}
      sx={{
        flexShrink: 0,
        width: "100%",
        minWidth: 0,
        height: 48,
        bgcolor: "background.paper",
        borderRadius: "8px",
        "& .MuiSelect-select": { py: 1.25 },
        "& .MuiSelect-icon": { width: 18, height: 18, right: 12 },
        "& .MuiOutlinedInput-notchedOutline": { borderColor: "divider" },
      }}
    >
      <MenuItem value="newest">Mới nhất</MenuItem>
      <MenuItem value="budget">Ngân sách cao</MenuItem>
      <MenuItem value="deadline">Hạn gần nhất</MenuItem>
    </Select>
  );
}
