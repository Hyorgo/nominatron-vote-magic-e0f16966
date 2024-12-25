import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CategoryNavigationProps {
  categoryName: string;
  currentIndex: number;
  totalCategories: number;
  onPrevious: () => void;
  onNext: () => void;
}

export const CategoryNavigation = ({
  categoryName,
  currentIndex,
  totalCategories,
  onPrevious,
  onNext,
}: CategoryNavigationProps) => {
  return (
    <div className="category-nav mb-8">
      <Button
        variant="ghost"
        size="icon"
        onClick={onPrevious}
        disabled={currentIndex === 0}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <div className="flex-1 text-center">
        <h2 className="text-xl font-bold">{categoryName}</h2>
        <p className="text-sm text-muted-foreground">
          Catégorie {currentIndex + 1} sur {totalCategories}
        </p>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={onNext}
        disabled={currentIndex === totalCategories - 1}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};