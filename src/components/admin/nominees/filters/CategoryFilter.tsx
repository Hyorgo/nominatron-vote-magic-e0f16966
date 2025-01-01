import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trophy } from "lucide-react";
import { Category } from "@/types/nominees";
import { logger } from '@/services/monitoring/logger';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
}

export const CategoryFilter = ({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) => {
  const handleCategoryChange = (value: string) => {
    logger.info('Sélection de catégorie:', value);
    onCategoryChange(value);
  };

  return (
    <Select
      value={selectedCategory}
      onValueChange={handleCategoryChange}
    >
      <SelectTrigger>
        <SelectValue placeholder="Filtrer par catégorie" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-muted-foreground" />
            Toutes les catégories
          </div>
        </SelectItem>
        {categories.map((category) => (
          <SelectItem key={category.id} value={category.id}>
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-gold" />
              {category.name}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};