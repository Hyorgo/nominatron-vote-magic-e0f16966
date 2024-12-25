import { NavigationButtons } from "./navigation/NavigationButtons";
import { CategoryTitle } from "./navigation/CategoryTitle";
import { VotingProgress } from "./navigation/VotingProgress";
import { TooltipProvider } from "@/components/ui/tooltip";

interface CategoryNavigationProps {
  categoryName: string;
  currentIndex: number;
  totalCategories: number;
  votedCategories: number;
  onPrevious: () => void;
  onNext: () => void;
  onSelectCategory?: (index: number) => void;
  categories?: { name: string }[];
}

export const CategoryNavigation = ({
  categoryName,
  currentIndex,
  totalCategories,
  votedCategories,
  onPrevious,
  onNext,
  onSelectCategory,
  categories = [],
}: CategoryNavigationProps) => {
  return (
    <TooltipProvider>
      <div className="space-y-8 mb-12 animate-fade-in">
        <div className="flex items-center justify-between gap-4">
          <NavigationButtons
            currentIndex={currentIndex}
            totalCategories={totalCategories}
            onPrevious={onPrevious}
            onNext={onNext}
          />
          
          <CategoryTitle
            categoryName={categoryName}
            currentIndex={currentIndex}
            totalCategories={totalCategories}
            categories={categories}
            onSelectCategory={onSelectCategory}
          />

          <NavigationButtons
            currentIndex={currentIndex}
            totalCategories={totalCategories}
            onPrevious={onPrevious}
            onNext={onNext}
          />
        </div>

        <VotingProgress
          votedCategories={votedCategories}
          totalCategories={totalCategories}
        />
      </div>
    </TooltipProvider>
  );
};