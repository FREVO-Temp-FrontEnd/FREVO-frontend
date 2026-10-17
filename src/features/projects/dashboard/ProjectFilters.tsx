import { Check } from "lucide-react";

const categories = ["Brand identity", "UI/UX", "Nội dung", "Motion"];
const budgetOptions = [{ value: 0, label: "Tất cả" }, { value: 5, label: "Từ 5 triệu" }, { value: 10, label: "Từ 10 triệu" }, { value: 20, label: "Từ 20 triệu" }];

interface ProjectFiltersProps {
  selectedCategories: string[];
  toggleCategory: (category: string) => void;
  minimumBudget: number;
  setMinimumBudget: (budget: number) => void;
  remoteOnly: boolean;
  setRemoteOnly: (remoteOnly: boolean) => void;
  hasFilters: boolean;
  clearFilters: () => void;
}

export function ProjectFilters({ selectedCategories, toggleCategory, minimumBudget, setMinimumBudget, remoteOnly, setRemoteOnly, hasFilters, clearFilters }: ProjectFiltersProps) {
  return (
    <section className="discovery-filters" aria-label="Bộ lọc dự án">
      <div className="filter-chip-row">
        <span className="filter-label">Lĩnh vực:</span>
        {categories.map((category) => {
          const selected = selectedCategories.includes(category);
          return <button key={category} type="button" className={`filter-chip ${selected ? "is-selected" : ""}`} aria-pressed={selected} onClick={() => toggleCategory(category)}>{category} {selected && <Check size={13} strokeWidth={2.5} aria-hidden="true" />}</button>;
        })}
      </div>
      <div className="filter-chip-row filter-chip-row-bottom">
        <span className="filter-label">Ngân sách:</span>
        {budgetOptions.map((option) => <button key={option.value} type="button" className={`budget-chip ${minimumBudget === option.value ? "is-selected" : ""}`} aria-pressed={minimumBudget === option.value} onClick={() => setMinimumBudget(option.value)}>{option.label}</button>)}
        <label className="filter-remote"><input type="checkbox" checked={remoteOnly} onChange={(event) => setRemoteOnly(event.target.checked)} />Làm việc từ xa</label>
        <button className="clear-filters" type="button" disabled={!hasFilters} onClick={clearFilters}>Xóa bộ lọc</button>
      </div>
    </section>
  );
}
