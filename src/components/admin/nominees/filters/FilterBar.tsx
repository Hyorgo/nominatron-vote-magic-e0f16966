import { CategoryFilter } from "./CategoryFilter";
import { SearchSortBar } from "../SearchSortBar";
import { Category } from "@/types/nominees";

interface FilterBarProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortOrder: "name" | "date";
  onSortChange: (value: "name" | "date") => void;
}

export const FilterBar = ({
  categories,
  selectedCategory,
  onCategoryChange,
  searchTerm,
  onSearchChange,
  sortOrder,
  onSortChange,
}: FilterBarProps) => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      <div className="w-full md:w-1/3">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
        />
      </div>
      <div className="flex-1">
        <SearchSortBar
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          sortOrder={sortOrder}
          onSortChange={onSortChange}
        />
      </div>
    </div>
  );
};