import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Menu, HelpCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    <TooltipProvider>
      <div className="space-y-6 mb-8 animate-fade-in">
        <div className="flex items-center justify-between gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onPrevious}
                disabled={currentIndex === 0}
                className="transition-transform hover:scale-105"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Catégorie précédente
            </TooltipContent>
          </Tooltip>
          
          <div className="flex-1 text-center">
            <div className="flex items-center justify-center gap-4">
              <h2 className="text-xl font-bold">{categoryName}</h2>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="group">
                    <HelpCircle className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Sélectionnez votre nominé favori dans cette catégorie</p>
                </TooltipContent>
              </Tooltip>
              {categories.length > 0 && (
                <DropdownMenu>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Menu className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      Naviguer vers une catégorie spécifique
                    </TooltipContent>
                  </Tooltip>
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

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onNext}
                disabled={currentIndex === totalCategories - 1}
                className="transition-transform hover:scale-105"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Catégorie suivante
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="bg-card/50 p-6 rounded-lg border border-border backdrop-blur-sm shadow-lg">
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Progression des votes</span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-sm font-bold text-primary cursor-help">
                    {votedCategories} / {totalCategories} catégories votées
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Votez dans toutes les catégories pour compléter votre participation</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="space-y-2">
              <Progress 
                value={progress} 
                className="h-3 bg-secondary"
              />
              <p className="text-xs text-muted-foreground text-center">
                {Math.round(progress)}% complété
              </p>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};