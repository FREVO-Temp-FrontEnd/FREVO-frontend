import { Checkbox } from "@/app/shared/components/ui/checkbox";

const categories = ["Brand identity", "UI/UX", "Nội dung", "Motion"];
const budgetOptions = [
  { value: 0, label: "Tất cả" },
  { value: 5, label: "Từ 5 triệu" },
  { value: 10, label: "Từ 10 triệu" },
  { value: 20, label: "Từ 20 triệu" },
];

interface ProjectFiltersProps {
  filtersOpen: boolean;
  setFiltersOpen: (open: boolean | ((val: boolean) => boolean)) => void;
  selectedCategories: string[];
  toggleCategory: (category: string) => void;
  minimumBudget: number;
  setMinimumBudget: (budget: number) => void;
  remoteOnly: boolean;
  setRemoteOnly: (remoteOnly: boolean) => void;
  hasFilters: boolean;
  clearFilters: () => void;
}

export function ProjectFilters({
  filtersOpen,
  setFiltersOpen,
  selectedCategories,
  toggleCategory,
  minimumBudget,
  setMinimumBudget,
  remoteOnly,
  setRemoteOnly,
  hasFilters,
  clearFilters,
}: ProjectFiltersProps) {
  return (
    <aside
      className={`filter-rail ${filtersOpen ? "open" : ""}`}
      aria-label="Bộ lọc dự án"
    >
      <button
        className="filter-toggle"
        type="button"
        aria-expanded={filtersOpen}
        aria-controls="filters-panel"
        onClick={() => setFiltersOpen((value) => !value)}
      >
        Bộ lọc <span aria-hidden="true">{filtersOpen ? "−" : "+"}</span>
      </button>
      <div id="filters-panel" className="filters-panel">
        <div className="filters-heading">
          <h2>Bộ lọc</h2>
          <button type="button" disabled={!hasFilters} onClick={clearFilters}>
            Xóa bộ lọc
          </button>
        </div>
        <fieldset className="filter-group category-group">
          <legend>LĨNH VỰC</legend>
          {categories.map((category) => (
            <label key={category}>
              <Checkbox
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => toggleCategory(category)}
                aria-label={category}
              />{" "}
              <span>{category}</span>
            </label>
          ))}
        </fieldset>
        <fieldset className="filter-group budget-group">
          <legend>NGÂN SÁCH TỐI THIỂU</legend>
          {budgetOptions.map((option) => (
            <label key={option.value}>
              <input
                type="radio"
                name="budget"
                checked={minimumBudget === option.value}
                onChange={() => setMinimumBudget(option.value)}
              />{" "}
              <span>{option.label}</span>
            </label>
          ))}
        </fieldset>
        <label className="remote-row">
          <span>Làm việc từ xa</span>
          <Checkbox
            role="switch"
            checked={remoteOnly}
            onCheckedChange={(checked) => setRemoteOnly(checked === true)}
            aria-label="Chỉ dự án làm việc từ xa"
          />
        </label>
      </div>
    </aside>
  );
}
