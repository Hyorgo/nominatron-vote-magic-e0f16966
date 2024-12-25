import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

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
  const progress = (votedCategories / totalCategories) * 100;

  return (
    <div className="space-y-6 mb-8 animate-fade-in">
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onPrevious}
          disabled={currentIndex === 0}
          className="transition-transform hover:scale-105"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex-1 text-center">
          <div className="flex items-center justify-center gap-4">
            <h2 className="text-xl font-bold">{categoryName}</h2>
            {categories.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {categories.map((category, index) => (
                    <DropdownMenuItem
                      key={index}
                      onClick={() => onSelectCategory?.(index)}
                      className="cursor-pointer"
                    >
                      {category.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Catégorie {currentIndex + 1} sur {totalCategories}
          </p>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={onNext}
          disabled={currentIndex === totalCategories - 1}
          className="transition-transform hover:scale-105"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Progression</span>
          <span className="font-medium">
            {votedCategories} / {totalCategories} catégories
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
    </div>
  );
};