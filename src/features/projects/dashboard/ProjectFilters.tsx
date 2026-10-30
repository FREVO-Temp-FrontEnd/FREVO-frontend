import { Box, Button, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { RotateCcw } from "lucide-react";
import type { SortMode } from "@/lib/types/project.types";
import { FilterOptionRail } from "./FilterOptionRail";
import { ProjectSortSelect } from "./ProjectSortSelect";

const categories = ["Brand identity", "UI/UX", "Nội dung", "Motion"];
const budgetOptions = [{ value: 0, label: "Tất cả" }, { value: 5, label: "Từ 5 triệu" }, { value: 10, label: "Từ 10 triệu" }, { value: 20, label: "Từ 20 triệu" }];

const FilterPill = styled(Button)(({ theme }) => ({
  minHeight: 44,
  padding: theme.spacing(1, 2),
  border: "1px solid var(--surface-border)",
  borderRadius: 999,
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.secondary,
  fontSize: 14,
  fontWeight: 500,
  whiteSpace: "nowrap",
  lineHeight: 1.4,
  transition: theme.transitions.create(["background-color", "color"], { duration: 150 }),
  "&:hover": { backgroundColor: theme.palette.action.focus },
  '&[aria-pressed="true"]': {
    backgroundColor: "#fff0e9",
    borderColor: "#efc7b6",
    color: theme.palette.primary.dark,
    fontWeight: 700,
  },
  "&.Mui-focusVisible": {
    outline: `2px solid ${theme.palette.primary.dark}`,
    outlineOffset: 2,
  },
  "@media (prefers-reduced-motion: reduce)": { transition: "none" },
}));

interface ProjectFiltersProps {
  sortMode: SortMode;
  setSortMode: (value: SortMode) => void;
  selectedCategories: string[];
  toggleCategory: (category: string) => void;
  minimumBudget: number;
  setMinimumBudget: (budget: number) => void;
  hasFilters: boolean;
  clearFilters: () => void;
}

export function ProjectFilters({ sortMode, setSortMode, selectedCategories, toggleCategory, minimumBudget, setMinimumBudget, hasFilters, clearFilters }: ProjectFiltersProps) {
  const filterSummary = [
    ...selectedCategories,
    minimumBudget > 0 ? `Ngân sách từ ${minimumBudget} triệu` : "",
  ].filter(Boolean).join(", ");

  return (
    <Box component="section" aria-label="Bộ lọc dự án" sx={{ mt: 3, p: { xs: 2, sm: 2.5 }, bgcolor: "background.paper", border: "1px solid var(--surface-border)", borderRadius: "13px", display: "grid", gap: 1.5, minWidth: 0, containerType: "inline-size" }}>
      <Box sx={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", alignItems: "center", gap: 0.5, "@container (min-width: 500px)": { gridTemplateColumns: "90px minmax(0, 1fr)", gap: 1.5 } }}>
        <Typography component="h2" sx={{ fontSize: 14, fontWeight: 600, color: "text.secondary", whiteSpace: "nowrap" }}>Lĩnh vực</Typography>
        <FilterOptionRail label="Lĩnh vực" resetScroll={selectedCategories.length === 0}>
          <FilterPill aria-pressed={selectedCategories.length === 0} onClick={() => selectedCategories.forEach(toggleCategory)}>Tất cả</FilterPill>
          {categories.map((category) => (
            <FilterPill key={category} aria-pressed={selectedCategories.includes(category)} onClick={() => toggleCategory(category)}>{category}</FilterPill>
          ))}
        </FilterOptionRail>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", alignItems: "center", gap: 1, "@container (min-width: 500px)": { gridTemplateColumns: "270px minmax(0, 1fr)", gap: 1.5 } }}>
        <ProjectSortSelect value={sortMode} onChange={setSortMode} />
        <FilterOptionRail label="Ngân sách" resetScroll={minimumBudget === 0} splitControls>
          {budgetOptions.map((option) => (
            <FilterPill key={option.value} aria-pressed={minimumBudget === option.value} onClick={() => setMinimumBudget(option.value)}>{option.label}</FilterPill>
          ))}
        </FilterOptionRail>
      </Box>

      {hasFilters && <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1.5 }}>
        <Typography sx={{ fontSize: 14, color: "text.primary", minWidth: 0 }}>Đang lọc: {filterSummary}</Typography>
        <Button onClick={clearFilters} startIcon={<RotateCcw size={14} strokeWidth={1.5} aria-hidden="true" />} sx={{ flexShrink: 0, minHeight: 44, fontSize: 14, color: "primary.dark", whiteSpace: "nowrap" }}>Xóa bộ lọc</Button>
      </Box>}
    </Box>
  );
}
