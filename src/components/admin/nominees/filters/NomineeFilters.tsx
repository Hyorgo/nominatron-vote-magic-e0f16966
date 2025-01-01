import { Category } from "@/types/nominees";
import { FilterBar } from "./FilterBar";
import { logger } from '@/services/monitoring/logger';

interface NomineeFiltersProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortOrder: "name" | "date";
  onSortChange: (value: "name" | "date") => void;
}

export const NomineeFilters = ({
  categories,
  selectedCategory,
  onCategoryChange,
  searchTerm,
  onSearchChange,
  sortOrder,
  onSortChange,
}: NomineeFiltersProps) => {
  const handleCategoryChange = (categoryId: string) => {
    logger.info('Changement de catégorie:', {
      previousCategory: selectedCategory,
      newCategory: categoryId,
      availableCategories: categories.map(c => ({
        id: c.id,
        name: c.name
      }))
    });
    onCategoryChange(categoryId);
  };

  return (
    <FilterBar
      categories={categories}
      selectedCategory={selectedCategory}
      onCategoryChange={handleCategoryChange}
      searchTerm={searchTerm}
      onSearchChange={onSearchChange}
      sortOrder={sortOrder}
      onSortChange={onSortChange}
    />
  );
};